/**
 * Created by anisur on 04/09/14.
 */
PecunioApp

.config(function ($translateProvider) {
    
  $translateProvider.translations('de', {
    // Login & Create account sections  
    USER_NAME:   'Benutzername',
    WELCOME :   'Herzlich Willkommen',
    PLEASE_LOGIN: 'Bitte anmelden',
    LOGIN_ERROR: 'Ungültiger Benutzername oder Kennwort',
    LOGIN: 'login',
    REMEMBER_ME: 'an mich erinnern',
    FORGOT_PASSWORD: 'Passwort vergessen',
    OR_LOGIN_WITH: 'Oder melden Sie sich an mit',
    CREATE_ACCOUNT: 'Ein Konto erstellen',
    FORGOT_PASSWORD: 'Passwort vergessen',
    ENTER_EMAIL_RESET: 'Geben Sie Ihre E-Mailadresse ein, um Ihr Passwort zurückzusetzen',
    SIGN_UP: 'Anmeldung',
    ENTER_PERSONAL_DETAILS: 'Geben Sie Ihre persönlichen Daten ein',
    USER_SUCCESS: 'Benutzer erfolgreich erstellt',
    FULL_NAME: 'Vollständiger Name',
    EMAIL: 'E-Mail',
    MOBILE: 'Handy',
    ADDRESS: 'Anschrift',
    CITY_TOWN: 'Stadt/Ort',
    COUNTRY: 'Land',
    ACCOUNT_DETAILS: 'Geben Sie Ihre Kontodaten ein',
    PASSWORD: 'Passwort',
    RETYPE_PASSWORD: 'Passwort wiederholen',

    SELECT_ACCOUNT: 'Wählen Sie Ihren Kontotyp',
    SELECT_COMPANY: 'Wählen Sie Ihre Organisation',

    OPERATOR: 'Betreiber',
    CUSTOMER: 'Kunde',
    AFFILIATE: 'Affiliate',
    CALLCENTER: 'Call Center',
    ENTER_ORGANIZATION: 'Unternehmensnamen eingeben',
    SELECT_SALUTATION: 'Wählen Sie eine Anrede',
    TELEPHONE: 'Telefon',
    SELECT_ACCOUNT: 'Wählen Sie Ihren Kontotyp',
    SELECT_COMPANY: 'Wählen Sie Ihre Firma',

    DOMAIN: 'Domain',
    BACK: 'zurück',
    SUBMIT: 'Speichern',
    FORGOTPASS_ERROR: 'Ungültige E-Mail',
    FORGOTPASS_SUCCESS: 'Passwort wurde erfolgreich geändert',

    SUPPORT: 'Wie können wir Ihnen helfen?',
    FAQ: 'Häufig gestellte Fragen',
    TICKETS: 'Informationen zu den Datensätzen',
    ALL: 'Alle',
    OPEN: 'Öffnen',
    CLOSED: 'Geschlossen',
    TITLE: 'Überschrift',
    TOPIC: 'Thema',
    GEN_QUERY: 'Allgemeine Anfrage',
    BOOK_KEEPING: 'Buchhaltung',
    TECH_ISSUE: 'Technische Probleme',
    PART_SUPPORT : 'Partner Support',
    CUS_ENQURY : 'Kundenanfrage',
    UR_MSG: 'Ihre Nachricht',

    // Dashboard Profile section
    ACCOUNT_INFORMATION: 'Account-Daten',
    PERSONAL_INFO: 'Persönliche Informationen',
    FINANCES: 'Finanzen',
    COMPANY: 'Firma',
    SALUTATION: 'Anrede',
    MR: 'Herr',
    MRS: 'Frau',
    DATE_OF_BIRTH: 'Geburtsdatum',
    CANCEL: 'Abbrechen',
    
    // Dashboard Profile, Finances
    ACCOUNT_HOLDER: 'Kontoinhaber',
    SALES_TAX_AUTHORIZED: 'Umsatzsteuer berechtigt',
    PROOF: 'Nachweis',
    SALES_TAX: 'Mehrwertsteuer',
    ALT_STATEMENT_ADDR: 'Alternative Adresse',
    ROAD: 'Straße',
    ZIP_CODE: 'Plz',
    PLACE: 'Ort',
    
    // Dashboard Profile, Company
    COMPANY_NAME: 'Firmenname',
    SELECT_COUNTRY: 'Land auswählen',
    STREET_NO: 'Straße + Nr.',
    LEGAL_REPRESENTATIVE: 'Gesetzlicher Vertreter',
    COMM_REGISTER_NO: 'Handelsregister-Nummer',
    COMPANY_LOGO_UPLD: 'Firmenlogo hochladen',
    
    // Dashboard Change Password
    CHANGE_PASSWORD: 'Kennwort ändern',
    NEW_PASSWORD: 'Neues Passwort',
    
    // Dashboard Manage Account Users
    ACOOUNT_USERS_LIST_VIEW: 'Mitarbeiterliste anzeigen',
    ADD_NEW: 'Hinzufügen',
    TOOLS: 'Tools',
    EXPORT_TO_EXCEL: 'Exportieren nach Excel',
    ACCOUNT_TYPE: 'Kontotyp',
    GROUP: 'Gruppe',
    ROLE: 'Rolle',
    STATUS: 'Status',
    EDIT: 'Bearbeiten',
    DELETE: 'Löschen',
    SELECT_GROUP: 'Gruppe auswählen',
    SELECT_ROLE: 'Rolle auswählen',
    INACTIVE: 'Inaktiv',
    ACTIVE: 'Aktiv',
    DELETED: 'Gelöscht',
    SAVE: 'Speichern',
    CLOSE: 'Schließen',
    
    // Dashboard Manage Groups
    MANAGE_GROUPS: 'Gruppen verwalten',
    SEARCH_BY_NAME: 'Suche nach Name',
    NAME: 'Name',
    DESCRIPTION: 'Beschreibung',

    // Dashboard Manage Domains
    MANAGE_DOMAINS: 'Domains verwalten',
    
    // Dashboard Sidebar
    MY: 'Mein',
    PROFILE: 'Profil',
    MANAGE_ACCOUNT_USERS: 'Benutzerkonto verwalten',
    DASHBOARD: 'Dashboard',
    PERFORMANCE: 'Performance',
    ACCOUNTS: 'Abrechnungen',
    FACILITY: 'Einrichtung',
    PROMO_PRODUCTS: 'Werbemittel',
    AD_SPACE: 'Werbeflächen',
    LOGOUT: 'Abmelden',
    SUPPORT_TEAM: 'Support-Team',
    REQUEST_SUPPORT: 'Support anfragen',
    
    // Dashboard Werbemittel
    HOME: 'Home',
    OVERVIEW_PROMO_PRODUCTS: 'Werbemittel Übersicht',
    IMPRESSIONS: 'Impressionen',
    PREVIOUS_MONTH: 'Vergleich zum Vormonat',
    CLICKS: 'Klicks',
    USERS: 'Nutzer',
    BOUNCE_RATE: 'Bounce-Rate',
    STATISTICS: 'Statistik',
    LIST_PROMO_PRODUCTS: 'Werbemittelliste',
    SECTION: 'Sparte',
    TEMPLATES: 'Vorlagen',
    SIZE: 'Größe',
    STATUS: 'Status',
    ACTION: 'Aktion',
    
    // Ad Modal
    YOUR_PROMO_MATERIAL: 'Ihre Werbemittel',
    ALL_CATEGORIES: 'Alle Kategorien',
    ALL_TYPES: 'Alle Typen',
    CREATE_PROMO_PRODUCT: 'Werbemittel erstellen',
    CREATE_PROMO_INTRO: 'Erstellen Sie klick starke Werbemittel mit dem einfachen Editor',
    
    //Assistent Modal
    ASSISTANT : 'Assistent',
    ADJUST_MARKET_MATERIAL: 'Passen Sie verfügbare Werbemittel mit wenigen Klicks an und erstellen Sie passende Werbeflächen',
    PORTAL_URL: 'Ihre Portal-URL',
    READ_PORTAL: 'Portal einlesen',
    REGISTER_DOMAIN: 'Domain registrieren',
    ENTER_DOMAIN_NAME: 'Geben Sie Ihre Domain ein',
    SAVE_DOMAIN: 'Domain speichern',
    TECH_APPROVAL_DONE: 'Technische Zulassung abgeschlossen',
    RECOGNIZE_REGISTERED_DOMAIN: 'Bitte fügen Sie das folgende Meta-Tag in den HEAD Ihrer Startseite ein, um die Domain zu registrieren',
    WAITING_MANUAL_APPROVAL: 'Warten auf manuelle Genehmigung. Sie werden per E-Mail benachrichtigt.',
    
    //Assistent Success Modal
    ASSISTANT_SUCCESS : 'Template gespeichert',
    ASSISTANT_SUCCESS_HEAD_PART_ONE : 'Wir haben ', 
    ASSISTANT_SUCCESS_HEAD_PART_TWO : 'Werbemittel auf Ihr Template angepasst. Was möchten Sie als nächstes tun?',
    ADBILDER_LINK : 'Werbemittel-Galerie ansehen',
    ADBILDER_DES : 'Werbemittel im Detail anpassen',
    ZONEBILDER_LINK : 'Werbeflächen erstellen',
    ZONEBILDER_DES : 'Erstellen Sie Zonen, in die Werbemittel eingebunden werden können',
    MODAL_CLOSE : 'schließen',

    // Ad Customizer
    NOT_SAVED_YET: 'Noch nicht gespeichert',
    MY_ADS: 'In "Meine Werbemittel" speichern',
    UPDATE_ADS: 'Aktualisieren Sie in "Meine Werbung"',
    CREATE_NEW_VERSION: 'Neue Variante erstellen',
    DELETE_AD: 'Werbemittel löschen',
    MY_PROMO_PRODUCT: 'Meine Werbemittel',
    CREATED_ON: 'Erstellt am',
    TYPE: 'Typ',
    NO_RESULTS: 'Keine Ergebnisse',
    ERR_BLANK_NAME: 'Bitte geben Sie einen Namen an',
    ERR_BLANK_DOMAIN: 'Bitte wählen Sie eine Domäne',
    
    // Ad Builder
    PECUNIO_STANDARD: 'Pecunio Standard',
    NO_TEMAPLATE: 'Keine Vorlagen',
    CUSTOMIZE_TEMPLATE: 'Eigene Vorlagen',
    
    // Zone Builder
    OVERVIEW_AD_ZONE: 'Übersicht Werbeflächen',
    AD_ZONE: 'Werbefläche',
    LIST_AD_ZONE: 'Werbeflächenliste',
    LAST_UPDATED: 'Letzte Änderung',
    SHOW: 'Zeigen',
    
    YOUR_AD_SPACE: 'Ihre Werbeflächen',
    CREATE_AD: 'Starten Sie jetzt mit der Erstellung Ihrer individuellen Werbeflächen',
    ENTER_URL: 'URL eingeben',
    INVALID_URL: 'Ungültige URL!',
    READ_NOW: 'Jetzt einlesen',
    
    ADD_AD_SPACE: 'Werbeflächen hinzufügen',
    GENERATE_CODE: 'Code generieren',
    ADD_URL: 'URL hinzufügen',
    ALL_PORTAL: 'Alle Portale',
    ALL_AREAS: 'Alle Bereiche',
   
    FOR_PORTAL:'Für das Portal',
    FOR_ZONE: 'Flächen für',

    NEW_ZONE_NOTIFICATION: 'Neue Bereich Benachrichtigung',

    
    // Page Head
    
    CREATE_NEW_AD_MED: 'Neues Werbemittel erstellen',
    START_ASSISTANT: 'Assistent Starten',
    BACK_TO: 'Zurück  zu',
    BACK_TO_OVERVIEW: 'Zurück zur Übersicht',
    TXT_DISPLAY: 'Textanzeige',
    CREATE_NEW_AD_SPACE: 'Neue Werbeflächen erstellen',
    SELECT: 'Wählen',
    COMPARISION: 'Vergleich',
    
    // Header
    
    FIRST_STEPS: 'Erste Schritte',
    NEW_POST: 'Neuer Beitrag',
    NEW_COMMENT: 'Neuer Kommentar',
    SHARE: 'Teilen',
    COMMENTS: 'Kommentare',
    FEEDBACK: 'Bewertungen',
    VARIANT: 'Variante',
    
    // Ad Toolbar
    
    PRODUCT: 'Produkt',
    WIDTH: 'Breite',
    HEIGHT: 'Höhe', 
    CATEGORY: 'Kategorie',
    STANDARD: 'Standard',
    OWN: 'Eigene',
    DISPLAY: 'Anzeige',
    
    // Ad Custom Tool
    
    BLOCKS: 'Blöcke',
    FRAMEWORK: 'Rahmen',
    COMMON_COLOR: 'Gemeinsame Farben',
    BG_COLOR: 'Hintergrundfarbe',
    OWN_TEMPLATE: 'Eigene Vorlage',
    TEMPLATE: 'Vorlage',
    NAME: 'Name',
    GENERAL: 'ALLGEMEIN',
    FONT: 'Schriftart',

    
    // Assistent Builder
    
    MY_PORTAL: 'Ihr Portal',
    AD_TITLE: 'Anzeigentitel',
    TEXT_LINE: 'Textzeile',
    
    // Assistent Modal
    
    REGISTER_NEW_DOMAIN: 'Neue Domain registrieren',
    DOMAIN_NAME: 'Domain Name',
    TECH_CHECK: 'Technische Kontrolle',
    ENTER_META_DATA: 'Bitte fügen Sie das folgenden Meta-Tag in den HEAD Ihrer Startseite ein:',
    CHECK: 'Prüfen',
    TECH_APPROVAL: 'Technische Freigabe',

    
    // Validation messages
    VALIDATION_REQUIRED:        'Pflichtfeld!', 
    VALIDATION_EMAIL:           'Ungültiges E-Mail-Format!',
    VALIDATION_VALIDDOMAIN:     'Ungültige Domain Name!',
    VALIDATION_UNIQUEDOMAIN:    'Diese Website wurde vom System abgelehnt.',
    VALIDATION_UNIQUEDOMAINUSER:'Diese Website haben Sie schon registriert.',
    VALIDATION_UNIQUEEMAIL:     'Ungültige Kontoinformationen!',
    VALIDATION_UNIQUEUSERNAME:  'Ungültige Kontoinformationen!',
    VALIDATION_RETYPEPASS:      'Passwort ist nicht korrekt!',


    
    VALIDATION_MOBILE:          'Keine gültige Handynummer!',
    VALIDATION_EXISTCOMPANYACCCOUNT: 'Ungültige Kontoinformationen!',
    VALIDATION_PASSVALIDATION: 'Passwörter müssen zwischen 8 und 20 Zeichen lang sein und mindestens einen Klein- und einen Großbuchstaben, eine Zahl und ein Sonderzeichen beinhalten',


    // Ad Customizer(de)
    NO_PREVIEW_MSG: 'Keine Vorschau verfügbar. Bitte wählen Sie einen Standard-Ad',
    NEW_DOMAIN_REG: 'Neue Domain registrieren',

    // Dashboard(de)
    DASHBOARD_CONFIG: 'Konfigurierbare Dashboards mit widgets (hinzufügen, löschen, freie Positionsanordnung)',

    //Publisher Domain Registration(de)
    DOMAIN_TITLE: 'Sie haben noch keine registrierte Domain. Bitte registrieren Sie Ihre Domain, um fortzufahren.',
    DOMAIN_MSG: 'Bitte geben Sie den folgenden Meta-Tag in der Homepage … ein.',
    ENTER_DOMAIN: 'Bitte geben Sie den Domain-Namen ein',
    ADD_DOMAIN_MSG: 'weitere Domain hinzufügen',
    ADD_DOMAIN: 'Domain speichern',
    CHECK: 'Prüfen',

    //Profile Account(de)
    CURRENT_LOGO: 'Stellen Sie Ihr aktuelles Logo ein',
    ADD_LOGO: 'Wählen Sie eine Datei aus.',
    UPLOAD_QUEUE: 'Warteschlange',
    QUEUE_LENGTH: 'Dauer der Warteschlange',
    PREVIEW: 'Vorschau',
    PROGRESS: 'Fortschritt',
    REMOVE: 'entfernen',
    UPLOAD_AND_SAVE: 'hochladen und speichern',
    QUEUE_PROGRESS: 'Fortschritt in der Warteschlange',
    UPLOAD_ALL: 'Alle hochladen',
    SAVE_ALL: 'Alle speichern',

    //Avatar change(de)
    CHANGE_AVATAR_TITLE: 'Profilbild aktualisieren',
    SELECT_FILE: 'Datei auswählen',
    RESET: 'Zurücksetzen',

    //Manage Domain(de)
    PENDING: 'noch nicht erledigt',
    TECH_APPROVED: 'technisch zugelassen',
    MANUALLY_APROVED: 'manuell genehmigt',
    TECH_FAILD: 'technisch gescheitert',
    MANUALLY_DECLINED: 'manuell abgelehnt',
    RUN_FOR_APPROVAL: 'Ausführen für die Genehmigung',

    //Ad Toolbar(de)
    STYLE: 'STIL',
    ALABAMA: 'Alabama',
    WYOMING: 'Wyoming',

    //Account user controller(de)
    WANT_TO_DELETE: 'Wollen Sie diesen Benutzer löschen?',
    ACCOUNT_USER_DELETED_SUCC: 'Benutzerkonto wurde erfolgreich gelöscht',

    //Ad custom toolbar(de)
    SELECT_FONT: 'Schriftart auswählen',
    PRIMARY_FONT: 'primäre Schriftart',
    SECONDARY_FONT: 'sekundäre Schriftart',

    //Assistent toolbar(de)
    THEME_EXAMPLE_TITLE: 'Werbemittel-Beispiel',
    CREATE_TEMPLATE: 'Template Erstellen',
    COLOR: 'Farbe',
    COLOR_DESC_FIRST: 'z.B. Icons, Highlights',
    COLOR_DESC_SECOND: 'z.B. Boxen',
    COLOR_DESC_THIRD: 'z.B. Links',
    SAVE_AND_CONTINUE: 'Speichern und fortfahren',

    //Widget(de)
    MOVE_TO_DASHBOARD: 'Gehen Sie zum Dashboard',

    //Form tool(de)
    GENERAL: 'ALLGEMEIN',
    MAIN_COLOR: 'Hauptfarbe',
    TEXT_COLOR: 'Schriftfarbe',
    BG_COLOR: 'Hintergrundfarbe',
    BORDER_COLOR: 'Rahmenfarbe',
    BUTTON_COLOR: 'Tasten Farbe',
    BUTTON_BG_COLOR: 'Tasten Hintergrundfarbe',
    BUTTON_TYPE: 'Tasten-Typ',

    //Zonebuilder(de)
    NOTIFY_USER: 'Benutzer benachrichtigen',

    //Invocation Modal(de)
    VIEW_CODE: 'Code ansehen',
    FOR_DOMAIN: 'Für die Domain',

    //Notify user modal(de)
    COMPLETE: 'Fertigstellen',
    NOTIFICATION_TO: 'Senden Mitteilung an',
    CREATE_CODE: 'Code erstellen',
    CREATED_URLS: 'URLs erstellt',

    //Support(de)
    SUPPORT_TICKETS: 'Support-Tickets',
    DATE: 'Datum',
    THEME: 'Thema',
    HEADING: 'Überschrift',
    LAST_UPDATE: 'Letztes Update',
    EMPLOYEE: 'Mitarbeiter',
    SUPPORT_REQUEST: 'Ihre Support-Anfrage',
    REPLY_OF: 'Antworten auf',
    REPLY: 'Antworten',
    SUBMIT_REPLY: 'Antwort Absenden',

    //Assitent Builder controller(de)
    PAGE_NOT_RENDERED: 'Seite konnte nicht dargestellt werden',
    PAGE_NOT_OPENED: 'Seite konnte nicht geöffnet werden',

    //Avatar change controller(de)
    FILE_TYPE_MSG: 'Sie können nur jpg, png, jpeg, bmp, gif Dateien hochladen',
    READY_TO_SAVE_MSG: 'Jetzt können Sie Ihr Bild hochladen und speichern',

    //User profile controller(de)
    READY_TO_UPLOAD_LOGOS: 'Jetzt können Sie Ihr(e) Logo(s) hochladen',
    READY_TO_SAVE_LOGOS: 'Speichern Sie jetzt Ihr(e) Logo(s)',
    PROFILE_UPDATED: 'Profil erfolgreich aktualisiert',
    PWD_CHANGED: 'Passwort wurde erfolgreich geändert',
    GROUP_DELETED: 'Gruppe wurde erfolgreich gelöscht',
    COMPANY_UPDATED: 'Unternehmensdaten wurden erfolgreich aktualisiert',
    FINANCE_UPDATED: 'Finanzdaten erfolgreich aktualisiert',
    USER_CREATED: 'Benutzer wurde erfolgreich erstellt',
    USER_UPDATED: 'Benutzer wurde erfolgreich aktualisiert',
    GROUP_SAVED: 'Gruppe wurde erfolgreich gespeichert',

    //assistenttoolbar directive(de)
    VALIDATION_FIRST_BOX: 'Klicken Sie auf das erste Feld und wählen eine Primärfarbe von der Webseite',
    VALIDATION_SECOND_BOX: 'Klicken Sie auf das zweite Feld und wählen eine Sekundärfarbe von der Webseite',
    VALIDATION_THIRD_BOX: 'Klicken Sie auf das dritte Feld und wählen eine Tertiärfarbe von der Webseite',
    VALIDATION_HEADLINE_FONT: 'Wählen Sie eine Schriftart für Überschriften',
    VALIDATION_HEADLINE_BOX: 'Klicken Sie auf das Feld und wählen Sie eine Farbe für Überschriften von der Webseite',
    VALIDATION_TEXT_FONT: 'Wählen Sie eine Schriftart für Texte',
    VALIDATION_TEXT_BOX: 'Klicken Sie auf das Feld und wählen Sie eine Farbe für Texte von der Webseite',
    VALIDATION_THEME_NAME: 'Bitte geben Sie einen Namen für das Motiv ein',
    THEME_EXIST_MSG: 'Diese Domain hat bereits ein Motiv',

    //Ad customizer controller(de)
    CONFIRM_DELETE_AD: 'Sind Sie sicher, dass Sie diese Anzeige löschen wollen?',

    //Assistent controller(de)
    DOMAIN_WAITING_MANUAL_APPROVE: 'Ihre Domain ist registriert ... aber wartet auf manuelle Genehmigung',
    DOMAIN_TECH_FAILD: 'Ihre Domain ist technisch nicht genehmigt',
    DOMAIN_MANUAL_FAILD: 'Ihre Domain ist manuell nicht genehmigt',
    DOMAIN_WAITING_TECH_APPROVE: 'Ihre Domain ist registriert ... aber wartet auf technische Genehmigung',
    DOMAIN_NOT_REG: 'Ihre Domain ist nicht registriert. Bitte speichern Sie, um fortzufahren.',
    DOMAIN_REG: 'Domain wurde erfolgreich registriert',
    DOMAIN_TECH_APPROVE_WAITING_MANUAL: 'Die Domain ist technisch überprüft. Wartet aber auf manuelle Genehmigung.',

    //Support controller(de)
    TICKET_CREATED_SUCC: 'Ticket erfolgreich erstellt',
    TICKET_CREATED_FAILD: 'Fehler beim Erstellen des Tickets',
    REPLY_POSTED_SUCC: 'Antwort erfolgreich abgeschickt',
    REPLY_POSTED_FAILD: 'Fehler beim Antworten',
    HEADING: 'Überschrift',
    MSG: 'Ihre Nachricht',

    //Pagehead controller(de)
    DOMAIN_NOT_CHECKED_WAIT: 'Ihre registrierte Domain ist noch nicht geprüft. Bitte warten Sie, bis die Überprüfung abgeschlossen ist.',

    //configWidget directive(de)
    WIDGET_EXISTS: 'Widget existiert bereits auf dem dashboard',
    WIDGET_MOVED: 'Widget erfolgreich dem dashboard hinzugefügt',
    WIDGET_REMOVED: 'Widget erfolgreich vom dashboard entfernt',

    //copyText directive(de)
    TEXT_COPIED: 'Text erfolgreich in die Zwischenablage kopiert!',

    //user profile controller(de)
    USER_CREATED_SEND_SET_PWD_LINK: 'Benutzer wurde erfolgreich erstellt. Ein Link wurde an Ihre E-Mail-Adresse gesendet. Bitte klicken Sie auf diesen Link, um ein Kennwort für Ihr Konto festzulegen.',

    //Zone builder controller(de)
    ZONE_CHANGED_SUCC: 'Feld erfolgreich geändert',
    CHANGE_ZONE_ERROR: 'Fehler im geänderten Feld',
    SELECT_ZONE_FIRST: 'Wählen Sie zunächst ein Feld aus',
    ZONE_CREATE_SUCC: 'Neues Feld erfolgreich erstellt',
    ZONE_CREATE_FAILED: 'Fehler beim Erstellen des Feldes',
    ZONE_DELETE_SUCC: 'Feld erfolgreich gelöscht',
    ZONE_DELETE_FAIELD: 'Fehler beim Löschen des Feldes',
    CODE_GEN_ERROR: 'Fehler bei der Erzeugung des Codes',
    SENDING_FAILED: 'Fehler beim Versenden',
    SELECT_HOMEPAGE_USER: 'Wählen Sie die Homepage und Benutzer per E-Mail',
    ZONE_SPACE_DELETED_SUCC: 'Werbeflächen erfolgreich gelöscht',
    ZONE_SPACE_DELETED_FAILED: 'Fehler beim Löschen der Werbeflächen',

    //Account user controller(de)
    ADD_GROUP_THEN_ADD_ACCOUNT_USER: 'Bitte fügen Sie eine Gruppe hinzu ... dann fügen Sie ein Benutzerkonto hinzu',

    //create password html(de)
    SET_PASSWORD: 'Passwort festlegen',
    PASSWORD_SET_SUCC: 'Passwort wurde erfolgreich festgelegt .. Bitte loggen Sie sich ein',
    SOCIAL_LOGIN_FAIL: 'Dieser Benutzer ist bereits auf pecunio registriert  .. Bitte loggen Sie sich im Loin-Fenster ein'



  });

  // @todo better translations before using US version
  $translateProvider.translations('en', {
	  
	// Login & Create account sections  
    USER_NAME:  'Username',
    WELCOME :   'Welcome',
    PLEASE_LOGIN: 'Please Login',
    LOGIN_ERROR: 'Invalid Username and Password',
    LOGIN: 'login',
    REMEMBER_ME: 'Remember me',
    FORGOT_PASSWORD: 'Forgot Password',
    OR_LOGIN_WITH: 'Or, login with',
    CREATE_ACCOUNT: 'Create an account',
    FORGOT_PASSWORD: 'Forget Password',
    ENTER_EMAIL_RESET: 'Enter your e-mail to reset it',
    SIGN_UP: 'Sign Up',
    ENTER_PERSONAL_DETAILS: 'Enter your personal details below',
    USER_SUCCESS: 'User created successfully',
    FULL_NAME: 'Full Name',
    EMAIL: 'Email',
    MOBILE: 'Mobile',
    ADDRESS: 'Address',
    CITY_TOWN: 'City/Town',
    COUNTRY: 'Country',
    ACCOUNT_DETAILS: 'Enter your account details below',
    PASSWORD: 'Password',
    RETYPE_PASSWORD: 'Retype Password',
    SELECT_ACCOUNT: 'Select Account',
    OPERATOR: 'Operator',
    CUSTOMER: 'Customer',
    AFFILIATE: 'Affiliate',
    CALLCENTER: 'Call Center',
    SELECT_COMPANY: 'Select Organisation',
    ENTER_ORGANIZATION: 'Enter Organisation',
    SELECT_SALUTATION: 'Select Salutation',
    TELEPHONE: 'Telephone',
    DOMAIN: 'Domain',
    BACK: 'Back',
    SUBMIT: 'Submit',
    FORGOTPASS_ERROR: 'Invalid Email',
    FORGOTPASS_SUCCESS: 'Password has been changed successfully',
    SUPPORT: 'How can we help you?',
    FAQ: 'Frequently Asked Questions',
    TICKETS: 'Information on the data sets',
    ALL: 'All',
    OPEN: 'Open',
    CLOSED: 'Closed',
    TITLE: 'Heading',
    TOPIC: 'Topic',
    GEN_QUERY: 'General Enquiry',
    BOOK_KEEPING: 'Book keeping',
    TECH_ISSUE: 'Technical Issues',
    PART_SUPPORT : 'Partner Support',
    CUS_ENQURY : 'Customer Enquiry',
    UR_MSG: 'Your Message',
    
    // Dashboard Profile section
    ACCOUNT_INFORMATION: 'Account Information',
    PERSONAL_INFO: 'Personal Info',
    FINANCES: 'Finances',
    COMPANY: 'Company',
    SALUTATION: 'Salutation',
    MR: 'Mr.',
    MRS: 'Mrs.',
    DATE_OF_BIRTH: 'Date of birth',
    CANCEL: 'Cancel',
    
    // Dashboard Profile, Finances
    ACCOUNT_HOLDER: 'Account Holder',
    SALES_TAX_AUTHORIZED: 'Sales tax authorized',
    PROOF: 'Proof',
    SALES_TAX: 'Sales Tax',
    ALT_STATEMENT_ADDR: 'Alternative Statement Address',
    ROAD: 'Road',
    ZIP_CODE: 'Zip Code',
    PLACE: 'Place',
    
    // Dashboard Profile, Company
    COMPANY_NAME: 'Company Name',
    SELECT_COUNTRY: 'Select Country',
    STREET_NO: 'Street + No.',
    LEGAL_REPRESENTATIVE: 'Legal Representatives',
    COMM_REGISTER_NO: 'Commercial Register Number',
    COMPANY_LOGO_UPLD: 'Company Logo Upload',
    
    // Dashboard Change Password
    CHANGE_PASSWORD: 'Change-Password',
    NEW_PASSWORD: 'New Password',
    
    // Dashboard Manage Account Users
    ACOOUNT_USERS_LIST_VIEW: 'Acoount Users - list view',
    ADD_NEW: 'Add New',
    TOOLS: 'Tools',
    EXPORT_TO_EXCEL: 'Export to Excel',
    ACCOUNT_TYPE: 'Account Type',
    GROUP: 'Group',
    ROLE: 'Role',
    STATUS: 'Status',
    EDIT: 'Edit',
    DELETE: 'Delete',
    SELECT_GROUP: 'Select Group',
    SELECT_ROLE: 'Select Role',
    INACTIVE: 'Inactive',
    ACTIVE: 'Active',
    DELETED: 'Deleted',
    SAVE: 'Save',
    CLOSE: 'Close',
    
    // Dashboard Manage Groups
    MANAGE_GROUPS: 'Manage Groups',
    SEARCH_BY_NAME: 'Search By Name',
    NAME: 'Name',
    DESCRIPTION: 'Description',
    
    

    // Dashboard Sidebar
    MY: 'My',
    PROFILE: 'Profile',
    MANAGE_ACCOUNT_USERS: 'Manage account users',
    DASHBOARD: 'Dashboard',
    PERFORMANCE: 'Performance',
    ACCOUNTS: 'Accounts',
    FACILITY: 'Facility',
    PROMO_PRODUCTS: 'Promotional Products',
    AD_SPACE: 'Advertising Space',
    LOGOUT: 'Logout',
    SUPPORT_TEAM: 'Support Team',
    REQUEST_SUPPORT: 'Request Support',
    
    //Dashboard Werbemittel
    HOME: 'Home',
    OVERVIEW_PROMO_PRODUCTS: 'Overview Promotional Products',
    IMPRESSIONS: 'Impressions',
    PREVIOUS_MONTH: 'Previous month',
    CLICKS: 'Clicks',
    USERS: 'Users',
    BOUNCE_RATE: 'Bounce Rate',
    STATISTICS: 'Stastics',
    LIST_PROMO_PRODUCTS: 'List Promotional Products',
    SECTION: 'Section',
    TEMPLATES: 'Templates',
    SIZE: 'Size',
    STATUS: 'Status',
    ACTION: 'Action',
    
    // Ad Modal
    YOUR_PROMO_MATERIAL: 'Your promotional materials',
    ALL_CATEGORIES: 'all categories',
    ALL_TYPES: 'all types',
    CREATE_PROMO_PRODUCT: 'Create promotional material',
    CREATE_PROMO_INTRO: 'Create click-intensive advertising media with the simple editor',
    
    //Assistent Modal
    ASSISTANT : 'Assistant',
    ADJUST_MARKET_MATERIAL: 'Adjust marketing materials available with a few clicks, and create suitable advertising space',
    PORTAL_URL: 'Your portal URL',
    READ_PORTAL: 'read portal',
    REGISTER_DOMAIN: 'Register Domain',
    ENTER_DOMAIN_NAME: 'Enter a Domain Name',
    SAVE_DOMAIN: 'Save Domain',
    TECH_APPROVAL_DONE: 'Technical Approval - done',
    RECOGNIZE_REGISTERED_DOMAIN: 'Please enter the following meta tag in your home page to recognise registered domain',
    WAITING_MANUAL_APPROVAL: 'Waiting for manual approval. You will be notified by Email.',
    
    //Assistent Success Modal
    ASSISTANT_SUCCESS : 'Template Saved',
    ASSISTANT_SUCCESS_HEAD_PART_ONE : 'We have saved ', 
    ASSISTANT_SUCCESS_HEAD_PART_TWO : ' advertising media to your template. What would you like to do next?',
    ADBILDER_LINK : 'Advertising Gallery',
    ADBILDER_DES : 'Customize advertising in detail',
    ZONEBILDER_LINK : 'Create advertising Zone',
    ZONEBILDER_DES : 'Create zones in which advertising can be incorporated',
    MODAL_CLOSE : 'Close',

    // Ad Customizer
    NOT_SAVED_YET: 'Not saved yet',
    MY_ADS: 'In store "My Ads"',
    UPDATE_ADS: 'Update in "My Ads"',
    CREATE_NEW_VERSION: 'Create New Version',
    DELETE_AD: 'Delete advertising material',
    MY_PROMO_PRODUCT: 'My Promotional Products',
    CREATED_ON: 'Created on',
    TYPE: 'Type',
    NO_RESULTS: 'No Results',
    ERR_BLANK_NAME: 'Please provide Ad name',
    ERR_BLANK_DOMAIN: 'Please choose Domain',
    
    
    // Ad Builder
    PECUNIO_STANDARD: 'Pecunio Standard',
    NO_TEMAPLATE: 'No Template',
    CUSTOMIZE_TEMPLATE: 'Customize Templates',
    
    // Zone Builder
    OVERVIEW_AD_ZONE: 'Overview advertising spaces',
    AD_ZONE: 'Advertising Space',
    LIST_AD_ZONE: 'List Ad Space',
    LAST_UPDATED: 'Last Updated',
    SHOW: 'Show',
    
    YOUR_AD_SPACE: 'Your Advertising Space',
    CREATE_AD: 'Start now with the creation of individual advertising space',
    ENTER_URL: 'Enter URL',
    INVALID_URL: 'Invalid URL!',
    READ_NOW: 'Read Now',
    
    ADD_AD_SPACE: 'Add advertising space',
    GENERATE_CODE: 'Generate Code',
    ADD_URL: 'Add URL',
    ALL_PORTAL: 'All Portal',
    ALL_AREAS: 'All Areas',
    
    // Page Head
    
    CREATE_NEW_AD_MED: 'Create new advertising medium',
    START_ASSISTANT: 'Assistant Start',
    BACK_TO: 'Back to',
    BACK_TO_OVERVIEW: 'Back to overview',
    TXT_DISPLAY: 'Display Text',
    CREATE_NEW_AD_SPACE: 'Create new ad space',
    SELECT: 'Select',
    COMPARISION: 'Comparison',
    
    // Header
    
    FIRST_STEPS: 'First Steps',
    NEW_POST: 'New Post',
    NEW_COMMENT: 'New Comment',
    SHARE: 'Share',
    COMMENTS: 'Comments',
    FEEDBACK: 'Feedbacks',
    VARIANT: 'Variant',

	// Ad Toolbar
    
    PRODUCT: 'Product',
    WIDTH: 'Width',
    HEIGHT: 'Height',
    
    CATEGORY: 'Category',
    STANDARD: 'Standard',
    OWN: 'Own',
    DISPLAY: 'Display',
    
    // Ad Custom Tool
    
    BLOCKS: 'Blocks',
    FRAMEWORK: 'Framework',
    COMMON_COLOR: 'Common Color',
    BG_COLOR: 'Background Color',
    OWN_TEMPLATE: 'Own Template',
    TEMPLATE: 'Template',
    NAME: 'Name',
    GENERAL: 'GENERAL',
    FONT: 'Font',
    
    // Assistent Builder
    
    MY_PORTAL: 'My Portal',
    AD_TITLE: 'Ad Title',
    TEXT_LINE: 'Text Line',
    
    // Assistent Modal
    
    REGISTER_NEW_DOMAIN: 'Register New Domain',
    DOMAIN_NAME: 'Domain Name',
    TECH_CHECK: 'Technical Check',
    ENTER_META_DATA: 'Please enter the following meta tag in your home page to recognise registered domain',
    CHECK: 'Check',
    TECH_APPROVAL: 'Technical Approval Status',
    
    
    //Validation messages
    VALIDATION_REQUIRED:        'Field is required!', 
    VALIDATION_EMAIL:           'Invalid e-mail format!',
    VALIDATION_VALIDDOMAIN:     'Invalid Domain Name!',
    VALIDATION_UNIQUEDOMAIN:    'Already exists!',
    VALIDATION_UNIQUEEMAIL:     'Already exists!',
    VALIDATION_UNIQUEUSERNAME:  'Already exists!',
    VALIDATION_UNIQUEDOMAINUSER:'Diese Website haben Sie schon registriert.',
    VALIDATION_RETYPEPASS:      'Password doesn\'t match',
    VALIDATION_MOBILE:          'Not a valid mobile number!',
    VALIDATION_EXISTCOMPANYACCCOUNT: 'This account is already registered',
    VALIDATION_PASSVALIDATION: 'Passwords must be between 8 and 20 characters and contain one lower & uppercase letter, one number and a special character',


    // Ad Customizer(en)
    NO_PREVIEW_MSG: 'No preview available. Please select a default Ad',
    NEW_DOMAIN_REG: 'Register New Domain',

    // Dashboard(en)
    DASHBOARD_CONFIG: 'Configure Dashboard with Widgets (add, delete, free position arrangement)',

    //Publisher Domain Registration(en)
    DOMAIN_TITLE: "You don't have a registered domain. Please register your domain to continue.",
    DOMAIN_MSG: 'Please enter the following meta tag in the home page of….',
    ENTER_DOMAIN: 'Enter a domain name',
    ADD_DOMAIN_MSG: 'Add another domain',
    ADD_DOMAIN: 'Add domain',
    CHECK: 'Check',

    //Profile Account(en)
    CURRENT_LOGO: 'Set your current Logo',
    ADD_LOGO: 'Select files to add logo',
    UPLOAD_QUEUE: 'Upload queue',
    QUEUE_LENGTH: 'Queue length',
    PREVIEW: 'Preview',
    PROGRESS: 'Progress',
    REMOVE: 'Remove',
    UPLOAD_AND_SAVE: 'Upload and Save',
    QUEUE_PROGRESS: 'Queue progress',
    UPLOAD_ALL: 'Upload all',
    SAVE_ALL: 'Save all',

    //Avatar change(en)
    CHANGE_AVATAR_TITLE: 'Update profile picture',
    SELECT_FILE: 'Select file',
    RESET: 'Reset',

    //Manage Domain(en)
    PENDING: 'Pending',
    TECH_APPROVED: 'Technically Approved',
    MANUALLY_APROVED: 'Manually Approved',
    TECH_FAILD: 'Technically Faild',
    MANUALLY_DECLINED: 'Manually Declined',
    RUN_FOR_APPROVAL: 'Run for approval',

    //Ad Toolbar(en)
    STYLE: 'STYLE',
    ALABAMA: 'Alabama',
    WYOMING: 'Wyoming',

    //Account user controller(en)
    WANT_TO_DELETE: 'Want to delete this user?',
    ACCOUNT_USER_DELETED_SUCC: 'Account user has been deleted successfully',

    //Ad custom toolbar(en)
    SELECT_FONT: 'Select Font',
    PRIMARY_FONT: 'Primary Font',
    SECONDARY_FONT: 'Secondary Font',

    //Assistent toolbar(en)
    THEME_EXAMPLE_TITLE: 'Promotional Products Example',
    CREATE_TEMPLATE: 'Create Template',
    COLOR: 'Color',
    COLOR_DESC_FIRST: 'e.g. Icons, Highlights',
    COLOR_DESC_SECOND: 'e.g. Boxes',
    COLOR_DESC_THIRD: 'e.g. Links',
    SAVE_AND_CONTINUE: 'Save and continue',

    //Widget(en)
    MOVE_TO_DASHBOARD: 'Move to Dashboard',

    //Form tool(en)
    GENERAL: 'GENERAL',
    MAIN_COLOR: 'Main Color',
    TEXT_COLOR: 'Text Color',
    BG_COLOR: 'Background Color',
    BORDER_COLOR: 'Border Color',
    BUTTON_COLOR: 'Button Color',
    BUTTON_BG_COLOR: 'Button Bgcolor',
    BUTTON_TYPE: 'Button Type',

    //Zonebuilder(en)
    NOTIFY_USER: 'Notify User',

    //Invocation Modal(en)
    VIEW_CODE: 'View code',
    FOR_DOMAIN: 'For Domain',

    //Notify user modal(en)
    COMPLETE: 'Complete',
    NOTIFICATION_TO: 'Send notification to',
    CREATE_CODE: 'Create code',
    CREATED_URLS: 'URLs created',

    //Support(en)
    SUPPORT_TICKETS: 'Support Tickets',
    DATE: 'Date',
    THEME: 'Theme',
    HEADING: 'Heading',
    LAST_UPDATE: 'Last update',
    EMPLOYEE: 'Employee',
    SUPPORT_REQUEST: 'Your support request',
    REPLY_OF: 'Reply of',
    REPLY: 'Reply',
    SUBMIT_REPLY: 'Submit Reply',

    //Assitent Builder controller(en)
    PAGE_NOT_RENDERED: 'Page could not be rendered',
    PAGE_NOT_OPENED: 'Page could not be opened',

    //Avatar change controller(en)
    FILE_TYPE_MSG: 'You can upload only jpg, png, jpeg, bmp, gif file',
    READY_TO_SAVE_MSG: 'Now you can upload and save your image',

    //User profile controller(en)
    READY_TO_UPLOAD_LOGOS: 'Now you can upload your Logo(s)',
    READY_TO_SAVE_LOGOS: 'Now save your Logo(s)',
    PROFILE_UPDATED: 'Profil updated successfully',
    PWD_CHANGED: 'Password has been changed successfully',
    GROUP_DELETED: 'Group has been deleted successfully',
    COMPANY_UPDATED: 'Company data has been updated successfully',
    FINANCE_UPDATED: 'Finace data has been updated successfully',
    USER_CREATED: 'User has been created successfully.',
    USER_UPDATED: 'User has been updated successfully',
    GROUP_SAVED: 'Group has been saved successfully',

    //assistenttoolbar directive(en)
    VALIDATION_FIRST_BOX: 'Click on the first box and Choose a primary color from the web page',
    VALIDATION_SECOND_BOX: 'Click on the second box and Choose a secondary color from the web page',
    VALIDATION_THIRD_BOX: 'Click on the third box and Choose a tertiary color from the web page',
    VALIDATION_HEADLINE_FONT: 'Choose a font for Headlines.',
    VALIDATION_HEADLINE_BOX: 'Click on the box and Choose a color for headlines from the web page',
    VALIDATION_TEXT_FONT: 'Choose a font for Texts',
    VALIDATION_TEXT_BOX: 'Click on the box and Choose a color for texts from the web page',
    VALIDATION_THEME_NAME: 'Please enter a name for the Theme',
    THEME_EXIST_MSG: 'Already this domain has a Theme',

    //Ad customizer controller(en)
    CONFIRM_DELETE_AD: 'Are you sure you want to delete this Ad?',

    //Assistent controller(en)
    DOMAIN_WAITING_MANUAL_APPROVE: 'Your domain is registered...but waiting for manual approval',
    DOMAIN_TECH_FAILD: 'Your domain is technically inapproved',
    DOMAIN_MANUAL_FAILD: 'Your domain is manually inapproved',
    DOMAIN_WAITING_TECH_APPROVE: 'Your domain is registered...but waiting for technical approval',
    DOMAIN_NOT_REG: 'Your domain is not registered. Please save to continue.',
    DOMAIN_REG: 'Domain has been successfully registered',
    DOMAIN_TECH_APPROVE_WAITING_MANUAL: 'The domain has been technically verified. Waiting for manual approval.',

    //Support controller(en)
    TICKET_CREATED_SUCC: 'Ticket created successfully',
    TICKET_CREATED_FAILD: 'Error in creating ticket',
    REPLY_POSTED_SUCC: 'Reply posted successfully',
    REPLY_POSTED_FAILD: 'Error in posting reply',
    HEADING: 'Heading',
    MSG: 'Your Message',

    //Pagehead controller(en)
    DOMAIN_NOT_CHECKED_WAIT: 'Your registered domain is not checked. Please wait until the scan is complete.',

    //configWidget directive(en)
    WIDGET_EXISTS: 'Widget already exists on dashboard',
    WIDGET_MOVED: 'Widget moved to dashboard successfully',
    WIDGET_REMOVED: 'Widget removed from dashboard successfully',

    //copyText directive(en)
    TEXT_COPIED: 'Text copied to clipbord!',

    //user profile controller(en)
    USER_CREATED_SEND_SET_PWD_LINK: 'User has been created successfully. One link has been sent into your email address. Please click on that link to set a password for your account.',

    //Zone builder controller(en)
    ZONE_CHANGED_SUCC: 'Zone changed successfuly',
    CHANGE_ZONE_ERROR: 'Error in the changed zone',
    SELECT_ZONE_FIRST: 'Select a zone first',
    ZONE_CREATE_SUCC: 'New zone created successfully',
    ZONE_CREATE_FAILED: 'Failed to create zone',
    ZONE_DELETE_SUCC: 'Zone successfuly deleted',
    ZONE_DELETE_FAILED: 'Error in deleting zone',
    CODE_GEN_ERROR: 'Error when generating code',
    SENDING_FAILED: 'Error while sending',
    SELECT_HOMEPAGE_USER: 'Select the homepage, and users via email',
    ZONE_SPACE_DELETED_SUCC: 'Zone builder area successfuly deleted',
    ZONE_SPACE_DELETED_FAILED: 'Error in deleting Zone builder area',

    //Account user controller(en)
    ADD_GROUP_THEN_ADD_ACCOUNT_USER: 'Please add group...then add account user',

    //create password html(en)
    SET_PASSWORD: 'Set Password',
    PASSWORD_SET_SUCC: 'Password has been set successfully .. Please login',
    SOCIAL_LOGIN_FAIL: 'This user is already registered with pecunio .. please login from login window'


  });

  $translateProvider.preferredLanguage('de');
  //$translateProvider.useCookieStorage();

});
