/**
 * Engineering lifecycle used on the homepage (interactive) and service pages. A real sequence.
 * `does` = what KrisLynx does at this stage; `tools` = only technologies/methods listed in technology.ts
 * or plain working methods — nothing the company does not use.
 */
export const lifecycle = [
  { key: "discover", name: "Discover", body: "Find the problem worth solving.", does: "Sit with the people who do the work and review the tools and data they use today.", tools: ["User interviews", "Workflow mapping", "Data inventory"], output: "Problem brief" },
  { key: "model", name: "Model", body: "Describe the work as data and rules.", does: "Map entities, states and permissions, and agree the first release and how success is measured.", tools: ["Data model", "Roles & permissions", "Success measures"], output: "Scoped model" },
  { key: "architect", name: "Architect", body: "Decide how the system fits together.", does: "Choose the architecture, write down the decisions and prototype the screens people will use.", tools: ["Architecture decision records", "Interface prototypes"], output: "Architecture + prototype" },
  { key: "engineer", name: "Engineer", body: "Build in short, reviewable increments.", does: "Ship working software every one to two weeks, with code review on every change.", tools: ["TypeScript", "React", "Python", "Flask", "PostgreSQL", "Firestore"], output: "Working increments" },
  { key: "integrate", name: "Integrate", body: "Connect to the systems already in use.", does: "Wire in existing data, imports and external services, and the AI layer where it earns its place.", tools: ["REST APIs", "CSV & PDF pipelines", "Anthropic Claude & LLM APIs"], output: "Connected system" },
  { key: "test", name: "Test", body: "Prove it works before people rely on it.", does: "Automated tests, role-by-role checks and a pilot with real users on real workflows.", tools: ["Automated tests", "Role-based access control", "Pilot release"], output: "Release candidate" },
  { key: "deploy", name: "Deploy", body: "Release to secure, monitored infrastructure.", does: "Automate releases and switch on audit logging and monitoring before go-live.", tools: ["Google Cloud / Firebase", "Render", "GitHub Actions CI/CD"], output: "Production release" },
  { key: "operate", name: "Operate", body: "Run it, measure it, improve it.", does: "Watch real usage, fix friction first, and plan the next release from evidence.", tools: ["Operational dashboards", "Audit logging", "Release notes"], output: "Next-release backlog" },
] as const;
