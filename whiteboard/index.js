
let ctx = null
let canvas = null;
let mouseDownAt = null
let elements = [];
let current = null;
let lineMode = true;

class Line
{

    constructor() {
      this.start = {x:0,y:0};
      this.end   = {x:0,y:0};
      this.line = lineMode;
    }

    render(ctx)
    {
      if(this.line) {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
      }else{
        ctx.strokeRect(this.start.x, this.start.y,
            this.end.x-this.start.x, this.end.y-this.start.y);
      }
    }
}

function main()
{
  canvas = document.getElementById('canvas');
  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete

  ctx = canvas.getContext('2d');
  ctx.strokeRect(100,100,100,100);
  window.requestAnimationFrame(render);
  canvas.addEventListener('mousedown', (e)=>{
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within t
    mouseDownAt  = {x:x,y:y};
    current = new Line();
    current.start = {x:x,y:y};
    current.end = {x:x,y:y}
  });

  canvas.addEventListener('mousemove', (e) =>{
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within t
    if(current !== null) {
      current.end.x = x;
      current.end.y = y;
    }
  });


  canvas.addEventListener('mouseup', (e) =>{
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within
    if(current !== null) {
      current.end = {x: x, y: y};
      elements.push(current);
    }
    current = null;
    mouseDownAt = null;
  });

  document.addEventListener('keydown', (event) => {
      if(event.key === 'c')
      {
        ctx.clearRect(0,0,10000,10000);
        elements = [];
      }
      if(event.key === 'q')
      {
         mouseDownAt = null;
      }
      if(event.key === 'z')
      {
          elements.pop();
      }
      if(event.key === 'b')
      {
        lineMode = false;
      }
      if(event.key === 'l')
      {
        lineMode = true;
      }
  });
  document.addEventListener('keyup', (event) => {

  });
}

function render()
{
  ctx.clearRect(0,0,10000,10000);
  elements.forEach((e) =>{
    if(e !== null)
    {
      e.render(ctx);
    }
  });
  if(current !== null)
  {
    current.render(ctx);
  }
  window.requestAnimationFrame(render);
}