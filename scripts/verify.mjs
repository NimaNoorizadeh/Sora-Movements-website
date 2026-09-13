import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[];
const results=[];
for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small-mobile',320,740]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode()}))});
 await page.screenshot({path:`review/${name}.png`,fullPage:true});
 const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
 if(layout.scrollWidth>width||layout.brokenImages.length)throw new Error(JSON.stringify(layout));
 if(width<=800){await page.getByRole('button',{name:'Menu'}).click();await page.getByRole('navigation').getByRole('link',{name:'Classes',exact:true}).click();if(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded')!=='false')throw new Error('Menu did not close');}
 await page.getByRole('combobox').selectOption('Restore');
 if(await page.locator('.schedule-day').count()!==1)throw new Error('Filter failed');
 await page.getByRole('button',{name:'Book Restore on Thursday at 08:00'}).click();
 await page.getByRole('dialog').waitFor({state:'visible'});
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Add a personal reminder'}).click();
 const download=await downloadPromise;await download.saveAs(`review/${name}-reminder.ics`);
 await page.keyboard.press('Escape');
 if(await page.getByRole('dialog').isVisible())throw new Error('Dialog Escape failed');
 const focused=await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'));
 if(focused!=='Book Restore on Thursday at 08:00')throw new Error('Focus restoration failed');
 await page.getByRole('combobox').selectOption('All classes');
 if(await page.locator('.time-list button').count()!==18)throw new Error('Session count failed');
 results.push({name,...layout,scheduleFilter:true,bookingDialog:true,calendarDownload:true,keyboardEscape:true,focusRestoration:true});
 await page.close();
}
await browser.close();
await writeFile('review/results.json',JSON.stringify({results,errors},null,2));
if(errors.length)throw new Error(errors.join('\n'));
console.log(JSON.stringify({results,errors},null,2));

