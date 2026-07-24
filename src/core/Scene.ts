import {GameObject} from "./GameObject";
import {Camera}from"../components/Camera";
import type { Engine } from "./Engine";

export class Scene{
 
 public objects: GameObject[] = [];
 activeCamera?: Camera;
 engine?: Engine;

 add(obj: GameObject): void{
  const camera= obj.getComponent(Camera);
  if(camera) this.activeCamera=camera;
  obj.scene = this;
  this.objects.push(obj);
 }
 
 remove(obj: GameObject): void {
  const index = this.objects.indexOf(obj);
  if (index === -1) return;
  if (this.activeCamera && obj === this.activeCamera.gameObject) {
    this.activeCamera = undefined;
  }
  obj.destroy();
  this.objects.splice(index, 1);
 }
 
 constructor(){
  
 }
 
 start() : void{
  for(const objs of this.objects){
   objs.start();
  }
 }
 
 update(delta: number) : void{
  for(const objs of this.objects){
   objs.update(delta);
  }
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

  for(const objs of this.objects){
   objs.destroy();
  }
  
  this.objects = [];
  
 }
 
}