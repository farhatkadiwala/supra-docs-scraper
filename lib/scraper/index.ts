// import axios from "axios";
// import * as cheerio from 'cheerio';

// export async function scrapeSupraDoc(documentationURL: string) {
//     if (!documentationURL) return;

//     // BrightData proxy configuration
//     const username = String(process.env.BRIGHT_DATA_USERNAME);
//     const password = String(process.env.BRIGHT_DATA_PASSWORD);
//     const port = 33335;
//     const session_id = (1000000 * Math.random()) | 0;

//     const options = {
//         auth: {
//         username: `${username}-session-${session_id}`,
//         password,
//         },
//         host: 'brd.superproxy.io:33335',
//         port,
//         rejectUnauthorized: false,
//     }

//     try {
//         const response = await axios.get(documentationURL, options);
//         const $ = cheerio.load(response.data);

//         const title = $(`<h1>`).text().trim();
//         console.log(response.data);
//     }
//     catch (error: any){
//         throw new Error(`Failed to scrape data: ${error.message}`)
//     }

// }

import axios from "axios";
import * as cheerio from 'cheerio';
import https from 'https';

export async function scrapeSupraDoc(documentationURL: string) {
    if (!/^https?:\/\//.test(documentationURL)) {
        throw new Error('Invalid URL provided');
    }

    // BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 33335;
    const session_id = (1000000 * Math.random()) | 0;

    const proxyOptions = {
        proxy: {
            host: 'brd.superproxy.io',
            port: port,
            auth: {
                username: `${username}-session-${session_id}`,
                password: password,
            },
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // To bypass SSL errors
    };

    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        };

        const response = await axios.get(documentationURL, { headers, ...proxyOptions });
        const $ = cheerio.load(response.data);

        const title = $('h1').text().trim();
        console.log('Page title:', title);
        console.log(response.data);
    } catch (error: any) {
        console.error('Error details:', error);
        throw new Error(`Failed to scrape data: ${error.message}`);
    }
}
