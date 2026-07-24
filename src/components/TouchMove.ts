import { Component } from "../core/Component";
import { Touch } from "../core/Touch";

//Here, the object can move to a point specified by the user's finger.

//Still under development.

//[✓] Version: 0.02 beta [✓]

/****************************************
      Hsn Engine[Component beta]
*****************************************/

export class TouchMove extends Component {
 public speed: number = 0;

 constructor(speed: number = 15) {
  super();
  this.name = "TouchMove";
  this.speed = speed;
 }

 draw(_ctx: CanvasRenderingContext2D): void {}
 start(): void {}

 update(delta: number): void {

  if (!Touch.pressed) return;

  const scene = this.gameObject.scene;
  const engine = scene?.engine;
  const camera = scene?.activeCamera;

  if (!engine || !camera) return;

  const target = camera.screenToWorld(
   Touch.x,
   Touch.y,
   engine.viewWidth,
   engine.viewHeight
  );

  const speed = this.speed;

  this.gameObject.transform.x +=
   (target.x - this.gameObject.transform.x) * speed * delta;

  this.gameObject.transform.y +=
   (target.y - this.gameObject.transform.y) * speed * delta;

 }

 destroy(): void {}
}