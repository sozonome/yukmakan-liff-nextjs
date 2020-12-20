export const convertToPriceText = (value: number) => {
  return value.toLocaleString("id-ID", {
    currency: "IDR",
    style: "currency",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};
