const cartCount = document.getElementById('cartCount');
let count = 0;
function toast(msg){
  let t = document.createElement('div');
  t.className='toast'; t.textContent=msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),200)}, 1500);
}
document.querySelectorAll('.buy').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    count++; cartCount.textContent = count;
    toast(`${btn.dataset.name} pievienots grozam (€${btn.dataset.price})`);
  });
});