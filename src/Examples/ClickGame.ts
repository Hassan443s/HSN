import {Engine} from "../core/Engine";
import {GameObject} from "../core/GameObject";
import {Scene} from "../core/Scene";
import {Touch} from "../core/Touch";
import {TextRenderer} from "../components/TextRenderer";
import {BoxRenderer} from "../components/BoxRenderer";
import {Camera} from "../components/Camera";

//[!] Touch input system only [!]. Keyboard and mouse support coming later.

//click the screen for increase;

export class ClickGame{
 engine: Engine;
 constructor(eng:Engine){this.engine=eng;}

 async run(): Promise<void>{
  //variables
  let score = 0;
  //init
  const scene = new Scene();
  const cam = new GameObject();
  const background = new GameObject();
  const text = new GameObject();

  background.addComponent(new BoxRenderer(5000,5000,"skyblue"));

  cam.addComponent(new Camera());

  text.addComponent(new TextRenderer("Tap for increase","italic bold 32px Georgia","darkred",true,"white"));

  let gText = text.getComponent(TextRenderer);

  scene.OnFrame((_delta:number) =>{
   if(!gText) return;
   if(Touch.justPressed){
    score += 1;
    gText.text= `Your score is: ${score}`;
   }
  });

  //end and run
  this.engine.addScene(scene);
  scene.add(cam);
  scene.add(background);
  scene.add(text)
  this.engine.loadScene(scene);
 }
}