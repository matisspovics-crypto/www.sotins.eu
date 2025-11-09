ŠOTIŅŠ — Frontend pakete (spilgts & košs)
-------------------------------------------

Kas iekļauts:
- index.html, style.css, script.js, success.html, cancel.html
- Script jau iestatīts lai sūtītu maksājumu pieprasījumus uz:
    https://www-sotins-eu-2.onrender.com/create-checkout-session
- Publiskā Stripe atslēga (test): pk_test_51S2YyNRa9CNQd184ZYm61EBf5G1ZdAOGxQiBC2S9HNfWb2hgAPPRyiTmWJjm5BlgWH2bJwwKri1IO8rkve3S5Yrt00BxhWF6Br

Kā izmantot:
1) Ielādē šos failus uz sava hostinga publiskās mapes (www.sotins.eu)
2) Pārliecinies, ka tavas lapas faili ir pieejami HTTPS: https://www.sotins.eu
3) Serverim jābūt LIVE un pieejamam: https://www-sotins-eu-2.onrender.com
   (server jābūt ar Stripe slepeno atslēgu un /create-checkout-session ceļu)
4) Atver https://www.sotins.eu un spied “Pirkt tagad” pie produkta — tiks atvērts Stripe Checkout

Kad pārnāc uz reālo darbību (live):
- Server .env: STRIPE_SECRET_KEY jāliek sk_live_...
- Frontend: nomainīt publisko atslēgu uz pk_live_... (ja nepieciešams)
