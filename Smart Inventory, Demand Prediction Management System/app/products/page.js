'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  HiOutlineCube,
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineExclamationTriangle,
  HiOutlineArchiveBox,
  HiOutlineBanknotes,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
  HiOutlineFunnel,
  HiOutlineArrowPath,
  HiOutlineChevronDown,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineArrowUp,
  HiOutlineXMark,
  HiOutlineChartBarSquare,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineEye,
  HiOutlineAdjustmentsHorizontal,
} from 'react-icons/hi2';

/* ───────────────────── keyframe injection ───────────────────── */
const keyframes = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-12px); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33%      { transform: translateY(-8px) translateX(5px); }
  66%      { transform: translateY(4px) translateX(-3px); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(59,130,246,0.3); }
  50%      { box-shadow: 0 0 25px rgba(59,130,246,0.6); }
}
@keyframes borderGlow {
  0%, 100% { border-color: rgba(59,130,246,0.2); }
  50%      { border-color: rgba(139,92,246,0.5); }
}
@keyframes slideInRow {
  from { opacity: 0; transform: translateX(-15px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%      { transform: translate(60px, -40px) scale(1.1); }
  50%      { transform: translate(-30px, -80px) scale(0.95); }
  75%      { transform: translate(-60px, 20px) scale(1.05); }
}
@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%      { transform: translate(-50px, 50px) scale(1.08); }
  50%      { transform: translate(40px, 20px) scale(0.92); }
  75%      { transform: translate(20px, -60px) scale(1.03); }
}
@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(70px, 30px) scale(1.12); }
  66%      { transform: translate(-40px, -50px) scale(0.9); }
}
@keyframes ripple {
  0%   { transform: scale(0); opacity: 0.6; }
  100% { transform: scale(4); opacity: 0; }
}
@keyframes skeletonPulse {
  0%   { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
@keyframes slideDown {
  from { max-height: 0; opacity: 0; }
  to   { max-height: 600px; opacity: 1; }
}
@keyframes typewriter {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes blink {
  0%, 100% { border-color: transparent; }
  50%      { border-color: #60a5fa; }
}
@keyframes marqueeGlow {
  0%   { left: -30%; }
  100% { left: 130%; }
}
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%      { transform: scale(1.05); opacity: 1; }
}
@keyframes progressFill {
  from { width: 0%; }
  to   { width: var(--fill); }
}
@keyframes rotateIn {
  from { transform: rotate(-90deg); opacity: 0; }
  to   { transform: rotate(0); opacity: 1; }
}
@keyframes wobble {
  0%, 100% { transform: rotate(0deg); }
  25%      { transform: rotate(2deg); }
  75%      { transform: rotate(-2deg); }
}
`;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [minWarehouseValue, setMinWarehouseValue] = useState('');
  const [maxWarehouseValue, setMaxWarehouseValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let count = 0;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (selectedCategory) count++;
    if (minCost) count++;
    if (maxCost) count++;
    if (minStock) count++;
    if (maxStock) count++;
    if (minWarehouseValue) count++;
    if (maxWarehouseValue) count++;
    setActiveFiltersCount(count);
  }, [minPrice, maxPrice, selectedCategory, minCost, maxCost, minStock, maxStock, minWarehouseValue, maxWarehouseValue]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setProducts(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v || 0);

  const clearFilters = () => {
    setMinPrice(''); setMaxPrice(''); setSelectedCategory('');
    setMinCost(''); setMaxCost(''); setMinStock(''); setMaxStock('');
    setMinWarehouseValue(''); setMaxWarehouseValue('');
  };

  const getUniqueCategories = () => [...new Set(products.map(p => p.CategoryName))].sort();

  const filteredProducts = products.filter(product => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = product.ProductName.toLowerCase().includes(s) ||
      product.ProductCode.toLowerCase().includes(s) ||
      product.CategoryName.toLowerCase().includes(s);
    const price = parseFloat(product.Price) || 0;
    const matchesPrice = (!minPrice || price >= +minPrice) && (!maxPrice || price <= +maxPrice);
    const matchesCat = !selectedCategory || product.CategoryName === selectedCategory;
    const cost = parseFloat(product.Cost) || 0;
    const matchesCost = (!minCost || cost >= +minCost) && (!maxCost || cost <= +maxCost);
    const stock = parseFloat(product.CurrentStock) || 0;
    const matchesStock = (!minStock || stock >= +minStock) && (!maxStock || stock <= +maxStock);
    const wv = parseFloat(product.StockValue) || 0;
    const matchesWV = (!minWarehouseValue || wv >= +minWarehouseValue) && (!maxWarehouseValue || wv <= +maxWarehouseValue);
    return matchesSearch && matchesPrice && matchesCat && matchesCost && matchesStock && matchesWV;
  });

  const lowStockCount = products.filter(p => p.StockStatus === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.StockStatus === 'Out of Stock').length;
  const inStockCount = products.filter(p => p.StockStatus !== 'Low Stock' && p.StockStatus !== 'Out of Stock').length;
  const totalValue = products.reduce((s, p) => s + (parseFloat(p.StockValue) || 0), 0);
  const maxStockVal = Math.max(...products.map(p => parseFloat(p.CurrentStock) || 0), 1);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ───── Loading ───── */
  if (loading) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a0f1e 0%, #111936 50%, #0a0f1e 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Floating orbs */}
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', top: '20%', left: '15%', animation: 'orbFloat1 8s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', top: '60%', right: '20%', animation: 'orbFloat2 10s ease-in-out infinite', pointerEvents: 'none' }} />

          {/* Skeleton cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', maxWidth: 700 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                height: 60, borderRadius: 16,
                background: 'linear-gradient(90deg, rgba(30,41,59,0.4) 25%, rgba(59,130,246,0.08) 50%, rgba(30,41,59,0.4) 75%)',
                backgroundSize: '200px 100%',
                animation: `skeletonPulse 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.12}s`,
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 44, height: 44,
              border: '3px solid rgba(59,130,246,0.15)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite',
            }} />
            <span style={{ color: 'rgba(148,163,184,0.8)', fontSize: 15, fontWeight: 500, animation: 'pulse 1.5s ease-in-out infinite' }}>
              Loading products…
            </span>
          </div>
        </div>
      </>
    );
  }

  /* ───── Error ───── */
  if (error) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a0f1e 0%, #111936 50%, #0a0f1e 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(127,29,29,0.2) 0%, rgba(15,23,42,0.95) 100%)',
            borderRadius: 24, padding: '2.5rem', maxWidth: 480, width: '100%',
            border: '1px solid rgba(239,68,68,0.25)', textAlign: 'center',
            animation: 'fadeInScale 0.5s ease-out',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1.5rem',
              animation: 'breathe 2s ease-in-out infinite',
            }}>
              <HiOutlineExclamationTriangle size={36} style={{ color: '#f87171' }} />
            </div>
            <h3 style={{ color: '#fca5a5', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Something went wrong</h3>
            <p style={{ color: 'rgba(252,165,165,0.7)', fontSize: 14, marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={fetchProducts} style={{
              padding: '0.75rem 2rem', borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <HiOutlineArrowPath size={16} /> Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────── MAIN RENDER ─────────────────── */
  return (
    <>
      <style>{keyframes}</style>
      <div ref={containerRef} style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0f1e 0%, #0f172a 30%, #111936 60%, #0a0f1e 100%)',
        padding: '1.5rem 2rem 3rem',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* ── Animated background orbs ── */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', top: '5%', left: '10%', animation: 'orbFloat1 12s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', top: '40%', right: '5%', animation: 'orbFloat2 15s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', bottom: '10%', left: '30%', animation: 'orbFloat3 18s ease-in-out infinite' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ════════════════ HEADER ════════════════ */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '1.75rem', padding: '1.75rem 2rem',
            background: 'linear-gradient(145deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.4) 100%)',
            borderRadius: 24,
            border: '1px solid rgba(59,130,246,0.12)',
            backdropFilter: 'blur(30px)',
            position: 'relative', overflow: 'hidden',
            animation: mounted ? 'fadeInDown 0.6s ease-out' : 'none',
          }}>
            {/* Marquee glow */}
            <div style={{
              position: 'absolute', top: 0, width: '30%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.06), transparent)',
              animation: 'marqueeGlow 6s linear infinite', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 style={{
                fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px',
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #c4b5fd 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 4s ease infinite',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                <span style={{
                  width: 48, height: 48,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
                  animation: 'float 3s ease-in-out infinite',
                  WebkitTextFillColor: 'white',
                }}>
                  <HiOutlineCube size={24} />
                </span>
                Products
              </h1>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.9rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-flex', padding: '2px 10px', borderRadius: 20,
                  background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
                  color: '#93c5fd', fontSize: 12, fontWeight: 600,
                  animation: 'fadeInLeft 0.8s ease-out',
                }}>
                  {products.length} items
                </span>
                Manage your product inventory
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <button onClick={fetchProducts} style={{
                width: 44, height: 44, borderRadius: 12,
                border: '1px solid rgba(59,130,246,0.2)',
                background: 'rgba(59,130,246,0.08)', color: '#60a5fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.transform = 'rotate(0)'; }}
              >
                <HiOutlineArrowPath size={18} />
              </button>
              <Link href="/products/add" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none', padding: '0.75rem 1.75rem', borderRadius: 14,
                color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 6px 24px rgba(59,130,246,0.35)',
                animation: 'fadeInRight 0.7s ease-out',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(59,130,246,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(59,130,246,0.35)'; }}
              >
                <HiOutlineSparkles size={16} /> Add Product
              </Link>
            </div>
          </div>

          {/* ════════════════ STATS STRIP ════════════════ */}
          {products.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
              marginBottom: '1.75rem',
            }}>
              {[
                { icon: <HiOutlineCube size={22} />, label: 'Total Products', value: products.length, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', delay: '0s' },
                { icon: <HiOutlineBanknotes size={22} />, label: 'Inventory Value', value: formatCurrency(totalValue), color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', delay: '0.1s' },
                { icon: <HiOutlineExclamationCircle size={22} />, label: 'Low Stock', value: lowStockCount, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', delay: '0.2s' },
                { icon: <HiOutlineXCircle size={22} />, label: 'Out of Stock', value: outOfStockCount, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', delay: '0.3s' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(145deg, rgba(15,23,42,0.7) 0%, rgba(30,41,59,0.4) 100%)',
                  borderRadius: 18, padding: '1.25rem 1.5rem',
                  border: `1px solid ${stat.border}`,
                  backdropFilter: 'blur(20px)',
                  position: 'relative', overflow: 'hidden',
                  cursor: 'default', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  animation: `fadeInUp 0.6s ease-out ${stat.delay} both`,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${stat.bg}`;
                    e.currentTarget.style.borderColor = stat.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = stat.border;
                  }}
                >
                  {/* corner glow */}
                  <div style={{
                    position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                    borderRadius: '50%', background: stat.bg, filter: 'blur(25px)',
                    animation: 'breathe 3s ease-in-out infinite',
                    animationDelay: stat.delay,
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 13,
                      background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: stat.color, transition: 'transform 0.3s ease',
                    }}>
                      {stat.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: typeof stat.value === 'number' ? '1.5rem' : '1.15rem',
                        fontWeight: 800, color: '#fff',
                        animation: 'countUp 0.5s ease-out',
                      }}>{stat.value}</div>
                      <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.7)', fontWeight: 500 }}>{stat.label}</div>
                    </div>
                  </div>
                  {/* bottom bar */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                    opacity: 0.4,
                  }} />
                </div>
              ))}
            </div>
          )}

          {/* ════════════════ SEARCH + VIEW TOGGLE ════════════════ */}
          <div style={{
            display: 'flex', gap: '1rem', marginBottom: '1.25rem',
            animation: 'fadeInUp 0.6s ease-out 0.15s both',
          }}>
            <div style={{
              flex: 1, position: 'relative',
              background: 'linear-gradient(145deg, rgba(15,23,42,0.7) 0%, rgba(30,41,59,0.4) 100%)',
              borderRadius: 16, padding: '4px',
              border: searchFocused ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.06)',
              boxShadow: searchFocused ? '0 0 0 4px rgba(59,130,246,0.08), 0 8px 32px rgba(59,130,246,0.15)' : 'none',
              transition: 'all 0.35s ease',
            }}>
              <HiOutlineMagnifyingGlass size={18} style={{
                position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                color: searchFocused ? '#60a5fa' : 'rgba(148,163,184,0.4)',
                transition: 'color 0.3s ease',
              }} />
              <input
                type="text"
                placeholder="Search products by name, code, or category…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%', padding: '14px 50px 14px 48px', fontSize: 14,
                  borderRadius: 12, border: 'none',
                  background: 'transparent', color: '#e2e8f0', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(239,68,68,0.15)', border: 'none',
                  width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#f87171', transition: 'all 0.2s ease',
                  animation: 'fadeInScale 0.2s ease-out',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                >
                  <HiOutlineXMark size={14} />
                </button>
              )}
            </div>

            {/* View mode toggle */}
            <div style={{
              display: 'flex', borderRadius: 14,
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              {[
                { mode: 'table', icon: <HiOutlineListBullet size={18} /> },
                { mode: 'grid', icon: <HiOutlineSquares2X2 size={18} /> },
              ].map(v => (
                <button key={v.mode} onClick={() => setViewMode(v.mode)} style={{
                  padding: '0.75rem 1rem', border: 'none', cursor: 'pointer',
                  background: viewMode === v.mode ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: viewMode === v.mode ? '#60a5fa' : 'rgba(148,163,184,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => { if (viewMode !== v.mode) e.currentTarget.style.color = '#94a3b8'; }}
                  onMouseLeave={e => { if (viewMode !== v.mode) e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; }}
                >
                  {v.icon}
                </button>
              ))}
            </div>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)} style={{
              padding: '0.75rem 1.25rem', borderRadius: 14,
              border: showFilters ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
              background: showFilters ? 'rgba(139,92,246,0.15)' : 'rgba(15,23,42,0.6)',
              color: showFilters ? '#c4b5fd' : 'rgba(148,163,184,0.6)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, fontWeight: 600, transition: 'all 0.3s ease',
              position: 'relative',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.color = '#c4b5fd'; }}
              onMouseLeave={e => {
                if (!showFilters) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(148,163,184,0.6)'; }
              }}
            >
              <HiOutlineAdjustmentsHorizontal size={16} />
              Filters
              {activeFiltersCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'fadeInScale 0.3s ease-out',
                  boxShadow: '0 2px 8px rgba(139,92,246,0.4)',
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* ════════════════ FILTERS PANEL ════════════════ */}
          <div style={{
            maxHeight: showFilters ? 600 : 0,
            opacity: showFilters ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: showFilters ? '1.5rem' : 0,
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.5) 100%)',
              borderRadius: 20, border: '1px solid rgba(139,92,246,0.15)',
              backdropFilter: 'blur(30px)', overflow: 'hidden',
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.25rem', padding: '1.5rem',
              }}>
                {/* Price */}
                <FilterGroup label="💵 Price Range" delay="0s">
                  <RangeInputs v1={minPrice} v2={maxPrice} s1={setMinPrice} s2={setMaxPrice} step="0.01" />
                </FilterGroup>
                {/* Category */}
                <FilterGroup label="📂 Category" delay="0.05s">
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    style={filterSelectStyle}>
                    <option value="">All Categories</option>
                    {getUniqueCategories().map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FilterGroup>
                {/* Cost */}
                <FilterGroup label="📊 Cost Range" delay="0.1s">
                  <RangeInputs v1={minCost} v2={maxCost} s1={setMinCost} s2={setMaxCost} step="0.01" />
                </FilterGroup>
                {/* Stock */}
                <FilterGroup label="📦 Stock Range" delay="0.15s">
                  <RangeInputs v1={minStock} v2={maxStock} s1={setMinStock} s2={setMaxStock} />
                </FilterGroup>
                {/* Warehouse Value */}
                <FilterGroup label="🏢 Warehouse Value" delay="0.2s">
                  <RangeInputs v1={minWarehouseValue} v2={maxWarehouseValue} s1={setMinWarehouseValue} s2={setMaxWarehouseValue} step="0.01" />
                </FilterGroup>
              </div>

              {/* Filter actions */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(139,92,246,0.1)',
                background: 'rgba(15,23,42,0.3)',
              }}>
                <button onClick={clearFilters} style={{
                  padding: '0.6rem 1.25rem', borderRadius: 10,
                  border: '1px solid rgba(239,68,68,0.25)',
                  background: 'rgba(239,68,68,0.08)', color: '#fca5a5',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <HiOutlineXMark size={14} /> Clear All
                </button>
                <div style={{
                  fontSize: 12, color: 'rgba(148,163,184,0.7)', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '0.5rem 0.85rem', borderRadius: 10,
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.15)',
                }}>
                  <HiOutlineEye size={14} style={{ color: '#60a5fa' }} />
                  Showing {filteredProducts.length} of {products.length}
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════ TABLE VIEW ════════════════ */}
          {viewMode === 'table' && (
            <div style={{
              background: 'linear-gradient(145deg, rgba(15,23,42,0.7) 0%, rgba(30,41,59,0.4) 100%)',
              borderRadius: 22, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              animation: 'fadeInUp 0.5s ease-out',
              marginBottom: '1.75rem',
            }}>
              {filteredProducts.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                      <tr>
                        {['Code', 'Product', 'Category', 'Supplier', 'Cost', 'Price', 'Stock', 'Warehouse', 'Status', 'Value'].map((h, i) => (
                          <th key={h} style={{
                            textAlign: 'left', padding: '1rem 1.15rem', fontSize: 11,
                            fontWeight: 700, color: 'rgba(148,163,184,0.6)',
                            textTransform: 'uppercase', letterSpacing: '0.6px',
                            borderBottom: '1px solid rgba(59,130,246,0.1)',
                            background: 'rgba(15,23,42,0.5)',
                            position: 'sticky', top: 0, zIndex: 2,
                            animation: `fadeInDown 0.4s ease-out ${i * 0.03}s both`,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, idx) => (
                        <tr key={product.ProductID}
                          style={{
                            transition: 'all 0.3s ease',
                            animation: `slideInRow 0.4s ease-out ${Math.min(idx * 0.04, 0.8)}s both`,
                            background: hoveredRow === idx
                              ? 'linear-gradient(90deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)'
                              : 'transparent',
                          }}
                          onMouseEnter={() => setHoveredRow(idx)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={tdStyle}>
                            <span style={{
                              background: 'rgba(59,130,246,0.12)', color: '#93c5fd',
                              padding: '4px 10px', borderRadius: 8, fontSize: 12,
                              fontWeight: 600, fontFamily: 'monospace',
                              border: '1px solid rgba(59,130,246,0.18)',
                              transition: 'all 0.3s ease',
                              ...(hoveredRow === idx ? { background: 'rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,0.35)' } : {}),
                            }}>
                              {product.ProductCode}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {/* Product avatar */}
                              <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: `linear-gradient(135deg, ${stringToColor(product.ProductName)}22, ${stringToColor(product.ProductName)}44)`,
                                border: `1px solid ${stringToColor(product.ProductName)}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: stringToColor(product.ProductName),
                                fontSize: 14, fontWeight: 700, flexShrink: 0,
                                transition: 'transform 0.3s ease',
                                ...(hoveredRow === idx ? { transform: 'scale(1.1)' } : {}),
                              }}>
                                {product.ProductName.charAt(0)}
                              </div>
                              <div>
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>
                                  {product.ProductName}
                                </div>
                                {product.Description && (
                                  <div style={{ color: 'rgba(148,163,184,0.5)', fontSize: 11, marginTop: 1 }}>
                                    {product.Description.substring(0, 45)}…
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={tdStyle}>
                            <span style={{
                              padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                              background: 'rgba(139,92,246,0.1)', color: '#c4b5fd',
                              border: '1px solid rgba(139,92,246,0.15)',
                            }}>
                              {product.CategoryName}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, color: 'rgba(148,163,184,0.7)', fontSize: 13 }}>
                            {product.SupplierName}
                          </td>
                          <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 13 }}>
                            {formatCurrency(product.CostPrice)}
                          </td>
                          <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 13, color: '#4ade80', fontWeight: 600 }}>
                            {formatCurrency(product.SellingPrice)}
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>
                                    {product.CurrentStock}
                                  </span>
                                  <span style={{ color: 'rgba(148,163,184,0.4)', fontSize: 11 }}>
                                    /{product.ReorderLevel}
                                  </span>
                                </div>
                                {/* Stock progress bar */}
                                <div style={{
                                  height: 4, borderRadius: 4,
                                  background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                                  position: 'relative',
                                }}>
                                  <div style={{
                                    height: '100%', borderRadius: 4,
                                    width: `${Math.min((product.CurrentStock / maxStockVal) * 100, 100)}%`,
                                    background: product.StockStatus === 'Out of Stock'
                                      ? '#ef4444'
                                      : product.StockStatus === 'Low Stock'
                                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                        : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                    transition: 'width 1s ease-out',
                                    animation: hoveredRow === idx ? 'pulseGlow 2s ease-in-out infinite' : 'none',
                                  }} />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={tdStyle}>
                            {product.warehouseStocks && product.warehouseStocks.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {product.warehouseStocks.map((ws, wi) => (
                                  <div key={wi} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                                    <span style={{
                                      background: 'rgba(6,182,212,0.12)', color: '#67e8f9',
                                      padding: '1px 7px', borderRadius: 6, fontSize: 10,
                                      border: '1px solid rgba(6,182,212,0.2)', fontWeight: 500,
                                    }}>{ws.warehouseName}</span>
                                    <span style={{ color: '#fff', fontWeight: 600 }}>{ws.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: 'rgba(148,163,184,0.35)', fontSize: 12, fontStyle: 'italic' }}>—</span>
                            )}
                          </td>
                          <td style={tdStyle}>
                            <StatusBadge status={product.StockStatus} animated={hoveredRow === idx} />
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: '#fff', fontFamily: 'monospace', fontSize: 13 }}>
                            {formatCurrency(product.StockValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState searchTerm={searchTerm} />
              )}
            </div>
          )}

          {/* ════════════════ GRID VIEW ════════════════ */}
          {viewMode === 'grid' && (
            <div style={{
              marginBottom: '1.75rem',
              animation: 'fadeInUp 0.5s ease-out',
            }}>
              {filteredProducts.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                  gap: '1.25rem',
                }}>
                  {filteredProducts.map((product, idx) => (
                    <div key={product.ProductID} style={{
                      background: 'linear-gradient(145deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.5) 100%)',
                      borderRadius: 20, padding: '1.5rem',
                      border: hoveredCard === idx
                        ? '1px solid rgba(59,130,246,0.35)'
                        : '1px solid rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                      position: 'relative', overflow: 'hidden', cursor: 'default',
                      animation: `fadeInScale 0.5s ease-out ${Math.min(idx * 0.06, 1)}s both`,
                      transform: hoveredCard === idx ? 'translateY(-6px)' : 'translateY(0)',
                      boxShadow: hoveredCard === idx
                        ? '0 16px 48px rgba(59,130,246,0.15), 0 4px 12px rgba(0,0,0,0.3)'
                        : '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Shimmer line on hover */}
                      {hoveredCard === idx && (
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                          background: 'linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s linear infinite',
                        }} />
                      )}

                      {/* Corner accent */}
                      <div style={{
                        position: 'absolute', top: -30, right: -30,
                        width: 90, height: 90, borderRadius: '50%',
                        background: `radial-gradient(circle, ${stringToColor(product.ProductName)}15, transparent)`,
                        transition: 'all 0.4s ease',
                        transform: hoveredCard === idx ? 'scale(1.5)' : 'scale(1)',
                      }} />

                      {/* Card header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: `linear-gradient(135deg, ${stringToColor(product.ProductName)}22, ${stringToColor(product.ProductName)}44)`,
                            border: `1px solid ${stringToColor(product.ProductName)}33`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: stringToColor(product.ProductName),
                            fontSize: 18, fontWeight: 800,
                            transition: 'transform 0.3s ease',
                            transform: hoveredCard === idx ? 'rotate(5deg) scale(1.1)' : 'rotate(0)',
                          }}>
                            {product.ProductName.charAt(0)}
                          </div>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{product.ProductName}</div>
                            <span style={{
                              background: 'rgba(59,130,246,0.12)', color: '#93c5fd',
                              padding: '2px 8px', borderRadius: 6, fontSize: 11,
                              fontFamily: 'monospace', fontWeight: 500,
                              border: '1px solid rgba(59,130,246,0.18)',
                            }}>{product.ProductCode}</span>
                          </div>
                        </div>
                        <StatusBadge status={product.StockStatus} animated={hoveredCard === idx} />
                      </div>

                      {/* Category & Supplier */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                          background: 'rgba(139,92,246,0.1)', color: '#c4b5fd',
                          border: '1px solid rgba(139,92,246,0.15)',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <HiOutlineTag size={10} /> {product.CategoryName}
                        </span>
                        <span style={{
                          padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                          background: 'rgba(6,182,212,0.1)', color: '#67e8f9',
                          border: '1px solid rgba(6,182,212,0.15)',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <HiOutlineTruck size={10} /> {product.SupplierName}
                        </span>
                      </div>

                      {/* Price row */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '0.85rem', borderRadius: 12,
                        background: 'rgba(15,23,42,0.5)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        marginBottom: '0.85rem',
                      }}>
                        <div>
                          <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Cost</div>
                          <div style={{ fontSize: 14, color: 'rgba(148,163,184,0.9)', fontFamily: 'monospace', fontWeight: 600 }}>{formatCurrency(product.CostPrice)}</div>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Price</div>
                          <div style={{ fontSize: 14, color: '#4ade80', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(product.SellingPrice)}</div>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Value</div>
                          <div style={{ fontSize: 14, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(product.StockValue)}</div>
                        </div>
                      </div>

                      {/* Stock bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', fontWeight: 600 }}>Stock Level</span>
                          <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{product.CurrentStock}
                            <span style={{ color: 'rgba(148,163,184,0.4)', fontWeight: 400 }}> / {product.ReorderLevel}</span>
                          </span>
                        </div>
                        <div style={{
                          height: 6, borderRadius: 6,
                          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 6,
                            width: `${Math.min((product.CurrentStock / maxStockVal) * 100, 100)}%`,
                            background: product.StockStatus === 'Out of Stock'
                              ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                              : product.StockStatus === 'Low Stock'
                                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                            transition: 'width 1.2s ease-out',
                            boxShadow: hoveredCard === idx ? '0 0 10px rgba(59,130,246,0.4)' : 'none',
                          }} />
                        </div>
                      </div>

                      {/* Warehouses */}
                      {product.warehouseStocks && product.warehouseStocks.length > 0 && (
                        <div style={{
                          marginTop: '0.85rem', display: 'flex', gap: 6, flexWrap: 'wrap',
                        }}>
                          {product.warehouseStocks.map((ws, wi) => (
                            <span key={wi} style={{
                              background: 'rgba(6,182,212,0.08)', color: '#67e8f9',
                              padding: '3px 8px', borderRadius: 6, fontSize: 10,
                              border: '1px solid rgba(6,182,212,0.15)', fontWeight: 500,
                            }}>
                              {ws.warehouseName}: <strong>{ws.quantity}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(145deg, rgba(15,23,42,0.7) 0%, rgba(30,41,59,0.4) 100%)',
                  borderRadius: 22, border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <EmptyState searchTerm={searchTerm} />
                </div>
              )}
            </div>
          )}

          {/* ════════════════ DISTRIBUTION CHART ════════════════ */}
          {products.length > 0 && (
            <div style={{
              background: 'linear-gradient(145deg, rgba(15,23,42,0.7) 0%, rgba(30,41,59,0.4) 100%)',
              borderRadius: 22, padding: '1.75rem',
              border: '1px solid rgba(59,130,246,0.1)',
              backdropFilter: 'blur(20px)',
              animation: 'fadeInUp 0.6s ease-out 0.4s both',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', bottom: -50, right: -50,
                width: 200, height: 200, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <h3 style={{
                color: '#fff', fontSize: '1.1rem', fontWeight: 700,
                marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10,
                position: 'relative', zIndex: 1,
              }}>
                <HiOutlineChartBarSquare size={22} style={{ color: '#60a5fa' }} />
                Stock Distribution
              </h3>

              <div style={{
                display: 'flex', gap: '2rem', alignItems: 'center',
                position: 'relative', zIndex: 1,
              }}>
                {/* Donut-like ring visualization */}
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#4ade80" strokeWidth="3.5"
                      strokeDasharray={`${(inStockCount / products.length) * 100} ${100 - (inStockCount / products.length) * 100}`}
                      strokeDashoffset="0"
                      style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
                    <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#fbbf24" strokeWidth="3.5"
                      strokeDasharray={`${(lowStockCount / products.length) * 100} ${100 - (lowStockCount / products.length) * 100}`}
                      strokeDashoffset={`${-(inStockCount / products.length) * 100}`}
                      style={{ transition: 'stroke-dasharray 1.5s ease-out 0.2s' }} />
                    <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#f87171" strokeWidth="3.5"
                      strokeDasharray={`${(outOfStockCount / products.length) * 100} ${100 - (outOfStockCount / products.length) * 100}`}
                      strokeDashoffset={`${-((inStockCount + lowStockCount) / products.length) * 100}`}
                      style={{ transition: 'stroke-dasharray 1.5s ease-out 0.4s' }} />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{products.length}</span>
                    <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.6)', fontWeight: 500 }}>TOTAL</span>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  {[
                    { label: 'In Stock', count: inStockCount, color: '#4ade80', pct: ((inStockCount / products.length) * 100).toFixed(1) },
                    { label: 'Low Stock', count: lowStockCount, color: '#fbbf24', pct: ((lowStockCount / products.length) * 100).toFixed(1) },
                    { label: 'Out of Stock', count: outOfStockCount, color: '#f87171', pct: ((outOfStockCount / products.length) * 100).toFixed(1) },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '0.5rem 0.75rem', borderRadius: 10,
                      transition: 'all 0.3s ease', cursor: 'default',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0, animation: 'breathe 2.5s ease-in-out infinite', animationDelay: `${i * 0.3}s` }} />
                      <span style={{ fontSize: 13, color: 'rgba(148,163,184,0.8)', flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: 14, color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{item.count}</span>
                      <span style={{
                        fontSize: 11, color: item.color, fontWeight: 600,
                        padding: '2px 8px', borderRadius: 6,
                        background: `${item.color}15`,
                      }}>{item.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Value column */}
                <div style={{
                  padding: '1.25rem', borderRadius: 16,
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid rgba(59,130,246,0.1)',
                  textAlign: 'center', minWidth: 160,
                }}>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                    Total Value
                  </div>
                  <div style={{
                    fontSize: '1.5rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'countUp 0.6s ease-out',
                  }}>
                    {formatCurrency(totalValue)}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.4)', marginTop: 4 }}>
                    across all warehouses
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ════════════════ SCROLL TO TOP ════════════════ */}
        <button onClick={scrollToTop} style={{
          position: 'fixed', bottom: 32, right: 32,
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          border: 'none', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          opacity: showScrollTop ? 1 : 0,
          transform: showScrollTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          pointerEvents: showScrollTop ? 'auto' : 'none',
          zIndex: 50,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = showScrollTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)'; }}
        >
          <HiOutlineArrowUp size={20} />
        </button>
      </div>
    </>
  );
}

/* ─────────────── SUB-COMPONENTS ─────────────── */

function FilterGroup({ label, delay, children }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: '1rem', borderRadius: 14,
      background: 'rgba(20,28,50,0.5)',
      border: '1px solid rgba(59,130,246,0.08)',
      transition: 'all 0.3s ease',
      animation: `fadeInUp 0.4s ease-out ${delay} both`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(30,41,59,0.6)';
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(20,28,50,0.5)';
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <label style={{
        fontSize: 11, fontWeight: 700, color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>{label}</label>
      {children}
    </div>
  );
}

function RangeInputs({ v1, v2, s1, s2, step }) {
  const inputStyle = {
    flex: 1, padding: '0.6rem 0.75rem', borderRadius: 10,
    border: '1.5px solid rgba(59,130,246,0.15)',
    background: 'rgba(15,23,42,0.7)', color: '#e2e8f0',
    fontSize: 12, outline: 'none', transition: 'all 0.3s ease',
    fontFamily: 'inherit', minWidth: 0,
  };
  const focusHandler = (e) => {
    e.target.style.borderColor = 'rgba(59,130,246,0.5)';
    e.target.style.boxShadow = '0 0 12px rgba(59,130,246,0.15)';
  };
  const blurHandler = (e) => {
    e.target.style.borderColor = 'rgba(59,130,246,0.15)';
    e.target.style.boxShadow = 'none';
  };
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%' }}>
      <input type="number" placeholder="Min" value={v1} onChange={e => s1(e.target.value)}
        style={inputStyle} min="0" step={step}
        onFocus={focusHandler} onBlur={blurHandler} />
      <span style={{ color: 'rgba(148,163,184,0.4)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>→</span>
      <input type="number" placeholder="Max" value={v2} onChange={e => s2(e.target.value)}
        style={inputStyle} min="0" step={step}
        onFocus={focusHandler} onBlur={blurHandler} />
    </div>
  );
}

function StatusBadge({ status, animated }) {
  const config = {
    'Out of Stock': { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)', dot: '#ef4444' },
    'Low Stock': { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
  };
  const c = config[status] || { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.25)', dot: '#22c55e' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      transition: 'all 0.3s ease',
      ...(animated ? { boxShadow: `0 0 12px ${c.bg}` } : {}),
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: c.dot,
        animation: animated ? 'breathe 1.5s ease-in-out infinite' : 'none',
      }} />
      {status}
    </span>
  );
}

function EmptyState({ searchTerm }) {
  return (
    <div style={{
      padding: '4rem 2rem', textAlign: 'center',
      animation: 'fadeInUp 0.5s ease-out',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'rgba(59,130,246,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <HiOutlineCube size={36} style={{ color: 'rgba(59,130,246,0.4)' }} />
      </div>
      <h3 style={{ color: 'rgba(148,163,184,0.8)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
        No products found
      </h3>
      <p style={{ color: 'rgba(148,163,184,0.45)', fontSize: 14, maxWidth: 350, margin: '0 auto' }}>
        {searchTerm ? 'Try adjusting your search or filters' : 'Start by adding your first product to the inventory'}
      </p>
      {!searchTerm && (
        <Link href="/products/add" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginTop: '1.5rem', padding: '0.75rem 1.75rem', borderRadius: 14,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: '#fff', fontWeight: 700, fontSize: 14,
          textDecoration: 'none', transition: 'all 0.3s ease',
          boxShadow: '0 6px 24px rgba(59,130,246,0.3)',
        }}>
          <HiOutlineSparkles size={16} /> Add Product
        </Link>
      )}
    </div>
  );
}

/* ─────────────── HELPERS ─────────────── */

const tdStyle = {
  padding: '0.85rem 1.15rem', fontSize: 13, color: '#e2e8f0',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  transition: 'all 0.3s ease',
};

const filterSelectStyle = {
  width: '100%', padding: '0.6rem 2.2rem 0.6rem 0.8rem', borderRadius: 10,
  border: '1.5px solid rgba(59,130,246,0.15)',
  background: 'rgba(15,23,42,0.7)', color: '#e2e8f0',
  fontSize: 13, outline: 'none', cursor: 'pointer',
  fontFamily: 'inherit', transition: 'all 0.3s ease',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%2394a3b8\' d=\'M1 1l5 5 5-5\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.8rem center',
  boxSizing: 'border-box',
};

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];
  return colors[Math.abs(hash) % colors.length];
}