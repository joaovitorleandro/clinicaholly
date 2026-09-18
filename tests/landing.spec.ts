import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const runtimeErrors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  runtimeErrors.set(page, errors)
  page.on('pageerror', (error) => errors.push(error.message))
})

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page) ?? [], 'The page must not produce uncaught JavaScript errors').toEqual([])
})

async function openLanding(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Seu sorriso\.\s*Sua assinatura\./)
}

async function scrollThroughPage(page: Page): Promise<void> {
  const sections = page.locator('main > section')
  for (let index = 0; index < await sections.count(); index += 1) {
    await sections.nth(index).scrollIntoViewIfNeeded()
    await page.waitForTimeout(120)
    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      viewport: window.innerWidth,
    }))
    expect(overflow.document, `Horizontal document overflow near section ${index + 1}`).toBeLessThanOrEqual(overflow.viewport + 1)
    expect(overflow.body, `Horizontal body overflow near section ${index + 1}`).toBeLessThanOrEqual(overflow.viewport + 1)
  }
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded()
}

async function expectImagesLoaded(page: Page): Promise<void> {
  await expect.poll(async () => page.locator('img').evaluateAll((images) => (images as HTMLImageElement[])
    .filter((image) => !image.complete || image.naturalWidth === 0)
    .map((image) => image.currentSrc || image.src)), {
    message: 'All real photographs and brand assets should load, including lazy images',
    timeout: 12_000,
  }).toEqual([])
}

