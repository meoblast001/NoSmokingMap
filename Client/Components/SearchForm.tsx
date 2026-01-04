import { Box, Button, TextField } from '@mui/material';
import * as React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

interface Params {
  blockingInput: boolean;
  onSearch: (searchTerm: string) => void
  onShowNearbyLocations: () => void
}

class SearchForm extends React.Component<Params & WithTranslation> {
  private searchTerm: string = '';

  constructor(params: Params & WithTranslation) {
    super(params);
  }

  render(): React.ReactNode {
    const t = this.props.t;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }} component="form"
            onSubmit={(e) => this.onSearchSubmit(e)}>
          <TextField label={t('components.search_form.search_terms')}
              variant="outlined"
              onChange={(event) => this.onSearchTermChanged(event)}
              disabled={this.props.blockingInput}
              sx={{ flex: 1 }} />
          <Button variant="contained"
              endIcon={<SearchIcon />}
              type="submit"
              disabled={this.props.blockingInput}>
            <Trans i18nKey="components.search_form.search_button" />
          </Button>
        </Box>
        <Button variant="outlined"
            endIcon={<LocationSearchingIcon />}
            onClick={() => this.onShowNearbyLocations()}
            disabled={this.props.blockingInput}>
          <Trans i18nKey="components.search_form.show_nearby_locations" />
        </Button>
      </Box>
    );
  }

  private onSearchTermChanged(changeEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.searchTerm = changeEvent.target.value;
  }

  private onSearchSubmit(evt: React.FormEvent<HTMLFormElement>) {
    this.props.onSearch(this.searchTerm);
    evt.preventDefault();
  }

  private onShowNearbyLocations() {
    this.props.onShowNearbyLocations();
  }
}

export default withTranslation()(SearchForm);
