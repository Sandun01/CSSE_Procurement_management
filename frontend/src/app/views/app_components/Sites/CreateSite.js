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
import SiteServices from 'app/services/SiteServices'
import UserServices from 'app/services/UserServices'

const styles = (theme) => ({
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        padding: 10,
    },
})

const form_data = {
    name: '',
    contactNumber: '',
    address: '',
    siteManager: '',
}

class CreateSite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //data
            formData: form_data,
            site_managers: [],

            //file upload
            dialogbox: false,
            dialogbox_message: '',
            dialogbox_severity: 'success',
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

        await this.createNewSite(data)
    }

    //upload site data to database
    createNewSite = async (data) => {
        // console.log('add site data ===========', data)
        await SiteServices.createNewSite(data)
            .then((res) => {
                // console.log(res)
                if (res.status === 201) {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: 'Site Created Successfully!',
                        uploadProgress: 100,
                        dialogbox: true,
                        dialogbox_message: 'New Site Created Successfully!',
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

    getSupplierData = async () => {

        await UserServices.getAllSiteManagers()
        .then(res =>{
            var users = res.users;
            this.setState({
                site_managers: users,
            })
            // console.log(this.state)
        })
        .catch(error => {
            console.log(error)
        })
    }

    async componentDidMount() {
        //get suppliers
        await this.getSupplierData()
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <div className="m-sm-30">
                    <SimpleCard title="">
                        <Typography className="" variant="h4">
                            Create New Worksites
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
                                        <img
                                            src="/assets/images/createSite.svg"
                                            alt="Site Image"
                                            width="100%"
                                            height="100%"
                                        />
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
                                                Site Name
                                                <TextValidator
                                                    className="mt-2"
                                                    placeholder="Site Name"
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
                                                        'Site Name is Required',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                Site Manager
                                                <Autocomplete
                                                    className="w-full"
                                                    options={
                                                        this.state.site_managers
                                                    }
                                                    getOptionLabel={(opt) =>
                                                        opt.name
                                                    }
                                                    name="siteManager"
                                                    size="small"
                                                    onChange={(e, v) =>
                                                        this.setSelectedValue(
                                                            'siteManager',
                                                            v == null
                                                                ? null
                                                                : v._id
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
                                                            //     'Site Manager'
                                                            // }
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .siteManager
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'Site Manager is required!',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                Site Contact Number
                                                <TextValidator
                                                    className="mt-2"
                                                    placeholder="Site Contact Number"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    type="text"
                                                    name="contactNumber"
                                                    value={
                                                        this.state.formData
                                                            .contactNumber
                                                    }
                                                    onChange={(e) =>
                                                        this.handleChange(e)
                                                    }
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'Site Contact Number is Required',
                                                    ]}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                Site Address
                                                <TextValidator
                                                    className="mt-2"
                                                    placeholder="Site Address"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    type="text"
                                                    multiline
                                                    rows={5}
                                                    name="address"
                                                    value={
                                                        this.state.formData
                                                            .address
                                                    }
                                                    onChange={(e) =>
                                                        this.handleChange(e)
                                                    }
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'Site Address is Required',
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
                                                className="mt-2 p-2"
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                size="small"
                                            >
                                                Create Site
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
                                New Site Details Progress
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

export default withStyles(styles)(CreateSite)
