import { existsSync } from "node:fs";
import path from "node:path";
import { heat } from "./site";

// Server-only: true once the rulebook PDF has been placed in /public (checked at build time).
export function hasHeatRulebook() {
  return existsSync(path.join(process.cwd(), "public", heat.rulebook));
}
