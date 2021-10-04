import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import {
    Card,
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
    TablePagination,
    //dialog
    Dialog,
    DialogTitle,
    DialogContent,
} from '@material-ui/core'
import clsx from 'clsx'

import { Alert, Autocomplete } from '@material-ui/lab'

import SimpleCard from 'app/components/cards/SimpleCard'
import PurchaseOrderServices from 'app/services/PurchaseOrderServices'

const styles = (theme) => ({
    productTable: {
        minWidth: 700,
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

class SupplierOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //table data
            loading: true,
            all_orders: [],

            //pagination
            rowsPerPage: 10,
            page: 0,
        }
    }

    //close snackbar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //get data
    getAllOrders = async (id) => {
        await PurchaseOrderServices.getAllPurchaseOrderBySupplier()
            .then((res) => {
                if (res.success) {
                    this.setState({
                        all_orders: res.orders,
                        loading: false,
                    })
                } else {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'warning',
                        snackbar_message: res.message,
                        loading: false,
                    })
                }
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error',
                    loading: false,
                })
            })
    }


    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage,
        })
    }

    handleChangeRowsPerPage = (event) => {
        var rows = +event.target.value
        this.setState({
            page: 0,
            rowsPerPage: rows,
        })
    }

    async componentDidMount() {
        //get user details
        await this.getAllOrders()
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
                        <div
                            style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                            }}
                        >
                            <Typography variant="h5">
                                My - All Purchase Orders
                            </Typography>
                            {/* <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    window.location.href = '/requisition/create'
                                }}
                            >
                                Create New
                            </Button> */}
                        </div>
                        <div className="w-full overflow-auto">
                            <Card elevation={3} className="pt-5 mb-6">
                                <div className="overflow-auto">
                                    <Table
                                        className={clsx(
                                            'whitespace-pre',
                                            classes.productTable
                                        )}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    align="center"
                                                    colSpan={2}
                                                >
                                                    Requisition Title
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    colSpan={2}
                                                >
                                                    Site Name
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    colSpan={2}
                                                >
                                                    Status
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    colSpan={2}
                                                >
                                                    Requested Date
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    colSpan={1}
                                                >
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.all_orders
                                                .slice(
                                                    this.state.page *
                                                        this.state.rowsPerPage,
                                                    this.state.page *
                                                        this.state.rowsPerPage +
                                                        this.state.rowsPerPage
                                                )
                                                .map((row, index) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell
                                                            className="px-0 capitalize"
                                                            colSpan={2}
                                                            align="center"
                                                        >
                                                            <p className="m-0 ml-2">
                                                                {row.title}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell
                                                            className="px-0 capitalize"
                                                            colSpan={2}
                                                            align="center"
                                                        >
                                                            <p className="m-0 ml-2">
                                                                {row.site.name}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell
                                                            className="px-0 capitalize"
                                                            align="center"
                                                            colSpan={2}
                                                        >
                                                            { row.status ===
                                                              'Approved' ? (
                                                                <small className="border-radius-4 bg-secondary text-white px-2 py-2px">
                                                                    Approved.Not Completed
                                                                </small>
                                                            ) : (
                                                                <small className="border-radius-4 bg-green text-white px-2 py-2px">
                                                                    Completed
                                                                </small>
                                                            )}
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-0"
                                                            align="center"
                                                            colSpan={2}
                                                        >
                                                            <small className="border-radius-4 bg-error text-white px-2 py-2px">
                                                                {
                                                                    row.requiredDate
                                                                }
                                                            </small>
                                                        </TableCell>
                                                        <TableCell
                                                            className="px-6"
                                                            colSpan={1}
                                                        >
                                                            <div className="flex">
                                                                <Tooltip
                                                                    title="View"
                                                                    arrow
                                                                >
                                                                    <Link
                                                                        to={`/purchaseOrders/view/${row._id}`}
                                                                    >
                                                                        <IconButton>
                                                                            <Icon color="primary">
                                                                                visibility
                                                                            </Icon>
                                                                        </IconButton>
                                                                    </Link>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        className="px-8"
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={
                                            this.state.all_orders.length
                                        }
                                        rowsPerPage={this.state.rowsPerPage}
                                        page={this.state.page}
                                        backIconButtonProps={{
                                            'aria-label': 'Previous Page',
                                        }}
                                        nextIconButtonProps={{
                                            'aria-label': 'Next Page',
                                        }}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={
                                            this.handleChangeRowsPerPage
                                        }
                                    />
                                </div>
                            </Card>
                        </div>
                    </SimpleCard>
                )}

            </div>
        )
    }
}

export default withStyles(styles)(SupplierOrders)
