ŠOTIŅŠ — Serveris priekš Stripe Checkout (API)
---------------------------------------------

Kas iekļauts:
- server.js        (Express + Stripe)
- package.json
- .env.example

Instrukcija (Render.com):
1) Ja nepieciešams, izveido GitHub repozitoriju vai izmanto "Upload from ZIP" uz Render.
2) New + → Web Service → Upload from ZIP
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
3) Environment Variables (Render dashboard → Environment):
   - STRIPE_SECRET_KEY = sk_test_... (vai sk_live_... kad gatavs)
   - YOUR_DOMAIN = https://api.sotins.eu
4) Deploy. Kad projektu izvieto, Render dos URL, piemēram: https://sotins-server.onrender.com
   Ja vēlies, lai frontend automātiski lieto api.sotins.eu, iestatiet CNAME vai DNS rekordu priekš api.sotins.eu.

Kā tas strādā frontend pusē:
- Frontend nosūta POST uz /create-checkout-session ar body:
  { items: [ { id: 'pumpkin', quantity: 2 }, ... ], locale: 'lv' }
- Serveris saprot produktu ID, izveido Stripe Checkout sesiju ar vairākiem line_items,
  un atgriež { url: session.url } — uz šīs adreses frontend pāradresē lietotāju.

Drošība:
- NEKAD neliec savu STRIPE_SECRET_KEY publiskos failos. Lieto .env vai Render 'Environment' settings.
- Ja ir problēmas, sūti man kļūdas ziņojumu (bez slepenajām atslēgām) un es palīdzēšu.
