const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    const acceptCookieButton = await page.$('.cookie-consent button');

    if (acceptCookieButton) {
        await acceptCookieButton.click();
        await page.waitForTimeout(3000);
    }

    const fileName = 'element_content.txt';
    fs.writeFileSync(fileName, '');

    let startElement = 'English'; // Starting element
    let targetElement = 'London'; // Target element
    let specificWordFound = false;
    let currentElement = startElement;

    while (!specificWordFound) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const focusedElementContent = await page.evaluate(() => {
            const focusedElement = document.activeElement;
            if (focusedElement) {
                return focusedElement.innerText;
            }
            return null;
        });

        const logMessage = `Content of the focused element: ${focusedElementContent}`;
        console.log(logMessage);

        try {
            fs.appendFileSync(fileName, logMessage + '\n');
            console.log(`Content appended to ${fileName}`);
        } catch (err) {
            console.error('Error writing to file:', err);
        }

        if (focusedElementContent.includes(currentElement)) {
            // Click on the current element
            await page.keyboard.press('Enter');
            await page.waitForTimeout(3000); // Wait for the new page to load

            // Create a new page instance for the new page
            const newPage = await browser.newPage();

            // Check if the target element is found on the new page
            const newPageContent = await newPage.content();
            if (newPageContent.includes(targetElement)) {
                specificWordFound = true; // Mark the target element as found
            } else {
                // Look for a new element that's close to the target
                currentElement = 'World city'; // Update the current element to search for
            }
        }
    }

    // Close the browser manually when you're done
    // await browser.close();
})();
