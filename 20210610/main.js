import {Vector,Sprite,Keys, Rectangle} from './lib/support.js';
let ctx = null;
let WIDTH = 400;
let HEIGHT = 400;



function main()
{
  let canvas = document.getElementById('canvas');

  ctx = canvas.getContext('2d')
  render();
}

window.addEventListener('load', (event) =>{
  main();
});


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
        let points = [new Vector(-1,-5), new Vector(1,-5),
          new Vector(1,5), new Vector(-1,5)];
        let bullet = new Sprite(this.sprite.center, points);
        bullet.delta = new Vector(0, -5);
        gameMap.bullets.push(bullet);
        if(gameMap.bullets.length > 5)
        {
          gameMap.bullets.shift();
        }
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
        let center = new Vector(30 + (45*i), 30);
        let e = new Sprite(center,points);
        e.delta = new Vector(1,0);
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
      let all = [];
      all = all.concat(this.bullets);
      all = all.concat(this.enimies);
      all.forEach(e => {all.forEach(f =>{
          if(e.spriteId !== f.spriteId){
            if(e.collides(f))
            {
              e.collision.push(f);
            }
          }
      })});
      this.enimies.forEach(e => {
        if(e.collision.length !== 0)
        {
            e.center.x = Math.floor(Math.random() * WIDTH);
            e.center.y = Math.floor(Math.random() * HEIGHT);
          let A = Math.atan2(e.center.y - this.player.sprite.center.y, e.center.x - this.player.sprite.center.x);
          e.delta = new Vector(Math.cos(A),Math.sin(A));

        }
      });

      this.endOfTick();
    }

    endOfTick()
    {
      this.bullets.forEach(e =>{
        e.endOfTick();
      });
      this.enimies.forEach(e =>{
        e.endOfTick();
      });
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

