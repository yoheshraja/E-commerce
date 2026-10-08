import React, { useEffect, useState } from "react";
import api from "./api";
import { useForm } from "react-hook-form";
import Navbar from "./Navbar";

function Users() {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const {
    register,
    handleSubmit,
    reset
  } = useForm();

  useEffect(() => {
    getUsers();
  }, []);

  // Toast
  const showToast = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Get all users
  const getUsers = async () => {
    try {

      const res = await api.get("/getAllUsers");

      if (res.data.success) {
        setUsers(res.data.users);
      }

    } catch (error) {

      console.log("Get Users Error:", error);
      console.log("Response:", error?.response?.data);

      showToast(
        error?.response?.data?.message ||
        "Failed to get users",
        "danger"
      );
    }
  };

  // Select user
  const editUser = (user) => {

    setSelectedUser(user);

    reset({
      role: user.role
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Change role
  const onSubmit = async (data) => {

    console.log("Selected User:", selectedUser);
    console.log("Form Data:", data);

    const confirmed = window.confirm(
      `Are you sure you want to change ${selectedUser.name}'s role to ${data.role}?`
    );

    if (!confirmed) return;

    try {

      const res = await api.put(
        `/changeToAdmin/${selectedUser._id}`,
        data
      );

      console.log("Role Update Response:", res.data);

      if (res.data.success) {

        setUsers(prev =>
          prev.map(user =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  role: data.role
                }
              : user
          )
        );

        setSelectedUser(null);

        reset({
          role: ""
        });

        showToast(
          res.data.message,
          "success"
        );
      }

    } catch (error) {

      showToast(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update role",
        "danger"
      );
    }
  };

  // Delete user
  const deleteUser = async (id, name) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete user: ${name}?`
    );

    if (!confirmed) return;

    try {

      const res = await api.delete(
        `/deleteUser/${id}`
      );

      console.log("Delete Response:", res.data);

      if (res.data.success) {

        setUsers(prev =>
          prev.filter(user => user._id !== id)
        );

        showToast(
          res.data.message,
          "success"
        );
      }

    } catch (error) {

      console.log("Delete User Error:", error);
      console.log("Status:", error?.response?.status);
      console.log("Backend Response:", error?.response?.data);

      showToast(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete user",
        "danger"
      );
    }
  };

  return (

    <div className="container py-4">

      <Navbar />

      {/* Bootstrap Toast */}
      {message && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >

          <div
            className={`toast show text-bg-${messageType}`}
            role="alert"
          >

            <div className="d-flex">

              <div className="toast-body">
                {message}
              </div>

              {/* Dark X */}
              <button
                type="button"
                className="btn-close me-2 m-auto"
                onClick={() => setMessage("")}
              ></button>

            </div>

          </div>

        </div>
      )}

      <h2 className="fw-bold mb-4">
        Users Page
      </h2>

      {/* Role Update Form */}
      {selectedUser && (

        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Change Role - {selectedUser.name}
            </h5>

            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="mb-3">

                <label className="form-label">
                  Role
                </label>

                <select
                  className="form-select"
                  {...register("role", {
                    required: true
                  })}
                >

                  <option value="User">
                    User
                  </option>

                  <option value="Admin">
                    Admin
                  </option>

                </select>

              </div>

              <button
                type="submit"
                className="btn btn-primary me-2"
              >
                Update Role
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {

                  setSelectedUser(null);

                  reset({
                    role: ""
                  });

                }}
              >
                Cancel
              </button>

            </form>

          </div>

        </div>
      )}

      {/* Users */}
      <div className="row g-3">

        {users.map((user) => (

          <div
            className="col-12 col-md-6 col-lg-4"
            key={user._id}
          >

            <div className="card h-100 shadow-sm border-0">

              <div className="card-body">

                <h5 className="card-title fw-bold">
                  {user?.name}
                </h5>

                <p className="card-text text-muted mb-2">
                  Email: {user?.email}
                </p>

                <p className="card-text text-muted mb-3">
                  Role: {user?.role}
                </p>

                <div className="d-flex gap-2">

                  <button
                    onClick={() => editUser(user)}
                    className="btn btn-primary btn-sm"
                  >
                    Change Role
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(
                        user._id,
                        user.name
                      )
                    }
                    className="btn btn-danger btn-sm"
                  >
                    Delete User
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Users;