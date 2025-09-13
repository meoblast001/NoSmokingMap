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

  public static createFromResponse(response: Response): ApiError {
    const statusCode = response.status;

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

async function httpGetWithJsonResponse<TOut>(uri: string, params: { [key: string]: string } | null,
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
    throw ApiError.createFromResponse(response);
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

async function httpPost(uri: string, formData: { [key: string]: any }): Promise<Response> {
  var response: Response;
  try {
    response = await fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  } catch (error) {
    console.log(`Generic network error: ${error.message}`);
    throw new ApiError(ApiErrorCode.NetworkError);
  }

  if (!response.ok) {
    throw ApiError.createFromResponse(response);
  }

  return response;
}

export default class ApiService {
  fetchLocations(): Promise<LocationModel[]> {
    return httpGetWithJsonResponse('/api/overpass/locations', null, (result) => isArrayOf(result, isLocationModel));
  }

  async searchLocationsByTerms(searchTerms: string): Promise<LocationModel[]> {
    return httpGetWithJsonResponse('/api/overpass/locations_by_terms', { searchTerms }, (result) => isArrayOf(result, isLocationModel));
  }

  async searchLocationsByGeoposition(lat: number, lon: number): Promise<LocationModel[]> {
    const params = { lat: lat.toString(), lon: lon.toString() };
    return httpGetWithJsonResponse('/api/overpass/locations_by_geoposition', params, (result) => isArrayOf(result, isLocationModel));
  }

  async fetchLocationDetails(elementId: string, elementType: ElementType): Promise<LocationModel> {
    const params = { elementId, elementType };
    return httpGetWithJsonResponse('/api/osm/element', params, isLocationModel);
  }

  async updateSmoking(elementId: string, elementType: ElementType, smokingStatus: SmokingStatus,
    comment: string): Promise<undefined>
  {
    const formData = { elementId, elementType, smokingStatus, comment };
    await httpPost('/api/osm/update_smoking', formData);
  }

  async listAllSuggestions(offset: number, limit: number): Promise<SuggestionsPaginationModel> {
    const params = { offset: offset.toString(), limit: limit.toString() };
    return httpGetWithJsonResponse('/api/suggestion/list_all', params, isSuggestionsPaginationModel);
  }

  async submitSuggestion(elementId: string, elementType: ElementType, smokingStatus: SmokingStatus,
    comment: string): Promise<undefined>
  {
    const formData = { elementId, elementType, smokingStatus, comment };
    await httpPost('/api/suggestion/submit', formData);
  }

  async reviewSuggestion(suggestionId: number, approve: boolean, comment: string): Promise<undefined> {
    const formData = { suggestionId, approve, comment };
    await httpPost('/api/suggestion/review', formData);
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
