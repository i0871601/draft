// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович.
import { calendar } from './script-calendar.js';

document.addEventListener('DOMContentLoaded', () => {

    const inputSelectFolder = document.getElementById('select-folder');
    const checkboxEventDay = document.getElementById('checkbox-event-day');

    document.querySelectorAll('input[name="trigger"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (inputSelectFolder.checked) checkboxEventDay.checked = false;
        });
    });

    calendar();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    calendar();
  }
});

window.addEventListener('pageshow', (event) => {
  calendar();
});