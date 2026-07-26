import { Engine } from "../core/Engine";
import { Scene } from "../core/Scene";
import { GameObject } from "../core/GameObject";

import { Camera } from "../components/Camera";
import { CircleRenderer } from "../components/CircleRenderer";
import { BoxRenderer } from "../components/BoxRenderer";
import { TextRenderer } from "../components/TextRenderer";

import { Colors } from "../tools/Colors";


// ==========================================================
// Circle Renderer Showcase
//
// Demonstrates:
//
// • CircleRenderer (filled and stroke-only rings).
// • Multiple GameObjects in one scene.
// • Camera + world space rendering.
// • Transform position / rotation / scale.
// • Orbit motion around a moving parent point.
// • Pulse scale animation with delta time.
// • Transparent fill + stroke for ring shapes.
//
// Systems:
// Camera + CircleRenderer + BoxRenderer + Transform
//
// CircleRenderer constructor:
//
// new CircleRenderer(
//   radius,        // circle radius in world units
//   color,         // fill color (use "transparent" for rings)
//   stroke,        // true = draw outline
//   strokeColor,   // outline color
//   strokeSize     // outline thickness
// )
//
// Transform used in this demo:
//
// transform.x / y     -> world position
// transform.rot       -> rotation in radians
// transform.scaleX/Y  -> size multiplier
//
// Notes:
//
// • All motion is driven by scene.OnFrame(delta).
// • delta keeps animation speed stable across devices.
// • Draw order follows scene.add order (later = above).
// • Rings use transparent fill + stroke only.
// • Orbit objects follow the core position each frame.
// ==========================================================


export class CircleDemo {

  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async run(): Promise<void> {


    // ==========================================================
    // Scene
    // ==========================================================

    const scene = new Scene();
    const colors = new Colors();


    // ==========================================================
    // Objects
    //
    // camera     -> controls the view
    // background -> dark world panel
    // core       -> main pulsing circle
    // orbit1/2   -> small circles orbiting the core
    // ring1/2    -> stroke-only rings around the core
    // title      -> info text
    // ==========================================================

    const cameraObject = new GameObject("camera");
    const background = new GameObject("background");
    const core = new GameObject("core");
    const orbit1 = new GameObject("orbit1");
    const orbit2 = new GameObject("orbit2");
    const ring1 = new GameObject("ring1");
    const ring2 = new GameObject("ring2");
    const title = new GameObject("title");


    // ==========================================================
    // Camera
    //
    // Zoom 0.85 keeps the whole showcase visible on phones.
    // ==========================================================

    cameraObject.addComponent(new Camera(0.85));


    // ==========================================================
    // Background
    // ==========================================================

    background.addComponent(
      new BoxRenderer(1400, 1000, "#0c0c14")
    );


    // ==========================================================
    // Core circle
    //
    // Filled circle + white stroke.
    // Animated with float, pulse, and rotation.
    // ==========================================================

    core.addComponent(
      new CircleRenderer(36, "#00d9ff", true, "white", 3)
    );

    const coreRenderer = core.getComponent(CircleRenderer);


    // ==========================================================
    // Orbit circles
    //
    // Smaller filled circles that rotate around the core.
    // ==========================================================

    orbit1.addComponent(
      new CircleRenderer(14, "#ff3d81", true, "white", 2)
    );

    orbit2.addComponent(
      new CircleRenderer(14, "#a855ff", true, "white", 2)
    );

    const orbit1Renderer = orbit1.getComponent(CircleRenderer);
    const orbit2Renderer = orbit2.getComponent(CircleRenderer);


    // ==========================================================
    // Rings
    //
    // radius only + transparent fill = hollow rings.
    // Position is locked to the core every frame.
    // ==========================================================

    ring1.addComponent(
      new CircleRenderer(72, "transparent", true, "#008cff", 2)
    );

    ring2.addComponent(
      new CircleRenderer(112, "transparent", true, "#ff3d81", 2)
    );

    const ring1Renderer = ring1.getComponent(CircleRenderer);
    const ring2Renderer = ring2.getComponent(CircleRenderer);


    // ==========================================================
    // Title
    // ==========================================================

    title.transform.y = -220;

    title.addComponent(
      new TextRenderer(
        "CircleRenderer Demo",
        "bold 34px Arial",
        "white",
        true,
        "black",
        3
      )
    );

    const text = title.getComponent(TextRenderer);


    // ==========================================================
    // Animation state
    // ==========================================================

    let time = 0;


    // ==========================================================
    // Update loop
    //
    // time accumulates seconds.
    // All motion uses time or delta for smooth animation.
    // ==========================================================

    scene.OnFrame((delta: number) => {

      if (
        !coreRenderer ||
        !orbit1Renderer ||
        !orbit2Renderer ||
        !ring1Renderer ||
        !ring2Renderer ||
        !text
      ) return;

      time += delta;


      // --------------------------
      // Core: float + pulse + spin
      // --------------------------

      core.transform.x = Math.sin(time * 1.4) * 45;
      core.transform.y = Math.cos(time * 1.2) * 32;

      const pulse = 1 + Math.sin(time * 4.5) * 0.18;
      core.transform.scaleX = pulse;
      core.transform.scaleY = pulse;
      core.transform.rot = time * 0.8;

      coreRenderer.color = colors.rbw(6);


      // --------------------------
      // Rings: follow core + spin
      // --------------------------

      ring1.transform.x = core.transform.x;
      ring1.transform.y = core.transform.y;
      ring1.transform.rot = time * 1.2;

      ring2.transform.x = core.transform.x;
      ring2.transform.y = core.transform.y;
      ring2.transform.rot = -time * 0.9;

      ring1.transform.scaleX = 1 + Math.sin(time * 2) * 0.05;
      ring1.transform.scaleY = ring1.transform.scaleX;

      ring2.transform.scaleX = 1 + Math.cos(time * 2) * 0.05;
      ring2.transform.scaleY = ring2.transform.scaleX;


      // --------------------------
      // Orbits: circle around core
      // --------------------------

      const orbitRadius = 105;

      orbit1.transform.x =
        core.transform.x + Math.cos(time * 2.6) * orbitRadius;
      orbit1.transform.y =
        core.transform.y + Math.sin(time * 2.6) * orbitRadius;

      orbit2.transform.x =
        core.transform.x + Math.cos(time * 2.6 + Math.PI) * orbitRadius;
      orbit2.transform.y =
        core.transform.y + Math.sin(time * 2.6 + Math.PI) * orbitRadius;

      const orbitPulse = 1 + Math.sin(time * 6) * 0.2;
      orbit1.transform.scaleX = orbitPulse;
      orbit1.transform.scaleY = orbitPulse;
      orbit2.transform.scaleX = orbitPulse;
      orbit2.transform.scaleY = orbitPulse;


      // --------------------------
      // Info text
      // --------------------------

      text.color = "white";
      text.text =
`CircleRenderer Demo

Core scale: ${pulse.toFixed(2)}
Orbit radius: ${orbitRadius}
Rings: stroke only`;
    });


    // ==========================================================
    // Build scene
    //
    // Draw order (bottom -> top):
    // background, rings, core, orbits, title, camera object
    // ==========================================================

    scene.add(cameraObject);
    scene.add(background);
    scene.add(ring2);
    scene.add(ring1);
    scene.add(core);
    scene.add(orbit1);
    scene.add(orbit2);
    scene.add(title);

    this.engine.addScene(scene);
    this.engine.loadScene(scene);
  }
}