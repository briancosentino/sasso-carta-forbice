import type { Move, Player, GameResult } from './types';

/**
 * Array contenente tutte le mosse valide del gioco.
 * @constant {Move[]}
 * @example
 * // Iterare su tutte le mosse possibili
 * MOVES.forEach(move => console.log(move));
 */
export const MOVES: Move[] = ['rock', 'paper', 'scissors'];

/**
 * Mapping delle mosse con le loro etichette in italiano.
 * @constant {Record<Move, string>}
 * @example
 * // Ottenere l'etichetta italiana di una mossa
 * const label = MOVE_LABELS.rock; // 'Sasso'
 */
export const MOVE_LABELS = {
    rock: 'Sasso',
    paper: 'Carta',
    scissors: 'Forbice'
} as const;

/**
 * Mapping delle mosse con le loro rappresentazioni emoji.
 * @constant {Record<Move, string>}
 * @example
 * // Ottenere l'emoji di una mossa
 * const emoji = MOVE_EMOJIS.scissors; // '✂️'
 */
export const MOVE_EMOJIS = {
    rock: '🗿',
    paper: '📄',
    scissors: '✂️'
} as const;

/**
 * Genera una mossa casuale tra quelle disponibili.
 * 
 * Utilizza Math.random() per selezionare casualmente una delle mosse
 * dall'array MOVES. La distribuzione è uniforme.
 * 
 * @returns {Move} Una mossa casuale ('rock', 'paper', o 'scissors')
 * 
 * @example
 * // Generare una mossa casuale per il computer
 * const computerMove = getRandomMove();
 * console.log(computerMove); // 'rock', 'paper', o 'scissors'
 * 
 * @example
 * // Utilizzare in un ciclo per simulare più mosse
 * for (let i = 0; i < 5; i++) {
 *   const move = getRandomMove();
 *   console.log(`Mossa ${i + 1}: ${MOVE_LABELS[move]}`);
 * }
 * 
 * @since 1.0.0
 * @see {@link MOVES} - Array delle mosse disponibili
 */
export function getRandomMove(): Move {
    return MOVES[Math.floor(Math.random() * MOVES.length)];
}

/**
 * Determina il vincitore tra due mosse secondo le regole del gioco.
 * 
 * Implementa la logica classica di "Sasso, Carta, Forbice":
 * - Sasso batte Forbice
 * - Forbice batte Carta  
 * - Carta batte Sasso
 * - Mosse uguali risultano in pareggio
 * 
 * La funzione è progettata per essere estensibile facilmente a varianti
 * del gioco (es. Rock Paper Scissors Lizard Spock).
 * 
 * @param {Move} player1Move - La mossa del primo giocatore
 * @param {Move} player2Move - La mossa del secondo giocatore
 * @returns {Player | 'tie'} Il vincitore ('player1', 'player2') o 'tie' per pareggio
 * 
 * @example
 * // Esempio di vittoria del player1
 * const result = determineWinner('rock', 'scissors');
 * console.log(result); // 'player1'
 * 
 * @example
 * // Esempio di pareggio
 * const result = determineWinner('paper', 'paper');
 * console.log(result); // 'tie'
 * 
 * @example
 * // Utilizzare con le costanti per maggiore chiarezza
 * const player1 = 'rock';
 * const player2 = 'scissors';
 * const winner = determineWinner(player1, player2);
 * console.log(`${MOVE_LABELS[player1]} vs ${MOVE_LABELS[player2]} -> ${winner}`);
 * 
 * @throws {Error} Non lancia errori, ma si aspetta mosse valide
 * @since 1.0.0
 * @see {@link playRound} - Funzione che utilizza questa per giocare un round completo
 */
export function determineWinner(player1Move: Move, player2Move: Move): Player | 'tie' {
    if (player1Move === player2Move) {
        return 'tie';
    }

    const winConditions: Record<Move, Move[]> = {
        rock: ['scissors'],     // Rock beats scissors
        paper: ['rock'],        // Paper beats rock
        scissors: ['paper']     // Scissors beats paper
    };

    return winConditions[player1Move].includes(player2Move) ? 'player1' : 'player2';
}

/**
 * Esegue un round completo del gioco tra due mosse.
 * 
 * Funzione di alto livello che combina le mosse dei giocatori con
 * la determinazione del vincitore, restituendo un oggetto completo
 * del risultato del round.
 * 
 * Questa funzione è la principale interfaccia per giocare un singolo
 * round ed è utilizzata sia per partite umano vs computer che 
 * computer vs computer.
 * 
 * @param {Move} player1Move - La mossa del primo giocatore
 * @param {Move} player2Move - La mossa del secondo giocatore
 * @returns {GameResult} Oggetto contenente il vincitore e le mosse di entrambi i giocatori
 * 
 * @example
 * // Giocare un round tra umano e computer
 * const humanMove = 'rock';
 * const computerMove = getRandomMove();
 * const result = playRound(humanMove, computerMove);
 * 
 * console.log(`Umano: ${MOVE_LABELS[result.player1Move]}`);
 * console.log(`Computer: ${MOVE_LABELS[result.player2Move]}`);
 * console.log(`Vincitore: ${result.winner}`);
 * 
 * @example
 * // Giocare un round computer vs computer
 * const result = playRound(getRandomMove(), getRandomMove());
 * if (result.winner === 'tie') {
 *   console.log('Pareggio!');
 * } else {
 *   console.log(`Vince ${result.winner}`);
 * }
 * 
 * @example
 * // Utilizzare per statistiche
 * const rounds = [];
 * for (let i = 0; i < 100; i++) {
 *   rounds.push(playRound(getRandomMove(), getRandomMove()));
 * }
 * const ties = rounds.filter(r => r.winner === 'tie').length;
 * console.log(`Pareggi su 100 partite: ${ties}`);
 * 
 * @since 1.0.0
 * @see {@link determineWinner} - Funzione utilizzata internamente per determinare il vincitore
 * @see {@link GameResult} - Tipo dell'oggetto restituito
 */
export function playRound(player1Move: Move, player2Move: Move): GameResult {
    const winner: Player | 'tie' = determineWinner(player1Move, player2Move);

    return {
        winner,
        player1Move,
        player2Move
    };
}