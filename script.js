const WORKER_URL = 'https://base-sing-in.i087.workers.dev/';

const formEl = document.getElementById('auth-form');
const inputEl = document.getElementById('access-code');
const buttonEl = document.getElementById('button');
const stanButtonOn = document.getElementById('on');
const stanButtonLoading = document.getElementById('loading');


// Перевіряємо, чи символ є буквою (латиниця)
  const isLetter = (char) => /^[a-zA-Z]$/.test(char);
  let session = null;

//Перевірка ведення
inputEl.addEventListener('input', () => {
  const value = inputEl.value;

  if (!value) {
    inputEl.type = "text";
    return
  }

  const firstChar = value[0];
  if (!isLetter(firstChar)) {
    inputEl.type = 'password';
  } else {
    inputEl.type = 'text';
  }
});

//відправка і отримання доступу
formEl.addEventListener('submit', async (event) => {
  event.preventDefault();

  const code = inputEl.value.trim();
  if (!code) return;

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      if (data.token) {
        session = {
          token: data.token,
          expiresAt: data.expiresAt
        };
      }
      else {
        session = null;
        console.log('Вхід як звичайний користувач');
      }

      inputEl.value = '';
      inputEl.type = 'text';
    } else {
      console.console.log(data.message || 'Невірний код доступу');
      inputEl.value = '';
      inputEl.type = 'text';
    }
  } catch (error) {
    console.log('Помилка запиту:', error);
    console.log('Помилка з’єднання з сервером');
  }
});
