import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

dayjs.locale("vi");

export default dayjs;
