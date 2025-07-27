import { ElementType } from './Models/ElementType';
import LocationModel from './Models/LocationModel';
import { SmokingStatus } from './Models/SmokingStatus';
import SuggestionsPaginationModel from './Models/SuggestionsPaginationModel';

export default class ApiService {
  async fetchLocations(): Promise<LocationModel[] | null> {
    try {
      const response = await fetch('/api/overpass/locations');
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return null;
      }

      const json: LocationModel[] | null = await response.json();
      return json;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return null;
    }
  }

  async searchLocationsByTerms(searchTerms: string): Promise<LocationModel[] | null> {
    try {
      const params = new URLSearchParams();
      params.append('searchTerms', searchTerms);
      const response = await fetch(`/api/overpass/locations_by_terms?${params}`);
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return null;
      }

      const json: LocationModel[] | null = await response.json();
      return json;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return null;
    }
  }

  async searchLocationsByGeoposition(lat: number, lon: number): Promise<LocationModel[] | null> {
    try {
      const params = new URLSearchParams();
      params.append('lat', lat.toString());
      params.append('lon', lon.toString());
      const response = await fetch(`/api/overpass/locations_by_geoposition?${params}`);
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return null;
      }

      const json: LocationModel[] | null = await response.json();
      return json;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return null;
    }
  }

  async fetchLocationDetails(elementId: string, elementType: ElementType): Promise<LocationModel | null> {
    try {
      const params = new URLSearchParams();
      params.append('elementId', elementId);
      params.append('elementType', elementType);
      const response = await fetch(`/api/osm/element?${params}`);
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return null;
      }

      const json: LocationModel | null = await response.json();
      return json;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return null;
    }
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
    try {
      const params = new URLSearchParams();
      params.append('offset', offset.toString());
      params.append('limit', limit.toString());
      const response = await fetch(`/api/suggestion/list_all?${params}`);
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return null;
      }

      const json: SuggestionsPaginationModel | null = await response.json();
      return json;
    } catch (error) {
      console.error(`Error during fetch: ${error.message}`);
      return null;
    }
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

function getOsmRegistrationUri(): string {
  if (osmRegistrationUri)
    return osmRegistrationUri;
  osmRegistrationUri = document.getElementById('osm-registration-uri').innerHTML;
  return osmRegistrationUri;
}

const apiService = new ApiService();
export { apiService, getOsmRegistrationUri };
