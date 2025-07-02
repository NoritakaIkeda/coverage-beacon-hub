import { 
  FunctionAnalysisInput, 
  KhorikovTestEvaluation, 
  TwadaTestEvaluation,
  ComprehensiveAnalysisResult,
  QualityLevel,
  ActionableRecommendation
} from '@/types/analysis';

/**
 * T-wada/Vladimir Khorikov テスト哲学評価エンジン
 */
export class TestPhilosophyEvaluator {

  /**
   * Vladimir Khorikov の4つの柱に基づく評価
   */
  async evaluateKhorikovPrinciples(input: FunctionAnalysisInput): Promise<KhorikovTestEvaluation> {
    const protectionAgainstRegressions = this.assessRegressionProtection(input);
    const resistanceToRefactoring = this.assessRefactoringResistance(input);
    const fastFeedback = this.assessFeedbackSpeed(input);
    const maintainability = this.assessMaintainability(input);
    const mockUsage = this.evaluateMockUsage(input);
    const testType = this.classifyTestType(input);
    
    const overallScore = this.calculateKhorikovOverallScore({
      protectionAgainstRegressions,
      resistanceToRefactoring,
      fastFeedback,
      maintainability
    });

    return {
      protectionAgainstRegressions,
      resistanceToRefactoring,
      fastFeedback,
      maintainability,
      testType,
      mockUsage,
      overallScore
    };
  }

  /**
   * T-wada テスト哲学評価
   */
  async evaluateTwadaPhilosophy(input: FunctionAnalysisInput): Promise<TwadaTestEvaluation> {
    const specificationClarity = this.assessSpecificationClarity(input);
    const behaviorFocus = this.assessBehaviorFocus(input);
    const testStructureClarity = this.assessTestStructure(input);
    const testNameExpressiveness = this.assessTestNameExpressiveness(input);
    const edgeCaseCoverage = this.assessEdgeCaseCoverage(input);
    
    const overallScore = this.calculateTwadaOverallScore({
      specificationClarity,
      behaviorFocus,
      testStructureClarity,
      testNameExpressiveness,
      edgeCaseCoverage
    });

    return {
      specificationClarity,
      behaviorFocus,
      testStructureClarity,
      testNameExpressiveness,
      edgeCaseCoverage,
      overallScore
    };
  }

  /**
   * 包括的評価（両哲学を統合）
   */
  async evaluateComprehensively(input: FunctionAnalysisInput): Promise<ComprehensiveAnalysisResult> {
    const khorikovEvaluation = await this.evaluateKhorikovPrinciples(input);
    const twadaEvaluation = await this.evaluateTwadaPhilosophy(input);
    
    const comprehensiveSummary = this.generateComprehensiveSummary(
      input, 
      khorikovEvaluation, 
      twadaEvaluation
    );
    
    const actionableRecommendations = this.generateActionableRecommendations(
      input,
      khorikovEvaluation,
      twadaEvaluation
    );

    return {
      complexityCategory: 'unknown',
      complexityReason: '',
      testPhilosophy: 'behavior-driven',
      testStrategy: '',
      testSmells: [],
      testQuality: khorikovEvaluation.overallScore,
      riskLevel: 'medium',
      riskAssessment: '',
      strategicEvaluation: '',
      changeResilience: 'resilient',
      recommendations: [],
      behaviorDescription: '',
      specificationQuality: twadaEvaluation.overallScore,
      khorikovEvaluation,
      twadaEvaluation,
      comprehensiveSummary,
      actionableRecommendations
    };
  }

  // Khorikov評価メソッド群
  private assessRegressionProtection(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage, branchCoverage, lineCoverage } = input;
    
