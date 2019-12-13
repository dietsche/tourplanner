import React from "react";
import styled from "styled-components";
import Modal from "@material-ui/core/Modal";

export default function AddCardModal() {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
        >
            <div style={modalStyle} className={classes.paper}>
                <h2 id="simple-modal-title">Text in a modal</h2>
                <p id="simple-modal-description">
                    Duis mollis, est non commodo luctus, nisi erat porttitor
                    ligula.
                </p>
                <SimpleModal />
            </div>
        </Modal>
    );
}
