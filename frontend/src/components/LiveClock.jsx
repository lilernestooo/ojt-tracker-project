import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function LiveClock() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow px-5 py-3 mb-6 flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-800 tracking-wide">
          {now.format("hh:mm:ss A")}
        </p>
        <p className="text-sm text-gray-500">
          {now.format("dddd, MMMM D, YYYY")}
        </p>
      </div>
      <div className="text-4xl">🕐</div>
    </div>
  );
}