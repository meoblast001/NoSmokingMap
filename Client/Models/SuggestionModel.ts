import { ElementType } from "react";
import { SmokingStatus } from "./SmokingStatus";

export default interface SuggestionModel {
  elementId: number;
  elementType: ElementType;
  smokingStatus: SmokingStatus;
  comment: string;
}
