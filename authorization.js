// Авторське право (c) серпень 2025 рік Сікан Іван Валерійович.
import { API_URL_AUTHORIZATION, messages } from './config.js';

//Всі html об'єкти для скрипта
const button = document.getElementById('loginButton');
const defaultText = button.querySelector('.default-text');
const form = document.getElementById('loginForm');
const passwordField = document.getElementById('password');
const newPasswordField = document.getElementById('newPassword');
const confirmNewPasswordField = document.getElementById('confirmNewPassword');
const newPasswordFieldsContainer = document.getElementById('newPasswordFields');

function errorButton(){
    button.style.pointerEvents = 'none';
    setTimeout(() => {
        button.style.pointerEvents = 'auto';
    }, 1000);
}

export function setButtonText(text = "Увійти") {
    defaultText.classList.remove('hidden');
    button.disabled = false;
    defaultText.textContent = text;
}

export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function authorizeUser(lastName, passwordHash) {
    const response = await fetch(API_URL_AUTHORIZATION, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'login',
            lastName: lastName,
            password: passwordHash
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Помилка авторизації.');
    }
    return data;
}

export async function updatePassword(lastName, newPasswordHash) {
    const response = await fetch(API_URL_AUTHORIZATION, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'login',
            lastName: lastName,
            newPassword: newPasswordHash
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Помилка оновлення пароля.');
    }
    return data;
}

function handleFormSubmission(event) {
    event.preventDefault();

    const lastName = document.getElementById('lastName').value.trim();
    const password = passwordField.value.trim();
    const isUpdatingPassword = newPasswordFieldsContainer.classList.contains('active');

    if (isUpdatingPassword) {
        handlePasswordUpdate(lastName);
    } else {
        handleLogin(lastName, password);
    }
}

async function handleLogin(lastName, password) {
    if (!lastName || !password) {
        errorButton()
        console.log(messages.fieldsEmpty);
        return;
    }
    
    try {
        const hashedPassword = await hashPassword(password);
        const data = await authorizeUser(lastName, hashedPassword);

        if (data.tempPasswordRequired) {
            passwordField.classList.add('hidden');
            newPasswordFieldsContainer.classList.remove('hidden');
            newPasswordFieldsContainer.classList.add('active');
            setButtonState(false, "Зберегти");
            newPasswordField.disabled = false;
            confirmNewPasswordField.disabled = false;
            newPasswordField.focus();
            console.log(messages.newPassword);
        } else {
            saveSessionData(data);
            window.location.href = "home.html";
        }
    } catch (error) {
        console.log(messages.loginError);
    }
}

async function handlePasswordUpdate(lastName) {
    const newPassword = newPasswordField.value.trim();
    const confirmNewPassword = confirmNewPasswordField.value.trim();

    if (!newPassword || newPassword !== confirmNewPassword) {
        console.log(messages.passwordMismatch);
        return;
    }
    
    try {
        const hashedNewPassword = await hashPassword(newPassword);
        const data = await updatePassword(lastName, hashedNewPassword);
        
        if (data.isPasswordUpdated) {
            passwordField.classList.remove('hidden');
            newPasswordFieldsContainer.classList.add('hidden');
            newPasswordFieldsContainer.classList.remove('active');
            setButtonText(false, "Увійти");
            newPasswordField.disabled = true;
            confirmNewPasswordField.disabled = true;
            newPasswordField.value = '';
            confirmNewPasswordField.value = '';
            passwordField.value = '';
            console.log(messages.passwordUpdateSuccess);
        } else {
            console.log(messages.passwordUpdateError);
        }
    } catch (error) {
        console.log("Помилка: " + error.message);
    }
}

function saveSessionData(data) {
    const jsonString = JSON.stringify(data);
    sessionStorage.setItem('userBase', jsonString);
}

export function initAuth() {
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            sessionStorage.clear();
            const form = document.getElementById('loginForm');
            form.reset();
        }
    });

    form.addEventListener('submit', handleFormSubmission);
}

document.addEventListener('DOMContentLoaded', initAuth);
