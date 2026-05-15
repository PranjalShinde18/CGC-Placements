"use client";

import { useExpandContext } from "@/app/(Context)/ExpandContext";
import React, { useState } from "react";
import Image from "next/image";
import { useUserContext } from "@/app/(Context)/UserContext";

const Profile = () => {
  const { user, setUser } = useUserContext();
  const { expand } = useExpandContext();
  const [edit, setEdit] = useState<boolean>(false);
  const [resumeUrl, setResumeUrl] = useState<string | ArrayBuffer | null>(
    user.resume
  );
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    user.profile_pic || "/images/people.png"
  );
  const [formData, setFormData] = useState({
    name: user.name,
    roll_no: user.roll_no,
    email: user.email,
    gender: user.gender,
    branch: user.branch,
    cgpa: user.cgpa,
    phone_no: user.phone_no,
    address: user.address,
    passout_year: user.passout_year,
    linkedin_url: user.linkedin_url,
    resume: user.resume,
    github_url: user.github_url,
    portfolio_url: user.portfolio_url,
  });

  const handleProfileUpdate = async (
    event: React.ChangeEvent<HTMLInputElement> | null
  ) => {
    const formDataObj = new FormData();
    if (event?.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      formDataObj.append("profile_pic", file);
    }

    try {
      if (formDataObj.has("profile_pic")) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/uploadProfilePic`,

          {
            method: "PUT",
            body: formDataObj,
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.profile_pic);
          setUser((prevUser) => ({
            ...prevUser,
            profile_pic: data.profile_pic,
          }));
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              profile_pic: data.profile_pic,
            })
          );
        } else {
          console.error("Failed to upload image. Status:", response.status);
          const errorText = await response.text();
          console.error("Error response text:", errorText);
        }
      }

      // Update other profile details
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/updateProfile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (userResponse.ok) {
        const data = await userResponse.json();
        setUser((prevUser) => ({
          ...prevUser,
          ...data,
        }));
        localStorage.setItem("user", JSON.stringify(data));
        setEdit(false);
      } else {
        console.error(
          "Failed to update user details. Status:",
          userResponse.status
        );
        const errorText = await userResponse.text();
        console.error("Error response text:", errorText);
      }
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`p-7 bg-slate-200 min-h-screen transition-all duration-300 ${
        expand ? "ml-56" : "ml-20"
      }`}
    >
      <div className="mx-auto max-w-[970px]">
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-35 md:h-65 w-full ">
            <Image
              src={"/images/cover/cover-01.png"}
              alt="profile cover"
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              width={970}
              height={260}
              style={{
                width: "auto",
                height: "auto",
              }}
            />
          </div>

          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11">
            <div className="relative z-30 mx-auto -mt-16 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <Image
                  className="w-40 h-40 object-center object-cover rounded-full"
                  src={profileImage as string}
                  width={120}
                  height={120}
                  alt="profile"
                />
                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white bg-[#392ff1] hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                >
                  <Image
                    src="/images/camera-2.png"
                    width={24}
                    height={24}
                    alt="Upload"
                  />
                  <input
                    type="file"
                    name="profile_pic"
                    id="profile"
                    className="sr-only"
                    onChange={(e) => handleProfileUpdate(e)}
                  />
                </label>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black ">
                {user.name}
              </h3>
              <p className="font-medium">{user.branch}</p>
            </div>
          </div>
        </div>

        {edit ? (
          <div className="mt-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-medium text-black ">Edit Details</h3>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md  px-8 py-2 text-center font-medium text-white bg-[#392ff1] hover:bg-opacity-90 w-28"
                onClick={() => handleProfileUpdate(null)} // Call with null for saving details
              >
                Save
              </button>
            </div>
            <div className="flex pb-6 flex-col px-10">
              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="roll_no"
                  value={formData.roll_no}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  CGPA
                </label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Passout Year
                </label>
                <input
                  type="text"
                  name="passout_year"
                  value={formData.passout_year}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Resume
                </label>
                <input
                  type="text"
                  name="resume"
                  value={formData.resume}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Github
                </label>
                <input
                  type="text"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div className="flex mt-6 items-center gap-5">
                <label className="text-md w-[200px] font-medium text-black ">
                  Portfolio Website
                </label>
                <input
                  type="text"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              {/* Repeat for other fields */}
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-medium text-black ">Details</h3>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md  px-8 py-2 text-center font-medium text-white bg-[#392ff1] hover:bg-opacity-90 w-28"
                onClick={() => setEdit(!edit)}
              >
                Edit
              </button>
            </div>

            <div className="flex pb-6 flex-col px-10">
              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Name
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.name}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Roll Number
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.roll_no}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Email
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.email}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Gender
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.gender}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Branch
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.branch}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  CGPA
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.cgpa}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Phone Number
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.phone_no}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Address
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.address}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Passout Year
                </label>
                <p className="text-md px-5 py-3 w-full bg-transparent text-black outline-none transition disabled:bg-whiter">
                  {formData.passout_year}
                </p>
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Resume
                </label>
                {formData.resume ? (
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md px-5 py-3 w-full bg-transparent text-[#392ff1] cursor-pointer outline-none transition"
                  >
                    View Resume
                  </a>
                ) : (
                  <p className="text-md px-5 py-3 w-full bg-transparent text-gray-500 outline-none transition disabled:bg-whiter">
                    No Resume
                  </p>
                )}
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  LinkedIn Profile
                </label>
                {formData.linkedin_url ? (
                  <a
                    href={formData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md px-5 py-3 w-full bg-transparent text-[#392ff1] cursor-pointer outline-none transition"
                  >
                    Visit LinkedIn Profile
                  </a>
                ) : (
                  <p className="text-md px-5 py-3 w-full bg-transparent text-gray-500 outline-none transition disabled:bg-whiter">
                    No LinkedIn Profile
                  </p>
                )}
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Github Profile
                </label>
                {formData.github_url ? (
                  <a
                    href={formData.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md px-5 py-3 w-full bg-transparent text-[#392ff1] cursor-pointer outline-none transition"
                  >
                    Visit Github Profile
                  </a>
                ) : (
                  <p className="text-md px-5 py-3 w-full bg-transparent text-gray-500 outline-none transition disabled:bg-whiter">
                    No Github Profile
                  </p>
                )}
              </div>

              <div className="flex mt-6 item-center gap-5">
                <label className="text-md item-center pt-3 w-[200px] font-medium text-black ">
                  Portfolio Website
                </label>
                {formData.portfolio_url ? (
                  <a
                    href={formData.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md px-5 py-3 w-full bg-transparent text-[#392ff1] cursor-pointer outline-none transition"
                  >
                    Visit Portfolio Website
                  </a>
                ) : (
                  <p className="text-md px-5 py-3 w-full bg-transparent text-gray-500 outline-none transition disabled:bg-whiter">
                    No Portfolio Uploaded
                  </p>
                )}
              </div>

              {/* Repeat for other fields */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
