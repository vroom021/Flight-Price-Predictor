const $ = (id) => document.getElementById(id);
const NAMES = { Banglore: "Bengaluru" };            // dataset spelling -> display name
const name = (v) => NAMES[v] || v;
const stopLabel = (n) => (n === 0 ? "Non-stop" : `${n} stop${n > 1 ? "s" : ""}`);
let META;

function fill(select, values, fmt = (v) => v) {
  select.innerHTML = values.map((v) => `<option value="${v}">${fmt(v)}</option>`).join("");
}
function onSource() { fill($("destination"), Object.keys(META.routes[$("source").value]), name); onDestination(); }
function onDestination() { fill($("airline"), Object.keys(META.routes[$("source").value][$("destination").value])); onAirline(); }
function onAirline() {
  const { source, destination, airline } = { source: $("source").value, destination: $("destination").value, airline: $("airline").value };
  fill($("stops"), META.routes[source][destination][airline], stopLabel);
}

function showArrival() {
  const [h, m] = ($("dep").value || "").split(":").map(Number);
  if (isNaN(h)) { $("arrival").textContent = ""; return; }
  const total = h * 60 + m + (+$("dh").value || 0) * 60 + (+$("dm").value || 0);
  const t = total % 1440, days = Math.floor(total / 1440);
  const hhmm = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  $("arrival").textContent = `Arrives at ${hhmm}${days ? ` (+${days} day${days > 1 ? "s" : ""})` : ""}`;
}

async function submit(e) {
  e.preventDefault();
  const box = $("result"), btn = $("btn");
  btn.disabled = true;
  try {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: $("date").value, source: $("source").value, destination: $("destination").value,
        airline: $("airline").value, stops: $("stops").value, dep_time: $("dep").value,
        duration_hours: $("dh").value, duration_mins: $("dm").value,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");
    const inr = new Intl.NumberFormat("en-IN").format(data.price);
    box.innerHTML = `<p class="sub">Estimated fare</p><div class="price">₹${inr}</div>
      <p class="sub">${name($("source").value)} → ${name($("destination").value)} · ${$("airline").value} · ${stopLabel(+$("stops").value)}</p>
      ${data.warnings.map((w) => `<div class="note">⚠ ${w}</div>`).join("")}`;
  } catch (err) {
    box.innerHTML = `<p class="error">${err.message}</p>`;
  } finally {
    box.hidden = false;
    btn.disabled = false;
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

(async () => {
  META = await (await fetch("/api/options")).json();
  fill($("source"), Object.keys(META.routes), name);
  onSource();
  $("source").addEventListener("change", onSource);
  $("destination").addEventListener("change", onDestination);
  $("airline").addEventListener("change", onAirline);
  ["dep", "dh", "dm"].forEach((id) => $(id).addEventListener("input", showArrival));
  $("form").addEventListener("submit", submit);
})();
