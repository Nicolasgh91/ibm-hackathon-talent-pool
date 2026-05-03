# Project pitch — Talent Pool

## Written problem and solution statement

**500 word description** Including the specific scenario or challenge that your solution is designed to address.

### Talent Pool: connecting education with the job market and companies through AI
#### The challenge

Three groups suffer from the same disconnect, but no one solves it together. Technical instructors spend 15+ hours per term writing and grading practice exercises that repeat year after year, with inconsistent grading across students. Students consult AI individually, repeating questions classmates already asked, missing collaborative learning. Recruiters filter hundreds of CVs without verifiable proof of skill, then run expensive technical interviews that don't reflect the company's real workflows. Companies pay 3–6 weeks of induction before junior hires produce value, with high early turnover from candidates who looked good in interviews but couldn't operate in real workflows.

#### Existing gaps

Existing platforms solve only one piece. HackerRank evaluates candidates but ignores academic context. Moodle manages courses but doesn't connect to the market. ChatGPT helps students individually but creates no shared knowledge base.

#### Our approach

Talent Pool unifies the three worlds in one SaaS platform. The same assessment a student solves in class can become, with consent, a verified credential visible to recruiters. Teaching becomes pre-screening without extra effort.

#### Three innovations

1. **Collaborative LLM repository with semantic RAG.** Student questions are public by default and grouped by syllabus units. Embeddings on pgvector enable semantic retrieval: if a 95%-similar answer exists, the cached response is reused. Knowledge accumulates as a course-specific RAG base growing with every cohort, reducing LLM costs and improving learning consistency.

2. **Agent-driven multi-challenge evaluation plans.** A specialized agent on watsonx.ai composes plans of 3–5 challenges using tools that search prior challenges, validate skill coverage, and generate per-dimension content. RAG over calibrated rubrics improves scoring consistency.

3. **Practice roadmap with planner agent.** A second agent generates 6–10 sequential modules with validated prerequisites, retrieving canonical tutorials via RAG. Candidates practice the real workflow before applying, reducing induction time 30–50%.

#### Value for IBM and scalability

Talent Pool runs natively on watsonx.ai foundation models, Granite embeddings, and IBM Cloud Code Engine. Each enrolled institution and company multiplies watsonx.ai consumption with predictable, recurring workloads. Architecture is multi-tenant from day one: institutions onboard with one course, companies with one role — no complex setup, no integration project. Designed to scale from one university to nationwide systems and from a single SMB to enterprise rollouts. The platform showcases watsonx.ai as the orchestration layer for educational and recruitment AI, opening a B2B SaaS market where IBM has technical credibility but limited consumer presence.

#### Target users

Six interconnected groups: educational institutions, companies, recruiters, students, teachers, and candidates. Institutions and companies are paying clients; teachers and recruiters are operational users; students and candidates are the talent flowing between both worlds without paying. Onboarding is single-tenant simple, adoption requires no IT integration.

#### Why innovative

No platform connects formation and recruitment as a single product flow. We turn classroom work into hireable evidence and hiring processes into structured practice opportunities, while building IBM's enterprise AI footprint into education and HR.

---

## Written statement on technology

**Clear and specific details** on how and where the team used Bob. If applicable, also describe how your project uses IBM watsonx.ai or watsonx Orchestrate.

### IBM technology integration

Beyond Bob itself, the project integrates the following IBM technologies:

- **IBM Cloud** — Terraform provider configured with `API_IBM_CLOUD` for provisioning cloud database and networking infrastructure.

- **IBM watsonx** — LangChain4j's ChatAssistant interface and application configuration are designed to point at a watsonx.ai model endpoint. The mock services (`MockChallengeGenerator`, `MockEvaluator`) are explicit stand-ins that can be replaced with a single configuration change.

- **IBM Cloud Databases (PostgreSQL + pgvector)** — Dev environment containers mirror the target IBM Cloud DB configuration for seamless promotion to production.

### Roadmap: further Bob sessions and IBM technology

#### Complete the hackathon MVP — 1–2 sessions

The seven remaining REST endpoints, CORS configuration, OpenAPI docs, and full integration test suite can be finished in one or two more Bob sessions, delivering a fully demonstrable application.

#### Replace mocks with real watsonx LLM calls — 1 session

`MockChallengeGenerator` and `MockEvaluator` are drop-in replacements. Pointing LangChain4j at a watsonx.ai endpoint and swapping the mock beans yields a production-quality AI-powered hiring workflow with no architectural changes.

#### Full IBM Cloud deployment — 2–3 sessions

With IBM Cloud credentials, Bob can extend `database/main.tf` to provision IBM Cloud Databases for PostgreSQL, IBM Container Registry, and IBM Code Engine or Kubernetes Service. The Terraform scaffolding and `.tfvars` pattern are already in place.

#### watsonx.governance integration — 1 session

Bob can instrument the existing LangChain4j layer and `chat-eval-dataset.yaml` to report LLM quality metrics, bias indicators, and explainability traces to watsonx.governance — enabling compliant AI deployment for regulated HR use cases.

#### Frontend implementation — 3–5 sessions

The architecture specifies a React + TypeScript + Vite SPA. Bob can scaffold and implement the full frontend (recruiter dashboard, candidate challenge interface, evaluation results view) against the REST API contracts already defined.

#### CI/CD pipeline on IBM Cloud — 1 session

The `.github/` workflow scaffolding is in place. Bob can complete the pipeline targeting IBM Code Engine or Kubernetes Service: automated Flyway migrations, container builds pushed to IBM Container Registry, and Quarkus native-image compilation.

#### Expanded AI features via LangChain4j + watsonx

With watsonx model access, Bob can implement:

- Semantic candidate matching using pgvector + watsonx embedding models
- Rubric-aligned challenge evaluation replacing the current heuristic mock
- Natural-language query interface over the talent database
- Personalized challenge generation adapted to candidate skill profiles

### How Bob was used (summary)

IBM Bob was used as the primary engineering agent for the Talent Pool hackathon project. In two days it authored the complete product documentation set and built a near-complete Quarkus backend — authentication, LangChain4j AI integration, Redis rate limiting, a 13-migration database schema covering 20 tables, and realistic mock LLM services. Bob's defining strength was its ability to absorb large context (multiple product documents, schema files, prior code) and produce coherent, production-aligned deliverables without line-by-line human guidance.

The project is positioned to transition from hackathon demo to production-ready application with 5–8 additional Bob sessions and access to watsonx.ai endpoints and IBM Cloud infrastructure credentials. The architectural groundwork — LangChain4j abstraction layer, mock/real swap pattern, Terraform scaffolding, Flyway migrations, Quarkus profile separation — was deliberately laid to make that transition as low-friction as possible.
