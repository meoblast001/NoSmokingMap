import { Container, LinearProgress, Box, Alert } from "@mui/material";
import * as React from "react";
import SearchForm from '../Components/SearchForm';
import { getCurrentPosition } from '../Geolocation';
import { apiService } from "../ApiService";

interface State {
  searching: boolean;
  geolocationFailure: boolean;
}

export default class SearchEditPage extends React.Component<{}, State> {
  constructor(params: {}) {
    super(params);
    this.state = { searching: false, geolocationFailure: false };
  }

  render(): React.ReactNode {
    return (
      <Container sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <SearchForm blockingInput={this.state.searching}
            onSearch={x => this.onSearch(x)}
            onShowNearbyLocations={() => this.onShowNearbyLocations()}/>
        {this.renderSearching()}
        {this.renderGeolocationFailure()}
      </Container>
    );
  }

  private renderSearching(): React.ReactNode {
    if (this.state.searching)
      return (<Box sx={{ p: 2, textAlign: 'center' }}><LinearProgress /></Box>);
    else
      return null;
  }

  private renderGeolocationFailure(): React.ReactNode {
    if (this.state.geolocationFailure) {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to get locations.</Alert>
        </Container>
      )
    }
    else
      return null;
  }

  private async onSearch(searchTerm: string) {
    this.setState({ searching: true, geolocationFailure: false });
    await apiService.searchLocationsByTerms(searchTerm);
    this.setState({ searching: false, geolocationFailure: false });
  }

  private async onShowNearbyLocations() {
    try {
      this.setState({ searching: true, geolocationFailure: false });
      const position = await getCurrentPosition({
        timeout: 15000 /* 15s */,
        enableHighAccuracy: false,
        maximumAge: 300000 /* 5m */
      });
      await apiService.searchLocationsByGeoposition(position.coords.latitude, position.coords.longitude);
      this.setState({ searching: false, geolocationFailure: false })
    } catch (error) {
      console.debug("Failure to search by geolocation", error);
      this.setState({ searching: false, geolocationFailure: true });
    }
  }
}