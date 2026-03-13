const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/Innovation/g, "Innovation")
                                .replace(/innovation/g, "innovation")
                                .replace(/INNOVATION/g, "INNOVATION");
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated: ' + filePath);
        }
    } catch (e) {
    }
}

function processDirectory(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('build') || dir.includes('dist')) return;
    try {
        let items = fs.readdirSync(dir);
        for (let item of items) {
            let fullPath = path.join(dir, item);
            let stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                processDirectory(fullPath);
            } else {
                if (fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.json') || fullPath.endsWith('.html') || fullPath.endsWith('.md') || fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
                    processFile(fullPath);
                }
            }
        }
    } catch (e) {
    }
}

processDirectory(__dirname);
console.log("Done");
