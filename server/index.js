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
const BEDROCK_MODEL_ID = "us.anthropic.claude-sonnet-4-20250514-v1:0";

// ─── LLM MODE: "openrouter" | "bedrock" | "mock" ───
const LLM_MODE = "mock";

const OPENROUTER_KEY = "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";
const OPENROUTER_MODEL = "anthropic/claude-sonnet-4";

const EXCHANGE_API_KEY = "45b66183fc855a9646fb8a9e";
const EXCHANGE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

const COUNTRIES = {
  NPR: { name: "Nepal", flag: "🇳🇵", language: "Nepali", avgFee: "$4-6" },
  INR: { name: "India", flag: "🇮🇳", language: "Hindi", avgFee: "$3-5" },
  EGP: { name: "Egypt", flag: "🇪🇬", language: "Arabic", avgFee: "$4-7" },
  PHP: { name: "Philippines", flag: "🇵🇭", language: "Filipino", avgFee: "$3-5" },
  MXN: { name: "Mexico", flag: "🇲🇽", language: "Spanish", avgFee: "$3-5" },
  BDT: { name: "Bangladesh", flag: "🇧🇩", language: "Bengali", avgFee: "$4-6" },
  PKR: { name: "Pakistan", flag: "🇵🇰", language: "Urdu", avgFee: "$4-6" },
  ETB: { name: "Ethiopia", flag: "🇪🇹", language: "Amharic", avgFee: "$5-8" },
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

async function callLLM(prompt, maxTokens = 1500) {
  if (LLM_MODE === "openrouter") {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    return data.choices[0].message.content;
  }

  // Bedrock path
  const command = new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const response = await bedrock.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  return body.content[0].text;
}

function parseJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : null;
}

// ─── MOCK DATA: Preloaded realistic agent responses ───

function buildMockAgent1(txn, realRate, country) {
  const offeredRate = txn.offeredRate;
  const markupPercent = parseFloat((((realRate - offeredRate) / realRate) * 100).toFixed(1));
  const moneyLostOnRate = parseFloat(((realRate - offeredRate) / realRate * txn.amount).toFixed(2));
  const feePercent = parseFloat(((txn.fee / txn.amount) * 100).toFixed(1));

  const rateVerdict = markupPercent > 5 ? "predatory" : markupPercent > 2 ? "unfair" : "fair";
  const feeVerdict = txn.fee > 10 ? "very high" : txn.fee > 6 ? "high" : "fair";
  const riskScore = Math.min(10, Math.round(markupPercent * 0.7 + (feeVerdict === "very high" ? 3 : feeVerdict === "high" ? 2 : 0)));

  return {
    agentName: "Rate Anomaly Detector",
    rateAnalysis: {
      offeredRate,
      realRate,
      markupPercent: Math.abs(markupPercent),
      moneyLostOnRate: Math.abs(moneyLostOnRate),
      rateVerdict,
    },
    feeAnalysis: {
      feeCharged: txn.fee,
      feePercent,
      industryAverage: country.avgFee,
      feeVerdict,
    },
    totalMoneyLost: parseFloat((Math.abs(moneyLostOnRate) + Math.max(0, txn.fee - 5)).toFixed(2)),
    riskScore,
    summary: `You are losing $${Math.abs(moneyLostOnRate).toFixed(2)} due to a ${Math.abs(markupPercent)}% exchange rate markup, plus a ${feeVerdict} fee of $${txn.fee} (industry average is ${country.avgFee}).`,
  };
}

