import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/structured-data';
import { describe, expect, it } from 'vitest';

describe('organizationJsonLd', () => {
  it('Should use Schema.org context', () => {
    expect(organizationJsonLd['@context']).toBe('https://schema.org');
  });

  it('Should define Organization schema', () => {
    expect(organizationJsonLd['@type']).toBe('Organization');
  });
});

describe('websiteJsonLd', () => {
  it('Should define WebSite schema', () => {
    expect(websiteJsonLd['@type']).toBe('WebSite');
  });
});
