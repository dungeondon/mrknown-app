import { createClient } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  original_price: number;
  affiliate_url: string;
  image_url: string;
  category: string;
  brand: string;
  rating: number;
  review_count: number;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  is_featured: boolean;
}

// ─── Client ───────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Queries ──────────────────────────────────────────────────────────────────

// export async function getFeaturedProducts(): Promise<Product[]> {
//   const { data, error } = await supabase
//     .from("products")
//     .select("*")
//     .eq("is_featured", true)
//     .eq("is_active", true)
//     .order("rating", { ascending: false })
//     .limit(5);

//   if (error) {
//     console.error("[supabase] getFeaturedProducts:", error.message);
//     return [];
//   }
//   return data ?? [];
// }
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("[supabase] getFeaturedProducts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProducts(
  category?: string,
  search?: string,
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  if (category && category !== "All") query = query.eq("category", category);
  if (search?.trim()) query = query.ilike("name", `%${search.trim()}%`);

  const { data, error } = await query;

  if (error) {
    console.error("[supabase] getProducts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      // PGRST116 = no rows found — not a real error
      console.error("[supabase] getProductBySlug:", error.message);
    }
    return null;
  }
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true);

  if (error) {
    console.error("[supabase] getCategories:", error.message);
    return [];
  }

  const unique = [
    ...new Set((data ?? []).map((d: { category: string }) => d.category)),
  ];
  return unique.sort();
}

export async function getLatestProducts(limit = 5) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, image_url, price, category")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[supabase] getLatestProducts:", error.message);
    return [];
  }
  return data ?? [];
}
