// BUILD:1783857000
"use client"; // Lokl v1783857000
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://cdiuboyklymirssxperd.supabase.co",
  "sb_publishable_WkUnC5ElLD9xRbhzG_OKFw_13gOTwGk"
);

const CITY = "San Fernando";
const APP_NAME = "Lokl";
const APP_URL = "https://www.usalokl.com";
const WA = "584243232671";
const ADMIN_USER = "admin";
const ADMIN_PASS = "mimercado2024";
const P = "#25D366";
const A = "#FB8C00";
const DARK = "#2E2E2E";
const LIGHT = "#F6F6F6";
const P2 = "#1aab52";

const MAIN_TABS = ["Inicio","Supermercado","Negocios locales","Feria de comida","Servicios"];
const SEC_TABS = ["Clasificados","Mercadito local"];
const NEGOCIO_CATS = [
  {cat:"Ropa",emoji:"👗",color:"#fdf2f8",tc:"#9d174d"},
  {cat:"Calzado",emoji:"👟",color:"#fdf2f8",tc:"#9d174d"},
  {cat:"Maquillaje",emoji:"💄",color:"#fdf2f8",tc:"#9d174d"},
  {cat:"Accesorios",emoji:"💍",color:"#fefce8",tc:"#854d0e"},
  {cat:"Farmacia",emoji:"💊",color:"#f0fdf4",tc:"#15803d"},
  {cat:"Ferretería",emoji:"🔧",color:"#fff7ed",tc:"#c2410c"},
  {cat:"Tecnología",emoji:"📱",color:"#eff6ff",tc:"#1d4ed8"},
  {cat:"Hogar",emoji:"🏠",color:"#f0fdf4",tc:"#15803d"},
  {cat:"Regalos",emoji:"🎁",color:"#fdf4ff",tc:"#7c3aed"},
  {cat:"Cuidado personal",emoji:"🧴",color:"#ecfdf5",tc:"#065f46"},
  {cat:"Mascotas",emoji:"🐾",color:"#fff7ed",tc:"#c2410c"},
  {cat:"Alimentos",emoji:"🛒",color:"#f0fdf4",tc:"#15803d"},
  {cat:"Otros",emoji:"📦",color:"#f8fafc",tc:"#475569"},
];
// Qué etiqueta de variante mostrar según categoría del producto
const VARIANTES_CONFIG={
  "Ropa":{label:"Tallas disponibles",placeholder:"Ej: XS, S, M, L, XL  ó  0, 2, 4, 6, 8"},
  "Calzado":{label:"Tallas disponibles",placeholder:"Ej: 35, 36, 37, 38, 39, 40, 41"},
  "Maquillaje":{label:"Tonos disponibles",placeholder:"Ej: 01 Marfil, 02 Beige, 03 Natural, 04 Café"},
  "Cuidado personal":{label:"Fragancias / Variantes",placeholder:"Ej: Lavanda, Vainilla, Sin fragancia, Rosa"},
  "Accesorios":{label:"Colores / Variantes",placeholder:"Ej: Dorado, Plateado, Negro, Rosado"},
};
// Categorías de producto para Tienda / Negocio local
const PROD_CATS_TIENDA=["Ropa","Calzado","Maquillaje","Cuidado personal","Accesorios","Tecnología","Hogar","Mascotas","Farmacia","Ferretería","Regalos","Alimentos","Otros"];
const SUPER_CATS = ["Snacks","Granos y cereales","Bebidas","Lácteos","Panadería","Aceites y condimentos","Enlatados","Limpieza del hogar","Aseo personal","Proteínas","Frutas y verduras"];
const PROV_CATS = ["Comida preparada","Postres","Jugos y bebidas","Pan y repostería"];
const ALL_CATS = ["Todo","Supermercado",...PROV_CATS];
const PAGOS = ["Pago Móvil","Zelle","Efectivo al recibir","Binance/USDT"];

const CLASIF_TIPOS = ["Vehículos","Motos","Inmuebles"];
const VEHICULO_MARCAS = ["Toyota","Ford","Chevrolet","Hyundai","Kia","Nissan","Mitsubishi","Honda","Mazda","Jeep","Dodge","RAM","Otro"];
const MOTO_MARCAS = ["Honda","Yamaha","Suzuki","Kawasaki","TVS","AKT","Otro"];
const TRANSMISION = ["Manual","Automático"];
const COMBUSTIBLE = ["Gasolina","Diesel","Eléctrico","Híbrido"];
const TIPO_OPERACION = ["Venta","Alquiler"];
const REMATE_CATS = ["Electrodomésticos","Electrónica","Ropa y calzado","Calzado","Muebles y hogar","Repuestos","Herramientas","Juguetes y niños","Empleo / Trabajo","Animales y mascotas","Otros"];
const TIPO_NEGOCIO = [
  "Restaurante / Cocina / Comida",
  "Tienda / Negocio local",
  // HOSPEDAJE Y TURISMO
  "Hotel / Posada",
  "Finca turística",
  "Tour operador",
  "Campamento / Aventura",
  // TRANSPORTE
  "Mototaxi",
  "Taxi",
  "Transporte interurbano (rutas)",
  "Encomiendas y mudanzas",
  // SALUD
  "Médico / Consultorio",
  "Enfermería a domicilio",
  "Laboratorio clínico",
  "Odontología",
  "Farmacia",
  // BELLEZA
  "Peluquería / Barbería",
  "Manicure / Pedicure",
  "Maquillaje y estética",
  // HOGAR Y CONSTRUCCIÓN
  "Plomería",
  "Electricidad",
  "Pintura y construcción",
  "Limpieza del hogar",
  "Carpintería / Herrería",
  // EDUCACIÓN
  "Clases y tutorías",
  "Idiomas",
  // MECÁNICA
  "Mecánica automotriz",
  "Electricidad automotriz",
  // OTROS
  "Lavandería",
  "Fotografía / Video",
  "Otro",
];
const NEGOCIO_LOCAL_CATS = [
  {cat:"Ropa",emoji:"👗",color:"#fce7f3",tc:"#be185d"},
  {cat:"Calzado",emoji:"👟",color:"#fce7f3",tc:"#be185d"},
  {cat:"Maquillaje",emoji:"💄",color:"#fce7f3",tc:"#be185d"},
  {cat:"Accesorios",emoji:"💍",color:"#fef3c7",tc:"#92400e"},
  {cat:"Farmacia",emoji:"💊",color:"#dbeafe",tc:"#1d4ed8"},
  {cat:"Ferretería",emoji:"🔧",color:"#f1f5f9",tc:"#475569"},
  {cat:"Tecnología",emoji:"📱",color:"#ede9fe",tc:"#7c3aed"},
  {cat:"Hogar",emoji:"🏠",color:"#dcfce7",tc:"#15803d"},
  {cat:"Regalos",emoji:"🎁",color:"#fff7ed",tc:"#c2410c"},
  {cat:"Cuidado personal",emoji:"🧴",color:"#f0fdf4",tc:"#15803d"},
  {cat:"Mascotas",emoji:"🐾",color:"#fef9c3",tc:"#854d0e"},
  {cat:"Alimentos",emoji:"🛒",color:"#f0fdf4",tc:"#15803d"},
  {cat:"Otros",emoji:"📦",color:"#f8fafc",tc:"#64748b"},
];
const NEGOCIO_CATS_RESTAURANTE = ["Comida criolla","Comida rápida","Pizzería","Mariscos","Panadería/Pastelería","Jugos y bebidas","Postres","Otro"];
const TIPOS_OPERACION_GASTRO = [
  {value:"restaurante",label:"🏠 Restaurante — Local físico abierto al público",desc:"Tiene local, atiende en sitio y puede hacer delivery"},
  {value:"cocina_oscura",label:"🍱 Cocina preparada en casa — Solo delivery",desc:"Prepara desde casa, solo entrega a domicilio, sin local físico"},
  {value:"panaderia",label:"🍞 Panadería / Pastelería / Repostería",desc:"Panadería, tortas, dulces, postres y repostería"},
  {value:"comida_rapida",label:"⚡ Comida rápida — Puesto ambulante o local",desc:"Perros, hamburguesas, empanadas, pepitos, comida de calle"},
];
const TIPOS_COMIDA = [
  "Parrilla","Carne asada","Pollo a la brasa","Costillas","BBQ / Ahumados",
  "Hamburguesas","Perros calientes","Pepitos","Club house","Papas fritas","Salchipapas","Alitas / Nuggets",
  "Comida criolla","Cachapas","Arepas","Pabellón","Pisillo","Empanadas","Asado llanero",
  "Pizzería","Pastas","Lasaña",
  "Mondongo","Caldos","Hervidos",
  "Pescado frito","Mariscos","Ceviches",
  "Comida china","Comida asiática","Comida mexicana","Comida árabe","Comida peruana",
  "Panadería","Pastelería","Postres","Tortas","Repostería",
  "Jugos naturales","Batidos","Bebidas frías","Café",
  "Comida saludable","Vegetariana","Vegana",
  "Combos","Menú del día","Especiales","Otros",
];
// Avatar inteligente para proveedores de comida
const getAvatarColor=(name)=>{const colors=["#f97316","#ec4899","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#6366f1"];const i=name?.charCodeAt(0)%colors.length||0;return colors[i];};
const TIPO_GASTRO_LABEL = {
  restaurante:"🍽️ Restaurante · Atención en local",
  cocina_oscura:"🚚 Cocina de delivery · Solo a domicilio",
  panaderia:"🍞 Panadería · Postres y repostería",
  comida_rapida:"⚡ Comida rápida",
};
const NEGOCIO_CATS_TRANSPORTE = ["Mototaxi","Taxi","Línea de transporte","Encomiendas"];
const SERVICIO_CATS = ["Plomería","Electricidad","Mecánica","Belleza y estética","Costura y modistería","Clases y tutorías","Limpieza","Construcción","Transporte","Salud","Otros"];

const SERVICIO_CATEGORIAS = [
  {id:"mototaxi",     label:"Mototaxi",          icon:"🛵", color:"#92400e", bg:"linear-gradient(135deg,#78350f,#d97706)", desc:"Traslados rápidos en moto", tipo:"transporte"},
  {id:"taxi",         label:"Taxi",               icon:"🚕", color:"#1e40af", bg:"linear-gradient(135deg,#1e3a8a,#2563eb)", desc:"Viajes cómodos y seguros",   tipo:"transporte"},
  {id:"rutas",        label:"Rutas interurbanas", icon:"🚌", color:"#065f46", bg:"linear-gradient(135deg,#064e3b,#059669)", desc:"Viajes entre ciudades",       tipo:"transporte"},
  {id:"encomiendas",  label:"Encomiendas",        icon:"📦", color:"#9a3412", bg:"linear-gradient(135deg,#7c2d12,#ea580c)", desc:"Envíos y paquetes",           tipo:"transporte"},
  {id:"medicos",      label:"Médicos",            icon:"👨‍⚕️", color:"#1e40af", bg:"linear-gradient(135deg,#1e3a8a,#3b82f6)", desc:"Consultas médicas",           tipo:"salud"},
  {id:"enfermeria",   label:"Enfermería",         icon:"💉", color:"#be123c", bg:"linear-gradient(135deg,#9f1239,#e11d48)", desc:"Atención a domicilio",        tipo:"salud"},
  {id:"laboratorios", label:"Laboratorios",       icon:"🔬", color:"#5b21b6", bg:"linear-gradient(135deg,#4c1d95,#7c3aed)", desc:"Exámenes y análisis",         tipo:"salud"},
  {id:"odontologia",  label:"Odontología",        icon:"🦷", color:"#0e7490", bg:"linear-gradient(135deg,#164e63,#0891b2)", desc:"Salud dental",                tipo:"salud"},
  {id:"belleza",      label:"Belleza",            icon:"💇", color:"#9d174d", bg:"linear-gradient(135deg,#831843,#db2777)", desc:"Peluquería y estética",       tipo:"hogar"},
  {id:"hogar",        label:"Hogar",              icon:"🔧", color:"#374151", bg:"linear-gradient(135deg,#1f2937,#4b5563)", desc:"Plomería, electricidad...",   tipo:"hogar"},
  {id:"educacion",    label:"Educación",          icon:"📚", color:"#1e40af", bg:"linear-gradient(135deg,#1e3a8a,#4f46e5)", desc:"Clases y tutorías",           tipo:"hogar"},
  {id:"mecanica",     label:"Mecánica",           icon:"🔩", color:"#92400e", bg:"linear-gradient(135deg,#78350f,#b45309)", desc:"Autos y motos",              tipo:"hogar"},
  {id:"hoteles",      label:"Hoteles",            icon:"🏨", color:"#0f766e", bg:"linear-gradient(135deg,#134e4a,#0d9488)", desc:"Hospedaje y alojamiento",    tipo:"turismo"},
  {id:"turismo",      label:"Turismo / Fincas",   icon:"🌴", color:"#065f46", bg:"linear-gradient(135deg,#064e3b,#16a34a)", desc:"Fincas, tours y aventura",   tipo:"turismo"},
];

const SVCS = [
  {id:"s1",name:"Mototaxi",emoji:"🛵",desc:"Te llevamos a donde necesites",price:"Desde $1.00",bg:"#fef3c7",tc:"#92400e"},
  {id:"s2",name:"Taxi",emoji:"🚕",desc:"Viajes cómodos y seguros en SF",price:"Desde $2.00",bg:"#e0f2fe",tc:"#0369a1"},
  {id:"s3",name:"Lavandería",emoji:"👕",desc:"Recogemos y entregamos limpia",price:"Desde $3.00/kg",bg:"#f0fdf4",tc:"#15803d"},
  {id:"s4",name:"Limpieza del hogar",emoji:"🧹",desc:"Personal de confianza para tu casa",price:"Desde $10.00/día",bg:"#fdf4ff",tc:"#7e22ce"},
  {id:"s5",name:"Enfermería a domicilio",emoji:"💉",desc:"Atención profesional en tu hogar",price:"Desde $5.00",bg:"#fff1f2",tc:"#be123c"},
  {id:"s6",name:"Encomiendas locales",emoji:"📦",desc:"Enviamos lo que necesites",price:"$1.00 – $2.00",bg:"#fff7ed",tc:"#c2410c"},
];

const s = {
  app:{fontFamily:"'Poppins','Segoe UI',system-ui,sans-serif",background:"#f8fafc",minHeight:"100vh",maxWidth:430,margin:"0 auto",paddingBottom:20},
  hdr:{background:"#fff",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",borderBottom:"1px solid #f0f0f0"},
  logo:{color:DARK,fontWeight:800,fontSize:20,letterSpacing:-0.5},
  city:{background:"#f0fdf4",color:P,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,marginLeft:6},
  cBtn:{background:"#f6f6f6",border:"1px solid #e0e0e0",borderRadius:20,padding:"6px 12px",color:DARK,display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13},
  cN:{background:A,color:"#fff",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700},
  tabs:{display:"flex",background:"#fff",borderBottom:"2px solid #f0f0f0",position:"sticky",top:54,zIndex:99,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",overflowX:"auto",justifyContent:"space-around"},
  tab:(a)=>({flex:1,padding:"8px 4px 6px",border:"none",background:a?"#dcfce7":"transparent",color:a?"#14532d":"#94a3b8",fontWeight:a?800:400,fontSize:8,cursor:"pointer",borderBottom:a?`4px solid #14532d`:"4px solid transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:1,minWidth:0,transition:"all 0.15s"}),
  banner:{background:"linear-gradient(135deg,#25D366,#1aab52)",padding:"16px",color:"#fff"},
  bT:{fontSize:19,fontWeight:700,margin:"0 0 2px"},
  bS:{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 10px"},
  bdg:(bg,c)=>({fontSize:10,fontWeight:600,background:bg,color:c,padding:"3px 9px",borderRadius:12,display:"inline-block",marginRight:6,marginBottom:4}),
  sw:{padding:"12px 16px 0"},
  si:{width:"100%",padding:"10px 14px",borderRadius:12,border:"1px solid #e2e8f0",fontSize:14,background:"#fff",boxSizing:"border-box",outline:"none"},
  cs:{display:"flex",gap:8,padding:"12px 16px",overflowX:"auto"},
  cb:(a)=>({background:a?P:"#fff",color:a?"#fff":"#64748b",border:a?`1px solid ${P}`:"1px solid #e2e8f0",borderRadius:20,padding:"6px 14px",fontSize:13,fontWeight:a?600:500,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,boxShadow:a?"0 2px 6px rgba(22,163,74,0.2)":"none"}),
  sec:{padding:"0 16px 16px"},
  sT:{fontSize:11,fontWeight:700,color:P,letterSpacing:0.8,margin:"14px 0 8px",textTransform:"uppercase",display:"flex",alignItems:"center",gap:4},
  grid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},
  card:{background:"#fff",borderRadius:16,padding:12,border:"1px solid #e7f3ee",display:"flex",flexDirection:"column",gap:5,boxShadow:"0 1px 4px rgba(22,163,74,0.06)"},
  cEm:{fontSize:32,textAlign:"center",padding:"4px 0"},
  cImg:{width:"100%",height:90,objectFit:"cover",borderRadius:8,marginBottom:4},
  cLogo:{width:24,height:24,borderRadius:"50%",objectFit:"cover",border:"2px solid #f1f5f9"},
  cNm:{fontSize:12,fontWeight:600,color:"#334155",lineHeight:1.3},
  cMeta:{fontSize:10,color:"#94a3b8"},
  cKt:{fontSize:10,color:"#94a3b8",display:"flex",alignItems:"center",gap:4},
  cBt:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto"},
  cPr:{fontSize:18,fontWeight:900,color:P,letterSpacing:-0.3},
  cUn:{fontSize:10,color:"#94a3b8"},
  aBtn:{background:P,color:"#fff",border:"none",borderRadius:20,width:32,height:32,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 6px rgba(22,163,74,0.3)"},
  tag:{fontSize:10,fontWeight:600,background:"#fef3c7",color:"#92400e",padding:"2px 7px",borderRadius:8,alignSelf:"flex-start"},
  promoTag:{fontSize:10,fontWeight:600,background:"#fdf4ff",color:"#7e22ce",padding:"2px 7px",borderRadius:8,alignSelf:"flex-start"},
  qR:{display:"flex",alignItems:"center",gap:5},
  qB:{background:"#f1f5f9",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"},
  qN:{fontSize:14,fontWeight:700,minWidth:16,textAlign:"center"},
  stars:{display:"flex",gap:4,margin:"4px 0"},
  star:(f)=>({fontSize:18,cursor:"pointer",color:f?"#f59e0b":"#e2e8f0"}),
  ov:{position:"fixed",top:0,left:0,right:0,bottom:0,width:"100vw",height:"100vh",background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"},
  sh:{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto",padding:20,WebkitOverflowScrolling:"touch"},
  hnd:{width:40,height:4,background:"#e2e8f0",borderRadius:2,margin:"0 auto 16px"},
  shT:{fontSize:18,fontWeight:700,color:P,marginBottom:14},
  ci:{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"},
  sr:{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:14},
  sL:{color:"#64748b"},sV:{fontWeight:600,color:"#1e293b"},
  tR:{display:"flex",justifyContent:"space-between",padding:"10px 0 0",fontSize:16,borderTop:"1px solid #e2e8f0",marginTop:4},
  fT:{background:"#dcfce7",color:"#15803d",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:8},
  pw:{background:"#f1f5f9",borderRadius:8,padding:"10px 12px",margin:"10px 0"},
  pt:{background:"#e2e8f0",borderRadius:4,height:6,overflow:"hidden",margin:"6px 0"},
  pf:(p)=>({background:"#22c55e",height:"100%",width:`${Math.min(p,100)}%`,borderRadius:4,transition:"width 0.3s"}),
  btn:{background:P,color:"#fff",border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,width:"100%",cursor:"pointer",marginTop:10},
  btnG:{background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:14,padding:"13px",fontSize:14,fontWeight:600,width:"100%",cursor:"pointer",marginTop:8},
  btnWa:{background:"#22c55e",color:"#fff",border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,width:"100%",cursor:"pointer",marginTop:10},
  btnPurple:{background:"#7e22ce",color:"#fff",border:"none",borderRadius:14,padding:"13px",fontSize:14,fontWeight:700,width:"100%",cursor:"pointer",marginTop:8},
  btnRed:{background:"#ef4444",color:"#fff",border:"none",borderRadius:10,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer"},
  btnAmber:{background:"#f59e0b",color:P,border:"none",borderRadius:10,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer"},
  btnGreen:{background:P,color:"#fff",border:"none",borderRadius:10,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer"},
  inp:{width:"100%",padding:"11px 14px",borderRadius:12,border:"1px solid #e2e8f0",fontSize:14,marginBottom:10,boxSizing:"border-box",outline:"none"},
  lbl:{fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,display:"block"},
  ib:{background:"#f1f5f9",borderRadius:12,padding:"10px 14px",marginBottom:8},
  pc:{background:"#fff",borderRadius:16,padding:16,border:"1px solid #e7f3ee",marginBottom:10,boxShadow:"0 1px 6px rgba(22,163,74,0.05)"},
  pT:{fontSize:15,fontWeight:700,color:P,marginBottom:12},
  msg:(ok)=>({fontSize:13,color:ok?"#15803d":"#be123c",background:ok?"#f0fdf4":"#fff1f2",padding:"8px 12px",borderRadius:8,marginBottom:10}),
  apvBtn:{flex:1,padding:"8px",borderRadius:10,border:"none",fontSize:13,fontWeight:600,cursor:"pointer"},
  promoCard:{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",borderRadius:16,padding:16,margin:"0 16px 12px",color:"#fff"},
  comboCard:{background:"#fff",borderRadius:14,padding:12,border:"2px solid #f59e0b",marginBottom:10},
  admRow:(a)=>({width:"100%",padding:"10px 14px",background:a?"#0f172a":"#f8fafc",color:a?"#fff":"#1e293b",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13,fontWeight:500,cursor:"pointer",textAlign:"left",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}),
  toggleBtn:(on)=>({display:"flex",alignItems:"center",gap:12,background:on?"#f0fdf4":"#fef2f2",border:`2px solid ${on?"#16a34a":"#dc2626"}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",width:"100%",justifyContent:"center",boxShadow:on?"0 2px 12px rgba(22,163,74,0.15)":"0 2px 12px rgba(220,38,38,0.12)"}),
  statCard:{background:"#fff",borderRadius:12,padding:"12px 14px",border:"1px solid #f1f5f9",textAlign:"center"},
  statNum:{fontSize:22,fontWeight:700,color:P},
  statLbl:{fontSize:11,color:"#94a3b8",marginTop:2},
  barWrap:{background:"#f1f5f9",borderRadius:8,overflow:"hidden",height:8,flex:1},
  barFill:(p,c)=>({height:"100%",width:`${Math.min(p,100)}%`,background:c,borderRadius:8,transition:"width 0.5s"}),
};

const getHorario=()=>{const h=new Date().getHours();if(h>=6&&h<11)return{label:"🌅 Desayunos del día",sub:"Lo mejor para empezar tu mañana"};if(h>=11&&h<15)return{label:"☀️ Almuerzos del día",sub:"El menú perfecto para el mediodía"};if(h>=15&&h<18)return{label:"🍪 Meriendas",sub:"Algo rico para la tarde"};return{label:"🌙 Cenas",sub:"Termina el día con buen sabor"};};

// ── HELPER WHATSAPP (a prueba de Safari iOS) ─────────────────────────────────
// Usa window.location.href en vez de window.open porque Safari iOS bloquea
// window.open cuando no viene directo de un click. Un solo punto para todo.
function normalizarNumeroWA(tel){
  const n=(tel||"").replace(/\D/g,"");
  if(!n)return "";
  return n.startsWith("0")?"58"+n.slice(1):n.startsWith("58")?n:"58"+n;
}
function abrirWhatsApp(numero,mensaje){
  const num=normalizarNumeroWA(numero);
  const base=num?"https://wa.me/"+num:"https://wa.me/";
  window.location.href=base+"?text="+encodeURIComponent(mensaje||"");
}

// ── FUNCIÓN COMPARTIR ─────────────────────────────────────────────────────────
function compartirEnWA({titulo,precio,tab,id,emoji="📌"}){
  // Tiendas y restaurantes: usar la ruta /tienda/ID para que el preview de WhatsApp
  // muestre el LOGO de esa tienda (Open Graph dinámico). El resto de rubros
  // (Clasificados, Mercadito, Servicios) siguen con el link tab+id de siempre.
  let url;
  if(id&&(tab==="Negocios locales"||tab==="Feria de comida")){
    url=APP_URL+"/tienda/"+encodeURIComponent(id);
  }else{
    const params=[];
    if(tab)params.push("tab="+encodeURIComponent(tab));
    if(id)params.push("id="+encodeURIComponent(id));
    url=APP_URL+(params.length?"?"+params.join("&"):"");
  }
  const precioTexto=precio?` — $${parseFloat(precio).toLocaleString()}`:"";
  const tituloLimpio=(titulo||"").trim();
  const msg=`${emoji} *${tituloLimpio}*${precioTexto}\n\n📲 Míralo en ${APP_NAME}:\n${url}\n\n_Publicado en ${APP_NAME} · San Fernando de Apure_`;
  abrirWhatsApp(null,msg);
}
function BtnCompartir({titulo,precio,tab,id,emoji,small=false}){
  return(
    <button onClick={e=>{e.stopPropagation();compartirEnWA({titulo,precio,tab,id,emoji});}} title="Compartir en WhatsApp"
      style={{background:small?"rgba(37,211,102,0.08)":"#f0fdf4",border:"1px solid #86efac",borderRadius:small?8:10,padding:small?"5px 8px":"7px 12px",fontSize:small?11:12,fontWeight:700,color:"#15803d",cursor:"pointer",display:"flex",alignItems:"center",gap:4,flexShrink:0,whiteSpace:"nowrap"}}>
      🔗{small?"":" Compartir"}
    </button>
  );
}

function ProductoDetalleModal({producto,cartNegocio,setCartNegocio,onClose,s}){
  const [sliderIdx,setSliderIdx]=useState(0);
  const [varianteSel,setVarianteSel]=useState("");
  const fotos=[producto.foto,producto.foto2,producto.foto3,producto.foto4].filter(Boolean);
  const qty=cartNegocio[producto.id]?.qty||0;
  const listaVariantes=producto.variantes?producto.variantes.split(",").map(v=>v.trim()).filter(Boolean):[];
  const necesitaVariante=listaVariantes.length>0&&!varianteSel;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"85vh",overflow:"auto",paddingBottom:24}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"#e2e8f0",borderRadius:4,margin:"10px auto 0"}}/>
        {fotos.length>0?(
          <div style={{position:"relative",marginTop:8,background:"#f8fafc"}}>
            <img src={fotos[sliderIdx]} alt={producto.name} style={{width:"100%",height:260,objectFit:"contain",display:"block"}}/>
            {fotos.length>1&&(
              <>
                <button onClick={e=>{e.stopPropagation();setSliderIdx(i=>(i-1+fotos.length)%fotos.length);}} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",color:"#fff",border:"none",borderRadius:"50%",width:36,height:36,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
                <button onClick={e=>{e.stopPropagation();setSliderIdx(i=>(i+1)%fotos.length);}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",color:"#fff",border:"none",borderRadius:"50%",width:36,height:36,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
                <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:6}}>
                  {fotos.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setSliderIdx(i);}} style={{width:8,height:8,borderRadius:"50%",background:i===sliderIdx?"#1d4ed8":"#cbd5e1",cursor:"pointer"}}/>)}
                </div>
              </>
            )}
          </div>
        ):<div style={{height:140,background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,marginTop:8}}>🛍️</div>}
        <div style={{padding:"16px 20px 8px"}}>
          {producto.tag&&<span style={{fontSize:11,fontWeight:800,background:"#f59e0b",color:"#fff",padding:"3px 10px",borderRadius:8,marginBottom:10,display:"inline-block"}}>{producto.tag}</span>}
          <div style={{fontSize:20,fontWeight:900,color:"#0f172a",marginBottom:6,letterSpacing:-0.3}}>{producto.name}</div>
          {producto.marca&&<div style={{fontSize:13,fontWeight:600,color:"#475569",marginBottom:4}}>{producto.marca}</div>}
          {producto.descripcion&&<div style={{fontSize:13,color:"#64748b",lineHeight:1.6,marginBottom:12}}>{producto.descripcion}</div>}
          {/* SELECTOR DE VARIANTES */}
          {listaVariantes.length>0&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>
                {VARIANTES_CONFIG[producto.cat]?.label||"Selecciona una opción"} *
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {listaVariantes.map(v=>(
                  <button key={v} onClick={()=>setVarianteSel(v)} style={{padding:"8px 14px",borderRadius:20,border:`2px solid ${varianteSel===v?"#1d4ed8":"#e2e8f0"}`,background:varianteSel===v?"#1d4ed8":"#fff",color:varianteSel===v?"#fff":"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                    {v}
                  </button>
                ))}
              </div>
              {necesitaVariante&&<div style={{fontSize:11,color:"#dc2626",marginTop:6}}>⚠️ Selecciona una opción para continuar</div>}
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12}}>
            <div style={{fontSize:26,fontWeight:900,color:"#15803d",letterSpacing:-0.5}}>${parseFloat(producto.price||0).toFixed(2)}<span style={{fontSize:13,fontWeight:400,color:"#94a3b8",marginLeft:4}}>/{producto.unit}</span></div>
            {qty>0?(
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button style={{...s.qB,width:34,height:34,fontSize:18}} onClick={()=>{const n={...cartNegocio};n[producto.id].qty>1?n[producto.id]={...n[producto.id],qty:n[producto.id].qty-1}:delete n[producto.id];setCartNegocio(n);}}>−</button>
                <span style={{fontSize:16,fontWeight:800,minWidth:20,textAlign:"center"}}>{qty}</span>
                <button style={{...s.qB,width:34,height:34,fontSize:18}} onClick={()=>setCartNegocio(c=>({...c,[producto.id]:{...producto,qty:qty+1}}))}>+</button>
              </div>
            ):(
              <button style={{background:necesitaVariante?"#94a3b8":"#1d4ed8",color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:800,cursor:necesitaVariante?"not-allowed":"pointer"}} onClick={()=>{if(necesitaVariante)return;setCartNegocio(c=>({...c,[producto.id]:{...producto,variante:varianteSel||null,qty:1}}));onClose();}}>
                + Agregar{varianteSel?` (${varianteSel})`:""}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("Inicio");
  const [cat,setCat]=useState("Todo");
  const [superCat,setSuperCat]=useState("Todas");
  const [showBulkImport,setShowBulkImport]=useState(false);
  const [bulkData,setBulkData]=useState([]);
  const [bulkMsg,setBulkMsg]=useState("");
  const [bulkLoading,setBulkLoading]=useState(false);
  const [search,setSearch]=useState("");
const VE_ESTADOS_MUNICIPIOS={
  "Amazonas":["Alto Orinoco", "Atabapo", "Atures", "Autana", "Manapiare", "Maroa", "Río Negro"],
  "Anzoátegui":["Anaco", "Aragua", "Bolívar", "Bruzual", "Cajigal", "Carvajal", "Fernando de Peñalver", "Freites", "General Sir Arthur McGregor", "Guanipa", "Guanta", "Independencia", "Isla", "Libertad", "Lic. Diego Bautista Urban", "Miranda", "Monagas", "Píritu", "San Juan de Capistrano", "Santa Ana", "Simón Rodríguez", "Sotillo"],
  "Apure":["Achaguas", "Biruaca", "Muñoz", "Pedro Camejo", "Páez", "Rómulo Gallegos", "San Fernando"],
  "Aragua":["Bolívar", "Camatagua", "Francisco Linares", "Girardot", "José Angel Lamas", "José Félix Ribas", "José R Revenga", "Libertador", "Mario Briceño Iragorry", "Ocumare de la Costa de Oro", "San Casimiro", "San Sebastián", "Santiago Mariño", "Santos Michelena", "Sucre", "Tovar", "Urdaneta", "Zamora"],
  "Barinas":["Alberto Arvelo Torrealba", "Andres Eloy Blanco", "Antonio José de Sucre", "Arismendi", "Barinas", "Bolívar", "Cruz Paredes", "Ezequiel Zamora", "Obispos", "Pedraza", "Rojas", "Sosa"],
  "Bolívar":["Angostura", "Caroní", "Cedeño", "El Callao", "Gran Sabana", "Heres", "Padre Pedro Chien", "Piar", "Roscio", "Sifontes", "Sucre"],
  "Carabobo":["Bejuma", "Carlos Arevalo", "Diego Ibarra", "Guacara", "Juan José Mora", "Lago Valencia", "Libertador", "Los Guayos", "Miranda", "Montalbán", "Naguanagua", "Puerto Cabello", "San Diego", "San Joaquín", "Valencia"],
  "Cojedes":["Anzoátegui", "Ezequiel Zomora", "Falcón", "Girardot", "Lima Blanco", "Pao de San Juan Bautista", "Ricaurte", "Romulo Gallegos", "Tinaco"],
  "Delta Amacuro":["Antonio Diaz", "Casacoima", "Pedernales", "Tucupita"],
  "Distrito Capital":["Libertador"],
  "Falcón":["Acosta", "Bolívar", "Buchivacoa", "Cacique Manaure", "Carirubana", "Colina", "Dabajuro", "Democracia", "Falcón", "Federación", "Jacura", "Los Tanques", "Mauroa", "Miranda", "Monseñor Iturriza", "Palma Sola", "Petit", "Píritu", "San Francisco", "Silva", "Sucre", "Tocópero", "Unión", "Urumaco", "Zamora"],
  "Guárico":["Camaguán", "Chaguaramas", "El Socorro", "Infante", "Las Mercedes", "Mellado", "Miranda", "Monagas", "Ortíz", "Ribas", "Roscio", "San Gerónimo de Guayabal", "San José de Guaribe", "Santa María de Ipire", "Zaraza"],
  "Lara":["Andrés Eloy Blanco", "Crespo", "Iribarren", "Jiménez", "Morán", "Palavecino", "Simón Planas", "Torres", "Urdaneta"],
  "Miranda":["Acevedo", "Andrés Bello", "Baruta", "Brión", "Buroz", "Carrizal", "Chacao", "Cristóbal Rojas", "El Hatillo", "Guaicaipuro", "Independencia", "Lander", "Los Salias", "Paz Castillo", "Pedro Gual", "Plaza", "Páez", "Simón Bolívar", "Sucre", "Urdaneta", "Zamora"],
  "Monagas":["Acosta", "Aguasay", "Bolívar", "Caripe", "Cedeño", "Ezequiel Zamora", "Libertador", "Maturín", "Piar", "Punceres", "Santa Barbara", "Sotillo", "Uracoa"],
  "Mérida":["Alberto Adriani", "Andrés Bello", "Antonio Pinto Salinas", "Aricagua", "Arzobispo Chacón", "Campo Elías", "Caracciolo Parra Olmedo", "Cardenal Quintero", "Guaraque", "Julio César Salas", "Justo Briceño", "Libertador", "Miranda", "Obispo Ramos de Lora", "Padre Noguera", "Pueblo Llano", "Rangel", "Rivas Davila", "Santos Marquina", "Sucre", "Tovar", "Tulio Febres Cordero", "Zea"],
  "Nueva Esparta":["Antolín del Campo", "Arismendi", "Díaz", "García", "Gómez", "Isla de Coche", "Maneiro", "Marcano", "Mariño", "Peninsula de Macanao", "Tubores"],
  "Portuguesa":["Agua Blanca", "Araure", "Esteller", "Guanare", "Guanarito", "Monseñor José Vicente de Unda", "Ospino", "Papelón", "Páez", "San Genaro de Boconoito", "San Rafael de Onoto", "Santa Rosalía", "Sucre", "Turén"],
  "Sucre":["Andrés Eloy Blanco", "Andrés Mata", "Arismendi", "Benítez", "Bermúdez", "Bolívar", "Cajigal", "Cruz Salmerón Acosta", "Libertador", "Mariño", "Mejía", "Montes", "Ribero", "Sucre", "Valdez"],
  "Trujillo":["Andrés Bello", "Boconó", "Bolívar", "Candelaria", "Carache", "Escuque", "José Felipe Márquez Cañizalez", "Juan Vicente Campos Elías", "La Ceiba", "Miranda", "Monte Carmelo", "Motatán", "Pampanito", "Pampán", "Rafael Rangel", "San Rafael de Carvajal", "Sucre", "Trujillo", "Urdaneta", "Valera"],
  "Táchira":["Andrés Bello", "Antonio Rómulo Costa", "Ayacucho", "Bolívar", "Cárdenas", "Córdoba", "Fernández Feo", "Francisco de Miranda", "García de Hevia", "Guasimos", "Independencia", "Jauregui", "José María Vargas", "Junín", "Libertad", "Libertador", "Lobatera", "Michelena", "Panamericano", "Pedro María Ureña", "Rafael Urdaneta", "Samuel Dario Maldonado", "San Cristóbal", "San Judas Tadeo", "Seboruco", "Simón Rodriguez", "Sucre", "Torbes", "Uribante"],
  "Vargas":["Vargas"],
  "Yaracuy":["Arístides Bastidas", "Bolívar", "Bruzual", "Cocorote", "Independencia", "José Antonio Páez", "La Trinidad", "Manuel Monge", "Nirgua", "Peña", "San Felipe", "Sucre", "Urachiche", "Veroes"],
  "Zulia":["Almirante Padilla", "Baralt", "Cabimas", "Catatumbo", "Colón", "Francisco Javier Pulgar", "Guajira", "Jesús Enrique Lossada", "Jesús María Semprún", "La Cañada de Urdaneta", "Lagunillas", "Machiques de Perijá", "Mara", "Maracaibo", "Miranda", "Rosario de Perijá", "San Francisco", "Santa Rita", "Simón Bolívar", "Sucre", "Valmore Rodríguez"],
};

  const [cart,setCart]=useState({});
  const [cartSuper,setCartSuper]=useState({});
  const [cartRest,setCartRest]=useState({});
  const [cartNegocio,setCartNegocio]=useState({});
  const [cartNegocioId,setCartNegocioId]=useState(null);
  const [cartNegocioNombre,setCartNegocioNombre]=useState("");
  const [cartNegocioWa,setCartNegocioWa]=useState("");
  const [negocioActivo,setNegocioActivo]=useState(null);
  const [deepLinkListo,setDeepLinkListo]=useState(false);
  const [negocioCatFiltro,setNegocioCatFiltro]=useState(null);
  const [allNegocios,setAllNegocios]=useState([]);
  const [allServicios,setAllServicios]=useState([]);
  const [misNegPedidos,setMisNegPedidos]=useState([]);
  const [cartRestId,setCartRestId]=useState(null);
  const [cartRestNombre,setCartRestNombre]=useState("");
  const [cartRestWa,setCartRestWa]=useState("");
  const [restauranteActivo,setRestauranteActivo]=useState(null);
  const [secTab,setSecTab]=useState(null);
  const [misRestPedidos,setMisRestPedidos]=useState([]);
  const [suscripciones,setSuscripciones]=useState([]);
  const [sheet,setSheet]=useState(null);
  const [platoDetalle,setPlatoDetalle]=useState(null);
  const [productoDetalle,setProductoDetalle]=useState(null); // modal tarjeta completa negocios locales
  const [imgZoom,setImgZoom]=useState(null); // legacy - kept for backward compat
  const [lightbox,setLightbox]=useState(null); // {foto, nombre, descripcion, precio, unidad}
  const abrirLightbox=(foto,nombre="",descripcion="",precio=null,unidad="")=>setLightbox({foto,nombre,descripcion,precio,unidad});
  const [zonas,setZonas]=useState([]);
  const [zonaSelId,setZonaSelId]=useState("");
  const [zonaSel,setZonaSel]=useState(null);
  const [addr,setAddr]=useState({calle:"",referencia:""});
  const [form,setForm]=useState({nombre:"",telefono:"",sexo:"",pago:"Pago Móvil",recibirPromos:false});
  const [consentPromo,setConsentPromo]=useState({});
  const [pedidoEnviadoA,setPedidoEnviadoA]=useState(null); // confirmación visual post-envío
  const [numsPedido,setNumsPedido]=useState({}); // {provNombre: numero_siguiente}
  const [filtroPed,setFiltroPed]=useState("hoy");
  const [filtroEstado,setFiltroEstado]=useState("todos");
  const [pedidoExpandido,setPedidoExpandido]=useState(null);
  const [editandoPagos,setEditandoPagos]=useState(false);
  const [pagoData,setPagoData]=useState({pago_movil_banco:"",pago_movil_telefono:"",pago_movil_cedula:"",pago_movil_nombre:"",acepta_efectivo:false,acepta_zelle:false,zelle_cuenta:"",acepta_divisas:false,acepta_binance:false,binance_cuenta:""});
  const [favoritos,setFavoritos]=useState({}); // {proveedor_id: true}
  const [clienteHistorial,setClienteHistorial]=useState([]); // pedidos del cliente
  const [misClientes,setMisClientes]=useState([]); // clientes del proveedor
  const [etaData,setEtaData]=useState({eta_minutos_min:"",eta_minutos_max:"",eta_texto:""});
  const [editandoEta,setEditandoEta]=useState(false);
  const [seccionNegocio,setSeccionNegocio]=useState("perfil");
  const [filtroVentas,setFiltroVentas]=useState("todo");
  const [selSvc,setSelSvc]=useState(null);
  const [svcForm,setSvcForm]=useState({nombre:"",telefono:"",direccion:"",detalle:""});
  const [superProds,setSuperProds]=useState([]);
  const [provProds,setProvProds]=useState([]);
  const [provPromos,setProvPromos]=useState([]);
  const [combos,setCombos]=useState([]);
  const [remates,setRemates]=useState([]);
  const [clasificados,setClasificados]=useState([]);
  const [clasificadoTipo,setClasificadoTipo]=useState("Todos");
  const [clasificadoSeleccionado,setClasificadoSeleccionado]=useState(null);
  const [showPublicarClasificado,setShowPublicarClasificado]=useState(false);
  const [pendClasificados,setPendClasificados]=useState([]);
  const [allClasificadosAdmin,setAllClasificadosAdmin]=useState([]);
  const [allResenasAdmin,setAllResenasAdmin]=useState([]);
  const [clasifAdminFiltro,setClasifAdminFiltro]=useState("pendientes");
  const [editClasif,setEditClasif]=useState(null);
  const [clasificadoGeoFiltro,setClasificadoGeoFiltro]=useState("todo"); // "todo" | "miMunicipio"
  const [clasificadoSearch,setClasificadoSearch]=useState("");
  const [clasificadoSort,setClasificadoSort]=useState("reciente"); // "reciente"|"menor"|"mayor"
  const [newClasificado,setNewClasificado]=useState({
    tipo:"Vehículos",titulo:"",descripcion:"",precio:"",negociable:false,categoria:"Vehículos",
    marca:"",modelo:"",anio:"",kilometraje:"",color:"",transmision:"Manual",combustible:"Gasolina",
    tipo_operacion:"Venta",habitaciones:"",banos:"",metros2:"",sector:"",
    vendedor_nombre:"",vendedor_telefono:"",estado:"",municipio:""
  });
  const [clasifFotos,setClasifFotos]=useState([null,null,null,null]);
  const [clasifFotosPrev,setClasifFotosPrev]=useState([null,null,null,null]);
  const [serviciosCom,setServiciosCom]=useState([]);
  const [categoriaServicio,setCategoriaServicio]=useState(null); // categoria activa en servicios
  const [searchServicios,setSearchServicios]=useState("");
  const [proveedoresServicio,setProveedoresServicio]=useState([]); // proveedores filtrados por categoria
  const [provProductosServicio,setProvProductosServicio]=useState({}); // {provId:[productos]}
  const [rutasTransporte,setRutasTransporte]=useState([]);
  const [misRutas,setMisRutas]=useState([]);
  const [misHabitaciones,setMisHabitaciones]=useState([]);
  const [misTurismo,setMisTurismo]=useState([]);
  const [newRuta,setNewRuta]=useState({origen:"San Fernando",destino:"",hora_salida:"07:00",precio:"",puestos_disponibles:10,dias_operacion:"Lunes a Domingo",acepta_encomiendas:false});
  const [newHabitacion,setNewHabitacion]=useState({nombre:"",descripcion:"",precio_noche:"",capacidad_personas:2,foto_url:""});
  const [newTurismo,setNewTurismo]=useState({nombre:"",descripcion:"",precio:"",capacidad_personas:"",incluye:"",foto_url:""});
  const [showNuevaRuta,setShowNuevaRuta]=useState(false);
  const [showNuevaHab,setShowNuevaHab]=useState(false);
  const [showNuevoTurismo,setShowNuevoTurismo]=useState(false);
  const [contactModal,setContactModal]=useState(null); // {prov, servicio, catId, esRuta, ruta}
  const [contactForm,setContactForm]=useState({nombre:"",telefono:"",fecha:"",personas:"1",puestos:"1",fechaSalida:""}); // rutas interurbanas
  const [proveedorServicioActivo,setProveedorServicioActivo]=useState(null); // proveedor seleccionado
  const [habsProvActivo,setHabsProvActivo]=useState([]); // habitaciones del hotel activo
  const [turismoProvActivo,setTurismoProvActivo]=useState([]); // servicios turismo del proveedor activo
  const [showSolicitudServicio,setShowSolicitudServicio]=useState(false);
  const [solicitudData,setSolicitudData]=useState({descripcion:"",fecha:"",hora:""});
  const [remateCat,setRemateCat]=useState("Todos");
  const [remateSearch,setRemateSearch]=useState("");
  const [showPublicarRemate,setShowPublicarRemate]=useState(false);
  const [showPublicarServicio,setShowPublicarServicio]=useState(false);
  const [newRemate,setNewRemate]=useState({titulo:"",descripcion:"",precio:"",categoria:REMATE_CATS[0],vendedor_nombre:"",vendedor_telefono:"",estado:"",municipio:""});
  const [newServicioCom,setNewServicioCom]=useState({nombre_servicio:"",descripcion:"",categoria:SERVICIO_CATS[0],precio_referencial:"",zona:"",proveedor_nombre:"",proveedor_telefono:"",estado:"",municipio:""});
  const [remateFoto,setRemateFoto]=useState(null);
  const [remateFotoPreview,setRemateFotoPreview]=useState(null);
  const [servComFoto,setServComFoto]=useState(null);
  const [servComFotoPreview,setServComFotoPreview]=useState(null);
  const [pendRemates,setPendRemates]=useState([]);
  const [pendServiciosCom,setPendServiciosCom]=useState([]);
  const [pendHabitaciones,setPendHabitaciones]=useState([]);
  const [pendTurismo,setPendTurismo]=useState([]);
  const [resenaSheet,setResenaSheet]=useState(null);
  const [resena,setResena]=useState({estrellas:0,comentario:"",nombre:"",telefono:""});
  const [resenaMsj,setResenaMsj]=useState("");
  const [pedidoRef,setPedidoRef]=useState("");

  // -- PEDIDOS (NUEVO) --------------------------------------
  const [pedidos,setPedidos]=useState([]);
  const [pedidoFiltro,setPedidoFiltro]=useState("todos");
  // ---------------------------------------------------------

  // provMode ya declarado arriba con localStorage
  const [provForm,setProvForm]=useState({email:"",nombre:"",negocio:"",whatsapp_negocio:"",telefono_principal:"",instagram:"",categorias:[],pass:"",tipo_negocio:"Restaurante / Cocina / Comida",tipo_operacion_gastro:"",descripcion_negocio:"",delivery_propio:false,permite_retiro:false,delivery_costo:0,delivery_gratis_desde:15,direccion_fisica:"",horario_desde:"08:00",horario_hasta:"18:00",horario_desc:"",subcategoria_servicio:"",especialidad:"",matricula_prof:"",precio_consulta:"",horarios_atencion:"",zona_cobertura:"",tarifa_referencial:"",examenes:"",estado_ubicacion:"",municipio:"",_modulo:""});
  const [provData,setProvData]=useState(()=>{
    try{const s=localStorage.getItem("lokl_prov");return s?JSON.parse(s):null;}catch{return null;}
  });
  const [provMode,setProvModeRaw]=useState(()=>{
    try{const s=localStorage.getItem("lokl_prov");return s?"dash":"login";}catch{return "login";}
  });
  const [myProds,setMyProds]=useState([]);
  const [myPromos,setMyPromos]=useState([]);
  const [myVentas,setMyVentas]=useState([]);
  const [pendProds,setPendProds]=useState([]);
  const [pendPromos,setPendPromos]=useState([]);
  const [pendResenas,setPendResenas]=useState([]);
  const [provResenas,setProvResenas]=useState({});
  const [promediosResenas,setPromediosResenas]=useState({}); // {proveedor_id: {avg, count}} // {proveedor_id: [{...resena}]}
  const [provResenasForm,setProvResenasForm]=useState({estrellas:0,comentario:"",nombre:""}); // form nueva reseña proveedor
  const [provResenasMsj,setProvResenasMsj]=useState("");
  const [showProvResenasId,setShowProvResenasId]=useState(null); // proveedor_id cuyas reseñas están abiertas
  const [allZonas,setAllZonas]=useState([]);
  const [allRestaurantes,setAllRestaurantes]=useState([]);
  const [allProveedores,setAllProveedores]=useState([]);
  const [adminVentas,setAdminVentas]=useState([]);
  const [catFilter,setCatFilter]=useState("Todas");
  const [combosAdmin,setCombosAdmin]=useState([]);
  const [rejectMotivo,setRejectMotivo]=useState({});
  const [resetPass,setResetPass]=useState({});
  const [editandoPerfil,setEditandoPerfil]=useState(false);
  const [perfilData,setPerfilData]=useState({});
  const [cambiandoClave,setCambiandoClave]=useState(false);
  const [claveForm,setClaveForm]=useState({actual:"",nueva:"",confirmar:""});

  const [newProd,setNewProd]=useState({nombre:"",descripcion:"",marca:"",presentacion:"",precio:"",unidad:"unidad",categoria:"",stock:1,hi:"08:00",hf:"18:00",permanente:false,es_oferta:false,variantes:"",codigo_ref:""});
  const [editandoHorario,setEditandoHorario]=useState(false);
  const [editandoDelivery,setEditandoDelivery]=useState(false);
  const [deliveryConfig,setDeliveryConfig]=useState({delivery_propio:false,delivery_costo:0,delivery_gratis_desde:15});
  const [horarioNegocio,setHorarioNegocio]=useState({desde:"08:00",hasta:"20:00",descripcion:""});
  const [editingProdId,setEditingProdId]=useState(null);
  const [newPromo,setNewPromo]=useState({nombre:"",descripcion:"",precio:"",fecha_inicio:"",fecha_fin:""});
  const [promoFotoFile,setPromoFotoFile]=useState(null);
  const [promoFotoPreview,setPromoFotoPreview]=useState(null);
  const [logoFile,setLogoFile]=useState(null);
  const [editLogoFile,setEditLogoFile]=useState(null);
  const [editLogoPreview,setEditLogoPreview]=useState(null);
  const [fotoFile,setFotoFile]=useState(null);
  const [fotoFile2,setFotoFile2]=useState(null);
  const [fotoFile3,setFotoFile3]=useState(null);
  const [fotoFile4,setFotoFile4]=useState(null);
  const [logoPreview,setLogoPreview]=useState(null);
  const [fotoPreview,setFotoPreview]=useState(null);
  const [fotoPreview2,setFotoPreview2]=useState(null);
  const [fotoPreview3,setFotoPreview3]=useState(null);
  const [fotoPreview4,setFotoPreview4]=useState(null);
  const [loading,setLoading]=useState(false);
  const [pmsg,setPmsg]=useState("");
  const [provTab,setProvTab]=useState("estado");
  const [adminSec,setAdminSec]=useState("dashboard");
  const [confirmModal,setConfirmModal]=useState(null); // {msg,onOk}
  const [newSP,setNewSP]=useState({nombre:"",marca:"",presentacion:"",descripcion:"",precio:"",unidad:"kg",emoji:"🛒",categoria:SUPER_CATS[0],es_oferta:false});
  const [editingSPId,setEditingSPId]=useState(null);
  const [editSPData,setEditSPData]=useState({});
  const [spFoto,setSpFoto]=useState(null);
  const [spFotoPreview,setSpFotoPreview]=useState(null);
  const [newZona,setNewZona]=useState({municipio:"San Fernando",zona:"",tipo:"barrio",costo_delivery:1.50,delivery_gratis_super:18.00,delivery_gratis_comida:12.00});
  const [superAbierto,setSuperAbierto]=useState(true);
  const [newCombo,setNewCombo]=useState({nombre:"",descripcion:"",precio:"",temporada:"",fecha_inicio:"",fecha_fin:""});
  const [notaSheet,setNotaSheet]=useState(null);
  const [notaTemp,setNotaTemp]=useState("");
  const [prodResenas,setProdResenas]=useState({});

  // ── GEOGRAFÍA ──────────────────────────────────────────────
  const UBI_DEFAULT={estado:"Apure",municipio:"San Fernando"};
  const [ubicacionUsuario,setUbicacionUsuario]=useState(()=>{
    try{const g=typeof window!=="undefined"&&localStorage.getItem("apure_ubicacion");return g?JSON.parse(g):null;}catch{return null;}
  });
  const [showCiudadModal,setShowCiudadModal]=useState(false);
  const [ciudadTemp,setCiudadTemp]=useState({estado:"Apure",municipio:""});
  const [zonasOperacion,setZonasOperacion]=useState([]); // tabla zonas_operacion
  // Municipio activo resuelto (null = primera vez, aún no eligió)
  const ubiActiva=ubicacionUsuario||UBI_DEFAULT;
  const tieneSuper=zonasOperacion.some(z=>z.estado===ubiActiva.estado&&z.municipio===ubiActiva.municipio&&z.tiene_supermercado&&z.activa)
    ||(ubiActiva.municipio==="San Fernando"&&ubiActiva.estado==="Apure"); // San Fernando siempre activo
  // ──────────────────────────────────────────────────────────

  useEffect(()=>{
    loadAll();loadRemates();loadServiciosCom();loadClasificados();loadZonasOperacion();loadPromediosResenas();loadProvResenas("super");
    loadFavoritos();
    // Primera visita: mostrar selector de ciudad
    if(!ubicacionUsuario){
      setTimeout(()=>setShowCiudadModal(true),600);
    }
  },[]);

  // DEEP LINK: si el link trae ?tab=...&id=..., abrir directo esa tienda/producto
  useEffect(()=>{
    if(deepLinkListo)return;
    if(typeof window==="undefined")return;
    const params=new URLSearchParams(window.location.search);
    const tabParam=params.get("tab");
    const idParam=params.get("id");
    if(!tabParam||!idParam)return;
    // Esperar a que los datos estén cargados según el tab
    if(tabParam==="Negocios locales"){
      if(allNegocios.length===0)return;
      const n=allNegocios.find(x=>String(x.id)===String(idParam));
      if(n){
        setTab("Negocios locales");
        setNegocioActivo(n);
        setCartNegocioId(n.id);
        setCartNegocioNombre(n.negocio);
        setCartNegocioWa(n.whatsapp_negocio||n.telefono);
        loadProvResenas(n.id);
        setDeepLinkListo(true);
      }
    } else if(tabParam==="Feria de comida"){
      if(allRestaurantes.length===0)return;
      const r=allRestaurantes.find(x=>String(x.id)===String(idParam));
      if(r){
        setTab("Feria de comida");
        setRestauranteActivo(r);
        setDeepLinkListo(true);
      }
    } else if(tabParam==="Servicios"){
      setTab("Servicios");
      setDeepLinkListo(true);
    } else if(["Mercadito local","Clasificados"].includes(tabParam)){
      setTab(tabParam);
      setDeepLinkListo(true);
    }
  },[allNegocios,allRestaurantes,deepLinkListo]);

  // Cargar historial y favoritos cuando el usuario escribe su teléfono
  useEffect(()=>{
    if(form.telefono&&form.telefono.replace(/\D/g,"").length>=10){
      loadClienteHistorial(form.telefono);
      loadFavoritos(form.telefono);
    }
  },[form.telefono]);

  // Inicializar perfilData cuando se abre Mi Negocio
  useEffect(()=>{
    if(provTab==="mi_negocio"&&provData){
      setPerfilData({
        negocio:provData.negocio||"",
        descripcion_negocio:provData.descripcion_negocio||"",
        whatsapp_negocio:provData.whatsapp_negocio||"",
        telefono_principal:provData.telefono_principal||"",
        instagram:provData.instagram||"",
        tipo_presencia:provData.tipo_presencia||"online",
        estado_ubicacion:provData.estado_ubicacion||"",
        municipio:provData.municipio||"",
        parroquia:provData.parroquia||"",
        direccion_fisica:provData.direccion_fisica||"",
        latitud:provData.latitud||null,
        longitud:provData.longitud||null,
        horario_desde:provData.horario_desde||"08:00",
        horario_hasta:provData.horario_hasta||"18:00",
        horario_desc:provData.horario_desc||"",
        delivery_propio:provData.delivery_propio||false,
        delivery_costo:provData.delivery_costo||0,
        delivery_gratis_desde:provData.delivery_gratis_desde||15,
        permite_retiro:provData.permite_retiro||false,
      });
    }
  },[provTab]);

  // Redirigir sheets legacy al carrito unificado
  useEffect(()=>{
    if(["cart","cartRest","cartNegocio","checkout"].includes(sheet)){
      setSheet("cartGlobal");
    }
  },[sheet]);

  useEffect(()=>{
    const interval=setInterval(()=>{
      loadAll();loadRemates();loadServiciosCom();loadClasificados();
      if(provData){
        loadMyProds(provData.id);
        loadMyPromos(provData.id);
        loadMisRestPedidos(provData.id,provData.negocio);
      }
      if(provMode==="admin"){loadAdmin();loadPedidos();}
    },15000);
    return ()=>clearInterval(interval);
  },[provData,provMode]);

  // Re-cargar cuando cambia la ubicación
  useEffect(()=>{
    if(ubicacionUsuario){
      localStorage.setItem("apure_ubicacion",JSON.stringify(ubicacionUsuario));
      loadAll();
    }
  },[ubicacionUsuario]);

  const loadZonasOperacion=async()=>{
    // Intentar cargar desde tabla zonas_operacion (puede no existir aún)
    try{
      const{data}=await supabase.from("zonas_operacion").select("*").eq("activa",true);
      if(data)setZonasOperacion(data);
    }catch{/* tabla aún no existe, San Fernando siempre activo por defecto */}
  };

  const loadAll=async()=>{
    supabase.from("configuracion").select("valor").eq("clave","super_abierto").single().then(({data})=>{if(data)setSuperAbierto(data.valor==="true");});
    const hoy=new Date().toISOString().split("T")[0];
    const ubi=JSON.parse(typeof window!=="undefined"&&localStorage.getItem("apure_ubicacion")||"null")||UBI_DEFAULT;
    const muni=ubi.municipio;
    const [z,sp,pp,pr,cb]=await Promise.all([
      supabase.from("zonas_delivery").select("*").eq("activa",true).order("municipio"),
      supabase.from("productos_supermercado").select("*").eq("disponible",true).eq("municipio",muni).order("categoria"),
      supabase.from("productos_proveedor").select("*,proveedores(negocio,logo_url,en_pausa,activo,horario_desde,horario_hasta,horario_desc,whatsapp_negocio,telefono,suscripcion_activa,delivery_propio,delivery_costo,delivery_gratis_desde,tipo_negocio,instagram,descripcion_negocio,eta_minutos_min,eta_minutos_max,eta_texto,permite_retiro,municipio,estado_ubicacion)").eq("aprobado",true).eq("disponible",true).eq("rechazado",false),
      supabase.from("promociones_proveedor").select("*,proveedores(negocio,logo_url,en_pausa,activo,horario_desde,horario_hasta,horario_desc,whatsapp_negocio,telefono,delivery_propio,delivery_costo,delivery_gratis_desde,permite_retiro,tipo_operacion_gastro,municipio,estado_ubicacion)").eq("aprobada",true).eq("activa",true),
      supabase.from("combos").select("*").eq("activa",true),
    ]);
    if(z.data)setZonas(z.data);
    if(sp.data)setSuperProds(sp.data);
    if(pp.data)setProvProds(pp.data.filter(p=>{
      const pMuni=p.proveedores?.municipio||"San Fernando";
      return pMuni===muni&&!p.proveedores?.en_pausa&&p.proveedores?.suscripcion_activa!==false&&(p.permanente||(p.fecha===hoy&&p.stock>0));
    }));
    if(pr.data)setProvPromos(pr.data.filter(p=>{
      const pMuni=p.proveedores?.municipio||"San Fernando";
      return pMuni===muni&&!p.proveedores?.en_pausa&&p.proveedores?.activo!==false;
    }));
    if(cb.data)setCombos(cb.data);
    // Cargar proveedores filtrados por municipio
    const{data:restList}=await supabase.from("proveedores").select("id,negocio,logo_url,activo,en_pausa,forzar_abierto,horario_desde,horario_hasta,horario_desc,telefono,whatsapp_negocio,suscripcion_activa,tipo_negocio,descripcion_negocio,delivery_propio,delivery_costo,delivery_gratis_desde,categorias,direccion_fisica,tipo_presencia,estado_ubicacion,municipio,parroquia,latitud,longitud,eta_minutos_min,eta_minutos_max,eta_texto,permite_retiro").eq("aprobado",true).eq("suscripcion_activa",true).order("negocio");
    if(restList){
      // Filtrar por municipio — si proveedor no tiene municipio asignado, se asume San Fernando
      const delMuni=restList.filter(r=>(r.municipio||"San Fernando")===muni);
      setAllRestaurantes(delMuni.filter(r=>r.tipo_negocio==="Restaurante / Cocina / Comida"||!r.tipo_negocio));
      setAllNegocios(delMuni.filter(r=>r.tipo_negocio==="Tienda / Negocio local"));
      // Servicios: todo lo que NO es restaurante ni tienda (para la búsqueda general)
      setAllServicios(delMuni.filter(r=>r.tipo_negocio&&r.tipo_negocio!=="Restaurante / Cocina / Comida"&&r.tipo_negocio!=="Tienda / Negocio local"));
    }
  };

  const loadPromediosResenas=async()=>{
    const{data}=await supabase.from("resenas").select("proveedor_id,estrellas").eq("aprobada",true).not("proveedor_id","is",null);
    if(!data||data.length===0)return;
    const mapa={};
    data.forEach(r=>{
      if(!r.proveedor_id)return;
      if(!mapa[r.proveedor_id])mapa[r.proveedor_id]={sum:0,count:0};
      mapa[r.proveedor_id].sum+=r.estrellas;
      mapa[r.proveedor_id].count+=1;
    });
    const promedios={};
    Object.keys(mapa).forEach(k=>{promedios[k]={avg:(mapa[k].sum/mapa[k].count).toFixed(1),count:mapa[k].count};});
    setPromediosResenas(promedios);
  };

  const loadMisNegPedidos=async(pid)=>{
    const{data}=await supabase.from("pedidos").select("*").eq("proveedor_id",pid).order("created_at",{ascending:false}).limit(100);
    if(data)setMisNegPedidos(data);
  };

  const loadMisRestPedidos=async(pid,nombre)=>{
    // Solo buscar por proveedor_nombre (más confiable)
    const queries=[supabase.from("pedidos").select("*").eq("proveedor_nombre",nombre||"").order("created_at",{ascending:false}).limit(100)];
    // Solo agregar búsqueda por id si pid existe y no es null
    if(pid)queries.push(supabase.from("pedidos").select("*").eq("proveedor_id",pid).order("created_at",{ascending:false}).limit(100));
    const results=await Promise.all(queries);
    const todos=results.flatMap(r=>r.data||[]);
    const unique=Object.values(todos.reduce((acc,p)=>({...acc,[p.id]:p}),{}));
    unique.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    setMisRestPedidos(unique);
  };

  const loadSuscripciones=async()=>{
    const{data}=await supabase.from("proveedores").select("id,negocio,usuario,telefono,logo_url,suscripcion_activa,suscripcion_vence,suscripcion_pagada,meses_gratis_restantes,activo,en_pausa,tipo_negocio").eq("aprobado",true).order("negocio");
    if(data)setSuscripciones(data);
  };

  const guardarPedidoRestaurante=async(restId,restItems,restSub,restDel,restTotal,restRef,aceptaPromo,provNombre)=>{
    const{error:errPed}=await supabase.from("pedidos").insert({
      ref:restRef,
      proveedor_id:restId||null,
      proveedor_nombre:provNombre||"",
      cliente_nombre:form.nombre,
      cliente_telefono:form.telefono,
      cliente_direccion:[zonaSel?.zona,addr.calle,addr.referencia].filter(Boolean).join(", "),
      zona:zonaSel?.zona||"",
      metodo_pago:"WhatsApp",
      items:restItems.map(i=>({nombre:i.name,precio:i.price,qty:i.qty,nota:i.nota||null,isPromo:i.isPromo||false,dbId:i.dbId||null})),
      subtotal:parseFloat(restSub.toFixed(2)),
      delivery:parseFloat(restDel.toFixed(2)),
      total:parseFloat(restTotal.toFixed(2)),
      estado:"nuevo",
    });
    if(errPed)console.error("Error guardando pedido:",errPed.message);
    // Guardar suscripción a promos si el cliente aceptó, solo para este proveedor
    if(aceptaPromo&&form.telefono&&form.nombre&&restId){
      const{data:existe}=await supabase.from("suscriptores_promo")
        .select("id").eq("proveedor_id",restId).eq("cliente_telefono",form.telefono).single();
      if(!existe){
        await supabase.from("suscriptores_promo").insert({
          proveedor_id:restId,
          proveedor_nombre:provNombre||"",
          cliente_nombre:form.nombre,
          cliente_telefono:form.telefono,
          zona:zonaSel?.zona||"",
          acepta_promos:true,
          ultimo_pedido:new Date().toISOString(),
        });
      } else {
        await supabase.from("suscriptores_promo")
          .update({acepta_promos:true,ultimo_pedido:new Date().toISOString(),cliente_nombre:form.nombre})
          .eq("proveedor_id",restId).eq("cliente_telefono",form.telefono);
      }
    }
  };

  const buildNegocioWaMsg=(negNombre,negItems,negSub,negDel,negTotal,negRef)=>{
    const lineas=negItems.map(i=>`  - ${i.name} x${i.qty} - $${(i.price*i.qty).toFixed(2)}`).join("\n");
    return `\u{1F6CD}\u{FE0F} *Nuevo pedido - ${APP_NAME}*\n\u{1F4CB} Ref: ${negRef}\n----------------------------\n${lineas}\n----------------------------\nSubtotal: $${negSub.toFixed(2)}\nDelivery: ${negDel===0?"GRATIS":"$"+negDel.toFixed(2)}\n*TOTAL: $${negTotal.toFixed(2)}*\n----------------------------\n\u{1F464} ${form.nombre}\n\u{1F4F1} ${form.telefono}\n\u{1F4CD} ${zonaSel?.zona||""}, ${addr.calle}\n`;
  };

  const buildRestWaMsg=(restNombre,restItems,restTotal,del,clienteNombre,clienteTel,clienteDir)=>{
    const promos=restItems.filter(i=>i.isPromo);
    const platos=restItems.filter(i=>!i.isPromo);
    const lineasPromo=promos.map(i=>`\u{1F525} Promo: ${i.name} x${i.qty||1}\n• Cantidad: ${i.qty||1}\n• Precio unitario: $${i.price.toFixed(2)}\n• Subtotal: $${(i.price*(i.qty||1)).toFixed(2)}`).join("\n\n");
    const lineasPlato=platos.map(i=>`\u{1F354} ${i.name}\n• Cantidad: ${i.qty}\n• Precio: $${i.price.toFixed(2)}${i.nota?"\n• Nota: "+i.nota:""}`).join("\n\n");
    const lineas=[lineasPromo,lineasPlato].filter(Boolean).join("\n\n");
    const delLinea=del===0?"\u{1F69A} Delivery: Gratis \u{1F389}":`\u{1F69A} Delivery: $${del.toFixed(2)}`;
    const clienteBloque=`\u{1F464} *Datos del cliente:*\nNombre: ${clienteNombre||"No indicado"}\nTeléfono: ${clienteTel||"No indicado"}${clienteDir?`\nDirección: ${clienteDir}`:""}`;
    return `\u{1F44B} Hola, quiero realizar un pedido:\n\n\u{1F3EA} *${restNombre}*\n\n${clienteBloque}\n\n\u{1F6CD}\u{FE0F} *Mi pedido:*\n\n${lineas}\n\n${delLinea}\n\n\u{1F4B5} *Total estimado:* $${restTotal.toFixed(2)}\n\n\u{1F4DE} Quedo atento(a) para confirmar disponibilidad, tiempo de entrega y método de pago.\nGracias.`;
  };
  const getModalidad=(prov)=>{
    if(prov?.delivery_propio&&prov?.permite_retiro)return"Delivery disponible";
    if(prov?.delivery_propio)return"Solo delivery";
    if(prov?.permite_retiro)return"Retiro en local";
    return"Solo delivery";
  };
  // Mensaje unificado para cualquier proveedor del carrito global
  const buildGlobalWaMsg=(provNombre,items,total,del,numPedido,clienteNombre,clienteTel,clienteDir)=>{
    const promos=items.filter(i=>i.isPromo);
    const platos=items.filter(i=>!i.isPromo);
    // Recalcular subtotal internamente para garantizar exactitud
    const subReal=items.reduce((a,i)=>a+i.price*i.qty,0);
    const totalReal=subReal+del;
    // del === -1 significa "a consultar con el proveedor"
    const aConsultar=del===-1;
    const totalRealFinal=aConsultar?subReal:totalReal;
    const lineasPromo=promos.map(i=>`\u{1F525} Promo: ${i.name} x${i.qty||1}\n   • Cantidad: ${i.qty||1}\n   • Precio unitario: $${i.price.toFixed(2)}\n   • Subtotal: $${(i.price*(i.qty||1)).toFixed(2)}`).join("\n\n");
    const lineasPlato=platos.map(i=>`\u{1F6CD}\u{FE0F} ${i.name}\n   • Cantidad: ${i.qty}\n   • Precio unitario: $${i.price.toFixed(2)}\n   • Subtotal: $${(i.price*i.qty).toFixed(2)}${i.variante?"\n   • Variante: "+i.variante:""}${i.nota?"\n   • Nota: "+i.nota:""}`).join("\n\n");
    const lineas=[lineasPromo,lineasPlato].filter(Boolean).join("\n\n");
    const delLinea=aConsultar?"\u{1F69A} Delivery: a consultar seg\u00fan su zona":(del===0?"\u{1F69A} Delivery: Gratis \u{1F389}":`\u{1F69A} Delivery: $${del.toFixed(2)}`);
    const totalLinea=aConsultar?`\u{1F4B5} *Subtotal: $${totalRealFinal.toFixed(2)}* _(+ delivery a consultar)_`:`\u{1F4B5} *Total estimado: $${totalRealFinal.toFixed(2)}*`;
    return `\u{1F9FE} *Pedido N° ${String(numPedido).padStart(3,"0")}*\n\n\u{1F44B} Hola, quiero realizar un pedido:\n\n\u{1F3EA} *${provNombre}*\n\n\u{1F464} *Datos del cliente:*\nNombre: ${clienteNombre||"No indicado"}\nTeléfono: ${clienteTel||"No indicado"}${clienteDir?"\nDirección: "+clienteDir:""}\n\n\u{1F6D2} *Mi pedido:*\n\n${lineas}\n\n${delLinea}\n\n${totalLinea}\n\n\u{1F4DE} Quedo atento(a) para confirmar disponibilidad, tiempo de entrega y método de pago.\nGracias.`;
  };

  const parseCsvRow=(row)=>{
    const cols=[];let cur="",inQ=false;
    for(let i=0;i<row.length;i++){
      if(row[i]==='"'){inQ=!inQ;}
      else if(row[i]===','&&!inQ){cols.push(cur.trim());cur="";}
      else cur+=row[i];
    }
    cols.push(cur.trim());
    return cols;
  };

  const processBulkCsv=(text)=>{
    const lines=text.split("\n").filter(l=>l.trim());
    if(lines.length<2){setBulkMsg("El archivo está vacío");return;}
    const header=parseCsvRow(lines[0]).map(h=>h.toLowerCase().replace(/[^a-z]/g,''));
    const rows=lines.slice(1).map(l=>parseCsvRow(l));
    const products=rows.map(r=>{
      const obj={};
      header.forEach((h,i)=>{obj[h]=r[i]||"";});
      return{
        nombre:obj.nombre||obj.name||"",
        descripcion:obj.descripcion||obj.description||"",
        precio:parseFloat(obj.precio||obj.price||0),
        unidad:obj.unidad||obj.unit||"unidad",
        categoria:obj.categoria||obj.category||"Supermercado",
        super_cat:obj.supercategoria||obj.supcat||obj.subcategoria||"",
        marca:obj.marca||obj.brand||"",
        stock:parseInt(obj.stock||10),
        foto_url:obj.foto||obj.fotourl||obj.foto_url||null,
        disponible:true,aprobado:true,rechazado:false,permanente:true,
        proveedor_id:null,
        es_super:true,
      };
    }).filter(p=>p.nombre&&p.precio>0);
    setBulkData(products);
    setBulkMsg(`✅ ${products.length} productos listos para importar`);
  };

  const importBulkProducts=async()=>{
    if(bulkData.length===0)return;
    setBulkLoading(true);
    let ok=0,err=0;
    for(const p of bulkData){
      const{error}=await supabase.from("productos_supermercado").insert({
        nombre:p.nombre,descripcion:p.descripcion||null,
        precio:p.precio,unidad:p.unidad,
        categoria:p.super_cat||p.categoria,
        marca:p.marca||null,stock:p.stock,
        disponible:true,
      });
      if(error)err++;else ok++;
    }
    setBulkLoading(false);
    setBulkMsg(`✅ ${ok} productos importados${err>0?` · ${err} errores`:""}`);
    setBulkData([]);
    setShowBulkImport(false);
    loadAll();
  };

  const loadClasificados=async()=>{
    const hoy=new Date().toISOString().split("T")[0];const{data}=await supabase.from("clasificados").select("*").eq("aprobado",true).eq("vendido",false).gte("fecha_caducidad",hoy).order("created_at",{ascending:false});
    if(data)setClasificados(data);
  };

  const publishClasificado=async()=>{
    const c=newClasificado;
    if(!c.titulo||!c.precio||!c.vendedor_nombre||!c.vendedor_telefono)return setPmsg("Completa los campos obligatorios");
    setLoading(true);
    const fotos=[];
    for(let i=0;i<4;i++){
      if(clasifFotos[i]){
        const url=await upload(clasifFotos[i],"productos",`clasif_${Date.now()}_${i}`);
        fotos.push(url);
      } else fotos.push(null);
    }
    const{error}=await supabase.from("clasificados").insert({
      tipo:c.tipo,titulo:c.titulo,descripcion:c.descripcion||null,
      precio:parseFloat(c.precio),negociable:c.negociable,categoria:c.tipo,
      marca:c.marca||null,modelo:c.modelo||null,
      anio:c.anio?parseInt(c.anio):null,kilometraje:c.kilometraje||null,
      color:c.color||null,transmision:c.transmision||null,combustible:c.combustible||null,
      tipo_operacion:c.tipo_operacion||null,habitaciones:c.habitaciones?parseInt(c.habitaciones):null,
      banos:c.banos?parseInt(c.banos):null,metros2:c.metros2||null,sector:c.sector||null,
      foto1_url:fotos[0],foto2_url:fotos[1],foto3_url:fotos[2],foto4_url:fotos[3],
      vendedor_nombre:c.vendedor_nombre,vendedor_telefono:c.vendedor_telefono,
      estado:c.estado||ubiActiva.estado||"Apure",
      municipio:c.municipio||ubiActiva.municipio||"San Fernando",
      aprobado:false,vendido:false,
      fecha_caducidad:new Date(Date.now()+30*24*60*60*1000).toISOString().split("T")[0],
    });
    setLoading(false);
    if(error){setPmsg("Error: "+error.message);return;}
    setPmsg("✅ Tu publicación fue enviada. El admin la revisará antes de publicarla.");
    setNewClasificado({tipo:"Vehículos",titulo:"",descripcion:"",precio:"",negociable:false,categoria:"Vehículos",marca:"",modelo:"",anio:"",kilometraje:"",color:"",transmision:"Manual",combustible:"Gasolina",tipo_operacion:"Venta",habitaciones:"",banos:"",metros2:"",sector:"",vendedor_nombre:"",vendedor_telefono:""});
    setClasifFotos([null,null,null,null]);setClasifFotosPrev([null,null,null,null]);
    setShowPublicarClasificado(false);
  };

  const loadRemates=async()=>{
    const{data}=await supabase.from("remates").select("*").eq("aprobado",true).eq("vendido",false).order("created_at",{ascending:false});
    if(data)setRemates(data);
  };

  const loadServiciosCom=async()=>{
    const{data}=await supabase.from("servicios_comunidad").select("*").eq("aprobado",true).eq("activo",true).order("created_at",{ascending:false});
    if(data)setServiciosCom(data);
  };

  const loadProveedoresServicio=async(subcategoria)=>{
    // Buscar proveedores cuyo tipo_negocio sea de servicios y subcategoria_servicio coincida
    // También buscar por tipo_negocio legacy
    const mapaTipoNegocio={
      "mototaxi":["Mototaxi"],
      "taxi":["Taxi"],
      "rutas":["Transporte interurbano (rutas)","Transporte y encomiendas"],
      "encomiendas":["Encomiendas y mudanzas","Transporte y encomiendas"],
      "medicos":["Médico / Consultorio"],
      "enfermeria":["Enfermería a domicilio"],
      "laboratorios":["Laboratorio clínico"],
      "odontologia":["Odontología"],
      "belleza":["Peluquería / Barbería","Manicure / Pedicure","Maquillaje y estética","Lavandería"],
      "hogar":["Plomería","Electricidad","Pintura y construcción","Limpieza del hogar","Carpintería / Herrería"],
      "educacion":["Clases y tutorías","Idiomas"],
      "mecanica":["Mecánica automotriz","Electricidad automotriz"],
      "hoteles":["Hotel","Posada","Hospedaje","Hotel / Posada"],
      "turismo":["Finca turística","Tour operador","Campamento","Turismo y aventura","Campamento / Aventura"],
    };
    const municipio=ubiActiva.municipio||"San Fernando";
    // Buscar por subcategoria_servicio primero
    const{data:bySub}=await supabase.from("proveedores")
      .select("*")
      .eq("aprobado",true)
      .eq("suscripcion_activa",true)
      .eq("subcategoria_servicio",subcategoria)
      .eq("municipio",municipio);
    // Buscar también por tipo_negocio para los existentes
    const tipos=mapaTipoNegocio[subcategoria]||[];
    let byTipo=[];
    if(tipos.length>0){
      const{data:d}=await supabase.from("proveedores")
        .select("*")
        .eq("aprobado",true)
        .eq("suscripcion_activa",true)
        .eq("en_pausa",false)
        .eq("municipio",municipio)
        .in("tipo_negocio",tipos);
      byTipo=d||[];
    }
    const todos=[...(bySub||[]),...byTipo];
    const unique=Object.values(todos.reduce((acc,p)=>({...acc,[p.id]:p}),{}));
    setProveedoresServicio(unique);
    // Cargar productos/servicios de cada proveedor
    if(unique.length>0){
      const ids=unique.map(p=>p.id);
      const{data:prods}=await supabase.from("productos_proveedor").select("id,proveedor_id,nombre,descripcion,precio,categoria,disponible,foto_url,foto_url_2,foto_url_3,foto_url_4,variantes").in("proveedor_id",ids).eq("aprobado",true).eq("disponible",true).eq("rechazado",false);
      if(prods){
        const mapa={};
        prods.forEach(p=>{if(!mapa[p.proveedor_id])mapa[p.proveedor_id]=[];mapa[p.proveedor_id].push(p);});
        setProvProductosServicio(mapa);
      }
    }
  };

  const loadMisRutas=async(pid)=>{
    const{data}=await supabase.from("rutas_transporte").select("*").eq("proveedor_id",pid).order("hora_salida");
    if(data)setMisRutas(data);
  };
  const loadMisHabitaciones=async(pid)=>{
    const{data}=await supabase.from("habitaciones_hotel").select("*").eq("proveedor_id",pid).order("created_at");
    if(data)setMisHabitaciones(data);
  };
  const loadMisTurismo=async(pid)=>{
    const{data}=await supabase.from("servicios_turismo").select("*").eq("proveedor_id",pid).order("created_at");
    if(data)setMisTurismo(data);
  };
  const loadRutasTransporte=async()=>{
    const{data}=await supabase.from("rutas_transporte").select("*,proveedores(negocio,logo_url,whatsapp_negocio,telefono,disponible_ahora)").eq("activa",true).order("hora_salida");
    if(data)setRutasTransporte(data);
  };

  const publishRemate=async()=>{
    if(!newRemate.titulo||!newRemate.precio||!newRemate.vendedor_nombre||!newRemate.vendedor_telefono)return setPmsg("Completa todos los campos obligatorios");
    setLoading(true);
    let foto_url=null;
    if(remateFoto)foto_url=await upload(remateFoto,"productos",`remate_${Date.now()}`);
    const{error}=await supabase.from("remates").insert({...newRemate,precio:parseFloat(newRemate.precio),foto_url,aprobado:false,vendido:false,vendedor_whatsapp:newRemate.vendedor_telefono,estado:newRemate.estado||ubiActiva.estado||"Apure",municipio:newRemate.municipio||ubiActiva.municipio||"San Fernando"});
    setLoading(false);
    if(error){setPmsg("Error: "+error.message);return;}
    setPmsg("✅ Tu artículo fue enviado. El admin lo revisará antes de publicarlo.");
    setNewRemate({titulo:"",descripcion:"",precio:"",categoria:REMATE_CATS[0],vendedor_nombre:"",vendedor_telefono:""});
    setRemateFoto(null);setRemateFotoPreview(null);
    setShowPublicarRemate(false);
  };

  const publishServicioCom=async()=>{
    if(!newServicioCom.nombre_servicio||!newServicioCom.descripcion||!newServicioCom.proveedor_nombre||!newServicioCom.proveedor_telefono)return setPmsg("Completa todos los campos obligatorios");
    setLoading(true);
    let foto_url=null;
    if(servComFoto)foto_url=await upload(servComFoto,"productos",`serv_${Date.now()}`);
    const{error}=await supabase.from("servicios_comunidad").insert({...newServicioCom,foto_url,aprobado:false,activo:true,estado:newServicioCom.estado||ubiActiva.estado||"Apure",municipio:newServicioCom.municipio||ubiActiva.municipio||"San Fernando"});
    setLoading(false);
    if(error){setPmsg("Error: "+error.message);return;}
    setPmsg("✅ Tu servicio fue enviado. El admin lo revisará antes de publicarlo.");
    setNewServicioCom({nombre_servicio:"",descripcion:"",categoria:SERVICIO_CATS[0],precio_referencial:"",zona:"",proveedor_nombre:"",proveedor_telefono:""});
    setServComFoto(null);setServComFotoPreview(null);
    setShowPublicarServicio(false);
  };

  // -- FUNCIONES DE PEDIDOS (NUEVO) -------------------------
  const loadPedidos=async()=>{
    const{data}=await supabase
      .from("pedidos")
      .select("*")
      .order("created_at",{ascending:false})
      .limit(200);
    if(data)setPedidos(data);
  };

  const actualizarEstadoPedido=async(id,nuevoEstado)=>{
    await supabase
      .from("pedidos")
      .update({estado:nuevoEstado,updated_at:new Date().toISOString()})
      .eq("id",id);
    loadPedidos();
  };

  const guardarPedidoEnDB=async()=>{
    const itemsParaGuardar=items.map(i=>({
      id:i.id,
      nombre:i.name,
      precio:i.price,
      qty:i.qty,
      kitchen:i.kitchen||null,
      nota:i.nota||null,
      categoria:i.cat,
    }));
    const margenTotal=items.reduce((a,i)=>{
      const margen=i.cat==="Supermercado"?0.10:0;
      return a+(i.price*i.qty*margen);
    },0);
    const{error}=await supabase.from("pedidos").insert({
      ref:pedidoRef,
      cliente_nombre:form.nombre,
      cliente_telefono:form.telefono,
      cliente_direccion:`${zonaSel?.zona||""}, ${addr.calle} ${addr.referencia}`.trim(),
      zona:zonaSel?.zona||"",
      zona_id:zonaSelId||null,
      metodo_pago:form.pago,
      items:itemsParaGuardar,
      subtotal:parseFloat(sub.toFixed(2)),
      delivery:parseFloat(del.toFixed(2)),
      total:parseFloat(total.toFixed(2)),
      ganancia:parseFloat(margenTotal.toFixed(2)),
      estado:"nuevo",
    });
    if(error)console.error("Error guardando pedido:",error.message);
  };

  // Guardar pedido del supermercado desde cartGlobal (recibe datos como parámetros)
  const guardarPedidoSuperDB=async(superItems,subVal,delVal,totalVal,refVal)=>{
    const itemsParaGuardar=superItems.map(i=>({
      id:i.id,
      nombre:i.name,
      precio:i.price,
      qty:i.qty,
      nota:i.nota||null,
      categoria:"Supermercado",
    }));
    const margenTotal=superItems.reduce((a,i)=>a+(i.price*i.qty*0.10),0);
    const payload={
      ref:refVal,
      proveedor_nombre:"Supermercado",
      cliente_nombre:form.nombre,
      cliente_telefono:form.telefono,
      cliente_direccion:[zonaSel?.zona,addr.calle,addr.referencia].filter(Boolean).join(", "),
      zona:zonaSel?.zona||"",
      zona_id:zonaSelId||null,
      metodo_pago:form.pago||"WhatsApp",
      items:itemsParaGuardar,
      subtotal:parseFloat(subVal.toFixed(2)),
      delivery:parseFloat(delVal.toFixed(2)),
      total:parseFloat(totalVal.toFixed(2)),
      ganancia:parseFloat(margenTotal.toFixed(2)),
      estado:"nuevo",
    };
    const{error}=await supabase.from("pedidos").insert(payload);
    if(error){
      console.error("Error guardando pedido supermercado:",error.message);
      setPmsg("⚠️ Error al registrar el pedido. Intenta de nuevo.");
    }
  };
  // ---------------------------------------------------------

  const allProds=[
    ...superProds.map(p=>({id:`sp_${p.id}`,name:p.nombre,cat:"Supermercado",superCat:p.categoria,price:p.precio,unit:p.unidad,emoji:p.emoji||"🛒",margin:0.10,foto:p.foto_url,marca:p.marca,presentacion:p.presentacion,descripcion:p.descripcion,abierto:true})),
    ...provProds.map(p=>({id:`pv_${p.id}`,name:p.nombre,cat:p.categoria,tipoNegocioProv:p.proveedores?.tipo_negocio,provId:p.proveedor_id,price:p.precio,unit:p.unidad,emoji:"🍽️",margin:0,kitchen:p.proveedores?.negocio,kitchenWa:p.proveedores?.whatsapp_negocio||p.proveedores?.telefono,kitchenDelivery:p.proveedores?.delivery_propio,kitchenDeliveryCosto:p.proveedores?.delivery_costo||0,kitchenDeliveryGratis:p.proveedores?.delivery_gratis_desde||15,kitchenRetiro:p.proveedores?.permite_retiro,kitchenTipo:p.proveedores?.tipo_operacion_gastro,kitchenEta:p.proveedores?.eta_texto||(p.proveedores?.eta_minutos_min&&p.proveedores?.eta_minutos_max?`${p.proveedores.eta_minutos_min}–${p.proveedores.eta_minutos_max} min`:null),logo:p.proveedores?.logo_url,foto:p.foto_url,foto2:p.foto_url_2,foto3:p.foto_url_3,foto4:p.foto_url_4,marca:p.marca,presentacion:p.presentacion,descripcion:p.descripcion,stock:p.stock,horario:p.permanente?"Siempre disponible":`${p.horario_inicio}–${p.horario_fin}`,tag:p.stock<=3?`Solo ${p.stock} disp.`:null,dbId:p.id,abierto:p.proveedores?.activo!==false&&!p.proveedores?.en_pausa,horarioNeg:p.proveedores?.horario_desde&&p.proveedores?.horario_hasta?`${p.proveedores.horario_desde}–${p.proveedores.horario_hasta}${p.proveedores.horario_desc?" ("+p.proveedores.horario_desc+")":""}`:null,variantes:p.variantes||null})),
    ...provPromos.map(pr=>({id:`promo_${pr.id}`,name:pr.nombre,cat:"Comida preparada",price:pr.precio,unit:"promo",emoji:"🎁",margin:0,kitchen:pr.proveedores?.negocio,kitchenWa:pr.proveedores?.whatsapp_negocio||pr.proveedores?.telefono,kitchenDelivery:pr.proveedores?.delivery_propio,kitchenDeliveryCosto:pr.proveedores?.delivery_costo||0,kitchenDeliveryGratis:pr.proveedores?.delivery_gratis_desde||15,kitchenRetiro:pr.proveedores?.permite_retiro,kitchenTipo:pr.proveedores?.tipo_operacion_gastro,logo:pr.proveedores?.logo_url,foto:pr.foto_url,descripcion:pr.descripcion,isPromo:true,tag:"🔥 PROMO",horario:`Hasta ${pr.fecha_fin}`,abierto:pr.proveedores?.activo!==false&&!pr.proveedores?.en_pausa,horarioNeg:pr.proveedores?.horario_desde&&pr.proveedores?.horario_hasta?`${pr.proveedores.horario_desde}–${pr.proveedores.horario_hasta}${pr.proveedores.horario_desc?" ("+pr.proveedores.horario_desc+")":""}`:null})),
  ];

  const allProdsConMargen=allProds.map(p=>({...p,priceOriginal:p.price}));

  const filteredProds=allProdsConMargen.filter(p=>{
    const matchCat=cat==="Todo"||(cat==="Supermercado"?p.cat==="Supermercado":p.cat===cat);
    const matchSearch=p.name.toLowerCase().includes(search.toLowerCase());
    const matchSuperCat=cat!=="Supermercado"||superCat==="Todas"||p.superCat===superCat;
    return matchCat&&matchSearch&&matchSuperCat;
  });
  const superGroups=SUPER_CATS.filter(sc=>superCat==="Todas"||superCat===sc).map(sc=>({cat:sc,items:allProdsConMargen.filter(p=>p.cat==="Supermercado"&&p.superCat===sc&&p.name.toLowerCase().includes(search.toLowerCase()))})).filter(g=>g.items.length>0);
  const provGroups=PROV_CATS.filter(c=>cat==="Todo"||cat===c).map(c=>({cat:c,items:filteredProds.filter(p=>p.cat===c)})).filter(g=>g.items.length>0);

  const add=(p)=>{
    const stockMax=p.stock||999;
    const actual=cart[p.id]?.qty||0;
    if(actual>=stockMax){alert(`Solo hay ${stockMax} unidades disponibles`);return;}
    setCart(c=>({...c,[p.id]:{...p,qty:actual+1,nota:c[p.id]?.nota||""}}));
  };
  const rem=(id)=>setCart(c=>{const n={...c};n[id].qty>1?n[id]={...n[id],qty:n[id].qty-1}:delete n[id];return n;});
  const items=Object.values(cart);
  const count=items.reduce((a,i)=>a+i.qty,0);
  const sub=items.reduce((a,i)=>a+i.price*i.qty,0);
  const delCost=zonaSel?.costo_delivery||1.00;
  const esCascoCentral=zonaSel?.tipo==="casco"||zonaSel?.zona==="Casco Central";

  const superItems=items.filter(i=>i.cat==="Supermercado");
  const foodItems=items.filter(i=>i.cat!=="Supermercado");
  const superSub=superItems.reduce((a,i)=>a+i.price*i.qty,0);
  const foodSub=foodItems.reduce((a,i)=>a+i.price*i.qty,0);

  const freeMinSuper=zonaSel?.delivery_gratis_super??15;
  const freeMinFood=zonaSel?.delivery_gratis_comida??10;
  const freeMin=Math.min(freeMinSuper,freeMinFood);

  const calcDel=(secItems,secSub,freeMin)=>{
    if(secItems.length===0)return 0;
    if(esCascoCentral)return secSub>=freeMin?0:delCost;
    return secSub>=freeMin?Math.max(0,delCost-1):delCost;
  };

  const delSuper=calcDel(superItems,superSub,freeMinSuper);
  const delFood=calcDel(foodItems,foodSub,freeMinFood);
  const del=delSuper+delFood;
  const total=sub+del;

  const hasSuperOnly=items.length>0&&foodItems.length===0;
  const hasFoodOnly=items.length>0&&superItems.length===0;
  const pct=hasSuperOnly?(superSub/freeMinSuper)*100:(foodSub/freeMinFood)*100;

  const generarRef=()=>`PED-${Date.now().toString().slice(-5)}`;

  const precioConMargen=(p)=>{
    return p.price;
  };

  const saveCliente=async()=>{
    if(!form.telefono||!form.nombre)return;
    const{data:ex}=await supabase.from("clientes").select("id").eq("telefono",form.telefono).single();
    if(!ex)await supabase.from("clientes").insert({nombre:form.nombre,telefono:form.telefono,direccion:`${zonaSel?.zona||""} ${addr.calle} ${addr.referencia}`.trim(),sexo:form.sexo,recibir_promos:form.recibirPromos});
  };

  const confirm=async()=>{
    if(!form.nombre||!form.telefono||!zonaSelId){setPmsg("Completa tu nombre, teléfono y zona de entrega para continuar");return;}
    const ref=generarRef();setPedidoRef(ref);
    await saveCliente();setSheet("resumen");
  };

  const buildWaMsg=()=>{
    const lineas=items.map(i=>`  • ${i.name} x${i.qty} - ${(i.price*i.qty).toFixed(2)}`).join("\n");
    const dir=`${zonaSel?.zona||""}, ${addr.calle}${addr.referencia?`, ${addr.referencia}`:""}`;
    const hora=new Date().toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"});
    const delDetalle=del===0?"GRATIS \u{1F389}":`${del.toFixed(2)}${delSuper>0&&delFood>0?` (super ${delSuper.toFixed(2)} + comida ${delFood.toFixed(2)})`:""}`;
    return `\u{1F6D2} *Nuevo pedido ${APP_NAME} ${CITY}*\n\u{1F4CB} Ref: ${pedidoRef}\n----------------------------\n${lineas}\n----------------------------\nSubtotal: ${sub.toFixed(2)}\nDelivery: ${delDetalle}\n*TOTAL: ${total.toFixed(2)}*\n----------------------------\n\u{1F464} ${form.nombre}\n\u{1F4F1} ${form.telefono}\n\u{1F4CD} ${zonaSel?.zona||""}\n\u{1F3E0} ${dir}\n\u{1F4B3} ${form.pago}\n\u{23F0} ${hora}`;
  };

  const sendWa=()=>{window.location.href=`https://wa.me/${WA}?text=${encodeURIComponent(buildWaMsg())}`;};
  const sendSvcWa=()=>{const m=`*Solicitud: ${selSvc.name}* — ${APP_NAME}\n\nNombre: ${svcForm.nombre}\nTeléfono: ${svcForm.telefono}\nDirección: ${svcForm.direccion}\nDetalle: ${svcForm.detalle}`;window.location.href=`https://wa.me/${WA}?text=${encodeURIComponent(m)}`;setSheet(null);setSelSvc(null);};
  // ── LISTA NEGRA — palabras que mandan la reseña a revisión del admin ──
  const LISTA_NEGRA=["marico","marica","coño","verga","puta","mierda","pendejo","idiota","estupido","imbecil","cabron","hijueputa","gonorrea","malparido","mamaguevo","coñoemadre","maldito","maldita","maluco","maluca"];
  const pasaFiltro=(texto)=>{
    if(!texto)return true;
    const t=texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
    return !LISTA_NEGRA.some(p=>t.includes(p.normalize("NFD").replace(/[̀-ͯ]/g,"")));
  };

  // Cargar reseñas aprobadas de un proveedor
  const loadProvResenas=async(provId)=>{
    if(provResenas[provId])return; // ya cargadas
    let query=supabase.from("resenas").select("*").eq("aprobada",true).order("created_at",{ascending:false}).limit(10);
    if(provId==="super"){query=query.is("proveedor_id",null).eq("proveedor_nombre","Supermercado Lokl");}
    else{query=query.eq("proveedor_id",provId);}
    const{data}=await query;
    if(data)setProvResenas(prev=>({...prev,[provId]:data}));
  };

  // Enviar reseña de proveedor con filtro automático
  const enviarResenaProveedor=async(provId,provNombre,btn=null)=>{
    if(btn){btn.disabled=true;btn.textContent="Enviando...";}
    if(!provResenasForm.estrellas||!provResenasForm.nombre.trim()){setProvResenasMsj("Pon tu nombre y calificación ⭐");if(btn){btn.disabled=false;btn.textContent="Enviar reseña";}return;}
    const autoAprobada=pasaFiltro(provResenasForm.comentario)&&pasaFiltro(provResenasForm.nombre);
    const{error}=await supabase.from("resenas").insert({
      proveedor_id:provId,
      proveedor_nombre:provNombre||"",
      cliente_nombre:provResenasForm.nombre.trim(),
      estrellas:provResenasForm.estrellas,
      comentario:provResenasForm.comentario.trim()||null,
      aprobada:autoAprobada,
    });
    if(error){setProvResenasMsj("Error al enviar. Intenta de nuevo.");if(btn){btn.disabled=false;btn.textContent="Enviar reseña";}return;}
    setProvResenasMsj(autoAprobada?"✅ ¡Gracias! Tu reseña ya está publicada.":"✅ Gracias. Tu reseña será revisada antes de publicarse.");
    // Si fue aprobada automáticamente, actualizar lista local
    if(autoAprobada){
      const nueva={proveedor_id:provId,cliente_nombre:provResenasForm.nombre.trim(),estrellas:provResenasForm.estrellas,comentario:provResenasForm.comentario.trim()||null,aprobada:true,created_at:new Date().toISOString()};
      setProvResenas(prev=>({...prev,[provId]:[nueva,...(prev[provId]||[])]}));
      // Actualizar badge en tarjeta
      setPromediosResenas(prev=>{const lista=[nueva,...(provResenas[provId]||[])];const avg=(lista.reduce((a,x)=>a+x.estrellas,0)/lista.length).toFixed(1);return{...prev,[provId]:{avg,count:lista.length}};});
    }
    setTimeout(()=>{setProvResenasForm({estrellas:0,comentario:"",nombre:""});setProvResenasMsj("");setShowProvResenasId(null);},2500);
  };

  const enviarResena=async()=>{if(!resena.estrellas||!resena.nombre)return setResenaMsj("Pon tu nombre y calificación");await supabase.from("resenas").insert({producto_id:resenaSheet,cliente_nombre:resena.nombre,cliente_telefono:resena.telefono,estrellas:resena.estrellas,comentario:resena.comentario,aprobada:false});setResenaMsj("✅ Gracias por tu reseña.");setTimeout(()=>{setSheet(null);setResenaSheet(null);setResena({estrellas:0,comentario:"",nombre:"",telefono:""});setResenaMsj("");},2000);};

  const comprimirImagen=async(file,maxW=1200,calidad=0.82)=>{
    return new Promise(resolve=>{
      const img=new Image();
      const url=URL.createObjectURL(file);
      img.onload=()=>{
        URL.revokeObjectURL(url);
        const ratio=Math.min(1,maxW/Math.max(img.width,img.height));
        const w=Math.round(img.width*ratio);
        const h=Math.round(img.height*ratio);
        const canvas=document.createElement("canvas");
        canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        canvas.toBlob(blob=>resolve(blob||file),"image/jpeg",calidad);
      };
      img.onerror=()=>{URL.revokeObjectURL(url);resolve(file);};
      img.src=url;
    });
  };
  const upload=async(file,bucket,path)=>{
    const comprimido=await comprimirImagen(file);
    await supabase.storage.from(bucket).upload(path,comprimido,{upsert:true,contentType:"image/jpeg"});
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const handleLogin=async()=>{
    if(!provForm.email||!provForm.pass)return setPmsg("Completa correo y contraseña");
    if(provForm.email===ADMIN_USER&&provForm.pass===ADMIN_PASS){setProvModeRaw("admin");setTab("Proveedores");setAdminSec("dashboard");loadAdmin();loadPedidos();loadSuscripciones();return;}
    setLoading(true);
    const{data,error}=await supabase.from("proveedores").select("*").eq("email",provForm.email).single();
    setLoading(false);
    if(error||!data)return setPmsg("Usuario no encontrado");
    if(data.en_pausa)return setPmsg("Tu cuenta está pausada. Contacta al administrador.");
    if(data.password_plain&&data.password_plain!==provForm.pass)return setPmsg("Contraseña incorrecta");
    setProvDataPersist(data);setProvModePersist("dash");setProvTab("estado");setPmsg("");
    loadMyProds(data.id);loadMyPromos(data.id);loadMyVentas(data.id);loadMisRestPedidos(data.id,data.negocio);loadMisClientes(data.negocio);
  };

  const handleRegister=async()=>{
    if(!provForm.email||!provForm.nombre||!provForm.negocio||!provForm.whatsapp_negocio||!provForm.pass)return setPmsg("Completa todos los campos obligatorios (*)");
    if(!provForm.estado_ubicacion||!provForm.municipio)return setPmsg("⚠️ Selecciona el Estado y Municipio donde ofreces tu servicio");
    setLoading(true);
    const{data:existing}=await supabase.from("proveedores").select("id").eq("email",provForm.email).single();
    if(existing){setLoading(false);return setPmsg("Ya existe una cuenta con ese correo");}
    let logo_url=null;
    if(logoFile)logo_url=await upload(logoFile,"logos",`${provForm.email.split("@")[0]}_logo_${Date.now()}`);
    const{error}=await supabase.from("proveedores").insert({
      usuario:provForm.email.split("@")[0],nombre:provForm.nombre,negocio:provForm.negocio,
      telefono:provForm.whatsapp_negocio,email:provForm.email,
      whatsapp_negocio:provForm.whatsapp_negocio,
      telefono_principal:provForm.telefono_principal||null,
      instagram:provForm.instagram||null,
      categorias:provForm.categorias,
      logo_url,aprobado:true,activo:true,en_pausa:false,password_plain:provForm.pass,
      tipo_negocio:provForm.tipo_negocio||"Restaurante / Cocina / Comida",
      descripcion_negocio:provForm.descripcion_negocio||null,
      tipo_operacion_gastro:provForm.tipo_operacion_gastro||null,
      horario_desde:provForm.horario_desde||null,
      horario_hasta:provForm.horario_hasta||null,
      horario_desc:provForm.horario_desc||null,
      delivery_propio:provForm.delivery_propio||false,
      permite_retiro:provForm.permite_retiro||false,
      delivery_costo:provForm.delivery_costo||0,
      delivery_gratis_desde:provForm.delivery_gratis_desde||15,
      direccion_fisica:provForm.direccion_fisica||null,
      subcategoria_servicio:provForm.subcategoria_servicio||null,
      especialidad:provForm.especialidad||null,
      matricula_prof:provForm.matricula_prof||null,
      precio_consulta:provForm.precio_consulta?parseFloat(provForm.precio_consulta):null,
      horarios_atencion:provForm.horarios_atencion||null,
      zona_cobertura:provForm.zona_cobertura||null,
      tarifa_referencial:provForm.tarifa_referencial||null,
      examenes:provForm.examenes||null,
      municipio:provForm.municipio||ubiActiva.municipio||"San Fernando",
      estado_ubicacion:provForm.estado_ubicacion||ubiActiva.estado||"Apure",
      suscripcion_activa:true,meses_gratis_restantes:1,
      suscripcion_vence:new Date(Date.now()+45*24*60*60*1000).toISOString().split("T")[0]
    });
    setLoading(false);
    if(error)return setPmsg(error.message.includes("unique")?"Ese correo ya está registrado":"Error al registrarse: "+error.message);
    setPmsg("✅ Registro exitoso. Ya puedes iniciar sesión y abrir tu negocio.");
    setProvModePersist("login");
  };

  const loadMyProds=async(pid)=>{
    const hoy=new Date().toISOString().split("T")[0];
    const{data}=await supabase.from("productos_proveedor").select("*").eq("proveedor_id",pid).or(`permanente.eq.true,fecha.eq.${hoy}`).order("created_at",{ascending:false});
    if(data)setMyProds(data);
  };
  const loadMyPromos=async(pid)=>{const{data}=await supabase.from("promociones_proveedor").select("*").eq("proveedor_id",pid).order("created_at",{ascending:false});if(data)setMyPromos(data);};
  const loadMyVentas=async(pid)=>{const{data}=await supabase.from("ventas").select("*").eq("proveedor_id",pid).order("fecha",{ascending:false}).limit(50);if(data)setMyVentas(data);};
  const getClienteId=()=>{try{let id=localStorage.getItem("lokl_cliente_id");if(!id){id=(crypto&&crypto.randomUUID)?crypto.randomUUID():("c_"+Date.now()+"_"+Math.random().toString(36).slice(2));localStorage.setItem("lokl_cliente_id",id);}return id;}catch{return null;}};
  // Abre DIRECTO un proveedor de servicio desde la búsqueda: halla su categoría, la activa, carga y lo selecciona
  const abrirProveedorServicioDirecto=async(prov)=>{
    const mapaTipoNegocio={
      "mototaxi":["Mototaxi"],"taxi":["Taxi"],
      "rutas":["Transporte interurbano (rutas)","Transporte y encomiendas"],
      "encomiendas":["Encomiendas y mudanzas","Transporte y encomiendas"],
      "medicos":["Médico / Consultorio"],"enfermeria":["Enfermería a domicilio"],
      "laboratorios":["Laboratorio clínico"],"odontologia":["Odontología"],
      "belleza":["Peluquería / Barbería","Manicure / Pedicure","Maquillaje y estética","Lavandería"],
      "hogar":["Plomería","Electricidad","Pintura y construcción","Limpieza del hogar","Carpintería / Herrería"],
      "educacion":["Clases y tutorías","Idiomas"],
      "mecanica":["Mecánica automotriz","Electricidad automotriz"],
      "hoteles":["Hotel","Posada","Hospedaje","Hotel / Posada"],
      "turismo":["Finca turística","Tour operador","Campamento","Turismo y aventura","Campamento / Aventura"],
    };
    let catId=prov.subcategoria_servicio||null;
    if(!catId||!mapaTipoNegocio[catId]){
      catId=Object.keys(mapaTipoNegocio).find(k=>mapaTipoNegocio[k].includes(prov.tipo_negocio))||null;
    }
    const cat=SERVICIO_CATEGORIAS.find(c=>c.id===catId);
    setSearch("");
    setTab("Servicios");
    if(!cat){return;} // sin categoría clara: queda en el módulo Servicios
    setCategoriaServicio(cat);
    if(cat.id==="rutas")await loadRutasTransporte();else await loadProveedoresServicio(cat.id);
    setProveedorServicioActivo(prov);
  };
  const loadFavoritos=async(tel)=>{const cid=getClienteId();const f={};if(cid){const{data:d1}=await supabase.from("favoritos_cliente").select("proveedor_id").eq("cliente_id",cid);if(d1)d1.forEach(r=>f[r.proveedor_id]=true);}if(tel){const{data:d2}=await supabase.from("favoritos_cliente").select("proveedor_id").eq("cliente_telefono",tel);if(d2)d2.forEach(r=>f[r.proveedor_id]=true);}setFavoritos(f);};
  const toggleFavorito=async(provId,provNombre)=>{const cid=getClienteId();if(!cid)return alert("No se pudo guardar el favorito en este dispositivo");if(favoritos[provId]){await supabase.from("favoritos_cliente").delete().eq("cliente_id",cid).eq("proveedor_id",provId);setFavoritos(f=>({...f,[provId]:false}));}else{await supabase.from("favoritos_cliente").insert({cliente_id:cid,cliente_telefono:form.telefono||null,proveedor_id:provId,proveedor_nombre:provNombre});setFavoritos(f=>({...f,[provId]:true}));}};
  const loadClienteHistorial=async(tel)=>{if(!tel)return;const{data}=await supabase.from("pedidos").select("*").eq("cliente_telefono",tel).order("created_at",{ascending:false}).limit(30);if(data)setClienteHistorial(data);};
  const loadMisClientes=async(provNombre)=>{const{data}=await supabase.from("pedidos").select("cliente_nombre,cliente_telefono,created_at,total,ref").eq("proveedor_nombre",provNombre).order("created_at",{ascending:false});if(data){const mapa={};data.forEach(p=>{const k=p.cliente_telefono;if(!mapa[k])mapa[k]={nombre:p.cliente_nombre,telefono:p.cliente_telefono,ultimoPedido:p.created_at,totalPedidos:0,totalGastado:0};mapa[k].totalPedidos++;mapa[k].totalGastado+=p.total||0;});setMisClientes(Object.values(mapa).sort((a,b)=>new Date(b.ultimoPedido)-new Date(a.ultimoPedido)));}};

  const loadAdmin=async()=>{
    const[pr,re,zo,av,todos,cb,ped,promo,remPend,svcPend,clasifPend,allClasif,habPend,turPend,allRes]=await Promise.all([
      supabase.from("productos_proveedor").select("*,proveedores(negocio,id)").eq("aprobado",false).eq("rechazado",false),
      supabase.from("resenas").select("*").eq("aprobada",false),
      supabase.from("zonas_delivery").select("*").order("municipio"),
      supabase.from("ventas").select("*").order("fecha",{ascending:false}).limit(100),
      supabase.from("proveedores").select("*").eq("aprobado",true).order("negocio"),
      supabase.from("combos").select("*").order("created_at",{ascending:false}),
      supabase.from("pedidos").select("*").order("created_at",{ascending:false}).limit(200),
      supabase.from("promociones_proveedor").select("*,proveedores(negocio)").eq("aprobada",false).eq("activa",true),
      supabase.from("remates").select("*").eq("aprobado",false).eq("vendido",false).order("created_at",{ascending:false}),
      supabase.from("servicios_comunidad").select("*").eq("aprobado",false).order("created_at",{ascending:false}),
      supabase.from("clasificados").select("*").eq("aprobado",false).eq("vendido",false).order("created_at",{ascending:false}),
      supabase.from("clasificados").select("*").order("created_at",{ascending:false}),
      supabase.from("habitaciones_hotel").select("*,proveedores(negocio,id)").eq("aprobado",false).order("created_at",{ascending:false}),
      supabase.from("servicios_turismo").select("*,proveedores(negocio,id)").eq("aprobado",false).order("created_at",{ascending:false}),
      supabase.from("resenas").select("*,proveedores(negocio)").eq("aprobada",true).order("created_at",{ascending:false}),
    ]);
    if(pr.data)setPendProds(pr.data);
    if(re.data)setPendResenas(re.data);
    if(zo.data)setAllZonas(zo.data);
    if(av.data)setAdminVentas(av.data);
    if(todos.data)setAllProveedores(todos.data);
    if(cb.data)setCombosAdmin(cb.data);
    if(ped.data)setPedidos(ped.data);
    if(promo.data)setPendPromos(promo.data);
    if(remPend.data)setPendRemates(remPend.data);
    if(svcPend.data)setPendServiciosCom(svcPend.data);
    if(clasifPend.data)setPendClasificados(clasifPend.data);
    if(allClasif.data)setAllClasificadosAdmin(allClasif.data);
    if(habPend.data)setPendHabitaciones(habPend.data);
    if(turPend.data)setPendTurismo(turPend.data);
    if(allRes.data)setAllResenasAdmin(allRes.data);
  };

  const loadResenas=async(prodId)=>{
    if(prodResenas[prodId])return;
    const{data}=await supabase.from("resenas").select("*").eq("producto_id",prodId).eq("aprobada",true).order("created_at",{ascending:false}).limit(5);
    if(data)setProdResenas(r=>({...r,[prodId]:data}));
  };

  const togglePausa=async(id,enPausa)=>{await supabase.from("proveedores").update({en_pausa:!enPausa}).eq("id",id);loadAdmin();loadAll();};
  const deleteProveedor=(id)=>{setConfirmModal({msg:"¿Eliminar este proveedor? No se puede deshacer.",onOk:async()=>{await supabase.from("productos_proveedor").delete().eq("proveedor_id",id);await supabase.from("proveedores").delete().eq("id",id);loadAdmin();loadAll();}});};
  const setProvDataPersist=(data)=>{
    setProvData(data);
    try{if(data)localStorage.setItem("lokl_prov",JSON.stringify(data));else localStorage.removeItem("lokl_prov");}catch{}
  };
  const setProvModePersist=(mode)=>{
    setProvModeRaw(mode);
    if(mode!=="dash")try{localStorage.removeItem("lokl_prov");}catch{}
  };
  const toggleMiEstado=async()=>{
    let nuevoForzar;
    if(provData.forzar_abierto===true){nuevoForzar=null;} // forzado abierto → volver a horario
    else if(provData.forzar_abierto===false){nuevoForzar=true;} // forzado cerrado → forzar apertura
    else{
      // null = siguiendo horario
      const enHorario=estaAbiertoAhora(provData.horario_desde,provData.horario_hasta,true,false,null);
      nuevoForzar=enHorario?false:true; // en horario→forzar cierre, fuera→forzar apertura
    }
    await supabase.from("proveedores").update({forzar_abierto:nuevoForzar}).eq("id",provData.id);
    setProvDataPersist({...provData,forzar_abierto:nuevoForzar});
    loadAll();
  };
  const estaAbiertoAhora=(desde,hasta,activoManual,enPausa,forzarAbierto)=>{
    if(activoManual===false&&forzarAbierto!==true)return false; // desactivado por admin (solo si no hay forzado)
    if(enPausa&&forzarAbierto!==true)return false; // en pausa (solo si no hay forzado)
    if(forzarAbierto===true)return true; // dueño forzó apertura manual — máxima prioridad
    if(forzarAbierto===false)return false; // dueño forzó cierre manual — máxima prioridad
    // Sin forzado: usar horario configurado
    const ahoraVE=new Date(new Date().toLocaleString("en-US",{timeZone:"America/Caracas"}));
    if(!desde||!hasta)return true; // sin horario = siempre abierto
    const [dh,dm]=desde.split(":").map(Number);
    const [hh,hm]=hasta.split(":").map(Number);
    const minAhora=ahoraVE.getHours()*60+ahoraVE.getMinutes();
    const minDesde=dh*60+dm;
    const minHasta=hh*60+hm;
    if(minHasta>minDesde)return minAhora>=minDesde&&minAhora<=minHasta;
    return minAhora>=minDesde||minAhora<=minHasta; // cruza medianoche
  };

  const publishProd=async()=>{
    if(!newProd.nombre||!newProd.precio)return setPmsg("Completa nombre y precio");
    if(provData.tipo_negocio==="Tienda / Negocio local"&&!newProd.categoria)return setPmsg("Selecciona una categoría para tu producto");
    setLoading(true);setPmsg("");
    let foto_url=null,foto_url_2=null,foto_url_3=null,foto_url_4=null;
    if(fotoFile)foto_url=await upload(fotoFile,"productos",`${provData.id}_${Date.now()}`);
    if(fotoFile2)foto_url_2=await upload(fotoFile2,"productos",`${provData.id}_2_${Date.now()}`);
    if(fotoFile3)foto_url_3=await upload(fotoFile3,"productos",`${provData.id}_3_${Date.now()}`);
    if(fotoFile4)foto_url_4=await upload(fotoFile4,"productos",`${provData.id}_4_${Date.now()}`);
    const esServicio=!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio);
    const{data:existing}=await supabase.from("productos_proveedor").select("id").eq("proveedor_id",provData.id).eq("primera_aprobacion",true).limit(1);
    const auto=true; // Productos se publican directo
    const{error}=await supabase.from("productos_proveedor").insert({
      proveedor_id:provData.id,
      nombre:newProd.nombre,
      descripcion:newProd.descripcion||null,
      marca:newProd.marca||null,
      presentacion:newProd.presentacion||null,
      precio:parseFloat(newProd.precio),
      unidad:newProd.unidad,
      categoria:newProd.categoria,
      foto_url:foto_url||null,
      foto_url_2:foto_url_2||null,
      foto_url_3:foto_url_3||null,
      foto_url_4:foto_url_4||null,
      variantes:newProd.variantes||null,
      codigo_ref:newProd.codigo_ref||null,
      stock:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?999:(parseInt(newProd.stock)||1),
      horario_inicio:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?null:newProd.hi,
      horario_fin:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?null:newProd.hf,
      aprobado:auto,
      disponible:true,
      permanente:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?true:newProd.permanente,
      es_oferta:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?false:(newProd.es_oferta||false),
      primera_aprobacion:auto,
      rechazado:false,
      fecha:new Date().toISOString().split("T")[0],
    });
    setLoading(false);
    if(error){setPmsg("Error: "+error.message);return;}
    const esServ=!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio);setPmsg(auto?(esServ?"✅ Servicio publicado":"✅ Producto publicado"):(esServ?"✅ Servicio enviado al admin para aprobación":"✅ Enviado al admin para aprobación"));
    setNewProd({nombre:"",descripcion:"",marca:"",presentacion:"",precio:"",unidad:"unidad",categoria:"Comida preparada",stock:1,hi:"08:00",hf:"18:00",permanente:false,es_oferta:false,variantes:"",codigo_ref:""});
    setFotoFile(null);setFotoPreview(null);
    setFotoFile2(null);setFotoPreview2(null);
    setFotoFile3(null);setFotoPreview3(null);
    setFotoFile4(null);setFotoPreview4(null);
    loadMyProds(provData.id);loadAll();
  };

  const publishPromo=async()=>{
    if(!newPromo.nombre||!newPromo.precio||!newPromo.fecha_inicio||!newPromo.fecha_fin)return setPmsg("Completa todos los campos");
    setLoading(true);
    let foto_url=null;
    if(promoFotoFile)foto_url=await upload(promoFotoFile,"productos",`promo_${provData.id}_${Date.now()}`);
    const{error}=await supabase.from("promociones_proveedor").insert({
      proveedor_id:provData.id,...newPromo,precio:parseFloat(newPromo.precio),
      foto_url,aprobada:false,activa:true
    });
    setLoading(false);
    if(error){setPmsg("Error: "+error.message);return;}
    setPmsg("✅ Promoción enviada para aprobación");
    setNewPromo({nombre:"",descripcion:"",precio:"",fecha_inicio:"",fecha_fin:""});
    setPromoFotoFile(null);setPromoFotoPreview(null);
    loadMyPromos(provData.id);
  };

  const toggleDisp=async(id,val)=>{await supabase.from("productos_proveedor").update({disponible:!val}).eq("id",id);loadMyProds(provData.id);loadAll();};
  const notifyClientes=async(promo)=>{
    // Solo clientes que aceptaron promos de ESTE proveedor
    const{data:subs}=await supabase.from("suscriptores_promo")
      .select("cliente_nombre,cliente_telefono")
      .eq("proveedor_id",provData.id)
      .eq("acepta_promos",true);
    if(!subs||subs.length===0)return alert("Aún no tienes clientes suscritos a tus promos.\n\nCuando un cliente acepte recibir promociones al hacer un pedido, aparecerá aquí.");
    const appUrl=APP_URL;
    // Abrir WhatsApp con el primero — el proveedor envía manualmente uno a uno
    const primero=subs[0];
    const raw=(primero.cliente_telefono||"").replace(/\D/g,"");
    const num=raw.startsWith("0")?"58"+raw.slice(1):raw.startsWith("58")?raw:"58"+raw;
    const msg=`\u{1F44B} Hola ${primero.cliente_nombre||""}\n\n*${provData.negocio}* tiene una nueva promo para ti \u{1F354}\n\n\u{1F525} *${promo.nombre}*\n${promo.descripcion||""}\n\n\u{1F4B5} Precio: $${promo.precio}\n\n\u{1F449} Pide aquí:\n${appUrl}\n\nSi no deseas recibir más promociones, responde *BAJA*.`;
    alert(`Vas a enviar esta promo a ${subs.length} cliente${subs.length>1?"s":""} suscrito${subs.length>1?"s":""}.\n\nSe abrirá WhatsApp con el primer mensaje. Recuerda enviar uno a uno.`);
    abrirWhatsApp(num,msg);
  };

  const approvePr=async(id)=>{await supabase.from("productos_proveedor").update({aprobado:true,primera_aprobacion:true,rechazado:false}).eq("id",id);loadAdmin();loadAll();};
  const rejectPr=async(id)=>{const motivo=rejectMotivo[id]||"No cumple los requisitos";await supabase.from("productos_proveedor").update({rechazado:true,aprobado:false,motivo_rechazo:motivo}).eq("id",id);loadAdmin();};
  const approveRe=async(id)=>{await supabase.from("resenas").update({aprobada:true}).eq("id",id);loadAdmin();loadPromediosResenas();};
  const rejectRe=async(id)=>{await supabase.from("resenas").delete().eq("id",id);loadAdmin();};
  const addZona=async()=>{if(!newZona.zona)return;await supabase.from("zonas_delivery").insert(newZona);setNewZona({municipio:"San Fernando",zona:"",tipo:"barrio",costo_delivery:1.50,delivery_gratis_super:18.00,delivery_gratis_comida:12.00});loadAdmin();loadAll();};
  const addCombo=async()=>{if(!newCombo.nombre||!newCombo.precio)return;await supabase.from("combos").insert({...newCombo,precio:parseFloat(newCombo.precio),activa:true});setNewCombo({nombre:"",descripcion:"",precio:"",temporada:"",fecha_inicio:"",fecha_fin:""});loadAll();loadAdmin();};

  const addSuperProd=async()=>{
    if(!newSP.nombre){alert("⚠️ Escribe el nombre del producto");return;}
    if(!newSP.precio||isNaN(parseFloat(newSP.precio))){alert("⚠️ Ingresa un precio válido");return;}
    setLoading(true);
    let foto_url=null;
    if(spFoto)foto_url=await upload(spFoto,"productos",`super_${Date.now()}`);
    const{error}=await supabase.from("productos_supermercado").insert({nombre:newSP.nombre,categoria:newSP.categoria,marca:newSP.marca||null,presentacion:newSP.presentacion||null,descripcion:newSP.descripcion||null,precio:parseFloat(newSP.precio),unidad:newSP.unidad,emoji:newSP.emoji,foto_url,disponible:true,es_oferta:newSP.es_oferta||false,municipio:ubiActiva.municipio||"San Fernando",estado:ubiActiva.estado||"Apure"});
    setLoading(false);
    if(error){alert("❌ No se pudo guardar: "+error.message);return;}
    setNewSP({nombre:"",marca:"",presentacion:"",descripcion:"",precio:"",unidad:"kg",emoji:"🛒",categoria:SUPER_CATS[0],es_oferta:false});
    setSpFoto(null);setSpFotoPreview(null);
    loadAll();
  };
  const deleteSuperProd=async(id)=>{await supabase.from("productos_supermercado").update({disponible:false}).eq("id",id.replace("sp_",""));loadAll();};

  const cambiarClave=async(provId,nuevaClave)=>{
    if(!nuevaClave||nuevaClave.length<4)return alert("La clave debe tener al menos 4 caracteres");
    await supabase.from("proveedores").update({password_plain:nuevaClave}).eq("id",provId);
    setResetPass({...resetPass,[provId]:""});
    alert("✅ Clave actualizada correctamente");
  };

  const horario=getHorario();
  const ventasHoy=adminVentas.filter(v=>v.fecha?.startsWith(new Date().toISOString().split("T")[0]));
  const ingresoHoy=ventasHoy.reduce((a,v)=>a+(v.total_item||0),0);
  const ingresoTotal=adminVentas.reduce((a,v)=>a+(v.total_item||0),0);
  const topAdminProds=Object.entries(adminVentas.reduce((a,v)=>{a[v.producto_nombre]=(a[v.producto_nombre]||0)+v.cantidad;return a;},{})).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const myVentasHoy=myVentas.filter(v=>v.fecha?.startsWith(new Date().toISOString().split("T")[0]));
  const myIngresoHoy=myVentasHoy.reduce((a,v)=>a+(v.total_item||0),0);
  const myIngresoTotal=myVentas.reduce((a,v)=>a+(v.total_item||0),0);
  const myTopProds=Object.entries(myVentas.reduce((a,v)=>{a[v.producto_nombre]=(a[v.producto_nombre]||0)+v.cantidad;return a;},{})).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const myClientes=[...new Set(myVentas.map(v=>v.cliente_telefono).filter(Boolean))].length;
  const filteredProvs=catFilter==="Todas"?allProveedores:allProveedores.filter(p=>(p.categorias||[]).includes(catFilter));

  const QtyCtrl=({p})=>cart[p.id]?(
    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
      <div style={s.qR}>
        <button style={s.qB} onClick={()=>rem(p.id)}>−</button>
        <span style={s.qN}>{cart[p.id].qty}</span>
        <button style={s.qB} onClick={()=>add(p)}>+</button>
      </div>
      <button onClick={()=>{setNotaSheet(p.id);setNotaTemp(cart[p.id]?.nota||"");}} style={{fontSize:9,color:cart[p.id]?.nota?"#7e22ce":"#94a3b8",background:cart[p.id]?.nota?"#fdf4ff":"none",border:"none",cursor:"pointer",padding:"1px 4px",borderRadius:6}}>
        {cart[p.id]?.nota?"📝 Nota añadida":"+ nota"}
      </button>
    </div>
  ):<button style={s.aBtn} onClick={()=>add(p)}>+</button>;

  const Card=({p})=>{
    const cerrado=p.abierto===false;
    const resenas=prodResenas[p.dbId]||[];
    const avgStars=resenas.length>0?(resenas.reduce((a,r)=>a+r.estrellas,0)/resenas.length).toFixed(1):null;
    return(
      <div style={{...s.card,position:"relative",opacity:cerrado?0.75:1}}>
        {cerrado&&(
          <div style={{position:"absolute",inset:0,background:"rgba(248,250,252,0.88)",borderRadius:14,zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:8}}>
            <div style={{fontSize:22}}>🔴</div>
            <div style={{fontSize:11,fontWeight:700,color:"#be123c",textAlign:"center"}}>Cerrado ahora</div>
            <button onClick={()=>{setCat("Todo");setSearch("");}} style={{fontSize:10,background:P,color:"#fff",border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>Ver otras opciones</button>
          </div>
        )}
        {p.foto?<img src={p.foto} alt={p.name} style={{width:"100%",height:120,objectFit:"contain",background:"#fff",borderRadius:8,marginBottom:4}}/>:<div style={s.cEm}>{p.emoji}</div>}
        {p.isPromo&&<div style={s.promoTag}>🎉 Promoción</div>}
        {p.tag&&!p.isPromo&&<div style={s.tag}>{p.tag}</div>}
        {p.kitchen&&(
          <div style={{...s.cKt,flexDirection:"column",alignItems:"flex-start",gap:2}}>
            <div style={{display:"flex",alignItems:"center",gap:4,width:"100%"}}>
              {p.logo&&<img src={p.logo} alt="" style={s.cLogo}/>}
              <span>{p.kitchen}</span>
              <span style={{marginLeft:"auto",fontSize:10,fontWeight:600,color:cerrado?"#be123c":"#15803d"}}>{cerrado?"● Cerrado":"● Abierto"}</span>
            </div>
            {p.horarioNeg&&<div style={{fontSize:10,color:"#94a3b8"}}>🕐 {p.horarioNeg}</div>}
          </div>
        )}
        <div style={s.cNm}>{p.name}</div>
        {(p.marca||p.presentacion)&&<div style={s.cMeta}>{[p.marca,p.presentacion].filter(Boolean).join(" · ")}</div>}
        {p.descripcion&&<div style={{fontSize:10,color:"#94a3b8",lineHeight:1.3}}>{p.descripcion}</div>}
        {p.horario&&<div style={{fontSize:10,color:"#94a3b8"}}>🕐 {p.horario}</div>}
        {p.dbId&&(
          <div>
            {avgStars?(
              <div style={{fontSize:10,color:"#f59e0b",display:"flex",alignItems:"center",gap:3}}>
                {"★".repeat(Math.round(avgStars))}{"☆".repeat(5-Math.round(avgStars))}
                <span style={{color:"#64748b"}}>{avgStars} ({resenas.length})</span>
              </div>
            ):(
              <button onClick={()=>loadResenas(p.dbId)} style={{fontSize:10,color:"#94a3b8",background:"none",border:"none",cursor:"pointer",padding:0}}>Ver reseñas</button>
            )}
            {resenas.length>0&&resenas.slice(0,2).map((r,i)=>(
              <div key={i} style={{fontSize:10,color:"#64748b",background:"#f8fafc",borderRadius:6,padding:"4px 6px",marginTop:3}}>
                <span style={{color:"#f59e0b"}}>{"★".repeat(r.estrellas)}</span> {r.comentario&&`"${r.comentario}"`}
              </div>
            ))}
          </div>
        )}
        <div style={s.cBt}>
          <div><div style={s.cPr}>${p.price.toFixed(2)}</div><div style={s.cUn}>/ {p.unit}</div></div>
          {cerrado?<div style={{fontSize:11,color:"#94a3b8"}}>No disp.</div>:<QtyCtrl p={p}/>}
        </div>
        {p.dbId&&!cerrado&&<button onClick={()=>{setResenaSheet(p.dbId);setSheet("resena");}} style={{fontSize:10,color:"#94a3b8",background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0,marginTop:2}}>⭐ Dejar reseña</button>}
      </div>
    );
  };


  const CardNegocio=({p})=>{
    const qtyNeg=cartNegocio[p.id]?.qty||0;
    return(
      <div style={{...s.card,padding:"0 0 10px",overflow:"hidden",cursor:"pointer"}} onClick={()=>setProductoDetalle(p)}>
        {/* IMAGEN */}
        <div style={{position:"relative",marginBottom:8}}>
          {p.foto
            ?<img src={p.foto} alt={p.name} style={{width:"100%",height:110,objectFit:"contain",background:"#f8fafc",display:"block",borderRadius:"12px 12px 0 0",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();setProductoDetalle(p);}}/>
            :<div style={{height:100,background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,borderRadius:"12px 12px 0 0"}}>🛍️</div>
          }
          {p.tag&&<div style={{position:"absolute",top:6,left:6,fontSize:9,fontWeight:800,background:"#f59e0b",color:"#fff",padding:"2px 7px",borderRadius:8}}>{p.tag}</div>}
        </div>
        <div style={{padding:"0 10px"}}>
          {/* NOMBRE */}
          <div style={{fontSize:12,fontWeight:700,color:"#0f172a",lineHeight:1.3,marginBottom:3}}>{p.name}</div>
          {/* DESCRIPTOR */}
          {(p.marca||p.descripcion)&&(
            <div style={{fontSize:10,color:"#64748b",lineHeight:1.3,marginBottom:5}}>
              {p.marca&&<span style={{fontWeight:600}}>{p.marca}</span>}
              {p.marca&&p.descripcion&&" · "}
              {p.descripcion&&<span>{p.descripcion.length>40?p.descripcion.slice(0,40)+"…":p.descripcion}</span>}
            </div>
          )}
          {/* PRECIO + CTA */}
          <div style={s.cBt}>
            <div style={{fontSize:17,fontWeight:900,color:"#15803d",letterSpacing:-0.3}}>${p.price.toFixed(2)}<span style={{fontSize:10,fontWeight:400,color:"#94a3b8",marginLeft:2}}>/{p.unit}</span></div>
            {qtyNeg>0?(
              <div style={s.qR}>
                <button style={s.qB} onClick={e=>{e.stopPropagation();const n={...cartNegocio};n[p.id].qty>1?n[p.id]={...n[p.id],qty:n[p.id].qty-1}:delete n[p.id];setCartNegocio(n);}}>-</button>
                <span style={s.qN}>{qtyNeg}</span>
                <button style={s.qB} onClick={e=>{e.stopPropagation();setCartNegocio(c=>({...c,[p.id]:{...p,qty:qtyNeg+1}}));}}>+</button>
              </div>
            ):<button style={{...s.aBtn,borderRadius:8,width:"auto",padding:"5px 10px",fontSize:11,fontWeight:700}} onClick={e=>{e.stopPropagation();setCartNegocio(c=>({...c,[p.id]:{...p,qty:1}}));}}>+ Agregar</button>}
          </div>
        </div>
      </div>
    );
  };

  const CardRest=({p})=>{
    const qtyRest=cartRest[p.id]?.qty||0;
    // Badge permitido: solo basado en tag del producto, filtrado
    const BADGES_OK={"⭐ Más vendido":{bg:"#f59e0b",txt:"⭐ Más vendido"},"🔥 Recomendado":{bg:"#ef4444",txt:"🔥 Recomendado"},"🌶️ Picante":{bg:"#dc2626",txt:"🌶️ Picante"},"👶 Infantil":{bg:"#06b6d4",txt:"👶 Infantil"},"⏱️ Listo rápido":{bg:"#8b5cf6",txt:"⏱️ Listo rápido"},"🔥 COMBO":{bg:"#f97316",txt:"🔥 Promo"}};
    const isCombo=p.name?.toLowerCase().includes("combo")||p.name?.toLowerCase().includes("promo")||p.isPromo;
    const badgeKey=isCombo?"🔥 COMBO":(p.isPromo?"🔥 COMBO":p.tag);
    const badge=BADGES_OK[badgeKey]||null;
    return(
      <div style={{...s.card,padding:"0 0 10px",overflow:"hidden",cursor:"pointer",borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}} onClick={()=>setPlatoDetalle(p)}>
        {/* 1. IMAGEN — elemento dominante */}
        <div style={{position:"relative",marginBottom:8}}>
          {p.foto
            ?<img src={p.foto} alt={p.name} style={{width:"100%",height:120,objectFit:"contain",display:"block",borderRadius:"14px 14px 0 0",background:"#fff",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();setImgZoom(p.foto);}}/>
            :<div style={{height:120,background:"linear-gradient(135deg,#fef3c7,#fde68a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,borderRadius:"14px 14px 0 0"}}>🍽️</div>
          }
          {/* 2. BADGE — máximo 1, esquina sup izquierda */}
          {badge&&(
            <div style={{position:"absolute",top:7,left:7,background:badge.bg,color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:20,letterSpacing:0.2,boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}>
              {badge.txt}
            </div>
          )}
        </div>
        <div style={{padding:"0 10px"}}>
          {/* 3. NOMBRE — 1 línea, claro */}
          <div style={{fontSize:12,fontWeight:700,color:"#0f172a",lineHeight:1.3,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
          {/* 4. DESCRIPCIÓN — 1 línea, ingredientes clave */}
          {p.descripcion&&<div style={{fontSize:10,color:"#94a3b8",lineHeight:1.3,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.descripcion}</div>}
          {/* 5. PRECIO + 6. CTA */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:p.descripcion?0:4}}>
            <div style={{fontSize:18,fontWeight:900,color:"#ef4444",letterSpacing:-0.4}}>${p.price.toFixed(2)}</div>
            {qtyRest>0?(
              <div style={s.qR}>
                <button style={s.qB} onClick={e=>{e.stopPropagation();const n={...cartRest};n[p.id].qty>1?n[p.id]={...n[p.id],qty:n[p.id].qty-1}:delete n[p.id];setCartRest(n);}}>−</button>
                <span style={s.qN}>{qtyRest}</span>
                <button style={s.qB} onClick={e=>{e.stopPropagation();const stockMax=p.stock||999;if(qtyRest>=stockMax){alert("Stock máximo");return;}setCartRest(c=>({...c,[p.id]:{...p,qty:qtyRest+1}}))}}>+</button>
              </div>
            ):(
              <button style={{background:"#ef4444",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:800,cursor:"pointer",flexShrink:0}} onClick={e=>{e.stopPropagation();const stockMax=p.stock||999;if(qtyRest>=stockMax)return;setCartRest(c=>({...c,[p.id]:{...p,qty:1}}))}}>
                + Agregar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const StatCard=({num,lbl,color})=>(<div style={s.statCard}><div style={{...s.statNum,color:color||P}}>{num}</div><div style={s.statLbl}>{lbl}</div></div>);
  const BarChart=({data,max})=>(<div style={{display:"flex",flexDirection:"column",gap:8}}>{data.map(([name,val],i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8}}><div style={{fontSize:11,color:"#64748b",width:110,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div><div style={s.barWrap}><div style={s.barFill((val/max)*100,["#6366f1","#f59e0b","#22c55e","#ef4444","#0ea5e9"][i%5])}/></div><div style={{fontSize:12,fontWeight:700,color:P,minWidth:24,textAlign:"right"}}>{val}</div></div>))}</div>);

  const getProdEstado=(p)=>{
    if(p.rechazado)return{label:"✗ Rechazado",bg:"#fee2e2",color:"#be123c"};
    if(p.aprobado)return{label:"✓ Aprobado",bg:"#dcfce7",color:"#15803d"};
    return{label:"⏳ Pendiente",bg:"#fef9c3",color:"#854d0e"};
  };

  return(
    <div style={s.app}>
      {confirmModal&&(
        <div onClick={()=>setConfirmModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:"24px 20px",maxWidth:320,width:"100%",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}>
            <p style={{margin:"0 0 20px",fontSize:15,color:DARK,lineHeight:1.5,textAlign:"center"}}>{confirmModal.msg}</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setConfirmModal(null)} style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid #e2e8f0",background:"#f8fafc",color:DARK,fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
              <button onClick={()=>{confirmModal.onOk();setConfirmModal(null);}} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"#ef4444",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
      <div style={s.hdr}>
        {/* LOGO */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#0f172a"/>
            <circle cx="18" cy="15" r="8" fill="#25D366"/>
            <circle cx="18" cy="15" r="4" fill="#0f172a"/>
            <path d="M18 23 L13 33 L18 30 L23 33 Z" fill="#25D366"/>
            <circle cx="18" cy="15" r="2" fill="#25D366"/>
          </svg>
          <div style={{display:"flex",alignItems:"baseline",gap:0}}>
            <span style={{fontFamily:"'Arial Black',Impact,sans-serif",fontWeight:900,fontSize:22,color:"#0f172a",letterSpacing:-1}}>l</span>
            <span style={{position:"relative",display:"inline-block"}}>
              <span style={{fontFamily:"'Arial Black',Impact,sans-serif",fontWeight:900,fontSize:22,color:"#0f172a",letterSpacing:-1}}>o</span>
              <span style={{position:"absolute",top:1,right:-1,width:6,height:6,borderRadius:"50%",background:"#FB8C00",display:"block"}}/>
            </span>
            <span style={{fontFamily:"'Arial Black',Impact,sans-serif",fontWeight:900,fontSize:22,color:"#0f172a",letterSpacing:-1}}>kl</span>
          </div>
        </div>
        {/* DERECHA: ciudad + carrito + perfil */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>{setCiudadTemp({estado:ubiActiva.estado||"Apure",municipio:ubiActiva.municipio||""});setShowCiudadModal(true);}} style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700,color:"#15803d",cursor:"pointer",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
            📍 {ubiActiva.municipio} ▾
          </button>
          {(count>0||Object.values(cartRest).length>0||Object.values(cartNegocio).length>0)&&(
            <button style={s.cBtn} onClick={()=>setSheet("cartGlobal")}>
              🛒
              <span style={s.cN}>
                {Object.values(cart).reduce((a,i)=>a+i.qty,0)+Object.values(cartRest).reduce((a,i)=>a+i.qty,0)+Object.values(cartNegocio).reduce((a,i)=>a+i.qty,0)}
              </span>
            </button>
          )}
          <button onClick={()=>setTab("Proveedores")} style={{background:"#f6f6f6",border:"1px solid #e0e0e0",borderRadius:"50%",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,flexShrink:0,overflow:"hidden",padding:0}}>{provData&&provData.logo_url?<img src={provData.logo_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"👤"}</button>
        </div>
      </div>
      <div style={s.tabs}>
        {MAIN_TABS.map(t=>{
          const icons={"Inicio":"🏠","Supermercado":"🛒","Negocios locales":"🏪","Feria de comida":"🍽️","Servicios":"⚡"};
          const activeColors={
            "Inicio":     {bg:"#f0fdf4",border:"#15803d",text:"#15803d"},
            "Supermercado":{bg:"#fef9c3",border:"#b45309",text:"#b45309"},
            "Negocios locales":{bg:"#eff6ff",border:"#1d4ed8",text:"#1d4ed8"},
            "Feria de comida":{bg:"#fff7ed",border:"#c2410c",text:"#c2410c"},
            "Servicios":  {bg:"#fdf4ff",border:"#7e22ce",text:"#7e22ce"},
          };
          const ac=activeColors[t];
          const isActive=tab===t;
          return(
            <button key={t} style={{flex:1,padding:"8px 2px 6px",border:"none",background:isActive?ac.bg:"transparent",borderBottom:isActive?`3px solid ${ac.border}`:"3px solid transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all 0.15s",minWidth:0}} onClick={()=>{setTab(t);if(t!=="Servicios")setCategoriaServicio(null);}}>
              <span style={{fontSize:isActive?24:18,transition:"all 0.2s",filter:isActive?"none":"grayscale(60%)",display:"block"}}>{icons[t]}</span>
              <span style={{fontSize:8,lineHeight:1.2,textAlign:"center",fontWeight:isActive?700:400,color:isActive?ac.text:"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",width:"100%",paddingX:2}}>{t==="Negocios locales"?"Negocios":t==="Feria de comida"?"Feria de comida":t}</span>
            </button>
          );
        })}
      </div>
      {/* SECONDARY TABS ELIMINADOS — Clasificados y Mercadito accesibles desde Inicio */}

      {/* INICIO */}
      {tab==="Inicio"&&(<>
        {/* BANNER PRINCIPAL */}
        <div style={{background:"linear-gradient(180deg,#166534 0%,#16a34a 60%,#22c55e 100%)",padding:"20px 16px 18px",color:"#fff",borderRadius:"0 0 24px 24px"}}>
          <div style={{fontSize:21,fontWeight:900,marginBottom:3,letterSpacing:-0.5}}>¿Qué necesitas hoy? 👋</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:14,letterSpacing:1.5,textTransform:"uppercase",fontWeight:500}}>Encuentra · Conecta · Compra</div>
          {/* BÚSQUEDA GLOBAL — toca y va a supermercado con foco */}
          <div style={{background:"#fff",borderRadius:14,padding:"4px 14px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>
            <span style={{fontSize:16,opacity:0.5,flexShrink:0}}>🔍</span>
            <input
              style={{flex:1,border:"none",outline:"none",fontSize:14,padding:"10px 0",background:"transparent",color:"#0f172a"}}
              placeholder="Busca comida, productos o servicios…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
            {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",fontSize:16,color:"#94a3b8",cursor:"pointer",flexShrink:0,padding:"4px"}}>✕</button>}
          </div>
        </div>

        {/* ✨ MURO DE NOVEDADES — solo aparece si el cliente sigue tiendas que tienen promos */}
        {!search.trim()&&provPromos.length>0&&(()=>{
          const ahora=Date.now();
          const esReciente=(p)=>{if(!p.created_at)return false;return (ahora-new Date(p.created_at).getTime())<7*24*60*60*1000;};
          const favIds=Object.keys(favoritos).filter(k=>favoritos[k]);
          const promosFav=provPromos.filter(p=>favIds.includes(String(p.proveedor_id)));
          // Solo mostramos el muro si hay novedades de tiendas SEGUIDAS (evita redundancia con "Promociones activas")
          if(promosFav.length===0)return null;
          const lista=promosFav.slice().sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,12);
          const abrirTiendaDePromo=(p)=>{
            const prov=[...allNegocios,...allRestaurantes].find(n=>String(n.id)===String(p.proveedor_id));
            if(!prov)return;
            const esNeg=prov.tipo_negocio==="Tienda / Negocio local";
            if(esNeg){setTab("Negocios locales");setNegocioActivo(prov);setCartNegocioId(prov.id);setCartNegocioNombre(prov.negocio);setCartNegocioWa(prov.whatsapp_negocio||prov.telefono);loadProvResenas(prov.id);}
            else{setTab("Feria de comida");setRestauranteActivo(prov);}
          };
          return(
            <div style={{padding:"14px 0 4px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px 10px"}}>
                <div style={{fontSize:16,fontWeight:900,color:"#0f172a"}}>✨ Novedades de tus tiendas</div>
              </div>
              <div style={{display:"flex",gap:12,overflowX:"auto",padding:"0 16px 8px",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
                {lista.map(p=>{
                  const prov=p.proveedores||{};
                  return(
                    <div key={"nov_"+p.id} onClick={()=>abrirTiendaDePromo(p)} style={{flexShrink:0,width:180,background:"#fff",borderRadius:16,border:"1px solid #f1f5f9",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",overflow:"hidden"}}>
                      <div style={{position:"relative",width:"100%",height:110,background:"#f8fafc"}}>
                        {p.foto_url?<img src={p.foto_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🎁</div>}
                        {esReciente(p)&&<div style={{position:"absolute",top:8,left:8,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:20}}>🆕 Nuevo</div>}
                      </div>
                      <div style={{padding:"10px 12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                          {prov.logo_url?<img src={prov.logo_url} alt="" style={{width:22,height:22,borderRadius:6,objectFit:"cover",flexShrink:0}}/>:<div style={{width:22,height:22,borderRadius:6,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>🏪</div>}
                          <div style={{fontSize:11,color:"#64748b",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prov.negocio||"Tienda"}</div>
                        </div>
                        <div style={{fontSize:13,fontWeight:800,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nombre}</div>
                        {p.precio&&<div style={{fontSize:14,fontWeight:900,color:"#16a34a",marginTop:2}}>${parseFloat(p.precio).toLocaleString()}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        {search.trim()&&(
          <div style={{padding:"8px 16px 0"}}>
            {(()=>{
              const q=search.toLowerCase();
              const prodMatch=allProdsConMargen.filter(p=>p.name.toLowerCase().includes(q));
              // Tiendas y restaurantes cuyo NOMBRE coincide con la búsqueda
              const negMatch=[...allNegocios,...allRestaurantes].filter(n=>n.negocio.toLowerCase().includes(q));
              // Servicios (proveedores de servicio) por nombre o descripción
              const svcMatch=allServicios.filter(sv=>(sv.negocio||"").toLowerCase().includes(q)||(sv.descripcion_negocio||"").toLowerCase().includes(q)||(sv.tipo_negocio||"").toLowerCase().includes(q));
              // Clasificados por título o descripción
              const clasMatch=clasificados.filter(c=>(c.titulo||"").toLowerCase().includes(q)||(c.descripcion||"").toLowerCase().includes(q));
              // Mercadito / remates por título, nombre o descripción
              const remMatch=remates.filter(r=>(r.titulo||r.nombre||"").toLowerCase().includes(q)||(r.descripcion||"").toLowerCase().includes(q));
              const totalR=prodMatch.length+negMatch.length+svcMatch.length+clasMatch.length+remMatch.length;
              return(<>
                <div style={{fontSize:12,color:"#64748b",marginBottom:8,fontWeight:600}}>
                  {totalR+" resultado"+(totalR!==1?"s":"")+" para \""+search+"\""}
                </div>
                {totalR===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#94a3b8",fontSize:13}}>Sin resultados para "{search}"</div>}
                {/* TIENDAS que coinciden por nombre */}
                {negMatch.slice(0,4).map(n=>{
                  const esNeg=n.tipo_negocio==="Tienda / Negocio local";
                  return(
                    <div key={"neg_"+n.id} onClick={()=>{
                      if(esNeg){setTab("Negocios locales");setNegocioActivo(n);setCartNegocioId(n.id);setCartNegocioNombre(n.negocio);setCartNegocioWa(n.whatsapp_negocio||n.telefono);loadProvResenas(n.id);}
                      else{setTab("Feria de comida");setRestauranteActivo(n);}
                      setSearch("");
                    }} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}}>
                      {n.logo_url?<img src={n.logo_url} alt="" style={{width:40,height:40,borderRadius:10,objectFit:"cover",flexShrink:0}}/>:<div style={{width:40,height:40,borderRadius:10,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{esNeg?"🏪":"🍽️"}</div>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.negocio}</div>
                        <div style={{fontSize:11,color:"#3b82f6",fontWeight:600}}>{esNeg?"Tienda":"Restaurante"} · Ver catálogo</div>
                      </div>
                      <div style={{fontSize:18,color:"#94a3b8",flexShrink:0}}>›</div>
                    </div>
                  );
                })}
                {/* PRODUCTOS que coinciden */}
                {prodMatch.slice(0,6).map(p=>(
                  <div key={p.id} onClick={()=>{
                    setSearch("");
                    if(p.cat==="Supermercado"){setCat("Supermercado");setTab("Supermercado");return;}
                    const tn=p.tipoNegocioProv;
                    if(tn&&tn!=="Restaurante / Cocina / Comida"&&tn!=="Tienda / Negocio local"){
                      // Producto de un proveedor de SERVICIO: abrir ese proveedor directo
                      const prov=allServicios.find(n=>String(n.id)===String(p.provId));
                      if(prov){abrirProveedorServicioDirecto(prov);return;}
                      setTab("Servicios");return;
                    }
                    if(tn==="Tienda / Negocio local"){
                      // Producto de una TIENDA: abrir esa tienda
                      const prov=allNegocios.find(n=>String(n.id)===String(p.provId));
                      if(prov){setTab("Negocios locales");setNegocioActivo(prov);setCartNegocioId(prov.id);setCartNegocioNombre(prov.negocio);setCartNegocioWa(prov.whatsapp_negocio||prov.telefono);loadProvResenas(prov.id);return;}
                    }
                    // Por defecto: comida
                    setCat(p.cat);setTab("Feria de comida");
                  }} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}}>
                    {p.foto?<img src={p.foto} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",flexShrink:0}}/>:<div style={{width:40,height:40,borderRadius:8,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{p.emoji||"🛒"}</div>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#94a3b8"}}>{p.kitchen||p.cat}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0f9b6e",flexShrink:0}}>${p.price.toFixed(2)}</div>
                  </div>
                ))}
                {/* SERVICIOS que coinciden */}
                {svcMatch.slice(0,4).map(sv=>(
                  <div key={"svc_"+sv.id} onClick={()=>abrirProveedorServicioDirecto(sv)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}}>
                    {sv.logo_url?<img src={sv.logo_url} alt="" style={{width:40,height:40,borderRadius:10,objectFit:"cover",flexShrink:0}}/>:<div style={{width:40,height:40,borderRadius:10,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>⚡</div>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sv.negocio}</div>
                      <div style={{fontSize:11,color:"#6366f1",fontWeight:600}}>Servicio · {sv.tipo_negocio||"Ver directorio"}</div>
                    </div>
                    <div style={{fontSize:18,color:"#94a3b8",flexShrink:0}}>›</div>
                  </div>
                ))}
                {/* CLASIFICADOS que coinciden */}
                {clasMatch.slice(0,4).map(c=>(
                  <div key={"clas_"+c.id} onClick={()=>{setTab("Clasificados");setSearch("");}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}}>
                    {c.foto_url?<img src={c.foto_url} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",flexShrink:0}}/>:<div style={{width:40,height:40,borderRadius:8,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📋</div>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.titulo}</div>
                      <div style={{fontSize:11,color:"#059669",fontWeight:600}}>Clasificado</div>
                    </div>
                    {c.precio&&<div style={{fontSize:13,fontWeight:700,color:"#059669",flexShrink:0}}>${parseFloat(c.precio).toLocaleString()}</div>}
                  </div>
                ))}
                {/* MERCADITO / REMATES que coinciden */}
                {remMatch.slice(0,4).map(r=>(
                  <div key={"rem_"+r.id} onClick={()=>{setTab("Mercadito");setSearch("");}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}}>
                    {r.foto_url?<img src={r.foto_url} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",flexShrink:0}}/>:<div style={{width:40,height:40,borderRadius:8,background:"#fff7ed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏷️</div>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.titulo||r.nombre}</div>
                      <div style={{fontSize:11,color:"#c2410c",fontWeight:600}}>Mercadito</div>
                    </div>
                    {r.precio&&<div style={{fontSize:13,fontWeight:700,color:"#c2410c",flexShrink:0}}>${parseFloat(r.precio).toLocaleString()}</div>}
                  </div>
                ))}
              </>);
            })()}
          </div>
        )}

        {/* ACCESOS RÁPIDOS — 6 secciones */}
        <div style={{padding:"14px 16px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {icon:"🛒", label:"Supermercado", tab:"Supermercado",     bg:"linear-gradient(135deg,#0f172a,#1e293b)",   tc:"#fbbf24"},
              {icon:"🍽️", label:"Feria de comida", tab:"Feria de comida", bg:"linear-gradient(135deg,#9a3412,#c2410c)",   tc:"#fff"},
              {icon:"🏪", label:"Negocios",     tab:"Negocios locales", bg:"linear-gradient(135deg,#1e40af,#2563eb)",   tc:"#fff"},
              {icon:"⚡", label:"Servicios",    tab:"Servicios",        bg:"linear-gradient(135deg,#581c87,#7e22ce)",   tc:"#fff"},
              {icon:"🚗", label:"Clasificados", tab:"Clasificados",     bg:"linear-gradient(135deg,#065f46,#059669)",   tc:"#fff"},
              {icon:"🏷️", label:"Mercadito",    tab:"Mercadito local",  bg:"linear-gradient(135deg,#92400e,#d97706)",   tc:"#fff"},
            ].map(x=>(
              <button key={x.tab} onClick={()=>setTab(x.tab)} style={{background:x.bg,borderRadius:16,padding:"14px 6px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,border:"none",cursor:"pointer",boxShadow:"0 3px 10px rgba(0,0,0,0.15)",position:"relative",overflow:"hidden"}}>
                <span style={{fontSize:26,filter:"drop-shadow(0 2px 3px rgba(0,0,0,0.2))"}}>{x.icon}</span>
                <span style={{fontSize:10,fontWeight:700,color:x.tc,textAlign:"center",lineHeight:1.2,letterSpacing:0.2}}>{x.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DELIVERY BADGE */}
        <div style={{padding:"12px 16px 0"}}>
          <div style={{background:"#f0fdf4",borderRadius:14,padding:"13px 15px",display:"flex",alignItems:"center",gap:13,border:"2px solid #86efac"}}>
            <span style={{fontSize:30}}>🚚</span>
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontSize:22,fontWeight:900,color:"#14532d",letterSpacing:-0.5}}>DELIVERY GRATIS</span>
              </div>
              <div style={{fontSize:13,color:"#166534",fontWeight:700,marginTop:2}}>En el Supermercado</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:1}}>Pedidos mayores a $15 · San Fernando</div>
            </div>
          </div>
        </div>

        {/* RESTAURANTES ABIERTOS */}
        {allRestaurantes.length>0&&(
          <div style={{padding:"0 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"14px 0 10px"}}>
              <div style={{fontSize:17,fontWeight:900,color:"#0f172a",letterSpacing:-0.3}}>🍽️ Feria de comida</div>
              <button onClick={()=>setTab("Feria de comida")} style={{fontSize:11,color:"#94a3b8",background:"none",border:"none",cursor:"pointer",fontWeight:400}}>Ver todos →</button>
            </div>
            <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
              {[...allRestaurantes].sort((a,b)=>{const aAb=estaAbiertoAhora(a.horario_desde,a.horario_hasta,a.activo,a.en_pausa,a.forzar_abierto);const bAb=estaAbiertoAhora(b.horario_desde,b.horario_hasta,b.activo,b.en_pausa,b.forzar_abierto);return bAb-aAb;}).slice(0,6).map(r=>(
                <div key={r.id} onClick={()=>{setTab("Feria de comida");setRestauranteActivo(r);setCartRestId(r.id);setCartRestNombre(r.negocio);setCartRestWa(r.whatsapp_negocio||r.telefono);}} style={{flexShrink:0,textAlign:"center",cursor:"pointer",width:72}}>
                  <div style={{width:60,height:60,borderRadius:"50%",background:r.logo_url?"#f8fafc":getAvatarColor(r.negocio),display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:r.logo_url?4:0,margin:"0 auto",border:"2px solid #dcfce7"}}>
                      {r.logo_url
                        ?<img src={r.logo_url} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}} onError={e=>{e.target.style.display="none";e.target.parentNode.style.background=getAvatarColor(r.negocio);e.target.parentNode.innerHTML=`<span style="color:#fff;font-size:22px;font-weight:900">${(r.negocio||"?")[0].toUpperCase()}</span>`;}}/>
                        :<span style={{color:"#fff",fontSize:22,fontWeight:900}}>{(r.negocio||"?")[0].toUpperCase()}</span>
                      }
                    </div>
                  <div style={{fontSize:10,fontWeight:600,color:"#1e293b",marginTop:4,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:72}}>{r.negocio}</div>
                  <div style={{fontSize:9,color:"#22c55e",fontWeight:600}}>● Abierto</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROMOS ACTIVAS */}
        {provPromos.length>0&&(
          <div style={{padding:"0 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"14px 0 10px"}}>
              <div style={{fontSize:17,fontWeight:900,color:"#0f172a",letterSpacing:-0.3}}>🔥 Promociones activas</div>
              <button onClick={()=>{setTab("Feria de comida");}} style={{fontSize:11,color:"#94a3b8",background:"none",border:"none",cursor:"pointer",fontWeight:400}}>Ver todo →</button>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
              {provPromos.slice(0,6).map(p=>(
                <div key={p.id} onClick={()=>setTab("Feria de comida")} style={{flexShrink:0,width:140,background:"#fff",borderRadius:12,border:"1px solid #fde68a",overflow:"hidden",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  {p.foto_url?<img src={p.foto_url} alt={p.nombre} style={{width:"100%",height:75,objectFit:"cover"}}/>:<div style={{height:75,background:"#fef9c3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🎁</div>}
                  <div style={{padding:"6px 8px"}}>
                    <div style={{fontSize:11,color:"#fff",fontWeight:800,background:"#ea580c",padding:"2px 6px",borderRadius:6,display:"inline-block",letterSpacing:0.3}}>🏷️ PROMO</div>
                    <div style={{fontSize:11,fontWeight:600,color:"#1e293b",lineHeight:1.2,marginTop:3}}>{p.nombre}</div>
                    <div style={{fontSize:15,fontWeight:900,color:"#15803d",marginTop:3}}>${parseFloat(p.precio||0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLASIFICADOS RECIENTES */}
        {clasificados.length>0&&(
          <div style={{padding:"0 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"14px 0 10px"}}>
              <div style={{fontSize:17,fontWeight:900,color:"#0f172a",letterSpacing:-0.3}}>🚗 Lo último en clasificados</div>
              <button onClick={()=>setTab("Clasificados")} style={{fontSize:11,color:"#94a3b8",background:"none",border:"none",cursor:"pointer",fontWeight:400}}>Ver todo →</button>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
              {clasificados.slice(0,4).map(c=>(
                <div key={c.id} onClick={()=>{setTab("Clasificados");setClasificadoSeleccionado(c);}} style={{flexShrink:0,width:150,background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  {c.foto1_url?<img src={c.foto1_url} alt={c.titulo} style={{width:"100%",height:90,objectFit:"cover"}}/>:<div style={{height:90,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{c.tipo==="Motos"?"🏍️":c.tipo==="Inmuebles"?"🏠":"🚗"}</div>}
                  <div style={{padding:"6px 8px"}}>
                    <div style={{fontSize:10,color:"#7e22ce",fontWeight:700}}>{c.tipo}</div>
                    <div style={{fontSize:11,fontWeight:600,color:"#1e293b",lineHeight:1.2,marginTop:1}}>{c.titulo}</div>
                    <div style={{fontSize:15,fontWeight:900,color:"#16a34a",marginTop:3}}>${parseFloat(c.precio).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA PROVEEDOR */}
        <div style={{padding:"14px 16px 16px"}}>
          <div onClick={()=>setTab("Proveedores")} style={{background:"linear-gradient(135deg,#1d4ed8,#4338ca)",borderRadius:16,padding:"16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:"0 4px 12px rgba(29,78,216,0.25)"}}>
            <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🏪</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:900,color:"#fff",letterSpacing:-0.3}}>¿Tienes un negocio?</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",fontWeight:400,marginTop:2}}>Únete gratis · 45 días de prueba sin costo</div>
            </div>
            <span style={{color:"rgba(255,255,255,0.6)",fontSize:20}}>›</span>
          </div>
        </div>

        <div style={{height:20}}/>
      </>)}

      {tab==="Supermercado"&&(<>
        {/* SUPERMERCADO — solo disponible donde hay operación activa */}
        {!tieneSuper?(
          <div style={{padding:"40px 24px",textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:16}}>🛒</div>
            <div style={{fontSize:20,fontWeight:900,color:"#0f172a",marginBottom:8}}>Próximamente en {ubiActiva.municipio}</div>
            <div style={{fontSize:14,color:"#64748b",lineHeight:1.6,marginBottom:24}}>
              El supermercado online de Lokl aún no está disponible en tu municipio.<br/>
              Estamos trabajando para llegar pronto.
            </div>
            <div style={{background:"#f0fdf4",border:"2px solid #86efac",borderRadius:16,padding:"18px 20px",marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"#15803d",marginBottom:8}}>📲 ¿Quieres que lleguemos antes?</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Escríbenos y te avisamos cuando estemos en {ubiActiva.municipio}.</div>
              <button onClick={()=>abrirWhatsApp(WA,"Hola Lokl! Soy de "+ubiActiva.municipio+", "+ubiActiva.estado+". Quisiera que el supermercado llegue pronto a mi municipio \u{1F6D2}")} style={{background:"#25D366",color:"#fff",border:"none",borderRadius:12,padding:"12px 20px",fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:8,margin:"0 auto"}}>
                📲 Notificarme cuando lleguen
              </button>
            </div>
            <button onClick={()=>{setCiudadTemp({estado:ubiActiva.estado,municipio:ubiActiva.municipio});setShowCiudadModal(true);}} style={{fontSize:12,color:"#64748b",background:"none",border:"1px solid #e2e8f0",borderRadius:10,padding:"8px 16px",cursor:"pointer"}}>
              📍 Cambiar mi municipio
            </button>
          </div>
        ):(
        <>
        <div style={{background:"linear-gradient(160deg,#0f172a 0%,#1e293b 60%,#334155 100%)",padding:"16px 16px 14px",color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{width:48,height:48,background:"#f59e0b",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:"0 2px 8px rgba(245,158,11,0.4)"}}>🛒</div>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:-0.5}}>Supermercado</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:1}}>Productos frescos · Delivery a domicilio</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"stretch"}}>
            <div style={{background:"rgba(245,158,11,0.18)",borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,border:"1px solid rgba(245,158,11,0.4)",flex:1}}>
              <span style={{fontSize:20}}>🚚</span>
              <div>
                <div style={{fontSize:15,color:"#fbbf24",fontWeight:900,letterSpacing:-0.3}}>DELIVERY GRATIS</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:1}}>En pedidos mayores a $15</div>
              </div>
            </div>
            <div style={{background:superAbierto?"rgba(22,163,74,0.2)":"rgba(220,38,38,0.2)",border:`1px solid ${superAbierto?"#16a34a":"#dc2626"}`,borderRadius:12,padding:"10px 12px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,flexShrink:0}}>
              <span style={{width:10,height:10,borderRadius:"50%",background:superAbierto?"#4ade80":"#f87171",display:"inline-block"}}/>
              <span style={{fontSize:10,fontWeight:900,color:superAbierto?"#4ade80":"#f87171",letterSpacing:0.3}}>{superAbierto?"ABIERTO":"CERRADO"}</span>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 16px 0"}}><input style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"2px solid #e2e8f0",fontSize:14,background:"#fff",boxSizing:"border-box",outline:"none",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}} placeholder="🔍  Buscar productos del supermercado…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
        {superCat==="Todas"?(
          <div style={{padding:"12px 16px 8px"}}>
            {/* CATEGORÍAS DESTACADAS */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {[
                {cat:"Snacks",emoji:"🍿",color:"#fff7ed",tc:"#c2410c",border:"#fed7aa",micro:"Compra rápida ⚡"},
                {cat:"Granos y cereales",emoji:"🌾",color:"#fef9c3",tc:"#854d0e",border:"#fde68a",micro:"Para la despensa 🏠"},
              ].map(x=>(
                <button key={x.cat} onClick={()=>setSuperCat(x.cat)} style={{background:x.color,border:`2px solid ${x.border}`,borderRadius:16,padding:"14px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",width:"100%"}}>
                  <span style={{fontSize:34}}>{x.emoji}</span>
                  <span style={{fontSize:12,fontWeight:800,color:x.tc,textAlign:"center",lineHeight:1.2}}>{x.cat}</span>
                  <span style={{fontSize:9,color:x.tc,opacity:0.75,fontWeight:600,marginTop:1}}>{x.micro}</span>
                </button>
              ))}
            </div>
            {/* RESTO DE CATEGORÍAS — orden por frecuencia online */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[
                {cat:"Bebidas",emoji:"🥤",color:"#dbeafe",tc:"#1d4ed8"},
                {cat:"Lácteos",emoji:"🥛",color:"#e0f2fe",tc:"#0369a1"},
                {cat:"Panadería",emoji:"🍞",color:"#fef3c7",tc:"#92400e"},
                {cat:"Aceites y condimentos",emoji:"🫙",color:"#fef3c7",tc:"#b45309"},
                {cat:"Enlatados",emoji:"🥫",color:"#f1f5f9",tc:"#475569"},
                {cat:"Limpieza del hogar",emoji:"🧹",color:"#ede9fe",tc:"#7c3aed"},
                {cat:"Aseo personal",emoji:"🧴",color:"#f0fdf4",tc:"#15803d"},
                {cat:"Proteínas",emoji:"🥩",color:"#fee2e2",tc:"#be123c"},
                {cat:"Frutas y verduras",emoji:"🥦",color:"#dcfce7",tc:"#166534"},
                {cat:"Ver todo",emoji:"🛒",color:"#f0fdf4",tc:"#15803d"},
              ].map(x=>(
                <button key={x.cat} onClick={()=>setSuperCat(x.cat==="Ver todo"?"Todas":x.cat)} style={{background:x.color,border:`1px solid ${x.color}`,borderRadius:14,padding:"10px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",minHeight:72}}>
                  <span style={{fontSize:26}}>{x.emoji}</span>
                  <span style={{fontSize:9,fontWeight:600,color:x.tc,textAlign:"center",lineHeight:1.2}}>{x.cat==="Ver todo"?"Ver todo":x.cat.split(" ").slice(0,2).join(" ")}</span>
                </button>
              ))}
            </div>
          </div>
        ):(
          <div style={{padding:"8px 16px 4px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>{superCat}</div>
            <button onClick={()=>setSuperCat("Todas")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>← Todas</button>
          </div>
        )}
        {/* OFERTAS DEL SUPERMERCADO */}
        {superCat==="Todas"&&!search&&(
          <div style={{padding:"12px 16px 8px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:17,fontWeight:900,color:"#0f172a",letterSpacing:-0.3}}>🔥 Ofertas del Supermercado</div>
              <button onClick={()=>setSuperCat("Ver todo")} style={{fontSize:11,color:"#94a3b8",background:"none",border:"none",cursor:"pointer",fontWeight:400}}>Ver más →</button>
            </div>
            {superProds.filter(p=>p.es_oferta).slice(0,6).length>0?(
              <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {superProds.filter(p=>p.es_oferta).slice(0,6).map((p,idx)=>{
                  const isCombo=p.nombre&&(p.nombre.toLowerCase().includes("combo")||p.nombre.toLowerCase().includes("familiar")||p.nombre.toLowerCase().includes("pack")||p.nombre.toLowerCase().includes("kit")||p.nombre.toLowerCase().includes("x2")||p.nombre.toLowerCase().includes("duo")||p.descripcion?.toLowerCase().includes("combo"));
                  const microLabel=isCombo?"Combo ahorro":"Oferta del día";
                  const microIcon=isCombo?"🎁":"🏷️";
                  const microColor=isCombo?"#6d28d9":"#b45309";
                  const microBg=isCombo?"#ede9fe":"#fef3c7";
                  const confianza=isCombo?"Más valor por tu dinero":"Precio especial hoy";
                  return(
                  <div key={p.id} style={{background:"#fff",borderRadius:18,overflow:"hidden",border:"1px solid #e2e8f0",boxShadow:"0 3px 12px rgba(0,0,0,0.07)"}}>
                    {/* IMAGEN */}
                    <div style={{position:"relative"}}>
                      {p.foto_url
                        ?<img src={p.foto_url} alt={p.nombre} style={{width:"100%",height:125,objectFit:"cover",display:"block",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();abrirLightbox(p.foto_url,p.nombre,p.descripcion,p.precio,p.unidad);}}/>
                        :<div style={{height:125,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44}}>{p.emoji||"🛒"}</div>
                      }
                      {/* BADGE OFERTA — fijo sobre imagen */}
                      <div style={{position:"absolute",top:8,left:8,background:"#ea580c",color:"#fff",fontSize:10,fontWeight:900,padding:"3px 9px",borderRadius:8,boxShadow:"0 2px 6px rgba(234,88,12,0.4)",letterSpacing:0.3}}>🏷️ OFERTA</div>
                    </div>
                    <div style={{padding:"10px 11px 12px"}}>
                      {/* TIPO: combo vs producto */}
                      <div style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:9,fontWeight:700,color:microColor,background:microBg,padding:"3px 9px",borderRadius:20,marginBottom:6,letterSpacing:0.2}}><span>{microIcon}</span><span>{microLabel}</span></div>
                      {/* PRECIO — protagonista absoluto */}
                      <div style={{fontSize:22,fontWeight:900,color:"#15803d",letterSpacing:-0.5,lineHeight:1,marginBottom:4}}>${parseFloat(p.precio||0).toFixed(2)}</div>
                      {/* NOMBRE — apoyo visual */}
                      <div style={{fontSize:11,fontWeight:500,color:"#64748b",lineHeight:1.35,marginBottom:9}}>{p.nombre}</div>
                      {/* CTA ROW */}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                        <span style={{fontSize:9,color:"#94a3b8",fontWeight:400,lineHeight:1.3,flex:1}}>{confianza}</span>
                        <button
                          onClick={(e)=>{e.stopPropagation();add({id:`sp_${p.id}`,name:p.nombre,price:parseFloat(p.precio),emoji:p.emoji||"🛒",cat:"Supermercado",unit:p.unidad||""});}}
                          style={{background:"#15803d",color:"#fff",border:"none",borderRadius:10,padding:"7px 13px",fontSize:12,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0,minHeight:34,boxShadow:"0 2px 6px rgba(21,128,61,0.3)"}}>
                          <span style={{fontSize:17,lineHeight:1,fontWeight:900}}>+</span>
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
              {/* CIERRE DE FLUJO — natural, no agresivo */}
              <div style={{marginTop:18,padding:"13px 16px",background:"#f0fdf4",borderRadius:14,border:"1px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                <div>
                  <div style={{fontSize:12,color:"#166534",fontWeight:600}}>¿Buscas algo más?</div>
                  <div style={{fontSize:11,color:"#4ade80",fontWeight:400,marginTop:1}}>Explora las categorías del supermercado</div>
                </div>
                <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{fontSize:11,color:"#15803d",background:"#fff",border:"1px solid #86efac",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>↑ Categorías</button>
              </div>
              </>
            ):(
              <div style={{textAlign:"center",padding:"28px 0",color:"#94a3b8",background:"#f8fafc",borderRadius:16,border:"1px dashed #e2e8f0"}}>
                <div style={{fontSize:36,marginBottom:8}}>🏷️</div>
                <div style={{fontSize:13,fontWeight:600,color:"#64748b"}}>Próximamente ofertas aquí</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>Usa el buscador o las categorías para ver todos los productos</div>
              </div>
            )}
          </div>
        )}
        {/* RESULTADOS DE BÚSQUEDA O CATEGORÍA SELECCIONADA */}
        {(search||superCat!=="Todas")&&(
          <div style={s.sec}>
            {superGroups.map(g=>(<div key={g.cat}><div style={s.sT}>{g.cat}</div><div style={s.grid}>{g.items.map(p=><Card key={p.id} p={p}/>)}</div></div>))}
            {superGroups.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#94a3b8"}}><div style={{fontSize:40}}>🔍</div><p>No encontramos ese producto</p></div>}
          </div>
        )}

        {/* RESEÑAS DEL SUPERMERCADO */}
        {(()=>{
          const rList=provResenas["super"]||[];
          const avg=rList.length>0?(rList.reduce((a,r)=>a+r.estrellas,0)/rList.length).toFixed(1):null;
          return(
            <div style={{margin:"16px 16px 8px",background:"#fff",borderRadius:16,padding:16,border:"1px solid #f1f5f9",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:15,fontWeight:900,color:"#0f172a"}}>⭐ Opiniones del supermercado</span>
                  {avg&&<span style={{fontSize:14,fontWeight:900,color:"#f59e0b"}}>{avg}</span>}
                  {rList.length>0&&<span style={{fontSize:11,color:"#94a3b8"}}>({rList.length} opinión{rList.length!==1?"es":""})</span>}
                </div>
                <button onClick={()=>setShowProvResenasId(showProvResenasId==="super"?null:"super")}
                  style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:20,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#92400e",cursor:"pointer"}}>
                  {showProvResenasId==="super"?"Cerrar":"✍️ Opinar"}
                </button>
              </div>
              {showProvResenasId==="super"&&(
                <div style={{background:"#f8fafc",borderRadius:12,padding:12,marginBottom:12,border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>Tu calificación</div>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {[1,2,3,4,5].map(n=>(<span key={n} onClick={()=>setProvResenasForm(f=>({...f,estrellas:n}))} style={{fontSize:28,cursor:"pointer",color:provResenasForm.estrellas>=n?"#f59e0b":"#e2e8f0",transition:"color 0.1s"}}>★</span>))}
                  </div>
                  <input style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none"}} placeholder="Tu nombre *" value={provResenasForm.nombre} onChange={e=>setProvResenasForm(f=>({...f,nombre:e.target.value}))}/>
                  <textarea style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none",resize:"none",fontFamily:"inherit"}} rows={3} placeholder="¿Cómo estuvo tu pedido?" value={provResenasForm.comentario} onChange={e=>setProvResenasForm(f=>({...f,comentario:e.target.value}))}/>
                  {provResenasMsj&&<div style={{fontSize:12,fontWeight:600,color:provResenasMsj.includes("✅")?"#15803d":"#dc2626",marginBottom:8}}>{provResenasMsj}</div>}
                  <button onClick={async(e)=>{
                    const btn=e.currentTarget;btn.disabled=true;btn.textContent="Enviando...";
                    if(!provResenasForm.estrellas||!provResenasForm.nombre.trim()){setProvResenasMsj("Pon tu nombre y calificación ⭐");btn.disabled=false;btn.textContent="Enviar opinión";return;}
                    const autoAprobada=pasaFiltro(provResenasForm.comentario)&&pasaFiltro(provResenasForm.nombre);
                    const{error}=await supabase.from("resenas").insert({proveedor_id:null,proveedor_nombre:"Supermercado Lokl",cliente_nombre:provResenasForm.nombre.trim(),estrellas:provResenasForm.estrellas,comentario:provResenasForm.comentario.trim()||null,aprobada:autoAprobada});
                    if(error){setProvResenasMsj("Error al enviar. Intenta de nuevo.");btn.disabled=false;btn.textContent="Enviar opinión";return;}
                    setProvResenasMsj(autoAprobada?"✅ ¡Gracias! Tu opinión ya está publicada.":"✅ Gracias. Tu opinión será revisada antes de publicarse.");
                    if(autoAprobada){
                      const nueva={proveedor_id:null,proveedor_nombre:"Supermercado Lokl",cliente_nombre:provResenasForm.nombre.trim(),estrellas:provResenasForm.estrellas,comentario:provResenasForm.comentario.trim()||null,aprobada:true,created_at:new Date().toISOString()};
                      setProvResenas(prev=>({...prev,"super":[nueva,...(prev["super"]||[])]}));
                    }
                    setTimeout(()=>{setProvResenasForm({estrellas:0,comentario:"",nombre:""});setProvResenasMsj("");setShowProvResenasId(null);},2500);
                  }} style={{width:"100%",background:"#f59e0b",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    Enviar opinión
                  </button>
                </div>
              )}
              {rList.length===0&&showProvResenasId!=="super"&&(<div style={{textAlign:"center",padding:"10px 0",color:"#94a3b8",fontSize:12}}>Sé el primero en opinar sobre el supermercado</div>)}
              {rList.slice(0,5).map((r,i)=>(<div key={i} style={{paddingBottom:10,marginBottom:10,borderBottom:i<rList.slice(0,5).length-1?"1px solid #f1f5f9":"none"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}><div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{r.cliente_nombre}</div><div style={{fontSize:12,color:"#f59e0b",letterSpacing:1}}>{"★".repeat(r.estrellas)}{"☆".repeat(5-r.estrellas)}</div></div>{r.comentario&&<div style={{fontSize:12,color:"#475569",lineHeight:1.4}}>{r.comentario}</div>}<div style={{fontSize:10,color:"#cbd5e1",marginTop:3}}>{(()=>{const d=new Date(r.created_at);const now=new Date();const diff=Math.floor((now.getTime()-d.getTime())/86400000);return diff<=0?"Hoy":diff===1?"Ayer":diff<7?`Hace ${diff} días`:diff<30?`Hace ${Math.floor(diff/7)} semana(s)`:d.toLocaleDateString("es-VE",{month:"short",year:"numeric"});})()}</div></div>))}
            </div>
          );
        })()}
        </> /* end tieneSuper true branch */
        )} {/* end tieneSuper ternary */}
      </>)}

      {/* REMATES */}
      {(tab==="Mercadito local"||tab==="Mercadito")&&(<>
        {/* HERO BANNER */}
        <div style={{background:"linear-gradient(135deg,#78350f 0%,#b45309 50%,#d97706 100%)",padding:"20px 16px 18px",color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{position:"absolute",bottom:-30,left:-10,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,position:"relative"}}>
            <div style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🏷️</div>
            <div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:-0.5,lineHeight:1}}>Mercadito Local</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>Compra y vende en San Fernando</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",position:"relative"}}>
            <span style={{background:"rgba(34,197,94,0.25)",border:"1px solid rgba(34,197,94,0.4)",color:"#86efac",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>✓ Gratis publicar</span>
            <span style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.8)",fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:20}}>⚡ Contacto directo</span>
            <span style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.8)",fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:20}}>📍 Solo San Fernando</span>
          </div>
        </div>

        {/* BOTÓN PUBLICAR */}
        <div style={{padding:"12px 16px 0"}}>
          <button onClick={()=>setShowPublicarRemate(!showPublicarRemate)} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:showPublicarRemate?"#64748b":"linear-gradient(135deg,#b45309,#f59e0b)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:showPublicarRemate?"none":"0 4px 16px rgba(245,158,11,0.4)",letterSpacing:-0.2}}>
            {showPublicarRemate?"✕ Cancelar":"➕ Publicar mi artículo gratis"}
          </button>
        </div>

        {/* FORMULARIO PUBLICAR REMATE */}
        {showPublicarRemate&&(
          <div style={{...s.sec,paddingTop:12}}>
            {pmsg&&<div style={s.msg(pmsg.includes("✅"))}>{pmsg}</div>}
            <div style={s.pc}>
              <div style={s.pT}>📦 Publicar artículo</div>
              <div style={{...s.ib,background:"#f0fdf4",marginBottom:12}}><div style={{fontSize:12,color:"#15803d"}}>✓ Gratis · El admin revisa antes de publicar · Tu WhatsApp va directo al comprador</div></div>
              <label style={s.lbl}>Título del artículo *</label>
              <input style={s.inp} placeholder="Televisor Samsung 32 pulgadas" value={newRemate.titulo} onChange={e=>setNewRemate({...newRemate,titulo:e.target.value})}/>
              <label style={s.lbl}>Categoría *</label>
              <select style={{...s.inp,background:"#fff"}} value={newRemate.categoria} onChange={e=>setNewRemate({...newRemate,categoria:e.target.value})}>{REMATE_CATS.map(c=><option key={c}>{c}</option>)}</select>
              <label style={s.lbl}>Descripción (estado, detalles)</label>
              <input style={s.inp} placeholder="Buen estado, funciona perfectamente, 2 años de uso..." value={newRemate.descripcion} onChange={e=>setNewRemate({...newRemate,descripcion:e.target.value})}/>
              <label style={s.lbl}>Precio ($) *</label>
              <input style={s.inp} type="number" placeholder="25.00" value={newRemate.precio} onChange={e=>setNewRemate({...newRemate,precio:e.target.value})}/>
              <label style={s.lbl}>Tu nombre *</label>
              <input style={s.inp} placeholder="Juan Pérez" value={newRemate.vendedor_nombre} onChange={e=>setNewRemate({...newRemate,vendedor_nombre:e.target.value})}/>
              <label style={s.lbl}>Tu WhatsApp * (compradores te escribirán aquí)</label>
              <input style={s.inp} placeholder="+58 424-000-0000" value={newRemate.vendedor_telefono} onChange={e=>setNewRemate({...newRemate,vendedor_telefono:e.target.value})}/>
              {/* UBICACIÓN */}
              <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>📍 Ubicación del artículo</div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}>
                    <label style={s.lbl}>Estado</label>
                    <select style={{...s.inp,marginBottom:0,background:"#fff"}} value={newRemate.estado||ubiActiva.estado} onChange={e=>setNewRemate({...newRemate,estado:e.target.value,municipio:""})}>
                      {Object.keys(VE_ESTADOS_MUNICIPIOS).sort().map(est=><option key={est}>{est}</option>)}
                    </select>
                  </div>
                  <div style={{flex:1}}>
                    <label style={s.lbl}>Municipio</label>
                    <select style={{...s.inp,marginBottom:0,background:"#fff"}} value={newRemate.municipio||ubiActiva.municipio} onChange={e=>setNewRemate({...newRemate,municipio:e.target.value})}>
                      {(VE_ESTADOS_MUNICIPIOS[newRemate.estado||ubiActiva.estado]||[]).map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <label style={s.lbl}>📸 Foto del artículo (muy recomendada)</label>
              {remateFotoPreview&&<img src={remateFotoPreview} alt="" style={{width:"100%",height:160,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
              <input type="file" accept="image/*" style={{marginBottom:10,fontSize:13}} onChange={e=>{const f=e.target.files[0];if(f){setRemateFoto(f);setRemateFotoPreview(URL.createObjectURL(f));}}}/>
              <button style={s.btn} onClick={publishRemate} disabled={loading}>{loading?"Enviando...":"📤 Enviar para publicación"}</button>
            </div>
          </div>
        )}

        {/* FILTROS */}
        {!showPublicarRemate&&(
          <div style={s.cs}>
            {["Todos",...REMATE_CATS].map(c=>(
              <button key={c} style={s.cb(remateCat===c)} onClick={()=>setRemateCat(c)}>{c}</button>
            ))}
          </div>
        )}

        {/* BUSCADOR */}
        {!showPublicarRemate&&(
          <div style={s.sw}>
            <input style={s.si} placeholder="🔍  Buscar artículo..." value={remateSearch} onChange={e=>setRemateSearch(e.target.value)}/>
          </div>
        )}

        {/* LISTA DE REMATES */}
        {!showPublicarRemate&&(
          <div style={{padding:"8px 16px 24px"}}>
            {remates.filter(r=>(remateCat==="Todos"||r.categoria===remateCat)&&(!remateSearch||r.titulo.toLowerCase().includes(remateSearch.toLowerCase())||r.descripcion?.toLowerCase().includes(remateSearch.toLowerCase()))).length===0&&(
              <div style={{textAlign:"center",padding:"48px 16px",color:"#94a3b8"}}>
                <div style={{fontSize:48,marginBottom:12}}>🏷️</div>
                <div style={{fontSize:15,fontWeight:700,color:"#475569",marginBottom:4}}>{remateSearch?"Sin resultados para \""+remateSearch+"\"":"No hay artículos en esta categoría"}</div>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:16}}>Sé el primero en publicar</div>
                <button onClick={()=>setShowPublicarRemate(true)} style={{...s.btn,maxWidth:240,margin:"0 auto",background:"linear-gradient(135deg,#b45309,#f59e0b)"}}>➕ Publicar artículo</button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {remates.filter(r=>(remateCat==="Todos"||r.categoria===remateCat)&&(!remateSearch||r.titulo.toLowerCase().includes(remateSearch.toLowerCase())||r.descripcion?.toLowerCase().includes(remateSearch.toLowerCase()))).map(r=>{
                const diasPublicado=Math.floor((new Date()-new Date(r.created_at))/(1000*60*60*24));
                const esNuevo=diasPublicado<2;
                return(
                  <div key={r.id} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #e8e8f0",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",display:"flex",flexDirection:"column"}}>
                    <div style={{position:"relative"}}>
                      {r.foto_url
                        ?<img src={r.foto_url} alt={r.titulo} style={{width:"100%",height:130,objectFit:"cover",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();abrirLightbox(r.foto_url,r.titulo,r.descripcion,r.precio);}}/>
                        :<div style={{height:100,background:"linear-gradient(135deg,#78350f,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>🏷️</div>
                      }
                      {esNuevo&&<span style={{position:"absolute",top:6,left:6,background:"#f59e0b",color:"#fff",fontSize:8,fontWeight:800,padding:"2px 7px",borderRadius:20,boxShadow:"0 2px 6px rgba(245,158,11,0.4)"}}>🔥 NUEVO</span>}
                    </div>
                    <div style={{padding:"8px 10px",flex:1,display:"flex",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:9,fontWeight:700,background:"#fef3c7",color:"#92400e",padding:"2px 7px",borderRadius:8,alignSelf:"flex-start"}}>{r.categoria}</span>
                      <div style={{fontSize:12,fontWeight:800,color:"#1e293b",lineHeight:1.3}}>{r.titulo}</div>
                      {r.descripcion&&<div style={{fontSize:10,color:"#94a3b8",lineHeight:1.3,flex:1}}>{r.descripcion.length>50?r.descripcion.slice(0,50)+"...":r.descripcion}</div>}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                        <div style={{fontSize:16,fontWeight:900,color:"#b45309"}}>${parseFloat(r.precio).toFixed(2)}</div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>{r.vendedor_nombre?.split(" ")[0]}</div>
                      </div>
                      <div style={{display:"flex",gap:6,marginTop:4}}>
                        <button onClick={e=>{e.stopPropagation();abrirWhatsApp(r.vendedor_whatsapp||r.vendedor_telefono,"Hola "+r.vendedor_nombre+", vi tu artículo *"+r.titulo+"* en Lokl y me interesa. ¿Sigue disponible?");}} style={{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"8px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                          📲 Contactar
                        </button>
                        <BtnCompartir titulo={r.titulo} precio={r.precio} tab="Mercadito local" id={r.id} emoji="🏷️" small={true}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>)}

      {/* NEGOCIOS LOCALES */}
      {tab==="Negocios locales"&&(<>
        {negocioActivo?(
          <div>
            {/* HEADER TIENDA — identidad del negocio */}
            <div style={{background:"linear-gradient(160deg,#0f172a 0%,#1e293b 65%,#1e3a5f 100%)",padding:"14px 16px 16px",color:"#fff"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <button onClick={()=>{setNegocioActivo(null);setCartNegocio({});setCartNegocioId(null);}} style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:12,cursor:"pointer",flexShrink:0}}>← Volver</button>
                {negocioActivo.logo_url
                  ?<img src={negocioActivo.logo_url} alt="" style={{width:48,height:48,borderRadius:14,objectFit:"cover",border:"2px solid rgba(255,255,255,0.2)",flexShrink:0}}/>
                  :<div style={{width:48,height:48,borderRadius:14,background:"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🏪</div>
                }
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:"#fff",fontWeight:900,fontSize:17,letterSpacing:-0.3}}>{negocioActivo.negocio}</div>
                  <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:1}}>{negocioActivo.descripcion_negocio||(negocioActivo.categorias||[]).join(" · ")}</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:estaAbiertoAhora(negocioActivo.horario_desde,negocioActivo.horario_hasta,negocioActivo.activo,negocioActivo.en_pausa,negocioActivo.forzar_abierto)?"#dcfce7":"#fee2e2",color:estaAbiertoAhora(negocioActivo.horario_desde,negocioActivo.horario_hasta,negocioActivo.activo,negocioActivo.en_pausa,negocioActivo.forzar_abierto)?"#15803d":"#dc2626",flexShrink:0,border:`1px solid ${estaAbiertoAhora(negocioActivo.horario_desde,negocioActivo.horario_hasta,negocioActivo.activo,negocioActivo.en_pausa,negocioActivo.forzar_abierto)?"#86efac":"#fca5a5"}`}}>{estaAbiertoAhora(negocioActivo.horario_desde,negocioActivo.horario_hasta,negocioActivo.activo,negocioActivo.en_pausa,negocioActivo.forzar_abierto)?"● Abierto":"● Cerrado"}</span>
              </div>
              {/* INFO CONFIANZA */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                {negocioActivo.direccion_fisica&&<span style={{fontSize:10,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.08)",padding:"3px 8px",borderRadius:20}}>📍 {negocioActivo.direccion_fisica}</span>}
                {negocioActivo.horario_desde&&<span style={{fontSize:10,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.08)",padding:"3px 8px",borderRadius:20}}>🕐 {negocioActivo.horario_desde}–{negocioActivo.horario_hasta}</span>}
                {negocioActivo.delivery_propio
                  ?<span style={{fontSize:10,color:"#86efac",fontWeight:600,background:"rgba(34,197,94,0.15)",padding:"3px 8px",borderRadius:20}}>🛵 Delivery disponible</span>
                  :<span style={{fontSize:10,color:"rgba(255,255,255,0.6)",background:"rgba(255,255,255,0.08)",padding:"3px 8px",borderRadius:20}}>🏃 Solo retiro</span>
                }
              </div>
              {/* CTA WHATSAPP + COMPARTIR */}
              <div style={{display:"flex",gap:8}}>
                {(negocioActivo.whatsapp_negocio||negocioActivo.telefono)&&(
                  <button onClick={()=>{const num=((negocioActivo.whatsapp_negocio||negocioActivo.telefono)||"").replace(/\D/g,"");const n=num.startsWith("0")?"58"+num.slice(1):num.startsWith("58")?num:"58"+num;window.location.href="https://wa.me/"+n+"?text="+encodeURIComponent("Hola, vi tu tienda "+negocioActivo.negocio+" en Lokl y quiero consultar algo");}} style={{flex:1,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,padding:"9px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    💬 Consultar por WhatsApp
                  </button>
                )}
                <button onClick={()=>toggleFavorito(negocioActivo.id,negocioActivo.negocio)} title={favoritos[negocioActivo.id]?"Quitar de favoritos":"Seguir esta tienda"} style={{background:favoritos[negocioActivo.id]?"rgba(239,68,68,0.25)":"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,padding:"9px 12px",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  {favoritos[negocioActivo.id]?"❤️":"🤍"}
                </button>
                <button onClick={()=>compartirEnWA({titulo:negocioActivo.negocio,tab:"Negocios locales",id:negocioActivo.id,emoji:"🏪"})} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,padding:"9px 12px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  🔗 Compartir
                </button>
              </div>
            </div>
            {/* BANNER CERRADO */}
            {!estaAbiertoAhora(negocioActivo.horario_desde,negocioActivo.horario_hasta,negocioActivo.activo,negocioActivo.en_pausa,negocioActivo.forzar_abierto)&&(
              <div style={{background:"#fff7ed",borderLeft:"4px solid #f97316",padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🔴</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#c2410c"}}>Esta tienda está cerrada ahora</div>
                  <div style={{fontSize:11,color:"#92400e"}}>Puedes ver el catálogo y hacer tu pedido — será atendido cuando abran</div>
                </div>
              </div>
            )}
            {/* BUSCADOR INTERNO */}
            <div style={{padding:"12px 16px 0"}}><input style={{width:"100%",padding:"11px 16px",borderRadius:12,border:"2px solid #e2e8f0",fontSize:13,background:"#fff",boxSizing:"border-box",outline:"none"}} placeholder="🔍  Buscar productos de esta tienda…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <div style={{...s.sec,paddingTop:8}}>
              <div style={s.grid}>
                {allProdsConMargen.filter(p=>p.kitchen===negocioActivo.negocio&&!p.proveedores?.en_pausa&&p.name.toLowerCase().includes(search.toLowerCase())).map(p=><CardNegocio key={p.id} p={p}/>)}
              </div>
              {allProdsConMargen.filter(p=>p.kitchen===negocioActivo.negocio).length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#94a3b8"}}><div style={{fontSize:36}}>🛍️</div><p style={{fontSize:13,fontWeight:600,color:"#64748b"}}>Esta tienda aún no tiene productos publicados</p><p style={{fontSize:11,marginTop:4}}>Vuelve pronto o consulta por WhatsApp</p></div>}
              {allProdsConMargen.filter(p=>p.kitchen===negocioActivo.negocio).length>0&&(
                <div style={{textAlign:"center",padding:"20px 16px",marginTop:8,background:"#f0fdf4",borderRadius:14,border:"1px solid #bbf7d0"}}>
                  <div style={{fontSize:13,color:"#15803d",fontWeight:600,lineHeight:1.5}}>💚 Apoyar a {negocioActivo.negocio} es apoyar a los emprendedores de San Fernando</div>
                </div>
              )}
            </div>

            {/* ── SECCIÓN RESEÑAS — negocio ── */}
            {(()=>{
              const rList=provResenas[negocioActivo.id]||[];
              const avg=rList.length>0?(rList.reduce((a,r)=>a+r.estrellas,0)/rList.length).toFixed(1):null;
              return(
                <div style={{margin:"0 16px 16px",background:"#fff",borderRadius:16,padding:16,border:"1px solid #f1f5f9",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:16,fontWeight:900,color:"#0f172a"}}>⭐ Reseñas</span>
                      {avg&&<span style={{fontSize:15,fontWeight:900,color:"#f59e0b"}}>{avg}</span>}
                      {rList.length>0&&<span style={{fontSize:11,color:"#94a3b8"}}>({rList.length} opinión{rList.length!==1?"es":""})</span>}
                    </div>
                    <button onClick={()=>setShowProvResenasId(showProvResenasId===negocioActivo.id?null:negocioActivo.id)}
                      style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:20,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#1d4ed8",cursor:"pointer"}}>
                      {showProvResenasId===negocioActivo.id?"Cerrar":"✍️ Dejar reseña"}
                    </button>
                  </div>
                  {showProvResenasId===negocioActivo.id&&(
                    <div style={{background:"#f8fafc",borderRadius:12,padding:12,marginBottom:12,border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>Tu calificación</div>
                      <div style={{display:"flex",gap:6,marginBottom:10}}>
                        {[1,2,3,4,5].map(n=>(
                          <span key={n} onClick={()=>setProvResenasForm(f=>({...f,estrellas:n}))}
                            style={{fontSize:28,cursor:"pointer",color:provResenasForm.estrellas>=n?"#f59e0b":"#e2e8f0",transition:"color 0.1s"}}>★</span>
                        ))}
                      </div>
                      <input style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none"}}
                        placeholder="Tu nombre *" value={provResenasForm.nombre}
                        onChange={e=>setProvResenasForm(f=>({...f,nombre:e.target.value}))}/>
                      <textarea style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none",resize:"none",fontFamily:"inherit"}}
                        rows={3} placeholder="¿Cómo fue tu experiencia? (opcional)"
                        value={provResenasForm.comentario}
                        onChange={e=>setProvResenasForm(f=>({...f,comentario:e.target.value}))}/>
                      {provResenasMsj&&<div style={{fontSize:12,fontWeight:600,color:provResenasMsj.includes("✅")?"#15803d":"#dc2626",marginBottom:8}}>{provResenasMsj}</div>}
                      <button onClick={()=>enviarResenaProveedor(negocioActivo.id,negocioActivo.negocio)}
                        style={{width:"100%",background:"#1d4ed8",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                        Enviar reseña
                      </button>
                    </div>
                  )}
                  {rList.length===0&&showProvResenasId!==negocioActivo.id&&(
                    <div style={{textAlign:"center",padding:"10px 0",color:"#94a3b8",fontSize:12}}>Sé el primero en dejar una reseña</div>
                  )}
                  {rList.slice(0,5).map((r,i)=>(
                    <div key={i} style={{paddingBottom:10,marginBottom:10,borderBottom:i<rList.slice(0,5).length-1?"1px solid #f1f5f9":"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{r.cliente_nombre}</div>
                        <div style={{fontSize:12,color:"#f59e0b",letterSpacing:1}}>{"★".repeat(r.estrellas)}{"☆".repeat(5-r.estrellas)}</div>
                      </div>
                      {r.comentario&&<div style={{fontSize:12,color:"#475569",lineHeight:1.4}}>{r.comentario}</div>}
                      <div style={{fontSize:10,color:"#cbd5e1",marginTop:3}}>{(()=>{const d=new Date(r.created_at);const now=new Date();const diff=Math.floor((now.getTime()-d.getTime())/86400000);return diff<=0?"Hoy":diff===1?"Ayer":diff<7?`Hace ${diff} días`:diff<30?`Hace ${Math.floor(diff/7)} semana(s)`:d.toLocaleDateString("es-VE",{month:"short",year:"numeric"});})()}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
            {Object.values(cartNegocio).length>0&&(
              <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",zIndex:150,width:"calc(100% - 32px)",maxWidth:398}}>
                <button style={{...s.btn,margin:0,display:"flex",justifyContent:"space-between",alignItems:"center",background:"#22c55e"}} onClick={()=>setSheet("cartGlobal")}>
                  <span>🛒 Ver pedido ({Object.values(cartNegocio).reduce((a,i)=>a+i.qty,0)})</span>
                  <span>${Object.values(cartNegocio).reduce((a,i)=>a+i.price*i.qty,0).toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>
        ):(
          <>
            <div style={{background:"linear-gradient(160deg,#0f172a 0%,#1e293b 65%,#1e3a5f 100%)",padding:"18px 16px 16px",color:"#fff"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{width:48,height:48,background:"#3b82f6",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:"0 2px 8px rgba(59,130,246,0.4)"}}>🏪</div>
                <div>
                  <div style={{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:-0.5}}>Negocios locales</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:1}}>Descubre y apoya las tiendas de San Fernando</div>
                </div>
              </div>
            </div>
            <div style={{padding:"12px 16px 0"}}><input style={{width:"100%",padding:"12px 16px",borderRadius:14,border:"2px solid #e2e8f0",fontSize:14,background:"#fff",boxSizing:"border-box",outline:"none",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}} placeholder="🔍  Buscar tiendas o negocios…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
            {!negocioCatFiltro&&search.length<2?(
              <>
                <div style={{padding:"12px 16px 4px"}}>
                  {(()=>{
                    // Categorías que tienen al menos un producto de una tienda (negocio local)
                    const idsNeg=new Set(allNegocios.map(n=>n.id));
                    const catsConProductos=new Set(provProds.filter(p=>idsNeg.has(p.proveedor_id)).map(p=>p.categoria));
                    const catsVisibles=NEGOCIO_LOCAL_CATS.filter(c=>catsConProductos.has(c.cat));
                    if(catsVisibles.length===0)return null;
                    return(<>
                      <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:10}}>Explorar por categoría</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                        {catsVisibles.map(c=>(
                          <button key={c.cat} onClick={()=>setNegocioCatFiltro(c.cat)} style={{background:c.color,border:"none",borderRadius:12,padding:"10px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
                            <span style={{fontSize:22}}>{c.emoji}</span>
                            <span style={{fontSize:9,fontWeight:600,color:c.tc,textAlign:"center",lineHeight:1.2}}>{c.cat.split(" ").slice(0,2).join(" ")}</span>
                          </button>
                        ))}
                      </div>
                    </>);
                  })()}
                </div>
                <div style={{...s.sec,paddingTop:8}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#0f172a",marginBottom:12,letterSpacing:-0.2}}>{allNegocios.length>0?`${allNegocios.length} tienda${allNegocios.length===1?"":"s"} disponible${allNegocios.length===1?"":"s"}`:"Tiendas del centro comercial virtual"}</div>
                  {allNegocios.length===0&&(
                    <div style={{textAlign:"center",padding:"28px 16px",color:"#94a3b8",background:"#f8fafc",borderRadius:16,border:"1px dashed #e2e8f0",marginBottom:16}}>
                      <div style={{fontSize:40,marginBottom:8}}>🏪</div>
                      <div style={{fontSize:13,fontWeight:600,color:"#475569",marginBottom:4}}>Sin negocios en {ubiActiva.municipio} aún</div>
                      <div style={{fontSize:11,color:"#94a3b8",marginBottom:12}}>¿Tienes una tienda o negocio local? ¡Regístrate gratis!</div>
                      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                        <button onClick={()=>setTab("Proveedores")} style={{background:"#1d4ed8",color:"#fff",border:"none",borderRadius:10,padding:"9px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>🏪 Registra tu negocio</button>
                        <button onClick={()=>{setCiudadTemp({estado:ubiActiva.estado,municipio:ubiActiva.municipio});setShowCiudadModal(true);}} style={{background:"none",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:10,padding:"9px 14px",fontSize:12,cursor:"pointer"}}>📍 Cambiar ciudad</button>
                      </div>
                    </div>
                  )}
                  {allNegocios.map(n=>(
                    <div key={n.id} onClick={()=>{setNegocioActivo(n);setCartNegocioId(n.id);setCartNegocioNombre(n.negocio);setCartNegocioWa(n.whatsapp_negocio||n.telefono);setSearch("");loadProvResenas(n.id);}} style={{background:"#fff",borderRadius:16,padding:14,border:"1px solid #e2e8f0",display:"flex",gap:12,alignItems:"center",marginBottom:10,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                      {n.logo_url
                        ?<img src={n.logo_url} alt="" style={{width:58,height:58,borderRadius:14,objectFit:"cover",flexShrink:0,border:"2px solid #f1f5f9"}}/>
                        :<div style={{width:58,height:58,borderRadius:14,background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>🏪</div>
                      }
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:15,fontWeight:800,color:"#0f172a",letterSpacing:-0.2}}>{n.negocio}</div>
                        <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{(n.categorias||[]).join(" · ")} · {n.municipio||ubiActiva.municipio}</div>
                        {n.descripcion&&<div style={{fontSize:10,color:"#94a3b8",marginTop:2,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.descripcion}</div>}
                        <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                          <span style={{fontSize:10,fontWeight:600,color:estaAbiertoAhora(n.horario_desde,n.horario_hasta,n.activo,n.en_pausa,n.forzar_abierto)?"#15803d":"#94a3b8",background:estaAbiertoAhora(n.horario_desde,n.horario_hasta,n.activo,n.en_pausa,n.forzar_abierto)?"#dcfce7":"#f1f5f9",padding:"2px 7px",borderRadius:8}}>{estaAbiertoAhora(n.horario_desde,n.horario_hasta,n.activo,n.en_pausa,n.forzar_abierto)?"● Abierto":"● Cerrado"}</span>
                          {n.delivery_propio&&<span style={{fontSize:10,background:"#dbeafe",color:"#1d4ed8",padding:"2px 7px",borderRadius:8,fontWeight:600}}>🛵 Delivery</span>}
                          {n.permite_retiro&&<span style={{fontSize:10,background:"#eff6ff",color:"#3b82f6",padding:"2px 7px",borderRadius:8,fontWeight:600}}>🏪 Retiro</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flexShrink:0}}>
                        <div style={{color:"#3b82f6",fontSize:20,fontWeight:300}}>›</div>
                        <BtnCompartir titulo={n.negocio} tab="Negocios locales" id={n.id} emoji="🏪" small={true}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div onClick={()=>setTab("Proveedores")} style={{background:"linear-gradient(135deg,#1e3a5f,#1d4ed8)",borderRadius:16,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginTop:4}}>
                  <span style={{fontSize:30}}>🏬</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:800,color:"#fff",letterSpacing:-0.2}}>¿Tienes un negocio en San Fernando?</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>Abre tu tienda en Lokl y muestra tus productos</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"6px 10px",fontSize:11,color:"#fff",fontWeight:700,whiteSpace:"nowrap"}}>Abrir tienda →</div>
                </div>
              </>
            ):(
              <div style={s.sec}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"8px 0 12px"}}>
                  <div style={{fontSize:13,fontWeight:700}}>{negocioCatFiltro||`"${search}"`}</div>
                  <button onClick={()=>{setNegocioCatFiltro(null);setSearch("");}} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer"}}>← Volver</button>
                </div>
                {[...allNegocios].sort((a,b)=>{const aAb=estaAbiertoAhora(a.horario_desde,a.horario_hasta,a.activo,a.en_pausa,a.forzar_abierto);const bAb=estaAbiertoAhora(b.horario_desde,b.horario_hasta,b.activo,b.en_pausa,b.forzar_abierto);return bAb-aAb;}).filter(n=>{
                  if(negocioCatFiltro){
                    // La tienda entra si su categoría la incluye O si tiene productos de esa categoría
                    const catEnTienda=(n.categorias||[]).includes(negocioCatFiltro);
                    const catEnProductos=provProds.some(p=>p.proveedor_id===n.id&&p.categoria===negocioCatFiltro);
                    return catEnTienda||catEnProductos;
                  }
                  return n.negocio.toLowerCase().includes(search.toLowerCase());
                }).map(n=>{
  const abiertoN=estaAbiertoAhora(n.horario_desde,n.horario_hasta,n.activo,n.en_pausa,n.forzar_abierto);
  return(
                  <div key={n.id} onClick={()=>{setNegocioActivo(n);setCartNegocioId(n.id);setCartNegocioNombre(n.negocio);setCartNegocioWa(n.whatsapp_negocio||n.telefono);setSearch("");}} style={{background:abiertoN?"#fff":"#f8fafc",borderRadius:14,padding:14,border:`1px solid ${abiertoN?"#f1f5f9":"#e2e8f0"}`,display:"flex",gap:12,alignItems:"center",marginBottom:10,cursor:"pointer",opacity:abiertoN?1:0.72,position:"relative"}}>
                    {!abiertoN&&<div style={{position:"absolute",top:8,right:8,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20,letterSpacing:0.5}}>CERRADO</div>}
                    {n.logo_url?<img src={n.logo_url} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover",flexShrink:0}}/>:<div style={{width:52,height:52,borderRadius:12,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🏪</div>}
                    <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:1}}><div style={{fontSize:14,fontWeight:700,color:P,flex:1}}>{n.negocio}</div>{abiertoN&&<span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:20,background:"#dcfce7",color:"#15803d",flexShrink:0}}>● Abierto</span>}</div><div style={{fontSize:11,color:"#64748b"}}>{(n.categorias||[]).join(" · ")}</div>{promediosResenas[n.id]&&(<div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}><span style={{color:"#f59e0b",fontSize:11}}>★</span><span style={{fontSize:11,fontWeight:700,color:"#0f172a"}}>{promediosResenas[n.id].avg}</span><span style={{fontSize:10,color:"#94a3b8"}}>({promediosResenas[n.id].count})</span></div>)}{n.direccion_fisica&&<div style={{fontSize:10,color:"#94a3b8"}}>📍 {n.direccion_fisica}</div>}</div>
                    <div style={{color:"#94a3b8",fontSize:18}}>›</div>
                  </div>
                );})}
                {allNegocios.filter(n=>{
                  if(negocioCatFiltro){
                    const catEnTienda=(n.categorias||[]).includes(negocioCatFiltro);
                    const catEnProductos=provProds.some(p=>p.proveedor_id===n.id&&p.categoria===negocioCatFiltro);
                    return catEnTienda||catEnProductos;
                  }
                  return n.negocio.toLowerCase().includes(search.toLowerCase());
                }).length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#94a3b8"}}><div style={{fontSize:36,marginBottom:8}}>🔍</div><div style={{fontSize:13,fontWeight:600,color:"#64748b"}}>No encontramos tiendas en esta categoría</div><div style={{fontSize:11,marginTop:4}}>Los negocios locales estarán disponibles muy pronto</div></div>}
              </div>
            )}
          </>
        )}
      </>)}

      {tab==="Feria de comida"&&(<>
        {restauranteActivo?(
          /* -- MENÚ DEL RESTAURANTE -- */
          <div>
            {/* HEADER RESTAURANTE — emocional */}
            <div style={{background:"linear-gradient(160deg,#7c2d12 0%,#c2410c 70%,#ea580c 100%)",color:"#fff"}}>
              <div style={{padding:"12px 16px 14px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <button onClick={()=>{setRestauranteActivo(null);}} style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:12,cursor:"pointer",flexShrink:0}}>← Volver</button>
                  <div style={{width:52,height:52,borderRadius:"50%",background:restauranteActivo.logo_url?"#fff":getAvatarColor(restauranteActivo.negocio),flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:restauranteActivo.logo_url?4:0,border:"2px solid rgba(255,255,255,0.3)"}}>
                    {restauranteActivo.logo_url
                      ?<img src={restauranteActivo.logo_url} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}} onError={e=>{e.target.style.display="none";e.target.parentNode.style.background=getAvatarColor(restauranteActivo.negocio);e.target.parentNode.innerHTML=`<span style="color:#fff;font-size:20px;font-weight:900">${(restauranteActivo.negocio||"?")[0].toUpperCase()}</span>`;}}/>
                      :<span style={{color:"#fff",fontSize:20,fontWeight:900}}>{(restauranteActivo.negocio||"?")[0].toUpperCase()}</span>
                    }
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:"#fff",fontWeight:900,fontSize:17,letterSpacing:-0.3}}>{restauranteActivo.negocio}</div>
                    <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginTop:1}}>{restauranteActivo.tipo_operacion_gastro?TIPO_GASTRO_LABEL[restauranteActivo.tipo_operacion_gastro]:""}{restauranteActivo.descripcion_negocio?` · ${restauranteActivo.descripcion_negocio}`:""}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:estaAbiertoAhora(restauranteActivo.horario_desde,restauranteActivo.horario_hasta,restauranteActivo.activo,restauranteActivo.en_pausa,restauranteActivo.forzar_abierto)?"#dcfce7":"#fee2e2",color:estaAbiertoAhora(restauranteActivo.horario_desde,restauranteActivo.horario_hasta,restauranteActivo.activo,restauranteActivo.en_pausa,restauranteActivo.forzar_abierto)?"#15803d":"#dc2626",flexShrink:0}}>{estaAbiertoAhora(restauranteActivo.horario_desde,restauranteActivo.horario_hasta,restauranteActivo.activo,restauranteActivo.en_pausa,restauranteActivo.forzar_abierto)?"● Abierto":"● Cerrado"}</span>
                </div>
                {/* INFO RÁPIDA */}
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                  {restauranteActivo.horario_desde&&<span style={{fontSize:10,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.1)",padding:"3px 8px",borderRadius:20}}>🕐 {restauranteActivo.horario_desde}–{restauranteActivo.horario_hasta}</span>}
                  {restauranteActivo.delivery_propio
                    ?<span style={{fontSize:10,color:"#86efac",fontWeight:600,background:"rgba(34,197,94,0.15)",padding:"3px 8px",borderRadius:20}}>🛵 Delivery {restauranteActivo.delivery_costo>0?`$${restauranteActivo.delivery_costo}`:"gratis"}</span>
                    :<span style={{fontSize:10,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.1)",padding:"3px 8px",borderRadius:20}}>🏃 Solo retiro en local</span>
                  }
                  {(restauranteActivo.eta_texto||(restauranteActivo.eta_minutos_min&&restauranteActivo.eta_minutos_max))&&(
                    <span style={{fontSize:10,background:"rgba(251,191,36,0.2)",color:"#fbbf24",padding:"3px 8px",borderRadius:20,fontWeight:600}}>⏱️ {restauranteActivo.eta_texto||`${restauranteActivo.eta_minutos_min}–${restauranteActivo.eta_minutos_max} min`}</span>
                  )}
                  {!restauranteActivo.direccion_fisica&&!restauranteActivo.delivery_propio&&<span style={{fontSize:10,color:"rgba(255,255,255,0.6)",background:"rgba(255,255,255,0.08)",padding:"3px 8px",borderRadius:20}}>📦 Solo delivery · Pedido online</span>}
                </div>
                {/* BUSCADOR */}
                <input style={{width:"100%",padding:"10px 14px",borderRadius:12,border:"none",fontSize:13,background:"rgba(255,255,255,0.15)",color:"#fff",boxSizing:"border-box",outline:"none"}} placeholder="🔍  Buscar en el menú…" value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
            </div>
            {/* INFO RESTAURANTE VS COCINA OSCURA */}
            {(restauranteActivo.direccion_fisica||restauranteActivo.delivery_propio)&&(
              <div style={{background:"#fff7ed",borderLeft:"4px solid #ea580c",padding:"8px 16px",fontSize:11,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {restauranteActivo.direccion_fisica&&<span style={{color:"#92400e"}}>📍 {restauranteActivo.direccion_fisica}</span>}
                {restauranteActivo.direccion_fisica&&!restauranteActivo.delivery_propio&&<span style={{color:"#15803d",fontWeight:600}}>· 🏃 Retiro disponible</span>}
                {!restauranteActivo.direccion_fisica&&restauranteActivo.delivery_propio&&<span style={{color:"#c2410c",fontWeight:600}}>🚚 Solo delivery · Pedido online</span>}
              </div>
            )}
            {/* CTA PRINCIPAL */}
            {Object.values(cartRest).length===0&&(
              <div style={{padding:"12px 16px 4px",display:"flex",gap:8}}>
                <button onClick={()=>{const num=((restauranteActivo.whatsapp_negocio||restauranteActivo.telefono)||"").replace(/\D/g,"");const n=num.startsWith("0")?"58"+num.slice(1):num.startsWith("58")?num:"58"+num;window.location.href="https://wa.me/"+n+"?text="+encodeURIComponent("Hola "+restauranteActivo.negocio+", quiero hacer un pedido");}} style={{flex:1,background:"linear-gradient(135deg,#ea580c,#c2410c)",color:"#fff",border:"none",borderRadius:14,padding:"13px",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 12px rgba(234,88,12,0.35)"}}>
                  🍽️ Pedir por WhatsApp
                </button>
                <button onClick={()=>toggleFavorito(restauranteActivo.id,restauranteActivo.negocio)} title={favoritos[restauranteActivo.id]?"Quitar de favoritos":"Seguir este restaurante"} style={{background:favoritos[restauranteActivo.id]?"#fee2e2":"#f0fdf4",border:"1px solid #86efac",borderRadius:14,padding:"13px 14px",color:"#15803d",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  {favoritos[restauranteActivo.id]?"❤️":"🤍"}
                </button>
                <button onClick={()=>compartirEnWA({titulo:restauranteActivo.negocio,tab:"Feria de comida",id:restauranteActivo.id,emoji:"🍽️"})} style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:14,padding:"13px 14px",color:"#15803d",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  🔗 Compartir
                </button>
              </div>
            )}
            {/* MENÚ ESTRUCTURADO */}
            <div style={s.sec}>
              {(()=>{
                const todosProds=allProdsConMargen.filter(p=>p.kitchen===restauranteActivo.negocio&&p.name.toLowerCase().includes(search.toLowerCase()));
                const combos=todosProds.filter(p=>p.name?.toLowerCase().includes("combo")||p.name?.toLowerCase().includes("promo")||p.isPromo);
                const resto=todosProds.filter(p=>!p.name?.toLowerCase().includes("combo")&&!p.name?.toLowerCase().includes("promo")&&!p.isPromo);
                const iconoTipo={"Hamburguesas":"🍔","Perros calientes":"🌭","Pizzería":"🍕","Pastas":"🍝","Comida criolla":"🍲","Arepas":"🫓","Cachapas":"🥞","Panadería":"🍞","Pastelería":"🎂","Postres":"🍰","Jugos naturales":"🥤","Batidos":"🥛","Bebidas frías":"🧃","Café":"☕","Comida saludable":"🥗","Vegetariana":"🥦","Mariscos":"🦐","Pescado frito":"🐟","Comida rápida":"⚡","Alitas / Nuggets":"🍗","Papas fritas":"🍟","Salchipapas":"🍟","Combos":"🔥","Menú del día":"📋","Especiales":"⭐"};
                const catsProv=restauranteActivo.categorias?.length>0?restauranteActivo.categorias:PROV_CATS;
                const secciones=[
                  {key:"combos",label:"🔥 Promos recomendadas",items:combos,highlight:true},
                  ...catsProv.filter(cat=>cat!=="Combos"&&cat!=="Especiales"&&cat!=="Menú del día").map(cat=>({
                    key:cat,
                    label:`${iconoTipo[cat]||"🍽️"} ${cat}`,
                    items:resto.filter(p=>p.cat===cat||p.name?.toLowerCase().includes(cat.toLowerCase())),
                    highlight:false
                  })),
                  {key:"otros",label:"🍽️ Otros platos",items:resto.filter(p=>!catsProv.some(c=>p.cat===c||p.name?.toLowerCase().includes(c.toLowerCase()))),highlight:false}
                ].filter(s=>s.items.length>0);
                if(secciones.length===0)return <div style={{textAlign:"center",padding:"40px 0",color:"#94a3b8"}}><div style={{fontSize:40}}>🍽️</div><p>No hay platos disponibles ahora</p></div>;
                return secciones.map(sec=>(
                  <div key={sec.key} style={{marginBottom:16}}>
                    <div style={{fontSize:13,fontWeight:800,color:sec.highlight?"#c2410c":"#0f172a",letterSpacing:-0.2,margin:"14px 0 10px",paddingBottom:6,borderBottom:`2px solid ${sec.highlight?"#fed7aa":"#f1f5f9"}`}}>{sec.label}</div>
                    {sec.highlight?(
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {sec.items.map(p=>{
                          const qtyRest=cartRest[p.id]?.qty||0;
                          return(
                          <div key={p.id} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"2px solid #fed7aa",boxShadow:"0 3px 12px rgba(249,115,22,0.12)",cursor:"pointer"}} onClick={()=>setPlatoDetalle(p)}>
                            {/* IMAGEN CLICKABLE → ZOOM */}
                            <div style={{position:"relative"}}>
                              {p.foto
                                ?<img src={p.foto} alt={p.name} style={{width:"100%",height:130,objectFit:"cover",display:"block",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();setImgZoom(p.foto);}}/>
                                :<div style={{height:130,background:"linear-gradient(135deg,#fff7ed,#fde68a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>🎁</div>
                              }
                              <div style={{position:"absolute",top:8,left:8,background:"#f97316",color:"#fff",fontSize:9,fontWeight:900,padding:"3px 9px",borderRadius:20,letterSpacing:0.3}}>🔥 PROMO</div>
                            </div>
                            {/* INFO */}
                            <div style={{padding:"10px 12px 12px"}}>
                              <div style={{fontSize:13,fontWeight:800,color:"#0f172a",lineHeight:1.3,marginBottom:3}}>{p.name}</div>
                              {p.descripcion&&<div style={{fontSize:11,color:"#64748b",lineHeight:1.4,marginBottom:4}}>{p.descripcion.length>70?p.descripcion.slice(0,70)+"…":p.descripcion}</div>}
                              <div style={{fontSize:10,color:"#f97316",fontWeight:600,marginBottom:8}}>💰 Ahorra más con esta promo</div>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                <div style={{fontSize:18,fontWeight:900,color:"#ef4444",letterSpacing:-0.3}}>${p.price.toFixed(2)}</div>
                                {qtyRest>0?(
                                  <div style={s.qR}>
                                    <button style={s.qB} onClick={e=>{e.stopPropagation();const n={...cartRest};n[p.id].qty>1?n[p.id]={...n[p.id],qty:n[p.id].qty-1}:delete n[p.id];setCartRest(n);}}>−</button>
                                    <span style={s.qN}>{qtyRest}</span>
                                    <button style={s.qB} onClick={e=>{e.stopPropagation();setCartRest(c=>({...c,[p.id]:{...p,qty:qtyRest+1}}))}}>+</button>
                                  </div>
                                ):(
                                  <button style={{background:"#f97316",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontSize:11,fontWeight:800,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setCartRest(c=>({...c,[p.id]:{...p,qty:(c[p.id]?.qty||0)+1}}))}}>+ Agregar Promo</button>
                                )}
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    ):(
                      <div style={s.grid}>{sec.items.map(p=><CardRest key={p.id} p={p}/>)}</div>
                    )}
                  </div>
                ));
              })()}
            </div>

            {/* ── SECCIÓN RESEÑAS — restaurante ── */}
            {(()=>{
              const rList=provResenas[restauranteActivo.id]||[];
              const avg=rList.length>0?(rList.reduce((a,r)=>a+r.estrellas,0)/rList.length).toFixed(1):null;
              return(
                <div style={{margin:"0 16px 16px",background:"#fff",borderRadius:16,padding:16,border:"1px solid #f1f5f9",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                  {/* CABECERA */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:16,fontWeight:900,color:"#0f172a"}}>⭐ Reseñas</span>
                      {avg&&<span style={{fontSize:15,fontWeight:900,color:"#f59e0b"}}>{avg}</span>}
                      {rList.length>0&&<span style={{fontSize:11,color:"#94a3b8"}}>({rList.length} opinión{rList.length!==1?"es":""})</span>}
                    </div>
                    <button onClick={()=>setShowProvResenasId(showProvResenasId===restauranteActivo.id?null:restauranteActivo.id)}
                      style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:20,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#15803d",cursor:"pointer"}}>
                      {showProvResenasId===restauranteActivo.id?"Cerrar":"✍️ Dejar reseña"}
                    </button>
                  </div>
                  {/* FORMULARIO NUEVA RESEÑA */}
                  {showProvResenasId===restauranteActivo.id&&(
                    <div style={{background:"#f8fafc",borderRadius:12,padding:12,marginBottom:12,border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>Tu calificación</div>
                      <div style={{display:"flex",gap:6,marginBottom:10}}>
                        {[1,2,3,4,5].map(n=>(
                          <span key={n} onClick={()=>setProvResenasForm(f=>({...f,estrellas:n}))}
                            style={{fontSize:28,cursor:"pointer",color:provResenasForm.estrellas>=n?"#f59e0b":"#e2e8f0",transition:"color 0.1s"}}>★</span>
                        ))}
                      </div>
                      <input style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none"}}
                        placeholder="Tu nombre *" value={provResenasForm.nombre}
                        onChange={e=>setProvResenasForm(f=>({...f,nombre:e.target.value}))}/>
                      <textarea style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none",resize:"none",fontFamily:"inherit"}}
                        rows={3} placeholder="¿Cómo estuvo la comida? (opcional)"
                        value={provResenasForm.comentario}
                        onChange={e=>setProvResenasForm(f=>({...f,comentario:e.target.value}))}/>
                      {provResenasMsj&&<div style={{fontSize:12,fontWeight:600,color:provResenasMsj.includes("✅")?"#15803d":"#dc2626",marginBottom:8}}>{provResenasMsj}</div>}
                      <button onClick={()=>enviarResenaProveedor(restauranteActivo.id,restauranteActivo.negocio)}
                        style={{width:"100%",background:"#22c55e",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                        Enviar reseña
                      </button>
                    </div>
                  )}
                  {/* LISTA DE RESEÑAS */}
                  {rList.length===0&&showProvResenasId!==restauranteActivo.id&&(
                    <div style={{textAlign:"center",padding:"10px 0",color:"#94a3b8",fontSize:12}}>Sé el primero en dejar una reseña</div>
                  )}
                  {rList.slice(0,5).map((r,i)=>(
                    <div key={i} style={{paddingBottom:10,marginBottom:10,borderBottom:i<rList.slice(0,5).length-1?"1px solid #f1f5f9":"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{r.cliente_nombre}</div>
                        <div style={{fontSize:12,color:"#f59e0b",letterSpacing:1}}>{"★".repeat(r.estrellas)}{"☆".repeat(5-r.estrellas)}</div>
                      </div>
                      {r.comentario&&<div style={{fontSize:12,color:"#475569",lineHeight:1.4}}>{r.comentario}</div>}
                      <div style={{fontSize:10,color:"#cbd5e1",marginTop:3}}>{(()=>{const d=new Date(r.created_at);const now=new Date();const diff=Math.floor((now.getTime()-d.getTime())/86400000);return diff<=0?"Hoy":diff===1?"Ayer":diff<7?`Hace ${diff} días`:diff<30?`Hace ${Math.floor(diff/7)} semana(s)`:d.toLocaleDateString("es-VE",{month:"short",year:"numeric"});})()}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
            {/* CARRITO RESTAURANTE FLOTANTE */}
            {Object.values(cartRest).length>0&&(
              <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",zIndex:150,width:"calc(100% - 32px)",maxWidth:398}}>
                <button style={{...s.btn,margin:0,display:"flex",justifyContent:"space-between",alignItems:"center",background:"#22c55e"}} onClick={()=>setSheet("cartGlobal")}>
                  <span>🛒 Ver pedido ({Object.values(cartRest).reduce((a,i)=>a+i.qty,0)})</span>
                  <span>${Object.values(cartRest).reduce((a,i)=>a+i.price*i.qty,0).toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>
        ):(
          /* -- LISTA DE RESTAURANTES -- */
          <>
            <div style={{background:"linear-gradient(160deg,#7c2d12 0%,#c2410c 60%,#ea580c 100%)",padding:"18px 16px 16px",color:"#fff"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{width:48,height:48,background:"rgba(255,255,255,0.15)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>🍽️</div>
                <div>
                  <div style={{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:-0.5}}>Feria de comida</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:1}}>Restaurantes, cocinas y más de {ubiActiva.municipio}</div>
                </div>
              </div>
              <input style={{width:"100%",padding:"11px 16px",borderRadius:12,border:"none",fontSize:13,background:"rgba(255,255,255,0.15)",color:"#fff",boxSizing:"border-box",outline:"none"}} placeholder="🔍  Buscar comida o restaurantes…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {/* BÚSQUEDA - mantenemos variable */}
            <div style={{display:"none"}}><input value={search} onChange={e=>setSearch(e.target.value)}/></div>
            {/* SI HAY BÚSQUEDA - mostrar platos de todos los restaurantes */}
            {search.length>1?(
              <div style={s.sec}>
                <div style={s.sT}>Resultados para "{search}"</div>
                <div style={s.grid}>
                  {allProdsConMargen.filter(p=>p.cat!=="Supermercado"&&p.name.toLowerCase().includes(search.toLowerCase())&&p.abierto).map(p=>(
                    <div key={p.id} style={s.card}>
                      {p.foto?<img src={p.foto} alt={p.name} style={s.cImg}/>:<div style={s.cEm}>🍽️</div>}
                      {p.kitchen&&<div style={s.cKt}>{p.logo&&<img src={p.logo} alt="" style={s.cLogo}/>}<span>{p.kitchen}</span></div>}
                      <div style={s.cNm}>{p.name}</div>
                      {p.descripcion&&<div style={{fontSize:10,color:"#94a3b8"}}>{p.descripcion}</div>}
                      <div style={s.cBt}>
                        <div><div style={s.cPr}>${p.price.toFixed(2)}</div><div style={s.cUn}>/{p.unit}</div></div>
                        <button onClick={()=>{const rest=allRestaurantes.find(r=>r.negocio===p.kitchen);if(rest){setRestauranteActivo(rest);setCartRestId(rest.id);setCartRestNombre(rest.negocio);setCartRestWa(rest.whatsapp_negocio||rest.telefono);}}} style={{...s.aBtn,fontSize:12,padding:"4px 10px",width:"auto",borderRadius:8}}>Ver menú</button>
                      </div>
                    </div>
                  ))}
                  {allProdsConMargen.filter(p=>p.cat!=="Supermercado"&&p.name.toLowerCase().includes(search.toLowerCase())).length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#94a3b8",gridColumn:"1/-1"}}>No encontramos "{search}"</div>}
                </div>
              </div>
            ):(
              /* LISTA DE RESTAURANTES */
              <>
              {/* BANNER PROMOS PREMIUM */}
              {provPromos.length>0&&(
                <div style={{padding:"12px 16px 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>🔥 Ofertas destacadas</div>
                    <span style={{fontSize:10,background:"#f59e0b",color:"#fff",padding:"2px 8px",borderRadius:20,fontWeight:700}}>HOT</span>
                  </div>
                  <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
                    {provPromos.slice(0,5).map(p=>(
                      <div key={p.id} style={{flexShrink:0,width:200,borderRadius:14,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",position:"relative"}}
                        onClick={()=>{const r=allRestaurantes.find(x=>x.negocio===p.proveedores?.negocio);if(r){setRestauranteActivo(r);setCartRestId(r.id);setCartRestNombre(r.negocio);setCartRestWa(r.whatsapp_negocio||r.telefono);}}}>
                        {p.foto_url
                          ?<img src={p.foto_url} alt={p.nombre} style={{width:"100%",height:110,objectFit:"cover"}}/>
                          :<div style={{height:110,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>🎁</div>
                        }
                        {/* Badge precio */}
                        <div style={{position:"absolute",top:8,right:8,background:"#ef4444",color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700}}>${parseFloat(p.precio||0).toFixed(2)}</div>
                        {/* Info */}
                        <div style={{padding:"8px 10px",background:"#fff"}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#1e293b",lineHeight:1.3}}>{p.nombre}</div>
                          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:3}}>
                            {p.proveedores?.logo_url&&<img src={p.proveedores.logo_url} alt="" style={{width:16,height:16,borderRadius:"50%",objectFit:"cover"}}/>}
                            <span style={{fontSize:10,color:"#64748b"}}>{p.proveedores?.negocio}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Espacio premium label */}
                  <div style={{textAlign:"center",marginBottom:4}}>
                    <span style={{fontSize:9,color:"#94a3b8",letterSpacing:0.5}}>ESPACIO PATROCINADO · ¿Quieres aparecer aquí? Contáctanos</span>
                  </div>
                </div>
              )}
              <div style={{...s.sec,paddingTop:12}}>
                {/* BOTÓN REGISTRO VENDEDORES DE COMIDA */}
                <button onClick={()=>{setTab("Proveedores");}} style={{width:"100%",background:"linear-gradient(135deg,#9a3412,#ea580c,#f97316)",color:"#fff",border:"none",borderRadius:14,padding:"14px 16px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:14,boxShadow:"0 4px 16px rgba(234,88,12,0.35)"}}>
                  <span style={{fontSize:22}}>🍽️</span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:14,fontWeight:900,letterSpacing:-0.3}}>¿Vendes comida? ¡Abre tu vitrina gratis!</div>
                    <div style={{fontSize:11,opacity:0.85,marginTop:1}}>Restaurantes · Cocinas · Postres · Comida casera</div>
                  </div>
                  <span style={{fontSize:18,marginLeft:"auto"}}>→</span>
                </button>
                {allRestaurantes.length===0&&(
                  <div style={{textAlign:"center",padding:"40px 16px",color:"#94a3b8"}}>
                    <div style={{fontSize:40,marginBottom:10}}>🍽️</div>
                    <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:6}}>Sin restaurantes en {ubiActiva.municipio}</div>
                    <div style={{fontSize:12,color:"#64748b",lineHeight:1.5,marginBottom:16}}>Aún no hay restaurantes registrados en tu municipio. ¿Tienes un restaurante? ¡Únete gratis!</div>
                    <button onClick={()=>setTab("Proveedores")} style={{background:"#c2410c",color:"#fff",border:"none",borderRadius:12,padding:"11px 20px",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10,display:"block",margin:"0 auto 10px"}}>
                      🍽️ Registra tu restaurante
                    </button>
                    <button onClick={()=>{setCiudadTemp({estado:ubiActiva.estado,municipio:ubiActiva.municipio});setShowCiudadModal(true);}} style={{fontSize:12,color:"#64748b",background:"none",border:"1px solid #e2e8f0",borderRadius:10,padding:"8px 16px",cursor:"pointer"}}>
                      📍 Cambiar municipio
                    </button>
                  </div>
                )}
                {[...allRestaurantes].sort((a,b)=>{const aAb=estaAbiertoAhora(a.horario_desde,a.horario_hasta,a.activo,a.en_pausa,a.forzar_abierto);const bAb=estaAbiertoAhora(b.horario_desde,b.horario_hasta,b.activo,b.en_pausa,b.forzar_abierto);return bAb-aAb;}).map(r=>{
                  const abiertoR=estaAbiertoAhora(r.horario_desde,r.horario_hasta,r.activo,r.en_pausa,r.forzar_abierto);
                  const opTexto=r.tipo_operacion_gastro==="cocina_oscura"?"🚚 Pedidos solo por delivery":
                    r.tipo_operacion_gastro==="restaurante"?`🍽️ Atención en local${r.delivery_propio?" · 🚚 Delivery disponible":""}`:
                    r.tipo_operacion_gastro==="comida_casera"?"🏠 Comida casera · Delivery":
                    r.tipo_operacion_gastro==="comida_rapida"?`⚡ Comida rápida${r.delivery_propio?" · 🚚 Delivery":""}`:
                    r.tipo_operacion_gastro==="panaderia"?`🍞 Panadería y repostería${r.delivery_propio?" · 🚚 Delivery":""}`:
                    r.delivery_propio?"🚚 Delivery disponible":r.permite_retiro?"🏪 Retiro en local":"";
                  const etaRest=r.eta_texto||(r.eta_minutos_min&&r.eta_minutos_max?`${r.eta_minutos_min}–${r.eta_minutos_max} min`:null);
                  const catPrincipal=(r.categorias||[])[0]||"";
                  return(
                  <div key={r.id} onClick={()=>{setRestauranteActivo(r);setCartRestId(r.id);setCartRestNombre(r.negocio);setCartRestWa(r.whatsapp_negocio||r.telefono);setSearch("");loadProvResenas(r.id);}} style={{background:abiertoR?"#fff":"#f8fafc",borderRadius:16,border:`1px solid ${abiertoR?"#f1f5f9":"#e2e8f0"}`,marginBottom:10,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",padding:"12px 14px",display:"flex",gap:12,alignItems:"center",opacity:abiertoR?1:0.7,position:"relative"}}>
                    {!abiertoR&&<div style={{position:"absolute",top:10,right:10,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:20,letterSpacing:0.5}}>CERRADO</div>}
                    <div style={{width:52,height:52,borderRadius:"50%",background:r.logo_url?"#f8fafc":getAvatarColor(r.negocio),flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:r.logo_url?5:0}}>
                      {r.logo_url
                        ?<img src={r.logo_url} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}} onError={e=>{e.target.style.display="none";e.target.parentNode.style.background=getAvatarColor(r.negocio);e.target.parentNode.innerHTML=`<span style="color:#fff;font-size:20px;font-weight:900">${(r.negocio||"?")[0].toUpperCase()}</span>`;}}/>
                        :<span style={{color:"#fff",fontSize:20,fontWeight:900}}>{(r.negocio||"?")[0].toUpperCase()}</span>
                      }
                    </div>
                    {/* CONTENIDO */}
                    <div style={{flex:1,minWidth:0}}>
                      {/* FILA 1: nombre + estado */}
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <div style={{fontSize:15,fontWeight:800,color:"#0f172a",letterSpacing:-0.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{r.negocio}</div>
                        {abiertoR&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:"#dcfce7",color:"#15803d",flexShrink:0}}>● Abierto</span>}
                      </div>
                      {/* FILA 2: descripción (qué vende) */}
                      {r.descripcion_negocio&&<div style={{fontSize:11,color:"#64748b",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.descripcion_negocio}</div>}
                      {/* FILA ESTRELLAS */}
                      {promediosResenas[r.id]&&(<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}><span style={{color:"#f59e0b",fontSize:12}}>★</span><span style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>{promediosResenas[r.id].avg}</span><span style={{fontSize:11,color:"#94a3b8"}}>({promediosResenas[r.id].count})</span></div>)}
                      {/* FILA 3: cómo pedir + 1 categoría */}
                      <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                        {opTexto&&<span style={{fontSize:10,color:"#ea580c",fontWeight:600}}>{opTexto}</span>}
                        {catPrincipal&&!opTexto.includes(catPrincipal)&&<span style={{fontSize:10,color:"#94a3b8",background:"#f8fafc",padding:"1px 6px",borderRadius:20}}>· {catPrincipal}</span>}
                        {r.horario_desde&&<span style={{fontSize:10,color:"#cbd5e1"}}>· 🕐 {r.horario_desde}–{r.horario_hasta}</span>}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flexShrink:0}}>
                      <div style={{color:"#e2e8f0",fontSize:18}}>›</div>
                      <BtnCompartir titulo={r.negocio} tab="Feria de comida" id={r.id} emoji="🍽️" small={true}/>
                    </div>
                  </div>
                  );
                })}
              </div>
              </>
            )}
          </>
        )}
      </>)}

      {/* CLASIFICADOS */}
      {tab==="Clasificados"&&(<>
        {/* HERO BANNER */}
        <div style={{background:"linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)",padding:"20px 16px 18px",color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{position:"absolute",bottom:-30,left:-10,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,position:"relative"}}>
            <div style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🚗</div>
            <div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:-0.5,lineHeight:1}}>Clasificados</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>Vehículos · Motos · Inmuebles · Venezuela</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",position:"relative"}}>
            <span style={{background:"rgba(34,197,94,0.25)",border:"1px solid rgba(34,197,94,0.4)",color:"#86efac",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>✓ Gratis publicar</span>
            <span style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.8)",fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:20}}>📷 Hasta 4 fotos</span>
            <span style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.8)",fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:20}}>⚡ Contacto directo</span>
          </div>
        </div>

        {/* BOTÓN PUBLICAR */}
        <div style={{padding:"12px 16px 0"}}>
          <button onClick={()=>{setShowPublicarClasificado(!showPublicarClasificado);setClasificadoSeleccionado(null);}} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:showPublicarClasificado?"#64748b":"linear-gradient(135deg,#4338ca,#6366f1)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:showPublicarClasificado?"none":"0 4px 16px rgba(99,102,241,0.4)",letterSpacing:-0.2}}>
            {showPublicarClasificado?"✕ Cancelar publicación":"➕ Publicar mi anuncio gratis"}
          </button>
        </div>

        {/* FORMULARIO PUBLICAR */}
        {showPublicarClasificado&&(
          <div style={{padding:"12px 16px 0"}}>
            {pmsg&&<div style={s.msg(pmsg.includes("✅"))}>{pmsg}</div>}
            <div style={{background:"#fff",borderRadius:18,padding:16,border:"1px solid #e2e8f0",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:15,fontWeight:800,color:"#1e1b4b",marginBottom:4}}>📋 Nuevo anuncio</div>
              <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1px solid #86efac",borderRadius:10,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#15803d",fontWeight:600}}>
                ✓ Gratis · Revisión del admin · Contacto directo por WhatsApp
              </div>

              {/* TIPO */}
              <label style={s.lbl}>Tipo de anuncio *</label>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {CLASIF_TIPOS.map(t=>(
                  <button key={t} onClick={()=>setNewClasificado({...newClasificado,tipo:t,categoria:t})} style={{flex:1,padding:"12px 4px",borderRadius:12,border:"none",background:newClasificado.tipo===t?"linear-gradient(135deg,#4338ca,#6366f1)":"#f8fafc",color:newClasificado.tipo===t?"#fff":"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:newClasificado.tipo===t?"0 2px 8px rgba(99,102,241,0.3)":"none",transition:"all 0.15s"}}>
                    {t==="Vehículos"?"🚗":t==="Motos"?"🏍️":"🏠"}<br/><span style={{fontSize:10}}>{t}</span>
                  </button>
                ))}
              </div>

              {/* TÍTULO */}
              <label style={s.lbl}>Título del anuncio *</label>
              <input style={s.inp} placeholder={newClasificado.tipo==="Vehículos"?"Toyota Corolla 2018 en venta":newClasificado.tipo==="Motos"?"Honda CB 190 2020":"Casa en venta Sector Norte"} value={newClasificado.titulo} onChange={e=>setNewClasificado({...newClasificado,titulo:e.target.value})}/>

              {/* CAMPOS VEHÍCULOS */}
              {newClasificado.tipo==="Vehículos"&&(<>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><label style={s.lbl}>Marca *</label><select style={{...s.inp,background:"#fff"}} value={newClasificado.marca} onChange={e=>setNewClasificado({...newClasificado,marca:e.target.value})}><option value="">Seleccionar...</option>{VEHICULO_MARCAS.map(m=><option key={m}>{m}</option>)}</select></div>
                  <div style={{flex:1}}><label style={s.lbl}>Modelo</label><input style={s.inp} placeholder="Corolla, Hilux..." value={newClasificado.modelo} onChange={e=>setNewClasificado({...newClasificado,modelo:e.target.value})}/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><label style={s.lbl}>Año</label><input style={s.inp} type="number" placeholder="2018" value={newClasificado.anio} onChange={e=>setNewClasificado({...newClasificado,anio:e.target.value})}/></div>
                  <div style={{flex:1}}><label style={s.lbl}>Kilometraje</label><input style={s.inp} placeholder="85.000 km" value={newClasificado.kilometraje} onChange={e=>setNewClasificado({...newClasificado,kilometraje:e.target.value})}/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><label style={s.lbl}>Color</label><input style={s.inp} placeholder="Blanco" value={newClasificado.color} onChange={e=>setNewClasificado({...newClasificado,color:e.target.value})}/></div>
                  <div style={{flex:1}}><label style={s.lbl}>Transmisión</label><select style={{...s.inp,background:"#fff"}} value={newClasificado.transmision} onChange={e=>setNewClasificado({...newClasificado,transmision:e.target.value})}>{TRANSMISION.map(t=><option key={t}>{t}</option>)}</select></div>
                </div>
                <label style={s.lbl}>Combustible</label>
                <select style={{...s.inp,background:"#fff"}} value={newClasificado.combustible} onChange={e=>setNewClasificado({...newClasificado,combustible:e.target.value})}>{COMBUSTIBLE.map(c=><option key={c}>{c}</option>)}</select>
              </>)}

              {/* CAMPOS MOTOS */}
              {newClasificado.tipo==="Motos"&&(<>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><label style={s.lbl}>Marca *</label><select style={{...s.inp,background:"#fff"}} value={newClasificado.marca} onChange={e=>setNewClasificado({...newClasificado,marca:e.target.value})}><option value="">Seleccionar...</option>{MOTO_MARCAS.map(m=><option key={m}>{m}</option>)}</select></div>
                  <div style={{flex:1}}><label style={s.lbl}>Modelo</label><input style={s.inp} placeholder="CB 190, Titan..." value={newClasificado.modelo} onChange={e=>setNewClasificado({...newClasificado,modelo:e.target.value})}/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><label style={s.lbl}>Año</label><input style={s.inp} type="number" placeholder="2020" value={newClasificado.anio} onChange={e=>setNewClasificado({...newClasificado,anio:e.target.value})}/></div>
                  <div style={{flex:1}}><label style={s.lbl}>Kilometraje</label><input style={s.inp} placeholder="15.000 km" value={newClasificado.kilometraje} onChange={e=>setNewClasificado({...newClasificado,kilometraje:e.target.value})}/></div>
                </div>
                <label style={s.lbl}>Color</label>
                <input style={s.inp} placeholder="Rojo, Negro..." value={newClasificado.color} onChange={e=>setNewClasificado({...newClasificado,color:e.target.value})}/>
              </>)}

              {/* CAMPOS INMUEBLES */}
              {newClasificado.tipo==="Inmuebles"&&(<>
                <label style={s.lbl}>Tipo de operación *</label>
                <div style={{display:"flex",gap:8,marginBottom:10}}>{TIPO_OPERACION.map(t=>(<button key={t} onClick={()=>setNewClasificado({...newClasificado,tipo_operacion:t})} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:newClasificado.tipo_operacion===t?"linear-gradient(135deg,#4338ca,#6366f1)":"#f8fafc",color:newClasificado.tipo_operacion===t?"#fff":"#64748b",fontSize:13,fontWeight:700,cursor:"pointer"}}>{t==="Venta"?"🏷️ Venta":"🔑 Alquiler"}</button>))}</div>
                <label style={s.lbl}>Sector / Urbanización</label>
                <input style={s.inp} placeholder="Sector Norte, Barrio El Carmen..." value={newClasificado.sector} onChange={e=>setNewClasificado({...newClasificado,sector:e.target.value})}/>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><label style={s.lbl}>Habitaciones</label><input style={s.inp} type="number" placeholder="3" value={newClasificado.habitaciones} onChange={e=>setNewClasificado({...newClasificado,habitaciones:e.target.value})}/></div>
                  <div style={{flex:1}}><label style={s.lbl}>Baños</label><input style={s.inp} type="number" placeholder="2" value={newClasificado.banos} onChange={e=>setNewClasificado({...newClasificado,banos:e.target.value})}/></div>
                </div>
                <label style={s.lbl}>Metros cuadrados</label>
                <input style={s.inp} placeholder="120 m²" value={newClasificado.metros2} onChange={e=>setNewClasificado({...newClasificado,metros2:e.target.value})}/>
              </>)}

              <label style={s.lbl}>Descripción</label>
              <input style={s.inp} placeholder="Estado, equipamiento, motivo de venta..." value={newClasificado.descripcion} onChange={e=>setNewClasificado({...newClasificado,descripcion:e.target.value})}/>

              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1}}><label style={s.lbl}>Precio ($) *</label><input style={s.inp} type="number" placeholder="5000" value={newClasificado.precio} onChange={e=>setNewClasificado({...newClasificado,precio:e.target.value})}/></div>
                <div onClick={()=>setNewClasificado({...newClasificado,negociable:!newClasificado.negociable})} style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,background:newClasificado.negociable?"#f0fdf4":"#f8fafc",border:`1px solid ${newClasificado.negociable?"#86efac":"#e2e8f0"}`,padding:"11px 12px",borderRadius:10,flexShrink:0,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${newClasificado.negociable?"#22c55e":"#cbd5e1"}`,background:newClasificado.negociable?"#22c55e":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {newClasificado.negociable&&<span style={{color:"#fff",fontSize:10,fontWeight:900}}>✓</span>}
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:newClasificado.negociable?"#15803d":"#94a3b8",whiteSpace:"nowrap"}}>Negociable</span>
                </div>
              </div>

              <label style={s.lbl}>📸 Fotos (hasta 4)</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[0,1,2,3].map(i=>(
                  <div key={i} style={{position:"relative"}}>
                    {clasifFotosPrev[i]?(
                      <div style={{position:"relative"}}>
                        <img src={clasifFotosPrev[i]} alt="" style={{width:"100%",height:90,objectFit:"cover",borderRadius:10}}/>
                        <button onClick={()=>{const f=[...clasifFotos];const p=[...clasifFotosPrev];f[i]=null;p[i]=null;setClasifFotos(f);setClasifFotosPrev(p);}} style={{position:"absolute",top:4,right:4,background:"#ef4444",color:"#fff",border:"none",borderRadius:"50%",width:22,height:22,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      </div>
                    ):(
                      <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:90,background:"#f8fafc",borderRadius:10,border:"2px dashed #e2e8f0",cursor:"pointer",gap:4}}>
                        <span style={{fontSize:22}}>📷</span>
                        <span style={{fontSize:10,color:"#94a3b8"}}>Foto {i+1}</span>
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){const arr=[...clasifFotos];const prev=[...clasifFotosPrev];arr[i]=f;prev[i]=URL.createObjectURL(f);setClasifFotos(arr);setClasifFotosPrev(prev);}}}/>
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <label style={s.lbl}>Tu nombre *</label>
              <input style={s.inp} placeholder="Juan Pérez" value={newClasificado.vendedor_nombre} onChange={e=>setNewClasificado({...newClasificado,vendedor_nombre:e.target.value})}/>
              <label style={s.lbl}>Tu WhatsApp *</label>
              <input style={s.inp} placeholder="+58 424-000-0000" value={newClasificado.vendedor_telefono} onChange={e=>setNewClasificado({...newClasificado,vendedor_telefono:e.target.value})}/>

              <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"10px 12px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>📍 ¿Dónde está ubicado?</div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}>
                    <label style={s.lbl}>Estado</label>
                    <select style={{...s.inp,marginBottom:0,background:"#fff"}} value={newClasificado.estado||ubiActiva.estado} onChange={e=>setNewClasificado({...newClasificado,estado:e.target.value,municipio:""})}>
                      {Object.keys(VE_ESTADOS_MUNICIPIOS).sort().map(est=><option key={est}>{est}</option>)}
                    </select>
                  </div>
                  <div style={{flex:1}}>
                    <label style={s.lbl}>Municipio</label>
                    <select style={{...s.inp,marginBottom:0,background:"#fff"}} value={newClasificado.municipio||ubiActiva.municipio} onChange={e=>setNewClasificado({...newClasificado,municipio:e.target.value})}>
                      {(VE_ESTADOS_MUNICIPIOS[newClasificado.estado||ubiActiva.estado]||[]).map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button style={{...s.btn,background:"linear-gradient(135deg,#4338ca,#6366f1)",boxShadow:"0 4px 16px rgba(99,102,241,0.35)"}} onClick={publishClasificado} disabled={loading}>{loading?"Subiendo fotos...":"📤 Publicar anuncio"}</button>
            </div>
          </div>
        )}

        {/* FILTROS + BÚSQUEDA + ORDEN */}
        {!showPublicarClasificado&&!clasificadoSeleccionado&&(
          <div style={{padding:"12px 16px 0"}}>
            {/* BUSCADOR */}
            <div style={{position:"relative",marginBottom:10}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔍</span>
              <input style={{width:"100%",padding:"11px 12px 11px 36px",borderRadius:12,border:"2px solid #e2e8f0",fontSize:13,background:"#fff",boxSizing:"border-box",outline:"none"}} placeholder="Buscar en clasificados..." value={clasificadoSearch} onChange={e=>setClasificadoSearch(e.target.value)}/>
              {clasificadoSearch&&<button onClick={()=>setClasificadoSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"#e2e8f0",border:"none",borderRadius:"50%",width:20,height:20,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
            </div>
            {/* FILTROS TIPO */}
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:8}}>
              {["Todos","Vehículos","Motos","Inmuebles"].map(t=>(
                <button key={t} onClick={()=>setClasificadoTipo(t)} style={{flexShrink:0,padding:"7px 14px",borderRadius:20,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",background:clasificadoTipo===t?"#1e1b4b":"#f1f5f9",color:clasificadoTipo===t?"#fff":"#64748b",transition:"all 0.15s"}}>
                  {t==="Todos"?"🔍 Todos":t==="Vehículos"?"🚗 Autos":t==="Motos"?"🏍️ Motos":"🏠 Inmuebles"}
                </button>
              ))}
            </div>
            {/* FILA GEO + ORDEN */}
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
              <div style={{display:"flex",gap:4,flex:1}}>
                <button onClick={()=>setClasificadoGeoFiltro("todo")} style={{flex:1,padding:"6px 8px",borderRadius:10,border:"none",fontSize:10,fontWeight:700,cursor:"pointer",background:clasificadoGeoFiltro==="todo"?"#1e1b4b":"#f1f5f9",color:clasificadoGeoFiltro==="todo"?"#fff":"#64748b"}}>🌎 Venezuela</button>
                <button onClick={()=>setClasificadoGeoFiltro("miMunicipio")} style={{flex:1,padding:"6px 8px",borderRadius:10,border:"none",fontSize:10,fontWeight:700,cursor:"pointer",background:clasificadoGeoFiltro==="miMunicipio"?"#25D366":"#f1f5f9",color:clasificadoGeoFiltro==="miMunicipio"?"#fff":"#64748b"}}>📍 {ubiActiva.municipio}</button>
              </div>
              <select value={clasificadoSort} onChange={e=>setClasificadoSort(e.target.value)} style={{padding:"6px 8px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:11,fontWeight:600,color:"#475569",background:"#fff",cursor:"pointer"}}>
                <option value="reciente">🕐 Recientes</option>
                <option value="menor">💰 Menor precio</option>
                <option value="mayor">💰 Mayor precio</option>
              </select>
            </div>
          </div>
        )}

        {/* DETALLE DE UN CLASIFICADO */}
        {clasificadoSeleccionado&&(
          <div style={{padding:"12px 16px 0"}}>
            <button onClick={()=>setClasificadoSeleccionado(null)} style={{display:"flex",alignItems:"center",gap:6,background:"#f1f5f9",border:"none",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:600,color:"#475569",cursor:"pointer",marginBottom:12}}>← Volver</button>
            {/* GALERÍA */}
            {[clasificadoSeleccionado.foto1_url,clasificadoSeleccionado.foto2_url,clasificadoSeleccionado.foto3_url,clasificadoSeleccionado.foto4_url].filter(Boolean).length>0&&(
              <div style={{display:"grid",gridTemplateColumns:[clasificadoSeleccionado.foto1_url,clasificadoSeleccionado.foto2_url,clasificadoSeleccionado.foto3_url,clasificadoSeleccionado.foto4_url].filter(Boolean).length===1?"1fr":"1fr 1fr",gap:6,marginBottom:12,borderRadius:16,overflow:"hidden"}}>
                {[clasificadoSeleccionado.foto1_url,clasificadoSeleccionado.foto2_url,clasificadoSeleccionado.foto3_url,clasificadoSeleccionado.foto4_url].filter(Boolean).map((f,i)=>(
                  <img key={i} src={f} alt="" onClick={()=>abrirLightbox(f,clasificadoSeleccionado?.titulo,"",clasificadoSeleccionado?.precio)} style={{width:"100%",height:i===0&&[clasificadoSeleccionado.foto1_url,clasificadoSeleccionado.foto2_url,clasificadoSeleccionado.foto3_url,clasificadoSeleccionado.foto4_url].filter(Boolean).length===1?220:140,objectFit:"cover",cursor:"pointer"}}/>
                ))}
              </div>
            )}
            <div style={{background:"#fff",borderRadius:18,padding:16,border:"1px solid #e2e8f0",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:12}}>
              {/* BADGE TIPO + NUEVO */}
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}>
                <span style={{background:"#ede9fe",color:"#6d28d9",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>
                  {clasificadoSeleccionado.tipo==="Vehículos"?"🚗":clasificadoSeleccionado.tipo==="Motos"?"🏍️":"🏠"} {clasificadoSeleccionado.tipo}
                </span>
                {clasificadoSeleccionado.tipo_operacion&&<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{clasificadoSeleccionado.tipo_operacion}</span>}
                {(()=>{const dias=Math.floor((new Date()-new Date(clasificadoSeleccionado.created_at))/(1000*60*60*24));return dias<2?<span style={{background:"#fef3c7",color:"#92400e",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>🔥 NUEVO</span>:null;})()}
              </div>
              <div style={{fontSize:18,fontWeight:900,color:"#1e1b4b",marginBottom:4,letterSpacing:-0.3}}>{clasificadoSeleccionado.titulo}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{fontSize:24,fontWeight:900,color:"#16a34a"}}>${parseFloat(clasificadoSeleccionado.precio).toLocaleString()}</div>
                {clasificadoSeleccionado.negociable&&<span style={{background:"#fef9c3",color:"#854d0e",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>💬 Negociable</span>}
              </div>
              {/* SPECS GRID */}
              {[
                clasificadoSeleccionado.marca&&{l:"Marca",v:clasificadoSeleccionado.marca},
                clasificadoSeleccionado.modelo&&{l:"Modelo",v:clasificadoSeleccionado.modelo},
                clasificadoSeleccionado.anio&&{l:"Año",v:clasificadoSeleccionado.anio},
                clasificadoSeleccionado.kilometraje&&{l:"Kilometraje",v:clasificadoSeleccionado.kilometraje},
                clasificadoSeleccionado.transmision&&{l:"Transmisión",v:clasificadoSeleccionado.transmision},
                clasificadoSeleccionado.combustible&&{l:"Combustible",v:clasificadoSeleccionado.combustible},
                clasificadoSeleccionado.color&&{l:"Color",v:clasificadoSeleccionado.color},
                clasificadoSeleccionado.habitaciones&&{l:"Habitaciones",v:clasificadoSeleccionado.habitaciones},
                clasificadoSeleccionado.banos&&{l:"Baños",v:clasificadoSeleccionado.banos},
                clasificadoSeleccionado.metros2&&{l:"Metros²",v:clasificadoSeleccionado.metros2},
                clasificadoSeleccionado.sector&&{l:"Sector",v:clasificadoSeleccionado.sector},
              ].filter(Boolean).length>0&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                  {[
                    clasificadoSeleccionado.marca&&{l:"Marca",v:clasificadoSeleccionado.marca},
                    clasificadoSeleccionado.modelo&&{l:"Modelo",v:clasificadoSeleccionado.modelo},
                    clasificadoSeleccionado.anio&&{l:"Año",v:clasificadoSeleccionado.anio},
                    clasificadoSeleccionado.kilometraje&&{l:"Kilometraje",v:clasificadoSeleccionado.kilometraje},
                    clasificadoSeleccionado.transmision&&{l:"Transmisión",v:clasificadoSeleccionado.transmision},
                    clasificadoSeleccionado.combustible&&{l:"Combustible",v:clasificadoSeleccionado.combustible},
                    clasificadoSeleccionado.color&&{l:"Color",v:clasificadoSeleccionado.color},
                    clasificadoSeleccionado.habitaciones&&{l:"Habitaciones",v:clasificadoSeleccionado.habitaciones},
                    clasificadoSeleccionado.banos&&{l:"Baños",v:clasificadoSeleccionado.banos},
                    clasificadoSeleccionado.metros2&&{l:"Metros²",v:clasificadoSeleccionado.metros2},
                    clasificadoSeleccionado.sector&&{l:"Sector",v:clasificadoSeleccionado.sector},
                  ].filter(Boolean).map((spec,i)=>(
                    <div key={i} style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",border:"1px solid #f1f5f9"}}>
                      <div style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{spec.l}</div>
                      <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginTop:2}}>{spec.v}</div>
                    </div>
                  ))}
                </div>
              )}
              {clasificadoSeleccionado.descripcion&&<div style={{fontSize:13,color:"#475569",marginBottom:12,lineHeight:1.6,background:"#f8fafc",borderRadius:10,padding:"10px 12px"}}>{clasificadoSeleccionado.descripcion}</div>}
              {/* UBICACIÓN + DÍAS */}
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                {(clasificadoSeleccionado.municipio||clasificadoSeleccionado.estado)&&<span style={{fontSize:11,background:"#eff6ff",color:"#1d4ed8",padding:"4px 10px",borderRadius:20,fontWeight:600}}>📍 {clasificadoSeleccionado.municipio||clasificadoSeleccionado.estado}</span>}
                {clasificadoSeleccionado.fecha_caducidad&&(()=>{const dias=Math.ceil((new Date(clasificadoSeleccionado.fecha_caducidad)-new Date())/(1000*60*60*24));return dias>0?<span style={{fontSize:11,background:"#f0fdf4",color:"#15803d",padding:"4px 10px",borderRadius:20,fontWeight:600}}>⏳ {dias} días restantes</span>:null;})()}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"#f8fafc",borderRadius:12,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#4338ca,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>👤</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>{clasificadoSeleccionado.vendedor_nombre}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>Vendedor particular</div>
                </div>
              </div>
              <button onClick={()=>{abrirWhatsApp(clasificadoSeleccionado.vendedor_telefono,"Hola "+clasificadoSeleccionado.vendedor_nombre+", vi tu anuncio *"+clasificadoSeleccionado.titulo+"* en Lokl. ¿Sigue disponible?");}} style={{width:"100%",background:"#25D366",color:"#fff",border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 16px rgba(37,211,102,0.35)"}}>
                📲 Contactar por WhatsApp
              </button>
              <BtnCompartir titulo={clasificadoSeleccionado.titulo} precio={clasificadoSeleccionado.precio} tab="Clasificados" id={clasificadoSeleccionado.id} emoji={clasificadoSeleccionado.tipo==="Motos"?"🏍️":clasificadoSeleccionado.tipo==="Inmuebles"?"🏠":"🚗"}/>
            </div>
          </div>
        )}

        {/* LISTA DE CLASIFICADOS */}
        {!showPublicarClasificado&&!clasificadoSeleccionado&&(
          <div style={{padding:"8px 16px 24px"}}>
            {(()=>{
              let lista=clasificados.filter(c=>{
                const matchTipo=clasificadoTipo==="Todos"||c.tipo===clasificadoTipo;
                const matchGeo=clasificadoGeoFiltro==="todo"||(c.municipio||"San Fernando")===ubiActiva.municipio;
                const matchSearch=!clasificadoSearch||c.titulo?.toLowerCase().includes(clasificadoSearch.toLowerCase())||c.descripcion?.toLowerCase().includes(clasificadoSearch.toLowerCase())||c.marca?.toLowerCase().includes(clasificadoSearch.toLowerCase())||c.modelo?.toLowerCase().includes(clasificadoSearch.toLowerCase());
                return matchTipo&&matchGeo&&matchSearch;
              });
              if(clasificadoSort==="menor")lista=[...lista].sort((a,b)=>parseFloat(a.precio)-parseFloat(b.precio));
              else if(clasificadoSort==="mayor")lista=[...lista].sort((a,b)=>parseFloat(b.precio)-parseFloat(a.precio));
              if(lista.length===0)return(
                <div style={{textAlign:"center",padding:"48px 16px",color:"#94a3b8"}}>
                  <div style={{fontSize:48,marginBottom:12}}>{clasificadoTipo==="Motos"?"🏍️":clasificadoTipo==="Inmuebles"?"🏠":"🚗"}</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#475569",marginBottom:4}}>
                    {clasificadoSearch?"Sin resultados para \""+clasificadoSearch+"\"":clasificadoGeoFiltro==="miMunicipio"?"Sin anuncios en "+ubiActiva.municipio:"No hay anuncios en esta categoría"}
                  </div>
                  <div style={{fontSize:12,color:"#94a3b8",marginBottom:16}}>Sé el primero en publicar</div>
                  {clasificadoGeoFiltro==="miMunicipio"&&<button onClick={()=>setClasificadoGeoFiltro("todo")} style={{fontSize:12,color:"#4338ca",background:"#ede9fe",border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",marginBottom:10,fontWeight:700}}>🌎 Ver en toda Venezuela</button>}
                  <button onClick={()=>setShowPublicarClasificado(true)} style={{...s.btn,maxWidth:240,margin:"0 auto",background:"linear-gradient(135deg,#4338ca,#6366f1)"}}>➕ Publicar anuncio</button>
                </div>
              );
              return(
                <>
                  <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,marginBottom:10}}>{lista.length} anuncio{lista.length!==1?"s":""} encontrado{lista.length!==1?"s":""}</div>
                  {lista.map(c=>{
                    const diasPublicado=Math.floor((new Date()-new Date(c.created_at))/(1000*60*60*24));
                    const esNuevo=diasPublicado<2;
                    const diasRestantes=c.fecha_caducidad?Math.ceil((new Date(c.fecha_caducidad)-new Date())/(1000*60*60*24)):null;
                    const fotos=[c.foto1_url,c.foto2_url,c.foto3_url,c.foto4_url].filter(Boolean);
                    return(
                      <div key={c.id} onClick={()=>setClasificadoSeleccionado(c)} style={{background:"#fff",borderRadius:16,marginBottom:12,border:"1px solid #e8e8f0",overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",transition:"box-shadow 0.15s"}}>
                        {/* IMAGEN */}
                        <div style={{position:"relative"}}>
                          {fotos.length>0
                            ?<img src={fotos[0]} alt={c.titulo} style={{width:"100%",height:170,objectFit:"cover"}}/>
                            :<div style={{height:110,background:`linear-gradient(135deg,${c.tipo==="Motos"?"#78350f,#d97706":c.tipo==="Inmuebles"?"#065f46,#059669":"#312e81,#4338ca"})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>
                              {c.tipo==="Motos"?"🏍️":c.tipo==="Inmuebles"?"🏠":"🚗"}
                            </div>
                          }
                          {/* BADGES SOBRE IMAGEN */}
                          <div style={{position:"absolute",top:8,left:8,display:"flex",gap:4,flexWrap:"wrap"}}>
                            {esNuevo&&<span style={{background:"#f59e0b",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:20,boxShadow:"0 2px 6px rgba(245,158,11,0.4)"}}>🔥 NUEVO</span>}
                            {c.tipo_operacion&&<span style={{background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:20,backdropFilter:"blur(4px)"}}>{c.tipo_operacion}</span>}
                          </div>
                          {fotos.length>1&&<div style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:20,backdropFilter:"blur(4px)"}}>📷 {fotos.length}</div>}
                        </div>
                        {/* CONTENIDO */}
                        <div style={{padding:"10px 12px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:4}}>
                            <div style={{fontSize:14,fontWeight:800,color:"#1e1b4b",lineHeight:1.2,flex:1}}>{c.titulo}</div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontSize:18,fontWeight:900,color:"#16a34a",lineHeight:1}}>${parseFloat(c.precio).toLocaleString()}</div>
                              {c.negociable&&<div style={{fontSize:9,color:"#854d0e",fontWeight:700}}>Negociable</div>}
                            </div>
                          </div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                            <span style={{fontSize:10,background:"#ede9fe",color:"#6d28d9",padding:"3px 8px",borderRadius:20,fontWeight:600}}>{c.tipo==="Vehículos"?"🚗":c.tipo==="Motos"?"🏍️":"🏠"} {c.tipo}</span>
                            {c.marca&&<span style={{fontSize:10,background:"#f1f5f9",color:"#475569",padding:"3px 8px",borderRadius:20,fontWeight:600}}>{c.marca}</span>}
                            {c.anio&&<span style={{fontSize:10,background:"#f1f5f9",color:"#475569",padding:"3px 8px",borderRadius:20,fontWeight:600}}>{c.anio}</span>}
                            {c.kilometraje&&<span style={{fontSize:10,background:"#f1f5f9",color:"#475569",padding:"3px 8px",borderRadius:20}}>{c.kilometraje}</span>}
                            {c.habitaciones&&<span style={{fontSize:10,background:"#f1f5f9",color:"#475569",padding:"3px 8px",borderRadius:20}}>{c.habitaciones} hab.</span>}
                            {c.sector&&<span style={{fontSize:10,background:"#eff6ff",color:"#1d4ed8",padding:"3px 8px",borderRadius:20,fontWeight:600}}>📍 {c.sector}</span>}
                            {(c.municipio||c.estado)&&<span style={{fontSize:10,background:"#eff6ff",color:"#1d4ed8",padding:"3px 8px",borderRadius:20,fontWeight:600}}>📍 {c.municipio||c.estado}</span>}
                            {diasRestantes!==null&&diasRestantes<=7&&<span style={{fontSize:10,background:"#fef2f2",color:"#dc2626",padding:"3px 8px",borderRadius:20,fontWeight:600}}>⏰ {diasRestantes}d</span>}
                          </div>
                          <div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}>
                            <BtnCompartir titulo={c.titulo} precio={c.precio} tab="Clasificados" id={c.id} emoji={c.tipo==="Motos"?"🏍️":c.tipo==="Inmuebles"?"🏠":"🚗"} small={true}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        )}
      </>)}
          {/* SERVICIOS — Directorio Local Digital */}
      {tab==="Servicios"&&(<>
        {!categoriaServicio?(
          // ── PANTALLA PRINCIPAL: GRID DE CATEGORÍAS ──
          <>
            {/* HEADER */}
            <div style={{background:"linear-gradient(135deg,#1e1b4b 0%,#3730a3 60%,#4f46e5 100%)",padding:"20px 16px 18px",color:"#fff"}}>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:2,marginBottom:4}}>APURE MARKET</div>
              <div style={{fontSize:22,fontWeight:900,letterSpacing:-0.5,marginBottom:4}}>Directorio de Servicios</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>Encuentra profesionales verificados en {ubiActiva.municipio}</div>
            </div>

            {/* SECCIÓN TRANSPORTE */}
            <div style={{padding:"16px 16px 0"}}>
              <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>🚗 Transporte</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {SERVICIO_CATEGORIAS.filter(c=>c.tipo==="transporte").map(cat=>(
                  <button key={cat.id} onClick={()=>{setCategoriaServicio(cat);setProveedoresServicio([]);setSearchServicios("");if(cat.id==="rutas")loadRutasTransporte();else loadProveedoresServicio(cat.id);}}
                    style={{background:cat.bg,border:"none",borderRadius:16,padding:"16px 12px",textAlign:"left",cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,0.15)",position:"relative",minHeight:90}}>
                    <div style={{fontSize:28,marginBottom:8,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{cat.icon}</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#fff",letterSpacing:-0.2}}>{cat.label}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",marginTop:2}}>{cat.desc}</div>
                    <div style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"2px 8px",fontSize:9,color:"rgba(255,255,255,0.8)",fontWeight:600}}>Ver →</div>
                  </button>
                ))}
              </div>

              {/* SECCIÓN SALUD */}
              <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>🏥 Salud</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {SERVICIO_CATEGORIAS.filter(c=>c.tipo==="salud").map(cat=>(
                  <button key={cat.id} onClick={()=>{setCategoriaServicio(cat);setProveedoresServicio([]);setSearchServicios("");loadProveedoresServicio(cat.id);}}
                    style={{background:cat.bg,border:"none",borderRadius:16,padding:"16px 12px",textAlign:"left",cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,0.15)",position:"relative",minHeight:90}}>
                    <div style={{fontSize:28,marginBottom:8,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{cat.icon}</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#fff",letterSpacing:-0.2}}>{cat.label}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",marginTop:2}}>{cat.desc}</div>
                    <div style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"2px 8px",fontSize:9,color:"rgba(255,255,255,0.8)",fontWeight:600}}>Ver →</div>
                  </button>
                ))}
              </div>

              {/* SECCIÓN OTROS SERVICIOS */}
              <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>🔧 Otros servicios</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {SERVICIO_CATEGORIAS.filter(c=>c.tipo==="hogar").map(cat=>(
                  <button key={cat.id} onClick={()=>{setCategoriaServicio(cat);setProveedoresServicio([]);setSearchServicios("");loadProveedoresServicio(cat.id);}}
                    style={{background:cat.bg,border:"none",borderRadius:16,padding:"16px 12px",textAlign:"left",cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,0.15)",position:"relative",minHeight:90}}>
                    <div style={{fontSize:28,marginBottom:8,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{cat.icon}</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#fff",letterSpacing:-0.2}}>{cat.label}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",marginTop:2}}>{cat.desc}</div>
                    <div style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"2px 8px",fontSize:9,color:"rgba(255,255,255,0.8)",fontWeight:600}}>Ver →</div>
                  </button>
                ))}
              </div>

              {/* SECCIÓN TURISMO */}
              <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>🌴 Turismo</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {SERVICIO_CATEGORIAS.filter(c=>c.tipo==="turismo").map(cat=>(
                  <button key={cat.id} onClick={()=>{setCategoriaServicio(cat);setProveedoresServicio([]);setSearchServicios("");loadProveedoresServicio(cat.id);}}
                    style={{background:cat.bg,border:"none",borderRadius:16,padding:"16px 12px",textAlign:"left",cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,0.15)",position:"relative",minHeight:90}}>
                    <div style={{fontSize:28,marginBottom:8,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{cat.icon}</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.2}}>{cat.label}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.75)",marginTop:3}}>{cat.desc}</div>
                  </button>
                ))}
              </div>

              {/* CTA REGISTRO PROVEEDOR */}
              <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:16,padding:"16px",marginBottom:20,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}} onClick={()=>setTab("Proveedores")}>
                <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🏅</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>¿Ofreces un servicio?</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>Regístrate gratis · Llega a más clientes</div>
                </div>
                <span style={{color:"rgba(255,255,255,0.4)",fontSize:20}}>›</span>
              </div>
            </div>
          </>
        ):(
          // ── PANTALLA DE CATEGORÍA O DETALLE DE PROVEEDOR ──
          <>
            {/* HEADER CATEGORÍA */}
            <div style={{background:categoriaServicio.bg,padding:"16px",color:"#fff",position:"relative"}}>
              <button onClick={()=>{if(proveedorServicioActivo){setProveedorServicioActivo(null);setHabsProvActivo([]);setTurismoProvActivo([]);}else{setCategoriaServicio(null);setShowSolicitudServicio(false);}}} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                ← Volver
              </button>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:36,filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))"}}>{categoriaServicio.icon}</div>
                <div>
                  <div style={{fontSize:20,fontWeight:900,letterSpacing:-0.5}}>{categoriaServicio.label}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>{ubiActiva.municipio} · {(()=>{const ab=proveedoresServicio.filter(p=>estaAbiertoAhora(p.horario_desde,p.horario_hasta,p.activo,p.en_pausa,p.forzar_abierto)).length;const tot=proveedoresServicio.length;return ab>0?`${ab} disponible${ab!==1?"s":""} ahora · ${tot} en total`:`${tot} proveedor${tot!==1?"es":""}`;})()}</div>
                </div>
              </div>
            </div>

            <div style={{padding:"14px 16px"}}>

              {/* ── DETALLE DEL PROVEEDOR DE SERVICIO ── */}
              {proveedorServicioActivo?(
                <div>
                  {/* INFO PROVEEDOR */}
                  <div style={{background:"#fff",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #f1f5f9",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                    <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                      {proveedorServicioActivo.logo_url
                        ?<img src={proveedorServicioActivo.logo_url} style={{width:64,height:64,borderRadius:16,objectFit:"cover",border:"2px solid #f1f5f9",flexShrink:0}}/>
                        :<div style={{width:64,height:64,borderRadius:16,background:categoriaServicio.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#fff",fontWeight:900,flexShrink:0}}>{(proveedorServicioActivo.negocio||"?")[0]}</div>
                      }
                      <div style={{flex:1}}>
                        <div style={{fontSize:17,fontWeight:800,color:"#0f172a"}}>{proveedorServicioActivo.negocio}</div>
                        {proveedorServicioActivo.especialidad&&<div style={{fontSize:13,color:"#475569",fontWeight:600,marginTop:2}}>{proveedorServicioActivo.especialidad}</div>}
                        {proveedorServicioActivo.descripcion_negocio&&<div style={{fontSize:12,color:"#64748b",marginTop:4,lineHeight:1.4}}>{proveedorServicioActivo.descripcion_negocio}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                      {proveedorServicioActivo.zona_cobertura&&<span style={{background:"#f8fafc",color:"#475569",fontSize:11,padding:"4px 10px",borderRadius:20,border:"1px solid #e2e8f0"}}>📍 {proveedorServicioActivo.zona_cobertura}</span>}
                      {proveedorServicioActivo.direccion_fisica&&<span style={{background:"#f8fafc",color:"#475569",fontSize:11,padding:"4px 10px",borderRadius:20,border:"1px solid #e2e8f0"}}>🏢 {proveedorServicioActivo.direccion_fisica}</span>}
                      {proveedorServicioActivo.instagram&&<a href={`https://instagram.com/${proveedorServicioActivo.instagram.replace("@","")}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{background:"#fdf2f8",color:"#9d174d",fontSize:11,padding:"4px 10px",borderRadius:20,border:"1px solid #fbcfe8",textDecoration:"none",fontWeight:600}}>📸 {proveedorServicioActivo.instagram}</a>}
                    </div>
                    {(()=>{
                      const ab=estaAbiertoAhora(proveedorServicioActivo.horario_desde,proveedorServicioActivo.horario_hasta,proveedorServicioActivo.activo,proveedorServicioActivo.en_pausa,proveedorServicioActivo.forzar_abierto);
                      const horTxt=proveedorServicioActivo.horarios_atencion||(proveedorServicioActivo.horario_desde&&proveedorServicioActivo.horario_hasta?`${proveedorServicioActivo.horario_desde} – ${proveedorServicioActivo.horario_hasta}${proveedorServicioActivo.horario_desc?" ("+proveedorServicioActivo.horario_desc+")":""}`:null);
                      return(<>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:horTxt?4:0}}>
                          <span style={{background:ab?"#dcfce7":"#fee2e2",color:ab?"#15803d":"#dc2626",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,border:`1px solid ${ab?"#86efac":"#fca5a5"}`}}>{ab?"● Abierto ahora":"● Cerrado ahora"}</span>
                          {!ab&&horTxt&&<span style={{fontSize:11,color:"#64748b"}}>Atiende: {horTxt}</span>}
                        </div>
                        {ab&&horTxt&&<div style={{background:"#eff6ff",borderRadius:10,padding:"6px 12px",fontSize:11,color:"#1d4ed8",fontWeight:600,display:"flex",alignItems:"center",gap:6,marginTop:4}}>🕐 {horTxt}</div>}
                        <div style={{marginTop:10}}>
                          <BtnCompartir titulo={proveedorServicioActivo.negocio} tab="Servicios" id={proveedorServicioActivo.id} emoji={categoriaServicio?.icon||"⚡"}/>
                        </div>
                      </>);
                    })()}
                  </div>



                  {/* HABITACIONES DEL HOTEL */}
                  {habsProvActivo.length>0&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#0f766e",marginBottom:10,paddingBottom:8,borderBottom:"1px solid #f1f5f9"}}>🛏️ Habitaciones disponibles</div>
                      {habsProvActivo.map(hab=>(
                        <div key={hab.id} style={{background:"#fff",borderRadius:14,marginBottom:10,border:"1px solid #ccfbf1",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                          {hab.foto_url&&<img src={hab.foto_url} alt={hab.nombre} style={{width:"100%",height:140,objectFit:"cover",display:"block",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();abrirLightbox(hab.foto_url,hab.nombre,hab.descripcion,hab.precio_noche,"noche");}}/>}
                          <div style={{padding:"10px 12px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6,marginBottom:4}}>
                              <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{hab.nombre}</div>
                              <div style={{fontSize:15,fontWeight:800,color:"#0f766e",flexShrink:0}}>${hab.precio_noche}/noche</div>
                            </div>
                            {hab.descripcion&&<div style={{fontSize:12,color:"#64748b",marginBottom:6,lineHeight:1.4}}>{hab.descripcion}</div>}
                            <div style={{fontSize:11,color:"#475569",marginBottom:8}}>👥 Capacidad: {hab.capacidad_personas} persona{hab.capacidad_personas>1?"s":""}</div>
                            <button onClick={()=>setContactModal({prov:proveedorServicioActivo,servicio:{nombre:hab.nombre,precio:hab.precio_noche},catId:"hoteles"})} style={{width:"100%",background:"#0f766e",color:"#fff",border:"none",borderRadius:8,padding:"9px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                              🛏️ Consultar disponibilidad
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={()=>setContactModal({prov:proveedorServicioActivo,servicio:null,catId:"hoteles"})} style={{width:"100%",background:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4",borderRadius:10,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:4}}>
                        📲 Consulta general de disponibilidad
                      </button>
                    </div>
                  )}

                  {/* SERVICIOS TURÍSTICOS */}
                  {turismoProvActivo.length>0&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#065f46",marginBottom:10,paddingBottom:8,borderBottom:"1px solid #f1f5f9"}}>🌴 Experiencias disponibles</div>
                      {turismoProvActivo.map(srv=>(
                        <div key={srv.id} style={{background:"#fff",borderRadius:14,marginBottom:10,border:"1px solid #bbf7d0",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                          {srv.foto_url&&<img src={srv.foto_url} alt={srv.nombre} style={{width:"100%",height:140,objectFit:"cover",display:"block",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();abrirLightbox(srv.foto_url,srv.nombre,srv.descripcion,srv.precio,"persona");}}/>}
                          <div style={{padding:"10px 12px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6,marginBottom:4}}>
                              <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{srv.nombre}</div>
                              {srv.precio&&<div style={{fontSize:15,fontWeight:800,color:"#065f46",flexShrink:0}}>${srv.precio}/persona</div>}
                            </div>
                            {srv.descripcion&&<div style={{fontSize:12,color:"#64748b",marginBottom:4,lineHeight:1.4}}>{srv.descripcion}</div>}
                            {srv.incluye&&<div style={{fontSize:11,background:"#f0fdf4",color:"#15803d",padding:"4px 8px",borderRadius:6,marginBottom:6}}>✅ Incluye: {srv.incluye}</div>}
                            {srv.capacidad_personas&&<div style={{fontSize:11,color:"#475569",marginBottom:8}}>👥 Máximo: {srv.capacidad_personas} personas</div>}
                            <button onClick={()=>setContactModal({prov:proveedorServicioActivo,servicio:{nombre:srv.nombre,precio:srv.precio},catId:"turismo"})} style={{width:"100%",background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"9px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                              🌴 Consultar disponibilidad
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={()=>setContactModal({prov:proveedorServicioActivo,servicio:null,catId:"turismo"})} style={{width:"100%",background:"#f0fdf4",color:"#15803d",border:"1px solid #86efac",borderRadius:10,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:4}}>
                        📲 Hacer consulta general
                      </button>
                    </div>
                  )}

                  {/* LISTA DE SERVICIOS DEL PROVEEDOR */}
                  {provProductosServicio[proveedorServicioActivo.id]?.length>0?(
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:10,paddingBottom:8,borderBottom:"1px solid #f1f5f9"}}>Servicios disponibles</div>
                      {provProductosServicio[proveedorServicioActivo.id].map(sp=>{
                        const wa=(proveedorServicioActivo.whatsapp_negocio||proveedorServicioActivo.telefono||"").replace(/\D/g,"");
                        const num=wa.startsWith("0")?"58"+wa.slice(1):wa.startsWith("58")?wa:"58"+wa;
                        const esMedico=["medicos","enfermeria","laboratorios","odontologia"].includes(categoriaServicio.id);
                        const clienteNombre=form.nombre||"(tu nombre)";
                        const clienteTel=form.telefono||"(tu teléfono)";
                        const msg=esMedico
                          ?`👨‍⚕️ *Solicitud de cita — Lokl*

Hola ${proveedorServicioActivo.negocio}, vi su perfil en Lokl.

🩺 *Servicio:* ${sp.nombre}
💰 *Precio:* $${sp.precio}

👤 *Paciente:* ${clienteNombre}
📱 *Teléfono:* ${clienteTel}

¿Cuál es la próxima disponibilidad?`
                          :`🔧 *Solicitud de servicio — Lokl*

Hola ${proveedorServicioActivo.negocio}, vi tu perfil en Lokl.

*Servicio:* ${sp.nombre}
*Precio:* $${sp.precio}

👤 *Nombre:* ${clienteNombre}
📱 *Teléfono:* ${clienteTel}

¿Cuándo puedes atenderme?`;
                        return(
                          <div key={sp.id} style={{background:"#fff",borderRadius:14,marginBottom:10,border:"1px solid #f1f5f9",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",overflow:"hidden",display:"flex",gap:0}}>
                            {sp.foto_url&&<img src={sp.foto_url} alt={sp.nombre} style={{width:88,height:88,objectFit:"cover",display:"block",flexShrink:0,alignSelf:"stretch",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();abrirLightbox(sp.foto_url,sp.nombre,sp.descripcion,sp.precio);}}/>}
                            <div style={{padding:"10px 12px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between",minWidth:0}}>
                              <div style={{marginBottom:8}}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                                  <div style={{fontSize:13,fontWeight:700,color:"#0f172a",flex:1,lineHeight:1.2}}>{sp.nombre}</div>
                                  <div style={{fontSize:15,fontWeight:800,color:"#0f9b6e",flexShrink:0}}>${sp.precio}</div>
                                </div>
                                {sp.descripcion&&<div style={{fontSize:11,color:"#64748b",marginTop:3,lineHeight:1.3}}>{sp.descripcion}</div>}
                              </div>
                              <button onClick={()=>setContactModal({prov:proveedorServicioActivo,servicio:sp,catId:categoriaServicio.id})} style={{width:"100%",background:"#0f9b6e",color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                                📲 {esMedico?"Solicitar cita":"Contactar"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ):(
                    /* Sin productos: botón general de contacto */
                    <div style={{background:"#fff",borderRadius:14,padding:"14px",border:"1px solid #f1f5f9"}}>
                      {proveedorServicioActivo.examenes&&(
                        <div style={{background:"#fdf4ff",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#7e22ce",marginBottom:6}}>📋 Servicios disponibles:</div>
                          <div style={{fontSize:12,color:"#475569",whiteSpace:"pre-line"}}>{proveedorServicioActivo.examenes}</div>
                        </div>
                      )}
                      {proveedorServicioActivo.tarifa_referencial&&(
                        <div style={{background:"#eff6ff",borderRadius:10,padding:"10px 12px",marginBottom:12,fontSize:12,color:"#1d4ed8",fontWeight:600}}>
                          💲 {proveedorServicioActivo.tarifa_referencial}
                        </div>
                      )}
                      <button onClick={()=>setContactModal({prov:proveedorServicioActivo,servicio:null,catId:categoriaServicio.id})} style={{width:"100%",background:"#0f9b6e",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                        📲 {["medicos","enfermeria","laboratorios","odontologia"].includes(categoriaServicio.id)?"Solicitar cita":"Contactar por WhatsApp"}
                      </button>
                    </div>
                  )}
                  {/* RESENAS DEL PROVEEDOR DE SERVICIO */}
                  {(()=>{
                    const rList=provResenas[proveedorServicioActivo.id]||[];
                    const avg=rList.length>0?(rList.reduce((a,r)=>a+r.estrellas,0)/rList.length).toFixed(1):null;
                    const catId=categoriaServicio?.id||"";
                    const placeholder=["medicos","enfermeria","laboratorios","odontologia"].includes(catId)?"¿Cómo fue la atención?":catId==="transporte"||catId==="rutas"?"¿Cumplió con el servicio?":catId==="hoteles"?"¿Cómo fue tu estadía?":catId==="turismo"?"¿Cómo fue la experiencia?":"¿Cómo fue tu experiencia?";
                    return(<div style={{margin:"12px 0",background:"#fff",borderRadius:16,padding:16,border:"1px solid #f1f5f9",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:15,fontWeight:900,color:"#0f172a"}}>⭐ Reseñas</span>
                          {avg&&<span style={{fontSize:14,fontWeight:900,color:"#f59e0b"}}>{avg}</span>}
                          {rList.length>0&&<span style={{fontSize:11,color:"#94a3b8"}}>({rList.length} opinión{rList.length!==1?"es":""})</span>}
                        </div>
                        <button onClick={()=>setShowProvResenasId(showProvResenasId===proveedorServicioActivo.id?null:proveedorServicioActivo.id)}
                          style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:20,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#15803d",cursor:"pointer"}}>
                          {showProvResenasId===proveedorServicioActivo.id?"Cerrar":"✍️ Dejar reseña"}
                        </button>
                      </div>
                      {showProvResenasId===proveedorServicioActivo.id&&(
                        <div style={{background:"#f8fafc",borderRadius:12,padding:12,marginBottom:12,border:"1px solid #e2e8f0"}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>Tu calificación</div>
                          <div style={{display:"flex",gap:6,marginBottom:10}}>
                            {[1,2,3,4,5].map(n=>(<span key={n} onClick={()=>setProvResenasForm(f=>({...f,estrellas:n}))} style={{fontSize:28,cursor:"pointer",color:provResenasForm.estrellas>=n?"#f59e0b":"#e2e8f0",transition:"color 0.1s"}}>★</span>))}
                          </div>
                          <input style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none"}} placeholder="Tu nombre *" value={provResenasForm.nombre} onChange={e=>setProvResenasForm(f=>({...f,nombre:e.target.value}))}/>
                          <textarea style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none",resize:"none",fontFamily:"inherit"}} rows={3} placeholder={placeholder} value={provResenasForm.comentario} onChange={e=>setProvResenasForm(f=>({...f,comentario:e.target.value}))}/>
                          {provResenasMsj&&<div style={{fontSize:12,fontWeight:600,color:provResenasMsj.includes("✅")?"#15803d":"#dc2626",marginBottom:8}}>{provResenasMsj}</div>}
                          <button onClick={()=>enviarResenaProveedor(proveedorServicioActivo.id,proveedorServicioActivo.negocio)} style={{width:"100%",background:"#0f9b6e",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Enviar reseña</button>
                        </div>
                      )}
                      {rList.length===0&&showProvResenasId!==proveedorServicioActivo.id&&(<div style={{textAlign:"center",padding:"10px 0",color:"#94a3b8",fontSize:12}}>Sé el primero en dejar una reseña</div>)}
                      {rList.slice(0,5).map((r,i)=>(<div key={i} style={{paddingBottom:10,marginBottom:10,borderBottom:i<rList.slice(0,5).length-1?"1px solid #f1f5f9":"none"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}><div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{r.cliente_nombre}</div><div style={{fontSize:12,color:"#f59e0b",letterSpacing:1}}>{"★".repeat(r.estrellas)}{"☆".repeat(5-r.estrellas)}</div></div>{r.comentario&&<div style={{fontSize:12,color:"#475569",lineHeight:1.4}}>{r.comentario}</div>}<div style={{fontSize:10,color:"#cbd5e1",marginTop:3}}>{(()=>{const d=new Date(r.created_at);const now=new Date();const diff=Math.floor((now.getTime()-d.getTime())/86400000);return diff<=0?"Hoy":diff===1?"Ayer":diff<7?`Hace ${diff} días`:diff<30?`Hace ${Math.floor(diff/7)} semana(s)`:d.toLocaleDateString("es-VE",{month:"short",year:"numeric"});})()}</div></div>))}
                    </div>);
                  })()}
                </div>
              ):(
                <>{/* ── LISTA DE PROVEEDORES ── */}

              {/* RUTAS INTERURBANAS — diseño especial */}
              {categoriaServicio.id==="rutas"&&(
                <>
                  {rutasTransporte.length===0?(
                    <div style={{textAlign:"center",padding:"40px 20px",color:"#94a3b8"}}>
                      <div style={{fontSize:48,marginBottom:12}}>🚌</div>
                      <div style={{fontSize:15,fontWeight:700,color:"#374151",marginBottom:6}}>No hay rutas publicadas hoy</div>
                      <div style={{fontSize:12}}>Los transportistas aún no han publicado salidas para hoy</div>
                    </div>
                  ):(
                    rutasTransporte.map(ruta=>(
                      <div key={ruta.id} style={{background:"#fff",borderRadius:16,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:"1px solid #f1f5f9"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                          {ruta.proveedores?.logo_url
                            ?<img src={ruta.proveedores.logo_url} style={{width:44,height:44,borderRadius:12,objectFit:"cover",border:"2px solid #f1f5f9"}}/>
                            :<div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#064e3b,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",fontWeight:900,flexShrink:0}}>{(ruta.proveedores?.negocio||"T")[0]}</div>
                          }
                          <div style={{flex:1}}>
                            <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{ruta.proveedores?.negocio||"Transportista"}</div>
                            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>🚌 {ruta.origen} → {ruta.destino}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:18,fontWeight:900,color:"#059669"}}>${ruta.precio}</div>
                            <div style={{fontSize:10,color:"#94a3b8"}}>por persona</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8,marginBottom:12}}>
                          <div style={{flex:1,background:"#f8fafc",borderRadius:10,padding:"8px 12px",textAlign:"center"}}>
                            <div style={{fontSize:18,fontWeight:900,color:"#0f172a"}}>{ruta.hora_salida?.slice(0,5)}</div>
                            <div style={{fontSize:10,color:"#64748b"}}>Hora salida</div>
                          </div>
                          <div style={{flex:1,background:"#f8fafc",borderRadius:10,padding:"8px 12px",textAlign:"center"}}>
                            <div style={{fontSize:18,fontWeight:900,color:ruta.puestos_disponibles>0?"#059669":"#ef4444"}}>{ruta.puestos_disponibles}</div>
                            <div style={{fontSize:10,color:"#64748b"}}>Puestos disp.</div>
                          </div>
                          {ruta.acepta_encomiendas&&(
                            <div style={{flex:1,background:"#fff7ed",borderRadius:10,padding:"8px 12px",textAlign:"center"}}>
                              <div style={{fontSize:18}}>📦</div>
                              <div style={{fontSize:9,color:"#c2410c",fontWeight:600}}>Encomiendas</div>
                            </div>
                          )}
                        </div>
                        <button onClick={()=>setContactModal({esRuta:true,ruta:ruta,catId:"rutas"})} style={{width:"100%",background:"#25D366",color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                          📲 Reservar puesto
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* LISTA PROVEEDORES — para todas las demás categorías */}
              {categoriaServicio.id!=="rutas"&&(
                <>
                  <input
                    style={{width:"100%",padding:"10px 14px",borderRadius:12,border:"1px solid #e2e8f0",fontSize:13,marginBottom:12,boxSizing:"border-box",outline:"none"}}
                    placeholder={`Buscar ${categoriaServicio.label.toLowerCase()}... (nombre, especialidad)`}
                    value={searchServicios||""}
                    onChange={e=>setSearchServicios(e.target.value)}
                  />
                  {/* BOTÓN REGISTRO — siempre visible independiente del ternario */}
                  <button onClick={()=>{setTab("Proveedores");setCategoriaServicio(null);}} style={{background:"linear-gradient(135deg,#15803d,#22c55e)",color:"#fff",border:"none",borderRadius:12,padding:"10px 16px",fontSize:12,fontWeight:700,cursor:"pointer",width:"100%",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    🏅 ¿Ofreces este servicio? Regístrate gratis →
                  </button>
                  {(proveedoresServicio.filter(p=>!searchServicios||(p.negocio+p.especialidad+p.descripcion_negocio).toLowerCase().includes(searchServicios.toLowerCase()))).length===0?(
                    <div style={{textAlign:"center",padding:"40px 20px",color:"#94a3b8"}}>
                      <div style={{fontSize:48,marginBottom:12}}>{categoriaServicio.icon}</div>
                      <div style={{fontSize:15,fontWeight:700,color:"#374151",marginBottom:6}}>Próximamente en {ubiActiva.municipio}</div>
                      <div style={{fontSize:12,marginBottom:16}}>Aún no hay proveedores registrados en esta categoría</div>
                      <button onClick={()=>{setTab("Proveedores");setCategoriaServicio(null);}} style={{background:"linear-gradient(135deg,#15803d,#22c55e)",color:"#fff",border:"none",borderRadius:12,padding:"12px 20px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>
                        🏅 ¿Ofreces este servicio? Regístrate gratis →
                      </button>
                    </div>
                  ):(
                    ([...proveedoresServicio].filter(p=>!searchServicios||(p.negocio+(p.especialidad||"")+(p.descripcion_negocio||"")).toLowerCase().includes(searchServicios.toLowerCase())).sort((a,b)=>estaAbiertoAhora(b.horario_desde,b.horario_hasta,b.activo,b.en_pausa,b.forzar_abierto)-estaAbiertoAhora(a.horario_desde,a.horario_hasta,a.activo,a.en_pausa,a.forzar_abierto))).map(prov=>{
                      const abProv=estaAbiertoAhora(prov.horario_desde,prov.horario_hasta,prov.activo,prov.en_pausa,prov.forzar_abierto);
                      return(
                      /* TARJETA CLICKEABLE — abre detalle del proveedor */
                      <div key={prov.id} onClick={async()=>{
                        setProveedorServicioActivo(prov);
                        setHabsProvActivo([]);setTurismoProvActivo([]);
                        const tipoH=["Hotel / Posada","Hotel","Posada","Hospedaje"];
                        const tipoT=["Finca turística","Tour operador","Campamento / Aventura","Campamento","Turismo y aventura"];
                        if(tipoH.some(t=>prov.tipo_negocio?.includes(t))||categoriaServicio?.id==="hoteles"){
                          const{data}=await supabase.from("habitaciones_hotel").select("*").eq("proveedor_id",prov.id).eq("aprobado",true).eq("disponible",true).order("created_at");
                          if(data)setHabsProvActivo(data);
                        } else if(tipoT.some(t=>prov.tipo_negocio?.includes(t))||categoriaServicio?.id==="turismo"){
                          const{data}=await supabase.from("servicios_turismo").select("*").eq("proveedor_id",prov.id).eq("aprobado",true).eq("disponible",true).order("created_at");
                          if(data)setTurismoProvActivo(data);
                        }
                        loadProvResenas(prov.id);
                      }} style={{background:abProv?"#fff":"#f8fafc",borderRadius:16,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:`1px solid ${abProv?"#f1f5f9":"#e2e8f0"}`,cursor:"pointer",transition:"box-shadow 0.15s",opacity:abProv?1:0.75,position:"relative"}}>
                        <div style={{display:"flex",gap:12,alignItems:"center"}}>
                          {prov.logo_url
                            ?<img src={prov.logo_url} style={{width:56,height:56,borderRadius:14,objectFit:"cover",border:"2px solid #f1f5f9",flexShrink:0}}/>
                            :<div style={{width:56,height:56,borderRadius:14,background:categoriaServicio.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#fff",fontWeight:900,flexShrink:0}}>{(prov.negocio||"?")[0]}</div>
                          }
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                              <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>{prov.negocio}</div>
                              <span style={{background:"#dcfce7",color:"#15803d",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>✓ Verificado</span>
                            </div>
                            {prov.especialidad&&<div style={{fontSize:12,color:"#475569",fontWeight:600,marginTop:2}}>{prov.especialidad}</div>}
                            {promediosResenas[prov.id]&&(<div style={{display:"flex",alignItems:"center",gap:3,marginTop:2}}><span style={{color:"#f59e0b",fontSize:11}}>★</span><span style={{fontSize:11,fontWeight:700,color:"#0f172a"}}>{promediosResenas[prov.id].avg}</span><span style={{fontSize:10,color:"#94a3b8"}}>({promediosResenas[prov.id].count})</span></div>)}
                            {prov.descripcion_negocio&&<div style={{fontSize:11,color:"#94a3b8",marginTop:2,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prov.descripcion_negocio}</div>}
                          </div>
                          <div style={{flexShrink:0,textAlign:"center"}}>
                            {(()=>{const ab=estaAbiertoAhora(prov.horario_desde,prov.horario_hasta,prov.activo,prov.en_pausa,prov.forzar_abierto);return(<>
                            <span style={{background:ab?"#dcfce7":"#fee2e2",color:ab?"#15803d":"#dc2626",fontSize:9,fontWeight:700,padding:"3px 7px",borderRadius:10,display:"block",textAlign:"center",marginBottom:4}}>{ab?"● Abierto":"● Cerrado"}</span>
                            {!ab&&(prov.horario_desde)&&<div style={{fontSize:9,color:"#94a3b8",textAlign:"center",lineHeight:1.3}}>🕐 {prov.horario_desde}–{prov.horario_hasta}</div>}
                            <div style={{fontSize:10,color:"#94a3b8",marginTop:4,textAlign:"center"}}>Ver →</div>
                          </>);})()}
                          </div>
                        </div>
                        {(prov.precio_consulta||prov.tarifa_referencial)&&(
                          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                            {prov.precio_consulta&&<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,border:"1px solid #bbf7d0"}}>💰 Consulta: ${prov.precio_consulta}</span>}
                            {prov.tarifa_referencial&&<span style={{background:"#eff6ff",color:"#1d4ed8",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,border:"1px solid #bfdbfe"}}>💲 {prov.tarifa_referencial}</span>}
                          </div>
                        )}
                      </div>
                    );})
                  )}
                </>
              )}
              </>)}
            </div>
          </>
        )}
      </>)}

      {/* PROVEEDORES */}
      {(tab==="Proveedores"||tab==="MiCuenta")&&(<div style={{...s.sec,marginTop:16}}>

        {(provMode==="login"||provMode==="register")&&(<div style={s.pc}>
          <div style={s.pT}>{provMode==="login"?"🏪 Acceso proveedores":"📝 Registro de proveedor"}</div>
          {pmsg&&<div style={s.msg(pmsg.includes("✅"))}>{pmsg}</div>}
          {provMode==="register"&&(<>
            <div style={{background:"#eff6ff",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:11,color:"#1d4ed8",fontWeight:600}}>📧 Tu correo será tu usuario de acceso</div>
            <label style={s.lbl}>Correo electrónico * (acceso)</label>
            <input style={s.inp} placeholder="correo@ejemplo.com" type="email" value={provForm.email} onChange={e=>setProvForm({...provForm,email:e.target.value})}/>
            <label style={s.lbl}>Nombre completo *</label>
            <input style={s.inp} placeholder="María González" value={provForm.nombre} onChange={e=>setProvForm({...provForm,nombre:e.target.value})}/>
            <label style={s.lbl}>Nombre del negocio *</label>
            <input style={s.inp} placeholder="Cosméticos DORCAS" value={provForm.negocio} onChange={e=>setProvForm({...provForm,negocio:e.target.value})}/>
            <label style={s.lbl}>Descripción corta del negocio *</label>
            <input style={s.inp} placeholder="Cuidado capilar y belleza natural" value={provForm.descripcion_negocio} onChange={e=>setProvForm({...provForm,descripcion_negocio:e.target.value})}/>
            <label style={s.lbl}>WhatsApp del negocio * (aquí llegarán los pedidos)</label>
            <input style={s.inp} placeholder="04243232671" value={provForm.whatsapp_negocio} onChange={e=>setProvForm({...provForm,whatsapp_negocio:e.target.value})}/>
            <label style={s.lbl}>Teléfono principal (para cobros y contacto administrativo)</label>
            <input style={s.inp} placeholder="04143232671" value={provForm.telefono_principal} onChange={e=>setProvForm({...provForm,telefono_principal:e.target.value})}/>
            <label style={s.lbl}>Instagram (opcional)</label>
            <input style={s.inp} placeholder="@cosmeticosdorcas" value={provForm.instagram||""} onChange={e=>setProvForm({...provForm,instagram:e.target.value})}/>

            {/* SELECTOR DE MÓDULO */}
            <label style={s.lbl}>¿Dónde quieres aparecer en Lokl? *</label>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
              {[
                {id:"comida",emoji:"🍽️",titulo:"Feria de comida",desc:"Soy restaurante, cocina, panadería o negocio de comida preparada"},
                {id:"tienda",emoji:"🛍️",titulo:"Negocios locales",desc:"Vendo productos físicos: ropa, cosméticos, ferretería, farmacia, etc."},
                {id:"servicio",emoji:"🔧",titulo:"Directorio de servicios",desc:"Ofrezco servicios: belleza, salud, transporte, reparaciones, educación, etc."},
              ].map(m=>{
                const sel=provForm._modulo===m.id;
                return(
                  <div key={m.id} onClick={()=>setProvForm(f=>({...f,_modulo:m.id,tipo_negocio:m.id==="comida"?"Restaurante / Cocina / Comida":m.id==="tienda"?"Tienda / Negocio local":"",categorias:[],tipo_operacion_gastro:"",subcategoria_servicio:""}))} style={{display:"flex",alignItems:"flex-start",gap:10,background:sel?"#eff6ff":"#fff",border:`2px solid ${sel?"#3b82f6":"#e2e8f0"}`,borderRadius:12,padding:"12px",cursor:"pointer"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:sel?"#3b82f6":"#e2e8f0",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{sel&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}</div>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:sel?"#1d4ed8":"#374151"}}>{m.emoji} {m.titulo}</div>
                      <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{m.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TIPO ESPECÍFICO — solo si módulo es servicio o tienda */}
            {provForm._modulo==="servicio"&&(
              <>
                <label style={s.lbl}>Tipo de servicio *</label>
                <select style={{...s.inp,background:"#fff"}} value={provForm.tipo_negocio} onChange={e=>setProvForm({...provForm,tipo_negocio:e.target.value,categorias:[],subcategoria_servicio:""})}>
                  <option value="">— Selecciona —</option>
                  <optgroup label="🏨 Hospedaje y turismo">
                    <option>Hotel / Posada</option>
                    <option>Finca turística</option>
                    <option>Tour operador</option>
                    <option>Campamento / Aventura</option>
                  </optgroup>
                  <optgroup label="🚗 Transporte">
                    <option>Mototaxi</option>
                    <option>Taxi</option>
                    <option>Transporte interurbano (rutas)</option>
                    <option>Encomiendas y mudanzas</option>
                  </optgroup>
                  <optgroup label="🏥 Salud">
                    <option>Médico / Consultorio</option>
                    <option>Enfermería a domicilio</option>
                    <option>Laboratorio clínico</option>
                    <option>Odontología</option>
                    <option>Farmacia</option>
                  </optgroup>
                  <optgroup label="💇 Belleza y estética">
                    <option>Peluquería / Barbería</option>
                    <option>Manicure / Pedicure</option>
                    <option>Maquillaje y estética</option>
                  </optgroup>
                  <optgroup label="🏠 Hogar y construcción">
                    <option>Plomería</option>
                    <option>Electricidad</option>
                    <option>Pintura y construcción</option>
                    <option>Limpieza del hogar</option>
                    <option>Carpintería / Herrería</option>
                  </optgroup>
                  <optgroup label="📚 Educación">
                    <option>Clases y tutorías</option>
                    <option>Idiomas</option>
                  </optgroup>
                  <optgroup label="🔩 Mecánica">
                    <option>Mecánica automotriz</option>
                    <option>Electricidad automotriz</option>
                  </optgroup>
                  <optgroup label="✦ Otros servicios">
                    <option>Lavandería</option>
                    <option>Fotografía / Video</option>
                    <option>Otro</option>
                  </optgroup>
                </select>
              </>
            )}

            {provForm._modulo==="tienda"&&(
              <>
                <label style={s.lbl}>Categoría principal de tu tienda *</label>
                <select style={{...s.inp,background:"#fff"}} value={(provForm.categorias||[])[0]||""} onChange={e=>setProvForm({...provForm,categorias:e.target.value?[e.target.value]:[]})}>
                  <option value="">— Selecciona una categoría —</option>
                  <option>Ropa</option>
                  <option>Calzado</option>
                  <option>Maquillaje</option>
                  <option>Cuidado personal</option>
                  <option>Accesorios</option>
                  <option>Tecnología</option>
                  <option>Hogar</option>
                  <option>Mascotas</option>
                  <option>Farmacia</option>
                  <option>Ferretería</option>
                  <option>Regalos</option>
                  <option>Alimentos</option>
                  <option>Otros</option>
                </select>
              </>
            )}

            {/* CAMPOS ESPECÍFICOS SEGÚN TIPO */}
            {/* RESTAURANTE */}
            {provForm.tipo_negocio==="Restaurante / Cocina / Comida"&&(
              <div style={{background:"#f8fafc",borderRadius:14,padding:"12px",marginBottom:4,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>¿Cómo funciona tu negocio? *</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {TIPOS_OPERACION_GASTRO.map(t=>(
                    <div key={t.value} onClick={()=>setProvForm(f=>({...f,tipo_operacion_gastro:t.value}))} style={{display:"flex",alignItems:"flex-start",gap:10,background:provForm.tipo_operacion_gastro===t.value?"#eff6ff":"#fff",border:`2px solid ${provForm.tipo_operacion_gastro===t.value?"#3b82f6":"#e2e8f0"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:provForm.tipo_operacion_gastro===t.value?"#3b82f6":"#e2e8f0",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{provForm.tipo_operacion_gastro===t.value&&<span style={{color:"#fff",fontSize:12,fontWeight:900}}>✓</span>}</div>
                      <div><div style={{fontSize:13,fontWeight:700,color:provForm.tipo_operacion_gastro===t.value?"#1d4ed8":"#374151"}}>{t.label}</div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{t.desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MÉDICO / CONSULTORIO */}
            {["Médico / Consultorio","Enfermería a domicilio","Odontología"].includes(provForm.tipo_negocio)&&(
              <div style={{background:"#eff6ff",borderRadius:12,padding:"12px",marginBottom:4,border:"1px solid #bfdbfe"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>👨‍⚕️ Datos profesionales</div>
                <label style={s.lbl}>Especialidad *</label>
                <input style={s.inp} placeholder={provForm.tipo_negocio==="Médico / Consultorio"?"Ej: Medicina general, Pediatría, Cardiología...":provForm.tipo_negocio==="Odontología"?"Ej: Odontología general, Ortodoncia...":"Ej: Enfermería clínica, Cuidados domiciliarios..."} value={provForm.especialidad||""} onChange={e=>setProvForm(f=>({...f,especialidad:e.target.value}))}/>
                <label style={s.lbl}>Precio por consulta ($)</label>
                <input style={s.inp} type="number" placeholder="15.00" value={provForm.precio_consulta||""} onChange={e=>setProvForm(f=>({...f,precio_consulta:e.target.value}))}/>
                <label style={s.lbl}>Matrícula MPPS (opcional)</label>
                <input style={s.inp} placeholder="MPPS-00000" value={provForm.matricula_prof||""} onChange={e=>setProvForm(f=>({...f,matricula_prof:e.target.value}))}/>
                <label style={s.lbl}>Dirección del consultorio / zona de atención</label>
                <input style={s.inp} placeholder="Ej: Calle Bolívar, frente al hospital / A domicilio" value={provForm.zona_cobertura||""} onChange={e=>setProvForm(f=>({...f,zona_cobertura:e.target.value}))}/>
              </div>
            )}

            {/* LABORATORIO */}
            {provForm.tipo_negocio==="Laboratorio clínico"&&(
              <div style={{background:"#fdf4ff",borderRadius:12,padding:"12px",marginBottom:4,border:"1px solid #e9d5ff"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#7e22ce",marginBottom:8}}>🔬 Catálogo de exámenes</div>
                <label style={s.lbl}>Exámenes disponibles y precios *</label>
                <textarea style={{...s.inp,minHeight:90,resize:"vertical"}} placeholder={"Hemograma completo $8\nGlucosa en ayunas $5\nPerfil 20 $25\nPrueba de embarazo $4\nCoronavirus $10..."} value={provForm.examenes||""} onChange={e=>setProvForm(f=>({...f,examenes:e.target.value}))}/>
                <label style={s.lbl}>Horario de atención</label>
                <input style={s.inp} placeholder="Lun-Vie 7AM-12PM · Sáb 7AM-10AM" value={provForm.horarios_atencion||""} onChange={e=>setProvForm(f=>({...f,horarios_atencion:e.target.value}))}/>
              </div>
            )}

            {/* BELLEZA */}
            {["Peluquería / Barbería","Manicure / Pedicure","Maquillaje y estética"].includes(provForm.tipo_negocio)&&(
              <div style={{background:"#fdf2f8",borderRadius:12,padding:"12px",marginBottom:4,border:"1px solid #fbcfe8"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#9d174d",marginBottom:8}}>💇 Servicios y tarifas</div>
                <label style={s.lbl}>Servicios que ofreces</label>
                <input style={s.inp} placeholder="Ej: Corte dama $8, Corte caballero $5, Tinte $20..." value={provForm.especialidad||""} onChange={e=>setProvForm(f=>({...f,especialidad:e.target.value}))}/>
                <label style={s.lbl}>¿Atiendes a domicilio?</label>
                <div style={{display:"flex",gap:8,marginBottom:4}}>
                  {["Sí, a domicilio","Solo en local","Ambas opciones"].map(op=>(
                    <button key={op} type="button" onClick={()=>setProvForm(f=>({...f,zona_cobertura:op}))} style={{flex:1,padding:"8px 4px",borderRadius:10,border:`2px solid ${provForm.zona_cobertura===op?"#db2777":"#e2e8f0"}`,background:provForm.zona_cobertura===op?"#fdf2f8":"#fff",fontSize:10,fontWeight:700,color:provForm.zona_cobertura===op?"#db2777":"#64748b",cursor:"pointer"}}>{op}</button>
                  ))}
                </div>
              </div>
            )}

            {/* TRANSPORTE */}
            {["Mototaxi","Taxi","Transporte interurbano (rutas)","Encomiendas y mudanzas"].includes(provForm.tipo_negocio)&&(
              <div style={{background:"#f0fdf4",borderRadius:12,padding:"12px",marginBottom:4,border:"1px solid #bbf7d0"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#15803d",marginBottom:8}}>🚗 Detalles del servicio</div>
                <label style={s.lbl}>Tarifa referencial</label>
                <input style={s.inp} placeholder={provForm.tipo_negocio==="Mototaxi"?"Ej: Desde $1 dentro de SF":provForm.tipo_negocio==="Taxi"?"Ej: Desde $2, $15 aeropuerto":provForm.tipo_negocio==="Transporte interurbano (rutas)"?"Ej: SF→Valencia $15, SF→Caracas $25":"Ej: $3 dentro de SF, consultar para envíos foráneos"} value={provForm.tarifa_referencial||""} onChange={e=>setProvForm(f=>({...f,tarifa_referencial:e.target.value}))}/>
                {provForm.tipo_negocio==="Transporte interurbano (rutas)"&&(
                  <>
                    <label style={s.lbl}>Rutas que cubre</label>
                    <input style={s.inp} placeholder="Ej: SF ↔ Valencia · SF ↔ Caracas · SF ↔ Barinas" value={provForm.zona_cobertura||""} onChange={e=>setProvForm(f=>({...f,zona_cobertura:e.target.value}))}/>
                  </>
                )}
                {["Mototaxi","Taxi"].includes(provForm.tipo_negocio)&&(
                  <>
                    <label style={s.lbl}>Zona de cobertura</label>
                    <input style={s.inp} placeholder="Ej: Todo San Fernando · Biruaca · Zona industrial" value={provForm.zona_cobertura||""} onChange={e=>setProvForm(f=>({...f,zona_cobertura:e.target.value}))}/>
                  </>
                )}
              </div>
            )}

            {/* EDUCACIÓN */}
            {["Clases y tutorías","Idiomas"].includes(provForm.tipo_negocio)&&(
              <div style={{background:"#eff6ff",borderRadius:12,padding:"12px",marginBottom:4,border:"1px solid #bfdbfe"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>📚 Detalles académicos</div>
                <label style={s.lbl}>Materias o áreas que enseñas *</label>
                <input style={s.inp} placeholder="Ej: Matemáticas, Física, Inglés avanzado..." value={provForm.especialidad||""} onChange={e=>setProvForm(f=>({...f,especialidad:e.target.value}))}/>
                <label style={s.lbl}>Tarifa por hora</label>
                <input style={s.inp} placeholder="Ej: $8/hora, $30/4 clases" value={provForm.tarifa_referencial||""} onChange={e=>setProvForm(f=>({...f,tarifa_referencial:e.target.value}))}/>
                <label style={s.lbl}>Modalidad</label>
                <div style={{display:"flex",gap:8}}>
                  {["Presencial","Online","Ambas"].map(op=>(
                    <button key={op} type="button" onClick={()=>setProvForm(f=>({...f,zona_cobertura:op}))} style={{flex:1,padding:"8px 4px",borderRadius:10,border:`2px solid ${provForm.zona_cobertura===op?"#1d4ed8":"#e2e8f0"}`,background:provForm.zona_cobertura===op?"#eff6ff":"#fff",fontSize:11,fontWeight:700,color:provForm.zona_cobertura===op?"#1d4ed8":"#64748b",cursor:"pointer"}}>{op}</button>
                  ))}
                </div>
              </div>
            )}

            {/* MECÁNICA / HOGAR / CONSTRUCCIÓN */}
            {["Mecánica automotriz","Electricidad automotriz","Plomería","Electricidad","Pintura y construcción","Limpieza del hogar","Carpintería / Herrería"].includes(provForm.tipo_negocio)&&(
              <div style={{background:"#f8fafc",borderRadius:12,padding:"12px",marginBottom:4,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:8}}>🔧 Detalles del servicio</div>
                <label style={s.lbl}>Servicios específicos que ofreces</label>
                <input style={s.inp} placeholder="Ej: Reparación de frenos, cambio de aceite, diagnóstico..." value={provForm.especialidad||""} onChange={e=>setProvForm(f=>({...f,especialidad:e.target.value}))}/>
                <label style={s.lbl}>Tarifa referencial</label>
                <input style={s.inp} placeholder="Ej: Desde $10, Presupuesto según trabajo..." value={provForm.tarifa_referencial||""} onChange={e=>setProvForm(f=>({...f,tarifa_referencial:e.target.value}))}/>
                <label style={s.lbl}>Zona de cobertura</label>
                <input style={s.inp} placeholder="Ej: Todo San Fernando, solo zona centro..." value={provForm.zona_cobertura||""} onChange={e=>setProvForm(f=>({...f,zona_cobertura:e.target.value}))}/>
              </div>
            )}
            {/* CAMPOS ESPECÍFICOS PARA TRANSPORTE legacy */}
            {provForm.tipo_negocio==="Transporte y encomiendas"&&(
              <div style={{background:"#f0fdf4",borderRadius:12,padding:"12px",marginBottom:4,border:"1px solid #bbf7d0"}}>
                <label style={s.lbl}>Tarifa referencial</label>
                <input style={s.inp} placeholder="Ej: Desde $1, $15 por ruta SF-Valencia..." value={provForm.tarifa_referencial||""} onChange={e=>setProvForm(f=>({...f,tarifa_referencial:e.target.value}))}/>
                <label style={s.lbl}>Zona de cobertura / Rutas</label>
                <input style={s.inp} placeholder="Ej: Todo San Fernando / SF → Valencia → Caracas" value={provForm.zona_cobertura||""} onChange={e=>setProvForm(f=>({...f,zona_cobertura:e.target.value}))}/>
              </div>
            )}
            <label style={s.lbl}>Horario de atención</label>
            <div style={{display:"flex",gap:8,marginBottom:6}}>
              <div style={{flex:1}}><label style={{...s.lbl,marginBottom:2}}>Abre</label><input style={s.inp} type="time" value={provForm.horario_desde} onChange={e=>setProvForm({...provForm,horario_desde:e.target.value})}/></div>
              <div style={{flex:1}}><label style={{...s.lbl,marginBottom:2}}>Cierra</label><input style={s.inp} type="time" value={provForm.horario_hasta} onChange={e=>setProvForm({...provForm,horario_hasta:e.target.value})}/></div>
            </div>
            <input style={s.inp} placeholder="Ej: Solo fines de semana, Lun-Vie..." value={provForm.horario_desc} onChange={e=>setProvForm({...provForm,horario_desc:e.target.value})}/>
            {/* DELIVERY — solo para comida y negocios */}
            {["Restaurante / Cocina / Comida","Tienda / Negocio local","Farmacia","Lavandería"].includes(provForm.tipo_negocio)&&(<>
              <label style={s.lbl}>¿Cómo entregas los pedidos?</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <button type="button" onClick={()=>setProvForm({...provForm,delivery_propio:!provForm.delivery_propio})} style={{padding:"12px 8px",borderRadius:12,border:`2px solid ${provForm.delivery_propio?"#15803d":"#e2e8f0"}`,background:provForm.delivery_propio?"#f0fdf4":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:22}}>🛵</span>
                  <span style={{fontSize:12,fontWeight:700,color:provForm.delivery_propio?"#15803d":"#374151"}}>Delivery</span>
                  <span style={{fontSize:10,color:provForm.delivery_propio?"#15803d":"#94a3b8"}}>Entrego a domicilio</span>
                  <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${provForm.delivery_propio?"#15803d":"#d1d5db"}`,background:provForm.delivery_propio?"#15803d":"#fff",display:"flex",alignItems:"center",justifyContent:"center",marginTop:2}}>{provForm.delivery_propio&&<span style={{color:"#fff",fontSize:11,fontWeight:900}}>✓</span>}</div>
                </button>
                <button type="button" onClick={()=>setProvForm({...provForm,permite_retiro:!provForm.permite_retiro})} style={{padding:"12px 8px",borderRadius:12,border:`2px solid ${provForm.permite_retiro?"#3b82f6":"#e2e8f0"}`,background:provForm.permite_retiro?"#eff6ff":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:22}}>🏪</span>
                  <span style={{fontSize:12,fontWeight:700,color:provForm.permite_retiro?"#1d4ed8":"#374151"}}>Retiro en local</span>
                  <span style={{fontSize:10,color:provForm.permite_retiro?"#3b82f6":"#94a3b8"}}>El cliente recoge</span>
                  <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${provForm.permite_retiro?"#3b82f6":"#d1d5db"}`,background:provForm.permite_retiro?"#3b82f6":"#fff",display:"flex",alignItems:"center",justifyContent:"center",marginTop:2}}>{provForm.permite_retiro&&<span style={{color:"#fff",fontSize:11,fontWeight:900}}>✓</span>}</div>
                </button>
              </div>
              {provForm.delivery_propio&&(
                <div style={{background:"#f0fdf4",borderRadius:10,padding:"10px 12px",marginBottom:8,border:"1px solid #bbf7d0"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#15803d",marginBottom:8}}>Configura tu delivery</div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1}}><label style={s.lbl}>Costo $</label><input style={s.inp} type="number" placeholder="1.50" value={provForm.delivery_costo} onChange={e=>setProvForm({...provForm,delivery_costo:parseFloat(e.target.value)||0})}/></div>
                    <div style={{flex:1}}><label style={s.lbl}>Gratis desde $</label><input style={s.inp} type="number" placeholder="15" value={provForm.delivery_gratis_desde} onChange={e=>setProvForm({...provForm,delivery_gratis_desde:parseFloat(e.target.value)||15})}/></div>
                  </div>
                </div>
              )}
            </>)}
            {["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provForm.tipo_negocio)&&(<>
            <label style={s.lbl}>Dirección física</label>
            <input style={s.inp} placeholder="Calle Comercio #47, Local 3..." value={provForm.direccion_fisica||""} onChange={e=>setProvForm({...provForm,direccion_fisica:e.target.value})}/>
            </>)}

            {/* UBICACIÓN OBLIGATORIA */}
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"12px",marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>📍 Ubicación del servicio <span style={{color:"#ef4444"}}>*</span></div>
              <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>Tus clientes te encontrarán según su ciudad</div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{flex:1}}>
                  <label style={s.lbl}>Estado <span style={{color:"#ef4444"}}>*</span></label>
                  <select style={{...s.inp,background:"#fff",marginBottom:0}} value={provForm.estado_ubicacion||""} onChange={e=>setProvForm(f=>({...f,estado_ubicacion:e.target.value,municipio:""}))}>
                    <option value="">Selecciona...</option>
                    {Object.keys(VE_ESTADOS_MUNICIPIOS).sort().map(est=><option key={est} value={est}>{est}</option>)}
                  </select>
                </div>
                <div style={{flex:1}}>
                  <label style={s.lbl}>Municipio <span style={{color:"#ef4444"}}>*</span></label>
                  <select style={{...s.inp,background:"#fff",marginBottom:0}} value={provForm.municipio||""} onChange={e=>setProvForm(f=>({...f,municipio:e.target.value}))}>
                    <option value="">Selecciona...</option>
                    {(VE_ESTADOS_MUNICIPIOS[provForm.estado_ubicacion||""]||[]).map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {/* CATEGORÍAS — solo para comida y tiendas */}
            {["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provForm.tipo_negocio)&&(()=>{
              const esComida=provForm.tipo_negocio==="Restaurante / Cocina / Comida";
              const regCats=esComida?TIPOS_COMIDA:NEGOCIO_CATS.map(c=>c.cat);
              const catLabel=esComida?"Tipos de comida que ofreces":"Categorías de tu negocio";
              return(<>
                <label style={s.lbl}>{catLabel} {provForm.categorias.length>0&&<span style={{color:P,fontWeight:700}}>({provForm.categorias.length} seleccionadas)</span>}</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                  {regCats.map(c=>(<button key={c} onClick={()=>setProvForm(f=>({...f,categorias:f.categorias.includes(c)?f.categorias.filter(x=>x!==c):[...f.categorias,c]}))} style={{padding:"6px 12px",borderRadius:20,fontSize:12,cursor:"pointer",background:provForm.categorias.includes(c)?P:"#f1f5f9",color:provForm.categorias.includes(c)?"#fff":"#64748b",border:provForm.categorias.includes(c)?`2px solid ${P}`:"2px solid transparent",fontWeight:provForm.categorias.includes(c)?700:500,transition:"all 0.15s"}}>{c}</button>))}
                </div>
              </>);
            })()}
            <div style={{...s.ib,background:"#f0fdf4",marginBottom:8}}><div style={{fontSize:12,color:"#15803d"}}>🎁 45 días gratis sin compromiso. Después $2.99/mes (restaurantes y negocios) o $1.99/mes (servicios y transporte).</div></div>
            <label style={s.lbl}>Logo del negocio</label>
            {logoPreview&&<img src={logoPreview} alt="" style={{width:60,height:60,borderRadius:"50%",objectFit:"cover",marginBottom:8}}/>}
            <input type="file" accept="image/*" style={{marginBottom:10,fontSize:13}} onChange={e=>{const f=e.target.files[0];if(f){setLogoFile(f);setLogoPreview(URL.createObjectURL(f));}}}/>
          </>)}
          {provMode==="login"&&<><label style={s.lbl}>Correo electrónico</label><input style={s.inp} placeholder="correo@ejemplo.com" type="email" value={provForm.email} onChange={e=>setProvForm({...provForm,email:e.target.value})}/></>}
          <label style={s.lbl}>Contraseña *</label>
          <input style={s.inp} type="password" placeholder="••••••••" value={provForm.pass} onChange={e=>setProvForm({...provForm,pass:e.target.value})}/>
          <button style={s.btn} onClick={provMode==="login"?handleLogin:handleRegister} disabled={loading}>{loading?"Procesando...":(provMode==="login"?"Entrar":"Registrarme")}</button>
          <button style={s.btnG} onClick={()=>{setProvModeRaw(provMode==="login"?"register":"login");setPmsg("");}}>{provMode==="login"?"¿Nuevo? Regístrate aquí":"¿Ya tienes cuenta? Inicia sesión"}</button>
          {provMode==="login"&&(
            <button style={{background:"none",border:"none",color:"#94a3b8",fontSize:12,cursor:"pointer",marginTop:4,textDecoration:"underline"}} onClick={()=>{
              const correo=provForm.email;
              if(!correo)return setPmsg("Escribe tu correo primero");
              const num=WA.startsWith("0")?"58"+WA.slice(1):WA;
              window.location.href="https://wa.me/"+num+"?text="+encodeURIComponent("Hola Lokl, olvidé mi contraseña. Mi correo registrado es: "+correo);
            }}>¿Olvidaste tu contraseña?</button>
          )}
        </div>)}

        {/* DASHBOARD PROVEEDOR */}
        {provMode==="dash"&&provData&&(<>
          {/* HEADER PROFESIONAL */}
          <div style={{background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1d4ed8 100%)",padding:"20px 16px 18px",color:"#fff"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              {provData.logo_url
                ?<img src={provData.logo_url} alt="" style={{width:56,height:56,borderRadius:16,objectFit:"cover",border:"2.5px solid rgba(255,255,255,0.3)",flexShrink:0,boxShadow:"0 4px 12px rgba(0,0,0,0.3)"}}/>
                :<div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#25D366,#1aab52)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff",flexShrink:0,boxShadow:"0 4px 12px rgba(0,0,0,0.3)"}}>{(provData.negocio||"?")[0].toUpperCase()}</div>
              }
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:-0.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{provData.negocio}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:1}}>{provData.email}</div>
                {provData.tipo_negocio&&<div style={{fontSize:10,color:"#93c5fd",fontWeight:600,marginTop:3,background:"rgba(147,197,253,0.15)",display:"inline-block",padding:"2px 8px",borderRadius:20}}>{provData.tipo_negocio}</div>}
              </div>

            </div>
            {/* SUSCRIPCIÓN BADGE */}
            {provData.meses_gratis_restantes>0?(
              <div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"9px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",backdropFilter:"blur(4px)"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14}}>🎁</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:600}}>Período de prueba gratuito</span>
                </div>
                <span style={{fontSize:12,fontWeight:800,color:"#4ade80",background:"rgba(74,222,128,0.15)",padding:"3px 10px",borderRadius:20}}>{provData.meses_gratis_restantes===1?"~45 días":provData.meses_gratis_restantes+" meses"} restante{provData.meses_gratis_restantes!==1?"s":""}</span>
              </div>
            ):(
              <div style={{background:provData.suscripcion_pagada?"rgba(37,211,102,0.08)":"rgba(239,68,68,0.1)",border:`1px solid ${provData.suscripcion_pagada?"rgba(37,211,102,0.25)":"rgba(239,68,68,0.3)"}`,borderRadius:12,padding:"9px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14}}>{provData.suscripcion_pagada?"✅":"⚠️"}</span>
                  <span style={{fontSize:11,color:provData.suscripcion_pagada?"#4ade80":"#fca5a5",fontWeight:600}}>{provData.suscripcion_pagada?"Suscripción activa":"Suscripción vencida — contacta al admin"}</span>
                </div>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Vence: {provData.suscripcion_vence?.slice(0,10)}</span>
              </div>
            )}
          </div>

          {pmsg&&<div style={{...s.msg(pmsg.includes("✅")),margin:"8px 16px 0"}}>{pmsg}</div>}
          {/* BOTÓN ABIERTO/CERRADO — estilo unificado */}
          <div style={{padding:"12px 16px 0"}}>
            {(()=>{
              const enHorario=estaAbiertoAhora(provData.horario_desde,provData.horario_hasta,true,false,null);
              const abierto=estaAbiertoAhora(provData.horario_desde,provData.horario_hasta,provData.activo,provData.en_pausa,provData.forzar_abierto);
              const forzadoAbierto=provData.forzar_abierto===true;
              const forzadoCerrado=provData.forzar_abierto===false;
              const subtext=forzadoAbierto?"Abierto manualmente — toca para volver al horario":forzadoCerrado?"Cerrado manualmente — toca para abrir":enHorario?"En horario — toca para forzar cierre":"Fuera de horario — toca para abrir ahora";
              const titulo=abierto?"ABIERTO — Recibiendo pedidos":"CERRADO";
              const subtitulo=forzadoAbierto?" (apertura manual)":forzadoCerrado?" (cierre manual)":enHorario?" (en horario)":" (fuera de horario)";
              return(
                <button type="button" style={s.toggleBtn(abierto)} onClick={toggleMiEstado}>
                  <span style={{fontSize:22}}>{abierto?"🟢":"🔴"}</span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:14,fontWeight:800,color:abierto?"#15803d":"#dc2626"}}>{titulo}<span style={{fontSize:11,fontWeight:400,color:"#94a3b8"}}>{subtitulo}</span></div>
                    <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{subtext}</div>
                  </div>
                </button>
              );
            })()}
          </div>
          <div>
            {/* Si hay sección activa distinta a estado, mostrar botón volver */}
            {provTab!=="estado"&&!["prod_nuevo","prod_aprobados","prod_pendientes","prod_rechazados","promo_nueva","promo_activas","promo_pausadas","promo_pendientes","promo_rechazadas"].includes(provTab)&&(
              <div style={{padding:"12px 16px 4px"}}>
                <button onClick={()=>{setProvTab("estado");if(provData?.id)loadMisRestPedidos(provData.id,provData.negocio);}} style={{display:"flex",alignItems:"center",gap:6,background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:600,color:"#475569",cursor:"pointer"}}>
                  ← Panel principal
                </button>
              </div>
            )}
            {/* PANEL PRINCIPAL — solo visible en estado */}
            {provTab==="estado"&&(
              <div style={{padding:"14px 16px 12px"}}>

                {/* STATS — 4 métricas clave */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  {[
                    {num:`$${myIngresoHoy.toFixed(2)}`,lbl:"Ingresos hoy",icon:"💰",color:"#15803d",bg:"#f0fdf4",border:"#bbf7d0"},
                    {num:`$${myIngresoTotal.toFixed(2)}`,lbl:"Total histórico",icon:"📊",color:"#1d4ed8",bg:"#eff6ff",border:"#bfdbfe"},
                    {num:myVentasHoy.length,lbl:"Ventas hoy",icon:"🛒",color:"#7e22ce",bg:"#fdf4ff",border:"#e9d5ff"},
                    {num:myClientes,lbl:"Clientes únicos",icon:"👥",color:"#b45309",bg:"#fffbeb",border:"#fde68a"},
                  ].map((m,i)=>(
                    <div key={i} style={{background:m.bg,border:`1px solid ${m.border}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:26,flexShrink:0}}>{m.icon}</div>
                      <div>
                        <div style={{fontSize:18,fontWeight:900,color:m.color,letterSpacing:-0.5,lineHeight:1}}>{m.num}</div>
                        <div style={{fontSize:10,color:"#64748b",marginTop:3,fontWeight:500}}>{m.lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ACCESOS DEL NEGOCIO */}
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:10,letterSpacing:1,textTransform:"uppercase"}}>{!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Tu directorio de servicios":"Tu tienda virtual"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[
                    {k:"pedidos_rest", icon:"📋", label:"Pedidos",     sub:"Gestiona tus pedidos", color:"#fff",  textColor:"#0f172a", bg:"linear-gradient(135deg,#1d4ed8,#3b82f6)", n:misRestPedidos.filter(p=>!["entregado","cancelado"].includes(p.estado||"nuevo")).length},
                    {k:"prod_aprobados",icon:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"🩺":"📦",label:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Mis servicios":"Productos",sub:!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Servicios que ofrezco":"Tu catálogo en línea",color:"#fff",textColor:"#0f172a",bg:"linear-gradient(135deg,#15803d,#22c55e)",n:0},
                    {k:"promo_nueva",  icon:"🎉", label:"Promociones", sub:"Ofertas especiales",    color:"#fff",  textColor:"#0f172a", bg:"linear-gradient(135deg,#7e22ce,#a855f7)", n:myPromos.filter(pr=>pr.motivo_rechazo).length},
                    {k:"clientes",     icon:"👥", label:"Clientes",    sub:"Tu base de clientes",   color:"#fff",  textColor:"#0f172a", bg:"linear-gradient(135deg,#0369a1,#0ea5e9)", n:0},
                    {k:"ventas",       icon:"📈", label:"Mis ventas",  sub:"Dashboard de ingresos", color:"#fff",  textColor:"#0f172a", bg:"linear-gradient(135deg,#b45309,#f59e0b)", n:0},
                    {k:"mi_negocio",   icon:"⚙️", label:"Mi negocio",  sub:"Perfil y configuración",color:"#fff",  textColor:"#0f172a", bg:"linear-gradient(135deg,#374151,#6b7280)", n:0},
                    ...((["Transporte interurbano (rutas)","Transporte y encomiendas"].includes(provData.tipo_negocio))?[
                      {k:"mis_rutas", icon:"🚌", label:"Mis rutas", sub:"Gestiona tus rutas", color:"#fff", textColor:"#0f172a", bg:"linear-gradient(135deg,#064e3b,#059669)", n:0},
                    ]:[]),
                    ...(["Hotel","Posada","Hospedaje","Hotel / Posada"].includes(provData.tipo_negocio)?[
                      {k:"mis_habitaciones", icon:"🛏️", label:"Habitaciones", sub:"Gestiona tu oferta", color:"#fff", textColor:"#0f172a", bg:"linear-gradient(135deg,#134e4a,#0d9488)", n:0},
                    ]:[]),
                    ...(["Finca turística","Tour operador","Campamento","Turismo y aventura","Campamento / Aventura"].includes(provData.tipo_negocio)?[
                      {k:"mis_turismo", icon:"🌴", label:"Mis servicios", sub:"Lo que ofreces", color:"#fff", textColor:"#0f172a", bg:"linear-gradient(135deg,#064e3b,#16a34a)", n:0},
                    ]:[]),
                  ].map(t=>(
                    <button key={t.k} onClick={()=>{
                      setProvTab(t.k);
                      if(t.k==="clientes")loadMisClientes(provData.negocio);
                      if(t.k==="pedidos_rest")loadMisRestPedidos(provData.id,provData.negocio);
                      if(t.k==="mis_rutas")loadMisRutas(provData.id);
                      if(t.k==="mis_habitaciones")loadMisHabitaciones(provData.id);
                      if(t.k==="mis_turismo")loadMisTurismo(provData.id);
                    }} style={{background:t.k==="ventas"?"#16a34a":"#fff",border:t.k==="ventas"?"none":"1px solid #e2e8f0",borderRadius:14,padding:"16px 14px",textAlign:"left",cursor:"pointer",position:"relative",transition:"transform 0.1s"}}>
                      <div style={{fontSize:26,marginBottom:8,color:t.k==="ventas"?"#fff":"#16a34a"}}>{t.icon}</div>
                      <div style={{fontSize:13,fontWeight:800,color:t.k==="ventas"?"#fff":"#0f172a",letterSpacing:-0.2}}>{t.label}</div>
                      <div style={{fontSize:10,color:t.k==="ventas"?"rgba(255,255,255,0.8)":"#94a3b8",marginTop:2,fontWeight:400}}>{t.sub}</div>
                      {t.n>0&&<span style={{position:"absolute",top:10,right:10,background:"#f59e0b",color:"#fff",borderRadius:"50%",width:22,height:22,fontSize:11,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{t.n}</span>}
                    </button>
                  ))}
                </div>
                {/* CERRAR SESIÓN en panel principal */}
                <div style={{marginTop:8}}>
                  <button onClick={()=>{setProvModePersist("login");setProvData(null);setMyProds([]);setMyPromos([]);setMyVentas([]);setPmsg("");setProvTab("estado");}} style={{width:"100%",background:"none",border:"1px solid #e2e8f0",borderRadius:12,padding:"11px",fontSize:13,fontWeight:600,color:"#94a3b8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    🚪 Cerrar sesión
                  </button>
                </div>
              </div>
            )}
            {/* CONTENIDO DE CADA SECCIÓN */}
            {provTab!=="estado"&&(
              <div style={{background:"#fff",borderRadius:0,margin:"0",padding:"0 16px 16px",borderTop:"1px solid #f1f5f9"}}>
                {/* Sub-menú para productos */}
                {["productos","prod_nuevo","prod_aprobados","prod_pendientes","prod_rechazados"].includes(provTab)&&(
                  <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
                    <button onClick={()=>setProvTab("estado")} style={{flexShrink:0,padding:"6px 10px",borderRadius:10,border:"none",background:"#f1f5f9",color:"#64748b",fontSize:11,fontWeight:600,cursor:"pointer"}}>← Volver</button>
                    {[{k:"prod_nuevo",l:"➕ Nuevo"},{k:"prod_aprobados",l:"✅ En tienda"}].map(t=>(
                      <button key={t.k} onClick={()=>setProvTab(t.k)} style={{flexShrink:0,padding:"7px 11px",borderRadius:10,border:"none",background:provTab===t.k?P:"#f1f5f9",color:provTab===t.k?"#fff":"#64748b",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t.l}</button>
                    ))}
                  </div>
                )}
                {/* Sub-menú para promociones */}
                {["promos","promo_nueva","promo_activas","promo_pausadas","promo_pendientes","promo_rechazadas"].includes(provTab)&&(
                  <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
                    <button onClick={()=>setProvTab("estado")} style={{flexShrink:0,padding:"6px 10px",borderRadius:10,border:"none",background:"#f1f5f9",color:"#64748b",fontSize:11,fontWeight:600,cursor:"pointer"}}>← Volver</button>
                    {[{k:"promo_nueva",l:"➕ Nueva"},{k:"promo_activas",l:"✅ Activas"},{k:"promo_pausadas",l:"⏸ Pausadas"},{k:"promo_pendientes",l:"⏳ Pendientes"},{k:"promo_rechazadas",l:"✗ Rechazadas"}].map(t=>(
                      <button key={t.k} onClick={()=>setProvTab(t.k)} style={{flexShrink:0,padding:"7px 11px",borderRadius:10,border:"none",background:provTab===t.k?P:"#f1f5f9",color:provTab===t.k?"#fff":"#64748b",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t.l}</button>
                    ))}
                  </div>
                )}
                {/* Botón volver para secciones simples — Panel principal ya cumple, se omite duplicado */}

          {(provTab==="productos"||provTab==="prod_nuevo"||provTab==="prod_aprobados"||provTab==="prod_pendientes"||provTab==="prod_rechazados")&&(<>

            {provTab==="prod_nuevo"&&(
              <div style={s.pc}>
                <div style={{background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",borderRadius:12,padding:"14px 16px",marginBottom:14,color:"#fff"}}><div style={{fontSize:15,fontWeight:800}}>{"➕ "+(!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Nuevo servicio":"Nuevo producto")}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>Se publicará de inmediato en tu tienda</div></div>
                <label style={s.lbl}>Nombre del servicio *</label>
                <input style={s.inp} placeholder={!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Ej: Consulta médica, Corte de cabello...":"Ej: Nombre del producto"} value={newProd.nombre} onChange={e=>setNewProd({...newProd,nombre:e.target.value})}/>
                {!!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)&&<><label style={s.lbl}>Marca (opcional)</label>
                <input style={s.inp} placeholder="Marca o elaboración (opcional)" value={newProd.marca} onChange={e=>setNewProd({...newProd,marca:e.target.value})}/>
                <label style={s.lbl}>Presentación (opcional)</label>
                <input style={s.inp} placeholder="Ej: 500g, 1 unidad, 1L" value={newProd.presentacion} onChange={e=>setNewProd({...newProd,presentacion:e.target.value})}/></>}
                <label style={s.lbl}>Descripción {!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"(opcional — qué incluye este servicio)":"(opcional)"}</label>
                <input style={s.inp} placeholder={!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Ej: Describe el servicio que ofreces":"Ingredientes, sabor..."} value={newProd.descripcion} onChange={e=>setNewProd({...newProd,descripcion:e.target.value})}/>
                <label style={s.lbl}>Código de referencia (opcional)</label>
                <input style={s.inp} placeholder="Ej: REF-001, SKU-2024, VG5851-M" value={newProd.codigo_ref||""} onChange={e=>setNewProd({...newProd,codigo_ref:e.target.value})}/>
                <label style={s.lbl}>Categoría *</label>
                {(()=>{
                  const SERV_CATS={"Médico / Consultorio":["Consulta médica","Procedimiento","Examen","Certificado médico","Otro"],"Laboratorio clínico":["Hematología","Bioquímica","Orina y heces","Hormonas","Microbiología","Perfil completo","Otros exámenes"],"Odontología":["Consulta","Limpieza dental","Extracción","Ortodoncia","Blanqueamiento","Radiografía","Otro"],"Enfermería a domicilio":["Cuidado diario","Inyección","Curación","Toma de presión","Otro"],"Farmacia":["Medicamentos","Suplementos","Insumos médicos","Otro"],"Peluquería / Barbería":["Corte caballero","Corte dama","Tinte","Tratamiento","Manicure","Pedicure","Otro"],"Manicure / Pedicure":["Manicure","Pedicure","Uñas acrílicas","Nail art","Otro"],"Maquillaje y estética":["Maquillaje","Depilación","Facial","Otro"],"Plomería":["Reparación","Instalación","Destape","Diagnóstico","Otro"],"Electricidad":["Reparación","Instalación","Diagnóstico","Mantenimiento","Otro"],"Pintura y construcción":["Pintura interior","Pintura exterior","Remodelación","Otro"],"Limpieza del hogar":["Limpieza básica","Limpieza profunda","Limpieza de oficina","Otro"],"Carpintería / Herrería":["Fabricación","Reparación","Instalación","Otro"],"Clases y tutorías":["Matemáticas","Física","Química","Inglés","Otra materia"],"Idiomas":["Inglés","Francés","Otro idioma"],"Mecánica automotriz":["Cambio de aceite","Frenos","Motor","Suspensión","Diagnóstico","Otro"],"Electricidad automotriz":["Diagnóstico","Reparación","Instalación de accesorios","Otro"],"Lavandería":["Lavado básico","Lavado y planchado","Ropa de cama","Otro"],"Fotografía / Video":["Sesión fotográfica","Video evento","Edición","Otro"],"Mototaxi":["Traslado de persona","Delivery","Encomienda","Otro"],"Taxi":["Traslado local","Traslado interurbano","Aeropuerto","Otro"],"Transporte interurbano (rutas)":["Pasaje","Encomienda","Ruta especial","Otro"],"Encomiendas y mudanzas":["Encomienda local","Encomienda foránea","Mudanza","Otro"],"Otro":["Servicio principal","Servicio adicional","Consulta","Otro"]};
                  const prodCats=provData.tipo_negocio==="Tienda / Negocio local"
                    ?PROD_CATS_TIENDA
                    :provData.tipo_negocio==="Restaurante / Cocina / Comida"
                    ?(provData.categorias?.length>0?provData.categorias:NEGOCIO_CATS_RESTAURANTE)
                    :SERV_CATS[provData.tipo_negocio]
                    ?(SERV_CATS[provData.tipo_negocio])
                    :(provData.categorias?.length>0?provData.categorias:PROV_CATS);
                  return(<select style={{...s.inp,background:"#fff"}} value={newProd.categoria} onChange={e=>setNewProd({...newProd,categoria:e.target.value,variantes:""})}><option value="">Selecciona una categoría...</option>{prodCats.map(c=><option key={c}>{c}</option>)}</select>);
                })()}
                {/* CAMPO VARIANTES — solo para categorías específicas de Tienda */}
                {provData.tipo_negocio==="Tienda / Negocio local"&&VARIANTES_CONFIG[newProd.categoria]&&(
                  <div style={{background:"#eff6ff",borderRadius:10,padding:"10px 12px",marginBottom:8,border:"1px solid #bfdbfe"}}>
                    <label style={{...s.lbl,color:"#1d4ed8",marginBottom:4}}>🎨 {VARIANTES_CONFIG[newProd.categoria].label}</label>
                    <input style={s.inp} placeholder={VARIANTES_CONFIG[newProd.categoria].placeholder} value={newProd.variantes} onChange={e=>setNewProd({...newProd,variantes:e.target.value})}/>
                    <div style={{fontSize:10,color:"#64748b",marginTop:-6}}>Separa cada opción con coma. El cliente podrá elegir antes de comprar.</div>
                  </div>
                )}
                <label style={s.lbl}>Precio ($) *</label>
                <input style={s.inp} type="number" placeholder="3.50" value={newProd.precio} onChange={e=>setNewProd({...newProd,precio:e.target.value})}/>
                {!!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)&&<>
                <label style={s.lbl}>Unidad *</label>
                <input style={s.inp} placeholder="Ej: unidad, par, docena, 3 unidades, kg, litro" value={newProd.unidad} onChange={e=>setNewProd({...newProd,unidad:e.target.value})}/>
                <label style={s.lbl}>Cantidad disponible *</label>
                <input style={s.inp} type="number" value={newProd.stock} onChange={e=>setNewProd({...newProd,stock:e.target.value})}/>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,background:"#f1f5f9",padding:"10px 14px",borderRadius:10}}>
                  <input type="checkbox" id="perm" checked={newProd.permanente} onChange={e=>setNewProd({...newProd,permanente:e.target.checked})} style={{width:18,height:18}}/>
                  <label htmlFor="perm" style={{fontSize:13,cursor:"pointer"}}>🔁 Disponible hasta agotar stock</label>
                </div>
                {!newProd.permanente&&(<div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={s.lbl}>Desde</label><input style={s.inp} type="time" value={newProd.hi} onChange={e=>setNewProd({...newProd,hi:e.target.value})}/></div><div style={{flex:1}}><label style={s.lbl}>Hasta</label><input style={s.inp} type="time" value={newProd.hf} onChange={e=>setNewProd({...newProd,hf:e.target.value})}/></div></div>)}
                <div onClick={()=>setNewProd({...newProd,es_oferta:!newProd.es_oferta})} style={{display:"flex",alignItems:"center",gap:10,background:newProd.es_oferta?"#fff7ed":"#f8fafc",border:`1px solid ${newProd.es_oferta?"#fed7aa":"#e2e8f0"}`,borderRadius:12,padding:"10px 14px",marginBottom:10,cursor:"pointer"}}><span style={{fontSize:20}}>{newProd.es_oferta?"🏷️":"⬜"}</span><div><div style={{fontSize:13,fontWeight:700,color:newProd.es_oferta?"#c2410c":"#64748b"}}>Destacar como oferta en Inicio</div><div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>Aparecerá en Promociones activas de la home</div></div></div>
                </>}
                <label style={s.lbl}>Fotos {!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"del profesional":"del producto"} (hasta 4)</label>
                <div style={{fontSize:11,color:"#dc2626",marginBottom:8,background:"#fff7ed",padding:"6px 10px",borderRadius:8,border:"1px solid #fed7aa"}}>⚠️ Al publicar confirmas que las fotos son apropiadas. Contenido inapropiado resulta en eliminación inmediata de la cuenta.</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  {[
                    {preview:fotoPreview,setFile:setFotoFile,setPreview:setFotoPreview,label:"Foto 1 *"},
                    {preview:fotoPreview2,setFile:setFotoFile2,setPreview:setFotoPreview2,label:"Foto 2"},
                    {preview:fotoPreview3,setFile:setFotoFile3,setPreview:setFotoPreview3,label:"Foto 3"},
                    {preview:fotoPreview4,setFile:setFotoFile4,setPreview:setFotoPreview4,label:"Foto 4"},
                  ].map((slot,i)=>(
                    <label key={i} style={{cursor:"pointer",display:"block"}}>
                      <div style={{width:"100%",aspectRatio:"1",borderRadius:10,border:"2px dashed #cbd5e1",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:slot.preview?"#000":"#f8fafc",position:"relative"}}>
                        {slot.preview
                          ?<img src={slot.preview} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                          :<div style={{textAlign:"center",color:"#94a3b8"}}><div style={{fontSize:24}}>📷</div><div style={{fontSize:10,marginTop:4}}>{slot.label}</div></div>
                        }
                      </div>
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){slot.setFile(f);slot.setPreview(URL.createObjectURL(f));}}}/>
                    </label>
                  ))}
                </div>

                <button style={{...s.btn,background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",fontSize:15,padding:"14px",borderRadius:12}} onClick={publishProd} disabled={loading}>{loading?"Subiendo...":!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Agregar servicio":"Publicar producto"}</button>
              </div>
            )}

            {provTab==="prod_aprobados"&&(
              <div style={s.pc}>
                <div style={s.pT}>{!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"✅ Mis servicios":"✅ Productos en tienda"}</div>
                {myProds.filter(p=>p.aprobado&&!p.rechazado).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>{!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"Aún no has agregado servicios":"Aún no tienes productos aprobados"}</div>}
                {myProds.filter(p=>p.aprobado&&!p.rechazado).map(p=>(
                  <div key={p.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      {p.foto_url?<img src={p.foto_url} alt="" style={{width:50,height:50,borderRadius:8,objectFit:"cover",cursor:"zoom-in"}} onClick={e=>{e.stopPropagation();abrirLightbox(p.foto_url,p.nombre,p.descripcion,p.precio);}}/>:<span style={{fontSize:28,width:50,textAlign:"center"}}>🍽️</span>}
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700}}>{p.nombre}</div>
                        {(p.marca||p.presentacion)&&<div style={{fontSize:11,color:"#94a3b8"}}>{[p.marca,p.presentacion].filter(Boolean).join(" · ")}</div>}
                        <div style={{fontSize:12,color:"#64748b"}}>${p.precio} / {p.unidad}</div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                          <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:8,background:p.disponible&&p.stock>0?"#dcfce7":"#fee2e2",color:p.disponible&&p.stock>0?"#15803d":"#be123c"}}>
                            {p.disponible&&p.stock>0?"● En tienda":"● Fuera de tienda"}
                          </span>
                          <span style={{fontSize:11,color:"#64748b"}}>Stock: {p.stock}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:12,color:"#64748b",flexShrink:0}}>Cantidad:</span>
                      <button onClick={async()=>{const ns=Math.max(0,p.stock-1);await supabase.from("productos_proveedor").update({stock:ns,disponible:ns>0}).eq("id",p.id);loadMyProds(provData.id);loadAll();}} style={{...s.qB,flexShrink:0}}>−</button>
                      <span style={{fontSize:14,fontWeight:700,minWidth:30,textAlign:"center"}}>{p.stock}</span>
                      <button onClick={async()=>{await supabase.from("productos_proveedor").update({stock:p.stock+1,disponible:true}).eq("id",p.id);loadMyProds(provData.id);loadAll();}} style={{...s.qB,flexShrink:0}}>+</button>
                      <input type="number" placeholder="Cantidad exacta" style={{...s.inp,marginBottom:0,flex:1,fontSize:12,padding:"6px 10px"}}
                        onBlur={async e=>{const v=parseInt(e.target.value);if(!isNaN(v)&&v>=0){await supabase.from("productos_proveedor").update({stock:v,disponible:v>0}).eq("id",p.id);loadMyProds(provData.id);loadAll();}e.target.value="";}}
                        onKeyDown={async e=>{if(e.key==="Enter"){const v=parseInt(e.target.value);if(!isNaN(v)&&v>=0){await supabase.from("productos_proveedor").update({stock:v,disponible:v>0}).eq("id",p.id);loadMyProds(provData.id);loadAll();}e.target.value="";}}}/>
                    </div>
                    {editingProdId===`mod_${p.id}`?(
                      <div style={{background:"#f8fafc",borderRadius:10,padding:12,border:"1px solid #e2e8f0",marginBottom:8}}>
                        <div style={{fontSize:12,fontWeight:700,color:P,marginBottom:8}}>{!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"✏️ Modificar servicio":"✏️ Modificar producto"}</div>
                        <label style={s.lbl}>Nombre *</label>
                        <input style={s.inp} value={newProd.nombre} onChange={e=>setNewProd({...newProd,nombre:e.target.value})}/>
                        {!!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)&&<><label style={s.lbl}>Marca</label>
                        <input style={s.inp} value={newProd.marca} onChange={e=>setNewProd({...newProd,marca:e.target.value})}/>
                        <label style={s.lbl}>Presentación</label>
                        <input style={s.inp} value={newProd.presentacion} onChange={e=>setNewProd({...newProd,presentacion:e.target.value})}/></>}
                        <label style={s.lbl}>Descripción {!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)?"(qué incluye este servicio)":""}</label>
                        <input style={s.inp} value={newProd.descripcion} onChange={e=>setNewProd({...newProd,descripcion:e.target.value})}/>
                <label style={s.lbl}>Código de referencia (opcional)</label>
                <input style={s.inp} placeholder="Ej: REF-001, SKU-2024, VG5851-M" value={newProd.codigo_ref||""} onChange={e=>setNewProd({...newProd,codigo_ref:e.target.value})}/>
                        <label style={s.lbl}>Categoría *</label>
                        {(()=>{
                          const editCats2=provData.tipo_negocio==="Tienda / Negocio local"
                            ?PROD_CATS_TIENDA
                            :provData.tipo_negocio==="Restaurante / Cocina / Comida"
                            ?(provData.categorias?.length>0?provData.categorias:NEGOCIO_CATS_RESTAURANTE)
                            :SERV_CATS[provData.tipo_negocio]
                            ?(SERV_CATS[provData.tipo_negocio])
                            :(provData.categorias?.length>0?provData.categorias:PROV_CATS);
                          return(<select style={{...s.inp,background:"#fff"}} value={newProd.categoria} onChange={e=>setNewProd({...newProd,categoria:e.target.value})}><option value="">Selecciona una categoría...</option>{editCats2.map(c=><option key={c}>{c}</option>)}</select>);
                        })()}
                        {provData.tipo_negocio==="Tienda / Negocio local"&&VARIANTES_CONFIG[newProd.categoria]&&(
                          <div style={{background:"#eff6ff",borderRadius:10,padding:"10px 12px",marginBottom:8,border:"1px solid #bfdbfe"}}>
                            <label style={{...s.lbl,color:"#1d4ed8",marginBottom:4}}>🎨 {VARIANTES_CONFIG[newProd.categoria].label}</label>
                            <input style={s.inp} placeholder={VARIANTES_CONFIG[newProd.categoria].placeholder} value={newProd.variantes||""} onChange={e=>setNewProd({...newProd,variantes:e.target.value})}/>
                          </div>
                        )}
                        <label style={s.lbl}>Precio ($) *</label>
                        <input style={s.inp} type="number" value={newProd.precio} onChange={e=>setNewProd({...newProd,precio:e.target.value})}/>
                        {!!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)&&<><label style={s.lbl}>Unidad</label>
                        <input style={s.inp} value={newProd.unidad} onChange={e=>setNewProd({...newProd,unidad:e.target.value})}/></>}
                        <label style={s.lbl}>Fotos del producto (hasta 4)</label>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                          {[
                            {preview:fotoPreview,setFile:setFotoFile,setPreview:setFotoPreview,current:p.foto_url,label:"Foto 1"},
                            {preview:fotoPreview2,setFile:setFotoFile2,setPreview:setFotoPreview2,current:p.foto_url_2,label:"Foto 2"},
                            {preview:fotoPreview3,setFile:setFotoFile3,setPreview:setFotoPreview3,current:p.foto_url_3,label:"Foto 3"},
                            {preview:fotoPreview4,setFile:setFotoFile4,setPreview:setFotoPreview4,current:p.foto_url_4,label:"Foto 4"},
                          ].map((slot,i)=>(
                            <label key={i} style={{cursor:"pointer",display:"block"}}>
                              <div style={{width:"100%",aspectRatio:"1",borderRadius:10,border:`2px dashed ${(slot.preview||slot.current)?"#3b82f6":"#cbd5e1"}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:(slot.preview||slot.current)?"#000":"#f8fafc"}}>
                                {(slot.preview||slot.current)
                                  ?<img src={slot.preview||slot.current} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                                  :<div style={{textAlign:"center",color:"#94a3b8"}}><div style={{fontSize:22}}>📷</div><div style={{fontSize:9,marginTop:2}}>{slot.label}</div></div>
                                }
                              </div>
                              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){slot.setFile(f);slot.setPreview(URL.createObjectURL(f));}}}/>
                            </label>
                          ))}
                        </div>
                        <button style={{...s.btn,background:"linear-gradient(135deg,#15803d,#22c55e)"}} disabled={loading} onClick={async()=>{
                          if(!newProd.nombre||!newProd.precio)return setPmsg("Completa nombre y precio");
                          if(provData.tipo_negocio==="Tienda / Negocio local"&&!newProd.categoria)return setPmsg("Selecciona una categoría para tu producto");
                          setLoading(true);
                          let nueva_foto=p.foto_url||null,nueva_foto2=p.foto_url_2||null,nueva_foto3=p.foto_url_3||null,nueva_foto4=p.foto_url_4||null;
                          if(fotoFile)nueva_foto=await upload(fotoFile,"productos",`${provData.id}_${Date.now()}`);
                          if(fotoFile2)nueva_foto2=await upload(fotoFile2,"productos",`${provData.id}_2_${Date.now()}`);
                          if(fotoFile3)nueva_foto3=await upload(fotoFile3,"productos",`${provData.id}_3_${Date.now()}`);
                          if(fotoFile4)nueva_foto4=await upload(fotoFile4,"productos",`${provData.id}_4_${Date.now()}`);
                          await supabase.from("productos_proveedor").update({
                            nombre:newProd.nombre,marca:newProd.marca||null,
                            presentacion:newProd.presentacion||null,descripcion:newProd.descripcion||null,
                            precio:parseFloat(newProd.precio),unidad:newProd.unidad,
                            categoria:newProd.categoria||null,
                            codigo_ref:newProd.codigo_ref||null,variantes:newProd.variantes||null,
                            foto_url:nueva_foto,foto_url_2:nueva_foto2,foto_url_3:nueva_foto3,foto_url_4:nueva_foto4,
                            aprobado:true,rechazado:false,motivo_rechazo:null,
                          }).eq("id",p.id);
                          setLoading(false);setEditingProdId(null);
                          setFotoFile(null);setFotoPreview(null);setFotoFile2(null);setFotoPreview2(null);
                          setFotoFile3(null);setFotoPreview3(null);setFotoFile4(null);setFotoPreview4(null);
                          setPmsg("✅ Producto actualizado");
                          loadMyProds(provData.id);loadAll();
                        }}>{loading?"Guardando...":"✅ Guardar cambios"}</button>
                        <button style={s.btnG} onClick={()=>{setEditingProdId(null);setFotoFile(null);setFotoPreview(null);setFotoFile2(null);setFotoPreview2(null);setFotoFile3(null);setFotoPreview3(null);setFotoFile4(null);setFotoPreview4(null);}}>Cancelar</button>
                      </div>
                    ):(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <button onClick={()=>{setEditingProdId(`mod_${p.id}`);setNewProd({nombre:p.nombre||"",marca:p.marca||"",presentacion:p.presentacion||"",descripcion:p.descripcion||"",precio:String(p.precio||""),unidad:p.unidad||"porción",categoria:p.categoria||(provData.tipo_negocio==="Tienda / Negocio local"?"":"Comida preparada"),stock:p.stock||1,hi:p.horario_inicio||"08:00",hf:p.horario_fin||"18:00",permanente:p.permanente||false,variantes:p.variantes||"",codigo_ref:p.codigo_ref||""});}} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#eff6ff",color:"#1d4ed8"}}>✏️ Modificar</button>
                      <button onClick={()=>toggleDisp(p.id,p.disponible)} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:p.disponible?"#fff7ed":"#f0fdf4",color:p.disponible?"#c2410c":"#15803d"}}>{p.disponible?"⏸️ Pausar":"▶️ Activar"}</button>
                      <button onClick={()=>setConfirmModal({msg:"¿Eliminar este producto? Esta acción no se puede deshacer.",onOk:async()=>{const{error}=await supabase.from("productos_proveedor").delete().eq("id",p.id);if(error){setPmsg("❌ Error al eliminar: "+error.message);return;}setMyProds(prev=>prev.filter(x=>x.id!==p.id));setPmsg("✅ Producto eliminado");}})} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#fee2e2",color:"#be123c"}}>🗑️ Eliminar</button>
                    </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {provTab==="prod_pendientes"&&(
              <div style={s.pc}>
                <div style={s.pT}>⏳ Esperando aprobación</div>
                {myProds.filter(p=>!p.aprobado&&!p.rechazado).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No tienes productos pendientes</div>}
                {myProds.filter(p=>!p.aprobado&&!p.rechazado).map(p=>(
                  <div key={p.id} style={{display:"flex",gap:8,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                    {p.foto_url?<img src={p.foto_url} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"cover"}}/>:<span style={{fontSize:24,width:44,textAlign:"center"}}>🍽️</span>}
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{p.nombre}</div>
                      <div style={{fontSize:11,color:"#64748b"}}>${p.precio} · {p.categoria}</div>
                      <div style={{fontSize:11,color:"#f59e0b",marginTop:2}}>⏳ El admin está revisando este producto</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {provTab==="prod_rechazados"&&(
              <div style={s.pc}>
                <div style={s.pT}>✗ Productos rechazados</div>
                {myProds.filter(p=>p.rechazado).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No tienes productos rechazados</div>}
                {myProds.filter(p=>p.rechazado).map(p=>(
                  <div key={p.id} style={{padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <div style={{display:"flex",gap:8,marginBottom:6}}>
                      {p.foto_url?<img src={p.foto_url} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"cover"}}/>:<span style={{fontSize:24,width:44,textAlign:"center"}}>🍽️</span>}
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{p.nombre}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>${p.precio} · {p.categoria}</div>
                      </div>
                    </div>
                    {p.motivo_rechazo&&<div style={{background:"#fff1f2",borderRadius:8,padding:"8px 10px",fontSize:12,color:"#be123c",marginBottom:8}}>💬 Motivo: {p.motivo_rechazo}</div>}
                    {editingProdId===p.id?(
                      <div style={{background:"#f8fafc",borderRadius:10,padding:12,border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:13,fontWeight:600,color:P,marginBottom:8}}>✏️ Corrige tu producto</div>
                        <label style={s.lbl}>Nombre *</label>
                        <input style={s.inp} placeholder="Ej: Nombre del producto o servicio" value={newProd.nombre} onChange={e=>setNewProd({...newProd,nombre:e.target.value})}/>
                        <label style={s.lbl}>Marca (opcional)</label>
                        <input style={s.inp} placeholder="Marca o elaboración (opcional)" value={newProd.marca} onChange={e=>setNewProd({...newProd,marca:e.target.value})}/>
                        <label style={s.lbl}>Presentación (opcional)</label>
                        <input style={s.inp} placeholder="Ej: 500g, 1 unidad, 1L" value={newProd.presentacion} onChange={e=>setNewProd({...newProd,presentacion:e.target.value})}/>
                        <label style={s.lbl}>Descripción (opcional)</label>
                        <input style={s.inp} placeholder="Descripción del producto (opcional)" value={newProd.descripcion} onChange={e=>setNewProd({...newProd,descripcion:e.target.value})}/>
                <label style={s.lbl}>Código de referencia (opcional)</label>
                <input style={s.inp} placeholder="Ej: REF-001, SKU-2024, VG5851-M" value={newProd.codigo_ref||""} onChange={e=>setNewProd({...newProd,codigo_ref:e.target.value})}/>
                        <label style={s.lbl}>Categoría *</label>
                        {(()=>{
                          const editCats=provData.tipo_negocio==="Tienda / Negocio local"
                            ?PROD_CATS_TIENDA
                            :provData.tipo_negocio==="Restaurante / Cocina / Comida"
                            ?(provData.categorias?.length>0?provData.categorias:NEGOCIO_CATS_RESTAURANTE)
                            :(provData.categorias?.length>0?provData.categorias:PROV_CATS);
                          return(<select style={{...s.inp,background:"#fff"}} value={newProd.categoria} onChange={e=>setNewProd({...newProd,categoria:e.target.value})}><option value="">Selecciona una categoría...</option>{editCats.map(c=><option key={c}>{c}</option>)}</select>);
                        })()}
                        <label style={s.lbl}>Precio ($) *</label>
                        <input style={s.inp} type="number" placeholder="3.50" value={newProd.precio} onChange={e=>setNewProd({...newProd,precio:e.target.value})}/>
                        <label style={s.lbl}>Unidad *</label>
                        <input style={s.inp} placeholder="porción, kg, litro..." value={newProd.unidad} onChange={e=>setNewProd({...newProd,unidad:e.target.value})}/>
                        <label style={s.lbl}>Cantidad disponible *</label>
                        <input style={s.inp} type="number" value={newProd.stock} onChange={e=>setNewProd({...newProd,stock:e.target.value})}/>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,background:"#f1f5f9",padding:"10px 14px",borderRadius:10}}>
                          <input type="checkbox" id={`perm_edit_${p.id}`} checked={newProd.permanente} onChange={e=>setNewProd({...newProd,permanente:e.target.checked})} style={{width:18,height:18}}/>
                          <label htmlFor={`perm_edit_${p.id}`} style={{fontSize:13,cursor:"pointer"}}>🔁 Disponible hasta agotar stock</label>
                        </div>
                        {!newProd.permanente&&(<div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={s.lbl}>Disponible desde</label><input style={s.inp} type="time" value={newProd.hi} onChange={e=>setNewProd({...newProd,hi:e.target.value})}/></div><div style={{flex:1}}><label style={s.lbl}>Hasta</label><input style={s.inp} type="time" value={newProd.hf} onChange={e=>setNewProd({...newProd,hf:e.target.value})}/></div></div>)}
                        <label style={s.lbl}>📸 Foto del producto</label>
                        {(fotoPreview||p.foto_url)&&<img src={fotoPreview||p.foto_url} alt="" style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                        <input type="file" accept="image/*" style={{marginBottom:10,fontSize:13}} onChange={e=>{const f=e.target.files[0];if(f){setFotoFile(f);setFotoPreview(URL.createObjectURL(f));}}}/>
                        <button style={s.btn} disabled={loading} onClick={async()=>{
                          setLoading(true);
                          let foto_url=p.foto_url;
                          if(fotoFile)foto_url=await upload(fotoFile,"productos",`${provData.id}_${Date.now()}`);
                          await supabase.from("productos_proveedor").update({
                            nombre:newProd.nombre,marca:newProd.marca||null,presentacion:newProd.presentacion||null,
                            descripcion:newProd.descripcion||null,categoria:newProd.categoria,
                            precio:parseFloat(newProd.precio),unidad:newProd.unidad,
                            stock:parseInt(newProd.stock)||1,permanente:newProd.permanente,
                            horario_inicio:newProd.hi,horario_fin:newProd.hf,
                            foto_url,rechazado:false,aprobado:false,motivo_rechazo:null,
                          }).eq("id",p.id);
                          setLoading(false);setEditingProdId(null);
                          setFotoFile(null);setFotoPreview(null);
                          setPmsg("✅ Producto reenviado para aprobación");
                          loadMyProds(provData.id);
                        }}>{loading?"Enviando...":"📤 Enviar corrección"}</button>
                        <button style={s.btnG} onClick={()=>{setEditingProdId(null);setFotoFile(null);setFotoPreview(null);}}>Cancelar</button>
                      </div>
                    ):(
                      <button onClick={()=>{
                        setEditingProdId(p.id);
                        setNewProd({
                          nombre:p.nombre||"",descripcion:p.descripcion||"",marca:p.marca||"",
                          presentacion:p.presentacion||"",precio:String(p.precio||""),
                          unidad:p.unidad||"porción",categoria:p.categoria||"Comida preparada",
                          stock:p.stock||1,hi:p.horario_inicio||"08:00",hf:p.horario_fin||"18:00",
                          permanente:p.permanente||false,
                        });
                        setFotoPreview(null);setFotoFile(null);
                        setProvTab("prod_rechazados");
                      }} style={{width:"100%",padding:"8px",borderRadius:10,border:"none",background:"#fef9c3",color:"#854d0e",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                        ✏️ Corregir y reenviar para aprobación
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>)}

          {(provTab==="promos"||provTab==="promo_nueva"||provTab==="promo_activas"||provTab==="promo_pausadas"||provTab==="promo_pendientes"||provTab==="promo_rechazadas")&&(<>

            {/* NUEVA PROMO */}
            {(provTab==="promo_nueva")&&(
            <div style={s.pc}>
              <div style={s.pT}>🎉 Nueva promoción</div>
              <label style={s.lbl}>Nombre *</label>
              <input style={s.inp} placeholder="Combo familiar" value={newPromo.nombre} onChange={e=>setNewPromo({...newPromo,nombre:e.target.value})}/>
              <label style={s.lbl}>Descripción * (qué incluye)</label>
              <input style={s.inp} placeholder="2 almuerzos + jugos + postre..." value={newPromo.descripcion} onChange={e=>setNewPromo({...newPromo,descripcion:e.target.value})}/>
              <label style={s.lbl}>Precio ($) *</label>
              <input style={s.inp} type="number" placeholder="12.00" value={newPromo.precio} onChange={e=>setNewPromo({...newPromo,precio:e.target.value})}/>
              <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={s.lbl}>Desde *</label><input style={s.inp} type="date" value={newPromo.fecha_inicio} onChange={e=>setNewPromo({...newPromo,fecha_inicio:e.target.value})}/></div><div style={{flex:1}}><label style={s.lbl}>Hasta *</label><input style={s.inp} type="date" value={newPromo.fecha_fin} onChange={e=>setNewPromo({...newPromo,fecha_fin:e.target.value})}/></div></div>
              <label style={s.lbl}>📸 Foto de la promoción *</label>
              <div style={{...s.ib,background:"#fef9c3",marginBottom:8}}><div style={{fontSize:12,color:"#854d0e"}}>⚠️ La foto es obligatoria. Las promociones sin foto serán rechazadas.</div></div>
              {promoFotoPreview&&<img src={promoFotoPreview} alt="" style={{width:"100%",height:140,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
              <input type="file" accept="image/*" style={{marginBottom:10,fontSize:13}} onChange={e=>{const f=e.target.files[0];if(f){setPromoFotoFile(f);setPromoFotoPreview(URL.createObjectURL(f));}}}/>
              <button style={s.btnPurple} onClick={()=>{if(!promoFotoFile)return setPmsg("⚠️ Debes agregar una foto a la promoción antes de enviar");publishPromo();}} disabled={loading}>{loading?"Enviando...":"Enviar para aprobación"}</button>
            </div>
            )}

            {/* ACTIVAS */}
            {provTab==="promo_activas"&&(
              <div style={s.pc}>
                <div style={s.pT}>✅ Promociones activas</div>
                {myPromos.filter(pr=>pr.aprobada&&pr.activa).length===0&&myPromos.filter(pr=>pr.aprobada&&!pr.activa&&!pr.motivo_rechazo).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No tienes promociones activas</div>}
                {/* Pausadas */}
                {myPromos.filter(pr=>pr.aprobada&&!pr.activa&&!pr.motivo_rechazo).map(pr=>(
                  <div key={`paused_${pr.id}`} style={{background:"#fff7ed",borderRadius:10,padding:"10px 12px",marginBottom:8,border:"1px solid #fed7aa"}}>
                    {pr.foto_url&&<img src={pr.foto_url} alt="" style={{width:"100%",height:80,objectFit:"cover",borderRadius:8,marginBottom:6}}/>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div><div style={{fontSize:13,fontWeight:700}}>{pr.nombre}</div><div style={{fontSize:11,color:"#64748b"}}>${pr.precio}</div></div>
                      <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:8,background:"#fed7aa",color:"#c2410c",flexShrink:0,marginLeft:8}}>⏸️ Pausada</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={async()=>{await supabase.from("promociones_proveedor").update({activa:true}).eq("id",pr.id);loadMyPromos(provData.id);loadAll();}} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#f0fdf4",color:"#15803d"}}>▶️ Reactivar</button>
                      <button onClick={()=>setConfirmModal({msg:"¿Eliminar esta promoción?",onOk:async()=>{await supabase.from("promociones_proveedor").delete().eq("id",pr.id);loadMyPromos(provData.id);loadAll();}})} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#fee2e2",color:"#be123c"}}>🗑️ Eliminar</button>
                    </div>
                  </div>
                ))}
                {/* Activas */}
                {myPromos.filter(pr=>pr.aprobada&&pr.activa).map(pr=>(
                  <div key={pr.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    {pr.foto_url&&<img src={pr.foto_url} alt="" style={{width:"100%",height:110,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700}}>{pr.nombre}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>${pr.precio} · {pr.fecha_inicio} → {pr.fecha_fin}</div>
                        <div style={{fontSize:11,color:"#94a3b8"}}>{pr.descripcion}</div>
                      </div>
                      <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:8,background:"#dcfce7",color:"#15803d",flexShrink:0,marginLeft:8}}>✓ Activa</span>
                    </div>
                    {/* Modificar inline */}
                    {editandoHorario===`edit_promo_${pr.id}`?(
                      <div style={{background:"#f8fafc",borderRadius:10,padding:12,border:"1px solid #e2e8f0",marginBottom:8}}>
                        <div style={{fontSize:12,fontWeight:700,color:P,marginBottom:8}}>✏️ Modificar promoción</div>
                        <label style={s.lbl}>Nombre *</label>
                        <input style={s.inp} value={newPromo.nombre} onChange={e=>setNewPromo({...newPromo,nombre:e.target.value})}/>
                        <label style={s.lbl}>Descripción</label>
                        <input style={s.inp} value={newPromo.descripcion} onChange={e=>setNewPromo({...newPromo,descripcion:e.target.value})}/>
                        <label style={s.lbl}>Precio ($) *</label>
                        <input style={s.inp} type="number" value={newPromo.precio} onChange={e=>setNewPromo({...newPromo,precio:e.target.value})}/>
                        <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={s.lbl}>Desde</label><input style={s.inp} type="date" value={newPromo.fecha_inicio} onChange={e=>setNewPromo({...newPromo,fecha_inicio:e.target.value})}/></div><div style={{flex:1}}><label style={s.lbl}>Hasta</label><input style={s.inp} type="date" value={newPromo.fecha_fin} onChange={e=>setNewPromo({...newPromo,fecha_fin:e.target.value})}/></div></div>
                        <div style={{...s.ib,background:"#fef9c3"}}><div style={{fontSize:12,color:"#854d0e"}}>ℹ️ Al guardar va a revisión del admin antes de publicarse.</div></div>
                        <button style={s.btn} disabled={loading} onClick={async()=>{
                          if(!newPromo.nombre||!newPromo.precio)return setPmsg("Completa nombre y precio");
                          setLoading(true);
                          await supabase.from("promociones_proveedor").update({
                            nombre:newPromo.nombre,descripcion:newPromo.descripcion||null,
                            precio:parseFloat(newPromo.precio),fecha_inicio:newPromo.fecha_inicio,
                            fecha_fin:newPromo.fecha_fin,aprobada:false,motivo_rechazo:null,
                          }).eq("id",pr.id);
                          setLoading(false);setEditandoHorario(false);
                          setPmsg("✅ Enviado a revisión del admin");
                          loadMyPromos(provData.id);
                        }}>{loading?"Guardando...":"📤 Guardar y enviar a revisión"}</button>
                        <button style={s.btnG} onClick={()=>setEditandoHorario(false)}>Cancelar</button>
                      </div>
                    ):(
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                        <button onClick={()=>{setEditandoHorario(`edit_promo_${pr.id}`);setNewPromo({nombre:pr.nombre||"",descripcion:pr.descripcion||"",precio:String(pr.precio||""),fecha_inicio:pr.fecha_inicio||"",fecha_fin:pr.fecha_fin||""});}} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#eff6ff",color:"#1d4ed8"}}>✏️ Modificar</button>
                        <button onClick={async()=>{await supabase.from("promociones_proveedor").update({activa:false}).eq("id",pr.id);loadMyPromos(provData.id);loadAll();}} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#fff7ed",color:"#c2410c"}}>⏸️ Pausar</button>
                        <button onClick={()=>setConfirmModal({msg:"¿Eliminar esta promoción?",onOk:async()=>{await supabase.from("promociones_proveedor").delete().eq("id",pr.id);loadMyPromos(provData.id);loadAll();}})} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#fee2e2",color:"#be123c"}}>🗑️ Eliminar</button>
                      </div>
                    )}
                    <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"8px 10px",marginTop:2}}>
                      <div style={{fontSize:10,color:"#15803d",marginBottom:5,fontWeight:600}}>
                        👥 Enviar promo a clientes suscritos
                      </div>
                      <div style={{fontSize:10,color:"#64748b",marginBottom:6,lineHeight:1.4}}>
                        Solo se notifica a clientes que aceptaron recibir tus promos.
                      </div>
                      <button onClick={()=>notifyClientes(pr)} style={{background:"#25d366",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                        📲 Notificar mis suscriptores
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAUSADAS */}
            {provTab==="promo_pausadas"&&(
              <div style={s.pc}>
                <div style={s.pT}>⏸️ Promociones pausadas</div>
                {myPromos.filter(pr=>pr.aprobada&&!pr.activa&&!pr.motivo_rechazo).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No tienes promociones pausadas</div>}
                {myPromos.filter(pr=>pr.aprobada&&!pr.activa&&!pr.motivo_rechazo).map(pr=>(
                  <div key={pr.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    {pr.foto_url&&<img src={pr.foto_url} alt="" style={{width:"100%",height:90,objectFit:"cover",borderRadius:10,marginBottom:8,opacity:0.6}}/>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#64748b"}}>{pr.nombre}</div>
                        <div style={{fontSize:11,color:"#94a3b8"}}>${pr.precio} · {pr.descripcion}</div>
                      </div>
                      <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:8,background:"#f1f5f9",color:"#64748b",flexShrink:0,marginLeft:8}}>⏸️ Pausada</span>
                    </div>
                    <button onClick={async()=>{await supabase.from("promociones_proveedor").update({activa:true}).eq("id",pr.id);loadMyPromos(provData.id);loadAll();}} style={{...s.btnGreen,width:"100%",borderRadius:10,padding:"8px",fontSize:12,marginTop:0}}>▶️ Activar promoción</button>
                    <button onClick={()=>setConfirmModal({msg:"¿Eliminar esta promoción?",onOk:async()=>{await supabase.from("promociones_proveedor").delete().eq("id",pr.id);loadMyPromos(provData.id);loadAll();}})} style={{...s.btnRed,width:"100%",borderRadius:10,padding:"8px",fontSize:12,marginTop:6}}>🗑️ Eliminar</button>
                  </div>
                ))}
              </div>
            )}

            {/* PENDIENTES */}
            {provTab==="promo_pendientes"&&(
              <div style={s.pc}>
                <div style={s.pT}>⏳ Esperando aprobación</div>
                {myPromos.filter(pr=>!pr.aprobada&&pr.activa&&!pr.motivo_rechazo).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No tienes promociones pendientes</div>}
                {myPromos.filter(pr=>!pr.aprobada&&pr.activa&&!pr.motivo_rechazo).map(pr=>(
                  <div key={pr.id} style={{background:"#fef9c3",borderRadius:10,padding:"10px 12px",marginBottom:8,border:"1px solid #fde68a"}}>
                    {pr.foto_url&&<img src={pr.foto_url} alt="" style={{width:"100%",height:90,objectFit:"cover",borderRadius:8,marginBottom:6}}/>}
                    <div style={{fontSize:13,fontWeight:700}}>{pr.nombre}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>${pr.precio} · {pr.descripcion}</div>
                    <div style={{fontSize:11,color:"#92400e",marginTop:4}}>⏳ El admin está revisando tu promoción</div>
                  </div>
                ))}
              </div>
            )}

            {/* RECHAZADAS — con formulario de corrección igual que productos */}
            {provTab==="promo_rechazadas"&&(
              <div style={s.pc}>
                <div style={s.pT}>✗ Promociones rechazadas</div>
                {myPromos.filter(pr=>pr.motivo_rechazo).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No tienes promociones rechazadas</div>}
                {myPromos.filter(pr=>pr.motivo_rechazo).map(pr=>(
                  <div key={pr.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      {pr.foto_url?<img src={pr.foto_url} alt="" style={{width:50,height:50,borderRadius:8,objectFit:"cover"}}/>:<span style={{fontSize:28,width:50,textAlign:"center"}}>🎁</span>}
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:"#be123c"}}>{pr.nombre}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>${pr.precio} · {pr.descripcion}</div>
                      </div>
                    </div>
                    <div style={{background:"#fff1f2",borderRadius:8,padding:"8px 10px",fontSize:12,color:"#be123c",marginBottom:10}}>💬 Motivo: {pr.motivo_rechazo}</div>
                    {editandoHorario&&editandoHorario===pr.id?(
                      <div style={{background:"#f8fafc",borderRadius:10,padding:12,border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:13,fontWeight:600,color:P,marginBottom:8}}>✏️ Corrige tu promoción</div>
                        <label style={s.lbl}>Nombre *</label>
                        <input style={s.inp} value={newPromo.nombre} onChange={e=>setNewPromo({...newPromo,nombre:e.target.value})}/>
                        <label style={s.lbl}>Descripción *</label>
                        <input style={s.inp} value={newPromo.descripcion} onChange={e=>setNewPromo({...newPromo,descripcion:e.target.value})}/>
                        <label style={s.lbl}>Precio ($) *</label>
                        <input style={s.inp} type="number" value={newPromo.precio} onChange={e=>setNewPromo({...newPromo,precio:e.target.value})}/>
                        <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={s.lbl}>Desde *</label><input style={s.inp} type="date" value={newPromo.fecha_inicio} onChange={e=>setNewPromo({...newPromo,fecha_inicio:e.target.value})}/></div><div style={{flex:1}}><label style={s.lbl}>Hasta *</label><input style={s.inp} type="date" value={newPromo.fecha_fin} onChange={e=>setNewPromo({...newPromo,fecha_fin:e.target.value})}/></div></div>
                        <label style={s.lbl}>📸 Foto (obligatoria)</label>
                        {(promoFotoPreview||pr.foto_url)&&<img src={promoFotoPreview||pr.foto_url} alt="" style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                        <input type="file" accept="image/*" style={{marginBottom:10,fontSize:13}} onChange={e=>{const f=e.target.files[0];if(f){setPromoFotoFile(f);setPromoFotoPreview(URL.createObjectURL(f));}}}/>
                        <button style={s.btn} disabled={loading} onClick={async()=>{
                          if(!newPromo.nombre||!newPromo.precio)return setPmsg("Completa nombre y precio");
                          setLoading(true);
                          let foto_url=pr.foto_url;
                          if(promoFotoFile)foto_url=await upload(promoFotoFile,"productos",`promo_${provData.id}_${Date.now()}`);
                          await supabase.from("promociones_proveedor").update({
                            nombre:newPromo.nombre,
                            descripcion:newPromo.descripcion||null,
                            precio:parseFloat(newPromo.precio),
                            fecha_inicio:newPromo.fecha_inicio,
                            fecha_fin:newPromo.fecha_fin,
                            foto_url,
                            aprobada:false,
                            activa:true,
                            motivo_rechazo:null,
                          }).eq("id",pr.id);
                          setLoading(false);
                          setEditandoHorario(false);
                          setPromoFotoFile(null);setPromoFotoPreview(null);
                          setPmsg("✅ Promoción reenviada para aprobación");
                          loadMyPromos(provData.id);
                        }}>{loading?"Enviando...":"📤 Enviar corrección"}</button>
                        <button style={s.btnG} onClick={()=>{setEditandoHorario(false);setPromoFotoFile(null);setPromoFotoPreview(null);}}>Cancelar</button>
                      </div>
                    ):(
                      <button onClick={()=>{
                        setEditandoHorario(pr.id);
                        setNewPromo({nombre:pr.nombre||"",descripcion:pr.descripcion||"",precio:String(pr.precio||""),fecha_inicio:pr.fecha_inicio||"",fecha_fin:pr.fecha_fin||""});
                        setPromoFotoPreview(null);setPromoFotoFile(null);
                      }} style={{width:"100%",padding:"8px",borderRadius:10,border:"none",background:"#fef9c3",color:"#854d0e",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                        ✏️ Corregir y reenviar para aprobación
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>)}

          {provTab==="pedidos_rest"&&(()=>{
            // Estados y colores
            const ESTADOS={
              "nuevo":           {label:"🆕 Nuevo",              bg:"#fef9c3",color:"#854d0e"},
              "recibido":        {label:"📥 Recibido",           bg:"#dbeafe",color:"#1e40af"},
              "esperando_pago":  {label:"💳 Esperando pago",     bg:"#fdf4ff",color:"#7e22ce"},
              "preparando":      {label:"👨‍🍳 Preparando",         bg:"#fff7ed",color:"#c2410c"},
              "enviado":         {label:"🚀 Enviado",            bg:"#fef3c7",color:"#92400e"},
              "entregado":       {label:"✅ Entregado",          bg:"#dcfce7",color:"#15803d"},
              "cancelado":       {label:"❌ Cancelado",          bg:"#fee2e2",color:"#991b1b"},
            };
            // Construir bloque de métodos de pago del proveedor
            const bloqPago=(()=>{
              const pm=provData.pago_movil_banco?`\n\n📱 *Pago Móvil:*\nBanco: ${provData.pago_movil_banco}\nTeléfono: ${provData.pago_movil_telefono||""}\nCédula: ${provData.pago_movil_cedula||""}\nNombre: ${provData.pago_movil_nombre||""}`:"";
              const zelle=provData.acepta_zelle&&provData.zelle_cuenta?`\n\n💵 *Zelle:* ${provData.zelle_cuenta}`:"";
              const binance=provData.acepta_binance&&provData.binance_cuenta?`\n\n🟡 *Binance Pay:* ${provData.binance_cuenta}`:"";
              const efectivo=provData.acepta_efectivo?"\n\n💵 *Efectivo USD:* Aceptamos efectivo":"";
              const divisas=provData.acepta_divisas?"\n\n💱 *Otras divisas:* Aceptamos":"";
              return pm||zelle||binance||efectivo||divisas
                ?`💳 *Métodos de pago disponibles:*${pm}${zelle}${binance}${efectivo}${divisas}`
                :"_(El proveedor aún no ha configurado sus métodos de pago)_";
            })();
            const MSGS_ESTADO={
              // RECIBIDO: resumen completo + datos de pago + solicitud de comprobante
              "recibido": (ped)=>{
                const items=(ped.items||[]).map(i=>`  • ${i.nombre} x${i.qty||1} — $${((i.precio||0)*(i.qty||1)).toFixed(2)}`).join("\n");
                return `Hola ${ped.cliente_nombre} \u{1F44B}\n\n\u{2705} *Recibimos tu pedido ${ped.ref}*\n\n\u{1F6D2} *Resumen:*\n${items}\n\u{1F69A} Delivery: $${(ped.delivery||0).toFixed(2)}\n\u{1F4B5} *Total: $${(ped.total||0).toFixed(2)}*\n\n${bloqPago}\n\n\u{1F4F8} Por favor realiza el pago y envíanos el comprobante para procesar tu pedido.\n\n¡Gracias por tu preferencia! \u{1F64F}`;
              },
              // ESPERANDO PAGO: recordatorio simple, sin repetir datos
              "esperando_pago": (ped)=>`Hola ${ped.cliente_nombre} \u{1F44B}\n\n\u{23F3} Aún estamos esperando tu comprobante de pago del pedido *${ped.ref}*.\n\n\u{1F4B5} *Total pendiente: $${(ped.total||0).toFixed(2)}*\n\nCuando realices el pago, envíanos la captura y comenzamos a preparar tu pedido enseguida. ¡Gracias! \u{1F64F}`,
              // PREPARANDO: confirma pago recibido
              "preparando": (ped)=>`Hola ${ped.cliente_nombre} \u{1F44B}\n\n\u{2705} *¡Pago confirmado!*\n\nTu pedido *${ped.ref}* está siendo preparado con cariño. \u{1F468}\u{200D}\u{1F373}\n\nTe avisaremos cuando esté listo para enviarse. ¡Ya casi llega! \u{1F60A}`,
              // ENVIADO: en camino con dirección
              "enviado": (ped)=>`Hola ${ped.cliente_nombre} \u{1F44B}\n\n\u{1F680} *Tu pedido ${ped.ref} ya va en camino.*\n\n\u{1F4CD} Dirección: ${ped.cliente_direccion||"(dirección registrada)"}\n\nMantente atento(a), ¡pronto llega! \u{1F6F5}`,
              // ENTREGADO: cierre amigable
              "entregado": (ped)=>`Hola ${ped.cliente_nombre} \u{1F44B}\n\n\u{1F389} *Tu pedido ${ped.ref} fue entregado.*\n\n¡Gracias por elegirnos! Si tienes algún comentario o inconveniente, no dudes en escribirnos. Esperamos verte pronto. \u{1F60A}`,
              // CANCELADO
              "cancelado": (ped)=>`Hola ${ped.cliente_nombre} \u{1F44B}\n\n\u{1F614} Lamentamos informarte que tu pedido *${ped.ref}* fue cancelado.\n\nPor favor contáctanos si tienes alguna pregunta. Disculpa los inconvenientes.`,
            };
            const actualizarEstado=async(pedId,nuevoEstado,ped)=>{
              const{error}=await supabase.from("pedidos").update({
                estado:nuevoEstado,
                completado:["entregado"].includes(nuevoEstado),
                updated_at:new Date().toISOString()
              }).eq("id",pedId);
              if(error){
                alert("Error al actualizar: "+error.message);
                return;
              }
              // Descontar inventario SOLO al marcar entregado, y solo una vez
              // (evita doble descuento si el pedido ya estaba entregado)
              if(nuevoEstado==="entregado" && ped?.estado!=="entregado" && !ped?.stock_descontado){
                const items=Array.isArray(ped?.items)?ped.items:[];
                for(const it of items){
                  if(!it.dbId||it.isPromo)continue; // sin id o promo → no descontar
                  const qty=parseInt(it.qty)||0;
                  if(qty<=0)continue;
                  // Leer stock actual y restar sin bajar de 0
                  const{data:prodActual}=await supabase.from("productos_proveedor")
                    .select("stock").eq("id",it.dbId).single();
                  if(prodActual&&typeof prodActual.stock==="number"){
                    const nuevoStock=Math.max(0,prodActual.stock-qty);
                    const cambios={stock:nuevoStock};
                    // Si el stock llega a 0, pausar el producto (no borrarlo)
                    if(nuevoStock===0)cambios.disponible=false;
                    await supabase.from("productos_proveedor")
                      .update(cambios).eq("id",it.dbId);
                  }
                }
                // Marcar el pedido para no volver a descontar
                await supabase.from("pedidos").update({stock_descontado:true}).eq("id",pedId);
              }
              await loadMisRestPedidos(provData.id,provData.negocio);
            };
            // Fecha forzada a Venezuela (UTC-4) — misma función para filtros Y stats
            const fechaVE=(d)=>{
              const dt=d instanceof Date?d:new Date(d);
              // Restar 4h para llevar UTC a hora Venezuela, luego tomar YYYY-MM-DD
              return new Date(dt.getTime()-4*3600000).toISOString().slice(0,10);
            };
            const hoy=fechaVE(new Date());
            const ayer=fechaVE(new Date(Date.now()-86400000));
            const semana=fechaVE(new Date(Date.now()-7*86400000));
            const mesActual=hoy.slice(0,7);   // YYYY-MM
            const anioActual=hoy.slice(0,4);  // YYYY
            const fechaPed=(created_at)=>created_at?fechaVE(created_at):"";
            // filtroPed y filtroEstado están en el estado del componente principal
            const pedFiltrados=misRestPedidos.filter(p=>{
              const fecha=fechaPed(p.created_at);
              const pasaFecha=
                filtroPed==="hoy"?fecha===hoy:
                filtroPed==="semana"?fecha>=semana:
                filtroPed==="mes"?fecha.slice(0,7)===mesActual:
                filtroPed==="anio"?fecha.slice(0,4)===anioActual:
                true;
              const pasaEstado=filtroEstado==="todos"||(p.estado||"nuevo")===filtroEstado;
              return pasaFecha&&pasaEstado;
            });
            // Stats — usan la MISMA función de fecha (consistencia total)
            const totalHoy=misRestPedidos.filter(p=>fechaPed(p.created_at)===hoy);
            const ingreso=misRestPedidos.filter(p=>p.estado==="entregado").reduce((a,p)=>a+(p.total||0),0);
            const pendientes=misRestPedidos.filter(p=>!["entregado","cancelado"].includes(p.estado||"nuevo"));
            return(
              <div style={s.pc}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={s.pT}>📋 Mis pedidos</div>
                  <button onClick={async(ev)=>{
                    const b=ev.currentTarget;
                    const txt=b.innerText;
                    b.innerText="⏳ Actualizando...";
                    b.disabled=true;
                    await loadMisRestPedidos(provData.id,provData.negocio);
                    b.innerText="✅ Actualizado";
                    setTimeout(()=>{if(b){b.innerText=txt;b.disabled=false;}},1200);
                  }} style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#15803d",cursor:"pointer"}}>
                    🔄 Actualizar
                  </button>
                </div>
                {/* STATS — sobrias, color solo donde importa */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
                  <div style={{background:"#f8fafc",border:"1px solid #eef2f6",borderRadius:12,padding:"12px 6px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#334155"}}>{totalHoy.length}</div><div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>Hoy</div></div>
                  <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"12px 6px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#d97706"}}>{pendientes.length}</div><div style={{fontSize:11,color:"#92400e",fontWeight:600}}>Nuevos</div></div>
                  <div style={{background:"#f8fafc",border:"1px solid #eef2f6",borderRadius:12,padding:"12px 6px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#16a34a"}}>${ingreso.toFixed(0)}</div><div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>Ingresos</div></div>
                </div>
                {/* FILTRO PERIODO */}
                <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Periodo</div>
                <div style={{display:"flex",gap:6,marginBottom:14}}>
                  {[["hoy","Hoy"],["semana","Semana"],["mes","Mes"],["anio","Año"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setFiltroPed(v)} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",fontSize:12,fontWeight:filtroPed===v?700:600,cursor:"pointer",background:filtroPed===v?"#0f172a":"#f1f5f9",color:filtroPed===v?"#fff":"#64748b"}}>
                      {l}
                    </button>
                  ))}
                </div>
                {/* FILTRO ESTADO — texto corto + contador, paleta sobria */}
                <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Estado</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:18}}>
                  {[["todos","Todos","#0f172a"],["nuevo","Nuevos","#d97706"],["entregado","Entreg.","#16a34a"],["cancelado","Cancel.","#64748b"]].map(([v,l,col])=>{
                    const cnt=v==="todos"?misRestPedidos.length:misRestPedidos.filter(p=>(p.estado||"nuevo")===v).length;
                    const activo=filtroEstado===v;
                    return(
                      <button key={v} onClick={()=>setFiltroEstado(v)} style={{padding:"8px 2px",borderRadius:10,border:activo?"none":"1px solid #e2e8f0",cursor:"pointer",background:activo?col:"#fff",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                        <span style={{fontSize:11,fontWeight:700,color:activo?"#fff":col,lineHeight:1.1}}>{l}</span>
                        <span style={{fontSize:15,fontWeight:900,color:activo?"#fff":col}}>{cnt}</span>
                      </button>
                    );
                  })}
                </div>
                {/* LISTA */}
                {pedFiltrados.length===0&&(
                  <div style={{textAlign:"center",padding:"30px 0",color:"#94a3b8",fontSize:13}}>
                    {misRestPedidos.length===0?"¡Cuando un cliente haga un pedido aparecerá aquí!":"No hay pedidos con este filtro."}
                  </div>
                )}
                {pedFiltrados.map(ped=>{
                  const est=ESTADOS[ped.estado]||ESTADOS["nuevo"];
                  const esNuevo=(ped.estado||"nuevo")==="nuevo";
                  const expandido=esNuevo||pedidoExpandido===ped.id; // nuevos siempre abiertos
                  const siguientes={
                    "nuevo":          ["entregado","cancelado"],
                    "entregado":      [],
                    "cancelado":      [],
                  }[ped.estado||"nuevo"]||[];
                  const fechaTxt=ped.created_at?ped.created_at.slice(11,16):"";
                  // FILA COLAPSADA (entregados/cancelados)
                  if(!expandido){
                    return(
                      <div key={ped.id} onClick={()=>setPedidoExpandido(ped.id)} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"11px 12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"#334155"}}>{ped.ref||"Sin ref"}</div>
                          <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{fechaTxt} · {ped.cliente_nombre||"Cliente"} · ${(ped.total||0).toFixed(2)}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:7,background:est.bg,color:est.color}}>{est.label}</span>
                          <span style={{color:"#94a3b8",fontSize:14}}>▾</span>
                        </div>
                      </div>
                    );
                  }
                  // TARJETA EXPANDIDA
                  return(
                    <div key={ped.id} style={{background:"#fff",border:esNuevo?"1.5px solid #fde68a":"1.5px solid #e2e8f0",borderRadius:14,padding:"14px",marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                      {/* Header pedido */}
                      <div onClick={()=>{if(!esNuevo)setPedidoExpandido(null);}} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,cursor:esNuevo?"default":"pointer"}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>{ped.ref||"Sin ref"}</div>
                          <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{ped.created_at?.slice(0,16).replace("T"," hs ")}</div>
                        </div>
                        <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:8,background:est.bg,color:est.color,whiteSpace:"nowrap"}}>
                          {est.label}{!esNuevo&&" ▴"}
                        </span>
                      </div>
                      {/* Items */}
                      <div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",marginBottom:8,fontSize:12}}>
                        {(ped.items||[]).map((it,i)=>(
                          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:i<(ped.items.length-1)?"1px solid #f1f5f9":"none"}}>
                            <span style={{color:"#0f172a"}}>{it.isPromo?"🔥 ":""}{it.nombre} <strong>x{it.qty}</strong>{it.nota&&<span style={{color:"#7e22ce"}}> 📝{it.nota}</span>}</span>
                            <span style={{fontWeight:700,color:P}}>${((it.precio||0)*(it.qty||1)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      {/* Cliente y totales */}
                      <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>
                        👤 <strong>{ped.cliente_nombre}</strong> · 📱 {ped.cliente_telefono}
                        {ped.cliente_direccion&&<div style={{fontSize:11,marginTop:2}}>📍 {ped.cliente_direccion}</div>}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:10,paddingTop:6,borderTop:"1px solid #f1f5f9"}}>
                        <span style={{color:"#64748b"}}>Delivery: ${(ped.delivery||0).toFixed(2)}</span>
                        <span style={{fontWeight:800,color:"#0f172a"}}>Total: <span style={{color:"#22c55e"}}>${(ped.total||0).toFixed(2)}</span></span>
                      </div>
                      {/* Botones de estado */}
                      {siguientes.length>0&&(
                        <div style={{display:"flex",gap:6,marginBottom:6}}>
                          {siguientes.map(sig=>{
                            const e=ESTADOS[sig];
                            const isCancel=sig==="cancelado";
                            return(
                              <button key={sig} onClick={()=>actualizarEstado(ped.id,sig,ped)}
                                style={{flex:1,padding:"9px",borderRadius:10,border:"none",fontSize:11,fontWeight:800,cursor:"pointer",background:isCancel?"#fee2e2":e.bg,color:isCancel?"#991b1b":e.color}}>
                                {isCancel?"✕ Cancelar":"✓ Entregado"}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {/* Botón WhatsApp cliente */}
                      <button onClick={()=>{
                        const estadoMsg={
                          "entregado":"\u{1F389} Tu pedido *"+ped.ref+"* fue entregado. ¡Gracias por preferirnos!",
                          "cancelado":"\u{1F614} Lamentamos informarte que tu pedido *"+ped.ref+"* fue cancelado. Contáctanos para más info.",
                        }[ped.estado]||"Hola "+ped.cliente_nombre+" \u{1F44B}, te escribimos sobre tu pedido *"+ped.ref+"*.";
                        abrirWhatsApp(ped.cliente_telefono,"Hola "+ped.cliente_nombre+" \u{1F44B}\n\n"+estadoMsg);
                      }} style={{width:"100%",background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"9px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                        📲 Notificar al cliente por WhatsApp
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* ═══ TAB CLIENTES ═══ */}
          {provTab==="clientes"&&(
            <div style={s.pc}>
              <div style={s.pT}>👥 Mis clientes</div>
              {/* ETA */}
              <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:800,color:"#15803d"}}>⏱️ Tiempo estimado de entrega</div>
                    <div style={{fontSize:11,color:"#64748b",marginTop:2}}>
                      {provData.eta_texto||((provData.eta_minutos_min&&provData.eta_minutos_max)?`${provData.eta_minutos_min}–${provData.eta_minutos_max} min`:"No configurado")}
                    </div>
                  </div>
                  <button onClick={()=>{setEtaData({eta_minutos_min:provData.eta_minutos_min||"",eta_minutos_max:provData.eta_minutos_max||"",eta_texto:provData.eta_texto||""});setEditandoEta(!editandoEta);}} style={{fontSize:11,background:"#dcfce7",color:"#15803d",border:"none",borderRadius:8,padding:"5px 12px",fontWeight:700,cursor:"pointer"}}>
                    {editandoEta?"Cancelar":"✏️ Editar"}
                  </button>
                </div>
                {editandoEta&&(
                  <div style={{marginTop:10}}>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <div style={{flex:1}}>
                        <label style={s.lbl}>Mín (min)</label>
                        <input style={s.inp} type="number" placeholder="20" value={etaData.eta_minutos_min} onChange={e=>setEtaData({...etaData,eta_minutos_min:e.target.value})}/>
                      </div>
                      <div style={{flex:1}}>
                        <label style={s.lbl}>Máx (min)</label>
                        <input style={s.inp} type="number" placeholder="40" value={etaData.eta_minutos_max} onChange={e=>setEtaData({...etaData,eta_minutos_max:e.target.value})}/>
                      </div>
                    </div>
                    <label style={s.lbl}>O texto libre (ej: "A confirmar")</label>
                    <input style={{...s.inp,marginBottom:8}} placeholder="25–35 min / A confirmar" value={etaData.eta_texto} onChange={e=>setEtaData({...etaData,eta_texto:e.target.value})}/>
                    <button onClick={async()=>{await supabase.from("proveedores").update({eta_minutos_min:etaData.eta_minutos_min||null,eta_minutos_max:etaData.eta_minutos_max||null,eta_texto:etaData.eta_texto||null}).eq("id",provData.id);setProvData({...provData,...etaData});setEditandoEta(false);setPmsg("✅ ETA actualizado");}} style={{...s.btnGreen,width:"100%",borderRadius:10,padding:"9px",fontSize:12}}>
                      💾 Guardar ETA
                    </button>
                  </div>
                )}
              </div>
              {/* Lista clientes */}
              {misClientes.length===0
                ?<div style={{textAlign:"center",padding:"20px 0",color:"#94a3b8",fontSize:13}}>Aún no tienes clientes registrados. Aparecerán cuando recibas pedidos.</div>
                :<div>
                  <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>{misClientes.length} cliente{misClientes.length!==1?"s":""} únicos</div>
                  {misClientes.map((c,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:getAvatarColor(c.nombre),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:14,flexShrink:0}}>
                        {c.nombre?.[0]?.toUpperCase()||"?"}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{c.nombre}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>📱 {c.telefono} · {c.totalPedidos} pedido{c.totalPedidos!==1?"s":""}</div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>Último: {c.ultimoPedido?.slice(0,10)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#22c55e"}}>${c.totalGastado.toFixed(2)}</div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>total</div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {provTab==="ventas"&&(()=>{
            const pedidosEntregados=misRestPedidos.filter(p=>p.estado==="entregado");
            const pedidosCancelados=misRestPedidos.filter(p=>p.estado==="cancelado");
            const pedidosTodos=misRestPedidos;
            // Fecha forzada a Venezuela (UTC-4), consistente con la sección de pedidos
            const fechaVE_V=(d)=>new Date(new Date(d).getTime()-4*3600000).toISOString().slice(0,10);
            const hoyV=fechaVE_V(new Date());
            const sem=fechaVE_V(new Date(Date.now()-7*86400000));
            const mes=fechaVE_V(new Date(Date.now()-30*86400000));
            // Rango del período ANTERIOR (para comparar)
            const semAnt=fechaVE_V(new Date(Date.now()-14*86400000));
            const mesAnt=fechaVE_V(new Date(Date.now()-60*86400000));
            const anio=fechaVE_V(new Date(Date.now()-365*86400000));
            const filtroV=filtroVentas;const setFiltroV=setFiltroVentas;
            const enRango=(f,tipo)=>tipo==="hoy"?f===hoyV:tipo==="semana"?f>=sem:tipo==="mes"?f>=mes:tipo==="anio"?f>=anio:true;
            const pedFiltV=pedidosEntregados.filter(p=>enRango(fechaVE_V(p.created_at),filtroV));
            const totalVendido=pedFiltV.reduce((a,p)=>a+(p.total||0),0);
            const ticketProm=pedFiltV.length>0?totalVendido/pedFiltV.length:0;
            // PERÍODO ANTERIOR para comparación
            const pedAnt=pedidosEntregados.filter(p=>{
              const f=fechaVE_V(p.created_at);
              if(filtroV==="semana")return f>=semAnt&&f<sem;
              if(filtroV==="mes")return f>=mesAnt&&f<mes;
              if(filtroV==="anio"){const anioAnt=fechaVE_V(new Date(Date.now()-730*86400000));return f>=anioAnt&&f<anio;}
              if(filtroV==="hoy"){const ay=fechaVE_V(new Date(Date.now()-86400000));return f===ay;}
              return false;
            });
            const totalAnt=pedAnt.reduce((a,p)=>a+(p.total||0),0);
            const variacion=totalAnt>0?Math.round(((totalVendido-totalAnt)/totalAnt)*100):(totalVendido>0?100:0);
            const hayComparacion=filtroV!=="todo";
            // TOP PRODUCTOS del período (por cantidad vendida)
            const conteoProd={};
            pedFiltV.forEach(p=>(p.items||[]).forEach(it=>{
              if(it.isPromo)return;
              const n=it.nombre||"Producto";
              if(!conteoProd[n])conteoProd[n]={qty:0,monto:0};
              conteoProd[n].qty+=(it.qty||1);
              conteoProd[n].monto+=(it.precio||0)*(it.qty||1);
            }));
            const topProds=Object.entries(conteoProd).sort((a,b)=>b[1].qty-a[1].qty).slice(0,5);
            // PRODUCTOS SIN VENTAS (en catálogo pero nunca vendidos en el período)
            const vendidos=new Set(Object.keys(conteoProd));
            const sinVentas=(myProds||[]).filter(pr=>!vendidos.has(pr.nombre)).slice(0,5);
            // VENTAS POR DÍA (últimos 7 días) para el gráfico
            const dias=[];
            for(let i=6;i>=0;i--){
              const d=fechaVE_V(new Date(Date.now()-i*86400000));
              const tot=pedidosEntregados.filter(p=>fechaVE_V(p.created_at)===d).reduce((a,p)=>a+(p.total||0),0);
              dias.push({dia:d.slice(5),monto:tot});
            }
            const maxDia=Math.max(...dias.map(d=>d.monto),1);
            // CLIENTES: nuevos vs recurrentes (por teléfono, sobre pedidos entregados)
            const pedidosPorCliente={};
            pedidosEntregados.forEach(p=>{
              const tel=(p.cliente_telefono||"").replace(/\D/g,"");
              if(!tel)return;
              pedidosPorCliente[tel]=(pedidosPorCliente[tel]||0)+1;
            });
            const totalClientes=Object.keys(pedidosPorCliente).length;
            const clientesRecurrentes=Object.values(pedidosPorCliente).filter(c=>c>1).length;
            const clientesNuevos=totalClientes-clientesRecurrentes;
            const pctRecurrentes=totalClientes>0?Math.round((clientesRecurrentes/totalClientes)*100):0;
            return(
              <div style={s.pc}>
                <div style={s.pT}>📊 Dashboard de ventas</div>
                {/* FILTROS */}
                <div style={{display:"flex",gap:5,marginBottom:14}}>
                  {[["todo","Todos"],["hoy","Hoy"],["semana","Semana"],["mes","Mes"],["anio","Año"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setFiltroV(v)} style={{flex:1,padding:"7px 2px",borderRadius:8,border:"none",fontSize:11,fontWeight:filtroV===v?700:600,cursor:"pointer",background:filtroV===v?"#0f172a":"#f1f5f9",color:filtroV===v?"#fff":"#64748b"}}>{l}</button>
                  ))}
                </div>
                {/* TOTAL + COMPARACIÓN */}
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:14,padding:"16px",marginBottom:12,textAlign:"center"}}>
                  <div style={{fontSize:30,fontWeight:900,color:"#16a34a"}}>${totalVendido.toFixed(2)}</div>
                  <div style={{fontSize:12,color:"#15803d",fontWeight:600,marginBottom:hayComparacion?6:0}}>Total vendido</div>
                  {hayComparacion&&(
                    <div style={{fontSize:12,fontWeight:700,color:variacion>=0?"#16a34a":"#dc2626"}}>
                      {variacion>=0?"▲":"▼"} {Math.abs(variacion)}% vs período anterior
                    </div>
                  )}
                </div>
                {/* KPIs sobrios */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
                  <div style={{background:"#f8fafc",border:"1px solid #eef2f6",borderRadius:12,padding:"12px 4px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#334155"}}>{pedFiltV.length}</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>Entregados</div></div>
                  <div style={{background:"#f8fafc",border:"1px solid #eef2f6",borderRadius:12,padding:"12px 4px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#334155"}}>${ticketProm.toFixed(2)}</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>Ticket prom.</div></div>
                  <div style={{background:"#f8fafc",border:"1px solid #eef2f6",borderRadius:12,padding:"12px 4px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#334155"}}>{pedidosCancelados.length}</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>Cancelados</div></div>
                </div>
                {/* CLIENTES: nuevos vs recurrentes */}
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>👥 Tus clientes</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:900,color:"#2563eb"}}>{clientesNuevos}</div>
                    <div style={{fontSize:11,color:"#1e40af",fontWeight:600}}>Nuevos</div>
                  </div>
                  <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:900,color:"#16a34a"}}>{clientesRecurrentes}</div>
                    <div style={{fontSize:11,color:"#15803d",fontWeight:600}}>Que repiten</div>
                  </div>
                </div>
                {totalClientes>0&&(
                  <div style={{background:"#f8fafc",borderRadius:10,padding:"10px 12px",marginBottom:16,fontSize:12,color:"#64748b",textAlign:"center"}}>
                    {pctRecurrentes>0
                      ?<><strong style={{color:"#16a34a"}}>{pctRecurrentes}%</strong> de tus clientes ha vuelto a comprar 🎉</>
                      :"Aún no tienes clientes que repitan — ¡fideliza con buen servicio!"}
                  </div>
                )}
                {/* GRÁFICO VENTAS POR DÍA (últimos 7) */}
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Ventas últimos 7 días</div>
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:5,height:90,marginBottom:6,padding:"0 2px"}}>
                  {dias.map((d,i)=>(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#64748b"}}>{d.monto>0?"$"+d.monto.toFixed(0):""}</div>
                      <div style={{width:"100%",height:Math.max(4,(d.monto/maxDia)*60),background:d.monto>0?"#16a34a":"#e2e8f0",borderRadius:"4px 4px 0 0",transition:"height 0.3s"}}></div>
                      <div style={{fontSize:9,color:"#94a3b8"}}>{d.dia}</div>
                    </div>
                  ))}
                </div>
                <div style={{borderTop:"1px solid #f1f5f9",margin:"12px 0"}}></div>
                {/* TOP PRODUCTOS */}
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🏆 Más vendidos</div>
                {topProds.length===0
                  ?<div style={{textAlign:"center",padding:"12px 0",color:"#94a3b8",fontSize:12}}>Sin ventas en este período</div>
                  :topProds.map(([nombre,d],i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<topProds.length-1?"1px solid #f1f5f9":"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:12,fontWeight:900,color:i===0?"#f59e0b":"#cbd5e1",width:18}}>{i+1}</span>
                        <span style={{fontSize:13,color:"#0f172a"}}>{nombre}</span>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#16a34a"}}>{d.qty} u.</div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>${d.monto.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                }
                {/* PRODUCTOS SIN VENTAS */}
                {sinVentas.length>0&&(
                  <>
                    <div style={{borderTop:"1px solid #f1f5f9",margin:"12px 0"}}></div>
                    <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>💤 Sin ventas este período</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>Considera promocionarlos o rematarlos</div>
                    {sinVentas.map((pr,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<sinVentas.length-1?"1px solid #f8fafc":"none"}}>
                        <span style={{fontSize:13,color:"#64748b"}}>{pr.nombre}</span>
                        <span style={{fontSize:11,color:"#cbd5e1"}}>{typeof pr.stock==="number"?pr.stock+" en stock":""}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })()}


          {/* ═══ TAB MI NEGOCIO ═══ */}
            {provTab==="mis_rutas"&&(
              <div style={{padding:"0 16px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>🚌 Mis rutas ({misRutas.length})</div>
                  <button onClick={()=>setShowNuevaRuta(!showNuevaRuta)} style={{background:showNuevaRuta?"#64748b":"#059669",color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{showNuevaRuta?"✕ Cancelar":"+ Nueva ruta"}</button>
                </div>
                {showNuevaRuta&&(<div style={{background:"#f0fdf4",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #bbf7d0"}}>
                  <label style={s.lbl}>Origen *</label><input style={s.inp} value={newRuta.origen} onChange={e=>setNewRuta(r=>({...r,origen:e.target.value}))} placeholder="San Fernando"/>
                  <label style={s.lbl}>Destino *</label><input style={s.inp} value={newRuta.destino} onChange={e=>setNewRuta(r=>({...r,destino:e.target.value}))} placeholder="Caracas"/>
                  <label style={s.lbl}>Hora de salida *</label><input style={s.inp} type="time" value={newRuta.hora_salida} onChange={e=>setNewRuta(r=>({...r,hora_salida:e.target.value}))}/>
                  <label style={s.lbl}>Precio por persona ($) *</label><input style={s.inp} type="number" value={newRuta.precio} onChange={e=>setNewRuta(r=>({...r,precio:e.target.value}))} placeholder="25"/>
                  <label style={s.lbl}>Puestos disponibles</label><input style={s.inp} type="number" value={newRuta.puestos_disponibles} onChange={e=>setNewRuta(r=>({...r,puestos_disponibles:parseInt(e.target.value)||10}))}/>
                  <label style={s.lbl}>Días de operación</label><input style={s.inp} value={newRuta.dias_operacion} onChange={e=>setNewRuta(r=>({...r,dias_operacion:e.target.value}))} placeholder="Lunes a Domingo"/>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><input type="checkbox" checked={newRuta.acepta_encomiendas} onChange={e=>setNewRuta(r=>({...r,acepta_encomiendas:e.target.checked}))}/><label style={{fontSize:13}}>📦 Acepta encomiendas</label></div>
                  <button onClick={async()=>{
                    if(!newRuta.destino||!newRuta.precio)return setPmsg("Completa destino y precio");
                    const{error}=await supabase.from("rutas_transporte").insert({proveedor_id:provData.id,origen:newRuta.origen,destino:newRuta.destino,hora_salida:newRuta.hora_salida,precio:parseFloat(newRuta.precio),puestos_disponibles:newRuta.puestos_disponibles,dias_operacion:newRuta.dias_operacion,acepta_encomiendas:newRuta.acepta_encomiendas,activo:true});
                    if(error)return setPmsg("Error: "+error.message);
                    setPmsg("✅ Ruta publicada");setShowNuevaRuta(false);setNewRuta({origen:"San Fernando",destino:"",hora_salida:"07:00",precio:"",puestos_disponibles:10,dias_operacion:"Lunes a Domingo",acepta_encomiendas:false});loadMisRutas(provData.id);
                  }} style={{...s.btn,marginTop:0}}>✅ Publicar ruta</button>
                </div>)}
                {misRutas.length===0&&!showNuevaRuta&&<div style={{textAlign:"center",padding:"30px 0",color:"#94a3b8",fontSize:13}}>No tienes rutas publicadas aún</div>}
                {misRutas.map(ruta=>(<div key={ruta.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #f1f5f9"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div><div style={{fontSize:14,fontWeight:800}}>{ruta.origen} → {ruta.destino}</div><div style={{fontSize:11,color:"#64748b"}}>🕐 {ruta.hora_salida?.slice(0,5)} · 💺 {ruta.puestos_disponibles} puestos · {ruta.dias_operacion}</div>{ruta.acepta_encomiendas&&<div style={{fontSize:11,color:"#c2410c"}}>📦 Acepta encomiendas</div>}</div>
                    <div style={{fontSize:18,fontWeight:900,color:"#059669"}}>${ruta.precio}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={async()=>{const p=parseInt(prompt("Puestos disponibles:",ruta.puestos_disponibles));if(isNaN(p))return;await supabase.from("rutas_transporte").update({puestos_disponibles:p}).eq("id",ruta.id);loadMisRutas(provData.id);}} style={{...s.apvBtn,background:"#eff6ff",color:"#1d4ed8",flex:1}}>✏️ Editar</button>
                    <button onClick={async()=>{if(!window.confirm("¿Eliminar?"))return;await supabase.from("rutas_transporte").delete().eq("id",ruta.id);loadMisRutas(provData.id);}} style={{...s.apvBtn,background:"#fef2f2",color:"#dc2626"}}>🗑️</button>
                  </div>
                </div>))}
              </div>
            )}
            {provTab==="mis_habitaciones"&&(
              <div style={{padding:"0 16px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>🛏️ Habitaciones ({misHabitaciones.length})</div>
                  <button onClick={()=>setShowNuevaHab(!showNuevaHab)} style={{background:showNuevaHab?"#64748b":"#0d9488",color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{showNuevaHab?"✕ Cancelar":"+ Nueva hab."}</button>
                </div>
                {showNuevaHab&&(<div style={{background:"#f0fdfa",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #99f6e4"}}>
                  <label style={s.lbl}>Nombre *</label><input style={s.inp} value={newHabitacion.nombre} onChange={e=>setNewHabitacion(h=>({...h,nombre:e.target.value}))} placeholder="Habitación doble, Suite..."/>
                  <label style={s.lbl}>Descripción</label><input style={s.inp} value={newHabitacion.descripcion} onChange={e=>setNewHabitacion(h=>({...h,descripcion:e.target.value}))} placeholder="AC, baño privado, TV..."/>
                  <label style={s.lbl}>Precio por noche ($)</label><input style={s.inp} type="number" value={newHabitacion.precio_noche} onChange={e=>setNewHabitacion(h=>({...h,precio_noche:e.target.value}))} placeholder="50"/>
                  <label style={s.lbl}>Capacidad (personas)</label><input style={s.inp} type="number" value={newHabitacion.capacidad_personas} onChange={e=>setNewHabitacion(h=>({...h,capacidad_personas:parseInt(e.target.value)||2}))}/>
                  <label style={s.lbl}>URL foto (opcional)</label><input style={s.inp} value={newHabitacion.foto_url} onChange={e=>setNewHabitacion(h=>({...h,foto_url:e.target.value}))} placeholder="https://..."/>
                  <button onClick={async()=>{
                    if(!newHabitacion.nombre)return setPmsg("El nombre es obligatorio");
                    const{error}=await supabase.from("habitaciones_hotel").insert({proveedor_id:provData.id,nombre:newHabitacion.nombre,descripcion:newHabitacion.descripcion||null,precio_noche:newHabitacion.precio_noche?parseFloat(newHabitacion.precio_noche):null,capacidad_personas:newHabitacion.capacidad_personas,foto_url:newHabitacion.foto_url||null,disponible:true,aprobado:false});
                    if(error)return setPmsg("Error: "+error.message);
                    setPmsg("✅ Enviado para aprobación");setShowNuevaHab(false);setNewHabitacion({nombre:"",descripcion:"",precio_noche:"",capacidad_personas:2,foto_url:""});loadMisHabitaciones(provData.id);
                  }} style={{...s.btn,marginTop:0}}>✅ Enviar para aprobación</button>
                </div>)}
                {misHabitaciones.length===0&&!showNuevaHab&&<div style={{textAlign:"center",padding:"30px 0",color:"#94a3b8",fontSize:13}}>No tienes habitaciones publicadas aún</div>}
                {misHabitaciones.map(hab=>(<div key={hab.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #f1f5f9",display:"flex",gap:12}}>
                  {hab.foto_url&&<img src={hab.foto_url} alt="" style={{width:68,height:68,borderRadius:10,objectFit:"cover",flexShrink:0}}/>}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:13,fontWeight:700}}>{hab.nombre}</div><span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:20,background:hab.aprobado?"#dcfce7":"#fef9c3",color:hab.aprobado?"#15803d":"#854d0e"}}>{hab.aprobado?"✓":"⏳"}</span></div>
                    {hab.descripcion&&<div style={{fontSize:11,color:"#64748b",marginTop:2}}>{hab.descripcion}</div>}
                    <div style={{fontSize:12,color:"#0d9488",fontWeight:700,marginTop:3}}>{hab.precio_noche?`$${hab.precio_noche}/noche`:"Sin precio"} · 👥 {hab.capacidad_personas}p</div>
                    <button onClick={async()=>{if(!window.confirm("¿Eliminar?"))return;await supabase.from("habitaciones_hotel").delete().eq("id",hab.id);loadMisHabitaciones(provData.id);}} style={{...s.apvBtn,background:"#fef2f2",color:"#dc2626",marginTop:6}}>🗑️ Eliminar</button>
                  </div>
                </div>))}
              </div>
            )}
            {provTab==="mis_turismo"&&(
              <div style={{padding:"0 16px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>🌴 Servicios turísticos ({misTurismo.length})</div>
                  <button onClick={()=>setShowNuevoTurismo(!showNuevoTurismo)} style={{background:showNuevoTurismo?"#64748b":"#16a34a",color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{showNuevoTurismo?"✕ Cancelar":"+ Nuevo"}</button>
                </div>
                {showNuevoTurismo&&(<div style={{background:"#f0fdf4",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #bbf7d0"}}>
                  <label style={s.lbl}>Nombre *</label><input style={s.inp} value={newTurismo.nombre} onChange={e=>setNewTurismo(t=>({...t,nombre:e.target.value}))} placeholder="Paseo en lancha, Noche en cabaña..."/>
                  <label style={s.lbl}>Descripción</label><input style={s.inp} value={newTurismo.descripcion} onChange={e=>setNewTurismo(t=>({...t,descripcion:e.target.value}))} placeholder="Descripción..."/>
                  <label style={s.lbl}>Precio por persona ($)</label><input style={s.inp} type="number" value={newTurismo.precio} onChange={e=>setNewTurismo(t=>({...t,precio:e.target.value}))} placeholder="30"/>
                  <label style={s.lbl}>Capacidad máxima</label><input style={s.inp} type="number" value={newTurismo.capacidad_personas} onChange={e=>setNewTurismo(t=>({...t,capacidad_personas:e.target.value}))} placeholder="10"/>
                  <label style={s.lbl}>¿Qué incluye?</label><input style={s.inp} value={newTurismo.incluye} onChange={e=>setNewTurismo(t=>({...t,incluye:e.target.value}))} placeholder="Comida, guía, transporte..."/>
                  <label style={s.lbl}>URL foto (opcional)</label><input style={s.inp} value={newTurismo.foto_url} onChange={e=>setNewTurismo(t=>({...t,foto_url:e.target.value}))} placeholder="https://..."/>
                  <button onClick={async()=>{
                    if(!newTurismo.nombre)return setPmsg("El nombre es obligatorio");
                    const{error}=await supabase.from("servicios_turismo").insert({proveedor_id:provData.id,nombre:newTurismo.nombre,descripcion:newTurismo.descripcion||null,precio:newTurismo.precio?parseFloat(newTurismo.precio):null,capacidad_personas:newTurismo.capacidad_personas?parseInt(newTurismo.capacidad_personas):null,incluye:newTurismo.incluye||null,foto_url:newTurismo.foto_url||null,disponible:true,aprobado:false});
                    if(error)return setPmsg("Error: "+error.message);
                    setPmsg("✅ Enviado para aprobación");setShowNuevoTurismo(false);setNewTurismo({nombre:"",descripcion:"",precio:"",capacidad_personas:"",incluye:"",foto_url:""});loadMisTurismo(provData.id);
                  }} style={{...s.btn,marginTop:0}}>✅ Enviar para aprobación</button>
                </div>)}
                {misTurismo.length===0&&!showNuevoTurismo&&<div style={{textAlign:"center",padding:"30px 0",color:"#94a3b8",fontSize:13}}>No tienes servicios publicados aún</div>}
                {misTurismo.map(srv=>(<div key={srv.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #f1f5f9",display:"flex",gap:12}}>
                  {srv.foto_url&&<img src={srv.foto_url} alt="" style={{width:68,height:68,borderRadius:10,objectFit:"cover",flexShrink:0}}/>}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:13,fontWeight:700}}>{srv.nombre}</div><span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:20,background:srv.aprobado?"#dcfce7":"#fef9c3",color:srv.aprobado?"#15803d":"#854d0e"}}>{srv.aprobado?"✓":"⏳"}</span></div>
                    {srv.descripcion&&<div style={{fontSize:11,color:"#64748b",marginTop:2}}>{srv.descripcion}</div>}
                    {srv.precio&&<div style={{fontSize:12,color:"#16a34a",fontWeight:700,marginTop:3}}>${srv.precio}/persona{srv.capacidad_personas?` · 👥 máx ${srv.capacidad_personas}`:""}</div>}
                    {srv.incluye&&<div style={{fontSize:11,color:"#1d4ed8",marginTop:2}}>✓ {srv.incluye}</div>}
                    <button onClick={async()=>{if(!window.confirm("¿Eliminar?"))return;await supabase.from("servicios_turismo").delete().eq("id",srv.id);loadMisTurismo(provData.id);}} style={{...s.apvBtn,background:"#fef2f2",color:"#dc2626",marginTop:6}}>🗑️ Eliminar</button>
                  </div>
                </div>))}
              </div>
            )}
          {provTab==="mi_negocio"&&(()=>{
            // seccionNegocio está en el estado del componente
            const seccion=seccionNegocio;const setSeccion=setSeccionNegocio;
            const notifPagoWa=(cambio)=>{
              const num=normalizarNumeroWA(provData.whatsapp_negocio||provData.telefono);
              if(!num)return;
              const msg=`⚙️ *Lokl — Cambio en tu cuenta*\n\nHola ${provData.negocio} 👋\n\n${cambio}\n\nSi no realizaste este cambio, contáctanos de inmediato.`;
              abrirWhatsApp(num,msg);
            };
            return(
              <div style={{background:"#fff",borderRadius:0,padding:"0 0 16px"}}>
                {/* HEADER MI NEGOCIO */}
                <div style={{background:"linear-gradient(135deg,#1e293b,#334155)",padding:"14px 16px",display:"flex",alignItems:"center",gap:10,marginBottom:0}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚙️</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>Configuración del negocio</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{provData.negocio}</div>
                  </div>
                </div>
                {pmsg&&<div style={{...s.msg(pmsg.includes("✅")),margin:"8px 16px 0"}}>{pmsg}</div>}
                {/* SUB-MENÚ PROFESIONAL */}
                <div style={{display:"flex",overflowX:"auto",borderBottom:"2px solid #f1f5f9",marginBottom:0,gap:0}}>
                  {[
                    {k:"perfil",  icon:"👤", l:"Perfil"},
                    {k:"horario", icon:"🕐", l:"Horario"},
                    {k:"delivery",icon:"🛵", l:"Delivery"},
                    {k:"pagos",   icon:"💳", l:"Pagos"},
                    {k:"eta",     icon:"⏱️", l:"Tiempos"},
                    {k:"clave",   icon:"🔑", l:"Seguridad"},
                  ].map(s2=>(
                    <button key={s2.k} onClick={()=>{setSeccion(s2.k);if(s2.k==="perfil")setPerfilData({negocio:provData.negocio||"",descripcion_negocio:provData.descripcion_negocio||"",especialidad:provData.especialidad||"",whatsapp_negocio:provData.whatsapp_negocio||"",telefono_principal:provData.telefono_principal||"",instagram:provData.instagram||"",tipo_presencia:provData.tipo_presencia||"online",estado_ubicacion:provData.estado_ubicacion||"",municipio:provData.municipio||"",parroquia:provData.parroquia||"",direccion_fisica:provData.direccion_fisica||"",latitud:provData.latitud||null,longitud:provData.longitud||null});}}
                      style={{flexShrink:0,padding:"12px 14px 10px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,borderBottom:seccion===s2.k?"3px solid #1d4ed8":"3px solid transparent",transition:"all 0.15s"}}>
                      <span style={{fontSize:16,filter:seccion===s2.k?"none":"grayscale(40%)",opacity:seccion===s2.k?1:0.6}}>{s2.icon}</span>
                      <span style={{fontSize:9,fontWeight:seccion===s2.k?700:500,color:seccion===s2.k?"#1d4ed8":"#94a3b8",whiteSpace:"nowrap",letterSpacing:0.3}}>{s2.l.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
                {/* CONTENIDO DE SECCIÓN */}
                <div style={{padding:"16px 16px 0"}}>

                {/* ── PERFIL ── */}
                {seccion==="perfil"&&(
                  <div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>Tu correo de acceso: <strong style={{color:"#0f172a"}}>{provData.email}</strong> (no editable)</div>
                    {/* LOGO */}
                    <label style={s.lbl}>Logo del negocio</label>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,background:"#f8fafc",borderRadius:10,padding:"10px"}}> 
                      {(perfilData.logo_preview||provData.logo_url)
                        ?<img src={perfilData.logo_preview||provData.logo_url} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:"2px solid #e2e8f0"}}/>
                        :<div style={{width:52,height:52,borderRadius:"50%",background:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏪</div>
                      }
                      <div style={{flex:1}}>
                        <input type="file" accept="image/*" id="logo_inp" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){setLogoFile(f);setPerfilData(p=>({...p,logo_preview:URL.createObjectURL(f)}));}}}/>
                        <label htmlFor="logo_inp" style={{display:"block",background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"center"}}>
                          📸 {provData.logo_url?"Cambiar logo":"Subir logo"}
                        </label>
                        <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>JPG o PNG recomendado</div>
                      </div>
                    </div>
                    {/* TIPO DE PRESENCIA */}
                    <label style={s.lbl}>¿Cómo opera tu negocio? *</label>
                    <div style={{display:"flex",gap:6,marginBottom:10}}>
                      {[["online","🌐 Solo online"],["fisico","🏪 Solo local físico"],["ambos","🌐🏪 Online y físico"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setPerfilData({...perfilData,tipo_presencia:v})}
                          style={{flex:1,padding:"8px 4px",borderRadius:10,border:`2px solid ${(perfilData.tipo_presencia||provData.tipo_presencia||"online")===v?"#25D366":"#e2e8f0"}`,background:(perfilData.tipo_presencia||provData.tipo_presencia||"online")===v?"#f0fdf4":"#fff",color:(perfilData.tipo_presencia||provData.tipo_presencia||"online")===v?"#15803d":"#64748b",fontSize:10,fontWeight:700,cursor:"pointer",textAlign:"center",lineHeight:1.3}}>
                          {l}
                        </button>
                      ))}
                    </div>

                    <label style={s.lbl}>Nombre del negocio</label>
                    <input style={s.inp} value={perfilData.negocio||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,negocio:v}));}} placeholder="Nombre de tu negocio"/>
                    <label style={s.lbl}>Descripción</label>
                    <input style={s.inp} value={perfilData.descripcion_negocio||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,descripcion_negocio:v}));}} placeholder="Describe tu negocio..."/>
                    {!["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(provData.tipo_negocio)&&(<>
                    <label style={s.lbl}>Especialidad / Servicios que ofreces</label>
                    <input style={s.inp} value={perfilData.especialidad||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,especialidad:v}));}} placeholder="Ej: Cardiología, Uñas acrílicas, Mecánica general..."/>
                    </>)}
                    <label style={s.lbl}>WhatsApp de pedidos *</label>
                    <input style={s.inp} value={perfilData.whatsapp_negocio||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,whatsapp_negocio:v}));}} placeholder="04XX-XXXXXXX"/>
                    <label style={s.lbl}>Teléfono administrativo</label>
                    <input style={s.inp} value={perfilData.telefono_principal||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,telefono_principal:v}));}} placeholder="Para facturación y soporte"/>
                    <label style={s.lbl}>Instagram</label>
                    <input style={s.inp} value={perfilData.instagram||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,instagram:v}));}} placeholder="@minegocio"/>

                    {/* UBICACIÓN */}
                    <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>📍 Ubicación del local</div>
                      <div style={{display:"flex",gap:8,marginBottom:6}}>
                        <div style={{flex:1}}>
                          <label style={s.lbl}>Estado</label>
                          <select style={{...s.inp,background:"#fff"}} value={perfilData.estado_ubicacion||""} onChange={e=>setPerfilData(p=>({...p,estado_ubicacion:e.target.value,municipio:""}))}>
                            <option value="">Selecciona estado...</option>
                            {Object.keys(VE_ESTADOS_MUNICIPIOS).sort().map(est=><option key={est} value={est}>{est}</option>)}
                          </select>
                        </div>
                        <div style={{flex:1}}>
                          <label style={s.lbl}>Municipio</label>
                          <select style={{...s.inp,background:"#fff"}} value={perfilData.municipio||""} onChange={e=>setPerfilData(p=>({...p,municipio:e.target.value}))}>
                            <option value="">Selecciona municipio...</option>
                            {(VE_ESTADOS_MUNICIPIOS[perfilData.estado_ubicacion||""]||[]).map(m=><option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                      </div>
                      <label style={s.lbl}>Parroquia</label>
                      <input style={s.inp} value={perfilData.parroquia||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,parroquia:v}));}} placeholder="Parroquia San Fernando"/>
                      <label style={s.lbl}>Dirección exacta</label>
                      <input style={s.inp} value={perfilData.direccion_fisica||""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,direccion_fisica:v}));}} placeholder="Calle Bolívar #23, frente al parque..."/>
                      <label style={s.lbl}>Coordenadas GPS</label>
                      <div style={{display:"flex",gap:6,marginBottom:6}}>
                        <input style={{...s.inp,flex:1,marginBottom:0}} type="text" inputMode="decimal" placeholder="Latitud ej: 7.882672" value={perfilData.latitud!=null?String(perfilData.latitud):""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,latitud:v}));}}/>
                        <input style={{...s.inp,flex:1,marginBottom:0}} type="text" inputMode="decimal" placeholder="Longitud ej: -67.482665" value={perfilData.longitud!=null?String(perfilData.longitud):""} onChange={e=>{const v=e.target.value;setPerfilData(p=>({...p,longitud:v}));}}/>
                      </div>
                      <button onClick={()=>{
                        if(!navigator.geolocation)return setPmsg("⚠️ Tu navegador no soporta geolocalización");
                        setPmsg("📡 Obteniendo ubicación...");
                        navigator.geolocation.getCurrentPosition(
                          (pos)=>{
                            const lat=parseFloat(pos.coords.latitude.toFixed(6));
                            const lng=parseFloat(pos.coords.longitude.toFixed(6));
                            setPerfilData(p=>({...p,latitud:lat,longitud:lng}));
                            setPmsg(`✅ Ubicación obtenida: ${lat}, ${lng}`);
                          },
                          (err)=>{
                            if(err.code===1)setPmsg("⚠️ Permiso de ubicación denegado.");
                            else setPmsg("⚠️ No se pudo obtener la ubicación.");
                          },
                          {enableHighAccuracy:true,timeout:10000}
                        );
                      }} style={{width:"100%",background:"#1d4ed8",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                        📍 Obtener mi ubicación actual (GPS)
                      </button>
                      {perfilData.latitud&&perfilData.longitud&&(
                        <a href={`https://maps.google.com/?q=${perfilData.latitud},${perfilData.longitud}`} target="_blank" rel="noreferrer" style={{display:"block",textAlign:"center",fontSize:11,color:"#1d4ed8",marginTop:6,textDecoration:"underline"}}>
                          🗺️ Ver en Google Maps
                        </a>
                      )}
                    </div>

                    <button onClick={async()=>{
                      if(!provData?.id){alert("Error: no hay sesión activa");return;}
                      let new_logo_url=provData.logo_url||null;
                      if(logoFile){new_logo_url=await upload(logoFile,"logos",`${provData.id}_logo_${Date.now()}`);setLogoFile(null);}
                      const payload={
                        negocio:perfilData.negocio||provData.negocio,
                        descripcion_negocio:perfilData.descripcion_negocio,
                        especialidad:perfilData.especialidad||null,
                        whatsapp_negocio:perfilData.whatsapp_negocio,
                        telefono:perfilData.whatsapp_negocio,
                        telefono_principal:perfilData.telefono_principal,
                        instagram:perfilData.instagram,
                        direccion_fisica:perfilData.direccion_fisica,
                        tipo_presencia:perfilData.tipo_presencia||"online",
                        estado_ubicacion:perfilData.estado_ubicacion,
                        municipio:perfilData.municipio,
                        parroquia:perfilData.parroquia,
                        latitud:perfilData.latitud!=null&&perfilData.latitud!==""?parseFloat(String(perfilData.latitud)):null,
                        longitud:perfilData.longitud!=null&&perfilData.longitud!==""?parseFloat(String(perfilData.longitud)):null,
                        logo_url:new_logo_url,
                      };
                      const{error}=await supabase.from("proveedores").update(payload).eq("id",provData.id);
                      if(error){alert("Error al guardar: "+error.message);return;}
                      // Recargar datos del proveedor desde la DB para confirmar
                      const{data:updated}=await supabase.from("proveedores").select("*").eq("id",provData.id).single();
                      if(updated)setProvData(updated);
                      else setProvData(d=>({...d,...payload}));
                      alert("✅ Perfil guardado correctamente");
                      loadAll();
                    }} style={{width:"100%",background:"#22c55e",color:"#fff",border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:10,display:"block"}}>
                      💾 Guardar perfil
                    </button>
                  </div>
                )}

                {/* ── HORARIO ── */}
                {seccion==="horario"&&(
                  <div>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <div style={{flex:1}}><label style={s.lbl}>Abre</label><input style={s.inp} type="time" value={perfilData.horario_desde||provData.horario_desde||"08:00"} onChange={e=>setPerfilData({...perfilData,horario_desde:e.target.value})}/></div>
                      <div style={{flex:1}}><label style={s.lbl}>Cierra</label><input style={s.inp} type="time" value={perfilData.horario_hasta||provData.horario_hasta||"18:00"} onChange={e=>setPerfilData({...perfilData,horario_hasta:e.target.value})}/></div>
                    </div>
                    <label style={s.lbl}>Nota de horario (opcional)</label>
                    <input style={s.inp} placeholder="Ej: Solo fines de semana" value={perfilData.horario_desc||provData.horario_desc||""} onChange={e=>setPerfilData({...perfilData,horario_desc:e.target.value})}/>
                    <button onClick={async()=>{
                      await supabase.from("proveedores").update({horario_desde:perfilData.horario_desde||provData.horario_desde,horario_hasta:perfilData.horario_hasta||provData.horario_hasta,horario_desc:perfilData.horario_desc||provData.horario_desc}).eq("id",provData.id);
                      setProvData({...provData,...perfilData});setPmsg("✅ Horario actualizado");
                    }} style={{...s.btnGreen,width:"100%",borderRadius:10,padding:"10px",marginTop:4}}>💾 Guardar horario</button>
                  </div>
                )}

                {/* ── DELIVERY ── */}
                {seccion==="delivery"&&(
                  <div>
                    <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,cursor:"pointer"}}>
                      <input type="checkbox" checked={perfilData.delivery_propio??provData.delivery_propio??false} onChange={e=>setPerfilData({...perfilData,delivery_propio:e.target.checked})} style={{width:18,height:18,accentColor:"#25D366"}}/>
                      <span style={{fontSize:13,fontWeight:700}}>🛵 Ofrezco delivery a domicilio</span>
                    </label>
                    <label style={s.lbl}>Costo de delivery ($)</label>
                    <input style={s.inp} type="number" placeholder="1.00" value={perfilData.delivery_costo??provData.delivery_costo??0} onChange={e=>setPerfilData({...perfilData,delivery_costo:parseFloat(e.target.value)||0})}/>
                    <label style={s.lbl}>Delivery gratis desde ($)</label>
                    <input style={s.inp} type="number" placeholder="15.00" value={perfilData.delivery_gratis_desde??provData.delivery_gratis_desde??15} onChange={e=>setPerfilData({...perfilData,delivery_gratis_desde:parseFloat(e.target.value)||0})}/>
                    <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}>
                      <input type="checkbox" checked={perfilData.permite_retiro??provData.permite_retiro??false} onChange={e=>setPerfilData({...perfilData,permite_retiro:e.target.checked})} style={{width:18,height:18,accentColor:"#25D366"}}/>
                      <span style={{fontSize:13,fontWeight:700}}>🏃 Permito retiro en local</span>
                    </label>
                    <button onClick={async()=>{
                      await supabase.from("proveedores").update({delivery_propio:perfilData.delivery_propio??provData.delivery_propio,delivery_costo:perfilData.delivery_costo??provData.delivery_costo,delivery_gratis_desde:perfilData.delivery_gratis_desde??provData.delivery_gratis_desde,permite_retiro:perfilData.permite_retiro??provData.permite_retiro}).eq("id",provData.id);
                      setProvData({...provData,...perfilData});setPmsg("✅ Delivery actualizado");loadAll();
                    }} style={{...s.btnGreen,width:"100%",borderRadius:10,padding:"10px",marginTop:4}}>💾 Guardar delivery</button>
                  </div>
                )}

                {/* ── PAGOS ── */}
                {seccion==="pagos"&&(
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#1e40af",background:"#dbeafe",padding:"6px 10px",borderRadius:8,marginBottom:10}}>📱 Pago Móvil</div>
                    <label style={s.lbl}>Banco</label>
                    <input style={s.inp} placeholder="Ej: Banesco, BDV..." value={pagoData.pago_movil_banco||provData.pago_movil_banco||""} onChange={e=>setPagoData({...pagoData,pago_movil_banco:e.target.value})}/>
                    <label style={s.lbl}>Teléfono</label>
                    <input style={s.inp} placeholder="04XX-XXXXXXX" value={pagoData.pago_movil_telefono||provData.pago_movil_telefono||""} onChange={e=>setPagoData({...pagoData,pago_movil_telefono:e.target.value})}/>
                    <label style={s.lbl}>Cédula</label>
                    <input style={s.inp} placeholder="V-XXXXXXXX" value={pagoData.pago_movil_cedula||provData.pago_movil_cedula||""} onChange={e=>setPagoData({...pagoData,pago_movil_cedula:e.target.value})}/>
                    <label style={s.lbl}>Nombre del titular</label>
                    <input style={s.inp} placeholder="Nombre completo" value={pagoData.pago_movil_nombre||provData.pago_movil_nombre||""} onChange={e=>setPagoData({...pagoData,pago_movil_nombre:e.target.value})}/>
                    <div style={{fontSize:12,fontWeight:700,color:"#15803d",background:"#f0fdf4",padding:"6px 10px",borderRadius:8,marginBottom:10,marginTop:4}}>💵 Otros métodos</div>
                    <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}><input type="checkbox" checked={pagoData.acepta_efectivo??provData.acepta_efectivo??false} onChange={e=>setPagoData({...pagoData,acepta_efectivo:e.target.checked})} style={{width:16,height:16,accentColor:"#25D366"}}/><span style={{fontSize:12,fontWeight:600}}>Acepto efectivo USD</span></label>
                    <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}><input type="checkbox" checked={pagoData.acepta_divisas??provData.acepta_divisas??false} onChange={e=>setPagoData({...pagoData,acepta_divisas:e.target.checked})} style={{width:16,height:16,accentColor:"#25D366"}}/><span style={{fontSize:12,fontWeight:600}}>Acepto otras divisas</span></label>
                    <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}><input type="checkbox" checked={pagoData.acepta_zelle??provData.acepta_zelle??false} onChange={e=>setPagoData({...pagoData,acepta_zelle:e.target.checked})} style={{width:16,height:16,accentColor:"#25D366"}}/><span style={{fontSize:12,fontWeight:600}}>Acepto Zelle</span></label>
                    {(pagoData.acepta_zelle??provData.acepta_zelle)&&<input style={s.inp} placeholder="Email o teléfono Zelle" value={pagoData.zelle_cuenta||provData.zelle_cuenta||""} onChange={e=>setPagoData({...pagoData,zelle_cuenta:e.target.value})}/>}
                    <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}><input type="checkbox" checked={pagoData.acepta_binance??provData.acepta_binance??false} onChange={e=>setPagoData({...pagoData,acepta_binance:e.target.checked})} style={{width:16,height:16,accentColor:"#F0B90B"}}/><span style={{fontSize:12,fontWeight:600}}>Acepto Binance Pay</span></label>
                    {(pagoData.acepta_binance??provData.acepta_binance)&&<input style={s.inp} placeholder="ID o email Binance Pay" value={pagoData.binance_cuenta||provData.binance_cuenta||""} onChange={e=>setPagoData({...pagoData,binance_cuenta:e.target.value})}/>}
                    <button onClick={async()=>{
                      const nuevosPagos={pago_movil_banco:pagoData.pago_movil_banco||provData.pago_movil_banco||"",pago_movil_telefono:pagoData.pago_movil_telefono||provData.pago_movil_telefono||"",pago_movil_cedula:pagoData.pago_movil_cedula||provData.pago_movil_cedula||"",pago_movil_nombre:pagoData.pago_movil_nombre||provData.pago_movil_nombre||"",acepta_efectivo:pagoData.acepta_efectivo??provData.acepta_efectivo??false,acepta_zelle:pagoData.acepta_zelle??provData.acepta_zelle??false,zelle_cuenta:pagoData.zelle_cuenta||provData.zelle_cuenta||"",acepta_divisas:pagoData.acepta_divisas??provData.acepta_divisas??false,acepta_binance:pagoData.acepta_binance??provData.acepta_binance??false,binance_cuenta:pagoData.binance_cuenta||provData.binance_cuenta||""};
                      await supabase.from("proveedores").update(nuevosPagos).eq("id",provData.id);
                      setProvData({...provData,...nuevosPagos});setPmsg("✅ Métodos de pago actualizados");
                      // Notificar por WhatsApp
                      const resumen=[nuevosPagos.pago_movil_banco?`• Pago Móvil: ${nuevosPagos.pago_movil_banco} / ${nuevosPagos.pago_movil_telefono}`:"",nuevosPagos.acepta_zelle?`• Zelle: ${nuevosPagos.zelle_cuenta}`:"",nuevosPagos.acepta_binance?`• Binance Pay: ${nuevosPagos.binance_cuenta}`:"",nuevosPagos.acepta_efectivo?"• Efectivo USD: Sí":"",nuevosPagos.acepta_divisas?"• Otras divisas: Sí":""].filter(Boolean).join("\n");
                      notifPagoWa(`✅ Tus métodos de pago fueron actualizados:\n\n${resumen}`);
                    }} style={{...s.btnGreen,width:"100%",borderRadius:10,padding:"10px",marginTop:4}}>💾 Guardar y notificarme</button>
                  </div>
                )}

                {/* ── ETA ── */}
                {seccion==="eta"&&(
                  <div>
                    <div style={{fontSize:12,color:"#64748b",marginBottom:12,lineHeight:1.5}}>Define cuánto tiempo tarda tu negocio en preparar y entregar un pedido. Se mostrará a los clientes en tu tienda y en el carrito.</div>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <div style={{flex:1}}><label style={s.lbl}>Tiempo mínimo (min)</label><input style={s.inp} type="number" placeholder="20" value={etaData.eta_minutos_min||provData.eta_minutos_min||""} onChange={e=>setEtaData({...etaData,eta_minutos_min:e.target.value})}/></div>
                      <div style={{flex:1}}><label style={s.lbl}>Tiempo máximo (min)</label><input style={s.inp} type="number" placeholder="40" value={etaData.eta_minutos_max||provData.eta_minutos_max||""} onChange={e=>setEtaData({...etaData,eta_minutos_max:e.target.value})}/></div>
                    </div>
                    <label style={s.lbl}>O escribe texto libre</label>
                    <input style={s.inp} placeholder="Ej: 25–35 min / A confirmar / Mismo día" value={etaData.eta_texto||provData.eta_texto||""} onChange={e=>setEtaData({...etaData,eta_texto:e.target.value})}/>
                    <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>Vista previa: <strong>⏱️ {etaData.eta_texto||provData.eta_texto||(etaData.eta_minutos_min&&etaData.eta_minutos_max?`${etaData.eta_minutos_min}–${etaData.eta_minutos_max} min`:"No configurado")}</strong></div>
                    <button onClick={async()=>{
                      await supabase.from("proveedores").update({eta_minutos_min:etaData.eta_minutos_min||provData.eta_minutos_min||null,eta_minutos_max:etaData.eta_minutos_max||provData.eta_minutos_max||null,eta_texto:etaData.eta_texto||provData.eta_texto||null}).eq("id",provData.id);
                      setProvData({...provData,...etaData});setPmsg("✅ Tiempo de entrega actualizado");
                    }} style={{...s.btnGreen,width:"100%",borderRadius:10,padding:"10px",marginTop:4}}>💾 Guardar tiempo</button>
                  </div>
                )}

                {/* ── CLAVE ── */}
                {seccion==="clave"&&(
                  <div>
                    <label style={s.lbl}>Clave actual</label>
                    <input style={s.inp} type="password" placeholder="••••••••" value={claveForm.actual} onChange={e=>setClaveForm({...claveForm,actual:e.target.value})}/>
                    <label style={s.lbl}>Nueva clave</label>
                    <input style={s.inp} type="password" placeholder="••••••••" value={claveForm.nueva} onChange={e=>setClaveForm({...claveForm,nueva:e.target.value})}/>
                    <label style={s.lbl}>Confirmar nueva clave</label>
                    <input style={s.inp} type="password" placeholder="••••••••" value={claveForm.confirmar} onChange={e=>setClaveForm({...claveForm,confirmar:e.target.value})}/>
                    <button onClick={async()=>{
                      if(!claveForm.actual||!claveForm.nueva||!claveForm.confirmar)return setPmsg("Completa todos los campos");
                      if(claveForm.nueva!==claveForm.confirmar)return setPmsg("Las claves no coinciden");
                      if(claveForm.actual!==provData.password_plain)return setPmsg("La clave actual es incorrecta");
                      if(claveForm.nueva.length<6)return setPmsg("La nueva clave debe tener al menos 6 caracteres");
                      await supabase.from("proveedores").update({password_plain:claveForm.nueva}).eq("id",provData.id);
                      setPmsg("✅ Clave actualizada");setClaveForm({actual:"",nueva:"",confirmar:""});
                    }} style={{...s.btnGreen,width:"100%",borderRadius:10,padding:"10px",marginTop:4}}>🔑 Cambiar clave</button>
                  </div>
                )}

                </div> {/* end padding wrapper */}
              </div>
            );
          })()}
              </div>
            )}
          </div>

        </>)}

        {/* ADMIN */}
        {provMode==="admin"&&(<>
          <div style={{...s.pc,background:"#eff6ff",borderColor:"#bfdbfe"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1d4ed8",marginBottom:10}}>⚙️ Panel Admin — {APP_NAME}</div>
            <button type="button" style={s.toggleBtn(superAbierto)} onClick={async()=>{const nuevoEstado=!superAbierto;await supabase.from("configuracion").update({valor:String(nuevoEstado)}).eq("clave","super_abierto");setSuperAbierto(nuevoEstado);}}>
              <span style={{fontSize:20}}>{superAbierto?"🟢":"🔴"}</span>
              <div><div style={{fontSize:13,fontWeight:700,color:superAbierto?"#15803d":"#92400e"}}>Supermercado: {superAbierto?"ABIERTO":"CERRADO"}</div><div style={{fontSize:11,color:"#64748b"}}>Toca para {superAbierto?"cerrar":"abrir"}</div></div>
            </button>
          </div>

          <div style={{...s.sec,paddingTop:0}}>
            {/* Si hay sección activa, mostrar botón de volver + título */}
            {adminSec!=="dashboard"?(
              <div style={{marginBottom:10}}>
                <button onClick={()=>setAdminSec("dashboard")} style={{display:"flex",alignItems:"center",gap:6,background:"#f1f5f9",border:"none",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:600,color:"#475569",cursor:"pointer",marginBottom:10}}>
                  ← Menú principal
                </button>
              </div>
            ):(
              // Mostrar menú completo solo en dashboard
              [
                {key:"pedidos",label:"📦 Pedidos",n:pedidos.filter(p=>p.estado==="nuevo").length},
                {key:"proveedores_lista",label:"🏪 Proveedores",n:0},
                {key:"pendientes",label:"⏳ Productos pendientes",n:pendProds.length},
                {key:"promos_pend",label:"🎉 Promos pendientes",n:pendPromos.filter(p=>!p.motivo_rechazo).length},
                {key:"resenas",label:"⭐ Reseñas",n:pendResenas.length},
                {key:"zonas",label:"🗺️ Zonas de delivery",n:0},
                {key:"combos",label:"🎁 Combos",n:0},
                {key:"super",label:"🛒 Supermercado",n:0},
                {key:"remates_pend",label:"🏷️ Remates pendientes",n:pendRemates.length},
                {key:"servicios_pend",label:"🛠️ Servicios pendientes",n:pendServiciosCom.length},
                {key:"resenas_publicadas",label:"✅ Reseñas publicadas",n:allResenasAdmin.length},
                {key:"habitaciones_pend",label:"🛏️ Habitaciones pendientes",n:pendHabitaciones.length},
                {key:"turismo_pend",label:"🌴 Turismo pendiente",n:pendTurismo.length},
                {key:"clasificados_pend",label:"🚗 Clasificados pendientes",n:pendClasificados.length},
                {key:"clasificados_all",label:"🚗 Todos los clasificados",n:allClasificadosAdmin.length},
                {key:"suscripciones",label:"💳 Suscripciones",n:suscripciones.filter(s=>!s.suscripcion_pagada&&s.meses_gratis_restantes===0).length},
              ].map(x=>(
                <button key={x.key} style={s.admRow(false)} onClick={()=>{setAdminSec(x.key);if(x.key==="pedidos")loadPedidos();if(x.key==="suscripciones")loadSuscripciones();}}>
                  <span>{x.label}</span>
                  {x.n>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{x.n}</span>}
                </button>
              ))
            )}
          </div>

          {adminSec==="dashboard"&&(<>
            {/* PEDIDOS DEL DÍA — banner prominente */}
            {(()=>{
              const hoyAdmin=new Date().toISOString().slice(0,10);
              const pedHoy=pedidos.filter(p=>p.created_at?.slice(0,10)===hoyAdmin);
              const pedNuevosHoy=pedHoy.filter(p=>p.estado==="nuevo");
              const pedEntregadosHoy=pedHoy.filter(p=>p.estado==="entregado");
              const ingresoHoyPed=pedEntregadosHoy.reduce((a,p)=>a+(p.total||0),0);
              if(pedHoy.length===0)return null;
              return(
                <div style={{margin:"0 16px 12px",background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:16,padding:"14px 16px",color:"#fff"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:1,marginBottom:8,textTransform:"uppercase"}}>📅 HOY</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:26,fontWeight:900,color:pedNuevosHoy.length>0?"#fbbf24":"#22c55e"}}>{pedNuevosHoy.length}</div>
                      <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>🟡 Nuevos</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:26,fontWeight:900,color:"#22c55e"}}>{pedHoy.length}</div>
                      <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>Total pedidos</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:26,fontWeight:900,color:"#22c55e"}}>${ingresoHoyPed.toFixed(0)}</div>
                      <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>💰 Entregados</div>
                    </div>
                  </div>
                  {pedNuevosHoy.length>0&&(
                    <button onClick={()=>setAdminSec("pedidos")} style={{width:"100%",background:"#fbbf24",color:"#0f172a",border:"none",borderRadius:10,padding:"9px",fontSize:12,fontWeight:800,cursor:"pointer",marginTop:10}}>
                      ⚡ Ver {pedNuevosHoy.length} pedido{pedNuevosHoy.length!==1?"s":""} nuevo{pedNuevosHoy.length!==1?"s":""} →
                    </button>
                  )}
                </div>
              );
            })()}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"0 16px 12px"}}>
              <StatCard num={`$${ingresoHoy.toFixed(2)}`} lbl="Ingresos hoy" color="#22c55e"/>
              <StatCard num={`$${ingresoTotal.toFixed(2)}`} lbl="Total histórico"/>
              <StatCard num={ventasHoy.length} lbl="Ventas hoy" color="#6366f1"/>
              <StatCard num={allProveedores.filter(p=>p.activo&&!p.en_pausa).length} lbl="Proveedores activos" color="#f59e0b"/>
            </div>
            {topAdminProds.length>0&&(<div style={{margin:"0 16px"}}><div style={s.pc}><div style={s.pT}>🏆 Más vendidos del ecosistema</div><BarChart data={topAdminProds} max={topAdminProds[0]?.[1]||1}/></div></div>)}
            <div style={{margin:"0 16px"}}><div style={s.pc}><div style={s.pT}>🕐 Últimas ventas</div>{adminVentas.length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>Aún no hay ventas</div>}{adminVentas.slice(0,10).map(v=>(<div key={v.id} style={{padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600}}>{v.producto_nombre}</span><span style={{fontWeight:700,color:"#22c55e"}}>${(v.total_item||0).toFixed(2)}</span></div><div style={{color:"#94a3b8"}}>{v.cliente_nombre} · {v.fecha?.slice(0,10)}</div></div>))}</div></div>
            {/* ACCESOS RÁPIDOS */}
            <div style={{margin:"0 16px 16px"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:8,letterSpacing:0.5}}>ACCESOS RÁPIDOS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {key:"pedidos",icon:"📦",label:"Pedidos",n:pedidos.filter(p=>p.estado==="nuevo").length,color:"#1d4ed8",bg:"#eff6ff"},
                  {key:"pendientes",icon:"⏳",label:"Prod. pendientes",n:pendProds.length,color:"#92400e",bg:"#fef9c3"},
                  {key:"proveedores_lista",icon:"🏪",label:"Proveedores",n:0,color:"#15803d",bg:"#f0fdf4"},
                  {key:"super",icon:"🛒",label:"Supermercado",n:0,color:"#0369a1",bg:"#e0f2fe"},
                  {key:"promos_pend",icon:"🎉",label:"Promos",n:pendPromos.filter(p=>!p.motivo_rechazo).length,color:"#7e22ce",bg:"#fdf4ff"},
                  {key:"suscripciones",icon:"💳",label:"Suscripciones",n:suscripciones.filter(s=>!s.suscripcion_pagada&&s.meses_gratis_restantes===0).length,color:"#be123c",bg:"#fff1f2"},
                  {key:"zonas",icon:"🗺️",label:"Zonas",n:0,color:"#475569",bg:"#f8fafc"},
                  {key:"resenas",icon:"⭐",label:"Reseñas",n:pendResenas.length,color:"#b45309",bg:"#fffbeb"},
                  {key:"resenas_publicadas",icon:"✅",label:"Publicadas",n:allResenasAdmin.length,color:"#15803d",bg:"#f0fdf4"},
                ].map(x=>(
                  <button key={x.key} onClick={()=>{setAdminSec(x.key);if(x.key==="pedidos")loadPedidos();if(x.key==="suscripciones")loadSuscripciones();}} style={{background:x.bg,border:`1px solid ${x.bg}`,borderRadius:12,padding:"12px",textAlign:"left",cursor:"pointer",position:"relative"}}>
                    <div style={{fontSize:22,marginBottom:4}}>{x.icon}</div>
                    <div style={{fontSize:12,fontWeight:700,color:x.color}}>{x.label}</div>
                    {x.n>0&&<span style={{position:"absolute",top:8,right:8,background:"#ef4444",color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{x.n}</span>}
                  </button>
                ))}
              </div>
            </div>
          </>)}

          {adminSec==="pedidos"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.cs}>
                {[
                  {k:"todos",l:"Todos"},
                  {k:"nuevo",l:`🟡 Nuevos (${pedidos.filter(p=>p.estado==="nuevo").length})`},
                  {k:"confirmado",l:"🔵 Pagados"},
                  {k:"en_camino",l:"🟠 En camino"},
                  {k:"entregado",l:"🟢 Entregados"},
                  {k:"anulado",l:"🔴 Anulados"},
                ].map(f=>(<button key={f.k} style={s.cb(pedidoFiltro===f.k)} onClick={()=>setPedidoFiltro(f.k)}>{f.l}</button>))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                <div style={s.statCard}><div style={{...s.statNum,fontSize:16,color:"#22c55e"}}>${pedidos.filter(p=>p.estado==="entregado").reduce((a,p)=>a+(p.ganancia||0),0).toFixed(2)}</div><div style={s.statLbl}>Ganancia real</div></div>
                <div style={s.statCard}><div style={{...s.statNum,fontSize:16,color:"#6366f1"}}>{pedidos.filter(p=>p.estado==="entregado").length}</div><div style={s.statLbl}>Entregados</div></div>
                <div style={s.statCard}><div style={{...s.statNum,fontSize:16,color:"#ef4444"}}>{pedidos.filter(p=>p.estado==="anulado").length}</div><div style={s.statLbl}>Anulados</div></div>
              </div>
              {(pedidoFiltro==="todos"?pedidos:pedidos.filter(p=>p.estado===pedidoFiltro)).length===0&&(
                <div style={{...s.pc,textAlign:"center",color:"#94a3b8"}}>No hay pedidos en esta categoría</div>
              )}
              {(pedidoFiltro==="todos"?pedidos:pedidos.filter(p=>p.estado===pedidoFiltro)).map(ped=>{
                const estadoConfig={
                  nuevo:{bg:"#fef9c3",color:"#854d0e",label:"🟡 Nuevo"},
                  confirmado:{bg:"#dbeafe",color:"#1d4ed8",label:"🔵 Pago confirmado"},
                  en_camino:{bg:"#fff7ed",color:"#c2410c",label:"🟠 En camino"},
                  entregado:{bg:"#dcfce7",color:"#15803d",label:"🟢 Entregado"},
                  anulado:{bg:"#fee2e2",color:"#be123c",label:"🔴 Anulado"},
                }[ped.estado]||{bg:"#f1f5f9",color:"#64748b",label:ped.estado};
                const itemsList=(ped.items||[]);
                return(
                  <div key={ped.id} style={{...s.pc,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:P}}>📋 {ped.ref}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>{ped.created_at?.slice(0,16).replace("T"," ")}</div>
                      </div>
                      <span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:8,background:estadoConfig.bg,color:estadoConfig.color}}>{estadoConfig.label}</span>
                    </div>
                    <div style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
                      {itemsList.map((it,i)=>(
                        <div key={i} style={{fontSize:12,padding:"2px 0",borderBottom:i<itemsList.length-1?"1px solid #f1f5f9":"none"}}>
                          <span style={{fontWeight:500}}>{it.nombre}</span> x{it.qty} — <span style={{color:"#22c55e",fontWeight:600}}>${((it.precio||0)*(it.qty||1)).toFixed(2)}</span>
                          {it.nota&&<div style={{fontSize:10,color:"#7e22ce"}}>📝 {it.nota}</div>}
                          {it.kitchen&&<span style={{fontSize:10,color:"#94a3b8"}}> ({it.kitchen})</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>
                      <div>👤 {ped.cliente_nombre} · 📱 {ped.cliente_telefono}</div>
                      <div>📍 {ped.cliente_direccion}</div>
                      <div>💳 {ped.metodo_pago}</div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,background:"#f0fdf4",padding:"6px 10px",borderRadius:8,marginBottom:8}}>
                      <span>Total: <strong>${(ped.total||0).toFixed(2)}</strong></span>
                      <span>Delivery: <strong>${(ped.delivery||0).toFixed(2)}</strong></span>
                      <span style={{color:"#22c55e"}}>Ganancia: <strong>${(ped.ganancia||0).toFixed(2)}</strong></span>
                    </div>
                    {ped.estado!=="entregado"&&ped.estado!=="anulado"&&(
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {ped.estado==="nuevo"&&(<>
                          <button onClick={()=>actualizarEstadoPedido(ped.id,"confirmado")} style={{...s.btnGreen,flex:1,fontSize:11}}>✓ Confirmar pago</button>
                          <button onClick={()=>actualizarEstadoPedido(ped.id,"anulado")} style={{...s.btnRed,flex:1,fontSize:11}}>✗ Anular</button>
                        </>)}
                        {ped.estado==="confirmado"&&(
                          <button onClick={()=>actualizarEstadoPedido(ped.id,"en_camino")} style={{...s.btnAmber,flex:1,fontSize:11}}>🛵 Marcar en camino</button>
                        )}
                        {ped.estado==="en_camino"&&(
                          <button onClick={()=>actualizarEstadoPedido(ped.id,"entregado")} style={{...s.btnGreen,flex:1,fontSize:11}}>✅ Marcar entregado</button>
                        )}
                      </div>
                    )}
                    <button onClick={()=>{const _t=(ped.cliente_telefono||"").replace(/\D/g,"");window.location.href="https://wa.me/"+_t+"?text="+encodeURIComponent("Hola "+ped.cliente_nombre+" 👋 Tu pedido *"+ped.ref+"* está "+estadoConfig.label);}} style={{...s.btnWa,marginTop:6,padding:"8px",fontSize:12}}>
                      📲 Escribir al cliente
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {adminSec==="proveedores_lista"&&(<div style={{margin:"0 16px"}}>
            <div style={s.pc}>
              <div style={s.pT}>🏪 Proveedores ({allProveedores.length})</div>
              <div style={s.cs}>{["Todas",...PROV_CATS].map(c=>(<button key={c} style={s.cb(catFilter===c)} onClick={()=>setCatFilter(c)}>{c}</button>))}</div>
              {filteredProvs.length===0&&<div style={{fontSize:13,color:"#94a3b8",padding:"10px 0"}}>No hay proveedores en esta categoría</div>}
              {filteredProvs.map(p=>(<div key={p.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  {p.logo_url?<img src={p.logo_url} alt="" style={{width:44,height:44,borderRadius:"50%",objectFit:"cover"}}/>:<div style={{width:44,height:44,borderRadius:"50%",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏪</div>}
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{p.negocio}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>@{p.usuario} · {p.telefono}</div>
                    {p.email&&<div style={{fontSize:11,color:"#94a3b8"}}>{p.email}</div>}
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{(p.categorias||[]).map(c=>(<span key={c} style={{fontSize:10,background:"#f1f5f9",color:"#64748b",padding:"1px 6px",borderRadius:8}}>{c}</span>))}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:8,background:p.en_pausa?"#fef3c7":"#dcfce7",color:p.en_pausa?"#92400e":"#15803d"}}>{p.en_pausa?"⏸️ Pausado":"✓ Activo"}</span>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  <button onClick={()=>togglePausa(p.id,p.en_pausa)} style={{...s.btnAmber,fontSize:11}}>{p.en_pausa?"▶️ Quitar pausa":"⏸️ Pausar"}</button>
                  <button onClick={()=>deleteProveedor(p.id)} style={{...s.btnRed,fontSize:11}}>🗑️ Eliminar</button>
                </div>
                <div style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:11,color:"#64748b",marginBottom:6,fontWeight:600}}>🔑 Resetear contraseña</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <input style={{...s.inp,marginBottom:0,flex:1,fontSize:12,padding:"7px 10px"}} type="text" placeholder="Nueva clave temporal..." value={resetPass[p.id]||""} onChange={e=>setResetPass({...resetPass,[p.id]:e.target.value})}/>
                    <button onClick={()=>{if(!resetPass[p.id])return;cambiarClave(p.id,resetPass[p.id]);}} style={{...s.btnGreen,fontSize:11,flexShrink:0,padding:"7px 12px"}}>✓ Guardar</button>
                  </div>
                  {resetPass[p.id]&&<div style={{fontSize:10,color:"#15803d",marginTop:4}}>⚠️ Comunica esta clave al proveedor por WhatsApp</div>}
                </div>
              </div>))}
            </div>
          </div>)}

          {adminSec==="pendientes"&&(<div style={{margin:"0 16px"}}>
            <div style={s.pc}>
              <div style={s.pT}>🍽️ Productos por aprobar ({pendProds.length})</div>
              {pendProds.length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No hay pendientes ✓</div>}
              {pendProds.map(p=>(<div key={p.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {p.foto_url?<img src={p.foto_url} alt="" style={{width:60,height:60,borderRadius:8,objectFit:"cover"}}/>:<div style={{width:60,height:60,borderRadius:8,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>📷</div>}
                  <div>
                    <div style={{fontSize:13,fontWeight:700}}>{p.nombre}</div>
                    {(p.marca||p.presentacion)&&<div style={{fontSize:11,color:"#94a3b8"}}>{[p.marca,p.presentacion].filter(Boolean).join(" · ")}</div>}
                    <div style={{fontSize:11,color:"#64748b"}}>${p.precio} · {p.proveedores?.negocio}</div>
                    {p.descripcion&&<div style={{fontSize:11,color:"#94a3b8"}}>{p.descripcion}</div>}
                  </div>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:6}}>
                  <button onClick={()=>approvePr(p.id)} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Aprobar</button>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <input style={{...s.inp,marginBottom:0,flex:1,fontSize:12,padding:"7px 10px"}} placeholder="Motivo del rechazo..." value={rejectMotivo[p.id]||""} onChange={e=>setRejectMotivo({...rejectMotivo,[p.id]:e.target.value})}/>
                  <button onClick={()=>rejectPr(p.id)} style={{...s.btnRed,fontSize:11,flexShrink:0}}>✗ Rechazar</button>
                </div>
              </div>))}
            </div>
          </div>)}

          {adminSec==="promos_pend"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>🎉 Promociones por aprobar ({pendPromos.length})</div>
                {pendPromos.filter(p=>!p.motivo_rechazo).length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No hay promociones pendientes ✓</div>}
                {pendPromos.filter(p=>!p.motivo_rechazo).map(p=>(
                  <div key={p.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    {p.foto_url
                      ?<img src={p.foto_url} alt="" style={{width:"100%",height:140,objectFit:"cover",borderRadius:10,marginBottom:8}}/>
                      :<div style={{background:"#fee2e2",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>⚠️</span><div style={{fontSize:12,color:"#be123c",fontWeight:600}}>Esta promoción NO tiene foto — se recomienda rechazar</div></div>
                    }
                    <div style={{fontSize:13,fontWeight:700}}>{p.nombre}</div>
                    <div style={{fontSize:11,color:"#64748b",margin:"2px 0"}}>{p.proveedores?.negocio} · ${p.precio}</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:4}}>{p.descripcion}</div>
                    <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>📅 {p.fecha_inicio} → {p.fecha_fin}</div>
                    <button onClick={async()=>{
                      setPendPromos(prev=>prev.filter(x=>x.id!==p.id));
                      const{error}=await supabase.from("promociones_proveedor").update({aprobada:true,activa:true,motivo_rechazo:null}).eq("id",p.id);
                      if(error){alert("Error al aprobar: "+error.message);await loadAdmin();return;}
                      loadAll();
                      await loadAdmin();
                    }} style={{...s.btnGreen,width:"100%",marginBottom:10,borderRadius:10,padding:"9px",fontSize:13}}>✓ Aprobar promoción</button>
                    <label style={s.lbl}>Motivo del rechazo * (obligatorio para rechazar)</label>
                    <div style={{display:"flex",gap:6}}>
                      <input style={{...s.inp,marginBottom:0,flex:1,fontSize:12,padding:"8px 10px"}} placeholder="Ej: Falta foto, descripción incompleta..." value={rejectMotivo[`promo_${p.id}`]||""} onChange={e=>setRejectMotivo({...rejectMotivo,[`promo_${p.id}`]:e.target.value})}/>
                      <button onClick={async()=>{
                        const motivo=rejectMotivo[`promo_${p.id}`]||"";
                        if(!motivo.trim())return alert("Escribe el motivo del rechazo antes de continuar");
                        setPendPromos(prev=>prev.filter(x=>x.id!==p.id));
                        setRejectMotivo(prev=>({...prev,[`promo_${p.id}`]:""}));
                        const{error}=await supabase.from("promociones_proveedor").update({aprobada:false,activa:false,motivo_rechazo:motivo}).eq("id",p.id);
                        if(error)alert("Error al rechazar: "+error.message);
                        await loadAdmin();
                      }} style={{...s.btnRed,fontSize:11,flexShrink:0}}>✗ Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSec==="resenas"&&(<div style={{margin:"0 16px"}}><div style={s.pc}><div style={s.pT}>Reseñas ({pendResenas.length})</div>{pendResenas.length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No hay pendientes ✓</div>}{pendResenas.map(r=>(<div key={r.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}><div style={{fontSize:13,fontWeight:600}}>{r.cliente_nombre}</div><div style={{color:"#f59e0b",fontSize:14}}>{"★".repeat(r.estrellas)}{"☆".repeat(5-r.estrellas)}</div><div style={{fontSize:12,color:"#64748b",margin:"4px 0"}}>{r.comentario}</div><div style={{display:"flex",gap:8}}><button onClick={()=>approveRe(r.id)} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Publicar</button><button onClick={()=>rejectRe(r.id)} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>✗ Eliminar</button></div></div>))}</div></div>)}

          {adminSec==="zonas"&&(<div style={{margin:"0 16px"}}><div style={s.pc}><div style={s.pT}>🗺️ Zonas</div>{allZonas.map(z=>(<div key={z.id} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}><div style={{fontWeight:600,color:P}}>{z.zona} <span style={{color:"#94a3b8"}}>({z.municipio})</span></div><div style={{color:"#64748b"}}>Delivery: ${z.costo_delivery} · Gratis super: ${z.delivery_gratis_super} · comida: ${z.delivery_gratis_comida}</div></div>))}<div style={{marginTop:14}}><input style={s.inp} placeholder="Nombre de zona" value={newZona.zona} onChange={e=>setNewZona({...newZona,zona:e.target.value})}/><input style={s.inp} placeholder="Municipio" value={newZona.municipio} onChange={e=>setNewZona({...newZona,municipio:e.target.value})}/><div style={{display:"flex",gap:8}}><div style={{flex:1}}><label style={s.lbl}>Delivery $</label><input style={s.inp} type="number" value={newZona.costo_delivery} onChange={e=>setNewZona({...newZona,costo_delivery:parseFloat(e.target.value)})}/></div><div style={{flex:1}}><label style={s.lbl}>Gratis super $</label><input style={s.inp} type="number" value={newZona.delivery_gratis_super} onChange={e=>setNewZona({...newZona,delivery_gratis_super:parseFloat(e.target.value)})}/></div></div><label style={s.lbl}>Gratis comida $</label><input style={s.inp} type="number" value={newZona.delivery_gratis_comida} onChange={e=>setNewZona({...newZona,delivery_gratis_comida:parseFloat(e.target.value)})}/><button style={s.btn} onClick={addZona}>Guardar zona</button></div></div></div>)}

          {adminSec==="combos"&&(<div style={{margin:"0 16px"}}><div style={s.pc}><div style={s.pT}>🎁 Combos</div>{combosAdmin.map(c=>(<div key={c.id} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}><div style={{fontWeight:600}}>{c.nombre} — ${c.precio}</div><div style={{color:"#64748b"}}>{c.temporada}</div></div>))}<div style={{marginTop:14}}><input style={s.inp} placeholder="Nombre" value={newCombo.nombre} onChange={e=>setNewCombo({...newCombo,nombre:e.target.value})}/><input style={s.inp} placeholder="Descripción" value={newCombo.descripcion} onChange={e=>setNewCombo({...newCombo,descripcion:e.target.value})}/><input style={s.inp} type="number" placeholder="Precio $" value={newCombo.precio} onChange={e=>setNewCombo({...newCombo,precio:e.target.value})}/><input style={s.inp} placeholder="Temporada" value={newCombo.temporada} onChange={e=>setNewCombo({...newCombo,temporada:e.target.value})}/><div style={{display:"flex",gap:8}}><div style={{flex:1}}><label style={s.lbl}>Desde</label><input style={s.inp} type="date" value={newCombo.fecha_inicio} onChange={e=>setNewCombo({...newCombo,fecha_inicio:e.target.value})}/></div><div style={{flex:1}}><label style={s.lbl}>Hasta</label><input style={s.inp} type="date" value={newCombo.fecha_fin} onChange={e=>setNewCombo({...newCombo,fecha_fin:e.target.value})}/></div></div><button style={s.btn} onClick={addCombo}>Publicar combo</button></div></div></div>)}

          {adminSec==="remates_pend"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>🏷️ Remates por aprobar ({pendRemates.length})</div>
                {pendRemates.length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No hay remates pendientes ✓</div>}
                {pendRemates.map(r=>(
                  <div key={r.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    {r.foto_url?<img src={r.foto_url} alt="" style={{width:"100%",height:130,objectFit:"cover",borderRadius:10,marginBottom:8}}/>:<div style={{background:"#f1f5f9",borderRadius:10,height:60,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:8}}>🏷️</div>}
                    <div style={{fontSize:13,fontWeight:700}}>{r.titulo}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{r.categoria} · ${r.precio}</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:4}}>{r.descripcion}</div>
                    <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>👤 {r.vendedor_nombre} · 📱 {r.vendedor_telefono}</div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={async()=>{setPendRemates(prev=>prev.filter(x=>x.id!==r.id));await supabase.from("remates").update({aprobado:true}).eq("id",r.id);loadRemates();await loadAdmin();}} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Aprobar</button>
                      <button onClick={()=>setConfirmModal({msg:"¿Rechazar este remate?",onOk:async()=>{setPendRemates(prev=>prev.filter(x=>x.id!==r.id));await supabase.from("remates").delete().eq("id",r.id);await loadAdmin();}})} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>✗ Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSec==="servicios_pend"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>🛠️ Servicios por aprobar ({pendServiciosCom.length})</div>
                {pendServiciosCom.length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No hay servicios pendientes ✓</div>}
                {pendServiciosCom.map(sv=>(
                  <div key={sv.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    {sv.foto_url&&<img src={sv.foto_url} alt="" style={{width:"100%",height:110,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                    <div style={{fontSize:13,fontWeight:700}}>{sv.nombre_servicio}</div>
                    <div style={{fontSize:11,color:"#7e22ce",fontWeight:600}}>{sv.categoria}</div>
                    <div style={{fontSize:11,color:"#64748b",margin:"2px 0 4px"}}>{sv.descripcion}</div>
                    {sv.precio_referencial&&<div style={{fontSize:11,color:"#15803d"}}>💰 {sv.precio_referencial}</div>}
                    {sv.zona&&<div style={{fontSize:11,color:"#94a3b8"}}>📍 {sv.zona}</div>}
                    <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>👤 {sv.proveedor_nombre} · 📱 {sv.proveedor_telefono}</div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={async()=>{setPendServiciosCom(prev=>prev.filter(x=>x.id!==sv.id));await supabase.from("servicios_comunidad").update({aprobado:true}).eq("id",sv.id);loadServiciosCom();await loadAdmin();}} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Aprobar</button>
                      <button onClick={()=>setConfirmModal({msg:"¿Rechazar este servicio?",onOk:async()=>{setPendServiciosCom(prev=>prev.filter(x=>x.id!==sv.id));await supabase.from("servicios_comunidad").delete().eq("id",sv.id);await loadAdmin();}})} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>✗ Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSec==="super"&&(<div style={{margin:"0 16px"}}><div style={s.pc}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={s.pT}>🛒 Supermercado ({superProds.length})</div>
                <button onClick={()=>setShowBulkImport(!showBulkImport)} style={{background:"#f59e0b",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {showBulkImport?"✕ Cerrar":"📥 Carga masiva CSV"}
                </button>
              </div>
              {showBulkImport&&(
                <div style={{background:"#f8fafc",borderRadius:12,padding:14,marginBottom:12,border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:8}}>📥 Importar productos desde CSV</div>
                  {/* DESCARGAR PLANTILLA */}
                  <button onClick={()=>{
                    const h="nombre,descripcion,precio,unidad,supercategoria,marca,stock,foto_url";const ex=["Pollo entero,Fresco del dia,8.50,kg,Proteinas,Granja Local,50,","Arroz cristal,Arroz blanco,2.00,kg,Granos y cereales,Cristal,100,","Aceite vegetal,Botella 1 litro,3.50,litro,Aceites y condimentos,Mazeite,80,"].join("\n");const csv=h+"\n"+ex;
                    const blob=new Blob([csv],{type:"text/csv"});
                    const url=URL.createObjectURL(blob);
                    const a=document.createElement("a");
                    a.href=url;a.download="plantilla_supermercado.csv";a.click();
                  }} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",width:"100%",marginBottom:10}}>
                    ⬇️ Descargar plantilla CSV
                  </button>
                  {/* SUBIR CSV */}
                  <label style={{display:"block",fontSize:12,color:"#64748b",marginBottom:6}}>Selecciona tu archivo CSV:</label>
                  <input type="file" accept=".csv,.txt" style={{width:"100%",marginBottom:8,fontSize:13}} onChange={e=>{
                    const file=e.target.files[0];
                    if(!file)return;
                    const reader=new FileReader();
                    reader.onload=ev=>processBulkCsv(ev.target.result);
                    reader.readAsText(file);
                  }}/>
                  {bulkMsg&&<div style={{fontSize:12,color:bulkMsg.includes("✅")?"#15803d":"#be123c",marginBottom:8,fontWeight:600}}>{bulkMsg}</div>}
                  {/* PREVIEW */}
                  {bulkData.length>0&&(
                    <div style={{maxHeight:200,overflowY:"auto",marginBottom:10}}>
                      <div style={{fontSize:11,color:"#64748b",marginBottom:4}}>Vista previa ({bulkData.length} productos):</div>
                      {bulkData.slice(0,5).map((p,i)=>(
                        <div key={i} style={{fontSize:11,padding:"4px 8px",background:"#fff",borderRadius:6,marginBottom:3,border:"1px solid #e2e8f0"}}>
                          <strong>{p.nombre}</strong> · ${p.precio} · {p.unidad} · {p.super_cat||p.categoria}
                        </div>
                      ))}
                      {bulkData.length>5&&<div style={{fontSize:11,color:"#94a3b8"}}>...y {bulkData.length-5} más</div>}
                    </div>
                  )}
                  {bulkData.length>0&&(
                    <button onClick={importBulkProducts} disabled={bulkLoading} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>
                      {bulkLoading?`Importando...`:`🚀 Importar ${bulkData.length} productos`}
                    </button>
                  )}
                  <div style={{fontSize:10,color:"#94a3b8",marginTop:8,lineHeight:1.4}}>
                    Columnas requeridas: nombre, precio · Opcionales: descripcion, unidad, supercategoria, marca, stock, foto_url
                  </div>
                </div>
              )}{superProds.map(p=>(
                <div key={p.id} style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"10px 12px",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    {p.foto_url?<img src={p.foto_url} alt="" style={{width:46,height:46,borderRadius:8,objectFit:"cover",flexShrink:0}}/>:<div style={{width:46,height:46,borderRadius:8,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{p.emoji||"🛒"}</div>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{p.nombre}</div>
                      <div style={{fontSize:11,color:"#64748b"}}>{p.categoria} · <span style={{fontWeight:700,color:"#15803d"}}>${p.precio}</span>/{p.unidad}</div>
                      <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:20,background:p.disponible===false?"#fee2e2":"#dcfce7",color:p.disponible===false?"#be123c":"#15803d"}}>{p.disponible===false?"⏸ Pausado":"● Activo"}</span>
                        {p.es_oferta&&<span style={{fontSize:9,background:"#fff7ed",color:"#c2410c",fontWeight:700,padding:"1px 7px",borderRadius:20}}>🏷️ En oferta</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={async()=>{await supabase.from("productos_supermercado").update({disponible:p.disponible===false}).eq("id",p.id);loadAll();}} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:p.disponible===false?"#dcfce7":"#fff7ed",color:p.disponible===false?"#15803d":"#c2410c"}}>{p.disponible===false?"▶️ Activar":"⏸️ Pausar"}</button>
                    <button onClick={async()=>{await supabase.from("productos_supermercado").update({es_oferta:!p.es_oferta}).eq("id",p.id);loadAll();}} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:p.es_oferta?"#fff7ed":"#f0fdf4",color:p.es_oferta?"#c2410c":"#15803d"}}>{p.es_oferta?"🏷️ Quitar oferta":"🏷️ Poner oferta"}</button>
                    <button onClick={()=>deleteSuperProd(`sp_${p.id}`)} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:"#fee2e2",color:"#be123c"}}>🗑️ Eliminar</button>
                    <button onClick={()=>{setEditingSPId(editingSPId===p.id?null:p.id);setEditSPData({nombre:p.nombre,marca:p.marca||"",presentacion:p.presentacion||"",descripcion:p.descripcion||"",precio:String(p.precio),unidad:p.unidad,emoji:p.emoji||"🛒",categoria:p.categoria,es_oferta:p.es_oferta||false});}} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:"#eff6ff",color:"#1d4ed8"}}>✏️ Modificar</button>
                  </div>
                  {editingSPId===p.id&&(
                    <div style={{marginTop:10,background:"#f8fafc",borderRadius:10,padding:"12px",border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>✏️ Modificar producto</div>
                      <div style={{display:"flex",gap:6,marginBottom:6}}><input style={{...s.inp,marginBottom:0,width:44}} placeholder="🛒" value={editSPData.emoji} onChange={e=>setEditSPData({...editSPData,emoji:e.target.value})}/><input style={{...s.inp,marginBottom:0,flex:1}} placeholder="Nombre *" value={editSPData.nombre} onChange={e=>setEditSPData({...editSPData,nombre:e.target.value})}/></div>
                      <div style={{display:"flex",gap:6,marginBottom:6}}><input style={{...s.inp,marginBottom:0,flex:1}} placeholder="Marca" value={editSPData.marca} onChange={e=>setEditSPData({...editSPData,marca:e.target.value})}/><input style={{...s.inp,marginBottom:0,flex:1}} placeholder="Presentación" value={editSPData.presentacion} onChange={e=>setEditSPData({...editSPData,presentacion:e.target.value})}/></div>
                      <div style={{display:"flex",gap:6,marginBottom:6}}><input style={{...s.inp,marginBottom:0,flex:1}} type="number" placeholder="Precio $" value={editSPData.precio} onChange={e=>setEditSPData({...editSPData,precio:e.target.value})}/><input style={{...s.inp,marginBottom:0,width:70}} placeholder="kg/L" value={editSPData.unidad} onChange={e=>setEditSPData({...editSPData,unidad:e.target.value})}/></div>
                      <select style={{...s.inp,background:"#fff",marginBottom:6}} value={editSPData.categoria} onChange={e=>setEditSPData({...editSPData,categoria:e.target.value})}>{SUPER_CATS.map(c=><option key={c}>{c}</option>)}</select>
                      <input style={{...s.inp,marginBottom:6}} placeholder="Descripción (opcional)" value={editSPData.descripcion} onChange={e=>setEditSPData({...editSPData,descripcion:e.target.value})}/>
                      <div onClick={()=>setEditSPData({...editSPData,es_oferta:!editSPData.es_oferta})} style={{display:"flex",alignItems:"center",gap:10,background:editSPData.es_oferta?"#fff7ed":"#f8fafc",border:`2px solid ${editSPData.es_oferta?"#f97316":"#e2e8f0"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",marginBottom:8}}>
                        <div style={{width:20,height:20,borderRadius:5,background:editSPData.es_oferta?"#f97316":"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{editSPData.es_oferta&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}</div>
                        <div style={{fontSize:12,fontWeight:700,color:editSPData.es_oferta?"#c2410c":"#374151"}}>🏷️ Mostrar en Ofertas del Supermercado</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={async()=>{if(!editSPData.nombre||!editSPData.precio)return;await supabase.from("productos_supermercado").update({nombre:editSPData.nombre,marca:editSPData.marca||null,presentacion:editSPData.presentacion||null,descripcion:editSPData.descripcion||null,precio:parseFloat(editSPData.precio),unidad:editSPData.unidad,emoji:editSPData.emoji,categoria:editSPData.categoria,es_oferta:editSPData.es_oferta}).eq("id",p.id);setEditingSPId(null);loadAll();}} style={{flex:1,padding:"8px",borderRadius:8,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",background:"#15803d",color:"#fff"}}>✅ Guardar</button>
                        <button onClick={()=>setEditingSPId(null)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:"#f1f5f9",color:"#64748b"}}>Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}<div style={{marginTop:14}}><label style={s.lbl}>Categoría *</label><select style={{...s.inp,background:"#fff"}} value={newSP.categoria} onChange={e=>setNewSP({...newSP,categoria:e.target.value})}>{SUPER_CATS.map(c=><option key={c}>{c}</option>)}</select><div style={{display:"flex",gap:8,marginBottom:8}}><input style={{...s.inp,marginBottom:0,width:50}} placeholder="🛒" value={newSP.emoji} onChange={e=>setNewSP({...newSP,emoji:e.target.value})}/><input style={{...s.inp,marginBottom:0,flex:1}} placeholder="Nombre *" value={newSP.nombre} onChange={e=>setNewSP({...newSP,nombre:e.target.value})}/></div><div style={{display:"flex",gap:8,marginBottom:8}}><input style={{...s.inp,marginBottom:0,flex:1}} placeholder="Marca" value={newSP.marca} onChange={e=>setNewSP({...newSP,marca:e.target.value})}/><input style={{...s.inp,marginBottom:0,flex:1}} placeholder="Presentación" value={newSP.presentacion} onChange={e=>setNewSP({...newSP,presentacion:e.target.value})}/></div><div style={{display:"flex",gap:8,marginBottom:8}}><input style={{...s.inp,marginBottom:0,flex:1}} type="number" placeholder="Precio $" value={newSP.precio} onChange={e=>setNewSP({...newSP,precio:e.target.value})}/><input style={{...s.inp,marginBottom:0,width:80}} placeholder="kg/L" value={newSP.unidad} onChange={e=>setNewSP({...newSP,unidad:e.target.value})}/></div><input style={s.inp} placeholder="Descripción (opcional)" value={newSP.descripcion} onChange={e=>setNewSP({...newSP,descripcion:e.target.value})}/><label style={s.lbl}>Foto</label>{spFotoPreview&&<img src={spFotoPreview} alt="" style={{width:"100%",height:100,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}<input type="file" accept="image/*" style={{marginBottom:10,fontSize:13}} onChange={e=>{const f=e.target.files[0];if(f){setSpFoto(f);setSpFotoPreview(URL.createObjectURL(f));}}}/><div style={{marginBottom:10}}>
  <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:6}}>¿Es una oferta o producto destacado?</div>
  <div onClick={()=>setNewSP({...newSP,es_oferta:!newSP.es_oferta})} style={{display:"flex",alignItems:"center",gap:12,background:newSP.es_oferta?"#fff7ed":"#f8fafc",border:`2px solid ${newSP.es_oferta?"#f97316":"#e2e8f0"}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"all 0.15s"}}>
    <div style={{width:22,height:22,borderRadius:6,background:newSP.es_oferta?"#f97316":"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      {newSP.es_oferta&&<span style={{color:"#fff",fontSize:14,fontWeight:900}}>✓</span>}
    </div>
    <div>
      <div style={{fontSize:13,fontWeight:700,color:newSP.es_oferta?"#c2410c":"#374151"}}>🏷️ Mostrar en "Ofertas del Supermercado"</div>
      <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{newSP.es_oferta?"Aparecerá destacado en la pantalla de inicio":"Activa para que aparezca en la sección de ofertas"}</div>
    </div>
  </div>
</div><button style={s.btn} onClick={addSuperProd} disabled={loading}>{loading?"Guardando...":"Agregar"}</button></div></div></div>)}

          {adminSec==="resenas_publicadas"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>✅ Reseñas publicadas ({allResenasAdmin.length})</div>
                {allResenasAdmin.length===0&&<div style={{fontSize:13,color:"#94a3b8",textAlign:"center",padding:"20px 0"}}>No hay reseñas publicadas aún</div>}
                {allResenasAdmin.map(r=>{
                  const now=new Date();const d=new Date(r.created_at);const diff=Math.floor((now.getTime()-d.getTime())/86400000);
                  const fecha=diff<=0?"Hoy":diff===1?"Ayer":diff<7?`Hace ${diff} días`:diff<30?`Hace ${Math.floor(diff/7)} sem.`:d.toLocaleDateString("es-VE",{month:"short",year:"numeric"});
                  return(
                    <div key={r.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{r.cliente_nombre}</div>
                          <div style={{fontSize:11,color:"#94a3b8"}}>{r.proveedor_nombre||r.proveedores?.negocio||"—"} · {fecha}</div>
                        </div>
                        <div style={{color:"#f59e0b",fontSize:14,flexShrink:0}}>{"★".repeat(r.estrellas)}{"☆".repeat(5-r.estrellas)}</div>
                      </div>
                      {r.comentario&&<div style={{fontSize:12,color:"#475569",marginBottom:8,lineHeight:1.4}}>{r.comentario}</div>}
                      <button onClick={()=>setConfirmModal({msg:"¿Eliminar esta reseña publicada?",onOk:async()=>{
                        await supabase.from("resenas").delete().eq("id",r.id);
                        setAllResenasAdmin(prev=>prev.filter(x=>x.id!==r.id));
                        setProvResenas(prev=>{const copy={...prev};Object.keys(copy).forEach(k=>{copy[k]=(copy[k]||[]).filter(x=>x.id!==r.id);});return copy;});
        setPromediosResenas(prev=>{const copy={...prev};if(r.proveedor_id){const lista=(provResenas[r.proveedor_id]||[]).filter(x=>x.id!==r.id);if(lista.length===0){const c={...copy};delete c[r.proveedor_id];return c;}const avg=(lista.reduce((a,x)=>a+x.estrellas,0)/lista.length).toFixed(1);return{...copy,[r.proveedor_id]:{avg,count:lista.length}};}return copy;});
                      }})} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>🗑️ Eliminar</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {adminSec==="habitaciones_pend"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>🛏️ Habitaciones pendientes ({pendHabitaciones.length})</div>
                {pendHabitaciones.length===0&&<div style={{fontSize:13,color:"#94a3b8",textAlign:"center",padding:"20px 0"}}>No hay habitaciones pendientes ✓</div>}
                {pendHabitaciones.map(hab=>(
                  <div key={hab.id} style={{borderBottom:"1px solid #f1f5f9",padding:"12px 0"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#0f766e",marginBottom:4}}>🏨 {hab.proveedores?.negocio||"(hotel)"}</div>
                    {hab.foto_url&&<img src={hab.foto_url} alt={hab.nombre} style={{width:"100%",maxHeight:140,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                    <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{hab.nombre}</div>
                    {hab.descripcion&&<div style={{fontSize:12,color:"#64748b",marginTop:3}}>{hab.descripcion}</div>}
                    <div style={{display:"flex",gap:10,marginTop:4,fontSize:12,color:"#475569"}}>
                      {hab.precio_noche&&<span>💰 ${hab.precio_noche}/noche</span>}
                      {hab.capacidad_personas&&<span>👥 {hab.capacidad_personas} personas</span>}
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={async()=>{setPendHabitaciones(prev=>prev.filter(x=>x.id!==hab.id));await supabase.from("habitaciones_hotel").update({aprobado:true}).eq("id",hab.id);await loadAdmin();}} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Aprobar</button>
                      <button onClick={()=>setConfirmModal({msg:"¿Rechazar y eliminar esta habitación?",onOk:async()=>{setPendHabitaciones(prev=>prev.filter(x=>x.id!==hab.id));await supabase.from("habitaciones_hotel").delete().eq("id",hab.id);await loadAdmin();}})} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>✗ Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSec==="turismo_pend"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>🌴 Servicios turísticos pendientes ({pendTurismo.length})</div>
                {pendTurismo.length===0&&<div style={{fontSize:13,color:"#94a3b8",textAlign:"center",padding:"20px 0"}}>No hay servicios turísticos pendientes ✓</div>}
                {pendTurismo.map(srv=>(
                  <div key={srv.id} style={{borderBottom:"1px solid #f1f5f9",padding:"12px 0"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#065f46",marginBottom:4}}>🌴 {srv.proveedores?.negocio||"(proveedor)"}</div>
                    {srv.foto_url&&<img src={srv.foto_url} alt={srv.nombre} style={{width:"100%",maxHeight:140,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                    <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{srv.nombre}</div>
                    {srv.descripcion&&<div style={{fontSize:12,color:"#64748b",marginTop:3}}>{srv.descripcion}</div>}
                    <div style={{display:"flex",gap:10,marginTop:4,fontSize:12,color:"#475569",flexWrap:"wrap"}}>
                      {srv.precio&&<span>💰 ${srv.precio}/persona</span>}
                      {srv.capacidad_personas&&<span>👥 máx {srv.capacidad_personas}p</span>}
                      {srv.incluye&&<span>✅ {srv.incluye}</span>}
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={async()=>{setPendTurismo(prev=>prev.filter(x=>x.id!==srv.id));await supabase.from("servicios_turismo").update({aprobado:true}).eq("id",srv.id);await loadAdmin();}} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Aprobar</button>
                      <button onClick={()=>setConfirmModal({msg:"¿Rechazar y eliminar este servicio turístico?",onOk:async()=>{setPendTurismo(prev=>prev.filter(x=>x.id!==srv.id));await supabase.from("servicios_turismo").delete().eq("id",srv.id);await loadAdmin();}})} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>✗ Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSec==="clasificados_pend"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>🚗 Clasificados por aprobar ({pendClasificados.length})</div>
                {pendClasificados.length===0&&<div style={{fontSize:13,color:"#94a3b8"}}>No hay clasificados pendientes ✓</div>}
                {pendClasificados.map(c=>(
                  <div key={c.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    {c.foto1_url&&<img src={c.foto1_url} alt="" style={{width:"100%",height:140,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                    <div style={{fontSize:11,color:"#7e22ce",fontWeight:700,marginBottom:2}}>{c.tipo}</div>
                    <div style={{fontSize:13,fontWeight:700}}>{c.titulo}</div>
                    <div style={{fontSize:12,color:"#22c55e",fontWeight:700}}>${parseFloat(c.precio).toLocaleString()}{c.negociable?" · Negociable":""}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,margin:"4px 0 6px"}}>
                      {c.marca&&<span style={{fontSize:11,background:"#f1f5f9",padding:"2px 7px",borderRadius:20}}>{c.marca}</span>}
                      {c.anio&&<span style={{fontSize:11,background:"#f1f5f9",padding:"2px 7px",borderRadius:20}}>{c.anio}</span>}
                      {c.kilometraje&&<span style={{fontSize:11,background:"#f1f5f9",padding:"2px 7px",borderRadius:20}}>{c.kilometraje}</span>}
                      {c.sector&&<span style={{fontSize:11,background:"#f1f5f9",padding:"2px 7px",borderRadius:20}}>📍 {c.sector}</span>}
                    </div>
                    {c.descripcion&&<div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>{c.descripcion}</div>}
                    <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>👤 {c.vendedor_nombre} · 📱 {c.vendedor_telefono}</div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={async()=>{setPendClasificados(prev=>prev.filter(x=>x.id!==c.id));await supabase.from("clasificados").update({aprobado:true}).eq("id",c.id);loadClasificados();await loadAdmin();}} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Aprobar</button>
                      <button onClick={()=>setConfirmModal({msg:"¿Rechazar este clasificado?",onOk:async()=>{setPendClasificados(prev=>prev.filter(x=>x.id!==c.id));await supabase.from("clasificados").delete().eq("id",c.id);await loadAdmin();}})} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>✗ Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSec==="clasificados_all"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>🚗 Todos los clasificados ({allClasificadosAdmin.length})</div>
                {/* Filtros */}
                <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                  {["pendientes","aprobados","caducados","vendidos","todos"].map(f=>{
                    const hoy=new Date().toISOString().split("T")[0];
                    const counts={
                      pendientes:allClasificadosAdmin.filter(c=>!c.aprobado&&!c.vendido).length,
                      aprobados:allClasificadosAdmin.filter(c=>c.aprobado&&!c.vendido&&c.fecha_caducidad>=hoy).length,
                      caducados:allClasificadosAdmin.filter(c=>c.fecha_caducidad&&c.fecha_caducidad<hoy).length,
                      vendidos:allClasificadosAdmin.filter(c=>c.vendido).length,
                      todos:allClasificadosAdmin.length,
                    };
                    return(
                      <button key={f} onClick={()=>setClasifAdminFiltro(f)} style={{padding:"5px 12px",borderRadius:20,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:clasifAdminFiltro===f?"#0f172a":"#f1f5f9",color:clasifAdminFiltro===f?"#fff":"#64748b"}}>
                        {f.charAt(0).toUpperCase()+f.slice(1)} ({counts[f]})
                      </button>
                    );
                  })}
                </div>
                {/* Lista */}
                {(()=>{
                  const hoy=new Date().toISOString().split("T")[0];
                  const lista=allClasificadosAdmin.filter(c=>{
                    if(clasifAdminFiltro==="pendientes")return !c.aprobado&&!c.vendido;
                    if(clasifAdminFiltro==="aprobados")return c.aprobado&&!c.vendido&&(!c.fecha_caducidad||c.fecha_caducidad>=hoy);
                    if(clasifAdminFiltro==="caducados")return c.fecha_caducidad&&c.fecha_caducidad<hoy;
                    if(clasifAdminFiltro==="vendidos")return c.vendido;
                    return true;
                  });
                  if(lista.length===0)return <div style={{fontSize:13,color:"#94a3b8",textAlign:"center",padding:"20px 0"}}>No hay clasificados en esta categoría</div>;
                  return lista.map(c=>(
                    <div key={c.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                      {editClasif===c.id?(
                        <div style={{background:"#f8fafc",borderRadius:12,padding:12,marginBottom:8}}>
                          <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:"#1d4ed8"}}>✏️ Editando clasificado</div>
                          <label style={s.lbl}>Título</label>
                          <input style={s.inp} value={c.titulo} onChange={e=>{setAllClasificadosAdmin(prev=>prev.map(x=>x.id===c.id?{...x,titulo:e.target.value}:x));}}/>
                          <label style={s.lbl}>Precio</label>
                          <input style={s.inp} type="number" value={c.precio} onChange={e=>{setAllClasificadosAdmin(prev=>prev.map(x=>x.id===c.id?{...x,precio:e.target.value}:x));}}/>
                          <label style={s.lbl}>Descripción</label>
                          <input style={s.inp} value={c.descripcion||""} onChange={e=>{setAllClasificadosAdmin(prev=>prev.map(x=>x.id===c.id?{...x,descripcion:e.target.value}:x));}}/>
                          <label style={s.lbl}>Vendedor</label>
                          <input style={s.inp} value={c.vendedor_nombre||""} onChange={e=>{setAllClasificadosAdmin(prev=>prev.map(x=>x.id===c.id?{...x,vendedor_nombre:e.target.value}:x));}}/>
                          <label style={s.lbl}>Teléfono</label>
                          <input style={s.inp} value={c.vendedor_telefono||""} onChange={e=>{setAllClasificadosAdmin(prev=>prev.map(x=>x.id===c.id?{...x,vendedor_telefono:e.target.value}:x));}}/>
                          <div style={{display:"flex",gap:8,marginTop:8}}>
                            <button onClick={async()=>{
                              await supabase.from("clasificados").update({titulo:c.titulo,precio:parseFloat(c.precio),descripcion:c.descripcion,vendedor_nombre:c.vendedor_nombre,vendedor_telefono:c.vendedor_telefono}).eq("id",c.id);
                              setEditClasif(null);loadAdmin();
                            }} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>💾 Guardar</button>
                            <button onClick={()=>setEditClasif(null)} style={{...s.apvBtn,background:"#f1f5f9",color:"#64748b"}}>Cancelar</button>
                          </div>
                        </div>
                      ):(
                        <>
                          {c.foto1_url&&<img src={c.foto1_url} alt="" style={{width:"100%",height:130,objectFit:"cover",borderRadius:10,marginBottom:8}}/>}
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                            <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:c.vendido?"#f1f5f9":c.aprobado&&(!c.fecha_caducidad||c.fecha_caducidad>=new Date().toISOString().split("T")[0])?"#dcfce7":c.fecha_caducidad&&c.fecha_caducidad<new Date().toISOString().split("T")[0]?"#fef9c3":"#fef2f2",color:c.vendido?"#64748b":c.aprobado&&(!c.fecha_caducidad||c.fecha_caducidad>=new Date().toISOString().split("T")[0])?"#15803d":c.fecha_caducidad&&c.fecha_caducidad<new Date().toISOString().split("T")[0]?"#854d0e":"#dc2626"}}>{c.vendido?"Vendido":c.aprobado&&(!c.fecha_caducidad||c.fecha_caducidad>=new Date().toISOString().split("T")[0])?"✓ Aprobado":c.fecha_caducidad&&c.fecha_caducidad<new Date().toISOString().split("T")[0]?"⏰ Caducado":"⏳ Pendiente"}</span>
                            <span style={{fontSize:10,color:"#94a3b8"}}>Caduca: {c.fecha_caducidad||"—"}</span>
                          </div>
                          <div style={{fontSize:11,color:"#7e22ce",fontWeight:700}}>{c.tipo}</div>
                          <div style={{fontSize:13,fontWeight:700}}>{c.titulo}</div>
                          <div style={{fontSize:12,color:"#22c55e",fontWeight:700}}>${parseFloat(c.precio||0).toLocaleString()}{c.negociable?" · Negociable":""}</div>
                          <div style={{fontSize:11,color:"#64748b",margin:"4px 0"}}>👤 {c.vendedor_nombre} · 📱 {c.vendedor_telefono}</div>
                          {c.descripcion&&<div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>{c.descripcion}</div>}
                          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                            {!c.aprobado&&!c.vendido&&<button onClick={async()=>{await supabase.from("clasificados").update({aprobado:true}).eq("id",c.id);loadAdmin();loadClasificados();}} style={{...s.apvBtn,background:"#22c55e",color:"#fff"}}>✓ Aprobar</button>}
                            {c.aprobado&&!c.vendido&&<button onClick={async()=>{await supabase.from("clasificados").update({aprobado:false}).eq("id",c.id);loadAdmin();loadClasificados();}} style={{...s.apvBtn,background:"#f59e0b",color:"#fff"}}>⏸ Suspender</button>}
                            {c.fecha_caducidad&&c.fecha_caducidad<new Date().toISOString().split("T")[0]&&<button onClick={async()=>{const nueva=new Date();nueva.setDate(nueva.getDate()+30);await supabase.from("clasificados").update({fecha_caducidad:nueva.toISOString().split("T")[0],aprobado:true}).eq("id",c.id);loadAdmin();loadClasificados();}} style={{...s.apvBtn,background:"#3b82f6",color:"#fff"}}>🔄 Renovar 30d</button>}
                            <button onClick={()=>setEditClasif(c.id)} style={{...s.apvBtn,background:"#6366f1",color:"#fff"}}>✏️ Editar</button>
                            <button onClick={()=>setConfirmModal({msg:"¿Eliminar este clasificado?",onOk:async()=>{await supabase.from("clasificados").delete().eq("id",c.id);loadAdmin();loadClasificados();}})} style={{...s.apvBtn,background:"#ef4444",color:"#fff"}}>🗑 Eliminar</button>
                          </div>
                        </>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {adminSec==="suscripciones"&&(
            <div style={{margin:"0 16px"}}>
              <div style={s.pc}>
                <div style={s.pT}>💳 Gestión de Suscripciones</div>
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                  <div style={s.statCard}><div style={{...s.statNum,fontSize:18,color:"#22c55e"}}>{suscripciones.filter(s=>s.suscripcion_activa&&s.suscripcion_pagada).length}</div><div style={s.statLbl}>Al día</div></div>
                  <div style={s.statCard}><div style={{...s.statNum,fontSize:18,color:"#f59e0b"}}>{suscripciones.filter(s=>s.meses_gratis_restantes>0).length}</div><div style={s.statLbl}>En período gratis</div></div>
                  <div style={s.statCard}><div style={{...s.statNum,fontSize:18,color:"#ef4444"}}>{suscripciones.filter(s=>!s.suscripcion_pagada&&s.meses_gratis_restantes===0).length}</div><div style={s.statLbl}>Vencidas</div></div>
                </div>
                <div style={{fontSize:12,color:"#22c55e",fontWeight:600,marginBottom:8}}>💰 Ingreso mensual potencial: ${(suscripciones.filter(s=>s.suscripcion_activa&&s.meses_gratis_restantes===0).reduce((acc,s)=>acc+(["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(s.tipo_negocio)?2.99:1.99),0)).toFixed(2)}/mes</div>
                {suscripciones.map(s=>(
                  <div key={s.id} style={{padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      {s.logo_url?<img src={s.logo_url} alt="" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}/>:<div style={{width:36,height:36,borderRadius:"50%",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center"}}>🏪</div>}
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700}}>{s.negocio}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>@{s.usuario} · {s.tipo_negocio||"Restaurante"}</div>
                        <div style={{fontSize:11,fontWeight:700,color:"#15803d",marginTop:2}}>
                          {["Restaurante / Cocina / Comida","Tienda / Negocio local"].includes(s.tipo_negocio)?"$2.99/mes":"$1.99/mes"}
                        </div>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8,
                        background:s.meses_gratis_restantes>0?"#fef9c3":s.suscripcion_pagada?"#dcfce7":"#fee2e2",
                        color:s.meses_gratis_restantes>0?"#854d0e":s.suscripcion_pagada?"#15803d":"#be123c"}}>
                        {s.meses_gratis_restantes>0?`🎁 ${s.meses_gratis_restantes}m gratis`:s.suscripcion_pagada?"✓ Pagada":"⚠️ Vencida"}
                      </span>
                    </div>
                    <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>
                      Vence: {s.suscripcion_vence?.slice(0,10)} · Estado: {s.suscripcion_activa?"Activo":"Suspendido"}
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {!s.suscripcion_pagada&&s.meses_gratis_restantes===0&&(
                        <button onClick={async()=>{
                          const nuevaFecha=new Date();nuevaFecha.setMonth(nuevaFecha.getMonth()+1);
                          await supabase.from("proveedores").update({suscripcion_pagada:true,suscripcion_activa:true,suscripcion_vence:nuevaFecha.toISOString().split("T")[0]}).eq("id",s.id);
                          loadSuscripciones();loadAll();
                        }} style={{...s.btnGreen,fontSize:11,borderRadius:8,padding:"6px 10px"}}>✓ Marcar pagada (+1 mes)</button>
                      )}
                      {s.suscripcion_activa&&s.meses_gratis_restantes===0&&s.suscripcion_pagada&&(
                        <button onClick={async()=>{await supabase.from("proveedores").update({suscripcion_pagada:false,suscripcion_activa:false}).eq("id",s.id);loadSuscripciones();loadAll();}} style={{...s.btnAmber,fontSize:11,borderRadius:8,padding:"6px 10px"}}>⏸️ Suspender</button>
                      )}
                      {!s.suscripcion_activa&&(
                        <button onClick={async()=>{await supabase.from("proveedores").update({suscripcion_activa:true,suscripcion_pagada:true}).eq("id",s.id);loadSuscripciones();loadAll();}} style={{...s.btnGreen,fontSize:11,borderRadius:8,padding:"6px 10px"}}>▶️ Reactivar</button>
                      )}
                      {s.meses_gratis_restantes>0&&(
                        <button onClick={async()=>{await supabase.from("proveedores").update({meses_gratis_restantes:s.meses_gratis_restantes-1,suscripcion_vence:new Date(new Date(s.suscripcion_vence)-30*24*60*60*1000).toISOString().split("T")[0]}).eq("id",s.id);loadSuscripciones();}} style={{...s.btnAmber,fontSize:11,borderRadius:8,padding:"6px 10px"}}>-1 mes gratis</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button style={{...s.btnG,margin:"8px 16px 16px"}} onClick={()=>{setProvModePersist("login");setPendProds([]);setPendResenas([]);setAllProveedores([]);setPedidos([]);}}>Cerrar sesión admin</button>
        </>)}
      </div>)}

      {/* FLOATING CART BUTTON — abre cartGlobal siempre */}
      {(()=>{
        const totalItems=Object.values(cart).reduce((a,i)=>a+i.qty,0)+Object.values(cartRest).reduce((a,i)=>a+i.qty,0)+Object.values(cartNegocio).reduce((a,i)=>a+i.qty,0);
        if(totalItems===0||["cartGlobal","checkout","resumen","success"].includes(sheet))return null;
        const gruposRest={};Object.values(cartRest).forEach(i=>{const k=i.kitchen||"Sin proveedor";if(!gruposRest[k])gruposRest[k]=true;});
        const gruposNeg=cartNegocioNombre?{[cartNegocioNombre]:true}:{};
        const totalProveedores=Object.keys(gruposRest).length+Object.keys(gruposNeg).length+(Object.values(cart).length>0?1:0);
        const totalVal=Object.values(cart).reduce((a,i)=>a+i.price*i.qty,0)+Object.values(cartRest).reduce((a,i)=>a+i.price*i.qty,0)+Object.values(cartNegocio).reduce((a,i)=>a+i.price*i.qty,0);
        return(
          <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:150,width:"calc(100% - 32px)",maxWidth:398}}>
            <button onClick={()=>setSheet("cartGlobal")} style={{...s.btn,margin:0,display:"flex",justifyContent:"space-between",alignItems:"center",background:P,boxShadow:"0 4px 16px rgba(22,163,74,0.4)"}}>
              <span>🛒 Ver carrito {totalProveedores>1?`(${totalProveedores} tiendas)`:""} · {totalItems} {totalItems===1?"item":"items"}</span>
              <span style={{fontWeight:900}}>${totalVal.toFixed(2)}</span>
            </button>
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════ */}
      {/* SHEET CARRITO GLOBAL — TODOS LOS PROVEEDORES   */}
      {/* ═══════════════════════════════════════════════ */}
      {sheet==="cartGlobal"&&(()=>{
        // Construir grupos desde todos los carritos
        const grupos={};
        // — Supermercado (cart)
        const superItems=Object.values(cart);
        if(superItems.length>0){
          grupos["__super__"]={nombre:"Supermercado",tipo:"super",wa:null,items:superItems,delivery:true,costo:zonaSel?.costo_delivery||2,gratis:parseFloat(process?.env?.NEXT_PUBLIC_FREE_MIN||20),retiro:false};
        }
        // — Feria de comida (cartRest)
        Object.values(cartRest).forEach(i=>{
          const k=i.kitchen||"Sin proveedor";
          if(!grupos[k])grupos[k]={nombre:k,tipo:"rest",wa:i.kitchenWa||"",items:[],delivery:i.kitchenDelivery,costo:i.kitchenDeliveryCosto||0,gratis:i.kitchenDeliveryGratis||15,retiro:i.kitchenRetiro};
          grupos[k].items.push(i);
        });
        // — Negocio local (cartNegocio)
        const negItems=Object.values(cartNegocio);
        if(negItems.length>0&&cartNegocioNombre){
          grupos[cartNegocioNombre]={nombre:cartNegocioNombre,tipo:"negocio",wa:cartNegocioWa||"",items:negItems,delivery:negocioActivo?.delivery_propio,costo:parseFloat(negocioActivo?.delivery_costo||0),gratis:parseFloat(negocioActivo?.delivery_gratis_desde||15),retiro:negocioActivo?.permite_retiro};
        }
        const proveedores=Object.values(grupos);
        const esMultiple=proveedores.length>1;
        const datosOk=form.nombre&&form.telefono;
        const dirCliente=[zonaSel?.zona,addr.calle,addr.referencia].filter(Boolean).join(", ");
        if(proveedores.length===0&&clienteHistorial.length===0)return null;
        const enviarProveedor=async(prov,numPed)=>{
          if(!datosOk){setPmsg("Completa tu nombre y teléfono antes de enviar");return;}
          if(prov.tipo==="super"){
            // Supermercado: guardar y enviar por WhatsApp al número admin
            if(!zonaSel){setPmsg("Selecciona tu zona de entrega primero");return;}
            const sub=prov.items.reduce((a,i)=>a+i.price*i.qty,0);
            const delCosto=zonaSel?.costo_delivery||2;
            const freeMin=zonaSel?.delivery_gratis_super||18;
            const consultarDel=delCosto===-1;
            const del=consultarDel?0:(sub>=freeMin?0:delCosto);
            const totalS=sub+del;
            const ref=`PED-${Date.now().toString().slice(-6)}`;
            // Guardar en DB con función dedicada que recibe parámetros correctos
            await guardarPedidoSuperDB(prov.items,sub,del,totalS,ref);
            const lineas=prov.items.map(i=>`• ${i.name} x${i.qty} — $${(i.price*i.qty).toFixed(2)}`).join("\n");
            const delTexto=consultarDel?"a consultar seg\u00fan su zona":(del===0?"GRATIS \u{1F389}":"$"+del.toFixed(2));
            const totalTexto=consultarDel?`Subtotal: $${sub.toFixed(2)} (+ delivery a consultar)`:`*TOTAL: $${totalS.toFixed(2)}*`;
            const msg=`\u{1F6D2} *Pedido Supermercado — ${APP_NAME}*\n\u{1F4CB} Ref: ${ref}\n\n${lineas}\n\nSubtotal: $${sub.toFixed(2)}\nDelivery: ${delTexto}\n${totalTexto}\n\n\u{1F464} ${form.nombre}\n\u{1F4F1} ${form.telefono}\n\u{1F4CD} ${zonaSel?.zona||""}, ${addr.calle||""}\n\u{1F5FA}\u{FE0F} ${addr.referencia||""}`;
            const num=WA;
            abrirWhatsApp(num,msg);
            setCart({});
            setPedidoEnviadoA("Supermercado");
            return;
          }
          if(!prov.wa){alert(`${prov.nombre} no tiene WhatsApp configurado.`);return;}
          const sub=prov.items.reduce((a,i)=>a+i.price*i.qty,0);
          const del=prov.delivery?(sub>=prov.gratis?0:prov.costo):0;
          const total=sub+del;
          const aceptaPromo=!!consentPromo[prov.nombre];
          const msg=buildGlobalWaMsg(prov.nombre,prov.items,total,del,numPed,form.nombre,form.telefono,dirCliente);
          const num=normalizarNumeroWA(prov.wa);
          const ref=`PED-${Date.now().toString().slice(-6)}`;
          // Guardar en DB
          if(prov.tipo==="rest"){
            const restObj=allRestaurantes?.find(r=>r.negocio===prov.nombre);
            await guardarPedidoRestaurante(restObj?.id||null,prov.items,sub,del,total,ref,aceptaPromo,prov.nombre);
            const nuevoCart={...cartRest};prov.items.forEach(i=>delete nuevoCart[i.id]);setCartRest(nuevoCart);
          } else if(prov.tipo==="negocio"){
            await guardarPedidoRestaurante(cartNegocioId,prov.items,sub,del,total,ref,false,prov.nombre);
            setCartNegocio({});
          }
          setPedidoEnviadoA(prov.nombre);
          abrirWhatsApp(num,msg);
        };
        // Numeración secuencial por sesión
        return(
          <div style={s.ov} onClick={()=>setSheet(null)}>
            <div style={s.sh} onClick={e=>e.stopPropagation()}>
              <div style={s.hnd}/>
              {/* CONFIRMACIÓN POST-ENVÍO */}
              {pedidoEnviadoA&&(
                <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:12,padding:"12px 14px",marginBottom:14,textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#15803d",marginBottom:4}}>✅ Pedido enviado a {pedidoEnviadoA}</div>
                  {proveedores.filter(p=>p.nombre!==pedidoEnviadoA&&p.items.length>0).length>0&&(
                    <div style={{fontSize:12,color:"#64748b",marginTop:4}}>¿Deseas enviar el pedido a otro proveedor?</div>
                  )}
                  <button style={{marginTop:8,fontSize:11,color:"#64748b",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPedidoEnviadoA(null)}>Cerrar aviso</button>
                </div>
              )}
              {/* TÍTULO */}
              <div style={{fontSize:17,fontWeight:800,color:"#0f172a",marginBottom:4}}>
                {esMultiple?`🛒 Tu carrito — ${proveedores.length} tiendas`:"🛒 Tu pedido"}
              </div>
              {pmsg&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"9px 12px",marginBottom:10,fontSize:13,color:"#dc2626",fontWeight:600}}>{pmsg}</div>}
              {esMultiple&&(
                <div style={{fontSize:12,color:"#64748b",background:"#f8fafc",borderRadius:10,padding:"8px 12px",marginBottom:12,lineHeight:1.5}}>
                  Cada tienda recibirá su pedido de forma independiente.
                </div>
              )}
              {/* DATOS DEL CLIENTE */}
              <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:"#15803d",marginBottom:8}}>👤 Tus datos de contacto</div>
                <input style={{...s.inp,marginBottom:8}} placeholder="Nombre y apellido *" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
                <input style={{...s.inp,marginBottom:8}} placeholder="Tu WhatsApp * (Ej: 04XX-XXXXXXX)" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/>
                <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>📍 Zona de entrega</div>
                <select style={{...s.inp,marginBottom:8,background:"#fff",color:zonaSelId?"#0f172a":"#94a3b8"}} value={zonaSelId} onChange={e=>{setZonaSelId(e.target.value);setZonaSel(zonas.find(z=>z.id===e.target.value)||null);}}>
                  <option value="">Selecciona tu zona / barrio...</option>
                  {zonas.map(z=><option key={z.id} value={z.id}>{z.zona}{z.municipio&&z.municipio!=="San Fernando"?` — ${z.municipio}`:""}</option>)}
                </select>
                <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>🏠 Dirección exacta</div>
                <input style={{...s.inp,marginBottom:6}} placeholder="Calle, carrera, av. y número" value={addr.calle} onChange={e=>setAddr({...addr,calle:e.target.value})}/>
                <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>🗺️ Punto de referencia</div>
                <input style={{...s.inp,marginBottom:0}} placeholder="Ej: Casa azul, frente al CANTV..." value={addr.referencia} onChange={e=>setAddr({...addr,referencia:e.target.value})}/>
                {!datosOk&&<div style={{fontSize:11,color:"#dc2626",marginTop:6}}>⚠️ Nombre y teléfono son obligatorios</div>}
              </div>
              {/* BLOQUES POR PROVEEDOR */}
              {proveedores.map((prov,idx)=>{
                if(prov.items.length===0)return null;
                const sub=prov.items.reduce((a,i)=>a+i.price*i.qty,0);
                // Para supermercado usar datos de zona seleccionada
                const delCostoReal=prov.tipo==="super"?(zonaSel?.costo_delivery||2):prov.costo;
                const freeMinReal=prov.tipo==="super"?(zonaSel?.delivery_gratis_super||18):prov.gratis;
                // costo_delivery === -1 significa "a consultar según zona"
                const consultarDel=delCostoReal===-1;
                const del=consultarDel?-1:(prov.delivery?(sub>=freeMinReal?0:delCostoReal):0);
                const total=consultarDel?sub:(sub+del);
                const falta=(!consultarDel&&prov.delivery&&del>0)?parseFloat((freeMinReal-sub).toFixed(2)):0;
                const numPed=idx+1;
                const yaEnviado=pedidoEnviadoA===prov.nombre;
                return(
                  <div key={prov.nombre} style={{background:yaEnviado?"#f0fdf4":"#fff",border:`1.5px solid ${yaEnviado?"#86efac":"#e2e8f0"}`,borderRadius:14,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",opacity:yaEnviado?0.7:1}}>
                    {/* Header */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:getAvatarColor(prov.nombre),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:15,flexShrink:0}}>
                        {prov.nombre[0]?.toUpperCase()}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,fontSize:14,color:"#0f172a"}}>{prov.nombre}</div>
                        <div style={{fontSize:10,color:"#64748b"}}>
                          {prov.tipo==="super"?"🛒 Supermercado":prov.delivery?"🛵 Delivery":prov.retiro?"🏃 Retiro":"📦 Consultar"}
                          {prov.eta&&<span style={{marginLeft:4,background:"#fef3c7",color:"#92400e",padding:"1px 6px",borderRadius:6,fontSize:10,fontWeight:700}}>⏱️ {prov.eta}</span>}
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:900,fontSize:15,color:"#ef4444"}}>${total.toFixed(2)}</div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>Pedido #{String(numPed).padStart(3,"0")}</div>
                      </div>
                    </div>
                    {/* Items */}
                    {prov.items.map(i=>(
                      <div key={i.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid #f8fafc"}}>
                        <span style={{fontSize:i.isPromo?11:16,background:i.isPromo?"#fdf4ff":undefined,color:i.isPromo?"#7e22ce":undefined,padding:i.isPromo?"2px 6px":undefined,borderRadius:i.isPromo?7:undefined,fontWeight:i.isPromo?700:undefined,flexShrink:0}}>
                          {i.isPromo?"🔥 PROMO":i.emoji||"🛍️"}
                        </span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{i.name}</div>
                          {i.nota&&<div style={{fontSize:10,color:"#7e22ce"}}>📝 {i.nota}</div>}
                        </div>
                        <div style={s.qR}>
                          <button style={s.qB} onClick={()=>{
                            if(prov.tipo==="rest"){const n={...cartRest};n[i.id].qty>1?n[i.id]={...n[i.id],qty:n[i.id].qty-1}:delete n[i.id];setCartRest(n);}
                            else if(prov.tipo==="negocio"){const n={...cartNegocio};n[i.id].qty>1?n[i.id]={...n[i.id],qty:n[i.id].qty-1}:delete n[i.id];setCartNegocio(n);}
                            else{rem(i.id);}
                          }}>−</button>
                          <span style={s.qN}>{i.qty}</span>
                          <button style={s.qB} onClick={()=>{
                            if(prov.tipo==="rest")setCartRest(c=>({...c,[i.id]:{...c[i.id],qty:c[i.id].qty+1}}));
                            else if(prov.tipo==="negocio")setCartNegocio(c=>({...c,[i.id]:{...c[i.id],qty:c[i.id].qty+1}}));
                            else add(i);
                          }}>+</button>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:P,minWidth:46,textAlign:"right"}}>${(i.price*i.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Delivery gratis */}
                    {prov.delivery&&prov.tipo!=="super"&&(
                      <div style={{marginTop:8,padding:"6px 10px",borderRadius:8,background:del===0?"#f0fdf4":"#fffbeb",border:`1px solid ${del===0?"#bbf7d0":"#fde68a"}`}}>
                        {del===0
                          ?<span style={{fontSize:12,fontWeight:700,color:"#15803d"}}>🚚 Delivery gratis</span>
                          :<span style={{fontSize:12,color:"#92400e"}}>🟡 Te faltan <strong>${falta.toFixed(2)}</strong> para delivery gratis</span>
                        }
                      </div>
                    )}
                    {/* Total fila */}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"1px solid #f1f5f9",fontSize:12}}>
                      <span style={{color:"#64748b"}}>{consultarDel?"Delivery: a consultar":(del===0?(prov.delivery?"Delivery incluido":"Sin delivery"):`Delivery: $${del.toFixed(2)}`)}</span>
                      <span style={{fontWeight:800,color:"#0f172a",fontSize:14}}>{consultarDel?"Subtotal: ":"Total: "}<span style={{color:"#ef4444"}}>${total.toFixed(2)}</span></span>
                    </div>
                    {/* Consentimiento promos — solo para comida y negocios */}
                    {prov.tipo!=="super"&&(
                      <div style={{marginTop:10,padding:"8px 12px",background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0"}}>
                        <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}>
                          <input type="checkbox" checked={!!consentPromo[prov.nombre]} onChange={e=>setConsentPromo(c=>({...c,[prov.nombre]:e.target.checked}))} style={{marginTop:2,width:16,height:16,accentColor:"#25D366",flexShrink:0,cursor:"pointer"}}/>
                          <div style={{fontSize:11,color:"#0f172a",lineHeight:1.4}}>
                            ¿Recibir promociones de <strong>{prov.nombre}</strong>?
                            <span style={{color:"#64748b",display:"block",fontSize:10,marginTop:1}}>Responde BAJA para cancelar en cualquier momento.</span>
                          </div>
                        </label>
                      </div>
                    )}
                    {/* Botón enviar */}
                    {yaEnviado
                      ?<div style={{textAlign:"center",padding:"10px 0",fontSize:13,fontWeight:700,color:"#15803d"}}>✅ Pedido enviado</div>
                      :prov.tipo==="super"
                        ?<>
                          {!zonaSel&&<div style={{fontSize:11,color:"#c2410c",background:"#fff7ed",borderRadius:8,padding:"6px 10px",marginTop:8}}>⚠️ Selecciona tu zona de entrega arriba para continuar</div>}
                          <button
                            style={{width:"100%",background:datosOk&&zonaSel?"#f59e0b":"#94a3b8",color:datosOk&&zonaSel?"#0f172a":"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:13,fontWeight:800,cursor:datosOk&&zonaSel?"pointer":"not-allowed",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}
                            onClick={()=>{if(!datosOk){setPmsg("⚠️ Completa tu nombre y teléfono antes de enviar el pedido");return;}if(!zonaSel){setPmsg("⚠️ Selecciona tu zona de entrega para continuar");return;}enviarProveedor(prov,numPed);}}>
                            📲 Enviar pedido al Supermercado
                          </button>
                        </>
                        :!prov.wa
                          ?<div style={{...s.msg(false),marginTop:8}}>⚠️ {prov.nombre} no tiene WhatsApp configurado</div>
                          :<button style={{width:"100%",background:datosOk?"#25D366":"#94a3b8",color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:13,fontWeight:800,cursor:datosOk?"pointer":"not-allowed",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>{if(!datosOk){setPmsg("⚠️ Completa tu nombre y teléfono antes de enviar el pedido");return;}enviarProveedor(prov,numPed);}}>
                            📲 Pedir a {prov.nombre}
                          </button>
                    }
                  </div>
                );
              })}
              {esMultiple&&(
                <div style={{fontSize:11,color:"#94a3b8",textAlign:"center",padding:"4px 0 8px",lineHeight:1.5}}>
                  Cada proveedor recibe <strong>solo su pedido</strong>. Envíalos en el orden que quieras.
                </div>
              )}
              {/* HISTORIAL DE PEDIDOS DEL CLIENTE */}
              {form.telefono&&clienteHistorial.length>0&&(
                <div style={{marginTop:8,borderTop:"1px solid #f1f5f9",paddingTop:12}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#0f172a",marginBottom:10}}>🕐 Mis pedidos anteriores</div>
                  {clienteHistorial.slice(0,5).map(ped=>{
                    const est={
                      nuevo:{icon:"🆕",label:"Nuevo",bg:"#eff6ff",color:"#1d4ed8"},
                      recibido:{icon:"📥",label:"Recibido",bg:"#fef3c7",color:"#92400e"},
                      esperando_pago:{icon:"💳",label:"Pend. pago",bg:"#fff7ed",color:"#c2410c"},
                      preparando:{icon:"👨‍🍳",label:"Preparando",bg:"#fdf4ff",color:"#7e22ce"},
                      en_camino:{icon:"🚀",label:"En camino",bg:"#e0f2fe",color:"#0369a1"},
                      enviado:{icon:"🚀",label:"Enviado",bg:"#e0f2fe",color:"#0369a1"},
                      entregado:{icon:"✅",label:"Entregado",bg:"#dcfce7",color:"#15803d"},
                      cancelado:{icon:"❌",label:"Cancelado",bg:"#fee2e2",color:"#dc2626"},
                    }[ped.estado||"nuevo"]||{icon:"🆕",label:"Nuevo",bg:"#eff6ff",color:"#1d4ed8"};
                    return(
                      <div key={ped.id} style={{background:"#f8fafc",borderRadius:12,padding:"10px 12px",marginBottom:8,border:"1px solid #e2e8f0"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>{ped.proveedor_nombre||"Pedido"}</div>
                          <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:est.bg,color:est.color}}>{est.icon} {est.label}</span>
                        </div>
                        <div style={{fontSize:10,color:"#94a3b8",marginBottom:4}}>{ped.ref}</div>
                        <div style={{fontSize:11,color:"#64748b",marginBottom:6}}>
                          {(ped.items||[]).map(i=>`${i.nombre} x${i.qty||1}`).join(" · ")}
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:12,fontWeight:700,color:"#22c55e"}}>${(ped.total||0).toFixed(2)}</span>
                          <button onClick={()=>{
                            // Reagregar items al carrito según tipo
                            (ped.items||[]).forEach(it=>{
                              if(it.isPromo){
                                setCartRest(c=>({...c,[`promo_hist_${it.nombre}`]:{id:`promo_hist_${it.nombre}`,name:it.nombre,price:it.precio||0,qty:it.qty||1,kitchen:ped.proveedor_nombre,kitchenWa:"",isPromo:true,emoji:"🔥"}}));
                              } else {
                                setCartRest(c=>({...c,[`hist_${it.nombre}`]:{id:`hist_${it.nombre}`,name:it.nombre,price:it.precio||0,qty:it.qty||1,kitchen:ped.proveedor_nombre,kitchenWa:"",emoji:"🍽️"}}));
                              }
                            });
                            setPmsg("✅ Productos reagregados al carrito");
                          }} style={{fontSize:11,background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0",borderRadius:8,padding:"5px 10px",fontWeight:700,cursor:"pointer"}}>
                            🔄 Volver a pedir
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <button style={s.btnG} onClick={()=>setSheet(null)}>← Seguir comprando</button>
            </div>
          </div>
        );
      })()}

      {/* SHEET CARRITO NEGOCIO LOCAL */}
      {sheet==="cartNegocio"&&null}{false&&sheet==="cartNegocio_disabled"&&(<div style={s.ov} onClick={()=>setSheet(null)}><div style={s.sh} onClick={e=>e.stopPropagation()}>
        <div style={s.hnd}/>
        <div style={s.shT}>Pedido — {cartNegocioNombre}</div>
        <div style={s.ib}>
          <label style={s.lbl}>Zona de entrega</label>
          <select style={{...s.inp,marginBottom:8,background:"#fff"}} value={zonaSelId} onChange={e=>{setZonaSelId(e.target.value);setZonaSel(zonas.find(z=>z.id===e.target.value)||null);}}>
            <option value="">Selecciona tu zona...</option>
            {zonas.map(z=><option key={z.id} value={z.id}>{z.municipio} — {z.zona}</option>)}
          </select>
          <label style={s.lbl}>Calle y referencia</label>
          <input style={{...s.inp,marginBottom:0}} placeholder="Calle Principal #47..." value={addr.calle} onChange={e=>setAddr({...addr,calle:e.target.value})}/>
        </div>
        {Object.values(cartNegocio).map(i=>(<div key={i.id} style={s.ci}><span style={{fontSize:22,width:32,textAlign:"center"}}>🛍️</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{i.name}</div>{i.marca&&<div style={{fontSize:10,color:"#94a3b8"}}>{i.marca}</div>}</div><div style={s.qR}><button style={s.qB} onClick={()=>{const n={...cartNegocio};n[i.id].qty>1?n[i.id]={...n[i.id],qty:n[i.id].qty-1}:delete n[i.id];setCartNegocio(n);}}>-</button><span style={s.qN}>{i.qty}</span><button style={s.qB} onClick={()=>setCartNegocio(c=>({...c,[i.id]:{...c[i.id],qty:c[i.id].qty+1}}))}>+</button></div><div style={{fontSize:13,fontWeight:700,color:P,marginLeft:8}}>${(i.price*i.qty).toFixed(2)}</div></div>))}
        {(()=>{
          const negItems=Object.values(cartNegocio);
          const negSub=negItems.reduce((a,i)=>a+i.price*i.qty,0);
          const negTieneDelivery=negocioActivo?.delivery_propio;
          const negCostoDelivery=parseFloat(negocioActivo?.delivery_costo||0);
          const negGratisDesde=parseFloat(negocioActivo?.delivery_gratis_desde||15);
          const negDelGratis=negSub>=negGratisDesde;
          const negDel=negTieneDelivery?(negDelGratis?0:negCostoDelivery):0;
          const negFaltaParaGratis=negTieneDelivery&&!negDelGratis?(negGratisDesde-negSub):0;
          const negTotal=negSub+negDel;
          const negRef=`NEG-${Date.now().toString().slice(-5)}`;
          const negWaRaw=(cartNegocioWa||"").replace(/\D/g,"");const negWaNum=negWaRaw.startsWith("0")?"58"+negWaRaw.slice(1):negWaRaw.startsWith("58")?negWaRaw:"58"+negWaRaw;
          return(<>
            <div style={{marginTop:10}}>
              <div style={s.sr}><span style={s.sL}>Subtotal</span><span style={s.sV}>${negSub.toFixed(2)}</span></div>
              <div style={s.sr}>
                <span style={s.sL}>Delivery</span>
                {!negTieneDelivery
                  ?<span style={{fontSize:12,color:"#64748b"}}>🏃 Solo retiro</span>
                  :negDelGratis
                  ?<span style={{fontSize:13,fontWeight:800,color:"#15803d"}}>🚚 GRATIS</span>
                  :<span style={s.sV}>${negDel.toFixed(2)}</span>
                }
              </div>
              {negFaltaParaGratis>0&&(
                <div style={{background:"#f0fdf4",borderRadius:8,padding:"6px 10px",fontSize:11,color:"#15803d",fontWeight:600,marginTop:4}}>
                  🎁 Agrega <strong>${negFaltaParaGratis.toFixed(2)}</strong> más y el delivery es GRATIS
                </div>
              )}
              <div style={s.tR}><span style={{fontWeight:700}}>Total</span><span style={{fontWeight:700,fontSize:17}}>${negTotal.toFixed(2)}</span></div>
            </div>
            <label style={{...s.lbl,marginTop:10}}>Tu nombre *</label>
            <input style={s.inp} placeholder="Juan Pérez" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
            <label style={s.lbl}>Tu WhatsApp *</label>
            <input style={s.inp} placeholder="+58 424-000-0000" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/>
            {negocioActivo&&!estaAbiertoAhora(negocioActivo.horario_desde,negocioActivo.horario_hasta,negocioActivo.activo,negocioActivo.en_pausa,negocioActivo.forzar_abierto)&&(
              <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"8px 12px",marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:700,color:"#c2410c"}}>🔴 Esta tienda está cerrada ahora</div>
                <div style={{fontSize:11,color:"#92400e",marginTop:2}}>Tu pedido será enviado y atendido cuando abran. ¡Gracias por tu preferencia!</div>
              </div>
            )}
            <div style={{...s.ib,background:"#fffbeb"}}><div style={{fontSize:12,color:"#92400e"}}>⚡ Tu pedido irá directo al WhatsApp de {cartNegocioNombre}</div></div>
            <button style={s.btnWa} onClick={async()=>{
              if(!form.nombre||!form.telefono){setPmsg("Completa tu nombre y teléfono para continuar");return;}
              if(!negWaNum)return alert("Este negocio no tiene WhatsApp configurado. Contacta al administrador.");
              const deliveryTexto=!negTieneDelivery?"Solo retiro en tienda":negDelGratis?"GRATIS 🎉":"$"+negDel.toFixed(2);
              const msg=`🏪 *Nuevo pedido - ${APP_NAME}*\n📋 Ref: ${negRef}\n----------------------------\n${negItems.map(i=>`• ${i.name} x${i.qty} — $${(i.price*i.qty).toFixed(2)}`).join("\n")}\n----------------------------\nSubtotal: $${negSub.toFixed(2)}\nDelivery: ${deliveryTexto}\n*TOTAL: $${negTotal.toFixed(2)}*\n----------------------------\n👤 ${form.nombre}\n📱 ${form.telefono}\n📍 ${zonaSel?.zona||"San Fernando"}, ${addr.calle||"(sin dirección)"}`;
              window.location.href=`https://wa.me/${negWaNum}?text=${encodeURIComponent(msg)}`;
              guardarPedidoRestaurante(cartNegocioId,negItems,negSub,negDel,negTotal,negRef);
              setCartNegocio({});setSheet(null);
            }}>📲 Enviar pedido a {cartNegocioNombre}</button>
            <button style={s.btnG} onClick={()=>setSheet(null)}>← Seguir viendo</button>
          </>);
        })()}
      </div></div>)}

      {/* SHEET CARRITO RESTAURANTE — MULTI-PROVEEDOR v2 */}
      {sheet==="cartRest"&&null}{false&&sheet==="cartRest_disabled"&&(()=>{
        const allRestItems=Object.values(cartRest);
        if(allRestItems.length===0)return null;
        // Agrupar por proveedor
        const grupos={};
        allRestItems.forEach(i=>{
          const k=i.kitchen||"Sin proveedor";
          if(!grupos[k])grupos[k]={nombre:k,wa:i.kitchenWa||"",items:[],delivery:i.kitchenDelivery,costo:i.kitchenDeliveryCosto||0,gratis:i.kitchenDeliveryGratis||15,retiro:i.kitchenRetiro,eta:i.kitchenEta||null};
          grupos[k].items.push(i);
        });
        const proveedores=Object.values(grupos);
        const esMultiple=proveedores.length>1;
        const datosOk=form.nombre&&form.telefono;
        const dirCliente=[zonaSel?.zona,addr.calle,addr.referencia].filter(Boolean).join(", ");
        // consentPromo está en el estado del componente principal
        const enviarAProveedor=(prov)=>{
          if(!datosOk){setPmsg("Completa tu nombre y teléfono antes de enviar");return;}
          if(!prov.wa){alert(`${prov.nombre} no tiene WhatsApp configurado. Contacta al administrador.`);return;}
          const sub=prov.items.reduce((a,i)=>a+i.price*i.qty,0);
          const del=prov.delivery?(sub>=prov.gratis?0:prov.costo):0;
          const total=sub+del;
          const aceptaPromo=!!consentPromo[prov.nombre];
          const numPedido=Date.now()%900+100;
          const msg=buildGlobalWaMsg(prov.nombre,prov.items,total,del,numPedido,form.nombre,form.telefono,dirCliente);
          const num=normalizarNumeroWA(prov.wa);
          const ref=`PED-${String(numPedido).padStart(3,"0")}`;
          // Buscar id del proveedor desde allRestaurantes
          const restObj=allRestaurantes?.find(r=>r.negocio===prov.nombre);
          guardarPedidoRestaurante(restObj?.id||null,prov.items,sub,del,total,ref,aceptaPromo,prov.nombre);
          const nuevoCart={...cartRest};
          prov.items.forEach(i=>delete nuevoCart[i.id]);
          setCartRest(nuevoCart);
          if(Object.keys(nuevoCart).length===0)setSheet(null);
          abrirWhatsApp(num,msg);
        };
        return(
          <div style={s.ov} onClick={()=>setSheet(null)}>
            <div style={s.sh} onClick={e=>e.stopPropagation()}>
              <div style={s.hnd}/>
              {/* TÍTULO */}
              <div style={{fontSize:17,fontWeight:800,color:"#0f172a",marginBottom:4}}>
                {esMultiple?"🛒 Pedidos con varios proveedores":"🛒 Tu pedido"}
              </div>
              {pmsg&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"9px 12px",marginBottom:10,fontSize:13,color:"#dc2626",fontWeight:600}}>{pmsg}</div>}
              {esMultiple&&(
                <div style={{fontSize:12,color:"#64748b",background:"#f8fafc",borderRadius:10,padding:"8px 12px",marginBottom:12,lineHeight:1.5}}>
                  Tienes pedidos con <strong>{proveedores.length} proveedores</strong>. Cada uno recibirá su pedido de forma independiente.
                </div>
              )}
              {/* DATOS DEL CLIENTE — una sola vez para todos */}
              <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:"#15803d",marginBottom:8}}>👤 Tus datos de contacto</div>
                <input style={{...s.inp,marginBottom:8}} placeholder="Nombre y apellido *" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
                <input style={{...s.inp,marginBottom:8}} placeholder="Tu WhatsApp * (Ej: 04XX-XXXXXXX)" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/>
                {/* ZONA DEL SISTEMA */}
                <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>📍 Zona de entrega</div>
                <select style={{...s.inp,marginBottom:8,background:"#fff",color:zonaSelId?"#0f172a":"#94a3b8"}} value={zonaSelId} onChange={e=>{setZonaSelId(e.target.value);setZonaSel(zonas.find(z=>z.id===e.target.value)||null);}}>
                  <option value="">Selecciona tu zona / barrio...</option>
                  {zonas.map(z=><option key={z.id} value={z.id}>{z.zona}{z.municipio&&z.municipio!=="San Fernando"?` — ${z.municipio}`:""}</option>)}
                </select>
                {/* DIRECCIÓN EXACTA */}
                <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>🏠 Dirección exacta</div>
                <input style={{...s.inp,marginBottom:6}} placeholder="Calle, carrera, av. y número (Ej: Calle Bolívar #23)" value={addr.calle} onChange={e=>setAddr({...addr,calle:e.target.value})}/>
                {/* PUNTO DE REFERENCIA */}
                <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>🗺️ Punto de referencia</div>
                <input style={{...s.inp,marginBottom:0}} placeholder="Ej: Casa azul, frente al CANTV, al lado del parque..." value={addr.referencia} onChange={e=>setAddr({...addr,referencia:e.target.value})}/>
                {!datosOk&&<div style={{fontSize:11,color:"#dc2626",marginTop:6}}>⚠️ Nombre y teléfono son obligatorios para enviar pedidos</div>}
              </div>
              {/* BLOQUE POR PROVEEDOR */}
              {proveedores.map((prov,idx)=>{
                const sub=prov.items.reduce((a,i)=>a+i.price*i.qty,0);
                const del=prov.delivery?(sub>=prov.gratis?0:prov.costo):0;
                const total=sub+del;
                const falta=prov.delivery&&del>0?parseFloat((prov.gratis-sub).toFixed(2)):0;
                const promos=prov.items.filter(i=>i.isPromo);
                const platos=prov.items.filter(i=>!i.isPromo);
                const sinWa=!prov.wa;
                return(
                  <div key={idx} style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:14,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                    {/* Header proveedor */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:getAvatarColor(prov.nombre),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:15,flexShrink:0}}>
                        {prov.nombre[0]?.toUpperCase()}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,fontSize:14,color:"#0f172a"}}>{prov.nombre}</div>
                        <div style={{fontSize:11,color:prov.delivery?"#15803d":"#64748b"}}>
                          {prov.delivery?"🛵 Delivery disponible":prov.retiro?"🏃 Solo retiro":"📦 Consultar modalidad"}
                        </div>
                      </div>
                      <div style={{fontWeight:900,fontSize:16,color:"#ef4444"}}>${total.toFixed(2)}</div>
                    </div>
                    {/* Promos */}
                    {promos.map(i=>(
                      <div key={i.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f8fafc"}}>
                        <span style={{fontSize:11,background:"#fdf4ff",color:"#7e22ce",padding:"2px 7px",borderRadius:8,fontWeight:700,flexShrink:0}}>🔥 PROMO</span>
                        <span style={{flex:1,fontSize:12,fontWeight:600,color:"#0f172a"}}>{i.name}</span>
                        <div style={s.qR}>
                          <button style={s.qB} onClick={()=>{const n={...cartRest};n[i.id].qty>1?n[i.id]={...n[i.id],qty:n[i.id].qty-1}:delete n[i.id];setCartRest(n);}}>−</button>
                          <span style={s.qN}>{i.qty}</span>
                          <button style={s.qB} onClick={()=>setCartRest(c=>({...c,[i.id]:{...c[i.id],qty:c[i.id].qty+1}}))}>+</button>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:P,minWidth:46,textAlign:"right"}}>${(i.price*i.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Platos */}
                    {platos.map(i=>(
                      <div key={i.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f8fafc"}}>
                        <span style={{fontSize:18,flexShrink:0}}>🍽️</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{i.name}</div>
                          {i.nota&&<div style={{fontSize:10,color:"#7e22ce"}}>📝 {i.nota}</div>}
                        </div>
                        <div style={s.qR}>
                          <button style={s.qB} onClick={()=>{const n={...cartRest};n[i.id].qty>1?n[i.id]={...n[i.id],qty:n[i.id].qty-1}:delete n[i.id];setCartRest(n);}}>−</button>
                          <span style={s.qN}>{i.qty}</span>
                          <button style={s.qB} onClick={()=>setCartRest(c=>({...c,[i.id]:{...c[i.id],qty:c[i.id].qty+1}}))}>+</button>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:P,minWidth:46,textAlign:"right"}}>${(i.price*i.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Delivery gratis / falta */}
                    {prov.delivery&&(
                      <div style={{marginTop:8,padding:"7px 10px",borderRadius:8,background:del===0?"#f0fdf4":"#fffbeb",border:`1px solid ${del===0?"#bbf7d0":"#fde68a"}`}}>
                        {del===0
                          ?<span style={{fontSize:12,fontWeight:700,color:"#15803d"}}>🚚 Delivery gratis</span>
                          :<span style={{fontSize:12,color:"#92400e"}}>🟡 Te faltan <strong>${falta.toFixed(2)}</strong> para delivery gratis</span>
                        }
                      </div>
                    )}
                    {/* Total del proveedor */}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"1px solid #f1f5f9",fontSize:12}}>
                      <span style={{color:"#64748b"}}>
                        {del===0?(prov.delivery?"Delivery incluido":"Sin delivery"):`Delivery: $${del.toFixed(2)}`}
                      </span>
                      <span style={{fontWeight:800,color:"#0f172a",fontSize:14}}>Total: <span style={{color:"#ef4444"}}>${total.toFixed(2)}</span></span>
                    </div>
                    {/* Consentimiento promos — desmarcado por defecto */}
                    <div style={{marginTop:10,padding:"10px 12px",background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0"}}>
                      <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}>
                        <input
                          type="checkbox"
                          checked={!!consentPromo[prov.nombre]}
                          onChange={e=>setConsentPromo(c=>({...c,[prov.nombre]:e.target.checked}))}
                          style={{marginTop:2,width:16,height:16,accentColor:"#25D366",flexShrink:0,cursor:"pointer"}}
                        />
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color:"#0f172a",lineHeight:1.4}}>
                            ¿Deseas recibir promociones de <strong>{prov.nombre}</strong> por WhatsApp?
                          </div>
                          <div style={{fontSize:10,color:"#64748b",marginTop:2,lineHeight:1.4}}>
                            Solo te contactarán cuando tengan nuevas promos. Puedes cancelar respondiendo BAJA.
                          </div>
                        </div>
                      </label>
                    </div>
                    {/* Botón */}
                    {sinWa
                      ?<div style={{...s.msg(false),marginTop:8}}>⚠️ {prov.nombre} no tiene WhatsApp configurado aún</div>
                      :<button
                        style={{width:"100%",background:datosOk?"#25D366":"#94a3b8",color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:13,fontWeight:800,cursor:datosOk?"pointer":"not-allowed",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"background 0.2s"}}
                        onClick={()=>{if(!datosOk){setPmsg("⚠️ Completa tu nombre y teléfono antes de enviar el pedido");return;}enviarAProveedor(prov);}}>
                        📲 Pedir a {prov.nombre}
                      </button>
                    }
                  </div>
                );
              })}
              {esMultiple&&(
                <div style={{fontSize:11,color:"#94a3b8",textAlign:"center",padding:"4px 0 8px",lineHeight:1.5}}>
                  Cada proveedor recibe <strong>solo su pedido</strong>. Envíalos en el orden que quieras.
                </div>
              )}
              <button style={s.btnG} onClick={()=>setSheet(null)}>← Seguir agregando</button>
            </div>
          </div>
        );
      })()}

      {/* SHEET CARRITO — redirige a cartGlobal unificado */}
      {sheet==="cart"&&null}

      {/* SHEET CHECKOUT */}
      {/* LIGHTBOX IMAGEN AMPLIADA */}


      {/* MODAL DE CONTACTO — datos del cliente DESPUÉS de tocar el botón */}
      {contactModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:9500,display:"flex",alignItems:"flex-end"}} onClick={()=>setContactModal(null)}>
          <div style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 16px 32px",width:"100%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            {(()=>{
              const {prov,servicio,catId,esRuta,ruta}=contactModal;
              const wa=((esRuta?ruta.proveedores?.whatsapp_negocio:prov?.whatsapp_negocio)||
                        (esRuta?ruta.proveedores?.telefono:prov?.telefono)||"").replace(/\D/g,"");
              const num=wa.startsWith("0")?"58"+wa.slice(1):wa.startsWith("58")?wa:"58"+wa;

              const esTransporte=["mototaxi","taxi","encomiendas"].includes(catId);
              const esSalud=["medicos","enfermeria","laboratorios","odontologia"].includes(catId);
              const esRutaFlag=catId==="rutas"||esRuta;
              const esHotel=catId==="hoteles";
              const esTurismo=catId==="turismo";

              const buildMsg=()=>{
                const n=contactForm.nombre||"(tu nombre)";
                const t=contactForm.telefono||"(tu teléfono)";
                if(esRutaFlag){
                  return `\u{1F68C} *Reserva de puesto — Lokl*\n\nHola, quiero reservar un puesto para:\n\n\u{1F4CD} Ruta: *${ruta?.origen} → ${ruta?.destino}*\n\u{1F550} Salida: *${ruta?.hora_salida?.slice(0,5)}*\n\u{1F4B0} Precio: *$${ruta?.precio}*\n\u{1F4C5} Fecha: *${contactForm.fecha||"(fecha)"}*\n\u{1F465} Puestos: *${contactForm.puestos}*\n\n\u{1F464} ${n}\n\u{1F4F1} ${t}\n\n¿Están disponibles los puestos?`;
                }
                if(esHotel){
                  return `\u{1F3E8} *Consulta de hospedaje — Lokl*\n\nHola ${prov?.negocio}, vi su perfil en Lokl.\n\n\u{1F4C5} Entrada: *${contactForm.fecha||"(fecha)"}*\n\u{1F4C5} Salida: *${contactForm.fechaSalida||"(fecha)"}*\n\u{1F465} Personas: *${contactForm.personas}*\n${servicio?`\u{1F6CF}\u{FE0F} Habitación: *${servicio.nombre}*\n\u{1F4B0} Precio: *$${servicio.precio}/noche*\n`:""}\n\u{1F464} ${n}\n\u{1F4F1} ${t}\n\n¿Tienen disponibilidad?`;
                }
                if(esTurismo){
                  return `\u{1F334} *Consulta turística — Lokl*\n\nHola ${prov?.negocio}, vi su perfil en Lokl.\n\n${servicio?`\u{1F3AF} Servicio: *${servicio.nombre}*\n\u{1F4B0} Precio: *$${servicio.precio}*\n`:""}\u{1F4C5} Fecha: *${contactForm.fecha||"(fecha)"}*\n\u{1F465} Personas: *${contactForm.personas}*\n\n\u{1F464} ${n}\n\u{1F4F1} ${t}\n\n¿Tienen disponibilidad?`;
                }
                if(esSalud){
                  return `\u{1F468}\u{200D}\u{2695}\u{FE0F} *Solicitud de cita — Lokl*\n\nHola ${prov?.negocio}, vi su perfil en Lokl.\n\n${servicio?`\u{1FA7A} Servicio: *${servicio.nombre}*\n\u{1F4B0} Precio: *$${servicio.precio}*\n`:""}\n\u{1F464} Paciente: *${n}*\n\u{1F4F1} Teléfono: *${t}*\n\n¿Cuál es la próxima disponibilidad?`;
                }
                if(esTransporte){
                  return `\u{1F6F5} *Solicitud de servicio — Lokl*\n\nHola ${prov?.negocio}, vi tu perfil en Lokl.\n\n${servicio?`\u{26A1} Servicio: *${servicio.nombre}*\n\u{1F4B0} Precio: *$${servicio.precio}*\n`:""}\u{1F4CD} Recogida: *${contactForm.fecha||"(dirección de recogida)"}*\n\u{1F3C1} Destino: *${contactForm.fechaSalida||"(destino)"}*\n\n\u{1F464} ${n}\n\u{1F4F1} ${t}`;
                }
                return `\u{1F527} *Solicitud de servicio — Lokl*\n\nHola ${prov?.negocio}, vi tu perfil en Lokl.\n\n${servicio?`\u{26A1} Servicio: *${servicio.nombre}*\n\u{1F4B0} Precio: *$${servicio.precio}*\n`:""}\n\u{1F464} ${n}\n\u{1F4F1} ${t}\n\n¿Cuándo puedes atenderme?`;
              };

              return(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:900,color:"#0f172a"}}>
                        {esRutaFlag?"🚌 Reservar puesto":esHotel?"🏨 Consultar disponibilidad":esTurismo?"🌴 Consultar disponibilidad":esSalud?"👨‍⚕️ Solicitar cita":"📲 Contactar"}
                      </div>
                      <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{esRutaFlag?`${ruta?.origen} → ${ruta?.destino}`:prov?.negocio}</div>
                    </div>
                    <button onClick={()=>setContactModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
                  </div>

                  {servicio&&<div style={{background:"#f8fafc",borderRadius:12,padding:"10px 12px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{servicio.nombre}</div>
                    <div style={{fontSize:14,fontWeight:800,color:"#0f9b6e"}}>${servicio.precio}</div>
                  </div>}

                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <input style={{padding:"12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,width:"100%",boxSizing:"border-box"}} placeholder="Tu nombre completo" value={contactForm.nombre} onChange={e=>setContactForm(f=>({...f,nombre:e.target.value}))}/>
                    <input style={{padding:"12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,width:"100%",boxSizing:"border-box"}} placeholder="Tu WhatsApp (04XX-XXXXXXX)" value={contactForm.telefono} onChange={e=>setContactForm(f=>({...f,telefono:e.target.value}))}/>

                    {esTransporte&&<>
                      <input style={{padding:"12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,width:"100%",boxSizing:"border-box"}} placeholder="📍 Dirección de recogida" value={contactForm.fecha} onChange={e=>setContactForm(f=>({...f,fecha:e.target.value}))}/>
                      <input style={{padding:"12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,width:"100%",boxSizing:"border-box"}} placeholder="🏁 Destino" value={contactForm.fechaSalida} onChange={e=>setContactForm(f=>({...f,fechaSalida:e.target.value}))}/>
                    </>}

                    {esRutaFlag&&<>
                      <input type="date" style={{padding:"12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,width:"100%",boxSizing:"border-box"}} value={contactForm.fecha} onChange={e=>setContactForm(f=>({...f,fecha:e.target.value}))}/>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <label style={{fontSize:13,color:"#64748b",flexShrink:0}}>Puestos:</label>
                        <select style={{padding:"10px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,flex:1}} value={contactForm.puestos} onChange={e=>setContactForm(f=>({...f,puestos:e.target.value}))}>
                          {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} puesto{n>1?"s":""}</option>)}
                        </select>
                      </div>
                    </>}

                    {(esHotel||esTurismo)&&<>
                      <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{esHotel?"📅 Fecha de entrada":"📅 Fecha de visita"}</div>
                      <input type="date" style={{padding:"12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,width:"100%",boxSizing:"border-box"}} value={contactForm.fecha} onChange={e=>setContactForm(f=>({...f,fecha:e.target.value}))}/>
                      {esHotel&&<>
                        <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>📅 Fecha de salida</div>
                        <input type="date" style={{padding:"12px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,width:"100%",boxSizing:"border-box"}} value={contactForm.fechaSalida} onChange={e=>setContactForm(f=>({...f,fechaSalida:e.target.value}))}/>
                      </>}
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <label style={{fontSize:13,color:"#64748b",flexShrink:0}}>Personas:</label>
                        <select style={{padding:"10px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,flex:1}} value={contactForm.personas} onChange={e=>setContactForm(f=>({...f,personas:e.target.value}))}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} persona{n>1?"s":""}</option>)}
                        </select>
                      </div>
                    </>}
                  </div>

                  <button
                    onClick={()=>{
                      if(!contactForm.nombre||!contactForm.telefono)return;
                      const _msg=buildMsg();
                      setContactModal(null);
                      setContactForm({nombre:contactForm.nombre,telefono:contactForm.telefono,fecha:"",personas:"1",puestos:"1",fechaSalida:""});
                      abrirWhatsApp(num,_msg);
                    }}
                    style={{width:"100%",background:!contactForm.nombre||!contactForm.telefono?"#94a3b8":"#25D366",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:15,fontWeight:900,cursor:!contactForm.nombre||!contactForm.telefono?"not-allowed":"pointer",marginTop:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
                  >
                    📲 Enviar mensaje por WhatsApp
                  </button>
                  {(!contactForm.nombre||!contactForm.telefono)&&<div style={{textAlign:"center",fontSize:11,color:"#94a3b8",marginTop:6}}>Completa tu nombre y teléfono para continuar</div>}
                </>
              );
            })()}
          </div>
        </div>
      )}
      {(imgZoom||lightbox)&&(
        <div onClick={()=>{setImgZoom(null);setLightbox(null);}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
          <button onClick={()=>{setImgZoom(null);setLightbox(null);}} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.15)",border:"none",borderRadius:"50%",width:36,height:36,color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          <img src={lightbox?.foto||imgZoom} alt="" style={{maxWidth:"100%",maxHeight:lightbox?.nombre?"65vh":"85vh",objectFit:"contain",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}/>
          {lightbox?.nombre&&(
            <div style={{marginTop:16,textAlign:"center",maxWidth:320,padding:"0 8px"}}>
              <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:4}}>{lightbox.nombre}</div>
              {lightbox.descripcion&&<div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.5,marginBottom:8}}>{lightbox.descripcion}</div>}
              {lightbox.precio&&<div style={{fontSize:20,fontWeight:900,color:"#fbbf24"}}>${lightbox.precio}{lightbox.unidad?" / "+lightbox.unidad:""}</div>}
            </div>
          )}
        </div>
      )}
      {/* MODAL DETALLE PLATO */}
      {platoDetalle&&(
        <div style={s.ov} onClick={()=>setPlatoDetalle(null)}>
          <div style={{...s.sh,padding:0,overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
            <div style={s.hnd}/>
            {/* IMAGEN GRANDE */}
            {platoDetalle.foto
              ?<img src={platoDetalle.foto} alt={platoDetalle.name} style={{width:"100%",height:220,objectFit:"cover",display:"block"}}/>
              :<div style={{height:160,background:"linear-gradient(135deg,#fef3c7,#fde68a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:64}}>🍽️</div>
            }
            {/* INFO */}
            <div style={{padding:"16px 20px 20px"}}>
              {platoDetalle.tag&&<span style={{fontSize:11,fontWeight:800,background:"#f59e0b",color:"#fff",padding:"3px 10px",borderRadius:8,marginBottom:8,display:"inline-block"}}>{platoDetalle.tag}</span>}
              <div style={{fontSize:20,fontWeight:900,color:"#0f172a",marginBottom:6,letterSpacing:-0.3}}>{platoDetalle.name}</div>
              {platoDetalle.descripcion&&<div style={{fontSize:13,color:"#64748b",lineHeight:1.6,marginBottom:12}}>{platoDetalle.descripcion}</div>}
              {platoDetalle.marca&&<div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>🏷️ {platoDetalle.marca}</div>}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                <div style={{fontSize:28,fontWeight:900,color:"#ef4444",letterSpacing:-0.5}}>${platoDetalle.price.toFixed(2)}</div>
                {(()=>{
                  const qty=cartRest[platoDetalle.id]?.qty||0;
                  return qty>0?(
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button style={{...s.qB,width:34,height:34,fontSize:18}} onClick={()=>{const n={...cartRest};n[platoDetalle.id].qty>1?n[platoDetalle.id]={...n[platoDetalle.id],qty:n[platoDetalle.id].qty-1}:delete n[platoDetalle.id];setCartRest(n);}}>−</button>
                      <span style={{fontSize:16,fontWeight:800,minWidth:20,textAlign:"center"}}>{qty}</span>
                      <button style={{...s.qB,width:34,height:34,fontSize:18}} onClick={()=>setCartRest(c=>({...c,[platoDetalle.id]:{...platoDetalle,qty:qty+1}}))}>+</button>
                    </div>
                  ):(
                    <button style={{background:"#ef4444",color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:800,cursor:"pointer"}} onClick={()=>{setCartRest(c=>({...c,[platoDetalle.id]:{...platoDetalle,qty:1}}));setPlatoDetalle(null);}}>
                      + Agregar al pedido
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL PRODUCTO NEGOCIO LOCAL */}
      {productoDetalle&&(
        <ProductoDetalleModal
          producto={productoDetalle}
          cartNegocio={cartNegocio}
          setCartNegocio={setCartNegocio}
          onClose={()=>setProductoDetalle(null)}
          s={s}
        />
      )}

      {/* SHEET CHECKOUT — redirige a cartGlobal */}
      {sheet==="checkout"&&null}

      {/* SHEET RESUMEN */}
      {sheet==="resumen"&&(<div style={s.ov} onClick={()=>setSheet(null)}><div style={s.sh} onClick={e=>e.stopPropagation()}>
        <div style={s.hnd}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={s.shT}>✅ Resumen de tu pedido</div>
          <button onClick={()=>setSheet(null)} style={{background:"#f1f5f9",border:"none",borderRadius:20,width:30,height:30,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{background:"#f0fdf4",borderRadius:12,padding:"10px 14px",marginBottom:12,fontSize:12,color:"#15803d",fontWeight:600}}>📋 Ref: {pedidoRef}</div>
        {items.map(i=>(<div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}><span>{i.name} x{i.qty}</span><span style={{fontWeight:600}}>${(i.price*i.qty).toFixed(2)}</span></div>))}
        <div style={{margin:"10px 0"}}><div style={s.sr}><span style={s.sL}>Subtotal</span><span style={s.sV}>${sub.toFixed(2)}</span></div><div style={s.sr}><span style={s.sL}>Delivery</span>{del===0?<span style={s.fT}>GRATIS</span>:<span style={s.sV}>${del.toFixed(2)}</span>}</div><div style={s.tR}><span style={{fontWeight:700}}>TOTAL</span><span style={{fontWeight:700,fontSize:18,color:"#22c55e"}}>${total.toFixed(2)}</span></div></div>
        <div style={{...s.ib,marginTop:8}}><div style={s.sr}><span style={s.sL}>👤</span><span style={s.sV}>{form.nombre}</span></div><div style={s.sr}><span style={s.sL}>📱</span><span style={s.sV}>{form.telefono}</span></div><div style={s.sr}><span style={s.sL}>📍</span><span style={s.sV}>{zonaSel?.zona}</span></div><div style={s.sr}><span style={s.sL}>🏠</span><span style={s.sV}>{addr.calle}</span></div><div style={s.sr}><span style={s.sL}>💳</span><span style={s.sV}>{form.pago}</span></div></div>
        <div style={{background:"#fffbeb",borderRadius:12,padding:"10px 14px",marginBottom:4,fontSize:12,color:"#92400e"}}>⚡ Al tocar el botón se abrirá WhatsApp con tu pedido listo. Solo toca <strong>Enviar</strong>.</div>
        {/* -- BOTÓN CORREGIDO: guarda en DB antes de abrir WhatsApp -- */}
        <button style={s.btnWa} onClick={async()=>{
          await guardarPedidoEnDB();
          sendWa();
          setSheet("success");
        }}>📲 Enviar pedido por WhatsApp</button>
        <button style={s.btnG} onClick={()=>setSheet("checkout")}>← Modificar datos</button>
      </div></div>)}

      {/* SHEET ÉXITO */}
      {sheet==="success"&&(<div style={s.ov} onClick={()=>setSheet(null)}><div style={s.sh} onClick={e=>e.stopPropagation()}><div style={s.hnd}/><div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:52,marginBottom:10}}>🎉</div><div style={{fontSize:20,fontWeight:700,color:P,marginBottom:6}}>¡Pedido enviado!</div><div style={{fontSize:13,color:"#64748b",lineHeight:1.7,marginBottom:20}}>Tu pedido fue enviado por WhatsApp. Te confirmaremos a <strong>{form.telefono}</strong> para coordinar el pago.</div><button style={s.btnG} onClick={()=>{setCart({});setSheet(null);setForm({nombre:"",telefono:"",sexo:"",pago:"Pago Móvil",recibirPromos:false});setZonaSelId("");setZonaSel(null);setAddr({calle:"",referencia:""});setPedidoRef("");}}>Hacer otro pedido</button></div></div></div>)}

      {/* SHEET SERVICIO */}
      {sheet==="service"&&selSvc&&(<div style={s.ov} onClick={()=>setSheet(null)}><div style={s.sh} onClick={e=>e.stopPropagation()}><div style={s.hnd}/><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{fontSize:28}}>{selSvc.emoji}</span><div style={s.shT}>{selSvc.name}</div></div><label style={s.lbl}>Tu nombre</label><input style={s.inp} placeholder="María González" value={svcForm.nombre} onChange={e=>setSvcForm({...svcForm,nombre:e.target.value})}/><label style={s.lbl}>WhatsApp</label><input style={s.inp} placeholder="+58 424-000-0000" value={svcForm.telefono} onChange={e=>setSvcForm({...svcForm,telefono:e.target.value})}/><label style={s.lbl}>Dirección</label><input style={s.inp} placeholder="¿Dónde necesitas el servicio?" value={svcForm.direccion} onChange={e=>setSvcForm({...svcForm,direccion:e.target.value})}/><label style={s.lbl}>Detalle</label><input style={s.inp} placeholder="Cuéntanos lo que necesitas" value={svcForm.detalle} onChange={e=>setSvcForm({...svcForm,detalle:e.target.value})}/><div style={s.ib}><div style={{fontSize:12,color:"#64748b"}}>Te contactamos por WhatsApp para confirmar.</div></div><button style={s.btnWa} onClick={sendSvcWa}>Enviar solicitud</button><button style={s.btnG} onClick={()=>setSheet(null)}>Cancelar</button></div></div>)}

      {/* SHEET NOTA */}
      {notaSheet&&(
        <div style={s.ov} onClick={()=>setNotaSheet(null)}>
          <div style={s.sh} onClick={e=>e.stopPropagation()}>
            <div style={s.hnd}/>
            <div style={s.shT}>📝 Nota para este producto</div>
            <div style={{fontSize:13,color:"#64748b",marginBottom:10}}>¿Tienes alguna indicación especial? Ej: sin cebolla, extra salsa, solo chocolate negro...</div>
            <textarea style={{...s.inp,height:100,resize:"none",fontFamily:"'Segoe UI',sans-serif"}} placeholder="Escribe tu nota aquí..." value={notaTemp} onChange={e=>setNotaTemp(e.target.value)}/>
            <button style={s.btn} onClick={()=>{setCart(c=>({...c,[notaSheet]:{...c[notaSheet],nota:notaTemp}}));setNotaSheet(null);}}>Guardar nota</button>
            <button style={s.btnG} onClick={()=>{setCart(c=>({...c,[notaSheet]:{...c[notaSheet],nota:""}}));setNotaTemp("");setNotaSheet(null);}}>Quitar nota</button>
          </div>
        </div>
      )}

      {/* SHEET RESEÑA */}
      {sheet==="resena"&&(<div style={s.ov} onClick={()=>setSheet(null)}><div style={s.sh} onClick={e=>e.stopPropagation()}><div style={s.hnd}/><div style={s.shT}>⭐ Dejar reseña</div>{resenaMsj&&<div style={s.msg(resenaMsj.includes("✅"))}>{resenaMsj}</div>}<label style={s.lbl}>Tu nombre *</label><input style={s.inp} placeholder="María González" value={resena.nombre} onChange={e=>setResena({...resena,nombre:e.target.value})}/><label style={s.lbl}>Calificación *</label><div style={s.stars}>{[1,2,3,4,5].map(n=><span key={n} style={s.star(resena.estrellas>=n)} onClick={()=>setResena({...resena,estrellas:n})}>★</span>)}</div><label style={s.lbl}>Comentario (opcional)</label><input style={s.inp} placeholder="¿Cómo estuvo el producto?" value={resena.comentario} onChange={e=>setResena({...resena,comentario:e.target.value})}/><button style={s.btn} onClick={enviarResena}>Enviar reseña</button><button style={s.btnG} onClick={()=>setSheet(null)}>Cancelar</button></div></div>)}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MODAL SELECTOR DE CIUDAD                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showCiudadModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:430,padding:"24px 20px 32px",boxShadow:"0 -4px 24px rgba(0,0,0,0.15)"}}>
            <div style={{width:40,height:4,background:"#e2e8f0",borderRadius:2,margin:"0 auto 20px"}}/>
            {/* Primera vez */}
            {!ubicacionUsuario?(
              <>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:40,marginBottom:10}}>📍</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#0f172a",marginBottom:6}}>¿Dónde estás?</div>
                  <div style={{fontSize:13,color:"#64748b",lineHeight:1.5}}>Selecciona tu municipio para ver lo que está disponible cerca de ti.</div>
                </div>
              </>
            ):(
              <div style={{fontSize:17,fontWeight:800,color:"#0f172a",marginBottom:16}}>📍 Cambiar mi municipio</div>
            )}
            {/* SELECTOR */}
            <div style={{marginBottom:14}}>
              <label style={s.lbl}>Estado</label>
              <select style={{...s.inp,background:"#fff",marginBottom:10}} value={ciudadTemp.estado} onChange={e=>setCiudadTemp({estado:e.target.value,municipio:""})}>
                <option value="">Selecciona un estado...</option>
                {Object.keys(VE_ESTADOS_MUNICIPIOS).sort().map(est=>(
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
              <label style={s.lbl}>Municipio</label>
              <select style={{...s.inp,background:"#fff"}} value={ciudadTemp.municipio} onChange={e=>setCiudadTemp(c=>({...c,municipio:e.target.value}))}>
                <option value="">Selecciona un municipio...</option>
                {(VE_ESTADOS_MUNICIPIOS[ciudadTemp.estado]||[]).map(m=>(
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            {/* AVISO SUPERMERCADO */}
            {ciudadTemp.municipio&&ciudadTemp.municipio!=="San Fernando"&&(
              <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"10px 12px",marginBottom:12,fontSize:12,color:"#92400e"}}>
                ⚠️ El supermercado online aún no está disponible en <strong>{ciudadTemp.municipio}</strong>. Los restaurantes, negocios y clasificados sí pueden estar disponibles si hay proveedores registrados en tu municipio.
              </div>
            )}
            {ciudadTemp.municipio==="San Fernando"&&ciudadTemp.estado==="Apure"&&(
              <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"10px 12px",marginBottom:12,fontSize:12,color:"#15803d"}}>
                ✅ San Fernando de Apure tiene operación completa: supermercado, restaurantes, negocios y más.
              </div>
            )}
            <button
              disabled={!ciudadTemp.estado||!ciudadTemp.municipio}
              onClick={()=>{
                const nueva={estado:ciudadTemp.estado,municipio:ciudadTemp.municipio};
                setUbicacionUsuario(nueva);
                // Limpiar todos los módulos al cambiar ciudad
                setProveedoresServicio([]);
                setProveedorServicioActivo(null);
                setCategoriaServicio(null);
                setRestauranteActivo(null);
                setAllRestaurantes([]);
                setAllNegocios([]);
                setProvProds([]);
                setProvPromos([]);
                setShowCiudadModal(false);
                loadAll();
              }}
              style={{...s.btn,marginTop:4,opacity:(!ciudadTemp.estado||!ciudadTemp.municipio)?0.5:1,cursor:(!ciudadTemp.estado||!ciudadTemp.municipio)?"not-allowed":"pointer"}}>
              ✅ Confirmar mi ubicación
            </button>
            {ubicacionUsuario&&(
              <button onClick={()=>setShowCiudadModal(false)} style={s.btnG}>Cancelar</button>
            )}
            {!ubicacionUsuario&&(
              <button onClick={()=>{setUbicacionUsuario(UBI_DEFAULT);setProveedoresServicio([]);setProveedorServicioActivo(null);setCategoriaServicio(null);setRestauranteActivo(null);setAllRestaurantes([]);setAllNegocios([]);setProvProds([]);setProvPromos([]);setShowCiudadModal(false);loadAll();}} style={{...s.btnG,fontSize:12,color:"#94a3b8"}}>
                Continuar como San Fernando de Apure
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{height:80}}/>
    </div>
  );
}

