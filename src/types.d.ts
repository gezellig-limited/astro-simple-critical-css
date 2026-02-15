interface Options {
    allowRules?: string[];
    beastiesOptions?: Partial<Beasties.Options>;
    globOptions?: fastGlob.Options;
    name?: string;
}

interface InlineCriticalCssOptions {
    name?: string;
    allowRules?: Array<string | RegExp>;
    beastiesOptions?: Partial<BeastieOptions>;
    globOptions?: FastGlobOptions;
}
