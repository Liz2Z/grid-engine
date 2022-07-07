/**
 * 遍历对象
 *
 * */
export default function entriesObject(
  object: { [key: string]: any },
  callback: (key: string, value: any) => void
) {
  if (!object) {
    return;
  }
  Object.entries(object).forEach(([key, value]) => {
    callback(key, value);
  });
}
