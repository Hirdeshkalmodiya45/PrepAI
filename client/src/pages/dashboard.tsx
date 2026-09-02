import * as React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Flame,
  Code2,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  FileText,
  Target,
  AlertCircle,
  ListChecks,
} from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

// ======================================================
// TYPES
// ======================================================

interface DashboardUser {
  name: string
  email?: string
}

interface ResumeInfo {
  uploaded: boolean
  atsScore: number
}

interface DsaInfo {
  solved: number
  total: number
  easy: number
  medium: number
  hard: number
  ranking: number
}

interface MockInterviewInfo {
  score: number
  completed?: boolean
}

interface RecentActivity {
  id: string
  title: string
  description?: string
  timestamp?: string
}

interface Recommendation {
  id: string
  type: string
  title: string
  description: string
  link: string
}

interface DailyTask {
  _id: string
  title: string
  description?: string
  type: "DSA" | "APTITUDE" | "INTERVIEW" | "RESUME" | "GENERAL"
  completed: boolean
  taskDate: string
  completedAt?: string
  createdAt?: string
}

interface TaskProgress {
  completed: number
  total: number
}

interface DashboardData {
  user: DashboardUser
  placementScore: number
  streak: number
  resume: ResumeInfo
  dsa: DsaInfo
  mockInterview: MockInterviewInfo
  recentActivities: RecentActivity[]
  recommendations: Recommendation[]
  todayTasks: DailyTask[]
  taskProgress: TaskProgress
}

// ======================================================
// API
// ======================================================

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/"

// ======================================================
// RECOMMENDATION ICONS
// ======================================================

const RECOMMENDATION_ICON_MAP: Record<
  string,
  {
    icon: React.ElementType
    color: string
  }
> = {
  DSA: {
    icon: Code2,
    color: "text-purple-500 bg-purple-500/10",
  },

  RESUME: {
    icon: FileText,
    color: "text-blue-500 bg-blue-500/10",
  },

  INTERVIEW: {
    icon: Users,
    color: "text-emerald-500 bg-emerald-500/10",
  },

  DEFAULT: {
    icon: Target,
    color: "text-amber-500 bg-amber-500/10",
  },
}

function getRecommendationVisual(type?: string) {
  return (
    RECOMMENDATION_ICON_MAP[type?.toUpperCase() || ""] ||
    RECOMMENDATION_ICON_MAP.DEFAULT
  )
}

// ======================================================
// TASK TYPE COLORS
// ======================================================

function getTaskTypeClass(type: DailyTask["type"]) {
  switch (type) {
    case "DSA":
      return "bg-purple-500/10 text-purple-400"

    case "INTERVIEW":
      return "bg-emerald-500/10 text-emerald-400"

    case "RESUME":
      return "bg-blue-500/10 text-blue-400"

    case "APTITUDE":
      return "bg-orange-500/10 text-orange-400"

    default:
      return "bg-amber-500/10 text-amber-400"
  }
}

