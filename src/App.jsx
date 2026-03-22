import { useState, useRef, useEffect, useCallback } from “react”;

/* ═══ TYPES ════════════════════════════════════════════════════════════════ */
const TYPES = {
Elasticidade: { en:“ELASTICITY”, pt:“ELASTICIDADE”, color:”#C084FC”,
dEn:“Runners who feel heavy at race pace. Develops Achilles elastic return and ankle stiffness.”,
dPt:“Corredores que se sentem pesados ao ritmo de prova.”,
gEn:“↑ Running economy · ↓ Ground contact time · ↑ Achilles stiffness”,
gPt:“↑ Economia de corrida · ↓ Tempo de contacto · ↑ Rigidez do Aquiles”,
sessions:[
{code:“ES1”,nEn:“Spring Foundations”,nPt:“Base Elástica”,dEn:“Wks 1–2: ankle stiffness basics.”,dPt:“Sem 1–2: rigidez do tornozelo.”,list:[{ph:“A”,nm:“Pogo Hops”},{ph:“A”,nm:“Single-Leg Pogo Hops”},{ph:“B”,nm:“Bounding (A-Bounds)”},{ph:“I”,nm:“Tibialis Raise”},{ph:“J”,nm:“Dead Bug with Band”}]},
{code:“ES2”,nEn:“Reactive Stiffness”,nPt:“Rigidez Reativa”,dEn:“Wks 3–4: hurdle hops and snap-downs.”,dPt:“Sem 3–4: barreiras e snap-downs.”,list:[{ph:“A”,nm:“Double-Leg Hurdle Hops”},{ph:“A”,nm:“Tuck Jump”},{ph:“E”,nm:“Snap-Down”},{ph:“I”,nm:“Tibialis Raise”},{ph:“J”,nm:“Hollow Body Hold”}]},
{code:“ES3”,nEn:“Elastic Peak”,nPt:“Pico Elástico”,dEn:“Wks 5–6: depth drops pre-race.”,dPt:“Sem 5–6: quedas em profundidade.”,list:[{ph:“A”,nm:“Depth Drop → Rebound”},{ph:“A”,nm:“Double-Leg Hurdle Hops”},{ph:“B”,nm:“Bounding (A-Bounds)”},{ph:“A”,nm:“Single-Leg Pogo Hops”},{ph:“J”,nm:“Pallof Press to Rotation”}]},
]},
Pliometria: { en:“PLYOMETRICS”, pt:“PLIOMETRIA”, color:”#E8FF47”,
dEn:“Runners lacking explosive power or finishing kick.”,
dPt:“Corredores sem potência explosiva ou sprint final.”,
gEn:“↑ Reactive strength index · ↑ Rate of force development · ↑ Finishing kick”,
gPt:“↑ Índice de força reativa · ↑ Taxa de desenvolvimento de força”,
sessions:[
{code:“PS1”,nEn:“Reactive Base”,nPt:“Base Reativa”,dEn:“Foundation: bilateral jumps.”,dPt:“Base: saltos bilaterais.”,list:[{ph:“B”,nm:“Squat Jump”},{ph:“A”,nm:“Tuck Jump”},{ph:“C”,nm:“Lateral Skater Jumps”},{ph:“I”,nm:“Rapid Toe Taps”},{ph:“J”,nm:“Bear Crawl”}]},
{code:“PS2”,nEn:“Jump Complex”,nPt:“Complexo de Saltos”,dEn:“Horizontal and rotational jumps.”,dPt:“Saltos horizontais e rotacionais.”,list:[{ph:“G”,nm:“Drop Jump to Broad Jump”},{ph:“C”,nm:“Rotational Box Jump”},{ph:“F”,nm:“Sumo Squat Jump”},{ph:“F”,nm:“Lateral Hurdle Hop (Single-Leg)”},{ph:“J”,nm:“Hollow Body Hold”}]},
{code:“PS3”,nEn:“Max Explosive”,nPt:“Explosividade Máxima”,dEn:“Peak reactive load — use 2–3 wks before race.”,dPt:“Carga reativa máxima.”,list:[{ph:“A”,nm:“Depth Drop → Rebound”},{ph:“G”,nm:“Drop Jump to Broad Jump”},{ph:“A”,nm:“Tuck Jump”},{ph:“B”,nm:“Bulgarian Split Jump”},{ph:“J”,nm:“Single-Leg Plank Hip Extension”}]},
]},
Reflexo: { en:“REFLEX”, pt:“REFLEXO”, color:”#00D4FF”,
dEn:“Runners with low cadence (under 170 spm) or poor trail coordination.”,
dPt:“Corredores com cadência baixa ou dificuldade em terreno técnico.”,
gEn:“↑ Cadence · ↑ Neural coordination · ↑ Trail agility”,
gPt:“↑ Cadência · ↑ Coordenação neural · ↑ Agilidade em trail”,
sessions:[
{code:“RS1”,nEn:“Neural Activation”,nPt:“Ativação Neural”,dEn:“Max foot speed and cadence.”,dPt:“Velocidade máxima dos pés.”,list:[{ph:“D”,nm:“Fast-Foot Drill”},{ph:“D”,nm:“High Knees Sprint”},{ph:“D”,nm:“A-Skip”},{ph:“I”,nm:“Rapid Toe Taps”},{ph:“D”,nm:“Wall Drive Drill”}]},
{code:“RS2”,nEn:“Coordination Circuit”,nPt:“Circuito de Coordenação”,dEn:“Lateral and stride coordination.”,dPt:“Coordenação lateral e de passada.”,list:[{ph:“C”,nm:“Carioca Drill”},{ph:“D”,nm:“B-Skip”},{ph:“C”,nm:“Reactive Side Shuffle Burst”},{ph:“D”,nm:“Wicket Drills”},{ph:“E”,nm:“Snap-Down”}]},
{code:“RS3”,nEn:“Trail Agility”,nPt:“Agilidade de Trail”,dEn:“Reactive lateral movements for trail.”,dPt:“Movimentos laterais reativos para trail.”,list:[{ph:“C”,nm:“Lateral Skater Jumps”},{ph:“C”,nm:“Diagonal Bound”},{ph:“C”,nm:“Carioca Drill”},{ph:“D”,nm:“Fast-Foot Drill”},{ph:“J”,nm:“Bear Crawl”}]},
{code:“RS4”,nEn:“Speed Mechanics”,nPt:“Mecânica de Velocidade”,dEn:“Sprint drills for stride efficiency.”,dPt:“Drills de sprint para eficiência.”,list:[{ph:“D”,nm:“A-Skip”},{ph:“D”,nm:“B-Skip”},{ph:“D”,nm:“High Knees Sprint”},{ph:“D”,nm:“Wicket Drills”},{ph:“E”,nm:“Snap-Down”}]},
]},
Força: { en:“STRENGTH”, pt:“FORÇA”, color:”#FF6B35”,
dEn:“Runners with injury history or training above 70km/week.”,
dPt:“Corredores com historial de lesões ou treino acima de 70km/semana.”,
gEn:“↑ Injury resilience · ↑ Eccentric load tolerance · ↓ Asymmetry”,
gPt:“↑ Resistência a lesões · ↑ Tolerância excêntrica · ↓ Assimetria”,
sessions:[
{code:“FS1”,nEn:“Posterior Chain”,nPt:“Cadeia Posterior”,dEn:“Hamstring and hip hinge focus.”,dPt:“Foco nos isquiotibiais.”,list:[{ph:“E”,nm:“Nordic Hamstring Curl”},{ph:“E”,nm:“Good Morning”},{ph:“E”,nm:“Floor Hamstring Curl”},{ph:“E”,nm:“Bodyweight Single-Leg RDL”},{ph:“J”,nm:“Dead Bug with Band”}]},
{code:“FS2”,nEn:“Knee Protection”,nPt:“Proteção do Joelho”,dEn:“Quad and tibialis eccentric load.”,dPt:“Carga excêntrica do quad e tibial.”,list:[{ph:“G”,nm:“Wall Sit Explosive Stand”},{ph:“G”,nm:“Wall-Supported Sissy Squat”},{ph:“I”,nm:“Eccentric Calf Raise”},{ph:“I”,nm:“Tibialis Raise”},{ph:“J”,nm:“Hollow Body Hold”}]},
{code:“FS3”,nEn:“Glute & Adductor”,nPt:“Glúteos & Adutores”,dEn:“Hip stability complex.”,dPt:“Complexo de estabilidade da anca.”,list:[{ph:“H”,nm:“Single-Leg Glute Bridge Explode”},{ph:“H”,nm:“Donkey Kick Explosive”},{ph:“F”,nm:“Copenhagen Adductor Press”},{ph:“H”,nm:“Glute Bridge March”},{ph:“J”,nm:“Side Plank Hip Dip”}]},
{code:“FS4”,nEn:“Injury Shield”,nPt:“Escudo Anti-Lesão”,dEn:“Most evidence-backed prevention combined.”,dPt:“Exercícios com mais evidência de prevenção.”,list:[{ph:“E”,nm:“Nordic Hamstring Curl”},{ph:“F”,nm:“Copenhagen Adductor Press”},{ph:“I”,nm:“Tibialis Raise”},{ph:“I”,nm:“Banded Dorsiflexion Pulse”},{ph:“J”,nm:“Bear Crawl”}]},
]},
Impulsão: { en:“POWER”, pt:“IMPULSÃO”, color:”#F97316”,
dEn:“Runners who lose time on climbs or fade in the final race third.”,
dPt:“Corredores que perdem tempo em subidas ou decaem no último terço.”,
gEn:“↑ Hill power · ↑ Stride propulsion · ↑ Late-race capacity”,
gPt:“↑ Potência em subidas · ↑ Propulsão de passada”,
sessions:[
{code:“IS1”,nEn:“Hill Power”,nPt:“Potência em Subidas”,dEn:“Hip drive for climbing.”,dPt:“Impulso de anca para subidas.”,list:[{ph:“B”,nm:“Chair Step-Up Jump”},{ph:“H”,nm:“Explosive Step-Up with Knee Drive”},{ph:“D”,nm:“Resisted Bounding”},{ph:“B”,nm:“Bounding (A-Bounds)”},{ph:“J”,nm:“Single-Leg Plank Hip Extension”}]},
{code:“IS2”,nEn:“Stride Propulsion”,nPt:“Propulsão de Passada”,dEn:“Horizontal and hip extension power.”,dPt:“Potência horizontal e de extensão.”,list:[{ph:“H”,nm:“Hip Thrust Jump”},{ph:“B”,nm:“Alternating Lunge Jump”},{ph:“F”,nm:“Lateral Bound to Stick”},{ph:“B”,nm:“Single-Leg Broad Jumps”},{ph:“J”,nm:“Pallof Press to Rotation”}]},
{code:“IS3”,nEn:“Peak Power”,nPt:“Potência Máxima”,dEn:“Maximum single-leg power.”,dPt:“Potência unilateral máxima.”,list:[{ph:“B”,nm:“Bulgarian Split Jump”},{ph:“F”,nm:“Explosive Lateral Lunge”},{ph:“F”,nm:“Curtsy Lunge”},{ph:“B”,nm:“Single-Leg Broad Jumps”},{ph:“J”,nm:“Dead Bug with Band”}]},
]},
Core: { en:“CORE”, pt:“CORE”, color:”#10B981”,
dEn:“Runners with trunk collapse when tired or lower back pain.”,
dPt:“Corredores com colapso de tronco ou dor lombar.”,
gEn:“↑ Trunk stiffness · ↑ Running posture under fatigue · ↓ Energy leakage”,
gPt:“↑ Rigidez do tronco · ↑ Postura sob fadiga”,
sessions:[
{code:“CS1”,nEn:“Anti-Extension Base”,nPt:“Base Anti-Extensão”,dEn:“Spinal stiffness and core endurance.”,dPt:“Rigidez espinhal e resistência.”,list:[{ph:“J”,nm:“Dead Bug with Band”},{ph:“J”,nm:“Hollow Body Hold”},{ph:“J”,nm:“Superman Hold”},{ph:“J”,nm:“Bear Crawl”},{ph:“I”,nm:“Tibialis Raise”}]},
{code:“CS2”,nEn:“Anti-Rotation Focus”,nPt:“Foco Anti-Rotação”,dEn:“Most running-specific core quality.”,dPt:“Qualidade core mais específica.”,list:[{ph:“J”,nm:“Pallof Press to Rotation”},{ph:“J”,nm:“Single-Leg Plank Hip Extension”},{ph:“J”,nm:“Side Plank Hip Dip”},{ph:“J”,nm:“Hollow Body Hold”},{ph:“E”,nm:“Bodyweight Single-Leg RDL”}]},
{code:“CS3”,nEn:“Running Posture”,nPt:“Postura de Corrida”,dEn:“Prevent late-race trunk collapse.”,dPt:“Prevenir colapso do tronco no fim.”,list:[{ph:“J”,nm:“Dead Bug with Band”},{ph:“J”,nm:“Bear Crawl”},{ph:“J”,nm:“Pallof Press to Rotation”},{ph:“J”,nm:“Single-Leg Plank Hip Extension”},{ph:“J”,nm:“Side Plank Hip Dip”}]},
]},
};

/* ═══ EXERCISE BUILDER ═════════════════════════════════════════════════════ */
const mk = (n,sets,rest,type,focus,lvl,vid,cues,hl) => ({
name:n, sets, rest, type, focus, level:lvl, video:vid,
cues, science:{headline:hl}
});

/* ═══ PHASES ════════════════════════════════════════════════════════════════ */
const PHASES = [
{ id:“A”, label:“STIFFNESS & ELASTICITY”, labelPt:“RIGIDEZ & ELASTICIDADE”, color:”#E8FF47”,
desc:“Ground contact time reduction. The foundation of running economy.”,
descPt:“Redução do tempo de contacto com o solo. A base da economia de corrida.”,
exercises:[
mk(“Pogo Hops”,“3×20”,“90s”,“Elasticidade”,“Achilles tendon elastic energy”,“Foundational”,“https://www.youtube.com/watch?v=dMnECxl6dsY”,[“Stay on forefoot — zero heel contact”,“Ankles stiff like springs”,“Minimal ground contact time”,“Arms relaxed at sides”],“Reduces ground contact time ~14% in 6 weeks”),
mk(“Single-Leg Pogo Hops”,“3×15 each”,“90s”,“Elasticidade”,“Unilateral ankle stiffness”,“Foundational”,“https://www.youtube.com/results?search_query=single+leg+pogo+hop”,[“Hop on one forefoot — no heel contact”,“Lock the ankle — stiff, not floppy”,“Drive free knee up”,“Match rhythm both sides”],“Exposes left-right stiffness asymmetries”),
mk(“Double-Leg Hurdle Hops”,“3×6 hurdles”,“2min”,“Pliometria”,“Reactive stiffness & RFD”,“Intermediate”,“https://www.youtube.com/results?search_query=hurdle+hops+plyometric+running”,[“Rebound immediately — don’t stick”,“Push the ground away, not up”,“Keep hips tall”,“Land mid-foot, spring off instantly”],“Trains ground contacts <200ms — critical for RE”),
mk(“Tuck Jump”,“3×8”,“90s”,“Pliometria”,“Triple extension + reactive landing”,“Intermediate”,“https://www.youtube.com/results?search_query=tuck+jump+plyometric”,[“Jump and pull both knees to chest”,“Land on forefoot — immediate rebound”,“Maintain upright posture”,“Focus on knee speed and height”],“Explosive hip flexion and reactive landing”),
mk(“Depth Drop → Rebound”,“3×5”,“2min”,“Pliometria”,“Neuromuscular reactivity & RSI”,“Advanced”,“https://www.youtube.com/results?search_query=depth+drop+rebound+plyometric”,[“Step off 40–50cm box — don’t jump”,“Absorb minimally — rebound fast”,“Target contact time <200ms”,“Slight knee bend”],“Increases RSI — key predictor of running economy”),
]},
{ id:“B”, label:“HIP POWER & PROPULSION”, labelPt:“POTÊNCIA DA ANCA & PROPULSÃO”, color:”#FF6B35”,
desc:“Horizontal force production. Directly translates to stride power.”,
descPt:“Produção de força horizontal. Traduz-se diretamente em potência de passada.”,
exercises:[
mk(“Squat Jump”,“3×10”,“90s”,“Pliometria”,“Bilateral hip and quad power”,“Foundational”,“https://www.youtube.com/results?search_query=squat+jump+plyometric+running”,[“Quarter squat — don’t go too deep”,“Explode upward”,“Land softly on forefoot”,“Keep trunk upright”],“Most studied plyometric in running economy research”),
mk(“Chair Step-Up Jump”,“3×6 each”,“90s”,“Impulsão”,“Unilateral hip extension — chair only”,“Foundational”,“https://www.youtube.com/results?search_query=step+up+jump+knee+drive+home”,[“Use a sturdy chair (~45cm)”,“Drive opposite knee explosively above hip”,“Land with soft absorption”,“Focus on hip drive”],“High glute max and quad activation — zero equipment”),
mk(“Single-Leg Broad Jumps”,“4×4 each”,“90s”,“Impulsão”,“Unilateral power & gluteal drive”,“Intermediate”,“https://www.youtube.com/results?search_query=single+leg+broad+jump+plyometric”,[“Drive off one leg — stick the landing”,“Aggressive hip extension at takeoff”,“Reach forward with opposite knee”,“Control landing”],“Directly mimics single-leg push-off mechanics”),
mk(“Alternating Lunge Jump”,“3×10”,“90s”,“Impulsão”,“Alternating single-leg hip power”,“Intermediate”,“https://www.youtube.com/results?search_query=alternating+lunge+jump+running”,[“Start in lunge position”,“Explode upward switching legs”,“Land in opposite lunge — soft”,“Arms drive the switch”],“Trains alternating hip power mirroring running stride”),
mk(“Bounding (A-Bounds)”,“3×30m”,“2min”,“Elasticidade”,“Hip extension power & stride length”,“Intermediate”,“https://www.youtube.com/results?search_query=A+bounds+bounding+running”,[“Exaggerated running — slow-motion power”,“High knee drive with each bound”,“Full hip extension on push-off”,“Arms mirror legs”],“Increases musculotendinous stiffness”),
mk(“Bulgarian Split Jump”,“3×6 each”,“2min”,“Força”,“Single-leg explosive hip power”,“Advanced”,“https://www.youtube.com/results?search_query=Bulgarian+split+squat+jump+runners”,[“Rear foot elevated 40–50cm”,“Explosive jump switching legs”,“Land soft, drive up immediately”,“Torso upright”],“Fixes left-right force asymmetries at 80km+/week”),
]},
{ id:“C”, label:“LATERAL & ROTATIONAL CONTROL”, labelPt:“CONTROLO LATERAL & ROTACIONAL”, color:”#00D4FF”,
desc:“Frontal plane stability. Often neglected, always limiting at high mileage.”,
descPt:“Estabilidade no plano frontal. Frequentemente negligenciada.”,
exercises:[
mk(“Carioca Drill”,“3×20m each way”,“60s”,“Reflexo”,“Lateral coordination & rhythm”,“Foundational”,“https://www.youtube.com/results?search_query=carioca+drill+running”,[“Cross trailing foot alternately”,“Stay on forefoot”,“Drive hips, not just feet”,“Gradually increase speed”],“Trains hip rotation and frontal-plane coordination”),
mk(“Reactive Side Shuffle Burst”,“4×10m each way”,“60s”,“Reflexo”,“Lateral reactive power”,“Foundational”,“https://www.youtube.com/results?search_query=reactive+side+shuffle+lateral+agility”,[“Stay low — hips bent”,“Drive laterally through outside leg”,“Push off and immediately reset”,“Keep shoulders square”],“Improves lateral reactive speed — essential for trail”),
mk(“Lateral Skater Jumps”,“3×10 (5 each)”,“90s”,“Reflexo”,“Medial glute & lateral hip stability”,“Intermediate”,“https://www.youtube.com/results?search_query=lateral+skater+jumps+runners”,[“Land on single leg — hold 1 second”,“Push laterally with hip, not knee”,“Keep shin angle positive”,“Glute drives the push”],“Trains frontal-plane stability — most undertrained”),
mk(“Diagonal Bound”,“3×5 each way”,“90s”,“Reflexo”,“Multi-directional reactive power”,“Intermediate”,“https://www.youtube.com/results?search_query=diagonal+bound+lateral+plyometric”,[“Bound forward at 45° off one leg”,“Land on opposite leg — hold 1 sec”,“Alternate direction each bound”,“Drive inside arm”],“Multi-directional reactive power for trail”),
mk(“Rotational Box Jump”,“3×4 each way”,“2min”,“Pliometria”,“Transverse plane power”,“Advanced”,“https://www.youtube.com/results?search_query=rotational+box+jump+plyometric”,[“Stand sideways to box”,“Quarter-turn jump, land facing forward”,“Control landing — absorb through hip”,“Drive off inside leg”],“Develops transverse plane stability”),
]},
{ id:“D”, label:“SPEED & NEUROMUSCULAR SHARPNESS”, labelPt:“VELOCIDADE & NITIDEZ NEUROMUSCULAR”, color:”#C084FC”,
desc:“Fast-twitch recruitment. Critical for surges and finishing kick.”,
descPt:“Recrutamento de fibras rápidas. Essencial para acelerações.”,
exercises:[
mk(“A-Skip”,“3×20m”,“60s”,“Reflexo”,“Hip flexor timing & forefoot mechanics”,“Foundational”,“https://www.youtube.com/results?search_query=A+skip+drill+running+mechanics”,[“Skip forward driving knee to hip height”,“Grounded foot stays on forefoot”,“Drive the arm opposite to the knee”,“Keep the skip rhythm consistent”],“Classic sprint drill — hip flexor timing”),
mk(“B-Skip”,“3×20m”,“60s”,“Reflexo”,“Hamstring speed & pawing foot strike”,“Foundational”,“https://www.youtube.com/results?search_query=B+skip+drill+running+mechanics”,[“Like A-Skip but extend knee forward at top”,“Claw the foot back — pawing action”,“Keep torso upright”,“Controlled speed — mechanics over pace”],“Trains hamstring speed and pawing foot strike”),
mk(“High Knees Sprint”,“4×20m”,“60s”,“Reflexo”,“Hip flexor speed + cadence”,“Foundational”,“https://www.youtube.com/results?search_query=high+knees+sprint+drill+running”,[“Drive knees above hip height”,“Land on forefoot under the hip”,“Pump arms aggressively in sync”,“Maintain full speed for 20m”],“Increases hip flexor RFD — primary cadence limiter”),
mk(“Fast-Foot Drill”,“4×10m”,“60s”,“Reflexo”,“Cadence & neural firing rate”,“Foundational”,“https://www.youtube.com/results?search_query=speed+ladder+fast+foot+drill+running”,[“Max foot turnover — not power”,“Light, quick contacts”,“Eyes forward, not down”,“Relax hands and jaw”],“Raises optimal cadence by training neural firing rate”),
mk(“Wall Drive Drill”,“4×10 each”,“60s”,“Reflexo”,“Hip flexor power & running posture”,“Intermediate”,“https://www.youtube.com/results?search_query=wall+drill+knee+drive+running”,[“Hands on wall, lean 45°”,“Drive knee explosively toward wall”,“Lower back under control”,“Maintain rigid plank position”],“Isolates hip flexor power in exact running position”),
mk(“Wicket Drills”,“3×30m”,“90s”,“Reflexo”,“Stride mechanics & hip flexor speed”,“Intermediate”,“https://www.youtube.com/results?search_query=wicket+drills+running+stride”,[“Wickets spaced for slight over-stride challenge”,“Maintain high hips”,“Quick pawing action”,“Gradually build stride frequency”],“Corrects overstriding — key source of braking forces”),
mk(“Resisted Bounding”,“3×20m”,“2min”,“Impulsão”,“Power endurance & neuromuscular load”,“Advanced”,“https://www.youtube.com/results?search_query=resisted+bounding+uphill+running”,[“5–8% incline or light resistance band”,“Maximum effort each bound”,“Full triple extension: ankle, knee, hip”,“Recover completely before next rep”],“Overloads triple extension — most power-intensive event per stride”),
]},
{ id:“E”, label:“HAMSTRINGS”, labelPt:“ISQUIOTIBIAIS”, color:”#F97316”,
desc:“Posterior chain loading under running-specific demands.”,
descPt:“Carga da cadeia posterior em exigências específicas de corrida.”,
exercises:[
mk(“Bodyweight Single-Leg RDL”,“3×10 each”,“90s”,“Força”,“Hamstring eccentric control & balance”,“Foundational”,“https://www.youtube.com/results?search_query=bodyweight+single+leg+RDL+runners”,[“Stand on one leg, slight knee bend”,“Hinge at hip — reach toward floor”,“Feel hamstring stretch on standing leg”,“Drive through heel — squeeze glute at top”],“Foundational hamstring eccentric control”),
mk(“Good Morning”,“3×10”,“90s”,“Força”,“Hip hinge strength & flexibility”,“Foundational”,“https://www.youtube.com/results?search_query=good+morning+exercise+bodyweight”,[“Hands behind head”,“Hinge at hip — push hips back, flat back”,“Feel hamstrings load at the bottom”,“Drive through heels to return”],“Builds hip hinge strength — foundational for injury prevention”),
mk(“Snap-Down”,“3×6”,“90s”,“Reflexo”,“Reactive hip hinge — hamstring pre-activation”,“Foundational”,“https://www.youtube.com/results?search_query=snap+down+drill+hamstring+running”,[“Start tall, slight forward lean”,“Snap hips back aggressively — fast”,“Land in quarter-squat, hamstrings loaded”,“Rebound immediately into next rep”],“Trains rapid hamstring pre-activation before foot strike”),
mk(“Floor Hamstring Curl”,“3×8”,“90s”,“Força”,“Eccentric hamstring strength — no equipment”,“Intermediate”,“https://www.youtube.com/results?search_query=floor+sliding+hamstring+curl+bodyweight”,[“Lie on back, feet on smooth floor in socks”,“Bridge hips fully, then curl heels toward glutes”,“Keep hips elevated throughout”,“Extend legs slowly for the eccentric phase”],“At-home eccentric hamstring exercise comparable to Nordic curl”),
mk(“Single-Leg RDL Jump”,“3×4 each”,“90s”,“Força”,“Hip hinge power & hamstring load”,“Intermediate”,“https://www.youtube.com/results?search_query=single+leg+RDL+jump+hamstring”,[“Hinge on one leg — rear leg extends behind”,“Drive explosively through standing hip to jump”,“Land softly on same leg”,“Reset fully before next rep”],“Trains hamstring at most critical position — late swing”),
mk(“Nordic Hamstring Curl”,“3×5”,“2min”,“Força”,“Eccentric hamstring strength — injury prevention”,“Advanced”,“https://www.youtube.com/results?search_query=nordic+hamstring+curl+tutorial+runners”,[“Kneel with feet anchored firmly”,“Lower slowly — 3–4 seconds down”,“Control descent as long as possible”,“Drive back up using hamstrings”],“Reduces hamstring injury risk by up to 51%”),
]},
{ id:“F”, label:“ADDUCTORS”, labelPt:“ADUTORES”, color:”#EC4899”,
desc:“Medial hip stability and groin loading. Adductors are active propulsors in running.”,
descPt:“Estabilidade medial da anca. Os adutores são propulsores ativos na corrida.”,
exercises:[
mk(“Sumo Squat Jump”,“3×10”,“90s”,“Pliometria”,“Adductor loading under vertical power”,“Foundational”,“https://www.youtube.com/results?search_query=sumo+squat+jump+plyometric”,[“Wide stance — feet 1.5× shoulder width, toes out”,“Squat to parallel, then explode upward”,“Land in same wide stance — absorb softly”,“Knees track over toes”],“Wide stance activates adductors ~40% more”),
mk(“Explosive Lateral Lunge”,“3×8 each”,“90s”,“Impulsão”,“Adductor SSC at wide hip angles”,“Foundational”,“https://www.youtube.com/results?search_query=explosive+lateral+lunge+adductor”,[“Step wide to side — deep lateral lunge”,“Push explosively back to centre through inner thigh”,“Feel adductor stretch at bottom”,“Build speed each set”],“Loads adductors at wide hip angles — groin protection”),
mk(“Curtsy Lunge”,“3×10 each”,“90s”,“Impulsão”,“Adductor at running-specific angles”,“Intermediate”,“https://www.youtube.com/results?search_query=curtsy+lunge+adductor+running”,[“Step diagonally behind — cross behind standing leg”,“Lower until front thigh nearly parallel”,“Front knee over second toe”,“Drive back to standing through front heel”],“Loads adductor at running-specific hip angles”),
mk(“Lateral Bound to Stick”,“3×5 each”,“90s”,“Impulsão”,“Adductor propulsion & medial stability”,“Intermediate”,“https://www.youtube.com/results?search_query=lateral+bound+to+stick+adductor”,[“Push off laterally through inside of foot”,“Land on opposite single leg — hold 1 second”,“Squeeze inner thigh on landing”,“Don’t let the knee cave inward”],“Trains adductors as propulsors — most neglected function”),
mk(“Copenhagen Adductor Press”,“3×8 each”,“90s”,“Força”,“Adductor longus strength”,“Intermediate”,“https://www.youtube.com/results?search_query=copenhagen+adductor+exercise+runners”,[“Side-lying, top foot on bench, bottom leg hanging”,“Lift hips using top leg adductors”,“Keep body in a straight line”,“Lower slowly — 2 seconds, pause, drive up”],“Highest adductor activation — reduces groin injury by 41%”),
mk(“Lateral Hurdle Hop (Single-Leg)”,“3×5 each”,“2min”,“Pliometria”,“Reactive medial hip loading”,“Advanced”,“https://www.youtube.com/results?search_query=single+leg+lateral+hurdle+hop”,[“Hop laterally over low hurdles on single leg”,“Land and immediately rebound — no pause”,“Drive free knee upward”,“Stance knee slightly bent — never locked”],“Combines adductor load with reactive stiffness”),
]},
{ id:“G”, label:“QUADRICEPS”, labelPt:“QUADRICÍPITES”, color:”#14B8A6”,
desc:“Knee extensor power and eccentric load tolerance.”,
descPt:“Potência extensora do joelho e tolerância à carga excêntrica.”,
exercises:[
mk(“Wall Sit Explosive Stand”,“3×10”,“90s”,“Força”,“Quad endurance + explosive transition”,“Foundational”,“https://www.youtube.com/results?search_query=wall+sit+explosive+stand+quad”,[“Wall sit — 90° at knee and hip, back flat”,“Hold 3 seconds, then explode off the wall”,“Land with soft knees”,“Return to wall sit with control”],“Quad fatigue tolerance — trail descent prep”),
mk(“Wall-Supported Sissy Squat”,“3×8”,“90s”,“Força”,“Terminal knee extension & patellar tendon”,“Intermediate”,“https://www.youtube.com/results?search_query=sissy+squat+tutorial+knee+runners”,[“Heels slightly elevated”,“Hold wall lightly for balance only”,“Lean back as you lower, knees forward”,“Keep hips extended — quad-only”],“Loads quads at long muscle lengths”),
mk(“Drop Jump to Broad Jump”,“3×5”,“2min”,“Pliometria”,“Quad eccentric absorption into propulsion”,“Advanced”,“https://www.youtube.com/results?search_query=drop+jump+broad+jump+plyometric”,[“Step off 30–40cm box — don’t jump”,“Absorb briefly, then explode forward”,“Maximise horizontal distance”,“Land both feet, soft absorption”],“Trains eccentric-concentric coupling — highest transfer to RE”),
mk(“Plyometric RFESS”,“3×5 each”,“2min”,“Força”,“Single-leg quad power”,“Advanced”,“https://www.youtube.com/results?search_query=plyometric+Bulgarian+split+squat+quadriceps”,[“Rear foot on bench, front foot for upright shin”,“Sink into lunge — front knee over second toe”,“Drive explosively off front foot to jump”,“Land on same front foot”],“Highest unilateral quad loading”),
]},
{ id:“H”, label:“GLUTES”, labelPt:“GLÚTEOS”, color:”#8B5CF6”,
desc:“Gluteal power and single-leg stability. Primary driver of running propulsion.”,
descPt:“Potência glútea e estabilidade unilateral. O principal motor da propulsão.”,
exercises:[
mk(“Single-Leg Glute Bridge Explode”,“3×5 each”,“90s”,“Força”,“Unilateral glute max strength”,“Foundational”,“https://www.youtube.com/results?search_query=single+leg+glute+bridge+explosive”,[“Lie on back, one foot flat, other leg extended”,“Drive through heel to raise hips fully”,“At the top — sharp push like stamping the ceiling”,“Lower with control — 2 seconds”],“Directly mimics single-leg stance demands”),
mk(“Glute Bridge March”,“3×10 each”,“60s”,“Força”,“Glute endurance under alternating load”,“Foundational”,“https://www.youtube.com/results?search_query=glute+bridge+march+running”,[“Bridge hips fully — squeeze glutes”,“Raise one knee toward chest slowly”,“Hold 2 seconds — keep hips level”,“Alternate legs without letting hips drop”],“Trains glute endurance and hip-core coupling”),
mk(“Donkey Kick Explosive”,“3×12 each”,“60s”,“Força”,“Glute max isolation + endurance”,“Foundational”,“https://www.youtube.com/results?search_query=donkey+kick+explosive+glute”,[“On hands and knees — neutral spine”,“Drive one heel toward ceiling explosively”,“Pause at top — 1 second contraction”,“Lower with control”],“Isolates glute max in hip extension”),
mk(“Explosive Step-Up with Knee Drive”,“3×8 each”,“90s”,“Impulsão”,“Glute max + hip drive — chair only”,“Intermediate”,“https://www.youtube.com/results?search_query=step+up+knee+drive+glute+runners”,[“Use a sturdy chair (~40cm)”,“Step up and drive opposite knee above hip”,“Hold top 1 second — squeeze glute hard”,“Focus on glute engagement”],“Trains glute-hip drive coupling — engine of hill running”),
mk(“Hip Thrust Jump”,“3×6”,“90s”,“Impulsão”,“Explosive glute max activation”,“Intermediate”,“https://www.youtube.com/results?search_query=hip+thrust+jump+plyometric+glutes”,[“Upper back on bench, feet flat and hip-width”,“Drive hips explosively upward — full extension”,“Land softly, reload immediately”,“Chin tucked — don’t hyperextend”],“Hip thrust = highest gluteus maximus EMG of any exercise”),
mk(“Lateral Band Walk to Squat Jump”,“3×8 each”,“90s”,“Força”,“Glute medius → glute max sequence”,“Advanced”,“https://www.youtube.com/results?search_query=lateral+band+walk+squat+jump+glutes”,[“Band just above knees — maintain tension”,“3 lateral steps, hips low and knees out”,“On final step, drive into explosive squat jump”,“Land softly and reset”],“Pre-activates glute medius before glute max loading”),
]},
{ id:“I”, label:“TIBIA & ANTERIOR LEG”, labelPt:“TÍBIA & PERNA ANTERIOR”, color:”#06B6D4”,
desc:“Tibialis anterior strength and dorsiflexion control. Most overlooked muscle group.”,
descPt:“Força do tibial anterior e controlo da dorsiflexão. O grupo mais negligenciado.”,
exercises:[
mk(“Heel Walk”,“3×20m”,“60s”,“Força”,“Tibialis anterior endurance — zero equipment”,“Foundational”,“https://www.youtube.com/results?search_query=heel+walk+drill+tibialis+anterior”,[“Raise the forefoot completely — walk on heels only”,“Keep toes pulled up high”,“Walk at normal pace”,“Add slight uphill for greater challenge”],“Most accessible tibialis anterior endurance drill”),
mk(“Tibialis Raise”,“3×15”,“60s”,“Força”,“Tibialis anterior strength — shin splint prevention”,“Foundational”,“https://www.youtube.com/results?search_query=tibialis+raise+shin+splints+runners”,[“Heels on a step or plate, back against wall”,“Raise toes and forefoot as high as possible”,“Hold top for 1 second”,“Lower slowly — 3 seconds”],“Directly targets tibialis anterior — responsible for most shin pain”),
mk(“Rapid Toe Taps”,“4×15 sec”,“60s”,“Reflexo”,“Tibialis anterior speed + neural activation”,“Foundational”,“https://www.youtube.com/results?search_query=rapid+toe+taps+tibialis+anterior”,[“Face a low step or line”,“Alternate tapping as fast as possible”,“Stay on ball of standing foot”,“Maximum foot speed — dorsiflexion focus”],“Trains tibialis anterior at running-relevant neural firing rates”),
mk(“Banded Dorsiflexion Pulse”,“3×12 each”,“60s”,“Força”,“Dorsiflexion range and tibial loading”,“Intermediate”,“https://www.youtube.com/results?search_query=banded+dorsiflexion+exercise+runners”,[“Sit on floor, band looped around foot from behind”,“Pull toes toward shin against band resistance”,“2 quick pulses at end range per rep”,“Keep heel grounded”],“Limited dorsiflexion is a primary injury risk factor”),
mk(“Eccentric Calf Raise”,“3×12”,“60s”,“Força”,“Achilles tendon eccentric loading”,“Intermediate”,“https://www.youtube.com/results?search_query=eccentric+calf+raise+Achilles+tendon”,[“Rise on two feet to the top position”,“Lower slowly on one foot only — 3–4 seconds”,“Full range — heel drops below the step”,“Keep lowering leg’s knee straight”],“Gold standard Achilles tendon strengthening exercise”),
]},
{ id:“J”, label:“CORE”, labelPt:“CORE”, color:”#10B981”,
desc:“Anti-rotation and spinal stiffness specific to running mechanics.”,
descPt:“Rigidez anti-rotação e estabilidade espinhal específica para a corrida.”,
exercises:[
mk(“Bear Crawl”,“3×15m”,“60s”,“Core”,“Core stability under locomotion”,“Foundational”,“https://www.youtube.com/results?search_query=bear+crawl+core+stability+running”,[“On hands and knees, raise knees 5cm”,“Move forward alternating opposite hand and foot”,“Keep hips level — don’t rotate or drop pelvis”,“Slow and deliberate”],“Trains contralateral arm-leg coordination mirroring running”),
mk(“Dead Bug with Band”,“3×8 each”,“60s”,“Core”,“Anti-extension stiffness — lumbar stability”,“Foundational”,“https://www.youtube.com/results?search_query=dead+bug+resistance+band+core”,[“Lie on back, arms to ceiling, band around one foot”,“Lower opposite arm and banded leg toward floor”,“Keep lower back pressed firmly into the floor”,“Exhale down, inhale returning”],“Anti-extension training reduces energy leakage at trunk”),
mk(“Hollow Body Hold”,“3×25 sec”,“60s”,“Core”,“Anterior core stiffness — running posture”,“Intermediate”,“https://www.youtube.com/results?search_query=hollow+body+hold+tutorial+core”,[“Lie on back, arms overhead, legs extended”,“Press lower back into floor — squeeze abs”,“Raise shoulders and legs a few centimetres”,“Regress by bending knees if needed”],“Trains anterior core stiffness to maintain running posture”),
mk(“Pallof Press to Rotation”,“3×8 each”,“90s”,“Core”,“Anti-rotation stiffness — most running-specific”,“Intermediate”,“https://www.youtube.com/results?search_query=pallof+press+rotation+core+stability”,[“Stand sideways to band anchor at chest height”,“Press hands straight out — resist the pull”,“From extended position, rotate away from anchor”,“Return to centre before bringing hands back”],“Anti-rotation training directly improves running economy”),
mk(“Single-Leg Plank Hip Extension”,“3×6 each”,“60s”,“Core”,“Posterior core + glute co-activation”,“Intermediate”,“https://www.youtube.com/results?search_query=single+leg+plank+hip+extension+core”,[“Forearm plank — body in straight line”,“Raise one leg with straight knee”,“Hold 2 seconds — squeeze glute, brace core”,“Lower with control — no hip drop”],“Trains posterior chain-core link — running posture under fatigue”),
mk(“Side Plank Hip Dip”,“3×10 each”,“60s”,“Core”,“Lateral core endurance — prevents hip drop”,“Intermediate”,“https://www.youtube.com/results?search_query=side+plank+hip+dip+lateral+core”,[“Side plank on forearm — body in straight line”,“Lower hip toward floor slowly — 2 seconds”,“Drive hip back up to neutral”,“Keep top hip stacked — no rotation”],“Trains lateral core endurance — prevents hip drop”),
mk(“Superman Hold”,“3×10”,“60s”,“Core”,“Posterior chain endurance — running posture”,“Foundational”,“https://www.youtube.com/results?search_query=superman+hold+posterior+chain+running”,[“Lie face down, arms extended overhead”,“Simultaneously raise arms, chest, and legs”,“Hold 3 seconds — squeeze glutes and upper back”,“Lower with control”],“Trains posterior chain endurance in extension”),
]},
];

/* ═══ MONTHLY SESSIONS ═════════════════════════════════════════════════════ */
const SESSIONS = [
{ code:“S1”, nEn:“Elasticity & Strength”, nPt:“Elasticidade & Força”,
tags:[“Elasticidade”,“Força”,“Core”],
dEn:“Foundation session — elastic spring and basic single-leg strength.”,
dPt:“Sessão base — elasticidade e força unilateral.”,
list:[{ph:“A”,nm:“Pogo Hops”},{ph:“A”,nm:“Single-Leg Pogo Hops”},{ph:“B”,nm:“Squat Jump”},{ph:“E”,nm:“Bodyweight Single-Leg RDL”},{ph:“H”,nm:“Single-Leg Glute Bridge Explode”},{ph:“G”,nm:“Wall Sit Explosive Stand”},{ph:“I”,nm:“Tibialis Raise”},{ph:“J”,nm:“Dead Bug with Band”}]},
{ code:“S2”, nEn:“Power & Reflex”, nPt:“Impulsão & Reflexo”,
tags:[“Pliometria”,“Reflexo”,“Impulsão”],
dEn:“Explosive power and neural sharpness — when cadence or kick are weak.”,
dPt:“Potência explosiva e nitidez neural.”,
list:[{ph:“A”,nm:“Double-Leg Hurdle Hops”},{ph:“D”,nm:“High Knees Sprint”},{ph:“D”,nm:“Fast-Foot Drill”},{ph:“B”,nm:“Single-Leg Broad Jumps”},{ph:“C”,nm:“Lateral Skater Jumps”},{ph:“H”,nm:“Hip Thrust Jump”},{ph:“I”,nm:“Rapid Toe Taps”},{ph:“J”,nm:“Bear Crawl”}]},
{ code:“S3”, nEn:“Lateral Control & Weak Points”, nPt:“Controlo Lateral & Pontos Fracos”,
tags:[“Reflexo”,“Força”,“Core”],
dEn:“Correct lateral instability and neglected muscle groups.”,
dPt:“Corrigir instabilidade lateral e grupos negligenciados.”,
list:[{ph:“C”,nm:“Carioca Drill”},{ph:“C”,nm:“Reactive Side Shuffle Burst”},{ph:“F”,nm:“Copenhagen Adductor Press”},{ph:“F”,nm:“Explosive Lateral Lunge”},{ph:“E”,nm:“Nordic Hamstring Curl”},{ph:“I”,nm:“Heel Walk”},{ph:“I”,nm:“Banded Dorsiflexion Pulse”},{ph:“J”,nm:“Pallof Press to Rotation”}]},
{ code:“S4”, nEn:“Full Integration — Race Prep”, nPt:“Integração Total — Preparação para Prova”,
tags:[“Pliometria”,“Força”,“Elasticidade”,“Impulsão”],
dEn:“Peak session mixing all qualities. Use 2–3 weeks before a target race.”,
dPt:“Sessão de pico que mistura todas as qualidades.”,
list:[{ph:“A”,nm:“Depth Drop → Rebound”},{ph:“B”,nm:“Bounding (A-Bounds)”},{ph:“B”,nm:“Bulgarian Split Jump”},{ph:“E”,nm:“Single-Leg RDL Jump”},{ph:“F”,nm:“Lateral Bound to Stick”},{ph:“G”,nm:“Drop Jump to Broad Jump”},{ph:“H”,nm:“Explosive Step-Up with Knee Drive”},{ph:“J”,nm:“Single-Leg Plank Hip Extension”}]},
];

/* ═══ PT EXERCISE NAMES ════════════════════════════════════════════════════ */
const PT = {“Pogo Hops”:“Saltos Pogo”,“Single-Leg Pogo Hops”:“Saltos Pogo (1 Pé)”,“Double-Leg Hurdle Hops”:“Saltos sobre Barreiras”,“Tuck Jump”:“Salto Tuck”,“Depth Drop → Rebound”:“Queda → Ressalto”,“Squat Jump”:“Salto em Agachamento”,“Chair Step-Up Jump”:“Salto de Cadeira”,“Single-Leg Broad Jumps”:“Salto em Comprimento (1 Pé)”,“Alternating Lunge Jump”:“Salto em Afundo Alternado”,“Bounding (A-Bounds)”:“Corrida Saltada”,“Bulgarian Split Jump”:“Salto Búlgaro”,“Carioca Drill”:“Carioca”,“Reactive Side Shuffle Burst”:“Shuffle Lateral”,“Lateral Skater Jumps”:“Saltos Patinador”,“Diagonal Bound”:“Salto Diagonal”,“Rotational Box Jump”:“Salto em Caixa com Rotação”,“A-Skip”:“A-Skip”,“B-Skip”:“B-Skip”,“High Knees Sprint”:“Sprint com Joelhos Altos”,“Fast-Foot Drill”:“Pés Rápidos”,“Wall Drive Drill”:“Impulso na Parede”,“Wicket Drills”:“Exercícios Wicket”,“Resisted Bounding”:“Corrida Saltada Resistida”,“Bodyweight Single-Leg RDL”:“RDL com Peso Corporal”,“Good Morning”:“Good Morning”,“Snap-Down”:“Snap-Down”,“Floor Hamstring Curl”:“Curl de Isquiotibiais”,“Single-Leg RDL Jump”:“Salto RDL (1 Pé)”,“Nordic Hamstring Curl”:“Curl Nórdico”,“Sumo Squat Jump”:“Salto Sumo”,“Explosive Lateral Lunge”:“Afundo Lateral Explosivo”,“Curtsy Lunge”:“Afundo Curtsy”,“Lateral Bound to Stick”:“Salto Lateral Estável”,“Copenhagen Adductor Press”:“Press de Copenhague”,“Lateral Hurdle Hop (Single-Leg)”:“Salto Lateral sobre Barreiras”,“Wall Sit Explosive Stand”:“Parede + Explosão”,“Wall-Supported Sissy Squat”:“Sissy Squat”,“Drop Jump to Broad Jump”:“Queda + Salto”,“Plyometric RFESS”:“RFESS Pliométrico”,“Single-Leg Glute Bridge Explode”:“Ponte Glútea (1 Pé)”,“Glute Bridge March”:“Marcha em Ponte Glútea”,“Donkey Kick Explosive”:“Donkey Kick”,“Explosive Step-Up with Knee Drive”:“Subida Explosiva”,“Hip Thrust Jump”:“Salto de Impulso de Anca”,“Lateral Band Walk to Squat Jump”:“Marcha Lateral → Salto”,“Heel Walk”:“Marcha nos Calcanhares”,“Tibialis Raise”:“Elevação do Tibial”,“Rapid Toe Taps”:“Taps Rápidos”,“Banded Dorsiflexion Pulse”:“Pulso de Dorsiflexão”,“Eccentric Calf Raise”:“Elevação Excêntrica”,“Bear Crawl”:“Bear Crawl”,“Dead Bug with Band”:“Dead Bug”,“Hollow Body Hold”:“Hollow Body”,“Pallof Press to Rotation”:“Press de Pallof”,“Single-Leg Plank Hip Extension”:“Prancha (1 Pé)”,“Side Plank Hip Dip”:“Prancha Lateral”,“Superman Hold”:“Superman”};

/* ═══ HELPERS ══════════════════════════════════════════════════════════════ */
const REST_BY_TYPE = {Elasticidade:75,Pliometria:90,Reflexo:45,Força:90,Impulsão:90,Core:60};
const levelColor = {Foundational:”#22c55e”,Intermediate:”#f59e0b”,Advanced:”#ef4444”};

const TYPE_EX_MAP = {};
Object.keys(TYPES).forEach(t => { TYPE_EX_MAP[t] = []; });
PHASES.forEach(ph => ph.exercises.forEach(ex => {
if (TYPE_EX_MAP[ex.type]) TYPE_EX_MAP[ex.type].push({…ex, phaseId:ph.id, phaseColor:ph.color});
}));

const ALL_SESSIONS = (() => {
const all = [];
SESSIONS.forEach(s => all.push({
id:s.code, nEn:s.nEn, nPt:s.nPt, dEn:s.dEn, dPt:s.dPt,
list:s.list, tags:s.tags,
catColor:”#888”, catEn:“Monthly Block”, catPt:“Bloco Mensal”, defRest:90
}));
Object.entries(TYPES).forEach(([key,info]) => {
(info.sessions||[]).forEach(s => all.push({
id:s.code, nEn:s.nEn, nPt:s.nPt, dEn:s.dEn, dPt:s.dPt,
list:s.list, tags:[key],
catColor:info.color, catEn:info.en, catPt:info.pt, defRest:REST_BY_TYPE[key]||75
}));
});
return all;
})();

const resolveList = list => list.map(item => {
const ph = PHASES.find(p => p.id === item.ph);
const ex = ph && ph.exercises.find(e => e.name === item.nm);
return ex ? {…ex, phaseId:item.ph, phaseColor:ph.color} : null;
}).filter(Boolean);

const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

/* ═══ AUDIO ════════════════════════════════════════════════════════════════ */
let _ac = null;
function getAC() {
try {
if (!_ac || _ac.state === ‘closed’) _ac = new (window.AudioContext || window.webkitAudioContext)();
if (_ac.state === ‘suspended’) _ac.resume();
return _ac;
} catch(e) { return null; }
}
function playBeep(count, freq, dur) {
const ctx = getAC(); if (!ctx) return;
for (let i = 0; i < (count||1); i++) {
const o = ctx.createOscillator(), g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.type = ‘sine’; o.frequency.value = freq||880;
const t = ctx.currentTime + i * 0.28;
g.gain.setValueAtTime(0.35, t);
g.gain.exponentialRampToValueAtTime(0.001, t + (dur||0.12));
o.start(t); o.stop(t + (dur||0.12) + 0.05);
}
}
function playTick() {
const ctx = getAC(); if (!ctx) return;
const o = ctx.createOscillator(), g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.type = ‘square’; o.frequency.value = 220;
const t = ctx.currentTime;
g.gain.setValueAtTime(0.6, t);
g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
o.start(t); o.stop(t + 0.07);
}
function playFinish() {
const ctx = getAC(); if (!ctx) return;
[[1047,0,0.22],[784,0.26,0.22],[523,0.52,0.4]].forEach(([freq,delay,dur]) => {
const o = ctx.createOscillator(), g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.type = ‘sine’; o.frequency.value = freq;
const t = ctx.currentTime + delay;
g.gain.setValueAtTime(0.5, t);
g.gain.exponentialRampToValueAtTime(0.001, t + dur);
o.start(t); o.stop(t + dur + 0.05);
});
}

/* ═══ YtBtn ════════════════════════════════════════════════════════════════ */
const VID = {“Pogo Hops”:“dMnECxl6dsY”,“Single-Leg Pogo Hops”:“YXWNy4YEkNo”,“Double-Leg Hurdle Hops”:“oBnCPHMUOmA”,“Tuck Jump”:“JnI5SUlB38M”,“Depth Drop → Rebound”:“2e4OlJnUSjU”,“Squat Jump”:“CVaEhXotL7M”,“Chair Step-Up Jump”:“dQqApCGd5Ss”,“Single-Leg Broad Jumps”:“8vFLAnF_bEM”,“Alternating Lunge Jump”:“DBasknMn2a8”,“Bounding (A-Bounds)”:“1CmFtICMnJA”,“Bulgarian Split Jump”:“xyQ7bBLSvfU”,“Carioca Drill”:“lzQuvSFuqhY”,“Lateral Skater Jumps”:“BPL7CQDKF8o”,“A-Skip”:“bODhpxOiTjk”,“B-Skip”:“vSZ0B_-3SOA”,“High Knees Sprint”:“ZZZoCNMU48U”,“Fast-Foot Drill”:“p-gSn_BYXLE”,“Bodyweight Single-Leg RDL”:“vopnj5QMFDY”,“Good Morning”:“YA-h3n9L4YQ”,“Snap-Down”:“p7j9CWsEGXQ”,“Nordic Hamstring Curl”:“GlpJ7OhGBYk”,“Copenhagen Adductor Press”:“3iE3kEGkGqM”,“Wall Sit Explosive Stand”:“yXFqFRWRmjE”,“Drop Jump to Broad Jump”:“2e4OlJnUSjU”,“Single-Leg Glute Bridge Explode”:“t9jNFnjblL8”,“Hip Thrust Jump”:“xDmFkJxPzeM”,“Tibialis Raise”:“sCpFBmfHIZY”,“Eccentric Calf Raise”:“g8d8jMwzEGA”,“Bear Crawl”:“5rPBCfGJdpI”,“Dead Bug with Band”:“4XLEnwUr1d8”,“Hollow Body Hold”:“LlDNef_Ztsc”,“Pallof Press to Rotation”:“AH_QZLm_0-s”,“Single-Leg Plank Hip Extension”:“K9bK0BwKFjs”,“Side Plank Hip Dip”:“KkgTWJnWE3A”,“Superman Hold”:“vYTpJCgMHy4”};

function YtBtn({ name, pc, lang }) {
const id = VID[name] || null;
const direct = id ? `https://www.youtube.com/watch?v=${id}` : null;
const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " exercise tutorial running")}`;
const [avail, setAvail] = useState(id ? “checking” : “none”);
useEffect(() => {
if (!id) { setAvail(“none”); return; }
const img = new Image();
img.onload = () => setAvail(img.naturalWidth > 120 ? “ok” : “gone”);
img.onerror = () => setAvail(“gone”);
img.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}, [id]);
const base = { display:“inline-flex”, alignItems:“center”, gap:8, padding:“9px 14px”, borderRadius:7, fontFamily:”‘DM Mono’,monospace”, fontSize:10, letterSpacing:”.13em”, textDecoration:“none”, cursor:“pointer” };
const ok = avail === “ok” && direct;
return (
<div style={{display:“flex”,flexDirection:“column”,gap:8}}>
{avail === “checking” && <span style={{…base, border:`1px solid ${pc}33`, color:pc, opacity:.5}}><span>⟳</span>{lang===“pt”?“A verificar…”:“Checking…”}</span>}
{ok && <a href={direct} target=”_blank” rel=“noopener noreferrer” style={{…base, border:`1px solid ${pc}55`, background:`${pc}10`, color:pc}}><span style={{fontSize:16}}>▶</span>{lang===“pt”?“VER VÍDEO”:“WATCH VIDEO”}</a>}
<a href={search} target=”_blank” rel=“noopener noreferrer” style={{…base, border:`1px solid ${ok?pc+"22":pc+"55"}`, background:ok?“transparent”:`${pc}10`, color:ok?”#888”:pc, opacity:ok?.7:1}}>
<span style={{fontSize:13}}>🔍</span>{ok?(lang===“pt”?“Alternativa”:“Search alt”):(lang===“pt”?“PESQUISAR NO YOUTUBE”:“SEARCH ON YOUTUBE”)}
</a>
</div>
);
}

/* ═══ APP ══════════════════════════════════════════════════════════════════ */
export default function App() {
const [page,       setPage]      = useState(“home”);
const [dark,       setDark]      = useState(true);
const [lang,       setLang]      = useState(“en”);
const [openSes,    setOpenSes]   = useState(null);
const [openType,   setOpenType]  = useState(null);
const [typeSub,    setTypeSub]   = useState({});
const [openTEx,    setOpenTEx]   = useState(null);
const [tExTab,     setTExTab]    = useState({});
const [openTSes,   setOpenTSes]  = useState(null);
const [activePhase,setPhase]     = useState(“A”);
const [openEx,     setOpenEx]    = useState(null);
const [exTab,      setExTab]     = useState({});
const [sesView,    setSesView]   = useState(“browse”);
const [catFilt,    setCatFilt]   = useState(“ALL”);
const [cfgSes,     setCfgSes]    = useState(null);
const [runMode,    setRunMode]   = useState(“reps”);
const [repsN,      setRepsN]     = useState(10);
const [exDur,      setExDur]     = useState(40);
const [restDur,    setRestDur]   = useState(60);
const [blocks,     setBlocks]    = useState(1);
const [muted,      setMuted]     = useState(false);
const [runExs,     setRunExs]    = useState([]);
const [runIdx,     setRunIdx]    = useState(0);
const [runBlk,     setRunBlk]    = useState(1);
const [runPhase,   setRunPhase]  = useState(“idle”);
const [runTime,    setRunTime]   = useState(0);
const [runActive,  setRunActive] = useState(false);

const ivRef   = useRef(null);
const muteRef = useRef(false);
const rsRef   = useRef({});

useEffect(() => { muteRef.current = muted; }, [muted]);
useEffect(() => () => { if (ivRef.current) clearInterval(ivRef.current); }, []);

const snd = (fn, …a) => { if (!muteRef.current) fn(…a); };

const stopTimer = useCallback(() => {
if (ivRef.current !== null) { clearInterval(ivRef.current); ivRef.current = null; }
}, []);

const advance = useCallback(() => {
const rs = rsRef.current;
if (!rs || !rs.phase) return;
if (rs.phase === “exercise”) {
const ns = {…rs, phase:“rest”, time:rs.restDur};
rsRef.current = ns;
setRunPhase(“rest”); setRunTime(rs.restDur);
snd(playBeep, 2, 880);
} else if (rs.phase === “rest”) {
const lastEx = rs.exIdx >= rs.exs.length - 1;
if (lastEx) {
if (rs.blk >= rs.totalBlks) {
stopTimer();
rsRef.current = {…rs, phase:“done”, active:false};
setRunPhase(“done”); setRunActive(false);
snd(playFinish);
} else {
const nb = rs.blk + 1;
const t = rs.mode === “reps” ? rs.repsN : rs.exDur;
const ns = {…rs, phase:“exercise”, exIdx:0, blk:nb, time:t};
rsRef.current = ns;
setRunPhase(“exercise”); setRunIdx(0); setRunBlk(nb); setRunTime(t);
snd(playBeep, 3, 1047);
}
} else {
const ni = rs.exIdx + 1;
const t  = rs.mode === “reps” ? rs.repsN : rs.exDur;
const ns = {…rs, phase:“exercise”, exIdx:ni, time:t};
rsRef.current = ns;
setRunPhase(“exercise”); setRunIdx(ni); setRunTime(t);
snd(playBeep, 1, 660);
}
}
}, [stopTimer]);

const startTimer = useCallback(() => {
stopTimer();
ivRef.current = setInterval(() => {
const rs = rsRef.current;
if (!rs || !rs.active) return;
if (rs.mode === “reps” && rs.phase === “exercise”) return;
const nt = rs.time - 1;
if (nt <= 0) { snd(playFinish); advance(); }
else { rsRef.current = {…rs, time:nt}; setRunTime(nt); if (nt <= 5) snd(playTick); }
}, 1000);
}, [stopTimer, advance]);

const beginSession = useCallback(() => {
if (!cfgSes) return;
const exs = resolveList(cfgSes.list);
if (!exs.length) return;
const t = runMode === “reps” ? repsN : exDur;
const rs = {active:true, mode:runMode, repsN, exDur, restDur, totalBlks:blocks, blk:1, exIdx:0, phase:“exercise”, time:t, exs};
rsRef.current = rs;
setRunExs(exs); setRunIdx(0); setRunBlk(1);
setRunPhase(“exercise”); setRunTime(t); setRunActive(true);
setSesView(“run”); snd(playBeep, 1, 660); startTimer();
}, [cfgSes, runMode, repsN, exDur, restDur, blocks, startTimer]);

const repsDone = useCallback(() => {
const rs = rsRef.current;
if (!rs || rs.phase !== “exercise”) return;
snd(playBeep, 1, 1100);
const lastEx  = rs.exIdx >= rs.exs.length - 1;
const lastBlk = rs.blk >= rs.totalBlks;
if (lastEx && lastBlk) {
stopTimer();
rsRef.current = {…rs, phase:“done”, active:false};
setRunPhase(“done”); setRunActive(false); snd(playFinish);
} else {
const nb = lastEx ? rs.blk + 1 : rs.blk;
const ni = lastEx ? -1 : rs.exIdx;  // -1 so advance() goes to 0
const ns = {…rs, phase:“rest”, time:rs.restDur, blk:nb, exIdx:ni, active:true};
rsRef.current = ns;
setRunPhase(“rest”); setRunTime(rs.restDur);
if (lastEx) setRunBlk(nb);
startTimer();
}
}, [stopTimer, startTimer]);

const togglePause = useCallback(() => {
const rs = rsRef.current;
if (!rs) return;
const na = !rs.active;
rsRef.current = {…rs, active:na};
setRunActive(na);
if (na) startTimer(); else stopTimer();
}, [startTimer, stopTimer]);

const skipRest = useCallback(() => {
if (rsRef.current && rsRef.current.phase === “rest”) advance();
}, [advance]);

const exitRunner = useCallback(() => {
stopTimer();
rsRef.current = {};
setRunPhase(“idle”); setRunActive(false); setRunExs([]); setRunIdx(0); setRunBlk(1);
setSesView(“browse”);
}, [stopTimer]);

const restartSession = useCallback(() => { stopTimer(); setTimeout(beginSession, 50); }, [stopTimer, beginSession]);

/* theme */
const c = dark ? {
bg:”#060608”,sur:”#0f0f12”,surO:”#131317”,brd:”#1f1f26”,brdO:”#2e2e3a”,
hdr:”#17171e”,div:”#17171e”,txt:”#eeeef2”,body:”#9898a8”,sec:”#606070”,
muted:”#48485a”,lbl:”#36364a”,faint:”#1a1a22”,navA:”#d0d0e0”,navI:”#3a3a50”,
sT:”#0c0c0f”,sH:”#2a2a38”,study:”#090910”,navH:”#ffffff”,tBg:”#1a1a22”,tBdr:”#2a2a38”,
shadow:“0 1px 3px rgba(0,0,0,.6), 0 4px 12px rgba(0,0,0,.4)”,
shadowSm:“0 1px 2px rgba(0,0,0,.5)”
} : {
bg:”#f6f5f0”,sur:”#ffffff”,surO:”#fdfcf8”,brd:”#e2e0d8”,brdO:”#c8c5ba”,
hdr:”#e8e6df”,div:”#e8e6df”,txt:”#18181c”,body:”#44444e”,sec:”#72727e”,
muted:”#96969e”,lbl:”#b0b0b8”,faint:”#d4d2ca”,navA:”#18181c”,navI:”#a0a0aa”,
sT:”#eeede8”,sH:”#c4c2ba”,study:”#f0efe9”,navH:”#000000”,tBg:”#eeeee8”,tBdr:”#d8d6ce”,
shadow:“0 1px 3px rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.07)”,
shadowSm:“0 1px 2px rgba(0,0,0,.05)”
};

const enm  = n  => lang === “pt” ? (PT[n] || n) : n;
const tl   = k  => lang === “pt” ? TYPES[k]?.pt : TYPES[k]?.en;
const tc   = k  => TYPES[k]?.color || “#888”;
const lvlL = l  => lang === “pt” ? {Foundational:“FUNDAMENTAL”,Intermediate:“INTERMÉDIO”,Advanced:“AVANÇADO”}[l] : l.toUpperCase();
const phase = PHASES.find(p => p.id === activePhase);
const navTo = (phId, idx) => { setPhase(phId); setOpenEx(idx); setExTab({}); setPage(“exercises”); };
const openCfg = ses => { setCfgSes(ses); setRestDur(ses.defRest||75); setSesView(“config”); setPage(“session”); };

const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap'); *{box-sizing:border-box;margin:0;padding:0} body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale} ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${c.sT}}::-webkit-scrollbar-thumb{background:${c.sH};border-radius:4px} .nb{cursor:pointer;background:transparent;border:none;font-family:'DM Mono',monospace;transition:color .15s,opacity .15s;letter-spacing:.01em} .nb:hover{color:${c.navH};opacity:.9} .ec{border:1px solid ${c.brd};border-radius:12px;cursor:pointer;background:${c.sur};transition:border-color .2s,background .2s,box-shadow .2s;box-shadow:${c.shadowSm}} .ec:hover{border-color:${c.brdO};box-shadow:${c.shadow}} .ec.op{border-color:var(--pc);background:${c.surO};box-shadow:0 0 0 1px var(--pc)40} .tb{cursor:pointer;border:1px solid ${c.brd};transition:all .15s;background:transparent;font-family:'DM Mono',monospace;border-radius:6px} .tb:hover{border-color:${c.brdO};background:${dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)"}} .tb.on{background:color-mix(in srgb,var(--pc) 14%,transparent);border-color:var(--pc);color:var(--pc)} .sr{border-left:2px solid ${c.brd};padding-left:10px;transition:border-color .2s}.sr:hover{border-left-color:${c.brdO}} .xi{border-radius:8px;cursor:pointer;transition:background .15s} .xi:hover{background:${dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"} !important} .row{border-radius:12px;border:1px solid ${c.brd};background:${c.sur};overflow:hidden;box-shadow:${c.shadowSm};transition:border-color .2s,box-shadow .2s} .row:hover{box-shadow:${c.shadow};border-color:${c.brdO}} .fi{animation:fi .2s ease}@keyframes fi{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}} .stab{cursor:pointer;background:transparent;border:none;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.16em;padding:7px 13px;border-radius:20px;transition:all .15s;border:1px solid transparent} .stab:hover{background:${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.05)"}} .stab.on{background:color-mix(in srgb,var(--tc) 14%,transparent);color:var(--tc);border-color:color-mix(in srgb,var(--tc) 40%,transparent)} input[type=range]{width:100%;accent-color:var(--ac,#888);cursor:pointer} a{color:inherit;text-decoration:none}a:hover{opacity:.75} button:focus-visible{outline:2px solid var(--pc,#888);outline-offset:2px}`;

/* ── shared small components ── */
const Header = () => (
<div style={{borderBottom:`1px solid ${c.hdr}`,padding:“22px 24px 16px”,background:c.bg,backdropFilter:“blur(12px)”}}>
<div style={{maxWidth:880,margin:“0 auto”,display:“flex”,justifyContent:“space-between”,alignItems:“flex-end”,flexWrap:“wrap”,gap:12}}>
<div>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,letterSpacing:”.25em”,color:c.muted,marginBottom:6,textTransform:“uppercase”}}>
{lang===“pt”?“Corrida · Trail · Baseado em Evidências”:“Road · Trail · Evidence-Based”}
</div>
<h1 style={{fontFamily:”‘Bebas Neue’”,fontSize:“clamp(24px,5vw,44px)”,letterSpacing:”.05em”,lineHeight:1,color:c.txt,display:“flex”,alignItems:“center”,gap:10}}>
{lang===“pt”?“Protocolo de Potência Explosiva”:“Explosive Power Protocol”}
</h1>
</div>
<nav style={{display:“flex”,alignItems:“center”,gap:1,background:dark?“rgba(255,255,255,.04)”:“rgba(0,0,0,.04)”,borderRadius:10,padding:3,border:`1px solid ${c.brd}`}}>
{[[“HOME”,“INÍCIO”,“home”],[“SESSION”,“SESSÃO”,“session”],[“TYPES”,“TIPOS”,“types”],[“EXERCISES”,“EXERCÍCIOS”,“exercises”]].map(([e,p,v]) => (
<button key={v} className=“nb”
onClick={() => { if (sesView===“run”) exitRunner(); setPage(v); }}
style={{fontSize:9,letterSpacing:”.14em”,padding:“6px 10px”,borderRadius:7,
color:page===v?c.txt:c.navI,
background:page===v?(dark?“rgba(255,255,255,.1)”:“rgba(0,0,0,.08)”):“transparent”,
fontWeight:page===v?“500”:“400”,transition:“all .15s”}}>
{lang===“pt”?p:e}
</button>
))}
</nav>
</div>
</div>
);

const BottomBar = () => (
<div style={{position:“fixed”,bottom:0,left:0,right:0,borderTop:`1px solid ${c.hdr}`,background:dark?“rgba(6,6,8,.92)”:“rgba(246,245,240,.92)”,backdropFilter:“blur(12px)”,padding:“10px 24px”,display:“flex”,justifyContent:“space-between”,alignItems:“center”,zIndex:100}}>
<div style={{display:“flex”,gap:2,background:dark?“rgba(255,255,255,.04)”:“rgba(0,0,0,.04)”,borderRadius:8,padding:3,border:`1px solid ${c.brd}`}}>
{[[“EN”,“en”],[“PT”,“pt”]].map(([l,v]) => (
<button key={v} className=“nb” onClick={() => setLang(v)}
style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,letterSpacing:”.16em”,padding:“5px 10px”,borderRadius:5,
color:lang===v?c.txt:c.navI,background:lang===v?(dark?“rgba(255,255,255,.1)”:“rgba(0,0,0,.08)”):“transparent”,
fontWeight:lang===v?“500”:“400”,transition:“all .15s”}}>{l}
</button>
))}
</div>
<button onClick={() => setDark(d => !d)}
style={{cursor:“pointer”,background:dark?“rgba(255,255,255,.06)”:“rgba(0,0,0,.06)”,
border:`1px solid ${c.brd}`,borderRadius:8,padding:“6px 12px”,fontSize:14,lineHeight:1,
transition:“all .15s”,display:“flex”,alignItems:“center”,gap:6}}>
<span>{dark?“☀️”:“🌙”}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,letterSpacing:”.14em”,color:c.muted}}>{dark?(lang===“pt”?“CLARO”:“LIGHT”):(lang===“pt”?“ESCURO”:“DARK”)}</span>
</button>
</div>
);

const ExBody = ({ex, uid, tabSt, setTabSt, pc}) => {
const cur = tabSt[uid];
const tabs = lang===“pt” ? [[“DICAS”,“cues”],[“VÍDEO”,“video”],[“ARTIGOS”,“science”]] : [[“CUES”,“cues”],[“VIDEO”,“video”],[“SCIENCE”,“science”]];
return (
<div style={{padding:“0 14px 14px”}}>
<div style={{borderTop:`1px solid ${c.hdr}`,paddingTop:10}}>
<div style={{marginBottom:8}}>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,letterSpacing:”.16em”,color:c.lbl}}>{lang===“pt”?“FOCO”:“FOCUS”} · </span>
<span style={{fontSize:13,fontWeight:400,color:pc}}>{ex.focus}</span>
</div>
<div style={{display:“flex”,gap:5,marginBottom:10,flexWrap:“wrap”}}>
{tabs.map(([lbl,tab]) => (
<button key={tab} className={`tb${cur===tab?" on":""}`} style={{”–pc”:pc,padding:“5px 9px”,borderRadius:4,fontSize:9,letterSpacing:”.14em”,color:cur===tab?pc:c.sec}}
onClick={e => { e.stopPropagation(); setTabSt(p => ({…p,[uid]:p[uid]===tab?null:tab})); }}>{lbl}
</button>
))}
</div>
{!cur && <div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:11,color:c.lbl,fontStyle:“italic”}}>→ {lang===“pt”?“Selecione um separador.”:“Select a tab above.”}</div>}
{cur===“cues” && (
<div className=“fi” style={{display:“flex”,flexDirection:“column”,gap:6}}>
{ex.cues.map((cue,j) => (
<div key={j} style={{display:“flex”,gap:9,alignItems:“flex-start”}}>
<div style={{width:4,height:4,borderRadius:“50%”,background:pc,marginTop:5,flexShrink:0}}/>
<span style={{fontSize:13,fontWeight:300,color:c.body,lineHeight:1.6}}>{cue}</span>
</div>
))}
</div>
)}
{cur===“video” && <div className="fi"><YtBtn name={ex.name} pc={pc} lang={lang}/></div>}
{cur===“science” && (
<div className="fi">
<div style={{fontSize:13,fontWeight:500,color:pc,lineHeight:1.5}}>{ex.science.headline}</div>
</div>
)}
</div>
</div>
);
};

const SesExList = ({list}) => (
<div style={{display:“flex”,flexDirection:“column”,gap:2}}>
{list.map((item,j) => {
const ph = PHASES.find(p => p.id === item.ph);
const ex = ph && ph.exercises.find(e => e.name === item.nm);
if (!ex) return null;
return (
<div key={j} className=“xi” onClick={() => navTo(item.ph, ph.exercises.indexOf(ex))} style={{display:“flex”,alignItems:“center”,gap:10,padding:“7px 10px”}}>
<div style={{width:5,height:5,borderRadius:“50%”,background:ph.color,flexShrink:0}}/>
<span style={{fontSize:13,fontWeight:400,color:c.body,flex:1}}>{enm(item.nm)}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,padding:“2px 6px”,borderRadius:8,background:`${tc(ex.type)}15`,color:tc(ex.type),border:`1px solid ${tc(ex.type)}35`}}>{tl(ex.type)}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,color:c.lbl}}>→</span>
</div>
);
})}
</div>
);

const RunBtn = ({ses, small}) => {
const col = ses.catColor || “#888”;
return (
<button onClick={e => { e.stopPropagation(); openCfg(ses); }}
style={{cursor:“pointer”,
background:`color-mix(in srgb,${col} 16%,${dark?"#0f0f14":"#ffffff"})`,
border:`1px solid color-mix(in srgb,${col} 45%,transparent)`,
borderRadius:small?8:8,padding:small?“5px 10px”:“7px 14px”,
fontFamily:”‘DM Mono’,monospace”,fontSize:small?8:9,letterSpacing:”.12em”,
color:col,display:“inline-flex”,alignItems:“center”,gap:5,flexShrink:0,
transition:“all .15s”,boxShadow:`0 2px 8px color-mix(in srgb,${col} 20%,transparent)`}}>
<span style={{fontSize:small?9:11}}>▶</span>
{small?(lang===“pt”?“EXECUTAR”:“RUN”):(lang===“pt”?“▶ INICIAR”:“▶ START”)}
</button>
);
};

const Circle = ({val, total, col, size}) => {
const sz = size || 150;
const r = (sz-14)/2, circ = 2*Math.PI*r, pct = total>0?Math.max(0,val/total):0;
return (
<svg width={sz} height={sz} style={{transform:“rotate(-90deg)”}}>
<circle cx={sz/2} cy={sz/2} r={r} fill=“none” stroke={dark?”#1a1a1a”:”#e8e8e8”} strokeWidth={10}/>
<circle cx={sz/2} cy={sz/2} r={r} fill=“none” stroke={col} strokeWidth={10}
strokeDasharray={`${circ*pct} ${circ}`} strokeLinecap=“round”
style={{transition:“stroke-dasharray 0.9s linear”}}/>
</svg>
);
};

/* ═══════════════════════════════════════════════════
HOME
═══════════════════════════════════════════════════ */
if (page === “home”) return (
<div style={{fontFamily:”‘Inter’,sans-serif”,background:c.bg,minHeight:“100vh”,color:c.txt}}>
<style>{css}</style><Header/>
<div style={{maxWidth:880,margin:“0 auto”,padding:“22px 20px 86px”}}>
<div style={{marginBottom:22,paddingBottom:16,borderBottom:`1px solid ${c.div}`}}>
<p style={{fontSize:14,fontWeight:300,color:c.body,lineHeight:1.8,maxWidth:580}}>
{lang===“pt”?“Quatro sessões mensais para corredores de fundo e trail. Usa Tipos para treinar os teus pontos fracos. Prima ▶ para executar qualquer sessão.”:“Four monthly sessions for road and trail runners. Use Types to target your weak points. Press ▶ to run any session.”}
</p>
</div>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,letterSpacing:”.2em”,color:c.muted,marginBottom:10}}>{lang===“pt”?“BLOCO MENSAL — 4 SESSÕES”:“4-SESSION MONTHLY BLOCK”}</div>
<div style={{display:“flex”,flexDirection:“column”,gap:8}}>
{SESSIONS.map((ses, si) => {
const allSes = ALL_SESSIONS.find(s => s.id === ses.code);
const isOpen = openSes === si;
return (
<div key={si} className=“row” style={{borderColor:isOpen?TYPES[ses.tags[0]]?.color+“55”:c.brd,background:isOpen?c.surO:c.sur}}>
<div style={{display:“flex”,alignItems:“center”,gap:12,padding:“12px 16px”,cursor:“pointer”}} onClick={() => setOpenSes(isOpen ? null : si)}>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,color:c.muted,minWidth:22}}>{ses.code}</div>
<div style={{flex:1}}>
<div style={{display:“flex”,gap:5,flexWrap:“wrap”,marginBottom:4}}>
{ses.tags.map((t,ti) => <span key={ti} style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,letterSpacing:”.12em”,padding:“2px 7px”,borderRadius:9,background:`${tc(t)}18`,color:tc(t),border:`1px solid ${tc(t)}40`}}>{tl(t)}</span>)}
</div>
<div style={{fontSize:14,fontWeight:500,color:isOpen?c.txt:c.body}}>{lang===“pt”?ses.nPt:ses.nEn}</div>
<div style={{fontSize:11,fontWeight:300,color:c.muted,marginTop:2,lineHeight:1.4}}>{lang===“pt”?ses.dPt:ses.dEn}</div>
</div>
<div style={{display:“flex”,alignItems:“center”,gap:8}}>
{allSes && <RunBtn ses={allSes} small/>}
<div style={{color:c.lbl,fontSize:18,fontWeight:300,transform:isOpen?“rotate(45deg)”:“none”,transition:“transform .2s”}}>+</div>
</div>
</div>
{isOpen && <div className=“fi” style={{borderTop:`1px solid ${c.div}`,padding:“5px 16px 10px”}}><SesExList list={ses.list}/></div>}
</div>
);
})}
</div>
<div style={{marginTop:16,fontFamily:”‘DM Mono’,monospace”,fontSize:8,color:c.faint,letterSpacing:”.1em”,textAlign:“center”}}>{lang===“pt”?“PROTOCOLO PLIOMÉTRICO BASEADO EM EVIDÊNCIAS”:“EVIDENCE-BASED PLYOMETRIC PROTOCOL”}</div>
</div>
<BottomBar/>
</div>
);

/* ═══════════════════════════════════════════════════
SESSION
═══════════════════════════════════════════════════ */
if (page === “session”) {
const rs = rsRef.current;

```
/* RUN */
if (sesView === "run" && runExs.length > 0) {
  const curEx   = runExs[runIdx] || runExs[0];
  const isDone  = runPhase === "done";
  const isRest  = runPhase === "rest";
  const phCol   = isDone ? "#22c55e" : isRest ? "#F97316" : "#C084FC";
  const phLbl   = isDone ? (lang==="pt"?"COMPLETO":"COMPLETE") : isRest ? (lang==="pt"?"DESCANSO":"REST") : (lang==="pt"?"EXERCÍCIO":"EXERCISE");
  const totalBlks = rs.totalBlks || blocks;
  const prog = Math.min(100, ((runBlk-1)*runExs.length + runIdx + (isRest?1:0)) / (totalBlks*runExs.length) * 100);

  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:c.bg,minHeight:"100vh",color:c.txt}}>
      <style>{css}</style>
      {/* runner header */}
      <div style={{borderBottom:`1px solid ${c.hdr}`,padding:"12px 20px",background:dark?"rgba(6,6,8,.95)":"rgba(246,245,240,.95)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",gap:12}}>
        <button className="nb" onClick={exitRunner}
          style={{color:c.muted,fontSize:10,letterSpacing:".1em",display:"flex",alignItems:"center",gap:5,flexShrink:0,whiteSpace:"nowrap",
            padding:"6px 10px",borderRadius:8,border:`1px solid ${c.brd}`,background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)",transition:"all .15s"}}>
          ← {lang==="pt"?"SAIR":"EXIT"}
        </button>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,flex:1,textAlign:"center",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",letterSpacing:".08em"}}>
          {cfgSes ? (lang==="pt"?cfgSes.nPt:cfgSes.nEn) : ""}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          {totalBlks > 1 && (
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#C084FC",background:"rgba(192,132,252,.12)",padding:"3px 8px",borderRadius:6,border:"1px solid rgba(192,132,252,.3)"}}>
              B{runBlk}/{totalBlks}
            </span>
          )}
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)",padding:"3px 8px",borderRadius:6}}>
            {isDone?`${runExs.length}/${runExs.length}`:`${runIdx+1}/${runExs.length}`}
          </span>
          <button onClick={() => setMuted(m => !m)}
            style={{cursor:"pointer",background:muted?"rgba(239,68,68,.12)":dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)",
              border:`1px solid ${muted?"rgba(239,68,68,.4)":c.brd}`,borderRadius:7,padding:"5px 9px",fontSize:12,
              color:muted?"#ef4444":c.muted,transition:"all .15s",lineHeight:1}}>
            {muted?"🔇":"🔊"}
          </button>
        </div>
      </div>
      {!isDone && <div style={{height:3,background:c.brd}}><div style={{height:"100%",background:phCol,width:`${prog}%`,transition:"width 0.5s ease"}}/></div>}

      <div style={{maxWidth:520,margin:"0 auto",padding:"24px 20px 86px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        {isDone ? (
          <div className="fi" style={{textAlign:"center",paddingTop:24}}>
            <div style={{fontSize:56,marginBottom:14}}>🎉</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#22c55e",letterSpacing:".06em",marginBottom:8}}>
              {lang==="pt"?"SESSÃO COMPLETA!":"SESSION COMPLETE!"}
            </div>
            <div style={{fontSize:13,fontWeight:300,color:c.sec,marginBottom:28}}>
              {runExs.length} {lang==="pt"?"exercícios":"exercises"} · {totalBlks} {lang==="pt"?"bloco(s)":"block(s)"}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={restartSession} style={{cursor:"pointer",background:"transparent",border:"1px solid #22c55e",borderRadius:6,padding:"9px 18px",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:".14em",color:"#22c55e"}}>↺ {lang==="pt"?"REPETIR":"RESTART"}</button>
              <button onClick={() => setSesView("browse")} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"9px 18px",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:".14em",color:c.muted}}>← {lang==="pt"?"SESSÕES":"SESSIONS"}</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".22em",color:phCol,padding:"4px 12px",borderRadius:20,border:`1px solid ${phCol}55`,background:`${phCol}12`,marginBottom:18}}>{phLbl}</div>

            {isRest ? (
              <div style={{textAlign:"center",width:"100%"}}>
                {runIdx < runExs.length-1 && (
                  <div style={{marginBottom:10}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".16em",color:c.lbl,marginBottom:3}}>{lang==="pt"?"A SEGUIR":"NEXT UP"}</div>
                    <div style={{fontSize:14,fontWeight:500,color:c.body}}>{enm(runExs[runIdx+1]?.name||"")}</div>
                  </div>
                )}
                <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                  <Circle val={runTime} total={rs.restDur||restDur} col="#F97316"/>
                  <div style={{position:"absolute",textAlign:"center"}}>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#F97316",lineHeight:1}}>{fmt(runTime)}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.muted,letterSpacing:".12em"}}>{lang==="pt"?"DESCANSO":"REST"}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                  <button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"9px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>
                    {runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ CONTINUAR":"▶ RESUME")}
                  </button>
                  <button onClick={skipRest} style={{cursor:"pointer",background:"transparent",border:"1px solid #F97316",borderRadius:6,padding:"9px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:"#F97316"}}>
                    {lang==="pt"?"SALTAR →":"SKIP REST →"}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{textAlign:"center",width:"100%"}}>
                <div style={{fontSize:"clamp(18px,4vw,24px)",fontWeight:500,color:c.txt,marginBottom:4,lineHeight:1.2}}>{enm(curEx.name)}</div>
                <div style={{fontSize:12,fontWeight:300,color:curEx.phaseColor||"#888",marginBottom:18}}>{curEx.focus}</div>

                {runMode === "time" ? (
                  <>
                    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                      <Circle val={runTime} total={rs.exDur||exDur} col="#C084FC"/>
                      <div style={{position:"absolute",textAlign:"center"}}>
                        <div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#C084FC",lineHeight:1}}>{fmt(runTime)}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.muted,letterSpacing:".12em"}}>{lang==="pt"?"TEMPO":"TIME"}</div>
                      </div>
                    </div>
                    <button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"9px 18px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>
                      {runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ CONTINUAR":"▶ RESUME")}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{marginBottom:16}}>
                      <div style={{fontFamily:"'Bebas Neue'",fontSize:64,color:"#C084FC",lineHeight:1}}>×{rs.repsN||repsN}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted,letterSpacing:".14em"}}>{lang==="pt"?"REPETIÇÕES":"REPETITIONS"}</div>
                    </div>
                    <button onClick={repsDone} style={{cursor:"pointer",background:"color-mix(in srgb,#22c55e 15%,transparent)",border:"2px solid #22c55e",borderRadius:10,padding:"12px 28px",fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:".18em",color:"#22c55e",marginBottom:8}}>
                      ✓ {lang==="pt"?"FEITO":"DONE"}
                    </button>
                    <div>
                      <button onClick={togglePause} style={{cursor:"pointer",background:"transparent",border:`1px solid ${c.brd}`,borderRadius:6,padding:"7px 14px",fontFamily:"'DM Mono',monospace",fontSize:9,color:c.muted}}>
                        {runActive?(lang==="pt"?"⏸ PAUSA":"⏸ PAUSE"):(lang==="pt"?"▶ RETOMAR":"▶ RESUME")}
                      </button>
                    </div>
                  </>
                )}

                <div style={{marginTop:16,width:"100%",textAlign:"left"}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.lbl,marginBottom:7}}>{lang==="pt"?"DEMONSTRAÇÃO":"DEMO"}</div>
                  <YtBtn name={curEx.name} pc={curEx.phaseColor||"#888"} lang={lang}/>
                </div>
                <div style={{marginTop:14,width:"100%",textAlign:"left"}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.lbl,marginBottom:6}}>{lang==="pt"?"NOTAS TÉCNICAS":"COACHING CUES"}</div>
                  {(curEx.cues||[]).slice(0,2).map((cue,j) => (
                    <div key={j} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:4}}>
                      <div style={{width:3,height:3,borderRadius:"50%",background:curEx.phaseColor||"#888",marginTop:5,flexShrink:0}}/>
                      <span style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.5}}>{cue}</span>
                    </div>
                  ))}
                </div>
                {runIdx < runExs.length-1 && (
                  <div style={{marginTop:16,width:"100%",borderTop:`1px solid ${c.brd}`,paddingTop:10}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".14em",color:c.lbl,marginBottom:5}}>{lang==="pt"?"PRÓXIMOS":"UPCOMING"}</div>
                    {runExs.slice(runIdx+1, runIdx+3).map((nx,j) => (
                      <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0"}}>
                        <div style={{width:4,height:4,borderRadius:"50%",background:nx.phaseColor||"#888",opacity:.5,flexShrink:0}}/>
                        <span style={{fontSize:12,fontWeight:300,color:c.muted}}>{enm(nx.name)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <BottomBar/>
    </div>
  );
}

/* CONFIG */
if (sesView === "config" && cfgSes) {
  const col = cfgSes.catColor || "#888";
  const exs = resolveList(cfgSes.list);
  const sliders = [
    ["blocks", lang==="pt"?"BLOCOS (RONDAS)":"BLOCKS (ROUNDS)", 1, 5, 1, blocks, setBlocks, `${blocks}×`],
    ...(runMode==="reps"
      ? [["reps", lang==="pt"?"REPETIÇÕES POR EXERCÍCIO":"REPS PER EXERCISE", 1, 20, 1, repsN, setRepsN, `×${repsN}`]]
      : [["exd",  lang==="pt"?"TEMPO POR EXERCÍCIO":"TIME PER EXERCISE", 10, 120, 5, exDur, setExDur, `${exDur}s`]]),
    ["rest", lang==="pt"?"DESCANSO":"REST", 15, 180, 5, restDur, setRestDur, `${restDur}s`],
  ];
  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:c.bg,minHeight:"100vh",color:c.txt}}>
      <style>{css}</style><Header/>
      <div style={{maxWidth:520,margin:"0 auto",padding:"20px 20px 86px"}}>
        <button className="nb" onClick={() => setSesView("browse")} style={{color:c.muted,fontSize:11,letterSpacing:".1em",marginBottom:16,display:"flex",alignItems:"center",gap:5}}>← {lang==="pt"?"SESSÕES":"SESSIONS"}</button>
        <div style={{marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${c.div}`}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".16em",color:col,marginBottom:3}}>{lang==="pt"?cfgSes.catPt:cfgSes.catEn}</div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:c.txt,letterSpacing:".05em",marginBottom:3}}>{lang==="pt"?cfgSes.nPt:cfgSes.nEn}</div>
          <div style={{fontSize:12,fontWeight:300,color:c.sec}}>{lang==="pt"?cfgSes.dPt:cfgSes.dEn}</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".16em",color:c.muted,marginBottom:6}}>{lang==="pt"?"MODO DE EXECUÇÃO":"EXECUTION MODE"}</div>
          <div style={{display:"flex",border:`1px solid ${c.brd}`,borderRadius:8,overflow:"hidden"}}>
            {[["reps",lang==="pt"?"REPETIÇÕES":"REPS"],["time","HIIT / TEMPO"]].map(([v,lbl]) => (
              <button key={v} onClick={() => setRunMode(v)} style={{flex:1,cursor:"pointer",padding:"9px 8px",border:"none",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",background:runMode===v?`color-mix(in srgb,${col} 15%,${c.bg})`:c.sur,color:runMode===v?col:c.lbl,transition:"all .15s",borderRight:v==="reps"?`1px solid ${c.brd}`:"none"}}>{lbl}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
          {sliders.map(([id,label,min,max,step,val,setter,disp]) => (
            <div key={id} style={{"--ac":col}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.muted}}>{label}</div>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:col,letterSpacing:".04em"}}>{disp}</div>
              </div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e => setter(+e.target.value)}/>
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl,marginTop:2}}>
                <span>{min}{(id==="exd"||id==="rest")?"s":""}</span>
                <span>{max}{(id==="exd"||id==="rest")?"s":""}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:18,padding:12,border:`1px solid ${c.brd}`,borderRadius:8,background:c.sur}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".14em",color:c.lbl,marginBottom:8}}>{lang==="pt"?"EXERCÍCIOS NESTA SESSÃO":"EXERCISES IN THIS SESSION"}</div>
          {exs.map((ex,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderBottom:i<exs.length-1?`1px solid ${c.brd}`:"none"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.lbl,minWidth:16}}>{i+1}</div>
              <div style={{width:4,height:4,borderRadius:"50%",background:ex.phaseColor||"#888",flexShrink:0}}/>
              <span style={{fontSize:12,fontWeight:400,color:c.body,flex:1}}>{enm(ex.name)}</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl}}>{runMode==="reps"?`×${repsN}`:`${exDur}s`}</span>
            </div>
          ))}
        </div>
        <button onClick={beginSession} style={{width:"100%",cursor:"pointer",background:`color-mix(in srgb,${col} 18%,transparent)`,border:`2px solid ${col}`,borderRadius:10,padding:"14px",fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:".2em",color:col}}>
          ▶ {lang==="pt"?"INICIAR SESSÃO":"BEGIN SESSION"}
        </button>
      </div>
      <BottomBar/>
    </div>
  );
}

/* BROWSE */
const cats = ["ALL", ...Object.keys(TYPES)];
const filtered = catFilt==="ALL" ? ALL_SESSIONS : ALL_SESSIONS.filter(s => s.tags.includes(catFilt));
return (
  <div style={{fontFamily:"'Inter',sans-serif",background:c.bg,minHeight:"100vh",color:c.txt}}>
    <style>{css}</style><Header/>
    <div style={{maxWidth:880,margin:"0 auto",padding:"20px 20px 86px"}}>
      <div style={{marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${c.div}`}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".2em",color:c.muted,marginBottom:4}}>{lang==="pt"?"ESCOLHER SESSÃO":"CHOOSE SESSION"}</div>
        <p style={{fontSize:13,fontWeight:300,color:c.sec,lineHeight:1.65,maxWidth:520}}>{lang==="pt"?"Escolhe uma sessão e configura o teu treino — repetições ou HIIT, com contagem automática e avisos sonoros.":"Choose a session and configure your workout — reps or HIIT timed, with automatic countdown and audio cues."}</p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
        {cats.map(k => {
          const isA = catFilt===k;
          const col = k==="ALL" ? c.muted : tc(k);
          const lbl = k==="ALL" ? (lang==="pt"?"TODOS":"ALL") : tl(k);
          return <button key={k} onClick={() => setCatFilt(k)} style={{cursor:"pointer",background:isA?`${col}18`:c.sur,border:`1px solid ${isA?col:c.brd}`,borderRadius:18,padding:"5px 11px",fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".13em",color:isA?col:c.lbl,transition:"all .15s"}}>{lbl}</button>;
        })}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(ses => {
          const col = ses.catColor || "#888";
          return (
            <div key={ses.id} style={{borderRadius:10,border:`1px solid ${c.brd}`,padding:14,background:c.sur,transition:"border-color .2s"}}
              onMouseOver={e => e.currentTarget.style.borderColor=col}
              onMouseOut={e => e.currentTarget.style.borderColor=c.brd}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:".12em",padding:"2px 7px",borderRadius:9,background:`${col}18`,color:col,border:`1px solid ${col}40`}}>{lang==="pt"?ses.catPt:ses.catEn}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:c.lbl}}>{ses.id}</span>
                  </div>
                  <div style={{fontSize:14,fontWeight:500,color:c.body,marginBottom:2}}>{lang==="pt"?ses.nPt:ses.nEn}</div>
                  <div style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.5,marginBottom:5}}>{lang==="pt"?ses.dPt:ses.dEn}</div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:c.lbl}}>{ses.list.length} {lang==="pt"?"ex":"ex"} · {ses.defRest}s {lang==="pt"?"descanso padrão":"default rest"}</span>
                </div>
                <RunBtn ses={ses}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <BottomBar/>
  </div>
);
```

}

/* ═══════════════════════════════════════════════════
TYPES
═══════════════════════════════════════════════════ */
if (page === “types”) return (
<div style={{fontFamily:”‘Inter’,sans-serif”,background:c.bg,minHeight:“100vh”,color:c.txt}}>
<style>{css}</style><Header/>
<div style={{maxWidth:880,margin:“0 auto”,padding:“20px 20px 86px”}}>
<div style={{marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${c.div}`}}>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,letterSpacing:”.2em”,color:c.muted,marginBottom:4}}>{lang===“pt”?“TREINAR POR TIPO”:“TRAIN BY TYPE”}</div>
<p style={{fontSize:13,fontWeight:300,color:c.sec,lineHeight:1.65,maxWidth:520}}>{lang===“pt”?“Seleciona a qualidade que mais limita o teu desempenho.”:“Select the quality that limits your performance most.”}</p>
</div>
<div style={{display:“flex”,flexDirection:“column”,gap:8}}>
{Object.entries(TYPES).map(([key, info]) => {
const isOpen = openType === key;
const exList = TYPE_EX_MAP[key] || [];
const sub    = typeSub[key] || “ex”;
return (
<div key={key} style={{borderRadius:8,border:`1px solid ${isOpen?info.color+"55":c.brd}`,background:isOpen?`color-mix(in srgb,${info.color} 3%,${c.bg})`:c.sur,transition:“border-color .2s,background .2s”}}>
<div style={{display:“flex”,alignItems:“center”,gap:12,padding:“14px 16px”,cursor:“pointer”}} onClick={() => setOpenType(isOpen?null:key)}>
<div style={{width:3,height:36,background:info.color,borderRadius:2,flexShrink:0}}/>
<div style={{flex:1}}>
<div style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:2}}>
<span style={{fontFamily:”‘Bebas Neue’”,fontSize:18,color:info.color,letterSpacing:”.07em”}}>{lang===“pt”?info.pt:info.en}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,color:c.lbl}}>{exList.length} ex · {info.sessions.length} {lang===“pt”?“sessões”:“sessions”}</span>
</div>
<p style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.55,maxWidth:480}}>{lang===“pt”?info.dPt:info.dEn}</p>
</div>
<div style={{color:c.lbl,fontSize:18,fontWeight:300,transform:isOpen?“rotate(45deg)”:“none”,transition:“transform .2s”,flexShrink:0}}>+</div>
</div>
{isOpen && (
<div className=“fi” style={{borderTop:`1px solid ${info.color}25`,padding:“12px 16px 14px”}}>
<div style={{padding:“8px 10px”,borderRadius:6,border:`1px solid ${info.color}30`,background:`${info.color}08`,marginBottom:10}}>
<p style={{fontSize:12,color:c.body}}>{lang===“pt”?info.gPt:info.gEn}</p>
</div>
<div style={{display:“flex”,gap:5,marginBottom:10}}>
{[[“ex”,lang===“pt”?“EXERCÍCIOS”:“EXERCISES”],[“ses”,lang===“pt”?“SESSÕES”:“SESSIONS”]].map(([v,lbl]) => (
<button key={v} className={`stab${sub===v?" on":""}`} style={{”–tc”:info.color,color:sub===v?info.color:c.lbl,border:`1px solid ${sub===v?info.color+"60":c.brd}`}}
onClick={() => setTypeSub(p => ({…p,[key]:v}))}>{lbl} ({v===“ex”?exList.length:info.sessions.length})</button>
))}
</div>
{sub === “ex” && (
<div style={{display:“flex”,flexDirection:“column”,gap:5}}>
{exList.map((ex, ei) => {
const uid = `${key}-${ei}`;
const isExOpen = openTEx === uid;
return (
<div key={uid} className={`ec${isExOpen?" op":""}`} style={{”–pc”:info.color}}>
<div style={{padding:“10px 12px”,cursor:“pointer”}} onClick={() => { setOpenTEx(isExOpen?null:uid); if(!isExOpen)setTExTab(p=>({…p,[uid]:null})); }}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div style={{flex:1}}>
<div style={{display:“flex”,alignItems:“center”,gap:6,marginBottom:2,flexWrap:“wrap”}}>
<div style={{width:4,height:4,borderRadius:“50%”,background:ex.phaseColor,flexShrink:0}}/>
<span style={{fontSize:13,fontWeight:500,color:isExOpen?c.txt:c.body}}>{enm(ex.name)}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,padding:“2px 5px”,borderRadius:3,background:`${levelColor[ex.level]}18`,color:levelColor[ex.level],letterSpacing:”.1em”}}>{lvlL(ex.level)}</span>
</div>
<div style={{display:“flex”,gap:8,flexWrap:“wrap”,alignItems:“center”}}>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:10,color:c.sec}}>{ex.sets}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:10,color:c.lbl}}>{lang===“pt”?“DESCANSO”:“REST”} {ex.rest}</span>
<button onClick={e=>{e.stopPropagation();navTo(ex.phaseId,PHASES.find(p=>p.id===ex.phaseId)?.exercises.findIndex(e2=>e2.name===ex.name)||0);}}
style={{cursor:“pointer”,background:“transparent”,border:`1px solid ${ex.phaseColor}40`,borderRadius:8,padding:“2px 6px”,fontFamily:”‘DM Mono’,monospace”,fontSize:8,color:ex.phaseColor}}>
{lang===“pt”?“FASE”:“PHASE”} {ex.phaseId} →
</button>
</div>
</div>
<div style={{color:c.lbl,fontSize:16,fontWeight:300,transform:isExOpen?“rotate(45deg)”:“none”,transition:“transform .2s”,marginLeft:8,flexShrink:0}}>+</div>
</div>
</div>
{isExOpen && <div className="fi"><ExBody ex={ex} uid={uid} tabSt={tExTab} setTabSt={setTExTab} pc={info.color}/></div>}
</div>
);
})}
</div>
)}
{sub === “ses” && (
<div style={{display:“flex”,flexDirection:“column”,gap:6}}>
{info.sessions.map((ses, si) => {
const uid = `${key}-s-${si}`;
const isOpen2 = openTSes === uid;
const sesSrc = ALL_SESSIONS.find(s => s.id === ses.code);
return (
<div key={uid} style={{borderRadius:8,border:`1px solid ${isOpen2?info.color+"55":c.brd}`,background:isOpen2?c.surO:c.sur,overflow:“hidden”}}>
<div style={{display:“flex”,alignItems:“center”,gap:10,padding:“10px 14px”,cursor:“pointer”}} onClick={() => setOpenTSes(isOpen2?null:uid)}>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,color:info.color,minWidth:28}}>{ses.code}</div>
<div style={{flex:1}}>
<div style={{fontSize:13,fontWeight:500,color:isOpen2?c.txt:c.body,marginBottom:2}}>{lang===“pt”?ses.nPt:ses.nEn}</div>
<div style={{fontSize:11,fontWeight:300,color:c.muted,lineHeight:1.35}}>{lang===“pt”?ses.dPt:ses.dEn}</div>
</div>
<div style={{display:“flex”,alignItems:“center”,gap:7}}>
{sesSrc && <RunBtn ses={sesSrc} small/>}
<div style={{color:c.lbl,fontSize:16,fontWeight:300,transform:isOpen2?“rotate(45deg)”:“none”,transition:“transform .2s”,flexShrink:0}}>+</div>
</div>
</div>
{isOpen2 && <div className=“fi” style={{borderTop:`1px solid ${c.div}`,padding:“5px 14px 10px”}}><SesExList list={ses.list}/></div>}
</div>
);
})}
</div>
)}
</div>
)}
</div>
);
})}
</div>
<div style={{marginTop:16,fontFamily:”‘DM Mono’,monospace”,fontSize:8,color:c.faint,letterSpacing:”.1em”,textAlign:“center”}}>{lang===“pt”?“PROTOCOLO PLIOMÉTRICO BASEADO EM EVIDÊNCIAS”:“EVIDENCE-BASED PLYOMETRIC PROTOCOL”}</div>
</div>
<BottomBar/>
</div>
);

/* ═══════════════════════════════════════════════════
EXERCISES
═══════════════════════════════════════════════════ */
return (
<div style={{fontFamily:”‘Inter’,sans-serif”,background:c.bg,minHeight:“100vh”,color:c.txt}}>
<style>{css}</style><Header/>
<div style={{maxWidth:880,margin:“0 auto”,padding:“20px 20px 86px”}}>
<div style={{display:“flex”,marginBottom:20,border:`1px solid ${c.brd}`,borderRadius:8,overflow:“hidden”}}>
{[{lbl:lang===“pt”?“PLIOMETRIA”:“PLYOMETRICS”,ids:[“A”,“B”,“C”,“D”]},{lbl:lang===“pt”?“FORÇA”:“STRENGTH”,ids:[“E”,“F”,“G”,“H”,“I”,“J”]}].map((grp,gi) => (
<div key={gi} style={{flex:1,borderRight:gi===0?`1px solid ${c.brd}`:“none”}}>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,letterSpacing:”.2em”,color:c.muted,padding:“6px 12px 5px”,borderBottom:`1px solid ${c.brd}`,background:c.sur}}>{grp.lbl}</div>
<div style={{display:“flex”,flexDirection:“column”}}>
{grp.ids.map((id, idx) => {
const ph = PHASES.find(p => p.id === id);
const isA = activePhase === id;
return (
<button key={id} style={{background:isA?`color-mix(in srgb,${ph.color} 8%,${c.bg})`:c.bg,padding:“9px 12px”,borderRadius:0,borderBottom:idx<grp.ids.length-1?`1px solid ${c.brd}`:“none”,borderLeft:“none”,borderRight:“none”,borderTop:“none”,cursor:“pointer”,textAlign:“left”,transition:“background .2s”}}
onClick={() => { setPhase(id); setOpenEx(null); setExTab({}); }}>
<div style={{display:“flex”,alignItems:“center”,gap:9}}>
<span style={{fontFamily:”‘Bebas Neue’”,fontSize:15,color:isA?ph.color:c.lbl,letterSpacing:”.05em”,minWidth:14}}>{id}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:9,letterSpacing:”.06em”,color:isA?c.body:c.lbl,lineHeight:1.2}}>{lang===“pt”?ph.labelPt:ph.label}</span>
{isA && <div style={{marginLeft:“auto”,width:4,height:4,borderRadius:“50%”,background:ph.color}}/>}
</div>
</button>
);
})}
</div>
</div>
))}
</div>
<div style={{marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${c.hdr}`}}>
<div style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:3}}>
<div style={{width:3,height:14,background:phase.color,borderRadius:2}}/>
<span style={{fontFamily:”‘Bebas Neue’”,fontSize:18,color:phase.color,letterSpacing:”.07em”}}>{lang===“pt”?phase.labelPt:phase.label}</span>
</div>
<p style={{fontSize:12,fontWeight:300,color:c.sec,lineHeight:1.6}}>{lang===“pt”?phase.descPt:phase.desc}</p>
</div>
<div style={{display:“flex”,flexDirection:“column”,gap:5}}>
{phase.exercises.map((ex, i) => {
const isOpen = openEx === i;
const typeC = tc(ex.type);
return (
<div key={i} className={`ec${isOpen?" op":""}`} style={{”–pc”:phase.color}}>
<div style={{padding:“12px 14px”,cursor:“pointer”}} onClick={() => { setOpenEx(isOpen?null:i); if(!isOpen)setExTab(p=>({…p,[i]:null})); }}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div style={{flex:1}}>
<div style={{display:“flex”,alignItems:“center”,gap:6,marginBottom:3,flexWrap:“wrap”}}>
<span style={{fontSize:14,fontWeight:500,color:isOpen?c.txt:c.body}}>{enm(ex.name)}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,padding:“2px 5px”,borderRadius:9,background:`${typeC}15`,color:typeC,border:`1px solid ${typeC}35`,letterSpacing:”.11em”}}>{tl(ex.type)}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,padding:“2px 5px”,borderRadius:3,background:`${levelColor[ex.level]}18`,color:levelColor[ex.level],letterSpacing:”.1em”}}>{lvlL(ex.level)}</span>
</div>
<div style={{display:“flex”,gap:12}}>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:11,color:c.sec}}>{ex.sets}</span>
<span style={{fontFamily:”‘DM Mono’,monospace”,fontSize:11,color:c.lbl}}>{lang===“pt”?“DESCANSO”:“REST”} {ex.rest}</span>
</div>
</div>
<div style={{color:c.lbl,fontSize:18,fontWeight:300,marginLeft:10,transform:isOpen?“rotate(45deg)”:“none”,transition:“transform .2s”,flexShrink:0}}>+</div>
</div>
</div>
{isOpen && <div className="fi"><ExBody ex={ex} uid={i} tabSt={exTab} setTabSt={setExTab} pc={phase.color}/></div>}
</div>
);
})}
</div>
</div>
<BottomBar/>
</div>
);
}
