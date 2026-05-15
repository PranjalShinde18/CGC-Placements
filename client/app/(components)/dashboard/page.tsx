// "use client";

// import { useExpandContext } from "@/app/(Context)/ExpandContext";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import LineChart from "../(Charts)/LineChart";
// import Piechart from "../(Charts)/Piechart";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useUserContext } from "@/app/(Context)/UserContext";

// // Define the type for the role data
// interface Role {
//   title: string;
//   description: string;
//   application_deadline: string;
//   eligibility: number;
//   min_experience: number;
//   salary: number;
//   employment_type: string;
//   location: string;
// }

// // Define the type for the company data
// interface Company {
//   name: string;
//   image: string;
//   email: string;
//   address: string;
//   contact: number;
//   website: string;
// }

// // Define the type for the job data
// interface Job {
//   _id: string;
//   company: Company;
//   roles: Role[];
//   status: string;
//   applications: any[]; // Adjust this type if you have more information about applications
// }

// const Dashboard = () => {
//   const { expand } = useExpandContext();
//   const { user } = useUserContext();
//   const [totalJobs, setTotalJobs] = useState<number>(0);
//   const [eligibleJobs, setEligibleJobs] = useState<number>(0);
//   const [recentJobs, setRecentJobs] = useState<Job[]>([]);
//   const router = useRouter();

//   const handleAllJobs = () => {
//     router.push("/jobs");
//   };

//   const handleAppliedJobs = () => {
//     router.push("/track-jobs");
//   };

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {

//         const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/get`);

//         const data: Job[] = await response.json();

//         // total jobs
//         setTotalJobs(data.length);

//         // eligible jobs
//         const eligible = data.filter((job) =>
//           job.roles.some((role) => role.eligibility <= user.cgpa)
//         );
//         setEligibleJobs(eligible.length);

//         // Assuming jobs are sorted by date and you want the latest 5 jobs
//         const latestJobs = data.slice(-5).reverse(); // Take the last 5 jobs and reverse to show latest first

//         setRecentJobs(latestJobs);
//       } catch (error) {
//         console.error("Failed to fetch jobs", error);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const handleRowClick = (jobId: string) => {
//     // Navigate to the job detail page
//     router.push(`/jobs/${jobId}`);
//   };

//   return (
//     <div
//       className={`p-7 bg-slate-200 transition-all duration-300 ${
//         expand ? "ml-56" : "ml-20"
//       }`}
//     >
//       <h1 className="text-2xl font-bold mb-1 text-gray-600 border-b">
//         Statistics
//       </h1>

//       <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
//         <div
//           className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
//             expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
//           }`}
//           onClick={handleAllJobs}
//         >
//           <h1 className="text-3xl font-bold">{totalJobs}</h1>
//           <h3 className="text-lg text-gray-400">Total Companies</h3>
//         </div>

//         <div
//           className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
//             expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
//           }`}
//           onClick={handleAllJobs}
//         >
//           <h1 className="text-3xl font-bold">{eligibleJobs}</h1>
//           <h3 className="text-lg text-gray-400">Eligible Companies</h3>
//         </div>

//         <div
//           className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
//             expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
//           }`}
//           onClick={handleAppliedJobs}
//         >
//           <h1 className="text-3xl font-bold">{user.applications.length}</h1>
//           <h3 className="text-lg text-gray-400">Applied Companies</h3>
//         </div>

//         <div
//           className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
//             expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
//           }`}
//           onClick={handleAppliedJobs}
//         >
//           <h1 className="text-3xl font-bold">0</h1>
//           <h3 className="text-lg text-gray-400">In Progress</h3>
//         </div>
//       </div>

//       <h1 className="text-2xl font-bold mt-6 text-gray-600 border-b">
//         Analytics
//       </h1>

//       <div className="flex max-lg:flex-col gap-4">
//         <div className="mt-1 lg:w-2/3 transition-all duration-300 hover:shadow-xl shadow-black rounded-lg bg-white border border-gray-100">
//           <LineChart />
//         </div>
//         <div className="mt-1 lg:w-1/3 transition-all duration-300 hover:shadow-xl shadow-black rounded-lg bg-white border border-gray-100">
//           <Piechart />
//         </div>
//       </div>

//       <h1 className="text-2xl font-bold mt-6 text-gray-600 border-b">
//         Recent Companies
//       </h1>

//       <div className="mt-1 rounded-lg overflow-hidden transition-all duration-300 bg-white border border-gray-100 hover:shadow-xl">
//         <Table>
//           <TableHeader className="text-lg font-semibold bg-slate-100">
//             <TableRow>
//               <TableHead className="w-1/3">Company Name</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Job Type</TableHead>
//               <TableHead>Location</TableHead>
//               <TableHead className="text-right">Package(LPA)</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody className="text-gray-500 font-medium">
//             {recentJobs.flatMap((job) =>
//               job.roles.map((role, index) => (
//                 <TableRow
//                   key={index}
//                   className="hover:bg-slate-50 cursor-pointer"
//                   onClick={() => handleRowClick(job._id)} // Example, use a unique ID for navigation
//                 >
//                   <TableCell className="font-medium">
//                     <div className="flex items-center">
//                       <img
//                         src={job.company.image}
//                         alt={job.company.name}
//                         className="h-6 w-6 mr-2"
//                       />
//                       <span>{job.company.name}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>{role.title}</TableCell>
//                   <TableCell>{role.employment_type}</TableCell>
//                   <TableCell>{role.location}</TableCell>
//                   <TableCell className="text-right">
//                     {(role.salary * 12) / 100000} LPA
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






"use client";

import { useExpandContext } from "@/app/(Context)/ExpandContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LineChart from "../(Charts)/LineChart";
import Piechart from "../(Charts)/Piechart";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserContext } from "@/app/(Context)/UserContext";

