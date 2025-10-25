import { Alert, Card, CardContent, Container, LinearProgress, Typography } from '@mui/material';
import * as React from 'react';
import { Trans, useTranslation, WithTranslation, withTranslation } from 'react-i18next';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router';
import { apiService } from '../ApiService';
import { ElementType } from '../Models/ElementType';
import LocationModel from '../Models/LocationModel';
import EditNodeForm from '../Components/EditNodeForm';
import { FormData as EditNodeFormData } from '../Components/EditNodeForm';
import { SnackbarContext } from '../SnackbarContext';

interface Props {
  params: Params<string>
  navigate: NavigateFunction;
}

interface State {
  location : LocationModel | null;
  error: boolean;
}

class EditNodePageInternal extends React.Component<Props & WithTranslation, State> {
  static contextType = SnackbarContext;
  declare context: React.ContextType<typeof SnackbarContext>;

  private elementType: ElementType;
  private elementId: string;

  constructor(props: Props & WithTranslation) {
    super(props);
    this.elementType = this.props.params.elementType as ElementType;
    this.elementId = this.props.params.elementId;

    this.state = { location: null, error: false };
  }

  componentDidMount(): void {
    apiService.fetchLocationDetails(this.elementId, this.elementType)
      .then(location => this.setState({ location, error: location == null }))
      .catch(() => this.setState({ location: null, error: true }));
  }

  render(): React.ReactNode {
    if (this.state.location)
    {
      return (
        <Container sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Card variant="outlined" sx={{ m: 1 }}>
            <CardContent>
              <Typography>
                <Trans i18nKey="pages.edit_node.name_label" values={{ name: this.state.location.name }}
                       components={{ bold: <b /> }} />
              </Typography>
            </CardContent>
          </Card>

          <EditNodeForm onSubmit={formData => this.onSubmit(formData)} onBack={() => this.onBack()} />
        </Container>
      );
    } else if (this.state.error) {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>
            <Trans i18nKey="pages.edit_node.error" />
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

  private onSubmit(formData: EditNodeFormData): void {
    switch (formData.submissionMode)
    {
      case 'login':
        apiService.updateSmoking(this.elementId, this.elementType, formData.smokingType, formData.comment)
          .then(() => this.onSubmissionSuccess())
          .catch(() => this.onSubmissionError());
        break;
      case 'anonymous':
        apiService.submitSuggestion(this.elementId, this.elementType, formData.smokingType, formData.comment)
          .then(() => this.onSubmissionSuccess())
          .catch(() => this.onSubmissionError());
        break;
      default:
        this.onSubmissionError();
    }
  }

  private onSubmissionSuccess(): void {
    const t = this.props.t;
    this.context.display({ message: t('pages.edit_node.submit_success') });
    this.props.navigate("/edit");
  }

  private onSubmissionError(): void {
    const t = this.props.t;
    this.context.display({ message: t('pages.edit_node.submit_error') });
  }

  private onBack(): void {
    this.props.navigate(-1);
  }
}

const EditNodePageInternalWithTranslation = withTranslation()(EditNodePageInternal);

export default function EditNodePage() {
  const params = useParams();
  const navigate = useNavigate();
  const {} = useTranslation();
  return <EditNodePageInternalWithTranslation params={params} navigate={navigate} />;
}
