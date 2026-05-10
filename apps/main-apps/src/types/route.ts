import { STAMP_ROUTES } from "@/lib/data/routes";

export type RouteKey = (typeof STAMP_ROUTES)[number]["routes"][number]["key"];

export type Route = {
  key: RouteKey;
  label: string;
};


export interface Routes {
  id: number;
  label: string;
  description: string;
  key: string;
  region: string;
  thumbnail_url: string;
  status: string
}