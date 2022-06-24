import formatDistance from "date-fns/formatDistance";

export const calculateDistance = (end, start) => {
  return formatDistance(new Date(end), new Date(start));
};

export const convertDateToNumber = (date) => {
  return new Date(date).getTime();
};
