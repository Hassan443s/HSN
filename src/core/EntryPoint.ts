import {Engine} from "./Engine";
import * as Examples from "../Examples";

export class EntryPoint{
 static main(engine: Engine){
  //(Ex) - Camera Test
  //const app =
   //new Examples.CameraMove(engine);

  //(Ex) - Transforms Test
  const app =
   new Examples.Transforms(engine);

  //RUN APP
  app.play();
 }
}