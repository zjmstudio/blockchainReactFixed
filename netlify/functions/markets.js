// netlify/functions/markets.js

let cachedBody = null;
let cachedAt = 0;

const TTL_MS = 5 * 60 * 1000; // 5 minutes
const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=true";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry() {
  const delays = [0, 800, 1600];

  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await sleep(delays[i]);

    const resp = await fetch(COINGECKO_URL, {
      headers: {
        "User-Agent": "netlify-function",
        Accept: "application/json",
      },
    });

    if (resp.ok) {
      return { ok: true, status: resp.status, text: await resp.text() };
    }

    if (resp.status === 429) continue;

    return { ok: false, status: resp.status, text: await resp.text() };
  }

  return { ok: false, status: 429, text: null };
}

export default async () => {
  try {
    const now = Date.now();

    if (cachedBody && now - cachedAt < TTL_MS) {
      return new Response(cachedBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "Access-Control-Allow-Origin": "*",
          "X-Cache": "HIT",
        },
      });
    }

    const result = await fetchWithRetry();

    if (result.ok) {
      cachedBody = result.text;
      cachedAt = now;

      return new Response(cachedBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "Access-Control-Allow-Origin": "*",
          "X-Cache": "MISS",
        },
      });
    }

    if (cachedBody) {
      return new Response(cachedBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=30, s-maxage=120",
          "Access-Control-Allow-Origin": "*",
          "X-Cache": "STALE",
          "X-Upstream-Status": String(result.status),
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "CoinGecko unavailable" }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Function crashed", details: String(err) }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
