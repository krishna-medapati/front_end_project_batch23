# Git Commit Guide

This guide outlines best practices for writing clear, meaningful Git commit messages.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **ui**: User interface changes
- **validation**: Form validation or input validation changes

## Scope (Optional)

The scope should be the name of the package affected (e.g., `login`, `calendar`, `dashboard`, `api`).

## Subject

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Maximum 50 characters

## Body (Optional)

- Use imperative, present tense
- Explain **what** and **why** vs. **how**
- Wrap at 72 characters
- Can include multiple paragraphs

## Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

### Good Commit Messages

```
feat(login): add real-time form validation with error messages

- Implement email/username validation
- Add password strength validation
- Show inline error messages for each field
- Add success indicators for valid inputs

Closes #123
```

```
fix(calendar): prevent Invalid Date errors in event display

- Add date validation before creating Date objects
- Filter out events with invalid dates
- Add fallback text for missing event data
- Improve error handling in date formatting

Fixes #456
```

```
feat(login): implement loading states for API calls

- Add spinner animation during login
- Disable form inputs during submission
- Show loading text on submit button
- Prevent multiple simultaneous submissions
```

```
refactor(error-handling): add error boundary component

- Create ErrorBoundary class component
- Wrap app with error boundary in layout
- Add user-friendly error fallback UI
- Show error details in development mode
```

### Bad Commit Messages

❌ `fix stuff`  
❌ `update`  
❌ `changes`  
❌ `Fixed the login bug`  
❌ `WIP`  

## Commit Checklist

Before committing, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (if applicable)
- [ ] No console errors or warnings
- [ ] Code is properly formatted
- [ ] Commit message follows the format above
- [ ] Related issues are referenced (if applicable)

## Commit Workflow

1. **Stage changes**: `git add <files>`
2. **Review changes**: `git status` and `git diff --staged`
3. **Write commit message**: Follow the format above
4. **Commit**: `git commit -m "type(scope): subject" -m "body"`
5. **Push**: `git push origin <branch>`

## Example Workflow

```bash
# Stage specific files
git add app/page.jsx app/globals.css

# Review what will be committed
git diff --staged

# Commit with detailed message
git commit -m "feat(login): add comprehensive form validation" \
  -m "- Implement real-time email/username validation
- Add password strength requirements (min 6 chars)
- Show inline error messages with clear feedback
- Add success indicators for valid inputs
- Prevent form submission with invalid data" \
  -m "Closes #123"

# Push to remote
git push origin main
```

## Multi-line Commit Messages

For detailed commits, use:

```bash
git commit
```

This opens your default editor where you can write:

```
feat(login): add comprehensive form validation

Implement real-time validation with clear error messages:
- Email/username format validation
- Password strength requirements
- Inline error display
- Success indicators

Add loading states:
- Spinner animation
- Disabled inputs during submission
- Visual feedback

Closes #123
```

## Branch Naming

Use descriptive branch names:

- `feat/login-validation`
- `fix/calendar-invalid-date`
- `refactor/error-handling`
- `docs/commit-guide`

## Pull Request Guidelines

When creating a PR, include:

1. **Title**: Same format as commit message
2. **Description**: 
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (if UI changes)
3. **Related Issues**: Link to issues
4. **Checklist**: 
   - [ ] Tests pass
   - [ ] Code reviewed
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)

