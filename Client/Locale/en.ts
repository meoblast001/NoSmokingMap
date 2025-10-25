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
      null: "Unknown",
      no: "No smoking anywhere",
      yes: "Allowed everywhere",
      dedicated: "Dedicated to smokers (e.g. smokers' club)",
      separated: "In non-isolated smoking areas",
      isolated: "In isolated smoking areas",
      outside: "Allowed outside"
    },
    pages: {
      map: {
        attribution: "&copy; {{link}} contributors",
        error: "Failed to get locations.",
        smoking_label: "Smoking: {{status}}"
      },
      searchEdit: {
        errorSearch: "Failed to search.",
        errorGeolocation: "Failed to get locations."
      },
      editNode: {
        error: "Failed to get location details."
      },
      review: {
        noResults: "There are currently no suggestions to review.",
        errorList: "Failed to get list of change suggestoins.",
        errorSubmit: "Failed to submit review.",
        errorDisplay: "Failed to display suggestions to review."
      },
      about: {
        info:
          "<sourceLink>Source code on GitHub</sourceLink>.<br />"
          + "Licensed under <licenseLink>MIT license</licenseLink>.<br />"
          + "Developed using data from <osmLink>OpenStreetMap</osmLink>."
      }
    },
    components: {
      search_form: {
        search_terms: "Search Terms",
        search_button: "Search",
        show_nearby_locations: "Show Nearby Locations"
      },
      amenity_card: {
        smoking_label: "<bold>Smoking:</bold> {{status}}"
      },
      suggestion_card: {
        current_smoking_label: "<bold>Current Smoking:</bold> {{status}}",
        new_smoking_label: "<bold>New Smoking:</bold> {{status}}",
        comment_label: "<bold>Comment:</bold> {{comment}}"
      }
    }
  }
};

export default locale;
