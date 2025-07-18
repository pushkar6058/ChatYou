import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DeleteDialog = ({ open, handleClose, deleteHandler }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>Confirm to delete the group</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleClose}>
          No
        </Button>

        <Button onClick={deleteHandler}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
