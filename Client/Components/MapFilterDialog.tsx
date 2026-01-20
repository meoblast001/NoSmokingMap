import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup } from '@mui/material';
import * as React from 'react';
import { SmokingStatus, smokingStatusTranslationKey } from '../Models/SmokingStatus';
import { MapFilterPreferencesData, mapFilterPreferencesModel } from '../Models/MapFilterPreferencesModel';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onSubmit: () => void;
}

interface State {
  preferencesData: MapFilterPreferencesData;
}

export class MapFilterDialog extends React.Component<Props & WithTranslation, State> {
  constructor(props: Props & WithTranslation) {
    super(props);
    this.state = { preferencesData: mapFilterPreferencesModel.retrievePreferences() }
  }

  render(): React.ReactNode {
    const t = this.props.t;
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>
          <Trans i18nKey="components.map_filter_dialog.title" />
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={true} disabled={true} />}
              label={t(smokingStatusTranslationKey('no'))} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.preferencesData.smokingStatuses.has('outside')}
                  onChange={(evt) => this.toggleSmokingStatus('outside', evt.target.checked)} />
              }
              label={t(smokingStatusTranslationKey('outside'))} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.preferencesData.smokingStatuses.has('isolated')}
                  onChange={(evt) => this.toggleSmokingStatus('isolated', evt.target.checked)} />
              }
              label={t(smokingStatusTranslationKey('isolated'))} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.preferencesData.smokingStatuses.has('separated')}
                  onChange={(evt) => this.toggleSmokingStatus('separated', evt.target.checked)} />
              }
              label={t(smokingStatusTranslationKey('separated'))} />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onApply()}>
            <Trans i18nKey="components.map_filter_dialog.apply_button" />
          </Button>
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

export default withTranslation()(MapFilterDialog);
