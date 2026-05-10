import { ENV } from "@/config/env";
import { fetchAuthSession } from "aws-amplify/auth";

const API_GW_BASE =
  `${ENV.API_BASE_URL}/stamp`;

export async function fetchRoutes() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Authentication token not found");

  const response = await fetch(`${API_GW_BASE}/routes`, {
    headers: { 
      Authorization: `Bearer ${idToken}`,
      "x-api-key": ENV.API_KEY,
     },
  });

  if (!response.ok) throw new Error("Failed to fetch routes");
  return response.json();
}


export async function fetchCheckpoints(routeKey: string) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Authentication token not found");

  const response = await fetch(`${API_GW_BASE}/routes/${routeKey}/checkpoints`, {
    headers: { 
      Authorization: `Bearer ${idToken}`,
      "x-api-key": ENV.API_KEY,
     },
  });

  if (!response.ok) throw new Error("Failed to fetch checkpoints");
  return response.json();
}


export async function fetchRouteStart(routeKey: string) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Authentication token not found");

  const response = await fetch(`${API_GW_BASE}/routes/${routeKey}/start`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
        "x-api-key": ENV.API_KEY,
      },
    });

  if (!response.ok) throw new Error("Failed to start Route");
  return response.json();
}


export async function postCheckIn(routeKey: string, checkpointId: string) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  
  const response = await fetch(`${API_GW_BASE}/routes/${routeKey}/check-in`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
      "x-api-key": ENV.API_KEY,
    },
    body: JSON.stringify({ checkpoint_id: checkpointId }),
  });

  if (!response.ok) throw new Error("Check-in failed");
  return response.json();
}