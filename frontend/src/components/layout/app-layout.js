import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
} from "@mui/material"
import { useUser } from "../../context/user-context"
import { Route, Routes, Navigate, Link } from "react-router-dom"
import AdbIcon from "@mui/icons-material/Adb"
import { FlightsList } from "../flights-list/flights-list"
import { LoginDialog } from "../login/login-dialog"
import { FlightForm } from "../flight-form/flight-form"
import { Flight } from "../flight/flight"
import { WithLoginProtector } from "../access-control/login-protector"
import { WithAdminProtector } from "../access-control/admin-protector"
import { InsDialog } from "./instruction"

const MyComponent = () => {
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

        if (isMobile && showAlert) {
            alert("Please use desktop mode");
            setShowAlert(false);
        }
    }, [showAlert]);

    return null;
};

export const AppLayout = () => {
    const [openLoginDialog, setOpenLoginDialog] = useState(false)
    const [openInsDialog, setOpenInsDialog] = useState(false)

    const [anchorElUser, setAnchorElUser] = useState(null)
    const { user, loginUser, logoutUser, isAdmin } = useUser()
    const navigate = useNavigate()

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleLoginSubmit = (username, password) => {
        loginUser(username, password)
        setOpenLoginDialog(false)
    }

    const handleLoginClose = () => {
        setOpenLoginDialog(false)
    }
    const handleInsClose = () => {
        setOpenInsDialog(false)
    }

    const handleLogout = () => {
        logoutUser()
        handleCloseUserMenu()
    }
    // setOpenInsDialog
    useEffect(() => {
        if (!user) {
            navigate("/flights")
        } else if (isAdmin) {
            navigate("/admin/flights/add")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAdmin])

    return (
        <>
            <MyComponent />

            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: "flex", mr: 1 }} />
                        <Link to="/" style={{ textDecoration: "none", flexGrow: 1 }}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    mr: 2,
                                    display: "flex",
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "white",
                                }}
                            >
                                SWAYAM AIRLINES
                            </Typography>
                        </Link>
                        {/* <h1>h1</h1> */}
                        <Box
                            sx={{
                                flexGrow: 0,
                            }}
                        >
                            {user ? (
                                <>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar> {user.username.charAt(0).toUpperCase()} </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: "45px" }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" to>Dashboard</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <Typography textAlign="center">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                <Typography  sx={{display : 'flex'}}>
                                <Button
                                    onClick={() => {
                                        setOpenLoginDialog(true)
                                    }}

                                    sx={{ my: 2, color: "white", display: "grid" }}
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOpenInsDialog(true)
                                    }}

                                    sx={{ my: 2, color: "white", display: "grid" }}
                                >
                                    Instruction
                                </Button>
                                
                                </Typography>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Routes>
                <Route path="/flights" exact element={<FlightsList />} />

                <Route
                    path="/flights/:flightNo"
                    element={
                        <WithLoginProtector>
                            <Flight />
                        </WithLoginProtector>
                    }
                />
                <Route
                    path="/admin/flights/add"
                    element={
                        <WithLoginProtector>
                            <WithAdminProtector>
                                <FlightForm />
                            </WithAdminProtector>
                        </WithLoginProtector>
                    }
                    exact
                />
                <Route
                    path="/admin/flights/:flightNo/edit"
                    element={
                        <WithLoginProtector>
                            <WithAdminProtector>
                                <FlightForm />
                            </WithAdminProtector>
                        </WithLoginProtector>
                    }
                />
                <Route path="*" element={<Navigate to="/flights" replace />} />
            </Routes>
            <LoginDialog
                open={openLoginDialog}
                handleSubmit={handleLoginSubmit}
                handleClose={handleLoginClose}
            />
            <InsDialog
                open={openInsDialog}
                handleClose={handleInsClose}
            />
        </>
    )
}
