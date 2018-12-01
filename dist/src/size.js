/**
 * @param s1 The numerator Size.
 * @param s2 The denominator Size.
 * @return A Scale with the x factor being equal to the width of s1 / width of
 *    s2 and the y factor being equal to the height of s1 / height of s2.
 */
export function divideSizes(s1, s2) {
    return {
        x: s1.width / s2.width,
        y: s1.height / s2.height,
    };
}
//# sourceMappingURL=size.js.map