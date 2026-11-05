/** Exact-match scoring: order does not matter, but missing or additional answers fail. */
export function isCorrectAnswer(selected: readonly string[], correct: readonly string[]): boolean {
  const choices = new Set(selected), expected = new Set(correct);
  return expected.size > 0 && choices.size === expected.size && [...choices].every(id => expected.has(id));
}
export function scoreQuiz(questions: readonly {id:string;correct:readonly string[]}[], answers: Record<string,string[]>): number {
  return questions.reduce((score,q)=>score+Number(isCorrectAnswer(answers[q.id]??[],q.correct)),0);
}
/** Fisher–Yates preserves option IDs rather than using positional answer keys. */
export function shuffleOptions<T>(options:readonly T[],random:()=>number=Math.random):T[]{const result=[...options];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
/** Stable question-reference seed keeps SSR, hydration, retries and locales in sync. */
export function seededShuffleOptions<T>(options:readonly T[],key:string):T[]{
 let seed=2166136261;for(let i=0;i<key.length;i++){seed^=key.charCodeAt(i);seed=Math.imul(seed,16777619)}
 return shuffleOptions(options,()=>{seed=(seed+0x6D2B79F5)|0;let value=Math.imul(seed^(seed>>>15),1|seed);value^=value+Math.imul(value^(value>>>7),61|value);return ((value^(value>>>14))>>>0)/4294967296});
}
