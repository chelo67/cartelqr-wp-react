import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('wp_jwt_token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                // Use context=edit to get more fields like email
                const response = await fetch('https://koonetix.shop/wp-json/wp/v2/users/me?context=edit', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        id: userData.id,
                        username: userData.slug,
                        email: userData.email || userData.user_email, // Fallback just in case
                        firstName: userData.first_name,
                        lastName: userData.last_name,
                        displayName: userData.name,
                    });
                } else {
                    // Token might be expired
                    logout();
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const refreshUser = async () => {
        if (!token) return;

        try {
            const response = await fetch('https://koonetix.shop/wp-json/wp/v2/users/me?context=edit', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser({
                    id: userData.id,
                    username: userData.slug,
                    email: userData.email || userData.user_email,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    displayName: userData.name,
                });
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    const login = async (username: string, password: string) => {
        const response = await fetch('https://koonetix.shop/wp-json/jwt-auth/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Credenciales inválidas o servidor no configurado');
        }

        const data = await response.json();
        const newToken = data.token;

        localStorage.setItem('wp_jwt_token', newToken);

        // Fetch user data immediately to ensure state is consistent before completing login
        const userResponse = await fetch('https://koonetix.shop/wp-json/wp/v2/users/me', {
            headers: {
                'Authorization': `Bearer ${newToken}`,
            },
        });

        if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser({
                id: userData.id,
                username: userData.slug,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                displayName: userData.name,
            });
        }

        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('wp_jwt_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                refreshUser,
                isAuthenticated: !!token && !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
