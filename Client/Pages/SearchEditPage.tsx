import { Container, LinearProgress, Box, Alert, List, Divider } from "@mui/material";
import * as React from "react";
import SearchForm from '../Components/SearchForm';
import { getCurrentPosition } from '../Geolocation';
import { apiService } from "../ApiService";
import LocationModel from "../Models/LocationModel";
import AmenityCard from "../Components/AmenityCard";
import { NavigateFunction, useNavigate } from "react-router";

interface Props {
  navigate: NavigateFunction;
}

interface State {
  searching: boolean;
  geolocationFailure: boolean;
  results: LocationModel[] | null;
}

export class SearchEditPageInternal extends React.Component<Props, State> {
  constructor(params: Props) {
    super(params);
    this.state = { searching: false, geolocationFailure: false, results: [] };
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
    if (this.state.geolocationFailure) {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to get locations.</Alert>
        </Container>
      );
    }
    else
      return null;
  }

  private renderResults(): React.ReactNode {
    if (this.state.results != null)
    {
      const resultCards = this.state.results
        .map(result => <AmenityCard location={result} onClick={id => this.onAmenityClicked(id)} />);
      return (
        <List>
          {resultCards}
        </List>
      );
    }
    else
    {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to search.</Alert>
        </Container>
      );
    }
  }

  private onAmenityClicked(id: number) {
    this.props.navigate(`/edit/${id}`);
  }

  private async onSearch(searchTerm: string) {
    this.setState({ searching: true, geolocationFailure: false });
    const results = await apiService.searchLocationsByTerms(searchTerm);
    this.setState({ searching: false, geolocationFailure: false, results });
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

export default function SearchEditPage() {
  const navigate = useNavigate();
  return <SearchEditPageInternal navigate={navigate} />;
}