
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Target, Shield, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { NaturalLanguageAnalysis } from "@/types/repository";

interface NaturalAnalysisProps {
  functionName: string;
  complexity: number;
  analysis?: NaturalLanguageAnalysis;
  onUpdateAnalysis?: (analysis: NaturalLanguageAnalysis) => void;
}

const NaturalAnalysis = ({ functionName, complexity, analysis, onUpdateAnalysis }: NaturalAnalysisProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnalysis, setEditedAnalysis] = useState<NaturalLanguageAnalysis>(
    analysis || {
      complexityReason: "",
      businessBackground: "",
      technicalConstraints: "",
      testStrategy: "",
      behaviorDescription: "",
      riskAssessment: "",
      strategicEvaluation: ""
    }
  );

  const handleSave = () => {
    if (onUpdateAnalysis) {
      onUpdateAnalysis(editedAnalysis);
    }
    setIsEditing(false);
  };

  const getComplexityInsight = (complexity: number) => {
    if (complexity >= 20) return { level: "極高", color: "bg-red-100 text-red-800", icon: AlertCircle };
    if (complexity >= 15) return { level: "高", color: "bg-orange-100 text-orange-800", icon: TrendingUp };
    if (complexity >= 10) return { level: "中", color: "bg-yellow-100 text-yellow-800", icon: Target };
    return { level: "低", color: "bg-green-100 text-green-800", icon: CheckCircle2 };
  };

  const complexityInsight = getComplexityInsight(complexity);
  const Icon = complexityInsight.icon;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>自然言語解析レポート</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={`${complexityInsight.color} border-0`}>
              <Icon className="w-3 h-3 mr-1" />
              複雑度 {complexityInsight.level}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? "保存" : "編集"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 複雑さの理由 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <h4 className="font-semibold text-slate-900">複雑さの理由</h4>
          </div>
          {isEditing ? (
            <Textarea
              value={editedAnalysis.complexityReason}
              onChange={(e) => setEditedAnalysis({...editedAnalysis, complexityReason: e.target.value})}
              placeholder="この関数が複雑になっている技術的・ビジネス的理由を記述..."
              className="min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-white rounded-md text-sm text-slate-700 border border-orange-200">
              {editedAnalysis.complexityReason || "複雑さの理由が未分析です。編集ボタンから追加してください。"}
            </div>
          )}
        </div>

        {/* ビジネス背景 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-slate-900">ビジネス背景</h4>
          </div>
          {isEditing ? (
            <Textarea
              value={editedAnalysis.businessBackground}
              onChange={(e) => setEditedAnalysis({...editedAnalysis, businessBackground: e.target.value})}
              placeholder="ビジネス要件やユーザーニーズに起因する実装背景を記述..."
              className="min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-blue-50 rounded-md text-sm text-slate-700 border border-blue-200">
              {editedAnalysis.businessBackground || "ビジネス背景が未記録です。"}
            </div>
          )}
        </div>

        {/* 技術的制約 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-slate-900">技術的制約</h4>
          </div>
          {isEditing ? (
            <Textarea
              value={editedAnalysis.technicalConstraints}
              onChange={(e) => setEditedAnalysis({...editedAnalysis, technicalConstraints: e.target.value})}
              placeholder="外部依存、互換性、パフォーマンス要件などの技術的制約を記述..."
              className="min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-purple-50 rounded-md text-sm text-slate-700 border border-purple-200">
              {editedAnalysis.technicalConstraints || "技術的制約が未記録です。"}
            </div>
          )}
        </div>

        {/* テスト戦略 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-slate-900">テスト戦略（t-wada/Khorikov準拠）</h4>
          </div>
          {isEditing ? (
            <Textarea
              value={editedAnalysis.testStrategy}
              onChange={(e) => setEditedAnalysis({...editedAnalysis, testStrategy: e.target.value})}
              placeholder="振る舞いベースのテスト設計、境界値・エラーパスの網羅状況を記述..."
              className="min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-green-50 rounded-md text-sm text-slate-700 border border-green-200">
              {editedAnalysis.testStrategy || "テスト戦略が未分析です。"}
            </div>
          )}
        </div>

        {/* 振る舞いの記述 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <h4 className="font-semibold text-slate-900">振る舞いの記述</h4>
          </div>
          {isEditing ? (
            <Textarea
              value={editedAnalysis.behaviorDescription}
              onChange={(e) => setEditedAnalysis({...editedAnalysis, behaviorDescription: e.target.value})}
              placeholder="この関数が「何をするか」を仕様書的に記述（実装詳細ではなく振る舞いに焦点）..."
              className="min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-indigo-50 rounded-md text-sm text-slate-700 border border-indigo-200">
              {editedAnalysis.behaviorDescription || "振る舞いの記述が未記録です。"}
            </div>
          )}
        </div>

        {/* リスク評価 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <h4 className="font-semibold text-slate-900">リスク評価</h4>
          </div>
          {isEditing ? (
            <Textarea
              value={editedAnalysis.riskAssessment}
              onChange={(e) => setEditedAnalysis({...editedAnalysis, riskAssessment: e.target.value})}
              placeholder="変更時の破綻リスク、テスト不足によるリスクを評価..."
              className="min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-red-50 rounded-md text-sm text-slate-700 border border-red-200">
              {editedAnalysis.riskAssessment || "リスク評価が未実施です。"}
            </div>
          )}
        </div>

        {/* 戦略的評価 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <h4 className="font-semibold text-slate-900">戦略的評価・推奨事項</h4>
          </div>
          {isEditing ? (
            <Textarea
              value={editedAnalysis.strategicEvaluation}
              onChange={(e) => setEditedAnalysis({...editedAnalysis, strategicEvaluation: e.target.value})}
              placeholder="総合的な評価と改善提案、メンテナンス戦略を記述..."
              className="min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-teal-50 rounded-md text-sm text-slate-700 border border-teal-200">
              {editedAnalysis.strategicEvaluation || "戦略的評価が未実施です。"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NaturalAnalysis;
