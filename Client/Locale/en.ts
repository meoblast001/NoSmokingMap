import { ResourceLanguage } from "i18next";

const locale: ResourceLanguage = {
  translation: {
    yes: "Yes",
    no: "No",
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
        no_results: "There are currently no suggestions to review.",
        error_list: "Failed to get list of change suggestoins.",
        error_submit: "Failed to submit review.",
        error_display: "Failed to display suggestions to review.",
        confirmation_dialog_title: "Confirmation",
        confirm_approve: "Are you sure you would like to approve these changes?",
        confirm_reject: "Are you sure you would like to reject these changes?",
        comment_label: "Comment About Changes",
        approved: "Successfully approved!",
        rejected: "Successfully rejected!"
      },
      about: {
        app_version: "Application Version: {{version}}",
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
