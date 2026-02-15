import type { AstroIntegration } from 'astro';
import Beasties, { type Options as BeastieOptions } from 'beasties';
import fastGlob, { type Options as FastGlobOptions } from 'fast-glob';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseBeastiesOptions: BeastieOptions = {
    logLevel: 'info',
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

    let output: string;

    return {
        name: options.name ?? 'astro-simple-critical-css',
        hooks: {
            'astro:config:done': async ({ buildOutput }) => {
                output = buildOutput;
            },
            'astro:build:done': async ({ dir, logger }) => {
                if (output === 'server') {
                    logger.warn(
                        'Output is set to "server". Critical CSS inlining is not tested or supported. Continuing anyway...'
                    );
                }

                const cwd = fileURLToPath(dir);
                const htmlFiles = await fastGlob('**/*.html', {
                    cwd: cwd,
                    ...globOptions,
                });

                if (htmlFiles.length === 0) {
                    logger.warn(
                        'No HTML files found. Critical CSS inlining skipped.'
                    );
                    return;
                }

                const beasties = new Beasties({
                    ...{ logger },
                    ...beastiesOptions,
                    path: cwd,
                });
                for (const file of htmlFiles) {
                    const html = await readFile(file, 'utf8');
                    logger.info(`Processing ${file}...`);
                    const criticalHtml = await beasties.process(html);
                    await writeFile(file, criticalHtml, 'utf8');
                }
            },
        },
    };
}
