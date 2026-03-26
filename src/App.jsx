import { useState, useRef, useEffect, useCallback } from "react";

const TYPES = {
  Elasticidade:{en:"ELASTICITY",pt:"ELASTICIDADE",color:"#C084FC",dEn:"Runners who feel heavy at race pace.",dPt:"Corredores pesados ao ritmo de prova.",gEn:"↑ Running economy · ↓ Ground contact time",gPt:"↑ Economia de corrida · ↓ Tempo de contacto",sessions:[
    {code:"ES1",nEn:"Spring Foundations",nPt:"Base Elástica",dEn:"Wks 1–2: ankle stiffness basics.",dPt:"Sem 1–2: rigidez do tornozelo.",list:[{ph:"A",nm:"Pogo Hops"},{ph:"A",nm:"Single-Leg Pogo Hops"},{ph:"B",nm:"Bounding (A-Bounds)"},{ph:"I",nm:"Tibialis Raise"},{ph:"J",nm:"Dead Bug with Band"}]},
    {code:"ES2",nEn:"Reactive Stiffness",nPt:"Rigidez Reativa",dEn:"Wks 3–4.",dPt:"Sem 3–4.",list:[{ph:"A",nm:"Double-Leg Hurdle Hops"},{ph:"A",nm:"Tuck Jump"},{ph:"E",nm:"Snap-Down"},{ph:"I",nm:"Tibialis Raise"},{ph:"J",nm:"Hollow Body Hold"}]},
    {code:"ES3",nEn:"Elastic Peak",nPt:"Pico Elástico",dEn:"Wks 5–6.",dPt:"Sem 5–6.",list:[{ph:"A",nm:"Depth Drop → Rebound"},{ph:"A",nm:"Double-Leg Hurdle Hops"},{ph:"B",nm:"Bounding (A-Bounds)"},{ph:"A",nm:"Single-Leg Pogo Hops"},{ph:"J",nm:"Pallof Press to Rotation"}]},
  ]},
  Pliometria:{en:"PLYOMETRICS",pt:"PLIOMETRIA",color:"#E8FF47",dEn:"Runners lacking explosive power or finishing kick.",dPt:"Corredores sem potência explosiva.",gEn:"↑ Reactive strength index · ↑ Rate of force development",gPt:"↑ Índice de força reativa",sessions:[
    {code:"PS1",nEn:"Reactive Base",nPt:"Base Reativa",dEn:"Foundation bilateral jumps.",dPt:"Saltos bilaterais base.",list:[{ph:"B",nm:"Squat Jump"},{ph:"A",nm:"Tuck Jump"},{ph:"C",nm:"Lateral Skater Jumps"},{ph:"I",nm:"Rapid Toe Taps"},{ph:"J",nm:"Bear Crawl"}]},
    {code:"PS2",nEn:"Jump Complex",nPt:"Complexo de Saltos",dEn:"Horizontal and rotational.",dPt:"Horizontais e rotacionais.",list:[{ph:"G",nm:"Drop Jump to Broad Jump"},{ph:"C",nm:"Rotational Box Jump"},{ph:"F",nm:"Sumo Squat Jump"},{ph:"F",nm:"Lateral Hurdle Hop (Single-Leg)"},{ph:"J",nm:"Hollow Body Hold"}]},
    {code:"PS3",nEn:"Max Explosive",nPt:"Explosividade Máxima",dEn:"Peak reactive load.",dPt:"Carga reativa máxima.",list:[{ph:"A",nm:"Depth Drop → Rebound"},{ph:"G",nm:"Drop Jump to Broad Jump"},{ph:"A",nm:"Tuck Jump"},{ph:"B",nm:"Bulgarian Split Jump"},{ph:"J",nm:"Single-Leg Plank Hip Extension"}]},
  ]},
  Reflexo:{en:"REFLEX",pt:"REFLEXO",color:"#00D4FF",dEn:"Runners with low cadence or poor trail coordination.",dPt:"Corredores com cadência baixa ou dificuldade no trail.",gEn:"↑ Cadence · ↑ Neural coordination · ↑ Trail agility",gPt:"↑ Cadência · ↑ Coordenação neural",sessions:[
    {code:"RS1",nEn:"Neural Activation",nPt:"Ativação Neural",dEn:"Max foot speed.",dPt:"Velocidade máxima dos pés.",list:[{ph:"D",nm:"Fast-Foot Drill"},{ph:"D",nm:"High Knees Sprint"},{ph:"D",nm:"A-Skip"},{ph:"I",nm:"Rapid Toe Taps"},{ph:"D",nm:"Wall Drive Drill"}]},
    {code:"RS2",nEn:"Coordination Circuit",nPt:"Circuito de Coordenação",dEn:"Lateral and stride.",dPt:"Lateral e passada.",list:[{ph:"C",nm:"Carioca Drill"},{ph:"D",nm:"B-Skip"},{ph:"C",nm:"Reactive Side Shuffle Burst"},{ph:"D",nm:"Wicket Drills"},{ph:"E",nm:"Snap-Down"}]},
    {code:"RS3",nEn:"Trail Agility",nPt:"Agilidade de Trail",dEn:"Reactive lateral movements.",dPt:"Movimentos reativos.",list:[{ph:"C",nm:"Lateral Skater Jumps"},{ph:"C",nm:"Diagonal Bound"},{ph:"C",nm:"Carioca Drill"},{ph:"D",nm:"Fast-Foot Drill"},{ph:"J",nm:"Bear Crawl"}]},
    {code:"RS4",nEn:"Speed Mechanics",nPt:"Mecânica de Velocidade",dEn:"Sprint drills.",dPt:"Drills de sprint.",list:[{ph:"D",nm:"A-Skip"},{ph:"D",nm:"B-Skip"},{ph:"D",nm:"High Knees Sprint"},{ph:"D",nm:"Wicket Drills"},{ph:"E",nm:"Snap-Down"}]},
  ]},
  Força:{en:"STRENGTH",pt:"FORÇA",color:"#FF6B35",dEn:"Runners with injury history or training above 70km/week.",dPt:"Corredores com historial de lesões ou acima de 70km/sem.",gEn:"↑ Injury resilience · ↑ Eccentric load tolerance",gPt:"↑ Resistência a lesões",sessions:[
    {code:"FS1",nEn:"Posterior Chain",nPt:"Cadeia Posterior",dEn:"Hamstring and hip hinge.",dPt:"Isquiotibiais e dobradiça da anca.",list:[{ph:"E",nm:"Nordic Hamstring Curl"},{ph:"E",nm:"Good Morning"},{ph:"E",nm:"Floor Hamstring Curl"},{ph:"E",nm:"Bodyweight Single-Leg RDL"},{ph:"J",nm:"Dead Bug with Band"}]},
    {code:"FS2",nEn:"Knee Protection",nPt:"Proteção do Joelho",dEn:"Quad and tibialis eccentric.",dPt:"Carga excêntrica.",list:[{ph:"G",nm:"Wall Sit Explosive Stand"},{ph:"G",nm:"Wall-Supported Sissy Squat"},{ph:"I",nm:"Eccentric Calf Raise"},{ph:"I",nm:"Tibialis Raise"},{ph:"J",nm:"Hollow Body Hold"}]},
    {code:"FS3",nEn:"Glute & Adductor",nPt:"Glúteos & Adutores",dEn:"Hip stability complex.",dPt:"Complexo de estabilidade da anca.",list:[{ph:"H",nm:"Single-Leg Glute Bridge Explode"},{ph:"H",nm:"Donkey Kick Explosive"},{ph:"F",nm:"Copenhagen Adductor Press"},{ph:"H",nm:"Glute Bridge March"},{ph:"J",nm:"Side Plank Hip Dip"}]},
    {code:"FS4",nEn:"Injury Shield",nPt:"Escudo Anti-Lesão",dEn:"Evidence-backed prevention.",dPt:"Prevenção baseada em evidências.",list:[{ph:"E",nm:"Nordic Hamstring Curl"},{ph:"F",nm:"Copenhagen Adductor Press"},{ph:"I",nm:"Tibialis Raise"},{ph:"I",nm:"Banded Dorsiflexion Pulse"},{ph:"J",nm:"Bear Crawl"}]},
  ]},
  Impulsão:{en:"POWER",pt:"IMPULSÃO",color:"#F97316",dEn:"Runners who lose time on climbs or fade in the final third.",dPt:"Corredores que perdem tempo em subidas.",gEn:"↑ Hill power · ↑ Stride propulsion",gPt:"↑ Potência em subidas",sessions:[
    {code:"IS1",nEn:"Hill Power",nPt:"Potência em Subidas",dEn:"Hip drive for climbing.",dPt:"Impulso de anca.",list:[{ph:"B",nm:"Chair Step-Up Jump"},{ph:"H",nm:"Explosive Step-Up with Knee Drive"},{ph:"D",nm:"Resisted Bounding"},{ph:"B",nm:"Bounding (A-Bounds)"},{ph:"J",nm:"Single-Leg Plank Hip Extension"}]},
    {code:"IS2",nEn:"Stride Propulsion",nPt:"Propulsão de Passada",dEn:"Horizontal and hip extension.",dPt:"Potência horizontal.",list:[{ph:"H",nm:"Hip Thrust Jump"},{ph:"B",nm:"Alternating Lunge Jump"},{ph:"F",nm:"Lateral Bound to Stick"},{ph:"B",nm:"Single-Leg Broad Jumps"},{ph:"J",nm:"Pallof Press to Rotation"}]},
    {code:"IS3",nEn:"Peak Power",nPt:"Potência Máxima",dEn:"Maximum single-leg power.",dPt:"Potência unilateral máxima.",list:[{ph:"B",nm:"Bulgarian Split Jump"},{ph:"F",nm:"Explosive Lateral Lunge"},{ph:"F",nm:"Curtsy Lunge"},{ph:"B",nm:"Single-Leg Broad Jumps"},{ph:"J",nm:"Dead Bug with Band"}]},
  ]},
  Core:{en:"CORE",pt:"CORE",color:"#10B981",dEn:"Runners with trunk collapse or lower back pain.",dPt:"Corredores com colapso de tronco ou dor lombar.",gEn:"↑ Trunk stiffness · ↑ Running posture under fatigue",gPt:"↑ Rigidez do tronco · ↑ Postura sob fadiga",sessions:[
    {code:"CS1",nEn:"Anti-Extension Base",nPt:"Base Anti-Extensão",dEn:"Spinal stiffness.",dPt:"Rigidez espinhal.",list:[{ph:"J",nm:"Dead Bug with Band"},{ph:"J",nm:"Hollow Body Hold"},{ph:"J",nm:"Superman Hold"},{ph:"J",nm:"Bear Crawl"},{ph:"I",nm:"Tibialis Raise"}]},
    {code:"CS2",nEn:"Anti-Rotation Focus",nPt:"Foco Anti-Rotação",dEn:"Most running-specific quality.",dPt:"Qualidade core mais específica.",list:[{ph:"J",nm:"Pallof Press to Rotation"},{ph:"J",nm:"Single-Leg Plank Hip Extension"},{ph:"J",nm:"Side Plank Hip Dip"},{ph:"J",nm:"Hollow Body Hold"},{ph:"E",nm:"Bodyweight Single-Leg RDL"}]},
    {code:"CS3",nEn:"Running Posture",nPt:"Postura de Corrida",dEn:"Prevent trunk collapse.",dPt:"Prevenir colapso do tronco.",list:[{ph:"J",nm:"Dead Bug with Band"},{ph:"J",nm:"Bear Crawl"},{ph:"J",nm:"Pallof Press to Rotation"},{ph:"J",nm:"Single-Leg Plank Hip Extension"},{ph:"J",nm:"Side Plank Hip Dip"}]},
  ]},
  Alongamentos:{en:"STRETCHING",pt:"ALONGAMENTOS",color:"#34D399",dEn:"Post-run mobility for road and trail runners.",dPt:"Mobilidade pós-corrida para corredores.",gEn:"↑ Flexibility · ↑ Recovery speed · ↓ Injury risk",gPt:"↑ Flexibilidade · ↑ Recuperação · ↓ Risco de lesão",sessions:[
    {code:"AL1",nEn:"Lower Body Essential",nPt:"Essencial Membros Inferiores",dEn:"5 critical stretches — do after every run.",dPt:"Os 5 mais críticos — após cada corrida.",list:[{ph:"K",nm:"Hip Flexor Lunge"},{ph:"K",nm:"Hamstring Standing"},{ph:"K",nm:"Calf Wall Stretch"},{ph:"K",nm:"Quad Standing"},{ph:"K",nm:"Achilles Low Lunge"}]},
    {code:"AL2",nEn:"Trail Recovery",nPt:"Recuperação de Trail",dEn:"Hip rotators, IT band and adductors.",dPt:"Rotadores da anca, IT band e adutores.",list:[{ph:"K",nm:"IT Band Cross Lean"},{ph:"K",nm:"Figure 4 Supine"},{ph:"K",nm:"Adductor Wide Squat"},{ph:"K",nm:"Glute Supine Pull"},{ph:"K",nm:"Thoracic Rotation"}]},
    {code:"AL3",nEn:"Full Body Runner",nPt:"Corredor Completo",dEn:"Complete 10-stretch routine — after long runs.",dPt:"Rotina completa de 10 alongamentos.",list:[{ph:"K",nm:"Hip Flexor Lunge"},{ph:"K",nm:"Hamstring Standing"},{ph:"K",nm:"Calf Wall Stretch"},{ph:"K",nm:"IT Band Cross Lean"},{ph:"K",nm:"Figure 4 Supine"},{ph:"K",nm:"Quad Standing"},{ph:"K",nm:"Adductor Wide Squat"},{ph:"K",nm:"Achilles Low Lunge"},{ph:"K",nm:"Thoracic Rotation"},{ph:"K",nm:"Glute Supine Pull"}]},
    {code:"AL4",nEn:"Ankle & Spine Mobility",nPt:"Mobilidade Tornozelo & Coluna",dEn:"Most limiting mobility factors in trail.",dPt:"Fatores de mobilidade mais limitantes no trail.",list:[{ph:"K",nm:"Ankle Dorsiflexion Wall"},{ph:"K",nm:"Achilles Low Lunge"},{ph:"K",nm:"Lying Spinal Twist"},{ph:"K",nm:"Thoracic Rotation"},{ph:"K",nm:"World's Greatest Stretch"}]},
    {code:"AL5",nEn:"Deep Hip & Groin",nPt:"Anca Profunda & Virilha",dEn:"Piriformis, adductors and psoas — trail essentials.",dPt:"Piriforme, adutores e psoas.",list:[{ph:"K",nm:"Pigeon Pose"},{ph:"K",nm:"Butterfly Stretch"},{ph:"K",nm:"Figure 4 Supine"},{ph:"K",nm:"Adductor Wide Squat"},{ph:"K",nm:"World's Greatest Stretch"}]},
  ]},
};

