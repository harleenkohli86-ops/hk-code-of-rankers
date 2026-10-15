// Production launcher.
// The authoritative backend is server.ts, bundled by `npm run build` to dist/server.cjs.
// This file exists only for hosts that expect a root server.js entry point.
import './dist/server.cjs';
