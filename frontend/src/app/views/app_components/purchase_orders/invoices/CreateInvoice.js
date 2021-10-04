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
import InvoiceServices from 'app/services/InvoiceServices'

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
    ordered_items: [],
    totalAmount: '',
    isPaid: '',
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
    viewItem = (id) => {
        window.location.href = `/items/view/${id}`
    }

    //close snack bar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
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

    //set dialog box data
    setDialogBoxData = (item_data) => {
        var data = {
            item: item_data.item._id,
            name: item_data.item.name,
            brand: item_data.item.brand,
            category: item_data.item.category,
            qty: item_data.qty,
            price: 0,
            sub_total: 0,
        }
        // console.log(item_data)
        this.setState({
            dialogBox: true,
            dialogBox_data: data,
        })
    }

    //add item
    addItemToQueue = () => {
        var item_data = this.state.dialogBox_data
        var arr = this.state.new_added_items

        var isExists = false

        //set sub total value
        var sub_tot = item_data.price * item_data.qty
        item_data.sub_total = sub_tot

        arr.forEach((ele, no) => {
            // console.log(ele.item)
            if (item_data.item === ele.item) {
                isExists = true
            }
        })

        if (!isExists) {
            arr.push(item_data)
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
        var arr = this.state.new_added_items

        var index = 0

        arr.forEach((ele, no) => {
            if (itm_data.item === ele.item) {
                index = no
            }
        })

        arr.splice(index, 1)

        this.setState({
            new_added_items: arr,
        })
    }

    //create new invoice
    createInvoice = async () => {

        var tot = 0
        var arr = this.state.new_added_items;

        arr.forEach(itm => {
            tot = tot + itm.sub_total
        });

        var data = {
            purchaseOrder: this.state.order_id,
            ordered_items: this.state.new_added_items,
            totalAmount: tot,
            isPaid: false,
        }

        console.log(data)

        await InvoiceServices.createNewInvoice(data)
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
    getDeliveryNotesData = async (id) => {
        await DeliveryAdviceNoteServices.getDeliveryNotesByOrderID(id)
            .then(async (res) => {
                console.log(res)

                var notes = res.data.notes
                var items_arr = []

                notes.forEach((note, x) => {
                    var del_items = note.delivered_items

                    if (x === 0) {
                        del_items.forEach((dItem, y) => {
                            items_arr.push(dItem)
                        })
                    } else {
                        del_items.forEach((d_Item, z) => {
                            var id = d_Item.item._id
                            var isFound = false
                            var foundIndex = 0

                            //check item in the new array
                            items_arr.forEach((element, y) => {
                                var existing_item_id = element.item._id

                                if (id === existing_item_id) {
                                    isFound = true
                                    foundIndex = y
                                }
                            })

                            if (isFound) {
                                //if item found need to update it's quantity
                                var item_old_data = items_arr[foundIndex]
                                var item_new_data = d_Item
                                var item_old_data_qty = item_old_data.qty
                                var item_new_data_qty = item_new_data.qty
                                var qty_new =
                                    item_old_data_qty + item_new_data_qty

                                item_old_data['qty'] = qty_new

                                //add that to the array
                                items_arr[foundIndex] = item_old_data
                            } else {
                                //add item if item not found in new array
                                items_arr.push(d_Item)
                            }
                        })
                    }
                })

                if (res.data.success) {
                    this.setState({
                        loading: false,
                        items: items_arr,
                    })
                } else {
                    this.setState({
                        snackbar: true,
                        loading: false,
                        snackbar_severity: 'warning',
                        snackbar_message: res.data.message,
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

        //get DA Notes data
        await this.getDeliveryNotesData(id)
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
                                        Create Invoice
                                    </Typography>
                                </Grid>

                                {/* Section 1 - all ordered items */}
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
                                        Invoice Items
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
                                                        Price
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Sub Total
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
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {row.price}
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {row.sub_total}
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
                                                onClick={this.createInvoice}
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
                                        Delivered Items
                                    </Typography>
                                    <Typography
                                        variant="subtitle-1"
                                        className="mx-2 mt-5"
                                    >
                                        Delivery Advice Note Summary
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
                                                        Delivered Qty
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
                                                                    Add To
                                                                    Invoice
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
                                Add Item to Invoice
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
                                                        Qty Delivered:{' '}
                                                        {
                                                            this.state
                                                                .dialogBox_data
                                                                .qty
                                                        }
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Price(Rs.)
                                                    <TextValidator
                                                        className="mt-2"
                                                        placeholder="Quantity"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        type="number"
                                                        name="price"
                                                        value={
                                                            this.state
                                                                .dialogBox_data
                                                                .price
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
                                                    <Typography
                                                        className="my-3"
                                                        variant="h6"
                                                        component="h5"
                                                    >
                                                        Sub Total : {' Rs.'}
                                                        {this.state
                                                            .dialogBox_data
                                                            .qty *
                                                            this.state
                                                                .dialogBox_data
                                                                .price}
                                                    </Typography>
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
