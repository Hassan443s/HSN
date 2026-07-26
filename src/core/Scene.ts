import { GameObject } from "./GameObject";
import { Camera } from "../components/Camera";
import type { Engine } from "./Engine";

export class Scene {

  public objects: GameObject[] = [];
  activeCamera?: Camera;
  engine?: Engine;
  public hasStarted = false;

  private startCallbacks: (() => void)[] = [];
  private frameCallbacks: ((delta: number) => void)[] = [];

  add(obj: GameObject): void {
    if (obj.isDestroyed || obj.pendingDestroy) {
      console.warn("Cannot add destroyed GameObject to scene");
      return;
    }

    if (this.objects.indexOf(obj) !== -1) return;

    const camera = obj.getComponent(Camera);
    if (camera && !this.activeCamera) {
      this.activeCamera = camera;
    }

    obj.scene = this;
    this.objects.push(obj);

    if (this.hasStarted) {
      obj.start();
    }
  }

  setActiveCamera(obj: GameObject): void {
    const camera = obj.getComponent(Camera);
    if (!camera) {
      console.error("Camera not found in object");
      return;
    }
    this.activeCamera = camera;
  }

  remove(obj: GameObject): void {
    if (!obj || obj.isDestroyed) return;
    obj.destroy();
  }

  find(name: string): GameObject | undefined {
    return this.objects.find(
      (o) => !o.isDestroyed && !o.pendingDestroy && o.name === name
    );
  }

  findAll(name: string): GameObject[] {
    return this.objects.filter(
      (o) => !o.isDestroyed && !o.pendingDestroy && o.name === name
    );
  }

  OnStart(callback: () => void): void {
    this.startCallbacks.push(callback);
  }

  OnFrame(callback: (delta: number) => void): void {
    this.frameCallbacks.push(callback);
  }

  OffFrame(callback: (delta: number) => void): void {
    const i = this.frameCallbacks.indexOf(callback);
    if (i !== -1) this.frameCallbacks.splice(i, 1);
  }

  constructor() {}

  start(): void {
    this.hasStarted = true;

    for (const obj of this.objects) {
      obj.start();
    }

    for (const cb of this.startCallbacks) cb();
  }

  exit(): void {}

  enter(): void {}

  update(delta: number): void {
  const list = this.objects.slice();

  for (const obj of list) {
    if (!obj.isDestroyed && !obj.pendingDestroy) {
      obj.update(delta);
    }
  }

  for (const cb of this.frameCallbacks) cb(delta);

  if (this.activeCamera) {
    this.activeCamera.lateFollow(delta);
  }

  this.processDestroyed();
  }


  draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const cam = this.activeCamera;

    if (cam) {
      cam.apply(ctx, width, height);
    }

    try {
      for (const obj of this.objects) {
        if (obj.isDestroyed || obj.pendingDestroy || !obj.active) continue;
        if (cam && obj === cam.gameObject) continue;
        obj.draw(ctx);
      }
    } finally {
      if (cam) {
        cam.reset(ctx);
      }
    }
  }

  private processDestroyed(): void {
    let i = 0;

    while (i < this.objects.length) {
      const obj = this.objects[i];

      if (obj.pendingDestroy || obj.isDestroyed) {
        if (this.activeCamera && obj === this.activeCamera.gameObject) {
          this.activeCamera = undefined;
        }

        if (!obj.isDestroyed) {
          obj.forceDestroy();
        } else {
          obj.scene = undefined;
        }

        this.objects.splice(i, 1);
        continue;
      }

      i++;
    }
  }

  destroy(): void {
    this.activeCamera = undefined;

    for (const obj of this.objects) {
      obj.forceDestroy();
    }

    this.objects = [];
    this.hasStarted = false;
    this.frameCallbacks = [];
    this.startCallbacks = [];
  }
}