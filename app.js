// Sotins.eu – grozs ar daudzuma izvēli un pasūtījumu uz PHP (order.php)

// Konfigurācija
const cfg = window.STORE_CONFIG || { PRICE: 0.99 };

// Produktu saraksts
const products = [
  { id: 1, name: "Ķirbīgā Cidonija",      price: Number(cfg.PRICE), img: "images/product_1.png" },
  { id: 2, name: "Laimīgais Skujiņš",     price: Number(cfg.PRICE), img: "images/product_2.png" },
  { id: 3, name: "Vitamīnu Bumba",        price: Number(cfg.PRICE), img: "images/product_3.png" },
  { id: 4, name: "Tropiskais lietus",     price: Number(cfg.PRICE), img: "images/product_4.png" },
  { id: 5, name: "Ziemassvētku šots",     price: Number(cfg.PRICE), img: "images/product_5.png" },
  { id: 6, name: "Šotiņš Tradicionālais", price: Number(cfg.PRICE), img: "images/product_6.png" },
  { id: 7, name: "Sporta Miķelis",        price: Number(cfg.PRICE), img: "images/product_7.png" },
  { id: 8, name: "Vairāk Saules",         price: Number(cfg.PRICE), img: "images/product_8.png" },
  { id: 9, name: "Gurķīgais Spēks",       price: Number(cfg.PRICE), img: "images/product_9.png" },
];

// ELEMENTI
const grid             = document.getElementById("products");
const cartBtn          = document.getElementById("cartBtn");
const overlay          = document.getElementById("overlay");
const cartModal        = document.getElementById("cartModal");
const closeCartBtn     = document.getElementById("closeCart");
const checkoutModal    = document.getElementById("checkoutModal");
const closeCheckoutBtn = document.getElementById("closeCheckout");
const checkoutBtn      = document.getElementById("checkoutBtn");
const orderForm        = document.getElementById("orderForm");
const toast            = document.getElementById("toast");
const clearCartBtn     = document.getElementById("clearCartBtn");

// Vienkāršas show/hide funkcijas
function show(el){
  if(!el) return;
  if(el.hasAttribute("hidden")) el.hidden = false;
  else el.style.display = "block";
}
function hide(el){
  if(!el) return;
  if(el.hasAttribute("hidden")) el.hidden = true;
  else el.style.display = "none";
}

// Paziņojums
function showToast(msg){
  if(!toast){ alert(msg); return; }
  toast.textContent = msg;
  show(toast);
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> hide(toast), 1800);
}

// ***** PRODUKTU ĢENERĒŠANA AR DAUDZUMA POGĀM *****

if(grid){
  grid.innerHTML = products.map(p => `
    <article class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>

      <div class="qty-box">
        <button class="qty-minus" data-id="${p.id}">−</button>
        <span class="qty" data-id="${p.id}">1</span>
        <button class="qty-plus" data-id="${p.id}">+</button>
      </div>

      <div class="meta">
        <span class="price">€${p.price.toFixed(2)}</span>
        <button class="buy" data-id="${p.id}">Pirkt</button>
      </div>
    </article>
  `).join("");
}

// ***** GROZS *****

let cart = [];
try{
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
}catch(_){ cart = []; }

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI(){
  const cartCount = document.getElementById("cartCount");
  const cartList  = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");

  if(cartCount){
    cartCount.textContent = cart.reduce((sum, i)=>sum + i.qty, 0);
  }

  if(cartList){
    if(cart.length === 0){
      cartList.innerHTML = '<li class="cart-item"><em>Grozs ir tukšs</em></li>';
    }else{
      cartList.innerHTML = cart.map(i => `
        <li class="cart-item">
          <span>${i.name} × ${i.qty}</span>
          <span>€${(i.price * i.qty).toFixed(2)}</span>
        </li>
      `).join("");
    }
  }

  if(cartTotal){
    const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
    cartTotal.textContent = "€" + total.toFixed(2);
  }

  saveCart();
}
updateCartUI();

