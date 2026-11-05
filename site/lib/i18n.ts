export type Locale='en'|'zh';
export const locales:Locale[]=['en','zh'];
export const isZh=(l:string)=>l==='zh';
export const tr=(l:string,en:string,zh:string)=>isZh(l)?zh:en;
export const localeCode=(l:string)=>isZh(l)?'zh-CN':'en';
