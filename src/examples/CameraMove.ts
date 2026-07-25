import { Engine } from "../core/Engine";
import { Scene } from "../core/Scene";
import { GameObject } from "../core/GameObject";

import { AssetManager } from "../core/AssetManager";

import { Camera } from "../components/Camera";
import { TouchMove } from "../components/TouchMove";
import { SpriteRenderer } from "../components/SpriteRenderer";
import { TextRenderer } from "../components/TextRenderer";
import { BoxRenderer } from "../components/BoxRenderer";

import { Colors } from "../tools/Colors";


// ==========================================================
// Camera Movement Demo
//
// Demonstrates:
//
// • Touch camera movement.
// • World space objects.
// • Camera position tracking.
// • Dynamic text.
// • Sprite rendering.
//
// Systems:
// Camera + TouchMove + Renderer
// ==========================================================


export class CameraMove {


  engine: Engine;


  constructor(engine: Engine) {
    this.engine = engine;
  }



  async run(): Promise<void> {



    await AssetManager.loadImage(
      "app",
      "/images/App.png"
    );



    // ==========================================================
    // Scene
    // ==========================================================

    const scene = new Scene();



    // ==========================================================
    // Objects
    // ==========================================================

    const cameraObject = new GameObject();

    const background = new GameObject();

    const icon = new GameObject();

    const info = new GameObject();



    const colors = new Colors();



    // ==========================================================
    // Camera
    // ==========================================================

    cameraObject.addComponent(
      new Camera()
    );


    cameraObject.addComponent(
      new TouchMove(0.5)
    );


    const camera =
      cameraObject.getComponent(Camera);



    // ==========================================================
    // World Background
    // ==========================================================

    background.addComponent(
      new BoxRenderer(
        2000,
        2000,
        "#202020"
      )
    );



    // ==========================================================
    // Sprite Object
    // ==========================================================

    icon.transform.x = 0;
    icon.transform.y = 0;


    icon.addComponent(
      new SpriteRenderer(
        "app",
        80,
        80
      )
    );



    // ==========================================================
    // Information Text
    // ==========================================================

    info.transform.y = -150;


    info.addComponent(
      new TextRenderer(
        "Drag Camera",
        "bold 32px Arial",
        "#49bfe5",
        true,
        "black"
      )
    );


    const text =
      info.getComponent(TextRenderer);



    // ==========================================================
    // Demo Logic
    // ==========================================================

    scene.OnFrame(()=>{


      if(
        !camera ||
        !text
      ) return;



      // Animated color

      text.color =
        colors.rbw(2);



      // Show camera position

      text.text =
      `Camera\nX:${camera.gameObject.transform.x.toFixed(0)}
Y:${camera.gameObject.transform.y.toFixed(0)}`;



    });



    // ==========================================================
    // Build Scene
    // ==========================================================


    scene.add(cameraObject);

    scene.add(background);

    scene.add(icon);

    scene.add(info);



    this.engine.addScene(scene);

    this.engine.loadScene(scene);


  }

}