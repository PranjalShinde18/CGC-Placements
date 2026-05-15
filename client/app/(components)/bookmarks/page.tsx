"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/app/(Context)/UserContext";
import { useExpandContext } from "@/app/(Context)/ExpandContext";
import { MdDeleteOutline } from "react-icons/md";
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

interface IUser {
  name: string;
  roll_no: string;
  email: string;
  gender: string;
  cgpa: Number;
  branch: string;
  phone_no: string;
  address: string;
  linkedin_url: string;
  passout_year: string;
  profile_pic: string;
  resume: string;
  bookmarks: string[];
}

const Bookmarks = () => {
  const { expand } = useExpandContext();
  const { user, setUser } = useUserContext();
  const { bookmarks } = user;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (bookmarks.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const jobPromises = bookmarks.map((jobId) => fetchJobData(jobId));
        const fetchedJobs = await Promise.all(jobPromises);
        const validJobs = fetchedJobs.filter((job) => job !== null) as Job[];
        setJobs(validJobs);
      } catch (error) {
        console.error("Error fetching bookmarked jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [bookmarks]);

  if (loading) return <Loader />;

  async function fetchJobData(jobId: string): Promise<Job | null> {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/get/${jobId}`);

      if (!response.ok) throw new Error("Failed to fetch job data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching job data:", error);
      return null;
    }
  }

  async function handleDeleteBookmark(jobId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/bookmarks/delete/${jobId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete bookmark");

      const updatedBookmarks = user.bookmarks.filter((id) => id !== jobId);
      const updatedUser = { ...user, bookmarks: updatedBookmarks };

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);

      console.log("Bookmark deleted successfully");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
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
        <h1 className="text-2xl font-bold p-4">My Bookmarks</h1>

        {jobs.length === 0 ? (
          <p className="text-lg p-4">No bookmarks found</p>
        ) : (
          <Table>
            <TableHeader className="text-lg font-semibold bg-slate-100">
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Package</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-gray-500 font-medium">
              {jobs.map((job) => (
                <TableRow key={job._id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    <div
                      onClick={() => handleRowClick(job._id)}
                      className="flex items-center  cursor-pointer"
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
                  <TableCell>
                    <MdDeleteOutline
                      onClick={() => handleDeleteBookmark(job._id)}
                      className="text-xl text-right ml-auto mr-auto font-bold cursor-pointer text-red-400"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
