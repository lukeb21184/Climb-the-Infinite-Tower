class Pickup {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.rotation = 0;
        this.bobOffset = 0;
        this.bobDirection = 1;
    }
    
    update(deltaTime) {
        this.y += this.game.gameSpeed;
        
        // Bobbing animation
        this.bobOffset += 0.05 * this.bobDirection;
        if (Math.abs(this.bobOffset) > 3) {
            this.bobDirection *= -1;
        }
        
        // Rotation animation
        this.rotation += 0.02;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2 + this.bobOffset);
        ctx.rotate(this.rotation);
        
        // Draw different types of pickups
        switch (this.type) {
            case 'life':
                ctx.fillStyle = '#ff69b4';
                this.drawHeart(ctx);
                break;
            case 'speed':
                ctx.fillStyle = '#ffff00';
                this.drawLightning(ctx);
                break;
            case 'points':
                ctx.fillStyle = '#00ffff';
                this.drawStar(ctx);
                break;
        }
        
        // Glow effect
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        
        ctx.restore();
    }
    
    drawHeart(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(5, -10, 15, -10, 0, -20);
        ctx.bezierCurveTo(-15, -10, -5, -10, 0, 0);
        ctx.fill();
    }
    
    drawLightning(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(5, 0);
        ctx.lineTo(-5, 5);
        ctx.lineTo(5, 10);
        ctx.lineTo(0, 0);
        ctx.lineTo(10, -5);
        ctx.closePath();
        ctx.fill();
    }
    
    drawStar(ctx) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(0, -10);
            ctx.rotate((Math.PI * 2) / 5);
            ctx.lineTo(0, -5);
            ctx.rotate((Math.PI * 2) / 5);
        }
        ctx.closePath();
        ctx.fill();
    }
}
