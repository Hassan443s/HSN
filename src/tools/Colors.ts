export class Colors{

  private r = 255;
  private g = 0;
  private b = 0;

  rbw(speed:number = 10): string {

    if (this.r >= 255 && this.g < 255 && this.b <= 0) {
      this.g = Math.min(this.g + speed, 255);
    } 
    else if (this.g >= 255 && this.r > 0) {
      this.r = Math.max(this.r - speed, 0);
    } 
    else if (this.g >= 255 && this.b < 255) {
      this.b = Math.min(this.b + speed, 255);
    } 
    else if (this.b >= 255 && this.g > 0) {
      this.g = Math.max(this.g - speed, 0);
    } 
    else if (this.b >= 255 && this.r < 255) {
      this.r = Math.min(this.r + speed, 255);
    } 
    else if (this.r >= 255 && this.b > 0) {
      this.b = Math.max(this.b - speed, 0);
    }

    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

 random(): string{
  let r = Math.random() * 255;
  let g = Math.random() * 255;
  let b = Math.random() * 255;
  return `rgb(${r}, ${g}, ${b})`;
 }

 
}