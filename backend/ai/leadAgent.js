const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (lead) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Analyze this sales lead and return JSON only:
Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || "N/A"}
Phone: ${lead.phone || "N/A"}
Message: ${lead.message}

Based on the information, determine:
- score: A number from 0-100 indicating lead quality
- priority: High/Medium/Low
- action: Next best action (e.g., "Call within 24 hours", "Send email", "Schedule demo", "Ignore for now")

Return only valid JSON like: {"score": 85, "priority": "High", "action": "Call within 24 hours"}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  // Clean the response to ensure it's valid JSON
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
};
