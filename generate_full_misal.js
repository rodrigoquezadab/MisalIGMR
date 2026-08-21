const fs = require('fs');

// 1. Cargar IGMR íntegro (399 párrafos)
const igmrItems = JSON.parse(fs.readFileSync('igmr_full_399.json', 'utf8'));
const igmrMap = {};
igmrItems.forEach(it => {
  if (!igmrMap[it.num]) {
    igmrMap[it.num] = it;
  } else {
    igmrMap[it.num].text += "\n\n" + it.text;
  }
});

// 2. Cargar base de datos litúrgica (Misas, Plegarias, Prefacios)
const liturgiaDB = JSON.parse(fs.readFileSync('liturgia_db.json', 'utf8'));

function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderIGMR(title, numList) {
  let html = `      <div class="igmr-container">\n        <details id="igmr-details-${numList[0]}-${numList[numList.length - 1]}">\n          <summary>IGMR: ${escapeHTML(title)} (nn. ${numList[0]}-${numList[numList.length - 1]})</summary>\n          <div class="igmr-content">\n`;
  
  let lastSub = "";
  let lastSec = "";
  numList.forEach(n => {
    const it = igmrMap[n];
    if (!it) return;
    if (it.section && it.section !== lastSec) {
      html += `            <h4 style="color: var(--primary-color); border-bottom: 1px dashed var(--border-color); padding-bottom: 4px; margin-top: 1.2rem;">${escapeHTML(it.section)}</h4>\n`;
      lastSec = it.section;
    }
    if (it.subsection && it.subsection !== lastSub) {
      html += `            <h4 style="color: var(--secondary-color); margin-top: 1rem;">${escapeHTML(it.subsection)}</h4>\n`;
      lastSub = it.subsection;
    }
    const paragraphs = it.text.split('\n\n').map(p => p.trim()).filter(Boolean);
    paragraphs.forEach((p, idx) => {
      if (idx === 0) {
        html += `            <div class="igmr-num-block" id="igmr-num-${n}">\n              <p><span class="igmr-num">IGMR ${n}:</span> ${escapeHTML(p)}</p>\n            </div>\n`;
      } else {
        html += `            <p>${escapeHTML(p)}</p>\n`;
      }
    });
  });

  html += `          </div>\n        </details>\n      </div>\n`;
  return html;
}

const usedNumbers = new Set();
function useRange(title, list) {
  list.forEach(n => usedNumbers.add(n));
  return renderIGMR(title, list);
}

function linkifyIGMR(str) {
  // 1. Linkify (IGMR ...) or (- IGMR ...:) or IGMR in rubrics
  let res = str.replace(/IGMR\s+([0-9a-z,\s-]+)/gi, (match, nums) => {
    let trailing = '';
    const cleanNums = nums.replace(/[:)]+$/, (m) => {
      trailing = m;
      return '';
    });
    
    const parts = cleanNums.split(',').map(s => s.trim()).filter(Boolean);
    const badges = parts.map(part => {
      const m = part.match(/^(\d+)/);
      if (m) {
        const baseNum = parseInt(m[1], 10);
        return `<button type="button" class="igmr-badge" onclick="showIGMR(${baseNum})" title="Consultar numeral ${part} de la IGMR">IGMR ${part}</button>`;
      }
      return `IGMR ${part}`;
    });
    return badges.join(', ') + trailing;
  });

  // 2. Linkify internal IGMR cross-references like (cfr. núms. 276-277), (cfr. n. 68), (cfr. núm. 52)
  res = res.replace(/\(cfr\.\s+n[úu]ms?\.?\s*([0-9\s,-]+)\)/gi, (match, nums) => {
    const parts = nums.split(/[,–-]/).map(s => s.trim()).filter(Boolean);
    const firstNum = parts[0] ? parseInt(parts[0], 10) : null;
    if (firstNum) {
      return `(cfr. <button type="button" class="igmr-badge" onclick="showIGMR(${firstNum})" title="Consultar numeral ${nums.trim()} de la IGMR">núms. ${nums.trim()}</button>)`;
    }
    return match;
  });

  return res;
}

// CONSTRUCCIÓN DEL HTML PRINCIPAL
const htmlParts = [];

