// src/pages/UploadResumePage.js

import React from 'react';
import { FileText, Brain, UploadCloud, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function UploadResumePage() {
  const navigate = useNavigate();

  const cards = [
    {
      icon: Brain,
      title: "Why Upload Your Resume?",
      desc: "Uploading your resume helps the AI generate answers based on your experience and skills.",
    },
    {
      icon: UploadCloud,
      title: "Where to Upload?",
      desc: "You'll be asked to upload your resume during Mock or Live Interview setup. No need to upload it here.",
    },
    {
      icon: FileText,
      title: "Accepted Formats",
      desc: "We accept PDF and DOCX formats during setup to parse your resume securely.",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Resume for Better Interview Prep</h1>
        <p className="text-gray-600 text-lg">
          Our AI uses your resume during interview setup to personalize answers. Here's how it works.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-12">
        {cards.map((item, index) => (
          <Card key={index} className="bg-white shadow hover:shadow-md transition-all duration-300">
            <CardHeader className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700">{item.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={() => navigate('/mock-setup')}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          Start Mock Interview <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => navigate('/live-setup')}
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          Go to Live Interview <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
