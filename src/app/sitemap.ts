import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pdfonlinestudio.com';
  const now  = new Date();

  // High-traffic tools first (better crawl budget allocation)
  const highPriorityTools = [
    '/merge', '/compress', '/pdf-to-word', '/word-to-pdf',
    '/pdf-to-jpg', '/jpg-to-pdf', '/split', '/protect',
  ];

  const otherTools = [
    '/rotate', '/delete-pages', '/extract-pages', '/page-numbers',
    '/watermark', '/crop-pdf', '/redact-pdf', '/flatten-pdf',
    '/unlock', '/sign-pdf',
    '/pdf-to-png', '/pdf-to-excel', '/pdf-to-ppt', '/pdf-to-text',
    '/png-to-pdf', '/excel-to-pdf', '/ppt-to-pdf', '/txt-to-pdf', '/html-to-pdf',
  ];

  const articles = [
    '/blog/pdf-for-beginners',
    '/blog/how-to-merge-pdfs',
    '/blog/how-to-compress-pdf',
    '/blog/how-to-split-pdf',
    '/blog/how-to-convert-pdf-to-jpg',
    '/blog/how-to-convert-word-to-pdf',
    '/blog/how-to-rotate-pdf',
    '/blog/how-to-add-watermark-pdf',
    '/blog/how-to-edit-pdf-free',
    '/blog/pdf-vs-word',
    '/blog/pdf-file-size-guide',
    '/blog/jpg-vs-png-pdf',
    '/blog/pdf-security-guide',
    '/blog/best-pdf-tools-2025',
    '/blog/pdf-accessibility-guide',
  ];

  return [
    // Homepage — highest priority
    { url: base, lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },

    // All tools page
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },

    // High-priority tools
    ...highPriorityTools.map(p => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    })),

    // Remaining tools
    ...otherTools.map(p => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),

    // Blog index
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },

    // Blog articles
    ...articles.map(p => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),

    // Static pages
    { url: `${base}/about`,          lastModified: now, changeFrequency: 'yearly' as const,  priority: 0.5 },
    { url: `${base}/contact`,        lastModified: now, changeFrequency: 'yearly' as const,  priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly' as const,  priority: 0.3 },
    { url: `${base}/terms`,          lastModified: now, changeFrequency: 'yearly' as const,  priority: 0.3 },
  ];
}
