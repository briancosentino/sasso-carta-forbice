/**
 * @fileoverview Definizioni dei tipi TypeScript per il gioco Sasso, Carta, Forbice.
 * 
 * Questo file contiene tutti i tipi utilizzati nell'applicazione, seguendo
 * il principio di separazione delle responsabilità e garantendo type safety.
 * 
 * @author GitHub Copilot
 * @since 1.0.0
 */

/**
 * Rappresenta una mossa valida nel gioco.
 * 
 * @typedef {('rock' | 'paper' | 'scissors')} Move
 * 
 * @example
 * // Utilizzo base
 * const playerMove: Move = 'rock';
 * 
 * @example
 * // Con type guard
 * function isValidMove(input: string): input is Move {
 *   return ['rock', 'paper', 'scissors'].includes(input as Move);
 * }
 */
export type Move = 'rock' | 'paper' | 'scissors';

/**
 * Modalità di gioco disponibili nell'applicazione.
 * 
 * @typedef {('human-vs-computer' | 'computer-vs-computer')} GameMode
 * 
 * @example
 * // Impostare modalità di gioco
 * const mode: GameMode = 'human-vs-computer';
 * 
 * @example
 * // Switch tra modalità
 * function switchMode(currentMode: GameMode): GameMode {
 *   return currentMode === 'human-vs-computer' 
 *     ? 'computer-vs-computer' 
 *     : 'human-vs-computer';
 * }
 */
export type GameMode = 'human-vs-computer' | 'computer-vs-computer';

/**
 * Identificatore del giocatore nel sistema.
 * 
 * @typedef {('player1' | 'player2')} Player
 * 
 * @example
 * // Identificare un giocatore
 * const winner: Player = 'player1';
 * 
 * @example
 * // Ottenere l'avversario
 * function getOpponent(player: Player): Player {
 *   return player === 'player1' ? 'player2' : 'player1';
 * }
 */
export type Player = 'player1' | 'player2';

/**
 * Risultato di un singolo round di gioco.
 * 
 * Contiene tutte le informazioni necessarie per rappresentare
 * l'esito di una partita tra due giocatori.
 * 
 * @interface GameResult
 * 
 * @property {Player | 'tie'} winner - Il vincitore del round o 'tie' per pareggio
 * @property {Move} player1Move - La mossa effettuata dal primo giocatore
 * @property {Move} player2Move - La mossa effettuata dal secondo giocatore
 * 
 * @example
 * // Creare un risultato di vittoria
 * const result: GameResult = {
 *   winner: 'player1',
 *   player1Move: 'rock',
 *   player2Move: 'scissors'
 * };
 * 
 * @example
 * // Gestire risultato di pareggio
 * const tieResult: GameResult = {
 *   winner: 'tie',
 *   player1Move: 'paper',
 *   player2Move: 'paper'
 * };
 * 
 * @example
 * // Utilizzare per display dei risultati
 * function displayResult(result: GameResult): string {
 *   if (result.winner === 'tie') {
 *     return 'Pareggio!';
 *   }
 *   return `${result.winner} vince con ${result.player1Move} vs ${result.player2Move}`;
 * }
 * 
 * @since 1.0.0
 */
export interface GameResult {
    winner: Player | 'tie';
    player1Move: Move;
    player2Move: Move;
}

/**
 * Stato completo dell'applicazione di gioco.
 * 
 * Rappresenta lo stato globale dell'applicazione, includendo modalità di gioco,
 * punteggi, round corrente e risultato dell'ultimo round giocato.
 * 
 * @interface GameState
 * 
 * @property {GameMode} mode - La modalità di gioco attualmente attiva
 * @property {number} currentRound - Il numero del round corrente (0-based)
 * @property {Object} scores - Oggetto contenente i punteggi di tutti i giocatori
 * @property {number} scores.player1 - Punteggio del primo giocatore
 * @property {number} scores.player2 - Punteggio del secondo giocatore  
 * @property {number} scores.ties - Numero di pareggi
 * @property {GameResult} [lastResult] - Risultato dell'ultimo round (opzionale)
 * @property {boolean} isPlaying - Indica se il gioco è attualmente in corso
 * 
 * @example
 * // Stato iniziale del gioco
 * const initialState: GameState = {
 *   mode: 'human-vs-computer',
 *   currentRound: 0,
 *   scores: { player1: 0, player2: 0, ties: 0 },
 *   isPlaying: false
 * };
 * 
 * @example
 * // Aggiornare il punteggio dopo una vittoria
 * function updateScoreAfterWin(state: GameState, winner: Player): GameState {
 *   return {
 *     ...state,
 *     scores: {
 *       ...state.scores,
 *       [winner]: state.scores[winner] + 1
 *     }
 *   };
 * }
 * 
 * @example
 * // Reset completo del gioco
 * function resetGame(currentMode: GameMode): GameState {
 *   return {
 *     mode: currentMode,
 *     currentRound: 0,
 *     scores: { player1: 0, player2: 0, ties: 0 },
 *     isPlaying: false
 *   };
 * }
 * 
 * @since 1.0.0
 */
export interface GameState {
    mode: GameMode;
    currentRound: number;
    scores: {
        player1: number;
        player2: number;
        ties: number;
    };
    lastResult?: GameResult;
    isPlaying: boolean;
}