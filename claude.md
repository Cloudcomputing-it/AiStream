
PROMPT START
Du bist der leitende Entwickler von AI Stream – einem B2B SaaS Produkt für intelligente Kundenkommunikation mit KI-Agenten.
Lies zuerst die CLAUDE.md im Root-Verzeichnis. Halte dich immer an alle darin definierten Regeln (Multi-Tenancy, Tech Stack, Naming etc.).

Was du jetzt bauen sollst
AI Stream fokussiert sich in dieser ersten Version auf 3 Kernbereiche:

1. POSTEINGANG (Inbox)
Ein Messaging-Posteingang, über den das Team eingehende Kundennachrichten (WhatsApp, E-Mail, etc.) verwaltet.
Funktionen:

Linke Sidebar mit Navigation: Posteingang, Entwürfe & Geplant, Alle Unterhaltungen, Mir zugewiesen, Nicht zugewiesen, Ungelesen, Markiert, Papierkorb, Spam
Postfächer-Bereich in der Sidebar (z.B. #Main, #Sales, #Support, #Marketing) – jedes Postfach ist ein eigener Kanal
Gespeicherte Unterhaltungsfilter (z.B. "New Leads", "VIP Customer") als Shortcuts
Mittlere Spalte: Liste der Unterhaltungen mit Absender, Kanal-Icon (WhatsApp-grün), Datum, Vorschautext, Tab-Filter: Offen / Später / Erledigt, Sortierung "Am neuesten"
Rechte Spalte: Geöffnete Unterhaltung mit Chat-Verlauf (Nachrichten links = Kunde, rechts = Team/KI), Eingabemaske unten mit WhatsApp-Template-Auswahl, Notiz-Funktion, Senden-Button

Datenmodell: Unterhaltungen gehören immer zu einem tenant_id. Jede Nachricht hat role: customer | agent | ai, channel: whatsapp | email | instagram, status: open | later | done.

2. KI-AGENTEN (AI Agents)
Ein vollständiger Bereich zum Erstellen, Konfigurieren und Verwalten von KI-Agenten, die automatisch auf Kundennachrichten antworten.
Agent erstellen – Wizard:

Modal: "Was soll dein KI-Agent für dich tun?" mit Freitext-Eingabe + Upload (Datei, Webseite) + Quick-Start-Vorlagen: Support-Agent, Vertrieb-Agent, Recruiting-Agent
Nach Bestätigung: Ladescreen "Dein KI-Agent wird konfiguriert..." (Claude API generiert den System Prompt automatisch aus der Beschreibung)

Agent konfigurieren – 5 Sektionen in der Sidebar:
a) Ziele & Persönlichkeit

Name des Agenten (intern)
Avatar (Emoji oder Upload)
"Was macht der KI-Agent konkret?" → großes Textfeld für System Prompt (Rolle & Aufgaben)
"Wie soll der KI-Agent kommunizieren?" → Stil & Sprache (Ton, Struktur, Do's und Don'ts)
Rechts: Live-Testumgebung (Chat-Fenster zum direkt Testen)

b) Wissen & Daten

Webseiten: URL eingeben → Agent crawlt die Seite automatisch, zeigt "X Seiten zugänglich gemacht"
Dateien hochladen: PDF, DOCX, XLSX → werden in Pinecone vektorisiert
Q&A Listen: Manuelle Frage-Antwort-Paare erstellen (Name der Liste + Fragen + Antworten)
Alles zusammen bildet die Knowledge Base des Agenten (Pinecone Namespace per Agent)

c) Tools & Aktionen (Platzhalter für MVP, noch nicht voll implementiert)

Platzhalter-UI: "Tools hinzufügen – Coming Soon"

d) Automationen

Übersicht: "Wähle, wann dein KI-Agent aktiv wird" mit 5 Optionen:

KI-Agent antwortet immer
Nur bei Erstkontakt
Bei jeder Chat-Eröffnung (Support & Ticketing)
Nur außerhalb Öffnungszeiten
Manuelle Übergabe an KI-Agenten


Jede Option öffnet einen visuellen Flow-Builder mit Nodes (ähnlich wie N8n, aber einfacher):

Node: START
Node: Neue eingehende Nachricht (Trigger) mit Kanal-Auswahl
Node: Filter (z.B. Öffnungszeiten, Postfach)
Node: KI-Agent (welcher Agent antwortet?)
Nodes sind per Drag-and-Drop verbindbar
Anleitung-Panel links erklärt den Flow in einfacher Sprache
Button: "Veröffentlichen" oben rechts



e) Credits & Nutzung

