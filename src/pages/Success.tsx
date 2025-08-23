import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calculator } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = searchParams.get('locale') || 'en-US';
  const isPtBR = locale === 'pt-BR';

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 flex items-center justify-center">
      <div className="container max-w-md">
        <Card className="text-center border-2 border-primary/20">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-primary">
              {isPtBR ? 'Pagamento Aprovado!' : 'Payment Successful!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              {isPtBR 
                ? 'Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos os recursos premium!'
                : 'Your subscription has been activated successfully. You now have access to all premium features!'
              }
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-semibold">FormulaCreator</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isPtBR 
                  ? 'Você será redirecionado automaticamente em alguns segundos...'
                  : 'You will be automatically redirected in a few seconds...'
                }
              </p>
            </div>

            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              {isPtBR ? 'Voltar ao App' : 'Back to App'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;