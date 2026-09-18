// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович

let lessonUpdateTime = null;

const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

function TimeNow(lessonList, eventDayContent) {
    const entries = eventDayContent.querySelectorAll('.routine-entry');
    
    entries.forEach(entry => {
        const activeInput = entry.querySelector('.input-active');
        const passedInput = entry.querySelector('.input-passed');
        
        if (activeInput) activeInput.checked = false;
        if (passedInput) passedInput.checked = false;
    });

    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    
    const startLesson = timeToMinutes(lessonList[0].TimeStart);
    const endLesson = timeToMinutes(lessonList[lessonList.length - 1].TimeEnd);

    let delayMinutes = null;

    if (currentTotalMinutes < startLesson) {
        delayMinutes = startLesson - currentTotalMinutes;
    } 
    else if (currentTotalMinutes >= startLesson && currentTotalMinutes < endLesson + 30) {
        entries.forEach((entryArticle, index) => {
            const item = lessonList[index];

            const activeInput = entryArticle.querySelector('.input-active');
            const passedInput = entryArticle.querySelector('.input-passed');

            const startTotalMinutes = timeToMinutes(item.TimeStart);
            const endTotalMinutes = timeToMinutes(item.TimeEnd);
            
            const nextStartTime = (index + 1 < lessonList.length) ? lessonList[index + 1].TimeStart : null;
            let nextTotalMinutes = nextStartTime ? timeToMinutes(nextStartTime) : null;
            
            if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes) {
                if (activeInput) activeInput.checked = true;
                delayMinutes = endTotalMinutes - currentTotalMinutes;
            } 
            else if (nextTotalMinutes !== null && currentTotalMinutes >= endTotalMinutes && currentTotalMinutes < nextTotalMinutes) {
                if (passedInput) passedInput.checked = true;
                delayMinutes = nextTotalMinutes - currentTotalMinutes;
            } 
            else if (currentTotalMinutes >= endTotalMinutes) {
                if (passedInput) passedInput.checked = true;

                if (index === lessonList.length - 1 && currentTotalMinutes < endLesson + 30) {
                    delayMinutes = (endTotalMinutes + 30) - currentTotalMinutes;
                }
            }
        });
    }

    if (delayMinutes === null) return -1;
    return delayMinutes * 60 * 1000;
}

function setStatusLesson(routineLesson, eventDayContent) {
    if (lessonUpdateTime) {
        clearTimeout(lessonUpdateTime);
        lessonUpdateTime = null;
    }

    const delay = TimeNow(routineLesson, eventDayContent);
    if (delay === -1) { 
        console.log("Уроки закінчилися"); 
        return;
    }
    
    const delayMinutes = delay / (60 * 1000);
    console.log(`Наступне оновлення через ${delayMinutes.toFixed(2)} хвилин`);
    
    lessonUpdateTime = setTimeout(() => {
        setStatusLesson(routineLesson, eventDayContent);
    }, delay);
}

function EventDayInfo(day, dayOfWeekIndex, isToday, elements) {
    const { checkbox, checkboxEl, contentTimeBlok } = elements;
    
    if (!checkbox || !checkbox.checked || !contentTimeBlok) return;

    // Динамічне створення контейнера подій
    let eventDayWrapper = contentTimeBlok.querySelector('#event-day');
    if (!eventDayWrapper) {
        eventDayWrapper = document.createElement('div');
        eventDayWrapper.id = 'event-day';
        eventDayWrapper.innerHTML = `
            <div id="title">
                <h1 id="date"></h1>
                <div>
                    <p id="day-week"></p>
                </div>
            </div>
            <div id="event-day-content"></div>
        `;
        contentTimeBlok.appendChild(eventDayWrapper);
    }

    const dateEl = eventDayWrapper.querySelector('#date');
    const dayWeekEl = eventDayWrapper.querySelector('#day-week');
    const eventDayContent = eventDayWrapper.querySelector('#event-day-content');

    const fullWeekDays = [
        'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'
    ];
    
    const dayText = fullWeekDays[dayOfWeekIndex];

    if (dateEl) dateEl.textContent = day;
    if (dayWeekEl) dayWeekEl.textContent = dayText;

    if (!eventDayContent) return;

    let userData = getUserData();
    const routine = userData.data.routine;

    const filteredLessons = routine.filter(item => item.Day === dayText);
    filteredLessons.sort((a, b) => Number(a.LessonNumber) - Number(b.LessonNumber));

    if (lessonUpdateTime) {
        clearTimeout(lessonUpdateTime);
        lessonUpdateTime = null;
    }

    setTimeout(() => {
        eventDayContent.innerHTML = '';

        if (filteredLessons.length > 0) {
            filteredLessons.forEach(el => {
                const startTime = el.TimeStart || '';
                const activeId = `active-lesson-${el.LessonNumber}`;
                const passedId = `passed-lesson-${el.LessonNumber}`;
                
                let locationHTML = '';
                let classBorder = '';
                
                if (el.Venue) {
                    classBorder = 'border';
                    const rawLink = el.Venue.trim();
                    const isUrl = rawLink.startsWith('http://') || rawLink.startsWith('https://');
                    
                    locationHTML = isUrl 
                        ? `<a href="${rawLink}" target="_blank" class="lesson-location link">посилання</a>`
                        : `<p class="lesson-location text">${rawLink}</p>`;
                }
                
                const lessonHTML = `
                    <article class="routine-entry">
                        <input type="checkbox" id="${activeId}" class="input input-active">
                        <input type="checkbox" id="${passedId}" class="input input-passed">
                        
                        <label for="${activeId}" class="lesson-label">
                            <div class="icon">
                                <span class="status-icon"></span>
                            </div>
                            
                            <div class="info-lesson">
                                <p class="name-subject">${el.Subject}</p>
                                <p class="name-class ${classBorder}">${el.Class}</p>
                                ${locationHTML}
                            </div>
                            
                            <div class="start-time-lesson">
                                <h2>${startTime}</h2>
                            </div>
                        </label>
                    </article>
                `;
                
                eventDayContent.insertAdjacentHTML('beforeend', lessonHTML);
            });

            if (isToday) {
                setStatusLesson(filteredLessons, eventDayContent);
            }
        } else {
            eventDayContent.innerHTML = `
                <div class="holiday">
                    <p>Вихідний</p>
                </div>
            `;
        }
    }, 500);

    if (checkboxEl && !checkboxEl.checked) {
        checkboxEl.checked = true;
    }
}