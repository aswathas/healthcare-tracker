'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/useToast';

interface ProfileFormData {
  full_name: string;
  email: string;
  avatar_url?: string;
  health_goals?: string;
  preferred_language?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
  };
}

export default function ProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    email: '',
    health_goals: '',
    preferred_language: 'en',
    notification_preferences: {
      email: true,
      push: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load existing profile data
      const loadProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          toast({
            title: 'Error',
            description: 'Failed to load profile data',
            variant: 'destructive',
          });
          return;
        }

        if (data) {
          setFormData({
            full_name: data.full_name || '',
            email: user.email || '',
            avatar_url: data.avatar_url,
            health_goals: data.health_goals || '',
            preferred_language: data.preferred_language || 'en',
            notification_preferences: data.notification_preferences || {
              email: true,
              push: true,
            },
          });
        }
      };

      loadProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          disabled
          className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="health_goals" className="block text-sm font-medium text-gray-700">
          Health Goals
        </label>
        <textarea
          id="health_goals"
          value={formData.health_goals}
          onChange={(e) => setFormData({ ...formData, health_goals: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Preferred Language
        </label>
        <select
          id="language"
          value={formData.preferred_language}
          onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700">Notification Preferences</h3>
        <div className="mt-2 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notification_preferences?.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notification_preferences: {
                    ...formData.notification_preferences,
                    email: e.target.checked,
                  },
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Email notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notification_preferences?.push}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notification_preferences: {
                    ...formData.notification_preferences,
                    push: e.target.checked,
                  },
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Push notifications</span>
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
