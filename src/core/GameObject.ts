import type { Scene } from "./Scene";
import {Component} from "./Component";
import {Transform} from "../components/Transform";

export class GameObject {

 public isDestroyed: boolean = false;
 private components: Component[] = [];
 public readonly transform: Transform;
 public scene?: Scene;

 constructor(){
  this.transform = new Transform();
  this.addComponent(this.transform);
 }

 addComponent<T extends Component>(comp:T): T
 {
  if(this.isDestroyed)
    throw new Error("GameObject destroyed");

  if(comp instanceof Transform &&
     this.hasComponent(Transform))
    throw new Error("Transform already exists");

  comp.gameObject = this;
  this.components.push(comp);

  return comp;
 }

 removeComponent(comp:Component):void {
  if(this.isDestroyed) return;
  if (comp instanceof Transform) {
   console.log("transform cannot be deleted");
   return;
  }

  const index=this.components.indexOf(comp);

  if(index === -1) return;

  this.components.splice(index,1);
  comp.destroy();
 }

 getComponent<T extends Component>(
  type:new(...args:any[])=>T
 ):T | undefined {
  if(this.isDestroyed) return;

  return this.components.find(
   c => c instanceof type
  ) as T | undefined;
 }

 getComponents<T extends Component>(
  type:new(...args:any[])=>T
 ):T[] {
  if(this.isDestroyed) return [];

  return this.components.filter(
   c => c instanceof type
  ) as T[];
 }

 hasComponent<T extends Component>(type: new (...args: any[]) => T): boolean {
  return this.components.some(c => c instanceof type);
 }

 start(){
  if(this.isDestroyed) return;
  if(!this.transform) return;

  for(const c of this.components)
   c.start();
 }

 update(delta:number){
  if(this.isDestroyed) return;

  for(const c of this.components)
   c.update(delta);
 }

 draw(ctx:CanvasRenderingContext2D){
  if(this.isDestroyed) return;

  for(const c of this.components)
   c.draw(ctx);
 }

 destroy(){
  if(this.isDestroyed) return;

  for(const c of this.components)
   c.destroy();

  this.components = [];
  this.isDestroyed = true;
 }

}
