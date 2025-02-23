"use client"

import { Toaster } from 'react-hot-toast'

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#4caf50',
          },
        },
        error: {
          style: {
            background: '#f44336',
          },
        },
      }}
    />
  )
}
