import { useEffect, useRef, type CSSProperties } from "react"

interface InteractiveBackgroundProps {
    background?: string
    okColor?: string
    badColor?: string
    style?: CSSProperties
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

// Click effect tuning
const RIPPLE_LIFE = 1300   // ms lifetime of a ripple
const RIPPLE_SPEED = 0.6   // px per ms → front radius = age * RIPPLE_SPEED
const MAX_RIPPLES = 8

export default function InteractiveBackground(props: InteractiveBackgroundProps) {
    const {
        background = "#111827",
        okColor = "#22c55e",
        badColor = "#ef4444",
    } = props

    const hostRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ripplesRef = useRef<{ x: number; y: number; t0: number; tone: Tone; text: string }[]>([])

    useEffect(() => {
        const host = hostRef.current
        const canvas = canvasRef.current
        if (!host || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

        const DPR = Math.min(window.devicePixelRatio || 1, 2)
        let W = 1
        let H = 1

        const build = () => {
            W = Math.max(1, window.innerWidth)
            H = Math.max(1, window.innerHeight)
            canvas.width = Math.floor(W * DPR)
            canvas.height = Math.floor(H * DPR)
            canvas.style.width = W + "px"
            canvas.style.height = H + "px"
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
            ctx.clearRect(0, 0, W, H)
        }
        build()

        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(build) : null
        ro?.observe(host)

        const onClick = (e: MouseEvent) => {
            if (reduceMotion) return
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
        window.addEventListener("click", onClick)

        if (reduceMotion) {
            return () => {
                ro?.disconnect()
                window.removeEventListener("click", onClick)
            }
        }

        let raf = 0
        const frame = () => {
            const now = performance.now()
            const rip = ripplesRef.current
            ctx.clearRect(0, 0, W, H)

            for (let k = rip.length - 1; k >= 0; k--) {
                const w = rip[k]
                const age = now - w.t0
                const life = 1 - age / RIPPLE_LIFE
                if (life <= 0) {
                    rip.splice(k, 1)
                    continue
                }
                const frontR = age * RIPPLE_SPEED
                const col = w.tone === "ok" ? okColor : badColor

                // concentric rings
                ctx.strokeStyle = col
                ctx.lineWidth = 1.5
                ctx.globalAlpha = life * 0.5
                ctx.beginPath()
                ctx.arc(w.x, w.y, frontR, 0, 2 * Math.PI)
                ctx.stroke()
                ctx.globalAlpha = life * 0.25
                ctx.beginPath()
                ctx.arc(w.x, w.y, frontR * 0.6, 0, 2 * Math.PI)
                ctx.stroke()

                // label: fades out + rises
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
            window.removeEventListener("click", onClick)
        }
    }, [background, okColor, badColor])

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
                pointerEvents: "none", // clic à travers vers le reste du site
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