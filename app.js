// Prode Mundial Familiar 2026 - Lógica de Negocio, Sincronización en Tiempo Real y UI
// Autor: Antigravity

// CONFIGURACIÓN DE FIREBASE (Pega aquí las credenciales de tu proyecto de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCmH0mLqyPUw-4gOpQc6i_2MgUeIXumycM",
  authDomain: "prode-familiar-7afc1.firebaseapp.com",
  databaseURL: "https://prode-familiar-7afc1-default-rtdb.firebaseio.com",
  projectId: "prode-familiar-7afc1",
  storageBucket: "prode-familiar-7afc1.firebasestorage.app",
  messagingSenderId: "1074480642363",
  appId: "1:1074480642363:web:43563df1efbe7f82ec9f1e"
};

let db = null;
let isFirebaseEnabled = false;

// Base de datos inicial de partidos (a partir del 21 de junio de 2026)
const INITIAL_MATCHES = [
  // --- DOMINGO 21 DE JUNIO ---
  { id: "g1", type: "group", group: "H", teamA: "España", teamB: "Arabia Saudita", date: "2026-06-21T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g2", type: "group", group: "G", teamA: "Bélgica", teamB: "Irán", date: "2026-06-21T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g3", type: "group", group: "H", teamA: "Uruguay", teamB: "Cabo Verde", date: "2026-06-21T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g4", type: "group", group: "G", teamA: "Nueva Zelanda", teamB: "Egipto", date: "2026-06-21T19:00:00", scoreA: null, scoreB: null, status: "pending" },

  // --- LUNES 22 DE JUNIO ---
  { id: "g5", type: "group", group: "I", teamA: "Noruega", teamB: "Senegal", date: "2026-06-22T13:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g6", type: "group", group: "I", teamA: "Francia", teamB: "Irak", date: "2026-06-22T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g7", type: "group", group: "J", teamA: "Argentina", teamB: "Austria", date: "2026-06-22T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g8", type: "group", group: "J", teamA: "Jordania", teamB: "Argelia", date: "2026-06-22T21:00:00", scoreA: null, scoreB: null, status: "pending" },

  // --- MARTES 23 DE JUNIO ---
  { id: "g9", type: "group", group: "L", teamA: "Inglaterra", teamB: "Ghana", date: "2026-06-23T13:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g10", type: "group", group: "L", teamA: "Panamá", teamB: "Croacia", date: "2026-06-23T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g11", type: "group", group: "K", teamA: "Portugal", teamB: "Uzbekistán", date: "2026-06-23T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g12", type: "group", group: "K", teamA: "Colombia", teamB: "R.D. Congo", date: "2026-06-23T21:00:00", scoreA: null, scoreB: null, status: "pending" },

  // --- MIÉRCOLES 24 DE JUNIO ---
  { id: "g13", type: "group", group: "C", teamA: "Escocia", teamB: "Brasil", date: "2026-06-24T13:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g14", type: "group", group: "C", teamA: "Marruecos", teamB: "Haití", date: "2026-06-24T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g15", type: "group", group: "B", teamA: "Suiza", teamB: "Canadá", date: "2026-06-24T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g16", type: "group", group: "B", teamA: "Bosnia y Herz.", teamB: "Catar", date: "2026-06-24T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g17", type: "group", group: "A", teamA: "Rep. Checa", teamB: "México", date: "2026-06-24T21:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g18", type: "group", group: "A", teamA: "Sudáfrica", teamB: "Corea del Sur", date: "2026-06-24T21:00:00", scoreA: null, scoreB: null, status: "pending" },

  // --- JUEVES 25 DE JUNIO ---
  { id: "g19", type: "group", group: "E", teamA: "Curazao", teamB: "Costa de Marfil", date: "2026-06-25T13:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g20", type: "group", group: "E", teamA: "Ecuador", teamB: "Alemania", date: "2026-06-25T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g21", type: "group", group: "F", teamA: "Japón", teamB: "Suecia", date: "2026-06-25T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g22", type: "group", group: "F", teamA: "Túnez", teamB: "Países Bajos", date: "2026-06-25T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g23", type: "group", group: "D", teamA: "Turquía", teamB: "EE. UU.", date: "2026-06-25T21:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g24", type: "group", group: "D", teamA: "Paraguay", teamB: "Australia", date: "2026-06-25T21:00:00", scoreA: null, scoreB: null, status: "pending" },

  // --- VIERNES 26 DE JUNIO ---
  { id: "g25", type: "group", group: "I", teamA: "Noruega", teamB: "Francia", date: "2026-06-26T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g26", type: "group", group: "I", teamA: "Senegal", teamB: "Irak", date: "2026-06-26T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g27", type: "group", group: "G", teamA: "Egipto", teamB: "Irán", date: "2026-06-26T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g28", type: "group", group: "G", teamA: "Nueva Zelanda", teamB: "Bélgica", date: "2026-06-26T19:00:00", scoreA: null, scoreB: null, status: "pending" },

  // --- SÁBADO 27 DE JUNIO ---
  { id: "g29", type: "group", group: "L", teamA: "Panamá", teamB: "Inglaterra", date: "2026-06-27T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g30", type: "group", group: "L", teamA: "Croacia", teamB: "Ghana", date: "2026-06-27T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g31", type: "group", group: "K", teamA: "Colombia", teamB: "Portugal", date: "2026-06-27T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g32", type: "group", group: "J", teamA: "Jordania", teamB: "Argentina", date: "2026-06-27T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g33", type: "group", group: "H", teamA: "Cabo Verde", teamB: "España", date: "2026-06-27T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g34", type: "group", group: "H", teamA: "Arabia Saudita", teamB: "Uruguay", date: "2026-06-27T19:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g35", type: "group", group: "K", teamA: "Uzbekistán", teamB: "R.D. Congo", date: "2026-06-27T22:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "g36", type: "group", group: "J", teamA: "Argelia", teamB: "Austria", date: "2026-06-27T22:00:00", scoreA: null, scoreB: null, status: "pending" },

  // --- ELIMINATORIAS (PLANTILLAS QUE EL ADMIN COMPLETA) ---
  { id: "r32_1", type: "knockout", stage: "Dieciseisavos", teamA: "1º Grupo A", teamB: "3º Grupo C/D/E", date: "2026-06-28T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r32_2", type: "knockout", stage: "Dieciseisavos", teamA: "2º Grupo A", teamB: "2º Grupo B", date: "2026-06-28T20:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r32_3", type: "knockout", stage: "Dieciseisavos", teamA: "1º Grupo B", teamB: "3º Grupo A/C/D", date: "2026-06-29T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r32_4", type: "knockout", stage: "Dieciseisavos", teamA: "1º Grupo C", teamB: "2º Grupo F", date: "2026-06-29T20:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r32_5", type: "knockout", stage: "Dieciseisavos", teamA: "1º Grupo E", teamB: "2º Grupo D", date: "2026-06-30T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r32_6", type: "knockout", stage: "Dieciseisavos", teamA: "1º Grupo F", teamB: "3º Grupo B/E/F", date: "2026-06-30T20:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r32_7", type: "knockout", stage: "Dieciseisavos", teamA: "1º Grupo D", teamB: "3º Grupo B/C/F", date: "2026-07-01T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r32_8", type: "knockout", stage: "Dieciseisavos", teamA: "2º Grupo C", teamB: "2º Grupo E", date: "2026-07-01T20:00:00", scoreA: null, scoreB: null, status: "pending" },
  
  { id: "r16_1", type: "knockout", stage: "Octavos", teamA: "Ganador R32-1", teamB: "Ganador R32-2", date: "2026-07-04T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r16_2", type: "knockout", stage: "Octavos", teamA: "Ganador R32-3", teamB: "Ganador R32-4", date: "2026-07-04T20:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r16_3", type: "knockout", stage: "Octavos", teamA: "Ganador R32-5", teamB: "Ganador R32-6", date: "2026-07-05T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "r16_4", type: "knockout", stage: "Octavos", teamA: "Ganador R32-7", teamB: "Ganador R32-8", date: "2026-07-05T20:00:00", scoreA: null, scoreB: null, status: "pending" },

  { id: "qf_1", type: "knockout", stage: "Cuartos", teamA: "Ganador Octavos 1", teamB: "Ganador Octavos 2", date: "2026-07-09T17:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "qf_2", type: "knockout", stage: "Cuartos", teamA: "Ganador Octavos 3", teamB: "Ganador Octavos 4", date: "2026-07-10T17:00:00", scoreA: null, scoreB: null, status: "pending" },

  { id: "sf_1", type: "knockout", stage: "Semifinal", teamA: "Ganador Cuartos 1", teamB: "Ganador Cuartos 2", date: "2026-07-14T20:00:00", scoreA: null, scoreB: null, status: "pending" },
  
  { id: "third", type: "knockout", stage: "Tercer Puesto", teamA: "Perdedor Semifinal 1", teamB: "Perdedor Semifinal 2", date: "2026-07-18T16:00:00", scoreA: null, scoreB: null, status: "pending" },
  { id: "final", type: "knockout", stage: "Final", teamA: "Ganador Semifinal 1", teamB: "Ganador Semifinal 2", date: "2026-07-19T17:00:00", scoreA: null, scoreB: null, status: "pending" }
];

// Estado global de la aplicación
let state = {
  users: [],              // Lista de usuarios: [{ id, name, pin }]
  matches: [],            // Partidos en juego
  predictions: {},        // Mapa: userId -> matchId -> { goalsA, goalsB, multimoshi }
  activeUserId: null      // ID del usuario que está usando la app actualmente
};

// Variable temporal para recordar el cambio de usuario fallido o pendiente de PIN
let pendingUserId = null;

// Inicializa Firebase si se han configurado las claves
function initFirebase() {
  if (FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.apiKey) {
    try {
      firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.firestore();
      isFirebaseEnabled = true;
      console.log("Firebase conectado correctamente.");
      
      // Actualizar Banner de Estado
      const banner = document.getElementById("firebase-status-banner");
      if (banner) {
        banner.className = "status-banner cloud-mode";
        banner.querySelector(".status-icon").innerText = "🟢";
        banner.querySelector(".status-text").innerText = "Modo Nube: Los pronósticos y resultados están sincronizados en tiempo real.";
      }
      
      // Sembrar datos iniciales en la base de datos si no existen
      checkAndSeedDatabase().then(() => {
        setupFirebaseListeners();
      });

    } catch (e) {
      console.error("Error inicializando Firebase, cayendo en modo local.", e);
      setupLocalMode();
    }
  } else {
    console.log("Firebase no configurado. Iniciando en modo local.");
    setupLocalMode();
  }
}

// Configura el modo local tradicional con localStorage
function setupLocalMode() {
  isFirebaseEnabled = false;
  loadLocalState();
  renderAll();
}

// Sembrar los partidos por defecto en Firestore la primera vez que se use
async function checkAndSeedDatabase() {
  if (!db) return;
  try {
    const matchesRef = db.collection("matches");
    const snapshot = await matchesRef.limit(1).get();
    
    // Sembrar partidos si la colección está vacía
    if (snapshot.empty) {
      console.log("Colección de partidos vacía en Firestore. Sembrando partidos iniciales...");
      const batch = db.batch();
      INITIAL_MATCHES.forEach(match => {
        const docRef = matchesRef.doc(match.id);
        batch.set(docRef, {
          id: match.id,
          type: match.type,
          group: match.group || null,
          stage: match.stage || null,
          teamA: match.teamA,
          teamB: match.teamB,
          date: match.date,
          scoreA: match.scoreA,
          scoreB: match.scoreB,
          status: match.status
        });
      });

      // Sembrar usuarios por defecto si no existen
      const usersRef = db.collection("users");
      const userSnapshot = await usersRef.limit(1).get();
      if (userSnapshot.empty) {
        batch.set(usersRef.doc("u1"), { id: "u1", name: "Papá", pin: "" });
        batch.set(usersRef.doc("u2"), { id: "u2", name: "Mamá", pin: "" });
        batch.set(usersRef.doc("u3"), { id: "u3", name: "Sofi", pin: "" });
      }

      await batch.commit();
      console.log("Partidos y usuarios base cargados en la nube con éxito.");
    }
  } catch (error) {
    console.error("Error sembrando base de datos en Firestore:", error);
  }
}

// Configura escuchadores de Firestore en tiempo real
function setupFirebaseListeners() {
  if (!db) return;

  // 1. Escuchar lista de usuarios
  db.collection("users").onSnapshot(snapshot => {
    const usersList = [];
    snapshot.forEach(doc => {
      usersList.push(doc.data());
    });
    state.users = usersList;

    // Cargar usuario activo recordado de localStorage o poner el primero de la base
    const savedActiveUser = localStorage.getItem("active_user_id");
    if (savedActiveUser && state.users.find(u => u.id === savedActiveUser)) {
      state.activeUserId = savedActiveUser;
    } else if (state.users.length > 0 && !state.activeUserId) {
      state.activeUserId = state.users[0].id;
    }

    renderActiveUserProfile();
    renderLeaderboard();
  }, err => console.error("Error escuchando usuarios:", err));

  // 2. Escuchar lista de partidos
  db.collection("matches").onSnapshot(snapshot => {
    const matchesList = [];
    snapshot.forEach(doc => {
      matchesList.push(doc.data());
    });
    // Ordenar partidos cronológicamente
    matchesList.sort((a, b) => new Date(a.date) - new Date(b.date));
    state.matches = matchesList;

    renderMatches();
    renderAdminMatches();
    renderLeaderboard();
  }, err => console.error("Error escuchando partidos:", err));

  // 3. Escuchar todas las predicciones para generar la tabla de posiciones en tiempo real
  db.collection("predictions").onSnapshot(snapshot => {
    const predictionsMap = {};
    snapshot.forEach(doc => {
      const pred = doc.data();
      if (!predictionsMap[pred.userId]) {
        predictionsMap[pred.userId] = {};
      }
      predictionsMap[pred.userId][pred.matchId] = {
        goalsA: pred.goalsA,
        goalsB: pred.goalsB,
        multimoshi: pred.multimoshi
      };
    });
    state.predictions = predictionsMap;

    renderActiveUserProfile();
    renderLeaderboard();
    renderMatches();
  }, err => console.error("Error escuchando predicciones:", err));
}

// Carga el estado de modo Local desde localStorage
function loadLocalState() {
  const savedState = localStorage.getItem("prode_mundial_state");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      if (!state.users) state.users = [];
      if (!state.matches || state.matches.length === 0) state.matches = [...INITIAL_MATCHES];
      if (!state.predictions) state.predictions = {};
    } catch (e) {
      console.error("Error cargando localStorage local, reiniciando.", e);
      resetLocalToDefault();
    }
  } else {
    resetLocalToDefault();
  }
}

// Reinicia el estado local por defecto
function resetLocalToDefault() {
  state.users = [
    { id: "u1", name: "Papá", pin: "" },
    { id: "u2", name: "Mamá", pin: "" },
    { id: "u3", name: "Sofi", pin: "" }
  ];
  state.matches = [...INITIAL_MATCHES];
  state.predictions = {
    "u1": {},
    "u2": {},
    "u3": {}
  };
  state.activeUserId = "u1";
}

// Guarda los datos en localStorage (solo para modo local) y renderiza
function saveState() {
  if (!isFirebaseEnabled) {
    localStorage.setItem("prode_mundial_state", JSON.stringify(state));
    renderAll();
  }
}

// Limpia toda la base de datos (tanto local como en la nube si está habilitado)
async function clearAllData() {
  if (confirm("¿Estás seguro de que quieres borrar todos los datos del Prode? Se perderán usuarios, predicciones y resultados de forma definitiva.")) {
    if (isFirebaseEnabled && db) {
      try {
        // Borrar usuarios, predicciones y resetear partidos en la nube
        const batch = db.batch();
        
        const usersSnap = await db.collection("users").get();
        usersSnap.forEach(doc => batch.delete(doc.ref));

        const predsSnap = await db.collection("predictions").get();
        predsSnap.forEach(doc => batch.delete(doc.ref));

        const matchesSnap = await db.collection("matches").get();
        matchesSnap.forEach(doc => batch.delete(doc.ref));

        await batch.commit();
        localStorage.clear();
        state.activeUserId = null;
        
        // Re-sembrar partidos
        await checkAndSeedDatabase();
        alert("Prode reiniciado en la nube con éxito.");
      } catch (e) {
        alert("Error borrando datos de Firebase: " + e.message);
      }
    } else {
      resetLocalToDefault();
      saveState();
    }
  }
}

// Lógica de cálculo de puntuación para una predicción
function calculatePoints(predA, predB, realA, realB) {
  if (predA === undefined || predB === undefined || predA === null || predB === null ||
      realA === undefined || realB === undefined || realA === null || realB === null) {
    return { total: 0, details: { exact: false, winner: false, goalsA: false, goalsB: false } };
  }

  const pA = parseInt(predA);
  const pB = parseInt(predB);
  const rA = parseInt(realA);
  const rB = parseInt(realB);

  const predWinner = pA > pB ? 'A' : (pA < pB ? 'B' : 'D');
  const realWinner = rA > rB ? 'A' : (rA < rB ? 'B' : 'D');

  const isExact = (pA === rA && pB === rB);
  const isWinner = (predWinner === realWinner);
  const isGoalsA = (pA === rA);
  const isGoalsB = (pB === rB);

  let points = 0;
  if (isExact) {
    points = 6;
  } else {
    if (isWinner) {
      points += 3;
    }
    if (isGoalsA) {
      points += 1;
    }
    if (isGoalsB) {
      points += 1;
    }
  }

  return {
    total: points,
    details: {
      exact: isExact,
      winner: isWinner && !isExact,
      goalsA: isGoalsA && !isExact,
      goalsB: isGoalsB && !isExact
    }
  };
}

// Obtener estadísticas globales de un usuario
function getUserStats(userId) {
  let totalPoints = 0;
  let matchesPredicted = 0;
  let exactMatches = 0;
  let winnerMatches = 0;
  let goalsMatches = 0;
  let multimoshiCount = 0;

  const userPredictions = state.predictions[userId] || {};

  state.matches.forEach(match => {
    const pred = userPredictions[match.id];
    if (pred && pred.goalsA !== "" && pred.goalsB !== "" && pred.goalsA !== null && pred.goalsB !== null) {
      matchesPredicted++;
      if (pred.multimoshi) {
        multimoshiCount++;
      }

      if (match.status === "completed") {
        const score = calculatePoints(pred.goalsA, pred.goalsB, match.scoreA, match.scoreB);
        let matchPoints = score.total;
        if (pred.multimoshi) {
          matchPoints *= 2;
        }
        totalPoints += matchPoints;

        if (score.details.exact) exactMatches++;
        if (score.details.winner) winnerMatches++;
        if (score.details.goalsA) goalsMatches++;
        if (score.details.goalsB) goalsMatches++;
      }
    }
  });

  return {
    userId,
    userName: state.users.find(u => u.id === userId)?.name || "Desconocido",
    totalPoints,
    matchesPredicted,
    exactMatches,
    winnerMatches,
    goalsMatches,
    multimoshiCount
  };
}

// Obtiene la cantidad de Multimoshis activos de un usuario
function getMultimoshiUsedCount(userId) {
  const userPredictions = state.predictions[userId] || {};
  return Object.values(userPredictions).filter(pred => pred.multimoshi === true).length;
}

// --- RENDERIZADO DE INTERFAZ ---

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('es-AR', options);
}

