"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

// ─────────────────────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────────────────────
const T = {
  bg:          "#F7F4EE",
  bgSection:   "#FFFFFF",
  bgAlt:       "#EFF0F4",
  navy:        "#0D1F4E",
  navyLight:   "#1A3070",
  blue:        "#1A52D4",
  blueLight:   "#4A7DE8",
  gold:        "#C9A028",
  goldLight:   "#E8C84A",
  goldGlow:    "rgba(201,160,40,0.35)",
  blueGlow:    "rgba(26,82,212,0.18)",
  text:        "#0D1F4E",
  textMid:     "#3D4F72",
  textSoft:    "#6B7A99",
  border:      "#DDD8CE",
  divider:     "#E8E2D6",
  footerBg:    "#0D1F4E",
  footerText:  "#C8D0E4",
};

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const productSolutions = [
  { id: "bopp",      title: "BOPP Tapes",       tag: "High-Strength Acrylic",         spec: "45–65 Micron",             category: "Adhesive Tapes",     features: ["Instant surface adhesion", "High shear resistance", "Excellent aging characteristics"],       desc: "Premium high-tensile biaxially oriented polypropylene film coated with custom high-grade acrylic emulsion. Specially formulated to prevent tearing during high-speed automated packaging runs.", image: "/products/bopp-tapes.jpg" },
  { id: "printed",   title: "Printed Tapes",    tag: "Brand Identity & Security",     spec: "4-Color Flexographic",     category: "Adhesive Tapes",     features: ["Sharp logo reproduction", "Tamper-evident security", "Weatherproof surface ink"],              desc: "Custom printed security tapes featuring clear typography and high-definition company logos. Serves as a visible anti-tampering seal across complex wholesale transport networks.", image: "/products/printed-tapes.jpg" },
  { id: "stretch",   title: "Stretch Films",    tag: "Pallet Stabilization Matrix",   spec: "23–50 Micron Hi-Stretch",  category: "Industrial Films",   features: ["Up to 300% elongation", "High double-sided cling", "Excellent dust isolation layer"],         desc: "Multi-layer co-extruded linear low-density stretch wrap material. Calibrated with high puncture resistance and excellent stretch memory to bind heavy pallets safely.", image: "/products/stretch-films.jpg" },
  { id: "strapping", title: "Strapping Rolls",  tag: "Heavy-Duty Structural Binding", spec: "PP / Polyester PET",       category: "Logistics Materials", features: ["High split resistance", "Consistent width parameters", "Manual & auto compatible"],           desc: "Heavy-duty binding straps engineered to maintain tight surface tension over long cargo hauls. Resistant to sharp corners and high shock vibrations.", image: "/products/strapping-rolls.jpg" },
  { id: "shrink",    title: "Shrink Sleeves",   tag: "Thermal Product Contouring",    spec: "PVC / PETG Blend",         category: "Product Labels",     features: ["Uniform 360° shrinkage", "Moisture & scratch protection", "Vibrant color layers"],             desc: "Advanced heat-sensitive shrink labels offering seamless product contouring. Provides uniform moisture isolation and pristine clear text display.", image: "/products/shrink-sleeves.jpg" },
  { id: "ldpoly",    title: "LD Poly Bags",     tag: "Industrial Moisture Barriers",  spec: "Custom Gauge Multi-Layer", category: "Poly Enclosures",    features: ["Excellent bottom-seal strength", "High transparency grades", "Waterproof containment"],       desc: "Low-Density Polyethylene commercial liners manufactured using advanced blown-film processes. Built to withstand significant weight without tearing.", image: "/products/ld-poly-bags.jpg" },
  { id: "ldrolls",   title: "LD Rolls",         tag: "Continuous Material Sheeting",  spec: "Heavy Industrial Grade",   category: "Industrial Films",   features: ["Extra wide layout formats", "Consistent gauge across run", "Excellent chemical inertness"],   desc: "Continuous-feed raw polyethylene roll shielding for heavy-duty waterproofing, construction site lining, and raw machinery warehouse storage protection.", image: "/products/ld-rolls.jpg" },
  { id: "zipper",    title: "Zipper Lock Bags", tag: "Reclosable Component Pouches",  spec: "Double Track Profiles",    category: "Poly Enclosures",    features: ["Airproof track alignment", "Reinforced side border seals", "Highly reusable film"],           desc: "Heavy-duty transparent storage bags featuring interlocking track profiles. Perfect for organizing small parts and preventing dust accumulation.", image: "/products/zipper-lock-bags.jpg" },
  { id: "garbage",   title: "Garbage Bags",     tag: "High-Payload Waste Liners",     spec: "Super-Durable Heavy Gauge",category: "Logistics Materials", features: ["Leakproof bottom configuration", "High puncture resistance", "Bulk dispenser layout"],       desc: "Industrial grade trash containment bags made to withstand sharp corners, liquid contents, and substantial weight loads without breaking.", image: "/products/garbage-bags.jpg" },
  { id: "measuring", title: "Measuring Caps",   tag: "Volumetric Polymer Molds",      spec: "Injection-Molded PP",      category: "Custom Molds",       features: ["Clear molded measurement marks", "Chemical-resistant polymer", "Smooth screw-thread config"], desc: "Meticulously calibrated plastic fluid measurement caps produced via precision injection molding to ensure highly accurate dosing marks.", image: "/products/measuring-caps.jpg" },
  { id: "lockties",  title: "Lock Ties",        tag: "High-Tensile Fastening Bands",  spec: "Self-Locking Nylon",       category: "Logistics Materials", features: ["Permanent self-locking track", "High UV & heat tolerance", "Extreme load-bearing"],          desc: "Heavy-duty industrial cable ties engineered with a permanent secure locking teeth mechanism for organizing wiring systems and shipping bundles.", image: "/products/lock-ties.jpg" },
];

