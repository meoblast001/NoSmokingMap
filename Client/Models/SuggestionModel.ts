import LocationModel, { isLocationModel } from "./LocationModel";
import { isSmokingStatus, SmokingStatus } from "./SmokingStatus";

export default interface SuggestionModel {
  id: number;
  newSmoking: SmokingStatus;
  comment: string;
  location: LocationModel;
}

export function isSuggestionModel(x: any): x is SuggestionModel {
  return typeof(x.id) == 'number'
    && isSmokingStatus(x.newSmoking)
    && typeof(x.comment) == 'string'
    && isLocationModel(x.location);
}
