import { useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";

const getUpdatedQueryParams = (key, value) => {
  const query = new URLSearchParams(window.location.search);

  if (!value) {
    query.delete(key);
  } else {
    query.set(key, value);
  }

  return query.toString();
};

export const useURLSearchParam = (paramName = "default") => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return query.get(paramName) || undefined;
};

const useSetQueryParamValue = (paramName = "default") => {
  const history = useHistory();
  const setQueryParamValue = useCallback(
    (value) => {
      const updatedQuery = getUpdatedQueryParams(paramName, value);
      history.replace(
        `${history.location.pathname}${updatedQuery ? `?${updatedQuery}` : ""}`
      );
    },
    [history, paramName]
  );

  return setQueryParamValue;
};

export const useQueryParam = (paramName = "default") => {
  const queryParamValue = useURLSearchParam(paramName);
  const setQueryParamValue = useSetQueryParamValue(paramName);

  console.log(queryParamValue);

  return [queryParamValue, setQueryParamValue];
};

export const useQueryParamWithDefaultValue = (
  paramName = "default",
  defaultValue
) => {
  const [queryParamValue, setQueryParamValue] = useQueryParam(paramName);

  return [queryParamValue || defaultValue, setQueryParamValue];
};
