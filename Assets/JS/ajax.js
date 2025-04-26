const BASE_URL = "http://gamf.nhely.hu/ajax2/";
const CODE = "ZFB08Yabc789"; 

function isValidInput(...fields) {
  return fields.every(f => f && f.length <= 30);
}

function readData() {
  fetch(BASE_URL, {
    method: "POST",
    body: new URLSearchParams({ op: "read", code: CODE })
  })
    .then(res => res.json())
    .then(data => {
      const list = data.list || [];
      let html = list.map(d => `
        <div>
          <strong>ID:</strong> ${d.id},
          <strong>Név:</strong> ${d.name},
          <strong>Magasság:</strong> ${d.height},
          <strong>Súly:</strong> ${d.weight}
        </div>
      `).join("");

      document.getElementById("data").innerHTML = html;

      const heights = list.map(d => parseFloat(d.height)).filter(h => !isNaN(h));
      const sum = heights.reduce((a, b) => a + b, 0);
      const avg = (sum / heights.length).toFixed(2);
      const max = Math.max(...heights);

      document.getElementById("stats").innerHTML = `
        <p>Magasságok összege: ${sum}</p>
        <p>Átlag: ${avg}</p>
        <p>Legnagyobb: ${max}</p>
      `;
    });
}

function createRecord() {
  const name = document.getElementById("nameCreate").value.trim();
  const height = document.getElementById("heightCreate").value.trim();
  const weight = document.getElementById("weightCreate").value.trim();

  if (!isValidInput(name, height, weight)) {
    document.getElementById("createMsg").textContent = "Hibás adat! (Max 30 karakter, nem lehet üres)";
    return;
  }

  fetch(BASE_URL, {
    method: "POST",
    body: new URLSearchParams({
      op: "create", name, height, weight, code: CODE
    })
  })
    .then(res => res.json())
    .then(result => {
      document.getElementById("createMsg").textContent = result === 1 ? "Sikeres hozzáadás!" : "Hiba történt.";
      readData();
    });
}

function getDataForId() {
  const id = document.getElementById("updateId").value.trim();
  fetch(BASE_URL, {
    method: "POST",
    body: new URLSearchParams({ op: "read", code: CODE })
  })
    .then(res => res.json())
    .then(data => {
      const item = data.list.find(d => d.id === id);
      if (item) {
        document.getElementById("nameUpdate").value = item.name;
        document.getElementById("heightUpdate").value = item.height;
        document.getElementById("weightUpdate").value = item.weight;
      } else {
        alert("Nem található ilyen ID.");
      }
    });
}

function updateRecord() {
  const id = document.getElementById("updateId").value.trim();
  const name = document.getElementById("nameUpdate").value.trim();
  const height = document.getElementById("heightUpdate").value.trim();
  const weight = document.getElementById("weightUpdate").value.trim();

  if (!isValidInput(name, height, weight)) {
    document.getElementById("updateMsg").textContent = "Hibás adat! (Max 30 karakter, nem lehet üres)";
    return;
  }

  fetch(BASE_URL, {
    method: "POST",
    body: new URLSearchParams({
      op: "update", id, name, height, weight, code: CODE
    })
  })
    .then(res => res.json())
    .then(result => {
      document.getElementById("updateMsg").textContent = result === 1 ? "Sikeres módosítás!" : "Nem sikerült frissíteni.";
      readData();
    });
}

function deleteRecord() {
  const id = document.getElementById("deleteId").value.trim();
  fetch(BASE_URL, {
    method: "POST",
    body: new URLSearchParams({ op: "delete", id, code: CODE })
  })
    .then(res => res.json())
    .then(result => {
      document.getElementById("deleteMsg").textContent = result === 1 ? "Sikeres törlés!" : "Nem sikerült törölni.";
      readData();
    });
}
