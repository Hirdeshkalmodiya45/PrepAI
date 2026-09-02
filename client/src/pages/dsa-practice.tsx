import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Code2,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Play,
  Check,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  Settings,
  Sparkles
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { dsaProblems, DSAProblem } from "@/data/dummy-data"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function DSATracker() {
  const [solvedIds, setSolvedIds] = useLocalStorage<string[]>("prep_solved_dsa", ["dsa-1"])
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null)
  
  // Search/Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Code editor states
  const [editorCodes, setEditorCodes] = useLocalStorage<Record<string, string>>("prep_dsa_code_drafts", {})
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitPassed, setIsSubmitPassed] = useState(false)

  // Problem categorization lists
  const categories = Array.from(new Set(dsaProblems.map((p) => p.category)))

  // Filtering problems
  const filteredProblems = dsaProblems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDiff = difficultyFilter === "all" || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter
    return matchesSearch && matchesDiff && matchesCat
  })

  // Solved toggle helper
  const toggleSolved = (id: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation()
    if (solvedIds.includes(id)) {
      setSolvedIds(solvedIds.filter((x) => x !== id))
    } else {
      setSolvedIds([...solvedIds, id])
    }
  }

  // Active problem draft code helper
  const activeCode = selectedProblem 
    ? editorCodes[selectedProblem.id] || selectedProblem.boilerplate 
    : ""

  const handleCodeChange = (val: string) => {
    if (selectedProblem) {
      setEditorCodes({
        ...editorCodes,
        [selectedProblem.id]: val
      })
    }
  }

  // Run mock tests simulator
  const runTests = () => {
    if (!selectedProblem) return
    setIsRunning(true)
    setConsoleLogs(["[System] Initializing mock sandbox compiling environment...", "[System] Bundling TypeScript assets...", "[System] Executing user test cases..."])
    
    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev,
        `Test Case 1: Input: ${selectedProblem.examples[0].input} => Output matches expected. (Passed)`,
        selectedProblem.examples[1] 
          ? `Test Case 2: Input: ${selectedProblem.examples[1].input} => Output matches expected. (Passed)` 
          : `Test Case 2: Verification matches. (Passed)`,
        "\n[Result] 2/2 Test Cases Passed successfully! 🎉",
        "Mock Runtime: 14ms | Memory consumption: 4.8MB"
      ])
      setIsRunning(false)
    }, 1200)
  }

  // Submit code simulator
  const submitCode = () => {
    if (!selectedProblem) return
    setIsRunning(true)
    setConsoleLogs(["[System] Running full verification suite (150+ tests)..."])

    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev,
        "All test cases passed (100% correctness).",
        "[Submission] Code accepted! Solved milestone added to profile."
      ])
      setIsRunning(false)
      setIsSubmitPassed(true)
      if (!solvedIds.includes(selectedProblem.id)) {
        setSolvedIds([...solvedIds, selectedProblem.id])
      }
    }, 1500)
  }

  const resetCode = () => {
    if (selectedProblem) {
      handleCodeChange(selectedProblem.boilerplate)
      setConsoleLogs(["[Editor] Code reset to original boilerplate."])
      setIsSubmitPassed(false)
    }
  }

  const diffColors = {
    Easy: "success" as const,
    Medium: "warning" as const,
    Hard: "destructive" as const
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="DSA Practice Board"
        description="Master patterns across top coding interview modules."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Filterable List of Problems */}
        <div className={`space-y-4 ${selectedProblem ? "lg:col-span-5" : "lg:col-span-12"}`}>
          <Card className="border border-border/40 bg-card/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/30 border border-border/50"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  {/* Difficulty Filter */}
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="flex h-10 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex h-10 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {filteredProblems.map((problem) => {
                  const isSolved = solvedIds.includes(problem.id)
                  const isSelected = selectedProblem?.id === problem.id
                  return (
                    <div
                      key={problem.id}
                      onClick={() => {
                        setSelectedProblem(problem)
                        setIsSubmitPassed(false)
                        setConsoleLogs([])
                      }}
                      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-all ${
                        isSelected ? "bg-primary/5 border-l-2 border-primary" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={(e) => toggleSolved(problem.id, e)}
                          className={`rounded-full p-0.5 border transition-all ${
                            isSolved
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                              : "border-border/80 text-transparent hover:border-primary"
                          }`}
                        >
                          <Check className="h-4 w-4 stroke-[3]" />
                        </button>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold truncate hover:text-primary transition-colors">
                            {problem.title}
                          </h4>
                          <span className="text-xs text-muted-foreground font-medium">{problem.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={diffColors[problem.difficulty]}>
                          {problem.difficulty}
                        </Badge>
                      </div>
                    </div>
                  )
                })}

                {filteredProblems.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No problems found matching your filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Split Description & Code Editor Sandbox (shown when selectedProblem !== null) */}
        <AnimatePresence>
          {selectedProblem && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-7 grid grid-cols-1 gap-6"
            >
              {/* Problem Description Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-border/40 bg-card/20 backdrop-blur-sm flex flex-col h-[600px]">
                  <CardHeader className="pb-3 border-b border-border/40 bg-card/10 flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{selectedProblem.title}</CardTitle>
                        <Badge variant={diffColors[selectedProblem.difficulty]}>
                          {selectedProblem.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{selectedProblem.category}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProblem(null)}
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 text-sm leading-relaxed scrollbar-thin">
                    <div>
                      <h5 className="font-semibold text-xs text-primary uppercase tracking-wider mb-1">Description</h5>
                      <p className="whitespace-pre-wrap text-muted-foreground">{selectedProblem.description}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-xs text-primary uppercase tracking-wider mb-2">Examples</h5>
                      <div className="space-y-3">
                        {selectedProblem.examples.map((ex, i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/40 border border-border/30 font-mono text-xs space-y-1">
                            <p><span className="text-muted-foreground">Input:</span> {ex.input}</p>
                            <p><span className="text-muted-foreground">Output:</span> {ex.output}</p>
                            {ex.explanation && <p className="text-muted-foreground leading-normal mt-1"><span className="text-primary italic">Explanation:</span> {ex.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-xs text-primary uppercase tracking-wider mb-1">Constraints</h5>
                      <ul className="list-disc pl-4 space-y-0.5 text-xs text-muted-foreground">
                        {selectedProblem.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Code Workspace Panel */}
                <Card className="border border-border/40 bg-card/20 backdrop-blur-sm flex flex-col h-[600px]">
                  <CardHeader className="pb-3 border-b border-border/40 bg-card/10 flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-1.5 font-mono">
                      <Code2 className="h-4.5 w-4.5 text-primary" /> solution.ts
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={resetCode}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    {/* Monaco Emulator textarea */}
                    <textarea
                      value={activeCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="flex-1 w-full bg-slate-950/80 border-0 p-4 font-mono text-xs focus:outline-none focus:ring-0 resize-none text-emerald-400 placeholder:text-muted-foreground leading-relaxed overflow-y-auto"
                      spellCheck="false"
                    />

                    {/* Console Logger box */}
                    <div className="h-[200px] border-t border-border/40 bg-slate-950 flex flex-col">
                      <div className="px-3 py-1.5 bg-slate-900 border-b border-border/30 text-xs font-mono text-muted-foreground flex items-center justify-between">
                        <span>Terminal Console Output</span>
                        {isSubmitPassed && (
                          <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Accepted
                          </span>
                        )}
                      </div>
                      <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] text-muted-foreground space-y-1 select-text scrollbar-thin">
                        {consoleLogs.map((log, i) => (
                          <p key={i} className={log.includes("Passed") || log.includes("Accepted") ? "text-emerald-500" : log.includes("Error") ? "text-red-500" : "text-muted-foreground"}>
                            {log}
                          </p>
                        ))}
                        {consoleLogs.length === 0 && (
                          <p className="text-slate-600 italic">Sandbox console empty. Run compiler tests to inspect metrics.</p>
                        )}
                      </div>
                    </div>

                    {/* Workspace buttons footer */}
                    <div className="p-3 border-t border-border/40 bg-card/30 flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={runTests} disabled={isRunning}>
                        <Play className="h-3.5 w-3.5 mr-1" /> Run Tests
                      </Button>
                      <Button size="sm" onClick={submitCode} disabled={isRunning}>
                        Submit Code
                      </Button>
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