const PREDATORY_CLAUSES = {
  "Western Union": [
    {
      clause: "Exchange rate may vary between the time of the transaction and the time of delivery",
      risk: "high",
      explanation: "This means the rate can CHANGE after you've already paid. You could receive even less than quoted. Western Union locks in their profit but shifts all currency risk onto you.",
    },
    {
      clause: "Additional fees may be charged by correspondent banks or intermediary financial institutions",
      risk: "high",
      explanation: "Hidden middleman fees can be deducted from your transfer AFTER you send it. Your family may receive less than expected with no warning.",
    },
    {
      clause: "Western Union may refuse, delay, or cancel any transaction at its sole discretion",
      risk: "medium",
      explanation: "They can hold your money without explanation. During delays, the exchange rate may move against you, costing you more.",
    },
    {
      clause: "You agree that Western Union may earn revenue from foreign exchange in addition to transfer fees",
      risk: "high",
      explanation: "This is a direct admission that the exchange rate markup is a SECOND hidden fee. You're paying twice — once as the stated fee, once buried in the rate.",
    },
  ],
  "MoneyGram": [
    {
      clause: "The exchange rate is determined at the time of payout, not at the time of send",
      risk: "high",
      explanation: "You have zero rate certainty. Between sending and receiving, the rate could shift significantly. MoneyGram profits from the float.",
    },
    {
      clause: "MoneyGram may impose additional service charges for certain delivery methods",
      risk: "medium",
      explanation: "Cash pickup, mobile wallet, and bank deposit may each carry different hidden surcharges not shown at checkout.",
    },
    {
      clause: "Refunds will be processed at the exchange rate at the time of refund, not the original transaction rate",
      risk: "high",
      explanation: "If something goes wrong and you need a refund, you'll get back LESS than you paid if the rate moved. You lose money on cancellation.",
    },
  ],
  _default: [
    {
      clause: "Exchange rates are subject to change without prior notice",
      risk: "high",
      explanation: "The rate you see is not the rate you get. This clause allows the service to silently increase their markup at any time.",
    },
    {
      clause: "Service fees are non-refundable once the transaction has been initiated",
      risk: "medium",
      explanation: "Even if the transfer fails or is delayed, you won't get your fee back. The company keeps your money regardless of outcome.",
    },
    {
      clause: "Additional charges may apply depending on the payment and delivery method selected",
      risk: "medium",
      explanation: "Hidden fees layered on top of the stated fee. The total cost is intentionally obscured until after you commit.",
    },
  ],
};

function buildMockAgent2(txn) {
  const clauses = PREDATORY_CLAUSES[txn.service] || PREDATORY_CLAUSES._default;
  const highCount = clauses.filter((c) => c.risk === "high").length;
  const riskScore = Math.min(10, highCount * 3 + clauses.length);

  return {
    agentName: "Predatory Language Scanner",
    redFlags: clauses,
    riskScore,
    summary: `Found ${clauses.length} concerning clauses in ${txn.service}'s terms, including ${highCount} high-risk provisions that could cost you additional money.`,
  };
}

const SCAM_PATTERNS_DB = [
  {
    pattern: "Rate bait-and-switch",
    check: (txn, realRate) => {
      const markup = ((realRate - txn.offeredRate) / realRate) * 100;
      if (markup > 3) return { confidence: "high", evidence: `The offered rate of ${txn.offeredRate} is ${markup.toFixed(1)}% below the real market rate of ${realRate}. This level of markup is characteristic of bait-and-switch pricing — the advertised rate draws you in, but the actual rate delivered is far worse.` };
      if (markup > 1) return { confidence: "medium", evidence: `Rate markup of ${markup.toFixed(1)}% detected. While not extreme, this is above the fair market spread and suggests the advertised rate was used to attract customers.` };
      return null;
    },
  },
  {
    pattern: "Hidden processing fees",
    check: (txn) => {
      if (txn.fee > 8) return { confidence: "high", evidence: `A $${txn.fee} fee on a $${txn.amount} transfer is ${((txn.fee / txn.amount) * 100).toFixed(1)}% of the total — well above industry norms. Combined with the exchange rate markup, the true cost of this transfer is being obscured across multiple fee layers.` };
      if (txn.fee > 5) return { confidence: "medium", evidence: `Fee of $${txn.fee} is above the industry average for this corridor. Check if additional fees are deducted on the receiving end.` };
      return null;
    },
  },
  {
    pattern: "Double-dipping (fee + markup)",
    check: (txn, realRate) => {
      const markup = ((realRate - txn.offeredRate) / realRate) * 100;
      if (markup > 2 && txn.fee > 5) return { confidence: "high", evidence: `${txn.service} is charging BOTH a $${txn.fee} explicit fee AND a ${markup.toFixed(1)}% hidden markup on the exchange rate. This "double-dipping" means you're paying twice — once as the visible fee, once hidden in the rate. Total hidden cost: $${((markup / 100) * txn.amount + txn.fee).toFixed(2)}.` };
      return null;
    },
  },
  {
    pattern: "Advance fee scam",
    check: (txn) => {
      if (txn.terms && /processing fee|advance|upfront.*payment/i.test(txn.terms)) return { confidence: "medium", evidence: "Terms mention advance or processing fees — a hallmark of advance fee scams where money is collected before the service is rendered." };
      return null;
    },
  },
  {
    pattern: "Fake urgency / deadline pressure",
    check: (txn) => {
      if (txn.terms && /expires|limited.time|act.now|hurry/i.test(txn.terms)) return { confidence: "medium", evidence: "Terms contain urgency language designed to pressure you into sending before you can compare alternatives." };
      return null;
    },
  },
];

