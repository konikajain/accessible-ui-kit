import { useState, useRef } from 'react'

function FocusDemo() {
  const [log, setLog] = useState([])

  function addLog(msg, type) {
    setLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev.slice(0, 12)])
  }

  return (
    <div>
      <div className="demo-header">
        <h2>Focus Management</h2>
        <p>
          Keyboard users navigate with Tab, Shift+Tab, Enter and Escape.
          Every interactive element must have a visible focus indicator —
          without it, keyboard users are completely lost on the page.
        </p>
      </div>

      {/* comparison */}
      <div className="comparison-grid">

        {/* BAD */}
        <div className="comparison-card bad">
          <div className="comparison-label bad">✗ Wrong — no focus indicator</div>
          <p className="comparison-desc">Press Tab to navigate. You cannot tell which element is focused.</p>

          <div className="focus-demo-area">
            <button
              className="focus-item no-focus"
              onFocus={() => addLog('BAD: Button focused — user cannot see it', 'red')}
            >
              Submit Form
            </button>
            <button
              className="focus-item no-focus"
              onFocus={() => addLog('BAD: Link focused — user cannot see it', 'red')}
            >
              Learn More
            </button>
            <button
              className="focus-item no-focus"
              onFocus={() => addLog('BAD: Menu item focused — user cannot see it', 'red')}
            >
              Open Menu
            </button>
          </div>

          <div className="code-block">
            <span className="code-red">{'button:focus { outline: none; }'}</span>
          </div>
        </div>

        {/* GOOD */}
        <div className="comparison-card good">
          <div className="comparison-label good">✓ Correct — visible focus ring</div>
          <p className="comparison-desc">Press Tab to navigate. Focus is always clearly visible.</p>

          <div className="focus-demo-area">
            <button
              className="focus-item with-focus"
              onFocus={() => addLog('GOOD: Button focused — green ring visible ✓', 'green')}
            >
              Submit Form
            </button>
            <button
              className="focus-item with-focus"
              onFocus={() => addLog('GOOD: Link focused — green ring visible ✓', 'green')}
            >
              Learn More
            </button>
            <button
              className="focus-item with-focus"
              onFocus={() => addLog('GOOD: Menu item focused — green ring visible ✓', 'green')}
            >
              Open Menu
            </button>
          </div>

          <div className="code-block">
            <span className="code-green">{'button:focus-visible { outline: 2px solid #34d399; }'}</span>
          </div>
        </div>

      </div>

      {/* focus trap */}
      <div className="card">
        <div className="card-title">Focus Trap in Modal — WCAG 2.1.2</div>
        <p className="comparison-desc" style={{ marginBottom: '1rem' }}>
          When a modal opens, Tab should cycle only within it.
          Focus must not escape to elements behind. Press Escape to close.
        </p>
        <FocusTrapDemo onLog={addLog} />
      </div>

      {/* log */}
      <div className="log-label">KEYBOARD EVENT LOG</div>
      <div className="log-box">
        {log.length === 0 && (
          <div className="log-line log-gray">// press Tab to navigate the elements above...</div>
        )}
        {log.map(l => (
          <div key={l.id} className={`log-line log-${l.type}`}>{l.msg}</div>
        ))}
      </div>

    </div>
  )
}

// ── Focus Trap ───────────────────────────────────────────────────────────────
function FocusTrapDemo({ onLog }) {
  const [isOpen, setIsOpen] = useState(false)
  const firstFocusRef       = useRef(null)
  const lastFocusRef        = useRef(null)
  const triggerRef          = useRef(null)

  function openModal() {
    setIsOpen(true)
    onLog('Modal opened — focus trapped inside ✓', 'green')
    setTimeout(() => firstFocusRef.current?.focus(), 50)
  }

  function closeModal() {
    setIsOpen(false)
    onLog('Modal closed — focus returned to trigger ✓', 'green')
    triggerRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal()
      return
    }
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusRef.current) {
        e.preventDefault()
        lastFocusRef.current?.focus()
        onLog('Focus wrapped to last element (Shift+Tab) ✓', 'green')
      } else if (!e.shiftKey && document.activeElement === lastFocusRef.current) {
        e.preventDefault()
        firstFocusRef.current?.focus()
        onLog('Focus wrapped to first element (Tab) ✓', 'green')
      }
    }
  }

  return (
    <div>
      <button
        ref={triggerRef}
        className="focus-item with-focus"
        onClick={openModal}
        aria-haspopup="dialog"
      >
        Open Modal
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onKeyDown={handleKeyDown}
          className="modal-overlay"
        >
          <div className="modal-box">
            <h3 id="modal-title">Confirm Action</h3>
            <p className="comparison-desc">
              Tab cycles only within this modal. Press Escape to close.
            </p>
            <input
              ref={firstFocusRef}
              type="text"
              placeholder="First focusable element"
              className="form-input"
            />
            <div className="modal-actions">
              <button
                className="focus-item with-focus"
                onClick={() => onLog('Cancel clicked', 'amber')}
              >
                Cancel
              </button>
              <button
                ref={lastFocusRef}
                className="focus-item with-focus active-green"
                onClick={closeModal}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FocusDemo