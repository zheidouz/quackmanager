# QuackManager — AI Development Workflows

> Generated from [github/awesome-copilot](https://github.com/github/awesome-copilot)

This document describes the complete set of workflows enabled by the downloaded agents, instructions, and skills for building the **QuackManager** duck farm management PWA.

---

## 📁 Repository Structure

```
.github/prompts/
├── WORKFLOW_INSTRUCTIONS.md       # This file
├── copilot-instructions.md        # Project-level Copilot instructions
├── agents/                        # GitHub Copilot Custom Agents
│   ├── expert-react-frontend-engineer.agent.md
│   ├── project-architecture-planner.agent.md
│   ├── devops-expert.agent.md
│   ├── github-actions-expert.agent.md
│   ├── se-ux-ui-designer.agent.md
│   ├── se-product-manager-advisor.agent.md
│   ├── playwright-tester.agent.md
│   ├── qa-subagent.agent.md
│   ├── se-security-reviewer.agent.md
│   ├── se-technical-writer.agent.md
│   ├── se-system-architecture-reviewer.agent.md
│   ├── accessibility.agent.md
│   ├── debug.agent.md
│   ├── doublecheck.agent.md
│   ├── implementation-plan.agent.md
│   ├── specification.agent.md
│   ├── prd.agent.md
│   └── code-tour.agent.md
├── instructions/                  # Copilot Instructions (file-pattern applied)
│   ├── a11y.instructions.md
│   ├── agents.instructions.md
│   ├── agent-skills.instructions.md
│   ├── code-review-generic.instructions.md
│   ├── devops-core-principles.instructions.md
│   ├── github-actions-ci-cd-best-practices.instructions.md
│   ├── nodejs-javascript-vitest.instructions.md
│   ├── playwright-typescript.instructions.md
│   ├── prompt.instructions.md
│   ├── qa-engineering-best-practices.instructions.md
│   ├── security-and-owasp.instructions.md
│   ├── tailwind-v4-vite.instructions.md
│   └── task-implementation.instructions.md
└── skills/                        # Copilot Skills (self-contained bundles)
    ├── boost-prompt/SKILL.md
    ├── conventional-commit/SKILL.md
    ├── documentation-writer/SKILL.md
    └── doublecheck/SKILL.md
```

---

## 🚀 Enabling These Workflows in VS Code

To activate these agents and instructions in VS Code:

1. **Agents**: Agents from `awesome-copilot` are registered via the marketplace in Copilot CLI/VS Code. Install them with:
   ```
   copilot agent install <agent-name>@awesome-copilot
   ```
   Or reference the `.agent.md` file from the `agents/` directory.

2. **Instructions**: Reference them in `.github/copilot-instructions.md` or via the VS Code prompts folder at:
   `%APPDATA%\Code\User\prompts\`
   The files in `instructions/` can be referenced by agents via the `@` mention syntax.

3. **Skills**: Skills are self-contained directories with a `SKILL.md` entry point. Each skill bundles all assets needed for the agent to use them.

---

## 🎯 Workflow Catalog

### Workflow 1: Product Planning & Requirements

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 1.1 | `prd.agent.md` | Generate a comprehensive Product Requirements Document (PRD) |
| 1.2 | `se-product-manager-advisor.agent.md` | Create GitHub issues with business context, user stories, acceptance criteria |
| 1.3 | `project-architecture-planner.agent.md` | Design system architecture, evaluate tech stack, create scalability roadmap |
| 1.4 | `specification.agent.md` | Generate machine-readable specifications for implementation |

**How to use in QuackManager:**
- Start with `prd.agent.md` to formalize MVP requirements (egg tracking, sales, expenses)
- Use `se-product-manager-advisor.agent.md` to break MVP into GitHub issues with labels
- Use `project-architecture-planner.agent.md` to validate the React + Firebase architecture
- Generate detailed specs with `specification.agent.md` for each feature module

---

### Workflow 2: UI/UX Design

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 2.1 | `se-ux-ui-designer.agent.md` | Jobs-to-be-Done analysis, user journey mapping |
| 2.2 | `accessibility.agent.md` | WCAG 2.1/2.2 compliance, accessibility-first design |
| 2.3 | `a11y.instructions.md` | Detailed accessibility guidelines for implementation |

**How to use in QuackManager:**
- Use `se-ux-ui-designer.agent.md` for JTBD analysis on farm worker workflows
- Generate user journey maps for daily farm operations (egg collection, feed tracking)
- Apply accessibility checks from `accessibility.agent.md` (large touch targets, simple forms)

---

### Workflow 3: Frontend Development

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 3.1 | `expert-react-frontend-engineer.agent.md` | React component architecture, hooks, state management |
| 3.2 | `tailwind-v4-vite.instructions.md` | Tailwind CSS with Vite configuration |
| 3.3 | `implementation-plan.agent.md` | Structured implementation plans for features |
| 3.4 | `code-tour.agent.md` | VS Code CodeTour walkthroughs for onboarding |

**How to use in QuackManager:**
- Use `expert-react-frontend-engineer.agent.md` to build forms, lists, and dashboard components
- Follow `implementation-plan.agent.md` for Sprint-based feature delivery
- Create CodeTours with `code-tour.agent.md` for onboarding new contributors
- Reference `tailwind-v4-vite.instructions.md` for Tailwind configuration

---

### Workflow 4: Backend & Firebase

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 4.1 | `se-system-architecture-reviewer.agent.md` | Firestore schema design, security rules validation |
| 4.2 | `se-security-reviewer.agent.md` | OWASP Top 10 review, Firebase security rules |
| 4.3 | `security-and-owasp.instructions.md` | Security best practices for authentication and data |

**How to use in QuackManager:**
- Validate Firestore schema with `se-system-architecture-reviewer.agent.md`
- Review Firebase Security Rules with `se-security-reviewer.agent.md`
- Ensure Google Sign-In and Firestore security with `security-and-owasp.instructions.md`

---

### Workflow 5: Testing & QA

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 5.1 | `qa-subagent.agent.md` | Comprehensive test planning, edge case analysis |
| 5.2 | `playwright-tester.agent.md` | E2E test creation with Playwright |
| 5.3 | `nodejs-javascript-vitest.instructions.md` | Vitest configuration and best practices |
| 5.4 | `playwright-typescript.instructions.md` | Playwright TypeScript setup |
| 5.5 | `qa-engineering-best-practices.instructions.md` | QA methodology and test strategy |

**How to use in QuackManager:**
- Use `qa-subagent.agent.md` to plan tests for each Sprint
- Create E2E tests with `playwright-tester.agent.md` (offline sync, PWA install, data entry)
- Follow `nodejs-javascript-vitest.instructions.md` for unit test setup
- Apply QA best practices from `qa-engineering-best-practices.instructions.md`

---

### Workflow 6: DevOps & CI/CD

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 6.1 | `devops-expert.agent.md` | Complete DevOps lifecycle (Plan → Code → Build → Test → Release → Deploy → Operate → Monitor) |
| 6.2 | `github-actions-expert.agent.md` | Secure CI/CD workflow design |
| 6.3 | `github-actions-ci-cd-best-practices.instructions.md` | GitHub Actions security and optimization |
| 6.4 | `devops-core-principles.instructions.md` | Core DevOps principles and practices |

**How to use in QuackManager:**
- Use `github-actions-expert.agent.md` to create the deploy workflow (tsc → vitest → eslint → build → Firebase deploy)
- Follow `devops-expert.agent.md` for the infinity loop approach
- Implement security scanning per `github-actions-ci-cd-best-practices.instructions.md`

---

### Workflow 7: Debugging & Verification

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 7.1 | `debug.agent.md` | Systematic bug investigation and resolution |
| 7.2 | `doublecheck.agent.md` | Three-layer verification of AI-generated output |
| 7.3 | `doublecheck/SKILL.md` | Detailed verification pipeline skill |

**How to use in QuackManager:**
- Use `debug.agent.md` for systematic debugging of sync engine or form issues
- Use `doublecheck.agent.md` + `doublecheck/SKILL.md` to verify AI-generated code

---

### Workflow 8: Documentation & Onboarding

| Step | Agent / Instruction | Description |
|------|-------------------|-------------|
| 8.1 | `se-technical-writer.agent.md` | Technical documentation, blog posts, ADRs |
| 8.2 | `code-tour.agent.md` | Interactive code walkthroughs for new developers |
| 8.3 | `documentation-writer/SKILL.md` | Documentation writing skill |
| 8.4 | `prompt.instructions.md` | Prompt engineering best practices |
| 8.5 | `code-review-generic.instructions.md` | Code review guidelines |

**How to use in QuackManager:**
- Write ADRs (Architecture Decision Records) with `se-technical-writer.agent.md`
- Create CodeTours with `code-tour.agent.md` for onboarding

---

## 🔄 Suggested Development Sprints

### Sprint 1: Foundation
**Workflows**: 1 (Planning) → 3.1 (React setup) → 6 (CI/CD)
- Use `project-architecture-planner.agent.md` to validate architecture
- Use `expert-react-frontend-engineer.agent.md` for Vite + React + Tailwind setup
- Use `github-actions-expert.agent.md` for CI/CD pipeline

### Sprint 2: Core Production Tracking
**Workflows**: 2 (UI/UX) → 3 (Frontend) → 5 (Testing)
- Use `se-ux-ui-designer.agent.md` for egg collection UX
- Use `qa-subagent.agent.md` for test planning

### Sprint 3: Sales, Feed & Expenses
**Workflows**: 2 → 3 → 4 (Backend) → 5
- Use `se-security-reviewer.agent.md` for Firestore rules

### Sprint 4: Sync & Offline
**Workflows**: 4 (Backend) → 5 (Testing) → 7 (Debugging)
- Use `debug.agent.md` for sync engine debugging

### Sprint 5: Reports & Dashboard
**Workflows**: 1 → 2 → 3

### Sprint 6: Testing, Docs & Deploy
**Workflows**: 5 → 6 → 7 → 8
- Use `playwright-tester.agent.md` for final E2E tests
- Use `se-technical-writer.agent.md` for documentation

---

## 📋 Quick Reference: VS Code Install Commands

```bash
# Install agents from awesome-copilot marketplace
copilot agent install expert-react-frontend-engineer@awesome-copilot
copilot agent install playwright-tester@awesome-copilot
copilot agent install github-actions-expert@awesome-copilot
copilot agent install devops-expert@awesome-copilot

# Reference local agents (from .github/prompts/agents/)
# Reference: .github/prompts/agents/expert-react-frontend-engineer.agent.md
```

---

## 💡 Recommendations for Effective Project Management

1. **Start each coding session** by reading `project_design.md` to maintain context
2. **Use agents in sequence** — follow the workflow tables above for each sprint
3. **Leverage `implementation-plan.agent.md`** before starting any feature to ensure all steps are clear
4. **Run `qa-subagent.agent.md`** after each feature implementation to catch edge cases
5. **Use `doublecheck.agent.md`** to verify any complex AI-generated code before committing
6. **Commit with Conventional Commits** using `conventional-commit/SKILL.md`
7. **Create CodeTours** with `code-tour.agent.md` for complex modules (sync engine, P&L calculations)
8. **Document decisions** with ADRs using `se-technical-writer.agent.md`
9. **End each sprint** with a code review pass using `code-review-generic.instructions.md`
10. **Keep prompts updated** as the codebase evolves — regenerate instructions when architecture changes

---

> Generated by Meta Agentic Project Scaffold from [github/awesome-copilot](https://github.com/github/awesome-copilot)
