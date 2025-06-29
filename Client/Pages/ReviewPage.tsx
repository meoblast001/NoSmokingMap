import { Alert, Container, LinearProgress, List } from "@mui/material";
import * as React from "react";
import { apiService } from "../ApiService";
import SuggestionsPaginationModel from "../Models/SuggestionsPaginationModel";
import SuggestionCard from "../Components/SuggestionCard";

const EntriesLimit: number = 25;

interface State {
  currentOffset: number;
  currentPage: SuggestionsPaginationModel | null;
  error: boolean;
}

export class ReviewPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { currentOffset: 0, currentPage: null, error: false };
  }

  componentDidMount(): void {
    apiService.listAllSuggestions(this.state.currentOffset, EntriesLimit)
      .then(page => this.setState({ currentPage: page, error: page == null }))
      .catch(() => this.setState({ currentPage: null, error: true }))
  }

  render(): React.ReactNode {
    if (this.state.currentPage) {
      return (
        <Container sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          {this.renderSuggestions()}
        </Container>
      );
    } else if (this.state.error) {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to get list of contributions.</Alert>
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

  private renderSuggestions(): React.ReactNode {
    if (this.state.currentPage != null) {
      const suggestionCards = this.state.currentPage.suggestions
        .map(suggestion => <SuggestionCard suggestion={suggestion} />);
      return (
        <List>
          {suggestionCards}
        </List>
      )
    } else {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to display suggestions to review.</Alert>
        </Container>
      );
    }
  }
}
