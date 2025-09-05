# 🎮 Sasso, Carta, Forbice

Un gioco interattivo di "Sasso, Carta, Forbice" (Rock, Paper, Scissors) sviluppato con **React**, **TypeScript** e **TailwindCSS**, che implementa le best practices moderne per lo sviluppo web.


## 🎮 Come Giocare

### Regole del Gioco
Il gioco segue le regole classiche di "Sasso, Carta, Forbice":

- 🗿 **Sasso** batte ✂️ **Forbice** (il sasso rompe le forbici)
- ✂️ **Forbice** batte 📄 **Carta** (le forbici tagliano la carta)
- 📄 **Carta** batte 🗿 **Sasso** (la carta avvolge il sasso)
- **Mosse uguali** = **Pareggio**

### Modalità Umano vs Computer

1. **Seleziona** la modalità "Umano vs Computer"
2. **Clicca** "Inizia Partita"
3. **Scegli** la tua mossa cliccando su Sasso, Carta o Forbice
4. **Visualizza** il risultato e il punteggio aggiornato
5. **Continua** con "Nuovo Round" o "Nuova Partita"

### Modalità Computer vs Computer

1. **Seleziona** la modalità "Computer vs Computer"
2. **Clicca** "Inizia Partita"
3. **Osserva** i computer giocare automaticamente
4. **Visualizza** i risultati in tempo reale





#### 🔒 **Separazione delle Responsabilità**
- **`types.ts`**: Definizioni TypeScript per type safety
- **`gameLogic.ts`**: Funzioni pure per la logica di gioco
- **`App.tsx`**: Gestione stato e interfaccia utente




## 🧪 Testing

Il progetto include una suite di testing completa con **33 test** che coprono:

### 🎮 **Test Logica di Gioco (12 test)**
```bash
✅ Verifica costanti (MOVES, LABELS, EMOJIS)
✅ Test getRandomMove() con mocking
✅ Test determineWinner() per tutte le combinazioni
✅ Test playRound() integrazione completa
```

### ⚛️ **Test Componenti React (21 test)**
```bash
✅ Rendering iniziale e elementi UI
✅ Selezione modalità di gioco
✅ Gameplay umano vs computer
✅ Gameplay computer vs computer
✅ Reset e gestione stato
✅ Edge cases e accessibility
```




#### 🎣 **React Hooks Optimization**
```typescript
// Event handlers memoizzati
const handleModeChange = useCallback((mode: GameMode) => {
  // Logica gestita
}, []);

// Computazioni memoizzate
const getPlayerLabel = useCallback((player) => {
  // Calcolo ottimizzato
}, [gameState.mode]);
```



### Metriche Performance
- **Startup rapido**: Bundle ottimizzato con code splitting
- **Interazioni fluide**: < 1000ms per operazioni multiple
- **Memory efficient**: Hooks memoizzati prevengono memory leaks
- **Bundle size**: Ottimizzato con Terser e tree shaking


#### `gameLogic.ts`
```typescript
// Genera mossa casuale
getRandomMove(): Move

// Determina vincitore tra due mosse
determineWinner(player1Move: Move, player2Move: Move): Player | 'tie'

// Esegue un round completo
playRound(player1Move: Move, player2Move: Move): GameResult
```

#### Costanti
```typescript
MOVES: Move[]                    // ['rock', 'paper', 'scissors']
MOVE_LABELS: Record<Move, string> // { rock: 'Sasso', ... }
MOVE_EMOJIS: Record<Move, string> // { rock: '🗿', ... }
```

### Types

```typescript
type Move = 'rock' | 'paper' | 'scissors'
type GameMode = 'human-vs-computer' | 'computer-vs-computer'
type Player = 'player1' | 'player2'

interface GameResult {
  winner: Player | 'tie'
  player1Move: Move
  player2Move: Move
}

interface GameState {
  mode: GameMode
  currentRound: number
  scores: { player1: number; player2: number; ties: number }
  lastResult?: GameResult
  isPlaying: boolean
}
```

### Documentazione Completa
- **JSDoc**: Ogni funzione è completamente documentata
- **Esempi**: Code snippets pratici per ogni API
- **Type Safety**: Interfacce TypeScript chiare
- **API_DOCUMENTATION.md**: Guida completa alle API

## 🔧 Estensibilità

Il codice è progettato per essere facilmente esteso. Ecco come aggiungere nuove funzionalità:

### Aggiungere Nuove Mosse (es. Lizard Spock)

#### 1. Aggiorna i Tipi
```typescript
// types.ts
export type Move = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';
```

#### 2. Estendi le Costanti
```typescript
// gameLogic.ts
export const MOVES: Move[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

export const MOVE_LABELS = {
  // ...esistenti
  lizard: 'Lucertola',
  spock: 'Spock'
} as const;

export const MOVE_EMOJIS = {
  // ...esistenti
  lizard: '🦎',
  spock: '🖖'
} as const;
```

#### 3. Aggiorna le Regole
```typescript
// gameLogic.ts
const winConditions: Record<Move, Move[]> = {
  rock: ['scissors', 'lizard'],      // Rock beats scissors and lizard
  paper: ['rock', 'spock'],          // Paper beats rock and spock
  scissors: ['paper', 'lizard'],     // Scissors beats paper and lizard
  lizard: ['spock', 'paper'],        // Lizard beats spock and paper
  spock: ['scissors', 'rock']        // Spock beats scissors and rock
};
```

### Aggiungere Nuove Modalità

```typescript
// 1. Aggiorna il tipo GameMode
type GameMode = 'human-vs-computer' | 'computer-vs-computer' | 'tournament';

// 2. Gestisci la nuova modalità in App.tsx
const handleTournamentMode = useCallback(() => {
  // Implementa logica tournament
}, []);
```

