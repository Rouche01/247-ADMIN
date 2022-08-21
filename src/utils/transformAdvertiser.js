export const calculateTotalAdSpend = (advertiser) => {
  return advertiser.campaigns
    .map((campaign) => campaign?.campaignStat?.adSpend?.amountInKobo || 0)
    .reduce((prev, curr) => prev + curr, 0);
};

export const calculateTotalImpression = (advertiser) => {
  return advertiser.campaigns
    .map((campaign) => campaign.campaignStat.impressions)
    .reduce((prev, curr) => prev + curr, 0);
};
