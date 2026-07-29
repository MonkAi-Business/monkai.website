# Transition editor

De lokale transition editor helpt om herhaalde bewegingen tussen twee
Monkey Mode-clips weg te knippen. De originele videobestanden worden nooit
gewijzigd.

## Starten

Open een terminal in de repository en voer uit:

```powershell
npm.cmd run edit:transitions
```

Open daarna `http://127.0.0.1:4179`.

Staan de bronclips niet in `C:\Users\stijn\Downloads`, geef dan een andere map
mee:

```powershell
npm.cmd run edit:transitions -- --source "D:\video\monkey"
```

## Een overgang instellen

1. Kies bovenaan de grens tussen twee scènes.
2. Zoek in clip 1 het laatste bruikbare frame.
3. Klik op `Eindpunt instellen`.
4. Zoek in clip 2 het eerste bruikbare frame.
5. Klik op `Startpunt instellen`.
6. Speel de doorlopende preview af en verfijn desgewenst per frame.
7. Klik op `Knippunten opslaan`.

`Reset` verwijdert alleen de twee knippunten van de geselecteerde grens.

## Wat opslaan doet

Opslaan voegt `trimEnd` toe aan clip 1 en `trimStart` aan clip 2 in
`scripts/monkey-scenes.json`. De originele clips en de bestaande masterfilm
blijven ongewijzigd.

Pas na goedkeuring van de gekozen overgangen wordt de master opnieuw gebouwd:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/build-scroll-story.ps1
```

De editor start zelf nooit een langdurige video-encode.
