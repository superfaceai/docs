# Superface Documentation

The home of the official Superface documentation.

## Contribute to docs

1. ### Run the docs locally

- Clone the repo, then `yarn install` and `yarn start`

2. ### Update the content

- Make your desired changes to the documents inside
  [`/docs`](https://github.com/superfaceai/docs/tree/main/docs) directory<br />
  It uses a standard Markdown syntax, but can be extended with custom React components via MDX.

  <sup>[Help for Markdown features ➚](https://docusaurus.io/docs/markdown-features)</sup>

- Put your static content (e.g. images) to
  [`/static`](https://github.com/superfaceai/docs/tree/main/static) directory<br />
  When linking to it from the docs, just drop `/static` from path, e.g. rendering `/img/diagram.png`
  will render an image saved at `/static/img/diagram.png`.

  <sup>[Help for static assets ➚](https://docusaurus.io/docs/static-assets)</sup>

- Reference other docs via Markdown file path<br />
  Linking to another document is preferably done via specifying the relative path to that
  document (`./next-step.md`). Exceptions are pages placed in `src/pages/` directory that need
  to be linked using their respective routes.

  <sup>[Help for referencing docs ➚](https://docusaurus.io/docs/docs-markdown-features#referencing-other-documents)</sup>

3. ### Update the content structure _(optional)_

- **Page rename, new page, category; or change of structure**<br />
  If you added a whole new category, page or simply want to change the table of contents,
  you'll need to update [`sidebars.js`](https://github.com/superfaceai/docs/blob/main/sidebars.js).
  It uses document IDs that are simply a path to the file minus the extension (unless explicitly
  defined inside the document).

  <sup>[Help for Sidebar ➚](https://docusaurus.io/docs/sidebar)</sup>

- **Changing links in header navigation**<br />
  Navigation links are defined in [`docusaurus.config.js`](https://github.com/superfaceai/docs/blob/main/docusaurus.config.js)
  in `themeConfig.navbar.items` object.

  <sup>[Help for config ➚](https://docusaurus.io/docs/docusaurus.config.js)</sup>

4. ### Get the changes reviewed

- When you're happy with your changes, open a PR and get it reviewed by someone.<br />
  _Opening a PR will automatically deploy an online preview of your docs. It also verifies the build
  doesn't contain any broken links._

5. ### Deploy to production

- Once your changes are verified and reviewed by another pair of eyes, it is ready to be merged to `main`.<br />
  _Merging will automatically deploy `main` branch to production._


## Tech Stack

These docs are built using [Docusaurus 2](https://docusaurus.io/).

<details>
  <summary><strong>Details</strong></summary>

The site is deployed on [Vercel](https://vercel.com/).

All deployments are automated via GitHub Actions and you can keep track of them
in [the repository's environments](https://github.com/superfaceai/docs/deployments).

- Preview: gets deployed for each PR
- Production: gets deployed continuously from `main` branch

Each deploy first verifies the validity of the build.

If you'd like to build locally:

```bash
yarn build
```
</details>
<br />

## License

The Superface documentation is licensed under a [Creative Commons Attribution 4.0 International license](./LICENSE).
