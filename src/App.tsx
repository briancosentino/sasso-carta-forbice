/**
 * @fileoverview Componente principale dell'applicazione Sasso, Carta, Forbice.
 * 
 * Questo componente gestisce l'intera logica dell'interfaccia utente e dello stato
 * del gioco, implementando le best practices di React per performance e manutenibilità.
 * 
 * @author GitHub Copilot
 * @since 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, GameMode, Move } from './types';
import { MOVES, MOVE_LABELS, MOVE_EMOJIS, getRandomMove, playRound } from './gameLogic';
import './App.css';

/**
 * Stato iniziale dell'applicazione.
 * 
 * Definisce la configurazione di default per un nuovo gioco,
 * con modalità umano vs computer e punteggi azzerati.
 * 
 * @constant {GameState}
 */
const initialGameState: GameState = {
  mode: 'human-vs-computer',
  currentRound: 0,
  scores: {
    player1: 0,
    player2: 0,
    ties: 0
  },
  isPlaying: false
};

/**
 * Componente principale dell'applicazione Sasso, Carta, Forbice.
 * 
 * Gestisce l'intero flusso del gioco, dall'interfaccia utente alla logica di stato.
 * Implementa ottimizzazioni per le performance tramite memoization e callback.
 * 
 * @component
 * @returns {JSX.Element} L'interfaccia completa del gioco
 * 
 * @example
 * // Utilizzo base nel root dell'applicazione
 * function AppRoot() {
 *   return <App />;
 * }
 * 
 * @since 1.0.0
 */
