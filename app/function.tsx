import {
  parse,
  startOfWeek,
  isWithinInterval,
  format,
  subWeeks,
  differenceInDays,
  subDays,
  addDays,
  max,
} from "date-fns";
import { Text } from "react-native";

interface DateEntry {
  date: string;
}

interface WeeklyReport {
  value: number;
  label: string;
  topLabelComponent: () => JSX.Element;
}

export function generateWeeklyReports(
  dates: DateEntry[],
  startMonday: string,
  numWeeks: number
): WeeklyReport[] {
  // Convert the input dates array to Date objects
  const parsedDates = dates.map((entry) =>
    parse(entry.date, "dd-MM-yyyy", new Date())
  );

  const reports: WeeklyReport[] = [];

  // Loop over the number of weeks we want
  for (let i = 0; i < numWeeks; i++) {
    // Get the start and end dates for the week
    const startOfWeekDate = subWeeks(
      parse(startMonday, "dd-MM-yyyy", new Date()),
      i
    );
    const endOfWeekDate = new Date(startOfWeekDate);
    endOfWeekDate.setDate(startOfWeekDate.getDate() + 6);

    // Filter dates that fall within the current week
    const daysPresentInTheWeek = parsedDates.filter((date) =>
      isWithinInterval(date, { start: startOfWeekDate, end: endOfWeekDate })
    ).length;

    // Format the starting day of the week
    const startingDayOfWeek = format(startOfWeekDate, "dd-MM");

    // Push the weekly report to the array
    reports.push({
      value: daysPresentInTheWeek,
      label: startingDayOfWeek,
      topLabelComponent: () => (
        <Text
          style={{ color: "#ffffff", fontSize: 12, marginBottom: 6 }}
          className="font-bold"
        >
          {daysPresentInTheWeek}
        </Text>
      ),
    });
  }

  return reports;
}

export function getStartingMonday(dateString: string): string {
  // Parse the input date string into a Date object
  const date = parse(dateString, "dd-MM-yyyy", new Date());

  // Get the start of the week, with Monday as the first day
  const monday = startOfWeek(date, { weekStartsOn: 1 });

  // Format the date as "dd MMM" for output
  return format(monday, "dd-MM-yyyy");
}

interface Streaks {
  currentStreak: number;
  maxStreak: number;
  weeklyStreak: number;
}

export function calculateStreaks(dates: DateEntry[]): Streaks {
  const parsedDates = dates
    .map((entry) => parse(entry.date, "dd-MM-yyyy", new Date()))
    .sort((a, b) => a.getTime() - b.getTime());

  // Calculate current streak
  let currentStreak = 0;
  for (let i = parsedDates.length - 1; i > 0; i--) {
    const diff = differenceInDays(parsedDates[i], parsedDates[i - 1]);
    if (diff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }
  let today = new Date();
  currentStreak++; // Include the last date in the streak
  if (
    parsedDates.length === 0 ||
    differenceInDays(today, parsedDates[parsedDates.length - 1]) > 0
  ) {
    currentStreak = 0;
  }

  // Calculate max streak
  let maxStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < parsedDates.length; i++) {
    const diff = differenceInDays(parsedDates[i], parsedDates[i - 1]);
    if (diff === 1) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  if (parsedDates.length === 0) {
    maxStreak = 0;
  }

  // Calculate weekly streak
  let weeklyStreak = 0;
  let tempWeeklyStreak = 0;
  let currentWeekStart = startOfWeek(parsedDates[0], { weekStartsOn: 1 });

  parsedDates.forEach((date) => {
    // If the date is within the current week, continue
    if (
      isWithinInterval(date, {
        start: currentWeekStart,
        end: addDays(currentWeekStart, 6),
      })
    ) {
      tempWeeklyStreak = 1;
    } else {
      // Move to the next week if the current week has dates
      if (tempWeeklyStreak > 0) {
        weeklyStreak++;
      }
      currentWeekStart = startOfWeek(date, { weekStartsOn: 1 });
      tempWeeklyStreak = 1;
    }
  });

  // Include the last week if it had dates
  if (tempWeeklyStreak > 0) {
    weeklyStreak++;
  }

  return {
    currentStreak,
    maxStreak,
    weeklyStreak,
  };
}
