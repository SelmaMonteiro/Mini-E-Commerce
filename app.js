// Dados de produtos (exemplo)
const produtos = [
  { id: 1, nome: "Headphone Bluetooth Pro", categoria: "Eletrônicos", preco: 349.9, rating: 4.7, vendidos: 1280, imagem: "https://picsum.photos/id/1060/800/600", tags: ["audio","bluetooth","pro"], estoque: 32 },
  { id: 2, nome: "Smartphone X 128GB", categoria: "Eletrônicos", preco: 2299.0, rating: 4.6, vendidos: 980, imagem: "https://picsum.photos/id/1011/800/600", tags: ["celular","android","camera"], estoque: 15 },
  { id: 3, nome: "Tênis Running Fast", categoria: "Moda", preco: 299.9, rating: 4.5, vendidos: 1540, imagem: "https://picsum.photos/id/1040/800/600", tags: ["esporte","conforto"], estoque: 50 },
  { id: 4, nome: "Cafeteira Elétrica 1100W", categoria: "Casa", preco: 229.9, rating: 4.2, vendidos: 740, imagem: "https://picsum.photos/id/1062/800/600", tags: ["cozinha","café"], estoque: 24 },
  { id: 5, nome: "Kit Skincare 4 itens", categoria: "Beleza", preco: 159.9, rating: 4.4, vendidos: 520, imagem: "https://picsum.photos/id/1027/800/600", tags: ["pele","hidratação"], estoque: 60 },
  { id: 6, nome: "Camiseta Básica Algodão", categoria: "Moda", preco: 69.9, rating: 4.1, vendidos: 2100, imagem: "https://picsum.photos/id/1059/800/600", tags: ["roupa","casual"], estoque: 120 },
  { id: 7, nome: "Smartwatch Fit V2", categoria: "Eletrônicos", preco: 499.9, rating: 4.3, vendidos: 870, imagem: "https://picsum.photos/id/103/800/600", tags: ["saúde","passos","sono"], estoque: 40 },
  { id: 8, nome: "Mochila Compacta 20L", categoria: "Esportes", preco: 199.9, rating: 4.2, vendidos: 630, imagem: "https://picsum.photos/id/20/800/600", tags: ["viagem","dia a dia"], estoque: 70 },
  { id: 9, nome: "Bola de Futebol Oficial", categoria: "Esportes", preco: 139.9, rating: 4.4, vendidos: 420, imagem: "https://picsum.photos/id/29/800/600", tags: ["esporte","campo"], estoque: 80 },
  { id: 10, nome: "Livro: JavaScript Moderno", categoria: "Livros", preco: 89.9, rating: 4.8, vendidos: 350, imagem: "https://picsum.photos/id/24/800/600", tags: ["programação","web"], estoque: 45 },
];

// Estado
const state = {
  busca: "",
  categoria: "",
  ordem: "popular",
  carrinho: loadCart(),
};

// Utilitários
const formatBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const bySel = (id) => document.getElementById(id);

// Elementos
const grid = bySel("productGrid");
const searchInput = bySel("searchInput");
const categorySelect = bySel("categorySelect");
const sortSelect = bySel("sortSelect");
const cartButton = bySel("cartButton");
const themeToggle = bySel("themeToggle");
const cartCount = bySel("cartCount");
const cartDrawer = bySel("cartDrawer");
const closeDrawer = bySel("closeDrawer");
const drawerOverlay = bySel("drawerOverlay");
const cartItems = bySel("cartItems");
const cartSubtotal = bySel("cartSubtotal");
const cartFrete = bySel("cartFrete");
const cartTotal = bySel("cartTotal");
const checkoutBtn = bySel("checkoutBtn");
const toast = bySel("toast");

// Inicialização
initCategories();
applyInitialTheme();
render();
wireEvents();

function initCategories() {
  const cats = [...new Set(produtos.map((p) => p.categoria))].sort();
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c; categorySelect.appendChild(opt);
  });
}

function wireEvents() {
  // Busca com debounce
  let t;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(t);
    t = setTimeout(() => { state.busca = e.target.value.trim().toLowerCase(); render(); }, 250);
  });

  categorySelect.addEventListener("change", (e) => { state.categoria = e.target.value; render(); });
  sortSelect.addEventListener("change", (e) => { state.ordem = e.target.value; render(); });

  cartButton.addEventListener("click", () => openDrawer(true));
  closeDrawer.addEventListener("click", () => openDrawer(false));
  drawerOverlay.addEventListener("click", () => openDrawer(false));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") openDrawer(false); });

  checkoutBtn.addEventListener("click", () => {
    showToast("Checkout simulado! Integre pagamentos quando desejar.");
  });

  // Tema
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
  });
}

function render() {
  const list = getFilteredSorted();
  grid.innerHTML = "";
  list.forEach((p) => grid.appendChild(productCard(p)));
  updateCartUI();
}

