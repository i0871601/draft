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

// Відстежуємо стан чекбокса
if (checkboxEl) {
  checkboxEl.addEventListener('change', () => {
    if (!checkboxEl.checked) {
      checkboxEl.disabled = true;
    }
  });
}

function updateEventDayInfo(day, dayOfWeekIndex) {
  if (dateEl) dateEl.textContent = day;
  if (dayWeekEl) dayWeekEl.textContent = fullWeekDays[dayOfWeekIndex];

  // Заповнили інформацію: розблоковуємо та вмикаємо чекбокс
  if (checkboxEl) {
    checkboxEl.disabled = false;
    checkboxEl.checked = true;
  }
}

function initCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthEl.textContent = monthNames[month];

  //Дні тижня (теги <p>)
  weekEl.innerHTML = '';
  weekDays.forEach(day => {
    const p = document.createElement('p');
    p.textContent = day;
    weekEl.appendChild(p);
  });

  contentCalendarEl.innerHTML = '';

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  //Порожні блоки перед початком місяця
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'day-block empty';
    contentCalendarEl.appendChild(emptyDiv);
  }

  //Дні Поточного місяця
  const today = new Date();
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-block';

    const dayOfWeek = new Date(year, month, day).getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayDiv.classList.add('weekend');
    }

    const dayText = document.createElement('p');
    dayText.textContent = day;
    dayDiv.appendChild(dayText);

    // За замовчуванням виділяємо сьогоднішній день
    if (day === today.getDate()) {
      dayDiv.classList.add('today', 'active');
      updateEventDayInfo(day, today.getDay());
    }

    // Клік по дню
    dayDiv.addEventListener('click', () => {
      const currentActive = contentCalendarEl.querySelector('.day-block.active');
      if (currentActive) {
        currentActive.classList.remove('active');
      }

      dayDiv.classList.add('active');

      updateEventDayInfo(day, dayOfWeek);
    });

    contentCalendarEl.appendChild(dayDiv);
  }
}

initCalendar();