import { Request, Response } from 'express'
import puppeteer from 'puppeteer'
import { EError, EErrorCapturingScreenshot, ELanguage } from '../../types'

const takeScreenshot = async (req: Request, res: Response) => {
  const { url, selector, language, localStorageData, width, height } = req.body

  try {
    console.log('Launching browser...')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreDefaultArgs: ['--disable-extensions'],
    })
    const page = await browser.newPage()

    await page.setViewport({ width, height })

    // Get localStorage data
    if (localStorageData) {
      await page.evaluateOnNewDocument((data) => {
        for (const key in data) {
          localStorage.setItem(key, data[key])
        }
      }, localStorageData)
    }

    await page.goto(url, { waitUntil: 'networkidle2' })

    const lastChar = selector.slice(-1)
    // hide controls
    await page.waitForSelector(`#toggle-controls${lastChar}`)
    await page.click(`#toggle-controls${lastChar}`)

    //stop animation
    await page.waitForSelector(`#stop-blobs${lastChar}`)
    await page.click(`#stop-blobs${lastChar}`)

    // Hide the to-top-btn button
    await page.evaluate(() => {
      const toTopBtn = document.getElementById('to-top-btn')
      if (toTopBtn) {
        toTopBtn.style.display = 'none'
      }
      const menu = document.getElementById('site-navigation')
      if (menu) {
        menu.style.display = 'none'
      }
    })

    const element = await page.$(selector)
    if (!element) {
      await browser.close()
      return res.status(404).send('Screenshot target not found')
    }
    const screenshotBuffer = await element.screenshot()
    const screenshot = Buffer.from(screenshotBuffer).toString('base64')

    await browser.close()

    res.setHeader('Content-Type', 'application/json')
    res.send({ screenshot })
  } catch (error) {
    console.error(`${EErrorCapturingScreenshot[language as ELanguage]}:`, error)
    res.status(500).send(`${EError[language as ELanguage]}, ${(error as Error).message}`)
  }
}
export { takeScreenshot }
