# web-ifc packaged for Structura

Engine from fork commit `3d5ff6440041e38e41e1ba50a4a4ce9ea2704b02` on `codex/structura-fixes`: upstream main `98436dd1eae57ecc9f3b1a5f501daca1d4453fc4` plus the fixes from the open pull requests [#2220](https://github.com/ThatOpen/engine_web-ifc/pull/2220) (CSG robustness on thin wall layers with openings) and [#2221](https://github.com/ThatOpen/engine_web-ifc/pull/2221) (swept-disk StartParam/EndParam on composite curves and with rounding noise). Built locally with emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 4.0.23 (7a5d93b50f6a3a35e85a0d2fc9e667b8498e6aed), the Emscripten version used by upstream CI; see `build-info.json` for commits and checksums.

Version `0.0.79+structura.3` identifies this package; the engine reports 0.0.79. Install hooks and devDependencies are omitted so installation requires no compiler. Pin the exact release SHA and re-import IFC models to regenerate saved fragments.
