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
  // Kayako returns the user's organization when include=user expands the requester
  organization?: {
    id?: number
    name?: string
    title?: string
    titles?: Array<{ translation?: string }>
  }
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

export interface KayakoOrganization {
  id: number
  name?: string
  // Kayako sometimes returns the org name under these alternative fields
  title?: string
  titles?: Array<{ translation?: string }>
}

export interface KayakoBrand {
  id: number
  name?: string
  titles?: Array<{ translation?: string }>
}

export interface KayakoCase {
  id: number
  subject: string
  status:   { id: number; label?: string; name?: string }
  priority: { id: number; label?: string; name?: string }
  requester:      KayakoUser
  assigned_agent: KayakoUser | null
  assigned_team:  { id: number; title?: string; name?: string } | null
  organization?:  KayakoOrganization
  brand?:         KayakoBrand
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
  is_private?: boolean
  // Fields returned by Kayako v1 posts endpoint (no include needed)
  source_channel?: { type?: string; uuid?: string } | null
  original?: { id?: number; resource_type?: string } | null
  is_requester?: boolean
}

// ── Unified post shape (from ticket_posts DB table) ───────────────────────

export interface UnifiedPost {
  id:           string         // DB UUID
  kayakoPostId: number
  contents:     string
  channel:      string | null
  isPrivate:    boolean
  creatorId:    number | null  // Kayako user ID — used for customer identification
  creatorName:  string | null
  postedAt:     string | null
}

// ── AI Analysis ───────────────────────────────────────────────────────────

export interface AnalysisSections {
  // Closure Brief (new — only present on analyses run after the redesign)
  one_liner?:        string
  blocker_type?:     string
  blocker_detail?:   string
  path_to_closure?:  string
  // Core sections (always present)
  case_summary:       string
  customer_sentiment: string
  what_needed:        string
  next_steps:         string
}

export interface AnalysisResult {
  sections:       AnalysisSections
  day_summaries:  Record<string, string>
  model_used:     string
  post_count:     number
  input_tokens?:  number
  output_tokens?: number
  status:         'pending' | 'running' | 'done' | 'error'
  error_msg?:     string
  fromCache?:     boolean
  created_at?:    string
}

// ── Unified ticket row (from tickets table) ───────────────────────────────

export interface TicketRow {
  id:                string   // DB uuid
  kayakoTicketId:    number
  kayakoUrl:         string
  title:             string
  status:            string | null
  priority:          string | null
  product:           string | null
  brand:             string | null
  requesterName:     string | null
  requesterEmail:    string | null
  requesterKayakoId: number | null
  organization:      string | null
  team:              string | null
  isEscalated:       boolean
  ghiId:             string | null
  ghiStatus:         string | null
  jiraFields:        Record<string, string> | null
  // Populated from ticket_analyses join (null if not yet analysed)
  blockerType:       string | null
  oneLiner:          string | null
  lastAnalysedAt:    string | null  // ISO timestamp of last analysis run (UTC)
  holdReason:        string | null
  tags:              string[]
  assignee:          string | null
  isBuPs:            boolean
  customFields:      KayakoCustomField[] | null
  postsStatus:       string
  postsLastSyncedAt: string | null
  kayakoCreatedAt:   string | null
  kayakoUpdatedAt:   string | null
  lastSyncedAt:      string
}

// ── Export ────────────────────────────────────────────────────────────────────

export interface ExportInfo {
  status:    string   // "pending" | "running" | "done" | "error"
  createdAt: string   // ISO timestamp of last export attempt
}

// ── Analysis run row (shared between AnalysisHistory component and API responses) ─

export interface AnalysisRunRow {
  id:            string
  trigger:       string
  runType:       string | null
  modelUsed:     string | null
  postCount:     number | null
  inputTokens:   number | null
  outputTokens:  number | null
  durationMs:    number | null
  status:        string
  errorMsg:      string | null
  createdAt:     string
  inputCostUsd:  number | null
  outputCostUsd: number | null
  totalCostUsd:  number | null
  isOrphaned?:   boolean
}

// ── Ticket API response (returned by /api/ticket and /api/bu-tickets/[id]) ─

export interface TicketResponse {
  ticket:          TicketRow
  posts:           UnifiedPost[]
  fromCache:       boolean
  lastSyncedAt:    string
  warning?:        string
  cachedAnalysis?: AnalysisResult | null
  export?:         ExportInfo | null
  analysisRuns?:   AnalysisRunRow[]
}

/** @deprecated Use TicketRow instead */
export type BuPsTicketRow = TicketRow

/** @deprecated Use TicketResponse instead */
export interface TicketData {
  caseData: KayakoCase
  posts:    KayakoPost[]
  warning:  string
  caseId:   number
}
