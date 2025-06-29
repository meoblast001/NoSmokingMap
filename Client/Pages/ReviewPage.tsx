import { Alert, Container, LinearProgress } from "@mui/material";
import * as React from "react";
import { apiService } from "../ApiService";
import SuggestionsPaginationModel from "../Models/SuggestionsPaginationModel";

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
}
