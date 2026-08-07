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

// видимості закладок
const classSelect = document.getElementById('class');

// Блоки вмісту закладок
const selectContentSubject = document.querySelector('#subject .content-select');
const selectContentClass = document.querySelector('#class .content-select');

//Текст підставка
const textSubject = document.querySelector('#subject .marks .text');
const textClass = document.querySelector('#class .marks .text');

// Тригер для згортання закладок
const reset = document.getElementById('trigger');

let electSubject = null;
let electClass = null;
let teacherLastName = null;

// 1. Рендеринг списку предметів
export const selectSubject = (map) => {
    selectContentSubject.innerHTML = ''; // Очищуємо контейнер
    console.log("Ось масив предметів:", map);
    
     map.forEach(el => {
        const liElement = document.createElement('li');
        liElement.textContent = el.Subject;
        selectContentSubject.appendChild(liElement);
    });
};

// 2. Рендеринг вибору журналу
export const selectClass = (subjectValue, test) => {
    selectContentClass.innerHTML = ''; // Повне очищення
    
    console.log("Ось масив предметів:", test);

    const currentRecord = test.find(el => el.Subject === subjectValue);
    if (currentRecord && currentRecord.Class) {
        const classesArray = currentRecord.Class.split(',').map(c => c.trim());
        classesArray.forEach(className => {
            const liElement = document.createElement('li');
            liElement.textContent = className;
            selectContentClass.appendChild(liElement);
        });
    }

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

    if (userData && userData.data.classes) {
        test = userData.data.classes;
        const record = test.length;

        if (userData.role === 'teacher' && record > 1) {
            selectSubject(test);
        }
        else if (userData.role === 'teacher' && record === 1) {
            electSubject = userData.classOrsubject;
            selectClass(electSubject, test);
        }
        else if (userData.role === 'student' && record > 1) {
            selectSubject(test);
        }
    }
    // Обробка вибору в закладці "Предмети"
    selectContentSubject.addEventListener('click', (event) => {
        const clickedLi = event.target.closest('li');
        if (clickedLi) {
            electSubject = clickedLi.textContent;
            textSubject.textContent = electSubject;
            textClass.textContent = 'Клас';
                
            // Згортаємо відкриту закладку
            reset.checked = true;
            if (userData.role === 'teacher') selectClass(electSubject, test);
            if (userData.role === 'student') {
                handClass(electSubject, userData, test);
                formationRequests(userData.role, electSubject, teacherLastName, electClass);                    
            }
        }
    });

    // Обробка вибору в закладці "Класи"
    selectContentClass.addEventListener('click', (event) => {
        const clickedLi = event.target.closest('li');
        if (clickedLi) {
            electClass = clickedLi.textContent;
            textClass.textContent = electClass;
                
            // Згортаємо відкриту закладку
            reset.checked = true;
            if (userData.role === 'teacher') formationRequests(userData.role, electSubject, userData.lastName, electClass);
        }
    });
});
