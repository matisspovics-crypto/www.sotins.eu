const cfg = window.STORE_CONFIG;
const products = cfg.PRODUCTS.map((name, i) => ({
  id: i+1,
  name,
  price: Number(cfg.PRICE),
  img: `images/product_${i+1}.png`
}));

// Render products centered
const grid = document.getElementById('products');
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

// Cart state
let cart = [];
const cartCount = document.getElementById('cartCount');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');

function updateCartUI(){
  cartCount.textContent = cart.reduce((a,i)=>a+i.qty, 0);
  cartList.innerHTML = cart.map(item => `
    <li class="cart-item">
      <span>${item.name} × ${item.qty}</span>
      <span>€${(item.price*item.qty).toFixed(2)}</span>
    </li>
  `).join('') || '<li class="cart-item"><em>Grozs ir tukšs</em></li>';
  const total = cart.reduce((a,i)=>a+i.price*i.qty, 0);
  cartTotal.textContent = `€${total.toFixed(2)}`;
}

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

// Modal logic
const overlay = document.getElementById('overlay');
const cartModal = document.getElementById('cartModal');
const openCart = document.getElementById('openCart');
const closeCart = document.getElementById('closeCart');

function openCartModal(){
  overlay.hidden = false;
  cartModal.hidden = false;
}
function closeCartModal(){
  overlay.hidden = true;
  cartModal.hidden = true;
}
openCart.addEventListener('click', openCartModal);
closeCart.addEventListener('click', closeCartModal);
overlay.addEventListener('click', ()=>{
  closeCartModal();
  closeCheckoutModal();
});

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const orderForm = document.getElementById('orderForm');

function openCheckoutModal(){
  cartModal.hidden = true;
  checkoutModal.hidden = false;
}
function closeCheckoutModal(){
  checkoutModal.hidden = true;
}
checkoutBtn.addEventListener('click', ()=>{
  if(cart.length === 0){ showToast('Grozs ir tukšs'); return; }
  openCheckoutModal();
});
closeCheckout.addEventListener('click', closeCheckoutModal);

// Email "notification" via mailto (client's email app). Replace cfg.EMAIL with your inbox.
orderForm.addEventListener('submit', (e)=>{
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
});

// Toast
const toast = document.getElementById('toast');
function showToast(msg){
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast.t);
  showToast.t = setTimeout(()=>toast.hidden = true, 1600);
}

document.getElementById('year').textContent = new Date().getFullYear();
updateCartUI();
