import assert from 'assert'

import ReactSkroll, { Scroller, ScrollLink, ScrollProvider, } from '../src'

describe('Libary', () => {
  describe('modules', () => {
    it('should export default module', () => {
      assert.ok(ReactSkroll)
    })

    it('should export modules', () => {
      assert.ok(ScrollProvider)
      assert.ok(Scroller)
      assert.ok(ScrollLink)
    })
  })
})
