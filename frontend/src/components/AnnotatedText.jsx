import React from "react";

// ─── Marker styling ──────────────────────────────────────────────────────────
const getMarkerStyle = (marker) => {
  const m = marker.toLowerCase();
  if (m.includes("verified") || m.includes("factual") || m.includes("likely"))
    return { color: "#1B6B2F", bg: "#E8F5E9", border: "#A5D6A7" };
  if (m.includes("plausible") || m.includes("uncertain") || m.includes("questionable"))
    return { color: "#C25A00", bg: "#FFF3E0", border: "#FFCC80" };
  if (m.includes("speculative") || m.includes("unsupported") || m.includes("contradicted") || m.includes("insufficient"))
    return { color: "#B71C1C", bg: "#FFEBEE", border: "#EF9A9A" };
  return { color: "#555", bg: "#F5F5F5", border: "#DDD" };
};

// ─── Inline renderer ─────────────────────────────────────────────────────────
const renderInline = (content) => {
  if (!content) return null;
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\^?\(?\d+\)?)/g;
  const parts = content.split(regex);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: "#1a1a1a" }}>{part.slice(2, -2)}</strong>;
    }
    const markerMatch = part.match(/^\[([^\]]+)\]\^?\(?(\d+)\)?$/);
    if (markerMatch) {
      const [, label, num] = markerMatch;
      const s = getMarkerStyle(label);
      return (
        <span key={i} style={{
          display: "inline-flex", alignItems: "center", gap: "2px",
          padding: "2px 8px", marginInline: "3px", borderRadius: "999px",
          backgroundColor: s.bg, color: s.color, fontSize: "11.5px",
          fontWeight: 600, verticalAlign: "middle", whiteSpace: "nowrap",
          border: `1px solid ${s.border}`, lineHeight: 1.4,
        }}>
          {label}<sup style={{ fontSize: "9px", opacity: 0.7, marginLeft: "1px" }}>{num}</sup>
        </span>
      );
    }
    return part;
  });
};

// ─── PRE-PARSER ───────────────────────────────────────────────────────────────
// Normalizes messy LLM output before line-by-line parsing.
const preParse = (text) => {
  // 1. Strip markdown heading hashes: "## Title" → keep as line, parser handles ##
  // (we keep ## so the block parser can detect heading level)

  // 2. Fix "N [marker]. **Title:** body" → "N. **Title** [marker]:\nbody"
  text = text.replace(
    /^(\d+)\s+(\[[^\]]+\]\^?\(?\d+\)?)\s*\.\s*(.*)/gm,
    (_, num, marker, rest) => {
      const boldTitle = rest.match(/^(\*\*[^*]+\*\*):?\s*(.*)/s);
      if (boldTitle) {
        const body = boldTitle[2].trim();
        return `${num}. ${boldTitle[1]} ${marker}:${body ? '\n' + body : ''}`.trim();
      }
      return `${num}. ${rest} ${marker}`.trim();
    }
  );

  // 3. Fix run-on "...text [marker]. 2 [marker]. **Title:**"
  text = text.replace(
    /(\]\^?\(?\d+\)?)\s*\.\s+(\d+)\s+(\[[^\]]+\]\^?\(?\d+\)?)\s*\.\s*(\*\*[^*]+\*\*):?\s*/g,
    (_, prev, num, marker, bold) => `${prev}\n${num}. ${bold} ${marker}:\n`
  );
  text = text.replace(
    /\.\s+(\d+)\s+(\[[^\]]+\]\^?\(?\d+\)?)\s*\.\s+(\*\*)/g,
    ".\n$1. $3"
  );

  // 4. Inline sub-bullet splitting: "[marker]. * **Next:**" → newline
  text = text
    .replace(/(\]\^?\(?\d+\)?)\s*\.\s*\*\s+/g, "$1\n* ")
    .replace(/(\]\^?\(?\d+\)?)\s*\.\s*-\s+/g,  "$1\n- ")
    .replace(/\.\s+\*\s+(?=\*\*)/g, ".\n* ")
    .replace(/\.\s+-\s+(?=\*\*)/g,  ".\n- ");

  // 5. Detach inline subheaders stuck to list items:
  //    "[marker]. **Resources for Learning:**" → "[marker]\n**Resources for Learning:**"
  text = text.replace(
    /(\]\^?\(?\d+\)?)\s*\.\s+(\*\*[^*]+:\*\*)/g,
    "$1\n$2"
  );

  return text;
};

