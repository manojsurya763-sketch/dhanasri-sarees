import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "@/openapi/registry";
import "@/openapi/paths";

export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Dhana Sri Sarees API",
      version: "1.0.0",
      description:
        "Customer-facing storefront endpoints plus /admin/* staff endpoints (Super Admin / Admin / Employee, role-gated by requireStaff/requireRole). Request schemas here are the same Zod schemas each controller validates against, so this spec stays accurate as the API evolves.",
    },
    servers: [{ url: "/" }],
  });
}
