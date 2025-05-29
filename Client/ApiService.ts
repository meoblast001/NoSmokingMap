import { ElementType } from './Models/ElementType';
import LocationModel from './Models/LocationModel';

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

  async fetchLocationDetails(elementType: ElementType,elementId: string): Promise<LocationModel | null> {
    try {
      const params = new URLSearchParams();
      params.append('elementType', elementType);
      params.append('elementId', elementId);
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
}

const apiService = new ApiService();
export { apiService };
