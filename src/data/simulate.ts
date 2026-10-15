// Development helper that makes the local mock data behave like a network.
// Delete this file when the repositories are backed by Supabase.
//
// Dev switches (read once when the app loads):
//   ?slow=1  -> longer delay, so loading states are easy to see
//   ?fail=1  -> every repository call fails, so error states are easy to see

interface Simulation {
  delayMs: number
  fail: boolean
}

const isTest = import.meta.env.MODE === 'test'

function readSimulationFromUrl(): Simulation {
  const base: Simulation = { delayMs: isTest ? 0 : 400, fail: false }
  if (typeof window === 'undefined') return base
  const params = new URLSearchParams(window.location.search)
  return {
    delayMs: params.get('slow') ? 2000 : base.delayMs,
    fail: params.get('fail') === '1',
  }
}

let simulation = readSimulationFromUrl()

/** For tests: override the simulated delay and failure mode. */
export function setSimulation(next: Partial<Simulation>): void {
  simulation = { ...simulation, ...next }
}

export async function simulateNetwork<T>(produce: () => T): Promise<T> {
  if (simulation.delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, simulation.delayMs))
  }
  if (simulation.fail) {
    throw new Error('Simulated network failure')
  }
  return produce()
}
