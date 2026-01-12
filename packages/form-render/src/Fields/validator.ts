import { Rule, Context } from '../typings';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

class Validator {
  constructor() {}

  /**
   * 校验单个值是否符合规则
   * @param value 要校验的值
   * @param rules 校验规则数组
   * @param context 上下文信息
   * @returns 校验结果
   */
  async validate(value: any, rules: Rule[] = [], context: Context = {}): Promise<ValidationResult> {
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      return { isValid: true };
    }

    for (const rule of rules) {
      // 如果有条件，则先判断条件是否满足
      if (rule.condition && typeof rule.condition === 'function') {
        if (!rule.condition(context)) {
          continue; // 条件不满足时跳过此规则
        }
      }

      // 执行校验
      const result = await this.validateRule(value, rule, context);
      
      if (!result.isValid) {
        return result;
      }
    }

    return { isValid: true };
  }

  /**
   * 校验单个规则
   * @param value 要校验的值
   * @param rule 校验规则
   * @param context 上下文信息
   * @returns 校验结果
   */
  private async validateRule(value: any, rule: Rule, context: Context): Promise<ValidationResult> {
    // 必填校验
    if (rule.required) {
      if (value === undefined || value === null || value === '') {
        return {
          isValid: false,
          errorMessage: rule.message || '此字段为必填项'
        };
      }
    }

    // 正则表达式校验
    if (rule.pattern) {
      const regex = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern;
      if (value !== undefined && value !== null && !regex.test(String(value))) {
        return {
          isValid: false,
          errorMessage: rule.message || '输入格式不正确'
        };
      }
    }

    // 最小长度/数值校验
    if (rule.min !== undefined) {
      if (typeof value === 'string' || Array.isArray(value)) {
        if (value.length < rule.min) {
          return {
            isValid: false,
            errorMessage: rule.message || `长度不能少于 ${rule.min}`
          };
        }
      } else if (typeof value === 'number') {
        if (value < rule.min) {
          return {
            isValid: false,
            errorMessage: rule.message || `数值不能小于 ${rule.min}`
          };
        }
      }
    }

    // 最大长度/数值校验
    if (rule.max !== undefined) {
      if (typeof value === 'string' || Array.isArray(value)) {
        if (value.length > rule.max) {
          return {
            isValid: false,
            errorMessage: rule.message || `长度不能超过 ${rule.max}`
          };
        }
      } else if (typeof value === 'number') {
        if (value > rule.max) {
          return {
            isValid: false,
            errorMessage: rule.message || `数值不能大于 ${rule.max}`
          };
        }
      }
    }

    // 自定义校验器
    if (rule.validator && typeof rule.validator === 'function') {
      try {
        const result = rule.validator(value, context);
        
        // 判断是否为Promise
        if (result instanceof Promise) {
          const validationResult = await result;
          if (!validationResult) {
            return {
              isValid: false,
              errorMessage: rule.message || '自定义校验未通过'
            };
          }
        } else {
          if (!result) {
            return {
              isValid: false,
              errorMessage: rule.message || '自定义校验未通过'
            };
          }
        }
      } catch (error) {
        return {
          isValid: false,
          errorMessage: rule.message || `校验过程中发生错误: ${(error as Error).message}`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * 批量校验多个字段
   * @param fieldValues 字段值对象
   * @param fieldRules 字段规则对象
   * @param context 上下文信息
   * @returns 所有字段的校验结果
   */
  async validateFields(
    fieldValues: Record<string, any>,
    fieldRules: Record<string, Rule[]>,
    context: Context = {}
  ): Promise<Record<string, ValidationResult>> {
    const results: Record<string, ValidationResult> = {};

    for (const fieldName in fieldRules) {
      const value = fieldValues[fieldName];
      const rules = fieldRules[fieldName];
      
      results[fieldName] = await this.validate(value, rules, context);
    }

    return results;
  }

  /**
   * 检查是否存在校验失败的字段
   * @param validationResults 校验结果对象
   * @returns 是否存在校验失败的字段
   */
  hasErrors(validationResults: Record<string, ValidationResult>): boolean {
    return Object.values(validationResults).some(result => !result.isValid);
  }

  /**
   * 获取所有错误消息
   * @param validationResults 校验结果对象
   * @returns 错误消息数组
   */
  getAllErrorMessages(validationResults: Record<string, ValidationResult>): string[] {
    return Object.values(validationResults)
      .filter(result => !result.isValid)
      .map(result => result.errorMessage)
      .filter(Boolean) as string[];
  }
}

export default Validator;