htmlParts.push(`<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5.0">
  <meta name="theme-color" content="#111215">
  <title>Misal Romano - Todas las Misas del Año Litúrgico con IGMR Íntegro (nn. 1-399)</title>
  <style>
    :root {
      /* Modo Oscuro (por defecto) */
      --bg-color: #111215;
      --card-bg: #1a1c23;
      --text-color: #e5e9f0;
      --muted-text: #94a3b8;
      --border-color: #2b303c;
      --primary-color: #e63946;       /* Rojo litúrgico */
      --secondary-color: #f1faee;     /* Texto claro */
      --accent-color: #38bdf8;        /* Azul litúrgico */
      --rubric-color: #f87171;        /* Rúbricas en rojo coral litúrgico */
      --speaker-color: #38bdf8;       /* Sacerdote/Ministro */
      --header-bg: #0c0d10;
      --toolbar-bg: rgba(22, 25, 33, 0.95);
      --igmr-bg: #141720;
      --igmr-border: #333a48;
      --igmr-heading: #60a5fa;
      --igmr-num-color: #38bdf8;
      --footer-text: #64748b;
      --drawer-bg: #16181f;
      --surface-hover: rgba(230, 57, 70, 0.12);
      --font-scale: 1;
    }

    [data-theme="light"] {
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --text-color: #1e293b;
      --muted-text: #64748b;
      --border-color: #e2e8f0;
      --primary-color: #b91c1c;       /* Rojo carmesí clásico */
      --secondary-color: #0f172a;
      --accent-color: #0284c7;
      --rubric-color: #c2410c;        /* Rúbricas bermellón */
      --speaker-color: #0369a1;
      --header-bg: #ffffff;
      --toolbar-bg: rgba(241, 245, 249, 0.96);
      --igmr-bg: #f8fafc;
      --igmr-border: #cbd5e1;
      --igmr-heading: #1d4ed8;
      --igmr-num-color: #0284c7;
      --footer-text: #64748b;
      --drawer-bg: #ffffff;
      --surface-hover: rgba(185, 28, 28, 0.08);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    html {
      scroll-behavior: smooth;
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      line-height: 1.75;
      font-size: 16px;
      transition: background-color 0.25s ease, color 0.25s ease;
      overflow-x: hidden;
    }

    /* ============================================================
       1. ENCABEZADO (MOBILE FIRST)
       ============================================================ */
    .app-header {
      background-color: var(--header-bg);
      border-bottom: 2px solid var(--primary-color);
      padding: 1.4rem 1rem 1rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: relative;
    }

    .header-inner {
      max-width: 800px;
      margin: 0 auto;
    }

    .header-cross {
      font-size: 1.4rem;
      color: var(--primary-color);
      line-height: 1;
      margin-bottom: 0.2rem;
      opacity: 0.9;
    }

    .app-title {
      font-size: 1.6rem;
      color: var(--primary-color);
      letter-spacing: 1.5px;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      font-weight: 800;
      line-height: 1.2;
    }

    .mass-title {
      font-size: 1.1rem;
      color: var(--text-color);
      margin: 0.3rem 0;
      font-weight: 700;
      line-height: 1.35;
    }

    .badge-wrapper {
      margin: 0.4rem 0;
    }

    .liturgical-badge {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .header-subtitle {
      font-size: 0.82rem;
      color: var(--muted-text);
      margin-top: 0.4rem;
      line-height: 1.4;
    }

    /* ============================================================
       2. BARRA DE HERRAMIENTAS STICKY (MOBILE FIRST)
       ============================================================ */
    .toolbar-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: var(--toolbar-bg);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-color);
      padding: 0.45rem 0.6rem;
      box-shadow: 0 4px 14px rgba(0,0,0,0.22);
    }

    .toolbar-container {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .toolbar-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      width: 100%;
    }

    .toolbar-row-primary {
      display: flex;
      align-items: stretch;
      gap: 0.4rem;
    }

    .btn-drawer-toggle {
      background: var(--primary-color);
      color: #ffffff !important;
      border: 1px solid var(--primary-color);
      border-radius: 8px;
      padding: 0.45rem 0.75rem;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      flex-shrink: 0;
      min-height: 40px;
      box-shadow: 0 2px 6px rgba(230, 57, 70, 0.3);
      transition: all 0.2s ease;
    }

    .btn-drawer-toggle:active {
      transform: scale(0.96);
    }

    .select-wrapper {
      position: relative;
      flex: 1;
      min-width: 0;
    }

    .select-season-wrapper {
      flex: 1.15;
    }

    .select-mass-wrapper {
      flex: 1.45;
    }

    .select-prayer-wrapper {
      flex: 1.05;
    }

    .select-wrapper select {
      width: 100%;
      height: 40px;
      background-color: var(--card-bg);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .select-wrapper select:focus {
      border-color: var(--primary-color);
    }

    .toolbar-row-secondary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.4rem;
    }

    .toolbar-tool-group {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .toolbar-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--muted-text);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-right: 2px;
      display: none;
    }

    .btn-tool {
      background-color: var(--card-bg);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 0.35rem 0.55rem;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      min-height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.15s ease;
      touch-action: manipulation;
    }

    .btn-tool:active {
      transform: scale(0.94);
      background-color: var(--surface-hover);
    }

    .btn-tool:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .btn-font-reset {
      font-weight: 800;
      min-width: 32px;
    }

    .btn-theme {
      min-width: 80px;
    }

    .igmr-toggle-buttons {
      display: flex;
      gap: 3px;
    }

    .btn-igmr-toggle {
      font-size: 0.78rem;
      padding: 0.35rem 0.45rem;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* ============================================================
       3. CONTENIDO PRINCIPAL Y SECCIONES (MOBILE FIRST)
       ============================================================ */
    main {
      width: 100%;
      max-width: 920px;
      margin: 0.8rem auto 2.5rem;
      padding: 0 0.5rem;
    }

    .mass-section {
      background: var(--card-bg);
      border-radius: 10px;
      padding: 1.1rem 0.85rem;
      margin-bottom: 1.2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      border: 1px solid var(--border-color);
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    .section-title {
      font-size: 1.25rem;
      line-height: 1.35;
      color: var(--primary-color);
      border-bottom: 2px solid var(--primary-color);
      padding-bottom: 0.4rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 800;
    }

    .part-title {
      font-size: 1.08rem;
      line-height: 1.35;
      color: var(--speaker-color);
      margin: 1.4rem 0 0.6rem;
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-weight: 700;
    }

    .part-title::before {
      content: "§";
      color: var(--primary-color);
      font-weight: 900;
    }

    .rubric {
      color: var(--rubric-color);
      font-style: italic;
      font-size: 0.94em;
      margin: 0.6rem 0;
      display: block;
      line-height: 1.55;
    }

    .dialogue {
      margin: 0.7rem 0;
      padding-left: 0.4rem;
    }

    .speaker {
      font-weight: 700;
      color: var(--speaker-color);
      margin-right: 3px;
    }

    .response {
      font-weight: 700;
      color: var(--text-color);
    }

    .prayer-text {
      font-size: 1.05em;
      margin: 0.85rem 0;
      padding: 0.75rem 0.85rem;
      background-color: rgba(255, 255, 255, 0.03);
      border-left: 3px solid var(--speaker-color);
      border-radius: 0 6px 6px 0;
      line-height: 1.7;
    }

    .scripture-box {
      background: rgba(0,0,0,0.12);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.9rem;
      margin: 1rem 0;
    }

    .scripture-citation {
      font-weight: 700;
      color: var(--speaker-color);
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .psalm-response {
      font-weight: 700;
      color: var(--primary-color);
      margin: 0.5rem 0;
      padding: 0.45rem 0.7rem;
      background: rgba(230, 57, 70, 0.1);
      border-radius: 6px;
      font-size: 0.96em;
      line-height: 1.45;
      border-left: 3px solid var(--primary-color);
    }

    /* ============================================================
       4. PANELES IGMR Y NUMERALES INTERACTIVOS (MOBILE FIRST)
       ============================================================ */
    .igmr-container {
      margin: 1rem 0 1.4rem 0;
    }

    details {
      background-color: var(--igmr-bg);
      border: 1px solid var(--igmr-border);
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }

    details[open] {
      border-color: var(--primary-color);
    }

    summary {
      font-weight: 700;
      color: var(--igmr-heading);
      padding: 0.75rem 0.85rem;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.08);
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background-color 0.15s ease, color 0.15s ease;
      font-size: 0.88rem;
      line-height: 1.35;
      gap: 8px;
    }

    summary:hover {
      background-color: var(--surface-hover);
      color: var(--primary-color);
    }

    summary::after {
      content: "▶";
      font-size: 0.7rem;
      transition: transform 0.2s ease;
      color: var(--muted-text);
      flex-shrink: 0;
    }

    details[open] summary::after {
      transform: rotate(90deg);
      color: var(--primary-color);
    }

    .igmr-content {
      padding: 0.9rem 0.85rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.92rem;
      color: var(--text-color);
      line-height: 1.65;
    }

    .igmr-content p {
      margin-bottom: 0.8rem;
    }

    .igmr-num-block {
      margin-top: 0.8rem;
      padding-top: 0.5rem;
      border-top: 1px dashed var(--border-color);
      transition: all 0.5s ease;
    }

    .igmr-num {
      font-weight: 700;
      color: var(--igmr-num-color);
      font-family: sans-serif;
      margin-right: 4px;
    }

    /* Badges interactivos táctiles para numerales IGMR */
    .igmr-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(56, 189, 248, 0.15);
      color: var(--igmr-num-color);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 5px;
      padding: 2px 7px;
      font-size: 0.85em;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      margin: 1px 2px;
      vertical-align: baseline;
      font-family: inherit;
      min-height: 26px;
      touch-action: manipulation;
    }

    .igmr-badge:active, .igmr-badge:hover {
      background: var(--igmr-num-color);
      color: #0f172a;
      border-color: var(--igmr-num-color);
      transform: scale(1.04);
      box-shadow: 0 2px 8px rgba(56, 189, 248, 0.4);
    }

    /* ============================================================
       5. MODAL DE INSPECCIÓN IGMR (BOTTOM-SHEET EN MÓVIL)
       ============================================================ */
    .igmr-modal-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.78);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 3000;
      justify-content: center;
      align-items: flex-end; /* Bottom sheet en móvil */
      padding: 0;
      box-sizing: border-box;
      animation: fadeIn 0.2s ease-out;
    }

    .igmr-modal-backdrop.active {
      display: flex;
    }

    .igmr-modal-box {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px 16px 0 0; /* Sheet en móvil */
      width: 100%;
      max-width: 100%;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 -8px 30px rgba(0,0,0,0.5);
      overflow: hidden;
      animation: slideUpMobile 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .igmr-modal-header {
      background: var(--header-bg);
      padding: 0.85rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }

    .igmr-modal-title {
      font-size: 1.02rem;
      font-weight: 700;
      color: var(--speaker-color);
      margin: 0;
      line-height: 1.3;
    }

    .igmr-modal-close {
      background: transparent;
      border: none;
      font-size: 1.8rem;
      color: var(--muted-text);
      cursor: pointer;
      line-height: 1;
      padding: 4px 8px;
      min-height: 40px;
      min-width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .igmr-modal-close:hover {
      color: #fff;
    }

    .igmr-modal-subtitle {
      padding: 0.5rem 1rem;
      font-size: 0.78rem;
      color: var(--muted-text);
      border-bottom: 1px dashed var(--border-color);
      background: rgba(0,0,0,0.1);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      line-height: 1.3;
    }

    .igmr-modal-body {
      padding: 1rem;
      overflow-y: auto;
      font-size: 0.98rem;
      line-height: 1.68;
      color: var(--text-color);
      -webkit-overflow-scrolling: touch;
    }

    .igmr-modal-body p {
      margin-bottom: 0.85rem;
    }

    .igmr-modal-footer {
      padding: 0.75rem 1rem;
      background: var(--toolbar-bg);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .igmr-highlight-pulse {
      animation: igmrPulse 3s ease-out;
      border-left: 4px solid var(--primary-color) !important;
      padding-left: 8px;
    }

    /* ============================================================
       6. DRAWER / PANEL LATERAL DEL ÍNDICE (MOBILE FIRST)
       ============================================================ */
    .liturgy-drawer-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 2500;
    }

    .liturgy-drawer-backdrop.active {
      display: block;
    }

    .liturgy-drawer {
      position: fixed;
      top: 0;
      left: -100%;
      width: min(340px, 86vw);
      height: 100vh;
      background: var(--drawer-bg);
      border-right: 1px solid var(--border-color);
      z-index: 2600;
      display: flex;
      flex-direction: column;
      box-shadow: 6px 0 28px rgba(0,0,0,0.55);
      transition: left 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    .liturgy-drawer.open {
      left: 0;
    }

    .drawer-header {
      padding: 0.9rem 1rem;
      background: var(--header-bg);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .drawer-title-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .drawer-icon {
      font-size: 1.1rem;
    }

    .drawer-title {
      color: var(--primary-color);
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
    }

    .drawer-close-btn {
      background: transparent;
      border: none;
      font-size: 1.7rem;
      color: var(--muted-text);
      cursor: pointer;
      line-height: 1;
      padding: 4px 8px;
      min-height: 40px;
      min-width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drawer-search {
      padding: 0.65rem 0.85rem;
      border-bottom: 1px solid var(--border-color);
      background: var(--toolbar-bg);
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      font-size: 0.85rem;
      opacity: 0.6;
      pointer-events: none;
    }

    .drawer-search input {
      width: 100%;
      height: 38px;
      padding: 0.4rem 0.8rem 0.4rem 2.2rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: var(--card-bg);
      color: var(--text-color);
      font-size: 0.88rem;
      outline: none;
    }

    .drawer-search input:focus {
      border-color: var(--primary-color);
    }

    .drawer-content {
      flex: 1;
      overflow-y: auto;
      padding: 0.8rem 0.6rem;
      -webkit-overflow-scrolling: touch;
    }

    .drawer-category-title {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--muted-text);
      margin: 1rem 0 0.4rem 0.4rem;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .drawer-item {
      padding: 0.65rem 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.15s ease;
      margin-bottom: 3px;
      font-size: 0.88rem;
      min-height: 40px;
      touch-action: manipulation;
    }

    .drawer-item:active {
      transform: scale(0.98);
    }

    .drawer-item:hover {
      background: var(--surface-hover);
      color: var(--primary-color);
    }

    .drawer-item.active {
      background: var(--primary-color);
      color: #ffffff !important;
      font-weight: 700;
    }

    /* ============================================================
       7. BOTÓN FLOTANTE (FAB) VOLVER ARRIBA
       ============================================================ */
    .fab-scroll-top {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--primary-color);
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      cursor: pointer;
      font-size: 1.3rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1500;
      opacity: 0;
      visibility: hidden;
      transform: translateY(15px);
      transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .fab-scroll-top.visible {
      opacity: 0.95;
      visibility: visible;
      transform: translateY(0);
    }

    .fab-scroll-top:active {
      transform: scale(0.92);
    }

    footer {
      background-color: var(--header-bg);
      color: var(--footer-text);
      text-align: center;
      padding: 2.2rem 1rem 2rem;
      margin-top: 2.5rem;
      font-size: 0.88rem;
      border-top: 1px solid var(--border-color);
    }

    footer a {
      color: var(--secondary-color);
      text-decoration: underline;
    }

    @keyframes igmrPulse {
      0% { background-color: rgba(230, 57, 70, 0.45); }
      50% { background-color: rgba(56, 189, 248, 0.3); }
      100% { background-color: transparent; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUpMobile {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideUpDesktop {
      from { transform: translateY(20px) scale(0.97); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    /* ============================================================
       8. PROGRESSIVE ENHANCEMENT: TABLETS & DESKTOPS
       ============================================================ */
    @media (min-width: 640px) {
      .app-header {
        padding: 2rem 1.5rem 1.4rem;
      }
      .app-title {
        font-size: 2.2rem;
      }
      .mass-title {
        font-size: 1.3rem;
      }
      .toolbar-label {
        display: inline-block;
      }
      main {
        padding: 0 1rem;
        margin: 1.5rem auto 3rem;
      }
      .mass-section {
        padding: 1.8rem 1.5rem;
        margin-bottom: 2rem;
        border-radius: 12px;
      }
      .section-title {
        font-size: 1.55rem;
      }
      .part-title {
        font-size: 1.22rem;
      }
      .igmr-modal-backdrop {
        align-items: center; /* Centrado en pantallas medianas */
        padding: 1.5rem;
      }
      .igmr-modal-box {
        border-radius: 14px;
        max-width: 720px;
        max-height: 85vh;
        animation: slideUpDesktop 0.25s ease-out;
      }
    }

    @media (min-width: 920px) {
      .toolbar-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
      }
      .toolbar-row-primary {
        width: auto;
        flex: 1.5;
      }
      .toolbar-row-secondary {
        width: auto;
        flex: 1;
        justify-content: flex-end;
        gap: 0.75rem;
      }
      .mass-section {
        padding: 2.2rem 2.2rem;
      }
    }

    /* ============================================================
       9. LOGO INTERACTIVO Y VISTA DE PORTADA / INICIO (HOME)
       ============================================================ */
    .app-logo-clickable {
      cursor: pointer;
      display: inline-block;
      user-select: none;
      transition: all 0.2s ease;
      text-decoration: none;
      color: inherit;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
    }
    .app-logo-clickable:hover {
      background: var(--surface-hover);
      transform: scale(1.02);
    }
    .app-logo-clickable:active {
      transform: scale(0.97);
    }
    .logo-badge-refresh {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 0.2rem;
      padding: 2px 9px;
      background: rgba(230, 57, 70, 0.12);
      color: var(--primary-color);
      border: 1px solid rgba(230, 57, 70, 0.35);
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    /* Control de Vistas (Home vs Misa) */
    .view-panel {
      display: none !important;
      animation: fadeIn 0.25s ease-out;
    }
    .view-panel.active {
      display: block !important;
    }


    /* Portada de Inicio (Home Page) */
    .home-hero-card {
      background: linear-gradient(145deg, var(--card-bg) 0%, rgba(230, 57, 70, 0.09) 100%);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 1.8rem 1.1rem;
      margin-bottom: 1.8rem;
      text-align: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .home-hero-icon {
      font-size: 2.6rem;
      color: var(--primary-color);
      margin-bottom: 0.4rem;
      line-height: 1;
    }
    .home-hero-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 0.6rem;
      line-height: 1.25;
    }
    .home-hero-desc {
      font-size: 0.95rem;
      color: var(--text-color);
      max-width: 720px;
      margin: 0 auto 1.4rem;
      line-height: 1.65;
      opacity: 0.92;
    }
    .home-cta-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      justify-content: center;
    }
    .btn-hero-primary {
      background: var(--primary-color);
      color: #fff !important;
      font-weight: 700;
      padding: 0.65rem 1.3rem;
      border-radius: 8px;
      border: 1px solid var(--primary-color);
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(230, 57, 70, 0.35);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-hero-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(230, 57, 70, 0.5);
    }
    .btn-hero-secondary {
      background: var(--card-bg);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      font-weight: 700;
      padding: 0.65rem 1.1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-hero-secondary:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .home-section-heading {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--speaker-color);
      margin: 1.8rem 0 1rem;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .home-features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.9rem;
      margin-bottom: 2rem;
    }
    @media (min-width: 640px) {
      .home-features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .home-feature-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 1.15rem;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .home-feature-card:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }
    .feature-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 0.5rem;
    }
    .feature-icon {
      font-size: 1.4rem;
      color: var(--primary-color);
    }
    .feature-title {
      font-size: 1.02rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
    }
    .feature-body {
      font-size: 0.88rem;
      color: var(--muted-text);
      line-height: 1.6;
    }

    .home-seasons-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.8rem;
      margin-bottom: 2.5rem;
    }
    @media (min-width: 580px) {
      .home-seasons-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 900px) {
      .home-seasons-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .season-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 1rem 1.1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 110px;
    }
    .season-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    }
    .season-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
    }
    .season-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
    }
    .season-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .season-desc {
      font-size: 0.82rem;
      color: var(--muted-text);
      line-height: 1.4;
      margin-bottom: 0.5rem;
    }
    .season-link-text {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--primary-color);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .season-sublinks {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 0.6rem;
      margin-bottom: 0.4rem;
    }
    .btn-sub-season {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      color: var(--text-color);
      border-radius: 6px;
      padding: 0.28rem 0.55rem;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-sub-season:hover {
      background: var(--surface-hover);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .hidden-liturgy-container {
      display: none !important;
    }
    .visible-liturgy-container {
      display: block !important;
    }
  </style>
</head>
<body>

  <!-- Drawer Lateral del Índice Litúrgico -->
  <div id="drawerBackdrop" class="liturgy-drawer-backdrop" onclick="toggleDrawer(false)"></div>
  <aside id="liturgyDrawer" class="liturgy-drawer" aria-label="Índice Litúrgico">
    <div class="drawer-header">
      <div class="drawer-title-group">
        <span class="drawer-icon">📑</span>
        <h3 class="drawer-title">Índice del Misal Romano</h3>
      </div>
      <button class="drawer-close-btn" onclick="toggleDrawer(false)" aria-label="Cerrar índice">&times;</button>
    </div>
    <div class="drawer-search">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="search" id="drawerSearchInput" placeholder="Buscar misa, domingo, fiesta..." oninput="filterDrawer()" autocomplete="off">
      </div>
    </div>
    <div class="drawer-content" id="drawerList">
      <!-- Generado dinámicamente -->
    </div>
  </aside>

  <!-- Encabezado Principal con Logo Clickeable -->
  <header class="app-header">
    <div class="header-inner">
      <div class="app-logo-clickable" onclick="refreshIndexAndHome()" title="Click para volver al Inicio y refrescar el Catálogo" role="button" tabindex="0">
        <div class="header-cross">✠</div>
        <h1 class="app-title">MISAL ROMANO</h1>
        <span class="logo-badge-refresh">↻ Refrescar Catálogo</span>
      </div>
      <h2 id="headerMassTitle" class="mass-title" style="display: none;"></h2>
      <div id="headerBadgeWrapper" class="badge-wrapper" style="display: none;">
        <span id="headerSeasonBadge" class="liturgical-badge"></span>
      </div>
      <p class="header-subtitle">Instrucción General del Misal Romano (IGMR) Íntegra (nn. 1 al 399)</p>
    </div>
  </header>

  <!-- Barra de Herramientas Flotante / Sticky Mobile-First (Visible únicamente al celebrar una Misa) -->
  <nav id="mainToolbar" class="toolbar-nav" aria-label="Herramientas del Misal" style="display: none;">
    <div class="toolbar-container">
      <!-- Fila Superior en Móvil: Navegación de Misas y Plegarias -->
      <div class="toolbar-row toolbar-row-primary">
        <button type="button" class="btn-drawer-toggle" onclick="toggleDrawer(true)" title="Abrir Catálogo de Misas">
          <span class="btn-icon">📑</span>
          <span class="btn-text">Índice</span>
        </button>
        <div class="select-wrapper select-season-wrapper">
          <label for="quickSeasonSelect" class="sr-only">Filtrar por Tiempo</label>
          <select id="quickSeasonSelect" onchange="onSeasonFilterChange(this.value)" title="Filtrar por Tiempo Litúrgico">
            <option value="all">❖ Todos los Tiempos (74)</option>
            <option value="Tiempo de Adviento">🟣 Adviento (4)</option>
            <option value="Tiempo de Navidad">⚪ Navidad y Epifanía (8)</option>
            <option value="Tiempo de Cuaresma">🟣 Cuaresma (7)</option>
            <option value="Semana Santa & Triduo">🔴 Semana Santa y Triduo (8)</option>
            <option value="Tiempo Pascual">⚪ Pascua (10)</option>
            <option value="Tiempo Ordinario">🟢 T. Ordinario (34)</option>
            <option value="Solemnidades del Señor">⚪ Solemnidades (3)</option>
          </select>
        </div>
        <div class="select-wrapper select-mass-wrapper">
          <label for="quickMassSelect" class="sr-only">Seleccionar Misa</label>
          <select id="quickMassSelect" onchange="selectMass(this.value)" title="Seleccionar Misa"></select>
        </div>
        <div class="select-wrapper select-prayer-wrapper">
          <label for="quickPrayerSelect" class="sr-only">Plegaria Eucarística</label>
          <select id="quickPrayerSelect" onchange="selectPrayer(this.value)" title="Seleccionar Plegaria Eucarística">
            <option value="1">Plegaria I</option>
            <option value="2">Plegaria II</option>
            <option value="3" selected>Plegaria III</option>
            <option value="4">Plegaria IV</option>
          </select>
        </div>
      </div>

      <!-- Fila Inferior en Móvil: Herramientas de Lectura (Letra, Tema, IGMR) -->
      <div class="toolbar-row toolbar-row-secondary">
        <div class="toolbar-tool-group font-controls">
          <span class="toolbar-label">Letra:</span>
          <button type="button" class="btn-tool" onclick="changeFontSize(-1)" title="Reducir tamaño de letra" aria-label="Reducir letra">A-</button>
          <button type="button" class="btn-tool btn-font-reset" onclick="resetFontSize()" title="Tamaño por defecto" aria-label="Restablecer letra">A</button>
          <button type="button" class="btn-tool" onclick="changeFontSize(1)" title="Aumentar tamaño de letra" aria-label="Aumentar letra">A+</button>
        </div>

        <div class="toolbar-tool-group view-controls">
          <button type="button" id="themeToggle" class="btn-tool btn-theme" onclick="toggleTheme()" title="Cambiar tema claro/oscuro">
            <span class="theme-icon">☀️</span> <span class="theme-label">Claro</span>
          </button>
          <div class="igmr-toggle-buttons">
            <button type="button" class="btn-tool btn-igmr-toggle" onclick="toggleAllDetails(true)" title="Expandir todas las instrucciones IGMR">
              <span>+</span> IGMR
            </button>
            <button type="button" class="btn-tool btn-igmr-toggle" onclick="toggleAllDetails(false)" title="Colapsar todas las instrucciones IGMR">
              <span>−</span> IGMR
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Botón flotante para volver arriba (FAB) -->
  <button id="fabScrollTop" class="fab-scroll-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Volver al inicio" aria-label="Volver arriba">↑</button>

  <main id="content">

    <!-- ============================================================
         PORTADA / PÁGINA DE INICIO INFORMATIVA (HOME VIEW)
         ============================================================ -->
    <div id="homeView" class="view-panel active">
      <div class="home-hero-card">
        <div class="home-hero-icon">✠</div>
        <h2 class="home-hero-title">Misal Romano Digital con IGMR Íntegra</h2>
        <p class="home-hero-desc">
          Plataforma litúrgica interactiva con el <strong>Ordinario de la Misa</strong>, las <strong>74 celebraciones de todo el Año Litúrgico</strong> con sus días concretos (Semana Santa, Jueves Santo, Viernes Santo, Sábado Santo, Octava de Pascua, Domingos y Solemnidades), las <strong>4 Plegarias Eucarísticas</strong>, <strong>28 Prefacios</strong> y la totalidad de los <strong>399 numerales de la Instrucción General del Misal Romano (IGMR)</strong> incorporados de forma interactiva.
        </p>
        <div class="home-cta-group">
          <button type="button" class="btn-hero-primary" onclick="toggleDrawer(true)">
            <span>📑</span> Seleccionar Misa del Año Litúrgico (74 Celebraciones)
          </button>
        </div>
      </div>

      <h3 class="home-section-heading"><span>❖</span> Características Principales</h3>
      <div class="home-features-grid">
        <div class="home-feature-card">
          <div class="feature-card-header">
            <span class="feature-icon">📜</span>
            <h4 class="feature-title">IGMR Íntegra (1-399)</h4>
          </div>
          <p class="feature-body">
            Cada rúbrica y oración contiene insignias interactivas (ej. <em>IGMR 43</em>, <em>IGMR 54</em>) que abren al instante la normativa oficial de la Santa Sede sin abandonar la lectura.
          </p>
        </div>

        <div class="home-feature-card">
          <div class="feature-card-header">
            <span class="feature-icon">🕊️</span>
            <h4 class="feature-title">Plegarias según IGMR 365</h4>
          </div>
          <p class="feature-body">
            Selección canónica automática de la Plegaria Eucarística: <strong>Canon Romano</strong> en Solemnidades, <strong>Plegaria III</strong> en Domingos y <strong>Plegaria II</strong> en Ferias.
          </p>
        </div>

        <div class="home-feature-card">
          <div class="feature-card-header">
            <span class="feature-icon">📅</span>
            <h4 class="feature-title">Año Litúrgico Completo</h4>
          </div>
          <p class="feature-body">
            Contiene todas las oraciones (Colecta, Ofrendas, Postcomunión), lecturas bíblicas completas, salmos responsoriales y prefacios propios para cada domingo y fiesta.
          </p>
        </div>

        <div class="home-feature-card">
          <div class="feature-card-header">
            <span class="feature-icon">📱</span>
            <h4 class="feature-title">Mobile-First & Accesible</h4>
          </div>
          <p class="feature-body">
            Diseñado para uso cómodo en el altar, ambón o dispositivos móviles, con escalador de letra, modo oscuro/claro y panel de índice con búsqueda instantánea.
          </p>
        </div>
      </div>

      <h3 class="home-section-heading"><span>❖</span> Explorar por Tiempos Litúrgicos</h3>
      <div class="home-seasons-grid">
        <div class="season-card" style="border-left-color: #a855f7;" onclick="selectSeasonAndMass('Tiempo de Adviento', 'adv-1');">
          <div class="season-card-top">
            <span class="season-name">Tiempo de Adviento</span>
            <span class="season-badge" style="background:#a855f7; color:#fff;">Morado</span>
          </div>
          <p class="season-desc">4 Domingos de espera y preparación a la venida del Señor.</p>
          <span class="season-link-text">Ver Misas de Adviento →</span>
        </div>

        <div class="season-card" style="border-left-color: #3b82f6;" onclick="selectSeasonAndMass('Tiempo de Navidad', 'nav-noche');">
          <div class="season-card-top">
            <span class="season-name">Tiempo de Navidad</span>
            <span class="season-badge" style="background:#3b82f6; color:#fff;">Blanco</span>
          </div>
          <p class="season-desc">Vigilia, Nochebuena, Aurora, Día, Sagrada Familia, Santa María y Epifanía.</p>
          <span class="season-link-text">Ver Misas de Navidad →</span>
        </div>

        <div class="season-card" style="border-left-color: #9333ea;" onclick="selectSeasonAndMass('Tiempo de Cuaresma', 'cua-ceniza');">
          <div class="season-card-top">
            <span class="season-name">Tiempo de Cuaresma</span>
            <span class="season-badge" style="background:#9333ea; color:#fff;">Morado</span>
          </div>
          <p class="season-desc">Miércoles de Ceniza, Domingos I al V y Domingo de Ramos en la Pasión.</p>
          <span class="season-link-text">Ver Misas de Cuaresma →</span>
        </div>

        <div class="season-card" style="border-left-color: #e11d48;" onclick="selectSeasonAndMass('Semana Santa & Triduo', 'pas-viernes-santo');">
          <div class="season-card-top">
            <span class="season-name">Triduo Pascual y Semana Santa</span>
            <span class="season-badge" style="background:#e11d48; color:#fff;">Rojo / Blanco</span>
          </div>
          <p class="season-desc">Ramos, Lunes a Miércoles Santo, Misa Crismal, Cena del Señor, Viernes Santo, Sábado Santo y Vigilia.</p>
          <div class="season-sublinks">
            <button type="button" class="btn-sub-season" onclick="event.stopPropagation(); selectSeasonAndMass('Semana Santa & Triduo', 'cua-jueves-santo');">⚪ Jueves Santo</button>
            <button type="button" class="btn-sub-season" onclick="event.stopPropagation(); selectSeasonAndMass('Semana Santa & Triduo', 'pas-viernes-santo');" style="border-color:#dc2626; color:#f87171; background:rgba(220,38,38,0.15);">🔴 Viernes Santo (Pasión)</button>
            <button type="button" class="btn-sub-season" onclick="event.stopPropagation(); selectSeasonAndMass('Semana Santa & Triduo', 'pas-vigilia');">⚪ Vigilia Pascual</button>
          </div>
          <span class="season-link-text">Ver Semana Santa y Triduo →</span>
        </div>

        <div class="season-card" style="border-left-color: #0284c7;" onclick="selectSeasonAndMass('Tiempo Pascual', 'pas-domingo');">
          <div class="season-card-top">
            <span class="season-name">Tiempo Pascual</span>
            <span class="season-badge" style="background:#0284c7; color:#fff;">Blanco / Oro</span>
          </div>
          <p class="season-desc">Domingo de Resurrección, Octava de Pascua, II al VII de Pascua, Ascensión y Pentecostés.</p>
          <span class="season-link-text">Ver Tiempo Pascual →</span>
        </div>

        <div class="season-card" style="border-left-color: #16a34a;" onclick="selectSeasonAndMass('Tiempo Ordinario', 'to-1');">
          <div class="season-card-top">
            <span class="season-name">Tiempo Ordinario</span>
            <span class="season-badge" style="background:#16a34a; color:#fff;">Verde</span>
          </div>
          <p class="season-desc">34 Domingos completos y Solemnidades del Señor (Trinidad, Corpus, Corazón).</p>
          <span class="season-link-text">Ver Tiempo Ordinario →</span>
        </div>
      </div>
    </div>

    <!-- ============================================================
         VISTA DE LA CELEBRACIÓN LITÚRGICA COMPLETA (MASS VIEW)
         ============================================================ -->
    <div id="massView" class="view-panel">
      <div id="standardMassContainer">
`);

