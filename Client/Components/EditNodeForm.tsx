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
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { SmokingStatus, smokingStatusTranslationKey } from '../Models/SmokingStatus';
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

class EditNodeForm extends React.Component<Props & WithTranslation, State> {
  private readonly osmRegistrationUri;
  private smokingType: SmokingStatus | null;
  private comment: string = "";

  constructor(props: Props & WithTranslation) {
    super(props);
    this.state = { submissionMode: 'login', formErrors: {} };

    this.osmRegistrationUri = getOsmRegistrationUri();
  }

  render(): React.ReactNode {
    const isLoginRequired = this.state.submissionMode == 'login' && !osmAuthService.isLoggedIn();

    return (
      <Card variant="outlined" sx={{ m: 1 }} component="form" onSubmit={(e) => this.onSubmit(e)}>
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
    const onToggleChange = (_event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
      if (value != null)
        this.setState({ submissionMode: value });
    }

    return (
      <React.Fragment>
        <FormLabel id="submission-type-label">
          <Trans i18nKey="components.edit_node_form.submission_type_label" />
        </FormLabel>
        <ToggleButtonGroup sx={{ flex: 1 }}
            aria-labelledby="submission-type-label"
            color="primary"
            exclusive
            value={this.state.submissionMode}
            onChange={onToggleChange}>

          <ToggleButton sx={{ flex: 1 }} value="login">
            <Trans i18nKey="components.edit_node_form.login_mode_button" />
          </ToggleButton>

          <ToggleButton sx={{ flex: 1 }} value="anonymous">
            <Trans i18nKey="components.edit_node_form.anonymous_mode_button" />
          </ToggleButton>
        </ToggleButtonGroup>
      </React.Fragment>
    );
  }

  private renderModificationsSubForm(): React.ReactNode {
    const t = this.props.t;
    return (
      <React.Fragment>
        <FormLabel id="smoking-type-label">
          <Trans i18nKey="components.edit_node_form.smoking_label" />
        </FormLabel>
        <Select aria-labelledby="smoking-type-label"
            onChange={event => this.smokingType = event.target.value as any}
            error={this.state.formErrors.smokingType}>
          <MenuItem value="no">{t(smokingStatusTranslationKey('no'))}</MenuItem>
          <MenuItem value="yes">{t(smokingStatusTranslationKey('yes'))}</MenuItem>
          <MenuItem value="dedicated">{t(smokingStatusTranslationKey('dedicated'))}</MenuItem>
          <MenuItem value="separated">{t(smokingStatusTranslationKey('separated'))}</MenuItem>
          <MenuItem value="isolated">{t(smokingStatusTranslationKey('isolated'))}</MenuItem>
          <MenuItem value="outside">{t(smokingStatusTranslationKey('outside'))}</MenuItem>
        </Select>

        <FormLabel id="comment-label">
          <Trans i18nKey="components.edit_node_form.comment_label" />
        </FormLabel>
        <Typography variant="caption" sx={{ textAlign: 'center' }}>
          <Trans i18nKey="components.edit_node_form.comment_caption" />
        </Typography>
        <TextField multiline rows={4} aria-labelledby="comment-label"
          label={t('components.edit_node_form.comment_placeholder')}
          onChange={event => this.comment = event.target.value} />
      </React.Fragment>
    );
  }

  private renderLoginRequired(): React.ReactNode {
    return (
      <React.Fragment>
        <Button variant="outlined" startIcon={<LoginIcon />} href="/osm_auth/login">
          <Trans i18nKey="components.edit_node_form.osm_login_button" />
        </Button>
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          <Trans i18nKey="components.edit_node_form.osm_login_note"
                 components={{ registerLink: (<a href={this.osmRegistrationUri} target="_blank" />) }} />
        </Typography>
      </React.Fragment>
    )
  }

  private renderActionButtons(withSubmit: boolean): React.ReactNode {
    const submitButton = withSubmit
      ? (
        <Button sx={{ flex: 1 }} variant="contained" type="submit">
          <Trans i18nKey="components.edit_node_form.submit_button" />
        </Button>
      )
      : null;
    return (
      <ButtonGroup variant="outlined" size="large" sx={{ display: 'flex', flexDirection: 'row' }}>
        <Button sx={{ flex: 1 }} onClick={() => this.props.onBack()}>
          <Trans i18nKey="components.edit_node_form.back_button" />
        </Button>
        {submitButton}
      </ButtonGroup>
    )
  }

  private onSubmit(evt: React.FormEvent<HTMLFormElement>): void {
    evt.preventDefault();

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

export default withTranslation()(EditNodeForm);
