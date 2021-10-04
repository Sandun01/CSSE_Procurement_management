import React, { Component } from 'react'

import {
    Avatar,
    Button,
    Card,
    Divider,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Grid,
    Typography,
} from '@material-ui/core'

import UserServices from 'app/services/UserServices'
import SimpleCard from 'app/components/cards/SimpleCard'

const user_data = {
    name: '',
    email: '',
    role: '',
    address: '',
    contactNumber: '',
}
class UserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: user_data,
        }
    }

    //get user details
    getUserData = async () => {
        await UserServices.loggedInUserData()
            .then((res) => {
                // console.log(res)
                const data = res
                this.setState({
                    user: data,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async componentDidMount() {
        await this.getUserData()
    }

    render() {
        return (
            <div className="m-sm-30">
                <SimpleCard>
                    <Typography className="m-5" variant="h4">
                        User Profile
                    </Typography>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justify="center"
                    >
                        <Grid item xs={12} sm={10} md={6} lg={6}>
                            <img
                                className="pt-2"
                                src="/assets/images/userProfile.svg"
                                alt="User_Profile"
                                width="100%"
                                height="70%"
                            />
                        </Grid>

                        <Grid item xs={12} sm={10} md={6} lg={6}>
                            <Card className="pt-2" elevation={2}>
                                <div className="flex-column items-center mb-6">
                                    <Avatar
                                        className="w-84 h-84"
                                        src="/assets/images/faces/10.jpg"
                                    />
                                    <h4 className="mt-4 mb-2">
                                        {this.state.user.name}
                                    </h4>
                                    <small className="text-muted">
                                        Procurement Management System User
                                    </small>
                                </div>

                                <Divider />
                                <Table className="mb-4">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="pl-4">
                                                Name
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {this.state.user.name}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-4">
                                                Email
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {this.state.user.email}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-4">
                                                Contact Number
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {this.state.user.contactNumber}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-4">
                                                Address
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {this.state.user.address}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-4">
                                                Role
                                            </TableCell>
                                            <TableCell>
                                                <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                                                    {this.state.user.role}
                                                </small>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                <div className="flex-column items-start px-4">
                                    <Button className="mb-2" variant="text">
                                        <Icon className="mr-2" fontSize="small">
                                            person
                                        </Icon>{' '}
                                        <b>Login as</b>&ensp;
                                        {this.state.user.role}
                                    </Button>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
                </SimpleCard>
            </div>
        )
    }
}

export default UserProfile
