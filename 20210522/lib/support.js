let WIDTH = 400;
let HEIGHT = 400;

export class Vector
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
}

export class List
{

}

export class Rectangle
{
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  east()
  {
    return this.x;
  }

  north()
  {
    return this.y;
  }

  west()
  {
    return this.x + this.w;
  }

  south()
  {
    return this.y + this.h;
  }

  collision(r)
  {
    let rect1 = r;
    let rect2 = this;
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
      return true;
    }

    return false;

  }
}

let nextSpriteId = 1;

export class Sprite
{
  constructor(center, points) {
    this.center = center;
    this.points = points;
    this.delta = new Vector(0,0);
    this.color = '#000000';
    this.collision = [];
    this.spriteId = ++nextSpriteId;
  }

  calcBounds()
  {
    var east = WIDTH * 2;
    var west = WIDTH * -1;
    var north = HEIGHT * 2;
    var south = HEIGHT * -1;
    for(var i = 0; i < this.points.length; i++)
    {
      var p = this.points[i].translate(this.center);
      if(p.x < east)
      {
        east = p.x;
      }
      if(p.x > west)
      {
        west = p.x;
      }
      if(p.y < north)
      {
        north = p.y;
      }
      if(p.y > south)
      {
        south = p.y;
      }
    }
    return new Rectangle(east,north, west-east, south - north);
  }

  collides(otherSprite)
  {
    let tb = this.calcBounds();
    let ob = otherSprite.calcBounds();
    return tb.collision(ob);
  }



  scale(s)
  {
    for(let i = 0; i < this.points.length; i++)
    {
      let a = this.points[i];
      let b = a.scale(s);
      this.points[i] = b;
    }
  }

  tick()
  {

    this.center = this.center.add(this.delta);
    let rotate = false;
    let bounds = this.calcBounds();

    if(bounds.east() < 0)
    {
      this.center.x = bounds.w / 2 + 1;
      rotate = true;
    }
    if(bounds.west() > WIDTH)
    {
      this.center.x = WIDTH - bounds.w/2 - 1;
      rotate = true;
    }
    if(bounds.north() < 0)
    {
      this.center.y = bounds.h / 2 + 1;
      rotate = true;
    }
    if(bounds.south() > HEIGHT)
    {
      this.center.y = HEIGHT - bounds.h/2 - 1;
      rotate = true;
    }
    if(rotate)
    {
      this.delta = this.delta.rotate((Math.PI/2) + (Math.PI/32));
      this.center = this.center.add(this.delta);
      this.center = this.center.add(this.delta);
      this.center = this.center.add(this.delta);
    }
  }

  endOfTick()
  {
      this.collision = [];
  }

  rotate(r)
  {
    for(let i = 0; i < this.points.length; i++)
    {
      this.points[i] = this.points[i].rotate(r);
    }
  }

  render(ctx)
  {
    ctx.strokeStyle = this.color;
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

export class Keys
{
  constructor() {
    this.downArray = [];
    this.wasDownArray = [];
    document.addEventListener('keydown', (event) => {
      this.downArray[event.code] = true;
      this.wasDownArray[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
      this.downArray[event.code] = false;
    });
  }


  isDown(code)
  {
    if(this.downArray[code])
      return true;
    return false;
  }

  wasDown(code)
  {
    if(this.wasDownArray[code])
      return true;
    return false;
  }

  endOfTick()
  {
    this.wasDownArray = [];
  }
}
