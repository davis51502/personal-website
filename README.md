# daviswollesen.click

Personal portfolio for **Davis Wollesen**, a software engineer and investment analyst. Live at [daviswollesen.click](https://daviswollesen.click).

## Features

- **About**: bio, skills, an experience & education timeline, and an in-page resume viewer with a PDF download
- **Projects**: live demos and source links, filterable by technology
- **Reviews**: Medium articles synced automatically at build time
- **Contact**: email (with copy button) and social links

## Stack

React 19 · React Router (hash routing) · Create React App · GitHub Pages

## Development

```bash
npm install
npm start        # dev server at http://localhost:3000
npm test         # run tests
npm run build    # sync Medium posts, then build to /build
```

## Editing content

| What | Where |
| --- | --- |
| Projects & social links | `src/data/projects.js` |
| Experience, education, certifications | `src/data/experience.js` |
| Bio & skills | `src/App.js` |
| Resume PDF | `public/(Resume Davis Wollesen).pdf` |

## Deployment

Every push to `main` triggers `.github/workflows/deploy-react-pages.yml`, which builds the site and deploys it to GitHub Pages. The workflow also runs hourly so new Medium posts show up without a code change.
