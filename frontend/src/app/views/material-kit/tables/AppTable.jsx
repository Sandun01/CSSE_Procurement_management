import React from 'react'
import SimpleTable from './SimpleTable'
import PaginationTable from './PaginationTable'
import { SimpleCard } from 'app/components'

const AppTable = () => {
    return (
        <div className="m-sm-30">
            <SimpleCard title="Simple Table">
                <SimpleTable />
            </SimpleCard>
            <div className="py-3" />
            <SimpleCard title="Pagination Table">
                <PaginationTable />
            </SimpleCard>
        </div>
    )
}

export default AppTable
