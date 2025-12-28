const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (lead) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an expert sales lead scorer. Analyze this lead carefully and assign a score based on these rules:

BASE SCORING (0-40 points):
- Complete info (name, email, company, phone): +30 points
- Partial info (name + email): +20 points
- Minimal info: +10 points

KEYWORD BOOSTERS (0-40 points):
High Intent Keywords (+10-15 each): budget, approved, urgent, immediately, asap, deadline, decision, purchase, buy, invest, contract, proposal, demo, meeting, call
Medium Intent Keywords (+5-10 each): interested, consider, evaluate, explore, research, compare, need, require, looking for, solution
Low Intent Keywords (+1-3 each): maybe, perhaps, think, might, possibly, info, details, learn more

COMPANY SIGNALS (+0-20 points):
- Fortune 500/large corp: +20
- Known company: +15
- Startup/SMB: +10
- No company: 0

MESSAGE QUALITY (+0-20 points):
- Detailed (100+ chars): +15
- Specific requirements: +10
- Vague/general: +5

FINAL SCORE: Base + Boosters + Company + Quality (capped at 100)

Return ONLY JSON: {"score": number, "priority": "High/Medium/Low", "action": "brief action"}

Lead Data:
Name: ${lead.name || "Unknown"}
Email: ${lead.email || "No email"}
Company: ${lead.company || "No company"}
Phone: ${lead.phone || "No phone"}
Message: ${lead.message || "No message"}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Ensure score is within bounds
      parsed.score = Math.max(0, Math.min(100, parsed.score));
      return parsed;
    }

    return { score: 50, priority: "Medium", action: "Review lead details" };
  } catch (error) {
    console.log("AI Error, using defaults");
    return { score: 50, priority: "Medium", action: "Review lead details" };
  }
};
