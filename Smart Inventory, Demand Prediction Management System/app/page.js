'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineBanknotes,
  HiOutlineShoppingCart,
  HiOutlineInboxArrowDown,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
  HiOutlineBell,
  HiOutlineArrowPath,
  HiOutlineTag,
  HiOutlineArrowTrendingUp,
  HiOutlinePlusCircle,
  HiOutlineBolt,
  HiOutlineCalendarDays,
  HiOutlineTrophy,
  HiOutlineInboxStack,
  HiOutlineFolderOpen,
  HiOutlineChevronRight,
  HiOutlineSignal,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineArrowTrendingDown,
  HiOutlineArchiveBox,
  HiOutlineRocketLaunch,
  HiOutlineFire,
  HiOutlineCheckBadge,
} from 'react-icons/hi2';

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */

const MONTHS = [
  { value: 1, label: 'January' },   { value: 2, label: 'February' },
  { value: 3, label: 'March' },     { value: 4, label: 'April' },
  { value: 5, label: 'May' },       { value: 6, label: 'June' },
  { value: 7, label: 'July' },      { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);
const WEEKS = Array.from({ length: 53 }, (_, i) => i + 1);

const CATEGORY_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e',
  '#f59e0b', '#ef4444', '#ec4899', '#14b8a6',
  '#f97316', '#6366f1',
];

const RANK_COLORS = [
  'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
  'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
];

/* ─────────────────────────────────────────────
   CSS STYLES (all animations, hover states, layouts)
   ───────────────────────────────────────────── */

