export const convertToPriceText = (value: number) => {
  return value.toLocaleString("id-ID", {
    currency: "IDR",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
