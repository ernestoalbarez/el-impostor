export type Language = 'es' | 'en' | 'de';

export const languageLabels: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
};

type TranslationKeys = {
  // Home
  home_subtitle: string;
  mode_classic: string;
  mode_classic_desc: string;
  mode_mystery: string;
  mode_mystery_desc: string;
  mode_chaos: string;
  mode_chaos_desc: string;
  stats: string;
  about: string;
  support: string;

  // Players
  players: string;
  players_count: string;
  players_min: string;
  player_name_placeholder: string;
  mode_label: string;
  continue: string;

  // Config
  config_title: string;
  impostor_count: string;
  max_for_players: string;
  hide_impostor_hint: string;
  hide_impostor_hint_desc: string;
  game_duration: string;
  min_label: string;
  start_game: string;

  // Role Reveal
  reveal_roles: string;
  reveal_roles_desc: string;
  your_role: string;
  your_word: string;
  role_civil: string;
  role_impostor: string;
  role_false_impostor: string;
  role_civil_desc: string;
  role_impostor_desc: string;
  role_false_impostor_desc: string;
  role_hidden: string;
  role_hidden_desc: string;
  false_impostor_hint: string;
  understood_back: string;
  start_match: string;
  restart_round: string;
  go_home: string;

  // Playing
  first_turn: string;
  remaining_players: string;
  voting: string;
  eliminate_player: string;
  eliminate_confirm_title: string;
  eliminate_confirm_desc: string;
  cancel: string;
  confirm_elimination: string;
  impostor_guessed_word: string;
  impostor_guess_title: string;
  impostor_guess_desc: string;
  confirm: string;
  restart_round_title: string;
  restart_round_desc: string;
  restart: string;

  // Timer
  time_remaining: string;
  game_paused: string;

  // Elimination Result
  impostor_eliminated: string;
  civil_eliminated: string;
  civils_win: string;
  impostors_win: string;
  see_results: string;
  continue_game: string;

  // Game End
  the_word_was: string;
  hint_label: string;
  impostors_in_game: string;
  roles_revealed: string;
  eliminated_label: string;
  play_again: string;
  change_mode: string;
  home: string;
  role_civil_label: string;
  role_impostor_label: string;
  role_false_impostor_label: string;
  unknown: string;

  // Stats
  stats_title: string;
  game_history: string;
  no_stats: string;
  play_to_start: string;
  games: string;
  civil: string;
  imp: string;
  false_label: string;
  wins_pct: string;
  clear_stats: string;
  back: string;

  // Support Prompt
  like_the_game: string;
  support_desc: string;
  support_project: string;
  later: string;
  never_show: string;

  // About Page
  about_title: string;
  about_what_title: string;
  about_what_desc: string;
  about_philosophy_title: string;
  about_uncertainty: string;
  about_uncertainty_desc: string;
  about_conversation: string;
  about_conversation_desc: string;
  about_deduction: string;
  about_deduction_desc: string;
  about_independent_title: string;
  about_independent_desc: string;
  about_made_by: string;

  // Support Page
  support_title: string;
  support_subtitle: string;
  support_why_title: string;
  support_why_desc: string;
  support_coffee_title: string;
  support_crypto_title: string;
  support_thanks: string;
};

