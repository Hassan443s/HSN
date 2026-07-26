import { Scene } from "./Scene";
import { Touch } from "./Touch";
import { EntryPoint } from "./EntryPoint";
import { AssetManager } from "./AssetManager";

export class Engine {

  private lastTime = 0;
  private deltaTime = 0;

  private loop = this.gameloop.bind(this);
  private resizeHandler = this.resize.bind(this);
  private visibilityHandler = this.onVisibilityChange.bind(this);
  private rafId: number | null = null;
  private running = false;

  private scenes: Scene[] = [];
  private currentScene: Scene | null = null;

  public viewWidth: number = 0;
  public viewHeight: number = 0;

  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D canvas context");
    }
    this.ctx = ctx;

    this.resize();

    window.addEventListener("resize", this.resizeHandler);
    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  addScene(scene: Scene): void {
    if (this.scenes.indexOf(scene) !== -1) return;
    this.scenes.push(scene);
  }

  loadScene(scene: Scene): void {
    this.currentScene?.exit();
    scene.engine = this;
    this.currentScene = scene;

    if (!scene.hasStarted) {
      scene.start();
    } else {
      scene.enter();
    }
  }

  destroyScene(scene: Scene): void {
    if (this.currentScene === scene) {
      this.currentScene = null;
    }

    scene.destroy();

    const idx = this.scenes.indexOf(scene);
    if (idx !== -1) this.scenes.splice(idx, 1);
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.viewWidth = rect.width;
    this.viewHeight = rect.height;
  }

  onVisibilityChange(): void {
    if (document.visibilityState === "visible") {
      AssetManager.reloadIfBroken();
      this.lastTime = 0;
    }
  }

  start(): void {
    if (this.running) return;

    this.running = true;
    this.rafId = requestAnimationFrame(this.loop);
    Touch.init(this.canvas);
    EntryPoint.startUp(this);
  }

  private gameloop(time: number): void {
    if (!this.running) return;

    if (this.lastTime === 0) {
      this.lastTime = time;
    }

    this.deltaTime = (time - this.lastTime) / 1000;
    this.deltaTime = Math.min(this.deltaTime, 0.1);
    this.lastTime = time;

    try {
      this.update();
      this.render();
    } catch (err) {
      console.error(err);
    }

    Touch.update();
    this.rafId = requestAnimationFrame(this.loop);
  }

  destroy(): void {
    this.running = false;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener("resize", this.resizeHandler);
    document.removeEventListener("visibilitychange", this.visibilityHandler);

    for (const scene of this.scenes) {
      scene.destroy();
    }
    this.scenes = [];
    this.currentScene = null;

    Touch.destroy(this.canvas);
    AssetManager.clear();
  }

  private update(): void {
    if (this.currentScene) {
      this.currentScene.update(this.deltaTime);
    }
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

    if (this.currentScene) {
      this.currentScene.draw(
        this.ctx,
        this.viewWidth,
        this.viewHeight
      );
    }
  }
}