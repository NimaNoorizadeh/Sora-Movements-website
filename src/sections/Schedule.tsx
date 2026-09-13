import { useRef, useState } from 'react';
export const classNames = ['Align','Flow','Strength','Restore'] as const;
const days = [
 {day:'Monday',type:'Align',times:['07:30','12:00','18:00'],coach:'Maya'},
 {day:'Tuesday',type:'Flow',times:['08:00','17:30','19:00'],coach:'Alex'},
 {day:'Wednesday',type:'Strength',times:['07:30','12:00','18:30'],coach:'Maya'},
 {day:'Thursday',type:'Restore',times:['08:00','17:30','19:00'],coach:'Sam'},
 {day:'Friday',type:'Flow',times:['07:30','12:00','17:30'],coach:'Alex'},
 {day:'Saturday',type:'Align',times:['09:00','10:30','12:00'],coach:'Sam'}
];
export default function Schedule(){
 const [filter,setFilter]=useState('All classes');
 const [session,setSession]=useState<{day:string;type:string;time:string;coach:string}|null>(null);
 const [saved,setSaved]=useState(false);
 const modal=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement|null>(null);
 function close(){modal.current?.close();trigger.current?.focus()}
 function choose(day:typeof days[number],time:string,button:HTMLButtonElement){trigger.current=button;setSession({...day,time});setSaved(false);modal.current?.showModal()}
 function calendar(){if(!session)return;const dayIndex=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(session.day);const date=new Date();date.setDate(date.getDate()+(dayIndex-date.getDay()+7)%7);const [hour,minute]=session.time.split(':').map(Number);date.setHours(hour,minute,0,0);if(date<=new Date())date.setDate(date.getDate()+7);const end=new Date(date.getTime()+50*60000);const stamp=(d:Date)=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sora Movement//Class Reminder//EN','BEGIN:VEVENT',`UID:${crypto.randomUUID()}@soramovement.example`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(date)}`,`DTEND:${stamp(end)}`,`SUMMARY:Sora ${session.type} - class reminder`,'DESCRIPTION:Personal reminder only. This fictional studio does not accept reservations.','END:VEVENT','END:VCALENDAR'].join('\r\n');const url=URL.createObjectURL(new Blob([text],{type:'text/calendar'}));const a=document.createElement('a');a.href=url;a.download='sora-class.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setSaved(true)}
 return <section className="schedule section" id="schedule"><div className="section-heading"><h2>Make room<br/>for movement.</h2><p>Your week, with a little more Sora.<br/>All sessions are 50 minutes. All levels welcome.</p></div><div className="schedule-toolbar"><h3>Weekly schedule</h3><label>Show <select value={filter} onChange={e=>setFilter(e.target.value)}>{['All classes',...classNames].map(v=><option key={v}>{v}</option>)}</select></label></div><div className="schedule-grid" aria-live="polite">{days.filter(d=>filter==='All classes'||d.type===filter).map(d=><article className="schedule-day" key={d.day}><h4>{d.day}</h4><p className="schedule-class">{d.type}</p><p className="coach">with {d.coach}</p><div className="time-list">{d.times.map(t=><button key={t} aria-label={`Book ${d.type} on ${d.day} at ${t}`} onClick={e=>choose(d,t,e.currentTarget)}>{t}<span aria-hidden="true">+</span></button>)}</div></article>)}</div><p className="schedule-note">New to the studio? Align is a good place to begin. Choose a time to explore your first session.</p><dialog ref={modal} className="booking-dialog" onClick={e=>{if(e.target===e.currentTarget)close()}} onCancel={()=>trigger.current?.focus()}><button className="dialog-close" aria-label="Close booking details" onClick={close}>×</button><p>Your time to move</p><h2>{session?.type}</h2><p className="session-detail">{session?.day} at {session?.time}<br/>50 minutes with {session?.coach}</p><p>Wear something you can move in. We’ll take care of the equipment. Arrive 10 minutes early to settle in.</p><div className="booking-note">Sora is a fictional portfolio studio. Live reservations and payments aren’t available.</div><button className="button" onClick={calendar}>{saved?'Download reminder again':'Add a personal reminder'}</button><p role="status">{saved?'Calendar reminder downloaded. No class has been reserved.':''}</p></dialog></section>
}
