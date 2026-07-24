import { Component } from "../core/Component";

export class Camera extends Component {
 public zoom: number;

 constructor(zom : number = 1){
  super();
  this.zoom = zom;
  this.name = "Camera Component";
 }

 apply(ctx: CanvasRenderingContext2D, viewWidth: number, viewHeight: number){
  ctx.save();
  const t = this.gameObject.transform;
  ctx.translate(viewWidth / 2, viewHeight / 2);
  ctx.scale(this.zoom, this.zoom);
  ctx.translate(-t.x, -t.y);
}

reset(ctx: CanvasRenderingContext2D){
  ctx.restore();
}


 start(){
  //console.log("camera is ready");
 }

 screenToWorld(
 screenX: number,
 screenY: number,
 viewWidth: number,
 viewHeight: number
): { x: number; y: number } {

 const t = this.gameObject.transform;

 return {
  x: t.x + (screenX - viewWidth / 2) / this.zoom,
  y: t.y + (screenY - viewHeight / 2) / this.zoom,
 };

 }


}