import fs from 'fs';
import path from 'path';

// Advanced UI Mapping: Replacing hardcoded dark bounds with dynamic theme tokens
const mappings = {
    'bg-[#0A0E17]': 'bg-root',
    'bg-[#0E131F]': 'bg-panel',
    'bg-[#151B28]': 'bg-card',
    'bg-[#111827]': 'bg-card',
    'border-[#1C2536]': 'border-subtle',
    'border-white/10': 'border-subtle',
    'border-white/5': 'border-subtle',
    'text-white': 'text-primary',
    'text-gray-300': 'text-muted',
    'text-gray-400': 'text-muted',
    'text-gray-500': 'text-muted-dark',
    'bg-ocean-900': 'bg-root',
    'bg-ocean-800': 'bg-panel',
    'bg-ocean-700': 'bg-card',
    'bg-black': 'bg-deep'
};

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            for (const [key, val] of Object.entries(mappings)) {
                if (content.includes(key)) {
                    content = content.trim().split(key).join(val);
                    changed = true;
                }
            }
            if (changed) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Dynamically mapped: ${fullPath}`);
            }
        }
    }
}
processDir('./src');
