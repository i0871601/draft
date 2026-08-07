import { request } from './config.js';

const divJournal = document.getElementById('content-journal');
const checkedContentJournal = document.getElementById('off-on-journal');

function renderTable(mapLessons, mapStudents, mapRecords, role) {
    if (checkedContentJournal.checked) {
        divJournal.innerHTML = '';
        checkedContentJournal.checked = false;
    }

    const totalLessons = mapLessons.length;
    // Динамічно задаємо CSS grid-template-columns залежно від кількості уроків
    divJournal.style.setProperty('--colums', mapLessons.length);

    // --- 1. ВЕРХНІЙ РЯДОК (ШАПКА) ---
    // Лівий верхній куток (Перетин "Прізвище" та дат)
    const studentHeader = document.createElement('p');
    studentHeader.className = 'journal-cell header-cell sticky-top sticky-left corner-cell';
    studentHeader.textContent = "Прізвище";
    divJournal.appendChild(studentHeader);

    // Колонки дат
    mapLessons.forEach((lesson, index) => {
        const th = document.createElement('p');
        th.className = 'journal-cell header-cell sticky-top';
        
        const shortDate = lesson.Date ? lesson.Date.slice(0, 5) : '??.??';
        th.textContent = shortDate;
        th.dataset.lessonIndex = index;
        
        divJournal.appendChild(th);
    });

    // --- 2. РЯДКИ З УЧНЯМИ ТА ОЦІНКАМИ ---
    mapStudents.forEach((student, rowIndex) => {
        // Комірка з ім'ям (зафіксована зліва)
        const nameCell = document.createElement('p');
        nameCell.className = 'journal-cell name-cell sticky-left';
        nameCell.textContent = `${student.lastName}`;
        nameCell.dataset.rowIndex = rowIndex;
        nameCell.dataset.colIndex = 0;
        divJournal.appendChild(nameCell);

        // Комірки з оцінками
        mapLessons.forEach((lesson, colIndex) => {
            const scoreCell = document.createElement('p');
            scoreCell.className = 'journal-cell score-cell';

            const studentGrades = mapRecords[student.lastName];
            const score = studentGrades ? studentGrades[lesson.lessonNumber] : '';
            scoreCell.textContent = score !== undefined ? score : '';

            // Індекси для зручної навігації стрілочками в Grid
            scoreCell.dataset.rowIndex = rowIndex;
            scoreCell.dataset.colIndex = colIndex + 1; // +1 бо 0 - це ім'я

            if (role === 'teacher') {
                scoreCell.contentEditable = true;
                scoreCell.dataset.student = student.lastName;
                scoreCell.dataset.lesson = lesson.lessonNumber;
            } else {
                scoreCell.contentEditable = false;
            }

            divJournal.appendChild(scoreCell);
        });
    });

    checkedContentJournal.checked = true;
}

export function renderLog(role, subject, classes, teacherLastName, map) {
    const mapRecords = {};

    if (map.students.length === 0 || (role === 'student' && map.lessons.length === 0)) {
        console.log("Не має учнів/уроків");
        divJournal.innerHTML = '';
        divJournal.style.setProperty('--colums', 'none');
        checkedContentJournal.checked = false;
        return;
    }

    map.grades.forEach(el => {
        if (!mapRecords[el.lastName]) mapRecords[el.lastName] = {};
        mapRecords[el.lastName][el.lessonNumber] = el.rating;
    });

    renderTable(map.lessons, map.students, mapRecords, role);

    // --- ОБРОБНИКИ ПОДІЙ ---
    divJournal.addEventListener('click', function (event) {
        const target = event.target;
        if (target.dataset.lessonIndex !== undefined) {
            const index = Number(target.dataset.lessonIndex);
            const lessonInfo = map.lessons[index];

            setTimeout(() => {
                console.log(lessonInfo.Date);
                console.log(lessonInfo.Topic);
                console.log(lessonInfo.homeWork);
            }, 500);
        }
    });

    if (role === 'teacher') {
        divJournal.addEventListener('focus', function (event) {
            const cell = event.target;
            if (cell.dataset.student && cell.dataset.lesson) {
                cell._oldValue = cell.textContent.trim();
            }
        }, true);

        divJournal.addEventListener('keydown', function (event) {
            const cell = event.target;
            if (!cell.dataset.student || !cell.dataset.lesson) return;

            // Заборона Enter
            if (event.key === 'Enter') {
                event.preventDefault();
                cell.blur();
                return;
            }

            const isControlKey = event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab';
            if (isControlKey) return;

            // Навігація стрілочками між клітинками у Grid
            if (event.key.startsWith('Arrow')) {
                event.preventDefault();

                const currentRowIndex = Number(cell.dataset.rowIndex);
                const currentColIndex = Number(cell.dataset.colIndex);

                let targetRow = currentRowIndex;
                let targetCol = currentColIndex;

                if (event.key === 'ArrowRight') targetCol++;
                else if (event.key === 'ArrowLeft') targetCol--;
                else if (event.key === 'ArrowDown') targetRow++;
                else if (event.key === 'ArrowUp') targetRow--;

                // Шукаємо клітинку за індексами рядка та колонки
                const targetCell = divJournal.querySelector(
                    `[data-row-index="${targetRow}"][data-col-index="${targetCol}"]`
                );

                if (targetCell && targetCell.isContentEditable) {
                    targetCell.focus();

                    // Виділяємо весь текст в новій комірці
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(targetCell);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                return;
            }

            // Обмежуємо довжину: максимум 2 символи
            const selectedTextLength = window.getSelection().toString().length;
            if (cell.textContent.length >= 2 && selectedTextLength === 0) {
                event.preventDefault();
            }
        });

        // Заборона paste
        divJournal.addEventListener('paste', function (event) {
            const cell = event.target;
            if (cell.dataset.student && cell.dataset.lesson) {
                event.preventDefault();
            }
        });

        // Для мобільних пристроїв та введення
        divJournal.addEventListener('input', function (event) {
            const cell = event.target;
            if (!cell.dataset.student || !cell.dataset.lesson) return;

            let text = cell.textContent.replace(/\s+/g, '');

            if (text.length > 2) text = text.slice(0, 2);

            if (cell.textContent !== text) {
                cell.textContent = text;

                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(cell);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });

        // Збереження змін
        divJournal.addEventListener('blur', async function (event) {
            const cell = event.target;

            if (cell.dataset.student && cell.dataset.lesson) {
                const oldValue = cell._oldValue;
                const newRating = cell.textContent.trim();

                if (oldValue === newRating) return;

                const student = cell.dataset.student;
                const lesson = cell.dataset.lesson;

                const payload = {
                    action: 'updateRecord',
                    numberLesson: lesson,
                    rating: newRating,
                    subject: subject,
                    className: classes,
                    lastName: student
                };

                try {
                    const response = await request(payload);
                    console.log("Відповідь сервера:", response);
                    cell._oldValue = newRating;
                } catch (error) {
                    console.error("Помилка при збереженні оцінки:", error);
                    alert("Не вдалося зберегти оцінку. Перевірте з'єднання.");
                    cell.textContent = oldValue;
                }
            }
        }, true);
    }
}
