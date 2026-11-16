const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (x,a=-1,b=1)=>Math.max(a,Math.min(b,x));
const lerp = (a,b,t)=>a+(b-a)*t;

/* ================= Mood stations ================= */
const MOODS = {
  rain:{name:"Rain on the Window",freq:"88.7",v:-.45,e:-.5,light:.38,root:57,tags:"slow · soft · rainy",
    read:"You sound quiet and a little heavy. These songs keep you company without asking you to cheer up.",
    titles:["Window Seat","Soft Static","Condensation"],
    tracks:["Holocene|Bon Iver","Pink Moon|Nick Drake","Fade Into You|Mazzy Star","Motion Sickness|Phoebe Bridgers","Video Games|Lana Del Rey","Exit Music (For a Film)|Radiohead","Breathe Me|Sia","Ivy|Frank Ocean","Lua|Bright Eyes","Re: Stacks|Bon Iver","Teardrop|Massive Attack","Retrograde|James Blake"]},
  heart:{name:"Left on Read",freq:"90.3",v:-.8,e:-.15,light:.3,root:52,tags:"aching · honest",
    read:"Something or someone is weighing on you. This one lets you feel it fully, then breathe.",
    titles:["Unsent","Left on Read","The Long Way Home"],
    tracks:["Someone Like You|Adele","drivers license|Olivia Rodrigo","Liability|Lorde","Skinny Love|Bon Iver","Back to Black|Amy Winehouse","Nothing Compares 2 U|Sinéad O'Connor","Self Control|Frank Ocean","Jealous|Labrinth","Happier Than Ever|Billie Eilish","I Can't Make You Love Me|Bonnie Raitt","The Night We Met|Lord Huron","All Too Well (10 Minute Version)|Taylor Swift"]},
  late:{name:"3 A.M. Thoughts",freq:"92.1",v:-.35,e:.35,light:.42,root:54,tags:"restless · wired",
    read:"Your mind is still running. These tracks give the restlessness somewhere to go.",
    titles:["Wide Awake","3 A.M. Thoughts","Ceiling Fan"],
    tracks:["Do I Wanna Know?|Arctic Monkeys","Nights|Frank Ocean","Free Mind|Tems","Everything In Its Right Place|Radiohead","Redbone|Childish Gambino","Let It Happen|Tame Impala","Angel|Massive Attack","Insomnia|Faithless","505|Arctic Monkeys","Little Dark Age|MGMT","Stressed Out|Twenty One Pilots","Paranoid Android|Radiohead"]},
  burn:{name:"Pressure Valve",freq:"93.9",v:-.7,e:.85,light:.5,root:52,tags:"loud · fast · cathartic",
    read:"There's heat in what you wrote. Loud, fast songs to let it out safely.",
    titles:["Pressure Valve","Let It Out","Red Line"],
    tracks:["Killing in the Name|Rage Against the Machine","Smells Like Teen Spirit|Nirvana","Misery Business|Paramore","Given Up|Linkin Park","HUMBLE.|Kendrick Lamar","Sabotage|Beastie Boys","Chop Suey!|System of a Down","You Oughta Know|Alanis Morissette","Seven Nation Army|The White Stripes","Bodies|Drowning Pool","Power|Kanye West","Break Stuff|Limp Bizkit"]},
  focus:{name:"Deep Work",freq:"95.5",v:.1,e:-.25,light:.48,root:55,tags:"steady · instrumental",
    read:"You need your head clear. Mostly instrumental, steady, nothing that pulls your attention.",
    titles:["Deep Work","Heads Down","Quiet Hours"],
    tracks:["Weightless|Marconi Union","An Ending (Ascent)|Brian Eno","Avril 14th|Aphex Twin","Nuvole Bianche|Ludovico Einaudi","Says|Nils Frahm","Kiara|Bonobo","Intro|The xx","On the Nature of Daylight|Max Richter","Gymnopédie No. 1|Erik Satie","Strobe|deadmau5","Opus|Eric Prydz","Kong|Bonobo"]},
  slow:{name:"Slow Burn",freq:"97.1",v:.55,e:-.1,light:.55,root:53,tags:"warm · close",
    read:"There's warmth here, maybe someone on your mind. Slow, close, unhurried songs.",
    titles:["Slow Burn","Candlelight","Close"],
    tracks:["Best Part|Daniel Caesar & H.E.R.","Thinkin Bout You|Frank Ocean","Adorn|Miguel","Essence|Wizkid ft. Tems","Location|Khalid","Snooze|SZA","Get You|Daniel Caesar ft. Kali Uchis","Electric|Alina Baraz ft. Khalid","Let's Stay Together|Al Green","At Last|Etta James","Sure Thing|Miguel","Love Galore|SZA ft. Travis Scott"]},
  gold:{name:"Golden Hour",freq:"98.7",v:.7,e:-.55,light:.66,root:50,tags:"easy · sunlit",
    read:"You sound settled and easy. Warm, gentle songs to stay right where you are.",
    titles:["Golden Hour","Easy Now","Sunday Light"],
    tracks:["Here Comes the Sun|The Beatles","Lovely Day|Bill Withers","Put Your Records On|Corinne Bailey Rae","Banana Pancakes|Jack Johnson","Sunday Morning|The Velvet Underground","Pink + White|Frank Ocean","Golden Hour|JVKE","Island in the Sun|Weezer","Riptide|Vance Joy","Better Together|Jack Johnson","Golden|Harry Styles","Sunflower|Rex Orange County"]},
  neon:{name:"Neon Drive",freq:"100.3",v:.25,e:.45,light:.52,root:54,tags:"cool · cinematic",
    read:"Cool, moving, a little cinematic. Songs for city lights going past the window.",
    titles:["Neon Drive","Night Shift","Open Road"],
    tracks:["Midnight City|M83","Nightcall|Kavinsky","Blinding Lights|The Weeknd","A Real Hero|College & Electric Youth","The Less I Know the Better|Tame Impala","Instant Crush|Daft Punk ft. Julian Casablancas","Starboy|The Weeknd ft. Daft Punk","Tadow|Masego & FKJ","Electric Feel|MGMT","Genesis|Grimes","After Dark|Mr.Kitty","Ye|Burna Boy"]},
  main:{name:"Main Character",freq:"101.9",v:.75,e:.7,light:.6,root:55,tags:"big · confident",
    read:"You're feeling strong tonight. Big, confident songs to match it.",
    titles:["Main Character","Victory Lap","Walk-In Music"],
    tracks:["Feeling Good|Nina Simone","Lose Yourself|Eminem","Stronger|Kanye West","Good as Hell|Lizzo","Run the World (Girls)|Beyoncé","Can't Hold Us|Macklemore & Ryan Lewis","Don't Stop Me Now|Queen","Alright|Kendrick Lamar","Mr. Blue Sky|Electric Light Orchestra","Kwaku the Traveller|Black Sherif","Titanium|David Guetta ft. Sia","Eye of the Tiger|Survivor"]},
  party:{name:"Afterparty",freq:"103.5",v:.85,e:.95,light:.62,root:57,tags:"bright · danceable",
    read:"You want to move. Bright, danceable songs from start to finish.",
    titles:["Afterparty","Lights Up","One More Song"],
    tracks:["One More Time|Daft Punk","Get Lucky|Daft Punk ft. Pharrell Williams","Levitating|Dua Lipa","Calm Down|Rema","Last Last|Burna Boy","Water|Tyla","Rush|Ayra Starr","Uptown Funk|Mark Ronson ft. Bruno Mars","I Wanna Dance with Somebody|Whitney Houston","Dancing On My Own|Robyn","September|Earth, Wind & Fire","Padam Padam|Kylie Minogue"]},
  past:{name:"Rearview",freq:"105.1",v:-.05,e:-.35,light:.45,root:52,tags:"bittersweet · fond",
    read:"You're somewhere between missing and remembering. Bittersweet songs that look back fondly.",
    titles:["Rearview","Old Photos","Back Then"],
    tracks:["Ribs|Lorde","Dreams|Fleetwood Mac","Space Song|Beach House","Fast Car|Tracy Chapman","1979|The Smashing Pumpkins","Sweet Disposition|The Temper Trap","Apocalypse|Cigarettes After Sex","Summertime Sadness|Lana Del Rey","Youth|Daughter","The Suburbs|Arcade Fire","Landslide|Fleetwood Mac","Heroes|David Bowie"]},
  empty:{name:"Low Battery",freq:"106.7",v:-.55,e:-.85,light:.34,root:50,tags:"gentle · quiet",
    read:"You sound worn out. Gentle songs that ask nothing of you and help you rest.",
    titles:["Low Battery","Rest Mode","Power Down"],
    tracks:["Fix You|Coldplay","Mad World|Gary Jules","Everybody Hurts|R.E.M.","Breathe (2 AM)|Anna Nalick","How to Disappear Completely|Radiohead","Comfortably Numb|Pink Floyd","Let It Be|The Beatles","Hallelujah|Jeff Buckley","Bloodbuzz Ohio|The National","Breathe|Télépopmusik","Hurt|Johnny Cash","Holocene|Bon Iver"]}
};
for (const k in MOODS) MOODS[k].tracks = MOODS[k].tracks.map(s=>{const [title,artist]=s.split("|");return {title,artist};});

/* ================= Local mood reading ================= */
const LEX = [
  ["sad|down|blue|unhappy|low|gloomy|melanchol|grey|gray|rain", -.55,-.35,"rain"],
  ["lonely|alone|isolat", -.6,-.4,"rain"],
  ["cry|crying|tears", -.7,-.1,"heart"],
  ["heartbr|broke up|break ?up|breakup|dumped|my ex|miss (him|her|them|you)|left me|cheat|rejected|ghosted|shouldn.?t", -.8,-.1,"heart"],
  ["anxious|anxiety|nervous|worr|panic|stress|overwhelm|overthink|restless|racing|on edge", -.5,.5,"late"],
  ["can.?t sleep|insomnia|awake|sleepless|3 ?am|mind won.?t", -.25,.25,"late"],
  ["angry|mad\\b|furious|rage|pissed|annoyed|frustrat|hate|irritat|let it out", -.7,.85,"burn"],
  ["focus|study|studying|work(ing)?\\b|coding|deadline|concentrat|lock in|productive|finish", .1,-.15,"focus"],
  ["in love|crush|romantic|date|kiss|butterflies|cuddl|someone special|intimate", .6,0,"slow"],
  ["calm|peace|content|relaxed|chill|grateful|thankful|cozy|cosy|mellow|serene|easy|lazy|sunday", .6,-.6,"gold"],
  ["happy|good|great|glad|joy|cheer|smil|bright|wonderful|amazing|good news", .7,.35,null],
  ["driv|road|car\\b|city lights|neon|cruis|night out|walk(ing)? home", .25,.4,"neon"],
  ["confident|unstoppable|powerful|motivat|ready|boss|hyped|pumped|gym|workout|won\\b|win\\b|promot|proud|strong", .75,.75,"main"],
  ["party|danc|club|celebrat|friday|weekend|turn up|euphori|ecstatic|excited|vibe", .85,.9,"party"],
  ["nostalg|memor|remember|old days|childhood|homesick|bittersweet|reminisc|throwback|used to", -.05,-.3,"past"],
  ["tired|exhaust|drained|burn(ed|t)? out|numb|sleepy|worn|running on|fumes|empty|meh|bored|heavy", -.5,-.8,"empty"],
  ["hope|better|healing|okay|ok\\b|fine|alright", .3,0,null]
];
const CARE = /\b(kill myself|suicid|end it all|want to die|don.?t want to (live|be here)|self.?harm|hurt myself|no reason to live)/i;

function readLocal(text){
  const t=" "+text.toLowerCase()+" "; let v=0,e=0,n=0; const votes={};
  for (const [p,lv,le,mood] of LEX){
    const re=new RegExp("\\b("+p+")","gi"); let m;
    while((m=re.exec(t))){
      const before=t.slice(Math.max(0,m.index-14),m.index);
      if (/\b(not|never|no|isn.?t|don.?t|ain.?t|hardly)\s+(\w+\s+)?$/.test(before)){ v+=-lv*.6; e+=le*.5; n++; continue; }
      v+=lv; e+=le; n++; if (mood) votes[mood]=(votes[mood]||0)+1;
    }
  }
  if (!n) return {v:0,e:-.2,votes:{},weak:true};
  return {v:clamp(v/n),e:clamp(e/n),votes,weak:false};
}
function rankMoods(v,e,votes={}){
  return Object.keys(MOODS).map(k=>{const m=MOODS[k];return {k,d:Math.hypot(m.v-v,m.e-e)-Math.min(.6,(votes[k]||0)*.3)};}).sort((a,b)=>a.d-b.d).map(x=>x.k);
}
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffled(arr,r){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function buildLocal({text,v,e,votes,mode,size=12,seed,care,source="text"}){
  const r=rng(seed); const order=rankMoods(v,e,votes); const primary=order[0], secondary=order[1];
  const used=new Set(); const tracks=[];
  const take=(k,note)=>{const t=shuffled(MOODS[k].tracks,r).find(t=>!used.has(t.title+t.artist)); if(!t) return false; used.add(t.title+t.artist); tracks.push({...t,note}); return true;};
  if (mode==="lift" && !care){
    const target={v:Math.max(.7,Math.min(1,v+.9)),e:Math.max(.35,Math.min(.85,e+.6))};
    const stages=["Meeting you where you are","Sitting with it","Starting to turn","Picking up","Somewhere brighter"];
    for (let i=0;i<size;i++){
      const p=i/(size-1), ease=p*p*(3-2*p);
      const ranked=rankMoods(v+(target.v-v)*ease, e+(target.e-e)*ease, i<2?votes:{});
      const stage=stages[Math.min(stages.length-1,Math.floor(p*stages.length))];
      for (const k of ranked) if (take(k,stage)) break;
    }
  } else {
    const plan = care?["empty","rain","gold"]:[primary,secondary,order[2]];
    const counts=[Math.ceil(size*.6),Math.floor(size*.3)]; counts.push(size-counts[0]-counts[1]);
    const lanes=plan.map((k,i)=>shuffled(MOODS[k].tracks,r).slice(0,counts[i]));
    let a=0,b=0,c=0; const out=[];
    while(out.length<size && (a<lanes[0].length||b<lanes[1].length||c<lanes[2].length)){
      if(a<lanes[0].length) out.push(lanes[0][a++]);
      if(a<lanes[0].length&&out.length<size) out.push(lanes[0][a++]);
      if(b<lanes[1].length&&out.length<size) out.push(lanes[1][b++]);
      if(c<lanes[2].length&&out.length<size) out.push(lanes[2][c++]);
    }
    out.forEach(t=>{if(!used.has(t.title+t.artist)){used.add(t.title+t.artist);tracks.push({...t,note:""});}});
  }
  const key=care?"empty":primary, P=MOODS[key];
  let read=P.read;
  if (!care && secondary && (votes[secondary]||0)>0) read+=` There's some ${MOODS[secondary].name.toLowerCase()} in there too, so it's mixed in.`;
  if (mode==="lift" && !care) read+=" The list starts there and slowly climbs somewhere brighter.";
  return {title:P.titles[Math.floor(r()*P.titles.length)],read,moodKey:key,v,e,tracks,mode,text,source,by:"local",care};
}

/* ================= Claude reading (when allowed) ================= */
const samplePromise=(window.claude&&window.claude.use)?window.claude.use("sample").catch(()=>null):Promise.resolve(null);
let claudeOff=false;
async function readWithClaude({text,mode,size,avoid=[]}){
  if (claudeOff) return null;
  const sample=await samplePromise; if(!sample) return null;
  const prompt=`You are the curator for After Hours, a late-night music discovery website. A listener described how they feel. Read their mood carefully, including mixed feelings, sarcasm and negation, then build a playlist.

Listener wrote: """${text.replace(/"""/g,'"')}"""
Direction: ${mode==="lift"?"LIFT: start where they are emotionally, then gradually move toward a brighter, more energised place across the playlist.":"MATCH: stay with their mood and keep them company in it."}
Number of tracks: ${size}
${avoid.length?"Do not include any of these songs: "+avoid.join("; "):""}

Rules:
- Only real, released songs that can be found on Spotify, with correct artist names. Never invent a song.
- Mix eras and genres where it fits. At most 2 songs per artist.
- "note": one short sentence (max 12 words) on why this track fits at this point in the list. Speak to the listener. Never quote lyrics.
- valence is -1 (very negative) to 1 (very positive); energy is -1 (very calm or tired) to 1 (very intense).
- Set "care" to true only if the text suggests they may be thinking about harming themselves.

Reply with JSON only, in this shape:
{"read":"one or two warm, plain sentences reflecting how they feel","title":"evocative playlist title, 1 to 4 words","valence":0,"energy":0,"care":false,"tracks":[{"title":"","artist":"","note":""}]}`;
  try{
    const out=await sample.json(prompt,{modelTier:"default"});
    if(!out||!Array.isArray(out.tracks)) return null;
    const tracks=out.tracks.filter(t=>t&&typeof t.title==="string"&&typeof t.artist==="string").slice(0,size)
      .map(t=>({title:t.title.trim(),artist:t.artist.trim(),note:typeof t.note==="string"?t.note.trim():""}));
    if(tracks.length<3) return null;
    const v=clamp(Number(out.valence)||0), e=clamp(Number(out.energy)||0);
    return {title:String(out.title||"Tonight").slice(0,48),read:String(out.read||"").slice(0,280),moodKey:rankMoods(v,e)[0],v,e,tracks,mode,text,source:"text",by:"claude",care:!!out.care};
  }catch(err){ if(err&&err.code==="not_granted") claudeOff=true; return null; }
}

/* ================= Generative mood soundtrack (Web Audio) ================= */
const SCALES={minor:[0,2,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],major:[0,2,4,5,7,9,11],lydian:[0,2,4,6,7,9,11]};
const hz=m=>440*Math.pow(2,(m-69)/12);
const Sound={
  ctx:null,on:false,mood:{v:-.45,e:-.5,key:"rain"},step:0,
  init(){
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return false;
    const c=this.ctx=new AC();
    this.master=c.createGain(); this.master.gain.value=0;
    const comp=c.createDynamicsCompressor(); comp.threshold.value=-18; comp.ratio.value=3;
    this.analyser=c.createAnalyser(); this.analyser.fftSize=256; this.analyser.smoothingTimeConstant=.8;
    this.data=new Uint8Array(this.analyser.frequencyBinCount);
    this.master.connect(comp); comp.connect(this.analyser); this.analyser.connect(c.destination);
    // echo for the plucks
    this.delay=c.createDelay(1.5); const fb=c.createGain(); fb.gain.value=.38; const dl=c.createBiquadFilter(); dl.type="lowpass"; dl.frequency.value=2200;
    const wet=c.createGain(); wet.gain.value=.32;
    this.delay.connect(dl); dl.connect(fb); fb.connect(this.delay); this.delay.connect(wet); wet.connect(this.master);
    this.bus=c.createGain(); this.bus.gain.value=.9; this.bus.connect(this.master); this.bus.connect(this.delay);
    this.next=c.currentTime+.1;
    setInterval(()=>this.schedule(),25);
    const len=c.sampleRate*2, buf=c.createBuffer(1,len,c.sampleRate), ch=buf.getChannelData(0);
    for(let i=0;i<len;i++) ch[i]=Math.random()*2-1;
    this.noiseBuf=buf;
    this.applyWeather();
    return true;
  },
  async toggle(force){
    const want = force===undefined ? !this.on : force;
    if (want && !this.ctx && !this.init()){ toast("Sound isn't supported in this browser"); return; }
    if (!this.ctx) return;
    const t=this.ctx.currentTime;
    if (want){ try{await this.ctx.resume();}catch{} this.master.gain.cancelScheduledValues(t); this.master.gain.setTargetAtTime(.55,t,.5); this.on=true; this.next=this.ctx.currentTime+.1; }
    else { this.master.gain.cancelScheduledValues(t); this.master.gain.setTargetAtTime(0,t,.25); this.on=false; }
    document.body.classList.toggle("sound-on",this.on);
    $("#soundBtn").setAttribute("aria-pressed",this.on);
    $("#soundLabel").textContent=this.on?"Sound on":"Sound off";
  },
  setMood(v,e,key){ this.mood={v,e,key}; if(this.ctx) this.apply(); },
  weather:{kind:"off"},
  wmod(){
    const w=this.weather||{}; let filter=1,tempo=1,wave="triangle",oct=0;
    switch(w.kind){
      case "clear": filter=1.15; break;
      case "clouds": case "fog": filter=.7; tempo=.92; break;
      case "rain": filter=.8; tempo=.9; break;
      case "storm": filter=.7; tempo=.95; break;
      case "snow": filter=.85; tempo=.82; wave="sine"; oct=12; break;
      case "wind": filter=.95; break;
    }
    if (typeof w.temp==="number") tempo*= w.temp>28?1.06 : w.temp<10?.92 : 1;
    return {filter,tempo,wave,oct};
  },
  setWeather(w){ this.weather=w; if(this.ctx) this.applyWeather(); },
  applyWeather(){
    const c=this.ctx, t=c.currentTime, w=this.weather||{}, k=w.kind;
    if(this.wx){ const old=this.wx; old.g.gain.setTargetAtTime(0,t,.6); setTimeout(()=>old.nodes.forEach(n=>{try{n.stop();}catch{}}),3000); }
    const g=c.createGain(); g.gain.value=0; g.connect(this.master); const nodes=[];
    const noise=()=>{ const s=c.createBufferSource(); s.buffer=this.noiseBuf; s.loop=true; s.start(); nodes.push(s); return s; };
    const chain=(src,list,gain)=>{ let n=src; list.forEach(f=>{n.connect(f);n=f;}); const gg=c.createGain(); gg.gain.value=gain; n.connect(gg); gg.connect(g); };
    const filt=(type,f,q=.7)=>{ const b=c.createBiquadFilter(); b.type=type; b.frequency.value=f; b.Q.value=q; return b; };
    if(k==="rain"||k==="storm") chain(noise(),[filt("highpass",1000),filt("lowpass",k==="storm"?4500:6500)],k==="storm"?.09:.06);
    if(k==="wind"||(w.wind||0)>25){ const bp=filt("bandpass",500,3); const lfo=c.createOscillator(),lg=c.createGain(); lfo.frequency.value=.09; lg.gain.value=320; lfo.connect(lg); lg.connect(bp.frequency); lfo.start(); nodes.push(lfo); chain(noise(),[bp],.05); }
    if(k==="clouds"||k==="fog") chain(noise(),[filt("lowpass",320)],.03);
    g.gain.setTargetAtTime(1,t,1.2);
    this.wx={g,nodes};
    this.apply();
  },
  drop(t){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();
    o.type="sine"; o.frequency.setValueAtTime(1800+Math.random()*1700,t); o.frequency.exponentialRampToValueAtTime(900,t+.06);
    g.gain.setValueAtTime(.018,t); g.gain.exponentialRampToValueAtTime(.0001,t+.09);
    o.connect(g); g.connect(this.bus); o.start(t); o.stop(t+.1);
  },
  rumble(t){
    const c=this.ctx,s=c.createBufferSource(); s.buffer=this.noiseBuf;
    const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=140;
    const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.4,t+.9); g.gain.exponentialRampToValueAtTime(.0001,t+5);
    s.connect(lp); lp.connect(g); g.connect(this.master); s.start(t); s.stop(t+5.2);
    setTimeout(()=>Visual.flash(),Math.max(0,(t-c.currentTime)*1000));
  },
  apply(){
    const c=this.ctx, {v,e,key}=this.mood, m=MOODS[key]||MOODS.rain;
    this.scale = v<-.25?SCALES.minor : v<.25?SCALES.dorian : v<.6?SCALES.major : SCALES.lydian;
    const wm=this.wmod();
    this.root = m.root; this.bpm = (64 + (e+1)*36)*wm.tempo;
    const deg=[0,2,4,6,8];
    this.chord = deg.map(d=>this.root+this.scale[d%7]+12*Math.floor(d/7));
    // crossfade the pad
    const t=c.currentTime;
    if (this.pad){ const old=this.pad; old.g.gain.setTargetAtTime(0,t,.8); setTimeout(()=>old.oscs.forEach(o=>{try{o.stop();}catch{}}),4000); }
    const g=c.createGain(); g.gain.value=0; g.gain.setTargetAtTime(.032,t,1.2);
    const f=c.createBiquadFilter(); f.type="lowpass"; f.Q.value=.6; f.frequency.value=(380+(v+1)*420+(e+1)*380)*wm.filter;
    const lfo=c.createOscillator(), lg=c.createGain(); lfo.frequency.value=.07+(e+1)*.06; lg.gain.value=180; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    const oscs=[lfo];
    this.chord.slice(0,4).forEach(n=>{ [-6,6].forEach(det=>{ const o=c.createOscillator(); o.type="sawtooth"; o.frequency.value=hz(n-12); o.detune.value=det; o.connect(f); o.start(); oscs.push(o); }); });
    f.connect(g); g.connect(this.master);
    this.pad={g,oscs};
  },
  schedule(){
    if(!this.ctx) return;
    if(!this.on){ this.next=this.ctx.currentTime+.1; return; }
    const spb=60/this.bpm/2;
    while(this.next<this.ctx.currentTime+.12){ this.playStep(this.next); this.next+=spb; this.step++; }
  },
  playStep(t){
    const e=this.mood.e, wk=(this.weather||{}).kind;
    if((wk==="rain"||wk==="storm") && Math.random()<.45) this.drop(t+Math.random()*.1);
    if(wk==="storm" && Math.random()<.006) this.rumble(t);
    if(wk==="clear" && !this.weather.isDay && Math.random()<.05) this.pluck(t,this.chord[this.chord.length-1]+24,.03);
    if (e>.3 && this.step%2===0) this.kick(t,.35+e*.35);
    if (Math.random() < .3+(e+1)*.28){
      const pool=this.chord.concat(this.chord.map(n=>n+12));
      const n=pool[Math.floor(Math.random()*pool.length)]+12;
      this.pluck(t,n,.07+Math.random()*.04);
    }
  },
  pluck(t,n,vel){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();
    const wm=this.wmod(); o.type=wm.wave; o.frequency.value=hz(n+wm.oct);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vel,t+.008); g.gain.exponentialRampToValueAtTime(.0001,t+1.1);
    o.connect(g); g.connect(this.bus); o.start(t); o.stop(t+1.2);
  },
  kick(t,vel){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();
    o.frequency.setValueAtTime(115,t); o.frequency.exponentialRampToValueAtTime(42,t+.14);
    g.gain.setValueAtTime(vel,t); g.gain.exponentialRampToValueAtTime(.0001,t+.38);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t+.4);
  },
  async strum(){
    if(!this.on) await this.toggle(true);
    if(!this.ctx) return;
    const t=this.ctx.currentTime+.02;
    this.chord.forEach((n,i)=>this.pluck(t+i*.05,n+12,.13));
  },
  levels(){ if(!this.on||!this.analyser) return null; this.analyser.getByteFrequencyData(this.data); return this.data; }
};

/* ================= 3D sound orb (three.js) ================= */
const Visual=(()=>{
  const api={setMood(){},preview(){},release(){},pulse(){},bump(){},setWeather(){},flash(){},hit(){return false;}};
  if(!window.THREE){ document.documentElement.classList.add("no-gl"); return api; }
  let renderer;
  const canvas=$("#stage");
  try{ renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true}); }catch(e){ document.documentElement.classList.add("no-gl"); return api; }
  renderer.setPixelRatio(Math.min(1.75,window.devicePixelRatio||1));
  renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,100); camera.position.z=7.2;
  const rig=new THREE.Group(); scene.add(rig);

  const noise=`
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

  const U={uTime:{value:0},uAmp:{value:.12},uFreq:{value:1.5},uSpeed:{value:.25},uPulse:{value:0},uGlow:{value:.7},uFade:{value:1},uLevel:{value:0},
    uColor:{value:new THREE.Color(0xffa24c)},uBg:{value:new THREE.Color(0x121014)}};
  const orbMat=new THREE.ShaderMaterial({uniforms:U,
    vertexShader:noise+`
    uniform float uTime,uAmp,uFreq,uSpeed,uPulse,uLevel;
    varying vec3 vN;varying vec3 vV;varying float vD;
    void main(){
      float n=snoise(normal*uFreq+vec3(uTime*uSpeed));
      float n2=snoise(normal*uFreq*2.1-vec3(uTime*uSpeed*1.2))*.18;
      float d=(n+n2)*(uAmp+uPulse*.12+uLevel*.12);
      vec3 p=position+normal*d; vD=d;
      vec4 mv=modelViewMatrix*vec4(p,1.); vV=-mv.xyz; vN=normalize(normalMatrix*normal);
      gl_Position=projectionMatrix*mv;
    }`,
    fragmentShader:`
    uniform vec3 uColor,uBg;uniform float uGlow,uFade,uPulse;
    varying vec3 vN;varying vec3 vV;varying float vD;
    void main(){
      vec3 n=normalize(vN),v=normalize(vV);
      vec3 L=normalize(vec3(-.75,.55,.55));
      float diff=smoothstep(-.15,1.,dot(n,L));
      float fres=pow(1.-max(dot(n,v),0.),2.6);
      vec3 shadow=vec3(.085,.07,.09);
      vec3 col=mix(shadow,uColor*(.55+uGlow*.6),diff*uGlow);
      col+=uColor*fres*.55;
      col+=uColor*max(vD,0.)*1.6;
      col+=vec3(1.,.85,.7)*pow(max(dot(reflect(-L,n),v),0.),24.)*.35*diff;
      col*=1.+uPulse*.25;
      gl_FragColor=vec4(mix(uBg,col,uFade),1.);
    }`});
  const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(1,48),orbMat);
  rig.add(orb);

  // radial equaliser ring
  const BARS=96, R=1.42;
  const barGeo=new THREE.BoxGeometry(.018,1,.018); barGeo.translate(0,.5,0);
  const barMat=new THREE.MeshBasicMaterial({color:0xffa24c,transparent:true,opacity:.85});
  const bars=new THREE.InstancedMesh(barGeo,barMat,BARS);
  const ring=new THREE.Group(); ring.add(bars); rig.add(ring);
  const dummy=new THREE.Object3D();
  const heights=new Float32Array(BARS);

  // fine dust
  // weather in the sky: rain streaks and snow
  const RN=260, rainPos=new Float32Array(RN*6), rainSeed=new Float32Array(RN);
  for(let i=0;i<RN;i++){ rainSeed[i]=Math.random(); const x=(Math.random()-.5)*16,y=(Math.random()-.5)*10,z=-3+Math.random()*5;
    rainPos.set([x,y,z,x-.05,y-.32,z],i*6); }
  const rainGeo=new THREE.BufferGeometry(); rainGeo.setAttribute("position",new THREE.BufferAttribute(rainPos,3));
  const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xf3ede6,transparent:true,opacity:.16,depthWrite:false}));
  rain.visible=false; scene.add(rain);
  const SNW=320, snowPos=new Float32Array(SNW*3);
  for(let i=0;i<SNW;i++) snowPos.set([(Math.random()-.5)*16,(Math.random()-.5)*10,-3+Math.random()*5],i*3);
  const snowGeo=new THREE.BufferGeometry(); snowGeo.setAttribute("position",new THREE.BufferAttribute(snowPos,3));
  const snow=new THREE.Points(snowGeo,new THREE.PointsMaterial({color:0xf3ede6,size:.035,transparent:true,opacity:.55,depthWrite:false}));
  snow.visible=false; scene.add(snow);
  let windX=0;
  const labelEl=document.getElementById("orbLabel"), lv3=new THREE.Vector3();

  const DUST=240, pos=new Float32Array(DUST*3);
  for(let i=0;i<DUST;i++){const r=2.6+Math.random()*4.5,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(ph)*Math.cos(th);pos[i*3+1]=r*Math.sin(ph)*Math.sin(th);pos[i*3+2]=r*Math.cos(ph)-1;}
  const dustGeo=new THREE.BufferGeometry(); dustGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xffa24c,size:.022,transparent:true,opacity:.45,depthWrite:false}));
  scene.add(dust);

  // ---------- deep space ----------
  const space=new THREE.Group(); scene.add(space);
  const starVS=`attribute float aSize; attribute float aPhase; attribute vec3 aColor; uniform float uTime,uPR;
    varying float vA; varying vec3 vC;
    void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mv;
      float tw=.55+.45*sin(uTime*(.5+fract(aPhase)*1.8)+aPhase*7.); vA=tw; vC=aColor;
      gl_PointSize=aSize*uPR*(1.+.3*tw); }`;
  const starFS=`uniform float uFade; varying float vA; varying vec3 vC;
    void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d); a*=a; gl_FragColor=vec4(vC,a*vA*uFade); }`;
  const SU={uTime:{value:0},uFade:{value:1},uPR:{value:renderer.getPixelRatio()}};
  const starMat=new THREE.ShaderMaterial({uniforms:SU,vertexShader:starVS,fragmentShader:starFS,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  function pointsGeo(n,fill){ const P=new Float32Array(n*3),C=new Float32Array(n*3),S=new Float32Array(n),H=new Float32Array(n);
    for(let i=0;i<n;i++) fill(i,P,C,S,H);
    const g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.BufferAttribute(P,3)); g.setAttribute("aColor",new THREE.BufferAttribute(C,3));
    g.setAttribute("aSize",new THREE.BufferAttribute(S,1)); g.setAttribute("aPhase",new THREE.BufferAttribute(H,1)); return g; }
  // twinkling starfield
  const stars=new THREE.Points(pointsGeo(2600,(i,P,C,S,H)=>{
    const r=22+Math.random()*38, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
    P[i*3]=r*Math.sin(ph)*Math.cos(th); P[i*3+1]=r*Math.sin(ph)*Math.sin(th); P[i*3+2]=-Math.abs(r*Math.cos(ph))-4;
    const warm=Math.random()<.14; C[i*3]=1; C[i*3+1]=warm?.68:.94; C[i*3+2]=warm?.38:.9;
    S[i]=Math.random()<.05?3+Math.random()*2.2:.8+Math.random()*1.4; H[i]=Math.random()*6.283;
  }),starMat);
  space.add(stars);
  // a distant spiral galaxy
  const galaxy=new THREE.Points(pointsGeo(7000,(i,P,C,S,H)=>{
    const arm=i%3, rr=Math.pow(Math.random(),1.7)*9, ang=arm/3*Math.PI*2+rr*.6;
    const sc=()=>Math.pow(Math.random(),3)*(Math.random()<.5?1:-1)*(.5+rr*.18);
    P[i*3]=Math.cos(ang)*rr+sc(); P[i*3+1]=sc()*.3; P[i*3+2]=Math.sin(ang)*rr+sc();
    const k=Math.min(1,rr/9);
    C[i*3]=(1-k*.3)*.55; C[i*3+1]=(.64+k*.12)*.55; C[i*3+2]=(.3+k*.55)*.55;
    S[i]=.7+Math.random()*1.3; H[i]=Math.random()*6.283;
  }),starMat);
  galaxy.position.set(-15,7,-34); galaxy.rotation.set(1.05,0,.45);
  space.add(galaxy);
  // planets
  function bandTexture(cols){ const c=document.createElement("canvas"); c.width=256; c.height=128; const x=c.getContext("2d");
    for(let y=0;y<128;y+=2){ const k=.5+.5*Math.sin(y*.21)+.25*Math.sin(y*.07+1.3); x.fillStyle=cols[Math.floor(Math.abs(k)*cols.length)%cols.length]; x.fillRect(0,y,256,2); }
    return new THREE.CanvasTexture(c); }
  const ringed=new THREE.Group();
  const pBody=new THREE.Mesh(new THREE.SphereGeometry(1,48,32),new THREE.MeshStandardMaterial({map:bandTexture(["#4a3426","#5e432f","#6f4f36","#3e2d22","#80603f"]),roughness:.9}));
  const pRing=new THREE.Mesh(new THREE.RingGeometry(1.45,2.3,96),new THREE.MeshBasicMaterial({color:0xffa24c,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false}));
  const pRing2=new THREE.Mesh(new THREE.RingGeometry(2.4,2.5,96),new THREE.MeshBasicMaterial({color:0xffa24c,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));
  pRing.rotation.x=pRing2.rotation.x=1.25;
  ringed.add(pBody,pRing,pRing2); ringed.rotation.z=.32; ringed.scale.setScalar(1.15);
  ringed.position.set(-2,-10.5,-40); space.add(ringed);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),new THREE.MeshStandardMaterial({color:0x8d8592,roughness:1}));
  moon.scale.setScalar(.5); moon.position.set(12.5,-6.4,-19); space.add(moon);
  const tiny=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),new THREE.MeshStandardMaterial({color:0xffa24c,roughness:.7,emissive:0x3a1e08}));
  tiny.scale.setScalar(.16); tiny.position.set(5.2,-3.4,-8); space.add(tiny);

  // light for the solid pieces
  scene.add(new THREE.AmbientLight(0xffffff,.5));
  const sun=new THREE.DirectionalLight(0xffe2c4,1.15); sun.position.set(-3,2.5,4); scene.add(sun);

  // orbiting records
  function vinylTexture(){
    const c=document.createElement("canvas"); c.width=c.height=256; const x=c.getContext("2d");
    x.fillStyle="#0f0d11"; x.beginPath(); x.arc(128,128,128,0,7); x.fill();
    for(let r=46;r<126;r+=3){ x.strokeStyle=`rgba(255,255,255,${(r%12===1)?.08:.035})`; x.lineWidth=1; x.beginPath(); x.arc(128,128,r,0,7); x.stroke(); }
    const sh=x.createLinearGradient(0,0,256,256); sh.addColorStop(.38,"rgba(255,255,255,0)"); sh.addColorStop(.5,"rgba(255,255,255,.1)"); sh.addColorStop(.62,"rgba(255,255,255,0)");
    x.fillStyle=sh; x.beginPath(); x.arc(128,128,126,0,7); x.fill();
    x.fillStyle="#ffa24c"; x.beginPath(); x.arc(128,128,40,0,7); x.fill();
    x.fillStyle="rgba(18,16,20,.5)"; x.fillRect(100,122,56,3);
    x.fillStyle="#121014"; x.beginPath(); x.arc(128,128,5,0,7); x.fill();
    return new THREE.CanvasTexture(c);
  }
  const faceMat=new THREE.MeshStandardMaterial({map:vinylTexture(),roughness:.32,metalness:.35,transparent:true});
  const sideMat=new THREE.MeshStandardMaterial({color:0x1d1a20,roughness:.6,transparent:true});
  const discGeo=new THREE.CylinderGeometry(1,1,.04,64);
  const lineMat=new THREE.LineBasicMaterial({color:0xffa24c,transparent:true,opacity:.14});
  const ORBITS=[{r:1.85,tilt:1.18,twist:.38,speed:.34,size:.25,phase:0},{r:2.12,tilt:1.32,twist:-.52,speed:-.24,size:.19,phase:2.2},{r:2.38,tilt:1.06,twist:.12,speed:.17,size:.31,phase:4.1}];
  const discs=ORBITS.map(o=>{
    const pivot=new THREE.Group(); pivot.rotation.set(o.tilt,0,o.twist); rig.add(pivot);
    const pts=[]; for(let i=0;i<=160;i++){const a=i/160*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*o.r,0,Math.sin(a)*o.r));}
    pivot.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),lineMat));
    const d=new THREE.Mesh(discGeo,[sideMat,faceMat,faceMat]); d.scale.set(o.size,1,o.size); pivot.add(d);
    return {o,d,a:o.phase};
  });

  // state
  const target={amp:.08,freq:1.2,speed:.2,glow:.7,e:-.5}, cur={...target};
  let committed={v:-.45,e:-.5}, previewing=false, pulseT=0, loading=false;
  function moodTo(v,e){ const ne=(e+1)/2, nv=(v+1)/2;
    target.amp=.035+ne*.17; target.speed=.08+ne*.5; target.freq=.85+ne*.95; target.glow=.42+nv*.58; target.e=e; }
  moodTo(committed.v,committed.e);

  let W=1,H=1,wide=true,base={x:2.1,y:-.05,s:1,fade:1};
  function resize(){ W=innerWidth; H=innerHeight; renderer.setSize(W,H,false); camera.aspect=W/H; camera.updateProjectionMatrix();
    wide=W>920;
    const halfW=Math.tan(THREE.MathUtils.degToRad(17.5))*camera.position.z*camera.aspect;
    base = wide ? {x:Math.min(2.25,halfW*.52),y:-.05,s:1,fade:1} : {x:0,y:Math.tan(THREE.MathUtils.degToRad(17.5))*camera.position.z*(1-2*165/H),s:.4,fade:.8};
    if (reduceMotion) draw(0);
  }
  addEventListener("resize",resize);

  const mouse={x:0,y:0,tx:0,ty:0};
  addEventListener("pointermove",ev=>{ mouse.tx=ev.clientX/W*2-1; mouse.ty=ev.clientY/H*2-1; },{passive:true});

  const ray=new THREE.Raycaster(), ndc=new THREE.Vector2();
  api.hit=(x,y)=>{ ndc.set(x/W*2-1,-(y/H)*2+1); ray.setFromCamera(ndc,camera); return ray.intersectObjects([orb,...discs.map(x=>x.d)]).length>0; };

  let last=performance.now(), t=0;
  function draw(dt){
    t+=dt;
    const k=reduceMotion?1:Math.min(1,dt*2.2);
    for(const p of ["amp","freq","speed","glow"]) cur[p]=lerp(cur[p],target[p],k);
    pulseT=Math.max(0,pulseT-dt*1.4);
    const lv=Sound.levels();
    let avg=0; if(lv){ for(let i=0;i<64;i++) avg+=lv[i]; avg/=64*255; }
    U.uTime.value=t; U.uAmp.value=cur.amp; U.uFreq.value=cur.freq; U.uSpeed.value=cur.speed; U.uGlow.value=cur.glow;
    U.uPulse.value=Math.max(pulseT, loading?(.5+.5*Math.sin(t*6))*.8:0);
    U.uLevel.value=lerp(U.uLevel.value,avg,.2);

    // scroll choreography: orb drifts aside and dims as you leave the hero
    const p=clamp(scrollY/(H*.9),0,1);
    const sx=base.x+(wide?.6:0)*p, sy=base.y+(wide?.35:.5)*p, sc=base.s*(1-.18*p);
    rig.position.set(sx,sy,0); rig.scale.setScalar(sc);
    U.uFade.value=base.fade*(1-.75*p);
    barMat.opacity=.85*(1-.6*p); dust.material.opacity=.45*(1-.4*p);

    mouse.x=lerp(mouse.x,mouse.tx,reduceMotion?1:.05); mouse.y=lerp(mouse.y,mouse.ty,reduceMotion?1:.05);
    rig.rotation.y=mouse.x*.28-p*.35; rig.rotation.x=mouse.y*.18+p*.55;
    orb.rotation.y+=dt*.08; ring.rotation.z+=dt*(.04+(cur.amp)*.2);
    dust.rotation.y+=dt*.01; dust.rotation.x=p*.3;
    if(rain.visible){ const a=rainGeo.attributes.position.array, sp=dt*(9+windX*4);
      for(let i=0;i<RN;i++){ const o=i*6; a[o+1]-=sp; a[o+4]-=sp; a[o]-=windX*dt*3; a[o+3]-=windX*dt*3;
        if(a[o+4]<-5.5){ const x=(Math.random()-.5)*16, y=5+Math.random()*1.5; a[o]=x; a[o+1]=y; a[o+3]=x-.05-windX*.08; a[o+4]=y-.32; } }
      rainGeo.attributes.position.needsUpdate=true; rain.material.opacity=.16*(1-.4*p); }
    if(snow.visible){ const a=snowGeo.attributes.position.array;
      for(let i=0;i<SNW;i++){ const o=i*3; a[o+1]-=dt*(.35+(i%7)*.04); a[o]+=Math.sin(t*.6+i)*dt*.15+windX*dt*.6;
        if(a[o+1]<-5.5){ a[o+1]=5.5; a[o]=(Math.random()-.5)*16; } }
      snowGeo.attributes.position.needsUpdate=true; }
    if(labelEl && wide){ rig.getWorldPosition(lv3); lv3.project(camera);
      labelEl.style.transform=`translate(${(lv3.x*.5+.5)*W}px,${(-lv3.y*.5+.5)*H}px) translate(-50%,-50%)`;
      labelEl.style.opacity=String(Math.max(0,1-p*3)); }
    SU.uTime.value=t; SU.uFade.value=1-.25*p;
    space.rotation.y=p*.22-mouse.x*.03; space.rotation.x=-p*.12+mouse.y*.02;
    galaxy.rotation.y+=dt*.012;
    pBody.rotation.y+=dt*.05; moon.rotation.y+=dt*.03;
    ringed.position.y=-10.5+p*6; moon.position.y=-6.4+p*4; tiny.position.y=-3.4+p*2.2+Math.sin(t*.3)*.15;
    camera.position.x=lerp(camera.position.x,mouse.x*.3,.05); camera.position.y=lerp(camera.position.y,-mouse.y*.2,.05); camera.lookAt(0,0,0);

    const energy=(target.e+1)/2;
    const fadeN=U.uFade.value;
    faceMat.opacity=sideMat.opacity=Math.min(1,fadeN*1.1); lineMat.opacity=.14*fadeN;
    const boost=1+U.uPulse.value*2.5+U.uLevel.value*1.5;
    discs.forEach(({o,d},i)=>{
      discs[i].a+=dt*o.speed*(.55+energy*.9)*boost;
      const a=discs[i].a;
      d.position.set(Math.cos(a)*o.r,Math.sin(t*.6+o.phase)*.06,Math.sin(a)*o.r);
      d.rotation.y+=dt*(1.2+energy*2.4);
      d.rotation.x=.55+.35*Math.sin(t*.5+o.phase);
      d.rotation.z=.25*Math.cos(t*.4+o.phase);
    });
    for(let i=0;i<BARS;i++){
      const j=i<BARS/2?i:BARS-1-i;
      let val;
      if(lv){ const bin=1+Math.floor(Math.pow(j/(BARS/2),1.5)*60); val=lv[bin]/255; }
      else { val=(.5+.5*Math.sin(t*(1.2+energy*2.6)+i*.37))*(.5+.5*Math.sin(t*(.8+energy*1.4)*.7+i*.13))*(.2+.8*energy); }
      val=Math.max(val,U.uPulse.value*.6*(.5+.5*Math.sin(i*.9+t*8)));
      heights[i]=lerp(heights[i],val,reduceMotion?1:.25);
      const a=i/BARS*Math.PI*2;
      dummy.position.set(Math.cos(a)*R,Math.sin(a)*R,0);
      dummy.rotation.set(0,0,a-Math.PI/2);
      dummy.scale.set(1,.035+heights[i]*.55,1);
      dummy.updateMatrix(); bars.setMatrixAt(i,dummy.matrix);
    }
    bars.instanceMatrix.needsUpdate=true;
    renderer.render(scene,camera);
  }
  function loop(now){ const dt=Math.min(.05,(now-last)/1000); last=now; if(!document.hidden) draw(dt); requestAnimationFrame(loop); }
  resize();
  if (reduceMotion){ draw(0); addEventListener("scroll",()=>draw(0),{passive:true}); }
  else requestAnimationFrame(loop);

  api.setMood=(v,e)=>{ committed={v,e}; if(!previewing) moodTo(v,e); pulseT=1; if(reduceMotion) draw(0); };
  api.preview=(v,e)=>{ previewing=true; moodTo(v,e); if(reduceMotion) draw(0); };
  api.release=()=>{ previewing=false; moodTo(committed.v,committed.e); if(reduceMotion) draw(0); };
  api.pulse=on=>{ loading=on; };
  api.bump=()=>{ pulseT=1; };
  api.setWeather=w=>{ const k=w.kind; rain.visible=(k==="rain"||k==="storm"); snow.visible=(k==="snow"); windX=(k==="wind"||(w.wind||0)>25)?1:0; if(reduceMotion) draw(0); };
  api.flash=()=>{ pulseT=1; if(reduceMotion) return; const f=document.getElementById("flash"); f.style.opacity=".07"; setTimeout(()=>f.style.opacity="0",120); setTimeout(()=>{f.style.opacity=".04";},220); setTimeout(()=>f.style.opacity="0",320); };
  return api;
})();

/* ================= Covers (one colour, varied by mood) ================= */
function drawCover(canvas,pl,px=400){
  if(!canvas) return;
  const dpr=Math.min(2,window.devicePixelRatio||1); canvas.width=px*dpr; canvas.height=px*dpr;
  const c=canvas.getContext("2d"); c.scale(dpr,dpr);
  const m=MOODS[pl.moodKey]||MOODS.rain, s=px;
  c.fillStyle="#16131a"; c.fillRect(0,0,s,s);
  const gx=s*(.35+(pl.v+1)*.15), gy=s*(.62-(pl.e+1)*.18);
  const g=c.createRadialGradient(gx,gy,0,gx,gy,s*(.45+m.light*.5));
  g.addColorStop(0,`rgba(255,162,76,${.55+m.light*.45})`); g.addColorStop(.35,`rgba(255,162,76,${.18+m.light*.25})`); g.addColorStop(1,"rgba(255,162,76,0)");
  c.fillStyle=g; c.fillRect(0,0,s,s);
  // equaliser ring echoing the orb
  const bars=64, r0=s*.2;
  c.strokeStyle="rgba(255,162,76,.55)"; c.lineWidth=Math.max(1,s*.004);
  const rr=rng(pl.title.length*97+Math.round((pl.e+1)*50));
  for(let i=0;i<bars;i++){ const a=i/bars*Math.PI*2, h=s*(.015+rr()*.06*(.4+(pl.e+1)*.4));
    c.beginPath(); c.moveTo(gx+Math.cos(a)*r0,gy+Math.sin(a)*r0); c.lineTo(gx+Math.cos(a)*(r0+h),gy+Math.sin(a)*(r0+h)); c.stroke(); }
  if(px>=200){
    c.fillStyle="rgba(243,237,230,.94)"; c.font=`italic 400 ${Math.round(s*.11)}px "Bodoni Moda", Georgia, serif`;
    wrapText(c,pl.title,s*.08,s*.86,s*.84,s*.12);
    c.font=`500 ${Math.round(s*.032)}px "Schibsted Grotesk", system-ui, sans-serif`; c.fillStyle="rgba(243,237,230,.6)";
    c.fillText("AFTER HOURS  ·  "+m.freq+" FM",s*.08,s*.11);
  }
}
function wrapText(c,text,x,y,maxW,lh){const words=String(text).split(/\s+/),lines=[];let line="";
  for(const w of words){const test=line?line+" "+w:w;if(c.measureText(test).width>maxW&&line){lines.push(line);line=w;}else line=test;}
  lines.push(line); lines.slice(-3).forEach((l,i,arr)=>c.fillText(l,x,y-(arr.length-1-i)*lh));}

/* ================= UI ================= */
function $(s){return document.querySelector(s);}
const resultEl=$("#result");
let current=null, mode="match", busy=false;
const sp=t=>"https://open.spotify.com/search/"+encodeURIComponent(t.title+" "+t.artist);
const yt=t=>"https://www.youtube.com/results?search_query="+encodeURIComponent(t.title+" "+t.artist);
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const goTo=el=>el.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"});

function applyMood(pl){ Visual.setMood(pl.v,pl.e); Sound.setMood(pl.v,pl.e,pl.moodKey); }

function render(pl,{example=false,animate=true}={}){
  current=pl; const m=MOODS[pl.moodKey];
  const label=example?"Example night":(pl.source==="station"?"Station · "+m.freq+" FM":"Your playlist");
  resultEl.innerHTML=`
    <p class="eyebrow label"><span class="dot"></span>${esc(label)}${example?' · "'+esc(pl.text)+'"':""}</p>
    ${pl.care?`<div class="care"><p>That sounds really heavy, and you don't have to carry it alone tonight. If you might hurt yourself, please reach out to someone you trust or a crisis line near you. You can find one at <a href="https://findahelpline.com" target="_blank" rel="noopener">findahelpline.com</a>.</p></div>`:""}
    <div class="playlist-head">
      <div class="sleeve" id="sleeve"><div class="disc" aria-hidden="true"><i></i></div><canvas class="cover" id="cover" role="img" aria-label="Playlist cover for ${esc(pl.title)}"></canvas></div>
      <div>
        <h2>${esc(pl.title)}</h2>
        <p class="read">${esc(pl.read)}</p>
        <div class="meta"><span><b>${pl.tracks.length}</b> tracks</span><span>Mood: <b>${esc(m.name)}</b></span><span>${pl.mode==="lift"?"Lifts you up":"Stays with you"}</span>${savedName()?`<span>Picked by <b>${esc(savedName())}</b></span>`:""}</div>
        <div class="actions">
          <a class="go" id="playFirst" href="${pl.tracks[0]?sp(pl.tracks[0]):"#stations"}" target="_blank" rel="noopener">Play first track <span aria-hidden="true">↗</span></a>
          <button class="ghost" id="again" type="button">Try another mix</button>
          <button class="ghost" id="copy" type="button">Copy tracklist</button>
        </div>
      </div>
    </div>
    <ol class="tracks" id="trackList">${pl.tracks.map((t,i)=>trackRow(t,i,animate)).join("")}</ol>`;
  drawCover($("#cover"),pl);
  setTimeout(()=>{ const sl=$("#sleeve"); if(sl) sl.classList.add("out"); },animate?120:0);
  $("#again").onclick=remix; $("#copy").onclick=copyList;
  $("#trackList").onclick=e=>{const b=e.target.closest("button[data-rm]"); if(!b) return; current.tracks.splice(+b.dataset.rm,1); render(current,{animate:false}); save(current);};
}
function trackRow(t,i,animate){
  return `<li class="track${animate?" enter":""}" style="animation-delay:${animate?i*55:0}ms">
    <div><span class="t-title">${esc(t.title)}</span><span class="t-artist">${esc(t.artist)}</span>${t.note?`<span class="t-note">${esc(t.note)}</span>`:""}</div>
    <div class="t-links">
      <a href="${sp(t)}" target="_blank" rel="noopener" aria-label="Find ${esc(t.title)} on Spotify">Spotify</a>
      <a href="${yt(t)}" target="_blank" rel="noopener" aria-label="Find ${esc(t.title)} on YouTube">YouTube</a>
      <button type="button" data-rm="${i}" aria-label="Remove ${esc(t.title)}" title="Remove">×</button>
    </div></li>`;
}

async function generate(text,opts={}){
  if(busy) return; busy=true; $("#go").disabled=true;
  const size=12, care=CARE.test(text);
  resultEl.innerHTML=`<p class="eyebrow label"><span class="dot"></span>Your playlist</p><div class="status"><span class="eq"><i></i><i></i><i></i><i></i></span>${esc(capFirst(orbName()))} is tuning in to how you feel…</div>`;
  Visual.pulse(true); goTo(resultEl);
  let pl=care?null:await readWithClaude({text,mode,size,avoid:opts.avoid||[]});
  if(!pl){
    const r=readLocal(text);
    pl=buildLocal({text,v:r.v,e:r.e,votes:r.votes,mode,size,seed:opts.seed??Date.now()%100000,care});
    if(r.weak&&!care) pl.read="That's hard to place, so here's a gentle middle ground. Add a few words about how you feel for a closer match.";
  }
  pl.care=pl.care||care;
  Visual.pulse(false); render(pl); applyMood(pl); save(pl);
  $("#go").disabled=false; busy=false;
}
function remix(){
  if(!current) return;
  if(current.source==="station"){ playStation(current.moodKey); return; }
  generate(current.text,{avoid:current.tracks.map(t=>t.title+" by "+t.artist),seed:Math.floor(Math.random()*1e6)});
}
function playStation(k){
  const m=MOODS[k];
  const pl=buildLocal({text:m.name,v:m.v,e:m.e,votes:{[k]:3},mode,size:12,seed:Math.floor(Math.random()*1e6)});
  pl.source="station"; render(pl); applyMood(pl); save(pl); goTo(resultEl);
}
async function copyList(){
  const p=current; if(!p) return;
  const txt=`${p.title} · After Hours\n${p.read}\n\n`+p.tracks.map((t,i)=>`${i+1}. ${t.title} – ${t.artist}`).join("\n");
  try{ await navigator.clipboard.writeText(txt); toast("Tracklist copied"); }catch{ toast("Couldn't copy. Select the list and copy it manually."); }
}
let toastTimer;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}

/* Saved nights (this browser only) */
const KEY="afterhours.nights";
function loadSaved(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch{return[];}}
function save(pl){
  try{ let list=loadSaved(); pl.id=pl.id||Date.now(); pl.at=pl.at||Date.now();
    list=list.filter(x=>x.id!==pl.id); list.unshift(pl); localStorage.setItem(KEY,JSON.stringify(list.slice(0,6))); }catch{}
  renderSaved();
}
function renderSaved(){
  const list=loadSaved(), el=$("#savedList");
  if(!list.length){ el.innerHTML=`<p class="empty-note">Nothing yet. Your playlists will show up here.</p>`; return; }
  el.innerHTML=list.map((p,i)=>`<button type="button" data-i="${i}"><canvas data-c="${i}"></canvas><span><strong>${esc(p.title)}</strong><br><small>${esc(MOODS[p.moodKey]?.name||"")} · ${p.tracks.length} tracks</small></span><small>${timeAgo(p.at)}</small></button>`).join("");
  list.forEach((p,i)=>drawCover(el.querySelector(`[data-c="${i}"]`),p,48));
  el.onclick=e=>{const b=e.target.closest("button[data-i]"); if(!b) return; const p=list[+b.dataset.i]; render(p); applyMood(p); goTo(resultEl);};
}
function timeAgo(t){const m=Math.round((Date.now()-t)/60000);if(m<1)return"just now";if(m<60)return m+" min ago";const h=Math.round(m/60);if(h<24)return h+" h ago";return Math.round(h/24)+" d ago";}

/* Setup */
["Can't sleep, my mind won't stop","Good news, I want to dance","Missing someone I shouldn't","Need to lock in and finish this"].forEach(t=>{
  const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t;
  b.onclick=()=>{ $("#feeling").value=t; generate(t); }; $("#tries").appendChild(b);
});

const stationEl=$("#stationList");
stationEl.innerHTML=Object.keys(MOODS).map((k,i)=>`<li><button class="station" type="button" data-k="${k}"><span class="n">${String(i+1).padStart(2,"0")}</span><span class="name">${MOODS[k].name}</span><span class="tags">${MOODS[k].tags}</span><span class="f">${MOODS[k].freq} FM</span></button></li>`).join("");
stationEl.addEventListener("click",e=>{const b=e.target.closest("button[data-k]"); if(b) playStation(b.dataset.k);});
stationEl.addEventListener("pointerover",e=>{const b=e.target.closest("button[data-k]"); if(b){const m=MOODS[b.dataset.k]; Visual.preview(m.v,m.e);}});
stationEl.addEventListener("pointerleave",()=>Visual.release());
stationEl.addEventListener("focusin",e=>{const b=e.target.closest("button[data-k]"); if(b){const m=MOODS[b.dataset.k]; Visual.preview(m.v,m.e);}});
stationEl.addEventListener("focusout",()=>Visual.release());

function setMode(m){mode=m;$("#mode-match").setAttribute("aria-pressed",m==="match");$("#mode-lift").setAttribute("aria-pressed",m==="lift");}
$("#mode-match").onclick=()=>setMode("match"); $("#mode-lift").onclick=()=>setMode("lift");
$("#ask").addEventListener("submit",e=>{e.preventDefault();const text=$("#feeling").value.trim();
  if(!text){$("#feeling").focus();toast("Tell us a little about how you feel first");return;} generate(text);});
$("#feeling").addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))$("#ask").requestSubmit();});

$("#soundBtn").onclick=()=>Sound.toggle();

// menu
const menu=$("#menu");
function setMenu(open){ menu.classList.toggle("open",open); $("#menuBtn").setAttribute("aria-expanded",open); if(open) menu.querySelector("a").focus(); else $("#menuBtn").focus(); }
$("#menuBtn").onclick=()=>setMenu(true); $("#menuClose").onclick=()=>setMenu(false);
menu.addEventListener("click",e=>{ if(e.target.closest("a")) setMenu(false); });
addEventListener("keydown",e=>{ if(e.key==="Escape"&&menu.classList.contains("open")) setMenu(false); });

// header background on scroll
addEventListener("scroll",()=>$("#top").classList.toggle("scrolled",scrollY>40),{passive:true});

// tap the orb
const INTERACTIVE="a,button,textarea,input,label,.ask,.menu";
addEventListener("pointerdown",e=>{ if(e.target.closest(INTERACTIVE)) return; if(Visual.hit(e.clientX,e.clientY)){ Sound.strum(); Visual.bump(); } });

// cursor ring
const cur=$("#cursor"); let cx=-100,cy=-100,tx=-100,ty=-100;
addEventListener("pointermove",e=>{ tx=e.clientX; ty=e.clientY;
  const overUI=!!e.target.closest("a,button,.station,textarea");
  const overOrb=!overUI && !e.target.closest(INTERACTIVE) && Visual.hit(tx,ty);
  cur.classList.toggle("big",overUI||overOrb); document.body.classList.toggle("on-orb",overOrb);
},{passive:true});
(function follow(){ cx=reduceMotion?tx:lerp(cx,tx,.22); cy=reduceMotion?ty:lerp(cy,ty,.22); cur.style.transform=`translate(${cx}px,${cy}px)`; requestAnimationFrame(follow); })();

// gentle reveals (content is always visible; only position eases in)
if(!reduceMotion && "IntersectionObserver" in window){
  const io=new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.remove("pre"); io.unobserve(en.target);} }),{rootMargin:"0px 0px -10% 0px"});
  document.querySelectorAll(".reveal").forEach(el=>{ if(el.getBoundingClientRect().top>innerHeight){ el.classList.add("pre"); io.observe(el);} });
}
document.querySelectorAll("#headline .w").forEach((w,i)=>w.style.animationDelay=(i*90)+"ms");

/* ================= Orb name + weather ================= */
const store={ get(k,d){ try{ const v=localStorage.getItem(k); return v===null?d:v; }catch{ return d; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch{} } };
const savedName=()=>store.get("afterhours.orbName","").trim();
const orbName=()=>savedName()||"the orb";
const capFirst=s=>s.charAt(0).toUpperCase()+s.slice(1);
function applyName(){
  const n=orbName();
  document.querySelectorAll(".orbname").forEach(el=>el.textContent=n);
  $("#orbLabelName").textContent=savedName()||"Your orb";
}
const WX_NAMES={clear:"Clear sky",clouds:"Cloudy",fog:"Foggy",rain:"Rain",storm:"Thunderstorm",snow:"Snow",wind:"Windy",off:"Weather off"};
const WX_STATE={clear:"under a clear sky",clouds:"under the clouds",fog:"in the fog",rain:"listening to the rain",storm:"riding out the storm",snow:"in the snow",wind:"in the wind",off:"listening"};
function wxFromCode(code,wind){
  let k = code===0||code===1 ? "clear" : code<=3 ? "clouds" : code===45||code===48 ? "fog"
    : (code>=51&&code<=67)||(code>=80&&code<=82) ? "rain" : (code>=71&&code<=77)||code===85||code===86 ? "snow" : code>=95 ? "storm" : "clouds";
  if((k==="clear"||k==="clouds") && wind>30) k="wind";
  return k;
}
const Weather={
  current:{kind:"off"}, timer:null,
  set(w,note){
    this.current=w; Sound.setWeather(w); Visual.setWeather(w);
    const live=w.source==="auto";
    const temp=typeof w.temp==="number"?` · ${Math.round(w.temp)}°`:"";
    $("#wxText").textContent=(w.kind==="off"&&note)?note:WX_NAMES[w.kind]+temp+(live?" near you":"");
    $("#wxChip").classList.toggle("live",live);
    $("#orbLabelState").textContent=WX_STATE[w.kind]||"listening";
    if(note) $("#wxHint").textContent=note;
  },
  start(){
    clearInterval(this.timer);
    const mode=store.get("afterhours.wxMode","auto");
    if(mode!=="auto"){ this.set({kind:mode,source:"manual"},mode==="off"?"Weather is ignored. The orb sounds the same in any weather.":"Using the weather you picked."); return; }
    this.check(); this.timer=setInterval(()=>this.check(),30*60*1000);
  },
  fail(){
    this.set({kind:"off",source:"none"},"Couldn't get local weather here. Location or network access is blocked, so choose the weather from the list in Settings.");
    $("#wxText").textContent="Set the weather";
  },
  check(){
    $("#wxText").textContent="Checking local weather…";
    if(!navigator.geolocation){ this.fail(); return; }
    let done=false; const guard=setTimeout(()=>{ if(!done){ done=true; this.fail(); } },12000);
    try{
      navigator.geolocation.getCurrentPosition(async pos=>{
        try{
          const la=pos.coords.latitude.toFixed(2), lo=pos.coords.longitude.toFixed(2);
          const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,weather_code,wind_speed_10m,is_day`);
          if(!r.ok) throw new Error("weather");
          const c=(await r.json()).current;
          if(done) return; done=true; clearTimeout(guard);
          const t=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
          this.set({kind:wxFromCode(c.weather_code,c.wind_speed_10m),temp:c.temperature_2m,wind:c.wind_speed_10m,isDay:!!c.is_day,source:"auto"},
            `Live weather near you, updated at ${t}. It refreshes every 30 minutes.`);
        }catch{ if(!done){ done=true; clearTimeout(guard); this.fail(); } }
      },()=>{ if(!done){ done=true; clearTimeout(guard); this.fail(); } },{timeout:10000,maximumAge:10*60*1000});
    }catch{ if(!done){ done=true; clearTimeout(guard); this.fail(); } }
  }
};

