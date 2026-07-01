import structuredMock from "../../../shared/mock/structured.json";

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

export function normalizeStructuredWorry(rawText, payload = structuredMock) {
  return {
    rawText: rawText.trim(),
    goal: String(payload.goal ?? "").trim(),
    current: toStringList(payload.current),
    options: toStringList(payload.options),
    criteria: toStringList(payload.criteria),
    concerns: toStringList(payload.concerns),
    missing: toStringList(payload.missing),
    followup: String(payload.followup ?? "").trim(),
  };
}

export async function structureWorryText(rawText) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });

  return normalizeStructuredWorry(rawText, structuredMock);
}
