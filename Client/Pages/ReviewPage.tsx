import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  List,
  Pagination,
  TextField
} from "@mui/material";
import * as React from "react";
import { apiService } from "../ApiService";
import SuggestionsPaginationModel from "../Models/SuggestionsPaginationModel";
import SuggestionCard from "../Components/SuggestionCard";
import SuggestionModel from "../Models/SuggestionModel";
import { SnackbarContext } from "../SnackbarContext";
import { Trans } from "react-i18next";

const EntriesPerPage: number = 25;

type ReviewStatus = 'accept' | 'reject';

interface State {
  currentPageIndex: number;
  currentPage: SuggestionsPaginationModel | null;
  error: 'list' | 'review' | null;
  selectedSuggestion: SuggestionModel | null;
  dialogOpen: ReviewStatus | null;
  modifiedComment: string;
}

export class ReviewPage extends React.Component<{}, State> {
  static contextType = SnackbarContext;
  declare context: React.ContextType<typeof SnackbarContext>;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentPageIndex: 0,
      currentPage: null,
      error: null,
      selectedSuggestion: null,
      dialogOpen: null,
      modifiedComment: ""
    };
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
          {this.renderConfirmationDialog('accept')}
          {this.renderConfirmationDialog('reject')}
        </Container>
      );
    } else if (this.state.error == 'list') {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>
            <Trans i18nKey="pages.review.errorList" />
          </Alert>
        </Container>
      );
    } else if (this.state.error == 'review') {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>
            <Trans i18nKey="pages.review.errorSubmit" />
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

  private renderSuggestions(): React.ReactNode {
    if (this.state.currentPage != null) {
      const suggestionCards = this.state.currentPage.suggestions
        .map(suggestion => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion}
                          onApprove={() => this.onSubmitReview('accept', suggestion)}
                          onReject={() => this.onSubmitReview('reject', suggestion)} />
        ));
      if (suggestionCards.length > 0) {
        return (
          <React.Fragment>
            <List>
              {suggestionCards}
            </List>

            <Pagination count={this.totalPages} page={this.state.currentPageIndex + 1} onChange={this.onPageChange} />
          </React.Fragment>
        );
      } else {
        return (
          <Container sx={{ p: 2 }}>
            <Alert severity="info">
              <Trans i18nKey="pages.review.noResults" />
            </Alert>
          </Container>
        );
      }
    } else {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>
            <Trans i18nKey="pages.review.errorDisplay" />
          </Alert>
        </Container>
      );
    }
  }

  private onSubmitReview(reviewStatus: ReviewStatus, suggestion: SuggestionModel): void {
    this.setState({
      dialogOpen: reviewStatus,
      selectedSuggestion: suggestion,
      modifiedComment: suggestion.comment
    });
  }

  private renderConfirmationDialog(reviewStatus: ReviewStatus): React.ReactNode {
    const initialComment = this.state.selectedSuggestion != null ? this.state.selectedSuggestion.comment : "";

    let contentText: React.ReactNode;
    let form: React.ReactNode = null;
    switch (reviewStatus) {
      case 'accept':
        contentText = (<span>Are you sure you would like to approve these changes?</span>);
        form = (
          <Container>
            <TextField label="Comment About Changes" multiline rows={2} defaultValue={initialComment}
                      onChange={event => this.setState({ modifiedComment: event.target.value })}
                      sx={{ width: '100%', marginTop: 2 }}/>
          </Container>
        );
        break;
      case 'reject':
        contentText = (<span>Are you sure you would like to reject these changes?</span>);
        break;
    }

    return (
      <Dialog open={this.state.dialogOpen == reviewStatus} onClose={() => this.onCancel()}>
        <DialogTitle>
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
          {form}
          <DialogActions>
            <Button onClick={() => this.onConfirmation(reviewStatus, this.state.modifiedComment)}>Yes</Button>
            <Button onClick={() => this.onCancel()}>No</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    )
  }

  private onConfirmation(reviewStatus: ReviewStatus, comment: string) {
    const approve = reviewStatus == 'accept';
    const snackbarMessage = approve ? "Successfully approved!" : "Successfully rejected!";
    apiService.reviewSuggestion(this.state.selectedSuggestion.id, approve, comment)
      .then(() => {
        this.updateSuggestionsList(this.state.currentPageIndex);
        this.context.display({ message: snackbarMessage });
        this.setState({ dialogOpen: null });
      })
      .catch(() => this.setState({ currentPage: null, currentPageIndex: 0, error: 'review'}));
  }

  private onCancel() {
    this.setState({ dialogOpen: null });
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
