import {GameObject} from "../core/GameObject";
import {Scene} from "../core/Scene";
import {Engine} from "../core/Engine"
import {AssetManager} from "../core/AssetManager";
import {TextRenderer} from "../components/TextRenderer";
import {Camera} from "../components/Camera";
import {TouchMove} from "../components/TouchMove";
import {SpriteRenderer} from "../components/SpriteRenderer";
import {Colors} from "../tools/Colors";

//[!] Touch input system only [!]. Keyboard and mouse support coming later.

//[!] Tap and drag on the screen to move the Camera.[>] For more go to TouchMove.ts

export class CameraMove {

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
  const rB = new Colors();

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
   ,true,"#000000"
  ));

  let c1 = 
   hintText.getComponent(TextRenderer);
  
  /* Test Camera shake for more read:
   Camera.ts - shake
  cam.getComponent(Camera)?.shake(10,20);
  */

  scene.OnFrame = (_delta) => {
   if(!c1) return;
   c1.color = rB.color(5);
  };

 //[3] Scene
  //[!] Go to Scene.ts for info [!]
  this.engine.addScene(scene);
  scene.add(cam);
  scene.add(hintText);
  scene.add(icon);
  this.engine.loadScene(scene);

  // [!!!!!!!!!!!!!!!!!!!]
  //END[✓] No © have fun :)
  // [!!!!!!!!!!!!!!!!!!!]
 }
}