import * as Yup from "yup";

export const useLoginValidation = () => {
  const validationSchema = Yup.object({
    emailAddress: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: Yup.string().min(7).max(255).required("Password is required"),
  });

  return { validationSchema };
};

export const useCampaignFormValidation = () => {
  const validationSchema = Yup.object({
    campaignName: Yup.string().required("Campaign name is required"),
    advertiserName: Yup.string().required("Advertiser name is required"),
    duration: Yup.array()
      .length(2, "select start and end duration")
      .required("Campaign duration is required"),
    adSpend: Yup.string().required("Ad Spend is required"),
    adType: Yup.object().required("Ad type is required"),
  });

  return { validationSchema };
};

export const useSettlePayoutFormValidation = () => {
  const validationSchema = Yup.object({
    bankName: Yup.string().required("Bank name is required"),
    accountNumber: Yup.string()
      .length(10)
      .required("Account number is required"),
    accountName: Yup.string().required("Account name is required"),
    pendingPayout: Yup.string().required("Enter an amount to payout"),
  });

  return validationSchema;
};
