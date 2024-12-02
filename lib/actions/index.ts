"use server"

import { scrapeSupraDoc } from "../scraper";

export async function scrapeDoc(docURL:string) {
    if (!docURL) return;
    try{
        const scrapeDoc = await scrapeSupraDoc(docURL);
        
    }
    catch (error: any){
        throw new Error(`Error encountered here: $(error.message)`)
        }
    }