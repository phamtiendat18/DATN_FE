import moment from "moment-timezone";

export const formatTimeUTC = (time) => {
  const vietnamTime = moment.tz(time, "Asia/Ho_Chi_Minh");
  const utcTime = vietnamTime.utc();

  return utcTime.format();
};
