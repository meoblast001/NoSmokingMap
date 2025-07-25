import LocationModel from "./LocationModel";
import { SmokingStatus } from "./SmokingStatus";

export default interface SuggestionModel {
  id: number;
  newSmoking: SmokingStatus;
  comment: string;
  location: LocationModel;
}