// 0. PROEMIO Y CAP. I (1-26)
htmlParts.push(`
    <section class="mass-section" id="proemio-cap1">
      <h2 class="section-title">0. Proemio y Principios Generales de la Celebración Eucarística</h2>
`);
htmlParts.push(useRange("Proemio de la Instrucción General del Misal Romano", range(1, 15)));
htmlParts.push(useRange("Capítulo I: Importancia y Dignidad de la Celebración Eucarística", range(16, 26)));
htmlParts.push(`    </section>\n`);

// 1. RITOS INICIALES (27-54)
htmlParts.push(`
    <section class="mass-section" id="ritos-iniciales">
      <h2 class="section-title">1. Ritos Iniciales</h2>
      <p class="rubric">El pueblo se reúne. Estando el pueblo congregado, el sacerdote con los ministros se acerca al altar, mientras se entona el canto de entrada o se recita la antífona (IGMR 47-48, 120-121). El pueblo permanece de pie durante todos los ritos iniciales (IGMR 43, 120, 124).</p>
`);
htmlParts.push(useRange("Estructura General y Posturas del Cuerpo", range(27, 45)));
htmlParts.push(useRange("Naturaleza de los Ritos Iniciales", range(46, 46)));

htmlParts.push(`
      <h3 class="part-title">1.1. Entrada y Reverencia al Altar</h3>
      <div id="dyn-antifona-entrada" class="prayer-text"></div>
`);
htmlParts.push(useRange("Canto de Entrada y Procesión", range(47, 49)));
htmlParts.push(useRange("Disposición y Ornamento del Altar y la Iglesia", range(288, 318)));

htmlParts.push(`
      <h3 class="part-title">1.2. Saludo Inicial</h3>
      <div class="dialogue">
        <p class="rubric">Llegado al presbiterio, el sacerdote con los ministros hace una inclinación profunda al altar (o genuflexión si el Santísimo está en el presbiterio - IGMR 49, 274). Sube al altar, lo venera con un beso (IGMR 49, 123) e inciensa el altar y la cruz si se usa incienso (IGMR 49, 123, 276-277). Luego va a la sede (IGMR 124).</p>
        <p class="rubric">Estando todos de pie, el sacerdote y los fieles hacen sobre sí la señal de la cruz (IGMR 50, 124):</p>
        <p><span class="speaker">Sacerdote:</span> En el nombre del Padre, y del Hijo, y del Espíritu Santo.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
        
        <p class="rubric">El sacerdote, extendiendo las manos, saluda al pueblo (IGMR 50, 124):</p>
        <p><span class="speaker">Sacerdote:</span> La gracia de nuestro Señor Jesucristo, el amor del Padre y la comunión del Espíritu Santo estén con todos vosotros.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Y con tu espíritu.</span></p>
      </div>
`);
htmlParts.push(useRange("Saludo al Pueblo", range(50, 50)));

htmlParts.push(`
      <h3 class="part-title">1.3. Acto Penitencial</h3>
      <div class="dialogue">
        <p class="rubric">El sacerdote invita a los fieles al arrepentimiento, haciéndose una breve pausa de silencio (IGMR 51, 125):</p>
        <p><span class="speaker">Sacerdote:</span> Hermanos: para celebrar dignamente estos sagrados misterios, reconozcamos nuestros pecados.</p>
        
        <p class="rubric"><strong>Fórmula 1 (Confiteor / Yo confieso - IGMR 51):</strong></p>
        <p><span class="speaker">Todos:</span> Yo confieso ante Dios todopoderoso y ante vosotros, hermanos, que he pecado mucho de pensamiento, palabra, obra y omisión.</p>
        <p class="rubric">(Golpeándose el pecho, dicen - IGMR 51:)</p>
        <p><span class="speaker">Todos:</span> Por mi culpa, por mi culpa, por mi gran culpa. Por eso ruego a santa María, siempre Virgen, a los ángeles, a los santos y a vosotros, hermanos, que intercedáis por mí ante Dios, nuestro Señor.</p>
        
        <p class="rubric">Absolución sacerdotal (IGMR 51):</p>
        <p><span class="speaker">Sacerdote:</span> Dios todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
      </div>
`);
htmlParts.push(useRange("Acto Penitencial", range(51, 51)));

htmlParts.push(`
      <h3 class="part-title">1.4. Señor, ten piedad (Kyrie, eleison)</h3>
      <div class="dialogue">
        <p><span class="speaker">V.</span> Señor, ten piedad. <span class="speaker">R.</span> <span class="response">Señor, ten piedad.</span></p>
        <p><span class="speaker">V.</span> Cristo, ten piedad. <span class="speaker">R.</span> <span class="response">Cristo, ten piedad.</span></p>
        <p><span class="speaker">V.</span> Señor, ten piedad. <span class="speaker">R.</span> <span class="response">Señor, ten piedad.</span></p>
      </div>
`);
htmlParts.push(useRange("Señor, ten piedad (Kyrie)", range(52, 52)));

htmlParts.push(`
      <h3 class="part-title">1.5. Gloria a Dios en el cielo</h3>
      <div class="dialogue">
        <p class="rubric">El sacerdote, o los cantores, o todos juntos, entonan el himno (IGMR 53):</p>
        <p><span class="speaker">Todos:</span> Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor. Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias, Señor Dios, Rey celestial, Dios Padre todopoderoso. Señor, Hijo único, Jesucristo. Señor Dios, Cordero de Dios, Hijo del Padre; tú que quitas el pecado del mundo, ten piedad de nosotros; tú que quitas el pecado del mundo, atiende nuestra súplica; tú que estás sentado a la derecha del Padre, ten piedad de nosotros; porque sólo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo, con el Espíritu Santo en la gloria de Dios Padre. Amén.</p>
      </div>
`);
htmlParts.push(useRange("Himno del Gloria", range(53, 53)));

