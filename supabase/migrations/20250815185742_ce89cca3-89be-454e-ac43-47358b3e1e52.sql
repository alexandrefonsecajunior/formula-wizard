-- Create formulas table for storing user formulas
CREATE TABLE public.formulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  formula TEXT NOT NULL,
  values JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own formulas" 
ON public.formulas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own formulas" 
ON public.formulas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own formulas" 
ON public.formulas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own formulas" 
ON public.formulas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_formulas_updated_at
BEFORE UPDATE ON public.formulas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();