import { confirmButton, errorText, rateText, swapForm } from "./dom.js";
import { attachEvents } from "./events.js";
import { fetchPrices } from "./data.js";
import { calculate } from "./calculator.js";
import { populatePickers } from "./tokenList.js";
import { setPrices } from "./state.js";
import { setStatus } from "./utils.js";

const init = async () => {
  setStatus("Loading prices…", false);
  swapForm.classList.add("is-loading");
  attachEvents();
  try {
    const prices = await fetchPrices();
    if (!prices.length) {
      throw new Error("No prices available.");
    }

    setPrices(prices);
    populatePickers(prices);
    calculate();
    setStatus("Live prices", true);
  } catch (error) {
    setStatus("Prices unavailable", false);
    errorText.textContent = "Unable to load prices. Please retry later.";
    confirmButton.disabled = true;
    rateText.textContent = "Pricing service offline";
  } finally {
    swapForm.classList.remove("is-loading");
  }
};

init();
