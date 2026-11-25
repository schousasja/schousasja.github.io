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
    id: "ugg93ikSiWEsxFut743D",
    name: "Taj Wellington Mews",
    location: "Jazeerat Al Marjan, Ras Al Khaimah, UAE",
    country: "UAE",
    type: "Hotel Apartment",
    image: "https://cdn.prod.website-files.com/684be37d9a9080d8dcc0e622/6998356769d898c5221452ed_68932608013209e31d211c0c_250226_BNW%2520AMBROSIA_exterior_C14_8K.jpeg",
    images: [
      "https://bnw.ae/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftajimg1.d0bea21c.jpeg&w=3840&q=75"
    ],
    startingPrice: "AED 3.1M",
    developer: {
      name: "BnW Developments",
      credibility: "Verified GCC luxury hospitality developer"
    },
    highlights: [
      "Developer-projected gross rental yield of 14–15% (not guaranteed)",
      "Managed by Taj Hotels",
      "Al Marjan Island luxury corridor"
    ],
    description: "Premium 1-bedroom hotel apartments professionally managed by Taj, offering a truly hassle-free ownership experience. Enjoy seamless property management with developer-projected gross rental yield of 14–15% (not guaranteed) and flexibility to extend lease at tenure end.",
    paymentPlan: "30:70",
    recommendationLevel: "Highly Recommended",
    handoverTime: "Q1 2028",
    status: "Under development"
  },
  {
    id: "C20i2vh0MU6fjNwzOKNC",
    name: "Greenz",
    location: "Academic City, Dubai, UAE",
    country: "UAE",
    type: "Townhouse",
    image: "https://www.dubai-sales-office.com/Projects/Danube-Properties/Danube-Greenz-Dubai/images/banner1.jpg",
    images: [
      "https://www.dubai-sales-office.com/Projects/Danube-Properties/Danube-Greenz-Dubai/images/banner1.jpg"
    ],
    startingPrice: "AED 3.6M",
    developer: {
      name: "Danube Properties",
      credibility: "Top-tier private developer with consistent on-time delivery record"
    },
    highlights: [
      "Near existing airport and Sharjah",
      "Fully furnished townhouses",
      "High rental demand hub"
    ],
    description: "Fully furnished townhouses in a premium community near Dubai Academic City, offering a balance of modern living and investment potential. Ideal for end-users seeking a ready-to-move-in home, with developer-projected capital appreciation over the next 4–5 years (estimates, not guaranteed).",
    paymentPlan: "70:30",
    recommendationLevel: "Recommended",
    handoverTime: "48 months",
    status: "INVESTMENT READY"
  },
  {
    id: "O0pbe4PJe82cLBQ1LUcO",
    name: "Binghatti Tilal",
    location: "Academic city, Dubai, UAE",
    country: "UAE",
    type: "Townhouse",
    image: "https://promotions.binghatti.com/wp-content/uploads/2026/05/Tilal_Binghatti_Masterplan.webp",
    images: [
      "https://promotions.binghatti.com/wp-content/uploads/2026/05/Tilal_Binghatti_Night_View.webp"
    ],
    startingPrice: "AED 4.2M",
    developer: {
      name: "Binghatti Developers",
      credibility: "Iconic design-led developer recognized globally"
    },
    highlights: [
      "Near existing airport and Sharjah",
      "Signature modern architecture",
      "Family-centric master community"
    ],
    description: "Premium townhouses in a thoughtfully planned community near Dubai Academic City, offering a blend of family living and investment potential. Positioned in a high-growth corridor, the project is ideal for end-users while offering developer-projected capital appreciation over the next 4–5 years (estimates, not guaranteed).",
    paymentPlan: "70:30",
    recommendationLevel: "Recommended",
    handoverTime: "24 months",
    status: "Under development"
  },
  {
    id: "YPCefFcfF6XqYWcjVFao",
    name: "Sobha Central",
    location: "Sheikh Zayed Road, Dubai, UAE",
    country: "UAE",
    type: "Apartment",
    image: "https://sobharealty.com/sites/default/files/styles/webp/public/2025-05/Banner%201440x726.jpg.webp?itok=mmF6ygLI",
    images: [
      "https://sobharealty.com/sites/default/files/styles/webp/public/2025-05/Banner%201440x726.jpg.webp?itok=mmF6ygLI",
      "https://sobharealty.com/sites/default/files/styles/webp/public/2026-01/The%20Pinnacle.jpg.webp?itok=lSMKAzCZ"
    ],
    startingPrice: "AED 2.7M",
    developer: {
      name: "SOBHA Realty",
      credibility: "In-house design and construction with backward integration quality standards"
    },
    highlights: [
      "Prime Sheikh Zayed Road corridor",
      "Integrated commercial & retail podium",
      "High yield potential"
    ],
    description: "Featuring premium 2-bedroom apartments across residential towers rising from 45 to 110 stories. The project integrates ground-floor retail with commercial office tower, creating a dynamic live-work-shop environment.",
    paymentPlan: "40:60",
    recommendationLevel: "Recommended",
    handoverTime: "Q4 2028",
    status: "Under development"
  },
  {
    id: "bHD0gACRX8YdR6hrUNeP",
    name: "Shahrukhz",
    location: "Sheikh Zayed Road, Dubai, UAE",
    country: "UAE",
    type: "Commercial Office",
    image: "https://static.propsearch.ae/dubai-locations/shahrukhz-by-danube_Ceedi_xl.jpg",
    images: [
      "https://static.propsearch.ae/dubai-locations/shahrukhz-by-danube_Ceedi_xl.jpg"
    ],
    startingPrice: "AED 2.5-3M",
    developer: {
      name: "Danube Properties",
      credibility: "Established GCC developer with fast-track delivery"
    },
    highlights: [
      "Last 5-6 units left under cancellation",
      "Rooftop air taxi helipad",
      "Grade-A office suites"
    ],
    description: "Shahrukhz is a Grade A, celebrity-branded commercial tower rising 55 stories, featuring fully furnished premium offices and over 36 world-class amenities—including a rooftop air taxi helipad and an exclusive sky pool.",
    paymentPlan: "50:50",
    recommendationLevel: "Strongly Recommended",
    handoverTime: "Q2 2029",
    status: "Under development"
  },
  {
    id: "mPBBZWCXXxEVv9eMN9N4",
    name: "Azizi Wasel",
    location: "Nakhlat Deira - Front, Dubai, UAE",
    country: "UAE",
    type: "Apartment",
    image: "https://static.propsearch.ae/dubai-locations/azizi-wasel_qEi7a_xl.jpg",
    images: [
      "https://static.propsearch.ae/dubai-locations/azizi-wasel_qEi7a_xl.jpg"
    ],
    startingPrice: "AED 2.5M",
    developer: {
      name: "AZIZI Developments",
      credibility: "Major private developer in Dubai with extensive waterfront portfolio"
    },
    highlights: [
      "Prime waterfront corner plot",
      "Burj Khalifa skyline panoramic views",
      "Limited remaining inventory"
    ],
    description: "Premium 1-bedroom residences on a prime waterfront corner plot, offering breathtaking views of the iconic Burj Khalifa skyline.",
    paymentPlan: "30:70",
    recommendationLevel: "Highly Recommended",
    handoverTime: "Q2 2027",
    status: "Under development"
  },
  {
    id: "YOucF0zvSHwtwsP7kCeL",
    name: "Sanctuary",
    location: "Dubai Land, Dubai, UAE",
    country: "UAE",
    type: "Townhouse",
    image: "https://sancturydubai.com/Assets/gallery1.webp",
    images: [
      "https://statics.dubaihomesonline.com/storage/15254/conversions/Sobha-Sanctuary-in-Dubailand--Guide-%2B-Latest-Project-%281%29-md.webp",
      "https://sancturydubai.com/Assets/gallery1.webp"
    ],
    startingPrice: "AED 4M",
    developer: {
      name: "Sobha Realty",
      credibility: "International luxury developer with exceptional finishes"
    },
    highlights: [
      "Over 70% sold out",
      "Spanning 37.5 million sq. ft.",
      "Adjacent to major master communities"
    ],
    description: "Sobha Sanctuary Dubai is an exclusive community by Sobha Realty, spanning 37.5 million sq. ft. in the heart of Dubailand. Featuring premium villas and townhouses, the development enjoys a strategic location near DAMAC Hills 2 and Emaar The Valley.",
    paymentPlan: "40:60",
    recommendationLevel: "Recommended",
    handoverTime: "48 months",
    status: "INVESTMENT READY"
  },
  {
    id: "VGaie6QFnVGKE6YnQNOW",
    name: "La Mandre",
    location: "Near Mandrem Beach, North Goa, India",
    country: "India",
    type: "Villa",
    image: "https://yugeninfra.com/_next/image?url=%2Fuploads%2Fprojects%2Fla-mandre%2Fgallery-exterior.webp&w=3840&q=75",
    images: [
      "https://yugeninfra.com/_next/image?url=%2Fuploads%2Fprojects%2Fla-mandre%2Fgallery-villa.webp&w=3840&q=75"
    ],
    startingPrice: "INR 54M",
    developer: {
      name: "Yugen Infra",
      credibility: "Boutique hospitality and ultra-luxury developer in India"
    },
    highlights: [
      "Only 13 exclusive villas",
      "Move-in-ready condition",
      "Minutes from Mandrem Beach"
    ],
    description: "An exclusive collection of only 13 ultra-luxury Mediterranean-inspired villas designed for maximum privacy, just minutes from Mandrem Beach.",
    paymentPlan: "Custom milestones",
    recommendationLevel: "Exclusive",
    handoverTime: "Ready",
    status: "INVESTMENT READY"
  },
  {
    id: "vrX7vKSlRqFbQtrPS0MD",
    name: "Acqua Front Villas (Garden of Eden)",
    location: "Yugen Golf City, Mopa, North Goa, India",
    country: "India",
    type: "Villa",
    image: "https://cosmopolitanconsulting.com/wp-content/uploads/2025/04/Yugen-Infra-Acqua-Front-Villas-Swimming-pool-800x785.webp",
    images: [
      "https://cosmopolitanconsulting.com/wp-content/uploads/2025/04/Yugen-Infra-Acqua-Front-Villas-Plan-800x785.webp"
    ],
    startingPrice: "INR 33.1M",
    developer: {
      name: "Yugen Infra",
      credibility: "Hospitality partnership with Wyndham Hotels & Resorts"
    },
    highlights: [
      "Dedicated service staff",
      "Managed hospitality by Wyndham",
      "Investment and holiday home opportunity"
    ],
    description: "Exclusive waterfront villas located within Yugen Golf City, offering customized architecture and fully managed luxury living with hospitality services by Wyndham.",
    paymentPlan: "Construction linked",
    recommendationLevel: "Highly Recommended",
    handoverTime: "2028",
    status: "INVESTMENT READY"
  }
];
