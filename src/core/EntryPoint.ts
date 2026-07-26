import type{Engine} from "./Engine";
import * as examples from "../examples";

type Demo = new (engine: Engine) => any;

export class EntryPoint {

 static startUp(engine: Engine){

  const Demos: Record<string, Demo> = {
   "1": examples.CameraFollowDemo,
   "2": examples.CircleDemo,
   "3": examples.ClickGame,
   "4": examples.JoystickDemo,
   "5": examples.MultiCamera,
   "6": examples.MultiScene,
   "7": examples.TouchInspector,
   "8": examples.Transforms
  };

  const selectDemo = Demos["3"];

  if(!selectDemo){
    throw new Error("Demo not found");
  }

  const App = new selectDemo(engine);

  App.run();
 }
}