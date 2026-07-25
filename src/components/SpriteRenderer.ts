import { Component } from "../core/Component";
import { AssetManager } from "../core/AssetManager";

export class SpriteRenderer extends Component {
 public src: string;
 width: number;
 height: number;
 public alpha:number = 1;
 public flipX:boolean = false;
 public flipY:boolean = false;
 pivotX:number = 0.5;
 pivotY:number = 0.5;
 constructor(src:string,w:number,h:number)
 {
  super();

  this.name = "SpriteRenderer";
  this.width = w;
  this.height = h;
  this.src = src;

  const image = AssetManager.getImage(src);

  if (!image) {
    throw new Error(`Image "${src}" is not 
    loaded.`);
  }
 }

 draw(ctx: CanvasRenderingContext2D): void{

  const image = AssetManager.getImage(this.src);

  if(!image || !image.complete) return;

  ctx.save();

  ctx.translate(
   this.gameObject.transform.x,
   this.gameObject.transform.y
  );
  ctx.rotate(this.gameObject.transform.rot);
  ctx.scale(this.gameObject.transform.scaleX,
   this.gameObject.transform.scaleY);
  ctx.globalAlpha = this.alpha;

  if(this.flipX || this.flipY){

   ctx.scale(
    this.flipX ? -1 : 1,
    this.flipY ? -1 : 1
   );

  }

 ctx.drawImage(
  image,
  -this.width * this.pivotX,
  -this.height * this.pivotY,
  this.width,
  this.height
 );

  ctx.restore();
 }

 start(): void{}
 update(_delta: number): void{}
 destroy(): void{}
}