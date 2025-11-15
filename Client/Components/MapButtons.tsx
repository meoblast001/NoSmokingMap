import * as React from 'react';
import { useMap } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { getCurrentPosition } from '../Geolocation';
import { useTranslation } from 'react-i18next';

const FlyInZoomLevel: number = 16;

export default function MapButtons(): React.ReactNode {
  const map = useMap();
  const { t } = useTranslation();

  async function onClickGeolocationButton(): Promise<void> {
    try {
      const position = await getCurrentPosition({
        timeout: 5000 /* 15s */,
        enableHighAccuracy: false,
        maximumAge: 300000 /* 5m */
      });

      map.flyTo([position.coords.latitude, position.coords.longitude], FlyInZoomLevel);
    } catch (error) {
      console.error("Failure to geolocate and reposition map", error);
      alert(t('pages.map.geolocation_error'));
    }
  }

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    color: '#000000',
    border: '2px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '5px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    lineHeight: 'normal'
  };
  return (
    <Control position="topright">
      <a style={buttonStyle} onClick={() => onClickGeolocationButton()}>
        <LocationSearchingIcon style={{ fontSize: '18px' }} />
      </a>
    </Control>
  );
}
