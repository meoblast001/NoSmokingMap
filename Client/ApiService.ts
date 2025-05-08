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
    }
  }
}

const apiService = new ApiService();
export { apiService };