import type { AstroIntegration } from 'astro';
import Beasties, { type Options as BeastieOptions } from 'beasties';
import fastGlob, { type Options as FastGlobOptions } from 'fast-glob';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface InlineCriticalCssOptions {
    name?: string;
    allowRules?: Array<string | RegExp>;
    beastiesOptions?: Partial<BeastieOptions>;
    globOptions?: FastGlobOptions;
}

const baseBeastiesOptions: BeastieOptions = {
    fonts: true,
    mergeStylesheets: false,
    pruneSource: false,
    logLevel: 'silent',
};

const baseGlobOptions: FastGlobOptions = {
    absolute: true,
};

export default function inlineCriticalCss(
    options: InlineCriticalCssOptions = {}
): AstroIntegration {
    const allowRules = options.allowRules;

    const beastiesOptions: BeastieOptions = {
        ...baseBeastiesOptions,
        ...options.beastiesOptions,
        ...(allowRules !== undefined ? { allowRules } : {}),
    };

    const globOptions: FastGlobOptions = {
        ...baseGlobOptions,
        ...options.globOptions,
    };

    return {
        name: options.name ?? 'astro-simple-critical-css',
        hooks: {
            'astro:build:done': async ({ dir }: { dir: URL | string }) => {
                const cwd = typeof dir === 'string' ? dir : fileURLToPath(dir);
                const htmlFiles = await fastGlob('**/*.html', {
                    cwd,
                    ...globOptions,
                });

                for (const file of htmlFiles) {
                    const html = await readFile(file, 'utf8');
                    const beasties = new Beasties({
                        ...beastiesOptions,
                        path: dirname(file),
                    });
                    const criticalHtml = await beasties.process(html);
                    console.log(`Inlined critical CSS for ${file}`);
                    await writeFile(file, criticalHtml, 'utf8');
                }
            },
        },
    };
}
