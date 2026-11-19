import { expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sidebar } from './Sidebar'

it('shows all six destinations and marks unfinished views as coming soon', () => {
  render(<Sidebar route="dashboard" open={false} onClose={() => {}} />)
  const navigation = screen.getByRole('navigation', { name: 'Primary' })
  expect(navigation.querySelectorAll('a')).toHaveLength(6)
  expect(navigation.querySelectorAll('.nav-soon')).toHaveLength(4)
  expect(screen.getByRole('link', { name: /Devices/ }).getAttribute('href')).toBe('#/devices')
  expect(screen.getByRole('link', { name: /Performance/ }).getAttribute('href')).toBe('#/performance')
})
