// script.js — produkts un maksājuma loģika (vienkārši rediģējams)
const PRODUCTS = [
  { id: 'pumpkin', title: 'Ķirbis', description: 'Sildošs un bagāts ar vitamīniem', image: 'https://images.unsplash.com/photo-1601924928552-7d9b4f3b0a2f?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'quince', title: 'Cidonija', description: 'Īpaša, dziļa garša', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'lime', title: 'Laims', description: 'Svaigs un atsvaidzinošs', image: 'https://images.unsplash.com/photo-1518631011921-8d3b48f6a5c9?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'orange', title: 'Apelsīns', description: 'C vitamīna sprādziens', image: 'https://images.unsplash.com/photo-1502741126161-b048400d6f6d?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'spruce', title: 'Eglu skujas', description: 'Raksturīga un dabīga', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'honey', title: 'Medus', description: 'Maigs un salds', image: 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8962?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'kiwi', title: 'Kivi', description: 'Tropu un dzīvīgums', image: 'https://images.unsplash.com/photo-1562166433-a9d0ffb6d5a6?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'grapefruit', title: 'Greipfrūts', description: 'Sāļi-saldskābs', image: 'https://images.unsplash.com/photo-1582719478250-1a1ae6a2f8c1?auto=format&fit=crop&w=800&q=60', price_cents: 99 },
  { id: 'apple', title: 'Ābols', description: 'Klasika — veselīgi un garšīgi', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60', price_cents: 99 }
];

const STRIPE_PUBLISHABLE_KEY = typeof STRIPE_PUBLISHABLE_KEY !== 'undefined' ? STRIPE_PUBLISHABLE_KEY : 'REPLACE_KEY';
const SERVER_BASE = typeof SERVER_BASE !== 'undefined' ? SERVER_BASE : 'REPLACE_SERVER';

function formatPrice(cents){ return '€' + (cents/100).toFixed(2); }

const productsEl = document.getElementById('products');
PRODUCTS.forEach(p => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="pill-img"><img src="${p.image}" alt="${p.title}"></div>
    <h3>${p.title}</h3>
    <p>${p.description}</p>
    <div class="controls">
      <select class="qty" data-id="${p.id}">
        ${[...Array(10)].map((_,i)=>`<option value="${i+1}">${i+1} gab.</option>`).join('')}
      </select>
      <button class="buy-btn" data-id="${p.id}">Pirkt tagad · ${formatPrice(p.price_cents)}</button>
    </div>
  `;
  productsEl.appendChild(card);
});

productsEl.addEventListener('click', async (e) => {
  if(!e.target.matches('.buy-btn')) return;
  const id = e.target.getAttribute('data-id');
  const select = productsEl.querySelector(`.qty[data-id="${id}"]`);
  const quantity = parseInt(select.value || '1', 10);
  e.target.disabled = true;
  e.target.textContent = 'Notiek...';

  try {
    const res = await fetch(`${SERVER_BASE}/create-checkout-session`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ productId: id, quantity })
    });
    const data = await res.json();
    if(data.url){
      window.location.href = data.url;
    } else {
      alert('Neizdevās izveidot maksājumu: ' + (data.error || 'Nepazīstama kļūda'));
      e.target.disabled = false;
      e.target.textContent = `Pirkt tagad · ${formatPrice(PRODUCTS.find(x=>x.id===id).price_cents)}`;
    }
  } catch (err) {
    console.error(err);
    alert('Tīkla kļūda. Pārbaudi servera adresi un konsoli.');
    e.target.disabled = false;
    e.target.textContent = `Pirkt tagad · ${formatPrice(PRODUCTS.find(x=>x.id===id).price_cents)}`;
  }
});