// Genera y dibuja la tabla de posiciones (Leaderboard)
function renderLeaderboard() {
  const leaderboardBody = document.getElementById("leaderboard-body");
  if (!leaderboardBody) return;

  const listStats = state.users.map(u => getUserStats(u.id));
  
  // Ordenar posiciones
  listStats.sort((a, b) => b.totalPoints - a.totalPoints || b.exactMatches - a.exactMatches);

  leaderboardBody.innerHTML = "";
  listStats.forEach((stat, index) => {
    const tr = document.createElement("tr");
    if (stat.userId === state.activeUserId) {
      tr.classList.add("active-user-row");
    }

    let rankBadge = index + 1;
    if (index === 0) rankBadge = "🏆";
    else if (index === 1) rankBadge = "🥈";
    else if (index === 2) rankBadge = "🥉";

    tr.innerHTML = `
      <td><span class="rank-badge">${rankBadge}</span></td>
      <td class="user-name-cell">${escapeHtml(stat.userName)}</td>
      <td class="points-cell">${stat.totalPoints} pts</td>
      <td>${stat.matchesPredicted} / ${state.matches.length}</td>
      <td>
        <span class="badge badge-exact" title="Exactos (6 pts)">${stat.exactMatches}🎯</span>
        <span class="badge badge-winner" title="Ganadores (3 pts)">${stat.winnerMatches}🏅</span>
        <span class="badge badge-goals" title="Goles Acertados (1 pt)">${stat.goalsMatches}⚽</span>
      </td>
      <td>
        ${getMultimoshiIconsHtml(stat.multimoshiCount)}
      </td>
    `;
    
    // Cambiar de usuario al hacer clic en la fila de la tabla
    tr.addEventListener("click", () => {
      switchUser(stat.userId);
    });
    leaderboardBody.appendChild(tr);
  });
}

