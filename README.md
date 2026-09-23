# Upstream web-ifc packaged for Structura

Unmodified engine from upstream commit `187b9690d8394849dc7dee32ca2d5991ae23bd38`, built by the successful official CI run [35845485226](https://github.com/ThatOpen/engine_web-ifc/actions/runs/35845485226). All JavaScript, declarations and WASM files are copied byte-for-byte from that build artifact. No custom performance patches or bundler defines are applied.

Only npm packaging metadata, this README and build provenance differ. Version `0.0.79+structura.1` identifies this package; the engine reports 0.0.79. Install hooks and devDependencies are omitted so installation requires no compiler.

WASM build optimizations and mapped-representation caching already merged upstream remain included. Remaining fork performance changes are preserved separately on codex/performance and are not used by this package. Pin the exact release SHA and re-import IFC models to regenerate saved fragments.
