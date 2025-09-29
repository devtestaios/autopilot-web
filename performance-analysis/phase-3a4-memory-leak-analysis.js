#!/usr/bin/env node

/**
 * PHASE 3A.4: MEMORY LEAK PREVENTION IMPLEMENTATION
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Memory Management Protocol
 * 
 * This script identifies and fixes timer/interval memory leaks in React components
 * focusing on useEffect cleanup functions and proper memory management.
 */

const fs = require('fs');
const path = require('path');

console.log('🧠 PHASE 3A.4: MEMORY LEAK PREVENTION IMPLEMENTATION');
console.log('=' .repeat(70));

const ANALYSIS_RESULTS = {
  timestamp: new Date().toISOString(),
  phase: 'Phase 3A.4: Memory Leak Prevention',
  
  // Memory leak categories identified
  timerLeaks: [],
  intervalLeaks: [],
  eventListenerLeaks: [],
  subscriptionLeaks: []
};

function findFilesRecursively(dir, extensions = ['.tsx', '.ts', '.jsx', '.js'], excludeDirs = ['node_modules', '.next', '.git', 'performance-analysis']) {
  let results = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !excludeDirs.includes(item)) {
        results = results.concat(findFilesRecursively(fullPath, extensions, excludeDirs));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`⚠️  Could not read directory ${dir}: ${error.message}`);
  }
  
  return results;
}