// Renderiza la lista de partidos
function renderMatches() {
  const matchesList = document.getElementById("matches-list");
  if (!matchesList) return;

  const activeUserId = state.activeUserId;
  const userPredictions = state.predictions[activeUserId] || {};

  matchesList.innerHTML = "";
  const activeTab = document.querySelector(".tab-btn.active")?.dataset.tab || "all";

  let filteredMatches = state.matches;
  if (activeTab === "group") {
    filteredMatches = state.matches.filter(m => m.type === "group");
  } else if (activeTab === "knockout") {
    filteredMatches = state.matches.filter(m => m.type === "knockout");
  } else if (activeTab === "completed") {
    filteredMatches = state.matches.filter(m => m.status === "completed");
  } else if (activeTab === "pending") {
    filteredMatches = state.matches.filter(m => m.status === "pending");
  }

  if (filteredMatches.length === 0) {
    matchesList.innerHTML = `<div class="empty-list">No hay partidos que coincidan con este filtro.</div>`;
    return;
  }

  filteredMatches.forEach(match => {
    const pred = userPredictions[match.id] || { goalsA: null, goalsB: null, multimoshi: false };
    const hasPredicted = (pred.goalsA !== null && pred.goalsB !== null && pred.goalsA !== "" && pred.goalsB !== "");
    
    const isCompleted = match.status === "completed";
    let matchPointsInfo = "";
    
    if (isCompleted && hasPredicted) {
      const scoreData = calculatePoints(pred.goalsA, pred.goalsB, match.scoreA, match.scoreB);
      let pts = scoreData.total;
      if (pred.multimoshi) pts *= 2;
      
      let badgeClass = "pts-zero";
      if (pts >= 12) badgeClass = "pts-super";
      else if (pts >= 6) badgeClass = "pts-high";
      else if (pts > 0) badgeClass = "pts-low";

      matchPointsInfo = `
        <div class="points-earned-badge ${badgeClass}">
          +${pts} pts ${pred.multimoshi ? '🚀' : ''}
        </div>
      `;
    }

    const card = document.createElement("div");
    card.className = `match-card ${isCompleted ? 'completed-card' : ''} ${pred.multimoshi ? 'multimoshi-active' : ''}`;
    card.id = `match-${match.id}`;

    const groupOrStage = match.type === "group" ? `Grupo ${match.group}` : match.stage;

    card.innerHTML = `
      <div class="match-header">
        <span class="match-badge">${groupOrStage}</span>
        <span class="match-date">${formatDate(match.date)}</span>
        ${matchPointsInfo}
      </div>
      <div class="match-main">
        <!-- Equipo A -->
        <div class="team-container team-left">
          <div class="team-flag-container">${getFlagHtml(match.teamA)}</div>
          <span class="team-name" title="${match.teamA}">${match.teamA}</span>
        </div>

        <!-- Predict Inputs y Resultados Reales -->
        <div class="scores-container">
          <div class="prediction-inputs-row">
            <input type="number" min="0" max="20" placeholder="-" 
              class="goal-input team-a-pred" 
              value="${pred.goalsA !== null ? pred.goalsA : ''}"
              ${isCompleted ? 'disabled' : ''}
              data-match-id="${match.id}" data-team="A">
            <span class="vs-text">vs</span>
            <input type="number" min="0" max="20" placeholder="-" 
              class="goal-input team-b-pred" 
              value="${pred.goalsB !== null ? pred.goalsB : ''}"
              ${isCompleted ? 'disabled' : ''}
              data-match-id="${match.id}" data-team="B">
          </div>

          ${isCompleted ? `
            <div class="real-score-row">
              <span class="real-score-badge">${match.scoreA} - ${match.scoreB}</span>
              <span class="real-score-lbl">Resultado Real</span>
            </div>
          ` : `
            <div class="real-score-row pending-row">
              <span>Pendiente</span>
            </div>
          `}
        </div>

        <!-- Equipo B -->
        <div class="team-container team-right">
          <span class="team-name" title="${match.teamB}">${match.teamB}</span>
          <div class="team-flag-container">${getFlagHtml(match.teamB)}</div>
        </div>
      </div>

      <div class="match-footer">
        <button class="multimoshi-toggle-btn ${pred.multimoshi ? 'active' : ''}" 
          data-match-id="${match.id}"
          ${isCompleted ? 'disabled' : ''}
          title="Duplica los puntos de este partido (Máximo 2)">
          ${getBulldogSvgHtml(pred.multimoshi)}
          <span class="btn-text">${pred.multimoshi ? '¡Multimoshi Activo!' : 'Usar Multimoshi'}</span>
        </button>
      </div>
    `;

    // Event listeners
    const inputs = card.querySelectorAll(".goal-input");
    inputs.forEach(input => {
      input.addEventListener("change", (e) => {
        savePrediction(e.target.dataset.matchId, e.target.dataset.team, e.target.value);
      });
      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          savePrediction(e.target.dataset.matchId, e.target.dataset.team, e.target.value);
          e.target.blur();
        }
      });
    });

    const multimoshiBtn = card.querySelector(".multimoshi-toggle-btn");
    multimoshiBtn.addEventListener("click", () => {
      toggleMultimoshi(match.id);
    });

    matchesList.appendChild(card);
  });
}

