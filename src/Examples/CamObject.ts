import {GameObject} from "../core/GameObject";
import {Scene} from "../core/Scene";
import {Engine} from "../core/Engine"
import {AssetManager} from "../core/AssetManager";
import {TextRenderer} from "../components/TextRenderer";
import {Camera} from "../components/Camera";
import {TouchMove} from "../components/TouchMove";
import {SpriteRenderer} from "../components/SpriteRenderer";

//[!] Touch input system only [!]. Keyboard and mouse support coming later.

//[!] Tap and drag on the screen to move the Camera.[>] For more go to TouchMove.ts

export class CamObject {

 engine: Engine;

 constructor(eng: Engine) {
  this.engine = eng; //engine
 }
 
 async play(): Promise<void>{ //loading...

  await AssetManager.loadImage(
   //name , src
   "app","/images/App.png"
  ); //AssetManager.ts

 //[1] Init Objects :
  const scene = new Scene();
  this.engine.addScene(scene);
  const cam = new GameObject();
  const hintText = new GameObject();
  const icon = new GameObject();

  //[%]: Transforms: name.transform.? = ?
  /*
  (note) Read {\\} for moveing [/[c]]
  (x) Poss => name.transform.x = num;
  (y) Poss => name.transform.t = num;
  (a) Rotation => name.transform.rot;
  (x) Scale => name.transform.scaleX;
  (y) Scale => name.transform.scaleY;
  (note) Go to Transform.ts for details
  [[✓] [✓] [✓] [✓] [✓] [✓] [✓] [✓] [✓]]
  */

  icon.transform.y -= 50;

 //[2] Add Components

  //[Camera]
  cam.addComponent(new Camera());
  cam.addComponent(new TouchMove(1));
  icon.addComponent(
   //[!] SRC From AssetManager [!]
   new SpriteRenderer("app",50,50)
  );

  hintText.addComponent(new TextRenderer(
  //[!] Go to TextRenderer.ts for info [!]
   "Camera Test!","32px Arial","#49bfe5"
   ,true,"red"
  ));

 //[3] Scene
  //[!] Go to Scene.ts for info [!]
  scene.add(cam);
  scene.add(hintText);
  scene.add(icon);
  this.engine.loadScene(scene);

  // [!!!!!!!!!!!!!!!!!!!]
  //END[✓] No © have fun :)
  // [!!!!!!!!!!!!!!!!!!!]
 }
}