import fs from 'fs';
import path from 'path';
import { MandiRecord, computeBenchmark, MandiBenchmarkResult } from '../pricing/benchmark';
import { CommodityUnit } from '../pricing/unit-converter';

export interface Listing {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  commodity_id: number;
  commodity_slug: string;
  commodity_name: string;
  commodity_name_kn: string;
  variety: string;
  quantity: number;
  unit: CommodityUnit;
  asking_price: number;
  taluk: string;
  district: string;
  village?: string;
  photo_url?: string;
  description?: string;
  available_until?: string;
  status: 'active' | 'sold' | 'expired';
  created_at: string;
  benchmark?: MandiBenchmarkResult | null;
}

export interface Offer {
  id: string;
  listing_id: string;
  listing?: Listing;
  buyer_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_business?: string;
  offered_price: number;
  quantity: number;
  note?: string;
  status: 'pending' | 'accepted' | 'countered' | 'declined' | 'withdrawn';
  counter_price?: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  role: 'farmer' | 'buyer';
  full_name: string;
  phone: string;
  district: 'Dakshina Kannada' | 'Udupi';
  taluk: string;
  village?: string;
  business_name?: string;
  language: 'kn' | 'en';
  avatar?: string;
  bio?: string;
}

// In-memory singletons to allow demo actions (adding produce, making offers, accepting offers)
let inMemoryListings: Listing[] | null = null;
let inMemoryOffers: Offer[] | null = null;
let inMemoryMandiRecords: MandiRecord[] | null = null;

function loadMandiPricesFromCsv(): MandiRecord[] {
  if (inMemoryMandiRecords) return inMemoryMandiRecords;

  try {
    const csvPath = path.join(process.cwd(), 'data', 'mandi_seed.csv');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());

    const records: MandiRecord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map(c => c.trim());
      records.push({
        commodity: cols[0],
        variety: cols[1],
        market: cols[2],
        district: cols[3],
        arrival_date: cols[4],
        min_price: parseFloat(cols[5]) || 0,
        max_price: parseFloat(cols[6]) || 0,
        modal_price: parseFloat(cols[7]) || 0,
      });
    }
    inMemoryMandiRecords = records;
    return records;
  } catch (err) {
    console.error('Failed to load mandi_seed.csv:', err);
    return [];
  }
}

export function getMandiRecords(): MandiRecord[] {
  return loadMandiPricesFromCsv();
}

export function getCommodities() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'commodities.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

export function getMarkets() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'markets.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

export function getTaluks() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'taluks.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

export function getUsers(): UserProfile[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'demo_users.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

export function getAllListings(): Listing[] {
  if (!inMemoryListings) {
    try {
      const filePath = path.join(process.cwd(), 'data', 'demo_listings.json');
      inMemoryListings = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      inMemoryListings = [];
    }
  }

  // Attach benchmark to each listing
  const mandiRecords = getMandiRecords();
  return (inMemoryListings || []).map(listing => {
    const benchmark = computeBenchmark(
      listing.commodity_slug,
      listing.taluk,
      listing.unit,
      mandiRecords,
      listing.asking_price
    );
    return {
      ...listing,
      benchmark,
    };
  });
}

export function getListingById(id: string): Listing | null {
  const listings = getAllListings();
  return listings.find(l => l.id === id) || null;
}

export function createListing(data: Omit<Listing, 'id' | 'created_at' | 'status'>): Listing {
  const listings = getAllListings();
  const newListing: Listing = {
    ...data,
    id: `list-${Date.now()}`,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  inMemoryListings = [newListing, ...listings];
  return newListing;
}

export function updateListing(id: string, updates: Partial<Listing>): Listing | null {
  const listings = getAllListings();
  const index = listings.findIndex(l => l.id === id);
  if (index === -1) return null;

  const updated = { ...listings[index], ...updates };
  listings[index] = updated;
  inMemoryListings = [...listings];
  return updated;
}

export function deleteListing(id: string): boolean {
  const listings = getAllListings();
  inMemoryListings = listings.filter(l => l.id !== id);
  return true;
}

export function getAllOffers(): Offer[] {
  if (!inMemoryOffers) {
    try {
      const filePath = path.join(process.cwd(), 'data', 'demo_offers.json');
      inMemoryOffers = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      inMemoryOffers = [];
    }
  }

  const listings = getAllListings();
  return (inMemoryOffers || []).map(offer => ({
    ...offer,
    listing: listings.find(l => l.id === offer.listing_id),
  }));
}

export function createOffer(data: Omit<Offer, 'id' | 'status' | 'created_at' | 'updated_at'>): Offer {
  const offers = getAllOffers();
  const newOffer: Offer = {
    ...data,
    id: `off-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const listings = getAllListings();
  newOffer.listing = listings.find(l => l.id === data.listing_id);

  inMemoryOffers = [newOffer, ...offers];
  return newOffer;
}

export function updateOfferStatus(
  id: string,
  status: Offer['status'],
  counterPrice?: number
): Offer | null {
  const offers = getAllOffers();
  const index = offers.findIndex(o => o.id === id);
  if (index === -1) return null;

  const updated: Offer = {
    ...offers[index],
    status,
    counter_price: counterPrice ?? offers[index].counter_price,
    updated_at: new Date().toISOString(),
  };

  offers[index] = updated;
  inMemoryOffers = [...offers];
  return updated;
}
