import { Engine } from "../core/Engine";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";
import { Touch } from "../core/Touch";

import { Camera } from "../components/Camera";
import { BoxRenderer } from "../components/BoxRenderer";
import { TextRenderer } from "../components/TextRenderer";

import { Collision } from "../physics/Collision";
import { Colors } from "../tools/Colors";


// ==========================================================
// Touch Inspector Demo
//
// Demonstrates:
//
// • Touch input.
// • Screen to world conversion.
// • Point collision.
// • Object hover effect.
// • Real-time information display.
//
// Systems:
// Touch + Camera + Collision + Components
// ==========================================================


export class TouchInspector {


  engine: Engine;


  constructor(engine: Engine) {
    this.engine = engine;
  }



  async run(): Promise<void> {


    const colors = new Colors();


    // ==========================================================
    // Create Scene
    // ==========================================================

    const scene = new Scene();



    // ==========================================================
    // Create Objects
    // ==========================================================

    const cameraObject = new GameObject();

    const target = new GameObject();

    const pointer = new GameObject();

    const info = new GameObject();



    // ==========================================================
    // Camera
    // ==========================================================

    cameraObject.addComponent(
      new Camera()
    );


    const camera =
      cameraObject.getComponent(Camera);



    // ==========================================================
    // Target Object
    // ==========================================================

    const size = 120;


    target.addComponent(
      new BoxRenderer(
        size,
        size,
        "darkorange",
        true,
        "white",
        3
      )
    );


    const targetRenderer =
      target.getComponent(BoxRenderer);



    // ==========================================================
    // Touch Pointer
    // ==========================================================

    pointer.addComponent(
      new BoxRenderer(
        16,
        16,
        "cyan"
      )
    );


    const pointerRenderer =
      pointer.getComponent(BoxRenderer);



    // ==========================================================
    // Info Text
    // ==========================================================

    info.transform.y = -170;


    info.addComponent(
      new TextRenderer(
        "Move your finger",
        "bold 32px Arial",
        "white"
      )
    );


    const text =
      info.getComponent(TextRenderer);



    // ==========================================================
    // State
    // ==========================================================

    let hover = false;
    let scale = 1;



    // ==========================================================
    // Update
    // ==========================================================

    scene.OnFrame((delta:number)=>{


      if(
        !camera ||
        !targetRenderer ||
        !pointerRenderer ||
        !text
      ) return;



      // Text rainbow animation

      text.color =
        colors.rbw(5);



      // Screen position -> World position

      const world =
        camera.screenToWorld(
          Touch.x,
          Touch.y,
          this.engine.viewWidth,
          this.engine.viewHeight
        );



      // Move touch indicator

      pointer.transform.x = world.x;
      pointer.transform.y = world.y;



      // Collision check

      hover =
        Collision.pointInObject(
          world.x,
          world.y,
          target,
          size,
          size
        );



      if(hover){


        targetRenderer.color =
          "#ffb347";


        scale = 1.15;


        text.text =
          `Hover ✓\nWorld X:${world.x.toFixed(0)} Y:${world.y.toFixed(0)}`;


      }else{


        targetRenderer.color =
          "darkorange";


        scale = 1;


        text.text =
          `Outside\nWorld X:${world.x.toFixed(0)} Y:${world.y.toFixed(0)}`;

      }



      // Smooth scale animation

      target.transform.scaleX +=
        (scale - target.transform.scaleX) *
        8 *
        delta;


      target.transform.scaleY +=
        (scale - target.transform.scaleY) *
        8 *
        delta;



    });



    // ==========================================================
    // Build Scene
    // ==========================================================

    scene.add(cameraObject);

    scene.add(target);

    scene.add(pointer);

    scene.add(info);



    this.engine.addScene(scene);

    this.engine.loadScene(scene);


  }

}