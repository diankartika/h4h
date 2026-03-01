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
  // Split by markers first (they may appear inside bold spans after A0 transform)
  // Then handle bold/italic in the remaining text segments
  const MARKER_RE = /(\[[^\]]+\]\^?\(?\d*\)?)/g;
  const tokens = [];
  let last = 0, m;
  MARKER_RE.lastIndex = 0;
  while ((m = MARKER_RE.exec(content)) !== null) {
    if (m.index > last) tokens.push({ k: "text", v: content.slice(last, m.index) });
    tokens.push({ k: "marker", v: m[0] });
    last = m.index + m[0].length;
  }
  if (last < content.length) tokens.push({ k: "text", v: content.slice(last) });

  const result = [];
  tokens.forEach((tok, ti) => {
    if (tok.k === "marker") {
      const markerMatch = tok.v.match(/^\[([^\]]+)\]\^?\(?(\d*)\)?$/);
      if (markerMatch) {
        const [, label, num] = markerMatch;
        const s = getMarkerStyle(label);
        result.push(
          <span key={ti} style={{
            display: "inline-flex", alignItems: "center", gap: "2px",
            padding: "2px 8px", marginInline: "3px", borderRadius: "999px",
            backgroundColor: s.bg, color: s.color, fontSize: "11.5px",
            fontWeight: 600, verticalAlign: "middle", whiteSpace: "nowrap",
            border: `1px solid ${s.border}`, lineHeight: 1.4,
          }}>
            {label}{num ? <sup style={{ fontSize: "9px", opacity: 0.7, marginLeft: "1px" }}>{num}</sup> : null}
          </span>
        );
      }
    } else {
      const STYLE_RE = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
      const parts = tok.v.split(STYLE_RE);
      parts.forEach((p, pi) => {
        if (!p) return;
        const key = ti * 1000 + pi;
        if (p.startsWith("**") && p.endsWith("**")) {
          result.push(<strong key={key} style={{ fontWeight: 700, color: "#1a1a1a" }}>{renderInline(p.slice(2, -2))}</strong>);
        } else if (p.startsWith("*") && p.endsWith("*")) {
          result.push(<em key={key} style={{ fontStyle: "italic" }}>{p.slice(1, -1)}</em>);
        } else {
          result.push(p);
        }
      });
    }
  });
  return result;
};

// ─── PRE-PARSER ───────────────────────────────────────────────────────────────
const preParse = (text) => {
  const NL = "\n";

  // P0. Strip ":Label:body" prefix — LLM sometimes emits ":Location:Yogyakarta"
  // Just remove the label+colons, keep the body text
  text = text.replace(/^:[^:\n]{1,40}:([ \t]*)/gm, function(_, space) {
    return "";
  });

  // P1. Strip orphan leading colon left after splitting
  text = text.replace(/^:\s+/gm, "");

    // A1. Split inline bullets after sentence-ending punct before bold: ". * **" or "? * **"
  text = text
    .replace(/([.?!])\s*\*\s+(?=\*\*)/g, function(_, p) { return p + NL + "* "; })
    .replace(/([.?!])\s*-\s+(?=\*\*)/g,  function(_, p) { return p + NL + "- "; });

  // A2. Split inline headings: "[marker]. ### Step" or "[marker]. ## Title"
  text = text.replace(
    /(\]\^?\(?\d*\)?)\s*[.?!]\s+(#{2,3}\s+)/g,
    function(_, m, h) { return m + NL + h; }
  );

  // A3. Split horizontal rule: "[marker]. ---" or plain ". ---"
  text = text.replace(
    /(\]\^?\(?\d*\)?)\s*\.\s+---/g,
    function(_, m) { return m + NL + "---"; }
  );
  text = text.replace(/\.\s+---(\s|$)/g, "." + NL + "---" + NL);

  // B. Fix "N [m1]. [m2]?. **Title:** body" at LINE START
  // -> "N. **Title** [m1] [m2]:\nbody"
  text = text.replace(
    /^(\d+)\s+(\[[^\]]+\]\^?\(?\d*\)?)((?:\s*\.\s*\[[^\]]+\]\^?\(?\d*\)?)*)\s*\.\s*(.*)/gm,
    function(_, num, m1, extra, rest) {
      var allM = m1;
      if (extra) {
        var ex = extra.match(/\[[^\]]+\]\^?\(?\d*\)?/g);
        if (ex) allM += " " + ex.join(" ");
      }
      var boldTitle = rest.match(/^(\*\*[^*]+\*\*):?\s*([\s\S]*)/);
      if (boldTitle) {
        var titleText = boldTitle[1];
        var body = boldTitle[2].trim();
        var inner = titleText.replace(/^\*\*|\*\*$/g, "");
        var colon = inner.trim().endsWith(":") ? "" : ":";
        return num + ". " + titleText + " " + allM.trim() + colon + (body ? NL + body : "");
      }
      return num + ". " + rest + " " + allM.trim();
    }
  );

  // C. Split mid-paragraph run-on: "body text. N [m1]. [m2]?. **Title:**"
  text = text.replace(
    /\.\s+(\d+)\s+(\[[^\]]+\]\^?\(?\d*\)?)((?:\s*\.\s*\[[^\]]+\]\^?\(?\d*\)?)*)\s*\.\s*(\*\*[^*]+\*\*):?\s*/g,
    function(_, num, m1, extra, bold) {
      var allM = m1;
      if (extra) { var ex = extra.match(/\[[^\]]+\]\^?\(?\d*\)?/g); if (ex) allM += " " + ex.join(" "); }
      var inner = bold.replace(/^\*\*|\*\*$/g, "");
      var colon = inner.trim().endsWith(":") ? "" : ":";
      return NL + num + ". " + bold + " " + allM.trim() + colon + NL;
    }
  );

  // D. Inline sub-bullet after marker: "[marker]. * **text**" or "[marker]? - **text**"
  text = text
    .replace(/(\]\^?\(?\d*\)?)\s*[.?!]\s*\*\s+/g,  function(_, m) { return m + NL + "* "; })
    .replace(/(\]\^?\(?\d*\)?)\s*[.?!]\s*-\s+/g,   function(_, m) { return m + NL + "- "; });

  // E. Detach standalone bold subheaders: "[marker]. **Category:**" -> "[marker]\n**Category:**"
  text = text.replace(
    /(\]\^?\(?\d*\)?)\s*[.?!]?\s*(\*\*[^*]+:\*\*)/g,
    function(_, m, h) { return m + NL + h; }
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
    const numMatch = t.match(/^(\d+)[.)]\s+([\s\S]*)/);
    if (numMatch) { blocks.push({ type: "numbered", num: parseInt(numMatch[1]), text: numMatch[2] }); return; }

    // Bullet list: "* text" / "- text" / "• text"
    const bulletMatch = t.match(/^[-*•]\s+([\s\S]*)/);
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
    marginBottom: indent ? "6px" : "12px",
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
            marginLeft: "36px", marginBottom: "12px",
            fontSize: "14.5px", lineHeight: 1.7, color: "#5f6368",
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
