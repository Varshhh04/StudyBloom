
const STORAGE_KEY = "studybloom-study-streak";

function getTodayKey() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

export function getStreak() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return saved || {
      current: 0,
      lastCompletedDate: null
    };
  } catch {
    return {
      current: 0,
      lastCompletedDate: null
    };
  }
}

export function updateStreak() {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  const streak = getStreak();

  if (streak.lastCompletedDate === today) {
    return streak;
  }

  if (streak.lastCompletedDate === yesterday) {
    streak.current += 1;
  } else {
    streak.current = 1;
  }

  streak.lastCompletedDate = today;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(streak)
  );

  return streak;
}
