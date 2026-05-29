const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");
const fileUpload = require("express-fileupload");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// =====================
//INIT
// =====================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// =====================
//  MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(fileUpload());

// =====================
//  MEMORY
// =====================
const memory = {};

function getMemory(id) {
  if (!memory[id]) memory[id] = { history: [] };
  return memory[id];
}

// =====================
//  SYMPTOMS
// =====================
function extractSymptoms(text) {
  const list = ["صداع", "دوخة", "ألم", "حرارة", "تعب", "غثيان", "ضيق نفس"];
  return list.filter(s => text.includes(s));
}

// =====================
// RISK
// =====================
function riskCalc(symptoms) {
  let score = 0;

  const high = ["ضيق نفس", "ألم"];
  const mid = ["صداع", "دوخة", "حرارة", "تعب"];

  symptoms.forEach(s => {
    if (high.includes(s)) score += 3;
    if (mid.includes(s)) score += 1;
  });

  return {
    level: score >= 5 ? "high" : score >= 3 ? "medium" : "low"
  };
}

// =====================
// NAVIGATION (STRICT JSON ONLY)
// =====================
async function detectNavigation(text) {
  const prompt = `
أنت مصنف نوايا داخل تطبيق طبي.

مهم جدًا:
- أجب بـ JSON فقط.
- ممنوع أي نص إضافي.
- لا ترجع type=nav إلا إذا طلب المستخدم بشكل واضح فتح صفحة أو الذهاب إلى صفحة موجودة.
- لو كانت الرسالة سؤالًا عامًا، تحية، شكوى، عرضًا طبيًا، أو استفسارًا عن المنصة، فالإجابة تكون {"type":"none"}.
- لا تستنتج. لا تتوقع. لا تجتهد.

الصيغة المسموحة فقط:
1) {"type":"nav","url":"/path"}
2) {"type":"none"}

الصفحات المسموحة فقط:
/
/services
/doctors
/about
/contact
/login
/signup
/forgot
/appointments
/patient
/settings
/booking/3

أمثلة:
"افتح صفحة الخدمات" -> {"type":"nav","url":"/services"}
"عايز أروح الإعدادات" -> {"type":"nav","url":"/settings"}
"هالو" -> {"type":"none"}
"ايه مميزات المنصة" -> {"type":"none"}
"عندي صداع" -> {"type":"none"}

رسالة المستخدم:
${text}
`;

  try {
    const r = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" } // يجبر الموديل يرجع JSON فقط
    });

    const parsed = JSON.parse(r.choices[0]?.message?.content?.trim());
    
    // فلتر أمان إضافي: عشان نتأكد إن الـ url المكتوب حقيقي ومسموح
    const allowedUrls = [
      "/", "/services", "/doctors", "/about", "/contact", "/login", 
      "/signup", "/forgot", "/appointments", "/patient", "/settings", "/booking/3"
    ];

    if (parsed.type === "nav" && allowedUrls.includes(parsed.url)) {
      return parsed;
    }

    return { type: "none" };
  } catch (error) {
    console.error("Navigation Detection Error:", error);
    return { type: "none" };
  }
}

// =====================
// SYSTEM PROMPT (MEDICAL ONLY)
// =====================
const systemPrompt = `
أنت Shifaa AI.

- مساعد طبي داخل تطبيق
- تحليل أعراض فقط
- ردود قصيرة جدًا
- بدون تشخيص نهائي
- بدون اختراع معلومات
- في حال التحية أو الأسئلة العامة عن المنصة أجب بلطف وباختصار.
`;

// =====================
//  CHAT ENDPOINT
// =====================
app.post("/api/ai/chat", async (req, res) => {
  const { messages, patientId } = req.body;

  const last = messages[messages.length - 1];
  const mem = getMemory(patientId || "guest");

  mem.history.push(last.content);
  if (mem.history.length > 10) mem.history.shift();

  //  symptoms + risk
  const symptoms = extractSymptoms(last.content);
  const risk = riskCalc(symptoms);

  // =====================
  //  NAVIGATION FIRST
  // =====================
  const nav = await detectNavigation(last.content);

  // لو الجملة كان فيها طلب فتح صفحة فعلاً، هيرجع الزرار
    if (nav.type === "nav") {
    return res.json({
      response: "تمام، اضغط على الزرار بالأسفل للانتقال للصفحة:",
      actionUrl: nav.url   //  لازم تكون بنفس الاسم ده عشان React يقراها
    });
  }

  // =====================
  //  MEDICAL AI (لأي رسالة مش صفحة)
  // =====================
  try {
    const safeMessages = messages.map((m) => ({
  role: m.role,
  content: typeof m.content === "string" ? m.content : String(m.content || "")
}));

const ai = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  temperature: 0.6,
  messages: [
    { role: "system", content: systemPrompt },
    ...safeMessages
  ],
});

    const response = ai.choices[0]?.message?.content?.trim();

    res.json({
      response,
      symptoms,
      risk,
      memory: mem.history
    });

  } catch (e) {
    console.error("Chat AI Error:", e);
    res.status(500).json({ response: "عذراً، حدث خطأ في الخادم" });
  }
});

// =====================
// START
// =====================
app.listen(PORT, () => {
  console.log(" Server running on port:", PORT);
});