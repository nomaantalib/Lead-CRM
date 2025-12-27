const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (lead) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Analyze this sales lead and return JSON only:
Name: ${lead.name}
Message: ${lead.message}

Return:
score (0-100),
priority (High/Medium/Low),
action (call/email/ignore)
`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};
