import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const picomatch = require('picomatch') as (
  glob: string | string[],
  options?: Record<string, unknown>,
) => (input: string) => boolean;

export default picomatch;
