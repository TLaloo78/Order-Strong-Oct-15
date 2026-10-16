// Leaflet plugins such as leaflet.markercluster attach themselves to a global `L`,
// so expose Leaflet globally before any plugin module is evaluated.
import L from 'leaflet'

;(globalThis as unknown as { L: typeof L }).L = L

export default L