// Guarda la predicción (soporta nube y local)
function savePrediction(matchId, team, value) {
  const activeUserId = state.activeUserId;
  if (!activeUserId) return;

  const val = value === "" ? null : parseInt(value);

  // Leer los valores actuales para guardarlos combinados
  const userPredictions = state.predictions[activeUserId] || {};
  const pred = userPredictions[matchId] || { goalsA: null, goalsB: null, multimoshi: false };
  
  let valA = pred.goalsA;
  let valB = pred.goalsB;

  if (team === 'A') {
    valA = val;
  } else {
    valB = val;
  }

  if (isFirebaseEnabled && db) {
    const docId = `${activeUserId}_${matchId}`;
    db.collection("predictions").doc(docId).set({
      userId: activeUserId,
      matchId: matchId,
      goalsA: valA,
      goalsB: valB,
      multimoshi: pred.multimoshi
    }, { merge: true }).catch(err => {
      console.error("Error guardando predicción en Firestore:", err);
    });
  } else {
    if (!state.predictions[activeUserId]) {
      state.predictions[activeUserId] = {};
    }
    if (!state.predictions[activeUserId][matchId]) {
      state.predictions[activeUserId][matchId] = { goalsA: null, goalsB: null, multimoshi: false };
    }
    state.predictions[activeUserId][matchId].goalsA = valA;
    state.predictions[activeUserId][matchId].goalsB = valB;
    saveState();
  }
}

