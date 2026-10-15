/**
 * Server-side Pre-rendering Engine for Univue Consultants ApS
 * Generates full semantic HTML, body text, metadata, and structured data
 * for search engines, AI crawlers (Claude, ChatGPT, Perplexity), and initial page loads.
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  schema: object;
}

const BASE_URL = "https://univueconsultants.com";

const sharedNav = `
<header class="univue-header" role="banner" style="background-color: #0B1F3A; color: #FDFCF5; border-bottom: 1px solid rgba(200, 169, 106, 0.2); position: sticky; top: 0; z-index: 50; padding: 1rem 1.5rem;">
  <div style="max-width: 80rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
    <a href="/" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: #FDFCF5;">
      <span style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; letter-spacing: 0.05em; font-weight: 500;">UNIVUE</span>
      <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; border-left: 1px solid rgba(200, 169, 106, 0.4); padding-left: 0.75rem;">Consultants ApS</span>
    </a>
    <nav role="navigation" aria-label="Main Navigation" style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
      <a href="/about" style="color: #FDFCF5; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">About Us</a>
      <a href="/services" style="color: #FDFCF5; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Services</a>
      <a href="/uae" style="color: #FDFCF5; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">UAE Markets</a>
      <a href="/india" style="color: #FDFCF5; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">India Expansion</a>
      <a href="/southeast-asia" style="color: #FDFCF5; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Southeast Asia</a>
      <a href="/insights" style="color: #FDFCF5; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Research</a>
      <a href="/market-catalog" style="color: #FDFCF5; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Properties</a>
      <a href="/book" style="background-color: #C8A96A; color: #0B1F3A; padding: 0.5rem 1.25rem; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; border: 1px solid #C8A96A;">Schedule Briefing</a>
    </nav>
  </div>
</header>
`;

const sharedFooter = `
<footer class="univue-footer" role="contentinfo" style="background-color: #0B1F3A; color: #FDFCF5; border-top: 1px solid rgba(200, 169, 106, 0.2); padding: 4rem 1.5rem 2rem 1.5rem; margin-top: auto;">
  <div style="max-width: 80rem; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2.5rem; margin-bottom: 3rem;">
    <div>
      <div style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #FDFCF5; margin-bottom: 0.5rem;">UNIVUE CONSULTANTS</div>
      <p style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem;">International Cross-Border Advisory</p>
      <p style="color: rgba(253, 252, 245, 0.7); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
        Turnkey advisory firm specializing in Dubai real estate investment, capital allocation, and Indian operational corporate expansion for European investors and companies.
      </p>
      <p style="color: rgba(253, 252, 245, 0.5); font-size: 0.8rem;">
        CVR: 43834665 (Danish Business Registration)<br />
        Registered Office: Copenhagen, Denmark
      </p>
    </div>
    <div>
      <h3 style="color: #C8A96A; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; font-family: 'Bodoni Moda', serif;">Strategic Corridors</h3>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem;">
        <li><a href="/uae" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">United Arab Emirates (Dubai, Abu Dhabi, RAK)</a></li>
        <li><a href="/india" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">India (Bangalore, Gurgaon, Mumbai, Chennai)</a></li>
        <li><a href="/southeast-asia" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Southeast Asia (Singapore & Regional Gateways)</a></li>
        <li><a href="/market-catalog" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Advisor's Choice Real Estate Portfolio</a></li>
        <li><a href="/insights" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Macro Insights & Editorial Analysis</a></li>
      </ul>
    </div>
    <div>
      <h3 style="color: #C8A96A; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; font-family: 'Bodoni Moda', serif;">Advisory Services</h3>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem;">
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Off-Plan Real Estate Sourcing</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Cross-Border Portfolio Positioning</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Transaction & Escrow Legal Coordination</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">India Commercial Workspace & Market Entry</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Golden Visa & Corporate Structuring</a></li>
      </ul>
    </div>
    <div>
      <h3 style="color: #C8A96A; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; font-family: 'Bodoni Moda', serif;">Direct Contact</h3>
      <p style="color: rgba(253, 252, 245, 0.8); font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.75rem;">
        Telephone: <a href="tel:+4526378270" style="color: #C8A96A; text-decoration: none; font-weight: 600;">+45 26 37 82 70</a><br />
        Email: <a href="mailto:info@univueconsultants.com" style="color: #C8A96A; text-decoration: none;">info@univueconsultants.com</a>
      </p>
      <p style="color: rgba(253, 252, 245, 0.7); font-size: 0.85rem; margin-bottom: 1.25rem;">
        Private briefing sessions available at our Copenhagen headquarters or online via secure executive conference.
      </p>
      <a href="/book" style="display: inline-block; background-color: transparent; border: 1px solid #C8A96A; color: #C8A96A; padding: 0.5rem 1rem; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;">Schedule Consultation</a>
    </div>
  </div>
  <div style="max-width: 80rem; margin: 0 auto; border-top: 1px solid rgba(253, 252, 245, 0.1); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.75rem; color: rgba(253, 252, 245, 0.5);">
    <p>© ${new Date().getFullYear()} Univue Consultants ApS. All rights reserved. Danish CVR: 43834665.</p>
    <div style="display: flex; gap: 1.5rem;">
      <a href="/about" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">About</a>
      <a href="/services" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">Services</a>
      <a href="/questionnaire" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">Assessment</a>
      <a href="/book" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">Briefing</a>
    </div>
  </div>
</footer>
`;

function renderHomeBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <!-- Hero Section -->
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem 6rem 1.5rem; position: relative; overflow: hidden; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <span style="display: inline-block; color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 600;">
        Univue Consultants ApS | International Advisory
      </span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.1; margin: 0 0 1.5rem 0; font-weight: 400; letter-spacing: -0.02em;">
        Opening Doors Across <span style="color: #C8A96A; font-style: italic;">Borders.</span>
      </h1>
      <p style="font-size: clamp(1.1rem, 2vw, 1.4rem); line-height: 1.6; max-width: 48rem; color: rgba(253, 252, 245, 0.85); margin-bottom: 2.5rem; font-weight: 300;">
        Turnkey cross-border coordination supported through strategic real estate partner networks, including RE/MAX-linked collaborations and Tier-1 developers across the UAE, India, and Southeast Asian markets.
      </p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="/book" style="background-color: #C8A96A; color: #0B1F3A; padding: 1rem 2.25rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          Schedule Briefing
        </a>
        <a href="/market-catalog" style="border: 1px solid rgba(200, 169, 106, 0.5); color: #C8A96A; padding: 1rem 2.25rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          Explore Opportunities
        </a>
      </div>
    </div>
  </section>

  <!-- Key Corridors Overview -->
  <section style="max-width: 80rem; margin: -2.5rem auto 4rem auto; padding: 0 1.5rem; position: relative; z-index: 10;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid rgba(11, 31, 58, 0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Corridor 01</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; margin: 0.5rem 0 1rem 0; color: #0B1F3A;">United Arab Emirates</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem;">
          Dubai, Abu Dhabi, and Ras Al Khaimah (Al Marjan Island). Strategic off-plan luxury residences, 0% personal tax environment, and 6–10% projected rental yields backed by Tier-1 developers.
        </p>
        <a href="/uae" style="color: #0B1F3A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #C8A96A; padding-bottom: 0.25rem;">
          Explore UAE Markets →
        </a>
      </article>

      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid rgba(11, 31, 58, 0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Corridor 02</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; margin: 0.5rem 0 1rem 0; color: #0B1F3A;">India Expansion</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem;">
          Bangalore IT Hub, Gurgaon Cyber City, and Mumbai BKC. Turnkey market entry, Grade-A commercial setups, talent acquisition coordination, and FDI compliance for European enterprises.
        </p>
        <a href="/india" style="color: #0B1F3A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #C8A96A; padding-bottom: 0.25rem;">
          Explore India Expansion →
        </a>
      </article>

      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid rgba(11, 31, 58, 0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Corridor 03</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; margin: 0.5rem 0 1rem 0; color: #0B1F3A;">Southeast Asia</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem;">
          Singapore family office and treasury hubs, Bangkok prime residential, and high-growth ASEAN capital corridors connecting Europe, the Middle East, and Asia.
        </p>
        <a href="/southeast-asia" style="color: #0B1F3A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #C8A96A; padding-bottom: 0.25rem;">
          Explore Southeast Asia →
        </a>
      </article>
    </div>
  </section>

  <!-- Featured Investment Opportunities -->
  <section style="max-width: 80rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="text-align: center; margin-bottom: 3.5rem;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Advisors' Selection</span>
      <h2 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2rem, 3.5vw, 3rem); color: #0B1F3A; margin: 0.5rem 0;">
        Featured Cross-Border Assets
      </h2>
      <p style="color: #6b7280; font-size: 1.1rem; max-width: 36rem; margin: 0 auto; font-weight: 300;">
        Curated institutional and private client investments with pre-negotiated terms and strong growth theses.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Dubai, UAE • Emaar Properties</span>
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; margin: 0.5rem 0; color: #0B1F3A;">The Oasis by Emaar</h3>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
          Strategic luxury expansion with limited waterfront villas. Ideal for capital preservation, strong secondary liquidity, and high rental demand from international high-net-worth families.
        </p>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 1rem; font-size: 0.9rem; font-weight: 600;">
          <span style="color: #0B1F3A;">Expected Yield: 7.2%</span>
          <span style="color: #C8A96A;">From $1.2M</span>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Ras Al Khaimah, UAE • Marjan / Wynn</span>
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; margin: 0.5rem 0; color: #0B1F3A;">Wynn Residences, Al Marjan</h3>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
          First-mover advantage in the GCC's only integrated gaming and luxury resort destination. Exceptional upside potential driven by multi-billion infrastructure completion.
        </p>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 1rem; font-size: 0.9rem; font-weight: 600;">
          <span style="color: #0B1F3A;">Capital Growth: 12%+</span>
          <span style="color: #C8A96A;">From $850k</span>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Bangalore, India • Prestige Group</span>
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; margin: 0.5rem 0; color: #0B1F3A;">North Bangalore Commercial Tech Hub</h3>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
          Grade-A commercial workspace in India's leading technology corridor. High pre-leasing velocity by multinational technology leaders securing institutional cash flows.
        </p>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 1rem; font-size: 0.9rem; font-weight: 600;">
          <span style="color: #0B1F3A;">Commercial Yield: 8.5%</span>
          <span style="color: #C8A96A;">From $500k</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Partner Developers & Strategic Network -->
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 4.5rem 1.5rem; margin-top: 4rem;">
    <div style="max-width: 80rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Direct Developer Access</span>
      <h2 style="font-family: 'Bodoni Moda', serif; font-size: clamp(1.8rem, 3vw, 2.8rem); margin: 0.5rem 0 2rem 0;">
        Tier-1 Institutional Alliances
      </h2>
      <p style="color: rgba(253, 252, 245, 0.75); font-size: 1.05rem; max-width: 44rem; margin: 0 auto 3rem auto; line-height: 1.6;">
        Univue provides European clients direct, priority allocations and pre-launch pricing through strategic relationships with leading master developers and brokerage alliances:
      </p>
      <div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap; opacity: 0.9;">
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">EMAAR</span>
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">SOBHA REALTY</span>
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">DAMAC</span>
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">BINGHATTI</span>
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">AZIZI</span>
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">WASL</span>
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">PRESTIGE GROUP</span>
        <span style="font-family: 'Bodoni Moda', serif; font-size: 1.4rem; letter-spacing: 0.15em;">DLF LIMITED</span>
      </div>
    </div>
  </section>

  <!-- Who We Work With -->
  <section style="max-width: 80rem; margin: 5rem auto; padding: 0 1.5rem;">
    <div style="text-align: center; margin-bottom: 3.5rem;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Client Engagement</span>
      <h2 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2rem, 3.5vw, 3rem); color: #0B1F3A; margin: 0.5rem 0;">
        Who We Work With
      </h2>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
      <div style="background: #ffffff; padding: 2rem; border-left: 3px solid #0B1F3A; border: 1px solid #e5e7eb;">
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.3rem; color: #0B1F3A; margin-bottom: 0.75rem;">Private Wealth & Investors</h3>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6;">
          European high-net-worth individuals and family offices seeking capital diversification, tax-optimized yields, and UAE residency through real estate acquisitions.
        </p>
      </div>

      <div style="background: #ffffff; padding: 2rem; border-left: 3px solid #0B1F3A; border: 1px solid #e5e7eb;">
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.3rem; color: #0B1F3A; margin-bottom: 0.75rem;">Expanding Tech & Enterprise</h3>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6;">
          Nordic and European businesses establishing engineering hubs and operational subsidiaries in Bangalore and Delhi NCR with compliant legal structures.
        </p>
      </div>

      <div style="background: #ffffff; padding: 2rem; border-left: 3px solid #0B1F3A; border: 1px solid #e5e7eb;">
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.3rem; color: #0B1F3A; margin-bottom: 0.75rem;">International Entrepreneurs</h3>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6;">
          Founders expanding into GCC free zones (DIFC, DMCC, ADGM), requiring corporate banking setup, Golden Visa facilitation, and local commercial leases.
        </p>
      </div>

      <div style="background: #ffffff; padding: 2rem; border-left: 3px solid #0B1F3A; border: 1px solid #e5e7eb;">
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.3rem; color: #0B1F3A; margin-bottom: 0.75rem;">Family Offices & Groups</h3>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6;">
          Institutional-grade portfolio allocation, currency risk mitigation, and commercial asset acquisition across cross-border high-growth corridors.
        </p>
      </div>
    </div>
  </section>

  <!-- Executive CTA Briefing Banner -->
  <section style="background-color: #FDFCF5; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 5rem 1.5rem; text-align: center;">
    <div style="max-width: 48rem; margin: 0 auto;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Initiate Discussion</span>
      <h2 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2rem, 3.5vw, 3rem); color: #0B1F3A; margin: 0.75rem 0 1.5rem 0;">
        Schedule Your Private Strategic Briefing
      </h2>
      <p style="color: #4b5563; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
        Speak directly with an executive advisor in Copenhagen or connect virtually to evaluate specific asset allocations, corporate expansion feasibility, or market entry timelines.
      </p>
      <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;">
          Book Consultation
        </a>
        <a href="/questionnaire" style="border: 1px solid #0B1F3A; color: #0B1F3A; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;">
          Take Investor Assessment
        </a>
      </div>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderAboutBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">About Univue Consultants ApS</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Leadership & Cross-Border Mission
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 48rem; margin: 0 auto; line-height: 1.6; font-style: italic;">
        "Bridging the strategic gap for European capital and expanding businesses venturing into the high-growth markets of the UAE, India, and Southeast Asia."
      </p>
    </div>
  </section>

  <!-- Mission & Thesis -->
  <section style="max-width: 72rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem; align-items: center;">
      <div>
        <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Our Purpose</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 2.2rem; color: #0B1F3A; margin: 0.5rem 0 1.5rem 0;">
          Navigating Complexity with Danish Governance & Local Execution
        </h2>
        <p style="color: #4b5563; font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.25rem;">
          Cross-border expansion into the UAE and South Asia represents immense financial upside, but it is accompanied by distinct regulatory, cultural, and transactional complexities. Traditional brokerages prioritize single asset sales, while conventional management consultancies lack localized real estate execution.
        </p>
        <p style="color: #4b5563; font-size: 1.05rem; line-height: 1.7;">
          Univue Consultants ApS provides an independent, turnkey fiduciary bridge. Registered in Denmark (CVR: 43834665), we combine rigorous Nordic compliance and investor protection with established, senior-level relationships across Dubai, Abu Dhabi, Bangalore, and Singapore.
        </p>
      </div>

      <div style="background: #ffffff; padding: 3rem; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-top: 4px solid #C8A96A;">
        <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin-bottom: 1rem;">Core Values</h3>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.5rem;">
          <li>
            <strong style="color: #0B1F3A; font-size: 1.05rem; display: block; margin-bottom: 0.25rem;">1. Absolute Independence</strong>
            <span style="color: #6b7280; font-size: 0.95rem; line-height: 1.5;">We operate on behalf of our clients, not single property developers, providing objective due diligence and transparent yield analyses.</span>
          </li>
          <li>
            <strong style="color: #0B1F3A; font-size: 1.05rem; display: block; margin-bottom: 0.25rem;">2. Turnkey Accountability</strong>
            <span style="color: #6b7280; font-size: 0.95rem; line-height: 1.5;">From initial thesis formulation to escrow signing, legal incorporation, and operational onboarding, we steward the entire lifecycle.</span>
          </li>
          <li>
            <strong style="color: #0B1F3A; font-size: 1.05rem; display: block; margin-bottom: 0.25rem;">3. High-Discipline Corridors</strong>
            <span style="color: #6b7280; font-size: 0.95rem; line-height: 1.5;">Specialized focus on high-conviction hubs: UAE tax-free wealth preservation and Indian Grade-A commercial scaling.</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Leadership -->
  <section style="background-color: #ffffff; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 5rem 1.5rem;">
    <div style="max-width: 60rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Executive Leadership</span>
      <h2 style="font-family: 'Bodoni Moda', serif; font-size: 2.5rem; color: #0B1F3A; margin: 0.5rem 0 2rem 0;">
        Nimmi Schou
      </h2>
      <p style="color: #C8A96A; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 1.5rem;">
        Founder & Managing Partner
      </p>
      <p style="color: #4b5563; font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
        With deep experience guiding European enterprises and high-net-worth investors through cross-border real estate and operational transitions, Nimmi leads Univue's international client engagements. Her focus is on structuring bespoke capital allocations and ensuring seamless alignment between Danish regulatory standards and dynamic Middle Eastern and Indian growth corridors.
      </p>
      <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 0.85rem 2rem; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        Request Direct Meeting
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderServicesBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Tailored Cross-Border Advisory</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Our Core Advisory Pillars
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; line-height: 1.6;">
        From premier off-plan real estate allocations in Dubai to corporate operational setup in Bangalore, our services are designed for turnkey execution.
      </p>
    </div>
  </section>

  <section style="max-width: 76rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem;">
      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid #e5e7eb; border-top: 3px solid #C8A96A;">
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin-bottom: 1rem;">1. Off-Plan Real Estate Sourcing</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Direct developer allocations and pre-launch access to premium residential and commercial developments across Dubai, Abu Dhabi, and Ras Al Khaimah.
        </p>
        <ul style="color: #6b7280; font-size: 0.85rem; line-height: 1.6; padding-left: 1.25rem;">
          <li>Tier-1 developers: Emaar, Sobha, Damac, Binghatti, Aldar</li>
          <li>Independent rental yield and capital appreciation modeling</li>
          <li>Escrow account verification and milestone oversight</li>
        </ul>
      </article>

      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid #e5e7eb; border-top: 3px solid #C8A96A;">
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin-bottom: 1rem;">2. Cross-Border Portfolio Positioning</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Strategic wealth diversification for European clients seeking hard asset positioning outside the Eurozone and exposure to USD-pegged economies.
        </p>
        <ul style="color: #6b7280; font-size: 0.85rem; line-height: 1.6; padding-left: 1.25rem;">
          <li>Currency risk mitigation and inflation hedging</li>
          <li>Long-term vs. short-term rental optimization strategies</li>
          <li>Exit liquidity planning and secondary market resale management</li>
        </ul>
      </article>

      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid #e5e7eb; border-top: 3px solid #C8A96A;">
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin-bottom: 1rem;">3. Transaction & Legal Coordination</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Fiduciary representation throughout cross-border acquisitions to protect European capital under local UAE Land Department (DLD) and RERA frameworks.
        </p>
        <ul style="color: #6b7280; font-size: 0.85rem; line-height: 1.6; padding-left: 1.25rem;">
          <li>Power of Attorney (PoA) and remote transaction execution</li>
          <li>Sales & Purchase Agreement (SPA) contract due diligence</li>
          <li>Escrow payment verification and Title Deed handover registration</li>
        </ul>
      </article>

      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid #e5e7eb; border-top: 3px solid #C8A96A;">
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin-bottom: 1rem;">4. India Corporate Expansion</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Comprehensive market entry for European technology and manufacturing firms establishing operational and engineering centers in India.
        </p>
        <ul style="color: #6b7280; font-size: 0.85rem; line-height: 1.6; padding-left: 1.25rem;">
          <li>Bangalore, Gurgaon, and Mumbai ecosystem evaluation</li>
          <li>Wholly-owned subsidiary structuring and FDI compliance</li>
          <li>Senior leadership recruitment coordination and local vendor audit</li>
        </ul>
      </article>

      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid #e5e7eb; border-top: 3px solid #C8A96A;">
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin-bottom: 1rem;">5. Commercial Real Estate & Workspace</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Grade-A commercial office acquisition, lease negotiation, and managed infrastructure solutions in primary business hubs.
        </p>
        <ul style="color: #6b7280; font-size: 0.85rem; line-height: 1.6; padding-left: 1.25rem;">
          <li>Office asset sourcing with prestige developers (DLF, Prestige, Embassy)</li>
          <li>Tenant-favorable lease structuring and lock-in term advisory</li>
          <li>Fit-out project management and connectivity infrastructure</li>
        </ul>
      </article>

      <article style="background: #ffffff; padding: 2.5rem; border: 1px solid #e5e7eb; border-top: 3px solid #C8A96A;">
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin-bottom: 1rem;">6. Golden Visa & Free Zone Incorporation</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Turnkey residency and corporate licensing facilitation in premier UAE jurisdictions including DIFC, DMCC, and ADGM.
        </p>
        <ul style="color: #6b7280; font-size: 0.85rem; line-height: 1.6; padding-left: 1.25rem;">
          <li>10-Year UAE Golden Visa processing via property investment ($545k+)</li>
          <li>Free Zone corporate registration and tax residency certification</li>
          <li>Corporate and private banking onboarding support</li>
        </ul>
      </article>
    </div>

    <div style="text-align: center; margin-top: 4rem;">
      <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        Discuss Your Advisory Scope
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderUAEBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">GCC Growth Corridor</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        United Arab Emirates Investment Markets
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; line-height: 1.6;">
        Dubai, Abu Dhabi, and Ras Al Khaimah. High rental yields (6–10%), 0% personal income tax, USD-pegged stability, and 10-year Golden Visa residency for European capital.
      </p>
    </div>
  </section>

  <section style="max-width: 76rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem;">
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Global Megacity Hub</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Dubai Prime Districts</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Downtown Dubai, Palm Jumeirah, Dubai Hills Estate, Business Bay, and Dubai Creek Harbour. Unmatched liquidity, world-class infrastructure, and resilient short- and long-term rental demand from international professionals and HNWI relocations.
        </p>
        <p style="font-size: 0.9rem; font-weight: 600; color: #0B1F3A;">Typical Rental Yields: 7.0% – 9.5% Net</p>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Cultural & Sovereign Capital</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Abu Dhabi (Saadiyat & Yas)</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Saadiyat Cultural District (Louvre Abu Dhabi, Guggenheim, Zayed National Museum) and Al Maryah Island Financial Free Zone. Strict supply caps and high sovereign institutional backing ensure long-term capital preservation.
        </p>
        <p style="font-size: 0.9rem; font-weight: 600; color: #0B1F3A;">Typical Rental Yields: 6.5% – 7.8% Net</p>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Gaming & Tourism Frontier</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Ras Al Khaimah (RAK)</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Al Marjan Island, home to the multi-billion-dollar Wynn Integrated Resort and gaming center. Projected to create dramatic tourism inflows and land value appreciation, representing the highest capital growth potential in the UAE.
        </p>
        <p style="font-size: 0.9rem; font-weight: 600; color: #0B1F3A;">Expected Capital Growth: 12% – 18% p.a.</p>
      </article>
    </div>

    <!-- Golden Visa Box -->
    <div style="background: #ffffff; border: 1px solid rgba(200, 169, 106, 0.4); padding: 3rem; margin-top: 3rem; border-left: 4px solid #C8A96A;">
      <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.6rem; color: #0B1F3A; margin-bottom: 0.75rem;">
        UAE 10-Year Golden Visa via Property Acquisition
      </h3>
      <p style="color: #4b5563; font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem;">
        Purchasing real estate valued at 2,000,000 AED (~$545,000 USD / ~3.8M DKK) or greater qualifies investors and their immediate families for the renewable 10-year UAE Golden Visa. Benefits include 100% foreign ownership, freedom to reside abroad without visa cancellation, and access to the UAE banking and corporate network. Univue provides end-to-end processing.
      </p>
      <a href="/book" style="color: #0B1F3A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #C8A96A; padding-bottom: 0.25rem;">
        Inquire About Golden Visa Portfolios →
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderIndiaBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">High-Growth Operational Expansion</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        India Operations & Corporate Advisory
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; line-height: 1.6;">
        Empowering European enterprises to establish engineering capabilities, tech delivery centers, and Grade-A commercial footprints across Bangalore, Gurgaon, Mumbai, and Chennai.
      </p>
    </div>
  </section>

  <section style="max-width: 76rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem;">
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Silicon Valley of Asia</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Bangalore Tech Corridor</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Outer Ring Road, North Bangalore, and Whitefield. The epicentre of global engineering centers (GCCs) housing over 400 Fortune 500 tech hubs. High availability of Tier-1 software engineering talent and specialized commercial parks.
        </p>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Corporate Headquarters</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Gurgaon / Delhi NCR</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Cyber City, Golf Course Extension Road, and Aerocity. The premier address for multinational corporate headquarters, professional consulting firms, and central government liaison teams.
        </p>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Financial Capital</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Mumbai (BKC)</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Bandra Kurla Complex (BKC) and South Mumbai. The nucleus of India's capital markets, private equity funds, and cross-border investment banking institutions.
        </p>
      </article>
    </div>

    <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 3rem; margin-top: 3rem;">
      <h3 style="font-family: 'Bodoni Moda', serif; font-size: 1.6rem; color: #0B1F3A; margin-bottom: 1rem;">
        Turnkey Market Entry Framework
      </h3>
      <p style="color: #4b5563; font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem;">
        Expanding into India without local presence leads to prolonged setup delays and vendor misalignments. Univue oversees the entire expansion roadmap: company incorporation (Pvt Ltd / Branch Office), RBI and FDI filings, commercial workspace leasing with Prestige and DLF, and senior leadership talent vetting.
      </p>
      <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 0.85rem 2rem; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        Schedule India Briefing
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderSoutheastAsiaBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">ASEAN Financial Corridors</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Southeast Asia Growth Markets
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; line-height: 1.6;">
        Connecting European private capital and enterprise operations with high-growth ASEAN economic centers: Singapore treasury hubs, Bangkok prime residential, and regional trade corridors.
      </p>
    </div>
  </section>

  <section style="max-width: 76rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem;">
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Sovereign Wealth & Family Office Hub</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Singapore</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6;">
          Global regulatory benchmark, AAA credit rating, Section 13O / 13U family office tax incentive structures, and regional treasury headquarters for cross-border Asian expansion.
        </p>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Lifestyle & Regional Commercial Hub</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">Bangkok & Thailand</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6;">
          Prime luxury residential in Sukhumvit and Sathorn, dynamic regional tourism, and competitive corporate operational headquarters for ASEAN market distribution.
        </p>
      </article>
    </div>

    <div style="text-align: center; margin-top: 4rem;">
      <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        Inquire on Southeast Asian Portfolios
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderInsightsBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Macroeconomic Research & Intelligence</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Market Insights & Policy Briefs
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; line-height: 1.6;">
        Quantitative analysis, real estate yield benchmarking, tax treaty developments, and macroeconomic commentary for international asset allocators.
      </p>
    </div>
  </section>

  <section style="max-width: 76rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2.5rem;">
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Macro Analysis • UAE</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.6rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">
          Dubai Yield Dynamics: Prime Residential vs. Commercial Growth
        </h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          An examination of gross rental yields across Downtown Dubai, Dubai Marina, and Palm Jumeirah in relation to secondary market liquidity and corporate tax implementations.
        </p>
        <span style="color: #6b7280; font-size: 0.85rem;">Published by Univue Research Desk</span>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Policy & Taxation • Europe / GCC</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.6rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">
          European Cross-Border Wealth Relocation and Golden Visa Frameworks
        </h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Navigating Danish and European exit taxation regimes when acquiring UAE real estate assets or establishing holding vehicles in DIFC and ADGM.
        </p>
        <span style="color: #6b7280; font-size: 0.85rem;">Published by Univue Research Desk</span>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Market Expansion • India</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.6rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">
          Grade-A Commercial Absorption in Bangalore: Why Tech GCCs Drive Rents
        </h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Why multinational engineering demand continues to generate 8-9% commercial rental yields and low vacancy rates in Prestige and DLF technology corridors.
        </p>
        <span style="color: #6b7280; font-size: 0.85rem;">Published by Univue Research Desk</span>
      </article>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderCatalogBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Curated Properties & Assets</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Exclusive Market Catalog
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; line-height: 1.6;">
        Advisor's choice off-plan developments, prime luxury villas, penthouses, and Grade-A commercial workspaces across Dubai, Abu Dhabi, RAK, and Bangalore.
      </p>
    </div>
  </section>

  <section style="max-width: 76rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Dubai, UAE • Emaar Properties</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin: 0.5rem 0;">The Oasis by Emaar</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
          Waterfront luxury mansions with 7.2% expected rental yield. Strategic master community.
        </p>
        <p style="font-weight: 700; color: #0B1F3A;">Price: From $1,200,000 USD</p>
        <a href="/book" style="display: inline-block; margin-top: 1rem; color: #C8A96A; font-weight: 700; text-decoration: none; text-transform: uppercase; font-size: 0.8rem;">Inquire with Advisor →</a>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Abu Dhabi, UAE • Aldar</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin: 0.5rem 0;">Saadiyat Lagoons</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
          Cultural district luxury villas adjacent to the Louvre Abu Dhabi. Strong institutional backing.
        </p>
        <p style="font-weight: 700; color: #0B1F3A;">Price: From $1,800,000 USD</p>
        <a href="/book" style="display: inline-block; margin-top: 1rem; color: #C8A96A; font-weight: 700; text-decoration: none; text-transform: uppercase; font-size: 0.8rem;">Inquire with Advisor →</a>
      </article>

      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">Ras Al Khaimah, UAE • Marjan</span>
        <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.5rem; color: #0B1F3A; margin: 0.5rem 0;">Wynn Residences, Al Marjan</h2>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
          Integrated resort luxury residences offering 12%+ capital growth. Exclusive casino proximity.
        </p>
        <p style="font-weight: 700; color: #0B1F3A;">Price: From $850,000 USD</p>
        <a href="/book" style="display: inline-block; margin-top: 1rem; color: #C8A96A; font-weight: 700; text-decoration: none; text-transform: uppercase; font-size: 0.8rem;">Inquire with Advisor →</a>
      </article>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderBookingBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Executive Consultation</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Schedule Your Strategic Briefing
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        Book a confidential 30-minute private consultation with an international advisory partner in Copenhagen or via secure video conference.
      </p>
    </div>
  </section>

  <section style="max-width: 50rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 3rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
      <h2 style="font-family: 'Bodoni Moda', serif; font-size: 2rem; color: #0B1F3A; margin-bottom: 1rem;">
        Direct Executive Access
      </h2>
      <p style="color: #4b5563; font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem;">
        Whether evaluating an off-plan property purchase in Dubai, exploring the UAE 10-Year Golden Visa, or structuring an operational subsidiary in Bangalore, our senior advisors are at your service.
      </p>
      
      <div style="background: #FDFCF5; padding: 2rem; border: 1px solid #e5e7eb; margin-bottom: 2rem; text-align: left;">
        <h3 style="font-size: 1.1rem; color: #0B1F3A; margin-bottom: 0.75rem; font-weight: 700;">Direct Phone & Office:</h3>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0 0 0.5rem 0;">
          <strong>Phone:</strong> <a href="tel:+4526378270" style="color: #0B1F3A; font-weight: 600;">+45 26 37 82 70</a>
        </p>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0 0 0.5rem 0;">
          <strong>Email:</strong> <a href="mailto:info@univueconsultants.com" style="color: #0B1F3A;">info@univueconsultants.com</a>
        </p>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0;">
          <strong>Copenhagen HQ:</strong> Univue Consultants ApS, Copenhagen, Denmark (CVR: 43834665)
        </p>
      </div>

      <a href="tel:+4526378270" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        Call +45 26 37 82 70
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderQuestionnaireBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Strategic Assessment</span>
      <h1 style="font-family: 'Bodoni Moda', serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Investor Profile & Expansion Evaluation
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        Complete our confidential 2-minute strategic questionnaire to receive customized market models, yield simulations, and tailored asset selections.
      </p>
    </div>
  </section>

  <section style="max-width: 50rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 3rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <h2 style="font-family: 'Bodoni Moda', serif; font-size: 1.8rem; color: #0B1F3A; margin-bottom: 1.5rem; text-align: center;">
        Assessment Framework
      </h2>
      <ol style="color: #4b5563; font-size: 1rem; line-height: 1.8; padding-left: 1.5rem; margin-bottom: 2rem;">
        <li><strong>Primary Investment Objective:</strong> Capital preservation, high net rental yields (6-10%), Golden Visa residency, or corporate commercial expansion.</li>
        <li><strong>Target Corridor:</strong> United Arab Emirates (Dubai, Abu Dhabi, RAK), India (Bangalore, Gurgaon), or Southeast Asia (Singapore).</li>
        <li><strong>Investment Scale:</strong> Sourcing range starting from $300,000 USD to institutional portfolios of $10M+.</li>
        <li><strong>Timeline & Governance:</strong> Immediate off-plan allocation, scheduled site inspection in Dubai, or phased multi-quarter corporate setup.</li>
      </ol>
      <div style="text-align: center;">
        <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          Initiate Briefing Directly
        </a>
      </div>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

export function getRouteMetadata(pathname: string): PageMetadata {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  switch (cleanPath) {
    case '/about':
      return {
        title: "About Us | Leadership & Cross-Border Advisory | Univue Consultants ApS",
        description: "Learn about Univue Consultants ApS, our founder Nimmi Schou, mission, and turnkey cross-border advisory connecting European capital with UAE and India.",
        keywords: "Univue Consultants, Nimmi Schou, Copenhagen cross border advisory, Dubai real estate advisory, India business expansion, Danish CVR 43834665",
        canonical: `${BASE_URL}/about`,
        ogTitle: "About Univue Consultants | Leadership & Cross-Border Advisory",
        ogDescription: "Turnkey international advisory firm specializing in Dubai investment and India operational expansion for European clients.",
        ogType: "article",
        schema: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Univue Consultants ApS",
          "description": "Leadership, mission, and cross-border advisory thesis of Univue Consultants ApS.",
          "mainEntity": {
            "@type": "Organization",
            "name": "Univue Consultants ApS",
            "url": BASE_URL,
            "logo": `${BASE_URL}/logo.png`,
            "founder": {
              "@type": "Person",
              "name": "Nimmi Schou",
              "jobTitle": "Managing Partner & Founder"
            }
          }
        }
      };

    case '/services':
      return {
        title: "Advisory Services | Dubai Real Estate & India Expansion | Univue Consultants",
        description: "Explore Univue Consultants advisory services: off-plan property sourcing, cross-border portfolio positioning, escrow legal coordination, and India corporate entry.",
        keywords: "Dubai off-plan sourcing, UAE Golden Visa advisory, India market entry, corporate expansion Bangalore, escrow coordination, cross-border wealth",
        canonical: `${BASE_URL}/services`,
        ogTitle: "Advisory Services | Univue Consultants ApS",
        ogDescription: "Turnkey advisory services: off-plan property sourcing, transaction legal coordination, and Indian operational expansion.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "International Real Estate & Corporate Expansion Advisory",
          "provider": {
            "@type": "Organization",
            "name": "Univue Consultants ApS",
            "url": BASE_URL
          },
          "serviceType": "Investment & Corporate Advisory"
        }
      };

    case '/uae':
      return {
        title: "UAE Investment Markets | Dubai, Abu Dhabi & RAK Properties | Univue Consultants",
        description: "High-yield real estate investments and strategic advisory in Dubai, Abu Dhabi, and Ras Al Khaimah (RAK). 0% tax, 6-10% rental yields, and Golden Visa pathways.",
        keywords: "Dubai investment, Emaar properties, Palm Jumeirah villas, Ras Al Khaimah Wynn, Abu Dhabi Saadiyat, UAE Golden Visa, tax free real estate",
        canonical: `${BASE_URL}/uae`,
        ogTitle: "UAE Investment Markets | Dubai, Abu Dhabi & RAK Real Estate",
        ogDescription: "Explore high-yield real estate investments and strategic advisory in Dubai, Abu Dhabi, and Ras Al Khaimah with Univue Consultants.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "UAE Investment Markets | Univue Consultants",
          "description": "Strategic advisory for Dubai, Abu Dhabi, and Ras Al Khaimah property investments."
        }
      };

    case '/india':
      return {
        title: "India Operational Expansion | Bangalore, Gurgaon & Mumbai | Univue Consultants",
        description: "Scale your business operations in India. Turnkey coordination for Grade-A tech offices, subsidiary incorporation, labor compliance, and FDI regulations.",
        keywords: "India business expansion, Bangalore tech hub, Gurgaon Cyber City, Grade A office India, corporate setup India, FDI compliance",
        canonical: `${BASE_URL}/india`,
        ogTitle: "India Operational Expansion | Bangalore, Gurgaon & Mumbai",
        ogDescription: "Turnkey advisory for European enterprises scaling into Bangalore, Gurgaon, and Mumbai tech corridors.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "India Operational Expansion Advisory",
          "description": "Comprehensive corporate expansion advisory in high-growth Indian commercial hubs."
        }
      };

    case '/southeast-asia':
      return {
        title: "Southeast Asia Markets | Singapore & Regional Gateways | Univue Consultants",
        description: "Strategic advisory connecting European capital with ASEAN economic centers: Singapore family office structuring, Bangkok prime real estate, and regional corridors.",
        keywords: "Singapore family office, Bangkok real estate, Southeast Asia cross border investment, ASEAN wealth management",
        canonical: `${BASE_URL}/southeast-asia`,
        ogTitle: "Southeast Asia Markets | Singapore & Regional Gateways",
        ogDescription: "Connecting European capital with high-growth ASEAN economic centers with Univue Consultants.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Southeast Asia Investment Markets"
        }
      };

    case '/insights':
      return {
        title: "Market Insights & Macroeconomic Research | Univue Consultants",
        description: "Quarterly intelligence, Dubai real estate yield benchmarks, India commercial trends, and cross-border policy analysis by Univue Consultants.",
        keywords: "Dubai yield benchmark, India real estate research, UAE tax update, cross-border macroeconomic intelligence, Univue Insights",
        canonical: `${BASE_URL}/insights`,
        ogTitle: "Market Insights & Macroeconomic Research | Univue Consultants",
        ogDescription: "Authoritative analysis and yield benchmarking across Dubai, India, and Southeast Asia.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Univue Market Insights & Research Desk"
        }
      };

    case '/market-catalog':
    case '/properties':
    case '/catalog':
      return {
        title: "Market Catalog & Curated Properties | Univue Consultants ApS",
        description: "Browse curated advisor-choice off-plan properties and commercial assets in Dubai, Abu Dhabi, RAK, and Bangalore with verified yield models.",
        keywords: "Dubai property catalog, Emaar off-plan, Wynn Al Marjan residences, Bangalore commercial offices, luxury villas Dubai",
        canonical: `${BASE_URL}/market-catalog`,
        ogTitle: "Exclusive Market Catalog & Properties | Univue Consultants",
        ogDescription: "Curated advisor-choice off-plan developments and commercial assets in Dubai and Bangalore.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Univue Consultants Real Estate Catalog"
        }
      };

    case '/book':
      return {
        title: "Schedule Executive Briefing | Univue Consultants ApS",
        description: "Schedule a confidential 30-minute private consultation with Univue Consultants in Copenhagen or via secure video conference. Direct line: +45 26 37 82 70.",
        keywords: "book briefing Univue, real estate advisory consultation Copenhagen, Dubai investment advisory meeting",
        canonical: `${BASE_URL}/book`,
        ogTitle: "Schedule Executive Briefing | Univue Consultants",
        ogDescription: "Book a confidential 30-minute private consultation with an international advisory partner.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Schedule Executive Briefing with Univue Consultants",
          "telephone": "+4526378270"
        }
      };

    case '/questionnaire':
      return {
        title: "Investor Assessment Questionnaire | Univue Consultants ApS",
        description: "Complete our confidential 2-minute strategic questionnaire to receive customized market models, yield simulations, and tailored asset selections.",
        keywords: "investor assessment, cross-border expansion questionnaire, Univue client profile",
        canonical: `${BASE_URL}/questionnaire`,
        ogTitle: "Investor Assessment Questionnaire | Univue Consultants",
        ogDescription: "Tailored strategic assessment for real estate allocation and corporate expansion.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Univue Investor Assessment"
        }
      };

    case '/':
    default:
      return {
        title: "Univue Consultants | Dubai Investment & India Expansion Advisory",
        description: "Turnkey international cross-border advisory firm specializing in Dubai investment and India operational expansion for European clients.",
        keywords: "Dubai investment, India business expansion, cross-border advisory, turnkey investment solutions, European business consulting, Univue Consultants, international advisory",
        canonical: `${BASE_URL}/`,
        ogTitle: "Univue Consultants | Dubai Investment & India Expansion Advisory",
        ogDescription: "Turnkey international cross-border advisory firm specializing in Dubai investment and India operational expansion for European clients.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Univue Consultants ApS",
          "url": BASE_URL,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${BASE_URL}/market-catalog?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }
      };
  }
}

export function getPrerenderedBody(pathname: string): string {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  switch (cleanPath) {
    case '/about':
      return renderAboutBody();
    case '/services':
      return renderServicesBody();
    case '/uae':
      return renderUAEBody();
    case '/india':
      return renderIndiaBody();
    case '/southeast-asia':
      return renderSoutheastAsiaBody();
    case '/insights':
      return renderInsightsBody();
    case '/market-catalog':
    case '/properties':
    case '/catalog':
      return renderCatalogBody();
    case '/book':
      return renderBookingBody();
    case '/questionnaire':
      return renderQuestionnaireBody();
    case '/':
    default:
      return renderHomeBody();
  }
}

/**
 * Transforms an HTML template string by injecting route-specific metadata and pre-rendered body
 */
