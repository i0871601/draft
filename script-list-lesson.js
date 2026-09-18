// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович

let lessonUpdateTime = null;

const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

function TimeNow (lessonList, eventDayContent){

    const entries = eventDayContent.querySelectorAll('.routine-entry');
    // Скидаємо стан чекбоксів для всіх уроків
    entries.forEach(entry => {
        const activeInput = entry.querySelector('.input-active');
        const passedInput = entry.querySelector('.input-passed');
        
        if (activeInput) activeInput.checked = false;
        if (passedInput) passedInput.checked = false;
    });

    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    const StartTime = lessonList[0].TimeStart;
    const EndTime = lessonList[lessonList.length - 1].TimeEnd;

    const startLesson = timeToMinutes(StartTime);
    const endLesson = timeToMinutes(EndTime);

    let delayMinutes = null;

    if (currentTotalMinutes < startLesson) {
        delayMinutes = startLesson - currentTotalMinutes;
    }
    
    else if (currentTotalMinutes >= startLesson && currentTotalMinutes < endLesson + 30) {
        entries.forEach((entryArticle, index) => {
            const item = lessonList[index];

            const activeInput = entryArticle.querySelector('.input-active');
            const passedInput = entryArticle.querySelector('.input-passed');

            const startTimeStr = item.TimeStart;
            const endTimeStr = item.TimeEnd;
            
            const startTotalMinutes = timeToMinutes(startTimeStr);
            const endTotalMinutes = timeToMinutes(endTimeStr);
            
            const nextStartTime = (index + 1 < lessonList.length) ? lessonList[index + 1].TimeStart : null;
            let nextTotalMinutes = nextStartTime ? timeToMinutes(nextStartTime) : null;
            
            //Зараз триває урок
            if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes) {
                if (activeInput) activeInput.checked = true;
                
                delayMinutes = endTotalMinutes - currentTotalMinutes;
            }
            
            //Перерва
            else if (nextTotalMinutes !== null && currentTotalMinutes >= endTotalMinutes && currentTotalMinutes < nextTotalMinutes) {
                if (passedInput) passedInput.checked = true;
                
                delayMinutes = nextTotalMinutes - currentTotalMinutes;
            }
            
            //Пройшов
            else if (currentTotalMinutes >= endTotalMinutes) {
                if (passedInput) passedInput.checked = true;

                //Останій урок
                if (index === lessonList.length - 1 && currentTotalMinutes < endLesson + 30) {
                    delayMinutes = (endTotalMinutes + 30) - currentTotalMinutes;
                }
            }
        });
    }

    if (delayMinutes === null) return -1;

    return delayMinutes * 60 * 1000;
};

function setStatusLesson(routineLesson, eventDayContent) {
    if(lessonUpdateTime) {
        clearTimeout(lessonUpdateTime);
        lessonUpdateTime = null;
    }

    const delay = TimeNow(routineLesson, eventDayContent);
    if (delay === -1) { console.log("Уроки закінчилися"); return;}
    const delayMinutes = delay / (60 * 1000);
    console.log(`Наступне оновлення через ${delayMinutes.toFixed(2)} хвилин`);
    lessonUpdateTime = setTimeout(() => {
        setStatusLesson(routineLesson, eventDayContent);
    }, delay );
};

function listLessonDay(dayText, isToday, eventDayContent) {

    alert('опрацьовуємо розклад');
    if (!eventDayContent) {
        alert('дали задню на розкладі');
        return;
    }

    let userData = getUserData();

    alert(JSON.stringify(userData, null, 2));
    const routine = userData.data.routine;

    const filteredLessons = routine.filter(item => item.Day === dayText);
    filteredLessons.sort((a, b) => Number(a.LessonNumber) - Number(b.LessonNumber));

    console.log(filteredLessons);
    alert(JSON.stringify(filteredLessons, null, 2));

    if(lessonUpdateTime) {
        clearTimeout(lessonUpdateTime);
        lessonUpdateTime = null;
    }

    setTimeout(() => {
        eventDayContent.innerHTML = '';

        if (filteredLessons && filteredLessons.length > 0) {
            alert('заповнюємо розклад');
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
                    
                    if (isUrl) locationHTML = `
                        <a href="${rawLink}" target="_blank" class="lesson-location link">посилання</a>
                    `;
                    
                    else locationHTML = `
                        <p class="lesson-location text">${rawLink}</p>
                    `;
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
            if (isToday) setStatusLesson(filteredLessons, eventDayContent);
        } else {
            eventDayContent.innerHTML = `
                <div class="holiday">
                    <p>Вихідний</p>
                </div>
            `;
        };
    }, 500);
};
