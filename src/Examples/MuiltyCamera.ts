import {Engine} from "../core/Engine";
import {GameObject} from "../core/GameObject";
import {Scene} from "../core/Scene";
import {TextRenderer} from "../components/TextRenderer";
import {Camera} from "../components/Camera";

export class MuiltyCamera{

 engine: Engine;

 constructor(eng:Engine) {
  this.engine = eng;
 }

 async run(): Promise<void>{

 //Init objects
  const scene = new Scene();

  const cam1 = new GameObject();
  const cam2 = new GameObject();

  const hint1 = new GameObject();
  const hint2 = new GameObject();

 //add components
  cam1.addComponent(new Camera());
  cam2.addComponent(new Camera());
  hint1.addComponent(new TextRenderer("camera 1","bold 80px Georgia","darkgreen"));
  hint2.addComponent(new TextRenderer("camera 2","bold 80px Georgia","darkred"));

 //Transforms
  cam2.transform.x = 1000;
  hint2.transform.x = 1000;

 //for test
  const c = cam2.getComponent(Camera);
  let time = 0;
  let cam1StartX = cam1.transform.x;

  scene.OnFrame((delta:number)=>{
   //cam1 => move. event
   //cam2 => shake event

   if(!c)return; // for fix build error

   //move. event for cam 1
   time += delta;
   cam1.transform.x = cam1StartX + Math.sin(time * 5)*30
   //shake event for cam 2
   c.shake(2,1);

  });

 //end and run
  this.engine.addScene(scene);
  scene.add(cam1);
  scene.add(cam2);
  scene.add(hint1);
  scene.add(hint2);
  //set main camera for test[✓]
  scene.setActiveCamera(cam1/* cam2 */);
  //run
  this.engine.loadScene(scene);

 }

}