let demoRequests = 0
let realRequests = 0

export function trackApiTransport(isDemo: boolean): void {
  if (isDemo) demoRequests += 1
  else realRequests += 1
}

export function getApiTransportStats(): { demo: number; real: number } {
  return { demo: demoRequests, real: realRequests }
}

export function resetApiTransportStats(): void {
  demoRequests = 0
  realRequests = 0
}
