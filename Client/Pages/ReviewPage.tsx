import { Alert, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, List, Pagination } from "@mui/material";
import * as React from "react";
import { apiService } from "../ApiService";
import SuggestionsPaginationModel from "../Models/SuggestionsPaginationModel";
import SuggestionCard from "../Components/SuggestionCard";
import SuggestionModel from "../Models/SuggestionModel";

const EntriesPerPage: number = 25;

type ReviewStatus = 'accept' | 'reject';

interface State {
  currentPageIndex: number;
  currentPage: SuggestionsPaginationModel | null;
  error: 'list' | 'review' | null;
  selectedSuggestion: SuggestionModel | null;
  dialogOpen: ReviewStatus | null;
}

export class ReviewPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { currentPageIndex: 0, currentPage: null, error: null, selectedSuggestion: null, dialogOpen: null };
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
          {this.renderConfirmationDialog('accept')}
          {this.renderConfirmationDialog('reject')}
        </Container>
      );
    } else if (this.state.error == 'list') {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to get list of contributions.</Alert>
        </Container>
      );
    } else if (this.state.error == 'review') {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to submit review.</Alert>
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
        .map(suggestion => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion}
                          onApprove={() => this.onSubmitReview('accept', suggestion)}
                          onReject={() => this.onSubmitReview('reject', suggestion)} />
        ));
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

  private onSubmitReview(reviewStatus: ReviewStatus, suggestion: SuggestionModel): void {
    this.setState({ dialogOpen: reviewStatus, selectedSuggestion: suggestion });
  }

  private renderConfirmationDialog(reviewStatus: ReviewStatus): React.ReactNode {
    let contentText: React.ReactNode;
    switch (reviewStatus) {
      case 'accept':
        contentText = <span>Are you sure you would like to approve these changes?</span>;
        break;
      case 'reject':
        contentText = <span>Are you sure you would like to reject these changes?</span>;
        break;
    }
    return (
      <Dialog open={this.state.dialogOpen == reviewStatus} onClose={() => this.onConfirmation(reviewStatus, false)}>
        <DialogTitle>
          Confirmation
        </DialogTitle>

        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
          <DialogActions>
            <Button onClick={() => this.onConfirmation(reviewStatus, true)}>Yes</Button>
            <Button onClick={() => this.onConfirmation(reviewStatus, false)}>No</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    )
  }

  private onConfirmation(reviewStatus: ReviewStatus, confirmation: boolean) {
    if (confirmation) {
      apiService.reviewSuggestion(this.state.selectedSuggestion.id, this.state.dialogOpen == 'accept')
        .then(success => {
          console.log(`Successful: ${success}`);
          this.updateSuggestionsList(this.state.currentPageIndex);
        })
        .catch(() => this.setState({ currentPage: null, currentPageIndex: 0, error: 'review'}))
    } else {
      this.setState({ dialogOpen: null });
    }
  }

  private updateSuggestionsList(pageIndex: number): void {
    apiService.listAllSuggestions(this.state.currentPageIndex * EntriesPerPage, EntriesPerPage)
      .then(page => this.setState({ currentPage: page, currentPageIndex: pageIndex,
                                    error: page == null ? 'list' : null }))
      .catch(() => this.setState({ currentPage: null, currentPageIndex: 0, error: 'list' }))
  }

  private onPageChange(evt: React.ChangeEvent, page: number) {
    this.updateSuggestionsList(page - 1);
  }
}
