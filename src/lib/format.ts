export function formatMoney(value: number, decimals = 0) {
  return value.toLocaleString("en-IE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatEuro(value: number, decimals = 2) {
  return `€${formatMoney(value, decimals)}`;
}
