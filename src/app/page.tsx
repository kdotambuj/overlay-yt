"use client"
import { useEffect, useState } from "react"
import { Play, Pause, RotateCcw, SkipForward, Timer, Coffee, Zap, Headphones, Users } from "lucide-react"

type TimerMode = "focus" | "break"
type TimerState = "idle" | "running" | "paused"

export default function Home() {
  const [topic, setTopic] = useState<string>("Live DSA & Study with me")
  const [focusTime, setFocusTime] = useState<number>(50 * 60) // in seconds
  const [breakTime, setBreakTime] = useState<number>(10 * 60) // in seconds
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [secondsLeft, setSecondsLeft] = useState<number>(focusTime)
  const [mode, setMode] = useState<TimerMode>("focus")

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  // Calculate progress percentage for circular timer
  const getProgress = () => {
    const totalTime = mode === "focus" ? focusTime : breakTime
    return ((totalTime - secondsLeft) / totalTime) * 100
  }

  // Timer effect
  useEffect(() => {
    if (timerState !== "running") return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Switch mode automatically when timer ends
          if (mode === "focus") {
            setMode("break")
            return breakTime
          } else {
            setMode("focus")
            return focusTime
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerState, mode, focusTime, breakTime])

  // Control handlers
  const startTimer = () => setTimerState("running")
  const pauseTimer = () => setTimerState("paused")
  const resetTimer = () => {
    setTimerState("idle")
    setSecondsLeft(mode === "focus" ? focusTime : breakTime)
  }
  const skipTimer = () => {
    if (mode === "focus") {
      setMode("break")
      setSecondsLeft(breakTime)
    } else {
      setMode("focus")
      setSecondsLeft(focusTime)
    }
    setTimerState("running")
  }

  // Handle input changes
  const updateFocusTime = (minutes: number) => {
    const secs = minutes * 60
    setFocusTime(secs)
    if (mode === "focus") setSecondsLeft(secs)
  }
  const updateBreakTime = (minutes: number) => {
    const secs = minutes * 60
    setBreakTime(secs)
    if (mode === "break") setSecondsLeft(secs)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-x"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/8 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-violet-400/5 rounded-full blur-2xl animate-drift"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300/6 rounded-full blur-2xl animate-drift-reverse"></div>
      </div>

      {/* Left Panel - Control Sidebar */}
      <div className="w-80 backdrop-blur-xl bg-black/20 border-r border-white/20 p-8 flex flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-6 tracking-tight bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent animate-shimmer drop-shadow-lg">
            Focus Timer
          </h1>

          {/* Topic Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-purple-200 uppercase tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Current Topic
            </label>
            <input
              className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-purple-200/60 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-500 hover:bg-black/30"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What are you studying?"
            />
          </div>
        </div>

        {/* Timer Settings */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-purple-200 uppercase tracking-wide flex items-center gap-1">
                <Timer className="w-4 h-4" />
                Focus
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={Math.floor(focusTime / 60)}
                  onChange={(e) => updateFocusTime(Number(e.target.value))}
                  className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-3 text-sm text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-500 hover:bg-black/30"
                />
                <span className="absolute right-3 top-3 text-xs text-purple-200/80">min</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-purple-200 uppercase tracking-wide flex items-center gap-1">
                <Coffee className="w-4 h-4" />
                Break
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={Math.floor(breakTime / 60)}
                  onChange={(e) => updateBreakTime(Number(e.target.value))}
                  className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-3 text-sm text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-500 hover:bg-black/30"
                />
                <span className="absolute right-3 top-3 text-xs text-purple-200/80">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Timer Display */}
        <div className="flex flex-col items-center py-8">
          <div className="relative w-40 h-40 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full blur-xl opacity-20 animate-pulse-glow"></div>

            {/* Background Circle */}
            <svg className="w-40 h-40 transform -rotate-90 relative z-10" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-white/20"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - getProgress() / 100)}`}
                className="transition-all duration-1000 ease-out drop-shadow-lg animate-progress-glow"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={mode === "focus" ? "#8b5cf6" : "#10b981"} />
                  <stop offset="100%" stopColor={mode === "focus" ? "#a855f7" : "#06d6a0"} />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div
                className="text-3xl font-mono font-bold text-white tracking-tight drop-shadow-lg animate-pulse-subtle"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              >
                {formatTime(secondsLeft)}
              </div>
              <div className="text-xs text-purple-200 mt-2 capitalize font-semibold tracking-wide">{mode} Time</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3">
            {timerState !== "running" ? (
              <button
                onClick={startTimer}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-110 active:scale-95"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 hover:scale-110 active:scale-95"
              >
                <Pause className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={resetTimer}
              className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={skipTimer}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-110 active:scale-95"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Panel */}
        <div className="mt-0">
          <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 space-y-3 hover:bg-black/30 transition-all duration-300">
            <div className="flex items-center gap-3 text-sm text-purple-100">
              <Headphones className="w-4 h-4 text-purple-300" />
              <span>Lo-Fi Focus music</span>
              <span className="text-xs text-purple-200/80 ml-auto">Vol 40%</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-purple-100">
              <Users className="w-4 h-4 text-purple-300" />
              <span>Chat read every break</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-6 backdrop-blur-sm bg-black/15 rounded-3xl p-12 border border-white/20 hover:bg-black/20 transition-all duration-500 animate-fade-in">
            <div
              className="text-8xl font-light text-white drop-shadow-2xl bg-gradient-to-b from-white via-purple-100 to-white bg-clip-text text-transparent animate-shimmer"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
            >
              {formatTime(secondsLeft)}
            </div>
            <div className="text-2xl text-purple-200 font-light capitalize tracking-wide animate-fade-in-delayed">
              {mode} Session
            </div>
            <div className="text-lg text-purple-100/90 max-w-md mx-auto leading-relaxed font-medium animate-fade-in-delayed">
              {topic || "Focus on your current task"}
            </div>

            {/* Progress bar */}
            <div className="w-64 mx-auto animate-fade-in-delayed">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${
                    mode === "focus"
                      ? "bg-gradient-to-r from-purple-500 to-violet-500"
                      : "bg-gradient-to-r from-green-500 to-emerald-500"
                  } animate-progress-shimmer`}
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <div className="text-xs text-purple-200/80 mt-2 text-center">{Math.round(getProgress())}% Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Session Stats */}
      <div className="w-64 backdrop-blur-xl bg-black/15 border-l border-white/20 relative z-10">
        <div className="p-6">
          <div className="text-sm font-bold text-purple-200 uppercase tracking-wide mb-6">Session Stats</div>
          <div className="space-y-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-black/30 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-purple-200">Current Mode</span>
                <span
                  className={`capitalize font-bold text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                    mode === "focus" ? "bg-purple-600/40 text-purple-100" : "bg-green-600/40 text-green-100"
                  }`}
                >
                  {mode}
                </span>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-black/30 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-purple-200">Status</span>
                <span
                  className={`capitalize font-bold text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                    timerState === "running"
                      ? "bg-green-600/40 text-green-100"
                      : timerState === "paused"
                        ? "bg-orange-600/40 text-orange-100"
                        : "bg-gray-600/40 text-gray-100"
                  }`}
                >
                  {timerState}
                </span>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-black/30 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-purple-200">Progress</span>
                <span className="font-bold text-white">{Math.round(getProgress())}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    mode === "focus"
                      ? "bg-gradient-to-r from-purple-500 to-violet-500"
                      : "bg-gradient-to-r from-green-500 to-emerald-500"
                  } animate-progress-shimmer`}
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }
        @keyframes drift {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
          }
          25% {
            transform: translateX(10px) translateY(-10px);
          }
          50% {
            transform: translateX(-5px) translateY(-20px);
          }
          75% {
            transform: translateX(-10px) translateY(-5px);
          }
        }
        @keyframes drift-reverse {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
          }
          25% {
            transform: translateX(-10px) translateY(10px);
          }
          50% {
            transform: translateX(5px) translateY(20px);
          }
          75% {
            transform: translateX(10px) translateY(5px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        @keyframes progress-glow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.8));
          }
        }
        @keyframes progress-shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-delayed {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          50% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        .animate-drift {
          animation: drift 30s ease-in-out infinite;
        }
        .animate-drift-reverse {
          animation: drift-reverse 35s ease-in-out infinite;
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        .animate-progress-glow {
          animation: progress-glow 2s ease-in-out infinite;
        }
        .animate-progress-shimmer {
          background-size: 200% auto;
          animation: progress-shimmer 2s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1s ease-out;
        }
      `}</style>
    </div>
  )
}
