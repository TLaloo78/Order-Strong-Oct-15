import L from './leaflet'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { useEffect, useRef } from 'react'
import { priceLevelLabel } from '../../lib/price'
import { formatProteinRange } from '../../lib/protein'
import type { RestaurantSummary } from '../../types/restaurant'

interface RestaurantMapProps {
  restaurants: RestaurantSummary[]
  selectedId: string | null
  onSelect: (restaurantId: string) => void
}

// Free OpenStreetMap tiles are fine for development and light use. For production traffic,
// switch to a hosted tile provider (see README).
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const DEFAULT_CENTER: L.LatLngTuple = [41.8661, -88.107]

function pinLabel(restaurant: RestaurantSummary): string {
  const pick = restaurant.bestPick
  return pick
    ? `${restaurant.name}, ${restaurant.cuisine}. Best pick ${formatProteinRange(pick.protein)} protein.`
    : `${restaurant.name}, ${restaurant.cuisine}.`
}

function pinIcon(restaurant: RestaurantSummary): L.DivIcon {
  // Only a fixed "$" string goes into the HTML, never restaurant text.
  return L.divIcon({
    className: 'map-pin-wrap',
    html: `<span class="map-pin">${priceLevelLabel(restaurant.priceLevel)}</span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

function clusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount()
  return L.divIcon({
    className: 'map-cluster-wrap',
    html: `<span class="map-cluster">${count}<span class="sr-only"> restaurants here. Select to zoom in.</span></span>`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  })
}

/**
 * An OpenStreetMap map with one keyboard-focusable pin per restaurant.
 * Pins that would overlap are grouped into a numbered cluster; selecting it zooms in to split them.
 */
export default function RestaurantMap({ restaurants, selectedId, onSelect }: RestaurantMapProps) {
  const containerRef = useRef<HTMLElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef(new Map<string, L.Marker>())
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const selectedRef = useRef(selectedId)
  useEffect(() => {
    selectedRef.current = selectedId
  })
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  })

  // Create the map once.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const markers = markersRef.current
    const map = L.map(container, {
      // Wheel-zoom would hijack page scrolling; people can use the +/- buttons, double-click or pinch.
      scrollWheelZoom: false,
    })
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(map)
    map.setView(DEFAULT_CENTER, 12)
    mapRef.current = map
    return () => {
      markers.clear()
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Draw a pin for each restaurant and fit the view to them.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const markers = markersRef.current
    const group = L.markerClusterGroup({
      // Group pins only when they would actually overlap (pins are 44px).
      maxClusterRadius: 48,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: clusterIcon,
    })
    clusterRef.current = group

    for (const restaurant of restaurants) {
      const label = pinLabel(restaurant)
      const marker = L.marker([restaurant.latitude, restaurant.longitude], {
        icon: pinIcon(restaurant),
        title: label,
        alt: label,
        keyboard: true,
        riseOnHover: true,
      })
      marker.on('click', () => onSelectRef.current(restaurant.id))
      // A pin's element is recreated whenever it leaves a cluster, so re-apply the selected style.
      marker.on('add', () => {
        marker.getElement()?.classList.toggle('is-selected', selectedRef.current === restaurant.id)
      })
      marker.addTo(group)
      markers.set(restaurant.id, marker)
    }

    group.addTo(map)
    if (restaurants.length > 0) {
      map.fitBounds(group.getBounds(), { padding: [48, 48], maxZoom: 15 })
    }

    return () => {
      markers.clear()
      clusterRef.current = null
      if (map.hasLayer(group)) group.remove()
    }
  }, [restaurants])

  // Highlight the selected pin. Toggling a class (rather than swapping the icon) keeps keyboard focus on the pin.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markersRef.current.forEach((marker, id) => {
      const selected = id === selectedId
      marker.getElement()?.classList.toggle('is-selected', selected)
      marker.setZIndexOffset(selected ? 1000 : 0)
    })
    const selectedMarker = selectedId ? markersRef.current.get(selectedId) : undefined
    if (!selectedMarker) return
    // If the pin is inside a cluster, zoom in until it shows; otherwise just center it.
    if (clusterRef.current && !map.hasLayer(selectedMarker)) clusterRef.current.zoomToShowLayer(selectedMarker)
    else map.panTo(selectedMarker.getLatLng())
  }, [selectedId, restaurants])

  return (
    <section
      ref={containerRef}
      aria-label="Map of restaurants. Use Tab to move between pins and Enter to select one."
      className="isolate h-[45dvh] min-h-72 w-full overflow-hidden rounded-2xl border border-line bg-sand"
    />
  )
}
