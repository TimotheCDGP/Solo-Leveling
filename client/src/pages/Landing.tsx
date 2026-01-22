"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Zap } from "lucide-react"
import "@/styles/landing-animation.scss"
import { ModeToggle } from "@/components/dashboard/mode-toggle"

const GLITCH_WORDS = [
  { word: "La Passion", sub: "L'éveil commence par un désir ardent." },
  { word: "La Puissance", sub: "Chaque niveau franchi forge votre légende." },
  { word: "Le Système", sub: "Une interface unique pour votre ascension." },
  { word: "Le Destin", sub: "Devenez le Monarque de votre propre vie." }
]

export default function Landing() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GLITCH_WORDS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing-cyber">
      <nav className="cyber-nav">
        <div className="logo">
          <Zap className="text-[--brand] fill-[--brand]/20 size-7" />
          <span className="tracking-tighter italic">HUNTER LEVELING</span>
        </div>
        <div className="nav-actions">
          <ModeToggle />
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/register" className="nav-item register-btn">Commencer</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="controls">
          <Link to="/register">
            <button className="btn-custom">Rejoins nous pour</button>
          </Link>
          <div className="glitch-container mt-8">
            <h1 key={GLITCH_WORDS[index].word}>{GLITCH_WORDS[index].word}</h1>
            <p className="sub-text animate-in fade-in slide-in-from-left-8 duration-700">
              {GLITCH_WORDS[index].sub}
            </p>
          </div>
        </div>

        <figure>
          <img
            src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/cyber-glitch-effect/images/hero.webp"
            alt="cyber hunter image"
          />
        </figure>
      </section>
    </div>
  )
}