"use client";

import { useEffect, useState } from "react";

/* ================================================================
   ✏️ IN-SITE EDITOR
   - Sirf `npm run dev` (aapke computer) pe dikhta hai. Live site pe
     ye buttons render nahi hote aur /api/content bhi 404 deta hai.
   - Save karne par src/data/portfolio.json update hota hai, page reload.
   ================================================================ */

export const IS_DEV = process.env.NODE_ENV === "development";

// Kaunsi file ka kaunsa field — schema
// t: "area" (lamba text) | "lines" (har line ek item) | "csv" (comma se alag) | "img" (upload)
const SECTION_DEFS = {
  profile: {
    kind: "object",
    fields: [
      { k: "firstName", l: "First name" },
      { k: "lastName", l: "Last name" },
      { k: "fullName", l: "Full name (footer)" },
      { k: "initials", l: "Initials (logo)" },
      { k: "email", l: "Email" },
      { k: "phone", l: "Phone (khali chhod do to hide ho jayega)" },
      { k: "location", l: "Location" },
      { k: "github", l: "GitHub URL" },
      { k: "linkedin", l: "LinkedIn URL" },
      { k: "resume", l: "Resume path (public/ ki file, e.g. /resume.pdf)" },
      { k: "avatarImage", l: "Avatar image (khali = animated avatar)", t: "img" },
    ],
  },
  heroWords: { kind: "strings", hint: "Rotating words — har line ek word" },
  about: {
    kind: "object",
    fields: [
      { k: "text", l: "About paragraph", t: "area" },
      { k: "highlight", l: "Highlight words", t: "csv" },
    ],
  },
  whatIDo: {
    kind: "list",
    itemName: "skill card",
    fields: [
      { k: "no", l: "Number (01, 02…)" },
      { k: "title", l: "Title" },
      { k: "text", l: "Description", t: "area" },
      { k: "tags", l: "Tags", t: "csv" },
    ],
  },
  stack: {
    kind: "list",
    itemName: "tile",
    fields: [
      { k: "abbr", l: "Short label (JS, Git, 🚀…)" },
      { k: "name", l: "Name" },
    ],
  },
  marquee: { kind: "strings", hint: "Scrolling strip — har line ek item" },
  projects: {
    kind: "list",
    itemName: "project",
    fields: [
      { k: "title", l: "Title" },
      { k: "type", l: "Type (e.g. Full-Stack · Deployed)" },
      { k: "emoji", l: "Emoji (preview fallback)" },
      { k: "description", l: "Description", t: "area" },
      { k: "points", l: "Points — har line ek point", t: "lines" },
      { k: "tags", l: "Tags", t: "csv" },
      { k: "live", l: "Live demo URL (khali = coming soon)" },
      { k: "code", l: "Source code URL" },
    ],
  },
  activities: {
    kind: "list",
    itemName: "entry",
    fields: [
      { k: "title", l: "Title" },
      { k: "org", l: "Organisation" },
      { k: "date", l: "Date (e.g. Mar 2026)" },
      { k: "type", l: "Type (Role, Talk, Education…)" },
      { k: "description", l: "Description", t: "area" },
    ],
  },
  certificates: {
    kind: "list",
    itemName: "certificate",
    fields: [
      { k: "title", l: "Certificate name" },
      { k: "issuer", l: "Issued by" },
      { k: "date", l: "Date (e.g. Jan 2026)" },
      { k: "image", l: "Certificate image", t: "img" },
      { k: "link", l: "Verify / credential URL" },
    ],
  },
  music: {
    kind: "object",
    fields: [
      { k: "src", l: "Music file (MP3 / OGG / WAV / M4A, 20MB tak)", t: "audio" },
      { k: "title", l: "Song name (player ke tooltip mein dikhega)" },
    ],
  },
  backgrounds: {
    kind: "object",
    fields: [
      { k: "stack", l: "Tech stack background", t: "img" },
      { k: "work", l: "Projects background", t: "img" },
      { k: "journey", l: "Journey background", t: "img" },
      { k: "certificates", l: "Certificates background", t: "img" },
      { k: "contact", l: "Contact background", t: "img" },
    ],
  },
};

// Edit button → kaunse sections ek saath khulenge
export const EDIT_GROUPS = {
  hero: { label: "Hero & profile", keys: ["profile", "heroWords"] },
  about: { label: "About", keys: ["about"] },
  skills: { label: "Skill cards", keys: ["whatIDo"] },
  stack: { label: "Tech stack", keys: ["stack", "marquee", "backgrounds"] },
  work: { label: "Projects", keys: ["projects", "backgrounds"] },
  journey: { label: "Journey", keys: ["activities", "backgrounds"] },
  certificates: { label: "Certificates", keys: ["certificates", "backgrounds"] },
  contact: { label: "Contact info", keys: ["profile", "backgrounds"] },
  music: { label: "Background music", keys: ["music"] },
};