const STRETCH_EXES=[
  {name:"Hip Flexor Lunge",holdSec:35,bilateral:true,type:"Alongamentos",focus:"Hip flexors · Psoas",level:"Foundational",sets:"35s each side",rest:"15s",equip:"any",cues:["Back knee on ground, front foot forward","Drive hips forward and down","Keep torso upright","Squeeze glute of back leg"],science:{headline:"Hip flexor tightness reduces stride length — major factor in hamstring injury"}},
  {name:"Hamstring Standing",holdSec:35,bilateral:true,type:"Alongamentos",focus:"Hamstrings · Biceps femoris",level:"Foundational",sets:"35s each side",rest:"15s",equip:"any",cues:["Extend one leg forward at hip height","Hinge at the hip — spine neutral","Feel pull behind the extended thigh","Don't round the lower back"],science:{headline:"Reduces passive muscle tension and improves hip flexion range — key for stride length"}},
  {name:"Calf Wall Stretch",holdSec:30,bilateral:true,type:"Alongamentos",focus:"Gastrocnemius · Calf",level:"Foundational",sets:"30s each side",rest:"12s",equip:"any",cues:["Hands on wall, step one foot back","Back heel pressed into the ground","Back leg completely straight","Lean hips forward toward the wall"],science:{headline:"Limited dorsiflexion from calf tightness is a primary predictor of running injury"}},
  {name:"Quad Standing",holdSec:30,bilateral:true,type:"Alongamentos",focus:"Quadriceps · Rectus femoris",level:"Foundational",sets:"30s each side",rest:"12s",equip:"any",cues:["Stand on one leg — use wall for balance","Pull other heel toward your glutes","Knees together","Stand tall — no forward lean"],science:{headline:"Rectus femoris tightness limits hip extension in late stance — reduces stride length"}},
  {name:"IT Band Cross Lean",holdSec:35,bilateral:true,type:"Alongamentos",focus:"IT Band · TFL · Lateral hip",level:"Foundational",sets:"35s each side",rest:"15s",equip:"any",cues:["Cross one leg behind the other","Lean sideways away from the back leg","Both feet flat on the ground","Push hip of the back leg outward"],science:{headline:"IT band syndrome is the most common running overuse injury — TFL stretching reduces recurrence"}},
  {name:"Figure 4 Supine",holdSec:40,bilateral:true,type:"Alongamentos",focus:"Piriformis · Glutes · External rotators",level:"Foundational",sets:"40s each side",rest:"15s",equip:"any",cues:["Lie on back, cross one ankle over opposite knee","Pull both legs toward your chest","Keep head and shoulders on the ground","Flex the foot of the crossed leg"],science:{headline:"Piriformis tightness compresses the sciatic nerve — critical limitation for trail runners"}},
  {name:"Adductor Wide Squat",holdSec:35,bilateral:false,type:"Alongamentos",focus:"Adductors · Inner thigh",level:"Foundational",sets:"2×35s",rest:"15s",equip:"any",cues:["Wide stance — toes out 45°","Drop into deep squat, elbows on inner knees","Press knees outward with elbows","Heels flat on ground"],science:{headline:"Adductor flexibility reduces groin injury risk and improves lateral movement efficiency"}},
  {name:"Achilles Low Lunge",holdSec:30,bilateral:true,type:"Alongamentos",focus:"Achilles tendon · Soleus",level:"Foundational",sets:"30s each side",rest:"12s",equip:"any",cues:["Kneeling lunge — back knee on ground","Slight bend in back knee — targets soleus","Shift weight forward until you feel lower calf","Hold still — no bouncing"],science:{headline:"Soleus tightness limits late-stance ankle dorsiflexion — more relevant than gastrocnemius"}},
  {name:"Thoracic Rotation",holdSec:25,bilateral:true,type:"Alongamentos",focus:"Thoracic spine · Upper back",level:"Foundational",sets:"25s each side",rest:"12s",equip:"any",cues:["Sit cross-legged, arms crossed on chest","Rotate upper body as far as possible","Hips stay square — only upper spine rotates","Look over the shoulder you're rotating toward"],science:{headline:"Thoracic rotation mobility directly affects arm swing efficiency on technical trail"}},
  {name:"Glute Supine Pull",holdSec:35,bilateral:true,type:"Alongamentos",focus:"Gluteus maximus · Hip extensors",level:"Foundational",sets:"35s each side",rest:"12s",equip:"any",cues:["Lie on back, pull one knee toward opposite shoulder","Other leg flat on the ground","Keep head and shoulders relaxed","Feel the stretch deep in the glute"],science:{headline:"Glute flexibility improves hip extension range and running power transfer"}},
  {name:"Pigeon Pose",holdSec:45,bilateral:true,type:"Alongamentos",focus:"Piriformis · Deep glute · External rotators",level:"Foundational",sets:"45s each side",rest:"15s",equip:"any",cues:["Front shin parallel to the mat","Hips square to the ground","Sink hip toward ground — don't force","Upper body upright or folded forward"],science:{headline:"Most effective deep hip rotator stretch — reduces sciatic nerve tension from piriformis"}},
  {name:"Butterfly Stretch",holdSec:40,bilateral:false,type:"Alongamentos",focus:"Adductors · Inner thigh · Groin",level:"Foundational",sets:"2×40s",rest:"12s",equip:"any",cues:["Soles of feet together — close to hips","Elbows gently press inner knees toward ground","Lean forward from the hip — spine neutral","Feel stretch along inner thighs"],science:{headline:"Improves hip adductor flexibility essential for lateral stability on trail terrain"}},
  {name:"Ankle Dorsiflexion Wall",holdSec:30,bilateral:true,type:"Alongamentos",focus:"Ankle joint · Tibialis anterior · Achilles",level:"Foundational",sets:"30s each side",rest:"12s",equip:"any",cues:["Place front foot 5–10 cm from wall","Drive knee toward wall over 3rd toe","Keep heel flat — don't let it rise","Gradually increase foot-to-wall distance"],science:{headline:"Limited ankle dorsiflexion (under 35°) is a strong predictor of knee injury in trail runners"}},
  {name:"Lying Spinal Twist",holdSec:35,bilateral:true,type:"Alongamentos",focus:"Lumbar spine · Thoracolumbar fascia · Glute",level:"Foundational",sets:"35s each side",rest:"12s",equip:"any",cues:["Lie on your back, arms in a T","Pull one knee across the body to opposite side","Keep opposite shoulder pinned to floor","Turn head away from pulled knee"],science:{headline:"Lumbar rotation mobility reduces lower back pain — common consequence of repetitive running"}},
  {name:"World's Greatest Stretch",holdSec:30,bilateral:true,type:"Alongamentos",focus:"Hip flexors · Thoracic spine · Hamstrings · Groin",level:"Intermediate",sets:"30s each side",rest:"15s",equip:"any",cues:["Start in a deep lunge — front foot beside hand","Rotate upper body and reach toward ceiling","Hold the top position — feel the thoracic open","Lower, then repeat on the other side"],science:{headline:"Covers 5 major running muscle groups in one movement — highest time-efficiency stretch"}},
];

const PHASE_K_EXES = STRETCH_EXES.map(e=>({...e,phaseId:"K",phaseColor:"#34D399"}));

/* ─── EQUIPMENT MAP ─────────────────────────────────────────────────────── */
// exercises not listed default to "any" (doable at home)
const EQUIP = {
  "Rotational Box Jump":"gym","Wicket Drills":"gym",
  "Lateral Hurdle Hop (Single-Leg)":"gym","Copenhagen Adductor Press":"gym",
  "Plyometric RFESS":"gym","Drop Jump to Broad Jump":"gym",
  "Romanian Deadlift":"gym","Glute Ham Raise":"gym",
  "Single-Leg Leg Press":"gym","Barbell Hip Thrust":"gym",
  "Adductor Machine":"gym","Sled Push":"gym","Weighted Step-Up":"gym",
};

/* ─── EXERCISE BUILDER ──────────────────────────────────────────────────── */
const mk=(n,sets,rest,type,focus,lvl,cues,hl,equip="any")=>({name:n,sets,rest,type,focus,level:lvl,equip,cues,science:{headline:hl}});

