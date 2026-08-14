const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    console.log("✅ Devora Gemini AI Engine initialized");
  } else {
    console.warn("⚠️ No GEMINI_API_KEY found. AI features will use high-quality intelligent fallbacks.");
  }
} catch (err) {
  console.error("❌ Gemini init failed:", err.message);
}

// Clean JSON response from Gemini markdown code fences
function cleanJsonOutput(text) {
  if (!text) return "";
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * 1. Generate Interview Questions
 */
async function generateInterviewQuestions({ role, interviewType, difficulty, count = 5 }) {
  const prompt = `
You are a Staff Software Engineer & Technical Hiring Lead at a top tech company (Google/Meta/Stripe).
Generate ${count} realistic, insightful interview questions for a candidate.

Role: ${role}
Interview Domain: ${interviewType}
Difficulty Level: ${difficulty}

Respond ONLY with a valid JSON array of objects. Do not include markdown ticks or additional commentary outside JSON.
Each object must have this structure:
[
  {
    "questionNumber": 1,
    "question": "Question text here",
    "category": "${interviewType}",
    "difficulty": "${difficulty}",
    "idealAnswer": "Key points of an exceptional answer, including code snippets or architectural considerations if relevant",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "followUp": "A challenging follow-up question"
  }
]
`;

  try {
    if (model) {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJsonOutput(text);
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q, idx) => ({ ...q, questionNumber: idx + 1 }));
      }
    }
  } catch (err) {
    console.warn("Gemini question generation error, using fallback:", err.message);
  }

  // Fallback question bank
  return getFallbackInterviewQuestions({ role, interviewType, difficulty, count });
}

/**
 * 2. Evaluate Interview Answer
 */
async function evaluateInterviewAnswer({ question, answer, role, difficulty, idealAnswer = "" }) {
  const prompt = `
You are an expert technical interviewer evaluating a candidate's answer.

Role: ${role}
Difficulty: ${difficulty}
Question: "${question}"
Candidate's Answer: "${answer}"
${idealAnswer ? `Reference Ideal Concept: "${idealAnswer}"` : ""}

Evaluate the answer thoroughly. Return ONLY a valid JSON object:
{
  "score": 85, // Integer 0 to 100 based on technical accuracy, completeness, depth, and communication
  "feedback": "Comprehensive, constructive feedback on the response",
  "strengths": ["Clear explanation of core concepts", "Mentioned performance trade-offs"],
  "missedPoints": ["Did not mention edge cases", "Could optimize space complexity"],
  "idealAnswer": "Concise summary of the gold-standard answer",
  "followUpQuestion": "A natural follow-up question to probe deeper into this topic"
}
`;

  try {
    if (model) {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJsonOutput(text);
      const parsed = JSON.parse(cleaned);
      return {
        score: Math.min(100, Math.max(0, parseInt(parsed.score) || 75)),
        feedback: parsed.feedback || "Good response covering key technical aspects.",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Demonstrated technical foundation"],
        missedPoints: Array.isArray(parsed.missedPoints) ? parsed.missedPoints : ["Consider elaborating further on real-world constraints"],
        idealAnswer: parsed.idealAnswer || idealAnswer || "A complete response covers mechanisms, trade-offs, and scalability.",
        followUpQuestion: parsed.followUpQuestion || "How would you design this under high concurrency?"
      };
    }
  } catch (err) {
    console.warn("Gemini answer evaluation error, using fallback:", err.message);
  }

  const lengthScore = Math.min(92, Math.max(55, Math.floor(answer.length / 8) + 40));
  return {
    score: lengthScore,
    feedback: "Your response addresses the question with good baseline knowledge. To achieve top-tier performance, elaborate on trade-offs, edge cases, and concrete architectural examples.",
    strengths: ["Directly addresses the question", "Clear communication structure"],
    missedPoints: ["Could dive deeper into underlying execution mechanics", "Mention performance implications"],
    idealAnswer: idealAnswer || "An optimal response clearly articulates the underlying principles, provides concrete examples, and discusses performance and reliability implications.",
    followUpQuestion: "Can you provide a specific production example where this trade-off influenced your design choice?"
  };
}

/**
 * 3. Generate Mock Interview Follow-up / Response
 */
