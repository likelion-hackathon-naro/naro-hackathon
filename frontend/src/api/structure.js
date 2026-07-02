import structuredMock from "../../../shared/mock/structured.json";

const STRUCTURE_API_PATH = "/api/structure";

function toStringList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.title ?? item?.name ?? "";
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function unwrapStructuredPayload(payload) {
  return payload?.data ?? payload?.result ?? payload?.structured ?? payload ?? {};
}

export function normalizeStructuredWorry(rawText, payload = structuredMock) {
  const source = unwrapStructuredPayload(payload);

  return {
    rawText: rawText.trim(),
    goal: String(source.goal ?? "").trim(),
    current: toStringList(source.current),
    options: toStringList(source.options),
    criteria: toStringList(source.criteria),
    concerns: toStringList(source.concerns),
    missing: toStringList(source.missing),
    followup: String(source.followup ?? "").trim(),
  };
}

export async function structureWorryText(rawText) {
  const trimmedRawText = rawText.trim();

  try {
    const response = await fetch(STRUCTURE_API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rawText: trimmedRawText }),
    });

    if (!response.ok) {
      throw new Error(`Structure API failed: ${response.status}`);
    }

    const payload = await response.json();
    return normalizeStructuredWorry(trimmedRawText, payload);
  } catch (error) {
    console.warn("Using structured mock data because /api/structure failed.", error);
    return normalizeStructuredWorry(trimmedRawText, structuredMock);
  }
}