// ─── Block-level parser ───────────────────────────────────────────────────────
// Converts normalized text into typed block objects for rendering.
const parseBlocks = (text) => {
  const lines = text.trim().split("\n");
  const blocks = [];
  
  lines.forEach(line => {
    const t = line.trim();
    if (!t) { blocks.push({ type: "spacer" }); return; }

    // Horizontal rule
    if (/^---+$/.test(t)) { blocks.push({ type: "hr" }); return; }

    // Markdown headings: ## H2, ### H3
    const h2 = t.match(/^##\s+(.*)/);
    const h3 = t.match(/^###\s+(.*)/);
    if (h3) { blocks.push({ type: "h3", text: h3[1] }); return; }
    if (h2) { blocks.push({ type: "h2", text: h2[1] }); return; }

    // Numbered list: "1. text"
    const numMatch = t.match(/^(\d+)[.)]\s+(.*)/s);
    if (numMatch) { blocks.push({ type: "numbered", num: parseInt(numMatch[1]), text: numMatch[2] }); return; }

    // Bullet list: "* text" / "- text" / "• text"
    const bulletMatch = t.match(/^[-*•]\s+(.*)/s);
    if (bulletMatch) {
      const bt = bulletMatch[1].trim();
      // Detect category-header bullet: **Bold:** (bold text ending with colon)
      const isCategoryHeader = /^\*\*[^*]+:\*\*$/.test(bt);
      blocks.push({ type: "bullet", text: bt, isCategory: isCategoryHeader });
      return;
    }

    // Bold-only line ending with ":" → treat as inline section header
    if (/^\*\*[^*]+:\*\*$/.test(t)) { blocks.push({ type: "bold-header", text: t.slice(2,-2) }); return; }

    // Subheader: plain short line ending ":" (no bold), no punctuation inside
    if (t.endsWith(":") && t.length < 80 && !t.includes(". ") && !t.includes("[")) {
      blocks.push({ type: "subheader", text: t }); return;
    }

    blocks.push({ type: "para", text: t });
  });

  return blocks;
};

// ─── Renderer helpers ─────────────────────────────────────────────────────────
const HR = () => (
  <div style={{ margin: "24px 0", borderTop: "1.5px solid #f0f0f0" }} />
);

const Heading2 = ({ children }) => (
  <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a", margin: "28px 0 10px", letterSpacing: "-0.02em", lineHeight: 1.4 }}>
    {children}
  </h2>
);

const Heading3 = ({ children }) => (
  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", margin: "22px 0 8px", letterSpacing: "-0.01em", lineHeight: 1.4 }}>
    {children}
  </h3>
);

// BulletRow: bullet • and numbered rows, with optional indent for nested items
const BulletRow = ({ bullet, isNumber, indent, children }) => (
  <div style={{
    display: "flex",
    alignItems: "flex-start",
    marginBottom: indent ? "5px" : "10px",
    marginLeft: indent ? "28px" : "0",   // ← indent child items under category
  }}>
    <span style={{
      flexShrink: 0,
      width: isNumber ? "26px" : "18px",
      marginRight: "10px",
      paddingTop: "1px",
      textAlign: isNumber ? "right" : "center",
      color: isNumber ? "#5f6368" : (indent ? "#c5cad0" : "#bdc1c6"),
      fontWeight: isNumber ? 700 : 900,
      fontSize: isNumber ? "14px" : (indent ? "10px" : "16px"),
      lineHeight: "1.78",
      userSelect: "none",
    }}>
      {indent ? "◦" : bullet}  {/* hollow circle for children */}
    </span>
    <span style={{
      flex: 1,
      fontSize: indent ? "14px" : "15px",   // slightly smaller for sub-items
      lineHeight: 1.75,
      color: indent ? "#5f6368" : "#3c4043", // slightly dimmer for sub-items
    }}>
      {children}
    </span>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const AnnotatedText = ({ text }) => {
  if (!text) return null;

  const blocks = parseBlocks(preParse(text));
  const elements = [];
  
  // List accumulator
  let listBuf = [];
  let listKind = null;  // "ol" | "ul"
  let olN = 0;
  // Track if we're "inside" a numbered item (for indented body/sub-bullets)
  let inNumberedItem = false;
  let inCategoryList = false;  // inside a "* **Category:**" → sub-items are indented

  const flushList = () => {
    if (!listBuf.length) return;
    elements.push(
      <div key={`list-${elements.length}`} style={{ margin: "4px 0 16px" }}>
        {listBuf}
      </div>
    );
    listBuf = [];
    listKind = null;
    olN = 0;
    inNumberedItem = false;
    inCategoryList = false;
  };

  blocks.forEach((block, i) => {
    const key = `b-${i}`;

    if (block.type === "spacer") {
      // Two consecutive spacers = end of list section
      if (listBuf.length) flushList();
      return;
    }

    if (block.type === "hr") {
      flushList();
      elements.push(<HR key={key} />);
      return;
    }

    if (block.type === "h2") {
      flushList();
      elements.push(<Heading2 key={key}>{renderInline(block.text)}</Heading2>);
      return;
    }

    if (block.type === "h3") {
      flushList();
      elements.push(<Heading3 key={key}>{renderInline(block.text)}</Heading3>);
      return;
    }

    if (block.type === "bold-header" || block.type === "subheader") {
      // If we're inside a list, this is a section break inside the list
      if (listBuf.length) {
        // Add as a "category label" inside the list
        const isInsideList = listKind !== null;
        if (isInsideList) {
          listBuf.push(
            <div key={key} style={{
              fontWeight: 700, fontSize: "14px", color: "#1a1a1a",
              marginTop: "14px", marginBottom: "4px", marginLeft: "0",
              paddingBottom: "3px", borderBottom: "1px solid #f0f0f0",
            }}>
              {renderInline(block.text)}
            </div>
          );
          inNumberedItem = false;
          return;
        }
      }
      flushList();
      elements.push(
        <p key={key} style={{ fontWeight: 700, fontSize: "15px", margin: "18px 0 8px", color: "#1a1a1a" }}>
          {renderInline(block.text)}
        </p>
      );
      return;
    }

    if (block.type === "numbered") {
      if (listKind === "ul") flushList();
      listKind = "ol";
      olN++;
      inNumberedItem = true;
      inCategoryList = false;
      listBuf.push(
        <BulletRow key={key} bullet={`${olN}.`} isNumber>
          {renderInline(block.text)}
        </BulletRow>
      );
      return;
    }

    if (block.type === "bullet") {
      // Sub-bullet under a numbered item
      if (inNumberedItem && listKind === "ol") {
        listBuf.push(
          <BulletRow key={key} bullet="–" indent>
            {renderInline(block.text)}
          </BulletRow>
        );
        return;
      }
      if (listKind === "ol") flushList();
      listKind = listKind || "ul";

      if (block.isCategory) {
        // Category header bullet: "* **Online Courses:**" — render as section label, next items indent
        inCategoryList = true;
        inNumberedItem = false;
        listBuf.push(
          <div key={key} style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginTop: listBuf.length ? "16px" : "4px",
            marginBottom: "4px",
          }}>
            <span style={{ fontSize: "13px", color: "#d0d4d9", userSelect: "none", fontWeight: 700 }}>◆</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>
              {renderInline(block.text)}
            </span>
          </div>
        );
        return;
      }

      // Regular bullet OR indented child under a category
      listBuf.push(
        <BulletRow key={key} bullet="•" indent={inCategoryList}>
          {renderInline(block.text)}
        </BulletRow>
      );
      return;
    }

    if (block.type === "para") {
      // Continuation body text after a numbered header line
      if (inNumberedItem && listKind === "ol") {
        listBuf.push(
          <div key={key} style={{
            marginLeft: "36px", marginBottom: "8px",
            fontSize: "15px", lineHeight: 1.75, color: "#5f6368",
          }}>
            {renderInline(block.text)}
          </div>
        );
        return;
      }
      flushList();
      elements.push(
        <p key={key} style={{ marginBottom: "14px", lineHeight: 1.78, fontSize: "15px", color: "#3c4043" }}>
          {renderInline(block.text)}
        </p>
      );
      return;
    }
  });

  flushList();

  return (
    <div style={{ fontFamily: '"Google Sans", "Inter", system-ui, sans-serif', maxWidth: "700px", color: "#3c4043" }}>
      {elements}
    </div>
  );
};

