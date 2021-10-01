import React, { Component } from 'react'

import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    CardActions,
    Icon,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    MenuItem,
    Select,
    Typography,
    CircularProgress,
    Grid,
    Button,
    Snackbar,
    InputBase,
    TablePagination,
    //dialog
    Dialog,
    DialogTitle,
    DialogContent,
} from '@material-ui/core'

import clsx from 'clsx'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Alert, Autocomplete } from '@material-ui/lab'

import { withStyles } from '@material-ui/styles'

import SearchIcon from '@material-ui/icons/Search'

import ItemServices from '../../../services/ItemServices'
import PurchaseOrderServices from 'app/services/PurchaseOrderServices'
import { Tooltip } from '@material-ui/core'

const styles = (theme) => ({
    // Transition
    bodyContent: {
        opacity: 1,
        animation: '$customFade 1.3s linear',
    },
    '@keyframes customFade': {
        '0%': {
            opacity: 0,
        },
        '100%': {
            opacity: 1,
        },
    },

    //card
    card_root: {
        maxWidth: 300,
        minHeight: 290,
        margin: 10,
    },
    card_media: {
        height: 140,
    },
})

const requisition_item_data = {
    item: '',
    qty_measurement_unit: '',
    requested_qty: 0,
}

class RequisitionItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //requisition data
            requisition_data: {},

            //ordered items
            orderedItems: [],

            //items
            items_all: [],

            //pagination
            rowsPerPage: 3,
            page: 0,

            //searchbar
            searchTerm: '',

            //dialog box
            dialogBox: false,
            dialogBox_data: {},
            operationMethod_dialogBox: '',

            // form data
            formData: requisition_item_data,
            requisitionOrder_DdbId: '',
            delete_dialogBox: false,
        }
    }

    //close snackbar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    handleChangeSearch = (e) => {
        var val = e.target.value
        this.setState({
            searchTerm: val,
        })
    }

    //start pagination
    handleChangeRowsPerPage = (event) => {
        var rows = +event.target.value
        this.setState({
            page: 0,
            rowsPerPage: rows,
        })
    }
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage,
        })
    }
    //End pagination

    //form data input field
    formData_handleChange = (e) => {
        var data = this.state.formData
        var name = e.target.name
        var value = e.target.value

        data[name] = value

        this.setState({
            formData: data,
        })
        console.log(this.state)
    }

    //dialog box controller
    dialogBoxController = (e) => {
        var val = this.state.operationMethod_dialogBox

        if (val === 'Add') {
            this.addItemToRequisition()
        } else if (val === 'Edit') {
            this.editRequisitionItemDetails()
        } else {
            this.setState({
                snackbar: true,
                snackbar_severity: 'warning',
                snackbar_message:
                    'Dialog BoxForm Controller Option Not Defined!',
            })
        }
    }

    //open add dialog box and set data
    setDialogBoxData = (item) => {
        this.setState({
            dialogBox: true,
            dialogBox_data: item,
            operationMethod_dialogBox: 'Add',
        })
    }

    //open edit dialog box and set data
    setEditDialogBoxData = (data) => {
        console.log(data)

        var item_data = data.item
        var f_data = {
            item: data.item._id,
            qty_measurement_unit: data.qty_measurement_unit,
            requested_qty: data.requested_qty,
        }

        this.setState({
            dialogBox: true,
            dialogBox_data: item_data,
            formData: f_data,
            requisitionOrder_DdbId: data._id,
            operationMethod_dialogBox: 'Edit',
        })
    }

    //open delete dialog box and set data
    setDeleteDialogBoxData = (data) => {
        console.log(data)

        this.setState({
            delete_dialogBox: true,
            requisitionOrder_DdbId: data._id,
            operationMethod_dialogBox: 'Delete',
        })
    }

    //delete item in requisition
    deleteRequisitionItem = async () => {
        var id = this.state.requisition_data._id

        var form_data = {
            orderItemDbId: this.state.requisitionOrder_DdbId,
        }

        console.log(form_data)

        await PurchaseOrderServices.deleteItemInRequisition(form_data, id)
            .then((res) => {
                console.log(res.data)

                this.setState({
                    delete_dialogBox: false,
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: res.data.message,
                })

                setTimeout(() => {
                    window.location.reload(false)
                }, 1000)
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    delete_dialogBox: false,
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Error! Please try again later`,
                })
            })
    }

    //edit item data in requisition
    editRequisitionItemDetails = async () => {
        // console.log('editItemDetailsInRequisition')

        var data = this.state.formData
        var id = this.state.requisition_data._id

        var form_data = {
            orderItemDbId: this.state.requisitionOrder_DdbId,
            qtyUnit: data.qty_measurement_unit,
            reqQty: data.requested_qty,
        }

        console.log(form_data)

        await PurchaseOrderServices.editItemDetailsInRequisition(form_data, id)
            .then((res) => {
                console.log(res)

                if (res.data.success) {
                    this.setState({
                        dialogBox: false,
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: res.data.message,
                    })
                } else {
                    this.setState({
                        dialogBox: false,
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: res.data.message,
                    })
                }
                setTimeout(() => {
                    window.location.reload(false)
                }, 1000)
            })
            .catch((error) => {
                this.setState({
                    dialogBox: false,
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Error! Please try again later`,
                })
            })
    }

    //add data to requisition
    addItemToRequisition = async () => {
        // console.log('addItemToRequisition')

        var data = this.state.formData
        var item_id = this.state.dialogBox_data._id
        data['item'] = item_id

        var id = this.state.requisition_data._id

        console.log(data)

        await PurchaseOrderServices.addItemToRequisition(data, id)
            .then((res) => {
                this.setState({
                    dialogBox: false,
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: res.data.message,
                })
                setTimeout(() => {
                    window.location.reload(false)
                }, 1000)
            })
            .catch((error) => {
                this.setState({
                    dialogBox: false,
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Error! Please try again later`,
                })
            })
    }

    //get all items
    getAllItems = async () => {
        await ItemServices.getAllItems()
            .then((res) => {
                // console.log(res)
                var items = res.data.items
                if (items) {
                    this.setState({
                        items_all: items,
                    })
                } else {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'warning',
                        snackbar_message: `Item data not found`,
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Item data loading Failed`,
                })
            })

        // console.log(this.state)
    }

    async componentDidMount() {
        //load data from parent component
        var data = this.props.data

        this.setState({
            requisition_data: data,
            orderedItems: data.orderItems,
        })

        //get all items
        await this.getAllItems()
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.bodyContent}>
                <Card elevation={1} className="p-5 mb-5">
                    <Typography className="m-2" variant="h5">
                        Ordered Items
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
                                    <TableCell className="px-6" colSpan={4}>
                                        Item Name
                                    </TableCell>
                                    <TableCell className="px-0" colSpan={2}>
                                        Requested Quantity
                                    </TableCell>
                                    <TableCell className="px-0" colSpan={2}>
                                        Quantity Measurement Unit
                                    </TableCell>
                                    <TableCell className="px-0" colSpan={1}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.orderedItems.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell
                                            className="px-0 capitalize"
                                            colSpan={4}
                                            align="left"
                                        >
                                            <div className="flex items-center">
                                                <Avatar
                                                    src={
                                                        row.item.images.length >
                                                            0 &&
                                                        row.item.images[0]
                                                    }
                                                />
                                                <p className="m-0 ml-8">
                                                    {row.item.name}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            className="px-0 capitalize"
                                            align="left"
                                            colSpan={2}
                                        >
                                            {row.requested_qty}
                                        </TableCell>
                                        <TableCell
                                            className="px-0 capitalize"
                                            align="left"
                                            colSpan={2}
                                        >
                                            {row.qty_measurement_unit}
                                        </TableCell>
                                        <TableCell className="px-0" colSpan={1}>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton
                                                    onClick={() =>
                                                        this.setEditDialogBoxData(
                                                            row
                                                        )
                                                    }
                                                >
                                                    <Icon color="primary">
                                                        edit
                                                    </Icon>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" arrow>
                                                <IconButton
                                                    onClick={() =>
                                                        this.setDeleteDialogBoxData(
                                                            row
                                                        )
                                                    }
                                                >
                                                    <Icon color="error">
                                                        delete_forever
                                                    </Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                <Card elevation={6} className="p-5 my-5">
                    <Typography className="m-2" variant="h5">
                        Browse Items
                    </Typography>
                    <div className="overflow-auto">
                        <Grid container>
                            {/* ----------------- Search bar ---------------------*/}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Grid>
                                    <div
                                        style={{
                                            display: 'flex',
                                            border: '1px solid #D1D1D1',
                                            borderRadius: 10,
                                            padding: 3,
                                            width: '240px',
                                            float: 'right',
                                        }}
                                    >
                                        <InputBase
                                            placeholder="Search…"
                                            fullWidth
                                            name="searchTerm"
                                            value={this.state.searchTerm}
                                            onChange={(e) =>
                                                this.handleChangeSearch(e)
                                            }
                                            inputProps={{
                                                'aria-label': 'search',
                                            }}
                                        />
                                        <div className="p-2">
                                            <SearchIcon color="primary" />
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                            {/* ----------------- Items ----------------- */}
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                className="mt-5"
                            >
                                <Grid container>
                                    {this.state.items_all
                                        .filter((item) => {
                                            if (this.state.searchTerm === '') {
                                                // console.log('search val' + item)
                                                return item
                                            } else if (
                                                item.name
                                                    .toLowerCase()
                                                    .includes(
                                                        this.state.searchTerm.toLowerCase()
                                                    ) ||
                                                item.brand
                                                    .toLowerCase()
                                                    .includes(
                                                        this.state.searchTerm.toLowerCase()
                                                    ) ||
                                                item.category
                                                    .toLowerCase()
                                                    .includes(
                                                        this.state.searchTerm.toLowerCase()
                                                    )
                                            ) {
                                                return item
                                            }
                                        })
                                        .slice(
                                            this.state.page *
                                                this.state.rowsPerPage,
                                            this.state.page *
                                                this.state.rowsPerPage +
                                                this.state.rowsPerPage
                                        )
                                        .map((item, key) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                lg={4}
                                                key={key}
                                            >
                                                <Card
                                                    className={
                                                        classes.card_root
                                                    }
                                                    elevation={4}
                                                >
                                                    <CardActionArea
                                                        onClick={() => {
                                                            window.location.href = `/items/view/${item._id}`
                                                        }}
                                                    >
                                                        <CardMedia
                                                            className={
                                                                classes.card_media
                                                            }
                                                            image={
                                                                item.images
                                                                    .length > 0
                                                                    ? item
                                                                          .images[0]
                                                                    : '/assets/images/imageNotFound.png'
                                                            }
                                                            title={item.name}
                                                        />
                                                        <CardContent>
                                                            <Typography
                                                                gutterBottom
                                                                variant="body2"
                                                                component="h2"
                                                            >
                                                                {item.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                                component="p"
                                                            >
                                                                Category :{' '}
                                                                {item.category}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                                component="p"
                                                            >
                                                                Brand :{' '}
                                                                {item.brand}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                    <CardActions>
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                                width: '100%',
                                                                marginTop: 2,
                                                                marginBottom: 5,
                                                            }}
                                                        >
                                                            <Button
                                                                size="small"
                                                                color="primary"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    this.setDialogBoxData(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                Add to
                                                                Requisition
                                                            </Button>
                                                        </div>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))}
                                </Grid>

                                <Grid>
                                    <TablePagination
                                        className="px-4"
                                        rowsPerPageOptions={[3, 6, 9]}
                                        component="div"
                                        count={this.state.items_all.length}
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Card>

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

                {/* Delete dialog box */}
                <div>
                    <Dialog open={this.state.delete_dialogBox}>
                        <DialogTitle className="text-center">
                            Are you sure you want to delete this item from
                            requisition?
                        </DialogTitle>
                        <DialogContent>
                            <div
                                style={{
                                    textAlign: 'right',
                                }}
                            >
                                <Button
                                    className="mt-2 m-2"
                                    variant="contained"
                                    style={{
                                        backgroundColor: '#AD0000',
                                        color: '#fff',
                                    }}
                                    size="small"
                                    onClick={this.deleteRequisitionItem}
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
                                            delete_dialogBox: false,
                                        })
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Add item dialog box */}
                <div>
                    <Dialog open={this.state.dialogBox}>
                        <DialogTitle className="text-center">
                            {this.state.operationMethod_dialogBox} / Modify
                            Requisition Data
                        </DialogTitle>
                        <DialogContent>
                            {/* Form */}
                            <ValidatorForm onSubmit={this.dialogBoxController}>
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
                                                            .dialogBox_data.name
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
                                            </Grid>

                                            <Grid item xs={12}>
                                                Quantity Measurement Unit
                                                <TextValidator
                                                    className="mt-2"
                                                    placeholder="Quantity Measurement Unit"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    type="text"
                                                    name="qty_measurement_unit"
                                                    value={
                                                        this.state.formData
                                                            .qty_measurement_unit
                                                    }
                                                    onChange={(e) =>
                                                        this.formData_handleChange(
                                                            e
                                                        )
                                                    }
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'This field is Required',
                                                    ]}
                                                />
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
                                                    name="requested_qty"
                                                    value={
                                                        this.state.formData
                                                            .requested_qty
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
            </div>
        )
    }
}

export default withStyles(styles)(RequisitionItems)
