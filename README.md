# 📄 Foliopress — PDF Tools Web App

A modern, production-ready PDF tools web application built with **Next.js 14**, **Tailwind CSS**, and **Node.js API routes**.

---

## ✨ Features

| Tool | Description |
|---|---|
| **Merge PDF** | Combine multiple PDFs into one document |
| **Split PDF** | Extract pages or split into individual files |
| **Compress PDF** | Reduce file size with configurable quality |
| **PDF to JPG** | Convert each page to a high-res JPG image |
| **JPG to PDF** | Build a PDF from one or more images |

---

## 🗂️ Folder Structure

```
pdftools/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (header + footer)
│   │   ├── page.tsx                # Homepage (hero + tools grid)
│   │   ├── globals.css             # Global styles + Tailwind
│   │   ├── loading.tsx             # Global loading skeleton
│   │   ├── error.tsx               # Global error boundary
│   │   ├── not-found.tsx           # 404 page
│   │   │
│   │   ├── merge/page.tsx          # Merge PDF tool page
│   │   ├── split/page.tsx          # Split PDF tool page
│   │   ├── compress/page.tsx       # Compress PDF tool page
│   │   ├── pdf-to-jpg/page.tsx     # PDF → JPG tool page
│   │   ├── jpg-to-pdf/page.tsx     # JPG → PDF tool page
│   │   │
│   │   └── api/
│   │       ├── merge-pdf/route.ts  # POST /api/merge-pdf
│   │       ├── split-pdf/route.ts  # POST /api/split-pdf
│   │       ├── compress-pdf/route.ts # POST /api/compress-pdf
│   │       ├── pdf-to-jpg/route.ts # POST /api/pdf-to-jpg
│   │       └── jpg-to-pdf/route.ts # POST /api/jpg-to-pdf
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Header.tsx          # Sticky header with nav
│   │   │   ├── Footer.tsx          # Footer with links
│   │   │   ├── HeroSection.tsx     # Homepage hero
│   │   │   ├── FeaturesSection.tsx # Homepage features
│   │   │   ├── DropZone.tsx        # Drag & drop upload zone
│   │   │   ├── FileList.tsx        # Selected files list
│   │   │   ├── ProgressIndicator.tsx # Processing progress bar
│   │   │   ├── ToolPageLayout.tsx  # Shared tool page wrapper
│   │   │   └── AdSlot.tsx          # AdSense placeholder slots
│   │   └── tools/
│   │       └── ToolsGrid.tsx       # Tools card grid
│   │
│   └── lib/
│       └── fileUtils.ts            # Shared file helpers
│
├── public/                         # Static assets
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.17+ (required for Next.js 14)
- **npm** or **yarn**

### 1. Clone / copy the project

```bash
# If you have the folder already:
cd pdftools
```

### 2. Install dependencies

```bash
npm install
```

> **Note on `sharp`:** Sharp uses native binaries. If you run into install issues, try:
> ```bash
> npm install --ignore-scripts
> npm rebuild sharp
> ```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

---

## 🌐 Environment Variables

No environment variables are required for the base app. For optional features:

```env
# .env.local (optional)

# Max upload size in MB (default: 100)
NEXT_PUBLIC_MAX_FILE_SIZE_MB=100

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 💰 AdSense Integration

Three ad slot placeholders are built in. To activate them:

1. Add your AdSense script to `src/app/layout.tsx`:
```html
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX"
  crossOrigin="anonymous"
/>
```

2. Replace the `<AdSlot>` component content in `src/components/ui/AdSlot.tsx`:
```tsx
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXX"
  data-ad-slot="YYYYY"
  data-ad-format="auto"
  data-full-width-responsive="true"
/>
```

Ad slot locations:
- **Top banner** — above the hero on homepage
- **Middle content** — between tools grid and features section
- **Bottom banner** — below features section
- **Tool page top** — top of every tool page
- **Tool page bottom** — bottom of every tool page

---

## 📦 Dependencies

### Runtime
| Package | Purpose |
|---|---|
| `next` | Framework |
| `react`, `react-dom` | UI |
| `pdf-lib` | PDF manipulation (merge, split, compress) |
| `sharp` | Image processing (JPG conversion) |
| `archiver` | ZIP archive creation |
| `uuid` | Temp file naming |
| `formidable` | Multipart form parsing |

### Dev
| Package | Purpose |
|---|---|
| `typescript` | Type safety |
| `tailwindcss` | Utility CSS |
| `eslint` | Linting |

---

## 🛠️ Extending to Full PDF Rendering (PDF → JPG)

The included PDF → JPG converter creates white canvas placeholders per page. For **true raster rendering** of PDF content, add one of:

**Option A: `pdf2pic` (uses ImageMagick / Ghostscript)**
```bash
sudo apt-get install ghostscript imagemagick
npm install pdf2pic
```

**Option B: Puppeteer (headless Chrome)**
```bash
npm install puppeteer
```

**Option C: `@napi-rs/canvas` + custom renderer**
```bash
npm install @napi-rs/canvas canvas
```

Update `/api/pdf-to-jpg/route.ts` to use your chosen approach.

---

## 🔒 Security Notes

- All uploaded files are processed in memory (via `request.formData()`) — no disk writes for most operations
- Temp files created during split/zip operations are automatically cleaned up
- File size is limited to 100MB per file by default
- No authentication required — suitable for public tools; add rate limiting for production

### Recommended production additions:
- **Rate limiting**: `npm install @upstash/ratelimit` or nginx `limit_req`
- **File type validation**: Validate MIME types server-side beyond extension checks  
- **HTTPS**: Ensure your deployment uses TLS
- **CORS headers**: Restrict to your domain if deploying API separately

---

## 🚢 Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```

> Set `maxDuration = 60` in `vercel.json` for large file processing:
```json
{
  "functions": {
    "src/app/api/**": { "maxDuration": 60 }
  }
}
```

### Docker
```dockerfile
FROM node:20-alpine
RUN apk add --no-cache libc6-compat vips-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📝 License

MIT — free to use, modify, and deploy commercially.
