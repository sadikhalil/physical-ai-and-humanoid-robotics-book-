import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Part 1: Foundations',
      items: [
        { type: 'doc', id: 'Part 1 - Foundations/01-introduction' },
        { type: 'doc', id: 'Part 1 - Foundations/02-physical-ai-basics' },
        { type: 'doc', id: 'Part 1 - Foundations/03-humanoid-systems' },
        { type: 'doc', id: 'Part 1 - Foundations/04-anatomy' },
        { type: 'doc', id: 'Part 1 - Foundations/05-locomotion-balance' },
        { type: 'doc', id: 'Part 1 - Foundations/06-history-evolution' },
        { type: 'doc', id: 'Part 1 - Foundations/07-physical-ai-principles' },
      ],
    },
    {
      type: 'category',
      label: 'Part 2: Humanoid Robot Anatomy & Mechanics',
      items: [
        { type: 'doc', id: 'Part 2 - Humanoid Robot Anatomy & Mechanics/08-robot-anatomy-actuation' },
        { type: 'doc', id: 'Part 2 - Humanoid Robot Anatomy & Mechanics/09-sensors-perception' },
        { type: 'doc', id: 'Part 2 - Humanoid Robot Anatomy & Mechanics/10-manipulation-grasping' },
      ],
    },
    {
      type: 'category',
      label: 'Part 3: AI & Control Systems',
      items: [
        { type: 'doc', id: 'Part 3 - AI & Control Systems/11-control-systems' },
        { type: 'doc', id: 'Part 3 - AI & Control Systems/12-learning-in-physical-ai' },
        { type: 'doc', id: 'Part 3 - AI & Control Systems/13-computer-vision-perception-ai' },
        { type: 'doc', id: 'Part 3 - AI & Control Systems/14-human-robot-interaction' },
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Implementation & Projects',
      items: [
        { type: 'doc', id: 'Part 4 - Implementation & Projects/15-educational-hybrid-learning-kits' },
        { type: 'doc', id: 'Part 4 - Implementation & Projects/16-project-planning-task-management' },
        { type: 'doc', id: 'Part 4 - Implementation & Projects/17-practical-implementation-examples' },
        { type: 'doc', id: 'Part 4 - Implementation & Projects/18-rag-chatbot-integration' },
        { type: 'doc', id: 'Part 4 - Implementation & Projects/19-user-personalization-multi-language' },
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Testing, Research & Future',
      items: [
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/20-testing-validation-debugging' },
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/21-case-studies-research-projects' },
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/22-advanced-ai-algorithms' },
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/23-future-trends-directions' },
      ],
    },
  ],
};

export default sidebars;