const PHASES=[
  {id:"A",label:"STIFFNESS & ELASTICITY",labelPt:"RIGIDEZ & ELASTICIDADE",color:"#E8FF47",desc:"Ground contact time reduction.",descPt:"Redução do tempo de contacto.",exercises:[
    mk("Pogo Hops","3×20","90s","Elasticidade","Achilles tendon elastic energy","Foundational",["Stay on forefoot","Ankles stiff like springs","Minimal ground contact","Arms relaxed"],"Reduces ground contact time ~14% in 6 weeks"),
    mk("Single-Leg Pogo Hops","3×15 each","90s","Elasticidade","Unilateral ankle stiffness","Foundational",["Hop on one forefoot","Lock the ankle","Drive free knee up","Match rhythm both sides"],"Exposes left-right stiffness asymmetries"),
    mk("Double-Leg Hurdle Hops","3×6","2min","Pliometria","Reactive stiffness & RFD","Intermediate",["Rebound immediately","Push the ground away","Keep hips tall","Land mid-foot, spring off"],"Trains ground contacts <200ms"),
    mk("Tuck Jump","3×8","90s","Pliometria","Triple extension + reactive landing","Intermediate",["Jump and pull knees to chest","Land on forefoot — immediate rebound","Upright posture","Focus on knee speed"],"Explosive hip flexion and reactive landing"),
    mk("Depth Drop → Rebound","3×5","2min","Pliometria","Neuromuscular reactivity & RSI","Advanced",["Step off 40–50cm box","Absorb minimally — rebound fast","Target contact <200ms","Slight knee bend"],"Increases RSI — key predictor of running economy"),
  ]},
  {id:"B",label:"HIP POWER & PROPULSION",labelPt:"POTÊNCIA DA ANCA",color:"#FF6B35",desc:"Horizontal force production.",descPt:"Produção de força horizontal.",exercises:[
    mk("Squat Jump","3×10","90s","Pliometria","Bilateral hip and quad power","Foundational",["Quarter squat","Explode upward","Land softly on forefoot","Trunk upright"],"Most studied plyometric in running economy research"),
    mk("Chair Step-Up Jump","3×6 each","90s","Impulsão","Unilateral hip extension","Foundational",["Use sturdy chair ~45cm","Drive opposite knee above hip","Land soft","Focus on hip drive"],"High glute max and quad activation"),
    mk("Single-Leg Broad Jumps","4×4 each","90s","Impulsão","Unilateral power & gluteal drive","Intermediate",["Drive off one leg — stick landing","Aggressive hip extension","Reach forward with opposite knee","Control landing"],"Directly mimics single-leg push-off mechanics"),
    mk("Alternating Lunge Jump","3×10","90s","Impulsão","Alternating single-leg hip power","Intermediate",["Start in lunge","Explode upward switching legs","Land in opposite lunge — soft","Arms drive the switch"],"Trains alternating hip power"),
    mk("Bounding (A-Bounds)","3×30m","2min","Elasticidade","Hip extension power & stride","Intermediate",["Exaggerated running — slow-motion power","High knee drive","Full hip extension on push-off","Strong arm swings"],"Increases musculotendinous stiffness"),
    mk("Bulgarian Split Jump","3×6 each","2min","Força","Single-leg explosive hip power","Advanced",["Rear foot elevated 40–50cm","Explosive jump switching legs","Land soft","Torso upright"],"Fixes left-right force asymmetries at 80km+/week"),
    mk("Sled Push","4×20m","2min","Impulsão","Hip extension — maximal horizontal force","Intermediate",["Hands on sled at hip height","Lean forward 45° — body aligned","Drive through full triple extension","Short powerful steps — forefoot only"],"Sled push trains horizontal force at sprint-specific angles — highest transfer to hill running","gym"),
    mk("Weighted Step-Up","3×8 each","90s","Impulsão","Single-leg quad & glute — loaded","Intermediate",["Box ~45cm — dumbbell in each hand","Drive through heel of lead foot only","Torso upright — no forward lean","Fully extend hip at top"],"Loaded step-up has the highest correlation to uphill running speed of any single-leg exercise","gym"),
  ]},
  {id:"C",label:"LATERAL & ROTATIONAL",labelPt:"CONTROLO LATERAL",color:"#00D4FF",desc:"Frontal plane stability.",descPt:"Estabilidade no plano frontal.",exercises:[
    mk("Carioca Drill","3×20m each","60s","Reflexo","Lateral coordination","Foundational",["Cross trailing foot alternately","Stay on forefoot","Drive hips not just feet","Gradually increase speed"],"Trains hip rotation and frontal-plane coordination"),
    mk("Reactive Side Shuffle Burst","4×10m each","60s","Reflexo","Lateral reactive power","Foundational",["Stay low — hips bent","Drive laterally through outside leg","Push off and reset","Keep shoulders square"],"Improves lateral reactive speed — essential for trail"),
    mk("Lateral Skater Jumps","3×10","90s","Reflexo","Medial glute & lateral hip","Intermediate",["Land on single leg — hold 1s","Push laterally with hip","Shin angle positive","Glute drives the push"],"Trains frontal-plane stability — most undertrained"),
    mk("Diagonal Bound","3×5 each","90s","Reflexo","Multi-directional reactive power","Intermediate",["Bound forward at 45° off one leg","Land on opposite leg — hold 1s","Alternate direction","Drive inside arm"],"Multi-directional power for trail"),
    mk("Rotational Box Jump","3×4 each","2min","Pliometria","Transverse plane power","Advanced",["Stand sideways to box","Quarter-turn jump, land facing forward","Control landing","Drive off inside leg"],"Develops transverse plane stability","gym"),
  ]},
  {id:"D",label:"SPEED & NEURAL SHARPNESS",labelPt:"VELOCIDADE NEUROMUSCULAR",color:"#C084FC",desc:"Fast-twitch recruitment.",descPt:"Recrutamento de fibras rápidas.",exercises:[
    mk("A-Skip","3×20m","60s","Reflexo","Hip flexor timing","Foundational",["Drive knee to hip height","Grounded foot on forefoot","Drive opposite arm","Consistent rhythm"],"Classic sprint drill"),
    mk("B-Skip","3×20m","60s","Reflexo","Hamstring speed & pawing","Foundational",["Like A-Skip but extend knee at top","Claw foot back — pawing","Torso upright","Mechanics over pace"],"Trains hamstring speed"),
    mk("High Knees Sprint","4×20m","60s","Reflexo","Hip flexor speed + cadence","Foundational",["Drive knees above hip","Land on forefoot under hip","Pump arms aggressively","Full speed for 20m"],"Increases hip flexor RFD"),
    mk("Fast-Foot Drill","4×10m","60s","Reflexo","Cadence & neural firing","Foundational",["Max foot turnover — not power","Light quick contacts","Eyes forward","Relax hands and jaw"],"Raises optimal cadence"),
    mk("Wall Drive Drill","4×10 each","60s","Reflexo","Hip flexor power","Intermediate",["Hands on wall, lean 45°","Drive knee explosively","Lower back controlled","Rigid plank position"],"Isolates hip flexor power in exact running position"),
    mk("Wicket Drills","3×30m","90s","Reflexo","Stride mechanics","Intermediate",["Wickets for slight over-stride challenge","High hips","Quick pawing","Build frequency"],"Corrects overstriding","gym"),
    mk("Resisted Bounding","3×20m","2min","Impulsão","Power endurance","Advanced",["5–8% incline or band","Maximum effort","Full triple extension","Full recovery"],"Overloads triple extension"),
  ]},
  {id:"E",label:"HAMSTRINGS",labelPt:"ISQUIOTIBIAIS",color:"#F97316",desc:"Posterior chain loading.",descPt:"Carga da cadeia posterior.",exercises:[
    mk("Bodyweight Single-Leg RDL","3×10 each","90s","Força","Hamstring eccentric control","Foundational",["One leg slight knee bend","Hinge at hip — reach to floor","Feel hamstring stretch","Drive heel — squeeze glute at top"],"Foundational hamstring eccentric control"),
    mk("Good Morning","3×10","90s","Força","Hip hinge strength","Foundational",["Hands behind head","Hinge at hip — flat back","Feel hamstrings load","Drive through heels"],"Builds hip hinge strength"),
    mk("Snap-Down","3×6","90s","Reflexo","Reactive hip hinge","Foundational",["Start tall slight lean","Snap hips back aggressively","Land in quarter-squat","Rebound immediately"],"Trains rapid hamstring pre-activation"),
    mk("Floor Hamstring Curl","3×8","90s","Força","Eccentric hamstring strength","Intermediate",["Feet on smooth floor in socks","Bridge hips fully then curl heels","Keep hips elevated","Extend legs slowly"],"At-home eccentric hamstring exercise"),
    mk("Single-Leg RDL Jump","3×4 each","90s","Força","Hip hinge power","Intermediate",["Hinge on one leg","Drive explosively to jump","Land softly on same leg","Reset fully"],"Trains hamstring at most critical position"),
    mk("Nordic Hamstring Curl","3×5","2min","Força","Eccentric strength — injury prevention","Advanced",["Kneel with feet anchored","Lower slowly 3–4 seconds","Control descent","Drive back up using hamstrings"],"Reduces hamstring injury risk by up to 51%"),
    mk("Romanian Deadlift","3×8","2min","Força","Hamstring eccentric — barbell load","Foundational",["Bar over mid-foot hip-width stance","Hinge at hip — bar stays close to legs","Feel hamstring stretch neutral spine","Drive hips forward to lockout"],"Barbell RDL loads hamstrings at long muscle lengths — superior eccentric stimulus vs any bodyweight exercise","gym"),
    mk("Glute Ham Raise","3×6","2min","Força","Hamstring at full extension — GHD","Advanced",["Secure feet in GHD machine — start upright","Lower forward very slowly — 4 seconds","Hamstrings and glutes resist the descent","Use hands to assist the return if needed"],"GHR uniquely loads hamstrings at both hip and knee simultaneously — highest hamstring EMG of any exercise","gym"),
  ]},
  {id:"F",label:"ADDUCTORS",labelPt:"ADUTORES",color:"#EC4899",desc:"Medial hip stability.",descPt:"Estabilidade medial da anca.",exercises:[
    mk("Sumo Squat Jump","3×10","90s","Pliometria","Adductor loading","Foundational",["Wide stance toes out","Squat to parallel explode","Land in same stance — soft","Knees track toes"],"Wide stance activates adductors ~40% more"),
    mk("Explosive Lateral Lunge","3×8 each","90s","Impulsão","Adductor SSC","Foundational",["Step wide to side deep lunge","Push explosively back to centre","Feel adductor stretch","Build speed"],"Loads adductors at wide hip angles"),
    mk("Curtsy Lunge","3×10 each","90s","Impulsão","Adductor at running angles","Intermediate",["Step diagonally behind","Lower until front thigh parallel","Front knee over second toe","Drive back through front heel"],"Running-specific hip angles"),
    mk("Lateral Bound to Stick","3×5 each","90s","Impulsão","Adductor propulsion","Intermediate",["Push off laterally through inside foot","Land on opposite leg — hold 1s","Squeeze inner thigh","Knee stays out"],"Trains adductors as propulsors"),
    mk("Copenhagen Adductor Press","3×8 each","90s","Força","Adductor longus strength","Intermediate",["Side-lying top foot on bench","Lift hips using top leg","Straight body line","Lower slowly 2 seconds"],"Reduces groin injury by 41%","gym"),
    mk("Lateral Hurdle Hop (Single-Leg)","3×5 each","2min","Pliometria","Reactive medial hip","Advanced",["Hop laterally over hurdles on single leg","Land and immediately rebound","Drive free knee up","Stance knee slightly bent"],"Combines adductor load with reactive stiffness","gym"),
    mk("Adductor Machine","3×12","60s","Força","Adductor longus — isolated load","Foundational",["Sit upright — back against pad","Set range to a mild stretch","Squeeze thighs together to full contraction","Control the return — 3s eccentric"],"Adductor machine isolates adductors at running-relevant ranges — used in the original Copenhagen research","gym"),
  ]},
  {id:"G",label:"QUADRICEPS",labelPt:"QUADRICÍPITES",color:"#14B8A6",desc:"Knee extensor power.",descPt:"Potência extensora do joelho.",exercises:[
    mk("Wall Sit Explosive Stand","3×10","90s","Força","Quad endurance","Foundational",["Wall sit 90° knee and hip","Hold 3s then explode","Land with soft knees","Return with control"],"Quad fatigue tolerance — trail descent"),
    mk("Wall-Supported Sissy Squat","3×8","90s","Força","Patellar tendon loading","Intermediate",["Heels slightly elevated","Hold wall lightly","Lean back knees forward","Keep hips extended"],"Loads quads at long muscle lengths"),
    mk("Drop Jump to Broad Jump","3×5","2min","Pliometria","Eccentric absorption to propulsion","Advanced",["Step off 30–40cm box","Absorb briefly then explode forward","Maximise horizontal distance","Land both feet soft"],"Trains eccentric-concentric coupling","gym"),
    mk("Plyometric RFESS","3×5 each","2min","Força","Single-leg quad power","Advanced",["Rear foot on bench","Sink into lunge front knee over toe","Drive explosively off front foot","Land on same foot"],"Highest unilateral quad loading","gym"),
    mk("Single-Leg Leg Press","3×10 each","90s","Força","Single-leg quad — high load tolerance","Intermediate",["One foot on plate — hip-width from centre","Lower slowly 3s — knee tracks over 3rd toe","Stop before hips curl off pad","Drive through heel to full extension"],"Single-leg leg press allows quad loading volumes impossible with bodyweight — essential for runners above 70km/week","gym"),
  ]},
  {id:"H",label:"GLUTES",labelPt:"GLÚTEOS",color:"#8B5CF6",desc:"Primary driver of running propulsion.",descPt:"Motor principal da propulsão.",exercises:[
    mk("Single-Leg Glute Bridge Explode","3×5 each","90s","Força","Unilateral glute max","Foundational",["Lie back one foot flat","Drive heel to raise hips","Sharp push at top","Lower with control"],"Mimics single-leg stance demands"),
    mk("Glute Bridge March","3×10 each","60s","Força","Glute endurance","Foundational",["Bridge hips fully","Raise one knee slowly","Hold 2s — keep hips level","Alternate without dropping"],"Trains glute endurance and hip-core coupling"),
    mk("Donkey Kick Explosive","3×12 each","60s","Força","Glute max isolation","Foundational",["On hands and knees neutral spine","Drive heel toward ceiling","Pause 1s at top","Lower with control"],"Isolates glute max in hip extension"),
    mk("Explosive Step-Up with Knee Drive","3×8 each","90s","Impulsão","Glute max + hip drive","Intermediate",["Chair ~40cm","Drive opposite knee above hip","Hold top 1s — squeeze glute","Focus on glute engagement"],"Trains glute-hip drive coupling"),
    mk("Hip Thrust Jump","3×6","90s","Impulsão","Explosive glute max","Intermediate",["Upper back on bench feet hip-width","Drive hips explosively","Land soft reload immediately","Chin tucked"],"Hip thrust = highest gluteus maximus EMG"),
    mk("Lateral Band Walk to Squat Jump","3×8 each","90s","Força","Glute medius → glute max","Advanced",["Band above knees","3 lateral steps hips low","On final step explosive squat jump","Land soft reset"],"Pre-activates glute medius"),
    mk("Barbell Hip Thrust","3×8","90s","Força","Gluteus maximus — peak load","Intermediate",["Upper back on bench — barbell across hip crease","Feet hip-width shin vertical at top","Drive hips up until body is fully horizontal","Squeeze glutes hard at top — 1s pause"],"Barbell hip thrust: highest gluteus maximus EMG of any loaded exercise — 3× the activation of barbell squats","gym"),
  ]},
  {id:"I",label:"TIBIA & ANTERIOR LEG",labelPt:"TÍBIA & PERNA ANTERIOR",color:"#06B6D4",desc:"Tibialis anterior and dorsiflexion.",descPt:"Tibial anterior e dorsiflexão.",exercises:[
    mk("Heel Walk","3×20m","60s","Força","Tibialis anterior endurance","Foundational",["Raise forefoot — walk on heels","Keep toes pulled up high","Normal pace","Add uphill for challenge"],"Most accessible tibialis anterior drill"),
    mk("Tibialis Raise","3×15","60s","Força","Tibialis anterior strength","Foundational",["Heels on step back on wall","Raise toes as high as possible","Hold 1s at top","Lower slowly 3s"],"Directly targets tibialis anterior"),
    mk("Rapid Toe Taps","4×15s","60s","Reflexo","Tibialis speed + neural","Foundational",["Face a low step","Alternate tapping as fast as possible","Stay on ball of standing foot","Max foot speed"],"Trains tibialis at running-relevant rates"),
    mk("Banded Dorsiflexion Pulse","3×12 each","60s","Força","Dorsiflexion range","Intermediate",["Sit on floor band around foot","Pull toes toward shin against band","2 quick pulses at end range","Keep heel grounded"],"Limited dorsiflexion = primary injury risk"),
    mk("Eccentric Calf Raise","3×12","60s","Força","Achilles eccentric loading","Intermediate",["Rise on two feet","Lower slowly on one foot 3–4s","Full range — heel drops below step","Lowering leg knee straight"],"Gold standard Achilles strengthening"),
  ]},
  {id:"J",label:"CORE",labelPt:"CORE",color:"#10B981",desc:"Anti-rotation and spinal stiffness.",descPt:"Rigidez anti-rotação.",exercises:[
    mk("Bear Crawl","3×15m","60s","Core","Core stability under locomotion","Foundational",["On hands and knees raise knees 5cm","Alternate opposite hand and foot","Hips level — don't rotate","Slow and deliberate"],"Trains contralateral coordination mirroring running"),
    mk("Dead Bug with Band","3×8 each","60s","Core","Anti-extension stiffness","Foundational",["Lie back arms up band around foot","Lower opposite arm and leg","Lower back pressed into floor","Exhale down inhale returning"],"Anti-extension reduces energy leakage"),
    mk("Hollow Body Hold","3×25s","60s","Core","Anterior core stiffness","Intermediate",["Lie back arms overhead","Press lower back into floor","Raise shoulders and legs slightly","Regress by bending knees"],"Trains anterior core stiffness"),
    mk("Pallof Press to Rotation","3×8 each","90s","Core","Anti-rotation stiffness","Intermediate",["Stand sideways to band anchor","Press hands straight out — resist pull","Rotate away from anchor","Return before bringing hands back"],"Anti-rotation directly improves running economy"),
    mk("Single-Leg Plank Hip Extension","3×6 each","60s","Core","Posterior core + glute","Intermediate",["Forearm plank straight line","Raise one leg straight knee","Hold 2s — squeeze glute","Lower with control no hip drop"],"Trains posterior chain-core link"),
    mk("Side Plank Hip Dip","3×10 each","60s","Core","Lateral core endurance","Intermediate",["Side plank on forearm straight line","Lower hip toward floor 2s","Drive hip back to neutral","Keep top hip stacked"],"Prevents hip drop under fatigue"),
    mk("Superman Hold","3×10","60s","Core","Posterior chain endurance","Foundational",["Lie face down arms overhead","Simultaneously raise arms chest and legs","Hold 3s — squeeze glutes and upper back","Lower with control"],"Trains posterior chain in extension"),
  ]},
  {id:"K",label:"STRETCHING — MOBILITY",labelPt:"ALONGAMENTOS — MOBILIDADE",color:"#34D399",
   desc:"Post-run mobility. Hold each stretch — no bouncing.",
   descPt:"Mobilidade pós-corrida. Segura cada alongamento.",
   exercises:PHASE_K_EXES},
];

const SESSIONS=[
  {code:"S1",nEn:"Elasticity & Strength",nPt:"Elasticidade & Força",tags:["Elasticidade","Força","Core"],dEn:"Foundation: elastic spring and basic single-leg strength.",dPt:"Base: elasticidade e força unilateral.",list:[{ph:"A",nm:"Pogo Hops"},{ph:"A",nm:"Single-Leg Pogo Hops"},{ph:"B",nm:"Squat Jump"},{ph:"E",nm:"Bodyweight Single-Leg RDL"},{ph:"H",nm:"Single-Leg Glute Bridge Explode"},{ph:"G",nm:"Wall Sit Explosive Stand"},{ph:"I",nm:"Tibialis Raise"},{ph:"J",nm:"Dead Bug with Band"}]},
  {code:"S2",nEn:"Power & Reflex",nPt:"Impulsão & Reflexo",tags:["Pliometria","Reflexo","Impulsão"],dEn:"Explosive power and neural sharpness.",dPt:"Potência explosiva e nitidez neural.",list:[{ph:"A",nm:"Double-Leg Hurdle Hops"},{ph:"D",nm:"High Knees Sprint"},{ph:"D",nm:"Fast-Foot Drill"},{ph:"B",nm:"Single-Leg Broad Jumps"},{ph:"C",nm:"Lateral Skater Jumps"},{ph:"H",nm:"Hip Thrust Jump"},{ph:"I",nm:"Rapid Toe Taps"},{ph:"J",nm:"Bear Crawl"}]},
  {code:"S3",nEn:"Lateral Control",nPt:"Controlo Lateral",tags:["Reflexo","Força","Core"],dEn:"Correct lateral instability and neglected groups.",dPt:"Instabilidade lateral e grupos negligenciados.",list:[{ph:"C",nm:"Carioca Drill"},{ph:"C",nm:"Reactive Side Shuffle Burst"},{ph:"F",nm:"Copenhagen Adductor Press"},{ph:"F",nm:"Explosive Lateral Lunge"},{ph:"E",nm:"Nordic Hamstring Curl"},{ph:"I",nm:"Heel Walk"},{ph:"I",nm:"Banded Dorsiflexion Pulse"},{ph:"J",nm:"Pallof Press to Rotation"}]},
  {code:"S4",nEn:"Full Integration — Race Prep",nPt:"Integração Total — Prova",tags:["Pliometria","Força","Elasticidade","Impulsão"],dEn:"Peak session — all qualities. Use 2–3 weeks before race.",dPt:"Sessão de pico com todas as qualidades.",list:[{ph:"A",nm:"Depth Drop → Rebound"},{ph:"B",nm:"Bounding (A-Bounds)"},{ph:"B",nm:"Bulgarian Split Jump"},{ph:"E",nm:"Single-Leg RDL Jump"},{ph:"F",nm:"Lateral Bound to Stick"},{ph:"G",nm:"Drop Jump to Broad Jump"},{ph:"H",nm:"Explosive Step-Up with Knee Drive"},{ph:"J",nm:"Single-Leg Plank Hip Extension"}]},
];

