# OneHope Africa Operations Conference 2026 — Knowledge Check

A mobile-first quiz game (English / French) built from each day's session transcripts.
Static HTML, CSS and JavaScript only, so it runs on GitHub Pages with no build step.

## How the game works

- Player picks a language, types their name and chooses a day.
- 10 questions, order shuffled, answer order shuffled.
- Each question: 2 seconds to read (answers appear after 1 second but stay locked),
  then a 10,000 ms countdown. A correct answer scores the milliseconds remaining.
  Wrong or no answer scores 0. Maximum score is 100,000.
- Final screen shows name, score and a prompt to screenshot it for the WhatsApp group.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All three screens (start, quiz, final) |
| `style.css` | Layout and OneHope brand colours |
| `app.js` | Game engine, timer, scoring, UI strings in both languages |
| `days/day1.js` | Day 1 question bank (English + French) |

## Adding a new day

1. Copy `days/day1.js` to `days/day2.js`.
2. Change `id`, `label` and the `questions` array. Keep `correct` as the index of the
   right answer in `a` (the game shuffles answers itself).
3. Add `<script src="days/day2.js"></script>` under the "Question banks" comment in
   `index.html`, after the day1 line.

The newest day is selected by default on the start screen.

## Tuning

At the top of `app.js`: `READ_MS` (read time), `REVEAL_MS` (when answers appear),
`ANSWER_MS` (countdown length and max points per question), `QUESTIONS_PER_GAME`.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Day 1 quiz"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then in the repo: Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
The site appears at `https://<you>.github.io/<repo>/` within a minute or two.

## Local preview

```bash
python3 -m http.server 8765
```

Open http://localhost:8765 on your phone (same Wi-Fi, use the computer's IP) or in a browser
with device emulation.
