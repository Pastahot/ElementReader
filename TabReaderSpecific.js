const puppeteer = require('puppeteer');

const targetWord = 'ancient greek'; //Target Element Containing Specific word
let synonymsInPriorityOrder = ['modern greek', 'greek', 'socrates', 'censorship'].map(word => word.toLowerCase()); //Elements that could navigate us to the Target (Synonyms)
const startUrl = 'https://en.wikipedia.org/wiki/November_23';

async function navigateToPage(page, url) {
    try {
        await page.goto(url);
        await page.waitForSelector('body');
    } catch (error) {
        console.error(`Failed to navigate to ${url}: ${error}`);
        throw error;
    }
}

function isExactFullMatch(elementText, words) {
    return words.includes(elementText.trim());
}

async function tabThroughPage(page, words) {
    let foundWord = null;
    while (true) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const focusedElementText = await page.evaluate(() => {
            const focusedElement = document.activeElement;
            return focusedElement ? focusedElement.textContent.toLowerCase().trim() : null; 
        });

        if (focusedElementText && isExactFullMatch(focusedElementText, words)) {
            console.log(`Found exact match: ${focusedElementText}`);
            foundWord = focusedElementText;
            break;
        }
    }
    return foundWord;
}

async function clickFocusedElement(page) {
    const clicked = await page.evaluate(() => {
        const focusedElement = document.activeElement;
        if (focusedElement && (focusedElement.tagName === 'A' || focusedElement.tagName === 'BUTTON' || focusedElement.hasAttribute('onclick'))) {
            focusedElement.click();
            return true;
        }
        return false;
    });

    if (clicked) {
        await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(e => console.log("Navigation completed."));
    }

    return clicked;
}

(async () => {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    try {
        await navigateToPage(page, startUrl);

        while (true) {
            const foundWord = await tabThroughPage(page, [targetWord, ...synonymsInPriorityOrder]);
            if (foundWord) {
                const clicked = await clickFocusedElement(page);
                if (clicked) {
                    console.log(`Clicked on a link or clickable element.`);
                    await page.waitForSelector('body');
                } else {
                    console.log(`No clickable link or element found for the word.`);
                    break;
                }

                if (foundWord === targetWord) {
                    console.log(`Found and clicked on the target word: ${targetWord}`);
                    await page.waitForTimeout(5000); 
                    break; 
                }

                synonymsInPriorityOrder = synonymsInPriorityOrder.filter(word => word !== foundWord);
            } else {
                console.log(`Word not found on the current page. Ending script.`);
                break;
            }
        }
    } catch (error) {
        console.error(`Script failed: ${error}`);
    } finally {
        await browser.close();
    }
})();
