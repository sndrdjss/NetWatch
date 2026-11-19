import { expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConnectionBanner, ConnectionStatus } from './ConnectionStatus'

it('distinguishes an API disconnection from a device status', () => {
  render(<><ConnectionStatus connection="lost"/><ConnectionBanner connection="lost" lastSuccessfulUpdate="2026-01-01T00:00:00Z"/></>)
  expect(screen.getByRole('status').textContent).toContain('API Disconnected')
  expect(screen.getByRole('alert').textContent).toContain('Connection Lost — Showing Last Known Readings')
  expect(screen.getByRole('alert').textContent).toContain('Last successful update:')
})
