const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (lead) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert sales lead scorer. Analyze this lead and follow these exact steps:

1. Check for HIGH INTENT KEYWORDS (case-insensitive): budget, approved, urgent, immediately, asap, deadline, decision, purchase, buy, invest, contract, proposal, demo, meeting, call
   - Count how many are present in the message

2. Calculate BASE SCORE (0-40):
   - Complete info (name, email, company, phone): 30
   - Partial info (name + email): 20
   - Minimal info: 10

3. Calculate KEYWORD SCORE (0-40):
   - Each high intent keyword: +15 points
   - Each medium intent keyword: +8 points
   - Each low intent keyword: +2 points

4. Calculate TOTAL SCORE = Base + Keyword Score (max 100)

5. Determine PRIORITY:
   - If any high intent keyword found: "Very High"
   - Else if total score >= 60: "High"
   - Else if total score >= 30: "Medium"
   - Else: "Low"

6. Suggest ACTION based on priority and content

Return ONLY valid JSON: {"score": number, "priority": "Very High/High/Medium/Low", "action": "brief action text"}

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

    console.log("No JSON found in AI response, using fallback");
    return fallbackScoring(lead);
  } catch (error) {
    console.log("AI Error:", error.message);
    console.log("Using fallback keyword detection");
    return fallbackScoring(lead);
  }
};

// Fallback scoring function that works without AI
function fallbackScoring(lead) {
  const message = (lead.message || "").toLowerCase();

  // High intent keywords
  const highIntentKeywords = [
    "budget",
    "approved",
    "urgent",
    "immediately",
    "asap",
    "deadline",
    "decision",
    "purchase",
    "buy",
    "invest",
    "contract",
    "proposal",
    "demo",
    "meeting",
    "call",
  ];

  // Medium intent keywords
  const mediumIntentKeywords = [
    "interested",
    "consider",
    "evaluate",
    "explore",
    "research",
    "compare",
    "need",
    "require",
    "looking for",
    "solution",
  ];

  // Low intent keywords
  const lowIntentKeywords = [
    "maybe",
    "perhaps",
    "think",
    "might",
    "possibly",
    "info",
    "details",
    "learn more",
  ];

  // Count keywords
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  highIntentKeywords.forEach((keyword) => {
    if (message.includes(keyword)) highCount++;
  });

  mediumIntentKeywords.forEach((keyword) => {
    if (message.includes(keyword)) mediumCount++;
  });

  lowIntentKeywords.forEach((keyword) => {
    if (message.includes(keyword)) lowCount++;
  });

  // Base score
  let baseScore = 10; // minimal
  if (lead.name && lead.email && lead.company && lead.phone) {
    baseScore = 30; // complete
  } else if (lead.name && lead.email) {
    baseScore = 20; // partial
  }

  // Keyword score
  const keywordScore = highCount * 15 + mediumCount * 8 + lowCount * 2;

  // Total score
  const totalScore = Math.min(100, baseScore + keywordScore);

  // Priority
  let priority = "Low";
  if (highCount > 0) {
    priority = "Very High";
  } else if (totalScore >= 60) {
    priority = "High";
  } else if (totalScore >= 30) {
    priority = "Medium";
  }

  // Action
  let action = "Review lead details";
  if (priority === "Very High") {
    action = "Contact immediately - high intent detected";
  } else if (priority === "High") {
    action = "Follow up within 24 hours";
  } else if (priority === "Medium") {
    action = "Add to nurture campaign";
  }

  return {
    score: totalScore,
    priority: priority,
    action: action,
  };
}
