import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup } from '@mui/material';
import * as React from 'react';
import { SmokingStatus } from '../Models/SmokingStatus';
import { MapFilterPreferencesData, mapFilterPreferencesModel } from '../Models/MapFilterPreferencesModel';

interface Props {
  open: boolean;
  onSubmit: () => void;
}

interface State {
  preferencesData: MapFilterPreferencesData;
}

export default class MapFilterDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { preferencesData: mapFilterPreferencesModel.retrievePreferences() }
  }

  render(): React.ReactNode {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Map Filter Settings</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={true} disabled={true} />}
              label="No smoking" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.preferencesData.smokingStatuses.has('outside')}
                  onChange={(evt) => this.toggleSmokingStatus('outside', evt.target.checked)} />
              }
              label="Outside" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.preferencesData.smokingStatuses.has('isolated')}
                  onChange={(evt) => this.toggleSmokingStatus('isolated', evt.target.checked)} />
              }
              label="Isolated" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.preferencesData.smokingStatuses.has('separated')}
                  onChange={(evt) => this.toggleSmokingStatus('separated', evt.target.checked)} />
              }
              label="Separated" />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onApply()}>Apply</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private toggleSmokingStatus(smokingStatus: SmokingStatus, enabled: boolean) {
    let formData = this.state.preferencesData;
    if (enabled)
      formData.smokingStatuses.add(smokingStatus);
    else
      formData.smokingStatuses.delete(smokingStatus);

    this.setState({ preferencesData: formData });
  }

  private onApply() {
    mapFilterPreferencesModel.storePreferences(this.state.preferencesData);
    this.props.onSubmit();
  }
}
