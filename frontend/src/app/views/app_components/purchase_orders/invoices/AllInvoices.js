import React, { Component } from 'react'

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Snackbar,
    Tooltip,
    TableContainer,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    CircularProgress,
} from '@material-ui/core'

import { Alert } from '@material-ui/lab'

import SimpleCard from 'app/components/cards/SimpleCard'
import VisibilityIcon from '@material-ui/icons/Visibility'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import DeleteIcon from '@material-ui/icons/Delete'

import { withStyles } from '@material-ui/styles'
import SiteServices from 'app/services/SiteServices'
import DeliveryAdviceNoteServices from 'app/services/DeliveryAdviceNoteServices'
import InvoiceServices from 'app/services/InvoiceServices'

const styles = (theme) => ({
    //loading screen progress
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})
class AllInvoices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //pagination
            rowsPerPage: 10,
            page: 0,

            //table data
            columns: [
                'Invoice',
                'Total Amount',
                'Paid',
                'Created Time',
            ],
            invoices: [],
            loading: true,
        }
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

    //close snackbar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //get all sites from db
    getAllData = async () => {
        await InvoiceServices.getAllInvoicesBySupplierID()
            .then((res) => {
                console.log(res)
                if (res.success) {
                    console.log(res)
                    this.setState({
                        invoices: res.invoices,
                        loading: false,
                    })
                } else {
                    this.setState({
                        loading: false,
                        snackbar: true,
                        snackbar_severity: 'warning',
                        snackbar_message: 'No Data Found!',
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    loading: false,
                })
            })
    }

    //view user details dialog box
    openDialogBox = (user) => {
        this.setState({
            dialog_data: user,
            dialogbox: true,
        })
    }

    componentDidMount() {
        //get all sites
        this.getAllData()
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <div className="m-sm-30">
                    {this.state.loading ? (
                        <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                        />
                    ) : (
                        <SimpleCard>
                            <Typography className="" variant="h4">
                                My - All Invoices
                            </Typography>
                            <div className="w-full overflow-auto">
                                <TableContainer
                                    className="px-5 px-5"
                                    component={Paper}
                                >
                                    <Table
                                        stickyHeader
                                        style={{
                                            minWidth: '800px',
                                            marginTop: 20,
                                        }}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                {this.state.columns.map(
                                                    (row, key) => (
                                                        <TableCell
                                                            key={key}
                                                            align="center"
                                                        >
                                                            {row}
                                                        </TableCell>
                                                    )
                                                )}
                                                <TableCell align="center">
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.invoices
                                                .slice(
                                                    this.state.page *
                                                        this.state.rowsPerPage,
                                                    this.state.page *
                                                        this.state.rowsPerPage +
                                                        this.state.rowsPerPage
                                                )
                                                .map((item, index) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell
                                                            align="center"
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            {
                                                                item._id
                                                            }
                                                        </TableCell>
                                                        <TableCell align="center">
                                                                {item.totalAmount}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <small className="px-2 py-4px bg-light-error text-error border-radius-4">
                                                                {item.isPaid ? "Yes" : "No"}
                                                            </small>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.createdAt.split(
                                                                'T',
                                                                1
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {/* view */}
                                                            <Tooltip
                                                                title="View"
                                                                arrow
                                                            >
                                                                <VisibilityIcon
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        window.open(
                                                                            `/invoices/view/${item._id}`
                                                                        )
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>

                                    <TablePagination
                                        className="px-4"
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={this.state.invoices.length}
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
                                </TableContainer>
                            </div>
                        </SimpleCard>
                    )}

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
            </div>
        )
    }
}

export default withStyles(styles)(AllInvoices)
