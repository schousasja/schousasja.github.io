export interface MarketDetail {
  type: string;
  desc: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

export const marketTranslations: Record<'en' | 'da', Record<string, MarketDetail>> = {
  en: {
    dubai: {
      type: "Ultra-Liquid Investment",
      desc: "The global capital of real estate liquidity, branded urban development, and institutional-grade off-plan pipelines.",
      stats: [
        { label: "YIELD", value: "5–8% (Net)" },
        { label: "GROWTH", value: "6–10%" },
        { label: "STATUS", value: "Ultra-Liquid" }
      ],
      highlights: [
        "Global liquidity hub for real estate resale: Dubai offers one of the fastest property exit markets globally, driven by constant international buyer inflows and high transaction volumes across Dubai. This creates unusually strong resale liquidity compared to other emerging markets.",
        "Master-planned mega-developments pipeline (Dubai 2040-aligned): Large-scale urban expansion continues through integrated districts, waterfront cities, and transport-linked communities under the long-term city framework, reinforcing sustained capital inflows into new growth corridors.",
        "Institutional-grade developer ecosystem (state-linked + listed giants): The market is anchored by major developers such as Emaar Properties and Dubai-linked holding structures, supporting large-scale, internationally marketed projects with relatively strong delivery credibility.",
        "Off-plan dominated investment cycle with global buyer absorption: A significant share of transactions is driven by off-plan properties, supported by flexible payment plans and strong international demand, making Dubai one of the most active forward-selling residential markets globally."
      ]
    },
    'abu-dhabi': {
      type: "PREMIUM CORE MARKET",
      desc: "The most institutionally stable real estate market in the UAE, driven by sovereign capital, controlled supply, and end-user demand dominance.",
      stats: [
        { label: "YIELD", value: "5–8% (Net)" },
        { label: "GROWTH", value: "4–7%" },
        { label: "STATUS", value: "Institutional / Stable" }
      ],
      highlights: [
        "Sovereign-backed demand engine (low volatility market structure): Abu Dhabi’s real estate cycle is heavily influenced by sovereign wealth activity and state-linked developers such as Aldar, creating a more controlled, less speculative market compared to regional peers.",
        "End-user dominated absorption (not investor-driven pricing cycles): Unlike more speculative markets, a large share of demand comes from end-users and long-term residents, leading to stronger occupancy stability and lower rental churn in core communities.",
        "Supply discipline with master-planned expansion corridors: New supply is released gradually through large master developments (Yas, Saadiyat, Reem), supporting more measured price growth and reducing extreme oversupply risk in prime zones.",
        "Financial district and infrastructure clustering (ADGM effect): The expansion of Abu Dhabi Global Market (ADGM) and adjacent economic zones is concentrating high-income tenants and professional demand into specific residential clusters, strengthening rental resilience in those areas."
      ]
    },
    'ras-al-khaimah': {
      type: "GROWTH EMERGING MARKET",
      desc: "The UAE’s fastest-emerging lifestyle and tourism-driven real estate market, led by hospitality expansion and beachfront resort development.",
      stats: [
        { label: "YIELD", value: "6–10% (Net potential)" },
        { label: "GROWTH", value: "5–9%" },
        { label: "STATUS", value: "Emerging / Tourism-Led" }
      ],
      highlights: [
        "Tourism-led real estate expansion (hospitality-first growth model): Growth is strongly tied to large-scale tourism projects, resort development, and branded beachfront communities, making demand more seasonal but increasingly global in origin.",
        "Branded residences and resort communities driving premiumisation: A growing share of new supply is linked to international hotel brands and integrated resort living, positioning the market toward lifestyle investment rather than pure urban housing.",
        "Limited high-density urban competition (scarcity effect in prime coastal zones): Compared to major UAE cities, Ras Al Khaimah has a more constrained luxury beachfront inventory, which supports relative pricing strength in prime waterfront developments.",
        "Infrastructure and destination repositioning strategy: The emirate is actively repositioning itself as a global leisure destination, with major investments in islands, coastal infrastructure, and entertainment-driven masterplans enhancing long-term demand visibility."
      ]
    },
    bangalore: {
      type: "TECH-DRIVEN MARKET",
      desc: "India’s most consistent urban growth engine, driven by IT expansion, infrastructure-linked appreciation, and structurally strong rental demand.",
      stats: [
        { label: "YIELD", value: "3–5% (Net Rental Yield)" },
        { label: "GROWTH", value: "6–10%" },
        { label: "STATUS", value: "IT Demand Driven" }
      ],
      highlights: [
        "IT & Global Capability Center (GCC) absorption engine: Bangalore’s real estate demand is structurally supported by continuous expansion of IT parks and GCCs. This creates persistent end-user demand across mid and premium property segments.",
        "Infrastructure-led micro-market appreciation cycle: Metro expansion, Peripheral Ring Road, and airport corridor development are reshaping pricing dynamics. Growth is highly corridor-specific rather than citywide.",
        "Strong end-user bias with limited speculative overheating: Unlike highly cyclical markets, Bangalore is dominated by working professionals and relocating families, leading to steadier absorption and fewer extreme boom-bust swings.",
        "Deep and liquid rental market anchored by IT employment: High tenant turnover from tech workers, expats, and inter-city migration keeps occupancy rates strong in core zones like Whitefield, ORR, and Sarjapur Road."
      ]
    },
    chennai: {
      type: "STRATEGIC CORE MARKET",
      desc: "India’s most stable end-user driven coastal metro, increasingly shaped by GCC expansion, industrial resilience, and disciplined price growth.",
      stats: [
        { label: "YIELD", value: "3.5–5% (Net Rental Yield)" },
        { label: "GROWTH", value: "5–8%" },
        { label: "STATUS", value: "Stable / End-User Led" }
      ],
      highlights: [
        "GCC-led office expansion reshaping residential demand: Global Capability Centres now dominate office absorption, strengthening long-term housing demand in IT and business corridors like OMR and Perungudi.",
        "End-user dominated housing cycle with low speculative volatility: Pricing is driven primarily by salaried professionals and families, resulting in steady absorption and limited boom-bust behaviour.",
        "Infrastructure-led suburban expansion (metro & airport & ORR): Transport upgrades and metro Phase 2 are unlocking new growth zones along key suburban corridors.",
        "Selective micro-market strength vs oversupply pockets: Well-connected IT corridors outperform significantly, while peripheral speculative developments show slower absorption."
      ]
    },
    goa: {
      type: "LIFESTYLE & TOURISM CAPITAL",
      desc: "India’s premium second-home and lifestyle-driven real estate market, transitioning from tourism asset class to global lifestyle investment destination.",
      stats: [
        { label: "YIELD", value: "4–6% (Net Rental Yield)" },
        { label: "GROWTH", value: "6–10%" },
        { label: "STATUS", value: "Lifestyle / Seasonal Luxury" }
      ],
      highlights: [
        "Tourism-driven capital inflow into residential luxury: Demand is increasingly driven by domestic HNIs, NRIs, and remote professionals seeking second homes and lifestyle assets.",
        "Strong shift toward branded villas and managed residences: Hospitality-linked developments are reshaping the market into hybrid residential–hotel investment structures.",
        "Geographic scarcity in prime coastal micro-markets: Limited beachfront inventory in North Goa supports relative pricing strength in select coastal zones.",
        "Infrastructure & airport expansion improving accessibility: Improved connectivity and airport capacity upgrades are strengthening long-term demand visibility."
      ]
    },
    'gurgaon-delhi': {
      type: "PREMIUM CORPORATE HUB",
      desc: "India’s most capital-intensive and infrastructure-driven real estate market, led by corporate demand, expressway corridors, and premium housing migration.",
      stats: [
        { label: "YIELD", value: "3–5% (Resi) / 7–11% (Comm)" },
        { label: "GROWTH", value: "6–10%" },
        { label: "STATUS", value: "High Liquidity / Cyclical Premium" }
      ],
      highlights: [
        "Infrastructure-led value creation across expressway corridors: Dwarka Expressway, SPR, and Noida International Airport connectivity are reshaping growth geography across NCR.",
        "Strong corporate demand anchoring rental and commercial real estate: Multinational companies, GCCs, and financial services firms continue to drive Grade-A office absorption and housing demand.",
        "Premiumisation of housing supply and shrinking mid-segment dominance: Market increasingly favors branded developers, gated communities, and large-format residential projects.",
        "Micro-market divergence driving selective returns: Dwarka Expressway and Golf Course Extension outperform, while legacy zones show slower appreciation."
      ]
    },
    hyderabad: {
      type: "TECH & EXPORT ENGINE",
      desc: "India’s most balanced IT & industrial growth metro, driven by structured planning, global tech demand, and scalable residential absorption.",
      stats: [
        { label: "YIELD", value: "3–4.5%" },
        { label: "GROWTH", value: "7–10%" },
        { label: "STATUS", value: "Structured Growth Market" }
      ],
      highlights: [
        "IT & pharma & GCC expansion sustaining long-term demand: Strong presence of global firms in HITEC City and Financial District ensures consistent residential absorption.",
        "Planned infrastructure expansion supporting outward growth corridors: Outer Ring Road and metro extensions are shaping new high-growth micro-markets.",
        "Mid-premium housing dominance with strong end-user base: Demand is concentrated in gated communities and mid-luxury apartments driven by professionals.",
        "Controlled supply vs demand balance in key corridors: Core zones maintain relatively balanced absorption compared to overbuilt markets."
      ]
    },
    mumbai: {
      type: "INDIA’S FINANCIAL CAPITAL",
      desc: "India’s most expensive and liquidity-driven real estate market, defined by extreme price compression, redevelopment cycles, and premium asset scarcity.",
      stats: [
        { label: "YIELD", value: "2.5–4%" },
        { label: "GROWTH", value: "4–7%" },
        { label: "STATUS", value: "Ultra-Prime / Scarcity" }
      ],
      highlights: [
        "Structural scarcity in land and housing supply: Limited developable land in core Mumbai sustains long-term pricing pressure in prime zones.",
        "Redevelopment-led supply cycle driving urban transformation: New supply is largely generated through redevelopment rather than greenfield expansion.",
        "Premiumisation dominates across all segments: Even mid-segment areas are shifting toward higher-value redevelopment and luxury positioning.",
        "Strong commercial & financial district anchoring demand: BKC and Nariman Point ecosystems continue to support high-income residential demand."
      ]
    },
    pune: {
      type: "IT & MID-PREMIUM GROWTH HUB",
      desc: "India’s quietly compounding IT-driven real estate market, supported by strong employment corridors and stable rental ecosystems.",
      stats: [
        { label: "YIELD", value: "3–5%" },
        { label: "GROWTH", value: "6–10%" },
        { label: "STATUS", value: "Stable Growth / IT Driven" }
      ],
      highlights: [
        "IT corridor expansion driving sustained residential absorption: Hinjewadi, Wakad, and Baner remain core employment-driven residential hubs.",
        "Strong end-user & rental mix with low speculative volatility: Demand is dominated by professionals and internal migration rather than speculative capital.",
        "Infrastructure-linked suburban growth corridors expanding westward: Connectivity improvements are driving gradual expansion toward new micro-markets.",
        "Balanced affordability vs lifestyle housing demand: Mid-premium segment continues to dominate overall absorption."
      ]
    },
    singapore: {
      type: "GLOBAL CAPITAL PRESERVATION HUB",
      desc: "Asia’s premier institutional capital and wealth management hub, defined by regulatory stability, asset protection, and ultra-prime real estate positioning.",
      stats: [
        { label: "YIELD", value: "2–4%" },
        { label: "GROWTH", value: "3–6%" },
        { label: "STATUS", value: "Institutional / Safe-Haven" }
      ],
      highlights: [
        "Global wealth inflows sustaining ultra-prime real estate demand: Singapore continues attracting family offices, multinational firms, and high-net-worth migration from across Asia and Europe.",
        "Financial services and regional headquarters dominance: The city-state remains Southeast Asia’s leading base for regional corporate operations and capital management.",
        "Strict supply controls supporting long-term pricing resilience: Government-managed land release and housing controls maintain structural scarcity in prime districts.",
        "Strategic role as Southeast Asia business gateway: Singapore functions as the primary legal, financial, and operational entry platform into Southeast Asia."
      ]
    },
    indonesia: {
      type: "EMERGING SCALE MARKET",
      desc: "Southeast Asia’s largest domestic consumption economy, driven by urban expansion, industrial relocation, and long-term infrastructure transformation.",
      stats: [
        { label: "YIELD", value: "4–7%" },
        { label: "GROWTH", value: "6–10%" },
        { label: "STATUS", value: "Emerging / Industrial" }
      ],
      highlights: [
        "Industrial relocation and manufacturing diversification accelerating demand: Global supply chain shifts continue driving investment into industrial corridors around Jakarta, Batam, and East Java.",
        "Nusantara capital development reshaping long-term infrastructure strategy: The new capital city initiative is creating multi-decade infrastructure and construction investment flows across the country.",
        "Expanding middle-class urbanisation supporting residential absorption: Rapid urban migration continues strengthening demand for mid-market residential and mixed-use developments.",
        "Strong resource economy supporting long-term capital inflows: Nickel, EV supply chain investment, and commodity exports remain major structural growth drivers."
      ]
    },
    'sri-lanka': {
      type: "FRONTIER RECOVERY MARKET",
      desc: "A frontier investment market undergoing economic stabilisation, with long-term tourism, logistics, and coastal development potential.",
      stats: [
        { label: "YIELD", value: "4–7%" },
        { label: "GROWTH", value: "5–9%" },
        { label: "STATUS", value: "Frontier / Recovery" }
      ],
      highlights: [
        "Tourism recovery driving renewed hospitality and coastal investment: Visitor inflows continue recovering, supporting hotel, resort, and mixed-use development activity.",
        "Strategic Indian Ocean trade positioning supporting logistics potential: Sri Lanka’s maritime location continues attracting regional infrastructure and port-related interest.",
        "Currency repricing creating selective foreign entry opportunities: Market corrections and exchange-rate adjustments have improved foreign investor accessibility in select sectors.",
        "Colombo premium segment remains supply constrained: High-quality Grade-A commercial and residential inventory remains limited relative to long-term demand potential."
      ]
    },
    thailand: {
      type: "TOURISM & LIFESTYLE POWERHOUSE",
      desc: "One of Asia’s most established tourism and hospitality-driven property markets, combining lifestyle demand with regional business expansion.",
      stats: [
        { label: "YIELD", value: "4–8%" },
        { label: "GROWTH", value: "5–8%" },
        { label: "STATUS", value: "Lifestyle / Tourism Driven" }
      ],
      highlights: [
        "Tourism recovery sustaining hospitality and branded residence growth: Bangkok, Phuket, and Pattaya continue benefiting from strong international visitor demand and lifestyle migration.",
        "Regional manufacturing and business diversification supporting urban demand: Thailand remains a major automotive, electronics, and regional operations hub within Southeast Asia.",
        "Foreign buyer demand concentrated in resort and luxury segments: International investors continue targeting branded residences and serviced lifestyle developments.",
        "Infrastructure expansion improving inter-city connectivity: Transport upgrades and EEC development continue reshaping industrial and residential growth corridors."
      ]
    },
    vietnam: {
      type: "HIGH-GROWTH MANUFACTURING HUB",
      desc: "Southeast Asia’s fastest-scaling manufacturing and export-driven economy, supported by industrial expansion and rising foreign direct investment.",
      stats: [
        { label: "YIELD", value: "4–7%" },
        { label: "GROWTH", value: "7–12%" },
        { label: "STATUS", value: "High-Growth / Export Driven" }
      ],
      highlights: [
        "Global manufacturing relocation accelerating industrial expansion: Vietnam continues attracting large-scale electronics, technology, and supply-chain diversification investment.",
        "Rapid urbanisation supporting residential and mixed-use growth: Major cities such as Ho Chi Minh City and Hanoi continue experiencing strong population and income expansion.",
        "Infrastructure investment reshaping logistics and regional connectivity: Expressways, ports, airports, and industrial parks remain central to the country’s long-term growth strategy.",
        "Rising middle-class consumption strengthening domestic demand: Income growth and urban migration continue supporting retail, residential, and commercial real estate absorption."
      ]
    }
  },
  da: {
    dubai: {
      type: "Ultra-likvid investering",
      desc: "Den globale hovedstad for ejendomslikviditet, brandede byudviklinger og off-plan projekter i institutionsklasse.",
      stats: [
        { label: "AFKAST", value: "5–8% (Netto)" },
        { label: "VÆKST", value: "6–10%" },
        { label: "STATUS", value: "Ultra-likvid" }
      ],
      highlights: [
        "Globalt likviditetscentrum for videresalg af ejendomme: Dubai tilbyder et af de hurtigste markeder for ejendoms-exit i verden, drevet af konstant international køberetilstrømning og høje transaktionsvolumener. Dette skaber en usædvanlig stærk likviditet sammenlignet med andre vækstmarkeder.",
        "Udvikling af masterplanlagte megaprojekter (tilpasset Dubai 2040): Storstilet byudvikling fortsætter gennem integrerede distrikter, havnebyer og transportforbundne samfund under den langsigtede byramme, hvilket styrker den vedvarende kapitaltilstrømning til nye vækstkorridorer.",
        "Udvikler-økosystem i institutionsklasse (statsforbundne + børsnoterede giganter): Markedet er forankret af store udviklere som f.eks. Emaar Properties og Dubai-forbundne holdingselskaber, hvilket understøtter storstilede, internationalt markedsførte projekter med høj leveringstroværdighed.",
        "Investeringscyklus domineret af off-plan med global køberabsorption: En betydelig del af transaktionerne er drevet af off-plan ejendomme, understøttet af fleksible betalingsplaner og stærk international efterspørgsel, hvilket gør Dubai til et af de mest aktive forward-selling boligmarkeder i verden."
      ]
    },
    'abu-dhabi': {
      type: "PREMIUM KERNEMARKED",
      desc: "Det mest institutionelt stabile ejendomsmarked i UAE, drevet af statslig kapital, kontrolleret udbud og dominans af slutbrugerefterspørgsel.",
      stats: [
        { label: "AFKAST", value: "5–8% (Netto)" },
        { label: "VÆKST", value: "4–7%" },
        { label: "STATUS", value: "Institutionel / Stabil" }
      ],
      highlights: [
        "Statsstøttet efterspørgselsmotor (marked med lav volatilitet): Abu Dhabis ejendomscyklus er stærkt påvirket af statslige investeringsfonde og statsforbundne udviklere som Aldar, hvilket skaber et mere kontrolleret og mindre spekulativt marked.",
        "Slutbruger-domineret absorption (ikke investor-drevne priscyklusser): I modsætning til mere spekulative markeder kommer en stor del af efterspørgslen fra slutbrugere og langtidsbeboere, hvilket fører til stærkere stabilitet i belægningsprocenten og lavere lejeafgang.",
        "Udbudsdisciplin med masterplanlagte udbygningskorridorer: Nyt udbud frigives gradvist gennem store master-projekter (Yas, Saadiyat, Reem), hvilket understøtter en mere afmålt prisvækst og mindsker risikoen for ekstremt overudbud i prime zoner.",
        "Finansdistrikt og infrastruktursamling (ADGM-effekt): Udvidelsen af Abu Dhabi Global Market (ADGM) og tilstødende økonomiske zoner koncentrerer højindkomstlejere og professionel efterspørgsel i specifikke boligklynger, hvilket styrker lejemodstandskraften."
      ]
    },
    'ras-al-khaimah': {
      type: "VÆKST- OG VÆKSTMARKED",
      desc: "UAE's hurtigst voksende livsstils- og turismedrevne ejendomsmarked, anført af ekspansion inden for hotel og restaurationsbranchen samt udvikling af strandresorter.",
      stats: [
        { label: "AFKAST", value: "6–10% (Netto potentiale)" },
        { label: "VÆKST", value: "5–9%" },
        { label: "STATUS", value: "Voksende / Turisme-ledet" }
      ],
      highlights: [
        "Turisme-ledet ejendomsekspansion (hotel-først vækstmodel): Væksten er stærkt knyttet til store turismeprojekter, feriestedsudvikling og brandede strandsamfund, hvilket gør efterspørgslen mere sæsonpræget, men i stigende grad global.",
        "Branded residences og resortmiljøer, der driver premiumisering: En voksende andel af det nye udbud er knyttet til internationale hotelbrands og integreret resortliv, hvilket positionerer markedet mod livsstilsinvesteringer i stedet for almindelige boliger.",
        "Begrænset tætbefolket konkurrence (knaphedseffekt i kystnære zoner): Sammenlignet med store UAE-byer har Ras Al Khaimah et mere begrænset lager af luksuriøse strandgrunde, hvilket understøtter relative priser i førsteklasses havnefrontudviklinger.",
        "Infrastruktur- og destinationsprofileringsstrategi: Emiratet flytter aktivt sin position til en global fritidsdestination med store investeringer i øer, kystinfrastruktur og underholdningsdrevne masterplaner, hvilket forbedrer den langsigtede efterspørgsel."
      ]
    },
    bangalore: {
      type: "TEKNOLOGIDREVET MARKED",
      desc: "Indiens mest konsekvente urbane vækstmotor, drevet af IT-ekspansion, infrastrukturforbundet værdistigning og strukturelt stærk lejeefterspørgsel.",
      stats: [
        { label: "AFKAST", value: "3–5% (Netto lejeafkast)" },
        { label: "VÆKST", value: "6–10%" },
        { label: "STATUS", value: "IT-efterspørgselsdrevet" }
      ],
      highlights: [
        "IT & Global Capability Center (GCC) som absorptionsmotor: Bangalores efterspørgsel efter fast ejendom understøttes strukturelt af kontinuerlig ekspansion af IT-parker og GCC'er. Dette skaber vedvarende efterspørgsel i mid- og premiumsegmenterne.",
        "Infrastrukturdrevet mikromarkeds værdistigningscyklus: Metroudbygning, Peripheral Ring Road og lufthavnskorridorudvikling omformer prisdynamikken. Væksten er meget korridorspecifik.",
        "Stærk slutbrugertendens uden ekstrem spekulation: I modsætning til meget cykliske markeder er Bangalore domineret af arbejdende professionelle og tilflyttende familier, hvilket fører til mere stabil absorption.",
        "Dyb og likvid lejemulighed forankret i IT-job: Høj udskiftning af lejere blandt tech-medarbejdere, udlændinge og tilflyttere holder belægningsprocenten stærk i kernezoner som Whitefield, ORR og Sarjapur Road."
      ]
    },
    chennai: {
      type: "STRATEGISK KERNEMARKED",
      desc: "Indiens mest stabile slutbrugerdrevne kystby, i stigende grad præget af GCC-ekspansion, industriel robusthed og disciplineret prisvækst.",
      stats: [
        { label: "AFKAST", value: "3.5–5% (Netto lejeafkast)" },
        { label: "VÆKST", value: "5–8%" },
        { label: "STATUS", value: "Stabil / Slutbrugerdrevet" }
      ],
      highlights: [
        "GCC-ledet kontorekspansion omformer boligefterspørgslen: Global Capability Centres dominerer kontorabsorptionen, hvilket styrker den langsigtede efterspørgsel efter boliger i IT- og erhvervskorridorer.",
        "Slutbruger-domineret boligcyklus med lav spekulativ volatilitet: Prissætningen drives primært af lønnede fagfolk og familier, hvilket resulterer i stabil absorption og begrænset spekulation.",
        "Infrastruktur-ledet forstadsudvidelse (metro, lufthavn & ORR): Transportopgraderinger og metrofase 2 åbner nye vækstzoner langs centrale forstadskorridorer.",
        "Selektiv styrke i mikromarkeder mod overudbudslommer: Velforbundne IT-korridorer overperformer markant, mens perifere spekulative projekter viser langsommere absorption."
      ]
    },
    goa: {
      type: "LIVSSTILS- OG TURISMEHOVEDSTAD",
      desc: "Indiens førende marked for sekundære boliger og livsstil, der transformerer sig fra en turismeaktivklasse til en global livsstilsinvesteringsdestination.",
      stats: [
        { label: "AFKAST", value: "4–6% (Netto, turismeafhængigt)" },
        { label: "VÆKST", value: "6–10%" },
        { label: "STATUS", value: "Livsstil / Sæsonpræget luksus" }
      ],
      highlights: [
        "Turismedrevet kapitaltilstrømning til boligluksus: Efterspørgslen drives i stigende grad af nationale HNIs, NRIs og fjernarbejdere, der søger sekundære boliger.",
        "Stærkt skift mod brandede villaer og forvaltede boliger: Hotel- og hospitality-forbundne projekter omformer markedet til hybride bolig- og hotelinvesteringsstrukturer.",
        "Geografisk knaphed i førsteklasses kystnære mikromarkeder: Begrænset udbud af kystgrunde i det nordlige Goa understøtter prisstyrken i udvalgte kystzoner.",
        "Infrastruktur- og lufthavnsekspansion forbedrer tilgængeligheden: Forbedret infrastruktur og opgraderinger af lufthavnskapaciteten styrker den langsigtede efterspørgsel."
      ]
    },
    'gurgaon-delhi': {
      type: "PREMIUM ERHVERVSHUB",
      desc: "Indiens mest kapitalintensive og infrastrukturdrevne ejendomsmarked, anført af erhvervsefterspørgsel, motorvejskorridorer og premium boligmigrering.",
      stats: [
        { label: "AFKAST", value: "3–5% (Boliger) / 7–11% (Erhverv)" },
        { label: "VÆKST", value: "6–10%" },
        { label: "STATUS", value: "Høj likviditet / Cyklisk premium" }
      ],
      highlights: [
        "Infrastrukturdrevet værdiskabelse langs motorveje: Dwarka Expressway, SPR og lufthavnsforbindelsen i Noida omformer vækstgeografien på tværs af NCR.",
        "Stærk erhvervsefterspørgsel forankrer udlejning og erhvervsejendomme: Multinationale selskaber, GCC'er og finansielle servicevirksomheder driver Grade-A efterspørgsel.",
        "Premiumisering af boligudbuddet: Markedet favoriserer i stigende grad etablerede udviklere, lukkede samfund og store ejerlejligheder.",
        "Divergens i mikromarkeder driver selektive afkast: Dwarka Expressway og Golf Course Extension overperformer markant."
      ]
    },
    hyderabad: {
      type: "TEKNOLOGI- OG EKSPORTMOTOR",
      desc: "Indiens mest balancerede IT- og industrielle vækstby, drevet af struktureret planlægning, global techefterspørgsel og skalerbar boligabsorption.",
      stats: [
        { label: "AFKAST", value: "3–4.5%" },
        { label: "VÆKST", value: "7–10%" },
        { label: "STATUS", value: "Struktureret vækstmarked" }
      ],
      highlights: [
        "IT-, farma- og GCC-ekspansion understøtter langsigtet efterspørgsel: Stærkt fodfæste for globale virksomheder i HITEC City og Financial District sikrer stabil absorption.",
        "Planlagt infrastrukturudvidelse understøtter vækstkorridorer udad: Outer Ring Road og metroudvidelser åbner nye højvækst-mikromarkeder.",
        "Mid-premium boligdominans med stærk slutbrugerbase: Efterspørgslen er koncentreret i lukkede boligområder og moderne lejligheder.",
        "Kontrolleret balance mellem udbud og efterspørgsel: Kernezoner opretholder en relativt afbalanceret absorption sammenlignet med overbyggede markeder."
      ]
    },
    mumbai: {
      type: "INDIENS FINANSIELLE HOVEDSTAD",
      desc: "Indiens dyreste og mest likviditetsdrevne ejendomsmarked, defineret af ekstreme priser, byfornyelsescyklusser og knaphed på premiumaktiver.",
      stats: [
        { label: "AFKAST", value: "2.5–4%" },
        { label: "VÆKST", value: "4–7%" },
        { label: "STATUS", value: "Ultra-prime / Knaphedsmarked" }
      ],
      highlights: [
        "Strukturel knaphed på jord og boligudbud: Begrænset byggejord i det centrale Mumbai opretholder et langsigtet prispres i prime zoner.",
        "Byfornyelses-drevet udbudscyklus: Nyt udbud genereres i vid udstrækning gennem sanering og renovering snarere end ubebygget jord.",
        "Premiumisering dominerer på tværs af alle segmenter: Selv traditionelle mellemliggende områder skifter mod byfornyelse i højere kvalitet og luksuspositionering.",
        "Stærkt erhvervs- og finansdistrikt forankrer efterspørgslen: BKC- og Nariman Point-økosystemerne fortsætter med at understøtte højindkomstefterspørgsel."
      ]
    },
    pune: {
      type: "IT- OG MID-PREMIUM VÆKSTHUB",
      desc: "Indiens støt voksende IT-drevne ejendomsmarked, understøttet af stærke beskæftigelseskorridorer og stabile lejeøkosystemer.",
      stats: [
        { label: "AFKAST", value: "3–5%" },
        { label: "VÆKST", value: "6–10%" },
        { label: "STATUS", value: "Stabil vækst / IT-drevet" }
      ],
      highlights: [
        "IT-korridorens vækst driver boligabsorption: Hinjewadi, Wakad og Baner forbliver de primære jobdrevne boligområder.",
        "Stærk slutbruger- og lejemiks med lav spekulativ volatilitet: Efterspørgslen domineres af professionelle og national tilflytning i stedet for spekulativ kapital.",
        "Infrastrukturforbundne vækstkorridorer udbygger sig vestover: Forbindelsesforbedringer driver en gradvis ekspansion mod nye mikromarkeder.",
        "Afbalanceret forhold mellem pris og livsstil: Mid-premium segmentet fortsætter med at dominere den overordnede absorption."
      ]
    },
    singapore: {
      type: "GLOBAL HUB FOR KAPITALBEVARING",
      desc: "Asiens førende institutionelle kapital- og formueforvaltningshub, defineret af lovgivningsmæssig stabilitet, aktivbeskyttelse og ultra-prime ejendomspositionering.",
      stats: [
        { label: "AFKAST", value: "2–4%" },
        { label: "VÆKST", value: "3–6%" },
        { label: "STATUS", value: "Institutionelt helle / Safe-Haven" }
      ],
      highlights: [
        "Globale formuestrømme understøtter ultra-prime ejendomme: Singapore tiltrækker fortsat family offices, multinationale virksomheder og HNWI-migration fra hele verden.",
        "Finansielle tjenesteydelser og regionalt hovedsædedominans: Bynationen er fortsat Sydøstasiens førende base for regional drift og kapitalforvaltning.",
        "Stram udbudskontrol understøtter langsigtet prismodstandskraft: Regeringsstyret frigivelse af jord og boligregulering opretholder knaphed i prime distrikter.",
        "Strategisk rolle som erhvervsport til Sydøstasien: Singapore fungerer som den primære juridiske, finansielle og operationelle platform ind i ASEAN."
      ]
    },
    indonesia: {
      type: "VÆKST- OG SKALERINGSMARKED",
      desc: "Sydøstasiens største indenlandske forbrugsøkonomi, drevet af forstadsudvidelse, industriel udflytning og langsigtet infrastrukturtransformation.",
      stats: [
        { label: "AFKAST", value: "4–7%" },
        { label: "VÆKST", value: "6–10%" },
        { label: "STATUS", value: "Voksende / Industriel" }
      ],
      highlights: [
        "Industriel relokalisering og produktionsspredning accelererer efterspørgslen: Globale forsyningskædeskift driver investeringer til industrikorridorer.",
        "Udvikling af Nusantara-hovedstaden omformer infrastrukturen: Det nye hovedstadsideasæt skaber årtiers byggeri- og anlægsinvesteringer over hele landet.",
        "Bredere byudvikling for den voksende middelklasse: Hurtig urban migration styrker efterspørgslen efter boliger og blandede bymiljøer.",
        "Stærk ressourceøkonomi understøtter langsigtet kapital: Investeringer i nikkel, elbil-forsyningskæder og råvareeksport er vigtige drivkræfter."
      ]
    },
    'sri-lanka': {
      type: "FRONTIER RESTITUTIONSMARKED",
      desc: "Et frontier-investeringsmarked under økonomisk stabilisering, med langsigtet potentiale inden for turisme, logistik og kystudvikling.",
      stats: [
        { label: "AFKAST", value: "4–7%" },
        { label: "VÆKST", value: "5–9%" },
        { label: "STATUS", value: "Frontier / Restitutionsmarked" }
      ],
      highlights: [
        "Turismens genopretning driver hotel- og kystinvesteringer: Besøgende strømmer til igen, hvilket understøtter hoteller, resorter og blandede ferieprojekter.",
        "Strategisk placering i Det Indiske Ocean understøtter logistikken: Sri Lankas maritime position tiltrækker regional infrastruktur og havnerelateret interesse.",
        "Valutakorrektion skaber selektive indgangsmuligheder: Markedskorrektioner og valutajusteringer har forbedret tilgængeligheden for udenlandske investorer.",
        "Colombos premiumsegment er fortsat udbudsbegrænset: Grade-A kontorer og boliger af høj kvalitet er fortsat begrænset i forhold til det langsigtede potentiale."
      ]
    },
    thailand: {
      type: "TURISME- OG LIVSSTILS-KRAFTCENTER",
      desc: "Et af Asiens mest etablerede turisme- og hotelprægede ejendomsmarkeder, der forbinder livsstilsefterspørgsel med regional erhvervsudvikling.",
      stats: [
        { label: "AFKAST", value: "4–8%" },
        { label: "VÆKST", value: "5–8%" },
        { label: "STATUS", value: "Livsstil / Turismedrevet" }
      ],
      highlights: [
        "Turismens genopretning understøtter hotelprojekter og brandede boliger: Bangkok, Phuket og Pattaya nyder godt af stærk international efterspørgsel.",
        "Regional produktion og diversificering understøtter byerne: Thailand er fortsat en stor hub for bilindustri, elektronik og regional drift i ASEAN.",
        "Udenlandsk efterspørgsel koncentreret i feriesteder og luksussegmentet: Internationale købere søger primært brandede boliger og servicerede ferielejligheder.",
        "Infrastrukturudbygning forbedrer forbindelser mellem byerne: EEC-korridorudvikling og jernbaneopgraderinger omformer vækstkanalerne."
      ]
    },
    vietnam: {
      type: "PRODUKTIONSHUB MED HØJ VÆKST",
      desc: "Sydøstasiens hurtigst voksende produktions- og eksportdrevne økonomi, understøttet af industriel ekspansion og stigende udenlandske direkte investeringer (FDI).",
      stats: [
        { label: "AFKAST", value: "4–7%" },
        { label: "VÆKST", value: "7–12%" },
        { label: "STATUS", value: "Høj vækst / Eksportdrevet" }
      ],
      highlights: [
        "Global udflytning af produktion accelererer den industrielle udbygning: Vietnam tiltrækker store investeringer inden for elektronik, teknologi og forsyningskæder.",
        "Hurtig urbanisering understøtter boligmarkedet og erhvervsbyggeri: Større byer som Ho Chi Minh City og Hanoi oplever fortsat stærk befolkningstilvækst.",
        "Infrastrukturinvesteringer omformer logistikken: Motorveje, dybvandshavne, lufthavne og industriparker er centrale for den langsigtede strategi.",
        "Stigende middelklasseforbrug styrker den indenlandske efterspørgsel: Indkomstudvikling og bymigration understøtter detailhandel, boliger og erhverv."
      ]
    }
  }
};
