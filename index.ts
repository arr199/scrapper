import { chromium , devices } from "playwright"

// Linkedin Card Schema
const cardSchema = {
    card : ".base-card" ,
    link : ".base-card__full-link" ,
    location : ".job-search-card__location" ,
    salary : ".job-search-card__salary-info",
    time : "time"
}

;( async () => {
   try {
    const linkedin = 'https://www.linkedin.com/jobs/search?keywords=Front-End%2BDevelopment&location=european%2Bunion&trk=public_jobs_jobs-search-bar_search-submit&currentJobId=3798420117&position=1&pageNum=0'
    const browser = await chromium.launch()
    const context = await browser.newContext(devices["Desktop Firefox"])
    const page = await context.newPage()
    await page.goto(linkedin)
    const cards =  await page.locator(".base-card").all()

    const jobs = []
    for (let i = 0 ; i < cards.length ; i++ ) {
        const title = (await cards[i].locator(cardSchema.link).textContent())?.trim()
        const link_href = await cards[i].locator(cardSchema.link).getAttribute("href")
        const location = (await cards[i].locator(cardSchema.location).textContent())?.trim()
        const date =  (await cards[i].locator(cardSchema.time).textContent())?.trim()
        const salary = await cards[i].locator(cardSchema.salary).isVisible() 
        ?  await cards[i].locator(cardSchema.salary).textContent() 
        : "No salary"
        

       
        const job = { title  ,  location ,  salary  ,  link_href , date }
        console.log(job)
    }
 
    
    await cards[1].click()
    const rightJobTitle =  page.locator(".top-card-layout__title")
    await rightJobTitle?.waitFor({ state :  "visible"})

    await page.screenshot({ path : "./pictures/linkedin.png" })
    await browser.close()

   }catch(err) {
    console.log("ERROR :" , err)
   }
   
} )();