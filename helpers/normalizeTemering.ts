export const normalizeMetering = (metering: number) => {
  const min = -160; // Тиша
  const max = 0; // Найгучніше
  const range = 160; // Бажаний діапазон
  const threshold = 40; // Поріг для "шуму"

  const normalized = Math.max(0, ((metering - min) / (max - min)) * range);
  return normalized < threshold ? 10 : normalized;
};
