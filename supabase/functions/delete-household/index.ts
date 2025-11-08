import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { household_ids, admin_key } = await req.json();

    // Simple admin protection
    if (admin_key !== 'delete-households-admin-2024') {
      return new Response(
        JSON.stringify({ error: 'Invalid admin key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(household_ids) || household_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'household_ids must be a non-empty array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Deleting households:', household_ids);

    // Delete activities first (due to foreign key constraints)
    const { error: activitiesError } = await supabase
      .from('activities')
      .delete()
      .in('household_id', household_ids);

    if (activitiesError) {
      console.error('Error deleting activities:', activitiesError);
      throw activitiesError;
    }

    // Delete collaborators
    const { error: collaboratorsError } = await supabase
      .from('collaborators')
      .delete()
      .in('household_id', household_ids);

    if (collaboratorsError) {
      console.error('Error deleting collaborators:', collaboratorsError);
      throw collaboratorsError;
    }

    // Delete households
    const { error: householdsError } = await supabase
      .from('households')
      .delete()
      .in('id', household_ids);

    if (householdsError) {
      console.error('Error deleting households:', householdsError);
      throw householdsError;
    }

    console.log('Successfully deleted households:', household_ids);

    return new Response(
      JSON.stringify({ success: true, deleted_household_ids: household_ids }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in delete-household function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
