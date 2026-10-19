# Upstream web-ifc packaged for Structura

Upstream `main` `dd44aa77e770d2584b6d4095dec0d89f4a4cf6d0` plus one fix commit, `002f02e192c0859e1827e26085cafb0dec7edbf4` on `codex/pr-snap-flush-cutter-faces`. The fix snaps cutter faces that lie a fraction of a millimetre off a parallel operand face onto that face before boolean differences (openings misaligned by 0.02–0.14 mm, issue #2269).

Built locally with Emscripten 4.0.23, the version upstream CI uses. JavaScript and declarations are byte-for-byte identical to the 0.0.79+structura.5 package, which was the official CI artifact of upstream `fd99f397`; only the three WASM binaries differ. Hashes and provenance are in `build-info.json`.

Version `0.0.79+structura.6` identifies this package; the engine reports 0.0.79. Install hooks and development dependencies are omitted.

Pin the exact release SHA. Re-import existing IFC models to regenerate saved fragment geometry. Separate performance experiments are not included.
