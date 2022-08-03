export const formatNum = (num, isCurrency, atMillion) => {
  if (num > 9999 && num < 1000000) {
    if (atMillion) {
      return isCurrency
        ? num.toLocaleString("en-NG", {
            currency: "NGN",
            style: "currency",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        : num.toLocaleString("en-NG");
    }
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

export const convertSecToHHMMSS = (secondsInput) => {
  const parsedSecs = parseInt(secondsInput, 10);
  const hours = Math.floor(parsedSecs / 3600);
  const minutes = Math.floor((parsedSecs - hours * 3600) / 60);
  const seconds = parsedSecs - hours * 3600 - minutes * 60;

  const hoursOut = hours < 10 ? `0${hours}` : hours;
  const minutesOut = minutes < 10 ? `0${minutes}` : minutes;
  const secondsOut = seconds < 10 ? `0${seconds}` : seconds;

  return `${hoursOut}:${minutesOut}:${secondsOut}`;
};

export const convertSecToMMSS = (secondsInput) => {
  const parsedSecs = parseInt(secondsInput, 10);
  const minutes = Math.floor(parsedSecs / 60);
  const seconds = parsedSecs - minutes * 60;

  const minutesOut = minutes < 10 ? `0${minutes}` : minutes;
  const secondsOut = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutesOut}:${secondsOut}`;
};

export const convertKoboToNaira = (kobo) => kobo / 100;
