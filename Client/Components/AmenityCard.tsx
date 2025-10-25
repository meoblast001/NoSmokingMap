import * as React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import LocationModel from '../Models/LocationModel';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { smokingStatusTranslationKey } from '../Models/SmokingStatus';

interface Props {
  location: LocationModel
  onClick: () => void
}

export class AmenityCard extends React.Component<Props & WithTranslation> {
  constructor(props: Props & WithTranslation) {
    super(props);
  }

  render(): React.ReactNode {
    const t = this.props.t;
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
                    <Trans i18nKey="components.amenity_card.smoking_label"
                           values={{ status: t(smokingStatusTranslationKey(this.props.location.smoking)) }}
                           components={{ bold: <b /> }}/>
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

export default withTranslation()(AmenityCard);
