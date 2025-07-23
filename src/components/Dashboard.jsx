import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from '../components/ui/badge';
import { User } from "../utils/User";
import {
  Brain,
  Video,
  Upload,
  History,
  ArrowRight,
  Calendar,
  Clock,
  Target,
  Sparkles,
  Bot,
  MessageSquare,
  Mic,
  Eye,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { auth } = useAuth();

  let userEmail = 'Guest';
    if (auth) {
      try {
        const decoded = jwtDecode(auth);
        userEmail = decoded?.sub || 'User';
      } catch (err) {
        console.error('❌ Invalid token', err);
      }
    }

  const quickActions = [
    { title: 'Start Mock Interview', description: 'Practice with AI-powered interviews', icon: Brain, color: 'from-blue-500 to-cyan-500', href: '/mock-setup' },
    { title: 'Join Live Interview', description: 'Get real-time AI assistance', icon: Video, color: 'from-purple-500 to-pink-500', href: '/live-setup' },
    { title: 'Upload Resume', description: 'Personalize your interview prep', icon: Upload, color: 'from-green-500 to-emerald-500', href: '/resume' },
    { title: 'View Sessions', description: 'Review your interview history', icon: History, color: 'from-orange-500 to-yellow-500', href: '/sessions' }
  ];

  const topCompanies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' }
  ];

  const whyCrackifyFeatures = [
    { title: 'Real-Time Audio Transcription', text: 'Advanced AI listens to interview questions in real-time and transcribes them instantly for immediate processing.', icon: Mic, color: 'from-green-500 to-emerald-500' },
    { title: 'GPT-4o Answer Generation', text: 'Powered by cutting-edge GPT-4o technology to generate contextually perfect answers tailored to each question.', icon: Bot, color: 'from-blue-500 to-cyan-500' },
    { title: 'Smart Question Classification', text: 'AI automatically categorizes questions as Technical, Behavioral, or Scenario-based for optimal response strategy.', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { title: 'Invisible Stealth Mode', text: 'Completely undetectable overlay interface that works seamlessly during screen sharing without raising suspicion.', icon: Eye, color: 'from-orange-500 to-red-500' }
  ];

  const MotionSection = ({ children }) => (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.section>
  );

  return (
    <div className="space-y-20 px-4 sm:px-6 lg:px-8 py-12">

      {/* Welcome Header */}
      <MotionSection>
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome, {userEmail?.split('@')[0]} 👋</h1>
            <p className="text-blue-100 text-lg">Ready to ace your next interview? Let's get started with your preparation.</p>
            <div className="flex items-center mt-4 space-x-4">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Target className="w-4 h-4 mr-1" />
                {user?.role === 'admin' ? 'Admin' : 'Job Seeker'}
              </Badge>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Quick Actions */}
      <MotionSection>
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} onClick={() => navigate(action.href)} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 cursor-pointer">
              <CardHeader className="pb-3">
                <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">{action.title}</CardTitle>
                <CardDescription className="text-gray-600">{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="group-hover:bg-blue-50 group-hover:text-blue-700 w-full justify-between">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </MotionSection>

      {/* Top Companies */}
      <MotionSection>
        {/* Crack Interviews At Top Companies */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Crack Interviews At Top Companies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {topCompanies.map((company) => (
              <div
                key={company.name}
                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-all"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
                <p className="mt-4 text-sm font-medium text-gray-800 text-center">{company.name}</p>
              </div>
            ))}
          </div>
        </div>

      </MotionSection>

      {/* Why Crackify AI */}
      <MotionSection>
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Why Crackify AI?</h2>
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"></div>
            
            <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border-blue-200/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  {whyCrackifyFeatures.map((feature, index) => (
                    <div key={index} className="group hover:scale-105 transition-all duration-300">
                      <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/40">
                        <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                          <p className="text-gray-700 leading-relaxed">{feature.text}</p>
                          <div className="flex items-center mt-3 text-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Production Ready</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MotionSection>

      {/* Tips to Ace Your Interview */}
      <MotionSection>
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Tips to Ace Your Interview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { tip: "Use the STAR method for structured answers", icon: Target },
              { tip: "Practice speaking slowly and confidently", icon: MessageSquare },
              { tip: "Research the company before your mock", icon: Brain },
              { tip: "Pause before answering – it shows thoughtfulness", icon: Clock }
            ].map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-800">{item.tip}</p>
              </div>
            ))}
          </div>
        </section>
      </MotionSection>


      {/* Interview Preparation Guide */}
      <MotionSection>
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Interview Preparation Guide</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                step: "1. Upload Resume",
                desc: "Tailor interview responses to your skills and experience.",
                icon: Upload
              },
              {
                step: "2. Start Mock Interview",
                desc: "Practice popular technical and behavioral questions.",
                icon: Brain
              },
              {
                step: "3. Review Your Sessions",
                desc: "Analyze your performance and iterate for better results.",
                icon: History
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.step}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </MotionSection>


      {/* Desktop App Coming Soon */}
      <MotionSection>
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl overflow-hidden relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💻</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Desktop App Coming Soon</h3>
                    <p className="text-blue-100 text-base">Enhanced stealth mode experience</p>
                  </div>
                </div>
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  Use Crackify with advanced stealth mode overlay to avoid screen share detection during interviews. 
                  Perfect for live interview assistance with zero detection risk.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Join Waitlist
                  <Sparkles className="ml-2 w-5 h-5 animate-spin" />
                </Button>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-40 h-40 bg-white/10 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <Shield className="w-20 h-20 text-white/80 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

    </div>
  );
}
