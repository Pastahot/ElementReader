# ElementReader
This script is a Puppeteer-based web automation tool designed to navigate web pages and search for a specific target word and its synonyms. Key features include:

- **Target Word Search**: Looks for the predefined target word "ancient greek" and a set of synonyms on a web page.
- **Case-Insensitive Comparison**: Converts words to lowercase to perform case-insensitive searches.
- **Tab Navigation**: Uses the 'Tab' key to navigate through page elements.
- **Exact Match Detection**: Identifies elements containing exactly the target word or synonyms, avoiding partial or incomplete matches.
- **Clickable Element Interaction**: Clicks on elements that contain the target word/synonyms and are clickable (like links or buttons).
- **Dynamic Synonyms Handling**: Removes synonyms from the search list once found, preventing repeated searches for the same word.
- **Script Termination**: Ends the program after finding and clicking the target word, following a 5-second wait.

This script is ideal for automated content discovery and interaction on web pages, specifically tailored for searching specific words and their synonyms.
