import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup, 
  Typography
} from '@mui/material';
import * as React from 'react';
import { SmokingStatus } from '../Models/SmokingStatus';
import { osmAuthService } from '../OsmAuthService';
import LoginIcon from '@mui/icons-material/Login';
import { getOsmRegistrationUri } from '../ApiService';

export interface FormData {
  submissionMode: 'login' | 'anonymous';
  smokingType: SmokingStatus;
  comment: string;
}

interface Props {
  onSubmit: (formData: FormData) => void;
  onBack: () => void;
}

interface State {
  submissionMode: 'login' | 'anonymous';
  formErrors: { submissionMode?: boolean, smokingType?: boolean}
}

export default class EditNodeForm extends React.Component<Props, State> {
  private smokingType: SmokingStatus | null;
  private comment: string = "";

  constructor(props: Props) {
    super(props);
    this.state = { submissionMode: 'login', formErrors: {} };
  }

  render(): React.ReactNode {
    const isLoginRequired = this.state.submissionMode == 'login' && !osmAuthService.isLoggedIn();

    return (
      <Card variant="outlined" sx={{ m: 1 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, alignItems: 'stretch' }}>
          {this.renderSubmissionTypeSubForm()}
        </CardContent>

        <Divider sx={{ my: 1 }} />

        <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, alignItems: 'stretch' }}>
          {!isLoginRequired ? this.renderModificationsSubForm() : this.renderLoginRequired()}
        </CardContent>

        <Divider sx={{ my: 1 }} />

        <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, alignItems: 'stretch' }}>
          {this.renderActionButtons(!isLoginRequired)}
        </CardContent>
      </Card>
    );
  }

  private renderSubmissionTypeSubForm(): React.ReactNode {
    return (
      <React.Fragment>
        <FormLabel id="submission-type-label">Submission Type</FormLabel>
        <ToggleButtonGroup sx={{ flex: 1 }}
            aria-labelledby="submission-type-label"
            color="primary"
            exclusive
            value={this.state.submissionMode}
            onChange={(_event, value) => this.setState({ submissionMode: value })}>

          <ToggleButton sx={{ flex: 1 }} value="login">
            Immediately Edit<br />(via OpenStreetMap Login)
          </ToggleButton>

          <ToggleButton sx={{ flex: 1 }} value="anonymous">
            Anonymous Change Suggestion<br />(no account)
          </ToggleButton>
        </ToggleButtonGroup>
      </React.Fragment>
    );
  }

  private renderModificationsSubForm(): React.ReactNode {
    return (
      <React.Fragment>
        <FormLabel id="smoking-type-label">Smoking</FormLabel>
        <Select aria-labelledby="smoking-type-label"
            onChange={event => this.smokingType = event.target.value as any}
            error={this.state.formErrors.smokingType}>
          <MenuItem value="no">No smoking anywhere</MenuItem>
          <MenuItem value="yes">Allowed everywhere</MenuItem>
          <MenuItem value="dedicated">Dedicated to smokers (e.g. smokers' club)</MenuItem>
          <MenuItem value="separated">In non-isolated smoking areas</MenuItem>
          <MenuItem value="isolated">In isolated smoking areas</MenuItem>
          <MenuItem value="outside">Allowed outside</MenuItem>
        </Select>

        <FormLabel id="comment-label">Comment</FormLabel>
        <Typography variant="caption" sx={{ textAlign: 'center' }}>
          How did you determine the smoking rules of this location? Keep the text short and clear. This may be
          recorded in OpenStreetMap.
        </Typography>
        <TextField multiline rows={4} aria-labelledby="comment-label" label="Type comment here"
          onChange={event => this.comment = event.target.value} />
      </React.Fragment>
    );
  }

  private renderLoginRequired(): React.ReactNode {
    return (
      <React.Fragment>
        <Button variant="outlined" startIcon={<LoginIcon />} href="/osm_auth/login">Login with OpenStreetMap</Button>
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          No OpenStreetMap account? You can <a href={getOsmRegistrationUri()} target="_blank">register here</a> or
          switch the submission type to "Anonymous Suggestion".
        </Typography>
      </React.Fragment>
    )
  }

  private renderActionButtons(withSubmit: boolean): React.ReactNode {
    const submitButton = withSubmit
      ? (<Button sx={{ flex: 1 }} variant="contained" onClick={() => this.onSubmit()}>Submit</Button>)
      : null;
    return (
      <ButtonGroup variant="outlined" size="large" sx={{ display: 'flex', flexDirection: 'row' }}>
        <Button sx={{ flex: 1 }} onClick={() => this.props.onBack()}>Go back</Button>
        {submitButton}
      </ButtonGroup>
    )
  }

  private onSubmit(): void {
    let formErrors = this.state.formErrors;
    formErrors.smokingType = this.smokingType == null;

    this.setState({ formErrors });
    const hasErrors = Object.keys(formErrors)
      .reduce((acc, val) => acc || formErrors[val as keyof typeof formErrors], false);

    if (hasErrors)
      return;

    const formData: FormData = {
      submissionMode: this.state.submissionMode,
      smokingType: this.smokingType,
      comment: this.comment
    };

    this.props.onSubmit(formData);
  }
}
