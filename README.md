# KrishiSetu: Direct Market Access for Marginal Farmers

A lightweight, mobile-first marketplace that connects small and marginal farmers in Dakshina Kannada and Udupi directly with buyers, with transparent pricing benchmarked against public APMC mandi data.

**Hackathon Problem Statement:** PS 1.2 — Direct Market-Access Platform for Marginal Farmers

---

## 🌟 The Problem
Marginal farmers in coastal Karnataka lose a large share of their margin to middlemen because they cannot easily verify whether a price is fair against public mandi benchmarks, and they have limited access to buyers beyond their local village aggregator.

## 💡 Our Solution
| For Farmers | For Buyers |
| :--- | :--- |
| **List produce in under 60 seconds**, in Kannada | **Search and filter** by crop, taluk, price, and quantity |
| **See today's APMC mandi price** before setting yours | **"Below / Fair / Above market" badge** on every listing |
| **Direct offers inbox:** accept, counter, or decline | **30-day price trend charts** from public Agmarknet data |
| **Zero middleman commission** | **Contact farmer directly** (Call & WhatsApp) on accepted offer |

---

## 🚀 Key Features (MVP)
1. **Bilingual Karavali UI:** Kannada-first and English with 1-click instant language toggle.
2. **Fast 60-Second Farmer Publish Flow:** Low-literacy friendly, big buttons, unit chips (`kg`, `quintal`, `piece`), and live Mandi price suggestion chip.
3. **Price Transparency & Benchmarking:**
   - Real-time comparison against the 7-day median modal price of the nearest reporting APMC.
   - Dynamic badges:
     - `delta <= -5%`: **"Below market"** (Emerald)
     - `-5% < delta <= +5%`: **"Fair price"** (Sky Blue)
     - `delta > +5%`: **"Above market"** (Amber)
     - No data: **"No benchmark"** (Stone)
   - Interactive 30-day APMC historical trend line graph powered by Recharts.
4. **Direct Deals & Contact Privacy:**
   - Buyer sends offer (price, quantity, note).
   - Farmer accepts, counters, or declines.
   - Direct Call and WhatsApp deep links unlock immediately upon deal acceptance.
5. **Mandi Explorer:** Live browser across APMC markets (Puttur, Mangaluru, Udupi, Kundapura, Karkala, Sullia, Belthangady).
6. **Agmarknet Daily Feed Ingestion:** Automated daily ingestion pipeline with 100% resilient offline seed CSV fallback.
7. **PWA Ready:** Installable web app with responsive mobile-first navigation bar.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, Lucide Icons, Canvas-Confetti
- **Backend:** Next.js Route Handlers, Supabase (Postgres, Auth, Storage, RLS)
- **Data Ingestion:** Agmarknet (data.gov.in) daily feed with local CSV seed fallback
- **Localization:** Bilingual Kannada (`messages/kn.json`) and English (`messages/en.json`)

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm

### 2. Install & Configure
```bash
npm install
```

### 3. Run Unit Tests
```bash
npm test
```

### 4. Run Mandi Price Ingest Pipeline
```bash
npm run ingest:prices
```

### 5. Start Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 👥 Demo Accounts

OTP authentication is mocked for the demo with 1-click quick login buttons:

| Role | Name | Taluk | Phone | OTP |
| :--- | :--- | :--- | :--- | :--- |
| **Farmer** | Ramesh Gowda | Puttur, DK | `+91 90000 00001` | `123456` |
| **Buyer** | Praveen Pai (Pai Agro Traders) | Mangaluru, DK | `+91 90000 00002` | `123456` |

---

## 🏛️ Covered Commodities & APMC Markets

### Focus Crops
- **Arecanut (ಅಡಿಕೆ):** Chali, Bette, Koka, Rashi
- **Coconut & Tender Coconut (ತೆಂಗಿನಕಾಯಿ/ಎಳನೀರು):** Tender Coconut, Mature Coconut, Copra
- **Raw Cashew Nut (ಗೋಡಂಬಿ):** Raw with shell (Local Gola), Vengurla-4
- **Black Pepper (ಕರಿಮೆಣಸು):** Black Garbled (Panniyur-1), Ungarbled
- **Natural Rubber Sheet (ರಬ್ಬರ್ ಹಾಳೆ):** RSS-4 Grade, RSS-5 Grade
- **Banana (ಬಾಳೆಹಣ್ಣು):** Elakki / Yelakki, Robusta, Nendran
- **Vegetables (ತರಕಾರಿಗಳು):** Mattu Gulla Brinjal (GI tagged), Mangalore Cucumber, Bhendi
- **Fruits (ಹಣ್ಣುಗಳು):** Mundappa Mango, Queen Pineapple, Jackfruit

### Target Taluks & APMCs
- **Dakshina Kannada:** Puttur APMC, Mangaluru APMC, Sullia APMC, Bantwal APMC, Belthangady APMC, Moodbidri, Mulki, Kadaba
- **Udupi District:** Udupi APMC, Kundapura APMC, Karkala APMC, Kapu, Byndoor, Brahmavara, Hebri

---

## 📐 How the Fair-Price Badge Works
$$\text{benchmark} = \text{7-day median modal price at nearest reporting APMC (converted to listing unit)}$$
$$\Delta\% = \frac{\text{Asking Price} - \text{Benchmark}}{\text{Benchmark}} \times 100$$

- $\Delta \le -5\% \implies$ **"Below market"** (Green, advantageous for buyers)
- $-5\% < \Delta \le +5\% \implies$ **"Fair price"** (Blue, aligned with prevailing market)
- $\Delta > +5\% \implies$ **"Above market"** (Amber, premium variety / specialty grade)
- No recent reports $\implies$ **"No benchmark"** (Grey)

---

## 🗺️ Roadmap
- [ ] Integration with CAMPCO and e-NAM exchange feeds
- [ ] Voice listing creation in Kannada using Web Speech API
- [ ] Automated SMS / IVR notifications for non-smartphone farmers
- [ ] Cooperative / FPO bulk transport pooling
- [ ] UPI Escrow payments integration