function buildMockAgent3(txn, realRate) {
  const detected = [];
  const cleared = [];

  for (const pattern of SCAM_PATTERNS_DB) {
    const result = pattern.check(txn, realRate);
    if (result) {
      detected.push({ pattern: pattern.pattern, ...result });
    } else {
      cleared.push(pattern.pattern);
    }
  }

  // Always clear these for legitimate services
  const alwaysCleared = ["Impersonation", "Phishing links", "Unlicensed operator", "No receipt/tracking", "Too-good-to-be-true rates"];
  cleared.push(...alwaysCleared);

  const highCount = detected.filter((d) => d.confidence === "high").length;
  const riskScore = Math.min(10, highCount * 3 + detected.length * 1.5);

  return {
    agentName: "Scam Pattern Classifier",
    patternsDetected: detected,
    patternsCleared: cleared,
    riskScore: parseFloat(riskScore.toFixed(0)),
    summary: detected.length > 0
      ? `Detected ${detected.length} concerning patterns including ${detected.map((d) => d.pattern).join(", ")}. While ${txn.service} is a licensed operator, their pricing practices raise significant red flags.`
      : `No scam patterns detected. ${txn.service} appears to be operating within normal parameters.`,
  };
}

const ALTERNATIVES_DB = {
  NPR: [
    { service: "Wise", fee: "$4.50", rateInfo: "Real mid-market rate, no markup", estimatedSavings: "$19+" },
    { service: "Remitly", fee: "$3.99", rateInfo: "0.3% markup, promo rates available", estimatedSavings: "$16+" },
    { service: "IME Pay", fee: "$5.00", rateInfo: "Nepal-specific, competitive rates", estimatedSavings: "$12+" },
  ],
  INR: [
    { service: "Wise", fee: "$3.69", rateInfo: "Real mid-market rate, no markup", estimatedSavings: "$22+" },
    { service: "Remitly", fee: "$3.99", rateInfo: "0.2% markup", estimatedSavings: "$18+" },
    { service: "Google Pay (US→India)", fee: "$0", rateInfo: "No fee, competitive rate", estimatedSavings: "$25+" },
  ],
  EGP: [
    { service: "Wise", fee: "$5.20", rateInfo: "Real mid-market rate", estimatedSavings: "$17+" },
    { service: "Instarem", fee: "$4.00", rateInfo: "0.5% markup", estimatedSavings: "$14+" },
    { service: "Remitly", fee: "$3.99", rateInfo: "0.4% markup, fast delivery", estimatedSavings: "$15+" },
  ],
  _default: [
    { service: "Wise", fee: "$4.50", rateInfo: "Real mid-market rate, no markup", estimatedSavings: "$18+" },
    { service: "Remitly", fee: "$3.99", rateInfo: "Low markup, fast delivery", estimatedSavings: "$15+" },
    { service: "OFX", fee: "$0", rateInfo: "No fee on $500+, small markup", estimatedSavings: "$12+" },
  ],
};

