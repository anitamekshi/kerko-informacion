let data = [];

fetch("institutions.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    render(data);
    updateStats(data);
  });

function updateStats(items) {
  document.getElementById("stats").innerText =
    `📊 Total institucione: ${items.length}`;
}

function formatType(type) {
  switch (type) {
    case "municipality":
      return "Bashkia";
    case "prefecture":
      return "Prefekturë";
    case "county":
      return "Qark";
    default:
      return "Institucion";
  }
}

function render(items) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  items.forEach(i => {
    const emails = i.emails || [];

    const emailChips = emails.length
      ? emails.map(e => `<button class="chip" onclick="copy('${e}')">${e}</button>`).join("")
      : "<span class='muted'>Pa email</span>";

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="card-header">
        <h3>${i.title}</h3>
        <span class="badge">${formatType(i.type)}</span>
      </div>

      <p class="address">📍 ${i.address || "Pa adresë"}</p>

      <div class="emails">
        ${emailChips}
      </div>

      <div class="actions">
        <button onclick="copyAll('${emails.join(';')}')">📋 Kopjo email-et</button>

        ${i.website ? `<a href="${i.website}" target="_blank">🌐 Faqja zyrtare</a>` : ""}
      </div>
    `;

    list.appendChild(div);
  });
}

function copy(text) {
  navigator.clipboard.writeText(text);
  alert("U kopjua emaili");
}

function copyAll(text) {
  navigator.clipboard.writeText(text);
  alert("U kopjuan email-et");
}

document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = data.filter(i =>
    (i.title || "").toLowerCase().includes(q) ||
    (i.type || "").toLowerCase().includes(q) ||
    (i.address || "").toLowerCase().includes(q)
  );

  render(filtered);
  updateStats(filtered);
});
