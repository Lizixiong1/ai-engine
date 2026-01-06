// Zustand 中的实际实现（简化版）
export function shallow(objA: any, objB: any) {
  // 1. 同一引用，直接返回 true
  if (Object.is(objA, objB)) {
    return true;
  }

  // 2. 检查是否为对象（包括数组）
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  // 3. 检查对象的键数量
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // 4. 浅层比较每个键的值（只比较引用，不递归深入）
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];

    // 检查 key 是否存在
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }

    // 关键：这里只比较引用相等，不进行深度比较
    if (!Object.is(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}
