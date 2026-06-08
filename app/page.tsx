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
  { id: "bopp",      title: "BOPP Tapes",       tag: "High-Strength Acrylic",       spec: "45–65 Micron",              category: "Adhesive Tapes",     features: ["Instant surface adhesion", "High shear resistance", "Excellent aging characteristics"],       desc: "Premium high-tensile biaxially oriented polypropylene film coated with custom high-grade acrylic emulsion. Specially formulated to prevent tearing during high-speed automated packaging runs.", image: "/bopp-tapes.jpg" },
  { id: "printed",   title: "Printed Tapes",    tag: "Brand Identity & Security",     spec: "4-Color Flexographic",      category: "Adhesive Tapes",     features: ["Sharp logo reproduction", "Tamper-evident security", "Weatherproof surface ink"],              desc: "Custom printed security tapes featuring clear typography and high-definition company logos. Serves as a visible anti-tampering seal across complex wholesale transport networks.", image: "/printed-tapes.jpg" },
  { id: "stretch",   title: "Stretch Films",    tag: "Pallet Stabilization Matrix",   spec: "23–50 Micron Hi-Stretch",  category: "Industrial Films",    features: ["Up to 300% elongation", "High double-sided cling", "Excellent dust isolation layer"],         desc: "Multi-layer co-extruded linear low-density stretch wrap material. Calibrated with high puncture resistance and excellent stretch memory to bind heavy pallets safely.", image: "/stretch-films.jpg" },
  { id: "strapping", title: "Strapping Rolls",  tag: "Heavy-Duty Structural Binding", spec: "PP / Polyester PET",       category: "Logistics Materials", features: ["High split resistance", "Consistent width parameters", "Manual & auto compatible"],           desc: "Heavy-duty binding straps engineered to maintain tight surface tension over long cargo hauls. Resistant to sharp corners and high shock vibrations.", image: "/strapping-rolls.jpg" },
  { id: "shrink",    title: "Shrink Sleeves",   tag: "Thermal Product Contouring",    spec: "PVC / PETG Blend",         category: "Product Labels",     features: ["Uniform 360° shrinkage", "Moisture & scratch protection", "Vibrant color layers"],              desc: "Advanced heat-sensitive shrink labels offering seamless product contouring. Provides uniform moisture isolation and pristine clear text display.", image: "/shrink-sleeves.jpg" },
  { id: "ldpoly",    title: "LD Poly Bags",     tag: "Industrial Moisture Barriers",  spec: "Custom Gauge Multi-Layer", category: "Poly Enclosures",    features: ["Excellent bottom-seal strength", "High transparency grades", "Waterproof containment"],       desc: "Low-Density Polyethylene commercial liners manufactured using advanced blown-film processes. Built to withstand significant weight without tearing.", image: "/ld-poly-bags.jpg" },
  { id: "ldrolls",   title: "LD Rolls",         tag: "Continuous Material Sheeting",  spec: "Heavy Industrial Grade",   category: "Industrial Films",    features: ["Extra wide layout formats", "Consistent gauge across run", "Excellent chemical inertness"],   desc: "Continuous-feed raw polyethylene roll shielding for heavy-duty waterproofing, construction site lining, and raw machinery warehouse storage protection.", image: "/ld-rolls.jpg" },
  { id: "zipper",    title: "Zipper Lock Bags", tag: "Reclosable Component Pouches",  spec: "Double Track Profiles",     category: "Poly Enclosures",    features: ["Airproof track alignment", "Reinforced side border seals", "Highly reusable film"],            desc: "Heavy-duty transparent storage bags featuring interlocking track profiles. Perfect for organizing small parts and preventing dust accumulation.", image: "/zipper-lock-bags.jpg" },
  { id: "garbage",   title: "Garbage Bags",     tag: "High-Payload Waste Liners",     spec: "Super-Durable Heavy Gauge",category: "Logistics Materials", features: ["Leakproof bottom configuration", "High puncture resistance", "Bulk dispenser layout"],       desc: "Industrial grade trash containment bags made to withstand sharp corners, liquid contents, and substantial weight loads without breaking.", image: "/garbage-bags.jpg" },
  { id: "measuring", title: "Measuring Caps",   tag: "Volumetric Polymer Molds",      spec: "Injection-Molded PP",      category: "Custom Molds",       features: ["Clear molded measurement marks", "Chemical-resistant polymer", "Smooth screw-thread config"], desc: "Meticulously calibrated plastic fluid measurement caps produced via precision injection molding to ensure highly accurate dosing marks.", image: "/measuring-caps.jpg" },
  { id: "lockties",  title: "Lock Ties",        tag: "High-Tensile Fastening Bands",  spec: "Self-Locking Nylon",        category: "Logistics Materials", features: ["Permanent self-locking track", "High UV & heat tolerance", "Extreme load-bearing"],           desc: "Heavy-duty industrial cable ties engineered with a permanent secure locking teeth mechanism for organizing wiring systems and shipping bundles.", image: "/lock-ties.jpg" },
];

