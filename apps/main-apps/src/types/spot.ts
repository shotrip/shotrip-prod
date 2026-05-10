export interface SpotSource {
  PK: string;
  spot_id: string;
  name: string;
  image_url: string;
  short_description: string;
  prefecture: string;
  city: string;
  map_url?: string;
  is_fav?: boolean;
}