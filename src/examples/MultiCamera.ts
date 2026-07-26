import { Engine } from "../core/Engine";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";

import { Camera } from "../components/Camera";
import { TextRenderer } from "../components/TextRenderer";
import { BoxRenderer } from "../components/BoxRenderer";
import { CircleRenderer } from "../components/CircleRenderer";


// ==========================================================
// Multi Camera Demo
//
// Demonstrates multiple cameras inside one scene.
//
// Features:
//
// • Two cameras looking at different world regions.
// • Camera 1 moves smoothly on the X axis.
// • Camera 2 uses shake().
// • Automatic active-camera switching.
// • Live status text for the active view.
//
// How cameras work in HSN:
//
// • A Camera is a component on a GameObject.
// • The camera transform is the view position in world space.
// • Only scene.activeCamera is used for rendering.
// • First camera added becomes active automatically.
// • Switch later with scene.setActiveCamera(gameObject).
//
// Camera API used here:
//
// new Camera(zoom)
// camera.shake(intensity, duration)
// scene.setActiveCamera(cameraObject)
//
// World layout in this demo:
//
// Region A (x ≈ 0)   -> Camera 1 + label + markers
// Region B (x ≈ 600) -> Camera 2 + label + markers
//
// Notes:
//
// • Objects stay in the world; only the view changes.
// • shake() offsets the view temporarily.
// • Moving cameraObject.transform moves the view.
// • Zoom is the same on both cameras for a fair comparison.
//
// Related files:
// Camera.ts · Scene.ts
// ==========================================================


export class MultiCamera {

  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async run(): Promise<void> {


    // ==========================================================
    // Scene
    // ==========================================================

    const scene = new Scene();


    // ==========================================================
    // Objects
    // ==========================================================

    const camera1Object = new GameObject("camera1");
    const camera2Object = new GameObject("camera2");

    const text1 = new GameObject("label1");
    const text2 = new GameObject("label2");
    const hud = new GameObject("hud");

    const marker1 = new GameObject("marker1");
    const marker2 = new GameObject("marker2");
    const ground1 = new GameObject("ground1");
    const ground2 = new GameObject("ground2");


    // ==========================================================
    // Cameras
    //
    // camera1 starts at world origin.
    // camera2 is placed at x = 600 (second region).
    // ==========================================================

    camera1Object.addComponent(new Camera(0.9));
    camera2Object.addComponent(new Camera(0.9));
    camera2Object.transform.x = 600;

    const camera1 = camera1Object.getComponent(Camera);
    const camera2 = camera2Object.getComponent(Camera);


    // ==========================================================
    // Region A visuals (Camera 1)
    // ==========================================================

    ground1.addComponent(
      new BoxRenderer(500, 320, "#102018")
    );

    marker1.transform.y = -40;
    marker1.addComponent(
      new CircleRenderer(28, "#22c55e", true, "white", 3)
    );

    text1.transform.y = 80;
    text1.addComponent(
      new TextRenderer(
        "CAMERA 1\nMoving",
        "bold 48px Arial",
        "white",
        true,
        "black",
        3
      )
    );


    // ==========================================================
    // Region B visuals (Camera 2)
    // ==========================================================

    ground2.transform.x = 600;
    ground2.addComponent(
      new BoxRenderer(500, 320, "#201018")
    );

    marker2.transform.x = 600;
    marker2.transform.y = -40;
    marker2.addComponent(
      new CircleRenderer(28, "#ef4444", true, "white", 3)
    );

    text2.transform.x = 600;
    text2.transform.y = 80;
    text2.addComponent(
      new TextRenderer(
        "CAMERA 2\nShake",
        "bold 48px Arial",
        "white",
        true,
        "black",
        3
      )
    );


    // ==========================================================
    // HUD
    //
    // Placed near camera1 start. Still world-space text.
    // Content is updated to show which camera is active.
    // ==========================================================

    hud.transform.y = -150;

    hud.addComponent(
      new TextRenderer(
        "Multi Camera Demo",
        "bold 30px Arial",
        "white",
        true,
        "black",
        3
      )
    );

    const hudText = hud.getComponent(TextRenderer);
    const label1 = text1.getComponent(TextRenderer);
    const label2 = text2.getComponent(TextRenderer);


    // ==========================================================
    // Demo state
    // ==========================================================

    let time = 0;
    let switchTimer = 0;
    let active = 1;
    const switchEvery = 4;


    // ==========================================================
    // Update
    // ==========================================================

    scene.OnFrame((delta: number) => {

      if (!camera1 || !camera2 || !hudText || !label1 || !label2) return;

      time += delta;
      switchTimer += delta;


      // --------------------------
      // Camera 1: horizontal move
      // --------------------------

      camera1Object.transform.x = Math.sin(time * 1.6) * 120;


      // --------------------------
      // Camera 2: continuous shake
      // --------------------------

      camera2.shake(5, 0.25);


      // --------------------------
      // Switch active camera
      // --------------------------

      const remaining = Math.max(0, switchEvery - switchTimer);

      if (switchTimer >= switchEvery) {
        switchTimer = 0;

        if (active === 1) {
          scene.setActiveCamera(camera2Object);
          active = 2;
        } else {
          scene.setActiveCamera(camera1Object);
          active = 1;
        }
      }


      // --------------------------
      // Labels + HUD (white)
      // --------------------------

      label1.color = "white";
      label2.color = "white";
      hudText.color = "white";

      label1.text = "CAMERA 1\nMoving";
      label2.text = "CAMERA 2\nShake";

      // Keep HUD roughly in the active view
      if (active === 1) {
        hud.transform.x = camera1Object.transform.x;
        hud.transform.y = -150;
      } else {
        hud.transform.x = camera2Object.transform.x;
        hud.transform.y = -150;
      }

      hudText.text =
`Multi Camera Demo

Active: Camera ${active}
Switch in ${remaining.toFixed(1)}s

Cam1 X: ${camera1Object.transform.x.toFixed(0)}
Cam2 X: ${camera2Object.transform.x.toFixed(0)}`;
    });


    // ==========================================================
    // Build scene
    //
    // First camera added becomes the initial activeCamera.
    // ==========================================================

    scene.add(camera1Object);
    scene.add(camera2Object);

    scene.add(ground1);
    scene.add(ground2);
    scene.add(marker1);
    scene.add(marker2);
    scene.add(text1);
    scene.add(text2);
    scene.add(hud);

    this.engine.addScene(scene);
    this.engine.loadScene(scene);
  }
}