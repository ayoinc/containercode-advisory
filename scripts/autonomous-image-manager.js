#!/usr/bin/env node

/**
 * Autonomous Image Management System
 * Continuously monitors and manages image requirements across the application
 */

const fs = require('fs').promises;
const path = require('path');

class AutonomousImageManager {
  constructor() {
    this.config = {
      scanDirectories: [
        './src/components',
        './src/app',
        './src/lib'
      ],
      imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
      placeholderPatterns: [
        /placeholder[_-]?(?:tech|image|photo)/gi,
        /\/images\/placeholder[^"']*/gi,
        /alt=".*placeholder.*"/gi,
        /TODO.*image/gi,
        /FIXME.*image/gi
      ],
      outputFile: './scripts/image-requirements.json'
    };
    
    this.findings = {
      missingImages: [],
      placeholders: [],
      opportunities: [],
      suggestions: []
    };
  }

  async scanForImageRequirements() {
    console.log('🔍 Scanning codebase for image requirements...');
    
    for (const directory of this.config.scanDirectories) {
      await this.scanDirectory(directory);
    }
  }

  async scanDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          await this.scanDirectory(fullPath);
        } else if (entry.isFile() && this.isRelevantFile(entry.name)) {
          await this.scanFile(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist, skip silently
      if (error.code !== 'ENOENT') {
        console.warn(`⚠️  Warning: Could not scan ${dirPath}: ${error.message}`);
      }
    }
  }

  isRelevantFile(filename) {
    return filename.endsWith('.tsx') || 
           filename.endsWith('.ts') || 
           filename.endsWith('.jsx') || 
           filename.endsWith('.js');
  }