htmlParts.push(`
      <h3 class="part-title">1.6. Oración Colecta</h3>
      <div class="dialogue">
        <p class="rubric">El sacerdote, con las manos juntas, dice: «Oremos». Y todos, junto con el sacerdote, oran en silencio durante unos momentos (IGMR 54, 127). Luego el sacerdote, con las manos extendidas, proclama la oración colecta:</p>
        <div id="dyn-colecta" class="prayer-text"></div>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
      </div>
`);
htmlParts.push(useRange("Oración Colecta", range(54, 54)));
htmlParts.push(`    </section>\n`);

// 2. LITURGIA DE LA PALABRA (55-71, 91-111, 134-138)
htmlParts.push(`
    <section class="mass-section" id="liturgia-palabra">
      <h2 class="section-title">2. Liturgia de la Palabra</h2>
      <p class="rubric">El pueblo se sienta para escuchar las lecturas (IGMR 43, 128). Las lecturas se proclaman siempre desde el ambón (IGMR 58, 309).</p>
`);
htmlParts.push(useRange("Naturaleza de la Liturgia de la Palabra y Silencio", range(55, 56)));
htmlParts.push(useRange("Ministerios y Funciones Litúrgicas en la Misa", range(91, 111)));

htmlParts.push(`
      <h3 class="part-title">2.1. Primera Lectura</h3>
      <div id="dyn-lectura-1" class="scripture-box"></div>
`);
htmlParts.push(useRange("Primera Lectura Bíblica", range(57, 57)));

htmlParts.push(`
      <h3 class="part-title">2.2. Salmo Responsorial</h3>
      <div id="dyn-salmo" class="scripture-box"></div>
`);
htmlParts.push(useRange("Salmo Responsorial", range(61, 61)));

htmlParts.push(`
      <h3 class="part-title">2.3. Segunda Lectura</h3>
      <div id="dyn-lectura-2" class="scripture-box"></div>
`);
htmlParts.push(useRange("Segunda Lectura Apostólica", range(58, 59)));

htmlParts.push(`
      <h3 class="part-title">2.4. Aclamación antes del Evangelio (Aleluya)</h3>
      <p class="rubric">El pueblo se pone de pie para aclamar el Evangelio (IGMR 43, 131).</p>
      <div id="dyn-aleluya" class="dialogue"></div>
`);
htmlParts.push(useRange("Aclamación antes del Evangelio", range(62, 64)));

htmlParts.push(`
      <h3 class="part-title">2.5. Proclamación del Santo Evangelio</h3>
      <div id="dyn-evangelio" class="scripture-box"></div>
`);
htmlParts.push(useRange("Proclamación del Santo Evangelio", range(60, 60)));
htmlParts.push(useRange("Ritos Propios del Evangelio por el Diácono o Sacerdote", range(134, 135)));

htmlParts.push(`
      <h3 class="part-title">2.6. Homilía</h3>
      <p class="rubric">El pueblo se sienta (IGMR 43, 136). El sacerdote o diácono pronuncia la homilía desde la sede o el ambón (IGMR 66, 136). Concluida la homilía, se guarda un breve tiempo de sagrado silencio (IGMR 56, 66).</p>
`);
htmlParts.push(useRange("La Homilía", range(65, 66)));
htmlParts.push(useRange("Normas para la Homilía y el Silencio Sagrado", range(136, 136)));

htmlParts.push(`
      <h3 class="part-title">2.7. Profesión de Fe (Credo)</h3>
      <div class="dialogue">
        <p class="rubric">El pueblo se pone de pie (IGMR 43, 137). El sacerdote con el pueblo recita el Símbolo de la Fe:</p>
        <p class="rubric"><strong>Opción A: Símbolo Niceno-Constantinopolitano (Credo largo)</strong></p>
        <p><span class="speaker">Todos:</span> Creo en un solo Dios, Padre todopoderoso, Creador del cielo y de la tierra, de todo lo visible y lo invisible. Creo en un solo Señor, Jesucristo, Hijo único de Dios, nacido del Padre antes de todos los siglos: Dios de Dios, Luz de Luz, Dios verdadero de Dios verdadero, engendrado, no creado, de la misma naturaleza del Padre, por quien todo fue hecho; que por nosotros, los hombres, y por nuestra salvación bajó del cielo,</p>
        <p class="rubric">(A las palabras que siguen, hasta «se hizo hombre», todos se inclinan profundamente - IGMR 137, 275a:)</p>
        <p><span class="speaker">Todos:</span> y por obra del Espíritu Santo se encarnó de María, la Virgen, y se hizo hombre;</p>
        <p class="rubric">(Se incorporan - IGMR 137:)</p>
        <p><span class="speaker">Todos:</span> y por nuestra causa fue crucificado en tiempos de Poncio Pilato; padeció y fue sepultado, y resucitó al tercer día, según las Escrituras, y subió al cielo, y está sentado a la derecha del Padre; y de nuevo vendrá con gloria para juzgar a, vivos y muertos, y su reino no tendrá fin. Creo en el Espíritu Santo, Señor y dador de vida, que procede del Padre y del Hijo, que con el Padre y el Hijo recibe una misma adoración y gloria, y que habló por los profetas. Creo en la Iglesia, que es una, santa, católica y apostólica. Confieso que hay un solo Bautismo para el perdón de los pecados. Espero la resurrección de los muertos y la vida del mundo futuro. Amén.</p>
        
        <p class="rubric"><strong>Opción B: Símbolo de los Apóstoles (Credo corto / Bautismal de la Iglesia Romana - IGMR 68)</strong></p>
        <p><span class="speaker">Todos:</span> Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor,</p>
        <p class="rubric">(A las palabras que siguen, hasta «Santa María Virgen», todos se inclinan profundamente - IGMR 137, 275a:)</p>
        <p><span class="speaker">Todos:</span> que fue concebido por obra y gracia del Espíritu Santo, nació de santa María Virgen,</p>
        <p class="rubric">(Se incorporan - IGMR 137:)</p>
        <p><span class="speaker">Todos:</span> padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.</p>
      </div>
`);
htmlParts.push(useRange("El Símbolo o Profesión de Fe", range(67, 68)));
htmlParts.push(useRange("Rúbricas y Reverencias Corporales en el Credo", range(137, 137)));

htmlParts.push(`
      <h3 class="part-title">2.8. Oración Universal (Oración de los Fieles)</h3>
      <div class="dialogue">
        <p class="rubric">Estando el pueblo en pie, el sacerdote dirige la oración desde la sede (IGMR 71, 138):</p>
        <p><span class="speaker">Sacerdote:</span> Oremos, hermanos, a Dios Padre todopoderoso, por las necesidades de la Santa Iglesia y de todo el mundo.</p>
        <p><span class="speaker">Lector:</span> Por la Santa Iglesia de Dios: para que el Señor la guíe, la proteja y congregue en la unidad a todos los pueblos. Roguemos al Señor.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Te rogamos, óyenos.</span></p>
        <p><span class="speaker">Lector:</span> Por los gobernantes y por la paz de todas las naciones. Roguemos al Señor.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Te rogamos, óyenos.</span></p>
        <p><span class="speaker">Lector:</span> Por los enfermos, los afligidos y los que sufren. Roguemos al Señor.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Te rogamos, óyenos.</span></p>
        <p><span class="speaker">Lector:</span> Por nuestra comunidad parroquial y por nuestros difuntos. Roguemos al Señor.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Te rogamos, óyenos.</span></p>
        <p><span class="speaker">Sacerdote:</span> Escucha, Padre, las oraciones de tu pueblo y concédenos lo que te pedimos con fe. Por Jesucristo, nuestro Señor.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
      </div>
`);
htmlParts.push(useRange("Oración Universal", range(69, 71)));
htmlParts.push(useRange("Disposición y Moderación de la Oración de los Fieles", range(138, 138)));
htmlParts.push(`    </section>\n`);

// 3. LITURGIA EUCARÍSTICA (72-89, 112-133, 139-165, 209-236, 281-287, 319-351)
htmlParts.push(`
    <section class="mass-section" id="liturgia-eucaristica">
      <h2 class="section-title">3. Liturgia Eucarística</h2>
      <p class="rubric">El pueblo se sienta durante la preparación de las ofrendas (IGMR 43). Se colocan sobre el altar el corporal, el purificador, el cáliz, la palia y el misal (IGMR 73, 139).</p>
`);
htmlParts.push(useRange("Estructura de la Liturgia Eucarística", range(72, 72)));
htmlParts.push(useRange("Estructura de la Misa y sus Formas de Celebración", range(112, 133)));
htmlParts.push(useRange("Pan, Vino y Vasos Sagrados para la Eucaristía", range(319, 351)));

htmlParts.push(`
      <h3 class="part-title">3.1. Preparación de los Dones (Ofertorio)</h3>
      <div class="dialogue">
        <p class="rubric">El sacerdote toma la patena con el pan y dice en voz baja (o en voz alta si no hay canto - IGMR 141):</p>
        <p><span class="speaker">Sacerdote:</span> Bendito seas, Señor, Dios del universo, por este pan, fruto de la tierra y del trabajo del hombre, que recibimos de tu generosidad y ahora te presentamos; él será para nosotros pan de vida.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Bendito seas por siempre, Señor.</span></p>

        <p class="rubric">El diácono o sacerdote echa vino y un poco de agua en el cáliz diciendo en secreto (IGMR 142, 178):</p>
        <p><span class="speaker">Sacerdote:</span> El agua unida al vino sea signo de nuestra participación en la divinidad de quien se dignó compartir nuestra condición humana.</p>

        <p class="rubric">Toma el cáliz y dice en voz baja (o alta si no hay canto - IGMR 142):</p>
        <p><span class="speaker">Sacerdote:</span> Bendito seas, Señor, Dios del universo, por este vino, fruto de la vid y del trabajo del hombre, que recibimos de tu generosidad y ahora te presentamos; él será para nosotros bebida de salvación.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Bendito seas por siempre, Señor.</span></p>

        <p class="rubric">El sacerdote, profundamente inclinado, dice en secreto (IGMR 143, 275a):</p>
        <p><span class="speaker">Sacerdote:</span> Acepta, Señor, nuestro corazón contrito y nuestro espíritu humilde; que éste sea hoy nuestro sacrificio y que sea grato en tu presencia, Señor, Dios nuestro.</p>

        <p class="rubric">El sacerdote se lava las manos a un lado del altar diciendo en secreto (Lavatorio de manos - IGMR 76, 145):</p>
        <p><span class="speaker">Sacerdote:</span> Lava del todo mi delito, Señor, y limpia mi pecado.</p>

        <p class="rubric">El sacerdote, de pie en el centro del altar, de cara al pueblo, extiende y junta las manos, invitando a la asamblea (el pueblo se pone de pie - IGMR 43, 146):</p>
        <p><span class="speaker">Sacerdote:</span> Orad, hermanos, para que este sacrificio, mío y vuestro, sea agradable a Dios, Padre todopoderoso.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">El Señor reciba de tus manos este sacrificio, para alabanza y gloria de su nombre, para nuestro bien y el de toda su santa Iglesia.</span></p>
      </div>
`);
htmlParts.push(useRange("Preparación de las Ofrendas y Ritos del Ofertorio", range(73, 76)));
htmlParts.push(useRange("Ritos del Sacerdote en la Mesa del Altar", range(139, 145)));

htmlParts.push(`
      <h3 class="part-title">3.2. Oración sobre las Ofrendas</h3>
      <div class="dialogue">
        <p class="rubric">El sacerdote, con las manos extendidas, proclama la oración sobre las ofrendas (IGMR 77, 146):</p>
        <div id="dyn-ofrendas" class="prayer-text"></div>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
      </div>
`);
htmlParts.push(useRange("Oración sobre las Ofrendas", range(77, 77)));
htmlParts.push(useRange("Conclusión de la Preparación de las Ofrendas", range(146, 146)));

htmlParts.push(`
      <h3 class="part-title">3.3. Plegaria Eucarística</h3>
      <div class="dialogue">
        <p class="rubric">El sacerdote inicia el diálogo del Prefacio con las manos extendidas (IGMR 79a, 148):</p>
        <p><span class="speaker">Sacerdote:</span> El Señor esté con vosotros.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Y con tu espíritu.</span></p>
        <p><span class="speaker">Sacerdote:</span> Levantemos el corazón.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Lo tenemos levantado hacia el Señor.</span></p>
        <p><span class="speaker">Sacerdote:</span> Demos gracias al Señor, nuestro Dios.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Es justo y necesario.</span></p>

        <div id="dyn-prefacio" class="prayer-text"></div>

        <p class="rubric">El sacerdote con el pueblo aclama el Santo (IGMR 79b, 149):</p>
        <p><span class="speaker">Todos:</span> Santo, Santo, Santo es el Señor, Dios del Universo. Llenos están el cielo y la tierra de tu gloria. ¡Hosanna en el cielo! Bendito el que viene en nombre del Señor. ¡Hosanna en el cielo!</p>
      </div>

      <div class="dialogue">
        <p class="rubric">El pueblo se arrodilla durante la consagración (desde la epíclesis hasta la aclamación después de la consagración, a no ser que lo impida la estrechez del lugar o la salud; o bien, según la costumbre laudable permitida por la IGMR 43, pueden permanecer de rodillas desde el Sanctus hasta la doxología final - IGMR 43, 150).</p>
      </div>

      <!-- Cuerpo dinámico de la Plegaria Eucarística seleccionada -->
      <div id="dyn-plegaria-body"></div>
`);
htmlParts.push(useRange("Elementos y Estructura de la Plegaria Eucarística", range(78, 79)));
htmlParts.push(useRange("Normas y Ritos de la Plegaria Eucarística", range(147, 151)));
htmlParts.push(useRange("Concelebración de la Eucaristía y sus Ritos", range(209, 236)));

