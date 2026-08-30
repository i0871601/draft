const monthEl = document.getElementById('month');
const weekEl = document.getElementById('week');
const contentCalendarEl = document.getElementById('content-calendar');

const dateEl = document.getElementById('date');
const dayWeekEl = document.getElementById('day-week');

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

function initCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthEl.textContent = monthNames[month];

  // 1. Дні тижня (теги <p>)
  weekEl.innerHTML = '';
  weekDays.forEach(day => {
    const p = document.createElement('p');
    p.textContent = day;
    weekEl.appendChild(p);
  });

  contentCalendarEl.innerHTML = '';

  // Зміщення першого дня почного місяця (0 — Пн, 6 — Нд)
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  // Кількість днів у поточному місяці
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Кількість днів у ПОПЕРЕДНЬОМУ місяці
  const prevLastDay = new Date(year, month, 0).getDate();

  // 2. Дні ПОПЕРЕДНЬОГО місяця (заповнення початку)
  for (let i = firstDayIndex; i > 0; i--) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-block other-month';

    const dayText = document.createElement('p');
    dayText.textContent = prevLastDay - i + 1;
    dayDiv.appendChild(dayText);

    contentCalendarEl.appendChild(dayDiv);
  }

  // 3. Дні ПОТОЧНОГО місяця
  const today = new Date();
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-block';

    const dayText = document.createElement('p');
    dayText.textContent = day;
    dayDiv.appendChild(dayText);

    if (day === today.getDate()) {
      dayDiv.classList.add('today');

      if (dateEl) dateEl.textContent = day;
      if (dayWeekEl) {
        dayWeekEl.textContent = fullWeekDays[today.getDay()];
      }
    }

    contentCalendarEl.appendChild(dayDiv);
  }

  // 4. Дні НАСТУПНОГО місяця (заповнення кінця рядка)
  const totalRendered = firstDayIndex + totalDays;
  const nextDays = (7 - (totalRendered % 7)) % 7; // Скільки днів треба до кінця тижня

  for (let j = 1; j <= nextDays; j++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-block other-month';

    const dayText = document.createElement('p');
    dayText.textContent = j;
    dayDiv.appendChild(dayText);

    contentCalendarEl.appendChild(dayDiv);
  }
}

// Запуск
initCalendar();