export function getPrerenderedPage(pathname: string, htmlTemplate: string): string {
  const meta = getRouteMetadata(pathname);
  const bodyHtml = getPrerenderedBody(pathname);

  let output = htmlTemplate;

  // 1. Update <title>
  output = output.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);

  // 2. Update <meta name="description">
  output = output.replace(
    /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="description" content="${meta.description}" />`
  );

  // 3. Update or inject OpenGraph & Twitter tags
  output = output.replace(
    /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:title" content="${meta.ogTitle}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:description" content="${meta.ogDescription}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:url" content="${meta.canonical}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:type["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:type" content="${meta.ogType}" />`
  );

  output = output.replace(
    /<meta\s+property=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="twitter:title" content="${meta.ogTitle}" />`
  );
  output = output.replace(
    /<meta\s+property=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="twitter:description" content="${meta.ogDescription}" />`
  );
  output = output.replace(
    /<meta\s+property=["']twitter:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="twitter:url" content="${meta.canonical}" />`
  );

  // 4. Update canonical link
  output = output.replace(
    /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
    `<link rel="canonical" href="${meta.canonical}" />`
  );

  // 5. Inject Schema.org JSON-LD structured data before </head>
  const schemaScript = `\n    <script type="application/ld+json">\n${JSON.stringify(meta.schema, null, 2)}\n    </script>\n  `;
  output = output.replace('</head>', `${schemaScript}</head>`);

  // 6. Inject pre-rendered body inside <div id="root">...</div>
  output = output.replace(
    /<div id=["']root["']>[\s\S]*?(\s*<script type=["']module["']\s+src=["']\/src\/main\.tsx["']>)/i,
    `<div id="root">${bodyHtml}</div>$1`
  );

  return output;
}
