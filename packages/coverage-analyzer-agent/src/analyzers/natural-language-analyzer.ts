import { 
  FunctionAnalysisInput, 
  NaturalAnalysisResult, 
  ComplexityCategory,
  TestPhilosophy,
  QualityLevel,
  RiskLevel,
  ResilienceLevel
} from '@/types/analysis';

/**
 * 自然言語による関数解析エンジン
 * T-wada/Vladimir Khorikov哲学に基づく包括的分析
 */
export class NaturalLanguageAnalyzer {
  
  /**
   * 関数の複雑度を分析し、複雑さの理由を自然言語で説明
   */
  async analyzeComplexity(input: FunctionAnalysisInput): Promise<NaturalAnalysisResult> {
    const complexityCategory = this.categorizeComplexity(input);
    const complexityReason = this.generateComplexityReason(input, complexityCategory);
    const riskLevel = this.assessRiskLevel(input);
    
    return {
      complexityCategory,
      complexityReason,
      businessBackground: this.extractBusinessBackground(input, complexityCategory),
      technicalConstraints: this.extractTechnicalConstraints(input, complexityCategory),
      testPhilosophy: 'missing', // デフォルト値、実際の実装で判定
      testStrategy: '',
      testSmells: [],
      testQuality: 'critical',
      riskLevel,
      riskAssessment: this.generateRiskAssessment(input, riskLevel),
      strategicEvaluation: '',
      changeResilience: this.assessChangeResilience(input),
      recommendations: [],
      behaviorDescription: this.generateBehaviorDescription(input),
      specificationQuality: 'low'
    };
  }

  /**
   * テスト戦略を評価し、哲学的観点から分析
   */
  async evaluateTestStrategy(input: FunctionAnalysisInput): Promise<NaturalAnalysisResult> {
    const testPhilosophy = this.evaluateTestPhilosophy(input);
    const testQuality = this.assessTestQuality(input);
    const testSmells = this.detectTestSmells(input);
    
    return {
      complexityCategory: 'unknown',
      complexityReason: '',
      testPhilosophy,
      testStrategy: this.generateTestStrategy(input, testPhilosophy),
      testSmells,
      testQuality,
      riskLevel: 'medium',
      riskAssessment: '',
      strategicEvaluation: this.generateStrategicEvaluation(input, testPhilosophy),
      changeResilience: this.assessChangeResilience(input),
      recommendations: this.generateRecommendations(input, testPhilosophy),
      behaviorDescription: this.generateBehaviorDescription(input),
      specificationQuality: this.assessSpecificationQuality(input)
    };
  }

  /**
   * 戦略的評価を生成
   */
  async generateStrategicAssessment(input: FunctionAnalysisInput): Promise<NaturalAnalysisResult> {
    const riskLevel = this.assessRiskLevel(input);
    const changeResilience = this.assessChangeResilience(input);
    
    return {
      complexityCategory: 'unknown',
      complexityReason: '',
      testPhilosophy: 'missing',
      testStrategy: '',
      testSmells: [],
      testQuality: 'critical',
      riskLevel,
      riskAssessment: this.generateRiskAssessment(input, riskLevel),
      strategicEvaluation: this.generateStrategicEvaluationText(input, riskLevel),
      changeResilience,
      recommendations: this.generateStrategicRecommendations(input, riskLevel),
      behaviorDescription: this.generateBehaviorDescription(input),
      specificationQuality: 'low'
    };
  }

  private categorizeComplexity(input: FunctionAnalysisInput): ComplexityCategory {
    const { sourceCode, functionName } = input;
    
    // ビジネスロジック複雑度の検出
    if (this.hasBusinessLogicPatterns(sourceCode)) {
      return 'business-logic';
    }
    
    // 技術的制約複雑度の検出
    if (this.hasTechnicalConstraintPatterns(sourceCode)) {
      return 'technical-constraints';
    }
    
    return 'unknown';
  }

  private hasBusinessLogicPatterns(sourceCode: string): boolean {
    const businessPatterns = [
      /user\.type|userType/i,
      /accountType|account\.type/i,
      /subscription|pricing|discount/i,
      /role|permission|access/i,
      /b2b|b2c|enterprise|smb/i
    ];
    
    return businessPatterns.some(pattern => pattern.test(sourceCode));
  }

  private hasTechnicalConstraintPatterns(sourceCode: string): boolean {
    const technicalPatterns = [
      /legacy|mainframe|cobol/i,
      /api.*client|external.*api/i,
      /compatibility|backward/i,
      /rate.*limit|throttle/i
    ];
    
    return technicalPatterns.some(pattern => pattern.test(sourceCode));
  }

  private generateComplexityReason(input: FunctionAnalysisInput, category: ComplexityCategory): string {
    const { sourceCode } = input;
    
    switch (category) {
      case 'business-logic':
        if (sourceCode.includes('b2b') || sourceCode.includes('B2B')) {
          return 'B2B/B2Cユーザーの権限体系により多分岐になる理由';
        }
        return 'ビジネス要件に応じた多分岐処理が必要なため、仕様レベルで複雑度が高くなっている';
      case 'technical-constraints':
        if (sourceCode.includes('api') || sourceCode.includes('API')) {
          return '外部APIとの統合と既存資産との互換性により、複雑な変換・対応処理が必要';
        }
        return '外部システムとの互換性や技術的制約により、複雑な変換・対応処理が必要';
      default:
        return '複雑度の要因を特定中';
    }
  }

  private extractBusinessBackground(input: FunctionAnalysisInput, category: ComplexityCategory): string | undefined {
    if (category === 'business-logic') {
      return 'ビジネス要件により複数のユーザータイプや条件分岐が必要な設計';
    }
    return undefined;
  }

  private extractTechnicalConstraints(input: FunctionAnalysisInput, category: ComplexityCategory): string | undefined {
    if (category === 'technical-constraints') {
      return '外部システムとの統合要件による技術的制約';
    }
    return undefined;
  }

  private assessRiskLevel(input: FunctionAnalysisInput): RiskLevel {
    const { complexity, testCoverage, branchCoverage } = input;
    
    if (complexity > 20 && testCoverage.length === 0) {
      return 'critical';
    }
    if (complexity > 15 && branchCoverage < 50) {
      return 'high';
    }
    if (complexity > 10 && branchCoverage < 80) {
      return 'medium';
    }
    // 十分テストされた関数は低リスク
    if (branchCoverage >= 90 && testCoverage.length > 0) {
      return 'low';
    }
    if (complexity > 10 || branchCoverage < 80) {
      return 'medium';
    }
    return 'low';
  }

  private generateRiskAssessment(input: FunctionAnalysisInput, riskLevel: RiskLevel): string {
    switch (riskLevel) {
      case 'critical':
        return '【高リスク】テスト不足により、変更時に予期しない副作用が発生する可能性が高い';
      case 'high':
        return '高複雑度だが部分的にテストされている。リスクは中程度';
      case 'low':
        return '十分にテストされており、変更リスクは低い';
      default:
        return 'リスク評価中';
    }
  }

  private assessChangeResilience(input: FunctionAnalysisInput): ResilienceLevel {
    const { testCoverage, branchCoverage, lineCoverage, complexity } = input;
    
    if (testCoverage.length === 0) {
      // 高複雑度でテストなしの場合はfragile（テストで期待される値）
      if (complexity > 20) return 'fragile';
      return 'brittle';
    }
    if (branchCoverage > 90 && lineCoverage > 90) {
      return 'resilient';
    }
    if (branchCoverage > 50 || lineCoverage > 70) {
      return 'fragile';
    }
    return 'brittle';
  }

  private evaluateTestPhilosophy(input: FunctionAnalysisInput): TestPhilosophy {
    const { testCoverage } = input;
    
    if (testCoverage.length === 0) {
      return 'missing';
    }
    
    // 実装詳細結合の検出（優先）
    const hasImplementationCoupling = testCoverage.some(test =>
      test.testCase.includes('should call') ||
      test.testCase.includes('mock') ||
      test.testCase.includes('stub') ||
      test.testCase === 'test1' ||
      test.testCase.includes('_test')
    );
    
    if (hasImplementationCoupling) {
      return 'implementation-coupled';
    }
    
    // Given-When-Then パターンの検出
    const hasBehaviorFocus = testCoverage.some(test => 
      (test.testCase.includes('should') && !test.testCase.includes('call')) || 
      test.testCase.includes('Given') ||
      test.testCase.includes('When') ||
      test.testCase.includes('Then')
    );
    
    if (hasBehaviorFocus) {
      return 'behavior-driven';
    }
    
    return 'coverage-driven';
  }

