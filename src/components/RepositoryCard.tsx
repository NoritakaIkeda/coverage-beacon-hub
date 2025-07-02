
import { Link } from "react-router-dom";
import { Github, Star, GitBranch, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Repository } from "@/types/repository";

interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 10) return "text-green-600";
    if (complexity <= 15) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Github className="w-5 h-5 text-slate-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 truncate">{repository.name}</h3>
              <p className="text-sm text-slate-600 truncate">{repository.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-slate-500 flex-shrink-0 ml-2">
            <Star className="w-4 h-4" />
            <span>{repository.stars}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Coverage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Coverage</span>
            </div>
            <span className={`text-sm font-bold ${getCoverageColor(repository.coveragePercentage)}`}>
              {repository.coveragePercentage}%
            </span>
          </div>
          <Progress value={repository.coveragePercentage} className="h-2" />
        </div>

        {/* Complexity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-slate-700">Avg Complexity</span>
          </div>
          <span className={`text-sm font-bold ${getComplexityColor(repository.averageComplexity)}`}>
            {repository.averageComplexity}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <GitBranch className="w-4 h-4" />
            <span>{repository.totalFunctions} functions</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{repository.lastAnalyzed}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {repository.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Link
          to={`/repository/${repository.id}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center text-sm font-medium transition-colors"
        >
          View Analysis
        </Link>
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;
