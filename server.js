// server.js - Stripe Checkout server for ŠOTIŅŠ
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY not set in environment. Set it before running in production.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// simple product catalog mapping (id -> name, price_cents)
const PRODUCTS = {
  pumpkin: { name: "Ķirbis", price_cents: 99 },
  quince: { name: "Cidonija", price_cents: 99 },
  lime: { name: "Laims", price_cents: 99 },
  orange: { name: "Apelsīns", price_cents: 99 },
  spruce: { name: "Eglu skujas", price_cents: 99 },
  honey: { name: "Medus", price_cents: 99 },
  kiwi: { name: "Kivi", price_cents: 99 },
  grapefruit: { name: "Greipfrūts", price_cents: 99 },
  apple: { name: "Ābols", price_cents: 99 }
};

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, locale } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Nederīgs vai tukšs items" });
    }

    const line_items = items.map(it => {
      const prod = PRODUCTS[it.id];
      if (!prod) {
        throw new Error("Unknown product id: " + it.id);
      }
      return {
        price_data: {
          currency: "eur",
          product_data: { name: prod.name },
          unit_amount: prod.price_cents
        },
        quantity: it.quantity || 1
      };
    });

    const domain = process.env.YOUR_DOMAIN || "https://api.sotins.eu";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${domain}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cancel.html`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
