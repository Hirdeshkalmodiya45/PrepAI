import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

import {
  Code2,
  Search,
  CheckCircle,
  Play,
  Check,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
  Brain,
  Clock,
  Star,
  Calendar,
  ListChecks,
  ChevronRight,
  Layers,
  GitCommit,
  RefreshCw,
  Gauge,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  CartesianGrid,
} from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { dsaProblems, DSAProblem } from "@/data/dummy-data"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// ==========================================================================
// Small utilities
// ==========================================================================

/** Animates a number from 0 -> target whenever target changes. */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let rafId: number
    let start: number | null = null
    const startVal = 0
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(startVal + eased * (target - startVal)))
      if (progress < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])
  return value
}

/** Deterministic pseudo-percentage for topics with no backing data yet. */
function mockPercentFromString(str: string, min = 30, max = 90) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return min + (hash % (max - min))
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#10b981", // emerald-500
  Medium: "#f59e0b", // amber-500
  Hard: "#f43f5e", // rose-500
}

const CANONICAL_TOPICS = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Queue",
  "Trees",
  "BST",
  "Heap",
  "Graph",
  "Dynamic Programming",
  "Backtracking",
  "Greedy",
  "Trie",
  "Segment Tree",
  "Bit Manipulation",
]

// ==========================================================================
// Presentational subcomponents
// ==========================================================================
        interface LeetcodeProfile {
  username: string
  totalSolved: number
  lastSynced: string
  easySolved: number
  mediumSolved: number
  hardSolved: number
  ranking: number
  aiAnalysis: {
    strongest: string
    weakest: string
    recommended: string[]
    dailyRecommendation: string
    weeklyGoal: string
    readiness: {
      label: string
      percent: number
    }
  }
}
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/";

   //// dsatracker pages 
   export default function DsaTrackers() {


    const [profile, setProfile] = useState<LeetcodeProfile | null>(null);

    const [loading, setLoading] = useState(false);

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

const fetchProfile = async () => {
    try {
        setLoading(true);

        const token = localStorage.getItem("token");
     
        const res = await axios.get(
            `${API_BASE_URL}leetcode/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setProfile(res.data.data);
        console.log("Fetched profile:", res.data.data);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};
const handleSync = async () => {
    try {
        setIsSyncing(true);

        const token = localStorage.getItem("token");

        await axios.post(
            `${API_BASE_URL}leetcode/sync`,
            {},
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        await fetchProfile();

    } catch(err){

        console.log(err);

    } finally{

        setIsSyncing(false);

    }
}


    return (

        <>

            <LeetCodeProfileHeader

                profile={profile}

                handleSync={handleSync}

                isSyncing={isSyncing}

            />



    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCards
    label="Total Solved"
    value={profile?.totalSolved ?? 0}
    icon={Trophy}
    accent="#3b82f6"
/>
<StatsCards
    label="Easy"
    value={profile?.easySolved ?? 0}
    icon={CheckCircle}
    accent="#22c55e"
/>

<StatsCards
    label="Medium"
    value={profile?.mediumSolved ?? 0}
    icon={Target}
    accent="#f59e0b"
/>

<StatsCards
    label="Hard"
    value={profile?.hardSolved ?? 0}
    icon={Flame}
    accent="#ef4444"
/>
</div>


<div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">

            <DifficultyPieChart profile={profile}/> 
          <SolvedComparisonBarChart breakdown={profile ? [
            { difficulty: "Easy", solved: profile.easySolved, total: 500},
            { difficulty: "Medium", solved: profile.mediumSolved, total: 500 },    
        { difficulty: "Hard", solved: profile.hardSolved, total: 200 }, 
            ] : []} />
       
        <OverallRadialProgress percent={ profile ? Math.round((profile.totalSolved / 1800) * 100) : 0 } />  
        </div>
        {/* <AIAnalysisCard/> */}
       <AIAnalysisCard
  strongest={profile?.aiAnalysis?.strongest ?? ""}
  weakest={profile?.aiAnalysis?.weakest ?? ""}
  recommended={profile?.aiAnalysis?.recommended ?? []}
  dailyRecommendation={profile?.aiAnalysis?.dailyRecommendation ?? ""}
  weeklyGoal={profile?.aiAnalysis?.weeklyGoal ?? ""}
  readiness={
    profile?.aiAnalysis?.readiness ?? {
      label: "",
      percent: 0,
    }
  }
/>
{/* <TopicProgressList /> */}
 </>

    );

}












function PreviewTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/60 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
      Preview data
    </span>
  )
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted/40 ${className}`} />
}



function StatsCards({
  label,
  value,
  suffix = "",
  icon: Icon,
  accent,
  isPercent,
  delay = 0,
}: {
  label: string
  value: number
  suffix?: string
  icon: React.ElementType
  accent: string
  isPercent?: boolean
  delay?: number
}) {
  const animated = useCountUp(value)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/20 p-4 backdrop-blur-sm transition-colors hover:border-border/70"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">
        {animated}
        {isPercent ? "%" : ""}
        {suffix}
      </p>
    </motion.div>
  )
}


// Leetcode profile shape used across this file

interface HeaderProps {
  profile: LeetcodeProfile | null;
  handleSync: () => Promise<void>;
  isSyncing: boolean;
}
function LeetCodeProfileHeader({
  profile,
  handleSync,
  isSyncing,
}: HeaderProps) {


  return (
    <Card className="relative overflow-hidden border border-border/40 bg-card/20 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent" />
      <CardContent className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, hsl(var(--primary)) 0deg, transparent 140deg, hsl(var(--primary)) 360deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
            />
            <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-background font-mono text-lg font-semibold">
                {profile?.username ? profile.username[0].toUpperCase() : "?"}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">{profile?.username || "yourhandle"}</h3>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              // synced {profile?.lastSynced ? new Date(profile.lastSynced).toLocaleDateString() : "Never"} · rank <span className="text-foreground">#{profile?.ranking?.toLocaleString() || "84,213"}</span>{" "}
              <PreviewTag />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center sm:text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Solved</p>
            <p className="font-mono text-lg font-semibold">
              {profile?.totalSolved || 0}
              <span className="text-muted-foreground">/{profile?.totalSolved || 0}</span>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Contest rating</p>
            <p className="font-mono text-lg font-semibold">1547</p>
          </div>
          <Button size="sm" onClick={handleSync} disabled={isSyncing} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DifficultyPieChart({
    profile,}: {
  profile: LeetcodeProfile | null;
}) {
    const data = profile
      ? [
          { name: "Easy", value: profile.easySolved },
          { name: "Medium", value: profile.mediumSolved },
          { name: "Hard", value: profile.hardSolved },
        ]
      : [];
    const hasData = data.some((d) => d.value > 0);

  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Difficulty split</CardTitle>
        <CardDescription className="text-xs">Solved problems by difficulty</CardDescription>
      </CardHeader>
      <CardContent className="h-[220px] pt-0">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={DIFFICULTY_COLOR[entry.name]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Solve a problem to see your split
          </div>
        )}
        <div className="mt-1 flex justify-center gap-4">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: DIFFICULTY_COLOR[d.name] }} />
              {d.name} ({d.value})
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SolvedComparisonBarChart({
  breakdown,
}: {
  breakdown: { difficulty: string; solved: number; total: number }[]
}) {
  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Solved vs. total</CardTitle>
        <CardDescription className="text-xs">Progress per difficulty tier</CardDescription>
      </CardHeader>
      <CardContent className="h-[220px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={breakdown} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
            <XAxis dataKey="difficulty" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Total" />
            <Bar dataKey="solved" radius={[4, 4, 0, 0]} name="Solved">
              {breakdown.map((entry) => (
                <Cell key={entry.difficulty} fill={DIFFICULTY_COLOR[entry.difficulty]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function OverallRadialProgress({ percent }: { percent: number }) {
  const data = [{ name: "progress", value: percent, fill: "hsl(var(--primary))" }]
  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Overall progress</CardTitle>
        <CardDescription className="text-xs">Across the full problem bank</CardDescription>
      </CardHeader>
      <CardContent className="relative h-[220px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "hsl(var(--muted))" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold">{percent}%</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Complete</span>
        </div>
      </CardContent>
    </Card>
  )
}

function AIAnalysisCard({
  strongest,
  weakest,
  recommended,
  dailyRecommendation,
  weeklyGoal,
  readiness,
}: {
  strongest: string
  weakest: string
  recommended: string[]
  dailyRecommendation: string
  weeklyGoal: string
  readiness: { label: string; percent: number }
}) {
  const rows = [
    { icon: TrendingUp, label: "Strongest area", value: strongest, color: "#10b981" },
    { icon: TrendingDown, label: "Weakest area", value: weakest, color: "#f43f5e" },
    { icon: Layers, label: "Recommended topics", value: recommended.join(", "), color: "#818cf8" },
    { icon: Zap, label: "Daily recommendation", value: dailyRecommendation, color: "#f59e0b" },
    { icon: Calendar, label: "Weekly goal", value: weeklyGoal, color: "#38bdf8" },
  ]

  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">AI analysis</CardTitle>
        </div>
        <CardDescription className="text-xs">Generated from your solved history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3 rounded-lg border border-border/30 bg-muted/10 p-2.5">
            <row.icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: row.color }} />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{row.label}</p>
              <p className="text-sm font-medium">{row.value}</p>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Interview readiness</p>
            <p className="text-sm font-semibold">{readiness.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted/40">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${readiness.percent}%` }} />
            </div>
            <span className="font-mono text-xs text-muted-foreground">{readiness.percent}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TopicProgressList({
  topics,
}: {
  topics: { topic: string; percent: number; isReal: boolean }[]
}) {
  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Topic mastery</CardTitle>
        </div>
        <CardDescription className="text-xs">Coverage across core DSA patterns</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-6 gap-y-3 pt-0 sm:grid-cols-2">
        {topics.map((t, i) => (
          <div key={t.topic}>
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium">
                {t.topic}
                {!t.isReal && <PreviewTag />}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{t.percent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${t.percent}%` }}
                transition={{ duration: 0.6, delay: i * 0.03 }}
                className="h-full rounded-full"
                style={{
                  background: t.percent > 66 ? "#10b981" : t.percent > 40 ? "#f59e0b" : "#f43f5e",
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ContestCard() {
  const badges = ["Guardian", "100 Days Badge", "Knight"]
  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Contests</CardTitle>
          </div>
          <PreviewTag />
        </div>
        <CardDescription className="text-xs">Competitive standing snapshot</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-mono text-lg font-semibold">1547</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</p>
          </div>
          <div>
            <p className="font-mono text-lg font-semibold">#84.2k</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Global rank</p>
          </div>
          <div>
            <p className="font-mono text-lg font-semibold">12</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attended</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <Badge key={b} variant="outline" className="gap-1 text-[10px]">
              <Award className="h-3 w-3" /> {b}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DailyGoalCard({ streak, remainingMedium }: { streak: number; remainingMedium: number }) {
  const goals = [
    { icon: Target, text: `Solve ${Math.min(3, Math.max(remainingMedium, 1))} medium problems`, done: false },
    { icon: Layers, text: "Practice one graph question", done: false },
    { icon: RotateCcw, text: "Revise dynamic programming notes", done: true },
  ]
  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Today's goal</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
            <Flame className="h-3.5 w-3.5" /> {streak} day streak
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {goals.map((g) => (
          <div key={g.text} className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-muted/10 p-2.5">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                g.done ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-border/60 text-transparent"
              }`}
            >
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
            <span className={`text-sm ${g.done ? "text-muted-foreground line-through" : ""}`}>{g.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function RecentActivityTimeline({ recentlySolved }: { recentlySolved: string[] }) {
  const events = [
    {
      icon: RefreshCw,
      title: "Last sync",
      detail: "Profile data refreshed",
      time: "2 min ago",
      color: "#38bdf8",
    },
    ...recentlySolved.slice(0, 3).map((title) => ({
      icon: CheckCircle,
      title: "Solved",
      detail: title,
      time: "Recently",
      color: "#10b981",
    })),
    {
      icon: Gauge,
      title: "Weekly progress",
      detail: "On pace for your weekly goal",
      time: "This week",
      color: "#f59e0b",
    },
    {
      icon: ChevronRight,
      title: "Future goal",
      detail: "Start the Graph patterns module",
      time: "Upcoming",
      color: "#818cf8",
    },
  ]

  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Recent activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative space-y-4 pl-5 before:absolute before:left-[7px] before:top-1 before:h-[calc(100%-8px)] before:w-px before:bg-border/50">
          {events.map((e, i) => (
            <div key={i} className="relative">
              <span
                className="absolute -left-5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full"
                style={{ background: e.color }}
              >
                <e.icon className="h-2.5 w-2.5 text-background" />
              </span>
              <p className="text-sm font-medium">{e.title}</p>
              <p className="truncate text-xs text-muted-foreground">{e.detail}</p>
              <p className="text-[10px] text-muted-foreground/70">{e.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==========================================================================
// Main page — original state, hooks, and business logic are unchanged
// ==========================================================================

