import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Hilfsfunktion: Tenant-ID als Setting setzen (für RLS)
export async function withTenant(tenantId: string) {
  const client = createClient(supabaseUrl, supabaseAnonKey)
  await client.rpc('set_config', {
    setting: 'app.tenant_id',
    value: tenantId,
    is_local: true,
  })
  return client
}
