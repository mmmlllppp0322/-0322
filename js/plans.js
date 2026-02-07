/**********************
 * 学习计划模块 plans.js
 * 功能：
 * 1. 新增计划（日期 / 时间 / 事项）
 * 2. 今日 / 明日 / 未来分类显示
 * 3. 勾选完成 / 点击整条完成
 * 4. 点击文字编辑（回车 / 失焦确认）
 * 5. 删除计划
 * 6. localStorage 持久化
 **********************/

/* ========= 1. 数据区 ========= */
document.addEventListener('DOMContentLoaded', () => {

  // ⬇️ 你现在 plans.js 的所有代码，原封不动放进来
  // 不改逻辑，只是包起来

});

// 从本地读取计划
let plans = JSON.parse(localStorage.getItem('plans')) || [];

/* ========= 2. 日期工具 ========= */

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

const todayStr = formatDate(today);
const tomorrowStr = formatDate(tomorrow);

/* ========= 3. DOM 元素 ========= */

const todayList = document.getElementById('today-list');
const tomorrowList = document.getElementById('tomorrow-list');
const futureList = document.getElementById('future-list');

const planDate = document.getElementById('plan-date');
const planTime = document.getElementById('plan-time');
const planTask = document.getElementById('plan-task');
const addBtn = document.getElementById('add-btn');

/* ========= 4. 添加计划 ========= */

addBtn.addEventListener('click', () => {
  const date = planDate.value;
  const time = planTime.value;
  const task = planTask.value.trim();

  if (!date || !task) return;

  plans.push({ date, time, task, done: false });
  planTask.value = '';
  save();
});

/* ========= 5. 渲染计划 ========= */

function renderPlans() {
  todayList.innerHTML = '';
  tomorrowList.innerHTML = '';
  futureList.innerHTML = '';

  plans.forEach(plan => {
    const li = document.createElement('li');
    li.className = 'plan-item';
    if (plan.done) li.classList.add('done');

    li.innerHTML = `
      <input type="checkbox" ${plan.done ? 'checked' : ''}>
      <span class="task-text">${plan.time || ''} ${plan.task}</span>
      <button class="delete-btn">🗑</button>
    `;

    const checkbox = li.querySelector('input');
    const textSpan = li.querySelector('.task-text');
    const deleteBtn = li.querySelector('.delete-btn');

    // 勾选完成
    checkbox.onclick = e => {
      e.stopPropagation();
      plan.done = checkbox.checked;
      save();
    };

    // 点击文字编辑
    textSpan.onclick = e => {
      e.stopPropagation();

      const input = document.createElement('input');
      input.value = plan.task;
      input.className = 'edit-input';

      textSpan.replaceWith(input);
      input.focus();

      input.onkeydown = e => {
        if (e.key === 'Enter') {
          plan.task = input.value.trim();
          save();
        }
      };

      input.onblur = () => {
        plan.task = input.value.trim();
        save();
      };
    };

    // 删除
    deleteBtn.onclick = e => {
      e.stopPropagation();
      plans = plans.filter(p => p !== plan);
      save();
    };

    // 分类
    if (plan.date === todayStr) todayList.appendChild(li);
    else if (plan.date === tomorrowStr) tomorrowList.appendChild(li);
    else futureList.appendChild(li);
  });
}

/* ========= 6. 保存 ========= */

function save() {
  localStorage.setItem('plans', JSON.stringify(plans));
  renderPlans();
}

renderPlans();
