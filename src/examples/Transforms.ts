import { Engine } from "../core/Engine";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";

import { Camera } from "../components/Camera";
import { BoxRenderer } from "../components/BoxRenderer";
import { TextRenderer } from "../components/TextRenderer";

import { Colors } from "../tools/Colors";


// ==========================================================
// Transform System Demo
//
// Demonstrates the Transform component in world space.
//
// Features:
//
// • Position movement (translate).
// • Continuous rotation.
// • Pulse scaling.
// • Smooth animation with delta time.
// • Live debug values on screen.
// • Camera-based world rendering.
//
// Transform properties:
//
// transform.x        -> world X position
// transform.y        -> world Y position
// transform.rot      -> rotation in radians
// transform.scaleX   -> horizontal scale
// transform.scaleY   -> vertical scale
//
// How this demo is organized:
//
// 1. scaleBox  -> only scaleX / scaleY change
// 2. moveBox   -> only x changes
// 3. rotateBox -> only rot changes
// 4. title     -> shows the current values
//
// Notes:
//
// • All objects live in World Space.
// • The Camera decides what appears on screen.
// • Prefer delta-based motion for stable speed on all devices.
// • Cache getComponent() results outside the frame loop.
// • Draw order follows scene.add order (later = above).
//
// Related files:
// Transform.ts · Camera.ts · BoxRenderer.ts
// ==========================================================


export class Transforms {

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
    //
    // camera    -> controls the view
    // scaleBox  -> scaling demo
    // moveBox   -> position demo
    // rotateBox -> rotation demo
    // title     -> live values
    // ==========================================================

    const camera = new GameObject("camera");
    const scaleBox = new GameObject("scaleBox");
    const moveBox = new GameObject("moveBox");
    const rotateBox = new GameObject("rotateBox");
    const title = new GameObject("title");


    // ==========================================================
    // Camera
    //
    // Zoom 0.65 keeps all three demos visible on phones.
    // Objects use world coordinates only.
    // ==========================================================

    camera.addComponent(new Camera(0.65));


    // ==========================================================
    // Scale demo
    //
    // scaleX / scaleY pulse over time.
    // ==========================================================

    scaleBox.transform.y = -140;

    scaleBox.addComponent(
      new BoxRenderer(100, 100, "orange", true, "white", 3)
    );


    // ==========================================================
    // Position demo
    //
    // x moves left and right with Math.sin.
    // ==========================================================

    moveBox.transform.y = 40;

    moveBox.addComponent(
      new BoxRenderer(100, 100, "red", true, "white", 3)
    );


    // ==========================================================
    // Rotation demo
    //
    // rot increases every frame using delta.
    // ==========================================================

    rotateBox.transform.y = 220;

    rotateBox.addComponent(
      new BoxRenderer(100, 100, "hotpink", true, "white", 3)
    );


    // ==========================================================
    // Info text
    // ==========================================================

    title.transform.y = -280;

    title.addComponent(
      new TextRenderer(
        "Transform System",
        "bold 40px Arial",
        "white",
        true,
        "black",
        3
      )
    );


    // ==========================================================
    // Cache components
    //
    // Avoid getComponent() every frame.
    // ==========================================================

    const scaleRenderer = scaleBox.getComponent(BoxRenderer);
    const moveRenderer = moveBox.getComponent(BoxRenderer);
    const rotateRenderer = rotateBox.getComponent(BoxRenderer);
    const text = title.getComponent(TextRenderer);


    // ==========================================================
    // Helpers
    // ==========================================================

    const color1 = new Colors();
    const color2 = new Colors();
    const color3 = new Colors();

    let time = 0;


    // ==========================================================
    // Update loop
    //
    // delta = seconds since last frame.
    // Multiply speeds by delta for stable motion.
    // ==========================================================

    scene.OnFrame((delta: number) => {

      if (!scaleRenderer || !moveRenderer || !rotateRenderer || !text) {
        return;
      }

      time += delta;


      // --------------------------
      // Scale
      // --------------------------

      const scale = 1 + Math.sin(time * 4) * 0.3;
      scaleBox.transform.scaleX = scale;
      scaleBox.transform.scaleY = scale;


      // --------------------------
      // Position
      // --------------------------

      moveBox.transform.x = Math.sin(time * 2) * 180;


      // --------------------------
      // Rotation
      // rot += angularSpeed * delta
      // Math.PI rad/s = 180 deg/s
      // --------------------------

      rotateBox.transform.rot += Math.PI * delta;


      // --------------------------
      // Colors
      // --------------------------

      scaleRenderer.color = color1.rbw(5);
      moveRenderer.color = color2.rbw(7);
      rotateRenderer.color = color3.rbw(10);


      // --------------------------
      // Debug text (white)
      // --------------------------

      text.color = "white";
      text.text =
`Transform System

Scale: ${scale.toFixed(2)}
Position X: ${moveBox.transform.x.toFixed(1)}
Rotation: ${rotateBox.transform.rot.toFixed(2)}`;
    });


    // ==========================================================
    // Build scene
    //
    // Later add() calls draw above earlier ones.
    // ==========================================================

    scene.add(camera);
    scene.add(scaleBox);
    scene.add(moveBox);
    scene.add(rotateBox);
    scene.add(title);

    this.engine.addScene(scene);
    this.engine.loadScene(scene);
  }
}