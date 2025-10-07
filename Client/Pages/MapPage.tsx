import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LocationModel from '../Models/LocationModel';
import { apiService } from '../ApiService';
import { Alert, Container, LinearProgress } from '@mui/material';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { smokingStatusTranslationKey } from '../Models/SmokingStatus';

interface State {
  locations: LocationModel[] | null;
  error: boolean;
}

class MapPage extends React.Component<WithTranslation, State> {
  constructor(props: WithTranslation) {
    super(props);
    this.state = { locations: null, error: false };
  }

  componentDidMount(): void {
    apiService.fetchLocations()
      .then(locations => { this.setState({ locations, error: false }) })
      .catch(() => { this.setState({ locations: null, error: true })});
  }

  render(): React.ReactNode {
    const t = this.props.t;
    const defaultCoordinates: [number, number] = JSON.parse(document.getElementById('default-coordinates').innerHTML);
    const attributionLink = "<a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap</a>";
    if (this.state.locations) {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <MapContainer center={defaultCoordinates} zoom={11}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                       attribution={t('pages.map.attribution', { link: attributionLink })} />
            {this.getMarkers()}
          </MapContainer>
        </div>
      );
    } else if (this.state.error) {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>
            <Trans i18nKey="pages.map.error" />
          </Alert>
        </Container>
      );
    } else {
      return (
        <Container sx={{ p: 2 }}>
          <LinearProgress />
        </Container>
      );
    }
  }

  private getMarkers(): React.ReactNode[] {
    const t = this.props.t;
    return this.state.locations.map(location => {
      const smokingStatus = location.smoking !== null
        ? (
          <React.Fragment>
            <br />
            <Trans i18nKey="pages.map.smoking_label"
                   values={{ status: t(smokingStatusTranslationKey(location.smoking)) }} />
          </React.Fragment>
        )
        : null;

      return (
        <Marker position={[location.lat, location.lon]}>
          <Popup>
            <b>{location.name}</b>
            {smokingStatus}
          </Popup>
        </Marker>
      )
    });
  }
}

export default withTranslation()(MapPage);
