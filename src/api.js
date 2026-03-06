// src/api.js

const isDev = process.env.NODE_ENV === "development";

export const API = {
  trending: isDev
    ? "https://api.coingecko.com/api/v3/search/trending"
    : "/.netlify/functions/trending",

  markets: isDev
    ? "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    : "/.netlify/functions/markets",

  coin: (id) =>
    isDev
      ? `https://api.coingecko.com/api/v3/coins/${id}?localization=false&sparkline=true`
      : `/.netlify/functions/coin?id=${id}`,
};