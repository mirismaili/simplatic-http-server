/**
 * Created at 1398/4/1 (2019/6/22).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */
'use strict'

const puppeteer = require('puppeteer')
const {expect} = require('chai')
const StaticServer = require('../dist/main.umd.js')

const PORT = 3000
const PORT2 = 3001

const mockPageUrl = `http://127.0.0.1:${PORT}/mock/index.html`
const mockPageUrl2 = `http://127.0.0.1:${PORT2}/mocha/mock/index.html`
const _404PageUrl = `http://127.0.0.1:${PORT2}/404`

const staticServer = new StaticServer(PORT, __dirname)
const staticServer2 = new StaticServer(PORT2)

before(async () => {
	global.expect = expect
	//****************************************************************************/
	
	const launchPuppeteerPromise = new Promise((resolve, reject) => {
		puppeteer.launch(
				// {
				// 	headless: false,
				// 	// slowMo: 500,
				// 	devtools: true,
				// }
		).then(browser => {
			global.browser = browser
			resolve()
		}, reject)
	})
	
	// noinspection JSCheckFunctionSignatures
	await Promise.all([staticServer.listen(), staticServer2.listen(), launchPuppeteerPromise])
})

describe('End-to-end tests using puppeteer', () => {
	it('Should load mock page as expected and without any error', async () => {
		const page = (await browser.pages())[0];
		
		const errors = []
		const handler = err => errors.push(err)
		
		page.on('requestfailed', handler)
		page.on('pageerror', handler)
		page.on('error', handler)
		
		const response = await page.goto(mockPageUrl)
		
		expect(response.status()).to.equal(200)
		
		expect(response.headers()['content-type']).to.equal('text/html')

		expect(await page.title()).to.equal('Mock HTML')
		
		expect(await page.evaluate(() => [
			testEl.innerHTML,
			window.getComputedStyle(testEl).getPropertyValue('font-size'),
		])).to.eql([
			'Hello World!',
			'100px',
		])
		
		// To cover other things:
		expect((await page.goto(mockPageUrl2)).status()).to.equal(200)
		expect((await page.goto(_404PageUrl)).status()).to.equal(404)
		
		expect(errors).to.be.empty
	})
})

after(async () => {
	// noinspection JSCheckFunctionSignatures
	await Promise.all([browser.close(), staticServer2.shutdown(), staticServer.shutdown()])
})