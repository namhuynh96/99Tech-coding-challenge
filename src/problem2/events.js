import {
  inputAmount,
  outputAmount,
  inputTokenPicker,
  outputTokenPicker,
  inputTokenButton,
  outputTokenButton,
  inputTokenSearch,
  outputTokenSearch,
  inputTokenList,
  outputTokenList,
  swapButton,
} from "./dom.js";
import { setActiveField, setSelected, state } from "./state.js";
import { isAllowedNumberKey, sanitizeNumberInput } from "./utils.js";
import { calculate } from "./calculator.js";
import { renderTokenList, updateTokenDisplay } from "./tokenList.js";

export const attachEvents = () => {
  inputAmount.addEventListener("input", () => {
    inputAmount.value = sanitizeNumberInput(inputAmount.value);
    setActiveField("input");
    calculate();
  });

  inputAmount.addEventListener("keydown", (event) => {
    if (!isAllowedNumberKey(event)) {
      event.preventDefault();
    }
  });

  outputAmount.addEventListener("input", () => {
    outputAmount.value = sanitizeNumberInput(outputAmount.value);
    setActiveField("output");
    calculate();
  });

  outputAmount.addEventListener("keydown", (event) => {
    if (!isAllowedNumberKey(event)) {
      event.preventDefault();
    }
  });

  inputTokenButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    inputTokenPicker.classList.toggle("open");
    inputTokenButton.setAttribute(
      "aria-expanded",
      inputTokenPicker.classList.contains("open")
    );
    renderTokenList("input", inputTokenSearch.value);
    inputTokenSearch.focus();
  });

  outputTokenButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    outputTokenPicker.classList.toggle("open");
    outputTokenButton.setAttribute(
      "aria-expanded",
      outputTokenPicker.classList.contains("open")
    );
    renderTokenList("output", outputTokenSearch.value);
    outputTokenSearch.focus();
  });

  inputTokenSearch.addEventListener("input", (event) => {
    renderTokenList("input", event.target.value);
  });

  outputTokenSearch.addEventListener("input", (event) => {
    renderTokenList("output", event.target.value);
  });

  inputTokenList.addEventListener("click", (event) => {
    event.stopPropagation();
    const button = event.target.closest("button[data-symbol]");
    if (!button) return;
    setSelected("input", button.dataset.symbol);
    updateTokenDisplay("input");
    inputTokenPicker.classList.remove("open");
    inputTokenButton.setAttribute("aria-expanded", "false");
    calculate();
  });

  outputTokenList.addEventListener("click", (event) => {
    event.stopPropagation();
    const button = event.target.closest("button[data-symbol]");
    if (!button) return;
    setSelected("output", button.dataset.symbol);
    updateTokenDisplay("output");
    outputTokenPicker.classList.remove("open");
    outputTokenButton.setAttribute("aria-expanded", "false");
    calculate();
  });

  swapButton.addEventListener("click", () => {
    const fromValue = state.selected.input;
    setSelected("input", state.selected.output);
    setSelected("output", fromValue);
    updateTokenDisplay("input");
    updateTokenDisplay("output");
    calculate();
  });

  inputTokenPicker.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  outputTokenPicker.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    inputTokenPicker.classList.remove("open");
    inputTokenButton.setAttribute("aria-expanded", "false");
    outputTokenPicker.classList.remove("open");
    outputTokenButton.setAttribute("aria-expanded", "false");
  });
};
