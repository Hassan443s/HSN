import { Scene } from "./Scene";
import { Touch } from "./Touch";

export class Engine {

 private lastTime = 0;
 private deltaTime = 0;
 
 private loop = this.gameloop.bind(this);
 private resizeHandler = 
  this.resize.bind(this);
 private rafId: number | null = null;
 private running = false;

// Scene system
 private scenes: Scene[] = [];
 private currentScene: Scene | null =
  null;

 public viewWidth: number = 0;
 public viewHeight: number = 0;

//Engine
 readonly canvas: HTMLCanvasElement;
 readonly ctx: CanvasRenderingContext2D;

 constructor(canvas: HTMLCanvasElement) {

  this.canvas = canvas;

  const ctx = this.canvas.getContext("2d");
  if(!ctx){
  throw new Error("Failed to get 2D canvas  context");
  }
   this.ctx = ctx;

   this.resize();

   window.addEventListener("resize",  this.resizeHandler);

 }

 addScene(scene: Scene): void {
  this.scenes.push(scene);
 }

 loadScene(scene: Scene): void
 {

  this.currentScene?.destroy();
  scene.engine = this;
  this.currentScene = scene;
  this.currentScene.start();

 }

 resize(): void {

 const rect = 
  this.canvas.getBoundingClientRect();

 const dpr = window.devicePixelRatio || 1;

 this.canvas.width = rect.width * dpr;
 this.canvas.height = rect.height * dpr;

 this.ctx.setTransform(1, 0, 0, 1, 0, 0);
 this.ctx.scale(dpr, dpr);
 this.viewWidth = rect.width;
 this.viewHeight = rect.height;

 }



 start(): void {

 if(this.running) return;

  this.running = true;
  this.rafId = 
   requestAnimationFrame(this.loop);
  Touch.init(this.canvas);

 }

gameloop(time: number): void {
 
  if(!this.running) return;
  
  if(this.lastTime === 0){
  this.lastTime = time;
  }
  
  this.deltaTime =
  (time - this.lastTime) / 1000;

 this.deltaTime = Math.min(this.deltaTime, 0.1);

  
  this.lastTime = time;
  
  this.update();
  this.render();
  Touch.update();
  
  this.rafId =  
   requestAnimationFrame(this.loop);
 }
 
destroy(): void {

this.running = false;

if(this.rafId !== null){
cancelAnimationFrame(this.rafId);
this.rafId = null;
}

window.removeEventListener("resize", this.resizeHandler);

this.currentScene?.destroy();
Touch.destroy(this.canvas);

}
//Events Engine
 
update(): void {
// Update

 //1..
 if(this.currentScene){
 this.currentScene.update(this.deltaTime);
 }//update scene
}

render(): void {
 const rect =
  this.canvas.getBoundingClientRect();
// Render
 this.ctx.clearRect(
  0,
  0,
  rect.width,
  rect.height
 );
 
//2..
 if(this.currentScene){
  this.currentScene.draw(
   this.ctx,rect.width,rect.height
  );
 }//render scene

}

}