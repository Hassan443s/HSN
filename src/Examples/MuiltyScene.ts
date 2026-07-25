import {Engine} from "../core/Engine";
import {GameObject} from "../core/GameObject";
import {Scene} from "../core/Scene";
import{AssetManager} from "../core/AssetManager";
import {Camera} from "../components/Camera";
import {SpriteRenderer} from "../components/SpriteRenderer";
import {TextRenderer} from "../components/TextRenderer";

export class MuiltyScene {
 engine : Engine;
 constructor(eng: Engine) {
  this.engine = eng;
 }
 async run() : Promise<void>{

  await AssetManager.loadImage(
   "app","/images/App.png"
  );

  //init
  const scene1 = new Scene();
  const scene2 = new Scene();

  //scene1 object
  const image = new GameObject();
  const cam1 = new GameObject();
  image.addComponent(new SpriteRenderer(
   "app", 100,100
  ));
  cam1.addComponent(new Camera(0.5));

  //scene2 object
  const text = new GameObject();
  const cam2 = new GameObject();
  cam2.addComponent(new Camera(0.5));
  text.addComponent(new TextRenderer(
   "Scene 2[✓]","bold 80px Georgia","darkgreen"
  ));

  //end and run app
  this.engine.addScene(scene1);
  this.engine.addScene(scene2);

  scene1.add(cam1);
  scene1.add(image);

  scene2.add(cam2);
  scene2.add(text);

  this.engine.loadScene(scene2);//|scene2
 }

}