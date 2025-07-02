
import { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle, FileText, Search, Filter, TrendingDown, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunctionData } from "@/types/repository";
import NaturalAnalysis from "./NaturalAnalysis";

interface CodeAnalysisProps {
  functions: FunctionData[];
}

const CodeAnalysis = ({ functions }: CodeAnalysisProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [complexityThreshold, setComplexityThreshold] = useState(10);
  const [sortBy, setSortBy] = useState<"complexity" | "coverage" | "risk">("complexity");
  const [filterBy, setFilterBy] = useState<"all" | "high-risk" | "untested" | "complex">("all");

  const filteredAndSortedFunctions = useMemo(() => {
    let filtered = functions.filter((func) => {
      const matchesSearch = func.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesComplexity = func.complexity >= complexityThreshold;
      
      switch (filterBy) {
        case "high-risk":
          return matchesSearch && func.riskLevel === 'high';
        case "untested":
          return matchesSearch && !func.isTested;
        case "complex":
          return matchesSearch && matchesComplexity;
        default:
          return matchesSearch;
      }
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "complexity":
          return b.complexity - a.complexity;
        case "coverage":
          return a.coverage - b.coverage;
        case "risk":
          const riskOrder = { high: 3, medium: 2, low: 1 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        default:
          return 0;
      }
    });
  }, [functions, searchTerm, complexityThreshold, filterBy, sortBy]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getComplexityIcon = (complexity: number) => {
    if (complexity >= 20) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (complexity >= 15) return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    if (complexity >= 10) return <TrendingDown className="w-4 h-4 text-blue-600" />;
    return <Target className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card className="bg-white shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>コード分析・リスク評価</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search functions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Complexity threshold:</span>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={complexityThreshold}
                  onChange={(e) => setComplexityThreshold(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-8">{complexityThreshold}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterBy === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterBy("all")}
                >
                  All ({functions.length})
                </Button>
                <Button
                  variant={filterBy === "high-risk" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterBy("high-risk")}
                >
                  High Risk ({functions.filter(f => f.riskLevel === 'high').length})
                </Button>
                <Button
                  variant={filterBy === "untested" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterBy("untested")}
                >
                  Untested ({functions.filter(f => !f.isTested).length})
                </Button>
                <Button
                  variant={filterBy === "complex" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterBy("complex")}
                >
                  Complex ({functions.filter(f => f.complexity >= complexityThreshold).length})
                </Button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "complexity" | "coverage" | "risk")}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="complexity">Sort by Complexity (High → Low)</option>
                <option value="coverage">Sort by Coverage (Low → High)</option>
                <option value="risk">Sort by Risk Level (High → Low)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Function Analysis List */}
      <div className="space-y-4">
        {filteredAndSortedFunctions.map((func, index) => (
          <FunctionAnalysisCard key={index} functionData={func} />
        ))}
      </div>

      {filteredAndSortedFunctions.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">関数が見つかりません</h3>
          <p className="text-slate-600">検索条件またはフィルター条件を調整してください。</p>
        </div>
      )}
    </div>
  );
};

const FunctionAnalysisCard = ({ functionData }: { functionData: FunctionData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingIntent, setEditingIntent] = useState(false);
  const [businessIntent, setBusinessIntent] = useState(functionData.businessIntent || "");

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getComplexityIcon = (complexity: number) => {
    if (complexity >= 20) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (complexity >= 15) return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    if (complexity >= 10) return <TrendingDown className="w-4 h-4 text-blue-600" />;
    return <Target className="w-4 h-4 text-green-600" />;
  };

  return (
    <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {functionData.isTested ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-100" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-slate-900 truncate">{functionData.name}</h3>
                {getComplexityIcon(functionData.complexity)}
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1">
                <span>Line {functionData.lineNumber}</span>
                <Badge variant="outline" className="text-xs">
                  {functionData.category}
                </Badge>
                <Badge className={`text-xs ${getRiskColor(functionData.riskLevel)} border`}>
                  {functionData.riskLevel} risk
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Analyze"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-slate-600">Complexity</div>
            <div className="text-xl font-bold text-slate-900">{functionData.complexity}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Coverage</div>
            <div className={`text-xl font-bold ${functionData.isTested ? 'text-green-600' : 'text-red-600'}`}>
              {functionData.coverage}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Test Cases</div>
            <div className="text-xl font-bold text-slate-900">{functionData.testCoverage?.length || 0}</div>
          </div>
        </div>

        <Progress value={functionData.coverage} className="mb-4" />

        {isExpanded && (
          <Tabs defaultValue="natural" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="natural">自然言語解析</TabsTrigger>
              <TabsTrigger value="intent">ビジネス意図</TabsTrigger>
              <TabsTrigger value="tests">テストカバレッジ</TabsTrigger>
              <TabsTrigger value="branches">分岐解析</TabsTrigger>
            </TabsList>

            <TabsContent value="natural" className="mt-4">
              <NaturalAnalysis
                functionName={functionData.name}
                complexity={functionData.complexity}
                analysis={functionData.naturalAnalysis}
                onUpdateAnalysis={(analysis) => {
                  // In a real app, this would update the backend
                  console.log('Updated analysis for', functionData.name, analysis);
                }}
              />
            </TabsContent>

            <TabsContent value="intent" className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">Function Purpose & Implementation</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingIntent(!editingIntent)}
                  >
                    {editingIntent ? "Save" : "Edit"}
                  </Button>
                </div>
                {editingIntent ? (
                  <Textarea
                    value={businessIntent}
                    onChange={(e) => setBusinessIntent(e.target.value)}
                    placeholder="Describe the business purpose and implementation details of this function..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-md text-sm text-slate-700">
                    {businessIntent || "No business intent documented yet. Click Edit to add description."}
                  </div>
                )}
              </div>
              {functionData.implementationNotes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Implementation Notes</h4>
                  <div className="p-3 bg-blue-50 rounded-md text-sm text-slate-700">
                    {functionData.implementationNotes}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tests" className="mt-4">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Test Coverage Details</h4>
                {functionData.testCoverage && functionData.testCoverage.length > 0 ? (
                  functionData.testCoverage.map((test, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-slate-900">{test.testFile}</span>
                          <Badge variant="outline" className="text-xs">
                            {test.coverageType}
                          </Badge>
                        </div>
                        <span className="text-sm text-slate-600">
                          {test.coveredLines.length} lines covered
                        </span>
                      </div>
                      <div className="text-sm text-slate-700 pl-6">
                        {test.testCase}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p>No test coverage found for this function</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="branches" className="mt-4">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Branch Coverage Analysis</h4>
                {functionData.branchCoverage && functionData.branchCoverage.length > 0 ? (
                  functionData.branchCoverage.map((branch, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {branch.isCovered ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-red-300 bg-red-50" />
                          )}
                          <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                            {branch.condition}
                          </code>
                        </div>
                        <Badge variant={branch.isCovered ? "default" : "destructive"}>
                          {branch.isCovered ? "Covered" : "Uncovered"}
                        </Badge>
                      </div>
                      {branch.testCase && (
                        <div className="text-sm text-slate-600 mt-2 pl-6">
                          Tested by: {branch.testCase}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-lg">
                    <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p>No branch coverage data available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeAnalysis;
