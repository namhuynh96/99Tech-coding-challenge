import { ICON_URL } from "./constants.js";
import { statusBadge } from "./dom.js";

export const formatNumber = (value, digits = 6) => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
};

export const sanitizeNumberInput = (value) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
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
