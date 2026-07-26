import { Engine } from "../core/Engine";
import { Scene } from "../core/Scene";
import { GameObject } from "../core/GameObject";

import { Camera } from "../components/Camera";
import { BoxRenderer } from "../components/BoxRenderer";
import { CircleRenderer } from "../components/CircleRenderer";
import { TextRenderer } from "../components/TextRenderer";
import { VirtualJoystick } from "../components/VirtualJoystick";


// ==========================================================
// Camera Follow Demo
//
// Demonstrates smooth camera tracking of a moving player.
//
// Features:
//
// • camera.target = player
// • Smooth follow with frame-independent lerp
// • lateFollow runs AFTER player movement (no stutter)
// • VirtualJoystick drives the player
// • World markers to judge camera motion
//
// Why follow used to stutter:
//
// 1. Camera updated before the target moved in OnFrame
// 2. Old formula: (target - cam) * speed * delta
//    can overshoot or feel uneven when delta changes
//
// Fixed pipeline:
//
// objects.update -> OnFrame (move player) -> camera.lateFollow
//
// Camera follow API:
//
// camera.target = playerObject
// camera.smooth = true
// camera.smoothSpeed = 8   // higher = snappier
// camera.offsetX / offsetY // look ahead / bias
//
// Related files:
// Camera.ts · Scene.ts · VirtualJoystick.ts
// ==========================================================


export class CameraFollowDemo {

  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async run(): Promise<void> {

    const scene = new Scene();


    // ==========================================================
    // Objects
    // ==========================================================

    const cameraObject = new GameObject("camera");
    const player = new GameObject("player");
    const hud = new GameObject("hud");
    const stickLogic = new GameObject("joystick");


    // ==========================================================
    // Camera follow setup
    // ==========================================================

    const cam = cameraObject.addComponent(new Camera(0.9));
    cam.target = player;
    cam.smooth = true;
    cam.smoothSpeed = 8;
    cam.offsetX = 0;
    cam.offsetY = 0;


    // ==========================================================
    // Player
    // ==========================================================

    player.addComponent(
      new CircleRenderer(28, "#38bdf8", true, "white", 3)
    );


    // ==========================================================
    // World grid markers (to see follow clearly)
    // ==========================================================

    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        if (i === 0 && j === 0) continue;

        const cell = new GameObject(`cell_${i}_${j}`);
        cell.transform.x = i * 180;
        cell.transform.y = j * 180;
        cell.addComponent(
          new BoxRenderer(
            40,
            40,
            (i + j) % 2 === 0 ? "#1e293b" : "#334155",
            true,
            "#64748b",
            1
          )
        );
        scene.add(cell);
      }
    }


    // ==========================================================
    // HUD (world text near player, updated each frame)
    // ==========================================================

    hud.addComponent(
      new TextRenderer(
        "Camera Follow",
        "bold 28px Arial",
        "white",
        true,
        "black",
        3
      )
    );

    const text = hud.getComponent(TextRenderer);


    // ==========================================================
    // Joystick
    // ==========================================================

    stickLogic.addComponent(
      new VirtualJoystick(110, 150, 70, false)
    );

    const joy = stickLogic.getComponent(VirtualJoystick);


    // ==========================================================
    // Update: move player only
    // Camera follow happens later in Scene.update via lateFollow
    // ==========================================================

    const speed = 240;

    scene.OnFrame((delta: number) => {
      if (!joy || !text || !cam) return;

      player.transform.x += joy.axisX * speed * delta;
      player.transform.y += joy.axisY * speed * delta;

      hud.transform.x = player.transform.x;
      hud.transform.y = player.transform.y - 70;

      text.color = "white";
      text.text =
`Camera Follow

Player: ${player.transform.x.toFixed(0)}, ${player.transform.y.toFixed(0)}
Camera: ${cameraObject.transform.x.toFixed(0)}, ${cameraObject.transform.y.toFixed(0)}
smoothSpeed: ${cam.smoothSpeed}
smooth: ${cam.smooth ? "on" : "off"}`;
    });


    // ==========================================================
    // Build
    // ==========================================================

    scene.add(cameraObject);
    scene.add(player);
    scene.add(hud);
    scene.add(stickLogic);

    this.engine.addScene(scene);
    this.engine.loadScene(scene);
  }
}