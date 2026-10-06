// A deliberately small, deterministic single-head example. The UI's sequence
// length controls the partition diagram, not the size of this numeric fixture.
export function ownerAtRound(device, round, devices) {
  return ((device - round) % devices + devices) % devices
}

export function partition(length, devices, device) {
  return [Math.floor(device * length / devices), Math.floor((device + 1) * length / devices)]
}

export function makeExample(devices, tokensPerDevice = 2, dimension = 4) {
  const vector = (index, phase) => Array.from({ length: dimension }, (_, d) =>
    Math.sin((index + 1) * (d + 1) * 0.63 + phase) * 1.7)
  const size = devices * tokensPerDevice
  return {
    q: Array.from({ length: size }, (_, i) => vector(i, 0.2)),
    k: Array.from({ length: size }, (_, i) => vector(i, 1.4)),
    v: Array.from({ length: size }, (_, i) => vector(i, 2.8)),
    tokensPerDevice,
    dimension,
  }
}

export function scoresForBlock(example, queryIndex, block, causal = false) {
  const start = block * example.tokensPerDevice
  return Array.from({ length: example.tokensPerDevice }, (_, i) => {
    const keyIndex = start + i
    return causal && keyIndex > queryIndex ? -Infinity :
      example.q[queryIndex].reduce((sum, q, d) => sum + q * example.k[keyIndex][d], 0) / Math.sqrt(example.dimension)
  })
}

export function emptyAccumulator(dimension) {
  return { m: -Infinity, l: 0, u: Array(dimension).fill(0), o: Array(dimension).fill(0) }
}

// Stable online softmax; u is the unnormalized weighted value sum.
// Fully masked blocks contribute nothing and must not cause exp(-∞ - -∞).
export function mergeBlock(state, scores, values) {
  const blockMax = Math.max(...scores)
  if (blockMax === -Infinity) return state
  const m = Math.max(state.m, blockMax)
  const alpha = state.l === 0 ? 0 : Math.exp(state.m - m)
  const weights = scores.map(s => Math.exp(s - m))
  const l = alpha * state.l + weights.reduce((a, b) => a + b, 0)
  const u = state.u.map((value, d) => alpha * value +
    weights.reduce((sum, weight, i) => sum + weight * values[i][d], 0))
  return { m, l, u, o: u.map(value => value / l) }
}

export function accumulate(example, device, rounds, devices, causal = false, localRow = 0) {
  const queryIndex = device * example.tokensPerDevice + localRow
  let state = emptyAccumulator(example.dimension)
  for (let round = 0; round < rounds; round++) {
    const block = ownerAtRound(device, round, devices)
    const start = block * example.tokensPerDevice
    state = mergeBlock(state, scoresForBlock(example, queryIndex, block, causal),
      example.v.slice(start, start + example.tokensPerDevice))
  }
  return state
}

// Independent dense reference: normalize over the entire query row at once.
export function denseAttention(example, queryIndex, causal = false) {
  const scores = example.k.map((key, i) => causal && i > queryIndex ? -Infinity :
    key.reduce((sum, k, d) => sum + k * example.q[queryIndex][d], 0) / Math.sqrt(example.dimension))
  const max = Math.max(...scores)
  const weights = scores.map(score => Math.exp(score - max))
  const sum = weights.reduce((a, b) => a + b, 0)
  return Array.from({ length: example.dimension }, (_, d) =>
    weights.reduce((total, weight, i) => total + weight * example.v[i][d], 0) / sum)
}
