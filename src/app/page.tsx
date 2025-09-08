"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * Overlay + Control Panel (1280x720 left overlay)
 * - Transparent background suitable for OBS Browser Source
 * - Aesthetic styling + animations
 * - Full timer controls (start/pause/reset/skip/auto-switch)
 * - Editable goal, session, break/focus durations
 *
 * OBS usage:
 * - Add Browser Source, point to this page.
 * - Set width=1280 height=720 and check "Allow Transparency" (or similar) in OBS.
 * - Crop the OBS capture to the left portion (1280x720) if capturing the whole window.
 */

/* --- Utility functions --- */
const pad = (n: number) => String(n).padStart(2, "0");
const minutesAndSeconds = (s: number) =>
  `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

export default function Home() {
  // Overlay content state
  const [goal, setGoal] = useState("DSA — Graphs & Trees");
  const [totalSessions, setTotalSessions] = useState<number>(8);

  // Timer config (in minutes)
  const [focusMinutes, setFocusMinutes] = useState<number>(50);
  const [breakMinutes, setBreakMinutes] = useState<number>(10);

  // Timer runtime state (seconds)
  const [remainingSec, setRemainingSec] = useState<number>(focusMinutes * 60);
  const [isFocus, setIsFocus] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Session tracking
  const [session, setSession] = useState<number>(1);

  // Animation & progress helpers
  const initialRef = useRef<number>(focusMinutes * 60);
  useEffect(() => {
    // whenever durations change, update initialRef but don't force if running
    if (isFocus) {
      initialRef.current = focusMinutes * 60;
      if (!isRunning) setRemainingSec(focusMinutes * 60);
    } else {
      initialRef.current = breakMinutes * 60;
      if (!isRunning) setRemainingSec(breakMinutes * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMinutes, breakMinutes]);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemainingSec((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Auto-switch when remaining reaches zero
  useEffect(() => {
    if (remainingSec > 0) return;
    // Switch mode
    if (isFocus) {
      // just ended focus -> go to break
      setIsFocus(false);
      initialRef.current = breakMinutes * 60;
      setRemainingSec(breakMinutes * 60);
      setIsRunning(false); // pause at break start — you can change to auto-start if desired
    } else {
      // just ended break -> next focus
      setIsFocus(true);
      setSession((s) => Math.min(s + 1, totalSessions));
      initialRef.current = focusMinutes * 60;
      setRemainingSec(focusMinutes * 60);
      setIsRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec]);

  // Compute next break time (for display) — approximate based on now + remainingSec when in focus
  const nextBreakDisplay = React.useMemo(() => {
    if (!isFocus) {
      // currently in break — show when break ends
      const t = new Date(Date.now() + remainingSec * 1000);
      return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      const t = new Date(Date.now() + remainingSec * 1000);
      return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  }, [isFocus, remainingSec]);

  // Progress for circular ring (0-1)
  const progress = 1 - remainingSec / Math.max(1, initialRef.current);
  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - progress * circumference;

  // Controls
  const startPause = () => setIsRunning((r) => !r);
  const resetTimer = () => {
    setIsRunning(false);
    if (isFocus) {
      initialRef.current = focusMinutes * 60;
      setRemainingSec(focusMinutes * 60);
    } else {
      initialRef.current = breakMinutes * 60;
      setRemainingSec(breakMinutes * 60);
    }
  };
  const skip = () => {
    // fast-forward to 0 then auto-switch logic will run via useEffect
    setRemainingSec(0);
  };

  // Keyboard: space to start/pause, r to reset, s to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        startPause();
      } else if (e.key.toLowerCase() === "r") {
        resetTimer();
      } else if (e.key.toLowerCase() === "s") {
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus, remainingSec, isRunning]);

  // Styles inline (to keep page self-contained) — tailwind-like classes assumed available,
  // but we include minimal style tags for essential aesthetics and animations.
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent", // ensure transparency
        color: "white",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        display: "flex",
        gap: 24,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        /* Basic reset for the overlay area */
        .panel { background: rgba(0,0,0,0.35); backdrop-filter: blur(6px); border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); }
        .glass { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); }
        .glow { box-shadow: 0 8px 30px rgba(70,120,255,0.08); }
        .btn { cursor: pointer; padding: 8px 14px; border-radius: 10px; border: none; font-weight: 600; }
        .btn-primary { background: linear-gradient(90deg,#5b8cff,#3b6bff); color: white; }
        .btn-ghost { background: rgba(255,255,255,0.03); color: #e6eefc; border: 1px solid rgba(255,255,255,0.04); }
        .pulse { animation: pulse 2.2s infinite; }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.92; }
          100% { transform: scale(1); opacity: 1; }
        }
        /* subtle sliding for right panel content */
        .slide-up { transform-origin: bottom; animation: slideUp 0.6s ease both; }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* LEFT: Overlay area (1280x720) */}
      <div
        aria-hidden={false}
        style={{
          width: 1280,
          height: 720,
          boxSizing: "border-box",
          padding: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          className="panel glass"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            marginBottom: 18,
            borderRadius: 12,
            transition: "all 200ms ease",
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>📌</span>
              <span>{goal}</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Next Break</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{nextBreakDisplay}</div>
          </div>
        </div>


        {/* Center compact timer + progress ring */}
        <div
          style={{
            height: 480, // shrink container height
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 160,   // reduced from 260
              height: 160,  // reduced from 260
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            aria-hidden
          >
            {/* SVG circular progress */}
            <svg height={radius * 1.2} width={radius * 1.2}>
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
              <circle
                stroke="rgba(255,255,255,0.06)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="url(#g1)"
                fill="transparent"
                strokeLinecap="round"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.7s linear" }}
              />
            </svg>

            {/* Inner timer card */}
            <div
              style={{
                position: "absolute",
                width: 120,  // reduced from 200
                height: 120, // reduced from 200
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                boxShadow: isFocus
                  ? "0 8px 20px rgba(59, 97, 255, 0.08)"
                  : "0 8px 20px rgba(34,197,94,0.06)",
                border: "1px solid rgba(255,255,255,0.04)",
                transition: "all 300ms ease",
                transform: isRunning ? "scale(1.01)" : "scale(1)",
              }}
            >
              <div style={{ fontSize: 14, opacity: 0.9 }}>
                {isFocus ? "FOCUS" : "BREAK"}
              </div>
              <div
                style={{
                  fontSize: 28, // smaller than 46
                  fontWeight: 700,
                  marginTop: 4,
                  letterSpacing: 0.5,
                }}
              >
                {minutesAndSeconds(Math.max(0, remainingSec))}
              </div>
              <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
                {`Session ${session} / ${totalSessions}`}
              </div>
            </div>
          </div>
        


        {/* Left Sidebar Info Stack */}
        <div
          style={{
            position: "absolute",     // float it
            top: "50%",               // vertical center
            left: 20,                 // stick to left
            transform: "translateY(-50%)", // perfect centering
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: 280,               // narrower for sidebar feel
          }}
        >
          <div
            className="panel"
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6 }}>
              Quick Info
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 20 }}>🎧</div>
              <div>
                <div style={{ fontWeight: 700 }}>Lo-Fi Focus</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Background music on | Vol 40%
                </div>
              </div>
            </div>
          </div>

          <div
            className="panel"
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6 }}>
              Reminder
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, lineHeight: "1.4" }}>
              {"💬 Chat will be read every break."}
              {"Stay focused — small consistent steps win."}
            </div>
          </div>
        </div>



      </div>

      {/* Bottom bar */}
      <div
        className="panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          marginTop: 6,
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 14 }}>
          {"Placement Prep 2026 — Study With Me"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              padding: "6px 10px",
              fontSize: 14,
            }}
          >
            {isRunning ? "Running" : "Paused"}
          </div>
        </div>
      </div>
    </div>

      {/* RIGHT: Control Panel (not captured by OBS if you crop) */ }
  <div
    style={{
      flex: 1,
      maxWidth: 520,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "stretch",
    }}
  >
    <div
      className="panel slide-up"
      style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>🎛 Control Panel</h3>
        <div style={{ opacity: 0.8, fontSize: 13 }}>
          Tip: Space=start/pause · R=reset · S=skip
        </div>
      </div>

      {/* Goal */}
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{"Today's Goal"}</div>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.01)",
            color: "white",
            fontSize: 15,
          }}
        />
      </label>

      {/* Durations */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{"Focus (minutes)"}</div>
          <input
            type="number"
            min={1}
            value={focusMinutes}
            onChange={(e) => {
              const v = Math.max(1, Number(e.target.value || 1));
              setFocusMinutes(v);
              if (isFocus) {
                initialRef.current = v * 60;
                setRemainingSec(v * 60);
              }
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.01)",
              color: "white",
            }}
          />
        </div>
        <div style={{ width: 120 }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{"Break (minutes)"}</div>
          <input
            type="number"
            min={1}
            value={breakMinutes}
            onChange={(e) => {
              const v = Math.max(1, Number(e.target.value || 1));
              setBreakMinutes(v);
              if (!isFocus) {
                initialRef.current = v * 60;
                setRemainingSec(v * 60);
              }
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.01)",
              color: "white",
            }}
          />
        </div>
      </div>

      {/* Sessions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{"Session"}</div>
          <input
            type="number"
            min={1}
            value={session}
            onChange={(e) =>
              setSession(Math.max(1, Math.min(totalSessions, Number(e.target.value || 1))))
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.01)",
              color: "white",
            }}
          />
        </div>
        <div style={{ width: 140 }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{"Total Sessions"}</div>
          <input
            type="number"
            min={1}
            value={totalSessions}
            onChange={(e) => setTotalSessions(Math.max(1, Number(e.target.value || 1)))}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.01)",
              color: "white",
            }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button
          onClick={startPause}
          className="btn btn-primary"
          style={{
            flex: 1,
            background: isRunning ? "linear-gradient(90deg,#ff7ab6,#ff5a5a)" : undefined,
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer} className="btn btn-ghost" style={{ width: 110 }}>
          Reset
        </button>
        <button onClick={skip} className="btn btn-ghost" style={{ width: 110 }}>
          Skip
        </button>
      </div>

      {/* Extra actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button
          onClick={() => {
            setIsFocus(true);
            initialRef.current = focusMinutes * 60;
            setRemainingSec(focusMinutes * 60);
            setIsRunning(false);
          }}
          className="btn btn-ghost"
          style={{ flex: 1 }}
        >
          Set Focus
        </button>
        <button
          onClick={() => {
            setIsFocus(false);
            initialRef.current = breakMinutes * 60;
            setRemainingSec(breakMinutes * 60);
            setIsRunning(false);
          }}
          className="btn btn-ghost"
          style={{ flex: 1 }}
        >
          Set Break
        </button>
      </div>
    </div>

    <div className="panel slide-up" style={{ padding: 14 }}>
      <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>{"Preview Controls"}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            // small visual demo: add 1 minute
            setRemainingSec((s) => s + 60);
          }}
          className="btn btn-ghost"
        >
          +1 min
        </button>
        <button
          onClick={() => {
            setRemainingSec((s) => Math.max(0, s - 60));
          }}
          className="btn btn-ghost"
        >
          -1 min
        </button>
        <button
          onClick={() => {
            setSession((x) => Math.max(1, x - 1));
          }}
          className="btn btn-ghost"
        >
          -Session
        </button>
        <button
          onClick={() => {
            setSession((x) => Math.min(totalSessions, x + 1));
          }}
          className="btn btn-ghost"
        >
          +Session
        </button>
      </div>
    </div>

    <div className="panel slide-up" style={{ padding: 14 }}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>
        OBS instructions:
        <ul style={{ marginTop: 6, opacity: 0.9 }}>
          <li>• Add Browser Source → URL to this page.</li>
          <li>• Set Width 1280 Height 720 and enable Transparency.</li>
          <li>• Crop the browser window to capture only left 1280×720 area.</li>
        </ul>
      </div>
    </div>
  </div>
    </div >
  );
}
