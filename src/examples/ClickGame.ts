import { Engine } from "../core/Engine";
import { Scene } from "../core/Scene";
import { GameObject } from "../core/GameObject";

import { Touch } from "../core/Touch";

import { Camera } from "../components/Camera";
import { BoxRenderer } from "../components/BoxRenderer";
import { CircleRenderer } from "../components/CircleRenderer";
import { TextRenderer } from "../components/TextRenderer";

import { Collision } from "../physics/Collision";


// ==========================================================
// Click Game Demo
//
// A polished mobile tap demo built on HSN core systems.
//
// Demonstrates:
//
// • Touch.justPressed for one-tap scoring.
// • Camera.screenToWorld for correct hit tests.
// • Collision.pointInObject against a UI button.
// • Visual feedback: scale punch, flash, floating +1.
// • Combo timer that rewards fast taps.
// • Best score tracking during the session.
//
// Input pipeline:
//
// 1. Touch gives screen pixels (Touch.x / Touch.y)
// 2. camera.screenToWorld converts to world units
// 3. Collision.pointInObject tests the button box
// 4. On hit: score++, combo++, feedback animations
//
// Why conversion is required:
//
// Screen space != world space when a camera exists.
// Never compare Touch.x/y directly to transform.x/y.
//
// Collision.pointInObject(x, y, object, width, height)
//
// Pass the same width/height used by BoxRenderer.
// Scale and rotation of the object are taken into account.
//
// Feedback pattern used here:
//
// • scale jumps to 1.25 then lerps back to 1
// • button color flashes briefly
// • a "+1" / "+combo" popup rises and fades via scale/alpha text
//
// Related files:
// Touch.ts · Camera.ts · Collision.ts · BoxRenderer.ts
// ==========================================================


