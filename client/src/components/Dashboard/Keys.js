import { Button, Card, H1 } from '@blueprintjs/core';
import React, { useState } from 'react';

export default function Keys({ title, number }) {

    return <Card style={{ minWidth: 100,backgroundColor: '#000', margin: 5,flexDirection: 'column', display: 'flex', color: '#fff', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <p>{title}</p>
        <H1 style={{ margin: 0, padding: 0 }}>{number}</H1>
    </Card>

}
