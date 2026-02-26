import {
  inputAmount,
  outputAmount,
  rateText,
  errorText,
  confirmButton,
} from "./dom.js";
import { state } from "./state.js";
import { formatNumber, formatPlainNumber, normalizeSymbol } from "./utils.js";

const getPrice = (symbol) => {
  const upper = normalizeSymbol(symbol);
  const item = state.prices.find((entry) => entry.symbol === upper);
  return item ? item.price : null;
};

export const calculate = () => {
  const fromSymbol = state.selected.input;
  const toSymbol = state.selected.output;
  const fromPrice = getPrice(fromSymbol);
  const toPrice = getPrice(toSymbol);
  const inputValue = Number(inputAmount.value);
  const outputValue = Number(outputAmount.value);

  errorText.textContent = "";

  if (!fromSymbol || !toSymbol) {
    confirmButton.disabled = true;
    rateText.textContent = "Select two tokens";
    return;
  }

  if (!fromPrice || !toPrice) {
    confirmButton.disabled = true;
    rateText.textContent = "Price unavailable for selected token";
    return;
  }

  if (fromSymbol === toSymbol) {
    confirmButton.disabled = true;
    rateText.textContent = "Choose two different tokens";
    return;
  }

  const rate = fromPrice / toPrice;
  rateText.textContent = `1 ${fromSymbol} ≈ ${formatNumber(
    rate,
    6
  )} ${toSymbol}`;

  if (state.activeField === "input") {
    if (!Number.isFinite(inputValue) || inputValue <= 0) {
      confirmButton.disabled = true;
      errorText.textContent = "Enter a valid amount to send.";
      outputAmount.value = "";
      return;
    }
    outputAmount.value = formatPlainNumber(inputValue * rate, 6);
  } else {
    if (!Number.isFinite(outputValue) || outputValue <= 0) {
      confirmButton.disabled = true;
      errorText.textContent = "Enter a valid amount to receive.";
      inputAmount.value = "";
      return;
    }
    inputAmount.value = formatPlainNumber(outputValue / rate, 6);
  }

  confirmButton.disabled = false;
};
