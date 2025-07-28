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

    // Get all finished matches with predictions that need evaluation
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        *,
        predictions!inner(*)
      `)
      .eq('status', 'finished')
      .not('home_goals', 'is', null)
      .not('away_goals', 'is', null)

    if (matchesError) {
      throw matchesError
    }

    console.log(`Found ${matches.length} finished matches to evaluate`)

    let updatedCount = 0

    for (const match of matches) {
      for (const prediction of match.predictions) {
        if (prediction.result_status !== 'pending') {
          continue // Already evaluated
        }

        // Determine actual winner
        let actualWinner: 'home' | 'away' | 'draw'
        if (match.home_goals > match.away_goals) {
          actualWinner = 'home'
        } else if (match.away_goals > match.home_goals) {
          actualWinner = 'away'
        } else {
          actualWinner = 'draw'
        }

        // Compare with prediction
        const isCorrect = prediction.predicted_winner === actualWinner
        const resultStatus = isCorrect ? 'correct' : 'wrong'

        // Update prediction result
        const { error: updateError } = await supabase
          .from('predictions')
          .update({ result_status: resultStatus })
          .eq('id', prediction.id)

        if (updateError) {
          console.error(`Error updating prediction ${prediction.id}:`, updateError)
          continue
        }

        updatedCount++
        console.log(`Updated prediction ${prediction.id}: ${resultStatus}`)
      }
    }

    // Calculate overall accuracy for active model
    const { data: activeModel } = await supabase
      .from('models')
      .select('*')
      .eq('is_active', true)
      .single()

    if (activeModel) {
      const { data: modelPredictions } = await supabase
        .from('predictions')
        .select('result_status')
        .eq('model_name', `${activeModel.name} ${activeModel.version}`)
        .neq('result_status', 'pending')

      if (modelPredictions && modelPredictions.length > 0) {
        const correctPredictions = modelPredictions.filter(p => p.result_status === 'correct').length
        const accuracy = Math.round((correctPredictions / modelPredictions.length) * 10000) / 100

        await supabase
          .from('models')
          .update({ accuracy })
          .eq('id', activeModel.id)

        console.log(`Updated model accuracy: ${accuracy}%`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        evaluatedPredictions: updatedCount,
        message: `Successfully evaluated ${updatedCount} predictions`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error evaluating predictions:', error)
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