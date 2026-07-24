import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function bootstrap(){

 if(import.meta.env.DEV){
  const { default: eruda } = await import("eruda");
  eruda.init();
 }

 ReactDOM
 .createRoot(
 document.getElementById("root")!
 )
 .render(
  <React.StrictMode>
   <App/>
  </React.StrictMode>
 );

}

bootstrap();