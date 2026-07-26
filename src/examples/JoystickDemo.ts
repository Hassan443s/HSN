import { Engine } from "../core/Engine";
import { Scene } from "../core/Scene";
import { GameObject } from "../core/GameObject";

import { Camera } from "../components/Camera";
import { BoxRenderer } from "../components/BoxRenderer";
import { CircleRenderer } from "../components/CircleRenderer";
import { TextRenderer } from "../components/TextRenderer";
import { VirtualJoystick } from "../components/VirtualJoystick";


// ==========================================================
// Joystick Demo
//
// Demonstrates:
//
// • VirtualJoystick input (logic only).
// • axisX / axisY / force values.
// • Moving a world object with joystick axes.
// • Drawing the stick with CircleRenderer.
// • Converting screen joystick points to world space.
//
// Systems:
// Camera + VirtualJoystick + CircleRenderer + BoxRenderer
//
// How VirtualJoystick works:
//
// 1. Touch is read in screen space.
// 2. A center point is chosen (fixed corner or first touch).
// 3. Finger offset from center is clamped to radius.
// 4. axisX / axisY are normalized values from -1 to 1.
// 5. Your game code moves objects using those axes.
//
// VirtualJoystick does NOT draw itself.
// This demo draws it with two CircleRenderer objects.
//
// Constructor:
//
// new VirtualJoystick(
//   baseX,            // screen X when fixed / idle
//   baseYFromBottom,  // distance from bottom of screen
//   radius,           // stick radius in pixels
//   fixed             // true = fixed position, false = follow first touch
// )
//
// Useful values:
//
// joy.axisX   -> horizontal direction (-1 .. 1)
// joy.axisY   -> vertical direction (-1 .. 1)
// joy.force   -> how far the stick is pushed (0 .. 1)
// joy.active  -> true while tracking a finger
// joy.centerX / centerY -> base position in screen space
// joy.knobX / knobY     -> knob position in screen space
//
// Player movement:
//
// player.x += joy.axisX * speed * delta
// player.y += joy.axisY * speed * delta
//
// Notes:
//
// • Joystick math is in screen space.
// • Player / camera are in world space.
// • Demo converts center/knob to world each frame for visuals.
// ==========================================================


export class JoystickDemo {

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
    // camera      -> world view
    // player      -> moves with joystick axes
    // info        -> debug text (white)
    // stickBase   -> outer circle visual
    // stickKnob   -> inner circle visual
    // stickLogic  -> VirtualJoystick component only
    // ==========================================================

    const cameraObject = new GameObject("camera");
    const player = new GameObject("player");
    const info = new GameObject("info");
    const stickBase = new GameObject("stickBase");
    const stickKnob = new GameObject("stickKnob");
    const stickLogic = new GameObject("stickLogic");


    // ==========================================================
    // Camera
    // ==========================================================

    cameraObject.addComponent(new Camera(1));

    const camera = cameraObject.getComponent(Camera);


    // ==========================================================
    // Player
    // ==========================================================

    player.addComponent(
      new BoxRenderer(70, 70, "deepskyblue", true, "white", 3)
    );


    // ==========================================================
    // Info text (white only)
    // ==========================================================

    info.transform.y = -200;

    info.addComponent(
      new TextRenderer(
        "Joystick Demo",
        "bold 28px Arial",
        "white",
        true,
        "black",
        3
      )
    );

    const text = info.getComponent(TextRenderer);


    // ==========================================================
    // Joystick logic
    //
    // fixed = false -> center appears at first touch
    // fixed = true  -> center stays at baseX / baseY
    // ==========================================================

    const stickRadius = 75;

    stickLogic.addComponent(
      new VirtualJoystick(110, 150, stickRadius, false)
    );

    const joy = stickLogic.getComponent(VirtualJoystick);


    // ==========================================================
    // Joystick visuals (CircleRenderer)
    //
    // Positions are updated every frame from joy.center / joy.knob
    // after converting screen -> world.
    // ==========================================================

    stickBase.addComponent(
      new CircleRenderer(
        stickRadius,
        "rgba(255,255,255,0.10)",
        true,
        "rgba(255,255,255,0.40)",
        3
      )
    );

    stickKnob.addComponent(
      new CircleRenderer(
        stickRadius * 0.42,
        "rgba(255,255,255,0.28)",
        true,
        "rgba(255,255,255,0.55)",
        2
      )
    );


    // ==========================================================
    // Screen point -> world point
    //
    // VirtualJoystick uses screen pixels.
    // CircleRenderer draws in world space under the camera.
    // ==========================================================

    const screenToWorld = (sx: number, sy: number) => {
      if (!camera) {
        return { x: sx, y: sy };
      }

      return camera.screenToWorld(
        sx,
        sy,
        this.engine.viewWidth,
        this.engine.viewHeight
      );
    };


    // ==========================================================
    // Update
    // ==========================================================

    const speed = 230;

    scene.OnFrame((delta: number) => {

      if (!joy || !text) return;


      // --------------------------
      // Move player with axes
      // --------------------------

      player.transform.x += joy.axisX * speed * delta;
      player.transform.y += joy.axisY * speed * delta;


      // --------------------------
      // Sync stick visuals
      // --------------------------

      const base = screenToWorld(joy.centerX, joy.centerY);
      const knob = screenToWorld(joy.knobX, joy.knobY);

      stickBase.transform.x = base.x;
      stickBase.transform.y = base.y;

      stickKnob.transform.x = knob.x;
      stickKnob.transform.y = knob.y;

      stickBase.active = true;
      stickKnob.active = true;


      // --------------------------
      // Debug text (white)
      // --------------------------

      text.color = "white";

      text.text =
`Joystick Demo

axisX: ${joy.axisX.toFixed(2)}
axisY: ${joy.axisY.toFixed(2)}
force: ${joy.force.toFixed(2)}
active: ${joy.active ? "yes" : "no"}

Touch and drag to move`;
    });


    // ==========================================================
    // Build scene
    //
    // Order: later objects draw above earlier ones.
    // ==========================================================

    scene.add(cameraObject);
    scene.add(player);
    scene.add(info);
    scene.add(stickBase);
    scene.add(stickKnob);
    scene.add(stickLogic);

    this.engine.addScene(scene);
    this.engine.loadScene(scene);
  }
}