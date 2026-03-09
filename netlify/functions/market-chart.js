const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export default async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const vsCurrency = url.searchParams.get('vs_currency') || 'usd';
    const days = url.searchParams.get('days') || '7';

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing coin id' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const upstreamUrl =
      `${COINGECKO_BASE}/coins/${encodeURIComponent(id)}/market_chart` +
      `?vs_currency=${encodeURIComponent(vsCurrency)}` +
      `&days=${encodeURIComponent(days)}`;

    const resp = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'netlify-function',
        Accept: 'application/json',
        'x-cg-demo-api-key': process.env.COINGECKO_KEY,
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