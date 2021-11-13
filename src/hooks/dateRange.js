import { useState, useEffect } from "react";
import sub from "date-fns/sub";

export const useDateRange = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const today = new Date();
    const minus7days = sub(today, { days: 7 });
    setDateRange([minus7days, today]);
  }, []);

  return { startDate, endDate, setDateRange };
};
