import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap,
  CheckCircle,
  Play,
  Award,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Plus,
  AlertCircle
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { gateSyllabus, GATESubject } from "@/data/dummy-data"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface MockTest {
  id: string
  title: string
  subject: string
  duration: number // in minutes
  totalQuestions: number
  difficulty: "Easy" | "Medium" | "Hard"
  questions: { id: string; question: string; options: string[]; answerIndex: number }[]
}

const mockTests: MockTest[] = [
  {
    id: "test-1",
    title: "Operating Systems CPU Scheduling Quiz",
    subject: "Operating Systems",
    duration: 15,
    totalQuestions: 3,
    difficulty: "Medium",
    questions: [
      {
        id: "q-1",
        question: "Which of the following scheduling algorithms is optimal in terms of minimizing average waiting time?",
        options: ["First-Come, First-Served (FCFS)", "Round Robin (RR)", "Shortest Job First (SJF)", "Priority Scheduling"],
        answerIndex: 2
      },
      {
        id: "q-2",
        question: "What is a major problem with Priority Scheduling algorithm that can lead to starvation?",
        options: ["Aging", "Priority Inversion", "Belady's Anomaly", "Indefinite blocking of low-priority processes"],
        answerIndex: 3
      },
      {
        id: "q-3",
        question: "In round-robin scheduling, as the time quantum becomes extremely large, it behaves like:",
        options: ["FCFS", "SJF", "Multilevel Queue Scheduling", "LIFO"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "test-2",
    title: "Database Normalization Subject Quiz",
    subject: "Databases (DBMS)",
    duration: 20,
    totalQuestions: 2,
    difficulty: "Hard",
    questions: [
      {
        id: "q-4",
        question: "If a relation is in BCNF, it must also be in:",
        options: ["3NF only", "1NF, 2NF, and 3NF", "4NF", "None of the above"],
        answerIndex: 1
      },
      {
        id: "q-5",
        question: "A table has key columns A, B. The functional dependency A -> C exists where C is non-key. This violates which normal form?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        answerIndex: 2
      }
    ]
  }
]

export default function GATETracker() {
  const [completedTopics, setCompletedTopics] = useLocalStorage<Record<string, string[]>>("prep_gate_completed", {
    "gate-math": ["Linear Algebra (Matrices, Eigenvalues, Eigenvectors)"],
    "gate-digital": ["Boolean Algebra & K-Maps"]
  })
  const [testAttempts, setTestAttempts] = useLocalStorage<Record<string, { score: number; max: number; percentage: number; date: string }>>("prep_gate_attempts", {})

  // Active exam workspace states
  const [activeTest, setActiveTest] = useState<MockTest | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTestFinished, setIsTestFinished] = useState(false)
  const [testScore, setTestScore] = useState({ correct: 0, total: 0 })

  // Timer loop
  useEffect(() => {
    if (!activeTest || timeLeft <= 0 || isTestFinished) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [activeTest, timeLeft, isTestFinished])

  // Subject checklist triggers
  const toggleTopic = (subjectId: string, topicName: string) => {
    const list = completedTopics[subjectId] || []
    let newList: string[] = []
    if (list.includes(topicName)) {
      newList = list.filter((t) => t !== topicName)
    } else {
      newList = [...list, topicName]
    }
    setCompletedTopics({
      ...completedTopics,
      [subjectId]: newList
    })
  }

  // Launch mock test
  const startExam = (test: MockTest) => {
    setActiveTest(test)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setTimeLeft(test.duration * 60)
    setIsTestFinished(false)
  }

  // Finish exam calculations
  const finishExam = () => {
    if (!activeTest) return
    let correct = 0
    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answerIndex) {
        correct++
      }
    })
    const total = activeTest.totalQuestions
    const percentage = Math.round((correct / total) * 100)
    
    setTestScore({ correct, total })
    setIsTestFinished(true)

    // Save attempt to history
    setTestAttempts({
      ...testAttempts,
      [activeTest.id]: {
        score: correct,
        max: total,
        percentage,
        date: new Date().toLocaleDateString()
      }
    })
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const s = secs % 60
    return `${mins}:${s < 10 ? "0" : ""}${s}`
  }

  // Aggregated stats
  let totalTopics = 0
  let completedTopicsCount = 0
  gateSyllabus.forEach((sub) => {
    totalTopics += sub.topics.length
    completedTopicsCount += (completedTopics[sub.id] || []).length
  })
  const overallPercent = Math.round((completedTopicsCount / totalTopics) * 100)

  const diffBadge = {
    Easy: "success" as const,
    Medium: "warning" as const,
    Hard: "destructive" as const
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="GATE Syllabus & Mock Tests"
        description="Track CS/IT topics weightage, complete study checklists, and test core concepts."
      />

      {/* Active Exam Workspace Overlay */}
      {activeTest && (
        <Card className="border-2 border-primary bg-card/65 backdrop-blur-md p-6 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div>
              <Badge variant="outline" className="mb-1 text-primary">Exam Mode</Badge>
              <h3 className="font-bold text-lg">{activeTest.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full font-mono font-bold">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {!isTestFinished ? (
            <div className="space-y-6">
              {/* Question area */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground">Question {currentQuestionIndex + 1} of {activeTest.totalQuestions}</span>
                <p className="font-medium text-slate-100 text-base">{activeTest.questions[currentQuestionIndex].question}</p>
              </div>

              {/* Options selection */}
              <div className="grid gap-3">
                {activeTest.questions[currentQuestionIndex].options.map((opt, optIndex) => {
                  const qId = activeTest.questions[currentQuestionIndex].id
                  const isSelected = selectedAnswers[qId] === optIndex
                  return (
                    <button
                      key={optIndex}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [qId]: optIndex })}
                      className={`p-3 text-left rounded-xl border text-sm transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-white font-medium"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-border/40">
                <Button
                  variant="ghost"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((c) => c - 1)}
                >
                  Previous
                </Button>
                {currentQuestionIndex < activeTest.totalQuestions - 1 ? (
                  <Button onClick={() => setCurrentQuestionIndex((c) => c + 1)}>
                    Next Question
                  </Button>
                ) : (
                  <Button onClick={finishExam} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Submit Test
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-6">
              <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-2xl">Exam Completed!</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  You scored <span className="text-white font-semibold">{testScore.correct} out of {testScore.total}</span> ({Math.round((testScore.correct / testScore.total) * 100)}% accuracy).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm border border-border/40 p-4 rounded-xl bg-muted/20">
                <div>
                  <p className="text-muted-foreground text-xs">Percentile Rank</p>
                  <p className="text-xl font-bold text-slate-100">~88.5%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Time Elapsed</p>
                  <p className="text-xl font-bold text-slate-100">{formatTime((activeTest.duration * 60) - timeLeft)}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <Button variant="outline" onClick={() => startExam(activeTest)} className="gap-1.5">
                  <RotateCcw className="h-4 w-4" /> Retry Test
                </Button>
                <Button onClick={() => setActiveTest(null)}>
                  Close Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Overview stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Syllabus Coverage */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">GATE Syllabus Checklist</CardTitle>
                <CardDescription>Select individual subtopics to record coverage</CardDescription>
              </div>
              <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Syllabus: {overallPercent}% Checked
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {gateSyllabus.map((subject) => {
                  const completedList = completedTopics[subject.id] || []
                  const percent = Math.round((completedList.length / subject.topics.length) * 100)
                  return (
                    <AccordionItem key={subject.id} value={subject.id} className="border border-border/40 rounded-xl bg-card/30 px-4 overflow-hidden">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2 pr-4">
                          <div className="min-w-0">
                            <span className="font-semibold text-sm block truncate text-slate-100">{subject.title}</span>
                            <span className="text-xs text-muted-foreground">{subject.weightage} avg weight</span>
                          </div>
                          <div className="flex items-center gap-3 w-full sm:w-32">
                            <Progress value={percent} indicatorClassName="bg-blue-500" className="h-1.5" />
                            <span className="text-xs text-muted-foreground font-mono min-w-[30px] text-right">{percent}%</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 border-t border-border/30">
                        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mt-2">
                          {subject.topics.map((t, i) => {
                            const isChecked = completedList.includes(t.name)
                            return (
                              <div
                                key={i}
                                onClick={() => toggleTopic(subject.id, t.name)}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                                  isChecked
                                    ? "bg-blue-500/10 border-blue-500/30 text-white"
                                    : "bg-muted/20 border-border hover:bg-muted/40 text-muted-foreground"
                                }`}
                              >
                                <div className={`p-0.5 rounded border transition-all ${isChecked ? "bg-blue-500 border-blue-500 text-white" : "border-border text-transparent"}`}>
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                                <span className="text-xs leading-normal font-medium">{t.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Mock Tests List */}
        <div className="space-y-6">
          <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Practice Exam Center</CardTitle>
              <CardDescription>Take simulation test series questions under timed conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTests.map((test) => {
                const attempt = testAttempts[test.id]
                return (
                  <div key={test.id} className="p-4 rounded-xl border border-border bg-card/30 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-foreground leading-snug">{test.title}</h4>
                        <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">{test.subject}</span>
                      </div>
                      <Badge variant={diffBadge[test.difficulty]}>
                        {test.difficulty}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {test.duration} mins
                      </span>
                      <span>{test.totalQuestions} questions</span>
                    </div>

                    {attempt ? (
                      <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-1">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Last score:</span> <span className="text-emerald-500 font-bold">{attempt.score}/{attempt.max}</span> ({attempt.percentage}%)
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-primary" onClick={() => startExam(test)}>
                          Retake Test
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full mt-2" onClick={() => startExam(test)}>
                        Start Mock Quiz <Play className="h-3 w-3 ml-1.5 fill-current" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
