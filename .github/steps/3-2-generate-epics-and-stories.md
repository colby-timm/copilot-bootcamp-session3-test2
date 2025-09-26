# Step 3-2: Generate Epics and Stories

## Goal

Create a single markdown file `docs/epics-and-stories.md` that translates the confirmed PRD into MVP and Post-MVP epics with their user stories, each enriched with acceptance criteria and technical requirements. This prepares structured, implementation-ready work before moving items into an issue tracking platform.

## Instructions

### :keyboard: Activity: Ask Copilot to create epics and stories

1. Open the **Copilot** chat panel and switch to **Agent** mode using the dropdown menu.
1. Switch the model to `GPT-5`.
1. In the Copilot chat input field, ask Copilot to create a new file at `docs/epics-and-stories.md` that break down the MVP and Post-MVP as epics with stories titles (exclude acceptance criteria and technical details) based on the requirements in `prd-todo.md` based on the template `epic-and-stories-template.md`. The exact wording is up to you-just make sure your intent is clear!
1. Ask Copilot to define all the acceptance criteria based on `prd-todo.md` and add it to the stories defined in `docs/epics-and-stories.md`.
1. Since Copilot has context of your codebase, ask Copilot to update `docs/epics-and-stories.md` with technical requirements based on the current frontend and backend code.

## Success Criteria

- `docs/epics-and-stories.md` exists and contains the epics and stories with technical requirements and acceptance criteria.

If you encounter any issues, you can

- Review that `docs/epics-and-stories.md` was created and updated with the epics and stories
- Double-check that your changes were pushed to the `feature/requirements-and-documentation` branch
- Ask Copilot to fix specific problems

## Why?

Documenting epics and stories beforehand in a markdown file can help you refine the overall PRD scope and define the acceptance criteria and technical requirements before you are ready to push them into an issue tracking platform.
