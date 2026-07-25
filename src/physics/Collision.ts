import type { GameObject } from "../core/GameObject";

export class Collision {

 static pointInObject(
  x:number,
  y:number,
  obj:GameObject,
  width:number,
  height:number
 ){

  return(
   x >= obj.transform.x - width / 2 &&
   x <= obj.transform.x + width / 2 &&
   y >= obj.transform.y - height / 2 &&
   y <= obj.transform.y + height / 2
  );

 }

}