const globalCSS = `
  /* ===== KEYFRAMES ===== */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes orbDrift1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25%      { transform: translate(80px, -60px) scale(1.15); }
    50%      { transform: translate(-40px, 40px) scale(0.9); }
    75%      { transform: translate(60px, 30px) scale(1.05); }
  }
  @keyframes orbDrift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25%      { transform: translate(-70px, 50px) scale(0.95); }
    50%      { transform: translate(60px, -30px) scale(1.12); }
    75%      { transform: translate(-30px, -50px) scale(1); }
  }
  @keyframes orbDrift3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(50px, 70px) scale(1.08); }
    66%      { transform: translate(-60px, -20px) scale(0.92); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.3); opacity: 0.6; }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes gradientFlow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes progressGrow {
    from { width: 0%; }
    to   { width: var(--target-width, 0%); }
  }
  @keyframes barRise {
    from { height: 4px; }
    to   { height: var(--target-height, 4px); }
  }
  @keyframes sparkBarGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes textShine {
    0%   { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0); opacity: 0; }
    40%           { transform: scale(1); opacity: 1; }
  }
  @keyframes iconFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-6px) rotate(3deg); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 15px rgba(59,130,246,0.3); }
    50%      { box-shadow: 0 0 30px rgba(59,130,246,0.6), 0 0 60px rgba(139,92,246,0.2); }
  }
  @keyframes cardShine {
    0%   { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes slideReveal {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
  @keyframes counterPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes alertPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50%      { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(239,68,68,0); }
  }
  @keyframes waveSlide {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes entranceBlur {
    from { opacity: 0; filter: blur(10px); transform: translateY(20px); }
    to   { opacity: 1; filter: blur(0); transform: translateY(0); }
  }
  @keyframes borderDance {
    0%   { border-color: rgba(59,130,246,0.3); }
    33%  { border-color: rgba(139,92,246,0.3); }
    66%  { border-color: rgba(6,182,212,0.3); }
    100% { border-color: rgba(59,130,246,0.3); }
  }

  /* ===== ROOT ===== */
  .db-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0a0f1e 0%, #0f172a 30%, #1a1040 60%, #0f172a 100%);
    padding: 1.5rem 2rem 3rem;
    position: relative;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  }

  /* ===== BACKGROUND ORBS ===== */
  .db-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .db-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
    top: -10%; left: -5%;
    animation: orbDrift1 25s ease-in-out infinite;
  }
  .db-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
    top: 40%; right: -8%;
    animation: orbDrift2 30s ease-in-out infinite;
  }
  .db-orb-3 {
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%);
    bottom: -5%; left: 30%;
    animation: orbDrift3 20s ease-in-out infinite;
  }

  /* ===== ANIMATED ENTRY ===== */
  .anim-entry {
    animation: entranceBlur 0.7s ease-out both;
  }

  /* ===== HEADER ===== */
  .db-header {
    position: relative; z-index: 2;
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 2rem;
    animation: fadeInDown 0.8s ease-out both;
  }
  .db-header-left { flex: 1; }
  .db-greeting-row {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  .db-greeting-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.4rem;
    animation: iconFloat 3s ease-in-out infinite;
    box-shadow: 0 8px 30px rgba(59,130,246,0.35);
  }
  .db-greeting-text {
    font-size: 1.85rem; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 0%, #94a3b8 50%, #ffffff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textShine 4s linear infinite;
  }
  .db-subtitle {
    color: rgba(148,163,184,0.7); font-size: 0.9rem;
    display: flex; align-items: center; gap: 0.6rem;
    margin-left: 3.8rem;
  }
  .db-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #22c55e; display: inline-block;
    position: relative;
  }
  .db-status-dot::after {
    content: ''; position: absolute; inset: -3px;
    border-radius: 50%; border: none;
    background: rgba(34,197,94,0.4);
    animation: breathe 2s ease-in-out infinite;
  }
  .db-clock {
    font-variant-numeric: tabular-nums;
    color: rgba(148,163,184,0.6);
    font-size: 0.85rem;
    padding: 0.25rem 0.6rem;
    background: rgba(30,41,59,0.5);
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .db-header-actions {
    display: flex; gap: 0.75rem; align-items: center;
  }
  .db-refresh-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border: none; padding: 0.7rem 1.3rem; border-radius: 12px;
    color: white; font-weight: 600; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(59,130,246,0.35);
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    position: relative; overflow: hidden;
  }
  .db-refresh-btn::before {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  .db-refresh-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 30px rgba(59,130,246,0.5);
  }
  .db-refresh-btn:hover::before { left: 100%; }
  .db-refresh-btn:active { transform: translateY(0) scale(0.98); }
  .db-refresh-btn .db-spin-icon {
    transition: transform 0.5s ease;
  }
  .db-refresh-btn:hover .db-spin-icon {
    transform: rotate(180deg);
  }

  /* ===== WAVE DIVIDER ===== */
  .db-wave-divider {
    position: relative; height: 30px; margin: 0.5rem 0 1.5rem;
    overflow: hidden; opacity: 0.15; z-index: 1;
  }
  .db-wave-svg {
    position: absolute; bottom: 0; width: 200%; height: 100%;
    animation: waveSlide 8s linear infinite;
  }

  /* ===== METRICS GRID ===== */
  .db-metrics-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1rem; margin-bottom: 1.5rem;
    position: relative; z-index: 2;
  }
  .db-metric-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 18px; padding: 1.25rem;
    border: 1px solid rgba(255,255,255,0.06);
    position: relative; overflow: hidden; cursor: default;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    backdrop-filter: blur(10px);
  }
  .db-metric-card::before {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
    transition: left 0.7s ease;
  }
  .db-metric-card:hover {
    transform: translateY(-6px);
    border-color: rgba(255,255,255,0.12);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .db-metric-card:hover::before { left: 150%; }
  .db-metric-card:hover .db-metric-icon-wrap {
    transform: scale(1.1) rotate(-5deg);
  }
  .db-metric-glow {
    position: absolute; top: -20px; right: -20px;
    width: 100px; height: 100px; border-radius: 50%;
    filter: blur(40px); opacity: 0.3; pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .db-metric-card:hover .db-metric-glow { opacity: 0.6; }
  .db-metric-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 1rem;
  }
  .db-metric-icon-wrap {
    width: 46px; height: 46px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.3rem;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  .db-metric-sparkline {
    display: flex; align-items: flex-end; gap: 2px;
    height: 28px; opacity: 0.5;
  }
  .db-spark-bar {
    width: 4px; border-radius: 2px;
    background: currentColor; transform-origin: bottom;
    animation: sparkBarGrow 0.8s ease-out both;
  }
  .db-metric-value {
    font-size: 1.6rem; font-weight: 800; color: #ffffff;
    margin-bottom: 0.2rem; line-height: 1.2;
    position: relative; z-index: 1;
  }
  .db-metric-label {
    font-size: 0.78rem; color: rgba(148,163,184,0.7);
    font-weight: 500; position: relative; z-index: 1;
    letter-spacing: 0.2px;
  }
  .db-metric-footer {
    display: flex; align-items: center; gap: 0.4rem;
    margin-top: 0.7rem; position: relative; z-index: 1;
  }
  .db-trend-badge {
    display: inline-flex; align-items: center; gap: 0.2rem;
    padding: 0.2rem 0.5rem; border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }
  .db-trend-up {
    background: rgba(34,197,94,0.15); color: #4ade80;
    border: 1px solid rgba(34,197,94,0.2);
  }
  .db-trend-down {
    background: rgba(239,68,68,0.15); color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  .db-trend-neutral {
    background: rgba(148,163,184,0.15); color: #94a3b8;
    border: 1px solid rgba(148,163,184,0.2);
  }
  .db-metric-card.db-alert-card {
    animation: borderDance 3s ease infinite;
  }
  .db-metric-card.db-alert-critical {
    animation: alertPulse 2s ease-in-out infinite;
  }

  /* ===== FINANCIAL SECTION ===== */
  .db-financial-section {
    background: linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.85) 100%);
    border-radius: 22px; padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(59,130,246,0.12);
    backdrop-filter: blur(20px);
    position: relative; overflow: hidden; z-index: 2;
    transition: border-color 0.5s ease;
  }
  .db-financial-section:hover {
    border-color: rgba(59,130,246,0.25);
  }
  .db-financial-section::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
    background-size: 300% 100%;
    animation: gradientFlow 4s linear infinite;
  }
  .db-fin-glow {
    position: absolute; top: -50%; left: -30%;
    width: 200%; height: 200%;
    background: radial-gradient(circle at 25% 25%, rgba(59,130,246,0.06) 0%, transparent 50%);
    pointer-events: none;
  }
  .db-fin-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;
    position: relative; z-index: 1;
  }
  .db-section-title {
    display: flex; align-items: center; gap: 0.6rem;
    color: #ffffff; font-size: 1.1rem; font-weight: 700;
  }
  .db-section-title-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.1rem;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    box-shadow: 0 4px 15px rgba(59,130,246,0.3);
  }
  .db-controls-row {
    display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;
  }
  .db-control-group {
    display: flex; align-items: center; gap: 0.35rem;
  }
  .db-control-label {
    font-size: 11px; color: rgba(148,163,184,0.6); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .db-select {
    padding: 0.45rem 0.7rem; border-radius: 9px;
    border: 1px solid rgba(59,130,246,0.2);
    background: rgba(15,23,42,0.7); color: #e2e8f0;
    font-size: 13px; cursor: pointer; outline: none;
    min-width: 100px; transition: all 0.3s ease;
    font-weight: 500;
  }
  .db-select:hover { border-color: rgba(59,130,246,0.4); }
  .db-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }
  .db-select option { background: #0f172a; }
  .db-reset-btn {
    padding: 0.45rem 0.9rem; border-radius: 9px;
    border: 1px solid rgba(139,92,246,0.25);
    background: rgba(139,92,246,0.1); color: #c4b5fd;
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all 0.3s ease;
    display: flex; align-items: center; gap: 0.3rem;
  }
  .db-reset-btn:hover {
    background: rgba(139,92,246,0.2);
    border-color: rgba(139,92,246,0.4);
    transform: translateY(-1px);
  }
  .db-period-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(90deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12));
    padding: 0.5rem 1rem; border-radius: 10px;
    font-size: 12px; color: rgba(226,232,240,0.85);
    margin-bottom: 1.25rem;
    border: 1px solid rgba(59,130,246,0.15);
    position: relative; z-index: 1;
    animation: fadeInScale 0.5s ease-out both;
  }
  .db-period-badge strong { color: #ffffff; }

  /* ===== PERIOD GRID ===== */
  .db-period-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; position: relative; z-index: 1;
  }
  .db-period-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.7) 100%);
    border-radius: 16px; padding: 1.15rem;
    border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
  }
  .db-period-card::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 3px;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .db-period-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.1);
    box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  }
  .db-period-card:hover::after { opacity: 1; }
  .db-period-card-weekly::after { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
  .db-period-card-monthly::after { background: linear-gradient(90deg, #22c55e, #4ade80); }
  .db-period-card-yearly::after { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .db-period-title {
    font-size: 12px; font-weight: 700; margin-bottom: 0.9rem;
    display: flex; align-items: center; gap: 0.4rem;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .db-period-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.4rem; font-size: 12.5px;
  }
  .db-period-label { color: rgba(148,163,184,0.65); }
  .db-period-divider {
    margin: 0.7rem 0; border: none; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }
  .db-profit-value {
    font-weight: 700; font-size: 14px;
    transition: color 0.3s ease;
  }
  .db-profit-positive { color: #4ade80; }
  .db-profit-negative { color: #f87171; }

  /* ===== VISUAL BAR CHART ===== */
  .db-bar-chart {
    display: flex; align-items: flex-end; gap: 0.5rem;
    height: 60px; margin-top: 1rem;
    padding: 0.5rem 0; position: relative;
  }
  .db-bar-chart::before {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 1px;
    background: rgba(255,255,255,0.06);
  }
  .db-bar-item {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 0.3rem;
  }
  .db-bar {
    width: 100%; border-radius: 4px 4px 0 0;
    min-height: 4px; max-height: 56px;
    animation: barRise 1s ease-out both;
    position: relative; overflow: hidden;
  }
  .db-bar::after {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: cardShine 2s ease-in-out 1s both;
  }
  .db-bar-label {
    font-size: 9px; color: rgba(148,163,184,0.5);
    text-transform: uppercase; letter-spacing: 0.3px;
    font-weight: 600;
  }

  /* ===== TWO COL GRID ===== */
  .db-two-col {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.25rem; margin-bottom: 1.25rem;
    position: relative; z-index: 2;
  }

  /* ===== CARDS ===== */
  .db-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 20px; padding: 1.25rem;
    border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden;
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
    z-index: 2;
  }
  .db-card:hover {
    border-color: rgba(255,255,255,0.1);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }
  .db-card-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1rem; padding-bottom: 0.9rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .db-card-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 1rem; font-weight: 700; color: #ffffff;
  }
  .db-card-title-icon {
    color: #60a5fa;
  }
  .db-view-btn {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.4rem 0.85rem; border-radius: 9px;
    background: rgba(59,130,246,0.1); color: #60a5fa;
    font-size: 12px; font-weight: 600;
    border: 1px solid rgba(59,130,246,0.2);
    text-decoration: none;
    transition: all 0.3s ease;
  }
  .db-view-btn:hover {
    background: rgba(59,130,246,0.2);
    border-color: rgba(59,130,246,0.4);
    transform: translateX(2px);
    color: #93c5fd;
  }
  .db-period-tag {
    display: inline-flex; align-items: center;
    padding: 0.3rem 0.7rem; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    background: rgba(139,92,246,0.12); color: #a78bfa;
    border: 1px solid rgba(139,92,246,0.2);
  }
  .db-count-badge {
    background: rgba(59,130,246,0.15); color: #60a5fa;
    padding: 0.15rem 0.5rem; border-radius: 20px;
    font-size: 11px; font-weight: 700;
    border: 1px solid rgba(59,130,246,0.2);
  }

  /* ===== SALES TIMELINE ===== */
  .db-timeline { position: relative; padding-left: 1.5rem; }
  .db-timeline::before {
    content: ''; position: absolute;
    left: 7px; top: 0; bottom: 0; width: 2px;
    background: linear-gradient(180deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent);
    border-radius: 2px;
  }
  .db-timeline-item {
    position: relative; padding: 0.6rem 0; padding-left: 1.2rem;
    animation: slideInRight 0.5s ease-out both;
  }
  .db-timeline-dot {
    position: absolute; left: -1.5rem; top: 50%;
    transform: translateY(-50%);
    width: 14px; height: 14px; border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border: 2px solid rgba(15,23,42,0.8);
    z-index: 1;
    transition: all 0.3s ease;
  }
  .db-timeline-item:hover .db-timeline-dot {
    transform: translateY(-50%) scale(1.3);
    box-shadow: 0 0 12px rgba(59,130,246,0.5);
  }
  .db-timeline-content {
    background: rgba(30,41,59,0.4); border-radius: 12px;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255,255,255,0.04);
    transition: all 0.3s ease;
  }
  .db-timeline-content:hover {
    background: rgba(30,41,59,0.6);
    border-color: rgba(59,130,246,0.15);
    transform: translateX(4px);
  }
  .db-timeline-top {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.3rem;
  }
  .db-timeline-product {
    font-size: 13px; font-weight: 600; color: #e2e8f0;
  }
  .db-timeline-amount {
    font-size: 13px; font-weight: 700; color: #4ade80;
  }
  .db-timeline-meta {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 11px; color: rgba(148,163,184,0.6);
  }
  .db-qty-badge {
    background: rgba(139,92,246,0.15); color: #c4b5fd;
    padding: 0.1rem 0.4rem; border-radius: 6px;
    font-weight: 600; font-size: 10px;
  }
  .db-empty-state {
    padding: 2.5rem; text-align: center;
    color: rgba(148,163,184,0.5); font-size: 13px;
    display: flex; flex-direction: column;
    align-items: center; gap: 0.5rem;
  }
  .db-empty-icon {
    font-size: 2rem; opacity: 0.3;
    animation: iconFloat 3s ease-in-out infinite;
  }

  /* ===== TOP PRODUCTS ===== */
  .db-top-list { display: flex; flex-direction: column; gap: 0.6rem; }
  .db-top-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 0;
    animation: slideInLeft 0.5s ease-out both;
    transition: all 0.3s ease;
  }
  .db-top-item:hover { transform: translateX(4px); }
  .db-rank-badge {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: white;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  .db-top-item:hover .db-rank-badge { transform: scale(1.15) rotate(-5deg); }
  .db-top-info { flex: 1; min-width: 0; }
  .db-top-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.4rem;
  }
  .db-top-name {
    font-size: 13px; font-weight: 600; color: #e2e8f0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .db-top-revenue {
    font-size: 13px; font-weight: 700; color: #4ade80;
    flex-shrink: 0; margin-left: 0.5rem;
  }
  .db-top-bar-track {
    height: 6px; border-radius: 3px;
    background: rgba(255,255,255,0.06);
    overflow: hidden; margin-bottom: 0.25rem;
  }
  .db-top-bar-fill {
    height: 100%; border-radius: 3px;
    animation: progressGrow 1.2s ease-out both;
    width: var(--target-width, 0%);
    position: relative;
  }
  .db-top-bar-fill::after {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    animation: shimmer 2s linear infinite;
    background-size: 200% 100%;
  }
  .db-top-units {
    font-size: 11px; color: rgba(148,163,184,0.5); font-weight: 500;
  }

  /* ===== CATEGORIES ===== */
  .db-categories-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;
  }
  .db-category-item {
    padding: 0.85rem; border-radius: 12px;
    background: rgba(30,41,59,0.4);
    border: 1px solid rgba(255,255,255,0.04);
    transition: all 0.35s ease;
    animation: fadeInScale 0.5s ease-out both;
  }
  .db-category-item:hover {
    background: rgba(30,41,59,0.6);
    border-color: rgba(255,255,255,0.08);
    transform: translateY(-2px);
  }
  .db-cat-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.5rem;
  }
  .db-cat-name {
    font-size: 13px; font-weight: 700; color: #e2e8f0;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .db-cat-dot {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0;
  }
  .db-cat-value {
    font-size: 13px; font-weight: 700; color: #4ade80;
  }
  .db-cat-bar-track {
    height: 5px; border-radius: 3px;
    background: rgba(255,255,255,0.06);
    overflow: hidden; margin-bottom: 0.4rem;
  }
  .db-cat-bar-fill {
    height: 100%; border-radius: 3px;
    animation: progressGrow 1.5s ease-out both;
    width: var(--target-width, 0%);
    transition: width 0.5s ease;
  }
  .db-cat-meta {
    display: flex; justify-content: space-between;
    font-size: 11px; color: rgba(148,163,184,0.5);
  }

  /* ===== QUICK ACTIONS ===== */
  .db-quick-actions {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.75) 100%);
    border-radius: 20px; padding: 1.25rem;
    border: 1px solid rgba(255,255,255,0.05);
    margin-top: 1.25rem;
    position: relative; z-index: 2;
    backdrop-filter: blur(10px);
  }
  .db-quick-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 1rem; font-weight: 700; color: #ffffff;
    margin-bottom: 1rem;
  }
  .db-actions-grid {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem;
  }
  .db-action-btn {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 0.5rem;
    padding: 1rem; border-radius: 14px;
    text-decoration: none; color: white;
    font-weight: 600; font-size: 12px;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    position: relative; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .db-action-btn::before {
    content: ''; position: absolute;
    top: 50%; left: 50%; width: 0; height: 0;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
    transition: all 0.5s ease;
    transform: translate(-50%, -50%);
  }
  .db-action-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px var(--shadow-color, rgba(0,0,0,0.3));
  }
  .db-action-btn:hover::before {
    width: 200px; height: 200px;
  }
  .db-action-btn:active { transform: translateY(-2px) scale(0.97); }
  .db-action-icon {
    font-size: 1.5rem; position: relative; z-index: 1;
    transition: transform 0.3s ease;
  }
  .db-action-btn:hover .db-action-icon {
    transform: scale(1.2);
  }
  .db-action-label {
    position: relative; z-index: 1;
    text-align: center; line-height: 1.2;
  }

  /* ===== LOADING SCREEN ===== */
  .db-loading-screen {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 80vh; gap: 1.5rem;
  }
  .db-loading-logo {
    position: relative; width: 70px; height: 70px;
    display: flex; align-items: center; justify-content: center;
  }
  .db-loading-ring {
    position: absolute; inset: 0;
    border: 3px solid rgba(59,130,246,0.15);
    border-top-color: #3b82f6;
    border-right-color: #8b5cf6;
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.5,0,0.5,1) infinite;
  }
  .db-loading-ring-inner {
    position: absolute; inset: 8px;
    border: 2px solid rgba(139,92,246,0.1);
    border-bottom-color: #8b5cf6;
    border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.5,0,0.5,1) infinite reverse;
  }
  .db-loading-center-icon {
    color: #60a5fa; font-size: 1.5rem;
    animation: breathe 1.5s ease-in-out infinite;
  }
  .db-loading-dots {
    display: flex; gap: 0.4rem;
  }
  .db-loading-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3b82f6;
    animation: dotPulse 1.4s ease-in-out infinite;
  }
  .db-loading-dot:nth-child(2) { animation-delay: 0.2s; background: #8b5cf6; }
  .db-loading-dot:nth-child(3) { animation-delay: 0.4s; background: #06b6d4; }
  .db-loading-text {
    color: rgba(148,163,184,0.7); font-size: 14px; font-weight: 500;
    animation: fadeInUp 0.5s ease-out 0.5s both;
  }

  /* ===== ERROR STATE ===== */
  .db-error-card {
    background: linear-gradient(145deg, rgba(127,29,29,0.25) 0%, rgba(15,23,42,0.85) 100%);
    border-radius: 18px; padding: 1.5rem;
    margin: 2rem auto; max-width: 600px;
    display: flex; align-items: center; gap: 1rem;
    border: 1px solid rgba(239,68,68,0.25);
    animation: fadeInScale 0.5s ease-out both;
  }
  .db-error-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #f87171; font-size: 1.4rem; flex-shrink: 0;
    animation: alertPulse 2s ease-in-out infinite;
  }
  .db-error-title {
    font-weight: 700; color: #fca5a5; font-size: 15px;
    margin-bottom: 0.25rem;
  }
  .db-error-msg { color: #f87171; font-size: 13px; }
  .db-retry-btn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border: none; padding: 0.65rem 1.2rem; border-radius: 10px;
    color: white; font-weight: 600; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; gap: 0.4rem;
    transition: all 0.3s ease; flex-shrink: 0;
    box-shadow: 0 4px 15px rgba(239,68,68,0.3);
  }
  .db-retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239,68,68,0.4);
  }

  /* ===== SUMMARY ROW (new component) ===== */
  .db-summary-row {
    display: flex; gap: 1rem; margin-bottom: 1.5rem;
    position: relative; z-index: 2;
  }
  .db-summary-card {
    flex: 1; border-radius: 16px; padding: 1rem 1.25rem;
    display: flex; align-items: center; gap: 1rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.4s ease;
    position: relative; overflow: hidden;
  }
  .db-summary-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--card-color-a, transparent), var(--card-color-b, transparent));
    opacity: 0.08; transition: opacity 0.3s ease;
  }
  .db-summary-card:hover::before { opacity: 0.15; }
  .db-summary-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.12);
  }
  .db-summary-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  .db-summary-card:hover .db-summary-icon {
    transform: scale(1.1);
  }
  .db-summary-info { flex: 1; }
  .db-summary-label {
    font-size: 11px; color: rgba(148,163,184,0.6);
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 0.15rem;
  }
  .db-summary-value {
    font-size: 1.1rem; font-weight: 700; color: #ffffff;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1200px) {
    .db-metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .db-period-grid { grid-template-columns: repeat(2, 1fr); }
    .db-actions-grid { grid-template-columns: repeat(3, 1fr); }
    .db-categories-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .db-root { padding: 1rem; }
    .db-header { flex-direction: column; gap: 1rem; }
    .db-metrics-grid { grid-template-columns: 1fr; }
    .db-two-col { grid-template-columns: 1fr; }
    .db-period-grid { grid-template-columns: 1fr; }
    .db-actions-grid { grid-template-columns: repeat(2, 1fr); }
    .db-fin-header { flex-direction: column; align-items: flex-start; }
    .db-summary-row { flex-direction: column; }
  }
`;