htmlParts.push(`
      <h3 class="part-title">3.4. Rito de la Comunión</h3>
      <div class="dialogue">
        <p class="rubric">El pueblo permanece de pie (IGMR 43). El sacerdote, con las manos juntas, introduce la oración dominical (IGMR 81, 152):</p>
        <p><span class="speaker">Sacerdote:</span> Fieles a la recomendación del Salvador y siguiendo su divina enseñanza, nos atrevemos a decir:</p>
        <p><span class="speaker">Todos:</span> Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal.</p>
        
        <p class="rubric">El sacerdote, con las manos extendidas, continúa solo (Embolismo - IGMR 81, 153):</p>
        <p><span class="speaker">Sacerdote:</span> Líbranos de todos los males, Señor, y concédenos la paz en nuestros días, para que, ayudados por tu misericordia, vivamos siempre libres de pecado y protegidos de toda perturbación, mientras esperamos la gloriosa venida de nuestro Salvador Jesucristo.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Tuyo es el reino, tuyo el poder y la gloria, por siempre, Señor.</span></p>

        <p class="rubric">Rito de la Paz (IGMR 82, 154):</p>
        <p><span class="speaker">Sacerdote:</span> Señor Jesucristo, que dijiste a tus apóstoles: «La paz os dejo, mi paz os doy», no tengas en cuenta nuestros pecados, sino la fe de tu Iglesia y, conforme a tu palabra, concédele la paz y la unidad. Tú que vives y reinas por los siglos de los siglos.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
        <p><span class="speaker">Sacerdote:</span> La paz del Señor esté siempre con vosotros.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Y con tu espíritu.</span></p>
        <p class="rubric">El diácono o el sacerdote añade (IGMR 154):</p>
        <p><span class="speaker">Diácono o Sacerdote:</span> Daos fraternalmente la paz.</p>

        <p class="rubric">Fracción del Pan y Cordero de Dios (IGMR 83, 155):</p>
        <p><span class="speaker">Todos:</span> Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.<br>Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.<br>Cordero de Dios, que quitas el pecado del mundo, danos la paz.</p>

        <p class="rubric">El sacerdote parte la Hostia sobre la patena y deja caer una partícula en el cáliz (Conmixtión - IGMR 83, 155), diciendo en secreto:</p>
        <p><span class="speaker">Sacerdote:</span> El Cuerpo y la Sangre de nuestro Señor Jesucristo, unidos en este cáliz, sean para nosotros, que los vamos a recibir, alimento de vida eterna.</p>

        <p class="rubric">El sacerdote se prepara en secreto para recibir el Sacramento con las manos juntas (IGMR 84, 156):</p>
        <p><span class="speaker">Sacerdote:</span> Señor Jesucristo, Hijo de Dios vivo, que por voluntad del Padre, cooperando el Espíritu Santo, diste con tu muerte la vida al mundo, líbrame, por la recepción de tu Cuerpo y de tu Sangre, de todas mis culpas y de todo mal; concédeme cumplir siempre tus mandamientos y jamás permitas que me separe de ti.</p>

        <p class="rubric">El sacerdote hace genuflexión, toma la Hostia y sosteniéndola sobre la patena o sobre el cáliz, de cara al pueblo, dice con voz clara (IGMR 84, 157):</p>
        <p><span class="speaker">Sacerdote:</span> Éste es el Cordero de Dios, que quita el pecado del mundo. Dichosos los invitados a la cena del Señor.</p>
        <p><span class="speaker">Todos:</span> <span class="response">Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme.</span></p>

        <p class="rubric">El sacerdote comulga el Cuerpo y la Sangre de Cristo y administra la Comunión a los fieles (IGMR 84-86, 158-161). Los fieles se acercan procesionalmente a comulgar (de pie o de rodillas - IGMR 43, 160). Se recita o entona la antífona de comunión:</p>
        <div id="dyn-antifona-comunion" class="prayer-text"></div>

        <p class="rubric">Purificación de los vasos sagrados en la credencia o en el altar (IGMR 163, 278-280) y sagrado silencio o canto de alabanza (IGMR 88, 164). El pueblo se sienta (IGMR 43).</p>
      </div>
`);
htmlParts.push(useRange("El Rito de la Comunión", range(80, 88)));
htmlParts.push(useRange("Ritos de la Comunión del Celebrante y del Pueblo", range(152, 163)));
htmlParts.push(useRange("Comunión bajo las Dos Especies", range(281, 287)));

htmlParts.push(`
      <h3 class="part-title">3.5. Oración después de la Comunión</h3>
      <div class="dialogue">
        <p class="rubric">El pueblo se pone de pie (IGMR 43, 165). El sacerdote dice: «Oremos». Y todos oran en silencio durante unos momentos. Luego el sacerdote, con las manos extendidas, proclama la oración postcomunión (IGMR 89, 165):</p>
        <div id="dyn-postcomunion" class="prayer-text"></div>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
      </div>
`);
htmlParts.push(useRange("Oración después de la Comunión", range(89, 89)));
htmlParts.push(useRange("Ritos Finales de la Comunión", range(164, 165)));
htmlParts.push(`    </section>\n`);

// 4. RITO DE CONCLUSIÓN (90, 166-208, 237-280)
htmlParts.push(`
    <section class="mass-section" id="rito-conclusion">
      <h2 class="section-title">4. Rito de Conclusión</h2>
      <p class="rubric">El pueblo permanece de pie (IGMR 43, 166). Breves avisos al pueblo si son necesarios (IGMR 90a, 166).</p>
`);
htmlParts.push(useRange("Naturaleza del Rito de Conclusión", range(90, 90)));
htmlParts.push(useRange("Bendición y Despedida del Pueblo", range(166, 170)));
htmlParts.push(useRange("Misa con Diácono y otros Ministros", range(171, 208)));
htmlParts.push(useRange("Ritos de Conclusión en la Concelebración", range(237, 251)));
htmlParts.push(useRange("Misa en la que Participa un solo Ministro", range(252, 272)));
htmlParts.push(useRange("Normas Generales sobre Incienso, Reverencias y Purificaciones", range(273, 280)));

htmlParts.push(`
      <div class="dialogue">
        <p class="rubric">El sacerdote saluda al pueblo con las manos extendidas (IGMR 90b, 167):</p>
        <p><span class="speaker">Sacerdote:</span> El Señor esté con vosotros.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Y con tu espíritu.</span></p>
        
        <p class="rubric">Bendición sacerdotal (IGMR 90b, 167):</p>
        <p><span class="speaker">Sacerdote:</span> La bendición de Dios todopoderoso, Padre, Hijo, + y Espíritu Santo, descienda sobre vosotros y os acompañe siempre.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
      </div>

      <div class="dialogue">
        <p class="rubric">El diácono o el sacerdote despide al pueblo con las manos juntas, de cara al pueblo (IGMR 90c, 168):</p>
        <p><span class="speaker">Diácono o Sacerdote:</span> Podéis ir en paz.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Demos gracias a Dios.</span></p>
        
        <p class="rubric">El sacerdote y el diácono veneran el altar con un beso (IGMR 169), hacen una inclinación profunda con los ministros (IGMR 169, 275a) y se retiran en procesión a la sacristía.</p>
      </div>
    </section>
`);

// 5. APÉNDICES IGMR: NORMAS LITÚRGICAS COMPLEMENTARIAS (352-399)
htmlParts.push(`
    <section class="mass-section" id="apendice-igmr">
      <h2 class="section-title">5. Normas Complementarias de la IGMR</h2>
`);
htmlParts.push(useRange("Capítulo VII: Elección de la Misa y de sus Partes", range(352, 367)));
htmlParts.push(useRange("Capítulo VIII: Misas y Oraciones por Diversas Necesidades y Misas de Difuntos", range(368, 385)));
htmlParts.push(useRange("Capítulo IX: Adaptaciones que Corresponden a los Obispos y Conferencias Episcopales", range(386, 399)));
htmlParts.push(`    </section>
  </div><!-- Fin #standardMassContainer -->
`);

