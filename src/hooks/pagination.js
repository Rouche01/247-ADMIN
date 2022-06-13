import { useMemo } from "react";

export const usePagination = (activePage, rowsShown, data, dataLength) => {
  const indexOfLastItem = useMemo(() => {
    return activePage * rowsShown;
  }, [activePage, rowsShown]);

  const indexOfFirstItem = useMemo(() => {
    return indexOfLastItem - rowsShown;
  }, [indexOfLastItem, rowsShown]);

  const currentList = useMemo(() => {
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [indexOfFirstItem, indexOfLastItem, data]);

  const pages = Math.ceil(dataLength / rowsShown);

  return { currentList, indexOfFirstItem, indexOfLastItem, pages };
};
