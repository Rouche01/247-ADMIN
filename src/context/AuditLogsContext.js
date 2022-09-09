import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_CAMPAIGN_AUDIT_LOGS = "fetchingCampaignAuditLogs";
const SET_CAMPAIGN_AUDIT_LOGS = "set_campaign_audit_logs";
const FETCH_CAMPAIGN_AUDITS_ERROR = "fetch_campaign_audit_error";

const auditLogReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_CAMPAIGN_AUDIT_LOGS:
      return { ...state, fetchingCampaignAuditLogs: action.payload };
    case SET_CAMPAIGN_AUDIT_LOGS:
      return { ...state, campaignAuditLogs: action.payload };
    case FETCH_CAMPAIGN_AUDITS_ERROR:
      return { ...state, fetchCampaignAuditsError: action.payload };
    default:
      return state;
  }
};

const getCampaignAuditLogs = (dispatch) => async (campaignId, actions) => {
  let stringifiedActions;

  if (actions & (actions.length > 0)) {
    stringifiedActions = actions.reduce(
      (prev, curr) => `&action=${prev}&action=${curr}`,
      ""
    );
  }

  dispatch({ type: FETCHING_CAMPAIGN_AUDIT_LOGS, payload: true });
  try {
    const response = await adverts247Api.get(
      `/auditlogs/campaign?campaignId=${campaignId}${stringifiedActions}`,
      {
        headers: { Authorization: `Bearer ${resolveToken()}` },
      }
    );

    dispatch({ type: SET_CAMPAIGN_AUDIT_LOGS, payload: response.data });
    dispatch({ type: FETCHING_CAMPAIGN_AUDIT_LOGS, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_CAMPAIGN_AUDITS_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch campaign audit logs. Something went wrong",
      });
    } else {
      dispatch({
        type: FETCH_CAMPAIGN_AUDITS_ERROR,
        payload: "Unable to fetch campaign audit logs. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_CAMPAIGN_AUDIT_LOGS, payload: false });
  }
};

export const { Context, Provider } = createDataContext(
  auditLogReducer,
  {
    fetchingCampaignAuditLogs: false,
    campaignAuditLogs: [],
    fetchCampaignAuditsError: null,
  },
  { getCampaignAuditLogs }
);
