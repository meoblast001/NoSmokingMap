import * as React from 'react';
import LocationModel from '../Models/LocationModel';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  location: LocationModel
  onClick: () => void
}

export default class AmenityCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <Card variant="outlined" sx={{ m: 1 }}>
        <CardActionArea onClick={() => this.onClick()}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ flex: 1 }}>
                <Typography>
                  <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    {this.props.location.name}
                  </span>
                  <div style={{ paddingLeft: 5 }}>
                    Smoking: {this.props.location.smoking != null ? this.props.location.smoking : "Unknown"}
                  </div>
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

  private onClick() {
    this.props.onClick();
  }
}
