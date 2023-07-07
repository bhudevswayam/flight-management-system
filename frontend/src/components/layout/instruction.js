import { useState, forwardRef } from "react"
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
} from "@mui/material"

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export const InsDialog = ({ open, handleClose, handleSubmit }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = (event) => {
        event.preventDefault()
        handleSubmit(username, password)
    }

    const handleEnterKeyDown = (event) => {
        if (event.key === "Enter") {
            onSubmit(event)
        }
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            onKeyDown={handleEnterKeyDown}
        >
            <DialogTitle>Instruction</DialogTitle>
            <DialogContent>
                <h2>I have set some predefined users use this to logIn and test the application</h2>
                <p style={{'fontWeight': '800'}}>Admin access</p>
                <p>username: admin || password : admin</p>
                <p style={{'fontWeight': '800'}}>User access</p>
                <p>username: guest || password : guest</p>
                <p>username: devrev || password : devrev</p>
                <p>username: swayam || password : 1234</p>
                <p>username: bravim || password : 1234</p>
                <p>username: sparsh || password : 1234</p>

            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
   )
}
