import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "Firebase ID token",
  description:
    "A Firebase ID token. Customer endpoints require a token for a phone-auth user; /admin/* endpoints require one for a Staff-linked email/password user (see requireStaff/requireRole).",
});

export const idParam = z.object({ id: z.string().min(1) });

// Response bodies are intentionally left loosely typed (z.unknown()) rather
// than hand-written per endpoint — the request schemas below are the real
// zod schemas already enforcing validation in each controller, so they stay
// accurate as the API evolves. Full response DTOs are a reasonable future
// addition but a much larger effort than this pass covers.
export const anyResponse = z.unknown();
export const errorResponse = z.object({ error: z.string(), requestId: z.string().optional() });

export function jsonBody(schema: z.ZodType) {
  return { content: { "application/json": { schema } } };
}

export function jsonResponse(description: string, schema: z.ZodType = anyResponse) {
  return { description, content: { "application/json": { schema } } };
}

export const commonErrorResponses = {
  400: jsonResponse("Validation failed", errorResponse),
  401: jsonResponse("Missing or invalid token", errorResponse),
  403: jsonResponse("Insufficient role / inactive account", errorResponse),
  404: jsonResponse("Not found", errorResponse),
};
