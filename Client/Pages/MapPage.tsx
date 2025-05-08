import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LocationModel from '../Models/LocationModel';
import { apiService } from '../ApiService';

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
    if (this.state.locations) {
      return (
        <div style={{width: 1200, height: 700}}>
          <MapContainer center={[52.520008, 13.404954]} zoom={11}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer>
            {this.getMarkers()}
          </MapContainer>
        </div>
      );
    } else if (this.state.error) {
      return (<div>Error.</div>);
    } else {
      return (<div>Loading...</div>);
    }
  }

  private getMarkers(): React.ReactNode[] {
    return this.state.locations.map(location => {
      return (
        <Marker position={[location.lat, location.lon]}>
          <Popup>{location.name}</Popup>
        </Marker>
      )
    });
  }
}