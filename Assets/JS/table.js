let rows = [];
let editIndex = -1;
const form = document.getElementById("dataForm");
const table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
const searchInput = document.getElementById("searchInput");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const city = document.getElementById("city").value.trim();
  const mail = document.getElementById("mail").value.trim();

  if (!name || !age || !city || !mail) return alert("Minden mező kötelező!");
  if (name.length < 2 || city.length < 2 || mail.length < 2) return alert("Túl rövid adat!");
  if (name.length > 30 || city.length > 30 || mail.length > 30) return alert("Túl hosszú adat!");

  const newRow = { name, age, city, mail };

  if (editIndex === -1) {
    rows.push(newRow);
  } else {
    rows[editIndex] = newRow;
    editIndex = -1;
  }

  form.reset();
  renderTable();
});

function renderTable(filteredRows = rows) {
  table.innerHTML = "";
  filteredRows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.age}</td>
      <td>${row.city}</td>
      <td>${row.mail}</td>
      <td>
        <button onclick="editRow(${index})">✏️</button>
        <button onclick="deleteRow(${index})">🗑️</button>
      </td>`;
    table.appendChild(tr);
  });
}

function editRow(index) {
  const row = rows[index];
  document.getElementById("name").value = row.name;
  document.getElementById("age").value = row.age;
  document.getElementById("city").value = row.city;
  document.getElementById("mail").value = row.mail;
  editIndex = index;
}

function deleteRow(index) {
  if (confirm("Biztosan törlöd?")) {
    rows.splice(index, 1);
    renderTable();
  }
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = rows.filter(row =>
    Object.values(row).some(val => val.toLowerCase().includes(keyword))
  );
  renderTable(filtered);
});

document.querySelectorAll("th[data-column]").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.dataset.column;
    rows.sort((a, b) => a[col].localeCompare(b[col], undefined, { numeric: true }));
    renderTable();
  });
});
