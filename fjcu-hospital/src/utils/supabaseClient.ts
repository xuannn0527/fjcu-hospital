import { createClient } from '@supabase/supabase-js'

// 注意：Vite 專案讀取環境變數需使用 import.meta.env，且變數名稱需以 VITE_ 開頭
const supabaseUrl='https://xbrtibieffiummxnrtds.supabase.co'
const supabaseAnonKey='sb_publishable_vne8tVEpKGmZK3ss67dWUg_bzHEkdXc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)