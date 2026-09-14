export const mockAnalysisResult = {
  status: 'Analysis Complete',
  title: 'AI Robot for Identifying and Fetching Misplaced Objects',
  description:
    'The system analyzes your idea, searches for existing solutions, compares capabilities and identifies the gap in the current landscape.',
  overallResult: 'Partially Existing',
  overallResultNote:
    'Your idea builds on existing technologies, but combines them in a unique way.',
  proposed: 'A simple robot that identifies the correct object and brings it to the user.',
  existingTech: [
    'Object recognition (computer vision)',
    'Navigation and path planning',
    'Robotic manipulation (grippers/arms)',
  ],
  potentialGap:
    'Combining object recognition, navigation and manipulation in a single, affordable system that can find misplaced objects in everyday indoor environments — without requiring physical tags or manual input.',
  summary:
    'Your idea is partially existing. Similar solutions already use parts of the technology, but your approach to combine object recognition, navigation and tracking into one simple system (without tags) is less common and creates a potential gap in the market.',
}

export const similarSolutions = [
  {
    id: 1,
    name: 'Roomba (iRobot)',
    type: 'Consumer Product',
    icon: 'bot',
    iconBg: 'bg-violet-100 text-violet-600',
    description:
      'Uses cameras and sensors to navigate and clean spaces. Shows how robot navigation and object detection work in real environments.',
    capabilities: ['Navigation', 'Object Detection'],
  },
  {
    id: 2,
    name: 'Google DeepMind – Robotics',
    type: 'Research Paper',
    icon: 'brain',
    iconBg: 'bg-blue-500 text-white',
    description:
      'Research on robotic manipulation and visual perception. Demonstrates how AI models can identify and interact with objects in real-world settings.',
    capabilities: ['Object Recognition', 'Navigation'],
  },
  {
    id: 3,
    name: 'OpenVINO + ROS',
    type: 'Open Source Project',
    icon: 'cpu',
    iconBg: 'bg-gray-900 text-white',
    description:
      'Provides tools for object detection and robot control. Often used in research and student projects for autonomous robots.',
    capabilities: ['Object Detection', 'Robot Control'],
  },
]
