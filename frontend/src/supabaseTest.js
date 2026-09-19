import { supabase } from "./lib/supabaseClient";

const testSupabase = async () => {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase Connection Error:", error);
    return;
  }

  console.log("Supabase Connected Successfully:", data);
};

testSupabase();