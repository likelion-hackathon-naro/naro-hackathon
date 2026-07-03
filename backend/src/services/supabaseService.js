let supabaseClient = null;

async function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;

  if (!SUPABASE_URL) {
    throw new Error("SUPABASE_URL이 설정되어 있지 않습니다.");
  }

  if (!SUPABASE_SECRET_KEY) {
    throw new Error("SUPABASE_SECRET_KEY가 설정되어 있지 않습니다.");
  }

  const { createClient } = await import("@supabase/supabase-js");

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function buildDecisionMapRow(payload) {
  const data = isPlainObject(payload.data) ? payload.data : {};

  const structuredData =
    data.structuredData || payload.structuredData || payload.structured || {};

  const routes = Array.isArray(data.routes)
    ? data.routes
    : Array.isArray(payload.routes)
      ? payload.routes
      : [];

  const comparisonResult =
    data.comparisonResult ||
    payload.comparisonResult ||
    payload.comparison ||
    null;

  const selectedRoute = data.selectedRoute || payload.selectedRoute || null;

  const todos = Array.isArray(data.todos)
    ? data.todos
    : Array.isArray(payload.todos)
      ? payload.todos
      : [];

  const title =
    typeof payload.title === "string" && payload.title.trim()
      ? payload.title.trim()
      : typeof structuredData.goal === "string" && structuredData.goal.trim()
        ? structuredData.goal.trim()
        : "나의 선택 지도";

  const rawText =
    typeof payload.rawText === "string"
      ? payload.rawText
      : typeof payload.raw_text === "string"
        ? payload.raw_text
        : null;

  const goal =
    typeof structuredData.goal === "string"
      ? structuredData.goal
      : typeof payload.goal === "string"
        ? payload.goal
        : null;

  const selectedRouteId =
    selectedRoute && typeof selectedRoute === "object"
      ? selectedRoute.id || selectedRoute.routeId || null
      : null;

  return {
    title,
    raw_text: rawText,
    goal,
    selected_route_id: selectedRouteId,
    data: {
      structuredData,
      routes,
      comparisonResult,
      selectedRoute,
      todos,
    },
  };
}

function toDecisionMapResponse(row) {
  return {
    id: row.id,
    title: row.title,
    rawText: row.raw_text,
    goal: row.goal,
    selectedRouteId: row.selected_route_id,
    mapData: row.data,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createDecisionMap(payload) {
  const supabase = await getSupabaseClient();
  const row = buildDecisionMapRow(payload);

  const { data, error } = await supabase
    .from("decision_maps")
    .insert(row)
    .select(
      `
      id,
      title,
      raw_text,
      goal,
      selected_route_id,
      data,
      created_at,
      updated_at
    `,
    )
    .single();

  if (error) {
    throw new Error(`decision map 저장 실패: ${error.message}`);
  }

  return toDecisionMapResponse(data);
}

async function getDecisionMapById(id) {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("decision_maps")
    .select(
      `
      id,
      title,
      raw_text,
      goal,
      selected_route_id,
      data,
      created_at,
      updated_at
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`decision map 조회 실패: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return toDecisionMapResponse(data);
}

module.exports = {
  createDecisionMap,
  getDecisionMapById,
};
