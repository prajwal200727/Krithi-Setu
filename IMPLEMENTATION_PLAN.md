# Implementation Plan: KrishiSetu (Direct Market-Access Platform)

**PS 1.2: Direct market access for marginal farmers in Dakshina Kannada & Udupi.**

## 1. Goal and Scope
**Goal:** Let a small farmer list produce in under 60 seconds, and let a buyer discover it, see whether the price is fair against public mandi prices, and contact the farmer directly, with no middleman commission.

### In Scope (MVP)
- Farmer and buyer sign-up and login (phone OTP with demo mock mode)
- Farmer creates and manages produce listings (<60s)
- Buyer browses and searches listings with filters (crop, taluk, price, quantity)
- Mandi price ingestion (Agmarknet via data.gov.in) with cached fallback dataset (30-day realistic prices)
- Price transparency:
  - "vs. mandi" fair-price badge on every listing
  - Price comparison view (Asking vs Mandi min / modal / max)
  - 30-day trend chart
- Buyer sends offer or enquiry. Farmer accepts, counters or declines. Contact details revealed after acceptance.
- English and Kannada UI, mobile-first PWA.

### Out of Scope (Roadmap)
Online payments and escrow, logistics & transport booking, AI quality grading, WhatsApp bot, native app.

## 2. Target Users & Assumptions
- **Marginal farmer (<2 ha):** Low-end Android, patchy 3G, limited literacy in English. Kannada-first, big buttons, icon-led, few fields, optional photo, PWA.
- **Small buyer (retailer, hotel, processor, aggregator):** Wants quantity, freshness, and fair price. Filters, price benchmark, direct call or WhatsApp.

**Focus Crops:** Arecanut, Coconut, Cashew, Pepper, Banana, Rubber, Jackfruit, Vegetables (Mattu Gulla brinjal, ladies finger, cucumber), Mango, Pineapple.  
**Taluks:** Mangaluru, Bantwal, Puttur, Sullia, Belthangady, Moodbidri, Mulki, Kadaba, Udupi, Kundapura, Karkala, Kapu, Byndoor, Brahmavara, Hebri.

## 3. Fair-Price Logic
```
benchmark = modal price (7-day median) of the nearest reporting mandi, converted to the listing's unit
delta% = (asking - benchmark) / benchmark * 100

delta <= -5%        -> "Below market"  (green, good for buyers)
-5% < delta <= +5%  -> "Fair price"    (blue)
delta > +5%         -> "Above market"  (amber)
no data             -> "No benchmark"  (grey)
```
