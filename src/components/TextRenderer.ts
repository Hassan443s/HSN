import { Component } from "../core/Component";

export class TextRenderer extends Component {

 text:string;
 font:string;
 color:string;

 stroke:boolean;
 strokeColor:string;
 strokeSize:number;

 constructor(
  text:string,
  font:string = "20px Arial",
  color:string = "white",
  stroke:boolean = false,
  strokeColor:string = "black",
  strokeSize:number = 2
 ){
  super();

  this.name = "TextRenderer";

  this.text = text;
  this.font = font;
  this.color = color;

  this.stroke = stroke;
  this.strokeColor = strokeColor;
  this.strokeSize = strokeSize;
 }

 draw(ctx:CanvasRenderingContext2D): void{

  ctx.save();

  ctx.translate(
   this.gameObject.transform.x,
   this.gameObject.transform.y
  );

  ctx.rotate(this.gameObject.transform.rot);

  ctx.scale(
   this.gameObject.transform.scaleX,
   this.gameObject.transform.scaleY
  );

  ctx.font = this.font;
  ctx.fillStyle = this.color;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if(this.stroke){

   ctx.strokeStyle = this.strokeColor;
   ctx.lineWidth = this.strokeSize;

   ctx.strokeText(
    this.text,
    0,
    0
   );
  }


  ctx.fillText(
   this.text,
   0,
   0
  );


  ctx.restore();
 }


 start():void{}
 update(_delta:number):void{}
 destroy():void{}
}