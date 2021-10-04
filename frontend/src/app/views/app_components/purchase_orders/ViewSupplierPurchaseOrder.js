import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardActionArea,
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

class ViewSupplierPurchaseOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //table data
            loading: true,
            order_data: ord_data,

            order_id: '',
            items: [],
            site: [],
            siteManager: '',
            company: {},

            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //dialog box
            dialogBox_data: '',
            dialogBox: false,

            //delivery note
            delivered_notes: [],

            //all invoices
            invoices_all: [],
        }
    }

    //navigate to item page
    viewItem = (itemData) => {
        // console.log(itemData)
        window.location.href = `/items/view/${itemData.item._id}`
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

                if (res.success) {
                    var allOrders = res.Order

                    this.setState({
                        order_data: allOrders,
                        loading: false,
                        items: allOrders.orderItems,
                        site: allOrders.site,
                        company: allOrders.companyDetails,
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

    //get delivery notes
    getAllDeliveryNotes = async (id) => {
        await DeliveryAdviceNoteServices.getDeliveryNotesByOrderID(id)
            .then(async (res) => {
                console.log(res.data)

                this.setState({
                    loading: false,
                    delivered_notes: res.data.notes,
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

    async componentDidMount() {
        var id = this.props.match.params.id

        this.setState({
            order_id: id,
        })

        //get requisition  details
        await this.getRequisitionByID(id)

        //get all delivery notes
        await this.getAllDeliveryNotes(id)

        //get all invoices
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
                                    <Typography variant="h4">
                                        Purchase Order
                                    </Typography>
                                    <Button
                                        className="hover-bg-secondary m-5"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            window.location.href = `/delivery_advice_notes/create/${this.state.order_id}`
                                        }}
                                    >
                                        Create Delivery Note
                                    </Button>
                                    <Button
                                        className="hover-bg-green m-5"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            window.location.href = `/invoices/create/${this.state.order_id}`
                                        }}
                                    >
                                        Create Invoice
                                    </Button>
                                </Grid>

                                {/* Section 1 - site details*/}
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Typography
                                        variant="h5"
                                        className="mx-2 mt-5"
                                    >
                                        Site Details
                                    </Typography>
                                    <Card elevation={3} className="m-2">
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
                                                                    .order_data
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
                                                        {this.state.order_data
                                                            .status ===
                                                        'Approved' ? (
                                                            <small className="border-radius-4 bg-green text-white px-2 py-2px">
                                                                Approved
                                                            </small>
                                                        ) : (
                                                            <small className="border-radius-4 bg-green text-white px-2 py-2px">
                                                                Completed
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
                                                                    .order_data
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

                                {/* section 2 - Company details */}
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Typography
                                        variant="h5"
                                        className="mx-2 mt-5"
                                    >
                                        Company Details
                                    </Typography>
                                    <Card elevation={3} className="m-2">
                                        <Table className="my-4">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Company Name
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state
                                                                    .company
                                                                    .name
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Address
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state
                                                                    .company
                                                                    .address
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Email
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state
                                                                    .company
                                                                    .email
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Contact Number
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                this.state
                                                                    .company
                                                                    .contactNumber
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </Grid>

                                {/* Section 3 - ordered items */}
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
                                                        Units
                                                    </TableCell>

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
                                                                {
                                                                    row.qty_measurement_unit
                                                                }
                                                            </TableCell>

                                                            <TableCell
                                                                className="px-0"
                                                                colSpan={2}
                                                            >
                                                                <small className="px-1 py-4px bg-secondary text-white border-radius-4">
                                                                    {
                                                                        row.received_qty
                                                                    }
                                                                </small>
                                                            </TableCell>
                                                            <TableCell
                                                                className="px-0"
                                                                colSpan={2}
                                                            >
                                                                {row.site_manager_status ===
                                                                'Completed' ? (
                                                                    <small className="px-1 py-4px bg-green text-white border-radius-4">
                                                                        {
                                                                            row.site_manager_status
                                                                        }
                                                                    </small>
                                                                ) : row.site_manager_status ===
                                                                  'Incomplete' ? (
                                                                    <small className="px-1 py-4px bg-error text-white border-radius-4">
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
                                                                colSpan={2}
                                                            >
                                                                <Tooltip
                                                                    title="View"
                                                                    arrow
                                                                >
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            this.viewItem(
                                                                                row
                                                                            )
                                                                        }
                                                                    >
                                                                        <Icon color="primary">
                                                                            visibility
                                                                        </Icon>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Grid>
                                {/* Section 4 - Delivered items */}
                                {this.state.delivered_notes.length > 0 && (
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
                                                                        This
                                                                        order
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
                                                                    {
                                                                        row.createdAt
                                                                    }
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
                                )}

                                {/* Section 5 - Invoice */}
                                {this.state.invoices_all.length > 0 && (
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
                                                                            {
                                                                                key
                                                                            }
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
                                )}
                            </Grid>
                        </div>
                    </SimpleCard>
                )}

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

export default withStyles(styles)(ViewSupplierPurchaseOrder)
