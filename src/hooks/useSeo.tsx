import { useEffect, useCallback } from 'react';

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  robots?: string;
  schema?: object;
}

interface SeoState extends SeoMeta {
  siteName?: string;
  locale?: string;
}

const DEFAULT_SEO: SeoState = {
  title: 'LinkCraft AI',
  description: 'Smart Link Management Platform with AI-powered bio generation',
  keywords: 'link management, bio generator, link in bio, AI links',
  author: 'LinkCraft AI',
  siteName: 'LinkCraft AI',
  locale: 'en_US',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
};

let currentSeo: SeoState = { ...DEFAULT_SEO };

function updateMetaTag(property: string, content: string, isName = false): void {
  let element = document.querySelector(
    isName ? `meta[name="${property}"]` : `meta[property="${property}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    if (isName) {
      element.name = property;
    } else {
      element.setAttribute('property', property);
    }
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateTitle(title: string): void {
  document.title = title;
}

function applySeo(seo: Partial<SeoState> & { title?: string }): void {
  const fullSeo = { ...DEFAULT_SEO, ...seo };
  currentSeo = fullSeo as SeoState;

  updateTitle(fullSeo.title ?? DEFAULT_SEO.title ?? '');

  if (fullSeo.description !== undefined) {
    updateMetaTag('description', fullSeo.description, true);
  }
  if (fullSeo.keywords !== undefined) {
    updateMetaTag('keywords', fullSeo.keywords, true);
  }
  if (fullSeo.author !== undefined) {
    updateMetaTag('author', fullSeo.author, true);
  }
  if (fullSeo.robots !== undefined) {
    updateMetaTag('robots', fullSeo.robots, true);
  }
  if (fullSeo.canonical !== undefined) {
    updateMetaTag('canonical', fullSeo.canonical, true);
  }

  if (fullSeo.ogTitle !== undefined) {
    updateMetaTag('og:title', fullSeo.ogTitle);
  } else if (fullSeo.title !== undefined) {
    updateMetaTag('og:title', fullSeo.title);
  }
  if (fullSeo.ogDescription !== undefined) {
    updateMetaTag('og:description', fullSeo.ogDescription);
  } else if (fullSeo.description !== undefined) {
    updateMetaTag('og:description', fullSeo.description);
  }
  if (fullSeo.ogImage !== undefined) {
    updateMetaTag('og:image', fullSeo.ogImage);
  }
  if (fullSeo.ogUrl !== undefined) {
    updateMetaTag('og:url', fullSeo.ogUrl);
  } else if (fullSeo.canonical !== undefined) {
    updateMetaTag('og:url', fullSeo.canonical);
  }
  if (fullSeo.ogType !== undefined) {
    updateMetaTag('og:type', fullSeo.ogType);
  }
  if (fullSeo.siteName !== undefined) {
    updateMetaTag('og:site_name', fullSeo.siteName);
  }
  if (fullSeo.locale !== undefined) {
    updateMetaTag('og:locale', fullSeo.locale);
  }

  if (fullSeo.twitterCard !== undefined) {
    updateMetaTag('twitter:card', fullSeo.twitterCard, true);
  }
  if (fullSeo.twitterTitle !== undefined) {
    updateMetaTag('twitter:title', fullSeo.twitterTitle, true);
  } else if (fullSeo.ogTitle !== undefined) {
    updateMetaTag('twitter:title', fullSeo.ogTitle, true);
  }
  if (fullSeo.twitterDescription !== undefined) {
    updateMetaTag('twitter:description', fullSeo.twitterDescription, true);
  } else if (fullSeo.ogDescription !== undefined) {
    updateMetaTag('twitter:description', fullSeo.ogDescription, true);
  }
  if (fullSeo.twitterImage !== undefined) {
    updateMetaTag('twitter:image', fullSeo.twitterImage, true);
  } else if (fullSeo.ogImage !== undefined) {
    updateMetaTag('twitter:image', fullSeo.ogImage, true);
  }

  if (fullSeo.schema !== undefined) {
    let schemaEl = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = 'json-ld-schema';
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify(fullSeo.schema);
  } else {
    const existingSchema = document.getElementById('json-ld-schema');
    if (existingSchema) {
      existingSchema.remove();
    }
  }
}

export function useSeo() {
  const setSeo = useCallback((seo: Partial<SeoMeta> & { title: string }) => {
    applySeo(seo);
  }, []);

  const setPageSeo = useCallback(
    (pageTitle: string, options?: Partial<SeoMeta>) => {
      const fullTitle = pageTitle
        ? `${pageTitle} | ${DEFAULT_SEO.siteName}`
        : DEFAULT_SEO.title ?? '';
      applySeo({
        title: fullTitle,
        ...options,
      });
    },
    []
  );

  const resetSeo = useCallback(() => {
    applySeo(DEFAULT_SEO);
  }, []);

  useEffect(() => {
    return () => {
      applySeo(DEFAULT_SEO);
    };
  }, []);

  return { setSeo, setPageSeo, resetSeo, currentSeo };
}

export function useSeoMeta(seo: Partial<SeoMeta> & { title: string }) {
  const { setSeo } = useSeo();

  useEffect(() => {
    setSeo(seo);
  }, [seo, setSeo]);
}