/* ─────────────────────────────────────────────
   ANIMATED COUNTER COMPONENT
   ───────────────────────────────────────────── */

function AnimatedCounter({ value, prefix = '', suffix = '', isCurrency = false, duration = 1800 }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (numVal === 0) { setDisplay(0); return; }

    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(eased * numVal);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value, duration]);

  const formatted = isCurrency
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(display)
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(display));

  return <span>{prefix}{formatted}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   LIVE CLOCK COMPONENT
   ───────────────────────────────────────────── */

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="db-clock">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

/* ─────────────────────────────────────────────
   GREETING HELPER
   ───────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/* ─────────────────────────────────────────────
   MINI SPARKLINE (random visual for metric cards)
   ───────────────────────────────────────────── */

function MiniSparkline({ color, delay = 0 }) {
  const bars = [35, 55, 40, 70, 45, 80, 60, 50, 75, 65];
  return (
    <div className="db-metric-sparkline" style={{ color }}>
      {bars.map((h, i) => (
        <div
          key={i}
          className="db-spark-bar"
          style={{
            height: `${h}%`,
            background: color,
            animationDelay: `${delay + i * 0.06}s`,
            opacity: 0.3 + (h / 100) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
   ───────────────────────────────────────────── */

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData(year = selectedYear, month = selectedMonth, week = selectedWeek) {
    try {
      setLoading(prev => !data ? true : prev);
      setRefreshing(true);
      setError(null);
      let url = `/api/analytics/dashboard?year=${year}&month=${month}`;
      if (week) url += `&week=${week}`;
      const res = await fetch(url);
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Failed to fetch dashboard data');
      setData(result.data);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleYearChange(e) {
    const y = parseInt(e.target.value);
    setSelectedYear(y);
    fetchDashboardData(y, selectedMonth, selectedWeek);
  }
  function handleMonthChange(e) {
    const m = parseInt(e.target.value);
    setSelectedMonth(m);
    fetchDashboardData(selectedYear, m, selectedWeek);
  }
  function handleWeekChange(e) {
    const w = e.target.value ? parseInt(e.target.value) : '';
    setSelectedWeek(w);
    fetchDashboardData(selectedYear, selectedMonth, w);
  }
  function resetToCurrentPeriod() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1;
    setSelectedYear(y); setSelectedMonth(m); setSelectedWeek('');
    fetchDashboardData(y, m, '');
  }

  function formatCurrency(v) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v || 0);
  }
  function formatNumber(v) {
    return new Intl.NumberFormat('en-US').format(v || 0);
  }

  /* ── LOADING STATE ── */
  if (loading && !data) {
    return (
      <div className="db-root">
        <style>{globalCSS}</style>
        <div className="db-orb db-orb-1" />
        <div className="db-orb db-orb-2" />
        <div className="db-loading-screen">
          <div className="db-loading-logo">
            <div className="db-loading-ring" />
            <div className="db-loading-ring-inner" />
            <span className="db-loading-center-icon"><HiOutlineChartBar size={28} /></span>
          </div>
          <div className="db-loading-dots">
            <span className="db-loading-dot" />
            <span className="db-loading-dot" />
            <span className="db-loading-dot" />
          </div>
          <p className="db-loading-text">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  /* ── ERROR STATE ── */
  if (error && !data) {
    return (
      <div className="db-root">
        <style>{globalCSS}</style>
        <div className="db-orb db-orb-1" />
        <div className="db-error-card">
          <div className="db-error-icon"><HiOutlineExclamationTriangle size={24} /></div>
          <div style={{ flex: 1 }}>
            <p className="db-error-title">Error Loading Dashboard</p>
            <p className="db-error-msg">{error}</p>
          </div>
          <button className="db-retry-btn" onClick={() => fetchDashboardData()}>
            <HiOutlineArrowPath size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const { inventory, sales, purchases, periodStats, alerts, recentSales, topProducts, categories } = data || {};

  /* ── METRIC CARDS DATA ── */
  const metricsData = [
    {
      icon: <HiOutlineCube size={22} />, label: 'Total Products',
      value: inventory?.TotalProducts, isCurrency: false,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: '#3b82f6', sparkDelay: 0.6,
    },
    {
      icon: <HiOutlineBanknotes size={22} />, label: 'Inventory Value',
      value: inventory?.TotalInventoryValue, isCurrency: true,
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: '#06b6d4', sparkDelay: 0.7,
    },
    {
      icon: <HiOutlineArrowTrendingUp size={22} />, label: "Monthly Revenue",
      value: sales?.TotalRevenue, isCurrency: true,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: '#22c55e', sparkDelay: 0.8,
    },
    {
      icon: <HiOutlineShoppingCart size={22} />, label: 'Sales This Month',
      value: sales?.TotalSales, isCurrency: false,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: '#8b5cf6', sparkDelay: 0.9,
    },
    {
      icon: <HiOutlineExclamationTriangle size={22} />, label: 'Low Stock Items',
      value: inventory?.LowStockProducts, isCurrency: false,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: '#f59e0b', sparkDelay: 1.0,
      isAlert: (inventory?.LowStockProducts || 0) > 0,
    },
    {
      icon: <HiOutlineXCircle size={22} />, label: 'Out of Stock',
      value: inventory?.OutOfStockProducts, isCurrency: false,
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#ef4444', sparkDelay: 1.1,
      isCritical: (inventory?.OutOfStockProducts || 0) > 0,
    },
    {
      icon: <HiOutlineBell size={22} />, label: 'Active Alerts',
      value: alerts?.TotalUnresolvedAlerts, isCurrency: false,
      gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      color: '#f43f5e', sparkDelay: 1.2,
      isCritical: (alerts?.TotalUnresolvedAlerts || 0) > 5,
    },
    {
      icon: <HiOutlineInboxArrowDown size={22} />, label: 'Purchases This Month',
      value: purchases?.TotalPurchaseCost, isCurrency: true,
      gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      color: '#0ea5e9', sparkDelay: 1.3,
    },
  ];

  /* ── QUICK ACTIONS DATA ── */
  const actionsData = [
    { href: '/products/add', icon: <HiOutlinePlusCircle size={22} />, label: 'Add Product', bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59,130,246,0.35)' },
    { href: '/sales/add', icon: <HiOutlineShoppingCart size={22} />, label: 'New Sale', bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34,197,94,0.35)' },
    { href: '/purchases/add', icon: <HiOutlineInboxArrowDown size={22} />, label: 'New Purchase', bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', shadow: 'rgba(6,182,212,0.35)' },
    { href: '/alerts/low-stock', icon: <HiOutlineExclamationTriangle size={22} />, label: 'Low Stock', bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.35)' },
    { href: '/alerts', icon: <HiOutlineBell size={22} />, label: 'View Alerts', bg: 'linear-gradient(135deg, #ef4444, #dc2626)', shadow: 'rgba(239,68,68,0.35)' },
  ];

  const monthLabel = MONTHS.find(m => m.value === selectedMonth)?.label || '';

  return (
    <div className="db-root">
      <style>{globalCSS}</style>

      {/* ── Background Orbs ── */}
      <div className="db-orb db-orb-1" />
      <div className="db-orb db-orb-2" />
      <div className="db-orb db-orb-3" />

      {/* ══════════ HEADER ══════════ */}
      <header className="db-header">
        <div className="db-header-left">
          <div className="db-greeting-row">
            <div className="db-greeting-icon"><HiOutlineSparkles size={24} /></div>
            <h1 className="db-greeting-text">{getGreeting()}</h1>
          </div>
          <div className="db-subtitle">
            <span className="db-status-dot" />
            <span>System Online</span>
            <span style={{ color: 'rgba(148,163,184,0.3)' }}>•</span>
            <LiveClock />
          </div>
        </div>
        <div className="db-header-actions">
          <button
            className="db-refresh-btn"
            onClick={() => fetchDashboardData(selectedYear, selectedMonth, selectedWeek)}
            disabled={refreshing}
          >
            <HiOutlineArrowPath
              size={16}
              className="db-spin-icon"
              style={refreshing ? { animation: 'spin 1s linear infinite' } : {}}
            />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      {/* ── Wave Divider ── */}
      <div className="db-wave-divider">
        <svg className="db-wave-svg" viewBox="0 0 1000 30" preserveAspectRatio="none">
          <path d="M0,15 C150,30 350,0 500,15 C650,30 850,0 1000,15 L1000,30 L0,30 Z" fill="rgba(59,130,246,0.3)" />
          <path d="M0,20 C200,5 300,25 500,20 C700,15 800,28 1000,20 L1000,30 L0,30 Z" fill="rgba(139,92,246,0.2)" />
        </svg>
      </div>

      {/* ══════════ SUMMARY ROW (NEW) ══════════ */}
      <div className="db-summary-row">
        <div className="db-summary-card anim-entry" style={{ '--card-color-a': '#3b82f6', '--card-color-b': '#8b5cf6', animationDelay: '0.1s' }}>
          <div className="db-summary-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <HiOutlineRocketLaunch size={20} />
          </div>
          <div className="db-summary-info">
            <div className="db-summary-label">Today's Status</div>
            <div className="db-summary-value" style={{ color: '#4ade80' }}>
              {(alerts?.TotalUnresolvedAlerts || 0) === 0 ? 'All Clear' : `${alerts?.TotalUnresolvedAlerts} Alert${alerts?.TotalUnresolvedAlerts > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
        <div className="db-summary-card anim-entry" style={{ '--card-color-a': '#22c55e', '--card-color-b': '#06b6d4', animationDelay: '0.2s' }}>
          <div className="db-summary-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #06b6d4)' }}>
            <HiOutlineFire size={20} />
          </div>
          <div className="db-summary-info">
            <div className="db-summary-label">Monthly Profit</div>
            <div className="db-summary-value" style={{ color: (periodStats?.monthly?.grossProfit || 0) >= 0 ? '#4ade80' : '#f87171' }}>
              {formatCurrency(periodStats?.monthly?.grossProfit)}
            </div>
          </div>
        </div>
        <div className="db-summary-card anim-entry" style={{ '--card-color-a': '#f59e0b', '--card-color-b': '#ef4444', animationDelay: '0.3s' }}>
          <div className="db-summary-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <HiOutlineArchiveBox size={20} />
          </div>
          <div className="db-summary-info">
            <div className="db-summary-label">Total Stock Units</div>
            <div className="db-summary-value">
              <AnimatedCounter value={categories?.reduce((a, c) => a + (c.TotalStock || 0), 0) || 0} />
            </div>
          </div>
        </div>
        <div className="db-summary-card anim-entry" style={{ '--card-color-a': '#8b5cf6', '--card-color-b': '#ec4899', animationDelay: '0.4s' }}>
          <div className="db-summary-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
            <HiOutlineCheckBadge size={20} />
          </div>
          <div className="db-summary-info">
            <div className="db-summary-label">Categories</div>
            <div className="db-summary-value">
              <AnimatedCounter value={categories?.length || 0} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ METRICS GRID ══════════ */}
      <div className="db-metrics-grid">
        {metricsData.map((m, i) => (
          <div
            key={i}
            className={`db-metric-card anim-entry ${m.isAlert ? 'db-alert-card' : ''} ${m.isCritical ? 'db-alert-critical' : ''}`}
            style={{ animationDelay: `${0.15 + i * 0.08}s` }}
          >
            <div className="db-metric-glow" style={{ background: m.color }} />
            <div className="db-metric-top">
              <div className="db-metric-icon-wrap" style={{ background: m.gradient }}>
                {m.icon}
              </div>
              <MiniSparkline color={m.color} delay={m.sparkDelay} />
            </div>
            <div className="db-metric-value">
              <AnimatedCounter value={m.value} isCurrency={m.isCurrency} duration={1500 + i * 150} />
            </div>
            <div className="db-metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* ══════════ FINANCIAL OVERVIEW ══════════ */}
      <section className="db-financial-section anim-entry" style={{ animationDelay: '0.6s' }}>
        <div className="db-fin-glow" />

        <div className="db-fin-header">
          <div className="db-section-title">
            <div className="db-section-title-icon">
              <HiOutlineArrowTrendingUp size={18} />
            </div>
            <span>Financial Overview</span>
          </div>

          <div className="db-controls-row">
            <div className="db-control-group">
              <label className="db-control-label">Year</label>
              <select value={selectedYear} onChange={handleYearChange} className="db-select">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="db-control-group">
              <label className="db-control-label">Month</label>
              <select value={selectedMonth} onChange={handleMonthChange} className="db-select">
                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="db-control-group">
              <label className="db-control-label">Week</label>
              <select value={selectedWeek} onChange={handleWeekChange} className="db-select">
                <option value="">All</option>
                {WEEKS.map(w => <option key={w} value={w}>Week {w}</option>)}
              </select>
            </div>
            <button className="db-reset-btn" onClick={resetToCurrentPeriod}>
              <HiOutlineArrowPath size={13} /> Current
            </button>
          </div>
        </div>

        <div className="db-period-badge">
          <HiOutlineCalendarDays size={14} />
          Showing: <strong>{monthLabel} {selectedYear}</strong>
          {selectedWeek && <span> • <strong>Week {selectedWeek}</strong></span>}
        </div>

        {/* Period Grid */}
        <div className="db-period-grid">
          {/* Weekly Card */}
          <div className="db-period-card db-period-card-weekly anim-entry" style={{ animationDelay: '0.7s', borderLeft: '3px solid #3b82f6' }}>
            <h3 className="db-period-title" style={{ color: '#60a5fa' }}>
              <HiOutlineCalendarDays size={14} />
              Week {periodStats?.weekly?.weekNumber || periodStats?.currentWeek || '—'} {!selectedWeek && '(Current)'}
            </h3>
            <div>
              <div className="db-period-row">
                <span className="db-period-label">Sales ({periodStats?.weekly?.salesCount || 0})</span>
                <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.weekly?.sales)}</strong>
              </div>
              <div className="db-period-row">
                <span className="db-period-label">Purchases</span>
                <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.weekly?.purchases)}</strong>
              </div>
              <div className="db-period-row">
                <span className="db-period-label">COGS</span>
                <span style={{ color: 'rgba(226,232,240,0.7)' }}>{formatCurrency(periodStats?.weekly?.cogs)}</span>
              </div>
              <hr className="db-period-divider" />
              <div className="db-period-row">
                <strong style={{ color: '#e2e8f0' }}>Gross Profit</strong>
                <span className={`db-profit-value ${(periodStats?.weekly?.grossProfit || 0) >= 0 ? 'db-profit-positive' : 'db-profit-negative'}`}>
                  {(periodStats?.weekly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.weekly?.grossProfit)}
                </span>
              </div>
            </div>
            {/* Mini Bar Chart */}
            <div className="db-bar-chart">
              {[
                { label: 'Sales', value: periodStats?.weekly?.sales || 0, color: '#4ade80' },
                { label: 'Cost', value: periodStats?.weekly?.cogs || 0, color: '#f59e0b' },
                { label: 'Profit', value: Math.abs(periodStats?.weekly?.grossProfit || 0), color: (periodStats?.weekly?.grossProfit || 0) >= 0 ? '#22c55e' : '#ef4444' },
              ].map((b, i) => {
                const maxVal = Math.max(periodStats?.weekly?.sales || 1, periodStats?.weekly?.cogs || 1, Math.abs(periodStats?.weekly?.grossProfit || 1));
                const pct = maxVal > 0 ? Math.max((b.value / maxVal) * 50, 4) : 4;
                return (
                  <div key={i} className="db-bar-item">
                    <div className="db-bar" style={{ '--target-height': `${pct}px`, background: b.color, animationDelay: `${0.8 + i * 0.15}s` }} />
                    <span className="db-bar-label">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Card */}
          <div className="db-period-card db-period-card-monthly anim-entry" style={{ animationDelay: '0.8s', borderLeft: '3px solid #22c55e' }}>
            <h3 className="db-period-title" style={{ color: '#4ade80' }}>
              <HiOutlineCalendarDays size={14} /> {monthLabel} {selectedYear}
            </h3>
            <div>
              <div className="db-period-row">
                <span className="db-period-label">Sales ({periodStats?.monthly?.salesCount || 0})</span>
                <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.monthly?.sales)}</strong>
              </div>
              <div className="db-period-row">
                <span className="db-period-label">Purchases</span>
                <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.monthly?.purchases)}</strong>
              </div>
              <div className="db-period-row">
                <span className="db-period-label">COGS</span>
                <span style={{ color: 'rgba(226,232,240,0.7)' }}>{formatCurrency(periodStats?.monthly?.cogs)}</span>
              </div>
              <hr className="db-period-divider" />
              <div className="db-period-row">
                <strong style={{ color: '#e2e8f0' }}>Gross Profit</strong>
                <span className={`db-profit-value ${(periodStats?.monthly?.grossProfit || 0) >= 0 ? 'db-profit-positive' : 'db-profit-negative'}`}>
                  {(periodStats?.monthly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.monthly?.grossProfit)}
                </span>
              </div>
            </div>
            <div className="db-bar-chart">
              {[
                { label: 'Sales', value: periodStats?.monthly?.sales || 0, color: '#4ade80' },
                { label: 'Cost', value: periodStats?.monthly?.cogs || 0, color: '#f59e0b' },
                { label: 'Profit', value: Math.abs(periodStats?.monthly?.grossProfit || 0), color: (periodStats?.monthly?.grossProfit || 0) >= 0 ? '#22c55e' : '#ef4444' },
              ].map((b, i) => {
                const maxVal = Math.max(periodStats?.monthly?.sales || 1, periodStats?.monthly?.cogs || 1, Math.abs(periodStats?.monthly?.grossProfit || 1));
                const pct = maxVal > 0 ? Math.max((b.value / maxVal) * 50, 4) : 4;
                return (
                  <div key={i} className="db-bar-item">
                    <div className="db-bar" style={{ '--target-height': `${pct}px`, background: b.color, animationDelay: `${0.9 + i * 0.15}s` }} />
                    <span className="db-bar-label">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yearly Card */}
          <div className="db-period-card db-period-card-yearly anim-entry" style={{ animationDelay: '0.9s', borderLeft: '3px solid #f59e0b' }}>
            <h3 className="db-period-title" style={{ color: '#fbbf24' }}>
              <HiOutlineCalendarDays size={14} /> Year {selectedYear}
            </h3>
            <div>
              <div className="db-period-row">
                <span className="db-period-label">Sales ({periodStats?.yearly?.salesCount || 0})</span>
                <strong style={{ color: '#4ade80' }}>{formatCurrency(periodStats?.yearly?.sales)}</strong>
              </div>
              <div className="db-period-row">
                <span className="db-period-label">Purchases</span>
                <strong style={{ color: '#38bdf8' }}>{formatCurrency(periodStats?.yearly?.purchases)}</strong>
              </div>
              <div className="db-period-row">
                <span className="db-period-label">COGS</span>
                <span style={{ color: 'rgba(226,232,240,0.7)' }}>{formatCurrency(periodStats?.yearly?.cogs)}</span>
              </div>
              <hr className="db-period-divider" />
              <div className="db-period-row">
                <strong style={{ color: '#e2e8f0' }}>Gross Profit</strong>
                <span className={`db-profit-value ${(periodStats?.yearly?.grossProfit || 0) >= 0 ? 'db-profit-positive' : 'db-profit-negative'}`}>
                  {(periodStats?.yearly?.grossProfit || 0) >= 0 ? '+' : ''}{formatCurrency(periodStats?.yearly?.grossProfit)}
                </span>
              </div>
            </div>
            <div className="db-bar-chart">
              {[
                { label: 'Sales', value: periodStats?.yearly?.sales || 0, color: '#4ade80' },
                { label: 'Cost', value: periodStats?.yearly?.cogs || 0, color: '#f59e0b' },
                { label: 'Profit', value: Math.abs(periodStats?.yearly?.grossProfit || 0), color: (periodStats?.yearly?.grossProfit || 0) >= 0 ? '#22c55e' : '#ef4444' },
              ].map((b, i) => {
                const maxVal = Math.max(periodStats?.yearly?.sales || 1, periodStats?.yearly?.cogs || 1, Math.abs(periodStats?.yearly?.grossProfit || 1));
                const pct = maxVal > 0 ? Math.max((b.value / maxVal) * 50, 4) : 4;
                return (
                  <div key={i} className="db-bar-item">
                    <div className="db-bar" style={{ '--target-height': `${pct}px`, background: b.color, animationDelay: `${1.0 + i * 0.15}s` }} />
                    <span className="db-bar-label">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TWO COLUMN: RECENT SALES + TOP PRODUCTS ══════════ */}
      <div className="db-two-col">
        {/* ── Recent Sales (Timeline) ── */}
        <div className="db-card anim-entry" style={{ animationDelay: '0.8s' }}>
          <div className="db-card-header">
            <div className="db-card-title">
              <span className="db-card-title-icon"><HiOutlineShoppingCart size={18} /></span>
              <span>Recent Sales</span>
              {recentSales && <span className="db-count-badge">{recentSales.length}</span>}
            </div>
            <Link href="/sales" className="db-view-btn">
              View All <HiOutlineChevronRight size={12} />
            </Link>
          </div>

          {recentSales && recentSales.length > 0 ? (
            <div className="db-timeline">
              {recentSales.map((sale, i) => (
                <div
                  key={sale.SaleID}
                  className="db-timeline-item"
                  style={{ animationDelay: `${0.9 + i * 0.1}s` }}
                >
                  <div className="db-timeline-dot" />
                  <div className="db-timeline-content">
                    <div className="db-timeline-top">
                      <span className="db-timeline-product">{sale.ProductName}</span>
                      <span className="db-timeline-amount">{formatCurrency(sale.TotalAmount)}</span>
                    </div>
                    <div className="db-timeline-meta">
                      <span className="db-qty-badge">×{sale.Quantity}</span>
                      <span>{new Date(sale.SaleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="db-empty-state">
              <span className="db-empty-icon"><HiOutlineInboxStack size={32} /></span>
              <span>No recent sales found</span>
            </div>
          )}
        </div>

        {/* ── Top Products (Ranked Bars) ── */}
        <div className="db-card anim-entry" style={{ animationDelay: '0.9s' }}>
          <div className="db-card-header">
            <div className="db-card-title">
              <span className="db-card-title-icon"><HiOutlineTrophy size={18} /></span>
              <span>Top Selling Products</span>
            </div>
            <span className="db-period-tag">This Month</span>
          </div>

          {topProducts && topProducts.length > 0 ? (
            <div className="db-top-list">
              {topProducts.map((product, i) => {
                const maxRev = topProducts[0]?.Revenue || 1;
                const pct = Math.max((product.Revenue / maxRev) * 100, 5);
                return (
                  <div
                    key={product.ProductID}
                    className="db-top-item"
                    style={{ animationDelay: `${1.0 + i * 0.1}s` }}
                  >
                    <div
                      className="db-rank-badge"
                      style={{ background: RANK_COLORS[i] || RANK_COLORS[3] }}
                    >
                      {i + 1}
                    </div>
                    <div className="db-top-info">
                      <div className="db-top-row">
                        <span className="db-top-name">{product.ProductName}</span>
                        <span className="db-top-revenue">{formatCurrency(product.Revenue)}</span>
                      </div>
                      <div className="db-top-bar-track">
                        <div
                          className="db-top-bar-fill"
                          style={{
                            '--target-width': `${pct}%`,
                            background: RANK_COLORS[i] || RANK_COLORS[3],
                            animationDelay: `${1.1 + i * 0.15}s`,
                          }}
                        />
                      </div>
                      <span className="db-top-units">{formatNumber(product.UnitsSold)} units sold</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="db-empty-state">
              <span className="db-empty-icon"><HiOutlineChartBar size={32} /></span>
              <span>No sales data for this month</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ CATEGORY DISTRIBUTION ══════════ */}
      <div className="db-card anim-entry" style={{ animationDelay: '1s', marginBottom: '1.25rem' }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <span className="db-card-title-icon"><HiOutlineTag size={18} /></span>
            <span>Category Distribution</span>
          </div>
          <Link href="/categories" className="db-view-btn">
            Manage <HiOutlineChevronRight size={12} />
          </Link>
        </div>

        {categories && categories.length > 0 ? (
          <div className="db-categories-grid">
            {categories.map((cat, i) => {
              const maxVal = Math.max(...categories.map(c => c.InventoryValue || 0), 1);
              const pct = Math.max(((cat.InventoryValue || 0) / maxVal) * 100, 3);
              const clr = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <div
                  key={i}
                  className="db-category-item"
                  style={{ animationDelay: `${1.1 + i * 0.08}s` }}
                >
                  <div className="db-cat-header">
                    <span className="db-cat-name">
                      <span className="db-cat-dot" style={{ background: clr }} />
                      {cat.CategoryName}
                    </span>
                    <span className="db-cat-value">{formatCurrency(cat.InventoryValue)}</span>
                  </div>
                  <div className="db-cat-bar-track">
                    <div
                      className="db-cat-bar-fill"
                      style={{
                        '--target-width': `${pct}%`,
                        background: `linear-gradient(90deg, ${clr}, ${clr}88)`,
                        animationDelay: `${1.2 + i * 0.1}s`,
                      }}
                    />
                  </div>
                  <div className="db-cat-meta">
                    <span>{formatNumber(cat.ProductCount)} products</span>
                    <span>{formatNumber(cat.TotalStock)} units</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="db-empty-state">
            <span className="db-empty-icon"><HiOutlineFolderOpen size={32} /></span>
            <span>No categories found</span>
          </div>
        )}
      </div>

      {/* ══════════ QUICK ACTIONS ══════════ */}
      <section className="db-quick-actions anim-entry" style={{ animationDelay: '1.1s' }}>
        <h2 className="db-quick-title">
          <HiOutlineBolt size={20} /> Quick Actions
        </h2>
        <div className="db-actions-grid">
          {actionsData.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="db-action-btn"
              style={{
                background: action.bg,
                '--shadow-color': action.shadow,
                animationDelay: `${1.2 + i * 0.08}s`,
              }}
            >
              <div className="db-action-icon">{action.icon}</div>
              <span className="db-action-label">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}