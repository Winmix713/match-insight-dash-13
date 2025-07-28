-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  founded INTEGER,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team_id UUID NOT NULL REFERENCES public.teams(id),
  away_team_id UUID NOT NULL REFERENCES public.teams(id),
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  home_goals INTEGER,
  away_goals INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'postponed', 'cancelled')),
  winner TEXT CHECK (winner IN ('home', 'away', 'draw')),
  season TEXT NOT NULL DEFAULT '2024/25',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

-- Create models table
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  trained_at TIMESTAMP WITH TIME ZONE,
  accuracy DECIMAL(5,2),
  is_active BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, version)
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id),
  predicted_winner TEXT CHECK (predicted_winner IN ('home', 'away', 'draw')),
  home_expected_goals DECIMAL(3,2),
  away_expected_goals DECIMAL(3,2),
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  model_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  result_status TEXT DEFAULT 'pending' CHECK (result_status IN ('pending', 'correct', 'wrong'))
);

-- Create training_logs table
CREATE TABLE public.training_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES public.models(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  accuracy_achieved DECIMAL(5,2),
  duration INTEGER, -- in seconds
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (but with permissive policies for now)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (anyone can access everything for now)
CREATE POLICY "Public access to teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to models" ON public.models FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to predictions" ON public.predictions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to training_logs" ON public.training_logs FOR ALL USING (true) WITH CHECK (true);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON public.models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_matches_date ON public.matches(match_date);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_teams ON public.matches(home_team_id, away_team_id);
CREATE INDEX idx_predictions_match ON public.predictions(match_id);
CREATE INDEX idx_predictions_model ON public.predictions(model_name);
CREATE INDEX idx_training_logs_model ON public.training_logs(model_id);

-- Insert sample teams
INSERT INTO public.teams (name, short_code, founded) VALUES
('Arsenal FC', 'ARS', 1886),
('Chelsea FC', 'CHE', 1905),
('Liverpool FC', 'LIV', 1892),
('Manchester City', 'MCI', 1880),
('Manchester United', 'MUN', 1878),
('Tottenham Hotspur', 'TOT', 1882),
('Newcastle United', 'NEW', 1892),
('Brighton & Hove Albion', 'BHA', 1901),
('Aston Villa', 'AVL', 1874),
('West Ham United', 'WHU', 1895),
('Crystal Palace', 'CRY', 1905),
('Brentford FC', 'BRE', 1889),
('Fulham FC', 'FUL', 1879),
('Leicester City', 'LEI', 1884),
('Everton FC', 'EVE', 1878),
('Wolverhampton Wanderers', 'WOL', 1877);

-- Insert a sample model
INSERT INTO public.models (name, version, algorithm, is_active, accuracy, notes) VALUES
('Random Forest', 'v2.1', 'Random Forest Classifier', true, 87.00, 'Current production model with ensemble approach');

-- Enable realtime for live updates
ALTER TABLE public.matches REPLICA IDENTITY FULL;
ALTER TABLE public.predictions REPLICA IDENTITY FULL;
ALTER TABLE public.training_logs REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_logs;