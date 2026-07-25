import type { GameObject } from "./GameObject";

export abstract class Component {

  protected name: string = "Component";
  gameObject!: GameObject;

  /** false → يتخطى update و draw */
  enabled: boolean = true;

  /** هل تم استدعاء start */
  hasStarted: boolean = false;

  start(): void {}

  update(_delta: number): void {}

  draw(_ctx: CanvasRenderingContext2D): void {}

  destroy(): void {}

  getName(): string {
    return this.name;
  }
}