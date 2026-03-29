'use client';

import { useState, useEffect, useRef } from 'react';
import {
  HiOutlineBuildingOffice,
  HiOutlineXMark,
  HiOutlinePlusCircle,
  HiOutlineExclamationTriangle,
  HiOutlineCube,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineGlobeAlt,
  HiOutlineArchiveBox,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
  HiOutlineArrowPath,
  HiOutlineMagnifyingGlass,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineCheckCircle,
  HiOutlineRocketLaunch,
  HiOutlineEllipsisHorizontal,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineEye,
  HiOutlineFire,
  HiOutlineSignal,
  HiOutlineArrowTrendingUp,
  HiOutlineBolt,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineMapPinIcon,
  HiOutlineHomeModern,
  HiOutlineTruck,
  HiOutlineCalendarDays,
  HiOutlineShieldCheck,
  HiOutlineWrenchScrewdriver,
  HiOutlineMap,
} from 'react-icons/hi2';

/* ─────────────────────────────────────
   CSS
   ───────────────────────────────────── */

const globalCSS = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(35px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-35px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(35px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes entranceBlur {
    from { opacity: 0; filter: blur(12px); transform: translateY(20px); }
    to   { opacity: 1; filter: blur(0); transform: translateY(0); }
  }
  @keyframes orbDrift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    25%     { transform: translate(70px,-50px) scale(1.12); }
    50%     { transform: translate(-35px,35px) scale(0.9); }
    75%     { transform: translate(55px,25px) scale(1.05); }
  }
  @keyframes orbDrift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    25%     { transform: translate(-60px,45px) scale(0.95); }
    50%     { transform: translate(45px,-28px) scale(1.1); }
    75%     { transform: translate(-25px,-45px) scale(1); }
  }
  @keyframes orbDrift3 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(45px,55px) scale(1.07); }
    66%     { transform: translate(-55px,-18px) scale(0.93); }
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
    0%,100% { transform: scale(1); opacity: 1; }
    50%     { transform: scale(1.25); opacity: 0.6; }
  }
  @keyframes iconFloat {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-5px) rotate(3deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes progressGrow {
    from { width: 0%; }
    to   { width: var(--target-width, 0%); }
  }
  @keyframes successPop {
    0%   { transform: scale(0.5); opacity: 0; }
    50%  { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes errorShake {
    0%,100% { transform: translateX(0); }
    10%,30%,50%,70%,90% { transform: translateX(-4px); }
    20%,40%,60%,80% { transform: translateX(4px); }
  }
  @keyframes cardShine {
    0%   { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes dotPulse {
    0%,80%,100% { transform: scale(0); opacity: 0; }
    40%          { transform: scale(1); opacity: 1; }
  }
  @keyframes confettiDrop {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(40px) rotate(360deg); opacity: 0; }
  }
  @keyframes sparkBarGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.92) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes rowHighlight {
    0%   { background: rgba(34,197,94,0.15); }
    100% { background: transparent; }
  }
  @keyframes waveSlide {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes gaugeRotate {
    from { stroke-dashoffset: var(--gauge-circumference, 251); }
    to   { stroke-dashoffset: var(--gauge-offset, 251); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 15px rgba(99,102,241,0.2); }
    50%     { box-shadow: 0 0 35px rgba(99,102,241,0.5), 0 0 60px rgba(139,92,246,0.15); }
  }
  @keyframes mapPulse {
    0%,100% { transform: scale(1); opacity: 0.7; }
    50%     { transform: scale(1.8); opacity: 0; }
  }
  @keyframes stockBarRise {
    from { height: 0; }
    to   { height: var(--bar-height, 0px); }
  }
  @keyframes slideRevealLeft {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
  @keyframes capacityPulse {
    0%   { opacity: 0.4; }
    50%  { opacity: 0.8; }
    100% { opacity: 0.4; }
  }
  @keyframes counterPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }

  /* === ROOT === */
  .wh-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0a0f1e 0%, #0f172a 30%, #1a1040 60%, #0f172a 100%);
    padding: 1.5rem 2rem 3rem;
    position: relative; overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  }

  /* === ORBS === */
  .wh-orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
  .wh-orb-1 { width: 460px; height: 460px; background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%); top: -8%; left: -4%; animation: orbDrift1 26s ease-in-out infinite; }
  .wh-orb-2 { width: 390px; height: 390px; background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%); top: 48%; right: -6%; animation: orbDrift2 30s ease-in-out infinite; }
  .wh-orb-3 { width: 310px; height: 310px; background: radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%); bottom: -4%; left: 30%; animation: orbDrift3 22s ease-in-out infinite; }

  .wh-content { position: relative; z-index: 2; }
  .anim-entry { animation: entranceBlur 0.65s ease-out both; }

  /* === HEADER === */
  .wh-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.75rem; padding: 1.5rem 1.75rem;
    background: linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.85) 100%);
    border-radius: 22px; border: 1px solid rgba(99,102,241,0.12);
    backdrop-filter: blur(20px); position: relative; overflow: hidden;
    animation: fadeInDown 0.7s ease-out both;
  }
  .wh-header::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #22c55e, #6366f1);
    background-size: 300% 100%; animation: gradientFlow 5s linear infinite;
  }
  .wh-header-glow {
    position: absolute; top: -50%; left: -30%; width: 200%; height: 200%;
    background: radial-gradient(circle at 20% 30%, rgba(99,102,241,0.06) 0%, transparent 50%);
    pointer-events: none;
  }
  .wh-header-left { position: relative; z-index: 1; }
  .wh-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem; }
  .wh-header-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    display: flex; align-items: center; justify-content: center;
    color: white; box-shadow: 0 6px 22px rgba(99,102,241,0.4);
    animation: iconFloat 3s ease-in-out infinite;
  }
  .wh-header-title {
    font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #ffffff 100%);
    background-size: 200% auto; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text;
    animation: textShine 4s linear infinite;
  }
  .wh-header-subtitle {
    color: rgba(148,163,184,0.7); font-size: 0.88rem;
    display: flex; align-items: center; gap: 0.5rem; margin-left: 3.85rem;
  }
  .wh-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #22c55e; display: inline-block; position: relative;
  }
  .wh-status-dot::after {
    content: ''; position: absolute; inset: -3px; border-radius: 50%;
    background: rgba(34,197,94,0.4); animation: breathe 2s ease-in-out infinite;
  }
  .wh-header-actions { display: flex; gap: 0.65rem; position: relative; z-index: 1; }
  .wh-add-btn {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none; padding: 0.7rem 1.35rem; border-radius: 12px;
    color: white; font-weight: 700; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    position: relative; overflow: hidden;
  }
  .wh-add-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s ease;
  }
  .wh-add-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
  .wh-add-btn:hover::before { left: 100%; }
  .wh-add-btn:active { transform: translateY(0) scale(0.98); }
  .wh-refresh-btn {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    padding: 0.7rem; border-radius: 12px; color: #94a3b8; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.35s ease;
  }
  .wh-refresh-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(99,102,241,0.3); color: #e2e8f0; }
  .wh-refresh-btn:hover .wh-refresh-icon { transform: rotate(180deg); }
  .wh-refresh-icon { transition: transform 0.5s ease; display: flex; }

  /* === WAVE === */
  .wh-wave { position: relative; height: 25px; margin: 0.25rem 0 1.25rem; overflow: hidden; opacity: 0.12; z-index: 1; }
  .wh-wave-svg { position: absolute; bottom: 0; width: 200%; height: 100%; animation: waveSlide 9s linear infinite; }

  /* === STATS === */
  .wh-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .wh-stat-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 18px; padding: 1.2rem; border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden; cursor: default;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    backdrop-filter: blur(10px);
  }
  .wh-stat-card::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
    transition: left 0.7s ease;
  }
  .wh-stat-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.1);
    box-shadow: 0 18px 40px rgba(0,0,0,0.25); }
  .wh-stat-card:hover::before { left: 150%; }
  .wh-stat-card:hover .wh-stat-icon { transform: scale(1.1) rotate(-5deg); }
  .wh-stat-glow {
    position: absolute; top: -15px; right: -15px; width: 90px; height: 90px;
    border-radius: 50%; filter: blur(35px); opacity: 0.3; pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .wh-stat-card:hover .wh-stat-glow { opacity: 0.55; }
  .wh-stat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; }
  .wh-stat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .wh-stat-spark { display: flex; align-items: flex-end; gap: 2px; height: 26px; opacity: 0.4; }
  .wh-spark-bar { width: 4px; border-radius: 2px; transform-origin: bottom; animation: sparkBarGrow 0.7s ease-out both; }
  .wh-stat-value { font-size: 1.55rem; font-weight: 800; color: #fff; margin-bottom: 0.15rem; position: relative; z-index: 1; }
  .wh-stat-label { font-size: 0.78rem; color: rgba(148,163,184,0.65); font-weight: 500; position: relative; z-index: 1; }

  /* === STOCK DISTRIBUTION === */
  .wh-distrib {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.75) 100%);
    border-radius: 18px; padding: 1.25rem; border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 1.5rem; backdrop-filter: blur(10px); transition: all 0.4s ease;
  }
  .wh-distrib:hover { border-color: rgba(255,255,255,0.08); }
  .wh-distrib-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-bottom: 1rem;
  }
  .wh-distrib-title-icon { color: #818cf8; display: flex; }
  .wh-distrib-bars {
    display: flex; align-items: flex-end; gap: 0.5rem;
    height: 100px; padding-bottom: 1.5rem; position: relative;
  }
  .wh-distrib-bars::after {
    content: ''; position: absolute; bottom: 1.5rem; left: 0; right: 0;
    height: 1px; background: rgba(255,255,255,0.05);
  }
  .wh-distrib-col {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
    position: relative;
  }
  .wh-distrib-bar {
    width: 100%; max-width: 50px; border-radius: 6px 6px 0 0;
    position: relative; overflow: hidden; min-height: 4px;
    animation: stockBarRise 1s ease-out both;
    transition: all 0.35s ease;
  }
  .wh-distrib-bar::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  }
  .wh-distrib-col:hover .wh-distrib-bar { opacity: 0.85; transform: scaleX(1.1); }
  .wh-distrib-col:hover .wh-distrib-bar::after { animation: cardShine 0.8s ease-out both; }
  .wh-distrib-bar-label {
    font-size: 9px; color: rgba(148,163,184,0.45); text-align: center;
    max-width: 60px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;
  }
  .wh-distrib-bar-value {
    position: absolute; top: -18px; left: 50%; transform: translateX(-50%);
    font-size: 10px; font-weight: 700; color: rgba(226,232,240,0.7);
    opacity: 0; transition: opacity 0.3s ease; white-space: nowrap;
  }
  .wh-distrib-col:hover .wh-distrib-bar-value { opacity: 1; }

  /* === TOOLBAR === */
  .wh-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap;
  }
  .wh-search-wrap { position: relative; flex: 1; max-width: 360px; }
  .wh-search-icon {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    color: rgba(148,163,184,0.4); pointer-events: none; display: flex;
    transition: color 0.3s ease;
  }
  .wh-search-wrap:focus-within .wh-search-icon { color: #6366f1; }
  .wh-search {
    width: 100%; padding: 0.7rem 1rem 0.7rem 2.5rem; border-radius: 12px;
    border: 1.5px solid rgba(99,102,241,0.15); background: rgba(15,23,42,0.5);
    color: #e2e8f0; font-size: 13px; outline: none; transition: all 0.35s ease;
  }
  .wh-search::placeholder { color: rgba(148,163,184,0.35); }
  .wh-search:hover { border-color: rgba(99,102,241,0.3); }
  .wh-search:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); background: rgba(15,23,42,0.65); }
  .wh-search-clear {
    position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.06); border: none; color: #94a3b8;
    width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .wh-search-clear:hover { background: rgba(239,68,68,0.2); color: #f87171; }
  .wh-toolbar-right { display: flex; gap: 0.5rem; align-items: center; }
  .wh-view-toggle {
    display: flex; background: rgba(15,23,42,0.5); border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
  }
  .wh-view-btn {
    padding: 0.5rem 0.7rem; background: none; border: none; color: rgba(148,163,184,0.5);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .wh-view-btn:hover { color: #94a3b8; }
  .wh-view-btn-active { background: rgba(99,102,241,0.15); color: #818cf8; }
  .wh-section-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.75rem;
  }
  .wh-section-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 1rem; font-weight: 700; color: #ffffff;
  }
  .wh-section-title-icon { color: #818cf8; display: flex; }
  .wh-section-count {
    background: rgba(99,102,241,0.12); color: #818cf8;
    padding: 0.2rem 0.65rem; border-radius: 20px;
    font-size: 11px; font-weight: 700; border: 1px solid rgba(99,102,241,0.2);
  }

  /* === GRID VIEW === */
  .wh-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem; margin-bottom: 1.5rem;
  }
  .wh-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.78) 100%);
    border-radius: 20px; padding: 0; border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden; backdrop-filter: blur(10px);
    transition: all 0.45s cubic-bezier(0.175,0.885,0.32,1.275); cursor: default;
  }
  .wh-card::before {
    content: ''; position: absolute; top: 0; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
    pointer-events: none; left: -100%;
  }
  .wh-card:hover { transform: translateY(-7px); border-color: rgba(255,255,255,0.12);
    box-shadow: 0 24px 55px rgba(0,0,0,0.35); }
  .wh-card:hover::before { animation: cardShine 0.8s ease-out both; }
  .wh-card:hover .wh-card-icon { transform: scale(1.12) rotate(-5deg); }
  .wh-card:hover .wh-card-glow { opacity: 0.4; }
  .wh-card:hover .wh-capacity-fill { animation: shimmer 1.5s linear infinite; background-size: 200% 100%; }
  .wh-card-glow {
    position: absolute; top: -25px; right: -25px; width: 140px; height: 140px;
    border-radius: 50%; filter: blur(50px); opacity: 0.15;
    pointer-events: none; transition: opacity 0.45s ease;
  }

  /* Card Accent Top */
  .wh-card-accent {
    height: 4px; border-radius: 0;
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  .wh-card-top {
    padding: 1.25rem 1.25rem 0.5rem;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .wh-card-left { display: flex; gap: 0.75rem; }
  .wh-card-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    color: white; flex-shrink: 0;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    position: relative;
  }
  .wh-card-icon-pulse {
    position: absolute; inset: -3px; border-radius: 16px;
    border: 2px solid; opacity: 0;
    animation: mapPulse 2.5s ease-out infinite;
  }
  .wh-card-info { min-width: 0; }
  .wh-card-name {
    font-size: 1.05rem; font-weight: 700; color: #ffffff;
    margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .wh-card-location {
    font-size: 12.5px; color: rgba(148,163,184,0.6);
    display: flex; align-items: center; gap: 0.3rem;
  }
  .wh-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; }
  .wh-active-badge {
    display: inline-flex; align-items: center; gap: 0.25rem;
    padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 10px; font-weight: 700;
    background: rgba(34,197,94,0.12); color: #4ade80;
    border: 1px solid rgba(34,197,94,0.2); text-transform: uppercase; letter-spacing: 0.4px;
  }
  .wh-card-menu {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    color: rgba(148,163,184,0.4); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .wh-card-menu:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }

  /* Card Metrics */
  .wh-card-metrics {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;
    padding: 0.5rem 1.25rem 0.75rem; position: relative; z-index: 1;
  }
  .wh-metric-box {
    text-align: center; padding: 0.75rem 0.5rem; border-radius: 12px;
    position: relative; overflow: hidden;
    transition: all 0.35s ease;
  }
  .wh-metric-box:hover { transform: translateY(-2px); }
  .wh-metric-value {
    font-size: 1.3rem; font-weight: 800; color: #ffffff;
    margin-bottom: 0.1rem; font-variant-numeric: tabular-nums;
  }
  .wh-metric-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Capacity Bar */
  .wh-capacity-section {
    padding: 0 1.25rem 0.75rem; position: relative; z-index: 1;
  }
  .wh-capacity-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.35rem;
  }
  .wh-capacity-label {
    font-size: 10px; font-weight: 700; color: rgba(148,163,184,0.5);
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .wh-capacity-pct {
    font-size: 11px; font-weight: 700;
    transition: color 0.3s ease;
  }
  .wh-capacity-track {
    height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05);
    overflow: hidden;
  }
  .wh-capacity-fill {
    height: 100%; border-radius: 3px;
    animation: progressGrow 1.2s ease-out both;
    width: var(--target-width, 0%);
    position: relative;
  }
  .wh-capacity-fill::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 200% 100%;
  }

  /* Card Footer */
  .wh-card-footer {
    padding: 0.85rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.04);
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 11.5px; color: rgba(148,163,184,0.45);
  }
  .wh-card-footer-icon { display: flex; flex-shrink: 0; }

  /* === LIST VIEW === */
  .wh-list-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);
    overflow: hidden; backdrop-filter: blur(10px); transition: all 0.4s ease;
    margin-bottom: 1.5rem;
  }
  .wh-list-card:hover { border-color: rgba(255,255,255,0.08); }
  .wh-list-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.15rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .wh-list-table { width: 100%; border-collapse: separate; border-spacing: 0; }
  .wh-list-th {
    text-align: left; padding: 0.8rem 1.25rem; font-size: 11px; font-weight: 700;
    color: rgba(148,163,184,0.6); text-transform: uppercase; letter-spacing: 0.6px;
    border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(15,23,42,0.35);
  }
  .wh-list-tr { transition: all 0.3s ease; cursor: default; }
  .wh-list-tr:hover { background: rgba(99,102,241,0.04); }
  .wh-list-tr:hover .wh-list-icon { transform: scale(1.1) rotate(-3deg); }
  .wh-list-tr-new { animation: rowHighlight 2s ease-out both; }
  .wh-list-td { padding: 0.9rem 1.25rem; font-size: 13px; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .wh-list-name { display: flex; align-items: center; gap: 0.65rem; font-weight: 600; color: #ffffff; font-size: 14px; }
  .wh-list-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; flex-shrink: 0; transition: all 0.35s ease;
  }
  .wh-list-loc { display: flex; align-items: center; gap: 0.3rem; color: rgba(148,163,184,0.6); }
  .wh-list-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.6rem; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    background: rgba(99,102,241,0.12); color: #818cf8;
    border: 1px solid rgba(99,102,241,0.2);
  }
  .wh-list-actions { display: flex; gap: 0.4rem; }
  .wh-list-action-btn {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    color: rgba(148,163,184,0.5); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .wh-list-action-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
  .wh-list-action-delete:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }

  /* === MODAL === */
  .wh-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: overlayIn 0.3s ease-out both; padding: 2rem;
  }
  .wh-modal {
    width: 100%; max-width: 580px;
    background: linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%);
    border-radius: 24px; border: 1px solid rgba(99,102,241,0.15);
    backdrop-filter: blur(30px); position: relative; overflow: hidden;
    animation: modalIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both;
  }
  .wh-modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #22c55e, #6366f1);
    background-size: 300% 100%; animation: gradientFlow 3s linear infinite;
  }
  .wh-modal-glow {
    position: absolute; top: -40%; right: -40%; width: 180%; height: 180%;
    background: radial-gradient(circle at 65% 25%, rgba(99,102,241,0.06) 0%, transparent 45%);
    pointer-events: none;
  }
  .wh-modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 1.75rem; border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative; z-index: 1;
  }
  .wh-modal-title {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 1.15rem; font-weight: 700; color: #ffffff;
  }
  .wh-modal-title-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    color: white; box-shadow: 0 4px 14px rgba(99,102,241,0.3);
  }
  .wh-modal-close {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.3s ease;
  }
  .wh-modal-close:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171; transform: rotate(90deg); }
  .wh-modal-body { padding: 1.5rem 1.75rem; position: relative; z-index: 1; }
  .wh-modal-footer { padding: 1rem 1.75rem 1.5rem; display: flex; gap: 0.75rem; position: relative; z-index: 1; }

  /* === FORM === */
  .wh-form-group { margin-bottom: 1.15rem; }
  .wh-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .wh-label {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 11.5px; font-weight: 700; color: rgba(148,163,184,0.85);
    margin-bottom: 0.45rem; text-transform: uppercase; letter-spacing: 0.6px;
    transition: color 0.3s ease;
  }
  .wh-label-icon { color: rgba(148,163,184,0.4); display: flex; transition: color 0.3s ease; }
  .wh-form-group:focus-within .wh-label { color: #818cf8; }
  .wh-form-group:focus-within .wh-label-icon { color: #6366f1; }
  .wh-required { color: #f87171; margin-left: 1px; }
  .wh-input {
    width: 100%; padding: 0.75rem 1rem; font-size: 14px;
    border-radius: 12px; border: 1.5px solid rgba(99,102,241,0.15);
    background: rgba(15,23,42,0.5); color: #e2e8f0;
    outline: none; transition: all 0.35s ease; box-sizing: border-box;
  }
  .wh-input::placeholder { color: rgba(148,163,184,0.35); }
  .wh-input:hover { border-color: rgba(99,102,241,0.3); background: rgba(15,23,42,0.6); }
  .wh-input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); background: rgba(15,23,42,0.7); }
  .wh-input-help { font-size: 11px; color: rgba(148,163,184,0.4); margin-top: 0.3rem; display: flex; align-items: center; gap: 0.25rem; }
  .wh-submit-btn {
    flex: 1; background: linear-gradient(135deg, #22c55e, #16a34a);
    border: none; padding: 0.8rem 1.5rem; border-radius: 12px;
    color: white; font-weight: 700; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 18px rgba(34,197,94,0.35);
    position: relative; overflow: hidden;
  }
  .wh-submit-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s ease;
  }
  .wh-submit-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(34,197,94,0.5); }
  .wh-submit-btn:not(:disabled):hover::before { left: 100%; }
  .wh-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .wh-submit-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
  .wh-cancel-btn {
    padding: 0.8rem 1.5rem; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; font-weight: 600; font-size: 14px; cursor: pointer;
    transition: all 0.3s ease;
  }
  .wh-cancel-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #e2e8f0; }

  /* === ALERTS === */
  .wh-alert {
    border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.65rem;
    font-size: 14px; font-weight: 500; position: relative; overflow: hidden;
  }
  .wh-alert-success {
    background: linear-gradient(135deg, rgba(34,197,94,0.12), rgba(15,23,42,0.85));
    border: 1px solid rgba(34,197,94,0.25); color: #4ade80;
    animation: successPop 0.5s ease-out both;
  }
  .wh-alert-error {
    background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.85));
    border: 1px solid rgba(239,68,68,0.25); color: #f87171;
    animation: errorShake 0.5s ease-out both;
  }
  .wh-alert-close {
    margin-left: auto; background: none; border: none; color: inherit;
    cursor: pointer; opacity: 0.6; transition: opacity 0.3s; padding: 0.25rem;
    display: flex; border-radius: 6px;
  }
  .wh-alert-close:hover { opacity: 1; background: rgba(255,255,255,0.06); }
  .wh-confetti {
    position: absolute; width: 6px; height: 6px; border-radius: 2px;
    animation: confettiDrop 1s ease-out both; pointer-events: none;
  }

  /* === EMPTY STATE === */
  .wh-empty {
    padding: 5rem 2rem; text-align: center; color: rgba(148,163,184,0.5);
  }
  .wh-empty-icon-wrap {
    width: 76px; height: 76px; border-radius: 22px;
    background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem; border: 1px solid rgba(99,102,241,0.15);
    animation: iconFloat 3s ease-in-out infinite;
  }
  .wh-empty-title { font-size: 1.15rem; font-weight: 700; color: rgba(148,163,184,0.75); margin-bottom: 0.5rem; }
  .wh-empty-text { font-size: 0.85rem; color: rgba(148,163,184,0.45); margin-bottom: 1.25rem; }
  .wh-empty-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.65rem 1.25rem; border-radius: 11px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white; font-weight: 600; font-size: 13px;
    border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: all 0.3s ease;
  }
  .wh-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }

  /* === PREVIEW === */
  .wh-preview {
    background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.12);
    border-radius: 14px; padding: 1rem; animation: fadeInScale 0.3s ease-out both;
  }
  .wh-preview-label {
    font-size: 10px; color: rgba(148,163,184,0.5); font-weight: 700;
    margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.5px;
    display: flex; align-items: center; gap: 0.3rem;
  }
  .wh-preview-card {
    display: flex; align-items: center; gap: 0.75rem;
  }
  .wh-preview-icon {
    width: 40px; height: 40px; border-radius: 11px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center; color: white;
  }
  .wh-preview-info {}
  .wh-preview-name { font-size: 14px; font-weight: 700; color: #fff; }
  .wh-preview-loc { font-size: 12px; color: rgba(148,163,184,0.5); display: flex; align-items: center; gap: 0.25rem; margin-top: 2px; }

  /* === LOADING === */
  .wh-loading-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 80vh; gap: 1.5rem;
  }
  .wh-loading-logo { position: relative; width: 65px; height: 65px; display: flex; align-items: center; justify-content: center; }
  .wh-loading-ring {
    position: absolute; inset: 0; border: 3px solid rgba(99,102,241,0.15);
    border-top-color: #6366f1; border-right-color: #8b5cf6;
    border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5,0,0.5,1) infinite;
  }
  .wh-loading-ring-inner {
    position: absolute; inset: 8px; border: 2px solid rgba(139,92,246,0.1);
    border-bottom-color: #8b5cf6; border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.5,0,0.5,1) infinite reverse;
  }
  .wh-loading-center { color: #818cf8; font-size: 1.4rem; animation: breathe 1.5s ease-in-out infinite; display: flex; }
  .wh-loading-dots { display: flex; gap: 0.4rem; }
  .wh-loading-dot { width: 8px; height: 8px; border-radius: 50%; animation: dotPulse 1.4s ease-in-out infinite; }
  .wh-loading-dot:nth-child(1) { background: #6366f1; }
  .wh-loading-dot:nth-child(2) { background: #8b5cf6; animation-delay: 0.2s; }
  .wh-loading-dot:nth-child(3) { background: #06b6d4; animation-delay: 0.4s; }
  .wh-loading-text { color: rgba(148,163,184,0.7); font-size: 14px; font-weight: 500; }

  /* === RESPONSIVE === */
  @media (max-width: 1100px) {
    .wh-stats { grid-template-columns: repeat(2, 1fr); }
    .wh-grid { grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
  }
  @media (max-width: 768px) {
    .wh-root { padding: 1rem; }
    .wh-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
    .wh-stats { grid-template-columns: 1fr 1fr; }
    .wh-toolbar { flex-direction: column; }
    .wh-search-wrap { max-width: 100%; }
    .wh-grid { grid-template-columns: 1fr; }
    .wh-form-row { grid-template-columns: 1fr; }
    .wh-distrib-bars { height: 70px; }
  }
`;

/* ─────────────────────────────
   CONSTANTS
   ───────────────────────────── */

const WH_COLORS = [
  { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', glow: '#6366f1', light: 'rgba(99,102,241,0.12)', text: '#818cf8' },
  { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: '#3b82f6', light: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
  { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', glow: '#06b6d4', light: 'rgba(6,182,212,0.12)', text: '#22d3ee' },
  { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', glow: '#8b5cf6', light: 'rgba(139,92,246,0.12)', text: '#a78bfa' },
  { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: '#f59e0b', light: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
  { bg: 'linear-gradient(135deg, #ec4899, #db2777)', glow: '#ec4899', light: 'rgba(236,72,153,0.12)', text: '#f472b6' },
  { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', glow: '#22c55e', light: 'rgba(34,197,94,0.12)', text: '#4ade80' },
  { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: '#ef4444', light: 'rgba(239,68,68,0.12)', text: '#f87171' },
  { bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', glow: '#14b8a6', light: 'rgba(20,184,166,0.12)', text: '#2dd4bf' },
  { bg: 'linear-gradient(135deg, #f97316, #ea580c)', glow: '#f97316', light: 'rgba(249,115,22,0.12)', text: '#fb923c' },
];

const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

/* ─────────────────────────────
   HELPERS
   ───────────────────────────── */

function AnimatedCounter({ value, duration = 1400 }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value) || 0;
    if (target === 0) { setDisplay(0); return; }
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.floor(eased * target));
      if (p < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value, duration]);
  return <span>{display.toLocaleString()}</span>;
}

function MiniSparkline({ color, delay = 0 }) {
  const bars = [30, 55, 40, 75, 45, 85, 55, 48, 70, 62];
  return (
    <div className="wh-stat-spark" style={{ color }}>
      {bars.map((h, i) => (
        <div key={i} className="wh-spark-bar"
          style={{ height: `${h}%`, background: color, animationDelay: `${delay + i * 0.05}s`, opacity: 0.3 + (h / 100) * 0.5 }}
        />
      ))}
    </div>
  );
}

function ConfettiBurst() {
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className="wh-confetti"
          style={{
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${8 + Math.random() * 84}%`,
            top: `${-5 + Math.random() * 10}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${0.7 + Math.random() * 0.6}s`,
          }}
        />
      ))}
    </>
  );
}

