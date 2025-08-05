const API_URL = "https://script.google.com/macros/s/AKfycbzvpW31gVmLKfimdIObRPMQ9YUFLMrP6v0xqnEh2iHxf2omwfk5sMakoWHQzJmrwRor/exec";

document.addEventListener("DOMContentLoaded", () => {
  fetchData();

  document.getElementById("dataForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;

    const payload = {
      action: id ? "update" : "create",
      id: id || undefined,
      "mata pelajaran": document.getElementById("mapel").value,
      "nama guru": document.getElementById("guru").value,
      "waktu": document.getElementById("waktu").value,
      "ruang": document.getElementById("ruang").value
    };

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(() => {
      resetForm();
      fetchData();
    });
  });
});

function fetchData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("dataBody");
      tbody.innerHTML = "";
      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.id}</td>
          <td>${row["mata pelajaran"]}</td>
          <td>${row["nama guru"]}</td>
          <td>${row["waktu"]}</td>
          <td>${row["ruang"]}</td>
          <td>
            <button onclick="editData('${row.id}')">Edit</button>
            <button onclick="deleteData('${row.id}')">Hapus</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function editData(id) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "read", id }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("id").value = data.id;
      document.getElementById("mapel").value = data["mata pelajaran"];
      document.getElementById("guru").value = data["nama guru"];
      document.getElementById("waktu").value = data["waktu"];
      document.getElementById("ruang").value = data["ruang"];
    });
}

function deleteData(id) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "delete", id }),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(() => {
      fetchData();
    });
  }
}

function resetForm() {
  document.getElementById("id").value = "";
  document.getElementById("mapel").value = "";
  document.getElementById("guru").value = "";
  document.getElementById("waktu").value = "";
  document.getElementById("ruang").value = "";
}

