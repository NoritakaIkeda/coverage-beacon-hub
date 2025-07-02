
export interface Repository {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  coveragePercentage: number;
  averageComplexity: number;
  totalFunctions: number;
  testedFunctions: number;
  highComplexityCount: number;
  testFiles: number;
  totalLOC: number;
  testedLOC: number;
  riskScore: number;
  stars: number;
  lastAnalyzed: string;
  tags: string[];
  coverageByCategory: CategoryCoverage[];
  functions: FunctionData[];
}

export interface CategoryCoverage {
  category: string;
  coverage: number;
  tested: number;
  total: number;
}

export interface FunctionData {
  name: string;
  complexity: number;
  coverage: number;
  category: string;
  isTested: boolean;
  lineNumber: number;
  businessIntent?: string;
  implementationNotes?: string;
  testCoverage: TestCoverageInfo[];
  branchCoverage?: BranchCoverageInfo[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface TestCoverageInfo {
  testFile: string;
  testCase: string;
  coverageType: 'unit' | 'integration' | 'e2e';
  coveredLines: number[];
}

export interface BranchCoverageInfo {
  condition: string;
  isCovered: boolean;
  testCase?: string;
}
