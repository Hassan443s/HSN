import { Component } from "../core/Component";
import { Touch } from "../core/Touch";

export class VirtualJoystick extends Component {

  public radius: number;
  public deadZone: number;
  public fixed: boolean;
  public baseX: number;
  public baseY: number;
  public capturePadding: number;

  public axisX = 0;
  public axisY = 0;
  public force = 0;
  public active = false;

  public centerX = 0;
  public centerY = 0;
  public knobX = 0;
  public knobY = 0;

  private tracking = false;

  constructor(
    baseX = 100,
    baseYFromBottom = 120,
    radius = 70,
    fixed = false,
    deadZone = 0.12,
    capturePadding = 1.4
  ) {
    super();
    this.name = "VirtualJoystick";
    this.baseX = baseX;
    this.baseY = baseYFromBottom;
    this.radius = Math.max(radius, 1);
    this.fixed = fixed;
    this.deadZone = Math.min(Math.max(deadZone, 0), 0.95);
    this.capturePadding = Math.max(capturePadding, 1);
  }

  start(): void {
    this.resetCenter();
    this.knobX = this.centerX;
    this.knobY = this.centerY;
  }

  update(): void {
    if (!this.tracking) {
      this.resetCenter();
    }

    if (Touch.justPressed) {
      this.tryCapture(Touch.x, Touch.y);
    }

    if (this.tracking && Touch.pressed) {
      this.follow(Touch.x, Touch.y);
      return;
    }

    if (this.tracking && (Touch.justReleased || !Touch.pressed)) {
      this.release();
    }
  }

  private resetCenter(): void {
    const engine = this.gameObject.scene?.engine;
    if (!engine) return;

    this.centerX = this.baseX;
    this.centerY = engine.viewHeight - this.baseY;

    if (!this.tracking) {
      this.knobX = this.centerX;
      this.knobY = this.centerY;
    }
  }

  private tryCapture(x: number, y: number): void {
    if (this.fixed) {
      const dx = x - this.centerX;
      const dy = y - this.centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > this.radius * this.capturePadding) return;
    } else {
      this.centerX = x;
      this.centerY = y;
    }

    this.tracking = true;
    this.active = true;
    this.follow(x, y);
  }

  private follow(x: number, y: number): void {
    let dx = x - this.centerX;
    let dy = y - this.centerY;
    let len = Math.sqrt(dx * dx + dy * dy);

    if (len > this.radius && len > 0) {
      dx = (dx / len) * this.radius;
      dy = (dy / len) * this.radius;
      len = this.radius;
    }

    this.knobX = this.centerX + dx;
    this.knobY = this.centerY + dy;

    if (len / this.radius < this.deadZone) {
      this.axisX = 0;
      this.axisY = 0;
      this.force = 0;
      return;
    }

    const raw = len / this.radius;
    const t = (raw - this.deadZone) / (1 - this.deadZone);

    this.axisX = (dx / this.radius) * (t / raw);
    this.axisY = (dy / this.radius) * (t / raw);
    this.force = t;
  }

  private release(): void {
    this.tracking = false;
    this.active = false;
    this.axisX = 0;
    this.axisY = 0;
    this.force = 0;
    this.resetCenter();
    this.knobX = this.centerX;
    this.knobY = this.centerY;
  }

  setBase(x: number, yFromBottom: number): void {
    this.baseX = x;
    this.baseY = yFromBottom;
    if (!this.tracking) this.resetCenter();
  }

  draw(_ctx: CanvasRenderingContext2D): void {}
}