Wie viele AI-Credits wurden verbraucht
Aktueller Plan + Upgrade-Button

Agenten-Übersicht:

Liste aller KI-Agenten des Tenants mit Avatar, Name, Status (aktiv/inaktiv), letzte Aktivität
"Neuer KI-Agent" Button oben rechts
Leere State: Illustration + "Erstelle deinen ersten KI-Agenten"


3. AUTOMATIONEN (Automation Hub)
Ein separater Bereich für alle Automationen des Accounts (unabhängig von einzelnen Agenten).
Funktionen:

Header: "Automations" + "Neue Automation" Button
Banner: Academy-Hinweis mit Video-Thumbnail
Rechts: Credit-Counter (z.B. "143 / 270K") + Plan-Info
Automations-Liste mit Spalten: Name, Erstellt von, Zuletzt bearbeitet, Status (Entwurf / Aktiv / Pausiert), Runs, Tasks
Ordner-Struktur (z.B. "My Automations")
Aktivitätsprotokoll Tab
Jede Automation öffnet den visuellen Flow-Builder (gleich wie bei Agenten-Automationen)

Flow-Builder Details:

Canvas-basiert (React Flow oder ähnlich)
Node-Typen: Trigger-Node (grüner Rand), Filter-Node (oranger Rand), Aktion-Node (grauer Rand), KI-Agent-Node (blauer Rand)
Nodes haben Dropdown-Felder zum Konfigurieren (z.B. Kanal auswählen, Postfach auswählen, Agent auswählen)
Verbindungen zwischen Nodes mit Pfeilen
Sidebar-Panel links: Anleitung zum jeweiligen Flow-Template
Status-Badge oben: "Entwurf" → nach Publish: "Aktiv"


Tech Stack (aus CLAUDE.md)

Frontend: Next.js 14 App Router + Tailwind CSS + shadcn/ui
AI: Claude API (claude-sonnet-4-6) für Agent-Konfiguration und Antworten
DB: Supabase (alle Queries immer mit tenant_id!)
Vector: Pinecone (pro Agent ein eigener Namespace)
Flows: N8n im Hintergrund – die UI im Dashboard ist ein visueller Wrapper der N8n-Flows triggert


Build-Reihenfolge für diese Session
Schritt 1: Supabase Schema erstellen

Tabellen: tenants, users, channels, conversations, messages, ai_agents, agent_knowledge, agent_automations
RLS für alle Tabellen (tenant_id Isolation)
Migrations in /supabase/migrations/

Schritt 2: Dashboard Layout

Sidebar Navigation (Icons + Labels)
Routing für alle 3 Bereiche: /inbox, /agents, /automations

Schritt 3: Posteingang UI

3-Spalten-Layout (Sidebar / Liste / Chat)
Unterhaltungsliste mit Mock-Daten
Chat-Ansicht

Schritt 4: KI-Agenten Bereich

Agenten-Übersicht
Agent-Wizard (Erstellungs-Modal + Loading)
Agent-Konfiguration (alle 5 Sektionen)
Live-Testumgebung (rechte Spalte: Chat mit dem Agenten via Claude API)

Schritt 5: Flow-Builder (Automationen)

Einfacher Canvas mit React Flow
4 Node-Typen als Komponenten
Templates für die 5 Automations-Modi


Design-Vorgaben

Stil: Professionell, clean, modern – ähnlich wie Linear oder Superchat
Farben: Primär ein dunkles Navy-Blau/Teal als Akzentfarbe, Weiß/Hellgrau als Hintergrund
Komponenten: shadcn/ui als Basis, dann individuell angepasst
Icons: Lucide Icons
Schrift: Eine klare, professionelle Sans-Serif (kein Inter – z.B. Geist oder DM Sans)
Sidebar: Kompakt, Icon + Label, aktiver State klar erkennbar
Spacing: Großzügig – kein überladenes Interface


Wichtige Regeln (aus CLAUDE.md)

Alles heißt "AI Stream" – nie anderer Name
Jede DB-Query braucht tenant_id – niemals vergessen
Claude API nur in /app/api/ Routes, nie client-seitig
TypeScript strict überall
Server Components wo möglich, Client nur wenn nötig
Fehler immer mit try/catch abfangen und loggen
Alle Komponenten in components/ nach Feature aufteilen


Starte jetzt mit Schritt 1
Erstelle das vollständige Supabase Schema mit allen notwendigen Tabellen, Indexes und Row Level Security Policies. Dann gib mir eine kurze Zusammenfassung was du erstellt hast bevor du mit Schritt 2 anfängst.