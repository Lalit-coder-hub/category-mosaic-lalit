

# Mosaic Next Big Product Radar — Implementation Plan

## Overview
A consulting-grade intelligence dashboard for wellness trend analysis in India. Dark navy theme, clean analytical UI, CSV-driven scoring engine.

## Design System
- Background: `#0B1220`, panels: `#111827`, accent: `#14B8A6` (teal)
- Font: Inter, generous spacing, no animations beyond subtle fades
- Professional, boardroom-ready aesthetic

## Layout
- **Persistent left sidebar** (220px): Dashboard, Upload Data, Methodology links with teal active indicator
- **Main content area** fills remaining width

## Page 1: Dashboard
- **Header**: Title + subtitle + Upload CSV button (opens modal)
- **4 summary cards**: Trends Analyzed, Tier 1 Signals, Avg Opportunity Score, Highest Growth Signal — all computed from data
- **Ranked Opportunity Table**: Rank, Trend Name, Score (horizontal bar), Tier badge, Growth %, Competition Intensity, Time-to-Mainstream. Sorted by score descending. Rows are clickable → navigate to detail view
- Tier badges: Tier 1 solid teal, Tier 2 outlined teal, Tier 3 grey outline, Tier 4 muted grey

## Page 2: Trend Detail View
- **Header**: Trend name, category, overall score + tier badge, back button
- **Executive Summary**: Auto-generated analytical paragraph based on the trend's data
- **Score Breakdown Table**: Search Growth (35%), Social Signals (25%), Commercial Intent (20%), Signal Consistency (20%) — raw values, weighted contributions, mini bars, formula shown
- **Signal Evidence**: Bullet list with Google Trends growth %, Reddit mentions, YouTube mentions, Amazon product count, price band
- **White Space Analysis**: Competition density, market gap, brand penetration, regulatory signals
- **Strategic Recommendation**: SKU format, target segment, price band, first-mover window, GTM angle
- **Risk Considerations**: Fad risk, supply chain, regulatory, overcrowding

## Page 3: Methodology
- Expandable panel or dedicated page explaining the weighted multi-factor model, normalization logic, and spike-vs-sustained-trend distinction

## CSV Upload & Scoring Engine
- Accepts CSV with columns: keyword, month1, month2, month3, reddit_mentions, amazon_search
- Deterministic scoring: calculates growth velocity, normalizes across trends, applies weights, assigns tiers
- Handles division-by-zero (month1=0) and missing values (warning panel)
- On upload: recalculates all scores, re-ranks, updates tiers

## Default Data
- 8 realistic Indian wellness trends pre-loaded (e.g., Ashwagandha Gummies, Collagen Peptides, Gut Health Probiotics, Adaptogens, etc.) with sample metrics

## Interactions
- Hover on score bars → tooltip with numeric breakdown
- Row click → smooth transition to detail view
- Back button on detail page

