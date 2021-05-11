let ctx = null;
let WIDTH = 400;
let HEIGHT = 400;

function main()
{
  let canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d')
  render();
}

class Vector
{
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  rotate(rad)
  {
    let tx = this.x * Math.cos(rad) - this.y * Math.sin(rad);
    let ty = this.x * Math.sin(rad) + this.y * Math.cos(rad);
    return new Vector(tx,ty);
  }

  translate(v)
  {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  add(v)
  {
    return this.translate(v);
  }

  scale(percent)
  {
    let tx = this.x * percent;
    let ty = this.y * percent;
    return new Vector(tx,ty);
  }

  max(amt)
  {
      let tx = this.x;
      let ty = this.y;
      if(tx > amt)
      {
        tx = amt - 1;
      }
      if(ty > amt)
      {
        ty = amt - 1;
      }
      amt = amt * -1;
      if(tx < amt)
        tx = amt - 1;
      if(ty < amt)
        ty = amt - 1;
      return new Vector(tx,ty);
  }
}

class Sprite
{
  constructor(center, points) {
    this.center = center;
    this.points = points;
    this.delta = new Vector(0,0);
  }

  tick()
  {

    this.center = this.center.add(this.delta);
    let rotate = false;
    if(this.center.x < 0)
    {
       this.center.x = 0;
       rotate = true;
    }
    if(this.center.x > WIDTH)
    {
      this.center.x = WIDTH;
      rotate = true;
    }
    if(this.center.y < 0)
    {
        this.center.y = 0;
        rotate = true;
    }
    if(this.center.y > HEIGHT)
    {
      this.center.y = HEIGHT;
      rotate = true;
    }
    if(rotate)
    {
      var rad = Math.random() * (Math.PI/2);
      if(Math.random() > 0.5)
        rad = rad * -1;
      this.delta = this.delta.rotate(rad);
    }

  }

  render(ctx)
  {
    ctx.beginPath();
    let start = this.points[0].translate(this.center);
    ctx.moveTo(start.x, start.y);
    for(let  i = 1; i < this.points.length; i++)
    {
      let v = this.points[i].translate(this.center);
      ctx.lineTo(v.x,v.y);
    }
    ctx.lineTo(start.x, start.y);
    ctx.stroke();
  }
}

function buildSquare()
{
  var points = [new Vector(0,0), new Vector(0,10), new Vector(10,10), new Vector(10,0)];
  var center = new Vector(100,100);
  return new Sprite(center, points);
}

let v = new Vector(10,10);
let square = buildSquare();
square.delta = new Vector(1,1);
square.center.x = square.center.x + 50;
function render()
{
    ctx.clearRect(0,0,400,400);
    v = v.rotate((Math.PI/32));
    var p = new Vector(200,200);
    var dv = v.translate(p);
    ctx.strokeRect(dv.x,dv.y,100,100);


    square.tick();
    square.render(ctx);
    window.requestAnimationFrame(render);
}

