const WORKER_URL = 'https://base-sing-in.i087.workers.dev/';

const form = document.getElementById('auth-form');
const input = document.getElementById('access-code');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const code = input.value.trim();
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
      // Зберігаємо отримані дані сесії (наприклад, час та хеш або токен) у sessionStorage
      sessionStorage.setItem('session', JSON.stringify(data));
      
      // Перенаправлення після успішного входу (за потреби розкоментуй або зміни шлях)
      // window.location.href = 'home.html';
    } else {
      alert(data.message || 'Невірний код доступу');
      input.value = '';
    }
  } catch (error) {
    console.error('Помилка запиту:', error);
    alert('Помилка з’єднання з сервером');
  }
});
