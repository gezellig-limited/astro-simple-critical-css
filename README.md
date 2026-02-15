# Simple Critical CSS integration for Astro

This is an Astro integration that generates inline critical CSS for your Astro site on build and shouldn't require any set up to work.

## Setup with astro add

```bash
npx astro add @gezellig/astro-simple-critical-css
```

Then confirm your `astro.config.*` includes the integration:

```ts
import { defineConfig } from 'astro/config';
import simpleCriticalCss from '@gezellig/astro-simple-critical-css';

export default defineConfig({
    integrations: [simpleCriticalCss()],
});
```

## Manual setup

Install the package:

```bash
npm install @gezellig/astro-simple-critical-css
```

Add it to your Astro config:

```ts
import { defineConfig } from 'astro/config';
import simpleCriticalCss from '@gezellig/astro-simple-critical-css';

export default defineConfig({
    integrations: [simpleCriticalCss()],
});
```

## Configuration

There are a few options you can set, all are optional:

- `name`  
    Integration name used by Astro. Default: `astro-simple-critical-css`.
- `beastiesOptions`  
  Options passed to Beasties. See Beasties usage docs: https://github.com/danielroe/beasties?tab=readme-ov-file#usage
  Note: The `path` option will always be overridden by the integration.
- `globOptions`    
  Options passed to `fast-glob` when searching built HTML files. See fast-glob options docs: https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#options-3  
  Note: The `absolute` option is always set to `true`, as the integration relies on it.

### Example

```ts
export default defineConfig({
    integrations: [
        simpleCriticalCss({
            beastiesOptions: {
                preload: 'swap',
                fonts: true,
            },
        }),
    ],
});
```
