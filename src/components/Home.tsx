import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  QrCode, 
  List, 
  Wrench,
  TrendingUp,
  Shield,
  Zap,
  Clock
} from 'lucide-react';

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: 'Dashboard',
      description: 'View analytics and overview',
      icon: BarChart3,
      path: '/dashboard',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Scan Pattern',
      description: 'QR scan and update usage',
      icon: QrCode,
      path: '/scan',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Pattern List',
      description: 'Browse all patterns',
      icon: List,
      path: '/patterns',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Maintenance Logs',
      description: 'Track maintenance history',
      icon: Wrench,
      path: '/maintenance',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Monitor pattern usage and trends'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Ensure pattern integrity and reliability'
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Fast QR scanning and updates'
    },
    {
      icon: Clock,
      title: 'Maintenance Scheduling',
      description: 'Automated revalidation reminders'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your foundry patterns efficiently with FoundryTrack
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card 
                key={card.path}
                className="cursor-pointer hover:shadow-medium transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-card to-accent/20"
                onClick={() => navigate(card.path)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:text-primary-glow">
                    Open →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-center">Why Choose FoundryTrack?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}