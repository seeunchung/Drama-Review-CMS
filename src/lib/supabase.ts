import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경 변수 누락 시 경고를 띄워 개발자가 알 수 있게 합니다.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.'
  )
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)
