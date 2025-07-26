import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { usePatterns } from '../contexts/PatternContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  User, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MaintenanceLog() {
  const [formData, setFormData] = useState({
    patternId: '',
    type: '',
    remarks: ''
  });
  
  const { patterns, maintenanceLogs, addMaintenanceLog } = usePatterns();
  const { toast } = useToast();

  const maintenanceTypes = [
    'Routine Inspection',
    'Minor Repair',
    'Major Overhaul',
    'Cleaning',
    'Calibration',
    'Replacement',
    'Emergency Repair'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patternId || !formData.type || !formData.remarks) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if pattern exists
    const pattern = patterns.find(p => p.id.toLowerCase() === formData.patternId.toLowerCase());
    if (!pattern) {
      toast({
        title: "Error",
        description: "Pattern ID not found in system",
        variant: "destructive",
      });
      return;
    }

    addMaintenanceLog({
      patternId: formData.patternId.toUpperCase(),
      type: formData.type,
      remarks: formData.remarks
    });

    toast({
      title: "Maintenance Log Added",
      description: `Successfully logged maintenance for pattern ${formData.patternId.toUpperCase()}`,
    });

    // Reset form
    setFormData({
      patternId: '',
      type: '',
      remarks: ''
    });
  };

  const getMaintenanceTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      'Routine Inspection': 'bg-primary/10 text-primary',
      'Minor Repair': 'bg-warning/10 text-warning',
      'Major Overhaul': 'bg-destructive/10 text-destructive',
      'Cleaning': 'bg-success/10 text-success',
      'Calibration': 'bg-blue-500/10 text-blue-600',
      'Replacement': 'bg-purple-500/10 text-purple-600',
      'Emergency Repair': 'bg-red-500/10 text-red-600'
    };
    return colorMap[type] || 'bg-muted text-muted-foreground';
  };

  const getPatternStatus = (patternId: string) => {
    const pattern = patterns.find(p => p.id === patternId);
    return pattern?.status || 'Unknown';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'Warning':
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      case 'Overdue':
        return <Clock className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Maintenance Log</h1>
          <p className="text-lg text-muted-foreground">
            Track maintenance activities and pattern history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Maintenance Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Maintenance Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patternId">Pattern ID *</Label>
                    <Input
                      id="patternId"
                      type="text"
                      placeholder="e.g., PTN001"
                      value={formData.patternId}
                      onChange={(e) => setFormData({ ...formData, patternId: e.target.value })}
                      className="uppercase"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Maintenance Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select maintenance type" />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks *</Label>
                    <Textarea
                      id="remarks"
                      placeholder="Describe the maintenance work performed..."
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Wrench className="mr-2 h-4 w-4" />
                    Add Maintenance Log
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Logs</span>
                    <span className="font-medium">{maintenanceLogs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-medium">
                      {maintenanceLogs.filter(log => 
                        new Date(log.date).getMonth() === new Date().getMonth()
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Most Common</span>
                    <span className="font-medium text-xs">Routine Inspection</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Maintenance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {maintenanceLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        No Maintenance Logs
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add your first maintenance entry using the form
                      </p>
                    </div>
                  ) : (
                    maintenanceLogs.map((log) => (
                      <div key={log.id} className="border border-border rounded-lg p-4 hover:bg-accent/20 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">{log.patternId}</div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(getPatternStatus(log.patternId))}
                              <span className="text-xs text-muted-foreground">
                                {getPatternStatus(log.patternId)}
                              </span>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getMaintenanceTypeColor(log.type)}`}>
                            {log.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-foreground mb-3 line-clamp-2">
                          {log.remarks}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {log.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.technician}
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            #{log.id}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {maintenanceTypes.slice(0, 4).map((type) => {
                    const count = maintenanceLogs.filter(log => log.type === type).length;
                    return (
                      <div key={type} className="text-center">
                        <div className="text-lg font-bold text-foreground">{count}</div>
                        <div className="text-xs text-muted-foreground">{type}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}