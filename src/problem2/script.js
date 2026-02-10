const PRICE_URL = "https://interview.switcheo.com/prices.json";
const ICON_URL = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

const inputAmount = document.getElementById("input-amount");
const outputAmount = document.getElementById("output-amount");
const inputTokenPicker = document.getElementById("input-token-picker");
const outputTokenPicker = document.getElementById("output-token-picker");
const inputTokenButton = document.getElementById("input-token-button");
const outputTokenButton = document.getElementById("output-token-button");
const inputTokenLabel = document.getElementById("input-token-label");
const outputTokenLabel = document.getElementById("output-token-label");
const inputTokenSearch = document.getElementById("input-token-search");
const outputTokenSearch = document.getElementById("output-token-search");
const inputTokenList = document.getElementById("input-token-list");
const outputTokenList = document.getElementById("output-token-list");
const inputIcon = document.getElementById("input-token-icon");
const outputIcon = document.getElementById("output-token-icon");
const rateText = document.getElementById("rate-text");
const errorText = document.getElementById("error-text");
const confirmButton = document.getElementById("confirm-button");
const statusBadge = document.getElementById("status-badge");
const swapButton = document.getElementById("swap-button");

let prices = [];
let activeField = "input";
const selected = {
  input: "",
  output: "",
};

const formatNumber = (value, digits = 6) => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
};

const sanitizeNumberInput = (value) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
};

const setStatus = (message, isLive = true) => {
  statusBadge.textContent = message;
  statusBadge.style.color = isLive ? "#0a8456" : "#b45309";
  statusBadge.style.background = isLive ? "#e7f8f1" : "#fef3c7";
};

const normalizeSymbol = (symbol) => (symbol || "").trim().toUpperCase();

const setIcon = (img, symbol) => {
  const upper = normalizeSymbol(symbol);
  img.src = `${ICON_URL}${upper}.svg`;
  img.alt = `${upper} icon`;
  img.onerror = () => {
    img.src = "";
    img.alt = "";
  };
};

const updateTokenDisplay = (side) => {
  const symbol = selected[side];
  const label = side === "input" ? inputTokenLabel : outputTokenLabel;
  const icon = side === "input" ? inputIcon : outputIcon;
  label.textContent = symbol ? symbol : "Select token";
  if (symbol) {
    setIcon(icon, symbol);
  }
};

const renderTokenList = (side, filter = "") => {
  const list = side === "input" ? inputTokenList : outputTokenList;
  const query = filter.trim().toUpperCase();
  list.innerHTML = "";

  if (!prices.length) {
    const loading = document.createElement("div");
    loading.textContent = "Loading tokens…";
    loading.style.color = "#8b95ac";
    loading.style.fontSize = "13px";
    loading.style.padding = "8px";
    list.appendChild(loading);
    return;
  }

  const filtered = prices.filter((token) =>
    token.symbol.includes(query)
  );

  filtered.forEach((token) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "token-option";
    button.dataset.symbol = token.symbol;

    const img = document.createElement("img");
    img.alt = "";
    img.src = `${ICON_URL}${token.symbol}.svg`;
    img.onerror = () => {
      img.src = "";
    };

    const text = document.createElement("span");
    text.textContent = token.symbol;

    const name = document.createElement("span");
    name.textContent = token.name;
    name.style.fontWeight = "400";
    name.style.color = "#7c879c";

    const meta = document.createElement("div");
    meta.style.display = "flex";
    meta.style.flexDirection = "column";
    meta.appendChild(text);
    meta.appendChild(name);

    button.appendChild(img);
    button.appendChild(meta);
    list.appendChild(button);
  });

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.textContent = "No tokens found";
    empty.style.color = "#8b95ac";
    empty.style.fontSize = "13px";
    empty.style.padding = "8px";
    list.appendChild(empty);
  }
};

const populatePickers = (tokens) => {
  selected.input = tokens[0]?.symbol || "";
  selected.output = tokens[1]?.symbol || tokens[0]?.symbol || "";
  updateTokenDisplay("input");
  updateTokenDisplay("output");
  renderTokenList("input");
  renderTokenList("output");
};

const getPrice = (symbol) => {
  const upper = normalizeSymbol(symbol);
  const item = prices.find((entry) => entry.symbol === upper);
  return item ? item.price : null;
};

const calculate = () => {
  const fromSymbol = selected.input;
  const toSymbol = selected.output;
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
  rateText.textContent = `1 ${fromSymbol} ≈ ${formatNumber(rate, 6)} ${toSymbol}`;

  if (activeField === "input") {
    if (!Number.isFinite(inputValue) || inputValue <= 0) {
      confirmButton.disabled = true;
      errorText.textContent = "Enter a valid amount to send.";
      outputAmount.value = "";
      return;
    }
    outputAmount.value = formatNumber(inputValue * rate, 6);
  } else {
    if (!Number.isFinite(outputValue) || outputValue <= 0) {
      confirmButton.disabled = true;
      errorText.textContent = "Enter a valid amount to receive.";
      inputAmount.value = "";
      return;
    }
    inputAmount.value = formatNumber(outputValue / rate, 6);
  }

  confirmButton.disabled = false;
};

const attachEvents = () => {
  inputAmount.addEventListener("input", () => {
    inputAmount.value = sanitizeNumberInput(inputAmount.value);
    activeField = "input";
    calculate();
  });

  outputAmount.addEventListener("input", () => {
    outputAmount.value = sanitizeNumberInput(outputAmount.value);
    activeField = "output";
    calculate();
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
    selected.input = button.dataset.symbol;
    updateTokenDisplay("input");
    inputTokenPicker.classList.remove("open");
    inputTokenButton.setAttribute("aria-expanded", "false");
    calculate();
  });

  outputTokenList.addEventListener("click", (event) => {
    event.stopPropagation();
    const button = event.target.closest("button[data-symbol]");
    if (!button) return;
    selected.output = button.dataset.symbol;
    updateTokenDisplay("output");
    outputTokenPicker.classList.remove("open");
    outputTokenButton.setAttribute("aria-expanded", "false");
    calculate();
  });

  swapButton.addEventListener("click", () => {
    const fromValue = selected.input;
    selected.input = selected.output;
    selected.output = fromValue;
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

const init = async () => {
  setStatus("Loading prices…", false);
  attachEvents();
  try {
    const response = await fetch(PRICE_URL);
    const data = await response.json();
    prices = data
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

    if (!prices.length) {
      throw new Error("No prices available.");
    }

    populatePickers(prices);
    calculate();
    setStatus("Live prices", true);
  } catch (error) {
    setStatus("Prices unavailable", false);
    errorText.textContent = "Unable to load prices. Please retry later.";
    confirmButton.disabled = true;
    rateText.textContent = "Pricing service offline";
  }
};

init();
