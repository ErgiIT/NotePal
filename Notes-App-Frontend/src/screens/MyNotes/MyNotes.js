import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import axios from "axios";
import "./MyNotes.css";
import Masonry from "react-masonry-css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "./../../toastifyCustomStyles.css";
import ErrorMessage from "../../components/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
//import Search from "./Search";

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(false);
  //const [searchText, setSearchText] = useState("");
  //const baseUrl = "https://notes-app-backend.cyclic.app/";
  const baseUrl = "http://localhost:5320/";

  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    const { data } = await axios.delete(`${baseUrl}api/notes/delete/${id}`);
    console.log(data);
    toast.success("Note Deleted", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
    navigate("/mynotes");
  };

  const loginInfo = window.localStorage.getItem("userLogin");
  // converting string data to json
  const userData = JSON.parse(loginInfo);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}api/notes/${userData._id}`);
      setNotes(data);
    } catch (error) {
      setError(error.response);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchNotes();
    return () => {
      isMounted = false;
    };
  }, []);

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      {userData ? (
        <Container>
          <MainScreen>
            <h3 className="heading">Welcome to NotePal, {userData.name}</h3>

            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

            {/* <Search handleSearchNote={setSearchText} /> */}

            <Masonry
              breakpointCols={breakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {notes.map((note) => (
                <div key={note._id}>
                  <Card className="card">
                    <Card.Body>
                      <Card.Title className="shkrimi_titullit">
                        {note.title}
                      </Card.Title>
                      <hr />
                      <Card.Text className="shkrimi_body">
                        {note.content}
                      </Card.Text>
                      <div className="butonat">
                        <Link to={`/mynotes/editNote/${note._id}`}>
                          <EditIcon className="editIcon" title="Edit Note" />
                        </Link>

                        <DeleteIcon
                          title="Delete Note"
                          className="deleteIcon"
                          onClick={() => deleteHandler(note._id)}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
              <div className="createDiv">
                <Link to="/mynotes/createNote">
                  <FontAwesomeIcon
                    className="createButton"
                    icon={faPlus}
                    title="Create a new note"
                  />
                </Link>
              </div>
            </Masonry>
          </MainScreen>
        </Container>
      ) : (
        navigate("/unauthorized")
      )}
    </>
  );
};

export default MyNotes;
