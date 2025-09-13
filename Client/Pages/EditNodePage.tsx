import { Alert, Card, CardContent, Container, LinearProgress, Typography } from '@mui/material';
import * as React from 'react';
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

class EditNodePageInternal extends React.Component<Props, State> {
  static contextType = SnackbarContext;
  declare context: React.ContextType<typeof SnackbarContext>;

  private elementType: ElementType;
  private elementId: string;

  constructor(props: Props) {
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
                <b>Name:</b> {this.state.location.name}
              </Typography>
            </CardContent>
          </Card>

          <EditNodeForm onSubmit={formData => this.onSubmit(formData)} onBack={() => this.onBack()} />
        </Container>
      );
    } else if (this.state.error) {
      return (
        <Container sx={{ p: 2 }}>
          <Alert severity='error'>Failed to get location details.</Alert>
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
    this.context.display({ message: "Successfully submitted changes!" });
    this.props.navigate("/edit");
  }

  private onSubmissionError(): void {
    this.context.display({ message: "An error occurred while submitting. Please try again."});
  }

  private onBack(): void {
    this.props.navigate(-1);
  }
}

export default function EditNodePage() {
  const params = useParams();
  const navigate = useNavigate();
  return <EditNodePageInternal params={params} navigate={navigate} />
}
