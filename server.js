const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const SECRET = process.env.SECRET || "changeme";

// Health check
app.get("/", (req, res) => res.send("✅ Server is running"));

// TradingView webhook
app.post("/tv", async (req, res) => {
  try {
    if (req.headers["x-secret"] !== SECRET) {
      return res.status(403).send("Forbidden");
    }

    const alert = req.body;
    console.log("📩 Received alert:", alert);

    await axios.post(DISCORD_WEBHOOK_URL, {
      content: `📈 TradingView Alert:\n${JSON.stringify(alert, null, 2)}`
    });

    res.status(200).send("ok");
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).send("error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
