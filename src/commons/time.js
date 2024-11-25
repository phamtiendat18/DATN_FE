import moment from "moment-timezone";

export default function formattedTime(value) {
  // Giả sử bạn có giá trị thời gian UTC
  const utcTime = moment.utc(value);

  // Chuyển sang múi giờ Việt Nam (UTC+7) nhưng giữ nguyên giờ
  const vietnamTime = utcTime.clone().tz("Asia/Ho_Chi_Minh", true); // Giữ nguyên giờ khi chuyển múi giờ

  // Định dạng lại theo kiểu HH:mm DD/MM/YYYY
  const formattedTime = vietnamTime.format("HH:mm DD/MM/YYYY");

  return formattedTime;
}