const sheet=$("#settings");
function openSettings(){ $("#orbName").value=savedName(); $("#wxMode").value=store.get("afterhours.wxMode","auto"); sheet.hidden=false; $("#orbName").focus(); }
function closeSettings(){ sheet.hidden=true; $("#setBtn").focus(); }
$("#setBtn").onclick=openSettings; $("#wxChip").onclick=openSettings; $("#setClose").onclick=closeSettings;
$("#menuSettings").onclick=e=>{ e.preventDefault(); setMenu(false); openSettings(); };
sheet.addEventListener("click",e=>{ if(e.target===sheet) closeSettings(); });
addEventListener("keydown",e=>{ if(e.key==="Escape"&&!sheet.hidden) closeSettings(); });
$("#setForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#orbName").value.trim().slice(0,20);
  store.set("afterhours.orbName",name); store.set("afterhours.wxMode",$("#wxMode").value);
  applyName(); Weather.start(); closeSettings();
  if(current) render(current,{animate:false});
  toast(name?`Say hi to ${name}`:"Settings saved");
});
applyName(); Weather.start();

// open in a working state with a clearly marked example
const ex="Rainy evening, a bit lonely but okay", exR=readLocal(ex);
const example=buildLocal({text:ex,v:exR.v,e:exR.e,votes:exR.votes,mode:"match",size:10,seed:7});
render(example,{example:true,animate:false}); applyMood(example);
renderSaved();
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{ if(current) drawCover($("#cover"),current); renderSaved(); });