// Activa o desactiva "multimoshi"
function toggleMultimoshi(matchId) {
  const activeUserId = state.activeUserId;
  if (!activeUserId) return;

  const userPredictions = state.predictions[activeUserId] || {};
  const pred = userPredictions[matchId] || { goalsA: null, goalsB: null, multimoshi: false };

  const currentStatus = pred.multimoshi;
  const multimoshiUsed = getMultimoshiUsedCount(activeUserId);

  if (!currentStatus && multimoshiUsed >= 2) {
    alert("¡Ya has usado tus 2 multiplicadores 'Multimoshi'! Desactiva uno primero si quieres usarlo en este partido.");
    return;
  }

  const nextStatus = !currentStatus;

  if (isFirebaseEnabled && db) {
    const docId = `${activeUserId}_${matchId}`;
    db.collection("predictions").doc(docId).set({
      userId: activeUserId,
      matchId: matchId,
      goalsA: pred.goalsA,
      goalsB: pred.goalsB,
      multimoshi: nextStatus
    }, { merge: true }).catch(err => {
      console.error("Error toggling multimoshi en Firestore:", err);
    });
  } else {
    if (!state.predictions[activeUserId]) {
      state.predictions[activeUserId] = {};
    }
    if (!state.predictions[activeUserId][matchId]) {
      state.predictions[activeUserId][matchId] = { goalsA: null, goalsB: null, multimoshi: false };
    }
    state.predictions[activeUserId][matchId].multimoshi = nextStatus;
    saveState();
  }
}

// Renderiza la cabecera del usuario activo
function renderActiveUserProfile() {
  const activeUser = state.users.find(u => u.id === state.activeUserId);
  if (!activeUser) return;

  document.getElementById("active-user-display-name").innerText = activeUser.name;
  
  const stats = getUserStats(state.activeUserId);
  document.getElementById("user-pts-counter").innerText = `${stats.totalPoints} pts`;
  document.getElementById("user-predictions-counter").innerText = `${stats.matchesPredicted} partidos`;

  const multimoshiBox = document.getElementById("multimoshi-status-box");
  const count = stats.multimoshiCount;
  multimoshiBox.innerHTML = `
    ${getMultimoshiIconsHtml(count)}
    <span class="multimoshi-count-lbl">Multimoshi: ${count}/2 usados</span>
  `;

  // Selector en el Header
  const userSelector = document.getElementById("user-select-dropdown");
  if (userSelector) {
    userSelector.innerHTML = "";
    state.users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id;
      option.innerText = user.name + (user.pin ? " 🔒" : "");
      if (user.id === state.activeUserId) {
        option.selected = true;
      }
      userSelector.appendChild(option);
    });
  }
}

