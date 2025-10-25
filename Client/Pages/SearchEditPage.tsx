import { Container, LinearProgress, Box, Alert, List, Divider } from "@mui/material";
import * as React from "react";
import SearchForm from '../Components/SearchForm';
import { getCurrentPosition } from '../Geolocation';
import { apiService } from "../ApiService";
import LocationModel from "../Models/LocationModel";
import AmenityCard from "../Components/AmenityCard";
import { NavigateFunction, useNavigate } from "react-router";
import { Trans } from "react-i18next";

interface Props {
  navigate: NavigateFunction;
}

interface State {
  searching: boolean;
  error: 'search' | 'geolocation' | null;
  results: LocationModel[];
}

export class SearchEditPageInternal extends React.Component<Props, State> {
  constructor(params: Props) {
    super(params);
    this.state = { searching: false, error: null, results: [] };
  }

  render(): React.ReactNode {
    return (
      <Container sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <SearchForm blockingInput={this.state.searching}
            onSearch={x => this.onSearch(x)}
            onShowNearbyLocations={() => this.onShowNearbyLocations()}/>
        <Divider sx={{ p: 1 }} />
        {this.renderSearching()}
        {this.renderGeolocationFailure()}
        {this.renderResults()}
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
    switch (this.state.error) {
      case 'search':
        return (
          <Container sx={{ p: 2 }}>
            <Alert severity='error'>
              <Trans i18nKey="pages.search_edit.error_search" />
            </Alert>
          </Container>
        );
      case 'geolocation':
        return (
          <Container sx={{ p: 2 }}>
            <Alert severity='error'>
              <Trans i18nKey="pages.search_edit.error_geolocation" />
            </Alert>
          </Container>
        );
      default:
        return null;
    }
  }

  private renderResults(): React.ReactNode {
    if (this.state.error == null)
    {
      const resultCards = this.state.results
        .map(result => (
          <AmenityCard key={result.id} location={result} onClick={() => this.onAmenityClicked(result)} />
        ));
      return (
        <List>
          {resultCards}
        </List>
      );
    }
  }

  private onAmenityClicked(locationModel: LocationModel) {
    this.props.navigate(`/edit/${locationModel.type}/${locationModel.id}`);
  }

  private async onSearch(searchTerm: string) {
    try {
      this.setState({ searching: true, error: null });
      const results = await apiService.searchLocationsByTerms(searchTerm);
      this.setState({ searching: false, error: null, results });
    } catch (error) {
      console.debug("Failed to search", error);
      this.setState({ searching: false, error: 'search', results: []});
    }
  }

  private async onShowNearbyLocations() {
    try {
      this.setState({ searching: true, error: null });
      const position = await getCurrentPosition({
        timeout: 15000 /* 15s */,
        enableHighAccuracy: false,
        maximumAge: 300000 /* 5m */
      });
      const results = await apiService.searchLocationsByGeoposition(position.coords.latitude,
        position.coords.longitude);
      this.setState({ searching: false, error: null, results });
    } catch (error) {
      console.debug("Failure to search by geolocation", error);
      this.setState({ searching: false, error: 'geolocation', results: [] });
    }
  }
}

export default function SearchEditPage() {
  const navigate = useNavigate();
  return <SearchEditPageInternal navigate={navigate} />;
}
