const expect = require('chai').expect
const puppeteer = require('puppeteer')

describe('New Box', function() {

    // enters the content into the form on the page
    async function fillForm(page, content) {
        await page.waitForSelector('#time')
        await page.type('#time', content.time.year)
        await page.keyboard.press('Tab')
        await page.type('#time', content.time.other)
        await page.type('#details', content.details)
        await page.type('#email', content.email)
        await page.click('[type=submit]')
    }

    // checks if the cerroct error is displayed
    async function checkIfErrorIs(page, errorMessage) {
        await page.waitForSelector('.errors')
        let errors = await page.$('.errors')
        let error = await errors.$('p')
        let errorText = await page.evaluate(element => element.textContent, error)
        expect(errorText).to.be.equal(errorMessage)
    }

    it('should display an error if the date is in the past', async () => {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 10
        })
        const page = await browser.newPage()
        await page.goto('localhost:8000/newBox')

        await fillForm(page, {
            time: {
                year: '2000',
                other: '01011111A'
            },
            details: 'Some Details',
            email: 'example@gmail.com'
        })

        // test if the error is showing
        await checkIfErrorIs(page, 'The opening time must be in the future')

        browser.close()
    }).timeout(20000)

    it('should display an error if the desription is too long (>255)', async () => {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 10
        })
        const page = await browser.newPage()
        await page.goto('localhost:8000/newBox')

        // navigations
        await fillForm(page, {
            time: {
                year: '2050',
                other: '01011111A'
            },
            details: 'Some Details',
            email: ''
        })

        await checkIfErrorIs(page, 'Please specify your email - we will use it to send you the results')

        browser.close()
    }).timeout(20000)
})
