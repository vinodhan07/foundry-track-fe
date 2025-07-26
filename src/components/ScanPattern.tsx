import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { usePatterns } from '../contexts/PatternContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  QrCode, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ScanPattern() {
  const [patternId, setPatternId] = useState('');
  const [scannedPattern, setScannedPattern] = useState<any>(null);
  const { patterns, incrementUsage } = usePatterns();
  const { toast } = useToast();

  const handleScan = () => {
    if (!patternId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a pattern ID",
        variant: "destructive",
      });
      return;
    }

    const pattern = patterns.find(p => p.id.toLowerCase() === patternId.toLowerCase());
    
    if (pattern) {
      setScannedPattern(pattern);
      toast({
        title: "Pattern Found!",
        description: `Successfully scanned pattern ${pattern.id}`,
      });
    } else {
      toast({
        title: "Pattern Not Found",
        description: "Please check the pattern ID and try again",
        variant: "destructive",
      });
      setScannedPattern(null);
    }
  };

  const handleIncrementUsage = () => {
    if (scannedPattern) {
      incrementUsage(scannedPattern.id);
      const updatedPattern = patterns.find(p => p.id === scannedPattern.id);
      setScannedPattern(updatedPattern);
      
      toast({
        title: "Usage Updated!",
        description: `Pattern ${scannedPattern.id} usage count increased to ${scannedPattern.usageCount + 1}`,
      });
    }
  };

  const simulateQRScan = () => {
    // Simulate scanning a random pattern
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    setPatternId(randomPattern.id);
    setScannedPattern(randomPattern);
    
    toast({
      title: "QR Code Scanned!",
      description: `Detected pattern ${randomPattern.id}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'Warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'Overdue':
        return <Clock className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'border-success bg-success/5';
      case 'Warning':
        return 'border-warning bg-warning/5';
      case 'Overdue':
        return 'border-destructive bg-destructive/5';
      default:
        return 'border-border';
    }
  };

  const getAlertVariant = (status: string) => {
    switch (status) {
      case 'Warning':
      case 'Overdue':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scan Pattern</h1>
          <p className="text-lg text-muted-foreground">
            Use QR scanner or manual input to track pattern usage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanning Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Pattern Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Scanner Simulation */}
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-accent/20 to-accent/40 rounded-lg border-2 border-dashed border-border flex items-center justify-center mb-4">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <Button 
                  onClick={simulateQRScan} 
                  variant="outline" 
                  className="mb-4"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Simulate QR Scan
                </Button>
              </div>

              {/* Manual Input */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">OR ENTER MANUALLY</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patternId">Pattern ID</Label>
                  <Input
                    id="patternId"
                    type="text"
                    placeholder="Enter pattern ID (e.g., PTN001)"
                    value={patternId}
                    onChange={(e) => setPatternId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  />
                </div>

                <Button onClick={handleScan} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search Pattern
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pattern Details</CardTitle>
            </CardHeader>
            <CardContent>
              {scannedPattern ? (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg border-2 ${getStatusColor(scannedPattern.status)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{scannedPattern.id}</h3>
                        <p className="text-sm text-muted-foreground">{scannedPattern.partNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(scannedPattern.status)}
                        <span className="text-sm font-medium">{scannedPattern.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Usage Count</div>
                        <div className="text-2xl font-bold">{scannedPattern.usageCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Threshold</div>
                        <div className="text-2xl font-bold">{scannedPattern.threshold}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Usage Progress</div>
                      <div className="w-full bg-accent rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            scannedPattern.usageCount >= scannedPattern.threshold 
                              ? 'bg-warning' 
                              : 'bg-success'
                          }`}
                          style={{ 
                            width: `${Math.min((scannedPattern.usageCount / scannedPattern.threshold) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {scannedPattern.usageCount} / {scannedPattern.threshold} uses
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <strong>Last Maintenance:</strong> {scannedPattern.lastMaintenance}
                    </div>
                  </div>

                  {/* Alerts */}
                  {scannedPattern.status !== 'Good' && (
                    <Alert variant={getAlertVariant(scannedPattern.status)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {scannedPattern.status === 'Warning' 
                          ? 'This pattern has reached its usage threshold and requires validation.' 
                          : 'This pattern is overdue for maintenance and should be inspected immediately.'
                        }
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Button */}
                  <Button 
                    onClick={handleIncrementUsage} 
                    className="w-full"
                    variant={scannedPattern.status === 'Overdue' ? 'destructive' : 'default'}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    +1 Use ({scannedPattern.usageCount + 1})
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Pattern Scanned</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan a QR code or enter a pattern ID to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}