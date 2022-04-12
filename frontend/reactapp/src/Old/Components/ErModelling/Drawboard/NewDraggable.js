import React from 'react'
import { useDrag } from 'react-dnd'

export default function Box() {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
		// "type" is required. It is used by the "accept" specification of drop targets.
    type: 'BOX',
		// The collect function utilizes a "monitor" instance (see the Overview for what this is)
		// to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1}}>
        <div role="Handle" ref={drag} />
    </div>
  )
}