import format from "date-fns/format";
import subDays from "date-fns/subDays";

export const rangeEndDate = format(new Date(), "yyyy/MM/dd");
export const rangeStartDate = format(subDays(new Date(), 7), "yyyy/MM/dd");
