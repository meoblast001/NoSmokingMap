import { Container, Typography } from '@mui/material';
import * as React from 'react';
import { Trans } from 'react-i18next';

export class AboutPage extends React.Component {
  render(): React.ReactNode {
    return (
      <Container sx={{ p: 2, textAlign: 'center' }}>
        <Typography>
            &copy; 2025 <a href="http://braden-walters.info" target="_blank">Braden Walters</a> <br /><br />

            <Trans i18nKey="pages.about.info"
              components = {{
                sourceLink: (<a href="https://github.com/meoblast001/NoSmokingMap" target="_blank" />),
                licenseLink:
                  (<a href="https://github.com/meoblast001/NoSmokingMap/blob/main/LICENSE.txt" target="_blank" />),
                osmLink: (<a href="https://www.openstreetmap.org" target="_blank" />)
              }} />
        </Typography>
      </Container>
    )
  }
}