// ======================================================
// DASHBOARD
// ======================================================

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [error, setError] = useState<string | null>(null)

  // ====================================================
  // FETCH DASHBOARD
  // ====================================================

  useEffect(() => {
    let isMounted = true

    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const token = localStorage.getItem("token")

        if (!token) {
          if (isMounted) {
            setError("Your session has expired. Please login again.")
          }

          return
        }

        const response = await axios.get<DashboardData>(
          `${API_BASE_URL}dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (isMounted) {
          setData(response.data)
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)

        if (isMounted) {
          setError(
            "We couldn't load your dashboard right now. Please try again."
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  // ====================================================
  // ERROR STATE
  // ====================================================

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            Unable to load dashboard
          </h2>

          <p className="max-w-md text-sm text-muted-foreground">
            {error}
          </p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    )
  }

  // ====================================================
  // DSA PERCENTAGE
  // ====================================================

  const dsaPercentage =
    data?.dsa?.total && data.dsa.total > 0
      ? Math.round((data.dsa.solved / data.dsa.total) * 100)
      : 0

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-12 sm:space-y-8">

      {/* ==================================================
          WELCOME BANNER
      ================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 backdrop-blur-md sm:p-6 md:p-8">

        {/* Background glow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0 space-y-3">

            {isLoading ? (
              <>
                <Skeleton className="h-6 w-52 rounded-full" />

                <Skeleton className="h-9 w-full max-w-md" />

                <Skeleton className="h-4 w-full max-w-xl" />
              </>
            ) : (
              <>
                {/* Score Badge */}
                <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />

                  <span className="truncate">
                    AI Placement Readiness Score:{" "}
                    {data?.placementScore ?? 0}%
                  </span>
                </div>

                {/* Heading */}
                <h1 className="break-words text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  Welcome back, {data?.user?.name || "User"}!
                </h1>

                {/* Description */}
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Your prep statistics are looking solid. You have completed{" "}
                  <span className="font-medium text-foreground">
                    {data?.dsa?.solved ?? 0} DSA problems
                  </span>{" "}
                  and scored{" "}
                  <span className="font-medium text-foreground">
                    {data?.mockInterview?.score ?? 0}/10
                  </span>{" "}
                  in your latest mock interview.
                </p>
              </>
            )}

          </div>

          {/* AI Coach Button */}
          {!isLoading && (
            <div className="relative z-10 shrink-0">
              <Button
                asChild
                size="lg"
                className="w-full gap-2 shadow-lg shadow-primary/25 sm:w-auto"
              >
                <Link to="/ai-coach">
                  Talk to AI Coach
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* ==================================================
          STAT CARDS
      ================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-28 w-full rounded-xl"
            />
          ))
        ) : (
          <>
            {/* Streak */}
            <StatCard
              title="Daily Study Streak"
              value={`${data?.streak ?? 0} Days`}
              description="Maintain daily activity to keep your streak"
              icon={Flame}
              iconClassName="bg-amber-500/10"
            />

            {/* Resume Uploaded */}
            <StatCard
              title="Resume Uploaded"
              value={data?.resume?.uploaded ? "Yes" : "No"}
              description="Status of your latest resume"
              icon={FileText}
              iconClassName="bg-blue-500/10"
            />

            {/* ATS */}
            <StatCard
              title="Resume ATS Score"
              value={`${data?.resume?.atsScore ?? 0}%`}
              description="Applicant Tracking System compatibility"
              icon={TrendingUp}
              iconClassName="bg-indigo-500/10"
            />

            {/* DSA */}
            <StatCard
              title="DSA Progress"
              value={`${data?.dsa?.solved ?? 0} / ${data?.dsa?.total ?? 0}`}
              description={`${dsaPercentage}% of curated bank completed`}
              icon={Code2}
              iconClassName="bg-purple-500/10"
            />

            {/* Interview */}
            <StatCard
              title="Mock Interview Score"
              value={`${data?.mockInterview?.score ?? 0}/10`}
              description="Based on your most recent session"
              icon={Users}
              iconClassName="bg-emerald-500/10"
            />
          </>
        )}

      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="min-w-0 space-y-6 lg:col-span-2">

          {/* =================================================
              TODAY'S TASKS
          ================================================= */}

          <Card className="overflow-hidden border-border/40 bg-card/20 backdrop-blur-sm">

            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">
                  <CardTitle className="text-lg">
                    Today's Placement Tasks
                  </CardTitle>

                  <CardDescription>
                    Complete your personalized tasks for today
                  </CardDescription>
                </div>

                {!isLoading && (
                  <div className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {data?.taskProgress?.completed ?? 0}/
                    {data?.taskProgress?.total ?? 0}
                  </div>
                )}

              </div>
            </CardHeader>

            <CardContent>

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-16 w-full rounded-xl"
                    />
                  ))}
                </div>
              ) : data?.todayTasks && data.todayTasks.length > 0 ? (

                <div className="space-y-3">

                  {data.todayTasks.map((task) => (

                    <div
                      key={task._id}
                      className={`group flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between ${
                        task.completed
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : "border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/60 hover:shadow-sm"
                      }`}
                    >

                      {/* Task information */}
                      <div className="flex min-w-0 items-start gap-3">

                        {/* Status icon */}
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            task.completed
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-border/60 bg-transparent"
                          }`}
                        >
                          {task.completed && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 space-y-1">

                          <p
                            className={`break-words text-sm font-semibold ${
                              task.completed
                                ? "text-muted-foreground line-through decoration-emerald-500/30"
                                : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {task.title}
                          </p>

                          <div className="flex min-w-0 flex-wrap items-center gap-2">

                            {/* Task type */}
                            <span
                              className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTaskTypeClass(
                                task.type
                              )}`}
                            >
                              {task.type}
                            </span>

                            {/* Description */}
                            {task.description && (
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {task.description}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* Status */}
                      <div className="ml-8 shrink-0 sm:ml-0">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            task.completed
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                /* Empty state */

                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/20 px-4 py-12 text-center">

                  <div className="mb-3 rounded-full bg-primary/10 p-4">
                    <ListChecks className="h-6 w-6 text-primary" />
                  </div>

                  <h4 className="text-sm font-semibold">
                    No Tasks Today
                  </h4>

                  <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
                    No placement tasks have been assigned for today yet.
                  </p>

                </div>

              )}

            </CardContent>

          </Card>

          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <Card className="border-border/40 bg-card/20 backdrop-blur-sm">

            <CardHeader>
              <CardTitle className="text-lg">
                Recent Activity
              </CardTitle>

              <CardDescription>
                Your latest actions across the platform
              </CardDescription>
            </CardHeader>

            <CardContent>

              {isLoading ? (

                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-14 w-full rounded-lg"
                    />
                  ))}
                </div>

              ) : data?.recentActivities &&
                data.recentActivities.length > 0 ? (

                <div className="space-y-3">

                  {data.recentActivities.map((activity) => (

                    <div
                      key={activity.id}
                      className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card/30 p-3 transition-all hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >

                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium">
                          {activity.title}
                        </p>

                        {activity.description && (
                          <p className="mt-0.5 break-words text-xs text-muted-foreground">
                            {activity.description}
                          </p>
                        )}
                      </div>

                      {activity.timestamp && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      )}

                    </div>

                  ))}

                </div>

              ) : (

                <div className="rounded-xl border border-dashed border-border/60 px-4 py-10 text-center">

                  <p className="text-sm font-medium">
                    No recent activity yet.
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your recent actions will appear here.
                  </p>

                </div>

              )}

            </CardContent>

          </Card>

        </div>

        {/* =================================================
            RIGHT — AI RECOMMENDATIONS
        ================================================= */}

        <div className="min-w-0 lg:col-span-1">

          <Card className="h-full border-border/40 bg-card/20 backdrop-blur-sm">

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Recommendations
              </CardTitle>

              <CardDescription>
                Suggested next steps for your preparation
              </CardDescription>
            </CardHeader>

            <CardContent>

              {isLoading ? (

                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-24 w-full rounded-xl"
                    />
                  ))}
                </div>

              ) : data?.recommendations &&
                data.recommendations.length > 0 ? (

                <div className="space-y-4">

                  {data.recommendations.map((recommendation) => {

                    const {
                      icon: Icon,
                      color,
                    } = getRecommendationVisual(
                      recommendation.type
                    )

                    return (

                      <div
                        key={recommendation.id}
                        className="group rounded-xl border border-border/40 bg-card/30 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card/50 hover:shadow-md hover:shadow-primary/5"
                      >

                        <div className="flex items-start gap-3">

                          {/* Icon */}
                          <div
                            className={`shrink-0 rounded-lg p-2 ${color}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Title */}
                          <h4 className="min-w-0 break-words pt-1 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
                            {recommendation.title}
                          </h4>

                        </div>

                        {/* Description */}
                        <p className="mt-3 break-words text-xs leading-relaxed text-muted-foreground">
                          {recommendation.description}
                        </p>

                        {/* Action */}
                        {recommendation.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-3 h-8 w-full justify-between text-xs hover:bg-primary/10 hover:text-primary"
                            asChild
                          >
                            <Link to={recommendation.link}>
                              Take Action
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}

                      </div>

                    )
                  })}

                </div>

              ) : (

                /* Empty recommendation state */

                <div className="flex flex-col items-center justify-center py-12 text-center">

                  <div className="mb-3 rounded-full bg-muted/50 p-3">
                    <Target className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <p className="text-sm font-medium">
                    You're all caught up!
                  </p>

                  <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-muted-foreground">
                    No new recommendations at the moment. Keep practicing!
                  </p>

                </div>

              )}

            </CardContent>

          </Card>

        </div>

      </section>

    </div>
  )
}