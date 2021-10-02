// Created by Minh on October 1st, 2021

const { Client, Intents } = require('discord.js');
const { registerFont, loadImage, createCanvas } = require('canvas');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load font
registerFont(`./font.otf`, { family: 'Uni Sans' })

// Rounded rectangle
function draw_rec(ctx, x0, y0, x1, y1, r, color) {
    ctx.fillStyle = color;

    var w = x1 - x0;
    var h = y1 - y0;
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x1 - r, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
    ctx.lineTo(x1, y1 - r);
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
    ctx.lineTo(x0 + r, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.closePath();
    ctx.fill();
}

// Draw bot widget
async function draw() {
    const canvas = createCanvas(900, 200);
    const ctx = canvas.getContext('2d');

    draw_rec(ctx, 5, 5, canvas.width - 5, canvas.height - 5, 5, "#2f3136");
    draw_rec(ctx, 5, 5, 16, canvas.height - 5, 30, "#9f7df4");

    var text; text = `Software Updates`;

    ctx.font = `bold 50pt Uni Sans`
    ctx.textAlign = 'center'
    ctx.fillStyle = '#fff'
    ctx.fillText(text, 225 + ctx.measureText(text).width / 2, canvas.height / 2 - 8);

    text = `${client.guilds.cache.size} servers`;
    console.log(text);
    ctx.font = `bold 40pt Uni Sans`
    ctx.textAlign = 'center'
    ctx.fillStyle = '#817e85'
    ctx.fillText(text, 225 + ctx.measureText(text).width / 2, canvas.height / 2 + 57);

    const image = await loadImage("./avatar.png")
    ctx.drawImage(image, 35, canvas.height / 2 - image.height / 2);

    draw_rec(ctx, 145, 125, 200, 180, 27.5, "#2f3136");
    draw_rec(ctx, 153, 133, 192, 172, 19.5, "#00ae57"); // x1 y1 x2 y2

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./widget.png', buffer);

    client.destroy();
}

client.once('ready', async () => {
    await draw();
});

client.login(process.env.BOT_TOKEN);