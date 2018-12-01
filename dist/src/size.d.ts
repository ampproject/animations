export interface Scale {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
/**
 * @param s1 The numerator Size.
 * @param s2 The denominator Size.
 * @return A Scale with the x factor being equal to the width of s1 / width of
 *    s2 and the y factor being equal to the height of s1 / height of s2.
 */
export declare function divideSizes(s1: Size, s2: Size): Scale;
