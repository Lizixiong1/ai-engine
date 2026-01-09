export interface LiftCycleType {
  onInit?: (content: any) => void; // 初始化
  onMounted?: (...args: any[]) => void; // 初始化挂载
  onUpdate?: (namePath: string[], value: any) => void; // 字段变化更新
  onUnmounted?: (...args: any[]) => void; // 卸载前
  onReset?: (content: any) => void; // 字段重置
}
class LiftCycle {
  hooks: LiftCycleType | undefined;
  constructor(hooks?: LiftCycleType) {
    this.hooks = hooks;
  }

  init(callback?: (h: LiftCycle) => void) {
    callback && callback(this);
    return this;
  }

  execute<K extends keyof LiftCycleType>(
    type: K,
    ...args: Parameters<NonNullable<LiftCycleType[K]>>
  ) {
    if (!this.hooks) return;
    const fn = this.hooks[type];
    if (!fn) return;

    try {
      (fn as any)(...args);
    } catch (error) {}
  }
}

export default LiftCycle;
