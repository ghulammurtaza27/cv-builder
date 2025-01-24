export async function generateShareableLink(resumeData: any) {
  const encoded = btoa(JSON.stringify(resumeData))
  return `${window.location.origin}/resume/${encoded}`
}

export function decodeShareableLink(encoded: string) {
  try {
    return JSON.parse(atob(encoded))
  } catch (error) {
    console.error('Failed to decode resume data:', error)
    return null
  }
}