// Cambia al usuario activo. Si tiene PIN y no ha sido verificado, abre el modal
function switchUser(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;

  // Si tiene PIN
  if (user.pin) {
    const isAuthed = localStorage.getItem("authed_user_" + userId) === "true";
    if (!isAuthed) {
      pendingUserId = userId;
      // Abrir modal de PIN
      const pinModal = document.getElementById("pin-auth-modal");
      if (pinModal) {
        pinModal.classList.add("active");
        document.getElementById("auth-user-pin").value = "";
        document.getElementById("auth-user-pin").focus();
      }
      // Revertir el dropdown visualmente por el momento
      renderActiveUserProfile();
      return;
    }
  }

  state.activeUserId = userId;
  localStorage.setItem("active_user_id", userId);
  saveState();
  if (isFirebaseEnabled) {
    renderActiveUserProfile();
    renderMatches();
  }
}

// Crea un nuevo usuario en la base de datos (local o nube)
function createNewUser() {
  const nameInput = document.getElementById("new-user-name");
  const pinInput = document.getElementById("new-user-pin");
  
  const name = nameInput.value.trim();
  const pin = pinInput.value.trim();
  
  if (!name) {
    alert("Por favor, introduce un nombre para el participante.");
    return;
  }

  if (state.users.find(u => u.name.toLowerCase() === name.toLowerCase())) {
    alert("Este participante ya existe.");
    return;
  }

  if (pin && (pin.length !== 4 || isNaN(pin))) {
    alert("El PIN de seguridad debe ser de exactamente 4 números.");
    return;
  }

  const newId = "u_" + Date.now();

  if (isFirebaseEnabled && db) {
    db.collection("users").doc(newId).set({
      id: newId,
      name: name,
      pin: pin // Guardar en texto plano para este prode familiar sencillo
    }).then(() => {
      // Marcar este dispositivo como autorizado para el creador
      if (pin) {
        localStorage.setItem("authed_user_" + newId, "true");
      }
      state.activeUserId = newId;
      localStorage.setItem("active_user_id", newId);
      
      nameInput.value = "";
      pinInput.value = "";
      document.getElementById("add-user-modal").classList.remove("active");
    }).catch(err => {
      alert("Error registrando usuario en la nube: " + err.message);
    });
  } else {
    state.users.push({ id: newId, name: name, pin: pin });
    state.predictions[newId] = {};
    if (pin) {
      localStorage.setItem("authed_user_" + newId, "true");
    }
    state.activeUserId = newId;
    localStorage.setItem("active_user_id", newId);

    nameInput.value = "";
    pinInput.value = "";
    document.getElementById("add-user-modal").classList.remove("active");
    saveState();
  }
}

// Verifica el PIN de seguridad introducido por el usuario
function verifyUserPin() {
  const pinValue = document.getElementById("auth-user-pin").value.trim();
  if (!pendingUserId) return;

  const user = state.users.find(u => u.id === pendingUserId);
  if (!user) return;

  if (pinValue === user.pin) {
    localStorage.setItem("authed_user_" + pendingUserId, "true");
    state.activeUserId = pendingUserId;
    localStorage.setItem("active_user_id", pendingUserId);
    pendingUserId = null;
    
    document.getElementById("pin-auth-modal").classList.remove("active");
    
    saveState();
    if (isFirebaseEnabled) {
      renderActiveUserProfile();
      renderMatches();
    }
  } else {
    alert("PIN incorrecto. Inténtalo de nuevo.");
    document.getElementById("auth-user-pin").value = "";
    document.getElementById("auth-user-pin").focus();
  }
}

// --- CONSOLA DEL ADMINISTRADOR ---

function renderAdminMatches() {
  const adminMatchesList = document.getElementById("admin-matches-list");
  if (!adminMatchesList) return;

  adminMatchesList.innerHTML = "";
  state.matches.forEach(match => {
    const item = document.createElement("div");
    item.className = `admin-match-item ${match.status === 'completed' ? 'admin-completed' : ''}`;
    
    const isCompleted = match.status === "completed";
    const groupOrStage = match.type === "group" ? `Grupo ${match.group}` : match.stage;

    item.innerHTML = `
      <div class="admin-match-info">
        <span class="admin-stage-badge">${groupOrStage}</span>
        <div class="admin-teams-row">
          <input type="text" class="admin-team-name-input admin-team-a" 
            value="${escapeHtml(match.teamA)}" 
            data-match-id="${match.id}" data-team="A">
          <span class="admin-vs">vs</span>
          <input type="text" class="admin-team-name-input admin-team-b" 
            value="${escapeHtml(match.teamB)}" 
            data-match-id="${match.id}" data-team="B">
        </div>
        <span class="admin-date-text">${formatDate(match.date)}</span>
      </div>
      <div class="admin-match-actions">
        <div class="admin-score-inputs">
          <input type="number" min="0" class="admin-score-input team-a-real" 
            placeholder="-" value="${match.scoreA !== null ? match.scoreA : ''}"
            data-match-id="${match.id}" data-team="A">
          <span>-</span>
          <input type="number" min="0" class="admin-score-input team-b-real" 
            placeholder="-" value="${match.scoreB !== null ? match.scoreB : ''}"
            data-match-id="${match.id}" data-team="B">
        </div>
        
        <div class="admin-btn-group">
          <button class="admin-save-btn" data-match-id="${match.id}">Guardar</button>
          ${isCompleted ? `
            <button class="admin-reset-btn" data-match-id="${match.id}" title="Volver a pendiente">Deshacer</button>
          ` : ''}
        </div>
      </div>
    `;

    const saveBtn = item.querySelector(".admin-save-btn");
    saveBtn.addEventListener("click", () => {
      saveRealMatchResult(match.id, item);
    });

    if (isCompleted) {
      const resetBtn = item.querySelector(".admin-reset-btn");
      resetBtn.addEventListener("click", () => {
        resetRealMatchResult(match.id);
      });
    }

    adminMatchesList.appendChild(item);
  });
}

// Guarda resultado de partido en local o nube
function saveRealMatchResult(matchId, cardElement) {
  const teamAInput = cardElement.querySelector(".admin-team-a");
  const teamBInput = cardElement.querySelector(".admin-team-b");
  const scoreAInput = cardElement.querySelector(".team-a-real");
  const scoreBInput = cardElement.querySelector(".team-b-real");

  const teamAVal = teamAInput.value.trim();
  const teamBVal = teamBInput.value.trim();
  const scoreAVal = scoreAInput.value.trim();
  const scoreBVal = scoreBInput.value.trim();

  const finalScoreA = scoreAVal !== "" ? parseInt(scoreAVal) : null;
  const finalScoreB = scoreBVal !== "" ? parseInt(scoreBVal) : null;
  const finalStatus = (scoreAVal !== "" && scoreBVal !== "") ? "completed" : "pending";

  if (isFirebaseEnabled && db) {
    db.collection("matches").doc(matchId).set({
      teamA: teamAVal,
      teamB: teamBVal,
      scoreA: finalScoreA,
      scoreB: finalScoreB,
      status: finalStatus
    }, { merge: true }).then(() => {
      console.log("Resultado guardado en Firebase.");
    }).catch(err => {
      alert("Error guardando resultado en la nube: " + err.message);
    });
  } else {
    const matchIndex = state.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;

    if (teamAVal) state.matches[matchIndex].teamA = teamAVal;
    if (teamBVal) state.matches[matchIndex].teamB = teamBVal;
    state.matches[matchIndex].scoreA = finalScoreA;
    state.matches[matchIndex].scoreB = finalScoreB;
    state.matches[matchIndex].status = finalStatus;

    saveState();
  }
}

// Resetea el resultado de un partido
function resetRealMatchResult(matchId) {
  if (isFirebaseEnabled && db) {
    db.collection("matches").doc(matchId).set({
      scoreA: null,
      scoreB: null,
      status: "pending"
    }, { merge: true }).catch(err => {
      console.error("Error reseteando partido en Firebase:", err);
    });
  } else {
    const matchIndex = state.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;
    state.matches[matchIndex].scoreA = null;
    state.matches[matchIndex].scoreB = null;
    state.matches[matchIndex].status = "pending";
    saveState();
  }
}

// Agrega un partido manual (soporta nube y local)
function addNewMatch() {
  const typeSelect = document.getElementById("new-match-type");
  const groupInput = document.getElementById("new-match-group");
  const stageInput = document.getElementById("new-match-stage");
  const teamAInput = document.getElementById("new-match-team-a");
  const teamBInput = document.getElementById("new-match-team-b");
  const dateInput = document.getElementById("new-match-date");

  const type = typeSelect.value;
  const teamA = teamAInput.value.trim() || "Equipo A";
  const teamB = teamBInput.value.trim() || "Equipo B";
  const dateVal = dateInput.value;

  if (!dateVal) {
    alert("Por favor selecciona una fecha y hora para el partido.");
    return;
  }

  const matchId = "custom_" + Date.now();
  const newMatch = {
    id: matchId,
    type: type,
    group: type === "group" ? (groupInput.value.trim() || "A") : null,
    stage: type === "knockout" ? (stageInput.value.trim() || "Llaves") : null,
    teamA: teamA,
    teamB: teamB,
    date: dateVal,
    scoreA: null,
    scoreB: null,
    status: "pending"
  };

  if (isFirebaseEnabled && db) {
    db.collection("matches").doc(matchId).set(newMatch).then(() => {
      console.log("Partido agregado en la nube.");
      teamAInput.value = "";
      teamBInput.value = "";
    }).catch(err => {
      alert("Error agregando partido en la nube: " + err.message);
    });
  } else {
    state.matches.push(newMatch);
    state.matches.sort((a, b) => new Date(a.date) - new Date(b.date));
    teamAInput.value = "";
    teamBInput.value = "";
    saveState();
  }
}

// --- IMPORTACIÓN / EXPORTACIÓN JSON ---

