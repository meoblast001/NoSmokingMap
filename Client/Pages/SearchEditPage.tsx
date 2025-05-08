import { Container, LinearProgress, Box } from "@mui/material";
import * as React from "react";
import SearchForm from '../Components/SearchForm';

interface State {
  searching: boolean;
}

export default class SearchEditPage extends React.Component<{}, State> {
  constructor(params: {}) {
    super(params);
    this.state = { searching: false };
  }

  render(): React.ReactNode {
    return (
      <Container sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <SearchForm blockingInput={this.state.searching}
            onSearch={x => this.onSearch(x)}
            onShowNearbyLocations={() => this.onShowNearbyLocations()}/>
        {this.renderSearching()}
      </Container>
    );
  }

  private renderSearching(): React.ReactNode {
    if (this.state.searching)
      return (<Box sx={{ p: 2, textAlign: 'center' }}><LinearProgress /></Box>);
    else
      return null;
  }

  private onSearch(searchTerm: string) {
    console.log("Searching: " + searchTerm);
    this.setState({ searching: true });
  }

  private onShowNearbyLocations() {
    console.log("Showing nearby locations");
    this.setState({ searching: true });
  }
}