import { Component } from "../core/Component";

export class CircleRenderer extends Component {

 radius: number;
 color: string;

 strokeColor: string;
 stroke: boolean;
 strokeSize: number;


 constructor(
  radius:number,
  color:string,
  s:boolean = false,
  sColor:string = "red",
  size:number = 5
 ){
  super();

  this.name = "CircleRenderer";

  this.radius = radius;
  this.color = color;

  this.stroke = s;
  this.strokeColor = sColor;
  this.strokeSize = size;
 }


 draw(ctx: CanvasRenderingContext2D): void {

  ctx.save();


  ctx.translate(
   this.gameObject.transform.x,
   this.gameObject.transform.y
  );


  ctx.rotate(
   this.gameObject.transform.rot
  );


  ctx.scale(
   this.gameObject.transform.scaleX,
   this.gameObject.transform.scaleY
  );


  ctx.fillStyle = this.color;


  ctx.beginPath();

  ctx.arc(
   0,
   0,
   this.radius,
   0,
   Math.PI * 2
  );


  ctx.fill();


  if(this.stroke){

   ctx.strokeStyle = this.strokeColor;
   ctx.lineWidth = this.strokeSize;

   ctx.stroke();
  }

  ctx.restore();

 }

}