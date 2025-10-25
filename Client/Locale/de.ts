import { ResourceLanguage } from "i18next";

const locale: ResourceLanguage = {
  translation: {
    yes: "Ja",
    no: "Nein",
    navigation: {
      map: "Karte",
      edit: "Bearbeiten",
      review: "Überprüfen",
      login: "Einloggen",
      about: "Über"
    },
    smoking_status: {
      null: "Nicht bekannt",
      no: "Rauchen nirgendwo erlaubt",
      yes: "Überall erlaubt",
      dedicated: "Speziell für Raucher vorgesehen (z.B. Raucherclub)",
      separated: "In nicht abgegrenzten Raucherbereichen",
      isolated: "In abgegrenzten Raucherbereichen",
      outside: "Draußen erlaubt"
    },
    pages: {
      map: {
        attribution: "&copy; {{link}}-Beitragende",
        error: "Beim Abrufen der Lokale ist ein Fehler aufgetreten.",
        smoking_label: "Rauchstatus: {{status}}"
      },
      searchEdit: {
        errorSearch: "Beim Suchen ist ein Fehler aufgetreten.",
        errorGeolocation: "Beim Abrufen der Lokale ist ein Fehler aufgetreten."
      },
      editNode: {
        error: "Beim Abrufen der Details über das Lokal ist ein Fehler aufgetreten."
      },
      review: {
        no_results: "Es gibt aktuell keine zu bewertenden Vorschläge.",
        error_list: "Beim Abrufen der Änderungsvorschläge ist ein Fehler aufgetreten.",
        error_submit: "Bei der Übermittlung der Bewertung ist ein Fehler aufgetreten.",
        error_display: "Beim Anzeigen der zu bewertenden Vorschläge ist ein Fehler aufgetreten.",
        confirmation_dialog_title: "Bestätigung",
        confirm_approve: "Bist Du sicher, dass Du diese Änderungen übernehmen möchtest?",
        confirm_reject: "Bist Du sicher, dass Du diese Änderungen ablehnen möchtest?",
        comment_label: "Kommentar über die Änderungen",
        approved: "Erfolgreich übernommen!",
        rejected: "Erfolgreich abgelehnt!"
      },
      about: {
        app_version: "Applikationsversion: {{version}}",
        info:
          "<sourceLink>Quelltext auf GitHub</sourceLink>.<br />"
          + "Lizenziert unter <licenseLink>MIT-Lizenz</licenseLink>.<br />"
          + "Mit Daten von <osmLink>OpenStreetMap</osmLink> entwickelt."
      }
    },
    components: {
      search_form: {
        search_terms: "Suchbegriffe",
        search_button: "Suchen",
        show_nearby_locations: "Lokale in meiner Nähe anzeigen"
      },
      amenity_card: {
        smoking_label: "<bold>Rauchstatus:</bold> {{status}}"
      },
      suggestion_card: {
        current_smoking_label: "<bold>Bisheriger Rauchstatus:</bold> {{status}}",
        new_smoking_label: "<bold>Neuer Rauchstatus:</bold> {{status}}",
        comment_label: "<bold>Kommentar:</bold> {{comment}}"
      }
    }
  }
};

export default locale;