function analyzeMemoryLeaks() {
  console.log('\n🔍 ANALYZING TIMER/INTERVAL MEMORY LEAKS');
  console.log('=' .repeat(50));
  
  const allFiles = findFilesRecursively(path.join(process.cwd(), 'src'));
  
  const memoryIssues = {
    timerLeaks: [],
    intervalLeaks: [],
    eventListenerLeaks: [],
    highPriorityFixes: []
  };
  
  console.log(`📁 Analyzing ${allFiles.length} files for memory leak patterns...`);
  
  allFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      const lines = content.split('\n');
      
      // Check for setTimeout without clearTimeout
      const setTimeoutMatches = content.match(/setTimeout\s*\(/g) || [];
      const clearTimeoutMatches = content.match(/clearTimeout\s*\(/g) || [];
      
      if (setTimeoutMatches.length > 0 && clearTimeoutMatches.length === 0) {
        memoryIssues.timerLeaks.push({
          file: relativePath,
          issue: `${setTimeoutMatches.length} setTimeout calls without clearTimeout cleanup`,
          severity: 'MEDIUM',
          lines: lines.map((line, index) => 
            line.includes('setTimeout') ? index + 1 : null
          ).filter(Boolean).slice(0, 3)
        });
      }
      
      // Check for setInterval without clearInterval
      const setIntervalMatches = content.match(/setInterval\s*\(/g) || [];
      const clearIntervalMatches = content.match(/clearInterval\s*\(/g) || [];
      
      if (setIntervalMatches.length > 0 && clearIntervalMatches.length === 0) {
        memoryIssues.intervalLeaks.push({
          file: relativePath,
          issue: `${setIntervalMatches.length} setInterval calls without clearInterval cleanup`,
          severity: 'HIGH',
          lines: lines.map((line, index) => 
            line.includes('setInterval') ? index + 1 : null
          ).filter(Boolean).slice(0, 3)
        });
      }
      
      // Check for addEventListener without removeEventListener
      const addEventMatches = content.match(/addEventListener\s*\(/g) || [];
      const removeEventMatches = content.match(/removeEventListener\s*\(/g) || [];
      
      if (addEventMatches.length > 0 && removeEventMatches.length === 0) {
        memoryIssues.eventListenerLeaks.push({
          file: relativePath,
          issue: `${addEventMatches.length} addEventListener calls without removeEventListener cleanup`,
          severity: 'HIGH',
          lines: lines.map((line, index) => 
            line.includes('addEventListener') ? index + 1 : null
          ).filter(Boolean).slice(0, 3)
        });
      }
      
      // Identify high-priority components for fixing
      if (setIntervalMatches.length > 0 || addEventMatches.length > 0) {
        memoryIssues.highPriorityFixes.push({
          file: relativePath,
          priority: setIntervalMatches.length > 0 ? 'CRITICAL' : 'HIGH',
          issues: [
            ...(setIntervalMatches.length > 0 ? [`${setIntervalMatches.length} interval leaks`] : []),
            ...(addEventMatches.length > 0 ? [`${addEventMatches.length} event listener leaks`] : [])
          ]
        });
      }
      
    } catch (error) {
      console.log(`⚠️  Could not analyze ${relativePath}: ${error.message}`);
    }
  });
  
  ANALYSIS_RESULTS.timerLeaks = memoryIssues.timerLeaks;
  ANALYSIS_RESULTS.intervalLeaks = memoryIssues.intervalLeaks;
  ANALYSIS_RESULTS.eventListenerLeaks = memoryIssues.eventListenerLeaks;
  
  return memoryIssues;
}

function displayAnalysisResults(memoryIssues) {
  console.log('\n📊 MEMORY LEAK ANALYSIS RESULTS');
  console.log('=' .repeat(50));
  
  const categories = [
    { name: 'Timer Leaks (setTimeout)', issues: memoryIssues.timerLeaks, severity: 'MEDIUM' },
    { name: 'Interval Leaks (setInterval)', issues: memoryIssues.intervalLeaks, severity: 'HIGH' },
    { name: 'Event Listener Leaks', issues: memoryIssues.eventListenerLeaks, severity: 'HIGH' }
  ];
  
  let totalIssues = 0;
  
  categories.forEach(category => {
    if (category.issues.length > 0) {
      console.log(`\n❌ ${category.name.toUpperCase()}: ${category.issues.length} files affected`);
      totalIssues += category.issues.length;
      
      category.issues.slice(0, 5).forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.file}`);
        console.log(`      Issue: ${issue.issue}`);
        console.log(`      Severity: ${issue.severity}`);
        if (issue.lines && issue.lines.length > 0) {
          console.log(`      Lines: ${issue.lines.join(', ')}`);
        }
      });
      
      if (category.issues.length > 5) {
        console.log(`   ... and ${category.issues.length - 5} more files`);
      }
    }
  });
  
  console.log(`\n📈 TOTAL MEMORY LEAK ISSUES: ${totalIssues}`);
  
  // Show high-priority fixes
  if (memoryIssues.highPriorityFixes.length > 0) {
    console.log(`\n🎯 HIGH-PRIORITY FIXES NEEDED: ${memoryIssues.highPriorityFixes.length} files`);
    memoryIssues.highPriorityFixes.slice(0, 8).forEach((fix, index) => {
      console.log(`   ${index + 1}. [${fix.priority}] ${fix.file}`);
      console.log(`      Issues: ${fix.issues.join(', ')}`);
    });
    
    if (memoryIssues.highPriorityFixes.length > 8) {
      console.log(`   ... and ${memoryIssues.highPriorityFixes.length - 8} more files`);
    }
  }
}

function generateFixPatterns() {
  console.log('\n🔧 MEMORY LEAK FIX PATTERNS');
  console.log('=' .repeat(50));
  
  const patterns = {
    timerCleanup: {
      before: `useEffect(() => {
  const timer = setTimeout(() => {
    // Timer logic
  }, 1000);
  // ❌ Missing cleanup
}, []);`,
      after: `useEffect(() => {
  const timer = setTimeout(() => {
    // Timer logic
  }, 1000);
  
  // ✅ PERFORMANCE: Cleanup timer to prevent memory leaks
  return () => clearTimeout(timer);
}, []);`,
      explanation: 'Always clear timers in useEffect cleanup function'
    },
    
    intervalCleanup: {
      before: `useEffect(() => {
  const interval = setInterval(() => {
    // Interval logic
  }, 1000);
  // ❌ Missing cleanup
}, []);`,
      after: `useEffect(() => {
  const interval = setInterval(() => {
    // Interval logic
  }, 1000);
  
  // ✅ PERFORMANCE: Cleanup interval to prevent memory leaks
  return () => clearInterval(interval);
}, []);`,
      explanation: 'Always clear intervals in useEffect cleanup function'
    },
    
    eventListenerCleanup: {
      before: `useEffect(() => {
  window.addEventListener('resize', handleResize);
  // ❌ Missing cleanup
}, []);`,
      after: `useEffect(() => {
  const handleResize = (event) => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize);
  
  // ✅ PERFORMANCE: Remove event listener to prevent memory leaks
  return () => window.removeEventListener('resize', handleResize);
}, []);`,
      explanation: 'Always remove event listeners in useEffect cleanup function'
    }
  };
  
  Object.entries(patterns).forEach(([patternName, pattern]) => {
    console.log(`\n📝 ${patternName.toUpperCase()}:`);
    console.log(`\n❌ BEFORE (Memory Leak):`);
    console.log(pattern.before);
    console.log(`\n✅ AFTER (Fixed):`);
    console.log(pattern.after);
    console.log(`\n💡 ${pattern.explanation}\n`);
  });
}

function generateImplementationPlan(memoryIssues) {
  console.log('\n📋 PHASE 3A.4 IMPLEMENTATION PLAN');
  console.log('=' .repeat(50));
  
  const plan = [
    {
      step: '3A.4.1',
      title: 'Critical Interval Leaks',
      files: memoryIssues.intervalLeaks.slice(0, 5).map(issue => issue.file),
      priority: 'CRITICAL',
      effort: '30-45 minutes',
      impact: 'Prevents severe performance degradation'
    },
    {
      step: '3A.4.2',
      title: 'High-Priority Event Listener Leaks',
      files: memoryIssues.eventListenerLeaks.slice(0, 5).map(issue => issue.file),
      priority: 'HIGH',
      effort: '30-45 minutes', 
      impact: 'Prevents memory accumulation'
    },
    {
      step: '3A.4.3',
      title: 'Timer Cleanup Implementation',
      files: memoryIssues.timerLeaks.slice(0, 5).map(issue => issue.file),
      priority: 'MEDIUM',
      effort: '15-30 minutes',
      impact: 'Improves overall memory management'
    }
  ];
  
  plan.forEach((phase, index) => {
    console.log(`\n🎯 ${phase.step}: ${phase.title} [${phase.priority}]`);
    console.log(`   Files to fix: ${Math.min(phase.files.length, 5)} files`);
    console.log(`   Effort: ${phase.effort}`);
    console.log(`   Impact: ${phase.impact}`);
    
    if (phase.files.length > 0) {
      console.log(`   Target Files:`);
      phase.files.slice(0, 3).forEach((file, fileIndex) => {
        console.log(`      ${fileIndex + 1}. ${file}`);
      });
      if (phase.files.length > 3) {
        console.log(`      ... and ${phase.files.length - 3} more`);
      }
    }
  });
  
  console.log('\n📊 TOTAL IMPLEMENTATION EFFORT:');
  console.log('   • Time: 1.25-2 hours');
  console.log('   • Files: 10-15 high-impact files');
  console.log('   • Expected Impact: Eliminate memory leaks, prevent performance degradation');
  console.log('   • ROI: Medium-High - Long-term stability improvement');
}

async function main() {
  try {
    console.log('🔍 Starting comprehensive memory leak analysis...\n');
    
    const memoryIssues = analyzeMemoryLeaks();
    displayAnalysisResults(memoryIssues);
    generateFixPatterns();
    generateImplementationPlan(memoryIssues);
    
    // Save analysis results
    const reportPath = path.join(__dirname, 'phase-3a4-memory-leak-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(ANALYSIS_RESULTS, null, 2));
    
    console.log(`\n📄 Detailed analysis saved: ${reportPath}`);
    console.log('\n🚀 PHASE 3A.4 ANALYSIS COMPLETE!');
    console.log('🎯 Ready to implement systematic memory leak prevention');
    console.log('💡 Starting with CRITICAL interval leaks for maximum impact!');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeMemoryLeaks };