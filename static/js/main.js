const monthYear = document.getElementById("month_year");
const dayNamesContainer = document.querySelector(".days_week-calendar");
const calendar = document.querySelector(".full-calendar");

const btn__admin = document.getElementById("btn_for_admin");
const admin_panel = document.getElementById("admin-panel");

const right_btn = document.getElementById("right_btn");
const left_btn = document.getElementById("left_btn");

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

let nowDay = new Date();
let globalEvents = []; 

const renderDayNames = function () {
  dayNamesContainer.innerHTML = dayNames
    .map((day) => `<span>${day}</span>`)
    .join("");
};

// ... весь код до renderCalendar остаётся без изменений ...

const renderCalendar = async () => {
  const year = nowDay.getFullYear();
  const month = nowDay.getMonth();

  monthYear.textContent = `${monthNames[month]} ${year}`;

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Загружаем события один раз при рендере месяца
  const res = await fetch("/get_events");
  globalEvents = await res.json();

  const daySpans = [];

  for (let i = 0; i < firstDay; i++) {
    daySpans.push('<span class="days-cal-hidden"></span>');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const today = new Date();
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    // Форматируем дату дня в YYYY-MM-DD
    const paddedMonth = (month + 1).toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    const dayDate = `${year}-${paddedMonth}-${paddedDay}`;

    // Проверяем, есть ли событие на этот день
    const hasEvent = globalEvents.some(e => e.date === dayDate);

    daySpans.push(`
      <span
        class="${isToday ? "today" : ""} ${hasEvent ? "has-event" : ""}"
        onclick="handleDayClick(${day}, ${month}, ${year})"
      >
        ${day}
      </span>
    `);
  }

  daysContainer.innerHTML = daySpans.join("");
};

// handleDayClick, selectDate, selectDay, loadEventForDate — оставляем как были в предыдущем варианте

// ... остальной код (changeMonth, слушатели кнопок, renderDayNames, вызов renderCalendar и т.д.) без изменений ...

function handleDayClick(day, month, year) {
  selectDate(day, month, year);
  selectDay(day, month, year);
}

function selectDate(day, month, year) {
  const paddedMonth = (month + 1).toString().padStart(2, '0'); 
  const paddedDay = day.toString().padStart(2, '0');
  const dateString = `${paddedDay}.${paddedMonth}.${year}`;  
  document.getElementById("selected-date").textContent = dateString;
}

const changeMonth = (delta) => {
  nowDay.setMonth(nowDay.getMonth() + delta);
  renderCalendar();
};

left_btn.addEventListener("click", () => changeMonth(-1));
right_btn.addEventListener("click", () => changeMonth(+1));

renderDayNames();
renderCalendar();  

if (btn__admin) {
  btn__admin.addEventListener("click", function () {
    admin_panel.style.display = "block";
    useractive.style.display = "none";
    calendar.style.display = "none";
  });
}

async function loadEventForDate(selectedDate) {
  // Очистка
  document.getElementById("user-name").textContent    = "";
  document.getElementById("user-members").textContent = "";
  document.getElementById("user-time").textContent    = "";

  const event = globalEvents.find(e => e.date === selectedDate);
  if (!event) {
    return;
  }

  document.getElementById("user-name").textContent    = event.title;
  document.getElementById("user-members").textContent = event.members || 'Нет участников';
  document.getElementById("user-time").textContent    = event.start_time;
}
selectDay = (day, month, year) => {
  const paddedMonth = (month + 1).toString().padStart(2, '0');  
  const paddedDay = day.toString().padStart(2, '0');
  const date = `${year}-${paddedMonth}-${paddedDay}`;
  
  loadEventForDate(date);
};