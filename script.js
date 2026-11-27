const WORKER_URL = 'https://base-sing-in.i087.workers.dev/';

const formEl = document.getElementById('auth-form');
const inputEl = document.getElementById('access-code');

const checkboxEl = document.getElementById('on-loading');
const buttonEl = document.getElementById('button');
const stanButtonOn = document.getElementById('on');
const stanButtonLoading = document.getElementById('loading');

const errorToggleEl = document.getElementById('error-toggle');
const errorText = document.getElementById('error-msg');

const checkboxAccess = document.getElementById('access-on-off');

const divMain = document.getElementById('contents');
const divMaterial = document.getElementById('materials');


// Перевіряємо, чи символ є буквою (латиниця)
const isLetter = (char) => /^[a-zA-Z]$/.test(char);
let session = null;
let stanCheckbox = false;

const MIN_LOADING_MS = 5000; // мінімум тривалість

//Перевірка ведення
inputEl.addEventListener('input', () => {
  if (errorToggleEl.checked) errorToggleEl.checked = false;

  const value = inputEl.value;

  if (!value) {
    inputEl.type = "text";
    return
  }

  const firstChar = value[0];
  inputEl.type = isLetter(firstChar) ? 'text' : 'password';
});

//відправка і отримання доступу
formEl.addEventListener('submit', async (event) => {
  event.preventDefault();


  const code = inputEl.value.trim();
  if (!code) {
    stanCheckbox = false;
    checkboxEl.checked = false;
    checkboxEl.disabled = false;
    inputEl.readOnly = false;

    errorToggleEl.checked = true;

    setTimeout(() => {
      errorToggleEl.checked = false;
    }, 1500);

    return;
  }

  stanCheckbox = true;
  checkboxEl.checked = true;
  checkboxEl.disabled = true;
  inputEl.readOnly = true;

  const startedAt = Date.now();


  try {

    //а далі треба сказати якщо що виключим стан та чекбокс фолс чере 2 секунди(думаю хватить на максимум чи краще 3?), мінімум через 1,5 секунду, якщо відповідь прийде раніше тоді берем мінімум, 
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_LOADING_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
    }

    if (response.ok && data.success) {
      if (data.token) {
        session = {
          token: data.token,
          expiresAt: data.expiresAt
        };

        divMain.insertAdjacentHTML( 
          'afterbegin',
          '<input type="radio" name="menu" id="input-group" class="input">'
        );

        divMaterial.insertAdjacentHTML(
          'beforebegin',
          `<input type="checkbox" id="input-add-material" class="input">
          <div id="groups" class="content"></div>`
        );
        

        const titleEl = divMaterial.querySelector('.title');
        titleEl.insertAdjacentHTML(
          'beforeend',
          `<label for="input-add-material">
              <span></span>
           </label>`
        );

      }
      else {
        session = null;
        console.log('Вхід як звичайний користувач');
      }

      inputEl.value = '';
      inputEl.type = 'text';
      checkboxAccess.checked = true;
    } else {
      console.log(data.message || 'Невірний код доступу');
      inputEl.value = '';
      inputEl.type = 'text';
      stanCheckbox = false;
      checkboxEl.checked = false;
      checkboxEl.disabled = false;
      inputEl.readOnly = false;
    }
  } catch (error) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_LOADING_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
    }
    console.log('Помилка запиту:', error);
    console.log('Помилка з’єднання з сервером');
  } finally {
    stanCheckbox = false;
    checkboxEl.checked = false;
    checkboxEl.disabled = false;
    inputEl.readOnly = false;
  }
});

checkboxEl.addEventListener('change', () => {
  if (stanCheckbox) return;
  formEl.requestSubmit();
});
