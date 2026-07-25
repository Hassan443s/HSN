import { Component } from "../core/Component";

export class TextRenderer extends Component {

 text:string;
 color:string;

 stroke:boolean;
 strokeColor:string;
 strokeSize:number;

 // نخزن هالثلاثة بشكل خاص عشان نتحكم فيهم عبر getter/setter
 private _font:string;
 private _maxWidth:number;
 private _lineHeight:number;

 // هل القيمة الحالية "تلقائية" (المستخدم ما حددها بنفسه)؟
 private autoMaxWidth:boolean;
 private autoLineHeight:boolean;


 constructor(
  text:string,
  font:string = "20px Arial",
  color:string = "white",
  stroke:boolean = false,
  strokeColor:string = "black",
  strokeSize:number = 2,
  maxWidth?:number,
  lineHeight?:number
 ){
  super();

  this.name = "TextRenderer";

  this.text = text;
  this._font = font;
  this.color = color;

  this.stroke = stroke;
  this.strokeColor = strokeColor;
  this.strokeSize = strokeSize;

  // إذا المستخدم ما مرر قيمة => نفعّل الوضع التلقائي لها
  this.autoMaxWidth = maxWidth === undefined;
  this.autoLineHeight = lineHeight === undefined;

  // القيمة الفعلية التلقائية تُحسب ديناميكيًا وقت الرسم من engine.viewWidth
  // (شوف computeAutoMaxWidth)، هنا فقط قيمة احتياطية لو ما فيه محرك متاح بعد
  this._maxWidth = maxWidth ?? Infinity;

  this._lineHeight = lineHeight ?? this.computeAutoLineHeight();
 }


 // ---------- font ----------
 get font():string {
  return this._font;
 }

 set font(value:string){
  this._font = value;

  // لو lineHeight لسه بوضعه التلقائي، نعيد حسابه ليطابق حجم الخط الجديد
  if(this.autoLineHeight)
   this._lineHeight = this.computeAutoLineHeight();
 }


 // ---------- maxWidth ----------
 get maxWidth():number {
  return this._maxWidth;
 }

 set maxWidth(value:number){
  this._maxWidth = value;
  this.autoMaxWidth = false; // صار المستخدم يتحكم فيها يدويًا من الآن
 }


 // ---------- lineHeight ----------
 get lineHeight():number {
  return this._lineHeight;
 }

 set lineHeight(value:number){
  this._lineHeight = value;
  this.autoLineHeight = false; // صار المستخدم يتحكم فيها يدويًا من الآن
 }


 // نستخرج حجم الخط بالبكسل من نص الـ font (مثلا "20px Arial" => 20)
 private extractFontSize(font:string):number {
  const match = font.match(/(\d+(\.\d+)?)px/);
  return match ? parseFloat(match[1]) : 20;
 }

 // نسبة شائعة بين حجم الخط وارتفاع السطر (1.2 تقريبًا قياسي في أغلب المحركات والمتصفحات)
 private computeAutoLineHeight():number {
  return this.extractFontSize(this._font) * 1.2;
 }


 // Engine.resize() يسوي ctx.scale(dpr,dpr) مرة وحدة بالبداية، فكل
 // الرسم بعدها (بما فيه transform.x/y) يشتغل بوحدات منطقية = viewWidth.
 // لهذا السبب نجيب viewWidth من المحرك مباشرة بدل ما نخمّنه من
 // ctx.canvas.width (اللي هو فيزيائي ومضروب بـ dpr).
 private computeAutoMaxWidth():number {

  const engine = this.gameObject.scene?.engine;

  // الكائن لسه مو مرتبط بمشهد/محرك (مثلاً وقت اختبار الكومبوننت لحاله)
  // => ما فيه معلومة كافية، فنرجع بدون حد أقصى
  if(!engine) return Infinity;

  return engine.viewWidth;
 }


 private wrapText(
  ctx:CanvasRenderingContext2D,
  text:string
 ):string[] {

  const effectiveMaxWidth = this.autoMaxWidth
   ? this.computeAutoMaxWidth()
   : this._maxWidth;

  if(!isFinite(effectiveMaxWidth))
   return [text];

  const words = text.split(" ");
  const lines:string[] = [];

  let line = "";

  for(const word of words){

   const test = line ? line + " " + word : word;

   if(ctx.measureText(test).width > effectiveMaxWidth){

    lines.push(line);
    line = word;

   }else{

    line = test;

   }
  }

  if(line)
   lines.push(line);

  return lines;
 }


 draw(ctx:CanvasRenderingContext2D):void{

  ctx.save();

  ctx.translate(
   this.gameObject.transform.x,
   this.gameObject.transform.y
  );

  ctx.rotate(this.gameObject.transform.rot);

  ctx.scale(
   this.gameObject.transform.scaleX,
   this.gameObject.transform.scaleY
  );


  ctx.font = this.font;
  ctx.fillStyle = this.color;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";


  const lines = this.wrapText(ctx,this.text);


  lines.forEach((line,index)=>{

   const y = (index - (lines.length-1)/2) * this.lineHeight;


   if(this.stroke){

    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeSize;

    ctx.strokeText(
     line,
     0,
     y
    );
   }


   ctx.fillText(
    line,
    0,
    y
   );

  });


  ctx.restore();
 }
}