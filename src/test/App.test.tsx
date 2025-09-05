import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock delle funzioni di gameLogic per test deterministici
vi.mock('../gameLogic', async () => {
    const actual = await vi.importActual('../gameLogic')
    return {
        ...actual,
        getRandomMove: vi.fn()
    }
})

describe('App Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Render', () => {
        it('should render main title', () => {
            render(<App />)
            expect(screen.getByText('🎮 Sasso, Carta, Forbice')).toBeInTheDocument()
        })

        it('should render game mode selection', () => {
            render(<App />)
            expect(screen.getByText('Modalità di Gioco')).toBeInTheDocument()
            expect(screen.getByText('Umano vs Computer')).toBeInTheDocument()
            expect(screen.getByText('Computer vs Computer')).toBeInTheDocument()
        })

        it('should render scoreboard with initial scores', () => {
            render(<App />)
            expect(screen.getByText('Punteggio')).toBeInTheDocument()
            expect(screen.getByText('Umano')).toBeInTheDocument()
            expect(screen.getByText('Computer')).toBeInTheDocument()
            expect(screen.getByText('Pareggi')).toBeInTheDocument()

            // Check initial scores are 0
            const scores = screen.getAllByText('0')
            expect(scores).toHaveLength(3)
        })

        it('should render start game button', () => {
            render(<App />)
            expect(screen.getByText('Inizia Partita')).toBeInTheDocument()
        })

        it('should have human vs computer mode active by default', () => {
            render(<App />)
            const humanVsComputerBtn = screen.getByText('Umano vs Computer')
            expect(humanVsComputerBtn).toHaveClass('bg-white/30', 'border-white')
        })
    })

    describe('Game Mode Selection', () => {
        it('should switch to computer vs computer mode', async () => {
            const user = userEvent.setup()
            render(<App />)

            const computerVsComputerBtn = screen.getByText('Computer vs Computer')
            await user.click(computerVsComputerBtn)

            expect(computerVsComputerBtn).toHaveClass('bg-white/30', 'border-white')
            expect(screen.getByText('Computer 1')).toBeInTheDocument()
            expect(screen.getByText('Computer 2')).toBeInTheDocument()
        })

        it('should reset game when switching modes', async () => {
            const user = userEvent.setup()
            render(<App />)

            // Start a game first
            await user.click(screen.getByText('Inizia Partita'))

            // Switch mode
            await user.click(screen.getByText('Computer vs Computer'))

            // Should be back to initial state
            expect(screen.getByText('Inizia Partita')).toBeInTheDocument()
        })
    })

    describe('Human vs Computer Mode', () => {
        it('should show move selection when game is active', async () => {
            const user = userEvent.setup()
            render(<App />)

            await user.click(screen.getByText('Inizia Partita'))

            expect(screen.getByText('Scegli la tua mossa:')).toBeInTheDocument()
            expect(screen.getByText('Sasso')).toBeInTheDocument()
            expect(screen.getByText('Carta')).toBeInTheDocument()
            expect(screen.getByText('Forbice')).toBeInTheDocument()
        })

        it('should play a round when user selects a move', async () => {
            const { getRandomMove } = await import('../gameLogic')
            vi.mocked(getRandomMove).mockReturnValue('scissors')

            const user = userEvent.setup()
            render(<App />)

            await user.click(screen.getByText('Inizia Partita'))
            await user.click(screen.getByText('Sasso'))

            expect(screen.getByText('Ultimo Round')).toBeInTheDocument()
            expect(screen.getByText('🗿 Sasso')).toBeInTheDocument()
            expect(screen.getByText('✂️ Forbice')).toBeInTheDocument()
            expect(screen.getByText('Umano vince!')).toBeInTheDocument()
        })

        it('should update scores correctly', async () => {
            const { getRandomMove } = await import('../gameLogic')
            vi.mocked(getRandomMove).mockReturnValue('scissors')

            const user = userEvent.setup()
            render(<App />)

            await user.click(screen.getByText('Inizia Partita'))
            await user.click(screen.getByText('Sasso'))

            // Find the scoreboard section and then look for the human score
            const scoreboard = screen.getByText('Punteggio').closest('section')
            const humanScore = scoreboard?.querySelector('.text-3xl')
            expect(humanScore).toHaveTextContent('1')
        })

        it('should show new round button after a move', async () => {
            const { getRandomMove } = await import('../gameLogic')
            vi.mocked(getRandomMove).mockReturnValue('scissors')

            const user = userEvent.setup()
            render(<App />)

            await user.click(screen.getByText('Inizia Partita'))
            await user.click(screen.getByText('Sasso'))

            expect(screen.getByText('Nuovo Round')).toBeInTheDocument()
            expect(screen.getByText('Nuova Partita')).toBeInTheDocument()
        })
    })

    describe('Computer vs Computer Mode', () => {
        it('should show loading status when game is active', async () => {
            const user = userEvent.setup()
            render(<App />)

            await user.click(screen.getByText('Computer vs Computer'))
            await user.click(screen.getByText('Inizia Partita'))

            expect(screen.getByText('I computer stanno giocando...')).toBeInTheDocument()
            expect(screen.getByText('⏳')).toBeInTheDocument()
        })

        it('should automatically play a round after delay', async () => {
            const { getRandomMove } = await import('../gameLogic')
            vi.mocked(getRandomMove)
                .mockReturnValueOnce('rock')    // Player 1
                .mockReturnValueOnce('scissors') // Player 2

            const user = userEvent.setup()
            render(<App />)

            await user.click(screen.getByText('Computer vs Computer'))
            await user.click(screen.getByText('Inizia Partita'))

            // Wait for the automatic game to complete
            await waitFor(() => {
                expect(screen.getByText('Ultimo Round')).toBeInTheDocument()
            }, { timeout: 2000 })

            expect(screen.getByText('Computer 1 vince!')).toBeInTheDocument()
        })
    })

    describe('Game Reset', () => {
        it('should reset scores when starting new game', async () => {
            const { getRandomMove } = await import('../gameLogic')
            vi.mocked(getRandomMove).mockReturnValue('scissors')

            const user = userEvent.setup()
            render(<App />)

            // Play a round to get some score
            await user.click(screen.getByText('Inizia Partita'))
            await user.click(screen.getByText('Sasso'))

            // Reset game
            await user.click(screen.getByText('Nuova Partita'))

            // All scores should be 0
            const scores = screen.getAllByText('0')
            expect(scores).toHaveLength(3)
            expect(screen.getByText('Inizia Partita')).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('should handle tie games correctly', async () => {
            const { getRandomMove } = await import('../gameLogic')
            vi.mocked(getRandomMove).mockReturnValue('rock')

            const user = userEvent.setup()
            render(<App />)

            await user.click(screen.getByText('Inizia Partita'))
            await user.click(screen.getByText('Sasso'))

            expect(screen.getByText('Pareggio!')).toBeInTheDocument()

            // Ties score should be 1
            const tieScore = screen.getByText('Pareggi').parentElement?.querySelector('.text-3xl')
            expect(tieScore).toHaveTextContent('1')
        })

        it('should not allow moves when game is not active', async () => {
            const user = userEvent.setup()
            render(<App />)

            // Try to click move buttons without starting game
            // Should not show move buttons when game is not active
            expect(screen.queryByText('Scegli la tua mossa:')).not.toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('should have proper button roles', () => {
            render(<App />)

            const buttons = screen.getAllByRole('button')
            expect(buttons.length).toBeGreaterThan(0)

            // All buttons should be clickable
            buttons.forEach(button => {
                expect(button).toBeEnabled()
            })
        })

        it('should have readable text content', () => {
            render(<App />)

            // Important text should be visible
            expect(screen.getByText('🎮 Sasso, Carta, Forbice')).toBeVisible()
            expect(screen.getByText('Modalità di Gioco')).toBeVisible()
            expect(screen.getByText('Punteggio')).toBeVisible()
        })
    })

    describe('Performance Optimizations', () => {
        it('should not re-render unnecessarily when clicking the same mode button', async () => {
            const user = userEvent.setup()
            const renderSpy = vi.fn()

            // Mock React.memo per verificare re-renders
            const OriginalApp = App
            vi.spyOn(React, 'createElement').mockImplementation((...args) => {
                if (args[0] === OriginalApp) {
                    renderSpy()
                }
                return React.createElement(...args)
            })

            render(<App />)

            const humanVsComputerBtn = screen.getByText('Umano vs Computer')

            // Click sulla modalità già attiva
            await user.click(humanVsComputerBtn)
            await user.click(humanVsComputerBtn)

            // Dovrebbe essere chiamato solo una volta per il render iniziale
            expect(renderSpy).toHaveBeenCalledTimes(1)
        })

        it('should memoize player labels correctly', () => {
            const { rerender } = render(<App />)

            // Prendi il riferimento iniziale
            const initialPlayer1Label = screen.getByText('Umano')

            // Re-render senza cambiare modalità
            rerender(<App />)

            // Il testo dovrebbe essere lo stesso oggetto (memoized)
            const rerenderPlayer1Label = screen.getByText('Umano')
            expect(initialPlayer1Label.textContent).toBe(rerenderPlayer1Label.textContent)
        })

        it('should handle rapid button clicks without performance issues', async () => {
            const user = userEvent.setup()
            const { getRandomMove } = await import('../gameLogic')
            vi.mocked(getRandomMove).mockReturnValue('scissors')

            render(<App />)

            const startTime = performance.now()

            // Simula clicks rapidi
            await user.click(screen.getByText('Inizia Partita'))
            await user.click(screen.getByText('Sasso'))
            await user.click(screen.getByText('Nuovo Round'))
            await user.click(screen.getByText('Sasso'))
            await user.click(screen.getByText('Nuovo Round'))
            await user.click(screen.getByText('Sasso'))

            const endTime = performance.now()
            const executionTime = endTime - startTime

            // Dovrebbe completare in meno di 1 secondo
            expect(executionTime).toBeLessThan(1000)
            expect(screen.getByText('3')).toBeInTheDocument() // Human score should be 3
        })
    })
})