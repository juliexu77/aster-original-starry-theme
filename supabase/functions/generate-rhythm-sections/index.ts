import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Activity {
  id: string;
  type: string;
  time: string;
  logged_at: string;
  duration?: number;
  amount?: number;
  unit?: string;
  details?: any;
}

interface MetricDelta {
  name: string;
  change: string;
  rawDelta?: number;
  priority?: number;
  context?: string;
}

interface Insight {
  type: string;
  delta: string;
  rawValue?: number;
  priority?: number;
  context?: string;
}

// Replicate frontend date filtering logic (simple UTC→local conversion)
function getActivityDateKey(activity: Activity): string {
  // Convert UTC timestamp to local Date, then extract YYYY-MM-DD
  const activityDate = new Date(activity.logged_at);
  const year = activityDate.getFullYear();
  const month = String(activityDate.getMonth() + 1).padStart(2, '0');
  const day = String(activityDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Aggregates activities by date
function aggregateActivities(activities: Activity[]): { [date: string]: Activity[] } {
  const aggregated: { [date: string]: Activity[] } = {};
  activities.forEach(activity => {
    const dateKey = getActivityDateKey(activity);
    if (!aggregated[dateKey]) {
      aggregated[dateKey] = [];
    }
    aggregated[dateKey].push(activity);
  });
  return aggregated;
}

// Computes total time and money spent for a given day
function computeDailyTotals(activities: Activity[]): { time: number; money: number } {
  let time = 0;
  let money = 0;

  activities.forEach(activity => {
    if (activity.type === 'time') {
      time += activity.duration || 0;
    } else if (activity.type === 'money') {
      money += activity.amount || 0;
    }
  });

  return { time, money };
}

// Generates metric deltas based on activity data
function generateMetricDeltas(aggregatedActivities: { [date: string]: Activity[] }): MetricDelta[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayKey = getDateKey(today);
  const yesterdayKey = getDateKey(yesterday);

  const todayTotals = computeDailyTotals(aggregatedActivities[todayKey] || []);
  const yesterdayTotals = computeDailyTotals(aggregatedActivities[yesterdayKey] || []);

  const timeDelta = todayTotals.time - yesterdayTotals.time;
  const moneyDelta = todayTotals.money - yesterdayTotals.money;

  const deltas: MetricDelta[] = [];

  deltas.push({
    name: 'Time Spent',
    change: `${timeDelta >= 0 ? '+' : ''}${timeDelta} minutes`,
    rawDelta: timeDelta,
    priority: 1,
    context: 'Compared to yesterday',
  });

  deltas.push({
    name: 'Money Spent',
    change: `$${moneyDelta >= 0 ? '+' : ''}${moneyDelta}`,
    rawDelta: moneyDelta,
    priority: 2,
    context: 'Compared to yesterday',
  });

  return deltas;
}

// Generates insights based on activity data
function generateInsights(aggregatedActivities: { [date: string]: Activity[] }): Insight[] {
  const insights: Insight[] = [];

  // Example: Find the day with the most time spent
  let maxTime = 0;
  let maxTimeDate = '';
  for (const date in aggregatedActivities) {
    const { time } = computeDailyTotals(aggregatedActivities[date]);
    if (time > maxTime) {
      maxTime = time;
      maxTimeDate = date;
    }
  }

  if (maxTime > 0) {
    insights.push({
      type: 'Max Time Spent',
      delta: `${maxTime} minutes`,
      rawValue: maxTime,
      priority: 3,
      context: `On ${maxTimeDate}`,
    });
  }

  return insights;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');

    if (!fromDate || !toDate) {
      return new Response(JSON.stringify({ error: 'Missing fromDate or toDate parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase URL or Key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    // Fetch activities within the specified date range
    const { data: activities, error } = await supabaseClient
      .from('activities')
      .select('*')
      .gte('logged_at', fromDate)
      .lte('logged_at', toDate);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Aggregate activities by date
    const aggregatedActivities = aggregateActivities(activities);

    // Generate metric deltas and insights
    const metricDeltas = generateMetricDeltas(aggregatedActivities);
    const insights = generateInsights(aggregatedActivities);

    // Structure the response
    const responseBody = {
      metricDeltas,
      insights,
      aggregatedActivities,
    };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Unhandled error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
