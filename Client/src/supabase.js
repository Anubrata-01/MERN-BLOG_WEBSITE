
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qrfnfsrxkqpwhrbjaoly.supabase.co'
const supabaseKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZm5mc3J4a3Fwd2hyYmphb2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMzU3NDcsImV4cCI6MjA1MzYxMTc0N30.anekcHIL9HwyUCBYWO4jIbGauoljIe9wz9NmDjh95LE"

export const supabase = createClient(supabaseUrl, supabaseKey)

