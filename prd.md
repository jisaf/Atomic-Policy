# Glean.ly Core Functionality Analysis for PRD Development

**Glean.ly is a specialized UX research repository built around the "Atomic UX Research" methodology** that transforms traditional research reports into searchable, interconnected knowledge units. [Dimmo](https://www.dimmo.ai/products/glean) [Glean](https://glean.ly/) Created by Daniel Pidcock, [LinkedIn](https://uk.linkedin.com/in/pidcock) [User Interviews](https://www.userinterviews.com/blog/the-power-of-atomic-research-with-daniel-pidcock-of-glean-ly) it addresses the critical problem of research insights being trapped in static documents, becoming siloed, and losing value over time. [Insight Platforms +3](https://www.insightplatforms.com/platforms/glean-ly/)

## Core purpose and fundamental features

**Glean.ly's primary purpose** is to create a centralized, searchable repository where UX research insights are broken down into their smallest meaningful components—called "atoms"—and connected across multiple studies over time. [Dimmo](https://www.dimmo.ai/products/glean) [Glean](https://glean.ly/) **The core value proposition centers on preventing research waste** by making insights discoverable, reusable, and continuously valuable rather than abandoned in static reports. [UX research blog](https://blog.ferpection.com/en/atomic-research-or-decoding-a-user-centric-method)

The platform implements a **four-part atomic structure** that forms the foundation of all functionality: [Marvel](https://marvelapp.com/blog/atomic-ux-research/) [Prototypr](https://blog.prototypr.io/what-is-atomic-research-e5d9fbc1285c)

**Experiments** represent "We did this"—documenting what research activities were conducted, including interviews, usability tests, surveys, and analytics reviews. [Productfruits](https://gleanly.productfruits.help/en/article/understanding-atomic-ux-research) [Prototypr](https://blog.prototypr.io/what-is-atomic-research-e5d9fbc1285c) **Facts** capture "and we found out this"—objective, unbiased observations like user quotes, behavioral data, and measurable statistics. [Productfruits](https://gleanly.productfruits.help/en/article/understanding-atomic-ux-research) [Prototypr](https://blog.prototypr.io/what-is-atomic-research-e5d9fbc1285c) **Insights** provide "which makes us think this"—interpretive conclusions drawn from facts that explain the reasoning behind user behaviors. [Productfruits](https://gleanly.productfruits.help/en/article/understanding-atomic-ux-research) **Recommendations** deliver "so we'll do that"—actionable next steps that transform insights into product decisions. [Marvel +5](https://marvelapp.com/blog/atomic-ux-research/)

**Core features include confidence scoring** that evaluates insight quality based on evidence type, age, and quantity; [Glean](https://glean.ly/) **cross-study connections** that link related insights across different research projects; **evidence provenance tracking** that maintains clear chains from raw data to recommendations; and **collaborative access controls** that enable organization-wide knowledge sharing while maintaining security. [glean](https://glean.ly/) [Glean](https://glean.ly/)

## User workflow and interaction model

**From a user perspective, Glean.ly operates through a structured workflow** that fundamentally changes how research is documented and leveraged. Users begin by **creating experiments** that establish context for research activities, then systematically **add facts** by inputting objective findings like user quotes, observations, and data points.

**The critical step is generating insights** where users analyze facts to create interpretive conclusions, often drawing connections between facts from different experiments. Users then **develop recommendations** that transform insights into actionable next steps, creating testable hypotheses that can generate new experiments.

**The interface uses a card-based system** where each atomic element exists as individual, linkable units. Users can **search and discover** relevant research through comprehensive filtering and tagging, **collaborate** by sharing findings with stakeholders, and **track evolution** as insights develop over time with new supporting or contradicting evidence.

**The workflow emphasizes reusability**—insights from past research automatically become available for new projects, preventing duplication and enabling pattern recognition across different studies and time periods. [Marvel](https://marvelapp.com/blog/atomic-ux-research/)

## Essential versus nice-to-have features

**Applying YAGNI, KISS, and DRY principles reveals a clear hierarchy of functionality**. [martinfowler](https://martinfowler.com/bliki/Yagni.html) [boldare](https://www.boldare.com/blog/kiss-yagni-dry-principles/) The absolutely essential features represent the minimum viable core that delivers the primary value proposition.

**Essential features (Must Have):**
- Basic atomic structure (Experiments, Facts, Insights, Recommendations) [UXtweak](https://blog.uxtweak.com/atomic-ux-research/) [Productfruits](https://gleanly.productfruits.help/en/article/understanding-atomic-ux-research)
- Manual data entry with simple text inputs
- Basic tagging system for organization [QuestionPro](https://www.questionpro.com/blog/atomic-research/) [User Interviews](https://www.userinterviews.com/ux-research-field-guide-chapter/atomic-research-nuggets)
- Simple search functionality across all atoms [User Interviews](https://www.userinterviews.com/ux-research-field-guide-chapter/atomic-research-nuggets)
- File upload capability for evidence (images, quotes, documents) [QuestionPro](https://www.questionpro.com/blog/atomic-research/) [User Interviews](https://www.userinterviews.com/ux-research-field-guide-chapter/atomic-research-nuggets)
- Basic user authentication and project creation
- Export functionality to preserve data portability
- Simple linking between related atoms across experiments

**Important but not critical (Should Have):**
- Advanced search with multiple filter combinations
- Confidence scoring algorithm implementation [Glean](https://glean.ly/)
- Custom taxonomy and category management
- Basic reporting and summary generation
- Team collaboration features like comments
- Bulk operations for managing multiple atoms
- Simple visualization of connected insights

**Nice-to-have enhancements (Could Have):**
- Advanced analytics and trend analysis
- API integrations with other research tools
- Automated pattern recognition across research
- Custom dashboard creation
- Advanced permission management
- Mobile application access
- Bulk import from existing research documents

**Definitively excluded (Won't Have in MVP):**
- AI-powered insight generation
- Sophisticated data visualization tools
- Advanced workflow automation
- Single sign-on integrations
- Real-time collaboration editing
- Predictive analytics capabilities

## Atomic UX research methodology and connection to Glean.ly

**Atomic UX research is a transformative methodology developed around 2017** by Tomer Sharon and Daniel Pidcock [User Interviews](https://www.userinterviews.com/ux-research-field-guide-chapter/atomic-research-nuggets) that addresses fundamental problems in traditional UX research: knowledge silos, research duplication, and inaccessible insights trapped in static documents. [User Interviews +3](https://www.userinterviews.com/ux-research-field-guide-chapter/atomic-research-nuggets)

**The methodology redefines the atomic unit of research insight** from traditional reports and slide decks to "nuggets"—tagged observations supported by evidence that represent single-experience insights about customer behavior. [User Interviews](https://www.userinterviews.com/ux-research-field-guide-chapter/atomic-research-nuggets) [QuestionPro](https://www.questionpro.com/blog/atomic-research/) **This granular approach enables insights to be recombined across different studies**, creating a living repository where knowledge compounds over time. [Marvel](https://marvelapp.com/blog/atomic-ux-research/)

**Key principles include evidence-based conclusions** where every insight must be supported by concrete data, **reusability across contexts** where research atoms can be applied to different projects, and **searchable knowledge management** where all insights are tagged and easily discoverable. [QuestionPro](https://www.questionpro.com/blog/atomic-research/) [Marvel](https://marvelapp.com/blog/atomic-ux-research/)

**Glean.ly was specifically created to implement atomic UX research at scale**. The platform embodies these principles through its forced atomic structure, confidence scoring based on evidence quality, cross-study connection capabilities, and collaborative access that democratizes research knowledge beyond just researchers. [Glean](https://glean.ly/) [glean](https://glean.ly/)

**The methodology addresses three critical organizational problems:** preventing research waste through reusability, accelerating decision-making through accessible insights, and maintaining institutional knowledge despite team changes. [QuestionPro](https://www.questionpro.com/blog/atomic-research/) **Glean.ly serves as the infrastructure** that makes atomic research practical for large organizations.

## Absolute minimum viable version architecture

**Following YAGNI principles strictly, the absolute minimum viable version** would focus solely on the core atomic workflow without advanced features that might be anticipated but aren't immediately necessary. [martinfowler](https://martinfowler.com/bliki/Yagni.html)

**Core technical components would include:**
- Simple database schema with four main tables (Experiments, Facts, Insights, Recommendations) [Productfruits](https://gleanly.productfruits.help/en/article/understanding-atomic-ux-research) plus supporting tables for Tags and Evidence
- Basic CRUD operations for creating and editing atomic research units
- Simple text search functionality across all content
- File upload capability for supporting evidence
- Basic user authentication and project organization
- Export functionality to CSV or similar format for data portability

**The minimal user interface would provide:**
- Single project workspace with card-based layout for atomic units
- Simple forms for creating each type of atom with character limits to enforce focus
- Basic tagging interface for organization
- Search box with simple filtering options
- File attachment capability for evidence
- Manual linking functionality to connect related atoms

**Essential workflow would be:**
1. User creates account and project
2. User documents experiment methodology and context
3. User adds objective facts with supporting evidence
4. User creates insights by interpreting facts
5. User develops actionable recommendations
6. User can search and discover previous research when starting new projects

**This minimal version would require approximately 3-4 months of development** with a small team, focusing on a web-based interface that enforces the atomic research methodology through structural constraints rather than advanced features.

**Success metrics for the MVP** would center on workflow completion rates (users successfully creating connected atoms across the four categories), time-to-first-value under 15 minutes, and ability to search and reuse insights from previous experiments.

**The key insight for PRD development** is that Glean.ly's competitive advantage comes not from sophisticated features but from disciplined implementation of a proven methodology [Glean](https://glean.ly/) combined with simple, effective tooling that enforces good research practices through design constraints. The minimum viable version should prioritize methodology compliance and basic usability over advanced analytics or complex integrations. [Agile Alliance |](https://agilealliance.org/glossary/mvp/)
