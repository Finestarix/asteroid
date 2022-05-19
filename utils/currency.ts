const formatterIDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
});

export const convertToIDR = (price: number) => formatterIDR.format(price);
