import type { ICompany } from "../models/company.schema.js";

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getLeadUserIdsFromCompany(company: ICompany): string[] {
  const ids = new Set<string>();
  const members = company.members;
  if (members && members.length > 0) {
    for (const m of members) {
      if (m.role === "lead" || m.role === "primary_lead") {
        ids.add(String(m.userId));
      }
    }
  }
  if (company.primaryLeadId) {
    ids.add(String(company.primaryLeadId));
  }
  return Array.from(ids);
}
