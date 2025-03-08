import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TeacherProfile from "./TeacherProfile";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TeacherHome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Fetch user data from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((response) => response.json())
      .then((data) => {
        const filteredUsers = data.filter((user) => user.role === "student");
        setUsers(filteredUsers);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle Edit - Navigate to user edit page
  const handleEdit = (userId) => {
    navigate(`/useredit/${userId}`);
  };

  // Open delete confirmation dialog
  const confirmDelete = (userId) => {
    setDeleteUserId(userId);
    setOpenDialog(true);
  };

  // Handle actual deletion after confirmation
  const handleDelete = async () => {
    if (deleteUserId) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${deleteUserId}`);

        // Update UI by removing deleted user
        setUsers(users.filter((user) => user._id !== deleteUserId));

        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      } finally {
        setOpenDialog(false);
      }
    }
  };

  return (
    <div>
      <TeacherProfile />
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>First Name</StyledTableCell>
                <StyledTableCell>Last Name</StyledTableCell>
                <StyledTableCell>Age</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell>{user.firstName}</StyledTableCell>
                  <StyledTableCell>{user.lastName}</StyledTableCell>
                  <StyledTableCell>{user.age}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(user._id)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => confirmDelete(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TeacherHome;
