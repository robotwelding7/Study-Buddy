/* Data soalan dipisahkan daripada paparan. Tiada sambungan AI / akaun diperlukan. */
window.SB={banks:{math:[],science:[],bm:[],english:[]},papers:{},topics:{},sources:[]};
SB.subjects={math:{name:'Matematik',icon:'🔢',color:'blue',description:'Pengiraan, rajah dan penyelesaian masalah'},science:{name:'Sains',icon:'🔬',color:'green',description:'Fakta, aplikasi dan kemahiran penyiasatan'},bm:{name:'Bahasa Melayu',icon:'📖',color:'orange',description:'Tatabahasa, kefahaman dan penulisan'},english:{name:'English',icon:'🌏',color:'purple',description:'Reading, use of English and guided writing'}};
SB.num=(label,answer,marks=1,unit='',steps=[])=>({type:'number',label,answer,marks,unit,steps});
SB.text=(label,answer,marks=1,aliases=[])=>({type:'text',label,answer,marks,aliases});
SB.concept=(label,answer,groups,marks=2)=>({type:'concept',label,answer,groups,marks});
SB.mcq=(label,options,answer,marks=1)=>({type:'mcq',label,options,answer,marks});
SB.essay=(label,min,max,keywords,marks,rubric)=>({type:'essay',label,min,max,keywords,marks,rubric});
SB.add=(sub,question)=>{question.subject=sub;question.marks=question.parts.reduce((a,p)=>a+p.marks,0);SB.banks[sub].push(question);return question;};
SB.register=(sub,topics)=>SB.topics[sub]=topics;
SB.topic=(id,name,teach,example)=>({id,name,teach,example});
SB.paper=(sub,set,sections)=>{const questions=sections.flatMap(sec=>sec.questions.map((q,i)=>({...q,section:sec.name,number:i+1})));const total=questions.reduce((a,q)=>a+q.marks,0);if(total!==50)throw Error(sub+' set '+set+': '+total+' marks');SB.papers[sub+'-'+set]={subject:sub,set,duration:4500,total:50,sections:sections.map(s=>({name:s.name,instructions:s.instructions,count:s.questions.length,marks:s.questions.reduce((a,q)=>a+q.marks,0)})),questions};};
SB.normalize=s=>String(s??'').toLowerCase().normalize('NFKC').replace(/[’‘]/g,"'").replace(/[^a-z0-9%²³+\-.,/ ]/g,' ').replace(/\s+/g,' ').trim();
SB.unit=s=>SB.normalize(s).replace(/\s/g,'').replace('cm^2','cm²').replace('cm2','cm²').replace('cm^3','cm³').replace('cm3','cm³').replace('millilitre','ml').replace('ringgit','rm').replace('peratus','%');
SB.contains=(norm,phrase)=>{let needle=SB.normalize(phrase);if(!needle)return false;if(/[0-9]/.test(needle)||['air','no','yes'].includes(needle)){let escaped=needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(^|[^a-z0-9.])'+escaped+'([^a-z0-9.]|$)').test(norm);}return norm.includes(needle);};
SB.value=s=>{let t=String(s??'').trim().toLowerCase().replace(/,/g,'').replace(/rm|cm[²³23]?|km|kg|ml|minit|min|jam|g|m|l|%/g,'').replace(/\s/g,'');if(!t)return null;if(/^[-+]?\d*\.?\d+$/.test(t))return Number(t);let f=t.match(/^(\d+)\/(\d+)$/);if(f&&+f[2])return +f[1]/+f[2];return null;};
SB.gradePart=(p,a={})=>{
  const text=String(a.value??''),norm=SB.normalize(text);let score=0,details=[],review=false;
  if(p.type==='mcq'){score=String(a.value)===String(p.answer)?p.marks:0;details.push({label:'Pilihan jawapan',earned:score,max:p.marks});}
  else if(p.type==='text'){const hit=[p.answer,...(p.aliases||[])].some(x=>SB.normalize(x)===norm);score=hit?p.marks:0;details.push({label:'Jawapan / variasi setara',earned:score,max:p.marks});}
  else if(p.type==='number'){
    const final=SB.value(text),correct=final!==null&&Math.abs(final-Number(p.answer))<0.00001;
    const methodMarks=(p.steps||[]).length,unitMark=p.unit?1:0,finalMarks=Math.max(0,p.marks-methodMarks-unitMark);
    const work=String(a.work||'').toLowerCase().replace(/[×x]/g,'*').replace(/[÷]/g,'/').replace(/[−–]/g,'-').replace(/\s/g,'').replace(/,/g,'').replace(/cm(?:[²³]|\^[23]|[23])?|rm|km|kg|ml|minit|jam/g,'');
    (p.steps||[]).forEach(step=>{let hit=step.patterns.some(pattern=>{let needle=pattern.toLowerCase().replace(/\s/g,'');let from=0,pos;while((pos=work.indexOf(needle,from))!==-1){if(!/[\d.]/.test(work[pos-1]||'')&&!/[\d.]/.test(work[pos+needle.length]||''))return true;from=pos+1;}return false;});let v=hit?1:0;score+=v;details.push({label:step.label,earned:v,max:1});});
    score+=correct?finalMarks:0;details.push({label:'Nilai akhir',earned:correct?finalMarks:0,max:finalMarks});
    if(p.unit){let supplied=SB.unit(a.unit||'');if(!supplied){const match=text.match(/(RM|cm[²³23]?|km|kg|ml|minit|min|jam|g|m|L|%)/i);supplied=SB.unit(match?.[1]||'');}const hit=correct&&supplied===SB.unit(p.unit);score+=hit?1:0;details.push({label:'Unit '+p.unit,earned:hit?1:0,max:1});}
    if(methodMarks&&!work&&correct)review=true;
    if(methodMarks&&work&&details.slice(0,methodMarks).some(x=>!x.earned))review=true;
  }else if(p.type==='concept'){
    review=true;const groups=p.groups||[];groups.forEach((g,i)=>{const hit=g.some(x=>SB.contains(norm,x));const m=p.marks/groups.length;score+=hit?m:0;details.push({label:'Isi '+(i+1)+': '+g[0],earned:hit?m:0,max:m});});
    // Frasa bercanggah ditandakan untuk semakan, bukannya mendapat markah automatik penuh.
    if(/tidak memerlukan|does not need|tidak perlu/.test(norm)&&/air|oksigen|cahaya|water|oxygen|light/.test(norm)){score=0;details=details.map(d=>({...d,earned:0}));details.push({label:'Ayat mungkin bercanggah; ibu bapa perlu semak',earned:0,max:0});}
  }else if(p.type==='essay'){
    review=true;let words=text.trim().split(/\s+/).filter(Boolean).length,sentences=(text.match(/[.!?](?:\s|$)/g)||[]).length,paras=text.split(/\n\s*\n/).filter(x=>x.trim()).length;
    const content=p.keywords.filter(g=>g.some(x=>norm.includes(SB.normalize(x)))).length,weights=p.rubric||[4,3,2,1];
    const isi=Math.min(weights[0],Math.floor(weights[0]*content/Math.max(1,p.keywords.length)));
    const language=words>=10&&sentences>=2?Math.floor(weights[1]/2):0;
    const structure=words>=10&&sentences>=2?Math.floor(weights[2]/2):0;
    const spelling=0; // Ketepatan ejaan tidak boleh dipastikan oleh kiraan kata.
    score=isi+language+structure+spelling;
    details=[{label:'Isi yang dikesan (semakan kata kunci)',earned:isi,max:weights[0]},{label:'Bahasa: semakan ayat asas sahaja',earned:language,max:weights[1]},{label:'Susunan: '+paras+' perenggan, '+sentences+' ayat bertanda baca',earned:structure,max:weights[2]},{label:'Ejaan: perlu semakan ibu bapa',earned:spelling,max:weights[3]}];
    if(words<10)score=0;
  }else if(p.type==='coordinate'){const x=Number(a.x),y=Number(a.y);score=a.x!==undefined&&a.x!==''&&x===p.answer[0]&&y===p.answer[1]?p.marks:0;details.push({label:'Kedudukan titik pada (x, y)',earned:score,max:p.marks});}
  return {score:Math.min(p.marks,score),max:p.marks,details,review,answer:p.type==='mcq'?p.options[p.answer]:Array.isArray(p.answer)?p.answer.join(', '):p.answer};
};
SB.gradeQuestion=(q,answers)=>{const parts=q.parts.map((p,i)=>SB.gradePart(p,answers?.[i]||{}));return{score:parts.reduce((a,x)=>a+x.score,0),max:q.marks,review:parts.some(x=>x.review),parts};};
