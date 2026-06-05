import { useState } from "react";
import {
  findNearbyMentalHealthClinics,
  getGoogleMapsSearchUrl,
  getUserPosition,
  type NearbyClinic,
} from "../services/clinics";
import "./NearbyClinics.css";

export function NearbyClinics() {
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<NearbyClinic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapsFallback, setMapsFallback] = useState<string | null>(null);

  const handleLocate = async () => {
    setLoading(true);
    setError(null);
    setClinics(null);
    setMapsFallback(null);

    try {
      const position = await getUserPosition();
      const { latitude: lat, longitude: lon } = position.coords;
      setMapsFallback(getGoogleMapsSearchUrl(lat, lon));

      const found = await findNearbyMentalHealthClinics(lat, lon);
      setClinics(found);
      if (found.length === 0) {
        setError(
          "Não encontramos clínicas cadastradas bem perto de você no mapa aberto. Use o link do Google Maps abaixo.",
        );
      }
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "Precisamos da sua permissão de localização para buscar lugares próximos.",
          );
        } else {
          setError("Não foi possível obter sua localização. Tente de novo.");
        }
      } else {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar clínicas.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nearby-clinics">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleLocate}
        disabled={loading}
      >
        {loading ? "Buscando perto de você…" : "Usar minha localização"}
      </button>

      {error ? <p className="nearby-error">{error}</p> : null}

      {mapsFallback ? (
        <a
          className="nearby-maps-link"
          href={mapsFallback}
          target="_blank"
          rel="noreferrer"
        >
          Abrir busca no Google Maps
        </a>
      ) : null}

      {clinics && clinics.length > 0 ? (
        <ul className="nearby-list">
          {clinics.map((clinic) => (
            <li key={clinic.id} className="nearby-item">
              <div>
                <strong>{clinic.name}</strong>
                <span className="nearby-distance">
                  {clinic.distanceKm < 1
                    ? `${Math.round(clinic.distanceKm * 1000)} m`
                    : `${clinic.distanceKm.toFixed(1)} km`}
                </span>
                {clinic.address ? (
                  <p className="nearby-address">{clinic.address}</p>
                ) : null}
              </div>
              <a
                className="nearby-open"
                href={clinic.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver no mapa
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