for (const width of [360, 390, 430, 768, 1024, 1440, 1920]) {
  test(`layout and photography remain intact at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
    await openLanding(page)
    if (width === 390 || width === 1440) {
      await page.waitForTimeout(1400)
      await page.screenshot({ path: `/tmp/holly-qa-${width === 390 ? 'mobile' : 'desktop'}-hero.png` })
    }
    await scrollThroughPage(page)
    await expectImagesLoaded(page)
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: `/tmp/holly-qa-${width === 390 ? 'mobile' : 'desktop'}-full.png`, fullPage: true })
    }
  })
}

test('appointment links preserve the approved WhatsApp number and external-link protections', async ({ page }) => {
  await openLanding(page)
  const links = page.locator('a[href*="wa.me/"]')
  expect(await links.count()).toBeGreaterThanOrEqual(5)
  for (const link of await links.all()) {
    const destination = new URL((await link.getAttribute('href')) ?? '')
    expect(destination.origin).toBe('https://wa.me')
    expect(destination.pathname).toBe('/5511953198144')
    expect(destination.searchParams.get('text')).toContain('avaliação')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
    await expect(link).toHaveAttribute('rel', /noreferrer/)
  }
})

test('mobile navigation traps focus, closes with Escape and reaches the selected section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openLanding(page)
  const opener = page.getByRole('button', { name: 'Abrir menu de navegação' })
  const menu = page.getByRole('dialog', { name: 'Navegação principal', exact: true })
  await opener.click()
  await expect(menu).toBeVisible()
  await expect(opener).toHaveAttribute('aria-expanded', 'true')
  await expect(menu.getByRole('button', { name: 'Fechar menu', exact: true })).toBeFocused()
  for (let index = 0; index < 11; index += 1) {
    await page.keyboard.press('Tab')
    expect(await menu.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(menu).not.toBeVisible()
  await expect(opener).toHaveAttribute('aria-expanded', 'false')
  await expect(opener).toBeFocused()
  await opener.click()
  await menu.getByRole('link', { name: /Especialidades/ }).click()
  await expect(menu).not.toBeVisible()
  await expect(page.locator('#especialidades')).toBeInViewport()
})

test('specialties can be expanded and collapsed entirely by keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openLanding(page)
  const button = page.getByRole('button', { name: 'Explorar Harmonização facial' })
  await button.scrollIntoViewIfNeeded()
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  const detailsId = await button.getAttribute('aria-controls')
  const details = page.locator(`[id="${detailsId}"]`)
  await expect(details.getByText('Equilíbrio e leveza para valorizar sua expressão.')).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(details.getByRole('link', { name: 'Agendar avaliação' })).toBeFocused()
  await button.focus()
  await page.keyboard.press('Space')
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await expect(details).toHaveAttribute('aria-hidden', 'true')
})

test.describe('touch interaction', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

  test('specialties expose details and appointment links without hover', async ({ page }) => {
    await openLanding(page)
    const button = page.getByRole('button', { name: 'Explorar Odontologia integrada' })
    await button.scrollIntoViewIfNeeded()
    await button.tap()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const detailsId = await button.getAttribute('aria-controls')
    await expect(page.locator(`[id="${detailsId}"]`).getByRole('link', { name: 'Agendar avaliação' })).toBeVisible()
    await button.tap()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})

test('result gallery supports arrow navigation, closing and focus restoration', async ({ page }) => {
  await openLanding(page)
  const opener = page.getByRole('button', { name: 'Ampliar fotografia: Estética dentária' })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'Galeria de resultados da Clínica Holly' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Fechar fotografia' })).toBeFocused()
  const photograph = dialog.getByRole('img')
  const firstSource = await photograph.getAttribute('src')
  await page.keyboard.press('ArrowRight')
  await expect(photograph).not.toHaveAttribute('src', firstSource ?? '')
  await expect(dialog.getByText('02 / 03', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Fotografia anterior' }).click()
  await expect(photograph).toHaveAttribute('src', firstSource ?? '')
  await page.keyboard.press('ArrowLeft')
  await expect(dialog.getByText('03 / 03', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
  await opener.click()
  await dialog.getByRole('button', { name: 'Fechar fotografia' }).click()
  await expect(dialog).not.toBeVisible()
})

test('privacy information opens, closes and restores keyboard focus', async ({ page }) => {
  await openLanding(page)
  const opener = page.getByRole('button', { name: 'Privacidade' })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: /Antes de cada escolha/ })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Avaliação online' })).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Falar com a equipe' })).toHaveAttribute('href', /^https:\/\/wa.me\/5511953198144/)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
  await opener.click()
  await dialog.getByRole('button', { name: 'Fechar informações de privacidade' }).click()
  await expect(dialog).not.toBeVisible()
})

test('reduced motion exposes the entire story without a prolonged sticky hero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openLanding(page)
  const hero = page.locator('#inicio')
  const heroBounds = await hero.boundingBox()
  expect(heroBounds?.height).toBeLessThanOrEqual(1100)
  await expect(page.locator('#inicio').getByRole('link', { name: 'Quero minha avaliação' })).toBeVisible()
  const headings = page.locator('main h1, main h2')
  for (const heading of await headings.all()) {
    await heading.scrollIntoViewIfNeeded()
    await expect(heading).toBeVisible()
    expect(await heading.evaluate((element) => Number(getComputedStyle(element).opacity))).toBe(1)
    expect(await heading.evaluate((element) => getComputedStyle(element).transform)).toBe('none')
  }
  await scrollThroughPage(page)
  await expectImagesLoaded(page)
  await page.screenshot({ path: '/tmp/holly-qa-reduced-motion-full.png', fullPage: true })
})

test('WebGL failure retains photography, the Holly ornament and appointment access', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = new Proxy(nativeGetContext, {
      apply(target, receiver: HTMLCanvasElement, args: unknown[]) {
        if (typeof args[0] === 'string' && /webgl/i.test(args[0])) return null
        return Reflect.apply(target, receiver, args)
      },
    })
  })
  await openLanding(page)
  await expect(page.locator('#inicio h1')).toBeVisible()
  await expect(page.locator('#inicio').getByRole('link', { name: 'Quero minha avaliação' })).toBeVisible()
  await expect(page.locator('.hero-orbit-fallback')).toBeVisible()
  expect(await page.locator('.hero-orbit-fallback').evaluate((element) => Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.3)
  expect(await page.locator('#inicio img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await page.screenshot({ path: '/tmp/holly-qa-webgl-fallback.png' })
})