const es: TranslationKeys = {
  home_subtitle: 'El caos es diseño intencional',
  mode_classic: 'CLÁSICO',
  mode_classic_desc: 'Los jugadores conocen su rol desde el inicio. La cantidad de impostores es definida manualmente por el anfitrión.',
  mode_mystery: 'MISTERIO',
  mode_mystery_desc: 'Roles e impostores asignados al azar. Nadie conoce su rol al inicio. Los roles se revelan al ser eliminados y al finalizar la partida se muestran todos.',
  mode_chaos: 'CAOS',
  mode_chaos_desc: 'Roles especiales, falsos impostores y pistas secundarias. El caos total donde nada es lo que parece.',
  stats: 'Estadísticas',
  about: 'Acerca de',
  support: 'Apoyar',

  players: 'Jugadores',
  players_count: 'jugadores',
  players_min: 'mínimo',
  player_name_placeholder: 'Nombre del jugador',
  mode_label: 'Modo',
  continue: 'Continuar',

  config_title: 'Configuración',
  impostor_count: 'Cantidad de impostores',
  max_for_players: 'Máximo: {max} para {count} jugadores',
  hide_impostor_hint: 'Ocultar pista a impostores',
  hide_impostor_hint_desc: 'Los impostores no recibirán palabra y deberán improvisar',
  game_duration: 'Duración de la partida',
  min_label: 'min',
  start_game: 'Iniciar partida',

  reveal_roles: 'Revelar roles',
  reveal_roles_desc: 'Cada jugador toca su nombre para ver su rol',
  your_role: 'Tu rol es',
  your_word: 'Tu palabra',
  role_civil: 'CIVIL',
  role_impostor: 'IMPOSTOR',
  role_false_impostor: 'CIVIL',
  role_civil_desc: 'Encuentra a los impostores',
  role_impostor_desc: 'No te descubran',
  role_false_impostor_desc: 'Encuentra a los impostores (NO sos impostor)',
  role_hidden: '???',
  role_hidden_desc: 'Tu rol se revelará durante la partida',
  false_impostor_hint: '⚠️ Tu palabra es una pista, pero NO sos impostor',
  understood_back: 'Entendido, volver',
  start_match: 'Comenzar partida',
  restart_round: 'Reiniciar ronda',
  go_home: 'Volver al inicio',

  first_turn: 'Primer turno',
  remaining_players: 'jugadores restantes',
  voting: 'Votación',
  eliminate_player: 'Eliminar a',
  eliminate_confirm_title: '¿Eliminar a {name}?',
  eliminate_confirm_desc: 'Esta acción no se puede deshacer. El jugador será eliminado de la partida.',
  cancel: 'Cancelar',
  confirm_elimination: 'Confirmar eliminación',
  impostor_guessed_word: 'Impostor adivinó la palabra',
  impostor_guess_title: '¿El impostor adivinó la palabra?',
  impostor_guess_desc: 'La partida terminará y se declarará victoria del equipo impostor. Esta acción no se puede deshacer.',
  confirm: 'Confirmar',
  restart_round_title: '¿Reiniciar ronda?',
  restart_round_desc: 'Se reasignarán roles, palabras y se reiniciará el timer. Las estadísticas y el historial se mantienen.',
  restart: 'Reiniciar',

  time_remaining: 'Tiempo restante',
  game_paused: 'Partida pausada',

  impostor_eliminated: '¡Impostor eliminado!',
  civil_eliminated: 'Civil eliminado',
  civils_win: '¡Civiles ganan!',
  impostors_win: '¡Impostores ganan!',
  see_results: 'Ver resultados',
  continue_game: 'Continuar partida',

  the_word_was: 'La palabra era',
  hint_label: 'Pista',
  impostors_in_game: 'Impostores en esta partida',
  roles_revealed: 'Roles revelados',
  eliminated_label: 'eliminado',
  play_again: 'Jugar otra ronda',
  change_mode: 'Cambiar modo de juego',
  home: 'Inicio',
  role_civil_label: 'Civil',
  role_impostor_label: 'Impostor',
  role_false_impostor_label: 'Falso Impostor',
  unknown: 'Desconocido',

  stats_title: 'Estadísticas',
  game_history: 'Historial de partidas',
  no_stats: 'No hay estadísticas aún',
  play_to_start: 'Jugá una partida para empezar',
  games: 'Partidas',
  civil: 'Civil',
  imp: 'Imp.',
  false_label: 'Falso',
  wins_pct: 'victorias',
  clear_stats: 'Borrar estadísticas',
  back: 'Volver',

  like_the_game: '¿Te gusta el juego?',
  support_desc: 'Si disfrutás el juego, podés ayudarnos a mantenerlo sin publicidad y seguir sumando contenido.',
  support_project: 'Apoyar proyecto',
  later: 'Más tarde',
  never_show: 'No volver a mostrar',

  about_title: 'Acerca del proyecto',
  about_what_title: '¿Qué es El Impostor?',
  about_what_desc: 'El Impostor es un juego social de deducción diseñado para jugar en persona con amigos. Un grupo de jugadores recibe una palabra secreta, pero entre ellos se esconden impostores que no la conocen. A través de la conversación, la observación y la estrategia, el grupo debe identificar quién miente… antes de que sea demasiado tarde.',
  about_philosophy_title: 'Filosofía de diseño',
  about_uncertainty: 'Incertidumbre',
  about_uncertainty_desc: 'El caos es intencional. Nunca sabés con certeza quién es quién.',
  about_conversation: 'Conversación',
  about_conversation_desc: 'El juego sucede entre las personas, no en la pantalla.',
  about_deduction: 'Deducción social',
  about_deduction_desc: 'Observar, preguntar y analizar son las herramientas del jugador.',
  about_independent_title: 'Proyecto independiente',
  about_independent_desc: 'Este proyecto es completamente independiente. No contiene publicidad, no recopila datos personales y no tiene fines comerciales. Fue creado por pasión al diseño de juegos y la programación.',
  about_made_by: 'Hecho con 🔥 por',

  support_title: 'Apoyar el proyecto',
  support_subtitle: 'Cada aporte cuenta',
  support_why_title: '¿Por qué apoyar?',
  support_why_desc: 'El Impostor se mantiene sin publicidad y sin funciones bloqueadas. Las contribuciones voluntarias ayudan a cubrir los costos de hosting, dominio y mantenimiento. Es completamente opcional — si disfrutás el juego, tu apoyo nos ayuda a seguir mejorándolo.',
  support_coffee_title: 'Cafecito (MercadoPago)',
  support_crypto_title: 'Criptomonedas',
  support_thanks: 'Gracias por ser parte de esto 🔥',
};

