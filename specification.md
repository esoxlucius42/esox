# Project Specification

## Executive Summary

This document establishes the technical requirements, architectural standards, and operational guidelines for the development and implementation of features within this project. All development activities must adhere to the principles and constraints outlined herein.

---

## Core Principles

### Specification-Driven Development

Development efforts shall focus exclusively on features and requirements explicitly specified by the product owner. Implementation must not include speculative features, enhancements, or functionality that extends beyond the defined scope of work.

**Example:**
- **Requirement:** User requests creation of a new blank page titled "Apps" with specific styling specifications.
- **Correct Approach:** Implement the "Apps" page according to the technical and visual specifications provided, adhering strictly to the established design system.
- **Incorrect Approach:** Extend the implementation with placeholder applications or anticipatory features not explicitly requested.

---

## Technical Stack

### Frontend
- **Application Architecture:** Single Page Application (SPA)
- **Framework:** React
- **Styling Framework:** styled-components

### Backend
- **Framework:** Java Spring Boot
- **Runtime:** Java Development Kit (JDK) Version 17

### Data Persistence
- **Primary Database:** PostgreSQL

### Design System
- **Theme:** Dark-themed user interface
- **Color Palette:**
  - Background: Dark grays and black
  - Text and UI Components: Bright pastel colors

### Logging
- **Framework:** Logback
- **Annotation-Based Logger:** Lombok `@Slf4j` annotation (preferred over explicit Logger instantiation)
- **Logger Usage:** Always use `@Slf4j` annotation on classes requiring logging. This provides an implicit `log` field, eliminating manual `LoggerFactory.getLogger()` calls.
- **Appenders:** Only console appender will be used.

**Example - Correct Approach:**
```java
@Slf4j
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        log.info("Application started");
    }
}
```

**Example - Incorrect Approach (do not use):**
```java
public class Application {
    private static final Logger logger = LoggerFactory.getLogger(Application.class);
    // Direct instantiation is verbose and redundant when @Slf4j is available
}
```
---

## Project Constraints

- **Platform Scope:** Web-based applications exclusively; mobile device optimization is not required
- **Accessibility Requirements:** Accessibility compliance testing is not mandated for this personal-use application

---

## Implementation Guidelines

- **Clarification Authority:** Agents are encouraged to request clarification from the specification owner when ambiguities arise regarding requirements, scope, or implementation approaches
- **Proactive Suggestions:** Agents may propose improvements, alternative approaches, or architectural recommendations that enhance deliverable quality, provided such suggestions remain aligned with project specifications

---

## Agent Operational Instructions

### Intended Agent Type
This specification document is designed exclusively for **planning agents**. If this document is accessed or executed by any other agent type (e.g., Ask Agent, General Agent, or other specialized agents), the agent must **request explicit permission from the user before proceeding** with any task or analysis.

### Language and Communication Standards
**Important Note:** The specification owner's primary language is not English, and typing proficiency may result in syntax errors, grammatical mistakes, and spelling variations. Agents should expect and accommodate such errors in:
- Feature descriptions
- Technical names and identifiers
- Dependencies and component references
- Any other user-provided specifications

**Correction Protocol:** When syntactic, grammatical, or spelling errors appear in **technical contexts** (dependencies, naming conventions, configuration values, or any aspect that could create downstream implementation problems), agents are **encouraged to:**
- Proactively correct or clarify the intended meaning
- Ask for confirmation of technical details
- Suggest standardized naming or conventions
- Flag ambiguities that may result from unclear specifications

Non-technical communication errors may be safely ignored. Focus corrections on elements that impact system architecture, naming consistency, or technical accuracy.

---

## Feature Implementation Template

### Feature: Note app Card

#### Objective
<!-- Clear, concise statement of the feature's purpose, business value, and intended user outcomes -->
Add a card that will be entry point to our app. App name is Note. Every app we create will be represented
with cards and user will access tha app by clicking a card. Create an object to represent card and use it 
to create this and following cards. Cards will need three fields: type, title, subtitle.
Note app: type:app, title:Note, subtitle:"Quick note taking app" (@agent: suggest better subtitle)
Visual guide: card is a block with sides ratio 5w:3h, it is dark gray with :hover effect, it has a title in 
large font size and blue text and smaller font subtitle in cyan.

#### Acceptance Criteria
<!-- Specific, measurable, and verifiable condition that must be satisfied for completion -->
- Criterion 1: Code must compile without errors.
- Criterion 2: APPS page displays note card
- Criterion 3: card has a hover effect
- Criterion 4: title and subtitle are displayed in correct colors


#### Technical Specifications
<!-- [Detailed technical requirements, implementation approach, architectural considerations, 
    and integration points with the established technical stack -->
See technical stack.

#### Dependencies
<!-- Related features, existing components, services, or systems upon which this feature depends -->
- **Internal Dependencies:** None
<!-- Third-party libraries, services, APIs, or external prerequisites -->
- **External Dependencies:** See technical stack.

#### Constraints
<!-- Feature-specific limitations, performance requirements, data constraints, or operational restrictions -->
None.

---