    if (testCoverage.length === 0) return 'critical';
    if (branchCoverage >= 90 && lineCoverage >= 90) return 'high';
    if (branchCoverage >= 70 && lineCoverage >= 80) return 'medium';
    return 'low';
  }

  private assessRefactoringResistance(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage } = input;
    
    // 実装詳細結合の検出
    const hasImplementationCoupling = testCoverage.some(test =>
      test.testCase.includes('should call') ||
      test.testCase.includes('mock') ||
      test.testCase.includes('stub')
    );
    
    if (hasImplementationCoupling) return 'low';
    
    // 振る舞い重視テストの検出
    const hasBehaviorFocus = testCoverage.some(test =>
      test.testCase.includes('should') &&
      !test.testCase.includes('call')
    );
    
    if (hasBehaviorFocus) return 'high';
    return 'medium';
  }

  private assessFeedbackSpeed(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage } = input;
    const hasIntegrationTests = testCoverage.some(test => test.coverageType === 'integration');
    const hasE2ETests = testCoverage.some(test => test.coverageType === 'e2e');
    
    if (hasE2ETests) return 'low';
    if (hasIntegrationTests) return 'medium';
    return 'high'; // Unit tests
  }

  private assessMaintainability(input: FunctionAnalysisInput): QualityLevel {
    const mockUsage = this.evaluateMockUsage(input);
    const nameQuality = this.assessTestNameExpressiveness(input);
    const testType = this.classifyTestType(input);
    
    if (mockUsage === 'excessive' || nameQuality === 'low') return 'low';
    // 統合テストの場合は保守コストが高い（優先評価）
    if (testType === 'integration') return 'medium';
    if (mockUsage === 'appropriate' && nameQuality === 'high') return 'high';
    return 'medium';
  }

  private evaluateMockUsage(input: FunctionAnalysisInput): 'appropriate' | 'excessive' | 'insufficient' {
    const { testCoverage } = input;
    const mockRelatedTests = testCoverage.filter(test =>
      test.testCase.includes('call') ||
      test.testCase.includes('mock') ||
      test.testCase.includes('stub')
    );
    
    const mockRatio = mockRelatedTests.length / Math.max(testCoverage.length, 1);
    
    if (mockRatio > 0.7) return 'excessive';
    if (mockRatio < 0.1 && input.complexity > 15) return 'insufficient';
    return 'appropriate';
  }

  private classifyTestType(input: FunctionAnalysisInput): 'unit' | 'integration' | 'e2e' | 'mixed' {
    const { testCoverage } = input;
    const types = new Set(testCoverage.map(test => test.coverageType));
    
    if (types.size > 1) return 'mixed';
    if (types.has('e2e')) return 'e2e';
    if (types.has('integration')) return 'integration';
    return 'unit';
  }

  private calculateKhorikovOverallScore(scores: {
    protectionAgainstRegressions: QualityLevel;
    resistanceToRefactoring: QualityLevel;
    fastFeedback: QualityLevel;
    maintainability: QualityLevel;
  }): QualityLevel {
    const values = Object.values(scores);
    const lowCount = values.filter(v => v === 'low' || v === 'critical').length;
    const highCount = values.filter(v => v === 'high').length;
    const mediumCount = values.filter(v => v === 'medium').length;
    
    if (lowCount >= 2) return 'low';
    if (highCount >= 2 && lowCount === 0) return 'high';
    if (highCount >= 3) return 'high';
    return 'medium';
  }

  // T-wada評価メソッド群
  private assessSpecificationClarity(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage } = input;
    
    if (testCoverage.length === 0) return 'low';
    
    const hasGivenWhenThen = testCoverage.some(test =>
      test.testCase.includes('Given') &&
      test.testCase.includes('When') &&
      test.testCase.includes('Then')
    );
    
    if (hasGivenWhenThen) return 'high';
    
    const hasClearStructure = testCoverage.some(test =>
      test.testCase.includes('should') && test.testCase.length > 20
    );
    
    if (hasClearStructure) return 'medium';
    return 'low';
  }

  private assessBehaviorFocus(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage } = input;
    
    const behaviorTests = testCoverage.filter(test =>
      (test.testCase.includes('should') && !test.testCase.includes('call')) ||
      test.testCase.includes('Given') ||
      test.testCase.includes('When') ||
      test.testCase.includes('Then')
    );
    
    const behaviorRatio = behaviorTests.length / Math.max(testCoverage.length, 1);
    
    if (behaviorRatio >= 0.8) return 'high';
    if (behaviorRatio >= 0.5) return 'medium';
    return 'low';
  }

  private assessTestStructure(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage } = input;
    
    const structuredTests = testCoverage.filter(test =>
      test.testCase.includes('Given') ||
      (test.testCase.includes('should') && test.testCase.length > 30)
    );
    
    const structureRatio = structuredTests.length / Math.max(testCoverage.length, 1);
    
    if (structureRatio >= 0.8) return 'high';
    if (structureRatio >= 0.5) return 'medium';
    return 'low';
  }

  private assessTestNameExpressiveness(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage } = input;
    
    const poorNames = testCoverage.filter(test =>
      test.testCase === 'test1' ||
      test.testCase.includes('_test') ||
      test.testCase.length < 10
    );
    
    if (poorNames.length > 0) return 'low';
    
    const goodNames = testCoverage.filter(test =>
      test.testCase.includes('should') ||
      test.testCase.includes('Given')
    );
    
    const goodNamesRatio = goodNames.length / Math.max(testCoverage.length, 1);
    
    if (goodNamesRatio >= 0.8) return 'high';
    if (goodNamesRatio >= 0.5) return 'medium';
    return 'low';
  }

  private assessEdgeCaseCoverage(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage, branchCoverage } = input;
    
    const edgeTests = testCoverage.filter(test =>
      test.testCase.includes('boundary') ||
      test.testCase.includes('edge') ||
      test.testCase.includes('negative') ||
      test.testCase.includes('zero') ||
      test.testCase.includes('null') ||
      test.testCase.includes('empty') ||
      test.testCase.includes('invalid') ||
      test.testCase.includes('error') ||
      test.testCase.includes('exception')
    );
    
    const edgeRatio = edgeTests.length / Math.max(testCoverage.length, 1);
    
    if (branchCoverage >= 95 && edgeRatio >= 0.3) return 'high';
    if (branchCoverage >= 75 && edgeRatio >= 0.1) return 'medium';
    if (branchCoverage >= 50) return 'medium';
    return 'low';
  }

  private calculateTwadaOverallScore(scores: {
    specificationClarity: QualityLevel;
    behaviorFocus: QualityLevel;
    testStructureClarity: QualityLevel;
    testNameExpressiveness: QualityLevel;
    edgeCaseCoverage: QualityLevel;
  }): QualityLevel {
    const values = Object.values(scores);
    const lowCount = values.filter(v => v === 'low' || v === 'critical').length;
    const highCount = values.filter(v => v === 'high').length;
    
    if (lowCount >= 3) return 'low';
    if (highCount >= 4) return 'high';
    return 'medium';
  }

  private generateComprehensiveSummary(
    input: FunctionAnalysisInput,
    khorikov: KhorikovTestEvaluation,
    twada: TwadaTestEvaluation
  ): string {
    return `
## 包括的テスト評価サマリー

### Vladimir Khorikov 4つの柱評価
- 回帰バグ保護: ${khorikov.protectionAgainstRegressions}
- リファクタリング耐性: ${khorikov.resistanceToRefactoring}  
- 高速フィードバック: ${khorikov.fastFeedback}
- 保守性: ${khorikov.maintainability}

### T-wada テスト哲学評価
- 仕様明確度: ${twada.specificationClarity}
- 振る舞い重視度: ${twada.behaviorFocus}
- テスト構造: ${twada.testStructureClarity}
- 境界値網羅: ${twada.edgeCaseCoverage}

両哲学の観点から、このテスト戦略は${khorikov.overallScore}レベルの品質と評価されます。
    `.trim();
  }

  private generateActionableRecommendations(
    input: FunctionAnalysisInput,
    khorikov: KhorikovTestEvaluation,
    twada: TwadaTestEvaluation
  ): ActionableRecommendation[] {
    const recommendations: ActionableRecommendation[] = [];
    
    if (khorikov.resistanceToRefactoring === 'low') {
      recommendations.push({
        category: 'test-strategy',
        priority: 'immediate',
        description: '実装詳細からの脱却',
        rationale: 'リファクタリング耐性を向上させるため',
        estimatedEffort: 'medium'
      });
    }
    
    if (twada.behaviorFocus === 'low') {
      recommendations.push({
        category: 'test-strategy',
        priority: 'short-term',
        description: '振る舞いベースのテスト記述への変更',
        rationale: 'T-wadaの「テストは仕様書」原則に従うため',
        estimatedEffort: 'high'
      });
    }
    
    // テストが存在しない場合の推奨事項
    if (input.testCoverage.length === 0) {
      recommendations.push({
        category: 'test-strategy',
        priority: 'immediate',
        description: 'テストの基本整備',
        rationale: 'コード品質の基盤確立のため',
        estimatedEffort: 'high'
      });
    }
    
    // 統合テストの推奨事項も含める（デフォルト推奨）
    if (recommendations.length === 0) {
      recommendations.push({
        category: 'test-strategy',
        priority: 'short-term',
        description: 'テスト品質の継続的改善',
        rationale: '長期的な保守性向上のため',
        estimatedEffort: 'medium'
      });
    }
    
    return recommendations;
  }
}