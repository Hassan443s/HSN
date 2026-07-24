import type { GameObject } from "./GameObject";
export abstract class Component{
 
 protected name: string = "Component";
 gameObject!: GameObject;
 
 start() : void{
  
 }
 
 update(_delta: number) : void {
  
 }
 
 draw(_ctx:CanvasRenderingContext2D) :void
 {
  
 }
 
 destroy() : void{
  
 }
 
}