const PT={"Pogo Hops":"Saltos Pogo","Single-Leg Pogo Hops":"Saltos Pogo (1 Pé)","Double-Leg Hurdle Hops":"Saltos sobre Barreiras","Tuck Jump":"Salto Tuck","Depth Drop → Rebound":"Queda → Ressalto","Squat Jump":"Salto em Agachamento","Chair Step-Up Jump":"Salto de Cadeira","Single-Leg Broad Jumps":"Salto Comprimento (1 Pé)","Alternating Lunge Jump":"Salto Afundo Alternado","Bounding (A-Bounds)":"Corrida Saltada","Bulgarian Split Jump":"Salto Búlgaro","Carioca Drill":"Carioca","Reactive Side Shuffle Burst":"Shuffle Lateral","Lateral Skater Jumps":"Saltos Patinador","Diagonal Bound":"Salto Diagonal","Rotational Box Jump":"Salto Caixa Rotação","A-Skip":"A-Skip","B-Skip":"B-Skip","High Knees Sprint":"Sprint Joelhos Altos","Fast-Foot Drill":"Pés Rápidos","Wall Drive Drill":"Impulso na Parede","Wicket Drills":"Wicket Drills","Resisted Bounding":"Corrida Saltada Resistida","Bodyweight Single-Leg RDL":"RDL Peso Corporal","Good Morning":"Good Morning","Snap-Down":"Snap-Down","Floor Hamstring Curl":"Curl Isquiotibiais","Single-Leg RDL Jump":"Salto RDL (1 Pé)","Nordic Hamstring Curl":"Curl Nórdico","Sumo Squat Jump":"Salto Sumo","Explosive Lateral Lunge":"Afundo Lateral Explosivo","Curtsy Lunge":"Afundo Curtsy","Lateral Bound to Stick":"Salto Lateral Estável","Copenhagen Adductor Press":"Press de Copenhague","Lateral Hurdle Hop (Single-Leg)":"Salto Lateral Barreiras","Wall Sit Explosive Stand":"Parede + Explosão","Wall-Supported Sissy Squat":"Sissy Squat","Drop Jump to Broad Jump":"Queda + Salto Comprimento","Plyometric RFESS":"RFESS Pliométrico","Single-Leg Glute Bridge Explode":"Ponte Glútea (1 Pé)","Glute Bridge March":"Marcha Ponte Glútea","Donkey Kick Explosive":"Donkey Kick","Explosive Step-Up with Knee Drive":"Subida Explosiva","Hip Thrust Jump":"Salto Impulso Anca","Lateral Band Walk to Squat Jump":"Marcha Lateral → Salto","Heel Walk":"Marcha nos Calcanhares","Tibialis Raise":"Elevação do Tibial","Rapid Toe Taps":"Taps Rápidos","Banded Dorsiflexion Pulse":"Pulso Dorsiflexão","Eccentric Calf Raise":"Elevação Excêntrica","Bear Crawl":"Bear Crawl","Dead Bug with Band":"Dead Bug","Hollow Body Hold":"Hollow Body","Pallof Press to Rotation":"Press de Pallof","Single-Leg Plank Hip Extension":"Prancha (1 Pé)","Side Plank Hip Dip":"Prancha Lateral","Superman Hold":"Superman",
  "Hip Flexor Lunge":"Afundo Flexor da Anca","Hamstring Standing":"Isquiotibiais de Pé","Calf Wall Stretch":"Gémeos na Parede","Quad Standing":"Quadricípite de Pé","IT Band Cross Lean":"IT Band / TFL","Figure 4 Supine":"Figura 4 Deitado","Adductor Wide Squat":"Agachamento Largo Adutores","Achilles Low Lunge":"Aquiles — Afundo Baixo","Thoracic Rotation":"Rotação Torácica","Glute Supine Pull":"Glúteo Deitado","Pigeon Pose":"Postura do Pombo","Butterfly Stretch":"Borboleta","Ankle Dorsiflexion Wall":"Dorsiflexão na Parede","Lying Spinal Twist":"Torção Espinhal Deitado","World's Greatest Stretch":"O Maior Alongamento",
  "Romanian Deadlift":"Peso Morto Romeno","Glute Ham Raise":"Curl Isquiotibial GHD","Single-Leg Leg Press":"Leg Press (1 Pé)","Barbell Hip Thrust":"Hip Thrust com Barra","Adductor Machine":"Máquina de Adutores","Sled Push":"Empurrar Trenó","Weighted Step-Up":"Subida com Peso",
};

const PLAN_CFG={
  15:{exDur:30,restDur:30,minBlocks:1,maxBlocks:2,nStretches:3,label:"Express",labelPt:"Expresso"},
  20:{exDur:35,restDur:35,minBlocks:1,maxBlocks:2,nStretches:4,label:"Short",labelPt:"Curto"},
  30:{exDur:40,restDur:50,minBlocks:2,maxBlocks:3,nStretches:5,label:"Standard",labelPt:"Standard"},
  45:{exDur:45,restDur:60,minBlocks:3,maxBlocks:3,nStretches:6,label:"Extended",labelPt:"Alargado"},
  60:{exDur:50,restDur:70,minBlocks:3,maxBlocks:3,nStretches:8,label:"Full Session",labelPt:"Sessão Completa"},
};
const STRETCH_REST_PLAN=12;
const AVG_STRETCH_SLOT=71;
const stretchBlockSec=n=>n>0?n*AVG_STRETCH_SLOT-12:0;

function planParams(minutes,hasStretch){
  const cfg=PLAN_CFG[minutes];
  const{exDur,restDur,minBlocks,maxBlocks,nStretches}=cfg;
  const slot=exDur+restDur,nS=hasStretch?nStretches:0,sBSec=stretchBlockSec(nS);
  let best=null;
  for(let blk=minBlocks;blk<=maxBlocks;blk++)
    for(let nEx=4;nEx<=12;nEx++){
      const mainTime=blk*nEx*slot-restDur;if(mainTime<60)continue;
      const total=mainTime+sBSec,diff=Math.abs(total-minutes*60);
      if(!best||diff<best.diff)best={blocks:blk,nEx,estSec:total,diff};
    }
  return{...(best||{blocks:2,nEx:6,estSec:minutes*60,diff:0}),exDur,restDur,nStretches:nS,stretchBlockSec:sBSec};
}

const levelColor={Foundational:"#22c55e",Intermediate:"#f59e0b",Advanced:"#ef4444"};
const REST_BY_TYPE={Elasticidade:75,Pliometria:90,Reflexo:45,Força:90,Impulsão:90,Core:60,Alongamentos:15};

const TYPE_EX_MAP={};
Object.keys(TYPES).forEach(t=>{TYPE_EX_MAP[t]=[];});
PHASES.forEach(ph=>ph.exercises.forEach(ex=>{if(TYPE_EX_MAP[ex.type])TYPE_EX_MAP[ex.type].push({...ex,phaseId:ph.id,phaseColor:ph.color});}));

const ALL_SESSIONS=(()=>{
  const all=[];
  SESSIONS.forEach(s=>all.push({id:s.code,nEn:s.nEn,nPt:s.nPt,dEn:s.dEn,dPt:s.dPt,list:s.list||[],tags:s.tags||[],catColor:"#888",catEn:"Monthly Block",catPt:"Bloco Mensal",defRest:90}));
  Object.entries(TYPES).forEach(([key,info])=>(info.sessions||[]).forEach(s=>all.push({id:s.code,nEn:s.nEn,nPt:s.nPt,dEn:s.dEn,dPt:s.dPt,list:s.list||[],tags:[key],catColor:info.color,catEn:info.en,catPt:info.pt,defRest:REST_BY_TYPE[key]||75})));
  return all;
})();

const resolveList=list=>(list||[]).map(item=>{
  const ph=PHASES.find(p=>p.id===item.ph);
  const ex=ph&&ph.exercises.find(e=>e.name===item.nm);
  return ex?{...ex,phaseId:item.ph,phaseColor:ph.color}:null;
}).filter(Boolean);

const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const fmtMin=s=>`~${Math.round(s/60)} min`;
const shuffle=arr=>[...arr].sort(()=>Math.random()-.5);

let _ac=null;
const getAC=()=>{try{if(!_ac||_ac.state==='closed')_ac=new(window.AudioContext||window.webkitAudioContext)();if(_ac.state==='suspended')_ac.resume();return _ac;}catch(e){return null;}};
const playBeep=(count,freq,dur)=>{const ctx=getAC();if(!ctx)return;for(let i=0;i<(count||1);i++){const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=freq||880;const t=ctx.currentTime+i*0.28;g.gain.setValueAtTime(0.35,t);g.gain.exponentialRampToValueAtTime(0.001,t+(dur||0.12));o.start(t);o.stop(t+(dur||0.12)+0.05);}};
const playTick=()=>{const ctx=getAC();if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='square';o.frequency.value=220;const t=ctx.currentTime;g.gain.setValueAtTime(0.6,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.055);o.start(t);o.stop(t+0.07);};
const playFinish=()=>{const ctx=getAC();if(!ctx)return;[[1047,0,.22],[784,.26,.22],[523,.52,.4]].forEach(([f,d,r])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=f;const t=ctx.currentTime+d;g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+r);o.start(t);o.stop(t+r+.05);});};

const VID={"Pogo Hops":"dMnECxl6dsY","Nordic Hamstring Curl":"GlpJ7OhGXxk","Copenhagen Adductor Press":"3iE3kEGkGqM","Tibialis Raise":"sCpFBmfHIZY","Bear Crawl":"5rPBCfGJdpI","Dead Bug with Band":"4XLEnwUr1d8","Hollow Body Hold":"LlDNef_Ztsc","Superman Hold":"vYTpJCgMHy4","Hip Thrust Jump":"xDmFkJxPzeM","Glute Bridge March":"xqQhKVVWxAc","Hip Flexor Lunge":"YbGqKMVOVRE","Hamstring Standing":"N1YO1KsKDEw","Calf Wall Stretch":"Lv3BBqGhFCA","Quad Standing":"AKiTEBiqscY","IT Band Cross Lean":"oCMGMxRNcD0","Figure 4 Supine":"3_dNkJAnfIs","Adductor Wide Squat":"FdMxFxbHvOY","Achilles Low Lunge":"GnS8KRbm5G0","Thoracic Rotation":"1k8y5qNMDKE","Glute Supine Pull":"L7JTn0Ia4Ro","Pigeon Pose":"cnQh4KFBbvk","Butterfly Stretch":"bnBGQoH2MQ0","Ankle Dorsiflexion Wall":"vDRFsNeSN48","Lying Spinal Twist":"dV_S5HiyMgU","World's Greatest Stretch":"Tz3RfmIJBEA"};

function YtBtn({name,pc,lang}){
  const id=VID[name]||null,direct=id?`https://www.youtube.com/watch?v=${id}`:null,search=`https://www.youtube.com/results?search_query=${encodeURIComponent(name+" exercise tutorial running")}`;
  const[avail,setAvail]=useState(id?"checking":"none");
  useEffect(()=>{if(!id){setAvail("none");return;}const img=new Image();img.onload=()=>setAvail(img.naturalWidth>120?"ok":"gone");img.onerror=()=>setAvail("gone");img.src=`https://img.youtube.com/vi/${id}/mqdefault.jpg`;},[id]);
  const base={display:"inline-flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:7,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:".13em",textDecoration:"none",cursor:"pointer"};
  const ok=avail==="ok"&&direct;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {avail==="checking"&&<span style={{...base,border:`1px solid ${pc}33`,color:pc,opacity:.5}}>⟳ {lang==="pt"?"A verificar…":"Checking…"}</span>}
      {ok&&<a href={direct} target="_blank" rel="noopener noreferrer" style={{...base,border:`1px solid ${pc}55`,background:`${pc}10`,color:pc}}>▶ {lang==="pt"?"VER VÍDEO":"WATCH VIDEO"}</a>}
      <a href={search} target="_blank" rel="noopener noreferrer" style={{...base,border:`1px solid ${ok?pc+"22":pc+"55"}`,background:ok?"transparent":`${pc}10`,color:ok?"#888":pc,opacity:ok?.7:1}}>🔍 {ok?(lang==="pt"?"Alternativa":"Search alt"):(lang==="pt"?"PESQUISAR NO YOUTUBE":"SEARCH ON YOUTUBE")}</a>
    </div>
  );
}

export default function App(){
  const[page,setPage]=useState("home");
  const[dark,setDark]=useState(true);
  const[lang,setLang]=useState("en");
  const[gymMode,setGymMode]=useState(false);
  const[openSes,setOpenSes]=useState(null);
  const[openType,setOpenType]=useState(null);
  const[typeSub,setTypeSub]=useState({});
  const[openTEx,setOpenTEx]=useState(null);
  const[tExTab,setTExTab]=useState({});
  const[openTSes,setOpenTSes]=useState(null);
  const[activePhase,setPhase]=useState("A");
  const[openEx,setOpenEx]=useState(null);
  const[exTab,setExTab]=useState({});
  const[sesView,setSesView]=useState("browse");
  const[catFilt,setCatFilt]=useState("ALL");
  const[cfgSes,setCfgSes]=useState(null);
  const[runMode,setRunMode]=useState("reps");
  const[repsN,setRepsN]=useState(10);
  const[exDur,setExDur]=useState(40);
  const[restDur,setRestDur]=useState(60);
  const[blocks,setBlocks]=useState(2);
  const[muted,setMuted]=useState(false);
  const[runExs,setRunExs]=useState([]);
  const[runIdx,setRunIdx]=useState(0);
  const[runBlk,setRunBlk]=useState(1);
  const[runPhase,setRunPhase]=useState("idle");
  const[runTime,setRunTime]=useState(0);
  const[runActive,setRunActive]=useState(false);
  const[stretchRunExs,setStretchRunExs]=useState([]);
  const[stretchRunIdx,setStretchRunIdx]=useState(0);
  const[stretchSide,setStretchSide]=useState("A");
  const[planTime,setPlanTime]=useState(30);
  const[planTypes,setPlanTypes]=useState([]);
  const[planLevel,setPlanLevel]=useState("mixed");
  const[planResult,setPlanResult]=useState(null);
  const[planView,setPlanView]=useState("setup");

  const ivRef=useRef(null);const muteRef=useRef(false);const rsRef=useRef({});
  useEffect(()=>{muteRef.current=muted;},[muted]);
  useEffect(()=>()=>{if(ivRef.current)clearInterval(ivRef.current);},[]);
  const snd=(fn,...a)=>{if(!muteRef.current)fn(...a);};
  const stopTimer=useCallback(()=>{if(ivRef.current!==null){clearInterval(ivRef.current);ivRef.current=null;}},[]);

  const advance=useCallback(()=>{
    const rs=rsRef.current;if(!rs||!rs.phase)return;
    if(rs.phase==="stretchA"){
      const s=rs.stretchExs[rs.stretchIdx];
      if(s&&s.bilateral){rsRef.current={...rs,phase:"stretchB",time:s.holdSec};setRunPhase("stretchB");setStretchSide("B");snd(playBeep,2,880);}
      else{const last=rs.stretchIdx>=(rs.stretchExs.length-1);if(last){stopTimer();rsRef.current={...rs,phase:"done",active:false};setRunPhase("done");setRunActive(false);snd(playFinish);}else{rsRef.current={...rs,phase:"stretchRest",time:STRETCH_REST_PLAN};setRunPhase("stretchRest");snd(playBeep,2,660);}}
      return;
    }
    if(rs.phase==="stretchB"){
      const last=rs.stretchIdx>=(rs.stretchExs.length-1);
      if(last){stopTimer();rsRef.current={...rs,phase:"done",active:false};setRunPhase("done");setRunActive(false);snd(playFinish);}
      else{rsRef.current={...rs,phase:"stretchRest",time:STRETCH_REST_PLAN};setRunPhase("stretchRest");snd(playBeep,2,660);}
      return;
    }
    if(rs.phase==="stretchRest"){
      const ni=rs.stretchIdx+1,s=rs.stretchExs[ni];if(!s)return;
      rsRef.current={...rs,phase:"stretchA",stretchIdx:ni,time:s.holdSec};
      setRunPhase("stretchA");setStretchRunIdx(ni);setStretchSide("A");snd(playBeep,1,1047);return;
    }
    if(rs.phase==="exercise"){rsRef.current={...rs,phase:"rest",time:rs.restDur};setRunPhase("rest");setRunTime(rs.restDur);snd(playBeep,2,880);}
    else if(rs.phase==="rest"){
      const lastEx=rs.exIdx>=(rs.exs.length-1);
      if(lastEx){
        if(rs.blk>=rs.totalBlks){
          if(rs.stretchExs&&rs.stretchExs.length>0){const s=rs.stretchExs[0];rsRef.current={...rs,phase:"stretchA",stretchIdx:0,time:s.holdSec,active:true};setRunPhase("stretchA");setStretchRunIdx(0);setStretchSide("A");snd(playBeep,3,1047);}
          else{stopTimer();rsRef.current={...rs,phase:"done",active:false};setRunPhase("done");setRunActive(false);snd(playFinish);}
        }else{const nb=rs.blk+1,t=rs.mode==="reps"?rs.repsN:rs.exDur;rsRef.current={...rs,phase:"exercise",exIdx:0,blk:nb,time:t};setRunPhase("exercise");setRunIdx(0);setRunBlk(nb);setRunTime(t);snd(playBeep,3,1047);}
      }else{const ni=rs.exIdx+1,t=rs.mode==="reps"?rs.repsN:rs.exDur;rsRef.current={...rs,phase:"exercise",exIdx:ni,time:t};setRunPhase("exercise");setRunIdx(ni);setRunTime(t);snd(playBeep,1,660);}
    }
  },[stopTimer]);

  const startTimer=useCallback(()=>{
    stopTimer();
    ivRef.current=setInterval(()=>{
      const rs=rsRef.current;if(!rs||!rs.active)return;
      if(rs.mode==="reps"&&rs.phase==="exercise")return;
      const nt=rs.time-1;
      if(nt<=0){snd(playFinish);advance();}else{rsRef.current={...rs,time:nt};setRunTime(nt);if(nt<=5)snd(playTick);}
    },1000);
  },[stopTimer,advance]);

  const beginSession=useCallback(()=>{
    if(!cfgSes)return;
    const exs=resolveList(cfgSes.list||[]);if(!exs.length)return;
    const t=runMode==="reps"?repsN:exDur;
    const rs={active:true,mode:runMode,repsN,exDur,restDur,totalBlks:blocks,blk:1,exIdx:0,phase:"exercise",time:t,exs,stretchExs:[]};
    rsRef.current=rs;setRunExs(exs);setRunIdx(0);setRunBlk(1);
    setStretchRunExs([]);setStretchRunIdx(0);setStretchSide("A");
    setRunPhase("exercise");setRunTime(t);setRunActive(true);
    setSesView("run");snd(playBeep,1,660);startTimer();
  },[cfgSes,runMode,repsN,exDur,restDur,blocks,startTimer]);

  const repsDone=useCallback(()=>{
    const rs=rsRef.current;if(!rs||rs.phase!=="exercise")return;
    snd(playBeep,1,1100);
    const lastEx=rs.exIdx>=(rs.exs.length-1),lastBlk=rs.blk>=rs.totalBlks;
    if(lastEx&&lastBlk){
      if(rs.stretchExs&&rs.stretchExs.length>0){const s=rs.stretchExs[0];rsRef.current={...rs,phase:"stretchA",stretchIdx:0,time:s.holdSec,active:true};setRunPhase("stretchA");setStretchRunIdx(0);setStretchSide("A");snd(playBeep,3,1047);startTimer();}
      else{stopTimer();rsRef.current={...rs,phase:"done",active:false};setRunPhase("done");setRunActive(false);snd(playFinish);}
    }else{
      const nb=lastEx?rs.blk+1:rs.blk,ni=lastEx?-1:rs.exIdx;
      rsRef.current={...rs,phase:"rest",time:rs.restDur,blk:nb,exIdx:ni,active:true};
      setRunPhase("rest");setRunTime(rs.restDur);if(lastEx)setRunBlk(nb);startTimer();
    }
  },[stopTimer,startTimer]);

  const togglePause=useCallback(()=>{const rs=rsRef.current;if(!rs)return;const na=!rs.active;rsRef.current={...rs,active:na};setRunActive(na);if(na)startTimer();else stopTimer();},[startTimer,stopTimer]);
  const skipRest=useCallback(()=>{const rs=rsRef.current;if(rs&&(rs.phase==="rest"||rs.phase==="stretchRest"))advance();},[advance]);
  const skipStretchSide=useCallback(()=>{const rs=rsRef.current;if(rs&&(rs.phase==="stretchA"||rs.phase==="stretchB"))advance();},[advance]);
  const exitRunner=useCallback(()=>{stopTimer();rsRef.current={};setRunPhase("idle");setRunActive(false);setRunExs([]);setRunIdx(0);setRunBlk(1);setStretchRunExs([]);setStretchRunIdx(0);setStretchSide("A");setSesView("browse");},[stopTimer]);
  const restartSession=useCallback(()=>{stopTimer();setTimeout(beginSession,50);},[stopTimer,beginSession]);

  const beginFromPlan=useCallback(()=>{
    if(!planResult)return;
    const exs=planResult.exercises||[],sExs=planResult.stretchExercises||[];
    const ed=planResult.exDur||40,rd=planResult.restDur||60,blk=planResult.blocks||2;
    if(!exs.length)return;
    const rs={active:true,mode:"time",repsN:ed,exDur:ed,restDur:rd,totalBlks:blk,blk:1,exIdx:0,phase:"exercise",time:ed,exs,stretchExs:sExs};
    rsRef.current=rs;setRunExs(exs);setRunIdx(0);setRunBlk(1);
    setStretchRunExs(sExs);setStretchRunIdx(0);setStretchSide("A");
    setRunPhase("exercise");setRunTime(ed);setRunActive(true);
    setCfgSes({nEn:"Training Plan",nPt:"Plano de Treino",catColor:"#10B981",catEn:"Plan",catPt:"Plano",defRest:rd,list:[]});
    setExDur(ed);setRestDur(rd);setBlocks(blk);
    setSesView("run");setPage("session");snd(playBeep,1,660);startTimer();
  },[planResult,startTimer]);

  const generatePlan=useCallback(()=>{
    const hasStretch=planTypes.includes("Alongamentos");
    const mainTypesRaw=planTypes.filter(t=>t!=="Alongamentos");
    const mainTypes=mainTypesRaw.length>0?mainTypesRaw:Object.keys(TYPES).filter(t=>t!=="Alongamentos");
    const pp=planParams(planTime,hasStretch);
    const pool=[];
    PHASES.forEach(ph=>{
      if(ph.id==="K")return;
      ph.exercises.forEach(ex=>{
        if(!mainTypes.includes(ex.type))return;
        if(planLevel==="foundational"&&ex.level!=="Foundational")return;
        if(planLevel==="advanced"&&ex.level==="Foundational")return;
        if(!gymMode&&(ex.equip||EQUIP[ex.name]||"any")==="gym")return;
        pool.push({...ex,phaseId:ph.id,phaseColor:ph.color});
      });
    });
    if(!pool.length)return;
    const sh=shuffle(pool);const selected=[];
    for(const t of mainTypes){if(selected.length>=pp.nEx)break;const ex=sh.find(e=>e.type===t&&!selected.some(s=>s.name===e.name));if(ex)selected.push(ex);}
    let bank=shuffle(pool);
    for(let i=0;selected.length<pp.nEx&&i<300;i++){if(!bank.length)bank=shuffle(pool);const ex=bank.shift();if(selected.some(s=>s.name===ex.name))continue;selected.push(ex);}
    const nS=pp.nStretches||0,stretchExercises=hasStretch&&nS>0?shuffle([...STRETCH_EXES]).slice(0,nS):[];
    setPlanResult({exercises:selected.slice(0,pp.nEx),stretchExercises,exDur:pp.exDur,restDur:pp.restDur,blocks:pp.blocks,nStretches:nS,stretchSec:pp.stretchBlockSec||0,estSec:pp.estSec,planTime,hasStretch,label:PLAN_CFG[planTime].label,labelPt:PLAN_CFG[planTime].labelPt});
    setPlanView("result");
  },[planTime,planTypes,planLevel,gymMode]);

  const LIGHT_REMAP={"#E8FF47":"#7a7e00","#C084FC":"#7c3aed","#00D4FF":"#0284c7","#F97316":"#c2410c","#34D399":"#059669"};
  const rc=hex=>(!dark&&LIGHT_REMAP[hex])?LIGHT_REMAP[hex]:hex;
  const c=dark?{bg:"#060608",sur:"#0f0f12",surO:"#131317",brd:"#1f1f26",brdO:"#2e2e3a",hdr:"#17171e",div:"#17171e",txt:"#eeeef2",body:"#9898a8",sec:"#606070",muted:"#48485a",lbl:"#36364a",navI:"#3a3a50",sT:"#0c0c0f",sH:"#2a2a38",navH:"#fff",shadow:"0 1px 3px rgba(0,0,0,.6),0 4px 12px rgba(0,0,0,.4)",shadowSm:"0 1px 2px rgba(0,0,0,.5)"}:{bg:"#f6f5f0",sur:"#fff",surO:"#fdfcf8",brd:"#e2e0d8",brdO:"#c8c5ba",hdr:"#e8e6df",div:"#e8e6df",txt:"#18181c",body:"#44444e",sec:"#72727e",muted:"#96969e",lbl:"#b0b0b8",navI:"#a0a0aa",sT:"#eeede8",sH:"#c4c2ba",navH:"#000",shadow:"0 1px 3px rgba(0,0,0,.06),0 4px 14px rgba(0,0,0,.07)",shadowSm:"0 1px 2px rgba(0,0,0,.05)"};

  // Gym filter helpers
  const getEquip = ex => ex.equip || EQUIP[ex.name] || "any";
  const filterExs = exs => gymMode ? exs : exs.filter(ex => getEquip(ex) !== "gym");

  const enm=n=>lang==="pt"?(PT[n]||n):n;
  const tl=k=>lang==="pt"?TYPES[k]?.pt:TYPES[k]?.en;
  const tc=k=>rc(TYPES[k]?.color||"#888");
  const lvlL=l=>lang==="pt"?{Foundational:"FUNDAMENTAL",Intermediate:"INTERMÉDIO",Advanced:"AVANÇADO"}[l]:l.toUpperCase();
  const phase=PHASES.find(p=>p.id===activePhase)||PHASES[0];
  const phaseColor=rc(phase.color);
  const navTo=(phId,idx)=>{setPhase(phId);setOpenEx(idx);setExTab({});setPage("exercises");};
  const openCfg=ses=>{setCfgSes(ses);setRestDur(ses.defRest||75);setSesView("config");setPage("session");};

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}body{-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${c.sT}}::-webkit-scrollbar-thumb{background:${c.sH};border-radius:4px}
    .nb{cursor:pointer;background:transparent;border:none;font-family:'DM Mono',monospace;transition:color .15s}.nb:hover{color:${c.navH}}
    .ec{border:1px solid ${c.brd};border-radius:12px;cursor:pointer;background:${c.sur};transition:all .2s;box-shadow:${c.shadowSm}}.ec:hover{border-color:${c.brdO}}.ec.op{border-color:var(--pc);background:${c.surO}}
    .tb{cursor:pointer;border:1px solid ${c.brd};transition:all .15s;background:transparent;font-family:'DM Mono',monospace;border-radius:6px}.tb:hover{border-color:${c.brdO}}.tb.on{background:color-mix(in srgb,var(--pc) 14%,transparent);border-color:var(--pc)}
    .xi{border-radius:8px;cursor:pointer;transition:background .15s}.xi:hover{background:${dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"} !important}
    .row{border-radius:12px;border:1px solid ${c.brd};background:${c.sur};overflow:hidden;box-shadow:${c.shadowSm}}
    .fi{animation:fi .2s ease}@keyframes fi{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
    .stab{cursor:pointer;background:transparent;border:1px solid transparent;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.16em;padding:7px 13px;border-radius:20px;transition:all .15s}.stab.on{background:color-mix(in srgb,var(--tc) 14%,transparent);color:var(--tc);border-color:color-mix(in srgb,var(--tc) 40%,transparent)}
    input[type=range]{width:100%;accent-color:var(--ac,#888);cursor:pointer}
    a{color:inherit;text-decoration:none}a:hover{opacity:.75}
  `;

  const Header=()=>(
    <div style={{borderBottom:`1px solid ${c.hdr}`,padding:"20px 20px 14px",background:c.bg}}>
      <div style={{maxWidth:880,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".22em",color:c.muted}}>{lang==="pt"?"Corrida · Trail · Baseado em Evidências":"Road · Trail · Evidence-Based"}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".14em",padding:"2px 7px",borderRadius:8,background:gymMode?"rgba(251,146,60,.15)":dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)",color:gymMode?"#fb923c":c.muted,border:`1px solid ${gymMode?"rgba(251,146,60,.4)":c.brd}`}}>
              {gymMode?(lang==="pt"?"🏋️ GYM":"🏋️ GYM"):(lang==="pt"?"🏠 CASA":"🏠 HOME")}
            </div>
          </div>
          <h1 style={{fontFamily:"'Bebas Neue'",fontSize:"clamp(22px,4.5vw,42px)",letterSpacing:".05em",lineHeight:1,color:c.txt}}>{lang==="pt"?"Protocolo de Potência Explosiva":"Explosive Power Protocol"}</h1>
        </div>
        <nav style={{display:"flex",alignItems:"center",gap:1,background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)",borderRadius:10,padding:3,border:`1px solid ${c.brd}`}}>
          {[["HOME","INÍCIO","home"],["PLAN","PLANO","plan"],["SESSION","SESSÃO","session"],["TYPES","TIPOS","types"],["EXERCISES","EXERCÍCIOS","exercises"]].map(([e,p,v])=>(
            <button key={v} className="nb" onClick={()=>{if(sesView==="run")exitRunner();setPage(v);}} style={{fontSize:8,letterSpacing:".14em",padding:"6px 9px",borderRadius:7,color:page===v?c.txt:c.navI,background:page===v?(dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.08)"):"transparent",fontWeight:page===v?"500":"400",transition:"all .15s"}}>{lang==="pt"?p:e}</button>
          ))}
        </nav>
      </div>
    </div>
  );

  const BottomBar=()=>(
    <div style={{position:"fixed",bottom:0,left:0,right:0,borderTop:`1px solid ${c.hdr}`,background:dark?"rgba(6,6,8,.92)":"rgba(246,245,240,.92)",backdropFilter:"blur(12px)",padding:"9px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:100}}>
      <div style={{display:"flex",gap:2,background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)",borderRadius:8,padding:3,border:`1px solid ${c.brd}`}}>
        {[["EN","en"],["PT","pt"]].map(([l,v])=>(<button key={v} className="nb" onClick={()=>setLang(v)} style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".16em",padding:"5px 9px",borderRadius:5,color:lang===v?c.txt:c.navI,background:lang===v?(dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.08)"):"transparent",fontWeight:lang===v?"500":"400",transition:"all .15s"}}>{l}</button>))}
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <button onClick={()=>setGymMode(g=>!g)}
          style={{cursor:"pointer",background:gymMode?"rgba(251,146,60,.12)":(dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)"),border:`1px solid ${gymMode?"rgba(251,146,60,.5)":c.brd}`,borderRadius:8,padding:"6px 11px",lineHeight:1,display:"flex",alignItems:"center",gap:5,transition:"all .2s"}}>
          <span style={{fontSize:14}}>{gymMode?"🏋️":"🏠"}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".12em",color:gymMode?"#fb923c":c.muted}}>{gymMode?(lang==="pt"?"GYM":"GYM"):(lang==="pt"?"CASA":"HOME")}</span>
        </button>
        <button onClick={()=>setDark(d=>!d)} style={{cursor:"pointer",background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)",border:`1px solid ${c.brd}`,borderRadius:8,padding:"6px 11px",fontSize:14,lineHeight:1,display:"flex",alignItems:"center",gap:5}}>
          <span>{dark?"☀️":"🌙"}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".12em",color:c.muted}}>{dark?(lang==="pt"?"CLARO":"LIGHT"):(lang==="pt"?"ESCURO":"DARK")}</span>
        </button>
      </div>
    </div>
  );

  const ExBody=({ex,uid,tabSt,setTabSt,pc})=>{
    const cur=tabSt[uid];
    const tabs=lang==="pt"?[["DICAS","cues"],["VÍDEO","video"],["ARTIGOS","science"]]:[["CUES","cues"],["VIDEO","video"],["SCIENCE","science"]];
    const isGym=getEquip(ex)==="gym";
    return(
      <div style={{padding:"0 14px 14px"}}>
        <div style={{borderTop:`1px solid ${c.hdr}`,paddingTop:10}}>
          <div style={{marginBottom:8,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".16em",color:c.lbl}}>{lang==="pt"?"FOCO":"FOCUS"} · </span>
            <span style={{fontSize:13,fontWeight:400,color:pc}}>{ex.focus}</span>
            {ex.type==="Alongamentos"&&ex.bilateral&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:pc,padding:"1px 5px",borderRadius:4,border:`1px solid ${pc}40`}}>BILATERAL</span>}
            {isGym&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"#fb923c",padding:"1px 5px",borderRadius:4,border:"1px solid rgba(251,146,60,.4)",background:"rgba(251,146,60,.1)"}}>🏋️ GYM</span>}
          </div>
          <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
            {tabs.map(([lbl,tab])=>(<button key={tab} className={`tb${cur===tab?" on":""}`} style={{"--pc":pc,padding:"5px 9px",fontSize:9,letterSpacing:".14em",color:cur===tab?pc:c.sec}} onClick={e=>{e.stopPropagation();setTabSt(p=>({...p,[uid]:p[uid]===tab?null:tab}));}}>{lbl}</button>))}
          </div>
          {!cur&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:c.lbl,fontStyle:"italic"}}>→ {lang==="pt"?"Selecione um separador.":"Select a tab above."}</div>}
          {cur==="cues"&&<div className="fi" style={{display:"flex",flexDirection:"column",gap:6}}>{(ex.cues||[]).map((cue,j)=>(<div key={j} style={{display:"flex",gap:9,alignItems:"flex-start"}}><div style={{width:4,height:4,borderRadius:"50%",background:pc,marginTop:5,flexShrink:0}}/><span style={{fontSize:13,fontWeight:300,color:c.body,lineHeight:1.6}}>{cue}</span></div>))}</div>}
          {cur==="video"&&<div className="fi"><YtBtn name={ex.name} pc={pc} lang={lang}/></div>}
          {cur==="science"&&<div className="fi"><div style={{fontSize:13,fontWeight:500,color:pc,lineHeight:1.5}}>{ex.science&&ex.science.headline}</div></div>}
        </div>
      </div>
    );
  };

  const SesExList=({list})=>(
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      {(list||[]).map((item,j)=>{
        const ph=PHASES.find(p=>p.id===item.ph);
        const ex=ph&&ph.exercises.find(e=>e.name===item.nm);
        if(!ex)return null;
        const isGym=getEquip(ex)==="gym";
        return(
          <div key={j} className="xi" onClick={()=>navTo(item.ph,ph.exercises.indexOf(ex))} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",opacity:(!gymMode&&isGym)?.45:1}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:rc(ph.color),flexShrink:0}}/>
            <span style={{fontSize:13,fontWeight:400,color:c.body,flex:1}}>{enm(item.nm)}</span>
            {isGym&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"#fb923c",padding:"1px 4px",borderRadius:3,border:"1px solid rgba(251,146,60,.35)"}}>GYM</span>}
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:"2px 6px",borderRadius:8,background:`${tc(ex.type)}18`,color:tc(ex.type),border:`1px solid ${tc(ex.type)}40`}}>{tl(ex.type)}</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.lbl}}>→</span>
          </div>
        );
      })}
    </div>
  );

  const RunBtn=({ses,small})=>{const col=rc(ses.catColor||"#888");return(
    <button onClick={e=>{e.stopPropagation();openCfg(ses);}} style={{cursor:"pointer",background:`color-mix(in srgb,${col} 16%,${dark?"#0f0f14":"#fff"})`,border:`1px solid color-mix(in srgb,${col} 45%,transparent)`,borderRadius:8,padding:small?"5px 10px":"7px 14px",fontFamily:"'DM Mono',monospace",fontSize:small?8:9,letterSpacing:".12em",color:col,display:"inline-flex",alignItems:"center",gap:5,flexShrink:0}}>
      <span style={{fontSize:small?9:11}}>▶</span>{small?(lang==="pt"?"EXECUTAR":"RUN"):(lang==="pt"?"▶ INICIAR":"▶ START")}
    </button>
  );};

  const Circle=({val,total,col,size})=>{const sz=size||150,r=(sz-14)/2,circ=2*Math.PI*r,pct=total>0?Math.max(0,val/total):0;return(<svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={dark?"#1a1a1a":"#e8e8e8"} strokeWidth={10}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth={10} strokeDasharray={`${circ*pct} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.9s linear"}}/></svg>);};

  const wrap=content=>(<div style={{fontFamily:"'Inter',sans-serif",background:c.bg,minHeight:"100vh",color:c.txt}}><style>{css}</style><Header/>{content}<BottomBar/></div>);

  // ══ HOME ══════════════════════════════════════════════════════════════
  if(page==="home"){
    return wrap(
      <div style={{maxWidth:880,margin:"0 auto",padding:"22px 20px 86px"}}>
        <div style={{marginBottom:22,paddingBottom:16,borderBottom:`1px solid ${c.div}`}}>
          <p style={{fontSize:14,fontWeight:300,color:c.body,lineHeight:1.8,maxWidth:560}}>{lang==="pt"?"Quatro sessões mensais para corredores. PLANO para geração automática. Alterna entre 🏠 CASA e 🏋️ GYM no rodapé para filtrar exercícios.":"Four monthly sessions for runners. PLAN for auto-generation. Toggle 🏠 HOME / 🏋️ GYM at the bottom to filter exercises."}</p>
        </div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".2em",color:c.muted,marginBottom:10}}>{lang==="pt"?"BLOCO MENSAL — 4 SESSÕES":"4-SESSION MONTHLY BLOCK"}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {SESSIONS.map((ses,si)=>{
            const allSes=ALL_SESSIONS.find(s=>s.id===ses.code);
            const isOpen=openSes===si;
            const borderCol=rc(TYPES[ses.tags[0]]?.color||"#888");
            return(
              <div key={si} className="row" style={{borderColor:isOpen?borderCol+"55":c.brd,background:isOpen?c.surO:c.sur}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer"}} onClick={()=>setOpenSes(isOpen?null:si)}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,minWidth:22}}>{ses.code}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:4}}>{(ses.tags||[]).map((t,ti)=><span key={ti} style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".12em",padding:"2px 7px",borderRadius:9,background:`${tc(t)}18`,color:tc(t),border:`1px solid ${tc(t)}40`}}>{tl(t)}</span>)}</div>
                    <div style={{fontSize:14,fontWeight:500,color:isOpen?c.txt:c.body}}>{lang==="pt"?ses.nPt:ses.nEn}</div>
                    <div style={{fontSize:11,fontWeight:300,color:c.muted,marginTop:2}}>{lang==="pt"?ses.dPt:ses.dEn}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>{allSes&&<RunBtn ses={allSes} small/>}<div style={{color:c.lbl,fontSize:18,fontWeight:300,transform:isOpen?"rotate(45deg)":"none",transition:"transform .2s"}}>+</div></div>
                </div>
                {isOpen&&<div className="fi" style={{borderTop:`1px solid ${c.div}`,padding:"5px 16px 10px"}}><SesExList list={ses.list}/></div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ══ PLAN ══════════════════════════════════════════════════════════════
  if(page==="plan"){
    const hasStretch=planTypes.includes("Alongamentos");
    const pp=planParams(planTime,hasStretch);
    const stretchBlockMin=Math.round((pp.stretchBlockSec||0)/60);

    if(planView==="setup"){
      return wrap(
        <div style={{maxWidth:620,margin:"0 auto",padding:"22px 20px 90px"}}>
          <div style={{marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${c.div}`}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".22em",color:c.muted,marginBottom:5}}>{lang==="pt"?"PLANEADOR DE TREINO":"TRAINING PLANNER"}</div>
            <p style={{fontSize:13,fontWeight:300,color:c.sec,lineHeight:1.7}}>{lang==="pt"?"O modo activo (🏠/🏋️) determina o pool de exercícios do plano.":"The active mode (🏠/🏋️) determines the exercise pool for the plan."}</p>
          </div>
          <div style={{marginBottom:22}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:".18em",color:c.muted,marginBottom:10}}>⏱ {lang==="pt"?"TEMPO DISPONÍVEL":"AVAILABLE TIME"}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[15,20,30,45,60].map(t=>{const isA=planTime===t,tcfg=PLAN_CFG[t];return(
                <button key={t} onClick={()=>setPlanTime(t)} style={{cursor:"pointer",flex:"1 0 70px",padding:"10px 8px",borderRadius:10,border:`2px solid ${isA?"#10B981":c.brd}`,background:isA?`color-mix(in srgb,#10B981 12%,${c.sur})`:c.sur,transition:"all .15s",textAlign:"center"}}>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:26,color:isA?"#10B981":c.txt,lineHeight:1}}>{t}<span style={{fontSize:12}}>m</span></div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:isA?"#10B981":c.lbl,marginTop:3}}>{lang==="pt"?tcfg.labelPt:tcfg.label}</div>
                </button>
              );})}
            </div>
          </div>
          <div style={{marginBottom:22}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:".18em",color:c.muted,marginBottom:4}}>🎯 {lang==="pt"?"TIPO DE TREINO":"TRAINING TYPE"}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.lbl,marginBottom:10}}>{lang==="pt"?"Vazio = mistura completa. Alongamentos = bloco final separado.":"Empty = full mix. Stretching = separate final block."}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {Object.entries(TYPES).map(([key,info])=>{const isA=planTypes.includes(key),col=rc(info.color);return(
                <button key={key} onClick={()=>setPlanTypes(prev=>prev.includes(key)?prev.filter(x=>x!==key):[...prev,key])} style={{cursor:"pointer",padding:"7px 12px",borderRadius:20,border:`${isA?"2px":"1px"} solid ${isA?col:c.brd}`,background:isA?`color-mix(in srgb,${col} 14%,${c.sur})`:"transparent",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".13em",color:isA?col:c.muted,transition:"all .15s",display:"flex",alignItems:"center",gap:5}}>
                  {isA?"✓ ":""}{lang==="pt"?info.pt:info.en}{key==="Alongamentos"&&<span style={{fontSize:8,opacity:.7}}> · END</span>}
                </button>
              );})}
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:".18em",color:c.muted,marginBottom:10}}>📊 {lang==="pt"?"NÍVEL":"LEVEL"}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["foundational",lang==="pt"?"Fundamental":"Foundational",lang==="pt"?"Só base":"Entry-level only"],["mixed",lang==="pt"?"Misto":"Mixed",lang==="pt"?"Mistura de níveis":"Mix of levels"],["advanced",lang==="pt"?"Avançado":"Advanced",lang==="pt"?"Sem base":"No foundational"]].map(([v,label,sub])=>{const isA=planLevel===v;return(
                <button key={v} onClick={()=>setPlanLevel(v)} style={{cursor:"pointer",flex:"1 0 110px",padding:"10px 12px",borderRadius:10,border:`1px solid ${isA?c.brdO:c.brd}`,background:isA?(dark?"rgba(255,255,255,.07)":"rgba(0,0,0,.06)"):c.sur,textAlign:"left",transition:"all .15s"}}>
                  <div style={{fontSize:13,fontWeight:isA?500:400,color:isA?c.txt:c.body,marginBottom:2}}>{label}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl}}>{sub}</div>
                </button>
              );})}
            </div>
          </div>
          <div style={{padding:"11px 14px",borderRadius:10,border:`1px solid color-mix(in srgb,#10B981 35%,${c.brd})`,background:`color-mix(in srgb,#10B981 6%,${c.sur})`,marginBottom:hasStretch?10:18,display:"flex",flexWrap:"wrap",gap:14,alignItems:"center"}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:"#10B981"}}>{lang==="pt"?"ESTIMATIVA":"ESTIMATE"}</span>
            {[[`${pp.nEx} ex`,"⚡"],[`${pp.blocks}×`,"🔁"],[`${pp.exDur}s`,"⏳"],[`${pp.restDur}s ${lang==="pt"?"desc":"rest"}`,"💤"],[fmtMin(pp.estSec),"🕐"],[gymMode?"🏋️ GYM":"🏠 HOME",""]].map(([label,icon],i)=>(
              <span key={i} style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:i===5?(gymMode?"#fb923c":c.sec):c.sec,display:"flex",alignItems:"center",gap:4}}>{icon} {label}</span>
            ))}
          </div>
          {hasStretch&&<div style={{marginBottom:18,padding:"9px 12px",borderRadius:8,border:`1px solid ${rc("#34D399")}40`,background:`color-mix(in srgb,${rc("#34D399")} 8%,${c.sur})`,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:16}}>🧘</span>
            <div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:rc("#34D399"),letterSpacing:".12em"}}>{lang==="pt"?"BLOCO DE ALONGAMENTOS FINAL":"FINAL STRETCH BLOCK"}</div>
            <div style={{fontSize:11,color:c.sec,marginTop:2}}>{pp.nStretches} {lang==="pt"?`alongamentos · ~${stretchBlockMin} min no final`:`stretches · ~${stretchBlockMin} min at end`}</div></div>
          </div>}
          <button onClick={generatePlan} style={{width:"100%",cursor:"pointer",background:`color-mix(in srgb,#10B981 18%,${c.sur})`,border:"2px solid #10B981",borderRadius:12,padding:"15px",fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:".2em",color:"#10B981"}}>✦ {lang==="pt"?"GERAR PLANO":"GENERATE PLAN"}</button>
        </div>
      );
    }

    if(planView==="result"&&planResult){
      const strCol=rc("#34D399");
      const resultStretchBlockMin=Math.round((planResult.stretchSec||0)/60);
      const stretchExs=planResult.stretchExercises||[];
      return wrap(
        <div style={{maxWidth:620,margin:"0 auto",padding:"22px 20px 90px"}}>
          <div style={{marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${c.div}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".2em",color:c.muted,marginBottom:4}}>{lang==="pt"?"PLANO GERADO":"GENERATED PLAN"}</div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:c.txt,letterSpacing:".04em",lineHeight:1}}>{planResult.planTime} MIN · {lang==="pt"?planResult.labelPt:planResult.label}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#10B981",marginTop:4}}>{lang==="pt"?"Estimado":"Est."}: {fmtMin(planResult.estSec)}</div>
            </div>
            <button onClick={()=>setPlanView("setup")} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:8,padding:"7px 12px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,letterSpacing:".12em"}}>← {lang==="pt"?"ALTERAR":"CHANGE"}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
            {[["🔁",String(planResult.blocks),lang==="pt"?"BLOCOS":"BLOCKS"],["⚡",String((planResult.exercises||[]).length),lang==="pt"?"EX.":"EX."],["⏳",`${planResult.exDur}s`,"P/EX"],["💤",`${planResult.restDur}s`,lang==="pt"?"DESC":"REST"]].map(([icon,val,label],i)=>(
              <div key={i} style={{padding:"10px 6px",borderRadius:10,border:`1px solid ${c.brd}`,background:c.sur,textAlign:"center"}}>
                <div style={{fontSize:16,marginBottom:4}}>{icon}</div>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:c.txt,lineHeight:1}}>{val}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:c.lbl,marginTop:3}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:planResult.hasStretch?14:16}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".18em",color:c.muted,marginBottom:8}}>{lang==="pt"?"EXERCÍCIOS PRINCIPAIS":"MAIN EXERCISES"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {(planResult.exercises||[]).map((ex,i)=>{const col=rc(ex.phaseColor||"#888"),typeC=tc(ex.type);return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:`1px solid ${c.brd}`,background:c.sur}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:c.lbl,minWidth:18,textAlign:"center"}}>{i+1}</div>
                  <div style={{width:6,height:6,borderRadius:"50%",background:col,flexShrink:0}}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:c.txt,marginBottom:1}}>{enm(ex.name)}</div><div style={{fontSize:11,fontWeight:300,color:c.sec}}>{ex.focus}</div></div>
                  {getEquip(ex)==="gym"&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"#fb923c",padding:"1px 4px",borderRadius:3,border:"1px solid rgba(251,146,60,.35)",flexShrink:0}}>GYM</span>}
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:"2px 6px",borderRadius:8,background:`${typeC}18`,color:typeC,border:`1px solid ${typeC}40`,flexShrink:0}}>{tl(ex.type)}</span>
                </div>
              );})}
            </div>
          </div>
          {planResult.hasStretch&&stretchExs.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".18em",color:strCol}}>🧘 {lang==="pt"?"BLOCO FINAL — ALONGAMENTOS":"FINAL BLOCK — STRETCHING"}</div>
                <div style={{flex:1,height:1,background:strCol,opacity:.25}}/>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:strCol,opacity:.7}}>~{resultStretchBlockMin}min</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5,borderRadius:12,border:`1px solid ${strCol}30`,padding:"10px 12px",background:`color-mix(in srgb,${strCol} 4%,${c.sur})`}}>
                {stretchExs.map((ex,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:i<stretchExs.length-1?`1px solid ${strCol}15`:""}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:strCol,flexShrink:0}}/>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500,color:c.txt}}>{enm(ex.name)}</div><div style={{fontSize:10,color:c.sec,fontWeight:300}}>{ex.focus}</div></div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:strCol,flexShrink:0}}>{ex.bilateral?`${ex.holdSec}s×2`:`${ex.holdSec}s`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:8}}>
            <button onClick={beginFromPlan} style={{flex:2,cursor:"pointer",background:`color-mix(in srgb,#10B981 18%,${c.sur})`,border:"2px solid #10B981",borderRadius:12,padding:"14px",fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:".2em",color:"#10B981"}}>▶ {lang==="pt"?"INICIAR PLANO":"START PLAN"}</button>
            <button onClick={generatePlan} style={{flex:1,cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:12,padding:"14px",fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:".14em",color:c.muted}}>↺ {lang==="pt"?"REGENERAR":"REGENERATE"}</button>
          </div>
        </div>
      );
    }
    return wrap(<div style={{padding:"40px",textAlign:"center",color:c.muted}}>Loading…</div>);
  }

  // ══ SESSION ══════════════════════════════════════════════════════════
  if(page==="session"){
    const rs=rsRef.current||{};

    // BROWSE
    if(sesView==="browse"){
      const cats=["ALL",...Object.keys(TYPES)];
      const filtered=catFilt==="ALL"?ALL_SESSIONS:ALL_SESSIONS.filter(s=>(s.tags||[]).includes(catFilt));
      return wrap(
        <div style={{maxWidth:880,margin:"0 auto",padding:"20px 20px 86px"}}>
          <div style={{marginBottom:14,display:"flex",flexWrap:"wrap",gap:6}}>
            {cats.map(k=>{const isA=catFilt===k,col=k==="ALL"?c.muted:tc(k),lbl=k==="ALL"?(lang==="pt"?"TODOS":"ALL"):tl(k);return(
              <button key={k} onClick={()=>setCatFilt(k)} style={{cursor:"pointer",background:isA?`${col}18`:c.sur,border:`1px solid ${isA?col:c.brd}`,borderRadius:18,padding:"5px 11px",fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".13em",color:isA?col:c.lbl,transition:"all .15s"}}>{lbl}</button>
            );})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map(ses=>{
              const col=rc(ses.catColor||"#888"),sesListLen=(ses.list||[]).length;
              return(
                <div key={ses.id} style={{borderRadius:10,border:`1px solid ${c.brd}`,padding:14,background:c.sur,transition:"border-color .2s"}} onMouseOver={e=>e.currentTarget.style.borderColor=col} onMouseOut={e=>e.currentTarget.style.borderColor=c.brd}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:"2px 7px",borderRadius:9,background:`${col}18`,color:col,border:`1px solid ${col}40`}}>{lang==="pt"?ses.catPt:ses.catEn}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl}}>{ses.id}</span>
                      </div>
                      <div style={{fontSize:14,fontWeight:500,color:c.body,marginBottom:2}}>{lang==="pt"?ses.nPt:ses.nEn}</div>
                      <div style={{fontSize:12,fontWeight:300,color:c.sec,marginBottom:5}}>{lang==="pt"?ses.dPt:ses.dEn}</div>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.lbl}}>{sesListLen} ex · {ses.defRest||60}s {lang==="pt"?"descanso padrão":"default rest"}</span>
                    </div>
                    <RunBtn ses={ses}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // CONFIG
    if(sesView==="config"&&cfgSes){
      const col=rc(cfgSes.catColor||"#888"),exs=resolveList(cfgSes.list||[]);
      const sliders=[["blocks",lang==="pt"?"BLOCOS":"BLOCKS",1,5,1,blocks,setBlocks,`${blocks}×`],...(runMode==="reps"?[["reps",lang==="pt"?"REPETIÇÕES":"REPS",1,20,1,repsN,setRepsN,`×${repsN}`]]:[["exd",lang==="pt"?"TEMPO P/EX":"TIME P/EX",10,120,5,exDur,setExDur,`${exDur}s`]]),["rest",lang==="pt"?"DESCANSO":"REST",15,180,5,restDur,setRestDur,`${restDur}s`]];
      return wrap(
        <div style={{maxWidth:520,margin:"0 auto",padding:"20px 20px 86px"}}>
          <button className="nb" onClick={()=>setSesView("browse")} style={{color:c.muted,fontSize:11,marginBottom:16,display:"flex",alignItems:"center",gap:5}}>← {lang==="pt"?"SESSÕES":"SESSIONS"}</button>
          <div style={{marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${c.div}`}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".16em",color:col,marginBottom:3}}>{lang==="pt"?cfgSes.catPt:cfgSes.catEn}</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:c.txt,letterSpacing:".05em",marginBottom:3}}>{lang==="pt"?cfgSes.nPt:cfgSes.nEn}</div>
            <div style={{fontSize:12,fontWeight:300,color:c.sec}}>{lang==="pt"?cfgSes.dPt:cfgSes.dEn}</div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".16em",color:c.muted,marginBottom:6}}>{lang==="pt"?"MODO":"MODE"}</div>
            <div style={{display:"flex",border:`1px solid ${c.brd}`,borderRadius:8,overflow:"hidden"}}>
              {[["reps",lang==="pt"?"REPETIÇÕES":"REPS"],["time","HIIT / TEMPO"]].map(([v,lbl])=>(<button key={v} onClick={()=>setRunMode(v)} style={{flex:1,cursor:"pointer",padding:"9px 8px",border:"none",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",background:runMode===v?`color-mix(in srgb,${col} 15%,${c.bg})`:c.sur,color:runMode===v?col:c.lbl,transition:"all .15s",borderRight:v==="reps"?`1px solid ${c.brd}`:"none"}}>{lbl}</button>))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
            {sliders.map(([id,label,min,max,step,val,setter,disp])=>(
              <div key={id} style={{"--ac":col}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.muted}}>{label}</div><div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:col}}>{disp}</div></div>
                <input type="range" min={min} max={max} step={step} value={val} onChange={e=>setter(+e.target.value)}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl,marginTop:2}}><span>{min}{(id==="exd"||id==="rest")?"s":""}</span><span>{max}{(id==="exd"||id==="rest")?"s":""}</span></div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:18,padding:12,border:`1px solid ${c.brd}`,borderRadius:8,background:c.sur}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.lbl,marginBottom:8}}>{lang==="pt"?"EXERCÍCIOS":"EXERCISES"}</div>
            {exs.map((ex,i)=>{const isGym=getEquip(ex)==="gym";return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderBottom:i<exs.length-1?`1px solid ${c.brd}`:"",opacity:(!gymMode&&isGym)?.45:1}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.lbl,minWidth:16}}>{i+1}</div>
                <div style={{width:4,height:4,borderRadius:"50%",background:rc(ex.phaseColor||"#888"),flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:400,color:c.body,flex:1}}>{enm(ex.name)}</span>
                {isGym&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"#fb923c",padding:"1px 4px",borderRadius:3,border:"1px solid rgba(251,146,60,.35)"}}>GYM</span>}
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl}}>{runMode==="reps"?`×${repsN}`:`${exDur}s`}</span>
              </div>
            );})}
          </div>
          <button onClick={beginSession} style={{width:"100%",cursor:"pointer",background:`color-mix(in srgb,${col} 18%,transparent)`,border:`2px solid ${col}`,borderRadius:10,padding:"14px",fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:".2em",color:col}}>▶ {lang==="pt"?"INICIAR SESSÃO":"BEGIN SESSION"}</button>
        </div>
      );
    }

    // RUN
    if(sesView==="run"&&runExs.length>0){
      const isSP=runPhase==="stretchA"||runPhase==="stretchB"||runPhase==="stretchRest";
      const curEx=isSP?(stretchRunExs[stretchRunIdx]||stretchRunExs[0]):(runExs[runIdx]||runExs[0]);
      const curCol=isSP?rc("#34D399"):rc(curEx?.phaseColor||"#888");
      const isDone=runPhase==="done",isRest=runPhase==="rest",isSR=runPhase==="stretchRest";
      const sC=rc("#34D399");
      let phCol,phLbl;
      if(isDone){phCol="#22c55e";phLbl=lang==="pt"?"COMPLETO":"COMPLETE";}
      else if(isSR){phCol=sC;phLbl=lang==="pt"?"PAUSA":"REST";}
      else if(runPhase==="stretchA"){phCol=sC;phLbl=lang==="pt"?"🧘 ESQ":"🧘 LEFT";}
      else if(runPhase==="stretchB"){phCol=sC;phLbl=lang==="pt"?"🧘 DIR":"🧘 RIGHT";}
      else if(isRest){phCol="#F97316";phLbl=lang==="pt"?"DESCANSO":"REST";}
      else{phCol="#C084FC";phLbl=lang==="pt"?"EXERCÍCIO":"EXERCISE";}
      const totalBlks=rs.totalBlks||blocks;
      const prog=isDone?100:isSP?100:Math.min(100,((runBlk-1)*runExs.length+runIdx+(isRest?1:0))/(totalBlks*runExs.length)*100);
      return wrap(
        <>
          <div style={{borderBottom:`1px solid ${c.hdr}`,padding:"11px 18px",background:dark?"rgba(6,6,8,.95)":"rgba(246,245,240,.95)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",gap:12}}>
            <button className="nb" onClick={exitRunner} style={{color:c.muted,fontSize:10,display:"flex",alignItems:"center",gap:5,flexShrink:0,padding:"6px 10px",borderRadius:8,border:`1px solid ${c.brd}`,background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)"}}>← {lang==="pt"?"SAIR":"EXIT"}</button>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,flex:1,textAlign:"center",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{cfgSes?(lang==="pt"?cfgSes.nPt:cfgSes.nEn):""}</div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              {isSP&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:sC,background:`${sC}15`,padding:"3px 8px",borderRadius:6}}>🧘 {stretchRunIdx+1}/{stretchRunExs.length}</span>}
              {!isSP&&totalBlks>1&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#C084FC",background:"rgba(192,132,252,.12)",padding:"3px 8px",borderRadius:6}}>B{runBlk}/{totalBlks}</span>}
              {!isSP&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)",padding:"3px 8px",borderRadius:6}}>{isDone?`${runExs.length}/${runExs.length}`:`${runIdx+1}/${runExs.length}`}</span>}
              <button onClick={()=>setMuted(m=>!m)} style={{cursor:"pointer",background:muted?"rgba(239,68,68,.12)":dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)",border:`1px solid ${muted?"rgba(239,68,68,.4)":c.brd}`,borderRadius:7,padding:"5px 9px",fontSize:12,color:muted?"#ef4444":c.muted,lineHeight:1}}>{muted?"🔇":"🔊"}</button>
            </div>
          </div>
          <div style={{height:3,background:c.brd}}><div style={{height:"100%",background:phCol,width:`${prog}%`,transition:"width 0.5s ease"}}/></div>
          <div style={{maxWidth:520,margin:"0 auto",padding:"20px 20px 86px",display:"flex",flexDirection:"column",alignItems:"center"}}>
            {isDone ? (
              <div className="fi" style={{textAlign:"center",paddingTop:24}}>
                <div style={{fontSize:56,marginBottom:14}}>🎉</div>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#22c55e",letterSpacing:".06em",marginBottom:8}}>{lang==="pt"?"SESSÃO COMPLETA!":"SESSION COMPLETE!"}</div>
                <div style={{fontSize:13,fontWeight:300,color:c.sec,marginBottom:28}}>{runExs.length} {lang==="pt"?"ex":"ex"} · {totalBlks} {lang==="pt"?"bloco(s)":"block(s)"}{stretchRunExs.length>0?` · ${stretchRunExs.length} ${lang==="pt"?"alongamentos":"stretches"}`:""}</div>
                <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                  <button onClick={restartSession} style={{cursor:"pointer",background:"transparent",border:"1px solid #22c55e",borderRadius:6,padding:"9px 18px",fontFamily:"'DM Mono',monospace",fontSize:10,color:"#22c55e"}}>↺ {lang==="pt"?"REPETIR":"RESTART"}</button>
                  <button onClick={()=>setSesView("browse")} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"9px 18px",fontFamily:"'DM Mono',monospace",fontSize:10,color:c.muted}}>← {lang==="pt"?"SESSÕES":"SESSIONS"}</button>
                </div>
              </div>
            ) : isSR ? (
              <div style={{textAlign:"center",width:"100%"}}>
                {stretchRunIdx<stretchRunExs.length-1&&<div style={{marginBottom:10}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".16em",color:c.lbl,marginBottom:3}}>{lang==="pt"?"PRÓXIMO":"NEXT"}</div><div style={{fontSize:14,fontWeight:500,color:c.body}}>{enm(stretchRunExs[stretchRunIdx+1]?.name||"")}</div></div>}
                <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                  <Circle val={runTime} total={STRETCH_REST_PLAN} col={sC}/>
                  <div style={{position:"absolute",textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:sC,lineHeight:1}}>{fmt(runTime)}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.muted,letterSpacing:".12em"}}>{lang==="pt"?"PAUSA":"REST"}</div></div>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  <button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"9px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>{runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ RETOMAR":"▶ RESUME")}</button>
                  <button onClick={advance} style={{cursor:"pointer",background:"transparent",border:`1px solid ${sC}`,borderRadius:6,padding:"9px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:sC}}>{lang==="pt"?"SALTAR →":"SKIP →"}</button>
                </div>
              </div>
            ) : isSP ? (
              <div style={{textAlign:"center",width:"100%"}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".18em",color:sC,marginBottom:6,padding:"3px 10px",borderRadius:12,border:`1px solid ${sC}40`,display:"inline-block"}}>{runPhase==="stretchA"?(lang==="pt"?"🧘 LADO ESQUERDO":"🧘 LEFT SIDE"):(lang==="pt"?"🧘 LADO DIREITO":"🧘 RIGHT SIDE")}</div>
                <div style={{fontSize:"clamp(16px,4vw,22px)",fontWeight:500,color:c.txt,marginBottom:4,marginTop:6}}>{enm(curEx?.name||"")}</div>
                <div style={{fontSize:12,fontWeight:300,color:sC,marginBottom:12}}>{curEx?.focus}</div>
                <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                  <Circle val={runTime} total={curEx?.holdSec||30} col={sC} size={130}/>
                  <div style={{position:"absolute",textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:34,color:sC,lineHeight:1}}>{fmt(runTime)}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:c.muted,letterSpacing:".12em"}}>{lang==="pt"?"SEGURAR":"HOLD"}</div></div>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
                  <button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"8px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>{runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ RETOMAR":"▶ RESUME")}</button>
                  <button onClick={skipStretchSide} style={{cursor:"pointer",background:"transparent",border:`1px solid ${sC}`,borderRadius:6,padding:"8px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:sC}}>{lang==="pt"?"→ PRÓXIMO":"→ NEXT"}</button>
                </div>
                <div style={{width:"100%",textAlign:"left"}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.lbl,marginBottom:6}}>{lang==="pt"?"TÉCNICA":"TECHNIQUE"}</div>
                  {(curEx?.cues||[]).slice(0,2).map((cue,j)=>(<div key={j} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:4}}><div style={{width:3,height:3,borderRadius:"50%",background:sC,marginTop:5,flexShrink:0}}/><span style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.5}}>{cue}</span></div>))}
                </div>
              </div>
            ) : isRest ? (
              <div style={{textAlign:"center",width:"100%"}}>
                {runIdx<runExs.length-1&&<div style={{marginBottom:10}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".16em",color:c.lbl,marginBottom:3}}>{lang==="pt"?"A SEGUIR":"NEXT UP"}</div><div style={{fontSize:14,fontWeight:500,color:c.body}}>{enm(runExs[runIdx+1]?.name||"")}</div></div>}
                <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                  <Circle val={runTime} total={rs.restDur||restDur} col="#F97316"/>
                  <div style={{position:"absolute",textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#F97316",lineHeight:1}}>{fmt(runTime)}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.muted,letterSpacing:".12em"}}>{lang==="pt"?"DESCANSO":"REST"}</div></div>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                  <button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"9px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>{runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ CONTINUAR":"▶ RESUME")}</button>
                  <button onClick={advance} style={{cursor:"pointer",background:"transparent",border:"1px solid #F97316",borderRadius:6,padding:"9px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:"#F97316"}}>{lang==="pt"?"SALTAR →":"SKIP →"}</button>
                </div>
              </div>
            ) : (
              <div style={{textAlign:"center",width:"100%"}}>
                <div style={{fontSize:"clamp(18px,4vw,24px)",fontWeight:500,color:c.txt,marginBottom:4}}>{enm(curEx.name)}</div>
                <div style={{fontSize:12,fontWeight:300,color:curCol,marginBottom:18}}>{curEx.focus}</div>
                {runMode==="time" ? (
                  <>
                    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                      <Circle val={runTime} total={rs.exDur||exDur} col="#C084FC"/>
                      <div style={{position:"absolute",textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#C084FC",lineHeight:1}}>{fmt(runTime)}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.muted,letterSpacing:".12em"}}>{lang==="pt"?"TEMPO":"TIME"}</div></div>
                    </div>
                    <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                      <button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"9px 18px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>{runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ CONTINUAR":"▶ RESUME")}</button>
                      <button onClick={advance} style={{cursor:"pointer",background:"transparent",border:"1px solid #F97316",borderRadius:6,padding:"9px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:"#F97316"}}>{lang==="pt"?"SALTAR →":"SKIP →"}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{marginBottom:16}}><div style={{fontFamily:"'Bebas Neue'",fontSize:64,color:"#C084FC",lineHeight:1}}>×{rs.repsN||repsN}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,letterSpacing:".14em"}}>{lang==="pt"?"REPETIÇÕES":"REPETITIONS"}</div></div>
                    <button onClick={repsDone} style={{cursor:"pointer",background:"color-mix(in srgb,#22c55e 15%,transparent)",border:"2px solid #22c55e",borderRadius:10,padding:"12px 28px",fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:".18em",color:"#22c55e",marginBottom:8}}>✓ {lang==="pt"?"FEITO":"DONE"}</button>
                    <div><button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"7px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>{runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ RETOMAR":"▶ RESUME")}</button></div>
                  </>
                )}
                <div style={{marginTop:16,width:"100%",textAlign:"left"}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.lbl,marginBottom:7}}>{lang==="pt"?"DEMONSTRAÇÃO":"DEMO"}</div><YtBtn name={curEx.name} pc={curCol} lang={lang}/></div>
                <div style={{marginTop:14,width:"100%",textAlign:"left"}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.lbl,marginBottom:6}}>{lang==="pt"?"NOTAS":"CUES"}</div>
                  {(curEx.cues||[]).slice(0,2).map((cue,j)=>(<div key={j} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:4}}><div style={{width:3,height:3,borderRadius:"50%",background:curCol,marginTop:5,flexShrink:0}}/><span style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.5}}>{cue}</span></div>))}
                </div>
                {runIdx<runExs.length-1&&<div style={{marginTop:16,width:"100%",borderTop:`1px solid ${c.brd}`,paddingTop:10}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".14em",color:c.lbl,marginBottom:5}}>{lang==="pt"?"PRÓXIMOS":"UPCOMING"}</div>{runExs.slice(runIdx+1,runIdx+3).map((nx,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0"}}><div style={{width:4,height:4,borderRadius:"50%",background:rc(nx.phaseColor||"#888"),opacity:.5,flexShrink:0}}/><span style={{fontSize:12,fontWeight:300,color:c.muted}}>{enm(nx.name)}</span></div>))}</div>}
              </div>
            )}
          </div>
        </>
      );
    }

    // fallback
    return wrap(<div style={{padding:"40px",textAlign:"center",color:c.muted}}>…</div>);
  }

  // ══ TYPES ══════════════════════════════════════════════════════════════
  if(page==="types"){
    return wrap(
      <div style={{maxWidth:880,margin:"0 auto",padding:"20px 20px 86px"}}>
        <div style={{marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${c.div}`}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".2em",color:c.muted,marginBottom:4}}>{lang==="pt"?"TREINAR POR TIPO":"TRAIN BY TYPE"}</div>
          <p style={{fontSize:13,fontWeight:300,color:c.sec,lineHeight:1.65,maxWidth:500}}>{lang==="pt"?"Seleciona a qualidade que mais limita o teu desempenho.":"Select the quality that limits your performance most."}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {Object.entries(TYPES).map(([key,info])=>{
            const isOpen=openType===key;
            const rawExList=TYPE_EX_MAP[key]||[];
            const exList=filterExs(rawExList);
            const sub=typeSub[key]||"ex";
            const tCol=rc(info.color);
            return(
              <div key={key} style={{borderRadius:12,border:`1px solid ${isOpen?tCol+"55":c.brd}`,background:isOpen?`color-mix(in srgb,${tCol} 5%,${c.sur})`:c.sur,transition:"all .2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setOpenType(isOpen?null:key)}>
                  <div style={{width:3,height:36,background:tCol,borderRadius:2,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:tCol,letterSpacing:".07em"}}>{lang==="pt"?info.pt:info.en}</span>
                      {key==="Alongamentos"&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:tCol,padding:"1px 6px",borderRadius:8,border:`1px solid ${tCol}40`}}>{lang==="pt"?"BLOCO FINAL":"FINAL BLOCK"}</span>}
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl}}>{exList.length} ex · {(info.sessions||[]).length} {lang==="pt"?"sessões":"sessions"}</span>
                    </div>
                    <p style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.55,maxWidth:480}}>{lang==="pt"?info.dPt:info.dEn}</p>
                  </div>
                  <div style={{color:c.lbl,fontSize:18,fontWeight:300,transform:isOpen?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</div>
                </div>
                {isOpen&&(
                  <div className="fi" style={{borderTop:`1px solid color-mix(in srgb,${tCol} 25%,transparent)`,padding:"12px 16px 14px"}}>
                    <div style={{padding:"8px 10px",borderRadius:8,border:`1px solid color-mix(in srgb,${tCol} 30%,transparent)`,background:`color-mix(in srgb,${tCol} 8%,transparent)`,marginBottom:10}}>
                      <p style={{fontSize:12,color:c.body}}>{lang==="pt"?info.gPt:info.gEn}</p>
                    </div>
                    <div style={{display:"flex",gap:5,marginBottom:10}}>
                      {[["ex",lang==="pt"?"EXERCÍCIOS":"EXERCISES"],["ses",lang==="pt"?"SESSÕES":"SESSIONS"]].map(([v,lbl])=>(
                        <button key={v} className={`stab${sub===v?" on":""}`} style={{"--tc":tCol,color:sub===v?tCol:c.lbl,border:`1px solid ${sub===v?tCol+"60":c.brd}`}} onClick={()=>setTypeSub(p=>({...p,[key]:v}))}>{lbl} ({v==="ex"?exList.length:(info.sessions||[]).length})</button>
                      ))}
                    </div>
                    {sub==="ex"&&(
                      <div style={{display:"flex",flexDirection:"column",gap:5}}>
                        {exList.map((ex,ei)=>{const uid=`${key}-${ei}`,isExOpen=openTEx===uid;return(
                          <div key={uid} className={`ec${isExOpen?" op":""}`} style={{"--pc":tCol}}>
                            <div style={{padding:"10px 12px",cursor:"pointer"}} onClick={()=>{setOpenTEx(isExOpen?null:uid);if(!isExOpen)setTExTab(p=>({...p,[uid]:null}));}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                                <div style={{flex:1}}>
                                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
                                    <div style={{width:4,height:4,borderRadius:"50%",background:rc(ex.phaseColor||tCol),flexShrink:0}}/>
                                    <span style={{fontSize:13,fontWeight:500,color:isExOpen?c.txt:c.body}}>{enm(ex.name)}</span>
                                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:"2px 5px",borderRadius:3,background:`${levelColor[ex.level]}18`,color:levelColor[ex.level]}}>{lvlL(ex.level)}</span>
                                    {ex.type==="Alongamentos"&&ex.bilateral&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:7,padding:"1px 4px",borderRadius:3,background:`${tCol}20`,color:tCol}}>BILATERAL</span>}
                                    {getEquip(ex)==="gym"&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:7,padding:"1px 4px",borderRadius:3,background:"rgba(251,146,60,.12)",color:"#fb923c",border:"1px solid rgba(251,146,60,.35)"}}>🏋️ GYM</span>}
                                  </div>
                                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:c.sec}}>{ex.sets}</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:c.lbl}}>{lang==="pt"?"DESC":"REST"} {ex.rest}</span></div>
                                </div>
                                <div style={{color:c.lbl,fontSize:16,fontWeight:300,transform:isExOpen?"rotate(45deg)":"none",transition:"transform .2s",marginLeft:8,flexShrink:0}}>+</div>
                              </div>
                            </div>
                            {isExOpen&&<div className="fi"><ExBody ex={ex} uid={uid} tabSt={tExTab} setTabSt={setTExTab} pc={tCol}/></div>}
                          </div>
                        );})}
                      </div>
                    )}
                    {sub==="ses"&&(
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {(info.sessions||[]).map((ses,si)=>{const uid=`${key}-s-${si}`,isOpen2=openTSes===uid,sesSrc=ALL_SESSIONS.find(s=>s.id===ses.code);return(
                          <div key={uid} style={{borderRadius:10,border:`1px solid ${isOpen2?tCol+"55":c.brd}`,background:isOpen2?c.surO:c.sur,overflow:"hidden"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}} onClick={()=>setOpenTSes(isOpen2?null:uid)}>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:tCol,minWidth:28,fontWeight:"500"}}>{ses.code}</div>
                              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:isOpen2?c.txt:c.body,marginBottom:2}}>{lang==="pt"?ses.nPt:ses.nEn}</div><div style={{fontSize:11,fontWeight:300,color:c.muted}}>{lang==="pt"?ses.dPt:ses.dEn}</div></div>
                              <div style={{display:"flex",alignItems:"center",gap:7}}>{sesSrc&&<RunBtn ses={sesSrc} small/>}<div style={{color:c.lbl,fontSize:16,fontWeight:300,transform:isOpen2?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</div></div>
                            </div>
                            {isOpen2&&<div className="fi" style={{borderTop:`1px solid ${c.div}`,padding:"5px 14px 10px"}}><SesExList list={ses.list||[]}/></div>}
                          </div>
                        );})}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ══ EXERCISES ══════════════════════════════════════════════════════════
  const visibleExercises = filterExs(phase.exercises||[]);
  return wrap(
    <div style={{maxWidth:880,margin:"0 auto",padding:"20px 20px 86px"}}>
      <div style={{display:"flex",marginBottom:20,border:`1px solid ${c.brd}`,borderRadius:10,overflow:"hidden"}}>
        {[{lbl:lang==="pt"?"PLIOMETRIA":"PLYOMETRICS",ids:["A","B","C","D"]},{lbl:lang==="pt"?"FORÇA":"STRENGTH",ids:["E","F","G","H","I","J"]},{lbl:lang==="pt"?"MOBILIDADE":"MOBILITY",ids:["K"]}].map((grp,gi,arr)=>(
          <div key={gi} style={{flex:grp.ids.length,borderRight:gi<arr.length-1?`1px solid ${c.brd}`:"none"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".2em",color:c.muted,padding:"6px 12px 5px",borderBottom:`1px solid ${c.brd}`,background:c.sur}}>{grp.lbl}</div>
            <div style={{display:"flex",flexDirection:"column"}}>
              {grp.ids.map((id,idx)=>{const ph=PHASES.find(p=>p.id===id)||PHASES[0],isA=activePhase===id,pCol=rc(ph.color);return(
                <button key={id} style={{background:isA?`color-mix(in srgb,${pCol} 10%,${c.bg})`:c.bg,padding:"9px 12px",borderRadius:0,borderBottom:idx<grp.ids.length-1?`1px solid ${c.brd}`:"none",border:"none",cursor:"pointer",textAlign:"left",transition:"background .2s"}} onClick={()=>{setPhase(id);setOpenEx(null);setExTab({});}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <span style={{fontFamily:"'Bebas Neue'",fontSize:15,color:isA?pCol:c.lbl,minWidth:14}}>{id}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:isA?c.body:c.lbl,lineHeight:1.2}}>{lang==="pt"?ph.labelPt:ph.label}</span>
                    {isA&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:pCol}}/>}
                  </div>
                </button>
              );})}
            </div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${c.hdr}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
          <div style={{width:3,height:14,background:phaseColor,borderRadius:2}}/>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:phaseColor,letterSpacing:".07em"}}>{lang==="pt"?phase.labelPt:phase.label}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.lbl,marginLeft:4}}>{visibleExercises.length} {lang==="pt"?"ex":"ex"}</span>
        </div>
        <p style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.6}}>{lang==="pt"?phase.descPt:phase.desc}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {visibleExercises.map((ex,i)=>{
          const isOpen=openEx===i,typeC=tc(ex.type),isGym=getEquip(ex)==="gym";
          return(
            <div key={i} className={`ec${isOpen?" op":""}`} style={{"--pc":phaseColor}}>
              <div style={{padding:"12px 14px",cursor:"pointer"}} onClick={()=>{setOpenEx(isOpen?null:i);if(!isOpen)setExTab(p=>({...p,[i]:null}));}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontSize:14,fontWeight:500,color:isOpen?c.txt:c.body}}>{enm(ex.name)}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:"2px 5px",borderRadius:9,background:`${typeC}18`,color:typeC,border:`1px solid ${typeC}40`}}>{tl(ex.type)}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:"2px 5px",borderRadius:3,background:`${levelColor[ex.level]}18`,color:levelColor[ex.level]}}>{lvlL(ex.level)}</span>
                      {isGym&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:7,padding:"1px 4px",borderRadius:3,background:"rgba(251,146,60,.12)",color:"#fb923c",border:"1px solid rgba(251,146,60,.35)"}}>🏋️ GYM</span>}
                      {ex.type==="Alongamentos"&&ex.bilateral&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:7,padding:"1px 4px",borderRadius:3,background:`${phaseColor}20`,color:phaseColor}}>BILATERAL</span>}
                    </div>
                    <div style={{display:"flex",gap:12}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:c.sec}}>{ex.sets}</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:c.lbl}}>{lang==="pt"?"DESCANSO":"REST"} {ex.rest}</span></div>
                  </div>
                  <div style={{color:c.lbl,fontSize:18,fontWeight:300,marginLeft:10,transform:isOpen?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</div>
                </div>
              </div>
              {isOpen&&<div className="fi"><ExBody ex={ex} uid={i} tabSt={exTab} setTabSt={setExTab} pc={phaseColor}/></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
