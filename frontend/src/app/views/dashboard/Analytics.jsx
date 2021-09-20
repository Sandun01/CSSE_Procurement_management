import React, { Fragment } from 'react'
import { Grid, Card, Typography } from '@material-ui/core'
import DoughnutChart from './shared/Doughnut'
import StatCards from './shared/StatCards'
import TopSellingTable from './shared/TopSellingTable'
import RowCards from './shared/RowCards'
import StatCards2 from './shared/StatCards2'
import { useTheme } from '@material-ui/styles'

const Analytics = () => {
    const theme = useTheme()

    return (
        <Fragment>
            <div className="analytics m-sm-30 mt-6">
                <Grid container spacing={3} justify="center" alignItems="center" direction="column">

                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Card>
                            <Typography variant="h4" className="p-5 text-center">
                                Procurement Management Dashboard
                            </Typography>
                            {/* <StatCards /> */}

                            {/* Top Selling Products */}
                            {/* <TopSellingTable /> */}

                            {/* <StatCards2 /> */}

                            {/* <h4 className="card-title text-muted mb-4">
                            Ongoing Projects
                        </h4>
                        <RowCards /> */}
                            <img src="/assets/images/dasboard_pic.svg" width="100%" height="100%" />
                        </Card>

                    </Grid>

                    {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Card className="px-6 py-4 mb-6">
                                <div className="card-title">Traffic Sources</div>
                                <div className="card-subtitle">Last 30 days</div>
                                <DoughnutChart
                                    height="300px"
                                    color={[
                                        theme.palette.primary.dark,
                                        theme.palette.primary.main,
                                        theme.palette.primary.light,
                                    ]}
                                />
                            </Card>
                        </Grid> */}
                </Grid>
            </div>
        </Fragment>
    )
}

export default Analytics
