import { Bot, Cpu, ScrollText, Github, Box, Search } from 'lucide-react'

const ICONS = {
  bot: Bot,
  cpu: Cpu,
  scroll: ScrollText,
  github: Github,
  box: Box,
  google: Search, // generic stand-in icon — swap for a real brand asset if needed
}

export default function SourceIcon({ icon, className, style }) {
  const Icon = ICONS[icon] ?? Bot
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full ${style} ${className}`}>
      <Icon className="h-1/2 w-1/2" />
    </span>
  )
}
