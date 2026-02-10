"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import {
  getCurrentUserAction,
  updateProfileAction,
  changePasswordAction,
  logoutAction,
} from "@/action/auth.action";

export default function Profile() {
  // State for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for display
  const [userData, setUserData] = useState({
    displayName: "",
    displayEmail: "",
  });

  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError("");
      const user = await getCurrentUserAction();

      if (user) {
        console.log("Loaded user:", user);

        // Set display data
        setUserData({
          displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          displayEmail: user.email || "",
        });

        // Set form data
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        });
      } else {
        setError("Unable to load user data");
      }
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "oldPassword" ||
      name === "newPassword" ||
      name === "confirmPassword"
    ) {
      setPasswordData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear messages when user types
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Toggle password form
  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    if (showPasswordForm) {
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Reset password visibility
      setShowPasswords({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    }
  };

  // Handle PROFILE update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdatingProfile(true);
      setError("");
      setSuccess("");

      // Validate profile fields
      if (!formData.firstName.trim()) {
        throw new Error("First name is required");
      }

      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error(
          "Please enter a valid email address (example@domain.com)",
        );
      }

      // Prepare update data - ONLY profile fields
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      };

      console.log("Updating profile:", updateData);

      // Call profile update action
      const result = await updateProfileAction(updateData);

      if (result) {
        // Update display
        setUserData({
          displayName: `${formData.firstName} ${formData.lastName}`.trim(),
          displayEmail: formData.email,
        });

        setSuccess("Profile updated successfully!");

        // Refresh data from server
        setTimeout(() => {
          loadUserData();
        }, 1000);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const getTokenFromCookies = () => {
    // Simple, direct cookie parsing
    const cookieString = document.cookie;
    console.log("All cookies:", cookieString);

    // Find token cookie
    const tokenMatch = cookieString.match(/token=([^;]+)/);

    if (tokenMatch && tokenMatch[1]) {
      console.log("Token found in cookies");
      return tokenMatch[1];
    }

    console.log("No token found in cookies");
    return null;
  };

  // Handle PASSWORD change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      // Validation
      if (!passwordData.oldPassword.trim())
        throw new Error("Enter current password");
      if (!passwordData.newPassword.trim())
        throw new Error("Enter new password");
      if (passwordData.newPassword !== passwordData.confirmPassword)
        throw new Error("Passwords don't match");
      if (passwordData.newPassword.length < 6)
        throw new Error("Password must be 6+ characters");

      console.log("Calling server action...");

      // This should work - apiFetch adds base URL
      const result = await changePasswordAction({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      console.log("Success:", result);
      setSuccess("Password changed!");

      // Clear form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };
  // Refresh data
  const handleRefresh = async () => {
    await loadUserData();
    setSuccess("Data refreshed successfully!");
  };

  if (loading) {
    return (
      <div className='w-full min-h-screen'>
        <div className='bg-[#F7F7F5] p-24'>
          <div className='text-center bg-white max-w-[200px] mx-auto p-1 rounded-2xl animate-pulse'>
            <div className='h-4 bg-gray-300 rounded'></div>
          </div>
          <div className='max-w-[500px] mx-auto text-center text-6xl mt-4'>
            <div className='h-16 bg-gray-300 rounded animate-pulse'></div>
          </div>
        </div>
        <div className='px-16 py-10'>
          <div className='h-8 bg-gray-300 rounded w-48 mb-6 animate-pulse'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className='h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse'></div>
                <div className='h-12 bg-gray-300 rounded animate-pulse'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Top section */}
      <div className='bg-[#F7F7F5] p-24'>
        <p className='text-center bg-white max-w-[200px] mx-auto p-1 rounded-2xl'>
          {userData.displayEmail}
        </p>
        <p className='max-w-[500px] mx-auto text-center text-6xl mt-4'>
          {userData.displayName}
        </p>
      </div>

      {/* Action buttons */}
      <div className='px-16 pt-6 flex justify-end'>
        <button
          type='button'
          onClick={handleRefresh}
          className='px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2'>
          <RefreshCw className='w-4 h-4' />
          Refresh Data
        </button>
      </div>

      {/* Error/Success messages */}
      {(error || success) && (
        <div className='px-16 pt-4'>
          {error && (
            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-center'>
                <XCircle className='w-5 h-5 text-red-500 mr-2' />
                <p className='text-red-600 font-medium'>{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
              <div className='flex items-center'>
                <CheckCircle className='w-5 h-5 text-green-500 mr-2' />
                <p className='text-green-600 font-medium'>{success}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div className='px-16 py-10'>
        <p className='text-2xl font-semibold mb-6'>Profile Information</p>

        {/* Profile Update Form */}
        <form onSubmit={handleProfileUpdate}>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-8'>
            <div>
              <label className='block font-medium text-gray-500 mb-2'>
                <span className='font-bold'>First Name *</span>
              </label>
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                disabled={updatingProfile}
              />
            </div>

            <div>
              <label className='block font-medium text-gray-500 mb-2'>
                <span className='font-bold'>Last Name</span>
              </label>
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                disabled={updatingProfile}
              />
            </div>

            <div>
              <label className='block font-medium text-gray-500 mb-2'>
                <span className='font-bold'>Email</span>
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                disabled={true}
              />
            </div>
          </div>

          {/* Profile Update Button */}
          <div className='flex justify-end mb-8'>
            <button
              type='submit'
              disabled={updatingProfile}
              className='px-8 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'>
              {updatingProfile ? (
                <>
                  <RefreshCw className='w-5 h-5 animate-spin' />
                  Updating Profile...
                </>
              ) : (
                <>
                  Update Profile
                  <ArrowRight className='w-5 h-5' />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Password Change Section */}
        <div className='mt-12 pt-8 border-t border-gray-200'>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <p className='text-xl font-semibold'>Change Password</p>
              <p className='text-sm text-gray-500 mt-1'>
                {showPasswordForm
                  ? "Fill all fields to change password"
                  : "Optional - click to change password"}
              </p>
            </div>
            <button
              type='button'
              onClick={togglePasswordForm}
              className='px-6 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full transition-colors font-medium flex items-center gap-2'
              disabled={updatingProfile || changingPassword}>
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange}>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-8'>
                {/* Current Password */}
                <div>
                  <label className='block font-medium text-gray-500 mb-2'>
                    <span className='font-bold'>Current Password *</span>
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      name='oldPassword'
                      value={passwordData.oldPassword}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10'
                      disabled={changingPassword}
                      placeholder='Enter current password'
                    />
                    <button
                      type='button'
                      onClick={() => togglePasswordVisibility("oldPassword")}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                      tabIndex={-1}>
                      {showPasswords.oldPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className='block font-medium text-gray-500 mb-2'>
                    <span className='font-bold'>New Password *</span>
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name='newPassword'
                      value={passwordData.newPassword}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10'
                      disabled={changingPassword}
                      placeholder='Enter new password'
                    />
                    <button
                      type='button'
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                      tabIndex={-1}>
                      {showPasswords.newPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                  <div className='flex items-center mt-2'>
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${passwordData.newPassword.length >= 6 ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <p className='text-xs text-gray-500'>
                      At least 6 characters
                    </p>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className='block font-medium text-gray-500 mb-2'>
                    <span className='font-bold'>Confirm Password *</span>
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name='confirmPassword'
                      value={passwordData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10 ${
                        passwordData.newPassword &&
                        passwordData.confirmPassword &&
                        passwordData.newPassword !==
                          passwordData.confirmPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      disabled={changingPassword}
                      placeholder='Confirm new password'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                      tabIndex={-1}>
                      {showPasswords.confirmPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                  {passwordData.newPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <p className='text-xs text-red-500 mt-1 flex items-center'>
                        <XCircle className='w-3 h-3 mr-1' />
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>

              {/* Password Change Button */}
              <div className='flex justify-end'>
                <button
                  type='submit'
                  disabled={
                    changingPassword ||
                    !passwordData.oldPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                  className='px-8 py-3 bg-amber-600 text-white font-medium rounded-full hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'>
                  {changingPassword ? (
                    <>
                      <RefreshCw className='w-5 h-5 animate-spin' />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      Change Password
                      <ArrowRight className='w-5 h-5' />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
