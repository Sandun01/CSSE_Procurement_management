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

import UserServices from '../../../services/UserServices'
import SimpleCard from 'app/components/cards/SimpleCard'
import VisibilityIcon from '@material-ui/icons/Visibility'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import DeleteIcon from '@material-ui/icons/Delete'

import { withStyles } from '@material-ui/styles'

const user_data = {
    name: '',
    email: '',
    role: '',
    address: '',
    contactNumber: '',
}

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
class ViewAllUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //dialog box
            dialog_data: user_data,
            dialogbox: false,

            deleteDialogBox: false,
            deleteDialogData: null,

            //pagination
            rowsPerPage: 10,
            page: 0,

            //table data
            columns: ['Name', 'Email', 'Role', 'Created Time', 'Updated Time'],
            user_data: [],
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

    //delete user
    deleteUser = async () => {
        var id = this.state.deleteDialogData

        this.setState({
            deleteDialogBox: false,
            deleteDialogData: null,
        })

        await UserServices.deletesSerByID(id)
            .then((res) => {
                if (res.success) {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: 'Delete Success',
                    })

                    this.componentDidMount()
                } else {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: 'Delete Failed',
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //get all users from db
    getAllData = async () => {
        await UserServices.getAllUsers()
            .then((res) => {
                if (res != null) {
                    // console.log(res)
                    this.setState({
                        user_data: res,
                        loading: false,
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

    //close user details dialog box
    closeDialogBox = () => {
        this.setState({
            dialogbox: false,
            dialog_data: user_data,
        })
    }

    componentDidMount() {
        //get all users
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
                                All Users
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
                                            {this.state.user_data
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
                                                            {item.name}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.email}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.role}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.createdAt.split(
                                                                'T',
                                                                1
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.updatedAt.split(
                                                                'T',
                                                                1
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {/* delete */}
                                                            {item.email !==
                                                            'superadmin@gmail.com' ? (
                                                                <>
                                                                    {/* view */}
                                                                    <Tooltip
                                                                        title="View"
                                                                        arrow
                                                                    >
                                                                        <VisibilityIcon
                                                                            color="primary"
                                                                            onClick={() =>
                                                                                this.openDialogBox(
                                                                                    item
                                                                                )
                                                                            }
                                                                        />
                                                                    </Tooltip>
                                                                    {/* delete */}
                                                                    <Tooltip
                                                                        title="Delete"
                                                                        arrow
                                                                    >
                                                                        <DeleteIcon
                                                                            color="error"
                                                                            onClick={() =>
                                                                                this.setState(
                                                                                    {
                                                                                        deleteDialogBox: true,
                                                                                        deleteDialogData:
                                                                                            item._id,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </Tooltip>
                                                                </>
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        color: '#A90000',
                                                                    }}
                                                                >
                                                                    <b>ADMIN</b>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>

                                    <TablePagination
                                        className="px-4"
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={this.state.user_data.length}
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

                    {/* Delete confirm dialog box */}
                    <Dialog open={this.state.deleteDialogBox}>
                        <DialogTitle>
                            Are you sure you want to delete this item?
                        </DialogTitle>
                        <DialogContent>
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    className="m-2"
                                    color="primary"
                                    variant="contained"
                                    onClick={this.deleteUser}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    className="m-2"
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => {
                                        this.setState({
                                            deleteDialogBox: false,
                                        })
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* View data dialog box */}
                    <Dialog open={this.state.dialogbox}>
                        <div className="text-right mr-5 mt-5">
                            <HighlightOffIcon onClick={this.closeDialogBox} />
                        </div>

                        <DialogTitle className="text-center">
                            <Typography variant="h4">User Details</Typography>
                        </DialogTitle>

                        <DialogContent>
                            <Table className="mb-4">
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="pl-4">
                                            Name
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                {this.state.dialog_data.name}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="pl-4">
                                            Email
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                {this.state.dialog_data.email}
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
                                                    this.state.dialog_data
                                                        .contactNumber
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
                                                {this.state.dialog_data.address}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="pl-4">
                                            Role
                                        </TableCell>
                                        <TableCell>
                                            <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                                                {this.state.dialog_data.role}
                                            </small>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ViewAllUsers)
