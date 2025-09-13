import { isArrayOf } from "./Array";
import SuggestionModel, { isSuggestionModel } from "./SuggestionModel";

export default interface SuggestionsPaginationModel {
  suggestions: SuggestionModel[];
  totalEntries: number;
}

export function isSuggestionsPaginationModel(x: any): x is SuggestionsPaginationModel {
  return isArrayOf(x.suggestions, isSuggestionModel)
    && typeof(x.totalEntries) == 'number';
}
