import { describe, expect, it, vi } from 'vitest'
import { copyText } from './clipboard'

describe('clipboard helper', () => {
  it('copies through the Clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    await expect(copyText('MSD-DEMO-ABC123', { clipboard: { writeText } })).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('MSD-DEMO-ABC123')
  })

  it('fails gracefully for empty text', async () => {
    await expect(copyText('')).resolves.toBe(false)
  })
})
