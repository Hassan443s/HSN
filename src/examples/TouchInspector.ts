import { Engine } from "../core/Engine";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";
import { Touch } from "../core/Touch";

import { Camera } from "../components/Camera";
import { BoxRenderer } from "../components/BoxRenderer";
import { CircleRenderer } from "../components/CircleRenderer";
import { TextRenderer } from "../components/TextRenderer";

import { Collision } from "../physics/Collision";


// ==========================================================
// Touch Inspector Demo
//
// A debug-style showcase for mobile touch → world hit testing.
//
// Demonstrates:
//
// • Touch screen coordinates (Touch.x / Touch.y)
// • Camera.screenToWorld conversion
// • Collision.pointInObject hover tests
// • Live pointer drawn in world space
// • Press / release state from Touch
// • Smooth hover scale feedback
//
// Core pipeline:
//
// 1. Finger on screen     -> Touch.x, Touch.y (pixels)
// 2. Convert              -> camera.screenToWorld(...)
// 3. Move pointer object  -> pointer.transform = world point
// 4. Hit test target      -> Collision.pointInObject(...)
// 5. React                -> color, scale, HUD text
//
// Touch flags:
//
// Touch.pressed       -> finger is down
// Touch.justPressed   -> became pressed this frame
// Touch.justReleased  -> became released this frame
//
// Why screenToWorld is required:
//
// UI fingers use screen space.
// Gameplay objects use world space under the camera.
// Mixing them without conversion breaks hit tests.
//
// Related files:
// Touch.ts · Camera.ts · Collision.ts
// ==========================================================


export class TouchInspector {

  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async run(): Promise<void> {


    // ==========================================================
    // Config
    // ==========================================================

    const targetSize = 150;


    // ==========================================================
    // Scene & objects
    // ==========================================================

    const scene = new Scene();

    const cameraObject = new GameObject("camera");
    const panel = new GameObject("panel");
    const target = new GameObject("target");
    const pointer = new GameObject("pointer");
    const pointerRing = new GameObject("pointerRing");
    const info = new GameObject("info");
    const coords = new GameObject("coords");
    const stateText = new GameObject("state");


    // ==========================================================
    // Camera
    // ==========================================================

    cameraObject.addComponent(new Camera(1));
    const camera = cameraObject.getComponent(Camera);


    // ==========================================================
    // Background panel
    // ==========================================================

    panel.addComponent(
      new BoxRenderer(420, 520, "#12161e", true, "#2a3344", 2)
    );


    // ==========================================================
    // Target (hover box)
    // ==========================================================

    target.transform.y = 40;

    target.addComponent(
      new BoxRenderer(targetSize, targetSize, "#ea580c", true, "white", 3)
    );

    const targetRenderer = target.getComponent(BoxRenderer);


    // ==========================================================
    // Pointer + ring
    //
    // Follows the finger in world space after conversion.
    // ==========================================================

    pointer.addComponent(
      new CircleRenderer(10, "#22d3ee", true, "white", 2)
    );

    pointerRing.addComponent(
      new CircleRenderer(22, "transparent", true, "rgba(34,211,238,0.45)", 2)
    );

    const pointerRenderer = pointer.getComponent(CircleRenderer);
    const ringRenderer = pointerRing.getComponent(CircleRenderer);


    // ==========================================================
    // HUD
    // ==========================================================

    info.transform.y = -200;
    info.addComponent(
      new TextRenderer(
        "Touch Inspector",
        "bold 34px Arial",
        "white",
        true,
        "black",
        3
      )
    );

    stateText.transform.y = -145;
    stateText.addComponent(
      new TextRenderer(
        "Move your finger",
        "bold 26px Arial",
        "white",
        true,
        "black",
        2
      )
    );

    coords.transform.y = 200;
    coords.addComponent(
      new TextRenderer(
        "—",
        "bold 22px Arial",
        "white",
        true,
        "black",
        2
      )
    );

    const title = info.getComponent(TextRenderer);
    const state = stateText.getComponent(TextRenderer);
    const coordLabel = coords.getComponent(TextRenderer);


    // ==========================================================
    // State
    // ==========================================================

    let hover = false;
    let scale = 1;
    let taps = 0;


    // ==========================================================
    // Update
    // ==========================================================

    scene.OnFrame((delta: number) => {

      if (
        !camera ||
        !targetRenderer ||
        !pointerRenderer ||
        !ringRenderer ||
        !title ||
        !state ||
        !coordLabel
      ) return;


      // --------------------------
      // Screen -> world
      // --------------------------

      const world = camera.screenToWorld(
        Touch.x,
        Touch.y,
        this.engine.viewWidth,
        this.engine.viewHeight
      );


      // --------------------------
      // Pointer follows finger
      // --------------------------

      pointer.transform.x = world.x;
      pointer.transform.y = world.y;
      pointerRing.transform.x = world.x;
      pointerRing.transform.y = world.y;

      const showPointer = Touch.pressed;
      pointer.active = showPointer;
      pointerRing.active = showPointer;

      if (showPointer) {
        const pulse = 1 + Math.sin(performance.now() * 0.012) * 0.15;
        pointerRing.transform.scaleX = pulse;
        pointerRing.transform.scaleY = pulse;
      }


      // --------------------------
      // Hover test
      // --------------------------

      hover = Collision.pointInObject(
        world.x,
        world.y,
        target,
        targetSize,
        targetSize
      );

      if (hover && Touch.justPressed) {
        taps++;
        scale = 1.22;
      }

      if (hover) {
        targetRenderer.color = Touch.pressed ? "#fbbf24" : "#fb923c";
        scale = Math.max(scale, 1.12);
      } else {
        targetRenderer.color = "#ea580c";
        if (scale < 1.05) scale = 1;
      }

      target.transform.scaleX += (scale - target.transform.scaleX) * 10 * delta;
      target.transform.scaleY += (scale - target.transform.scaleY) * 10 * delta;
      scale += (1 - scale) * 4 * delta;


      // --------------------------
      // HUD (white)
      // --------------------------

      title.color = "white";
      state.color = "white";
      coordLabel.color = "white";

      title.text = "Touch Inspector";

      if (!Touch.pressed) {
        state.text = "Finger up · move over the box";
      } else if (hover) {
        state.text = Touch.justPressed
          ? `Pressed inside · taps ${taps}`
          : `Hovering inside · taps ${taps}`;
      } else {
        state.text = "Finger down · outside target";
      }

      coordLabel.text =
`Screen: ${Touch.x.toFixed(0)}, ${Touch.y.toFixed(0)}
World:  ${world.x.toFixed(1)}, ${world.y.toFixed(1)}
pressed: ${Touch.pressed}
hover: ${hover}  taps: ${taps}`;
    });


    // ==========================================================
    // Build scene
    // ==========================================================

    scene.add(cameraObject);
    scene.add(panel);
    scene.add(target);
    scene.add(pointerRing);
    scene.add(pointer);
    scene.add(info);
    scene.add(stateText);
    scene.add(coords);

    this.engine.addScene(scene);
    this.engine.loadScene(scene);
  }
}