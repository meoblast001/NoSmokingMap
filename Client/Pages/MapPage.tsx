import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { Alert, Button, Container, LinearProgress, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EditIcon from '@mui/icons-material/Edit';
import LocationModel from '../Models/LocationModel';
import { apiService } from '../ApiService';
import { smokingStatusTranslationKey } from '../Models/SmokingStatus';
import { mapFilterPreferencesModel } from '../Models/MapFilterPreferencesModel';
import MapButtons from '../Components/MapButtons';
import MapFilterDialog from '../Components/MapFilterDialog';
import * as L from 'leaflet';

interface Props {
  navigate: NavigateFunction;
}

interface State {
  locations: LocationModel[] | null;
  error: boolean;
  isShowingFilterDialog: boolean;
}

const DefaultZoomLevel: number = 11;

class MapPageInternal extends React.Component<Props & WithTranslation, State> {
  constructor(props: Props & WithTranslation) {
    super(props);
    this.state = { locations: null, error: false, isShowingFilterDialog: false };
  }

  componentDidMount(): void {
    this.onPreferencesUpdated();
  }

  render(): React.ReactNode {
    const t = this.props.t;
    const defaultCoordinates: [number, number] = JSON.parse(document.getElementById('default-coordinates').innerHTML);
    const attributionLink = "<a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap</a>";
    if (this.state.locations) {
      return (
        <React.Fragment>
          <div style={{ width: '100%', height: '100%' }}>
            <MapContainer center={defaultCoordinates} zoom={DefaultZoomLevel}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution={t('pages.map.attribution', { link: attributionLink })} />
              {this.getMarkers()}
              <MapButtons onFilterButton={() => this.onFilterButton()}/>
            </MapContainer>
          </div>
          <MapFilterDialog open={this.state.isShowingFilterDialog} onSubmit={() => this.onFilterSubmit()} />
        </React.Fragment>
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

  private onPreferencesUpdated() {
    const preferences = mapFilterPreferencesModel.retrievePreferences();

    apiService.fetchLocations(Array.from(preferences.smokingStatuses))
      .then(locations => { this.setState({ locations, error: false }) })
      .catch(() => { this.setState({ locations: null, error: true })});
  }

  private onFilterButton() {
    this.setState({ isShowingFilterDialog: true });
  }

  private onFilterSubmit() {
    this.onPreferencesUpdated();
    this.setState({ isShowingFilterDialog: false });
  }

  private getMarkers(): React.ReactNode[] {
    const t = this.props.t;
    return this.state.locations.map(location => {
      const smokingStatus = location.smoking !== null
        ? (
          <React.Fragment>
            <br />
            <Trans i18nKey="pages.map.smoking_label"
                   values={{ status: t(smokingStatusTranslationKey(location.smoking)) }}
                   components={{ bold: <b /> }} />
          </React.Fragment>
        )
        : null;

      const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
      };
      const buttonStyle: React.CSSProperties = {
        flexGrow: 1,
        margin: '0px 5px'
      };

      let markerIcon = this.getMarkerIcon(location);

      return (
        <Marker key={location.id} position={[location.lat, location.lon]} {...(markerIcon && { icon: markerIcon })}>
          <Popup>
            <Typography>
              <b>{location.name}</b>
              {smokingStatus}
            </Typography>
            <div style={buttonContainerStyle}>
              <Button variant="outlined" style={buttonStyle} onClick={() => this.onGoogleButton(location)}>
                <GoogleIcon />
              </Button>
              <Button variant="outlined" style={buttonStyle} onClick={() => this.onEditButton(location)}>
                <EditIcon />
              </Button>
            </div>
          </Popup>
        </Marker>
      )
    });
  }

  private getMarkerIcon(location: LocationModel): L.Icon | undefined {
    var iconUrl: string = ['no', 'outside', 'isolated', 'separated'].indexOf(location.smoking) != -1
      ? `/pin-smoking-${location.smoking}.svg`
      : undefined;

    if (!iconUrl)
      return undefined;

    return L.icon({
      iconUrl,
      iconSize: [31, 31],
    });
  }

  private onGoogleButton(location: LocationModel) {
    if (location.lat !== null && location.lon !== null) {
      const name = encodeURIComponent(location.name);
      window.open(`https://www.google.com/maps/?q=${name}&ll=${location.lat},${location.lon}&z=16`, '_blank');
    }
  }

  private onEditButton(location: LocationModel) {
    this.props.navigate(`/edit/${location.type}/${location.id}`);
  }
}

const MapPageInternalWithTranslation = withTranslation()(MapPageInternal);

export default function MapPage() {
  const navigate = useNavigate();
  return <MapPageInternalWithTranslation navigate={navigate} />
}
