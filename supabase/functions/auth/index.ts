import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyMessage } from "https://esm.sh/ethers@6"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    if (path === 'nonce') {
      // Generate a random 32-byte nonce
      const nonce = crypto.randomUUID()
      
      console.log('Generated nonce:', nonce)
      
      return new Response(
        JSON.stringify({ nonce }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    if (path === 'verify') {
      const { address, nonce, signature } = await req.json()
      
      console.log('Verifying signature for:', { address, nonce })
      
      // Construct the message that was signed
      const message = `UniversityDAO wants you to sign in.\nWallet address: ${address}\nNonce: ${nonce}`
      
      try {
        // Verify the signature
        const recoveredAddress = verifyMessage(message, signature)
        
        console.log('Recovered address:', recoveredAddress)
        console.log('Expected address:', address)
        
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { 
              status: 400,
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              } 
            }
          )
        }

        // Create a simple JWT payload (in production, use a proper JWT library)
        const payload = {
          address: address.toLowerCase(),
          nonce,
          exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
          iat: Math.floor(Date.now() / 1000)
        }

        // For demo purposes, we'll just base64 encode the payload
        // In production, use proper JWT signing
        const jwt = btoa(JSON.stringify(payload))

        // Save wallet connection to database
        const { data: existingConnection, error: fetchError } = await supabase
          .from('wallet_connections')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching wallet connection:', fetchError);
        } else if (existingConnection) {
          // Update existing connection
          await supabase
            .from('wallet_connections')
            .update({
              last_connected_at: new Date().toISOString(),
              connection_count: existingConnection.connection_count + 1,
              user_agent: req.headers.get('user-agent') || 'Unknown',
            })
            .eq('wallet_address', address.toLowerCase());
        } else {
          // Insert new connection
          await supabase
            .from('wallet_connections')
            .insert({
              wallet_address: address.toLowerCase(),
              user_agent: req.headers.get('user-agent') || 'Unknown',
            });
        }

        console.log('Authentication successful for:', address)

        return new Response(
          JSON.stringify({ jwt, address: address.toLowerCase() }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      } catch (error) {
        console.error('Signature verification failed:', error)
        return new Response(
          JSON.stringify({ error: 'Signature verification failed' }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        status: 404,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Auth function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})