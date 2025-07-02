
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
}
