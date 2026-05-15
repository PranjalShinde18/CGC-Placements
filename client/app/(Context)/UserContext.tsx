// import { createContext, useContext, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export interface IApplication {
//   company: string;
//   status: string;
// }

// export interface IUser {
//   name: string;
//   roll_no: string;
//   email: string;
//   gender: string;
//   cgpa: Number;
//   branch: string;
//   phone_no: string;
//   address: string;
//   linkedin_url: string;
//   passout_year: string;
//   profile_pic: string;
//   resume: string;
//   bookmarks: string[];
//   applications: IApplication[];
// }

// interface UserContextType {
//   user: IUser;
//   setUser: React.Dispatch<React.SetStateAction<IUser>>;
// }

// const INITIAL_NAME = {
//   name: "",
//   roll_no: "",
//   email: "",
//   gender: "",
//   cgpa: 0,
//   branch: "",
//   phone_no: "",
//   address: "",
//   linkedin_url: "",
//   passout_year: "",
//   profile_pic: "",
//   resume: "",
//   bookmarks: [],
//   applications: [],
// };

// const INITIAL_STATE = {
//   user: INITIAL_NAME,
//   setUser: () => {},
// };

// export const UserContext = createContext<UserContextType>(INITIAL_STATE);

// const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<IUser>(INITIAL_STATE.user);

//   const router = useRouter();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) {
//       router.push("/signin");
//     } else {
//       setUser(JSON.parse(storedUser));
//       router.push("/dashboard");
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContextProvider;

// export const useUserContext = () => useContext(UserContext);

// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import Loader from "../(components)/(loader)/Loader";

// export interface IApplication {
//   company: string;
//   status: string;
// }

// export interface IUser {
//   name: string;
//   roll_no: string;
//   email: string;
//   gender: string;
//   cgpa: number;
//   branch: string;
//   phone_no: string;
//   address: string;
//   linkedin_url: string;
//   passout_year: string;
//   profile_pic: string;
//   resume: string;
//   bookmarks: string[];
//   applications: IApplication[];
// }

// interface UserContextType {
//   user: IUser;
//   setUser: React.Dispatch<React.SetStateAction<IUser>>;
// }

// const INITIAL_NAME: IUser = {
//   name: "",
//   roll_no: "",
//   email: "",
//   gender: "",
//   cgpa: 0,
//   branch: "",
//   phone_no: "",
//   address: "",
//   linkedin_url: "",
//   passout_year: "",
//   profile_pic: "",
//   resume: "",
//   bookmarks: [],
//   applications: [],
// };

// const INITIAL_STATE: UserContextType = {
//   user: INITIAL_NAME,
//   setUser: () => {},
// };

// export const UserContext = createContext<UserContextType>(INITIAL_STATE);

// const UserContextProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<IUser>(INITIAL_NAME);
//   const [loading, setLoading] = useState(true); // Add loading state

//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const storedUser = localStorage.getItem("user");
//       if (!storedUser) {
//         router.push("/signin");
//       } else {
//         setUser(JSON.parse(storedUser));
//         router.push("/dashboard");
//       }
//       setLoading(false); // Set loading to false after checking
//     };

//     checkAuth();
//   }, [router]);

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContextProvider;

// export const useUserContext = () => useContext(UserContext);

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "../(components)/(loader)/Loader";

export interface IApplication {
  company: string;
  status: string;
}

export interface IUser {
  name: string;
  roll_no: string;
  email: string;
  gender: string;
  cgpa: number;
  branch: string;
  phone_no: string;
  address: string;
  linkedin_url: string;
  passout_year: number;
  profile_pic: string;
  resume: string;
  bookmarks: string[];
  applications: IApplication[];
  github_url: string;
  portfolio_url: string;
}

interface UserContextType {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

const INITIAL_USER: IUser = {
  name: "",
  roll_no: "",
  email: "",
  gender: "",
  cgpa: 0,
  branch: "",
  phone_no: "",
  address: "",
  linkedin_url: "",
  passout_year: 0,
  profile_pic: "",
  resume: "",
  github_url: "",
  portfolio_url: "",
  bookmarks: [],
  applications: [],
};

const INITIAL_STATE: UserContextType = {
  user: INITIAL_USER,
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(INITIAL_STATE);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [loading, setLoading] = useState(true);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Routes that do NOT need an auth check
  const PUBLIC_ROUTES = ["/", "/signin", "/signup"];

  useEffect(() => {
    // Don't redirect if the user is already on a public page
    if (PUBLIC_ROUTES.includes(pathname)) {
      setLoading(false);
      setInitialLoadingComplete(true);
      return;
    }

    const checkAuth = async () => {
      // Record the start time
      const start = Date.now();

      // Perform authentication check
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/signin");
      } else {
        setUser(JSON.parse(storedUser));
      }

      const elapsed = Date.now() - start;

      if (elapsed < 500) {
        setTimeout(() => {
          setLoading(false);
          setInitialLoadingComplete(true);
        }, 500 - elapsed);
      } else {
        setLoading(false);
        setInitialLoadingComplete(true);
      }
    };

    checkAuth();
  }, [pathname]);

  if (!initialLoadingComplete) {
    return <Loader />;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export const useUserContext = () => useContext(UserContext);
