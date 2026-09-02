import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Sparkles,
  Send,
  Code2,
  FileText,
  Terminal,
  Brain,
  HelpCircle,
  Clock,
  ArrowRight,
  BookOpen
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios, { Axios } from "axios"
import ResumeUpload from "@/components/ResumeUpload.js";
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}
const personaPresets = [
  {
    id: "general",
    title: "General Coach",
    description: "Study plans & placement guidance.",
    icon: Brain,
    color: "border-purple-500/30 text-purple-400 bg-purple-500/5",
    glow: "from-purple-500/20 via-fuchsia-500/10 to-transparent",
    ring: "ring-purple-500/40",
  },
  {
    id: "dsa",
    title: "DSA Coach",
    description: "Explain algorithms and debug code.",
    icon: Code2,
    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
    glow: "from-emerald-500/20 via-teal-500/10 to-transparent",
    ring: "ring-emerald-500/40",
  },
  {
    id: "resume",
    title: "Resume Coach",
    description: "ATS review and project improvements.",
    icon: FileText,
    color: "border-blue-500/30 text-blue-400 bg-blue-500/5",
    glow: "from-blue-500/20 via-sky-500/10 to-transparent",
    ring: "ring-blue-500/40",
  },
   {
    id: "task",
    title: "Task Coach",
    description: "Help with specific tasks and assignments.",
    icon: BookOpen,
    color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
    glow: "from-amber-500/20 via-orange-500/10 to-transparent",
    ring: "ring-amber-500/40",
  },
  
];

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/";

export default function AICoach() {
  const { user } = useAuth();
  const [activePreset, setActivePreset] = useState(personaPresets[0])
const [messages,setMessages]=useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
const [resumeUploaded, setResumeUploaded] = useState(false);
const currentMessages = messages;

      

useEffect(()=>{

setMessages([]);

},[activePreset.id])
  useEffect(() => {
    scrollToBottom()
  }, [currentMessages, isTyping])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (
  coach: "general" | "dsa" | "resume" | "task",
  message: string
) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}coach/chat`,
      {
        coach,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res.data;

  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

  
  const handleSend = async (text: string) => {
  if (!text.trim()) return;

  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content: text,
    timestamp: new Date().toISOString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {

    const data = await sendMessage(
      activePreset.id as "general" | "dsa" | "resume" | "task",
      text
    );

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: data.reply,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMessage]);

  } catch (err) {

    const errorMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Something went wrong. Please try again.",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, errorMessage]);

  } finally {

    setIsTyping(false);

  }
};





  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      <div className="sticky top-0 z-20">
        <PageHeader
          title="AI Placement Coach"
          description="Interact with specialized coaches to boost your DSA, GATE, and communication skills."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 min-h-0 px-3 md:px-4 pb-3 md:pb-4">
        {/* Sidebar Personas */}
        <div className="md:col-span-1 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto pb-1 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
          {personaPresets.map((preset) => {
            const Icon = preset.icon
            const isActive = activePreset.id === preset.id
            return (
              <motion.button
                key={preset.id}
                onClick={() => setActivePreset(preset)}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative shrink-0 w-[220px] md:w-auto text-left p-3.5 rounded-2xl border backdrop-blur-sm transition-colors duration-200 overflow-hidden ${
                  isActive
                    ? `border-primary/50 bg-card/60 text-foreground shadow-lg shadow-primary/10 ring-1 ${preset.ring}`
                    : "border-border/40 bg-card/20 text-muted-foreground hover:bg-card/40 hover:border-border/70"
                }`}
              >
                {isActive && (
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${preset.glow}`}
                  />
                )}
                <div className="relative flex items-center gap-2.5 mb-1.5">
                  <div className={`p-1.5 rounded-lg border ${preset.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{preset.title}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-dot"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  )}
                </div>
                <p className="relative text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </motion.button>
            )
          })}
        </div>

        {/* Chat Interface */}
        <div className="md:col-span-3 flex flex-col border border-border/40 rounded-2xl bg-card/20 backdrop-blur-md shadow-xl shadow-black/5 overflow-hidden min-h-0">
          {/* Active Coach Header */}
          <div className="p-4 border-b border-border/40 bg-card/40 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`relative p-2 rounded-xl ${activePreset.color} border`}>
                <activePreset.icon className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{activePreset.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online &middot; ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              <Sparkles className="h-3 w-3 animate-pulse" />
              AI Powered
            </div>
          </div>

          {activePreset.id === "resume" && (
            <div className="border-b border-border/40 px-4 py-2.5 bg-card/20">
              <AnimatePresence mode="wait">
                {!resumeUploaded ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <ResumeUpload
                      onUploadSuccess={() => setResumeUploaded(true)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-emerald-400">
                        ✅ Resume uploaded successfully
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Now ask me anything about your resume.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Conversation Stream */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {currentMessages.length === 0 && !isTyping && (
                  <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center text-muted-foreground gap-2 py-10">
                    <div className={`p-3 rounded-2xl border ${activePreset.color}`}>
                      <activePreset.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Start chatting with {activePreset.title}
                    </p>
                    <p className="text-xs max-w-xs">
                      Ask a question below or tap a suggestion to get going.
                    </p>
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {currentMessages.map((msg) => {
                    const isAI = msg.role === "assistant"
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex items-start gap-3 ${isAI ? "justify-start" : "justify-end"}`}
                      >
                        {isAI && (
                          <Avatar className="h-8 w-8 border border-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap break-words ${
                            isAI
                              ? "bg-muted/50 text-foreground rounded-tl-sm border border-border/30 shadow-sm"
                              : "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-tr-sm shadow-lg shadow-primary/20"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {!isAI && (
                          <Avatar className="h-8 w-8 border border-border shrink-0">
                            <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                              {user?.name ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 justify-start"
                  >
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-3.5 rounded-2xl rounded-tl-sm bg-muted/50 border border-border/30 flex gap-1.5 items-center justify-center w-16 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </div>

         
          

          {/* Prompt Input Form */}
          <div className="p-3.5 md:p-4 border-t border-border/40 bg-card/30 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(inputValue)
              }}
              className="flex gap-2 items-center rounded-2xl border border-border/50 bg-background/60 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 px-1.5 py-1.5"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask ${activePreset.title}...`}
                className="flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="rounded-xl shrink-0 shadow-md shadow-primary/20"
              >
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}