const distributionRoutes = [
  { region: "Uttarakhand Hubs",     centers: "SIDCUL Haridwar, Dehradun, Pantnagar",       leadTime: "Within 12 Hours",  tier: "Primary Fleet"      },
  { region: "Delhi NCR Network",    centers: "Noida, Ghaziabad, Gurugram, Faridabad",       leadTime: "Within 24 Hours",  tier: "Express Freight"    },
  { region: "Uttar Pradesh Tracks", centers: "Kanpur Central, Lucknow, Meerut, Aligarh",    leadTime: "24–48 Hours",      tier: "Standard Freight"   },
  { region: "Rajasthan Corridors",  centers: "Jaipur, Alwar, Bhiwadi, Jodhpur",              leadTime: "Within 48 Hours",  tier: "Regional Transport" },
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
  visible: { opacity: 1, x: 0,   transition: { type: "spring", stiffness: 80, damping: 20 } },
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
      {/* FIXED IMAGE CONTAINER WRAPPER */}
      <div style={{ position: "relative", height: 240, width: "100%", background: "#F0EDE7", overflow: "hidden" }}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full"
          style={{ 
            transform: hovered ? "scale(1.04)" : "scale(1)", 
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(257,244,238,0.4) 100%)", pointerEvents: "none" }} />
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: T.blue, color: "#fff",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
          padding: "4px 10px", borderRadius: 6, textTransform: "uppercase",
          zIndex: 10,
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
            zIndex: 20,
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

      {/* HEADER */}
      <header style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: "rgba(247,244,238,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.divider}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.a href="#" whileHover={{ scale: 1.02 }}><ShrastiLogo size="sm" /></motion.a>

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

      {/* HERO SECTION */}
      <section id="about-plant" style={{
        position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "0 24px", paddingTop: 72, overflow: "hidden",
        background: `linear-gradient(160deg, #F7F4EE 0%, #EEF2FB 55%, #F7F4EE 100%)`,
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${T.blue}0A 1px, transparent 1px), linear-gradient(to right, ${T.blue}0A 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: "38%", width: 1.5, background: `linear-gradient(180deg, transparent, ${T.gold}55, transparent)`, pointerEvents: "none" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 2, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ display: "grid", gap: 48, alignItems: "center" }} className="lg:grid-cols-[1fr_520px]">

            {/* Left column: text */}
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
                  Explore Material Index
                </motion.a>
              </motion.div>
            </div>

            {/* Right column: Fixed Hero Image Layout */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }} 
              animate={{ opacity: 1, scale: 1, x: 0 }} 
              transition={{ delay: 0.35, duration: 0.6 }}
              style={{ position: "relative", width: "100%", height: 480, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(13,31,78,0.16)" }}
            >
              <Image 
                src="/bopp-tapes.jpg"
                alt="Shrasti Enterprises Production Line"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-cover w-full h-full"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 70%, rgba(13,31,78,0.4) 100%)" }} />
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section id="product-matrix" style={{ padding: "100px 24px", background: T.bgSection, position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: T.blue, letterSpacing: "0.15em", textTransform: "uppercase" }}>Enterprise Inventory</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 900, color: T.navy, letterSpacing: "-0.02em" }}>High-Performance Materials Matrix</h2>
            <div style={{ width: 60, height: 4, background: T.gold, borderRadius: 2 }} />
          </div>

          {/* Categories Selector */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={pill(selectedCategory === cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout Container */}
          <motion.div 
            layout 
            variants={stagger} 
            initial="hidden" 
            animate="visible" 
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 30 }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onQuote={handleQuote} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* STATS & FACTORY INFO SECTION */}
      <section style={{ padding: "80px 24px", background: T.bgAlt }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
          {factoryStats.map((stat, idx) => (
            <div key={idx} style={{ background: T.bgSection, padding: 32, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: T.blue, marginBottom: 8 }}>{stat.value}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.navy, marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 13, color: T.textSoft }}>{stat.support}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DISPATCH ROUTES */}
      <section id="logistics-grid" style={{ padding: "100px 24px", background: T.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: T.navy, marginBottom: 40, textAlign: "center" }}>North India Supply Fleet Matrix</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {distributionRoutes.map((route, idx) => (
              <div key={idx} style={{ background: T.bgSection, padding: 24, borderRadius: 12, border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontWeight: 800, color: T.navy }}>{route.region}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.gold, background: `${T.gold}15`, padding: "2px 8px", borderRadius: 4 }}>{route.tier}</span>
                </div>
                <p style={{ fontSize: 14, color: T.textMid, marginBottom: 12 }}>{route.centers}</p>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.blue }}>Timeline: {route.leadTime}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIGURATOR / QUOTE SECTION */}
      <section id="quote-configurator" style={{ padding: "100px 24px", background: T.navy, color: "#fff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", background: "rgba(255,255,255,0.03)", padding: 40, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, textAlign: "center" }}>Material Requirement Configurator</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", color: T.footerText }}>Selected Target Profile</label>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ w: "100%", width: "100%", padding: 12, borderRadius: 8, background: T.navyLight, color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                {productSolutions.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", color: T.footerText }}>Target Monthly Volume</label>
              <input type="text" placeholder="e.g. 5000 Rolls / 2 Tons" value={volume} onChange={(e) => setVolume(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, background: T.navyLight, color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", color: T.footerText }}>Destination Unloading Hub</label>
              <input type="text" placeholder="e.g. SIDCUL Haridwar / Noida Sec-63" value={deliveryHub} onChange={(e) => setDeliveryHub(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, background: T.navyLight, color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", color: T.footerText }}>Contact Name</label>
                <input type="text" placeholder="Your Name" value={contactName} onChange={(e) => setContactName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, background: T.navyLight, color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", color: T.footerText }}>Phone Number</label>
                <input type="text" placeholder="10-Digit Mobile" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, background: T.navyLight, color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }} />
              </div>
            </div>

            <a href={mailtoLink()} style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, padding: "16px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", textDecoration: "none", marginTop: 12, boxShadow: `0 4px 20px ${T.goldGlow}` }}>
              Generate Official RFQ Email →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.footerBg, color: T.footerText, padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40, alignItems: "center" }}>
          <ShrastiLogo dark size="sm" />
          <div style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} Shrasti Enterprises. SIDCUL Industrial Area, Haridwar, UK. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
