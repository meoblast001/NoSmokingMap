import * as React from "react";
import SuggestionModel from "../Models/SuggestionModel";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

interface Props {
  suggestion: SuggestionModel;
  onApprove: () => void;
  onReject: () => void;
}

export default class SuggestionCard extends React.Component<Props> {
  render(): React.ReactNode {
    const currentSmoking = this.props.suggestion.location.smoking;
    const newSmoking = this.props.suggestion.newSmoking;
    return (
      <Card variant="outlined" sx={{ m: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ flex: 1 }}>
              <Typography>
                <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {this.props.suggestion.location.name}
                </span>
                <div style={{ paddingLeft: 5 }}>
                  <b>Current Smoking:</b> {currentSmoking != null ? currentSmoking : "Unknown"}<br />
                  <b>New Smoking:</b> {newSmoking != null ? newSmoking : "Unknown"}<br />
                  <b>Comment:</b> {this.props.suggestion.comment}
                </div>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 0, flexDirection: 'column',
                justifyContent: 'center', gap: 1 }}>
              <Button variant="outlined" onClick={() => this.props.onApprove()}>
                <ThumbUpIcon sx={{ textAlign: 'center', verticalAlign: 'middle' }}/>
              </Button>
              <Button variant="outlined" onClick={() => this.props.onReject()}>
                <ThumbDownIcon sx={{ textAlign: 'center', verticalAlign: 'middle' }}/>
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }
}