const ALERTS_IN_LANGUAGE = {
  NPR: (agent1, compositeRisk) => `⚠️ चेतावनी — यो ट्रान्सफर जोखिमपूर्ण छ!

तपाईंले पठाउन खोजेको $${agent1.feeAnalysis.feeCharged} शुल्क र ${agent1.rateAnalysis.markupPercent}% विनिमय दर मार्कअपले गर्दा तपाईं $${agent1.totalMoneyLost.toFixed(2)} गुमाउँदै हुनुहुन्छ।

वास्तविक बजार दर ${agent1.rateAnalysis.realRate} NPR/USD हो, तर तपाईंलाई ${agent1.rateAnalysis.offeredRate} NPR/USD मात्र दिइएको छ। यो ${agent1.rateAnalysis.markupPercent}% कम हो — यसको मतलब तपाईंको परिवारले कम पैसा पाउँछ।

हामी Wise वा Remitly प्रयोग गर्न सिफारिस गर्छौं — तपाईंले $15-20 बचत गर्न सक्नुहुन्छ। पैसा पठाउनु अघि सधैं दर तुलना गर्नुहोस्।

तपाईंको परिवारको पैसा महत्त्वपूर्ण छ। सुरक्षित रहनुहोस्। 🛡️`,

  INR: (agent1, compositeRisk) => `⚠️ चेतावनी — यह ट्रांसफर जोखिमपूर्ण है!

आप $${agent1.feeAnalysis.feeCharged} शुल्क और ${agent1.rateAnalysis.markupPercent}% विनिमय दर मार्कअप के कारण $${agent1.totalMoneyLost.toFixed(2)} खो रहे हैं।

वास्तविक बाजार दर ${agent1.rateAnalysis.realRate} INR/USD है, लेकिन आपको ${agent1.rateAnalysis.offeredRate} INR/USD दी गई है। यह ${agent1.rateAnalysis.markupPercent}% कम है — इसका मतलब आपके परिवार को कम पैसे मिलेंगे।

हम Wise या Google Pay का उपयोग करने की सलाह देते हैं — आप $18-25 बचा सकते हैं। पैसे भेजने से पहले हमेशा दरों की तुलना करें।

आपके परिवार का पैसा मायने रखता है। सुरक्षित रहें। 🛡️`,

  EGP: (agent1, compositeRisk) => `⚠️ تحذير — هذا التحويل محفوف بالمخاطر!

أنت تخسر $${agent1.totalMoneyLost.toFixed(2)} بسبب رسوم $${agent1.feeAnalysis.feeCharged} وهامش سعر الصرف ${agent1.rateAnalysis.markupPercent}%.

سعر السوق الحقيقي هو ${agent1.rateAnalysis.realRate} جنيه/دولار، لكن تم عرض ${agent1.rateAnalysis.offeredRate} جنيه/دولار عليك. هذا أقل بنسبة ${agent1.rateAnalysis.markupPercent}% — مما يعني أن عائلتك ستحصل على أموال أقل.

نوصي باستخدام Wise أو Instarem — يمكنك توفير $14-17. قارن الأسعار دائمًا قبل الإرسال.

أموال عائلتك مهمة. ابقَ آمنًا. 🛡️`,
};

function buildMockAgent4(txn, country, agent1, agent2, agent3, compositeRisk) {
  const alertLevel = compositeRisk > 7 ? "danger" : compositeRisk > 4 ? "warning" : "safe";
  const alternatives = ALTERNATIVES_DB[txn.currency] || ALTERNATIVES_DB._default;

  // Filter out the current service from alternatives
  const filteredAlts = alternatives.filter(a => a.service.toLowerCase() !== txn.service.toLowerCase());

  const alertFn = ALERTS_IN_LANGUAGE[txn.currency];
  const alertInLanguage = alertFn
    ? alertFn(agent1, compositeRisk)
    : `⚠️ WARNING — Risk Score: ${compositeRisk.toFixed(1)}/10\n\nYou are losing $${agent1.totalMoneyLost.toFixed(2)} on this transfer due to a ${agent1.rateAnalysis.markupPercent}% rate markup and a $${agent1.feeAnalysis.feeCharged} fee.\n\nThe real market rate is ${agent1.rateAnalysis.realRate} ${txn.currency}/USD, but you were offered ${agent1.rateAnalysis.offeredRate}. We recommend using Wise or Remitly for significantly lower costs.\n\nYour family's money matters. Stay safe. 🛡️`;

  return {
    agentName: "Alert Generator",
    alertLevel,
    headline: compositeRisk > 7
      ? `🚨 DANGER: You're losing $${agent1.totalMoneyLost.toFixed(2)} on this transfer`
      : compositeRisk > 4
      ? `⚠️ WARNING: Hidden costs detected — $${agent1.totalMoneyLost.toFixed(2)} at risk`
      : `✅ This transfer looks fair`,
    alternatives: filteredAlts,
    alertInLanguage,
    language: country.language,
  };
}

