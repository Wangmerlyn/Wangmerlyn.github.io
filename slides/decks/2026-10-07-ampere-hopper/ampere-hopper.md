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
layout: statement
---
# Ampere

Tensor Core: D=A*B+C
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

---

# MMA vs FFMA arithmetic intensity

$$
\mathrm{FLOPs} = 2MNK = 2 \times 16 \times 8 \times 16 = 4096
$$

| | `mma.m16n8k16` | `ffma` (CUDA core) |
| --- | ---: | ---: |
| MACs | $16\times 8\times 16 = 2048$ | 1 |
| FLOPs | 4096 | 2 |
| read | A $512$ + B $256$ | a, b, c $\rightarrow 12$ B |
| write | D $16\times 8\times 4 = 512$ B | d $\rightarrow 4$ B |
| traffic | **1280 B** | **16 B** |
| Arithmetic Intensity | $4096/1280 = \mathbf{3.2}$ | $2/16 = \mathbf{0.125}$ |

$3.2 / 0.125 = 26$: one MMA does $26\times$ the work per byte of a scalar FMA.

---

# Preparing operands for MMA

Total number of elements: D 128, A 256, B 128, shared by 32 threads

One register is 32 bit, so two fp16 elements are packed into one register.

Elements are loaded in a layout called fragments.

<DocsLinkCard
	href="https://docs.nvidia.com/cuda/parallel-thread-execution/#mma-16816-a-f16"
	kicker="docs.nvidia.com · CUDA PTX ISA · Figure 82"
	title="MMA .m16n8k16 fragment layout for matrix A with .f16 / .bf16"
	image="./mma-16816-A-f16.png"
	image-alt="Figure 82. MMA m16n8k16 fragment layout for matrix A, f16 / bf16"
/>

---

# Fragment loading pattern

Manually calculating the fragment loading pattern is tedious; `ldmatrix` lets the hardware do the work.

<PtxMmaDecl>

- **ldmatrix** Collectively load matrices from shared memory into registers for MMA
- **.sync** All threads in the warp execute together (warp sync)
- **.aligned** 32 threads in the warp must execute simultaneously; otherwise behavior is undefined
- **.m8n8** Each matrix is 8×8
- **.x4** Load four matrices; each thread receives four 32-bit registers
- **.b16** 16-bit elements (fp16 / bf16)

</PtxMmaDecl>

<DocsLinkCard
	href="https://docs.nvidia.com/cuda/parallel-thread-execution/#warp-level-matrix-instructions-ldmatrix"
	kicker="docs.nvidia.com · CUDA PTX ISA"
	title="Warp-level matrix instructions · ldmatrix"
>
Collective load of .m8n8.b16 matrices from shared memory
</DocsLinkCard>

---

# Bank conflicts · row stride 32 B

32 banks × 4 B = **128 B/cycle**. `ldmatrix.x4` = 32 × 16 B = **512 B** → optimal **4 cycles**. One `.m8n8` row is 16 B = 4 banks; `.x4` loads the left and right 8×8 on the same smem row, so **32 B fills 8 banks**. Stride 32 B packs those 32 B rows back-to-back.

<SmemBankAccess :stride="32" />

All 32 banks are used equally → **4 cycles**.

---

# Bank conflicts · row stride 128 B

Stride 128 B: each 32 B row still occupies 8 banks, but the next row starts 128 B later (`128 / 4 ≡ 0`), so it lands on the same banks 0–7.

<SmemBankAccess :stride="128" />

**16-way → 16 cycles.** Swizzle shifts each 32 B row onto a different start bank.
