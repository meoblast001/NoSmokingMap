import SuggestionModel from "./SuggestionModel";

export default interface SuggestionsPaginationModel {
  suggestions: SuggestionModel[];
  totalEntries: number;
}
