'use client';
import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    id: 'organise',
    name: 'Organise',
    emoji: '📁',
    color: 'text-blue-700',
    bgActive: 'bg-blue-600',
    tools: [
      { href:'/merge',         title:'Merge PDF',       desc:'Combine up to 20 PDFs into one file',         icon:'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 8h12v12a2 2 0 01-2 2H10a2 2 0 01-2-2z', bg:'bg-blue-50',   text:'text-blue-700',   badge:'Popular' },
      { href:'/split',         title:'Split PDF',        desc:'Separate pages or extract a range',           icon:'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',                                  bg:'bg-purple-50', text:'text-purple-700', badge:'' },
      { href:'/rotate',        title:'Rotate PDF',       desc:'Fix orientation — 90°, 180°, 270°',           icon:'M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2',               bg:'bg-orange-50', text:'text-orange-700', badge:'' },
      { href:'/delete-pages',  title:'Delete Pages',     desc:'Remove pages by number or range',             icon:'M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6',                 bg:'bg-red-50',    text:'text-red-700',    badge:'' },
      { href:'/extract-pages', title:'Extract Pages',    desc:'Save specific pages to a new PDF',            icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M12 18v-6M9 15l3 3 3-3',          bg:'bg-violet-50', text:'text-violet-700', badge:'' },
      { href:'/page-numbers',  title:'Page Numbers',     desc:'6 positions, 4 formats, custom start',        icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 18h2M14 18h2',                bg:'bg-indigo-50', text:'text-indigo-700', badge:'' },
    ],
  },
  {
    id: 'edit',
    name: 'Edit',
    emoji: '✏️',
    color: 'text-emerald-700',
    bgActive: 'bg-emerald-600',
    tools: [
      { href:'/compress',    title:'Compress PDF',  desc:'Reduce file size up to 70%',                      icon:'M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7',                                                         bg:'bg-green-50',  text:'text-green-700',  badge:'' },
      { href:'/watermark',   title:'Watermark PDF', desc:'Stamp custom text on every page',                 icon:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',                                                     bg:'bg-cyan-50',   text:'text-cyan-700',   badge:'' },
      { href:'/crop-pdf',    title:'Crop PDF',      desc:'Trim margins with adjustable sliders',            icon:'M6 2v20M18 2v20M2 6h20M2 18h20',                                                                  bg:'bg-teal-50',   text:'text-teal-700',   badge:'' },
      { href:'/redact-pdf',  title:'Redact PDF',    desc:'Permanently black out sensitive content',         icon:'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M1 1l22 22',          bg:'bg-zinc-50',   text:'text-zinc-700',   badge:'' },
      { href:'/flatten-pdf', title:'Flatten PDF',   desc:'Lock forms and annotations permanently',          icon:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',                                               bg:'bg-slate-50',  text:'text-slate-700',  badge:'' },
      { href:'/sign-pdf',    title:'Sign PDF',      desc:'Add a typed or image signature',                  icon:'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z',                                   bg:'bg-blue-50',   text:'text-blue-700',   badge:'' },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    emoji: '🔐',
    color: 'text-red-700',
    bgActive: 'bg-red-600',
    tools: [
      { href:'/protect', title:'Protect PDF', desc:'Password-lock with AES-256 encryption',              icon:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',                                           bg:'bg-red-50',    text:'text-red-700',    badge:'' },
      { href:'/unlock',  title:'Unlock PDF',  desc:'Remove password protection you own',                 icon:'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3',               bg:'bg-yellow-50', text:'text-yellow-700', badge:'' },
    ],
  },
  {
    id: 'from-pdf',
    name: 'PDF → File',
    emoji: '📤',
    color: 'text-amber-700',
    bgActive: 'bg-amber-600',
    tools: [
      { href:'/pdf-to-word',  title:'PDF to Word',       desc:'Convert to editable .docx document',       icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8',                  bg:'bg-sky-50',    text:'text-sky-700',    badge:'Hot' },
      { href:'/pdf-to-excel', title:'PDF to Excel',      desc:'Extract tables to .xlsx spreadsheet',      icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h8',                    bg:'bg-green-50',  text:'text-green-700',  badge:'' },
      { href:'/pdf-to-ppt',   title:'PDF to PowerPoint', desc:'Convert slides to editable .pptx',         icon:'M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M5 18h8a2 2 0 002-2V8H5a2 2 0 00-2 2v8a2 2 0 002 2z', bg:'bg-red-50',   text:'text-red-700',   badge:'' },
      { href:'/pdf-to-jpg',   title:'PDF to JPG',        desc:'Export pages as high-resolution images',   icon:'M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21',                           bg:'bg-amber-50',  text:'text-amber-700',  badge:'' },
      { href:'/pdf-to-png',   title:'PDF to PNG',        desc:'Lossless PNG with transparency support',   icon:'M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21',                           bg:'bg-teal-50',   text:'text-teal-700',   badge:'' },
      { href:'/pdf-to-text',  title:'PDF to Text',       desc:'Extract all text as .txt or Markdown',     icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',           bg:'bg-violet-50', text:'text-violet-700', badge:'' },
    ],
  },
  {
    id: 'to-pdf',
    name: 'File → PDF',
    emoji: '📥',
    color: 'text-rose-700',
    bgActive: 'bg-rose-600',
    tools: [
      { href:'/word-to-pdf',  title:'Word to PDF',       desc:'Convert .docx, .doc, .odt, .rtf',          icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8',                  bg:'bg-blue-50',   text:'text-blue-700',   badge:'Hot' },
      { href:'/excel-to-pdf', title:'Excel to PDF',      desc:'Convert .xlsx, .xls, .csv to PDF',         icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8',                          bg:'bg-green-50',  text:'text-green-700',  badge:'' },
      { href:'/ppt-to-pdf',   title:'PowerPoint to PDF', desc:'Convert .pptx, .ppt presentations',        icon:'M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M5 18h8a2 2 0 002-2V8H5a2 2 0 00-2 2v8a2 2 0 002 2z', bg:'bg-red-50',   text:'text-red-700',   badge:'' },
      { href:'/jpg-to-pdf',   title:'JPG to PDF',        desc:'Combine images into one PDF',               icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M12 18v-6M9 15l3 3 3-3',           bg:'bg-rose-50',   text:'text-rose-700',   badge:'' },
      { href:'/png-to-pdf',   title:'PNG to PDF',        desc:'Convert PNG images to PDF',                 icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M12 18v-6M9 15l3 3 3-3',           bg:'bg-teal-50',   text:'text-teal-700',   badge:'' },
      { href:'/txt-to-pdf',   title:'TXT to PDF',        desc:'Plain text & Markdown to clean PDF',        icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8',                  bg:'bg-gray-50',   text:'text-gray-700',   badge:'' },
      { href:'/html-to-pdf',  title:'HTML to PDF',       desc:'Convert HTML files to PDF document',        icon:'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',                                                          bg:'bg-orange-50', text:'text-orange-700', badge:'' },
    ],
  },
];

const allTools = CATEGORIES.flatMap(c => c.tools);

function ToolIcon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={`M${seg}`} />)}
    </svg>
  );
}

function ToolTile({ tool }: { tool: typeof CATEGORIES[0]['tools'][0] }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col bg-white border border-ink-100 rounded-2xl p-4 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer"
      aria-label={`${tool.title} — ${tool.desc}`}
    >
      {/* Badge */}
      {tool.badge && (
        <span className="absolute top-3 right-3 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-widest z-10">
          {tool.badge}
        </span>
      )}

      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 shrink-0 ${tool.bg} ${tool.text} group-hover:scale-110 transition-transform duration-200`}>
        <ToolIcon d={tool.icon} />
      </div>

      {/* Text */}
      <p className="text-[13px] font-semibold text-ink-900 leading-tight mb-1">{tool.title}</p>
      <p className="text-[11px] text-ink-500 leading-snug flex-1">{tool.desc}</p>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Arrow on hover */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        className="absolute bottom-3.5 right-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </Link>
  );
}

export default function ToolsGrid({ showFilters = true }: { showFilters?: boolean }) {
  const [active, setActive] = useState<string>('all');

  const filtered = active === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.id === active);

  const totalTools = allTools.length;

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'PdfOnlineStudio — Free PDF Tools',
        numberOfItems: totalTools,
        itemListElement: allTools.map((t, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: t.title, url: `https://pdfonlinestudio.com${t.href}`,
            applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        })),
      })}} />

      {/* Filter tabs */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActive('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
              active === 'all'
                ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
                : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400 hover:bg-ink-50'
            }`}
          >
            All tools
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${active === 'all' ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-500'}`}>
              {totalTools}
            </span>
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
                active === cat.id
                  ? `${cat.bgActive} text-white border-transparent shadow-sm`
                  : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400 hover:bg-ink-50'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${active === cat.id ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-500'}`}>
                {cat.tools.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Tool grid — grouped by category */}
      <div className="space-y-10">
        {filtered.map(cat => (
          <div key={cat.id}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-base" aria-hidden="true">{cat.emoji}</span>
              <h2 className={`text-xs font-mono font-bold uppercase tracking-widest ${cat.color}`}>
                {cat.name}
              </h2>
              <div className="flex-1 h-px bg-ink-100" />
              <span className="text-xs font-mono text-ink-400">{cat.tools.length} tools</span>
            </div>

            {/* Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {cat.tools.map(tool => (
                <ToolTile key={tool.href} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
