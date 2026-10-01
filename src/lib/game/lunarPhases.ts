const DEG = Math.PI / 180;
const DAY_MS = 86_400_000;
const JD_UNIX_EPOCH = 2440587.5;
const DELTA_T_MS = 69_000;
const EPOCH_JDE = 2451550.09766;
export const MEAN_LUNATION_DAYS = 29.530588861;

type Term = readonly [coefficient: number, ePower: 0 | 1 | 2, m: number, mp: number, f: number];

const SHARED_TAIL: readonly Term[] = [
  [-0.00007, 0, 2, 1, 0],
  [0.00004, 0, 0, 2, -2],
  [0.00004, 0, 3, 0, 0],
  [0.00003, 0, 1, 1, -2],
  [0.00003, 0, 0, 2, 2],
  [-0.00003, 0, 1, 1, 2],
  [0.00003, 0, -1, 1, 2],
  [-0.00002, 0, -1, 1, -2],
  [-0.00002, 0, 1, 3, 0],
  [0.00002, 0, 0, 4, 0],
];

const NEW_MOON_TERMS: readonly Term[] = [
  [-0.4072, 0, 0, 1, 0],
  [0.17241, 1, 1, 0, 0],
  [0.01608, 0, 0, 2, 0],
  [0.01039, 0, 0, 0, 2],
  [0.00739, 1, -1, 1, 0],
  [-0.00514, 1, 1, 1, 0],
  [0.00208, 2, 2, 0, 0],
  [-0.00111, 0, 0, 1, -2],
  [-0.00057, 0, 0, 1, 2],
  [0.00056, 1, 1, 2, 0],
  [-0.00042, 0, 0, 3, 0],
  [0.00042, 1, 1, 0, 2],
  [0.00038, 1, 1, 0, -2],
  [-0.00024, 1, -1, 2, 0],
  ...SHARED_TAIL,
];

const FULL_MOON_TERMS: readonly Term[] = [
  [-0.40614, 0, 0, 1, 0],
  [0.17302, 1, 1, 0, 0],
  [0.01614, 0, 0, 2, 0],
  [0.01043, 0, 0, 0, 2],
  [0.00734, 1, -1, 1, 0],
  [-0.00515, 1, 1, 1, 0],
  [0.00209, 2, 2, 0, 0],
  [-0.00111, 0, 0, 1, -2],
  [-0.00057, 0, 0, 1, 2],
  [0.00056, 1, 1, 2, 0],
  [-0.00042, 0, 0, 3, 0],
  [0.00042, 1, 1, 0, 2],
  [0.00038, 1, 1, 0, -2],
  [-0.00024, 1, -1, 2, 0],
  ...SHARED_TAIL,
];

const QUARTER_TERMS: readonly Term[] = [
  [-0.62801, 0, 0, 1, 0],
  [0.17172, 1, 1, 0, 0],
  [-0.01183, 1, 1, 1, 0],
  [0.00862, 0, 0, 2, 0],
  [0.00804, 0, 0, 0, 2],
  [0.00454, 1, -1, 1, 0],
  [0.00204, 2, 2, 0, 0],
  [-0.0018, 0, 0, 1, -2],
  [-0.0007, 0, 0, 1, 2],
  [-0.0004, 0, 0, 3, 0],
  [-0.00034, 1, -1, 2, 0],
  [0.00032, 1, 1, 0, 2],
  [0.00032, 1, 1, 0, -2],
  [-0.00028, 2, 2, 1, 0],
  [0.00027, 1, 1, 2, 0],
  [-0.00005, 0, -1, 1, -2],
  [0.00004, 0, 0, 2, 2],
  [-0.00004, 0, 1, 1, 2],
  [0.00004, 0, -2, 1, 0],
  [0.00003, 0, 1, 1, -2],
  [0.00003, 0, 3, 0, 0],
  [0.00002, 0, 0, 2, -2],
  [0.00002, 0, -1, 1, 2],
  [-0.00002, 0, 1, 3, 0],
];

const PLANETARY: readonly (readonly [base: number, rate: number, t2: number, coefficient: number])[] = [
  [299.77, 0.107408, -0.009173, 0.000325],
  [251.88, 0.016321, 0, 0.000165],
  [251.83, 26.651886, 0, 0.000164],
  [349.42, 36.412478, 0, 0.000126],
  [84.66, 18.206239, 0, 0.00011],
  [141.74, 53.303771, 0, 0.000062],
  [207.14, 2.453732, 0, 0.00006],
  [154.84, 7.30686, 0, 0.000056],
  [34.52, 27.261239, 0, 0.000047],
  [207.19, 0.121824, 0, 0.000042],
  [291.34, 1.844379, 0, 0.00004],
  [161.72, 24.198154, 0, 0.000037],
  [239.56, 25.513099, 0, 0.000035],
  [331.55, 3.592518, 0, 0.000023],
];

function sumTerms(terms: readonly Term[], e: number, m: number, mp: number, f: number): number {
  let sum = 0;
  for (const [coefficient, ePower, a, b, c] of terms) {
    sum += coefficient * e ** ePower * Math.sin((a * m + b * mp + c * f) * DEG);
  }
  return sum;
}

export function phaseInstant(k: number): Date {
  const quarter = Math.round((k - Math.floor(k)) * 4) % 4;
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  const meanJde = EPOCH_JDE + MEAN_LUNATION_DAYS * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
  const e = 1 - 0.002516 * T - 0.0000074 * T2;
  const m = 2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3;
  const mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4;
  const f = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4;
  const omega = 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3;

  let correction = -0.00017 * Math.sin(omega * DEG);
  if (quarter === 0) correction += sumTerms(NEW_MOON_TERMS, e, m, mp, f);
  else if (quarter === 2) correction += sumTerms(FULL_MOON_TERMS, e, m, mp, f);
  else {
    const w =
      0.00306 -
      0.00038 * e * Math.cos(m * DEG) +
      0.00026 * Math.cos(mp * DEG) -
      0.00002 * Math.cos((mp - m) * DEG) +
      0.00002 * Math.cos((mp + m) * DEG) +
      0.00002 * Math.cos(2 * f * DEG);
    correction += sumTerms(QUARTER_TERMS, e, m, mp, f) + (quarter === 1 ? w : -w);
  }

  for (const [base, rate, t2, coefficient] of PLANETARY) {
    correction += coefficient * Math.sin((base + rate * k + t2 * T2) * DEG);
  }

  return new Date((meanJde + correction - JD_UNIX_EPOCH) * DAY_MS - DELTA_T_MS);
}

export function lunationAt(instant: Date): number {
  const jd = instant.getTime() / DAY_MS + JD_UNIX_EPOCH;
  let k = Math.floor((jd - EPOCH_JDE) / MEAN_LUNATION_DAYS);
  while (phaseInstant(k) > instant) k -= 1;
  while (phaseInstant(k + 1) <= instant) k += 1;
  return k;
}
