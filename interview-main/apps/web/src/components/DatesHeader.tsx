import dayjs from "dayjs";
import { getDatesBetween } from "../lib/utils";

interface DatesHeaderProps {
  dateRange: { start: string; end: string };
}

export default function DatesHeader({ dateRange }: DatesHeaderProps) {
  const dates = getDatesBetween(dayjs(dateRange.start), dayjs(dateRange.end));

  return (
    <div className="flex">
      <h2 className="w-56 flex-shrink-0 whitespace-nowrap border-b border-r py-2"></h2>
      <div className="flex border-t">
        {dates.map((date) => (
          <div
            key={date.format("M/D")}
            className="flex h-14 w-14 items-center justify-center border-b border-r py-2 text-center"
          >
            <div>
              <p className="text-sm">{date.format("M/D")}</p>
              <p className="text-sm">{date.format("ddd")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
