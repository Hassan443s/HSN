import { Component } from "../core/Component";

export class Transform extends Component{

 public x = 0;
 public y = 0;
 public rot = 0;
 public scaleX = 1;
 public scaleY = 1;
 
 constructor() {
  super();
  this.name = "Transform";
 }

 draw(_ctx:CanvasRenderingContext2D):void{}
 start(): void{}
 update(_delta: number): void{}
 destroy(): void{}
 
}