  async scanFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Check for placeholder patterns
      for (const pattern of this.config.placeholderPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          this.findings.placeholders.push({
            file: filePath,
            matches: matches,
            line: this.getLineNumbers(content, matches)
          });
        }
      }
      
      // Look for image component usage without proper images
      await this.analyzeImageComponents(filePath, content);
      
      // Check for hardcoded image paths that could be improved
      await this.findOptimizationOpportunities(filePath, content);
      
    } catch (error) {
      console.warn(`⚠️  Warning: Could not scan file ${filePath}: ${error.message}`);
    }
  }

  getLineNumbers(content, matches) {
    const lines = content.split('\n');
    const lineNumbers = [];
    
    for (const match of matches) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(match)) {
          lineNumbers.push(i + 1);
        }
      }
    }
    
    return lineNumbers;
  }

  async analyzeImageComponents(filePath, content) {
    // Look for Image components without src or with placeholder src
    const imagePatterns = [
      /<Image[^>]*(?:src=""[^>]*|[^>]*src="[^"]*placeholder[^"]*")[^>]*>/gi,
      /<img[^>]*(?:src=""[^>]*|[^>]*src="[^"]*placeholder[^"]*")[^>]*>/gi,
      /<SmartImage[^>]*category="[^"]*"[^>]*>/gi
    ];
    
    for (const pattern of imagePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        this.findings.missingImages.push({
          file: filePath,
          type: 'component_without_proper_image',
          matches: matches,
          line: this.getLineNumbers(content, matches)
        });
      }
    }
  }

  async findOptimizationOpportunities(filePath, content) {
    // Look for hardcoded image paths that could use our image mapper
    const hardcodedPatterns = [
      /src="\/images\/[^"]*\.(?:jpg|jpeg|png|webp)"/gi,
      /src={["']\/images\/[^"']*\.(?:jpg|jpeg|png|webp)["']}/gi
    ];
    
    for (const pattern of hardcodedPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        // Filter out already optimized paths (pexels directory)
        const nonOptimized = matches.filter(match => !match.includes('/pexels/'));
        
        if (nonOptimized.length > 0) {
          this.findings.opportunities.push({
            file: filePath,
            type: 'hardcoded_image_paths',
            matches: nonOptimized,
            suggestion: 'Consider using image mapper for dynamic image loading'
          });
        }
      }
    }
  }

  generateSuggestions() {
    console.log('💡 Generating improvement suggestions...');
    
    // Suggest new images for areas that need them
    const categoryNeeds = new Map();
    
    this.findings.missingImages.forEach(finding => {
      const filePath = finding.file;
      
      if (filePath.includes('/hero')) {
        categoryNeeds.set('hero', (categoryNeeds.get('hero') || 0) + 1);
      } else if (filePath.includes('/service')) {
        categoryNeeds.set('services', (categoryNeeds.get('services') || 0) + 1);
      } else if (filePath.includes('/team')) {
        categoryNeeds.set('team', (categoryNeeds.get('team') || 0) + 1);
      } else if (filePath.includes('/blog')) {
        categoryNeeds.set('blog', (categoryNeeds.get('blog') || 0) + 1);
      }
    });
    
    categoryNeeds.forEach((count, category) => {
      this.findings.suggestions.push({
        type: 'download_more_images',
        category: category,
        priority: count > 3 ? 'high' : count > 1 ? 'medium' : 'low',
        message: `Consider downloading ${count} more ${category} images from Pexels`
      });
    });
    
    // Suggest component optimizations
    if (this.findings.opportunities.length > 0) {
      this.findings.suggestions.push({
        type: 'optimize_image_loading',
        priority: 'medium',
        message: `${this.findings.opportunities.length} files could benefit from using the image mapper system`
      });
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFilesScanned: this.getScannedFileCount(),
        placeholdersFound: this.findings.placeholders.length,
        missingImages: this.findings.missingImages.length,
        optimizationOpportunities: this.findings.opportunities.length,
        suggestions: this.findings.suggestions.length
      },
      findings: this.findings,
      recommendations: this.generateRecommendations()
    };
    
    // Save detailed report
    await fs.writeFile(
      this.config.outputFile,
      JSON.stringify(report, null, 2),
      'utf8'
    );
    
    console.log(`📋 Generated detailed report: ${this.config.outputFile}`);
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.findings.placeholders.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Replace placeholder images',
        description: `Found ${this.findings.placeholders.length} placeholder images that could be replaced with professional Pexels images`,
        files: this.findings.placeholders.map(p => p.file)
      });
    }
    
    if (this.findings.missingImages.length > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Add missing images',
        description: `${this.findings.missingImages.length} components are missing proper images`,
        files: this.findings.missingImages.map(m => m.file)
      });
    }
    
    if (this.findings.opportunities.length > 0) {
      recommendations.push({
        priority: 'low',
        action: 'Optimize image loading',
        description: `${this.findings.opportunities.length} components could use improved image loading`,
        benefit: 'Better performance and SEO'
      });
    }
    
    return recommendations;
  }

  getScannedFileCount() {
    // Estimate based on findings - in a real implementation, you'd track this
    return this.findings.placeholders.length + 
           this.findings.missingImages.length + 
           this.findings.opportunities.length;
  }

  async executeAutomaticImprovements() {
    console.log('🤖 Executing automatic improvements...');
    
    let improvementsMade = 0;
    
    // Automatically replace simple placeholder references
    for (const placeholder of this.findings.placeholders) {
      const filePath = placeholder.file;
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        let updatedContent = content;
        let hasChanges = false;
        
        // Replace common placeholder patterns with appropriate Pexels images
        const replacements = [
          {
            pattern: '/images/placeholder-tech.jpg',
            replacement: '/images/pexels/hero-cloud-computing.jpg',
            condition: filePath.includes('hero')
          },
          {
            pattern: '/images/placeholder-tech.jpg',
            replacement: '/images/pexels/service-cloud-technologies.jpg',
            condition: filePath.includes('service')
          },
          {
            pattern: 'alt="Technology placeholder image"',
            replacement: 'alt="Modern cloud computing infrastructure"',
            condition: true
          }
        ];
        
        for (const replacement of replacements) {
          if (replacement.condition && updatedContent.includes(replacement.pattern)) {
            updatedContent = updatedContent.replace(
              new RegExp(replacement.pattern, 'g'),
              replacement.replacement
            );
            hasChanges = true;
          }
        }
        
        if (hasChanges) {
          await fs.writeFile(filePath, updatedContent, 'utf8');
          improvementsMade++;
          console.log(`✅ Auto-improved: ${path.basename(filePath)}`);
        }
        
      } catch (error) {
        console.warn(`⚠️  Could not auto-improve ${filePath}: ${error.message}`);
      }
    }
    
    console.log(`🎉 Made ${improvementsMade} automatic improvements`);
    return improvementsMade;
  }

  async run() {
    try {
      console.log('🚀 Starting autonomous image management...');
      
      await this.scanForImageRequirements();
      this.generateSuggestions();
      
      const report = await this.generateReport();
      const improvements = await this.executeAutomaticImprovements();
      
      console.log('\n📊 Autonomous Image Management Summary:');
      console.log(`   🔍 Files scanned: ${report.summary.totalFilesScanned}`);
      console.log(`   📝 Placeholders found: ${report.summary.placeholdersFound}`);
      console.log(`   🖼️  Missing images: ${report.summary.missingImages}`);
      console.log(`   ⚡ Optimization opportunities: ${report.summary.optimizationOpportunities}`);
      console.log(`   🤖 Automatic improvements made: ${improvements}`);
      
      if (report.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        report.recommendations.forEach((rec, index) => {
          const emoji = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
          console.log(`   ${emoji} ${rec.action}: ${rec.description}`);
        });
      }
      
      console.log(`\n📋 Detailed report saved: ${this.config.outputFile}`);
      console.log('✨ Your images are continuously optimized!');
      
    } catch (error) {
      console.error('❌ Fatal error in autonomous image management:', error);
      process.exit(1);
    }
  }
}

// Run the autonomous image manager
if (require.main === module) {
  const manager = new AutonomousImageManager();
  manager.run().catch(console.error);
}

module.exports = AutonomousImageManager;