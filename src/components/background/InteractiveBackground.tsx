"use client"

import { useRef, useEffect, type CSSProperties } from "react"
const useIsStaticRenderer = () => false

interface KineticGridProps {
    background?: string
    dotColor?: string
    lineColor?: string
    trailColor?: string
    spacing?: number
    radius?: number
    strength?: number
    trail?: boolean
    style?: CSSProperties
    okColor?: string
    badColor?: string
    clickEffects?: boolean
}

type Tone = "ok" | "bad"

const MESSAGES: { text: string; tone: Tone }[] = [
    { text: "ACCESS GRANTED", tone: "ok" },
    { text: "ACCESS DENIED", tone: "bad" },
    { text: "CONNECTION ESTABLISHED", tone: "ok" },
    { text: "COMPLIANT", tone: "ok" },
    { text: "AUDIT PASSED", tone: "ok" },
    { text: "POLICY ENFORCED", tone: "ok" },
    { text: "RISK DETECTED", tone: "bad" },
    { text: "ACCESS REVOKED", tone: "bad" },
    { text: "UNAUTHORIZED", tone: "bad" },
]

// Wave (click ripple) tuning
const WAVE_LIFE = 900          // ms lifetime of a ripple
const WAVE_SPEED = 0.75        // px per ms → front radius = age * WAVE_SPEED
const WAVE_BAND = 70           // thickness (px) of the physical push band
const WAVE_PUSH = 3.2          // impulse strength at the wave front
const MAX_RIPPLES = 6
const SLEEP = 0.01             // rest threshold to kill residual vibration

