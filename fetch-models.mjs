import fs from 'fs';

async function listModels() {
    try {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyANlfNODB14tvZN7fnRe7cH4F7QMcsdcZ4');
        const data = await res.json();
        fs.writeFileSync('C:/Users/Pranav S P/.gemini/antigravity/brain/cc44c43c-ee01-400e-a5a0-93d2e6d30afb/models.json', JSON.stringify(data, null, 2));
        console.log("Written to workspace.");
    } catch(e) {
        console.error(e);
    }
}
listModels();
