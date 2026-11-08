import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cdiuboyklymirssxperd.supabase.co'
const supabaseKey = 'sb_publishable_WkUnC5ElLD9xRbhzG_OKFw_13gOTwGk'

export const supabase = createClient(supabaseUrl, supabaseKey)
