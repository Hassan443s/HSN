import { Engine } from "../core/Engine";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";

import { AssetManager } from "../core/AssetManager";

import { Camera } from "../components/Camera";
import { SpriteRenderer } from "../components/SpriteRenderer";
import { TextRenderer } from "../components/TextRenderer";
import { BoxRenderer } from "../components/BoxRenderer";


// ==========================================================
// Multi Scene Demo
//
// Demonstrates the Scene management system.
//
// Features:
//
// • Two independent scenes.
// • Each scene has its own camera and objects.
// • Automatic switching with engine.loadScene().
// • Countdown text while a scene is active.
// • Shared switch logic on BOTH scenes.
//
// Important:
//
// Only the current scene receives update / draw.
// If switch logic lives only on scene1, switching to
// scene2 will stop that logic and you get stuck.
// This demo registers the same switch handler on both.
//
// Engine scene API:
//
// engine.addScene(scene)   -> register a scene
// engine.loadScene(scene)  -> activate a scene
// scene.hasStarted         -> true after first start()
//
// loadScene behavior:
//
// • First time  -> scene.start()
// • Next times  -> scene.enter()
// • Previous    -> scene.exit()
//
// Notes:
//
// • Scenes do not share objects.
// • Each scene needs its own Camera to render correctly.
// • Assets can be loaded once and reused in any scene.
//
// Related files:
// Engine.ts · Scene.ts · AssetManager.ts
// ==========================================================


export class MultiScene {

  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async run(): Promise<void> {


    // ==========================================================
    // Load assets once
    // ==========================================================

    await AssetManager.loadImage("app", "/images/App.png");


    // ==========================================================
    // Create scenes
    // ==========================================================

    const scene1 = new Scene();
    const scene2 = new Scene();


    // ==========================================================
    // Shared switch state
    //
    // Kept outside both scenes so either active scene can use it.
    // ==========================================================

    const switchEvery = 3;
    let timer = 0;
    let current = 1;


    const switchLogic = (delta: number) => {
      timer += delta;

      const remaining = Math.max(0, switchEvery - timer);

      if (current === 1 && text1) {
        text1.color = "white";
        text1.text =
`Scene 1
Main Screen

Next in ${remaining.toFixed(1)}s`;
      }

      if (current === 2 && text2) {
        text2.color = "white";
        text2.text =
`Scene 2
Loaded [✓]

Next in ${remaining.toFixed(1)}s`;
      }

      if (timer < switchEvery) return;

      timer = 0;

      if (current === 1) {
        this.engine.loadScene(scene2);
        current = 2;
      } else {
        this.engine.loadScene(scene1);
        current = 1;
      }
    };


    // ==========================================================
    // Scene 1 : Main Screen
    // ==========================================================

    const camera1 = new GameObject("camera1");
    const bg1 = new GameObject("bg1");
    const icon = new GameObject("icon");
    const title1 = new GameObject("title1");

    camera1.addComponent(new Camera(0.85));

    bg1.addComponent(
      new BoxRenderer(1400, 1000, "#0e1420")
    );

    icon.addComponent(
      new SpriteRenderer("app", 120, 120)
    );

    title1.transform.y = 160;

    title1.addComponent(
      new TextRenderer(
        "Scene 1\nMain Screen",
        "bold 42px Arial",
        "white",
        true,
        "black",
        3
      )
    );

    const text1 = title1.getComponent(TextRenderer);

    scene1.add(camera1);
    scene1.add(bg1);
    scene1.add(icon);
    scene1.add(title1);
    scene1.OnFrame(switchLogic);


    // ==========================================================
    // Scene 2 : Second Screen
    // ==========================================================

    const camera2 = new GameObject("camera2");
    const bg2 = new GameObject("bg2");
    const title2 = new GameObject("title2");

    camera2.addComponent(new Camera(0.85));

    bg2.addComponent(
      new BoxRenderer(1400, 1000, "#120e18")
    );

    title2.addComponent(
      new TextRenderer(
        "Scene 2\nLoaded[✓]",
        "bold 42px Arial",
        "white",
        true,
        "black",
        3
      )
    );

    const text2 = title2.getComponent(TextRenderer);

    scene2.add(camera2);
    scene2.add(bg2);
    scene2.add(title2);
    scene2.OnFrame(switchLogic);


    // ==========================================================
    // Register + start
    //
    // addScene registers.
    // loadScene activates scene1 first.
    // ==========================================================

    this.engine.addScene(scene1);
    this.engine.addScene(scene2);
    this.engine.loadScene(scene1);
  }
}