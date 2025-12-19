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
      label: 'Part 1 - Foundations', // Label matching the prefix
      items: [
        { type: 'doc', id: 'part-1-foundations/01-introduction' },
        { type: 'doc', id: 'part-1-foundations/02-physical-ai-basics' },
        { type: 'doc', id: 'part-1-foundations/03-humanoid-systems' },
        { type: 'doc', id: 'part-1-foundations/04-anatomy' },
        { type: 'doc', id: 'part-1-foundations/05-locomotion-balance' },
        { type: 'doc', id: 'part-1-foundations/06-history-evolution' },
        { type: 'doc', id: 'part-1-foundations/07-physical-ai-principles' },
      ],
    },
    {
      type: 'category',
      label: 'Part 2 - Humanoid Robot Anatomy & Mechanics', // Label matching the prefix
      items: [
        { type: 'doc', id: 'part-2-humanoid-robot-anatomy-mechanics/08-robot-anatomy-actuation' },
        { type: 'doc', id: 'part-2-humanoid-robot-anatomy-mechanics/09-sensors-perception' },
        { type: 'doc', id: 'part-2-humanoid-robot-anatomy-mechanics/10-manipulation-grasping' },
      ],
    },
    {
      type: 'category',
      label: 'Part 3 - AI & Control Systems', // Label matching the prefix
      items: [
        { type: 'doc', id: 'part-3-ai-control-systems/11-control-systems' },
        { type: 'doc', id: 'part-3-ai-control-systems/12-learning-in-physical-ai' },
        { type: 'doc', id: 'part-3-ai-control-systems/13-computer-vision-perception-ai' },
        { type: 'doc', id: 'part-3-ai-control-systems/14-human-robot-interaction' },
      ],
    },
    {
      type: 'category',
      label: 'Part 4 - Implementation & Projects', // Label matching the prefix
      items: [
        { type: 'doc', id: 'part-4-implementation-projects/15-educational-hybrid-learning-kits' },
        { type: 'doc', id: 'part-4-implementation-projects/16-project-planning-task-management' },
        { type: 'doc', id: 'part-4-implementation-projects/17-practical-implementation-examples' },
        { type: 'doc', id: 'part-4-implementation-projects/18-rag-chatbot-integration' },
        { type: 'doc', id: 'part-4-implementation-projects/19-user-personalization-multi-language' },
      ],
    },
    {
      type: 'category',
      label: 'Part 5 - Testing, Research & Future', // Label matching the prefix
      items: [
        { type: 'doc', id: 'part-5-testing-research-future/20-testing-validation-debugging' },
        { type: 'doc', id: 'part-5-testing-research-future/21-case-studies-research-projects' },
        { type: 'doc', id: 'part-5-testing-research-future/22-advanced-ai-algorithms' },
        { type: 'doc', id: 'part-5-testing-research-future/23-future-trends-directions' },
      ],
    },
  ],
};

// The sidebars object is exported so that it can be used by Docusaurus.
export default sidebars;