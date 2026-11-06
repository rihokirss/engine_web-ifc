# web-ifc packaged for Structura

Version `0.0.79+structura.7` packages upstream `bbb34120` plus
[PR #2368](https://github.com/ThatOpen/engine_web-ifc/pull/2368), source commit
`d3c8cdddc6c6aa413d4616fe466213cde690635b`. Deep faceted difference chains keep their original
subtraction order in one normalization frame. Repeated triangulation retains
constraint vertices, and touching inner face bounds retain their containing face.
The previous cutter-face snapping fix is included in upstream.

Node, browser and multithreaded browser runtimes were built together with
Emscripten 4.0.23. Matched JavaScript, declarations and WASM are included;
install hooks and development dependencies are omitted. Provenance, dependency
revisions, validation and SHA-256 hashes are in `build-info.json`.

All 341 Jest tests, 29 native tests and 30 model regression checks pass.
The original 179.7 MB application model converts to Fragments in 51.3 seconds.
The stress mesh still has a residual closure error documented in the draft PR.

Pin the exact release commit. Existing stored Fragments geometry requires
IFC re-import to regenerate it. The engine reports version 0.0.79.
