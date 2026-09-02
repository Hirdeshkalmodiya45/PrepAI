import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Clock,
  Briefcase,
  AlertCircle
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { interviewPresets, InterviewPreset } from "@/data/dummy-data"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function InterviewCoach() {
  const [attempts, setAttempts] = useLocalStorage<Record<string, { role: string; score: number; date: string }>>("prep_interview_attempts", {})
  
  // Prep states
  const [activeSession, setActiveSession] = useState<InterviewPreset | null>(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userResponse, setUserResponse] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [responseLog, setResponseLog] = useState<{ question: string; answer: string; score: number; analysis: string }[]>([])
  
  // Final Scorecard states
  const [isFinished, setIsFinished] = useState(false)

  const startSession = (preset: InterviewPreset) => {
    setActiveSession(preset)
    setCurrentQIndex(0)
    setUserResponse("")
    setResponseLog([])
    setIsFinished(false)
  }

  const evaluateAnswer = () => {
    if (!activeSession) return
    setIsEvaluating(true)

    const q = activeSession.questions[currentQIndex]
    const answerLower = userResponse.toLowerCase()
    
    // Calculate simulated score based on matching keywords
    let matchedCount = 0
    const matchedWords: string[] = []
    q.expectedKeywords.forEach((kw) => {
      if (answerLower.includes(kw.toLowerCase())) {
        matchedCount++
        matchedWords.push(kw)
      }
    })

    const keywordCount = q.expectedKeywords.length
    const matchPercent = keywordCount > 0 ? (matchedCount / keywordCount) : 1
    const finalScore = Math.round(50 + (matchPercent * 50)) // base score of 50

    setTimeout(() => {
      let analysisText = ""
      if (matchedCount === keywordCount) {
        analysisText = `Excellent answer! You hit all crucial key phrases: ${matchedWords.join(", ")}. Your technical logic is highly accurate and comprehensive.`
      } else if (matchedCount > 0) {
        analysisText = `Good response. You successfully mentioned: ${matchedWords.join(", ")}. However, you missed: ${q.expectedKeywords.filter((w) => !matchedWords.includes(w)).join(", ")}. Elaborating on these missing concepts would significantly strengthen your answer.`
      } else {
        analysisText = `Your answer lacks necessary technical keywords. Be sure to reference core design elements: ${q.expectedKeywords.join(", ")}. Keep structure consistent using the STAR framework.`
      }

      setResponseLog((prev) => [
        ...prev,
        {
          question: q.question,
          answer: userResponse,
          score: finalScore,
          analysis: analysisText
        }
      ])

      setIsEvaluating(false)
      setUserResponse("")

      // Advance or Finish
      if (currentQIndex < activeSession.questions.length - 1) {
        setCurrentQIndex((c) => c + 1)
      } else {
        finishSession(finalScore)
      }
    }, 1200)
  }

  const finishSession = (lastScore: number) => {
    if (!activeSession) return
    // Calculate aggregate score
    let scoreSum = 0
    responseLog.forEach((item) => {
      scoreSum += item.score
    })
    // Add current evaluation score
    scoreSum += lastScore
    const avgScore = Math.round(scoreSum / activeSession.questions.length)

    setAttempts({
      ...attempts,
      [activeSession.id]: {
        role: activeSession.role,
        score: avgScore,
        date: new Date().toLocaleDateString()
      }
    })
    setIsFinished(true)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Mock Interview Coach"
        description="Simulate live technical and behavioral round questions with immediate keyword critiques."
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Active Interview Workspace */}
        {activeSession && !isFinished && (
          <Card className="border border-primary/30 bg-card/45 backdrop-blur-sm p-6 space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div>
                <span className="text-xs uppercase font-semibold text-primary tracking-wider">{activeSession.type} ROUND</span>
                <h3 className="font-extrabold text-lg text-slate-100">{activeSession.role} Simulator</h3>
              </div>
              <div className="text-xs font-semibold text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                Question {currentQIndex + 1} of {activeSession.questions.length}
              </div>
            </div>

            {/* Simulated AI Interviewer question */}
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-primary/20 shrink-0">
                  AI
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-muted/40 border border-border/20 text-slate-200 text-sm leading-relaxed flex-1">
                  <p className="font-semibold mb-1 text-primary text-xs">Interviewer Question:</p>
                  {activeSession.questions[currentQIndex].question}
                </div>
              </div>

              {/* User Answer Textarea */}
              <div className="space-y-2">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your structured answer here. Utilize STAR method for behavioral rounds or detail complexity logic for technical rounds..."
                  className="w-full h-32 rounded-xl bg-slate-950/80 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary p-4 text-sm font-sans resize-none text-slate-100 placeholder:text-muted-foreground leading-relaxed focus:outline-none"
                  disabled={isEvaluating}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                {/* Hints toggle */}
                <div className="text-xs text-muted-foreground max-w-lg leading-normal flex items-start gap-1">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong className="text-amber-500">Hint:</strong> {activeSession.questions[currentQIndex].hints}</span>
                </div>
                <Button
                  onClick={evaluateAnswer}
                  disabled={!userResponse.trim() || isEvaluating}
                  className="shadow-lg shadow-primary/10 shrink-0"
                >
                  {isEvaluating ? "Evaluating..." : "Submit Answer"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Final Session Scorecard */}
        {activeSession && isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Grade panel */}
            <Card className="border border-primary/30 bg-primary/5 p-6 text-center space-y-6 flex flex-col justify-center items-center">
              <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-20 h-20 flex items-center justify-center border border-primary/30">
                <Award className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-2xl tracking-tight text-white">Interview Scorecard</h3>
                <p className="text-xs text-primary uppercase font-bold tracking-wider">{activeSession.role}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Aggregate Grade</p>
                <p className="text-5xl font-extrabold text-slate-100">{attempts[activeSession.id]?.score}%</p>
              </div>

              <Button onClick={() => setActiveSession(null)} className="w-full">
                Close Scorecard
              </Button>
            </Card>

            {/* Detailed answers evaluation */}
            <Card className="border border-border/40 bg-card/25 backdrop-blur-sm p-6 md:col-span-2 space-y-4 h-[500px] overflow-y-auto scrollbar-thin">
              <h4 className="font-bold text-sm text-slate-200 border-b border-border/40 pb-2">Round Analysis Report</h4>
              <div className="space-y-4">
                {responseLog.map((log, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/30 space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-bold text-slate-300">Q{i + 1}: {log.question}</p>
                      <Badge className={log.score >= 80 ? "bg-emerald-500/10 text-emerald-500" : log.score >= 65 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500 border-transparent"}>
                        {log.score}%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal"><strong className="text-slate-400">Answer:</strong> "{log.answer}"</p>
                    <p className="text-xs text-primary leading-normal italic"><strong className="text-primary not-italic">Critique:</strong> {log.analysis}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Set Selection (shown when activeSession === null) */}
        {!activeSession && (
          <div className="grid gap-6 sm:grid-cols-2">
            {interviewPresets.map((preset) => {
              const attempt = attempts[preset.id]
              return (
                <Card
                  key={preset.id}
                  className="border border-border bg-card/20 backdrop-blur-sm p-5 hover:border-primary/50 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-primary uppercase tracking-wider font-semibold text-[10px]">
                        {preset.type} Round
                      </Badge>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-200 text-base">{preset.role}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">3 standard question decks assessing system logic and alignment.</p>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4 mt-5 flex items-center justify-between">
                    {attempt ? (
                      <div className="text-xs text-muted-foreground">
                        Last Grade: <strong className="text-emerald-500">{attempt.score}%</strong>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">Not yet attempted</div>
                    )}
                    <Button size="sm" onClick={() => startSession(preset)}>
                      Start Practice <ArrowRight className="h-3 w-3 ml-1.5" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