// ─── List row component (kept for backward compat, now using BulletRow) ───────
const ListRow = BulletRow;


// ─── Demo Samples ─────────────────────────────────────────────────────────────
const UIUX = `Becoming a UI/UX designer is an exciting and rewarding career path that blends creativity, problem-solving, and empathy [plausible, p=0.56]^(1). It's about designing experiences that are not only beautiful but also intuitive, useful, and enjoyable for users [likely, p=0.70]^(2). Here's a comprehensive guide on how to become a UI/UX designer:

---

## What is UI/UX Design [plausible, p=0.53]^(3)?
Before diving in, let's quickly clarify the two terms:

* **UX (User Experience) Design:** Focuses on the overall experience a user has with a product or service [plausible, p=0.55]^(4). It's about understanding user needs, pain points, and behaviors to create a seamless, efficient, and satisfying journey [plausible, p=0.62]^(5). UX designers conduct research, create user flows, wireframes, and prototypes, and test designs [plausible, p=0.61]^(6).
* **UI (User Interface) Design:** Focuses on the visual and interactive elements of a product [plausible, p=0.60]^(7). It's about how a product looks and feels [plausible, p=0.56]^(8). UI designers work on typography, color palettes, buttons, icons, and layouts.

---

## The Path to Becoming a UI/UX Designer

**Here's a step-by-step roadmap:**

### Step 1: Understand the Fundamentals & Principles

Start by building a strong theoretical foundation [speculative, p=0.58]^(11).

* **Human-Centered Design (HCD) & Design Thinking:** Learn these methodologies that put the user at the center of the design process [speculative, p=0.63]^(12).
* **UX Principles:** Usability, accessibility, information architecture, interaction design, user psychology (e.g., Hick's Law, Fitts's Law) [speculative, p=0.54]^(13).
* **UI Principles:** Visual hierarchy, typography, color theory, layout, grid systems, iconography, consistency [speculative, p=0.56]^(14).
* **User Research Methods:** Learn about interviews, surveys, usability testing, card sorting, competitive analysis, and persona creation [plausible, p=0.57]^(15).
* **Interaction Design:** How users interact with the interface (gestures, animations, feedback) [speculative, p=0.54]^(16).

**Resources for Learning:**

* **Online Courses:**
* Google UX Design Professional Certificate (Coursera)
* Interaction Design Foundation (IDF) courses
* Udemy, edX, Coursera, Skillshare (search for UI/UX, Figma, Design Thinking)
* **Books:**
* "Don't Make Me Think, Revisited" by Steve Krug
* "The Design of Everyday Things" by Don Norman
* "Refactoring UI" by Adam Wathan & Steve Schoger
* **Blogs & Articles:**
* Nielsen Norman Group (NN/g)
* Smashing Magazine
* Medium (many design publications)`;