function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  downloadAnchor.setAttribute("download", `prode_familiar_backup_${dateStr}.json`);
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const importedState = JSON.parse(e.target.result);
      
      if (importedState && Array.isArray(importedState.users) && Array.isArray(importedState.matches) && importedState.predictions) {
        
        if (isFirebaseEnabled && db) {
          if (!confirm("¿Deseas sobreescribir los datos actuales de la nube con este archivo?")) return;
          
          // Importación masiva a Firebase
          const batch = db.batch();
          
          // Limpiar colecciones anteriores
          const usersSnap = await db.collection("users").get();
          usersSnap.forEach(doc => batch.delete(doc.ref));
          const predsSnap = await db.collection("predictions").get();
          predsSnap.forEach(doc => batch.delete(doc.ref));
          const matchesSnap = await db.collection("matches").get();
          matchesSnap.forEach(doc => batch.delete(doc.ref));

          // Cargar nuevos
          importedState.users.forEach(u => {
            batch.set(db.collection("users").doc(u.id), { id: u.id, name: u.name, pin: u.pin || "" });
          });

          importedState.matches.forEach(m => {
            batch.set(db.collection("matches").doc(m.id), m);
          });

          Object.keys(importedState.predictions).forEach(userId => {
            Object.keys(importedState.predictions[userId]).forEach(matchId => {
              const pred = importedState.predictions[userId][matchId];
              batch.set(db.collection("predictions").doc(`${userId}_${matchId}`), {
                userId,
                matchId,
                goalsA: pred.goalsA,
                goalsB: pred.goalsB,
                multimoshi: pred.multimoshi
              });
            });
          });

          await batch.commit();
          alert("¡Importado correctamente en Firebase!");
        } else {
          state = importedState;
          if (!state.activeUserId && state.users.length > 0) {
            state.activeUserId = state.users[0].id;
          }
          saveState();
          alert("¡Datos del Prode importados localmente!");
        }
      } else {
        alert("El archivo no tiene el formato del Prode válido.");
      }
    } catch (err) {
      alert("Error leyendo el archivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

// --- UTILERÍAS ---

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFlagHtml(teamName) {
  const codes = {
    "Argentina": "ar", "Alemania": "de", "Brasil": "br", "España": "es", 
    "Francia": "fr", "Inglaterra": "gb-eng", "Uruguay": "uy", "Bélgica": "be", 
    "Portugal": "pt", "México": "mx", "EE. UU.": "us", "Estados Unidos": "us",
    "Japón": "jp", "Países Bajos": "nl", "Croacia": "hr", "Colombia": "co",
    "Ecuador": "ec", "Marruecos": "ma", "Senegal": "sn", "Corea del Sur": "kr",
    "Suiza": "ch", "Canadá": "ca", "Australia": "au", "Costa de Marfil": "ci",
    "Cabo Verde": "cv", "Egipto": "eg", "Ghana": "gh", "Irán": "ir", 
    "Irak": "iq", "Jordania": "jo", "Argelia": "dz", "Austria": "at",
    "Uzbekistán": "uz", "R.D. Congo": "cd", "Congo DR": "cd", "Haití": "ht", 
    "Catar": "qa", "Qatar": "qa", "Rep. Checa": "cz", "Czechia": "cz", 
    "Sudáfrica": "za", "Curazao": "cw", "Suecia": "se", "Túnez": "tn", 
    "Turquía": "tr", "Noruega": "no", "Escocia": "gb-sct", "Panamá": "pa",
    "Bosnia y Herz.": "ba", "Nueva Zelanda": "nz", "Saudi Arabia": "sa",
    "Arabia Saudita": "sa", "Paraguay": "py"
  };

  const nameTrimmed = teamName.trim();
  const code = codes[nameTrimmed];

  if (code) {
    return `<img src="https://flagcdn.com/w80/${code}.png" class="team-flag-img" alt="Bandera de ${teamName}">`;
  }
  return `<span class="team-flag-placeholder-icon">🛡️</span>`;
}

function getBulldogSvgHtml(isActive) {
  const activeClass = isActive ? 'active' : 'inactive';
  return `
    <svg class="moshi-icon ${activeClass}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 28 42 C 22 30, 18 12, 30 8 C 42 4, 44 24, 46 36 C 48 36, 52 36, 54 36 C 56 24, 58 4, 70 8 C 82 12, 78 30, 72 42 C 84 48, 86 64, 72 76 C 62 86, 38 86, 28 76 C 14 64, 16 48, 28 42 Z" />
    </svg>
  `;
}

function getMultimoshiIconsHtml(count) {
  let html = '<div class="moshi-icons-row">';
  for (let i = 0; i < 2; i++) {
    html += getBulldogSvgHtml(i < count);
  }
  html += '</div>';
  return html;
}

// --- RENDERIZADO GENERAL ---

function renderAll() {
  renderActiveUserProfile();
  renderLeaderboard();
  renderMatches();
  renderAdminMatches();
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  initFirebase();

  // Listeners del Header
  const userSelect = document.getElementById("user-select-dropdown");
  if (userSelect) {
    userSelect.addEventListener("change", (e) => {
      switchUser(e.target.value);
    });
  }

  // Modales
  const openAddUserBtn = document.getElementById("open-add-user-btn");
  const modal = document.getElementById("add-user-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const confirmAddUserBtn = document.getElementById("confirm-add-user-btn");

  if (openAddUserBtn && modal) {
    openAddUserBtn.addEventListener("click", () => {
      modal.classList.add("active");
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (confirmAddUserBtn) {
    confirmAddUserBtn.addEventListener("click", createNewUser);
  }

  // Modal de Verificación de PIN
  const closePinModalBtn = document.getElementById("close-pin-modal-btn");
  const confirmPinAuthBtn = document.getElementById("confirm-pin-auth-btn");
  if (closePinModalBtn) {
    closePinModalBtn.addEventListener("click", () => {
      document.getElementById("pin-auth-modal").classList.remove("active");
      pendingUserId = null;
      renderActiveUserProfile(); // Revertir visualmente el dropdown
    });
  }
  if (confirmPinAuthBtn) {
    confirmPinAuthBtn.addEventListener("click", verifyUserPin);
  }
  // Permite verificar PIN presionando Enter
  const authPinInput = document.getElementById("auth-user-pin");
  if (authPinInput) {
    authPinInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        verifyUserPin();
      }
    });
  }

  // Tabs de Filtro de Partidos
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMatches();
    });
  });

  // Admin Toggle
  const adminToggleHeader = document.getElementById("admin-toggle-header");
  const adminContent = document.getElementById("admin-content-section");
  if (adminToggleHeader && adminContent) {
    adminToggleHeader.addEventListener("click", () => {
      adminContent.classList.toggle("collapsed");
      adminToggleHeader.classList.toggle("active");
    });
  }

  // Manual Match creation toggles
  const newMatchType = document.getElementById("new-match-type");
  const newMatchGroupWrap = document.getElementById("new-match-group-wrapper");
  const newMatchStageWrap = document.getElementById("new-match-stage-wrapper");

  if (newMatchType && newMatchGroupWrap && newMatchStageWrap) {
    newMatchType.addEventListener("change", (e) => {
      if (e.target.value === "group") {
        newMatchGroupWrap.style.display = "block";
        newMatchStageWrap.style.display = "none";
      } else {
        newMatchGroupWrap.style.display = "none";
        newMatchStageWrap.style.display = "block";
      }
    });
  }

  const confirmNewMatchBtn = document.getElementById("confirm-new-match-btn");
  if (confirmNewMatchBtn) {
    confirmNewMatchBtn.addEventListener("click", addNewMatch);
  }

  // Sincronización JSON
  const exportBtn = document.getElementById("export-db-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportData);
  }

  const importInput = document.getElementById("import-db-input");
  if (importInput) {
    importInput.addEventListener("change", importData);
  }

  const importBtn = document.getElementById("import-db-btn");
  if (importBtn && importInput) {
    importBtn.addEventListener("click", () => {
      importInput.click();
    });
  }

  const dangerResetBtn = document.getElementById("danger-reset-btn");
  if (dangerResetBtn) {
    dangerResetBtn.addEventListener("click", clearAllData);
  }
});
