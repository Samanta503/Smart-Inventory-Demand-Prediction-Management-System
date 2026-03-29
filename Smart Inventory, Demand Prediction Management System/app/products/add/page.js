'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineLightBulb,
  HiOutlinePlusCircle,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
  HiOutlineBanknotes,
  HiOutlineArchiveBox,
  HiOutlineDocumentText,
  HiOutlineCodeBracket,
  HiOutlineScale,
  HiOutlineBuildingOffice,
  HiOutlineArrowTrendingUp,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineRocketLaunch,
  HiOutlineChevronRight,
  HiOutlineArrowPath,
  HiOutlineCheckBadge,
  HiOutlineFire,
  HiOutlineEye,
  HiOutlineXMark,
  HiOutlineInformationCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineGlobeAlt,
  HiOutlineArrowTrendingDown,
  HiOutlineBoltSlash,
  HiOutlineBolt,
  HiOutlineBell,
} from 'react-icons/hi2';

/* ─────────────────────────────────────────────
   CSS STYLES — all animations, layouts, interactions
   ───────────────────────────────────────────── */

const globalCSS = `
  /* ===== KEYFRAMES ===== */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-25px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes entranceBlur {
    from { opacity: 0; filter: blur(12px); transform: translateY(18px); }
    to   { opacity: 1; filter: blur(0); transform: translateY(0); }
  }
  @keyframes slideReveal {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
  @keyframes orbDrift1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25%      { transform: translate(60px, -40px) scale(1.1); }
    50%      { transform: translate(-30px, 30px) scale(0.92); }
    75%      { transform: translate(50px, 20px) scale(1.05); }
  }
  @keyframes orbDrift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25%      { transform: translate(-50px, 40px) scale(0.95); }
    50%      { transform: translate(40px, -25px) scale(1.1); }
    75%      { transform: translate(-20px, -40px) scale(1); }
  }
  @keyframes orbDrift3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(40px, 50px) scale(1.06); }
    66%      { transform: translate(-50px, -15px) scale(0.94); }
  }
  @keyframes gradientFlow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes textShine {
    0%   { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.25); opacity: 0.6; }
  }
  @keyframes iconFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-5px) rotate(2deg); }
  }
  @keyframes progressGrow {
    from { width: 0%; }
    to   { width: var(--target-width, 0%); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 15px rgba(59,130,246,0.2); }
    50%      { box-shadow: 0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(139,92,246,0.15); }
  }
  @keyframes successPop {
    0%   { transform: scale(0.5); opacity: 0; }
    50%  { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }
  @keyframes rippleExpand {
    0%   { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(4); opacity: 0; }
  }
  @keyframes cardShine {
    0%   { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes labelFloat {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0); opacity: 0; }
    40%           { transform: scale(1); opacity: 1; }
  }
  @keyframes borderDance {
    0%   { border-color: rgba(59,130,246,0.3); }
    33%  { border-color: rgba(139,92,246,0.3); }
    66%  { border-color: rgba(6,182,212,0.3); }
    100% { border-color: rgba(59,130,246,0.3); }
  }
  @keyframes waveSlide {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes gaugeRotate {
    from { transform: rotate(-90deg); }
    to   { transform: rotate(var(--gauge-angle, -90deg)); }
  }
  @keyframes counterPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.12); }
    100% { transform: scale(1); }
  }
  @keyframes checkmarkDraw {
    0%   { stroke-dashoffset: 50; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes confettiDrop {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(30px) rotate(360deg); opacity: 0; }
  }
  @keyframes stepperPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
    50%      { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
  }
  @keyframes tooltipReveal {
    from { opacity: 0; transform: translateY(5px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes marqueeScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes glowLine {
    0% { left: -40%; opacity: 0; }
    50% { opacity: 1; }
    100% { left: 140%; opacity: 0; }
  }

  /* ===== ROOT ===== */
  .ap-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0a0f1e 0%, #0f172a 30%, #1a1040 60%, #0f172a 100%);
    padding: 1.5rem 2rem 3rem;
    position: relative; overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  }

  /* ===== BACKGROUND ORBS ===== */
  .ap-orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
  .ap-orb-1 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); top: -8%; left: -3%; animation: orbDrift1 28s ease-in-out infinite; }
  .ap-orb-2 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%); top: 50%; right: -6%; animation: orbDrift2 32s ease-in-out infinite; }
  .ap-orb-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%); bottom: -3%; left: 25%; animation: orbDrift3 22s ease-in-out infinite; }

  .ap-content { position: relative; z-index: 2; }
  .anim-entry { animation: entranceBlur 0.6s ease-out both; }

  /* ===== HEADER ===== */
  .ap-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.75rem; padding: 1.5rem 1.75rem;
    background: linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.85) 100%);
    border-radius: 22px; border: 1px solid rgba(59,130,246,0.12);
    backdrop-filter: blur(20px); position: relative; overflow: hidden;
    animation: fadeInDown 0.7s ease-out both;
  }
  .ap-header::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
    background-size: 300% 100%; animation: gradientFlow 4s linear infinite;
  }
  .ap-header-glow {
    position: absolute; top: -50%; left: -30%; width: 200%; height: 200%;
    background: radial-gradient(circle at 25% 25%, rgba(59,130,246,0.06) 0%, transparent 50%);
    pointer-events: none;
  }
  .ap-header-content { position: relative; z-index: 1; }
  .ap-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem; }
  .ap-header-icon {
    width: 46px; height: 46px; border-radius: 13px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.3rem;
    box-shadow: 0 6px 20px rgba(59,130,246,0.4);
    animation: iconFloat 3s ease-in-out infinite;
  }
  .ap-header-title {
    font-size: 1.7rem; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 0%, #94a3b8 50%, #ffffff 100%);
    background-size: 200% auto; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text;
    animation: textShine 4s linear infinite;
  }
  .ap-header-subtitle {
    color: rgba(148,163,184,0.7); font-size: 0.88rem;
    display: flex; align-items: center; gap: 0.5rem; margin-left: 3.75rem;
  }
  .ap-header-right { display: flex; align-items: center; gap: 0.75rem; position: relative; z-index: 1; }
  .ap-back-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.65rem 1.25rem; border-radius: 11px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; font-weight: 600; font-size: 13px;
    text-decoration: none; cursor: pointer;
    transition: all 0.35s cubic-bezier(0.175,0.885,0.32,1.275);
    position: relative; overflow: hidden;
  }
  .ap-back-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    transition: left 0.5s ease;
  }
  .ap-back-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(59,130,246,0.3); color: #e2e8f0; transform: translateX(-3px); }
  .ap-back-btn:hover::before { left: 100%; }
  .ap-back-btn:hover .ap-back-arrow { transform: translateX(-3px); }
  .ap-back-arrow { transition: transform 0.3s ease; display: flex; }

  /* ===== STEPPER ===== */
  .ap-stepper {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-bottom: 1.75rem;
    animation: fadeInUp 0.6s ease-out 0.15s both;
  }
  .ap-step {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.55rem 1rem; border-radius: 10px;
    cursor: pointer; transition: all 0.35s ease;
    position: relative;
  }
  .ap-step:hover { background: rgba(255,255,255,0.04); }
  .ap-step-number {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; border: 2px solid;
    transition: all 0.4s ease; flex-shrink: 0;
  }
  .ap-step-active .ap-step-number {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-color: transparent; color: white;
    animation: stepperPulse 2s ease-in-out infinite;
  }
  .ap-step-done .ap-step-number {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-color: transparent; color: white;
  }
  .ap-step-pending .ap-step-number {
    background: transparent; border-color: rgba(148,163,184,0.3); color: rgba(148,163,184,0.5);
  }
  .ap-step-label { font-size: 12.5px; font-weight: 600; transition: color 0.3s ease; }
  .ap-step-active .ap-step-label { color: #e2e8f0; }
  .ap-step-done .ap-step-label { color: #4ade80; }
  .ap-step-pending .ap-step-label { color: rgba(148,163,184,0.4); }
  .ap-step-line {
    width: 40px; height: 2px; border-radius: 1px; margin: 0 0.25rem;
    transition: background 0.4s ease;
  }
  .ap-step-line-done { background: linear-gradient(90deg, #22c55e, #4ade80); }
  .ap-step-line-active { background: linear-gradient(90deg, #3b82f6, rgba(139,92,246,0.5)); }
  .ap-step-line-pending { background: rgba(148,163,184,0.15); }

  /* ===== ALERTS ===== */
  .ap-alert {
    border-radius: 14px; padding: 1rem 1.25rem;
    margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.65rem;
    font-size: 14px; font-weight: 500; position: relative; overflow: hidden;
  }
  .ap-alert-success {
    background: linear-gradient(135deg, rgba(34,197,94,0.12), rgba(15,23,42,0.85));
    border: 1px solid rgba(34,197,94,0.25); color: #4ade80;
    animation: successPop 0.5s ease-out both;
  }
  .ap-alert-error {
    background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.85));
    border: 1px solid rgba(239,68,68,0.25); color: #f87171;
    animation: errorShake 0.5s ease-out both;
  }
  .ap-alert-icon { flex-shrink: 0; }
  .ap-alert-close {
    margin-left: auto; background: none; border: none; color: inherit;
    cursor: pointer; opacity: 0.6; transition: opacity 0.3s; padding: 0.25rem;
    display: flex; border-radius: 6px;
  }
  .ap-alert-close:hover { opacity: 1; background: rgba(255,255,255,0.06); }
  .ap-confetti {
    position: absolute; width: 6px; height: 6px; border-radius: 2px;
    animation: confettiDrop 1s ease-out both; pointer-events: none;
  }

  /* ===== FORM LAYOUT ===== */
  .ap-form-layout {
    display: grid; grid-template-columns: 1fr 330px;
    gap: 1.5rem; align-items: start;
  }

  /* ===== FORM CARDS ===== */
  .ap-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 20px; padding: 1.5rem;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden;
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
  }
  .ap-card:hover { border-color: rgba(255,255,255,0.09); }
  .ap-card-glow {
    position: absolute; width: 200%; height: 200%;
    pointer-events: none; opacity: 0.5;
    transition: opacity 0.4s ease;
  }
  .ap-card:hover .ap-card-glow { opacity: 0.8; }
  .ap-card-active {
    border-color: rgba(59,130,246,0.2);
    box-shadow: 0 0 30px rgba(59,130,246,0.08);
  }
  .ap-card-shine {
    position: absolute; top: 0; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
    pointer-events: none;
  }
  .ap-card:hover .ap-card-shine { animation: cardShine 1s ease-out both; }

  /* ===== SECTION HEADER ===== */
  .ap-section-header {
    display: flex; align-items: center; gap: 0.65rem;
    margin-bottom: 1.3rem; padding-bottom: 0.9rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative; z-index: 1;
  }
  .ap-section-header::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    width: var(--section-line, 30%); height: 2px; border-radius: 1px;
    transition: width 0.5s ease;
  }
  .ap-card:hover .ap-section-header::after { width: 100%; }
  .ap-section-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.35s ease; flex-shrink: 0;
  }
  .ap-card:hover .ap-section-icon { transform: scale(1.08) rotate(-3deg); }
  .ap-section-title {
    color: #ffffff; font-size: 1rem; font-weight: 700; flex: 1;
  }
  .ap-section-badge {
    padding: 0.2rem 0.6rem; border-radius: 20px;
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ===== FORM ELEMENTS ===== */
  .ap-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; position: relative; z-index: 1; }
  .ap-form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; position: relative; z-index: 1; }
  .ap-form-group { margin-bottom: 1rem; position: relative; z-index: 1; }

  .ap-label {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 11.5px; font-weight: 700; color: rgba(148,163,184,0.85);
    margin-bottom: 0.45rem; text-transform: uppercase; letter-spacing: 0.6px;
    transition: color 0.3s ease;
  }
  .ap-label-icon { color: rgba(148,163,184,0.4); transition: color 0.3s ease; display: flex; }
  .ap-form-group:focus-within .ap-label { color: #60a5fa; }
  .ap-form-group:focus-within .ap-label-icon { color: #3b82f6; }
  .ap-required { color: #f87171; margin-left: 1px; }

  .ap-input, .ap-textarea, .ap-select {
    width: 100%; padding: 0.75rem 1rem; font-size: 14px;
    border-radius: 12px; border: 1.5px solid rgba(59,130,246,0.15);
    background: rgba(15,23,42,0.5); color: #e2e8f0;
    outline: none; transition: all 0.35s ease; font-family: inherit;
    box-sizing: border-box;
  }
  .ap-input::placeholder, .ap-textarea::placeholder {
    color: rgba(148,163,184,0.35);
  }
  .ap-input:hover, .ap-textarea:hover, .ap-select:hover {
    border-color: rgba(59,130,246,0.3);
    background: rgba(15,23,42,0.65);
  }
  .ap-input:focus, .ap-textarea:focus, .ap-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.1), 0 4px 15px rgba(59,130,246,0.1);
    background: rgba(15,23,42,0.7);
  }
  .ap-textarea { resize: vertical; }
  .ap-select { cursor: pointer; }
  .ap-select option { background: #0f172a; }

  .ap-help {
    font-size: 11px; color: rgba(148,163,184,0.45);
    margin-top: 0.35rem; display: flex; align-items: center; gap: 0.3rem;
    animation: labelFloat 0.3s ease-out both;
  }
  .ap-char-count {
    position: absolute; bottom: 0.45rem; right: 0.75rem;
    font-size: 10px; color: rgba(148,163,184,0.3); pointer-events: none;
    font-variant-numeric: tabular-nums;
  }
  .ap-input-wrapper { position: relative; }
  .ap-input-prefix {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    color: rgba(148,163,184,0.4); font-size: 14px; font-weight: 600;
    pointer-events: none; transition: color 0.3s ease;
  }
  .ap-input-wrapper:focus-within .ap-input-prefix { color: #3b82f6; }
  .ap-input-prefixed { padding-left: 1.8rem; }
  .ap-input-valid { border-color: rgba(34,197,94,0.3); }
  .ap-input-invalid { border-color: rgba(239,68,68,0.3); }

  /* ===== LIVE PROFIT STRIP ===== */
  .ap-profit-strip {
    display: flex; gap: 0.75rem; margin-top: 0.5rem;
    position: relative; z-index: 1;
    animation: fadeInUp 0.4s ease-out both;
  }
  .ap-profit-chip {
    flex: 1; padding: 0.7rem 1rem; border-radius: 12px;
    display: flex; align-items: center; gap: 0.5rem;
    transition: all 0.35s ease; position: relative; overflow: hidden;
  }
  .ap-profit-chip:hover { transform: translateY(-2px); }
  .ap-profit-positive {
    background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
  }
  .ap-profit-negative {
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
  }
  .ap-profit-warning {
    background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
  }
  .ap-profit-icon { flex-shrink: 0; display: flex; }
  .ap-profit-text { font-size: 13px; font-weight: 600; }

  /* ===== BUTTONS ===== */
  .ap-btn-row { display: flex; gap: 0.75rem; padding-top: 0.5rem; }
  .ap-submit-btn {
    flex: 1; background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border: none; padding: 0.85rem 1.5rem; border-radius: 13px;
    color: white; font-weight: 700; font-size: 15px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 20px rgba(59,130,246,0.35);
    position: relative; overflow: hidden;
  }
  .ap-submit-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.6s ease;
  }
  .ap-submit-btn:not(:disabled):hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 30px rgba(59,130,246,0.5);
  }
  .ap-submit-btn:not(:disabled):hover::before { left: 100%; }
  .ap-submit-btn:not(:disabled):active { transform: translateY(-1px) scale(0.98); }
  .ap-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .ap-submit-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }

  .ap-cancel-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
    padding: 0.85rem 1.5rem; border-radius: 13px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; font-weight: 600; font-size: 15px;
    text-decoration: none; cursor: pointer;
    transition: all 0.3s ease;
  }
  .ap-cancel-btn:hover {
    background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15);
    color: #e2e8f0;
  }

  /* ===== SIDE PANEL ===== */
  .ap-side-panel { position: sticky; top: 1.5rem; }

  /* ===== PROGRESS CARD ===== */
  .ap-progress-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 18px; padding: 1.3rem;
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 1rem; position: relative; overflow: hidden;
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
  }
  .ap-progress-card:hover { border-color: rgba(59,130,246,0.15); }
  .ap-progress-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.9rem; font-weight: 700; color: #ffffff;
    margin-bottom: 1rem;
  }
  .ap-progress-title-icon { color: #60a5fa; display: flex; }
  .ap-progress-ring-wrap {
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem; position: relative;
  }
  .ap-progress-ring-svg { transform: rotate(-90deg); }
  .ap-progress-ring-bg { fill: none; stroke: rgba(255,255,255,0.05); }
  .ap-progress-ring-fill {
    fill: none; stroke-linecap: round;
    transition: stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease;
  }
  .ap-progress-ring-text {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.3rem; font-weight: 800; color: #ffffff;
    text-align: center;
  }
  .ap-progress-ring-pct { font-size: 0.7rem; color: rgba(148,163,184,0.5); display: block; }
  .ap-progress-steps { display: flex; flex-direction: column; gap: 0.5rem; }
  .ap-progress-step {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 12px; padding: 0.35rem 0.5rem; border-radius: 8px;
    transition: all 0.3s ease;
  }
  .ap-progress-step:hover { background: rgba(255,255,255,0.03); }
  .ap-progress-step-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    transition: all 0.4s ease;
  }
  .ap-progress-step-done { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.4); }
  .ap-progress-step-pending { background: rgba(148,163,184,0.2); }
  .ap-progress-step-label { transition: color 0.3s ease; }
  .ap-progress-step-label-done { color: rgba(148,163,184,0.8); }
  .ap-progress-step-label-pending { color: rgba(148,163,184,0.35); }

  /* ===== PROFIT PREVIEW ===== */
  .ap-preview-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.85) 100%);
    border-radius: 18px; padding: 1.3rem;
    border: 1px solid rgba(59,130,246,0.12);
    backdrop-filter: blur(20px); position: relative; overflow: hidden;
    margin-bottom: 1rem;
    transition: all 0.4s ease;
    animation: fadeInRight 0.6s ease-out 0.5s both;
  }
  .ap-preview-card:hover { border-color: rgba(59,130,246,0.25); }
  .ap-preview-glow {
    position: absolute; top: -30%; right: -30%; width: 150%; height: 150%;
    pointer-events: none; transition: opacity 0.4s ease;
  }
  .ap-preview-card:hover .ap-preview-glow { opacity: 1; }
  .ap-preview-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.9rem; font-weight: 700; color: #ffffff;
    margin-bottom: 1rem; padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ap-preview-title-icon { display: flex; }
  .ap-preview-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.55rem; font-size: 13px; position: relative; z-index: 1;
    padding: 0.3rem 0; transition: all 0.3s ease; border-radius: 6px;
  }
  .ap-preview-row:hover { background: rgba(255,255,255,0.02); padding: 0.3rem 0.5rem; }
  .ap-preview-label { color: rgba(148,163,184,0.65); }
  .ap-preview-value { color: #e2e8f0; font-weight: 600; font-variant-numeric: tabular-nums; }
  .ap-preview-divider {
    margin: 0.75rem 0; border: none; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
  }
  .ap-margin-badge {
    display: inline-flex; align-items: center; gap: 0.25rem;
    padding: 0.2rem 0.6rem; border-radius: 20px;
    font-size: 12px; font-weight: 700;
    animation: counterPop 0.5s ease both;
  }
  .ap-margin-positive {
    background: rgba(34,197,94,0.12); color: #4ade80;
    border: 1px solid rgba(34,197,94,0.2);
  }
  .ap-margin-negative {
    background: rgba(239,68,68,0.12); color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }

  /* ===== PROFIT GAUGE ===== */
  .ap-gauge-wrap {
    display: flex; justify-content: center; margin: 1rem 0 0.5rem;
    position: relative; z-index: 1;
  }
  .ap-gauge-svg { overflow: visible; }
  .ap-gauge-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-linecap: round; }
  .ap-gauge-fill {
    fill: none; stroke-linecap: round;
    transition: stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease;
  }
  .ap-gauge-text {
    font-size: 16px; font-weight: 800; fill: #ffffff;
    text-anchor: middle; dominant-baseline: middle;
  }
  .ap-gauge-label {
    font-size: 9px; fill: rgba(148,163,184,0.5);
    text-anchor: middle; text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ===== TIPS CARD ===== */
  .ap-tips-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.75) 100%);
    border-radius: 18px; padding: 1.3rem;
    border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden;
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
  }
  .ap-tips-card:hover { border-color: rgba(245,158,11,0.15); }
  .ap-tips-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.9rem; font-weight: 700; color: #ffffff;
    margin-bottom: 0.85rem;
  }
  .ap-tips-title-icon { color: #fbbf24; display: flex; animation: iconFloat 3s ease-in-out infinite; }
  .ap-tip-item {
    display: flex; align-items: flex-start; gap: 0.6rem;
    font-size: 12px; color: rgba(148,163,184,0.65);
    margin-bottom: 0.6rem; line-height: 1.55;
    padding: 0.35rem 0.5rem; border-radius: 8px;
    transition: all 0.3s ease;
  }
  .ap-tip-item:hover { background: rgba(255,255,255,0.03); color: rgba(148,163,184,0.85); }
  .ap-tip-dot {
    width: 6px; height: 6px; border-radius: 50%;
    flex-shrink: 0; margin-top: 5px;
    transition: transform 0.3s ease;
  }
  .ap-tip-item:hover .ap-tip-dot { transform: scale(1.3); }

  /* ===== PRODUCT PREVIEW MINI ===== */
  .ap-mini-preview {
    background: linear-gradient(145deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.7) 100%);
    border-radius: 14px; padding: 1rem;
    border: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 1rem;
    transition: all 0.4s ease;
    animation: fadeInRight 0.6s ease-out 0.3s both;
  }
  .ap-mini-preview:hover { border-color: rgba(139,92,246,0.15); }
  .ap-mini-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 700; color: #ffffff;
    margin-bottom: 0.75rem;
  }
  .ap-mini-field {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.3rem 0; font-size: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: all 0.3s ease;
  }
  .ap-mini-field:last-child { border-bottom: none; }
  .ap-mini-field:hover { padding-left: 0.3rem; }
  .ap-mini-field-label { color: rgba(148,163,184,0.5); }
  .ap-mini-field-value { color: #e2e8f0; font-weight: 600; max-width: 60%; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-mini-field-empty { color: rgba(148,163,184,0.25); font-style: italic; }

  /* ===== LOADING SCREEN ===== */
  .ap-loading-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 80vh; gap: 1.5rem;
  }
  .ap-loading-logo { position: relative; width: 65px; height: 65px; display: flex; align-items: center; justify-content: center; }
  .ap-loading-ring {
    position: absolute; inset: 0;
    border: 3px solid rgba(59,130,246,0.15); border-top-color: #3b82f6; border-right-color: #8b5cf6;
    border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5,0,0.5,1) infinite;
  }
  .ap-loading-ring-inner {
    position: absolute; inset: 8px;
    border: 2px solid rgba(139,92,246,0.1); border-bottom-color: #8b5cf6;
    border-radius: 50%; animation: spin 0.8s cubic-bezier(0.5,0,0.5,1) infinite reverse;
  }
  .ap-loading-center { color: #60a5fa; font-size: 1.4rem; animation: breathe 1.5s ease-in-out infinite; display: flex; }
  .ap-loading-dots { display: flex; gap: 0.4rem; }
  .ap-loading-dot {
    width: 8px; height: 8px; border-radius: 50%;
    animation: dotPulse 1.4s ease-in-out infinite;
  }
  .ap-loading-dot:nth-child(1) { background: #3b82f6; }
  .ap-loading-dot:nth-child(2) { background: #8b5cf6; animation-delay: 0.2s; }
  .ap-loading-dot:nth-child(3) { background: #06b6d4; animation-delay: 0.4s; }
  .ap-loading-text { color: rgba(148,163,184,0.7); font-size: 14px; font-weight: 500; }

  /* ===== KEYBOARD SHORTCUT HINT ===== */
  .ap-kbd-hint {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    margin-top: 0.75rem; font-size: 11px; color: rgba(148,163,184,0.3);
  }
  .ap-kbd {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    padding: 0.15rem 0.4rem; border-radius: 4px; font-family: monospace;
    font-size: 10px; color: rgba(148,163,184,0.5);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1100px) {
    .ap-form-layout { grid-template-columns: 1fr; }
    .ap-side-panel { position: static; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  }
  @media (max-width: 768px) {
    .ap-root { padding: 1rem; }
    .ap-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
    .ap-form-row { grid-template-columns: 1fr; }
    .ap-form-row-3 { grid-template-columns: 1fr; }
    .ap-stepper { flex-wrap: wrap; justify-content: center; }
    .ap-side-panel { grid-template-columns: 1fr; }
    .ap-profit-strip { flex-direction: column; }
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */

const STEPS = [
  { key: 'basic', label: 'Basic Info', icon: <HiOutlineCube size={13} /> },
  { key: 'classification', label: 'Classification', icon: <HiOutlineTag size={13} /> },
  { key: 'pricing', label: 'Pricing', icon: <HiOutlineBanknotes size={13} /> },
  { key: 'stock', label: 'Stock', icon: <HiOutlineArchiveBox size={13} /> },
];

function getStepStatus(step, formData) {
  switch (step.key) {
    case 'basic': return formData.productCode && formData.productName ? 'done' : 'pending';
    case 'classification': return formData.categoryId && formData.supplierId ? 'done' : 'pending';
    case 'pricing': return formData.costPrice && formData.sellingPrice ? 'done' : 'pending';
    case 'stock': return 'done';
    default: return 'pending';
  }
}

/* ─────────────────────────────────────────────
   CIRCULAR PROGRESS
   ───────────────────────────────────────────── */

function CircularProgress({ percent, size = 90, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent === 100 ? '#22c55e' : percent >= 50 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="ap-progress-ring-wrap">
      <svg className="ap-progress-ring-svg" width={size} height={size}>
        <circle className="ap-progress-ring-bg" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="ap-progress-ring-fill"
          cx={size/2} cy={size/2} r={radius}
          strokeWidth={strokeWidth} stroke={color}
          strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <div className="ap-progress-ring-text">
        {Math.round(percent)}
        <span className="ap-progress-ring-pct">%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MARGIN GAUGE (semicircle)
   ───────────────────────────────────────────── */

function MarginGauge({ percent }) {
  const r = 40;
  const circ = Math.PI * r;
  const clampedPct = Math.min(Math.max(percent, -100), 200);
  const normalized = Math.min(Math.max((clampedPct + 100) / 300, 0), 1);
  const offset = circ - normalized * circ;
  const color = clampedPct >= 20 ? '#22c55e' : clampedPct >= 0 ? '#f59e0b' : '#ef4444';

  return (
    <div className="ap-gauge-wrap">
      <svg className="ap-gauge-svg" width="120" height="70" viewBox="0 0 120 70">
        <path className="ap-gauge-bg" d="M 10 60 A 40 40 0 0 1 110 60" strokeWidth="7" />
        <path
          className="ap-gauge-fill"
          d="M 10 60 A 40 40 0 0 1 110 60"
          strokeWidth="7" stroke={color}
          strokeDasharray={circ} strokeDashoffset={offset}
        />
        <text className="ap-gauge-text" x="60" y="48">{clampedPct.toFixed(0)}%</text>
        <text className="ap-gauge-label" x="60" y="64">Margin</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONFETTI (shown on success)
   ───────────────────────────────────────────── */

function ConfettiBurst() {
  const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="ap-confetti"
          style={{
            background: colors[i % colors.length],
            left: `${10 + Math.random() * 80}%`,
            top: `${-5 + Math.random() * 10}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${0.7 + Math.random() * 0.6}s`,
          }}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export default function AddProductPage() {
  const router = useRouter();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    productCode: '', productName: '', description: '',
    categoryId: '', supplierId: '', warehouseId: '',
    unit: 'pieces', costPrice: '', sellingPrice: '',
    currentStock: '0', reorderLevel: '10',
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [descLength, setDescLength] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cRes, sRes, wRes] = await Promise.all([
          fetch('/api/categories'), fetch('/api/suppliers'), fetch('/api/warehouses'),
        ]);
        const [cData, sData, wData] = await Promise.all([cRes.json(), sRes.json(), wRes.json()]);
        if (cData.success && cData.data) setCategories(cData.data);
        if (sData.success && sData.data) setSuppliers(sData.data);
        if (wData.success && wData.data) setWarehouses(wData.data);
      } catch (err) { console.error('Fetch error:', err); }
      finally { setLoadingData(false); }
    }
    fetchData();
  }, []);

  // Keyboard shortcut: Ctrl+Enter to submit
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !loading) {
        formRef.current?.requestSubmit();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loading]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'description') setDescLength(value.length);
  }

  function handleSectionFocus(section) {
    setActiveSection(section);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(false);
    try {
      if (!formData.productCode || !formData.productName || !formData.categoryId ||
          !formData.supplierId || !formData.costPrice || !formData.sellingPrice) {
        throw new Error('Please fill in all required fields');
      }
      const initialStock = parseInt(formData.currentStock) || 0;
      if (initialStock > 0 && !formData.warehouseId) {
        throw new Error('Please select a warehouse for the initial stock');
      }
      const cost = parseFloat(formData.costPrice);
      const sell = parseFloat(formData.sellingPrice);
      if (sell < cost) throw new Error('Selling price must be ≥ cost price');

      const res = await fetch('/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: formData.productCode, productName: formData.productName,
          description: formData.description,
          categoryId: parseInt(formData.categoryId), supplierId: parseInt(formData.supplierId),
          warehouseId: formData.warehouseId ? parseInt(formData.warehouseId) : null,
          unit: formData.unit, costPrice: cost, sellingPrice: sell,
          currentStock: parseInt(formData.currentStock) || 0,
          reorderLevel: parseInt(formData.reorderLevel) || 10,
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setSuccess(true);
      setTimeout(() => router.push('/products'), 2000);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  /* ── Computed values ── */
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const profitMargin = sellingPrice - costPrice;
  const profitPercent = costPrice > 0 ? ((profitMargin / costPrice) * 100) : 0;
  const totalStockValue = (parseInt(formData.currentStock) || 0) * costPrice;
  const hasPrices = formData.costPrice && formData.sellingPrice;

  const requiredFields = [
    { key: 'productCode', label: 'Product Code' },
    { key: 'productName', label: 'Product Name' },
    { key: 'categoryId', label: 'Category' },
    { key: 'supplierId', label: 'Supplier' },
    { key: 'costPrice', label: 'Cost Price' },
    { key: 'sellingPrice', label: 'Selling Price' },
  ];
  const filledCount = requiredFields.filter(f => !!formData[f.key]).length;
  const progress = Math.round((filledCount / requiredFields.length) * 100);

  const getCategoryName = () => categories.find(c => c.CategoryID == formData.categoryId)?.CategoryName || '';
  const getSupplierName = () => suppliers.find(s => s.SupplierID == formData.supplierId)?.SupplierName || '';
  const getWarehouseName = () => warehouses.find(w => w.WarehouseID == formData.warehouseId)?.WarehouseName || '';

  /* ── Loading ── */
  if (loadingData) {
    return (
      <div className="ap-root">
        <style>{globalCSS}</style>
        <div className="ap-orb ap-orb-1" /><div className="ap-orb ap-orb-2" />
        <div className="ap-loading-screen">
          <div className="ap-loading-logo">
            <div className="ap-loading-ring" /><div className="ap-loading-ring-inner" />
            <span className="ap-loading-center"><HiOutlineCube size={26} /></span>
          </div>
          <div className="ap-loading-dots">
            <span className="ap-loading-dot" /><span className="ap-loading-dot" /><span className="ap-loading-dot" />
          </div>
          <p className="ap-loading-text">Loading form data...</p>
        </div>
      </div>
    );
  }

  /* ── Determine step statuses ── */
  const stepStatuses = STEPS.map(step => ({
    ...step,
    status: getStepStatus(step, formData),
  }));
  const currentStepIdx = stepStatuses.findIndex(s => s.key === activeSection);

  return (
    <div className="ap-root">
      <style>{globalCSS}</style>

      {/* Background Orbs */}
      <div className="ap-orb ap-orb-1" /><div className="ap-orb ap-orb-2" /><div className="ap-orb ap-orb-3" />

      <div className="ap-content">
        {/* ══════════ HEADER ══════════ */}
        <header className="ap-header">
          <div className="ap-header-glow" />
          <div className="ap-header-content">
            <div className="ap-header-top">
              <div className="ap-header-icon"><HiOutlinePlusCircle size={22} /></div>
              <h1 className="ap-header-title">Add New Product</h1>
            </div>
            <p className="ap-header-subtitle">
              <HiOutlineSparkles size={14} style={{ color: '#fbbf24' }} />
              Fill in the details below to add a new product to your inventory
            </p>
          </div>
          <div className="ap-header-right">
            <Link href="/products" className="ap-back-btn">
              <span className="ap-back-arrow"><HiOutlineArrowLeft size={15} /></span>
              Back to Products
            </Link>
          </div>
        </header>

        {/* ══════════ STEPPER ══════════ */}
        <nav className="ap-stepper">
          {stepStatuses.map((step, i) => {
            const isActive = step.key === activeSection;
            const isDone = step.status === 'done';
            const cls = isActive ? 'ap-step-active' : isDone ? 'ap-step-done' : 'ap-step-pending';
            return (
              <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <div className={`ap-step-line ${
                    stepStatuses[i - 1].status === 'done' && (isDone || isActive) ? 'ap-step-line-done' :
                    isActive ? 'ap-step-line-active' : 'ap-step-line-pending'
                  }`} />
                )}
                <div className={`ap-step ${cls}`} onClick={() => setActiveSection(step.key)}>
                  <div className="ap-step-number">
                    {isDone && !isActive ? <HiOutlineCheckCircle size={14} /> : step.icon}
                  </div>
                  <span className="ap-step-label">{step.label}</span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ══════════ ALERTS ══════════ */}
        {success && (
          <div className="ap-alert ap-alert-success">
            <ConfettiBurst />
            <span className="ap-alert-icon"><HiOutlineCheckCircle size={20} /></span>
            Product added successfully! Redirecting to products...
            <HiOutlineRocketLaunch size={16} style={{ marginLeft: '0.3rem', opacity: 0.7 }} />
          </div>
        )}
        {error && (
          <div className="ap-alert ap-alert-error">
            <span className="ap-alert-icon"><HiOutlineExclamationTriangle size={20} /></span>
            {error}
            <button className="ap-alert-close" onClick={() => setError(null)}>
              <HiOutlineXMark size={16} />
            </button>
          </div>
        )}

        {/* ══════════ MAIN LAYOUT ══════════ */}
        <div className="ap-form-layout">
          {/* ──── LEFT: FORM ──── */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit}>

              {/* ── Section 1: Basic Information ── */}
              <div
                className={`ap-card anim-entry ${activeSection === 'basic' ? 'ap-card-active' : ''}`}
                style={{ animationDelay: '0.15s' }}
                onFocus={() => handleSectionFocus('basic')}
              >
                <div className="ap-card-glow" style={{ top: '-50%', right: '-50%', background: 'radial-gradient(circle at 70% 30%, rgba(59,130,246,0.04) 0%, transparent 50%)' }} />
                <div className="ap-card-shine" />
                <div className="ap-section-header" style={{ '--section-line': '25%' }}>
                  <div className="ap-section-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                    <HiOutlineCube size={17} style={{ color: '#60a5fa' }} />
                  </div>
                  <span className="ap-section-title">Basic Information</span>
                  {formData.productCode && formData.productName && (
                    <span className="ap-section-badge" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <HiOutlineCheckBadge size={11} style={{ marginRight: 2 }} /> Complete
                    </span>
                  )}
                </div>
                <div className="ap-section-header" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }} />

                <div className="ap-form-row">
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineCodeBracket size={13} /></span>
                      Product Code <span className="ap-required">*</span>
                    </label>
                    <input
                      type="text" name="productCode" placeholder="e.g., ELEC-001"
                      value={formData.productCode} onChange={handleChange}
                      className={`ap-input ${formData.productCode ? 'ap-input-valid' : ''}`}
                      required
                    />
                    <div className="ap-help">
                      <HiOutlineInformationCircle size={11} /> Unique identifier for the product
                    </div>
                  </div>
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineCube size={13} /></span>
                      Product Name <span className="ap-required">*</span>
                    </label>
                    <input
                      type="text" name="productName" placeholder="e.g., Wireless Mouse"
                      value={formData.productName} onChange={handleChange}
                      className={`ap-input ${formData.productName ? 'ap-input-valid' : ''}`}
                      required
                    />
                  </div>
                </div>

                <div className="ap-form-group" style={{ position: 'relative' }}>
                  <label className="ap-label">
                    <span className="ap-label-icon"><HiOutlineDocumentText size={13} /></span>
                    Description
                  </label>
                  <textarea
                    name="description" placeholder="Brief product description..."
                    value={formData.description} onChange={handleChange}
                    className="ap-textarea" rows={3} maxLength={500}
                  />
                  <span className="ap-char-count">{descLength}/500</span>
                </div>
              </div>

              {/* ── Section 2: Classification ── */}
              <div
                className={`ap-card anim-entry ${activeSection === 'classification' ? 'ap-card-active' : ''}`}
                style={{ animationDelay: '0.25s' }}
                onFocus={() => handleSectionFocus('classification')}
              >
                <div className="ap-card-glow" style={{ top: '-50%', left: '-50%', background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.04) 0%, transparent 50%)' }} />
                <div className="ap-card-shine" />
                <div className="ap-section-header" style={{ '--section-line': '30%' }}>
                  <div className="ap-section-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>
                    <HiOutlineTag size={17} style={{ color: '#a78bfa' }} />
                  </div>
                  <span className="ap-section-title">Classification</span>
                  {formData.categoryId && formData.supplierId && (
                    <span className="ap-section-badge" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <HiOutlineCheckBadge size={11} style={{ marginRight: 2 }} /> Complete
                    </span>
                  )}
                </div>

                <div className="ap-form-row">
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineTag size={13} /></span>
                      Category <span className="ap-required">*</span>
                    </label>
                    <select
                      name="categoryId" value={formData.categoryId} onChange={handleChange}
                      className={`ap-select ${formData.categoryId ? 'ap-input-valid' : ''}`}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(c => (
                        <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineBuildingStorefront size={13} /></span>
                      Supplier <span className="ap-required">*</span>
                    </label>
                    <select
                      name="supplierId" value={formData.supplierId} onChange={handleChange}
                      className={`ap-select ${formData.supplierId ? 'ap-input-valid' : ''}`}
                      required
                    >
                      <option value="">Select a supplier</option>
                      {suppliers.map(s => (
                        <option key={s.SupplierID} value={s.SupplierID}>{s.SupplierName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ap-form-group" style={{ maxWidth: '48%' }}>
                  <label className="ap-label">
                    <span className="ap-label-icon"><HiOutlineScale size={13} /></span>
                    Unit of Measurement
                  </label>
                  <select name="unit" value={formData.unit} onChange={handleChange} className="ap-select">
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="liters">Liters</option>
                    <option value="meters">Meters</option>
                    <option value="boxes">Boxes</option>
                    <option value="packs">Packs</option>
                    <option value="sets">Sets</option>
                    <option value="units">Units</option>
                  </select>
                </div>
              </div>

              {/* ── Section 3: Pricing ── */}
              <div
                className={`ap-card anim-entry ${activeSection === 'pricing' ? 'ap-card-active' : ''}`}
                style={{ animationDelay: '0.35s' }}
                onFocus={() => handleSectionFocus('pricing')}
              >
                <div className="ap-card-glow" style={{ top: '-50%', right: '-30%', background: 'radial-gradient(circle at 70% 40%, rgba(34,197,94,0.04) 0%, transparent 50%)' }} />
                <div className="ap-card-shine" />
                <div className="ap-section-header" style={{ '--section-line': '35%' }}>
                  <div className="ap-section-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <HiOutlineBanknotes size={17} style={{ color: '#4ade80' }} />
                  </div>
                  <span className="ap-section-title">Pricing</span>
                  {hasPrices && profitMargin >= 0 && (
                    <span className="ap-section-badge" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <HiOutlineCheckBadge size={11} style={{ marginRight: 2 }} /> Valid
                    </span>
                  )}
                  {hasPrices && profitMargin < 0 && (
                    <span className="ap-section-badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <HiOutlineExclamationTriangle size={11} style={{ marginRight: 2 }} /> Loss
                    </span>
                  )}
                </div>

                <div className="ap-form-row">
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineBanknotes size={13} /></span>
                      Cost Price <span className="ap-required">*</span>
                    </label>
                    <div className="ap-input-wrapper">
                      <span className="ap-input-prefix">$</span>
                      <input
                        type="number" name="costPrice" placeholder="0.00"
                        min="0" step="0.01"
                        value={formData.costPrice} onChange={handleChange}
                        className={`ap-input ap-input-prefixed ${formData.costPrice ? 'ap-input-valid' : ''}`}
                        required
                      />
                    </div>
                    <div className="ap-help">
                      <HiOutlineInformationCircle size={11} /> Price you pay to supplier
                    </div>
                  </div>
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineArrowTrendingUp size={13} /></span>
                      Selling Price <span className="ap-required">*</span>
                    </label>
                    <div className="ap-input-wrapper">
                      <span className="ap-input-prefix">$</span>
                      <input
                        type="number" name="sellingPrice" placeholder="0.00"
                        min="0" step="0.01"
                        value={formData.sellingPrice} onChange={handleChange}
                        className={`ap-input ap-input-prefixed ${
                          formData.sellingPrice
                            ? profitMargin >= 0 ? 'ap-input-valid' : 'ap-input-invalid'
                            : ''
                        }`}
                        required
                      />
                    </div>
                    <div className="ap-help">
                      <HiOutlineInformationCircle size={11} /> Price customer pays
                    </div>
                  </div>
                </div>

                {hasPrices && (
                  <div className="ap-profit-strip">
                    <div className={`ap-profit-chip ${profitMargin >= 0 ? 'ap-profit-positive' : 'ap-profit-negative'}`}>
                      <span className="ap-profit-icon">
                        {profitMargin >= 0
                          ? <HiOutlineArrowTrendingUp size={16} style={{ color: '#4ade80' }} />
                          : <HiOutlineArrowTrendingDown size={16} style={{ color: '#f87171' }} />
                        }
                      </span>
                      <span className="ap-profit-text" style={{ color: profitMargin >= 0 ? '#4ade80' : '#f87171' }}>
                        Margin: ${profitMargin.toFixed(2)} ({profitPercent.toFixed(1)}%)
                      </span>
                    </div>
                    {profitMargin < 0 && (
                      <div className="ap-profit-chip ap-profit-warning">
                        <span className="ap-profit-icon">
                          <HiOutlineExclamationTriangle size={14} style={{ color: '#fbbf24' }} />
                        </span>
                        <span className="ap-profit-text" style={{ color: '#fbbf24', fontSize: 12 }}>Loss per unit</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Section 4: Stock & Warehouse ── */}
              <div
                className={`ap-card anim-entry ${activeSection === 'stock' ? 'ap-card-active' : ''}`}
                style={{ animationDelay: '0.45s' }}
                onFocus={() => handleSectionFocus('stock')}
              >
                <div className="ap-card-glow" style={{ top: '-50%', left: '-30%', background: 'radial-gradient(circle at 30% 40%, rgba(6,182,212,0.04) 0%, transparent 50%)' }} />
                <div className="ap-card-shine" />
                <div className="ap-section-header" style={{ '--section-line': '40%' }}>
                  <div className="ap-section-icon" style={{ background: 'rgba(6,182,212,0.12)' }}>
                    <HiOutlineArchiveBox size={17} style={{ color: '#22d3ee' }} />
                  </div>
                  <span className="ap-section-title">Stock & Warehouse</span>
                  <span className="ap-section-badge" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>
                    Optional
                  </span>
                </div>

                <div className="ap-form-row-3">
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineBuildingOffice size={13} /></span>
                      Warehouse
                    </label>
                    <select
                      name="warehouseId" value={formData.warehouseId} onChange={handleChange}
                      className="ap-select"
                    >
                      <option value="">Select a warehouse</option>
                      {warehouses.map(w => (
                        <option key={w.WarehouseID} value={w.WarehouseID}>{w.WarehouseName}</option>
                      ))}
                    </select>
                    <div className="ap-help">For initial stock placement</div>
                  </div>
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineArchiveBox size={13} /></span>
                      Initial Stock
                    </label>
                    <input
                      type="number" name="currentStock" placeholder="0" min="0"
                      value={formData.currentStock} onChange={handleChange}
                      className="ap-input"
                    />
                    <div className="ap-help">Starting inventory qty</div>
                  </div>
                  <div className="ap-form-group">
                    <label className="ap-label">
                      <span className="ap-label-icon"><HiOutlineBell size={13} /></span>
                      Reorder Level
                    </label>
                    <input
                      type="number" name="reorderLevel" placeholder="10" min="0"
                      value={formData.reorderLevel} onChange={handleChange}
                      className="ap-input"
                    />
                    <div className="ap-help">Alert threshold</div>
                  </div>
                </div>
              </div>

              {/* ── Buttons ── */}
              <div className="ap-btn-row anim-entry" style={{ animationDelay: '0.55s' }}>
                <button type="submit" className="ap-submit-btn" disabled={loading}>
                  {loading ? (
                    <><div className="ap-submit-spinner" /> Adding Product...</>
                  ) : (
                    <><HiOutlinePlusCircle size={18} /> Add Product</>
                  )}
                </button>
                <Link href="/products" className="ap-cancel-btn">
                  Cancel
                </Link>
              </div>

              <div className="ap-kbd-hint">
                Press <span className="ap-kbd">Ctrl</span> + <span className="ap-kbd">Enter</span> to submit
              </div>
            </form>
          </div>

          {/* ──── RIGHT: SIDE PANEL ──── */}
          <div className="ap-side-panel">

            {/* ── Progress Card ── */}
            <div className="ap-progress-card anim-entry" style={{ animationDelay: '0.2s' }}>
              <div className="ap-progress-title">
                <span className="ap-progress-title-icon"><HiOutlineShieldCheck size={16} /></span>
                Form Progress
              </div>
              <CircularProgress percent={progress} />
              <div className="ap-progress-steps">
                {requiredFields.map((f, i) => {
                  const isDone = !!formData[f.key];
                  return (
                    <div key={f.key} className="ap-progress-step" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                      <span className={`ap-progress-step-dot ${isDone ? 'ap-progress-step-done' : 'ap-progress-step-pending'}`} />
                      <span className={`ap-progress-step-label ${isDone ? 'ap-progress-step-label-done' : 'ap-progress-step-label-pending'}`}>
                        {f.label}
                      </span>
                      {isDone && <HiOutlineCheckCircle size={12} style={{ marginLeft: 'auto', color: '#22c55e', opacity: 0.7 }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Live Product Preview ── */}
            <div className="ap-mini-preview">
              <div className="ap-mini-title">
                <HiOutlineEye size={14} style={{ color: '#a78bfa' }} /> Live Preview
              </div>
              {[
                { label: 'Code', value: formData.productCode },
                { label: 'Name', value: formData.productName },
                { label: 'Category', value: getCategoryName() },
                { label: 'Supplier', value: getSupplierName() },
                { label: 'Warehouse', value: getWarehouseName() },
                { label: 'Unit', value: formData.unit },
                { label: 'Stock', value: formData.currentStock || '0' },
              ].map((f, i) => (
                <div key={i} className="ap-mini-field">
                  <span className="ap-mini-field-label">{f.label}</span>
                  <span className={f.value ? 'ap-mini-field-value' : 'ap-mini-field-empty'}>
                    {f.value || '—'}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Pricing Preview ── */}
            {hasPrices && (
              <div className="ap-preview-card">
                <div className="ap-preview-glow" style={{
                  background: `radial-gradient(circle at 70% 30%, ${profitMargin >= 0 ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)'} 0%, transparent 50%)`,
                  opacity: 0.7,
                }} />
                <div className="ap-preview-title">
                  <span className="ap-preview-title-icon">
                    <HiOutlineBanknotes size={16} style={{ color: '#4ade80' }} />
                  </span>
                  Pricing Analysis
                </div>

                <MarginGauge percent={parseFloat(profitPercent.toFixed(1))} />

                <div className="ap-preview-row">
                  <span className="ap-preview-label">Cost Price</span>
                  <span className="ap-preview-value">${costPrice.toFixed(2)}</span>
                </div>
                <div className="ap-preview-row">
                  <span className="ap-preview-label">Selling Price</span>
                  <span className="ap-preview-value">${sellingPrice.toFixed(2)}</span>
                </div>
                <hr className="ap-preview-divider" />
                <div className="ap-preview-row">
                  <span className="ap-preview-label">Profit / Unit</span>
                  <span className="ap-preview-value" style={{ color: profitMargin >= 0 ? '#4ade80' : '#f87171' }}>
                    {profitMargin >= 0 ? '+' : ''}${profitMargin.toFixed(2)}
                  </span>
                </div>
                <div className="ap-preview-row">
                  <span className="ap-preview-label">Margin</span>
                  <span className={`ap-margin-badge ${profitMargin >= 0 ? 'ap-margin-positive' : 'ap-margin-negative'}`}>
                    {profitMargin >= 0 ? <HiOutlineArrowTrendingUp size={11} /> : <HiOutlineArrowTrendingDown size={11} />}
                    {profitPercent.toFixed(1)}%
                  </span>
                </div>
                {totalStockValue > 0 && (
                  <>
                    <hr className="ap-preview-divider" />
                    <div className="ap-preview-row">
                      <span className="ap-preview-label">Total Stock Value</span>
                      <span className="ap-preview-value">${totalStockValue.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Tips ── */}
            <div className="ap-tips-card anim-entry" style={{ animationDelay: '0.4s' }}>
              <div className="ap-tips-title">
                <span className="ap-tips-title-icon"><HiOutlineLightBulb size={16} /></span>
                Quick Tips
              </div>
              {[
                { text: 'Use a consistent code format (e.g., ELEC-001, CLTH-002)', color: '#3b82f6' },
                { text: 'Set reorder level based on average weekly sales', color: '#8b5cf6' },
                { text: 'Selling price must be ≥ cost price', color: '#22c55e' },
                { text: 'Warehouse is required only if initial stock > 0', color: '#f59e0b' },
                { text: 'Press Ctrl+Enter to quickly submit the form', color: '#06b6d4' },
              ].map((tip, i) => (
                <div key={i} className="ap-tip-item">
                  <span className="ap-tip-dot" style={{ background: tip.color }} />
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}