const JAVA = `**Java Island** is one of the major islands of Indonesia, located in Southeast Asia, between Sumatra to the west and Bali to the east [plausible, p=0.42]^(1). It is renowned for being:

1 [speculative, p=0.58]^(2). **The Most Populous Island in the World:** With over 150 million people, Java is incredibly densely populated [speculative, p=0.41]^(3). It's home to roughly 60% of Indonesia's total population [plausible, p=0.57]^(4). 2 [plausible, p=0.38]^(5). **Home to Jakarta:** The capital city of Indonesia, Jakarta, is located on Java's northwest coast, making the island the political and economic heart of the nation [likely, p=0.74]^(6). 3 [plausible, p=0.38]^(7). **Geographically Diverse and Volcanic:** A chain of volcanoes runs along its spine, making the island highly fertile [likely, p=0.75]^(8). Its landscape varies from mountainous regions and tropical rainforests to coastal plains [plausible, p=0.60]^(9). 4 [plausible, p=0.38]^(10). **Rich in Culture and History:** Java has been home to powerful Hindu-Buddhist kingdoms that left behind magnificent temples such as Borobudur and Prambanan [plausible, p=0.71]^(11).`;

const GAOGAO = `Gaogao Asia, more formally known as **Gaogao (Shanghai) Investment Management Co., Ltd.**, is a **private equity and venture capital firm** based in Shanghai, China [plausible, p=0.50]^(1). It focuses on investing in **growth-stage companies** across various sectors, primarily within **China and the broader Asian market** [speculative, p=0.63]^(2). Key characteristics and focus areas:

* **Investment Strategy:** They typically invest in companies with strong growth potential, aiming to create long-term value through strategic partnerships and operational improvements [uncertain, p=0.73]^(3). * **Sectors:** Their investments span diverse industries, often including technology, healthcare, advanced manufacturing, consumer goods, new materials, and other high-growth sectors [plausible, p=0.47]^(4). * **Geographic Focus:** While based in Shanghai, their investment scope extends across Asia, with a strong emphasis on the Chinese market [speculative, p=0.66]^(5). * **Goal:** To generate attractive returns for investors by identifying and nurturing promising companies [insufficient-info, p=0.88]^(6).

In essence, Gaogao Asia is a **growth-focused investment firm** operating primarily in the dynamic **Chinese and broader Asian market** [plausible, p=0.55]^(7).`;