function getCapacityColor(pct) {
  if (pct >= 85) return { color: '#ef4444', bg: 'linear-gradient(90deg, #ef4444, #f87171)' };
  if (pct >= 60) return { color: '#f59e0b', bg: 'linear-gradient(90deg, #f59e0b, #fbbf24)' };
  return { color: '#22c55e', bg: 'linear-gradient(90deg, #22c55e, #4ade80)' };
}

/* ─────────────────────────────
   MAIN COMPONENT
   ───────────────────────────── */

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ warehouseName: '', address: '', city: '', country: '' });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [refreshing, setRefreshing] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const nameInputRef = useRef(null);

  useEffect(() => { fetchWarehouses(); }, []);

  async function fetchWarehouses() {
    try {
      setLoading(prev => warehouses.length === 0 ? true : prev);
      setRefreshing(true);
      const res = await fetch('/api/warehouses');
      const result = await res.json();
      if (result.success) setWarehouses(result.data || []);
      else throw new Error(result.message);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); setRefreshing(false); }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      if (!formData.warehouseName.trim()) throw new Error('Warehouse name is required');
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setSuccess('Warehouse created successfully!');
      setNewlyAddedId(result.data?.WarehouseID || null);
      setFormData({ warehouseName: '', address: '', city: '', country: '' });
      setShowModal(false);
      fetchWarehouses();
      setTimeout(() => { setSuccess(null); setNewlyAddedId(null); }, 4000);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  function openModal() {
    setShowModal(true); setError(null);
    setTimeout(() => nameInputRef.current?.focus(), 300);
  }
  function closeModal() {
    setShowModal(false);
    setFormData({ warehouseName: '', address: '', city: '', country: '' });
    setError(null);
  }

  function getColor(i) { return WH_COLORS[i % WH_COLORS.length]; }

  const totalStock = warehouses.reduce((s, w) => s + parseInt(w.TotalStock || 0), 0);
  const totalProducts = warehouses.reduce((s, w) => s + parseInt(w.ProductCount || 0), 0);
  const avgStock = warehouses.length > 0 ? Math.round(totalStock / warehouses.length) : 0;
  const maxStock = Math.max(...warehouses.map(w => parseInt(w.TotalStock || 0)), 1);
  const maxCapacity = maxStock * 1.5 || 1000;

  const filtered = warehouses.filter(w => {
    const q = searchQuery.toLowerCase();
    return w.WarehouseName.toLowerCase().includes(q)
      || (w.City && w.City.toLowerCase().includes(q))
      || (w.Country && w.Country.toLowerCase().includes(q))
      || (w.Address && w.Address.toLowerCase().includes(q));
  });

  if (loading && warehouses.length === 0) {
    return (
      <div className="wh-root">
        <style>{globalCSS}</style>
        <div className="wh-orb wh-orb-1" /><div className="wh-orb wh-orb-2" />
        <div className="wh-loading-screen">
          <div className="wh-loading-logo">
            <div className="wh-loading-ring" /><div className="wh-loading-ring-inner" />
            <span className="wh-loading-center"><HiOutlineBuildingOffice size={26} /></span>
          </div>
          <div className="wh-loading-dots">
            <span className="wh-loading-dot" /><span className="wh-loading-dot" /><span className="wh-loading-dot" />
          </div>
          <p className="wh-loading-text">Loading warehouses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wh-root">
      <style>{globalCSS}</style>
      <div className="wh-orb wh-orb-1" /><div className="wh-orb wh-orb-2" /><div className="wh-orb wh-orb-3" />

      <div className="wh-content">

        {/* ════ HEADER ════ */}
        <header className="wh-header">
          <div className="wh-header-glow" />
          <div className="wh-header-left">
            <div className="wh-header-top">
              <div className="wh-header-icon"><HiOutlineBuildingOffice size={23} /></div>
              <h1 className="wh-header-title">Warehouses</h1>
            </div>
            <p className="wh-header-subtitle">
              <span className="wh-status-dot" />
              <span>Manage warehouse locations and stock levels</span>
            </p>
          </div>
          <div className="wh-header-actions">
            <button className="wh-refresh-btn" onClick={fetchWarehouses} title="Refresh">
              <span className="wh-refresh-icon" style={refreshing ? { animation: 'spin 1s linear infinite' } : {}}>
                <HiOutlineArrowPath size={17} />
              </span>
            </button>
            <button className="wh-add-btn" onClick={openModal}>
              <HiOutlinePlusCircle size={17} /> Add Warehouse
            </button>
          </div>
        </header>

        {/* Wave */}
        <div className="wh-wave">
          <svg className="wh-wave-svg" viewBox="0 0 1000 25" preserveAspectRatio="none">
            <path d="M0,12 C150,25 350,0 500,12 C650,25 850,0 1000,12 L1000,25 L0,25 Z" fill="rgba(99,102,241,0.25)" />
            <path d="M0,18 C200,5 300,22 500,18 C700,14 800,24 1000,18 L1000,25 L0,25 Z" fill="rgba(139,92,246,0.15)" />
          </svg>
        </div>

        {/* ════ ALERTS ════ */}
        {success && (
          <div className="wh-alert wh-alert-success">
            <ConfettiBurst />
            <HiOutlineCheckCircle size={19} /> {success}
            <HiOutlineRocketLaunch size={15} style={{ opacity: 0.6 }} />
            <button className="wh-alert-close" onClick={() => setSuccess(null)}><HiOutlineXMark size={15} /></button>
          </div>
        )}
        {error && !showModal && (
          <div className="wh-alert wh-alert-error">
            <HiOutlineExclamationTriangle size={19} /> {error}
            <button className="wh-alert-close" onClick={() => setError(null)}><HiOutlineXMark size={15} /></button>
          </div>
        )}

        {/* ════ STATS ════ */}
        <div className="wh-stats">
          {[
            { icon: <HiOutlineBuildingOffice size={20} />, label: 'Total Warehouses', value: warehouses.length, gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', glow: '#6366f1', sparkColor: '#818cf8', delay: 0.5 },
            { icon: <HiOutlineArchiveBox size={20} />, label: 'Total Stock Units', value: totalStock, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: '#3b82f6', sparkColor: '#60a5fa', delay: 0.6 },
            { icon: <HiOutlineCube size={20} />, label: 'Total Products', value: totalProducts, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', glow: '#22c55e', sparkColor: '#4ade80', delay: 0.7 },
            { icon: <HiOutlineChartBar size={20} />, label: 'Avg Stock / Warehouse', value: avgStock, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: '#f59e0b', sparkColor: '#fbbf24', delay: 0.8 },
          ].map((stat, i) => (
            <div key={i} className="wh-stat-card anim-entry" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <div className="wh-stat-glow" style={{ background: stat.glow }} />
              <div className="wh-stat-top">
                <div className="wh-stat-icon" style={{ background: stat.gradient }}>{stat.icon}</div>
                <MiniSparkline color={stat.sparkColor} delay={stat.delay} />
              </div>
              <div className="wh-stat-value"><AnimatedCounter value={stat.value} duration={1200 + i * 200} /></div>
              <div className="wh-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ════ STOCK DISTRIBUTION ════ */}
        {warehouses.length > 0 && (
          <div className="wh-distrib anim-entry" style={{ animationDelay: '0.35s' }}>
            <div className="wh-distrib-title">
              <span className="wh-distrib-title-icon"><HiOutlineChartBar size={16} /></span>
              Stock Distribution by Warehouse
            </div>
            <div className="wh-distrib-bars">
              {warehouses.map((wh, i) => {
                const stock = parseInt(wh.TotalStock || 0);
                const pct = maxStock > 0 ? (stock / maxStock) * 100 : 0;
                const barH = Math.max(pct * 0.75, 4);
                const color = getColor(i);
                return (
                  <div key={wh.WarehouseID} className="wh-distrib-col">
                    <div className="wh-distrib-bar-value">{stock.toLocaleString()}</div>
                    <div className="wh-distrib-bar"
                      style={{
                        '--bar-height': `${barH}px`,
                        background: color.bg,
                        animationDelay: `${0.5 + i * 0.1}s`,
                      }}
                    />
                    <div className="wh-distrib-bar-label">{wh.WarehouseName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════ TOOLBAR ════ */}
        <div className="wh-toolbar anim-entry" style={{ animationDelay: '0.4s' }}>
          <div className="wh-search-wrap">
            <span className="wh-search-icon"><HiOutlineMagnifyingGlass size={15} /></span>
            <input type="text" className="wh-search" placeholder="Search warehouses..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && (
              <button className="wh-search-clear" onClick={() => setSearchQuery('')}>
                <HiOutlineXMark size={12} />
              </button>
            )}
          </div>
          <div className="wh-toolbar-right">
            <div className="wh-view-toggle">
              <button className={`wh-view-btn ${viewMode === 'grid' ? 'wh-view-btn-active' : ''}`}
                onClick={() => setViewMode('grid')} title="Grid View"><HiOutlineSquares2X2 size={16} /></button>
              <button className={`wh-view-btn ${viewMode === 'list' ? 'wh-view-btn-active' : ''}`}
                onClick={() => setViewMode('list')} title="List View"><HiOutlineListBullet size={16} /></button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="wh-section-header anim-entry" style={{ animationDelay: '0.42s' }}>
          <div className="wh-section-title">
            <span className="wh-section-title-icon"><HiOutlineGlobeAlt size={17} /></span>
            All Warehouses
          </div>
          <span className="wh-section-count">{filtered.length} location{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* ════ GRID VIEW ════ */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="wh-grid">
            {filtered.map((wh, i) => {
              const color = getColor(i);
              const stock = parseInt(wh.TotalStock || 0);
              const capPct = Math.min(Math.round((stock / maxCapacity) * 100), 100);
              const capColor = getCapacityColor(capPct);
              const isNew = wh.WarehouseID === newlyAddedId;
              return (
                <div key={wh.WarehouseID}
                  className={`wh-card anim-entry ${isNew ? 'wh-list-tr-new' : ''}`}
                  style={{ animationDelay: `${0.45 + i * 0.07}s` }}
                >
                  <div className="wh-card-glow" style={{ background: color.glow }} />
                  <div className="wh-card-accent" style={{ background: `linear-gradient(90deg, ${color.glow}, ${color.glow}66, ${color.glow})` }} />

                  <div className="wh-card-top">
                    <div className="wh-card-left">
                      <div className="wh-card-icon" style={{ background: color.bg, boxShadow: `0 4px 18px ${color.glow}44` }}>
                        <HiOutlineBuildingOffice size={20} />
                        <span className="wh-card-icon-pulse" style={{ borderColor: color.glow }} />
                      </div>
                      <div className="wh-card-info">
                        <div className="wh-card-name">{wh.WarehouseName}</div>
                        <div className="wh-card-location">
                          <HiOutlineMapPin size={12} />
                          {wh.City || 'Unknown'}{wh.Country ? `, ${wh.Country}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="wh-card-right">
                      <span className="wh-active-badge">
                        <HiOutlineCheckBadge size={11} /> Active
                      </span>
                      <button className="wh-card-menu"><HiOutlineEllipsisHorizontal size={14} /></button>
                    </div>
                  </div>

                  <div className="wh-card-metrics">
                    <div className="wh-metric-box" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 12 }}>
                      <div className="wh-metric-value">{stock.toLocaleString()}</div>
                      <div className="wh-metric-label" style={{ color: '#60a5fa' }}>Stock Units</div>
                    </div>
                    <div className="wh-metric-box" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.1)', borderRadius: 12 }}>
                      <div className="wh-metric-value">{wh.ProductCount || 0}</div>
                      <div className="wh-metric-label" style={{ color: '#a78bfa' }}>Products</div>
                    </div>
                  </div>

                  <div className="wh-capacity-section">
                    <div className="wh-capacity-header">
                      <span className="wh-capacity-label">Capacity Usage</span>
                      <span className="wh-capacity-pct" style={{ color: capColor.color }}>{capPct}%</span>
                    </div>
                    <div className="wh-capacity-track">
                      <div className="wh-capacity-fill"
                        style={{
                          '--target-width': `${capPct}%`,
                          background: capColor.bg,
                          animationDelay: `${0.6 + i * 0.08}s`,
                        }}
                      />
                    </div>
                  </div>

                  {wh.Address && (
                    <div className="wh-card-footer">
                      <span className="wh-card-footer-icon"><HiOutlineMapPin size={12} /></span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {wh.Address}
                      </span>
                    </div>
                  )}
                  {!wh.Address && (
                    <div className="wh-card-footer">
                      <span className="wh-card-footer-icon"><HiOutlineCalendarDays size={12} /></span>
                      <span>Warehouse #{wh.WarehouseID}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════ LIST VIEW ════ */}
        {viewMode === 'list' && filtered.length > 0 && (
          <div className="wh-list-card anim-entry" style={{ animationDelay: '0.45s' }}>
            <div className="wh-list-header">
              <div className="wh-section-title">
                <span className="wh-section-title-icon"><HiOutlineBuildingOffice size={17} /></span>
                All Warehouses
              </div>
              <span className="wh-section-count">{filtered.length}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="wh-list-table">
                <thead>
                  <tr>
                    <th className="wh-list-th">Warehouse</th>
                    <th className="wh-list-th">Location</th>
                    <th className="wh-list-th">Stock</th>
                    <th className="wh-list-th">Products</th>
                    <th className="wh-list-th">Capacity</th>
                    <th className="wh-list-th" style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((wh, i) => {
                    const color = getColor(i);
                    const stock = parseInt(wh.TotalStock || 0);
                    const capPct = Math.min(Math.round((stock / maxCapacity) * 100), 100);
                    const capColor = getCapacityColor(capPct);
                    const isNew = wh.WarehouseID === newlyAddedId;
                    return (
                      <tr key={wh.WarehouseID} className={`wh-list-tr ${isNew ? 'wh-list-tr-new' : ''}`}>
                        <td className="wh-list-td">
                          <div className="wh-list-name">
                            <div className="wh-list-icon" style={{ background: color.bg }}>
                              <HiOutlineBuildingOffice size={16} />
                            </div>
                            {wh.WarehouseName}
                          </div>
                        </td>
                        <td className="wh-list-td">
                          <span className="wh-list-loc">
                            <HiOutlineMapPin size={12} />
                            {wh.City || '—'}{wh.Country ? `, ${wh.Country}` : ''}
                          </span>
                        </td>
                        <td className="wh-list-td">
                          <span className="wh-list-badge">
                            <HiOutlineArchiveBox size={11} /> {stock.toLocaleString()}
                          </span>
                        </td>
                        <td className="wh-list-td">
                          <span className="wh-list-badge" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.2)' }}>
                            <HiOutlineCube size={11} /> {wh.ProductCount || 0}
                          </span>
                        </td>
                        <td className="wh-list-td">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', maxWidth: 80 }}>
                              <div style={{ width: `${capPct}%`, height: '100%', borderRadius: 3, background: capColor.bg, transition: 'width 0.5s ease' }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: capColor.color }}>{capPct}%</span>
                          </div>
                        </td>
                        <td className="wh-list-td" style={{ textAlign: 'right' }}>
                          <div className="wh-list-actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="wh-list-action-btn" title="Edit"><HiOutlinePencilSquare size={14} /></button>
                            <button className="wh-list-action-btn wh-list-action-delete" title="Delete"><HiOutlineTrash size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ EMPTY ════ */}
        {filtered.length === 0 && (
          <div className="wh-list-card anim-entry" style={{ animationDelay: '0.3s' }}>
            <div className="wh-empty">
              <div className="wh-empty-icon-wrap">
                {searchQuery ? <HiOutlineMagnifyingGlass size={32} style={{ color: '#818cf8' }} /> : <HiOutlineBuildingOffice size={32} style={{ color: '#818cf8' }} />}
              </div>
              <h3 className="wh-empty-title">{searchQuery ? 'No warehouses found' : 'No warehouses yet'}</h3>
              <p className="wh-empty-text">
                {searchQuery ? `No results matching "${searchQuery}".` : 'Add your first warehouse to start managing inventory locations.'}
              </p>
              {!searchQuery && (
                <button className="wh-empty-btn" onClick={openModal}>
                  <HiOutlinePlusCircle size={16} /> Create First Warehouse
                </button>
              )}
              {searchQuery && (
                <button className="wh-empty-btn" onClick={() => setSearchQuery('')}
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  <HiOutlineXMark size={16} /> Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* ════ MODAL ════ */}
        {showModal && (
          <div className="wh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
            <div className="wh-modal">
              <div className="wh-modal-glow" />
              <div className="wh-modal-header">
                <div className="wh-modal-title">
                  <div className="wh-modal-title-icon"><HiOutlineSparkles size={17} /></div>
                  Add New Warehouse
                </div>
                <button className="wh-modal-close" onClick={closeModal}><HiOutlineXMark size={16} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="wh-modal-body">
                  {error && (
                    <div className="wh-alert wh-alert-error" style={{ marginBottom: '1rem' }}>
                      <HiOutlineExclamationTriangle size={17} /> {error}
                    </div>
                  )}

                  <div className="wh-form-group">
                    <label className="wh-label">
                      <span className="wh-label-icon"><HiOutlineBuildingOffice size={12} /></span>
                      Warehouse Name <span className="wh-required">*</span>
                    </label>
                    <input ref={nameInputRef} type="text" name="warehouseName" className="wh-input"
                      placeholder="e.g., Main Distribution Center" value={formData.warehouseName}
                      onChange={handleChange} required />
                    <div className="wh-input-help"><HiOutlineInformationCircle size={11} /> A unique name for this location</div>
                  </div>

                  <div className="wh-form-row" style={{ marginBottom: '1.15rem' }}>
                    <div className="wh-form-group" style={{ marginBottom: 0 }}>
                      <label className="wh-label">
                        <span className="wh-label-icon"><HiOutlineMapPin size={12} /></span> City
                      </label>
                      <input type="text" name="city" className="wh-input" placeholder="City name..."
                        value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="wh-form-group" style={{ marginBottom: 0 }}>
                      <label className="wh-label">
                        <span className="wh-label-icon"><HiOutlineGlobeAlt size={12} /></span> Country
                      </label>
                      <input type="text" name="country" className="wh-input" placeholder="Country name..."
                        value={formData.country} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="wh-form-group">
                    <label className="wh-label">
                      <span className="wh-label-icon"><HiOutlineDocumentText size={12} /></span> Full Address
                    </label>
                    <input type="text" name="address" className="wh-input" placeholder="Street address, ZIP..."
                      value={formData.address} onChange={handleChange} />
                  </div>

                  {formData.warehouseName && (
                    <div className="wh-preview">
                      <div className="wh-preview-label"><HiOutlineEye size={11} /> Preview</div>
                      <div className="wh-preview-card">
                        <div className="wh-preview-icon"><HiOutlineBuildingOffice size={18} /></div>
                        <div className="wh-preview-info">
                          <div className="wh-preview-name">{formData.warehouseName}</div>
                          {(formData.city || formData.country) && (
                            <div className="wh-preview-loc">
                              <HiOutlineMapPin size={11} />
                              {[formData.city, formData.country].filter(Boolean).join(', ') || '—'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="wh-modal-footer">
                  <button type="submit" className="wh-submit-btn" disabled={submitting}>
                    {submitting ? <><div className="wh-submit-spinner" /> Creating...</> : <><HiOutlinePlusCircle size={17} /> Create Warehouse</>}
                  </button>
                  <button type="button" className="wh-cancel-btn" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}