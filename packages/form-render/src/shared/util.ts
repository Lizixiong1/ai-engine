import { ControlType } from "@/typings";
import { set, get } from "lodash-es";
import { NOT_ALLOWED_CHILD_TYPE } from "./common";

export const _set = set;

export const _get = get;

export const notAllowChildType = (type: ControlType) =>
  NOT_ALLOWED_CHILD_TYPE.includes(type);

interface LeafNode {
  value: any;
  pathName: string[];
}
export function findLeafNodes<T extends object>(
  obj: T,
  parentPath: string[] = []
): Array<LeafNode> {
  const results: Array<LeafNode> = [];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key];

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      // 如果是对象，递归查找
      results.push(...findLeafNodes(value, currentPath));
    } else {
      // 如果不是对象，就是叶子节点
      results.push({ value, pathName: currentPath });
    }
  }

  return results;
}
