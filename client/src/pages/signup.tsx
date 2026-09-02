import * as React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle, ArrowRight, UserSquare2, ShieldCheck, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [leetcodeUsername, setLeetcodeUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("Student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setIsLoading(true)
    const result = await signup(name, email, password, role, leetcodeUsername)
    setIsLoading(false)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Left side: Premium Branding & Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-slate-900/30 border-r border-slate-800/40 relative backdrop-blur-3xl overflow-hidden">
        {/* Floating gradient circle */}
        <div className="absolute top-1/4 right-[-20%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none animate-pulse" />

        {/* Top Header */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            ElevateAI
          </span>
        </div>

        {/* Hero Copy */}
        <div className="max-w-xl my-auto space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> Start Your Journey Today
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Elevate your placement readiness with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">smart analytics</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Create your account in seconds to begin practicing core DSA questions, optimizing your speech delivery, tracking GATE preparations, and interviewing with AI models.
            </p>
          </motion.div>

          {/* Key Features List */}
          <div className="grid grid-cols-2 gap-4">
            {[
              "AI Interview Simulator",
              "Interactive DSA Tracker",
              "English Communication Coach",
              "GATE Prep Trackers",
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/20 border border-slate-800/40 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 group"
              >
                <CheckCircle2 className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 flex items-center justify-between z-10 border-t border-slate-800/40 pt-6">
          <span>&copy; 2026 ElevateAI. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right side: Signup Form or Success State */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo showing on mobile */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">ElevateAI</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {!success ? (
                <Card className="border border-slate-800/60 bg-slate-900/60 backdrop-blur-xl shadow-2xl text-slate-100">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-center tracking-tight text-white">
                      Create Account
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-center text-sm">
                      Get started with your free placement account
                    </CardDescription>
                  </CardHeader>

                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-3.5 pt-1">
                      {/* Error Box */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-semibold text-slate-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 bg-slate-950/80 border-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>


                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold text-slate-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-slate-950/80 border-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Role selection dropdown */}
                      <div className="space-y-1.5">
                        <label htmlFor="role" className="text-xs font-semibold text-slate-300">
                          Professional Role
                        </label>
                        <div className="relative">
                          <UserSquare2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 pl-10 cursor-pointer appearance-none transition-all"
                            disabled={isLoading}
                          >
                            <option value="Student">Student</option>
                            <option value="Software Engineer">Software Engineer</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Data Scientist">Data Scientist</option>
                            <option value="Other">Other Role</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                            ▼
                          </div>
                        </div>
                      </div>
                     {/* leetcode Username */}
                      <div className="space-y-1.5">
                        <label htmlFor="leetcodeUsername" className="text-xs font-semibold text-slate-300">
                          LeetCode Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="leetcodeUsername"
                            type="text"
                            placeholder="john_doe"
                            value={leetcodeUsername}
                            onChange={(e) => setLeetcodeUsername(e.target.value)}
                            className="pl-10 bg-slate-950/80 border-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      {/* Password */}
                      <div className="space-y-1.5">
                        <label htmlFor="password" className="text-xs font-semibold text-slate-300">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 bg-slate-950/80 border-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50"
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-white transition-colors"
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-300">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 pr-10 bg-slate-950/80 border-slate-800/80 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50"
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-white transition-colors"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-4 pb-6">
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Sign Up
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-slate-400 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                          Sign In
                        </Link>
                      </p>
                    </CardFooter>
                  </form>
                </Card>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full text-center"
                >
                  <Card className="border border-slate-800/60 bg-slate-900/60 backdrop-blur-xl shadow-2xl text-slate-100 p-8 flex flex-col items-center space-y-6">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-emerald-400 animate-bounce">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white tracking-tight">Account Created!</h2>
                      <p className="text-slate-400 text-sm max-w-sm">
                        Your account has been successfully registered. You can now sign in using your email and password.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                      Proceed to Sign In
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
