# web-ifc packaged for Structura

Engine from fork commit `768dac6a4b6751462cd76d988eaf32c35a17c151` on `codex/structura-fixes`: upstream main `cbc1b92f71b37005426f4919276f17e5c4d8f667` (which already contains ThatOpen/engine_web-ifc#2220 and #2221) plus one fork fix not yet upstream: correct first-edge handling when trimming swept-disk IfcIndexedPolyCurve directrices by length (#2203). Built locally with emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 4.0.23 (7a5d93b50f6a3a35e85a0d2fc9e667b8498e6aed), the Emscripten version used by upstream CI; see `build-info.json` for commits and checksums.

Version `0.0.79+structura.3` identifies this package; the engine reports 0.0.79. Install hooks and devDependencies are omitted so installation requires no compiler. Pin the exact release SHA and re-import IFC models to regenerate saved fragments.
