
const PRODUCTS = [{"id": "pumpkin", "lv": "Ķirbis", "en": "Pumpkin", "desc_lv": "Sildošs un bagāts ar vitamīniem", "desc_en": "Warming and vitamin-rich", "image": "images/pumpkin.png", "price_cents": 99}, {"id": "quince", "lv": "Cidonija", "en": "Quince", "desc_lv": "Īpaša, dziļa garša", "desc_en": "Unique deep flavor", "image": "images/quince.png", "price_cents": 99}, {"id": "lime", "lv": "Laims", "en": "Lime", "desc_lv": "Svaigs un atsvaidzinošs", "desc_en": "Fresh and zesty", "image": "images/lime.png", "price_cents": 99}, {"id": "orange", "lv": "Apelsīns", "en": "Orange", "desc_lv": "C vitamīna sprādziens", "desc_en": "Vitamin C burst", "image": "images/orange.png", "price_cents": 99}, {"id": "spruce", "lv": "Eglu skujas", "en": "Spruce tips", "desc_lv": "Raksturīga un dabīga", "desc_en": "Earthy and natural", "image": "images/spruce.png", "price_cents": 99}, {"id": "honey", "lv": "Medus", "en": "Honey", "desc_lv": "Maigs un salds", "desc_en": "Soft and sweet", "image": "images/honey.png", "price_cents": 99}, {"id": "kiwi", "lv": "Kivi", "en": "Kiwi", "desc_lv": "Tropu un dzīvīgums", "desc_en": "Tropical vibrance", "image": "images/kiwi.png", "price_cents": 99}, {"id": "grapefruit", "lv": "Greipfrūts", "en": "Grapefruit", "desc_lv": "Sāļi-saldskābs", "desc_en": "Tart and tangy", "image": "images/grapefruit.png", "price_cents": 99}, {"id": "apple", "lv": "Ābols", "en": "Apple", "desc_lv": "Klasika — veselīgi un garšīgi", "desc_en": "Classic and healthy", "image": "images/apple.png", "price_cents": 99}];
const STRIPE_PUBLISHABLE_KEY = "pk_test_51S2YyNRa9CNQd184ZYm61EBf5G1ZdAOGxQiBC2S9HNfWb2hgAPPRyiTmWJjm5BlgWH2bJwwKri1IO8rkve3S5Yrt00BxhWF6Br";
const SERVER_BASE = "https://api.sotins.eu";

let lang = 'lv';
const productsEl = document.getElementById('products');
const cart = {};

function formatPrice(cents){ return '€' + (cents/100).toFixed(2); }

function renderProducts(){
  productsEl.innerHTML = '';
  PRODUCTS.forEach(p => {
    const title = lang==='lv' ? p.lv : p.en;
    const desc = lang==='lv' ? p.desc_lv : p.desc_en;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="pill-img"><img src="${p.image}" alt="${title}"></div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="controls">
        <select class="qty" data-id="${p.id}">
          ${[...Array(10)].map((_,i)=>`<option value="${i+1}">${i+1} gab.</option>`).join('')}
        </select>
        <button class="add-btn" data-id="${p.id}">${lang==='lv' ? 'Pievienot grozam' : 'Add to cart'}</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

function updateCartCount(){
  const count = Object.values(cart).reduce((s,n)=>s+n,0);
  document.getElementById('cart-count').textContent = count;
}

function renderCartItems(){
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  Object.keys(cart).forEach(id => {
    const p = PRODUCTS.find(x=>x.id===id);
    const title = lang==='lv' ? p.lv : p.en;
    const qty = cart[id];
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<div style="width:50px;height:50px;border-radius:8px;background:#f6f6f6;display:flex;align-items:center;justify-content:center">${title.charAt(0)}</div>
      <div style="flex:1"><h4>${title}</h4><div>${formatPrice(p.price_cents)} × ${qty}</div></div>
      <div><button class="remove" data-id="${id}">-</button></div>`;
    container.appendChild(div);
  });
  const total = Object.keys(cart).reduce((s,id)=> s + (cart[id]*PRODUCTS.find(p=>p.id===id).price_cents), 0);
  document.getElementById('cart-total').textContent = formatPrice(total);
}

document.addEventListener('click', async (e) => {
  if(e.target.matches('.add-btn')){
    const id = e.target.getAttribute('data-id');
    const select = e.target.closest('.card').querySelector('.qty');
    const qty = parseInt(select.value,10) || 1;
    cart[id] = (cart[id]||0) + qty;
    updateCartCount();
  } else if(e.target.id === 'view-cart' || e.target.closest('#view-cart')){
    const panel = document.getElementById('cart-panel');
    panel.classList.toggle('visible');
    panel.setAttribute('aria-hidden', panel.classList.contains('visible') ? 'false' : 'true');
    renderCartItems();
  } else if(e.target.matches('.remove')){
    const id = e.target.getAttribute('data-id');
    if(cart[id] > 1){ cart[id] -= 1; } else { delete cart[id]; }
    renderCartItems(); updateCartCount();
  } else if(e.target.id === 'checkout' || e.target.closest('#checkout')){
    const items = Object.keys(cart).map(id => ({ id, quantity: cart[id] }));
    if(items.length === 0){ alert(lang==='lv' ? 'Grozs ir tukšs' : 'Cart is empty'); return; }
    e.target.disabled = true; e.target.textContent = lang==='lv' ? 'Notiek...' : 'Processing...';
    try {
      const res = await fetch(`${SERVER_BASE}/create-checkout-session`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ items, locale: lang })
      });
      const data = await res.json();
      if(data.url){ window.location.href = data.url; } else { alert('Neizdevās izveidot maksājumu: ' + (data.error||'unknown')); e.target.disabled=false; e.target.textContent = lang==='lv' ? 'Pirkt tagad' : 'Buy now'; }
    } catch(err){ console.error(err); alert('Tīkla kļūda. Pārbaudi servera adresi un konsoli.'); e.target.disabled=false; e.target.textContent = lang==='lv' ? 'Pirkt tagad' : 'Buy now'; }
  }
});

// language buttons
document.getElementById('lang-lv').addEventListener('click', ()=>{ lang='lv'; document.getElementById('lang-lv').classList.add('active'); document.getElementById('lang-en').classList.remove('active'); renderProducts(); });
document.getElementById('lang-en').addEventListener('click', ()=>{ lang='en'; document.getElementById('lang-en').classList.add('active'); document.getElementById('lang-lv').classList.remove('active'); renderProducts(); });

// initial render
renderProducts();
updateCartCount();
