const monthEl = document.getElementById('month');
const weekEl = document.getElementById('week');
const contentCalendarEl = document.getElementById('content-calendar');

const currentDate = new Date();

const monthNames = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

function initCalendar() {
  //const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Виводимо тільки назву місяця без року
  monthEl.textContent = monthNames[month];

  // 2. Дні тижня (теги <p>)
  weekEl.innerHTML = '';
  weekDays.forEach(day => {
    const p = document.createElement('p');
    p.textContent = day;
    weekEl.appendChild(p);
  });

  // 3. Сітка днів
  contentCalendarEl.innerHTML = '';

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'day-block empty';
    contentCalendarEl.appendChild(emptyDiv);
  }

  const today = new Date();
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-block';

    const dayText = document.createElement('p');
    dayText.textContent = day;
    dayDiv.appendChild(dayText);

    if (
      day === today.getDate() &&
      month === today.getMonth()
    ) {
      dayDiv.classList.add('today');
    }

    contentCalendarEl.appendChild(dayDiv);
  }
}

// Запуск
initCalendar();