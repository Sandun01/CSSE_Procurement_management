import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'

import { Grid, Snackbar, Button, Typography } from '@material-ui/core'

import { Alert, Autocomplete } from '@material-ui/lab'

import SimpleCard from 'app/components/cards/SimpleCard'
import { user_roles } from '../../../../appData'
import UserServices from 'app/services/UserServices'

const form_data = {
    name: '',
    email: '',
    role: '',
    password: '',
    address: '',
    contactNumber: '',
}

const styles = (theme) => ({
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        padding: 20,
        borderRadius: 10,
    },
})

class RegisterUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //data
            formData: form_data,
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
        // console.log(this.state);

        await UserServices.registerNewUser(this.state.formData)
            .then((res) => {
                // console.log(res)
                if (res.status === 201) {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: 'User Created Successfully!',
                    })
                    setTimeout(() => {
                        window.location.reload(false)
                    }, 2500)
                } else {
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: res.data.message,
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error',
                })
            })
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <div className="m-sm-30">
                    <SimpleCard title="">
                        <Typography className="" variant="h4">
                            Register User
                        </Typography>
                        <div className="w-full overflow-auto mt-5">
                            {/* Form */}
                            <ValidatorForm
                                onSubmit={this.formSubmit}
                                className={classes.formContainer}
                            >
                                <Grid container spacing={4}>
                                    {/* section 1 */}
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <img
                                            src="/assets/images/registration.svg"
                                            alt="RegisterUser"
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
                                                <TextValidator
                                                    className="mt-2 mb-2"
                                                    label="Name"
                                                    placeholder="Name"
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
                                                        'Name is required',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextValidator
                                                    className="mt-2 mb-2"
                                                    label="Email"
                                                    placeholder="Email"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    type="text"
                                                    name="email"
                                                    value={
                                                        this.state.formData
                                                            .email
                                                    }
                                                    onChange={(e) =>
                                                        this.handleChange(e)
                                                    }
                                                    validators={[
                                                        'required',
                                                        'isEmail',
                                                    ]}
                                                    errorMessages={[
                                                        'Email is required',
                                                        'Please enter valid email!',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextValidator
                                                    className="mt-2 mb-2"
                                                    label="Contact Number"
                                                    placeholder="Contact Number"
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.formData
                                                            .contactNumber
                                                    }
                                                    name="contactNumber"
                                                    onChange={(e) => {
                                                        this.handleChange(e)
                                                    }}
                                                    validators={[
                                                        'matchRegexp:^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$',
                                                    ]}
                                                    errorMessages={[
                                                        'Please enter valid Phone Number(Eg:0772345678)',
                                                    ]}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextValidator
                                                    className="mt-2 mb-2"
                                                    placeholder="Address"
                                                    label="Address"
                                                    variant="outlined"
                                                    size="small"
                                                    multiline
                                                    rows={3}
                                                    value={
                                                        this.state.formData
                                                            .address
                                                    }
                                                    name="address"
                                                    onChange={(e) => {
                                                        this.handleChange(e)
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    className="w-full"
                                                    options={user_roles}
                                                    getOptionLabel={(opt) =>
                                                        opt.value
                                                    }
                                                    name="role"
                                                    size="small"
                                                    onChange={(e, v) =>
                                                        this.setSelectedValue(
                                                            'role',
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
                                                            // label={"User Role"}
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .role
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'Role is required!',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextValidator
                                                    className="mt-2 mb-2"
                                                    placeholder="Password"
                                                    label="Password"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    type="password"
                                                    name="password"
                                                    value={
                                                        this.state.formData
                                                            .password
                                                    }
                                                    onChange={(e) =>
                                                        this.handleChange(e)
                                                    }
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'Password is required!',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={12}>
                                                <div
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Button
                                                        className="mt-2 p-2"
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit"
                                                        size="small"
                                                    >
                                                        Register User
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </Grid>
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
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(RegisterUser)
