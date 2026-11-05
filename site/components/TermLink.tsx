'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import type {Term} from '../lib/types';
import {tr} from '../lib/i18n';
/** Keep block modal markup outside Markdown paragraphs; SSR retains a real link. */
export function TermLink({term,courseId,children,locale='en'}:{term:Term;courseId:string;children:React.ReactNode;locale?:string}){
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLAnchorElement>(null);
 const [mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);
 const href=`/${locale}/glossary/#${courseId}-${term.id}`;
 return <><a ref={trigger} className="term" href={href} onClick={e=>{if(!dialog.current||typeof dialog.current.showModal!=='function')return;e.preventDefault();dialog.current.showModal()}}>{children}</a>{mounted&&createPortal(<dialog aria-label={term.term} ref={dialog} onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}><div className="dialog-head"><span className="eyebrow">{tr(locale,'COURSE GLOSSARY','课程术语')}</span><button onClick={()=>dialog.current?.close()} aria-label={tr(locale,'Close definition','关闭定义')}>×</button></div><h2>{term.term}</h2><p>{term.definition}</p><p className="source">{term.source}</p><a href={href}>{tr(locale,'Open glossary entry','查看术语表')} →</a></dialog>,document.body)}</>
}
