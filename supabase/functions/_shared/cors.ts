/**
 * Shared CORS headers for all edge functions
 * Used to allow cross-origin requests from the client application
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
