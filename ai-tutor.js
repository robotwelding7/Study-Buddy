/* Child-facing AI tutor UI with local-first educational fallbacks. */
(() => {
"use strict";
const HISTORY_KEY="study-buddy-ai-history-v1",CLIENT_KEY="study-buddy-ai-client-v1",MAX_INPUT=300;
const actions=[["hint","💡 Bagi hint"],["simpler","👶 Terangkan lebih mudah"],["example","📖 Bagi contoh"],["quiz","🧠 Kuiz saya"],["image","🖼️ Tunjuk gambar"]];
let root,messages=[],activeMath=null,currentHistoryId=null,lastQuestion="",busy=false;

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function readHistory(){try{const x=JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]");return Array.isArray(x)?x:[];}catch(error){console.warn("AI history could not be read.",error);return [];}}
function writeHistory(x){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(x.slice(-300)));}catch(error){console.warn("AI history could not be saved.",error);}}
function addHistory(question,subject,type,local){const h=readHistory(),entry={id:"ai-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),at:new Date().toISOString(),subject,question,interactionType:type,hintsUsed:0,local:Boolean(local)};h.push(entry);writeHistory(h);currentHistoryId=entry.id;}
function updateHistory(changes){const h=readHistory(),entry=h.find(x=>x.id===currentHistoryId);if(entry){Object.assign(entry,changes);writeHistory(h);}}
function clientId(){let id=localStorage.getItem(CLIENT_KEY);if(!id){id=crypto.randomUUID?crypto.randomUUID():"client-"+Math.random().toString(36).slice(2);localStorage.setItem(CLIENT_KEY,id);}return id;}
function classify(q){const v=q.toLowerCase();if(/[0-9]\s*[×x*÷/]|darab|bahagi|pecahan|perpuluhan|matematik/.test(v))return"Mathematics";if(/sumber|haba|cahaya|tenaga|planet|suria|litar|tumbuhan|organ|sains/.test(v))return"Science";return"Bahasa Melayu";}
function typeFor(q){const v=q.toLowerCase();if(/apa maksud|maksud/.test(v))return"Vocabulary / concept explanation";if(/÷|bahagi/.test(v))return"Long division";if(/×|darab/.test(v))return"Multiplication";if(/tunjuk|gambar|rajah/.test(v))return"Educational visual";return"Concept explanation";}
function say(role,text,visualId=null){messages.push({role,text,visualId});if(messages.length>24)messages=messages.slice(-24);}
function textHtml(v){return esc(v).replace(/\n/g,"<br>");}

function render(){
if(!root)return;
const library=window.StudyBuddyVisuals?.list?.()||[];
root.innerHTML=`<section class="ai-shell" aria-label="Cikgu AI">
<div class="ai-intro"><div class="ai-avatar">🤖</div><div><h2>Cikgu AI</h2><p>Tanya Matematik, Sains atau maksud perkataan. Cikgu akan terangkan langkah demi langkah.</p></div></div>
<div class="ai-starters">${["Apa maksud sumber?","Apa itu sumber haba?","Tunjuk sistem suria.","24 × 0.6 macam mana?","59265 ÷ 27 macam mana?"].map(q=>`<button type="button" data-ai-starter="${esc(q)}">${esc(q)}</button>`).join("")}</div>
<div class="ai-messages" id="ai-messages" aria-live="polite">
${messages.length?messages.map(m=>`<article class="ai-message ${m.role}"><div class="ai-message-label">${m.role==="student"?"Saya":"🤖 Cikgu AI"}</div><div class="ai-bubble">${textHtml(m.text)}${m.visualId?window.StudyBuddyVisuals.render(m.visualId):""}</div></article>`).join(""):'<article class="ai-message tutor"><div class="ai-message-label">🤖 Cikgu AI</div><div class="ai-bubble">Hai! Tanya apa-apa yang sedang kamu belajar. Kalau ada perkataan yang susah, tanya maksud perkataan itu dahulu ya.</div></article>'}
${busy?'<div class="ai-thinking" role="status">Cikgu sedang fikir…</div>':""}</div>
<div class="ai-quick-actions">${actions.map(([a,l])=>`<button type="button" data-ai-action="${a}" ${busy||!lastQuestion?"disabled":""}>${l}</button>`).join("")}</div>
<form class="ai-form" id="ai-form"><label for="ai-question">Soalan kamu</label><textarea id="ai-question" maxlength="${MAX_INPUT}" rows="3" placeholder="Contoh: Apa maksud tenaga?" ${busy?"disabled":""}></textarea><div class="ai-form-footer"><small>Maksimum ${MAX_INPUT} aksara</small><button class="primary" type="submit" ${busy?"disabled":""}>Tanya Cikgu →</button></div></form>
<details class="ai-visual-library"><summary>🖼️ Buka pustaka visual pembelajaran</summary><div class="ai-visual-buttons">${library.map(x=>`<button type="button" data-ai-visual="${x.id}">${esc(x.title)}</button>`).join("")}</div></details>
</section>`;
requestAnimationFrame(()=>{const el=root?.querySelector("#ai-messages");if(el)el.scrollTop=el.scrollHeight;});
}

function numberFrom(text){const m=String(text).replace(",",".").match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN;}
function decimals(v){const s=String(v);return s.includes(".")?s.split(".")[1].length:0;}
function startMultiply(a,b){const places=decimals(a)+decimals(b),left=Math.round(a*10**decimals(a)),right=Math.round(b*10**decimals(b));activeMath={mode:"multiply",a,b,left,right,places,expected:left*right};return places?`Jom buat langkah demi langkah.\n\nMula-mula abaikan titik perpuluhan. Kira ${left} × ${right} dahulu.\n\nBerapa jawapannya?`:`Jom kira sendiri dahulu. Berapa ${left} × ${right}?`;}
function startDivide(dividend,divisor){if(!Number.isInteger(dividend)||!Number.isInteger(divisor)||divisor<=0)return null;const digits=String(dividend).split("").map(Number);let current=0,position=-1;while(position+1<digits.length&&current<divisor){position++;current=current*10+digits[position];}activeMath={mode:"divide",dividend,divisor,digits,position,current,quotient:""};return`Jom buat bahagi panjang.\n\nKita mula dengan ${current}.\n\n${divisor} boleh masuk dalam ${current} berapa kali? Tulis satu nombor.`;}
function mathReply(text){
if(!activeMath)return null;const value=numberFrom(text);if(!Number.isFinite(value))return"Cuba tulis jawapan dalam bentuk nombor ya.";
if(activeMath.mode==="multiply"){if(value!==activeMath.expected)return`Belum tepat. Cuba pecahkan ${activeMath.left} × ${activeMath.right}. Tekan “Bagi hint” jika perlu.`;const result=activeMath.a*activeMath.b,places=activeMath.places;activeMath=null;return places?`Betul, hasil tanpa titik ialah ${value}.\n\nAda ${places} tempat perpuluhan semuanya. Letakkan titik semula.\n\nJawapan akhir ialah ${Number(result.toFixed(places))}.`:`Betul! Jawapannya ialah ${value}. Cuba terangkan semula cara kamu mengira.`;}
const digit=Math.floor(activeMath.current/activeMath.divisor);if(value!==digit)return value>digit?`Terlalu besar. ${activeMath.divisor} × ${value} melebihi ${activeMath.current}. Cuba nombor lebih kecil.`:`Cari gandaan ${activeMath.divisor} yang paling hampir dengan ${activeMath.current} tetapi tidak melebihinya.`;
activeMath.quotient+=String(digit);const product=digit*activeMath.divisor,remainder=activeMath.current-product,explain=`${activeMath.divisor} × ${digit} = ${product}.\n${activeMath.current} − ${product} = ${remainder}.`;
if(activeMath.position>=activeMath.digits.length-1){const q=Number(activeMath.quotient),a=activeMath.dividend,b=activeMath.divisor;activeMath=null;return`${explain}\n\nTiada digit lagi. Jawapan akhir: ${a} ÷ ${b} = ${q}${remainder?" baki "+remainder:""}.\n\nBagus—kamu ikut setiap langkah.`;}
activeMath.position++;const next=activeMath.digits[activeMath.position];activeMath.current=remainder*10+next;return`${explain}\n\nTurunkan digit ${next}, jadi nombor baharu ialah ${activeMath.current}.\n\n${activeMath.divisor} boleh masuk dalam ${activeMath.current} berapa kali?`;
}
function mathHint(){if(!activeMath)return"Beritahu Cikgu soalan Matematik dahulu.";if(activeMath.mode==="multiply")return`Hint: pecahkan ${activeMath.left} × ${activeMath.right} kepada bahagian lebih mudah.`;const d=Math.floor(activeMath.current/activeMath.divisor);return`Hint: bandingkan ${activeMath.divisor} × ${Math.max(0,d-1)} dengan ${activeMath.divisor} × ${d}.`;}

function localAnswer(question){
const q=question.toLowerCase().replace(/\s+/g," ").trim(),visual=window.StudyBuddyVisuals?.match?.(q);
if(/tunjuk|gambar|rajah/.test(q)&&visual)return{text:"Ini visual yang kamu minta. Baca label mengikut urutan ya.",visualId:visual,type:"Educational visual"};
const division=q.match(/(\d+)\s*(?:÷|\/|bahagi)\s*(\d+)/);if(division){const text=startDivide(Number(division[1]),Number(division[2]));if(text)return{text,type:"Long division"};}
const multiply=q.match(/(\d+(?:[.,]\d+)?)\s*(?:×|x|\*)\s*(\d+(?:[.,]\d+)?)/);if(multiply){const a=Number(multiply[1].replace(",",".")),b=Number(multiply[2].replace(",","."));return{text:startMultiply(a,b),type:"Multiplication"};}
const lessons=[
[/maksud sumber|apa itu sumber$/,"Sumber bermaksud tempat atau benda yang kita dapat sesuatu daripadanya.\n\nContoh:\n☀️ Matahari ialah sumber haba dan cahaya.\n🔥 Api ialah sumber haba.\n\nJadi, sumber haba ialah sesuatu yang menghasilkan atau memberikan haba.","Vocabulary / concept explanation"],
[/sumber haba/,"Haba bermaksud tenaga yang membuat sesuatu menjadi panas.\n\nSumber haba ialah benda yang menghasilkan atau memberikan haba. Contohnya Matahari, api dan dapur yang menyala.","Science concept explanation","heat-sources"],
[/kenapa.*matahari.*sumber haba|matahari.*sumber haba/,"Matahari menghasilkan tenaga. Sebahagian tenaga itu sampai ke Bumi sebagai haba dan cahaya. Sebab itu kita berasa panas di bawah cahaya Matahari.","Science concept explanation"],
[/maksud tenaga|apa itu tenaga/,"Tenaga ialah keupayaan untuk melakukan kerja atau menyebabkan perubahan.\n\n🍚 Makanan memberi badan tenaga.\n🔋 Bateri memberi tenaga kepada alat elektrik.\n☀️ Matahari memberi tenaga haba dan cahaya.","Vocabulary / concept explanation"],
[/sistem suria|susunan planet/,"Sistem Suria terdiri daripada Matahari dan objek yang bergerak mengelilinginya. Lapan planet mengelilingi Matahari mengikut orbit masing-masing.","Educational visual","solar-system"],
[/litar elektrik/,"Litar elektrik ialah laluan lengkap yang membolehkan arus elektrik mengalir. Jika suis dibuka atau wayar terputus, mentol tidak menyala.","Science concept explanation","basic-circuit"],
[/bahagian tumbuhan/,"Bahagian asas tumbuhan ialah akar, batang, daun dan bunga. Setiap bahagian mempunyai tugas yang berbeza.","Science concept explanation","plant-parts"]
];const hit=lessons.find(x=>x[0].test(q));return hit?{text:hit[1],type:hit[2],visualId:hit[3]||null}:null;
}

async function backend(question,action=""){const url=window.STUDY_BUDDY_AI_CONFIG?.apiUrl;if(!url)throw new Error("AI_API_NOT_CONFIGURED");const history=messages.slice(-8).map(m=>({role:m.role==="student"?"user":"assistant",content:m.text}));const response=await fetch(url,{method:"POST",headers:{"content-type":"application/json","x-study-buddy-client":clientId()},body:JSON.stringify({message:question,action,history})});if(!response.ok)throw new Error("AI_HTTP_"+response.status);const data=await response.json();if(typeof data.answer!=="string")throw new Error("AI_INVALID_RESPONSE");return data.answer.trim().slice(0,1800);}

async function submit(question,options={}){
const clean=String(question||"").trim().slice(0,MAX_INPUT);if(!clean||busy)return;
if(!options.followUp){lastQuestion=clean;say("student",clean);}
const follow=options.followUp?null:mathReply(clean);if(follow){say("tutor",follow);updateHistory({interactionType:activeMath?(activeMath.mode==="divide"?"Long division":"Multiplication"):"Completed mathematics guidance"});render();return;}
const local=options.forceBackend?null:localAnswer(clean);if(local){if(!options.followUp)addHistory(clean,classify(clean),local.type||typeFor(clean),true);say("tutor",local.text,local.visualId);render();return;}
if(!options.followUp)addHistory(clean,classify(clean),typeFor(clean),false);busy=true;render();
try{say("tutor",await backend(clean,options.action||""));}catch(error){console.error("Cikgu AI request failed.",error);say("tutor","Cikgu AI tengah sibuk sekejap. Kamu masih boleh cuba soalan contoh atau buka pustaka visual. Cuba lagi sebentar ya. 😊");}finally{busy=false;render();}
}

async function runAction(action){
if(!lastQuestion||busy)return;
if(action==="hint"){const entry=readHistory().find(x=>x.id===currentHistoryId);updateHistory({hintsUsed:(entry?.hintsUsed||0)+1});say("student","💡 Bagi hint");say("tutor",mathHint());render();return;}
if(action==="image"){const id=window.StudyBuddyVisuals?.match?.(lastQuestion);say("student","🖼️ Tunjuk gambar");say("tutor",id?"Ini visual yang berkaitan dengan soalan kamu.":"Cikgu belum ada visual khas untuk topik itu. Cuba “sistem suria” atau “litar elektrik”.",id);render();return;}
const fallback={simpler:"Baik. Cikgu akan guna ayat lebih pendek. Beritahu perkataan mana yang masih susah.",example:"Nyatakan topik tadi sekali lagi supaya Cikgu boleh beri contoh yang tepat.",quiz:"Cuba tulis satu contoh dengan ayat kamu sendiri."};
say("student",actions.find(x=>x[0]===action)?.[1]||action);
if(!window.STUDY_BUDDY_AI_CONFIG?.apiUrl){say("tutor",fallback[action]||"Cuba terangkan bahagian yang masih mengelirukan.");render();return;}
await submit(lastQuestion,{followUp:true,forceBackend:true,action});
}

function bind(){root.addEventListener("submit",event=>{if(event.target.id!=="ai-form")return;event.preventDefault();const input=root.querySelector("#ai-question"),value=input.value;input.value="";submit(value);});root.addEventListener("click",event=>{const b=event.target.closest("button");if(!b)return;if(b.dataset.aiStarter)submit(b.dataset.aiStarter);if(b.dataset.aiAction)runAction(b.dataset.aiAction);if(b.dataset.aiVisual){const item=window.StudyBuddyVisuals?.list?.().find(x=>x.id===b.dataset.aiVisual);lastQuestion=item?.title||"Visual pembelajaran";say("student","Tunjuk "+lastQuestion);addHistory("Tunjuk "+lastQuestion,"Science","Educational visual",true);say("tutor","Ini visual pembelajaran yang dipilih.",b.dataset.aiVisual);render();}});}
function mount(element){if(!element||element.dataset.aiMounted==="true")return;root=element;root.dataset.aiMounted="true";bind();render();}
window.CikguAITutor={mount,getHistory:readHistory};
})();
