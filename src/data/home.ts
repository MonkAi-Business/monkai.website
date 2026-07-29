export type TitledText = {
  title: string;
  text: string;
};

export type NumberedStep = TitledText & {
  num: string;
};

export type Service = TitledText & {
  eyebrow?: string;
  featured?: boolean;
};

export type Faq = {
  q: string;
  a: string;
};

export const problemCards: TitledText[] = [
  {
    title: 'Kopiëren en plakken',
    text: 'Bestellingen uit mails overtypen in het ERP. Gegevens van het ene systeem naar het andere slepen. Elke dag opnieuw.',
  },
  {
    title: 'Kennis in mailboxen',
    text: 'De beste antwoorden zitten in de mailbox van één collega. Valt die persoon uit, dan valt de kennis uit.',
  },
  {
    title: 'Stiekem experimenteren',
    text: 'Medewerkers proberen al AI, vaak met bedrijfsdata in een privé-account. Dat is geen probleem, dat is brandstof. Het heeft alleen een veilig kader nodig.',
  },
];

export const ladderLevels: TitledText[] = [
  {
    title: 'Automatiseren',
    text: 'Repetitieve back-office taken wegnemen met AI-automatisaties in n8n, Make of vergelijkbare tools. Bijvoorbeeld: bonnetjes en facturen automatisch laten lezen, hernoemen, taggen, in de juiste map zetten en doorsturen naar de boekhouding.',
  },
  {
    title: 'Onthouden',
    text: 'Een second brain voor jezelf, een collective brain voor het bedrijf: één gedeeld bedrijfsgeheugen waar kennis niet langer alleen in hoofden zit. Kennis zo structureren dat je in minuten een eerste versie hebt in plaats van in dagen. Het fundament is een eenvoudige data-architectuur: kennis op één plek, met duidelijke afspraken over wie wat ziet.',
  },
  {
    title: 'Versnellen',
    text: 'Accelerated coding: ontwikkelteams die met AI sneller en met betere kwaliteit werken, met behoud van controle en security.',
  },
];

export const approachSteps: NumberedStep[] = [
  {
    num: '01',
    title: 'Inspireren',
    text: 'Een sessie van twee uur die toont wat AI vandaag kan, met voorbeelden uit jouw sector.',
  },
  {
    num: '02',
    title: 'Kiezen',
    text: 'Samen de use cases selecteren met de beste verhouding tussen impact en moeite.',
  },
  {
    num: '03',
    title: 'Experimenteren',
    text: 'Klein en veilig proberen, met echte data in een afgesproken kader. Wat werkt blijft.',
  },
  {
    num: '04',
    title: 'Verankeren',
    text: 'Afspraken, begeleiding en overdracht. Jouw mensen nemen het over, ik stap terug.',
  },
];

export const services: Service[] = [
  {
    title: 'AI-inspiratiesessie',
    text: 'Twee uur, max 10 deelnemers, bij jou op locatie. Het vertrekpunt van elk traject.',
  },
  {
    title: 'Use case workshop',
    text: 'Ideeën verzamelen en wegen op een impact/effort-matrix. Je vertrekt met drie haalbare cases.',
  },
  {
    title: 'AI-geletterdheid en AI-maturiteit',
    text: 'Waar staat je team vandaag? We werken op maat van elk niveau, van sceptisch tot gevorderd.',
  },
  {
    title: 'AI-governance en EU AI Act',
    text: 'Duidelijke afspraken over data, tools en verantwoordelijkheid. Klaar voor de wet, zonder juristentaal.',
  },
  {
    title: 'Claude voor kenniswerkers',
    text: 'In kleine groepen leren kenniswerkers veilig en slim werken met Claude, op hun eigen taken.',
  },
  {
    title: 'Claude voor developers',
    text: 'Accelerated coding: sneller ontwikkelen met Claude als assistent, met behoud van controle en kwaliteit. In kleine groepen, op jullie eigen code.',
  },
  {
    title: 'Microsoft 365 Copilot veilig inzetten',
    text: 'Copilot staat vaak al aan. Ik help je het veilig en zinvol gebruiken.',
  },
  {
    title: 'Het juiste model kiezen',
    text: 'Niet gebonden aan één leverancier. Ook ChatGPT, Gemini en Chinese modellen zoals Z.Ai en KIMI komen op tafel als ze beter passen.',
  },
  {
    eyebrow: 'Langlopend engagement',
    title: 'Raad van advies',
    text: 'Zetelen in je raad van advies rond AI, digitale transformatie en innovatie in de brede zin. Geen project, wel een vaste kritische stem aan tafel.',
    featured: true,
  },
];

