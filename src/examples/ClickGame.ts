import { Engine } from "../core/Engine";
import { Scene } from "../core/Scene";
import { GameObject } from "../core/GameObject";

import { Touch } from "../core/Touch";

import { Camera } from "../components/Camera";
import { BoxRenderer } from "../components/BoxRenderer";
import { TextRenderer } from "../components/TextRenderer";

import { Collision } from "../physics/Collision";
import { Colors } from "../tools/Colors";


// ==========================================================
// Click Game Example
//
// • Touch input example.
// • Tap the button to increase the score.
// • Demonstrates Touch + Collision + Components.
// ==========================================================


export class ClickGame {

  engine: Engine;


  constructor(engine: Engine) {
    this.engine = engine;
  }


  async run(): Promise<void> {


    // ==========================================================
    // Variables
    // ==========================================================

    let score = 0;
    let scale = 1;

    const colors = new Colors();



    // ==========================================================
    // Create Scene & Objects
    // ==========================================================

    const scene = new Scene();

    const cameraObject = new GameObject();
    const button = new GameObject();
    const scoreText = new GameObject();



    // ==========================================================
    // Camera
    // ==========================================================

    cameraObject.addComponent(
      new Camera()
    );

    const camera =
      cameraObject.getComponent(Camera);



    // ==========================================================
    // Button
    // ==========================================================

    button.addComponent(
      new BoxRenderer(
        180,
        80,
        "darkorange",
        true,
        "white",
        3
      )
    );

    const buttonRenderer =
      button.getComponent(BoxRenderer);



    // ==========================================================
    // Score Text
    // ==========================================================

    scoreText.transform.y = -120;

    scoreText.addComponent(
      new TextRenderer(
        "Score: 0",
        "bold 40px Arial",
        "darkred",
        true,
        "white"
      )
    );

    const text =
      scoreText.getComponent(TextRenderer);



    // ==========================================================
    // Game Logic
    // ==========================================================

    scene.OnFrame((delta:number)=>{


      if(
        !camera ||
        !buttonRenderer ||
        !text
      ) return;



      text.color =
        colors.rbw(5);



      // Convert touch position.

      const world =
        camera.screenToWorld(
          Touch.x,
          Touch.y,
          this.engine.viewWidth,
          this.engine.viewHeight
        );



      const clicked =
        Touch.justPressed &&
        Collision.pointInObject(
          world.x,
          world.y,
          button,
          180,
          80
        );



      if(clicked){

        score++;

        text.text =
          `Score: ${score}`;


        // Click effect.

        scale = 1.2;

      }



      // Return scale smoothly.

      scale +=
        (1 - scale) * 5 * delta;


      button.transform.scaleX = scale;
      button.transform.scaleY = scale;


    });



    // ==========================================================
    // Build Scene
    // ==========================================================

    scene.add(cameraObject);
    scene.add(button);
    scene.add(scoreText);


    this.engine.addScene(scene);
    this.engine.loadScene(scene);


  }

}