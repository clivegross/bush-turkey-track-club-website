# Bush Turkey Track Club website

The website for the [Bush Turkey Track Club](https://www.bushturkey.club/), a performance-focused amateur
distance running club in Brisbane, Australia.

Built with [Astro](https://astro.build) and Tailwind CSS, hosted on GitHub Pages.

## Develop

Requires Node.js 22.12 or later.

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # validate content and types
npm run build    # build to dist/
npm run preview  # serve the production build
```

## Updating content

Events, results, records and members are content files, not code. See [AGENTS.md](AGENTS.md) for how to
make each kind of update (it's written for coding agents but works just as well for people).

- Events: `src/content/events/<slug>/index.md`
- Records: `src/data/performances.yaml`
- Members: `src/data/members.yaml`

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub
Pages. You can also run it manually from the Actions tab. Pull requests run `npm run check` and
`npm run build` via `.github/workflows/check.yml`.

## Credits

The previous (pre-Astro) version of the site used the Story template by [HTML5 UP](https://html5up.net) under
the CCA 3.0 licence. It is in the git history before the Astro conversion.
