export const statusFilters = [
  { label: "All", id: "all" },
  { label: "Active", id: "active" },
  { label: "Closed", id: "closed" },
  { label: "Paused", id: "paused" },
];

export const typeFilters = [
  { label: "All Types", value: "all" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

export const driverStatusFilters = [
  { label: "All", id: "all" },
  { label: "Active", id: "approved" },
  { label: "Suspended", id: "suspended" },
  { label: "Pending", id: "pending" },
];

export const ADTYPES = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

export const NOTIFIER_SOCKET_URL =
  "https://2ec4-2001-4dd6-af6b-0-28b6-820a-ab86-f642.ngrok.io/notifier";

export const NOTIFICATION_EVENTS = {
  JOIN: "notification::join",
  DRIVER_REQUEST_APPROVE: "notification::driver_request_approve",
};
