// Авторське право (c) серпень 2025 рік Сікан Іван Валерійович.
const API_URL_AUTHORIZATION = "https://worker-auth.i087.workers.dev/";
const API_URL_JOURNAL = "https://worker-journal.i087.workers.dev/";
const API_URL_UPDATE_RECORD = "https://worker-update.i087.workers.dev/";

const messages = {
  loginError: {status: 'error', text: "Помилка: невірний логін чи пароль."},
  fieldsEmpty: {status: 'error', text: "Будь ласка, заповніть всі поля."},
  newPassword: {status: 'success', text: "Був введений тимчасовий пароль. Створіть постійний пароль."},
  passwordMismatch: {status: 'error', text: "Паролі не співпадають або поле порожнє."},
  passwordUpdateSuccess: {status: 'success', text: "Пароль успішно оновлено!"},
  passwordUpdateError: {status: 'error', text: "Не вдалося оновити пароль."}
};

function getUserData() {
    try {
        const sessionData = sessionStorage.getItem('userBase');
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.error("Помилка при парсингу даних сесії:", error);
        return null;
    }
}

async function request(payload) {
    const userData = getUserData();
    if (!userData) { throw new Error("Дані користувача не знайдено в сесії. Відправка запиту неможлива."); }
    
    const finalPayload = {
        ...payload,
        userData: userData
    };

    let targetUrl;
    
    switch (payload.action) {
        case 'journal':
            targetUrl = API_URL_JOURNAL;
            break;
        case 'updateRecord':
            targetUrl = API_URL_UPDATE_RECORD;
            break;
        default:
            throw new Error(`Перевірте переданий payload.`);
    }

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalPayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Помилка відправки запиту:", error);
        return { success: false, message: error.message };
    }
}