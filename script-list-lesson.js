// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович
import { getUserData } from './config.js';

const userData = getUserData();

const contentRoutine = document.getElementById('event-day-content');

export const routine = userData?.data?.routine || [];

if (routine.length > 0) {
    console.log("Ось ваш масив routine:", routine);
}

let lessonUpdateTime = null;

const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

function TimeNow (lessonList){
    const entries = contentRoutine.querySelectorAll('.routine-entry');
    // Скидаємо стан чекбоксів для всіх уроків
    entries.forEach(entry => {
        const activeInput = entry.querySelector('.input-active');
        const passedInput = entry.querySelector('.input-passed');
        
        if (activeInput) activeInput.checked = false;
        if (passedInput) passedInput.checked = false;
    });

    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    const StartTime = lessonList[0].Time.split('-')[0];
    const EndTime = lessonList[lessonList.length - 1].Time.split('-')[1];

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

            const [startTimeStr, endTimeStr] = item.Time.split('-');
            
            const startTotalMinutes = timeToMinutes(startTimeStr);
            const endTotalMinutes = timeToMinutes(endTimeStr);
            
            const nextStartTime = (index + 1 <lessonList.length) ? lessonList[index + 1].Time.split('-')[0] : null;
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

function setStatusLesson(routineLesson) {
    if(lessonUpdateTime) {
        clearTimeout(lessonUpdateTime);
        lessonUpdateTime = null;
    }

    const delay = TimeNow(routineLesson);
    if (delay === -1) { console.log("Уроки закінчилися"); return;}
    const delayMinutes = delay / (60 * 1000);
    console.log(`Наступне оновлення через ${delayMinutes.toFixed(2)} хвилин`);
    lessonUpdateTime = setTimeout(() => {
        setStatusLesson(routineLesson);
    }, delay );
};

export const listLessonDay = (dayText, isToday) => {
    const filteredLessons = routine.filter(item => item.Day === dayText);
    filteredLessons.sort((a, b) => Number(a.lessonNumber) - Number(b.lessonNumber));

    console.log(filteredLessons);

    if(lessonUpdateTime) {
        clearTimeout(lessonUpdateTime);
        lessonUpdateTime = null;
    }

    setTimeout(() => {
        contentRoutine.innerHTML = '';

        if (filteredLessons && filteredLessons.length > 0) {
            filteredLessons.forEach(el => {
                const [startTime] = el.Time ? el.Time.split('-') : ['', ''];
                
                const activeId = `active-lesson-${el.lessonNumber}`;
                const passedId = `passed-lesson-${el.lessonNumber}`;
                
                let locationHTML = '';

                let classBorder = '';
                
                if (el.Link) {
                    classBorder = 'border';
                    const rawLink = el.Link.trim();
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
                
                contentRoutine.insertAdjacentHTML('beforeend', lessonHTML);
            });
            if (isToday) setStatusLesson(filteredLessons);
        } else {
            contentRoutine.innerHTML = `
                <div class="holiday">
                    <p>Вихідний</p>
                </div>
            `;
        };
    }, 500);
};