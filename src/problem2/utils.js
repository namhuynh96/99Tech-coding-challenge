import { ICON_URL } from "./constants.js";
import { statusBadge } from "./dom.js";

const formatWithOptions = (value, digits, useGrouping) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping,
  });

export const formatNumber = (value, digits = 6) => {
  if (!Number.isFinite(value)) return "0";
  return formatWithOptions(value, digits, true);
};

export const formatPlainNumber = (value, digits = 6) => {
  if (!Number.isFinite(value)) return "0";
  return formatWithOptions(value, digits, false);
};

export const sanitizeNumberInput = (value) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  const [whole, ...rest] = parts;
  return `${whole}.${rest.join("")}`;
};

export const isAllowedNumberKey = (event) => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
  ];

  if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
    return true;
  }

  if (event.key === ".") {
    return !event.target.value.includes(".");
  }

  return /^[0-9]$/.test(event.key);
};

export const normalizeSymbol = (symbol) => (symbol || "").trim().toUpperCase();

export const setStatus = (message, isLive = true) => {
  statusBadge.textContent = message;
  statusBadge.style.color = isLive ? "#0a8456" : "#b45309";
  statusBadge.style.background = isLive ? "#e7f8f1" : "#fef3c7";
};

export const setIcon = (img, symbol) => {
  const upper = normalizeSymbol(symbol);
  img.src = `${ICON_URL}${upper}.svg`;
  img.alt = `${upper} icon`;
  img.onerror = () => {
    img.src = "";
    img.alt = "";
  };
};
