import { useState, useEffect } from "react";
import "./Admin.css";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TableContainer } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Admin = () => {
  const [users, setUsers] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = "http://localhost:5320/";
  // const classes = useStyles();

  const roleInfo = window.localStorage.getItem("userRole");
  // converting string data to json

  const userRole = JSON.parse(roleInfo);

  const client = axios.create({
    baseURL: "http://localhost:5320",
  });

  // const deleteHandler = async (id) => {
  //   const { data } = await axios.delete(`${baseUrl}api/users/delete/${id}`);
  //   console.log(data);
  //   toast.success("User Deleted", {
  //     position: toast.POSITION.TOP_RIGHT,
  //     autoClose: 1000,
  //   });
  //   fetchUsers();
  //   // navigate("/admin");
  // };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const { data } = await axios.delete(`${baseUrl}api/users/delete/${id}`);
      console.log(data);
      toast.success("User Deleted", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    try {
      let isMounted = true;
      const controller = new AbortController();
      const response = await client.get("/api/users/", {
        signal: controller.signal,
      });
      const users = response.data.map((user) => user);

      isMounted && setUsers(users);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("userLogin");
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {userRole === "Admin" ? (
        <article>
          <section className="admin">
            <h1>Admin Page</h1>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell
                      align="center"
                      width="200px"
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                      }}
                      className="tableHeadCell"
                    >
                      Names
                    </TableCell>
                    <TableCell
                      align="center"
                      width="200px"
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                      }}
                      className="tableHeadCell"
                    >
                      Emails
                    </TableCell>
                    <TableCell
                      align="center"
                      width="200px"
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                      }}
                      className="tableHeadCell"
                    >
                      Roles
                    </TableCell>
                    <TableCell
                      align="center"
                      width="200px"
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                      }}
                      className="tableHeadCell"
                    >
                      Last Login
                    </TableCell>
                    <TableCell
                      align="center"
                      width="200px"
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                      }}
                      className="tableHeadCell"
                    >
                      Last Logout
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.length ? (
                    users.map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Link to={`/admin/editUser/${user._id}`}>
                            <EditIcon className="editIcon" title="Edit User" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            title="Delete Note"
                            className="deleteIcon"
                            onClick={() => deleteHandler(user._id)}
                          />
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontSize: "20px",
                          }}
                          className="tableCell"
                        >
                          {user.name}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="tableCell"
                          style={{
                            fontSize: "20px",
                            opacity: "0.8",
                          }}
                        >
                          {user.email}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontSize: "20px",
                          }}
                          className="tableCell"
                        >
                          {user.role}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontSize: "20px",
                            opacity: "0.8",
                          }}
                          className="tableCell"
                        >
                          {user.lastLogin}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            fontSize: "20px",
                          }}
                          className="tableCell"
                        >
                          {user.lastLogout}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>No users to display</TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </section>
          <div className="createDiv">
            <Link to="/admin/createAdmin">
              <FontAwesomeIcon
                className="createButton"
                icon={faPlus}
                title="Create a new user"
              />
            </Link>
          </div>
        </article>
      ) : (
        navigate("/unauthorized")
      )}
    </>
  );
};

export default Admin;
