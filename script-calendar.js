// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович
function updateEventDayInfo(day, dayOfWeekIndex, isToday, elements) {
  const { checkbox, dateEl, dayWeekEl, checkboxEl, eventDayContent } = elements;

  if (!checkbox.checked) return;

  const fullWeekDays = [
    'Неділя', 'Понеділок', 'Вівторок', 'Середа', 
    'Четвер', 'П\'ятниця', 'Субота'
  ];

  let dayText = fullWeekDays[dayOfWeekIndex];
  if (dateEl) dateEl.textContent = day;
  if (dayWeekEl) dayWeekEl.textContent = dayText;

  // Викликаємо функцію з script-list-lesson.js
  if (typeof listLessonDay === 'function') listLessonDay(dayText, isToday, eventDayContent);

  setTimeout(() => {
    if (!checkboxEl.checked) checkboxEl.checked = true;
  }, 500);
}

function calendar(elements) {
  const { monthEl, weekEl, contentCalendarEl, checkbox } = elements;

  //Перевірка чекбокса time
  if (!checkbox.checked) return;

  //Перевірка на непустоту
  const isCalendarRendered = contentCalendarEl && contentCalendarEl.children.length > 0;
  const isMonthRendered = monthEl && monthEl.textContent.trim() !== '';

  if (isCalendarRendered && isMonthRendered) return;

  const currentDate = new Date();
  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (monthEl) monthEl.textContent = monthNames[month];
  if (weekEl) weekEl.innerHTML = weekDays.map(d => `<p>${d}</p>`).join('');

  if (!contentCalendarEl) return;

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  let calendarHTML = '';

  for (let i = firstDayIndex; i > 0; i--) {
    const prevDay = prevMonthTotalDays - i + 1;
    calendarHTML += `<div class="day-block other-month"><p>${prevDay}</p></div>`;
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  for (let day = 1; day <= totalDays; day++) {
    const dayOfWeek = new Date(year, month, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = isCurrentMonth && day === today.getDate();

    const inputId = `day-${day}`;
    const weekendClass = isWeekend ? ' weekend' : '';
    const todayClass = isToday ? ' today' : '';
    const checkedAttr = isToday ? 'checked' : '';

    calendarHTML += `
      <input type="radio" name="calendar-day" id="${inputId}" class="input" value="${day}" data-dayofweek="${dayOfWeek}" ${checkedAttr}>
      <label for="${inputId}" class="day-block${weekendClass}${todayClass}">
        <p>${day}</p>
      </label>
    `;
  }

  const totalRendered = firstDayIndex + totalDays;
  const nextDaysNeeded = (totalRendered > 35 ? 42 : 35) - totalRendered;

  for (let day = 1; day <= nextDaysNeeded; day++) {
    calendarHTML += `<div class="day-block other-month"><p>${day}</p></div>`;
  }

  contentCalendarEl.innerHTML = calendarHTML;

  /*if (isCurrentMonth) {
    updateEventDayInfo(today.getDate(), today.getDay(), true, elements);
  }*/
}