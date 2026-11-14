import CloverIcon from "./CloverIcon";

function calculateDaysTogether() {
  const startDate = new Date("2024-04-15T00:00:00");
  const today = new Date();

  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const differenceInMs = current - start;
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return differenceInDays + 1;
}

function DaysTogetherCard() {
  const daysTogether = calculateDaysTogether();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-[#f7f4ec] p-5">
      <CloverIcon className="absolute right-4 top-4 h-8 w-8 text-green-300" />

      <p className="text-sm text-green-700">Birlikte</p>

      <p className="mt-2 text-4xl font-semibold text-green-950">
        {daysTogether}
      </p>

      <p className="text-sm text-green-700">gün</p>
    </div>
  );
}

export default DaysTogetherCard;