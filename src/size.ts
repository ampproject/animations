export interface Scale {
  x: number,
  y: number,
}

export interface Size {
  width: number,
  height: number,
}

/**
 * @param s1 The numerator Size.
 * @param s2 The denominator Size.
 * @return The Size s1 divided by the Size s2.
 */
export function divideSizes(s1: Size, s2: Size): Scale {
  return {
    x: s1.width / s2.width,
    y: s1.height / s2.height,
  };
}
