import { siteMetadata } from '@/lib/seo/seo';
import { describe, expect, it } from 'vitest';

describe('siteMetadata', () => {
  it('Should define the application name', () => {
    expect(siteMetadata.title).toEqual({
      default: 'Bairu',
      template: '%s | Bairu',
    });
  });

  it('Should have a description', () => {
    expect(siteMetadata.description).toBeTruthy();
  });

  it('Should define metadataBase', () => {
    expect(siteMetadata.metadataBase).toBeDefined();
  });

  it('Should configure Open Graph', () => {
    expect(siteMetadata.openGraph).toBeDefined();
  });
});
