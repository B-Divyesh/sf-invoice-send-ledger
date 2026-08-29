import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

interface Claim { id: string; test: string }

describe('factory acceptance records', () => {
  it('gives every declared claim exactly one tagged browser test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Claim[];
    const source = readFileSync('tests/e2e/claims.spec.ts', 'utf8');
    const tags = [...source.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    expect([...tags].sort()).toEqual(claims.map((claim) => claim.id).sort());
    for (const claim of claims) {
      expect(tags.filter((tag) => tag === claim.id), claim.id).toHaveLength(1);
      expect(claim.test).toContain(`--grep @claim:${claim.id}`);
    }
  });

  it('configures real demo and 404 routes, security headers, and immutable assets', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.routes).toContainEqual(expect.objectContaining({ route: '/demo', rewrite: '/index.html' }));
    expect(config.routes).toContainEqual(expect.objectContaining({ route: '/index.html', allowedRoles: ['anonymous'] }));
    expect(config.routes).toContainEqual(expect.objectContaining({ route: '/*', statusCode: 404 }));
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.routes.find((route: { route: string }) => route.route === '/assets/index-*').headers['Cache-Control']).toContain('immutable');
  });

  it('keeps the catalog description verb-first and within 120 characters', () => {
    const copy = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(copy.length).toBeLessThanOrEqual(120);
    expect(copy).toMatch(/^(Track|Record|Keep|Calculate|Export)\b/);
  });

  it('does not advertise an unverified price, free tier, purchase, or artwork provenance', () => {
    const visitorCopy = [
      'src/app.ts',
      'README.md',
      'public/privacy/index.html',
      'public/terms/index.html',
      'public/404.html',
      'public/offline.html',
    ].map((path) => readFileSync(path, 'utf8')).join('\n');
    expect(visitorCopy).not.toMatch(/₹699|one-time purchase|free date record|records are free|Ceramic artwork generated for this product/i);
    expect(visitorCopy).toContain('PDF storage requires a verified license');
  });
});
