const productsContainer = document.getElementById('products');
let locale = 'lv';

async function loadProducts() {
  const res = await fetch('products.json');
  const data = await res.json();
  renderProducts(data);
}

function renderProducts(products) {
  productsContainer.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.bilde}" alt="${p.nosaukums}">
      <h3>${p.nosaukums}</h3>
      <p>${p.apraksts}</p>
      <p><strong>${p.cena.toFixed(2)} €</strong></p>
      <input type="number" min="0" max="10" value="0" id="qty-${p.nosaukums}">
    `;
    productsContainer.appendChild(div);
  });
}

document.getElementById('lvBtn').addEventListener('click', () => {
  locale = 'lv';
  loadProducts();
});

document.getElementById('enBtn').addEventListener('click', () => {
  locale = 'en';
  loadProducts();
});

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const res = await fetch('products.json');
  const products = await res.json();
  const items = products.map(p => {
    const qty = parseInt(document.getElementById(`qty-${p.nosaukums}`).value) || 0;
    return { id: p.nosaukums, quantity: qty };
  }).filter(i => i.quantity > 0);

  if (items.length === 0) {
    alert('Lūdzu izvēlies vismaz vienu šotiņu!');
    return;
  }

  const response = await fetch('https://www-sotins-eu-2.onrender.com/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, locale })
  });

  const session = await response.json();
  if (session.url) {
    window.location.href = session.url;
  } else {
    alert('Kļūda pie maksājuma izveides!');
  }
});

loadProducts();
