'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'

interface FormData {
  name: string
  age: string
  email: string
  password: string
  bloodMarkers: {
    rbc: string
    wbc: string
    sugar: string
    lipid: string
  }
}

interface Props {
  onComplete: (userId: string) => void
}

export default function RegistrationForm({ onComplete }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    email: '',
    password: '',
    bloodMarkers: {
      rbc: '',
      wbc: '',
      sugar: '',
      lipid: ''
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, string>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sign up the user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            full_name: formData.name,
          },
        },
      })

      if (signUpError) throw signUpError

      if (user) {
        // Create a profile for the user
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            email: user.email,
            name: formData.name,
            age: parseInt(formData.age),
          },
        ])

        if (profileError) throw profileError

        // Add blood markers
        const { error: markersError } = await supabase.from('blood_markers').insert([
          {
            profile_id: user.id,
            rbc: parseFloat(formData.bloodMarkers.rbc),
            wbc: parseFloat(formData.bloodMarkers.wbc),
            sugar: parseFloat(formData.bloodMarkers.sugar),
            lipid: parseFloat(formData.bloodMarkers.lipid),
          },
        ])

        if (markersError) throw markersError

        showToast('Registration successful! Please check your email for verification.', 'success')
        onComplete(user.id)
        router.push('/auth/login')
      }
    } catch (error: any) {
      showToast(error.message || 'Error during registration. Please try again.', 'error')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="age" className="form-label">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <motion.button
              type="button"
              onClick={nextStep}
              className="btn-primary mt-4 w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-4">Blood Markers</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="rbc" className="form-label">
                  Red Blood Cells (RBC)
                </label>
                <input
                  type="number"
                  id="rbc"
                  name="bloodMarkers.rbc"
                  value={formData.bloodMarkers.rbc}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="wbc" className="form-label">
                  White Blood Cells (WBC)
                </label>
                <input
                  type="number"
                  id="wbc"
                  name="bloodMarkers.wbc"
                  value={formData.bloodMarkers.wbc}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="sugar" className="form-label">
                  Blood Sugar
                </label>
                <input
                  type="number"
                  id="sugar"
                  name="bloodMarkers.sugar"
                  value={formData.bloodMarkers.sugar}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="lipid" className="form-label">
                  Lipid Profile
                </label>
                <input
                  type="number"
                  id="lipid"
                  name="bloodMarkers.lipid"
                  value={formData.bloodMarkers.lipid}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <motion.button
                type="button"
                onClick={prevStep}
                className="btn-secondary flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <motion.button
                type="submit"
                className="btn-primary flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  )
}
