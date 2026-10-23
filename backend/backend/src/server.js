require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readStore, writeStore } = require("./store");
const { courses, lessons, mentors, labs } = require("./catalog");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set in backend/.env and contain at least 32 characters.");
  process.exit(1);
}

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || true,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));

function issueToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}
function publicUser(user) {
  return { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt };
}
function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Please log in to continue." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = readStore();
    const user = db.users.find(item => item.id === payload.sub);
    if (!user) return res.status(401).json({ error: "Account not found. Please log in again." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
}
function asyncRoute(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "CyberVerse API" }));

app.post("/api/auth/register", asyncRoute(async (req, res) => {
  const fullName = String(req.body.fullName || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (fullName.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long." });

  const db = readStore();
  if (db.users.some(user => user.email === email)) return res.status(409).json({ error: "An account with this email already exists." });
  const user = {
    id: require("crypto").randomUUID(),
    fullName,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  writeStore(db);
  res.status(201).json({ message: "Account created successfully.", user: publicUser(user) });
}));

app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const db = readStore();
  const user = db.users.find(item => item.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  res.json({ message: "Login successful.", token: issueToken(user), user: publicUser(user) });
}));

app.get("/api/auth/me", authRequired, (req, res) => res.json({ user: publicUser(req.user) }));
app.post("/api/auth/logout", (_req, res) => res.json({ message: "Logged out. Remove the token from the browser." }));

app.get("/api/courses", (_req, res) => res.json({ courses }));
app.get("/api/courses/:courseId", (req, res) => {
  const course = courses.find(item => item.id === Number(req.params.courseId));
  if (!course) return res.status(404).json({ error: "Course not found." });
  res.json({ course, lessons: lessons.filter(item => item.courseId === course.id) });
});
app.get("/api/lessons", (req, res) => {
  const courseId = req.query.courseId ? Number(req.query.courseId) : null;
  const level = req.query.level ? String(req.query.level) : null;
  res.json({ lessons: lessons.filter(item => (!courseId || item.courseId === courseId) && (!level || item.level === level)) });
});

app.get("/api/dashboard", authRequired, (req, res) => {
  const db = readStore();
  const completedLessons = db.progress.filter(p => p.userId === req.user.id && p.completed).length;
  const completedLabs = db.labCompletions.filter(p => p.userId === req.user.id).length;
  const courseProgress = courses.map(course => {
    const total = lessons.filter(lesson => lesson.courseId === course.id).length;
    const completed = db.progress.filter(p => p.userId === req.user.id && p.completed &&
      lessons.some(l => l.id === p.lessonId && l.courseId === course.id)).length;
    return { courseId: course.id, title: course.title, completedLessons: completed, totalLessons: total,
      percent: total ? Math.round(completed / total * 100) : 0 };
  });
  res.json({
    user: publicUser(req.user),
    stats: { coursesAvailable: courses.length, lessonsCompleted: completedLessons, labsCompleted: completedLabs },
    courseProgress
  });
});

app.get("/api/progress", authRequired, (req, res) => {
  const db = readStore();
  res.json({ progress: db.progress.filter(p => p.userId === req.user.id) });
});
app.put("/api/progress/:lessonId", authRequired, (req, res) => {
  const lesson = lessons.find(item => item.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: "Lesson not found." });
  const completed = req.body.completed !== false;
  const db = readStore();
  const index = db.progress.findIndex(p => p.userId === req.user.id && p.lessonId === lesson.id);
  const item = { userId: req.user.id, lessonId: lesson.id, completed, updatedAt: new Date().toISOString() };
  if (index >= 0) db.progress[index] = item;
  else db.progress.push(item);
  writeStore(db);
  res.json({ progress: item });
});

app.get("/api/labs", (_req, res) => res.json({ labs }));
app.get("/api/labs/:labId", (req, res) => {
  const lab = labs.find(item => item.id === req.params.labId);
  if (!lab) return res.status(404).json({ error: "Lab not found." });
  res.json({ lab });
});
app.get("/api/labs/completions", authRequired, (req, res) => {
  const db = readStore();
  res.json({ completions: db.labCompletions.filter(item => item.userId === req.user.id) });
});
app.post("/api/labs/:labId/complete", authRequired, (req, res) => {
  const lab = labs.find(item => item.id === req.params.labId);
  if (!lab) return res.status(404).json({ error: "Lab not found." });
  const db = readStore();
  let item = db.labCompletions.find(p => p.userId === req.user.id && p.labId === lab.id);
  if (!item) {
    item = { userId: req.user.id, labId: lab.id, completedAt: new Date().toISOString() };
    db.labCompletions.push(item);
    writeStore(db);
  }
  res.json({ completion: item });
});

app.get("/api/mentors", (_req, res) => res.json({ mentors }));
app.post("/api/mentors/:mentorId/chat", authRequired, (req, res) => {
  const mentor = mentors.find(item => item.id === req.params.mentorId);
  if (!mentor) return res.status(404).json({ error: "Mentor not found." });
  const message = String(req.body.message || "").trim();
  if (!message) return res.status(400).json({ error: "Please enter a question." });
  if (message.length > 2000) return res.status(400).json({ error: "Question must be 2,000 characters or fewer." });

  const normalized = message.toLowerCase();
  let answer;
  if (normalized.includes("cia triad") || normalized.includes("confidentiality")) {
    answer = "The CIA triad means Confidentiality (only authorized people can access data), Integrity (data remains accurate and trustworthy), and Availability (systems and data are accessible when needed).";
  } else if (normalized.includes("firewall")) {
    answer = "A firewall enforces traffic rules between systems or network zones. A good starting point is to allow only required traffic, log important decisions, and review rules regularly.";
  } else if (normalized.includes("ids") || normalized.includes("ips")) {
    answer = "An IDS detects and alerts on suspicious activity. An IPS can also block traffic inline. Both need sensible rules, tuning, and monitoring to reduce false positives.";
  } else if (normalized.includes("xss") || normalized.includes("cross-site scripting")) {
    answer = "Cross-site scripting occurs when untrusted content is interpreted as executable script in a user's browser. Defenses include context-aware output encoding, safe templating, and avoiding unsafe DOM APIs.";
  } else if (normalized.includes("sql injection") || normalized.includes("parameterized")) {
    answer = "SQL injection happens when untrusted input changes a database query's structure. Use parameterized queries, avoid building SQL with string concatenation, and give database accounts only the permissions they need.";
  } else if (normalized.includes("least privilege")) {
    answer = "Least privilege means giving each account or service only the permissions required for its task, for only as long as needed. Review and remove permissions that are no longer necessary.";
  } else {
    answer = `Let's break that down. ${mentor.specialty} starts with understanding the concept, identifying the risk it addresses, and learning the defensive controls. Ask a more specific question and I can explain it step by step. This built-in demo mentor does not call an external AI service.`;
  }
  const db = readStore();
  db.chatHistory.push({ userId: req.user.id, mentorId: mentor.id, message, answer, createdAt: new Date().toISOString() });
  writeStore(db);
  res.json({ mentor: { id: mentor.id, name: mentor.name }, message, answer });
});

app.use((req, res) => res.status(404).json({ error: "API route not found." }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

// Vercel imports this Express app as a serverless function. For local testing only,
// start a listener when this file is executed directly.
if (require.main === module) {
  app.listen(PORT, () => console.log(`CyberVerse API running on port ${PORT}`));
}

module.exports = app;
