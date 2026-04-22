export type ParsedFrontmatter = {
  data: {
    title?: string;
    date?: string;
    summary?: string;
    tags?: string[];
    image?: string;
  };
  content: string;
};

function stripQuotes(raw: string): string {
  const t = raw.trim();
  if (
    t.length >= 2 &&
    ((t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'")))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function parseValue(raw: string): string | string[] {
  const v = raw.trim();
  if (!v) return "";

  if (v.startsWith("[") && v.endsWith("]")) {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x));
      }
    } catch {
      // fall through to manual split
    }
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => stripQuotes(s))
      .filter(Boolean);
  }

  return stripQuotes(v);
}

export function parseFrontmatter(raw: string): ParsedFrontmatter {
  const match = raw.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const [, fm, rest] = match;
  const data: ParsedFrontmatter["data"] = {};

  for (const line of fm.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1);
    if (!key) continue;

    const value = parseValue(rawValue);

    switch (key) {
      case "title":
        if (typeof value === "string") data.title = value;
        break;
      case "date":
        if (typeof value === "string") data.date = value;
        break;
      case "summary":
        if (typeof value === "string") data.summary = value;
        break;
      case "image":
        if (typeof value === "string") data.image = value;
        break;
      case "tags":
        if (Array.isArray(value)) {
          data.tags = value.filter((v): v is string => typeof v === "string" && v.length > 0);
        }
        break;
    }
  }

  const content = rest.replace(/^\r?\n/, "");
  return { data, content };
}
