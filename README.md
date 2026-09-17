# web-ifc for Structura

Prebuilt from source `4476ec6b7a4afd390cce6e50ef3603409a24cdfc` on `codex/source-structura`, based on upstream `3e5bc8c6ee82fee8903f8393a91b2a4027f54377`.

Already merged fixes come directly from upstream. The remaining fork commits retain malformed-input handling (#2151), six performance optimizations, optimized WASM compilation and pinned C++ dependencies. Exact revisions are recorded in build-info.json.

Built with Emscripten 4.0.23, native WASM exceptions, SIMD and LTO. Node/browser bundles use the single-thread runtime, including on isolated pages. Native WebAssembly exception and SIMD support are required. The MT asset remains included for export compatibility.

No install hooks or C++ toolchain are required. Pin the exact release commit. Re-import IFC files to regenerate existing saved fragments.
