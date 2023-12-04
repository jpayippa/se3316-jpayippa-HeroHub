import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-config'; 
import { useSignOut } from 'react-firebase-hooks/auth';
import { useToast } from '@chakra-ui/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../router/Approuter';


// Hook for creating a new user account
export const useCreateAccount = () => {
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const createAccount = async (email, password, username) => {
        setLoading(true);
        try {
           await createUserWithEmailAndPassword(auth,email, password)
                .then((userCredential) => {
                // User created
                    const user = userCredential.user;
                
                // Send verification email
                 sendEmailVerification(user)
                  .then(() => {
                    console.log("Verification email sent.");
                  });
            toast({
                title: "Account created",
                description: "Please check your email for finishing registration",
                status: "info",
                isClosable: true,
                position: "top",
                duration: 5000,
              });

              createUserInDatabase({firebaseId:user.uid,email, username});
                navigate(LOGIN);
  })

            
        } catch (error) {
            setError(error.message);
        }
    };

    return { error, createAccount };
};

const createUserInDatabase = async (userData) => {


    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('User registered successfully');
        } else {
        }
    } catch (err) {
    }
}

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
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                localStorage.removeItem('email');
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