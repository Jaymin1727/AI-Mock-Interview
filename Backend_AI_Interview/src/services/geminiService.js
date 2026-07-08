const { GoogleGenerativeAI } = require('@google/generative-ai');

// Lazy initialize to ensure process.env is populated by dotenv
let genAI = null;
let model = null;

const getModel = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return model;
};

/**
 * Generate interview questions based on role
 */
const generateQuestions = async (role, count = 4) => {
  if (process.env.GEMINI_API_KEY === 'process.env.GEMINI_API_KEY' || !process.env.GEMINI_API_KEY) {
    console.warn("Using dummy questions because GEMINI_API_KEY is missing");
    // Fallback dummy questions
    return [
      {
        questionText: `Can you describe your experience as a ${role}?`,
        hint: "Talk about your past projects.",
        orderIndex: 0
      },
      {
        questionText: "What is your biggest professional achievement?",
        hint: "Use the STAR method.",
        orderIndex: 1
      }
    ];
  }

  try {
    const prompt = `You are an expert technical interviewer hiring for the role of "${role}".
    Generate ${count} interview questions. Include a mix of technical and behavioral questions.
    Return ONLY a valid JSON array of objects. Each object must have:
    - "questionText": the actual interview question
    - "hint": a short hint for the candidate
    
    Example format:
    [
      { "questionText": "Tell me about a time...", "hint": "Use STAR method" }
    ]`;

    const result = await getModel().generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response (handling potential markdown blocks)
    let jsonStr = responseText;
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0];
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0];
    }

    const questions = JSON.parse(jsonStr.trim());
    return questions.map((q, index) => ({
      ...q,
      orderIndex: index
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate interview questions");
  }
};

/**
 * Evaluate interview answers
 */
const evaluateInterview = async (role, qaPairs) => {
  if (process.env.GEMINI_API_KEY === 'process.env.GEMINI_API_KEY' || !process.env.GEMINI_API_KEY) {
    console.warn("Using dummy evaluation because GEMINI_API_KEY is missing");
    // Fallback dummy result
    return {
      overallScore: 85,
      communicationScore: 80,
      technicalScore: 90,
      confidenceScore: 85,
      problemSolvingScore: 85,
      clarityScore: 80,
      strengths: ["Good problem solving"],
      weaknesses: ["Could be more concise"],
      suggestions: "Practice STAR method",
      questionScores: qaPairs.map((_, i) => ({ questionIndex: i, score: 85, feedback: "Good answer." }))
    };
  }

  try {
    const qaFormatted = qaPairs.map((qa, i) =>
      `Q${i + 1}: ${qa.questionText}\nCandidate Answer: ${qa.answer || '(No answer provided)'}`
    ).join('\n\n');

    const prompt = `You are an expert technical interviewer evaluating a candidate for the role of "${role}".
    Review the following questions and the candidate's answers:
    
    ${qaFormatted}
    
    Provide a comprehensive evaluation in strictly valid JSON format matching this exact structure:
    {
      "overallScore": <number 0-100>,
      "communicationScore": <number 0-100>,
      "technicalScore": <number 0-100>,
      "confidenceScore": <number 0-100>,
      "problemSolvingScore": <number 0-100>,
      "clarityScore": <number 0-100>,
      "strengths": ["<strength 1>", "<strength 2>"],
      "weaknesses": ["<weakness 1>", "<weakness 2>"],
      "suggestions": "<overall suggestions for improvement>",
      "questionScores": [
        {
          "questionIndex": <index starting from 0>,
          "score": <number 0-100>,
          "feedback": "<specific feedback for this answer>"
        }
      ]
    }`;

    const result = await getModel().generateContent(prompt);
    const responseText = result.response.text();

    let jsonStr = responseText;
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0];
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0];
    }

    const evaluation = JSON.parse(jsonStr.trim());
    return evaluation;
  } catch (error) {
    console.error("Error evaluating interview:", error);
    throw new Error("Failed to evaluate interview performance");
  }
};

module.exports = {
  generateQuestions,
  evaluateInterview
};
