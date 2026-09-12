# web-ifc for Structura

Prebuilt from source commit `614a95ca86448b05d1bf93ffe2df832736a034f2`.

Built with the existing upstream `npm run build-release` pipeline and `WEB_IFC_WASM_NATIVE_EXCEPTIONS=ON`. Native WebAssembly exceptions and SIMD support are required. C++ exception recovery remains enabled.

Includes matching Node and browser ESM/IIFE APIs, declarations and all three WASM assets. API bundles select the single-thread runtime even on isolated pages to avoid the existing worker bootstrap issue. The multithread asset remains available for export compatibility.

No npm lifecycle hooks or C++ toolchain are required on installation. Pin the exact release commit; see build-info.json for build provenance and hashes.
