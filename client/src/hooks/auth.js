import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-config'; 
import { useSignOut } from 'react-firebase-hooks/auth';
import { useToast } from '@chakra-ui/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Hook for managing the current user
export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    return currentUser;
};

// Hook for creating a new user account
export const useCreateAccount = () => {
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();
    const [error, setError] = useState(null);

    const createAccount = async (email, password) => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth,email, password);
            toast({
                title: "Account created",
                description: "Please check your email for finishing registration",
                status: "info",
                isClosable: true,
                position: "top",
                duration: 5000,
              });

            
        } catch (error) {
            setError(error.message);
        }
    };

    return { error, createAccount };
};

// Hook for logging in
export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    

    const login = async (email, password) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return { isLoading, error, login };
};

// Hook for logging out
export const useLogout = () => {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [signOut] = useSignOut(auth);

    const toast = useToast();

    const logout = async () => {
        setLoading(true);
        try {
            if (await signOut()) {
                toast({
                  title: "Successfully logged out",
                  status: "success",
                  isClosable: true,
                  position: "top",
                  duration: 5000,
                });
              }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return { isLoading, error, logout };
};