// ***** DAUDZUMA LOĢIKA (qty + / -) *****

// Karte ar daudzumiem
const qtyMap = {};

// Klausāmies klikšķus uz visiem produktiem
if(grid){
  grid.addEventListener("click", e => {
    const plus = e.target.closest(".qty-plus");
    const minus = e.target.closest(".qty-minus");
    const buyBtn = e.target.closest(".buy");

    // + poga
    if(plus){
      const id = plus.dataset.id;
      const current = qtyMap[id] || 1;
      const next = current + 1;
      qtyMap[id] = next;
      const span = grid.querySelector(`.qty[data-id="${id}"]`);
      if(span) span.textContent = String(next);
      return;
    }

    // - poga
    if(minus){
      const id = minus.dataset.id;
      const current = qtyMap[id] || 1;
      const next = Math.max(1, current - 1);
      qtyMap[id] = next;
      const span = grid.querySelector(`.qty[data-id="${id}"]`);
      if(span) span.textContent = String(next);
      return;
    }

    // PIRKT poga
    if(buyBtn){
      const id = Number(buyBtn.dataset.id);
      const product = products.find(p => p.id === id);
      if(!product) return;

      const qty = qtyMap[id] || 1;

      const existing = cart.find(i => i.id === id);
      if(existing) existing.qty += qty;
      else cart.push({ ...product, qty });

      updateCartUI();
      showToast(`${product.name} × ${qty} pievienots grozam`);
      return;
    }
  });
}

// ***** GROZA MODĀLIS *****

if(cartBtn){
  cartBtn.addEventListener("click", () => {
    show(overlay);
    show(cartModal);
  });
}
if(closeCartBtn){
  closeCartBtn.addEventListener("click", () => {
    hide(cartModal);
    hide(overlay);
  });
}
if(overlay){
  overlay.addEventListener("click", () => {
    hide(cartModal);
    hide(checkoutModal);
    hide(overlay);
  });
}

// Iztukšot grozu (ja ir poga ar id="clearCartBtn")
function clearCart(){
  cart = [];
  updateCartUI();
  showToast("Grozs iztukšots");
}
if(clearCartBtn){
  clearCartBtn.addEventListener("click", clearCart);
}

// ***** CHECKOUT MODĀLIS + PASŪTĪJUMA NOSŪTĪŠANA *****

if(checkoutBtn){
  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0){
      showToast("Grozs ir tukšs");
      return;
    }
    hide(cartModal);
    show(checkoutModal);
    show(overlay);
  });
}
if(closeCheckoutBtn){
  closeCheckoutBtn.addEventListener("click", () => {
    hide(checkoutModal);
    hide(overlay);
  });
}

// Pasūtījuma nosūtīšana uz order.php
if(orderForm){
  orderForm.addEventListener("submit", e => {
    e.preventDefault();
    if(cart.length === 0){
      showToast("Grozs ir tukšs");
      return;
    }

    const formData = new FormData(orderForm);
    const data = Object.fromEntries(formData.entries());

    const itemsText = cart.map(i =>
      `${i.name} x ${i.qty} = €${(i.price * i.qty).toFixed(2)}`
    ).join("\n");

    const total = cart.reduce((s,i)=>s + i.price * i.qty, 0).toFixed(2);

    const payload = {
      name:  data.name  || "",
      phone: data.phone || "",
      email: data.email || "",
      notes: data.notes || "",
      items: itemsText,
      total: total
    };

    fetch("order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(res => {
      if(res.ok){
        showToast("Pasūtījums nosūtīts!");
        cart = [];
        updateCartUI();
        orderForm.reset();
        hide(checkoutModal);
        hide(overlay);
      } else {
        showToast("Kļūda, pasūtījumu nevar nosūtīt.");
      }
    }).catch(() => {
      showToast("Savienojuma kļūda.");
    });
  });
}
