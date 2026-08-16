"use client";

import { useMemo, useState } from "react";

type Stage = "welcome" | "question-one" | "question-two" | "schedule" | "reward" | "confirmed" | "declined";

const appointments = [
  { time: "11:00 PM", note: "EARLY BIRD BONUS" },
  { time: "12:00 AM", note: "MIDNIGHT MODE" },
  { time: "1:00 AM", note: "AFTER HOURS" },
  { time: "2:00 AM", note: "CHAOS O’CLOCK" },
  { time: "3:00 AM", note: "NIGHT OWL MODE" },
  { time: "4:00 AM", note: "BREAKFAST DLC" },
];

const foodChoices = [
  { name: "Pizza", image: "/sprites/pizza.png", note: "CHEESE POWER-UP" },
  { name: "Nuggets & fries", image: "/sprites/nuggets-fries.png", note: "CRUNCH COMBO" },
  { name: "Kebab / HSP", image: "/sprites/hsp.png", note: "GREASE MODE" },
  { name: "Dealer’s choice", image: "/sprites/mystery.png", note: "MYSTERY DROP" },
];

const declineCopy = [
  {
    eyebrow: "PAUSE SCREEN",
    title: "r u sure?",
    body: "The shrimp hydrated and packed snacks.",
    yes: "CONTINUE GAME",
    no: "YES, EXIT",
  },
  {
    eyebrow: "CONFIRM EXIT",
    title: "r u positive?",
    body: "Even the tiny bow tie is equipped.",
    yes: "OKAY, SHOW TIMES",
    no: "POSITIVE",
  },
  {
    eyebrow: "FINAL CHECK",
    title: "Final answer?",
    body: "No penalty. No guilt. The shrimp respects the quit button.",
    yes: "BACK TO GAME",
    no: "QUIT FOR TONIGHT",
  },
];

const stageNames: Record<Stage, string> = {
  welcome: "START",
  "question-one": "ROUND 01",
  "question-two": "ROUND 02",
  schedule: "TIME SELECT",
  reward: "BONUS ROUND",
  confirmed: "MISSION CLEAR",
  declined: "GAME OVER",
};

function PixelSunflower() {
  return (
    <span className="pixel-sunflower" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, index) => <i key={index} />)}
      <b />
    </span>
  );
}

