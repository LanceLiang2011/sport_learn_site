export type Section={id:string;title:string;markdown:string;source:string};
export type Lesson={id:string;title:string;summary:string;sections:Section[];recap:string[];interactionIds:string[]};
export type Question={id:string;objective:string;prompt:string;multiple:boolean;options:{id:string;text:string;explanation:string}[];correct:string[];explanation:string;source:string;lessonId:string};
export type Term={id:string;term:string;aliases:string[];definition:string;source:string;lessonIds:string[]};
export type Interaction={id:string;type:'volume'|'intensity'|'recovery'|'sequence';title:string;lessonId:string;source:string;objective:string;rationale:string;assumptions:string;staticAlternative:string;verification:string;config:Record<string,unknown>};
export type Course={id:string;title:string;subtitle:string;language:string;authors:string[];source:{title:string;authors:string[];edition:string;format:string;attribution:string};description:string;chapters:{id:string;title:string;objectives:string[];lessons:Lesson[];quiz:Question[]}[];glossary:Term[];interactions:Interaction[]};
