/* Sambungan terkawal: tiada AI, eval, atau perkhidmatan rangkaian. */
(() => {
const original=SB.gradePart;
SB.words=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\.(?!\d)/g,' ').replace(/[^a-z0-9.]+/g,' ').trim().replace(/\s+/g,' ');
const typo={pembolehubah:'pemboleh ubah',dimanipulasi:'dimanipulasikan',pernafsan:'pernafasan',pernafasan:'pernafasan',kelantagan:'kelantangan',pantulaan:'pantulan',permukan:'permukaan'};
SB.cleanConcept=s=>SB.words(s).split(' ').map(w=>typo[w]||w).join(' ');
const stems={bantu:['membantu'],jimat:['menjimatkan','berjimat'],putar:['berputar','putaran'],serap:['menyerap','diserap','penyerapan'],pantul:['memantulkan','dipantulkan','pantulan'],halang:['menghalang','dihalang'],potong:['memotong','dipotong'],tanam:['menanam','ditanam'],siram:['menyiram','disiram'],bersih:['membersihkan','kebersihan'],tanggungjawab:['bertanggungjawab'],getar:['bergetar','getaran'],susun:['menyusun','disusun'],baca:['membaca'],learn:['learns','learning'],help:['helps','helping'],plant:['plants','planting'],book:['books'],vegetable:['vegetables']};
SB.contains=(norm,phrase)=>{const hay=' '+SB.cleanConcept(norm)+' ',needle=SB.cleanConcept(phrase);if(!needle)return false;const root=Object.keys(stems).find(k=>k===needle||stems[k].includes(needle));return [needle,...(root?[root,...stems[root]]:[])].some(x=>hay.includes(' '+x+' '));};
const strip=s=>SB.cleanConcept(s).replace(/^(?:jawapan saya ialah|jawapannya ialah|jawapan ialah|ialah|adalah|the answer is|a|an|the) /,'').replace(/^(?:pemboleh ubah (?:dimanipulasikan|bergerak balas|dimalarkan) (?:ialah|adalah)) /,'');
SB.mathText=s=>String(s??'').toLowerCase().replace(/[×xX]/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-').replace(/,/g,'').replace(/(?:rm|cm(?:[²³]|\^[23]|[23])?|km|kg|ml|minit|jam)\s*/g,'').replace(/\s/g,'');
function expression(raw){const s=SB.mathText(raw),tokens=s.match(/\d*\.?\d+|[()+\-*/]/g)||[];if(tokens.join('')!==s||!s)return null;let i=0;
 function atom(){if(tokens[i]==='('){i++;let a=sum();if(tokens[i++]!==')')throw Error();return a;}if(tokens[i]==='-'){i++;let a=atom();return {op:'neg',v:-a.v,args:[a]};}let n=Number(tokens[i++]);if(!Number.isFinite(n))throw Error();return {op:'n',v:n,args:[]};}
 function product(){let a=atom();while(['*','/'].includes(tokens[i])){let op=tokens[i++],b=atom();a={op,v:op==='*'?a.v*b.v:a.v/b.v,args:[a,b]};}return a;}
 function sum(){let a=product();while(['+','-'].includes(tokens[i])){let op=tokens[i++],b=product();a={op,v:op==='+'?a.v+b.v:a.v-b.v,args:[a,b]};}return a;}
 try{let a=sum();return i===tokens.length&&Number.isFinite(a.v)?a:null;}catch{return null;}}
function canonical(a){if(a.op==='n')return String(a.v);if(['*','+'].includes(a.op)){let terms=[];function gather(b){if(b.op===a.op)b.args.forEach(gather);else terms.push(canonical(b));}gather(a);return a.op+'('+terms.sort().join(',')+')';}return a.op+'('+a.args.map(canonical).join(',')+')';}
SB.workMatch=(work,patterns)=>{const expected=patterns.map(expression).filter(Boolean).map(canonical);let invalid=false,hit=false,method=false;String(work||'').split(/[\n;]+/).forEach(line=>{const cleaned=SB.mathText(line),runs=cleaned.match(/[\d.()+*/=\-]+/g)||[];runs.forEach(run=>{if(!/[+*/-]/.test(run))return;const eq=run.split('='),left=expression(eq[0]);if(!left||!expected.includes(canonical(left)))return;method=true;const right=eq.slice(1).map(expression);if(right.some(r=>!r||Math.abs(left.v-r.v)>1e-5)){invalid=true;return;}hit=true;});});return {hit:hit&&!invalid,method,invalid};};
SB.gradePart=(p,a={})=>{
 const value=String(a.value??''),norm=SB.cleanConcept(value),exact=[p.answer,...(p.aliases||[]),...(p.acceptedAnswers||[])].filter(x=>typeof x==='string').some(x=>SB.cleanConcept(x)===norm);
 let g=original(p,a);
 if(p.type==='text'&&p.wordTarget){const words=norm.split(' '),first=words[0],valid=[p.answer,...(p.aliases||[])].map(SB.cleanConcept);let relevant=words.length<=5&&valid.includes(first)&&words.slice(1).every(w=>p.contextWords.includes(w));let hit=exact||relevant;g.score=hit?p.marks:0;g.details=[{label:hit?'Kata yang diminta dikenal pasti':'Pilih satu kata daripada petikan; frasa pendek berkaitan diterima',earned:g.score,max:p.marks}];}
 if(p.type==='concept'){
   const accepted=p.acceptedAnswers||[],money=/^rm\s*\d+(?:\.\d+)?$/i.test(String(p.answer))&&/^(?:rm\s*)?\d+(?:\.\d+)?$/i.test(value.trim())&&SB.value(value)===SB.value(p.answer),full=exact||money||accepted.some(x=>strip(x)===strip(value));
   if(p.strictConcept){const hit=full;g.score=hit?p.marks:0;g.details=[{label:hit?'Pemboleh ubah setara diterima':p.guidance||'Nyatakan perkara khusus yang diubah, diperhatikan atau dikekalkan.',earned:g.score,max:p.marks}];}
   else {let groups=p.requiredConcepts||p.groups||[];g.details=groups.map((group,i)=>{let hit=full||group.some(x=>SB.contains(norm,x));return {label:p.conceptLabels?.[i]||'Isi '+(i+1)+': '+group[0],earned:hit?p.marks/groups.length:0,max:p.marks/groups.length};});g.score=g.details.reduce((s,d)=>s+d.earned,0);}
   if(p.inference){const observation=full||(p.observationConcepts||[]).every(group=>group.some(x=>SB.contains(norm,x))),reason=full||(p.groups||[]).every(group=>group.some(x=>SB.contains(norm,x)));g.details=[{label:'Pemerhatian / hasil yang diterangkan',earned:observation?p.marks/2:0,max:p.marks/2},{label:'Sebab saintifik yang berkaitan',earned:reason?p.marks/2:0,max:p.marks/2}];g.score=g.details.reduce((s,d)=>s+d.earned,0);}
   const model=SB.cleanConcept(p.answer),neg=/\b(tidak|bukan|tak|not|no)\b/.test(norm),modelNeg=/\b(tidak|bukan|tak|not|no)\b/.test(model);
   if(!full&&((neg&&!modelNeg)||(p.forbiddenConcepts||[]).some(x=>SB.contains(norm,x)))){g.score=0;g.details=g.details.map(d=>({...d,earned:0}));g.message='Ayat kamu mengandungi maksud bercanggah. Semak semula perkara yang berlaku.';}
   g.review=true;
 }
 if(p.type==='number'&&p.steps?.length){g.details=g.details.filter(d=>!p.steps.some(s=>s.label===d.label));let arithmeticError=false;p.steps.forEach(step=>{const result=SB.workMatch(a.work,step.patterns);arithmeticError||=result.invalid;g.details.unshift({label:step.label+(result.invalid?' — operasi tepat; hasil pengiraan perlu dibetulkan':result.hit?' — kiraan setara diterima':' — langkah belum dikenal pasti'),earned:result.method?1:0,max:1});});g.score=Math.min(p.marks,g.details.reduce((s,d)=>s+d.earned,0));g.workConflict=arithmeticError;g.review=arithmeticError||g.details.some(d=>d.max&&d.earned<d.max);if(arithmeticError)g.message='Operasi kamu sesuai dan mendapat markah kaedah. Semak hasil pengiraan selepas tanda sama dengan.';else if(SB.value(value)===Number(p.answer)&&g.details.slice(0,p.steps.length).every(d=>d.earned===d.max))g.message='Kiraan kamu betul. Label seperti KOS atau BAKI boleh memperjelas langkah; label bukan syarat tambahan dalam skema ini.';}
 if(p.type==='essay'){
   const weights=p.rubric||[4,3,2,1],content=(p.keywords||[]).filter(group=>group.some(x=>SB.contains(norm,x))).length,isi=Math.min(weights[0],Math.floor(weights[0]*content/Math.max(1,p.keywords.length)));
   g.details=[{label:'Isi yang dikesan — cadangan semakan',earned:isi,max:weights[0]},...['Bahasa','Susunan','Ejaan'].map((label,i)=>({label,earned:norm?null:0,max:weights[i+1],pending:!!norm}))];g.score=isi;g.pending=g.details.reduce((s,d)=>s+(d.pending?d.max:0),0);g.assessedMax=p.marks-g.pending;g.finalScore=g.pending?null:g.score;g.review=!!norm;
 }
 g.pending??=0;g.assessedMax??=p.marks;g.finalScore??=g.pending?null:g.score;
 g.message??=g.score===p.marks?'Jawapan kamu betul.':g.score>0?'Sebahagian jawapan betul. Semak komponen yang belum mendapat markah di bawah.':p.strictConcept?(p.guidance||'Nyatakan pemboleh ubah yang tepat.'):'Cuba semula. Bandingkan maksud jawapan kamu dengan contoh dan komponen semakan.';
 g.correct=g.score===p.marks&&!g.pending&&!g.workConflict;return g;
};
SB.gradeQuestion=(q,answers)=>{const parts=q.parts.map((p,i)=>SB.gradePart(p,answers?.[i]||{})),score=parts.reduce((s,g)=>s+g.score,0),pending=parts.reduce((s,g)=>s+g.pending,0);return {score,correct:parts.every(p=>p.correct),max:q.marks,pending,assessedMax:q.marks-pending,finalScore:pending?null:score,review:parts.some(g=>g.review),parts};};
})();