export class ClickGame {

  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async run(): Promise<void> {


    // ==========================================================
    // Config
    // ==========================================================

    const buttonW = 200;
    const buttonH = 90;
    const comboWindow = 1.15;


    // ==========================================================
    // State
    // ==========================================================

    let score = 0;
    let best = 0;
    let combo = 0;
    let comboTimer = 0;
    let scale = 1;
    let flashTimer = 0;
    let popupLife = 0;
    let popupValue = 1;


    // ==========================================================
    // Scene & objects
    // ==========================================================

    const scene = new Scene();

    const cameraObject = new GameObject("camera");
    const panel = new GameObject("panel");
    const button = new GameObject("button");
    const buttonLabel = new GameObject("buttonLabel");
    const scoreText = new GameObject("score");
    const comboText = new GameObject("combo");
    const bestText = new GameObject("best");
    const hint = new GameObject("hint");
    const popup = new GameObject("popup");
    const ring = new GameObject("ring");


    // ==========================================================
    // Camera
    // ==========================================================

    cameraObject.addComponent(new Camera(1));
    const camera = cameraObject.getComponent(Camera);


    // ==========================================================
    // Soft panel behind the button
    // ==========================================================

    panel.transform.y = 10;
    panel.addComponent(
      new BoxRenderer(320, 360, "#141820", true, "#2a3344", 2)
    );


    // ==========================================================
    // Button + label
    // ==========================================================

    button.addComponent(
      new BoxRenderer(buttonW, buttonH, "#f59e0b", true, "white", 4)
    );

    buttonLabel.addComponent(
      new TextRenderer("TAP", "bold 36px Arial", "white", true, "black", 2)
    );

    const buttonRenderer = button.getComponent(BoxRenderer);
    const buttonLabelText = buttonLabel.getComponent(TextRenderer);


    // ==========================================================
    // Ring pulse around button
    // ==========================================================

    ring.addComponent(
      new CircleRenderer(70, "transparent", true, "rgba(245,158,11,0.35)", 3)
    );


    // ==========================================================
    // HUD texts
    // ==========================================================

    scoreText.transform.y = -150;
    scoreText.addComponent(
      new TextRenderer("Score: 0", "bold 44px Arial", "white", true, "black", 3)
    );

    comboText.transform.y = -95;
    comboText.addComponent(
      new TextRenderer("Combo x0", "bold 28px Arial", "white", true, "black", 2)
    );

    bestText.transform.y = 130;
    bestText.addComponent(
      new TextRenderer("Best: 0", "bold 26px Arial", "white", true, "black", 2)
    );

    hint.transform.y = 175;
    hint.addComponent(
      new TextRenderer("Tap the orange button", "bold 24px Arial", "white", true, "black", 2)
    );

    popup.transform.y = -40;
    popup.addComponent(
      new TextRenderer("", "bold 34px Arial", "white", true, "black", 2)
    );
    popup.active = false;

    const text = scoreText.getComponent(TextRenderer);
    const comboLabel = comboText.getComponent(TextRenderer);
    const bestLabel = bestText.getComponent(TextRenderer);
    const hintLabel = hint.getComponent(TextRenderer);
    const popupLabel = popup.getComponent(TextRenderer);
    const ringRenderer = ring.getComponent(CircleRenderer);


    // ==========================================================
    // Update
    // ==========================================================

    scene.OnFrame((delta: number) => {

      if (
        !camera ||
        !buttonRenderer ||
        !text ||
        !comboLabel ||
        !bestLabel ||
        !hintLabel ||
        !popupLabel ||
        !ringRenderer ||
        !buttonLabelText
      ) return;


      // --------------------------
      // Timers
      // --------------------------

      if (comboTimer > 0) {
        comboTimer -= delta;
        if (comboTimer <= 0) {
          combo = 0;
          comboTimer = 0;
        }
      }

      if (flashTimer > 0) flashTimer -= delta;
      if (popupLife > 0) popupLife -= delta;


      // --------------------------
      // Touch -> world -> hit test
      // --------------------------

      const world = camera.screenToWorld(
        Touch.x,
        Touch.y,
        this.engine.viewWidth,
        this.engine.viewHeight
      );

      const clicked =
        Touch.justPressed &&
        Collision.pointInObject(world.x, world.y, button, buttonW, buttonH);

      if (clicked) {
        if (comboTimer > 0) combo++;
        else combo = 1;

        comboTimer = comboWindow;
        const gain = combo;
        score += gain;
        if (score > best) best = score;

        scale = 1.28;
        flashTimer = 0.12;

        popupValue = gain;
        popupLife = 0.55;
        popup.active = true;
        popup.transform.y = -35;
        popup.transform.scaleX = 1.15;
        popup.transform.scaleY = 1.15;
      }


      // --------------------------
      // Button feedback
      // --------------------------

      scale += (1 - scale) * 10 * delta;
      button.transform.scaleX = scale;
      button.transform.scaleY = scale;
      buttonLabel.transform.scaleX = scale;
      buttonLabel.transform.scaleY = scale;

      if (flashTimer > 0) {
        buttonRenderer.color = "#fde68a";
      } else if (Touch.pressed) {
        const hover = Collision.pointInObject(
          world.x, world.y, button, buttonW, buttonH
        );
        buttonRenderer.color = hover ? "#fbbf24" : "#f59e0b";
      } else {
        buttonRenderer.color = "#f59e0b";
      }

      buttonLabelText.color = "white";
      buttonLabelText.text = "TAP";


      // --------------------------
      // Ring pulse
      // --------------------------

      const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.08;
      ring.transform.scaleX = pulse * Math.max(scale, 1);
      ring.transform.scaleY = ring.transform.scaleX;
      ringRenderer.strokeColor = combo > 1
        ? "rgba(52,211,153,0.55)"
        : "rgba(245,158,11,0.35)";


      // --------------------------
      // Floating popup
      // --------------------------

      if (popupLife > 0) {
        popup.active = true;
        popup.transform.y -= 40 * delta;
        const t = popupLife / 0.55;
        popup.transform.scaleX = 0.9 + t * 0.25;
        popup.transform.scaleY = popup.transform.scaleX;
        popupLabel.color = "white";
        popupLabel.text = popupValue > 1 ? `+${popupValue} COMBO` : "+1";
      } else {
        popup.active = false;
      }


      // --------------------------
      // HUD
      // --------------------------

      text.color = "white";
      comboLabel.color = "white";
      bestLabel.color = "white";
      hintLabel.color = "white";

      text.text = `Score: ${score}`;
      comboLabel.text = combo > 0
        ? `Combo x${combo}  (${comboTimer.toFixed(1)}s)`
        : "Combo x0";
      bestLabel.text = `Best: ${best}`;
      hintLabel.text = combo >= 5
        ? "On fire!"
        : combo >= 2
          ? "Keep tapping!"
          : "Tap the orange button";
    });


    // ==========================================================
    // Build scene
    // ==========================================================

    scene.add(cameraObject);
    scene.add(panel);
    scene.add(ring);
    scene.add(button);
    scene.add(buttonLabel);
    scene.add(scoreText);
    scene.add(comboText);
    scene.add(bestText);
    scene.add(hint);
    scene.add(popup);

    this.engine.addScene(scene);
    this.engine.loadScene(scene);
  }
}