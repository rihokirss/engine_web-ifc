# web-ifc for Structura

Prebuilt web-ifc from `rihokirss/engine_web-ifc`, source commit `e1ace6c7761fcc63ce133604feac9c73e85c3a47`.

Includes the Node, browser and multithreaded WASM assets and matching JavaScript APIs. This Structura build disables automatic multithread selection with the esbuild define `self.crossOriginIsolated=false`, avoiding the upstream #2068 worker bootstrap failure. The API uses the tested single-thread runtime in both ordinary and cross-origin-isolated browsers. No C++ toolchain is required when installing this package. See `build-info.json` for source and binary hashes.

The source branch contains the pending upstream fixes and their regression cases. Package consumers should pin an exact release commit.
