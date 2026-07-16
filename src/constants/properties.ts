export interface Property {
  id: string;
  name: string;
  location: string;
  country: 'UAE' | 'India' | 'Southeast Asia';
  image: string;
  images?: string[];
  type?: string;
  startingPrice: string;
  developer: {
    name: string;
    credibility: string;
  };
  highlights: string[];
  description?: string;
  paymentPlan?: string;
  recommendationLevel?: string;
  handoverTime?: string;
  status: string;
}

export const properties: Property[] = [
  {
    id: 'prop-1',
    name: 'The Opus Tower',
    location: 'Business Bay, Dubai',
    country: 'UAE',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1582656622383-35d20739ba64?auto=format&fit=crop&q=80&w=2070',
    startingPrice: 'AED 2,450,000',
    developer: {
      name: 'Omniyat',
      credibility: 'Award-winning developer known for architectural masterpieces.'
    },
    highlights: ['Prime Business Hub', 'Zaha Hadid Design', 'High Capital Appreciation'],
    description: 'Designed by Dame Zaha Hadid, The Opus is an iconic landmark in Dubai\'s prestigious Business Bay.',
    paymentPlan: '60/40 Post-handover plan',
    recommendationLevel: 'Strongly Recommended',
    handoverTime: 'Completed',
    status: 'Available'
  },
  {
    id: 'prop-2',
    name: 'Emaar Beachfront',
    location: 'Dubai Marina',
    country: 'UAE',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1541339902294-12e006a13344?auto=format&fit=crop&q=80&w=2069',
    startingPrice: 'AED 3,100,000',
    developer: {
      name: 'Emaar Properties',
      credibility: 'Largest developer in the region, builder of Burj Khalifa.'
    },
    highlights: ['Private Beach Access', 'Miami-style Living', 'Premium ROI'],
    description: 'Exclusive private island living at the heart of Dubai Harbour with panoramic sea views.',
    paymentPlan: '70/30 During construction',
    recommendationLevel: 'Highly Recommended',
    handoverTime: 'Q4 2026',
    status: 'Available'
  }
];