// ─── Delay helper to simulate agent processing time ───
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Bedrock Agent Prompts (kept for when LLM_MODE !== "mock" = true) ───

function buildAgent1Prompt(txn, realRate, country) {
  return `You are Agent 1: Rate Anomaly Detector for RemitSafe.

TRANSACTION:
- Sending: $${txn.amount} USD to ${country.name}
- Service: ${txn.service}
- Offered rate: 1 USD = ${txn.offeredRate} ${txn.currency}
- Real market rate: 1 USD = ${realRate} ${txn.currency} (fetched live)
- Fee charged: $${txn.fee}
- Average corridor fee for ${country.name}: ${country.avgFee}

ANALYZE the exchange rate and fee. Return ONLY valid JSON:
{
  "agentName": "Rate Anomaly Detector",
  "rateAnalysis": {
    "offeredRate": ${txn.offeredRate},
    "realRate": ${realRate},
    "markupPercent": <number, 1 decimal>,
    "moneyLostOnRate": <number, 2 decimals>,
    "rateVerdict": "<'fair'|'unfair'|'predatory'>"
  },
  "feeAnalysis": {
    "feeCharged": ${txn.fee},
    "feePercent": <number, 1 decimal>,
    "industryAverage": "${country.avgFee}",
    "feeVerdict": "<'fair'|'high'|'very high'>"
  },
  "totalMoneyLost": <number>,
  "riskScore": <number 0-10>,
  "summary": "<one sentence>"
}`;
}

function buildAgent2Prompt(txn, country) {
  return `You are Agent 2: Predatory Language Scanner for RemitSafe.
SERVICE: ${txn.service}
TERMS PROVIDED: ${txn.terms ? `"${txn.terms}"` : "No terms provided by user."}
COUNTRY: ${country.name}
${txn.terms ? "Scan the terms for predatory clauses." : `Based on your knowledge of ${txn.service}, list COMMON predatory clauses.`}
Return ONLY valid JSON:
{
  "agentName": "Predatory Language Scanner",
  "redFlags": [{ "clause": "<text>", "risk": "<low|medium|high>", "explanation": "<plain language>" }],
  "riskScore": <0-10>,
  "summary": "<one sentence>"
}`;
}

function buildAgent3Prompt(txn, country) {
  return `You are Agent 3: Scam Pattern Classifier for RemitSafe.
TRANSACTION: $${txn.amount} to ${country.name} via ${txn.service}, rate ${txn.offeredRate}, fee $${txn.fee}
Check against: advance fee, rate bait-and-switch, impersonation, phishing, hidden fees, fake urgency, unlicensed operator, too-good rates, no receipt, mandatory minimums.
Return ONLY valid JSON:
{
  "agentName": "Scam Pattern Classifier",
  "patternsDetected": [{ "pattern": "<name>", "confidence": "<low|medium|high>", "evidence": "<why>" }],
  "patternsCleared": ["<clean patterns>"],
  "riskScore": <0-10>,
  "summary": "<one sentence>"
}`;
}

