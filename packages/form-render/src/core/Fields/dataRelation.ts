import Path from "@/core/Path";
import { DataBinding, Field } from "@/typings";
import Fields from "./index";

interface FieldDependency {
  effectFieldPathName: string[];
  dependencies: string[];
  binding: DataBinding;
}

class DataRelation {
  private dependenciesMap: Map<string, FieldDependency[]> = new Map();
  private fieldsInstance: Fields;

  constructor(fieldsInstance: Fields) {
    this.fieldsInstance = fieldsInstance;
  }
  /**
   * 注册字段依赖关系
   * @param fieldPath 字段路径
   * @param field 当前字段定义
   */
  registerFieldDependencies(pathName: string[], field: Field) {
    // 如果字段有绑定配置，注册依赖关系
    if (field.control?.binding) {
      const dependencies = this.extractDependencies(field.control.binding);
      const fieldDep: FieldDependency = {
        effectFieldPathName: pathName,
        dependencies,
        binding: field.control.binding,
      };

      dependencies.forEach((depPath) => {
        if (!this.dependenciesMap.has(depPath)) {
          this.dependenciesMap.set(depPath, []);
          const listeners = this.dependenciesMap.get(depPath)!;
          // 避免重复添加
          if (
            !listeners.some(
              (listener) =>
                Path.parse(listener.effectFieldPathName) ===
                Path.parse(pathName),
            )
          ) {
            listeners.push(fieldDep);
          }
        }
      });
    }
  }
  /**
   * 提取绑定配置中的依赖字段路径
   * @param binding 数据绑定配置
   * @returns 依赖字段路径数组
   */
  private extractDependencies(binding: DataBinding) {
    const dependencies: string[] = [];

    if (binding.static && Array.isArray(binding.static)) {
      binding.static.forEach((item) => {
        if (
          typeof item === "string" &&
          item.startsWith("{{") &&
          item.endsWith("}}")
        ) {
          // 提取 {{fieldName}} 格式的依赖
          // {{ a.a }}
          const fieldName = item.substring(2, item.length - 2);
          dependencies.push(fieldName);
        }
      });
    }
    // 从异步请求参数中提取依赖
    if (binding.async?.params) {
      Object.values(binding.async.params).forEach((param) => {
        if (typeof param === "function") {
          // 函数类型的参数可能依赖上下文中的数据
          // 这里可以扩展更复杂的依赖分析逻辑
        } else if (
          typeof param === "string" &&
          param.startsWith("{{") &&
          param.endsWith("}}")
        ) {
          // 提取 {{fieldName}} 格式的依赖
          const fieldName = param.substring(2, param.length - 2);
          dependencies.push(fieldName);
        }
      });
    }

    // 从可见性条件中提取依赖
    if (binding.visible) {
      // dependencies.push(...binding.visible.map((item) => item.field));
      dependencies.push(binding.visible.field);
    }

    return dependencies;
  }

  /**
   * 当某个字段值发生变化时触发联动更新
   * @param changedPath 发生变化的字段路径
   * @param newValue 新值
   */
  triggerDependencyUpdates(changedPath: Path, newValue: any) {
    const dependentFields = this.dependenciesMap.get(changedPath.key);

    if (!dependentFields) {
      return;
    }
    dependentFields.forEach((fieldDep) => {
      const fieldPath = Path.getPath(fieldDep.effectFieldPathName);
      this.updateFieldByBinding(fieldPath, fieldDep.binding);
    });
  }
  /**
   * 根据绑定配置更新字段
   * @param fieldPath 字段路径
   * @param binding 绑定配置
   * @param allValues 所有字段的当前值
   */
  private updateFieldByBinding(fieldPath: Path, binding: DataBinding) {
    // 处理可见性控制
    if (binding.visible) {
      this.handleVisibility(fieldPath, binding.visible);
    }

    // 处理异步数据绑定
    if (binding.async) {
      this.handleAsyncBinding(fieldPath, binding.async);
    }
    // 处理静态数据绑定
    else if (binding.static) {
      this.handleStaticBinding(fieldPath, binding.static);
    }
  }

