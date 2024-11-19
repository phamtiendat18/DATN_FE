import moment from "moment";

export default function formatedTime(value) {
  return moment(value).format("HH:mm DD/MM/YYYY");
}
