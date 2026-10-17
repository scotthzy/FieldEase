const assert = require('node:assert/strict');
const test = require('node:test');
const { getBookingValidationError } = require('../miniprogram/utils/booking-validation');

const validBooking = {
  date: '2026-10-17',
  startTime: '18:00',
  endTime: '20:00',
  occupiedAreas: ['A', 'B']
};

test('missing fields are reported in the order shown on the form', () => {
  const form = { date: '', startTime: '', endTime: '', occupiedAreas: [] };
  assert.equal(getBookingValidationError(form), '请选择预约日期');
  form.date = validBooking.date;
  assert.equal(getBookingValidationError(form), '请选择开始时间');
  form.startTime = validBooking.startTime;
  assert.equal(getBookingValidationError(form), '请选择结束时间');
  form.endTime = validBooking.endTime;
  assert.equal(getBookingValidationError(form), '请选择场地区域');
});

test('dates must exist in the calendar, including leap-year boundaries', () => {
  for (const date of ['2026-02-29', '2024-02-30', '2100-02-29', '2026-04-31', '2026-13-01', '2026-01-00', '2026/10/17']) {
    assert.equal(getBookingValidationError({ ...validBooking, date }), '预约日期无效，请重新选择', date);
  }
  for (const date of ['2024-02-29', '2000-02-29', '2026-12-31']) {
    assert.equal(getBookingValidationError({ ...validBooking, date }), '', date);
  }
});

test('time format is validated for both start and end', () => {
  for (const time of ['24:00', '18:60', '9:00', '18:00:00', 'invalid']) {
    for (const field of ['startTime', 'endTime']) {
      assert.equal(getBookingValidationError({ ...validBooking, [field]: time }), '预约时间无效，请重新选择', `${field}: ${time}`);
    }
  }
});

test('end must be later on the same day; midnight is a valid start', () => {
  for (const [startTime, endTime] of [['18:00', '18:00'], ['20:00', '18:00'], ['23:00', '01:00']]) {
    assert.equal(getBookingValidationError({ ...validBooking, startTime, endTime }), '结束时间必须晚于开始时间');
  }
  for (const [startTime, endTime] of [['00:00', '00:30'], ['18:30', '19:00'], ['23:29', '23:59']]) {
    assert.equal(getBookingValidationError({ ...validBooking, startTime, endTime }), '');
  }
});

test('bookings shorter than 30 minutes are rejected, including across an hour boundary', () => {
  for (const [startTime, endTime] of [['18:00', '18:01'], ['18:00', '18:29'], ['18:45', '19:14']]) {
    assert.equal(
      getBookingValidationError({ ...validBooking, startTime, endTime }),
      '预约时长不能少于30分钟'
    );
  }
});

test('bookings of exactly 30 minutes or longer are accepted', () => {
  for (const [startTime, endTime] of [['18:00', '18:30'], ['18:45', '19:15'], ['18:00', '18:31']]) {
    assert.equal(getBookingValidationError({ ...validBooking, startTime, endTime }), '');
  }
});

test('all planned area combinations are accepted, including both penalty areas', () => {
  for (const occupiedAreas of [['A', 'B', 'C', 'D', 'E', 'F'], ['A', 'B'], ['C', 'D'], ['A'], ['B'], ['C'], ['D'], ['E'], ['F']]) {
    assert.equal(getBookingValidationError({ ...validBooking, occupiedAreas }), '');
  }
});

test('invalid area data cannot pass validation', () => {
  for (const occupiedAreas of [null, 'A', []]) {
    assert.equal(getBookingValidationError({ ...validBooking, occupiedAreas }), '请选择场地区域');
  }
  for (const occupiedAreas of [['G'], ['A', 'A'], ['E', 'invalid']]) {
    assert.equal(getBookingValidationError({ ...validBooking, occupiedAreas }), '场地区域无效，请重新选择');
  }
});
