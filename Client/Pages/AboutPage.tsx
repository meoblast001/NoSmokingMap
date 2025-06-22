import { Container, Typography } from '@mui/material';
import * as React from 'react';

export class AboutPage extends React.Component {
  render(): React.ReactNode {
    return (
      <Container sx={{ p: 2, textAlign: 'center' }}>
        <Typography>
          Copyright &copy; 2025 Braden Walters<br />
          Licensed <a href="https://en.wikipedia.org/wiki/MIT_License">MIT</a>
        </Typography>
      </Container>
    )
  }
}
