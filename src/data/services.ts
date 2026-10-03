// Service list as supplied by the clinic (23/09/2026). Lentes, estética e implantes are the
// three highlights the clinic asked to feature; the remaining categories complete the menu.

export interface ServiceCategory {
  id: string
  title: string
  featured: boolean
  summary: string
  items: readonly string[]
  note?: string
}

export const serviceCategories: readonly ServiceCategory[] = [
  {
    id: 'lentes',
    title: 'Lentes & facetas',
    featured: true,
    summary: 'Quatro técnicas, da resina à porcelana pura, planejadas para o seu sorriso.',
    items: ['Faceta básica', 'Faceta estratificada', 'Faceta híbrida', 'Porcelana pura', 'Manutenção das lentes, com ou sem quebra', 'Recapeamento das lentes'],
    note: 'Facetas por arcada: 10 dentes superiores e/ou 10 inferiores.',
  },
  {
    id: 'estetica',
    title: 'Estética facial',
    featured: true,
    summary: 'Preenchimentos, botox, bioestimulador e fios de PDO, sempre com naturalidade.',
    items: ['Preenchimento labial', 'Preenchimento mandibular e de mento', 'Rinomodelação', 'Bichectomia', 'Bioestimulador', 'Lipo de papada', 'Botox full face', 'Gengivoplastia', 'Fio de PDO espiculado', 'Fio de PDO liso', 'Minilift'],
  },
  {
    id: 'implantes',
    title: 'Implantes',
    featured: true,
    summary: 'Do implante unitário ao protocolo, em porcelana, híbrida ou resina.',
    items: ['Implante unitário', 'Protocolo'],
    note: 'Em porcelana, híbrida ou resina.',
  },
  {
    id: 'clareamento',
    title: 'Clareamento',
    featured: false,
    summary: 'Opções em consultório e em casa.',
    items: ['Clareamento a laser (2 sessões)', 'Clareamento caseiro (2 bisnagas + placa)'],
  },
  {
    id: 'clinica',
    title: 'Clínica geral',
    featured: false,
    summary: 'Cuidado completo para a saúde do sorriso.',
    items: ['Atendimento clínico geral', 'Atendimento por convênio'],
    note: 'Convênios: MetLife, SulAmérica e OdontoGroup.',
  },
]
