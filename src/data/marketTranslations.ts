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
        { label: "SEGMENT", value: "Prime Freehold" },
        { label: "FRAMEWORK", value: "RERA Regulated" },
        { label: "STATUS", value: "High Liquidity" }
      ],
      highlights: [
        "Global liquidity hub for real estate resale: Dubai offers one of the most active property markets globally, driven by international buyer interest and high transaction volumes. This creates deep market liquidity across primary districts.",
        "Master-planned mega-developments pipeline (Dubai 2040-aligned): Large-scale urban development continues through integrated districts, waterfront communities, and transport-linked masterplans under the long-term city framework.",
        "Institutional-grade developer ecosystem: The market is anchored by established developers with strong balance sheets and track records of delivering master communities.",
        "Structured off-plan regulatory protections: Transactions are governed by government escrow regulations, milestone payments, and verified developer completion guarantees."
      ]
    },
    'abu-dhabi': {
      type: "PREMIUM CORE MARKET",
      desc: "The most institutionally stable real estate market in the UAE, driven by sovereign capital, controlled supply, and end-user demand dominance.",
      stats: [
        { label: "SEGMENT", value: "Institutional Core" },
        { label: "FRAMEWORK", value: "Sovereign-Backed" },
        { label: "STATUS", value: "Controlled Supply" }
      ],
      highlights: [
        "Sovereign-backed development engine: Abu Dhabi’s property market is heavily anchored by government-linked master developers such as Aldar, creating an institutionally stable and disciplined environment.",
        "End-user dominated absorption: A major portion of demand is driven by long-term residents and corporate occupiers, contributing to high tenancy stability in core master communities.",
        "Supply discipline across master-planned corridors: New development is released gradually across designated island districts (Yas, Saadiyat, Reem), maintaining structured market equilibrium.",
        "Financial district integration (ADGM): The expansion of Abu Dhabi Global Market attracts multinational firms, regional financial headquarters, and high-income executive demand."
      ]
    },
    'ras-al-khaimah': {
      type: "EMERGING DESTINATION MARKET",
      desc: "The UAE’s premier emerging lifestyle and tourism-driven real estate market, led by hospitality expansion and beachfront resort development.",
      stats: [
        { label: "SEGMENT", value: "Hospitality & Coastal" },
        { label: "FRAMEWORK", value: "Master-Planned" },
        { label: "STATUS", value: "Emerging Hub" }
      ],
      highlights: [
        "Tourism-led real estate expansion: Development is anchored by large-scale hospitality projects, integrated coastal resorts, and waterfront residential communities.",
        "Branded residences driving luxury positioning: A growing share of new inventory is linked to international hotel operators and branded resort concepts.",
        "Constrained luxury beachfront inventory: Ras Al Khaimah features protected natural coastlines and island destinations with master-planned low-density zoning.",
        "Destination infrastructure investments: Long-term expansion of airport facilities, leisure infrastructure, and marina districts underpins regional accessibility."
      ]
    },
    bangalore: {
      type: "TECH-DRIVEN MARKET",
      desc: "India’s premier urban technology metropolis, driven by IT enterprise expansion, infrastructure pipelines, and structural end-user demand.",
      stats: [
        { label: "SEGMENT", value: "Enterprise Tech Hub" },
        { label: "FRAMEWORK", value: "SEZ & Grade-A" },
        { label: "STATUS", value: "IT Demand Driven" }
      ],
      highlights: [
        "Global Capability Center (GCC) absorption engine: Bangalore’s commercial real estate is anchored by multinational tech campuses and R&D centers, generating consistent end-user absorption.",
        "Infrastructure-led micro-market connectivity: Metro line expansions, Peripheral Ring Road, and airport corridor integration connect major employment districts.",
        "Professional end-user foundation: Dominated by skilled technology professionals and institutional corporate occupiers, leading to high occupancy in established tech corridors.",
        "Deep corporate leasing market: Major business parks across Whitefield, Outer Ring Road, and North Bangalore host leading Fortune 500 engineering centers."
      ]
    },
    chennai: {
      type: "STRATEGIC CORE MARKET",
      desc: "India’s established end-user driven coastal metro, shaped by GCC expansion, industrial resilience, and disciplined market absorption.",
      stats: [
        { label: "SEGMENT", value: "Industrial & SaaS" },
        { label: "FRAMEWORK", value: "Manufacturing Corridor" },
        { label: "STATUS", value: "End-User Dominated" }
      ],
      highlights: [
        "GCC and tech campus development: Global Capability Centers and SaaS headquarters establish deep demand in corridors like OMR and Guindy.",
        "Resilient manufacturing and automobile ecosystem: Known as India's manufacturing backbone, supporting steady local employment and disciplined housing demand.",
        "Infrastructure and suburban connectivity: Metro Phase 2 upgrades and industrial transit corridors connect outer logistics clusters with prime city districts.",
        "Selective corridor performance: Well-connected infrastructure corridors with direct arterial access demonstrate steady commercial and residential absorption."
      ]
    },
    goa: {
      type: "LIFESTYLE & TOURISM CAPITAL",
      desc: "India’s premier second-home and lifestyle property market, transitioning into an established destination for boutique hospitality and remote enterprise work.",
      stats: [
        { label: "SEGMENT", value: "Lifestyle & Hospitality" },
        { label: "FRAMEWORK", value: "Coastal Masterplan" },
        { label: "STATUS", value: "Boutique Residential" }
      ],
      highlights: [
        "High demand for branded villas and managed residences: Hospitality-linked developments offer serviced living and professional asset management.",
        "Lifestyle migration and executive relocation: Broadening appeal among professionals, founders, and creative executives establishing second homes.",
        "Protected coastal zoning: Regulatory restrictions on coastal development maintain architectural character and controlled density in prime micro-markets.",
        "Upgraded connectivity via Manohar International Airport: Modern aviation and road infrastructure significantly improve regional and international accessibility."
      ]
    },
    'gurgaon-delhi': {
      type: "CORPORATE HEADQUARTERS HUB",
      desc: "North India’s foremost corporate and commercial property market, anchored by multinational headquarters, modern expressway corridors, and master-planned townships.",
      stats: [
        { label: "SEGMENT", value: "Fortune 500 Corporate" },
        { label: "FRAMEWORK", value: "Expressway Masterplan" },
        { label: "STATUS", value: "Institutional Hub" }
      ],
      highlights: [
        "Corporate headquarters concentration: Over 250 Fortune 500 regional offices and major domestic conglomerates anchor Grade-A commercial leasing.",
        "Expressway-driven urban corridors: Dwarka Expressway, Golf Course Extension, and Southern Peripheral Road integrate residential townships with commercial nodes.",
        "Institutional developer presence: Dominated by major national developers delivering integrated mixed-use business parks and luxury gated communities.",
        "Regional logistics and transit integration: Proximity to IGI Airport and the Delhi-Mumbai Industrial Corridor underpins strategic commercial relevance."
      ]
    },
    hyderabad: {
      type: "TECH & PHARMA METROPOLIS",
      desc: "India’s efficiently planned tech and life sciences hub, characterized by modern road grids, large-scale commercial campuses, and scalable urban corridors.",
      stats: [
        { label: "SEGMENT", value: "Technology & Life Sciences" },
        { label: "FRAMEWORK", value: "Master-Planned Zoning" },
        { label: "STATUS", value: "High Absorption" }
      ],
      highlights: [
        "Massive global tech campuses: Host to the largest international engineering facilities outside the US for global technology leaders.",
        "Integrated infrastructure grids: The Outer Ring Road (ORR) provides rapid uninterrupted transit between HITEC City, Financial District, and the international airport.",
        "Global vaccine and life sciences leadership: Genome Valley anchors an internationally recognized hub for pharmaceutical research and biotechnology manufacturing.",
        "Predictable urban planning: Proactive municipal planning and clear zoning policies facilitate structured commercial and residential community delivery."
      ]
    },
    mumbai: {
      type: "FINANCIAL CAPITAL & CORE METRO",
      desc: "India’s financial capital and premier real estate market, defined by corporate headquarters concentration, landmark infrastructure, and prime urban scarcity.",
      stats: [
        { label: "SEGMENT", value: "Financial & Ultra-Prime" },
        { label: "FRAMEWORK", value: "Coastal Infrastructure" },
        { label: "STATUS", value: "High Scarcity" }
      ],
      highlights: [
        "National financial epicenter: Home to the Reserve Bank of India, leading commercial banks, stock exchanges, and multinational institutional funds.",
        "Transformational infrastructure upgrades: Mumbai Trans Harbour Link (Atal Setu) and the Coastal Road dramatically improve island-to-mainland connectivity.",
        "Concentrated commercial CBDs: Bandra-Kurla Complex (BKC) and Lower Parel serve as high-density institutional employment centers.",
        "Scarcity-driven prime urban core: Island city geography creates inherent land constraints, supporting institutional-grade development standards."
      ]
    },
    pune: {
      type: "MANUFACTURING & TECH CORRIDOR",
      desc: "India’s balanced industrial and technology hub, supported by a dual economy of automotive manufacturing and enterprise software campuses.",
      stats: [
        { label: "SEGMENT", value: "Automotive & IT Hub" },
        { label: "FRAMEWORK", value: "Industrial Belt" },
        { label: "STATUS", value: "Balanced Absorption" }
      ],
      highlights: [
        "Dual-engine economic base: Advanced automotive engineering and multinational IT parks create diversified employment across west and east corridors.",
        "Academic and engineering talent reservoir: Renowned educational institutions supply a continuous pipeline of specialized technical and managerial talent.",
        "Corridor-based urban integration: Key business clusters like Hinjewadi and Kharadi are supported by metro expansion and ring road transit upgrades.",
        "Established corporate occupier base: Stable leasing demand from multinational engineering, automotive, and IT service enterprises."
      ]
    },
    singapore: {
      type: "GLOBAL FINANCIAL GATEWAY",
      desc: "Asia’s premier institutional capital and wealth management hub, defined by regulatory stability, asset protection, and ultra-prime real estate positioning.",
      stats: [
        { label: "SEGMENT", value: "Ultra-Prime Safe Haven" },
        { label: "FRAMEWORK", value: "Common Law Governance" },
        { label: "STATUS", value: "Institutional Benchmark" }
      ],
      highlights: [
        "Gold-standard legal and regulatory certainty: Uncompromising rule of law, transparent ownership frameworks, and exceptional capital security.",
        "Global family office and treasury destination: Recognized internationally as the preferred wealth structuring and corporate headquarters hub for the Asia-Pacific.",
        "Strict master-planned supply controls: The Urban Redevelopment Authority (URA) strictly regulates land releases, preserving urban density and living standards.",
        "World-class municipal and port infrastructure: Changi Airport, Tuas Mega Port, and digital infrastructure cement its position as a global trade nexus."
      ]
    },
    indonesia: {
      type: "LARGEST REGIONAL ECONOMY",
      desc: "Southeast Asia’s largest economy, characterized by substantial domestic consumption, industrial development, and prime island hospitality destinations.",
      stats: [
        { label: "SEGMENT", value: "Hospitality & Resource Hub" },
        { label: "FRAMEWORK", value: "PMA & Long Leasehold" },
        { label: "STATUS", value: "Consumer Market" }
      ],
      highlights: [
        "Premier global island destination: Bali represents one of the world's most sought-after leisure destinations with an established luxury villa and eco-resort sector.",
        "Massive domestic economic scale: Population exceeding 275 million drives long-term consumer demand, manufacturing relocation, and urban infrastructure.",
        "Foreign investment structures (PT PMA): Clear corporate investment vehicles allow international entities to hold commercial properties and developments.",
        "Large-scale infrastructure initiatives: Expansion of toll roads, sea ports, and regional airport upgrades improve connectivity across primary islands."
      ]
    },
    thailand: {
      type: "HOSPITALITY & LIFESTYLE HUB",
      desc: "One of Southeast Asia’s most established hospitality and lifestyle property markets, combining international tourism demand with regional commercial expansion.",
      stats: [
        { label: "SEGMENT", value: "Lifestyle & Wellness" },
        { label: "FRAMEWORK", value: "Condominium Freehold" },
        { label: "STATUS", value: "International Tourism" }
      ],
      highlights: [
        "Established Condominium Act foreign freehold quota: Clear legal frameworks permit up to 49% direct foreign ownership in registered condominium developments.",
        "World-leading healthcare and hospitality infrastructure: Renowned medical centers and luxury hospitality brands position Bangkok and Phuket as premier destination hubs.",
        "Extensive public transit and infrastructure networks: Modern mass transit (BTS/MRT) in Bangkok and regional transport links enhance urban mobility.",
        "Lifestyle destination appeal: Vibrant culinary, cultural, and natural attractions sustain global leisure migration and second-home demand."
      ]
    },
    vietnam: {
      type: "MANUFACTURING & INDUSTRIAL HUB",
      desc: "Southeast Asia’s leading manufacturing and export-driven economy, supported by extensive industrial relocation and international trade integration.",
      stats: [
        { label: "SEGMENT", value: "Industrial & Mixed-Use" },
        { label: "FRAMEWORK", value: "FDI Free Trade" },
        { label: "STATUS", value: "Export Driven" }
      ],
      highlights: [
        "Key beneficiary of global supply chain diversification: Electronics, technology manufacturing, and export assembly attract record foreign direct investment.",
        "Extensive free trade network: Comprehensive multilateral agreements (CPTPP, EVFTA, RCEP) provide seamless market access to global economies.",
        "Rapid infrastructure modernization: Major investments in deep-water ports, inter-provincial expressways, and international airports strengthen logistical efficiency.",
        "Expanding urban commercial centers: Ho Chi Minh City and Hanoi are experiencing significant modernization across Grade-A office and residential masterplans."
      ]
    }
  },
  da: {
    dubai: {
      type: "Højlikvid Investering",
      desc: "Den globale hovedstad for ejendomslikviditet, brandet byudvikling og professionelle off-plan projekter.",
      stats: [
        { label: "SEGMENT", value: "Prime Freehold" },
        { label: "RAMMER", value: "RERA-reguleret" },
        { label: "STATUS", value: "Høj likviditet" }
      ],
      highlights: [
        "Globalt likviditetscentrum for videresalg af ejendomme: Dubai tilbyder et af de mest aktive markeder for ejendomshandel globalt, drevet af konstant international køberinteresse og høje transaktionsvolumener.",
        "Udvikling af masterplanlagte megaprojekter (tilpasset Dubai 2040): Storstilet byudvikling fortsætter gennem integrerede distrikter, kystnære byer og transportforbundne samfund under byens langsigtede rammeværk.",
        "Professionelt udviklerøkosystem: Markedet er forankret af etablerede udviklere med solide balancer og dokumenteret erfaring inden for levering af master-samfund.",
        "Strukturerede regulatoriske køberbeskyttelser: Off-plan transaktioner er underlagt lovpligtige spærrede deponeringskonti (escrow), etapevise betalingsplaner og byggetilsyn."
      ]
    },
    'abu-dhabi': {
      type: "PREMIUM CORE MARKED",
      desc: "Det mest institutionelt stabile ejendomsmarked i UAE, drevet af statslig kapital, styret udbud og høj slutbrugerandel.",
      stats: [
        { label: "SEGMENT", value: "Institutionelt Core" },
        { label: "RAMMER", value: "Statsstøttet" },
        { label: "STATUS", value: "Styret udbud" }
      ],
      highlights: [
        "Statsstøttet udviklingsmotor: Abu Dhabis ejendomsmarked er solidt forankret af statsknyttede master-udviklere som Aldar, hvilket skaber et institutionelt stabilt og disciplineret miljø.",
        "Efterspørgsel drevet af faste indbyggere: En stor del af absorptionen bæres af langsigtede beboere og virksomhedsbrugere, hvilket sikrer høj stabilitet i udlejningsgraden i kerneområder.",
        "Udbudsdisciplin i masterplanlagte områder: Nyt udbud frigives gradvist gennem store master-projekter (Yas, Saadiyat, Reem), hvilket opretholder en sund markedsbalance.",
        "Finansielt centrum og klyngeudvikling (ADGM): Udvidelsen af Abu Dhabi Global Market tiltrækker multinationale selskaber, regionale hovedsæder og velstillede professionelle."
      ]
    },
    'ras-al-khaimah': {
      type: "FREMVOKSENDE DESTINATIONSMARKED",
      desc: "UAE's førende fremvoksende livsstils- og turismedrevne ejendomsmarked, anført af hotel- og resortudvikling.",
      stats: [
        { label: "SEGMENT", value: "Hospitality & Kyst" },
        { label: "RAMMER", value: "Masterplanlagt" },
        { label: "STATUS", value: "Fremvoksende hub" }
      ],
      highlights: [
        "Turisme-ledet ejendomsekspansion: Udviklingen er tæt forbundet med store turismeprojekter, ferieresorts og integrerede kystnære boligområder.",
        "Brandede boliger og luksuspositionering: En stigende andel af nye projekter er knyttet til internationale hotelkæder og integrerede resort-koncepter.",
        "Begrænset udbud i kystnære zoner: Ras Al Khaimah råder over uberørte kyststrækninger med lav bebyggelsestæthed og beskyttet kystnatur.",
        "Infrastrukturinvesteringer i destinationen: Lufthavnsudvidelser, forbedrede veje og lystbådehavne styrker tilgængeligheden til emiratet markant."
      ]
    },
    bangalore: {
      type: "TEKNOLOGIDREVET MARKED",
      desc: "Indiens førende teknologimetropol, drevet af IT-erhvervsekspansion, infrastrukturprojekter og reel slutbrugerefterspørgsel.",
      stats: [
        { label: "SEGMENT", value: "Enterprise Tech-hub" },
        { label: "RAMMER", value: "SEZ & Grade-A" },
        { label: "STATUS", value: "IT-efterspørgsel" }
      ],
      highlights: [
        "Global Capability Center (GCC) absorption: Bangalores erhvervsejendomme understøttes massivt af multinationale tech-campusser og forskningscentre.",
        "Infrastrukturdrevet bysammenhæng: Metroforlængelser, Peripheral Ring Road og lufthavnskorridoren forbinder byens centrale erhvervsdistrikter.",
        "Stærk professionel slutbrugerbase: Markedet er domineret af veluddannede teknologiprofessionelle og etablerede familier med stabile boligbehov.",
        "Dyb virksomhedsleje: Førende erhvervsparker i Whitefield, Outer Ring Road og North Bangalore huser globale ingeniør- og IT-hovedkvarterer."
      ]
    },
    chennai: {
      type: "STRATEGISK CORE MARKED",
      desc: "Indiens etablerede slutbrugerdrevne kystby, præget af GCC-ekspansion, industriel robusthed og balanceret markedsabsorption.",
      stats: [
        { label: "SEGMENT", value: "Industri & SaaS" },
        { label: "RAMMER", value: "Produktionskorridor" },
        { label: "STATUS", value: "Slutbruger-drevet" }
      ],
      highlights: [
        "GCC- og IT-campusudvikling: Globale kompetencecentre og SaaS-virksomheder skaber vedvarende efterspørgsel i korridorer som OMR og Guindy.",
        "Industriel produktionsrygrad: Kendt som Indiens produktionshjerte for bilindustrien, hvilket sikrer en stabil lokal beskæftigelse.",
        "Infrastrukturforbedringer: Metrofase 2 og transportkorridorer forbinder ydre logistik- og industriområder med byens centrale dele.",
        "Fokus på integrerede korridorer: Korridorer med direkte adgang til infrastruktur oplever en jævn og stabil erhvervs- og boligabsorption."
      ]
    },
    goa: {
      type: "LIVSSTILS- OG TURISMEHOVEDSTAD",
      desc: "Indiens førende fritids- og livsstilsejendomsmarked, under overgang til en etableret destination for boutique-hospitality og fjernarbejde.",
      stats: [
        { label: "SEGMENT", value: "Livsstil & Hospitality" },
        { label: "RAMMER", value: "Kystplanlagt" },
        { label: "STATUS", value: "Boutique boligmarked" }
      ],
      highlights: [
        "Efterspørgsel på brandede villaer og servicerede boliger: Udviklinger i tilknytning til hospitality-brands tilbyder professionel drift og vedligeholdelse.",
        "Tiltrækning af professionelle og grundlæggere: Tiltagende efterspørgsel fra iværksættere og ledere, der etablerer sekundære boliger i rolige omgivelser.",
        "Beskyttede kystzoner: Strenge byggerestriktioner langs kysten bevarer områdets arkitektoniske særpræg og begrænser overbebyggelse.",
        "Manohar Internationale Lufthavn: Den nye lufthavnsinfrastruktur har forbedret den nationale og internationale tilgængelighed betragteligt."
      ]
    },
    'gurgaon-delhi': {
      type: "VIRKSOMHEDERNES HOVEDKVARTERSHUB",
      desc: "Nordindiens førende erhvervs- og kontorejendomsmarked, anført af multinationale hovedkvarterer, motorvejskorridorer og luksussamfund.",
      stats: [
        { label: "SEGMENT", value: "Fortune 500 Virksomheder" },
        { label: "RAMMER", value: "Motorvejskorridor" },
        { label: "STATUS", value: "Institutionelt knudepunkt" }
      ],
      highlights: [
        "Koncentration af virksomhedshovedkvarterer: Over 250 Fortune 500-regionalkontorer og store konglomerater danner grundlag for Grade-A kontorudlejning.",
        "Motorvejsdrevne bykorridorer: Dwarka Expressway og Golf Course Extension integrerer moderne boligområder direkte med forretningskvarterer.",
        "Institutionelle master-udviklere: Førende nationale udviklere etablerer integrerede erhvervsparker og lukkede boligresortsamfund.",
        "Logistisk knudepunkt i Nordindien: Nærhed til IGI Airport og Delhi-Mumbai Industrial Corridor understøtter byens strategiske position."
      ]
    },
    hyderabad: {
      type: "TECH- OG PHARMA-METROPOL",
      desc: "Indiens velstrukturerede teknologihub, kendetegnet ved moderne vejnet, store erhvervscampusser og skalerbare byzoner.",
      stats: [
        { label: "SEGMENT", value: "Teknologi & Life Science" },
        { label: "RAMMER", value: "Masterplanlagt zone" },
        { label: "STATUS", value: "Høj absorption" }
      ],
      highlights: [
        "Globale tech-giganters campusser: Byen rummer nogle af de største internationale udviklingsafdelinger for globale teknologiselskaber uden for USA.",
        "Integreret vej- og transportnetværk: Outer Ring Road (ORR) muliggør hurtig transport mellem Financial District, HITEC City og lufthavnen.",
        "Globalt life science-centrum: Genome Valley udgør en internationalt anerkendt klynge for bioteknologi og medicinalproduktion.",
        "Struktureret byplanlægning: Fremsynet kommunal planlægning og tydelig zoneinddeling sikrer ordnede rammer for byudviklingen."
      ]
    },
    mumbai: {
      type: "FINANSHUB & KERNEMETROPOL",
      desc: "Indiens finansielle hjerte og mest likvide ejendomsmarked, defineret af bankhovedsæder, markant infrastruktur og begrænset byareal.",
      stats: [
        { label: "SEGMENT", value: "Finans & Ultra-Prime" },
        { label: "RAMMER", value: "Kystinfrastruktur" },
        { label: "STATUS", value: "Høj knaphed" }
      ],
      highlights: [
        "Nationalt finanscentrum: Hjemsted for Indiens centralbank, førende forretningsbanker, børser og institutionelle investeringsfonde.",
        "Banebrydende infrastrukturprojekter: Atal Setu (MTHL) og Coastal Road forbedrer transportforbindelserne på tværs af halvøen markant.",
        "Koncentrerede forretningsdistrikter: Bandra-Kurla Complex (BKC) fungerer som landets førende moderne finansielle centrum.",
        "Knaphed i bykernen: Ø-byens geografi medfører naturlige begrænsninger for nybyggeri, hvilket understøtter høje kvalitetsstandarder."
      ]
    },
    pune: {
      type: "PRODUKTIONS- OG TECH-KORRIDOR",
      desc: "Indiens balancerede industri- og teknologihub, båret af bilproduktion, ingeniørvirksomheder og IT-parker.",
      stats: [
        { label: "SEGMENT", value: "Automotive & IT-hub" },
        { label: "RAMMER", value: "Industribælte" },
        { label: "STATUS", value: "Balanceret absorption" }
      ],
      highlights: [
        "To stærke økonomiske ben: Avanceret bilindustri og internationale IT-parker skaber bred beskæftigelse på tværs af vestlige og østlige korridorer.",
        "Uddannelsesmæssig talentbase: Anerkendte universiteter sikrer en kontinuerlig tilgang af specialiserede ingeniører og ledere.",
        "Korridordrevne bydele: Vigtige knudepunkter som Hinjewadi og Kharadi understøttes af udbygning af metro og ringveje.",
        "Etableret lejersegment: Stabil efterspørgsel på erhvervslejemål fra multinationale ingeniør- og IT-virksomheder."
      ]
    },
    singapore: {
      type: "GLOBAL FINANSIEL PORT",
      desc: "Asiens førende institutionelle kapital- og formueforvaltningshub, defineret af juridisk stabilitet, formuebeskyttelse og eksklusive ejendomme.",
      stats: [
        { label: "SEGMENT", value: "Ultra-Prime Safe Haven" },
        { label: "RAMMER", value: "Common Law Lovgivning" },
        { label: "STATUS", value: "Institutionelt benchmark" }
      ],
      highlights: [
        "Højeste juridiske standard og retssikkerhed: Tydelige ejerskabsregler, gennemsigtighed og markant kapitalbeskyttelse.",
        "Internationalt family office-centrum: Anerkendt globalt som den foretrukne placering for formuestrukturering og Asien-hovedsæder.",
        "Stramt planlagt udbudskontrol: Byplanmyndigheden (URA) styrer udbuddet af byggegrunde nøje, hvilket fastholder byens høje standarder.",
        "Infrastruktur i særklasse: Changi Airport, Tuas Mega Port og digital infrastruktur fastholder bystatens position som internationalt handelsknudepunkt."
      ]
    },
    indonesia: {
      type: "REGIONENS STØRSTE ØKONOMI",
      desc: "Sydøstasiens største økonomi, karakteriseret ved stærkt indenlandsk forbrug, industriudbygning og førende resortdestinationer.",
      stats: [
        { label: "SEGMENT", value: "Hospitality & Ressourcehub" },
        { label: "RAMMER", value: "PMA & Langtidsleasing" },
        { label: "STATUS", value: "Forbrugermarked" }
      ],
      highlights: [
        "Verdensførende ø-destination: Bali udgør et af verdens mest eftertragtede feriemål med en udbygget sektor for luksusvillaer og boutique-resorts.",
        "Omfattende indenlandsk marked: En befolkning på over 275 millioner understøtter langsigtet forbrugsefterspørgsel og infrastrukturudbygning.",
        "Investeringsstrukturer (PT PMA): Tydelige selskabsstrukturer gør det muligt for internationale investorer at erhverve og drive erhvervsprojekter.",
        "Markante infrastrukturprojekter: Nye motorveje, havneudvidelser og opgraderede lufthavne forbedrer sammenhængen mellem de vigtigste øer."
      ]
    },
    thailand: {
      type: "HOSPITALITY- OG LIVSSTILSHUB",
      desc: "Et af Sydøstasiens mest etablerede hospitality- og livsstilsmarkeder, der forener international turisme med regional forretningsekspansion.",
      stats: [
        { label: "SEGMENT", value: "Livsstil & Wellness" },
        { label: "RAMMER", value: "Condominium Freehold" },
        { label: "STATUS", value: "International turisme" }
      ],
      highlights: [
        "Etableret ejerlejlighedslovgivning: Den thailandske Condominium Act tillader op til 49% direkte udenlandsk freehold-ejerskab i godkendte byggerier.",
        "Hospitality og sundhedssektor i særklasse: Anerkendte privathospitaler og internationale hotelbrands positionerer Bangkok og Phuket stærkt.",
        "Omfattende kollektiv infrastruktur: Moderne storbynetværk (BTS/MRT) i Bangkok og regionale transportforbindelser letter den daglige mobilitet.",
        "Attraktiv livsstilsdestination: Det rige udbud af gastronomi, kultur og naturoplevelser tiltrækker internationale tilflyttere og ferieboligkøbere."
      ]
    },
    vietnam: {
      type: "PRODUKTIONS- OG INDUSTRIHUB",
      desc: "Sydøstasiens førende produktions- og eksportøkonomi, understøttet af international industriflytning og tæt global handelsintegration.",
      stats: [
        { label: "SEGMENT", value: "Industri & Mixed-Use" },
        { label: "RAMMER", value: "FDI Frihandelsaftaler" },
        { label: "STATUS", value: "Eksportdrevet" }
      ],
      highlights: [
        "Centrum for globale forsyningskæder: Elektronik- og højteknologiproduktion tiltrækker rekordstore mængder direkte udenlandske investeringer (FDI).",
        "Bredt frihandelsnetværk: Omfattende multilaterale handelsaftaler (CPTPP, EVFTA, RCEP) sikrer direkte adgang til globale markeder.",
        "Hurtig infrastrukturmodernisering: Store investeringer i dybvandshavne, motorveje og internationale lufthavne styrker logistikeffektiviteten.",
        "Moderne bycentre: Ho Chi Minh City og Hanoi oplever en markant opgradering af Grade-A kontorbyggerier og moderne bykvarterer."
      ]
    }
  }
};
