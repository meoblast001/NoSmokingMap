import { Box, Button, TextField } from '@mui/material';
import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

interface Params {
  blockingInput: boolean;
  onSearch: (searchTerm: string) => void
  onShowNearbyLocations: () => void
}

export default class SearchForm extends React.Component<Params> {
  private searchTerm: string = '';

  constructor(params: Params) {
    super(params);
  }

  render(): React.ReactNode {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <TextField label="Search Term"
              variant="outlined"
              onChange={(event) => this.onSearchTermChanged(event)}
              disabled={this.props.blockingInput}
              sx={{ flex: 1 }} />
          <Button variant="contained"
              endIcon={<SearchIcon />}
              onClick={() => this.onSearch()}
              disabled={this.props.blockingInput}>
            Search
          </Button>
        </Box>
        <Button variant="outlined"
            endIcon={<LocationSearchingIcon />}
            onClick={() => this.onShowNearbyLocations()}
            disabled={this.props.blockingInput}>
          Show Nearby Locations
        </Button>
      </Box>
    );
  }

  private onSearchTermChanged(changeEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.searchTerm = changeEvent.target.value;
  }

  private onSearch() {
    this.props.onSearch(this.searchTerm);
  }

  private onShowNearbyLocations() {
    this.props.onShowNearbyLocations();
  }
}