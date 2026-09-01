// Авторське право (c) вересень 2026 рік Сікан Іван Валерійович
import { getUserData } from './config.js';

const userData = getUserData();

const contentRoutine = document.getElementById('event-day-content');
const checkboxVisibility = document.getElementById('visibility-event-day-content');

export const routine = userData?.data?.routine || [];

if (routine.length > 0) {
    console.log("Ось ваш масив routine:", routine);
}

let lessonUpdateTime = null;

export const listLessonDay = (dayText) => {
    const filteredLessons = routine.filter(item => item.Day === dayText);
    filteredLessons.sort((a, b) => Number(a.LessonNumber) - Number(b.LessonNumber));

    console.log(filteredLessons);

    if(lessonUpdateTime) {
        clearTimeout(lessonUpdateTime);
        lessonUpdateTime = null;
    }

    if (checkboxVisibility.checked) {
        checkboxVisibility.checked = false;
        setTimeout(() => {
            contentRoutine.innerHTML = '';
        }, 500);
    }

    if (filteredLessons && filteredLessons.length > 0) {
        filteredLessons.forEach(el =>{ 
            const [startTime] = el.Time ? el.Time.split('-') : ['', ''];

            const activeId = `active-lesson-${el.LessonNumber}`;
            const passedId = `passed-lesson-${el.LessonNumber}`;

            let locationHTML = '';
            if (el.Link) {
                const rawLink = el.Link.trim();
                const isUrl = rawLink.startsWith('http://') || rawLink.startsWith('https://');
                
                if (isUrl) locationHTML = `
                    <a href="${rawLink}" target="_blank" class="lesson-location link">посилання</a>
                `;

                else locationHTML = `
                    <p class="lesson-location text">${rawLink}</p>
                `;
            }
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
                        <div class="name-subject-class">
                            <p class="name-subject">${el.Subject}</p>
                            <p class="name-class">${el.Class}</p>
                        </div>
                        
                        ${locationHTML}
                    </div>

                    <div class="start-time-lesson">
                        <h1>${startTime}</h1>
                    </div>
                </label>
            </article>
            `;
            
            contentRoutine.insertAdjacentHTML('beforeend', lessonHTML);
        });
    } else {
        contentRoutine.innerHTML = `
        <div class="holiday">
            <p>Вихідний</p>
        </div>
        `;
    }
    
    checkboxVisibility.checked = true;
};