function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  /**
   * Gestisce il cambio di modalità di gioco.
   * 
   * Resetta lo stato del gioco e imposta la nuova modalità.
   * Memoizzato per evitare re-creazioni inutili della funzione.
   * 
   * @param {GameMode} mode - La nuova modalità di gioco da impostare
   * 
   * @example
   * // Cambiare a modalità computer vs computer
   * handleModeChange('computer-vs-computer');
   * 
   * @since 1.0.0
   */
  const handleModeChange = useCallback((mode: GameMode) => {
    setGameState({
      ...initialGameState,
      mode
    });
  }, []);

  /**
   * Gestisce una mossa del giocatore umano.
   * 
   * Genera una mossa casuale per il computer, esegue il round
   * e aggiorna lo stato con i risultati. Funziona solo se il gioco è attivo.
   * 
   * @param {Move} move - La mossa scelta dal giocatore umano
   * 
   * @example
   * // Giocatore sceglie "sasso"
   * handleHumanMove('rock');
   * 
   * @since 1.0.0
   */
  const handleHumanMove = useCallback((move: Move) => {
    if (!gameState.isPlaying) return;

    const computerMove = getRandomMove();
    const result = playRound(move, computerMove);

    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      scores: {
        player1: prev.scores.player1 + (result.winner === 'player1' ? 1 : 0),
        player2: prev.scores.player2 + (result.winner === 'player2' ? 1 : 0),
        ties: prev.scores.ties + (result.winner === 'tie' ? 1 : 0)
      },
      lastResult: result,
      isPlaying: false
    }));
  }, [gameState.isPlaying]);

  /**
   * Gestisce un round computer vs computer.
   * 
   * Genera mosse casuali per entrambi i computer, esegue il round
   * e aggiorna lo stato. Utilizzato dal timer automatico.
   * 
   * @example
   * // Avviato automaticamente dopo 1 secondo in modalità computer vs computer
   * // Non chiamare direttamente
   * 
   * @since 1.0.0
   */
  const handleComputerVsComputer = useCallback(() => {
    if (!gameState.isPlaying) return;

    const player1Move = getRandomMove();
    const player2Move = getRandomMove();
    const result = playRound(player1Move, player2Move);

    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      scores: {
        player1: prev.scores.player1 + (result.winner === 'player1' ? 1 : 0),
        player2: prev.scores.player2 + (result.winner === 'player2' ? 1 : 0),
        ties: prev.scores.ties + (result.winner === 'tie' ? 1 : 0)
      },
      lastResult: result,
      isPlaying: false
    }));
  }, [gameState.isPlaying]);

  /**
   * Avvia un nuovo round del gioco.
   * 
   * Imposta lo stato di gioco attivo e rimuove il risultato precedente.
   * 
   * @example
   * // Iniziare una nuova partita
   * startNewRound();
   * 
   * @since 1.0.0
   */
  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      lastResult: undefined
    }));
  }, []);

  /**
   * Resetta completamente il gioco.
   * 
   * Ripristina lo stato iniziale mantenendo la modalità di gioco corrente.
   * 
   * @example
   * // Reset dopo una serie di partite
   * resetGame();
   * 
   * @since 1.0.0
   */
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...initialGameState,
      mode: prev.mode
    }));
  }, []);

  // Effect con dependencies corrette
  useEffect(() => {
    if (gameState.mode === 'computer-vs-computer' && gameState.isPlaying) {
      const timer = setTimeout(handleComputerVsComputer, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, gameState.mode, handleComputerVsComputer]);

  /**
   * Genera l'etichetta appropriata per un giocatore in base alla modalità.
   * 
   * @param {('player1' | 'player2')} player - Il giocatore di cui ottenere l'etichetta
   * @returns {string} L'etichetta localizzata del giocatore
   * 
   * @example
   * // In modalità umano vs computer
   * getPlayerLabel('player1'); // 'Umano'
   * getPlayerLabel('player2'); // 'Computer'
   * 
   * @example
   * // In modalità computer vs computer
   * getPlayerLabel('player1'); // 'Computer 1'
   * getPlayerLabel('player2'); // 'Computer 2'
   */
  const getPlayerLabel = useCallback((player: 'player1' | 'player2') => {
    if (gameState.mode === 'human-vs-computer') {
      return player === 'player1' ? 'Umano' : 'Computer';
    }
    return player === 'player1' ? 'Computer 1' : 'Computer 2';
  }, [gameState.mode]);

  /**
   * Genera il messaggio di risultato del round.
   * 
   * @returns {string} Il messaggio localizzato del risultato
   */
  const getResultMessage = useCallback(() => {
    if (!gameState.lastResult) return '';

    const { winner } = gameState.lastResult;
    if (winner === 'tie') return 'Pareggio!';

    const winnerLabel = getPlayerLabel(winner);
    return `${winnerLabel} vince!`;
  }, [gameState.lastResult, getPlayerLabel]);

  return (
    <div className="min-h-screen min-w-80 m-0 flex items-center justify-center w-[100vw]" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-3xl mx-auto p-8 text-center bg-white/10 backdrop-blur-sm rounded-3xl" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
        <header className="mb-8">
          <h1 className="text-4xl font-normal mb-8 text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            🎮 Sasso, Carta, Forbice
          </h1>
        </header>

        <main className="flex flex-col gap-8">
          {/* Game Mode Selection */}
          <section className="space-y-4">
            <h2 className="text-2xl mb-4 text-white">Modalità di Gioco</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                className={`px-6 py-3 border-2 rounded-xl text-white text-base cursor-pointer transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 ${gameState.mode === 'human-vs-computer'
                    ? 'bg-white/30 border-white'
                    : 'bg-white/10 border-white/30'
                  }`}
                style={gameState.mode === 'human-vs-computer' ? { boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)' } : {}}
                onClick={() => handleModeChange('human-vs-computer')}
              >
                Umano vs Computer
              </button>
              <button
                className={`px-6 py-3 border-2 rounded-xl text-white text-base cursor-pointer transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 ${gameState.mode === 'computer-vs-computer'
                    ? 'bg-white/30 border-white'
                    : 'bg-white/10 border-white/30'
                  }`}
                style={gameState.mode === 'computer-vs-computer' ? { boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)' } : {}}
                onClick={() => handleModeChange('computer-vs-computer')}
              >
                Computer vs Computer
              </button>
            </div>
          </section>

          {/* Scoreboard */}
          <section className="bg-white/10 rounded-2xl p-6">
            <h3 className="text-xl mb-4 text-white">Punteggio</h3>
            <div className="flex justify-around gap-4 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-white/80 font-medium">{getPlayerLabel('player1')}</span>
                <span className="text-3xl font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{gameState.scores.player1}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-white/80 font-medium">Pareggi</span>
                <span className="text-3xl font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{gameState.scores.ties}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-white/80 font-medium">{getPlayerLabel('player2')}</span>
                <span className="text-3xl font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{gameState.scores.player2}</span>
              </div>
            </div>
          </section>

          {/* Game Area */}
          <section className="flex flex-col gap-8">
            {gameState.lastResult && (
              <div className="bg-white/10 rounded-2xl p-6">
                <h3 className="text-xl mb-4 text-white">Ultimo Round</h3>
                <div className="flex justify-around items-center gap-4 mb-4 flex-wrap">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-white/80 font-medium">{getPlayerLabel('player1')}</span>
                    <span className="text-2xl text-white font-bold">
                      {MOVE_EMOJIS[gameState.lastResult.player1Move]} {MOVE_LABELS[gameState.lastResult.player1Move]}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-white/80">VS</span>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-white/80 font-medium">{getPlayerLabel('player2')}</span>
                    <span className="text-2xl text-white font-bold">
                      {MOVE_EMOJIS[gameState.lastResult.player2Move]} {MOVE_LABELS[gameState.lastResult.player2Move]}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-4" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  {getResultMessage()}
                </div>
              </div>
            )}

            {/* Human vs Computer Controls */}
            {gameState.mode === 'human-vs-computer' && gameState.isPlaying && (
              <div className="space-y-4">
                <h3 className="text-xl mb-4 text-white">Scegli la tua mossa:</h3>
                <div className="flex gap-4 justify-center flex-wrap md:flex-col md:items-center">
                  {MOVES.map(move => (
                    <button
                      key={move}
                      className="flex flex-col items-center gap-2 p-4 border-2 border-white/30 rounded-2xl bg-white/10 text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 min-w-[100px] md:w-[200px]"
                      style={{ boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.2)';
                      }}
                      onClick={() => handleHumanMove(move)}
                    >
                      <span className="text-4xl">{MOVE_EMOJIS[move]}</span>
                      <span className="text-base font-medium">{MOVE_LABELS[move]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Computer vs Computer Status */}
            {gameState.mode === 'computer-vs-computer' && gameState.isPlaying && (
              <div className="bg-white/10 rounded-2xl p-8">
                <p className="text-xl text-white mb-4">I computer stanno giocando...</p>
                <div className="text-3xl animate-pulse">⏳</div>
              </div>
            )}

            {/* Game Controls */}
            <div className="flex gap-4 justify-center flex-wrap">
              {!gameState.isPlaying && (
                <button
                  className="px-8 py-4 border-0 rounded-xl text-white text-lg font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                  }}
                  onClick={startNewRound}
                >
                  {gameState.currentRound === 0 ? 'Inizia Partita' : 'Nuovo Round'}
                </button>
              )}

              {gameState.currentRound > 0 && (
                <button
                  className="px-8 py-4 border-2 border-white/50 rounded-xl bg-white/10 text-white text-base cursor-pointer transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
                  onClick={resetGame}
                >
                  Nuova Partita
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
