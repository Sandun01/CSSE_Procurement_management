import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import {
    Card,
    CardActionArea,
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

const ord_data = {
    status: '',
    _id: '',
    title: '',
    site: {
        _id: '',
        name: '',
        contactNumber: '',
        address: '',
        siteManager: '',
        createdAt: '',
        updatedAt: '',
    },
    requiredDate: '',
    orderItems: [],
    comments: [],
    createdAt: '',
    updatedAt: '',
}

const site_manager_check_status_types = [
    {
        value: 'Pending',
    },
    {
        value: 'Completed',
    },
    {
        value: 'Incomplete',
    },
]

const dialog_box_form_data = {
    item: {},
    itemDBbId: '',
    received_qty: 0,
    site_manager_status: '',
}
class ViewRequisition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //table data
            loading: true,
            requisition_data: ord_data,

            requisition_id: '',
            is_requisition: true,
            items: [],
            comments: [],
            site: [],
            siteManager: '',

            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //dialog box
            dialogBox_data: dialog_box_form_data,
            dialogBox: false,

            delivered_notes: [],

            deliver_note_items: [],

            invoices_all: [],
        }
    }

    //close snackbar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //navigate to item page
    viewItem = (itemData) => {
        // console.log(itemData)
        window.location.href = `/items/view/${itemData._id}`
    }

    //set dialog box data
    setFormDialogData = (row) => {
        // console.log(row)
        var data = {
            item: row.item,
            itemDBbId: row._id,
            received_qty: row.received_qty,
            site_manager_status: row.site_manager_status,
        }
        this.setState({
            dialogBox_data: data,
            dialogBox: true,
        })
    }

    //navigate to item page
    setDialogBoxFormDataSelectedValue = (e, v) => {
        var data = this.state.dialogBox_data

        data[e] = v

        this.setState({
            dialogBox_data: data,
        })

        console.log(this.state)
    }

    //handle change dialog box form data values
    setDialogBoxFormData = (e) => {
        var name = e.target.name
        var value = e.target.value

        var data = this.state.dialogBox_data

        data[name] = value

        this.setState({
            dialogBox_data: data,
        })

        // console.log(this.state.dialogBox_data)
    }

    //change checked status in database
    changedItemCheckedStatus = async () => {
        var data = {
            itemDBbId: this.state.dialogBox_data.itemDBbId,
            received_qty: this.state.dialogBox_data.received_qty,
            site_manager_status: this.state.dialogBox_data.site_manager_status,
        }

        var id = this.state.requisition_id

        await PurchaseOrderServices.updateCheckedStatus(data, id)
            .then((res) => {
                // console.log(res)

                if (res.success) {
                    this.setState({
                        dialogBox: false,
                        dialogBox_data: dialog_box_form_data,
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: res.message,
                    })
                    this.componentDidMount()
                } else {
                    this.setState({
                        dialogBox: true,
                        snackbar: true,
                        dialogBox_data: dialog_box_form_data,
                        snackbar_severity: 'warning',
                        snackbar_message: res.message,
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    dialogBox: false,
                    loading: false,
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error',
                })
            })
    }

    //get all invoices
    getAllInvoicesByOrderID = async (id) => {
        await InvoiceServices.getAllInvoicesByOrderID(id)
            .then(async (res) => {
                console.log(res.data)

                this.setState({
                    loading: false,
                    invoices_all: res.data.invoices,
                })
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

    //get data of summary delivery note
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
                        deliver_note_items: items_arr,
                    })
                } else {
                    this.setState({
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

    //get delivery notes
    getAllDeliveryNotes = async (id) => {
        await DeliveryAdviceNoteServices.getDeliveryNotesByOrderID(id)
            .then(async (res) => {
                console.log(res.data)

                this.setState({
                    delivered_notes: res.data.notes,
                })
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

    //get site manager details
    getSiteManager = async (id) => {
        await UserServices.getUserByID(id)
            .then((res) => {
                // console.log(res.data)
                var user = res.data
                this.setState({
                    siteManager: user.name,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //get data
    getRequisitionByID = async (id) => {
        await PurchaseOrderServices.getRequisitionByID(id)
            .then(async (res) => {
                console.log(res)
                var is_req = false

                if (res.success) {
                    var allOrders = res.Order

                    if (
                        allOrders.status === 'Saved_Requisition' ||
                        allOrders.status === 'Completed_Requisition'
                    ) {
                        is_req = true ///change
                    }
                    this.setState({
                        requisition_data: allOrders,
                        loading: false,
                        is_requisition: is_req,
                        items: allOrders.orderItems,
                        site: allOrders.site,
                        comments: allOrders.comments,
                    })

                    //get site manager details
                    await this.getSiteManager(allOrders.site.siteManager)
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
            requisition_id: id,
        })

        //get requisition  details
        await this.getRequisitionByID(id)

        //get all delivery notes
        await this.getAllDeliveryNotes(id)

        await this.getDeliveryNotesData(id)

        //get invoices
        await this.getAllInvoicesByOrderID(id)
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
                                    {this.state.is_requisition ? (
                                        <Typography variant="h5">
                                            Requisition Details :{' '}
                                            {this.state.requisition_data.title}
                                        </Typography>
                                    ) : (
                                        <Typography variant="h5">
                                            Purchase Order :{' '}
                                            {this.state.requisition_data._id}
                                        </Typography>
                                    )}
                                </Grid>

                                {/* Section 1 - requisition details*/}
                                <Grid item xs={12} sm={8} md={8} lg={8}>
                                    <Typography
                                        variant="h5"
                                        className="mx-2 mt-5"
                                    >
                                        Site Details
                                    </Typography>
                                    <Card elevation={3}>
                                        <Table className="my-4">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Requisition Title
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state
                                                                    .requisition_data
                                                                    .title
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Site Name
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state.site
                                                                    .name
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Site Contact Number
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state.site
                                                                    .contactNumber
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Site Address
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state.site
                                                                    .address
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Requisition Status
                                                    </TableCell>
                                                    <TableCell>
                                                        {this.state
                                                            .requisition_data
                                                            .status ===
                                                        'Approved' ? (
                                                            <small className="px-1 py-4px bg-green text-white border-radius-4">
                                                                {
                                                                    this.state
                                                                        .requisition_data
                                                                        .status
                                                                }
                                                            </small>
                                                        ) : (
                                                            <small className="px-1 py-4px bg-secondary text-white border-radius-4">
                                                                {
                                                                    this.state
                                                                        .requisition_data
                                                                        .status
                                                                }
                                                            </small>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Requested Date
                                                    </TableCell>
                                                    <TableCell>
                                                        <small className="px-2 py-4px bg-error text-white border-radius-4">
                                                            {
                                                                this.state
                                                                    .requisition_data
                                                                    .requiredDate
                                                            }
                                                        </small>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Site Manager
                                                    </TableCell>
                                                    <TableCell>
                                                        {this.state.siteManager}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Card>
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
                                        Ordered Item Details
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
                                                        Ordered Qty
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Units
                                                    </TableCell>
                                                    {this.state
                                                        .is_requisition ==
                                                        false && (
                                                        <>
                                                            <TableCell
                                                                className="px-0"
                                                                colSpan={2}
                                                            >
                                                                Received Qty
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0"
                                                                colSpan={2}
                                                            >
                                                                Status
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0"
                                                                colSpan={2}
                                                            >
                                                                Action
                                                            </TableCell>
                                                        </>
                                                    )}
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
                                                                {
                                                                    row.requested_qty
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {
                                                                    row.qty_measurement_unit
                                                                }
                                                            </TableCell>

                                                            {this.state
                                                                .is_requisition ==
                                                                false && (
                                                                <>
                                                                    <TableCell
                                                                        className="px-0"
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                    >
                                                                        {
                                                                            row.received_qty
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell
                                                                        className="px-0"
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                    >
                                                                        {row.site_manager_status ===
                                                                        'Completed' ? (
                                                                            <small className="px-1 py-4px bg-green text-white border-radius-4">
                                                                                {
                                                                                    row.site_manager_status
                                                                                }
                                                                            </small>
                                                                        ) : (
                                                                            <small className="px-1 py-4px bg-secondary text-white border-radius-4">
                                                                                {
                                                                                    row.site_manager_status
                                                                                }
                                                                            </small>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        className="px-0"
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                    >
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
                                                                        <Button
                                                                            color="primary"
                                                                            variant="contained"
                                                                            size="small"
                                                                            onClick={() =>
                                                                                this.setFormDialogData(
                                                                                    row
                                                                                )
                                                                            }
                                                                        >
                                                                            Check
                                                                        </Button>
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>

                        {/* Section 3 - Delivered notes */}
                        {this.state.delivered_notes.length > 0 && (
                            <>
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
                                        Delivery Advice Notes
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
                                                        colSpan={2}
                                                    >
                                                        Purchase Order
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Status
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Created At
                                                    </TableCell>

                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={2}
                                                    >
                                                        Actions
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.delivered_notes.map(
                                                    (row, index) => (
                                                        <TableRow
                                                            key={index}
                                                            hover
                                                        >
                                                            <TableCell
                                                                className="px-3 capitalize"
                                                                colSpan={2}
                                                                align="left"
                                                            >
                                                                <small className="px-3 py-4px bg-green text-white border-radius-4">
                                                                    This order
                                                                </small>
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {row.status}
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                {row.createdAt}
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={2}
                                                            >
                                                                <Tooltip
                                                                    title="View"
                                                                    arrow
                                                                >
                                                                    <Link
                                                                        to={`/delivery_advice_notes/view/${row._id}`}
                                                                    >
                                                                        <IconButton>
                                                                            <Icon color="primary">
                                                                                visibility
                                                                            </Icon>
                                                                        </IconButton>
                                                                    </Link>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Grid>

                                {/* summarized order table */}
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
                                        Summarized Delivered Items
                                    </Typography>
                                    <div className="overflow-auto">
                                        <Table
                                            className={clsx(
                                                'whitespace-pre min-w-400',
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
                                                        colSpan={3}
                                                    >
                                                        Qty
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.deliver_note_items.map(
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
                                                                colSpan={3}
                                                            >
                                                                <small className="px-2 py-4px bg-green text-white border-radius-4">
                                                                    {row.qty}
                                                                </small>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Grid>

                                {/* Section 5 - Invoice */}
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
                                        Invoices
                                    </Typography>
                                    <div className="overflow-auto">
                                        <Grid container>
                                            {this.state.invoices_all.map(
                                                (item, key) => (
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={6}
                                                        md={4}
                                                        lg={4}
                                                    >
                                                        <Card
                                                            className={
                                                                'bg-dark hover-bg-primary'
                                                            }
                                                            elevation={4}
                                                        >
                                                            <CardActionArea
                                                                onClick={() => {
                                                                    window.location.href = `/invoices/view/${item._id}`
                                                                }}
                                                            >
                                                                <CardContent>
                                                                    <Typography
                                                                        gutterBottom
                                                                        variant="h5"
                                                                        component="h2"
                                                                    >
                                                                        Invoice{' '}
                                                                        {key}
                                                                    </Typography>
                                                                    <Typography
                                                                        gutterBottom
                                                                        variant="body2"
                                                                        component="h2"
                                                                    >
                                                                        Paid:{' '}
                                                                        {item.isPaid
                                                                            ? 'Yes'
                                                                            : 'No'}
                                                                    </Typography>
                                                                    <Typography
                                                                        gutterBottom
                                                                        variant="body2"
                                                                        component="h2"
                                                                    >
                                                                        Total
                                                                        Amount:
                                                                        Rs.
                                                                        {
                                                                            item.totalAmount
                                                                        }
                                                                    </Typography>
                                                                </CardContent>
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                )
                                            )}
                                        </Grid>
                                    </div>
                                </Grid>
                            </>
                        )}

                        {/* Comments */}
                        <div className="my-5">
                            <Card elevation={3}>
                                {this.state.comments.length > 0 && (
                                    <Typography variant="h5" className="mx-2">
                                        Comments
                                    </Typography>
                                )}
                                <Grid container>
                                    {this.state.comments.map((row, key) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={6}
                                            lg={6}
                                            key={key}
                                        >
                                            <Card
                                                elevation={6}
                                                className="m-5 hover-bg-gray"
                                            >
                                                <CardContent>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        <Typography color="textSecondary">
                                                            <Icon>
                                                                account_circle
                                                            </Icon>
                                                        </Typography>
                                                        <Typography
                                                            className="py-2 px-2"
                                                            color="primary"
                                                        >
                                                            {row.addedUser.name}
                                                        </Typography>
                                                    </div>
                                                    <Typography
                                                        className="py-2 px-2"
                                                        color="textSecondary"
                                                    >
                                                        {row.addedUser.role ===
                                                        'SITE_MANAGER'
                                                            ? 'Site Manager'
                                                            : row.addedUser
                                                                  .role ===
                                                              'P_STAFF'
                                                            ? 'Procurement Staff'
                                                            : row.addedUser
                                                                  .role ===
                                                                  'SUPERVISOR' &&
                                                              'Supervisor'}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        component="h2"
                                                    >
                                                        {
                                                            row.comment_description
                                                        }
                                                    </Typography>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            marginTop: 15,
                                                        }}
                                                    >
                                                        <Typography
                                                            color="textSecondary"
                                                            gutterBottom
                                                        >
                                                            Date / Time :{' '}
                                                            {row.dateTime}
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            <Icon>
                                                                chatBubble
                                                            </Icon>
                                                        </Typography>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Card>
                        </div>
                    </SimpleCard>
                )}

                {/* form data dialog box */}
                <div>
                    <Dialog open={this.state.dialogBox}>
                        <DialogTitle className="text-center">
                            Check Delivered Items
                        </DialogTitle>
                        <DialogContent>
                            {/* Form */}
                            <ValidatorForm
                                onSubmit={this.changedItemCheckedStatus}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                                            .dialogBox_data.item
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
                                                            .dialogBox_data.item
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
                                                            .dialogBox_data.item
                                                            .category
                                                    }
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    component="h5"
                                                >
                                                    Unit:{' '}
                                                    {
                                                        this.state
                                                            .dialogBox_data.item
                                                            .priceMeasurementUnit
                                                    }
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12}>
                                                Received Quantity
                                                <TextValidator
                                                    className="mt-2"
                                                    placeholder="Quantity"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    type="number"
                                                    name="received_qty"
                                                    value={
                                                        this.state
                                                            .dialogBox_data
                                                            .received_qty
                                                    }
                                                    onChange={(e) =>
                                                        this.setDialogBoxFormData(
                                                            e
                                                        )
                                                    }
                                                    validators={['minNumber:1']}
                                                    errorMessages={[
                                                        'Please enter Valid Number',
                                                    ]}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                Delivery Status
                                                <Autocomplete
                                                    className="w-full"
                                                    options={
                                                        site_manager_check_status_types
                                                    }
                                                    getOptionLabel={(opt) =>
                                                        opt.value
                                                    }
                                                    onChange={(e, v) =>
                                                        this.setDialogBoxFormDataSelectedValue(
                                                            'site_manager_status',
                                                            v == null
                                                                ? null
                                                                : v.value
                                                        )
                                                    }
                                                    name="site_manager_status"
                                                    size="small"
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            variant="outlined"
                                                            className={
                                                                classes.textStyles
                                                            }
                                                            value={
                                                                this.state
                                                                    .dialogBox_data
                                                                    .site_manager_status
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'This field is Required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Button section */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
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

export default withStyles(styles)(ViewRequisition)
