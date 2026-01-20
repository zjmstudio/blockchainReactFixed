// netlify/functions/markets.js

let cachedBody = null;
let cachedAt = 0;

const TTL_MS = 5 * 60 * 1000; // 5 minutes "fresh" in-memory cache
const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=true";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseRetryAfterMs(resp) {
  const ra = resp.headers.get("retry-after");
  if (!ra) return null;

  // retry-after can be seconds or HTTP date. We handle seconds.
  const secs = Number(ra);
  if (Number.isFinite(secs) && secs >= 0) return secs * 1000;

  // If it’s a date, try to parse it.
  const dt = Date.parse(ra);
  if (!Number.isNaN(dt)) {
    const ms = dt - Date.now();
    return ms > 0 ? ms : 0;
  }

  return null;
}

async function fetchWithRetry() {
  // Backoff schedule (ms). We also optionally use Retry-After when present.
  const delays = [0, 800, 1600, 3000];

  let lastStatus = null;
  let lastRetryAfterMs = null;
  let lastText = null;

  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await sleep(delays[i]);

    let resp;
    try {
      resp = await fetch(COINGECKO_URL, {
        headers: {
          "User-Agent": "netlify-function",
          Accept: "application/json",
        },
      });
    } catch (e) {
      // Network error. Keep trying.
      lastStatus = "FETCH_ERROR";
      lastText = String(e);
      continue;
    }

    lastStatus = resp.status;
    lastRetryAfterMs = parseRetryAfterMs(resp);

    if (resp.ok) {
      return { ok: true, status: resp.status, retryAfterMs: null, text: await resp.text() };
    }

    // Read body for non-ok responses (for debugging) but keep it small
    try {
      lastText = await resp.text();
    } catch {
      lastText = null;
    }

    // Retry on rate limit, or transient upstream errors
    if (resp.status === 429 || (resp.status >= 500 && resp.status <= 599)) {
      // If CoinGecko tells us when to retry, respect it (cap so we don’t hang forever)
      if (lastRetryAfterMs != null) {
        await sleep(Math.min(lastRetryAfterMs, 5000));
      }
      continue;
    }

    // Other 4xx: don’t retry
    return { ok: false, status: resp.status, retryAfterMs: lastRetryAfterMs, text: lastText };
  }

  return { ok: false, status: lastStatus ?? 429, retryAfterMs: lastRetryAfterMs, text: lastText };
}

function jsonResponse(bodyText, status, extraHeaders = {}) {
  return new Response(bodyText, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders,
    },
  });
}

export default async () => {
  try {
    const now = Date.now();

    // Serve fresh in-memory cache fast (reduces upstream calls a lot)
    if (cachedBody && now - cachedAt < TTL_MS) {
      return jsonResponse(cachedBody, 200, {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "HIT",
      });
    }

    // Attempt to fetch fresh data
    const result = await fetchWithRetry();

    if (result.ok) {
      cachedBody = result.text;
      cachedAt = now;

      return jsonResponse(cachedBody, 200, {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS",
      });
    }

    // If upstream is throttling/unstable but we have anything cached, serve it (stale)
    if (cachedBody) {
      return jsonResponse(cachedBody, 200, {
        // shorter cache for stale
        "Cache-Control": "public, max-age=30, s-maxage=120",
        "X-Cache": "STALE",
        "X-Upstream-Status": String(result.status),
        ...(result.retryAfterMs != null
          ? { "X-Upstream-Retry-After": String(Math.round(result.retryAfterMs / 1000)) }
          : {}),
      });
    }

    // No cache available, return a structured error
    return jsonResponse(
      JSON.stringify({
        error: "CoinGecko unavailable",
        upstreamStatus: result.status,
      }),
      502,
      { "Cache-Control": "no-store" }
    );
  } catch (err) {
    return jsonResponse(
      JSON.stringify({ error: "Function crashed", details: String(err) }),
      500,
      { "Cache-Control": "no-store" }
    );
  }
};
