"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/(Context)/UserContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    roll_no: "",
    branch: "",
    cgpa: 0,
    phone_no: "",
    address: "",
    linkedin_url: "",
    passout_year: 0,
  });

  const { setUser } = useUserContext();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/signup`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Signup successful", data);

      if (response.ok) {

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/dashboard");
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-16 bg-slate-200">
      <div className="w-full max-w-6xl p-6 sm:p-8 md:p-12 bg-white rounded-lg shadow-md">
        <form className="flex flex-col">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-4">
              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  placeholder="Enter your gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="roll_no"
                  placeholder="Enter your roll number"
                  value={formData.roll_no}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 p-4">
              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  placeholder="Enter your branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  CGPA
                </label>
                <input
                  type="text"
                  name="cgpa"
                  placeholder="Enter your CGPA"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_no"
                  placeholder="Enter your phone number"
                  value={formData.phone_no}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedin_url"
                  placeholder="Enter your LinkedIn URL"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Passout Year
                </label>
                <input
                  type="text"
                  name="passout_year"
                  placeholder="Enter your passout year"
                  value={formData.passout_year}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
          <button

          onClick={handleSubmit}
          className="w-full max-w-[250px] rounded-full bg-[#3C50E0] py-4 px-6 text-white"
          
          >Create Account</button>
          </div>

          <div className="mt-6 text-center">
            <p>
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
