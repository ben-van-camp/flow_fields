const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Global canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;

class Particle {
    constructor(effect){
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX = Math.random() * 5 - 2.5;
        this.speedY = Math.random() * 5 - 2.5;
    }
    draw(context){
        context.fillRect(this.x, this.y, 50, 50);
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

class Effect {
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numberOfParticles = 50;
        this.init();
    }
    init(){
        // create particles
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }
    render(context){
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        }
        )
    }
}

const effect = new Effect(canvas.width, canvas.height);
console.log(effect);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();




