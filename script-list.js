// Авторське право (c) липень 2026 рік Сікан Іван Валерійович.
import { request, getUserData } from './config.js';
import { renderLog } from './script-journal.js';

if (sessionStorage.length === 0) {
    window.location.href = './index.html';
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        sessionStorage.clear();
        const form = document.getElementById('loginForm');
        if (form) form.reset();
    }
});

// Чекбокси видимості закладок (на заміну старим off-on)
const onSubject = document.getElementById('on-Subject');
const onClass = document.getElementById('on-Class');

// Блоки вмісту закладок
const divSubjectContent = document.querySelector('#Subject .content');
const divClassContent = document.querySelector('#Class .content');

// Тригер для згортання закладок
const inputReset = document.getElementById('reset');

let electSubject = null;
let electClass = null;
let teacherLastName = null;

// Функція генерації унікального ID без пробілів та спецсимволів
const generateId = (prefix, name) => {
    return `${prefix}-${name.replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ]/g, '_')}`;
};

// 1. Рендеринг списку предметів
export const selectSubject = (map) => {
    divSubjectContent.innerHTML = ''; // Очищуємо контейнер
    console.log("Ось масив предметів:", map);
    
    map.forEach((el, index) => {
        const uniqueId = generateId('el-subject', el.Subject);

        const inputEl = document.createElement('input');
        inputEl.type = 'radio';
        inputEl.name = 'el-subject';
        inputEl.id = uniqueId;
        inputEl.className = 'input';
        inputEl.value = el.Subject;

        const labelEl = document.createElement('label');
        labelEl.htmlFor = uniqueId;
        labelEl.textContent = el.Subject;

        divSubjectContent.appendChild(inputEl);
        divSubjectContent.appendChild(labelEl);
    });
};

// 2. Рендеринг класів для обраного предмету
export const handSubjectClick = (subjectValue, test) => {
    divClassContent.innerHTML = ''; // Повне очищення

    const currentRecord = test.find(el => el.Subject === subjectValue);
    if (currentRecord && currentRecord.Class) {
        const classesArray = currentRecord.Class.split(',').map(c => c.trim());
        
        classesArray.forEach((className) => {
            const uniqueId = generateId('el-class', className);

            const inputEl = document.createElement('input');
            inputEl.type = 'radio';
            inputEl.name = 'el-class';
            inputEl.id = uniqueId;
            inputEl.className = 'input';
            inputEl.value = className;

            const labelEl = document.createElement('label');
            labelEl.htmlFor = uniqueId;
            labelEl.textContent = className;

            divClassContent.appendChild(inputEl);
            divClassContent.appendChild(labelEl);
        });
    }
};

// Встановлення заглушки "Виберіть спочатку предмет"
const setDefaultClassPlaceholder = () => {
    divClassContent.innerHTML = '<span class="placeholder-text">Виберіть спочатку предмет</span>';
};

export const handClass = (electSubject, userData, map) => {
    const currentRecord = map.find(el => el.Subject === electSubject);
    if (currentRecord && currentRecord.Class && userData.classOrsubject) {
        const subjectClasses = currentRecord.Class.split(',').map(c => c.trim());
        const studentClasses = userData.classOrsubject.split(',').map(c => c.trim());
        electClass = subjectClasses.find(className => studentClasses.includes(className));
        teacherLastName = currentRecord.Teacher_LastName;
    }
};

async function formationRequests(role, subject, teacherLastName, classes) {
    const payload = {
        action: 'journal',
        subject: subject,
        teacherLastName: teacherLastName,
        className: classes
    };
                        
    const response = await request(payload);
    console.log("Дані журналу завантажено:", response);
    renderLog(role, subject, classes, teacherLastName, response);
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = getUserData();
    let test = [];
    let buttonVisibility = null;

    // Встановлюємо дефолтне значення для закладок класів при старті
    setDefaultClassPlaceholder();

    if (userData && userData.data.classes) {
        test = userData.data.classes;
        const record = test.length;

        if (userData.role === 'teacher' && record > 1) {
            buttonVisibility = [onSubject, onClass];
            selectSubject(test);
        }
        else if (userData.role === 'teacher' && record === 1) {
            buttonVisibility = [onClass];
            electSubject = userData.classOrsubject;
            handSubjectClick(electSubject, test);
        }
        else if (userData.role === 'student' && record > 1) {
            buttonVisibility = [onSubject];
            selectSubject(test);
        }
    }

    // Якщо закладки мають бути видимі, знімаємо "checked" з керуючих чекбоксів
    if (buttonVisibility) {
        buttonVisibility.forEach(el => {
            el.checked = false; 
        });
    }

    // Обробка вибору в закладці "Предмети"
    if (!onSubject.checked) {
        divSubjectContent.addEventListener('change', (event) => {
            const target = event.target;
            if (target.name === 'el-subject') {
                electSubject = target.value;
                
                // Згортаємо відкриту закладку
                inputReset.checked = true;

                if (userData.role === 'teacher') {
                    handSubjectClick(electSubject, test);
                }
                if (userData.role === 'student') {
                    handClass(electSubject, userData, test);
                    formationRequests(userData.role, electSubject, teacherLastName, electClass);                    
                }
            }
        });
    }

    // Обробка вибору в закладці "Класи"
    if (!onClass.checked) {
        divClassContent.addEventListener('change', (event) => {
            const target = event.target;
            if (target.name === 'el-class') {
                electClass = target.value;
                
                // Згортаємо відкриту закладку
                inputReset.checked = true;
                
                formationRequests(userData.role, electSubject, userData.lastName, electClass);
            }
        });
    }
});