/** Shared, locale-independent bookkeeping models. These do not predict adaptation. */
export const LAB_DEFAULTS:readonly number[]=[3,8,60,100];
export function normalizeLabValue(value:unknown,index:number):number {
 const parsed=typeof value==='number'?value:Number(value);
 const fallback=LAB_DEFAULTS[index]??1;
 if(!Number.isFinite(parsed))return fallback;
 const bounded=Math.min(index<2?100:1000,Math.max(1,parsed));
 return index<2?Math.round(bounded):Math.round(bounded*2)/2;
}
export function normalizeLabValues(input:unknown):number[]{return LAB_DEFAULTS.map((v,i)=>normalizeLabValue(Array.isArray(input)?input[i]:v,i));}
/** kg-repetitions = sets × repetitions per set × external load in kg. */
export function volumeLoad(sets:number,repetitions:number,loadKg:number):number {
 if(![sets,repetitions,loadKg].every(Number.isFinite)||sets<0||repetitions<0||loadKg<0||!Number.isInteger(sets)||!Number.isInteger(repetitions))throw new RangeError('Volume inputs require nonnegative integer sets/repetitions and finite load.');
 return sets*repetitions*loadKg;
}
/** A ratio to a stated reference, independent of effort or proximity to failure. */
export function percentOfOneRM(loadKg:number,referenceKg:number):number {
 if(!Number.isFinite(loadKg)||!Number.isFinite(referenceKg)||loadKg<0||referenceKg<=0)throw new RangeError('Load must be nonnegative and reference 1RM must be positive and finite.');
 return loadKg/referenceKg*100;
}