function buildAgent4Prompt(txn, country, agent1, agent2, agent3, compositeRisk) {
  return `You are Agent 4: Alert Generator for RemitSafe.
TRANSACTION: $${txn.amount} to ${country.name} via ${txn.service}. Risk: ${compositeRisk.toFixed(1)}/10.
Agent findings: ${JSON.stringify({ agent1, agent2, agent3 })}
Return ONLY valid JSON:
{
  "agentName": "Alert Generator",
  "alertLevel": "<safe|warning|danger>",
  "headline": "<punchy headline>",
  "alternatives": [{ "service": "<name>", "fee": "<fee>", "rateInfo": "<info>", "estimatedSavings": "<$amount>" }],
  "alertInLanguage": "<FULL alert in ${country.language}, 4-5 sentences>",
  "language": "${country.language}"
}`;
}

// ─── SSE Analyze Endpoint ───
app.post("/analyze", async (req, res) => {
  const txn = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const rates = await getExchangeRates();
    const realRate = rates[txn.currency];
    if (!realRate) {
      send("error", { error: "Unsupported currency" });
      return res.end();
    }

    const country = COUNTRIES[txn.currency] || {
      name: txn.currency, flag: "", language: "English", avgFee: "$4-6",
    };

    send("status", { message: "Fetched live exchange rates", realRate });

    // Start agents 1-3
    send("agent-start", { agent: 1, name: "Rate Anomaly Detector" });
    send("agent-start", { agent: 2, name: "Predatory Language Scanner" });
    send("agent-start", { agent: 3, name: "Scam Pattern Classifier" });

    let agent1, agent2, agent3;

    if (LLM_MODE !== "mock") {
      const [raw1, raw2, raw3] = await Promise.all([
        callLLM(buildAgent1Prompt(txn, realRate, country)),
        callLLM(buildAgent2Prompt(txn, country)),
        callLLM(buildAgent3Prompt(txn, country)),
      ]);
      agent1 = parseJSON(raw1);
      agent2 = parseJSON(raw2);
      agent3 = parseJSON(raw3);
    } else {
      // Stagger mock results for visual effect
      await delay(800);
      agent1 = buildMockAgent1(txn, realRate, country);
      send("agent-result", { agent: 1, data: agent1 });

      await delay(600);
      agent2 = buildMockAgent2(txn);
      send("agent-result", { agent: 2, data: agent2 });

      await delay(500);
      agent3 = buildMockAgent3(txn, realRate);
      send("agent-result", { agent: 3, data: agent3 });
    }

    if (LLM_MODE !== "mock") {
      send("agent-result", { agent: 1, data: agent1 });
      send("agent-result", { agent: 2, data: agent2 });
      send("agent-result", { agent: 3, data: agent3 });
    }

    // Composite risk score
    const r1 = agent1?.riskScore || 0;
    const r2 = agent2?.riskScore || 0;
    const r3 = agent3?.riskScore || 0;
    const compositeRisk = 0.35 * r1 + 0.35 * r2 + 0.30 * r3;

    await delay(LLM_MODE !== "mock" ? 0 : 400);
    send("risk-score", { composite: parseFloat(compositeRisk.toFixed(1)), weights: { rate: r1, language: r2, scam: r3 } });

    // Agent 4
    send("agent-start", { agent: 4, name: "Alert Generator" });

    let agent4;
    if (LLM_MODE !== "mock") {
      const raw4 = await callLLM(buildAgent4Prompt(txn, country, agent1, agent2, agent3, compositeRisk));
      agent4 = parseJSON(raw4);
    } else {
      await delay(700);
      agent4 = buildMockAgent4(txn, country, agent1, agent2, agent3, compositeRisk);
    }

    send("agent-result", { agent: 4, data: agent4 });

    send("complete", {
      compositeRisk: parseFloat(compositeRisk.toFixed(1)),
      country: country.name,
      flag: country.flag,
      realRate,
      agent1,
      agent2,
      agent3,
      agent4,
    });

    res.end();
  } catch (err) {
    console.error("Analysis error:", err);
    send("error", { error: err.message });
    res.end();
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`RemitSafe server running on port ${PORT}`);
  console.log(`Mode: ${LLM_MODE.toUpperCase()}`);
});
