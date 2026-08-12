"use client";
import { useEffect, useState } from "react";

type View = "daily" | "weekly" | "study" | "monthly" | "period" | "library";
type Template = "daily" | "weekly" | "study" | "monthly" | "period";
type PlannerDoc = { id: string; title: string; template: Template; data: any; createdAt: string; updatedAt: string };

const moods = [
  { e: "😆", label: "Amazing", color: "#a8e6cf" },
  { e: "🙂", label: "Good", color: "#ffd3b6" },
  { e: "😐", label: "Okay", color: "#ffaaa5" },
  { e: "😟", label: "Low", color: "#d8b4fe" },
  { e: "😭", label: "Awful", color: "#ffb6c1" },
];
const weathers = [
  { e: "☀️", label: "Sunny" },
  { e: "⛅", label: "Cloudy" },
  { e: "🌧️", label: "Rainy" },
  { e: "⛈️", label: "Storm" },
  { e: "❄️", label: "Snow" },
];
const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TEMPLATE_META: Record<Template, { label: string; icon: string; desc: string; color: string; hero: string }> = {
  daily: { label: "Daily", icon: "🌿", desc: "Flaffees — Daily flow", color: "#c5d6b8", hero: "Daily Planner" },
  weekly: { label: "Weekly", icon: "📅", desc: "Study — Plan your week", color: "#8fb8ff", hero: "Weekly Study Planner" },
  study: { label: "Study", icon: "✏️", desc: "Plan Today, Achieve Tomorrow", color: "#ffe082", hero: "Study Planner" },
  monthly: { label: "Monthly", icon: "🌙", desc: "Glow & Grow", color: "#d9c2ff", hero: "Glow & Grow" },
  period: { label: "Cycle", icon: "🩷", desc: "Period • Self-care", color: "#ff8fb1", hero: "Period Marking" },
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function getDefaultDailyData() {
  return {
    dailyDate: new Date().toISOString().slice(0, 10),
    dailyMood: 1,
    dailyWeather: 0,
    sleepHours: 7,
    restedFeel: "Pretty good!",
    dailyReflection: "Today I focused on deep work and felt productive. The morning was calm, had coffee by the window.",
    reminderTo: "Call mom • Buy sketchbook • Return library books",
    water: 5,
    otherDrinks: "Matcha latte",
    workout: "Pilates + walk",
    minutes: "45",
    steps: "6,240",
    schedule: [
      { time: "7:00 AM", activity: "Morning pages + stretch" },
      { time: "9:00 AM", activity: "Study: Biology Ch. 4" },
      { time: "11:00 AM", activity: "Assignments - essay draft" },
      { time: "1:00 PM", activity: "Lunch break + walk" },
      { time: "3:00 PM", activity: "Math practice set" },
      { time: "5:00 PM", activity: "Free / creative time" },
      { time: "8:00 PM", activity: "Read + wind down" },
    ],
    todos: [
      { text: "Finish biology notes", done: true },
      { text: "Review flashcards 30m", done: true },
      { text: "Math worksheet p.42", done: false },
      { text: "Water plants & tidy desk", done: false },
      { text: "Plan tomorrow's meals", done: false },
      { text: "Journal 10 mins", done: false },
      { text: "Send email to professor", done: false },
    ],
    moneyIn: "40.00",
    moneyFrom: "Allowance",
    moneyOut: "12.50",
    moneyFor: "Stationery",
    gratitude: "My cozy desk, supportive friends, and the rainy sound this morning.",
    meals: { breakfast: "Oatmeal + berries", lunch: "Poke bowl", dinner: "Pasta", snacks: "Yogurt" },
    notes: "Idea: make mind-map for history. Remember to test active recall.",
    tomorrow: "Start earlier (7am) • Prep chem lab • Grocery run",
    energy: 6,
    topPriorities: ["Biology exam prep", "Math homework", "Laundry & reset room"],
  };
}
function getDefaultWeeklyData() {
  return {
    weekOf: "Aug 11 - Aug 17, 2026",
    dreamGoal: "Ace my midterms while staying balanced and kind to myself.",
    weeklyInspiration: "You don't have to be perfect, you just have to start. Small steps every day.",
    weeklyGoals: ["Finish 3 chapters", "Gym 4×", "Inbox zero by Friday", "Sleep before 11pm", "Call grandma"],
    weeklyPriorities: ["Deep work 2h daily", "Complete project draft", "Self-care Sunday"],
    weekDays: fullDays.map((d, i) => ({
      day: d,
      subject: ["Biology", "Math", "Chemistry", "Literature", "History", "Art", "Rest"][i],
      topic: ["Cells & Mitosis", "Integrals", "Organic Ch.2", "Essay: Woolf", "WWII notes", "Sketching", "Revision & rest"][i],
      time: ["9-11 AM", "10-12 AM", "2-4 PM", "4-6 PM", "9-11 AM", "Flexible", "—"][i],
      notes: i === 0 ? "Lab at 2pm" : i === 2 ? "Quiz Friday!" : "",
      hearts: [true, false, true].map(() => false),
    })),
    assignments: [
      { assignment: "Bio lab report", subject: "Biology", due: "Wed", done: false },
      { assignment: "Essay outline", subject: "Literature", due: "Thu", done: true },
      { assignment: "Problem set 5", subject: "Math", due: "Fri", done: false },
      { assignment: "Chem flashcards", subject: "Chem", due: "Fri", done: false },
    ],
    knowledgeQuest: [
      { subject: "Biology", topic: "Cell cycle", confidence: 4 },
      { subject: "Math", topic: "Integration", confidence: 3 },
      { subject: "History", topic: "WWII Timeline", confidence: 5 },
    ],
    brainDump: "Ideas for project: habit app, zine about plants, ask professor about extension?",
    curiosity: "How do memories form? • Kintsugi philosophy • Indoor plant propagation",
    futureMe: "Hey future me, you did great this week. Rest tonight, you're prepared!",
    brightIdeas: "Make study playlist • Try Pomodoro with tea ritual • Study at library Thu",
    tinyWins: ["Finished ch.4", "Woke up 7am ×3", "Cooked dinner"],
  };
}
function getDefaultStudyData() {
  return {
    studyTable: [
      { day: "MONDAY", subject: "Biology", topics: "Ch.4 Cells", time: "2h", revision: "Flashcards", priority: 3 },
      { day: "TUESDAY", subject: "Math", topics: "Integrals", time: "1.5h", revision: "Practice set", priority: 2 },
      { day: "WEDNESDAY", subject: "Chemistry", topics: "Organic", time: "2h", revision: "Notes", priority: 3 },
      { day: "THURSDAY", subject: "Lit", topics: "Woolf essay", time: "2h", revision: "Outline", priority: 2 },
      { day: "FRIDAY", subject: "History", topics: "WWII", time: "1h", revision: "Timeline", priority: 3 },
      { day: "SATURDAY", subject: "Art", topics: "Sketching", time: "1h", revision: "—", priority: 1 },
      { day: "SUNDAY", subject: "Review", topics: "Weekly revision", time: "Flexible", revision: "Yes", priority: 4 },
    ],
    studySchedule: [
      { slot: "6 - 8 AM", task: "Morning review - Bio", status: true, notes: "Done" },
      { slot: "9 - 11 AM", task: "Deep work - Math", status: false, notes: "" },
      { slot: "1 - 3 PM", task: "Chemistry lab prep", status: false, notes: "" },
      { slot: "4 - 6 PM", task: "Reading + essay", status: false, notes: "" },
      { slot: "7 - 9 PM", task: "Light revision", status: false, notes: "" },
    ],
    studyGoals: ["Finish Ch.4-5 Bio", "Score 85%+ on practice test", "Submit essay early"],
    noteToSelf: "Small steps every day lead to big results. You can do it!",
  };
}
function getDefaultMonthlyData() {
  return {
    month: "August",
    year: "2026",
    thisMonthWill: "Build a consistent morning routine & finish midterm prep",
    monthlyGoals: ["Morning routine 5×/week", "Read 2 books", "Save $100", "Run 30km", "Plan trip"],
    importantDates: "Aug 15 - Bio exam • Aug 22 - Project due • Aug 30 - Friends trip",
    weeklyFocus: ["W1: Reset & plan", "W2: Deep study", "W3: Exams", "W4: Rest + reflect"],
    selfCareList: ["Hydrate", "Stretch daily", "Unwind no screen 30m", "Be kind to myself"],
    monthlyTodos: [
      { text: "Buy planner stickers", done: true },
      { text: "Clean digital files", done: false },
      { text: "Book doctor appt", done: false },
    ],
    monthlyNotes: "August feels bright. Remember to take breaks and enjoy the process.",
    monthlyGrateful: "Sunsets, iced coffee, my cat, and good music",
  };
}
function getDefaultPeriodData() {
  return {
    periodMonth: "August",
    periodYear: "2026",
    flowType: "Medium",
    painLevel: 4,
    periodMood: "Calm",
    symptoms: ["Cramps", "Bloating"],
    waterGlasses: 6,
    periodDetails: { start: "Aug 5", end: "Aug 9", cycle: "28", flow: "Medium", notes: "Lighter than last month" },
    selfCarePeriod: ["Drink Water", "Rest & Sleep", "Take Supplements"],
  };
}
function getDefaultDataForTemplate(t: Template) {
  if (t === "daily") return getDefaultDailyData();
  if (t === "weekly") return getDefaultWeeklyData();
  if (t === "study") return getDefaultStudyData();
  if (t === "monthly") return getDefaultMonthlyData();
  return getDefaultPeriodData();
}

export default function PlannerPage() {
  const [view, setView] = useState<View>("library");
  const [theme, setTheme] = useState<"pastel" | "cherry" | "sage" | "pink">("pastel");
  const [saveMsg, setSaveMsg] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState<"use" | "install">("use");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Library state
  const [planners, setPlanners] = useState<PlannerDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState<Template | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showRename, setShowRename] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const activePlanner = planners.find((p) => p.id === activeId) || null;

  // Daily state
  const [dailyDate, setDailyDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dailyMood, setDailyMood] = useState(1);
  const [dailyWeather, setDailyWeather] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [restedFeel, setRestedFeel] = useState("Pretty good!");
  const [dailyReflection, setDailyReflection] = useState("Today I focused on deep work and felt productive. The morning was calm, had coffee by the window.");
  const [reminderTo, setReminderTo] = useState("Call mom • Buy sketchbook • Return library books");
  const [water, setWater] = useState(5);
  const [otherDrinks, setOtherDrinks] = useState("Matcha latte");
  const [workout, setWorkout] = useState("Pilates + walk");
  const [minutes, setMinutes] = useState("45");
  const [steps, setSteps] = useState("6,240");
  const [schedule, setSchedule] = useState([
    { time: "7:00 AM", activity: "Morning pages + stretch" },
    { time: "9:00 AM", activity: "Study: Biology Ch. 4" },
    { time: "11:00 AM", activity: "Assignments - essay draft" },
    { time: "1:00 PM", activity: "Lunch break + walk" },
    { time: "3:00 PM", activity: "Math practice set" },
    { time: "5:00 PM", activity: "Free / creative time" },
    { time: "8:00 PM", activity: "Read + wind down" },
  ]);
  const [todos, setTodos] = useState([
    { text: "Finish biology notes", done: true },
    { text: "Review flashcards 30m", done: true },
    { text: "Math worksheet p.42", done: false },
    { text: "Water plants & tidy desk", done: false },
    { text: "Plan tomorrow's meals", done: false },
    { text: "Journal 10 mins", done: false },
    { text: "Send email to professor", done: false },
  ]);
  const [moneyIn, setMoneyIn] = useState("40.00");
  const [moneyFrom, setMoneyFrom] = useState("Allowance");
  const [moneyOut, setMoneyOut] = useState("12.50");
  const [moneyFor, setMoneyFor] = useState("Stationery");
  const [gratitude, setGratitude] = useState("My cozy desk, supportive friends, and the rainy sound this morning.");
  const [meals, setMeals] = useState({ breakfast: "Oatmeal + berries", lunch: "Poke bowl", dinner: "Pasta", snacks: "Yogurt" });
  const [notes, setNotes] = useState("Idea: make mind-map for history. Remember to test active recall.");
  const [tomorrow, setTomorrow] = useState("Start earlier (7am) • Prep chem lab • Grocery run");
  const [energy, setEnergy] = useState(6);
  const [topPriorities, setTopPriorities] = useState(["Biology exam prep", "Math homework", "Laundry & reset room"]);

  // Weekly state
  const [weekOf, setWeekOf] = useState("Aug 11 - Aug 17, 2026");
  const [dreamGoal, setDreamGoal] = useState("Ace my midterms while staying balanced and kind to myself.");
  const [weeklyInspiration, setWeeklyInspiration] = useState("You don't have to be perfect, you just have to start. Small steps every day.");
  const [weeklyGoals, setWeeklyGoals] = useState(["Finish 3 chapters", "Gym 4×", "Inbox zero by Friday", "Sleep before 11pm", "Call grandma"]);
  const [weeklyPriorities, setWeeklyPriorities] = useState(["Deep work 2h daily", "Complete project draft", "Self-care Sunday"]);
  const [weekDays, setWeekDays] = useState(
    fullDays.map((d, i) => ({
      day: d,
      subject: ["Biology", "Math", "Chemistry", "Literature", "History", "Art", "Rest"][i],
      topic: ["Cells & Mitosis", "Integrals", "Organic Ch.2", "Essay: Woolf", "WWII notes", "Sketching", "Revision & rest"][i],
      time: ["9-11 AM", "10-12 AM", "2-4 PM", "4-6 PM", "9-11 AM", "Flexible", "—"][i],
      notes: i === 0 ? "Lab at 2pm" : i === 2 ? "Quiz Friday!" : "",
      hearts: [true, false, true].map(() => false),
    }))
  );
  const [assignments, setAssignments] = useState([
    { assignment: "Bio lab report", subject: "Biology", due: "Wed", done: false },
    { assignment: "Essay outline", subject: "Literature", due: "Thu", done: true },
    { assignment: "Problem set 5", subject: "Math", due: "Fri", done: false },
    { assignment: "Chem flashcards", subject: "Chem", due: "Fri", done: false },
  ]);
  const [knowledgeQuest, setKnowledgeQuest] = useState([
    { subject: "Biology", topic: "Cell cycle", confidence: 4 },
    { subject: "Math", topic: "Integration", confidence: 3 },
    { subject: "History", topic: "WWII Timeline", confidence: 5 },
  ]);
  const [habits] = useState([
    { name: "Drink water", days: [true, true, false, true, true, true, false] },
    { name: "Exercise", days: [true, false, true, false, true, false, false] },
    { name: "Read 30m", days: [true, true, true, true, false, true, true] },
    { name: "Meditate", days: [false, true, true, false, true, true, false] },
  ]);
  const [weeklyMood, setWeeklyMood] = useState(5);
  const [brainDump, setBrainDump] = useState("Ideas for project: habit app, zine about plants, ask professor about extension?");
  const [curiosity, setCuriosity] = useState("How do memories form? • Kintsugi philosophy • Indoor plant propagation");
  const [futureMe, setFutureMe] = useState("Hey future me, you did great this week. Rest tonight, you're prepared!");
  const [brightIdeas, setBrightIdeas] = useState("Make study playlist • Try Pomodoro with tea ritual • Study at library Thu");
  const [tinyWins, setTinyWins] = useState(["Finished ch.4", "Woke up 7am ×3", "Cooked dinner"]);

  // Study planner
  const [studyTable, setStudyTable] = useState([
    { day: "MONDAY", subject: "Biology", topics: "Ch.4 Cells", time: "2h", revision: "Flashcards", priority: 3 },
    { day: "TUESDAY", subject: "Math", topics: "Integrals", time: "1.5h", revision: "Practice set", priority: 2 },
    { day: "WEDNESDAY", subject: "Chemistry", topics: "Organic", time: "2h", revision: "Notes", priority: 3 },
    { day: "THURSDAY", subject: "Lit", topics: "Woolf essay", time: "2h", revision: "Outline", priority: 2 },
    { day: "FRIDAY", subject: "History", topics: "WWII", time: "1h", revision: "Timeline", priority: 3 },
    { day: "SATURDAY", subject: "Art", topics: "Sketching", time: "1h", revision: "—", priority: 1 },
    { day: "SUNDAY", subject: "Review", topics: "Weekly revision", time: "Flexible", revision: "Yes", priority: 4 },
  ]);
  const [studySchedule, setStudySchedule] = useState([
    { slot: "6 - 8 AM", task: "Morning review - Bio", status: true, notes: "Done" },
    { slot: "9 - 11 AM", task: "Deep work - Math", status: false, notes: "" },
    { slot: "1 - 3 PM", task: "Chemistry lab prep", status: false, notes: "" },
    { slot: "4 - 6 PM", task: "Reading + essay", status: false, notes: "" },
    { slot: "7 - 9 PM", task: "Light revision", status: false, notes: "" },
  ]);
  const [studyGoals, setStudyGoals] = useState(["Finish Ch.4-5 Bio", "Score 85%+ on practice test", "Submit essay early"]);
  const [noteToSelf, setNoteToSelf] = useState("Small steps every day lead to big results. You can do it!");

  // Monthly
  const [month, setMonth] = useState("August");
  const [year, setYear] = useState("2026");
  const [thisMonthWill, setThisMonthWill] = useState("Build a consistent morning routine & finish midterm prep");
  const [monthlyGoals, setMonthlyGoals] = useState(["Morning routine 5×/week", "Read 2 books", "Save $100", "Run 30km", "Plan trip"]);
  const [importantDates, setImportantDates] = useState("Aug 15 - Bio exam • Aug 22 - Project due • Aug 30 - Friends trip");
  const [weeklyFocus, setWeeklyFocus] = useState(["W1: Reset & plan", "W2: Deep study", "W3: Exams", "W4: Rest + reflect"]);
  const [selfCareList, setSelfCareList] = useState(["Hydrate", "Stretch daily", "Unwind no screen 30m", "Be kind to myself"]);
  const [monthlyTodos, setMonthlyTodos] = useState([
    { text: "Buy planner stickers", done: true },
    { text: "Clean digital files", done: false },
    { text: "Book doctor appt", done: false },
  ]);
  const [monthlyNotes, setMonthlyNotes] = useState("August feels bright. Remember to take breaks and enjoy the process.");
  const [monthlyGrateful, setMonthlyGrateful] = useState("Sunsets, iced coffee, my cat, and good music");

  // Period
  const [periodMonth, setPeriodMonth] = useState("August");
  const [periodYear, setPeriodYear] = useState("2026");
  const [flowType, setFlowType] = useState("Medium");
  const [painLevel, setPainLevel] = useState(4);
  const [periodMood, setPeriodMood] = useState("Calm");
  const [symptoms, setSymptoms] = useState<string[]>(["Cramps", "Bloating"]);
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [periodDetails, setPeriodDetails] = useState({ start: "Aug 5", end: "Aug 9", cycle: "28", flow: "Medium", notes: "Lighter than last month" });
  const [selfCarePeriod, setSelfCarePeriod] = useState<string[]>(["Drink Water", "Rest & Sleep", "Take Supplements"]);

  const toggleSymptom = (s: string) => setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleSC = (s: string) => setSelfCarePeriod((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  // helpers to collect/apply
  const collectDaily = () => ({ dailyDate, dailyMood, dailyWeather, sleepHours, restedFeel, dailyReflection, reminderTo, water, otherDrinks, workout, minutes, steps, schedule, todos, moneyIn, moneyFrom, moneyOut, moneyFor, gratitude, meals, notes, tomorrow, energy, topPriorities });
  const collectWeekly = () => ({ weekOf, dreamGoal, weeklyInspiration, weeklyGoals, weeklyPriorities, weekDays, assignments, knowledgeQuest, brainDump, curiosity, futureMe, brightIdeas, tinyWins });
  const collectStudy = () => ({ studyTable, studySchedule, studyGoals, noteToSelf });
  const collectMonthly = () => ({ month, year, thisMonthWill, monthlyGoals, importantDates, weeklyFocus, selfCareList, monthlyTodos, monthlyNotes, monthlyGrateful });
  const collectPeriod = () => ({ periodMonth, periodYear, flowType, painLevel, periodMood, symptoms, waterGlasses, periodDetails, selfCarePeriod });
  const collectForTemplate = (t: Template) => {
    if (t === "daily") return collectDaily();
    if (t === "weekly") return collectWeekly();
    if (t === "study") return collectStudy();
    if (t === "monthly") return collectMonthly();
    return collectPeriod();
  };
  const applyDaily = (d: any) => {
    if (!d) return;
    if (d.dailyDate) setDailyDate(d.dailyDate);
    if (d.dailyMood !== undefined) setDailyMood(d.dailyMood);
    if (d.dailyWeather !== undefined) setDailyWeather(d.dailyWeather);
    if (d.sleepHours !== undefined) setSleepHours(d.sleepHours);
    if (d.restedFeel !== undefined) setRestedFeel(d.restedFeel);
    if (d.dailyReflection !== undefined) setDailyReflection(d.dailyReflection);
    if (d.reminderTo !== undefined) setReminderTo(d.reminderTo);
    if (d.water !== undefined) setWater(d.water);
    if (d.otherDrinks !== undefined) setOtherDrinks(d.otherDrinks);
    if (d.workout !== undefined) setWorkout(d.workout);
    if (d.minutes !== undefined) setMinutes(d.minutes);
    if (d.steps !== undefined) setSteps(d.steps);
    if (d.schedule) setSchedule(d.schedule);
    if (d.todos) setTodos(d.todos);
    if (d.moneyIn !== undefined) setMoneyIn(d.moneyIn);
    if (d.moneyFrom !== undefined) setMoneyFrom(d.moneyFrom);
    if (d.moneyOut !== undefined) setMoneyOut(d.moneyOut);
    if (d.moneyFor !== undefined) setMoneyFor(d.moneyFor);
    if (d.gratitude !== undefined) setGratitude(d.gratitude);
    if (d.meals) setMeals(d.meals);
    if (d.notes !== undefined) setNotes(d.notes);
    if (d.tomorrow !== undefined) setTomorrow(d.tomorrow);
    if (d.energy !== undefined) setEnergy(d.energy);
    if (d.topPriorities) setTopPriorities(d.topPriorities);
  };
  const applyWeekly = (d: any) => {
    if (!d) return;
    if (d.weekOf) setWeekOf(d.weekOf);
    if (d.dreamGoal) setDreamGoal(d.dreamGoal);
    if (d.weeklyInspiration) setWeeklyInspiration(d.weeklyInspiration);
    if (d.weeklyGoals) setWeeklyGoals(d.weeklyGoals);
    if (d.weeklyPriorities) setWeeklyPriorities(d.weeklyPriorities);
    if (d.weekDays) setWeekDays(d.weekDays);
    if (d.assignments) setAssignments(d.assignments);
    if (d.knowledgeQuest) setKnowledgeQuest(d.knowledgeQuest);
    if (d.brainDump) setBrainDump(d.brainDump);
    if (d.curiosity) setCuriosity(d.curiosity);
    if (d.futureMe) setFutureMe(d.futureMe);
    if (d.brightIdeas) setBrightIdeas(d.brightIdeas);
    if (d.tinyWins) setTinyWins(d.tinyWins);
  };
  const applyStudy = (d: any) => {
    if (!d) return;
    if (d.studyTable) setStudyTable(d.studyTable);
    if (d.studySchedule) setStudySchedule(d.studySchedule);
    if (d.studyGoals) setStudyGoals(d.studyGoals);
    if (d.noteToSelf) setNoteToSelf(d.noteToSelf);
  };
  const applyMonthly = (d: any) => {
    if (!d) return;
    if (d.month) setMonth(d.month);
    if (d.year) setYear(d.year);
    if (d.thisMonthWill) setThisMonthWill(d.thisMonthWill);
    if (d.monthlyGoals) setMonthlyGoals(d.monthlyGoals);
    if (d.importantDates) setImportantDates(d.importantDates);
    if (d.weeklyFocus) setWeeklyFocus(d.weeklyFocus);
    if (d.selfCareList) setSelfCareList(d.selfCareList);
    if (d.monthlyTodos) setMonthlyTodos(d.monthlyTodos);
    if (d.monthlyNotes) setMonthlyNotes(d.monthlyNotes);
    if (d.monthlyGrateful) setMonthlyGrateful(d.monthlyGrateful);
  };
  const applyPeriod = (d: any) => {
    if (!d) return;
    if (d.periodMonth) setPeriodMonth(d.periodMonth);
    if (d.periodYear) setPeriodYear(d.periodYear);
    if (d.flowType) setFlowType(d.flowType);
    if (d.painLevel !== undefined) setPainLevel(d.painLevel);
    if (d.periodMood) setPeriodMood(d.periodMood);
    if (d.symptoms) setSymptoms(d.symptoms);
    if (d.waterGlasses !== undefined) setWaterGlasses(d.waterGlasses);
    if (d.periodDetails) setPeriodDetails(d.periodDetails);
    if (d.selfCarePeriod) setSelfCarePeriod(d.selfCarePeriod);
  };
  const applyData = (t: Template, d: any) => {
    if (t === "daily") applyDaily(d);
    else if (t === "weekly") applyWeekly(d);
    else if (t === "study") applyStudy(d);
    else if (t === "monthly") applyMonthly(d);
    else applyPeriod(d);
  };

  const persistPlanners = (next: PlannerDoc[]) => {
    setPlanners(next);
    localStorage.setItem("plannie-library-v2", JSON.stringify(next));
    if (activeId) localStorage.setItem("plannie-active-id", activeId);
    fetch("/api/planner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "library", key: "main", data: { docs: next } }) }).catch(() => {});
  };

  const saveCurrentToActive = () => {
    if (!activePlanner) return;
    const data = collectForTemplate(activePlanner.template);
    const next = planners.map((p) => (p.id === activePlanner.id ? { ...p, data, updatedAt: new Date().toISOString() } : p));
    persistPlanners(next);
    // also keep legacy single save for backwards compat
    localStorage.setItem("plannie-data", JSON.stringify({ daily: collectDaily(), weekly: collectWeekly(), study: collectStudy(), monthly: collectMonthly(), period: collectPeriod() }));
    return next;
  };

  const saveAll = async () => {
    saveCurrentToActive();
    setSaveMsg("Saved ✓ — locally & cloud");
    setTimeout(() => setSaveMsg(""), 2500);
  };

  const createPlanner = (template: Template, opts?: { title?: string; fromCurrent?: boolean }) => {
    const currentData: any = opts?.fromCurrent && activePlanner?.template === template ? collectForTemplate(template) : getDefaultDataForTemplate(template);
    const baseTitle = opts?.title || (template === "daily" ? `Daily • ${new Date().toLocaleDateString()}` : template === "weekly" ? `Weekly • ${currentData.weekOf || new Date().toLocaleDateString()}` : template === "study" ? `Study • Week ${planners.filter(p=>p.template==="study").length+1}` : template === "monthly" ? `${currentData.month || "Monthly"} • ${currentData.year || ""}` : `Cycle • ${currentData.periodMonth || ""}`);
    const doc: PlannerDoc = { id: uid(template), title: baseTitle, template, data: currentData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const next = [...planners, doc];
    persistPlanners(next);
    setActiveId(doc.id);
    setView(template as View);
    applyData(template, currentData);
    setShowNewModal(null);
    setSaveMsg(`Created "${baseTitle}" ✓`);
    setTimeout(() => setSaveMsg(""), 2500);
  };

  const duplicateActive = () => {
    if (!activePlanner) return;
    const data = collectForTemplate(activePlanner.template);
    const doc: PlannerDoc = { id: uid(activePlanner.template), title: `Copy of ${activePlanner.title}`, template: activePlanner.template, data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const next = [...planners, doc];
    persistPlanners(next);
    setActiveId(doc.id);
    applyData(doc.template, data);
    setSaveMsg(`Duplicated to "${doc.title}" ✓`);
    setTimeout(() => setSaveMsg(""), 2500);
  };

  const deletePlanner = (id: string) => {
    const target = planners.find((p) => p.id === id);
    if (!target) return;
    if (!confirm(`Delete "${target.title}"? This cannot be undone.`)) return;
    const next = planners.filter((p) => p.id !== id);
    if (next.length === 0) {
      // create one default to avoid empty
      const def = getDefaultDataForTemplate(target.template);
      const doc: PlannerDoc = { id: uid(target.template), title: `${TEMPLATE_META[target.template].label} • New`, template: target.template, data: def, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      next.push(doc);
      persistPlanners(next);
      setActiveId(doc.id);
      applyData(doc.template, def);
    } else {
      persistPlanners(next);
      if (id === activeId) {
        const fallback = next.find((p) => p.template === target.template) || next[0];
        setActiveId(fallback.id);
        applyData(fallback.template, fallback.data);
        setView(fallback.template as View);
      }
    }
  };

  const renamePlanner = (id: string, title: string) => {
    const next = planners.map((p) => (p.id === id ? { ...p, title, updatedAt: new Date().toISOString() } : p));
    persistPlanners(next);
    setShowRename(null);
  };

  const switchToPlanner = (id: string) => {
    // save current before switch
    if (activePlanner) {
      const data = collectForTemplate(activePlanner.template);
      const saved = planners.map((p) => (p.id === activePlanner.id ? { ...p, data, updatedAt: new Date().toISOString() } : p));
      persistPlanners(saved);
    }
    const doc = planners.find((p) => p.id === id);
    if (!doc) return;
    setActiveId(doc.id);
    localStorage.setItem("plannie-active-id", doc.id);
    applyData(doc.template, doc.data);
    setView(doc.template as View);
  };

  // init planners
  useEffect(() => {
    const stored = localStorage.getItem("plannie-library-v2");
    const storedActive = localStorage.getItem("plannie-active-id");
    if (stored) {
      try {
        const parsed: PlannerDoc[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlanners(parsed);
          const active = storedActive && parsed.find((p) => p.id === storedActive) ? storedActive : parsed[0].id;
          setActiveId(active);
          const doc = parsed.find((p) => p.id === active) || parsed[0];
          applyData(doc.template, doc.data);
          setView(doc.template as View);
          return;
        }
      } catch {}
    }
    // migrate from old single save if exists
    const old = localStorage.getItem("plannie-data");
    let migrated: PlannerDoc[] | null = null;
    if (old) {
      try {
        const p = JSON.parse(old);
        migrated = [];
        if (p.daily) migrated.push({ id: uid("daily"), title: `Daily • ${p.daily.dailyDate || new Date().toLocaleDateString()}`, template: "daily", data: p.daily, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        if (p.weekly) migrated.push({ id: uid("weekly"), title: `Weekly • ${p.weekly.weekOf}`, template: "weekly", data: p.weekly, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        if (p.study) migrated.push({ id: uid("study"), title: `Study • Plan`, template: "study", data: p.study, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        if (p.monthly) migrated.push({ id: uid("monthly"), title: `${p.monthly.month} • ${p.monthly.year}`, template: "monthly", data: p.monthly, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        if (p.period) migrated.push({ id: uid("period"), title: `Cycle • ${p.period.periodMonth}`, template: "period", data: p.period, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      } catch {}
    }
    if (migrated && migrated.length > 0) {
      setPlanners(migrated);
      setActiveId(migrated[0].id);
      applyData(migrated[0].template, migrated[0].data);
      setView(migrated[0].template as View);
      localStorage.setItem("plannie-library-v2", JSON.stringify(migrated));
      localStorage.setItem("plannie-active-id", migrated[0].id);
      return;
    }
    // fresh defaults: create 5
    const now = new Date().toISOString();
    const defaults: PlannerDoc[] = [
      { id: uid("weekly"), title: "Weekly • Aug 11-17 • Study", template: "weekly", data: getDefaultWeeklyData(), createdAt: now, updatedAt: now },
      { id: uid("daily"), title: `Daily • ${new Date().toLocaleDateString()}`, template: "daily", data: getDefaultDailyData(), createdAt: now, updatedAt: now },
      { id: uid("study"), title: "Study • Week 1", template: "study", data: getDefaultStudyData(), createdAt: now, updatedAt: now },
      { id: uid("monthly"), title: "August • Glow & Grow", template: "monthly", data: getDefaultMonthlyData(), createdAt: now, updatedAt: now },
      { id: uid("period"), title: "Cycle • August", template: "period", data: getDefaultPeriodData(), createdAt: now, updatedAt: now },
    ];
    setPlanners(defaults);
    setActiveId(defaults[0].id);
    applyData(defaults[0].template, defaults[0].data);
    setView(defaults[0].template as View);
    localStorage.setItem("plannie-library-v2", JSON.stringify(defaults));
    localStorage.setItem("plannie-active-id", defaults[0].id);
    fetch("/api/planner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "library", key: "main", data: { docs: defaults } }) }).catch(() => {});
    // try load from DB after
    fetch("/api/planner?type=library&key=main").then(r=>r.json()).then(j=>{
      if(j.entry?.data?.docs && Array.isArray(j.entry.data.docs) && j.entry.data.docs.length>0){
        // if DB has more recent, prefer it when local is fresh? Keep local for now.
      }
    }).catch(()=>{});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const checkStandalone = () => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
      setIsStandalone(!!standalone);
    };
    checkStandalone();
    window.addEventListener("appinstalled", () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    });
    const params = new URLSearchParams(window.location.search);
    const v = params.get("view");
    if (v && ["daily","weekly","study","monthly","period","library"].includes(v)) setView(v as View);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    } else {
      setHelpTab("install");
      setShowHelp(true);
    }
  };

  const handleViewChange = (v: View) => {
    if (v === "library") {
      // save current before leaving
      if (activePlanner) {
        const data = collectForTemplate(activePlanner.template);
        const saved = planners.map((p) => (p.id === activePlanner.id ? { ...p, data, updatedAt: new Date().toISOString() } : p));
        persistPlanners(saved);
      }
      setView("library");
      return;
    }
    // find planner for that template
    const candidates = planners.filter((p) => p.template === v);
    if (candidates.length === 0) {
      createPlanner(v as Template);
      return;
    }
    // if active already matches, just switch view
    if (activePlanner?.template === v) {
      setView(v);
      return;
    }
    // save current
    if (activePlanner) {
      const data = collectForTemplate(activePlanner.template);
      const saved = planners.map((p) => (p.id === activePlanner.id ? { ...p, data, updatedAt: new Date().toISOString() } : p));
      persistPlanners(saved);
      // use saved for picking next to avoid stale
      const nextActive = saved.find((p) => p.template === v) || candidates[0];
      setActiveId(nextActive.id);
      applyData(nextActive.template, nextActive.data);
      setView(v);
    } else {
      const nextActive = candidates[0];
      setActiveId(nextActive.id);
      applyData(nextActive.template, nextActive.data);
      setView(v);
    }
  };

  const cherry = theme === "cherry";
  const sage = theme === "sage";
  const pinkTheme = theme === "pink";
  const plannersForView = activePlanner ? planners.filter((p) => p.template === activePlanner.template) : [];

  return (
    <div className={`min-h-screen ${cherry ? "bg-[#0a0a0a] text-zinc-100" : pinkTheme ? "bg-[#fff1f5]" : sage ? "bg-[#f4f1eb]" : "bg-[#f0f4ff]"} transition-colors duration-500`}>
      <div className={`h-1.5 w-full ${cherry ? "bg-black" : "bg-gradient-to-r from-[#a7c7e7] via-[#ffd6e7] to-[#c3b1e1]"} `} />
      <header className={`${cherry ? "bg-white text-black border-black" : "bg-white/80 backdrop-blur-xl border-[#dbe6ff]"} sticky top-0 z-50 border-b`}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <div className={`${cherry ? "bg-black text-white" : "bg-[#8fb8ff] text-white"} h-10 w-10 grid place-items-center rounded-xl text-xl`}>🎀</div>
              <div>
                <h1 className="font-extrabold tracking-tight leading-none" style={{ fontFamily: "Baloo 2, cursive", fontSize: "1.6rem" }}>
                  <span className={cherry ? "text-black" : "text-[#6a8de8]"}>Plann</span>
                  <span className={cherry ? "text-black italic font-light" : "text-[#ff8fb1] italic font-light"}>ie</span>
                  <span className="ml-2 rounded-full bg-[#ff8fb1] px-2 py-0.5 text-[10px] font-bold tracking-widest text-white align-middle">STUDIO</span>
                </h1>
                <p className={`text-xs ${cherry ? "text-zinc-600" : "text-slate-500"} hidden sm:block`} style={{ fontFamily: "Nunito, sans-serif" }}>Plan your week. Stay focused. You've got this ✨</p>
              </div>
            </div>

            <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button onClick={() => handleViewChange("library")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap ${view==="library" ? (cherry?"bg-black text-white": "bg-[#8fb8ff] text-white shadow-md") : cherry?"bg-zinc-100 text-zinc-700": "bg-[#f0f4ff] text-slate-600 border border-[#e6eaf7]"}`}>
                <span>🗂️</span> My Planners <span className="bg-white/20 rounded-full px-1.5 text-[10px]">{planners.length}</span>
              </button>
              {[
                { id: "daily", label: "Daily", icon: "🌿", desc: "Flaffees" },
                { id: "weekly", label: "Weekly", icon: "📅", desc: "Study" },
                { id: "study", label: "Study", icon: "✏️", desc: "Plan" },
                { id: "monthly", label: "Monthly", icon: "🌙", desc: "Glow & Grow" },
                { id: "period", label: "Cycle", icon: "🩷", desc: "Period" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleViewChange(tab.id as View)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                    view === tab.id
                      ? cherry
                        ? "bg-black text-white shadow-lg"
                        : pinkTheme
                        ? "bg-[#ff8fb1] text-white shadow-md"
                        : sage
                        ? "bg-[#6b7f59] text-white"
                        : "bg-[#8fb8ff] text-white shadow-md"
                      : cherry
                      ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      : "bg-[#f0f4ff] text-slate-600 hover:bg-white border border-[#e6eaf7]"
                  }`}
                >
                  <span>{tab.icon}</span> {tab.label}
                  <span className={`hidden lg:inline text-[10px] opacity-70 font-normal`}>{tab.desc}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className={`hidden md:flex items-center gap-1 rounded-full border p-1 ${cherry ? "bg-zinc-100 border-zinc-200" : "bg-[#f8f9ff] border-[#e6eaf7]"}`}>
                {[
                  { k: "pastel", c: "bg-[#8fb8ff]", title: "Cloud" },
                  { k: "cherry", c: "bg-black", title: "Cherry" },
                  { k: "sage", c: "bg-[#c5d6b8]", title: "Sage" },
                  { k: "pink", c: "bg-[#ff8fb1]", title: "Blush" },
                ].map((t) => (
                  <button
                    key={t.k}
                    onClick={() => setTheme(t.k as any)}
                    className={`h-7 w-7 rounded-full border-2 grid place-items-center text-[11px] ${t.c} ${theme === t.k ? "border-white shadow ring-2 ring-[#8fb8ff] scale-110" : "border-white/60"}`}
                    title={t.title}
                  >
                    {theme === t.k ? "✓" : ""}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setHelpTab("use"); setShowHelp(true); }}
                className={`hidden sm:grid h-10 w-10 place-items-center rounded-full border text-sm font-black ${cherry ? "bg-white border-zinc-300 text-black" : "bg-[#fff8e1] border-[#ffe082] text-[#7a6a00]"}`}
                title="How to use"
              >
                ?
              </button>
              <button onClick={saveAll} className={`rounded-full px-5 py-2.5 text-sm font-extrabold shadow-sm transition ${cherry ? "bg-black text-white hover:bg-zinc-800" : "bg-[#8fb8ff] text-white hover:bg-[#7aa8ff]"} `}>
                Save
              </button>
              <button onClick={() => window.print()} className={`hidden sm:block rounded-full border px-4 py-2.5 text-sm font-bold ${cherry ? "bg-white border-zinc-300" : "bg-white border-[#e6eaf7] text-slate-700"}`}>
                Print
              </button>
              {isStandalone ? (
                <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-black text-emerald-700">
                  ✓ App
                </span>
              ) : (
                <button
                  onClick={handleInstall}
                  className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-black shadow-sm border transition ${deferredPrompt ? "bg-[#ff8fb1] text-white border-[#ff8fb1] animate-pulse" : cherry ? "bg-white border-zinc-300 text-black hover:bg-zinc-50" : "bg-white border-[#8fb8ff] text-[#6a8de8] hover:bg-[#f0f4ff]"}`}
                >
                  <span>⬇</span> Install
                </button>
              )}
            </div>
          </div>
          {saveMsg && <div className="pb-2 text-right text-xs font-bold text-emerald-600">{saveMsg}</div>}
        </div>
      </header>
      {!isStandalone && showInstallBanner && deferredPrompt && (
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-2xl bg-gradient-to-r from-[#8fb8ff] to-[#ff8fb1] p-[1.5px] shadow-sm">
            <div className="rounded-[14px] bg-white flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 grid place-items-center rounded-xl bg-[#f0f4ff] text-xl">📲</div>
                <div>
                  <div className="text-sm font-black">Use Plannie like a real app</div>
                  <div className="text-xs text-slate-500">Install to your phone/desktop — works offline, opens in one tap, no app store needed. Your planners stay on THIS device.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleInstall} className="rounded-full bg-[#8fb8ff] text-white px-5 py-2 text-sm font-black">Install Plannie</button>
                <button onClick={() => setShowInstallBanner(false)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isStandalone && showInstallBanner && !deferredPrompt && (
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`rounded-2xl border p-3 flex flex-wrap items-center justify-between gap-2 ${cherry ? "bg-zinc-50 border-zinc-200" : "bg-[#fffbeb] border-[#ffe082]"}`}>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-7 w-7 grid place-items-center rounded-full bg-[#8fb8ff] text-white text-xs">💡</span>
              <span className="font-bold">Want it as an app?</span>
              <span className="hidden sm:inline text-slate-600 text-xs">Tap</span>
              <button onClick={() => { setHelpTab("install"); setShowHelp(true); }} className="rounded-full bg-white border border-[#ffe082] px-3 py-1 text-xs font-black underline">How to install →</button>
              <span className="hidden sm:inline text-slate-500 text-xs">It takes 5 seconds and works 100% offline — data stays on your phone.</span>
            </div>
            <button onClick={() => setShowInstallBanner(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">✕</button>
          </div>
        </div>
      )}

      {/* Planner switcher bar for template views */}
      {view !== "library" && activePlanner && (
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-3 flex flex-wrap items-center gap-3 shadow-sm`}>
            <div className="flex items-center gap-2">
              <span className={`h-8 w-8 grid place-items-center rounded-xl text-sm ${activePlanner.template==="weekly"?"bg-[#e6eeff]":activePlanner.template==="daily"?"bg-[#f2f6ed]":activePlanner.template==="study"?"bg-[#fff8e1]":activePlanner.template==="monthly"?"bg-[#faf8ff]":"bg-[#fff1f5]"} border border-[#e6eaf7]`}>{TEMPLATE_META[activePlanner.template].icon}</span>
              <div>
                <div className="text-[11px] font-black tracking-widest text-[#8fb8ff]">{TEMPLATE_META[activePlanner.template].label.toUpperCase()} PLANNERS</div>
                <div className="text-xs font-bold">{plannersForView.length} {plannersForView.length===1?"planner":"planners"} • Tap to switch</div>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2">
              <select value={activeId || ""} onChange={(e) => switchToPlanner(e.target.value)} className="flex-1 rounded-full border border-[#dbe6ff] bg-[#f8f9ff] px-4 py-2.5 text-sm font-bold outline-none">
                {plannersForView.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} • {new Date(p.updatedAt).toLocaleDateString()}</option>
                ))}
              </select>
              <span className="hidden sm:inline text-xs text-slate-400">{activePlanner.title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button onClick={() => setShowNewModal(activePlanner.template)} className="rounded-full bg-[#8fb8ff] text-white px-4 py-2 text-xs font-black flex items-center gap-1">＋ New {TEMPLATE_META[activePlanner.template].label}</button>
              <button onClick={duplicateActive} className="rounded-full border border-[#dbe6ff] bg-white px-3 py-2 text-xs font-bold">⧉ Duplicate</button>
              <button onClick={() => { setShowRename(activePlanner.id); setRenameVal(activePlanner.title); }} className="rounded-full border border-[#dbe6ff] bg-white px-3 py-2 text-xs font-bold">✎ Rename</button>
              <button onClick={() => deletePlanner(activePlanner.id)} className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600">🗑 Delete</button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Saved locally on this device • Works offline after you Install • <button onClick={() => handleViewChange("library")} className="underline font-bold">Manage all planners →</button>
          </div>
        </div>
      )}

      {view === "library" ? (
        <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero */}
          <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-[24px] border p-6 sm:p-8 relative overflow-hidden`}>
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#8fb8ff]/20 to-[#ff8fb1]/20 blur-2xl"></div>
            <div className="flex flex-wrap gap-6 items-start">
              <div className="flex-1 min-w-[280px]">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f0f4ff] border border-[#dbe6ff] px-3 py-1 text-xs font-black text-[#6a8de8]">🗂️ MY PLANNERS • {planners.length} total • On this device</div>
                <h2 className="mt-3 text-[2rem] sm:text-[2.6rem] font-black leading-none" style={{ fontFamily: "Baloo 2, cursive" }}>
                  <span className={cherry ? "text-black" : "text-[#8fb8ff]"}>Your planner</span> <span className="italic font-light" style={{ fontFamily: "Dancing Script, cursive" }}>library</span>
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-[600px]">All your planners live <span className="font-black">locally on this phone/computer</span> (and in the cloud). Create as many as you want from any template — yes, you can have <span className="font-black">Weekly #1, Weekly #2, Weekly #3…</span> each with different weeks. Duplicate any planner to reuse your layout.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">✓ Works offline</span>
                  <span className="rounded-full bg-[#fff8e1] border border-[#ffe082] px-3 py-1 text-xs font-bold text-[#7a6a00]">✓ Data stays on your device</span>
                  <span className="rounded-full bg-[#f0f4ff] border border-[#dbe6ff] px-3 py-1 text-xs font-bold text-[#6a8de8]">✓ No account needed</span>
                </div>
              </div>
              <div className="w-full sm:w-[340px] rounded-2xl border border-[#dbe6ff] bg-[#fbfdff] p-4">
                <div className="text-xs font-black tracking-widest text-[#8fb8ff]">CREATE NEW FROM TEMPLATE</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["daily","weekly","study","monthly","period"] as Template[]).map((t) => (
                    <button key={t} onClick={() => setShowNewModal(t)} className="rounded-2xl border bg-white p-3 text-center hover:shadow-md transition border-[#e6eaf7] group">
                      <div className="text-2xl group-hover:scale-110 transition">{TEMPLATE_META[t].icon}</div>
                      <div className="text-xs font-black mt-1">{TEMPLATE_META[t].label}</div>
                      <div className="text-[10px] text-slate-500">{planners.filter(p=>p.template===t).length} made</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => { setHelpTab("install"); setShowHelp(true); }} className="mt-3 w-full rounded-full bg-[#8fb8ff] text-white py-2.5 text-xs font-black">📲 How to have it on your phone →</button>
                <div className="mt-2 text-[11px] text-slate-500 text-center">Tip: After Install, your library is on your home screen and opens instantly — no internet needed.</div>
              </div>
            </div>
          </div>

          {/* Sections per template */}
          <div className="mt-6 space-y-6">
            {(["weekly","daily","study","monthly","period"] as Template[]).map((t) => {
              const list = planners.filter((p) => p.template === t);
              return (
                <div key={t} className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border overflow-hidden`}>
                  <div className={`px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 ${t==="weekly"?"bg-[#e6eeff]":t==="daily"?"bg-[#f2f6ed]":t==="study"?"bg-[#fff8e1]":t==="monthly"?"bg-[#faf8ff]":"bg-[#fff1f5]"} border-b border-[#e6eaf7]`}>
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 grid place-items-center rounded-xl bg-white border border-[#e6eaf7] text-xl">{TEMPLATE_META[t].icon}</span>
                      <div>
                        <div className="font-black text-sm">{TEMPLATE_META[t].hero} <span className="text-xs font-normal text-slate-500">• {TEMPLATE_META[t].desc}</span></div>
                        <div className="text-xs text-slate-600">{list.length} {list.length===1?"planner":"planners"} • Create unlimited copies</div>
                      </div>
                    </div>
                    <button onClick={() => setShowNewModal(t)} className="rounded-full bg-white border border-[#dbe6ff] px-4 py-2 text-xs font-black shadow-sm">＋ New {TEMPLATE_META[t].label}</button>
                  </div>
                  {list.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-3xl">📄</div>
                      <div className="text-sm font-bold mt-2">No {TEMPLATE_META[t].label} planners yet</div>
                      <div className="text-xs text-slate-500">Start from the pretty {TEMPLATE_META[t].label} template in one tap.</div>
                      <button onClick={() => setShowNewModal(t)} className="mt-3 rounded-full bg-[#8fb8ff] text-white px-6 py-2 text-sm font-black">Create your first {TEMPLATE_META[t].label}</button>
                    </div>
                  ) : (
                    <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((p) => (
                        <div key={p.id} className="rounded-2xl border border-[#e6eaf7] bg-[#fbfdff] p-4 flex flex-col gap-3 hover:shadow-md transition">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-black text-sm truncate" title={p.title}>{p.title}</div>
                              <div className="text-[11px] text-slate-500">Updated {new Date(p.updatedAt).toLocaleString()} • {p.template}</div>
                            </div>
                            <span className={`h-7 w-7 grid place-items-center rounded-full border text-xs shrink-0 ${t==="weekly"?"bg-[#e6eeff] border-[#dbe6ff]":t==="daily"?"bg-[#f2f6ed] border-[#c5d6b8]":t==="study"?"bg-[#fff8e1] border-[#ffe082]":t==="monthly"?"bg-[#faf8ff] border-[#e6d9ff]":"bg-[#fff1f5] border-[#ffd6e7]"}`}>{TEMPLATE_META[t].icon}</span>
                          </div>
                          <div className="rounded-xl bg-white border border-[#e6eaf7] p-2 min-h-[60px]">
                            <div className="text-[11px] font-bold text-slate-700 line-clamp-3">
                              {t==="weekly" && (p.data.weekOf || "Week of —")}
                              {t==="daily" && (p.data.dailyDate || p.data.reminderTo || "Daily reflection…")}
                              {t==="study" && (p.data.studyTable?.[0]?.subject || "Study plan")}
                              {t==="monthly" && (p.data.month + " " + p.data.year || "Monthly")}
                              {t==="period" && (p.data.periodMonth + " " + p.data.periodYear || "Cycle")}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {t==="weekly" && p.data.dreamGoal?.slice(0,70)}
                              {t==="daily" && p.data.gratitude?.slice(0,70)}
                              {t==="study" && p.data.noteToSelf?.slice(0,70)}
                              {t==="monthly" && p.data.thisMonthWill?.slice(0,70)}
                              {t==="period" && p.data.periodDetails?.notes?.slice(0,70)}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <button onClick={() => switchToPlanner(p.id)} className="flex-1 rounded-full bg-[#8fb8ff] text-white py-2 text-xs font-black">Open →</button>
                            <button onClick={() => { const dup = { ...p, id: uid(p.template), title: `Copy of ${p.title}`, data: JSON.parse(JSON.stringify(p.data)), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; const next=[...planners, dup]; persistPlanners(next); setSaveMsg(`Duplicated ✓`); setTimeout(()=>setSaveMsg(""),2000); }} className="rounded-full border border-[#dbe6ff] bg-white px-3 py-2 text-xs font-bold">⧉</button>
                            <button onClick={() => { setShowRename(p.id); setRenameVal(p.title); }} className="rounded-full border border-[#dbe6ff] bg-white px-3 py-2 text-xs font-bold">✎</button>
                            <button onClick={() => deletePlanner(p.id)} className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600">🗑</button>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => switchToPlanner(p.id)} className="flex-1 rounded-full border border-dashed border-[#c5d6b8] py-1.5 text-[11px] font-bold text-[#6b7f59]">Edit in {TEMPLATE_META[t].label} view</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-[#dbe6ff] bg-[#f0f4ff] p-4 flex flex-wrap gap-4 items-center">
            <div className="text-2xl">💾</div>
            <div className="flex-1 min-w-[240px]">
              <div className="font-black text-sm">Local + Cloud</div>
              <div className="text-xs text-slate-600">All planners are saved instantly to <span className="font-bold">localStorage on this device</span> (so they work offline) and also to the cloud when you tap Save. If you clear browser data, export first.</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { const blob = new Blob([JSON.stringify(planners, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `plannie-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url); }} className="rounded-full bg-white border border-[#dbe6ff] px-4 py-2 text-xs font-bold">⬇ Export all (.json)</button>
              <button onClick={() => window.print()} className="rounded-full bg-[#8fb8ff] text-white px-4 py-2 text-xs font-black">🖨 Print current</button>
            </div>
          </div>
        </main>
      ) : (
        <>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-6">
            <div className={`${cherry ? "bg-white border-black text-black" : "bg-white border-[#dbe6ff]"} rounded-[24px] border shadow-sm overflow-hidden relative`}>
              {view === "weekly" && (
                <div className="relative p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="hidden sm:grid h-24 w-24 place-items-center rounded-2xl bg-[#f0f4ff] text-5xl border border-[#dbe6ff]">🐰</div>
                      <div>
                        <h2 className="text-[2.2rem] sm:text-[2.8rem] font-black tracking-tight leading-none" style={{ fontFamily: "Baloo 2, cursive" }}>
                          <span className={cherry ? "text-black" : "text-[#8fb8ff]"}>Weekly</span> <span className={cherry ? "font-light italic" : "text-[#6a7bd9] font-light italic"} style={{ fontFamily: "Dancing Script, cursive" }}>Study Planner</span>
                        </h2>
                        <p className="mt-1 inline-block rounded-full bg-[#fff1a8] px-3 py-1 text-xs font-bold text-[#7a6a00] border border-[#ffe082]">Plan your week. Stay focused. You've got this ✨ • {activePlanner?.title}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase tracking-widest ${cherry ? "text-black" : "text-[#8fb8ff]"}`}>Week of :</span>
                          <input value={weekOf} onChange={(e) => setWeekOf(e.target.value)} className={`${cherry ? "border-black" : "border-[#dbe6ff]"} rounded-full border bg-[#f8f9ff] px-4 py-1.5 text-sm font-semibold w-[220px]`} />
                          <span className="text-[#ff8fb1]">💙</span>
                        </div>
                      </div>
                    </div>
                    <div className={`${cherry ? "border-black bg-zinc-50" : "border-[#dbe6ff] bg-[#fbfdff]"} rounded-2xl border p-4 w-full sm:w-[320px] relative`}>
                      <div className={`absolute -top-2 -right-2 rounded-full ${cherry ? "bg-black text-white" : "bg-[#8fb8ff] text-white"} px-3 py-1 text-[10px] font-black tracking-widest`}>WEEKLY INSPIRATION ✨</div>
                      <textarea value={weeklyInspiration} onChange={(e) => setWeeklyInspiration(e.target.value)} rows={3} className="mt-2 w-full resize-none bg-transparent text-sm leading-relaxed font-medium placeholder:text-slate-400 outline-none" placeholder="Write something that inspires you this week..." />
                      <div className="absolute bottom-2 right-3 text-2xl">🧸</div>
                      <div className="absolute -top-1 left-6 text-[#8fb8ff]">🎀</div>
                    </div>
                  </div>
                  <div className={`${cherry ? "border-black bg-zinc-50" : "border-[#dbe6ff] bg-[#f8f9ff]"} mt-4 rounded-2xl border p-3 flex gap-3 items-center`}>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffd6e7] text-sm">⭐</span>
                    <div className="flex-1">
                      <div className="text-xs font-black tracking-widest text-[#8fb8ff]">DREAM GOAL</div>
                      <div className="text-[11px] text-slate-500">What dream am I working toward this week?</div>
                    </div>
                    <input value={dreamGoal} onChange={(e) => setDreamGoal(e.target.value)} className="flex-1 min-w-0 rounded-xl border border-[#dbe6ff] bg-white px-3 py-2 text-sm font-medium" placeholder="e.g., Ace midterms while staying balanced" />
                    <span className="text-[#8fb8ff]">♡</span>
                  </div>
                </div>
              )}
              {view === "daily" && (
                <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4" style={{ fontFamily: "Nunito, sans-serif" }}>
                  <div>
                    <h2 className="text-[2rem] sm:text-[2.6rem] font-black leading-none" style={{ fontFamily: "Dancing Script, cursive" }}>
                      <span className={cherry ? "text-black" : sage ? "text-[#6b7f59]" : pinkTheme ? "text-[#ff8fb1]" : "text-[#6b7f59]"}>Daily</span> <span className="text-slate-800 font-bold" style={{ fontFamily: "Baloo 2, cursive" }}>Planner</span>
                    </h2>
                    <p className={`text-xs font-bold tracking-widest ${cherry ? "text-black" : "text-[#6b7f59]"}`}>plan today. slay always. ♡ — FOCUS + CONSISTENCY = RESULTS • {activePlanner?.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-2xl border px-4 py-2 ${cherry ? "border-black" : "border-[#c5d6b8] bg-[#f2f6ed]"}`}>
                      <div className="text-[11px] font-black tracking-widest text-[#6b7f59]">DATE</div>
                      <input type="date" value={dailyDate} onChange={(e) => setDailyDate(e.target.value)} className="bg-transparent text-sm font-bold outline-none" />
                    </div>
                    <div className="hidden sm:block text-3xl">🎧</div>
                    <div className={`${cherry ? "bg-black text-white" : "bg-[#6b1c23] text-white"} rounded-2xl px-3 py-2 text-xs font-bold rotate-3`}>you<br />can.</div>
                  </div>
                </div>
              )}
              {view === "study" && (
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#c9b6ff] px-6 py-3 -rotate-1">
                      <h2 className="text-[2.2rem] font-black leading-none text-white" style={{ fontFamily: "Baloo 2, cursive" }}>Study Planner</h2>
                    </div>
                    <div className="rounded-full bg-[#fff1a8] px-3 py-1 text-xs font-bold border border-[#ffe082]">Plan Today, Achieve Tomorrow ♡ • {activePlanner?.title}</div>
                    <div className="ml-auto hidden sm:block text-5xl">🪴</div>
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-500">• Focus • Plan • Study • Succeed</p>
                </div>
              )}
              {view === "monthly" && (
                <div className="p-5 sm:p-6 flex flex-wrap gap-4 items-center">
                  <div className="text-5xl hidden sm:block">🦊</div>
                  <div>
                    <h2 className="text-[2.2rem] font-black leading-none" style={{ fontFamily: "Baloo 2, cursive" }}><span className="text-[#a88de8]">Glow & Grow</span> <span className="text-sm font-bold tracking-widest text-[#6a5acd] block">MONTHLY PLANNER</span></h2>
                    <p className="rounded-full bg-[#c9b6ff] px-3 py-1 text-xs font-bold text-white inline-block mt-1">Step-by-step, day-by-day towards my goals • {activePlanner?.title}</p>
                  </div>
                  <div className={`${cherry ? "border-black" : "border-[#e6d9ff] bg-[#faf8ff]"} ml-auto rounded-2xl border p-3 w-full sm:w-[320px]`}>
                    <div className="flex gap-2 text-xs"><span className="font-black">Month:</span><input value={month} onChange={e=>setMonth(e.target.value)} className="flex-1 border-b border-dashed bg-transparent outline-none" /></div>
                    <div className="flex gap-2 text-xs mt-2"><span className="font-black">This Month I Will:</span><input value={thisMonthWill} onChange={e=>setThisMonthWill(e.target.value)} className="flex-1 border-b border-dashed bg-transparent outline-none text-xs" /></div>
                  </div>
                  <div className="hidden sm:block text-4xl">🌙</div>
                </div>
              )}
              {view === "period" && (
                <div className="p-5 sm:p-6 flex flex-wrap gap-4 items-center bg-[#fff1f5]">
                  <div className="flex-1">
                    <h2 className="text-[2.4rem] font-black leading-none" style={{ fontFamily: "Baloo 2, cursive" }}><span className="text-[#ff8fb1]">Period</span> <span className="text-[#7a4a5a] text-xl">Marking Planner</span></h2>
                    <p className="text-xs font-bold tracking-widest text-[#ff8fb1]">Track. Understand. Care. Empower. • {activePlanner?.title}</p>
                    <div className="mt-3 flex gap-3">
                      <div className="rounded-xl bg-white border border-[#ffd6e7] px-3 py-2 text-xs"><span className="font-black">MONTH:</span> <input value={periodMonth} onChange={e=>setPeriodMonth(e.target.value)} className="border-b border-dashed w-24 outline-none" /></div>
                      <div className="rounded-xl bg-white border border-[#ffd6e7] px-3 py-2 text-xs"><span className="font-black">YEAR:</span> <input value={periodYear} onChange={e=>setPeriodYear(e.target.value)} className="border-b border-dashed w-20 outline-none" /></div>
                    </div>
                  </div>
                  <div className="text-6xl hidden sm:block">🐰</div>
                  <div className="hidden sm:block rounded-2xl bg-white border border-[#ffd6e7] p-3 text-center">
                    <div className="text-[#ff8fb1] text-xl">💖</div>
                    <p className="text-[10px] font-bold text-[#7a4a5a]">You are strong,<br/>beautiful and<br/>your body is amazing.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
            {view === "daily" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4 relative overflow-hidden`}>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#ff8fb1] text-xs">🎀</div>
                    <div className="text-center text-xs font-black tracking-widest mt-2" style={{ fontFamily: "Baloo 2, cursive" }}>Mood</div>
                    <div className="mt-2 flex justify-center gap-2">
                      {moods.map((m, i) => (
                        <button key={i} onClick={() => setDailyMood(i)} className={`h-10 w-10 rounded-full grid place-items-center text-xl border-2 transition ${dailyMood === i ? "border-[#8fb8ff] bg-[#f0f4ff] scale-110" : "border-transparent bg-[#f8f9ff] hover:bg-white"}`}>{m.e}</button>
                      ))}
                    </div>
                    <div className="text-center text-xs font-bold text-[#8fb8ff] mt-1">{moods[dailyMood].label}</div>
                  </div>

                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4 text-center`}>
                    <div className="flex justify-center gap-1">
                      {daysOfWeek.map((d, i) => {
                        const active = new Date(dailyDate).getDay() === (i === 6 ? 0 : i + 1);
                        return (
                          <span key={i} className={`h-7 w-7 grid place-items-center rounded-full text-xs font-black ${active ? "bg-[#8fb8ff] text-white" : "bg-[#f0f4ff] text-slate-600"}`}>{d}</span>
                        );
                      })}
                    </div>
                    <div className="mt-3">
                      <div className="text-xs font-black tracking-widest">Hours of sleep:</div>
                      <div className="flex justify-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                          <button key={n} onClick={() => setSleepHours(n)} className={`text-lg ${n <= sleepHours ? "text-[#ffd700]" : "text-slate-200"}`}>✦</button>
                        ))}
                      </div>
                      <input value={restedFeel} onChange={(e) => setRestedFeel(e.target.value)} placeholder="How rested i feel:" className="mt-2 w-full rounded-full border border-[#e6eaf7] bg-[#f8f9ff] px-3 py-1 text-xs text-center outline-none" />
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4 text-center relative`}>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#ff8fb1] text-xs">🎀</div>
                    <div className="text-xs font-black tracking-widest mt-2">Weather</div>
                    <div className="mt-2 flex justify-center gap-2">
                      {weathers.map((w, i) => (
                        <button key={i} onClick={() => setDailyWeather(i)} className={`h-9 w-9 grid place-items-center rounded-full text-lg border-2 ${dailyWeather === i ? "border-[#8fb8ff] bg-[#f0f4ff]" : "border-transparent bg-[#f8f9ff]"}`}>{w.e}</button>
                      ))}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-1">{weathers[dailyWeather].label}</div>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                  <div className={`${cherry ? "bg-[#0a0a0a] text-white border-zinc-800" : "bg-white border-[#e6eaf7]"} rounded-2xl border overflow-hidden`}>
                    <div className={`${cherry ? "bg-zinc-900" : "bg-[#fff1a8]"} px-3 py-2 flex items-center justify-center gap-2`}>
                      <span className="text-xs">🎀</span>
                      <span className="text-xs font-black tracking-widest">Daily Reflection:</span>
                      <span className="text-xs">🎀</span>
                    </div>
                    <div className="p-3">
                      <div className="h-[140px] rounded-xl bg-gradient-to-b from-sky-100 to-pink-50 border border-[#e6eaf7] p-3">
                        <textarea value={dailyReflection} onChange={(e) => setDailyReflection(e.target.value)} className="h-full w-full resize-none bg-transparent text-xs leading-relaxed outline-none" placeholder="How are you feeling today?" />
                      </div>
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-[#0a0a0a] text-white" : "bg-[#e6f4ea] border-[#c5d6b8]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[#ff8fb1]">🎀</span>
                      <span className="text-xs font-black tracking-widest">Water</span>
                      <span className="text-[#ff8fb1]">🎀</span>
                    </div>
                    <div className="mt-3 flex justify-center gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <button key={n} onClick={() => setWater(n)} className={`text-xl transition ${n <= water ? "opacity-100" : "opacity-20 grayscale"}`}>💧</button>
                      ))}
                    </div>
                    <div className="mt-2 text-center text-[11px] font-bold text-[#6b7f59]">{water} / 8 glasses</div>
                    <input value={otherDrinks} onChange={(e) => setOtherDrinks(e.target.value)} placeholder="Other drinks:" className="mt-2 w-full rounded-full border border-white/50 bg-white px-3 py-1.5 text-xs outline-none" />
                  </div>

                  <div className={`${cherry ? "bg-zinc-900 border-zinc-800 text-white" : "bg-[#e6f4ea] border-[#c5d6b8]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">Exercise</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <div className="mt-3 space-y-2">
                      <input value={workout} onChange={(e) => setWorkout(e.target.value)} placeholder="Workout:" className="w-full rounded-lg border border-[#c5d6b8] bg-white px-3 py-2 text-xs outline-none text-slate-700" />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Total minutes:" className="rounded-lg border border-[#c5d6b8] bg-white px-2 py-2 text-xs outline-none" />
                        <input value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Total steps:" className="rounded-lg border border-[#c5d6b8] bg-white px-2 py-2 text-xs outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">Money tracker</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl border border-[#e6eaf7] bg-[#f8f9ff] p-2">
                        <div className="font-bold text-[#6b7f59]">Money in</div>
                        <input value={moneyIn} onChange={(e) => setMoneyIn(e.target.value)} className="w-full bg-transparent font-bold outline-none" />
                        <div className="text-[10px] text-slate-500">From <input value={moneyFrom} onChange={(e) => setMoneyFrom(e.target.value)} className="w-16 bg-transparent border-b border-dashed outline-none" /></div>
                      </div>
                      <div className="rounded-xl border border-[#e6eaf7] bg-[#f8f9ff] p-2">
                        <div className="font-bold text-[#a85d5d]">Money out</div>
                        <input value={moneyOut} onChange={(e) => setMoneyOut(e.target.value)} className="w-full bg-transparent font-bold outline-none" />
                        <div className="text-[10px] text-slate-500">For <input value={moneyFor} onChange={(e) => setMoneyFor(e.target.value)} className="w-16 bg-transparent border-b border-dashed outline-none" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border overflow-hidden`}>
                    <div className="flex items-center justify-center gap-2 bg-[#f8f9ff] px-3 py-2 border-b border-[#e6eaf7]">
                      <span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black tracking-widest">Schedule</span><span className="text-[#ff8fb1]">🎀</span>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-[80px_1fr] text-[11px] font-black tracking-widest text-slate-500 border-b pb-2"><span>Time</span><span>Activity</span></div>
                      <div className="divide-y divide-dashed">
                        {schedule.map((s, i) => (
                          <div key={i} className="grid grid-cols-[80px_1fr] gap-2 py-2">
                            <input value={s.time} onChange={(e) => setSchedule((prev) => prev.map((x, idx) => (idx === i ? { ...x, time: e.target.value } : x)))} className="rounded-lg border border-[#e6eaf7] bg-[#f8f9ff] px-2 py-1.5 text-xs font-bold outline-none" />
                            <input value={s.activity} onChange={(e) => setSchedule((prev) => prev.map((x, idx) => (idx === i ? { ...x, activity: e.target.value } : x)))} className="rounded-lg border border-[#e6eaf7] px-2 py-1.5 text-xs outline-none" />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setSchedule([...schedule, { time: "", activity: "" }])} className="mt-2 w-full rounded-full border border-dashed border-[#c5d6b8] py-1.5 text-xs font-bold text-[#6b7f59] hover:bg-[#f2f6ed]">+ Add time block</button>
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black tracking-widest">ENERGY LEVEL ⚡</span>
                      <span className="text-xs font-bold">{energy}/8</span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <button key={n} onClick={() => setEnergy(n)} className={`h-5 flex-1 rounded ${n <= energy ? (cherry ? "bg-white" : "bg-[#6b1c23]") : "bg-slate-200"}`} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1"><span>LOW</span><span>HIGH</span></div>
                  </div>

                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">Today I&apos;m grateful for:</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <div className="mt-3 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-[#e6eaf7] p-3 min-h-[110px]">
                      <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} rows={4} className="w-full resize-none bg-transparent text-xs leading-relaxed outline-none" placeholder="List 3 things..." />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">Reminder to:</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <div className="mt-3 rounded-xl bg-gradient-to-br from-pink-50 to-orange-50 border border-[#ffe6cc] p-3 min-h-[120px]">
                      <textarea value={reminderTo} onChange={(e) => setReminderTo(e.target.value)} rows={4} className="w-full resize-none bg-transparent text-xs leading-relaxed outline-none" />
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-[#0a0a0a] text-white border-zinc-800" : "bg-[#e6f4ea] border-[#c5d6b8]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">To Do</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <div className="mt-3 space-y-2">
                      {todos.map((t, i) => (
                        <label key={i} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 border border-[#c5d6b8] cursor-pointer">
                          <input type="checkbox" checked={t.done} onChange={(e) => setTodos((prev) => prev.map((x, idx) => (idx === i ? { ...x, done: e.target.checked } : x)))} className="h-4 w-4 rounded border-[#c5d6b8] accent-[#6b7f59]" />
                          <input value={t.text} onChange={(e) => setTodos((prev) => prev.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x)))} className={`flex-1 bg-transparent text-xs outline-none ${t.done ? "line-through text-slate-400" : "text-slate-700"}`} />
                        </label>
                      ))}
                      <button onClick={() => setTodos([...todos, { text: "", done: false }])} className="w-full rounded-full bg-white border border-dashed border-[#c5d6b8] py-2 text-xs font-bold text-[#6b7f59]">+ Add task</button>
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">Meal tracker</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl border border-[#e6eaf7] p-2 bg-[#f8f9ff]"><div className="font-black text-center">Breakfast</div><textarea value={meals.breakfast} onChange={(e) => setMeals({ ...meals, breakfast: e.target.value })} rows={2} className="w-full resize-none bg-transparent outline-none text-center" /></div>
                      <div className="rounded-xl border border-[#e6eaf7] p-2 bg-[#f8f9ff]"><div className="font-black text-center">Lunch</div><textarea value={meals.lunch} onChange={(e) => setMeals({ ...meals, lunch: e.target.value })} rows={2} className="w-full resize-none bg-transparent outline-none text-center" /></div>
                      <div className="rounded-xl border border-[#e6eaf7] p-2 bg-[#f8f9ff]"><div className="font-black text-center">Dinner</div><textarea value={meals.dinner} onChange={(e) => setMeals({ ...meals, dinner: e.target.value })} rows={2} className="w-full resize-none bg-transparent outline-none text-center" /></div>
                      <div className="rounded-xl border border-[#e6eaf7] p-2 bg-[#f8f9ff]"><div className="font-black text-center">Snacks</div><textarea value={meals.snacks} onChange={(e) => setMeals({ ...meals, snacks: e.target.value })} rows={2} className="w-full resize-none bg-transparent outline-none text-center" /></div>
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-3 flex gap-2`}>
                    <div className="flex-1">
                      <div className="text-[11px] font-black tracking-widest">TOP 3 PRIORITIES ⭐</div>
                      <div className="mt-2 space-y-1">
                        {topPriorities.map((p, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <span className={`${cherry ? "bg-white text-black" : "bg-[#6b1c23] text-white"} h-6 w-6 grid place-items-center rounded-full text-xs font-black`}>{i + 1}</span>
                            <input value={p} onChange={(e) => setTopPriorities((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))} className={`flex-1 rounded-lg border px-2 py-1 text-xs outline-none ${cherry ? "bg-zinc-800 border-zinc-700 text-white" : "bg-[#f8f9ff] border-[#e6eaf7]"}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:block text-2xl self-center">💖</div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4 h-full`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">Notes</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="mt-3 w-full resize-none rounded-xl border border-[#e6eaf7] bg-[#fbfdff] p-3 text-sm outline-none leading-relaxed" placeholder="Brain dump, ideas, reflections..." />
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border p-4 h-full`}>
                    <div className="flex items-center justify-center gap-2"><span className="text-[#ff8fb1]">🎀</span><span className="text-xs font-black">For tomorrow</span><span className="text-[#ff8fb1]">🎀</span></div>
                    <textarea value={tomorrow} onChange={(e) => setTomorrow(e.target.value)} rows={5} className="mt-3 w-full resize-none rounded-xl border border-[#e6eaf7] bg-[#fbfdff] p-3 text-sm outline-none leading-relaxed" placeholder="What will you focus on tomorrow?" />
                  </div>
                </div>
              </div>
            )}

            {view === "weekly" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {weekDays.slice(0, 4).map((d, i) => (
                    <div key={d.day} className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border overflow-hidden shadow-sm`}>
                      <div className={`${cherry ? "bg-black text-white" : "bg-[#e6eeff]"} px-4 py-2.5 flex items-center justify-between`}>
                        <span className="flex items-center gap-2 text-sm font-black"><span className={cherry ? "text-white" : "text-[#8fb8ff]"}>🎀</span> {d.day}</span>
                        <span className="text-xs opacity-60">♡ ♡ ♡</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <label className="flex gap-2 items-center text-xs"><span className="h-5 w-5 grid place-items-center rounded bg-[#f0f4ff]">📖</span><span className="font-bold w-12">Subject:</span><input value={d.subject} onChange={(e) => setWeekDays((prev) => prev.map((x, idx) => (idx === i ? { ...x, subject: e.target.value } : x)))} className="flex-1 border-b border-dotted border-[#cbd5ff] bg-transparent outline-none" /></label>
                        <label className="flex gap-2 items-center text-xs"><span className="h-5 w-5 grid place-items-center rounded bg-[#fff1a8]">🎯</span><span className="font-bold w-12">Topic:</span><input value={d.topic} onChange={(e) => setWeekDays((prev) => prev.map((x, idx) => (idx === i ? { ...x, topic: e.target.value } : x)))} className="flex-1 border-b border-dotted border-[#cbd5ff] bg-transparent outline-none" /></label>
                        <label className="flex gap-2 items-center text-xs"><span className="h-5 w-5 grid place-items-center rounded bg-[#ffd6e7]">🕒</span><span className="font-bold w-12">Time:</span><input value={d.time} onChange={(e) => setWeekDays((prev) => prev.map((x, idx) => (idx === i ? { ...x, time: e.target.value } : x)))} className="flex-1 border-b border-dotted border-[#cbd5ff] bg-transparent outline-none" /></label>
                        <div className="space-y-1 pt-1">
                          {[0, 1, 2].map((n) => (
                            <div key={n} className="flex gap-1.5 items-center">
                              <span className="text-[#8fb8ff] text-xs">♡</span>
                              <input placeholder={n === 0 ? "Key task..." : ""} className="flex-1 rounded bg-[#f8f9ff] px-2 py-1 text-xs outline-none border border-transparent focus:border-[#dbe6ff]" />
                            </div>
                          ))}
                        </div>
                        <textarea value={d.notes} onChange={(e) => setWeekDays((prev) => prev.map((x, idx) => (idx === i ? { ...x, notes: e.target.value } : x)))} placeholder="Notes..." rows={2} className="w-full rounded-xl bg-[#f8f9ff] border border-[#e6eaf7] p-2 text-xs outline-none resize-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weekDays.slice(4, 7).map((d, i) => {
                    const idx = i + 4;
                    return (
                      <div key={d.day} className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border overflow-hidden`}>
                        <div className={`${cherry ? "bg-black text-white" : "bg-[#e6eeff]"} px-4 py-2.5 flex items-center justify-between`}>
                          <span className="flex items-center gap-2 text-sm font-black"><span className="text-[#8fb8ff]">🎀</span> {d.day}</span>
                          <span className="text-xs">{d.day === "Sunday" ? "💻 🪴" : "⭐"}</span>
                        </div>
                        <div className="p-3 space-y-2">
                          <label className="flex gap-2 items-center text-xs"><span className="h-5 w-5 grid place-items-center rounded bg-[#f0f4ff]">📖</span><span className="font-bold w-12">Subject:</span><input value={d.subject} onChange={(e) => setWeekDays((prev) => prev.map((x, ix) => (ix === idx ? { ...x, subject: e.target.value } : x)))} className="flex-1 border-b border-dotted outline-none" /></label>
                          <label className="flex gap-2 items-center text-xs"><span className="h-5 w-5 grid place-items-center rounded bg-[#fff1a8]">🎯</span><span className="font-bold w-12">Topic:</span><input value={d.topic} onChange={(e) => setWeekDays((prev) => prev.map((x, ix) => (ix === idx ? { ...x, topic: e.target.value } : x)))} className="flex-1 border-b border-dotted outline-none" /></label>
                          <label className="flex gap-2 items-center text-xs"><span className="h-5 w-5 grid place-items-center rounded bg-[#ffd6e7]">🕒</span><span className="font-bold w-12">Time:</span><input value={d.time} onChange={(e) => setWeekDays((prev) => prev.map((x, ix) => (ix === idx ? { ...x, time: e.target.value } : x)))} className="flex-1 border-b border-dotted outline-none" /></label>
                          <textarea value={d.notes} onChange={(e) => setWeekDays((prev) => prev.map((x, ix) => (ix === idx ? { ...x, notes: e.target.value } : x)))} placeholder="Notes..." rows={3} className="w-full rounded-xl bg-[#f8f9ff] border border-[#e6eaf7] p-2 text-xs outline-none resize-none" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-3 space-y-4">
                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="flex items-center gap-2 justify-center"><span className="text-[#8fb8ff]">🎀</span><span className="text-xs font-black">Top 5 Priorities</span><span className="text-[#8fb8ff]">🎀</span></div>
                      <div className="mt-3 space-y-2">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <div key={n} className="flex gap-2 items-center">
                            <span className="h-6 w-6 grid place-items-center rounded-full bg-[#8fb8ff] text-white text-xs font-black">{n + 1}</span>
                            <input value={weeklyPriorities[n] || ""} onChange={(e) => setWeeklyPriorities((prev) => { const c=[...prev]; c[n]=e.target.value; return c; })} placeholder={`Priority ${n + 1}`} className="flex-1 rounded-full border border-[#e6eaf7] bg-[#f8f9ff] px-3 py-1.5 text-xs outline-none" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="text-xs font-black flex items-center gap-2"><span className="text-[#8fb8ff]">🔍</span> Curiosity Corner <span className="text-[#ffd700] ml-auto">✦</span></div>
                      <div className="text-[11px] text-slate-500">Things I want to learn more about</div>
                      <textarea value={curiosity} onChange={(e) => setCuriosity(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-[#e6eaf7] bg-[#f8f9ff] p-2 text-xs outline-none resize-none" />
                    </div>

                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="text-xs font-black">✉️ Future Me</div>
                      <div className="text-[11px] text-slate-500">One message for my future self</div>
                      <textarea value={futureMe} onChange={(e) => setFutureMe(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-[#e6eaf7] p-2 text-xs outline-none resize-none bg-[#fbfdff]" placeholder="Dear future me..." />
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-4">
                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="flex items-center gap-2 justify-center"><span className="text-[#8fb8ff]">🎀</span><span className="text-xs font-black">Assignment & Deadline Tracker</span><span className="text-[#8fb8ff]">🎀</span></div>
                      <div className="mt-3 overflow-hidden rounded-xl border border-[#e6eaf7]">
                        <div className="grid grid-cols-[1.5fr_1fr_80px_50px] bg-[#f0f4ff] text-[11px] font-black px-3 py-2"><span>Assignment</span><span>Subject</span><span>Due Date</span><span>Done</span></div>
                        {assignments.map((a, i) => (
                          <div key={i} className="grid grid-cols-[1.5fr_1fr_80px_50px] gap-2 px-3 py-2 border-t border-[#e6eaf7] items-center">
                            <input value={a.assignment} onChange={(e) => setAssignments((prev) => prev.map((x, idx) => (idx === i ? { ...x, assignment: e.target.value } : x)))} className="rounded-lg border border-[#e6eaf7] px-2 py-1 text-xs outline-none" />
                            <input value={a.subject} onChange={(e) => setAssignments((prev) => prev.map((x, idx) => (idx === i ? { ...x, subject: e.target.value } : x)))} className="rounded-lg border border-[#e6eaf7] px-2 py-1 text-xs outline-none" />
                            <input value={a.due} onChange={(e) => setAssignments((prev) => prev.map((x, idx) => (idx === i ? { ...x, due: e.target.value } : x)))} className="rounded-lg border border-[#e6eaf7] px-2 py-1 text-xs outline-none text-center" />
                            <button onClick={() => setAssignments((prev) => prev.map((x, idx) => (idx === i ? { ...x, done: !x.done } : x)))} className={`h-6 w-6 grid place-items-center rounded-full border text-xs ${a.done ? "bg-[#8fb8ff] text-white border-[#8fb8ff]" : "border-[#e6eaf7] text-slate-300"}`}>♡</button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setAssignments([...assignments, { assignment: "", subject: "", due: "", done: false }])} className="mt-2 w-full rounded-full border border-dashed border-[#dbe6ff] py-1.5 text-xs font-bold text-[#8fb8ff]">+ Add assignment</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                        <div className="text-xs font-black flex items-center gap-2">📚 Resource Shelf</div>
                        <div className="mt-3 space-y-1.5 text-xs">
                          {[
                            { label: "Books", icon: "📚" },
                            { label: "Videos", icon: "🎬" },
                            { label: "Websites", icon: "🌐" },
                            { label: "Apps", icon: "📱" },
                          ].map((r) => (
                            <label key={r.label} className="flex gap-2 items-center"><span>{r.icon}</span><span className="font-bold w-16">{r.label}</span><input placeholder="..." className="flex-1 rounded border border-[#e6eaf7] bg-[#f8f9ff] px-2 py-1 outline-none" /></label>
                          ))}
                        </div>
                      </div>
                      <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                        <div className="text-xs font-black flex items-center gap-2 justify-center">⭐ Focus Booster</div>
                        <div className="mt-3 space-y-1.5 text-xs">
                          {["Silence notifications", "Clean my desk", "Study before scrolling", "Finish one chapter daily", "Take short breaks"].map((f) => (
                            <label key={f} className="flex gap-2 items-center cursor-pointer"><input type="checkbox" className="accent-[#8fb8ff]" /> {f}</label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="flex items-center justify-center gap-2"><span className="text-[#8fb8ff]">🎀</span><span className="text-xs font-black">Celebrate</span><span className="text-slate-400 text-[10px]">I&apos;ll celebrate by...</span></div>
                      <div className="mt-3 grid grid-cols-6 gap-2 text-center">
                        {[
                          { e: "🍦", l: "Ice cream" },
                          { e: "🎬", l: "Movie" },
                          { e: "🎮", l: "Gaming" },
                          { e: "🛍️", l: "Shopping" },
                          { e: "📖", l: "Reading" },
                          { e: "😴", l: "Sleep" },
                        ].map((c) => (
                          <label key={c.l} className="cursor-pointer">
                            <div className="h-10 grid place-items-center rounded-xl bg-[#f8f9ff] border border-[#e6eaf7] text-lg">{c.e}</div>
                            <div className="text-[10px] font-bold mt-1">{c.l}</div>
                            <input type="checkbox" className="accent-[#8fb8ff]" />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="text-xs font-black flex items-center gap-2 justify-center"><span className="text-[#8fb8ff]">🎀</span> Brain Dump / Notes</div>
                      <textarea value={brainDump} onChange={(e) => setBrainDump(e.target.value)} rows={4} className="mt-3 w-full rounded-xl border border-[#e6eaf7] bg-[#fbfdff] p-3 text-xs outline-none resize-none" placeholder="Anything on your mind..." />
                    </div>
                  </div>

                  <div className="lg:col-span-3 space-y-4">
                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="flex items-center gap-2 justify-center"><span>📖</span><span className="text-xs font-black">Knowledge Quest</span></div>
                      <div className="mt-3 overflow-hidden rounded-xl border border-[#e6eaf7]">
                        <div className="grid grid-cols-[1fr_1fr_70px] bg-[#f0f4ff] text-[11px] font-black px-2 py-1.5"><span>Subject</span><span>Topic</span><span>Confidence</span></div>
                        {knowledgeQuest.map((k, i) => (
                          <div key={i} className="grid grid-cols-[1fr_1fr_70px] gap-1 px-2 py-1.5 border-t border-[#e6eaf7] items-center">
                            <input value={k.subject} onChange={(e) => setKnowledgeQuest((prev) => prev.map((x, idx) => (idx === i ? { ...x, subject: e.target.value } : x)))} className="rounded border border-[#e6eaf7] px-1 py-1 text-xs outline-none" />
                            <input value={k.topic} onChange={(e) => setKnowledgeQuest((prev) => prev.map((x, idx) => (idx === i ? { ...x, topic: e.target.value } : x)))} className="rounded border border-[#e6eaf7] px-1 py-1 text-xs outline-none" />
                            <div className="flex gap-0.5 justify-center">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button key={n} onClick={() => setKnowledgeQuest((prev) => prev.map((x, idx) => (idx === i ? { ...x, confidence: n } : x)))} className={`text-[10px] ${n <= k.confidence ? "text-[#8fb8ff]" : "text-slate-200"}`}>★</button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="text-xs font-black flex items-center gap-2 justify-center">☁️ Tiny Wins <span className="text-slate-400 text-[10px]">Today I learned...</span></div>
                      <div className="mt-3 space-y-1.5">
                        {tinyWins.map((w, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <span className="text-[#8fb8ff] text-xs">♡</span>
                            <input value={w} onChange={(e) => setTinyWins((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))} className="flex-1 rounded-full border border-[#e6eaf7] bg-[#f8f9ff] px-3 py-1.5 text-xs outline-none" />
                          </div>
                        ))}
                        <button onClick={() => setTinyWins([...tinyWins, ""])} className="w-full rounded-full border border-dashed border-[#dbe6ff] py-1 text-xs font-bold text-[#8fb8ff]">+ Win</button>
                      </div>
                    </div>

                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                      <div className="text-xs font-black flex items-center gap-2 justify-center"><span className="text-[#8fb8ff]">🎀</span> Bright Ideas</div>
                      <textarea value={brightIdeas} onChange={(e) => setBrightIdeas(e.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-[#e6eaf7] bg-[#fbfdff] p-2 text-xs outline-none resize-none" placeholder="Sparkles..." />
                    </div>

                    <div className="rounded-2xl bg-[#e6eeff] border border-[#dbe6ff] p-3 flex gap-3 items-center">
                      <div className="text-3xl">🎒</div>
                      <div className="text-xs leading-relaxed font-medium">
                        Don&apos;t forget to review your week every Sunday!
                        <div className="text-[11px] text-[#6a7bd9] font-bold">Embrace the journey 🐰</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#dbe6ff]"} rounded-2xl border p-4`}>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-[#e6eaf7] p-3 bg-[#f8f9ff]">
                      <div className={`text-xs font-black tracking-widest ${cherry ? "bg-black text-white" : "bg-[#8fb8ff] text-white"} rounded-full px-3 py-1 inline-block`}>WEEKLY GOALS</div>
                      <div className="mt-3 space-y-2">
                        {weeklyGoals.map((g, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <span className="h-5 w-5 grid place-items-center rounded-full bg-black text-white text-[10px] font-black">{i + 1}</span>
                            <input value={g} onChange={(e) => setWeeklyGoals((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))} className="flex-1 border-b border-dotted border-zinc-300 bg-transparent text-xs outline-none" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#e6eaf7] p-3">
                      <div className="text-xs font-black">HABIT TRACKER</div>
                      <div className="mt-2 grid grid-cols-[1fr_repeat(7,20px)] gap-1 text-[10px] font-bold">
                        <span>HABIT</span>
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                          <span key={idx} className="text-center">
                            {d}
                          </span>
                        ))}
                        {habits.map((h, idx) => (
                          <div key={idx} className="contents">
                            <span key={h.name} className="text-[11px] mt-1">
                              {h.name}
                            </span>
                            {h.days.map((done, idx) => (
                              <span key={idx} className={`h-4 w-4 rounded-full border grid place-items-center text-[10px] mt-1 ${done ? "bg-black text-white border-black" : "border-zinc-300"}`}>{done ? "●" : "○"}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#e6eaf7] p-3 bg-[#fff8f0]">
                      <div className={`text-xs font-black tracking-widest ${cherry ? "bg-black text-white" : "bg-[#ff8fb1] text-white"} rounded-full px-3 py-1 inline-block`}>WEEKLY REVIEW</div>
                      <div className="mt-3 space-y-2 text-xs">
                        {["What went well this week?", "What challenges did I face?", "What did I learn?", "What will I focus on next week?"].map((q) => (
                          <div key={q} className="flex gap-2 items-start">
                            <span className="h-5 w-5 grid place-items-center rounded-full bg-black text-white text-xs shrink-0">★</span>
                            <div className="flex-1"><div className="font-bold">{q}</div><input placeholder="..." className="w-full border-b border-dotted border-zinc-300 bg-transparent outline-none" /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === "study" && (
              <div className="space-y-5">
                <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-xs">
                      <thead>
                        <tr className="text-white font-black">
                          <th className="bg-[#ffb6c1] px-3 py-3 rounded-tl-xl">DAY</th>
                          <th className="bg-[#ffe0a3] text-slate-700 px-3 py-3">SUBJECT</th>
                          <th className="bg-[#c5f0c8] text-slate-700 px-3 py-3">TOPICS TO COVER</th>
                          <th className="bg-[#b8e6ff] text-slate-700 px-3 py-3">STUDY TIME 🕒</th>
                          <th className="bg-[#d9c2ff] text-slate-700 px-3 py-3">REVISION</th>
                          <th className="bg-[#ffd6e7] text-slate-700 px-3 py-3 rounded-tr-xl">PRIORITY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studyTable.map((row, i) => (
                          <tr key={i} className={`${i % 2 === 0 ? "bg-[#fff8fb]" : "bg-white"} border-t border-[#ffe6ef]`}>
                            <td className={`px-3 py-2 font-black text-center ${row.day === "SATURDAY" ? "bg-[#e6f4ff]" : row.day === "SUNDAY" ? "bg-[#fff8dc]" : "bg-[#ffeef2]"}`}>
                              {row.day} {i === 0 || i === 2 || i === 4 ? "⭐" : i === 1 || i === 3 ? "💗" : i === 5 ? "💗" : "👑"}
                            </td>
                            <td className="px-2 py-2"><input value={row.subject} onChange={(e) => setStudyTable((prev) => prev.map((x, idx) => (idx === i ? { ...x, subject: e.target.value } : x)))} className="w-full rounded border border-[#ffe6ef] px-2 py-1 outline-none" /></td>
                            <td className="px-2 py-2"><input value={row.topics} onChange={(e) => setStudyTable((prev) => prev.map((x, idx) => (idx === i ? { ...x, topics: e.target.value } : x)))} className="w-full rounded border border-[#ffe6ef] px-2 py-1 outline-none" /></td>
                            <td className="px-2 py-2"><input value={row.time} onChange={(e) => setStudyTable((prev) => prev.map((x, idx) => (idx === i ? { ...x, time: e.target.value } : x)))} className="w-full rounded border border-[#ffe6ef] px-2 py-1 outline-none text-center" /></td>
                            <td className="px-2 py-2"><input value={row.revision} onChange={(e) => setStudyTable((prev) => prev.map((x, idx) => (idx === i ? { ...x, revision: e.target.value } : x)))} className="w-full rounded border border-[#ffe6ef] px-2 py-1 outline-none text-center" /></td>
                            <td className="px-2 py-2 text-center">
                              <div className="flex justify-center gap-0.5">
                                {[1, 2, 3, 4].map((n) => (
                                  <button key={n} onClick={() => setStudyTable((prev) => prev.map((x, idx) => (idx === i ? { ...x, priority: n } : x)))} className={`${n <= row.priority ? "text-[#ffd700]" : "text-slate-200"} text-sm`}>★</button>
                                ))}
                              </div>
                              <div className="text-[9px] font-bold text-slate-500">{row.priority === 4 ? "(Full Revision)" : row.priority === 3 ? "High" : row.priority === 2 ? "Med" : "Low"}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-2 bg-[#fff1f5] text-[10px] font-bold text-center text-slate-600">⭐⭐⭐ = High Priority &nbsp; ⭐⭐ = Medium Priority &nbsp; ⭐ = Low Priority</div>
                </div>

                <div className="grid lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-7">
                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6eaf7]"} rounded-2xl border overflow-hidden`}>
                      <div className="bg-[#ffb6c1] px-4 py-2 text-center text-sm font-black text-white" style={{ fontFamily: "Baloo 2, cursive" }}>DAILY STUDY SCHEDULE ⏰</div>
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-[90px_1fr_70px_1fr] bg-[#f0f0ff] text-[11px] font-black px-3 py-2">
                          <span>TIME SLOT</span><span>TASK</span><span>STATUS</span><span>NOTES</span>
                        </div>
                        {studySchedule.map((s, i) => (
                          <div key={i} className="grid grid-cols-[90px_1fr_70px_1fr] gap-2 px-3 py-2 border-t border-[#ffe6ef] items-center bg-white">
                            <span className="text-xs font-bold flex gap-1 items-center">🕒 {s.slot}</span>
                            <input value={s.task} onChange={(e) => setStudySchedule((prev) => prev.map((x, idx) => (idx === i ? { ...x, task: e.target.value } : x)))} className="rounded border border-[#ffe6ef] px-2 py-1 text-xs outline-none" />
                            <label className="flex justify-center"><input type="checkbox" checked={s.status} onChange={(e) => setStudySchedule((prev) => prev.map((x, idx) => (idx === i ? { ...x, status: e.target.checked } : x)))} className="h-4 w-4 accent-[#ff8fb1]" /></label>
                            <input value={s.notes} onChange={(e) => setStudySchedule((prev) => prev.map((x, idx) => (idx === i ? { ...x, notes: e.target.value } : x)))} className="rounded border border-[#ffe6ef] px-2 py-1 text-xs outline-none" />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setStudySchedule([...studySchedule, { slot: "", task: "", status: false, notes: "" }])} className="w-full py-2 text-xs font-bold text-[#ff8fb1] border-t border-dashed">+ Add slot</button>
                    </div>
                    <div className="mt-4 rounded-2xl bg-[#e8d9ff] border-2 border-[#c9b6ff] p-4 flex gap-4 items-center relative">
                      <div className="absolute -top-3 left-6 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full">Note to Self ♡</div>
                      <div className="flex-1">
                        <textarea value={noteToSelf} onChange={(e) => setNoteToSelf(e.target.value)} rows={2} className="w-full resize-none bg-white rounded-xl p-3 text-sm outline-none font-medium" />
                      </div>
                      <div className="text-2xl">💗</div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-2xl bg-[#ffd6e7] border-2 border-[#ff8fb1] p-4 relative">
                      <div className="absolute -top-3 left-6 bg-[#b8e6ff] text-slate-700 text-xs font-black px-3 py-1 rounded-full">Study Goals ☆</div>
                      <div className="mt-2 space-y-2">
                        {studyGoals.map((g, i) => (
                          <label key={i} className="flex gap-2 items-center bg-white rounded-xl px-3 py-2 border border-[#ffd6e7]">
                            <span className="h-4 w-4 rounded-full border-2 border-[#ff8fb1] grid place-items-center text-[8px]">○</span>
                            <input value={g} onChange={(e) => setStudyGoals((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))} className="flex-1 bg-transparent text-xs outline-none" />
                          </label>
                        ))}
                        <button onClick={() => setStudyGoals([...studyGoals, ""])} className="w-full rounded-full bg-white py-1.5 text-xs font-bold text-[#ff8fb1]">+ Add goal</button>
                      </div>
                      <div className="absolute -right-2 top-6 h-6 w-12 bg-[#c5f0c8] rotate-12 rounded-sm border border-[#a8d8b0]"></div>
                    </div>

                    <div className="rounded-2xl bg-[#fff6c5] border-2 border-[#ffe082] p-4 relative">
                      <div className="absolute -top-2 right-8 h-6 w-12 bg-[#ffb6c1] -rotate-6 rounded-sm"></div>
                      <div className="font-black text-sm">Reminders</div>
                      <ul className="mt-2 space-y-1 text-xs font-bold list-disc list-inside">
                        <li>Stay Focused</li>
                        <li>Take Breaks</li>
                        <li>Believe in Yourself</li>
                        <li>Don&apos;t Give Up!</li>
                      </ul>
                      <div className="absolute bottom-2 right-4 text-pink-400 text-xl">♡</div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1 rounded-xl bg-white border border-[#e6eaf7] p-3 text-center">
                        <div className="h-12 w-12 mx-auto grid place-items-center rounded-xl bg-[#ffd6e7] text-xl">☕</div>
                        <div className="text-xs font-black mt-1">You Can do it!</div>
                      </div>
                      <div className="flex-1 rounded-xl bg-[#c5f0c8] border border-[#a8d8b0] p-3 flex items-center gap-2">
                        <span className="text-2xl">✏️</span><span className="text-xs font-bold">Keep Going :)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === "monthly" && (
              <div className="space-y-4">
                <div className="grid lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-8">
                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border overflow-hidden`}>
                      <div className="grid grid-cols-7 text-center text-xs font-black text-white">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => (
                          <div key={d} className={`${["bg-[#ffb6c1]", "bg-[#ffd8a8]", "bg-[#ffe6a3]", "bg-[#c5f0c8]", "bg-[#b8e6ff]", "bg-[#d9c2ff]", "bg-[#ffb6e6]"][i]} py-2`}>{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-px bg-[#e6d9ff] p-px">
                        {Array.from({ length: 35 }).map((_, i) => {
                          const dayNum = i - 2;
                          const show = dayNum >= 1 && dayNum <= 31;
                          return (
                            <div key={i} className="bg-white min-h-[72px] p-1 relative">
                              {show && (
                                <>
                                  <div className="h-4 w-4 grid place-items-center rounded-full bg-[#f3e8ff] text-[10px] font-bold text-[#a88de8]">{dayNum}</div>
                                  <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#e9d5ff]"></div>
                                  <textarea placeholder="" rows={2} className="mt-1 w-full resize-none bg-transparent text-[10px] outline-none leading-tight" defaultValue={i === 10 ? "Exam" : i === 18 ? "Trip" : ""} />
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-3 flex gap-2 items-center bg-[#faf8ff] border-t border-[#e6d9ff]">
                        <span className="text-[#a88de8]">✏️</span>
                        <span className="text-xs font-black tracking-widest text-[#a88de8]">IMPORTANT DATES:</span>
                        <input value={importantDates} onChange={(e) => setImportantDates(e.target.value)} className="flex-1 bg-transparent text-xs outline-none border-b border-dashed border-[#e6d9ff]" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-4">
                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border overflow-hidden`}>
                      <div className="bg-[#d9c2ff] text-white text-center py-2 text-xs font-black tracking-widest">TOP 5 GOALS</div>
                      <div className="p-3 space-y-2">
                        {monthlyGoals.map((g, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <span className="text-sm">{["🪐", "🟠", "🟢", "🔵", "💜"][i]}</span>
                            <input value={g} onChange={(e) => setMonthlyGoals((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))} className="flex-1 border-b border-dotted border-[#e6d9ff] text-xs outline-none py-1" />
                            <span className="text-[#ffb6c1] text-xs">♡</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border overflow-hidden`}>
                      <div className="bg-[#d9c2ff] text-white text-center py-2 text-xs font-black flex items-center justify-center gap-2">HABIT TRACKER ⭐</div>
                      <div className="p-3">
                        <div className="grid grid-cols-[1fr_repeat(5,24px)] gap-1 text-[10px] font-black text-center">
                          <span></span>
                          {["M", "T", "W", "T", "S"].map((d, idx) => (
                            <span key={idx} className="bg-[#f3e8ff] rounded py-1">
                              {d}
                            </span>
                          ))}
                          {[
                            { name: "Drink Water", icon: "💧" },
                            { name: "Exercise", icon: "🏋️" },
                            { name: "Read", icon: "📖" },
                            { name: "Meditate", icon: "🪷" },
                            { name: "Sleep Early", icon: "🌙" },
                            { name: "Creative Time", icon: "🎨" },
                          ].map((h, idx) => (
                            <div key={idx} className="contents">
                              <span key={h.name} className="text-xs flex gap-1 items-center py-1">
                                {h.icon} {h.name}
                              </span>
                              {[0, 1, 2, 3, 4].map((n) => (
                                <span key={n} className="h-5 w-5 mx-auto rounded-full border border-[#e6d9ff] grid place-items-center text-[10px]">○</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border p-4`}>
                    <div className="bg-[#d9c2ff] text-white text-center rounded-full py-1 text-xs font-black">WEEKLY FOCUS ♡</div>
                    <div className="mt-3 space-y-2">
                      {weeklyFocus.map((w, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${["bg-[#ffb6c1]", "bg-[#ffd8a8]", "bg-[#ffe6a3]", "bg-[#c5f0c8]"][i]}`}>{["MON", "TUE", "WED", "THU"][i] || "FRI"}</span>
                          <input value={w} onChange={(e) => setWeeklyFocus((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))} className="flex-1 border-b border-dotted text-xs outline-none" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border p-4`}>
                    <div className="bg-[#d9c2ff] text-white text-center rounded-full py-1 text-xs font-black">SELF-CARE PLAN ♡</div>
                    <div className="mt-3 space-y-2 text-xs">
                      {selfCareList.map((s, i) => (
                        <label key={i} className="flex gap-2 items-center">
                          <span className="text-sm">{["☕", "🧘", "🥣", "🕯️", "💗"][i]}</span>
                          <span className="font-bold w-20">{s.split(" ")[0]}</span>
                          <input value={s} onChange={(e) => setSelfCareList((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))} className="flex-1 border-b border-dotted outline-none" />
                        </label>
                      ))}
                      <label className="flex gap-2 items-center"><span>💗</span><span className="font-bold">Be Kind To Myself</span></label>
                    </div>
                  </div>

                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border p-4 relative overflow-hidden`}>
                    <div className="bg-[#d9c2ff] text-white text-center rounded-full py-1 text-xs font-black">TO DO LIST ⭐</div>
                    <div className="mt-3 space-y-1.5">
                      {monthlyTodos.map((t, i) => (
                        <label key={i} className="flex gap-2 items-center text-xs">
                          <input type="checkbox" checked={t.done} onChange={(e) => setMonthlyTodos((prev) => prev.map((x, idx) => (idx === i ? { ...x, done: e.target.checked } : x)))} className="accent-[#a88de8]" />
                          <input value={t.text} onChange={(e) => setMonthlyTodos((prev) => prev.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x)))} className={`flex-1 bg-transparent outline-none border-b border-dotted ${t.done ? "line-through text-slate-400" : ""}`} />
                        </label>
                      ))}
                      <button onClick={() => setMonthlyTodos([...monthlyTodos, { text: "", done: false }])} className="w-full rounded-full border border-dashed border-[#e6d9ff] py-1 text-xs font-bold text-[#a88de8]">+ Add</button>
                    </div>
                    <div className="absolute right-2 bottom-2 text-4xl hidden sm:block">🐱</div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border p-4`}>
                    <div className="bg-[#b8d8ff] text-white text-center rounded-full py-1 text-xs font-black">NOTES</div>
                    <textarea value={monthlyNotes} onChange={(e) => setMonthlyNotes(e.target.value)} rows={4} className="mt-3 w-full rounded-xl border border-[#e6d9ff] bg-[#faf8ff] p-3 text-xs outline-none resize-none" />
                  </div>
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border p-4`}>
                    <div className="bg-[#d9c2ff] text-white text-center rounded-full py-1 text-xs font-black">I&apos;M GRATEFUL FOR ♡</div>
                    <div className="mt-3 space-y-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex gap-2 items-center"><span className="text-[#ffd700]">★</span><input value={monthlyGrateful} onChange={(e) => setMonthlyGrateful(e.target.value)} className="flex-1 border-b border-dotted text-xs outline-none" /></div>
                      ))}
                    </div>
                  </div>
                  <div className={`${cherry ? "bg-white border-black" : "bg-white border-[#e6d9ff]"} rounded-2xl border p-4`}>
                    <div className="bg-[#d9c2ff] text-white text-center rounded-full py-1 text-xs font-black">MOOD TRACKER ⭐</div>
                    <div className="mt-3 flex justify-between text-center">
                      {[
                        { e: "🤩", l: "AMAZING", c: "bg-[#b8f0b8]" },
                        { e: "🙂", l: "GOOD", c: "bg-[#ffe6a3]" },
                        { e: "😐", l: "OKAY", c: "bg-[#ffd8a8]" },
                        { e: "😟", l: "BAD", c: "bg-[#ffb6c1]" },
                        { e: "😭", l: "AWFUL", c: "bg-[#d9c2ff]" },
                      ].map((m) => (
                        <div key={m.l} className="text-center">
                          <div className={`h-8 w-8 grid place-items-center rounded-full ${m.c} text-sm mx-auto`}>{m.e}</div>
                          <div className="text-[9px] font-black mt-1">{m.l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl border border-[#e6d9ff] p-2">
                      <div className="text-xs font-bold">Highlights of the month:</div>
                      <textarea rows={2} className="w-full resize-none bg-transparent text-xs outline-none" placeholder="..." />
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs font-bold text-[#a88de8]">♡ Embrace the journey, trust the process. ♡</div>
              </div>
            )}

            {view === "period" && (
              <div className="space-y-4">
                <div className="grid lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4">
                      <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">PERIOD CALENDAR 🌸</div>
                      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-black text-[#ff8fb1]">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                          <div key={d} className="py-1">
                            {d}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: 35 }).map((_, i) => {
                          const day = i - 3;
                          const show = day >= 1 && day <= 31;
                          const isPeriod = [5, 6, 7, 8, 9].includes(day);
                          const isFertile = [14, 15, 16].includes(day);
                          const isOvulation = day === 14;
                          return (
                            <div key={i} className={`h-[56px] rounded-xl border flex flex-col p-1 relative ${isPeriod ? "bg-[#ffe6ef] border-[#ffb6c1]" : isOvulation ? "bg-[#e9d5ff] border-[#c9b6ff]" : isFertile ? "bg-[#e6f4ea] border-[#c5d6b8]" : "bg-white border-[#ffe6ef]"} ${show ? "" : "opacity-20"}`}>
                              {show && (
                                <>
                                  <span className="text-[11px] font-bold">{day}</span>
                                  {isPeriod && <span className="h-2 w-2 rounded-full bg-[#ff4d6d] mx-auto mt-1"></span>}
                                  {isFertile && !isPeriod && <span className="h-2 w-2 rounded-full bg-[#7ac74f] mx-auto mt-1"></span>}
                                  {isOvulation && <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-[#a88de8]"></span>}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-bold">
                        <span className="flex gap-1 items-center"><span className="h-3 w-3 rounded-full bg-[#ff4d6d]"></span> Period Days</span>
                        <span className="flex gap-1 items-center"><span className="h-3 w-3 rounded-full bg-[#ffb6c1]"></span> Light Flow</span>
                        <span className="flex gap-1 items-center"><span className="h-3 w-3 rounded-full bg-[#ffd6a3]"></span> Expected Period</span>
                        <span className="flex gap-1 items-center"><span className="h-3 w-3 rounded-full bg-[#b8f0b8]"></span> Fertile Window</span>
                        <span className="flex gap-1 items-center"><span className="h-3 w-3 rounded-full bg-[#d9c2ff]"></span> Ovulation Day</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4">
                      <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">FLOW TRACKER 🌸</div>
                      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                        {[
                          { l: "Heavy", c: "text-[#c1121f]", e: "🩸" },
                          { l: "Medium", c: "text-[#e76f51]", e: "💧" },
                          { l: "Light", c: "text-[#f4a2a2]", e: "💧" },
                          { l: "Spotting", c: "text-[#e6e6e6]", e: "💧" },
                        ].map((f) => (
                          <button key={f.l} onClick={() => setFlowType(f.l)} className={`rounded-xl border-2 p-3 ${flowType === f.l ? "border-[#ff8fb1] bg-[#fff1f5]" : "border-[#ffe6ef] bg-[#fff8fb]"}`}>
                            <div className={`text-2xl ${f.c}`}>●</div>
                            <div className="text-xs font-bold mt-1">{f.l}</div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-bold">NOTES:</div>
                        <input placeholder="..." className="w-full border-b border-dotted border-[#ffd6e7] text-xs outline-none py-1" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4">
                      <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">SYMPTOMS 🌸</div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        {[
                          "Cramps",
                          "Fatigue",
                          "Bloating",
                          "Acne",
                          "Headache",
                          "Nausea",
                          "Back Pain",
                          "Mood Swings",
                        ].map((s) => (
                          <label key={s} className="flex gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={symptoms.includes(s)} onChange={() => toggleSymptom(s)} className="accent-[#ff8fb1]" />
                            <span className="flex gap-1 items-center">{s}</span>
                          </label>
                        ))}
                        <label className="flex gap-1 items-center col-span-2">
                          <input type="checkbox" className="accent-[#ff8fb1]" />
                          Other: <input placeholder="..." className="flex-1 border-b border-dotted outline-none" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4">
                    <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">PAIN TRACKER 🩹</div>
                    <div className="text-center text-xs mt-2">Rate your pain (0 - 10)</div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold"><span>0</span><span>10</span></div>
                    <div className="flex gap-1 justify-center mt-1">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <button key={n} onClick={() => setPainLevel(n)} className={`h-6 w-6 grid place-items-center rounded-full text-xs ${n <= painLevel ? "bg-[#ff8fb1] text-white" : "bg-[#fff1f5] border border-[#ffd6e7] text-[#ff8fb1]"}`}>♡</button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs font-bold">Notes:</div>
                    <input placeholder="..." className="w-full border-b border-dotted border-[#ffd6e7] text-xs outline-none py-1" />
                  </div>

                  <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4">
                    <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">MOOD TRACKER</div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                      {[
                        { e: "😊", l: "Happy" },
                        { e: "😌", l: "Calm" },
                        { e: "😐", l: "Neutral" },
                        { e: "😢", l: "Sad" },
                        { e: "😰", l: "Anxious" },
                        { e: "😠", l: "Irritable" },
                      ].map((m) => (
                        <button key={m.l} onClick={() => setPeriodMood(m.l)} className={`rounded-xl p-2 border ${periodMood === m.l ? "border-[#ff8fb1] bg-[#fff1f5]" : "border-transparent bg-[#fff8fb]"}`}>
                          <div className="text-xl">{m.e}</div>
                          <div className="text-[10px] font-bold">{m.l}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs font-bold">Notes: <input className="w-[70%] border-b border-dotted outline-none ml-1" placeholder="..." /></div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4 relative overflow-hidden">
                    <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">SELF-CARE PLAN 🌸</div>
                    <div className="mt-3 space-y-1.5 text-xs">
                      {["Drink Water", "Eat Healthy", "Light Exercise", "Rest & Sleep", "Pamper Yourself", "Take Supplements"].map((s) => (
                        <label key={s} className="flex gap-2 items-center cursor-pointer">
                          <input type="checkbox" checked={selfCarePeriod.includes(s)} onChange={() => toggleSC(s)} className="accent-[#ff8fb1]" />
                          {s}
                        </label>
                      ))}
                      <label className="flex gap-2 items-center">Other: <input className="flex-1 border-b border-dotted outline-none" placeholder="..." /></label>
                    </div>
                    <div className="absolute right-2 bottom-2 text-2xl">☕</div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4">
                    <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">PERIOD DETAILS</div>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex gap-2"><span className="font-bold w-24">Start Date :</span><input value={periodDetails.start} onChange={(e) => setPeriodDetails({ ...periodDetails, start: e.target.value })} className="flex-1 border-b border-dotted outline-none" /></div>
                      <div className="flex gap-2"><span className="font-bold w-24">End Date :</span><input value={periodDetails.end} onChange={(e) => setPeriodDetails({ ...periodDetails, end: e.target.value })} className="flex-1 border-b border-dotted outline-none" /></div>
                      <div className="flex gap-2"><span className="font-bold w-24">Cycle Length :</span><input value={periodDetails.cycle} onChange={(e) => setPeriodDetails({ ...periodDetails, cycle: e.target.value })} className="flex-1 border-b border-dotted outline-none w-12" /> days</div>
                      <div className="flex gap-2 items-center"><span className="font-bold">Flow Type :</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((n) => (
                            <span key={n} className={`h-4 w-4 rounded-full ${periodDetails.flow === "Heavy" ? "bg-[#c1121f]" : periodDetails.flow === "Medium" ? "bg-[#e76f51]" : "bg-[#ffb6c1]"} opacity-${n * 25} grid place-items-center text-[8px] text-white`}>●</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2"><span className="font-bold">Notes :</span><input value={periodDetails.notes} onChange={(e) => setPeriodDetails({ ...periodDetails, notes: e.target.value })} className="flex-1 border-b border-dotted outline-none" /></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4 relative">
                    <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">REMINDERS 🌸</div>
                    <div className="mt-3 space-y-2 text-xs">
                      {["Next Period Due:", "Doctor Appointment:", "Pain Relief / Medicine:", "Supplements:", "Other:"].map((r) => (
                        <label key={r} className="flex gap-2 items-center"><input type="checkbox" className="accent-[#ff8fb1]" /><span className="font-bold w-36">{r}</span><input className="flex-1 border-b border-dotted outline-none" /></label>
                      ))}
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-pink-300 text-2xl">🎀</div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#ffd6e7] p-4">
                    <div className="bg-[#ffd6e7] text-[#7a4a5a] text-center rounded-full py-1.5 text-xs font-black">WATER TRACKER 🌸</div>
                    <div className="text-center text-xs mt-1">8 glasses a day keeps the pain away!</div>
                    <div className="mt-3 grid grid-cols-5 gap-2 justify-items-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, 8).map((n) => (
                        <button key={n} onClick={() => setWaterGlasses(n)} className={`h-10 w-8 rounded-b-xl border-2 ${n <= waterGlasses ? "bg-[#b8e6ff] border-[#8fb8ff]" : "bg-white border-[#e6eaf7]"} grid place-items-center text-xs`}>🥛</button>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl bg-[#fff1f5] border border-[#ffd6e7] p-2 text-center text-xs font-bold text-[#7a4a5a]">♡ You are strong, beautiful and your body is amazing. ♡</div>
                  </div>
                </div>

                <div className="text-center text-xs font-bold text-[#7a4a5a] py-2 border-t border-[#ffd6e7]">♡ Be kind to your body, it&apos;s doing its best. ♡</div>
              </div>
            )}
          </main>
        </>
      )}

      <footer className={`${cherry ? "bg-black text-white" : "bg-white border-t border-[#e6eaf7]"} mt-8 py-6 text-center`}>
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold tracking-widest">
            <span className={cherry ? "text-zinc-400" : "text-slate-500"}>© 2026 PLANNE STUDIO</span>
            <span className={cherry ? "text-zinc-400" : "text-slate-500"}>@StarGirl ♡ — Soft Life Studio</span>
            <span className={cherry ? "text-zinc-400" : "text-slate-500"}>designed by @the.cozy.curator</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Made with ♡ for focused, cozy planning. All templates interactive — edit, save & print. Local-first • Offline-ready</div>
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={() => { setHelpTab("use"); setShowHelp(true); }} className="rounded-full border border-[#e6eaf7] bg-[#f0f4ff] px-4 py-1.5 text-xs font-bold text-[#6a8de8]">How to use Plannie →</button>
            <button onClick={() => { setHelpTab("install"); setShowHelp(true); }} className="rounded-full border border-[#ffd6e7] bg-[#fff1f5] px-4 py-1.5 text-xs font-bold text-[#ff8fb1]">Install as App →</button>
          </div>
        </div>
      </footer>

      {/* New planner modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNewModal(null)} />
          <div className="relative w-full max-w-[520px] rounded-[24px] bg-white shadow-2xl border border-[#e6eaf7] p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-[#8fb8ff] text-white text-xl">{TEMPLATE_META[showNewModal].icon}</div>
              <div>
                <div className="font-black text-lg" style={{ fontFamily: "Baloo 2, cursive" }}>New {TEMPLATE_META[showNewModal].label} planner</div>
                <div className="text-xs text-slate-500">From template • Creates a fresh copy you can edit separately</div>
              </div>
              <button onClick={() => setShowNewModal(null)} className="ml-auto h-8 w-8 grid place-items-center rounded-full bg-slate-100">✕</button>
            </div>
            <div className="mt-4 rounded-2xl border border-[#dbe6ff] bg-[#f0f4ff] p-4 flex gap-3 items-center">
              <div className="h-16 w-16 grid place-items-center rounded-xl bg-white border border-[#dbe6ff] text-2xl">{TEMPLATE_META[showNewModal].icon}</div>
              <div className="text-xs leading-relaxed text-slate-600">
                You’re creating a <span className="font-black">{TEMPLATE_META[showNewModal].label}</span> planner. It will appear in your library and you can make as many as you want — e.g., <span className="font-bold">Weekly #1, Weekly #2</span>. Duplicate later to reuse layouts.
              </div>
            </div>
            <label className="mt-4 block text-xs font-black tracking-widest text-slate-600">PLANNER TITLE (you can rename anytime)</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={`${TEMPLATE_META[showNewModal].label} • ${new Date().toLocaleDateString()}`} className="mt-1 w-full rounded-xl border border-[#dbe6ff] bg-[#f8f9ff] px-4 py-3 text-sm font-bold outline-none" />
            <div className="mt-4 flex gap-2">
              <button onClick={() => { createPlanner(showNewModal, { title: newTitle || undefined }); setNewTitle(""); }} className="flex-1 rounded-full bg-[#8fb8ff] text-white py-3 text-sm font-black">Create planner →</button>
              <button onClick={() => setShowNewModal(null)} className="rounded-full border border-[#dbe6ff] px-6 py-3 text-sm font-bold">Cancel</button>
            </div>
            <div className="mt-3 text-center text-[11px] text-slate-500">Stored locally on this device + cloud • Works offline after Install</div>
          </div>
        </div>
      )}

      {/* Rename modal */}
      {showRename && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRename(null)} />
          <div className="relative w-full max-w-[440px] rounded-[24px] bg-white shadow-2xl border border-[#e6eaf7] p-6">
            <div className="font-black text-lg" style={{ fontFamily: "Baloo 2, cursive" }}>Rename planner</div>
            <input value={renameVal} onChange={(e) => setRenameVal(e.target.value)} className="mt-3 w-full rounded-xl border border-[#dbe6ff] bg-[#f8f9ff] px-4 py-3 text-sm font-bold outline-none" autoFocus />
            <div className="mt-4 flex gap-2">
              <button onClick={() => renamePlanner(showRename, renameVal || "Untitled")} className="flex-1 rounded-full bg-[#8fb8ff] text-white py-3 text-sm font-black">Save title</button>
              <button onClick={() => setShowRename(null)} className="rounded-full border border-[#dbe6ff] px-6 py-3 text-sm font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        {!isStandalone && deferredPrompt && (
          <button onClick={handleInstall} className="rounded-full bg-[#8fb8ff] text-white px-5 py-3 text-sm font-black shadow-xl flex items-center gap-2 animate-bounce">
            ⬇ Install App
          </button>
        )}
        <button
          onClick={() => { setHelpTab("use"); setShowHelp(true); }}
          className="h-12 w-12 grid place-items-center rounded-full bg-white border border-[#e6eaf7] shadow-xl text-xl"
          title="Help"
        >
          ?
        </button>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div className="relative w-full max-w-[760px] max-h-[90vh] overflow-auto rounded-[24px] bg-white shadow-2xl border border-[#e6eaf7]">
            <div className="sticky top-0 z-10 bg-white border-b border-[#e6eaf7] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 grid place-items-center rounded-xl bg-[#8fb8ff] text-white text-xl">🎀</div>
                <div>
                  <div className="font-black text-lg leading-none" style={{ fontFamily: "Baloo 2, cursive" }}>Plannie Help</div>
                  <div className="text-xs text-slate-500">Everything you need to plan cute & stay focused</div>
                </div>
              </div>
              <button onClick={() => setShowHelp(false)} className="h-9 w-9 grid place-items-center rounded-full bg-slate-100 text-slate-600 font-bold">✕</button>
            </div>

            <div className="p-2 flex gap-2 px-6 pt-4">
              <button onClick={() => setHelpTab("use")} className={`flex-1 rounded-full px-4 py-2.5 text-sm font-black border ${helpTab === "use" ? "bg-[#8fb8ff] text-white border-[#8fb8ff]" : "bg-white border-[#e6eaf7] text-slate-600"}`}>📖 How to Use</button>
              <button onClick={() => setHelpTab("install")} className={`flex-1 rounded-full px-4 py-2.5 text-sm font-black border ${helpTab === "install" ? "bg-[#ff8fb1] text-white border-[#ff8fb1]" : "bg-white border-[#e6eaf7] text-slate-600"}`}>📲 Install as App</button>
            </div>

            <div className="p-6 pt-4">
              {helpTab === "use" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-[#f0f4ff] border border-[#dbe6ff] p-4">
                    <div className="text-sm font-black">👋 Welcome to Plannie!</div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Plannie combines 5 aesthetic templates into one <span className="font-black">library</span>. Create unlimited planners — yes, <span className="font-black text-[#8fb8ff]">you can have Weekly #1 and Weekly #2 side-by-side</span>! Everything is saved <span className="font-black">locally on THIS device</span> and also to the cloud when you hit <span className="font-black text-[#8fb8ff]">Save</span>. Works offline!</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-white border border-[#dbe6ff] p-2"><div className="text-lg">💾</div><div className="text-xs font-bold">Saved locally</div><div className="text-[10px] text-slate-500">stays on phone</div></div>
                      <div className="rounded-xl bg-white border border-[#dbe6ff] p-2"><div className="text-lg">🗂️</div><div className="text-xs font-bold">Unlimited</div><div className="text-[10px] text-slate-500">duplicate any</div></div>
                      <div className="rounded-xl bg-white border border-[#dbe6ff] p-2"><div className="text-lg">📴</div><div className="text-xs font-bold">Offline</div><div className="text-[10px] text-slate-500">after install</div></div>
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-[#8fb8ff] bg-[#f0f4ff] p-4">
                    <div className="text-sm font-black">🗂️ How to create a second Weekly (or any template)</div>
                    <ol className="mt-2 space-y-2 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
                      <li>Go to <span className="font-bold">🗂️ My Planners</span> (top bar) OR stay in <span className="font-bold">Weekly</span> view</li>
                      <li>Tap <span className="rounded-full bg-[#8fb8ff] text-white px-2 py-0.5 text-xs font-black">＋ New Weekly</span> — a fresh Weekly planner is created from the template, separate from your first one</li>
                      <li>Or tap <span className="rounded-full border border-[#dbe6ff] bg-white px-2 py-0.5 text-xs font-bold">⧉ Duplicate</span> on any planner to clone it with all your current content — perfect for next week!</li>
                      <li>Switch between them with the dropdown at the top of the Weekly view, or from My Planners → Open</li>
                      <li>Rename anytime with <span className="font-bold">✎ Rename</span> — e.g., “Weekly • Aug 18-24”</li>
                    </ol>
                    <div className="mt-2 rounded-xl bg-white border border-[#dbe6ff] p-2 text-xs text-slate-600"><span className="font-black">Tip:</span> All your planners are listed in <span className="font-bold">My Planners</span> — think of it like Google Docs for cute planners.</div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: "🌿", title: "Daily", desc: "Mood, weather, sleep, water, schedule (7AM-8PM), todos, meals, money, gratitude & tomorrow. Tap the droplets, emojis & stars to log.", color: "bg-[#f2f6ed] border-[#c5d6b8]" },
                      { icon: "📅", title: "Weekly", desc: "Week of + Dream Goal + Inspiration on top. 7 day cards (Subject/Topic/Time) + assignments, knowledge quest & brain dump. Perfect for students.", color: "bg-[#f0f4ff] border-[#dbe6ff]" },
                      { icon: "✏️", title: "Study", desc: "Weekly table with priority ★, daily time slots 6AM-9PM with status ✓, plus Study Goals & Reminders. Great for exam prep.", color: "bg-[#fff8e1] border-[#ffe082]" },
                      { icon: "🌙", title: "Monthly", desc: "Glow & Grow calendar, Top 5 Goals, habit tracker (M-F), self-care plan + mood tracker. Zoom out for the big picture.", color: "bg-[#faf8ff] border-[#e6d9ff]" },
                      { icon: "🩷", title: "Cycle", desc: "Period calendar with legends, flow (Heavy/Medium/Light/Spotting), pain 0-10 ♡, mood, symptoms & water. Gentle & private — stored only for you.", color: "bg-[#fff1f5] border-[#ffd6e7]" },
                    ].map((c) => (
                      <div key={c.title} className={`rounded-2xl border p-4 ${c.color}`}>
                        <div className="flex gap-2 items-center"><span className="text-xl">{c.icon}</span><span className="font-black text-sm">{c.title}</span></div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[#e6eaf7] p-4">
                    <div className="text-sm font-black">⚡️ Quick tips</div>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600 list-disc list-inside">
                      <li><span className="font-bold">Edit anything:</span> just click any text field — hit Save to keep it.</li>
                      <li><span className="font-bold">Themes:</span> top bar Cloud/Cherry/Sage/Blush — cherry is high-contrast, pastel is the classic kawaii look.</li>
                      <li><span className="font-bold">Add rows:</span> look for <span className="rounded-full border border-dashed px-2 py-0.5 text-xs">+ Add</span> buttons in schedules, todos & assignments.</li>
                      <li><span className="font-bold">Print:</span> File → Print or tap Print — headers auto-hide, your filled planner prints beautifully.</li>
                      <li><span className="font-bold">Export:</span> In My Planners → ⬇ Export all (.json) to backup before clearing browser data.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-[#8fb8ff] text-white p-4 flex gap-3 items-center">
                    <div className="text-3xl">💡</div>
                    <div className="text-sm leading-relaxed"><span className="font-black">Pro tip:</span> Do a 5-min evening reset: Daily → fill Tomorrow + Gratitude, Weekly → check off Tiny Wins, Monthly → update Habit Tracker. Consistency &gt; perfection!</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-r from-[#8fb8ff] to-[#ff8fb1] p-[1.5px]">
                    <div className="rounded-[14px] bg-white p-4 flex gap-3 items-center">
                      <img src="/icon-192.png" alt="Plannie icon" className="h-14 w-14 rounded-2xl border border-[#e6eaf7] object-cover" />
                      <div className="flex-1">
                        <div className="font-black">Yes — have it locally on your phone!</div>
                        <div className="text-xs text-slate-500">No App Store. One tap. Works 100% offline. Your planners stay on THIS device (not on a server). After install it opens like any other app from your home screen.</div>
                      </div>
                      {deferredPrompt ? (
                        <button onClick={handleInstall} className="rounded-full bg-[#8fb8ff] text-white px-5 py-2.5 text-sm font-black">Install now</button>
                      ) : isStandalone ? (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-700">✓ Already installed</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">Follow steps below</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-sm font-black text-emerald-800">📱 You asked: “Is there no way to have it locally?” — There IS!</div>
                    <p className="text-sm text-emerald-700 mt-1 leading-relaxed">Plannie is a <span className="font-black">PWA (Progressive Web App)</span>. Once you “Add to Home Screen”, it IS a local app: icon on home screen, splash screen, full-screen, <span className="font-black">works without internet</span>, data saved in your phone’s storage. Exactly like a native app — but you don’t need the App Store.</p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-white border border-emerald-200 p-2"><div className="text-lg">🏠</div><div className="font-bold">Home screen icon</div></div>
                      <div className="rounded-xl bg-white border border-emerald-200 p-2"><div className="text-lg">📴</div><div className="font-bold">Works offline</div></div>
                      <div className="rounded-xl bg-white border border-emerald-200 p-2"><div className="text-lg">🔒</div><div className="font-bold">Data on device</div></div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-[#e6eaf7] p-4 bg-[#f0f4ff]">
                      <div className="text-sm font-black">📱 iPhone / iPad</div>
                      <div className="text-[11px] font-bold tracking-widest text-[#8fb8ff] mt-1">SAFARI ONLY</div>
                      <ol className="mt-2 space-y-1.5 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                        <li>Open this site in <span className="font-bold">Safari</span></li>
                        <li>Tap <span className="inline-flex items-center gap-1 rounded bg-white border px-1.5 py-0.5 text-[11px] font-bold">⎙ Share</span> (bottom bar)</li>
                        <li>Scroll → tap <span className="font-bold">“Add to Home Screen”</span></li>
                        <li>Tap <span className="font-bold">Add</span> → Plannie appears with your other apps!</li>
                      </ol>
                      <div className="mt-2 rounded-xl bg-white border border-[#dbe6ff] p-2 text-[11px] text-slate-500">💡 Safari is required on iOS — Chrome won’t show the option.</div>
                    </div>

                    <div className="rounded-2xl border border-[#e6eaf7] p-4 bg-[#fff1f5]">
                      <div className="text-sm font-black">🤖 Android</div>
                      <div className="text-[11px] font-bold tracking-widest text-[#ff8fb1] mt-1">CHROME / EDGE</div>
                      <ol className="mt-2 space-y-1.5 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                        <li>Open in <span className="font-bold">Chrome</span></li>
                        <li>Tap <span className="font-bold">⋮</span> menu (top right)</li>
                        <li>Tap <span className="font-bold">“Install app”</span> or <span className="font-bold">“Add to Home screen”</span></li>
                        <li>Confirm → opens full-screen, offline-ready!</li>
                      </ol>
                      {deferredPrompt && <button onClick={handleInstall} className="mt-3 w-full rounded-full bg-[#ff8fb1] text-white py-2 text-xs font-black">Tap to Install</button>}
                    </div>

                    <div className="rounded-2xl border border-[#e6eaf7] p-4 bg-[#fffbeb]">
                      <div className="text-sm font-black">💻 Desktop</div>
                      <div className="text-[11px] font-bold tracking-widest text-[#d97706] mt-1">CHROME / EDGE / BRAVE</div>
                      <ol className="mt-2 space-y-1.5 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                        <li>Look for <span className="font-bold">⊕ Install</span> icon in the address bar (right side)</li>
                        <li>Or menu <span className="font-bold">⋮ → “Install Plannie”</span></li>
                        <li>Click <span className="font-bold">Install</span> → app opens in its own window</li>
                        <li>Pin to taskbar/dock for 1-click planning!</li>
                      </ol>
                      <div className="mt-2 rounded-xl bg-white border border-[#ffe082] p-2 text-[11px] text-slate-500">Also works: drag the URL to your desktop → shortcut.</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e6eaf7] p-4">
                    <div className="text-sm font-black">🔒 What happens after you install?</div>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <li className="flex gap-2"><span>✓</span> Opens full-screen, no browser bar — feels native</li>
                      <li className="flex gap-2"><span>✓</span> Works offline — service worker caches your planners</li>
                      <li className="flex gap-2"><span>✓</span> Your planners stay on device + also backup to cloud on Save</li>
                      <li className="flex gap-2"><span>✓</span> Uninstall like any app: long-press → Remove</li>
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => { navigator.clipboard?.writeText(window.location.href); setSaveMsg("Link copied! Share to your phone → open & install"); setTimeout(()=>setSaveMsg(""),2500); }} className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold">Copy link to share to phone</button>
                      <button onClick={() => setShowHelp(false)} className="rounded-full border border-[#e6eaf7] px-4 py-2 text-xs font-bold">Got it, thanks!</button>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-400">Having trouble? Make sure you’re on HTTPS (you are!) and not in incognito. Reload and try again.</div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <div className="rounded-xl bg-[#f8f9ff] border border-[#e6eaf7] p-3 text-xs text-slate-500 text-center">
                Made with ♡ — Plannie v2 • PWA • Offline-ready • All data local-first • <span className="font-bold">Tip:</span> bookmark <code className="bg-white border px-1 rounded">?view=weekly</code> for instant weekly entry
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@media print { header, footer { display: none } main { padding: 0 } }`}</style>
    </div>
  );
}
