# AGENTS.md — Sudoku Solver Angular

This file provides guidance for agentic coding assistants operating in this repository.

---

## Project Overview

An Angular application that provides a browser-based Sudoku solver. It uses Angular Material for UI, `@ngx-translate` for i18n (English + German), `fast-sudoku-solver` for the solving logic, and Cypress for E2E tests. The app is a single NgModule with no routing.

---

## Package Manager

This project uses **pnpm** exclusively. Do not use `npm` or `yarn`.

```sh
pnpm install       # install dependencies
```

---

## Build / Lint / Test Commands

```sh
pnpm start         # dev server at localhost:4200
pnpm build         # production build (output: dist/)
pnpm watch         # build --watch in development mode
pnpm clean         # remove dist/

pnpm lint          # eslint --fix --max-warnings 0 (must pass with 0 warnings)
pnpm format        # prettier --write on all .ts/.html/.scss/.json/.md files

pnpm test          # unit tests: Karma + Jasmine, headless Chrome, single run
pnpm e2e           # Cypress E2E via ng e2e (requires running dev server)
pnpm cypress:open  # Cypress interactive
pnpm cypress:run   # Cypress headless
```

### Running a Single Unit Test File

Karma does not have a native "run one file" flag. To run a single spec in isolation, temporarily modify `src/test.ts` to filter by spec path using `require.context`, or use the `--include` flag in Angular CLI (Angular 17+):

```sh
pnpm ng test --include="src/app/sudoku-box/sudoku-box.component.spec.ts" --no-watch --no-progress --browsers=ChromeHeadlessCI
```

### Running a Single Cypress Spec

```sh
pnpm cypress run --spec "cypress/e2e/solve-sudoku.cy.ts"
```

---

## CI Pipeline

GitHub Actions (`.github/workflows/build_and_test.yml`) runs on every push and pull request to `main`:

1. `pnpm clean`
2. `pnpm eslint . --max-warnings 0`
3. `pnpm build`
4. `pnpm test`

All four steps must pass. Do not merge code that fails lint, build, or tests.

### Pre-commit Hook (Husky + lint-staged)

Automatically runs on staged files before each commit:

- `*.{html,js,mjs,ts}` → `prettier --write` then `eslint --fix --max-warnings 0 --no-warn-ignored`
- `*.{css,scss,json,md}` → `prettier --write`

---

## Code Style

### Formatting (Prettier — `.prettierrc.js`)

| Setting         | Value   |
| --------------- | ------- |
| `semi`          | `true`  |
| `trailingComma` | `'es5'` |
| `singleQuote`   | `true`  |
| `printWidth`    | `120`   |

Always run `pnpm format` or let the pre-commit hook fix formatting. Do not manually adjust whitespace.

### TypeScript (Strict Mode)

All strict TypeScript flags are enabled — `"strict": true` plus:

- `noImplicitOverride: true` — use the `override` keyword when overriding base class members
- `noImplicitReturns: true` — every code path in a function must return a value
- `noFallthroughCasesInSwitch: true`
- `noPropertyAccessFromIndexSignature: true`
- `forceConsistentCasingInFileNames: true`
- Target: **ES2022**, module: **ES2020**, moduleResolution: **bundler**
- `useDefineForClassFields: false` (required for Angular decorators)

Angular template compiler: `strictInjectionParameters`, `strictInputAccessModifiers`, and `strictTemplates` are all `true`.

Do not add `// @ts-ignore` or `// @ts-expect-error` unless absolutely necessary.

---

## Naming Conventions

| Artifact               | Convention                                         | Example                                     |
| ---------------------- | -------------------------------------------------- | ------------------------------------------- |
| Components             | `PascalCase` + `Component` suffix                  | `SudokuBoxComponent`                        |
| Modules                | `PascalCase` + `Module` suffix                     | `AppModule`                                 |
| Component selectors    | `solve-` prefix, kebab-case                        | `solve-sudoku-box`                          |
| Directive selectors    | `solve` prefix, camelCase attribute                | `solveFoo`                                  |
| Files                  | kebab-case, `.type.ts` suffix                      | `sudoku-box.component.ts`                   |
| Methods / functions    | `camelCase` verbs                                  | `solve()`, `resetSudoku()`                  |
| Properties / variables | `camelCase`, explicitly typed                      | `disableButtonsForSolving: boolean = false` |
| Private class members  | `private` access modifier (not `#` private fields) | `private fb = inject(FormBuilder)`          |
| i18n keys              | dot-separated by feature                           | `sudoku-box.button-solve`                   |

Shared/utility code lives in `src/app/_shared/` (underscore prefix sorts it first). Validators live in `src/app/validation/` as plain exported functions (no class).

---

## Angular Patterns

### NgModule Architecture (not standalone)

