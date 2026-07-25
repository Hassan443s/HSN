import { Engine } from "../core/Engine";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";

import { AssetManager } from "../core/AssetManager";

import { Camera } from "../components/Camera";
import { SpriteRenderer } from "../components/SpriteRenderer";
import { TextRenderer } from "../components/TextRenderer";


// ==========================================================
// Multi Scene Example
//
// • Creates two independent scenes.
// • Each scene has its own camera and objects.
// • Automatically switches between scenes.
// • Demonstrates Scene management system.
// ==========================================================


export class MultiScene {

  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }


  async run(): Promise<void> {


    // ==========================================================
    // Load Assets
    // ==========================================================

    await AssetManager.loadImage(
      "app",
      "/images/App.png"
    );



    // ==========================================================
    // Create Scenes
    // ==========================================================

    const scene1 = new Scene();
    const scene2 = new Scene();



    // ==========================================================
    // Scene 1 : Main Screen
    // ==========================================================

    const camera1 = new GameObject();
    const icon = new GameObject();
    const title = new GameObject();


    camera1.addComponent(
      new Camera(0.8)
    );


    icon.addComponent(
      new SpriteRenderer(
        "app",
        120,
        120
      )
    );


    title.transform.y = 150;

    title.addComponent(
      new TextRenderer(
        "Scene 1\nMain Screen",
        "bold 50px Arial",
        "darkblue"
      )
    );



    scene1.add(camera1);
    scene1.add(icon);
    scene1.add(title);



    // ==========================================================
    // Scene 2 : Second Screen
    // ==========================================================

    const camera2 = new GameObject();
    const info = new GameObject();


    camera2.addComponent(
      new Camera(0.8)
    );


    info.addComponent(
      new TextRenderer(
        "Scene 2\nLoaded ✓",
        "bold 60px Georgia",
        "darkgreen"
      )
    );


    scene2.add(camera2);
    scene2.add(info);



    // ==========================================================
    // Scene Switching Demo
    // ==========================================================

    let timer = 0;
    let current = 1;


    scene1.OnFrame((delta:number)=>{

      timer += delta;

      if(timer > 3){

        timer = 0;

        if(current === 1){

          this.engine.loadScene(scene2);
          current = 2;

        }else{

          this.engine.loadScene(scene1);
          current = 1;

        }

      }

    });



    // ==========================================================
    // Register Scenes
    // ==========================================================

    this.engine.addScene(scene1);
    this.engine.addScene(scene2);



    // Start with Scene 1

    this.engine.loadScene(scene1);


  }

}