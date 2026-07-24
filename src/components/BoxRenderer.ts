import { Component } from "../core/Component";

export class BoxRenderer extends Component {

 width: number;
 height: number;
 color: string;

 strokeColor: string;
 stroke: boolean;
 strokeSize: number;

 constructor(
  w:number,
  h:number,
  color:string,
  s:boolean = false,
  sColor:string = "red",
  size:number = 5
 ){
  super();

  this.name = "BoxRenderer";

  this.width = w;
  this.height = h;
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

  ctx.rect(
   -this.width / 2,
   -this.height / 2,
   this.width,
   this.height
  );


  ctx.fill();


  if(this.stroke){

   ctx.strokeStyle = this.strokeColor;
   ctx.lineWidth = this.strokeSize;

   ctx.stroke();
  }


  ctx.restore();
 }


 start(): void {}

 update(_delta:number): void {}

 destroy(): void {}
}