-- Seed Anthropic model pricing for JigTree Operations Hub
-- Run this once in the Supabase SQL editor (or via Prisma Studio).
--
-- HOW TO UPDATE PRICES WHEN ANTHROPIC CHANGES RATES:
--   1. Set effectiveTo on the old row to the date the new price takes effect.
--   2. INSERT a new row with the new price and the same effectiveFrom date.
--
-- modelPattern is matched as a case-insensitive substring of the full model ID,
-- e.g. "claude-haiku-4-5" matches "claude-haiku-4-5-20251001".
--
-- Prices are USD per 1,000,000 tokens (Anthropic list price as of 2025).
-- Verify / correct at: https://www.anthropic.com/pricing

INSERT INTO model_pricing ("id", "modelPattern", "inputCostPer1M", "outputCostPer1M", "effectiveFrom", "effectiveTo", "notes")
VALUES
  (
    gen_random_uuid(),
    'claude-haiku-4-5',
    0.80,
    4.00,
    '2025-01-01T00:00:00Z',
    NULL,
    'Claude Haiku 4.5 — Anthropic list price. Update effectiveTo if pricing changes.'
  ),
  (
    gen_random_uuid(),
    'claude-sonnet-4-6',
    3.00,
    15.00,
    '2025-01-01T00:00:00Z',
    NULL,
    'Claude Sonnet 4.6 — Anthropic list price. Update effectiveTo if pricing changes.'
  )
ON CONFLICT DO NOTHING;
