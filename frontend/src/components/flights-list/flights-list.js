import { useState, useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    Card,
    CardContent,
    CardActions,
    Typography,
    TablePagination,
} from "@mui/material"
import { BackendApi } from "../../client/backend-api"
import { useUser } from "../../context/user-context"
import classes from "./styles.module.css"

export const FlightsList = () => {

    const [flights, setFlights] = useState([]);
    const [buyedFlight, setBorrowedFlight] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [activeFlightNo, setActiveFlightNo] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const { isAdmin, user } = useUser()


    const fetchFlights = async () => {
        const { flights } = await BackendApi.flight.getAllFlights()
        setFlights(flights)
    }

    const fetchUserFlight = async () => {
        const { flights } = await BackendApi.user.getBorrowFlight()
        setBorrowedFlight(flights)
    }

    const deleteFlight = () => {
        if (activeFlightNo && flights.length) {
            BackendApi.flight.deleteFlight(activeFlightNo).then(({ success }) => {
                fetchFlights().catch(console.error)
                setOpenModal(false)
                setActiveFlightNo("")
            })
        }
    }

    useEffect(() => {
        fetchFlights().catch(console.error)
        fetchUserFlight().catch(console.error)
    }, [user])

    return (
        <>
            <div className={`${classes.pageHeader} ${classes.mb2}`}>
                <Typography variant="h5">Flight List</Typography>
                {isAdmin && (
                    <Button variant="contained" color="primary" component={RouterLink} to="/admin/flights/add">
                        Add Flight
                    </Button>
                )}
            </div>
            {flights.length > 0 ? (
                <>
                    <div className={classes.tableContainer}>
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">ISBN</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Available</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? flights.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : flights
                                    ).map((flight) => (
                                        <TableRow key={flight.flightNo}>
                                            <TableCell component="th" scope="row">
                                                {flight.from} - {flight.to}
                                            </TableCell>
                                            <TableCell align="right">{flight.flightNo}</TableCell>
                                            {/* <TableCell>{flight.category}</TableCell> */}
                                            <TableCell align="right">{flight.quantity}</TableCell>
                                            <TableCell align="right">{flight.availableQuantity}</TableCell>
                                            <TableCell align="right">{`$${flight.price}`}</TableCell>
                                            <TableCell>
                                                <div className={classes.actionsContainer}>
                                                    <Button
                                                        variant="contained"
                                                        component={RouterLink}
                                                        size="small"
                                                        to={`/flights/${flight.flightNo}`}
                                                    >
                                                        View
                                                    </Button>
                                                    {isAdmin && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                component={RouterLink}
                                                                size="small"
                                                                to={`/admin/flights/${flight.flightNo}/edit`}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                onClick={(e) => {
                                                                    setActiveFlightNo(flight.flightNo)
                                                                    setOpenModal(true)
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10))
                                setPage(0)
                            }}
                            component="div"
                            count={flights.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                        />
                        <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
                            <Card className={classes.conf_modal}>
                                <CardContent>
                                    <h2>Are you sure?</h2>
                                </CardContent>
                                <CardActions className={classes.conf_modal_actions}>
                                    <Button variant="contained" onClick={() => setOpenModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={deleteFlight}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Modal>
                    </div>
                </>
            ) : (
                <Typography variant="h5">No flights found!</Typography>
            )}

            {
                user && !isAdmin && (
                    <>
                        <div className={`${classes.pageHeader} ${classes.mb2}`}>
                            <Typography variant="h5">Booked Flights</Typography>
                        </div>
                        {buyedFlight.length > 0 ? (
                            <>
                                <div className={classes.tableContainer}>
                                    <TableContainer component={Paper}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>From</TableCell>
                                                    <TableCell align="right">ISBN</TableCell>
                                                    <TableCell>To</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {buyedFlight.map((flight) => (
                                                    <TableRow key={flight.flightNo}>
                                                        <TableCell component="th" scope="row">
                                                            {flight.from}
                                                        </TableCell>
                                                        <TableCell align="right">{flight.flightNo}</TableCell>
                                                        <TableCell>{flight.to}</TableCell>
                                                        <TableCell align="right">{`$${flight.price}`}</TableCell>
                                                        <TableCell>
                                                            <div className={classes.actionsContainer}>
                                                                <Button
                                                                    variant="contained"
                                                                    component={RouterLink}
                                                                    size="small"
                                                                    to={`/flights/${flight.flightNo}`}
                                                                >
                                                                    View
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </>
                        ) : (
                            <Typography variant="h5">No flights Booked!</Typography>
                        )}
                    </>
                )
            }
        </>
    )
}