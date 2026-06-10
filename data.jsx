// Shared data, icons, and helpers

const CATEGORIES = [
  {
    id: 'mortgage', emoji: '🏡', color: '#1E3A2E',
    name: 'Mortgage or Rent',
    description: [
      'Mortgage principal and interest payments',
      'Rent payments',
      'HOA fees',
    ]
  },
  {
    id: 'utilities', emoji: '⚡', color: '#A88542',
    name: 'Utilities',
    description: [
      'Electricity',
      'Gas / Heating oil',
      'Water and sewer',
      'Trash collection',
      'Internet and phone (home portion only)',
    ]
  },
  {
    id: 'tax', emoji: '🏛️', color: '#6E2E2A',
    name: 'Property Taxes',
    description: [
      'Annual property tax payments',
      'Special assessments',
    ]
  },
  {
    id: 'insurance', emoji: '🔒', color: '#3B6A56',
    name: 'Insurance',
    description: [
      "Homeowner's or renter's insurance",
      'Flood or earthquake insurance',
      'Umbrella policy (home portion)',
    ]
  },
  {
    id: 'repairs', emoji: '🔧', color: '#8FA98E',
    name: 'Repairs & Maintenance',
    description: [
      'Plumbing, electrical, HVAC repairs',
      'Roof repairs',
      'General upkeep and maintenance',
      'Pest control',
      'Garage door repairs',
    ]
  },
  {
    id: 'furnish', emoji: '🛋️', color: '#C9A968',
    name: 'Furnishings & Appliances',
    description: [
      'Furniture purchases',
      'Kitchen appliances',
      'Washer / dryer',
      'Window treatments / blinds',
    ]
  },
  {
    id: 'decor', emoji: '🏗️', color: '#7C5E3C',
    name: 'Decor & Home Improvements',
    description: [
      'Renovations and remodeling',
      'Additions or structural improvements',
      'Accessibility modifications',
    ]
  },
  {
    id: 'yard', emoji: '🌿', color: '#506B4A',
    name: 'Yard & Grounds',
    description: [
      'Landscaping',
      'Sprinkler system maintenance',
      'Snow removal',
      'Tree trimming',
      'HOA services',
    ]
  },
  {
    id: 'other', emoji: '🧾', color: '#948A7B',
    name: 'Other Qualifying Expenses',
    description: [
      'Home security system',
      'Cleaning supplies and services',
      'Moving expenses',
      'Any other expense directly related to the home',
    ]
  },
];

const CAT_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

const SAMPLE_EXPENSES = [
  { id: 'e01', date: '2025-11-04', categoryId: 'mortgage',  description: 'November mortgage payment — principal & interest',     amount: 1842.50 },
  { id: 'e02', date: '2025-11-02', categoryId: 'utilities', description: 'Duke Energy — electric service',                       amount: 184.27 },
  { id: 'e03', date: '2025-10-29', categoryId: 'repairs',   description: 'Anderson Plumbing — water heater service & valve',     amount: 487.00 },
  { id: 'e04', date: '2025-10-22', categoryId: 'utilities', description: 'City of Greenville — water & sewer',                   amount: 92.18 },
  { id: 'e05', date: '2025-10-18', categoryId: 'furnish',   description: 'Replacement living room sofa',                          amount: 1249.00 },
  { id: 'e06', date: '2025-10-15', categoryId: 'insurance', description: 'State Farm — homeowners quarterly premium',            amount: 612.40 },
  { id: 'e07', date: '2025-10-04', categoryId: 'mortgage',  description: 'October mortgage payment — principal & interest',     amount: 1842.50 },
  { id: 'e08', date: '2025-09-30', categoryId: 'tax',       description: 'Pickens County — second-half property tax',           amount: 1486.00 },
  { id: 'e09', date: '2025-09-27', categoryId: 'yard',      description: 'Greenbrier HOA — quarterly assessment',                amount: 285.00 },
  { id: 'e10', date: '2025-09-19', categoryId: 'decor',     description: 'Sherwin Williams — interior paint, study refresh',    amount: 218.74 },
  { id: 'e11', date: '2025-09-09', categoryId: 'utilities', description: 'Piedmont Natural Gas — service',                       amount: 64.82 },
  { id: 'e12', date: '2025-09-04', categoryId: 'mortgage',  description: 'September mortgage payment',                            amount: 1842.50 },
  { id: 'e13', date: '2025-08-26', categoryId: 'repairs',   description: 'Carpenter — replaced rotted porch boards',             amount: 740.00 },
  { id: 'e14', date: '2025-08-14', categoryId: 'utilities', description: 'Duke Energy — electric service',                       amount: 226.55 },
  { id: 'e15', date: '2025-08-04', categoryId: 'mortgage',  description: 'August mortgage payment',                              amount: 1842.50 },
  { id: 'e16', date: '2025-07-22', categoryId: 'furnish',   description: 'Dining chairs, set of four',                            amount: 528.00 },
  { id: 'e17', date: '2025-07-09', categoryId: 'utilities', description: 'City of Greenville — water & sewer',                   amount: 88.40 },
  { id: 'e18', date: '2025-07-03', categoryId: 'mortgage',  description: 'July mortgage payment',                                amount: 1842.50 },
  { id: 'e19', date: '2025-06-19', categoryId: 'decor',     description: 'Window treatments — study & guest room',               amount: 412.16 },
  { id: 'e20', date: '2025-06-04', categoryId: 'mortgage',  description: 'June mortgage payment',                                amount: 1842.50 },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const fmtMoney = (n, opts = {}) => {
  const { sign = true } = opts;
  const v = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (sign ? '$' : '') + v;
};

const fmtMoneyParts = (n) => {
  const v = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [whole, cents] = v.split('.');
  return { whole: '$' + whole, cents: '.' + cents };
};

const fmtDateShort = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
const fmtDateLong = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
const fmtDateNumeric = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};
const fmtDateMonthDay = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return { mon: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), day: d.getDate() };
};

