export interface CityData {
  id: string;
  name: string;
  country: string;
  thesis: string;
  targetBuyer: string;
  avgPricing: string;
  rentalYield: string;
  positioning: 'Luxury' | 'Growth' | 'Balanced';
  infraGrowth: string;
  relevance: string;
  image: string;
}

export const cities: CityData[] = [
  // UAE
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    thesis: 'The global capital of real estate liquidity, branded urban development, and institutional-grade off-plan pipelines.',
    targetBuyer: 'Ultra-HNWIs, Global Investors, Digital Nomads',
    avgPricing: '$400 - $1,200+ per sq.ft',
    rentalYield: '5–8% (Net)',
    positioning: 'Luxury',
    infraGrowth: 'Urban Masterplan 2040, expansion of Al Maktoum Airport.',
    relevance: 'Golden Visa path, 100% foreign ownership, strategic time-zone hub.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi',
    country: 'UAE',
    thesis: 'The most institutionally stable real estate market in the UAE, driven by sovereign capital, controlled supply, and end-user demand dominance.',
    targetBuyer: 'Stability-seekers, Family Offices, Government Contractors',
    avgPricing: '$350 - $900 per sq.ft',
    rentalYield: '5–8% (Net)',
    positioning: 'Balanced',
    infraGrowth: 'Saadiyat Cultural District, Etihad Rail connectivity.',
    relevance: 'Capital status, massive sovereign wealth backing, industrial diversification.',
    image: 'https://images.unsplash.com/photo-1544644026-66487e584065?auto=format&fit=crop&q=80&w=2160'
  },
  {
    id: 'ras-al-khaimah',
    name: 'Ras Al Khaimah',
    country: 'UAE',
    thesis: 'The UAE’s fastest-emerging lifestyle and tourism-driven real estate market, led by hospitality expansion and beachfront resort development.',
    targetBuyer: 'Leisure Investors, Resort Developers',
    avgPricing: '$250 - $600 per sq.ft',
    rentalYield: '6–10% (Net potential in select assets)',
    positioning: 'Growth',
    infraGrowth: 'Wynn Al Marjan Island (Integrated Resort), Port expansions.',
    relevance: 'Favorable licensing, burgeoning tourism sector, "The Vegas of the Middle East".',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=2070'
  },
  // India
  {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'India',
    thesis: 'India’s most consistent urban growth engine, driven by IT expansion, infrastructure-linked appreciation, and structurally strong rental demand.',
    targetBuyer: 'Tech Professionals, International Investors, Venture Capitalists',
    avgPricing: '$120 - $350 per sq.ft (Prime)',
    rentalYield: '3–5% (Net Rental Yield)',
    positioning: 'Growth',
    infraGrowth: 'Peripheral Ring Road, Metro Phase 2 expansion.',
    relevance: 'IT/BPM dominance, high disposable income, steady double-digit CAGR.',
    image: 'https://images.unsplash.com/photo-1596761301586-5c502150123b?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    thesis: 'India’s most expensive and liquidity-driven real estate market, defined by extreme price compression, redevelopment cycles, and premium asset scarcity.',
    targetBuyer: 'C-Suite Executives, Industrialists, Institutional Investors',
    avgPricing: '$400 - $1,500+ per sq.ft',
    rentalYield: '2.5–4%',
    positioning: 'Luxury',
    infraGrowth: 'Transtad-Link (MTHL), Coastal Road Project.',
    relevance: 'India\'s economic gateway, most liquid market, high barriers to entry.',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=2071'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    thesis: 'India’s most balanced IT + industrial growth metro, driven by structured planning, global tech demand, and scalable residential absorption.',
    targetBuyer: 'Enterprises, Pharma Leaders, Long-term Asset Builders',
    avgPricing: '$80 - $200 per sq.ft',
    rentalYield: '3–4.5%',
    positioning: 'Growth',
    infraGrowth: 'Regional Ring Road (RRR), IT Corridor Expansion.',
    relevance: 'Eased regulatory environment, low vacancy rates in commercial hubs.',
    image: 'https://images.unsplash.com/photo-1610444391696-fa3d986e806c?auto=format&fit=crop&q=80&w=2148'
  },
  {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    thesis: 'India’s quietly compounding IT-driven real estate market, supported by strong employment corridors and stable rental ecosystems.',
    targetBuyer: 'Auto/Manufacturing Execs, Education Institutionalists',
    avgPricing: '$100 - $250 per sq.ft',
    rentalYield: '3–5%',
    positioning: 'Balanced',
    infraGrowth: 'Pune-Mumbai Hyperloop (Proposed), Metro expansion.',
    relevance: 'Strong manufacturing backbone, diversified economy, rising luxury demand.',
    image: 'https://images.unsplash.com/photo-1502209524164-abd935c1f3ec?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'gurgaon-delhi',
    name: 'Gurgaon / Delhi NCR',
    country: 'India',
    thesis: 'India’s most capital-intensive and infrastructure-driven real estate market, led by corporate demand, expressway corridors, and premium housing migration.',
    targetBuyer: 'MNC Heads, Policy Makers, Global Expatriates',
    avgPricing: '$150 - $450 per sq.ft',
    rentalYield: '3–5% (Residential) / 7–11% (Commercial potential)',
    positioning: 'Luxury',
    infraGrowth: 'Dwarka Expressway, Jewar International Airport.',
    relevance: 'North India hub, policy epicenter, massive logistics and tech growth.',
    image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=2148'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    thesis: 'India’s most stable end-user driven coastal metro, increasingly shaped by GCC expansion, industrial resilience, and disciplined price growth.',
    targetBuyer: 'Industrialists, Global Investors, Stable Yield Seekers',
    avgPricing: '$90 - $220 per sq.ft',
    rentalYield: '3.5–5% (Net Rental Yield)',
    positioning: 'Balanced',
    infraGrowth: 'Chennai-Bangalore Industrial Corridor, Metro Phase 2.',
    relevance: 'Automobile hub of India, strong manufacturing exports, high resilience.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    thesis: 'India’s premium second-home and lifestyle-driven real estate market, transitioning from tourism asset class to global lifestyle investment destination.',
    targetBuyer: 'Holiday Home Seekers, Boutique Hospitality Firms',
    avgPricing: '$150 - $500 per sq.ft (Villa Plots)',
    rentalYield: '4–6% (Net Rental Yield, tourism-dependent)',
    positioning: 'Luxury',
    infraGrowth: 'Mopa International Airport opening, improved road network.',
    relevance: 'Preferred second-home destination, high resale value in gated communities.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1974'
  },
  // Southeast Asia
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Southeast Asia',
    thesis: 'Asia’s premier institutional capital and wealth management hub, defined by regulatory stability, asset protection, and ultra-prime real estate positioning.',
    targetBuyer: 'Institutional Investors, Ultra-HNWIs, Global Family Offices',
    avgPricing: '$1,800 - $4,000+ per sq.ft',
    rentalYield: '2–4%',
    positioning: 'Luxury',
    infraGrowth: 'Greater Southern Waterfront, Tuas Mega Port, Changi T5.',
    relevance: 'Safe haven status, strict supply control, global headquarters hub.',
    image: 'https://images.unsplash.com/photo-1525596662741-e94ff9926de3?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'thailand',
    name: 'Thailand',
    country: 'Southeast Asia',
    thesis: 'One of Asia’s most established tourism and hospitality-driven property markets, combining lifestyle demand with regional business expansion.',
    targetBuyer: 'Retirees, Digital Nomads, Regional High-Net-Worths',
    avgPricing: '$400 - $1,100 per sq.ft',
    rentalYield: '4–8%',
    positioning: 'Balanced',
    infraGrowth: 'EEC High-Speed Rail, new MRT lines expansion.',
    relevance: 'World-class healthcare, relative value in luxury segment, high quality of life.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579367?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    country: 'Southeast Asia',
    thesis: 'Southeast Asia’s largest domestic consumption economy, driven by urban expansion, industrial relocation, and long-term infrastructure transformation.',
    targetBuyer: 'Lifestyle Investors, Hospitality Operators, Villa Seekers',
    avgPricing: '$150 - $400 per sq.ft (Long leasehold)',
    rentalYield: '4–7%',
    positioning: 'Growth',
    infraGrowth: 'North Bali Airport (Proposed), improved road infrastructure.',
    relevance: 'Highest tourism demand in region, emerging luxury villa market, digital nomad icon.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    country: 'Southeast Asia',
    thesis: 'Southeast Asia’s fastest-scaling manufacturing and export-driven economy, supported by industrial expansion and rising foreign direct investment.',
    targetBuyer: 'FDI-led Investors, Manufacturing Executives, Growth Seekers',
    avgPricing: '$300 - $800 per sq.ft',
    rentalYield: '4–7%',
    positioning: 'Growth',
    infraGrowth: 'Metro Line 1 completion, Long Thanh International Airport.',
    relevance: 'FDI destination, booming middle class, high appreciation potential.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'sri-lanka',
    name: 'Sri Lanka',
    country: 'Southeast Asia',
    thesis: 'A frontier investment market undergoing economic stabilisation, with long-term tourism, logistics, and coastal development potential.',
    targetBuyer: 'Value Investors, Boutique Hospitality Brands, Second Home Owners',
    avgPricing: '$150 - $450 per sq.ft',
    rentalYield: '4–7%',
    positioning: 'Growth',
    infraGrowth: 'Colombo Port City (Financial District development), Highway expansions.',
    relevance: 'Deep value play, strategic Indian Ocean location, tourism recovery.',
    image: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?auto=format&fit=crop&q=80&w=2070'
  }
];
