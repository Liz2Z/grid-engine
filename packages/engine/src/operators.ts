//
//
//
//
//
// JS 的位操作比较憨，当使用大于 32位 的值计算时，会直接丢弃超出32位部分的值
//
//
//
//
//

/**
 * 左移
 * @see https://www.cnblogs.com/Hziyang/p/16172234.html
 *
 * @param number
 * @param shift
 * @returns
 */
export const leftShift = (number: number, shift: number) => {
  // 左移运算符的限制：超出 32 位的值，自动丢弃
  // return number << shift;
  return number * 2 ** shift;
};

export const rightShift = (number: number, shift: number) => Math.floor(number / 2 ** shift);

const hi = 0x80000000;
const low = 0x7fffffff;

/**
 * 按位 与
 *
 * @see https://stackoverflow.com/questions/2983206/bitwise-and-in-javascript-with-a-64-bit-integer
 *
 * @param val1
 * @param val2
 * @returns
 */

export const bitWiseAnd = (v1: number, v2: number) => {
  const hi1 = ~~(v1 / hi);
  const hi2 = ~~(v2 / hi);
  const low1 = v1 & low;
  const low2 = v2 & low;
  const h = hi1 & hi2;
  const l = low1 & low2;
  return h * hi + l;
};

// export const bitWiseAnd = (val1: number, val2: number) => {
//   var shift = 0,
//     result = 0;
//   var mask = ~(~0 << 30); // Gives us a bit mask like 01111..1 (30 ones)
//   var divisor = 1 << 30; // To work with the bit mask, we need to clear bits at a time
//   while (val1 != 0 && val2 != 0) {
//     var rs = mask & val1 & (mask & val2);
//     val1 = Math.floor(val1 / divisor); // val1 >>> 30
//     val2 = Math.floor(val2 / divisor); // val2 >>> 30
//     for (var i = shift++; i--; ) {
//       rs *= divisor; // rs << 30
//     }
//     result += rs;
//   }
//   return result;
// };

// // Works with values up to 2^53
// function bitwiseAnd_53bit(value1, value2) {
//   const maxInt32Bits = 4294967296; // 2^32
//   const value1_highBits = value1 / maxInt32Bits;
//   const value1_lowBits = value1 % maxInt32Bits;
//   const value2_highBits = value2 / maxInt32Bits;
//   const value2_lowBits = value2 % maxInt32Bits;
//   return (value1_highBits & value2_highBits) * maxInt32Bits + (value1_lowBits & value2_lowBits);
// }

/**
 * 按位 或
 *
 * @see https://stackoverflow.com/questions/2983206/bitwise-and-in-javascript-with-a-64-bit-integer
 *
 * @param val1
 * @param val2
 * @returns
 */
export const bitWiseOr = (v1: number, v2: number) => {
  const hi1 = ~~(v1 / hi);
  const hi2 = ~~(v2 / hi);
  const low1 = v1 & low;
  const low2 = v2 & low;
  const h = hi1 | hi2;
  const l = low1 | low2;
  return h * hi + l;
};

/**
 * 按位 异或
 *
 * @see https://stackoverflow.com/questions/2983206/bitwise-and-in-javascript-with-a-64-bit-integer
 *
 * @param val1
 * @param val2
 * @returns
 */
export const bitWiseXOr = (v1: number, v2: number) => {
  const hi1 = ~~(v1 / hi);
  const hi2 = ~~(v2 / hi);
  const low1 = v1 & low;
  const low2 = v2 & low;
  const h = hi1 ^ hi2;
  const l = low1 ^ low2;
  return h * hi + l;
};