export const beyondChatRows: TitledText[] = [
  { title: 'Augmented reality', text: 'instructies op de plek waar je werkt' },
  { title: 'Smart glasses', text: 'handen vrij, informatie in beeld' },
  { title: 'Computer vision', text: "camera's die controleren en tellen" },
  { title: 'Connected worker', text: 'de werkvloer verbonden met de systemen' },
];

export const agreement = {
  monkai: [
    'Heldere uitleg, zonder jargon en zonder hype.',
    'Een aanpak die overdraagt in plaats van bindt.',
    "Ervaring met processen van Vlaamse KMO's.",
    'Eerlijk advies, ook als AI niet het antwoord is.',
  ],
  customer: [
    'Minstens één persoon die dit intern mee draagt. Dit is de belangrijkste voorwaarde.',
    'Tijd om te experimenteren tussen de sessies door.',
    'Toegang tot echte processen en voorbeelden.',
    'De wil om klein te beginnen.',
  ],
} as const;

export const faqs: Faq[] = [
  {
    q: 'In welke regio geef je AI-training en AI-adoptiecoaching?',
    a: "Ik werk op locatie bij KMO's in heel Oost-Vlaanderen en West-Vlaanderen, vanuit mijn basis in Oudenaarde. Voor bedrijven net buiten die regio bekijken we het per geval.",
  },
  {
    q: 'Wat is AI-adoptie precies?',
    a: 'AI-adoptie is het proces waarbij een organisatie AI niet alleen aankoopt, maar ook echt gebruikt in het dagelijkse werk. Het draait om mensen en gewoontes, niet om technologie: klein beginnen met concrete taken, herhalen tot het vanzelf gaat, en de kennis in huis houden.',
  },
  {
    q: 'Doe je Claude-training voor bedrijven?',
    a: 'Ik werk met inspiratiesessies en sparringsessies in kleine groepen, waarin je team leert om veilig en slim met Claude te werken op de eigen taken. Zoek je een uitgebreide, formele opleiding? Dan verwijs ik je gericht door naar de juiste partner. Zo krijg je altijd de aanpak die bij je vraag past.',
  },
  {
    q: 'Wat is het verschil tussen een second brain en een collective brain?',
    a: 'Een second brain is een persoonlijk kennissysteem: je legt vast wat je leert zodat je het later terugvindt. Een collective brain tilt dat naar bedrijfsniveau: één gedeeld bedrijfsgeheugen waar kennis niet langer alleen in hoofden zit, maar op één plek staat en met AI bevraagbaar is.',
  },
  {
    q: 'Voor wie is MonkAi Business bedoeld?',
    a: "Voor Vlaamse KMO's die met AI aan de slag willen zonder erin te verdrinken. Je werkt rechtstreeks met Stijn De Ketelaere, zonder tussenlagen, van de eerste sessie tot het moment dat je team het zelf kan.",
  },
  {
    q: 'Hoe start een traject?',
    a: 'Elk traject begint met een AI-inspiratiesessie: twee uur, tot tien deelnemers, bij jou op locatie. Daarna kiezen we samen enkele haalbare use cases en bouwen we stap voor stap op. Je verbindt je nergens toe op voorhand.',
  },
];
