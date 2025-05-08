import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default class MapPage extends React.Component {
  render(): React.ReactNode {
    return (
      <div style={{width: 1200, height: 700}}>
      <MapContainer center={[52.520008, 13.404954]} zoom={11}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer>
        {this.getMarkers()}
      </MapContainer>
      </div>
    );
  }

  private getMarkers(): React.ReactNode[] {
    let mapDataElement = document.getElementById("mapdata");
    let mapData: {Lat: number, Lon: number, Name: string}[] = JSON.parse(mapDataElement.innerText);
    return mapData.map(mapElement => {
      return (
        <Marker position={[mapElement.Lat, mapElement.Lon]}>
          <Popup>{mapElement.Name}</Popup>
        </Marker>
      )
    });
  }
}