export function EditBar({ groups, onEdit, abs = false, inline = false }) {
  if (!IS_DEV) return null;
  const cls = abs ? " abs" : inline ? " inline" : "";
  return (
    <div className={`ed-bar${cls}`}>
      {groups.map((g) => (
        <button
          key={g}
          type="button"
          className="ed-open"
          onClick={() => onEdit(g)}
        >
          ✏️ Edit {EDIT_GROUPS[g].label}
        </button>
      ))}
    </div>
  );
}

const TAB_LABELS = {
  profile: "Profile",
  heroWords: "Rotating words",
  marquee: "Marquee strip",
  stack: "Tech stack tiles",
  backgrounds: "Section backgrounds",
};

const blank = (fields) =>
  Object.fromEntries(
    fields.map((f) => [f.k, f.t === "lines" || f.t === "csv" ? [] : ""]),
  );

const cleanVal = (v) =>
  typeof v === "string"
    ? v.trim()
    : Array.isArray(v)
      ? v.map((s) => (typeof s === "string" ? s.trim() : s)).filter((s) => s !== "")
      : v;

function cleanSection(key, draft) {
  const def = SECTION_DEFS[key];
  if (def.kind === "strings") return cleanVal(draft);
  const cleanObj = (o) =>
    Object.fromEntries(Object.entries(o).map(([k, v]) => [k, cleanVal(v)]));
  return def.kind === "list" ? draft.map(cleanObj) : cleanObj(draft);
}

function ImageField({ value, onChange, audio = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fail hua");
      onChange(data.path);
    } catch (e) {
      setError(e.message);
    }
    setUploading(false);
  };

  return (
    <div className="ed-img">
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/uploads/… ya khali chhod do"
      />
      <label className="ed-small">
        {uploading ? "Uploading…" : audio ? "Upload music" : "Upload image"}
        <input
          type="file"
          accept={audio ? "audio/*" : "image/png,image/jpeg,image/webp,image/gif"}
          hidden
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </label>
      {value && audio && <audio className="ed-audio" controls src={value} />}
      {value && !audio && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ed-thumb" src={value} alt="" />
      )}
      {error && <span className="ed-err">{error}</span>}
    </div>
  );
}

