// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович
function calendar(elements) {
  const { contentTimeBlok, checkbox } = elements;

  if (!checkbox || !checkbox.checked || !contentTimeBlok) return;

  // Створення або отримання розмітки календаря
    let calendarWrapper = contentTimeBlok.querySelector('#calendar');
    if (!calendarWrapper) {
        calendarWrapper = document.createElement('div');
        calendarWrapper.id = 'calendar';
        calendarWrapper.innerHTML = `
            <h2 id="month"></h2>
            <div id="week"></div>
            <div id="content-calendar"></div>
        `;
        contentTimeBlok.appendChild(calendarWrapper);
    }

    const monthEl = calendarWrapper.querySelector('#month');
    const weekEl = calendarWrapper.querySelector('#week');
    const contentCalendarEl = calendarWrapper.querySelector('#content-calendar');

  
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

  // Дні поточного місяця
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
    
    // Днi наступного місяця
    const totalRendered = firstDayIndex + totalDays;
    const nextDaysNeeded = (totalRendered > 35 ? 42 : 35) - totalRendered;

    for (let day = 1; day <= nextDaysNeeded; day++) {
      calendarHTML += `<div class="day-block other-month"><p>${day}</p></div>`;
    }

    contentCalendarEl.innerHTML = calendarHTML;

    // Завантаження розкладу для поточного дня за замовчуванням
    if (isCurrentMonth && typeof EventDayInfo === 'function') {
      EventDayInfo(today.getDate(), today.getDay(), true, elements);
    }
}