  initialSetVisible(
    fieldPath: Path,
    visibleConfig?: Required<DataBinding>["visible"],
  ) {
    const result = this.handleVisibility(fieldPath, visibleConfig);
    return typeof result === "boolean" ? result : true;
  }
  /**
   * 处理字段可见性
   * @param fieldPath 字段路径
   * @param visibleConfig 可见性配置
   * @param allValues 所有字段值
   */
  private handleVisibility(
    fieldPath: Path,
    visibleConfig?: Required<DataBinding>["visible"],
  ) {
    if (!visibleConfig || !this.fieldsInstance) {
      return;
    }

    const {
      field: dependencyField,
      value: expectedValue,
      operator = "==",
    } = visibleConfig;
    const dependencyValue = this.fieldsInstance.getValue(dependencyField);
    let isVisible = true;

    switch (operator) {
      case "==":
        isVisible = dependencyValue == expectedValue;
        break;
      case "!=":
        isVisible = dependencyValue != expectedValue;
        break;
      case ">":
        isVisible = dependencyValue > expectedValue;
        break;
      case "<":
        isVisible = dependencyValue < expectedValue;
        break;
      case ">=":
        isVisible = dependencyValue >= expectedValue;
        break;
      case "<=":
        isVisible = dependencyValue <= expectedValue;
        break;
      case "includes":
        isVisible =
          Array.isArray(dependencyValue) &&
          dependencyValue.includes(expectedValue);
        break;
      case "excludes":
        isVisible =
          Array.isArray(dependencyValue) &&
          !dependencyValue.includes(expectedValue);
        break;
      default:
        isVisible = dependencyValue == expectedValue;
    }

    // 更新字段可见性状态（这里可能需要根据具体UI实现调整）
    // 暂时记录到模型中
    const model = this.fieldsInstance.models.get(fieldPath);
    if (model) {
      model.isVisible = isVisible;
    }
    return isVisible;
  }

  /**
   * 处理异步数据绑定
   * @param fieldPath 字段路径
   * @param asyncConfig 异步配置
   * @param allValues 所有字段值
   */
  private async handleAsyncBinding(
    fieldPath: Path,
    asyncConfig: Required<DataBinding>["async"],
  ) {
    if (!asyncConfig || !this.fieldsInstance) {
      return;
    }

    // 解析参数中的动态值
    const resolvedParams: Record<string, any> = {};
    const values = this.fieldsInstance.getValues();
    if (asyncConfig.params) {
      for (const [key, value] of Object.entries(asyncConfig.params)) {
        if (typeof value === "function") {
          resolvedParams[key] = value(values);
        } else if (
          typeof value === "string" &&
          value.startsWith("{{") &&
          value.endsWith("}}")
        ) {
          const fieldName = value.substring(2, value.length - 2);
          resolvedParams[key] = this.fieldsInstance.getValue(fieldName);
        } else {
          resolvedParams[key] = value;
        }
      }
    }

    try {
      // 构造请求URL
      let url = asyncConfig.url;
      // 简单处理URL中的参数替换，例如 /api/users/{{userId}}
      const urlMatches = url.match(/\{\{([^}]+)\}\}/g);
      if (urlMatches) {
        urlMatches.forEach((match) => {
          const fieldName = match.substring(2, match.length - 2);
          url = url.replace(
            match,
            this.fieldsInstance.getValue(fieldName) || "",
          );
        });
      }

      // 发起请求
      const response = await fetch(url, {
        method: asyncConfig.method || "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          asyncConfig.method !== "GET"
            ? JSON.stringify(resolvedParams)
            : undefined,
      });

      if (response.ok) {
        let data = await response.json();

        // 应用转换函数
        if (asyncConfig.transform) {
          data = asyncConfig.transform(data);
        }

        // 更新字段选项或值
        this.updateFieldData(fieldPath, data);
      }
    } catch (error) {
      console.error(`Error in async binding for field ${fieldPath}:`, error);
    }
  }

  /**
   * 处理静态数据绑定
   * @param fieldPath 字段路径
   * @param staticData 静态数据
   * @param allValues 所有字段值
   */
  private handleStaticBinding(
    fieldPath: Path,
    staticData: Required<DataBinding>["static"],
  ) {
    if (!staticData || !this.fieldsInstance) {
      return;
    }

    // 解析静态数据中的动态值
    const resolvedData = staticData.map((item) => {
      if (
        typeof item === "string" &&
        item.startsWith("{{") &&
        item.endsWith("}}")
      ) {
        const fieldName = item.substring(2, item.length - 2);
        return this.fieldsInstance.getValue(fieldName);
      }
      return item;
    });

    // 更新字段数据
    this.updateFieldData(fieldPath, resolvedData);
  }

  /**
   * 更新字段数据
   * @param fieldPath 字段路径
   * @param data 新数据
   */
  private updateFieldData(fieldPath: Path, data: any) {
    if (!this.fieldsInstance) {
      return;
    }

    // 更新字段的选项或值
    const fieldItem = this.fieldsInstance.items.get(fieldPath);
    if (fieldItem) {
      // 对于选择类控件，通常是更新props

      // 触发字段更新
      fieldItem.forceUpdate();
    }
  }

  /**
   * 清除特定字段的依赖关系
   * @param fieldPath 字段路径
   */
  removeFieldDependencies(pathName: string[]) {
    // 从依赖映射中移除该字段
    for (const [depPath, listeners] of this.dependenciesMap.entries()) {
      const filteredListeners = listeners.filter(
        (listener) =>
          Path.parse(listener.effectFieldPathName) === Path.parse(pathName),
      );
      if (filteredListeners.length === 0) {
        this.dependenciesMap.delete(depPath);
      } else {
        this.dependenciesMap.set(depPath, filteredListeners);
      }
    }
  }

  /**
   * 清空所有依赖关系
   */
  clearAllDependencies() {
    this.dependenciesMap.clear();
  }
}

export default DataRelation;
