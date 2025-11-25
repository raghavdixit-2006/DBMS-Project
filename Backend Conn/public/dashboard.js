const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '/';  // redirect if not logged in

const welcome = document.getElementById('welcomeUser');
welcome.textContent = 'Welcome ' + user.name + ' 👋';

const todoList = document.getElementById('todoList');
const input = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');
const logoutBtn = document.getElementById('logoutBtn');
const API = '/api/todos';

// fetch all todos
async function loadTodos() {
  const res = await fetch(`${API}/${user.id}`);
  const todos = await res.json();
  todoList.innerHTML = '';
  todos.forEach(addTodoToList);
}
loadTodos();

// add new todo
addBtn.addEventListener('click', async () => {
  const title = input.value.trim();
  if (!title) return;
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, title })
  });
  const data = await res.json();
  addTodoToList(data);
  input.value = '';
});

// render a todo item
function addTodoToList(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = `
    <input type="checkbox" ${todo.is_done ? 'checked' : ''}>
    <input type="text" value="${todo.title}" readonly>
    <button class="edit">✏️</button>
    <button class="delete">🗑️</button>
  `;

  const chk = li.querySelector('input[type=checkbox]');
  const titleInput = li.querySelector('input[type=text]');
  const editBtn = li.querySelector('.edit');
  const delBtn = li.querySelector('.delete');

  chk.addEventListener('change', async () => {
    await fetch(`${API}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, is_done: chk.checked })
    });
  });

  editBtn.addEventListener('click', async () => {
    if (editBtn.textContent === '✏️') {
      titleInput.removeAttribute('readonly');
      titleInput.focus();
      editBtn.textContent = '💾';
    } else {
      titleInput.setAttribute('readonly', true);
      editBtn.textContent = '✏️';
      await fetch(`${API}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleInput.value, is_done: chk.checked })
      });
    }
  });

  delBtn.addEventListener('click', async () => {
    await fetch(`${API}/${todo.id}`, { method: 'DELETE' });
    li.remove();
  });

  todoList.appendChild(li);
}

// logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = '/';
});
