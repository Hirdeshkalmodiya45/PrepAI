import * as React from "react"
import { useEffect, useState } from "react"
import {
  Settings,
  Sparkles,
  Award,
  Clock,
  Briefcase,
  User,
  Shield,
  Save,
  CheckCircle2
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../hooks/use-auth"

export default function SettingsPage() {
   const { user, logout } = useAuth()
   
const [profileName, setProfileName] = useState("")
const [profileEmail, setProfileEmail] = useState("")

const [draftName, setDraftName] = useState("")
const [draftEmail, setDraftEmail] = useState("")

useEffect(() => {
  if (user) {
    setProfileName(user.name || "")
    setProfileEmail(user.email || "")
    setDraftName(user.name || "")
    setDraftEmail(user.email || "")
  }
}, [user])
  const [targetGateScore, setTargetGateScore] = useLocalStorage<number>("prep_target_gate", 99)
  const [dailyHours, setDailyHours] = useLocalStorage<number>("prep_daily_hours", 4)
  const [targetRoles, setTargetRoles] = useLocalStorage<string[]>("prep_target_roles", ["SDE", "Frontend"])
  const [intensity, setIntensity] = useLocalStorage<string>("prep_intensity", "Intensive")

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [draftGate, setDraftGate] = useState(targetGateScore)
  const [draftHours, setDraftHours] = useState(dailyHours)
  const [draftIntensity, setDraftIntensity] = useState(intensity)

  const rolesOptions = ["SDE", "Frontend", "Backend", "Full Stack", "System Architect", "Product Manager"]

  const toggleRole = (role: string) => {
    if (targetRoles.includes(role)) {
      setTargetRoles(targetRoles.filter((r) => r !== role))
    } else {
      setTargetRoles([...targetRoles, role])
    }
  }

  const handleSave = () => {
    setProfileName(draftName)
    setProfileEmail(draftEmail)
    setTargetGateScore(draftGate)
    setDailyHours(draftHours)
    setIntensity(draftIntensity)
    
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
    }, 2000)
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <PageHeader
        title="Settings & Coaching Configurations"
        description="Set your study goals, coaching preferences, and target career paths."
      />

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card className="border border-border/40 bg-card/25 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary" /> Profile Configurations
            </CardTitle>
            <CardDescription className="text-xs">Your baseline user statistics</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="bg-muted/30 border-border/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
              <Input
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                className="bg-muted/30 border-border/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Coaching Goals */}
        <Card className="border border-border/40 bg-card/25 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" /> Learning Goals & Targets
            </CardTitle>
            <CardDescription className="text-xs">Customize recommendation engine thresholds</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Daily Hours Target */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" /> Daily Hours Target
                </label>
                <span className="font-bold text-slate-200">{draftHours} hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={draftHours}
                onChange={(e) => setDraftHours(Number(e.target.value))}
                className="w-full h-1.5 rounded bg-muted accent-primary cursor-pointer"
              />
            </div>

            

            {/* Study Intensity */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Placement Strategy Intensity</label>
              <div className="grid grid-cols-3 gap-3">
                {["Relaxed", "Moderate", "Intensive"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDraftIntensity(mode)}
                    className={`p-3 text-center text-xs rounded-xl border font-semibold transition-all ${
                      draftIntensity === mode
                        ? "border-primary bg-primary/10 text-white"
                        : "border-border hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Paths Selection */}
        <Card className="border border-border/40 bg-card/25 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-primary" /> Career Path Targets
            </CardTitle>
            <CardDescription className="text-xs">Filter interview coach round topics based on target roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
              {rolesOptions.map((role) => {
                const isChecked = targetRoles.includes(role)
                return (
                  <div
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                      isChecked
                        ? "bg-primary/10 border-primary/40 text-white font-medium"
                        : "bg-muted/20 border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <div className={`p-0.5 rounded border transition-all ${isChecked ? "bg-primary border-primary text-white" : "border-border text-transparent"}`}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span>{role}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 p-4 bg-card/30 flex items-center justify-between">
            <div className="text-xs">
              {savedSuccess ? (
                <span className="text-emerald-500 font-semibold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="h-4 w-4" /> Modifications saved!
                </span>
              ) : (
                <span className="text-muted-foreground">Click save to lock in preferences.</span>
              )}
            </div>
            <Button onClick={handleSave} className="gap-1.5 shadow-lg shadow-primary/25">
              <Save className="h-4 w-4" /> Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
