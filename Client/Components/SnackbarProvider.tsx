import * as React from 'react';
import { SnackbarContext, SnackbarInstance } from '../SnackbarContext';
import { Snackbar } from '@mui/material';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

interface State {
  instance: SnackbarInstance | null;
}

export default class SnackbarProvider extends React.Component<Props, State> {
  constructor(params: Props) {
    super(params);
    this.state = { instance: null }
  }

  render(): React.ReactNode {
    const isOpen = this.state.instance != null;
    const message = this.state.instance != null ? this.state.instance.message : "";
    return (
      <React.Fragment>
        <SnackbarContext.Provider value={{ display: (data) => this.displaySnackbarInstance(data) }}>
          {this.props.children}
        </SnackbarContext.Provider>
        <Snackbar open={isOpen} message={message} sx={{ marginBottom: 7 }}
                  onClose={() => this.hideSnackbar()} autoHideDuration={4000} />
      </React.Fragment>
    );
  }

  private displaySnackbarInstance(instance: SnackbarInstance) {
    this.setState({ instance });
  }

  private hideSnackbar() {
    this.setState({ instance: null });
  }
}
