import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { useAuth } from "./AuthContext";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

type Analysis = {
  score: number;
  role: string;
  strengths: { title: string; description: string }[];
  weaknesses: { title: string; description: string }[];
};

export function ResumeAnalyzer() {
  const { user } = useAuth() || {};

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<Analysis | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisData(null);
    }
  };

  const analyzeResume = () => {
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    let score = 60;
    let strengths: { title: string; description: string }[] = [];
    let weaknesses: { title: string; description: string }[] = [];
    let role = "Software Developer";

    if (fileName.includes("react") || fileName.includes("frontend")) {
      strengths.push({ title: "Frontend Skills", description: "React detected in resume name" });
      role = "Frontend Developer";
      score += 10;
    }

    if (fileName.includes("java") || fileName.includes("python")) {
      strengths.push({ title: "Programming", description: "Programming language detected" });
      score += 5;
    }

    if (!fileName.includes("project")) {
      weaknesses.push({ title: "Projects", description: "Add projects section" });
    }

    if (!fileName.includes("experience")) {
      weaknesses.push({ title: "Experience", description: "Add experience section" });
    }

    if (strengths.length === 0) {
      strengths.push({ title: "Resume Uploaded", description: "File recognized successfully" });
    }

    setAnalysisData({
      score,
      role,
      strengths,
      weaknesses
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Resume Analyzer</h1>
          <p className="text-gray-600">Upload your resume and get feedback</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* UPLOAD SECTION */}
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="border-2 border-dashed p-6 text-center rounded-md">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <FileText className="w-10 h-10 mx-auto text-purple-500" />
                  <p className="mt-2 text-sm">
                    {selectedFile ? selectedFile.name : "Click to upload resume"}
                  </p>
                </label>
              </div>

              <Button
                disabled={!selectedFile}
                onClick={analyzeResume}
                className="w-full"
              >
                Analyze Resume
              </Button>

              {!user && (
                <p className="text-sm text-center text-gray-500">
                  (Login optional for now)
                </p>
              )}

            </CardContent>
          </Card>

          {/* RESULT SECTION */}
          <div className="md:col-span-2">

            {!analysisData && (
              <Card className="p-10 text-center">
                <Upload className="mx-auto w-12 h-12 text-gray-400" />
                <p className="mt-4 text-gray-600">
                  Upload and analyze your resume
                </p>
              </Card>
            )}

            {analysisData && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>Score</span>
                      <span className="text-purple-600">
                        {analysisData.score}/100
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={analysisData.score} />
                    <p className="mt-2 text-sm text-purple-600">
                      Suggested Role: {analysisData.role}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">

                  {/* STRENGTHS */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysisData.strengths.map((item, i) => (
                        <p key={i}>✔ {item.title}</p>
                      ))}
                    </CardContent>
                  </Card>

                  {/* WEAKNESSES */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex gap-2 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        Improve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysisData.weaknesses.map((item, i) => (
                        <p key={i}>⚠ {item.title}</p>
                      ))}
                    </CardContent>
                  </Card>

                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
