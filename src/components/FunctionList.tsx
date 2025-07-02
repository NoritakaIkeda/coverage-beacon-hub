
import { useState } from "react";
import { AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FunctionData {
  name: string;
  complexity: number;
  coverage: number;
  category: string;
  isTested: boolean;
  lineNumber: number;
}

interface FunctionListProps {
  functions: FunctionData[];
}

const FunctionList = ({ functions }: FunctionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "tested" | "untested" | "high-complexity">("all");

  const filteredFunctions = functions.filter((func) => {
    const matchesSearch = func.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterBy) {
      case "tested":
        return matchesSearch && func.isTested;
      case "untested":
        return matchesSearch && !func.isTested;
      case "high-complexity":
        return matchesSearch && func.complexity > 15;
      default:
        return matchesSearch;
    }
  });

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 10) return "text-green-600 bg-green-50";
    if (complexity <= 15) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getComplexityIcon = (complexity: number) => {
    if (complexity > 15) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    return null;
  };

  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader>
        <CardTitle>Function Analysis</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search functions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterBy === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterBy("all")}
            >
              All ({functions.length})
            </Button>
            <Button
              variant={filterBy === "tested" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterBy("tested")}
            >
              Tested ({functions.filter(f => f.isTested).length})
            </Button>
            <Button
              variant={filterBy === "untested" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterBy("untested")}
            >
              Untested ({functions.filter(f => !f.isTested).length})
            </Button>
            <Button
              variant={filterBy === "high-complexity" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterBy("high-complexity")}
            >
              High Complexity ({functions.filter(f => f.complexity > 15).length})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredFunctions.map((func, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {func.isTested ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-slate-900 truncate">{func.name}</h4>
                    {getComplexityIcon(func.complexity)}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span>Line {func.lineNumber}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {func.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-sm text-slate-600">Coverage</div>
                  <div className={`text-sm font-medium ${func.isTested ? 'text-green-600' : 'text-red-600'}`}>
                    {func.coverage}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Complexity</div>
                  <div className={`text-sm font-medium px-2 py-1 rounded ${getComplexityColor(func.complexity)}`}>
                    {func.complexity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredFunctions.length === 0 && (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No functions found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FunctionList;