const distributionRoutes = [
  { region: "Uttarakhand Hubs",     centers: "SIDCUL Haridwar, Dehradun, Pantnagar",       leadTime: "Within 12 Hours",  tier: "Primary Fleet"      },
  { region: "Delhi NCR Network",    centers: "Noida, Ghaziabad, Gurugram, Faridabad",       leadTime: "Within 24 Hours",  tier: "Express Freight"    },
  { region: "Uttar Pradesh Tracks", centers: "Kanpur Central, Lucknow, Meerut, Aligarh",    leadTime: "24–48 Hours",      tier: "Standard Freight"   },
  { region: "Rajasthan Corridors",  centers: "Jaipur, Alwar, Bhiwadi, Jodhpur",             leadTime: "Within 48 Hours",  tier: "Regional Transport" },
  { region: "Haryana Logistics",    centers: "Faridabad Industrial, Sonipat, Rohtak",        leadTime: "Within 24 Hours",  tier: "Express Freight"    },
  { region: "Punjab Supply Lines",  centers: "Ludhiana, Amritsar, Jalandhar, Patiala",       leadTime: "36–48 Hours",      tier: "Standard Freight"   },
];

const factoryStats = [
  { value: "24/7",   label: "Continuous Production", support: "Uninterrupted Supply Chain" },
  { value: "100%",   label: "Micrometer Verified",   support: "Zero Gauge Deviations"      },
  { value: "Direct", label: "Factory Pricing Model", support: "No Middleman Margins"       },
  { value: "Bulk",   label: "Procurement Ready",     support: "High Volume Dispatch"       },
];

const trustBadges = [
  { label: "Premium Quality",  d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { label: "Factory Pricing",  d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Bulk Orders",      d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Reliable Supply",  d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "On-Time Delivery", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const categories = ["All", "Adhesive Tapes", "Industrial Films", "Poly Enclosures", "Logistics Materials", "Custom Molds", "Product Labels"];

const productionTabs = [
  {
    id: "overview",
    label: "1. Operations Overview",
    title: "Haridwar Blown-Film Lines",
    body: "Our plant floor runs specialized extrusion machinery alongside heavy slitting rewinders. This workflow outputs raw plastic films and adhesive layers under exact temperature metrics to maximize stretch parameters.",
    details: [
      { label: "Material Baseline",   value: "Premium Polyethylene Granules" },
      { label: "Slitting Tolerances", value: "Within ±0.5mm Parameters"      },
    ],
  },
  {
    id: "micrometer",
    label: "2. Micrometer Validation",
    title: "Micro-Level Testing Routines",
    body: "We constantly monitor cross-sectional film thickness using precision gauge instrumentation. This prevents thin spots, ensuring high puncture defense when binding heavy building goods or sharp boxes.",
    details: [
      { label: "Testing Loop",    value: "Hourly Sample Pulls"    },
      { label: "Defect Protocol", value: "Complete Run Isolation" },
    ],
  },
  {
    id: "capacity",
    label: "3. Bulk Supply Logistics",
    title: "Commercial Storage Hubs",
    body: "Our warehouse floor maintains large buffer stocks of core product items. This strategy prevents raw supply chain gaps for nearby commercial users requiring fast dispatch.",
    details: [
      { label: "Inventory Model",    value: "Just-In-Time Integration" },
      { label: "Load Configuration", value: "Secure Unitized Pallets"  },
    ],
  },
];

const whyChooseUs = [
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "ISO-Grade Quality Control", desc: "Every batch undergoes micrometer thickness validation before dispatch. Zero tolerance for gauge deviations." },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Factory-Direct Pricing", desc: "No distributors, no middlemen. You buy directly from our SIDCUL manufacturing plant at wholesale rates." },
  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "24-Hour Dispatch Guarantee", desc: "Orders placed before 2 PM are dispatched same day. Our logistics fleet covers all major North India hubs." },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Dedicated Account Manager", desc: "Every bulk buyer gets a dedicated contact person for reorders, custom specs, and supply chain planning." },
  { icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", title: "Custom Specifications", desc: "Need a specific micron, width, or print? We manufacture to your exact specs with minimum order flexibility." },
  { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", title: "Bulk Stock Always Ready", desc: "We maintain large buffer inventory of all core products. No waiting for production cycles on standard items." },
];

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 36, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { type: "spring", stiffness: 72, damping: 18 } },
  exit:    { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.22 } },
};

const stagger: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  exit:    { opacity: 0, transition: { staggerChildren: 0.04 } },
};

