import {Engine} from "./Engine";
import * as Examples from "../Examples";

export class EntryPoint{
 static main(engine: Engine){
  //(Ex1) - Camera Test
  //const app =
   //new Examples.CameraMove(engine);

  //(Ex2) - Transforms Test
   //const app =
    //new Examples.Transforms(engine);

  //(Ex3) - MuiltyScene
   //const app =
    //new Examples.MuiltyScene(engine);

  //(Ex4) - MuiltyCamera
   //const app =
    //new Examples.MuiltyCamera(engine);

  //(Ex5) - ClickGame
   const app =
    new Examples.ClickGame(engine);

  //RUN APP
   app.run();
 }
}