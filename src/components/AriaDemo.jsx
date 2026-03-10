import { useState, useRef } from 'react'

function AriaDemo() {
  const [log, setLog]               = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading]   = useState(false)
  const [count, setCount]           = useState(0)
  const liveRegionRef               = useRef(null)

  function addLog(msg, type) {
    setLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev.slice(0, 12)])
  }

  function announce(msg) {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = ''
      setTimeout(() => {
        liveRegionRef.current.textContent = msg
      }, 50)
    }
  }

  function handleLoadingClick() {
    setIsLoading(true)
    addLog('Screen reader hears: "Loading, please wait..." ✓', 'green')
    announce('Loading, please wait...')
    setTimeout(() => {
      setIsLoading(false)
      addLog('Screen reader hears: "Content loaded successfully" ✓', 'green')
      announce('Content loaded successfully')
    }, 2000)
  }

  function handleCount(direction) {
    const next = direction === 'up' ? count + 1 : count - 1
    setCount(next)
    announce(`Count is now ${next}`)
    addLog(`Screen reader hears: "Count is now ${next}" ✓`, 'green')
  }

  return (
    <div>
      <div className="demo-header">
        <h2>ARIA Labels</h2>
        <p>
          ARIA (Accessible Rich Internet Applications) attributes tell screen readers
          what elements are and what they do. Without them, blind users hear
          "button button button" with no context.
        </p>
      </div>

      {/* live region — invisible, read by screen readers */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* comparison — icon buttons */}
      <div className="comparison-grid">

        <div className="comparison-card bad">
          <div className="comparison-label bad">✗ Wrong — no label</div>
          <p className="comparison-desc">
            Screen reader announces: "button" — no context at all.
          </p>

          <div className="focus-demo-area">
            <button
              className="focus-item with-focus"
              onFocus={() => addLog('BAD: Screen reader says "button" — meaningless ✗', 'red')}
            >
              🗑️
            </button>
            <button
              className="focus-item with-focus"
              onFocus={() => addLog('BAD: Screen reader says "button" — meaningless ✗', 'red')}
            >
              ✏️
            </button>
            <button
              className="focus-item with-focus"
              onFocus={() => addLog('BAD: Screen reader says "button" — meaningless ✗', 'red')}
            >
              ❤️
            </button>
          </div>

          <div className="code-block">
            <span className="code-red">{'<button>🗑️</button>'}</span>
          </div>
        </div>

        <div className="comparison-card good">
          <div className="comparison-label good">✓ Correct — aria-label added</div>
          <p className="comparison-desc">
            Screen reader announces the actual purpose of each button.
          </p>

          <div className="focus-demo-area">
            <button
              className="focus-item with-focus"
              aria-label="Delete item"
              onFocus={() => addLog('GOOD: Screen reader says "Delete item, button" ✓', 'green')}
            >
              🗑️
            </button>
            <button
              className="focus-item with-focus"
              aria-label="Edit item"
              onFocus={() => addLog('GOOD: Screen reader says "Edit item, button" ✓', 'green')}
            >
              ✏️
            </button>
            <button
              className="focus-item with-focus"
              aria-label="Add to favourites"
              onFocus={() => addLog('GOOD: Screen reader says "Add to favourites, button" ✓', 'green')}
            >
              ❤️
            </button>
          </div>

          <div className="code-block">
            <span className="code-green">{'<button aria-label="Delete item">🗑️</button>'}</span>
          </div>
        </div>

      </div>

      {/* accordion — aria-expanded */}
      <div className="card">
        <div className="card-title">aria-expanded — Accordion</div>
        <p className="comparison-desc" style={{ marginBottom: '1rem' }}>
          When content expands or collapses, screen readers need to know the state.
          aria-expanded tells them "this is open" or "this is closed".
        </p>

        <button
          className="focus-item with-focus"
          aria-expanded={isExpanded}
          aria-controls="accordion-content"
          onClick={() => {
            setIsExpanded(v => !v)
            addLog(
              `Screen reader hears: "FAQ, ${!isExpanded ? 'expanded' : 'collapsed'}, button" ✓`,
              'green'
            )
          }}
          style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
        >
          <span>What is WCAG?</span>
          <span>{isExpanded ? '▲' : '▼'}</span>
        </button>

        {isExpanded && (
          <div
            id="accordion-content"
            className="aria-content"
          >
            WCAG stands for Web Content Accessibility Guidelines. It is the international
            standard for making web content accessible to people with disabilities.
            WCAG 2.1 has three levels: A, AA, and AAA.
          </div>
        )}

        <div className="code-block" style={{ marginTop: '1rem' }}>
          <span className="code-green">{`<button aria-expanded="${isExpanded}" aria-controls="content">`}</span>
        </div>
      </div>

      {/* live region demo */}
      <div className="card">
        <div className="card-title">aria-live — Dynamic Announcements</div>
        <p className="comparison-desc" style={{ marginBottom: '1rem' }}>
          When content changes dynamically (loading, errors, counts), screen readers
          won't notice unless you use aria-live. It announces changes automatically.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="focus-item with-focus"
            onClick={handleLoadingClick}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? '⏳ Loading...' : 'Simulate API Call'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="focus-item with-focus"
              aria-label="Decrease count"
              onClick={() => handleCount('down')}
            >
              −
            </button>
            <span
              aria-live="polite"
              style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 700, color: '#fff' }}
            >
              {count}
            </span>
            <button
              className="focus-item with-focus"
              aria-label="Increase count"
              onClick={() => handleCount('up')}
            >
              +
            </button>
          </div>
        </div>

        <div className="code-block" style={{ marginTop: '1rem' }}>
          <span className="code-green">{'<div aria-live="polite">Content updates announced automatically</div>'}</span>
        </div>
      </div>

      {/* roles */}
      <div className="comparison-grid">
        <div className="comparison-card bad">
          <div className="comparison-label bad">✗ Wrong — div as button</div>
          <p className="comparison-desc">
            Divs have no role. Screen readers won't know this is clickable.
            Keyboard users can't Tab to it or press Enter.
          </p>
          <div
            className="focus-item"
            onClick={() => addLog('BAD: div clicked — not keyboard accessible ✗', 'red')}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            Click Me
          </div>
          <div className="code-block">
            <span className="code-red">{'<div onClick={handle}>Click Me</div>'}</span>
          </div>
        </div>

        <div className="comparison-card good">
          <div className="comparison-label good">✓ Correct — semantic button</div>
          <p className="comparison-desc">
            Real buttons are keyboard accessible, focusable, and announced
            correctly by screen readers — for free.
          </p>
          <button
            className="focus-item with-focus"
            onClick={() => addLog('GOOD: button clicked — keyboard accessible ✓', 'green')}
            style={{ width: '100%' }}
          >
            Click Me
          </button>
          <div className="code-block">
            <span className="code-green">{'<button onClick={handle}>Click Me</button>'}</span>
          </div>
        </div>
      </div>

      {/* log */}
      <div className="log-label">SCREEN READER SIMULATION LOG</div>
      <div className="log-box">
        {log.length === 0 && (
          <div className="log-line log-gray">// tab through or click elements to see what a screen reader would announce...</div>
        )}
        {log.map(l => (
          <div key={l.id} className={`log-line log-${l.type}`}>{l.msg}</div>
        ))}
      </div>

    </div>
  )
}

export default AriaDemo