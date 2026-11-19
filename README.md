# SAT Math Practice

A static web app for practicing Digital SAT Math questions across the four official domains:

- Algebra
- Advanced Math
- Problem-Solving and Data Analysis
- Geometry and Trigonometry

Features:
- Multiple-choice and student-produced response (typed numeric) questions
- Proper math rendering with KaTeX
- Domain-specific or mixed practice sessions
- Immediate feedback with explanations
- Progress saved in the browser

## Question Bank

Starter bank of ~620 questions (150–160 per domain) is included in `questions/`.  
You can expand it by adding more entries to the JSON files. Each question follows this structure:

```json
{
  "id": "unique-id",
  "domain": "algebra",
  "topic": "Linear equations",
  "question": "Solve for $x$: $2x + 3 = 11$.",
  "response": {
    "type": "spr",
    "answer": 4,
    "tolerance": 0.01
  },
  "explanation": "Subtract 3, then divide by 2."
}
```

For multiple choice, use `"type": "mc"` with `"choices": ["A", "B", "C", "D"]` and `"correct": 0` (0-based index).

## Deploy to GitHub Pages

1. Download or clone this folder.
2. Create a new GitHub repository (public).
3. Push the contents of this folder to the repository.
4. Go to **Settings → Pages**.
5. Set source to **Deploy from a branch**, choose `main` (or `master`) and `/ (root)`.
6. Save. Your site will be live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Local Testing

Open `index.html` in a browser (or use a simple local server if needed for fetch).

## Expanding the Bank

Edit or generate additional questions and place them in the appropriate JSON file under `questions/`. Then rebuild `all_questions.json` or update the app to load domain files individually.

---

Built for student practice. Math rendered with [KaTeX](https://katex.org/).
