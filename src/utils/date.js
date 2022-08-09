import formatDistance from "date-fns/formatDistance";
import differenceInDays from "date-fns/differenceInDays";
import format from "date-fns/format";

export const calculateDistance = (end, start) => {
  return formatDistance(new Date(end), new Date(start));
};

export const calculateDistanceInDays = (end, start) => {
  return differenceInDays(new Date(end), new Date(start));
};

export const convertDateToNumber = (date) => {
  return new Date(date).getTime();
};

export const transformTransactionDate = (dateString) =>
  format(new Date(dateString), "MMM dd, yyyy | HH:mm:ss");

export const transformPlaylistCreateDate = (dateString) =>
  format(new Date(dateString), "dd MMM, yyyy");
