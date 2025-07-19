import { Alert, Container, LinearProgress, List, Pagination } from "@mui/material";
import * as React from "react";
import { apiService } from "../ApiService";
import SuggestionsPaginationModel from "../Models/SuggestionsPaginationModel";
import SuggestionCard from "../Components/SuggestionCard";

const EntriesPerPage: number = 25;

interface State {
  currentPageIndex: number;
  currentPage: SuggestionsPaginationModel | null;
  error: boolean;
}

export class ReviewPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { currentPageIndex: 0, currentPage: null, error: false };
  }

  private get totalPages() {
    return this.state.currentPage != null ? Math.ceil(this.state.currentPage.totalEntries / EntriesPerPage) : 0;
  }

  componentDidMount(): void {
    this.updateSuggestionsList(0);
  }

  render(): React.ReactNode {
    if (this.state.currentPage) {
      return (
        <Container sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          {this.renderSuggestions()} 
          <Pagination count={this.totalPages} page={this.state.currentPageIndex + 1} onChange={this.onPageChange} />
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

  private updateSuggestionsList(pageIndex: number): void {
    apiService.listAllSuggestions(this.state.currentPageIndex * EntriesPerPage, EntriesPerPage)
      .then(page => this.setState({ currentPage: page, currentPageIndex: pageIndex, error: page == null }))
      .catch(() => this.setState({ currentPage: null, currentPageIndex: 0, error: true }))
  }

  private onPageChange(evt: React.ChangeEvent, page: number) {
    this.updateSuggestionsList(page - 1);
  }
}
