import DOMPurify from 'dompurify';

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
}

const DEFAULT_ALLOWED_TAGS: string[] = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'em', 'u', 's', 'small',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote', 'code', 'pre',
  'span', 'div',
];

const DEFAULT_ALLOWED_ATTR: string[] = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'target', 'rel',
  'width', 'height',
];

export function sanitizeHtml(html: string, options?: SanitizeOptions): string {
  const config = {
    ALLOWED_TAGS: options?.allowedTags ?? DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: options?.allowedAttributes ?? DEFAULT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  };

  return DOMPurify.sanitize(html, config) as string;
}

export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) as string;
}

export function sanitizeUrl(url: string): string {
  const sanitized = DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) as string;
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://') && !sanitized.startsWith('/')) {
    return '';
  }
  return sanitized;
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}