const en: TranslationKeys = {
  home_subtitle: 'Chaos is intentional design',
  mode_classic: 'CLASSIC',
  mode_classic_desc: 'Players know their role from the start. The number of impostors is set manually by the host.',
  mode_mystery: 'MYSTERY',
  mode_mystery_desc: 'Roles and impostors assigned randomly. No one knows their role at the start. Roles are revealed upon elimination and shown at the end.',
  mode_chaos: 'CHAOS',
  mode_chaos_desc: 'Special roles, false impostors and secondary hints. Total chaos where nothing is what it seems.',
  stats: 'Statistics',
  about: 'About',
  support: 'Support',

  players: 'Players',
  players_count: 'players',
  players_min: 'minimum',
  player_name_placeholder: 'Player name',
  mode_label: 'Mode',
  continue: 'Continue',

  config_title: 'Settings',
  impostor_count: 'Number of impostors',
  max_for_players: 'Max: {max} for {count} players',
  hide_impostor_hint: 'Hide hint from impostors',
  hide_impostor_hint_desc: 'Impostors will not receive a word and must improvise',
  game_duration: 'Game duration',
  min_label: 'min',
  start_game: 'Start game',

  reveal_roles: 'Reveal roles',
  reveal_roles_desc: 'Each player taps their name to see their role',
  your_role: 'Your role is',
  your_word: 'Your word',
  role_civil: 'CIVIL',
  role_impostor: 'IMPOSTOR',
  role_false_impostor: 'CIVIL',
  role_civil_desc: 'Find the impostors',
  role_impostor_desc: 'Don\'t get caught',
  role_false_impostor_desc: 'Find the impostors (you are NOT an impostor)',
  role_hidden: '???',
  role_hidden_desc: 'Your role will be revealed during the game',
  false_impostor_hint: '⚠️ Your word is a hint, but you are NOT an impostor',
  understood_back: 'Got it, go back',
  start_match: 'Start match',
  restart_round: 'Restart round',
  go_home: 'Back to home',

  first_turn: 'First turn',
  remaining_players: 'players remaining',
  voting: 'Voting',
  eliminate_player: 'Eliminate',
  eliminate_confirm_title: 'Eliminate {name}?',
  eliminate_confirm_desc: 'This action cannot be undone. The player will be eliminated from the game.',
  cancel: 'Cancel',
  confirm_elimination: 'Confirm elimination',
  impostor_guessed_word: 'Impostor guessed the word',
  impostor_guess_title: 'Did the impostor guess the word?',
  impostor_guess_desc: 'The game will end and the impostor team will be declared winners. This cannot be undone.',
  confirm: 'Confirm',
  restart_round_title: 'Restart round?',
  restart_round_desc: 'Roles, words and the timer will be reset. Stats and history are preserved.',
  restart: 'Restart',

  time_remaining: 'Time remaining',
  game_paused: 'Game paused',

  impostor_eliminated: 'Impostor eliminated!',
  civil_eliminated: 'Civil eliminated',
  civils_win: 'Civils win!',
  impostors_win: 'Impostors win!',
  see_results: 'See results',
  continue_game: 'Continue game',

  the_word_was: 'The word was',
  hint_label: 'Hint',
  impostors_in_game: 'Impostors in this game',
  roles_revealed: 'Roles revealed',
  eliminated_label: 'eliminated',
  play_again: 'Play another round',
  change_mode: 'Change game mode',
  home: 'Home',
  role_civil_label: 'Civil',
  role_impostor_label: 'Impostor',
  role_false_impostor_label: 'False Impostor',
  unknown: 'Unknown',

  stats_title: 'Statistics',
  game_history: 'Game history',
  no_stats: 'No statistics yet',
  play_to_start: 'Play a game to get started',
  games: 'Games',
  civil: 'Civil',
  imp: 'Imp.',
  false_label: 'False',
  wins_pct: 'wins',
  clear_stats: 'Clear statistics',
  back: 'Back',

  like_the_game: 'Enjoying the game?',
  support_desc: 'If you enjoy the game, you can help us keep it ad-free and keep adding content.',
  support_project: 'Support project',
  later: 'Later',
  never_show: 'Don\'t show again',

  about_title: 'About the project',
  about_what_title: 'What is El Impostor?',
  about_what_desc: 'El Impostor is a social deduction game designed to be played in person with friends. A group of players receives a secret word, but among them hide impostors who don\'t know it. Through conversation, observation and strategy, the group must identify who is lying… before it\'s too late.',
  about_philosophy_title: 'Design philosophy',
  about_uncertainty: 'Uncertainty',
  about_uncertainty_desc: 'Chaos is intentional. You never know for sure who is who.',
  about_conversation: 'Conversation',
  about_conversation_desc: 'The game happens between people, not on the screen.',
  about_deduction: 'Social deduction',
  about_deduction_desc: 'Observe, question and analyze are the player\'s tools.',
  about_independent_title: 'Independent project',
  about_independent_desc: 'This project is completely independent. It contains no ads, collects no personal data and has no commercial purpose. It was created out of passion for game design and programming.',
  about_made_by: 'Made with 🔥 by',

  support_title: 'Support the project',
  support_subtitle: 'Every contribution counts',
  support_why_title: 'Why support?',
  support_why_desc: 'El Impostor is maintained ad-free with no locked features. Voluntary contributions help cover hosting, domain and maintenance costs. It\'s completely optional — if you enjoy the game, your support helps us keep improving it.',
  support_coffee_title: 'Coffee (MercadoPago)',
  support_crypto_title: 'Cryptocurrency',
  support_thanks: 'Thank you for being part of this 🔥',
};

