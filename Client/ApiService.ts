import { isArrayOf } from './Models/Array';
import { ElementType } from './Models/ElementType';
import LocationModel, { isLocationModel } from './Models/LocationModel';
import { SmokingStatus } from './Models/SmokingStatus';
import SuggestionsPaginationModel, { isSuggestionsPaginationModel } from './Models/SuggestionsPaginationModel';

export enum ApiErrorCode {
  Unknown,
  NetworkError,
  ParseFailure,
  NotFound,
  Unauthorized,
  BadRequest,
  OsmError
}

export class ApiError {
  private code: ApiErrorCode;

  public constructor(apiErrorCode: ApiErrorCode) {
    this.code = apiErrorCode;
  }

  public static async createFromResponse(response: Response): Promise<ApiError> {
    const statusCode = response.status;
    const bodyText = await response.text();

    let code: ApiErrorCode;
    switch (statusCode) {
      case 404:
        code = ApiErrorCode.NotFound;
        break;
      case 401:
        code = ApiErrorCode.Unauthorized;
        break;
      case 400:
        code = ApiErrorCode.BadRequest;
        break;
      case 500:
        code = ApiErrorCode.Unknown;
        break;
    }
    return new ApiError(code);
  }
}

async function httpGet<TOut>(uri: string, params: { [key: string]: string } | null,
    guard: (x: any) => x is TOut): Promise<TOut> {
  if (params) {
    const searchParams = new URLSearchParams();
    for (let key in params)
      searchParams.append(key, params[key]);
    uri += `?${searchParams}`;
  }

  var response: Response;
  try {
    response = await fetch(uri);
  } catch (error) {
    console.log(`Generic network error: ${error.message}`);
    throw new ApiError(ApiErrorCode.NetworkError);
  }

  if (!response.ok) {
    throw await ApiError.createFromResponse(response);
  }

  var result: any;
  try {
   result = await response.json();
  } catch (error) {
    console.log(`Generic network error: ${error.message}`);
    throw new ApiError(ApiErrorCode.NetworkError);
  }

  if (!guard(result)) {
    console.log("Failed to parse response");
    throw new ApiError(ApiErrorCode.ParseFailure);
  }

  return result;
}

export default class ApiService {
  fetchLocations(): Promise<LocationModel[]> {
    return httpGet('/api/overpass/locations', null, (result) => isArrayOf(result, isLocationModel));
  }

  async searchLocationsByTerms(searchTerms: string): Promise<LocationModel[]> {
    return httpGet('/api/overpass/locations_by_terms', { searchTerms }, (result) => isArrayOf(result, isLocationModel));
  }

  async searchLocationsByGeoposition(lat: number, lon: number): Promise<LocationModel[]> {
    const params = { lat: lat.toString(), lon: lon.toString() };
    return httpGet('/api/overpass/locations_by_geoposition', params, (result) => isArrayOf(result, isLocationModel));
  }

  async fetchLocationDetails(elementId: string, elementType: ElementType): Promise<LocationModel> {
    const params = { elementId, elementType };
    return httpGet('/api/osm/element', params, isLocationModel);
  }

  async updateSmoking(elementId: string, elementType: ElementType, smokingStatus: SmokingStatus,
    comment: string): Promise<boolean>
  {
    try {
      const formData = { elementId, elementType, smokingStatus, comment };
      const response = await fetch(`/api/osm/update_smoking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return false;
    }
  }

  async listAllSuggestions(offset: number, limit: number): Promise<SuggestionsPaginationModel> {
    const params = { offset: offset.toString(), limit: limit.toString() };
    return httpGet('/api/suggestion/list_all', params, isSuggestionsPaginationModel);
  }

  async submitSuggestion(elementId: string, elementType: ElementType, smokingStatus: SmokingStatus,
    comment: string): Promise<boolean>
  {
    try {
      const formData = { elementId, elementType, smokingStatus, comment };
      const response = await fetch(`/api/suggestion/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return false;
    }
  }

  async reviewSuggestion(suggestionId: number, approve: boolean, comment: string): Promise<boolean> {
    try {
      const formData = { suggestionId, approve, comment };
      const response = await fetch(`/api/suggestion/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return false;
    }
  }
}

let osmRegistrationUri: string | undefined;

export function getOsmRegistrationUri(): string {
  if (osmRegistrationUri)
    return osmRegistrationUri;
  osmRegistrationUri = document.getElementById('osm-registration-uri').innerHTML;
  return osmRegistrationUri;
}

export const apiService = new ApiService();
