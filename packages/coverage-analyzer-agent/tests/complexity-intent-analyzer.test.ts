import { describe, it, expect, beforeEach } from 'vitest';
import { ComplexityIntentAnalyzer } from '../src/analyzers/complexity-intent-analyzer';
import { FunctionAnalysisInput, ComplexityCategory } from '../src/types/analysis';

describe('ComplexityIntentAnalyzer', () => {
  let analyzer: ComplexityIntentAnalyzer;

  beforeEach(() => {
    analyzer = new ComplexityIntentAnalyzer();
  });

  describe('ビジネスロジック複雑度の推定', () => {
    it('should detect user role-based business logic complexity', async () => {
      // Arrange: ユーザー役割ベースのビジネスロジック
      const input: FunctionAnalysisInput = {
        functionName: 'calculatePricing',
        complexity: 18,
        sourceCode: `
          function calculatePricing(user, product, context) {
            // Enterprise customer pricing logic
            if (user.accountType === 'enterprise') {
              if (user.contractTier === 'platinum') {
                return product.basePrice * 0.6; // 40% enterprise discount
              }
              if (user.contractTier === 'gold') {
                return product.basePrice * 0.7; // 30% enterprise discount
              }
              return product.basePrice * 0.8; // 20% standard enterprise discount
            }
            
            // SMB customer pricing
            if (user.accountType === 'smb') {
              if (context.season === 'holiday' && user.loyaltyYears > 2) {
                return product.basePrice * 0.85; // Holiday loyalty discount
              }
              if (user.subscriptionPlan === 'premium') {
                return product.basePrice * 0.9; // Premium member discount
              }
              return product.basePrice * 0.95; // Small SMB discount
            }
            
            // Individual customer pricing
            if (user.accountType === 'individual') {
              if (user.studentStatus === 'verified') {
                return product.basePrice * 0.75; // Student discount
              }
              if (context.isFirstTimeBuyer) {
                return product.basePrice * 0.9; // First-time buyer discount
              }
            }
            
            return product.basePrice; // Full price
          }
        `,
        testCoverage: [],
        branchCoverage: 65,
        lineCoverage: 70
      };

      // Act: ビジネス意図推定
      const result = await analyzer.analyzeComplexityIntent(input);

      // Assert: ビジネスロジック複雑度として識別
      expect(result.complexityCategory).toBe('business-logic');
      expect(result.businessBackground).toContain('Enterprise、SMB、個人顧客');
      expect(result.businessBackground).toContain('価格戦略');
      expect(result.complexityReason).toContain('顧客セグメント');
      expect(result.complexityReason).toContain('料金体系');
      expect(result.intentionalComplexity).toBe(true); // 意図的な複雑さ
      expect(result.businessValue).toBe('high'); // ビジネス価値高
    });

    it('should identify multi-tenant access control business logic', async () => {
      // Arrange: マルチテナント アクセス制御ロジック
      const input: FunctionAnalysisInput = {
        functionName: 'checkResourceAccess',
        complexity: 22,
        sourceCode: `
          function checkResourceAccess(user, resource, operation) {
            // Tenant isolation check
            if (user.tenantId !== resource.tenantId) {
              throw new AccessDeniedError('Cross-tenant access not allowed');
            }
            
            // Super admin can do anything within tenant
            if (user.role === 'super_admin' && user.tenantId === resource.tenantId) {
              return true;
            }
            
            // Department-level access control
            if (resource.departmentRestricted) {
              if (!user.departments.includes(resource.departmentId)) {
                throw new AccessDeniedError('Department access required');
              }
            }
            
            // Role-based permissions
            const requiredPermissions = getRequiredPermissions(resource.type, operation);
            for (const permission of requiredPermissions) {
              if (!user.permissions.includes(permission)) {
                throw new AccessDeniedError(\`Missing permission: \${permission}\`);
              }
            }
            
            // Project-specific access (for project resources)
            if (resource.type === 'project') {
              const userProjectRoles = user.projectRoles.filter(pr => pr.projectId === resource.id);
              if (userProjectRoles.length === 0) {
                throw new AccessDeniedError('No project access');
              }
              
              const hasOperationAccess = userProjectRoles.some(role => 
                role.permissions.includes(operation)
              );
              if (!hasOperationAccess) {
                throw new AccessDeniedError('Insufficient project permissions');
              }
            }
            
            return true;
          }
        `,
        testCoverage: [],
        branchCoverage: 45,
        lineCoverage: 55
      };

      // Act
      const result = await analyzer.analyzeComplexityIntent(input);

      // Assert: マルチテナント ビジネスロジックとして識別
      expect(result.complexityCategory).toBe('business-logic');
      expect(result.businessBackground).toContain('マルチテナント');
      expect(result.businessBackground).toContain('セキュリティ');
      expect(result.complexityReason).toContain('テナント分離');
      expect(result.complexityReason).toContain('階層的権限');
      expect(result.securityImplications).toBe('critical');
      expect(result.businessValue).toBe('critical');
    });
  });

  describe('技術的制約複雑度の推定', () => {
    it('should detect legacy system compatibility constraints', async () => {
      // Arrange: レガシーシステム互換性制約
      const input: FunctionAnalysisInput = {
        functionName: 'syncCustomerData',
        complexity: 25,
        sourceCode: `
          async function syncCustomerData(modernCustomerData) {
            // Legacy mainframe format conversion
            const legacyFormat = {
              // Fixed-width fields for COBOL system compatibility
              customerId: modernCustomerData.id.toString().padStart(10, '0'),
              customerName: modernCustomerData.fullName.substring(0, 30).padEnd(30, ' '),
              // Date format: YYYYMMDD for legacy system
              registrationDate: modernCustomerData.createdAt.toISOString().slice(0, 10).replace(/-/g, ''),
              // Legacy status codes mapping
              status: mapModernStatusToLegacy(modernCustomerData.status),
            };
            
            // Try modern API first
            try {
              const response = await modernApiClient.updateCustomer(modernCustomerData);
              if (response.success) {
                // Also update legacy system for backward compatibility
                await legacySystemClient.updateCustomer(legacyFormat);
                return response;
              }
            } catch (modernApiError) {
              console.warn('Modern API failed, falling back to legacy', modernApiError);
            }
            
            // Fallback to legacy system only
            try {
              const legacyResponse = await legacySystemClient.updateCustomer(legacyFormat);
              if (legacyResponse.returnCode === '00') {
                // Convert legacy response back to modern format
                return {
                  success: true,
                  customerId: parseInt(legacyResponse.customerId.trim()),
                  message: 'Updated via legacy system'
                };
              } else {
                throw new Error(\`Legacy system error: \${legacyResponse.errorMessage}\`);
              }
            } catch (legacyError) {
              throw new Error(\`Both systems failed: \${legacyError.message}\`);
            }
          }
        `,
        testCoverage: [],
        branchCoverage: 60,
        lineCoverage: 75
      };

      // Act
      const result = await analyzer.analyzeComplexityIntent(input);

      // Assert: 技術的制約複雑度として識別
      expect(result.complexityCategory).toBe('technical-constraints');
      expect(result.technicalConstraints).toContain('レガシーシステム');
      expect(result.technicalConstraints).toContain('COBOL');
      expect(result.technicalConstraints).toContain('固定長フィールド');
      expect(result.complexityReason).toContain('後方互換性');
      expect(result.migrationComplexity).toBe('high');
      expect(result.technicalDebt).toBe('high');
    });

    it('should identify external API integration constraints', async () => {
      // Arrange: 外部API統合制約
      const input: FunctionAnalysisInput = {
        functionName: 'aggregatePaymentProviders',
        complexity: 20,
        sourceCode: `
          async function aggregatePaymentProviders(paymentRequest) {
            const providers = ['stripe', 'paypal', 'square', 'braintree'];
            const results = [];
            
            // Different APIs have different rate limits and response formats
            for (const provider of providers) {
              try {
                let response;
                switch (provider) {
                  case 'stripe':
                    // Stripe uses amount in cents
                    response = await stripeClient.createPaymentIntent({
                      amount: paymentRequest.amount * 100,
                      currency: paymentRequest.currency.toLowerCase(),
                      payment_method_types: ['card']
                    });
                    results.push({
                      provider: 'stripe',
                      fee: response.fees?.stripe_fee || 0,
                      processingTime: response.processing_time,
                      available: true
                    });
                    break;
                    
                  case 'paypal':
                    // PayPal uses string amounts and different currency format
                    response = await paypalClient.createOrder({
                      intent: 'CAPTURE',
                      purchase_units: [{
                        amount: {
                          currency_code: paymentRequest.currency.toUpperCase(),
                          value: paymentRequest.amount.toFixed(2)
                        }
                      }]
                    });
                    results.push({
                      provider: 'paypal',
                      fee: calculatePayPalFee(paymentRequest.amount),
                      processingTime: 'instant',
                      available: response.status === 'CREATED'
                    });
                    break;
                    
                  case 'square':
                    // Square API rate limiting
                    await rateLimiter.waitForSlot('square', 10); // 10 requests per second
                    response = await squareClient.paymentsApi.createPayment({
                      sourceId: 'card-nonce',
                      amountMoney: {
                        amount: paymentRequest.amount * 100, // cents
                        currency: paymentRequest.currency.toUpperCase()
                      }
                    });
                    break;
                }
              } catch (error) {
                // Provider-specific error handling
                if (error.code === 'RATE_LIMIT_EXCEEDED') {
                  await delay(error.retryAfter * 1000);
                  continue; // Retry this provider
                }
                results.push({
                  provider,
                  available: false,
                  error: error.message
                });
              }
            }
            
            return results.sort((a, b) => a.fee - b.fee); // Sort by lowest fee
          }
        `,
        testCoverage: [],
        branchCoverage: 55,
        lineCoverage: 70
      };

      // Act
      const result = await analyzer.analyzeComplexityIntent(input);

      // Assert: API統合制約として識別
      expect(result.complexityCategory).toBe('integration');
      expect(result.technicalConstraints).toContain('外部API');
      expect(result.technicalConstraints).toContain('Rate limiting');
      expect(result.complexityReason).toContain('異なるデータフォーマット');
      expect(result.integrationComplexity).toBe('high');
      expect(result.externalDependencies!.length).toBeGreaterThan(3);
    });
  });

  describe('アルゴリズム複雑度の推定', () => {
    it('should recognize optimized search algorithm complexity', async () => {
      // Arrange: 最適化された検索アルゴリズム
      const input: FunctionAnalysisInput = {
        functionName: 'fuzzySearchWithRanking',
        complexity: 16,
        sourceCode: `
          function fuzzySearchWithRanking(query, documents, options = {}) {
            const { threshold = 0.6, maxResults = 100 } = options;
            
            // Preprocessing: tokenize and normalize query
            const queryTokens = tokenize(query.toLowerCase());
            const queryVector = buildTfIdfVector(queryTokens);
            
            const candidates = [];
            
            // First pass: filter by basic similarity
            for (const doc of documents) {
              const docTokens = tokenize(doc.content.toLowerCase());
              const docVector = buildTfIdfVector(docTokens);
              
              // Cosine similarity calculation
              const similarity = cosineSimilarity(queryVector, docVector);
              
              if (similarity >= threshold) {
                // Second pass: calculate detailed ranking score
                const levenshteinScore = calculateLevenshtein(query, doc.title);
                const popularityBoost = Math.log(doc.views + 1) * 0.1;
                const recencyBoost = doc.publishedAt > Date.now() - 86400000 ? 0.2 : 0; // 24h boost
                
                const finalScore = similarity * 0.7 + 
                                 (1 - levenshteinScore / Math.max(query.length, doc.title.length)) * 0.2 +
                                 popularityBoost * 0.05 +
                                 recencyBoost * 0.05;
                
                candidates.push({
                  document: doc,
                  score: finalScore,
                  similarity,
                  titleMatch: levenshteinScore
                });
              }
            }
            
            // Sort by score and return top results
            return candidates
              .sort((a, b) => b.score - a.score)
              .slice(0, maxResults)
              .map(c => c.document);
          }
        `,
        testCoverage: [],
        branchCoverage: 80,
        lineCoverage: 85
      };

      // Act
      const result = await analyzer.analyzeComplexityIntent(input);

      // Assert: アルゴリズム複雑度として識別
      expect(result.complexityCategory).toBe('algorithmic');
      expect(result.algorithmicPurpose).toContain('検索精度向上');
      expect(result.algorithmicPurpose).toContain('TF-IDF');
      expect(result.algorithmicPurpose).toContain('コサイン類似度');
      expect(result.performanceConsiderations).toContain('計算量');
      expect(result.algorithmicComplexity).toBe('O(n*m)'); // 自動推定
      expect(result.intentionalComplexity).toBe(true);
    });
  });

  describe('歴史的複雑度の推定', () => {
    it('should detect historical bug fix layers', async () => {
      // Arrange: 歴史的バグ修正の積み重ね
      const input: FunctionAnalysisInput = {
        functionName: 'dateTimeParser',
        complexity: 19,
        sourceCode: `
          function dateTimeParser(input) {
            // Original implementation
            if (typeof input === 'string') {
              // Fix for Issue #123: Handle ISO format edge case (2019-03-15)
              if (input.match(/^\\d{4}-\\d{2}-\\d{2}$/)) {
                const parts = input.split('-');
                // Fix for Issue #456: Leap year handling (2020-08-22)
                if (parts[1] === '02' && parts[2] === '29') {
                  const year = parseInt(parts[0]);
                  if (!isLeapYear(year)) {
                    throw new Error('Invalid leap year date');
                  }
                }
                return new Date(input + 'T00:00:00.000Z');
              }
              
              // Fix for Issue #789: Safari date parsing bug (2021-01-10)  
              if (input.includes('/')) {
                // Safari can't parse MM/DD/YYYY format correctly
                const usFormat = input.match(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/);
                if (usFormat) {
                  return new Date(usFormat[3], usFormat[1] - 1, usFormat[2]);
                }
              }
              
              // Fix for Issue #1001: Timezone abbreviation support (2021-06-30)
              if (input.includes('PST') || input.includes('PDT')) {
                // Convert PST/PDT to proper timezone offset
                const cleanInput = input.replace(/PST|PDT/, '');
                const baseDate = new Date(cleanInput);
                const offset = input.includes('PST') ? -8 : -7; // Hours
                baseDate.setHours(baseDate.getHours() - offset);
                return baseDate;
              }
              
              // Fix for Issue #1234: Handle milliseconds precision (2022-03-15)
              if (input.match(/\\.\\d{1,6}$/)) {
                // Truncate microseconds to milliseconds for JS Date compatibility
                const truncated = input.replace(/(\\.)\\d{4,6}$/, '$1' + input.match(/\\.(\\d{3})/)[1]);
                return new Date(truncated);
              }
            }
            
            // Original fallback
            return new Date(input);
          }
        `,
        testCoverage: [],
        branchCoverage: 70,
        lineCoverage: 75
      };

      // Act
      const result = await analyzer.analyzeComplexityIntent(input);

      // Assert: 歴史的複雑度として識別
      expect(result.complexityCategory).toBe('historical-layers');
      expect(result.historicalContext).toContain('Issue #123');
      expect(result.historicalContext).toContain('Safari');
      expect(result.historicalContext).toContain('うるう年');
      expect(result.technicalDebt).toBe('high');
      expect(result.refactoringPriority).toBe('medium');
      expect(result.complexityReason).toContain('過去のバグ修正');
    });
  });

  describe('複雑度カテゴリの統合判定', () => {
    it('should handle mixed complexity categories with primary classification', async () => {
      // Arrange: 複数のカテゴリが混在する複雑な関数
      const input: FunctionAnalysisInput = {
        functionName: 'processUserSubscription',
        complexity: 28,
        sourceCode: `
          async function processUserSubscription(user, subscriptionRequest) {
            // Business logic: different subscription tiers
            if (user.accountType === 'enterprise') {
              // Technical constraint: legacy billing system integration
              const legacyCustomerId = user.id.toString().padStart(12, '0');
              
              // Historical: workaround for billing system bug fixed in 2021
              if (subscriptionRequest.planType === 'premium' && user.region === 'EU') {
                // GDPR compliance workaround
                await gdprComplianceCheck(user);
              }
              
              // Algorithmic: complex pricing calculation
              const discount = calculateEnterpriseDiscount(
                user.contractValue,
                user.loyaltyYears,
                subscriptionRequest.duration
              );
              
              return await legacyBillingSystem.createSubscription({
                customerId: legacyCustomerId,
                planType: subscriptionRequest.planType,
                discountPercentage: discount
              });
            }
            
            // More business logic branches...
            return standardSubscriptionFlow(user, subscriptionRequest);
          }
        `,
        testCoverage: [],
        branchCoverage: 55,
        lineCoverage: 60
      };

      // Act
      const result = await analyzer.analyzeComplexityIntent(input);

      // Assert: 主要カテゴリとサブカテゴリの識別
      expect(result.complexityCategory).toBe('business-logic'); // 主要カテゴリ
      expect(result.secondaryCategories).toContain('technical-constraints');
      expect(result.secondaryCategories).toContain('historical-layers');
      expect(result.mixedComplexityReason).toContain('複数要因');
      expect(result.businessValue).toBe('high');
      expect(result.technicalDebt).toBe('high');
    });
  });
});