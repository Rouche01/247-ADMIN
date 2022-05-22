export const formatNum = (num, isCurrency) => {
  if (num > 9999 && num < 1000000) {
    return isCurrency
      ? `${(num / 1000).toLocaleString("en-NG", {
          currency: "NGN",
          style: "currency",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })} K`
      : `${(num / 1000).toLocaleString("en-NG")} K`;
  } else if (num > 1000000) {
    return isCurrency
      ? `${(num / 1000000).toLocaleString("en-NG", {
          currency: "NGN",
          style: "currency",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })} M`
      : `${(num / 1000000).toLocaleString("en-NG")} M`;
  } else {
    return isCurrency
      ? num.toLocaleString("en-NG", {
          currency: "NGN",
          style: "currency",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      : num.toLocaleString("en-NG");
  }
};
