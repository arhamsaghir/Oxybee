# Figma → Code setup

## What's wired up

**MCP server:** `Figma` (Framelink `figma-developer-mcp`) is now **enabled** in your
ZCode config (`~/.zcode/cli/config.json`). It talks to the Figma REST API using a
personal access token that is already stored in that config and validated against
your account (`Arham Saghir`). It works on any Figma plan and needs no desktop app.

**Target project:** React 19 + Vite + TypeScript + Tailwind CSS v4, scaffolded in
this folder. Generated components land in `src/`.

## One thing you must do: restart ZCode

MCP servers load at startup, so the `Figma` tools won't appear until you **restart
ZCode**. After restarting, you'll have Figma tools available (e.g. fetch a node's
layout/styles, download referenced images).

## How to convert a design

1. In Figma, select a frame/component → right-click → **Copy link to selection**
   (or copy the URL from the address bar). The link contains the `file key` and a
   `node-id`.
2. Paste it here and say what you want, e.g.
   *"Build this as a React + Tailwind component: &lt;link&gt;"*.
3. I pull the node's structure, styles, and tokens via the Figma MCP and generate
   the component into `src/`, then run the build to verify.

## Run the app

```bash
npm run dev     # dev server with HMR
npm run build   # typecheck + production build
```

## Higher-fidelity option (optional, later)

Figma's **official Dev Mode MCP server** gives better fidelity (reads your live
selection, variables, Code Connect). It requires the **Figma desktop app** (not
installed here) and a Dev/Full seat, then: desktop app → Preferences → *Enable Dev
Mode MCP Server* (serves `http://127.0.0.1:3845/mcp`). Say the word and I'll add it
alongside the current setup.

## Security note

The Figma token is stored in plaintext in `~/.zcode/cli/config.json`. That predates
this setup; if you'd rather not keep a token on disk, rotate it in Figma
(Settings → Security → Personal access tokens) and we can switch to the official
Dev Mode server instead.