// Define the type for the role data
interface Role {
  title: string;
  description: string;
  application_deadline: string;
  eligibility: number;
  min_experience: number;
  salary: number;
  employment_type: string;
  location: string;
}

// Define the type for the company data
interface Company {
  name: string;
  image: string;
  email: string;
  address: string;
  contact: number;
  website: string;
}

// Define the type for the job data
interface Job {
  _id: string;
  company: Company;
  roles: Role[];
  status: string;
  applications: any[]; // Adjust this type if you have more information about applications
}

const Dashboard = () => {
  const { expand } = useExpandContext();
  const { user } = useUserContext();
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [eligibleJobs, setEligibleJobs] = useState<number>(0);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const router = useRouter();

  const handleAllJobs = () => {
    router.push("/jobs");
  };

  const handleAppliedJobs = () => {
    router.push("/track-jobs");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/get`);

        const data: Job[] = await response.json();

        // total jobs
        setTotalJobs(data.length);

        // eligible jobs
        const eligible = data.filter((job) =>
          job.roles.some((role) => role.eligibility <= user.cgpa)
        );
        setEligibleJobs(eligible.length);

        // Assuming jobs are sorted by date and you want the latest 5 jobs
        const latestJobs = data.slice(-5).reverse(); // Take the last 5 jobs and reverse to show latest first

        setRecentJobs(latestJobs);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchJobs();
  }, []);

  const handleRowClick = (jobId: string) => {
    // Navigate to the job detail page
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div
      className={`p-7 bg-slate-200 transition-all duration-300 ${
        expand ? "ml-56" : "ml-20"
      }`}
    >
      <h1 className="text-2xl font-bold mb-1 text-gray-600 border-b">
        Statistics
      </h1>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        <div
          className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
            expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
          }`}
          onClick={handleAllJobs}
        >
          <h1 className="text-3xl font-bold">{totalJobs}</h1>
          <h3 className="text-lg text-gray-400">Total Companies</h3>
        </div>

        <div
          className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
            expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
          }`}
          onClick={handleAllJobs}
        >
          <h1 className="text-3xl font-bold">{eligibleJobs}</h1>
          <h3 className="text-lg text-gray-400">Eligible Companies</h3>
        </div>

        <div
          className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
            expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
          }`}
          onClick={handleAppliedJobs}
        >
          <h1 className="text-3xl font-bold">{user.applications.length}</h1>
          <h3 className="text-lg text-gray-400">Applied Companies</h3>
        </div>

        <div
          className={`rounded-md flex flex-col gap-2 justify-end p-4 transition-all duration-300 h-32 bg-white hover:shadow-xl hover:pb-6 hover:pl-5 cursor-pointer ${
            expand ? "w-[calc(100%)]" : "w-[calc(100%)]"
          }`}
          onClick={handleAppliedJobs}
        >
          <h1 className="text-3xl font-bold">0</h1>
          <h3 className="text-lg text-gray-400">In Progress</h3>
        </div>
      </div>

      <h1 className="text-2xl font-bold mt-6 text-gray-600 border-b">
        Analytics
      </h1>

      <div className="flex max-lg:flex-col gap-4">
        <div className="mt-1 lg:w-2/3 transition-all duration-300 hover:shadow-xl shadow-black rounded-lg bg-white border border-gray-100">
          <LineChart />
        </div>
        <div className="mt-1 lg:w-1/3 transition-all duration-300 hover:shadow-xl shadow-black rounded-lg bg-white border border-gray-100">
          <Piechart />
        </div>
      </div>

      <h1 className="text-2xl font-bold mt-6 text-gray-600 border-b">
        Recent Companies
      </h1>

      <div className="mt-1 rounded-lg overflow-hidden transition-all duration-300 bg-white border border-gray-100 hover:shadow-xl">
        <Table>
          <TableHeader className="text-lg font-semibold bg-slate-100">
            <TableRow>
              <TableHead className="w-1/3">Company Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Package(LPA)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-500 font-medium">
            {recentJobs.flatMap((job) =>
              job.roles.map((role, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleRowClick(job._id)} // Example, use a unique ID for navigation
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <img
                        src={job.company.image}
                        alt={job.company.name}
                        className="h-6 w-6 mr-2"
                      />
                      <span>{job.company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{role.title}</TableCell>
                  <TableCell>{role.employment_type}</TableCell>
                  <TableCell>{role.location}</TableCell>
                  <TableCell className="text-right">
                    {(role.salary * 12) / 100000} LPA
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;