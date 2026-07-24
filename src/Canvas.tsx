import { useEffect, useRef } from 'react';
import { Engine } from "./core/Engine";

export default function Canvas(){

 const canvas= useRef<HTMLCanvasElement>(null);
 const engineRef = useRef<Engine | null>(null);

 useEffect(()=>{

  if(!canvas.current || engineRef.current){
   return;
  }

  const engine = new Engine(canvas.current);

  engineRef.current = engine;

  engine.start();

  return () => {
   engine.destroy();
   engineRef.current = null;
  };

 },[]);


 if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload();
  });
 }



 return(
  <canvas
   ref={canvas}
   className="game-canvas"
  />
 );


}