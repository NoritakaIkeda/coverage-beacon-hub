import { describe, it, expect, beforeEach } from 'vitest';
import { TestPhilosophyEvaluator } from '../src/analyzers/test-philosophy-evaluator';
import { KhorikovTestEvaluation, TwadaTestEvaluation, FunctionAnalysisInput } from '../src/types/analysis';

describe('TestPhilosophyEvaluator', () => {
  let evaluator: TestPhilosophyEvaluator;

  beforeEach(() => {
    evaluator = new TestPhilosophyEvaluator();
  });

  describe('Vladimir Khorikov 4つの柱評価', () => {
    it('should evaluate high-quality unit test with all four pillars', async () => {
      // Arrange: Khorikovの理想的なユニットテスト
      const input: FunctionAnalysisInput = {
        functionName: 'calculateTax',
        complexity: 6,
        sourceCode: `
          function calculateTax(income, deductions) {
            const taxableIncome = Math.max(0, income - deductions);
            if (taxableIncome <= 50000) return taxableIncome * 0.1;
            if (taxableIncome <= 100000) return 5000 + (taxableIncome - 50000) * 0.2;
            return 15000 + (taxableIncome - 100000) * 0.3;
          }
        `,
        testCoverage: [
          {
            testFile: 'tax-calculator.test.js',
            testCase: 'should calculate 10% tax for income under 50k',
            coverageType: 'unit',
            coveredLines: [2, 3]
          },
          {
            testFile: 'tax-calculator.test.js',
            testCase: 'should calculate progressive tax for middle income',
            coverageType: 'unit',
            coveredLines: [2, 4]
          },
          {
            testFile: 'tax-calculator.test.js',
            testCase: 'should calculate highest tax rate for high income',
            coverageType: 'unit',
            coveredLines: [2, 5]
          },
          {
            testFile: 'tax-calculator.test.js',
            testCase: 'should handle zero taxable income when deductions exceed income',
            coverageType: 'unit',
            coveredLines: [2, 3]
          }
        ],
        branchCoverage: 100,
        lineCoverage: 100
      };

      // Act: Khorikov評価実行
      const result = await evaluator.evaluateKhorikovPrinciples(input);

      // Assert: 4つの柱すべてで高評価
      expect(result.protectionAgainstRegressions).toBe('high'); // 回帰バグ保護
      expect(result.resistanceToRefactoring).toBe('high');      // リファクタリング耐性
      expect(result.fastFeedback).toBe('high');                 // 高速フィードバック
      expect(result.maintainability).toBe('high');              // 保守性
      expect(result.testType).toBe('unit');
      expect(result.mockUsage).toBe('appropriate');
      expect(result.overallScore).toBe('high');
    });

    it('should detect excessive mocking as anti-pattern', async () => {
      // Arrange: 過剰なMockを使った実装詳細結合テスト
      const input: FunctionAnalysisInput = {
        functionName: 'processOrder',
        complexity: 10,
        sourceCode: `
          function processOrder(order) {
            const validator = new OrderValidator();
            const calculator = new PriceCalculator(); 
            const inventory = new InventoryService();
            const payment = new PaymentService();
            
            if (!validator.validate(order)) throw new Error('Invalid order');
            const price = calculator.calculate(order.items);
            inventory.reserve(order.items);
            return payment.charge(order.customerId, price);
          }
        `,
        testCoverage: [
          {
            testFile: 'order-processor.test.js',
            testCase: 'should call OrderValidator.validate with correct params',
            coverageType: 'unit',
            coveredLines: [6]
          },
          {
            testFile: 'order-processor.test.js',
            testCase: 'should call PriceCalculator.calculate with order items',
            coverageType: 'unit',
            coveredLines: [7]
          },
          {
            testFile: 'order-processor.test.js',
            testCase: 'should call InventoryService.reserve',
            coverageType: 'unit',
            coveredLines: [8]
          },
          {
            testFile: 'order-processor.test.js',
            testCase: 'should call PaymentService.charge with calculated price',
            coverageType: 'unit',
            coveredLines: [9]
          }
        ],
        branchCoverage: 85,
        lineCoverage: 90
      };

      // Act
      const result = await evaluator.evaluateKhorikovPrinciples(input);

      // Assert: リファクタリング耐性で低評価、Mock過剰使用検出
      expect(result.protectionAgainstRegressions).toBe('medium');
      expect(result.resistanceToRefactoring).toBe('low'); // 実装詳細結合
      expect(result.fastFeedback).toBe('high');
      expect(result.maintainability).toBe('low');         // Mock依存で保守困難 
      expect(result.mockUsage).toBe('excessive');
      expect(result.overallScore).toBe('low');
    });

    it('should evaluate integration test appropriately', async () => {
      // Arrange: 適切な統合テスト
      const input: FunctionAnalysisInput = {
        functionName: 'authenticateUser',
        complexity: 12,
        sourceCode: `
          async function authenticateUser(credentials) {
            const user = await userRepository.findByEmail(credentials.email);
            if (!user) throw new AuthenticationError('User not found');
            
            const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
            if (!isValidPassword) throw new AuthenticationError('Invalid password');
            
            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            await sessionRepository.create({ userId: user.id, token });
            return { user: { id: user.id, email: user.email }, token };
          }
        `,
        testCoverage: [
          {
            testFile: 'auth.integration.test.js',
            testCase: 'should authenticate valid user and return token',
            coverageType: 'integration',
            coveredLines: [1, 2, 4, 5, 7, 8, 9]
          },
          {
            testFile: 'auth.integration.test.js',
            testCase: 'should throw error for non-existent user',
            coverageType: 'integration',
            coveredLines: [1, 2, 3]
          },
          {
            testFile: 'auth.integration.test.js',
            testCase: 'should throw error for invalid password',
            coverageType: 'integration',
            coveredLines: [1, 2, 4, 5, 6]
          }
        ],
        branchCoverage: 100,
        lineCoverage: 95
      };

      // Act
      const result = await evaluator.evaluateKhorikovPrinciples(input);

      // Assert: 統合テストとして適切な評価
      expect(result.protectionAgainstRegressions).toBe('high');
      expect(result.resistanceToRefactoring).toBe('high');
      expect(result.fastFeedback).toBe('medium');         // 統合テストは若干遅い
      expect(result.maintainability).toBe('medium');       // 統合テストは保守コスト高
      expect(result.testType).toBe('integration');
      expect(result.mockUsage).toBe('appropriate');
      expect(result.overallScore).toBe('high');
    });
  });

  describe('T-wada テスト哲学評価', () => {
    it('should recognize behavior-focused test as high-quality specification', async () => {
      // Arrange: T-wada流の振る舞い重視テスト
      const input: FunctionAnalysisInput = {
        functionName: 'withdrawMoney',
        complexity: 8,
        sourceCode: `
          function withdrawMoney(account, amount) {
            if (amount <= 0) throw new Error('Amount must be positive');
            if (account.balance < amount) throw new Error('Insufficient funds');
            if (account.status !== 'active') throw new Error('Account not active');
            
            account.balance -= amount;
            account.transactionHistory.push({
              type: 'withdrawal',
              amount,
              timestamp: new Date(),
              balance: account.balance
            });
            return account.balance;
          }
        `,
        testCoverage: [
          {
            testFile: 'account.test.js',
            testCase: 'Given active account with sufficient funds, When withdrawing valid amount, Then balance should decrease and transaction recorded',
            coverageType: 'unit',
            coveredLines: [5, 6, 7, 8, 9, 10, 11, 12]
          },
          {
            testFile: 'account.test.js',
            testCase: 'Given active account, When withdrawing zero or negative amount, Then should reject with validation error',
            coverageType: 'unit',
            coveredLines: [2]
          },
          {
            testFile: 'account.test.js',
            testCase: 'Given active account with insufficient funds, When withdrawing more than balance, Then should reject with insufficient funds error',
            coverageType: 'unit',
            coveredLines: [3]
          },
          {
            testFile: 'account.test.js',
            testCase: 'Given inactive account, When attempting withdrawal, Then should reject with account status error',
            coverageType: 'unit',
            coveredLines: [4]
          }
        ],
        branchCoverage: 100,
        lineCoverage: 100
      };

      // Act: T-wada評価実行
      const result = await evaluator.evaluateTwadaPhilosophy(input);

      // Assert: 仕様書品質として高評価
      expect(result.specificationClarity).toBe('high');    // 仕様の明確さ
      expect(result.behaviorFocus).toBe('high');           // 振る舞い重視
      expect(result.testStructureClarity).toBe('high');    // Given-When-Then構造
      expect(result.testNameExpressiveness).toBe('high');  // テスト名の表現力
      expect(result.edgeCaseCoverage).toBe('high');        // 境界値・異常系網羅
      expect(result.overallScore).toBe('high');
    });

    it('should detect poor test naming and structure', async () => {
      // Arrange: 不適切なテスト名・構造
      const input: FunctionAnalysisInput = {
        functionName: 'divide',
        complexity: 4,
        sourceCode: `
          function divide(a, b) {
            if (b === 0) throw new Error('Division by zero');
            return a / b;
          }
        `,
        testCoverage: [
          {
            testFile: 'math.test.js',
            testCase: 'test1',  // 意味不明なテスト名
            coverageType: 'unit',
            coveredLines: [3]
          },
          {
            testFile: 'math.test.js',
            testCase: 'divide_test',  // 実装詳細に着目した名前
            coverageType: 'unit',
            coveredLines: [2]
          }
        ],
        branchCoverage: 75,  // ゼロ除算以外のエッジケース不足
        lineCoverage: 85
      };

      // Act
      const result = await evaluator.evaluateTwadaPhilosophy(input);

      // Assert: 仕様書品質として低評価
      expect(result.specificationClarity).toBe('low');     // 仕様不明確
      expect(result.behaviorFocus).toBe('low');            // 振る舞い記述不足
      expect(result.testStructureClarity).toBe('low');     // 構造不明確
      expect(result.testNameExpressiveness).toBe('low');   // テスト名が無意味
      expect(result.edgeCaseCoverage).toBe('medium');      // エッジケース不足
      expect(result.overallScore).toBe('low');
    });

    it('should evaluate boundary and edge case coverage', async () => {
      // Arrange: 境界値テストの網羅性評価
      const input: FunctionAnalysisInput = {
        functionName: 'validateAge',
        complexity: 6,
        sourceCode: `
          function validateAge(age) {
            if (typeof age !== 'number') throw new Error('Age must be a number');
            if (age < 0) throw new Error('Age cannot be negative');
            if (age > 150) throw new Error('Age seems unrealistic');
            if (age < 18) return { isValid: false, reason: 'Under minimum age' };
            return { isValid: true };
          }
        `,
        testCoverage: [
          {
            testFile: 'validation.test.js',
            testCase: 'Given valid adult age (25), When validating, Then should return valid result',
            coverageType: 'unit',
            coveredLines: [2, 3, 4, 5, 6]
          },
          {
            testFile: 'validation.test.js',
            testCase: 'Given boundary age (18), When validating, Then should return valid result',
            coverageType: 'unit',
            coveredLines: [2, 3, 4, 5, 6]
          },
          {
            testFile: 'validation.test.js',
            testCase: 'Given just under minimum (17), When validating, Then should return invalid with reason',
            coverageType: 'unit',
            coveredLines: [2, 3, 4, 5]
          },
          {
            testFile: 'validation.test.js',
            testCase: 'Given negative age (-1), When validating, Then should throw negative error',
            coverageType: 'unit',
            coveredLines: [2, 3]
          },
          {
            testFile: 'validation.test.js',
            testCase: 'Given unrealistic age (200), When validating, Then should throw unrealistic error',
            coverageType: 'unit',
            coveredLines: [2, 3, 4]
          },
          {
            testFile: 'validation.test.js',
            testCase: 'Given non-number input ("25"), When validating, Then should throw type error',
            coverageType: 'unit',
            coveredLines: [2]
          }
        ],
        branchCoverage: 100,
        lineCoverage: 100
      };

      // Act
      const result = await evaluator.evaluateTwadaPhilosophy(input);

      // Assert: 境界値・異常系の高い網羅性
      expect(result.edgeCaseCoverage).toBe('high');        // 境界値網羅
      expect(result.specificationClarity).toBe('high');   // 仕様明確
      expect(result.behaviorFocus).toBe('high');          // 振る舞い重視
      expect(result.testStructureClarity).toBe('high');   // Given-When-Then構造
      expect(result.overallScore).toBe('high');
    });
  });

  describe('統合評価', () => {
    it('should provide comprehensive evaluation combining both philosophies', async () => {
      // Arrange: 両哲学の視点で評価すべき関数
      const input: FunctionAnalysisInput = {
        functionName: 'processPayment',
        complexity: 14,
        sourceCode: `// Complex payment processing logic with multiple validation steps`,
        testCoverage: [
          {
            testFile: 'payment.test.js',
            testCase: 'Given valid payment request, When processing, Then should complete successfully and return transaction ID',
            coverageType: 'integration',
            coveredLines: [1, 2, 3, 4, 5]
          }
        ],
        branchCoverage: 85,
        lineCoverage: 90
      };

      // Act: 統合評価実行
      const comprehensiveResult = await evaluator.evaluateComprehensively(input);

      // Assert: 両哲学の評価が含まれること
      expect(comprehensiveResult.khorikovEvaluation).toBeDefined();
      expect(comprehensiveResult.twadaEvaluation).toBeDefined();
      expect(comprehensiveResult.comprehensiveSummary).toContain('Vladimir Khorikov');
      expect(comprehensiveResult.comprehensiveSummary).toContain('T-wada');
      expect(comprehensiveResult.actionableRecommendations.length).toBeGreaterThan(0);
      
      // 改善提案の実用性確認
      const recommendations = comprehensiveResult.actionableRecommendations;
      expect(recommendations.some(r => r.category === 'test-strategy')).toBe(true);
      expect(recommendations.every(r => r.priority && r.description && r.rationale)).toBe(true);
    });
  });
});