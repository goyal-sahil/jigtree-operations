export interface KayakoUser {
  id: number
  full_name?: string
  name?: string
  email?: string
  identities?: Array<{
    resource_type?: string
    email?: string
    value?: string
  }>
  emails?: Array<{ email?: string; value?: string } | string>
}

export interface KayakoCustomField {
  id:    number
  label: string
  value: string
  type:  string
}

export interface KayakoCaseFieldDef {
  id:        number
  title:     string
  type:      string
  is_system: boolean
  options?:  Array<{
    id:     number
    tag?:   string
    values?: Array<{ locale?: string; translation?: string }>
  }>
}

export interface KayakoCase {
  id: number
  subject: string
  status:   { id: number; label?: string; name?: string }
  priority: { id: number; label?: string; name?: string }
  requester:      KayakoUser
  assigned_agent: KayakoUser | null
  assigned_team:  { id: number; title?: string; name?: string } | null
  tags: string[]
  created_at: string
  updated_at: string
  custom_fields?: KayakoCustomField[]
}

export interface KayakoPost {
  id: number
  channel: { id?: number; label?: string } | string
  creator: KayakoUser
  contents: string | string[]
  created_at: string
}

export interface AnalysisSections {
  executive_summary: string
  one_line:          string
  case_summary:      string
  customer_sentiment: string
  what_needed:       string
  next_steps:        string
}

export interface AnalysisResult {
  sections:     AnalysisSections
  day_summaries: Record<string, string>
  model_used:   string
  post_count:   number
  fromCache?:   boolean
  created_at?:  string
}

export interface TicketData {
  caseData: KayakoCase
  posts:    KayakoPost[]
  warning:  string
  caseId:   number
}
