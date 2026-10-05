import { createClient } from '@supabase/supabase-js'

// 注意：Vite 專案讀取環境變數需使用 import.meta.env，且變數名稱需以 VITE_ 開頭
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)