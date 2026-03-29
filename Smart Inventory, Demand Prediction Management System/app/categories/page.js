'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HiOutlineTag,
  HiOutlineXMark,
  HiOutlinePlusCircle,
  HiOutlineExclamationTriangle,
  HiOutlineFolderOpen,
  HiOutlineCube,
  HiOutlineCalendarDays,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineListBullet,
  HiOutlineViewColumns,
  HiOutlineArrowPath,
  HiOutlineChevronRight,
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlineRocketLaunch,
  HiOutlineBolt,
  HiOutlineEllipsisHorizontal,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineArchiveBox,
  HiOutlineFire,
  HiOutlineArrowTrendingUp,
  HiOutlineHashtag,
  HiOutlineCheckBadge,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineAdjustmentsHorizontal,
} from 'react-icons/hi2';

/* ─────────────────────────────────────────────
   CSS — animations, layouts, interactions
   ───────────────────────────────────────────── */

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
    0%, 100% { transform: translate(0,0) scale(1); }
    25%      { transform: translate(70px,-50px) scale(1.12); }
    50%      { transform: translate(-35px,35px) scale(0.9); }
    75%      { transform: translate(55px,25px) scale(1.05); }
  }
  @keyframes orbDrift2 {
    0%, 100% { transform: translate(0,0) scale(1); }
    25%      { transform: translate(-60px,45px) scale(0.95); }
    50%      { transform: translate(45px,-28px) scale(1.1); }
    75%      { transform: translate(-25px,-45px) scale(1); }
  }
  @keyframes orbDrift3 {
    0%, 100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(45px,55px) scale(1.07); }
    66%      { transform: translate(-55px,-18px) scale(0.93); }
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
    50%      { transform: translateY(-5px) rotate(3deg); }
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
  @keyframes slideDown {
    from { opacity: 0; max-height: 0; transform: translateY(-15px); }
    to   { opacity: 1; max-height: 500px; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { opacity: 1; max-height: 500px; transform: translateY(0); }
    to   { opacity: 0; max-height: 0; transform: translateY(-15px); }
  }
  @keyframes confettiDrop {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(40px) rotate(360deg); opacity: 0; }
  }
  @keyframes counterPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes sparkBarGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes borderDance {
    0%   { border-color: rgba(59,130,246,0.25); }
    33%  { border-color: rgba(139,92,246,0.25); }
    66%  { border-color: rgba(245,158,11,0.25); }
    100% { border-color: rgba(59,130,246,0.25); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(2.2); opacity: 0; }
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
  @keyframes barRise {
    from { height: 4px; }
    to   { height: var(--target-height, 4px); }
  }

  /* ===== ROOT ===== */
  .cat-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0a0f1e 0%, #0f172a 30%, #1a1040 60%, #0f172a 100%);
    padding: 1.5rem 2rem 3rem;
    position: relative; overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  }

  /* ===== BACKGROUND ORBS ===== */
  .cat-orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
  .cat-orb-1 { width: 480px; height: 480px; background: radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%); top: -8%; left: -4%; animation: orbDrift1 26s ease-in-out infinite; }
  .cat-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%); top: 45%; right: -6%; animation: orbDrift2 30s ease-in-out infinite; }
  .cat-orb-3 { width: 320px; height: 320px; background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%); bottom: -4%; left: 28%; animation: orbDrift3 22s ease-in-out infinite; }

  .cat-content { position: relative; z-index: 2; }
  .anim-entry { animation: entranceBlur 0.65s ease-out both; }

  /* ===== HEADER ===== */
  .cat-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.75rem; padding: 1.5rem 1.75rem;
    background: linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.85) 100%);
    border-radius: 22px; border: 1px solid rgba(245,158,11,0.12);
    backdrop-filter: blur(20px); position: relative; overflow: hidden;
    animation: fadeInDown 0.7s ease-out both;
  }
  .cat-header::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #f59e0b, #f97316, #ef4444, #8b5cf6, #3b82f6, #f59e0b);
    background-size: 300% 100%; animation: gradientFlow 5s linear infinite;
  }
  .cat-header-glow {
    position: absolute; top: -50%; left: -30%; width: 200%; height: 200%;
    background: radial-gradient(circle at 20% 30%, rgba(245,158,11,0.06) 0%, transparent 50%);
    pointer-events: none;
  }
  .cat-header-left { position: relative; z-index: 1; }
  .cat-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem; }
  .cat-header-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.3rem;
    box-shadow: 0 6px 22px rgba(245,158,11,0.4);
    animation: iconFloat 3s ease-in-out infinite;
  }
  .cat-header-title {
    font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 0%, #fbbf24 50%, #ffffff 100%);
    background-size: 200% auto; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text;
    animation: textShine 4s linear infinite;
  }
  .cat-header-subtitle {
    color: rgba(148,163,184,0.7); font-size: 0.88rem;
    display: flex; align-items: center; gap: 0.5rem; margin-left: 3.85rem;
  }
  .cat-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #22c55e; display: inline-block; position: relative;
  }
  .cat-status-dot::after {
    content: ''; position: absolute; inset: -3px; border-radius: 50%;
    background: rgba(34,197,94,0.4); animation: breathe 2s ease-in-out infinite;
  }
  .cat-header-actions { display: flex; gap: 0.65rem; position: relative; z-index: 1; }
  .cat-add-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border: none; padding: 0.7rem 1.35rem; border-radius: 12px;
    color: white; font-weight: 700; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(59,130,246,0.35);
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    position: relative; overflow: hidden;
  }
  .cat-add-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s ease;
  }
  .cat-add-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 30px rgba(59,130,246,0.5); }
  .cat-add-btn:hover::before { left: 100%; }
  .cat-add-btn:active { transform: translateY(0) scale(0.98); }
  .cat-refresh-btn {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    padding: 0.7rem; border-radius: 12px; color: #94a3b8; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.35s ease;
  }
  .cat-refresh-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(59,130,246,0.3); color: #e2e8f0; }
  .cat-refresh-btn:hover .cat-refresh-icon { transform: rotate(180deg); }
  .cat-refresh-icon { transition: transform 0.5s ease; display: flex; }

  /* ===== WAVE DIVIDER ===== */
  .cat-wave { position: relative; height: 25px; margin: 0.25rem 0 1.25rem; overflow: hidden; opacity: 0.12; z-index: 1; }
  .cat-wave-svg { position: absolute; bottom: 0; width: 200%; height: 100%; animation: waveSlide 8s linear infinite; }

  /* ===== STATS GRID ===== */
  .cat-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .cat-stat-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 18px; padding: 1.2rem; border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden; cursor: default;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    backdrop-filter: blur(10px);
  }
  .cat-stat-card::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
    transition: left 0.7s ease;
  }
  .cat-stat-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.1);
    box-shadow: 0 18px 40px rgba(0,0,0,0.25); }
  .cat-stat-card:hover::before { left: 150%; }
  .cat-stat-card:hover .cat-stat-icon { transform: scale(1.1) rotate(-5deg); }
  .cat-stat-glow {
    position: absolute; top: -15px; right: -15px; width: 90px; height: 90px;
    border-radius: 50%; filter: blur(35px); opacity: 0.3; pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .cat-stat-card:hover .cat-stat-glow { opacity: 0.55; }
  .cat-stat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; }
  .cat-stat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .cat-stat-spark { display: flex; align-items: flex-end; gap: 2px; height: 26px; opacity: 0.4; }
  .cat-spark-bar { width: 4px; border-radius: 2px; transform-origin: bottom; animation: sparkBarGrow 0.7s ease-out both; }
  .cat-stat-value { font-size: 1.55rem; font-weight: 800; color: #fff; margin-bottom: 0.15rem; position: relative; z-index: 1; }
  .cat-stat-label { font-size: 0.78rem; color: rgba(148,163,184,0.65); font-weight: 500; position: relative; z-index: 1; letter-spacing: 0.2px; }

  /* ===== TOOLBAR ===== */
  .cat-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap;
  }
  .cat-search-wrap {
    position: relative; flex: 1; max-width: 360px;
  }
  .cat-search-icon {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    color: rgba(148,163,184,0.4); pointer-events: none; display: flex;
    transition: color 0.3s ease;
  }
  .cat-search-wrap:focus-within .cat-search-icon { color: #3b82f6; }
  .cat-search {
    width: 100%; padding: 0.7rem 1rem 0.7rem 2.5rem; border-radius: 12px;
    border: 1.5px solid rgba(59,130,246,0.15); background: rgba(15,23,42,0.5);
    color: #e2e8f0; font-size: 13px; outline: none; transition: all 0.35s ease;
  }
  .cat-search::placeholder { color: rgba(148,163,184,0.35); }
  .cat-search:hover { border-color: rgba(59,130,246,0.3); }
  .cat-search:focus {
    border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
    background: rgba(15,23,42,0.65);
  }
  .cat-search-clear {
    position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.06); border: none; color: #94a3b8;
    width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease; font-size: 12px;
  }
  .cat-search-clear:hover { background: rgba(239,68,68,0.2); color: #f87171; }
  .cat-toolbar-right { display: flex; gap: 0.5rem; align-items: center; }
  .cat-view-toggle {
    display: flex; background: rgba(15,23,42,0.5); border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
  }
  .cat-view-btn {
    padding: 0.5rem 0.7rem; background: none; border: none; color: rgba(148,163,184,0.5);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease; font-size: 15px;
  }
  .cat-view-btn:hover { color: #94a3b8; }
  .cat-view-btn-active { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .cat-sort-btn {
    padding: 0.5rem 0.85rem; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    color: #94a3b8; font-size: 12px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 0.35rem; transition: all 0.3s ease;
  }
  .cat-sort-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); color: #e2e8f0; }

  /* ===== MODAL OVERLAY ===== */
  .cat-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: overlayIn 0.3s ease-out both; padding: 2rem;
  }
  .cat-modal {
    width: 100%; max-width: 540px;
    background: linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%);
    border-radius: 24px; border: 1px solid rgba(59,130,246,0.15);
    backdrop-filter: blur(30px); position: relative; overflow: hidden;
    animation: modalIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both;
  }
  .cat-modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #22c55e, #3b82f6);
    background-size: 300% 100%; animation: gradientFlow 3s linear infinite;
  }
  .cat-modal-glow {
    position: absolute; top: -40%; right: -40%; width: 180%; height: 180%;
    background: radial-gradient(circle at 65% 25%, rgba(139,92,246,0.06) 0%, transparent 45%);
    pointer-events: none;
  }
  .cat-modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 1.75rem; border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative; z-index: 1;
  }
  .cat-modal-title {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 1.15rem; font-weight: 700; color: #ffffff;
  }
  .cat-modal-title-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
    display: flex; align-items: center; justify-content: center;
    color: white; box-shadow: 0 4px 12px rgba(139,92,246,0.3);
  }
  .cat-modal-close {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.3s ease;
  }
  .cat-modal-close:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171; transform: rotate(90deg); }
  .cat-modal-body { padding: 1.5rem 1.75rem; position: relative; z-index: 1; }
  .cat-modal-footer {
    padding: 1rem 1.75rem 1.5rem; display: flex; gap: 0.75rem;
    position: relative; z-index: 1;
  }

  /* ===== FORM ===== */
  .cat-form-group { margin-bottom: 1.25rem; }
  .cat-label {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 11.5px; font-weight: 700; color: rgba(148,163,184,0.85);
    margin-bottom: 0.45rem; text-transform: uppercase; letter-spacing: 0.6px;
    transition: color 0.3s ease;
  }
  .cat-label-icon { color: rgba(148,163,184,0.4); display: flex; transition: color 0.3s ease; }
  .cat-form-group:focus-within .cat-label { color: #60a5fa; }
  .cat-form-group:focus-within .cat-label-icon { color: #3b82f6; }
  .cat-required { color: #f87171; margin-left: 1px; }
  .cat-input, .cat-textarea {
    width: 100%; padding: 0.75rem 1rem; font-size: 14px;
    border-radius: 12px; border: 1.5px solid rgba(59,130,246,0.15);
    background: rgba(15,23,42,0.5); color: #e2e8f0;
    outline: none; transition: all 0.35s ease; font-family: inherit;
    box-sizing: border-box;
  }
  .cat-input::placeholder, .cat-textarea::placeholder { color: rgba(148,163,184,0.35); }
  .cat-input:hover, .cat-textarea:hover { border-color: rgba(59,130,246,0.3); background: rgba(15,23,42,0.6); }
  .cat-input:focus, .cat-textarea:focus {
    border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1), 0 4px 15px rgba(59,130,246,0.1);
    background: rgba(15,23,42,0.7);
  }
  .cat-textarea { resize: vertical; min-height: 80px; }
  .cat-input-help { font-size: 11px; color: rgba(148,163,184,0.4); margin-top: 0.3rem; display: flex; align-items: center; gap: 0.25rem; }
  .cat-char-count { position: absolute; bottom: 0.55rem; right: 0.75rem; font-size: 10px; color: rgba(148,163,184,0.25); pointer-events: none; }
  .cat-submit-btn {
    flex: 1; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border: none; padding: 0.8rem 1.5rem; border-radius: 12px;
    color: white; font-weight: 700; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 18px rgba(34,197,94,0.35);
    position: relative; overflow: hidden;
  }
  .cat-submit-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s ease;
  }
  .cat-submit-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(34,197,94,0.5); }
  .cat-submit-btn:not(:disabled):hover::before { left: 100%; }
  .cat-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .cat-submit-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
  .cat-cancel-modal-btn {
    padding: 0.8rem 1.5rem; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; font-weight: 600; font-size: 14px; cursor: pointer;
    transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
  }
  .cat-cancel-modal-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #e2e8f0; }

  /* ===== ALERTS ===== */
  .cat-alert {
    border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.65rem;
    font-size: 14px; font-weight: 500; position: relative; overflow: hidden;
  }
  .cat-alert-success {
    background: linear-gradient(135deg, rgba(34,197,94,0.12), rgba(15,23,42,0.85));
    border: 1px solid rgba(34,197,94,0.25); color: #4ade80;
    animation: successPop 0.5s ease-out both;
  }
  .cat-alert-error {
    background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.85));
    border: 1px solid rgba(239,68,68,0.25); color: #f87171;
    animation: errorShake 0.5s ease-out both;
  }
  .cat-alert-close {
    margin-left: auto; background: none; border: none; color: inherit;
    cursor: pointer; opacity: 0.6; transition: opacity 0.3s; padding: 0.25rem;
    display: flex; border-radius: 6px;
  }
  .cat-alert-close:hover { opacity: 1; background: rgba(255,255,255,0.06); }
  .cat-confetti {
    position: absolute; width: 6px; height: 6px; border-radius: 2px;
    animation: confettiDrop 1s ease-out both; pointer-events: none;
  }

  /* ===== GRID VIEW ===== */
  .cat-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .cat-grid-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.78) 100%);
    border-radius: 18px; padding: 0; border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden; backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    cursor: default;
  }
  .cat-grid-card::before {
    content: ''; position: absolute; top: 0; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
    pointer-events: none; left: -100%;
  }
  .cat-grid-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.12);
    box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
  .cat-grid-card:hover::before { animation: cardShine 0.8s ease-out both; }
  .cat-grid-card:hover .cat-grid-icon { transform: scale(1.12) rotate(-5deg); }
  .cat-grid-card:hover .cat-grid-bar-fill { animation: shimmer 1.5s linear infinite; background-size: 200% 100%; }
  .cat-grid-top {
    padding: 1.25rem 1.25rem 0.75rem; display: flex; justify-content: space-between; align-items: flex-start;
  }
  .cat-grid-icon-wrap { display: flex; align-items: center; gap: 0.75rem; }
  .cat-grid-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    box-shadow: 0 4px 14px rgba(0,0,0,0.2); flex-shrink: 0;
  }
  .cat-grid-info { flex: 1; min-width: 0; }
  .cat-grid-name {
    font-size: 15px; font-weight: 700; color: #ffffff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 0.15rem;
  }
  .cat-grid-id { font-size: 11px; color: rgba(148,163,184,0.4); font-family: monospace; }
  .cat-grid-menu {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    color: rgba(148,163,184,0.5); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease; flex-shrink: 0;
  }
  .cat-grid-menu:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; border-color: rgba(255,255,255,0.12); }
  .cat-grid-desc {
    padding: 0 1.25rem; font-size: 12.5px; color: rgba(148,163,184,0.55);
    line-height: 1.5; min-height: 38px; margin-bottom: 0.75rem;
  }
  .cat-grid-bar-track {
    margin: 0 1.25rem; height: 5px; border-radius: 3px;
    background: rgba(255,255,255,0.05); overflow: hidden; margin-bottom: 0.5rem;
  }
  .cat-grid-bar-fill {
    height: 100%; border-radius: 3px;
    animation: progressGrow 1.2s ease-out both;
    width: var(--target-width, 0%); position: relative;
  }
  .cat-grid-bottom {
    padding: 0.85rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.04);
    display: flex; justify-content: space-between; align-items: center;
  }
  .cat-grid-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.25rem 0.65rem; border-radius: 20px;
    font-size: 11.5px; font-weight: 600;
  }
  .cat-grid-date {
    font-size: 11px; color: rgba(148,163,184,0.4);
    display: flex; align-items: center; gap: 0.3rem;
  }

  /* ===== LIST VIEW ===== */
  .cat-table-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.8) 100%);
    border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);
    overflow: hidden; backdrop-filter: blur(10px);
    transition: all 0.4s ease;
  }
  .cat-table-card:hover { border-color: rgba(255,255,255,0.08); }
  .cat-table-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.15rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cat-table-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 1rem; font-weight: 700; color: #ffffff;
  }
  .cat-table-title-icon { color: #60a5fa; display: flex; }
  .cat-table-count {
    background: rgba(59,130,246,0.12); color: #60a5fa;
    padding: 0.2rem 0.6rem; border-radius: 20px;
    font-size: 11px; font-weight: 700; border: 1px solid rgba(59,130,246,0.2);
  }
  .cat-table { width: 100%; border-collapse: separate; border-spacing: 0; }
  .cat-th {
    text-align: left; padding: 0.8rem 1.25rem; font-size: 11px; font-weight: 700;
    color: rgba(148,163,184,0.6); text-transform: uppercase; letter-spacing: 0.6px;
    border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(15,23,42,0.35);
  }
  .cat-tr {
    transition: all 0.3s ease; cursor: default;
  }
  .cat-tr:hover { background: rgba(59,130,246,0.04); }
  .cat-tr:hover .cat-tr-icon { transform: scale(1.1) rotate(-3deg); }
  .cat-tr-new { animation: rowHighlight 2s ease-out both; }
  .cat-td {
    padding: 0.9rem 1.25rem; font-size: 13px; color: #e2e8f0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .cat-tr-name {
    display: flex; align-items: center; gap: 0.65rem;
    font-weight: 600; color: #ffffff; font-size: 14px;
  }
  .cat-tr-icon {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: white; flex-shrink: 0;
    transition: all 0.35s ease; font-size: 14px;
  }
  .cat-tr-desc { color: rgba(148,163,184,0.6); font-size: 13px; max-width: 250px; }
  .cat-tr-empty-desc { font-style: italic; color: rgba(148,163,184,0.3); }
  .cat-tr-id {
    background: rgba(255,255,255,0.05); padding: 0.2rem 0.55rem;
    border-radius: 6px; font-size: 11px; color: rgba(148,163,184,0.6);
    font-family: monospace; display: inline-block;
  }
  .cat-tr-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.25rem 0.7rem; border-radius: 20px;
    font-size: 11.5px; font-weight: 600;
    background: rgba(59,130,246,0.12); color: #60a5fa;
    border: 1px solid rgba(59,130,246,0.2);
  }
  .cat-tr-date {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.6rem; border-radius: 8px;
    font-size: 11.5px; font-weight: 500;
    background: rgba(139,92,246,0.1); color: #c4b5fd;
    border: 1px solid rgba(139,92,246,0.15);
  }
  .cat-tr-actions { display: flex; gap: 0.4rem; }
  .cat-tr-action-btn {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    color: rgba(148,163,184,0.5); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .cat-tr-action-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
  .cat-tr-action-delete:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }

  /* ===== DISTRIBUTION BAR ===== */
  .cat-distrib {
    background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.75) 100%);
    border-radius: 18px; padding: 1.25rem; border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 1.5rem; backdrop-filter: blur(10px);
    transition: all 0.4s ease;
  }
  .cat-distrib:hover { border-color: rgba(255,255,255,0.08); }
  .cat-distrib-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-bottom: 1rem;
  }
  .cat-distrib-title-icon { color: #fbbf24; display: flex; }
  .cat-distrib-bar {
    display: flex; height: 10px; border-radius: 5px; overflow: hidden;
    background: rgba(255,255,255,0.04); margin-bottom: 1rem;
  }
  .cat-distrib-segment {
    height: 100%; transition: all 0.6s ease;
    position: relative; min-width: 3px;
  }
  .cat-distrib-segment:first-child { border-radius: 5px 0 0 5px; }
  .cat-distrib-segment:last-child { border-radius: 0 5px 5px 0; }
  .cat-distrib-segment:only-child { border-radius: 5px; }
  .cat-distrib-segment:hover { opacity: 0.8; transform: scaleY(1.4); }
  .cat-distrib-legend { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .cat-distrib-item {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 12px; color: rgba(148,163,184,0.65);
    padding: 0.3rem 0.5rem; border-radius: 6px;
    transition: all 0.3s ease; cursor: default;
  }
  .cat-distrib-item:hover { background: rgba(255,255,255,0.04); color: #e2e8f0; }
  .cat-distrib-dot { width: 8px; height: 8px; border-radius: 3px; flex-shrink: 0; }
  .cat-distrib-pct { color: rgba(148,163,184,0.4); font-size: 11px; }

  /* ===== EMPTY STATE ===== */
  .cat-empty {
    padding: 4.5rem 2rem; text-align: center; color: rgba(148,163,184,0.5);
  }
  .cat-empty-icon-wrap {
    width: 72px; height: 72px; border-radius: 22px;
    background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(139,92,246,0.1));
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem; border: 1px solid rgba(245,158,11,0.15);
    animation: iconFloat 3s ease-in-out infinite;
  }
  .cat-empty-title { font-size: 1.15rem; font-weight: 700; color: rgba(148,163,184,0.75); margin-bottom: 0.5rem; }
  .cat-empty-text { font-size: 0.85rem; color: rgba(148,163,184,0.45); margin-bottom: 1.25rem; }
  .cat-empty-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.65rem 1.25rem; border-radius: 11px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white; font-weight: 600; font-size: 13px;
    border: none; cursor: pointer;
    box-shadow: 0 4px 15px rgba(59,130,246,0.3);
    transition: all 0.3s ease;
  }
  .cat-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59,130,246,0.4); }

  /* ===== LOADING ===== */
  .cat-loading-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 80vh; gap: 1.5rem;
  }
  .cat-loading-logo { position: relative; width: 65px; height: 65px; display: flex; align-items: center; justify-content: center; }
  .cat-loading-ring {
    position: absolute; inset: 0; border: 3px solid rgba(245,158,11,0.15);
    border-top-color: #f59e0b; border-right-color: #f97316;
    border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5,0,0.5,1) infinite;
  }
  .cat-loading-ring-inner {
    position: absolute; inset: 8px; border: 2px solid rgba(139,92,246,0.1);
    border-bottom-color: #8b5cf6; border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.5,0,0.5,1) infinite reverse;
  }
  .cat-loading-center { color: #fbbf24; font-size: 1.4rem; animation: breathe 1.5s ease-in-out infinite; display: flex; }
  .cat-loading-dots { display: flex; gap: 0.4rem; }
  .cat-loading-dot { width: 8px; height: 8px; border-radius: 50%; animation: dotPulse 1.4s ease-in-out infinite; }
  .cat-loading-dot:nth-child(1) { background: #f59e0b; }
  .cat-loading-dot:nth-child(2) { background: #f97316; animation-delay: 0.2s; }
  .cat-loading-dot:nth-child(3) { background: #8b5cf6; animation-delay: 0.4s; }
  .cat-loading-text { color: rgba(148,163,184,0.7); font-size: 14px; font-weight: 500; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1100px) {
    .cat-stats { grid-template-columns: repeat(2, 1fr); }
    .cat-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  }
  @media (max-width: 768px) {
    .cat-root { padding: 1rem; }
    .cat-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
    .cat-stats { grid-template-columns: 1fr 1fr; }
    .cat-toolbar { flex-direction: column; }
    .cat-search-wrap { max-width: 100%; }
    .cat-grid { grid-template-columns: 1fr; }
    .cat-modal { margin: 1rem; }
  }
`;

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */

const CAT_COLORS = [
  { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: '#3b82f6', light: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
  { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', glow: '#8b5cf6', light: 'rgba(139,92,246,0.12)', text: '#a78bfa' },
  { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: '#f59e0b', light: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
  { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', glow: '#22c55e', light: 'rgba(34,197,94,0.12)', text: '#4ade80' },
  { bg: 'linear-gradient(135deg, #ec4899, #db2777)', glow: '#ec4899', light: 'rgba(236,72,153,0.12)', text: '#f472b6' },
  { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', glow: '#06b6d4', light: 'rgba(6,182,212,0.12)', text: '#22d3ee' },
  { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: '#ef4444', light: 'rgba(239,68,68,0.12)', text: '#f87171' },
  { bg: 'linear-gradient(135deg, #f97316, #ea580c)', glow: '#f97316', light: 'rgba(249,115,22,0.12)', text: '#fb923c' },
  { bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', glow: '#14b8a6', light: 'rgba(20,184,166,0.12)', text: '#2dd4bf' },
  { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', glow: '#6366f1', light: 'rgba(99,102,241,0.12)', text: '#818cf8' },
];

const CONFETTI_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

/* ─────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────── */

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

function MiniSparkline({ color, delay = 0, values }) {
  const bars = values || [35, 55, 40, 70, 45, 80, 60, 50, 75, 65];
  return (
    <div className="cat-stat-spark" style={{ color }}>
      {bars.map((h, i) => (
        <div key={i} className="cat-spark-bar"
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
        <span key={i} className="cat-confetti"
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

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [refreshing, setRefreshing] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const [descLength, setDescLength] = useState(0);
  const nameInputRef = useRef(null);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    try {
      setLoading(prev => categories.length === 0 ? true : prev);
      setRefreshing(true);
      const res = await fetch('/api/categories');
      const result = await res.json();
      if (result.success) setCategories(result.data || []);
      else throw new Error(result.message);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); setRefreshing(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      if (!newCategory.categoryName.trim()) throw new Error('Category name is required');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setSuccess('Category created successfully!');
      setNewlyAddedId(result.data?.CategoryID || null);
      setNewCategory({ categoryName: '', description: '' });
      setDescLength(0);
      setShowModal(false);
      fetchCategories();
      setTimeout(() => { setSuccess(null); setNewlyAddedId(null); }, 4000);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  function openModal() {
    setShowModal(true);
    setError(null);
    setTimeout(() => nameInputRef.current?.focus(), 300);
  }
  function closeModal() {
    setShowModal(false);
    setNewCategory({ categoryName: '', description: '' });
    setDescLength(0);
    setError(null);
  }

  function getColor(i) { return CAT_COLORS[i % CAT_COLORS.length]; }

  /* ── Computed ── */
  const totalProducts = categories.reduce((s, c) => s + (c.ProductCount || 0), 0);
  const maxProducts = Math.max(...categories.map(c => c.ProductCount || 0), 1);
  const avgProducts = categories.length > 0 ? Math.round(totalProducts / categories.length) : 0;
  const newestCategory = categories.length > 0
    ? categories.reduce((a, b) => new Date(a.CreatedAt) > new Date(b.CreatedAt) ? a : b)
    : null;

  const filtered = categories.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.CategoryName.toLowerCase().includes(q)
      || (c.Description && c.Description.toLowerCase().includes(q));
  });

  /* ── Loading ── */
  if (loading && categories.length === 0) {
    return (
      <div className="cat-root">
        <style>{globalCSS}</style>
        <div className="cat-orb cat-orb-1" /><div className="cat-orb cat-orb-2" />
        <div className="cat-loading-screen">
          <div className="cat-loading-logo">
            <div className="cat-loading-ring" /><div className="cat-loading-ring-inner" />
            <span className="cat-loading-center"><HiOutlineTag size={26} /></span>
          </div>
          <div className="cat-loading-dots">
            <span className="cat-loading-dot" /><span className="cat-loading-dot" /><span className="cat-loading-dot" />
          </div>
          <p className="cat-loading-text">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cat-root">
      <style>{globalCSS}</style>

      {/* Background Orbs */}
      <div className="cat-orb cat-orb-1" /><div className="cat-orb cat-orb-2" /><div className="cat-orb cat-orb-3" />

      <div className="cat-content">

        {/* ══════════ HEADER ══════════ */}
        <header className="cat-header">
          <div className="cat-header-glow" />
          <div className="cat-header-left">
            <div className="cat-header-top">
              <div className="cat-header-icon"><HiOutlineTag size={23} /></div>
              <h1 className="cat-header-title">Categories</h1>
            </div>
            <p className="cat-header-subtitle">
              <span className="cat-status-dot" />
              <span>Organize and manage your product categories</span>
            </p>
          </div>
          <div className="cat-header-actions">
            <button className="cat-refresh-btn" onClick={fetchCategories} title="Refresh">
              <span className="cat-refresh-icon" style={refreshing ? { animation: 'spin 1s linear infinite' } : {}}>
                <HiOutlineArrowPath size={17} />
              </span>
            </button>
            <button className="cat-add-btn" onClick={openModal}>
              <HiOutlinePlusCircle size={17} /> Add Category
            </button>
          </div>
        </header>

        {/* Wave Divider */}
        <div className="cat-wave">
          <svg className="cat-wave-svg" viewBox="0 0 1000 25" preserveAspectRatio="none">
            <path d="M0,12 C150,25 350,0 500,12 C650,25 850,0 1000,12 L1000,25 L0,25 Z" fill="rgba(245,158,11,0.25)" />
            <path d="M0,18 C200,5 300,22 500,18 C700,14 800,24 1000,18 L1000,25 L0,25 Z" fill="rgba(139,92,246,0.15)" />
          </svg>
        </div>

        {/* ══════════ ALERTS ══════════ */}
        {success && (
          <div className="cat-alert cat-alert-success">
            <ConfettiBurst />
            <HiOutlineCheckCircle size={19} /> {success}
            <HiOutlineRocketLaunch size={15} style={{ opacity: 0.6 }} />
            <button className="cat-alert-close" onClick={() => setSuccess(null)}>
              <HiOutlineXMark size={15} />
            </button>
          </div>
        )}
        {error && (
          <div className="cat-alert cat-alert-error">
            <HiOutlineExclamationTriangle size={19} /> {error}
            <button className="cat-alert-close" onClick={() => setError(null)}>
              <HiOutlineXMark size={15} />
            </button>
          </div>
        )}

        {/* ══════════ STATS ══════════ */}
        <div className="cat-stats">
          {[
            { icon: <HiOutlineSquares2X2 size={20} />, label: 'Total Categories', value: categories.length, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: '#f59e0b', sparkColor: '#fbbf24', delay: 0.5 },
            { icon: <HiOutlineCube size={20} />, label: 'Total Products', value: totalProducts, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: '#3b82f6', sparkColor: '#60a5fa', delay: 0.6 },
            { icon: <HiOutlineChartBar size={20} />, label: 'Avg per Category', value: avgProducts, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', glow: '#8b5cf6', sparkColor: '#a78bfa', delay: 0.7 },
            { icon: <HiOutlineFire size={20} />, label: 'Newest Category', value: newestCategory?.CategoryName || '—', gradient: 'linear-gradient(135deg, #ec4899, #db2777)', glow: '#ec4899', sparkColor: '#f472b6', delay: 0.8, isText: true },
          ].map((stat, i) => (
            <div key={i} className="cat-stat-card anim-entry" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <div className="cat-stat-glow" style={{ background: stat.glow }} />
              <div className="cat-stat-top">
                <div className="cat-stat-icon" style={{ background: stat.gradient }}>{stat.icon}</div>
                {!stat.isText && <MiniSparkline color={stat.sparkColor} delay={stat.delay} />}
              </div>
              <div className="cat-stat-value">
                {stat.isText ? (
                  <span style={{ fontSize: '1rem' }}>{stat.value}</span>
                ) : (
                  <AnimatedCounter value={stat.value} duration={1200 + i * 200} />
                )}
              </div>
              <div className="cat-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ══════════ DISTRIBUTION BAR ══════════ */}
        {categories.length > 0 && (
          <div className="cat-distrib anim-entry" style={{ animationDelay: '0.35s' }}>
            <div className="cat-distrib-title">
              <span className="cat-distrib-title-icon"><HiOutlineChartBar size={16} /></span>
              Product Distribution
            </div>
            <div className="cat-distrib-bar">
              {categories.map((cat, i) => {
                const pct = totalProducts > 0 ? ((cat.ProductCount || 0) / totalProducts) * 100 : 0;
                const color = getColor(i);
                return (
                  <div key={cat.CategoryID}
                    className="cat-distrib-segment"
                    style={{ width: `${Math.max(pct, 1)}%`, background: color.bg }}
                    title={`${cat.CategoryName}: ${cat.ProductCount || 0} products (${pct.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
            <div className="cat-distrib-legend">
              {categories.map((cat, i) => {
                const pct = totalProducts > 0 ? ((cat.ProductCount || 0) / totalProducts * 100).toFixed(1) : '0.0';
                const color = getColor(i);
                return (
                  <div key={cat.CategoryID} className="cat-distrib-item">
                    <span className="cat-distrib-dot" style={{ background: color.glow }} />
                    <span>{cat.CategoryName}</span>
                    <span className="cat-distrib-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════ TOOLBAR ══════════ */}
        <div className="cat-toolbar anim-entry" style={{ animationDelay: '0.4s' }}>
          <div className="cat-search-wrap">
            <span className="cat-search-icon"><HiOutlineMagnifyingGlass size={15} /></span>
            <input
              type="text" className="cat-search"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="cat-search-clear" onClick={() => setSearchQuery('')}>
                <HiOutlineXMark size={12} />
              </button>
            )}
          </div>
          <div className="cat-toolbar-right">
            <div className="cat-view-toggle">
              <button
                className={`cat-view-btn ${viewMode === 'grid' ? 'cat-view-btn-active' : ''}`}
                onClick={() => setViewMode('grid')} title="Grid View"
              >
                <HiOutlineSquares2X2 size={16} />
              </button>
              <button
                className={`cat-view-btn ${viewMode === 'list' ? 'cat-view-btn-active' : ''}`}
                onClick={() => setViewMode('list')} title="List View"
              >
                <HiOutlineListBullet size={16} />
              </button>
            </div>
            <button className="cat-sort-btn">
              <HiOutlineAdjustmentsHorizontal size={13} /> Sort
            </button>
          </div>
        </div>

        {/* ══════════ GRID VIEW ══════════ */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="cat-grid">
            {filtered.map((cat, i) => {
              const color = getColor(i);
              const pct = maxProducts > 0 ? ((cat.ProductCount || 0) / maxProducts) * 100 : 0;
              const isNew = cat.CategoryID === newlyAddedId;
              return (
                <div key={cat.CategoryID}
                  className={`cat-grid-card anim-entry ${isNew ? 'cat-tr-new' : ''}`}
                  style={{ animationDelay: `${0.45 + i * 0.07}s` }}
                >
                  <div className="cat-grid-top">
                    <div className="cat-grid-icon-wrap">
                      <div className="cat-grid-icon" style={{ background: color.bg, boxShadow: `0 4px 14px ${color.glow}33` }}>
                        <HiOutlineTag size={18} />
                      </div>
                      <div className="cat-grid-info">
                        <div className="cat-grid-name">{cat.CategoryName}</div>
                        <div className="cat-grid-id">#{cat.CategoryID}</div>
                      </div>
                    </div>
                    <button className="cat-grid-menu"><HiOutlineEllipsisHorizontal size={15} /></button>
                  </div>
                  <div className="cat-grid-desc">
                    {cat.Description || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No description provided</span>}
                  </div>
                  <div className="cat-grid-bar-track">
                    <div className="cat-grid-bar-fill"
                      style={{
                        '--target-width': `${Math.max(pct, 3)}%`,
                        background: `linear-gradient(90deg, ${color.glow}, ${color.glow}88)`,
                        animationDelay: `${0.6 + i * 0.08}s`,
                      }}
                    />
                  </div>
                  <div className="cat-grid-bottom">
                    <span className="cat-grid-badge"
                      style={{ background: color.light, color: color.text, border: `1px solid ${color.glow}25` }}
                    >
                      <HiOutlineCube size={12} /> {cat.ProductCount || 0} products
                    </span>
                    <span className="cat-grid-date">
                      <HiOutlineCalendarDays size={11} />
                      {new Date(cat.CreatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════ LIST VIEW ══════════ */}
        {viewMode === 'list' && filtered.length > 0 && (
          <div className="cat-table-card anim-entry" style={{ animationDelay: '0.45s' }}>
            <div className="cat-table-header">
              <div className="cat-table-title">
                <span className="cat-table-title-icon"><HiOutlineFolderOpen size={17} /></span>
                All Categories
              </div>
              <span className="cat-table-count">{filtered.length} {filtered.length === 1 ? 'category' : 'categories'}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="cat-table">
                <thead>
                  <tr>
                    <th className="cat-th">ID</th>
                    <th className="cat-th">Category</th>
                    <th className="cat-th">Description</th>
                    <th className="cat-th">Products</th>
                    <th className="cat-th">Created</th>
                    <th className="cat-th" style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat, i) => {
                    const color = getColor(i);
                    const isNew = cat.CategoryID === newlyAddedId;
                    return (
                      <tr key={cat.CategoryID}
                        className={`cat-tr ${isNew ? 'cat-tr-new' : ''}`}
                      >
                        <td className="cat-td"><span className="cat-tr-id">#{cat.CategoryID}</span></td>
                        <td className="cat-td">
                          <div className="cat-tr-name">
                            <div className="cat-tr-icon" style={{ background: color.bg }}>
                              <HiOutlineTag size={15} />
                            </div>
                            {cat.CategoryName}
                          </div>
                        </td>
                        <td className="cat-td">
                          <span className={cat.Description ? 'cat-tr-desc' : 'cat-tr-desc cat-tr-empty-desc'}>
                            {cat.Description || 'No description'}
                          </span>
                        </td>
                        <td className="cat-td">
                          <span className="cat-tr-badge">
                            <HiOutlineCube size={11} /> {cat.ProductCount || 0}
                          </span>
                        </td>
                        <td className="cat-td">
                          <span className="cat-tr-date">
                            <HiOutlineCalendarDays size={11} />
                            {new Date(cat.CreatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="cat-td" style={{ textAlign: 'right' }}>
                          <div className="cat-tr-actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="cat-tr-action-btn" title="Edit"><HiOutlinePencilSquare size={14} /></button>
                            <button className="cat-tr-action-btn cat-tr-action-delete" title="Delete"><HiOutlineTrash size={14} /></button>
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

        {/* ══════════ EMPTY / NO RESULTS ══════════ */}
        {filtered.length === 0 && (
          <div className="cat-table-card anim-entry" style={{ animationDelay: '0.3s' }}>
            <div className="cat-empty">
              <div className="cat-empty-icon-wrap">
                {searchQuery ? <HiOutlineMagnifyingGlass size={30} style={{ color: '#fbbf24' }} /> : <HiOutlineTag size={30} style={{ color: '#fbbf24' }} />}
              </div>
              <h3 className="cat-empty-title">
                {searchQuery ? 'No categories found' : 'No categories yet'}
              </h3>
              <p className="cat-empty-text">
                {searchQuery
                  ? `No results matching "${searchQuery}". Try a different search.`
                  : 'Add your first category to start organizing your products.'
                }
              </p>
              {!searchQuery && (
                <button className="cat-empty-btn" onClick={openModal}>
                  <HiOutlinePlusCircle size={16} /> Create First Category
                </button>
              )}
              {searchQuery && (
                <button className="cat-empty-btn" onClick={() => setSearchQuery('')}
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  <HiOutlineXMark size={16} /> Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════ ADD CATEGORY MODAL ══════════ */}
        {showModal && (
          <div className="cat-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
            <div className="cat-modal">
              <div className="cat-modal-glow" />
              <div className="cat-modal-header">
                <div className="cat-modal-title">
                  <div className="cat-modal-title-icon"><HiOutlineSparkles size={17} /></div>
                  <span>Add New Category</span>
                </div>
                <button className="cat-modal-close" onClick={closeModal}>
                  <HiOutlineXMark size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="cat-modal-body">
                  {error && (
                    <div className="cat-alert cat-alert-error" style={{ marginBottom: '1rem' }}>
                      <HiOutlineExclamationTriangle size={17} /> {error}
                    </div>
                  )}

                  <div className="cat-form-group">
                    <label className="cat-label">
                      <span className="cat-label-icon"><HiOutlineTag size={12} /></span>
                      Category Name <span className="cat-required">*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text" className="cat-input"
                      placeholder="e.g., Electronics, Clothing..."
                      value={newCategory.categoryName}
                      onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                      required maxLength={100}
                    />
                    <div className="cat-input-help">
                      <HiOutlineInformationCircle size={11} /> Choose a clear, descriptive name
                    </div>
                  </div>

                  <div className="cat-form-group" style={{ position: 'relative' }}>
                    <label className="cat-label">
                      <span className="cat-label-icon"><HiOutlineDocumentText size={12} /></span>
                      Description
                    </label>
                    <textarea
                      className="cat-textarea"
                      placeholder="Brief description of this category..."
                      value={newCategory.description}
                      onChange={(e) => { setNewCategory({ ...newCategory, description: e.target.value }); setDescLength(e.target.value.length); }}
                      maxLength={300} rows={3}
                    />
                    <span className="cat-char-count">{descLength}/300</span>
                  </div>

                  {/* Live Preview */}
                  {newCategory.categoryName && (
                    <div style={{
                      background: 'rgba(59,130,246,0.06)',
                      border: '1px solid rgba(59,130,246,0.12)',
                      borderRadius: '12px', padding: '0.85rem 1rem',
                      animation: 'fadeInScale 0.3s ease-out both',
                    }}>
                      <div style={{ fontSize: '11px', color: 'rgba(148,163,184,0.5)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <HiOutlineEye size={11} /> Preview
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        }}>
                          <HiOutlineTag size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{newCategory.categoryName}</div>
                          {newCategory.description && (
                            <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginTop: 2 }}>{newCategory.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="cat-modal-footer">
                  <button type="submit" className="cat-submit-btn" disabled={submitting}>
                    {submitting ? (
                      <><div className="cat-submit-spinner" /> Creating...</>
                    ) : (
                      <><HiOutlinePlusCircle size={17} /> Create Category</>
                    )}
                  </button>
                  <button type="button" className="cat-cancel-modal-btn" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}