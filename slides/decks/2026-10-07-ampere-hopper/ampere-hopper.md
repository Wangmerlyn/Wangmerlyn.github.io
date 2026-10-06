---
theme: apple-basic
title: Ring Attention
colorSchema: light
highlighter: shiki
mdc: true
selectable: true
drawings:
  persist: false
  syncAll: true
fonts:
  sans: "JetBrains Mono, JetBrainsMono NF, Noto Sans Mono CJK SC"
  serif: "JetBrains Mono, JetBrainsMono NF, Noto Sans Mono CJK SC"
  mono: JetBrains Mono
  provider: none
themeConfig:
  primary: "#0071e3"
defaults:
  transition: slide-up
---

# Ampere

Tensor Core: D=A*B+C

---
transition: none
---

# Ampere Tensor Core from PTX

<PtxMmaDecl>

- **mma** Matrix Multiply-Accumulate
- **.sync** All threads in the warp execute together (warp sync)
- **.aligned** 32 threads in the warp must execute simultaneously; otherwise behavior is undefined
- **.m16n8k16** Tile size: M=16, N=8, K=16
- **.row.col** A is row-major, B is column-major
- **.f32.f16.f16.fp32** D / A / B / C: operands fp16, accumulate fp32

</PtxMmaDecl>

<DocsLinkCard
	href="https://docs.nvidia.com/cuda/parallel-thread-execution/#warp-level-matrix-instructions-mma"
	kicker="docs.nvidia.com · CUDA PTX ISA"
	title="Warp-level matrix instructions · mma"
>
Parallel Thread Execution spec for Ampere Tensor Core MMA
</DocsLinkCard>
