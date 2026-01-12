import { LiftCycleType } from "@/typings";

class LiftCycle {
  hooks: LiftCycleType | undefined;
  constructor(hooks?: LiftCycleType) {
    this.hooks = hooks;
  }

  init(callback?: (instance: LiftCycle) => void) {
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
