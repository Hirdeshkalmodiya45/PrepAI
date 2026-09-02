import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Volume2,
  Mic,
  RotateCcw,
  Languages
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { englishScenarios, EnglishScenario } from "@/data/dummy-data"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const API_BASE_URL =
  import.meta.env.VITE_API_URL;


export default function EnglishCoach() {

   




  const [completedScenarios, setCompletedScenarios] = useLocalStorage<string[]>("prep_english_completed", [])
  const [selectedScenario, setSelectedScenario] = useState<EnglishScenario | null>(null)
  
  // Practice states
  const [speechDraft, setSpeechDraft] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<{
    grammarScore: number
    vocabScore: number
    includedVocab: string[]
    missingVocab: string[]
    feedback: string
  } | null>(null)
  

  const handleStartPractice = (scenario: EnglishScenario) => {
    setSelectedScenario(scenario)
    setSpeechDraft("")
    setEvaluationResult(null)
    setIsRecording(false)
  }

  // Simulated Voice Dictator
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
    } else {
      setIsRecording(true)
      setSpeechDraft("")
      // Simulate live dictating after 2 seconds
      setTimeout(() => {
        if (selectedScenario) {
          const sampleSpeech = selectedScenario.id === "eng-1"
            ? "Hello, my name is John Doe. I am a final-year Computer Science student specializing in machine learning. Recently, I built a PrepAI platform which solved placement tracking and achieved a 40% reduction in preparation bottlenecks. I am extremely proactive and proficient in React and Node. I am looking for a challenging SDE role where I can leverage my skills to build high-impact applications."
            : "The project is a secure cloud vault designed to protect credentials. At a high level, the system consists of three main parts: React front end, Node gateway, and key vaults. We chose this microservices design because it allowed us to scale easily, improving system scalability and creating a robust, redundant cluster that eliminates bottlenecks..."
          
          setSpeechDraft(sampleSpeech)
          setIsRecording(false)
        }
      }, 2500)
    }
  }

  const evaluateSpeech = () => {
    if (!selectedScenario || !speechDraft.trim()) return
    setIsEvaluating(true)

    const textLower = speechDraft.toLowerCase()
    
    // Check which target vocabulary was included
    const included: string[] = []
    const missing: string[] = []
    selectedScenario.vocabulary.forEach((word) => {
      if (textLower.includes(word.toLowerCase())) {
        included.push(word)
      } else {
        missing.push(word)
      }
    })

    const totalVocab = selectedScenario.vocabulary.length
    const vocabScore = Math.round((included.length / totalVocab) * 100)

    // Check for mock grammar flaws (e.g. check for common run-on sentences or spelling anomalies)
    const grammarScore = textLower.includes("i am") && textLower.includes("recently") ? 92 : 85

    setTimeout(() => {
      let coachAdvice = ""
      if (included.length === totalVocab) {
        coachAdvice = "Excellent! You structured your points logic perfectly and utilized all suggested high-impact words. Pacing is smooth and professional. Clear formatting aligns with corporate communication expectations."
      } else if (included.length > 0) {
        coachAdvice = `Strong effort! You successfully integrated vocabulary words like ${included.join(", ")}. To sound more professional, try to weave in: ${missing.join(", ")}. Avoid using filler words like 'uhm' or 'like'.`
      } else {
        coachAdvice = `Your pitch is clear, but try to utilize key industry terms to display technical authority. Review the suggested vocab list (e.g., ${selectedScenario.vocabulary.slice(0, 3).join(", ")}) and try again.`
      }

      setEvaluationResult({
        grammarScore,
        vocabScore,
        includedVocab: included,
        missingVocab: missing,
        feedback: coachAdvice
      })

      setIsEvaluating(false)

      // Add to completed logs
      if (!completedScenarios.includes(selectedScenario.id)) {
        setCompletedScenarios([...completedScenarios, selectedScenario.id])
      }
    }, 1500)
  }

  const diffColors = {
    Beginner: "success" as const,
    Intermediate: "warning" as const,
    Advanced: "destructive" as const
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="English Communication Coach"
        description="Refine your vocabulary, verbal fluency, and structure for corporate placements."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: scenario selection */}
        <div className={`space-y-4 ${selectedScenario ? "lg:col-span-5" : "lg:col-span-12"}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {englishScenarios.map((scen) => {
              const isCompleted = completedScenarios.includes(scen.id)
              const isSelected = selectedScenario?.id === scen.id
              return (
                <Card
                  key={scen.id}
                  onClick={() => handleStartPractice(scen)}
                  className={`border cursor-pointer hover:border-primary/50 transition-all ${
                    isSelected ? "border-primary bg-primary/5" : "border-border bg-card/25"
                  }`}
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{scen.duration} exercise</span>
                      <Badge variant={diffColors[scen.difficulty]}>{scen.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-base mt-2 flex items-center gap-1.5">
                      {scen.title}
                      {isCompleted && <CheckCircle className="h-4.5 w-4.5 text-emerald-500 fill-emerald-500/10" />}
                    </CardTitle>
                    <CardDescription className="text-xs">{scen.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Right column: active workspace */}
        <AnimatePresence>
          {selectedScenario && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guidelines panel */}
                <Card className="border border-border/40 bg-card/20 backdrop-blur-sm h-[600px] flex flex-col">
                  <CardHeader className="pb-3 border-b border-border/40 bg-card/10 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Pitch Guidelines</CardTitle>
                      <CardDescription className="text-xs">Vocabulary guidelines & prompts</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedScenario(null)} className="text-xs text-muted-foreground">
                      Close
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 text-sm leading-relaxed scrollbar-thin">
                    <div>
                      <h5 className="font-semibold text-xs text-primary uppercase tracking-wider mb-2">Target Vocabulary</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedScenario.vocabulary.map((vocab, i) => (
                          <Badge key={i} variant="outline" className="font-mono text-[10px] bg-muted/40 border-border/60">
                            {vocab}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-xs text-primary uppercase tracking-wider mb-1">Coach Tips</h5>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                        {selectedScenario.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-xs text-primary uppercase tracking-wider mb-2">Suggested Template</h5>
                      <div className="p-3 rounded-xl border border-border bg-slate-950/60 font-sans text-xs text-muted-foreground leading-normal whitespace-pre-wrap">
                        {selectedScenario.template}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Practicing microphone sandbox */}
                <Card className="border border-border/40 bg-card/20 backdrop-blur-sm h-[600px] flex flex-col">
                  <CardHeader className="pb-3 border-b border-border/40 bg-card/10">
                    <CardTitle className="text-base flex items-center gap-1.5 font-sans">
                      <Languages className="h-4.5 w-4.5 text-primary" /> Speech Analyzer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-4 overflow-hidden space-y-4">
                    {/* Simulated live typing/speech area */}
                    <div className="flex-1 flex flex-col space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground">Response text:</label>
                      <textarea
                        value={speechDraft}
                        onChange={(e) => setSpeechDraft(e.target.value)}
                        placeholder="Click dictation mic to simulate voice speech, or type out your draft pitch here..."
                        className="flex-1 w-full bg-slate-950/80 border border-border/50 rounded-xl p-3 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none text-slate-100 placeholder:text-muted-foreground leading-relaxed overflow-y-auto"
                        disabled={isEvaluating}
                      />
                    </div>

                    {/* Speech buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "secondary"}
                        size="sm"
                        onClick={toggleRecording}
                        className="gap-1.5"
                      >
                        {isRecording ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-white animate-ping mr-1" />
                            Listening...
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4" /> Simulate Mic
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={evaluateSpeech}
                        disabled={!speechDraft.trim() || isEvaluating}
                      >
                        Analyze Speech
                      </Button>
                    </div>

                    {/* Evaluation results */}
                    <div className="h-[230px] border-t border-border/40 bg-slate-950/60 -mx-4 -mb-4 p-4 flex flex-col overflow-y-auto scrollbar-thin">
                      <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center justify-between">
                        <span>Coach Feedback Dashboard</span>
                      </div>
                      
                      {evaluationResult ? (
                        <div className="space-y-3 text-xs leading-relaxed">
                          {/* Scoreboard gauges */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2 border border-border/40 rounded-lg bg-card/20 text-center">
                              <p className="text-muted-foreground text-[10px]">Vocab Score</p>
                              <p className="text-base font-bold text-primary">{evaluationResult.vocabScore}%</p>
                            </div>
                            <div className="p-2 border border-border/40 rounded-lg bg-card/20 text-center">
                              <p className="text-muted-foreground text-[10px]">Grammar Score</p>
                              <p className="text-base font-bold text-primary">{evaluationResult.grammarScore}%</p>
                            </div>
                          </div>

                          {/* Words critique list */}
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-300">Vocab matched:</p>
                            <div className="flex flex-wrap gap-1">
                              {evaluationResult.includedVocab.map((w, i) => (
                                <Badge key={i} variant="success" className="text-[10px] font-mono">{w}</Badge>
                              ))}
                              {evaluationResult.includedVocab.length === 0 && <span className="text-[10px] text-muted-foreground italic">None of the target words were detected.</span>}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="font-semibold text-slate-300">Coach Guidance:</p>
                            <p className="text-primary italic text-xs leading-normal">{evaluationResult.feedback}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-center p-4">
                          <p className="text-[11px] text-slate-600 italic">No feedback compiled. Complete speech practice to fetch AI recommendations.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
