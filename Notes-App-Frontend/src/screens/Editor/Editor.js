import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TableContainer } from "@material-ui/core";
//import Paper from "@mui/material/Paper";

const Editor = () => {
  const [users, setUsers] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  // const classes = useStyles();

  const roleInfo = window.localStorage.getItem("userRole");
  // converting string data to json

  const userRole = JSON.parse(roleInfo);

  const client = axios.create({
    baseURL: "http://localhost:5320",
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await client.get("/api/users/", {
          signal: controller.signal,
        });
        const users = response.data.map((user) => user);

        isMounted && setUsers(users);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("userLogin");
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <>
      {userRole === "Editor" ? (
        <article>
          <section className="admin">
            <h1>Editor Page</h1>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    {/* <TableCell
                      width="200px"
                      align="center"
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                      }}
                      className="tableCell"
                    >
                      ID
                    </TableCell> */}
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
                        {/* <TableCell
                                    align="center"
                                    component="th"
                                    scope="row"
                                    style={{
                                      fontSize: "20px",
                                    }}
                                    className="tableCell"
                                  >
                                    {user._id}
                                  </TableCell> */}
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
                          style={{
                            fontSize: "20px",
                            opacity: "0.8",
                          }}
                          className="tableCell"
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
        </article>
      ) : (
        navigate("/unauthorized")
      )}
    </>
  );
};

export default Editor;
