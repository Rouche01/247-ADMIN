export const DRIVER_APPROVAL_REQUEST = "driver_approval_request";
export const DRIVER_APPROVED = "driver_approved";
export const PAYOUT_REQUEST = "payout_request";
export const PAYOUT_SUCCESS = "payout_success";
export const PAYOUT_FAILED = "payout_failed";
export const GENERAL_BROADCAST = "general_broadcast";
export const CAMPAIGN_FINISHED = "campaign_finished";

export const mapNotificationTypeToAction = {
  [DRIVER_APPROVAL_REQUEST]: {
    actionText: "Approve",
    action: () => {
      console.log("go to approve driver");
    },
  },
  [PAYOUT_REQUEST]: {
    actionText: "Settle",
    action: () => {
      console.log("go to settle driver");
    },
  },
};
