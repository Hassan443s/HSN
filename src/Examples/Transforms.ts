import {GameObject} from "../core/GameObject";
import {Scene} from "../core/Scene";
import {Engine} from "../core/Engine"
import {AssetManager} from "../core/AssetManager";
//import {TextRenderer} from "../components/TextRenderer";
import {Camera} from "../components/Camera";
import {SpriteRenderer} from "../components/SpriteRenderer";
import {BoxRenderer} from "../components/BoxRenderer";
import {Colors}from "../tools/Colors";

  //[%]: Transforms: name.transform.? = ?
  /*
  (note) Read {\\} for moveing [/[c]]
  (x) Pos  => name.transform.x = num;
  (y) Pos  => name.transform.y = num;
  (a) Rotation => name.transform.rot;
  (x) Scale => name.transform.scaleX;
  (y) Scale => name.transform.scaleY;
  (note) Go to Transform.ts for details
  [[✓] [✓] [✓] [✓] [✓] [✓] [✓] [✓] [✓]]
  */


export class Transforms {

 engine: Engine;

 constructor(eng: Engine) {
  this.engine = eng;
 }

 async run() : Promise<void>{

  await AssetManager.loadImage(
   "app","/images/App.png"
  );

  //code app start [!]

  //init
  const scene = new Scene();
  const icon = new GameObject();
  const box1 = new GameObject();
  const box2 = new GameObject();
  const cam = new GameObject();
  let dir = 1;
  let time = 0;
  let box2StartY = box2.transform.y + 200;
  const rB1 = new Colors();
  const rB2 = new Colors();

  //add components
  icon.addComponent(new SpriteRenderer(
   "app",80,80
  ));
  cam.addComponent(new Camera(0.8));
  box1.addComponent(new BoxRenderer(
   80,80,"red"
  ));
  box2.addComponent(new BoxRenderer(
   80,80,"hotpink",true,"white",2
  ));

  let c1 = box1.getComponent(BoxRenderer);
  let c2 = box2.getComponent(BoxRenderer);

  //cods
  box1.transform.y += 120 * -1;
  scene.OnFrame((delta:number) => {
   if(!c1 || !c2) return;

   time += delta;
   
   icon.transform.rot += Math.PI * delta;
   c1.color = rB1.rbw(3);
   c2.color = rB2.rbw(10);
   
   if(box1.transform.x < -100) dir = 1;
   else if(box1.transform.x > 100)dir=-1;
   box1.transform.x += 50 * delta * dir;
   
   box1.transform.rot +=180 * delta * dir;
   
   box2.transform.rot +=Math.PI *2* delta;
   box2.transform.y =box2StartY + Math.sin(time * 3)*100
   
   let scale =1 + Math.sin(time * 8)* 0.2;
   icon.transform.scaleX = scale;
   icon.transform.scaleY = scale;
   
  });

  //end and run the app
  this.engine.addScene(scene);
  scene.add(icon);
  scene.add(cam);
  scene.add(box1);
  scene.add(box2);
  this.engine.loadScene(scene);
 }
}