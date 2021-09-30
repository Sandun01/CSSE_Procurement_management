import React, { Component } from 'react'
import { withStyles, makeStyles } from '@material-ui/styles'

import {
    Typography,
    CircularProgress,
    Grid,
    Button,
    Snackbar,
    //dialog
    Dialog,
    DialogTitle,
    DialogContent,
    //stepper
    StepConnector,
    Stepper,
    Step,
    StepLabel,
} from '@material-ui/core'

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Alert, Autocomplete } from '@material-ui/lab'
import clsx from 'clsx'

import PropTypes from 'prop-types'

import SaveIcon from '@material-ui/icons/Save'
import ReceiptIcon from '@material-ui/icons/Receipt'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import EventAvailableIcon from '@material-ui/icons/EventAvailable'

import { SimpleCard } from '../../../components'
import SiteServices from 'app/services/SiteServices'
import UserServices from 'app/services/UserServices'
import PurchaseOrderServices from 'app/services/PurchaseOrderServices'

import RequisitionItems from './RequisitionItems'

const stepper_steps = ['Basic Details', 'Item Details', 'Confirm']

//Start ----------stepper----------------------
//stepper line styles
const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 20,
    },
    active: {
        '& $line': {
            backgroundColor: '#FB3640',
        },
    },
    completed: {
        '& $line': {
            backgroundColor: '#CC0D17',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#EAEAF0',
        borderRadius: 1,
    },
})(StepConnector)

//stepper icon styles
const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundColor: '#FB3640',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        backgroundColor: '#CC0D17',
    },
})
function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles()
    const { active, completed } = props

    const icons = {
        1: <ReceiptIcon />,
        2: <EventAvailableIcon />,
        3: <CheckCircleIcon />,
    }

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    )
}

ColorlibStepIcon.propTypes = {
    //step is active
    active: PropTypes.bool,

    //mark step as completed
    completed: PropTypes.bool,

    //label displayed in the step icon
    icon: PropTypes.node,
}

//--End ----------stepper----------------------

