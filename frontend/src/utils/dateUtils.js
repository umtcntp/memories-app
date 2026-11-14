export function getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.floor(diff / oneDay);
}

export function getTodayDailyNote(notes, date = new Date()) {
    if (!notes.length) return "";

    const dayOfYear = getDayOfYear(date);
    return notes[(dayOfYear - 1) % notes.length];
}