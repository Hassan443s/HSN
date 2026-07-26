import { Component } from "../core/Component";
import type { GameObject } from "../core/GameObject";

export class Camera extends Component {
  public zoom: number;
  public target: GameObject | null = null;
  public smooth: boolean = true;
  public smoothSpeed: number = 8;
  public offsetX: number = 0;
  public offsetY: number = 0;

  private shakeDuration: number = 0;
  private shakeTimer: number = 0;
  private shakeIntensity: number = 0;
  private shakeOffsetX: number = 0;
  private shakeOffsetY: number = 0;

  constructor(zoom: number = 1) {
    super();
    this.zoom = zoom;
    this.name = "Camera Component";
  }

  shake(intensity: number, duration: number) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  apply(
    ctx: CanvasRenderingContext2D,
    viewWidth: number,
    viewHeight: number
  ) {
    ctx.save();

    const t = this.gameObject.transform;

    ctx.translate(viewWidth / 2, viewHeight / 2);
    ctx.rotate(-t.rot);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-t.x + this.shakeOffsetX, -t.y + this.shakeOffsetY);
  }

  reset(ctx: CanvasRenderingContext2D) {
    ctx.restore();
  }

  start() {}

  update(delta: number) {
    this.updateShake(delta);
  }

  lateFollow(delta: number) {
    if (!this.target || this.target.isDestroyed || this.target.pendingDestroy) {
      return;
    }

    const camera = this.gameObject.transform;
    const target = this.target.transform;

    const goalX = target.x + this.offsetX;
    const goalY = target.y + this.offsetY;

    if (this.smooth) {
      const t = 1 - Math.exp(-this.smoothSpeed * delta);
      camera.x += (goalX - camera.x) * t;
      camera.y += (goalY - camera.y) * t;
    } else {
      camera.x = goalX;
      camera.y = goalY;
    }
  }

  private updateShake(delta: number) {
    if (this.shakeTimer <= 0) {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
      return;
    }

    this.shakeTimer -= delta;

    const falloff = Math.max(this.shakeTimer / this.shakeDuration, 0);
    const power = this.shakeIntensity * falloff;

    const angle = Math.random() * Math.PI * 2;
    this.shakeOffsetX = Math.cos(angle) * power;
    this.shakeOffsetY = Math.sin(angle) * power;
  }

  screenToWorld(
    screenX: number,
    screenY: number,
    viewWidth: number,
    viewHeight: number
  ): { x: number; y: number } {
    const t = this.gameObject.transform;

    const dx = (screenX - viewWidth / 2) / this.zoom;
    const dy = (screenY - viewHeight / 2) / this.zoom;

    const cos = Math.cos(t.rot);
    const sin = Math.sin(t.rot);

    return {
      x: t.x + (dx * cos - dy * sin) - this.shakeOffsetX,
      y: t.y + (dx * sin + dy * cos) - this.shakeOffsetY,
    };
  }
}