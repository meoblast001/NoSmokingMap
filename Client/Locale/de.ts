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
        smoking_label: "Rauchstatus: {{status}}",
        geolocation_error: "Dein Standort konnte nicht herangezoomt werden."
      },
      search_edit: {
        name_label: "<bold>Name:</bold> {{name}}",
        error_search: "Beim Suchen ist ein Fehler aufgetreten.",
        error_geolocation: "Beim Abrufen der Lokale ist ein Fehler aufgetreten."
      },
      edit_node: {
        error: "Beim Abrufen der Details über das Lokal ist ein Fehler aufgetreten.",
        submit_success: "Bewertung erfolgreich übermittelt!",
        submit_error: "Während der Übermittlung ist ein Fehler aufgetreten. Bitte nochmal versuchen."
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
      edit_node_form: {
        submission_type_label: "Übermittlungsmethode",
        login_mode_button: "Sofort bearbeiten<br>(über OpenStreetMap einloggen)",
        anonymous_mode_button: "Anonym vorschlagen<br>(ohne Account)",
        smoking_label: "Raucherstatus",
        comment_label: "Kommentar",
        comment_caption: "Wie hast Du den Raucherstatus dieses Lokals festgestellt? Halte den Text bitte kurz und "
          + "klar. Der könnte in OpenStreetMap aufgenommen werden.",
        comment_placeholder: "Kommentar hier schreiben",
        osm_login_button: "Über OpenStreetMap einloggen",
        osm_login_note: "Hast Du keinen OpenStreetMap-Account? Du kannst dich "
          + "<registerLink>hier registrieren</registerLink> oder die Übermittlungsmethode auf \"Anonym vorschlagen\" "
          + "umstellen.",
        submit_button: "Übermitteln",
        back_button: "Zurück"
      },
      suggestion_card: {
        current_smoking_label: "<bold>Bisheriger Rauchstatus:</bold> {{status}}",
        new_smoking_label: "<bold>Neuer Rauchstatus:</bold> {{status}}",
        comment_label: "<bold>Kommentar:</bold> {{comment}}"
      },
      map_filter_dialog: {
        title: "Filtereinstellungen der Karte",
        apply_button: "Anwenden"
      }
    }
  }
};

export default locale;
