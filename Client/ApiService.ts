import LocationModel from './Models/LocationModel';

export default class ApiService {
  async fetchLocations() : Promise<LocationModel[] | null> {
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

  async searchLocationsByTerms(searchTerms: string) : Promise<LocationModel[] | null> {
    try {
      const params = new URLSearchParams();
      params.append('searchTerms', searchTerms);
      const response = await fetch(`/api/overpass/searchlocationsterms?${params}`);
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

  async searchLocationsByGeoposition(lat: number, lon: number) : Promise<LocationModel[] | null> {
    try {
      const params = new URLSearchParams();
      params.append('lat', lat.toString());
      params.append('lon', lon.toString());
      const response = await fetch(`/api/overpass/searchlocationsgeoposition?${params}`);
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
}

const apiService = new ApiService();
export { apiService };