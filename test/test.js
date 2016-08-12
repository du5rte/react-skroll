import assert from 'assert'

import Scroll, { initialScrollState, util } from '../src'

describe('Libary', () => {
  describe('modules', () => {
    it('should export default module', () => {
      assert.ok(Scroll)
    })

    it('should export modules', () => {
      assert.ok(initialScrollState)
      assert.ok(util)
    })
  })
})
