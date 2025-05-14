import * as React from 'react';
import LocationModel from '../Models/LocationModel';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface Params {
  location: LocationModel
}

export default class AmenityCard extends React.Component<Params> {
  constructor(params: Params) {
    super(params);
  }

  render(): React.ReactNode {
    return (
      <Card variant="outlined" sx={{ m: 1 }}>
        <CardActionArea onClick={() => this.onClicked()}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ flex: 1 }}>
                <Typography>
                  <b>{this.props.location.name}</b><br />
                  Smoking: {this.props.location.smoking}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon sx={{ textAlign: 'center', verticalAlign: 'middle' }}/>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  private onClicked() {

  }
}