// ── Icons ──────────────────────────────────────────────────────────────────
// All currentColor; 24×24 viewBox; thin strokes.

const Icon = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.7V20h13V9.7" /><path d="M10 20v-5h4v5" />
    </svg>
  ),
  Ledger: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" /><path d="M5 4v14a2 2 0 0 0 2 2" /><path d="M9 9h7M9 13h7M9 17h4" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Report: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h7l5 5v13H7Z" /><path d="M14 3v5h5" /><path d="M10 12h6M10 16h6" />
    </svg>
  ),
  Cog: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.6-3.6" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /><path d="M14 6.5 17.5 10" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" /><path d="M10 11v6M14 11v6" />
    </svg>
  ),
  Print: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 9V3h10v6" /><path d="M7 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><rect x="7" y="14" width="10" height="7" rx="1" />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  ),
  Cross: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6 6 18 18M6 18 18 6" />
    </svg>
  ),
  Cross3: () => (
    // Simple cross/plus mark for brand
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8z"/></svg>
  ),
  Chevron: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
};

// ── Extra icons ────────────────────────────────────────────────────────────
Object.assign(Icon, {
  Bank: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 12 4l9 6" /><path d="M5 10v10M19 10v10M3 21h18" /><path d="M8 14v4M12 14v4M16 14v4" />
    </svg>
  ),
  Doc: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h8l4 4v14H7Z" /><path d="M15 3v4h4" />
    </svg>
  ),
  Receipt: ({ width = 18, height = 18 } = {}) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21Z" /><path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  ),
  Card: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6Z" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6Z" /><path d="m8.5 12 2.5 2.5L16 9.5" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z" /><path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  ),
  Sparkle: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 13.6 8.4 20 10 13.6 11.6 12 18 10.4 11.6 4 10 10.4 8.4Z"/></svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17V5M7 10l5-5 5 5M5 19h14" />
    </svg>
  ),
  Link: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14a5 5 0 0 1 0-7l3-3a5 5 0 0 1 7 7l-1.5 1.5" />
      <path d="M14 10a5 5 0 0 1 0 7l-3 3a5 5 0 0 1-7-7L5.5 11.5" />
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="17" height="16" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 14-5.3L21 9" /><path d="M21 4v5h-5" />
      <path d="M20 12a8 8 0 0 1-14 5.3L3 15" /><path d="M3 20v-5h5" />
    </svg>
  ),
  External: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="M7 16V11M11 16V7M15 16V13M19 16V9" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 14.6 9 21 9.6l-4.8 4.3L17.6 21 12 17.7 6.4 21l1.4-7.1L3 9.6 9.4 9Z"/></svg>
  ),
  Google: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path fill="#4285F4" d="M22.5 12.27c0-.78-.07-1.53-.2-2.27H12v4.3h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
      <path fill="#FBBC05" d="M5.86 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.68-2.84Z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.04l3.68 2.84C6.72 7.31 9.14 5.38 12 5.38Z"/>
    </svg>
  ),
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 12 3l9 7" /><path d="M5 9v12h14V9" /><path d="M12 6v6M9 9h6" />
    </svg>
  ),
});

// ── Banks ──────────────────────────────────────────────────────────────────
const BANKS = [
  { id: 'b1', name: 'Wells Fargo',     accountType: 'Checking · ****4218', lastSync: '2025-11-04 08:12 AM', color: '#C72030', initial: 'W' },
  { id: 'b2', name: 'First Citizens',  accountType: 'Savings · ****9047',   lastSync: '2025-11-03 11:48 PM', color: '#0B4F6C', initial: 'F' },
];