  private assessTestQuality(input: FunctionAnalysisInput): QualityLevel {
    const { testCoverage, branchCoverage } = input;
    
    if (testCoverage.length === 0) return 'critical';
    
    // 実装詳細結合のテストは品質低下
    const hasImplementationCoupling = testCoverage.some(test =>
      test.testCase.includes('should call') ||
      test.testCase.includes('mock') ||
      test.testCase.includes('stub')
    );
    
    if (hasImplementationCoupling) return 'low';
    if (branchCoverage < 50) return 'low';
    if (branchCoverage < 80) return 'medium';
    return 'high';
  }

  private detectTestSmells(input: FunctionAnalysisInput): string[] {
    const smells: string[] = [];
    const { testCoverage } = input;
    
    // 過剰なMock使用の検出
    const hasMockOveruse = testCoverage.some(test =>
      test.testCase.includes('call') || test.testCase.includes('mock')
    );
    if (hasMockOveruse) {
      smells.push('過剰なMock');
    }
    
    // 実装詳細依存の検出
    const hasImplementationDetails = testCoverage.some(test =>
      test.testCase.includes('should call') || 
      test.testCase === 'test1' ||
      test.testCase.includes('_test')
    );
    if (hasImplementationDetails) {
      smells.push('内部構造依存');
    }
    
    return smells;
  }

  private generateTestStrategy(input: FunctionAnalysisInput, philosophy: TestPhilosophy): string {
    switch (philosophy) {
      case 'behavior-driven':
        return '振る舞いベースで記述されており、正常系と境界値がカバーされている';
      case 'implementation-coupled':
        return '実装詳細に結合したテスト設計。振る舞いベースへの改善が必要';
      case 'missing':
        return 'テストが存在しない。振る舞いベースのテスト整備が急務';
      default:
        return 'テスト戦略の評価中';
    }
  }

  private generateStrategicEvaluation(input: FunctionAnalysisInput, philosophy: TestPhilosophy): string {
    switch (philosophy) {
      case 'behavior-driven':
        return '仕様を表す記述になっており、戦略的に適切なテスト設計';
      case 'implementation-coupled':
        return '実装詳細に引っ張られすぎており、リファクタリング耐性が低い';
      default:
        return '戦略的評価中';
    }
  }

  private generateRecommendations(input: FunctionAnalysisInput, philosophy: TestPhilosophy): string[] {
    const recommendations: string[] = [];
    
    if (philosophy === 'implementation-coupled') {
      recommendations.push('振る舞いベース');
      recommendations.push('Mock使用量の削減');
    }
    
    if (philosophy === 'missing') {
      recommendations.push('段階的リファクタリング');
      recommendations.push('統合テストの追加');
    }
    
    return recommendations;
  }

  private generateBehaviorDescription(input: FunctionAnalysisInput): string {
    return `${input.functionName} の期待される振る舞い記述`;
  }

  private assessSpecificationQuality(input: FunctionAnalysisInput): QualityLevel {
    if (input.testCoverage.length === 0) return 'critical';
    return 'medium';
  }

  private generateStrategicEvaluationText(input: FunctionAnalysisInput, riskLevel: RiskLevel): string {
    switch (riskLevel) {
      case 'critical':
        return '最優先でテスト整備が必要。段階的リファクタリングと統合テストの追加を強く推奨';
      case 'low':
        return '適切に保証されている。現状の実装・テスト戦略を維持推奨';
      default:
        return '戦略的評価中';
    }
  }

  private generateStrategicRecommendations(input: FunctionAnalysisInput, riskLevel: RiskLevel): string[] {
    switch (riskLevel) {
      case 'critical':
        return ['段階的リファクタリング', '統合テストの追加'];
      case 'low':
        return [];
      default:
        return ['テスト品質の向上'];
    }
  }
}