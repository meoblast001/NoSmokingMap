import { Alert, Box, Button, ButtonGroup, Card, CardContent, Container, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import * as React from 'react';
import { Params, useParams } from 'react-router';
import { apiService } from '../ApiService';
import { ElementType } from '../Models/ElementType';
import LocationModel from '../Models/LocationModel';

interface Props {
  params: Params<string>
}

interface State {
  location : LocationModel | null;
  error: boolean;
}

export class EditNodePageInternal extends React.Component<Props, State> {
  private elementType: ElementType;
  private elementId: string;

  constructor(props: Props) {
    super(props);
    this.elementType = this.props.params.elementType as ElementType;
    this.elementId = this.props.params.elementId;

    this.state = { location: null, error: false };
  }

  componentDidMount(): void {
    apiService.fetchLocationDetails(this.elementType, this.elementId)
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

          <Card variant="outlined" sx={{ m: 1 }}>
              <FormControl sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, alignItems: 'stretch' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, alignItems: 'stretch' }}>
                  <FormLabel id="submission-type-label">Submission Type</FormLabel>
                  <ToggleButtonGroup sx={{ flex: 1 }} aria-labelledby="submission-type-label">
                    <ToggleButton sx={{ flex: 1 }} value="osmauth">Login<br />(via OpenStreetMap)</ToggleButton>
                    <ToggleButton sx={{ flex: 1 }} value="anonymous">Anonymous Suggestion<br />(no account)</ToggleButton>
                  </ToggleButtonGroup>
                </CardContent>

                <Divider sx={{ my: 1 }} />

                <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, alignItems: 'stretch' }}>
                  <FormLabel id="smoking-type-label">Smoking</FormLabel>
                  <Select aria-labelledby="smoking-type-label">
                    <MenuItem value="no">No smoking anywhere</MenuItem>
                    <MenuItem value="yes">Allowed everywhere</MenuItem>
                    <MenuItem value="dedicated">Dedicated to smokers (e.g. smokers' club)</MenuItem>
                    <MenuItem value="separated">In non-isolated smoking areas</MenuItem>
                    <MenuItem value="isolated">In isolated smoking areas</MenuItem>
                    <MenuItem value="outside">Allowed outside</MenuItem>
                  </Select>

                  <FormLabel id="comment-label">Comment</FormLabel>
                  <Typography variant="caption" sx={{ textAlign: 'center' }}>
                    How did you determine the smoking rules of this location? This will be recorded in OpenStreetMaps.
                  </Typography>
                  <TextField multiline rows={4} aria-labelledby="comment-label" label="Type comment here" />
                </CardContent>

                <Divider sx={{ my: 1 }} />

                <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, alignItems: 'stretch' }}>
                  <ButtonGroup variant="outlined" size="large" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Button sx={{ flex: 1 }}>Go back</Button>
                    <Button sx={{ flex: 1 }} variant="contained">Submit</Button>
                  </ButtonGroup>
                </CardContent>
              </FormControl>
          </Card>
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
}

export default function EditNodePage() {
  const params = useParams();
  return <EditNodePageInternal params={params} />
}
