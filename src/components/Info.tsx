import React from 'react'
import { Heading, Text } from '@contentful/f36-components'

const Info = ({ title, count }: any) => {
  return (
    <div>
        <Heading>{title}</Heading>
        <Text>Total: {count}</Text>
    </div>
  )
}

export default Info