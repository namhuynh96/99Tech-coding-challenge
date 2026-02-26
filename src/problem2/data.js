import { PRICE_URL } from "./constants.js";
import { normalizeSymbol } from "./utils.js";

export const fetchPrices = async () => {
  const response = await fetch(PRICE_URL);
  const data = await response.json();
  return data
    .filter((item) => Number.isFinite(item.price))
    .map((item) => {
      const rawSymbol = item.symbol || item.currency;
      const symbol = normalizeSymbol(rawSymbol);
      if (!symbol) return null;
      return {
        symbol,
        name: symbol,
        price: item.price,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
};
