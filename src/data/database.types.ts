// Mirrors the Supabase `public` schema. Regenerate with the Supabase CLI
// (`supabase gen types typescript --project-id <ref>`) after schema changes.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dishes: {
        Row: {
          created_at: string
          customization_tip: string
          customizations: string[]
          description: string
          id: string
          name: string
          price: number
          protein_confidence: string
          protein_max_g: number
          protein_min_g: number
          restaurant_id: string
          why_estimate: string
        }
        Insert: {
          created_at?: string
          customization_tip?: string
          customizations?: string[]
          description?: string
          id: string
          name: string
          price: number
          protein_confidence: string
          protein_max_g: number
          protein_min_g: number
          restaurant_id: string
          why_estimate?: string
        }
        Update: {
          created_at?: string
          customization_tip?: string
          customizations?: string[]
          description?: string
          id?: string
          name?: string
          price?: number
          protein_confidence?: string
          protein_max_g?: number
          protein_min_g?: number
          restaurant_id?: string
          why_estimate?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dishes_restaurant_id_fkey'
            columns: ['restaurant_id']
            isOneToOne: false
            referencedRelation: 'restaurants'
            referencedColumns: ['id']
          },
        ]
      }
      restaurants: {
        Row: {
          blurb: string
          created_at: string
          cuisine: string
          distance_mi: number
          entree_max_price: number
          entree_min_price: number
          id: string
          latitude: number
          longitude: number
          name: string
          neighborhood: string
          price_level: number
        }
        Insert: {
          blurb?: string
          created_at?: string
          cuisine: string
          distance_mi: number
          entree_max_price: number
          entree_min_price: number
          id: string
          latitude: number
          longitude: number
          name: string
          neighborhood: string
          price_level: number
        }
        Update: {
          blurb?: string
          created_at?: string
          cuisine?: string
          distance_mi?: number
          entree_max_price?: number
          entree_min_price?: number
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          neighborhood?: string
          price_level?: number
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
