import { SmokingStatus } from "./SmokingStatus";

const PreferencesCookieName: string = 'map_filter_preferences';

export interface MapFilterPreferencesData {
  smokingStatuses: Set<SmokingStatus>;
}

export default class MapFilterPreferencesModel {
  private cachedValue: MapFilterPreferencesData | null = null;

  public retrievePreferences(): MapFilterPreferencesData {
    if (!this.cachedValue) {
      let cookieValue = document.cookie.split('; ').find(cookie => cookie.startsWith(`${PreferencesCookieName}=`))
        ?.split('=')[1];
      if (!cookieValue) {
        return this.getDefaultPreferences();
      }

      let deserializedFormData = JSON.parse(atob(cookieValue));
      this.cachedValue = {
        smokingStatuses: new Set<SmokingStatus>(deserializedFormData.smokingStatuses)
      };
    }

    return this.cachedValue;
  }

  private getDefaultPreferences(): MapFilterPreferencesData {
    return { smokingStatuses: new Set<SmokingStatus>(['no', 'outside', 'isolated']) };
  }

  public storePreferences(preferences: MapFilterPreferencesData) {
    const serializableFormData = {
      smokingStatuses: Array.from(preferences.smokingStatuses)
    };
    const serialized = btoa(JSON.stringify(serializableFormData));
    document.cookie = `${PreferencesCookieName}=${serialized}`;

    this.cachedValue = preferences;
  }
}

export const mapFilterPreferencesModel = new MapFilterPreferencesModel();
