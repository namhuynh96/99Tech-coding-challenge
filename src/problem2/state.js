export const state = {
  prices: [],
  selected: {
    input: "",
    output: "",
  },
  activeField: "input",
};

export const setPrices = (prices) => {
  state.prices = prices;
};

export const setActiveField = (field) => {
  state.activeField = field;
};

export const setSelected = (side, value) => {
  state.selected[side] = value;
};
