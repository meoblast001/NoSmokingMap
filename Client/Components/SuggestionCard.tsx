import * as React from "react";
import SuggestionModel from "../Models/SuggestionModel";
import { Card, CardActionArea, CardContent } from "@mui/material";

interface Props {
  suggestion: SuggestionModel;
}

export default class SuggestionCard extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <Card variant="outlined" sx={{ m: 1 }}>
        <CardActionArea>
          <CardContent>
            {JSON.stringify(this.props.suggestion)}
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }
}
