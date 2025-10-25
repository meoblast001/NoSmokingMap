import * as React from "react";
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import SuggestionModel from "../Models/SuggestionModel";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { smokingStatusTranslationKey } from "../Models/SmokingStatus";

interface Props {
  suggestion: SuggestionModel;
  onApprove: () => void;
  onReject: () => void;
}

export class SuggestionCard extends React.Component<Props & WithTranslation> {
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
                  <Trans i18nKey="components.suggestion_card.current_smoking_label"
                         values={{ status: smokingStatusTranslationKey(currentSmoking) }}
                         components={{ bold: <b /> }} />
                  <br />
                  <Trans i18nKey="components.suggestion_card.new_smoking_label"
                         values={{ status: smokingStatusTranslationKey(newSmoking) }}
                         components={{ bold: <b /> }} />
                  <br />
                  <Trans i18nKey="components.suggestion_card.comment_label"
                         values={{ comment: this.props.suggestion.comment }}
                         components={{ bold: <b /> }} />
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

export default withTranslation()(SuggestionCard);