const styles = (theme) => ({
    productTable: {
        '& small': {
            height: 15,
            width: 50,
            borderRadius: 500,
            boxShadow:
                '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
        },
        '& td': {
            borderBottom: 'none',
        },
        '& td:first-child': {
            paddingLeft: '16px !important',
        },
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

var form_data = {
    title: '',
    site: {},
    requiredDate: '',
    orderItems: [],
}

const c_data = {
    dateTime: '',
    comment_description: '',
    addedUser: '',
}
class CreateRequisition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: '',

            //dialog
            dialogbox: false,
            dialogboxTitle: 'Dialog Box',
            dialogbox_message: '',
            dialogbox_severity: 'success',
            dialogbox_event_path: '',

            //stepper
            activeStep: 0, //max - 2

            //item table data
            loading: true,

            //form data
            formData: form_data,

            //site data
            allSites: [],
            selectedSite: {},

            //data saved
            saved_data_loaded: false,

            //comments
            comment_data: c_data,
        }
    }

    //set input files value
    comment_handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value

        var data = this.state.comment_data

        data[name] = value

        this.setState({
            comment_data: data,
        })

        console.log(this.state)
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

        var array = this.state.allSites;
        var site_data;

        array.forEach(element => {
            if(element._id === v){
                site_data = element
            }
        });

        data[e] = v

        this.setState({
            formData: data,
            selectedSite: site_data,
        })

        console.log(this.state)
    }

    //close snackbar
    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    //close user details dialog box
    closeDialogBox = () => {
        this.setState({
            dialogbox: false,
        })

        if (this.state.dialogbox_event_path) {
            window.location.href = this.state.dialogbox_event_path
        } else {
            window.location.reload(false)
        }
    }

    //create requisition
    createNewRequisition = async (data) => {
        await PurchaseOrderServices.createRequisition(data)
            .then((res) => {
                // console.log(res)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: `Requisition Details Saved Successfully!`,
                })

                //reload data
                this.componentDidMount()
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Error in Saving Requisition Data.`,
                    dialogbox: true,
                    dialogboxTitle: 'Error',
                    dialogbox_event_path: '',
                    dialogbox_message: `Error: ${error}`,
                    dialogbox_severity: 'error',
                    loading: false,
                })
            })
    }

    //form submit 1
    form1_Submit = async (e) => {
        var data = this.state.formData

        await this.createNewRequisition(data)
    }

    //form submit 2 - final form
    form2_Submit = async (e) => {
        console.log(this.state)
        var reqID = this.state.formData._id

        await this.addCommentsAndFinalize(c_data, reqID)
    }

    //Final form
    addCommentsAndFinalize = async(data, reqID) => {

        await PurchaseOrderServices.finalizeForm(data, reqID)
        .then(res => {

            if(res.data.success){
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: res.data.message,
                    dialogbox: true,
                    dialogboxTitle:"Finalized Order Requisition",
                    dialogbox_event_path: '/requisition/my',
                    dialogbox_message: res.data.message,
                    dialogbox_severity: 'success',
                })
            }
            else{
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Error! ${res.data.message}`,
                })
            }
           
        })
        .catch(error => {
            console.log(error)
            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: `Error finalizing order!`,
            })
        })

    }

    //get SITE MANAGER's saved requisition
    getActiveRequisition = async (id) => {
        await PurchaseOrderServices.getCurrentActiveRequisition(id)
            .then((res) => {
                // console.log(res)

                if (res.success) {
                    var requisition = res.requisitions[0]
                    var data = this.state.formData
                    var site_id_saved = requisition.site._id
                    var site_saved = {}

                    //set site to form data
                    data = requisition
                    data['site'] = site_id_saved

                    var arr = this.state.allSites
                    arr.forEach((item) => {
                        if (item._id === site_id_saved) {
                            site_saved = item
                        }
                    })

                    this.setState({
                        activeStep: 1,
                        selectedSite: site_saved,
                        saved_data_loaded: true,
                        formData: data,
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: `Loaded Saved Requisition Details`,
                        loading: false,
                    })
                } else {
                    this.setState({
                        activeStep: 0,
                        saved_data_loaded: false,
                        loading: false,
                    })
                }
                console.log(this.state)
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Error: ${error}`,
                    loading: false,
                })
            })
    }

    //get all SITE MANAGER's worksites
    getWorkSitesAndRequisitions = async () => {
        //get user details
        await UserServices.loggedInUserData()
            .then(async (userRes) => {
                var user = userRes

                //get all sites
                await SiteServices.getAllWorksitesByUserID(user._id).then(
                    async (res) => {
                        // console.log(res)
                        if (res.sites.length > 0) {
                            var sites = res.sites
                            this.setState({
                                allSites: sites,
                            })

                            //get SITE MANAGER's saved requisition
                            await this.getActiveRequisition(user._id)
                        } else {
                            this.setState({
                                snackbar: true,
                                snackbar_severity: 'warning',
                                snackbar_message: `Can't find Worksites Related User`,
                                dialogbox: true,
                                dialogboxTitle:
                                    "You Don't have Assigned Worksites",
                                dialogbox_event_path: '/requisition/my',
                                dialogbox_message:
                                    'Please contact your supervisor to assign a site.',
                                dialogbox_severity: 'warning',
                                loading: false,
                            })
                        }
                    }
                )
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: `Error: ${error}`,
                    loading: false,
                })
            })
    }

    async componentDidMount() {
        //get SITE MANAGER's worksites and get SITE MANAGER's saved requisition
        await this.getWorkSitesAndRequisitions()
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
                    <div>
                        <SimpleCard>
                            <Typography variant="h4">
                                Create Requisition
                            </Typography>
                            {/* Stepper */}
                            <div className="my-5">
                                <Stepper
                                    alternativeLabel
                                    style={{ backgroundColor: 'transparent' }}
                                    activeStep={this.state.activeStep}
                                    connector={<ColorlibConnector />}
                                >
                                    {stepper_steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel
                                                StepIconComponent={
                                                    ColorlibStepIcon
                                                }
                                            >
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </div>

                            {/* --------Stepper step 1 ----------*/}

                            {this.state.activeStep === 0 && (
                                <div>
                                    <div className="w-full mt-10">
                                        {/* Form */}
                                        <ValidatorForm
                                            onSubmit={this.form1_Submit}
                                            className={classes.formContainer}
                                        >
                                            <Grid container spacing={2}>
                                                {/* section 1 */}
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={6}
                                                    lg={6}
                                                >
                                                    <img
                                                        src="/assets/images/createRequisition.svg"
                                                        alt="Site Image"
                                                        width="90%"
                                                        height="90%"
                                                    />
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
                                                            Requisition Title
                                                            <TextValidator
                                                                className="mt-2"
                                                                disabled={
                                                                    this.state
                                                                        .saved_data_loaded
                                                                }
                                                                placeholder="Requisition Title"
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                type="text"
                                                                name="title"
                                                                value={
                                                                    this.state
                                                                        .formData
                                                                        .title
                                                                }
                                                                onChange={(e) =>
                                                                    this.handleChange(
                                                                        e
                                                                    )
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'Site Name is Required',
                                                                ]}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12}>
                                                            Worksite
                                                            <Autocomplete
                                                                className="w-full"
                                                                options={
                                                                    this.state
                                                                        .allSites
                                                                }
                                                                disabled={
                                                                    this.state
                                                                        .saved_data_loaded
                                                                }
                                                                getOptionLabel={(
                                                                    opt
                                                                ) => opt.name}
                                                                name="site"
                                                                size="small"
                                                                onChange={(
                                                                    e,
                                                                    v
                                                                ) =>
                                                                    this.setSelectedValue(
                                                                        'site',
                                                                        v ==
                                                                            null
                                                                            ? null
                                                                            : v._id
                                                                    )
                                                                }
                                                                value={
                                                                    this.state
                                                                        .selectedSite
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
                                                                        // label={
                                                                        //     'Site Manager'
                                                                        // }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .formData
                                                                                .site
                                                                        }
                                                                        validators={[
                                                                            'required',
                                                                        ]}
                                                                        errorMessages={[
                                                                            'Site is required!',
                                                                        ]}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            Required Date
                                                            <TextValidator
                                                                className="mt-2"
                                                                disabled={
                                                                    this.state
                                                                        .saved_data_loaded
                                                                }
                                                                placeholder="Required Date"
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                type="date"
                                                                name="requiredDate"
                                                                value={
                                                                    this.state
                                                                        .formData
                                                                        .requiredDate
                                                                }
                                                                onChange={(e) =>
                                                                    this.handleChange(
                                                                        e
                                                                    )
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'Required Date is Required',
                                                                ]}
                                                            />
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
                                                        {this.state
                                                            .saved_data_loaded ? (
                                                            <Button
                                                                className="mt-2 m-2"
                                                                variant="contained"
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => {
                                                                    var step =
                                                                        this
                                                                            .state
                                                                            .activeStep
                                                                    step++
                                                                    this.setState(
                                                                        {
                                                                            activeStep:
                                                                                step,
                                                                        }
                                                                    )
                                                                }} //remove
                                                            >
                                                                Next
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                className="mt-2 m-2"
                                                                variant="contained"
                                                                color="primary"
                                                                size="small"
                                                                startIcon={
                                                                    <SaveIcon />
                                                                }
                                                                type="submit"
                                                            >
                                                                Save & Continue
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </ValidatorForm>
                                    </div>
                                </div>
                            )}

                            {/* --------Stepper step 2 ----------*/}
                            {this.state.activeStep === 1 && (
                                <div>
                                    {/* Items section */}
                                    <RequisitionItems
                                        data={this.state.formData}
                                    />

                                    <div className="w-full overflow-auto">
                                        <div className="my-2 text-right">
                                            <Button
                                                className="mt-2 m-2"
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    var step =
                                                        this.state.activeStep
                                                    step--
                                                    this.setState({
                                                        activeStep: step,
                                                    })
                                                }} //remove
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                className="mt-2 m-2"
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    var step =
                                                        this.state.activeStep
                                                    step++
                                                    this.setState({
                                                        activeStep: step,
                                                    })
                                                }} //remove
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --------Stepper step 3 ----------*/}
                            {this.state.activeStep === 2 && (
                                <div>
                                    <Typography className="mt-2 mb-10" variant="h5">
                                        Finalize Requisition
                                    </Typography>

                                    {/* Form */}
                                    <ValidatorForm
                                        onSubmit={this.form2_Submit}
                                        className={classes.formContainer}
                                    >
                                        <Grid container spacing={2}>
                                            {/* section 1 */}
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={6}
                                                lg={6}
                                            >
                                                <img
                                                    src="/assets/images/addComment.svg"
                                                    alt="Site Image"
                                                    width="90%"
                                                    height="90%"
                                                />
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
                                                        Comments About
                                                        Requisition
                                                        <TextValidator
                                                            className="mt-2"
                                                            placeholder="Comment"
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            type="text"
                                                            name="comment_description"
                                                            multiline
                                                            rows={8}
                                                            value={
                                                                this.state
                                                                    .comment_data
                                                                    .comment_description
                                                            }
                                                            onChange={(e) =>
                                                                this.comment_handleChange(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Alert severity="info">
                                                            <b>
                                                                I accept terms
                                                                and conditions
                                                                of Procurement
                                                                management
                                                                system and
                                                                certify these
                                                                details as valid
                                                                information.
                                                            </b>
                                                        </Alert>
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
                                                <div className="w-full overflow-auto">
                                                    <div className="my-2 text-right">
                                                        <Button
                                                            className="mt-2 m-2"
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => {
                                                                var step =
                                                                    this.state
                                                                        .activeStep
                                                                step--
                                                                this.setState({
                                                                    activeStep:
                                                                        step,
                                                                })
                                                            }} //remove
                                                        >
                                                            Back
                                                        </Button>
                                                        <Button
                                                            className="mt-2 m-2"
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            type="submit"
                                                        >
                                                            Finish
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </ValidatorForm>
                                </div>
                            )}
                        </SimpleCard>
                    </div>
                )}

                {/* Dialog box and snackbar */}
                <div>
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
                                {this.state.dialogboxTitle}
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

export default withStyles(styles)(CreateRequisition)
