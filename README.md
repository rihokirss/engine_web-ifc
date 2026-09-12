# web-ifc for Structura

Prebuilt from source commit `e3c1df8bed33c23947472e7bfadcb239a4327b95` (`codex/source-structura-3`).

Includes six measured performance changes and the PR follow-up fixes recorded in build-info.json.

Built with upstream npm run build-release, Emscripten 4.0.10, native WASM exceptions, SIMD and LTO. Node/browser bundles retain the existing single-thread selection, including on isolated pages. Native WebAssembly exception and SIMD support are required. The MT asset is included for export compatibility.

No install hooks or C++ toolchain are required. Pin the exact release commit. Re-import IFC files to apply geometry fixes to existing saved fragments.
