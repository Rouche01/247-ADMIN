import { useMemo } from "react";

export const usePagination = (activePage, rowsShown, data) => {
  const indexOfLastItem = useMemo(() => {
    return activePage * rowsShown;
  }, [activePage, rowsShown]);

  const indexOfFirstItem = useMemo(() => {
    return indexOfLastItem - rowsShown;
  }, [indexOfLastItem, rowsShown]);

  const currentList = useMemo(() => {
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [indexOfFirstItem, indexOfLastItem, data]);

  const pages = Math.ceil(data.length / rowsShown);

  return { currentList, indexOfFirstItem, indexOfLastItem, pages };
};
