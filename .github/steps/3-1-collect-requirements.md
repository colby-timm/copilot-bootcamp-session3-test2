# Step 3-1: Collect Requirements

## Goal

Using requirements collected from transcription notes and Slack messages, create a PRD to highlight work that needs to be done during `MVP` and `Post-MVP` for the TODO app. The PRD will also highlight out-of-scope items.

## Instructions

### :keyboard: Activity: Launch a Codespace for this repository and create a new branch

Click the below button to open the **Create Codespace** page in a new tab. Use the default configuration.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

:pencil2: Create a new branch called `feature/requirements-and-documentation`. :pencil2:

#### :keyboard: Activity: Ask Copilot to create a PRD

1. Open the **Copilot** chat panel and switch to **Agent** mode using the dropdown menu.
1. Switch the model to `GPT-5`.
1. Copilot chat allows you to tag files in your repo by typing `#` followed by the name of the file, which will show an auto-complete for your files.
1. In the Copilot chat input field, ask copilot to `summarize the MVP and Post-MVP requirements using #file:09162025-requirements-meeting.vtt and #file:09172025-slack-conversation-export.txt`.
1. Note how the agent is able to generate all MVP, Post-MVP and out-of-scope requirements.
1. Ask Copilot to create the PRD based on the requirements. An example is: `create a PRD using the PRD template in #file:prd-template.md based on the requirements defined in #file:09162025-requirements-meeting.vtt and #file:09172025-slack-conversation-export.txt and store it in docs/prd-todo.md. Do not make assumptions about the requirements.`.

#### Success Criteria

To complete this exercise successfully, ensure that:

- A new `feature/requirements-and-documentation` branch is pushed
- `docs/prd-todo.md` exists and contains the specified requirements.

If you encounter any issues, you can:

- Double check that the newly pushed branch is called `feature/requirements-and-documentation`
- Review that `docs/prd-todo.md` was created
- Ask Copilot to fix specific problems

## Why?

Using Copilot to help you extract requirements from meeting conversations and Slack conversations allows you to create clear, structured PRD documentation that you can then decompose into epics and user stories.
