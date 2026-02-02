
const adminactive = document.querySelector(".admin-info-active");
const closen = document.querySelector(".closen")
const daysContainer = document.getElementById('days_calendar');


closen.addEventListener("click", function () {
    adminactive.style.display = "none";
    calendar.style.display = 'block';
})

daysContainer.addEventListener('click', function () {
    adminactive.style.display = 'flex';
    calendar.style.display = 'none';
});





