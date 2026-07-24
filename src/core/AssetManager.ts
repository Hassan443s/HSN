export class AssetManager {

 private static images = new Map<string, 
 HTMLImageElement>();

 static loadImage(name:string, src:string):void 
 {
  const image = new Image();

  image.onload = () => {};

  image.onerror = () => {
   console.error("Image failed:", src);
  };

  image.src = src;

  this.images.set(name, image);
 }

 static getImage(name: string): 
 HTMLImageElement | undefined {

  return this.images.get(name);

 }

}