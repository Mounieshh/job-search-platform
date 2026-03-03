export async function isValidDomain(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${domain}`)
    const data = await res.json()
    
    return data.some((company: any) => company.domain === domain)
  } catch {
    return false
  }
}