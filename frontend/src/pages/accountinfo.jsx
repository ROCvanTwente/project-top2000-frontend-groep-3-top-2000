import React, { useState } from "react";
import { Footer } from "../components/footer";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";

const AccountInfo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("user@example.com"); // TODO: Fetch from API
  const [password, setPassword] = useState("********"); // TODO: Fetch from API (masked)
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSaveEmail = () => {
    // TODO: Add API call to update email
    // await ApiService.updateEmail(email);
    setIsEditingEmail(false);
  };

  const handleSavePassword = () => {
    // TODO: Add API call to update password
    // await ApiService.updatePassword(password);
    setIsEditingPassword(false);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // TODO: Add API call to delete account
      // await ApiService.deleteAccount();
      console.log("Account deleted");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <main className="flex flex-1 flex-col items-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Accountinformatie
          </h1>
          <div className="flex flex-col items-center mb-8">
            <img
              src="/example.png"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 mb-4"
            />
            {/* TODO: Add API call to upload new photo */}
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Foto wijzigen
            </button>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <h1>account</h1>
            <label className="block text-gray-700 font-semibold mb-2">
              E-mail
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditingEmail}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {isEditingEmail ? (
                  <button
                  onClick={handleSaveEmail}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Opslaan
                </button>
              ) : (
                  <button
                  onClick={() => setIsEditingEmail(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Wijzigen
                </button>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-2">
              Wachtwoord
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!isEditingPassword}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {isEditingPassword ? (
                <button
                  onClick={handleSavePassword}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Opslaan
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Wijzigen
                </button>
              )}
            </div>
          </div>

          {/* Delete Account Button */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Account verwijderen
            </h2>
            <button
              onClick={handleDeleteAccount}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
            >
              Verwijder account
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Deze actie kan niet ongedaan worden gemaakt. Al je gegevens worden permanent verwijderd.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountInfo;