htmlParts.push(`
  <!-- ============================================================
       CELEBRACIÓN PROPIA DE VIERNES SANTO EN LA PASIÓN DEL SEÑOR
       (Sin Liturgia Eucarística, sin consagración, 4 partes canónicas)
       ============================================================ -->
  <div id="goodFridayContainer" class="special-liturgy-container" style="display: none;">
    <div class="liturgy-special-banner" style="background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(15, 23, 42, 0.9)); border-left: 4px solid #dc2626; padding: 1.25rem; border-radius: 8px; margin-bottom: 2rem;">
      <div style="display:flex; align-items:center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <span style="font-size: 1.8rem;">✠</span>
        <h2 style="margin:0; font-size: 1.4rem; color: #f87171;">Viernes Santo en la Pasión del Señor</h2>
      </div>
      <p class="rubric" style="margin: 0; color: var(--text-secondary);">
        <strong>Norma Canónica y Litúrgica:</strong> En este día la Iglesia no celebra el sacrificio de la Misa (no hay consagración, ni ofertorio de pan y vino, ni plegaria eucarística). La celebración consta de cuatro partes: <em>1. Liturgia de la Palabra</em> (con la Proclamación solemne de la Pasión según San Juan y la Gran Oración Universal), <em>2. Adoración de la Santa Cruz</em>, <em>3. Sagrada Comunión</em> (con las formas consagradas en la Misa del Jueves Santo) y <em>4. Rito de Despedida en silencio</em>.
      </p>
    </div>

    <!-- PARTE 1: LITURGIA DE LA PALABRA -->
    <section class="mass-section" id="vs-parte1">
      <h2 class="section-title">Primera Parte: Liturgia de la Palabra</h2>
      <div class="dialogue">
        <p class="rubric"><strong>Entrada en silencio y postración:</strong> El sacerdote y los ministros sagrados, vestidos de color rojo como para la Misa, se acercan al altar en silencio. Al llegar, hacen una reverencia y se postran rostro en tierra (o se arrodillan). Todos los fieles se arrodillan y oran en silencio durante unos momentos (IGMR 43, 274).</p>
        <p class="rubric">Luego el sacerdote, con los ministros, va a la sede, y vuelto hacia el pueblo dice con las manos extendidas, sin decir «Oremos» ni saludo previo:</p>
        <div class="prayer-text">
          <p><strong>Oración Colecta:</strong> Acuérdate, Señor, de tu misericordia y santifica con protección continua a tus siervos, por quienes Cristo, tu Hijo, instituyó por medio de su sangre el misterio pascual. Él, que vive y reina por los siglos de los siglos.</p>
          <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
        </div>
      </div>

      <h3 class="part-title">1.1. Primera Lectura</h3>
      <div class="scripture-box">
        <div class="scripture-citation">Primera Lectura (Isaías 52, 13 — 53, 12 — El Cuarto Cántico del Siervo de Dios)</div>
        <p>Mirad, mi siervo tendrá éxito, subirá y crecerá mucho. Como muchos se espantaron de él, porque desfigurado no parecía hombre, ni tenía aspecto humano, así asombrará a muchos pueblos, ante él los reyes cerrarán la boca, al ver algo inenarrable y contemplar algo inaudito...</p>
        <p>¿Quién creyó nuestro anuncio? ¿A quién se reveló el brazo del Señor? Creció en su presencia como brote, como raíz en tierra árida, sin figura, sin belleza. Lo vimos sin aspecto atrayente, despreciado y evitado de los hombres, varón de dolores y acostumbrado a sufrimientos, ante el cual se ocultaban los rostros, despreciado y desestimado.</p>
        <p>Él soportó nuestros sufrimientos y aguantó nuestros dolores; nosotros lo estimamos leproso, herido de Dios y humillado; pero él fue traspasado por nuestras rebeliones, triturado por nuestros crímenes. Nuestro castigo saludable cayó sobre él, sus cicatrices nos curaron...</p>
        <p>Maltratado, voluntariamente se humillaba y no abría la boca: como cordero llevado al matadero, como oveja ante el esquilador, enmudecía y no abría la boca. Sin defensa, sin justicia, se lo llevaron, ¿quién meditó en su destino? Lo arrancaron de la tierra de los vivos, por los pecados de mi pueblo lo hirieron...</p>
        <p>Mi siervo justificará a muchos, porque cargó con los crímenes de ellos. Por eso le daré una parte entre los grandes y con los poderosos repartirá despojos, porque expuso su vida a la muerte y fue contado entre los pecadores, él que tomó el pecado de muchos e intercedió por los pecadores.</p>
        <p class="rubric" style="margin-top:0.8rem;">Palabra de Dios. <span class="response">Te alabamos, Señor.</span></p>
      </div>

      <h3 class="part-title">1.2. Salmo Responsorial</h3>
      <div class="scripture-box">
        <div class="scripture-citation">Salmo Responsorial (Salmo 30, 2 y 6. 12-13. 15-16. 17 y 25)</div>
        <div class="psalm-response">R. Padre, a tus manos encomiendo mi espíritu.</div>
        <p style="margin-bottom:0.6rem;">A ti, Señor, me acojo, no quede yo nunca defraudado; tú, que eres justo, ponme a salvo. A tus manos encomiendo mi espíritu: tú, el Dios leal, me librarás.</p>
        <p style="margin-bottom:0.6rem;">Soy la burla de todos mis enemigos, la irrisión de mis vecinos, el espanto de mis conocidos; me esquivan los que me ven por la calle. Me han olvidado como a un muerto, me han desechado como a un cacharro inútil.</p>
        <p style="margin-bottom:0.6rem;">Pero yo confío en ti, Señor, te digo: «Tú eres mi Dios». En tus manos están mis azares; líbrame de los enemigos que me persiguen. Haz brillar tu rostro sobre tu siervo, sálvame por tu misericordia.</p>
        <p style="margin-bottom:0.6rem;">Sed fuertes y valientes de corazón, los que esperáis en el Señor.</p>
      </div>

      <h3 class="part-title">1.3. Segunda Lectura</h3>
      <div class="scripture-box">
        <div class="scripture-citation">Segunda Lectura (Hebreos 4, 14-16; 5, 7-9)</div>
        <p>Hermanos: Puesto que tenemos un gran sumo sacerdote que ha atravesado los cielos, Jesús, el Hijo de Dios, mantengamos firme la confesión de la fe. Pues no tenemos un sumo sacerdote incapaz de compadecerse de nuestras debilidades, sino que ha sido probado en todo exactamente como nosotros, menos en el pecado. Por eso, acerquémonos con seguridad al trono de la gracia, para alcanzar misericordia y encontrar gracia que nos auxilie oportunamente.</p>
        <p>Cristo, en los días de su vida mortal, a gritos y con lágrimas, presentó oraciones y súplicas al que podía salvarlo de la muerte, y fue escuchado por su piedad filial. Y, aun siendo Hijo, aprendió sufriendo a obedecer; y, consumado, se convirtió, para todos los que le obedecen, en autor de salvación eterna.</p>
        <p class="rubric" style="margin-top:0.8rem;">Palabra de Dios. <span class="response">Te alabamos, Señor.</span></p>
      </div>

      <h3 class="part-title">1.4. Aclamación antes del Evangelio</h3>
      <div class="dialogue">
        <p><span class="speaker">Todos:</span> <span class="response">Honor y gloria a ti, Señor Jesús.</span></p>
        <p><span class="speaker">V.</span> Cristo se hizo por nosotros obediente hasta la muerte, y una muerte de cruz. Por eso Dios lo levantó sobre todo y le concedió el «Nombre-sobre-todo-nombre». (Flp 2, 8-9)</p>
        <p><span class="speaker">Todos:</span> <span class="response">Honor y gloria a ti, Señor Jesús.</span></p>
      </div>

      <h3 class="part-title">1.5. Proclamación de la Pasión de nuestro Señor Jesucristo según San Juan</h3>
      <div class="scripture-box">
        <div class="scripture-citation">Santo Evangelio (Juan 18, 1 — 19, 42 — Pasión de nuestro Señor Jesucristo)</div>
        <p class="rubric">No se llevan cirios ni incienso, ni se hace el saludo al pueblo ni se signa el libro. La pasión puede ser proclamada por lectores, reservando al sacerdote las palabras de Cristo.</p>
        <p>Pasión de nuestro Señor Jesucristo según san Juan: En aquel tiempo, salió Jesús con sus discípulos al otro lado del torrente Cedrón, donde había un huerto, en el que entraron él y sus discípulos. También Judas, el que lo iba a entregar, conocía el sitio... Jesús, sabiendo todo lo que venía sobre él, se adelantó y les dijo: «¿A quién buscáis?». Le contestaron: «A Jesús, el Nazareno». Les dijo Jesús: «Yo soy»...</p>
        <p>Prendieron a Jesús, lo ataron y lo llevaron primero a Anás, suegro de Caifás... Simón Pedro y otro discípulo seguían a Jesús... Condujeron a Jesús de casa de Caifás al pretorio. Pilato salió afuera y les dijo: «¿Qué acusación traéis contra este hombre?»... Pilato entró de nuevo en el pretorio, llamó a Jesús y le dijo: «¿Eres tú el rey de los judíos?»... Jesús respondió: «Mi reino no es de este mundo... Yo para esto he nacido y para esto he venido al mundo: para dar testimonio de la verdad»...</p>
        <p>Pilato tomó a Jesús y mandó azotarlo. Los soldados trenzaron una corona de espinas, se la pusieron en la cabeza y le echaron por encima un manto color púrpura... Pilato sacó a Jesús afuera... «Aquí tenéis a vuestro rey». Ellos gritaron: «¡Fuera, fuera; crucifícalo!»... Y se lo entregó para que lo crucificaran.</p>
        <p>Jesús, cargando con la cruz, salió al sitio llamado «de la Calavera» (que en hebreo se dice Gólgota), donde lo crucificaron, y con él a otros dos... Junto a la cruz de Jesús estaban su madre, la hermana de su madre, María la de Cleofás, y María la Magdalena. Jesús, al ver a su madre y junto a ella al discípulo que amaba, dice a su madre: «Mujer, ahí tienes a tu hijo». Luego dice al discípulo: «Ahí tienes a tu madre». Y desde aquella hora el discípulo la acogió en su casa.</p>
        <p>Después de esto, sabiendo Jesús que ya todo estaba cumplido, para que se cumpliera la Escritura, dijo: «Tengo sed». Había allí un jarro lleno de vinagre. Sujetaron una esponja empapada en vinagre a una caña de hisopo y se la acercaron a la boca. Jesús, cuando tomó el vinagre, dijo: «Está cumplido». E inclinando la cabeza, entregó el espíritu.</p>
        <p class="rubric" style="text-align:center; font-weight:bold; margin: 1rem 0; color: #dc2626;">(Aquí se arrodillan todos y se hace una pausa de sagrado silencio)</p>
        <p>Como era el día de la Preparación, para que no se quedaran los cuerpos en la cruz el sábado... los soldados fueron y quebraron las piernas al primero y luego al otro que habían crucificado con él; pero al llegar a Jesús, viendo que ya había muerto, no le quebraron las piernas, sino que uno de los soldados, con la lanza, le traspasó el costado, y al punto salió sangre y agua...</p>
        <p>Después de esto, José de Arimatea y Nicodemo tomaron el cuerpo de Jesús y lo envolvieron en lienzos con los aromas, según se acostumbra a enterrar entre los judíos. Había un huerto en el sitio donde lo crucificaron, y en el huerto un sepulcro nuevo en el que nadie había sido enterrado todavía. Y allí, por ser el día de la Preparación de los judíos y porque el sepulcro estaba cerca, pusieron a Jesús.</p>
        <p class="rubric" style="margin-top:0.8rem;">Palabra del Señor. <span class="response">Gloria a ti, Señor Jesús.</span></p>
      </div>

      <h3 class="part-title">1.6. Breve Homilía y Solemne Oración Universal (Las 10 Grandes Plegarias)</h3>
      <div class="dialogue">
        <p class="rubric">El sacerdote pronuncia una breve homilía. Luego tiene lugar la Solemne Oración Universal. Para cada intención, el diácono o el sacerdote invita a orar, todos oran en silencio de rodillas o de pie, y el sacerdote proclama la oración con las manos extendidas:</p>
        
        <!-- 1. Por la Santa Iglesia -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>I. Por la Santa Iglesia:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos, queridos hermanos, por la santa Iglesia de Dios, para que el Señor le dé la paz, la mantenga en la unidad, la proteja en toda la tierra y nos conceda una vida tranquila para gloria de Dios, Padre todopoderoso.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue con las manos extendidas:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, que en Cristo manifestaste tu gloria a todas las naciones, vela con amor por la obra de tu misericordia, para que la Iglesia, extendida por todo el mundo, persevere con fe inquebrantable en la confesión de tu Nombre. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 2. Por el Papa -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>II. Por el Santo Padre:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por nuestro Santo Padre, el Papa, para que Dios nuestro Señor, que lo eligió en el orden episcopal, lo conserve sano y salvo para bien de su santa Iglesia, como guía del pueblo santo de Dios.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, cuya providencia gobierna el universo, escucha nuestras súplicas y protege con tu amor al Pastor que has elegido para nosotros, para que el pueblo cristiano que tú mismo gobiernas prospere en el crecimiento de su fe. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 3. Por todos los órdenes y fieles -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>III. Por todos los órdenes sagrados y por los fieles:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por nuestro Obispo, por todos los obispos, presbíteros y diáconos de la Iglesia, y por todo el pueblo santo de Dios.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, que con tu Espíritu santificas y gobiernas a todo el cuerpo de la Iglesia, escucha nuestras súplicas por todos los ministros y fieles, para que, con la ayuda de tu gracia, todos te sirvan con fidelidad. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 4. Por los catecúmenos -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>IV. Por los catecúmenos:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por los catecúmenos, para que Dios nuestro Señor les abra el corazón y las puertas de su misericordia, y habiendo recibido el perdón de todos sus pecados por el bautismo, sean incorporados a Cristo Jesús, Señor nuestro.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, que haces crecer continuamente a tu Iglesia dándole nuevos hijos, acrecienta la fe y la inteligencia de nuestros catecúmenos, para que, renacidos en la fuente bautismal, sean contados entre tus hijos de adopción. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 5. Por la unidad de los cristianos -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>V. Por la unidad de los cristianos:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por todos los hermanos que creen en Cristo, para que Dios nuestro Señor congregue en su única Iglesia y conserve en la paz a todos los que viven en la verdad.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, que reúnes a los dispersos y mantienes a los congregados, mira con bondad a la grey de tu Hijo, para que a cuantos consagró un solo bautismo los una la integridad de la fe y el vínculo de la caridad. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 6. Por los judíos -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>VI. Por el pueblo judío:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por el pueblo judío, a quien Dios nuestro Señor habló primero por los profetas, para que les conceda crecer en el amor de su Nombre y en la fidelidad a su alianza.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, que confiaste tus promesas a Abraham y a su descendencia, escucha bondadoso las súplicas de tu Iglesia, para que el pueblo que adquiriste como propiedad tuya alcance la plenitud de la redención. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 7. Por los que no creen en Cristo -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>VII. Por los que no creen en Cristo:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por los que no creen en Cristo, para que, iluminados por el Espíritu Santo, puedan entrar también ellos en el camino de la salvación.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, concede a los que no creen en Cristo caminar en tu presencia con rectitud de corazón para encontrar la verdad, y a nosotros concédenos crecer en el amor mutuo y ser testigos más fieles de tu amor en el mundo. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 8. Por los que no creen en Dios -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>VIII. Por los que no creen en Dios:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por los que no reconocen a Dios, para que, buscando de corazón lo que es recto, merezcan llegar al conocimiento de su Creador.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, que creaste a todos los hombres para que deseándote te busquen y encontrándote descansen en ti, concédeles que, en medio de las dificultades del mundo, reconozcan los signos de tu amor y lleguen con gozo a confesarte como único Dios verdadero. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 9. Por los gobernantes -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>IX. Por los gobernantes:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos por todos los gobernantes de las naciones, para que Dios nuestro Señor guíe sus mentes y corazones hacia la paz y la libertad verdadera de todos los pueblos.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, en cuyas manos residen los derechos de los pueblos y las riendas de los gobiernos, mira con bondad a los que rigen los destinos de las naciones, para que se afiance en toda la tierra la prosperidad, la paz duradera y la libertad religiosa. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>

        <!-- 10. Por los que sufren -->
        <div style="border-left: 3px solid #dc2626; padding-left: 1rem; margin-bottom: 1.25rem;">
          <p><strong>X. Por los que sufren y los atribulados:</strong></p>
          <p><span class="speaker">Diácono o Sacerdote:</span> Oremos a Dios Padre todopoderoso por todos los que sufren en el mundo: para que libre a la tierra de errores, cure a los enfermos, libre de hambre a los necesitados, abra las prisiones, rompa las cadenas, conceda un regreso seguro a los peregrinos, salud a los moribundos y una santa muerte a los agonizantes.</p>
          <p class="rubric">(Oración en silencio - El sacerdote prosigue:)</p>
          <p><span class="speaker">Sacerdote:</span> Dios todopoderoso y eterno, consuelo de los afligidos y fortaleza de los que sufren, lleguen a ti los clamores de los que te invocan en cualquier tribulación, para que todos experimenten con gozo el socorro de tu misericordia en sus necesidades. Por Jesucristo, nuestro Señor. <span class="response">Amén.</span></p>
        </div>
      </div>
    </section>

    <!-- PARTE 2: ADORACIÓN DE LA SANTA CRUZ -->
    <section class="mass-section" id="vs-parte2">
      <h2 class="section-title">Segunda Parte: Adoración de la Santa Cruz</h2>
      <div class="dialogue">
        <p class="rubric"><strong>Ostensión de la Cruz:</strong> La Santa Cruz, acompañada de dos ministros con cirios encendidos, es presentada ante la asamblea. El sacerdote (o el diácono) la eleva ante el pueblo cantando tres veces en tonos cada vez más altos:</p>
        
        <div style="background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 8px; padding: 1.2rem; text-align: center; margin: 1.2rem 0;">
          <p style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.6rem; color: #f87171;">
            <span class="speaker">Sacerdote o Diácono:</span> ¡Mirad el árbol de la Cruz, donde estuvo clavada la salvación del mundo!
          </p>
          <p style="font-size: 1.2rem; font-weight: bold; color: var(--text-color);">
            <span class="speaker">Todos:</span> <span class="response">¡Venid a adorarlo!</span>
          </p>
          <p class="rubric" style="margin-top: 0.6rem;">(Tras cada aclamación, todos se arrodillan y adoran la Cruz en silencio durante unos momentos)</p>
        </div>

        <p class="rubric"><strong>Veneración de la Cruz:</strong> El sacerdote, los ministros sagrados y los fieles se acercan procesionalmente a adorar la Cruz, haciéndole una genuflexión o inclinación profunda y besándola con devoción. Mientras tanto se cantan los <em>Improperios</em> («Pueblo mío, ¿qué te he hecho o en qué te he ofendido? Respóndeme»), el himno <em>Crux fidelis</em> y cantos a la Cruz redentora.</p>
      </div>
    </section>

    <!-- PARTE 3: SAGRADA COMUNIÓN -->
    <section class="mass-section" id="vs-parte3">
      <h2 class="section-title">Tercera Parte: Sagrada Comunión</h2>
      <div class="dialogue">
        <p class="rubric"><strong>Preparación del Altar:</strong> Se extiende sobre el altar desnudo un mantel blanco, el corporal y el misal. No hay ofertorio de pan y vino ni incensación de dones (IGMR 43). El diácono o el sacerdote va al Monumento (lugar de la reserva) y trae el Santísimo Sacramento con las formas consagradas en la Misa del Jueves Santo, acompañado de dos cirios encendidos. Lo coloca sobre el altar sobre el corporal.</p>

        <p class="rubric">El sacerdote se acerca al altar, hace genuflexión y con las manos juntas introduce la oración del Señor:</p>
        <p><span class="speaker">Sacerdote:</span> Fieles a la recomendación del Salvador y siguiendo su divina enseñanza, nos atrevemos a decir:</p>
        <p><span class="speaker">Todos:</span> Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal.</p>

        <p class="rubric">El sacerdote continúa solo con las manos extendidas:</p>
        <p><span class="speaker">Sacerdote:</span> Líbranos de todos los males, Señor, y concédenos la paz en nuestros días, para que, ayudados por tu misericordia, vivamos siempre libres de pecado y protegidos de toda perturbación, mientras esperamos la gloriosa venida de nuestro Salvador Jesucristo.</p>
        <p><span class="speaker">Pueblo:</span> <span class="response">Tuyo es el reino, tuyo el poder y la gloria, por siempre, Señor.</span></p>

        <p class="rubric">El sacerdote dice en secreto:</p>
        <p><span class="speaker">Sacerdote:</span> Señor Jesucristo, la comunión de tu Cuerpo no sea para mí causa de juicio y condenación, sino que, por tu piedad, me aproveche para defensa de alma y cuerpo y como medicina saludable.</p>

        <p class="rubric">El sacerdote hace genuflexión, toma una partícula de la Hostia consagrada y mostrándola al pueblo dice con voz clara:</p>
        <p><span class="speaker">Sacerdote:</span> Éste es el Cordero de Dios, que quita el pecado del mundo. Dichosos los invitados a la cena del Señor.</p>
        <p><span class="speaker">Todos:</span> <span class="response">Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme.</span></p>

        <p class="rubric">El sacerdote y los fieles comulgan reverentemente el Cuerpo de Cristo reservado. Concluida la comunión, el copón se lleva a un lugar digno fuera de la nave de la iglesia. Se purifica el altar y se guarda un tiempo de sagrado silencio.</p>

        <p class="rubric">El sacerdote dice en pie: «Oremos». Y con las manos extendidas proclama:</p>
        <div class="prayer-text">
          <p><strong>Oración después de la Comunión:</strong> Dios todopoderoso y eterno, que nos has renovado con la santa muerte y resurrección de tu Hijo, conserva en nosotros la obra de tu misericordia, para que, por la participación de este misterio, vivamos consagrados a tu servicio. Por Jesucristo, nuestro Señor.</p>
          <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
        </div>
      </div>
    </section>

    <!-- PARTE 4: RITO DE CONCLUSIÓN Y DESPEDIDA -->
    <section class="mass-section" id="vs-parte4">
      <h2 class="section-title">Cuarta Parte: Despedida en Silencio</h2>
      <div class="dialogue">
        <p class="rubric">El diácono o el sacerdote dice al pueblo: «Inclinaos para recibir la bendición».</p>
        <p class="rubric">El sacerdote, extendiendo las manos sobre el pueblo, dice la Oración sobre el pueblo:</p>
        <div class="prayer-text">
          <p><strong>Oración sobre el Pueblo:</strong> Que descienda, Señor, tu bendición abundante sobre este pueblo tuyo, que ha celebrado la muerte de tu Hijo con la esperanza de su santa resurrección; llegue a él tu perdón, reciba tu consuelo, se acreciente su santa fe y se asegure su redención eterna. Por Jesucristo, nuestro Señor.</p>
          <p><span class="speaker">Pueblo:</span> <span class="response">Amén.</span></p>
        </div>
        <p class="rubric" style="margin-top: 1rem; color: #dc2626; font-weight: bold;">
          Todos se retiran en profundo silencio. El altar queda totalmente despojado y desnudo.
        </p>
      </div>
    </section>
  </div>

  <!-- ============================================================
       SÁBADO SANTO: LA SEPULTURA DEL SEÑOR
       ============================================================ -->
  <div id="holySaturdayContainer" class="special-liturgy-container" style="display: none;">
    <div class="liturgy-special-banner" style="background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(15, 23, 42, 0.9)); border-left: 4px solid #9333ea; padding: 1.25rem; border-radius: 8px; margin-bottom: 2rem;">
      <div style="display:flex; align-items:center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <span style="font-size: 1.8rem;">🕊️</span>
        <h2 style="margin:0; font-size: 1.4rem; color: #c084fc;">Sábado Santo: La Sepultura del Señor</h2>
      </div>
      <p class="rubric" style="margin: 0; color: var(--text-secondary);">
        <strong>Día Alitúrgico de Silencio y Espera:</strong> Durante el Sábado Santo la Iglesia permanece junto al sepulcro del Señor, meditando su pasión y muerte, absteniéndose absolutamente del sacrificio de la Misa (el altar permanece desnudo), hasta que, llegada la noche con la <strong>Solemne Vigilia Pascual</strong>, estallan los gozos de la Resurrección.
      </p>
    </div>

    <section class="mass-section">
      <h2 class="section-title">Meditación Litúrgica y Lecturas de la Tradición de la Iglesia</h2>
      <div class="scripture-box" style="margin-bottom: 1.5rem;">
        <div class="scripture-citation">De una antigua Homilía sobre el Santo y Gran Sábado (Oficio de Lecturas)</div>
        <p>«¿Qué es lo que pasa? Un gran silencio envuelve hoy la tierra; un gran silencio y una gran soledad. Un gran silencio, porque el Rey duerme. La tierra está temerosa y sobrecogida, porque Dios se ha dormido en la carne y ha ido a despertar a los que dormían desde antiguo...»</p>
        <p>«Va a buscar a Adán, nuestro primer padre, como a la oveja perdida. Quiere visitar a los que yacen en tinieblas y en sombras de muerte... El Señor llega a ellos llevando en sus manos las armas victoriosas de la cruz... Y tomándolo de la mano lo levanta diciendo: <em>'Despierta, tú que duermes, levántate de entre los muertos y Cristo te iluminará. Yo soy tu Dios, que por ti me he hecho tu hijo. Despierta y salgamos de aquí, porque tú en mí y yo en ti formamos una sola e indivisible persona'</em>».</p>
      </div>

      <div class="dialogue">
        <p class="rubric">Oración:</p>
        <div class="prayer-text">
          <p><strong>Oración:</strong> Dios todopoderoso, cuyo Hijo unigénito descendió a los infiernos y salió glorioso del sepulcro, concede a tus fieles, sepultados con él por el bautismo, resucitar con él a la vida eterna en la gloria de la Pascua. Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios por los siglos de los siglos. <span class="response">Amén.</span></p>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
          <button type="button" class="btn-hero-primary" onclick="selectMass('pas-vigilia');" style="font-size: 1rem; padding: 0.8rem 1.6rem;">
            Ir a la Solemne Vigilia Pascual en la Noche Santa →
          </button>
        </div>
      </div>
    </section>
  </div><!-- Fin #holySaturdayContainer -->
`);

