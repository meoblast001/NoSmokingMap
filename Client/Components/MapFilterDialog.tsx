import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup } from '@mui/material';
import * as React from 'react';
import { SmokingStatus } from '../Models/SmokingStatus';

const PreferencesCookieName: string = 'map_filter_preferences';

export interface FormData {
  smokingStatuses: Set<SmokingStatus>
}

export function retrievePreferences(): FormData {
  let cookieValue = document.cookie.split('; ').find(cookie => cookie.startsWith(`${PreferencesCookieName}=`))
    ?.split('=')[1];
  if (!cookieValue) {
    return getDefaultPreferences();
  }

  let deserializedFormData = JSON.parse(atob(cookieValue));
  return {
    smokingStatuses: new Set<SmokingStatus>(deserializedFormData.smokingStatuses)
  };
}

function getDefaultPreferences(): FormData {
  return { smokingStatuses: new Set<SmokingStatus>(['no', 'outside', 'isolated', 'separated']) };
}

function storePreferences(preferences: FormData) {
  const serializableFormData = {
    smokingStatuses: Array.from(preferences.smokingStatuses)
  };
  const serialized = btoa(JSON.stringify(serializableFormData));
  document.cookie = `${PreferencesCookieName}=${serialized}`;
}

interface Props {
  open: boolean;
  onSubmit: (formData: FormData) => void;
}

interface State {
  formData: FormData;
}

export default class MapFilterDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { formData: retrievePreferences() }
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
                  checked={this.state.formData.smokingStatuses.has('outside')}
                  onChange={(evt) => this.toggleSmokingStatus('outside', evt.target.checked)} />
              }
              label="Outside" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.formData.smokingStatuses.has('isolated')}
                  onChange={(evt) => this.toggleSmokingStatus('isolated', evt.target.checked)} />
              }
              label="Isolated" />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.formData.smokingStatuses.has('separated')}
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
    let formData = this.state.formData;
    if (enabled)
      formData.smokingStatuses.add(smokingStatus);
    else
      formData.smokingStatuses.delete(smokingStatus);

    this.setState({ formData });
  }

  private onApply() {
    storePreferences(this.state.formData);
    this.props.onSubmit(this.state.formData);
  }
}