function getFilteredSorted() {
  let base = produtos.filter((p) => {
    const matchBusca = state.busca
      ? (p.nome.toLowerCase().includes(state.busca) || p.tags.join(" ").toLowerCase().includes(state.busca))
      : true;
    const matchCat = state.categoria ? p.categoria === state.categoria : true;
    return matchBusca && matchCat;
  });

  switch (state.ordem) {
    case "price_asc": base.sort((a,b) => a.preco - b.preco); break;
    case "price_desc": base.sort((a,b) => b.preco - a.preco); break;
    case "rating": base.sort((a,b) => b.rating - a.rating); break;
    default: base.sort((a,b) => b.vendidos - a.vendidos); break; // popular
  }
  return base;
}

function productCard(p) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="media">
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy" />
    </div>
    <div class="body">
      <div class="title">${p.nome}</div>
      <div class="muted">${p.categoria} · ⭐ <span class="rating">${p.rating.toFixed(1)}</span></div>
      <div class="price-row">
        <div class="price">${formatBRL(p.preco)}</div>
        <div class="installments">em até 10x de ${formatBRL(p.preco/10)}</div>
      </div>
      <div class="badges">
        ${p.preco >= 200 ? '<span class="badge-pill">Frete grátis</span>' : ''}
        <span class="badge-pill">Pix com 5% OFF</span>
        <span class="badge-pill">${p.vendidos} vendidos</span>
      </div>
      <div class="actions">
        <button class="btn" aria-label="Ver detalhes">Detalhes</button>
        <button class="btn primary" aria-label="Adicionar ao carrinho">Adicionar</button>
      </div>
    </div>
  `;

  const [btnDetalhes, btnAdd] = el.querySelectorAll(".actions .btn");
  btnDetalhes.addEventListener("click", () => showToast(`${p.nome} · estoque ${p.estoque}`));
  btnAdd.addEventListener("click", () => addToCart(p.id));
  return el;
}

// Carrinho
function addToCart(id) {
  state.carrinho[id] = (state.carrinho[id] || 0) + 1;
  saveCart();
  updateCartUI();
  showToast("Produto adicionado ao carrinho.");
  // animação de badge
  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 280);
}
function removeFromCart(id) {
  delete state.carrinho[id];
  saveCart();
  updateCartUI();
}
function adjustQty(id, delta) {
  const q = (state.carrinho[id] || 0) + delta;
  if (q <= 0) return removeFromCart(id);
  state.carrinho[id] = q;
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const ids = Object.keys(state.carrinho).map(Number);
  const items = ids.map((id) => {
    const prod = produtos.find((p) => p.id === id);
    return prod ? { ...prod, qty: state.carrinho[id] } : null;
  }).filter(Boolean);

  cartItems.innerHTML = items.map((item) => `
    <li class="cart-item">
      <img src="${item.imagem}" alt="${item.nome}" />
      <div>
        <div class="title">${item.nome}</div>
        <div class="muted">${formatBRL(item.preco)} · ${item.categoria}</div>
        <div class="qty">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="icon-btn" aria-label="Remover" data-action="remove" data-id="${item.id}">🗑️</button>
    </li>
  `).join("");

  cartItems.querySelectorAll(".qty-btn, .icon-btn").forEach((btn) => {
    const id = Number(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");
    btn.addEventListener("click", () => {
      if (action === "dec") adjustQty(id, -1);
      else if (action === "inc") adjustQty(id, 1);
      else if (action === "remove") removeFromCart(id);
    });
  });

  const subtotal = items.reduce((acc, it) => acc + it.preco * it.qty, 0);
  const frete = subtotal >= 200 ? 0 : (items.length ? 19.9 : 0);
  const total = subtotal + frete;

  cartSubtotal.textContent = formatBRL(subtotal);
  cartFrete.textContent = formatBRL(frete);
  cartTotal.textContent = formatBRL(total);
  cartCount.textContent = items.reduce((acc, it) => acc + it.qty, 0);
  checkoutBtn.disabled = items.length === 0;
}

function openDrawer(open) {
  cartDrawer.classList.toggle("open", open);
  cartDrawer.setAttribute("aria-hidden", String(!open));
  drawerOverlay.hidden = !open;
  cartButton.setAttribute("aria-expanded", String(open));
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

function saveCart() {
  localStorage.setItem("mini_cart", JSON.stringify(state.carrinho));
}
function loadCart() {
  try {
    const raw = localStorage.getItem("mini_cart");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

// Tema
function applyInitialTheme() {
  const t = loadTheme();
  setTheme(t);
}
function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
  const isLight = t === "light";
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", isLight ? "Alternar para tema escuro" : "Alternar para tema claro");
  themeToggle.setAttribute("aria-pressed", String(isLight));
}
function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)");
  return mq && mq.matches ? "light" : "dark";
}