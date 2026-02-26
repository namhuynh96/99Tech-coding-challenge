import { ICON_URL } from "./constants.js";
import {
  inputTokenLabel,
  outputTokenLabel,
  inputTokenList,
  outputTokenList,
  inputIcon,
  outputIcon,
} from "./dom.js";
import { state, setSelected } from "./state.js";
import { setIcon } from "./utils.js";

export const updateTokenDisplay = (side) => {
  const symbol = state.selected[side];
  const label = side === "input" ? inputTokenLabel : outputTokenLabel;
  const icon = side === "input" ? inputIcon : outputIcon;
  label.textContent = symbol ? symbol : "Select token";
  if (symbol) {
    setIcon(icon, symbol);
  }
};

export const renderTokenList = (side, filter = "") => {
  const list = side === "input" ? inputTokenList : outputTokenList;
  const query = filter.trim().toUpperCase();
  list.innerHTML = "";

  if (!state.prices.length) {
    const loading = document.createElement("div");
    loading.textContent = "Loading tokens…";
    loading.style.color = "#8b95ac";
    loading.style.fontSize = "13px";
    loading.style.padding = "8px";
    list.appendChild(loading);
    return;
  }

  const filtered = state.prices.filter((token) =>
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

export const populatePickers = (tokens) => {
  setSelected("input", tokens[0]?.symbol || "");
  setSelected("output", tokens[1]?.symbol || tokens[0]?.symbol || "");
  updateTokenDisplay("input");
  updateTokenDisplay("output");
  renderTokenList("input");
  renderTokenList("output");
};
