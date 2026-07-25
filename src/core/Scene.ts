import {GameObject} from "./GameObject";
import {Camera}from"../components/Camera";
import type { Engine } from "./Engine";

export class Scene{

 public objects: GameObject[] = [];
 activeCamera?: Camera;
 engine?: Engine;
 public hasStarted = false;
 public OnStart? : () => void;
 public OnFrame? : (delta:number) => void;

 add(obj: GameObject): void{
  const camera= obj.getComponent(Camera);
  if(camera) this.activeCamera=camera;
  obj.scene = this;
  this.objects.push(obj);
 }

 setActiveCamera(obj: GameObject): void {

  const camera= obj.getComponent(Camera);

  if (!camera) {
   console.error("Camera not found in object");
        return;
    }
    this.activeCamera = camera;

 }


 remove(obj: GameObject): void {
  const index = this.objects.indexOf(obj);
  if (index === -1) return;
  console.log(obj);

  if (this.activeCamera && obj === this.activeCamera.gameObject) {
    this.activeCamera = undefined;
  }
  obj.destroy();
  this.objects.splice(index, 1);
 }

 constructor(){

 }

 start() : void{
  this.hasStarted = true;
  for(const objs of this.objects){
   objs.start();
  }
  if(this.OnStart) this.OnStart();
 }

 exit(): void {
  
 }

 enter(): void {
  
 }

 update(delta: number) : void{
  for(const objs of this.objects){
   objs.update(delta);
  }
  if(this.OnFrame) this.OnFrame(delta);
 }

 draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {

  if (this.activeCamera) {
    this.activeCamera.apply(
     ctx, width, height);
  }

  for (const objs of this.objects) {

    if (this.activeCamera && objs === this.activeCamera.gameObject) continue;

    objs.draw(ctx);
  }

  if (this.activeCamera) {
    this.activeCamera.reset(ctx);
  }

 }

 destroy() : void{

  this.activeCamera = undefined;

  for(const objs of this.objects){
   objs.destroy();
   objs.scene = undefined;
  }
  this.objects = [];

  this.hasStarted = false;
  this.OnFrame = undefined;
  this.OnStart = undefined;
 }

}