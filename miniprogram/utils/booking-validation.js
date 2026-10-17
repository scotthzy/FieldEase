const MIN_BOOKING_MINUTES = 30;

function isValidDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return year > 0 && month >= 1 && month <= 12 &&
    day >= 1 && day <= daysInMonth[month - 1];
}

function timeToMinutes(time) {
  if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return null;
  }

  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

// Return the first error message, or an empty string when the form is valid.
function getBookingValidationError({ date, startTime, endTime, occupiedAreas }) {
  if (!date) {
    return '请选择预约日期';
  }
  if (!startTime) {
    return '请选择开始时间';
  }
  if (!endTime) {
    return '请选择结束时间';
  }
  if (!Array.isArray(occupiedAreas) || occupiedAreas.length === 0) {
    return '请选择场地区域';
  }
  if (!isValidDate(date)) {
    return '预约日期无效，请重新选择';
  }

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null) {
    return '预约时间无效，请重新选择';
  }
  if (endMinutes <= startMinutes) {
    return '结束时间必须晚于开始时间';
  }

  const durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < MIN_BOOKING_MINUTES) {
    return `预约时长不能少于${MIN_BOOKING_MINUTES}分钟`;
  }

  const validAreaCodes = ['A', 'B', 'C', 'D', 'E', 'F'];
  if (!occupiedAreas.every(area => validAreaCodes.includes(area)) ||
      new Set(occupiedAreas).size !== occupiedAreas.length) {
    return '场地区域无效，请重新选择';
  }

  return '';
}

module.exports = { getBookingValidationError };
