import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calculator, TrendingUp, Zap, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PricingEN = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'basic' | 'premium') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan, locale: 'en-US' }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Error processing payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FormulaCreator</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/planos')}>
              <Globe className="h-4 w-4 mr-2" />
              Português
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to App
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Pricing & Plans
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Choose the perfect plan
              <span className="text-primary block">for your needs</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create and manage complex formulas with our powerful tool. 
              Start for free or unlock premium features.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <Card className="relative border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Basic Plan</CardTitle>
                <CardDescription>
                  Perfect for individual users and small projects
                </CardDescription>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">$7.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    Up to 50 saved formulas
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    Compound interest calculator
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    Email support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    Export results to PDF
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe('basic')}
                  disabled={loading === 'basic'}
                >
                  {loading === 'basic' ? 'Processing...' : 'Start with Basic'}
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="relative border-2 border-primary hover:border-primary/80 transition-all duration-300">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                <Zap className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <CardDescription>
                  For professionals and teams who need advanced features
                </CardDescription>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">$14.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    <strong>Unlimited formulas</strong>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    All financial calculators
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    Priority 24/7 support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    Advanced result analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    External API integrations
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    Team collaboration
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe('premium')}
                  disabled={loading === 'premium'}
                >
                  {loading === 'premium' ? 'Processing...' : 'Start with Premium'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why choose FormulaCreator?</h2>
            <p className="text-xl text-muted-foreground">
              The most complete tool for formula creation and management
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intuitive Interface</h3>
              <p className="text-muted-foreground">
                Create complex formulas with our easy-to-use drag-and-drop interface
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analysis</h3>
              <p className="text-muted-foreground">
                Visualize results with detailed charts and reports
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <p className="text-muted-foreground">
                Instant calculations even with complex formulas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FormulaCreator</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 FormulaCreator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingEN;