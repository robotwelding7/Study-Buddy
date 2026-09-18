/* Rajah khusus: elakkan ikon umum memberi gambaran konsep yang salah. */
const originalScienceSvg=scienceSvg;
scienceSvg=function(kind){let b='';
if(kind==='skin'){b=`${person(290,70)}<path d="M350 80 Q330 115 350 120 Q370 115 350 80" fill="#86bfd9" class="shape"/>${txt(235,255,'Kulit / Skin')}`;}
else if(kind==='gravity'){b=`<circle cx="300" cy="50" r="22" fill="#efbd8d" class="shape"/><path d="M300 85 V190 M286 176 L300 193 314 176" class="line"/><path d="M90 220 H520" stroke="#6c997a" stroke-width="6"/>${txt(270,258,'Tanah / Ground')}`;}
else if(kind==='ramp'){b=`<path d="M100 210 H520 V65 Z" fill="#d3e3eb" class="shape"/><rect x="270" y="103" width="60" height="60" transform="rotate(-19 300 133)" fill="#dfbc91" class="shape"/>${txt(130,255,'Satah condong / Inclined plane')}`;}
else if(kind==='wedge'){b=`<path d="M120 90 H280 L520 130 280 150 H120 Z" fill="#b7ccd8" class="shape"/><rect x="55" y="83" width="95" height="75" rx="12" fill="#d8b18e" class="shape"/>${txt(240,235,'Mata pisau / Knife blade')}`;}
else if(kind==='pulley'){b=`<path d="M180 35 H410" class="line"/><circle cx="300" cy="90" r="40" fill="#dae8ed" class="shape"/><path d="M260 92 V230 M340 92 V185" class="line"/><rect x="310" y="185" width="60" height="55" fill="#c7dfc8" class="shape"/>${txt(200,275,'Tali dan roda / Rope and wheel')}`;}
else if(kind==='transparency'){['Kaca jernih','Kertas nipis','Kayu'].forEach((s,i)=>{let x=35+i*200;b+=`<rect x="${x+60}" y="45" width="38" height="155" fill="${['#e5f4fb','#d8e3e5','#ddb78e'][i]}" class="shape"/><path d="M${x} 120 H${x+55}" stroke="#e7b05b" stroke-width="5"/>`;if(i<2)b+=`<path d="M${x+103} 120 H${x+167}" stroke="#e7b05b" stroke-width="${i?2:5}"/>`;b+=txt(x+5,245,s);});}
else if(kind==='activity'){b=`${person(130,75)}${person(310,75,'#e7bf93')}${person(490,75,'#aed3b5')}${txt(87,260,'Rehat')}${txt(261,260,'Berjalan')}${txt(449,260,'Berlari')}`;}
else return originalScienceSvg(kind);
return SB.svg(b,'Rajah sains: '+kind,620,300);
};