export default function App() {
  const [tab, setTab] = React.useState("uiux");
  const samples = { uiux: UIUX, java: JAVA, gaogao: GAOGAO };
  const questions = { uiux: "how to be ui/ux designer?", java: "what is java island?", gaogao: "what is gaogao asia?" };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "100px" }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: "740px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e8eaed" }}>
        <span style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a", letterSpacing: "-0.02em" }}>
          <span style={{ opacity: 0.25, fontWeight: 400 }}>/// </span>human4human
        </span>
        <span style={{ fontSize: "13px", color: "#5f6368", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "16px" }}>📖</span> Guide
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", padding: "14px 24px 0", width: "100%", maxWidth: "740px" }}>
        {[["uiux", "UI/UX Guide"], ["java", "Java Island"], ["gaogao", "Gaogao Asia"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "6px 14px", borderRadius: "999px",
            border: `1px solid ${tab === id ? "#1a1a1a" : "#e8eaed"}`,
            background: tab === id ? "#1a1a1a" : "#fff",
            color: tab === id ? "#fff" : "#5f6368",
            fontSize: "13px", fontWeight: 500, cursor: "pointer",
            transition: "all 0.15s",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Chat bubble */}
      <div style={{ width: "100%", maxWidth: "740px", padding: "20px 24px 0", display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          background: "#EDE7F6", color: "#1a1a1a",
          padding: "12px 18px", borderRadius: "20px 20px 4px 20px",
          fontSize: "15px", fontWeight: 500, maxWidth: "65%"
        }}>
          {questions[tab]}
        </div>
      </div>

      {/* AI Response */}
      <div style={{ width: "100%", maxWidth: "740px", padding: "24px 24px 0" }}>
        <AnnotatedText text={samples[tab]} />
      </div>

      {/* Input bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
        borderTop: "1px solid #e8eaed", padding: "12px 24px",
        display: "flex", justifyContent: "center",
      }}>
        <div style={{
          width: "100%", maxWidth: "740px", display: "flex", alignItems: "center",
          gap: "12px", background: "#f8f9fa", borderRadius: "24px",
          padding: "10px 16px", border: "1px solid #e8eaed",
        }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #60a5fa)", flexShrink: 0 }} />
          <span style={{ flex: 1, color: "#9aa0a6", fontSize: "15px" }}>try to ask me anything!</span>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", background: "#1a1a1a",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "14px", cursor: "pointer",
          }}>↑</div>
        </div>
      </div>

    </div>
  );
}
