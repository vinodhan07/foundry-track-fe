import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { usePatterns } from '../contexts/PatternContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Package
} from 'lucide-react';

export function PatternList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { patterns, searchPatterns } = usePatterns();

  const filteredPatterns = searchPatterns(searchQuery).filter(pattern => 
    statusFilter === 'All' || pattern.status === statusFilter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'Overdue':
        return <Clock className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Good':
        return 'default';
      case 'Warning':
        return 'secondary';
      case 'Overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getProgressColor = (usageCount: number, threshold: number) => {
    const percentage = (usageCount / threshold) * 100;
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const statusOptions = ['All', 'Good', 'Warning', 'Overdue'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pattern List</h1>
          <p className="text-lg text-muted-foreground">
            Browse and manage all patterns in your foundry
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Pattern ID or Part Number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="whitespace-nowrap"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatterns.map((pattern) => (
            <Card key={pattern.id} className="hover:shadow-medium transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{pattern.id}</CardTitle>
                  </div>
                  <Badge variant={getStatusBadgeVariant(pattern.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(pattern.status)}
                      {pattern.status}
                    </div>
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {pattern.partNumber}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Usage Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">
                      {pattern.usageCount} / {pattern.threshold}
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(pattern.usageCount, pattern.threshold)}`}
                      style={{ 
                        width: `${Math.min((pattern.usageCount / pattern.threshold) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((pattern.usageCount / pattern.threshold) * 100)}% of threshold
                  </div>
                </div>

                {/* Last Maintenance */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Maintenance:</span>
                  <span className="font-medium">{pattern.lastMaintenance}</span>
                </div>

                {/* Status-specific info */}
                {pattern.status === 'Warning' && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2 text-warning text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Validation Required
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Pattern has reached usage threshold
                    </div>
                  </div>
                )}

                {pattern.status === 'Overdue' && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <Clock className="h-4 w-4" />
                      Maintenance Overdue
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Immediate attention required
                    </div>
                  </div>
                )}

                {pattern.status === 'Good' && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Operating Normally
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Pattern in good condition
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPatterns.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Patterns Found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or filter settings
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {filteredPatterns.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {statusFilter === 'All' ? 'Total' : statusFilter} Patterns
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {filteredPatterns.filter(p => p.status === 'Good').length}
                </div>
                <div className="text-sm text-muted-foreground">Good</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {filteredPatterns.filter(p => p.status === 'Warning').length}
                </div>
                <div className="text-sm text-muted-foreground">Warning</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {filteredPatterns.filter(p => p.status === 'Overdue').length}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}