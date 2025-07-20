import LocationModel from "./LocationModel";
import { SmokingStatus } from "./SmokingStatus";

export default interface SuggestionModel {
  newSmoking: SmokingStatus;
  comment: string;
  location: LocationModel;
}
