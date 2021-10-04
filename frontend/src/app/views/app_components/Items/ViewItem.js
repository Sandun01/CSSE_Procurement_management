import React, { Component } from 'react'
import {
    Card,
    Divider,
    Grid,
    Icon,
    Button,
    CircularProgress,
    Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ItemServices from 'app/services/ItemServices'
import UtilServices from 'app/services/UtilServices'

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

    imageBorder: {
        border: '2px solid rgba(var(--primary), 0.67)',
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

const itm_data = {
    name: '',
    brand: '',
    category: '',
    price: 0,
    description: '',
    priceMeasurementUnit: '',
    images: [],
    addedUser: {
        name: '',
    },
    addedUser: {
        name: '',
    },
    updatedUser: {
        name: '',
    },
}

class ViewItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //item details
            noData: false,
            item: itm_data,
            imageList: [],
            selectedImage: '',

            loading: true,
        }
    }

    setSelectedImage = (img) => {
        this.setState({
            selectedImage: img,
        })
    }

    loadItemData = async (id) => {
        await ItemServices.getItemById(id)
            .then((res) => {
                if (res.data.success) {
                    console.log(res.data)

                    var select_img
                    var item = res.data.item
                    var item_images = res.data.item.images

                    var is_empty = UtilServices.isEmptyObject(item_images)

                    if (is_empty == false) {
                        select_img = item_images[0]
                    } else {
                        select_img = '/assets/images/No_images.svg'
                    }

                    this.setState({
                        item: item,
                        imageList: item_images,
                        selectedImage: select_img,
                        loading: false,
                    })
                    console.log(this.state)
                } else {
                    this.setState({
                        noData: true,
                        loading: false,
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({
                    noData: true,
                    loading: false,
                })
            })
    }

    async componentDidMount() {
        // console.log(this.props)
        var id = this.props.match.params.id

        //get item details
        await this.loadItemData(id)
    }

    // navigateToView = () => {
    //     window.location.href = `/items/all`
    // }

    // editItem = () => {
    //     window.location.href = '/items/edit/' + this.state.item._id
    // }

    async componentDidMount() {
        var id = this.props.match.params.id

        await this.loadItemData(id)
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
                    <>
                        {this.state.noData ? (
                            <div className="text-center mt-10">
                                <Typography
                                    className="m-5"
                                    variant="h3"
                                    component="h2"
                                >
                                    Item Not Found
                                </Typography>
                                <img
                                    src="/assets/images/No_images.svg"
                                    alt="Site Image"
                                    width="300px"
                                    height="300px"
                                />
                            </div>
                        ) : (
                            <Card className="px-4 py-6" elevation={3}>
                                <Grid
                                    container
                                    spacing={3}
                                    className={classes.bodyContent}
                                >
                                    <Grid item md={6} xs={12}>
                                        <div className="flex-column justify-center items-center">
                                            <img
                                                className="max-w-full mb-4 max-h-400"
                                                src={this.state.selectedImage}
                                                alt="item"
                                            />
                                            <div className="flex justify-center items-center">
                                                {this.state.imageList.map(
                                                    (imgUrl) => (
                                                        <img
                                                            className={clsx({
                                                                'w-80 mx-2 p-2 border-radius-4': true,
                                                                [classes.imageBorder]:
                                                                    this
                                                                        .selectedImage ===
                                                                    imgUrl,
                                                            })}
                                                            src={imgUrl}
                                                            alt="item"
                                                            key={imgUrl}
                                                            onClick={() =>
                                                                this.setSelectedImage(
                                                                    imgUrl
                                                                )
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <h4 className="mt-0 mb-4">
                                            {this.state.item.name}
                                        </h4>
                                        <p className="text-muted mt-0 mb-2">
                                            CATEGORY: {this.state.item.category}
                                        </p>
                                        <p className="mt-0 mb-4">
                                            <span className="text-muted">
                                                BRAND:{' '}
                                            </span>
                                            <span className="text-primary">
                                                {this.state.item.brand}
                                            </span>
                                        </p>

                                        <Divider className="mb-4" />
                                        <p className="mt-0 mb-2 text-muted">
                                            Price: Rs.{this.state.item.price}
                                        </p>
                                        <p className="mt-0 mb-2 text-muted">
                                            Unit(Price Measurement Unit):{' '}
                                            {
                                                this.state.item
                                                    .priceMeasurementUnit
                                            }
                                        </p>

                                        <Divider className="mb-4" />
                                        <p className="mt-0 mb-2 text-muted">
                                            Item Added By
                                        </p>
                                        <div className="flex items-center mb-4">
                                            <Icon
                                                className="mr-2"
                                                fontSize="small"
                                                color="primary"
                                            >
                                                person
                                            </Icon>
                                            <h5 className="text-primary m-0">
                                                {this.state.item.addedUser
                                                    ? this.state.item.addedUser
                                                          .name
                                                    : 'None'}
                                            </h5>
                                        </div>
                                        <p className="mt-0 mb-2 text-muted">
                                            Item Updated By
                                        </p>

                                        {this.state.item.updatedUser ? (
                                            <div className="flex items-center mb-4">
                                                <Icon
                                                    className="mr-2"
                                                    fontSize="small"
                                                    color="primary"
                                                >
                                                    person
                                                </Icon>
                                                <h5 className="text-primary m-0">
                                                    {
                                                        this.state.item
                                                            .updatedUser.name
                                                    }
                                                </h5>
                                            </div>
                                        ) : (
                                            <div className="flex items-center mb-4">
                                                <h5 className="text-primary m-0">
                                                    None
                                                </h5>
                                            </div>
                                        )}
                                        <Divider className="mb-4" />

                                        <h4 className="mt-0 mb-4">
                                            Specification
                                        </h4>
                                        <p>{this.state.item.description}</p>
                                    </Grid>
                                </Grid>

                                <div style={{ textAlign: 'right' }}>
                                    {/* <Button
                                className="mt-2 p-2 mx-2"
                                variant="outlined"
                                color="primary"
                                onClick={() => this.navigateToView()}
                                size="small"
                            >
                                Back To View
                            </Button> */}
                                    {/* <Button
                                className="mt-2 p-2 mx-2"
                                color="primary"
                                variant="contained"
                                onClick={this.editItem}
                                size="small"
                            >
                                Edit
                            </Button> */}
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </div>
        )
    }
}

export default withStyles(styles)(ViewItem)
