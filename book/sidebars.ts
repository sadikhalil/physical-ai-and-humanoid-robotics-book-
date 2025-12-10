// The sidebars can be generated from the filesystem, or explicitly defined here.
// Create as many sidebars as you want.

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Creating a sidebar enables you to:
// - create an ordered group of docs
// - render a sidebar for each doc of that group
// - provide next/previous navigation

const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Part 1: Foundations',
      items: [
        { type: 'doc', id: 'Part 1 - Foundations/introduction' },
        { type: 'doc', id: 'Part 1 - Foundations/physical-ai-basics' },
        { type: 'doc', id: 'Part 1 - Foundations/humanoid-systems' },
        { type: 'doc', id: 'Part 1 - Foundations/anatomy' },
        { type: 'doc', id: 'Part 1 - Foundations/locomotion-balance' },
        { type: 'doc', id: 'Part 1 - Foundations/history-evolution' },
        { type: 'doc', id: 'Part 1 - Foundations/physical-ai-principles' },
      ],
    },
    {
      type: 'category',
      label: 'Part 2: Humanoid Robot Anatomy & Mechanics',
      items: [
        { type: 'doc', id: 'Part 2 - Humanoid Robot Anatomy & Mechanics/robot-anatomy-actuation' },
        { type: 'doc', id: 'Part 2 - Humanoid Robot Anatomy & Mechanics/sensors-perception' },
        { type: 'doc', id: 'Part 2 - Humanoid Robot Anatomy & Mechanics/manipulation-grasping' },
      ],
    },
    {
      type: 'category',
      label: 'Part 3: AI & Control Systems',
      items: [
        { type: 'doc', id: 'Part 3 - AI & Control Systems/control-systems' },
        { type: 'doc', id: 'Part 3 - AI & Control Systems/learning-in-physical-ai' },
        { type: 'doc', id: 'Part 3 - AI & Control Systems/computer-vision-perception-ai' },
        { type: 'doc', id: 'Part 3 - AI & Control Systems/human-robot-interaction' },
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Implementation & Projects',
      items: [
        { type: 'doc', id: 'Part 4 - Implementation & Projects/educational-hybrid-learning-kits' },
        { type: 'doc', id: 'Part 4 - Implementation & Projects/project-planning-task-management' },
        { type: 'doc', id: 'Part 4 - Implementation & Projects/practical-implementation-examples' },
        { type: 'doc', id: 'Part 4 - Implementation & Projects/rag-chatbot-integration' },

        { type: 'doc', id: 'Part 4 - Implementation & Projects/user-personalization-multi-language' },
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Testing, Research & Future',
      items: [
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/testing-validation-debugging' },
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/case-studies-research-projects' },
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/advanced-ai-algorithms' },
        { type: 'doc', id: 'Part 5 - Testing, Research & Future/future-trends-directions' },
      ],
    },
  ],
};

// The sidebars object is exported so that it can be used by Docusaurus.
export default sidebars;
