const STORAGE_KEY = "estoque-vivo-products-v1";
const $ = (id) => document.getElementById(id);
const todayISO = () => new Date().toISOString().slice(0, 10);

function daysUntil(dateString, today = todayISO()) {
  if (!dateString) return null;
  const [y, m, d] = dateString.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86400000);
}
function statusOf(product, today = todayISO()) {
  const days = daysUntil(product.expiry, today);
  if (days !== null && days < 0) return "expired";
  if (days !== null && days <= 7) return "soon";
  if (Number(product.quantity) <= Number(product.minimum)) return "low";
  return "ok";
}
function loadProducts() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}
function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
let products = loadProducts();

function render() {
  const counts = { low: 0, soon: 0, expired: 0 };
  products.forEach(p => { const s = statusOf(p); if (s in counts) counts[s]++; });
  $("totalCount").textContent = products.length;
  $("lowCount").textContent = counts.low;
  $("soonCount").textContent = counts.soon;
  $("expiredCount").textContent = counts.expired;
  const q = $("searchInput").value.trim().toLocaleLowerCase("pt-BR");
  const filter = $("filterSelect").value;
  const visible = products.filter(p => {
    const matches = `${p.name} ${p.category}`.toLocaleLowerCase("pt-BR").includes(q);
    return matches && (filter === "all" || statusOf(p) === filter);
  });
  $("productRows").innerHTML = visible.map(p => {
    const status = statusOf(p);
    const labels = { ok: "Em dia", low: "Estoque baixo", soon: "Vencendo", expired: "Vencido" };
    const expiry = p.expiry ? new Date(`${p.expiry}T12:00:00`).toLocaleDateString("pt-BR") : "—";
    return `<tr><td>${escapeHTML(p.name)}<span class="sub">ID ${escapeHTML(p.id.slice(-6))}</span></td><td>${escapeHTML(p.category || "Geral")}</td><td>${Number(p.quantity)} un.<span class="sub">mínimo: ${Number(p.minimum)}</span></td><td>${expiry}</td><td><span class="pill ${status}">${labels[status]}</span></td><td><div class="actions"><button class="icon-btn" data-edit="${escapeHTML(p.id)}" aria-label="Editar ${escapeHTML(p.name)}">✎</button><button class="icon-btn" data-delete="${escapeHTML(p.id)}" aria-label="Excluir ${escapeHTML(p.name)}">×</button></div></td></tr>`;
  }).join("");
  $("emptyState").hidden = visible.length > 0;
}
function openForm(product) {
  $("productForm").reset();
  $("productId").value = product?.id || "";
  $("dialogTitle").textContent = product ? "Editar produto" : "Novo produto";
  $("nameInput").value = product?.name || "";
  $("categoryInput").value = product?.category || "";
  $("quantityInput").value = product?.quantity ?? 1;
  $("minimumInput").value = product?.minimum ?? 2;
  $("expiryInput").value = product?.expiry || "";
  $("productDialog").showModal();
}
$("addBtn").addEventListener("click", () => openForm());
$("closeDialog").addEventListener("click", () => $("productDialog").close());
$("cancelBtn").addEventListener("click", () => $("productDialog").close());
$("productForm").addEventListener("submit", event => {
  event.preventDefault();
  const id = $("productId").value || (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
  const item = { id, name: $("nameInput").value.trim(), category: $("categoryInput").value.trim(), quantity: Number($("quantityInput").value), minimum: Number($("minimumInput").value), expiry: $("expiryInput").value };
  if (!item.name || !Number.isInteger(item.quantity) || item.quantity < 0 || !Number.isInteger(item.minimum) || item.minimum < 0) return;
  products = products.some(p => p.id === id) ? products.map(p => p.id === id ? item : p) : [...products, item];
  saveProducts(products); render(); $("productDialog").close();
});
$("productRows").addEventListener("click", event => {
  const edit = event.target.closest("[data-edit]")?.dataset.edit;
  const del = event.target.closest("[data-delete]")?.dataset.delete;
  if (edit) openForm(products.find(p => p.id === edit));
  if (del && confirm("Excluir este produto do inventário?")) {
    products = products.filter(p => p.id !== del); saveProducts(products); render();
  }
});
$("searchInput").addEventListener("input", render);
$("filterSelect").addEventListener("change", render);
$("exportBtn").addEventListener("click", () => {
  const headers = ["nome", "categoria", "quantidade", "estoque_minimo", "validade", "situacao"];
  const rows = products.map(p => [p.name, p.category, p.quantity, p.minimum, p.expiry, statusOf(p)]);
  const csv = [headers, ...rows].map(row => row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "estoque-vivo.csv"; a.click();
  URL.revokeObjectURL(url);
});
render();
