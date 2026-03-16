import React from 'react'
import '../styles/quick-filters.css'

export default function QuickFilterBar({statuses, timeFilters, activeStatus, activeTime, onStatusChange, onTimeChange, onRefresh}){
  return (
    <div className="quick-filter-bar">
      <div className="status-chips">
        {statuses.map(s=> (
          <button key={s} className={`chip ${activeStatus===s? 'active':''}`} onClick={()=>onStatusChange(s)}>{s}</button>
        ))}
      </div>

      <div className="time-chips">
        {timeFilters.map(t=> (
          <button key={t.key} className={`chip ${activeTime===t.key? 'active':''}`} onClick={()=>onTimeChange(t.key)}>{t.label}</button>
        ))}
      </div>

      <div style={{marginLeft:8}}>
        <button className="chip" onClick={onRefresh}>Refresh</button>
      </div>
    </div>
  )
}
