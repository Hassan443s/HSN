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
// Demonstrates the Transform component.
//
// Features:
//
// • Position movement.
// • Object rotation.
// • Object scaling.
// • Animated transforms using delta time.
// • Camera based world rendering.
//
// Transform properties:
//
// transform.x        -> Move object horizontally.
// transform.y        -> Move object vertically.
// transform.rot      -> Rotate object (radians).
// transform.scaleX   -> Horizontal scale.
// transform.scaleY   -> Vertical scale.
//
// Notes:
//
// All objects use World Space.
// The Camera controls what is displayed on screen.
//
// For more information:
// Go to Transform.ts and Camera.ts
// ==========================================================


export class Transforms {


 engine:Engine;


 constructor(engine:Engine){

  this.engine = engine;

 }



 async run():Promise<void>{



  // ==========================================================
  // Create Scene
  // ==========================================================

  const scene = new Scene();



  // ==========================================================
  // Create Objects
  //
  // camera  -> Controls the view.
  // scaleBox -> Demonstrates scaling.
  // moveBox  -> Demonstrates position movement.
  // rotateBox -> Demonstrates rotation.
  // title -> Displays information.
  // ==========================================================


  const camera = new GameObject();

  const scaleBox = new GameObject();

  const moveBox = new GameObject();

  const rotateBox = new GameObject();

  const title = new GameObject();




  // ==========================================================
  // Camera Setup
  //
  // Zoom 0.65 makes the demo fit better on screen.
  //
  // Camera works in World Space.
  // Objects do not need screen coordinates.
  // ==========================================================


  camera.addComponent(
   new Camera(0.3)
  );




  // ==========================================================
  // Scale Demo
  //
  // Object changes its size over time.
  // Uses:
  //
  // transform.scaleX
  // transform.scaleY
  // ==========================================================


  scaleBox.transform.y = -130;


  scaleBox.addComponent(
   new BoxRenderer(
    100,
    100,
    "orange",
    true,
    "white",
    3
   )
  );




  // ==========================================================
  // Position Demo
  //
  // Object moves left and right.
  //
  // Uses:
  //
  // transform.x
  // ==========================================================


  moveBox.transform.y = 50;


  moveBox.addComponent(
   new BoxRenderer(
    100,
    100,
    "red",
    true,
    "white",
    3
   )
  );




  // ==========================================================
  // Rotation Demo
  //
  // Object rotates continuously.
  //
  // Uses:
  //
  // transform.rot
  // ==========================================================


  rotateBox.transform.y = 220;


  rotateBox.addComponent(
   new BoxRenderer(
    100,
    100,
    "hotpink",
    true,
    "black",
    3
   )
  );




  // ==========================================================
  // Information Text
  //
  // Displays current transform values.
  // ==========================================================


  title.transform.y = -330;


  title.addComponent(
   new TextRenderer(
    "[Transform System]",
    "bold 45px Arial",
    "white",
    true,
    "black"
   )
  );




  // ==========================================================
  // Cache Components
  //
  // Getting components once improves performance.
  // Avoid searching every frame.
  // ==========================================================


  const scaleRenderer =
   scaleBox.getComponent(BoxRenderer);


  const moveRenderer =
   moveBox.getComponent(BoxRenderer);


  const rotateRenderer =
   rotateBox.getComponent(BoxRenderer);


  const text =
   title.getComponent(TextRenderer);




  // ==========================================================
  // Helpers
  // ==========================================================


  const color1 = new Colors();
  const color2 = new Colors();
  const color3 = new Colors();


  let time = 0;




  // ==========================================================
  // Update Loop
  //
  // Runs every frame.
  //
  // delta:
  // Time passed since previous frame.
  // Used for smooth animation.
  // ==========================================================


  scene.OnFrame((delta:number)=>{


   if(
    !scaleRenderer ||
    !moveRenderer ||
    !rotateRenderer ||
    !text
   ) return;



   time += delta;




   // --------------------------
   // Scale Animation
   // --------------------------


   const scale =
    1 + Math.sin(time * 4) * 0.3;


   scaleBox.transform.scaleX = scale;
   scaleBox.transform.scaleY = scale;




   // --------------------------
   // Position Animation
   // --------------------------


   moveBox.transform.x =
    Math.sin(time * 2) * 180;




   // --------------------------
   // Rotation Animation
   // --------------------------


   rotateBox.transform.rot +=
    Math.PI * delta;




   // --------------------------
   // Color Animation
   // --------------------------


   scaleRenderer.color =
    color1.rbw(5);


   moveRenderer.color =
    color2.rbw(7);


   rotateRenderer.color =
    color3.rbw(10);




   // --------------------------
   // Debug Information
   // --------------------------


   text.text =
`[Transform System]
Scale: ${scale.toFixed(2)}
Position X: ${moveBox.transform.x.toFixed(1)} Y: ${moveBox.transform.y.toFixed(1)}
Rotation: ${rotateBox.transform.rot.toFixed(2)}`;
  });




  // ==========================================================
  // Build Scene
  //
  // Add objects to the scene.
  //
  // Order matters:
  // Objects added later render above previous objects.
  // ==========================================================


  scene.add(camera);

  scene.add(scaleBox);

  scene.add(moveBox);

  scene.add(rotateBox);

  scene.add(title);




  // ==========================================================
  // Start Scene
  // ==========================================================


  this.engine.addScene(scene);

  this.engine.loadScene(scene);


 }


}