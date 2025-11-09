// script.js — ŠOTIŅŠ frontend (LV/EN). Sends combined cart to SERVER_BASE/create-checkout-session
const PRODUCTS = [
  { id:'pumpkin', lv:'Ķirbis', en:'Pumpkin', desc_lv:'Sildošs un bagāts ar vitamīniem', desc_en:'Warming and vitamin-rich' , price_cents:99 },
  { id:'quince', lv:'Cidonija', en:'Quince', desc_lv:'Īpaša, dziļa garša', desc_en:'Unique deep flavor', price_cents:99 },
  { id:'lime', lv:'Laims', en:'Lime', desc_lv:'Svaigs un atsvaidzinošs', desc_en:'Fresh and zesty', price_cents:99 },
  { id:'orange', lv:'Apelsīns', en:'Orange', desc_lv:'C vitamīna sprādziens', desc_en:'Vitamin C burst', price_cents:99 },
  { id:'spruce', lv:'Eglu skujas', en:'Spruce tips', desc_lv:'Raksturīga un dabīga', desc_en:'Earthy and natural', price_cents:99 },
  { id:'honey', lv:'Medus', en:'Honey', desc_lv:'Maigs un salds', desc_en:'Soft and sweet', price_cents:99 },
  { id:'kiwi', lv:'Kivi', en:'Kiwi', desc_lv:'Tropu un dzīvīgums', desc_en:'Tropical vibrance', price_cents:99 },
  { id:'grapefruit', lv:'Greipfrūts', en:'Grapefruit', desc_lv:'Sāļi-saldskābs', desc_en:'Tart and tangy', price_cents:99 },
  { id:'apple', lv:'Ābols', en:'Apple', desc_lv:'Klasika — veselīgi un garšīgi', desc_en:'Classic and healthy', price_cents:99 }
];

const STRIPE_PUBLISHABLE_KEY = typeof STRIPE_PUBLISHABLE_KEY !== 'undefined' ? STRIPE_PUBLISHABLE_KEY : 'REPLACE_KEY';
const SERVER_BASE = typeof SERVER_BASE !== 'undefined' ? SERVER_BASE : 'REPLACE_SERVER';

let lang = 'lv';
const productsEl = document.getElementById('products');
const cart = {}; // id -> quantity

function formatPrice(cents){ return '€' + (cents/100).toFixed(2); }

function renderProducts(){ 
  productsEl.innerHTML = '';
  PRODUCTS.forEach(p => {
    const title = lang==='lv' ? p.lv : p.en;
    const desc = lang==='lv' ? p.desc_lv : p.desc_en;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="pill-img">${renderSVGPlaceholder(p.id)}</div>
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

def renderSVGPlaceholder(id):
    pass
