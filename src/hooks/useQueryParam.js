import { useCallback, useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import split from "lodash/split";
import join from "lodash/join";
import moment from "moment";

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

  return [queryParamValue, setQueryParamValue];
};

export const useQueryParamWithDefaultValue = (
  paramName = "default",
  defaultValue
) => {
  const [queryParamValue, setQueryParamValue] = useQueryParam(paramName);

  return [queryParamValue || defaultValue, setQueryParamValue];
};

export const useArrayQueryParam = (paramName, seperator = ",") => {
  const [value, setValue] = useQueryParam(paramName);

  const arrayValue = useMemo(() => {
    return value ? split(value, seperator) : undefined;
  }, [value, seperator]);

  const setArrayValue = useCallback(
    (arrayValue) => {
      setValue(arrayValue ? join(arrayValue, seperator) : undefined);
    },
    [seperator, setValue]
  );

  return [arrayValue, setArrayValue];
};

export const useMomentDateArrayQueryParam = (
  paramName,
  seperator = ",",
  format = "yyyy-MM-dd"
) => {
  const [value, setValue] = useQueryParam(paramName);

  const momentDateArrayValue = useMemo(() => {
    if (value) {
      const splitToArray = split(value, seperator);
      splitToArray.map((dateValue) => moment(dateValue));
      return splitToArray;
    } else {
      return undefined;
    }
  }, [seperator, value]);

  const setMomentDateArrayValue = useCallback(
    (momentDateArrayValue) => {
      if (momentDateArrayValue) {
        const transformedDateArray = momentDateArrayValue.map((value) =>
          value.format(format)
        );
        setValue(join(transformedDateArray, seperator));
      } else {
        return undefined;
      }
    },
    [format, seperator, setValue]
  );

  return [momentDateArrayValue, setMomentDateArrayValue];
};

export const useMomentDateQueryParam = (paramName, format = "yyyy-MM-DD") => {
  const [value, setValue] = useQueryParam(paramName);

  const momentDateValue = useMemo(() => {
    const momentValueObj = moment(value);

    return value && momentValueObj.isValid() ? momentValueObj : undefined;
  }, [value]);

  const setMomentDateValue = useCallback(
    (momentDateValue) => {
      setValue(momentDateValue ? momentDateValue.format(format) : undefined);
    },
    [format, setValue]
  );

  return [momentDateValue, setMomentDateValue];
};

export const useMomentDateQueryParamWithDefaultValue = (
  paramName = "default",
  defaultValue
) => {
  const [queryParam, setQueryParam] = useMomentDateQueryParam(paramName);

  return [queryParam || defaultValue, setQueryParam];
};
