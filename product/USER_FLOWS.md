# User flows — Talent Pool

> Reference document for team review and video demo script.
> Last updated: 2026-05-02

---

## Table of contents

1. [The problem we solve](#1-the-problem-we-solve)
2. [The three users and their pain points](#2-the-three-users-and-their-pain-points)
3. [Teacher flow](#3-teacher-flow)
4. [Student flow](#4-student-flow)
5. [Recruiter flow](#5-recruiter-flow)
6. [External candidate flow](#6-external-candidate-flow)
7. [Pre-role preparation: workflow simulator](#7-pre-role-preparation-workflow-simulator)
8. [The bridge: how the three worlds connect](#8-the-bridge-how-the-three-worlds-connect)
9. [Video demo script (5 minutes)](#9-video-demo-script-5-minutes)

---

## 1. The problem we solve

### 1.1 Reality today

There is a costly disconnect between **how technical people are trained** and **how they are hired**:

- **Teachers** spend hours drafting assignment prompts that repeat year after year, and grading submissions with inconsistent criteria.
- **Students** query AI in isolation. Each repeats the same questions classmates already asked. Knowledge is not built collectively.
- **Recruiters** filter résumés without certainty about real skills. Technical tests are expensive to build, slow to grade, and do not reflect the company’s real workflows.
- **Companies** discover too late that the candidate “interviewed well” but does not operate efficiently from day one. Early turnover costs weeks of wasted onboarding.

### 1.2 Our proposal

**One platform connecting three worlds**: AI generates and grades assignments in the classroom, knowledge is built collaboratively among students, and top students become pre-assessed candidates recruiters discover with real evidence of skill.

**One assessment, two audiences**: the challenge a student solves in class can be shown, with their consent, to recruiters. Training becomes pre-screening without extra effort.

---

## 2. The three users and their pain points

### 2.1 Pain map and solutions

| User | Main pain | How we solve it |
|------|-----------|-----------------|
| **Teacher** | Creating and grading assignments takes hours. Grading quality is uneven. | AI-generated challenges + automated grading with consistent rubrics + reusable challenge library. |
| **Teacher** | Hard to identify and promote top students toward the job market. | Recommendation system the student accepts and that appears on their profile for recruiters. |
| **Student** | Asks AI in isolation, repeats classmates’ questions, misses collaborative learning. | Collaborative course repository organized by syllabus, with smart cache showing similar questions before generating new ones. |
| **Student** | Has real technical skills but no simple way to prove them to employers. | Course assessments become validated skills on their public profile, including teacher feedback. |
| **Recruiter** | Building and grading technical tests is costly and slow. | Auto-generated custom challenges aligned to the role stack + automated grading with structured feedback. |
| **Recruiter** | Filtering résumés without evidence of real skill. | Pre-assessed talent pool where each candidate has verifiable scores and, optionally, teacher recommendations. |
| **Recruiter** | Process evaluates only technical skills. Soft skills (communication, autonomy, teamwork) are left to subjective interviews. | Explicit soft skills and tools used on the job. AI generates a **challenge plan** that covers technical **and** proposes situations that assess soft skills: documentation, code review, communicating decisions. |
| **Company** | Junior onboarding takes weeks because they do not master real workflows. | Challenges generated from real role descriptions, with code analysis beyond “compiles or not.” |
| **Company** | Gap between “candidate knows Java” and “candidate can operate in OUR Java flow with OUR tools.” | Recruiter defines the real stack (Spring Boot + GitLab + SonarQube + Datadog, for example). AI generates a **practice roadmap with an end-to-end workflow simulator** the candidate can complete BEFORE applying. |
| **Candidate** | Prepares generically for interviews without knowing which tools or workflows they will actually use. | Before applying, they see the role’s practice roadmap and can train on real workflow simulations (e.g. “open PR → pass lint → address code review → merge → see metrics on dashboard”). |

### 2.2 Why this is not “another assessment platform”

Existing products (HackerRank, Codility, Coderbyte) solve only the corporate side. Educational platforms (Moodle, Canvas) solve only the academic side. **None connects both**.

Talent Pool is the first platform where a challenge a student solves in class can become, with their consent, a credential visible to recruiters. Training becomes a natural bridge to the job market, without extra effort for the student.

---

## 3. Teacher flow

### 3.1 Pain we address

> “I lose between 10 and 15 hours per term just drafting assignment prompts. When grading, I cannot apply the same criterion to 30 students. Some are under-scored, others over-scored.”

### 3.2 Main flow: teaching a course with AI-assisted assignments

#### Step 1: Create the course (UC-012)

The teacher logs in, clicks “Create course,” and fills in:
- Name: “Algorithms II 2026 Q1”
- Syllabus with units (complexity analysis, linear structures, hash tables, etc.)
- Academic year and period

**Time spent**: 5 minutes.

#### Step 2: Enroll students (UC-013)

The teacher uploads a CSV with their 32 students’ emails, or shares an invite code each student uses to self-enroll.

**Time spent**: 2 minutes.

#### Step 3: Generate an assignment (UC-014)

When it is time for an assignment, the teacher opens the course, clicks “New assignment,” and describes the learning objective:

> “I want an assignment on linear data structures, intermediate level, requiring time complexity analysis.”

AI generates a full challenge in 15 seconds: written prompt, grading criteria, dimensions to score (logic, efficiency, style, practices). The teacher reviews the proposal, can regenerate with more specific instructions, or accept it.

**Pain we address**: what used to take 1–2 hours now takes 1–2 minutes. The assignment is saved in the teacher’s library to reuse in future terms with variations.

#### Step 4: Assign the assignment to the course

One click. The assignment appears automatically on all 32 students’ dashboards. No individual emails to send.

#### Step 5: Track course progress

As students submit, the teacher sees:
- Who submitted and who did not
- Score distribution (chart)
- Breakdown by dimension: is there a topic most of the class missed?
- Frequent questions in the course repository (hints for what to reinforce in the next class)

**Pain we address**: the teacher has real visibility into what the group is learning, not only each person’s individual grade.

#### Step 6: Recommend outstanding students (UC-015)

At the end of the course, the teacher identifies the 3–5 top students. For each, they write a short recommendation tied to the course, with a star rating and qualitative comments.

**Important**: the student gets a notification and must **accept and publish** the recommendation for it to be visible to recruiters. The teacher never exposes a student publicly without consent.

**Pain we address**: the teacher can boost their best students’ careers without writing formal letters one by one. Students enter the job market backed by instructors who know them.

### 3.3 Teacher use cases

| ID | Use case | Frequency |
|----|----------|-----------|
| UC-001/002 | Sign up and log in | Once + sessions |
| UC-004 | Create organization (institution) | Once |
| UC-012 | Create course | Per term |
| UC-013 | Enroll students in course | Once at start of term |
| UC-014 | Generate assignment with AI | 4–8 times per term |
| UC-008 | Confirm or regenerate proposed challenge | Each time they generate |
| UC-015 | Write recommendation for a student | 3–5 times per term |

---

## 4. Student flow

### 4.1 Pain we address

> “When I have a doubt, I ask ChatGPT. Then I find out three classmates asked the same thing. We repeat work and do not learn together. When I finish the course, all I have left is a grade, which tells a recruiter nothing about what I can do.”

### 4.2 Main flow: learn by solving assignments and collaborating on questions

#### Step 1: Accept invitation and enter the course

The teacher enrolled them. The student receives the email, logs in, and sees “Algorithms II 2026 Q1” on their dashboard.

#### Step 2: Complete the first assignment (UC-016 → UC-017 → UC-018)

The student opens the assigned assignment. They see the AI-generated prompt, open the code editor (Monaco, professional syntax highlighting, same engine as VS Code), and start writing their solution.

**Important features while solving**:
- **Autosave every 30 seconds**: if the internet drops, nothing is lost
- **Language selector**: Java, Python, JavaScript, etc.
- **Open book**: they can look up anything, including the course repository

On submit, they see “Evaluating your solution…” and in under 30 seconds receive structured feedback:
- Total score with visualization (circular gauge)
- Breakdown by dimensions: logic, efficiency, style, practices
- Text rationale for each dimension
- Strengths (what they did well)
- Areas to improve (what they can improve)
- Suggested optimized code with referenced lines

**Pain we address**: immediate, actionable, consistent feedback. The student learns far more than from “8/10 — nice work” from the teacher.

#### Step 3: Ask questions in the course repository (UC-021)

Here is **the product’s most differentiating innovation**.

The student is working on another assignment and has a question: “When should I use HashMap vs TreeMap in Java?” Instead of going to ChatGPT outside the platform, they open the **course repository**.

**The repository is organized by the course syllabus**, not a chronological timeline. The student sees a sidebar with the five course units and can filter questions by unit. Each unit shows how many questions it has.

When they click “Ask a new question,” **something unique happens**: as they type, the system searches for similar questions already answered in the course. If it finds one with high similarity, it shows:

> 💡 **We found 2 similar questions**
>
> Before generating a new answer, does any of these resolve your question?
>
> ⬆ 18 votes · “HashMap vs TreeMap: selection criteria” · 95% similarity  
> By: Tomás · 12 days ago

If an existing answer works, they mark “My question is resolved” and save an AI call. Otherwise they continue and generate a new question that feeds the repository.

**Pain we address**: course knowledge accumulates and is reused. Less duplication, faster group learning, lower AI cost by caching frequent questions. Each student learns from others’ questions.

#### Step 4: Comment and enrich questions

When the student views a repository question, they can:
- Vote “helpful” or “not helpful”
- Comment to complement the AI answer
- See teacher-pinned comments (highlighted with 🎓 badge)

**Real prototype example**: on a HashMap vs TreeMap question, the instructor pinned the comment “Pinning this because it covers frequent midterm doubts.” That adds pedagogical nuance only a teacher can provide.

#### Step 5: Build their technical profile (UC-019)

As the student completes assignments, scores accumulate on their **talent profile**. That profile is:

- **Visible to recruiters by default** (opt-out: the student can hide it anytime)
- **Validated skills**: each high-scoring assignment becomes a validated skill with evidence
- **Teacher recommendations**: when a teacher writes a recommendation and the student accepts it, it appears on their profile

#### Step 6: Get discovered by recruiters

Without applying anywhere or building a résumé, **the student appears in recruiter searches**. If recruiters like their profile, they reach out.

**Pain we address**: the student does not need a résumé or to apply to 30 companies. Their class work is already their best introduction. When contacted, recruiters already know their real level with verifiable evidence.

### 4.3 Student use cases

| ID | Use case | Frequency |
|----|----------|-----------|
| UC-001/002 | Sign up and log in | Once + sessions |
| UC-016 | Accept course invitation | Once per course |
| UC-017 | Complete assignment | 4–8 times per term |
| UC-018 | View grading feedback | Each submission |
| UC-021 | Query the LLM in course context | Often (several times per week) |
| UC-022 | Vote on helpful questions | Often |
| UC-019 | Manage visibility in talent pool | Occasional |
| UC-020 | Accept teacher recommendation | 1–3 times per course |

---

## 5. Recruiter flow

### 5.1 Pain we address

> “When I open a role, I get 200 résumés. I filter 30 by keywords. I run technical interviews with 10. I hire 1. Three weeks in, that person does not master our internal tools. Huge waste of time and onboarding costs are sky-high.”

### 5.2 Main flow: hire with real evidence of skill

#### Step 1: Define the role in depth (UC-006 extended)

The recruiter logs in and creates a role but does not stop at basics (title + technology). They define four dimensions of the expected profile:

**1. Basic role identity**
- Title: “Backend Java SSR”
- Primary technology: Java
- Seniority: SSR
- Role description

**2. Concrete tools the team uses day to day**
- Framework: Spring Boot 3
- Build: Maven
- Repo and PRs: GitLab
- CI/CD: GitLab CI
- Quality: SonarQube + Checkstyle
- Observability: Datadog + ELK
- Databases: PostgreSQL + Redis
- Team communication: Slack + Confluence + Jira

**3. Expected technical skills**
- REST API design
- Concurrency
- Testing (unit, integration, contract)
- SQL query optimization
- Design patterns and SOLID

**4. Expected soft skills**
- Clear communication in code reviews
- Autonomy to unblock themselves
- Documenting technical decisions
- Async work in a distributed team

**Time spent**: 5 minutes. More than a traditional job posting, but the recruiter does it once and AI uses every field.

> **Why this level of detail matters**: AI does not generate generic Java challenges. It generates challenges that reflect **how this team, at this company, in this role actually works**.

#### Step 2: Generate the challenge plan (UC-007 extended)

They click “Generate evaluation plan.” AI takes the role data and produces a **plan of 3 to 5 challenges** covering:

**Challenge 1: pure technical** (screening)
> “Implement a thread-safe LRU cache with get/put in O(1) and correct concurrency handling.”
> Skills assessed: logic, data structures, concurrency.

**Challenge 2: technical with real stack** (intermediate)
> “Given this JPA entity and this Spring Boot endpoint, identify and fix three performance issues. Justify each change.”
> Skills assessed: Spring Boot, SQL optimization, critical code reading.

**Challenge 3: technical communication** (soft skill)
> “Review this teammate’s pull request. Leave constructive comments in GitLab marking: 1) real bugs, 2) improvement suggestions, 3) decisions you would ask them to justify.”
> Skills assessed: code review, written communication, technical judgment.

**Challenge 4: documentation** (soft skill)
> “After challenge 2, write a short ADR (~300 words) explaining why you made the changes you made. Audience: your team, asynchronous.”
> Skills assessed: communicating decisions, written clarity.

Each challenge has its own **hidden rubric**, estimated time, and weight in the final score. The recruiter can accept the plan as-is, adjust weights, remove challenges that do not apply, or regenerate specific parts.

> **Pain we address**: what used to require hiring a technical consultant to design the test—or accepting generic tests that did not reflect the role—now takes minutes and aligns with the team’s real stack. Critically: **the plan assesses soft skills too**, not only “the candidate writes code.”

#### Step 3: Confirm or adjust the plan (UC-008)

The recruiter reviews the proposed plan. They can:
- Accept as-is
- Regenerate one challenge with extra instructions
- Adjust weights (e.g. communication 30%, not 20%)
- Remove inapplicable challenges (e.g. we do not need to assess communication because there is already a culture interview)

They accept when satisfied. The plan stays tied to the role and is reused for all invited candidates.

**Pain we address**: what used to require a technical consultant to build the test now takes minutes. Each challenge aligns with the real role stack.

#### Step 4: Invite candidates (UC-009)

They paste a list of 10 pre-screened candidate emails. The system generates unique tokenized links and sends email invitations. They set the time window (1 week) and max attempts (1).

**Time spent**: 1 minute to invite 10 candidates.

#### Step 5: View the ranking (UC-010)

As candidates complete challenges, the recruiter sees a dashboard with:
- Table of candidates sorted by score
- For each: name, total score, dimensional breakdown, time spent
- Filters: minimum score, specific dimension
- **Top 3 with medals** 🥇🥈🥉

**Pain we address**: objective comparison with the same criteria for everyone. No interviewer bias, no subjective “gut feel.”

#### Step 6: View evaluation detail (UC-011)

They click the #1 candidate. They see:
- Submitted code with syntax highlighting
- Full AI feedback report
- Detailed rationale per dimension
- **If the candidate has teacher recommendations they agreed to publish**: shown with instructor name and course
- “Contact candidate” button

**Pain we address**: the recruiter does not hire blind. They see real code, grading criteria, and optionally feedback from instructors who already know the candidate.

#### Step 7: Search the talent pool (future, phase 2)

Beyond inviting candidates to one-off challenges, the recruiter can search the general **talent pool**: pre-assessed candidates with specific skills. Filter by technology, seniority, location, and see profiles with validated skill evidence.

**Pain we address**: proactive talent discovery. No dependency on the candidate seeing the posting and applying.

### 5.3 Recruiter use cases

| ID | Use case | Frequency |
|----|----------|-----------|
| UC-001/002 | Sign up and log in | Once + sessions |
| UC-004 | Create organization (company) | Once |
| **UC-006** | **Create role with stack, tools, technical and soft skills** | Per search |
| **UC-007** | **Generate AI challenge plan (not a single challenge)** | Per search |
| UC-008 | Confirm or regenerate evaluation plan | Each time they generate |
| UC-009 | Invite candidates | Per search |
| UC-010 | View ranking | Daily during active search |
| UC-011 | View evaluation detail | For finalists |
| **UC-NUEVO** | **View candidates’ practice roadmap progress** | To gauge interest |

> **Note**: UC-006 and UC-007 are extended vs. the original `PRODUCT.md`. The roadmap UC is new. Details in section 7.7.

---

## 6. External candidate flow

### 6.1 Difference from the student

The **external candidate** is not enrolled in a course; they land on the platform because a recruiter invited them to a challenge. It is the shortest, most transactional flow.

### 6.2 Flow

1. **Receive invitation email** with unique link
2. **If no account**: quick sign-up (email + password); email is pre-filled
3. **Accept challenge terms** (UC-016): time limit, max attempts, open book
4. **Complete the challenge** (UC-017): same as the student
5. **View feedback** (UC-018): score, dimensions, areas to improve
6. **Choose visibility** (UC-019): keep profile hidden, visible only to this recruiter, or public in the pool

**Pain we address for the candidate**: instead of five separate technical interviews with five companies, one well-designed assessment can serve multiple processes. They get useful feedback even if not hired.

---

## 7. Pre-role preparation: workflow simulator

This is **the most powerful consequence** of defining the role in depth. The same information the recruiter entered (tools, stack, skills) is reused for something no competitor offers: **a practice roadmap for the candidate before they apply**.

### 7.1 Pain we address

> “When a candidate joins the company, week one is learning tools. Week two, understanding our PR and code review flow. Week three, they start contributing. That is three weeks of salary with little return, times every hire. Many juniors who interview well cannot handle that curve and leave in month two or three.”

> “As a candidate, I read ‘we want backend Java with microservices experience’ and prepare generically. I do not know if they use Spring or Quarkus, GitLab or GitHub, what tickets look like, how they do code review. I walk into the interview improvising.”

### 7.2 The solution: auto-generated practice roadmap

When the recruiter defines a role with its real tools (extended step 1), Talent Pool generates **two artifacts** from that data:

1. The challenge plan to evaluate candidates (section 5.2, step 2)
2. **A practice roadmap with end-to-end workflow simulation** the candidate can complete BEFORE applying to the role

### 7.3 How the candidate experiences it

When a candidate sees the “Backend Java SSR” opening in Acme Corp’s pool, they have three options:

- **Apply directly** to the technical challenge
- **Practice first** with this role’s specific roadmap (free, optional, no time limit)
- **Save for later** and return when ready

If they choose to practice, they see a roadmap like this:

```
Practice roadmap · Backend Java SSR · Acme Corp
8 modules · 6–10 hours estimated · Your progress: 0/8

▶ Module 1 (45 min): Environment setup
   - Clone the practice repo (structure identical to Acme’s)
   - Configure Spring Boot + local PostgreSQL
   - Verify tests pass
   ✓ Skills: getting comfortable with the stack

▶ Module 2 (90 min): Your first ticket
   - Pick a simulated Jira ticket: “Bug on /users endpoint”
   - Find root cause, write failing test, fix
   - Commit with conventional commits, push
   ✓ Skills: debugging, TDD, conventional commits

▶ Module 3 (60 min): Simulated GitLab pull request
   - Open PR with your module 2 change
   - System simulates 3 “code review” comments from the team
   - Respond constructively, adjust code, re-request review
   ✓ Skills: communication in code review, GitLab workflow

▶ Module 4 (45 min): Pass lint and SonarQube
   - Pipeline flags 2 SonarQube issues on your PR
   - Fix code smells, improve coverage
   ✓ Skills: static quality criteria, SonarQube

▶ Module 5 (90 min): Optimization with metrics
   - Slow endpoint flagged in Datadog (simulated chart)
   - Identify N+1 query, refactor
   - Document improvement in a mini-ADR
   ✓ Skills: reading metrics, optimization, communicating decisions

▶ Module 6 (60 min): Simulated on-call
   - 3am alert: API timing out
   - Follow runbook, find cause, mitigate
   ✓ Skills: incident response, autonomy under pressure

▶ Module 7 (60 min): Document for the team
   - Write Confluence page with learnings from the incident
   - Audience: async teammates who were not there
   ✓ Skills: technical documentation, written communication

▶ Module 8 (60 min): Your first real challenge
   - Implement a new feature end to end
   - Design + code + tests + PR + documentation
   ✓ Skills: integrating everything above

[Apply to role with roadmap completed]
```

Each module is evaluated with the same AI and guardrails as hiring challenges, but feedback is learning-focused (non-elimination, no time pressure).

### 7.4 Concrete benefits for the company

**Shorter onboarding time**

Typical junior developer onboarding is 3–6 weeks before net positive contribution. Typical breakdown:

- **Week 1**: learn specific stack, tools, access, first trivial commit
- **Weeks 2–3**: understand team flows (PRs, code review, ceremonies)
- **Weeks 4–6**: ship supported features

When the candidate already completed the roadmap before applying, **much of week 1 and a large part of weeks 2–3 are already covered**. Conservative estimate: **30% to 50% reduction** in onboarding time.

**Rough math**: if a junior costs USD 2,000/month and onboarding lasts 4 weeks (1 month), cutting 40% saves ~USD 800 per hire, not counting the mentor’s opportunity cost.

**Quality of applicants**

Only seriously interested candidates finish the roadmap. That naturally filters:
- Candidates who “spray and pray” résumés do not finish
- Those who finish show genuine interest and dedication
- The recruiter sees roadmap progress before deciding to interview

**Early retention**

A common cause of early churn is **cultural and technical shock**: on day five the candidate realizes the workflow, tools, or culture are not what they expected. The roadmap prevents that: they know what they are signing up for.

### 7.5 Concrete benefits for the candidate

**Continuous upskilling without waiting to apply**

They can complete roadmaps for several roles of interest and stay in constant learning mode. A passive candidate (employed but open) can practice for appealing roles without commitment.

**Clear view of gaps**

The roadmap is honest: if they struggle on SonarQube module 4, they know to strengthen static analysis before applying. Actionable insight traditional hiring rarely provides.

**Demonstrable résumé**

Completed roadmaps appear on the candidate’s profile as validated skills with context: not just “knows Java,” but “completed Acme Corp’s roadmap at 92/100, demonstrating Spring Boot, GitLab, SonarQube, and Datadog.” That helps for similar roles even if they never apply to Acme.

**Always available**

They do not need to wait for a posting to start preparing. Talent Pool becomes a space for **continuous practice**: when an opportunity appears, they are ready or know exactly what to practice.

### 7.6 Benefits for Talent Pool as a product

This makes Talent Pool more than an assessment platform: it is a **contextual professional training platform**. Each company that posts a role enriches the roadmap library. Candidates have reasons to return even when not actively applying. User retention rises.

### 7.7 Use cases involved

| ID | Use case | Status in `PRODUCT.md` |
|----|----------|------------------------|
| UC-006 (extended) | Create job role with stack, technical and soft skills | **GAP**: current `PRODUCT.md` defines the role only with title, technology, and seniority. Missing fields for tools, technical skills, and soft skills. |
| UC-007 (extended) | Generate challenge plan (not a single challenge) covering technical + soft | **GAP**: current `PRODUCT.md` generates one challenge per role. Missing multi-challenge “evaluation plan” concept. |
| UC-NUEVO-A | Generate practice roadmap from a role | **NEW**: not in `PRODUCT.md`. Propose as UC-023. |
| UC-NUEVO-B | Complete practice roadmap as candidate | **NEW**: not in `PRODUCT.md`. Propose as UC-024. |
| UC-NUEVO-C | View candidate roadmap progress (recruiter view) | **NEW**: not in `PRODUCT.md`. Propose as UC-025. |

> **Team note**: content in this section requires updating `PRODUCT.md` with three new UCs and extensions to UC-006 and UC-007. That update is out of hackathon demo scope (not implemented), but it is a **post-MVP roadmap proposal** that strongly differentiates the product.

---

## 8. The bridge: how the three worlds connect

This is **Talent Pool’s strategic differentiator**. Here is the magic no competitor has.

### 8.1 The student becomes a candidate (effortlessly)

```
Algorithms II student
   ↓ completes assignments during the term
   ↓ accumulates scores on their profile
   ↓ teacher writes recommendation, student accepts
   ↓
Pre-assessed candidate in the talent pool
   ↓ visible to recruiters
   ↓ with real skill evidence and academic backing
```

**No applications, no résumé, no extra time**. Just by being a strong student.

### 8.2 Recruiters discover talent where it is trained

```
Recruiter searches “Java SSR with strong complexity analysis”
   ↓
UTN students appear with assignments solved at 90+ points
   ↓
Each with verified teacher feedback
   ↓
Recruiter invites them directly, skipping traditional filters
```

**Without waiting for the candidate to apply**. The recruiter goes to them.

### 8.3 Teachers accelerate careers

```
Instructor sees outstanding students
   ↓ writes recommendations
   ↓ students accept and publish
   ↓
Recommendations travel with the student’s profile
   ↓
Recruiters read them when evaluating candidates
   ↓
Top students land real interviews
```

**Teachers move from “grade and forget” to “open concrete doors.”**

### 8.4 AI learns from everyone

Every generated assignment, every evaluation, every repository question **feeds the system**:
- Challenges improve with more usage
- Frequent questions are cached and lower cost
- Grading criteria refine with human feedback
- The course repository grows as a teaching resource

---

## 9. Video demo script (5 minutes)

### Suggested structure

| Minute | Focus | Who appears |
|--------|-------|-------------|
| 0:00 - 0:30 | Problem | Voice-over + visuals |
| 0:30 - 1:30 | Teacher flow | Screen share |
| 1:30 - 3:00 | Student flow (heart of the product) | Screen share |
| 3:00 - 4:00 | Recruiter flow | Screen share |
| 4:00 - 4:30 | The bridge: how they connect | Visualization |
| 4:30 - 5:00 | Closing and call to action | Voice-over |

### 9.1 Minute 0:00 - 0:30 — Problem

**Visual**: three people on separate screens (frustrated teacher with stack of exams, student alone on ChatGPT, recruiter with 200 résumés).

**Voice-over**:
> “Three worlds that should be connected—but are not. The teacher losing hours building assignments. The student querying AI in isolation. The recruiter filtering résumés without certainty about real skills. Talent Pool connects all three.”

### 9.2 Minute 0:30 - 1:30 — Teacher flow

**Show on screen**:

1. (5s) Log in as Carlos Rodríguez, Algorithms II instructor
2. (10s) Click “Generate new assignment” → type objective → see loading “Generating challenge with AI…” → full prompt appears
3. (5s) Accept assignment → see message “Assigned to 32 students”
4. (15s) Time-lapse: course dashboard with submissions, score distribution, frequent questions
5. (10s) Click outstanding student profile → “Write recommendation” → send
6. (5s) End segment

**Parallel voice-over**:
> “Teacher Carlos generates a full assignment in under a minute. AI writes the prompt, defines grading criteria, and assigns it automatically to his 32 students. As the term progresses, Carlos sees how his class is doing in real time. At the end, he writes recommendations for his best students in a few clicks.”

**Pain to say out loud**:
> “Before, this took him two hours. Now, two minutes.”

### 9.3 Minute 1:30 - 3:00 — Student flow (MOST IMPORTANT)

This is **the heart of the product**—where the hackathon judge should say “wow.” Give it a full 90 seconds.

**Show on screen**:

1. (10s) Log in as Tomás Vega, student → dashboard with pending assignments
2. (15s) Open an assignment → Monaco editor with syntax highlighting → write solution
3. (10s) Submit → see “Evaluating your solution…” → feedback with score 88, dimensional breakdown, suggested code

4. (5s) Transition to course repository

5. **WOW MOMENT (30 seconds)**: Tomás has a new question and opens the course repository.
   - Show sidebar with syllabus units, “Unit 2 ACTIVE” highlighted
   - Show top-voted questions for the unit
   - Click “Ask a new question”
   - Start typing “HashMap vs TreeMap?”
   - **Similar-question panel appears**: “We found 2 similar questions” with similarity percentages
   - Show classmate’s question with 18 votes
   - **Voice-over**: “Before spending tokens on a new answer, the system searches for similar questions already answered. If the doubt is already resolved, we save an AI call and learn from classmates’ work.”

6. (10s) Click a question → see prompt + AI answer + peer comments + highlighted teacher comment

7. (10s) Close by showing student’s public profile: validated skills, teacher recommendations, “Visible to recruiters” toggle

**Parallel voice-over**:
> “Tomás completes assignments with immediate feedback. But the game-changer is this: the collaborative course repository. Every question a student asks becomes a resource for the whole class. The system searches for similar questions before generating new ones, saving cost and building shared knowledge. And all this class work—with consent—lands on their technical profile visible to recruiters.”

**Pain to say out loud**:
> “Zero extra effort. The student is already studying. Their work automatically becomes their résumé.”

### 9.4 Minute 3:00 - 4:00 — Recruiter flow

**Show on screen**:

1. (5s) Log in as María Pérez, Acme Corp recruiter
2. (15s) Create “Backend Java SSR” role → show full form: technology, tools (Spring Boot, GitLab, SonarQube, Datadog), technical skills, **soft skills (communication, autonomy, documentation)**
3. (15s) Click “Generate evaluation plan” → AI generating **a 4-challenge plan** covering technical + soft. Highlight “code review in GitLab” and “write a short ADR”
4. (5s) Confirm plan
5. (10s) Briefly: “the same plan doubles as a practice roadmap so candidates can prepare BEFORE applying” → show candidate roadmap screen (no deep dive)
6. (10s) Fast-forward: ranking with 3 candidates by composite score (Ana 92, Lucía 85, Pedro 78)
7. (10s) Click Ana → detail: scores per challenge (technical, code review, ADR), submitted code, AI feedback, **recommendation from her instructor Carlos Rodríguez**

**Parallel voice-over**:
> “María does not only enter a title and a technology. She defines the real tools her team uses, technical skills, and—most importantly—the soft skills that matter. AI does not give one generic challenge: it builds a four-challenge evaluation plan from cache logic to how the candidate communicates technical decisions. That same plan becomes a practice roadmap candidates can complete BEFORE applying. That cuts onboarding weeks when they finally join.”

**Pain to say out loud**:
> “No building the test from scratch. No assessing only technical skills. No losing weeks to onboarding. María hires people who already know Acme’s way of working.”

### 9.5 Minute 4:00 - 4:30 — The bridge

**Visual**: animation or diagram showing the three connected worlds.

**Voice-over**:
> “Here is the heart of Talent Pool: what looks like three products is one. The student learns and completes assignments. The teacher automates work and promotes top students. The recruiter discovers pre-assessed talent where it is actually trained. One platform, three connected worlds—value none could create alone.”

### 9.6 Minute 4:30 - 5:00 — Closing

**Visual**: Talent Pool logo + tagline.

**Voice-over**:
> “Talent Pool: where technical training becomes the job market, without extra effort. For teachers who want impact beyond the classroom. For students who deserve real opportunities. For companies that need verified talent from day one. Talent Pool: one assessment, every door.”

---

## 10. Team review checklist

Before the team approves this document and records the video:

- [ ] Do the three flows (teacher, student, recruiter) fully cover what the prototype shows?
- [ ] Is each user’s “pain point” clearly identified and believable?
- [ ] Is the connection between the three worlds (section 8) clear and credible?
- [ ] Does the demo script fit in 5 minutes when recorded on screen?
- [ ] Is the “wow moment” (repository collaborative cache) understandable without technical jargon?
- [ ] Are prototype mock data consistent with names and numbers in this document?
- [ ] Is any feature shown in the demo NOT implemented in the prototype? (overpromise risk)
- [ ] Is any use case the team considers critical for the pitch missing?

---

## 11. Next steps

1. **Team review** (1 hour): read this document together, adjust narrative
2. **Demo dry run** (30 min): run the prototype step by step following the script from minute 0:30 to 4:00, confirming each click works
3. **Record video** (1 hour): screen recording + voice-over, ideally in 1–2 takes
4. **Edit and export** (30 min): trim pauses, simple transitions, subtitles
5. **Upload to the hackathon platform**

---

## 12. Internal references

- `PRODUCT.md` — full product definition and 26 use cases (UC-001–UC-026)
- `DATABASE.md` — data model
- `ARCHITECTURE.md` — technical decisions
- Prototype: `temp/Talent_Pool.html`
