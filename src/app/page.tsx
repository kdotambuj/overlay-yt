"use client"
import { useEffect, useState } from "react"
import { Play, Pause, RotateCcw, SkipForward, Clock, Coffee, Brain, Volume2, MessageCircle } from "lucide-react"

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
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden">
      {/* Left Panel - Control Sidebar */}
      <div className="w-80 bg-gray-50/50 border-r border-gray-200 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-lg font-medium text-gray-900 mb-6 tracking-tight">Study Timer</h1>

          {/* Topic Input */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-2">
              <Brain className="w-3 h-3" />
              Current Topic
            </label>
            <input
              className="w-full bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:ring-0 focus:outline-none transition-colors"
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
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Focus
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={Math.floor(focusTime / 60)}
                  onChange={(e) => updateFocusTime(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:ring-0 focus:outline-none transition-colors"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-400">min</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                Break
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={Math.floor(breakTime / 60)}
                  onChange={(e) => updateBreakTime(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:ring-0 focus:outline-none transition-colors"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-400">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Timer Display */}
        <div className="flex flex-col items-center py-8">
          <div className="relative w-36 h-36 mb-6">
            {/* Background Circle */}
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - getProgress() / 100)}`}
                className={`transition-all duration-1000 ease-out ${
                  mode === "focus" ? "text-blue-500" : "text-green-500"
                }`}
                strokeLinecap="round"
              />
            </svg>

            {/* Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-mono font-medium text-gray-900 tracking-tight">
                {formatTime(secondsLeft)}
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize font-medium tracking-wide">{mode} Time</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            {timerState !== "running" ? (
              <button
                onClick={startTimer}
                className="flex items-center justify-center w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200"
              >
                <Play className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={resetTimer}
              className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={skipTimer}
              className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Panel */}
        <div className="mt-auto space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <span>Lo-Fi Focus music</span>
              <span className="text-xs text-gray-400">Vol 40%</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span>Chat read every break</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl font-light text-gray-600">{formatTime(secondsLeft)}</div>
            <div className="text-lg text-gray-500 font-light capitalize tracking-wide">{mode} Session</div>
            <div className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {topic || "Focus on your current task"}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Optional */}
      <div className="w-64 bg-gray-50/30 border-l border-gray-200">
        <div className="p-6">
          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-4">Session Stats</div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Current Mode</span>
              <span className="capitalize font-medium">{mode}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="capitalize font-medium">{timerState}</span>
            </div>
            <div className="flex justify-between">
              <span>Progress</span>
              <span className="font-medium">{Math.round(getProgress())}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
