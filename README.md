# Upstream web-ifc packaged for Structura

Unmodified upstream `fd99f39784d2e7e92dde4de9903dafd4ba8544c2` from [official CI run 38133122300](https://github.com/ThatOpen/engine_web-ifc/actions/runs/38133122300). JavaScript, declarations and WASM match the build artifact byte-for-byte. Only packaging metadata, README and provenance differ.

Version `0.0.79+structura.5` identifies this package; the engine reports 0.0.79. Install hooks and development dependencies are omitted. Includes upstream PRs #2249 and #2250 (IFC4X3 surface-curve parameters and fixed-reference sweep orientation), #2254 (standalone IFC4X3 curve placements), and fast_float 8.3.2.

Pin the exact release SHA. Re-import existing IFC models to regenerate saved fragment geometry. Separate performance experiments are not included.
