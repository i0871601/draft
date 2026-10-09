// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович
function calendar(elements) {
    const { contentTimeBlok, checkbox } = elements;

    if (!checkbox || !checkbox.checked || !contentTimeBlok) return;

    // Створення або отримання контейнера
    let calendarWrapper = contentTimeBlok.querySelector('#calendar');
    if (!calendarWrapper) {
        calendarWrapper = document.createElement('div');
        calendarWrapper.id = 'calendar';
        calendarWrapper.innerHTML = `
            <h2 id="month"></h2>
            <div id="content-calendar" class="week-grid"></div>
        `;
        contentTimeBlok.appendChild(calendarWrapper);
    }

    const monthEl = calendarWrapper.querySelector('#month');
    const contentCalendarEl = calendarWrapper.querySelector('#content-calendar');

    const today = new Date();
    const monthNames = [
        'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];

    const currentDayOfWeek = today.getDay(); // 0 - Нд, 1 - Пн, 2 - Вт, 3 - Ср, 4 - Чт, 5 - Пт, 6 - Сб
    
    // Масив для збереження дати кожного з 5 днів
    const daysDates = [];

    if (currentDayOfWeek === 5) {
        // --- СЦЕНАРІЙ: СЬОГОДНІ П'ЯТНИЦЯ ---
        // 1. Поточна П'ятниця
        daysDates.push(new Date(today));

        // Знаходимо наступний Понеділок (+3 дні від п'ятниці)
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + 3);

        // 2-5. Наступні Пн, Вт, Ср, Чт
        for (let i = 0; i < 4; i++) {
            const nextDay = new Date(nextMonday);
            nextDay.setDate(nextMonday.getDate() + i);
            daysDates.push(nextDay);
        }

    } else if (currentDayOfWeek === 6 || currentDayOfWeek === 0) {
        // --- СЦЕНАРІЙ: ВИХІДНІ (СУБОТА / НЕДІЛЯ) ---
        // Вираховуємо дату НАСТУПНОГО Понеділка
        const daysUntilNextMonday = currentDayOfWeek === 6 ? 2 : 1;
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);

        // Формуємо 5 днів (Пн..Пт наступного тижня)
        for (let i = 0; i < 5; i++) {
            const day = new Date(nextMonday);
            day.setDate(nextMonday.getDate() + i);
            daysDates.push(day);
        }

    } else {
        // --- СЦЕНАРІЙ: ПОНЕДІЛОК - ЧЕТВЕР ---
        // Вираховуємо дату Понеділка поточного тижня
        const distanceToMonday = currentDayOfWeek - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - distanceToMonday);

        // Формуємо 5 днів (Пн..Пт поточного тижня)
        for (let i = 0; i < 5; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            daysDates.push(day);
        }
    }

    // Виводимо місяць першого дня в списку
    if (monthEl) monthEl.textContent = monthNames[daysDates[0].getMonth()];

    // Порядок коротких назв відповідно до обраного режиму
    const weekDaysShort = currentDayOfWeek === 5 
        ? ['Пт', 'Пн', 'Вт', 'Ср', 'Чт']
        : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

    let calendarHTML = '';
    let selectedDayForInit = null;

    daysDates.forEach((dayDate, index) => {
        const dayNum = dayDate.getDate();
        const dayOfWeekIndex = dayDate.getDay(); // 1..5
        const inputId = `day-${dayNum}-${dayOfWeekIndex}`;

        const isToday = dayDate.toDateString() === today.toDateString();
        const todayClass = isToday ? ' today' : '';

        // Обираємо (checked) ЛИШЕ якщо цей день є сьогоднішнім (включаючи П'ятницю)
        let checkedAttr = '';
        if (isToday) {
            checkedAttr = 'checked';
            selectedDayForInit = { day: dayNum, dayOfWeek: dayOfWeekIndex, isToday: true };
        }

        calendarHTML += `
            <input type="radio" name="calendar-day" id="${inputId}" class="input" value="${dayNum}" data-dayofweek="${dayOfWeekIndex}" ${checkedAttr}>
            <label for="${inputId}" class="day-block${todayClass}">  
              <p class="day-name">${weekDaysShort[index]}</p>  
              <p class="day-number">${dayNum}</p>
            </label>
        `;
    });

    contentCalendarEl.innerHTML = calendarHTML;

    // Автоматично завантажуємо інформацію для обраного дня
    if (selectedDayForInit && typeof EventDayInfo === 'function') {
        EventDayInfo(selectedDayForInit.day, selectedDayForInit.dayOfWeek, selectedDayForInit.isToday, elements);
    }
}
