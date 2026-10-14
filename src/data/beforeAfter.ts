// Before/after cases published on @clinicaholly. Titles and descriptions come from the
// clinic's own captions; patient consent was confirmed by the clinic (14/10/2026).

export interface BeforeAfterCase {
  id: string
  tag: string
  thumb: string
  title: string
  description: string
  source: string
}

export const beforeAfterCases: readonly BeforeAfterCase[] = [
  {
    id: 'porcelana-pura',
    tag: 'Porcelana pura',
    thumb: 'Porcelana',
    title: 'Troca de resinas para porcelanas puras',
    description: 'A troca das resinas por porcelanas puras proporciona um resultado mais sofisticado, natural e personalizado, respeitando a harmonia do sorriso e as características de cada paciente.',
    source: 'https://www.instagram.com/p/DeAHdcRCXNK/',
  },
  {
    id: 'resina',
    tag: 'Resina composta',
    thumb: 'Resina',
    title: 'Transformação em resina composta',
    description: 'Você achou que seu sorriso não precisava de nada. Até ver isso.',
    source: 'https://www.instagram.com/p/DdCRfpmiW4f/',
  },
  {
    id: 'protocolo',
    tag: 'Implante tipo protocolo',
    thumb: 'Protocolo',
    title: 'Mais estabilidade, segurança e confiança para sorrir',
    description: 'O implante protocolo é uma prótese fixa apoiada sobre implantes, indicada para quem perdeu todos ou grande parte dos dentes de uma arcada. Procedimento sujeito à avaliação e indicação profissional.',
    source: 'https://www.instagram.com/p/DdrrYd5CXHC/',
  },
  {
    id: 'harmonizacao',
    tag: 'Ângulo de mandíbula e mento',
    thumb: 'Harmonização',
    title: 'Nem toda harmonização precisa de mais',
    description: 'Às vezes, precisa de correção. O paciente já havia realizado um procedimento anteriormente; nosso trabalho foi reavaliar, corrigir e devolver equilíbrio aos detalhes, respeitando os traços e a identidade do rosto.',
    source: 'https://www.instagram.com/p/DczH9UACYJQ/',
  },
]

export function beforeAfterImage(id: string, side: 'antes' | 'depois', width: 540 | 1080 = 1080): string {
  return `/images/ba-${id}-${side}-${width}.webp`
}

export function beforeAfterSrcset(id: string, side: 'antes' | 'depois'): string {
  return `${beforeAfterImage(id, side, 540)} 540w, ${beforeAfterImage(id, side, 1080)} 1080w`
}