const PENDING_TXNS = [
  { id: 't1', date: '2025-11-04', desc: 'DUKE ENERGY  RECURRING PMT',        amount: 184.27, bank: 'Wells Fargo · 4218', suggestedCat: 'utilities' },
  { id: 't2', date: '2025-11-03', desc: 'HOME DEPOT #2245  GREENVILLE SC',   amount: 67.42,  bank: 'Wells Fargo · 4218', suggestedCat: 'repairs' },
  { id: 't3', date: '2025-11-02', desc: 'GREENBRIER HOA AUTOPAY',            amount: 285.00, bank: 'First Citizens · 9047', suggestedCat: 'hoa' },
  { id: 't4', date: '2025-11-01', desc: 'AMAZON.COM*RZ48G2 — Shower curtain', amount: 38.99,  bank: 'Wells Fargo · 4218', suggestedCat: 'decor' },
  { id: 't5', date: '2025-11-01', desc: 'STARBUCKS #1487 PELHAM ROAD',       amount: 6.85,   bank: 'Wells Fargo · 4218', suggestedCat: null },
  { id: 't6', date: '2025-10-31', desc: 'CITY OF GREENVILLE  WATER',         amount: 92.18,  bank: 'First Citizens · 9047', suggestedCat: 'utilities' },
];

// ── Documents ──────────────────────────────────────────────────────────────
const DOCUMENTS = [
  { id: 'd1', kind: 'receipt', name: 'duke-energy-nov.pdf',     date: '2025-11-04', size: 184_000, category: 'utilities', linked: 'Duke Energy — electric service' },
  { id: 'd2', kind: 'receipt', name: 'plumbing-invoice.jpg',    date: '2025-10-29', size: 2_140_000, category: 'repairs', linked: 'Anderson Plumbing — water heater' },
  { id: 'd3', kind: 'receipt', name: 'sofa-receipt.pdf',        date: '2025-10-18', size: 96_000, category: 'furnish',  linked: 'Replacement living room sofa' },
  { id: 'd4', kind: 'receipt', name: 'state-farm-q3.pdf',       date: '2025-10-15', size: 218_000, category: 'insurance', linked: 'State Farm homeowners' },
  { id: 'd5', kind: 'receipt', name: 'pickens-county-tax.pdf',  date: '2025-09-30', size: 142_000, category: 'tax',       linked: 'Property tax — second half' },
  { id: 'd6', kind: 'receipt', name: 'sherwin-williams.jpg',    date: '2025-09-19', size: 1_870_000, category: 'decor',  linked: 'Study paint refresh' },
  { id: 'd7', kind: 'report',  name: 'housing-allowance-2024.pdf', date: '2025-02-04', size: 412_000, category: 'reports', linked: '2024 year-end report' },
  { id: 'd8', kind: 'receipt', name: 'porch-carpenter.jpg',     date: '2025-08-26', size: 1_240_000, category: 'repairs', linked: 'Porch board repair' },
];

// ── Plans ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'trial', name: 'Free Trial',
    desc: 'Full access for 3 months. No credit card required.',
    price: 0, unit: '',
    feats: [
      'All expense tracking features',
      'Bank account syncing via Plaid',
      'Receipt storage (up to 1 GB)',
      'One year-end tax report',
    ],
    cta: 'Current plan',
  },
  {
    id: 'monthly', name: 'Monthly',
    desc: 'Flexibility to cancel anytime.',
    price: 12, unit: '/month',
    feats: [
      'Unlimited expense tracking',
      'Unlimited bank account syncing',
      'Unlimited receipt storage',
      'Year-end tax reports',
      'Email reminders & summaries',
    ],
    cta: 'Subscribe monthly',
  },
  {
    id: 'annual', name: 'Annual',
    desc: 'Pay for 10 months, use for 12.',
    price: 120, unit: '/year',
    save: 'Save $24 — two months free',
    feats: [
      'Everything in Monthly',
      'Priority customer support',
      'Early access to new features',
      'CPA-ready report formats',
    ],
    cta: 'Subscribe annually',
    featured: true,
  },
];

const INVOICES = [
  { id: 'in1', date: '2025-08-04', amount: 12.00, status: 'paid',   plan: 'Monthly · Aug 2025' },
  { id: 'in2', date: '2025-07-04', amount: 12.00, status: 'paid',   plan: 'Monthly · Jul 2025' },
  { id: 'in3', date: '2025-06-04', amount: 12.00, status: 'paid',   plan: 'Monthly · Jun 2025' },
  { id: 'in4', date: '2025-05-04', amount: 12.00, status: 'failed', plan: 'Monthly · May 2025' },
  { id: 'in5', date: '2025-04-04', amount: 12.00, status: 'paid',   plan: 'Monthly · Apr 2025' },
];

const fmtSize = (b) => {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB';
  return (b / 1024 / 1024).toFixed(1) + ' MB';
};

Object.assign(window, {
  CATEGORIES, CAT_BY_ID, SAMPLE_EXPENSES,
  BANKS, PENDING_TXNS, DOCUMENTS, PLANS, INVOICES,
  fmtMoney, fmtMoneyParts, fmtDateShort, fmtDateLong, fmtDateNumeric, fmtDateMonthDay, fmtSize,
  Icon,
});