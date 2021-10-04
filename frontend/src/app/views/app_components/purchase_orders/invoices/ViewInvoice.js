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

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import SimpleCard from 'app/components/cards/SimpleCard'
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

const delivery_data = {
    purchaseOrder: '',
    delivered_items: [],
    signedBy: '',
    status: '',
}

class ViewInvoice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //table data
            loading: true,
            invoice_id: '',
            invoice_data: delivery_data,
            items: [],

            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',
        }
    }

    //close snack bar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //get data
    getInvoiceByID = async (id) => {
        await InvoiceServices.getInvoiceByID(id)
            .then(async (res) => {
                console.log(res)

                this.setState({
                    loading: false,
                    items: res.invoice.ordered_items,
                    invoice_data: res.invoice,
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
            invoice_id: id,
        })

        //get requisition  details
        await this.getInvoiceByID(id)
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
                                        View Invoice
                                    </Typography>
                                </Grid>

                                {/* Section 1 - all ordered items */}
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <div className="text-center mt-10">
                                        <img
                                            src="/assets/images/invoiceView.svg"
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
                                    md={6}
                                    lg={6}
                                    className="my-5"
                                >
                                    <Typography
                                        variant="h5"
                                        className="mx-2 mt-5"
                                    >
                                        Delivery Details
                                    </Typography>
                                    <div className="overflow-auto">
                                        <Table className="my-4">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Purchase Order
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            className="text-primary px-2 py-2 hover-bg-secondary"
                                                            to={`/purchaseOrders/view/${this.state.invoice_data.purchaseOrder}`}
                                                        >
                                                            Purchase Order
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Total Amount
                                                    </TableCell>
                                                    <TableCell>
                                                        {'Rs.' +
                                                            this.state
                                                                .invoice_data
                                                                .totalAmount}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell className="pl-4">
                                                        Created Date
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            this.state
                                                                .invoice_data
                                                                .createdAt
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Grid>

                                {/* Section 2 - Delivered items */}
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
                                                        Price
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={3}
                                                    >
                                                        Qty
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-0"
                                                        colSpan={3}
                                                    >
                                                        Sub Total
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
                                                                colSpan={3}
                                                            >
                                                                {row.price}
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
                                                            <TableCell
                                                                className="px-0 capitalize"
                                                                align="left"
                                                                colSpan={3}
                                                            >
                                                               Rs.{row.sub_total}
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

export default withStyles(styles)(ViewInvoice)