function ShrimpSprite({ size, leaving = false }: { size: number; leaving?: boolean }) {
  return (
    <div
      className={`sprite-wrap ${leaving ? "sprite-leaving" : ""}`}
      style={{ "--sprite-scale": size } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="sprite-spark spark-a" />
      <span className="sprite-spark spark-b" />
      <span className="sprite-spark spark-c" />
      <img className="pixel-shrimp" src="/sprites/shrimp.png" alt="" />
      <span className="sprite-shadow" />
    </div>
  );
}

function ArcadeButton({
  children,
  variant = "pink",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "pink" | "blue" | "cream" }) {
  return (
    <button className={`arcade-button arcade-button--${variant} ${className}`} {...props}>
      <span>{children}</span>
    </button>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [declineStep, setDeclineStep] = useState<number | null>(null);
  const [returnStage, setReturnStage] = useState<Stage>("question-two");
  const [copied, setCopied] = useState(false);

  const shrimpSize = useMemo(() => {
    if (stage === "welcome") return 0.72;
    if (declineStep !== null) return [0.62, 0.48, 0.34][declineStep] ?? 0.34;
    if (stage === "question-one") return 0.82;
    if (stage === "question-two") return 0.94;
    if (stage === "schedule") return 1.04;
    if (stage === "reward") return 1.12;
    if (stage === "confirmed") return 1.2;
    return 0.28;
  }, [stage, declineStep]);

  const progress = stage === "welcome" ? 0 : stage === "question-one" ? 1 : stage === "question-two" ? 2 : stage === "schedule" ? 3 : stage === "reward" ? 4 : 5;
  const currentDecline = declineStep === null ? null : declineCopy[declineStep];
  const selectedFoodData = foodChoices.find((food) => food.name === selectedFood);

  function startDecline(nextStage: Stage) {
    setReturnStage(nextStage);
    setDeclineStep(0);
  }

  function reconsider() {
    setDeclineStep(null);
    setStage(returnStage);
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
    const text = `MISSION ACCEPTED: Shrimp Redemption at ${selectedTime}. Food bonus: ${selectedFood}. $6 Aldi wine is benched tonight. This is a meetup request—final details by text. Reply CONFIRMED 🦐🎮`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Shrimp Redemption", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Closing the native share sheet should leave the game state untouched.
    }
  }

  function reset() {
    setStage("welcome");
    setSelectedTime("");
    setSelectedFood("");
    setDeclineStep(null);
    setCopied(false);
  }

  return (
    <main className="arcade-room">
      <div className="room-grid" aria-hidden="true" />
      <div className="ambient-pixels" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>

      <section className="arcade-cabinet" aria-live="polite">
        <div className="cabinet-rail cabinet-rail--left" aria-hidden="true" />
        <div className="cabinet-rail cabinet-rail--right" aria-hidden="true" />

        <header className="marquee">
          <span className="marquee-kicker">LATE NIGHT ARCADE · ONE PLAYER INVITED</span>
          <div className="marquee-title">SHRIMP<span>.EXE</span></div>
          <span className="marquee-status"><i /> ONLINE</span>
        </header>

        <div className="sticker sticker--level" aria-hidden="true">LEVEL<br />UP!</div>
        <div className="sticker sticker--sunflower" aria-hidden="true"><PixelSunflower /></div>
        <div className="sticker sticker--dlc" aria-hidden="true">FOOD<br />DLC</div>

        <div className="screen-bezel">
          <div className="crt-screen">
            <div className="scanlines" aria-hidden="true" />
            <div className="crt-glare" aria-hidden="true" />

            <header className="game-hud">
              <div className="hud-block">
                <span>STATUS</span>
                <strong>{declineStep !== null ? declineCopy[declineStep].eyebrow : stageNames[stage]}</strong>
              </div>
              <div className="hud-power">
                <span>{stage === "declined" ? "BOUNDARY SAVED" : "SHRIMP POWER"}</span>
                <div className="power-track"><i style={{ width: `${Math.min(shrimpSize / 1.2, 1) * 100}%` }} /></div>
              </div>
              <div className="wine-chip"><span>●</span> $6 WINE MODE: PAUSED</div>
            </header>

            <div className="game-layout">
              <div className="sprite-bay">
                <div className="sprite-grid" aria-hidden="true" />
                <span className="coin coin--one" aria-hidden="true">+</span>
                <span className="coin coin--two" aria-hidden="true">★</span>
                <ShrimpSprite size={shrimpSize} leaving={stage === "declined"} />
                <div className="sprite-platform" aria-hidden="true"><i /><i /><i /><i /><i /></div>
                <div className="player-label"><span>P1</span> SOBER SHRIMP</div>
              </div>

              <section className={`dialog-box dialog-box--${stage}`}>
                {currentDecline ? (
                  <>
                    <p className="game-eyebrow">{currentDecline.eyebrow}</p>
                    <h1>{currentDecline.title}</h1>
                    <p className="game-lede">{currentDecline.body}</p>
                    <div className="game-actions">
                      <ArcadeButton onClick={reconsider}>{currentDecline.yes}</ArcadeButton>
                      <ArcadeButton variant="blue" onClick={continueDecline}>{currentDecline.no}</ArcadeButton>
                    </div>
                  </>
                ) : stage === "welcome" ? (
                  <>
                    <p className="game-eyebrow">PLAYER 2 HAS ENTERED</p>
                    <h1>SHRIMP REDEMPTION:<br /><em>PRESS START</em></h1>
                    <p className="game-lede">One sober comeback. One tiny hero. Snacks included.</p>
                    <div className="game-actions">
                      <ArcadeButton onClick={() => setStage("question-one")}>PRESS START</ArcadeButton>
                    </div>
                    <p className="game-fineprint">NO PRESSURE · NO WEIRDNESS · ALDI’S $6 FINEST GETS THE NIGHT OFF</p>
                  </>
                ) : stage === "question-one" ? (
                  <>
                    <p className="game-eyebrow">LEVEL 01 · REMATCH?</p>
                    <h1>Wanna see me again tonight?</h1>
                    <p className="game-lede">Sober mode is unlocked. Snacks are loaded.</p>
                    <div className="game-actions">
                      <ArcadeButton onClick={() => setStage("question-two")}>YES — CONTINUE</ArcadeButton>
                      <ArcadeButton variant="blue" onClick={() => startDecline("question-two")}>NO — EXIT</ArcadeButton>
                    </div>
                  </>
                ) : stage === "question-two" ? (
                  <>
                    <p className="game-eyebrow">LEVEL 02 · CONFIDENCE CHECK</p>
                    <h1>Let sober me show you what I can actually do?</h1>
                    <p className="game-lede">Shrimp power: rising. Consent: required at every level.</p>
                    <div className="game-actions">
                      <ArcadeButton onClick={() => setStage("schedule")}>UNLOCK TIMES</ArcadeButton>
                      <ArcadeButton variant="blue" onClick={() => startDecline("schedule")}>RAIN CHECK</ArcadeButton>
                    </div>
                  </>
                ) : stage === "schedule" ? (
                  <>
                    <p className="game-eyebrow">LEVEL 03 · SELECT A TIME</p>
                    <h1>Choose your shrimp appointment</h1>
                    <p className="game-lede compact-lede">Tonight’s slots: 11 PM–4 AM. Food bonus unlocks next.</p>
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
                          <small>{appointment.note}</small>
                        </button>
                      ))}
                    </div>
                    <ArcadeButton className="full-button" disabled={!selectedTime} onClick={() => setStage("reward")}>NEXT: FOOD BONUS</ArcadeButton>
                    <button className="quit-link" onClick={() => startDecline("schedule")}>EXIT FOR TONIGHT</button>
                  </>
                ) : stage === "reward" ? (
                  <>
                    <p className="game-eyebrow">BONUS ROUND · PICK YOUR LOOT</p>
                    <h1>What food am I bringing?</h1>
                    <p className="game-lede compact-lede">One late-night meal is included with your booking.</p>
                    <div className="food-grid" role="radiogroup" aria-label="Food incentive">
                      {foodChoices.map((food) => (
                        <button
                          key={food.name}
                          className={selectedFood === food.name ? "food-card selected" : "food-card"}
                          onClick={() => setSelectedFood(food.name)}
                          role="radio"
                          aria-checked={selectedFood === food.name}
                        >
                          <img src={food.image} alt="" />
                          <span><strong>{food.name}</strong><small>{food.note}</small></span>
                        </button>
                      ))}
                    </div>
                    <div className="mini-status"><i /> $6 ALDI WINE: BENCHED · WATER + FOOD ARE P1</div>
                    <ArcadeButton className="full-button" disabled={!selectedFood} onClick={() => setStage("confirmed")}>CONFIRM BOOKING</ArcadeButton>
                    <button className="quit-link" onClick={() => setStage("schedule")}>CHANGE TIME</button>
                  </>
                ) : stage === "confirmed" ? (
                  <>
                    <p className="game-eyebrow">MISSION ACCEPTED</p>
                    <h1>DICK APPOINTMENT REQUESTED</h1>
                    <div className="pixel-receipt">
                      <div><span>TONIGHT</span><strong>{selectedTime}</strong></div>
                      <div className="receipt-food">
                        {selectedFoodData && <img src={selectedFoodData.image} alt="" />}
                        <span><small>FOOD BONUS</small><b>{selectedFood}</b></span>
                      </div>
                      <i>BOOKING SAVED // FINAL CONFIRMATION BY TEXT</i>
                    </div>
                    <p className="game-lede receipt-note">This books a hangout, not consent. Either player can change their mind anytime.</p>
                    <div className="game-actions">
                      <ArcadeButton onClick={shareAppointment}>{copied ? "COPIED!" : "SEND RECEIPT"}</ArcadeButton>
                      <ArcadeButton variant="blue" onClick={reset}>PLAY AGAIN</ArcadeButton>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="game-eyebrow">GAME OVER · NO HARD FEELINGS</p>
                    <h1>The shrimp has left the lobby.</h1>
                    <p className="game-lede">No appointment tonight. Sleep well 🌙</p>
                    <div className="game-actions">
                      <ArcadeButton variant="blue" onClick={reset}>PLAY ANOTHER NIGHT</ArcadeButton>
                    </div>
                  </>
                )}
              </section>
            </div>
          </div>
        </div>

        <div className="control-deck" aria-hidden="true">
          <div className="d-pad"><i className="d-up" /><i className="d-right" /><i className="d-down" /><i className="d-left" /><b /></div>
          <div className="level-progress">
            <span>LEVEL PROGRESS</span>
            <div>{[1, 2, 3, 4, 5].map((step) => <i key={step} className={progress >= step ? "lit" : ""} />)}</div>
          </div>
          <div className="deck-buttons"><i /><i /></div>
        </div>

        <footer className="cabinet-footer">
          <span>© SHRIMP ARCADE 2026</span>
          <strong>SOBER MODE · SNACKS LOADED · CONSENT ALWAYS</strong>
          <span>1 COIN = 1 CHANCE</span>
        </footer>
      </section>
    </main>
  );
}