// Parse "#rrggbb" → [r,g,b]
const hexToRgb = (hex: string): [number, number, number] => {
    const h = hex.replace("#", "")
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Interpolate between two rgb colors, t in [0,1] → "rgb(r,g,b)"
const mixRgb = (a: [number, number, number], b: [number, number, number], t: number) => {
    const r = Math.round(a[0] + (b[0] - a[0]) * t)
    const g = Math.round(a[1] + (b[1] - a[1]) * t)
    const bl = Math.round(a[2] + (b[2] - a[2]) * t)
    return `rgb(${r},${g},${bl})`
}

export default function KineticGrid(props: KineticGridProps) {
    const {
        background = "bg-gray-900",
        dotColor = "#FFFFFF",
        lineColor = "#2563EB",
        trailColor = "#2664EB",
        spacing = 59,
        radius = 600,
        strength = 10,
        trail = false,
        okColor = "#22c55e",
        badColor = "#ef4444",
        clickEffects = true,
    } = props

    const hostRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -9999, y: -9999, active: false })
    const trailRef = useRef<{ x: number; y: number; t: number }[]>([])
    const ripplesRef = useRef<{ x: number; y: number; t0: number; tone: Tone; text: string }[]>([])
    const isStatic = useIsStaticRenderer()

    useEffect(() => {
        const host = hostRef.current
        const canvas = canvasRef.current
        if (!host || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

        const GAP = Math.max(8, spacing)
        const R = Math.max(1, radius)
        const R2 = R * R
        // Max positional offset (px) a dot is pulled toward the cursor at peak influence.
        const MAX_OFFSET = (Math.max(1, Math.min(10, strength)) / 10) * 26
        const EASE = 0.12 // how fast dots ease toward their mouse target / back home

        // Base colors resolved once
        const dotRgb = hexToRgb(dotColor)
        const lineRgb = hexToRgb(lineColor)
        const okRgb = hexToRgb(okColor)
        const badRgb = hexToRgb(badColor)

        let W = 1
        let H = 1
        let cols: { hx: number; hy: number; x: number; y: number; vx: number; vy: number }[][] = []
        let dots: { hx: number; hy: number; x: number; y: number; vx: number; vy: number }[] = []

        const build = (mw?: number, mh?: number) => {
            W = Math.max(1, Math.floor(mw ?? window.innerWidth))
            H = Math.max(1, Math.floor(mh ?? window.innerHeight))
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.floor(W * dpr)
            canvas.height = Math.floor(H * dpr)
            canvas.style.width = W + "px"
            canvas.style.height = H + "px"
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            cols = []
            dots = []
            const nCols = Math.floor(W / GAP) + 2
            const nRows = Math.floor(H / GAP) + 2
            for (let c = 0; c < nCols; c++) {
                const col: typeof dots = []
                for (let rIdx = 0; rIdx < nRows; rIdx++) {
                    const hx = c * GAP
                    const hy = rIdx * GAP
                    const d = { hx, hy, x: hx, y: hy, vx: 0, vy: 0 }
                    col.push(d)
                    dots.push(d)
                }
                cols.push(col)
            }
        }

        build()

        // Static render (accessibility / perf): draw once, no animation, no interaction.
        const drawStatic = () => {
            ctx.clearRect(0, 0, W, H)
            for (let c = 0; c < cols.length; c++) {
                for (let rIdx = 0; rIdx < cols[c].length; rIdx++) {
                    const d = cols[c][rIdx]
                    const right = cols[c + 1]?.[rIdx]
                    const down = cols[c]?.[rIdx + 1]
                    ctx.globalAlpha = 0.06
                    ctx.strokeStyle = lineColor
                    ctx.lineWidth = 0.5
                    if (right) {
                        ctx.beginPath()
                        ctx.moveTo(d.x, d.y)
                        ctx.lineTo(right.x, right.y)
                        ctx.stroke()
                    }
                    if (down) {
                        ctx.beginPath()
                        ctx.moveTo(d.x, d.y)
                        ctx.lineTo(down.x, down.y)
                        ctx.stroke()
                    }
                }
            }
            for (const d of dots) {
                ctx.globalAlpha = 0.22
                ctx.fillStyle = dotColor
                ctx.beginPath()
                ctx.arc(d.x, d.y, 0.8, 0, 2 * Math.PI)
                ctx.fill()
            }
            ctx.globalAlpha = 1
        }

        const ro = typeof ResizeObserver !== "undefined"
            ? new ResizeObserver((entries) => {
                const cr = entries[0]?.contentRect
                build(cr?.width, cr?.height)
                if (reduceMotion) drawStatic()
            })
            : null
        ro?.observe(host)

        if (reduceMotion) {
            drawStatic()
            return () => {
                ro?.disconnect()
            }
        }

        const setMouse = (clientX: number, clientY: number) => {
            const r = canvas.getBoundingClientRect()
            const mx = clientX - r.left
            const my = clientY - r.top
            mouseRef.current.x = mx
            mouseRef.current.y = my
            mouseRef.current.active = true
            const now = performance.now()
            const tr = trailRef.current
            tr.push({ x: mx, y: my, t: now })
            if (tr.length > 80) tr.shift()
        }

        const onMove = (e: MouseEvent) => setMouse(e.clientX, e.clientY)
        const onLeave = () => {
            mouseRef.current.active = false
            mouseRef.current.x = -9999
            mouseRef.current.y = -9999
        }
        const onTouch = (e: TouchEvent) => {
            const t = e.touches[0]
            if (t) setMouse(t.clientX, t.clientY)
        }
        const onClick = (e: MouseEvent) => {
            if (!clickEffects) return
            const r = canvas.getBoundingClientRect()
            const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
            const rip = ripplesRef.current
            rip.push({
                x: e.clientX - r.left,
                y: e.clientY - r.top,
                t0: performance.now(),
                tone: msg.tone,
                text: msg.text,
            })
            if (rip.length > MAX_RIPPLES) rip.shift()
        }

        // Écoute globale sur la fenêtre pour capter la souris à travers tout le site
        window.addEventListener("mousemove", onMove)
        window.addEventListener("mouseleave", onLeave)
        window.addEventListener("touchmove", onTouch, { passive: true })
        window.addEventListener("touchend", onLeave)
        window.addEventListener("click", onClick)

        let raf = 0
        const frame = () => {
            const m = mouseRef.current
            const now = performance.now()
            ctx.clearRect(0, 0, W, H)

            // Purge dead ripples
            const rip = ripplesRef.current
            for (let i = rip.length - 1; i >= 0; i--) {
                if (now - rip[i].t0 > WAVE_LIFE) rip.splice(i, 1)
            }

            // Single pass: physics + lines + dots
            for (let c = 0; c < cols.length; c++) {
                const col = cols[c]
                const nextCol = cols[c + 1]
                for (let rIdx = 0; rIdx < col.length; rIdx++) {
                    const d = col[rIdx]

                    // --- physics ---
                    // Mouse influence is a STABLE positional target computed from the
                    // point's HOME (not its current position), so it never feeds back
                    // on itself → no spring oscillation near the cursor.
                    let tx = d.hx
                    let ty = d.hy
                    let prox = 0
                    if (m.active) {
                        const dx = m.x - d.hx
                        const dy = m.y - d.hy
                        const distSq = dx * dx + dy * dy
                        if (distSq < R2) {
                            const dist = Math.sqrt(distSq) || 0.001
                            const t = 1 - dist / R
                            prox = t
                            // magnitude peaks mid-range, →0 at center and at R (t*t falloff)
                            const mag = t * t * MAX_OFFSET
                            tx = d.hx + (dx / dist) * mag
                            ty = d.hy + (dy / dist) * mag
                        }
                    }

                    // ripple impulse accumulates as velocity (a real shockwave that decays)
                    let ax = 0
                    let ay = 0
                    let rippleActive = false

                    // ripple push + local tint accumulation
                    let tintT = 0
                    let tintRgb: [number, number, number] = okRgb
                    for (let k = 0; k < rip.length; k++) {
                        const w = rip[k]
                        const age = now - w.t0
                        const life = 1 - age / WAVE_LIFE
                        const frontR = age * WAVE_SPEED
                        const dx = d.x - w.x
                        const dy = d.y - w.y
                        const dist = Math.sqrt(dx * dx + dy * dy)
                        const bandDelta = Math.abs(dist - frontR)
                        if (bandDelta < WAVE_BAND) {
                            const bandF = (1 - bandDelta / WAVE_BAND) * life
                            if (dist > 0.001) {
                                const f = bandF * WAVE_PUSH
                                ax += (dx / dist) * f
                                ay += (dy / dist) * f
                                rippleActive = true
                            }
                            // local tint: strongest near the front, fades with age
                            if (bandF > tintT) {
                                tintT = bandF
                                tintRgb = w.tone === "ok" ? okRgb : badRgb
                            }
                        }
                    }

                    // Ripple velocity (damped) — the shockwave part.
                    d.vx = (d.vx + ax) * 0.82
                    d.vy = (d.vy + ay) * 0.82

                    // Move toward the mouse target with a smooth lerp, then apply
                    // the ripple velocity on top. The lerp is critically stable:
                    // when the target equals home, the point settles without overshoot.
                    d.x += (tx - d.x) * EASE + d.vx
                    d.y += (ty - d.y) * EASE + d.vy

                    // Sleep: when the target is home (no mouse influence), no ripple,
                    // and the point is essentially at rest, snap it exactly home so
                    // there is zero residual jitter.
                    if (prox === 0 && !rippleActive &&
                        Math.abs(d.vx) < SLEEP && Math.abs(d.vy) < SLEEP &&
                        Math.abs(d.x - d.hx) < SLEEP && Math.abs(d.y - d.hy) < SLEEP) {
                        d.x = d.hx
                        d.y = d.hy
                        d.vx = 0
                        d.vy = 0
                    }

                    // --- draw lines to right/down neighbors ---
                    const right = nextCol?.[rIdx]
                    const down = col[rIdx + 1]
                    const lineC = tintT > 0 ? mixRgb(lineRgb, tintRgb, Math.min(1, tintT)) : lineColor
                    const alpha = 0.06 + prox * 0.7 + tintT * 0.5
                    const lw = 0.5 + prox * 1.5 + tintT * 1.2
                    if (right) {
                        ctx.globalAlpha = Math.min(1, alpha)
                        ctx.strokeStyle = lineC
                        ctx.lineWidth = lw
                        ctx.beginPath()
                        ctx.moveTo(d.x, d.y)
                        ctx.lineTo(right.x, right.y)
                        ctx.stroke()
                    }
                    if (down) {
                        ctx.globalAlpha = Math.min(1, alpha)
                        ctx.strokeStyle = lineC
                        ctx.lineWidth = lw
                        ctx.beginPath()
                        ctx.moveTo(d.x, d.y)
                        ctx.lineTo(down.x, down.y)
                        ctx.stroke()
                    }

                    // --- draw dot ---
                    const dotC = tintT > 0 ? mixRgb(dotRgb, tintRgb, Math.min(1, tintT)) : dotColor
                    ctx.globalAlpha = Math.min(1, 0.22 + prox * 0.78 + tintT * 0.6)
                    ctx.fillStyle = dotC
                    ctx.beginPath()
                    ctx.arc(d.x, d.y, 0.8 + prox * 2.2 + tintT * 1.4, 0, 2 * Math.PI)
                    ctx.fill()
                }
            }

            // Mouse trail
            if (trail) {
                const tr = trailRef.current
                ctx.lineCap = "round"
                ctx.lineJoin = "round"
                for (let i = 1; i < tr.length; i++) {
                    const a = tr[i - 1]
                    const b = tr[i]
                    const age = now - b.t
                    if (age > 260) continue
                    ctx.globalAlpha = Math.max(0, 1 - age / 260) * 0.85
                    ctx.strokeStyle = trailColor
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.stroke()
                }
            }

            // Ripple visuals: expanding circles + label
            for (let k = 0; k < rip.length; k++) {
                const w = rip[k]
                const age = now - w.t0
                const life = 1 - age / WAVE_LIFE
                if (life <= 0) continue
                const frontR = age * WAVE_SPEED
                const col = w.tone === "ok" ? okColor : badColor

                // concentric ring(s)
                ctx.strokeStyle = col
                ctx.globalAlpha = life * 0.5
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.arc(w.x, w.y, frontR, 0, 2 * Math.PI)
                ctx.stroke()
                ctx.globalAlpha = life * 0.25
                ctx.beginPath()
                ctx.arc(w.x, w.y, frontR * 0.6, 0, 2 * Math.PI)
                ctx.stroke()

                // label: fade out + rise
                ctx.globalAlpha = life
                ctx.fillStyle = col
                ctx.font = "600 14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(w.text, w.x, w.y - 18 - (1 - life) * 24)
            }

            ctx.globalAlpha = 1
            raf = requestAnimationFrame(frame)
        }
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            ro?.disconnect()
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mouseleave", onLeave)
            window.removeEventListener("touchmove", onTouch)
            window.removeEventListener("touchend", onLeave)
            window.removeEventListener("click", onClick)
        }
    }, [background, dotColor, lineColor, trailColor, spacing, radius, strength, trail, okColor, badColor, clickEffects, isStatic])

    return (
        <div
            ref={hostRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background,
                pointerEvents: "none", // Indispensable pour cliquer à travers le fond sur le reste du site
                zIndex: 0,
                ...(props.style || {}),
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            />
        </div>
    )
}
