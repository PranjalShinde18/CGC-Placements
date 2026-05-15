"use client";

import React, { useEffect, useState } from "react";
import { useExpandContext } from "@/app/(Context)/ExpandContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/app/(components)/(loader)/Loader";
import { useRouter } from "next/navigation";

interface Company {
  name: string;
  image: string;
}

interface Role {
  title: string;
  salary: number;
  employment_type: string;
  location: string;
}

interface Job {
  _id: string;
  company: Company;
  roles: Role[];
}

interface Application {
  company: string; // jobId
  status: string;
  _id: string;
}

const Applications = () => {
  const { expand } = useExpandContext();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      // Retrieve user data from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const applicationsData = user.applications || [];

      console.log("Retrieved applications from user data:", applicationsData);

      if (applicationsData.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Set applications state
        setApplications(applicationsData);

        // Fetch job data for each application
        const jobPromises = applicationsData.map((app: Application) =>
          fetchJobData(app.company)
        );
        const fetchedJobs = await Promise.all(jobPromises);
        const validJobs = fetchedJobs.filter((job) => job !== null) as Job[];

        console.log("Valid jobs after fetching:", validJobs);

        setJobs(validJobs);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  async function fetchJobData(jobId: string): Promise<Job | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/get/${jobId}`);

      if (!response.ok) throw new Error("Failed to fetch job data");
      const data = await response.json();
      console.log("Fetched job data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching job data:", error);
      return null;
    }
  }

  const handleRowClick = (_id: string) => {
    router.push(`/jobs/${_id}`);
  };

  return (
    <div
      className={`p-7 bg-slate-200 min-h-screen transition-all duration-300 ${
        expand ? "ml-56" : "ml-20"
      }`}
    >
      <div className="mt-1 rounded-lg overflow-hidden bg-white">
        <h1 className="text-2xl font-bold p-4">My Applications</h1>

        {loading ? (
          <Loader />
        ) : jobs.length === 0 ? (
          <p className="text-lg p-4">No applications found</p>
        ) : (
          <Table>
            <TableHeader className="text-lg font-semibold bg-slate-100">
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-gray-500 font-medium">
              {jobs.map((job) => {
                // Find the application for the current job
                const application = applications.find(
                  (app) => app.company === job._id
                );
                const status = application ? application.status : "Unknown";

                return (
                  <TableRow key={job._id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div
                        onClick={() => handleRowClick(job._id)}
                        className="flex items-center cursor-pointer"
                      >
                        <img src={job.company.image} className="h-6 w-6 mr-4" />
                        {job.company.name}
                      </div>
                    </TableCell>
                    <TableCell>{job.roles[0]?.title}</TableCell>
                    <TableCell>{job.roles[0]?.employment_type}</TableCell>
                    <TableCell>{job.roles[0]?.location}</TableCell>
                    <TableCell>
                      ${(job.roles[0]?.salary * 12) / 100000} LPA
                    </TableCell>
                    <TableCell>{status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Applications;
