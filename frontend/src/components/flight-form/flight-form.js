import React, { useState, useEffect } from "react"
import * as dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useParams, useNavigate } from "react-router-dom"
import {
    Paper,
    Container,
    Button,
    TextField,
    FormGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material"
import { BackendApi } from "../../client/backend-api"
import classes from "./styles.module.css"

dayjs.extend(utc)

export const FlightForm = () => {
    const { flightNo } = useParams()
    const navigate = useNavigate()
    const [flight, setFlight] = useState({
        from: "",
        to: '',
        flightNo: flightNo || "",
        // category: "",
        price: 0,
        quantity: 0,
        priceHistory: [],
        quantityHistory: [],
    })
    const [errors, setErrors] = useState({
        from: "",
        flightNo: "",
        to: "",
        price: "",
        quantity: "",
    })

    const isInvalid =
        flight.from.trim() === "" || flight.flightNo.trim() === "" || flight.to.trim() === ""

    const formSubmit = (event) => {
        event.preventDefault()
        if (!isInvalid) {
            if (flightNo) {
                const newPrice = parseInt(flight.price, 10)
                const newQuantity = parseInt(flight.quantity, 10)
                let newPriceHistory = flight.priceHistory.slice()
                let newQuantityHistory = flight.quantityHistory.slice()
                if (
                    newPriceHistory.length === 0 ||
                    newPriceHistory[newPriceHistory.length - 1].price !== newPrice
                ) {
                    newPriceHistory.push({ price: newPrice, modifiedAt: dayjs().utc().format() })
                }
                if (
                    newQuantityHistory.length === 0 ||
                    newQuantityHistory[newQuantityHistory.length - 1].quantity !== newQuantity
                ) {
                    newQuantityHistory.push({ quantity: newQuantity, modifiedAt: dayjs().utc().format() })
                }
                BackendApi.flight
                    .patchFlightBygetFlightByNo(flightNo, {
                        ...flight,
                        priceHistory: newPriceHistory,
                        quantityHistory: newQuantityHistory,
                    })
                    .then(() => navigate(-1))
            } else {
                BackendApi.flight
                    .addFlight({
                        ...flight,
                        priceHistory: [{ price: flight.price, modifiedAt: dayjs().utc().format() }],
                        quantityHistory: [{ quantity: flight.quantity, modifiedAt: dayjs().utc().format() }],
                    })
                    .then(() => navigate("/"))
            }
        }
    }

    const updateFlightField = (event) => {
        const field = event.target
        setFlight((flight) => ({ ...flight, [field.from]: field.value }))
    }

    const validateForm = (event) => {
        const { from, value } = event.target
        if (["from",'to', "flightNo", "price", "quantity"].includes(from)) {
            setFlight((prevProd) => ({ ...prevProd, [from]: value.trim() }))
            if (!value.trim().length) {
                setErrors({ ...errors, [from]: `${from} can't be empty` })
            } else {
                setErrors({ ...errors, [from]: "" })
            }
        }
        if (["price", "quantity"].includes(from)) {
            if (isNaN(Number(value))) {
                setErrors({ ...errors, [from]: "Only numbers are allowed" })
            } else {
                setErrors({ ...errors, [from]: "" })
            }
        }
    }

    useEffect(() => {
        if (flightNo) {
            BackendApi.flight.getFlightByNo(flightNo).then(({ flight, error }) => {
                if (error) {
                    navigate("/")
                } else {
                    setFlight(flight)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flightNo])

    return (
        <>
            <Container component={Paper} className={classes.wrapper}>
                <Typography className={classes.pageHeader} variant="h5">
                    {flightNo ? "Update Flight" : "Add Flight"}
                </Typography>
                <form noValidate autoComplete="off" onSubmit={formSubmit}>
                    <FormGroup>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="From"
                                name="from"
                                required
                                value={flight.from}
                                onChange={updateFlightField}
                                onBlur={validateForm}
                                error={errors.from.length > 0}
                                helperText={errors.from}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="To"
                                name="to"
                                required
                                value={flight.to}
                                onChange={updateFlightField}
                                onBlur={validateForm}
                                error={errors.to.length > 0}
                                helperText={errors.to}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="flightNo"
                                name="flightNo"
                                required
                                value={flight.flightNo}
                                onChange={updateFlightField}
                                onBlur={validateForm}
                                error={errors.flightNo.length > 0}
                                helperText={errors.flightNo}
                            />
                        </FormControl>
                        {/* <FormControl className={classes.mb2}>
                            <InputLabel>Category</InputLabel>
                            <Select name="category" value={flight.category} onChange={updateFlightField} required>
                                <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                                <MenuItem value="Action">Action</MenuItem>
                                <MenuItem value="Adventure">Adventure</MenuItem>
                                <MenuItem value="Horror">Horror</MenuItem>
                                <MenuItem value="Romance">Romance</MenuItem>
                                <MenuItem value="Mystery">Mystery</MenuItem>
                                <MenuItem value="Thriller">Thriller</MenuItem>
                                <MenuItem value="Drama">Drama</MenuItem>
                                <MenuItem value="Fantasy">Fantasy</MenuItem>
                                <MenuItem value="Comedy">Comedy</MenuItem>
                                <MenuItem value="Biography">Biography</MenuItem>
                                <MenuItem value="History">History</MenuItem>
                                <MenuItem value="Western">Western</MenuItem>
                                <MenuItem value="Literature">Literature</MenuItem>
                                <MenuItem value="Poetry">Poetry</MenuItem>
                                <MenuItem value="Philosophy">Philosophy</MenuItem>
                            </Select>
                        </FormControl> */}
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Price"
                                name="price"
                                required
                                value={flight.price}
                                onChange={updateFlightField}
                                onBlur={validateForm}
                                error={errors.price.length > 0}
                                helperText={errors.price}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={flight.quantity}
                                onChange={updateFlightField}
                                onBlur={validateForm}
                                error={errors.quantity.length > 0}
                                helperText={errors.quantity}
                            />
                        </FormControl>
                    </FormGroup>
                    <div className={classes.btnContainer}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                navigate(-1)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isInvalid}>
                            {flightNo ? "Update Flight" : "Add Flight"}
                        </Button>
                    </div>
                </form>
            </Container>
        </>
    )
}
