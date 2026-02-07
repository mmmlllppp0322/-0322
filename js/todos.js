document.addEventListener('DOMContentLoaded', () => {


let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function renderTodos() {
  if (!todoList) return;
  todoList.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (todo.done) li.classList.add('done');

    li.innerHTML = `
      <span class="todo-text">${todo.text}</span>
      <button class="todo-delete">✖</button>
    `;

    const textSpan = li.querySelector('.todo-text');
    const deleteBtn = li.querySelector('.todo-delete');

    // 点击完成
    textSpan.onclick = () => {
      todo.done = !todo.done;
      save();
    };

    // 双击编辑
    textSpan.ondblclick = e => {
      e.stopPropagation();

      const input = document.createElement('input');
      input.value = todo.text;
      input.className = 'todo-edit';

      textSpan.replaceWith(input);
      input.focus();

      input.onkeydown = e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          todo.text = input.value.trim();
          save();
        }
      };

      input.onblur = () => {
        todo.text = input.value.trim();
        save();
      };
    };

    // 删除
    deleteBtn.onclick = e => {
      e.stopPropagation();
      todos.splice(index, 1);
      save();
    };

    todoList.appendChild(li);
  });
}

if (todoInput) {
  todoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const text = todoInput.value.trim();
      if (!text) return;

      todos.push({ text, done: false });
      todoInput.value = '';
      save();
    }
  });
}

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

renderTodos();
});
