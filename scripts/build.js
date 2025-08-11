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

// Get all API directories
const apiDirs = fs.readdirSync(APIS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

console.log(`🔍 Found ${apiDirs.length} API(s): ${apiDirs.join(', ')}`);

// Build documentation for each API
apiDirs.forEach(apiName => {
    const apiDir = path.join(APIS_DIR, apiName);
    const openapiFile = path.join(apiDir, 'openapi.yaml');
    const docsOutputDir = path.join(DOCS_DIR, apiName);
    
    if (!fs.existsSync(openapiFile)) {
        console.warn(`⚠️  No openapi.yaml found in ${apiDir}, skipping...`);
        return;
    }
    
    // Create output directory
    if (!fs.existsSync(docsOutputDir)) {
        fs.mkdirSync(docsOutputDir, { recursive: true });
    }
    
    console.log(`📚 Building documentation for ${apiName}...`);
    
    try {
        // Build the documentation using @redocly/cli
        const command = `npx @redocly/cli build-docs "${openapiFile}" -o "${docsOutputDir}/index.html" --title "${apiName.charAt(0).toUpperCase() + apiName.slice(1)} API Documentation"`;
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ Successfully built ${apiName} documentation`);
    } catch (error) {
        console.error(`❌ Failed to build ${apiName} documentation:`, error.message);
    }
});

console.log('🎉 Build complete!');
console.log(`📁 Documentation available in: ${DOCS_DIR}/`);
console.log(`🌐 Landing page: ${DOCS_DIR}/index.html`);
