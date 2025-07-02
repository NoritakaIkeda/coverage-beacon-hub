/**
 * 自然言語解析のための型定義
 * T-wada/Vladimir Khorikov哲学に基づくテスト戦略評価
 */

export interface FunctionAnalysisInput {
  functionName: string;
  complexity: number;
  sourceCode: string;
  testCoverage: TestCoverageInfo[];
  branchCoverage: number;
  lineCoverage: number;
}

export interface TestCoverageInfo {
  testFile: string;
  testCase: string;
  coverageType: 'unit' | 'integration' | 'e2e';
  coveredLines: number[];
}

export interface NaturalAnalysisResult {
  // 複雑度分析結果
  complexityCategory: ComplexityCategory;
  complexityReason: string;
  businessBackground?: string;
  technicalConstraints?: string;
  historicalContext?: string;
  
  // テスト戦略評価
  testPhilosophy: TestPhilosophy;
  testStrategy: string;
  testSmells: string[];
  testQuality: QualityLevel;
  
  // 戦略的評価
  riskLevel: RiskLevel;
  riskAssessment: string;
  strategicEvaluation: string;
  changeResilience: ResilienceLevel;
  recommendations: string[];
  
  // 振る舞い記述評価
  behaviorDescription: string;
  specificationQuality: QualityLevel;
}

export type ComplexityCategory = 
  | 'business-logic'      // ビジネスロジック起因
  | 'technical-constraints' // 技術的制約起因  
  | 'historical-layers'   // 歴史的経緯起因
  | 'algorithmic'         // アルゴリズム複雑度
  | 'integration'         // 外部依存統合複雑度
  | 'unknown';

export type TestPhilosophy =
  | 'behavior-driven'        // 振る舞い駆動（t-wada推奨）
  | 'specification-based'    // 仕様ベース
  | 'implementation-coupled' // 実装詳細結合（アンチパターン）
  | 'coverage-driven'        // カバレッジ重視（不十分）
  | 'missing';               // テスト不在

export type QualityLevel = 'high' | 'medium' | 'low' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ResilienceLevel = 'resilient' | 'fragile' | 'brittle';

/**
 * Vladimir Khorikov の Unit Testing Principles に基づく評価指標
 */
export interface KhorikovTestEvaluation {
  // 4つの柱の評価
  protectionAgainstRegressions: QualityLevel;
  resistanceToRefactoring: QualityLevel;
  fastFeedback: QualityLevel;
  maintainability: QualityLevel;
  
  // テストの種類分類
  testType: 'unit' | 'integration' | 'e2e' | 'mixed';
  
  // Mock使用の適切性
  mockUsage: 'appropriate' | 'excessive' | 'insufficient';
  
  // 全体評価
  overallScore: QualityLevel;
}

/**
 * T-wada テスト哲学評価指標
 */
export interface TwadaTestEvaluation {
  // 「テストコードは仕様書」の実現度
  specificationClarity: QualityLevel;
  
  // 振る舞いベース記述の度合い
  behaviorFocus: QualityLevel;
  
  // Given-When-Then 構造の明確さ
  testStructureClarity: QualityLevel;
  
  // テスト名の表現力
  testNameExpressiveness: QualityLevel;
  
  // 境界値・異常系の網羅性
  edgeCaseCoverage: QualityLevel;
  
  // 全体評価
  overallScore: QualityLevel;
}

/**
 * 統合評価結果
 */
export interface ComprehensiveAnalysisResult extends NaturalAnalysisResult {
  khorikovEvaluation: KhorikovTestEvaluation;
  twadaEvaluation: TwadaTestEvaluation;
  
  // 日本語での総合解説
  comprehensiveSummary: string;
  
  // 具体的改善提案
  actionableRecommendations: ActionableRecommendation[];
}

export interface ActionableRecommendation {
  category: 'test-strategy' | 'refactoring' | 'architecture' | 'documentation';
  priority: 'immediate' | 'short-term' | 'long-term';
  description: string;
  rationale: string;
  estimatedEffort: 'low' | 'medium' | 'high';
}

/**
 * 複雑度意図推定結果
 */
export interface ComplexityIntentResult {
  complexityCategory: ComplexityCategory;
  businessBackground: string;
  technicalConstraints: string;
  complexityReason: string;
  intentionalComplexity: boolean;
  businessValue: 'low' | 'medium' | 'high' | 'critical';
  securityImplications?: 'low' | 'medium' | 'high' | 'critical';
  migrationComplexity?: 'low' | 'medium' | 'high';
  technicalDebt?: 'low' | 'medium' | 'high';
  integrationComplexity?: 'low' | 'medium' | 'high';
  externalDependencies?: string[];
  algorithmicPurpose?: string;
  performanceConsiderations?: string;
  algorithmicComplexity?: string;
  historicalContext?: string;
  refactoringPriority?: 'low' | 'medium' | 'high';
  secondaryCategories?: ComplexityCategory[];
  mixedComplexityReason?: string;
}