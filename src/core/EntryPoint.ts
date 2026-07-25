import {Engine} from "./Engine";
import * as examples from "../examples";

export class EntryPoint{
 static main(engine: Engine){
  //(Ex1) - Camera Test
   //const app = new examples.CameraMove(engine);

  //(Ex2) - Transforms Test
   const app = new examples.Transforms(engine);

  //(Ex3) - MuiltyScene
   //const app = new examples.MultiScene(engine);

  //(Ex4) - MuiltyCamera
   //const app = new examples.MultiCamera(engine);

  //(Ex5) - ClickGame
   //const app = new examples.ClickGame(engine);

 //(Ex6) - ColisionPoint
  //const app = new examples.TouchInspector(engine);

  //RUN APP
   app.run();
 }
}