const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Global canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;
ctx.lineCap = 'round';

class Particle {
    constructor(effect){
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width/2 + this.effect.width/4);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX;
        this.speedY;
        this.speedModifier = Math.floor(Math.random() * 33 + 1);
        this.deviation = Math.random() * this.speedModifier;
        this.history = [{x: this.x, y: this.y}];
        this.maxLength = Math.floor(Math.random() * 100 + (150 - this.speedModifier*5));
        this.angle = 0;
        this.timer = this.maxLength * 2;
        this.lineWidth = Math.random() * 33 + 1;
        this.hueValue = Math.floor(Math.random() * 10);
        this.lightValue = Math.floor(Math.random() * 17 + 33);
    }
    draw(context){
        context.lineWidth = this.lineWidth;
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++){
            context.lineTo(this.history[i].x, this.history[i].y);
            context.strokeStyle = 'hsla(' + this.hueValue + ', ' + (100 - (100 - i)) + '%, ' + 50*(i/this.history.length) +  '%, 1)';
            context.stroke();
            context.beginPath();
            context.moveTo(this.history[i].x, this.history[i].y);
        }
        context.save();
        this.lineWidth += Math.random() / 100;
        context.lineWidth = this.lineWidth;
        context.restore();
    }
    update(){
        this.timer--;
        if (this.timer >= 1){
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y * this.effect.cols + x;
            this.angle = this.effect.flowField[index] + this.deviation;
            
            this.speedX = Math.sin(this.angle);
            this.speedY = Math.cos(this.angle);
            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;
    
            this.history.push({x: this.x, y: this.y});
            if (this.history.length > this.maxLength){
                this.history.shift();
            }
        } else if (this.history.length > 1){
            this.history.shift();
        } else {
            this.reset();
        }
    }
    reset(){
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX;
        this.speedY;
        this.speedModifier = Math.floor(Math.random() * 33 + 1);
        this.deviation = Math.random() * this.speedModifier/2 + this.speedModifier/3;
        this.history = [{x: this.x, y: this.y}];
        this.maxLength = Math.floor(Math.random() * 100 + (150 - this.speedModifier*5));
        this.angle = 0;
        this.timer = this.maxLength * 2;
        this.lineWidth = Math.random() * 33 + 1;
        this.hueValue += 10;
        this.lightValue = Math.floor(Math.random() * 17 + 33);
    }
}

class Effect {
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 100;
        this.cellSize = 22;
        this.rows;
        this.cols;
        this.flowField = [];
        this.curve = 2;
        this.zoom = .077;
        this.debug = false;
        this.init();

        window.addEventListener('keydown', e => {
            if (e.key === 'd') this.debug = !this.debug;
        });

        window.addEventListener('resize', e => {
            this.resize(e.target.innerWidth, e.target.innerHeight);
        })
    }
    init(){
        // create flow field
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.flowField = [];
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                this.flowField.push(angle);
            }
        }
        this.particles = [];
        // create particles
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }
    drawGrid(context){
        context.save();
        context.strokeStyle = 'white';
        context.lineWidth = 0.3;
        for(let c = 0; c < this.cols; c++){
            context.beginPath();
            context.moveTo(this.cellSize * c, 0);
            context.lineTo(this.cellSize * c, this.height);
            context.stroke();
        }
        for(let r = 0; r < this.rows; r++){
            context.beginPath();
            context.moveTo(0, this.cellSize * r);
            context.lineTo(this.width, this.cellSize * r);
            context.stroke();
        }
        context.restore();
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.init();
    }
    render(context){
        if (this.debug) this.drawGrid(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        }
        )
    }
}

const effect = new Effect(canvas);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();