const slideIn: Variants = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0,  transition: { type: "spring", stiffness: 80, damping: 20 } },
  exit:    { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

// ─────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────
function ShrastiLogo({ size = "md", dark = false }: { size?: "sm" | "md" | "lg"; dark?: boolean }) {
  const s = { sm: 32, md: 44, lg: 60 }[size];
  const wordColor = dark ? "#FFFFFF"  : T.navy;
  const entColor  = dark ? "#C8D0E4"  : T.textSoft;
  const lineColor = dark ? "rgba(200,208,228,0.4)" : "rgba(13,31,78,0.25)";
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative shrink-0">
        <svg width={s} height={Math.round(s * 0.82)} viewBox="0 0 56 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="2,43 22,5 34,25"  fill="#1A52D4" />
          <polygon points="20,5 54,43 36,43 24,21" fill="#B0B8C8" />
          <polygon points="22,27 30,13 30,27" fill="#B0B8C8" opacity="0.9" />
          <polygon points="30,13 38,27 30,27" fill="#1A52D4" opacity="0.85" />
        </svg>
        <span style={{ fontSize: Math.round(s * 0.17), color: entColor, lineHeight: 1 }} className="absolute -top-0.5 -right-2 font-bold tracking-tight">™</span>
      </div>
      <div className="flex flex-col leading-none">
        <span style={{ fontSize: Math.round(s * 0.43), color: wordColor, letterSpacing: "-0.02em" }} className="font-black">SHRASTI</span>
        <div className="flex items-center gap-1 mt-0.5">
          <span style={{ width: 12, height: 1, background: lineColor, display: "inline-block" }} />
          <span style={{ fontSize: Math.round(s * 0.19), color: entColor, letterSpacing: "0.2em" }} className="font-semibold uppercase">ENTERPRISES</span>
          <span style={{ width: 12, height: 1, background: lineColor, display: "inline-block" }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────
function ProductCard({ product, onQuote }: { product: typeof productSolutions[0]; onQuote: (t: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    T.bgSection,
        borderRadius:  16,
        border:        `1.5px solid ${hovered ? T.gold : T.border}`,
        boxShadow:     hovered
          ? `0 0 0 3px ${T.goldGlow}, 0 20px 48px rgba(13,31,78,0.10)`
          : "0 2px 16px rgba(13,31,78,0.06)",
        overflow:      "hidden",
        transition:    "border-color 0.28s ease, box-shadow 0.28s ease",
        display:       "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", height: 280, background: "#F0EDE7", overflow: "hidden" }}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain"
          style={{ padding: "04px",
    transform: hovered ? "scale(1.03)" : "scale(1)", transition: "transform 0.55s ease" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(247,244,238,0.9) 100%)", pointerEvents: "none" }} />
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: T.blue, color: "#fff",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
          padding: "4px 10px", borderRadius: 6, textTransform: "uppercase",
        }}>
          {product.category}
        </div>
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})`,
            transformOrigin: "left",
          }}
        />
      </div>

      <div style={{ padding: "22px 24px 20px", display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: T.navy, lineHeight: 1.2 }}>{product.title}</h3>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.textSoft, fontFamily: "monospace", marginTop: 3, whiteSpace: "nowrap" }}>{product.spec}</span>
        </div>
        <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.7, fontWeight: 400, flex: 1 }}>{product.desc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {product.features.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSoft, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.textSoft, letterSpacing: "0.08em", textTransform: "uppercase" }}>{product.tag}</span>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onQuote(product.title)}
            style={{
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
              color: T.navy, border: "none", borderRadius: 8,
              padding: "8px 18px", fontSize: 12, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
              boxShadow: hovered ? `0 4px 18px ${T.goldGlow}` : "none",
              transition: "box-shadow 0.25s",
            }}
          >
            Get Quote →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ShrastiEnterprisesHome() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab,        setActiveTab]         = useState("overview");
  const [quoteStep,        setQuoteStep]          = useState(1);
  const [selectedProduct,  setSelectedProduct]    = useState("BOPP Tapes");
  const [volume,           setVolume]             = useState("");
  const [deliveryHub,      setDeliveryHub]         = useState("");
  const [contactName,      setContactName]         = useState("");
  const [contactPhone,     setContactPhone]        = useState("");
  const [layoutMode,       setLayoutMode]          = useState<"grid" | "list">("grid");
  const [mobileOpen,       setMobileOpen]          = useState(false);
  const [mousePos,         setMousePos]            = useState({ x: -2000, y: -2000 });

  const { scrollYProgress } = useScroll();
  const smoothProgress      = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroY               = useTransform(smoothProgress, [0, 0.3], ["0%", "10%"]);
  const heroOpacity         = useTransform(smoothProgress, [0, 0.28], [1, 0]);

  const rafRef = useRef<number | null>(null);
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filtered = selectedCategory === "All"
    ? productSolutions
    : productSolutions.filter(p => p.category === selectedCategory);

  const handleQuote = (title: string) => {
    setSelectedProduct(title);
    setQuoteStep(1);
    document.getElementById("quote-configurator")?.scrollIntoView({ behavior: "smooth" });
  };

  const mailtoLink = () => {
    const sub  = encodeURIComponent(`Material RFQ: ${selectedProduct}`);
    const body = encodeURIComponent(
      `Hello Shrasti Enterprises,\n\nProduct: ${selectedProduct}\nMonthly Volume: ${volume || "TBD"}\nDelivery Hub: ${deliveryHub || "TBD"}\nContact: ${contactName || "TBD"}\nPhone: ${contactPhone || "TBD"}\n\nPlease share pricing and availability.\n\nThank you.`
    );
    return `mailto:contact@shrastienterprises.com?subject=${sub}&body=${body}`;
  };

  const navLinks = [
    { href: "#about-plant",        label: "Plant Profile"  },
    { href: "#product-matrix",     label: "Material Index" },
    { href: "#logistics-grid",     label: "Dispatch Map"   },
    { href: "#quote-configurator", label: "Get a Quote"    },
  ];

  const pill = (active: boolean) => ({
    padding:       "8px 18px",
    borderRadius:  999,
    border:        `1.5px solid ${active ? T.gold : T.border}`,
    background:    active ? `linear-gradient(135deg, ${T.gold}, ${T.goldLight})` : T.bgSection,
    color:         active ? T.navy : T.textMid,
    fontWeight:    700,
    fontSize:      12,
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
    cursor:        "pointer",
    boxShadow:     active ? `0 0 16px ${T.goldGlow}` : "none",
    transition:    "all 0.22s ease",
  });

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ background: T.bg, color: T.text, fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(26,82,212,0.18); color: #0D1F4E; }
        input, select, textarea { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.4)} }
      `}</style>

      {/* Cursor glow */}
      <div style={{
        position: "fixed", pointerEvents: "none", zIndex: 0,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,82,212,0.055) 0%, transparent 70%)",
        transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)`,
        transition: "transform 0.45s ease-out",
      }} />

      {/* Scroll progress bar */}
      <motion.div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 60,
        scaleX: smoothProgress, transformOrigin: "left",
        background: `linear-gradient(90deg, ${T.blue}, ${T.gold}, ${T.blue})`,
      }} />

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <header style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: "rgba(247,244,238,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.divider}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.a href="#">
  <Image
    src="/shrasti-enterprises-logo.png"
    alt="Shrasti Enterprises"
    width={140}
    height={60}
  />
</motion.a>

          <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden lg:flex">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                style={{ fontSize: 13, fontWeight: 700, color: T.textMid, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.blue; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.textMid; }}
              >{l.label}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: `0 6px 24px ${T.blueGlow}` }}
              whileTap={{ scale: 0.96 }}
              href="#quote-configurator"
              className="hidden lg:inline-flex"
              style={{
                background: `linear-gradient(135deg, ${T.blue}, ${T.blueLight})`,
                color: "#fff", borderRadius: 10, padding: "10px 24px",
                fontSize: 13, fontWeight: 800, letterSpacing: "0.07em",
                textTransform: "uppercase", textDecoration: "none",
              }}
            >
              Request Quote
            </motion.a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 5 }}
              aria-label="Menu"
            >
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: "block", width: 24, height: 2.5, borderRadius: 2, background: T.navy,
                  transition: "all 0.25s",
                  transform: mobileOpen
                    ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                    : i === 1 ? "scaleX(0)"
                    : "rotate(-45deg) translate(5px,-5px)"
                    : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", borderTop: `1px solid ${T.divider}`, background: T.bg }}
            >
              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    style={{ padding: "12px 0", fontSize: 15, fontWeight: 700, color: T.navy, textDecoration: "none", borderBottom: `1px solid ${T.divider}`, letterSpacing: "0.04em" }}
                  >{l.label}</a>
                ))}
                <a href="tel:+918449350005" style={{
                  marginTop: 12, textAlign: "center", padding: "13px 0", borderRadius: 10,
                  background: `linear-gradient(135deg, ${T.blue}, ${T.blueLight})`,
                  color: "#fff", fontWeight: 800, fontSize: 14, textDecoration: "none", letterSpacing: "0.05em",
                }}>Call: +91 84493 50005</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════════════════════════════════
          HERO — with product image on right
      ══════════════════════════════════════════ */}
      <section id="about-plant" style={{
        position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "0 24px", paddingTop: 72, overflow: "hidden",
        background: `linear-gradient(160deg, #F7F4EE 0%, #EEF2FB 55%, #F7F4EE 100%)`,
      }}>
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${T.blue}0A 1px, transparent 1px), linear-gradient(to right, ${T.blue}0A 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }} />
        {/* Gold diagonal line */}
        <div style={{ position: "absolute", top: 0, bottom: 0, right: "38%", width: 1.5, background: `linear-gradient(180deg, transparent, ${T.gold}55, transparent)`, pointerEvents: "none" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 2, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ display: "grid", gap: 48, alignItems: "center" }} className="lg:grid-cols-[1fr_520px]">

            {/* ── Left column: text ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, border: `1px solid ${T.gold}88`, background: `${T.gold}14`, color: T.gold, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", width: "fit-content" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.gold, animation: "ping 1.5s infinite", boxShadow: `0 0 8px ${T.gold}` }} />
                Haridwar Factory Direct · SIDCUL Industrial Zone
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 65 }}
                style={{ fontSize: "clamp(48px, 6vw, 84px)", fontWeight: 900, lineHeight: 0.93, color: T.navy, letterSpacing: "-0.03em", margin: 0 }}>
                Next-Gen<br />
                <span style={{ backgroundImage: `linear-gradient(90deg, ${T.blue} 0%, ${T.blueLight} 60%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Packaging</span>
                <br />
                <span style={{ backgroundImage: `linear-gradient(90deg, ${T.gold} 0%, ${T.goldLight} 60%, ${T.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Systems</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
                style={{ fontSize: 18, color: T.textMid, lineHeight: 1.75, fontWeight: 400, maxWidth: 520, margin: 0 }}>
                We engineer high-volume structural packaging and technical films for enterprise distribution networks —
                perfect consistency, straight from our SIDCUL industrial assembly lines.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  href="#product-matrix"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 34px", borderRadius: 10, background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", boxShadow: `0 6px 28px ${T.goldGlow}` }}>
                  Explore Inventory <span>→</span>
                </motion.a>
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  href="tel:+918449350005"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 34px", borderRadius: 10, border: `2px solid ${T.blue}55`, background: `${T.blue}0D`, color: T.blue, fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                  <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Call the Plant
                </motion.a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 4 }}>
                {["Factory Direct", "Bulk Supply", "Premium Quality"].map((t, i) => (
                  <span key={t} style={{ fontSize: 12, fontWeight: 700, color: T.textSoft, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                    {i > 0 && <span style={{ color: T.gold }}>|</span>}
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* ── Right column: HERO PRODUCT IMAGE ── */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 60, damping: 18 }}
              className="hidden lg:block"
              style={{ position: "relative" }}
            >
              {/* Glow behind image */}
              <div style={{
                position: "absolute", inset: -20,
                background: `radial-gradient(ellipse at center, ${T.goldGlow} 0%, transparent 70%)`,
                borderRadius: 32, pointerEvents: "none", zIndex: 0,
              }} />

              {/* Image frame */}
              <div style={{
                position: "relative", borderRadius: 24, overflow: "hidden",
                border: `2px solid ${T.gold}55`,
                boxShadow: `0 32px 80px rgba(13,31,78,0.14), 0 0 0 1px ${T.divider}, 0 0 40px ${T.goldGlow}`,
                zIndex: 1,
              }}>
                <Image
                  src="/hero-products.jpg"
                  alt="Shrasti Enterprises product range"
                  width={520}
                  height={380}
                  className="object-contain"
                  priority
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
                {/* Gradient overlay on bottom of image */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
                  background: `linear-gradient(0deg, rgba(13,31,78,0.72) 0%, transparent 100%)`,
                  pointerEvents: "none",
                }} />
                {/* Caption on image */}
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: `${T.gold}`, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Product Range</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>11 Industrial<br/>Packaging Solutions</div>
                  </div>
                  <div style={{
                    background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
                    borderRadius: 10, padding: "8px 14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: T.navy, lineHeight: 1 }}>24/7</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T.navy, letterSpacing: "0.1em", textTransform: "uppercase" }}>Production</div>
                  </div>
                </div>
              </div>

              {/* Floating badge — top right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", top: -18, right: -18, zIndex: 2,
                  background: T.bgSection, borderRadius: 14,
                  border: `1.5px solid ${T.divider}`,
                  boxShadow: `0 8px 24px rgba(13,31,78,0.12)`,
                  padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${T.blue}14`, border: `1.5px solid ${T.blue}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={18} height={18} fill="none" stroke={T.blue} viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>ISO Verified</div>
                  <div style={{ fontSize: 11, color: T.textSoft, fontWeight: 500 }}>Quality Assured</div>
                </div>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                style={{
                  position: "absolute", bottom: -18, left: -18, zIndex: 2,
                  background: T.bgSection, borderRadius: 14,
                  border: `1.5px solid ${T.divider}`,
                  boxShadow: `0 8px 24px rgba(13,31,78,0.12)`,
                  padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${T.gold}18`, border: `1.5px solid ${T.gold}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={18} height={18} fill="none" stroke={T.gold} viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>Factory Direct</div>
                  <div style={{ fontSize: 11, color: T.textSoft, fontWeight: 500 }}>SIDCUL Haridwar</div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.textSoft, letterSpacing: "0.25em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1.5, height: 44, overflow: "hidden", position: "relative" }}>
            <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${T.gold}, transparent)` }} />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════ */}
      <section style={{ background: T.navy, borderTop: `3px solid ${T.gold}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 32px", alignItems: "center" }}>
            {trustBadges.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.06 }}
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${T.gold}22`, border: `1px solid ${T.gold}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={17} height={17} fill="none" stroke={T.gold} viewBox="0 0 24 24" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d={b.d} /></svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#E8E0CC", letterSpacing: "0.1em", textTransform: "uppercase" }}>{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          METRICS
      ══════════════════════════════════════════ */}
      <section style={{ background: T.bgAlt, padding: "72px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {factoryStats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", stiffness: 75 }}
              whileHover={{ y: -5, boxShadow: `0 16px 40px rgba(13,31,78,0.10), 0 0 0 2px ${T.gold}55` }}
              style={{ background: T.bgSection, borderRadius: 16, padding: "28px 28px 24px", border: `1.5px solid ${T.divider}`, boxShadow: "0 2px 12px rgba(13,31,78,0.05)", transition: "box-shadow 0.3s, transform 0.3s", cursor: "default" }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: T.blue, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.navy, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: T.textSoft, fontWeight: 500 }}>{s.support}</div>
              <div style={{ marginTop: 16, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`, width: "40%" }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════ */}
      <section style={{ background: T.bg, padding: "80px 24px", borderTop: `1px solid ${T.divider}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 52, textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 6, background: `${T.gold}18`, border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
              Why Partner With Us
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: T.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Built for Industrial Buyers
            </h2>
            <p style={{ fontSize: 17, color: T.textMid, maxWidth: 540, margin: "0 auto", lineHeight: 1.7, fontWeight: 400 }}>
              Every system we run is designed for one thing — getting the right material to your warehouse, on time, every time.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
            {whyChooseUs.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 70 }}
                whileHover={{ y: -6, boxShadow: `0 20px 48px rgba(13,31,78,0.10), 0 0 0 2px ${T.gold}44` }}
                style={{ background: T.bgSection, borderRadius: 16, padding: "28px 26px", border: `1.5px solid ${T.divider}`, boxShadow: "0 2px 12px rgba(13,31,78,0.05)", transition: "all 0.28s ease", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.gold; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.divider; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${T.blue}10`, border: `1.5px solid ${T.blue}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <svg width={22} height={22} fill="none" stroke={T.blue} viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: T.navy, marginBottom: 10, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.75, fontWeight: 400, margin: 0 }}>{item.desc}</p>
                <div style={{ marginTop: 18, height: 2, borderRadius: 1, background: `linear-gradient(90deg, ${T.gold}, transparent)`, width: "35%" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCT CATALOG
      ══════════════════════════════════════════ */}
      <section id="product-matrix" style={{ background: T.bgAlt, padding: "80px 24px", borderTop: `1px solid ${T.divider}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 36 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 6, background: `${T.blue}12`, border: `1px solid ${T.blue}33`, color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
                Materials Architecture
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: T.navy, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>Our Product Range</h2>
              <p style={{ fontSize: 17, color: T.textMid, marginTop: 12, maxWidth: 520, lineHeight: 1.7, fontWeight: 400 }}>
                Every product manufactured with strict gauge parameters, dispatched direct from our SIDCUL factory.
              </p>
            </motion.div>

            <div style={{ display: "flex", gap: 6, padding: 5, borderRadius: 10, background: T.bg, border: `1px solid ${T.divider}` }}>
              {(["grid", "list"] as const).map(m => (
                <button key={m} onClick={() => setLayoutMode(m)}
                  style={{ padding: "8px 18px", borderRadius: 7, border: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
                    background: layoutMode === m ? T.blue : "transparent",
                    color:      layoutMode === m ? "#fff"  : T.textSoft,
                    boxShadow:  layoutMode === m ? `0 0 12px ${T.blueGlow}` : "none",
                  }}>
                  {m === "grid" ? "Grid" : "List"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36, paddingBottom: 28, borderBottom: `1px solid ${T.divider}` }}>
            {categories.map(cat => (
              <motion.button key={cat} onClick={() => setSelectedCategory(cat)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={pill(selectedCategory === cat)}>
                {cat}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {layoutMode === "grid" ? (
              <motion.div key="grid" variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 24 }}>
                {filtered.map(p => <ProductCard key={p.id} product={p} onQuote={handleQuote} />)}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filtered.map((p, i) => (
                  <motion.div key={p.id} layout
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ background: T.bgSection, borderRadius: 18, border: `1.5px solid ${T.border}`, overflow: "hidden", display: "flex", transition: "all 0.3s ease" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.gold; el.style.boxShadow = `0 0 0 3px ${T.goldGlow}, 0 12px 36px rgba(13,31,78,0.12)`; el.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.border; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ position: "relative", width: 180, minHeight: 140, flexShrink: 0, overflow: "hidden" }}>
                      <Image src={p.image} alt={p.title} fill className="object-contain" sizes="180px" />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", flex: 1, padding: "24px 28px", gap: 18 }}>
                      <div style={{ minWidth: 220 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: T.gold, letterSpacing: "0.18em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{p.category}</span>
                        <h3 style={{ fontSize: 30, fontWeight: 900, color: T.navy, margin: 0, lineHeight: 1.2 }}>{p.title}</h3>
                      </div>
                      <p style={{ fontSize: 16, color: T.textMid, flex: 1, minWidth: 220, lineHeight: 1.8, margin: 0 }}>{p.desc}</p>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.textSoft, fontFamily: "monospace", letterSpacing: "0.08em" }}>{p.spec}</span>
                        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuote(p.title)}
                          style={{ padding: "12px 26px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontSize: 15, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", boxShadow: `0 6px 20px ${T.goldGlow}` }}>
                          Request Quote
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCTION TABS
      ══════════════════════════════════════════ */}
      <section style={{ background: T.bg, padding: "80px 24px", borderTop: `1px solid ${T.divider}`, borderBottom: `1px solid ${T.divider}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 40, alignItems: "start" }} className="lg:grid-cols-[360px_1fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 6, background: `${T.gold}18`, border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
              Manufacturing
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 900, color: T.navy, marginBottom: 12, letterSpacing: "-0.02em" }}>Production Controls</h2>
            <p style={{ fontSize: 16, color: T.textMid, lineHeight: 1.7, marginBottom: 28, fontWeight: 400 }}>
              Focused manufacturing metrics keep materials strong across multi-state shipping transits.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {productionTabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${activeTab === tab.id ? T.blue : T.divider}`, background: activeTab === tab.id ? `${T.blue}0E` : T.bgSection, color: activeTab === tab.id ? T.blue : T.textMid, fontWeight: 700, fontSize: 13, letterSpacing: "0.04em", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.22s" }}>
                  {tab.label}
                  <span style={{ opacity: activeTab === tab.id ? 1 : 0.3, transition: "opacity 0.2s" }}>→</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ background: T.bgSection, borderRadius: 16, padding: "36px 36px", border: `1.5px solid ${T.divider}`, minHeight: 280, boxShadow: "0 4px 24px rgba(13,31,78,0.06)" }}>
            <AnimatePresence mode="wait">
              {productionTabs.filter(t => t.id === activeTab).map(tab => (
                <motion.div key={tab.id} variants={slideIn} initial="hidden" animate="visible" exit="exit">
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: T.navy, marginBottom: 14, letterSpacing: "-0.01em" }}>{tab.title}</h3>
                  <p style={{ fontSize: 16, color: T.textMid, lineHeight: 1.75, marginBottom: 24, fontWeight: 400 }}>{tab.body}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                    {tab.details.map(d => (
                      <div key={d.label} style={{ padding: "16px 18px", borderRadius: 10, background: T.bgAlt, border: `1px solid ${T.divider}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.textSoft, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{d.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.navy, fontFamily: "monospace" }}>{d.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LOGISTICS MAP
      ══════════════════════════════════════════ */}
      <section id="logistics-grid" style={{ background: T.bgAlt, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 6, background: `${T.gold}18`, border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
              Logistics Mapping
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: T.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>Regional Dispatch Matrix</h2>
            <p style={{ fontSize: 17, color: T.textMid, maxWidth: 520, lineHeight: 1.7, fontWeight: 400 }}>
              Structured commercial dispatches from our Haridwar factory to adjacent states with reliable transit times.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
            {distributionRoutes.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                style={{ background: T.bgSection, borderRadius: 14, padding: "26px 26px 22px", border: `1.5px solid ${T.divider}`, boxShadow: "0 2px 12px rgba(13,31,78,0.05)", transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.gold; el.style.boxShadow = `0 0 0 3px ${T.goldGlow}, 0 12px 32px rgba(13,31,78,0.08)`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = T.divider; el.style.boxShadow = "0 2px 12px rgba(13,31,78,0.05)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: T.navy, margin: 0 }}>{r.region}</h4>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.blue, background: `${T.blue}12`, border: `1px solid ${T.blue}33`, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>{r.tier}</span>
                </div>
                <p style={{ fontSize: 14, color: T.textSoft, lineHeight: 1.6, marginBottom: 16, fontWeight: 400 }}>{r.centers}</p>
                <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.textSoft, letterSpacing: "0.1em", textTransform: "uppercase" }}>Transit Time</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: T.gold, fontFamily: "monospace" }}>{r.leadTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section style={{ background: T.navy, padding: "72px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.gold}08 1px, transparent 1px), linear-gradient(to right, ${T.gold}08 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${T.gold}66, transparent)` }} />

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 6, background: `${T.gold}20`, border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            Ready to Order?
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.1 }}>
            Get Factory-Direct Pricing<br />
            <span style={{ backgroundImage: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>for Your Next Bulk Order</span>
          </h2>
          <p style={{ fontSize: 18, color: T.footerText, lineHeight: 1.7, marginBottom: 36, fontWeight: 400 }}>
            Talk directly to our manufacturing team. No brokers, no delays — just honest pricing and fast dispatch from Haridwar.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
              href="#quote-configurator"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 12, background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontWeight: 800, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", boxShadow: `0 8px 32px ${T.goldGlow}` }}>
              Configure a Quote →
            </motion.a>
            <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
              href="tel:+918449350005"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
              <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call +91 84493 50005
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          RFQ FORM
      ══════════════════════════════════════════ */}
      <section id="quote-configurator" style={{ background: T.bgAlt, padding: "80px 24px", borderTop: `1px solid ${T.divider}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: T.bgSection, borderRadius: 20, padding: "clamp(28px,5vw,52px)", border: `1.5px solid ${T.divider}`, boxShadow: "0 8px 48px rgba(13,31,78,0.08)" }}>

            <div style={{ borderBottom: `1px solid ${T.divider}`, paddingBottom: 24, marginBottom: 28 }}>
              <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 6, background: `${T.blue}12`, border: `1px solid ${T.blue}33`, color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
                Procurement Desk
              </div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 900, color: T.navy, margin: "0 0 8px" }}>Commercial RFQ Configurator</h2>
              <p style={{ fontSize: 16, color: T.textMid, margin: 0, fontWeight: 400 }}>Configure your requirements to receive direct factory pricing.</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {[{ n: 1, label: "Material" }, { n: 2, label: "Volume & Contact" }].map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {i > 0 && <div style={{ width: 40, height: 2, borderRadius: 1, background: quoteStep >= s.n ? T.blue : T.divider, transition: "background 0.3s" }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: quoteStep === s.n ? T.blue : T.textSoft, transition: "color 0.3s" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, transition: "all 0.3s",
                      background: quoteStep > s.n ? T.blue : quoteStep === s.n ? `${T.blue}14` : T.bgAlt,
                      border:     `1.5px solid ${quoteStep >= s.n ? T.blue : T.divider}`,
                      color:      quoteStep > s.n ? "#fff" : quoteStep === s.n ? T.blue : T.textSoft,
                    }}>
                      {quoteStep > s.n ? "✓" : s.n}
                    </div>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {quoteStep === 1 ? (
                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Select Product Line</label>
                    <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
                      style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `1.5px solid ${T.divider}`, background: T.bg, color: T.navy, fontSize: 15, fontWeight: 600, cursor: "pointer", outline: "none", appearance: "none" }}>
                      {productSolutions.map(p => <option key={p.id} value={p.title}>{p.title} — {p.spec}</option>)}
                    </select>
                  </div>

                  {(() => {
                    const p = productSolutions.find(x => x.title === selectedProduct);
                    return p ? (
                      <div style={{ display: "flex", gap: 14, padding: 14, borderRadius: 12, background: T.bgAlt, border: `1.5px solid ${T.divider}` }}>
                        <div style={{ position: "relative", width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                          <Image src={p.image} alt={p.title} fill className="object-contain" sizes="64px" />
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: T.navy }}>{p.title}</div>
                          <div style={{ fontSize: 12, color: T.textSoft, marginTop: 2 }}>{p.tag}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginTop: 3 }}>{p.spec}</div>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <p style={{ fontSize: 14, color: T.textSoft, fontWeight: 400, lineHeight: 1.6 }}>
                    Selected material parameters will configure our manufacturing cycles to match your supply chain needs.
                  </p>
                  <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setQuoteStep(2)}
                      style={{ padding: "13px 32px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${T.blue}, ${T.blueLight})`, color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer", boxShadow: `0 6px 22px ${T.blueGlow}` }}>
                      Next: Volume & Contact →
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 10, background: T.bgAlt, border: `1.5px solid ${T.divider}` }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.textSoft, letterSpacing: "0.1em", textTransform: "uppercase" }}>Selected Product:</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: T.blue }}>{selectedProduct}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                    {[
                      { label: "Est. Monthly Volume",  val: volume,       set: setVolume,       ph: "e.g. 500 Boxes / 5 Tons"     },
                      { label: "Delivery Hub / City",  val: deliveryHub,  set: setDeliveryHub,  ph: "e.g. SIDCUL Haridwar"         },
                      { label: "Your Name / Company",  val: contactName,  set: setContactName,  ph: "e.g. Rajesh Kumar / XYZ Ltd." },
                      { label: "Contact Phone",        val: contactPhone, set: setContactPhone, ph: "e.g. +91 98765 43210"         },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{f.label}</label>
                        <input type="text" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                          style={{ width: "100%", padding: "13px 15px", borderRadius: 10, border: `1.5px solid ${T.divider}`, background: T.bg, color: T.navy, fontSize: 14, fontWeight: 500, outline: "none", transition: "border-color 0.2s" }}
                          onFocus={e  => { e.currentTarget.style.borderColor = T.blue; }}
                          onBlur={e   => { e.currentTarget.style.borderColor = T.divider; }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${T.divider}` }}>
                    <button onClick={() => setQuoteStep(1)}
                      style={{ background: "none", border: "none", fontSize: 13, fontWeight: 700, color: T.textSoft, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer" }}>
                      ← Back
                    </button>
                    <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} href={mailtoLink()}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 10, background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontSize: 13, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", textDecoration: "none", boxShadow: `0 6px 22px ${T.goldGlow}` }}>
                      <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Send RFQ via Email
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: T.footerBg, padding: "64px 24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)` }} />
        <div style={{ position: "absolute", right: -40, bottom: -40, opacity: 0.04, pointerEvents: "none" }}>
          <ShrastiLogo size="lg" dark />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ShrastiLogo size="md" dark />
            <p style={{ fontSize: 14, color: T.footerText, lineHeight: 1.75, fontWeight: 400 }}>
              Industrial manufacturer of adhesive tapes, stretch wraps, and poly enclosures for regional logistics networks across North India.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { href: "tel:+918449350005", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "+91 84493 50005" },
                { href: "mailto:contact@shrastienterprises.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email Us" },
              ].map(c => (
                <a key={c.href} href={c.href}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: T.footerText, fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${T.gold}22`; (e.currentTarget as HTMLElement).style.color = T.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = T.footerText; }}
                >
                  <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} /></svg>
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: T.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Administrative HQ</h4>
            <p style={{ fontSize: 14, color: T.footerText, lineHeight: 1.8, fontWeight: 400 }}>
              Flat No. S-2, Rishabh Apartment,<br />
              Purushottam Vihar, Kankhal,<br />
              Haridwar, Uttarakhand — 249408
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: T.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Manufacturing Center</h4>
            <p style={{ fontSize: 14, color: T.footerText, lineHeight: 1.8, fontWeight: 400 }}>
              Near Prince Pipe &amp; Fittings,<br />
              Industrial Park - 2, Denso Chowk,<br />
              SIDCUL Haridwar — 249402
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: T.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {navLinks.map(l => (
                <a key={l.href} href={l.href}
                  style={{ fontSize: 14, color: T.footerText, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.footerText; }}
                >{l.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "24px auto 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <p style={{ fontSize: 12, color: "rgba(200,208,228,0.5)", fontWeight: 500 }}>© {new Date().getFullYear()} Shrasti Enterprises™. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "rgba(200,208,228,0.35)", fontWeight: 500 }}>Built with Next.js · Framer Motion · Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