htmlParts.push(`
    </div><!-- Fin #massView -->
  </main>

  <!-- Modal Interactivo para Inspeccionar cualquier Numeral de la IGMR -->
  <div id="igmrModal" class="igmr-modal-backdrop" onclick="closeIGMRModal(event)">
    <div class="igmr-modal-box" onclick="event.stopPropagation()">
      <div class="igmr-modal-header">
        <h3 class="igmr-modal-title" id="igmrModalTitle">Instrucción General del Misal Romano</h3>
        <button class="igmr-modal-close" onclick="closeIGMRModal()" aria-label="Cerrar">&times;</button>
      </div>
      <div class="igmr-modal-subtitle" id="igmrModalSubtitle"></div>
      <div class="igmr-modal-body" id="igmrModalBody"></div>
      <div class="igmr-modal-footer">
        <button type="button" onclick="closeIGMRModal()">Cerrar</button>
        <button type="button" id="igmrModalJumpBtn" onclick="jumpToIGMR()" style="background: var(--primary-color); color: #fff; border-color: var(--primary-color);">📍 Ir a su posición en el Misal</button>
      </div>
    </div>
  </div>

  <footer>
    <p><strong>Misal Romano - Catálogo Completo de Misas del Año Litúrgico</strong></p>
    <p>Documento enriquecido con la totalidad de los 399 numerales de la <em>Instrucción General del Misal Romano</em> (IGMR) de la Congregación para el Culto Divino y la Disciplina de los Sacramentos.</p>
    <p style="margin-top: 1rem;">Fuentes oficiales y documentos de referencia:</p>
    <p>
      • <a href="https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_sp.html" target="_blank" rel="noopener">IGMR - Sitio Oficial del Vaticano</a><br>
      • <a href="https://seminariobogota.arquibogota.org.co/sites/default/files/inline-files/misal-romanopdf.pdf" target="_blank" rel="noopener">Misal Romano PDF (Seminario de Bogotá)</a><br>
      • <a href="https://liturgiapapal.org/index.php/recursos-lit%C3%BArgicos/libros-lit%C3%BArgicos/604-misal-romano.html" target="_blank" rel="noopener">Misal Romano (Recursos Litúrgicos - Liturgia Papal)</a>
    </p>
    <p style="font-size: 0.85rem; opacity: 0.7; margin-top: 1.5rem;">Sitio web desarrollado para estudio litúrgico, oración y uso pastoral.</p>
  </footer>
`);

// Linkificar el cuerpo HTML antes de anexar el bloque de script
const linkifiedBody = linkifyIGMR(htmlParts.join(''));

