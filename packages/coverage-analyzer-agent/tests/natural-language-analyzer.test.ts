import { describe, it, expect, beforeEach } from 'vitest';
import { NaturalLanguageAnalyzer } from '../src/analyzers/natural-language-analyzer';
import { FunctionAnalysisInput, NaturalAnalysisResult } from '../src/types/analysis';

describe('NaturalLanguageAnalyzer', () => {
  let analyzer: NaturalLanguageAnalyzer;

  beforeEach(() => {
    analyzer = new NaturalLanguageAnalyzer();
  });

  describe('analyzeComplexity', () => {
    it('should identify business logic complexity as the primary reason for high complexity', async () => {
      // Arrange: 高複雑度関数（ビジネスロジック起因）
      const input: FunctionAnalysisInput = {
        functionName: 'validateUserPermissions',
        complexity: 15,
        sourceCode: `
          function validateUserPermissions(user, resource, action) {
            // B2B/B2Cユーザーの権限チェック
            if (user.type === 'b2b') {
              if (user.role === 'admin') return true;
              if (resource.organizationId !== user.organizationId) return false;
            } else if (user.type === 'b2c') {
              if (user.subscription === 'premium') return checkPremiumAccess(resource, action);
              if (user.subscription === 'basic') return checkBasicAccess(resource, action);
            }
            return false;
          }
        `,
        testCoverage: [],
        branchCoverage: 60,
        lineCoverage: 75
      };

      // Act: 自然言語解析を実行
      const result = await analyzer.analyzeComplexity(input);

      // Assert: ビジネス要件起因の複雑さと識別されること
      expect(result.complexityCategory).toBe('business-logic');
      expect(result.complexityReason).toContain('B2B/B2Cユーザーの権限体系');
      expect(result.complexityReason).toContain('多分岐になる理由');
      expect(result.businessBackground).toBeDefined();
      expect(result.riskLevel).toBe('medium'); // 高複雑だがテスト可能な範囲
    });

    it('should identify technical constraint complexity for external API dependencies', async () => {
      // Arrange: 技術的制約起因の複雑度
      const input: FunctionAnalysisInput = {
        functionName: 'syncWithExternalAPI',
        complexity: 18,
        sourceCode: `
          async function syncWithExternalAPI(data) {
            // 外部API互換性のための複雑な変換処理
            try {
              const transformed = await legacyApiTransform(data);
              const response = await apiClient.post('/legacy/endpoint', transformed);
              if (response.status === 429) {
                // Rate limiting対応
                await delay(response.headers['retry-after'] * 1000);
                return syncWithExternalAPI(data);
              }
              return normalizeResponse(response.data);
            } catch (error) {
              if (error.code === 'LEGACY_FORMAT_ERROR') {
                return fallbackToOldFormat(data);
              }
              throw error;
            }
          }
        `,
        testCoverage: [{
          testFile: 'api.test.js',
          testCase: 'should handle rate limiting',
          coverageType: 'integration',
          coveredLines: [1, 2, 5, 6, 7]
        }],
        branchCoverage: 45,
        lineCoverage: 82
      };

      // Act
      const result = await analyzer.analyzeComplexity(input);

      // Assert: 技術的制約起因と識別されること
      expect(result.complexityCategory).toBe('technical-constraints');
      expect(result.complexityReason).toContain('外部API');
      expect(result.complexityReason).toContain('既存資産との互換性');
      expect(result.technicalConstraints).toBeDefined();
      expect(result.riskLevel).toBe('high'); // 外部依存は高リスク
    });
  });

  describe('evaluateTestStrategy', () => {
    it('should recognize behavior-driven tests following t-wada philosophy', async () => {
      // Arrange: 振る舞いベースのテスト設計（t-wada流）
      const input: FunctionAnalysisInput = {
        functionName: 'calculateDiscountPrice',
        complexity: 8,
        sourceCode: `
          function calculateDiscountPrice(originalPrice, userType, discountCode) {
            if (userType === 'premium') {
              return originalPrice * 0.8; // 20% discount
            }
            if (discountCode && isValidDiscountCode(discountCode)) {
              return originalPrice * 0.9; // 10% discount
            }
            return originalPrice;
          }
        `,
        testCoverage: [
          {
            testFile: 'pricing.test.js',
            testCase: 'should apply premium discount for premium users',
            coverageType: 'unit',
            coveredLines: [2, 3]
          },
          {
            testFile: 'pricing.test.js', 
            testCase: 'should apply discount code when valid code provided',
            coverageType: 'unit',
            coveredLines: [5, 6]
          },
          {
            testFile: 'pricing.test.js',
            testCase: 'should return original price when no discounts apply',
            coverageType: 'unit',
            coveredLines: [8]
          }
        ],
        branchCoverage: 100,
        lineCoverage: 100
      };

      // Act: テスト戦略評価
      const result = await analyzer.evaluateTestStrategy(input);

      // Assert: 振る舞い駆動テストと評価されること
      expect(result.testPhilosophy).toBe('behavior-driven');
      expect(result.testStrategy).toContain('振る舞いベースで記述');
      expect(result.testStrategy).toContain('正常系と境界値');
      expect(result.strategicEvaluation).toContain('仕様を表す記述');
      expect(result.testQuality).toBe('high');
    });

    it('should detect implementation-detail coupling anti-pattern', async () => {
      // Arrange: 実装詳細に結合したテスト（アンチパターン）
      const input: FunctionAnalysisInput = {
        functionName: 'processUserRegistration',
        complexity: 12,
        sourceCode: `
          function processUserRegistration(userData) {
            const validator = new UserValidator();
            const hasher = new PasswordHasher();
            const mailer = new EmailService();
            
            if (!validator.validateEmail(userData.email)) {
              throw new ValidationError('Invalid email');
            }
            const hashedPassword = hasher.hash(userData.password);
            const user = { ...userData, password: hashedPassword };
            mailer.sendWelcomeEmail(user.email);
            return user;
          }
        `,
        testCoverage: [
          {
            testFile: 'registration.test.js',
            testCase: 'should call UserValidator.validateEmail',
            coverageType: 'unit',
            coveredLines: [2, 6]
          },
          {
            testFile: 'registration.test.js',
            testCase: 'should call PasswordHasher.hash',
            coverageType: 'unit', 
            coveredLines: [3, 8]
          },
          {
            testFile: 'registration.test.js',
            testCase: 'should call EmailService.sendWelcomeEmail',
            coverageType: 'unit',
            coveredLines: [4, 10]
          }
        ],
        branchCoverage: 70,
        lineCoverage: 85
      };

      // Act
      const result = await analyzer.evaluateTestStrategy(input);

      // Assert: 実装詳細結合を検出すること
      expect(result.testPhilosophy).toBe('implementation-coupled');
      expect(result.testSmells).toContain('過剰なMock');
      expect(result.testSmells).toContain('内部構造依存');
      expect(result.strategicEvaluation).toContain('実装詳細に引っ張られ');
      expect(result.testQuality).toBe('low');
      expect(result.recommendations).toContain('振る舞いベース');
    });
  });

  describe('generateStrategicAssessment', () => {
    it('should provide comprehensive risk assessment for high-complexity untested function', async () => {
      // Arrange: 高複雑度・未テスト関数
      const input: FunctionAnalysisInput = {
        functionName: 'reconcileChildren',
        complexity: 28,
        sourceCode: `// React internal reconciliation logic`,
        testCoverage: [],
        branchCoverage: 0,
        lineCoverage: 0
      };

      // Act: 戦略的評価生成
      const result = await analyzer.generateStrategicAssessment(input);

      // Assert: 高リスク評価と改善提案
      expect(result.riskLevel).toBe('critical');
      expect(result.riskAssessment).toContain('【高リスク】');
      expect(result.riskAssessment).toContain('テスト不足');
      expect(result.strategicEvaluation).toContain('最優先でテスト整備');
      expect(result.recommendations).toContain('段階的リファクタリング');
      expect(result.changeResilience).toBe('fragile');
    });

    it('should recognize well-tested high-complexity function as strategically sound', async () => {
      // Arrange: 高複雑度だが十分テストされた関数
      const input: FunctionAnalysisInput = {
        functionName: 'useState',
        complexity: 15,
        sourceCode: `// React useState hook implementation`,
        testCoverage: [
          {
            testFile: 'hooks.test.js',
            testCase: 'should update state correctly',
            coverageType: 'unit',
            coveredLines: [1, 2, 3]
          },
          {
            testFile: 'hooks.test.js',
            testCase: 'should handle batch updates',
            coverageType: 'integration',
            coveredLines: [4, 5, 6]
          }
        ],
        branchCoverage: 95,
        lineCoverage: 92
      };

      // Act
      const result = await analyzer.generateStrategicAssessment(input);

      // Assert: 戦略的に健全と評価
      expect(result.riskLevel).toBe('low');
      expect(result.riskAssessment).toContain('十分にテストされており');
      expect(result.strategicEvaluation).toContain('適切に保証されている');
      expect(result.changeResilience).toBe('resilient');
    });
  });
});