import "server-only";
import type { ChartProvider } from "./types";
import { astronomyEngineProvider } from "./engine";
import { fixtureProvider } from "./fixture";

/**
 * Selects the birth chart provider. Swap implementations here to connect a
 * different calculation service; every provider returns the same ChartResult.
 *
 * BIRTH_CHART_PROVIDER=astronomy-engine (default) | fixture
 */
export function getChartProvider(): ChartProvider {
  switch (process.env.BIRTH_CHART_PROVIDER) {
    case "fixture":
      return fixtureProvider;
    default:
      return astronomyEngineProvider;
  }
}
