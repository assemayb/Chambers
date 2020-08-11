import React from "react";
import { Header, Button, Icon, Modal } from "semantic-ui-react";

export default function RemoveModal({
  setOpenModel,
  currentAdmin,
  deleteClickedRoom,
  openModel,
}) {
  return (
    <Modal
      closeIcon
      open={openModel}
      onClose={() => setOpenModel(false)}
      onOpen={() => setOpenModel(true)}
    >
      <Header icon="trash" content="Deleting A Room" />
      <Modal.Content>
        <p>Are you sure you want to delete this room? {currentAdmin}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={() => setOpenModel(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button color="red" onClick={deleteClickedRoom}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
