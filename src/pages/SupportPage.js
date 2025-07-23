// src/pages/SupportPage.js

import React from 'react';
import { Mail, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: HelpCircle,
      title: 'FAQs',
      desc: 'Find answers to common questions about mock interviews, resume uploads, and subscriptions.',
    },
    {
      icon: Mail,
      title: 'Email Us',
      desc: 'Need personal assistance? Reach out to our support team at support@crackify-ai.com.',
    },
    {
      icon: MessageSquare,
      title: 'Live Interview Help',
      desc: 'Before joining live interviews, make sure your mic and resume are properly configured.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Need Help? We're Here for You</h1>
        <p className="text-gray-600 text-lg">
          Whether you're stuck during setup or need help understanding your sessions, Crackify AI has your back.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-12">
        {supportOptions.map((item, index) => (
          <Card key={index} className="bg-white shadow hover:shadow-md transition-all duration-300">
            <CardHeader className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <item.icon className="h-6 w-6 text-indigo-600" />
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
          Go to Mock Setup <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => navigate('/live-setup')}
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          Go to Live Setup <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
