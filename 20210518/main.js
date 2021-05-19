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
}

class Rectangle
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

class Sprite
{
  constructor(center, points) {
    this.center = center;
    this.points = points;
    this.delta = new Vector(0,0);
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

  rotate(r)
  {
    for(let i = 0; i < this.points.length; i++)
    {
        this.points[i] = this.points[i].rotate(r);
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

class Keys
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


class Bullet
{
  constructor(center, delta) {
      this.center = center;
      this.delta = delta;
  }

  tick()
  {
    this.center = this.center.add(this.delta);
  }

  render(ctx)
  {
    ctx.strokeRect(this.center.x-1, this.center.y, 3, 5);
  }
}


class Player
{
    constructor(gameMap) {
      this.gameMap = gameMap;
      let center = new Vector(100,380);
      let points = [
          new Vector(0,-5),
          new Vector(-5,5),
          new Vector(5,5)
      ];
      this.sprite = new Sprite(center, points);
      this.keys = new Keys();
    }

    tick()
    {
      if(this.keys.isDown('KeyA'))
      {
        this.sprite.center = this.sprite.center.add(new Vector(-2,0));
      }
      if(this.keys.isDown('KeyD'))
      {
        this.sprite.center = this.sprite.center.add(new Vector(2,0));
      }

      if(this.keys.wasDown('Space')) {
        let bullet = new Bullet(this.sprite.center, new Vector(0, -5));
        gameMap.bullets.push(bullet);
      }
      this.keys.endOfTick();
    }

    render(ctx)
    {
      this.sprite.render(ctx);
    }
}

class GameMap
{
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.enimies = [];
      this.bullets = [];
      this.player = new Player(this);
    }

    level1()
    {
      this.enimies = [];
      for(let i = 0; i < 10; i++)
      {
        let points = [
            new Vector(-2,2),
            new Vector(2,2),
            new Vector(2, -2),
            new Vector(-2, -2)
        ];
        let center = new Vector(30 + (30*i), 30);
        let e = new Sprite(center,points);
        e.scale(5)
        this.enimies.push(e);
      }
    }

    tick()
    {
      this.player.tick();
      for(let i = 0; i < this.bullets.length; i++)
      {
        this.bullets[i].tick();
      }
      for(let i = 0; i < this.enimies.length; i++)
      {
        this.enimies[i].tick();
      }
    }

    render(ctx)
    {
      this.player.render(ctx);
      for(let i = 0; i < this.bullets.length; i++)
      {
        this.bullets[i].render(ctx);
      }
      for(let i = 0; i < this.enimies.length; i++)
      {
        this.enimies[i].render(ctx);
      }
    }
}

let gameMap = new GameMap(WIDTH, HEIGHT);
gameMap.level1();

let lastTick = 0;
function render()
{
  let now = new Date().getTime();
  let passed = now - lastTick;
  if(passed > 1000/24)
  {
    gameMap.tick();
  }
  ctx.clearRect(0,0,400,400);
  gameMap.render(ctx);
  window.requestAnimationFrame(render);
}

