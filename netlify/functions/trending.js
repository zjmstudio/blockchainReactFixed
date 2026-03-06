// netlify/functions/trending.js

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/search/trending';

export default async () => {
  try {
    const resp = await fetch(COINGECKO_URL, {
      headers: {
        'User-Agent': 'netlify-function',
        Accept: 'application/json',
      },
    });

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: 'Upstream error', status: resp.status }),
        {
          status: resp.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const body = await resp.text();

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Function crashed', details: String(err) }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};