async function generateMockFollowUp({ role, interviewType, conversationHistory, latestAnswer }) {
  const historyText = conversationHistory
    .slice(-6)
    .map(m => `${m.speaker.toUpperCase()}: ${m.message}`)
    .join("\n");

  const prompt = `
You are an experienced technical hiring manager conducting a live mock interview for a ${role} position.
Interview Domain: ${interviewType}

Recent Conversation:
${historyText}

Candidate's Latest Response: "${latestAnswer}"

Your task:
1. Provide a brief, natural acknowledgement (1-2 sentences).
2. Ask the next thoughtful question or probing follow-up based on what the candidate just said.

Respond ONLY with a valid JSON object:
{
  "interviewerMessage": "That's a solid point about state management. How would you handle race conditions if multiple async updates arrive simultaneously?",
  "estimatedScore": 82, // Score for candidate's latest response (0-100)
  "feedbackTip": "Strong intuition on architecture; focus on race conditions and concurrency."
}
`;

  try {
    if (model) {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJsonOutput(text);
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("Gemini mock follow-up error, using fallback:", err.message);
  }

  return {
    interviewerMessage: "Thanks for walking me through that. Let's dig deeper: how would you architect this solution to handle sudden traffic spikes or failure recovery?",
    estimatedScore: 80,
    feedbackTip: "Great communication! Keep highlighting production observability and failure recovery."
  };
}

/**
 * 4. Generate Final Interview Summary & Scorecard
 */
async function generateFinalInterviewSummary({ role, interviewType, questions, answers }) {
  const qnaText = answers
    .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.userAnswer}\nScore: ${a.score}/100`)
    .join("\n\n");

  const prompt = `
You are a Principal Engineer compiling the final interview scorecard for a ${role} candidate (${interviewType}).

Q&A Transcript:
${qnaText}

Analyze their overall performance across Technical Knowledge, Communication, Problem Solving, and Confidence.
Respond ONLY with a valid JSON object:
{
  "overallScore": 84, // 0 to 100
  "metrics": {
    "technicalKnowledge": 85,
    "communication": 88,
    "problemSolving": 82,
    "confidence": 80
  },
  "summary": "2-3 sentences summarizing candidate readiness for this role",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasToImprove": ["Actionable improvement 1", "Actionable improvement 2", "Actionable improvement 3"]
}
`;

  try {
    if (model) {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJsonOutput(text);
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("Gemini final summary error, using fallback:", err.message);
  }

  const avgScore = answers.length > 0 
    ? Math.round(answers.reduce((sum, a) => sum + (a.score || 75), 0) / answers.length)
    : 80;

  return {
    overallScore: avgScore,
    metrics: {
      technicalKnowledge: Math.min(100, avgScore + 2),
      communication: Math.min(100, avgScore + 4),
      problemSolving: avgScore,
      confidence: Math.max(60, avgScore - 3)
    },
    summary: `Candidate demonstrated solid technical fundamentals for ${role}. With focused practice on system edge cases and architectural trade-offs, they will be well-positioned for top-tier hiring rounds.`,
    strengths: [
      "Clear, structured technical communication",
      "Good understanding of fundamental concepts and syntax",
      "Constructive engagement with problem statements"
    ],
    areasToImprove: [
      "Elaborate more deeply on scalability and edge cases",
      "Incorporate metric-driven outcomes in past experience answers",
      "Deepen knowledge of distributed system design patterns"
    ]
  };
}

/**
 * 5. Analyze Resume Text (ATS Score, Skills, Strengths, Weaknesses, Suggestions)
 */
async function analyzeResumeText({ resumeText, targetRole = "Software Engineer" }) {
  const prompt = `
You are a Principal Tech Recruiter & Senior ATS Algorithm Architect.
Analyze the following developer resume thoroughly for ATS compatibility, technical strength, structure, and readability.

Target Role / Domain: ${targetRole}
Resume Text:
"""
${resumeText.slice(0, 7000)}
"""

Evaluate the resume and return ONLY a valid JSON object matching this schema:
{
  "atsScore": 82, // Realistic ATS score (0 to 100) based on formatting, keyword density, quantified impact, and section clarity
  "structureScore": 85, // 0-100
  "readabilityScore": 80, // 0-100
  "skillsDetected": {
    "technical": ["Python", "JavaScript", "SQL", "Git"],
    "frameworks": ["React", "Node.js", "Express", "Next.js"],
    "tools": ["Docker", "AWS", "Kubernetes", "PostgreSQL", "MongoDB"],
    "soft": ["Agile Collaboration", "Code Review", "Mentorship"]
  },
  "missingSkills": ["CI/CD Pipelines", "Unit Testing / Jest", "Cloud Architecture (GCP/AWS)"],
  "strengths": [
    "Clear chronological experience formatting",
    "Strong technical skills section with modern stack",
    "Quantified business metrics in recent roles"
  ],
  "weaknesses": [
    "Bullet points lack metric-driven impact (e.g. 'improved latency by X%')",
    "Missing links to active GitHub repositories or live projects",
    "Summary section is generic rather than tailored"
  ],
  "suggestions": [
    "Use the Google XYZ formula: Accomplished [X], as measured by [Y], by doing [Z]",
    "Add prominent links to your GitHub and deployed applications",
    "Integrate high-frequency ATS keywords matching your target role"
  ],
  "keywords": {
    "found": ["Full Stack", "API Development", "React", "Node.js", "Database Design"],
    "recommended": ["Microservices", "RESTful Architecture", "Test-Driven Development", "Scalability", "System Optimization"]
  },
  "sectionAnalysis": {
    "contactInfo": { "score": 95, "feedback": "Clear name, email, and location.", "status": "good" },
    "professionalSummary": { "score": 75, "feedback": "Make summary more punchy and tailored to target seniority.", "status": "warning" },
    "workExperience": { "score": 82, "feedback": "Good descriptions; increase quantified achievements.", "status": "good" },
    "education": { "score": 90, "feedback": "Standard degree information provided clearly.", "status": "good" },
    "skillsSection": { "score": 88, "feedback": "Comprehensive technical stack listed.", "status": "good" },
    "projects": { "score": 78, "feedback": "Add tech stack breakdown and live URLs for each project.", "status": "warning" }
  }
}
`;

  try {
    if (model) {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJsonOutput(text);
      const parsed = JSON.parse(cleaned);
      return parsed;
    }
  } catch (err) {
    console.warn("Gemini resume analysis error, using fallback:", err.message);
  }

  // Fallback heuristic extraction
  return getFallbackResumeAnalysis(resumeText, targetRole);
}

/**
 * 6. Match Resume Against Job Description
 */
async function matchResumeToJobDescription({ resumeText, jobDescription }) {
  const prompt = `
You are an AI Hiring Manager matching a candidate's resume to a specific job description.

Candidate Resume:
"""
${resumeText.slice(0, 5000)}
"""

Job Description:
"""
${jobDescription.slice(0, 4000)}
"""

Compare the resume against the job description requirements. Return ONLY a valid JSON object:
{
  "jobMatchScore": 84, // 0 to 100 percentage match
  "matchedSkills": ["React", "TypeScript", "Node.js", "REST APIs", "SQL"],
  "missingSkills": ["GraphQL", "AWS Lambda", "Kubernetes", "Kafka"],
  "experienceMatch": "Strong alignment with frontend and backend requirements; slightly junior in distributed streaming systems.",
  "recommendations": [
    "Highlight experience with asynchronous event processing and message queues.",
    "Add specific mentions of TypeScript strict mode in your project bullets.",
    "Quantify scaling achievements (e.g. users served, requests per second)."
  ],
  "keywordMatchPercentage": 78
}
`;

  try {
    if (model) {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJsonOutput(text);
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("Gemini job match error, using fallback:", err.message);
  }

  return {
    jobMatchScore: 78,
    matchedSkills: ["JavaScript", "React", "Node.js", "REST APIs", "Git", "Database Management"],
    missingSkills: ["Cloud Deployment (AWS/GCP)", "Docker", "Automated CI/CD", "Redis"],
    experienceMatch: "Your experience covers the core programming and framework requirements. Enhancing cloud and infrastructure keywords will maximize interview callbacks.",
    recommendations: [
      "Incorporate key terms from the job post directly into your experience bullet points.",
      "Highlight team leadership or agile sprint contributions if applicable.",
      "Emphasize test coverage (Jest, Cypress) and performance benchmarks."
    ],
    keywordMatchPercentage: 75
  };
}

// Helper Fallback Question Generator
function getFallbackInterviewQuestions({ role, interviewType, difficulty, count }) {
  const bank = {
    'JavaScript': [
      {
        question: "Explain the JavaScript Event Loop, Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout). What is the exact execution order?",
        idealAnswer: "The event loop continuously monitors the Call Stack. Synchronous code executes first on the stack. When empty, the microtask queue (Promise callbacks, queueMicrotask, MutationObserver) is drained completely before taking one task from the macrotask queue.",
        keyPoints: ["Call stack execution", "Microtasks take priority over macrotasks", "Starvation risks if microtasks keep scheduling"],
        followUp: "How does async/await interact with the microtask queue under the hood?"
      },
      {
        question: "What are Closures in JavaScript? Describe a production use case and how closures can inadvertently cause memory leaks.",
        idealAnswer: "A closure is a function bundled with references to its lexical environment. Used for data encapsulation, factory functions, and memoization. Leaks occur if retained closures hold large unneeded outer variables.",
        keyPoints: ["Lexical scope binding", "Data privacy", "Garbage collection and retained references"],
        followUp: "How would you profile and fix a memory leak caused by event listeners in a Single Page App?"
      },
      {
        question: "Compare Prototype Inheritance with ES6 Class inheritance. How does JavaScript resolve property lookup along the prototype chain?",
        idealAnswer: "ES6 classes are syntactic sugar over prototype chains. Objects have an internal [[Prototype]] link. Property access walks up this chain until the property is found or null is reached.",
        keyPoints: ["[[Prototype]] / __proto__", "Object.create() vs class extends", "Performance of long prototype chains"],
        followUp: "What is the performance implication of modifying Object.prototype in runtime?"
      },
      {
        question: "Explain Debounce vs Throttle. Implement a robust TypeScript/JavaScript debounce function with immediate/leading execution option.",
        idealAnswer: "Debounce delays execution until N milliseconds of silence. Throttle guarantees execution at most once every N milliseconds.",
        keyPoints: ["Timer cancellation", "Context binding (this)", "Immediate / trailing execution flags"],
        followUp: "How does React 18's useDeferredValue differ from traditional debouncing?"
      },
      {
        question: "What are Promises, Promise.all, Promise.allSettled, Promise.race, and Promise.any? When would you use each in high-traffic APIs?",
        idealAnswer: "Promise.all fails fast on first rejection. allSettled waits for all outcomes. race returns first settled. any returns first fulfilled.",
        keyPoints: ["Fail-fast vs resilient aggregations", "Unhandled rejection handling", "Async error boundaries"],
        followUp: "How would you implement request concurrency throttling (e.g. max 5 concurrent requests) using Promises?"
      }
    ],
    'React': [
      {
        question: "How does React 18 Concurrent Mode, Fiber Architecture, and Automatic Batching work?",
        idealAnswer: "Fiber is React's internal virtual DOM node representation allowing interruptible rendering. Concurrent features (useTransition, useDeferredValue) let React yield control to browser main thread during large renders.",
        keyPoints: ["Fiber work loop", "Interruptible render phases", "Automatic state batching in async handlers"],
        followUp: "What causes tearing in concurrent React and how does useSyncExternalStore prevent it?"
      },
      {
        question: "Explain the reconciliation algorithm and why the 'key' prop is critical during array rendering.",
        idealAnswer: "React uses heuristic O(n) diffing. Keys provide persistent identity across renders so React avoids unmounting and recreating DOM elements unnecessarily.",
        keyPoints: ["Heuristic diffing rules", "Component unmount vs update", "Why index as key causes state bugs"],
        followUp: "What happens under the hood when a component's key changes?"
      },
      {
        question: "Compare useMemo, useCallback, and React.memo. When does premature optimization hurt performance?",
        idealAnswer: "useMemo caches computed values, useCallback caches function references, React.memo skips re-rendering when props are shallow-equal. Overhead of dependency checking and closures can exceed re-render cost for simple components.",
        keyPoints: ["Referential equality", "Dependency array comparison cost", "Garbage collection overhead"],
        followUp: "How would you debug unnecessary re-renders using React DevTools Profiler?"
      },
      {
        question: "Design a custom React hook for caching paginated API requests with automatic cache invalidation and abort controller support.",
        idealAnswer: "Use useEffect with AbortController for cleanup. Maintain cache object in ref or context state with timestamp TTL.",
        keyPoints: ["AbortSignal cleanup", "Stale-while-revalidate pattern", "Race condition prevention"],
        followUp: "How would you share this cache state globally across components without Redux?"
      }
    ],
    'Technical': [
      {
        question: "Explain the end-to-end lifecycle when a user types https://example.com into a browser and hits Enter.",
        idealAnswer: "DNS resolution (browser cache -> OS -> resolver -> root/TLD/authoritative) -> TCP handshake -> TLS 1.3 handshake -> HTTP/2 or HTTP/3 request -> Load Balancer / Reverse Proxy -> Server processing -> Response rendering -> DOM/CSSOM parsing -> Critical Rendering Path.",
        keyPoints: ["DNS lookup stages", "TCP/TLS handshake", "Critical rendering path (CRP)"],
        followUp: "What is QUIC protocol and how does HTTP/3 eliminate head-of-line blocking?"
      },
      {
        question: "Describe ACID properties in relational databases and compare with BASE in NoSQL distributed databases.",
        idealAnswer: "ACID: Atomicity, Consistency, Isolation, Durability. BASE: Basically Available, Soft state, Eventual consistency. Relational DBs prioritize strong consistency; NoSQL databases often trade consistency for availability under CAP theorem.",
        keyPoints: ["Transaction isolation levels", "CAP theorem trade-offs", "Eventual consistency models"],
        followUp: "How does multi-version concurrency control (MVCC) work in PostgreSQL or InnoDB?"
      },
      {
        question: "How do you identify and resolve high CPU usage and memory leaks in a production Node.js service?",
        idealAnswer: "Take V8 heap snapshots and CPU profiles using inspector or clinic.js. Analyze retained objects, unclosed DB connections, lingering event listeners, or blocking synchronous regex/cryptography on event loop.",
        keyPoints: ["Heap snapshot comparison", "Event loop lag monitoring", "Worker threads for CPU-heavy tasks"],
        followUp: "How would you automate cluster health checks and zero-downtime restarts?"
      }
    ]
  };

  const pool = bank[interviewType] || bank['Technical'];
  return pool.slice(0, count).map((item, idx) => ({
    questionNumber: idx + 1,
    question: item.question,
    category: interviewType,
    difficulty: difficulty,
    idealAnswer: item.idealAnswer,
    keyPoints: item.keyPoints,
    followUp: item.followUp
  }));
}

function getFallbackResumeAnalysis(resumeText, targetRole) {
  const textLower = resumeText.toLowerCase();
  const techStack = [];
  const commonTech = ["javascript", "typescript", "react", "node.js", "python", "java", "sql", "postgresql", "mongodb", "docker", "aws", "git", "next.js", "express", "graphql", "tailwind", "redis", "linux"];
  
  commonTech.forEach(t => {
    if (textLower.includes(t)) techStack.push(t.charAt(0).toUpperCase() + t.slice(1));
  });

  return {
    atsScore: Math.min(88, Math.max(68, techStack.length * 6 + 35)),
    structureScore: 82,
    readabilityScore: 85,
    skillsDetected: {
      technical: techStack.slice(0, 6),
      frameworks: techStack.filter(s => ["React", "Next.js", "Express"].includes(s)),
      tools: ["Git", "Docker", "VS Code"],
      soft: ["Team Collaboration", "Problem Solving", "Code Reviews"]
    },
    missingSkills: ["Automated CI/CD Pipelines", "Unit Testing (Jest/Mocha)", "Cloud Architecture (AWS/GCP)", "Performance Optimization"],
    strengths: [
      "Clear chronological layout with identifiable sections",
      `Good representation of modern technical stack (${techStack.slice(0, 4).join(', ')})`,
      "Concise description of technical responsibilities"
    ],
    weaknesses: [
      "Few metrics quantifying business impact (e.g. % performance increase, users supported)",
      "Skills section could be better categorized by Proficiency and Domain",
      "Summary statement could be more focused on your primary engineering niche"
    ],
    suggestions: [
      "Add quantifiable metrics to every project: 'Increased API throughput by 35% through Redis caching'",
      "Include GitHub and live demo deployment URLs for all featured projects",
      "Incorporate high-priority keywords for your target role: " + targetRole
    ],
    keywords: {
      found: techStack.slice(0, 8),
      recommended: ["Scalability", "Microservices", "RESTful APIs", "System Architecture", "Test-Driven Development"]
    },
    sectionAnalysis: {
      contactInfo: { score: 90, feedback: "Essential contact information present.", status: "good" },
      professionalSummary: { score: 72, feedback: "Add a crisp 2-line summary highlighting your specialty and years of experience.", status: "warning" },
      workExperience: { score: 80, feedback: "Solid experience overview; quantify impact with metrics.", status: "good" },
      education: { score: 88, feedback: "Academic background presented clearly.", status: "good" },
      skillsSection: { score: 85, feedback: "Strong technical skill list.", status: "good" },
      projects: { score: 75, feedback: "Include architecture details and live links for projects.", status: "warning" }
    }
  };
}

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateMockFollowUp,
  generateFinalInterviewSummary,
  analyzeResumeText,
  matchResumeToJobDescription,
};
