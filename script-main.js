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
        contentTimeBlok: document.getElementById('content-time')
    };

    // Слухачі на перемикачі
    document.querySelectorAll('input[name="trigger"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (typeof calendar === 'function') calendar(elements);
            if (elements.inputSelectFelements.checkboxEl) elements.checkboxEl.checked = false;
        });
    });

    // Делегування кліків на сітку календаря
    if (elements.contentTimeBlok) {
        elements.contentTimeBlok.addEventListener('change', (e) => {
            if (e.target.matches('input[name="calendar-day"]')) {
                const input = e.target;
                const day = Number(input.value);
                const dayOfWeek = Number(input.dataset.dayofweek);
                
                const today = new Date();
                const isSelectedDayToday = 
                    day === today.getDate() && 
                    new Date().getMonth() === today.getMonth() && new Date().getFullYear() === today.getFullYear();

                if (typeof EventDayInfo === 'function') EventDayInfo(day, dayOfWeek, isSelectedDayToday, elements);
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
