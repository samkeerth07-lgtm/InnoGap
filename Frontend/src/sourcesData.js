export const sourceFilters = [
  { key: 'all', label: 'All Sources' },
  { key: 'products', label: 'Products' },
  { key: 'research-papers', label: 'Research Papers' },
  { key: 'patents', label: 'Patents' },
  { key: 'open-source', label: 'Open Source' },
]

const BADGE_STYLES = {
  'Consumer Product': 'bg-blue-50 text-blue-600',
  'Research Paper': 'bg-violet-50 text-violet-600',
  'Open Source Project': 'bg-emerald-50 text-emerald-600',
  Patent: 'bg-amber-50 text-amber-600',
}

export function badgeClass(badge) {
  return BADGE_STYLES[badge] ?? 'bg-gray-100 text-gray-600'
}

export const sources = [
  {
    id: 'roomba',
    name: 'Roomba (iRobot)',
    badge: 'Consumer Product',
    category: 'products',
    icon: 'bot',
    iconStyle: 'bg-white text-violet-600 ring-2 ring-violet-200',
    summary:
      'Uses cameras and sensors to navigate and clean spaces. Shows how robot navigation and object detection work in real environments.',
    detail: {
      fullDescription:
        'Roomba is a consumer robotic vacuum cleaner that uses cameras and sensors to navigate and clean spaces. It demonstrates how robot navigation and object detection work in real environments.',
      capabilities: ['Navigation', 'Object Detection', 'Path Planning', 'Obstacle Avoidance'],
      whatItDoes: [
        'Uses cameras and sensors to detect objects and map the environment.',
        'Navigates autonomously using SLAM (Simultaneous Localization and Mapping).',
        'Avoids obstacles and cleans predefined areas.',
      ],
      relevance:
        'Shows how robot navigation and object detection work in real-world settings, which is similar to your idea of a robot finding and fetching misplaced objects.',
      type: 'Consumer Product',
      website: 'https://www.irobot.com',
      lastAccessed: 'Sep 10, 2025',
    },
  },
  {
    id: 'deepmind',
    name: 'Google DeepMind – Robotics',
    badge: 'Research Paper',
    category: 'research-papers',
    icon: 'google',
    iconStyle: 'bg-white ring-2 ring-gray-200',
    summary:
      'Research on robotic manipulation and visual perception. Demonstrates how AI models can identify and interact with objects in real-world settings.',
    detail: {
      fullDescription:
        'A research paper on robotic manipulation and visual perception, showing how AI models can identify and interact with objects placed in real-world settings.',
      capabilities: ['Object Recognition', 'Navigation', 'Visual Perception', 'Manipulation'],
      whatItDoes: [
        'Trains vision models to recognize and localize objects in cluttered scenes.',
        'Combines perception with robotic arm control for pick-and-place tasks.',
        'Evaluates generalization across previously unseen objects.',
      ],
      relevance:
        'Confirms that combining object recognition with manipulation is an active research area, close to the core of your proposed system.',
      type: 'Research Paper',
      website: 'https://deepmind.google/research',
      lastAccessed: 'Sep 8, 2025',
    },
  },
  {
    id: 'openvino-ros',
    name: 'OpenVINO + ROS',
    badge: 'Open Source Project',
    category: 'open-source',
    icon: 'cpu',
    iconStyle: 'bg-gray-900 text-white ring-2 ring-emerald-200',
    summary:
      'Provides tools for object detection and robot control. Often used in research and student projects for autonomous robots.',
    detail: {
      fullDescription:
        'An open-source toolkit pairing Intel OpenVINO with ROS (Robot Operating System) for object detection and robot control, widely used in research and student robotics projects.',
      capabilities: ['Object Detection', 'Robot Control', 'Model Optimization'],
      whatItDoes: [
        'Runs optimized object-detection models on edge hardware.',
        'Publishes detections as ROS topics for downstream navigation nodes.',
        'Provides reference pipelines for autonomous robot prototypes.',
      ],
      relevance:
        'A ready-made building block for the object-detection half of your system — worth benchmarking against before building custom models.',
      type: 'Open Source Project',
      website: 'https://github.com/openvinotoolkit',
      lastAccessed: 'Sep 5, 2025',
    },
  },
  {
    id: 'us-patent',
    name: 'US Patent 10,428,795',
    badge: 'Patent',
    category: 'patents',
    icon: 'scroll',
    iconStyle: 'bg-white text-amber-600 ring-2 ring-amber-200',
    summary:
      'Method for object recognition and tracking using visual data and machine learning.',
    detail: {
      fullDescription:
        'A granted US patent covering a method for object recognition and tracking using visual data combined with machine-learning models.',
      capabilities: ['Object Recognition', 'Object Tracking', 'Machine Learning'],
      whatItDoes: [
        'Describes a pipeline for recognizing objects from camera frames.',
        'Tracks recognized objects across frames using learned features.',
        'Claims cover both the recognition method and the tracking logic.',
      ],
      relevance:
        'Worth reviewing closely — overlapping claims here could affect the patentability of your recognition-and-tracking approach.',
      type: 'Patent',
      website: 'https://patents.google.com/patent/US10428795B2',
      lastAccessed: 'Sep 2, 2025',
    },
  },
  {
    id: 'github-object-finder',
    name: 'GitHub – Object Finder Robot',
    badge: 'Open Source Project',
    category: 'products',
    icon: 'github',
    iconStyle: 'bg-gray-900 text-white ring-2 ring-gray-200',
    summary:
      'Student project that combines object detection with robot navigation to fetch objects.',
    detail: {
      fullDescription:
        'A student-built open-source project that combines object detection with robot navigation so a small robot can locate and fetch objects around a room.',
      capabilities: ['Object Detection', 'Navigation', 'Fetching'],
      whatItDoes: [
        'Uses a pretrained detector to spot a target object in camera frames.',
        'Plans a path to the object using a simple occupancy-grid map.',
        'Drives a small chassis to the object and signals arrival.',
      ],
      relevance:
        'The closest existing match to your idea — it is worth comparing feature-by-feature to see exactly where your approach differs.',
      type: 'Open Source Project',
      website: 'https://github.com',
      lastAccessed: 'Sep 11, 2025',
    },
  },
  {
    id: 'amazon-astro',
    name: 'Amazon Astro',
    badge: 'Consumer Product',
    category: 'products',
    icon: 'box',
    iconStyle: 'bg-blue-500 text-white',
    summary: 'Home robot with object recognition and movement capabilities.',
    detail: {
      fullDescription:
        'Amazon Astro is a consumer home robot with object recognition and autonomous movement, designed for home monitoring and simple household tasks.',
      capabilities: ['Object Recognition', 'Navigation', 'Home Monitoring'],
      whatItDoes: [
        'Recognizes familiar faces and household items.',
        'Moves autonomously around mapped home environments.',
        'Streams alerts and video back to a companion app.',
      ],
      relevance:
        'Shows there is commercial appetite for home robots with recognition and mobility, though Astro does not focus on fetching misplaced items.',
      type: 'Consumer Product',
      website: 'https://www.amazon.com/astro',
      lastAccessed: 'Sep 1, 2025',
    },
  },
]
