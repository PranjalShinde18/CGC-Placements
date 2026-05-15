"use client";

import React, { useEffect, useState } from "react";
import { useExpandContext } from "@/app/(Context)/ExpandContext";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/(Context)/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/app/(components)/(loader)/Loader";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkCheck } from "react-icons/bs";

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

interface Company {
  name: string;
  image: string;
  email: string;
  address: string;
  contact: number;
  website: string;
}

interface Job {
  _id: string;
  company: Company;
  roles: Role[];
  status: string;
  applications: any[];
}

const Jobs = () => {
  const { expand } = useExpandContext();
  const [eligibleJobs, setEligibleJobs] = useState<Job[]>([]);
  const [nonEligibleJobs, setNonEligibleJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, setUser } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/get`);

        const data: Job[] = await response.json();

        console.log(data);

        const eligible = data.filter((job) =>
          job.roles.some((role) => role.eligibility <= user.cgpa)
        );

        const nonEligible = data.filter((job) =>
          job.roles.some((role) => role.eligibility > user.cgpa)
        );

        setEligibleJobs(eligible);
        setNonEligibleJobs(nonEligible);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user.cgpa]);

  const handleRowClick = (_id: string) => {
    router.push(`/jobs/${_id}`);
  };

  const handleAddBookmark = async (jobId: string) => {
    if (!user) {
      console.error("User is not defined");
      return;
    }

    try {
      const response = await fetch(

        `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/bookmarks/create/${jobId}`,

        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Failed to add bookmark:", response.statusText);
        return;
      }

      const updatedBookmarks = [...user.bookmarks, jobId];
      const updatedUser = { ...user, bookmarks: updatedBookmarks };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  return (
    <div
      className={`p-7 bg-slate-200 min-h-screen transition-all duration-300 ${
        expand ? "ml-56" : "ml-20"
      }`}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Eligible Jobs Section */}
          {eligibleJobs.length > 0 && (
            <div className="mt-4 rounded-lg overflow-hidden bg-white">
              <h1 className="text-2xl font-bold p-4">Eligible Jobs</h1>
              <Table>
                <TableHeader className="text-lg font-semibold bg-slate-100">
                  <TableRow>
                    <TableHead className="w-1/3">Company Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-gray-500 font-medium">
                  {eligibleJobs.flatMap((job) =>
                    job.roles.map((role, index) => (
                      <TableRow key={index} className="hover:bg-slate-50">
                        <TableCell
                          onClick={() => handleRowClick(job._id)}
                          className="font-medium cursor-pointer"
                        >
                          <div className="flex items-center">
                            <img
                              src={job.company.image}
                              className="h-6 w-6 mr-4"
                            />
                            <span>{job.company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{role.title}</TableCell>
                        <TableCell>{role.employment_type}</TableCell>
                        <TableCell>{role.location}</TableCell>
                        <TableCell>{(role.salary * 12) / 100000} LPA</TableCell>
                        <TableCell>
                          {user && user.bookmarks.includes(job._id) ? (
                            <BsBookmarkCheck className="text-xl font-bold cursor-pointer" />
                          ) : (
                            <BsBookmark
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddBookmark(job._id);
                              }}
                              className="text-xl font-bold cursor-pointer"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Non-Eligible Jobs Section */}
          {nonEligibleJobs.length > 0 && (
            <div className="mt-8 rounded-lg overflow-hidden bg-white">
              <h1 className="text-2xl font-bold p-4">Non-Eligible Jobs</h1>
              <Table>
                <TableHeader className="text-lg font-semibold bg-slate-100">
                  <TableRow>
                    <TableHead className="w-1/3">Company Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Package</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-gray-500 font-medium">
                  {nonEligibleJobs.flatMap((job) =>
                    job.roles.map((role, index) => (
                      <TableRow key={index} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          <div
                            onClick={() => handleRowClick(job._id)}
                            className="flex items-center cursor-pointer"
                          >
                            <img
                              src={job.company.image}
                              className="h-6 w-6 mr-4"
                            />
                            <span>{job.company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{role.title}</TableCell>
                        <TableCell>{role.employment_type}</TableCell>
                        <TableCell>{role.location}</TableCell>
                        <TableCell>{(role.salary * 12) / 100000} LPA</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
