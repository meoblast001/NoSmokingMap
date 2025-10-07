import { ResourceLanguage } from "i18next";

const locale: ResourceLanguage = {
  translation: {
    navigation: {
      map: "Karte",
      edit: "Bearbeiten",
      review: "Überprüfen",
      login: "Einloggen",
      about: "Über"
    },
    smoking_status: {
      no: "Rauchen nirgendwo erlaubt",
      yes: "Überall erlaubt",
      dedicated: "Speziell für Raucher vorgesehen (z.B. Raucherclub)",
      separated: "In nicht abgegrenzten Raucherbereichen",
      isolated: "In abgegrenzten Raucherbereichen",
      outside: "Draußen erlaubt"
    },
    pages: {
      map: {
        smoking_label: "Rauchen: {{status}}"
      },
      about: {
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
      }
    }
  }
};

export default locale;
