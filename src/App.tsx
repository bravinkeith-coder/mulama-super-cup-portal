import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl || "https://example.supabase.co", supabaseAnonKey || "public-anon-key");
const PRIZES: Record<string, {pos:string; amount:string}[]> = {
  Men: [{pos:"1st Position",amount:"KES 300,000"},{pos:"2nd Position",amount:"KES 200,000"},{pos:"3rd Position",amount:"KES 150,000"},{pos:"4th Position",amount:"KES 100,000"}],
  Women: [{pos:"1st Position",amount:"KES 200,000"},{pos:"2nd Position",amount:"KES 150,000"},{pos:"3rd Position",amount:"KES 100,000"},{pos:"4th Position",amount:"KES 50,000"}],
};
const UNIFORM_ALLOC = [{ward:"Maeni",teams:12},{ward:"Kibingei",teams:12},{ward:"Kamukuywa",teams:12},{ward:"Kimilili",teams:13}];
function prizeForKnockout(match:any, div:string){
  const label = String(match?.label||"");
  const list = PRIZES[div==="Women"?"Women":"Men"];
  if(label.includes("Final") && !label.includes("Semi")) return `Final — Winner = ${list[0].pos} (${list[0].amount}) • Runner-up = ${list[1].pos} (${list[1].amount})`;
  if(label.includes("3rd")) return `3rd-Place Playoff — Winner = ${list[2].pos} (${list[2].amount}) • Loser = ${list[3].pos} (${list[3].amount})`;
  if(label.includes("Semi")) return `Semi-Final — Winner goes to Final (1st / 2nd) • Loser goes to 3rd-Place Playoff (3rd / 4th)`;
  if(label.includes("Quarter")||label.includes("Playoff")) return `Knockout — Winner advances toward Final (1st / 2nd) • Prize decided by final position`;
  return `Knockout — Prize decided by final position: 1st ${list[0].amount} • 2nd ${list[1].amount} • 3rd ${list[2].amount} • 4th ${list[3].amount}`;
}
import { Trophy, Search, MapPin, CalendarDays, Users, Shield, Clock, ChevronRight, Plus, RotateCcw, Lock, Unlock, Target, Medal, Sparkles, Building2, CheckCircle2, AlertTriangle, X, ClipboardList, UserPlus, Pencil, Trash2, Eye, Filter, Eye as EyeIcon } from 'lucide-react';

async function api(action: string, args: any) {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error("Portal database is not configured. Add your Supabase URL and anon key to Cloudflare environment variables.");
  }
  if (action === "records.list") {
    const { data, error } = await supabase.from("portal_records").select("id, collection, value").eq("collection", args.collection).order("created_at", { ascending: true });
    if (error) throw error;
    return { records: data || [] };
  }
  if (action === "records.create") {
    const { data, error } = await supabase.from("portal_records").insert({ collection: args.collection, value: args.value }).select("id, collection, value").single();
    if (error) throw error;
    return data;
  }
  if (action === "records.replace") {
    const { data, error } = await supabase.from("portal_records").update({ value: args.value }).eq("id", args.id).select("id, collection, value").single();
    if (error) throw error;
    return data;
  }
  if (action === "records.delete") {
    const { error } = await supabase.from("portal_records").delete().eq("id", args.id);
    if (error) throw error;
    return { id: args.id };
  }
  throw new Error(`Unsupported action: ${action}`);
}

type ResultVal = { hg: number; ag: number; status: string; scorers?: any[]; cards?: any[] };
type ResultsMap = Record<string, ResultVal>;
function mulberry(seed: number) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const WARDS = ["Kibingei","Kimilili","Maeni","Kamukuywa"];
const COUNTIES = ["Bungoma County"];
const VENUES = ["Eldoret Sports Club","Kipchoge Stadium","University of Eldoret Grounds","Wareng Stadium","Eldoret Showground Arena","Hill School Pitch","Moi University Annex","SOS Eldoret Ground","Kimilili Stadium","Kibingei Primary Ground","Maeni Primary Ground","Kamukuywa Market Ground"];
const COLORS = ["#F5C518","#E63946","#2A9D8F","#4361EE","#FF6D00","#7209B7","#06D6A0","#118AB2","#EF476F","#FFD166","#80B918","#00B4D8"];
const HOME_COLORS = [{name:"Red",value:"#E63946"},{name:"Blue",value:"#4361EE"},{name:"Green",value:"#2A9D8F"},{name:"Yellow",value:"#F5C518"},{name:"White",value:"#FFFFFF"},{name:"Black",value:"#111111"},{name:"Orange",value:"#FF6D00"},{name:"Purple",value:"#7209B7"},{name:"Maroon",value:"#800000"},{name:"Sky Blue",value:"#00B4D8"}];
function maskIdNo(v:string){ const s=String(v||"").trim(); if(!s) return "—"; if(s.length<=4) return "****"+s; return "****"+s.slice(-4); }
function maskPhone(v:string){ const s=String(v||"").trim(); if(!s) return "—"; if(s.length<=4) return "****"+s; return "****"+s.slice(-4); }
function readableOn(color:string){ return ["#FFFFFF","#F5C518","#FFD166","#00B4D8"].includes(color) ? "#111111" : "#FFFFFF"; }
const WOMEN_COLORS = ["#C026D3","#EC4899","#A855F7","#F472B6","#9333EA","#DB2777","#7C3AED","#E879F9","#BE185D","#8B5CF6"];
const REFEREES = ["Ref. Peter Kamau","Ref. Mercy Chebet","Ref. David Otieno","Ref. Grace Wanjiru","Ref. Collins Rono","Ref. Faith Koech","Ref. Samuel Bett","Ref. Irene Lagat","Ref. Moses Kirui","Ref. Naomi Sang"];
const FORMATIONS = ["4-4-2","4-3-3","3-5-2","4-2-3-1"];
const OFFICIAL_ROLES = ["Coach","Chairman","Manager","Secretary","Treasurer","Captain"];
type TeamStatus = "Confirmed" | "Pending";
type Team = { id:number; name:string; coach:string; county:string; group:string; color:string; initials:string; region:string; division:string; ward:string; awayColor?:string; homeGround?:string; status: TeamStatus; sourceOrder:number };
type Fixture = { id:string; week:number; group:string; ward:string; stage:string; home:number; away:number; date:string; time:string; venue:string; round:string; division:string; matchNo:number };
type Official = { name:string; role:string; phone:string; idNo:string; status?:string };
const REAL_TEAMS_RAW: [string,string,"Men"|"Women",TeamStatus][] = [
  ["Classic Boys","Kamukuywa","Men","Confirmed"],["Rockstars FC","Kamukuywa","Men","Confirmed"],["Sosio United","Kamukuywa","Men","Confirmed"],["Vision FC","Kamukuywa","Men","Confirmed"],["Sibakala","Kamukuywa","Men","Confirmed"],["Makhonge FC","Kamukuywa","Men","Confirmed"],["Kamukuywa Utd","Kamukuywa","Men","Confirmed"],["Kamukuywa Sportiff","Kamukuywa","Men","Confirmed"],["Matisi FC","Kamukuywa","Men","Confirmed"],["Mapera FC","Kamukuywa","Men","Confirmed"],["Impala FC","Kamukuywa","Men","Confirmed"],["Nakalira FC","Kamukuywa","Men","Confirmed"],["Mukhuyu FC","Kamukuywa","Men","Confirmed"],["Chesamis Leeds","Kamukuywa","Men","Confirmed"],["Chesamis Allstars","Kamukuywa","Men","Confirmed"],["Musembe FC","Kamukuywa","Men","Confirmed"],["Chesamis FC","Kamukuywa","Men","Confirmed"],["Young Boys","Kamukuywa","Men","Confirmed"],["Sulwe FC","Kamukuywa","Men","Confirmed"],["Dream FC","Kamukuywa","Men","Confirmed"],
  ["Motomoto FC","Maeni","Men","Confirmed"],["Shooting FC","Maeni","Men","Confirmed"],["Olympic FC","Maeni","Men","Confirmed"],["Riverside FC","Maeni","Men","Confirmed"],["Kamd Utd","Maeni","Men","Confirmed"],["Mutekesi FC","Maeni","Men","Confirmed"],["Upendo","Maeni","Men","Confirmed"],["Muungano","Maeni","Men","Pending"],["Mutoto FC","Maeni","Men","Confirmed"],["Sharks FC","Maeni","Men","Confirmed"],["Buya FC","Maeni","Men","Confirmed"],["Sengeli FC","Maeni","Men","Confirmed"],["Green Bombers","Maeni","Men","Confirmed"],
  ["Matili City","Kimilili","Men","Confirmed"],["Bituyu","Kimilili","Men","Confirmed"],["Kambini FC","Kimilili","Men","Confirmed"],["Bahai 04","Kimilili","Men","Confirmed"],["Bahai Jr FC","Kimilili","Men","Confirmed"],["Matili Complex Stars","Kimilili","Men","Confirmed"],["Kimilili Warriors","Kimilili","Men","Confirmed"],["Sango FC","Kimilili","Men","Confirmed"],["Bahai FC","Kimilili","Men","Confirmed"],["Kimilili Allstars","Kimilili","Men","Confirmed"],["Kimilili Legends","Kimilili","Men","Confirmed"],["Allstars Youth","Kimilili","Men","Confirmed"],["Ng'oli FC","Kimilili","Men","Confirmed"],["Lwanda FC","Kimilili","Men","Confirmed"],["Youngstars","Kimilili","Men","Confirmed"],["Punda FC","Kimilili","Men","Confirmed"],["Matili Utd","Kimilili","Men","Confirmed"],["Simba FC","Kimilili","Men","Confirmed"],["Matili Youth","Kimilili","Men","Confirmed"],["Kimilili City","Kimilili","Men","Confirmed"],
  ["Khwiroro FC","Kibingei","Men","Confirmed"],["Naporora FC","Kibingei","Men","Confirmed"],["Lutonyi FC","Kibingei","Men","Confirmed"],["Namakhele FC","Kibingei","Men","Confirmed"],["Kamusinga FC","Kibingei","Men","Confirmed"],["Kibunde FC","Kibingei","Men","Confirmed"],["Sinoko FC","Kibingei","Men","Confirmed"],["Kibingei FC","Kibingei","Men","Confirmed"],["Amdavi","Kibingei","Men","Confirmed"],["Kitayi FC","Kibingei","Men","Confirmed"],["Miruri FC","Kibingei","Men","Confirmed"],["Kamusinga Utd","Kibingei","Men","Confirmed"],["Siuna FC","Kibingei","Men","Confirmed"],["Chebukwabi FC","Kibingei","Men","Confirmed"],["G7 Unit FC","Kibingei","Men","Confirmed"],["Westlands","Kibingei","Men","Confirmed"],["Nasianda FC","Kibingei","Men","Confirmed"],["The Beast","Kibingei","Men","Confirmed"],
  ["Rangera Starlets","Kamukuywa","Women","Confirmed"],["Sosio Utd Queens","Kamukuywa","Women","Confirmed"],["Lukhome Queens","Kamukuywa","Women","Confirmed"],["Y.Machines","Kamukuywa","Women","Pending"],["Impala Starlets","Kamukuywa","Women","Confirmed"],["Sibakala Queens","Kamukuywa","Women","Confirmed"],
  ["Mutoto Ladies","Maeni","Women","Confirmed"],["Maeni Starlets","Maeni","Women","Confirmed"],["Kamusinde Tigerlets","Maeni","Women","Pending"],
  ["Matili Starlets","Kimilili","Women","Confirmed"],["Kimilili Queens","Kimilili","Women","Confirmed"],["Lwanda Starlets","Kimilili","Women","Confirmed"],["Simba Queens","Kimilili","Women","Confirmed"],["Stabicha Queen","Kimilili","Women","Confirmed"],["Chelekei Queens","Kimilili","Women","Confirmed"],["Sango Queens","Kimilili","Women","Confirmed"],
  ["Kitayi Queens","Kibingei","Women","Confirmed"],["Miruri Queens","Kibingei","Women","Confirmed"],["Khwiroro","Kibingei","Women","Pending"],["Rising Queens","Kibingei","Women","Confirmed"],["Stingers Ladies","Kibingei","Women","Confirmed"],["GSU Ladies","Kibingei","Women","Confirmed"],["Namawanga Queens","Kibingei","Women","Confirmed"],
];
async function compressPassportPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file for the passport photo.");
  if (file.size > 10 * 1024 * 1024) throw new Error("The selected image is too large to process. Choose a photo under 10 MB.");
  const bitmap = await createImageBitmap(file);
  const maxWidth = 800, maxHeight = 1000;
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) { bitmap.close(); throw new Error("Photo processing is not supported by this browser."); }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const maxBytes = 900 * 1024;
  let blob: Blob | null = null;
  for (const quality of [0.88, 0.82, 0.76, 0.70, 0.64, 0.58, 0.52, 0.46]) {
    blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= maxBytes) break;
  }
  if (!blob || blob.size > maxBytes) throw new Error("Could not compress this photo below 1 MB. Please choose a smaller or clearer image.");
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read the compressed photo."));
    reader.onerror = () => reject(new Error("Could not read the compressed photo."));
    reader.readAsDataURL(blob!);
  });
}

function fmtDate(s:string){ const d=new Date(s+"T12:00:00"); return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"}); }
function initialsFor(name:string){ return name.split(" ").filter(Boolean).map(w=>w[0]).slice(0,2).join("").toUpperCase(); }
function goalsFor(rnd:()=>number){ const r=rnd(); if(r<.18) return 0; if(r<.48) return 1; if(r<.74) return 2; if(r<.90) return 3; return 4; }
function ageFromDob(dob:string){ if(!dob) return null; const d=new Date(dob+"T00:00:00"); const now=new Date(); let a=now.getFullYear()-d.getFullYear(); const m=now.getMonth()-d.getMonth(); if(m<0||(m===0&&now.getDate()<d.getDate())) a--; return a; }
type Pool = { label:string; teams: Team[] };
function formatFor(div:string, ward:string, teams: Team[]){
  const n = teams.filter(t=>t.ward===ward && t.division===div && t.status==="Confirmed").length;
  if(div==="Men") return {label:"4 Pools", path:"Top 2 per pool → QF (8) → SF (4) → Final (2)", pools:4};
  if(n<8) return {label:"Round Robin", path:"Round Robin — Top 2 to Ward Final", pools:1};
  if(n<12) return {label:"2 Pools", path:"Top 2 per pool (4) → SF → Ward Final", pools:2};
  return {label:"4 Pools", path:"Top 2 per pool → QF (8) → SF (4) → Final (2)", pools:4};
}
function buildPoolsMap(teams: Team[]): Record<string, Pool[]> {
  const map: Record<string, Pool[]> = {};
  WARDS.forEach(ward=>{
    (["Men","Women"] as const).forEach(div=>{
      const list = teams.filter(t=>t.ward===ward && t.division===div && t.status==="Confirmed");
      let poolCount: number;
      if(div==="Men") poolCount = list.length===0?0:Math.max(4, Math.ceil(list.length/5));
      else if(list.length<8) poolCount = list.length===0?0:1;
      else if(list.length<12) poolCount = 2;
      else poolCount = Math.max(4, Math.ceil(list.length/5));
      if(poolCount===0){ map[`${div}-${ward}`]=[]; return; }
      const base = Math.floor(list.length/poolCount);
      const rem = list.length % poolCount;
      const sizes = Array.from({length: poolCount}, (_,i)=> base + (i<rem?1:0));
      const pools: Pool[] = [];
      let idx=0;
      sizes.forEach((sz,pi)=>{
        const slice = list.slice(idx, idx+sz);
        idx+=sz;
        pools.push({label: div==="Women" && poolCount===1 ? "RR" : String.fromCharCode(65+pi), teams: slice});
      });
      map[`${div}-${ward}`]=pools;
    });
  });
  return map;
}
function makeFixturesFromPools(poolsMap: Record<string, Pool[]>): Fixture[] {
  const fixtures: Fixture[] = []; let matchNo=1; const start = new Date(2026,11,1);
  WARDS.forEach(ward=>{
    (["Men","Women"] as const).forEach(div=>{
      const pools = poolsMap[`${div}-${ward}`]||[];
      pools.forEach(pool=>{
        const ids = pool.teams.map(t=>t.id);
        if(ids.length<2) return;
        const arr = [...ids];
        if(arr.length%2===1) arr.push(-1);
        const n = arr.length;
        const rounds = n-1;
        const working = [...arr];
        for(let round=0; round<rounds; round++){
          for(let i=0;i<n/2;i++){
            const h=working[i], a=working[n-1-i];
            if(h===-1||a===-1) continue;
            const d=new Date(start); d.setDate(d.getDate()+ round*7 + (i%3));
            const times=["10:00","12:30","15:00","17:30"];
            fixtures.push({id:`${div[0]}-${ward}-${pool.label}-${round+1}-${h}-${a}`,week:round+1,group:pool.label,ward,stage:"Ward Pool",home:h,away:a,date:d.toISOString().slice(0,10),time:times[(round+i)%4],venue:VENUES[(round+i+ward.length)%VENUES.length],round:`Matchday ${round+1}`,division:div,matchNo:matchNo++});
          }
          const last=working.pop()!; working.splice(1,0,last);
        }
      });
    });
  });
  return fixtures.sort((a,b)=> a.date.localeCompare(b.date) || a.week-b.week || a.division.localeCompare(b.division));
}
function teamKeyOf(t:{division:string;ward:string;name:string}){ return `${t.division}|${t.ward}|${t.name}`; }
const emptyOfficial = (): Official => ({name:"",role:"Coach",phone:"",idNo:"",status:"Pending"});
type Tab = "home"|"wards"|"subcounty"|"teams"|"players"|"fixtures"|"matchday"|"livescore"|"matchsheet"|"standings"|"knockout"|"scorers"|"register"|"registered"|"admin";
type Division = "Men"|"Women"|"All";

export default function App(){
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAdmin(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setAdmin(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, []);
  const [tab,setTab]=useState<Tab>("home");
  const [division,setDivision]=useState<Division>("Men");
  const [admin,setAdmin]=useState(false);
  const [adminEmail,setAdminEmail]=useState("");
  const [adminPassword,setAdminPassword]=useState("");
  const [pinError,setPinError]=useState("");
  const [search,setSearch]=useState("");
  const [groupFilter,setGroupFilter]=useState("All");
  const [regionFilter,setRegionFilter]=useState("All");
  const [wardFilter,setWardFilter]=useState("All");
  const [poolFilter,setPoolFilter]=useState("All");
  const [stageFilter,setStageFilter]=useState("All");
  const [weekFilter,setWeekFilter]=useState("All");
  const [fixtureGroup,setFixtureGroup]=useState("All");
  const [venueFilter,setVenueFilter]=useState("All");
  const [dateFilter,setDateFilter]=useState("");
  const [wardTab,setWardTab]=useState("All");
  const [scorerWard,setScorerWard]=useState("All");
  const [scorerStage,setScorerStage]=useState("All");
  const [statusFilter,setStatusFilter]=useState<"All"|TeamStatus>("All");
  const [selectedTeam,setSelectedTeam]=useState<Team|null>(null);
  const [registrations,setRegistrations]=useState<any[]>([]);
  const [players,setPlayers]=useState<any[]>([]);
  const [lineupRecords,setLineupRecords]=useState<any[]>([]);
  const [knockoutRecords,setKnockoutRecords]=useState<any[]>([]);
  const [teamConfirmations,setTeamConfirmations]=useState<any[]>([]);
  const [results,setResults]=useState<ResultsMap>({});
  const [resultRecords,setResultRecords]=useState<any[]>([]);
  const [loadError,setLoadError]=useState("");
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const [simulateResult,setSimulateResult]=useState<any>(null);
  const [editScores,setEditScores]=useState<Record<string,{hg:string;ag:string}>>({});
  const [form,setForm]=useState({division:"Men",teamName:"",coach:"",phone:"",county:"Bungoma County",ward:"Kibingei",groupPref:"A",color:"#E63946",awayColor:"",homeGround:"",notes:"",feePaid:"No",receiptNo:""});
  const [awardsRecords,setAwardsRecords]=useState<any[]>([]);
  const [feeRecords,setFeeRecords]=useState<any[]>([]);
  const [awardDraft,setAwardDraft]=useState({bestPlayer:"",bestCoach:"",topScorer:""});
  const [feeDraft,setFeeDraft]=useState<Record<string,{paid:string;receipt:string}>>({});
  const [formError,setFormError]=useState("");
  const [formSuccess,setFormSuccess]=useState("");
  const [now,setNow]=useState(new Date());
  const [playerSearch,setPlayerSearch]=useState("");
  const [playerTeam,setPlayerTeam]=useState("All");
  const [playerPos,setPlayerPos]=useState("All");
  const [playerForm,setPlayerForm]=useState({name:"",dob:"",division:"Men",teamId:"",position:"MF",jersey:"",idNo:"",residence:"",phone:"",passportStatus:"Not Submitted",passportRef:""});
  const [profilePassport,setProfilePassport]=useState({status:"Not Submitted",ref:""});
  const [playerError,setPlayerError]=useState("");
  const [playerSuccess,setPlayerSuccess]=useState("");
  const [editingPlayer,setEditingPlayer]=useState<any|null>(null);
  const [selectedPlayer,setSelectedPlayer]=useState<any|null>(null);
  const [lineupFixture,setLineupFixture]=useState<Fixture|null>(null);
  const [lineupSide,setLineupSide]=useState<"home"|"away">("home");
  const [lineupStarters,setLineupStarters]=useState<string[]>([]);
  const [lineupBench,setLineupBench]=useState<string[]>([]);
  const [lineupCaptain,setLineupCaptain]=useState("");
  const [lineupFormation,setLineupFormation]=useState("4-4-2");
  const [lineupError,setLineupError]=useState("");
  const [matchsheetFixture,setMatchsheetFixture]=useState<Fixture|null>(null);
  const [resultFixture,setResultFixture]=useState<Fixture|null>(null);
  const [resultScore,setResultScore]=useState({hg:"",ag:""});
  const [resultScorers,setResultScorers]=useState<any[]>([]);
  const [resultCards,setResultCards]=useState<any[]>([]);
  const [resultError,setResultError]=useState("");
  const [resultMvp,setResultMvp]=useState("");
  const [resultMvpReason,setResultMvpReason]=useState("");
  const [knockoutScores,setKnockoutScores]=useState<Record<string,{hg:string;ag:string}>>({});
  const [lastUpdated,setLastUpdated]=useState("");
  const [liveRecords,setLiveRecords]=useState<any[]>([]);
  const [matchsheetFixtureId,setMatchsheetFixtureId]=useState("");
  const [liveMinuteDraft,setLiveMinuteDraft]=useState<Record<string,string>>({});
  const [endingLiveId,setEndingLiveId]=useState<string|null>(null);
  const [endLiveScore,setEndLiveScore]=useState({hg:"",ag:""});
  const [fixtureStatusFilter,setFixtureStatusFilter]=useState("All");
  // New: officials, views, extras, deletions, player confirmations, admin search
  const [officialsRecords,setOfficialsRecords]=useState<any[]>([]);
  const [viewRecords,setViewRecords]=useState<any[]>([]);
  const [extrasRecords,setExtrasRecords]=useState<any[]>([]);
  const [deletedTeams,setDeletedTeams]=useState<any[]>([]);
  const [playerConfirmRecords,setPlayerConfirmRecords]=useState<any[]>([]);
  const [officialsDraft,setOfficialsDraft]=useState<Official[]>([emptyOfficial(),emptyOfficial(),emptyOfficial()]);
  const [officialsEdit,setOfficialsEdit]=useState<Official[]>([emptyOfficial(),emptyOfficial(),emptyOfficial()]);
  const [officialsEditError,setOfficialsEditError]=useState("");
  const [officialsEditSuccess,setOfficialsEditSuccess]=useState("");
  const [adminSearchTeam,setAdminSearchTeam]=useState("");
  const [adminSearchPlayer,setAdminSearchPlayer]=useState("");
  const [deleteConfirmTeam,setDeleteConfirmTeam]=useState<number|null>(null);
  const [deleteConfirmChecked,setDeleteConfirmChecked]=useState<Record<number,boolean>>({});
  const [deleteReason,setDeleteReason]=useState<Record<number,string>>({});
  const [deleteConfirmPlayer,setDeleteConfirmPlayer]=useState<string|null>(null);
  const [deletePlayerChecked,setDeletePlayerChecked]=useState<Record<string,boolean>>({});
  const [liveGoalDraft,setLiveGoalDraft]=useState<Record<string,{playerId:string;minute:string}>>({});
  const [liveCardDraft,setLiveCardDraft]=useState<Record<string,{playerId:string;type:string;minute:string}>>({});
  const [liveMvpDraft,setLiveMvpDraft]=useState<Record<string,string>>({});
  const [matchEventForm,setMatchEventForm]=useState({type:"Goal",teamId:"",playerId:"",minute:"45",cardType:"Yellow",offPlayerId:"",onPlayerId:""});
  const [mvpForm,setMvpForm]=useState({playerId:"",reason:""});
  const [minutesForm,setMinutesForm]=useState({htHg:"",htAg:"",penHg:"",penAg:"",extraTime:""});
  const [viewedKeys,setViewedKeys]=useState<Record<string,boolean>>({});
  const [adminTeamForm,setAdminTeamForm]=useState({teamName:"",ward:"Kibingei",division:"Men",color:"#E63946",awayColor:"",homeGround:"",status:"Confirmed" as TeamStatus,feePaid:"No",receiptNo:""});
  const [adminTeamOfficials,setAdminTeamOfficials]=useState<Official[]>([emptyOfficial(),emptyOfficial(),emptyOfficial()]);
  const [adminTeamError,setAdminTeamError]=useState("");
  const [adminTeamSuccess,setAdminTeamSuccess]=useState("");

  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); },[]);

  const reloadRecords = async()=>{
    const [regs,resRows,playRows,lineRows,koRows,confRows,liveRows,offRows,viewRows,extraRows,delRows,pconfRows,awardRows,feeRows] = await Promise.all([
      api("records.list",{collection:"registrations"}),
      api("records.list",{collection:"tournament_results"}),
      api("records.list",{collection:"players"}),
      api("records.list",{collection:"match_lineups"}),
      api("records.list",{collection:"knockout_results"}),
      api("records.list",{collection:"team_confirmations"}),
      api("records.list",{collection:"live_matches"}).catch(()=>({records:[]}) as any),
      api("records.list",{collection:"team_officials"}).catch(()=>({records:[]}) as any),
      api("records.list",{collection:"view_counts"}).catch(()=>({records:[]}) as any),
      api("records.list",{collection:"match_extras"}).catch(()=>({records:[]}) as any),
      api("records.list",{collection:"deleted_teams"}).catch(()=>({records:[]}) as any),
      api("records.list",{collection:"player_confirmations"}).catch(()=>({records:[]}) as any),
      api("records.list",{collection:"individual_awards"}).catch(()=>({records:[]}) as any),
      api("records.list",{collection:"registration_fees"}).catch(()=>({records:[]}) as any),
    ]);
    setRegistrations(regs.records||[]);
    setResultRecords(resRows.records||[]);
    setPlayers(playRows.records||[]);
    setLineupRecords(lineRows.records||[]);
    setKnockoutRecords(koRows.records||[]);
    setTeamConfirmations(confRows.records||[]);
    setLiveRecords(liveRows.records||[]);
    setOfficialsRecords(offRows.records||[]);
    setViewRecords(viewRows.records||[]);
    setExtrasRecords(extraRows.records||[]);
    setDeletedTeams(delRows.records||[]);
    setPlayerConfirmRecords(pconfRows.records||[]);
    setAwardsRecords(awardRows.records||[]);
    setFeeRecords(feeRows.records||[]);
    const map:ResultsMap={};
    (resRows.records||[]).forEach((r:any)=>{ Object.entries(r.value?.results||{}).forEach(([k,v]:any)=>{ map[k]=v; }); });
    setResults(map);
    const ups = (resRows.records||[]).map((r:any)=>r.updated_at).filter(Boolean).sort();
    if(ups.length) setLastUpdated(new Date(ups[ups.length-1]).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}));
  };
  useEffect(()=>{ reloadRecords().catch(()=>setLoadError("Saved tournament data could not be loaded yet. The registered teams below still work.")); },[]);

  const viewMap = useMemo(()=>{ const m:Record<string,number>={}; viewRecords.forEach((r:any)=>{ if(r.value?.key) m[r.value.key]=Number(r.value.count||0); }); return m; },[viewRecords]);
  const totalViews = useMemo(()=> Object.values(viewMap).reduce((s,v)=>s+v,0),[viewMap]);
  const getViews = (key:string)=> viewMap[key]||0;
  const trackView = useCallback(async (key:string, label:string)=>{
    setViewedKeys(prev=>{ if(prev[key]) return prev; return {...prev,[key]:true}; });
    // increment locally + persist; avoid double-count within same session for page views handled by caller guard
    const current = viewRecords.find((r:any)=>r.value?.key===key);
    const nextCount = (current?.value?.count||0)+1;
    if(current){
      setViewRecords(prev=>prev.map(r=> r.id===current.id ? {...r, value:{...r.value,count:nextCount}} : r));
      try{ await api("records.replace",{collection:"view_counts",id:current.id,value:{key,label,count:nextCount}}); }catch{}
    } else {
      try{ const created = await api("records.create",{collection:"view_counts",value:{key,label,count:1},idempotency_key:`view-${key}`}); setViewRecords(prev=>[...prev,created]); }catch{ setViewRecords(prev=>{ if(prev.some(r=>r.value?.key===key)) return prev; return [...prev,{id:`local-${key}`,value:{key,label,count:1}}]; }); }
    }
  },[viewRecords]);
  // Track page views once per tab change
  const lastTrackedTab = React.useRef("");
  useEffect(()=>{
    if(lastTrackedTab.current!==tab){
      lastTrackedTab.current=tab;
      const label = `${tab} page`;
      const current = viewRecords.find((r:any)=>r.value?.key===`page-${tab}`);
      const nextCount = (current?.value?.count||0)+1;
      if(current){ setViewRecords(prev=>prev.map(r=> r.id===current.id ? {...r,value:{...r.value,count:nextCount}} : r)); api("records.replace",{collection:"view_counts",id:current.id,value:{key:`page-${tab}`,label,count:nextCount}}).catch(()=>{}); }
      else { api("records.create",{collection:"view_counts",value:{key:`page-${tab}`,label,count:1},idempotency_key:`view-page-${tab}`}).then((c:any)=>setViewRecords(prev=>prev.some(r=>r.value?.key===`page-${tab}`)?prev:[...prev,c])).catch(()=>{}); }
    }
  },[tab]);

  const confirmationMap = useMemo(()=>{ const m:Record<string,string>={}; teamConfirmations.forEach((r:any)=>{ if(r.value?.teamKey) m[r.value.teamKey]=r.value.status||"Confirmed"; }); return m; },[teamConfirmations]);
  const deletedKeys = useMemo(()=> new Set(deletedTeams.map((r:any)=>r.value?.teamKey).filter(Boolean)),[deletedTeams]);
  const officialsMap = useMemo(()=>{ const m:Record<string,Official[]>={}; officialsRecords.forEach((r:any)=>{ if(r.value?.teamKey) m[r.value.teamKey]=(r.value.officials||[]).filter((o:Official)=>o.name?.trim()); }); return m; },[officialsRecords]);
  const extrasMap = useMemo(()=>{ const m:Record<string,any>={}; extrasRecords.forEach((r:any)=>{ if(r.value?.fixtureId) m[r.value.fixtureId]={...r.value,recordId:r.id}; }); return m; },[extrasRecords]);
  const playerConfirmMap = useMemo(()=>{ const m:Record<string,string>={}; playerConfirmRecords.forEach((r:any)=>{ if(r.value?.playerId) m[String(r.value.playerId)]=r.value.status||"Confirmed"; }); return m; },[playerConfirmRecords]);
  const awardsMap = useMemo(()=>{ const m:Record<string,any>={}; awardsRecords.forEach((r:any)=>{ if(r.value?.category) m[r.value.category]={...r.value,recordId:r.id}; }); return m; },[awardsRecords]);
  const feeMap = useMemo(()=>{ const m:Record<string,any>={}; feeRecords.forEach((r:any)=>{ if(r.value?.teamKey) m[r.value.teamKey]={...r.value,recordId:r.id}; }); registrations.forEach((r:any)=>{ const k=`${r.value?.division||"Men"}|${r.value?.ward||""}|${r.value?.teamName||""}`; if(!m[k] && (r.value?.feePaid||r.value?.receiptNo)) m[k]={teamKey:k,teamName:r.value?.teamName,paid:r.value?.feePaid,receiptNo:r.value?.receiptNo}; }); return m; },[feeRecords,registrations]);
  function feeForTeam(team:any){ return feeMap[teamKeyOf(team)] || null; }
  async function saveAward(category:string, winnerName:string, winnerDetail:string){
    if(!admin){ setNotice("Only Admin can select Individual Award winners. Open Admin tab and enter PIN 1234."); return; }
    if(!winnerName){ setNotice("Pick a winner first."); return; }
    setBusy(true);
    try{ const existing = awardsRecords.find((r:any)=>r.value?.category===category); const value={category,winnerName,winnerDetail,prize:"3-day trip to Mombasa, including return air tickets"}; if(existing) await api("records.replace",{collection:"individual_awards",id:existing.id,value}); else await api("records.create",{collection:"individual_awards",value,idempotency_key:`award-${category.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}); await reloadRecords(); setNotice(`${category} winner saved: ${winnerName}.`); }catch{ setNotice("Award winner could not be saved."); } setBusy(false);
  }
  async function saveFeeForTeam(team:any, paid:string, receipt:string){
    if(!admin) return; setBusy(true);
    try{ const key=teamKeyOf(team); const existing = feeRecords.find((r:any)=>r.value?.teamKey===key); const value={teamKey:key,teamName:team.name,ward:team.ward,division:team.division,paid,receiptNo:receipt.trim()}; if(existing) await api("records.replace",{collection:"registration_fees",id:existing.id,value}); else await api("records.create",{collection:"registration_fees",value,idempotency_key:`fee-${key.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}); await reloadRecords(); setNotice(`Registration fee updated for ${team.name}: ${paid}${receipt?` • Receipt ${receipt}`:""}.`); }catch{ setNotice("Registration fee could not be saved."); } setBusy(false);
  }

  const baseRealTeams = useMemo(()=>{
    const counters: Record<string,number> = {Men:0, Women:0};
    return REAL_TEAMS_RAW.map(([name,ward,div,origStatus], idx)=>{
      const colorList = div==="Men"?COLORS:WOMEN_COLORS;
      const color = colorList[counters[div]%colorList.length]; counters[div]++;
      const key = `${div}|${ward}|${name}`;
      const effective = origStatus==="Pending" && confirmationMap[key]==="Confirmed" ? "Confirmed" : origStatus;
      return {id: idx+1, name, coach:"—", county:"Bungoma County", group:"", color, initials: initialsFor(name), region: ward, division: div, ward, awayColor:"", homeGround:"", status: effective as TeamStatus, sourceOrder: idx};
    }).filter(t=>!deletedKeys.has(teamKeyOf(t)));
  },[confirmationMap, deletedKeys]);

  const combinedBase = useMemo(()=>{
    const regs = registrations.map((r:any,idx:number)=>{
      const ward = WARDS.includes(r.value?.ward) ? r.value.ward : (WARDS.includes(r.value?.county) ? r.value.county : "Kimilili");
      const div = r.value?.division||"Men";
      const key = `${div}|${ward}|${r.value?.teamName||"Registered Team"}`;
      const savedStatus = (r.value?.status==="Pending"||r.value?.status==="Confirmed") ? r.value.status : "Confirmed";
      const effectiveStatus = savedStatus==="Pending" && confirmationMap[key]==="Confirmed" ? "Confirmed" : savedStatus;
      return {id:1000+idx, name:r.value?.teamName||"Registered Team", coach:r.value?.coach||"—", county:r.value?.county||"Bungoma County", ward, group:"", color:r.value?.color||"#E63946", awayColor:r.value?.awayColor||"", homeGround:r.value?.homeGround||"", initials:(r.value?.teamName||"RT").split(" ").map((w:string)=>w[0]).slice(0,2).join(""), region:ward, division:div, status:effectiveStatus as TeamStatus, sourceOrder:1000+idx, _regId:r.id, _key:key};
    }).filter((t:any)=>!deletedKeys.has(t._key));
    return [...baseRealTeams, ...regs];
  },[baseRealTeams, registrations, deletedKeys, confirmationMap]);

  const poolsMap = useMemo(()=> buildPoolsMap(combinedBase),[combinedBase]);
  const allTeams = useMemo(()=>{
    const lookup = new Map<number,string>();
    Object.values(poolsMap).flat().forEach(pool=> pool.teams.forEach(t=> lookup.set(t.id, pool.label)));
    return combinedBase.map(t=> ({...t, group: lookup.get(t.id) || ""}));
  },[combinedBase, poolsMap]);
  const fixtures = useMemo(()=> makeFixturesFromPools(poolsMap),[poolsMap]);
  const teamById = useMemo(()=> new Map(allTeams.map(t=>[t.id,t])),[allTeams]);
  const getTeam = (id:number)=> allTeams.find(t=>t.id===id) || teamById.get(id);

  const menCount = allTeams.filter(t=>t.division==="Men").length;
  const womenCount = allTeams.filter(t=>t.division==="Women").length;
  const totalRegistered = allTeams.length;
  const confirmedCount = allTeams.filter(t=>t.status==="Confirmed").length;
  const pendingCount = allTeams.filter(t=>t.status==="Pending").length;
  const pendingTeams = allTeams.filter(t=>t.status==="Pending");
  const countFor = (ward:string, div:string)=> allTeams.filter(t=>t.ward===ward && t.division===div).length;
  const capFor = (div:string)=> div==="Men"?20:15;
  const slotsFor = (ward:string, div:string)=> Math.max(0, capFor(div)-countFor(ward,div));
  const wardTotalFor = (ward:string)=> allTeams.filter(t=>t.ward===ward).length;

  const registeredPlayersByTeam = useMemo(()=>{ const m:Record<number,any[]>={}; players.forEach((p:any)=>{ const tid=Number(p.value?.teamId); if(!m[tid]) m[tid]=[]; m[tid].push({...p.value,id:p.id,recordId:p.id}); }); Object.values(m).forEach(arr=>arr.sort((a,b)=> (a.jersey||0)-(b.jersey||0))); return m; },[players]);
  function effectiveRoster(teamId:number){
    const team=getTeam(teamId); if(!team) return [];
    const reg=(registeredPlayersByTeam[teamId]||[]).map((p:any)=>({id:String(p.recordId||p.id),no:Number(p.jersey)||0,pos:p.position,name:p.name,age:ageFromDob(p.dob)||18,teamId,division:team.division,gender:p.gender,virtual:false}));
    return reg;
  }
  function getOfficials(team:Team|undefined|null): Official[]{ if(!team) return []; return officialsMap[teamKeyOf(team)]||[]; }
  function getCoachName(team:Team|undefined|null): string{
    if(!team) return "—";
    const offs=getOfficials(team);
    const coach=offs.find(o=>o.role==="Coach" && o.name?.trim());
    if(coach) return coach.name;
    return team.coach && team.coach!=="—" ? team.coach : "—";
  }
  function registrationStatus(team:Team): string{
    const offs=getOfficials(team);
    const pCount=(registeredPlayersByTeam[team.id]||[]).length;
    if(offs.length===0) return "Incomplete - Officials Not Registered";
    if(pCount<11) return "Incomplete - Missing Players";
    return "Complete (Team + 1+ Official + 11+ Players)";
  }
  function isComplete(team:Team){ return registrationStatus(team).startsWith("Complete"); }

  const standingsByPool = useMemo(()=>{
    const out:Record<string,Record<string,Record<string,any[]>>>={};
    (["Men","Women"] as const).forEach(div=>{
      out[div]={};
      WARDS.forEach(ward=>{
        out[div][ward]={};
        const pools = poolsMap[`${div}-${ward}`]||[];
        pools.forEach(pool=>{
          out[div][ward][pool.label]=pool.teams.map(t=>({team:t,pl:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}));
        });
      });
    });
    fixtures.forEach(f=>{
      const r=results[f.id]; if(!r||r.status!=="FT") return;
      const arr = out[f.division]?.[f.ward]?.[f.group]; if(!arr) return;
      const hg=arr.find(x=>x.team.id===f.home); const ag=arr.find(x=>x.team.id===f.away); if(!hg||!ag) return;
      hg.pl++; ag.pl++; hg.gf+=r.hg; hg.ga+=r.ag; ag.gf+=r.ag; ag.ga+=r.hg;
      if(r.hg>r.ag){hg.w++;hg.pts+=3;ag.l++} else if(r.hg<r.ag){ag.w++;ag.pts+=3;hg.l++} else {hg.d++;ag.d++;hg.pts++;ag.pts++}
    });
    Object.values(out).forEach(byWard=> Object.values(byWard).forEach(byPool=> Object.values(byPool).forEach(arr=>{
      arr.sort((a,b)=>{
        if(b.pts!==a.pts) return b.pts-a.pts;
        const gdA=a.gf-a.ga, gdB=b.gf-b.ga; if(gdB!==gdA) return gdB-gdA;
        if(b.gf!==a.gf) return b.gf-a.gf;
        return a.team.name.localeCompare(b.team.name);
      });
    })));
    return out;
  },[results, fixtures, poolsMap]);

  const knockoutMap = useMemo(()=>{ const m:Record<string,any>={}; knockoutRecords.forEach((r:any)=>{ Object.entries(r.value?.results||{}).forEach(([k,v]:any)=>{ m[k]=v; }); }); return m; },[knockoutRecords]);
  function wardBracket(ward:string, div:string){
    const pools = poolsMap[`${div}-${ward}`]||[];
    const tops = pools.map(pool=>{
      const arr = standingsByPool[div]?.[ward]?.[pool.label]||[];
      return {pool: pool.label, winner:arr[0]||null, runner:arr[1]||null};
    });
    const rank=(rows:any[])=>[...rows].sort((a,b)=> b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf || a.team.name.localeCompare(b.team.name));
    const winnersRanked = rank(tops.map(t=>t.winner).filter(Boolean));
    const runnersRanked = rank(tops.map(t=>t.runner).filter(Boolean));
    const winnerOf=(match:any)=>{ if(!match) return null; const r=knockoutMap[match.id]; if(!r||r.status!=="FT") return null; if(r.hg===r.ag) return match.home; return r.hg>r.ag?match.home:match.away; };
    const loserOf=(match:any)=>{ if(!match) return null; const r=knockoutMap[match.id]; if(!r||r.status!=="FT") return null; if(r.hg===r.ag) return match.away; return r.hg>r.ag?match.away:match.home; };
    const mk=(id:string,label:string,home:any,away:any,hs:string,as:string)=>({id,round:id.includes("QF")?"Ward QF":id.includes("SF")?"Ward SF":id.includes("W3")?"3rd Place":"Ward Final",label,home,away,homeSource:hs,awaySource:as,date:id.includes("QF")?"10 Jan 2027":id.includes("SF")?"13 Jan 2027":id.includes("W3")?"17 Jan 2027":"17 Jan 2027",venue:VENUES[WARDS.indexOf(ward)%VENUES.length],time:"15:00"});
    let qf:any[]=[]; let sf:any[]=[]; let final:any[]=[]; let third:any[]=[];
    if(pools.length===4){
      qf=[ mk(`${div}-${ward}-WQF-1`,"Ward QF 1",tops[0].winner?.team||null,tops[1].runner?.team||null,"Winner Pool A","Runner-up Pool B"), mk(`${div}-${ward}-WQF-2`,"Ward QF 2",tops[1].winner?.team||null,tops[0].runner?.team||null,"Winner Pool B","Runner-up Pool A"), mk(`${div}-${ward}-WQF-3`,"Ward QF 3",tops[2].winner?.team||null,tops[3].runner?.team||null,"Winner Pool C","Runner-up Pool D"), mk(`${div}-${ward}-WQF-4`,"Ward QF 4",tops[3].winner?.team||null,tops[2].runner?.team||null,"Winner Pool D","Runner-up Pool C") ];
      const qfW=qf.map(winnerOf); sf=[ mk(`${div}-${ward}-WSF-1`,"Ward SF 1",qfW[0],qfW[1],"Winner QF 1","Winner QF 2"), mk(`${div}-${ward}-WSF-2`,"Ward SF 2",qfW[2],qfW[3],"Winner QF 3","Winner QF 4") ];
      const sfW=sf.map(winnerOf); const sfL=sf.map(loserOf); final=[mk(`${div}-${ward}-WF-1`,"Ward Final",sfW[0],sfW[1],"Winner SF 1","Winner SF 2")]; if(div==="Men") third=[mk(`${div}-${ward}-W3-1`,"3rd-Place Playoff",sfL[0],sfL[1],"Loser SF 1","Loser SF 2")];
    } else if(pools.length===3){
      const w1=winnersRanked[0]?.team||null, w2=winnersRanked[1]?.team||null, w3=winnersRanked[2]?.team||null; const r1=runnersRanked[0]?.team||null, r2=runnersRanked[1]?.team||null, r3=runnersRanked[2]?.team||null;
      qf=[ mk(`${div}-${ward}-WQF-1`,"Ward QF / Playoff 1",w3,r3,"3rd Pool Winner","3rd Runner-up"), mk(`${div}-${ward}-WQF-2`,"Ward QF / Playoff 2",r1,r2,"Best Runner-up","2nd Runner-up") ];
      const qfW=qf.map(winnerOf); sf=[ mk(`${div}-${ward}-WSF-1`,"Ward SF 1",w1,qfW[0],"Top Pool Winner","Winner Playoff 1"), mk(`${div}-${ward}-WSF-2`,"Ward SF 2",w2,qfW[1],"2nd Pool Winner","Winner Playoff 2") ];
      const sfW=sf.map(winnerOf); const sfL=sf.map(loserOf); final=[mk(`${div}-${ward}-WF-1`,"Ward Final",sfW[0],sfW[1],"Winner SF 1","Winner SF 2")]; if(div==="Men") third=[mk(`${div}-${ward}-W3-1`,"3rd-Place Playoff",sfL[0],sfL[1],"Loser SF 1","Loser SF 2")];
    } else if(pools.length===2){
      const w1=winnersRanked[0]?.team||null, w2=winnersRanked[1]?.team||null; const r1=runnersRanked[0]?.team||null, r2=runnersRanked[1]?.team||null;
      sf=[ mk(`${div}-${ward}-WSF-1`,"Ward SF 1",w1,r2,"Top Pool Winner","2nd Runner-up"), mk(`${div}-${ward}-WSF-2`,"Ward SF 2",w2,r1,"2nd Pool Winner","Best Runner-up") ];
      const sfW=sf.map(winnerOf); const sfL=sf.map(loserOf); final=[mk(`${div}-${ward}-WF-1`,"Ward Final",sfW[0],sfW[1],"Winner SF 1","Winner SF 2")]; if(div==="Men") third=[mk(`${div}-${ward}-W3-1`,"3rd-Place Playoff",sfL[0],sfL[1],"Loser SF 1","Loser SF 2")];
    } else if(pools.length===1){
      const w=tops[0]?.winner?.team||null, r=tops[0]?.runner?.team||null; final=[mk(`${div}-${ward}-WF-1`,"Ward Final",w,r,"Pool Winner","Pool Runner-up")];
    }
    const finalResult = final[0]?knockoutMap[final[0].id]:null;
    const champion = finalResult&&finalResult.status==="FT"?(finalResult.hg>=finalResult.ag?final[0].home:final[0].away):null;
    const runnerUp = finalResult&&finalResult.status==="FT"?(finalResult.hg>=finalResult.ag?final[0].away:final[0].home):null;
    const thirdResult = third[0]?knockoutMap[third[0].id]:null;
    const thirdPlace = thirdResult&&thirdResult.status==="FT"?(thirdResult.hg>=thirdResult.ag?third[0].home:third[0].away):null;
    return {tops,qf,sf,final,third,champion,runnerUp,thirdPlace,complete:!!(finalResult&&finalResult.status==="FT"),finalResult};
  }
  function qualifiedForDivision(div:string){
    return WARDS.map(ward=>{
      const b=wardBracket(ward,div);
      const thirdDone = div==="Men" ? !!(b.third[0]&&knockoutMap[b.third[0].id]?.status==="FT") : true;
      return {ward,champion:b.champion,runnerUp:b.runnerUp,thirdPlace:b.thirdPlace,completeFinal:b.complete,thirdDone,complete: b.complete && thirdDone};
    });
  }
  function subcountyBracket(div:string){
    const quals = qualifiedForDivision(div);
    const finalsDone = quals.filter(q=>q.completeFinal).length;
    const allFinalsDone = finalsDone===4;
    const ordered: any[] = [];
    quals.forEach(q=>{ if(q.champion) ordered.push({team:q.champion,ward:q.ward,rank:"Ward Champion",seed:ordered.length+1}); });
    quals.forEach(q=>{ if(q.runnerUp) ordered.push({team:q.runnerUp,ward:q.ward,rank:"Ward Runner-up",seed:ordered.length+1}); });
    if(div==="Men") quals.forEach(q=>{ if(q.thirdPlace) ordered.push({team:q.thirdPlace,ward:q.ward,rank:"3rd Place",seed:ordered.length+1}); });
    const bySeed=(n:number)=> ordered.find(o=>o.seed===n)?.team||null;
    const winnerOf=(match:any)=>{ if(!match) return null; const r=knockoutMap[match.id]; if(!r||r.status!=="FT") return null; if(r.hg===r.ag) return match.home; return r.hg>r.ag?match.home:match.away; };
    const mk=(id:string,label:string,home:any,away:any,hs:string,as:string,date:string)=>({id,round:label,label,home,away,homeSource:hs,awaySource:as,date,venue:"Kimilili Stadium",time:"15:00"});
    let po:any[]=[]; let qf:any[]=[]; let sf:any[]=[]; let final:any[]=[];
    if(div==="Men"){
      po=[ mk(`${div}-SC-PO-1`,"Sub-County Playoff 1",bySeed(5),bySeed(12),"Seed 5 (Runner-up)","Seed 12 (3rd)","20 Jan 2027"), mk(`${div}-SC-PO-2`,"Sub-County Playoff 2",bySeed(6),bySeed(11),"Seed 6 (Runner-up)","Seed 11 (3rd)","20 Jan 2027"), mk(`${div}-SC-PO-3`,"Sub-County Playoff 3",bySeed(7),bySeed(10),"Seed 7 (Runner-up)","Seed 10 (3rd)","20 Jan 2027"), mk(`${div}-SC-PO-4`,"Sub-County Playoff 4",bySeed(8),bySeed(9),"Seed 8 (Runner-up)","Seed 9 (3rd)","20 Jan 2027") ];
      const poW=po.map(winnerOf);
      qf=[ mk(`${div}-SC-QF-1`,"Sub-County QF 1",bySeed(1),poW[0],"Seed 1 (Champion)","Winner Playoff 1","21 Jan 2027"), mk(`${div}-SC-QF-2`,"Sub-County QF 2",bySeed(2),poW[1],"Seed 2 (Champion)","Winner Playoff 2","21 Jan 2027"), mk(`${div}-SC-QF-3`,"Sub-County QF 3",bySeed(3),poW[2],"Seed 3 (Champion)","Winner Playoff 3","21 Jan 2027"), mk(`${div}-SC-QF-4`,"Sub-County QF 4",bySeed(4),poW[3],"Seed 4 (Champion)","Winner Playoff 4","21 Jan 2027") ];
    } else {
      qf=[ mk(`${div}-SC-QF-1`,"Sub-County QF 1",bySeed(1),bySeed(8),"Seed 1 (Champion)","Seed 8 (Runner-up)","20 Jan 2027"), mk(`${div}-SC-QF-2`,"Sub-County QF 2",bySeed(2),bySeed(7),"Seed 2 (Champion)","Seed 7 (Runner-up)","20 Jan 2027"), mk(`${div}-SC-QF-3`,"Sub-County QF 3",bySeed(3),bySeed(6),"Seed 3 (Champion)","Seed 6 (Runner-up)","20 Jan 2027"), mk(`${div}-SC-QF-4`,"Sub-County QF 4",bySeed(4),bySeed(5),"Seed 4 (Champion)","Seed 5 (Runner-up)","20 Jan 2027") ];
    }
    const qfW=qf.map(winnerOf);
    sf=[ mk(`${div}-SC-SF-1`,"Sub-County SF 1",qfW[0],qfW[1],"Winner QF 1","Winner QF 2","22 Jan 2027"), mk(`${div}-SC-SF-2`,"Sub-County SF 2",qfW[2],qfW[3],"Winner QF 3","Winner QF 4","22 Jan 2027") ];
    const sfW=sf.map(winnerOf);
    final=[mk(`${div}-SC-F-1`,"Sub-County Final",sfW[0],sfW[1],"Winner SF 1","Winner SF 2","24 Jan 2027")];
    const finalResult = knockoutMap[final[0].id];
    const champion = finalResult&&finalResult.status==="FT"?(finalResult.hg>=finalResult.ag?final[0].home:final[0].away):null;
    return {quals,finalsDone,allFinalsDone,ordered,po,qf,sf,final,champion,seeds:ordered};
  }

  const playedCount = Object.values(results).filter((r:any)=>r.status==="FT").length;
  const totalGoals = Object.values(results).reduce((s:any,r:any)=>s+(r.status==="FT"?r.hg+r.ag:0),0);
  const groupTotal = (div:string)=> fixtures.filter(f=>f.division===div).length;
  const groupPlayed = (div:string)=> fixtures.filter(f=>f.division===div&&results[f.id]?.status==="FT").length;
  const wardPlayed = (ward:string)=> fixtures.filter(f=>f.ward===ward&&results[f.id]?.status==="FT").length;
  const wardTotal = (ward:string)=> fixtures.filter(f=>f.ward===ward).length;

  const scorers = useMemo(()=>{
    const map=new Map<string,any>();
    Object.entries(results).forEach(([fid,r]:any)=>{
      if(r.status!=="FT") return;
      const fx=fixtures.find(f=>f.id===fid); if(!fx) return;
      (r.scorers||[]).forEach((s:any)=>{
        const key=`${s.playerId||s.player}-${s.teamId||""}`;
        const cur=map.get(key)||{player:s.player,playerId:s.playerId,team:getTeam(Number(s.teamId))||teamById.get(Number(s.teamId)),pos:s.pos||"FW",goals:0,assists:0};
        cur.goals+=1; map.set(key,cur);
      });
    });
    return [...map.values()].sort((a,b)=>b.goals-a.goals || b.assists-a.assists).slice(0,30);
  },[results, fixtures]);

  const playerStats = useMemo(()=>{
    const m:Record<string,{goals:number;assists:number;cards:number;yellow:number;red:number;appearances:number;minutes:number}>={};
    const ensure=(k:string)=>{ if(!m[k]) m[k]={goals:0,assists:0,cards:0,yellow:0,red:0,appearances:0,minutes:0}; return m[k]; };
    const seen=new Set<string>();
    lineupRecords.forEach((lr:any)=>{ const fx=fixtures.find(f=>f.id===lr.value?.fixtureId); if(!fx) return; ["home","away"].forEach(side=>{ const s=lr.value?.[side]; if(!s) return; (s.starters||[]).forEach((id:any)=>{ const k=String(id); const e=ensure(k); const key=`${fx.id}-${k}`; if(!seen.has(key)){ seen.add(key); e.appearances+=1; e.minutes+=90; } }); (s.bench||[]).forEach((id:any)=>{ const k=String(id); const e=ensure(k); const key=`${fx.id}-${k}`; if(!seen.has(key)){ seen.add(key); e.appearances+=1; } }); }); });
    Object.entries(results).forEach(([fid,r]:any)=>{ if(r.status!=="FT") return; (r.scorers||[]).forEach((s:any)=>{ const k=String(s.playerId||s.player); const e=ensure(k); e.goals+=1; }); (r.cards||[]).forEach((c:any)=>{ const k=String(c.playerId||c.player); const e=ensure(k); e.cards+=1; if(c.type==="Red") e.red+=1; else e.yellow+=1; }); });
    return m;
  },[results,lineupRecords, fixtures]);
  const playerMatches = useMemo(()=>{
    const m:Record<string,any[]>={};
    Object.entries(results).forEach(([fid,r]:any)=>{ if(r.status!=="FT") return; const fx=fixtures.find(f=>f.id===fid); if(!fx) return; const ids=new Set<string>(); (r.scorers||[]).forEach((s:any)=>ids.add(String(s.playerId||s.player))); (r.cards||[]).forEach((c:any)=>ids.add(String(c.playerId||c.player))); ids.forEach(k=>{ if(!m[k]) m[k]=[]; const goals=(r.scorers||[]).filter((s:any)=>String(s.playerId||s.player)===k).length; m[k].push({fixture:fx,result:r,goals}); }); });
    Object.values(m).forEach(arr=>arr.sort((a,b)=>a.fixture.date.localeCompare(b.fixture.date)));
    return m;
  },[results, fixtures]);
  function passportDot(status:string){ if(status==="Received") return "bg-emerald-500"; if(status==="Pending") return "bg-amber-400"; return "bg-red-500"; }
  function openPlayerProfile(p:any){
    if(p?.value){ setSelectedPlayer(p); setProfilePassport({status:p.value?.passportStatus||"Not Submitted",ref:p.value?.passportRef||""}); trackView(`player-${p.id}`,`Player ${p.value?.name}`); return; }
    const team=getTeam(Number(p.teamId)); const record = players.find((x:any)=> String(x.value?.name)===String(p.name) && Number(x.value?.teamId)===Number(p.teamId));
    if(record){ setSelectedPlayer(record); setProfilePassport({status:record.value?.passportStatus||"Not Submitted",ref:record.value?.passportRef||""}); trackView(`player-${record.id}`,`Player ${record.value?.name}`); return; }
    const pseudo={id:String(p.id),value:{name:p.name,dob:p.dob||"",division:p.division||team?.division||"Men",gender:(p.division||team?.division)==="Women"?"Female":"Male",teamId:Number(p.teamId),position:p.pos,jersey:p.no,idNo:"",residence:"",phone:"",passportStatus:"Not Submitted",passportRef:""},virtual:true};
    setSelectedPlayer(pseudo); setProfilePassport({status:"Not Submitted",ref:""});
  }
  async function saveProfilePassport(){
    if(!selectedPlayer || selectedPlayer.virtual){ setNotice("This player is not registered yet — register the player to track a passport photo."); return; }
    if(!admin){ setNotice("Passport photo status can only be updated in Admin mode."); return; }
    setBusy(true);
    try{ const v={...(selectedPlayer.value||{}),passportStatus:profilePassport.status,passportRef:profilePassport.ref.trim()}; await api("records.replace",{collection:"players",id:selectedPlayer.id,value:v}); await reloadRecords(); setSelectedPlayer({...selectedPlayer,value:v}); setNotice(`Passport photo status updated to ${profilePassport.status} for ${v.name}.`); }catch(e){ setNotice("Passport photo status could not be saved. Try again."); }
    setBusy(false);
  }
  const lineupsByFixture = useMemo(()=>{ const m:Record<string,any>={}; lineupRecords.forEach((r:any)=>{ if(r.value?.fixtureId) m[r.value.fixtureId]=r.value; }); return m; },[lineupRecords]);
  const filteredTeams = useMemo(()=>{
    return allTeams.filter(t=> (division==="All"||t.division===division) && (groupFilter==="All"||t.group===groupFilter) && (regionFilter==="All"||t.county===regionFilter) && (wardFilter==="All"||t.ward===wardFilter) && (statusFilter==="All"||t.status===statusFilter) && (t.name.toLowerCase().includes(search.toLowerCase())||getCoachName(t).toLowerCase().includes(search.toLowerCase())))
      .sort((a,b)=> WARDS.indexOf(a.ward)-WARDS.indexOf(b.ward) || a.name.localeCompare(b.name));
  },[allTeams, division, groupFilter, regionFilter, wardFilter, statusFilter, search, officialsMap]);
  const filteredFixtures = fixtures.filter(f=> (division==="All"||f.division===division) && (weekFilter==="All"||String(f.week)===weekFilter) && (fixtureGroup==="All"||f.group===fixtureGroup) && (wardFilter==="All"||f.ward===wardFilter) && (poolFilter==="All"||f.group===poolFilter) && (venueFilter==="All"||f.venue===venueFilter) && (!dateFilter||f.date===dateFilter));
  const filteredPlayers = players.filter((p:any)=>{ const v=p.value||{}; const team=getTeam(Number(v.teamId)); const q=playerSearch.toLowerCase(); return (division==="All"||v.division===division) && (playerTeam==="All"||String(v.teamId)===playerTeam) && (playerPos==="All"||v.position===playerPos) && (wardFilter==="All"||team?.ward===wardFilter) && (!q || v.name?.toLowerCase().includes(q)||(team?.name||"").toLowerCase().includes(q)||(v.residence||"").toLowerCase().includes(q)||String(v.jersey||"").includes(q)); });
  const startDate = new Date(2026,11,1,9,0,0);
  const diff = Math.max(0, startDate.getTime()-now.getTime());
  const cd = {d:Math.floor(diff/86400000), h:Math.floor(diff/3600000)%24, m:Math.floor(diff/60000)%60, s:Math.floor(diff/1000)%60};
  const portalMen = registrations.filter((r:any)=> (r.value?.division||"Men")==="Men").length;
  const portalWomen = registrations.filter((r:any)=> (r.value?.division||"Men")==="Women").length;
  const slotsMen = Math.max(0, 80-menCount); const slotsWomen = Math.max(0, 60-womenCount);

  async function saveOfficialsForTeamKey(teamKey:string, teamName:string, ward:string, divisionName:string, officials:Official[]){
    const cleaned = officials.filter(o=>o.name?.trim()).map(o=>({...o,name:o.name.trim(),phone:o.phone.trim(),idNo:o.idNo.trim(),status:o.status||"Pending"}));
    const existing = officialsRecords.find((r:any)=>r.value?.teamKey===teamKey);
    if(existing) await api("records.replace",{collection:"team_officials",id:existing.id,value:{teamKey,teamName,ward,division:divisionName,officials:cleaned}});
    else await api("records.create",{collection:"team_officials",value:{teamKey,teamName,ward,division:divisionName,officials:cleaned},idempotency_key:`officials-${teamKey.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`});
  }
  async function confirmTeam(team:Team){
    if(!admin){ setNotice("Only Admin can confirm a pending team. Open Admin tab and enter PIN 1234."); return; }
    if(team.status==="Confirmed") return;
    setBusy(true);
    try{
      const teamKey = teamKeyOf(team);
      await api("records.create",{collection:"team_confirmations",value:{teamKey,teamName:team.name,ward:team.ward,division:team.division,status:"Confirmed",confirmedAt:new Date().toISOString()},idempotency_key:`confirm-${team.division}-${team.ward}-${team.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`});
      await reloadRecords();
      setNotice(`${team.name} confirmed. It now joins pools.`);
    }catch(e){ setNotice("Team could not be confirmed. Try again."); }
    setBusy(false);
  }
  async function deleteTeam(team:Team){
    if(!admin) return;
    if(!deleteConfirmChecked[team.id]){ setNotice("Tick “Yes, delete this team” before deleting."); return; }
    setBusy(true);
    try{
      const key=teamKeyOf(team);
      const reg = registrations.find((r:any)=> (r.value?.teamName||"")===team.name && (r.value?.ward)===team.ward);
      if(reg) await api("records.delete",{collection:"registrations",id:reg.id});
      else {
        const existingDel = deletedTeams.find((r:any)=>r.value?.teamKey===key);
        if(!existingDel) await api("records.create",{collection:"deleted_teams",value:{teamKey:key,teamName:team.name,ward:team.ward,division:team.division,reason:deleteReason[team.id]||"",deletedAt:new Date().toISOString()},idempotency_key:`delete-team-${key.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`});
      }
      // delete officials + players for this team
      const off = officialsRecords.find((r:any)=>r.value?.teamKey===key); if(off) await api("records.delete",{collection:"team_officials",id:off.id}).catch(()=>{});
      const teamPlayers = players.filter((p:any)=>Number(p.value?.teamId)===team.id);
      for(const p of teamPlayers){ await api("records.delete",{collection:"players",id:p.id}).catch(()=>{}); }
      const conf = teamConfirmations.find((r:any)=>r.value?.teamKey===key); if(conf) await api("records.delete",{collection:"team_confirmations",id:conf.id}).catch(()=>{});
      await reloadRecords(); setDeleteConfirmTeam(null); setNotice(`${team.name} deleted. Its players and officials were removed and its slot is free.`);
    }catch(e){ setNotice("Team could not be deleted. Try again."); }
    setBusy(false);
  }
  async function confirmPlayerRecord(p:any){
    if(!admin) return; setBusy(true);
    try{
      const existing = playerConfirmRecords.find((r:any)=>String(r.value?.playerId)===String(p.id));
      if(existing) await api("records.replace",{collection:"player_confirmations",id:existing.id,value:{playerId:String(p.id),playerName:p.value?.name,status:"Confirmed"}});
      else await api("records.create",{collection:"player_confirmations",value:{playerId:String(p.id),playerName:p.value?.name,status:"Confirmed"},idempotency_key:`player-confirm-${p.id}`});
      await reloadRecords(); setNotice(`Player ${p.value?.name} confirmed.`);
    }catch{ setNotice("Player could not be confirmed."); } setBusy(false);
  }
  async function deletePlayerRecord(p:any){
    if(!admin) return; if(!deletePlayerChecked[String(p.id)]){ setNotice("Tick “Yes, delete this player” first."); return; }
    setBusy(true); try{ await api("records.delete",{collection:"players",id:p.id}); await reloadRecords(); setDeleteConfirmPlayer(null); setNotice("Player deleted."); setSelectedPlayer(null);}catch{ setNotice("Player could not be deleted."); } setBusy(false);
  }
  async function confirmOfficial(team:Team, idx:number){
    if(!admin) return; const offs=[...(officialsMap[teamKeyOf(team)]||[])]; if(!offs[idx]) return; offs[idx]={...offs[idx],status:"Confirmed"}; setBusy(true);
    try{ await saveOfficialsForTeamKey(teamKeyOf(team),team.name,team.ward,team.division,offs); await reloadRecords(); setNotice(`Official ${offs[idx].name} confirmed.`);}catch{ setNotice("Official could not be confirmed."); } setBusy(false);
  }
  async function createResultRow(divisionName:string, week:number, runId:number, resultsObj:Record<string,ResultVal>){
    const existing = resultRecords.find((r:any)=>r.value?.division===divisionName&&r.value?.week===week);
    if(existing) await api("records.replace",{collection:"tournament_results",id:existing.id,value:{division:divisionName,week,runId,results:resultsObj}});
    else await api("records.create",{collection:"tournament_results",value:{division:divisionName,week,runId,results:resultsObj},idempotency_key:`tournament-${divisionName}-${week}-${runId}`});
  }
  async function saveExtrasForFixture(fixtureId:string, patch:any){
    const existing = extrasRecords.find((r:any)=>r.value?.fixtureId===fixtureId);
    const value = {...(existing?.value||{fixtureId}), ...patch, fixtureId};
    if(existing) await api("records.replace",{collection:"match_extras",id:existing.id,value});
    else await api("records.create",{collection:"match_extras",value,idempotency_key:`extras-${fixtureId}`});
    await reloadRecords();
  }
  async function deleteResultForFixture(f:Fixture){
    if(!admin) return; setBusy(true);
    try{
      const weekResults:Record<string,ResultVal>={};
      fixtures.filter(x=>x.division===f.division&&x.week===f.week).forEach(x=>{ if(x.id!==f.id) weekResults[x.id]= results[x.id] || {hg:0,ag:0,status:"Scheduled"}; });
      await createResultRow(f.division,f.week,Date.now(),weekResults);
      await reloadRecords(); setNotice(`Result deleted for ${getTeam(f.home)?.name} vs ${getTeam(f.away)?.name}.`);
    }catch{ setNotice("Result could not be deleted."); } setBusy(false);
  }
  async function handleSimulate(){
    const runId = Date.now(); const rnd = mulberry(runId % 2147483647); const rows:any[]=[];
    (["Men","Women"] as const).forEach(div=>{ for(let w=1;w<=5;w++){ const res:Record<string,ResultVal>={}; fixtures.filter(f=>f.division===div&&f.week===w).forEach(f=>{ const hg=goalsFor(rnd), ag=goalsFor(rnd); const scorers:any[]=[]; for(let i=0;i<hg;i++){ const roster=effectiveRoster(f.home); const p=roster[Math.floor(rnd()*roster.length)]; if(p) scorers.push({player:p.name,playerId:p.id,teamId:f.home,pos:p.pos,minute:1+Math.floor(rnd()*90)}); } for(let i=0;i<ag;i++){ const roster=effectiveRoster(f.away); const p=roster[Math.floor(rnd()*roster.length)]; if(p) scorers.push({player:p.name,playerId:p.id,teamId:f.away,pos:p.pos,minute:1+Math.floor(rnd()*90)}); } res[f.id]={hg,ag,status:"FT",scorers,cards:[]}; }); rows.push({division:div,week:w,runId,results:res}); } });
    setBusy(true); let saved=0; let error:string|null=null;
    try{ for(const row of rows){ await createResultRow(row.division,row.week,row.runId,row.results); saved+=1; } } catch(e){ error=e instanceof Error?e.message:String(e); }
    let reloadError:string|null=null; try{ await reloadRecords(); } catch(e){ reloadError=e instanceof Error?e.message:String(e); }
    setSimulateResult({saved,remaining:rows.length-saved,error,reloadError}); setBusy(false);
    if(!error && !reloadError) setNotice(`Simulated ${fixtures.length} ward pool matches across both divisions.`);
  }
  async function handleSimulateMatchday(){
    if(weekFilter==="All"){ setNotice("Pick a Matchday first, then use Simulate Matchday."); return; }
    const w=Number(weekFilter); const divs = division==="All"?["Men","Women"]:[division];
    const runId=Date.now(); const rnd=mulberry(runId%2147483647); const rows:any[]=[];
    divs.forEach(div=>{ const res:Record<string,ResultVal>={}; let any=false; fixtures.filter(f=>f.division===div&&f.week===w).forEach(f=>{ const ex=results[f.id]; if(ex?.status==="FT"){ res[f.id]=ex; } else { any=true; const hg=goalsFor(rnd), ag=goalsFor(rnd); const scorers:any[]=[]; for(let i=0;i<hg;i++){ const roster=effectiveRoster(f.home); const p=roster[Math.floor(rnd()*roster.length)]; if(p) scorers.push({player:p.name,playerId:p.id,teamId:f.home,pos:p.pos,minute:1+Math.floor(rnd()*90)}); } for(let i=0;i<ag;i++){ const roster=effectiveRoster(f.away); const p=roster[Math.floor(rnd()*roster.length)]; if(p) scorers.push({player:p.name,playerId:p.id,teamId:f.away,pos:p.pos,minute:1+Math.floor(rnd()*90)}); } res[f.id]={hg,ag,status:"FT",scorers,cards:[]}; } }); if(any||Object.keys(res).length) rows.push({division:div,week:w,runId,results:res}); });
    if(!rows.length){ setNotice("No unplayed fixtures for that matchday."); return; }
    setBusy(true); let saved=0; let error:string|null=null;
    try{ for(const row of rows){ await createResultRow(row.division,row.week,row.runId,row.results); saved+=1; } } catch(e){ error=e instanceof Error?e.message:String(e); }
    let reloadError:string|null=null; try{ await reloadRecords(); } catch(e){ reloadError=e instanceof Error?e.message:String(e); }
    setSimulateResult({saved,remaining:rows.length-saved,error,reloadError}); setBusy(false);
    if(!error&&!reloadError) setNotice(`Simulated Matchday ${w} for ${divs.join(" & ")}. Tables updated.`);
  }
  async function handleReset(){
    setBusy(true); setNotice(""); setSimulateResult(null);
    try{
      const rows = await api("records.list",{collection:"tournament_results"});
      for(const r of rows.records||[]){ await api("records.replace",{collection:"tournament_results",id:r.id,value:{division:r.value?.division||"Men",week:r.value?.week,runId:Date.now(),results:{}}}); }
      await reloadRecords(); setNotice("Tournament results were reset. All fixtures are scheduled again.");
    }catch(e){ setNotice("Reset could not be saved. Try again."); }
    setBusy(false);
  }
  async function handleResetKnockout(){
    if(!admin) return; setBusy(true);
    try{ const rows=await api("records.list",{collection:"knockout_results"}); for(const r of rows.records||[]){ if(division==="All"||r.value?.division===division) await api("records.delete",{collection:"knockout_results",id:r.id}); } await reloadRecords(); setNotice(`Knockout results reset for ${division==="All"?"both divisions":division}.`); }catch(e){ setNotice("Knockout reset could not be saved. Try again."); }
    setBusy(false);
  }
  function openResult(f:Fixture){
    const r=results[f.id];
    setResultFixture(f); setResultScore({hg:r?String(r.hg):"",ag:r?String(r.ag):""}); setResultScorers(r?.scorers||[]); setResultCards(r?.cards||[]); setResultError("");
    const ex=extrasMap[f.id]; setResultMvp(ex?.mvp?.playerId||""); setResultMvpReason(ex?.mvp?.reason||"");
    trackView(`fixture-${f.id}`,`Fixture ${f.id}`);
  }
  async function saveResultForm(){
    if(!resultFixture) return;
    const hg=parseInt(resultScore.hg,10), ag=parseInt(resultScore.ag,10);
    if(Number.isNaN(hg)||Number.isNaN(ag)||hg<0||ag<0||hg>20||ag>20){ setResultError("Enter valid scores from 0 to 20."); return; }
    const weekResults:Record<string,ResultVal>={};
    fixtures.filter(x=>x.division===resultFixture.division&&x.week===resultFixture.week).forEach(x=>{ weekResults[x.id]= results[x.id] || {hg:0,ag:0,status:"Scheduled"}; });
    weekResults[resultFixture.id]={hg,ag,status:"FT",scorers:resultScorers,cards:resultCards};
    setBusy(true);
    try{
      await createResultRow(resultFixture.division,resultFixture.week,Date.now(),weekResults);
      if(resultMvp){
        const allRoster=[...effectiveRoster(resultFixture.home),...effectiveRoster(resultFixture.away)];
        const mp=allRoster.find(p=>String(p.id)===String(resultMvp));
        await saveExtrasForFixture(resultFixture.id,{mvp:{playerId:resultMvp,player:mp?.name||"",teamId:mp?.teamId,reason:resultMvpReason}});
      }
      await reloadRecords(); setNotice(`Result saved: ${teamById.get(resultFixture.home)?.name} ${hg}–${ag} ${teamById.get(resultFixture.away)?.name}. Matchsheet updated.`); setResultFixture(null);
    } catch(e){ setResultError("Result could not be saved. Try again."); }
    setBusy(false);
  }
  async function saveKnockoutResult(match:any, div:string, scope:string, ward:string){
    const v=knockoutScores[match.id]; if(!v) return; const hg=parseInt(v.hg,10), ag=parseInt(v.ag,10);
    if(Number.isNaN(hg)||Number.isNaN(ag)||hg<0||ag<0){ setNotice("Enter valid knockout scores."); return; }
    const existing = knockoutRecords.find((r:any)=>r.value?.division===div && (r.value?.scope||"ward")===scope && (r.value?.ward||"")=== (ward||""));
    const next={...(existing?.value?.results||{}), [match.id]:{hg,ag,status:"FT"}};
    setBusy(true);
    try{ if(existing) await api("records.replace",{collection:"knockout_results",id:existing.id,value:{division:div,scope,ward:ward||"",results:next}}); else await api("records.create",{collection:"knockout_results",value:{division:div,scope,ward:ward||"",results:next},idempotency_key:`knockout-${scope}-${div}-${ward||"all"}-${Date.now()}`}); await reloadRecords(); setNotice(`Knockout result saved. Winner advances automatically.`); }catch(e){ setNotice("Knockout result could not be saved."); }
    setBusy(false);
  }
  async function handleRegister(e:React.FormEvent){
    e.preventDefault(); setFormError(""); setFormSuccess(""); setNotice("");
    const filledOfficials = officialsDraft.filter(o=>o.name.trim());
    if(filledOfficials.length===0) return setFormError("Add at least 1 team official (Coach, Chairman or Manager) to complete registration. Officials: 0/3.");
    if(form.teamName.trim().length<3) return setFormError("Team name needs at least 3 characters.");
    if(!/^\+?\d[\d\s-]{7,}$/.test(form.phone.trim())) return setFormError("Enter a valid coach phone number.");
    if(!WARDS.includes(form.ward)) return setFormError("Please choose a ward.");
    if(allTeams.some(t=>t.name.toLowerCase()===form.teamName.trim().toLowerCase())) return setFormError("That team name is already in the tournament.");
    const cap = form.division==="Men"?20:15; const occupied = countFor(form.ward, form.division);
    if(occupied>=cap) return setFormError(`${form.division} division in ${form.ward} is full (${cap}/${cap}). No slots left.`);
    const coachName = filledOfficials.find(o=>o.role==="Coach")?.name || filledOfficials[0].name;
    setBusy(true);
    try{
      await api("records.create",{collection:"registrations",value:{division:form.division,teamName:form.teamName.trim(),coach:coachName,phone:form.phone.trim(),county:"Bungoma County",ward:form.ward,groupPref:form.groupPref,color:form.color,awayColor:form.awayColor||"",homeGround:form.homeGround.trim(),notes:form.notes.trim(),status:"Pending",seq:Date.now(),feePaid:form.feePaid,receiptNo:form.receiptNo.trim(),registrationFee:"KES 1,000"},idempotency_key:`reg-${form.division}-${form.ward}-${form.teamName.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-")}-${form.phone.trim()}`});
      const teamKey = `${form.division}|${form.ward}|${form.teamName.trim()}`;
      await saveOfficialsForTeamKey(teamKey, form.teamName.trim(), form.ward, form.division, filledOfficials);
      await reloadRecords(); setFormSuccess(`Welcome to the Cup, ${form.teamName.trim()}! Registration saved in ${form.ward} Ward with ${filledOfficials.length} official(s). Coach: ${coachName}. Status: Pending until Admin confirms.`);
      setForm({division:form.division,teamName:"",coach:"",phone:"",county:"Bungoma County",ward:form.ward,groupPref:"A",color:"#E63946",awayColor:"",homeGround:"",notes:"",feePaid:"No",receiptNo:""});
      setOfficialsDraft([emptyOfficial(),emptyOfficial(),emptyOfficial()]);
    }catch(err){ setFormError(err instanceof Error?err.message:"Registration could not be saved. Try again."); }
    setBusy(false);
  }
  async function handleAdminAddTeam(e:React.FormEvent){
    e.preventDefault(); setAdminTeamError(""); setAdminTeamSuccess(""); setNotice("");
    if(!admin){ setAdminTeamError("Only Admin can add a team from this form. Enter PIN 1234 first."); return; }
    const name = adminTeamForm.teamName.trim();
    const filledOfficials = adminTeamOfficials.filter(o=>o.name.trim());
    if(name.length<3) return setAdminTeamError("Team name needs at least 3 characters.");
    if(!WARDS.includes(adminTeamForm.ward)) return setAdminTeamError("Please choose a ward.");
    if(filledOfficials.length===0) return setAdminTeamError("Add at least 1 official. Officials: 0/3 — at least 1 required.");
    const cap = adminTeamForm.division==="Men"?20:15;
    const occupied = countFor(adminTeamForm.ward, adminTeamForm.division);
    const slotsLeft = Math.max(0, cap-occupied);
    if(occupied>=cap) return setAdminTeamError(`${adminTeamForm.division} division in ${adminTeamForm.ward} is full (${cap}/${cap}). No slots left.`);
    if(allTeams.some(t=>t.ward===adminTeamForm.ward && t.division===adminTeamForm.division && t.name.toLowerCase()===name.toLowerCase())) return setAdminTeamError(`That team name already exists in ${adminTeamForm.ward} ${adminTeamForm.division}. Choose a different name.`);
    const coachName = filledOfficials.find(o=>o.role==="Coach")?.name || filledOfficials[0].name;
    setBusy(true);
    try{
      await api("records.create",{collection:"registrations",value:{division:adminTeamForm.division,teamName:name,coach:coachName,phone:filledOfficials[0].phone||"",county:"Bungoma County",ward:adminTeamForm.ward,groupPref:"A",color:adminTeamForm.color,awayColor:adminTeamForm.awayColor||"",homeGround:adminTeamForm.homeGround.trim(),notes:"Added by Admin",status:adminTeamForm.status,seq:Date.now(),feePaid:adminTeamForm.feePaid,receiptNo:adminTeamForm.receiptNo.trim(),registrationFee:"KES 1,000"},idempotency_key:`admin-reg-${adminTeamForm.division}-${adminTeamForm.ward}-${name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`});
      const teamKey = `${adminTeamForm.division}|${adminTeamForm.ward}|${name}`;
      await saveOfficialsForTeamKey(teamKey, name, adminTeamForm.ward, adminTeamForm.division, filledOfficials);
      await reloadRecords();
      const msg = `Team added - ${name} now in ${adminTeamForm.ward} ${adminTeamForm.division}`;
      setAdminTeamSuccess(msg);
      setNotice(msg + `. Status: ${adminTeamForm.status}. It is now in Teams, Wards and the correct ward pool.`);
      setAdminTeamForm({teamName:"",ward:adminTeamForm.ward,division:adminTeamForm.division,color:"#E63946",awayColor:"",homeGround:"",status:"Confirmed",feePaid:"No",receiptNo:""});
      setAdminTeamOfficials([emptyOfficial(),emptyOfficial(),emptyOfficial()]);
    }catch(err){ setAdminTeamError(err instanceof Error?err.message:"Team could not be added. Try again."); }
    setBusy(false);
  }
  async function saveOfficialsEdit(){
    if(!selectedTeam) return; setOfficialsEditError(""); setOfficialsEditSuccess("");
    const filled=officialsEdit.filter(o=>o.name.trim());
    if(filled.length===0) return setOfficialsEditError("Add at least 1 official. Officials: 0/3 — at least 1 required.");
    setBusy(true);
    try{ await saveOfficialsForTeamKey(teamKeyOf(selectedTeam),selectedTeam.name,selectedTeam.ward,selectedTeam.division,filled); await reloadRecords(); setOfficialsEditSuccess(`Officials saved for ${selectedTeam.name}: ${filled.length}/3. Registration status will update.`); }catch{ setOfficialsEditError("Officials could not be saved. Try again."); }
    setBusy(false);
  }
  useEffect(()=>{
    if(selectedTeam){
      const offs=getOfficials(selectedTeam);
      const arr=[0,1,2].map(i=> offs[i] ? {...offs[i]} : emptyOfficial());
      setOfficialsEdit(arr); setOfficialsEditError(""); setOfficialsEditSuccess("");
    }
  },[selectedTeam?.id, officialsRecords]);

  function openPlayerEdit(p:any|null){
    if(p){ setEditingPlayer(p); setPlayerForm({name:p.value?.name||"",dob:p.value?.dob||"",division:p.value?.division||"Men",teamId:String(p.value?.teamId||""),position:p.value?.position||"MF",jersey:String(p.value?.jersey||""),idNo:p.value?.idNo||"",residence:p.value?.residence||"",phone:p.value?.phone||"",passportStatus:p.value?.passportStatus||"Not Submitted",passportRef:p.value?.passportRef||""}); }
    else { setEditingPlayer(null); setPlayerForm({name:"",dob:"",division:division==="All"?"Men":division,teamId:"",position:"MF",jersey:"",idNo:"",residence:"",phone:"",passportStatus:"Not Submitted",passportRef:""}); }
    setPlayerError(""); setPlayerSuccess(""); setTab("players");
  }
  async function handlePlayerSubmit(e:React.FormEvent){
    e.preventDefault(); setPlayerError(""); setPlayerSuccess("");
    const jersey=parseInt(playerForm.jersey,10);
    if(playerForm.name.trim().length<3) return setPlayerError("Player full name needs at least 3 characters.");
    if(!playerForm.dob) return setPlayerError("Date of birth is required.");
    if(!playerForm.teamId) return setPlayerError("Choose a team from the portal list. Team not listed? Register the team first.");
    const teamExists = allTeams.some(t=>String(t.id)===String(playerForm.teamId));
    if(!teamExists) return setPlayerError("That team is not in the portal. Register the team first via the Register tab.");
    if(Number.isNaN(jersey)||jersey<1||jersey>99) return setPlayerError("Jersey number must be 1–99.");
    if(!playerForm.idNo.trim()) return setPlayerError("Birth Cert No. / ID No. is required.");
    if(!playerForm.residence.trim()) return setPlayerError("Residence is required.");
    if(playerForm.phone.trim() && !/^\+?\d[\d\s-]{7,}$/.test(playerForm.phone.trim())) return setPlayerError("Enter a valid phone number, or leave Phone blank.");
    const teamId=Number(playerForm.teamId);
    const others = players.filter((p:any)=> !editingPlayer || p.id!==editingPlayer.id);
    if(others.some((p:any)=>Number(p.value?.teamId)===teamId && Number(p.value?.jersey)===jersey)) return setPlayerError(`Jersey ${jersey} is already taken on this team.`);
    if(others.some((p:any)=>String(p.value?.idNo||"").trim().toLowerCase()===playerForm.idNo.trim().toLowerCase())) return setPlayerError("That Birth Cert No. / ID No. is already registered.");
    if(!editingPlayer && others.filter((p:any)=>Number(p.value?.teamId)===teamId).length>=18) return setPlayerError("This team already has 18 players - maximum reached");
    const value={name:playerForm.name.trim(),dob:playerForm.dob,division:playerForm.division,gender:playerForm.division==="Women"?"Female":"Male",teamId,position:playerForm.position,jersey,idNo:playerForm.idNo.trim(),residence:playerForm.residence.trim(),phone:playerForm.phone.trim(),passportStatus:playerForm.passportStatus||"Not Submitted",passportRef:playerForm.passportRef.trim()};
    setBusy(true);
    try{
      if(editingPlayer) await api("records.replace",{collection:"players",id:editingPlayer.id,value});
      else await api("records.create",{collection:"players",value,idempotency_key:`player-${value.teamId}-${value.jersey}-${value.idNo.replace(/[^a-z0-9]+/gi,"-")}`});
      await reloadRecords(); setPlayerSuccess(editingPlayer?`Player updated: ${value.name}.`:`Player registered: ${value.name} (#${value.jersey}).`); setEditingPlayer(null); setPlayerForm({name:"",dob:"",division:playerForm.division,teamId:"",position:"MF",jersey:"",idNo:"",residence:"",phone:"",passportStatus:"Not Submitted",passportRef:""});
    }catch(err){ setPlayerError(err instanceof Error?err.message:"Player could not be saved. Try again."); }
    setBusy(false);
  }
  function fixtureStatus(f:Fixture){
    const r=results[f.id]; if(r?.status==="FT") return "Full Time";
    const l=lineupsByFixture[f.id]; if(l?.home&&l?.away) return "Lineup Confirmed"; if(l?.home||l?.away) return "Lineup Pending"; return "Scheduled";
  }
  function openLineup(f:Fixture, side:"home"|"away"){
    setLineupFixture(f); setLineupSide(side); setLineupError("");
    const existing=lineupsByFixture[f.id]?.[side];
    if(existing){ setLineupStarters(existing.starters||[]); setLineupBench(existing.bench||[]); setLineupCaptain(existing.captain||""); setLineupFormation(existing.formation||"4-4-2"); }
    else { setLineupStarters([]); setLineupBench([]); setLineupCaptain(""); setLineupFormation("4-4-2"); }
    trackView(`fixture-${f.id}`,`Fixture ${f.id}`);
    const el=document.getElementById("lineup-builder"); if(el) el.scrollIntoView({behavior:"smooth"});
  }
  async function saveLineup(){
    if(!lineupFixture) return;
    const starters=lineupStarters; const bench=lineupBench;
    if(starters.length!==11) return setLineupError("Pick exactly 11 starters.");
    const teamId=lineupSide==="home"?lineupFixture.home:lineupFixture.away;
    const roster=effectiveRoster(teamId); const byId=new Map(roster.map(r=>[String(r.id),r]));
    const starterObjs=starters.map(id=>byId.get(String(id))).filter(Boolean) as any[];
    if(starterObjs.filter(s=>s.pos==="GK").length!==1) return setLineupError("Starters must include exactly 1 goalkeeper.");
    if(!lineupCaptain||!starters.includes(lineupCaptain)) return setLineupError("Captain must be one of the starters.");
    if(new Set([...starters,...bench]).size!==starters.length+bench.length) return setLineupError("A player cannot be in both the XI and the bench.");
    if(bench.length>7) return setLineupError("Maximum 7 substitutes.");
    const existingRecord=lineupRecords.find((r:any)=>r.value?.fixtureId===lineupFixture.id);
    const current=existingRecord?.value||{fixtureId:lineupFixture.id};
    const sideValue={starters,bench,captain:lineupCaptain,formation:lineupFormation,confirmed:true,confirmedAt:new Date().toISOString()};
    const value={...current,[lineupSide]:sideValue};
    setBusy(true);
    try{ if(existingRecord) await api("records.replace",{collection:"match_lineups",id:existingRecord.id,value}); else await api("records.create",{collection:"match_lineups",value,idempotency_key:`lineup-${lineupFixture.id}-${Date.now()}`}); await reloadRecords(); setNotice(`Lineup confirmed for ${getTeam(teamId)?.name} — ${lineupFormation}.`); setLineupFixture(null); }catch(e){ setLineupError("Lineup could not be saved. Try again."); }
    setBusy(false);
  }
  function matchsheetData(f:Fixture){
    const hash=[...f.id].reduce((s,c)=>s+c.charCodeAt(0),0);
    return {referee:REFEREES[hash%REFEREES.length], commissioner:REFEREES[(hash+3)%REFEREES.length]};
  }
  const tabs:{id:Tab;label:string}[]=[{id:"home",label:"Home"},{id:"wards",label:"Wards"},{id:"teams",label:"Teams"},{id:"players",label:"Players"},{id:"fixtures",label:"Fixtures"},{id:"matchday",label:"Matchday"},{id:"livescore",label:"Live Score"},{id:"matchsheet",label:"Matchsheet"},{id:"standings",label:"Standings"},{id:"knockout",label:"Knockout"},{id:"subcounty",label:"Sub-County"},{id:"scorers",label:"Top Scorers"},{id:"register",label:"Register"},{id:"registered",label:"Registered Teams"},{id:"admin",label:"Admin"}];
  const liveByFixture = useMemo(()=>{ const m:Record<string,any>={}; liveRecords.forEach((r:any)=>{ if(r.value?.fixtureId) m[r.value.fixtureId]={...r.value,recordId:r.id}; }); return m; },[liveRecords]);
  async function saveLive(fixtureId:string, patch:any){
    const existing = liveRecords.find((r:any)=>r.value?.fixtureId===fixtureId);
    const fx = fixtures.find(f=>f.id===fixtureId); if(!fx) return;
    const base = existing?.value || {fixtureId, hg:0, ag:0, minute:0, status:"Live", scorers:[], cards:[]};
    const value = {...base, ...patch};
    if(existing) await api("records.replace",{collection:"live_matches",id:existing.id,value});
    else await api("records.create",{collection:"live_matches",value,idempotency_key:`live-${fixtureId}`});
    await reloadRecords();
  }
  async function startLive(f:Fixture){
    if(!admin){ setNotice("Only Admin can start a live match. Open Admin tab and enter PIN 1234."); return; }
    setBusy(true); try{ await saveLive(f.id,{hg:0,ag:0,minute:0,status:"Live",scorers:[],cards:[],startedAt:new Date().toISOString()}); setNotice(`Live started: ${teamById.get(f.home)?.name} vs ${teamById.get(f.away)?.name}.`); setTab("livescore"); }catch(e){ setNotice("Live match could not be started. Try again."); } setBusy(false);
  }
  async function addLiveGoal(f:Fixture){
    const cur=liveByFixture[f.id]; if(!cur) return;
    const draft=liveGoalDraft[f.id]; const playerId=draft?.playerId; if(!playerId){ setNotice("Pick a goal scorer first."); return; }
    const allRoster=[...effectiveRoster(f.home),...effectiveRoster(f.away)];
    const p=allRoster.find(x=>String(x.id)===String(playerId)); if(!p) return;
    setBusy(true); try{ await saveLive(f.id,{hg: p.teamId===f.home?cur.hg+1:cur.hg, ag: p.teamId===f.away?cur.ag+1:cur.ag, scorers:[...(cur.scorers||[]),{player:p.name,playerId:p.id,teamId:p.teamId,pos:p.pos,minute:parseInt(draft.minute||String(cur.minute),10)||cur.minute}]}); setNotice(`Goal added: ${p.name} (${cur.minute}').`); }catch{ setNotice("Goal could not be saved."); } setBusy(false);
  }
  async function addLiveCard(f:Fixture){
    const cur=liveByFixture[f.id]; if(!cur) return;
    const draft=liveCardDraft[f.id]; const playerId=draft?.playerId; if(!playerId){ setNotice("Pick a player for the card."); return; }
    const allRoster=[...effectiveRoster(f.home),...effectiveRoster(f.away)];
    const p=allRoster.find(x=>String(x.id)===String(playerId)); if(!p) return;
    setBusy(true); try{ await saveLive(f.id,{cards:[...(cur.cards||[]),{player:p.name,playerId:p.id,teamId:p.teamId,type:draft.type||"Yellow",minute:parseInt(draft.minute||String(cur.minute),10)||cur.minute}]}); setNotice(`Card added: ${p.name} — ${draft.type||"Yellow"}.`); }catch{ setNotice("Card could not be saved."); } setBusy(false);
  }
  async function saveLiveMvp(f:Fixture){
    const pid=liveMvpDraft[f.id]; if(!pid){ setNotice("Pick an MVP first."); return; }
    const allRoster=[...effectiveRoster(f.home),...effectiveRoster(f.away)];
    const p=allRoster.find(x=>String(x.id)===String(pid)); if(!p) return;
    setBusy(true); try{ await saveExtrasForFixture(f.id,{mvp:{playerId:pid,player:p.name,teamId:p.teamId,reason:"Live MVP"}}); setNotice(`MVP saved: ${p.name}.`); }catch{ setNotice("MVP could not be saved."); } setBusy(false);
  }
  async function updateLiveMinute(f:Fixture, kind:string){
    const cur = liveByFixture[f.id]; if(!cur) return; setBusy(true);
    try{
      if(kind==="minutePlus") await saveLive(f.id,{minute:Math.min(120,cur.minute+1)});
      else if(kind==="minuteSet"){ const m=parseInt(liveMinuteDraft[f.id]||String(cur.minute),10); if(!Number.isNaN(m)) await saveLive(f.id,{minute:Math.max(0,Math.min(120,m))}); }
    }catch(e){ setNotice("Live update could not be saved."); } setBusy(false);
  }
  async function endLive(f:Fixture){
    const cur=liveByFixture[f.id]; if(!cur) return;
    const hg=parseInt(endLiveScore.hg,10), ag=parseInt(endLiveScore.ag,10);
    if(Number.isNaN(hg)||Number.isNaN(ag)){ setNotice("Enter the final score to end the match."); return; }
    setBusy(true);
    try{
      const weekResults:Record<string,ResultVal>={};
      fixtures.filter(x=>x.division===f.division&&x.week===f.week).forEach(x=>{ weekResults[x.id]= results[x.id] || {hg:0,ag:0,status:"Scheduled"}; });
      weekResults[f.id]={hg,ag,status:"FT",scorers:cur.scorers||[],cards:cur.cards||[]};
      await createResultRow(f.division,f.week,Date.now(),weekResults);
      await api("records.delete",{collection:"live_matches",id:cur.recordId});
      await reloadRecords(); setEndingLiveId(null); setNotice(`Full time: ${teamById.get(f.home)?.name} ${hg}–${ag} ${teamById.get(f.away)?.name}.`);
    }catch(e){ setNotice("Match could not be ended. Try again."); } setBusy(false);
  }
  async function addMatchEvent(f:Fixture){
    if(!admin){ setNotice("Only Admin can add match events."); return; }
    const type=matchEventForm.type; const minute=parseInt(matchEventForm.minute,10)||45;
    setBusy(true);
    try{
      if(type==="Substitution"){
        const ex=extrasMap[f.id]||{};
        const subs=[...(ex.substitutions||[]),{minute,offPlayerId:matchEventForm.offPlayerId,onPlayerId:matchEventForm.onPlayerId,teamId:Number(matchEventForm.teamId||f.home),offName:[...effectiveRoster(f.home),...effectiveRoster(f.away)].find(p=>String(p.id)===matchEventForm.offPlayerId)?.name||"",onName:[...effectiveRoster(f.home),...effectiveRoster(f.away)].find(p=>String(p.id)===matchEventForm.onPlayerId)?.name||""}];
        await saveExtrasForFixture(f.id,{substitutions:subs});
        setNotice("Substitution added to Minutes log.");
      } else {
        const weekResults:Record<string,ResultVal>={};
        fixtures.filter(x=>x.division===f.division&&x.week===f.week).forEach(x=>{ weekResults[x.id]= results[x.id] || {hg:0,ag:0,status:"Scheduled"}; });
        const cur = weekResults[f.id];
        const allRoster=[...effectiveRoster(f.home),...effectiveRoster(f.away)];
        const p=allRoster.find(x=>String(x.id)===String(matchEventForm.playerId));
        if(!p){ setNotice("Pick a player for the event."); setBusy(false); return; }
        if(type==="Goal"){
          const hg = Number(matchEventForm.teamId)===f.home ? cur.hg+1 : cur.hg;
          const ag = Number(matchEventForm.teamId)===f.away ? cur.ag+1 : cur.ag;
          weekResults[f.id]={hg,ag,status:cur.status||"FT",scorers:[...(cur.scorers||[]),{player:p.name,playerId:p.id,teamId:Number(matchEventForm.teamId||p.teamId),pos:p.pos,minute}],cards:cur.cards||[]};
        } else {
          weekResults[f.id]={...cur,status:cur.status||"FT",scorers:cur.scorers||[],cards:[...(cur.cards||[]),{player:p.name,playerId:p.id,teamId:Number(matchEventForm.teamId||p.teamId),type:matchEventForm.cardType,minute}]};
        }
        await createResultRow(f.division,f.week,Date.now(),weekResults);
        await reloadRecords(); setNotice(`${type} added: ${p.name} (${minute}'). Score updated.`);
      }
    }catch{ setNotice("Event could not be saved."); }
    setBusy(false);
  }
  async function saveMvpForFixture(f:Fixture){
    if(!mvpForm.playerId){ setNotice("Pick an MVP first."); return; }
    const allRoster=[...effectiveRoster(f.home),...effectiveRoster(f.away)];
    const p=allRoster.find(x=>String(x.id)===String(mvpForm.playerId)); if(!p) return;
    setBusy(true); try{ await saveExtrasForFixture(f.id,{mvp:{playerId:p.id,player:p.name,teamId:p.teamId,reason:mvpForm.reason}}); setNotice(`MVP saved: ${p.name} — ${getTeam(p.teamId)?.name}.`); }catch{ setNotice("MVP could not be saved."); } setBusy(false);
  }
  async function saveMinutesForFixture(f:Fixture){
    setBusy(true); try{ await saveExtrasForFixture(f.id,{ht:{hg:parseInt(minutesForm.htHg||"0",10),ag:parseInt(minutesForm.htAg||"0",10)},penalties:{hg:parseInt(minutesForm.penHg||"0",10),ag:parseInt(minutesForm.penAg||"0",10)},extraTime:minutesForm.extraTime}); setNotice("Minutes / half-time / penalties saved."); }catch{ setNotice("Minutes could not be saved."); } setBusy(false);
  }
  const accent = division==="Women" ? "#9333EA" : "#0B7A43";
  const accentText = division==="Women" ? "text-[#9333EA]" : "text-[#0B7A43]";
  function statusBadge(status:TeamStatus){
    if(status==="Confirmed") return <span className="inline-block bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">Confirmed</span>;
    return <span className="inline-block bg-amber-400 text-black text-[11px] font-bold px-2 py-0.5 rounded-full">Pending</span>;
  }
  async function unlockAdmin(){
    setPinError("");
    const { error } = await supabase.auth.signInWithPassword({ email: adminEmail.trim(), password: adminPassword });
    if (error) { setPinError(error.message); return; }
    setAdmin(true); setAdminPassword(""); setNotice("Administrator signed in.");
  }
  function renderKnockoutMatch(match:any, div:string, scope:string, ward:string){
    const r=knockoutMap[match.id];
    const homeName=match.home?.name||"TBD"; const awayName=match.away?.name||"TBD";
    const homeTag = match.home ? `${match.home.ward||ward} • ${match.home.division||div}` : match.homeSource;
    const awayTag = match.away ? `${match.away.ward||ward} • ${match.away.division||div}` : match.awaySource;
    return <div key={match.id} className="bg-[#122E24] border border-white/10 rounded-2xl p-4">
      <p className="text-xs font-bold" style={{color:accent}}>{match.label} • {match.date} • {match.time} • {match.venue} • {scope==="ward" ? `Ward: ${ward}` : "Sub-County"}</p>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between gap-2 rounded-lg px-2 py-2 bg-black/20"><span className="text-sm [overflow-wrap:anywhere]">{homeName} <span className="text-[11px] opacity-70">({homeTag})</span></span><span>{r?r.hg:"—"}</span></div>
        <div className="flex justify-between gap-2 rounded-lg px-2 py-2 bg-black/20"><span className="text-sm [overflow-wrap:anywhere]">{awayName} <span className="text-[11px] opacity-70">({awayTag})</span></span><span>{r?r.ag:"—"}</span></div>
      </div>
      <p className="text-xs font-bold mt-3 bg-[#FEF3C7] border border-[#C9A227] rounded-lg px-2 py-1.5 text-[#111827]">🏆 Prize: {prizeForKnockout(match,div)}</p>
      {admin && match.home && match.away && <div className="flex gap-2 mt-3"><input aria-label="Home goals knockout" placeholder="Home" inputMode="numeric" value={knockoutScores[match.id]?.hg ?? (r?String(r.hg):"")} onChange={e=>setKnockoutScores({...knockoutScores,[match.id]:{hg:e.target.value,ag:knockoutScores[match.id]?.ag??(r?String(r.ag):"")}})} /><input aria-label="Away goals knockout" placeholder="Away" inputMode="numeric" value={knockoutScores[match.id]?.ag ?? (r?String(r.ag):"")} onChange={e=>setKnockoutScores({...knockoutScores,[match.id]:{hg:knockoutScores[match.id]?.hg??(r?String(r.hg):""),ag:e.target.value}})} /><button onClick={()=>saveKnockoutResult(match,div,scope,ward)} disabled={busy} className="font-bold px-3 rounded-lg shrink-0 text-black" style={{background:accent}}>Save</button></div>}
      <p className="text-xs text-[#B9CBC1] mt-2">{r?.status==="FT"?"Winner advances automatically.":"Winner advances to next round."}</p>
    </div>;
  }
  function renderWardKnockout(ward:string, div:string){
    const b=wardBracket(ward,div);
    return <div className="mt-3">
      {b.champion && <div className="bg-gradient-to-br from-[#0B3D2E] to-black border rounded-2xl p-4 text-center mb-3" style={{borderColor:accent}}><Trophy className="mx-auto" style={{color:accent}} size={32}/><p className="text-xs tracking-[.25em] text-[#B9CBC1] mt-1">WARD CHAMPION • {ward.toUpperCase()} • {div.toUpperCase()}</p><h4 className="font-display text-2xl font-extrabold uppercase">{b.champion.name}</h4><p className="text-xs text-[#B9CBC1]">Runner-up: {b.runnerUp?.name||"—"} {div==="Men"&&<>• 3rd: {b.thirdPlace?.name||"—"}</>}</p></div>}
      {b.qf.length>0 && <><h5 className="font-bold mt-3">{div} — {ward} Ward Quarter-Finals / Playoffs</h5><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">{b.qf.map((m:any)=>renderKnockoutMatch(m,div,"ward",ward))}</div></>}
      {b.sf.length>0 && <><h5 className="font-bold mt-4">{div} — {ward} Ward Semi-Finals</h5><div className="grid md:grid-cols-2 gap-3 mt-2">{b.sf.map((m:any)=>renderKnockoutMatch(m,div,"ward",ward))}</div></>}
      {div==="Men" && b.third.length>0 && <><h5 className="font-bold mt-4">{div} — {ward} 3rd-Place Playoff</h5><div className="grid md:grid-cols-2 gap-3 mt-2">{b.third.map((m:any)=>renderKnockoutMatch(m,div,"ward",ward))}</div></>}
      {b.final.length>0 && <><h5 className="font-bold mt-4">{div} — {ward} Ward Final</h5><div className="grid md:grid-cols-2 gap-3 mt-2">{b.final.map((m:any)=>renderKnockoutMatch(m,div,"ward",ward))}</div></>}
      {b.final.length===0 && <p className="text-sm text-[#B9CBC1] mt-2">No knockout bracket yet — pools need at least 2 confirmed teams to form a final.</p>}
    </div>;
  }
  function renderSubcountyBracket(div:string){
    const b=subcountyBracket(div);
    return <div className="mt-3">
      <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="text-sm font-bold">Ward Finals complete: {b.finalsDone}/4 wards {div}</p><p className="text-sm text-[#B9CBC1] mt-1">{b.quals.map(q=>`${q.ward}: ${q.completeFinal?"✓ Final done":"Pending"}`).join(" • ")}</p>{!b.allFinalsDone && <p className="text-sm text-amber-200 mt-2">Sub-County fixtures auto-generate only when all 4 wards have completed their Ward Finals.</p>}</div>
      {b.champion && <div className="mt-3 bg-gradient-to-br from-[#0B3D2E] to-black border rounded-3xl p-5 text-center" style={{borderColor:accent}}><Trophy className="mx-auto" style={{color:accent}} size={48}/><p className="text-xs tracking-[.25em] text-[#B9CBC1] mt-2">OVERALL CHAMPION • SUB-COUNTY • {div.toUpperCase()}</p><h3 className="font-display text-3xl sm:text-5xl font-extrabold uppercase mt-1">{b.champion.name}</h3></div>}
      <div className="mt-4"><h4 className="font-bold">Qualified teams — {div} ({b.ordered.length}/{div==="Men"?12:8})</h4><div className="flex flex-wrap gap-1.5 mt-2">{b.ordered.map((o:any,i:number)=><span key={i} className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-100">Seed {o.seed}. {o.team.name} — {o.ward} • {o.rank}</span>)}{b.ordered.length===0 && <span className="text-sm text-[#B9CBC1]">No ward has completed its final yet.</span>}</div></div>
      {div==="Men" && <><h4 className="font-bold mt-5">Sub-County Playoff — Round of 12</h4><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">{b.po.map((m:any)=>renderKnockoutMatch(m,div,"subcounty",""))}</div></>}
      <h4 className="font-bold mt-5">Sub-County Quarter-Finals</h4><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">{b.qf.map((m:any)=>renderKnockoutMatch(m,div,"subcounty",""))}</div>
      <h4 className="font-bold mt-5">Sub-County Semi-Finals</h4><div className="grid md:grid-cols-2 gap-3 mt-2">{b.sf.map((m:any)=>renderKnockoutMatch(m,div,"subcounty",""))}</div>
      <h4 className="font-bold mt-5">Sub-County Final</h4><div className="grid md:grid-cols-2 gap-3 mt-2">{b.final.map((m:any)=>renderKnockoutMatch(m,div,"subcounty",""))}</div>
    </div>;
  }
  function qualificationTracker(div:string){
    const quals=qualifiedForDivision(div);
    return <div className="bg-[#122E24] border border-white/10 rounded-2xl overflow-hidden mt-4"><div className="px-4 py-3 bg-[#0B3D2E]"><h4 className="font-bold">Qualification Tracker — {div} (Top {div==="Men"?3:2} per ward → Sub-County)</h4></div><div className="table-wrap"><table><thead><tr><th>Ward</th><th>Champion</th><th>Runner-up</th>{div==="Men"&&<th>3rd Place</th>}<th>Status</th></tr></thead><tbody>{quals.map(q=>{ const slots = div==="Men"?[q.champion,q.runnerUp,q.thirdPlace]:[q.champion,q.runnerUp]; const qualifiedCount = slots.filter(Boolean).length; return <tr key={q.ward}><td className="font-bold">{q.ward}</td><td>{q.champion? <span className="font-semibold">{q.champion.name}</span> : <span className="text-[#B9CBC1]">Pending</span>}</td><td>{q.runnerUp? <span className="font-semibold">{q.runnerUp.name}</span> : <span className="text-[#B9CBC1]">Pending</span>}</td>{div==="Men"&&<td>{q.thirdPlace? <span className="font-semibold">{q.thirdPlace.name}</span> : <span className="text-[#B9CBC1]">Pending</span>}</td>}<td><span className={`text-xs font-bold px-2 py-1 rounded-full ${q.complete?"bg-emerald-500/20 text-emerald-100":"bg-amber-400/20 text-amber-100"}`}>{q.complete?`Qualified ${qualifiedCount}/${div==="Men"?3:2}`:`Pending ${qualifiedCount}/${div==="Men"?3:2}`}</span></td></tr>; })}</tbody></table></div></div>;
  }
  const menQualifiedTotal = qualifiedForDivision("Men").reduce((s,q)=> s + [q.champion,q.runnerUp,q.thirdPlace].filter(Boolean).length,0);
  const womenQualifiedTotal = qualifiedForDivision("Women").reduce((s,q)=> s + [q.champion,q.runnerUp].filter(Boolean).length,0);
  const matchsheetsGenerated = fixtures.filter(f=>lineupsByFixture[f.id]?.home&&lineupsByFixture[f.id]?.away).length;

  // Inline Lineup Builder (reused on Fixtures / Matchday / Matchsheet)
  function renderLineupBuilder(){
    if(!lineupFixture) return null;
    const f=lineupFixture; const teamId=lineupSide==="home"?f.home:f.away; const team=getTeam(teamId); const roster=effectiveRoster(teamId);
    return <section id="lineup-builder" className="light-form mt-4">
      <div className="flex justify-between gap-2"><div><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Lineup Builder — {team?.name}</h3><p className="hint">{f.division} • {f.ward} Ward • Pool {f.group} • {fmtDate(f.date)} • {f.time} • vs {getTeam(lineupSide==="home"?f.away:f.home)?.name}</p></div><button onClick={()=>setLineupFixture(null)} className="bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg text-sm font-bold text-slate-800 h-fit">Close</button></div>
      <div className="flex gap-2 mt-3"><button onClick={()=>{ setLineupSide("home"); const ex=lineupsByFixture[f.id]?.home; setLineupStarters(ex?.starters||[]); setLineupBench(ex?.bench||[]); setLineupCaptain(ex?.captain||""); setLineupFormation(ex?.formation||"4-4-2"); }} className={`flex-1 py-2.5 rounded-lg font-bold ${lineupSide==="home"?"bg-emerald-700 text-white":"bg-slate-100 text-slate-800 border"}`}>Home — {getTeam(f.home)?.name}</button><button onClick={()=>{ setLineupSide("away"); const ex=lineupsByFixture[f.id]?.away; setLineupStarters(ex?.starters||[]); setLineupBench(ex?.bench||[]); setLineupCaptain(ex?.captain||""); setLineupFormation(ex?.formation||"4-4-2"); }} className={`flex-1 py-2.5 rounded-lg font-bold ${lineupSide==="away"?"bg-emerald-700 text-white":"bg-slate-100 text-slate-800 border"}`}>Away — {getTeam(f.away)?.name}</button></div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4"><div><label>Formation *</label><select value={lineupFormation} onChange={e=>setLineupFormation(e.target.value)}>{FORMATIONS.map(x=><option key={x}>{x}</option>)}</select></div><div><label>Captain * (from team players)</label><select value={lineupCaptain} onChange={e=>setLineupCaptain(e.target.value)}><option value="">Select captain…</option>{roster.filter(p=>lineupStarters.includes(String(p.id))).map(p=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no})</option>)}</select></div></div>
      <p className="font-bold mt-4 text-emerald-900">Starters: {lineupStarters.length}/11 • Subs: {lineupBench.length}/7 • GK in starters: {roster.filter(p=>lineupStarters.includes(String(p.id))&&p.pos==="GK").length} (must be 1)</p>
      {roster.length===0 ? <p className="hint mt-2">No players registered yet for this team — register players first.</p> : <div className="grid sm:grid-cols-2 gap-2 mt-2 max-h-[340px] overflow-y-auto pr-1">{roster.map(p=>{ const isS=lineupStarters.includes(String(p.id)); const isB=lineupBench.includes(String(p.id)); return <label key={p.id} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm border-2 ${isS?"border-emerald-600 bg-emerald-50":isB?"border-amber-400 bg-amber-50":"border-slate-300 bg-white"}`}><span className="flex-1 min-w-0 [overflow-wrap:anywhere]"><b>{p.name}</b> <span className="text-slate-500">#{p.no} • {p.pos}</span></span><span className="flex items-center gap-1"><input type="checkbox" checked={isS} onChange={()=>{ if(isS) setLineupStarters(lineupStarters.filter(x=>x!==String(p.id))); else if(lineupStarters.length<11) setLineupStarters([...lineupStarters,String(p.id)]); }} className="!w-5 !p-0" aria-label={`Starter ${p.name}`}/> XI</span><span className="flex items-center gap-1"><input type="checkbox" checked={isB} onChange={()=>{ if(isB) setLineupBench(lineupBench.filter(x=>x!==String(p.id))); else if(lineupBench.length<7) setLineupBench([...lineupBench,String(p.id)]); }} className="!w-5 !p-0" aria-label={`Bench ${p.name}`}/> SUB</span></label>; })}</div>}
      {lineupError && <p className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 mt-3">{lineupError}</p>}
      <button onClick={saveLineup} disabled={busy} className="w-full font-bold py-4 rounded-xl text-white text-lg bg-emerald-700 hover:bg-emerald-800 mt-4">{busy?"Saving…":"CONFIRM LINEUP"}</button>
    </section>;
  }
  // Inline Result Entry
  function renderResultForm(){
    if(!resultFixture) return null;
    const f=resultFixture; const allRoster=[...effectiveRoster(f.home),...effectiveRoster(f.away)];
    return <section id="result-form" className="light-form mt-4">
      <div className="flex justify-between gap-2"><div><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Enter Result — {getTeam(f.home)?.name} vs {getTeam(f.away)?.name}</h3><p className="hint">{f.division} • {f.ward} Ward • Pool {f.group} • {fmtDate(f.date)} • {f.time} • {f.venue} • 👁 {getViews(`fixture-${f.id}`)} views</p></div><button onClick={()=>setResultFixture(null)} className="bg-slate-100 border px-3 py-1 rounded-lg text-sm font-bold text-slate-800 h-fit">Close</button></div>
      <div className="grid grid-cols-2 gap-4 mt-4"><div><label>Home Score *</label><input inputMode="numeric" value={resultScore.hg} onChange={e=>setResultScore({...resultScore,hg:e.target.value})} placeholder="0"/></div><div><label>Away Score *</label><input inputMode="numeric" value={resultScore.ag} onChange={e=>setResultScore({...resultScore,ag:e.target.value})} placeholder="0"/></div></div>
      <h4 className="font-bold mt-5 text-[#0B3D2E]">Scorers — one row per goal</h4>
      <div className="space-y-2 mt-2">{resultScorers.map((s:any,i:number)=><div key={i} className="flex gap-2 flex-wrap"><select value={s.teamId} onChange={e=>{ const arr=[...resultScorers]; arr[i]={...arr[i],teamId:Number(e.target.value),player:"",playerId:""}; setResultScorers(arr); }} className="flex-1 min-w-[140px]"><option value={f.home}>{getTeam(f.home)?.name}</option><option value={f.away}>{getTeam(f.away)?.name}</option></select><select value={s.playerId} onChange={e=>{ const roster=effectiveRoster(Number(s.teamId||f.home)); const p=roster.find(x=>String(x.id)===e.target.value); const arr=[...resultScorers]; arr[i]={...arr[i],playerId:e.target.value,player:p?.name||"",pos:p?.pos||"FW"}; setResultScorers(arr); }} className="flex-1 min-w-[140px]"><option value="">Pick scorer…</option>{effectiveRoster(Number(s.teamId||f.home)).map((p:any)=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no})</option>)}</select><input aria-label="Scorer minute" placeholder="Minute" inputMode="numeric" value={s.minute} onChange={e=>{ const arr=[...resultScorers]; arr[i]={...arr[i],minute:e.target.value}; setResultScorers(arr); }} className="!w-[90px]"/><button onClick={()=>setResultScorers(resultScorers.filter((_,j)=>j!==i))} className="bg-slate-100 border px-3 rounded-lg font-bold">Remove</button></div>)}
      {resultScorers.length===0 && <p className="hint">No scorers yet.</p>}</div>
      <button onClick={()=>setResultScorers([...resultScorers,{teamId:f.home,player:"",playerId:"",pos:"FW",minute:"45"}])} className="mt-2 bg-slate-100 border px-3 py-2 rounded-lg text-sm font-bold">+ Add scorer</button>
      <h4 className="font-bold mt-5 text-[#0B3D2E]">Cards</h4>
      <div className="space-y-2 mt-2">{resultCards.map((c:any,i:number)=><div key={i} className="flex gap-2 flex-wrap"><select value={c.teamId} onChange={e=>{ const arr=[...resultCards]; arr[i]={...arr[i],teamId:Number(e.target.value),player:"",playerId:""}; setResultCards(arr); }} className="flex-1 min-w-[140px]"><option value={f.home}>{getTeam(f.home)?.name}</option><option value={f.away}>{getTeam(f.away)?.name}</option></select><select value={c.playerId} onChange={e=>{ const roster=effectiveRoster(Number(c.teamId||f.home)); const p=roster.find(x=>String(x.id)===e.target.value); const arr=[...resultCards]; arr[i]={...arr[i],playerId:e.target.value,player:p?.name||""}; setResultCards(arr); }} className="flex-1 min-w-[140px]"><option value="">Pick player…</option>{effectiveRoster(Number(c.teamId||f.home)).map((p:any)=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no})</option>)}</select><select value={c.type} onChange={e=>{ const arr=[...resultCards]; arr[i]={...arr[i],type:e.target.value}; setResultCards(arr); }} className="!w-[120px]"><option>Yellow</option><option>Red</option></select><input aria-label="Card minute" placeholder="Minute" inputMode="numeric" value={c.minute} onChange={e=>{ const arr=[...resultCards]; arr[i]={...arr[i],minute:e.target.value}; setResultCards(arr); }} className="!w-[90px]"/><button onClick={()=>setResultCards(resultCards.filter((_,j)=>j!==i))} className="bg-slate-100 border px-3 rounded-lg font-bold">Remove</button></div>)}
      {resultCards.length===0 && <p className="hint">No cards yet.</p>}</div>
      <button onClick={()=>setResultCards([...resultCards,{teamId:f.home,player:"",playerId:"",type:"Yellow",minute:"45"}])} className="mt-2 bg-slate-100 border px-3 py-2 rounded-lg text-sm font-bold">+ Add card</button>
      <h4 className="font-bold mt-5 text-[#0B3D2E]">MVP / Man of the Match</h4>
      <div className="grid sm:grid-cols-2 gap-4 mt-2"><div><label>MVP — from both teams</label><select value={resultMvp} onChange={e=>setResultMvp(e.target.value)}><option value="">Not yet selected</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no}) — {getTeam(p.teamId)?.name}</option>)}</select></div><div><label>MVP Reason</label><input value={resultMvpReason} onChange={e=>setResultMvpReason(e.target.value)} placeholder="Why was this player MVP?"/></div></div>
      {resultError && <p className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 mt-3">{resultError}</p>}
      <button onClick={saveResultForm} disabled={busy} className="w-full font-bold py-4 rounded-xl text-white text-lg bg-emerald-700 hover:bg-emerald-800 mt-4">{busy?"Saving…":"SAVE RESULT"}</button>
    </section>;
  }
  // Full Matchsheet renderer
  function renderMatchsheet(f:Fixture){
    const h=getTeam(f.home); const a=getTeam(f.away); const l=lineupsByFixture[f.id]||{}; const ms=matchsheetData(f); const r=results[f.id]; const live=liveByFixture[f.id]; const ex=extrasMap[f.id]||{}; const rosterH=effectiveRoster(f.home); const rosterA=effectiveRoster(f.away); const allRoster=[...rosterH,...rosterA];
    const byIdH=new Map(rosterH.map(p=>[String(p.id),p])); const byIdA=new Map(rosterA.map(p=>[String(p.id),p]));
    const renderSide=(side:any,byId:any,team:any)=>{ if(!side) return <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm font-bold text-amber-900">Lineup not confirmed yet for {team?.name}. <button onClick={()=>openLineup(f, team?.id===f.home?"home":"away")} className="mt-2 bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold block">Set Lineup — {team?.name}</button></div>; const starters=(side.starters||[]).map((id:string)=>byId.get(String(id))).filter(Boolean); const bench=(side.bench||[]).map((id:string)=>byId.get(String(id))).filter(Boolean); const passportFor=(p:any)=>{ const rec=players.find((x:any)=>String(x.id)===String(p.id)); return rec?.value?.passportStatus||"Not Submitted"; }; return <div><p className="text-xs font-bold tracking-widest">STARTING XI • {side.formation} • Passport: ✓ = Received</p><table><tbody>{starters.map((p:any)=>{ const ps=passportFor(p); return <tr key={p.id}><td className="font-bold">{p.no}</td><td>{p.pos}</td><td className="font-semibold [overflow-wrap:anywhere]">{p.name} {String(side.captain)===String(p.id)&&<span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">(C)</span>}</td><td>{ps==="Received"?"✓ Received":"⏳ "+ps}</td></tr>; })}</tbody></table><p className="text-xs font-bold tracking-widest mt-3">SUBSTITUTES</p><table><tbody>{bench.map((p:any)=>{ const ps=passportFor(p); return <tr key={p.id}><td className="font-bold">{p.no}</td><td>{p.pos}</td><td className="[overflow-wrap:anywhere]">{p.name}</td><td>{ps==="Received"?"✓ Received":"⏳ "+ps}</td></tr>; })}</tbody></table><p className="text-sm mt-3"><b>Coach:</b> {getCoachName(team)}</p></div>; };
    const mvp = ex.mvp;
    return <div className="bg-[#F6F1DF] text-black rounded-3xl p-5 sm:p-8 mt-4">
      <p className="text-xs font-bold tracking-[.25em]">MULAMA SUPER CUP - 5TH EDITION • HON MULAM CUP 5TH EDITION 2026 • OFFICIAL MATCHSHEET • Season: 1 Dec 2026 - 24 Jan 2027</p>
      <p className="text-xs font-bold mt-1">Presented under the leadership of HON. ABDULAZIZ MULAMA • ONE COMMUNITY. ONE DREAM. ONE TROPHY!</p>
      <div className="flex justify-between flex-wrap gap-2"><h3 className="font-display text-3xl font-extrabold uppercase mt-1">Matchsheet — Match {f.matchNo}</h3><span className="text-sm font-bold bg-white border px-3 py-1 rounded-full h-fit">👁 {getViews(`fixture-${f.id}`)} views</span></div>
      <p className="text-sm">{f.division} Division • {f.ward} Ward • Stage: {f.stage} • {f.group==="RR"?"Round Robin":`Pool ${f.group}`} • {f.round} • {fmtDate(f.date)} • {f.time} • {f.venue}</p>
      {/* SCORE */}
      <div className="bg-white rounded-2xl p-4 border mt-4"><h4 className="font-bold">SCORE</h4><div className="flex items-center justify-between gap-3 mt-2 flex-wrap"><div className="text-center"><p className="font-bold [overflow-wrap:anywhere]">{h?.name}</p><p className="text-xs">HOME</p></div><div className="font-display text-5xl font-extrabold">{live?`${live.hg} – ${live.ag}`:r?`${r.hg} – ${r.ag}`:"– : –"}</div><div className="text-center"><p className="font-bold [overflow-wrap:anywhere]">{a?.name}</p><p className="text-xs">AWAY</p></div></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm"><p className="bg-slate-50 rounded-xl p-3"><b>Half-Time Score</b><br/>{ex.ht?`${ex.ht.hg} – ${ex.ht.ag}`:"Not recorded"}</p><p className="bg-slate-50 rounded-xl p-3"><b>Full-Time Score</b><br/>{r?`${r.hg} – ${r.ag}`:"Not yet"}</p><p className="bg-slate-50 rounded-xl p-3"><b>Penalty Shootout</b><br/>{ex.penalties?`${ex.penalties.hg} – ${ex.penalties.ag}`:"— (only if draw in knockout)"}</p><p className="bg-slate-50 rounded-xl p-3"><b>Match Status</b><br/>{live?`LIVE ${live.minute}'` : r?fixtureStatus(f) : fixtureStatus(f)}</p></div></div>
      {/* GOALS */}
      <div className="bg-white rounded-2xl p-4 border mt-4"><h4 className="font-bold">GOALS</h4>{(r?.scorers||[]).length ? <table><thead><tr><th>Minute</th><th>Player</th><th>Team</th><th>Jersey</th></tr></thead><tbody>{(r.scorers||[]).map((s:any,i:number)=>{ const pl=allRoster.find(p=>String(p.id)===String(s.playerId)); return <tr key={i}><td>{s.minute}&apos;</td><td className="font-semibold">{s.player}</td><td>{getTeam(Number(s.teamId))?.name}</td><td>{pl?.no||"—"}</td></tr>; })}</tbody></table> : <p className="text-sm text-black/60 mt-1">No goals recorded yet.</p>}</div>
      {/* CARDS */}
      <div className="bg-white rounded-2xl p-4 border mt-4"><h4 className="font-bold">CARDS</h4>{(r?.cards||[]).length ? <table><thead><tr><th>Minute</th><th>Player</th><th>Team</th><th>Card</th></tr></thead><tbody>{(r.cards||[]).map((c:any,i:number)=><tr key={i}><td>{c.minute}&apos;</td><td className="font-semibold">{c.player}</td><td>{getTeam(Number(c.teamId))?.name}</td><td>{c.type||"Yellow"}</td></tr>)}</tbody></table> : <p className="text-sm text-black/60 mt-1">No cards recorded yet.</p>}</div>
      {/* MINUTES */}
      <div className="bg-white rounded-2xl p-4 border mt-4"><h4 className="font-bold">MINUTES</h4><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-sm"><p className="bg-slate-50 rounded-xl p-3"><b>Kickoff</b><br/>{f.time}</p><p className="bg-slate-50 rounded-xl p-3"><b>Half-Time Minute</b><br/>45&apos;</p><p className="bg-slate-50 rounded-xl p-3"><b>Full-Time Minute</b><br/>90&apos;</p><p className="bg-slate-50 rounded-xl p-3"><b>Extra Time</b><br/>{ex.extraTime||"—"}</p></div><h5 className="font-bold mt-3">Substitution Log</h5>{(ex.substitutions||[]).length ? <table><thead><tr><th>Minute</th><th>Player Off</th><th>Player On</th><th>Team</th></tr></thead><tbody>{ex.substitutions.map((s:any,i:number)=><tr key={i}><td>{s.minute}&apos;</td><td>{s.offName}</td><td>{s.onName}</td><td>{getTeam(Number(s.teamId))?.name}</td></tr>)}</tbody></table> : <p className="text-sm text-black/60">No substitutions recorded.</p>}</div>
      {/* MVP */}
      <div className="bg-[#0B3D2E] text-white rounded-2xl p-5 mt-4"><p className="text-xs font-bold tracking-[.25em]">MAN OF THE MATCH / MVP</p>{mvp ? <div className="mt-2"><p className="font-display text-3xl font-extrabold uppercase">⭐ {mvp.player}</p><p className="text-sm">Team: {getTeam(Number(mvp.teamId))?.name} • {mvp.reason||"Outstanding performance"}</p></div> : <p className="font-bold mt-2">MVP: Not yet selected</p>}</div>
      {/* LINEUPS */}
      <div className="grid sm:grid-cols-2 gap-4 mt-4"><div className="bg-white rounded-2xl p-4 border"><h4 className="font-display text-xl font-extrabold uppercase [overflow-wrap:anywhere]">{h?.name} (Home)</h4><p className="text-xs">{h?.ward} Ward • Pool {h?.group}</p>{renderSide(l.home,byIdH,h)}</div><div className="bg-white rounded-2xl p-4 border"><h4 className="font-display text-xl font-extrabold uppercase [overflow-wrap:anywhere]">{a?.name} (Away)</h4><p className="text-xs">{a?.ward} Ward • Pool {a?.group}</p>{renderSide(l.away,byIdA,a)}</div></div>
      {/* OFFICIALS */}
      <div className="bg-white rounded-2xl p-4 border mt-4"><h4 className="font-bold">Officials — Real Team Officials</h4><div className="grid sm:grid-cols-2 gap-3 mt-2 text-sm"><div><p className="font-bold">{h?.name} Officials</p>{getOfficials(h).length ? getOfficials(h).map((o,i)=><p key={i}>{o.role}: <b>{o.name}</b> {admin?`• ${o.phone}`:""} • {o.status||"Pending"}</p>) : <p className="text-black/60">No officials registered yet — team is Incomplete.</p>}</div><div><p className="font-bold">{a?.name} Officials</p>{getOfficials(a).length ? getOfficials(a).map((o,i)=><p key={i}>{o.role}: <b>{o.name}</b> {admin?`• ${o.phone}`:""} • {o.status||"Pending"}</p>) : <p className="text-black/60">No officials registered yet — team is Incomplete.</p>}</div></div><div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm"><p><b>Referee</b><br/>{ms.referee}</p><p><b>Match Commissioner</b><br/>{ms.commissioner}</p><p><b>Assistant Referees</b><br/>AR1 + AR2 (assigned)</p></div><div className="grid sm:grid-cols-3 gap-4 mt-6 text-sm"><div><p className="border-t-2 border-black pt-2">Home Captain signature</p></div><div><p className="border-t-2 border-black pt-2">Away Captain signature</p></div><div><p className="border-t-2 border-black pt-2">Referee signature</p></div></div></div>
      {/* INLINE MATCH EVENTS + MVP + MINUTES */}
      <div className="bg-white rounded-2xl p-4 border mt-4"><h4 className="font-bold">Match Events — Add Goal / Card / Substitution (Inline)</h4><p className="text-xs text-black/60">Admin only. Events update Score / Goals / Cards / Minutes instantly.</p><div className="grid sm:grid-cols-3 gap-3 mt-3"><div><label className="text-sm font-bold block">Event Type</label><select value={matchEventForm.type} onChange={e=>setMatchEventForm({...matchEventForm,type:e.target.value})}><option>Goal</option><option>Card</option><option>Substitution</option></select></div><div><label className="text-sm font-bold block">Team</label><select value={matchEventForm.teamId||String(f.home)} onChange={e=>setMatchEventForm({...matchEventForm,teamId:e.target.value})}><option value={f.home}>{h?.name}</option><option value={f.away}>{a?.name}</option></select></div><div><label className="text-sm font-bold block">Minute</label><input inputMode="numeric" value={matchEventForm.minute} onChange={e=>setMatchEventForm({...matchEventForm,minute:e.target.value})} placeholder="45"/></div></div>
      {matchEventForm.type!=="Substitution" ? <div className="grid sm:grid-cols-2 gap-3 mt-3"><div><label className="text-sm font-bold block">Player</label><select value={matchEventForm.playerId} onChange={e=>setMatchEventForm({...matchEventForm,playerId:e.target.value})}><option value="">Pick player…</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no}) — {getTeam(p.teamId)?.name}</option>)}</select></div>{matchEventForm.type==="Card" && <div><label className="text-sm font-bold block">Card</label><select value={matchEventForm.cardType} onChange={e=>setMatchEventForm({...matchEventForm,cardType:e.target.value})}><option>Yellow</option><option>Red</option></select></div>}</div> : <div className="grid sm:grid-cols-2 gap-3 mt-3"><div><label className="text-sm font-bold block">Player Off</label><select value={matchEventForm.offPlayerId} onChange={e=>setMatchEventForm({...matchEventForm,offPlayerId:e.target.value})}><option value="">Pick player off…</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no})</option>)}</select></div><div><label className="text-sm font-bold block">Player On</label><select value={matchEventForm.onPlayerId} onChange={e=>setMatchEventForm({...matchEventForm,onPlayerId:e.target.value})}><option value="">Pick player on…</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no})</option>)}</select></div></div>}
      <button onClick={()=>addMatchEvent(f)} disabled={busy||!admin} className="mt-3 bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl">ADD EVENT</button>{!admin && <p className="text-xs text-black/60 mt-1">Admin only — open Admin tab, PIN 1234.</p>}</div>
      <div className="grid md:grid-cols-2 gap-4 mt-4"><div className="bg-white rounded-2xl p-4 border"><h4 className="font-bold">Save MVP</h4><label className="text-sm font-bold block mt-2">MVP Player</label><select value={mvpForm.playerId} onChange={e=>setMvpForm({...mvpForm,playerId:e.target.value})}><option value="">Pick MVP…</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no}) — {getTeam(p.teamId)?.name}</option>)}</select><label className="text-sm font-bold block mt-2">MVP Reason</label><input value={mvpForm.reason} onChange={e=>setMvpForm({...mvpForm,reason:e.target.value})} placeholder="Why MVP?"/><button onClick={()=>saveMvpForFixture(f)} disabled={busy||!admin} className="mt-3 w-full bg-[#0B3D2E] text-white font-bold py-3 rounded-xl">SAVE MVP</button></div>
      <div className="bg-white rounded-2xl p-4 border"><h4 className="font-bold">Save Minutes / Half-Time / Penalties</h4><div className="grid grid-cols-2 gap-3 mt-2"><div><label className="text-sm font-bold block">HT Home</label><input inputMode="numeric" value={minutesForm.htHg} onChange={e=>setMinutesForm({...minutesForm,htHg:e.target.value})} placeholder="0"/></div><div><label className="text-sm font-bold block">HT Away</label><input inputMode="numeric" value={minutesForm.htAg} onChange={e=>setMinutesForm({...minutesForm,htAg:e.target.value})} placeholder="0"/></div><div><label className="text-sm font-bold block">Penalties Home</label><input inputMode="numeric" value={minutesForm.penHg} onChange={e=>setMinutesForm({...minutesForm,penHg:e.target.value})} placeholder="0"/></div><div><label className="text-sm font-bold block">Penalties Away</label><input inputMode="numeric" value={minutesForm.penAg} onChange={e=>setMinutesForm({...minutesForm,penAg:e.target.value})} placeholder="0"/></div></div><label className="text-sm font-bold block mt-2">Extra Time (e.g. 30 mins)</label><input value={minutesForm.extraTime} onChange={e=>setMinutesForm({...minutesForm,extraTime:e.target.value})} placeholder="e.g. 30 mins or —"/><button onClick={()=>saveMinutesForFixture(f)} disabled={busy||!admin} className="mt-3 w-full bg-[#0B3D2E] text-white font-bold py-3 rounded-xl">SAVE MINUTES</button></div></div>
      {renderLineupBuilder()}
    </div>;
  }

  return (
    <div data-safe-area-inset-root style={{boxSizing:'border-box',paddingTop:'var(--safe-area-inset-top)'}} className="min-h-screen bg-[var(--ink)] text-[var(--text)] overflow-x-clip">
      <header className="bg-[#0B3D2E] border-b-2 sticky top-[var(--safe-area-inset-top)] z-30" style={{borderColor:accent}} data-safe-area-sticky-top>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full grid place-items-center shrink-0 text-black" style={{background:accent}}><Trophy size={24}/></div>
            <div className="min-w-0"><p className="font-display font-extrabold leading-none text-[clamp(1.15rem,3.8vw,1.85rem)] uppercase tracking-tight [overflow-wrap:anywhere]">MULAMA SUPER CUP <span style={{color:accent}}>- 5TH EDITION</span></p><p className="text-[11px] sm:text-xs text-white font-bold">HON MULAM CUP 5TH EDITION 2026 • Presented under the leadership of HON. ABDULAZIZ MULAMA</p><p className="text-[11px] sm:text-xs text-[#B9CBC1]">Kimilili Constituency • 4 Wards • {totalRegistered} Registered • 140 Slots • Men {menCount}/80 • Women {womenCount}/60 • 1 Dec 2026 — 24 Jan 2027</p><p className="text-xs font-bold text-white mt-0.5">👁 {totalViews} viewers <span className="text-[#B9CBC1] font-normal">• Total views across portal</span></p></div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${admin?"text-black":"bg-white/10"}`} style={admin?{background:accent}:{}}>{admin?<Unlock size={13}/>:<Lock size={13}/>} {admin?"Admin":"Viewer"}</span>
            <button onClick={()=>setTab("admin")} className="font-bold text-xs sm:text-sm px-3 py-2 rounded-lg text-black" style={{background:accent}}>{admin?"Admin Panel":"Enter Admin"}</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold tracking-widest text-[#B9CBC1]">DIVISION:</span>
          <div className="flex gap-1 bg-black/25 p-1 rounded-full" role="tablist" aria-label="Division switcher">
            {(["Men","Women","All"] as Division[]).map(d=><button key={d} onClick={()=>setDivision(d)} className={`px-4 py-1.5 rounded-full text-sm font-bold ${division===d?"text-black":"text-white hover:bg-white/10"}`} style={division===d?{background:d==="Women"?"#EC4899":d==="Men"?"#F5C518":"#fff"}:{}}>{d==="All"?"All Divisions":d==="Men"?`Men's Division (${menCount}/80)`:`Women's Division (${womenCount}/60)`}</button>)}
          </div>
          <span className="text-xs text-[#B9CBC1]">Men {menCount}/80 • Women {womenCount}/60 • Total {totalRegistered}/140 • Confirmed {confirmedCount} • Pending {pendingCount} • 👁 {totalViews} viewers</span>
        </div>
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 pb-3 flex gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`tab-btn px-3.5 py-2 rounded-full text-sm font-semibold ${tab===t.id?"text-white":"bg-white/10 hover:bg-white/20"}`} style={tab===t.id?{background:accent}:{}}>{t.label}</button>)}
        </nav>
      </header>

      {notice && <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-4"><div className="bg-[#102A21] border rounded-xl px-4 py-3 text-sm flex gap-2" style={{borderColor:accent}}><CheckCircle2 className={accentText} size={18}/><span className="[overflow-wrap:anywhere]">{notice}</span><button className="ml-auto" onClick={()=>setNotice("")}><X size={16}/></button></div></div>}
      {loadError && <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-3"><div className="text-xs text-amber-200 bg-amber-950/60 border border-amber-800 rounded-lg px-3 py-2">{loadError}</div></div>}

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pb-16">
        {tab==="home" && (
          <div>
            <section className="mt-5 rounded-3xl overflow-hidden border-2 border-[#C9A227] relative" style={{backgroundImage:"linear-gradient(135deg, #ffffff 0%, #E6F2EB 55%, #F6F8F3 100%)"}}>
              <div className="absolute inset-0 bg-white/85" aria-hidden="true" />
              <div className="relative p-5 sm:p-10">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] via-[#C9A227] to-[#0B7A43]" />
              <p className="font-bold tracking-[.22em] text-xs uppercase mt-4 text-[#1E3A8A]">Kimilili Constituency • 4 Wards • Ward Pools to Sub-County Finals</p>
              <div className="mt-3 bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl">Presented under the leadership of HON. ABDULAZIZ MULAMA</div>
              <div className="mt-3 inline-flex items-center gap-2 bg-[#C9A227] text-black font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-full">KICK-OFF: 1 DECEMBER 2026 • Tuesday • 09:00 • Kimilili Stadium</div>
              <div className="mt-2 inline-flex items-center gap-2 bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-full">Registration Fee: KES 1,000 per team <span className="font-semibold">• Payable to Treasurer</span></div>
              <p className="mt-3 text-xs sm:text-sm font-bold tracking-[.18em] uppercase text-[#111827]">5th Edition • {totalRegistered} Registered / 140 Slots • Men {menCount}/80 • Women {womenCount}/60 • 2 Months • Kimilili Constituency • 4 Wards • 👁 {totalViews} viewers</p>
              <h1 className="font-display font-extrabold uppercase leading-[.92] mt-3 text-[#111827] text-[clamp(2.4rem,9vw,5.6rem)]">MULAMA SUPER CUP<br/><span className="text-[#1E3A8A]">- 5TH EDITION</span></h1>
              <p className="mt-2 text-base font-bold text-[#111827]">HON MULAM CUP 5TH EDITION 2026</p>
              <p className="mt-2 font-extrabold text-[#1E3A8A]">ONE COMMUNITY. ONE DREAM. ONE TROPHY!</p>
              <p className="mt-1 font-bold text-[#0B7A43]">MULAMA SUPER CUP - WHERE TALENT MEETS OPPORTUNITY!</p>
              <p className="mt-2 text-sm text-[#111827]">Kimilili Constituency • 4 Wards • {totalRegistered} Registered Teams of 140 Slots • Ward Pools to Sub-County Finals. Registration Fee: KES 1,000 — Payable to Treasurer.</p>
              <p className="mt-4 max-w-2xl text-[#DCE8DF] text-sm sm:text-base">Stage 1 — Ward Stage: each ward runs its own pools and knockout. Pools form from confirmed teams only. Stage 2 — Sub-County: Top 3 Men + Top 2 Women per ward qualify (12 Men, 8 Women).</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={()=>setTab("wards")} className="font-bold px-5 py-3 rounded-xl text-black" style={{background:accent}}>Explore Wards <ChevronRight className="inline" size={16}/></button>
                <button onClick={()=>setTab("subcounty")} className="bg-white/10 border border-white/20 font-bold px-5 py-3 rounded-xl">Sub-County Finals</button>
                <button onClick={()=>setTab("register")} className="bg-white/10 border border-white/20 font-bold px-5 py-3 rounded-xl">Register a Team</button>
                <button onClick={()=>setTab("standings")} className="bg-white/10 border border-white/20 font-bold px-5 py-3 rounded-xl">Standings</button>
                <button onClick={()=>setTab("admin")} className="bg-white/10 border border-white/20 font-bold px-5 py-3 rounded-xl">Admin (PIN 1234)</button>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
                <div className="bg-black/25 rounded-2xl p-3"><p className="text-3xl font-display font-extrabold" style={{color:accent}}>{cd.d}</p><p className="text-xs text-[#B9CBC1]">DAYS TO KICK-OFF</p></div>
                <div className="bg-black/25 rounded-2xl p-3"><p className="text-3xl font-display font-extrabold">{String(cd.h).padStart(2,"0")}<span style={{color:accent}}>:{String(cd.m).padStart(2,"0")}</span></p><p className="text-xs text-[#B9CBC1]">HRS : MINS</p></div>
                <div className="bg-black/25 rounded-2xl p-3"><p className="text-3xl font-display font-extrabold">{cd.s}s</p><p className="text-xs text-[#B9CBC1]">SECONDS</p></div>
                <div className="bg-black/25 rounded-2xl p-3"><p className="text-3xl font-display font-extrabold">{playedCount}<span className="text-base text-[#B9CBC1]">/{fixtures.length}</span></p><p className="text-xs text-[#B9CBC1]">WARD POOL MATCHES PLAYED</p></div>
              </div>
              <p className="mt-4 text-sm font-bold">Kick-off: Tuesday 1 December 2026, 09:00 • Kimilili Stadium • Men {groupPlayed("Men")}/{groupTotal("Men")} • Women {groupPlayed("Women")}/{groupTotal("Women")}</p>
              <p className="mt-2 text-sm font-bold">Registration Deadline: 22/11/2026 • 👁 {totalViews} viewers</p>
              <p className="mt-1 text-sm text-[#111827] font-bold">{totalRegistered} Teams Registered ({menCount} Men + {womenCount} Ladies) • {140-totalRegistered} slots still open • Pending: {pendingCount}</p>
              </div>
            </section>
            <section className="mt-6 bg-white border-2 border-[#C9A227] rounded-3xl p-5 sm:p-6 shadow-sm" aria-label="Official Poster">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] via-[#C9A227] to-[#0B7A43]" />
              <h2 className="font-display text-3xl font-extrabold uppercase text-[#111827] mt-3">Official Poster</h2>
              <p className="text-sm text-[#4B5563] mt-1">MULAMA SUPER CUP - 5TH EDITION • HON MULAM CUP 5TH EDITION 2026 • Presented under the leadership of HON. ABDULAZIZ MULAMA</p>
              <div className="w-full max-w-3xl mx-auto rounded-2xl border-2 border-[#C9A227] mt-4 p-6 sm:p-10 text-center bg-gradient-to-br from-[#0B3D2E] via-[#164E3A] to-[#1E3A8A] text-white shadow-lg">
                <p className="text-xs sm:text-sm font-extrabold tracking-[.3em] text-[#F5C518]">KIMILILI CONSTITUENCY • 2026</p>
                <h3 className="font-display text-4xl sm:text-6xl font-extrabold uppercase leading-none mt-4">MULAMA<br/>SUPER CUP</h3>
                <p className="text-xl sm:text-2xl font-extrabold text-[#F5C518] mt-2">5TH EDITION</p>
                <p className="mt-5 font-bold">ONE COMMUNITY. ONE DREAM. ONE TROPHY!</p>
                <p className="mt-2 text-sm text-white/90">Presented under the leadership of HON. ABDULAZIZ MULAMA</p>
                <p className="mt-5 inline-block rounded-full bg-[#F5C518] text-black px-4 py-2 text-sm font-extrabold">KICK-OFF: 1 DECEMBER 2026 • 09:00</p>
              </div>
              <p className="text-center text-sm font-bold mt-3">ONE COMMUNITY. ONE DREAM. ONE TROPHY! • MULAMA SUPER CUP - WHERE TALENT MEETS OPPORTUNITY!</p>
            </section>
            <section className="mt-6 bg-white border-2 border-[#C9A227] rounded-3xl p-5 sm:p-6 shadow-sm" aria-label="Prizes and Awards">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] via-[#C9A227] to-[#0B7A43]" />
              <h2 className="font-display text-3xl font-extrabold uppercase text-[#111827] mt-3">Prizes &amp; Awards</h2>
              <p className="text-sm text-[#4B5563] mt-1">Team prizes from the official poster. Knockout cards also show what each position wins.</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border-2 border-[#C9A227] rounded-2xl overflow-hidden"><div className="bg-[#1E3A8A] text-white px-4 py-3"><h3 className="font-display text-2xl font-extrabold uppercase">Boys Category</h3><p className="text-xs">Total: KES 750,000</p></div><div className="table-wrap"><table><thead><tr><th>Position</th><th>Prize</th></tr></thead><tbody>{PRIZES.Men.map(r=><tr key={r.pos}><td className="font-bold">{r.pos}</td><td className="font-extrabold text-[#1E3A8A]">{r.amount}</td></tr>)}</tbody></table></div></div>
                <div className="border-2 border-[#C9A227] rounded-2xl overflow-hidden"><div className="bg-[#0B7A43] text-white px-4 py-3"><h3 className="font-display text-2xl font-extrabold uppercase">Girls Category</h3><p className="text-xs">Total: KES 500,000</p></div><div className="table-wrap"><table><thead><tr><th>Position</th><th>Prize</th></tr></thead><tbody>{PRIZES.Women.map(r=><tr key={r.pos}><td className="font-bold">{r.pos}</td><td className="font-extrabold text-[#0B7A43]">{r.amount}</td></tr>)}</tbody></table></div></div>
              </div>
              <div className="mt-4 bg-[#FEF3C7] border-2 border-[#C9A227] rounded-2xl px-4 py-3 text-center"><p className="font-display text-2xl font-extrabold uppercase text-[#111827]">Total Prize Pool: Boys KES 750,000 + Girls KES 500,000 = KES 1,250,000</p></div>
              <p className="text-sm text-[#4B5563] mt-3">How it works: Final winner = 1st • Final runner-up = 2nd • 3rd-Place Playoff winner = 3rd • 3rd-Place Playoff loser / losing semi-finalist = 4th.</p>
            </section>
            <section className="mt-6 bg-white border-2 border-[#C9A227] rounded-3xl p-5 sm:p-6 shadow-sm" aria-label="Individual Awards">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] via-[#C9A227] to-[#0B7A43]" />
              <h2 className="font-display text-3xl font-extrabold uppercase text-[#111827] mt-3">Individual Awards — Mombasa Trip</h2>
              <p className="text-sm font-bold text-[#111827] mt-1">Three outstanding individuals will each win an exclusive 3-day trip to Mombasa, including return air tickets!</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <div className="border-2 border-[#C9A227] rounded-2xl p-4"><p className="text-xs font-bold tracking-widest text-[#1E3A8A]">BEST PLAYER</p><p className="font-display text-xl font-extrabold uppercase mt-1 [overflow-wrap:anywhere]">{awardsMap["Best Player"]?.winnerName || "To be announced"}</p><p className="text-xs text-[#4B5563]">{awardsMap["Best Player"]?.winnerDetail || "Selected by Admin"}</p><p className="text-sm font-bold mt-2">✈️ 3-day trip to Mombasa, return air tickets included</p></div>
                <div className="border-2 border-[#C9A227] rounded-2xl p-4"><p className="text-xs font-bold tracking-widest text-[#1E3A8A]">BEST COACH</p><p className="font-display text-xl font-extrabold uppercase mt-1 [overflow-wrap:anywhere]">{awardsMap["Best Coach"]?.winnerName || "To be announced"}</p><p className="text-xs text-[#4B5563]">{awardsMap["Best Coach"]?.winnerDetail || "Selected by Admin"}</p><p className="text-sm font-bold mt-2">✈️ 3-day trip to Mombasa, return air tickets included</p></div>
                <div className="border-2 border-[#C9A227] rounded-2xl p-4"><p className="text-xs font-bold tracking-widest text-[#1E3A8A]">TOP SCORER</p><p className="font-display text-xl font-extrabold uppercase mt-1 [overflow-wrap:anywhere]">{awardsMap["Top Scorer"]?.winnerName || (scorers[0] ? `${scorers[0].player} (${scorers[0].goals} goals)` : "To be announced")}</p><p className="text-xs text-[#4B5563]">{awardsMap["Top Scorer"]?.winnerDetail || "Top Scorer leaderboard leader"}</p><p className="text-sm font-bold mt-2">✈️ 3-day trip to Mombasa, return air tickets included</p></div>
              </div>
              <button onClick={()=>setTab("scorers")} className="mt-4 font-bold text-sm text-[#1E3A8A] underline">View Top Scorer leaderboard →</button>
            </section>
            <section className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-[#C9A227] rounded-3xl p-5 shadow-sm"><div className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] via-[#C9A227] to-[#0B7A43]" /><h2 className="font-display text-2xl font-extrabold uppercase text-[#111827] mt-3">Registration &amp; Eligibility</h2><p className="font-bold mt-2">Registration Fee: KES 1,000 per team — Payable to Treasurer</p><ul className="mt-3 space-y-2 text-sm text-[#111827]"><li>✅ Participation is strictly open to players from Kimilili Sub-County.</li><li>✅ All players must be registered on the official tournament portal.</li><li>✅ Match balls will be provided.</li></ul><button onClick={()=>setTab("register")} className="mt-4 bg-[#1E3A8A] text-white font-bold px-4 py-2.5 rounded-xl">Register a Team — KES 1,000</button></div>
              <div className="bg-white border-2 border-[#C9A227] rounded-3xl p-5 shadow-sm"><div className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] via-[#C9A227] to-[#0B7A43]" /><h2 className="font-display text-2xl font-extrabold uppercase text-[#111827] mt-3">Team Uniforms</h2><p className="text-sm text-[#4B5563] mt-1">As shown on official poster:</p><div className="table-wrap mt-3"><table><thead><tr><th>Ward</th><th>Teams</th></tr></thead><tbody>{UNIFORM_ALLOC.map(u=><tr key={u.ward}><td className="font-bold">{u.ward}</td><td className="font-bold">{u.teams} Teams</td></tr>)}<tr><td className="font-extrabold">TOTAL</td><td className="font-extrabold">50 TEAMS</td></tr></tbody></table></div><p className="text-xs text-[#4B5563] mt-2">Uniform allocation as per official poster. Registered teams list on this portal is 94 teams - Admin to confirm uniform allocation for teams beyond the 50.</p></div>
            </section>
            <section className="mt-6 bg-white border border-[#DDE3DA] rounded-3xl p-5 sm:p-6 shadow-sm" aria-label="Kick-off countdown">
              <div className="flex flex-wrap justify-between gap-2 items-center"><div><h2 className="font-display text-3xl font-extrabold uppercase text-[#0B3D2E]">Kick-off Countdown</h2><p className="text-base text-[#4B5563]">Tuesday 1 December 2026 • 09:00 • Kimilili Stadium • Season: 1 Dec 2026 - 24 Jan 2027</p></div><span className="bg-[#C9A227] text-black font-extrabold text-sm px-3 py-1.5 rounded-full">KICK-OFF: 1 DECEMBER 2026</span></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
                <div className="bg-[#F6F8F3] border border-[#DDE3DA] rounded-2xl p-4"><p className="font-display text-4xl font-extrabold text-[#0B7A43]">{cd.d}</p><p className="text-sm font-bold text-[#4B5563]">DAYS</p></div>
                <div className="bg-[#F6F8F3] border border-[#DDE3DA] rounded-2xl p-4"><p className="font-display text-4xl font-extrabold text-[#0B7A43]">{String(cd.h).padStart(2,"0")}</p><p className="text-sm font-bold text-[#4B5563]">HOURS</p></div>
                <div className="bg-[#F6F8F3] border border-[#DDE3DA] rounded-2xl p-4"><p className="font-display text-4xl font-extrabold text-[#0B7A43]">{String(cd.m).padStart(2,"0")}</p><p className="text-sm font-bold text-[#4B5563]">MINUTES</p></div>
                <div className="bg-[#F6F8F3] border border-[#DDE3DA] rounded-2xl p-4"><p className="font-display text-4xl font-extrabold text-[#0B7A43]">{String(cd.s).padStart(2,"0")}</p><p className="text-sm font-bold text-[#4B5563]">SECONDS</p></div>
              </div>
              <p className="text-base text-[#4B5563] mt-3">Registration Deadline: 22/11/2026 • Ward pools in December • Ward knockouts in January • Sub-County Finals late January.</p>
            </section>
            <section className="mt-6 bg-[#122E24] border border-white/10 rounded-3xl p-5 sm:p-6">
              <div className="flex flex-wrap justify-between gap-2 items-center"><div><h2 className="font-display text-3xl font-extrabold uppercase">Registered Teams</h2><p className="text-sm text-[#B9CBC1]">Real registered teams only — no invented teams. Existing 94 teams start as “Incomplete - Officials Not Registered” until officials are added.</p></div><button onClick={()=>setTab("teams")} className="font-bold text-sm" style={{color:accent}}>View all teams →</button></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-center">
                <div className="bg-black/25 rounded-2xl p-4 min-w-0"><p className="font-display text-3xl sm:text-4xl font-extrabold" style={{color:"#F5C518"}}>{menCount}<span className="text-base text-[#B9CBC1]">/80</span></p><p className="text-[11px] sm:text-xs text-[#B9CBC1] mt-1">MEN REGISTERED</p><p className="text-xs mt-1">Kamukuywa 20/20 • Maeni 13/20 • Kimilili 20/20 • Kibingei 18/20</p></div>
                <div className="bg-black/25 rounded-2xl p-4 min-w-0"><p className="font-display text-3xl sm:text-4xl font-extrabold" style={{color:"#EC4899"}}>{womenCount}<span className="text-base text-[#B9CBC1]">/60</span></p><p className="text-[11px] sm:text-xs text-[#B9CBC1] mt-1">LADIES REGISTERED</p><p className="text-xs mt-1">Kamukuywa 6/15 • Maeni 3/15 • Kimilili 7/15 • Kibingei 7/15</p></div>
                <div className="bg-black/25 rounded-2xl p-4 min-w-0"><p className="font-display text-3xl sm:text-4xl font-extrabold">{totalRegistered}<span className="text-base text-[#B9CBC1]">/140</span></p><p className="text-[11px] sm:text-xs text-[#B9CBC1] mt-1">TOTAL REGISTERED</p><p className="text-xs mt-1">Confirmed {confirmedCount} • Pending {pendingCount} • 👁 {totalViews} viewers</p></div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {WARDS.map(ward=>{ const total = wardTotalFor(ward); const confirmed = allTeams.filter(t=>t.ward===ward && t.status==="Confirmed").length; const pending = allTeams.filter(t=>t.ward===ward && t.status==="Pending").length; return <div key={ward} className="bg-black/25 rounded-2xl p-4"><div className="flex justify-between text-sm"><b>{ward}</b><span>{total}/35</span></div><div className="h-2 bg-black/40 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#F5C518] rounded-full" style={{width:`${total/35*100}%`}}/></div><p className="text-xs text-[#B9CBC1] mt-2">Men {countFor(ward,"Men")}/20 • Women {countFor(ward,"Women")}/15</p><p className="text-xs text-[#B9CBC1]">Confirmed {confirmed} • Pending {pending} • Open slots {35-total}</p></div>; })}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 items-center text-sm"><span className="font-bold">Confirmed {confirmedCount}</span><span className="text-[#B9CBC1]">•</span><span className="font-bold text-amber-300">Pending {pendingCount}</span><span className="text-[#B9CBC1]">— Pending:</span>{pendingTeams.map(t=><span key={t.id} className="text-xs px-2 py-1 rounded-full bg-amber-400/20 text-amber-100">{t.name} — {t.ward} {t.division==="Women"?"Ladies":"Men"}</span>)}</div>
            </section>
            <section className="mt-6">
              <h2 className="font-display text-3xl font-extrabold uppercase">The 4 Wards of Kimilili Constituency</h2>
              <p className="text-sm text-[#B9CBC1] mt-1">Each ward runs its own pools, knockout and final.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                {WARDS.map(ward=>{ const menCountW = allTeams.filter(t=>t.ward===ward&&t.division==="Men").length; const womenCountW = allTeams.filter(t=>t.ward===ward&&t.division==="Women").length; const mChamp = wardBracket(ward,"Men").champion; const wChamp = wardBracket(ward,"Women").champion; return <button key={ward} onClick={()=>{ setWardTab(ward); setTab("wards"); }} className="text-left bg-[#122E24] border border-white/10 rounded-2xl p-4 hover:border-[#F5C518] transition"><p className="font-display text-2xl font-extrabold uppercase">{ward} Ward</p><p className="text-xs text-[#B9CBC1]">Kimilili Constituency • Bungoma County</p><div className="grid grid-cols-2 gap-2 mt-3 text-sm"><div className="bg-black/25 rounded-xl p-2"><b>{menCountW}/20</b><p className="text-xs text-[#B9CBC1]">Men teams</p></div><div className="bg-black/25 rounded-xl p-2"><b>{womenCountW}/15</b><p className="text-xs text-[#B9CBC1]">Women teams</p></div></div><p className="text-xs mt-3">Matches: <b>{wardPlayed(ward)}/{wardTotal(ward)}</b> played</p><p className="text-xs mt-1">Men Champion: <b>{mChamp?.name||"TBD"}</b></p><p className="text-xs mt-1">Women Champion: <b>{wChamp?.name||"TBD"}</b></p><p className="font-bold text-sm mt-3" style={{color:accent}}>Open {ward} →</p></button>; })}
              </div>
            </section>
            <section className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-[#122E24] border border-white/10 rounded-2xl p-5"><h3 className="font-bold">Sub-County Qualification Progress</h3><p className="text-sm text-[#B9CBC1] mt-1">Top 3 Men + Top 2 Women per ward qualify after Ward Finals.</p><div className="mt-3 space-y-3"><div><div className="flex justify-between text-sm"><b>Men</b><span>{menQualifiedTotal}/12 qualified</span></div><div className="h-2 bg-black/30 rounded-full mt-1 overflow-hidden"><div className="h-full bg-[#F5C518] rounded-full" style={{width:`${menQualifiedTotal/12*100}%`}}/></div></div><div><div className="flex justify-between text-sm"><b>Women</b><span>{womenQualifiedTotal}/8 qualified</span></div><div className="h-2 bg-black/30 rounded-full mt-1 overflow-hidden"><div className="h-full bg-[#EC4899] rounded-full" style={{width:`${womenQualifiedTotal/8*100}%`}}/></div></div></div><button onClick={()=>setTab("subcounty")} className="mt-4 font-bold text-sm" style={{color:accent}}>View Sub-County Finals →</button></div>
              <div className="bg-[#122E24] border border-white/10 rounded-2xl p-5"><h3 className="font-bold">How to use this portal — all forms inline</h3><p className="text-sm text-[#B9CBC1] mt-1">1. Register Team (Register tab, with Officials) • 2. Register Players (Players tab, pick a portal team) • 3. Set Lineup (Fixtures, inline) • 4. Matchsheet (Score / Goals / Cards / Minutes / MVP) • 5. Enter Result / Live Score (inline).</p><button onClick={()=>setTab("register")} className="mt-3 font-bold text-sm" style={{color:accent}}>Register a Team →</button></div>
            </section>
          </div>
        )}

        {tab==="wards" && (
          <section className="mt-5">
            <div className="flex flex-wrap justify-between gap-3 items-center"><div><h2 className="font-display text-3xl font-extrabold uppercase">Wards — Stage 1</h2><p className="text-sm text-[#B9CBC1]">Kimilili Constituency • Bungoma County • Each ward is independent.</p></div><div className="flex gap-1 bg-black/25 p-1 rounded-full flex-wrap">{["All",...WARDS].map(w=><button key={w} onClick={()=>setWardTab(w)} className={`px-3 py-1.5 rounded-full text-sm font-bold ${wardTab===w?"text-black":"text-white"}`} style={wardTab===w?{background:accent}:{}}>{w==="All"?"All Wards":w}</button>)}</div></div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><span className="text-xs font-bold tracking-widest text-[#B9CBC1]">DIVISION:</span>{(["Men","Women","All"] as Division[]).map(d=><button key={d} onClick={()=>setDivision(d)} className={`px-3 py-1.5 rounded-full text-sm font-bold ${division===d?"text-black":"bg-white/10"}`} style={division===d?{background:d==="Women"?"#EC4899":d==="Men"?"#F5C518":"#fff"}:{}}>{d}</button>)}</div>
            {wardTab==="All" && <div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">{WARDS.map(ward=>{ const mc=wardBracket(ward,"Men").champion; const wc=wardBracket(ward,"Women").champion; return <div key={ward} className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="font-display text-2xl font-extrabold uppercase">{ward}</p><p className="text-xs text-[#B9CBC1]">Men {countFor(ward,"Men")}/20 • Women {countFor(ward,"Women")}/15 • Matches {wardPlayed(ward)}/{wardTotal(ward)}</p><p className="text-sm mt-2">Men Champion: <b>{mc?.name||"TBD"}</b></p><p className="text-sm">Women Champion: <b>{wc?.name||"TBD"}</b></p><button onClick={()=>setWardTab(ward)} className="mt-3 font-bold text-sm" style={{color:accent}}>Open {ward} →</button></div>; })}</div>{(division==="All"?["Men","Women"]:[division]).map(div=><div key={div}>{qualificationTracker(div)}</div>)}</div>}
            {wardTab!=="All" && <div>
              <div className="mt-4 bg-[#122E24] border border-white/10 rounded-2xl p-5"><h3 className="font-display text-2xl font-extrabold uppercase">{wardTab} Ward</h3><p className="text-sm text-[#B9CBC1]">Men {countFor(wardTab,"Men")}/20 • Women {countFor(wardTab,"Women")}/15 • Matches {wardPlayed(wardTab)}/{wardTotal(wardTab)} played</p></div>
              {(division==="All"?["Men","Women"]:[division]).map(div=>(
                <div key={div}>
                  <h4 className="font-display text-2xl font-extrabold uppercase mt-6" style={{color:div==="Women"?"#EC4899":"#F5C518"}}>{wardTab} — {div} Pools &amp; Standings</h4>
                  <div className="bg-white text-black rounded-xl px-4 py-3 mt-2 font-bold text-sm">Format: {formatFor(div,wardTab,allTeams).label} • Path: {formatFor(div,wardTab,allTeams).path}</div>
                  <div className="grid lg:grid-cols-2 gap-4 mt-3">
                    {(poolsMap[`${div}-${wardTab}`]||[]).map(pool=><div key={pool.label} className="bg-[#122E24] border border-white/10 rounded-2xl overflow-hidden"><div className="px-4 py-3 flex justify-between bg-[#0B3D2E]"><h5 className="font-display font-extrabold text-xl">{wardTab} {div} — {pool.label==="RR"?"Round Robin":`Pool ${pool.label}`} ({pool.teams.length} teams)</h5><span className="text-xs text-[#B9CBC1]">Top 2 → Ward Knockout</span></div><div className="table-wrap"><table><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>{(standingsByPool[div]?.[wardTab]?.[pool.label]||[]).map((r,i)=>{ const qualified = i<2; return <tr key={r.team.id} className={qualified?"bg-emerald-500/10":""}><td>{i+1}</td><td className="font-semibold"><span className="inline-flex items-center gap-2"><span className="badge-initials w-6 h-6 rounded text-[10px] grid place-items-center text-black" style={{background:r.team.color}}>{r.team.initials}</span><span className="[overflow-wrap:anywhere]">{r.team.name}</span></span></td><td>{r.pl}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td><td>{r.gf}</td><td>{r.ga}</td><td>{r.gf-r.ga>0?`+${r.gf-r.ga}`:r.gf-r.ga}</td><td className="font-bold" style={{color:accent}}>{r.pts}</td></tr>; })}</tbody></table></div></div>)}
                  </div>
                  <div className="mt-4"><h4 className="font-bold">{wardTab} — {div} Teams</h4><div className="flex flex-wrap gap-1.5 mt-2">{allTeams.filter(t=>t.ward===wardTab&&t.division===div).sort((a,b)=>a.name.localeCompare(b.name)).map(t=><span key={t.id} className="text-xs px-2 py-1 rounded-full bg-white/10 inline-flex items-center gap-1.5"><button onClick={()=>{setSelectedTeam(t); setTab("teams");}} className="hover:underline">{t.name}{t.status==="Confirmed"&&t.group?` • Pool ${t.group}`:""}</button> {statusBadge(t.status)}</span>)}</div></div>
                  {renderWardKnockout(wardTab,div)}
                </div>
              ))}
              {qualificationTracker(division==="All"?"Men":division)}
              {division==="All" && qualificationTracker("Women")}
            </div>}
          </section>
        )}

        {tab==="subcounty" && (
          <section className="mt-5">
            <h2 className="font-display text-3xl font-extrabold uppercase">Sub-County Finals — Stage 2</h2>
            <p className="text-sm text-[#B9CBC1] mt-1">Only qualified teams appear here. Men: 12 teams • Women: 8 teams. Finals 24 Jan 2027.</p>
            <p className="text-sm font-bold mt-2">Prizes — Final winner = 1st • Runner-up = 2nd • 3rd-Place Playoff winner = 3rd • Losing semi-finalist = 4th. Boys: 300k / 200k / 150k / 100k • Girls: 200k / 150k / 100k / 50k • Total KES 1,250,000</p>
            <div className="flex flex-wrap gap-2 mt-3"><span className="text-xs font-bold tracking-widest text-[#B9CBC1]">DIVISION:</span>{(["Men","Women","All"] as Division[]).map(d=><button key={d} onClick={()=>setDivision(d)} className={`px-3 py-1.5 rounded-full text-sm font-bold ${division===d?"text-black":"bg-white/10"}`} style={division===d?{background:d==="Women"?"#EC4899":d==="Men"?"#F5C518":"#fff"}:{}}>{d}</button>)}</div>
            <div className="grid sm:grid-cols-2 gap-3 mt-4"><div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="font-bold">Men Qualification</p><p className="text-3xl font-display font-extrabold" style={{color:"#F5C518"}}>{menQualifiedTotal}/12</p></div><div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="font-bold">Women Qualification</p><p className="text-3xl font-display font-extrabold" style={{color:"#EC4899"}}>{womenQualifiedTotal}/8</p></div></div>
            {(division==="All"?["Men","Women"]:[division]).map(div=>(<div key={div}><h3 className="font-display text-2xl font-extrabold uppercase mt-6" style={{color:div==="Women"?"#EC4899":"#F5C518"}}>{div} — Sub-County</h3>{qualificationTracker(div)}{renderSubcountyBracket(div)}</div>))}
          </section>
        )}

        {tab==="teams" && (
          <section className="mt-5">
            {selectedTeam && (
              <div className="bg-[#122E24] border-2 rounded-3xl p-5 mb-5" style={{borderColor:accent}}>
                <div className="flex justify-between gap-3"><div className="flex gap-3"><span className="badge-initials w-14 h-14 rounded-2xl grid place-items-center text-xl shrink-0" style={{background:selectedTeam.color,color:readableOn(selectedTeam.color)}}>{selectedTeam.initials}</span><div><h3 className="font-display text-2xl font-extrabold uppercase leading-none [overflow-wrap:anywhere]">{selectedTeam.name}</h3><p className="text-sm text-[#B9CBC1] mt-1">Coach: {getCoachName(selectedTeam)} • {selectedTeam.ward} Ward • {selectedTeam.division} • {selectedTeam.status==="Confirmed"&&selectedTeam.group?`Pool ${selectedTeam.group}`:"Pool —"}{selectedTeam.homeGround ? ` • Home: ${selectedTeam.homeGround}` : ""}</p><p className="text-xs text-[#B9CBC1] mt-1">👁 {getViews(`team-${selectedTeam.id}`)} views • Squad: {(registeredPlayersByTeam[selectedTeam.id]||[]).length}/18 • Officials: {getOfficials(selectedTeam).length}/3</p><div className="mt-2 flex flex-wrap gap-1.5">{statusBadge(selectedTeam.status)}<span className={`text-xs font-bold px-2 py-1 rounded-full ${isComplete(selectedTeam)?"bg-emerald-500 text-white":"bg-amber-400 text-black"}`}>Registration Status: {registrationStatus(selectedTeam)}</span></div></div></div><button onClick={()=>setSelectedTeam(null)} className="bg-white/10 rounded-full w-9 h-9 grid place-items-center shrink-0"><X/></button></div>
                <div className="mt-4 bg-black/25 rounded-2xl p-4"><h4 className="font-bold">Team Officials — {getOfficials(selectedTeam).length}/3</h4>{getOfficials(selectedTeam).length ? <div className="grid sm:grid-cols-3 gap-2 mt-2">{getOfficials(selectedTeam).map((o,i)=><div key={i} className="bg-white/5 rounded-xl p-3 text-sm"><p className="font-bold">{o.name}</p><p className="text-[#B9CBC1]">{o.role} • {o.status||"Pending"}</p><p className="text-[#B9CBC1]">Phone: {admin?o.phone:maskPhone(o.phone)} • ID: {admin?o.idNo:maskIdNo(o.idNo)}</p></div>)}</div> : <p className="text-sm text-amber-200 mt-1">No officials yet — this team is Incomplete. Add officials below to complete registration.</p>}</div>
                <div className="light-form mt-4"><h4 className="font-display text-xl font-extrabold uppercase text-[#0B3D2E]">Add / Edit Officials — {selectedTeam.name}</h4><p className="hint">At least 1 official required, up to 3. Officials: {officialsEdit.filter(o=>o.name.trim()).length}/3. If Role = Coach, that person is shown as Team Coach everywhere.</p>
                  {[0,1,2].map(idx=><div key={idx} className="border-2 border-slate-300 rounded-xl p-3 mt-3"><p className="font-bold text-[#0B3D2E]">Official {idx+1}</p><div className="grid sm:grid-cols-2 gap-3 mt-2"><div><label>Full Name *</label><input value={officialsEdit[idx]?.name||""} onChange={e=>{ const a=[...officialsEdit]; a[idx]={...a[idx],name:e.target.value}; setOfficialsEdit(a); }} placeholder="Official full name"/></div><div><label>Role *</label><select value={officialsEdit[idx]?.role||"Coach"} onChange={e=>{ const a=[...officialsEdit]; a[idx]={...a[idx],role:e.target.value}; setOfficialsEdit(a); }}>{OFFICIAL_ROLES.map(r=><option key={r}>{r}</option>)}</select></div><div><label>Phone</label><input value={officialsEdit[idx]?.phone||""} onChange={e=>{ const a=[...officialsEdit]; a[idx]={...a[idx],phone:e.target.value}; setOfficialsEdit(a); }} placeholder="+254 700 000 000"/></div><div><label>ID No.</label><input value={officialsEdit[idx]?.idNo||""} onChange={e=>{ const a=[...officialsEdit]; a[idx]={...a[idx],idNo:e.target.value}; setOfficialsEdit(a); }} placeholder="ID / Birth cert"/></div></div></div>)}
                  {officialsEditError && <p className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 mt-3">{officialsEditError}</p>}
                  {officialsEditSuccess && <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2 mt-3">{officialsEditSuccess}</p>}
                  <button onClick={saveOfficialsEdit} disabled={busy} className="w-full font-bold py-3.5 rounded-xl text-white bg-emerald-700 mt-4">{busy?"Saving…":"SAVE OFFICIALS"}</button>
                </div>
                <h4 className="font-bold mt-5">Registered players — {(registeredPlayersByTeam[selectedTeam.id]||[]).length}/18</h4>
                {(registeredPlayersByTeam[selectedTeam.id]||[]).length===0 ? <p className="text-sm text-[#B9CBC1] bg-black/25 rounded-xl p-4 mt-2">No players registered yet. <button onClick={()=>setTab("players")} className="font-bold text-white underline">Register players →</button></p> : <div className="grid sm:grid-cols-2 gap-2 mt-2">{(registeredPlayersByTeam[selectedTeam.id]||[]).map((p:any)=><button key={p.id} onClick={()=>openPlayerProfile(p)} className="bg-black/25 rounded-xl px-3 py-2 flex justify-between text-sm text-left hover:bg-black/40"><span><b style={{color:accent}}>{p.jersey}.</b> {p.name}</span><span className="text-[#B9CBC1]">{p.position}</span></button>)}</div>}
                <h4 className="font-bold mt-5">Fixtures</h4>
                {selectedTeam.status==="Pending" ? <p className="text-sm text-amber-200 bg-amber-950/40 rounded-xl p-3 mt-2">Pending - cannot play until confirmed.</p> : <div className="space-y-2 mt-2">{fixtures.filter(f=>f.home===selectedTeam.id||f.away===selectedTeam.id).slice(0,7).map(f=>{ const r=results[f.id]; const opp=teamById.get(f.home===selectedTeam.id?f.away:f.home); return <div key={f.id} className="bg-black/25 rounded-xl px-3 py-2 flex justify-between gap-2 text-sm"><span>vs {opp?.name} • {fmtDate(f.date)} • {f.venue} • Pool {f.group} • 👁 {getViews(`fixture-${f.id}`)} watching</span><b>{r?`${r.hg}–${r.ag}`:"Scheduled"}</b></div>; })}</div>}
                <button onClick={()=>setSelectedTeam(null)} className="mt-5 w-full font-bold py-3 rounded-xl text-black" style={{background:accent}}>Close Team Detail</button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-3 text-[#B9CBC1]" size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search team or coach… try Bahai, Chesamis, Matili" className="pl-10"/></div>
              <select value={wardFilter} onChange={e=>setWardFilter(e.target.value)} className="w-[150px]"><option value="All">All Wards</option>{WARDS.map(w=><option key={w} value={w}>{w} Ward</option>)}</select>
              <select value={groupFilter} onChange={e=>setGroupFilter(e.target.value)} className="w-[130px]"><option>All</option>{["A","B","C","D"].map(g=><option key={g} value={g}>Pool {g}</option>)}</select>
              <select aria-label="Registration status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)} className="w-[170px]"><option value="All">All Statuses</option><option value="Confirmed">Confirmed</option><option value="Pending">Pending</option></select>
            </div>
            <p className="text-sm text-[#B9CBC1] mt-3">Showing <b className="text-white">{filteredTeams.length}</b> teams • Tap a card for squad, officials &amp; fixtures • 👁 Views on every card</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
              {filteredTeams.map(t=>{
                const st=(standingsByPool[t.division]?.[t.ward]?.[t.group]||[]).find(x=>x.team.id===t.id);
                const regCount=(registeredPlayersByTeam[t.id]||[]).length;
                const offs=getOfficials(t);
                return <div key={t.id} className="bg-[#122E24] border border-white/10 rounded-2xl p-4">
                  <button onClick={()=>{ setSelectedTeam(t); trackView(`team-${t.id}`,`Team ${t.name}`); }} className="text-left w-full">
                  <div className="flex gap-3"><span className="badge-initials w-12 h-12 rounded-xl grid place-items-center shrink-0" style={{background:t.color,color:readableOn(t.color)}}>{t.initials}</span><div className="min-w-0"><p className="font-bold leading-tight [overflow-wrap:anywhere]">{t.name}</p><p className="text-xs text-[#B9CBC1] [overflow-wrap:anywhere]">Coach: {getCoachName(t)} • {t.county}</p><div className="flex flex-wrap gap-1 mt-1"><span className="inline-block text-black text-[11px] font-bold px-2 py-0.5 rounded-full" style={{background:t.division==="Women"?"#EC4899":"#F5C518"}}>{t.division.toUpperCase()}</span><span className="inline-block bg-emerald-500/20 text-emerald-100 text-[11px] font-bold px-2 py-0.5 rounded-full">{t.ward} WARD</span>{t.status==="Confirmed"&&t.group?<span className="inline-block bg-white/10 text-[11px] font-bold px-2 py-0.5 rounded-full">POOL {t.group}</span>:<span className="inline-block bg-white/10 text-[11px] px-2 py-0.5 rounded-full">POOL —</span>}<span className="inline-block bg-white/10 text-[11px] px-2 py-0.5 rounded-full">Squad: {regCount}/18</span>{statusBadge(t.status)}</div><p className="text-xs mt-1">👁 {getViews(`team-${t.id}`)} views</p><p className={`text-xs font-bold mt-1 ${isComplete(t)?"text-emerald-300":"text-amber-300"}`}>Registration: {registrationStatus(t)}</p><p className="text-xs text-[#B9CBC1] mt-1">Officials: {offs.length}/3 {offs.length?`• ${offs.map(o=>`${o.name} (${o.role})`).join(", ")}`:"• None yet"}</p></div></div>
                  <div className="grid grid-cols-5 gap-1 mt-4 text-center text-xs"><div><p className="font-bold">{st?.w??0}</p><p className="text-[#B9CBC1]">W</p></div><div><p className="font-bold">{st?.d??0}</p><p className="text-[#B9CBC1]">D</p></div><div><p className="font-bold">{st?.l??0}</p><p className="text-[#B9CBC1]">L</p></div><div><p className="font-bold">{st?.gf??0}:{st?.ga??0}</p><p className="text-[#B9CBC1]">GF:GA</p></div><div><p className="font-bold" style={{color:accent}}>{st?.pts??0}</p><p className="text-[#B9CBC1]">PTS</p></div></div>
                  </button>
                  {t.status==="Pending" && admin && <button onClick={()=>confirmTeam(t)} disabled={busy} className="mt-3 w-full bg-amber-300 text-black font-bold py-2 rounded-lg text-sm">Confirm Team</button>}
                </div>;
              })}
            </div>
            {filteredTeams.length===0 && <p className="text-sm text-[#B9CBC1] mt-4 bg-[#122E24] rounded-2xl p-5">No teams match this filter.</p>}
          </section>
        )}

        {tab==="players" && (
          <section className="mt-5">
            {selectedPlayer && (()=>{ const v=selectedPlayer.value||{}; const team=getTeam(Number(v.teamId)); const st=playerStats[String(selectedPlayer.id)]||{goals:0,assists:0,cards:0,yellow:0,red:0,appearances:0,minutes:0}; const pStatus=v.passportStatus||"Not Submitted"; const matches=playerMatches[String(selectedPlayer.id)]||[]; return <div className="bg-[#122E24] border-2 rounded-3xl p-5 mb-5" style={{borderColor:accent}}><div className="flex justify-between gap-3"><div className="flex gap-3"><span className="w-16 h-16 rounded-full grid place-items-center font-display font-extrabold text-2xl shrink-0" style={{background:team?.color||"#F5C518",color:readableOn(team?.color||"#F5C518")}}>{initialsFor(v.name||"")}</span><div><p className="text-xs font-bold tracking-widest text-[#B9CBC1]">PLAYER PROFILE</p><h3 className="font-display text-2xl font-extrabold uppercase [overflow-wrap:anywhere]">{v.name}</h3><p className="text-sm text-[#B9CBC1]">{team?.name||"—"} • {team?.ward||"—"} Ward • Pool {team?.group||"—"} • {v.position} • {v.division} • 👁 {getViews(`player-${selectedPlayer.id}`)} views</p><p className="text-sm text-[#B9CBC1]">DOB: {v.dob||"—"} • Age: {ageFromDob(v.dob)??"—"} • Residence: {v.residence||"—"} • Birth Cert / ID: {admin?(v.idNo||"—"):maskIdNo(v.idNo)} • Phone: {admin?(v.phone||"—"):maskPhone(v.phone)}</p></div></div><button onClick={()=>setSelectedPlayer(null)} className="bg-white/10 rounded-full w-9 h-9 grid place-items-center shrink-0"><X/></button></div><div className="grid grid-cols-3 gap-2 mt-3 text-sm text-center"><p className="bg-black/25 rounded-xl p-3"><b className="block text-xl">{st.appearances}</b>Appearances</p><p className="bg-black/25 rounded-xl p-3"><b className="block text-xl" style={{color:accent}}>{st.goals}</b>Goals</p><p className="bg-black/25 rounded-xl p-3"><b className="block text-xl">{st.cards}</b>Cards</p></div><div className="mt-3"><h4 className="font-bold">Matches</h4>{matches.length===0?<p className="text-sm text-[#B9CBC1]">No matches recorded yet.</p>:<div className="space-y-1.5 mt-2">{matches.map((mm:any,i:number)=>{ const fx=mm.fixture; return <div key={i} className="bg-black/25 rounded-xl px-3 py-2 flex justify-between text-sm"><span>vs {teamById.get(fx.home===Number(v.teamId)?fx.away:fx.home)?.name} • {fmtDate(fx.date)}</span><b>{mm.result?`${mm.result.hg}–${mm.result.ag}`:"Scheduled"}</b></div>; })}</div>}</div><div className="flex gap-2 mt-4 flex-wrap">{admin&&!selectedPlayer.virtual&&<button onClick={()=>{ const p=selectedPlayer; setSelectedPlayer(null); openPlayerEdit(p); }} className="font-bold py-3 px-5 rounded-xl text-black" style={{background:accent}}>Edit Player</button>}<button onClick={()=>{ const t=getTeam(Number(v.teamId)); if(t){ setSelectedPlayer(null); setSelectedTeam(t); setTab("teams"); } }} className="bg-white/10 font-bold py-3 px-5 rounded-xl">View Team</button><button onClick={()=>setSelectedPlayer(null)} className="bg-white/10 font-bold py-3 px-5 rounded-xl">Close</button></div></div>; })()}
            <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl px-4 py-3 text-sm font-bold text-emerald-900">Fill all fields below and tap Add Player. Gender follows the team / division. No age limit — DOB is for profile / ID only. Jersey unique per team, max 18 players per team.</div>
            <div className="mt-4">
              <form onSubmit={handlePlayerSubmit} className="light-form space-y-4">
                <h2 className="font-display text-3xl font-extrabold uppercase flex items-center gap-2 text-[#0B3D2E]"><UserPlus style={{color:"#0B3D2E"}}/> Register Player - Hon Mulam Cup</h2>
                <p className="hint">All fields visible below. Division is set automatically from the team you pick.</p>
                <div><label>Full Name *</label><input value={playerForm.name} onChange={e=>setPlayerForm({...playerForm,name:e.target.value})} placeholder="e.g. Brian Kiprop"/></div>
                <div className="grid sm:grid-cols-2 gap-4"><div><label>Date of Birth *</label><input type="date" value={playerForm.dob} onChange={e=>setPlayerForm({...playerForm,dob:e.target.value})}/>{playerForm.dob&&<p className="hint mt-1">Age: {ageFromDob(playerForm.dob)}</p>}</div><div><label>Team * — ONLY the {allTeams.length} real teams in portal, grouped by Ward &gt; Division</label><select value={playerForm.teamId} onChange={e=>{ const tid=e.target.value; const tm=allTeams.find(t=>String(t.id)===tid); setPlayerForm({...playerForm,teamId:tid, division: tm?.division||playerForm.division, residence: playerForm.residence||tm?.ward||""}); }}><option value="">Select team…</option>{WARDS.map(w=>(["Men","Women"] as const).map(div=><optgroup key={`${w}-${div}`} label={`${w} Ward — ${div}`}>{allTeams.filter(t=>t.ward===w&&t.division===div).sort((a,b)=>a.name.localeCompare(b.name)).map(t=><option key={t.id} value={t.id}>{t.name}{t.group?` • Pool ${t.group}`:""} • {t.status}</option>)}</optgroup>))}</select><p className="hint mt-1">Team not listed? <button type="button" onClick={()=>setTab("register")} className="font-bold underline text-emerald-800">Register the team first.</button> No free-text / “Other” team entry.</p></div></div>
                <div className="grid sm:grid-cols-2 gap-4"><div><label>Position *</label><select value={playerForm.position} onChange={e=>setPlayerForm({...playerForm,position:e.target.value})}><option>GK</option><option>DF</option><option>MF</option><option>FW</option></select></div><div><label>Jersey Number (1–99) *</label><input type="number" min={1} max={99} inputMode="numeric" value={playerForm.jersey} onChange={e=>setPlayerForm({...playerForm,jersey:e.target.value})} placeholder="10"/></div></div>
                <div className="grid sm:grid-cols-2 gap-4"><div><label>Birth Cert No. / ID No. *</label><input value={playerForm.idNo} onChange={e=>setPlayerForm({...playerForm,idNo:e.target.value})} placeholder="Birth cert number or ID number"/></div><div><label>Residence *</label><input value={playerForm.residence} onChange={e=>setPlayerForm({...playerForm,residence:e.target.value})} placeholder="Estate / Village / Town"/></div></div>
                <div><label>Phone (optional)</label><input value={playerForm.phone} onChange={e=>setPlayerForm({...playerForm,phone:e.target.value})} placeholder="+254 700 000 000"/></div>
                <div className="grid sm:grid-cols-2 gap-4"><div><label>Passport Photo Status</label><select value={playerForm.passportStatus} onChange={e=>setPlayerForm({...playerForm,passportStatus:e.target.value})}><option>Received</option><option>Pending</option><option>Not Submitted</option></select><p className="hint mt-1">Photo status updates to Received after a successful photo selection.</p></div><div><label>Passport-size Photo (required where applicable)</label><input type="file" accept="image/*" capture="environment" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;setPlayerError("");setPlayerSuccess("");setBusy(true);try{const photo=await compressPassportPhoto(file);setPlayerForm(prev=>({...prev,passportRef:photo,passportStatus:"Received"}));setPlayerSuccess("Passport photo ready. Compressed image is under 1 MB and will be saved with this player.");}catch(err){setPlayerError(err instanceof Error?err.message:"Photo could not be processed.");e.target.value="";}finally{setBusy(false);}}}/><p className="hint mt-1">Choose a photo or use your device camera. It is resized and compressed to under 1 MB before saving.</p>{playerForm.passportRef.startsWith("data:image/")&&<img src={playerForm.passportRef} alt="Passport photo preview" className="mt-2 h-28 w-24 rounded-lg border object-cover"/>}</div></div>
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-3 font-bold text-emerald-900">Team squad: {playerForm.teamId ? `${players.filter((p:any)=>String(p.value?.teamId)===String(playerForm.teamId)).length}/18 players` : "Select a team to see its squad count"} • Division: {playerForm.teamId ? (allTeams.find(t=>String(t.id)===String(playerForm.teamId))?.division||playerForm.division) : "—"}</div>
                {playerError && <p className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 flex gap-2"><AlertTriangle size={16}/><span>{playerError}</span></p>}
                {playerSuccess && <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2 flex gap-2"><CheckCircle2 size={16}/><span>{playerSuccess}</span></p>}
                <button disabled={busy} className="w-full font-bold py-4 rounded-xl text-white text-lg bg-emerald-700 hover:bg-emerald-800">{busy?"Saving…":editingPlayer?"Save Player Changes":"ADD PLAYER"}</button>
                {editingPlayer && <button type="button" onClick={()=>openPlayerEdit(null)} className="w-full bg-slate-100 border border-slate-300 py-2.5 rounded-xl text-sm font-bold text-slate-800">Cancel edit</button>}
                <p className="hint text-center">Passport photos are compressed to under 1 MB before being saved with the player record.</p>
              </form>
            </div>
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-3 text-[#B9CBC1]" size={18}/><input value={playerSearch} onChange={e=>setPlayerSearch(e.target.value)} placeholder="Search player, team, residence or jersey…" className="pl-10"/></div>
                <select value={wardFilter} onChange={e=>setWardFilter(e.target.value)} className="w-[150px]"><option value="All">All Wards</option>{WARDS.map(w=><option key={w} value={w}>{w}</option>)}</select>
                <select value={playerTeam} onChange={e=>setPlayerTeam(e.target.value)} className="w-[180px]"><option value="All">All teams</option>{allTeams.filter(t=>division==="All"||t.division===division).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
                <select value={playerPos} onChange={e=>setPlayerPos(e.target.value)} className="w-[120px]"><option value="All">All positions</option><option>GK</option><option>DF</option><option>MF</option><option>FW</option></select>
              </div>
              <p className="text-sm text-[#B9CBC1] mt-3">Showing <b className="text-white">{filteredPlayers.length}</b> registered players • Tap a card for profile. {admin?"Admin can edit / delete.":"Switch to Admin to edit / delete."}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {filteredPlayers.map((p:any)=>{ const v=p.value||{}; const team=getTeam(Number(v.teamId)); const st=playerStats[String(p.id)]||{goals:0,assists:0,cards:0,yellow:0,red:0,appearances:0,minutes:0}; const pStatus=v.passportStatus||"Not Submitted"; const confirmed = playerConfirmMap[String(p.id)]==="Confirmed"; return <div key={p.id} className="bg-[#122E24] border border-white/10 rounded-2xl p-4">
                  <button onClick={()=>openPlayerProfile(p)} className="w-full text-left"><div className="flex gap-3"><span className="w-12 h-12 rounded-full grid place-items-center font-display font-extrabold shrink-0" style={{background:team?.color||"#E63946",color:readableOn(team?.color||"#E63946")}}>{initialsFor(v.name||"")}</span><div className="min-w-0 flex-1"><p className="font-bold [overflow-wrap:anywhere] flex items-center gap-2 flex-wrap">{v.name}<span title={`Passport photo: ${pStatus}`} className={`w-3 h-3 rounded-full shrink-0 ${passportDot(pStatus)}`}/>{confirmed?<span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Confirmed</span>:<span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.5 rounded-full">Pending</span>}</p><p className="text-xs text-[#B9CBC1] [overflow-wrap:anywhere]">{team?.name||"—"} • {team?.ward||"—"} Ward • Pool {team?.group||"—"} • {v.division} • Passport: {pStatus} • 👁 {getViews(`player-${p.id}`)} views</p><p className="text-xs text-[#B9CBC1]">Age {ageFromDob(v.dob)??"—"} • {v.gender} • {v.residence||"—"}</p><p className="text-xs text-[#B9CBC1]">Birth Cert / ID: {admin ? (v.idNo||"—") : maskIdNo(v.idNo)} • Phone: {admin?(v.phone||"—"):maskPhone(v.phone)}</p></div><span className="font-display text-2xl font-extrabold" style={{color:accent}}>#{v.jersey}</span></div></button>
                  <div className="flex gap-2 mt-3 text-xs flex-wrap"><span className="bg-white/10 px-2 py-1 rounded-full">{v.position}</span><span className="bg-white/10 px-2 py-1 rounded-full">{st.goals} goals</span><span className="bg-white/10 px-2 py-1 rounded-full">{st.cards} cards</span></div>
                  <div className="flex gap-2 mt-3"><button onClick={()=>openPlayerProfile(p)} className="flex-1 bg-white/10 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1"><Eye size={15}/> Profile</button>{admin&&<><button onClick={()=>openPlayerEdit(p)} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 text-black" style={{background:accent}}><Pencil size={15}/> Edit</button><button onClick={()=>confirmPlayerRecord(p)} disabled={busy} className="bg-emerald-500/20 text-emerald-100 px-3 py-2 rounded-lg text-sm font-bold">Confirm</button></>}</div>
                </div>; })}
                {filteredPlayers.length===0 && <p className="text-[#B9CBC1] text-sm bg-[#122E24] rounded-2xl p-5 sm:col-span-2">No registered players yet for this filter. Register the first player with the form above.</p>}
              </div>
            </div>
          </section>
        )}

        {tab==="fixtures" && (
          <section className="mt-5">
            <h2 className="font-display text-3xl font-extrabold uppercase">Fixtures — All Wards</h2>
            <p className="text-sm text-[#B9CBC1] mt-1">Grouped by Ward &gt; Division &gt; Pool. Every fixture shows 👁 watching. Tap Set Lineup / Matchsheet / Enter Result — forms appear inline on this page.</p>
            {renderLineupBuilder()}
            {renderResultForm()}
            {matchsheetFixture && <div className="mt-4"><div className="flex justify-between"><h3 className="font-bold">Matchsheet view — inline</h3><button onClick={()=>setMatchsheetFixture(null)} className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold">Close</button></div>{renderMatchsheet(matchsheetFixture)}</div>}
            <div className="flex flex-wrap gap-2 mt-3">
              <select value={wardFilter} onChange={e=>setWardFilter(e.target.value)} className="w-[150px]"><option value="All">All Wards</option>{WARDS.map(w=><option key={w} value={w}>{w} Ward</option>)}</select>
              <select value={division} onChange={e=>setDivision(e.target.value as Division)} className="w-[140px]"><option>Men</option><option>Women</option><option>All</option></select>
              <select value={poolFilter} onChange={e=>setPoolFilter(e.target.value)} className="w-[140px]"><option value="All">All Pools</option>{["A","B","C","D","RR"].map(p=><option key={p} value={p}>{p==="RR"?"Round Robin":`Pool ${p}`}</option>)}</select>
              <select value={weekFilter} onChange={e=>setWeekFilter(e.target.value)} className="w-[160px]"><option>All</option>{[1,2,3,4,5].map(w=><option key={w} value={w}>Matchday {w}</option>)}</select>
              <span className="text-sm text-[#B9CBC1] self-center">{filteredFixtures.length} fixtures</span>
            </div>
            {(wardFilter==="All"?WARDS:[wardFilter]).map(ward=>(
              <div key={ward} className="mt-6"><h3 className="font-display text-2xl font-extrabold uppercase">{ward} Ward</h3>
                {(division==="All"?["Men","Women"]:[division]).map(div=>(
                  <div key={div} className="mt-3"><div className="bg-white text-black rounded-xl px-3 py-2 font-bold text-sm">Format: {formatFor(div,ward,allTeams).label} • Path: {formatFor(div,ward,allTeams).path} • {div} • {ward}</div>
                    {(poolsMap[`${div}-${ward}`]||[]).filter(pool=>poolFilter==="All"||pool.label===poolFilter).map(pool=>{ const list=filteredFixtures.filter(f=>f.ward===ward&&f.division===div&&f.group===pool.label); if(!list.length) return null; return <div key={pool.label} className="mt-3"><h4 className="font-bold">{div} — {pool.label==="RR"?"Round Robin":`Pool ${pool.label}`} ({list.length} fixtures)</h4><div className="grid lg:grid-cols-2 gap-3 mt-2">{list.map(f=>{ const h=teamById.get(f.home)!; const a=teamById.get(f.away)!; const r=results[f.id]; const live=liveByFixture[f.id]; const ex=extrasMap[f.id]; return <article key={f.id} className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><div className="flex justify-between gap-2 text-xs"><span className="font-bold">{fmtDate(f.date)} • {f.time} • {f.venue}</span><span className="px-2 py-0.5 rounded-full font-bold bg-white/10">{live?"LIVE":fixtureStatus(f)}</span></div><div className="flex items-center justify-between gap-2 mt-3"><div className="flex-1 min-w-0"><p className="font-bold [overflow-wrap:anywhere]">{h.name}</p><p className="text-xs text-[#B9CBC1]">Home • Pool {f.group} • Coach: {getCoachName(h)}</p></div><div className="font-display text-2xl font-extrabold bg-black/30 px-3 py-1 rounded-lg whitespace-nowrap">{live?`${live.hg} – ${live.ag}`:r?`${r.hg} – ${r.ag}`:"– : –"}</div><div className="flex-1 min-w-0 text-right"><p className="font-bold [overflow-wrap:anywhere]">{a.name}</p><p className="text-xs text-[#B9CBC1]">Away • Pool {f.group} • Coach: {getCoachName(a)}</p></div></div><p className="text-xs text-[#B9CBC1] mt-2">👁 {getViews(`fixture-${f.id}`)} watching • {ex?.mvp?`MVP: ${ex.mvp.player}`:"MVP: Not yet selected"} • {f.division} • {f.ward} Ward • Match {f.matchNo}</p><div className="flex flex-wrap gap-2 mt-3"><button onClick={()=>openLineup(f,"home")} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-bold">Set Lineup</button><button onClick={()=>{setMatchsheetFixture(f); trackView(`fixture-${f.id}`,`Fixture ${f.id}`);}} className="px-3 py-2 rounded-lg text-xs font-bold text-black" style={{background:accent}}>Matchsheet</button><button onClick={()=>{ if(admin) openResult(f); else setNotice("Only Admin can enter results. Open Admin tab, PIN 1234."); }} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-bold">Enter Result</button>{!live && !r && admin && <button onClick={()=>startLive(f)} className="bg-red-500 px-3 py-2 rounded-lg text-xs font-bold text-white">Start Match</button>}</div></article>; })}</div></div>; })}
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {tab==="livescore" && (
          <section className="mt-5">
            <h2 className="font-display text-3xl font-extrabold uppercase flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/> Live Score</h2>
            <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-5 mt-3 text-center"><p className="font-display text-4xl font-extrabold">👁 {totalViews} watching live</p><p className="text-sm text-[#B9CBC1]">Live viewers across the portal • {Object.keys(liveByFixture).length} match(es) live now</p></div>
            <p className="text-sm text-[#B9CBC1] mt-3">Admin: Start Match, then pick scorer + minute + ADD GOAL, pick player + ADD CARD, set Minute, pick MVP, then END MATCH. {!admin && "Switch to Admin (PIN 1234) to control live matches."}</p>
            <h3 className="font-bold mt-5 text-xl">LIVE NOW</h3>
            {Object.keys(liveByFixture).length===0 ? <div className="bg-[#122E24] border border-white/10 rounded-2xl p-5 mt-2"><p className="font-bold text-lg">No match live right now</p><p className="text-sm text-[#B9CBC1] mt-1">Next upcoming: {(()=>{ const next=fixtures.find(f=>!results[f.id]&&!liveByFixture[f.id]); return next?`${teamById.get(next.home)?.name} vs ${teamById.get(next.away)?.name} • ${fmtDate(next.date)} • ${next.time} • ${next.venue}`:"No upcoming fixture"; })()}</p>{admin && fixtures.find(f=>!results[f.id]&&!liveByFixture[f.id]) && <button onClick={()=>{ const n=fixtures.find(f=>!results[f.id]&&!liveByFixture[f.id]); if(n) startLive(n); }} disabled={busy} className="mt-3 font-bold px-5 py-3 rounded-xl text-black" style={{background:accent}}>Start Demo Live Match</button>}</div> : <div className="grid lg:grid-cols-2 gap-3 mt-2">{Object.values(liveByFixture).map((live:any)=>{ const f=fixtures.find(x=>x.id===live.fixtureId); if(!f) return null; const h=teamById.get(f.home)!; const a=teamById.get(f.away)!; const allRoster=[...effectiveRoster(f.home),...effectiveRoster(f.away)]; const ex=extrasMap[f.id]; return <article key={f.id} className="bg-[#122E24] border-2 border-red-500 rounded-2xl p-4"><div className="flex justify-between"><span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">● LIVE • {live.minute}&apos;</span><span className="text-xs text-[#B9CBC1]">{f.ward} • {f.division} • {f.venue} • 👁 {getViews(`fixture-${f.id}`)} watching</span></div><div className="flex items-center justify-between gap-2 mt-3"><div className="flex-1"><p className="font-bold text-lg">{h.name}</p><p className="text-xs text-[#B9CBC1]">Coach: {getCoachName(h)}</p></div><div className="font-display text-4xl font-extrabold">{live.hg} – {live.ag}</div><div className="flex-1 text-right"><p className="font-bold text-lg">{a.name}</p><p className="text-xs text-[#B9CBC1]">Coach: {getCoachName(a)}</p></div></div><p className="text-xs text-[#B9CBC1] mt-2">Scorers: {(live.scorers||[]).length?live.scorers.map((s:any)=>`${s.player} ${s.minute}'`).join(" • "):"No goals yet"} • Cards: {(live.cards||[]).length||0} • MVP: {ex?.mvp?.player||"Not yet selected"}</p>
            {admin && <div className="light-form mt-3 space-y-3"><h4 className="font-bold text-[#0B3D2E]">Live Controls — Inline</h4><div className="grid sm:grid-cols-3 gap-2"><div><label>Goal Scorer</label><select value={liveGoalDraft[f.id]?.playerId||""} onChange={e=>setLiveGoalDraft({...liveGoalDraft,[f.id]:{playerId:e.target.value,minute:liveGoalDraft[f.id]?.minute||String(live.minute)}})}><option value="">Pick scorer…</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} (#{p.no}) — {getTeam(p.teamId)?.name}</option>)}</select></div><div><label>Minute</label><input inputMode="numeric" value={liveGoalDraft[f.id]?.minute||String(live.minute)} onChange={e=>setLiveGoalDraft({...liveGoalDraft,[f.id]:{playerId:liveGoalDraft[f.id]?.playerId||"",minute:e.target.value}})} /></div><div className="flex items-end"><button onClick={()=>addLiveGoal(f)} disabled={busy} className="w-full bg-emerald-700 text-white font-bold py-2.5 rounded-lg">ADD GOAL</button></div></div>
            <div className="grid sm:grid-cols-3 gap-2"><div><label>Card Player</label><select value={liveCardDraft[f.id]?.playerId||""} onChange={e=>setLiveCardDraft({...liveCardDraft,[f.id]:{playerId:e.target.value,type:liveCardDraft[f.id]?.type||"Yellow",minute:liveCardDraft[f.id]?.minute||String(live.minute)}})}><option value="">Pick player…</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} — {getTeam(p.teamId)?.name}</option>)}</select></div><div><label>Card Type</label><select value={liveCardDraft[f.id]?.type||"Yellow"} onChange={e=>setLiveCardDraft({...liveCardDraft,[f.id]:{playerId:liveCardDraft[f.id]?.playerId||"",type:e.target.value,minute:liveCardDraft[f.id]?.minute||String(live.minute)}})}><option>Yellow</option><option>Red</option></select></div><div className="flex items-end"><button onClick={()=>addLiveCard(f)} disabled={busy} className="w-full bg-amber-400 text-black font-bold py-2.5 rounded-lg">ADD CARD</button></div></div>
            <div className="grid sm:grid-cols-3 gap-2"><div><label>Minute</label><input aria-label="Set minute" placeholder="Minute" inputMode="numeric" value={liveMinuteDraft[f.id]??String(live.minute)} onChange={e=>setLiveMinuteDraft({...liveMinuteDraft,[f.id]:e.target.value})} /></div><div><label>MVP</label><select value={liveMvpDraft[f.id]||""} onChange={e=>setLiveMvpDraft({...liveMvpDraft,[f.id]:e.target.value})}><option value="">Pick MVP…</option>{allRoster.map(p=><option key={p.id} value={String(p.id)}>{p.name} — {getTeam(p.teamId)?.name}</option>)}</select></div><div className="flex items-end gap-2"><button onClick={()=>updateLiveMinute(f,"minuteSet")} disabled={busy} className="flex-1 bg-slate-200 border font-bold py-2.5 rounded-lg">Set Minute</button><button onClick={()=>saveLiveMvp(f)} disabled={busy} className="flex-1 bg-[#0B3D2E] text-white font-bold py-2.5 rounded-lg">Save MVP</button></div></div>
            <div className="flex gap-2"><button onClick={()=>updateLiveMinute(f,"minutePlus")} disabled={busy} className="bg-slate-200 border font-bold py-2 px-3 rounded-lg">Minute +1</button><button onClick={()=>openLineup(f,"home")} className="bg-slate-200 border font-bold py-2 px-3 rounded-lg">Set Lineup</button></div>
            {endingLiveId===f.id ? <div className="flex gap-2 flex-wrap items-center"><input aria-label="Final home goals" placeholder="Final Home" inputMode="numeric" value={endLiveScore.hg} onChange={e=>setEndLiveScore({...endLiveScore,hg:e.target.value})} className="!w-[120px]"/><input aria-label="Final away goals" placeholder="Final Away" inputMode="numeric" value={endLiveScore.ag} onChange={e=>setEndLiveScore({...endLiveScore,ag:e.target.value})} className="!w-[120px]"/><button onClick={()=>endLive(f)} disabled={busy} className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Confirm END MATCH</button><button onClick={()=>setEndingLiveId(null)} className="bg-slate-200 border px-3 py-2 rounded-lg text-sm font-bold">Cancel</button></div> : <button onClick={()=>{ setEndingLiveId(f.id); setEndLiveScore({hg:String(live.hg),ag:String(live.ag)}); }} className="w-full bg-red-500 text-white font-bold py-3 rounded-xl text-sm">END MATCH (Live → Full Time)</button>}
            </div>}</article>; })}</div>}
            {renderResultForm()}
            <h3 className="font-bold mt-6 text-xl">Today&apos;s Fixtures</h3>
            <div className="grid lg:grid-cols-2 gap-3 mt-2">{fixtures.filter(f=>!results[f.id]).slice(0,12).map(f=>{ const h=teamById.get(f.home)!; const a=teamById.get(f.away)!; const live=liveByFixture[f.id]; return <article key={f.id} className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="text-xs text-[#B9CBC1]">{fmtDate(f.date)} • {f.time} • {f.venue} • {f.ward} • {f.division} • 👁 {getViews(`fixture-${f.id}`)} watching</p><div className="flex justify-between items-center mt-2 gap-2"><p className="font-bold flex-1 [overflow-wrap:anywhere]">{h.name}</p><b>{live?`${live.hg} – ${live.ag} • ${live.minute}'`:"vs"}</b><p className="font-bold flex-1 text-right [overflow-wrap:anywhere]">{a.name}</p></div><div className="flex gap-2 mt-3 flex-wrap"><button onClick={()=>{setMatchsheetFixtureId(f.id); setTab("matchsheet");}} className="px-3 py-2 rounded-lg text-xs font-bold text-black" style={{background:accent}}>Matchsheet</button><button onClick={()=>openLineup(f,"home")} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-bold">Set Lineup</button>{admin && !live && <button onClick={()=>startLive(f)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold">Start Match</button>}{admin && <button onClick={()=>openResult(f)} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-bold">Enter Result</button>}</div></article>; })}</div>
          </section>
        )}

        {tab==="matchsheet" && (
          <section className="mt-5">
            <h2 className="font-display text-3xl font-extrabold uppercase">Matchsheet</h2>
            <p className="text-sm text-[#B9CBC1] mt-1">Pick a match below to see its official matchsheet with Score, Goals, Cards, Minutes, MVP, Officials and Lineups — all visible. Inline Add Event / MVP / Minutes forms are inside the sheet.</p>
            <p className="text-sm font-bold mt-2">👁 {totalViews} viewers • Matchsheet page views: {getViews(`page-matchsheet`)}</p>
            <div className="mt-3"><label className="text-sm font-bold">Select Match</label><select value={matchsheetFixtureId} onChange={e=>{ setMatchsheetFixtureId(e.target.value); const fx=fixtures.find(x=>x.id===e.target.value); if(fx) trackView(`fixture-${fx.id}`,`Fixture ${fx.id}`); }}><option value="">Select a match…</option>{fixtures.map(f=><option key={f.id} value={f.id}>Match {f.matchNo} • {teamById.get(f.home)?.name} vs {teamById.get(f.away)?.name} • {fmtDate(f.date)} • {f.ward} • {f.division} • {f.group==="RR"?"Round Robin":`Pool ${f.group}`}</option>)}</select></div>
            {(()=>{ const f=fixtures.find(x=>x.id===matchsheetFixtureId); if(!f) return <p className="text-sm text-[#B9CBC1] mt-4 bg-[#122E24] rounded-2xl p-5">Select a match above to view its matchsheet.</p>; return renderMatchsheet(f); })()}
            <div className="grid md:grid-cols-2 gap-4 mt-6"><div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><h3 className="font-bold">Matchsheets Ready (both lineups confirmed) — {fixtures.filter(f=>lineupsByFixture[f.id]?.home&&lineupsByFixture[f.id]?.away).length}</h3><div className="space-y-1.5 mt-2 text-sm">{fixtures.filter(f=>lineupsByFixture[f.id]?.home&&lineupsByFixture[f.id]?.away).slice(0,20).map(f=><button key={f.id} onClick={()=>setMatchsheetFixtureId(f.id)} className="block w-full text-left bg-black/25 rounded-lg px-3 py-2 hover:bg-black/40">Match {f.matchNo} • {teamById.get(f.home)?.name} vs {teamById.get(f.away)?.name} • {fmtDate(f.date)} • 👁 {getViews(`fixture-${f.id}`)}</button>)}{fixtures.filter(f=>lineupsByFixture[f.id]?.home&&lineupsByFixture[f.id]?.away).length===0 && <p className="text-[#B9CBC1]">No matchsheets ready yet — confirm both lineups for a fixture.</p>}</div></div><div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><h3 className="font-bold">Matchsheets Pending — {fixtures.filter(f=>!(lineupsByFixture[f.id]?.home&&lineupsByFixture[f.id]?.away)).length}</h3><div className="space-y-1.5 mt-2 text-sm">{fixtures.filter(f=>!(lineupsByFixture[f.id]?.home&&lineupsByFixture[f.id]?.away)).slice(0,20).map(f=><button key={f.id} onClick={()=>setMatchsheetFixtureId(f.id)} className="block w-full text-left bg-black/25 rounded-lg px-3 py-2 hover:bg-black/40">Match {f.matchNo} • {teamById.get(f.home)?.name} vs {teamById.get(f.away)?.name} • {!lineupsByFixture[f.id]?.home&&!lineupsByFixture[f.id]?.away?"No lineups":!lineupsByFixture[f.id]?.home?"Home missing":"Away missing"}</button>)}</div></div></div>
          </section>
        )}

        {tab==="matchday" && (
          <section className="mt-5">
            <div className="flex flex-wrap gap-2 items-center">
              <select value={weekFilter} onChange={e=>setWeekFilter(e.target.value)} className="w-[160px]"><option>All</option>{[1,2,3,4,5].map(w=><option key={w} value={w}>Matchday {w}</option>)}</select>
              <select value={wardFilter} onChange={e=>setWardFilter(e.target.value)} className="w-[150px]"><option value="All">All Wards</option>{WARDS.map(w=><option key={w} value={w}>{w} Ward</option>)}</select>
              <select value={fixtureGroup} onChange={e=>setFixtureGroup(e.target.value)} className="w-[140px]"><option>All</option>{["A","B","C","D"].map(g=><option key={g} value={g}>Pool {g}</option>)}</select>
              <select value={venueFilter} onChange={e=>setVenueFilter(e.target.value)} className="w-[190px]"><option>All</option>{VENUES.map(v=><option key={v}>{v}</option>)}</select>
              <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} className="w-[170px]"/>
              <button onClick={()=>{setDateFilter("");}} className="bg-white/10 px-3 py-2 rounded-lg text-sm font-bold">Clear date</button>
              <span className="text-sm text-[#B9CBC1]">{filteredFixtures.length} fixtures • Stage: Ward Pool • Confirmed teams only</span>
              <div className="ml-auto flex gap-2 flex-wrap">
                {admin && <button onClick={handleReset} disabled={busy} className="bg-white/10 border border-white/20 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1"><RotateCcw size={15}/> Reset</button>}
                <button onClick={handleSimulateMatchday} disabled={busy||weekFilter==="All"} className="font-bold px-4 py-2 rounded-lg text-sm text-black flex items-center gap-1" style={{background:accent}}><Sparkles size={15}/> {busy?"Working…":"Simulate Matchday"}</button>
                <button onClick={handleSimulate} disabled={busy} className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-sm font-bold">Simulate All</button>
              </div>
            </div>
            {simulateResult && <div className="mt-3 bg-[#102A21] border border-white/15 rounded-xl p-3 text-sm">Simulated weeks saved: <b>{simulateResult.saved}</b> • Remaining: <b>{simulateResult.remaining}</b> {simulateResult.error && <span className="text-red-300">• Error: {simulateResult.error}</span>}</div>}
            {renderLineupBuilder()}
            {renderResultForm()}
            {matchsheetFixture && <div className="mt-4"><div className="flex justify-between"><h3 className="font-bold">Matchsheet view — inline</h3><button onClick={()=>setMatchsheetFixture(null)} className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold">Close</button></div>{renderMatchsheet(matchsheetFixture)}</div>}
            <div className="grid lg:grid-cols-2 gap-3 mt-3">
              {filteredFixtures.slice(0,120).map(f=>{
                const h=teamById.get(f.home)!, a=teamById.get(f.away)!; const r=results[f.id]; const status=fixtureStatus(f); const ex=extrasMap[f.id];
                return <article key={f.id} className="bg-[#122E24] border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between gap-2 text-xs text-[#B9CBC1] flex-wrap"><span className="flex items-center gap-1 flex-wrap"><span className="px-2 py-0.5 rounded-full font-bold text-black" style={{background:f.division==="Women"?"#EC4899":"#F5C518"}}>{f.division.toUpperCase()}</span> <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-100 font-bold">{f.ward} WARD</span> <span className="px-2 py-0.5 rounded-full bg-white/10">STAGE: {f.stage}</span> POOL {f.group} • {f.round} • MATCH {f.matchNo}</span><span className={`px-2 py-0.5 rounded-full font-bold ${r?.status==="FT"?"text-black":"bg-white/10 text-white"}`} style={r?.status==="FT"?{background:accent}:{}}>{status}</span></div>
                  <div className="flex items-center justify-between gap-2 mt-3"><div className="flex-1 min-w-0"><p className="font-bold [overflow-wrap:anywhere]">{h.name}</p><p className="text-xs text-[#B9CBC1]">Home • {h.ward} • Pool {h.group} • Coach: {getCoachName(h)}</p></div><div className="font-display text-2xl font-extrabold bg-black/30 px-3 py-1 rounded-lg whitespace-nowrap">{r?`${r.hg} – ${r.ag}`:"– : –"}</div><div className="flex-1 min-w-0 text-right"><p className="font-bold [overflow-wrap:anywhere]">{a.name}</p><p className="text-xs text-[#B9CBC1]">Away • {a.ward} • Pool {a.group} • Coach: {getCoachName(a)}</p></div></div>
                  <p className="text-xs text-[#B9CBC1] mt-3 flex gap-3 flex-wrap"><span className="flex items-center gap-1"><CalendarDays size={13}/>{fmtDate(f.date)}</span><span className="flex items-center gap-1"><Clock size={13}/>{f.time}</span><span className="flex items-center gap-1"><MapPin size={13}/>{f.venue}</span><span>👁 {getViews(`fixture-${f.id}`)} watching</span><span>MVP: {ex?.mvp?.player||"Not yet selected"}</span></p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {admin && <button onClick={()=>openLineup(f,"home")} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-bold">Set Lineup — Home</button>}
                    {admin && <button onClick={()=>openLineup(f,"away")} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-bold">Set Lineup — Away</button>}
                    <button onClick={()=>setMatchsheetFixture(f)} className="px-3 py-2 rounded-lg text-xs font-bold text-black" style={{background:accent}}><ClipboardList className="inline mr-1" size={13}/> {status==="Lineup Confirmed"?"View Matchsheet":"Matchsheet"}</button>
                    {admin && <button onClick={()=>openResult(f)} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-bold">Enter Result</button>}
                  </div>
                  {admin && <div className="flex gap-2 mt-2"><input aria-label="Home goals" placeholder="Home" inputMode="numeric" value={editScores[f.id]?.hg ?? (r?String(r.hg):"")} onChange={e=>setEditScores({...editScores,[f.id]:{hg:e.target.value,ag:editScores[f.id]?.ag??(r?String(r.ag):"")}})} /><input aria-label="Away goals" placeholder="Away" inputMode="numeric" value={editScores[f.id]?.ag ?? (r?String(r.ag):"")} onChange={e=>setEditScores({...editScores,[f.id]:{hg:editScores[f.id]?.hg??(r?String(r.hg):""),ag:e.target.value}})} /><button onClick={()=>{ const v=editScores[f.id]; if(!v) return; setResultFixture(f); setResultScore({hg:v.hg,ag:v.ag}); setResultScorers(r?.scorers||[]); setResultCards(r?.cards||[]); }} disabled={busy} className="font-bold px-4 rounded-lg shrink-0 text-black" style={{background:accent}}>Save</button></div>}
                  {r?.scorers?.length ? <p className="text-xs text-[#B9CBC1] mt-2">Goals: {r.scorers.map((s:any)=>`${s.player} ${s.minute}'`).join(" • ")}</p> : null}
                </article>
              })}
            </div>
            {filteredFixtures.length===0 && <p className="text-sm text-[#B9CBC1] mt-3 bg-[#122E24] rounded-2xl p-5">No fixtures for this filter.</p>}
          </section>
        )}

        {tab==="standings" && (
          <section className="mt-5">
            <div className="flex flex-wrap justify-between gap-3 items-center"><h2 className="font-display text-3xl font-extrabold uppercase">Ward Pool Standings</h2><div className="flex gap-2"><button onClick={handleSimulateMatchday} disabled={busy||weekFilter==="All"} className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-sm font-bold">Simulate Matchday</button><button onClick={handleSimulate} disabled={busy} className="px-4 py-2 rounded-lg text-sm font-bold text-black" style={{background:accent}}>Simulate Results</button></div></div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><select value={wardFilter} onChange={e=>setWardFilter(e.target.value)} className="w-[160px]"><option value="All">All Wards</option>{WARDS.map(w=><option key={w} value={w}>{w} Ward</option>)}</select><select value={poolFilter} onChange={e=>setPoolFilter(e.target.value)} className="w-[140px]"><option value="All">All Pools</option>{["A","B","C","D"].map(p=><option key={p} value={p}>Pool {p}</option>)}</select><span className="text-xs text-[#B9CBC1]">Top 2 per pool → Ward Knockout • Last updated: <b className="text-white">{lastUpdated||"—"}</b></span></div>
            {(division==="All"?["Men","Women"]:[division]).map(div=>(
              <div key={div}><h3 className="font-display text-2xl font-extrabold uppercase mt-6" style={{color:div==="Women"?"#EC4899":"#F5C518"}}>{div} Division — {groupPlayed(div)}/{groupTotal(div)} played</h3>
              {(wardFilter==="All"?WARDS:[wardFilter]).map(ward=>(
                <div key={ward}><h4 className="font-bold mt-4">{ward} Ward — {div} • {countFor(ward,div)}/{capFor(div)} teams</h4>
                <div className="grid lg:grid-cols-2 gap-4 mt-2">
                  {(poolsMap[`${div}-${ward}`]||[]).filter(pool=>poolFilter==="All"||pool.label===poolFilter).map(pool=><div key={pool.label} className="bg-[#122E24] border border-white/10 rounded-2xl overflow-hidden"><div className="px-4 py-3 flex justify-between bg-[#0B3D2E]"><h3 className="font-display font-extrabold text-xl">{ward} • POOL {pool.label} ({pool.teams.length})</h3><span className="text-xs text-[#B9CBC1]">Top 2 → Ward Knockout</span></div><div className="table-wrap"><table><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>{(standingsByPool[div]?.[ward]?.[pool.label]||[]).map((r,i)=><tr key={r.team.id} className={i<2?"bg-emerald-500/10":""}><td>{i+1}</td><td className="font-semibold"><span className="inline-flex items-center gap-2"><span className="badge-initials w-6 h-6 rounded text-[10px] grid place-items-center text-black" style={{background:r.team.color}}>{r.team.initials}</span><span className="[overflow-wrap:anywhere]">{r.team.name}</span></span></td><td>{r.pl}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td><td>{r.gf}</td><td>{r.ga}</td><td>{r.gf-r.ga>0?`+${r.gf-r.ga}`:r.gf-r.ga}</td><td className="font-bold" style={{color:accent}}>{r.pts}</td></tr>)}</tbody></table></div></div>)}
                </div>
                </div>
              ))}
              {qualificationTracker(div)}
              </div>
            ))}
          </section>
        )}

        {tab==="knockout" && (
          <section className="mt-5">
            <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold uppercase">Knockout Brackets</h2><p className="text-sm text-[#B9CBC1]">Ward Knockouts + Sub-County Knockout.</p><p className="text-sm font-bold mt-1">Prizes — Boys: 1st KES 300,000 • 2nd KES 200,000 • 3rd KES 150,000 • 4th KES 100,000 | Girls: 1st KES 200,000 • 2nd KES 150,000 • 3rd KES 100,000 • 4th KES 50,000 • Total KES 1,250,000</p></div>{admin && <button onClick={handleResetKnockout} disabled={busy} className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-sm font-bold h-fit flex items-center gap-1"><RotateCcw size={15}/> Reset Knockout</button>}</div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><span className="text-xs font-bold tracking-widest text-[#B9CBC1]">STAGE:</span>{(["All","Ward","Sub-County"] as const).map(s=><button key={s} onClick={()=>setStageFilter(s)} className={`px-3 py-1.5 rounded-full text-sm font-bold ${stageFilter===s?"text-black":"bg-white/10"}`} style={stageFilter===s?{background:accent}:{}}>{s==="All"?"All Stages":s}</button>)}<select value={wardFilter} onChange={e=>setWardFilter(e.target.value)} className="w-[160px]"><option value="All">All Wards</option>{WARDS.map(w=><option key={w} value={w}>{w} Ward</option>)}</select><span className="text-xs font-bold tracking-widest text-[#B9CBC1]">DIVISION:</span>{(["Men","Women","All"] as Division[]).map(d=><button key={d} onClick={()=>setDivision(d)} className={`px-3 py-1.5 rounded-full text-sm font-bold ${division===d?"text-black":"bg-white/10"}`} style={division===d?{background:d==="Women"?"#EC4899":d==="Men"?"#F5C518":"#fff"}:{}}>{d}</button>)}</div>
            {(division==="All"?["Men","Women"]:[division]).map(div=>(
              <div key={div} className="mt-6"><h3 className="font-display text-2xl font-extrabold uppercase" style={{color:div==="Women"?"#EC4899":"#F5C518"}}>{div} Knockout</h3>
                {(stageFilter==="All"||stageFilter==="Ward") && (wardFilter==="All"?WARDS:[wardFilter]).map(ward=><div key={ward}><h4 className="font-bold mt-5">{ward} Ward — {div}</h4>{renderWardKnockout(ward,div)}</div>)}
                {(stageFilter==="All"||stageFilter==="Sub-County") && <div><h4 className="font-bold mt-5">Sub-County — {div}</h4>{renderSubcountyBracket(div)}</div>}
              </div>
            ))}
          </section>
        )}

        {tab==="scorers" && (
          <section className="mt-5">
            <h2 className="font-display text-3xl font-extrabold uppercase flex items-center gap-2"><Medal style={{color:accent}}/> Top Scorers &amp; MVP</h2>
            <div className="bg-white border-2 border-[#C9A227] rounded-2xl p-4 mt-3"><h3 className="font-bold">Individual Awards — Mombasa Trip</h3><p className="text-sm mt-1">Three outstanding individuals will each win an exclusive 3-day trip to Mombasa, including return air tickets! Categories: Best Player, Best Coach, Top Scorer.</p><p className="text-sm mt-1">Best Player: <b>{awardsMap["Best Player"]?.winnerName||"To be announced"}</b> • Best Coach: <b>{awardsMap["Best Coach"]?.winnerName||"To be announced"}</b> • Top Scorer: <b>{awardsMap["Top Scorer"]?.winnerName||(scorers[0]?`${scorers[0].player} (${scorers[0].goals} goals)`:"To be announced")}</b></p><p className="text-sm mt-1">Admin selects winners in the Admin tab → Individual Awards.</p></div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><select value={scorerWard} onChange={e=>setScorerWard(e.target.value)} className="w-[160px]"><option value="All">All Wards</option>{WARDS.map(w=><option key={w} value={w}>{w} Ward</option>)}</select><select value={scorerStage} onChange={e=>setScorerStage(e.target.value)} className="w-[170px]"><option value="All">All Stages</option><option value="Ward">Ward Stage</option><option value="Sub-County">Sub-County Stage</option></select><select value={division} onChange={e=>setDivision(e.target.value as Division)} className="w-[140px]"><option>Men</option><option>Women</option><option>All</option></select></div>
            <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4 mt-4"><h3 className="font-bold">MVPs — Man of the Match</h3>{extrasRecords.filter((r:any)=>r.value?.mvp?.player).length===0 ? <p className="text-sm text-[#B9CBC1] mt-1">No MVP selected yet. Pick MVP in Result Entry, Live Score or Matchsheet.</p> : <div className="flex flex-wrap gap-2 mt-2">{extrasRecords.filter((r:any)=>r.value?.mvp?.player).map((r:any)=>{ const fx=fixtures.find(f=>f.id===r.value.fixtureId); return <span key={r.id} className="text-xs px-2 py-1 rounded-full bg-[#F5C518] text-black font-bold">⭐ {r.value.mvp.player} — {getTeam(Number(r.value.mvp.teamId))?.name} • Match {fx?.matchNo||""} • {r.value.mvp.reason||""}</span>; })}</div>}</div>
            {scorerStage==="Sub-County" ? <div className="bg-[#122E24] border border-white/10 rounded-2xl p-5 mt-4"><p className="text-sm">Sub-County knockout goals are recorded as team scores. Switch Stage to “Ward Stage” or “All Stages” to see the Golden Boot race.</p></div> : <div className="bg-[#122E24] border border-white/10 rounded-2xl overflow-hidden mt-4"><div className="table-wrap"><table><thead><tr><th>#</th><th>Player</th><th>Team</th><th>Ward</th><th>Division</th><th>Pos</th><th>Goals</th><th>MVP?</th></tr></thead><tbody>{scorers.filter(s=> (division==="All"||s.team?.division===division) && (scorerWard==="All"||s.team?.ward===scorerWard)).map((s,i)=>{ const rec=players.find((x:any)=>String(x.id)===String(s.playerId)); const isMvp = extrasRecords.some((r:any)=>String(r.value?.mvp?.playerId)===String(s.playerId)); return <tr key={i}><td>{i+1}</td><td className="font-bold [overflow-wrap:anywhere]"><button onClick={()=>openPlayerProfile(rec||{id:String(s.playerId),no:0,pos:s.pos,name:s.player,teamId:s.team?.id,division:s.team?.division})} className="font-bold hover:underline text-left">{s.player}</button> {i===0&&"👑"}</td><td>{s.team?.name||"—"}</td><td>{s.team?.ward||"—"}</td><td>{s.team?.division||"—"}</td><td>{s.pos}</td><td className="font-bold" style={{color:accent}}>{s.goals}</td><td>{isMvp?"⭐ MVP":"—"}</td></tr>; })}</tbody></table></div></div>}
          </section>
        )}

        {tab==="registered" && (
          <section className="mt-5">
            <div className="bg-[#F6F1DF] text-[#07120E] rounded-3xl p-5 sm:p-8">
              <p className="text-xs font-bold tracking-[.22em] uppercase">Hon Mulam Cup 5th Edition 2026 • Official Registered Teams List</p>
              <h2 className="font-display text-4xl font-extrabold uppercase leading-none mt-2">Registered Teams</h2>
              <p className="text-sm mt-2 font-bold">Registration Deadline: 22/11/2026 • 👁 {totalViews} viewers</p>
              <p className="text-sm mt-1">{totalRegistered} Teams Registered ({menCount} Men + {womenCount} Ladies) • {140-totalRegistered} slots still open • Confirmed {confirmedCount} • Pending {pendingCount}</p>
              <div className="grid lg:grid-cols-2 gap-5 mt-6">
                {WARDS.map(ward=>(
                  <div key={ward}>
                    <h3 className="font-display text-2xl font-extrabold uppercase border-b-2 border-[#0B3D2E] pb-1">{ward} Ward</h3>
                    {(["Men","Women"] as const).map(div=>{
                      const list = allTeams.filter(t=>t.ward===ward && t.division===div).sort((a,b)=>a.sourceOrder-b.sourceOrder);
                      return <div key={div} className="mt-4">
                        <div className="flex justify-between gap-2"><h4 className="font-bold">{div==="Women"?"Ladies":"Men"} — {list.length} registered</h4><span className="text-xs">{capFor(div)-list.length} slots remaining</span></div>
                        <div className="bg-white rounded-xl border overflow-hidden mt-2"><table className="text-black"><thead><tr><th>#</th><th>Team</th><th>Status</th><th>Registration</th></tr></thead><tbody>
                          {list.map((t,i)=><tr key={t.id}><td className="font-bold w-12">{i+1}</td><td className="font-semibold [overflow-wrap:anywhere]">{t.name} <span className="text-xs font-normal">• 👁 {getViews(`team-${t.id}`)}</span></td><td>{t.status==="Confirmed"?<span className="text-xs font-bold text-emerald-700">✓ Confirmed</span>:<span className="text-xs font-bold text-amber-700">Pending</span>}</td><td className="text-xs">{registrationStatus(t)}</td></tr>)}
                          {list.length===0 && <tr><td colSpan={4} className="text-sm text-black/60">No registered teams yet.</td></tr>}
                        </tbody></table></div>
                      </div>;
                    })}
                  </div>
                ))}
              </div>
              <p className="text-xs mt-6 text-black/60">Pending teams: Muungano (Maeni Men), Y.Machines (Kamukuywa Ladies), Kamusinde Tigerlets (Maeni Ladies), Khwiroro (Kibingei Ladies). Confirm them in one tap in the Admin tab.</p>
            </div>
          </section>
        )}

        {tab==="register" && (
          <section className="mt-5">
            <form onSubmit={handleRegister} className="light-form space-y-4">
              <h2 className="font-display text-3xl font-extrabold uppercase text-[#0B3D2E]">Register Team - Mulama Super Cup</h2>
              <p className="hint">Always-visible form. Registration Fee: KES 1,000 - Payable to Treasurer. At least 1 official is required.</p>
              <div className="bg-[#FEF3C7] border-2 border-[#C9A227] rounded-xl px-4 py-3"><p className="font-bold">Registration Fee: KES 1,000 per team — Payable to Treasurer</p><ul className="mt-2 space-y-1 text-sm"><li>✅ Participation is strictly open to players from Kimilili Sub-County.</li><li>✅ All players must be registered on the official tournament portal.</li><li>✅ Match balls will be provided.</li></ul></div>
              <div className="bg-white border-2 border-[#C9A227] rounded-xl px-4 py-3"><p className="font-bold">Team Uniforms — as per official poster: Maeni 12 • Kibingei 12 • Kamukuywa 12 • Kimilili 13 • TOTAL: 50 TEAMS</p><p className="text-xs text-[#4B5563] mt-1">Uniform allocation as per official poster. Registered teams list on this portal is 94 teams - Admin to confirm uniform allocation for teams beyond the 50.</p></div>
              <div className="grid sm:grid-cols-2 gap-4"><div><label>Team Name *</label><input value={form.teamName} onChange={e=>setForm({...form,teamName:e.target.value})} placeholder={`e.g. ${form.ward} Stars`}/></div><div><label>Ward *</label><select value={form.ward} onChange={e=>setForm({...form,ward:e.target.value})}>{WARDS.map(w=>{ const slots = slotsFor(w, form.division); const occupied = countFor(w, form.division); return <option key={w} value={w} disabled={slots<=0}>{w} Ward — {form.division} • {occupied}/{capFor(form.division)} • {slots<=0?"FULL":`${slots} slots left`}</option>; })}</select></div></div>
              <div className="grid sm:grid-cols-2 gap-4"><div><label>Division *</label><select value={form.division} onChange={e=>setForm({...form,division:e.target.value}) }><option value="Men">Men — {80-menCount} slots left (total)</option><option value="Women">Ladies — {60-womenCount} slots left (total)</option></select></div><div><label>Coach Phone *</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+254 700 000 000"/></div></div>
              <div><label>Home Ground / Venue</label><input value={form.homeGround} onChange={e=>setForm({...form,homeGround:e.target.value})} placeholder={`e.g. ${form.ward} Primary Ground, Kimilili`}/></div>
              <div className="grid sm:grid-cols-2 gap-4"><div><label>Home Colour *</label><div className="flex flex-wrap gap-2">{HOME_COLORS.map(c=><button key={c.value} type="button" onClick={()=>setForm({...form,color:c.value})} aria-label={`Home colour ${c.name}`} title={c.name} className={`w-9 h-9 rounded-full border-2 ${form.color===c.value?"border-emerald-700 scale-110":"border-slate-300"}`} style={{background:c.value}} />)}</div><p className="hint mt-1">Selected: {HOME_COLORS.find(c=>c.value===form.color)?.name||form.color}</p></div><div><label>Away Colour (optional)</label><div className="flex flex-wrap gap-2">{HOME_COLORS.map(c=><button key={c.value} type="button" onClick={()=>setForm({...form,awayColor:c.value})} aria-label={`Away colour ${c.name}`} title={c.name} className={`w-9 h-9 rounded-full border-2 ${form.awayColor===c.value?"border-emerald-700 scale-110":"border-slate-300"}`} style={{background:c.value}} />)}<button type="button" onClick={()=>setForm({...form,awayColor:""})} className="text-xs bg-slate-100 border px-3 py-1 rounded-full font-bold">Clear</button></div>{form.awayColor && <p className="hint mt-1">Selected away: {HOME_COLORS.find(c=>c.value===form.awayColor)?.name||form.awayColor}</p>}</div></div>
              <div className="border-2 border-emerald-700 rounded-xl p-4"><h3 className="font-display text-xl font-extrabold uppercase text-[#0B3D2E]">Team Officials — Required</h3><p className="hint">Officials: {officialsDraft.filter(o=>o.name.trim()).length}/3 • At least 1 required, ideal is 3. If Role = Coach, that person is shown as Team Coach everywhere.</p>
                {[0,1,2].map(idx=><div key={idx} className="border-2 border-slate-300 rounded-xl p-3 mt-3"><p className="font-bold text-[#0B3D2E]">Official {idx+1} {idx===0?"(at least this one required)":"(optional)"}</p><div className="grid sm:grid-cols-2 gap-3 mt-2"><div><label>Full Name *</label><input value={officialsDraft[idx]?.name||""} onChange={e=>{ const a=[...officialsDraft]; a[idx]={...a[idx],name:e.target.value}; setOfficialsDraft(a); }} placeholder="Official full name"/></div><div><label>Role *</label><select value={officialsDraft[idx]?.role||"Coach"} onChange={e=>{ const a=[...officialsDraft]; a[idx]={...a[idx],role:e.target.value}; setOfficialsDraft(a); }}>{OFFICIAL_ROLES.map(r=><option key={r}>{r}</option>)}</select></div><div><label>Phone</label><input value={officialsDraft[idx]?.phone||""} onChange={e=>{ const a=[...officialsDraft]; a[idx]={...a[idx],phone:e.target.value}; setOfficialsDraft(a); }} placeholder="+254 700 000 000"/></div><div><label>ID No.</label><input value={officialsDraft[idx]?.idNo||""} onChange={e=>{ const a=[...officialsDraft]; a[idx]={...a[idx],idNo:e.target.value}; setOfficialsDraft(a); }} placeholder="ID number"/></div></div></div>)}
              </div>
              <div className="grid sm:grid-cols-2 gap-4"><div><label>Registration Fee Paid? *</label><select value={form.feePaid} onChange={e=>setForm({...form,feePaid:e.target.value})}><option value="No">No — Not yet paid</option><option value="Yes">Yes — Paid to Treasurer</option></select></div><div><label>Receipt No.</label><input value={form.receiptNo} onChange={e=>setForm({...form,receiptNo:e.target.value})} placeholder="e.g. RCP-001 (if paid)"/></div></div>
              <div><label>Notes (optional)</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Home ground, kit colour, or anything organisers should know" rows={3}/></div>
              {formError && <p className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 flex gap-2"><AlertTriangle size={16}/><span>{formError}</span></p>}
              {formSuccess && <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2 flex gap-2"><CheckCircle2 size={16}/><span>{formSuccess}</span></p>}
              <button disabled={busy || slotsFor(form.ward,form.division)<=0} className="w-full font-bold py-4 rounded-xl text-white text-lg disabled:opacity-50 bg-emerald-700 hover:bg-emerald-800">{slotsFor(form.ward,form.division)<=0?"This Ward / Division Is Full":busy?"Saving…":"REGISTER TEAM"}</button>
              <p className="hint text-center">By registering you agree to the tournament fixtures and fair-play rules. • Portal registrations: {registrations.length} • Real teams: 94.</p>
            </form>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="font-bold">Men</p><p className="text-3xl font-display font-extrabold">{menCount}/80</p><p className="text-xs text-[#B9CBC1]">{slotsMen} slots remaining</p></div>
              <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="font-bold">Women</p><p className="text-3xl font-display font-extrabold">{womenCount}/60</p><p className="text-xs text-[#B9CBC1]">{slotsWomen} slots remaining</p></div>
              <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="font-bold">Total</p><p className="text-3xl font-display font-extrabold">{totalRegistered}/140</p><p className="text-xs text-[#B9CBC1]">Confirmed {confirmedCount} • Pending {pendingCount} • 👁 {totalViews} viewers</p></div>
            </div>
          </section>
        )}

        {tab==="admin" && (
          <section className="mt-5">
            <h2 className="font-display text-3xl font-extrabold uppercase flex items-center gap-2"><Shield style={{color:accent}}/> Admin Panel</h2>
            <p className="text-sm text-[#B9CBC1] mt-1">Administrator access is protected by Supabase email and password authentication. Public visitors can browse tournament information without signing in.</p>
            {!admin ? (
              <form onSubmit={(e)=>{e.preventDefault(); unlockAdmin();}} className="light-form mt-4 max-w-md space-y-3">
                <h3 className="font-display text-xl font-extrabold uppercase text-[#0B3D2E]">Administrator sign in</h3>
                <div><label>Email address *</label><input type="email" autoComplete="username" required value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} placeholder="admin@example.com"/></div>
                <div><label>Password *</label><input type="password" autoComplete="current-password" required value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} placeholder="Enter administrator password"/></div>
                {pinError && <p className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2">{pinError}</p>}
                <button className="w-full font-bold py-3.5 rounded-xl text-white bg-emerald-700">SIGN IN</button>
              </form>
            ) : (
              <div>
                <div className="flex gap-2 mt-3"><button onClick={async ()=>{await supabase.auth.signOut(); setAdmin(false); setNotice("Signed out of administrator mode.");}} className="bg-white/10 px-4 py-2 rounded-lg font-bold text-sm">Exit Admin</button><span className="text-sm text-emerald-300 self-center font-bold">✓ Admin unlocked</span></div>
                <form onSubmit={handleAdminAddTeam} className="light-form mt-5 space-y-4">
                  <h3 className="font-display text-3xl font-extrabold uppercase text-[#0B3D2E]">ADMIN - ADD NEW TEAM</h3>
                  <p className="hint">Admin only. The team appears instantly in Teams, Wards, Register counts and its correct ward pool. Public self-registrations stay Pending until Admin confirms.</p>
                  <div className="grid sm:grid-cols-2 gap-4"><div><label>Team Name *</label><input value={adminTeamForm.teamName} onChange={e=>setAdminTeamForm({...adminTeamForm,teamName:e.target.value})} placeholder="e.g. Kimilili Stars"/></div><div><label>Ward *</label><select value={adminTeamForm.ward} onChange={e=>setAdminTeamForm({...adminTeamForm,ward:e.target.value})}>{WARDS.map(w=>{ const slots=slotsFor(w,adminTeamForm.division); const occ=countFor(w,adminTeamForm.division); return <option key={w} value={w} disabled={slots<=0}>{w} Ward — {adminTeamForm.division} • {occ}/{capFor(adminTeamForm.division)} • {slots<=0?"FULL":`${slots} slots left`}</option>; })}</select></div></div>
                  <div className="grid sm:grid-cols-2 gap-4"><div><label>Division *</label><select value={adminTeamForm.division} onChange={e=>setAdminTeamForm({...adminTeamForm,division:e.target.value})}><option value="Men">Men — {80-menCount} slots left (total)</option><option value="Women">Ladies — {60-womenCount} slots left (total)</option></select></div><div><label>Status *</label><select value={adminTeamForm.status} onChange={e=>setAdminTeamForm({...adminTeamForm,status:e.target.value as TeamStatus})}><option value="Confirmed">Confirmed</option><option value="Pending">Pending</option></select></div></div>
                  <div><label>Home Ground</label><input value={adminTeamForm.homeGround} onChange={e=>setAdminTeamForm({...adminTeamForm,homeGround:e.target.value})} placeholder="e.g. Kimilili Primary Ground"/></div>
                  <div className="grid sm:grid-cols-2 gap-4"><div><label>Registration Fee Paid? *</label><select value={adminTeamForm.feePaid} onChange={e=>setAdminTeamForm({...adminTeamForm,feePaid:e.target.value})}><option value="No">No</option><option value="Yes">Yes — Paid to Treasurer</option></select></div><div><label>Receipt No.</label><input value={adminTeamForm.receiptNo} onChange={e=>setAdminTeamForm({...adminTeamForm,receiptNo:e.target.value})} placeholder="Receipt No. (if paid)"/></div></div>
                  <p className="hint">Registration Fee: KES 1,000 - Payable to Treasurer. Admin can also mark Paid later in “Registration Fees” below.</p>
                  <div className="grid sm:grid-cols-2 gap-4"><div><label>Home Colour *</label><div className="flex flex-wrap gap-2">{HOME_COLORS.map(c=><button key={c.value} type="button" onClick={()=>setAdminTeamForm({...adminTeamForm,color:c.value})} aria-label={`Admin home colour ${c.name}`} title={c.name} className={`w-9 h-9 rounded-full border-2 ${adminTeamForm.color===c.value?"border-emerald-700 scale-110":"border-slate-300"}`} style={{background:c.value}} />)}</div><p className="hint mt-1">Selected: {HOME_COLORS.find(c=>c.value===adminTeamForm.color)?.name||adminTeamForm.color}</p></div><div><label>Away Colour (optional)</label><div className="flex flex-wrap gap-2">{HOME_COLORS.map(c=><button key={c.value} type="button" onClick={()=>setAdminTeamForm({...adminTeamForm,awayColor:c.value})} aria-label={`Admin away colour ${c.name}`} title={c.name} className={`w-9 h-9 rounded-full border-2 ${adminTeamForm.awayColor===c.value?"border-emerald-700 scale-110":"border-slate-300"}`} style={{background:c.value}} />)}<button type="button" onClick={()=>setAdminTeamForm({...adminTeamForm,awayColor:""})} className="text-xs bg-slate-100 border px-3 py-1 rounded-full font-bold">Clear</button></div>{adminTeamForm.awayColor && <p className="hint mt-1">Selected away: {HOME_COLORS.find(c=>c.value===adminTeamForm.awayColor)?.name||adminTeamForm.awayColor}</p>}</div></div>
                  <div className="border-2 border-emerald-700 rounded-xl p-4"><h4 className="font-display text-xl font-extrabold uppercase text-[#0B3D2E]">Team Officials — Required</h4><p className="hint">Officials: {adminTeamOfficials.filter(o=>o.name.trim()).length}/3 • At least 1 required.</p>
                    {[0,1,2].map(idx=><div key={idx} className="border-2 border-slate-300 rounded-xl p-3 mt-3"><p className="font-bold text-[#0B3D2E]">Official {idx+1} {idx===0?"(at least this one required)":"(optional)"}</p><div className="grid sm:grid-cols-2 gap-3 mt-2"><div><label>Full Name *</label><input value={adminTeamOfficials[idx]?.name||""} onChange={e=>{ const a=[...adminTeamOfficials]; a[idx]={...a[idx],name:e.target.value}; setAdminTeamOfficials(a); }} placeholder="Official full name"/></div><div><label>Role *</label><select value={adminTeamOfficials[idx]?.role||"Coach"} onChange={e=>{ const a=[...adminTeamOfficials]; a[idx]={...a[idx],role:e.target.value}; setAdminTeamOfficials(a); }}>{OFFICIAL_ROLES.map(r=><option key={r}>{r}</option>)}</select></div><div><label>Phone</label><input value={adminTeamOfficials[idx]?.phone||""} onChange={e=>{ const a=[...adminTeamOfficials]; a[idx]={...a[idx],phone:e.target.value}; setAdminTeamOfficials(a); }} placeholder="+254 700 000 000"/></div><div><label>ID No.</label><input value={adminTeamOfficials[idx]?.idNo||""} onChange={e=>{ const a=[...adminTeamOfficials]; a[idx]={...a[idx],idNo:e.target.value}; setAdminTeamOfficials(a); }} placeholder="ID number"/></div></div></div>)}
                  </div>
                  {adminTeamError && <p className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 flex gap-2"><AlertTriangle size={16}/><span>{adminTeamError}</span></p>}
                  {adminTeamSuccess && <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2 flex gap-2"><CheckCircle2 size={16}/><span>{adminTeamSuccess}</span></p>}
                  <button disabled={busy || slotsFor(adminTeamForm.ward,adminTeamForm.division)<=0} className="w-full font-bold py-4 rounded-xl text-white text-lg disabled:opacity-50 bg-emerald-700 hover:bg-emerald-800">{slotsFor(adminTeamForm.ward,adminTeamForm.division)<=0?"This Ward / Division Is Full":busy?"Saving…":"ADD TEAM"}</button>
                </form>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="text-xs text-[#B9CBC1]">Total Views</p><p className="font-display text-3xl font-extrabold">👁 {totalViews}</p><p className="text-xs">Views</p></div>
                  <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="text-xs text-[#B9CBC1]">Teams</p><p className="font-display text-3xl font-extrabold">{confirmedCount} / {pendingCount}</p><p className="text-xs">Confirmed / Pending</p></div>
                  <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="text-xs text-[#B9CBC1]">Players Registered</p><p className="font-display text-3xl font-extrabold">{players.length}</p><p className="text-xs">Max 18 per team</p></div>
                  <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="text-xs text-[#B9CBC1]">Matchsheets Generated</p><p className="font-display text-3xl font-extrabold">{matchsheetsGenerated}</p><p className="text-xs">Both lineups confirmed</p></div>
                  <div className="bg-[#122E24] border border-white/10 rounded-2xl p-4"><p className="text-xs text-[#B9CBC1]">Officials</p><p className="font-display text-3xl font-extrabold">{Object.values(officialsMap).flat().length}</p><p className="text-xs">Across all teams</p></div>
                </div>
                <div className="light-form mt-5"><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Individual Awards — Mombasa Trip</h3><p className="hint">Three outstanding individuals will each win an exclusive 3-day trip to Mombasa, including return air tickets! Select each winner below.</p>
                  <div className="grid sm:grid-cols-3 gap-3 mt-3"><div><label>Best Player</label><select value={awardDraft.bestPlayer} onChange={e=>setAwardDraft({...awardDraft,bestPlayer:e.target.value})}><option value="">Pick Best Player…</option>{players.map((p:any)=><option key={p.id} value={p.value?.name||""}>{p.value?.name} — {getTeam(Number(p.value?.teamId))?.name||""}</option>)}</select><button onClick={()=>{ const p=players.find((x:any)=>x.value?.name===awardDraft.bestPlayer); saveAward("Best Player",awardDraft.bestPlayer, p?`${getTeam(Number(p.value?.teamId))?.name||""} • #${p.value?.jersey||""}`:""); }} disabled={busy||!awardDraft.bestPlayer} className="mt-2 w-full bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm">Save Best Player</button><p className="hint mt-1">Current: {awardsMap["Best Player"]?.winnerName||"Not selected"}</p></div>
                  <div><label>Best Coach</label><select value={awardDraft.bestCoach} onChange={e=>setAwardDraft({...awardDraft,bestCoach:e.target.value})}><option value="">Pick Best Coach…</option>{allTeams.map(t=><option key={t.id} value={getCoachName(t)}>{getCoachName(t)} — {t.name}</option>)}</select><button onClick={()=>{ const t=allTeams.find(x=>getCoachName(x)===awardDraft.bestCoach); saveAward("Best Coach",awardDraft.bestCoach, t?`Coach — ${t.name} • ${t.ward}`:""); }} disabled={busy||!awardDraft.bestCoach} className="mt-2 w-full bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm">Save Best Coach</button><p className="hint mt-1">Current: {awardsMap["Best Coach"]?.winnerName||"Not selected"}</p></div>
                  <div><label>Top Scorer</label><select value={awardDraft.topScorer} onChange={e=>setAwardDraft({...awardDraft,topScorer:e.target.value})}><option value="">Pick Top Scorer…</option>{scorers.map((s:any,i:number)=><option key={i} value={s.player}>{s.player} — {s.goals} goals • {s.team?.name||""}</option>)}</select><button onClick={()=>{ const s=scorers.find((x:any)=>x.player===awardDraft.topScorer); saveAward("Top Scorer",awardDraft.topScorer, s?`${s.team?.name||""} • ${s.goals} goals`:""); }} disabled={busy||!awardDraft.topScorer} className="mt-2 w-full bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm">Save Top Scorer</button><p className="hint mt-1">Current: {awardsMap["Top Scorer"]?.winnerName||"Not selected"}</p></div></div>
                </div>
                <div className="light-form mt-5"><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Registration Fees — Mark Paid (KES 1,000)</h3><p className="hint">Registration Fee: KES 1,000 - Payable to Treasurer. Mark each team Paid and add its Receipt No.</p>
                  <div className="space-y-2 mt-3 max-h-[420px] overflow-y-auto pr-1">{allTeams.map(t=>{ const fee=feeForTeam(t); const draft=feeDraft[String(t.id)]||{paid:fee?.paid||"No",receipt:fee?.receiptNo||""}; return <div key={t.id} className="border-2 border-slate-300 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-between"><div><p className="font-bold">{t.name} • {t.ward} • {t.division}</p><p className="text-xs text-slate-600">Fee: KES 1,000 • Paid: {fee?.paid||"No"} {fee?.receiptNo?`• Receipt: ${fee.receiptNo}`:"• No receipt yet"}</p></div><div className="flex gap-2 flex-wrap"><select aria-label={`Fee paid for ${t.name}`} value={draft.paid} onChange={e=>setFeeDraft({...feeDraft,[String(t.id)]:{...draft,paid:e.target.value}})} className="!w-[130px]"><option value="No">No</option><option value="Yes">Yes</option></select><input aria-label={`Receipt for ${t.name}`} placeholder="Receipt No." value={draft.receipt} onChange={e=>setFeeDraft({...feeDraft,[String(t.id)]:{...draft,receipt:e.target.value}})} className="!w-[150px]"/><button onClick={()=>saveFeeForTeam(t,draft.paid,draft.receipt)} disabled={busy} className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm">Save Fee</button></div></div>; })}</div>
                </div>
                {/* A) Confirm / Delete Teams */}
                <div className="light-form mt-5"><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Confirm / Delete Teams</h3><p className="hint">Search all teams. Pending teams Muungano, Y.Machines, Kamusinde Tigerlets, Khwiroro Ladies can be confirmed in one tap.</p>
                  <div className="mt-3"><label>Search teams</label><input value={adminSearchTeam} onChange={e=>setAdminSearchTeam(e.target.value)} placeholder="Search team…"/></div>
                  <div className="space-y-2 mt-3 max-h-[420px] overflow-y-auto pr-1">{allTeams.filter(t=>t.name.toLowerCase().includes(adminSearchTeam.toLowerCase())).map(t=>{ const offs=getOfficials(t); return <div key={t.id} className="border-2 border-slate-300 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-between"><div className="min-w-0"><p className="font-bold [overflow-wrap:anywhere]">{t.name} • {t.ward} • {t.division} • {t.status} • {registrationStatus(t)} • 👁 {getViews(`team-${t.id}`)} views</p><p className="text-xs text-slate-600">Coach: {getCoachName(t)} • Officials: {offs.length}/3 • Players: {(registeredPlayersByTeam[t.id]||[]).length}/18</p>{deleteConfirmTeam===t.id && <div className="mt-2"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!deleteConfirmChecked[t.id]} onChange={e=>setDeleteConfirmChecked({...deleteConfirmChecked,[t.id]:e.target.checked})} className="!w-5 !p-0"/> Yes, delete this team</label><label className="block mt-2">Reason for deletion</label><input value={deleteReason[t.id]||""} onChange={e=>setDeleteReason({...deleteReason,[t.id]:e.target.value})} placeholder="Reason (optional)"/></div>}</div><div className="flex gap-2 flex-wrap">{t.status==="Pending" ? <button onClick={()=>confirmTeam(t)} disabled={busy} className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm">Confirm Team</button> : <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-bold self-center">Confirmed</span>}{deleteConfirmTeam===t.id ? <><button onClick={()=>deleteTeam(t)} disabled={busy||!deleteConfirmChecked[t.id]} className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50">Delete Team</button><button onClick={()=>setDeleteConfirmTeam(null)} className="bg-slate-100 border px-3 py-2 rounded-lg text-sm font-bold">Cancel</button></> : <button onClick={()=>setDeleteConfirmTeam(t.id)} className="bg-red-100 text-red-800 border border-red-300 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1"><Trash2 size={15}/> Delete Team</button>}</div></div>; })}</div>
                </div>
                {/* B) Confirm / Delete Players */}
                <div className="light-form mt-5"><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Confirm / Delete Players</h3>
                  <div className="mt-3"><label>Search players</label><input value={adminSearchPlayer} onChange={e=>setAdminSearchPlayer(e.target.value)} placeholder="Search player…"/></div>
                  <div className="space-y-2 mt-3 max-h-[420px] overflow-y-auto pr-1">{players.filter((p:any)=>(p.value?.name||"").toLowerCase().includes(adminSearchPlayer.toLowerCase())).slice(0,100).map((p:any)=>{ const v=p.value||{}; const team=getTeam(Number(v.teamId)); const confirmed=playerConfirmMap[String(p.id)]==="Confirmed"; return <div key={p.id} className="border-2 border-slate-300 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-between"><div><p className="font-bold">{v.name} • #{v.jersey} • {team?.name||"—"} • {confirmed?"Confirmed":"Pending"} • 👁 {getViews(`player-${p.id}`)} views</p><p className="text-xs text-slate-600">Phone: {v.phone||"—"} • ID: {v.idNo||"—"} • Passport: {v.passportStatus||"—"}</p>{deleteConfirmPlayer===String(p.id) && <label className="flex items-center gap-2 text-sm font-bold mt-2"><input type="checkbox" checked={!!deletePlayerChecked[String(p.id)]} onChange={e=>setDeletePlayerChecked({...deletePlayerChecked,[String(p.id)]:e.target.checked})} className="!w-5 !p-0"/> Yes, delete this player</label>}</div><div className="flex gap-2 flex-wrap"><button onClick={()=>confirmPlayerRecord(p)} disabled={busy} className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm">Confirm</button><button onClick={()=>openPlayerEdit(p)} className="bg-slate-100 border px-3 py-2 rounded-lg text-sm font-bold">Edit</button>{deleteConfirmPlayer===String(p.id) ? <><button onClick={()=>deletePlayerRecord(p)} disabled={busy||!deletePlayerChecked[String(p.id)]} className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50">Delete Player</button><button onClick={()=>setDeleteConfirmPlayer(null)} className="bg-slate-100 border px-3 py-2 rounded-lg text-sm font-bold">Cancel</button></> : <button onClick={()=>setDeleteConfirmPlayer(String(p.id))} className="bg-red-100 text-red-800 border border-red-300 font-bold px-4 py-2 rounded-lg text-sm">Delete</button>}</div></div>; })}{players.length===0 && <p className="hint">No players registered yet.</p>}</div>
                </div>
                {/* C) Confirm Officials */}
                <div className="light-form mt-5"><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Confirm Officials</h3><p className="hint">Pending officials need Admin confirmation.</p>
                  <div className="space-y-2 mt-3">{allTeams.flatMap(t=> getOfficials(t).map((o,i)=>({team:t,o,idx:i}))).filter(x=>x.o.status!=="Confirmed").slice(0,100).map((x,i)=><div key={i} className="border-2 border-slate-300 rounded-xl p-3 flex flex-wrap justify-between gap-2"><span><b>{x.o.name}</b> • {x.o.role} • {x.team.name} • Phone: {x.o.phone} • ID: {x.o.idNo} • Pending</span><button onClick={()=>confirmOfficial(x.team,x.idx)} disabled={busy} className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm">Confirm Official</button></div>)}</div>
                  {allTeams.flatMap(t=>getOfficials(t)).filter(o=>o.status!=="Confirmed").length===0 && <p className="hint">No pending officials. All officials confirmed, or no officials registered yet — teams show “Incomplete - Officials Not Registered”.</p>}
                </div>
                {/* D) Manage Fixtures / Results */}
                <div className="light-form mt-5"><h3 className="font-display text-2xl font-extrabold uppercase text-[#0B3D2E]">Manage Fixtures / Results</h3>
                  <div className="space-y-2 mt-3 max-h-[420px] overflow-y-auto pr-1">{fixtures.slice(0,120).map(f=>{ const r=results[f.id]; const ex=extrasMap[f.id]; return <div key={f.id} className="border-2 border-slate-300 rounded-xl p-3 flex flex-wrap justify-between gap-2 items-center"><span className="text-sm"><b>Match {f.matchNo}</b> • {getTeam(f.home)?.name} vs {getTeam(f.away)?.name} • {fmtDate(f.date)} • {f.ward} • {f.division} • {r?`${r.hg}–${r.ag} FT`:"Scheduled"} • MVP: {ex?.mvp?.player||"None"} • 👁 {getViews(`fixture-${f.id}`)}</span><span className="flex gap-2"><button onClick={()=>{ setTab("fixtures"); setTimeout(()=>openResult(f),50); }} className="bg-emerald-700 text-white font-bold px-3 py-2 rounded-lg text-sm">Edit Result</button>{r && <button onClick={()=>deleteResultForFixture(f)} disabled={busy} className="bg-red-100 text-red-800 border border-red-300 font-bold px-3 py-2 rounded-lg text-sm">Delete Result</button>}<button onClick={()=>{ setMatchsheetFixtureId(f.id); setTab("matchsheet"); }} className="bg-slate-100 border px-3 py-2 rounded-lg text-sm font-bold">Matchsheet</button></span></div>; })}</div>
                  <div className="flex gap-2 mt-4 flex-wrap"><button onClick={handleSimulate} disabled={busy} className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm">Simulate All Results</button><button onClick={handleReset} disabled={busy} className="bg-slate-100 border px-4 py-2 rounded-lg text-sm font-bold">Reset Results</button><button onClick={handleResetKnockout} disabled={busy} className="bg-slate-100 border px-4 py-2 rounded-lg text-sm font-bold">Reset Knockout</button></div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-[#DDE3DA] bg-white"><div className="h-1.5 bg-gradient-to-r from-[#1E3A8A] via-[#C9A227] to-[#0B7A43]" /><div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 flex flex-wrap justify-between gap-3 text-sm text-[#4B5563]"><div><p className="font-bold text-[#111827]">© 2026 MULAMA SUPER CUP - 5TH EDITION • HON MULAM CUP 5TH EDITION 2026 • Kimilili Constituency, Bungoma County</p><p className="mt-1 font-bold">ONE COMMUNITY. ONE DREAM. ONE TROPHY! • MULAMA SUPER CUP - WHERE TALENT MEETS OPPORTUNITY!</p><p className="mt-1">Presented under the leadership of HON. ABDULAZIZ MULAMA • Total Prize Pool: KES 1,250,000</p></div><p>{totalRegistered} registered • 140 slots • 1 Dec 2026 – 24 Jan 2027 • 👁 {totalViews} viewers</p></div></footer>
    </div>
  );
}
