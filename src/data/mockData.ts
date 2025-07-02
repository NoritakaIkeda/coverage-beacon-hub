
import { Repository } from "@/types/repository";

export const mockRepositories: Repository[] = [
  {
    id: "react",
    name: "facebook/react",
    description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    githubUrl: "https://github.com/facebook/react",
    coveragePercentage: 87,
    averageComplexity: 12.3,
    totalFunctions: 1847,
    testedFunctions: 1607,
    highComplexityCount: 234,
    testFiles: 145,
    totalLOC: 89420,
    testedLOC: 77795,
    riskScore: 3,
    stars: 228000,
    lastAnalyzed: "2 days ago",
    tags: ["javascript", "ui-library", "frontend", "facebook"],
    coverageByCategory: [
      { category: "Core", coverage: 92, tested: 287, total: 312 },
      { category: "Hooks", coverage: 89, tested: 156, total: 175 },
      { category: "Components", coverage: 85, tested: 445, total: 523 },
      { category: "Utils", coverage: 78, tested: 298, total: 382 },
      { category: "DOM", coverage: 91, tested: 421, total: 455 }
    ],
    functions: [
      { 
        name: "useState", 
        complexity: 8, 
        coverage: 95, 
        category: "Hooks", 
        isTested: true, 
        lineNumber: 142,
        riskLevel: 'low',
        testCoverage: [
          { testFile: "hooks.test.js", testCase: "should update state correctly", coverageType: "unit", coveredLines: [142, 143, 144] }
        ]
      },
      { 
        name: "useEffect", 
        complexity: 12, 
        coverage: 92, 
        category: "Hooks", 
        isTested: true, 
        lineNumber: 178,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "hooks.test.js", testCase: "should handle effect cleanup", coverageType: "unit", coveredLines: [178, 179, 180, 185] }
        ]
      },
      { 
        name: "createElement", 
        complexity: 15, 
        coverage: 88, 
        category: "Core", 
        isTested: true, 
        lineNumber: 89,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "core.test.js", testCase: "should create element with props", coverageType: "unit", coveredLines: [89, 90, 91, 95] }
        ]
      },
      { 
        name: "reconcileChildren", 
        complexity: 23, 
        coverage: 0, 
        category: "Core", 
        isTested: false, 
        lineNumber: 1204,
        riskLevel: 'high',
        testCoverage: []
      },
      { 
        name: "updateFunctionComponent", 
        complexity: 18, 
        coverage: 85, 
        category: "Components", 
        isTested: true, 
        lineNumber: 567,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "components.test.js", testCase: "should update function component", coverageType: "integration", coveredLines: [567, 568, 570, 575] }
        ]
      },
      { 
        name: "commitMutationEffects", 
        complexity: 28, 
        coverage: 0, 
        category: "DOM", 
        isTested: false, 
        lineNumber: 2134,
        riskLevel: 'high',
        testCoverage: []
      },
      { 
        name: "scheduleWork", 
        complexity: 21, 
        coverage: 72, 
        category: "Core", 
        isTested: true, 
        lineNumber: 892,
        riskLevel: 'high',
        testCoverage: [
          { testFile: "scheduler.test.js", testCase: "should schedule work correctly", coverageType: "unit", coveredLines: [892, 893, 900] }
        ]
      },
      { 
        name: "flushPassiveEffects", 
        complexity: 19, 
        coverage: 0, 
        category: "Hooks", 
        isTested: false, 
        lineNumber: 1678,
        riskLevel: 'high',
        testCoverage: []
      }
    ]
  },
  {
    id: "vue",
    name: "vuejs/vue",
    description: "The progressive JavaScript framework for building modern web interfaces.",
    githubUrl: "https://github.com/vuejs/vue",
    coveragePercentage: 76,
    averageComplexity: 14.7,
    totalFunctions: 1234,
    testedFunctions: 938,
    highComplexityCount: 187,
    testFiles: 89,
    totalLOC: 45670,
    testedLOC: 34709,
    riskScore: 5,
    stars: 207000,
    lastAnalyzed: "1 day ago",
    tags: ["javascript", "framework", "frontend", "vue"],
    coverageByCategory: [
      { category: "Reactivity", coverage: 82, tested: 245, total: 299 },
      { category: "Compiler", coverage: 71, tested: 167, total: 235 },
      { category: "Runtime", coverage: 78, tested: 312, total: 400 },
      { category: "Utils", coverage: 69, tested: 214, total: 300 }
    ],
    functions: [
      { 
        name: "reactive", 
        complexity: 16, 
        coverage: 88, 
        category: "Reactivity", 
        isTested: true, 
        lineNumber: 234,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "reactivity.test.js", testCase: "should make object reactive", coverageType: "unit", coveredLines: [234, 235, 240] }
        ]
      },
      { 
        name: "compile", 
        complexity: 24, 
        coverage: 0, 
        category: "Compiler", 
        isTested: false, 
        lineNumber: 567,
        riskLevel: 'high',
        testCoverage: []
      },
      { 
        name: "mount", 
        complexity: 19, 
        coverage: 85, 
        category: "Runtime", 
        isTested: true, 
        lineNumber: 123,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "runtime.test.js", testCase: "should mount component", coverageType: "integration", coveredLines: [123, 124, 130] }
        ]
      },
      { 
        name: "patch", 
        complexity: 22, 
        coverage: 0, 
        category: "Runtime", 
        isTested: false, 
        lineNumber: 889,
        riskLevel: 'high',
        testCoverage: []
      }
    ]
  },
  {
    id: "express",
    name: "expressjs/express",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
    githubUrl: "https://github.com/expressjs/express",
    coveragePercentage: 94,
    averageComplexity: 8.9,
    totalFunctions: 456,
    testedFunctions: 429,
    highComplexityCount: 23,
    testFiles: 67,
    totalLOC: 12340,
    testedLOC: 11600,
    riskScore: 2,
    stars: 65000,
    lastAnalyzed: "3 hours ago",
    tags: ["nodejs", "web-framework", "backend", "javascript"],
    coverageByCategory: [
      { category: "Router", coverage: 96, tested: 156, total: 162 },
      { category: "Middleware", coverage: 92, tested: 134, total: 146 },
      { category: "Request", coverage: 95, tested: 89, total: 94 },
      { category: "Response", coverage: 91, tested: 50, total: 54 }
    ],
    functions: [
      { 
        name: "app.get", 
        complexity: 6, 
        coverage: 98, 
        category: "Router", 
        isTested: true, 
        lineNumber: 45,
        riskLevel: 'low',
        testCoverage: [
          { testFile: "router.test.js", testCase: "should handle GET requests", coverageType: "integration", coveredLines: [45, 46, 47] }
        ]
      },
      { 
        name: "router.use", 
        complexity: 8, 
        coverage: 95, 
        category: "Middleware", 
        isTested: true, 
        lineNumber: 123,
        riskLevel: 'low',
        testCoverage: [
          { testFile: "middleware.test.js", testCase: "should apply middleware", coverageType: "unit", coveredLines: [123, 124, 125] }
        ]
      },
      { 
        name: "req.query", 
        complexity: 4, 
        coverage: 100, 
        category: "Request", 
        isTested: true, 
        lineNumber: 234,
        riskLevel: 'low',
        testCoverage: [
          { testFile: "request.test.js", testCase: "should parse query parameters", coverageType: "unit", coveredLines: [234, 235] }
        ]
      },
      { 
        name: "res.json", 
        complexity: 7, 
        coverage: 0, 
        category: "Response", 
        isTested: false, 
        lineNumber: 345,
        riskLevel: 'low',
        testCoverage: []
      }
    ]
  },
  {
    id: "lodash",
    name: "lodash/lodash",
    description: "A modern JavaScript utility library delivering modularity, performance & extras.",
    githubUrl: "https://github.com/lodash/lodash",
    coveragePercentage: 68,
    averageComplexity: 11.2,
    totalFunctions: 2890,
    testedFunctions: 1965,
    highComplexityCount: 456,
    testFiles: 234,
    totalLOC: 67890,
    testedLOC: 46165,
    riskScore: 6,
    stars: 59000,
    lastAnalyzed: "5 days ago",
    tags: ["javascript", "utility", "functional", "library"],
    coverageByCategory: [
      { category: "Array", coverage: 72, tested: 423, total: 587 },
      { category: "Object", coverage: 65, tested: 356, total: 548 },
      { category: "String", coverage: 71, tested: 234, total: 329 },
      { category: "Function", coverage: 63, tested: 189, total: 300 },
      { category: "Math", coverage: 78, tested: 167, total: 214 }
    ],
    functions: [
      { 
        name: "map", 
        complexity: 9, 
        coverage: 85, 
        category: "Array", 
        isTested: true, 
        lineNumber: 1234,
        riskLevel: 'low',
        testCoverage: [
          { testFile: "array.test.js", testCase: "should map array elements", coverageType: "unit", coveredLines: [1234, 1235, 1240] }
        ]
      },
      { 
        name: "reduce", 
        complexity: 12, 
        coverage: 0, 
        category: "Array", 
        isTested: false, 
        lineNumber: 1567,
        riskLevel: 'medium',
        testCoverage: []
      },
      { 
        name: "debounce", 
        complexity: 18, 
        coverage: 72, 
        category: "Function", 
        isTested: true, 
        lineNumber: 2345,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "function.test.js", testCase: "should debounce function calls", coverageType: "unit", coveredLines: [2345, 2346, 2350] }
        ]
      },
      { 
        name: "cloneDeep", 
        complexity: 25, 
        coverage: 0, 
        category: "Object", 
        isTested: false, 
        lineNumber: 3456,
        riskLevel: 'high',
        testCoverage: []
      }
    ]
  },
  {
    id: "axios",
    name: "axios/axios",
    description: "Promise based HTTP client for the browser and node.js",
    githubUrl: "https://github.com/axios/axios",
    coveragePercentage: 89,
    averageComplexity: 10.4,
    totalFunctions: 234,
    testedFunctions: 208,
    highComplexityCount: 34,
    testFiles: 45,
    totalLOC: 8950,
    testedLOC: 7966,
    riskScore: 3,
    stars: 105000,
    lastAnalyzed: "1 day ago",
    tags: ["javascript", "http-client", "promise", "nodejs"],
    coverageByCategory: [
      { category: "Core", coverage: 92, tested: 67, total: 73 },
      { category: "Adapters", coverage: 87, tested: 45, total: 52 },
      { category: "Interceptors", coverage: 85, tested: 34, total: 40 },
      { category: "Utils", coverage: 91, tested: 62, total: 69 }
    ],
    functions: [
      { 
        name: "request", 
        complexity: 14, 
        coverage: 95, 
        category: "Core", 
        isTested: true, 
        lineNumber: 234,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "core.test.js", testCase: "should make HTTP request", coverageType: "integration", coveredLines: [234, 235, 240, 245] }
        ]
      },
      { 
        name: "get", 
        complexity: 7, 
        coverage: 98, 
        category: "Core", 
        isTested: true, 
        lineNumber: 345,
        riskLevel: 'low',
        testCoverage: [
          { testFile: "core.test.js", testCase: "should handle GET requests", coverageType: "unit", coveredLines: [345, 346] }
        ]
      },
      { 
        name: "post", 
        complexity: 8, 
        coverage: 0, 
        category: "Core", 
        isTested: false, 
        lineNumber: 456,
        riskLevel: 'low',
        testCoverage: []
      },
      { 
        name: "interceptRequest", 
        complexity: 16, 
        coverage: 87, 
        category: "Interceptors", 
        isTested: true, 
        lineNumber: 567,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "interceptors.test.js", testCase: "should intercept requests", coverageType: "unit", coveredLines: [567, 568, 570] }
        ]
      }
    ]
  },
  {
    id: "webpack",
    name: "webpack/webpack",
    description: "A bundler for javascript and friends. Packs many modules into a few bundled assets.",
    githubUrl: "https://github.com/webpack/webpack",
    coveragePercentage: 72,
    averageComplexity: 16.8,
    totalFunctions: 3456,
    testedFunctions: 2488,
    highComplexityCount: 678,
    testFiles: 567,
    totalLOC: 156789,
    testedLOC: 112888,
    riskScore: 7,
    stars: 64000,
    lastAnalyzed: "4 days ago",
    tags: ["javascript", "bundler", "build-tools", "nodejs"],
    coverageByCategory: [
      { category: "Compiler", coverage: 68, tested: 456, total: 671 },
      { category: "Plugins", coverage: 74, tested: 623, total: 842 },
      { category: "Loaders", coverage: 71, tested: 345, total: 486 },
      { category: "Runtime", coverage: 76, tested: 567, total: 746 },
      { category: "Utils", coverage: 69, tested: 497, total: 721 }
    ],
    functions: [
      { 
        name: "compile", 
        complexity: 28, 
        coverage: 0, 
        category: "Compiler", 
        isTested: false, 
        lineNumber: 1234,
        riskLevel: 'high',
        testCoverage: []
      },
      { 
        name: "run", 
        complexity: 19, 
        coverage: 85, 
        category: "Compiler", 
        isTested: true, 
        lineNumber: 2345,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "compiler.test.js", testCase: "should run compilation", coverageType: "integration", coveredLines: [2345, 2346, 2350, 2355] }
        ]
      },
      { 
        name: "applyPlugin", 
        complexity: 12, 
        coverage: 78, 
        category: "Plugins", 
        isTested: true, 
        lineNumber: 3456,
        riskLevel: 'medium',
        testCoverage: [
          { testFile: "plugins.test.js", testCase: "should apply plugin correctly", coverageType: "unit", coveredLines: [3456, 3457, 3460] }
        ]
      },
      { 
        name: "resolveModule", 
        complexity: 24, 
        coverage: 0, 
        category: "Runtime", 
        isTested: false, 
        lineNumber: 4567,
        riskLevel: 'high',
        testCoverage: []
      }
    ]
  }
];
