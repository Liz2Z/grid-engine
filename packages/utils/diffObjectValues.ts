/**
 * 将两个对象的属性值做浅比较，要求两个对象属性个数要相同
 *
 * */
export default function diffObjectValues(prev: { [key: string]: any }, cur: { [key: string]: any }) {
  try {
    return Object.entries(prev).some(([key, value]) => cur[key] !== value);
  } catch (err) {
    return true;
  }
}
