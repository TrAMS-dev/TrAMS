'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

interface Profile {
    full_name: string | null
    role: string | null
    approved: boolean | null
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isApproved, setIsApproved] = useState(false)

    const supabase = createClient()

    // Helper function to update auth state
    const updateAuthState = (user: User | null, profile: Profile | null) => {
        if (user && profile) {
            setUser(user)
            setIsAuthenticated(true)
            setUserName(profile.full_name || user.email || null)
            setIsAdmin(profile.role === 'admin')
            setIsApproved(profile.approved ?? false)
        } else {
            setUser(null)
            setIsAuthenticated(false)
            setUserName(null)
            setIsAdmin(false)
            setIsApproved(false)
        }
    }

    // Fetch user profile data
    const fetchProfile = async (userId: string): Promise<Profile | null> => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('full_name, role, approved')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                return null
            }

            return profile
        } catch (error) {
            console.error('Profile fetch error:', error)
            return null
        }
    }

    // Sync session + profile; never call this from inside onAuthStateChange (Supabase holds a lock there).
    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const profile = await fetchProfile(user.id)
                updateAuthState(user, profile)
            } else {
                updateAuthState(null, null)
            }
        } catch (error) {
            console.error('Auth check error:', error)
            updateAuthState(null, null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (
                event === 'INITIAL_SESSION' ||
                event === 'SIGNED_IN' ||
                event === 'TOKEN_REFRESHED' ||
                event === 'USER_UPDATED'
            ) {
                queueMicrotask(() => {
                    void checkUser()
                })
            } else if (event === 'SIGNED_OUT') {
                updateAuthState(null, null)
                setIsLoading(false)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const logout = async () => {
        try {
            await supabase.auth.signOut()
        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    }

    return {
        user,
        userName,
        isAuthenticated,
        isLoading,
        isAdmin,
        isApproved,
        logout,
        refresh: checkUser,
    }
}
