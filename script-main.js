// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович.
const sessionData = sessionStorage.getItem('userBase');
if (!sessionData) {
    window.location.href = './index.html';
    
    throw new Error("Відсутня сесія. Перенаправлення на index.html");
}

function init() {
    //DOM-елементи
    const elements = {
        checkbox: document.getElementById('time'),
        inputSelectFolder: document.getElementById('select-folder'),
        checkboxEl: document.getElementById('checkbox-event-day'),
        monthEl: document.getElementById('month'),
        weekEl: document.getElementById('week'),
        contentCalendarEl: document.getElementById('content-calendar'),
        dateEl: document.getElementById('date'),
        dayWeekEl: document.getElementById('day-week'),
        eventDayContent: document.getElementById('event-day-content')
    };

    //Слухачі на перемикачі
    document.querySelectorAll('input[name="trigger"]').forEach(radio => {
        radio.addEventListener('change', () => {
            
            if (elements.checkbox.checked && typeof calendar === 'function') calendar(elements);
            if (elements.inputSelectFolder.checked) elements.checkboxEl.checked = false;
        });
    });

    // Делегування кліків на сітку календаря
    if (elements.contentCalendarEl) {
        elements.contentCalendarEl.addEventListener('change', (e) => {
            
            if (e.target.matches('input[name="calendar-day"]')) {
                const input = e.target;
                const day = Number(input.value);
                const dayOfWeek = Number(input.dataset.dayofweek);
                const today = new Date();
                const isSelectedDayToday = day === today.getDate();
                if (typeof updateEventDayInfo === 'function') 
                {
                    updateEventDayInfo(day, dayOfWeek, isSelectedDayToday, elements);
                }
            }
        });
    }

    // Первинний запуск
    if (typeof calendar === 'function') {
        calendar(elements);
    }
}

// Захищений запуск (для завантаження з кешу)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