function Field({ f, value, onChange }) {
  const t = f.t || "text";
  let input;
  if (t === "img") {
    input = <ImageField value={value} onChange={onChange} />;
  } else if (t === "audio") {
    input = <ImageField value={value} onChange={onChange} audio />;
  } else if (t === "area") {
    input = (
      <textarea
        rows={3}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  } else if (t === "lines") {
    input = (
      <textarea
        rows={4}
        value={(value || []).join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
      />
    );
  } else if (t === "csv") {
    input = (
      <input
        value={(value || []).join(", ")}
        onChange={(e) =>
          onChange(e.target.value.split(",").map((s) => s.trim()))
        }
      />
    );
  } else {
    input = (
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    );
  }
  return (
    <div className="ed-field">
      {f.l && <span className="ed-lbl">{f.l}</span>}
      {input}
    </div>
  );
}

export default function PortfolioEditor({ group, onClose }) {
  const keys = EDIT_GROUPS[group].keys;
  const [tab, setTab] = useState(keys[0]);
  const [drafts, setDrafts] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Latest file load karo (page ke snapshot ki jagah) — taaki purana data na dikhe
  useEffect(() => {
    let alive = true;
    const groupKeys = EDIT_GROUPS[group].keys;
    fetch("/api/content")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((doc) => {
        if (alive)
          setDrafts(
            Object.fromEntries(
              groupKeys.map((k) => [k, structuredClone(doc[k])]),
            ),
          );
      })
      .catch(() => {
        if (alive)
          setError("Data load nahi hua. Check karo ki `npm run dev` chal raha hai.");
      });
    return () => {
      alive = false;
    };
  }, [group]);

  // Esc se band, aur background scroll lock
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const def = SECTION_DEFS[tab];
  const cur = drafts?.[tab];
  const setCur = (next) => setDrafts((p) => ({ ...p, [tab]: next }));

  const move = (i, dir) => {
    const next = [...cur];
    const [item] = next.splice(i, 1);
    next.splice(i + dir, 0, item);
    setCur(next);
  };
  const remove = (i) => {
    if (window.confirm("Ye item delete karna hai?"))
      setCur(cur.filter((_, j) => j !== i));
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      for (const key of keys) {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: key,
            data: cleanSection(key, drafts[key]),
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Save fail hua");
        }
      }
      // Same jagah pe rehne ke liye scroll position yaad rakho
      try {
        sessionStorage.setItem("pf-scroll", String(window.scrollY));
      } catch {}
      window.location.reload();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="ed-overlay" onClick={onClose}>
      <style dangerouslySetInnerHTML={{ __html: ED_CSS }} />
      <div
        className="ed-box"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ed-head">
          <h2>Edit {EDIT_GROUPS[group].label}</h2>
          <button type="button" className="ed-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {keys.length > 1 && (
          <div className="ed-tabs">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                className={`ed-tab${k === tab ? " on" : ""}`}
                onClick={() => setTab(k)}
              >
                {TAB_LABELS[k]}
              </button>
            ))}
          </div>
        )}

        <div className="ed-body">
          {!drafts ? (
            <p className="ed-muted">{error || "Loading…"}</p>
          ) : def.kind === "strings" ? (
            <Field
              f={{ t: "lines", l: def.hint }}
              value={cur}
              onChange={setCur}
            />
          ) : def.kind === "object" ? (
            def.fields.map((f) => (
              <Field
                key={f.k}
                f={f}
                value={cur[f.k]}
                onChange={(v) => setCur({ ...cur, [f.k]: v })}
              />
            ))
          ) : (
            <>
              {cur.map((item, i) => (
                <div className="ed-item" key={i}>
                  <div className="ed-item-head">
                    <b>
                      {item.title || item.name || item.no || item.abbr || `Item ${i + 1}`}
                    </b>
                    <span className="ed-acts">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={i === cur.length - 1}
                        onClick={() => move(i, 1)}
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button type="button" onClick={() => remove(i)}>
                        Delete
                      </button>
                    </span>
                  </div>
                  {def.fields.map((f) => (
                    <Field
                      key={f.k}
                      f={f}
                      value={item[f.k]}
                      onChange={(v) =>
                        setCur(cur.map((x, j) => (j === i ? { ...x, [f.k]: v } : x)))
                      }
                    />
                  ))}
                </div>
              ))}
              <button
                type="button"
                className="ed-add"
                onClick={() => setCur([...cur, blank(def.fields)])}
              >
                + Add {def.itemName}
              </button>
            </>
          )}
        </div>

        <div className="ed-foot">
          <span className="ed-err">{error}</span>
          <div className="ed-acts">
            <button type="button" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button
              type="button"
              className="ed-primary"
              onClick={save}
              disabled={!drafts || busy}
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ED_CSS = `
.ed-bar{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;max-width:1200px;margin:0 auto;padding:4px 20px 12px;position:relative;z-index:5}
.ed-bar.abs{position:absolute;top:72px;right:16px;margin:0;padding:0;max-width:none;z-index:30}
.ed-bar.inline{margin:0 0 12px;padding:0;max-width:none;justify-content:flex-start;pointer-events:auto}
.ed-open{font-family:inherit;font-size:12px;font-weight:600;background:var(--bg2);color:var(--text);border:1px solid var(--line2);border-radius:999px;padding:8px 13px;cursor:pointer;box-shadow:0 6px 18px -10px rgba(0,0,0,.4)}
.ed-open:hover{border-color:var(--accent);color:var(--accent)}
.ed-overlay{position:fixed;inset:0;z-index:200;background:rgba(5,8,16,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px}
.ed-box{width:min(720px,100%);max-height:88vh;display:flex;flex-direction:column;background:var(--bg2);color:var(--text);border:1px solid var(--line2);border-radius:18px;box-shadow:0 30px 80px -20px rgba(0,0,0,.5);overflow:hidden;font-family:inherit}
.ed-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--line)}
.ed-head h2{margin:0;font-size:18px;font-weight:800}
.ed-x{background:none;border:0;color:var(--text);font-size:26px;line-height:1;cursor:pointer;padding:0 4px}
.ed-tabs{display:flex;gap:6px;flex-wrap:wrap;padding:12px 20px 0}
.ed-tab{background:var(--bg3);color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.ed-tab.on{color:var(--accent-ink);background:var(--accent);border-color:var(--accent)}
.ed-body{overflow:auto;padding:16px 20px;display:grid;gap:12px;align-content:start}
.ed-field{display:grid;gap:6px}
.ed-lbl{font-size:12px;color:var(--muted);font-weight:600}
.ed-field input,.ed-field textarea{width:100%;box-sizing:border-box;background:var(--bg);color:var(--text);border:1px solid var(--line2);border-radius:10px;padding:9px 11px;font:inherit;font-size:14px}
.ed-field textarea{resize:vertical}
.ed-item{border:1px solid var(--line);border-radius:14px;padding:12px;display:grid;gap:10px;background:var(--bg)}
.ed-item-head{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:14px}
.ed-acts{display:flex;gap:6px;align-items:center}
.ed-acts button,.ed-add,.ed-small{background:var(--bg3);color:var(--text);border:1px solid var(--line2);border-radius:8px;padding:6px 10px;font:inherit;font-size:12px;font-weight:600;cursor:pointer}
.ed-acts button:disabled{opacity:.35;cursor:default}
.ed-add{justify-self:start}
.ed-img{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.ed-img input{flex:1 1 200px}
.ed-audio{width:100%}
.ed-thumb{width:64px;height:44px;object-fit:cover;border-radius:8px;border:1px solid var(--line)}
.ed-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-top:1px solid var(--line)}
.ed-err{color:#dc2626;font-size:13px}
.ed-primary{background:var(--accent);color:var(--accent-ink);border:0;border-radius:999px;padding:10px 18px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer}
.ed-primary:disabled{opacity:.6;cursor:wait}
.ed-muted{color:var(--muted)}
`;
