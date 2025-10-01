import { ResourceLanguage } from "i18next";

const locale: ResourceLanguage = {
  translation: {
    navigation: {
      map: "Map",
      edit: "Modify",
      review: "Review",
      login: "Login",
      about: "About"
    },
    smoking_status: {
      no: "No smoking anywhere",
      yes: "Allowed everywhere",
      dedicated: "Dedicated to smokers (e.g. smokers' club)",
      separated: "In non-isolated smoking areas",
      isolated: "In isolated smoking areas",
      outside: "Allowed outside"
    },
    pages: {
      map: {
        smoking_label: "Smoking: {{status}}"
      }
    },
    components: {
      search_form: {
        search_terms: "Search Terms",
        search_button: "Search",
        show_nearby_locations: "Show Nearby Locations"
      }
    }
  }
};

export default locale;
