const fs = require('fs');
const path = require('path');

const BUNDLE_SIZE_LIMIT = 400 * 1024; // 400KB limit

function checkBundleSize() {
  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log('No build directory found. Run "npm run build" first.');
    return;
  }

  try {
    const buildManifestPath = path.join(buildDir, 'build-manifest.json');
    if (!fs.existsSync(buildManifestPath)) {
      console.log('Build manifest not found. This might be a build issue.');
      return;
    }

    const buildInfo = fs.readFileSync(buildManifestPath, 'utf8');
    const manifest = JSON.parse(buildInfo);
    
    console.log('🔍 Bundle Size Analysis:');
    console.log('═══════════════════════════════════════');
    
    let hasIssues = false;
    let totalSize = 0;
    
    Object.entries(manifest.pages).forEach(([page, files]) => {
      const pageSize = files.reduce((sum, file) => {
        const filePath = path.join(buildDir, file);
        if (fs.existsSync(filePath)) {
          return sum + fs.statSync(filePath).size;
        }
        return sum;
      }, 0);
      
      totalSize += pageSize;
      const sizeKB = Math.round(pageSize / 1024);
      const status = pageSize > BUNDLE_SIZE_LIMIT ? '❌' : '✅';
      
      if (pageSize > BUNDLE_SIZE_LIMIT) {
        hasIssues = true;
      }
      
      console.log(`${status} ${page.padEnd(30)} ${sizeKB.toString().padStart(6)}KB`);
    });
    
    console.log('═══════════════════════════════════════');
    console.log(`📊 Total Bundle Size: ${Math.round(totalSize / 1024)}KB`);
    
    if (hasIssues) {
      console.log('\n⚠️  Some bundles exceed the 400KB limit. Consider:');
      console.log('   • Dynamic imports for large components');
      console.log('   • Code splitting for vendor libraries');
      console.log('   • Lazy loading for below-the-fold content');
      console.log('   • Optimizing package imports');
      console.log('\n💡 Run "npm run bundle:analyze" for detailed analysis');
    } else {
      console.log('\n✅ All bundles are within size limits!');
    }
  } catch (error) {
    console.error('Error analyzing bundle:', error.message);
  }
}

checkBundleSize();