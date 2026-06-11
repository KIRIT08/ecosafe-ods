import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { getRiskMeta } from '../../utils/riskColors'
import RiskLegend from './RiskLegend'
import RiskPopup from './RiskPopup'

const peruCenter = [-9.19, -75.0152]

function createRiskIcon(level) {
  const meta = getRiskMeta(level)

  return L.divIcon({
    className: '',
    html: `<span class="ecosafe-risk-marker" style="--marker-bg:${meta.bg};--marker-border:${meta.border}"></span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })
}

function RiskMap({ zones }) {
  return (
    <div className="ecosafe-map relative border border-emerald-300/15">
      <MapContainer center={peruCenter} zoom={5} scrollWheelZoom className="z-0">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zones.map((zone) => (
          <Marker
            key={zone.id}
            icon={createRiskIcon(zone.nivel_riesgo)}
            position={[Number(zone.latitud), Number(zone.longitud)]}
          >
            <Popup className="ecosafe-map-popup" closeButton>
              <RiskPopup zone={zone} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-5 left-5 z-[450] max-w-[18rem]">
        <RiskLegend />
      </div>
    </div>
  )
}

export default RiskMap
