import { describe, it, expect, vi } from 'vitest'
import {
    MOVES,
    MOVE_LABELS,
    MOVE_EMOJIS,
    getRandomMove,
    determineWinner,
    playRound
} from '../gameLogic'
import type { Move } from '../types'

describe('gameLogic', () => {
    describe('Constants', () => {
        it('should export correct moves array', () => {
            expect(MOVES).toEqual(['rock', 'paper', 'scissors'])
            expect(MOVES).toHaveLength(3)
        })

        it('should have correct Italian labels', () => {
            expect(MOVE_LABELS.rock).toBe('Sasso')
            expect(MOVE_LABELS.paper).toBe('Carta')
            expect(MOVE_LABELS.scissors).toBe('Forbice')
        })

        it('should have emojis for all moves', () => {
            expect(MOVE_EMOJIS.rock).toBe('🗿')
            expect(MOVE_EMOJIS.paper).toBe('📄')
            expect(MOVE_EMOJIS.scissors).toBe('✂️')
        })
    })

    describe('getRandomMove', () => {
        it('should return a valid move', () => {
            const move = getRandomMove()
            expect(MOVES).toContain(move)
        })

        it('should return different moves over multiple calls', () => {
            // Mock Math.random per testare tutti i casi
            const mathRandomSpy = vi.spyOn(Math, 'random')

            mathRandomSpy.mockReturnValue(0) // dovrebbe restituire 'rock'
            expect(getRandomMove()).toBe('rock')

            mathRandomSpy.mockReturnValue(0.4) // dovrebbe restituire 'paper'
            expect(getRandomMove()).toBe('paper')

            mathRandomSpy.mockReturnValue(0.8) // dovrebbe restituire 'scissors'
            expect(getRandomMove()).toBe('scissors')

            mathRandomSpy.mockRestore()
        })
    })

    describe('determineWinner', () => {
        it('should return tie when moves are equal', () => {
            expect(determineWinner('rock', 'rock')).toBe('tie')
            expect(determineWinner('paper', 'paper')).toBe('tie')
            expect(determineWinner('scissors', 'scissors')).toBe('tie')
        })

        it('should determine rock wins', () => {
            expect(determineWinner('rock', 'scissors')).toBe('player1')
            expect(determineWinner('scissors', 'rock')).toBe('player2')
        })

        it('should determine paper wins', () => {
            expect(determineWinner('paper', 'rock')).toBe('player1')
            expect(determineWinner('rock', 'paper')).toBe('player2')
        })

        it('should determine scissors wins', () => {
            expect(determineWinner('scissors', 'paper')).toBe('player1')
            expect(determineWinner('paper', 'scissors')).toBe('player2')
        })

        it('should handle all possible combinations', () => {
            const testCases: Array<{
                player1: Move
                player2: Move
                expected: 'player1' | 'player2' | 'tie'
            }> = [
                    // Ties
                    { player1: 'rock', player2: 'rock', expected: 'tie' },
                    { player1: 'paper', player2: 'paper', expected: 'tie' },
                    { player1: 'scissors', player2: 'scissors', expected: 'tie' },

                    // Player1 wins
                    { player1: 'rock', player2: 'scissors', expected: 'player1' },
                    { player1: 'paper', player2: 'rock', expected: 'player1' },
                    { player1: 'scissors', player2: 'paper', expected: 'player1' },

                    // Player2 wins
                    { player1: 'scissors', player2: 'rock', expected: 'player2' },
                    { player1: 'rock', player2: 'paper', expected: 'player2' },
                    { player1: 'paper', player2: 'scissors', expected: 'player2' },
                ]

            testCases.forEach(({ player1, player2, expected }) => {
                expect(determineWinner(player1, player2)).toBe(expected)
            })
        })
    })

    describe('playRound', () => {
        it('should return correct game result structure', () => {
            const result = playRound('rock', 'scissors')

            expect(result).toHaveProperty('winner')
            expect(result).toHaveProperty('player1Move')
            expect(result).toHaveProperty('player2Move')
            expect(result.player1Move).toBe('rock')
            expect(result.player2Move).toBe('scissors')
            expect(result.winner).toBe('player1')
        })

        it('should integrate with determineWinner correctly', () => {
            expect(playRound('rock', 'rock').winner).toBe('tie')
            expect(playRound('paper', 'rock').winner).toBe('player1')
            expect(playRound('rock', 'paper').winner).toBe('player2')
        })
    })
})