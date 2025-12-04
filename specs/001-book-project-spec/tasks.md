# Tasks: Book Project Delivery

**Input**: Design documents from `/specs/001-book-project-spec/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: The feature specification does not explicitly request test tasks to be created in the `tasks.md`. Therefore, implementation tasks will be listed without corresponding explicit test tasks, but testing is assumed as part of the implementation strategy.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below are based on the `plan.md` structure for this project.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Docusaurus project structure in `book/docusaurus-config/`
- [ ] T002 Set up Git repository and perform initial commit in `.`
- [ ] T003 Define initial folder structure for web-app backend in `web-app/backend/src/`
- [ ] T004 Define initial folder structure for web-app frontend in `web-app/frontend/src/`
- [ ] T005 Define initial folder structure for robot control in `web-app/robot-control/src/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Set up Python development environment for AI/Robotics
- [ ] T007 Set up JavaScript/TypeScript development environment for Docusaurus/web
- [ ] T008 Integrate basic version control for book content in `book/docs/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Learning with Interactive Chapters (Priority: P1) 🎯 MVP

**Goal**: A student can read a chapter, understand concepts, and engage with hybrid examples.

**Independent Test**: Student successfully navigates and completes interactive elements of a hybrid example.

### Implementation for User Story 1

- [ ] T009 [US1] Create Chapter 1 (Introduction) Markdown content in `book/docs/01-introduction.md`
- [ ] T010 [US1] Add hybrid example for Chapter 1 in `book/docs/01-introduction.md`
- [ ] T011 [US1] Create Chapter 2 (Physical AI Basics) Markdown content in `book/docs/02-physical-ai-basics.md`
- [ ] T012 [US1] Add hybrid example for Chapter 2 in `book/docs/02-physical-ai-basics.md`
- [ ] T013 [US1] Configure Docusaurus to display Chapter 1 and 2 in `book/docusaurus-config/`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Getting Assistance with RAG Chatbot (Priority: P1)

**Goal**: A student can ask questions to a RAG chatbot and receive relevant answers.

**Independent Test**: Student asks a question and receives a correct answer with references.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Set up Vector Database for RAG (external service/tool setup)
- [ ] T015 [P] [US2] Implement text embedding generation for book content in `web-app/backend/src/services/rag_embeddings.py`
- [ ] T016 [US2] Develop RAG chatbot backend API for query processing in `web-app/backend/src/api/chatbot.py`
- [ ] T017 [US2] Integrate RAG chatbot frontend component into Docusaurus in `web-app/frontend/src/components/RAGChatbot.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Personalized Learning Experience (Priority: P2)

**Goal**: A student can customize language and display settings.

**Independent Test**: Student changes settings, and they persist and apply correctly.

### Implementation for User Story 3

- [ ] T018 [P] [US3] Implement user authentication system in `web-app/backend/src/api/auth.py`
- [ ] T019 [P] [US3] Develop user preference management API in `web-app/backend/src/api/preferences.py`
- [ ] T020 [US3] Implement frontend UI for language and dark mode settings in `web-app/frontend/src/components/UserSettings.tsx`
- [ ] T021 [US3] Integrate Urdu translation capabilities into Docusaurus in `book/docusaurus-config/i18n/ur.json`

**Checkpoint**: All user stories should now be independently functional

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 Implement comprehensive unit and integration tests across components
- [ ] T023 Optimize RAG chatbot for performance and accuracy
- [ ] T024 Review all content for consistency and clarity
- [ ] T025 Prepare deployment scripts for book and web application

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)****: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Tasks for User Story 1:
# T009 [US1] Create Chapter 1 (Introduction) Markdown content in `book/docs/01-introduction.md`
# T010 [US1] Add hybrid example for Chapter 1 in `book/docs/01-introduction.md`
# T011 [US1] Create Chapter 2 (Physical AI Basics) Markdown content in `book/docs/02-physical-ai-basics.md`
# T012 [US1] Add hybrid example for Chapter 2 in `book/docs/02-physical-ai-basics.md`
# T013 [US1] Configure Docusaurus to display Chapter 1 and 2 in `book/docusaurus-config/`
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
