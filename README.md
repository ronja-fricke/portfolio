# Portfolio Ronja Fricke

Statische Website (HTML, CSS, JavaScript) für GitHub Pages unter `https://ronja-fricke.github.io/portfolio/`. Es gibt keinen Build-Schritt.

## Aufbau

- `index.html`: alle Inhalte und Texte
- `assets/css/style.css`: Gestaltung mit Farben, Schriften und Layout. Die Farben stehen oben unter `:root`.
- `assets/js/main.js`: Einstieg, Kapitel-Anzeige, Lupen, Szenen, Einblenden und Video
- `assets/img/`: optimierte Bilder (WebP)
- `assets/fonts/`: Schriften Bricolage Grotesque, Instrument Sans und Caveat (alle unter SIL Open Font License)
- `videos/`: Website-Durchgänge
- `images/`: Originaldateien. Sie werden nur noch teilweise eingebunden.

## Texte ändern

Ändere den Text direkt in `index.html`. Die Abschnitte haben die IDs `start`, `arbeiten`, `synatix`, `yadore`, `web`, `weitere`, `koennen`, `ueber-mich` und `kontakt`. Diese IDs funktionieren auch als Direktlink, zum Beispiel `…/portfolio/#yadore`.

## Bild austauschen

1. Exportiere das Bild als WebP, zum Beispiel aus Photoshop oder mit squoosh.app. Gute Breiten sind 560 und 900 px für Posts, 800 und 1400 px für breite Motive. Die Qualität sollte bei etwa 75–80 liegen.
2. Lege es in `assets/img/` ab.
3. Passe in `index.html` beim `<img>` `src`, `srcset`, `width` und `height` an und schreib einen Alt-Text, der beschreibt, was zu sehen ist.

## Weitere Arbeiten (Galerie)

Jedes Projekt ist ein `<article class="more__item">`. Jedes Bild darin ist ein Link auf die große Version (`href`) mit einer Bildunterschrift in `data-caption`. Mit JavaScript öffnet sich die Lightbox, ohne JavaScript das Bild direkt. Mit `class="more__wide"` belegt ein Bild die ganze Zeile.

## Einstieg: Motive fügen sich zusammen

Rechts neben der Überschrift liegen Arbeiten verstreut wie ausgedruckte Motive. Beim Scrollen ordnen sie sich zu einem sauberen Raster. Jede Kachel ist eine `<figure class="tile">` in `.hero__board`:
- `--l`, `--t`, `--w` und `--h`: Position und Größe im fertigen Raster. Die Fläche ist 100 breit und 92 hoch.
- `--sx`, `--sy` und `--sr`: Wie weit die Kachel am Anfang verschoben und gedreht ist.

Ohne JavaScript und bei reduzierter Bewegung ist das Raster sofort fertig.

## Kapitel-Anzeige

Unten links zeigt eine kleine Leiste, in welchem Kapitel man gerade ist, und den Fortschritt durch die Seite. Sie erscheint nur beim Scrollen und blendet sich danach wieder aus, damit sie keinen Text verdeckt. Sie liest das Attribut `data-chapter` der Abschnitte. Im Werdegang übernimmt dessen eigene Statusleiste.

## Zeugnisse

Der Abschnitt `#zeugnisse` zeigt Arbeitszeugnis, Prüfungszeugnis, IHK-Urkunde und Ausbildungszeugnis. Die Bilder liegen in `assets/img/zeugnis-*` als Vorschau (`-380`) und groß (`-gross`). Das Geburtsdatum ist darin geschwärzt. Mehrseitige Zeugnisse haben einen zusätzlichen Link „Seite 2“. Alle Seiten lassen sich in der Lightbox mit den Pfeiltasten durchblättern.

## Lupe einstellen

Die Werte stehen im `style`-Attribut von `.zoom__media`:
- `--px` und `--py`: Bildstelle, die vergrößert wird (0 bis 1, von links und von oben)
- `--z`: Vergrößerungsfaktor
- `--lx` und `--ly`: Position der Lupe. `--lx-m` und `--ly-m` gelten fürs Smartphone.
- `--ar`: Höhe geteilt durch Breite des Bildes

## Aufbau als Geschichte

Die Seite erzählt in Kapiteln:
- **Einstieg** `#start`: Motive fügen sich zusammen
- **Kapitel 1** `#werdegang`: 3D-Flug durch die Stationen
- **Kapitel 2** `#arbeiten`: Projekte
- **Epilog** `#ueber-mich`

Die bewegten Szenen hängen am Scrollfortschritt (`assets/js/main.js`, Abschnitt „Szenen“): `.hero`, `.journey`, `.portal`, `.hscroll`, `.layers`, `.burst` und `.dolly`. Bei reduzierter Bewegung, auf dem Smartphone (die Seitwärtsstrecken) und ohne JavaScript erscheinen alle Inhalte als normale Seite.

## Werdegang pflegen

Jede Station ist ein `<li class="stage">` in `#werdegang`. `data-title` und `data-year` erscheinen in der Statusleiste. Sobald die Angaben vollständig sind, entfernst du das `<span class="todo">`.

## Lokal ansehen

In einem Terminal im Projektordner ausführen:

    node .claude/serve.mjs

Danach `http://127.0.0.1:8765/portfolio/` öffnen. Die Seite läuft dort unter demselben Pfad wie auf GitHub Pages.

## Veröffentlichen

    git add -A
    git commit -m "Beschreibung"
    git push

GitHub Pages veröffentlicht den Stand nach ein bis zwei Minuten.

## Datenschutz

Die Seite steht auf `noindex`, Suchmaschinen nehmen sie also nicht auf. Wer den Link kennt, kann sie aber öffnen. Die früher veröffentlichten Zeugnisse sind aus dem aktuellen Stand entfernt. In der Git-Historie bleiben sie sichtbar, solange die Historie nicht bereinigt wird.
