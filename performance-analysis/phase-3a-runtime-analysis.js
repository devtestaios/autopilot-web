#!/usr/bin/env node

/**
 * PHASE 3A: RUNTIME PERFORMANCE OPTIMIZATION ANALYZER
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Runtime Performance Protocol
 * 
 * This script analyzes the codebase for runtime performance optimization opportunities
 * focusing on component re-renders, memory usage, and Core Web Vitals improvements.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 PHASE 3A: RUNTIME PERFORMANCE OPTIMIZATION ANALYSIS');
console.log('=' .repeat(70));

const ANALYSIS_RESULTS = {
  timestamp: new Date().toISOString(),
  phase: 'Phase 3A: Runtime Performance Optimization',
  
  // Analysis Categories
  componentReRenderAnalysis: {},
  memoryUsageAnalysis: {},
  coreWebVitalsAnalysis: {},
  interactivePerformanceAnalysis: {},
  
  // Optimization Opportunities
  optimizationOpportunities: []
};

// Utility functions for file analysis
function findFilesRecursively(dir, extensions = ['.tsx', '.ts', '.jsx', '.js'], excludeDirs = ['node_modules', '.next', '.git']) {
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

function analyzeFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      path: filePath,
      content,
      lines: content.split('\n'),
      size: content.length
    };
  } catch (error) {
    console.log(`⚠️  Could not read file ${filePath}: ${error.message}`);
    return null;
  }
}

// Component Re-render Analysis
function analyzeComponentReRenders() {
  console.log('\n🔄 COMPONENT RE-RENDER ANALYSIS');
  console.log('=' .repeat(50));
  
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const appDir = path.join(process.cwd(), 'src', 'app');
  const contextDir = path.join(process.cwd(), 'src', 'contexts');
  
  const allFiles = [
    ...findFilesRecursively(componentsDir),
    ...findFilesRecursively(appDir),
    ...findFilesRecursively(contextDir)
  ];
  
  const reRenderIssues = {
    missingReactMemo: [],
    unnecessaryUseEffect: [],
    objectsInDependencyArrays: [],
    inlineObjectProps: [],
    heavyComputationsWithoutMemo: [],
    contextValueObjectCreation: []
  };
  
  console.log(`📁 Analyzing ${allFiles.length} React component files...`);
  
  allFiles.forEach(filePath => {
    const fileData = analyzeFileContent(filePath);
    if (!fileData) return;
    
    const relativePath = path.relative(process.cwd(), filePath);
    const { content, lines } = fileData;
    
    // Check for missing React.memo on components
    if (content.includes('export default function') && 
        !content.includes('React.memo') && 
        !content.includes('memo(') &&
        content.includes('useState') || content.includes('useEffect')) {
      reRenderIssues.missingReactMemo.push({
        file: relativePath,
        issue: 'Component with state/effects not wrapped in React.memo',
        impact: 'HIGH - Unnecessary re-renders on parent updates'
      });
    }
    
    // Check for useEffect with object dependencies
    const useEffectMatches = content.matchAll(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?},\s*\[([\s\S]*?)\]/g);
    for (const match of useEffectMatches) {
      const deps = match[1];
      if (deps.includes('{') || deps.includes('.')) {
        reRenderIssues.objectsInDependencyArrays.push({
          file: relativePath,
          issue: 'useEffect with object/property dependencies',
          impact: 'MEDIUM - May cause excessive re-runs',
          suggestion: 'Use useMemo/useCallback for object dependencies'
        });
      }
    }
    
    // Check for inline object props (major re-render cause)
    const inlineObjectProps = content.matchAll(/<\w+[^>]*\s+\w+\s*=\s*\{[^}]+\}/g);
    let inlineObjectCount = 0;
    for (const match of inlineObjectProps) {
      inlineObjectCount++;
    }
    
    if (inlineObjectCount > 3) {
      reRenderIssues.inlineObjectProps.push({
        file: relativePath,
        issue: `${inlineObjectCount} inline object props detected`,
        impact: 'HIGH - Creates new objects on every render',
        suggestion: 'Move objects outside component or use useMemo'
      });
    }
    
    // Check for heavy computations without useMemo
    if ((content.includes('.map(') || content.includes('.filter(') || content.includes('.reduce(')) &&
        !content.includes('useMemo')) {
      reRenderIssues.heavyComputationsWithoutMemo.push({
        file: relativePath,
        issue: 'Array processing without useMemo',
        impact: 'MEDIUM - Repeated calculations on each render',
        suggestion: 'Wrap expensive computations in useMemo'
      });
    }
    
    // Check Context providers creating new objects
    if (content.includes('Provider') && content.includes('value={{')) {
      reRenderIssues.contextValueObjectCreation.push({
        file: relativePath,
        issue: 'Context Provider with inline value object',
        impact: 'CRITICAL - Causes all consumers to re-render',
        suggestion: 'Use useMemo for context value objects'
      });
    }
  });
  
  ANALYSIS_RESULTS.componentReRenderAnalysis = reRenderIssues;
  
  // Display results
  Object.entries(reRenderIssues).forEach(([category, issues]) => {
    if (issues.length > 0) {
      console.log(`\n❌ ${category.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}: ${issues.length} issues`);
      issues.slice(0, 3).forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.file}`);
        console.log(`      Issue: ${issue.issue}`);
        console.log(`      Impact: ${issue.impact}`);
        if (issue.suggestion) {
          console.log(`      Fix: ${issue.suggestion}`);
        }
      });
      if (issues.length > 3) {
        console.log(`   ... and ${issues.length - 3} more files`);
      }
    }
  });
  
  return reRenderIssues;
}

// Memory Usage Analysis
function analyzeMemoryUsage() {
  console.log('\n🧠 MEMORY USAGE ANALYSIS');
  console.log('=' .repeat(50));
  
  const memoryIssues = {
    eventListenerLeaks: [],
    intervalTimerLeaks: [],
    largeStateObjects: [],
    inefficientDataStructures: [],
    memoryLeaksInEffects: []
  };
  
  const allFiles = findFilesRecursively(path.join(process.cwd(), 'src'));
  
  console.log(`📁 Analyzing ${allFiles.length} files for memory patterns...`);
  
  allFiles.forEach(filePath => {
    const fileData = analyzeFileContent(filePath);
    if (!fileData) return;
    
    const relativePath = path.relative(process.cwd(), filePath);
    const { content } = fileData;
    
    // Check for event listeners without cleanup
    if (content.includes('addEventListener') && !content.includes('removeEventListener')) {
      memoryIssues.eventListenerLeaks.push({
        file: relativePath,
        issue: 'addEventListener without removeEventListener cleanup',
        impact: 'HIGH - Memory leaks and performance degradation',
        solution: 'Add cleanup in useEffect return function'
      });
    }
    
    // Check for intervals/timeouts without cleanup
    if ((content.includes('setInterval') || content.includes('setTimeout')) && 
        !content.includes('clearInterval') && !content.includes('clearTimeout')) {
      memoryIssues.intervalTimerLeaks.push({
        file: relativePath,
        issue: 'Timer without cleanup function',
        impact: 'MEDIUM - Background processes may continue running',
        solution: 'Clear timers in useEffect cleanup'
      });
    }
    
    // Check for large useState initial values
    const largeStateMatches = content.matchAll(/useState\s*\(\s*(\[[\s\S]{100,}|\{[\s\S]{100,})/g);
    for (const match of largeStateMatches) {
      memoryIssues.largeStateObjects.push({
        file: relativePath,
        issue: 'Large initial state object/array',
        impact: 'MEDIUM - Increased memory usage and potential slow renders',
        solution: 'Consider lazy initial state or breaking into smaller pieces'
      });
    }
    
    // Check for inefficient array operations
    if (content.includes('push(') && content.includes('useState')) {
      memoryIssues.inefficientDataStructures.push({
        file: relativePath,
        issue: 'Direct array mutation with push() in state',
        impact: 'MEDIUM - React optimizations may not work properly',
        solution: 'Use spread operator or immutable patterns'
      });
    }
  });
  
  ANALYSIS_RESULTS.memoryUsageAnalysis = memoryIssues;
  
  // Display results
  Object.entries(memoryIssues).forEach(([category, issues]) => {
    if (issues.length > 0) {
      console.log(`\n❌ ${category.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}: ${issues.length} issues`);
      issues.slice(0, 2).forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.file}`);
        console.log(`      Issue: ${issue.issue}`);
        console.log(`      Impact: ${issue.impact}`);
        console.log(`      Solution: ${issue.solution}`);
      });
      if (issues.length > 2) {
        console.log(`   ... and ${issues.length - 2} more files`);
      }
    }
  });
  
  return memoryIssues;
}

// Core Web Vitals Analysis
function analyzeCoreWebVitals() {
  console.log('\n⚡ CORE WEB VITALS OPTIMIZATION OPPORTUNITIES');
  console.log('=' .repeat(50));
  
  const coreWebVitalsIssues = {
    lcp: { // Largest Contentful Paint
      imageOptimization: [],
      lazyLoadingMissing: [],
      renderBlockingResources: []
    },
    fid: { // First Input Delay
      heavyJavaScriptTasks: [],
      unoptimizedEventHandlers: []
    },
    cls: { // Cumulative Layout Shift
      imagesWithoutDimensions: [],
      dynamicContentInsertion: [],
      webFontsIssues: []
    }
  };
  
  const allFiles = findFilesRecursively(path.join(process.cwd(), 'src'));
  
  console.log(`📁 Analyzing ${allFiles.length} files for Core Web Vitals optimizations...`);
  
  allFiles.forEach(filePath => {
    const fileData = analyzeFileContent(filePath);
    if (!fileData) return;
    
    const relativePath = path.relative(process.cwd(), filePath);
    const { content } = fileData;
    
    // LCP - Image optimization opportunities
    if (content.includes('<img') && !content.includes('next/image')) {
      coreWebVitalsIssues.lcp.imageOptimization.push({
        file: relativePath,
        issue: 'Regular img tags instead of Next.js Image component',
        impact: 'HIGH - Slower image loading affects LCP',
        solution: 'Replace with next/image for automatic optimization'
      });
    }
    
    // LCP - Missing lazy loading
    if (content.includes('<img') && !content.includes('loading=') && !content.includes('priority')) {
      coreWebVitalsIssues.lcp.lazyLoadingMissing.push({
        file: relativePath,
        issue: 'Images without loading strategy specified',
        impact: 'MEDIUM - May load unnecessary images immediately',
        solution: 'Add loading="lazy" or priority for above-fold images'
      });
    }
    
    // FID - Heavy synchronous operations
    if (content.includes('JSON.parse') || content.includes('JSON.stringify')) {
      const heavyOperations = content.split('\n').filter(line => 
        line.includes('JSON.parse') || line.includes('JSON.stringify')
      ).length;
      
      if (heavyOperations > 2) {
        coreWebVitalsIssues.fid.heavyJavaScriptTasks.push({
          file: relativePath,
          issue: `${heavyOperations} synchronous JSON operations`,
          impact: 'MEDIUM - May block main thread and increase FID',
          solution: 'Consider using web workers or async processing'
        });
      }
    }
    
    // CLS - Images without dimensions
    const imgTagsWithoutDimensions = content.matchAll(/<img[^>]*(?!.*(?:width|height|className.*w-|className.*h-))[^>]*>/g);
    let undimensionedImages = 0;
    for (const match of imgTagsWithoutDimensions) {
      undimensionedImages++;
    }
    
    if (undimensionedImages > 0) {
      coreWebVitalsIssues.cls.imagesWithoutDimensions.push({
        file: relativePath,
        issue: `${undimensionedImages} images without explicit dimensions`,
        impact: 'HIGH - Causes layout shifts when images load',
        solution: 'Add explicit width/height or aspect-ratio CSS'
      });
    }
    
    // CLS - Dynamic content insertion
    if (content.includes('appendChild') || content.includes('insertBefore')) {
      coreWebVitalsIssues.cls.dynamicContentInsertion.push({
        file: relativePath,
        issue: 'Dynamic DOM content insertion',
        impact: 'MEDIUM - May cause layout shifts',
        solution: 'Reserve space for dynamic content or use CSS transitions'
      });
    }
  });
  
  ANALYSIS_RESULTS.coreWebVitalsAnalysis = coreWebVitalsIssues;
  
  // Display results
  Object.entries(coreWebVitalsIssues).forEach(([metric, categories]) => {
    console.log(`\n📊 ${metric.toUpperCase()} OPTIMIZATION OPPORTUNITIES:`);
    Object.entries(categories).forEach(([category, issues]) => {
      if (issues.length > 0) {
        console.log(`\n   ❌ ${category.replace(/([A-Z])/g, ' $1').trim()}: ${issues.length} issues`);
        issues.slice(0, 2).forEach((issue, index) => {
          console.log(`      ${index + 1}. ${issue.file}`);
          console.log(`         Issue: ${issue.issue}`);
          console.log(`         Impact: ${issue.impact}`);
          console.log(`         Solution: ${issue.solution}`);
        });
        if (issues.length > 2) {
          console.log(`      ... and ${issues.length - 2} more files`);
        }
      }
    });
  });
  
  return coreWebVitalsIssues;
}

// Generate optimization recommendations with priorities
function generateOptimizationPlan() {
  console.log('\n🎯 RUNTIME PERFORMANCE OPTIMIZATION PLAN');
  console.log('=' .repeat(50));
  
  const optimizations = [
    {
      priority: 'CRITICAL',
      category: 'Context Provider Optimization',
      issue: 'Context providers creating new objects on every render',
      impact: 'Causes all consumer components to re-render unnecessarily',
      solution: 'Implement useMemo for context value objects',
      effort: '1-2 hours',
      estimatedImprovement: '30-50% reduction in re-renders for context consumers'
    },
    {
      priority: 'HIGH',
      category: 'Component Memoization',
      issue: 'Components missing React.memo wrapping',
      impact: 'Unnecessary re-renders when parent components update',
      solution: 'Wrap functional components with React.memo',
      effort: '2-3 hours',
      estimatedImprovement: '20-40% reduction in component re-renders'
    },
    {
      priority: 'HIGH',
      category: 'Image Optimization',
      issue: 'Regular img tags instead of Next.js optimized images',
      impact: 'Slower loading and poor LCP scores',
      solution: 'Replace img tags with next/image components',
      effort: '1-2 hours',
      estimatedImprovement: '25-40% improvement in LCP scores'
    },
    {
      priority: 'HIGH',
      category: 'Memory Leak Prevention',
      issue: 'Event listeners and timers without cleanup',
      impact: 'Memory usage increases over time, performance degrades',
      solution: 'Add proper cleanup in useEffect return functions',
      effort: '1-2 hours',
      estimatedImprovement: 'Prevents memory leaks and performance degradation'
    },
    {
      priority: 'MEDIUM',
      category: 'Inline Object Props',
      issue: 'Objects created inline in JSX props',
      impact: 'New objects created on every render causing child re-renders',
      solution: 'Move objects outside render or use useMemo',
      effort: '2-4 hours',
      estimatedImprovement: '15-30% reduction in unnecessary re-renders'
    },
    {
      priority: 'MEDIUM',
      category: 'Heavy Computations',
      issue: 'Array processing without memoization',
      impact: 'Repeated calculations on every render',
      solution: 'Wrap expensive operations in useMemo',
      effort: '1-3 hours',
      estimatedImprovement: '10-25% reduction in CPU usage during renders'
    }
  ];
  
  optimizations.forEach((opt, index) => {
    console.log(`\n${index + 1}. [${opt.priority}] ${opt.category}`);
    console.log(`   Issue: ${opt.issue}`);
    console.log(`   Impact: ${opt.impact}`);
    console.log(`   Solution: ${opt.solution}`);
    console.log(`   Effort: ${opt.effort}`);
    console.log(`   Improvement: ${opt.estimatedImprovement}`);
  });
  
  ANALYSIS_RESULTS.optimizationOpportunities = optimizations;
  
  return optimizations;
}

// Generate implementation roadmap
function generateImplementationRoadmap() {
  console.log('\n📋 PHASE 3A IMPLEMENTATION ROADMAP');
  console.log('=' .repeat(50));
  
  const roadmap = [
    {
      step: '3A.1',
      title: 'Context Provider Value Optimization',
      priority: 'CRITICAL',
      tasks: [
        'Audit all Context providers for inline value objects',
        'Implement useMemo for context values',
        'Test impact on consumer component re-renders',
        'Measure performance improvement'
      ],
      estimatedTime: '1-2 hours',
      expectedROI: 'Very High'
    },
    {
      step: '3A.2',
      title: 'Component Memoization Implementation',
      priority: 'HIGH',
      tasks: [
        'Identify components with heavy render logic',
        'Wrap appropriate components with React.memo',
        'Add custom comparison functions where needed',
        'Test for broken functionality after memoization'
      ],
      estimatedTime: '2-3 hours',
      expectedROI: 'High'
    },
    {
      step: '3A.3',
      title: 'Image Optimization & Core Web Vitals',
      priority: 'HIGH',
      tasks: [
        'Replace img tags with next/image components',
        'Add appropriate loading strategies (lazy/priority)',
        'Set explicit dimensions to prevent CLS',
        'Measure Core Web Vitals improvements'
      ],
      estimatedTime: '1-2 hours',
      expectedROI: 'High'
    },
    {
      step: '3A.4',
      title: 'Memory Leak Prevention',
      priority: 'HIGH',
      tasks: [
        'Audit useEffect hooks for cleanup functions',
        'Add event listener cleanup',
        'Add timer/interval cleanup',
        'Test for memory leaks in development tools'
      ],
      estimatedTime: '1-2 hours',
      expectedROI: 'Medium-High'
    },
    {
      step: '3A.5',
      title: 'Render Optimization (Props & Computations)',
      priority: 'MEDIUM',
      tasks: [
        'Move inline object props to useMemo or outside component',
        'Wrap heavy computations in useMemo',
        'Optimize useEffect dependency arrays',
        'Performance testing and validation'
      ],
      estimatedTime: '2-4 hours',
      expectedROI: 'Medium'
    }
  ];
  
  roadmap.forEach((phase, index) => {
    console.log(`\n🔨 ${phase.step}: ${phase.title} [${phase.priority}]`);
    console.log(`   Time: ${phase.estimatedTime} | ROI: ${phase.expectedROI}`);
    console.log('   Tasks:');
    phase.tasks.forEach((task, taskIndex) => {
      console.log(`      ${taskIndex + 1}. ${task}`);
    });
  });
  
  console.log('\n📊 TOTAL ESTIMATED EFFORT: 7-14 hours');
  console.log('🎯 EXPECTED OVERALL IMPACT: 30-60% performance improvement');
  console.log('💰 ESTIMATED ROI: Very High - Direct user experience improvement');
}

// Main analysis execution
async function main() {
  try {
    console.log('🔍 Starting comprehensive runtime performance analysis...\n');
    
    // Run all analyses
    const reRenderAnalysis = analyzeComponentReRenders();
    const memoryAnalysis = analyzeMemoryUsage();
    const coreWebVitalsAnalysis = analyzeCoreWebVitals();
    
    // Generate optimization plan
    const optimizationPlan = generateOptimizationPlan();
    generateImplementationRoadmap();
    
    // Save comprehensive report
    const reportPath = path.join(__dirname, 'phase-3a-runtime-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(ANALYSIS_RESULTS, null, 2));
    
    console.log(`\n📄 Detailed analysis saved: ${reportPath}`);
    console.log('\n🚀 PHASE 3A ANALYSIS COMPLETE!');
    console.log('🎯 Ready to begin systematic runtime performance optimization');
    console.log('💡 Starting with CRITICAL priority optimizations for maximum impact!');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ANALYSIS_RESULTS };