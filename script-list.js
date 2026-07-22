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
const onSelect = document.getElementById('select-div');

// Блоки вмісту закладок
const selectContent = document.querySelector('#select-div .content-select');
const divContent = document.getElementById('view-choice');

//Текст підставка
const textMarks = document.getElementById('text');
const textSelect = document.getElementById('text-subject');

// Тригер для згортання закладок
const resetSelect = document.getElementById('select');
const resetSelectSubject = document.getElementById('select-subject');

let electSubject = null;
let electClass = null;
let teacherLastName = null;

// Функція генерації унікального ID без пробілів та спецсимволів
const generateId = (name) => {
    return `${name.replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ]/g, '_')}`;
};

// 1. Рендеринг списку предметів
export const selectSubject = (map) => {
    selectContent.innerHTML = ''; // Очищуємо контейнер
    console.log("Ось масив предметів:", map);
    
     map.forEach(el => {
        const liElement = document.createElement('li');
        liElement.textContent = el.Subject;
        selectContent.appendChild(liElement);
    });
};

// 2. Рендеринг вибору журналу
export const viewChoice = (role, subjectValue, test) => {
    divContent.innerHTML = ''; // Повне очищення

    if(role === 'student') {
        console.log("Ось масив предметів:", test);
        test.forEach(el => {
            const inputId = generateId(el.Subject);
            divContent.innerHTML += `
                <input type="radio" name="group" id="${inputId}" class="input" data-value="${el.Subject}">
                <label for="${inputId}">
                    <span class="text">${el.Subject}</span>
                    <div class="file">
                        <span></span
                    </div>
                </label>
            `;
        });
    }
    
    //const uniqueId = generateId('el-subject', el.Subject);
    console.log("Ось масив предметів:", test);

    const currentRecord = test.find(el => el.Subject === subjectValue);
    if (currentRecord && currentRecord.Class) {
        const classesArray = currentRecord.Class.split(',').map(c => c.trim());
        classesArray.forEach(className => {
            const inputId = generateId(className);
            divContent.innerHTML += `
                <input type="radio" name="group" id="${inputId}" class="input" data-value="${className}">
                <label for="${inputId}">
                    <span class="text">${className}</span>
                    <div class="file">
                        <span></span
                    </div>
                </label>
            `;
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
            onSelect.style.display = 'flex';
            selectSubject(test);
        }
        else if (userData.role === 'teacher' && record === 1) {
            electSubject = userData.classOrsubject;
            viewChoice(userData.role, electSubject, test);
        }
        else if (userData.role === 'student' && record > 1) {
            viewChoice(userData.role, null, test);
        }
    }
    // Обробка вибору в закладці "Предмети"
    selectContent.addEventListener('click', (event) => {
        const clickedLi = event.target.closest('li');
        if (clickedLi) {
            electSubject = clickedLi.textContent;
            textSelect.textContent = electSubject;
            textMarks.textContent = 'Вибір';
                
            // Згортаємо відкриту закладку
            resetSelectSubject.checked = false;
            if (userData.role === 'teacher') viewChoice(userData.role, electSubject, test);
        }
    });

    // Обробка вибору в закладці "Класи"
    divContent.addEventListener('change', (event) => {
        const targetInput = event.target.closest('input[type="radio"]');
        if (targetInput) {
            electClass = targetInput.dataset.value;
            textMarks.textContent = electClass;
                
            // Згортаємо відкриту закладку
            resetSelect.checked = false;
            if (userData.role === 'student') {
                handClass(electSubject, userData, test);
                formationRequests(userData.role, electSubject, teacherLastName, electClass);                    
            }

            if (userData.role === 'teacher') formationRequests(userData.role, electSubject, userData.lastName, electClass);
        }
    });
});
