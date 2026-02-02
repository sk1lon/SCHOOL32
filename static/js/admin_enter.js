document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminForm");
  if (!form) return;

  const btn = document.getElementById("submitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.dataset.sending === "1") return;
    form.dataset.sending = "1";
    if (btn) btn.disabled = true;

    // Добавлено: парсим дату из selected-date и форматируем в YYYY-MM-DD
    let date = '';
    const dateString = document.getElementById("selected-date").textContent;
    if (dateString !== 'выберите дату') {
      const dateParts = dateString.split('.');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    const payload = {
      date: date,  // Добавлено
      title: document.getElementById("title").value.trim(),
      members: document.getElementById("members").value.trim(),
      start_time: document.getElementById("start_time").value,
    };

    try {
      const res = await fetch("/add_event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      

      if (!res.ok || !data.ok) {
        alert(data.error || "Ошибка");
        return;
      }
      window.location.href = "/admin";
    } catch (err) {
      alert("Ошибка сети: " + (err?.message || err));
    } finally {
      form.dataset.sending = "0";
      if (btn) btn.disabled = false;
    }
  });
});