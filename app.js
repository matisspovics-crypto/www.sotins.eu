// UPDATED APP.JS WITH AUTOMATIC EMAIL SENDING
const cfg = window.STORE_CONFIG;
const products = cfg.PRODUCTS.map((name,i)=>({
  id:i+1,
  name,
  price:Number(cfg.PRICE),
  img:`images/product_${i+1}.png`
}));

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartUI(){
  const cartCount = document.getElementById('cartCount');
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');

  if(cartCount) cartCount.textContent = cart.reduce((a,i)=>a+i.qty,0);

  if(cartList){
    cartList.innerHTML = cart.map(item => `
      <li class="cart-item">
        <span>${item.name} × ${item.qty}</span>
        <span>€${(item.price*item.qty).toFixed(2)}</span>
      </li>
    `).join('') || '<li class="cart-item"><em>Grozs ir tukšs</em></li>';
  }

  if(cartTotal){
    const total = cart.reduce((a,i)=>a+i.price*i.qty,0);
    cartTotal.textContent = `€${total.toFixed(2)}`;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}
updateCartUI();

// Handle checkout form → send to order.php
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
