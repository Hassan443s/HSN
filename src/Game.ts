import { Engine } from
"./core/Engine";
import { GameObject } from "./core/GameObject";
import { Scene } from "./core/Scene";
import { BoxRenderer } from "./components/BoxRenderer";
import { TextRenderer } from "./components/TextRenderer";
import { SpriteRenderer } from "./components/SpriteRenderer";
import { TouchMove } from "./components/TouchMove";
import { Camera } from "./components/Camera";
import { AssetManager } from "./core/AssetManager";



export class Game {
 private engine: Engine;

 constructor(engine: Engine) {
  this.engine = engine;
 }


 play() {
  AssetManager.loadImage("app", "/images/App.png");

  //code....
   let scene1 = new Scene();
   this.engine.addScene(scene1);
   this.engine.loadScene(scene1);

   let box = new GameObject();
   let player = new GameObject();
   let text = new GameObject();
   let cam = new GameObject();

  //box
   box.addComponent(
    new BoxRenderer(50, 50, "hotpink")
   );
   player.addComponent(new TouchMove(1));
  //player
   player.addComponent(
    new SpriteRenderer("app", 80, 80)
   );
  //text
   text.addComponent(
    new TextRenderer(
     "my Text","32px Arial","#ffffff"
     ,true,"red",3
    )
   );
  //camera Test
   cam.addComponent(
    new Camera(1)
   );
  
  cam.transform.x = 
   this.engine.canvas.clientWidth / 2;
cam.transform.y = 
 this.engine.canvas.clientHeight / 2;


  //SpriteRenderer Test
   const sprite =
    player.getComponent(SpriteRenderer);

   if (sprite) {
    //sprite.alpha = 1;
    //sprite.flipX = true;
    //sprite.flipY = false;
    //sprite.pivotX = 1.5;
    //sprite.pivotY = 0.5;
   }

  //transforms
   player.transform.x =
    this.engine.canvas.clientWidth / 2;
   player.transform.y =
    this.engine.canvas.clientHeight / 2.5;

   box.transform.x =
    this.engine.canvas.clientWidth / 2;
   box.transform.y =
    this.engine.canvas.clientHeight / 2;

   text.transform.x =
    this.engine.canvas.clientWidth / 2;
   text.transform.y =
    this.engine.canvas.clientHeight / 1.5;
  
  //Test
    text.onUpdate = `
     this.transform.rot += 1 * delta;
    `;
  text.onStart = `
  `;
  //End
  // add to scene1
   scene1.add(box);
   scene1.add(player);
   scene1.add(text);
   scene1.add(cam);
 }
}