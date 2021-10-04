import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import clsx from 'clsx'
import {
    Grid,
    Snackbar,
    Button,
    Typography,
    Fab,
    Icon,
    Card,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
} from '@material-ui/core'

import { Alert, Autocomplete } from '@material-ui/lab'

import { SimpleCard } from '../../../components'
import { item_categories } from '../../../../appData'

import ItemServices from '../../../services/ItemServices'

const styles = (theme) => ({
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        padding: 10,
    },
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

    //progress loading icon
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

const form_data = {
    _id: '',
    name: '',
    brand: '',
    category: '',
    price: 0,
    description: '',
    priceMeasurementUnit: '',
    images: [],
    addedUser: '',
    updatedUser: '',
}

class EditItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //data
            formData: form_data,

            //dialog box
            dialogbox: false,
            dialogbox_message: '',
            dialogbox_severity: 'success',

            loading: true,
        }
    }

    //set input files value
    handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value

        var data = this.state.formData

        data[name] = value

        this.setState({
            formData: data,
        })

        console.log(this.state)
    }

    //set autocomplete value
    setSelectedValue = (e, v) => {
        var data = this.state.formData

        data[e] = v

        this.setState({
            formData: data,
        })

        console.log(this.state)
    }

    //close snackbar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //form submit
    formSubmit = async (e) => {
        var data = this.state.formData

        await this.editItemData(data)
    }

    //upload item data to database
    editItemData = async (data) => {
        console.log('edit item data ===========', data)
        await ItemServices.updateItem(data)
            .then((res) => {
                // console.log(res)
                if (res.status === 200 || res.data.success) {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: 'Item Edited Successfully!',
                        dialogbox: true,
                        dialogbox_message: 'Item Details Edited Successfully!',
                        dialogbox_severity: 'success',
                    })
                } else {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: res.data.message,
                        dialogbox: true,
                        dialogbox_message: 'Error!' + res.data.message,
                        dialogbox_severity: 'error',
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error',
                    dialogbox: true,
                    dialogbox_message: 'Error! Please Try again.',
                    dialogbox_severity: 'error',
                })
            })
    }

    //close user details dialog box
    closeDialogBox = () => {
        this.setState({
            dialogbox: false,
        })
        window.location.reload(false)
    }

    async loadItemData(id) {
        await ItemServices.getItemById(id)
            .then((res) => {
                if (res.data.success) {
                    var item = res.data.item
                    this.setState({
                        formData: item,
                        loading: false,
                    })
                    // console.log(this.state)
                } else {
                    this.setState({
                        loading: false,
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({
                    loading: false,
                })
            })
    }

    navigateToView = () => {
        window.location.href = `/items/all`
    }

    async componentDidMount() {
        var id = this.props.match.params.id

        await this.loadItemData(id)
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
                                Edit Item Details : {this.state.formData.name}
                            </Typography>
                            <div className="w-full overflow-auto mt-5">
                                {/* Form */}
                                <ValidatorForm
                                    onSubmit={this.formSubmit}
                                    className={classes.formContainer}
                                >
                                    <Grid
                                        container
                                        spacing={2}
                                        className={classes.bodyContent}
                                    >
                                        {/* section 1 */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={6}
                                            lg={6}
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
                                                    Item Name
                                                    <TextValidator
                                                        className="mt-2"
                                                        placeholder="Item Name"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        type="text"
                                                        name="name"
                                                        value={
                                                            this.state.formData
                                                                .name
                                                        }
                                                        onChange={(e) =>
                                                            this.handleChange(e)
                                                        }
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'Item Name is required!',
                                                        ]}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Item Brand
                                                    <TextValidator
                                                        className="mt-2"
                                                        placeholder="Item Brand"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        type="text"
                                                        name="brand"
                                                        value={
                                                            this.state.formData
                                                                .brand
                                                        }
                                                        onChange={(e) =>
                                                            this.handleChange(e)
                                                        }
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'Item Brand is required!',
                                                        ]}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Item Description
                                                    <TextValidator
                                                        className="mt-2"
                                                        placeholder="Item Description"
                                                        variant="outlined"
                                                        size="small"
                                                        multiline
                                                        rows={8}
                                                        fullWidth
                                                        type="text"
                                                        name="description"
                                                        value={
                                                            this.state.formData
                                                                .description
                                                        }
                                                        onChange={(e) =>
                                                            this.handleChange(e)
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* section 2 */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={6}
                                            lg={6}
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
                                                    Item Category
                                                    <Autocomplete
                                                        className="w-full"
                                                        options={
                                                            item_categories
                                                        }
                                                        getOptionLabel={(opt) =>
                                                            opt.value
                                                        }
                                                        name="category"
                                                        size="small"
                                                        value={{
                                                            value: this.state
                                                                .formData
                                                                .category,
                                                        }}
                                                        onChange={(e, v) =>
                                                            this.setSelectedValue(
                                                                'category',
                                                                v == null
                                                                    ? null
                                                                    : v.value
                                                            )
                                                        }
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextValidator
                                                                {...params}
                                                                variant="outlined"
                                                                className={
                                                                    classes.textStyles
                                                                }
                                                                value={
                                                                    this.state
                                                                        .formData
                                                                        .category
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'Item Category is required!',
                                                                ]}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    Item Price Measurement Unit
                                                    <TextValidator
                                                        className="mt-2"
                                                        placeholder="Item Measurement Unit"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        type="text"
                                                        name="priceMeasurementUnit"
                                                        value={
                                                            this.state.formData
                                                                .priceMeasurementUnit
                                                        }
                                                        onChange={(e) =>
                                                            this.handleChange(e)
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    Item Price
                                                    <TextValidator
                                                        className="mt-2"
                                                        placeholder="Item Price"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        type="number"
                                                        name="price"
                                                        value={
                                                            this.state.formData
                                                                .price
                                                        }
                                                        onChange={(e) =>
                                                            this.handleChange(e)
                                                        }
                                                        validators={[
                                                            'minNumber:0',
                                                        ]}
                                                        errorMessages={[
                                                            'Please Enter Valid Price',
                                                        ]}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <div className="flex-column justify-center items-center">
                                                        <div className="flex justify-center items-center">
                                                            {this.state.formData.images.map(
                                                                (imgUrl) => (
                                                                    <img
                                                                        className={clsx(
                                                                            {
                                                                                'w-80 mx-2 p-2 border-radius-4': true,
                                                                                [classes.imageBorder]:
                                                                                    this
                                                                                        .selectedImage ===
                                                                                    imgUrl,
                                                                            }
                                                                        )}
                                                                        src={
                                                                            imgUrl
                                                                        }
                                                                        alt="item"
                                                                        key={
                                                                            imgUrl
                                                                        }
                                                                        onClick={() =>
                                                                            window.open(imgUrl)
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
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
                                                    className="mt-2 p-2 mx-2"
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() =>
                                                        this.navigateToView()
                                                    }
                                                    size="small"
                                                >
                                                    Back To View
                                                </Button>
                                                <Button
                                                    className="mt-2 p-2"
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    size="small"
                                                >
                                                    Edit Item
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
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

                    {/* Dialog box */}
                    <Dialog open={this.state.dialogbox}>
                        <DialogTitle className="text-center">
                            <Typography variant="h5">
                                Item Details Progress
                            </Typography>
                        </DialogTitle>

                        <DialogContent>
                            <div>
                                <Alert severity={this.state.dialogbox_severity}>
                                    <Typography variant="body2">
                                        {this.state.dialogbox_message}
                                    </Typography>
                                </Alert>
                            </div>

                            <div className="text-center">
                                <Button
                                    className="my-2"
                                    color="primary"
                                    variant="contained"
                                    onClick={this.closeDialogBox}
                                    disabled={
                                        this.state.dialogbox_severity === 'info'
                                            ? true
                                            : false
                                    }
                                >
                                    OK
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(EditItems)
