import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import {
    Card,
    CardContent,
    Icon,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Snackbar,
    Avatar,
    Typography,
    Button,
    Tooltip,
    CircularProgress,
    Grid,
    //dialog
    Dialog,
    DialogTitle,
    DialogContent,
} from '@material-ui/core'
import clsx from 'clsx'

import { Alert, Autocomplete } from '@material-ui/lab'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import SimpleCard from 'app/components/cards/SimpleCard'
import PurchaseOrderServices from 'app/services/PurchaseOrderServices'
import UserServices from 'app/services/UserServices'
import DeliveryAdviceNoteServices from 'app/services/DeliveryAdviceNoteServices'

const styles = (theme) => ({
    productTable: {
        minWidth: 800,
    },
    //loading screen progress
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

const form_data = {
    purchaseOrder: '',
    delivered_items: [],
    signedBy: '',
    status: '',
}

class CreateDeliveryAdviceNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //table data
            loading: true,
            order_id: '',
            items: [],

            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //dialog box
            dialogBox_data: {},
            dialogBox: false,

            //form
            formData: form_data,

            new_added_items: [],
        }
    }

    //navigate to item page
    viewItem = (data) => {
        // console.log(data)
        window.location.href = `/items/view/${data._id}`
    }

    //close snack bar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //set dialog box data
    setDialogBoxData = (item_data) => {
        // console.log(item_data)
        this.setState({
            dialogBox: true,
            dialogBox_data: item_data.item,
        })
    }

    //change dialog box data
    formData_handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        var data = this.state.dialogBox_data
        data[name] = value
        this.setState({
            dialogBox_data: data,
        })
    }

    //add item
    addItemToQueue = () => {
        var item = this.state.dialogBox_data
        var arr = this.state.new_added_items

        var isExists = false

        arr.forEach((ele, no) => {
            if (item._id === ele._id) {
                isExists = true
            }
        })

        if (!isExists) {
            arr.push(item)
            this.setState({
                new_added_items: arr,
                dialogBox_data: {},
                dialogBox: false,
            })
        } else {
            this.setState({
                snackbar: true,
                snackbar_severity: 'warning',
                snackbar_message: 'Item already Exists',
                dialogBox_data: {},
                dialogBox: false,
            })
        }
    }

    //remove item
    removeItemFromQueue = (itm_data) => {
        var item = itm_data
        var arr = this.state.new_added_items

        var index = 0

        arr.forEach((ele, no) => {
            if (item._id === ele._id) {
                index = no
            }
        })

        arr.splice(index, 1)

        this.setState({
            new_added_items: arr,
        })
    }

    //create delivery note
    createDeliveryNote = async () => {
        //get all ordered items
        var arr = this.state.new_added_items
        var newArr = []

        arr.forEach((element) => {
            var item_id = element._id
            var item_q = element.qty

            var item_data = {
                item: item_id,
                qty: item_q,
            }

            newArr.push(item_data)
        })

        var data = {
            purchaseOrder: this.state.order_id,
            delivered_items: newArr,
        }

        console.log(data)
        await DeliveryAdviceNoteServices.createNewDelivery(data)
            .then((res) => {
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: res.data.message,
                })
                setTimeout(() => {
                    window.location.href = `/purchaseOrders/view/${this.state.order_id}`
                }, 800)
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error',
                })
            })
    }

    //get data
    getRequisitionByID = async (id) => {
        await PurchaseOrderServices.getRequisitionByID(id)
            .then(async (res) => {
                console.log(res)

                if (res.success) {
                    var allOrders = res.Order

                    this.setState({
                        loading: false,
                        items: allOrders.orderItems,
                    })
                } else {
                    this.setState({
                        snackbar: true,
                        loading: false,
                        snackbar_severity: 'warning',
                        snackbar_message: res.message,
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    loading: false,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error',
                })
            })
    }

    async componentDidMount() {
        var id = this.props.match.params.id

        this.setState({
            order_id: id,
        })

        //get requisition  details
        await this.getRequisitionByID(id)
    }

    render() {
        const { classes } = this.props
        return (
            <div className="m-sm-30">
                {this.state.loading ? (
                    <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                    />
                ) : (
                    <SimpleCard>
                        <div>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h4">
                                        Create Delivery Advice Note
                                    </Typography>
                                </Grid>

                                {/* Section 1 - all ordered items */}
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <div className="text-center">
                                        <img
                                            src="/assets/images/add_items_to_DNO.svg"
                                            alt="Site Image"
                                            width="300px"
                                            height="300px%"
                                        />
                                    </div>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className="my-5"
                                >
                                    <Typography
                                        variant="h5"
                                        className="mx-2 mt-5"
                                    >
                                        Delivery Items
                                    </Typography>
                                    <div className="overflow-auto">
                                        <Table
                                            className={clsx(
                                                'whitespace-pre min-w-700',
                                                classes.productTable
                                            )}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        className="px-6"
                                                        colSpan={4}
                                                    >
                                                        Item Name
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Qty
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Action
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.new_added_items.map(
                                                    (row, index) => (
                                                        <TableRow
                                                            key={index}
                                                            hover
                                                        >
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                colSpan={4}
                                                                align="left"
                                                            >
                                                                <div className="flex items-center">
                                                                    <Avatar
                                                                        src={
                                                                            row
                                                                                .images
                                                                                .length >
                                                                                0 &&
                                                                            row
                                                                                .images[0]
                                                                        }
                                                                    />
                                                                    <p className="m-0 ml-8">
                                                                        {
                                                                            row.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {row.qty}
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0"
                                                                colSpan={2}
                                                            >
                                                                <Button
                                                                    className="hover-bg-error"
                                                                    variant="contained"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        this.removeItemFromQueue(
                                                                            row
                                                                        )
                                                                    }
                                                                >
                                                                    Remove From
                                                                    Queue
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="my-5 mx-2">
                                        {this.state.new_added_items.length >
                                        0 ? (
                                            <Button
                                                className="bg-green hover-bg-secondary"
                                                variant="contained"
                                                onClick={
                                                    this.createDeliveryNote
                                                }
                                            >
                                                Confirm Order
                                            </Button>
                                        ) : (
                                            <div className="text-error">
                                                Queue is Empty.Pleas add Items
                                                to the Queue.
                                            </div>
                                        )}
                                    </div>
                                </Grid>

                                {/* Section 2 - ordered items */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className="my-5"
                                >
                                    <Typography
                                        variant="h5"
                                        className="mx-2 mt-5"
                                    >
                                        Ordered Items
                                    </Typography>
                                    <div className="overflow-auto">
                                        <Table
                                            className={clsx(
                                                'whitespace-pre min-w-700',
                                                classes.productTable
                                            )}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        className="px-6"
                                                        colSpan={4}
                                                    >
                                                        Item Name
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Price
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Ordered Qty
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Unit
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Action
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.items.map(
                                                    (row, index) => (
                                                        <TableRow
                                                            key={index}
                                                            hover
                                                        >
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                colSpan={4}
                                                                align="left"
                                                            >
                                                                <div className="flex items-center">
                                                                    <Avatar
                                                                        src={
                                                                            row
                                                                                .item
                                                                                .images
                                                                                .length >
                                                                                0 &&
                                                                            row
                                                                                .item
                                                                                .images[0]
                                                                        }
                                                                    />
                                                                    <p className="m-0 ml-8">
                                                                        {
                                                                            row
                                                                                .item
                                                                                .name
                                                                        }
                                                                    </p>
                                                                    <Tooltip
                                                                        title="View"
                                                                        arrow
                                                                    >
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                this.viewItem(
                                                                                    row.item
                                                                                )
                                                                            }
                                                                        >
                                                                            <Icon color="primary">
                                                                                visibility
                                                                            </Icon>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {`Rs.${row.item.price}`}
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {
                                                                    row.requested_qty
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                <small className="px-1 py-4px bg-secondary text-white border-radius-4">
                                                                    {
                                                                        row.qty_measurement_unit
                                                                    }
                                                                </small>
                                                            </TableCell>

                                                            <TableCell
                                                                className="px-0"
                                                                colSpan={2}
                                                            >
                                                                <Button
                                                                    className="hover-bg-green"
                                                                    color="primary"
                                                                    variant="contained"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        this.setDialogBoxData(
                                                                            row
                                                                        )
                                                                    }
                                                                >
                                                                    Add To Queue
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </SimpleCard>
                )}

                {/* Dialog box */}
                <div>
                    <div>
                        <Dialog open={this.state.dialogBox}>
                            <DialogTitle className="text-center">
                                Add Item to Delivery Queue
                            </DialogTitle>
                            <DialogContent>
                                {/* Form */}
                                <ValidatorForm onSubmit={this.addItemToQueue}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid
                                                container
                                                className="w-full"
                                                alignItems="center"
                                                justify="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Grid item xs={12}>
                                                    <Typography
                                                        variant="body2"
                                                        component="h5"
                                                    >
                                                        Item Name :{' '}
                                                        {
                                                            this.state
                                                                .dialogBox_data
                                                                .name
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="h5"
                                                    >
                                                        Item Brand :{' '}
                                                        {
                                                            this.state
                                                                .dialogBox_data
                                                                .brand
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="h5"
                                                    >
                                                        Item Category :{' '}
                                                        {
                                                            this.state
                                                                .dialogBox_data
                                                                .category
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="h5"
                                                    >
                                                        Qty Unit:{' '}
                                                        {
                                                            this.state
                                                                .dialogBox_data
                                                                .priceMeasurementUnit
                                                        }
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Quantity
                                                    <TextValidator
                                                        className="mt-2"
                                                        placeholder="Quantity"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        type="number"
                                                        name="qty"
                                                        value={
                                                            this.state
                                                                .dialogBox_data
                                                                .qty
                                                        }
                                                        onChange={(e) =>
                                                            this.formData_handleChange(
                                                                e
                                                            )
                                                        }
                                                        validators={[
                                                            'required',
                                                            'minNumber:1',
                                                        ]}
                                                        errorMessages={[
                                                            'This field is Required',
                                                            'Please enter Valid Number',
                                                        ]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* Button section */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <div
                                                style={{
                                                    textAlign: 'right',
                                                }}
                                            >
                                                <Button
                                                    className="mt-2 m-2"
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    type="submit"
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    className="mt-2 m-2"
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => {
                                                        this.setState({
                                                            dialogBox: false,
                                                            dialogBox_data: {},
                                                        })
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Snackbar */}
                <div>
                    <Snackbar
                        open={this.state.snackbar}
                        autoHideDuration={2500}
                        onClose={this.handleCloseSnackbar}
                    >
                        <Alert
                            onClose={this.handleCloseSnackbar}
                            severity={this.state.snackbar_severity}
                        >
                            {this.state.snackbar_message}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(CreateDeliveryAdviceNote)
