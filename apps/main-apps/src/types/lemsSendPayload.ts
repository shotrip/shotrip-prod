export type LensSendPayload = {
  message: string;
    context: {
    tenantId: string;
    namespace: string;
    token: string;
  } | null;
};