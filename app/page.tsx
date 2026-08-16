"use client";

import { useMemo, useState } from "react";

type Stage = "welcome" | "question-one" | "question-two" | "schedule" | "confirmed" | "declined";

const appointments = [
  { time: "11:00 PM", note: "early-bird shrimp special" },
  { time: "12:00 AM", note: "midnight mischief" },
  { time: "1:00 AM", note: "after-hours edition" },
  { time: "2:00 AM", note: "questionable o’clock" },
  { time: "3:00 AM", note: "night-owl deluxe" },
  { time: "4:00 AM", note: "technically breakfast" },
];

const declineCopy = [
  {
    eyebrow: "tiny follow-up question",
    title: "r u sure?",
    body: "The shrimp has hydrated and everything.",
    yes: "Okay, continue",
    no: "Yep, rain check",
  },
  {
    eyebrow: "one last shrimp inquiry",
    title: "r u positive?",
    body: "He even found his fancy bow tie.",
    yes: "Fine, show me the times",
    no: "Positive.",
  },
  {
    eyebrow: "last check, promise",
    title: "Final answer?",
    body: "No guilt, no negotiations—the shrimp respects a boundary.",
    yes: "Actually, show me the times",
    no: "Not tonight",
  },
];

function Shrimp({ size, leaving = false }: { size: number; leaving?: boolean }) {
  return (
    <div
      className={`shrimp-wrap ${leaving ? "shrimp-leaving" : ""}`}
      style={{ "--shrimp-scale": size } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="shrimp-shadow" />
      <div className="shrimp">
        <div className="shrimp-tail shrimp-tail-back" />
        <div className="shrimp-tail shrimp-tail-front" />
        <div className="shrimp-body">
          <span className="shrimp-stripe stripe-one" />
          <span className="shrimp-stripe stripe-two" />
          <span className="shrimp-stripe stripe-three" />
        </div>
        <div className="shrimp-head">
          <span className="shrimp-eye eye-left" />
          <span className="shrimp-eye eye-right" />
          <span className="shrimp-smile" />
          <span className="shrimp-blush" />
          <span className="shrimp-bow"><i /></span>
        </div>
        <span className="antenna antenna-one" />
        <span className="antenna antenna-two" />
        <span className="shrimp-leg leg-one" />
        <span className="shrimp-leg leg-two" />
        <span className="shrimp-leg leg-three" />
      </div>
      <span className="sparkle sparkle-one">✦</span>
      <span className="sparkle sparkle-two">✦</span>
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [selectedTime, setSelectedTime] = useState("");
  const [declineStep, setDeclineStep] = useState<number | null>(null);
  const [returnStage, setReturnStage] = useState<Stage>("question-two");
  const [copied, setCopied] = useState(false);

  const shrimpSize = useMemo(() => {
    if (stage === "welcome") return 0.72;
    if (declineStep !== null) return Math.max(0.34, 0.82 - declineStep * 0.2);
    if (stage === "question-one") return 0.82;
    if (stage === "question-two") return 0.98;
    if (stage === "schedule") return 1.14;
    if (stage === "confirmed") return 1.3;
    return 0.2;
  }, [stage, declineStep]);

  const progress = stage === "welcome" ? 0 : stage === "question-one" ? 1 : stage === "question-two" ? 2 : stage === "schedule" ? 3 : 4;

  function startDecline(nextStage: Stage) {
    setReturnStage(nextStage);
    setDeclineStep(0);
  }

  function reconsider() {
    setDeclineStep(null);
    setStage(returnStage === "question-two" ? "question-two" : "schedule");
  }

  function continueDecline() {
    if (declineStep === null) return;
    if (declineStep < declineCopy.length - 1) {
      setDeclineStep(declineStep + 1);
      return;
    }
    setDeclineStep(null);
    setStage("declined");
  }

  async function shareAppointment() {
    const text = `Official notice: I’m requesting the ${selectedTime} shrimp appointment. Final confirmation pending 🦐🌻`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Shrimp appointment request", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Closing the share sheet should leave the confirmation undisturbed.
    }
  }

  function reset() {
    setStage("welcome");
    setSelectedTime("");
    setDeclineStep(null);
    setCopied(false);
  }

  const currentDecline = declineStep === null ? null : declineCopy[declineStep];

  return (
    <main className="site-shell">
      <div className="sunflower-field" aria-hidden="true">
        <span className="flower flower-one">🌻</span>
        <span className="flower flower-two">🌻</span>
        <span className="flower flower-three">🌻</span>
        <span className="flower flower-four">🌻</span>
      </div>

      <section className="invitation-card" aria-live="polite">
        <div className="tape tape-left" aria-hidden="true" />
        <div className="tape tape-right" aria-hidden="true" />

        <header className="card-header">
          <div className="brand-mark"><span>🦐</span> S.A.O.</div>
          <div className="official-stamp">highly<br />official</div>
        </header>

        <div className="progress-dots" aria-label={`Step ${progress} of 4`}>
          {[1, 2, 3, 4].map((step) => (
            <span key={step} className={progress >= step ? "dot active" : "dot"} />
          ))}
        </div>

        <div className="content-grid">
          <div className="shrimp-stage">
            <div className="sunburst" />
            <Shrimp size={shrimpSize} leaving={stage === "declined"} />
            <div className="growth-label">
              <span>{stage === "declined" ? "boundary respected" : "shrimp confidence"}</span>
              <div className="meter"><i style={{ width: `${Math.min(shrimpSize / 1.3, 1) * 100}%` }} /></div>
            </div>
          </div>

          <div className="question-panel">
            {currentDecline ? (
              <>
                <p className="eyebrow">{currentDecline.eyebrow}</p>
                <h1>{currentDecline.title}</h1>
                <p className="lede">{currentDecline.body}</p>
                <div className="button-stack">
                  <button className="primary-button" onClick={reconsider}>{currentDecline.yes}<span>→</span></button>
                  <button className="text-button" onClick={continueDecline}>{currentDecline.no}</button>
                </div>
              </>
            ) : stage === "welcome" ? (
              <>
                <p className="eyebrow">a private invitation for Teddy Monster</p>
                <h1>The Official <em>Shrimp</em> Appointment Office</h1>
                <p className="lede">A tiny proposal with potentially large consequences.</p>
                <button className="primary-button" onClick={() => setStage("question-one")}>Begin application <span>🦐</span></button>
                <p className="fine-print">Cute invitation. Zero pressure. Sober applicants preferred.</p>
              </>
            ) : stage === "question-one" ? (
              <>
                <p className="eyebrow">question 01 · tonight’s agenda</p>
                <h1>Want to see me again tonight?</h1>
                <p className="lede">The shrimp would like one chance at a sober comeback.</p>
                <div className="button-stack">
                  <button className="primary-button" onClick={() => setStage("question-two")}>Yes, I’m intrigued <span>→</span></button>
                  <button className="text-button" onClick={() => startDecline("question-two")}>Not tonight</button>
                </div>
              </>
            ) : stage === "question-two" ? (
              <>
                <p className="eyebrow">question 02 · the comeback</p>
                <h1>Are you gonna let sober me show you what I can actually do?</h1>
                <p className="lede">Confidence: growing. Consent: still mandatory.</p>
                <div className="button-stack">
                  <button className="primary-button" onClick={() => setStage("schedule")}>Schedule the comeback <span>→</span></button>
                  <button className="text-button" onClick={() => startDecline("schedule")}>Rain check</button>
                </div>
              </>
            ) : stage === "schedule" ? (
              <>
                <p className="eyebrow">final step · choose wisely</p>
                <h1>Pick your shrimp appointment</h1>
                <p className="lede schedule-lede">Tonight, anytime after 10-ish.</p>
                <div className="time-grid" role="radiogroup" aria-label="Appointment time">
                  {appointments.map((appointment) => (
                    <button
                      key={appointment.time}
                      className={selectedTime === appointment.time ? "time-card selected" : "time-card"}
                      onClick={() => setSelectedTime(appointment.time)}
                      role="radio"
                      aria-checked={selectedTime === appointment.time}
                    >
                      <strong>{appointment.time}</strong>
                      <span>{appointment.note}</span>
                    </button>
                  ))}
                </div>
                <button className="primary-button confirm-button" disabled={!selectedTime} onClick={() => setStage("confirmed")}>Request {selectedTime || "a time"} <span>→</span></button>
                <button className="text-button" onClick={() => startDecline("schedule")}>Not tonight after all</button>
              </>
            ) : stage === "confirmed" ? (
              <>
                <p className="eyebrow">request received · allegedly</p>
                <h1>Shrimp appointment requested!</h1>
                <div className="ticket">
                  <span>Tonight at</span>
                  <strong>{selectedTime}</strong>
                  <small>🦐 + 🌻 · sober comeback edition</small>
                </div>
                <p className="lede confirmation-copy">Final details by text. This books a meetup—not consent to anything. Either of us can change our mind.</p>
                <button className="primary-button" onClick={shareAppointment}>{copied ? "Copied!" : "Send the verdict"} <span>↗</span></button>
                <button className="text-button" onClick={reset}>Start over</button>
              </>
            ) : (
              <>
                <p className="eyebrow">application closed · no hard feelings</p>
                <h1>The shrimp has respectfully returned to the sea.</h1>
                <p className="lede">No appointment tonight. Sleep well, Teddy Monster 🌙</p>
                <button className="secondary-button" onClick={reset}>Maybe another night</button>
              </>
            )}
          </div>
        </div>

        <footer className="card-footer">
          <span>Est. after one unfortunate evening</span>
          <span>🌻 · 🦐 · 💗</span>
        </footer>
      </section>
    </main>
  );
}
