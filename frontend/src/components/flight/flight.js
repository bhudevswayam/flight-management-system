import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import {
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@mui/material"
import { NotificationManager } from "react-notifications"
import { BackendApi } from "../../client/backend-api"
import { useUser } from "../../context/user-context"
import { TabPanel } from "../tabs/tab"
import { makeChartOptions } from "./chart-options"
import classes from "./styles.module.css"

export const Flight = () => {
    const { flightNum } = useParams()
    const { user, isAdmin } = useUser()
    const navigate = useNavigate()
    const [flight, setFlight] = useState(null)
    const [chartOptions, setChartOptions] = useState(null)
    const [openTab, setOpenTab] = useState(0)

    const borrowFlight = () => {
        if (flight && user) {
            BackendApi.user
                .borrowFlight(flight.flightNo, user._id)
                .then(({ flight, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setFlight(flight)
                    }
                })
                .catch(console.error)
        }
    }

    const returnFlight = () => {
        if (flight && user) {
            BackendApi.user
                .returnFlight(flight.flightNo, user._id)
                .then(({ flight, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setFlight(flight)
                    }
                })
                .catch(console.error)
        }
    }

    useEffect(() => {
        if (flightNum) {
            BackendApi.flight
                .getFlightByflightNo(flightNum)
                .then(({ flight, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setFlight(flight)
                    }
                })
                .catch(console.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flightNum])

    return (
        flight && (
            <div className={classes.wrapper}>
                <Typography variant="h5" align="center" style={{ marginBottom: 20 }}>
                    Flight Details
                </Typography>
                <Card>
                    <Tabs
                        value={openTab}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={(e, tabIndex) => {
                            setOpenTab(tabIndex)
                            if (flight && tabIndex > 0) {
                                setChartOptions(
                                    makeChartOptions(
                                        tabIndex,
                                        tabIndex === 1 ? flight.priceHistory : flight.quantityHistory
                                    )
                                )
                            }
                        }}
                        centered
                    >
                        <Tab label="Flight Details" tabIndex={0} />
                        <Tab label="Price History" tabIndex={1} />
                        <Tab label="Quantity History" tabIndex={2} />
                    </Tabs>

                    <TabPanel value={openTab} index={0}>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant="head" component="th" width="200">
                                            Name
                                        </TableCell>
                                        <TableCell>{flight.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            flightNo
                                        </TableCell>
                                        <TableCell>{flight.flightNo}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Category
                                        </TableCell>
                                        <TableCell>{flight.category}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Quantity
                                        </TableCell>
                                        <TableCell>{flight.quantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Available
                                        </TableCell>
                                        <TableCell>{flight.availableQuantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Price
                                        </TableCell>
                                        <TableCell>${flight.price}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </TabPanel>

                    <TabPanel value={openTab} index={1}>
                        <CardContent>
                            {flight && flight.priceHistory.length > 0 ? (
                                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                            ) : (
                                <h3>No history found!</h3>
                            )}
                        </CardContent>
                    </TabPanel>

                    <TabPanel value={openTab} index={2}>
                        <CardContent>
                            {flight && flight.quantityHistory.length > 0 ? (
                                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                            ) : (
                                <h3>No history found!</h3>
                            )}
                        </CardContent>
                    </TabPanel>

                    <CardActions disableSpacing>
                        <div className={classes.btnContainer}>
                            {isAdmin ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component={RouterLink}
                                    to={`/admin/flights/${flightNum}/edit`}
                                >
                                    Edit Flight
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={borrowFlight}
                                        disabled={flight && user && flight.borrowedBy.includes(user._id)}
                                    >
                                        Borrow
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={returnFlight}
                                        disabled={flight && user && !flight.borrowedBy.includes(user._id)}
                                    >
                                        Return
                                    </Button>
                                </>
                            )}
                            <Button type="submit" variant="text" color="primary" onClick={() => navigate(-1)}>
                                Go Back
                            </Button>
                        </div>
                    </CardActions>
                </Card>
            </div>
        )
    )
}