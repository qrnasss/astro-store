import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rntzcvksklkimqdyeswg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHpjdmtza2xraW1xZHllc3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTIzNTEsImV4cCI6MjA2MDIyODM1MX0.GvJX2RkniVxLQ9OJUf5Xe2AIjuBWKHRFnVnBCWdcosw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 