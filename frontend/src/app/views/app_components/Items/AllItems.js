import React, { Component } from 'react'

import { Link } from 'react-router-dom'

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
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete'

import ItemServices from '../../../services/ItemServices'
import { withStyles } from '@material-ui/styles'

// const item_structure = {
//     name: '',
//     brand: '',
//     category: '',
//     price: 0,
//     description: '',
//     priceMeasurementUnit: '',
//     image: '',
//     addedUser: '',
// }

const styles = (theme) => ({
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

class AllItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //dialog box
            deleteDialogBox: false,
            deleteDialogData: null,

            //pagination
            rowsPerPage: 10,
            page: 0,

            //table data
            columns: [
                'Name',
                'Brand',
                'Category',
                'Created Time',
                'Updated Time',
            ],
            item_data: [],

            //loading
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

    //Delete Item
    deleteItem = async () => {
        var id = this.state.deleteDialogData
        this.setState({
            deleteDialogBox: false,
            deleteDialogData: null,
        })
        await ItemServices.deleteItemByID(id)
            .then((res) => {
                if (res.data.success) {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: 'Delete Success',
                    })
                    this.componentDidMount();
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

    //get all items from db
    getAllData = async () => {
        await ItemServices.getAllItems()
            .then((res) => {
                if (res != null) {
                    // console.log(res)
                    this.setState({
                        item_data: res.data.items,
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

    componentDidMount() {
        //get all items
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
                                All Items
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
                                            {this.state.item_data
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
                                                            align="left"
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            {item.name}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.brand}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.category}
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
                                                                <>
                                                                    {/* view */}
                                                                    <Tooltip
                                                                        title="View"
                                                                        arrow
                                                                    >
                                                                        <Link
                                                                            to={
                                                                                '/items/view/' +
                                                                                item._id
                                                                            }
                                                                        >
                                                                            <VisibilityIcon color="primary" />
                                                                        </Link>
                                                                    </Tooltip>
                                                                    {/* Edit */}
                                                                    <Tooltip
                                                                        title="Edit"
                                                                        arrow
                                                                    >
                                                                        <Link
                                                                            to={
                                                                                '/items/edit/' +
                                                                                item._id
                                                                            }
                                                                        >
                                                                            <SettingsIcon color="secondary" />
                                                                        </Link>
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
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>

                                    <TablePagination
                                        className="px-4"
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={this.state.item_data.length}
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
                                    onClick={this.deleteItem}
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
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(AllItems)
