// UPDATED APP.JS AFTER SWITCH TO MANUAL HTML PRODUCTS
const cfg = window.STORE_CONFIG || { PRICE: 0.99 };

// Manual product list (used only for cart functionality)
const products = [
  { id: 1, name: "Ķirbīgā Cidonija",      price: Number(cfg.PRICE) },
  { id: 2, name: "Laimīgais Skujiņš",     price: Number(cfg.PRICE) },
  { id: 3, name: "Vitamīnu Bumba",        price: Number(cfg.PRICE) },
  { id: 4, name: "Tropiskais lietus",     price: Number(cfg.PRICE) },
  { id: 5, name: "Ziemassvētku šots",     price: Number(cfg.PRICE) },
  { id: 6, name: "Šotiņš Tradicionālais", price: Number(cfg.PRICE) },
  { id: 7, name: "Sporta Miķelis",        price: Number(cfg.PRICE) },
  { id: 8, name: "Vairāk Saules",         price: Number(cfg.PRICE) },
  { id: 9, name: "Gurķīgais Spēks",       price: Number(cfg.PRICE) },
];

const grid = document.getElementById('products');

// Load cart
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartUI(){
  const cartCount = document.getElementById('cartCount');
  const cartList  = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');

  if(cartCount) cartCount.textContent = cart.reduce((a,i)=>a+i.qty,0);

  if(cartList){
    cartList.innerHTML = cart.map(item => `
      <li class="cart-item">
        <span>${item.name} × ${item.qty}</span>
        <span>€${(item.price*i.qty).toFixed(2)}</span>
      </li>
    `).join('') || '<li class="cart-item"><em>Grozs ir tukšs</em></li>';
  }

  if(cartTotal){
    const total = cart.reduce((a,i)=>a+i.price*i.qty,0);
    cartTotal.textContent = "€" + total.toFixed(2);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}
updateCartUI();

// Add to cart
if(grid){
  grid.addEventListener('click', e => {
    if(e.target.classList.contains('buy')){
      const id = Number(e.target.dataset.id);
      const product = products.find(x => x.id === id);
      if(product){
        const existing = cart.find(x => x.id === id);
        if(existing) existing.qty++;
        else cart.push({ ...product, qty: 1 });
        updateCartUI();
        alert("Pievienots grozam!");
      }
    }
  });
}

// Checkout form handling remains unchanged
document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById('orderForm');
  if(!orderForm) return;

  orderForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(orderForm).entries());

    const itemsText = cart.map(i =>
      `${i.name} x ${i.qty} = €${(i.price*i.qty).toFixed(2)}`
    ).join('\n');

    const total = cart.reduce((a,i)=>a+i.price*i.qty, 0).toFixed(2);

    const payload = {
      name:  data.name,
      phone: data.phone,
      email: data.email,
      notes: data.notes || "",
      items: itemsText,
      total: total
    };

    fetch('order.php', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      if(res.ok){
        alert("Pasūtījums nosūtīts!");
        cart = [];
        updateCartUI();
        orderForm.reset();
      } else {
        alert("KĻŪDA! Pasūtījumu nevar nosūtīt.");
      }
    }).catch(()=>{
      alert("Savienojuma kļūda!");
    });
  });
});
