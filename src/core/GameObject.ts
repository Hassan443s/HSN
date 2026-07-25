import type { Scene } from "./Scene";
import { Component } from "./Component";
import { Transform } from "../components/Transform";

export class GameObject {

  public isDestroyed: boolean = false;

  /** طلب تدمير في نهاية الفريم (آمن أثناء update) */
  public pendingDestroy: boolean = false;

  /** false → يتخطى update و draw بدون تدمير */
  public active: boolean = true;

  public name: string = "";

  private components: Component[] = [];
  public readonly transform: Transform;
  public scene?: Scene;

  constructor(name: string = "") {
    this.name = name;
    this.transform = new Transform();
    this.addComponent(this.transform);
  }

  addComponent<T extends Component>(comp: T): T {
    if (this.isDestroyed || this.pendingDestroy) {
      throw new Error("Cannot add component to destroyed GameObject");
    }

    if (comp instanceof Transform && this.hasComponent(Transform)) {
      throw new Error("Transform already exists");
    }

    comp.gameObject = this;
    this.components.push(comp);

    if (this.scene?.hasStarted && !comp.hasStarted) {
      comp.start();
      comp.hasStarted = true;
    }

    return comp;
  }

  removeComponent(comp: Component): void {
    if (this.isDestroyed) return;

    if (comp instanceof Transform) {
      console.warn("Transform cannot be removed");
      return;
    }

    const index = this.components.indexOf(comp);
    if (index === -1) return;

    this.components.splice(index, 1);
    comp.destroy();
  }

  getComponent<T extends Component>(
    type: new (...args: any[]) => T
  ): T | undefined {
    if (this.isDestroyed) return undefined;

    return this.components.find(
      (c) => c instanceof type
    ) as T | undefined;
  }

  getComponents<T extends Component>(
    type: new (...args: any[]) => T
  ): T[] {
    if (this.isDestroyed) return [];

    return this.components.filter(
      (c) => c instanceof type
    ) as T[];
  }

  hasComponent<T extends Component>(
    type: new (...args: any[]) => T
  ): boolean {
    return this.components.some((c) => c instanceof type);
  }

  start(): void {
    if (this.isDestroyed || this.pendingDestroy || !this.active) return;

    for (const c of this.components) {
      if (!c.hasStarted) {
        c.start();
        c.hasStarted = true;
      }
    }
  }

  update(delta: number): void {
    if (this.isDestroyed || this.pendingDestroy || !this.active) return;

    const list = this.components.slice();
    for (const c of list) {
      if (c.enabled) c.update(delta);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDestroyed || this.pendingDestroy || !this.active) return;

    const list = this.components.slice();
    for (const c of list) {
      if (c.enabled) c.draw(ctx);
    }
  }

  /**
   * طلب تدمير آمن — يُنفَّذ في نهاية الفريم من المشهد.
   * استخدم هذا أثناء update / OnFrame.
   */
  destroy(): void {
    if (this.isDestroyed || this.pendingDestroy) return;
    this.pendingDestroy = true;
    this.active = false;
  }

  /**
   * تدمير فوري — يستدعيه المشهد فقط في نهاية الفريم أو عند destroy المشهد.
   * لا تستدعِه من منطق اللعبة مباشرة.
   */
  forceDestroy(): void {
    if (this.isDestroyed) return;

    for (const c of this.components) {
      c.destroy();
    }

    this.components = [];
    this.isDestroyed = true;
    this.pendingDestroy = false;
    this.active = false;
    this.scene = undefined;
  }
}