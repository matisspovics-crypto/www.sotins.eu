=============================
ŠOTIŅŠ SERVER (sotins-server)
=============================

1️⃣ Atver Render.com → New → Web Service
2️⃣ Upload šo ZIP failu
3️⃣ Build Command: npm install
4️⃣ Start Command: npm start

5️⃣ Pievieno Environment Variables:
   STRIPE_SECRET_KEY=sk_live_... (tava slepenā atslēga)
   YOUR_DOMAIN=https://www.sotins.eu

6️⃣ Spied "Deploy" un gaidi līdz statusam "Live"

Pēc tam Render dos tev adresi, piemēram:
👉 https://sotins-server.onrender.com

Šo adresi ievieto savā mājaslapas script.js:
const SERVER_BASE = "https://sotins-server.onrender.com";

=============================
