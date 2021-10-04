import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'

import { storage } from '../../../services/FirebaseServices'

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
} from '@material-ui/core'

import { Alert, Autocomplete } from '@material-ui/lab'

import { SimpleCard, MatxProgressBar } from '../../../components'
import { item_categories } from '../../../../appData'

import ItemServices from '../../../services/ItemServices'

const styles = (theme) => ({
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        padding: 10,
    },
})

const form_data = {
    name: '',
    brand: '',
    category: '',
    price: 0,
    description: '',
    priceMeasurementUnit: '',
    images: [],
    addedUser: '',
}

class AddNewItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //data
            formData: form_data,

            //file upload
            files: [],
            image_urls: [],
            dargClass: '',
            uploadProgress: 0,
            dialogbox: false,
            dialogbox_message: '',
            dialogbox_severity: 'success',
        }
    }

    //file upload section starts ---------------------
    handleFileSelect = (event) => {
        let files = event.target.files
        let list = []

        for (const iterator of files) {
            list.push({
                file: iterator,
            })
        }
        this.setState({
            files: list,
        })
        console.log(this.state)
    }

    //file remove from queue
    handleSingleRemove = (index) => {
        let tempList = [...this.state.files]
        tempList.splice(index, 1)
        this.setState({
            files: tempList,
        })
    }

    handleFileUploadFirebase = () => {
        const images = this.state.files
        const promises = []

        images.map((image) => {
            const date = Date.now()
            const uploadTask = storage
                .ref(`itemImages/img_${date}`)
                .put(image.file)

            promises.push(uploadTask)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    //progress
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                    console.log(progress)
                    this.setState({
                        uploadProgress: progress,
                    })
                },
                (error) => {
                    console.log(error)
                },
                async () => {
                    await storage
                        .ref('itemImages')
                        .child(`img_${date}`)
                        .getDownloadURL()
                        .then((url) => {
                            var arr = this.state.image_urls
                            arr.push(url)
                            this.setState({
                                image_urls: arr,
                            })
                            // console.log(
                            //     url,
                            //     '++++iiiiiiiiiiiiiiiiiiiiiiiiiiii++++'
                            // )
                        })
                }
            )
        })

        Promise.all(promises)
            .then(() => {
                var data = this.state.formData
                data['images'] = this.state.image_urls
                // console.log(data, "===========")

                this.setState({
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: 'Image Files Uploaded!',
                })

                setTimeout(() => {
                    this.addItemData(data)
                }, 800)
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error! Please Try again.',
                })
            })
    }

    //file upload section ends ---------------------

    //set input files value
    handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value

        var data = this.state.formData

        data[name] = value

        this.setState({
            formData: data,
        })

        // console.log(this.state)
    }

    //set autocomplete value
    setSelectedValue = (e, v) => {
        var data = this.state.formData

        data[e] = v

        this.setState({
            formData: data,
        })

        // console.log(this.state)
    }

    //close snackbar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //form submit
    formSubmit = async (e) => {
        var files = this.state.files
        var data = this.state.formData

        //open dialog boc
        this.setState({
            dialogbox: true,
            dialogbox_message: 'Please Wait. Details are Uploading...',
            dialogbox_severity: 'info',
        })

        if (files.length > 0) {
            //upload files
            this.handleFileUploadFirebase()
        } else {
            //add data
            await this.addItemData(data)
        }
    }

    //upload item data to database
    addItemData = async (data) => {
        // console.log('add item data ===========', data)
        await ItemServices.addNewItem(data)
            .then((res) => {
                // console.log(res)
                if (res.status === 201) {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: 'Item Added Successfully!',
                        uploadProgress: 100,
                        dialogbox_message:
                            'New Item Details Added Successfully!',
                        dialogbox_severity: 'success',
                    })
                } else {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: res.data.message,
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
        window.location.reload(false);
    }

    componentDidMount() {}

    render() {
        const { classes } = this.props
        let isEmpty = !!!this.state.files.length
        return (
            <div>
                <div className="m-sm-30">
                    <SimpleCard title="">
                        <Typography className="" variant="h4">
                            Add New Item
                        </Typography>
                        <div className="w-full overflow-auto mt-5">
                            {/* Form */}
                            <ValidatorForm
                                onSubmit={this.formSubmit}
                                className={classes.formContainer}
                            >
                                <Grid container spacing={2}>
                                    {/* section 1 */}
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
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
                                                        this.state.formData.name
                                                    }
                                                    onChange={(e) =>
                                                        this.handleChange(e)
                                                    }
                                                    validators={['required']}
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
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'Item Brand is required!',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                Item Category
                                                <Autocomplete
                                                    className="w-full"
                                                    options={item_categories}
                                                    getOptionLabel={(opt) =>
                                                        opt.value
                                                    }
                                                    name="category"
                                                    size="small"
                                                    onChange={(e, v) =>
                                                        this.setSelectedValue(
                                                            'category',
                                                            v == null
                                                                ? null
                                                                : v.value
                                                        )
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            variant="outlined"
                                                            className={
                                                                classes.textStyles
                                                            }
                                                            // label={
                                                            //     'Item Category'
                                                            // }
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

                                            {/* File upload */}
                                            <Grid item xs={12}>
                                                <SimpleCard title="File Upload">
                                                    <div className="flex flex-wrap mb-6">
                                                        <label htmlFor="upload-multiple-file">
                                                            <Fab
                                                                className="capitalize"
                                                                color="primary"
                                                                component="span"
                                                                variant="extended"
                                                            >
                                                                <div className="flex items-center">
                                                                    <Icon className="pr-8">
                                                                        cloud_upload
                                                                    </Icon>
                                                                    <span>
                                                                        Upload
                                                                        Files
                                                                    </span>
                                                                </div>
                                                            </Fab>
                                                        </label>
                                                        <input
                                                            className="hidden"
                                                            onChange={
                                                                this
                                                                    .handleFileSelect
                                                            }
                                                            id="upload-multiple-file"
                                                            type="file"
                                                            multiple
                                                        />
                                                    </div>

                                                    <Card
                                                        className="mb-6"
                                                        elevation={2}
                                                    >
                                                        <div className="p-4">
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                                justify="center"
                                                                alignItems="center"
                                                                direction="row"
                                                            >
                                                                <Grid
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                >
                                                                    Name
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                >
                                                                    Size
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    lg={4}
                                                                    md={4}
                                                                >
                                                                    Actions
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                        <Divider></Divider>

                                                        {isEmpty && (
                                                            <p className="px-4">
                                                                Que is empty
                                                            </p>
                                                        )}

                                                        {this.state.files.map(
                                                            (item, index) => {
                                                                let { file } =
                                                                    item
                                                                return (
                                                                    <div
                                                                        className="px-4 py-4"
                                                                        key={
                                                                            file.name
                                                                        }
                                                                    >
                                                                        <Grid
                                                                            container
                                                                            spacing={
                                                                                2
                                                                            }
                                                                            justify="center"
                                                                            alignItems="center"
                                                                            direction="row"
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                lg={
                                                                                    4
                                                                                }
                                                                                md={
                                                                                    4
                                                                                }
                                                                                sm={
                                                                                    12
                                                                                }
                                                                                xs={
                                                                                    12
                                                                                }
                                                                            >
                                                                                {
                                                                                    file.name
                                                                                }
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                lg={
                                                                                    4
                                                                                }
                                                                                md={
                                                                                    4
                                                                                }
                                                                                sm={
                                                                                    12
                                                                                }
                                                                                xs={
                                                                                    12
                                                                                }
                                                                            >
                                                                                {/* {(file.size /1024 /1024).toFixed()}{' '}MB */}
                                                                                {(
                                                                                    file.size /
                                                                                    1024
                                                                                ).toFixed()}{' '}
                                                                                KB
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                lg={
                                                                                    4
                                                                                }
                                                                                md={
                                                                                    4
                                                                                }
                                                                                sm={
                                                                                    12
                                                                                }
                                                                                xs={
                                                                                    12
                                                                                }
                                                                            >
                                                                                <div>
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        size="small"
                                                                                        className="bg-error"
                                                                                        onClick={() =>
                                                                                            this.handleSingleRemove(
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Remove
                                                                                    </Button>
                                                                                </div>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </div>
                                                                )
                                                            }
                                                        )}
                                                    </Card>
                                                </SimpleCard>
                                            </Grid>
                                            {/* End--- --- File upload */}
                                        </Grid>
                                    </Grid>

                                    {/* section 2 */}
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Grid
                                            container
                                            className="w-full"
                                            alignItems="center"
                                            justify="center"
                                            direction="row"
                                            spacing={2}
                                        >
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
                                                    validators={['minNumber:0']}
                                                    errorMessages={[
                                                        'Please Enter Valid Price',
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

                                    {/* Button section */}
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <div
                                            style={{
                                                textAlign: 'right',
                                            }}
                                        >
                                            <Button
                                                className="mt-2 p-2"
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                size="small"
                                            >
                                                Add Item
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </div>
                    </SimpleCard>

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
                                New Item Details Progress
                            </Typography>
                        </DialogTitle>

                        <DialogContent>
                            <div>
                                <Alert severity={this.state.dialogbox_severity}>
                                    <Typography variant="body2">
                                        {this.state.dialogbox_message}
                                    </Typography>
                                    <MatxProgressBar
                                        className="my-2"
                                        value={this.state.uploadProgress}
                                    />
                                </Alert>
                            </div>

                            <div className="text-center">
                                <Button
                                    className="my-2"
                                    color="primary"
                                    variant="contained"
                                    onClick={this.closeDialogBox}
                                    disabled={this.state.dialogbox_severity === "info" ? true:false}
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

export default withStyles(styles)(AddNewItem)