Components explicitly declare `standalone: false`. All components are declared in `AppModule`. Do not convert to standalone components — `@angular-eslint/prefer-standalone` is turned off intentionally.

### Dependency Injection — `inject()` function

Use the `inject()` function at field declaration, not constructor parameter injection:

```ts
// Correct
private fb = inject(FormBuilder);
private snackBar = inject(MatSnackBar);

// Avoid
constructor(private fb: FormBuilder) {}
```

### Template Control Flow — Block Syntax (Angular 17+)

Use `@for` / `@if` / `@else` block syntax. Do **not** use `*ngFor` or `*ngIf` structural directives:

```html
@for (row of rows; track rowIndex; let rowIndex = $index) { ... } @if (sudokuUnsolvable) { ... }
```

### Reactive Forms

Use `FormBuilder`, `FormGroup`, `FormArray`, and typed `FormControl<string>`. Validators are composed as an array:

```ts
[Validators.pattern(pattern), excludingEntriesValidator(otherControls)];
```

Custom validators are factory functions returning `ValidatorFn` — plain exported functions, not classes.

### Exposing Global Constructors to Templates

Use a `protected readonly` property to expose globals like `Array` inside component templates:

```ts
protected readonly Array = Array;
```

### No Signals

The project does not use Angular Signals (`signal()`, `computed()`, `effect()`). State is managed via plain class properties and RxJS `Subscription`s. Do not introduce Signals without discussing the architectural change first.

### i18n

Use `@ngx-translate` (not Angular's built-in `$localize`). Translation files live in `src/assets/i18n/{lang}.json`. In templates use the `| translate` pipe; in components use `translate.get(key).subscribe(...)`. Both `en.json` and `de.json` must be kept in sync for every new string.

---

## Import Order

Group imports in this order, separated by a blank line:

1. **Angular core/platform** (`@angular/core`, `@angular/platform-browser`, …)
2. **Angular feature modules** (`@angular/forms`, `@angular/material/*`, `@angular/common/http`, …)
3. **Third-party libraries** (`@ngx-translate/*`, `fast-sudoku-solver`, `rxjs`, …)
4. **Local imports** (relative paths: `./`, `../`)

```ts
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ResetDialogComponent } from '../reset-dialog/reset-dialog.component';
import { convertSudokuFormToNumberArray } from '../_shared/solver-utils';
```

---

## Error Handling

- There is no `try/catch` in the application. Do not add `try/catch` for application logic.
- Form validation errors are surfaced through Angular reactive form validators and `MatSnackBar` notifications driven by `statusChanges`.
- Solver failures (unsolvable puzzle) are indicated by a boolean property (`sudokuUnsolvable: boolean`) toggled in the component, rendered conditionally in the template with `@if`.
- Bootstrap errors are caught with `.catch((err) => console.error(err))` in `main.ts` only.
- Subscription cleanup: use `subscription?.unsubscribe()` (optional chaining) before re-subscribing. The project does not use `takeUntil` or `DestroyRef` — maintain consistency.
- Use non-null assertion (`!`) only when you are certain a value cannot be null/undefined (e.g., accessing a known form control: `formRow.get('column' + j)!.setValue(entry)`).

---

## Testing

### Unit Tests (Karma + Jasmine)

- Test files are co-located with source files: `*.spec.ts` in the same folder.
- Component tests use `TestBed.configureTestingModule` with `declarations`, `schemas: [CUSTOM_ELEMENTS_SCHEMA]` (to suppress unknown child element errors), and required `imports`/`providers`.
- Pure function tests do not need `TestBed` — construct dependencies directly.
- Follow **Arrange → Act → Assert** and use inline comments for each section.
- `describe` strings name the thing under test; `it` strings begin with `"should "`.

```ts
describe('SudokuBoxComponent', () => {
  let component: SudokuBoxComponent;
  let fixture: ComponentFixture<SudokuBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SudokuBoxComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [...],
    }).compileComponents();
    fixture = TestBed.createComponent(SudokuBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### E2E Tests (Cypress)

- Specs live in `cypress/e2e/*.cy.ts`.
- `all-tests.cy.ts` is an aggregator that imports all other specs — add new spec files there.
- Target elements by `id` attributes (e.g., `cy.get('#button-solve')`), not CSS classes.
- Base URL is `http://localhost:4200` — the dev server must be running before Cypress starts.

---

## Styling

- Component styles use scoped SCSS files (`.component.scss`).
- Global styles use `@use` for partials; avoid `@import` (deprecated in Sass).
- Use SCSS variables for repeated values (e.g., `$warn: rgb(238, 43, 42)`).
- Per-component style budget: warn at 2 KB, error at 4 KB (enforced in `angular.json`).
- The prebuilt Angular Material theme `indigo-pink.css` is included globally.
