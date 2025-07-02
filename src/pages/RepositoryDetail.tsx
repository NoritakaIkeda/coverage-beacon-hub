
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Github, Star, GitBranch, Clock, Download, Share2, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockRepositories } from "@/data/mockData";
import CoverageChart from "@/components/CoverageChart";
import FunctionList from "@/components/FunctionList";

const RepositoryDetail = () => {
  const { id } = useParams();
  const repository = mockRepositories.find(repo => repo.id === id);

  if (!repository) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Repository not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <Github className="w-8 h-8 text-slate-700" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{repository.name}</h1>
                  <p className="text-slate-600">{repository.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Repository Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{repository.stars} stars</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-slate-600" />
                <span>{repository.totalFunctions} functions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Last analyzed: {repository.lastAnalyzed}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {repository.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Overall Coverage</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getCoverageColor(repository.coveragePercentage)}`}>
                {repository.coveragePercentage}%
              </div>
              <Progress value={repository.coveragePercentage} className="mt-2" />
              <p className="text-xs text-slate-600 mt-2">
                {repository.testedFunctions} of {repository.totalFunctions} functions covered
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Average Complexity</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{repository.averageComplexity}</div>
              <div className="mt-2 text-sm text-slate-600">
                <span className="text-red-600 font-medium">{repository.highComplexityCount}</span> high complexity functions
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Test Files</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{repository.testFiles}</div>
              <p className="text-xs text-slate-600 mt-2">Test files in repository</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Coverage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <CoverageChart data={repository.coverageByCategory} />
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Lines of Code</span>
                    <span className="font-medium">{repository.totalLOC?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tested Lines</span>
                    <span className="font-medium">{repository.testedLOC?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Untested Functions</span>
                    <span className="font-medium text-red-600">
                      {repository.totalFunctions - repository.testedFunctions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Risk Score</span>
                    <Badge variant={repository.riskScore > 7 ? "destructive" : repository.riskScore > 4 ? "secondary" : "default"}>
                      {repository.riskScore}/10
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="functions">
            <FunctionList functions={repository.functions} />
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repository.coverageByCategory.map((category) => (
                <Card key={category.category} className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Coverage</span>
                        <span className={`font-bold ${getCoverageColor(category.coverage)}`}>
                          {category.coverage}%
                        </span>
                      </div>
                      <Progress value={category.coverage} />
                      <div className="text-sm text-slate-600">
                        {category.tested} of {category.total} functions tested
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RepositoryDetail;
