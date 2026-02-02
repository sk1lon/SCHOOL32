const useractive = document.querySelector(".user-info-active")
const closenu = document.querySelector(".closenu")
const daysContainer = document.getElementById('days_calendar');


closenu.addEventListener("click", function () {
    useractive.style.display = 'none';
    calendar.style.display = 'block';
})


daysContainer.addEventListener('click', function () {
    useractive.style.display = 'flex';
    admin_panel.style.display = 'none';
    calendar.style.display = 'none';

});
