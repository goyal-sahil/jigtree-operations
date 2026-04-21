/**
 * Cost lookup against the model_pricing table.
 * Each pricing row has a modelPattern (substring of the full model ID),
 * an effectiveFrom date, and an optional effectiveTo date (null = active).
 *
 * To update pricing: set effectiveTo on the expiring row, insert a new row.
 * Edit directly in Prisma Studio or via SQL in the Supabase console.
 */

export interface PricingRow {
  modelPattern:    string
  inputCostPer1M:  number
  outputCostPer1M: number
  effectiveFrom:   Date
  effectiveTo:     Date | null
}

export interface RunCost {
  inputCostUsd:  number | null
  outputCostUsd: number | null
  totalCostUsd:  number | null
}

/**
 * Find the pricing row that matches a model ID at a given run date.
 * Matches if modelPattern is a substring of modelId AND the run date
 * falls within [effectiveFrom, effectiveTo).
 */
export function findPricing(
  modelId:  string,
  runDate:  Date,
  rows:     PricingRow[],
): PricingRow | null {
  const lower = modelId.toLowerCase()
  return rows.find(r => {
    if (!lower.includes(r.modelPattern.toLowerCase())) return false
    if (runDate < r.effectiveFrom) return false
    if (r.effectiveTo && runDate >= r.effectiveTo) return false
    return true
  }) ?? null
}

export function computeCost(
  inputTokens:  number | null,
  outputTokens: number | null,
  pricing:      PricingRow | null,
): RunCost {
  if (!pricing || inputTokens == null || outputTokens == null) {
    return { inputCostUsd: null, outputCostUsd: null, totalCostUsd: null }
  }
  const inputCostUsd  = (inputTokens  / 1_000_000) * pricing.inputCostPer1M
  const outputCostUsd = (outputTokens / 1_000_000) * pricing.outputCostPer1M
  return { inputCostUsd, outputCostUsd, totalCostUsd: inputCostUsd + outputCostUsd }
}

export function formatCostUsd(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n === 0)   return '$0.00'
  if (n < 0.001) return `$${n.toFixed(6)}`
  if (n < 0.01)  return `$${n.toFixed(4)}`
  return `$${n.toFixed(3)}`
}
