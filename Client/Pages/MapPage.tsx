import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LocationModel from '../Models/LocationModel';
import { apiService } from '../ApiService';
import { Alert, Container, LinearProgress } from '@mui/material';

interface State {
  locations: LocationModel[] | null;
  error: boolean;
}

export default class MapPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { locations: null, error: false };
  }

  componentDidMount(): void {
    apiService.fetchLocations()
      .then(locations => { this.setState({ locations, error: locations == null }) })
      .catch(() => { this.setState({ locations: null, error: true })});
  }

  render(): React.ReactNode {
    const defaultCoordinates: [number, number] = JSON.parse(document.getElementById('default-coordinates').innerHTML);
    if (this.state.locations) {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <MapContainer center={defaultCoordinates} zoom={11}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer>
            {this.getMarkers()}
          </MapContainer>
        </div>
      );
    } else if (this.state.error) {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to get locations.</Alert>
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
    return this.state.locations.map(location => {
      return (
        <Marker position={[location.lat, location.lon]}>
          <Popup>
            <b>{location.name}</b><br />
            Smoking: {location.smoking}
          </Popup>
        </Marker>
      )
    });
  }
}
