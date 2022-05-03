const formatterIDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2
});

export const convertToIDR = (price: number) => formatterIDR.format(price);
