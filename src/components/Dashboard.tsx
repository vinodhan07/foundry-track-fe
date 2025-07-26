import React from 'react';
import { Navbar } from './Navbar';
import { usePatterns } from '../contexts/PatternContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function Dashboard() {
  const { patterns } = usePatterns();

  const stats = {
    total: patterns.length,
    needingValidation: patterns.filter(p => p.status === 'Warning').length,
    overdue: patterns.filter(p => p.status === 'Overdue').length,
    good: patterns.filter(p => p.status === 'Good').length
  };

  const recentActivity = patterns
    .slice(0, 5)
    .map(pattern => ({
      id: pattern.id,
      partNumber: pattern.partNumber,
      usageCount: pattern.usageCount,
      threshold: pattern.threshold,
      status: pattern.status
    }));

  const statCards = [
    {
      title: 'Total Patterns',
      value: stats.total,
      icon: Package,
      description: 'Active patterns in system',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Needing Validation',
      value: stats.needingValidation,
      icon: AlertTriangle,
      description: 'Patterns requiring attention',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: Clock,
      description: 'Patterns past due date',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      title: 'In Good Condition',
      value: stats.good,
      icon: CheckCircle,
      description: 'Patterns operating normally',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'Overdue':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'text-success';
      case 'Warning':
        return 'text-warning';
      case 'Overdue':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Overview of your pattern monitoring system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-medium transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Pattern Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((pattern) => (
                  <div key={pattern.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{pattern.id}</span>
                        {getStatusIcon(pattern.status)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {pattern.partNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {pattern.usageCount}/{pattern.threshold}
                      </div>
                      <div className={`text-xs ${getStatusColor(pattern.status)}`}>
                        {pattern.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Operational Patterns</span>
                  <span className="text-sm font-medium text-success">
                    {Math.round((stats.good / stats.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(stats.good / stats.total) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Requiring Attention</span>
                  <span className="text-sm font-medium text-warning">
                    {Math.round(((stats.needingValidation + stats.overdue) / stats.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((stats.needingValidation + stats.overdue) / stats.total) * 100}%` }}
                  ></div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="text-sm font-medium text-primary mb-2">Recommendations</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Schedule maintenance for {stats.overdue} overdue patterns</li>
                    <li>• Review {stats.needingValidation} patterns requiring validation</li>
                    <li>• System efficiency: {Math.round((stats.good / stats.total) * 100)}%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}