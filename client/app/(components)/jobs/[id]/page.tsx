"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import {
  FaMoneyBillAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaUserAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { useExpandContext } from "@/app/(Context)/ExpandContext";
import Loader from "@/app/(components)/(loader)/Loader";
import { useUserContext } from "@/app/(Context)/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Company {
  name: string;
  image: string;
  email: string;
  address: string;
  contact: string;
  website: string;
}

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

interface Application {
  company: string;
  status: string;
}

interface JobData {
  company: Company;
  roles: Role[];
  _id: string;
  status: string;
  applications: Application[];
}

async function fetchJobData(jobId: string): Promise<JobData | null> {
  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job/get/${jobId}`);

    if (!response.ok) throw new Error("Failed to fetch job data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching job data:", error);
    return null;
  }
}

export default function JobPage({ params }: { params: { id: string } }) {
  const { expand } = useExpandContext();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const loadJobData = async () => {
      const data = await fetchJobData(id);
      if (data) {
        setJobData(data);
      } else {
        notFound();
      }
      setTimeout(() => setLoading(false), 500);
    };

    loadJobData();
  }, [id]);

  if (loading) return <Loader />;

  if (!jobData)
    return <div className="p-7 text-center">Job details not found.</div>;

  // Function to format numbers
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };

  // Function to check if user has already applied
  const hasApplied = () => {
    if (!user) return false;
    return user.applications.some(
      (application) => application.company === jobData._id
    );
  };

  // Function to check eligibility
  const isEligible = (eligibility: number) => {
    return user?.cgpa >= eligibility;
  };

  // Function to check if the deadline has passed
  const isDeadlinePassed = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return today > deadlineDate;
  };

  async function handleAddApplication(jobId: string) {
    if (!user) {
      console.error("User is not defined");
      return;
    }

    try {
      const response = await fetch(

        `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/applications/create/${jobId}`,

        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to apply for job");

      const newApplication = { company: jobId, status: "Applied" };

      const updatedApplications = [...user.applications, newApplication];

      const updatedUser = { ...user, applications: updatedApplications };
      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Applied successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Error applying for job.");
    }
  }

  return (
    <div
      className={`p-7 bg-slate-200 min-h-screen transition-all duration-300 ${
        expand ? "ml-56" : "ml-20"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6 mt-2 text-gray-600 border-b">
        Job Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Company Details Card */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <div className="flex flex-col items-center mb-4">
            <a
              href={jobData.company.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={jobData.company.image}
                alt={jobData.company.name}
                className="w-36 h-36 rounded-full mb-2"
              />
            </a>
            <h2 className="text-xl font-semibold">{jobData.company.name}</h2>
          </div>
          <div className="grid grid-cols-1 pl-6 md:grid-cols-2 gap-2 text-left">
            <p className="text-gray-600 font-semibold">Address:</p>
            <p className="text-gray-600">{jobData.company.address}</p>

            <p className="text-gray-600 font-semibold">Contact:</p>
            <p className="text-gray-600">{jobData.company.contact}</p>

            <p className="text-gray-600 font-semibold">Email:</p>
            <p className="text-blue-500">
              <a
                href={`mailto:${jobData.company.email}`}
                className="text-blue-500"
              >
                {jobData.company.email}
              </a>
            </p>

            <p className="text-gray-600 font-semibold">Website:</p>
            <p className="text-blue-500">
              <a
                href={jobData.company.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {jobData.company.website}
              </a>
            </p>
          </div>
        </div>

        {/* Job Role Details Card */}
        <div className="bg-white p-6 shadow-md rounded-md space-y-4">
          {jobData.roles.map((role, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md flex items-center space-x-3">
                <FaMoneyBillAlt className="text-green-500" />
                <p className="text-lg font-semibold">
                  Salary:{" "}
                  <span className="font-normal">
                    ${formatNumber(role.salary)}
                  </span>
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md flex items-center space-x-3">
                <FaMapMarkerAlt className="text-blue-500" />
                <p className="text-lg font-semibold">
                  Location: <span className="font-normal">{role.location}</span>
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md flex items-center space-x-3">
                <FaBriefcase className="text-orange-500" />
                <p className="text-lg font-semibold">
                  Employment Type:{" "}
                  <span className="font-normal">{role.employment_type}</span>
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md flex items-center space-x-3">
                <FaCalendarAlt className="text-red-500" />
                <p className="text-lg font-semibold">
                  Application Deadline:{" "}
                  <span className="font-normal">
                    {/* {formatDate(role.application_deadline)} */}
                    {role.application_deadline}
                  </span>
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md flex items-center space-x-3">
                <FaUserAlt className="text-purple-500" />
                <p className="text-lg font-semibold">
                  Minimum Experience:{" "}
                  <span className="font-normal">
                    {role.min_experience} years
                  </span>
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md flex items-center space-x-3">
                <FaTachometerAlt className="text-teal-500" />
                <p className="text-lg font-semibold">
                  Eligibility:{" "}
                  <span className="font-normal">{role.eligibility}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description and Apply Button Card */}
      <div className="bg-white p-6 pl-12 shadow-md rounded-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        {jobData.roles.map((role, index) => (
          <p key={index} className="text-gray-700 mb-4">
            {role.description}
          </p>
        ))}

        {/* Apply Button */}
        <div className="flex justify-center mt-6">
          {hasApplied() ? (
            <button className="bg-gray-400 text-white px-8 py-2 rounded-md cursor-not-allowed">
              Already Applied
            </button>
          ) : (
            <div className="relative group">
              <button
                onClick={() => handleAddApplication(id)}
                className={`${
                  isEligible(jobData.roles[0].eligibility) &&
                  !isDeadlinePassed(jobData.roles[0].application_deadline)
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-8 py-2 rounded-md`}
                disabled={
                  !isEligible(jobData.roles[0].eligibility) ||
                  isDeadlinePassed(jobData.roles[0].application_deadline)
                }
              >
                {isEligible(jobData.roles[0].eligibility)
                  ? isDeadlinePassed(jobData.roles[0].application_deadline)
                    ? "Deadline Passed"
                    : "Apply"
                  : "Not Eligible"}
              </button>
              {(!isEligible(jobData.roles[0].eligibility) ||
                isDeadlinePassed(jobData.roles[0].application_deadline)) && (
                <span className="absolute w-44 mb-2 bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 space-x-1 bg-gray-700 text-white text-sm p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isEligible(jobData.roles[0].eligibility)
                    ? "Not eligible due to CGPA requirement"
                    : isDeadlinePassed(jobData.roles[0].application_deadline)
                    ? "Application deadline has passed"
                    : ""}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
