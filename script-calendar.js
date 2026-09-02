import { listLessonDay } from './script-list-lesson.js';

const monthEl = document.getElementById('month');
const weekEl = document.getElementById('week');
const contentCalendarEl = document.getElementById('content-calendar');

const dateEl = document.getElementById('date');
const dayWeekEl = document.getElementById('day-week');
const checkboxEl = document.getElementById('checkbox-event-day');

const currentDate = new Date();

const monthNames = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const fullWeekDays = [
  'Неділя', 'Понеділок', 'Вівторок', 'Середа', 
  'Четвер', 'П\'ятниця', 'Субота'
];

function updateEventDayInfo(day, dayOfWeekIndex, isToday = false) {
  let dayText = fullWeekDays[dayOfWeekIndex];
  if (dateEl) dateEl.textContent = day;
  if (dayWeekEl) dayWeekEl.textContent = dayText;
  
  listLessonDay(dayText, isToday);
  
  setTimeout(() => {
    if (!checkboxEl.checked) checkboxEl.checked = true;
  }, 500);
}

if (checkboxEl) {
  checkboxEl.addEventListener('change', () => {
    if (!checkboxEl.checked) {
      const activeRadio = contentCalendarEl.querySelector('input[name="calendar-day"]:checked');
      if (activeRadio) activeRadio.checked = false;
    }
  });
}

function initCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (monthEl) monthEl.textContent = monthNames[month];

  // Дні тижня
  if (weekEl) {
    weekEl.innerHTML = weekDays.map(day => `<p>${day}</p>`).join('');
  }

  if (!contentCalendarEl) return;

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  let calendarHTML = '';

  // Порожні блоки перед початком місяця
  for (let i = 0; i < firstDayIndex; i++) {
    calendarHTML += `<div class="day-block empty"></div>`;
  }

  // Дні поточного місяця
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

    // Формуємо радіо та лейбл єдиним блоком розмітки
    calendarHTML += `
      <input type="radio" name="calendar-day" id="${inputId}" class="input" value="${day}" data-dayofweek="${dayOfWeek}" ${checkedAttr}>
      <label for="${inputId}" class="day-block${weekendClass}${todayClass}">
        <p>${day}</p>
      </label>
    `;
  }

  // Вставляємо всю розмітку в DOM за один раз
  contentCalendarEl.innerHTML = calendarHTML;

  // Початкове оновлення інформації для сьогоднішнього дня
  if (isCurrentMonth) {
    updateEventDayInfo(today.getDate(), today.getDay(),  true);
  }

  // Делегування подій: один слухач на весь контейнер замість повішування на кожен інпут
  contentCalendarEl.addEventListener('change', (e) => {
    if (e.target.matches('input[name="calendar-day"]')) {
      const day = Number(e.target.value);
      const dayOfWeek = Number(e.target.dataset.dayofweek);

      const isSelectedDayToday = isCurrentMonth && day === today.getDate();

      updateEventDayInfo(day, dayOfWeek, isSelectedDayToday);
    }
  });
}

initCalendar();