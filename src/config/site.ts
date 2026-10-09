export const SITE = {
  name: 'Dani // Cybersec',
  title: 'Dani Iglesias — Writeups de ciberseguridad',
  description:
    'Writeups de máquinas vulnerables, notas de pentesting y aprendizaje de hacking ético por Daniel Iglesias Franco.',
  author: 'Daniel Iglesias Franco',
  location: 'Cáceres, España',
  github: 'https://github.com/naanii021',
} as const;

export const PLATFORM_LABELS = {
  dockerlabs: 'DockerLabs',
  hackmyvm: 'HackMyVM',
  tryhackme: 'TryHackMe',
  hackthebox: 'HackTheBox',
  portswigger: 'PortSwigger',
} as const;

export const DIFFICULTY_LABELS = {
  'muy-facil': 'Muy fácil',
  facil: 'Fácil',
  media: 'Media',
  dificil: 'Difícil',
  insane: 'Insane',
} as const;

export const OS_LABELS = {
  linux: 'Linux',
  windows: 'Windows',
} as const;