// Construcción del bloque de JavaScript intacto
const scriptBlock = `
  <script>
    const igmrData = ${JSON.stringify(igmrMap)};
    const liturgiaData = ${JSON.stringify(liturgiaDB)};
    
    let currentView = 'home'; // 'home' | 'mass'
    let currentMassId = null;
    let currentSeasonFilter = 'all';
    let currentPrayerId = "3";
    let currentModalNum = null;

    function getSeasonCategoryForMass(m) {
      if (m.categoria === 'Semana Santa' || m.categoria === 'Triduo Pascual') {
        return 'Semana Santa & Triduo';
      }
      return m.categoria;
    }

    function onSeasonFilterChange(season) {
      currentSeasonFilter = season;
      updateMassDropdownOptions();
    }

    function updateMassDropdownOptions(selectedId = null) {
      const quickSelect = document.getElementById('quickMassSelect');
      if (!quickSelect) return;
      quickSelect.innerHTML = '';

      let filtered = liturgiaData.misas;
      if (currentSeasonFilter === 'Semana Santa & Triduo') {
        filtered = liturgiaData.misas.filter(m => m.categoria === 'Semana Santa' || m.categoria === 'Triduo Pascual');
      } else if (currentSeasonFilter !== 'all') {
        filtered = liturgiaData.misas.filter(m => m.categoria === currentSeasonFilter);
      }

      const placeholderOpt = document.createElement('option');
      placeholderOpt.value = '';
      placeholderOpt.disabled = true;
      placeholderOpt.selected = !selectedId && !currentMassId;
      placeholderOpt.innerText = '— Seleccionar Misa (' + filtered.length + ') —';
      quickSelect.appendChild(placeholderOpt);

      filtered.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.selected = (m.id === (selectedId || currentMassId));
        opt.innerText = m.nombre;
        quickSelect.appendChild(opt);
      });
    }

    function selectSeasonAndMass(season, massId) {
      currentSeasonFilter = season;
      const seasonSelect = document.getElementById('quickSeasonSelect');
      if (seasonSelect) seasonSelect.value = season;
      selectMass(massId);
    }

    let currentFontSize = 18;
    const content = document.getElementById('content');
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');

    function applyFontSize() {
      if (content) content.style.fontSize = currentFontSize + 'px';
    }

    function changeFontSize(delta) {
      currentFontSize += delta * 2;
      if (currentFontSize < 14) currentFontSize = 14;
      if (currentFontSize > 28) currentFontSize = 28;
      applyFontSize();
    }

    function resetFontSize() {
      currentFontSize = 18;
      applyFontSize();
    }

    function updateThemeButton(theme) {
      if (!themeToggleBtn) return;
      if (theme === 'dark') {
        themeToggleBtn.innerHTML = '<span class="theme-icon">☀️</span> <span class="theme-label">Claro</span>';
        themeToggleBtn.title = 'Cambiar a Modo Claro';
      } else {
        themeToggleBtn.innerHTML = '<span class="theme-icon">🌙</span> <span class="theme-label">Oscuro</span>';
        themeToggleBtn.title = 'Cambiar a Modo Oscuro';
      }
    }

    function toggleTheme() {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('misal-theme', newTheme);
      updateThemeButton(newTheme);
    }

    (function initTheme() {
      const savedTheme = localStorage.getItem('misal-theme');
      if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeButton(savedTheme);
      } else {
        htmlElement.setAttribute('data-theme', 'dark');
        updateThemeButton('dark');
      }
    })();

    // Control de scroll para el botón flotante (FAB)
    window.addEventListener('scroll', () => {
      const fab = document.getElementById('fabScrollTop');
      if (!fab) return;
      if (window.scrollY > 300) {
        fab.classList.add('visible');
      } else {
        fab.classList.remove('visible');
      }
    });

    function toggleAllDetails(openState) {
      const allDetails = document.querySelectorAll('details');
      allDetails.forEach(detail => {
        detail.open = openState;
      });
    }

    function showIGMR(num) {
      const it = igmrData[num];
      if (!it) {
        console.warn('IGMR numeral not found:', num);
        return;
      }
      currentModalNum = num;
      document.getElementById('igmrModalTitle').innerText = 'Instrucción General del Misal Romano — Numeral ' + num;
      let subtitle = '';
      if (it.section) subtitle += it.section;
      if (it.subsection) subtitle += (subtitle ? ' · ' : '') + it.subsection;
      document.getElementById('igmrModalSubtitle').innerText = subtitle || 'Instrucción General del Misal Romano';

      const paras = it.text.split('\\n\\n').map(p => '<p>' + p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</p>').join('');
      document.getElementById('igmrModalBody').innerHTML = paras;
      document.getElementById('igmrModal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeIGMRModal(e) {
      if (e && e.target && e.target.id !== 'igmrModal' && !e.target.classList.contains('igmr-modal-close') && e.target.tagName !== 'BUTTON') {
        return;
      }
      document.getElementById('igmrModal').classList.remove('active');
      document.body.style.overflow = '';
    }

    function jumpToIGMR() {
      if (!currentModalNum) return;
      switchView('mass');
      const el = document.getElementById('igmr-num-' + currentModalNum);
      if (el) {
        document.getElementById('igmrModal').classList.remove('active');
        document.body.style.overflow = '';
        let parent = el.closest('details');
        if (parent) parent.open = true;
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('igmr-highlight-pulse');
          setTimeout(() => el.classList.remove('igmr-highlight-pulse'), 3000);
        }, 150);
      }
    }

    // --- GESTIÓN DE VISTAS (HOME vs MISA) ---
    function switchView(viewName) {
      currentView = viewName;
      const homeView = document.getElementById('homeView');
      const massView = document.getElementById('massView');
      const toolbar = document.getElementById('mainToolbar');

      if (viewName === 'home') {
        if (homeView) homeView.classList.add('active');
        if (massView) massView.classList.remove('active');
        if (toolbar) toolbar.style.display = 'none';
      } else {
        if (homeView) homeView.classList.remove('active');
        if (massView) massView.classList.add('active');
        if (toolbar) toolbar.style.display = 'block';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function refreshIndexAndHome() {
      // 1. Limpiar búsqueda del índice
      const searchInput = document.getElementById('drawerSearchInput');
      if (searchInput) {
        searchInput.value = '';
        filterDrawer();
      }

      // 2. Resetear selección de misa y filtro de tiempo
      currentMassId = null;
      currentSeasonFilter = 'all';
      const seasonSelect = document.getElementById('quickSeasonSelect');
      if (seasonSelect) seasonSelect.value = 'all';
      populateSelectors();

      const standardContainer = document.getElementById('standardMassContainer');
      const goodFridayContainer = document.getElementById('goodFridayContainer');
      const holySaturdayContainer = document.getElementById('holySaturdayContainer');
      const prayerWrapper = document.querySelector('.select-prayer-wrapper');
      if (standardContainer) {
        standardContainer.style.display = 'block';
        standardContainer.classList.remove('hidden-liturgy-container');
        standardContainer.classList.add('visible-liturgy-container');
      }
      if (goodFridayContainer) {
        goodFridayContainer.style.display = 'none';
        goodFridayContainer.classList.add('hidden-liturgy-container');
        goodFridayContainer.classList.remove('visible-liturgy-container');
      }
      if (holySaturdayContainer) {
        holySaturdayContainer.style.display = 'none';
        holySaturdayContainer.classList.add('hidden-liturgy-container');
        holySaturdayContainer.classList.remove('visible-liturgy-container');
      }
      if (prayerWrapper) prayerWrapper.style.display = 'block';

      // 3. Ocultar título y badge de la Misa en el Header
      const massTitle = document.getElementById('headerMassTitle');
      const badgeWrap = document.getElementById('headerBadgeWrapper');
      if (massTitle) massTitle.style.display = 'none';
      if (badgeWrap) badgeWrap.style.display = 'none';

      // 4. Volver a la portada de Inicio
      switchView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- GESTIÓN DEL DRAWER Y SELECTORES DE MISAS ---
    function toggleDrawer(open) {
      const drawer = document.getElementById('liturgyDrawer');
      const backdrop = document.getElementById('drawerBackdrop');
      if (open) {
        drawer.classList.add('open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    function populateSelectors() {
      const seasonSelect = document.getElementById('quickSeasonSelect');
      if (seasonSelect) seasonSelect.value = currentSeasonFilter;
      updateMassDropdownOptions();

      const drawerList = document.getElementById('drawerList');
      drawerList.innerHTML = '';

      // Opción de Portada e Inicio en el Índice
      const homeItem = document.createElement('div');
      homeItem.className = 'drawer-item' + (currentView === 'home' ? ' active' : '');
      homeItem.style.borderLeft = '3px solid var(--primary-color)';
      homeItem.style.marginBottom = '8px';
      homeItem.onclick = () => {
        refreshIndexAndHome();
        toggleDrawer(false);
      };
      homeItem.innerHTML = '<span>🏠 Portada y Guía de Inicio</span><span style="font-size:0.75rem; opacity:0.8;">Info</span>';
      drawerList.appendChild(homeItem);

      let currentCat = '';

      liturgiaData.misas.forEach(m => {
        // Drawer list grouped by category
        if (m.categoria !== currentCat) {
          currentCat = m.categoria;
          const catTitle = document.createElement('div');
          catTitle.className = 'drawer-category-title';
          catTitle.innerHTML = '❖ ' + currentCat;
          drawerList.appendChild(catTitle);
        }

        const item = document.createElement('div');
        item.className = 'drawer-item' + (m.id === currentMassId && currentView === 'mass' ? ' active' : '');
        item.id = 'drawer-item-' + m.id;
        item.onclick = () => {
          selectMass(m.id);
          toggleDrawer(false);
        };
        item.innerHTML = '<span>' + m.nombre + '</span><span style="font-size:0.75rem; opacity:0.8;">' + m.tiempo + '</span>';
        drawerList.appendChild(item);
      });
    }

    function filterDrawer() {
      const q = document.getElementById('drawerSearchInput').value.toLowerCase();
      const items = document.querySelectorAll('.drawer-item');
      items.forEach(it => {
        const txt = it.innerText.toLowerCase();
        it.style.display = txt.includes(q) ? 'flex' : 'none';
      });
    }

    function selectMass(massId, explicitPrayer = null) {
      if (!massId) return;
      const m = liturgiaData.misas.find(x => x.id === massId) || liturgiaData.misas[0];
      currentMassId = m.id;

      // Sincronizar selector de tiempo litúrgico
      const seasonKey = getSeasonCategoryForMass(m);
      currentSeasonFilter = seasonKey;
      const seasonSelect = document.getElementById('quickSeasonSelect');
      if (seasonSelect) seasonSelect.value = seasonKey;
      updateMassDropdownOptions(m.id);

      document.getElementById('quickMassSelect').value = m.id;

      // Actualizar Header
      const headerTitle = document.getElementById('headerMassTitle');
      headerTitle.innerText = m.nombre;
      headerTitle.style.display = 'block';

      const headerBadge = document.getElementById('headerBadgeWrapper');
      headerBadge.style.display = 'block';

      const badge = document.getElementById('headerSeasonBadge');
      badge.innerText = m.tiempo;
      badge.style.background = m.colorHex || '#16a34a';
      badge.style.color = (m.color === 'blanco') ? '#0f172a' : '#ffffff';

      // Actualizar Active en Drawer
      document.querySelectorAll('.drawer-item').forEach(it => it.classList.remove('active'));
      const activeDrawerItem = document.getElementById('drawer-item-' + m.id);
      if (activeDrawerItem) activeDrawerItem.classList.add('active');

      // Actualizar Textos Propios
      document.getElementById('dyn-antifona-entrada').innerHTML = '<p><strong>Antífona de Entrada:</strong> ' + m.antifonaEntrada + '</p>';
      document.getElementById('dyn-colecta').innerHTML = '<p><strong>Oración Colecta:</strong> ' + m.colecta + '</p>';
      
      // Lectura 1
      document.getElementById('dyn-lectura-1').innerHTML = 
        '<div class="scripture-citation">Primera Lectura (' + m.lectura1.cita + ')</div>' +
        '<p>' + m.lectura1.texto + '</p>' +
        '<p class="rubric" style="margin-top:0.8rem;">Palabra de Dios. <span class="response">Te alabamos, Señor.</span></p>';

      // Salmo
      const stanzas = m.salmo.estrofas.map(s => '<p style="margin-bottom:0.6rem;">' + s + '</p>').join('');
      document.getElementById('dyn-salmo').innerHTML = 
        '<div class="scripture-citation">Salmo Responsorial (' + m.salmo.cita + ')</div>' +
        '<div class="psalm-response">R. ' + m.salmo.respuesta + '</div>' +
        stanzas;

      // Lectura 2
      document.getElementById('dyn-lectura-2').innerHTML = 
        '<div class="scripture-citation">Segunda Lectura (' + m.lectura2.cita + ')</div>' +
        '<p>' + m.lectura2.texto + '</p>' +
        '<p class="rubric" style="margin-top:0.8rem;">Palabra de Dios. <span class="response">Te alabamos, Señor.</span></p>';

      // Aclamación antes del Evangelio / Aleluya
      const isCuaresma = (m.tiempo === 'Cuaresma' || (m.tiempo === 'Semana Santa' && m.id !== 'pas-vigilia'));
      if (isCuaresma) {
        document.getElementById('dyn-aleluya').innerHTML = 
          '<p><span class="speaker">Todos:</span> <span class="response">Honor y gloria a ti, Señor Jesús.</span></p>' +
          '<p><span class="speaker">V.</span> ' + (m.aleluya ? m.aleluya.versiculo : '') + '</p>' +
          '<p><span class="speaker">Todos:</span> <span class="response">Honor y gloria a ti, Señor Jesús.</span></p>';
      } else {
        document.getElementById('dyn-aleluya').innerHTML = 
          '<p><span class="speaker">Todos:</span> <span class="response">¡Aleluya, aleluya!</span></p>' +
          '<p><span class="speaker">V.</span> ' + (m.aleluya ? m.aleluya.versiculo : '') + '</p>' +
          '<p><span class="speaker">Todos:</span> <span class="response">¡Aleluya!</span></p>';
      }

      // Evangelio
      document.getElementById('dyn-evangelio').innerHTML = 
        '<div class="scripture-citation">Santo Evangelio (' + m.evangelio.cita + ')</div>' +
        '<p><span class="speaker">Diácono o Sacerdote:</span> El Señor esté con vosotros. <span class="response">Y con tu espíritu.</span></p>' +
        '<p><span class="speaker">Diácono o Sacerdote:</span> Lectura del santo Evangelio según ' + m.evangelio.cita.split(' ')[0] + '. <span class="response">Gloria a ti, Señor.</span></p>' +
        '<p style="margin-top: 0.8rem;">' + m.evangelio.texto + '</p>' +
        '<p class="rubric" style="margin-top:0.8rem;">Palabra del Señor. <span class="response">Gloria a ti, Señor Jesús.</span></p>';

      // Ofrendas
      document.getElementById('dyn-ofrendas').innerHTML = '<p><strong>Oración sobre las Ofrendas:</strong> ' + m.ofrendas + '</p>';

      // Prefacio
      const pref = liturgiaData.prefacios[m.prefacioId] || liturgiaData.prefacios["to-1"];
      document.getElementById('dyn-prefacio').innerHTML = 
        '<p><strong>' + pref.titulo + '</strong></p>' +
        '<p class="rubric"><em>(' + pref.subtitulo + ')</em></p>' +
        '<p>' + pref.texto + '</p>';

      // Comunión
      document.getElementById('dyn-antifona-comunion').innerHTML = '<p><strong>Antífona de Comunión:</strong> ' + m.antifonaComunion + '</p>';
      document.getElementById('dyn-postcomunion').innerHTML = '<p><strong>Oración después de la Comunión:</strong> ' + m.postcomunion + '</p>';

      // Actualizar opciones del selector de Plegaria indicando la más adecuada según la IGMR 365
      const rec = m.plegariaRecomendada || "3";
      const prayerSelect = document.getElementById('quickPrayerSelect');
      if (prayerSelect) {
        prayerSelect.options[0].text = "Plegaria I" + (rec === "1" ? " ★ (Recomendada IGMR 365a)" : "");
        prayerSelect.options[1].text = "Plegaria II" + (rec === "2" ? " ★ (Recomendada IGMR 365b)" : "");
        prayerSelect.options[2].text = "Plegaria III" + (rec === "3" ? " ★ (Recomendada IGMR 365c)" : "");
        prayerSelect.options[3].text = "Plegaria IV" + (rec === "4" ? " ★ (Recomendada IGMR 365d)" : "");
      }

      // Conmutar a la plegaria litúrgicamente más adecuada para el día (si aplica)
      const chosenPrayer = explicitPrayer || rec;
      selectPrayer(chosenPrayer);

      // Gestión de estructura litúrgica para celebraciones especiales (Viernes Santo y Sábado Santo)
      const standardContainer = document.getElementById('standardMassContainer');
      const goodFridayContainer = document.getElementById('goodFridayContainer');
      const holySaturdayContainer = document.getElementById('holySaturdayContainer');
      const prayerWrapper = document.querySelector('.select-prayer-wrapper');

      if (m.id === 'pas-viernes-santo') {
        if (standardContainer) {
          standardContainer.style.display = 'none';
          standardContainer.classList.add('hidden-liturgy-container');
          standardContainer.classList.remove('visible-liturgy-container');
        }
        if (goodFridayContainer) {
          goodFridayContainer.style.display = 'block';
          goodFridayContainer.classList.remove('hidden-liturgy-container');
          goodFridayContainer.classList.add('visible-liturgy-container');
        }
        if (holySaturdayContainer) {
          holySaturdayContainer.style.display = 'none';
          holySaturdayContainer.classList.add('hidden-liturgy-container');
          holySaturdayContainer.classList.remove('visible-liturgy-container');
        }
        if (prayerWrapper) prayerWrapper.style.display = 'none';
      } else if (m.id === 'pas-sabado-santo') {
        if (standardContainer) {
          standardContainer.style.display = 'none';
          standardContainer.classList.add('hidden-liturgy-container');
          standardContainer.classList.remove('visible-liturgy-container');
        }
        if (goodFridayContainer) {
          goodFridayContainer.style.display = 'none';
          goodFridayContainer.classList.add('hidden-liturgy-container');
          goodFridayContainer.classList.remove('visible-liturgy-container');
        }
        if (holySaturdayContainer) {
          holySaturdayContainer.style.display = 'block';
          holySaturdayContainer.classList.remove('hidden-liturgy-container');
          holySaturdayContainer.classList.add('visible-liturgy-container');
        }
        if (prayerWrapper) prayerWrapper.style.display = 'none';
      } else {
        if (standardContainer) {
          standardContainer.style.display = 'block';
          standardContainer.classList.remove('hidden-liturgy-container');
          standardContainer.classList.add('visible-liturgy-container');
        }
        if (goodFridayContainer) {
          goodFridayContainer.style.display = 'none';
          goodFridayContainer.classList.add('hidden-liturgy-container');
          goodFridayContainer.classList.remove('visible-liturgy-container');
        }
        if (holySaturdayContainer) {
          holySaturdayContainer.style.display = 'none';
          holySaturdayContainer.classList.add('hidden-liturgy-container');
          holySaturdayContainer.classList.remove('visible-liturgy-container');
        }
        if (prayerWrapper) prayerWrapper.style.display = 'block';
      }

      // Conmutar a la vista de la Misa
      switchView('mass');

      localStorage.setItem('misal-mass-id', m.id);
    }

    function selectPrayer(prayerId) {
      currentPrayerId = prayerId;
      document.getElementById('quickPrayerSelect').value = prayerId;
      const pl = liturgiaData.plegarias[prayerId] || liturgiaData.plegarias["3"];
      const container = document.getElementById('dyn-plegaria-body');

      const m = liturgiaData.misas.find(x => x.id === currentMassId);
      const isRec = m && (m.plegariaRecomendada === prayerId);
      const recBadge = isRec 
        ? ('<div style="margin-bottom:0.8rem;"><span class="liturgical-badge" style="background: var(--primary-color); color:#fff; font-size:0.75rem; border:none;">★ ' + (m.plegariaMotivo || 'Aconsejada para hoy según IGMR n. 365') + '</span></div>')
        : '';

      let html = '<div class="prayer-text" style="border-left-color: var(--primary-color); margin-top: 1.5rem;">';
      html += recBadge;
      html += '<h4 style="color: var(--primary-color); margin-bottom: 0.3rem;">' + pl.nombre + '</h4>';
      html += '<p class="rubric" style="margin-bottom: 1rem;">' + pl.descripcion + '</p>';

      pl.contenido.forEach(it => {
        if (it.tipo === 'rubrica') {
          html += '<p class="rubric">' + it.texto + '</p>';
        } else if (it.speaker) {
          const respClass = it.response ? ' class="response"' : '';
          const paras = it.texto.split('\\n\\n').map(p => '<p><span class="speaker">' + it.speaker + ':</span> <span' + respClass + '>' + p + '</span></p>').join('');
          html += paras;
        }
      });

      html += '</div>';
      container.innerHTML = html;
      localStorage.setItem('misal-prayer-id', prayerId);
    }

    // Inicializar selectores y estado
    window.addEventListener('DOMContentLoaded', () => {
      currentMassId = null;
      currentView = 'home';
      populateSelectors();
      switchView('home');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeIGMRModal();
        toggleDrawer(false);
      }
    });
  </script>
</body>
</html>
`;

const finalHTML = linkifiedBody + scriptBlock;
fs.writeFileSync('misal.html', finalHTML, 'utf8');
fs.writeFileSync('index.html', finalHTML, 'utf8');

console.log('Total characters in generated misal.html and index.html:', finalHTML.length);
console.log('Total IGMR numbers used:', usedNumbers.size);

const unused = [];
for (let n = 1; n <= 399; n++) {
  if (!usedNumbers.has(n)) unused.push(n);
}
console.log('Unused IGMR numbers (should be empty []):', unused);
