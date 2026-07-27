// Leestijd wordt berekend uit de tekst zelf, niet uit een frontmatterveld. Zo kan ze
// niet verouderen als een post herschreven wordt.
//
// 200 woorden per minuut is een gangbaar tempo voor Nederlandstalig proza op een scherm.
// Naar boven afgerond, minimaal 1 minuut.
const WORDS_PER_MINUTE = 200;

/** Haalt de markdownopmaak weg zodat er alleen leesbare woorden overblijven. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')        // codeblokken
    .replace(/`[^`]*`/g, ' ')               // inline code
    .replace(/<[^>]+>/g, ' ')               // html, o.a. <img> voor diagrammen
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')  // afbeeldingen
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links: alleen het label telt mee
    .replace(/^[>#\-*+]+\s*/gm, ' ')        // citaten, koppen, opsommingstekens
    .replace(/[*_~|]/g, ' ');               // resterende opmaaktekens
}

export function readingTimeMinutes(markdown: string): number {
  const words = toPlainText(markdown).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Klaar om te tonen, bv. "4 min lezen". */
export function readingTimeLabel(markdown: string): string {
  return `${readingTimeMinutes(markdown)} min lezen`;
}
