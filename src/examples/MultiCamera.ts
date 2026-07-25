import { Engine } from "../core/Engine";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";

import { Camera } from "../components/Camera";
import { TextRenderer } from "../components/TextRenderer";


// ==========================================================
// Multi Camera Example
//
// • Creates multiple cameras in one scene.
// • Each camera views a different world position.
// • Demonstrates movement and camera shake.
// • Switches active camera automatically.
// ==========================================================


export class MultiCamera {

  engine: Engine;


  constructor(engine: Engine) {
    this.engine = engine;
  }


  async run(): Promise<void> {


    // ==========================================================
    // Create Scene & Objects
    // ==========================================================

    const scene = new Scene();


    const camera1Object = new GameObject();
    const camera2Object = new GameObject();


    const text1 = new GameObject();
    const text2 = new GameObject();



    // ==========================================================
    // Camera Setup
    // ==========================================================


    camera1Object.addComponent(
      new Camera(1)
    );


    camera2Object.addComponent(
      new Camera(1)
    );


    const camera1 =
      camera1Object.getComponent(Camera);

    const camera2 =
      camera2Object.getComponent(Camera);



    // Put cameras in different areas.

    camera2Object.transform.x = 600;



    // ==========================================================
    // World Labels
    // ==========================================================


    text1.addComponent(
      new TextRenderer(
        "CAMERA 1\nMoving",
        "bold 60px Arial",
        "darkgreen"
      )
    );


    text2.transform.x = 600;


    text2.addComponent(
      new TextRenderer(
        "CAMERA 2\nShake",
        "bold 60px Arial",
        "darkred"
      )
    );



    // ==========================================================
    // Demo Logic
    // ==========================================================

    let time = 0;

    let switchTimer = 0;

    let active = 1;



    scene.OnFrame((delta:number)=>{


      if(!camera1 || !camera2)
        return;



      time += delta;


      // Camera 1 movement

      camera1Object.transform.x =
        Math.sin(time * 2) * 150;



      // Camera 2 shake

      camera2.shake(
        4,
        0.2
      );



      // Switch active camera every 5 seconds

      switchTimer += delta;


      if(switchTimer > 5){

        switchTimer = 0;


        if(active === 1){

          scene.setActiveCamera(
            camera2Object
          );

          active = 2;

        }else{

          scene.setActiveCamera(
            camera1Object
          );

          active = 1;

        }

      }


    });



    // ==========================================================
    // Build Scene
    // ==========================================================


    scene.add(camera1Object);
    scene.add(camera2Object);

    scene.add(text1);
    scene.add(text2);



    this.engine.addScene(scene);

    this.engine.loadScene(scene);


  }

}