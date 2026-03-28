const express = require("express");
const cors = require("cors");
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const app = express();
app.use(cors());
app.use(express.json());

const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });

const EXCHANGE_API_KEY = "45b66183fc855a9646fb8a9e";
const EXCHANGE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

// Country metadata
const COUNTRIES = {
  NPR: { name: "Nepal", flag: "🇳🇵", language: "Nepali", avgFee: "$4-6", currency: "NPR" },
  INR: { name: "India", flag: "🇮🇳", language: "Hindi", avgFee: "$3-5", currency: "INR" },
  EGP: { name: "Egypt", flag: "🇪🇬", language: "Arabic", avgFee: "$4-7", currency: "EGP" },
  PHP: { name: "Philippines", flag: "🇵🇭", language: "Filipino", avgFee: "$3-5", currency: "PHP" },
  MXN: { name: "Mexico", flag: "🇲🇽", language: "Spanish", avgFee: "$3-5", currency: "MXN" },
  BDT: { name: "Bangladesh", flag: "🇧🇩", language: "Bengali", avgFee: "$4-6", currency: "BDT" },
  PKR: { name: "Pakistan", flag: "🇵🇰", language: "Urdu", avgFee: "$4-6", currency: "PKR" },
  ETB: { name: "Ethiopia", flag: "🇪🇹", language: "Amharic", avgFee: "$5-8", currency: "ETB" },
};

let cachedRates = null;
let cacheTime = 0;

async function getExchangeRates() {
  if (cachedRates && Date.now() - cacheTime < 3600000) return cachedRates;
  const res = await fetch(EXCHANGE_API_URL);
  const data = await res.json();
  if (data.result !== "success") throw new Error("Exchange rate API failed");
  cachedRates = data.conversion_rates;
  cacheTime = Date.now();
  return cachedRates;
}

app.post("/analyze", async (req, res) => {
  try {
    const { amount, currency, service, offeredRate, fee, terms } = req.body;

    const rates = await getExchangeRates();
    const realRate = rates[currency];
    if (!realRate) return res.status(400).json({ error: "Unsupported currency" });

    const country = COUNTRIES[currency] || { name: currency, flag: "", language: "English", avgFee: "$4-6", currency };

    const prompt = `You are RemitSafe, an AI that protects immigrant families from remittance fraud and unfair transfers.

TRANSACTION:
- Sending: $${amount} USD to ${country.name}
- Service: ${service}
- Offered rate: 1 USD = ${offeredRate} ${currency}
- Real market rate: 1 USD = ${realRate} ${currency} (fetched live just now)
- Fee charged: $${fee}
- Average corridor fee for ${country.name}: ${country.avgFee}
${terms ? `- Terms & conditions pasted by user: "${terms}"` : "- No terms provided"}

ANALYZE and return a JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):
{
  "riskScore": <number 0-10>,
  "summary": "<one sentence plain-language summary of how much money they're losing>",
  "rateAnalysis": {
    "offeredRate": <number>,
    "realRate": <number>,
    "markupPercent": <number with 1 decimal>,
    "moneyLost": <number with 2 decimals, the dollar amount lost due to rate markup>
  },
  "feeAnalysis": {
    "feeCharged": <number>,
    "feePercent": <number with 1 decimal>,
    "industryAverage": "<string like '$4-6'>",
    "verdict": "<'fair' | 'high' | 'very high'>"
  },
  "termsRedFlags": [
    "<plain language explanation of each concerning clause, or empty array if no terms>"
  ],
  "scamPatterns": [
    "<any matching scam patterns from: advance fee scam, rate bait-and-switch, impersonation of bank/government, phishing links, hidden 'processing fees', fake urgency/deadline, unlicensed operator, too-good-to-be-true rates, mandatory minimum amounts, no receipt/tracking>"
  ],
  "alternatives": [
    {
      "service": "<name>",
      "fee": "<fee amount>",
      "rateInfo": "<brief rate comparison>",
      "estimatedSavings": "<dollar amount saved>"
    }
  ],
  "alertInLanguage": "<the FULL alert translated into ${country.language} — include the summary, rate analysis, fee analysis, and recommendation in ${country.language}>",
  "language": "${country.language}"
}

Be specific with numbers. Calculate the actual dollar amounts lost. Be protective of the sender — if something looks even slightly off, flag it. These are real families sending money home.`;

    const command = new InvokeModelCommand({
      modelId: "us.anthropic.claude-sonnet-4-20250514",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.content[0].text;

    // Parse JSON from response (handle possible markdown fences)
    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response", raw: text });
    }

    res.json({
      ...analysis,
      country: country.name,
      flag: country.flag,
      realRate,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Simple health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`RemitSafe server running on port ${PORT}`));
