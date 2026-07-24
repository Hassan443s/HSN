import {Engine} from "./Engine";
import * as Examples from "../Examples";

export class EntryPoint{
 static main(engine: Engine){
  //[main]
  const app =
  new Examples.CamObject(engine);
  
  app.play();
 }
}