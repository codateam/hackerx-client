import Image from "next/image";
import React, { useState } from "react";
import Tooltip from "antd/es/tooltip";
import { handleAddUser } from "@/features/auth/api";
import { AddAdminValidationSchema } from "@/features/auth/lib/validation";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DashboardNavBar = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"admin" | "lecturer" | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user) {
    return <div className="p-4 w-full">Loading...</div>;
  }

  const isAdmin = user.role === "admin";

  const handleOptionClick = (type: "admin" | "lecturer") => {
    if (!isAdmin) {
      setError(
        `You don't have permission to add ${
          type === "admin" ? "administrators" : "lecturers"
        }`
      );
      setTooltipVisible(false);
      return;
    }

    setFormType(type);
    setFormData((prev) => ({
      ...prev,
      role: type,
    }));
    setShowForm(true);
    setTooltipVisible(false);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!isAdmin) {
      setError(
        `You don't have permission to add ${
          formType === "admin" ? "administrators" : "lecturers"
        }`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const validatedData = AddAdminValidationSchema.parse(formData);
      const res = await handleAddUser(validatedData);

      if (res.success) {
        setSuccess(
          `${formType === "admin" ? "Admin" : "Lecturer"} added successfully!`
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          role: formType || "",
        });

        setTimeout(() => {
          setShowForm(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(res.message || "An unknown error occurred.");
      }
    } catch (error: any) {
      if (error.errors) {
        setError(error.errors[0]?.message || "Please check your input");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tooltipContent = (
    <div className="flex flex-col space-y-2 py-1">
      {isAdmin ? (
        <>
          <button
            onClick={() => handleOptionClick("admin")}
            className="text-left px-4 py-2 hover:bg-gray-100 rounded transition"
          >
            Add Admin
          </button>
          <button
            onClick={() => handleOptionClick("lecturer")}
            className="text-left px-4 py-2 hover:bg-gray-100 rounded transition"
          >
            Add Lecturer
          </button>
        </>
      ) : (
        <div className="px-4 py-2 text-gray-500">
          Only administrators can add users
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-between p-4 w-full bg-[#F3F3FB]">
      {/* USER */}
      <div className="text-sm md:text-base lg:text-2xl font-bold">
        Welcome {user.firstName}
      </div>

      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-black px-2">
        <Image src="/icons/search-line.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="p-2 w-[200px] bg-transparent outline-none placeholder:text-black"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end">
        <Tooltip
          placement="bottom"
          title={tooltipContent}
          open={tooltipVisible}
          trigger="click"
          onOpenChange={setTooltipVisible}
          color="white"
          styles={{ body: { color: "black" } }}
        >
          <div
            className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
            onClick={() => setTooltipVisible(!tooltipVisible)}
          >
            <Image
              src="/icons/settings-outline.png"
              alt=""
              width={20}
              height={20}
            />
          </div>
        </Tooltip>

        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/icons/alarm.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 rounded-full text-xs text-white">
            1
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/icons/baboy.png"
            alt=""
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">
              {user.firstName}
            </span>
            <span className="text-xs text-right text-gray-500">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for Add User Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Add {formType === "admin" ? "Admin" : "Lecturer"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-600 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-2 bg-green-100 border border-green-300 text-green-600 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Hidden input to store the role value */}
              <input type="hidden" name="role" value={formData.role} />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Adding..."
                    : `Add ${formType === "admin" ? "Admin" : "Lecturer"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardNavBar;
