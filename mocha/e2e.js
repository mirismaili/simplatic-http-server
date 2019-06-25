/**
 * Created at 1398/4/1 (2019/6/22).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */
'use strict'

const puppeteer = require('puppeteer')
const {expect} = require('chai')
const StaticServer = require('../dist/main.umd.js')

const mockPageUrl = 'http://127.0.0.1:3000/mocha/stub'

const staticServer = new StaticServer(3000)

before(async () => {
	global.expect = expect
	//****************************************************************************/
	
	const launchPuppeteerPromise = new Promise((resolve, reject) => {
		puppeteer.launch(
				{
					// headless: false,
					// // slowMo: 500,
					// devtools: true,
				}
		).then(browser => {
			global.browser = browser
			resolve()
		}, reject)
	})
	
	// noinspection JSCheckFunctionSignatures
	await Promise.all([staticServer.listen(), launchPuppeteerPromise])
})

describe('sample test', () => {
	it('should work', async () => {
		const page = (await browser.pages())[0];
		
		const errors = []
		const handler = err => errors.push(err)
		
		page.on('requestfailed', handler)
		page.on('pageerror', handler)
		page.on('error', handler)
		
		await page.goto(mockPageUrl)
		
		const pageTitle = await page.title()
		
		expect(pageTitle).to.equal('Mock HTML')
		expect(errors).to.be.empty
	})
})

after(async () => {
	// noinspection JSCheckFunctionSignatures
	await Promise.all([browser.close(), staticServer.shutdown()])
})