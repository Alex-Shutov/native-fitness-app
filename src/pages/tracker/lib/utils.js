export const getCurrentWeekdays = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - Воскресенье, 1 - Понедельник ...
  const diffToMonday = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Смещение до понедельника

  const weekdays = [];

  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(diffToMonday + i);
    weekdays.push({
      day: currentDate.getDate(),
      label: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'][i],
      date: currentDate,
    });
  }

  return weekdays;
}

export const getStartOfWeek = (date = new Date()) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Корректировка для воскресенья
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// Получение массива дат на неделю (5 рабочих дней)
export const getWeekdays = (startDate = getStartOfWeek()) => {
  const weekdays = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < 5; i++) {
    weekdays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekdays;
};

export const getDayNames = (short = true) => {
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
  const shortDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'];
  return short ? shortDays : days;
};

// Получение дат в формате "DD"
export const getDayNumbers = (startDate = getStartOfWeek()) => {
  return getWeekdays(startDate).map(date => date.getDate());
};

// Функция для создания нового трека
export const createTrack = (title, startDate = getStartOfWeek()) => {
  const now = new Date();
  // Если сегодня выходной, создаем трек на следующую неделю
  if (now.getDay() === 0 || now.getDay() === 6) {
    startDate = getStartOfWeek(new Date(now.setDate(now.getDate() + 8)));
  }

  return {
    id: `track-${Date.now()}`,
    title,
    startDate: startDate.toISOString(),
    completionStatus: [0, 0, 0, 0, 0], // Статус выполнения для каждого дня (0 - не выполнено, 1 - выполнено)
    createdAt: new Date().toISOString(),
  };
};

// Функция для расчета процента выполнения трека

export const getTrackCompletionPercentage = (track) => {
  const completedDays = track.completionStatus.filter(status => status).length;
  const totalDays = track.completionStatus.length;
  return (completedDays / totalDays) * 100;
};

// Функция для обновления статуса выполнения трека
// models/tracker.js

export const updateTrackStatus = (track, dayIndex, status) => {
  const updatedCompletionStatus = [...track.completionStatus];
  updatedCompletionStatus[dayIndex] = status;
  return {
    ...track,
    completionStatus: updatedCompletionStatus,
  };
};

export const getCurrentWeekdayIndex = () => {
  const today = new Date().getDay(); // 0 (воскресенье) до 6 (суббота)
  // Преобразуем в наш формат: 0 (понедельник) до 6 (воскресенье)
  return today === 0 ? 6 : today - 1;
};

export const isFutureDay = (dayIndex, currentDayIndex) => {
  return dayIndex > currentDayIndex;
};