// netlify/functions/coin.js

let cache = new Map(); // coinId -> { body, at }
const TTL_MS = 5 * 60 * 1000;

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url) {
  const delays = [0, 700, 1500, 2500];

  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await sleep(delays[i]);

    const resp = await fetch(url, {
      headers: { "User-Agent": "netlify-function", Accept: "application/json" },
    });

    if (resp.ok) return { ok: true, status: resp.status, text: await resp.text() };
    if (resp.status === 429 || (resp.status >= 500 && resp.status <= 599)) continue;

    return { ok: false, status: resp.status, text: await resp.text() };
  }

  return { ok: false, status: 429, text: null };
}

export default async (req) => {
  try {
    const u = new URL(req.url);
    const coinId = (u.searchParams.get("id") || "").trim().toLowerCase();

    if (!coinId) {
      return jsonResponse(JSON.stringify({ error: "Missing coin id" }), 400, {
        "Cache-Control": "no-store",
      });
    }

    const now = Date.now();
    const hit = cache.get(coinId);

    if (hit && now - hit.at < TTL_MS) {
      return jsonResponse(hit.body, 200, {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "HIT",
      });
    }

    const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
      coinId
    )}?localization=false&sparkline=true`;

    const result = await fetchWithRetry(url);

    if (result.ok) {
      cache.set(coinId, { body: result.text, at: now });
      return jsonResponse(result.text, 200, {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS",
      });
    }

    // Serve stale if we have it
    if (hit?.body) {
      return jsonResponse(hit.body, 200, {
        "Cache-Control": "public, max-age=30, s-maxage=120",
        "X-Cache": "STALE",
        "X-Upstream-Status": String(result.status),
      });
    }

    return jsonResponse(
      JSON.stringify({ error: "CoinGecko unavailable", upstreamStatus: result.status }),
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