const de: TranslationKeys = {
  home_subtitle: 'Chaos ist absichtliches Design',
  mode_classic: 'KLASSISCH',
  mode_classic_desc: 'Spieler kennen ihre Rolle von Anfang an. Die Anzahl der Impostoren wird vom Gastgeber festgelegt.',
  mode_mystery: 'MYSTERIUM',
  mode_mystery_desc: 'Rollen und Impostoren werden zufällig zugewiesen. Niemand kennt seine Rolle zu Beginn. Rollen werden bei Elimination enthüllt und am Ende gezeigt.',
  mode_chaos: 'CHAOS',
  mode_chaos_desc: 'Spezialrollen, falsche Impostoren und sekundäre Hinweise. Totales Chaos, wo nichts ist, wie es scheint.',
  stats: 'Statistiken',
  about: 'Über',
  support: 'Unterstützen',

  players: 'Spieler',
  players_count: 'Spieler',
  players_min: 'Minimum',
  player_name_placeholder: 'Spielername',
  mode_label: 'Modus',
  continue: 'Weiter',

  config_title: 'Einstellungen',
  impostor_count: 'Anzahl der Impostoren',
  max_for_players: 'Max: {max} für {count} Spieler',
  hide_impostor_hint: 'Hinweis vor Impostoren verbergen',
  hide_impostor_hint_desc: 'Impostoren erhalten kein Wort und müssen improvisieren',
  game_duration: 'Spieldauer',
  min_label: 'Min',
  start_game: 'Spiel starten',

  reveal_roles: 'Rollen enthüllen',
  reveal_roles_desc: 'Jeder Spieler tippt auf seinen Namen, um seine Rolle zu sehen',
  your_role: 'Deine Rolle ist',
  your_word: 'Dein Wort',
  role_civil: 'ZIVILIST',
  role_impostor: 'IMPOSTOR',
  role_false_impostor: 'ZIVILIST',
  role_civil_desc: 'Finde die Impostoren',
  role_impostor_desc: 'Lass dich nicht erwischen',
  role_false_impostor_desc: 'Finde die Impostoren (du bist KEIN Impostor)',
  role_hidden: '???',
  role_hidden_desc: 'Deine Rolle wird während des Spiels enthüllt',
  false_impostor_hint: '⚠️ Dein Wort ist ein Hinweis, aber du bist KEIN Impostor',
  understood_back: 'Verstanden, zurück',
  start_match: 'Spiel starten',
  restart_round: 'Runde neu starten',
  go_home: 'Zurück zum Start',

  first_turn: 'Erster Zug',
  remaining_players: 'Spieler übrig',
  voting: 'Abstimmung',
  eliminate_player: 'Eliminieren',
  eliminate_confirm_title: '{name} eliminieren?',
  eliminate_confirm_desc: 'Diese Aktion kann nicht rückgängig gemacht werden. Der Spieler wird aus dem Spiel eliminiert.',
  cancel: 'Abbrechen',
  confirm_elimination: 'Elimination bestätigen',
  impostor_guessed_word: 'Impostor hat das Wort erraten',
  impostor_guess_title: 'Hat der Impostor das Wort erraten?',
  impostor_guess_desc: 'Das Spiel endet und das Impostor-Team wird zum Sieger erklärt. Dies kann nicht rückgängig gemacht werden.',
  confirm: 'Bestätigen',
  restart_round_title: 'Runde neu starten?',
  restart_round_desc: 'Rollen, Wörter und der Timer werden zurückgesetzt. Statistiken und Verlauf bleiben erhalten.',
  restart: 'Neu starten',

  time_remaining: 'Verbleibende Zeit',
  game_paused: 'Spiel pausiert',

  impostor_eliminated: 'Impostor eliminiert!',
  civil_eliminated: 'Zivilist eliminiert',
  civils_win: 'Zivilisten gewinnen!',
  impostors_win: 'Impostoren gewinnen!',
  see_results: 'Ergebnisse ansehen',
  continue_game: 'Spiel fortsetzen',

  the_word_was: 'Das Wort war',
  hint_label: 'Hinweis',
  impostors_in_game: 'Impostoren in diesem Spiel',
  roles_revealed: 'Enthüllte Rollen',
  eliminated_label: 'eliminiert',
  play_again: 'Nächste Runde',
  change_mode: 'Spielmodus ändern',
  home: 'Startseite',
  role_civil_label: 'Zivilist',
  role_impostor_label: 'Impostor',
  role_false_impostor_label: 'Falscher Impostor',
  unknown: 'Unbekannt',

  stats_title: 'Statistiken',
  game_history: 'Spielverlauf',
  no_stats: 'Noch keine Statistiken',
  play_to_start: 'Spiele ein Spiel, um zu beginnen',
  games: 'Spiele',
  civil: 'Zivilist',
  imp: 'Imp.',
  false_label: 'Falsch',
  wins_pct: 'Siege',
  clear_stats: 'Statistiken löschen',
  back: 'Zurück',

  like_the_game: 'Gefällt dir das Spiel?',
  support_desc: 'Wenn dir das Spiel gefällt, kannst du uns helfen, es werbefrei zu halten und weiter Inhalte hinzuzufügen.',
  support_project: 'Projekt unterstützen',
  later: 'Später',
  never_show: 'Nicht mehr anzeigen',

  about_title: 'Über das Projekt',
  about_what_title: 'Was ist El Impostor?',
  about_what_desc: 'El Impostor ist ein soziales Deduktionsspiel, das für persönliches Spielen mit Freunden entwickelt wurde. Eine Gruppe von Spielern erhält ein geheimes Wort, aber unter ihnen verstecken sich Impostoren, die es nicht kennen. Durch Gespräch, Beobachtung und Strategie muss die Gruppe herausfinden, wer lügt… bevor es zu spät ist.',
  about_philosophy_title: 'Designphilosophie',
  about_uncertainty: 'Unsicherheit',
  about_uncertainty_desc: 'Chaos ist beabsichtigt. Man weiß nie genau, wer wer ist.',
  about_conversation: 'Gespräch',
  about_conversation_desc: 'Das Spiel findet zwischen den Menschen statt, nicht auf dem Bildschirm.',
  about_deduction: 'Soziale Deduktion',
  about_deduction_desc: 'Beobachten, fragen und analysieren sind die Werkzeuge des Spielers.',
  about_independent_title: 'Unabhängiges Projekt',
  about_independent_desc: 'Dieses Projekt ist vollständig unabhängig. Es enthält keine Werbung, sammelt keine persönlichen Daten und hat keinen kommerziellen Zweck. Es wurde aus Leidenschaft für Spieldesign und Programmierung erstellt.',
  about_made_by: 'Gemacht mit 🔥 von',

  support_title: 'Projekt unterstützen',
  support_subtitle: 'Jeder Beitrag zählt',
  support_why_title: 'Warum unterstützen?',
  support_why_desc: 'El Impostor wird werbefrei und ohne gesperrte Funktionen betrieben. Freiwillige Beiträge helfen, die Kosten für Hosting, Domain und Wartung zu decken. Es ist völlig optional — wenn dir das Spiel gefällt, hilft deine Unterstützung uns, es weiter zu verbessern.',
  support_coffee_title: 'Kaffee (MercadoPago)',
  support_crypto_title: 'Kryptowährung',
  support_thanks: 'Danke, dass du dabei bist 🔥',
};

export const translations: Record<Language, TranslationKeys> = { es, en, de };
