const cfg = window.STORE_CONFIG;
const products = cfg.PRODUCTS.map((name, i) => ({
  id: i+1,
  name,
  price: Number(cfg.PRICE),
  img: `images/product_${i+1}.png`
}));

const grid = document.getElementById('products');
if(grid){
  grid.innerHTML = products.map(p => `
    <article class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <div class="meta">
        <span class="price">€${p.price.toFixed(2)}</span>
        <button class="buy" data-id="${p.id}">Pirkt</button>
      </div>
    </article>
  `).join('');
}

// Cart state (global across pages)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const cartCount = document.getElementById('cartCount');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');

function updateCartUI(){
  if(cartCount) cartCount.textContent = cart.reduce((a,i)=>a+i.qty, 0);
  if(cartList) cartList.innerHTML = cart.map(item => `
    <li class="cart-item">
      <span>${item.name} × ${item.qty}</span>
      <span>€${(item.price*item.qty).toFixed(2)}</span>
    </li>
  `).join('') || '<li class="cart-item"><em>Grozs ir tukšs</em></li>';
  if(cartTotal){
    const total = cart.reduce((a,i)=>a+i.price*i.qty, 0);
    cartTotal.textContent = `€${total.toFixed(2)}`;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

if(grid){
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.buy');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const p = products.find(x=>x.id===id);
    const ex = cart.find(x=>x.id===id);
    if(ex) ex.qty += 1; else cart.push({ ...p, qty: 1 });
    updateCartUI();
    showToast(`${p.name} pievienots grozam`);
  });
}

// Modal logic
const overlay = document.getElementById('overlay');
const cartModal = document.getElementById('cartModal');
const openCart = document.getElementById('openCart');
const closeCart = document.getElementById('closeCart');

function openCartModal(){ if(overlay && cartModal){ overlay.hidden = false; cartModal.hidden = false; } }
function closeCartModal(){ if(overlay && cartModal){ overlay.hidden = true; cartModal.hidden = true; } }

if(openCart) openCart.addEventListener('click', openCartModal);
if(closeCart) closeCart.addEventListener('click', closeCartModal);
if(overlay) overlay.addEventListener('click', ()=>{
  closeCartModal();
  closeCheckoutModal();
});

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const orderForm = document.getElementById('orderForm');

function openCheckoutModal(){ if(checkoutModal){ checkoutModal.hidden = false; if(cartModal) cartModal.hidden = true; } }
function closeCheckoutModal(){ if(checkoutModal) checkoutModal.hidden = true; }

if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{
  if(cart.length === 0){ showToast('Grozs ir tukšs'); return; }
  openCheckoutModal();
});
if(closeCheckout) closeCheckout.addEventListener('click', closeCheckoutModal);

if(orderForm) orderForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(orderForm).entries());
  const items = cart.map(i => `${i.name} x ${i.qty} = €${(i.price*i.qty).toFixed(2)}`).join('%0A');
  const total = cart.reduce((a,i)=>a+i.price*i.qty, 0).toFixed(2);
  const subject = encodeURIComponent(`Jauns pasūtījums — €${total}`);
  const body = encodeURIComponent(
    `Pasūtījums:%0A${items}%0A%0AKopā: €${total}%0A%0AKlienta dati:%0AVārds: ${data.name}%0ATelefons: ${data.phone}%0AE-pasts: ${data.email}%0AAdrese/komentāri: ${data.notes || ''}`
  );
  const mailto = `mailto:${cfg.EMAIL}?subject=${subject}&body=${body}`;
  window.location.href = mailto;
  showToast('Pasūtījums sagatavots e-pastam.');
  cart = []; updateCartUI();
});

// Toast
const toast = document.getElementById('toast');
function showToast(msg){
  if(!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast.t);
  showToast.t = setTimeout(()=>toast.hidden = true, 1600);
}

document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
updateCartUI();
