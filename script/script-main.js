// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович.
const sessionData = sessionStorage.getItem('userBase');
if (!sessionData) {
    window.location.href = './index.html';
    
    throw new Error("Відсутня сесія. Перенаправлення на index.html");
}

function init() {
    //DOM-елементи
    const elements = {
        checkboxTime: document.getElementById('time'),
        checkboxMain: document.getElementById('journal'),
        //checkboxEl: document.getElementById('checkbox-event-day'),
        contentTimeBlok: document.getElementById('content-time'),
        contentJournalBlok: document.getElementById('content-journal'),
        contentSelect: document.getElementById('list-subject'),
        textSelect: document.getElementById('text-select'),
        checkboxOffOn: document.getElementById('on-off-journal'),
        textError: document.getElementById('text-error-frame')
    };

    let userData = getUserData();

    // Делегування кліків на сітку календаря
    if (elements.contentTimeBlok) {
        elements.contentTimeBlok.addEventListener('change', (e) => {
            if (e.target.matches('input[name="calendar-day"]')) {
                const input = e.target;
                const day = Number(input.value);
                const dayOfWeek = Number(input.dataset.dayofweek);
                
                const today = new Date();
                const isSelectedDayToday = day === today.getDate() && today.getDay() === dayOfWeek;

                if (typeof EventDayInfo === 'function') EventDayInfo(day, dayOfWeek, isSelectedDayToday, elements);
            }
        });
    }
    // Делегування кліків на випадаючий список 
    if (elements.contentSelect) {
        elements.contentSelect.addEventListener('click', async (e) => {
            const liTarget = e.target.closest('li.li');
            
            if (!liTarget) return;

            // Збираємо дані з дата-атрибутів цього класу
            const subjectInfo = liTarget.dataset.subjectInfo;
            const classInfo = liTarget.dataset.classInfo;
            const teacherInfo = liTarget.dataset.teacherInfo;
            const textInfo = liTarget.textContent;
            
            console.log(subjectInfo, classInfo, teacherInfo);

            const payload = {
                action: 'journal',
                subject: subjectInfo,
                teacherLastName: teacherInfo,
                className: classInfo
            };
            const response = await request(payload);
            console.log("Дані журналу завантажено:", response);

            if (response.students.length === 0 || (userData.role === "student" && response.lessons.length === 0)) {
                console.log("Не має учнів/уроків");
                const text = userData.role === 'student' ? 'В журналі немає записів уроків' : 'В журналі відсутні учні';
                elements.textError.textContent = text;
                return;
            }
            else {
                elements.textSelect.textContent = `${textInfo}`;
                elements.checkboxOffOn.checked = true;
            }
        });
    }

    // Первинний запуск
    if (typeof calendar === 'function') calendar(elements);

    if (typeof select === 'function') select(elements);
}

// Захищений запуск (для завантаження з кешу)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
