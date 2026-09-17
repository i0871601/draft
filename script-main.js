// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович.
import { calendar } from './script-calendar.js';

document.addEventListener('DOMContentLoaded', () => {

    const inputTime = document.getElementById('time');
    const inputSelectFolder = document.getElementById('select-folder');
    const checkboxEventDay = document.getElementById('checkbox-event-day');

    document.querySelectorAll('input[name="trigger"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (inputTime.checked) calendar();
            if (inputSelectFolder.checked) checkboxEventDay.checked = false;
        });
    });

    calendar();
});
