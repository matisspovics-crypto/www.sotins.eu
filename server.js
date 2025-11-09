import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(express.json());
app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { quantity, flavor } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Šotiņš - ${flavor}`,
            },
            unit_amount: 99,
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.YOUR_DOMAIN}/success.html`,
      cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
