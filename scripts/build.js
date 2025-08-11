const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const APIS_DIR = 'apis';
const DOCS_DIR = 'docs';
const SRC_DIR = 'src';

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Copy landing page
console.log('📄 Copying landing page...');
const landingPage = path.join(SRC_DIR, 'index.html');
const landingPageDest = path.join(DOCS_DIR, 'index.html');
fs.copyFileSync(landingPage, landingPageDest);

// Recursively find all api.yaml files
function findApiFiles(dir, basePath = '') {
    const results = [];
    
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            const relativePath = path.join(basePath, item.name);
            
                    if (item.isDirectory()) {
            // Recursively search subdirectories
            results.push(...findApiFiles(fullPath, relativePath));
        } else if (item.name === 'api.yaml') {
                // Found an API file
                results.push({
                    filePath: fullPath,
                    urlPath: basePath.replace(/\\/g, '/'), // Normalize path separators
                    dirPath: path.dirname(fullPath)
                });
            }
        }
    } catch (error) {
        console.warn(`⚠️  Could not read directory ${dir}:`, error.message);
    }
    
    return results;
}

// Find all API files
const apiFiles = findApiFiles(APIS_DIR);

console.log(`🔍 Found ${apiFiles.length} API file(s):`);

// Build documentation for each API file
apiFiles.forEach(({ filePath, urlPath, dirPath }) => {
    const docsOutputDir = path.join(DOCS_DIR, urlPath);
    
    // Create output directory
    if (!fs.existsSync(docsOutputDir)) {
        fs.mkdirSync(docsOutputDir, { recursive: true });
    }
    
    // Generate a title from the path
    const pathParts = urlPath.split('/').filter(part => part.length > 0);
    const title = pathParts.length > 0 
        ? pathParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') + ' API Documentation'
        : 'API Documentation';
    
    console.log(`📚 Building documentation for ${urlPath || 'root'}...`);
    
    try {
        // Build the documentation using @redocly/cli
        const command = `npx @redocly/cli build-docs "${filePath}" -o "${docsOutputDir}/index.html" --title "${title}"`;
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ Successfully built documentation for ${urlPath || 'root'}`);
    } catch (error) {
        console.error(`❌ Failed to build documentation for ${urlPath || 'root'}:`, error.message);
    }
});

console.log('🎉 Build complete!');
console.log(`📁 Documentation available in: ${DOCS_DIR}/`);
console.log(`🌐 Landing page: ${DOCS_DIR}/index.html`);
