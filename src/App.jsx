import { useState } from 'react'
import FocusDemo    from './components/FocusDemo'
import AriaDemo     from './components/AriaDemo'
import ContrastDemo from './components/ContrastDemo'
import FormDemo     from './components/FormDemo'

const TABS = ['Focus Management', 'ARIA Labels', 'Color Contrast', 'Form Accessibility']

function App() {
  const [tab, setTab] = useState(0)

  return (
    <div>
      <div className="app-header">
        <div className="app-header-title">
          <h1>Accessible UI Kit</h1>
          <p>WCAG 2.1 compliance patterns — broken vs fixed, side by side</p>
        </div>
        <div className="app-tabs">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`tab-btn ${tab === i ? 'tab-active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="app-content">
        {tab === 0 && <FocusDemo />}
        {tab === 1 && <AriaDemo />}
        {tab === 2 && <ContrastDemo />}
        {tab === 3 && <FormDemo />}
      </div>
    </div>
  )
}

export default App