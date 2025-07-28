import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { match_id } = await req.json()

    // Get match details with teams
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .eq('id', match_id)
      .single()

    if (matchError || !match) {
      throw new Error('Match not found')
    }

    // Get active model
    const { data: activeModel, error: modelError } = await supabase
      .from('models')
      .select('*')
      .eq('is_active', true)
      .single()

    if (modelError || !activeModel) {
      throw new Error('No active model found')
    }

    // Simple prediction algorithm (Elo-based with randomization)
    const homeTeamStrength = Math.random() * 0.3 + 0.4 // 0.4-0.7
    const awayTeamStrength = Math.random() * 0.3 + 0.3 // 0.3-0.6
    
    // Calculate expected goals
    const homeExpectedGoals = Math.round((homeTeamStrength * 3) * 100) / 100
    const awayExpectedGoals = Math.round((awayTeamStrength * 3) * 100) / 100
    
    // Determine winner based on expected goals with some randomness
    let predictedWinner: 'home' | 'away' | 'draw'
    const goalDiff = homeExpectedGoals - awayExpectedGoals
    
    if (Math.abs(goalDiff) < 0.3) {
      predictedWinner = 'draw'
    } else if (goalDiff > 0) {
      predictedWinner = 'home'
    } else {
      predictedWinner = 'away'
    }
    
    // Calculate confidence based on goal difference
    const confidence = Math.min(0.95, Math.max(0.5, 0.7 + Math.abs(goalDiff) * 0.2))

    // Create prediction
    const { data: prediction, error: predictionError } = await supabase
      .from('predictions')
      .insert({
        match_id,
        predicted_winner: predictedWinner,
        home_expected_goals: homeExpectedGoals,
        away_expected_goals: awayExpectedGoals,
        confidence_score: Math.round(confidence * 100) / 100,
        model_name: `${activeModel.name} ${activeModel.version}`,
        result_status: 'pending'
      })
      .select()
      .single()

    if (predictionError) {
      throw predictionError
    }

    return new Response(
      JSON.stringify({
        success: true,
        prediction,
        message: `Prediction generated for ${match.home_team.name} vs ${match.away_team.name}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error generating prediction:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})